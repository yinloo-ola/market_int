use std::env;

use chrono::{DateTime, Datelike, Days, Local, Timelike, Weekday};
use chrono_tz::{America::New_York, Asia::Singapore};
use rusqlite::Connection;
use std::collections::HashMap;
use telegram_bot_api::{
    bot,
    types::{ChatId, InputFile},
};

use crate::sectors::UNKNOWN_SECTOR;

use crate::{
    constants,
    model::{self, QuotesError},
    store::{candle, earnings, max_drop, option_chain, price_percentile, sharpe_ratio, trend},
    symbols,
    tiger::api_caller::Requester,
};
use tokio::time::{Duration, sleep};

/// Enum to represent different option expiry timeframes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ExpiryTimeframe {
    Short,  // ~5 days (1 week)
    Medium, // ~20 days (4 weeks)
}

type NewYorkDateTime = DateTime<chrono_tz::Tz>;

/// Calculates trading days between two dates, excluding weekends
fn calculate_trading_days_to_expiry(from_date: NewYorkDateTime, to_date: NewYorkDateTime) -> u32 {
    let mut current = from_date;
    let mut trading_days = 0;

    while current < to_date {
        let weekday = current.weekday();
        // Weekday numbering: Mon=1, Tue=2, ..., Sat=6, Sun=0
        if weekday != Weekday::Sat && weekday != Weekday::Sun {
            trading_days += 1;
        }
        current = current + Days::new(1);
    }

    trading_days
}

/// Calculates adjusted strike range based on DTE, period, and trend factor.
/// Trend tightening is applied only to the upper bound (strike_to),
/// keeping the lower bound (strike_from) un-tightened so more lower strikes are available.
pub(crate) fn calculate_adjusted_strike_range(
    underlying_price: f64,
    percentile_drop: f64,
    ema_drop: f64,
    dte: u32,
    period: usize,
    trend_factor: f64,
) -> (f64, f64) {
    let effective_dte = dte.max(1);
    let adjustment_factor = effective_dte as f64 / period as f64;

    // Compute drops without trend tightening
    let adjusted_percentile_drop = percentile_drop * adjustment_factor;
    let adjusted_ema_drop = ema_drop * adjustment_factor;

    // Calculate strike prices
    let v1 = underlying_price * (1.0 - adjusted_ema_drop);
    let v2 = underlying_price * (1.0 - adjusted_percentile_drop);

    let (min_strike, max_strike) = if v1 < v2 { (v1, v2) } else { (v2, v1) };

    // Apply safety range adjustment
    let safety_range = (adjusted_percentile_drop - adjusted_ema_drop).abs() * 0.02;
    let adjusted_max_strike = max_strike * (1.0 - safety_range);

    // Tighten only the upper bound toward current price
    let tightened_max =
        underlying_price - (underlying_price - adjusted_max_strike) * trend_factor;

    (min_strike, tightened_max)
}

/// Configuration for option chain filtering
#[derive(Debug)]
struct OptionChainFilterConfig {
    min_open_interest: u32,
    min_bid_size: u32,
    min_ask_size: u32,
    min_volume: u32,
    min_open_interest_value: u32,
    min_bid_price: f64,
    min_ask_price: f64,
    max_ask_bid_ratio: f64,
}

impl Default for OptionChainFilterConfig {
    fn default() -> Self {
        Self {
            min_open_interest: constants::MIN_OPEN_INTEREST,
            min_bid_size: 3,
            min_ask_size: 3,
            min_volume: 3,
            min_open_interest_value: 3,
            min_bid_price: 0.03,
            min_ask_price: 0.05,
            max_ask_bid_ratio: 5.0,
        }
    }
}

/// Filters option chains based on quality criteria
fn filter_option_chains(
    chains: Vec<model::OptionStrikeCandle>,
    config: &OptionChainFilterConfig,
) -> Vec<model::OptionStrikeCandle> {
    chains
        .into_iter()
        .filter(|chain| {
            // Check size requirements
            if chain.bid_size < config.min_bid_size || chain.ask_size < config.min_ask_size {
                return false;
            }

            // Check volume and open interest
            if chain.volume < config.min_volume
                || chain.open_interest < config.min_open_interest_value
            {
                return false;
            }

            // Check price requirements
            if chain.bid < config.min_bid_price || chain.ask < config.min_ask_price {
                return false;
            }

            // Check bid-ask spread ratio
            if chain.ask > config.max_ask_bid_ratio * chain.bid {
                return false;
            }

            true
        })
        .collect()
}

