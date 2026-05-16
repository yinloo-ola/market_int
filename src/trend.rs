use crate::{
    atr, constants, model,
    store::{self, candle},
    symbols,
};
use rusqlite::Connection;

/// Calculates EMA-based trend ratios for all symbols and saves to DB.
pub fn calculate_and_save(
    symbols_file_path: &str,
    conn: &mut Connection,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    store::trend::create_table(conn)?;

    for symbol in symbols {
        // Need at least EMA_LONG_PERIOD candles for meaningful calculation
        let candles = match candle::get_candles(conn, &symbol, constants::EMA_LONG_PERIOD) {
            Ok(candles) if candles.len() >= constants::EMA_LONG_PERIOD as usize => candles,
            Ok(_) => {
                log::warn!(
                    "Not enough candles for trend calculation on {}, skipping",
                    symbol
                );
                continue;
            }
            Err(_) => {
                log::warn!("No candles found for {}, skipping", symbol);
                continue;
            }
        };

        let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
        let timestamp = candles.last().unwrap().timestamp;

        // Calculate EMAs using the existing EMA function from atr module
        let ema_short = atr::exponential_moving_average(&closes, constants::EMA_SHORT_PERIOD);
        let ema_long = atr::exponential_moving_average(&closes, constants::EMA_LONG_PERIOD);

        let current_price = closes.last().unwrap();
        let trend_ratio_short = current_price / ema_short;
        let trend_ratio_long = current_price / ema_long;

        store::trend::save_trend(
            conn,
            &symbol,
            ema_short,
            ema_long,
            trend_ratio_short,
            trend_ratio_long,
            timestamp,
        )?;

        log::info!(
            "Calculated trend for {}: EMA{}={:.2}, EMA{}={:.2}, ratio_short={:.4}, ratio_long={:.4}",
            symbol,
            constants::EMA_SHORT_PERIOD,
            ema_short,
            constants::EMA_LONG_PERIOD,
            ema_long,
            trend_ratio_short,
            trend_ratio_long,
        );
    }

    log::info!("Completed trend calculation");
    Ok(())
}

/// Calculates trend ratios from a slice of close prices.
/// Returns (trend_ratio_short, trend_ratio_long) = (price/EMA20, price/EMA50).
pub fn calculate_trend_ratios(closes: &[f64]) -> (f64, f64) {
    let ema_short = atr::exponential_moving_average(closes, constants::EMA_SHORT_PERIOD);
    let ema_long = atr::exponential_moving_average(closes, constants::EMA_LONG_PERIOD);
    let price = closes.last().unwrap();
    (price / ema_short, price / ema_long)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Generate a simple trending price series.
    /// Starts at `start`, increments by `step` each day for `count` days.
    fn generate_trending_closes(start: f64, step: f64, count: usize) -> Vec<f64> {
        (0..count).map(|i| start + step * i as f64).collect()
    }

    #[test]
    fn test_trend_ratios_uptrend() {
        // Strong uptrend: 60 days, starting at 100, +1 per day
        let closes = generate_trending_closes(100.0, 1.0, 60);
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price (159) should be well above both EMAs
        assert!(ratio_short > 1.0, "short ratio should be > 1.0 in uptrend, got {}", ratio_short);
        assert!(ratio_long > 1.0, "long ratio should be > 1.0 in uptrend, got {}", ratio_long);
    }

    #[test]
    fn test_trend_ratios_downtrend() {
        // Downtrend: 60 days, starting at 200, -2 per day
        let closes = generate_trending_closes(200.0, -2.0, 60);
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price (82) should be well below both EMAs
        assert!(ratio_short < 1.0, "short ratio should be < 1.0 in downtrend, got {}", ratio_short);
        assert!(ratio_long < 1.0, "long ratio should be < 1.0 in downtrend, got {}", ratio_long);
        assert!(ratio_short < 0.98, "short ratio should trigger filter (< 0.98), got {}", ratio_short);
        assert!(ratio_long < 0.98, "long ratio should trigger filter (< 0.98), got {}", ratio_long);
    }

    #[test]
    fn test_trend_ratios_flat() {
        // Flat prices: all 100.0 for 60 days
        let closes = vec![100.0; 60];
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price equals both EMAs → ratio should be exactly 1.0
        assert!((ratio_short - 1.0).abs() < 0.01, "flat prices should give ratio ~1.0, got {}", ratio_short);
        assert!((ratio_long - 1.0).abs() < 0.01, "flat prices should give ratio ~1.0, got {}", ratio_long);
    }

    #[test]
    fn test_trend_ratios_recent_drop() {
        // Stock was at 150 for a long time, then drops to 130 in last 10 days
        let mut closes = vec![150.0; 50];
        for i in 0..10 {
            closes.push(150.0 - 2.0 * (i + 1) as f64); // 148, 146, ... 130
        }
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // EMA20 should react to recent drop → ratio_short < 1.0
        assert!(ratio_short < 1.0, "recent drop should push short ratio below 1.0, got {}", ratio_short);
        // EMA50 still near 150 → ratio_long should be very low
        assert!(ratio_long < 0.95, "recent drop should push long ratio well below 1.0, got {}", ratio_long);
    }
}
