use std::collections::HashMap;
use std::env;

use chrono::Local;
use chrono_tz::Asia::Singapore;
use rusqlite::Connection;
use telegram_bot_api::{
    bot,
    types::{ChatId, InputFile},
};

use market_int_core::{
    model::{self, QuotesError},
    option::{self, ExpiryTimeframe},
    regime::MarketRegime,
    sectors::UNKNOWN_SECTOR,
    symbols,
    tiger::api_caller::Requester,
};

/// Pulls option chains with configurable expiry timeframe, then publishes
/// them to Telegram. Composition of `option::retrieve_option_chains`
/// (retrieval + persistence) and `publish_to_telegram` (scoring + send) —
/// kept together so the CLI's pull arms behave exactly as before the
/// retrieval/publish module split.
pub async fn retrieve_option_chains_with_expiry(
    symbols_file_path: &str,
    side: &model::OptionChainSide,
    conn: &mut Connection,
    expiry_timeframe: ExpiryTimeframe,
    requester: &mut Requester,
    regime: &MarketRegime,
    sectors: &HashMap<String, String>,
) -> model::Result<()> {
    let retrieved =
        option::retrieve_option_chains(symbols_file_path, side, conn, expiry_timeframe, requester)
            .await?;

    publish_to_telegram(
        &retrieved.all_chains,
        &retrieved.sharpe_ratios,
        &retrieved.price_ranges,
        &retrieved.earnings_map,
        &retrieved.price_percentiles,
        &retrieved.trend_data,
        &retrieved.realized_vols,
        sectors,
        retrieved.period,
        regime,
    )
    .await
}

fn load_chains_from_db(
    conn: &mut Connection,
    symbols: &[String],
) -> Vec<model::OptionStrikeCandle> {
    use market_int_core::store::option_chain;

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
    regime: &MarketRegime,
    sectors: &HashMap<String, String>,
) -> model::Result<()> {
    market_int_core::store::option_chain::create_table(&conn)?;
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    let all_chains = load_chains_from_db(&mut conn, &symbols);

    let (sharpe_ratios, price_ranges, price_percentiles, trend_data, realized_vols) =
        option::collect_metrics_from_db(&conn, &symbols);
    let earnings_map = option::collect_earnings(&conn, &symbols);

    // NB: no vol hard-filter — see the live pull path comment in option.rs.
    // The realized vol map is passed through for the caption annotation only.
    publish_to_telegram(
        &all_chains,
        &sharpe_ratios,
        &price_ranges,
        &earnings_map,
        &price_percentiles,
        &trend_data,
        &realized_vols,
        sectors,
        period,
        regime,
    )
    .await
}