async fn fetch_option_chains_in_batches(
    symbols: &[String],
    conn: &mut Connection,
    side: &model::OptionChainSide,
    period: usize,
    expiry_timeframe: ExpiryTimeframe,
    requester: &mut Requester,
) -> model::Result<Vec<model::OptionStrikeCandle>> {
    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);

    for chunk in symbols.chunks(10) {
        let symbols_for_expiry: Vec<&str> = chunk.iter().map(|s| s.as_str()).collect();

        let expirations = match requester.option_expiration(&symbols_for_expiry).await {
            Ok(expirations) => expirations,
            Err(e) => {
                log::error!("Failed to get option expirations for batch. Err: {}", e);
                for symbol in &symbols_for_expiry {
                    log::error!("Failed symbol in batch: {}", symbol);
                }
                continue;
            }
        };

        let expiration_date = get_expiration_date(expiry_timeframe);
        let target_date_ny = expiration_date.with_timezone(&New_York);

        sleep(Duration::from_secs(1)).await;

        let expiration_date_ny =
            match Requester::find_nearest_expiration(&expirations, &target_date_ny) {
                Some(expiration_date) => expiration_date,
                None => {
                    log::error!("Failed to find nearest expiration date for batch");
                    for symbol in &symbols_for_expiry {
                        log::error!("Failed symbol in batch: {}", symbol);
                    }
                    continue;
                }
            };

        let current_date_ny = Local::now().with_timezone(&New_York);
        let dte = calculate_trading_days_to_expiry(current_date_ny, expiration_date_ny);
        log::debug!(
            "Trading days to expiry: {} for timeframe: {:?}",
            dte,
            expiry_timeframe
        );

        let mut symbol_strike_ranges: Vec<(&str, (f64, f64))> = Vec::new();
        let mut underlying_prices: HashMap<String, f64> = HashMap::new();

        for symbol in chunk {
            let (percentile_drop, ema_drop) = max_drop::get_max_drop(conn, symbol, period)?;
            let latest_candle = &candle::get_candles(conn, symbol, 1)?[0];
            underlying_prices.insert(symbol.to_string(), latest_candle.close);

            let trend_factor = 1.0;

            let (min_strike, max_strike) = calculate_adjusted_strike_range(
                latest_candle.close,
                percentile_drop,
                ema_drop,
                dte,
                period,
                trend_factor,
            );

            symbol_strike_ranges.push((symbol, (min_strike, max_strike)));
        }

        let chains = requester
            .query_option_chain(
                &symbol_strike_ranges,
                &underlying_prices,
                &expiration_date_ny,
                constants::MIN_OPEN_INTEREST,
                side,
            )
            .await;

        sleep(Duration::from_secs(1)).await;

        match chains {
            Ok(chains) => {
                let filtered_chains =
                    filter_option_chains(chains, &OptionChainFilterConfig::default());

                option_chain::save_option_strike(conn, &filtered_chains)?;
                all_chains.extend(filtered_chains);
            }
            Err(e) => {
                log::error!("Fail to retrieve option chain for batch. Err: {}", e);
                for (symbol, _) in &symbol_strike_ranges {
                    log::error!("Failed symbol in batch: {}", symbol);
                }
            }
        }
    }

    Ok(all_chains)
}

async fn fetch_earnings_map(
    requester: &mut Requester,
    period: usize,
) -> HashMap<String, model::EarningsInfo> {
    let today_ny = Local::now().with_timezone(&New_York);
    let end_date_ny = today_ny + chrono::Duration::days(period as i64 + 7);
    match requester
        .query_earnings_calendar("US", &today_ny, &end_date_ny)
        .await
    {
        Ok(entries) => {
            let mut map = HashMap::new();
            for entry in entries {
                map.insert(
                    entry.symbol.clone(),
                    model::EarningsInfo {
                        report_date: entry.report_date,
                        report_time: entry.report_time,
                        expected_eps: entry.expected_eps,
                    },
                );
            }
            log::info!(
                "Earnings calendar: {} symbols with earnings before {}",
                map.len(),
                end_date_ny.format("%Y-%m-%d")
            );
            map
        }
        Err(e) => {
            log::warn!(
                "Failed to fetch earnings calendar, proceeding without: {}",
                e
            );
            HashMap::new()
        }
    }
}

