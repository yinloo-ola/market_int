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

        if candles.is_empty() {
            log::warn!("No candles for {}, skipping", symbol);
            continue;
        }

        let timestamp = candles.last().unwrap().timestamp;

        // Max drop — periods 5 and 20, full rolling window
        save_max_drop(conn, &symbol, &candles, timestamp, 5);
        save_max_drop(conn, &symbol, &candles, timestamp, 20);

        // Sharpe ratio
        save_sharpe(conn, &symbol, &candles, timestamp);

        // Trend — last EMA_LONG_PERIOD candles
        if candles.len() >= constants::EMA_LONG_PERIOD as usize {
            let trend_offset = candles.len() - constants::EMA_LONG_PERIOD as usize;
            save_trend(conn, &symbol, &candles[trend_offset..], timestamp);
        } else {
            log::warn!(
                "Not enough candles for trend calculation on {}, skipping",
                symbol
            );
        }

        // Price percentile — last PRICE_PERCENTILE_DAYS candles
        if candles.len() >= constants::PRICE_PERCENTILE_DAYS as usize {
            let pp_offset = candles.len() - constants::PRICE_PERCENTILE_DAYS as usize;
            save_price_percentile(conn, &symbol, &candles[pp_offset..], timestamp);
        } else {
            log::warn!("Not enough candles for price percentile on {}, skipping", symbol);
        }
    }

    log::info!("Completed metric calculation pipeline");
    Ok(())
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
    let (ema_short, ema_long, trend_ratio_short, trend_ratio_long) =
        crate::trend::trend_components(&closes);

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

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::Connection;

    fn in_memory_db() -> Connection {
        Connection::open_in_memory().unwrap()
    }

    /// Build `count` candles for `symbol` with a gentle uptrend starting at `start`.
    /// Timestamps are ascending (0, 1, 2, …) so last().timestamp == count-1.
    fn make_candles(symbol: &str, count: usize, start: f64) -> Vec<model::Candle> {
        (0..count)
            .map(|i| {
                let close = start + i as f64;
                model::Candle {
                    symbol: symbol.to_string(),
                    open: close - 0.5,
                    high: close + 1.0,
                    low: close - 1.0,
                    close,
                    volume: 1000,
                    timestamp: i as u32,
                }
            })
            .collect()
    }

    // ------------------------------------------------------------------
    // save_max_drop
    // ------------------------------------------------------------------

    #[test]
    fn test_save_max_drop_stores_both_periods() {
        let mut conn = in_memory_db();
        store::max_drop::create_table(&conn).unwrap();
        let candles = make_candles("AAPL", 100, 100.0);
        let ts = candles.last().unwrap().timestamp;

        save_max_drop(&mut conn, "AAPL", &candles, ts, 5);
        save_max_drop(&mut conn, "AAPL", &candles, ts, 20);

        let (p5, _) = store::max_drop::get_max_drop(&conn, "AAPL", 5).unwrap();
        let (p20, _) = store::max_drop::get_max_drop(&conn, "AAPL", 20).unwrap();
        assert!(p5 > 0.0, "5-day max drop should be positive");
        assert!(p20 > 0.0, "20-day max drop should be positive");
    }

    #[test]
    fn test_save_max_drop_skips_insufficient_data() {
        let mut conn = in_memory_db();
        store::max_drop::create_table(&conn).unwrap();
        // Only 3 candles — not enough for even period=5 to produce 2 rolling samples
        let candles = make_candles("AAPL", 3, 100.0);
        save_max_drop(&mut conn, "AAPL", &candles, 2, 5);

        // Should not have been saved
        let result = store::max_drop::get_max_drop(&conn, "AAPL", 5);
        assert!(result.is_err(), "should not save with insufficient data");
    }

    // ------------------------------------------------------------------
    // save_sharpe
    // ------------------------------------------------------------------

    #[test]
    fn test_save_sharpe_stores_value() {
        let mut conn = in_memory_db();
        store::sharpe_ratio::create_table(&conn).unwrap();
        let candles = make_candles("AAPL", 100, 100.0);
        let ts = candles.last().unwrap().timestamp;

        save_sharpe(&mut conn, "AAPL", &candles, ts);

        let sharpe = store::sharpe_ratio::get_sharpe_ratio(&conn, "AAPL").unwrap();
        assert!(sharpe.is_some(), "Sharpe should be stored");
    }

    #[test]
    fn test_save_sharpe_skips_insufficient_candles() {
        let mut conn = in_memory_db();
        store::sharpe_ratio::create_table(&conn).unwrap();
        // 5 candles < SHARPE_MIN_CANDLES (14)
        let candles = make_candles("AAPL", 5, 100.0);
        save_sharpe(&mut conn, "AAPL", &candles, 4);

        let sharpe = store::sharpe_ratio::get_sharpe_ratio(&conn, "AAPL").unwrap();
        assert!(sharpe.is_none(), "should not store Sharpe with too few candles");
    }

    // ------------------------------------------------------------------
    // save_trend
    // ------------------------------------------------------------------

    #[test]
    fn test_save_trend_stores_ratios() {
        let mut conn = in_memory_db();
        store::trend::create_table(&conn).unwrap();
        // Exactly EMA_LONG_PERIOD (50) candles in an uptrend
        let candles = make_candles("AAPL", constants::EMA_LONG_PERIOD as usize, 100.0);
        let ts = candles.last().unwrap().timestamp;

        save_trend(&mut conn, "AAPL", &candles, ts);

        let (short, long) = store::trend::get_trend(&conn, "AAPL").unwrap().unwrap();
        assert!(short > 1.0, "uptrend → short ratio > 1.0, got {}", short);
        assert!(long > 1.0, "uptrend → long ratio > 1.0, got {}", long);
    }

    // ------------------------------------------------------------------
    // save_price_percentile
    // ------------------------------------------------------------------

    #[test]
    fn test_save_price_percentile_stores_value() {
        let mut conn = in_memory_db();
        store::price_percentile::create_table(&conn).unwrap();
        // PRICE_PERCENTILE_DAYS (20) candles in uptrend → high percentile
        let candles = make_candles("AAPL", constants::PRICE_PERCENTILE_DAYS as usize, 100.0);
        let ts = candles.last().unwrap().timestamp;

        save_price_percentile(&mut conn, "AAPL", &candles, ts);

        let pp = store::price_percentile::get_price_percentile(&conn, "AAPL").unwrap();
        assert!(pp.is_some(), "price percentile should be stored");
        let val = pp.unwrap();
        assert!(
            (val - 1.0).abs() < 0.01,
            "uptrend with 20 candles → percentile ≈ 1.0, got {}",
            val
        );
    }

    // ------------------------------------------------------------------
    // Gating / slicing guards in run_all
    // ------------------------------------------------------------------

    #[test]
    fn test_run_all_skips_empty_candles() {
        let mut conn = in_memory_db();
        store::candle::create_table(&conn).unwrap();
        store::max_drop::create_table(&conn).unwrap();
        store::sharpe_ratio::create_table(&conn).unwrap();
        store::trend::create_table(&conn).unwrap();
        store::price_percentile::create_table(&conn).unwrap();

        // Symbol is in the file but has ZERO candle rows — exercises the
        // candles.is_empty() continue-branch in run_all.
        let (_dir, path) = seed_symbols_file(&["NOPE"]);

        // run_all must succeed, silently skipping the symbol.
        run_all(&path, &mut conn).unwrap();

        // Nothing should have been written for NOPE.
        assert!(
            store::max_drop::get_max_drop(&conn, "NOPE", 5).is_err(),
            "no max_drop should exist for a symbol with no candles"
        );
        assert!(
            store::sharpe_ratio::get_sharpe_ratio(&conn, "NOPE")
                .unwrap()
                .is_none(),
            "no sharpe should exist for a symbol with no candles"
        );
        assert!(
            store::trend::get_trend(&conn, "NOPE").unwrap().is_none(),
            "no trend should exist for a symbol with no candles"
        );
        assert!(
            store::price_percentile::get_price_percentile(&conn, "NOPE")
                .unwrap()
                .is_none(),
            "no price percentile should exist for a symbol with no candles"
        );
    }

    #[test]
    fn test_run_all_trend_guarded_when_short() {
        let mut conn = in_memory_db();
        store::candle::create_table(&conn).unwrap();
        store::max_drop::create_table(&conn).unwrap();
        store::sharpe_ratio::create_table(&conn).unwrap();
        store::trend::create_table(&conn).unwrap();
        store::price_percentile::create_table(&conn).unwrap();

        // 30 candles: enough for price_percentile (20) and sharpe (14),
        // but NOT enough for trend (EMA_LONG_PERIOD=50)
        let candles = make_candles("AAPL", 30, 100.0);
        store::candle::save_candles(&mut conn, &candles).unwrap();

        let (_dir, path) = seed_symbols_file(&["AAPL"]);

        run_all(&path, &mut conn).unwrap();

        // Trend should NOT have been saved
        let trend = store::trend::get_trend(&conn, "AAPL").unwrap();
        assert!(trend.is_none(), "trend should be skipped with < EMA_LONG_PERIOD candles");

        // But max_drop should have been saved (30 > 5+1)
        let md = store::max_drop::get_max_drop(&conn, "AAPL", 5);
        assert!(md.is_ok(), "max_drop should still be saved");

        // Price percentile should have been saved
        let pp = store::price_percentile::get_price_percentile(&conn, "AAPL").unwrap();
        assert!(pp.is_some(), "price percentile should still be saved");
    }

    #[test]
    fn test_run_all_price_percentile_guarded_when_short() {
        let mut conn = in_memory_db();
        store::candle::create_table(&conn).unwrap();
        store::max_drop::create_table(&conn).unwrap();
        store::sharpe_ratio::create_table(&conn).unwrap();
        store::trend::create_table(&conn).unwrap();
        store::price_percentile::create_table(&conn).unwrap();

        // 10 candles: enough for sharpe (14? no), too few for PP (20) and trend (50)
        // Actually 10 < SHARPE_MIN_CANDLES=14, so sharpe also skipped.
        // Only max_drop period=5 might produce results.
        let candles = make_candles("AAPL", 10, 100.0);
        store::candle::save_candles(&mut conn, &candles).unwrap();

        let (_dir, path) = seed_symbols_file(&["AAPL"]);

        run_all(&path, &mut conn).unwrap();

        // Price percentile should NOT have been saved (need 20, have 10)
        let pp = store::price_percentile::get_price_percentile(&conn, "AAPL").unwrap();
        assert!(pp.is_none(), "price percentile should be skipped with < PRICE_PERCENTILE_DAYS candles");

        // Trend should NOT have been saved (need 50, have 10)
        let trend = store::trend::get_trend(&conn, "AAPL").unwrap();
        assert!(trend.is_none(), "trend should be skipped with < EMA_LONG_PERIOD candles");

        // Sharpe should NOT have been saved (need 14, have 10)
        let sharpe = store::sharpe_ratio::get_sharpe_ratio(&conn, "AAPL").unwrap();
        assert!(sharpe.is_none(), "sharpe should be skipped with < SHARPE_MIN_CANDLES candles");
    }

    #[test]
    fn test_run_all_full_pipeline() {
        let mut conn = in_memory_db();
        store::candle::create_table(&conn).unwrap();
        store::max_drop::create_table(&conn).unwrap();
        store::sharpe_ratio::create_table(&conn).unwrap();
        store::trend::create_table(&conn).unwrap();
        store::price_percentile::create_table(&conn).unwrap();

        let candles = make_candles("AAPL", 100, 100.0);
        store::candle::save_candles(&mut conn, &candles).unwrap();

        let (_dir, path) = seed_symbols_file(&["AAPL"]);

        run_all(&path, &mut conn).unwrap();

        // All four metrics should be saved
        let md5 = store::max_drop::get_max_drop(&conn, "AAPL", 5);
        assert!(md5.is_ok(), "max_drop period 5 should be saved");

        let md20 = store::max_drop::get_max_drop(&conn, "AAPL", 20);
        assert!(md20.is_ok(), "max_drop period 20 should be saved");

        let sharpe = store::sharpe_ratio::get_sharpe_ratio(&conn, "AAPL").unwrap();
        assert!(sharpe.is_some(), "sharpe should be saved");

        let trend = store::trend::get_trend(&conn, "AAPL").unwrap();
        assert!(trend.is_some(), "trend should be saved");

        let pp = store::price_percentile::get_price_percentile(&conn, "AAPL").unwrap();
        assert!(pp.is_some(), "price percentile should be saved");
    }

    /// Creates a unique temp dir, writes `symbols` (one per line) into `symbols.csv`,
    /// and returns the file path alongside the owning `TempDir`. The `TempDir` deletes
    /// itself when dropped, so the caller must keep it alive for the test's duration.
    fn seed_symbols_file(symbols: &[&str]) -> (tempfile::TempDir, String) {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("symbols.csv");
        std::fs::write(&path, symbols.join("\n") + "\n").unwrap();
        (dir, path.to_str().unwrap().to_string())
    }
}
