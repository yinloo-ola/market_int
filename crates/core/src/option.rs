use chrono::{DateTime, Datelike, Days, Local, NaiveDate, TimeZone, Timelike, Weekday};
use chrono_tz::America::New_York;
use csv::Writer;
use rusqlite::Connection;


use std::collections::{HashMap, HashSet};

use crate::{
    constants,
    model,
    pipeline::{PipelineEvent, ProgressReporter, Stage},
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
/// The drop stats are scaled from their native `period` to the option's DTE by
/// `√(DTE/period)` (max drawdown grows ~as the square root of the horizon).
/// Trend tightening is applied only to the upper bound (strike_to),
/// keeping the lower bound (strike_from) un-tightened so more lower strikes are available.
pub fn calculate_adjusted_strike_range(
    underlying_price: f64,
    percentile_drop: f64,
    ema_drop: f64,
    dte: u32,
    period: usize,
    trend_factor: f64,
) -> (f64, f64) {
    let effective_dte = dte.max(1);
    // √(DTE/period): max drawdown grows ~as the square root of the horizon
    // (zero-drift Brownian motion), not linearly. Linear scaling overstates
    // drops for longer expiries and understates them for shorter ones.
    let adjustment_factor = (effective_dte as f64 / period as f64).sqrt();

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

/// Everything one retrieval's batch loop produced: the saved chains plus the
/// underlyings whose batch failed at the API level (chunk granularity — an
/// expired/failed batch costs all its symbols their strikes this run).
pub(crate) struct BatchedChains {
    pub chains: Vec<model::OptionStrikeCandle>,
    pub failed_symbols: Vec<String>,
}

async fn fetch_option_chains_in_batches(
    symbols: &[String],
    conn: &mut Connection,
    side: &model::OptionChainSide,
    period: usize,
    expiry_timeframe: ExpiryTimeframe,
    requester: &mut Requester,
    progress: &ProgressReporter,
) -> model::Result<BatchedChains> {
    let mut all_chains: Vec<model::OptionStrikeCandle> = Vec::with_capacity(100);
    let mut failed_symbols: Vec<String> = Vec::new();
    let total_batches = symbols.len().div_ceil(constants::API_BATCH_SIZE);
    let stage = if expiry_timeframe == ExpiryTimeframe::Short {
        Stage::ChainsShort
    } else {
        Stage::ChainsMedium
    };
    // Emitted after every chunk attempt so the progress bar advances even
    // when a batch fails.
    let emit_batch_done = |done: usize| {
        progress.emit(PipelineEvent::BatchDone {
            stage,
            done,
            total: total_batches,
        });
    };

    for (batch_no, chunk) in symbols.chunks(constants::API_BATCH_SIZE).enumerate() {
        let symbols_for_expiry: Vec<&str> = chunk.iter().map(|s| s.as_str()).collect();

        let expirations = match requester.option_expiration(&symbols_for_expiry).await {
            Ok(expirations) => expirations,
            Err(e) => {
                log::error!("Failed to get option expirations for batch. Err: {}", e);
                for symbol in &symbols_for_expiry {
                    log::error!("Failed symbol in batch: {}", symbol);
                }
                failed_symbols.extend(chunk.iter().cloned());
                emit_batch_done(batch_no + 1);
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
                    failed_symbols.extend(chunk.iter().cloned());
                    emit_batch_done(batch_no + 1);
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
                failed_symbols.extend(symbol_strike_ranges.iter().map(|(s, _)| (*s).to_string()));
            }
        }

        emit_batch_done(batch_no + 1);
    }

    Ok(BatchedChains {
        chains: all_chains,
        failed_symbols,
    })
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

/// Fetches the earnings calendar for `[from, to]` from Tiger and writes it to
/// `output` as CSV (`symbol,report_date,report_time,expected_eps`) — the format
/// the backtest's `--earnings` flag consumes. Best-effort over whatever Tiger
/// returns for the window (it may be forward-looking only, so historical
/// backtests may get sparse data — the backtest then runs earnings-blind).
pub async fn fetch_earnings_to_file(
    requester: &mut Requester,
    from: NaiveDate,
    to: NaiveDate,
    output: &str,
) -> model::Result<usize> {
    let from_ny = ny_at(from, 0, 0, 0);
    let to_ny = ny_at(to, 23, 59, 59);
    let entries = requester.query_earnings_calendar("US", &from_ny, &to_ny).await?;
    let file = std::fs::File::create(output)?;
    let mut writer = Writer::from_writer(file);
    writer
        .write_record(["symbol", "report_date", "report_time", "expected_eps"])
        .map_err(model::QuotesError::CsvError)?;
    for e in &entries {
        let eps = e.expected_eps.map(|v| v.to_string()).unwrap_or_default();
        writer
            .write_record([e.symbol.as_str(), e.report_date.as_str(), e.report_time.as_str(), eps.as_str()])
            .map_err(model::QuotesError::CsvError)?;
    }
    writer.flush()?;
    Ok(entries.len())
}

/// Builds a New-York `DateTime` at the given (always-valid) time of day. Midnight
/// and end-of-day never fall in a DST fold, so the conversion is unambiguous.
fn ny_at(d: NaiveDate, h: u32, m: u32, s: u32) -> NewYorkDateTime {
    New_York
        .from_local_datetime(&d.and_hms_opt(h, m, s).unwrap())
        .single()
        .unwrap()
}

/// Everything one timeframe's chain retrieval produced, ready for scoring
/// and/or publishing: all retrieved chains plus the per-symbol metric maps
/// and the earnings snapshot fetched mid-run (already persisted to the DB).
/// The publish half (`publish.rs`) consumes this; so will the webapp.
pub struct RetrievedData {
    pub all_chains: Vec<model::OptionStrikeCandle>,
    pub sharpe_ratios: HashMap<String, f64>,
    pub price_ranges: HashMap<String, model::PutPriceRange>,
    pub price_percentiles: HashMap<String, f64>,
    pub trend_data: HashMap<String, (f64, f64)>,
    pub realized_vols: HashMap<String, f64>,
    pub earnings_map: HashMap<String, model::EarningsInfo>,
    /// 5 for Short, 20 for Medium — drives scoring windows and captions.
    pub period: usize,
    /// Rows retrieved and persisted this run (= `all_chains.len()`); the
    /// chain stage's `row_count` in the result document.
    pub row_count: usize,
    /// Distinct underlyings with at least one saved strike — the exact
    /// per-timeframe coverage figure (spec §2.4c).
    pub symbols_with_chains: usize,
    /// Underlyings whose API batch failed outright this run (chunk-level
    /// failures only; a symbol whose strikes all filtered out is not here).
    /// Drives the "N symbols failed: …" partial/failed stage text.
    pub api_failed_symbols: Vec<String>,
}

/// Retrieves option chains with a configurable expiry timeframe and
/// persists them (chains + earnings snapshot), returning everything the
/// publishing/scoring layer needs. No publishing happens here — the CLI's
/// pull arms compose this with its publish module, while the webapp consumes
/// the data directly.
pub async fn retrieve_option_chains(
    symbols_file_path: &str,
    side: &model::OptionChainSide,
    conn: &mut Connection,
    expiry_timeframe: ExpiryTimeframe,
    requester: &mut Requester,
    progress: &ProgressReporter,
) -> model::Result<RetrievedData> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    option_chain::create_table(conn)?;

    let period = if expiry_timeframe == ExpiryTimeframe::Medium {
        20
    } else {
        5
    };

    let batched = fetch_option_chains_in_batches(
        &symbols,
        conn,
        side,
        period,
        expiry_timeframe,
        requester,
        progress,
    )
    .await?;

    let all_chains = batched.chains;
    let row_count = all_chains.len();
    let symbols_with_chains = all_chains
        .iter()
        .map(|c| c.underlying.as_str())
        .collect::<HashSet<_>>()
        .len();
    let api_failed_symbols = batched.failed_symbols;

    let (sharpe_ratios, price_ranges, price_percentiles, trend_data, realized_vols) =
        collect_metrics_from_db(conn, &symbols);

    // NB (2026-07): the universe is NOT hard-filtered by volatility. The bot's
    // output is a research candidate pool (the user applies their own
    // fundamental/sentiment analysis before trading), so dropping low-vol
    // symbols would silently remove research candidates (e.g. AMZN, MSFT, WMT,
    // COST, CME, GS). Instead, each published pick is annotated with its
    // realized vol tier in the Telegram caption — surfacing the capital-
    // efficiency context (high-vol names deliver higher rate_of_return at
    // matched assignment) without removing any candidates. The hard filter
    // remains available as a backtest research preset (`vol-high-only`) and
    // via `constants::MIN_REALIZED_VOL` if a future closed-loop mode wants it.

    let earnings_map = fetch_earnings_map(requester, period).await;

    // Persist the earnings snapshot so the offline re-publish path applies the
    // same earnings-aware scoring as the live run. [T-001]
    if let Err(e) =
        earnings::replace_earnings(conn, &earnings_map, chrono::Utc::now().timestamp() as u32)
    {
        log::warn!("Failed to persist earnings calendar: {}", e);
    }

    Ok(RetrievedData {
        all_chains,
        sharpe_ratios,
        price_ranges,
        price_percentiles,
        trend_data,
        realized_vols,
        earnings_map,
        period,
        row_count,
        symbols_with_chains,
        api_failed_symbols,
    })
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

/// Collects Sharpe ratios for the given symbols from the database.
pub(crate) fn collect_sharpe_ratios(conn: &Connection, symbols: &[String]) -> HashMap<String, f64> {
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

/// Collects per-symbol annualized realized volatility from the latest candles,
/// using the same 20-day log-return stdev formula as the backtest
/// (`stats::estimate_historical_volatility`). Used by the high-vol
/// universe filter (D2) — backtest-validated 2026-07 under the capital-
/// efficiency metric: restricting to high-vol names lifts avg rate_of_return
/// while assignment stays flat or falls.
fn collect_realized_vols(conn: &Connection, symbols: &[String]) -> HashMap<String, f64> {
    let mut vols = HashMap::new();
    for symbol in symbols {
        if symbol == "SPY" {
            continue;
        }
        let candles = match candle::get_candles(conn, symbol, crate::constants::CANDLE_COUNT) {
            Ok(c) if !c.is_empty() => c,
            _ => continue,
        };
        let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
        vols.insert(symbol.clone(), crate::stats::estimate_historical_volatility(&closes, 20));
    }
    vols
}

/// Collects the persisted earnings snapshot for the given symbols (mirrors the
/// other `collect_*` loaders). On a fresh DB with no prior live run the table
/// is empty → returns an empty map (earnings rule is a no-op), matching the
/// previous behavior. [T-001]
pub fn collect_earnings(conn: &Connection, symbols: &[String]) -> HashMap<String, model::EarningsInfo> {
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

pub fn collect_metrics_from_db(
    conn: &Connection,
    symbols: &[String],
) -> (
    HashMap<String, f64>,
    HashMap<String, model::PutPriceRange>,
    HashMap<String, f64>,
    HashMap<String, (f64, f64)>,
    HashMap<String, f64>,
) {
    let sharpe_ratios = collect_sharpe_ratios(conn, symbols);
    let price_ranges = collect_price_ranges(conn, symbols);
    let price_percentiles = collect_price_percentiles(conn, symbols);
    let trend_data = collect_trend_data(conn, symbols);
    let realized_vols = collect_realized_vols(conn, symbols);
    (sharpe_ratios, price_ranges, price_percentiles, trend_data, realized_vols)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_strike_range_no_tightening() {
        // trend_factor = 1.0 → no change to max_strike
        // dte == period → √(5/5) = 1.0 → no scaling
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
        // dte == period → √(5/5) = 1.0 → no drop scaling
        let (min, max) = calculate_adjusted_strike_range(
            100.0, 0.10, 0.05, 5, 5, 0.75,
        );
        // min = 90.0 (unchanged)
        // adjusted_max = 94.905 (same as no_tightening: safety = 0.05 * 0.02 = 0.001)
        // tightened_max = 100 - (100 - 94.905) * 0.75 = 100 - 3.82125 = 96.17875
        assert!((min - 90.0).abs() < 1e-6, "min should be 90.0, got {}", min);
        assert!((max - 96.17875).abs() < 1e-6, "max should be 96.17875, got {}", max);
    }

    #[test]
    fn test_strike_range_tightening_dte_scaled() {
        let (min, max) = calculate_adjusted_strike_range(
            724.66, 0.15, 0.08, 2, 5, 0.75,
        );
        // adj = √(2/5) ≈ 0.6325 (was linear 0.4)
        // perc_drop = 0.15 * 0.6325 = 0.09487, ema_drop = 0.08 * 0.6325 = 0.0506
        // v1 = 724.66 * (1 - 0.0506) = 687.99, v2 = 724.66 * (1 - 0.09487) = 655.91
        // min = 655.91, max = 687.99
        // safety = |0.09487 - 0.0506| * 0.02 = 0.000885, adjusted_max ≈ 687.39
        // tightened_max = 724.66 - (724.66 - 687.39) * 0.75 = 724.66 - 27.96 = 696.70
        assert!((min - 655.9127).abs() < 1e-3, "min should be ~655.9127, got {}", min);
        assert!((max - 696.7042).abs() < 1e-3, "max should be ~696.7042, got {}", max);
    }

    #[test]
    fn test_strike_range_min_unchanged_by_tightening() {
        let (min_no_tighten, _) = calculate_adjusted_strike_range(100.0, 0.10, 0.05, 5, 5, 1.0);
        let (min_tighten, _) = calculate_adjusted_strike_range(100.0, 0.10, 0.05, 5, 5, 0.75);
        assert!((min_no_tighten - min_tighten).abs() < 1e-9,
            "min must be identical regardless of trend_factor: {} vs {}", min_no_tighten, min_tighten);
    }
}