/// Pulls option chains with configurable expiry timeframe
pub async fn retrieve_option_chains_with_expiry(
    symbols_file_path: &str,
    side: &model::OptionChainSide,
    conn: &mut Connection,
    expiry_timeframe: ExpiryTimeframe,
    requester: &mut Requester,
    regime: &crate::regime::MarketRegime,
    sectors: &HashMap<String, String>,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    option_chain::create_table(conn)?;

    let period = if expiry_timeframe == ExpiryTimeframe::Medium {
        20
    } else {
        5
    };

    let all_chains = fetch_option_chains_in_batches(
        &symbols,
        conn,
        side,
        period,
        expiry_timeframe,
        requester,
    )
    .await?;

    let (sharpe_ratios, price_ranges, price_percentiles, trend_data) =
        collect_metrics_from_db(conn, &symbols);

    let earnings_map = fetch_earnings_map(requester, period).await;

    // Persist the earnings snapshot so the offline re-publish path applies the
    // same earnings-aware scoring as the live run. [T-001]
    if let Err(e) =
        earnings::replace_earnings(conn, &earnings_map, chrono::Utc::now().timestamp() as u32)
    {
        log::warn!("Failed to persist earnings calendar: {}", e);
    }

    publish_to_telegram(
        &all_chains,
        &sharpe_ratios,
        &price_ranges,
        &earnings_map,
        &price_percentiles,
        &trend_data,
        sectors,
        period,
        regime,
    )
    .await
}

/// Days to add from each weekday for Short and Medium timeframes.
/// Indexed by `weekday.num_days_from_sunday()` (Sun=0 .. Sat=6).
const SHORT_DAYS: [u64; 7] = [6, 5, 11, 10, 9, 8, 7];
const MEDIUM_DAYS: [u64; 7] = [27, 26, 25, 31, 30, 29, 28];

/// Calculates the expiration date based on the specified timeframe.
/// For Short timeframe: returns date for ~1 week expiry (5-7 days)
/// For Medium timeframe: returns date for ~4 weeks expiry (20-28 days)
fn get_expiration_date(timeframe: ExpiryTimeframe) -> DateTime<Local> {
    let now = Local::now().with_hour(12).unwrap();
    let table = match timeframe {
        ExpiryTimeframe::Short => &SHORT_DAYS,
        ExpiryTimeframe::Medium => &MEDIUM_DAYS,
    };
    now + Days::new(table[now.weekday().num_days_from_sunday() as usize])
}

fn load_chains_from_db(
    conn: &mut Connection,
    symbols: &[String],
) -> Vec<model::OptionStrikeCandle> {
    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);
    for symbol in symbols {
        match option_chain::retrieve_option_chain(conn, symbol) {
            Ok(chains) => all_chains.extend(chains),
            Err(err) => {
                log::error!("fail to retrieve chain for {}. Error: {}.", symbol, err);
                continue;
            }
        };
    }
    all_chains
}

/// Publishes option chains for already retrieved data
pub async fn publish_option_chains(
    symbols_file_path: &str,
    mut conn: Connection,
    period: usize,
    regime: &crate::regime::MarketRegime,
    sectors: &HashMap<String, String>,
) -> model::Result<()> {
    option_chain::create_table(&conn)?;
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    let all_chains = load_chains_from_db(&mut conn, &symbols);

    let (sharpe_ratios, price_ranges, price_percentiles, trend_data) =
        collect_metrics_from_db(&conn, &symbols);
    let earnings_map = collect_earnings(&conn, &symbols);

    publish_to_telegram(
        &all_chains,
        &sharpe_ratios,
        &price_ranges,
        &earnings_map,
        &price_percentiles,
        &trend_data,
        sectors,
        period,
        regime,
    )
    .await
}

/// Collects Sharpe ratios for the given symbols from the database.
fn collect_sharpe_ratios(conn: &Connection, symbols: &[String]) -> HashMap<String, f64> {
    let mut ratios = HashMap::new();
    for symbol in symbols {
        match sharpe_ratio::get_sharpe_ratio(conn, symbol) {
            Ok(Some(ratio)) => {
                ratios.insert(symbol.clone(), ratio);
            }
            Ok(None) => log::warn!("No Sharpe ratio found for symbol: {}", symbol),
            Err(err) => log::error!("Failed to get Sharpe ratio for {}: {}", symbol, err),
        }
    }
    ratios
}

