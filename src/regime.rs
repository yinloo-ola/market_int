/// SPY-based market regime metrics, computed once per pipeline run.
pub struct MarketRegime {
    pub bearness: f64,        // 0.0 (bull) to 1.0 (bear)
    pub trend_threshold: f64, // 0.98 to 0.92
    pub weight_safety: f64,   // 0.30 to 0.45
    pub weight_trend: f64,    // 0.30 to 0.15
    pub weight_sharpe: f64,   // 0.20 (constant)
    pub weight_return: f64,   // 0.20 (constant)
    pub flag: &'static str,   // "", "⚠️ Correction", "🐻 Bear market"
}

impl MarketRegime {
    /// Compute regime from SPY's trend_ratio_long (price / EMA50).
    pub fn from_spy_trend(spy_trend_long: f64) -> Self {
        let bearness =
            ((1.0 - spy_trend_long).max(0.0) / crate::constants::BEARNESS_MAX).min(1.0);

        let trend_threshold = crate::constants::TREND_THRESHOLD_BULL
            - crate::constants::TREND_THRESHOLD_RANGE * bearness;

        let weight_safety = 0.30 + 0.15 * bearness;
        let weight_trend = 0.30 - 0.15 * bearness;

        let flag = if bearness <= 0.0 {
            ""
        } else if bearness <= 0.50 {
            "⚠️ Correction"
        } else {
            "🐻 Bear market"
        };

        Self {
            bearness,
            trend_threshold,
            weight_safety,
            weight_trend,
            weight_sharpe: 0.20,
            weight_return: 0.20,
            flag,
        }
    }
}

/// Fetch SPY's daily candles and compute trend_ratio_long (price / EMA50).
pub async fn compute_spy_trend(requester: &mut crate::tiger::api_caller::Requester) -> Result<f64, String> {
    let now = chrono::Local::now();
    let candles = requester
        .query_stock_quotes(
            &["SPY"],
            &now,
            crate::constants::EMA_LONG_PERIOD,
            "day",
        )
        .await
        .map_err(|e| format!("Failed to fetch SPY candles: {}", e))?;

    if candles.is_empty() {
        return Err("No SPY candles returned".to_string());
    }

    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();

    if closes.len() < crate::constants::EMA_LONG_PERIOD as usize {
        return Err(format!(
            "Not enough SPY candles (got {}, need {})",
            closes.len(),
            crate::constants::EMA_LONG_PERIOD
        ));
    }

    let ema_long = crate::atr::exponential_moving_average(&closes, crate::constants::EMA_LONG_PERIOD);
    let current_price = closes.last().unwrap();
    let trend_ratio_long = current_price / ema_long;

    log::info!(
        "SPY regime: price={:.2}, EMA{}={:.2}, trend_ratio_long={:.4}",
        current_price,
        crate::constants::EMA_LONG_PERIOD,
        ema_long,
        trend_ratio_long
    );

    Ok(trend_ratio_long)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants;

    #[test]
    fn test_bull_market_no_adjustment() {
        let r = MarketRegime::from_spy_trend(1.04);
        assert!((r.bearness - 0.0).abs() < 1e-9);
        assert!((r.trend_threshold - constants::TREND_THRESHOLD_BULL).abs() < 1e-9);
        assert!((r.weight_safety - 0.30).abs() < 1e-9);
        assert!((r.weight_trend - 0.30).abs() < 1e-9);
        assert!((r.weight_sharpe - 0.20).abs() < 1e-9);
        assert!((r.weight_return - 0.20).abs() < 1e-9);
        assert_eq!(r.flag, "");
    }

    #[test]
    fn test_at_ema_no_adjustment() {
        let r = MarketRegime::from_spy_trend(1.00);
        assert!((r.bearness - 0.0).abs() < 1e-9);
        assert_eq!(r.flag, "");
    }

    #[test]
    fn test_mild_pullback() {
        let r = MarketRegime::from_spy_trend(0.98);
        assert!((r.bearness - 0.25).abs() < 1e-9);
        assert!((r.trend_threshold - 0.965).abs() < 1e-9);
        assert!((r.weight_safety - 0.3375).abs() < 1e-9);
        assert!((r.weight_trend - 0.2625).abs() < 1e-9);
        assert_eq!(r.flag, "⚠️ Correction");
    }

    #[test]
    fn test_correction() {
        let r = MarketRegime::from_spy_trend(0.96);
        // bearness ≈ 0.50 (floating point: 0.5000000000000004)
        assert!((r.bearness - 0.50).abs() < 1e-9);
        assert!((r.trend_threshold - 0.95).abs() < 1e-9);
    }

    #[test]
    fn test_deep_correction() {
        let r = MarketRegime::from_spy_trend(0.94);
        assert!((r.bearness - 0.75).abs() < 1e-9);
        assert!((r.trend_threshold - 0.935).abs() < 1e-9);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_full_bear() {
        let r = MarketRegime::from_spy_trend(0.92);
        assert!((r.bearness - 1.0).abs() < 1e-9);
        assert!((r.trend_threshold - 0.92).abs() < 1e-9);
        assert!((r.weight_safety - 0.45).abs() < 1e-9);
        assert!((r.weight_trend - 0.15).abs() < 1e-9);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_extreme_bear_clamped() {
        let r = MarketRegime::from_spy_trend(0.85);
        assert!((r.bearness - 1.0).abs() < 1e-9);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_weights_always_sum_to_one() {
        for spy_trend in [1.05, 1.00, 0.98, 0.96, 0.94, 0.92, 0.80] {
            let r = MarketRegime::from_spy_trend(spy_trend);
            let sum = r.weight_safety + r.weight_trend + r.weight_sharpe + r.weight_return;
            assert!(
                (sum - 1.0).abs() < 1e-9,
                "weights must sum to 1.0 for spy_trend={}, got {}",
                spy_trend,
                sum
            );
        }
    }

    #[test]
    fn test_flag_boundary_correction_start() {
        let r = MarketRegime::from_spy_trend(1.0 - 0.01 * constants::BEARNESS_MAX);
        assert_eq!(r.flag, "⚠️ Correction");
    }

    #[test]
    fn test_flag_boundary_bear_start() {
        let r = MarketRegime::from_spy_trend(1.0 - 0.51 * constants::BEARNESS_MAX);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_no_flag_at_zero_bearness() {
        let r = MarketRegime::from_spy_trend(1.0);
        assert_eq!(r.flag, "");
    }
}