/// Formats a Telegram caption from top picks.
fn format_telegram_caption(top_picks: &[model::TopPick], period: usize, regime: &MarketRegime) -> String {
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

        // Vol tier annotation (D2, 2026-07): surfaces the capital-efficiency
        // context without filtering. High-vol names deliver materially higher
        // rate_of_return at matched assignment rate (calibration: at 2% breach,
        // low-vol ~44% ror, mid-vol ~49%, high-vol ~53%). Tier boundaries track
        // the cross-sectional vol terciles (p33≈0.28, p67≈0.38) so the labels
        // are consistent with the backtest research presets.
        let vol_str = pick
            .realized_vol
            .map(|v| {
                let tier = if v >= 0.38 {
                    "🟢"
                } else if v >= 0.28 {
                    "🟡"
                } else {
                    "🔴"
                };
                format!(" | Vol: {} {:.2}", tier, v)
            })
            .unwrap_or_default();

        let sector_str = if pick.sector != UNKNOWN_SECTOR {
            format!(" ({})", pick.sector)
        } else {
            String::new()
        };

        caption.push_str(&format!(
            "{}. {}{sector_str} ${strike:.0}P | Bid: ${bid:.2} / Ask: ${ask:.2} | Return: {:.0}%\n   Score: {:.2} | Sharpe: {:.1}{pctl}{trend_str}{vol_str}\n\n",
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

/// Publishes option chain data to Telegram
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    earnings_map: &HashMap<String, model::EarningsInfo>,
    price_percentiles: &HashMap<String, f64>,
    trend_data: &HashMap<String, (f64, f64)>,
    realized_vols: &HashMap<String, f64>,
    sectors: &HashMap<String, String>,
    period: usize,
    regime: &MarketRegime,
) -> model::Result<()> {
    let (csv, top_picks) = model::option_chain_to_csv_vec(
        all_chains,
        sharpe_ratios,
        price_ranges,
        price_percentiles,
        earnings_map,
        trend_data,
        realized_vols,
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
    let bot = bot::BotApi::new(token, None)
        .await
        .map_err(|e| QuotesError::TelegramError(e.to_string()))?;

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
            return Err(model::QuotesError::TelegramError(err.to_string()));
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
            return Err(model::QuotesError::TelegramError(err.to_string()));
        }
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use market_int_core::model::{EarningsInfo, TopPick};

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
            realized_vol: None,
        }
    }

    #[test]
    fn test_caption_shows_sector_for_known() {
        let picks = vec![
            make_pick(1, "AAPL", "Technology"),
            make_pick(2, "XOM", "Energy"),
        ];
        let regime = MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("AAPL (Technology)"), "caption should show sector: {}", caption);
        assert!(caption.contains("XOM (Energy)"), "caption should show sector: {}", caption);
    }

    #[test]
    fn test_caption_hides_unknown_sector() {
        let picks = vec![
            make_pick(1, "FOO", "Unknown"),
        ];
        let regime = MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("FOO $"), "caption should contain ticker: {}", caption);
        assert!(!caption.contains("(Unknown)"), "caption should NOT show Unknown sector: {}", caption);
    }

    #[test]
    fn test_caption_shows_vol_tier_annotation() {
        // Vol tier (D2): 🟢 high (>=0.38), 🟡 mid (>=0.28), 🔴 low (<0.28).
        // Surfaces capital-efficiency context without filtering. The numeric
        // value follows the tier emoji so the user can apply their own judgment.
        let mut high = make_pick(1, "TSLA", "Consumer Discretionary");
        high.realized_vol = Some(0.62);
        let mut mid = make_pick(2, "AAPL", "Technology");
        mid.realized_vol = Some(0.32);
        let mut low = make_pick(3, "WMT", "Consumer Staples");
        low.realized_vol = Some(0.21);
        let mut unknown = make_pick(4, "FOO", "Unknown");
        unknown.realized_vol = None; // vol couldn't be computed → no annotation

        let picks = vec![high, mid, low, unknown];
        let regime = MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("Vol: 🟢 0.62"), "high-vol tier: {}", caption);
        assert!(caption.contains("Vol: 🟡 0.32"), "mid-vol tier: {}", caption);
        assert!(caption.contains("Vol: 🔴 0.21"), "low-vol tier: {}", caption);
        // Unknown-vol pick (FOO) appears in the caption but with NO "Vol:" annotation
        // on its entry block (the entry spans two lines: header + Score/Sharpe detail).
        let foo_idx = caption.lines().position(|l| l.contains("FOO")).unwrap();
        let foo_block: String = caption
            .lines()
            .skip(foo_idx)
            .take(2)
            .collect::<Vec<_>>()
            .join("\n");
        assert!(
            !foo_block.contains("Vol:"),
            "unknown-vol pick should have no Vol annotation, got block: {}",
            foo_block
        );
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

        let regime = MarketRegime::from_spy_trend(1.05);
        let caption = format_telegram_caption(&picks, 5, &regime);

        assert!(caption.contains("AAPL (Technology)"));
        assert!(!caption.contains("BAR ("));
        assert!(caption.contains("BAR $")); // ticker present but no sector label
        assert!(caption.contains("⚠️ Earnings: AAPL 2026-05-20 (AMC)"));
    }
}