/// Collects 20-day price ranges for the given symbols from the database.
fn collect_price_ranges(
    conn: &Connection,
    symbols: &[String],
) -> HashMap<String, model::PutPriceRange> {
    let mut ranges = HashMap::new();
    for symbol in symbols {
        match candle::get_candles(conn, symbol, constants::PRICE_PERCENTILE_DAYS) {
            Ok(candles) if !candles.is_empty() => {
                let min_price = candles
                    .iter()
                    .map(|c| c.close)
                    .fold(f64::INFINITY, f64::min);
                let max_price = candles
                    .iter()
                    .map(|c| c.close)
                    .fold(f64::NEG_INFINITY, f64::max);
                ranges.insert(
                    symbol.clone(),
                    model::PutPriceRange {
                        min: min_price,
                        max: max_price,
                    },
                );
            }
            _ => log::warn!("No 20-day candles found for symbol: {}", symbol),
        }
    }
    ranges
}

/// Formats a Telegram caption from top picks.
fn format_telegram_caption(
    top_picks: &[model::TopPick],
    period: usize,
    regime: &crate::regime::MarketRegime,
) -> String {
    let now_singapore = Local::now().with_timezone(&Singapore);
    let date_str = now_singapore.format("%d%b").to_string();

    let mut caption = String::new();
    if !regime.flag.is_empty() {
        caption.push_str(regime.flag);
        caption.push('\n');
    }
    caption.push_str(&format!("🏆 Top 3 Puts — {} {}-day\n\n", date_str, period));

    for pick in top_picks {
        let pctl = pick
            .price_percentile
            .map(|p| format!(" | Pctl: {:.0}%", p * 100.0))
            .unwrap_or_default();

        let trend_str = pick
            .trend_short
            .map(|t| format!(" | Trend: {:.0}%", t * 100.0))
            .unwrap_or_default();

        let sector_str = if pick.sector != UNKNOWN_SECTOR {
            format!(" ({})", pick.sector)
        } else {
            String::new()
        };

        caption.push_str(&format!(
            "{}. {}{sector_str} ${strike:.0}P | Bid: ${bid:.2} / Ask: ${ask:.2} | Return: {:.0}%\n   Score: {:.2} | Sharpe: {:.1}{pctl}{trend_str}\n\n",
            pick.rank,
            pick.underlying,
            pick.rate_of_return * 100.0,
            pick.score,
            pick.sharpe,
            strike = pick.strike,
            bid = pick.bid,
            ask = pick.ask,
        ));
    }

    // Earnings warnings
    let earnings_warnings: Vec<_> = top_picks
        .iter()
        .filter(|p| p.earnings.is_some())
        .map(|p| {
            let e = p.earnings.as_ref().unwrap();
            format!(
                "{} {} ({})",
                p.underlying,
                e.report_date,
                match e.report_time.as_str() {
                    "盘前" => "BMO",
                    "盘后" => "AMC",
                    other => other,
                }
            )
        })
        .collect();

    if !earnings_warnings.is_empty() {
        caption.push_str(&format!("⚠️ Earnings: {}\n", earnings_warnings.join(", ")));
    }

    caption
}

/// Collects price percentiles for the given symbols from the database.
fn collect_price_percentiles(conn: &Connection, symbols: &[String]) -> HashMap<String, f64> {
    let mut percentiles = HashMap::new();
    for symbol in symbols {
        match price_percentile::get_price_percentile(conn, symbol) {
            Ok(Some(p)) => {
                percentiles.insert(symbol.clone(), p);
            }
            Ok(None) => log::warn!("No price percentile found for symbol: {}", symbol),
            Err(err) => log::error!("Failed to get price percentile for {}: {}", symbol, err),
        }
    }
    percentiles
}

/// Collects trend ratios for the given symbols from the database.
fn collect_trend_data(conn: &Connection, symbols: &[String]) -> HashMap<String, (f64, f64)> {
    let mut trends = HashMap::new();
    for symbol in symbols {
        match trend::get_trend(conn, symbol) {
            Ok(Some((short, long))) => {
                trends.insert(symbol.clone(), (short, long));
            }
            Ok(None) => log::warn!("No trend data found for symbol: {}", symbol),
            Err(err) => log::error!("Failed to get trend for {}: {}", symbol, err),
        }
    }
    trends
}

