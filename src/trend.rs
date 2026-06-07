use crate::{atr, constants, model};

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
        assert!(
            ratio_short > 1.0,
            "short ratio should be > 1.0 in uptrend, got {}",
            ratio_short
        );
        assert!(
            ratio_long > 1.0,
            "long ratio should be > 1.0 in uptrend, got {}",
            ratio_long
        );
    }

    #[test]
    fn test_trend_ratios_downtrend() {
        // Downtrend: 60 days, starting at 200, -2 per day
        let closes = generate_trending_closes(200.0, -2.0, 60);
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price (82) should be well below both EMAs
        assert!(
            ratio_short < 1.0,
            "short ratio should be < 1.0 in downtrend, got {}",
            ratio_short
        );
        assert!(
            ratio_long < 1.0,
            "long ratio should be < 1.0 in downtrend, got {}",
            ratio_long
        );
        assert!(
            ratio_short < 0.98,
            "short ratio should trigger filter (< 0.98), got {}",
            ratio_short
        );
        assert!(
            ratio_long < 0.98,
            "long ratio should trigger filter (< 0.98), got {}",
            ratio_long
        );
    }

    #[test]
    fn test_trend_ratios_flat() {
        // Flat prices: all 100.0 for 60 days
        let closes = vec![100.0; 60];
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price equals both EMAs → ratio should be exactly 1.0
        assert!(
            (ratio_short - 1.0).abs() < 0.01,
            "flat prices should give ratio ~1.0, got {}",
            ratio_short
        );
        assert!(
            (ratio_long - 1.0).abs() < 0.01,
            "flat prices should give ratio ~1.0, got {}",
            ratio_long
        );
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
        assert!(
            ratio_short < 1.0,
            "recent drop should push short ratio below 1.0, got {}",
            ratio_short
        );
        // EMA50 still near 150 → ratio_long should be very low
        assert!(
            ratio_long < 0.95,
            "recent drop should push long ratio well below 1.0, got {}",
            ratio_long
        );
    }
}
