use crate::constants;
use crate::model;
use crate::store;
use crate::symbols;

/// Runs the full metric-calculation pipeline for all symbols.
/// Reads symbols once; each metric fetches the candle window it needs.
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
        // ATR (weekly candles, needs CANDLE_COUNT for full window)
        compute_and_save_atr(conn, &symbol);

        // Max drop — periods 5 and 20 (needs CANDLE_COUNT for full rolling window)
        compute_and_save_max_drop(conn, &symbol, 5);
        compute_and_save_max_drop(conn, &symbol, 20);

        // Sharpe ratio
        compute_and_save_sharpe(conn, &symbol);

        // Trend (EMA20/EMA50, needs EMA_LONG_PERIOD)
        compute_and_save_trend(conn, &symbol);

        // Price percentile (20-day window)
        compute_and_save_price_percentile(conn, &symbol);
    }

    log::info!("Completed metric calculation pipeline");
    Ok(())
}

fn compute_and_save_atr(
    conn: &mut rusqlite::Connection,
    symbol: &str,
) {
    // ATR needs the full CANDLE_COUNT of candles — refetch independently
    let full_candles = match store::candle::get_candles(conn, symbol, constants::CANDLE_COUNT) {
        Ok(c) => c,
        Err(_) => {
            log::warn!("No candles for {} ATR, skipping", symbol);
            return;
        }
    };

    if full_candles.is_empty() {
        log::warn!("No candles for {} ATR, skipping", symbol);
        return;
    }

    let weekly_candles: Vec<model::Candle> = full_candles
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
        log::warn!("Not enough candles for {}, skipping ATR", symbol);
        return;
    }

    let trs = crate::atr::true_ranges_ratio(&weekly_candles);
    let ema_atr = crate::atr::exponential_moving_average(&trs, 5);
    let percentile_atr = crate::atr::percentile(&trs, constants::PERCENTILE);

    let percentile_atr = match percentile_atr {
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

fn compute_and_save_max_drop(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    period: usize,
) {
    // Max drop needs CANDLE_COUNT for full rolling window — fetch independently
    let candles = match store::candle::get_candles(conn, symbol, constants::CANDLE_COUNT) {
        Ok(c) => c,
        Err(_) => {
            log::warn!("No candles for {} max drop, skipping", symbol);
            return;
        }
    };

    if candles.is_empty() {
        log::warn!("No candles for {} max drop, skipping", symbol);
        return;
    }

    match crate::maxdrop::compute_max_drop_stats(&candles, period) {
        Some((percentile_drop, ema_drop)) => {
            let timestamp = candles.last().unwrap().timestamp;
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

fn compute_and_save_sharpe(
    conn: &mut rusqlite::Connection,
    symbol: &str,
) {
    let candles = match store::candle::get_candles(conn, symbol, constants::CANDLE_COUNT) {
        Ok(c) => c,
        Err(_) => {
            log::warn!("No candles for {} Sharpe, skipping", symbol);
            return;
        }
    };

    if candles.is_empty() {
        log::warn!("No candles for {} Sharpe, skipping", symbol);
        return;
    }

    match crate::sharpe::compute_sharpe(&candles, constants::DEFAULT_RISK_FREE_RATE) {
        Some(sharpe) => {
            let timestamp = candles.last().unwrap().timestamp;
            if let Err(e) = store::sharpe_ratio::save_sharpe_ratio(conn, symbol, sharpe, timestamp) {
                log::error!("Failed to save Sharpe for {}: {}", symbol, e);
            }
        }
        None => {
            log::warn!("Failed to compute Sharpe for {}, skipping", symbol);
        }
    }
}

fn compute_and_save_trend(
    conn: &mut rusqlite::Connection,
    symbol: &str,
) {
    // Trend needs EMA_LONG_PERIOD candles — fetch independently
    let candles = match store::candle::get_candles(conn, symbol, constants::EMA_LONG_PERIOD) {
        Ok(c) if c.len() >= constants::EMA_LONG_PERIOD as usize => c,
        Ok(_) => {
            log::warn!("Not enough candles for trend on {}, skipping", symbol);
            return;
        }
        Err(_) => {
            log::warn!("No candles for {} trend, skipping", symbol);
            return;
        }
    };

    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
    let timestamp = candles.last().unwrap().timestamp;

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

fn compute_and_save_price_percentile(
    conn: &mut rusqlite::Connection,
    symbol: &str,
) {
    // Price percentile uses PRICE_PERCENTILE_DAYS window — fetch independently
    let candles = match store::candle::get_candles(conn, symbol, constants::PRICE_PERCENTILE_DAYS) {
        Ok(c) => c,
        Err(_) => {
            log::warn!("No candles for {} price percentile, skipping", symbol);
            return;
        }
    };

    if candles.is_empty() {
        log::warn!("No candles for {} price percentile, skipping", symbol);
        return;
    }

    let timestamp = candles.last().unwrap().timestamp;
    let percentile = crate::price_percentile::compute_price_percentile(&candles);
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