/// Collects the persisted earnings snapshot for the given symbols (mirrors the
/// other `collect_*` loaders). On a fresh DB with no prior live run the table
/// is empty → returns an empty map (earnings rule is a no-op), matching the
/// previous behavior. [T-001]
fn collect_earnings(conn: &Connection, symbols: &[String]) -> HashMap<String, model::EarningsInfo> {
    if let Err(e) = earnings::create_table(conn) {
        log::error!("Failed to ensure earnings table: {}", e);
        return HashMap::new();
    }
    let mut map = HashMap::new();
    for symbol in symbols {
        match earnings::get_earnings(conn, symbol) {
            Ok(Some(info)) => {
                map.insert(symbol.clone(), info);
            }
            Ok(None) => {} // no upcoming earnings for this symbol — normal
            Err(err) => log::error!("Failed to get earnings for {}: {}", symbol, err),
        }
    }
    map
}

fn collect_metrics_from_db(
    conn: &Connection,
    symbols: &[String],
) -> (
    HashMap<String, f64>,
    HashMap<String, model::PutPriceRange>,
    HashMap<String, f64>,
    HashMap<String, (f64, f64)>,
) {
    let sharpe_ratios = collect_sharpe_ratios(conn, symbols);
    let price_ranges = collect_price_ranges(conn, symbols);
    let price_percentiles = collect_price_percentiles(conn, symbols);
    let trend_data = collect_trend_data(conn, symbols);
    (sharpe_ratios, price_ranges, price_percentiles, trend_data)
}

