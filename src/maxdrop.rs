use crate::{
    atr, constants, model,
    store::{self, candle},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    conn: &mut Connection,   // Database connection.
    period: usize,           // Period for max drop calculation (5, 10, 20, etc.).
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the max_drop tables in the database.
    store::max_drop::create_table(conn)?;

    // Iterate over each symbol.
    for symbol in symbols {
        // Fetch candle data for the current symbol from the database.
        let candles = match candle::get_candles(conn, symbol.as_str(), constants::CANDLE_COUNT) {
            Ok(candles) => candles,
            Err(_) => {
                log::warn!("No candles found for {}, skipping", symbol);
                continue;
            }
        };

        if candles.is_empty() {
            log::warn!("No candles found for {}, skipping", symbol);
            continue;
        }

        let timestamp = candles.last().unwrap().timestamp;

        // Calculate max drop using rolling windows of the specified period.
        // Rolling windows capture drops that span across chunk boundaries,
        // producing accurate worst-case drawdown estimates.
        let max_drops: Vec<f64> = candles
            .windows(period)
            .map(|window| calculate_max_drop(window))
            .filter(|&drop| drop > 0.0)
            .collect();

        // Need at least 2 samples for meaningful statistics
        if max_drops.len() >= 2 {
            let ema_window = std::cmp::min(5, max_drops.len()) as u32; // Use smaller window if not enough data
            let ema_drop = atr::exponential_moving_average(&max_drops, ema_window);
            let percentile_drop = atr::percentile(&max_drops, constants::PERCENTILE)?;

            // Save the specific period data
            store::max_drop::save_max_drop_period(
                conn,
                &symbol,
                period,
                percentile_drop,
                ema_drop,
                timestamp,
            )?;

            log::info!(
                "Calculated {}-day max drop for {}: percentile={:.4}, ema={:.4}",
                period,
                symbol,
                percentile_drop,
                ema_drop
            );
        } else {
            log::warn!(
                "Not enough {}-day rolling samples for {}, need at least 2, found {}",
                period,
                symbol,
                max_drops.len()
            );
        }
    }

    log::info!("Completed max drop calculation for period {}", period);
    Ok(())
}

fn calculate_max_drop(candles: &[model::Candle]) -> f64 {
    // Return 0.0 if the vector of candles is empty to prevent panicking.
    if candles.is_empty() {
        return 0.0;
    }

    let mut max_drop: f64 = 0.0;
    // Initialize the peak with the high price of the first candle.
    let mut peak = candles[0].high;
    let mut trough = candles[0].low;
    // Iterate through the candles starting from the second one.
    // The first candle is used to initialize the peak.
    for candle in candles.iter().skip(1) {
        // Update the peak if the current candle's high is higher than the current peak.
        // The drop is always relative to a past high.
        peak = peak.max(candle.high);
        trough = trough.min(candle.low);

        // Calculate the drop from the current peak to the current candle's low.
        let current_drop = peak - candle.low;

        // Update the maximum drop if the current drop is greater.
        max_drop = max_drop.max(current_drop);
    }

    max_drop / trough
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::Candle;

    fn make_candle(high: f64, low: f64, close: f64) -> Candle {
        Candle {
            symbol: "TEST".to_string(),
            open: close, // not used by calculate_max_drop
            high,
            low,
            close,
            volume: 0,
            timestamp: 0,
        }
    }

    /// Helper: compute rolling max drops from a slice of candles with the given period.
    fn rolling_max_drops(candles: &[Candle], period: usize) -> Vec<f64> {
        candles
            .windows(period)
            .map(|w| calculate_max_drop(w))
            .filter(|&d| d > 0.0)
            .collect()
    }

    #[test]
    fn test_rolling_captures_cross_chunk_drop() {
        // 7 candles, period=5. Non-overlapping chunks would give windows [0..5] and [5..7].
        // The drop spans the boundary (peak at index 2, trough at index 6).
        // Rolling windows must capture the full drop.
        let candles = vec![
            make_candle(100.0, 98.0, 99.0),   // 0
            make_candle(102.0, 100.0, 101.0),  // 1
            make_candle(110.0, 108.0, 109.0),  // 2: peak
            make_candle(105.0, 100.0, 101.0),  // 3
            make_candle(100.0, 95.0, 96.0),    // 4
            make_candle(92.0, 88.0, 89.0),     // 5: cross-chunk drop continues
            make_candle(90.0, 87.0, 88.0),     // 6: trough
        ];

        let drops = rolling_max_drops(&candles, 5);
        assert!(!drops.is_empty(), "should have rolling windows");
        let max = drops.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
        // Best window is [2..7]: peak=110, trough=87 → (110-87)/87 ≈ 0.2644
        assert!(
            (max - 0.2644).abs() < 0.01,
            "max rolling drop should be ~0.2644, got {:.4}",
            max
        );
    }

    #[test]
    fn test_rolling_produces_more_samples_than_chunks() {
        // 10 candles, period=3
        // Non-overlapping chunks → 3 windows (indices 0-2, 3-5, 6-8, partial 9)
        // Rolling windows → 8 windows (0-2, 1-3, 2-4, ..., 7-9)
        let candles: Vec<Candle> = (0..10)
            .map(|i| make_candle(100.0 - i as f64, 98.0 - i as f64, 99.0 - i as f64))
            .collect();

        let drops = rolling_max_drops(&candles, 3);
        // 10 candles, period 3 → 8 windows. Some may be filtered (drop == 0), so <= 8.
        assert!(
            drops.len() <= 8,
            "rolling should produce at most candles.len() - period + 1 = 8 samples, got {}",
            drops.len()
        );
    }

    #[test]
    fn test_rolling_no_drops_when_flat() {
        // Use high == low so calculate_max_drop returns 0 (no price range)
        let candles: Vec<Candle> = (0..5)
            .map(|_| make_candle(100.0, 100.0, 100.0))
            .collect();

        let drops = rolling_max_drops(&candles, 5);
        // All identical with no range → all drops are 0, filtered out
        assert!(
            drops.is_empty(),
            "flat candles with no range should produce no drops, got {:?}",
            drops
        );
    }
}
