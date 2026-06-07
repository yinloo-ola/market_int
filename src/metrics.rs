use crate::constants;
use crate::model;
use crate::store;
use crate::symbols;

/// Runs the full metric-calculation pipeline for all symbols.
/// Loads candles once per symbol, slices for each metric's window, saves results.
pub fn run_all(
    symbols_file_path: &str,
    conn: &mut rusqlite::Connection,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Ensure all target tables exist
    store::true_range::create_table(conn)?;
    store::max_drop::create_table(conn)?;
    store::sharpe_ratio::create_table(conn)?;
    store::trend::create_table(conn)?;
    store::price_percentile::create_table(conn)?;

    for symbol in symbols {
        // Load candles once — CANDLE_COUNT is the largest window any metric needs
        let candles = match store::candle::get_candles(conn, &symbol, constants::CANDLE_COUNT) {
            Ok(c) => c,
            Err(_) => {
                log::warn!("No candles for {}, skipping", symbol);
                continue;
            }
        };

        if candles.len() < constants::CANDLE_COUNT as usize {
            log::warn!(
                "Only {} candles for {}, need {}, skipping",
                candles.len(),
                symbol,
                constants::CANDLE_COUNT
            );
            continue;
        }

        let timestamp = candles.last().unwrap().timestamp;

        // ATR — weekly aggregation from full candle set
        save_atr(conn, &symbol, &candles);

        // Max drop — periods 5 and 20, full rolling window
        save_max_drop(conn, &symbol, &candles, timestamp, 5);
        save_max_drop(conn, &symbol, &candles, timestamp, 20);

        // Sharpe ratio
        save_sharpe(conn, &symbol, &candles, timestamp);

        // Trend — last EMA_LONG_PERIOD candles
        let trend_offset = candles.len() - constants::EMA_LONG_PERIOD as usize;
        save_trend(conn, &symbol, &candles[trend_offset..], timestamp);

        // Price percentile — last PRICE_PERCENTILE_DAYS candles
        let pp_offset = candles.len() - constants::PRICE_PERCENTILE_DAYS as usize;
        save_price_percentile(conn, &symbol, &candles[pp_offset..], timestamp);
    }

    log::info!("Completed metric calculation pipeline");
    Ok(())
}

fn save_atr(conn: &mut rusqlite::Connection, symbol: &str, candles: &[model::Candle]) {
    let weekly_candles: Vec<model::Candle> = candles
        .chunks(5)
        .map(|chunk| {
            let open = chunk.first().map_or(0.0, |c| c.open);
            let close = chunk.last().map_or(0.0, |c| c.close);
            let high = chunk
                .iter()
                .map(|c| c.high)
                .max_by(|a, b| a.partial_cmp(b).unwrap())
                .unwrap();
            let low = chunk
                .iter()
                .map(|c| c.low)
                .min_by(|a, b| a.partial_cmp(b).unwrap())
                .unwrap();
            let volume: u64 = chunk.iter().map(|c| c.volume as u64).sum();
            model::Candle {
                symbol: symbol.to_string(),
                open,
                high,
                low,
                close,
                volume: volume as u32,
                timestamp: chunk.first().map_or(0, |c| c.timestamp),
            }
        })
        .collect();

    if weekly_candles.len() < 4 {
        log::warn!("Not enough weekly candles for {}, skipping ATR", symbol);
        return;
    }

    let trs = crate::atr::true_ranges_ratio(&weekly_candles);
    let ema_atr = crate::atr::exponential_moving_average(&trs, 5);
    let percentile_atr = match crate::atr::percentile(&trs, constants::PERCENTILE) {
        Ok(v) => v,
        Err(e) => {
            log::warn!("Failed to compute ATR percentile for {}: {}", symbol, e);
            return;
        }
    };

    let true_range = model::TrueRange {
        symbol: symbol.to_string(),
        percentile_range: percentile_atr,
        ema_range: ema_atr,
        timestamp: weekly_candles.last().unwrap().timestamp,
    };

    if let Err(e) = store::true_range::save_true_ranges(conn, &[true_range]) {
        log::error!("Failed to save ATR for {}: {}", symbol, e);
    }
}

fn save_max_drop(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
    period: usize,
) {
    match crate::maxdrop::compute_max_drop_stats(candles, period) {
        Some((percentile_drop, ema_drop)) => {
            if let Err(e) = store::max_drop::save_max_drop_period(
                conn,
                symbol,
                period,
                percentile_drop,
                ema_drop,
                timestamp,
            ) {
                log::error!("Failed to save max drop for {}: {}", symbol, e);
            }
        }
        None => {
            log::warn!(
                "Not enough {}-day rolling samples for {}, need at least 2",
                period,
                symbol
            );
        }
    }
}

fn save_sharpe(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
) {
    match crate::sharpe::compute_sharpe(candles, constants::DEFAULT_RISK_FREE_RATE) {
        Some(sharpe) => {
            if let Err(e) = store::sharpe_ratio::save_sharpe_ratio(conn, symbol, sharpe, timestamp) {
                log::error!("Failed to save Sharpe for {}: {}", symbol, e);
            }
        }
        None => {
            log::warn!("Failed to compute Sharpe for {}, skipping", symbol);
        }
    }
}

fn save_trend(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
) {
    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();

    let ema_short = crate::atr::exponential_moving_average(&closes, constants::EMA_SHORT_PERIOD);
    let ema_long = crate::atr::exponential_moving_average(&closes, constants::EMA_LONG_PERIOD);
    let price = closes.last().unwrap();
    let trend_ratio_short = price / ema_short;
    let trend_ratio_long = price / ema_long;

    if let Err(e) = store::trend::save_trend(
        conn,
        symbol,
        ema_short,
        ema_long,
        trend_ratio_short,
        trend_ratio_long,
        timestamp,
    ) {
        log::error!("Failed to save trend for {}: {}", symbol, e);
    }
}

fn save_price_percentile(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
) {
    let percentile = crate::price_percentile::compute_price_percentile(candles);
    if let Err(e) = store::price_percentile::save_price_percentiles(
        conn,
        &[model::PricePercentile {
            symbol: symbol.to_string(),
            percentile,
            timestamp,
        }],
    ) {
        log::error!("Failed to save price percentile for {}: {}", symbol, e);
    }
}