/// Publishes option chain data to Telegram
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    earnings_map: &HashMap<String, model::EarningsInfo>,
    price_percentiles: &HashMap<String, f64>,
    trend_data: &HashMap<String, (f64, f64)>,
    sectors: &HashMap<String, String>,
    period: usize,
    regime: &crate::regime::MarketRegime,
) -> model::Result<()> {
    // Save all_chains to a csv file and upload it to dropbox
    let (csv, top_picks) = model::option_chain_to_csv_vec(
        all_chains,
        sharpe_ratios,
        price_ranges,
        price_percentiles,
        earnings_map,
        trend_data,
        sectors,
        regime,
    )?;

    let now_singapore = Local::now().with_timezone(&Singapore);
    let formatted_date = now_singapore.format("%d%b_%H%M").to_string();
    let filename = format!("/{}_{}day.csv", formatted_date, period);

    let token = env::var("telegram_bot_token")?;
    let chat_id = env::var("telegram_chat_id")?
        .parse::<i64>()
        .map_err(|_| QuotesError::EnvVarNotSet(env::VarError::NotPresent))?;
    let bot = bot::BotApi::new(token, None).await?;

    log::debug!("chat_id {chat_id}");

    let caption = format_telegram_caption(&top_picks, period, regime);

    let resp = bot
        .send_document(telegram_bot_api::methods::SendDocument {
            chat_id: ChatId::IntType(chat_id),
            document: InputFile::FileBytes(filename, csv),
            thumb: None,
            caption: None,
            parse_mode: None,
            caption_entities: None,
            disable_content_type_detection: None,
            disable_notification: None,
            protect_content: None,
            reply_to_message_id: None,
            allow_sending_without_reply: None,
            reply_markup: None,
        })
        .await;

    match resp {
        Ok(_) => log::info!("telegram send doc ok"),
        Err(err) => {
            log::error!("telegram send doc failed: {:?}", err);
            return Err(model::QuotesError::TelegramError(err));
        }
    }

    // Send caption as a separate message (multipart upload escapes newlines in caption)
    let msg_resp = bot
        .send_message(telegram_bot_api::methods::SendMessage {
            chat_id: ChatId::IntType(chat_id),
            text: caption,
            parse_mode: None,
            entities: None,
            disable_web_page_preview: None,
            disable_notification: Some(true),
            protect_content: None,
            reply_to_message_id: None,
            allow_sending_without_reply: None,
            reply_markup: None,
        })
        .await;

    match msg_resp {
        Ok(_) => log::info!("telegram send caption ok"),
        Err(err) => {
            log::error!("telegram send caption failed: {:?}", err);
            return Err(model::QuotesError::TelegramError(err));
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{EarningsInfo, TopPick};

    fn make_pick(rank: usize, underlying: &str, sector: &str) -> TopPick {
        TopPick {
            rank,
            underlying: underlying.to_string(),
            sector: sector.to_string(),
            strike: 100.0,
            bid: 1.50,
            ask: 2.00,
            rate_of_return: 0.35,
            score: 0.85,
            sharpe: 1.5,
            price_percentile: None,
            earnings: None,
            trend_short: None,
            trend_long: None,
        }
    }

    #[test]
    fn test_caption_shows_sector_for_known() {
        let picks = vec![
            make_pick(1, "AAPL", "Technology"),
            make_pick(2, "XOM", "Energy"),
        ];
        let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("AAPL (Technology)"), "caption should show sector: {}", caption);
        assert!(caption.contains("XOM (Energy)"), "caption should show sector: {}", caption);
    }

    #[test]
    fn test_caption_hides_unknown_sector() {
        let picks = vec![
            make_pick(1, "FOO", "Unknown"),
        ];
        let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("FOO $"), "caption should contain ticker: {}", caption);
        assert!(!caption.contains("(Unknown)"), "caption should NOT show Unknown sector: {}", caption);
    }

    #[test]
    fn test_caption_mixed_sectors() {
        let mut pick_known = make_pick(1, "AAPL", "Technology");
        pick_known.earnings = Some(EarningsInfo {
            report_date: "2026-05-20".to_string(),
            report_time: "盘后".to_string(),
            expected_eps: None,
        });
        let pick_unknown = make_pick(2, "BAR", "Unknown");
        let picks = vec![pick_known, pick_unknown];

        let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("AAPL (Technology)"));
        assert!(!caption.contains("BAR ("));
        assert!(caption.contains("BAR $")); // ticker present but no sector label
        assert!(caption.contains("⚠️ Earnings: AAPL 2026-05-20 (AMC)"));
    }

    #[test]
    fn test_strike_range_no_tightening() {
        // trend_factor = 1.0 → no change to max_strike
        let (min, max) = calculate_adjusted_strike_range(
            100.0, 0.10, 0.05, 5, 5, 1.0,
        );
        // v1 = 100 * (1 - 0.05) = 95.0, v2 = 100 * (1 - 0.10) = 90.0
        // min = 90.0, max = 95.0
        // safety = 0.05 * 0.02 = 0.001, adjusted_max = 94.905
        // tightened_max = 100 - (100 - 94.905) * 1.0 = 94.905
        assert!((min - 90.0).abs() < 1e-6, "min should be 90.0, got {}", min);
        assert!((max - 94.905).abs() < 1e-6, "max should be 94.905, got {}", max);
    }

    #[test]
    fn test_strike_range_tightening_only_upper_bound() {
        // trend_factor = 0.75 → max moves toward price, min unchanged
        let (min, max) = calculate_adjusted_strike_range(
            100.0, 0.10, 0.05, 5, 5, 0.75,
        );
        // min = 90.0 (unchanged)
        // tightened_max = 100 - (100 - 94.905) * 0.75 = 100 - 3.82875 = 96.17125
        assert!((min - 90.0).abs() < 1e-6, "min should be 90.0, got {}", min);
        assert!((max - 96.17875).abs() < 1e-6, "max should be 96.17875, got {}", max);
    }

    #[test]
    fn test_strike_range_tightening_dte_scaled() {
        let (min, max) = calculate_adjusted_strike_range(
            724.66, 0.15, 0.08, 2, 5, 0.75,
        );
        // adj = 0.4, perc_drop = 0.06, ema_drop = 0.032
        // v1 = 701.47328, v2 = 681.1804 → min = 681.18, max = 701.47
        // safety = 0.00056, adjusted_max ≈ 701.08
        // tightened_max ≈ 706.93
        assert!((min - 681.1804).abs() < 0.01, "min should be ~681.18, got {}", min);
        assert!((max - 706.975).abs() < 0.01, "max should be ~706.98, got {}", max);
    }

    #[test]
    fn test_strike_range_min_unchanged_by_tightening() {
        let (min_no_tighten, _) = calculate_adjusted_strike_range(100.0, 0.10, 0.05, 5, 5, 1.0);
        let (min_tighten, _) = calculate_adjusted_strike_range(100.0, 0.10, 0.05, 5, 5, 0.75);
        assert!((min_no_tighten - min_tighten).abs() < 1e-9,
            "min must be identical regardless of trend_factor: {} vs {}", min_no_tighten, min_tighten);
    }
}