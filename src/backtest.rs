use std::collections::HashMap;

use chrono::{Datelike, Duration, NaiveDate, Weekday};

use crate::{
    constants, maxdrop, model, price_percentile, sharpe, trend,
    store::candle,
};

// ── Black-Scholes ──────────────────────────────────────────────

/// Standard normal CDF using Abramowitz & Stegun approximation (max error ~7.5e-8).
pub fn cumulative_normal(x: f64) -> f64 {
    const A1: f64 = 0.254829592;
    const A2: f64 = -0.284496736;
    const A3: f64 = 1.421413741;
    const A4: f64 = -1.453152027;
    const A5: f64 = 1.061405429;
    const P: f64 = 0.3275911;

    let sign = if x < 0.0 { -1.0 } else { 1.0 };
    let x_abs = x.abs() / std::f64::consts::SQRT_2;

    let t = 1.0 / (1.0 + P * x_abs);
    let y = 1.0 - (((((A5 * t + A4) * t) + A3) * t + A2) * t + A1) * t * (-x_abs * x_abs).exp();

    0.5 * (1.0 + sign * y)
}

/// Black-Scholes put price.
/// S = spot, K = strike, T = years to expiry, r = risk-free rate, q = dividend yield, sigma = volatility.
pub fn black_scholes_put(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> f64 {
    if T <= 0.0 || sigma <= 0.0 || S <= 0.0 || K <= 0.0 {
        return 0.0;
    }
    let d1 = ((S / K).ln() + (r - q + sigma * sigma / 2.0) * T) / (sigma * T.sqrt());
    let d2 = d1 - sigma * T.sqrt();

    K * (-r * T).exp() * cumulative_normal(-d2) - S * (-q * T).exp() * cumulative_normal(-d1)
}

/// Annualized volatility from daily close prices.
/// Uses rolling window of daily log returns, annualized by sqrt(252).
pub fn estimate_historical_volatility(closes: &[f64], window: usize) -> f64 {
    if closes.len() < window + 1 {
        return 0.30; // Default 30% if insufficient data
    }
    let recent = &closes[closes.len() - window - 1..];
    let returns: Vec<f64> = recent.windows(2).map(|w| (w[1] / w[0]).ln()).collect();
    let mean = returns.iter().sum::<f64>() / returns.len() as f64;
    let variance =
        returns.iter().map(|r_val| (r_val - mean).powi(2)).sum::<f64>() / (returns.len() - 1) as f64;
    variance.sqrt() * (252.0_f64).sqrt()
}

/// Matches Tiger API's num_of_weeks calculation.
pub fn num_of_weeks(dte: u32) -> f64 {
    if (5..=7).contains(&dte) {
        1.0
    } else {
        (dte / 7) as f64 + (dte % 7) as f64 / 5.0
    }
}

/// Computes rate_of_return matching Tiger API's formula:
/// rate_of_return = premium / strike / num_of_weeks * 52.0
pub fn compute_rate_of_return(premium: f64, strike: f64, dte: u32) -> f64 {
    let weeks = num_of_weeks(dte);
    premium / strike / weeks * 52.0
}

// ── Configuration ──────────────────────────────────────────────

/// Captures every tunable parameter for the backtest.
/// Each preset represents a hypothesis to test via ablation.
#[derive(Debug, Clone)]
pub struct BacktestConfig {
    pub name: String,
    pub period: usize,

    // Strike range
    pub use_trend_factor: bool,
    pub trend_tighten_multiplier: f64,
    pub trend_tighten_cap: f64,
    pub trend_tighten_peak: f64,
    pub trend_tighten_ease_back: f64,

    // Pre-filters
    pub min_rate_of_return: f64,
    pub max_rate_of_return: f64,
    pub max_strike_percentile: f64,

    // Scoring weights (must sum to 1.0)
    pub weight_sharpe: f64,
    pub weight_safety: f64,
    pub weight_return: f64,
    pub weight_trend: f64,

    // Trend filters
    pub use_trend_short_filter: bool,
    pub use_trend_long_filter: bool,
    pub use_trend_in_score: bool,

    // Regime
    pub use_regime: bool,
    pub trend_threshold_bull: f64,
    pub trend_threshold_range: f64,
    pub bearness_max: f64,

    // Black-Scholes
    pub risk_free_rate: f64,
    pub dividend_yield: f64,
    pub vol_window: usize,
}

impl BacktestConfig {
    /// Current production defaults — the control baseline.
    pub fn control() -> Self {
        Self {
            name: "control".to_string(),
            period: 5,
            use_trend_factor: true,
            trend_tighten_multiplier: constants::TREND_TIGHTEN_MULTIPLIER,
            trend_tighten_cap: constants::TREND_TIGHTEN_CAP,
            trend_tighten_peak: constants::TREND_TIGHTEN_PEAK,
            trend_tighten_ease_back: constants::TREND_EASE_BACK,
            min_rate_of_return: constants::MIN_RATE_OF_RETURN,
            max_rate_of_return: constants::MAX_RATE_OF_RETURN,
            max_strike_percentile: constants::MAX_STRIKE_PERCENTILE,
            weight_sharpe: 0.20,
            weight_safety: 0.30,
            weight_return: 0.20,
            weight_trend: 0.30,
            use_trend_short_filter: true,
            use_trend_long_filter: true,
            use_trend_in_score: true,
            use_regime: true,
            trend_threshold_bull: constants::TREND_THRESHOLD_BULL,
            trend_threshold_range: constants::TREND_THRESHOLD_RANGE,
            bearness_max: constants::BEARNESS_MAX,
            risk_free_rate: 0.045,
            dividend_yield: 0.015,
            vol_window: 20,
        }
    }

    /// No trend factor — strike range never tightened.
    pub fn no_trend_factor() -> Self {
        Self {
            use_trend_factor: false,
            name: "no-trend-factor".to_string(),
            ..Self::control()
        }
    }

    /// No trend_long pre-filter.
    pub fn no_trend_long() -> Self {
        Self {
            use_trend_long_filter: false,
            name: "no-trend-long".to_string(),
            ..Self::control()
        }
    }

    /// No trend in score — redistribute trend weight to safety.
    pub fn no_trend_score() -> Self {
        Self {
            use_trend_in_score: false,
            weight_trend: 0.0,
            weight_safety: 0.60,
            name: "no-trend-score".to_string(),
            ..Self::control()
        }
    }

    /// No regime — always use bull thresholds.
    pub fn no_regime() -> Self {
        Self {
            use_regime: false,
            name: "no-regime".to_string(),
            ..Self::control()
        }
    }

    /// All trend features off — pure sharpe + safety + return.
    pub fn no_trend_at_all() -> Self {
        Self {
            use_trend_factor: false,
            use_trend_short_filter: false,
            use_trend_long_filter: false,
            use_trend_in_score: false,
            use_regime: false,
            weight_trend: 0.0,
            weight_safety: 0.60,
            name: "no-trend-at-all".to_string(),
            ..Self::control()
        }
    }

    /// Looser return filters.
    pub fn wide_return() -> Self {
        Self {
            min_rate_of_return: 0.15,
            max_rate_of_return: 1.0,
            name: "wide-return".to_string(),
            ..Self::control()
        }
    }

    /// Returns all preset configs for ablation testing.
    pub fn all_presets() -> Vec<Self> {
        vec![
            Self::control(),
            Self::no_trend_factor(),
            Self::no_trend_long(),
            Self::no_trend_score(),
            Self::no_regime(),
            Self::no_trend_at_all(),
            Self::wide_return(),
        ]
    }

    /// Look up a preset by name (case-sensitive).
    pub fn by_name(name: &str) -> Option<Self> {
        Self::all_presets().into_iter().find(|p| p.name == name)
    }

    /// Compute trend_factor from trend_ratio_short using config params.
    /// Returns 1.0 if use_trend_factor is false.
    pub fn compute_trend_factor(&self, trend_ratio_short: f64) -> f64 {
        if !self.use_trend_factor {
            return 1.0;
        }
        if trend_ratio_short <= 1.0 {
            return 1.0;
        }

        let cap = self.trend_tighten_cap;
        let peak = self.trend_tighten_peak;

        if trend_ratio_short <= peak {
            let reduction = (trend_ratio_short - 1.0) * self.trend_tighten_multiplier;
            1.0 - reduction.min(cap)
        } else {
            let peak_reduction =
                ((peak - 1.0) * self.trend_tighten_multiplier).min(cap);
            let excess = trend_ratio_short - peak;
            let reduction =
                (peak_reduction - excess * self.trend_tighten_ease_back).max(0.0);
            1.0 - reduction
        }
    }

    /// Build a MarketRegime for this config.
    /// If use_regime is false, always returns bull defaults.
    pub fn build_regime(&self, spy_trend_long: f64) -> crate::regime::MarketRegime {
        if !self.use_regime {
            return crate::regime::MarketRegime::from_spy_trend(1.05); // bull defaults
        }
        crate::regime::MarketRegime::from_spy_trend(spy_trend_long)
    }

    /// Score a put option candidate using config's weights and filters.
    /// Returns None if pre-filters reject.
    pub fn score_candidate(
        &self,
        sharpe: f64,
        strike_percentile: f64,
        rate_of_return: f64,
        trend_ratio_short: f64,
        trend_ratio_long: f64,
        regime: &crate::regime::MarketRegime,
    ) -> Option<f64> {
        // Pre-filters
        if rate_of_return < self.min_rate_of_return
            || rate_of_return > self.max_rate_of_return
        {
            return None;
        }
        if sharpe <= 0.0 {
            return None;
        }
        if strike_percentile > self.max_strike_percentile {
            return None;
        }
        if self.use_trend_short_filter && trend_ratio_short < regime.trend_threshold {
            return None;
        }
        if self.use_trend_long_filter && trend_ratio_long < regime.trend_threshold {
            return None;
        }

        let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
        let safety_norm = 1.0 - strike_percentile.max(0.0);
        let return_norm =
            (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);
        let trend_norm = if self.use_trend_in_score {
            ((trend_ratio_short - regime.trend_threshold) / 0.10).clamp(0.0, 1.0)
        } else {
            0.0
        };

        Some(
            self.weight_sharpe * sharpe_norm
                + self.weight_safety * safety_norm
                + self.weight_return * return_norm
                + self.weight_trend * trend_norm,
        )
    }
}

// ── Tests ──────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cumulative_normal_known_values() {
        // N(0) = 0.5
        assert!((cumulative_normal(0.0) - 0.5).abs() < 1e-7);
        // N(-inf) -> 0, N(+inf) -> 1
        assert!(cumulative_normal(-5.0) < 0.001);
        assert!(cumulative_normal(5.0) > 0.999);
        // N(1) ≈ 0.8413
        assert!((cumulative_normal(1.0) - 0.8413).abs() < 0.001);
        // Symmetry: N(-x) = 1 - N(x)
        let n2 = cumulative_normal(2.0);
        assert!((cumulative_normal(-2.0) - (1.0 - n2)).abs() < 1e-7);
    }

    #[test]
    fn test_bs_put_at_the_money() {
        // ATM put with 1 year, 20% vol, 5% rate, no dividend
        let price = black_scholes_put(100.0, 100.0, 1.0, 0.05, 0.0, 0.20);
        // Should be positive and reasonable (roughly $5-$10)
        assert!(
            price > 0.0,
            "put price should be positive, got {}",
            price
        );
        assert!(
            price < 15.0,
            "put price should be < 15 for 20% vol ATM, got {}",
            price
        );
    }

    #[test]
    fn test_bs_put_deep_otm_is_cheap() {
        // Deep OTM: strike 50, spot 100
        let price = black_scholes_put(100.0, 50.0, 0.04, 0.05, 0.0, 0.20);
        // Should be nearly zero
        assert!(price < 0.01, "deep OTM put should be near 0, got {}", price);
    }

    #[test]
    fn test_bs_put_deep_itm_is_intrinsic() {
        // Deep ITM: strike 150, spot 100, short dated
        let price = black_scholes_put(100.0, 150.0, 0.02, 0.05, 0.0, 0.20);
        let intrinsic = 150.0 - 100.0; // 50
        // Price should be close to discounted intrinsic
        assert!(
            (price - intrinsic).abs() / intrinsic < 0.05,
            "deep ITM put should be near intrinsic, got {} vs {}",
            price,
            intrinsic
        );
    }

    #[test]
    fn test_bs_put_zero_expiry() {
        let price = black_scholes_put(100.0, 90.0, 0.0, 0.05, 0.0, 0.20);
        assert_eq!(price, 0.0, "zero expiry should return 0");
    }

    #[test]
    fn test_bs_put_higher_vol_higher_premium() {
        let low_vol = black_scholes_put(100.0, 90.0, 0.1, 0.05, 0.0, 0.15);
        let high_vol = black_scholes_put(100.0, 90.0, 0.1, 0.05, 0.0, 0.40);
        assert!(
            high_vol > low_vol,
            "higher vol should give higher put premium: {} vs {}",
            high_vol,
            low_vol
        );
    }

    #[test]
    fn test_estimate_volatility_trending() {
        // Simulate realistic daily returns with ~30% annualized vol
        // Using alternating +2%/-1% days gives ~1.5% avg daily move
        let mut closes = vec![100.0];
        for i in 1..31 {
            let ret = if i % 2 == 0 { 0.02 } else { -0.01 };
            closes.push(closes.last().unwrap() * (1.0 + ret));
        }
        let vol = estimate_historical_volatility(&closes, 20);
        // Should be positive and reasonable (20%-60% annualized)
        assert!(
            vol > 0.15 && vol < 0.80,
            "vol should be 15-80% for alternating returns, got {:.4}",
            vol
        );
    }

    #[test]
    fn test_estimate_volatility_insufficient_data() {
        let closes = vec![100.0, 101.0];
        let vol = estimate_historical_volatility(&closes, 20);
        assert_eq!(
            vol, 0.30,
            "should return default 30% for insufficient data"
        );
    }

    #[test]
    fn test_compute_rate_of_return_matches_tiger_formula() {
        // premium=2.50, strike=100, dte=5 → 1 week
        let ror = compute_rate_of_return(2.50, 100.0, 5);
        // num_of_weeks(5) = 1.0, so ror = 2.5/100/1.0*52 = 1.30
        assert!(
            (ror - 1.30).abs() < 0.01,
            "rate_of_return should be ~1.30, got {:.4}",
            ror
        );
    }

    #[test]
    fn test_compute_rate_of_return_20_day() {
        // premium=3.00, strike=100, dte=20 → num_of_weeks(20) = 2 + 6/5 = 3.2
        let ror = compute_rate_of_return(3.00, 100.0, 20);
        let expected = 3.0 / 100.0 / 3.2 * 52.0;
        assert!(
            (ror - expected).abs() < 0.001,
            "rate_of_return should be {:.4}, got {:.4}",
            expected,
            ror
        );
    }

    #[test]
    fn test_control_config_trend_factor_matches_model() {
        let config = BacktestConfig::control();
        // At 1.05, model returns 0.90 — config should match
        let model_factor = model::calculate_trend_factor(1.05);
        let config_factor = config.compute_trend_factor(1.05);
        assert!(
            (model_factor - config_factor).abs() < 1e-10,
            "control config should match model: model={}, config={}",
            model_factor,
            config_factor
        );
    }

    #[test]
    fn test_no_trend_factor_always_one() {
        let config = BacktestConfig::no_trend_factor();
        assert_eq!(config.compute_trend_factor(1.05), 1.0);
        assert_eq!(config.compute_trend_factor(1.20), 1.0);
    }

    #[test]
    fn test_no_regime_always_bull() {
        let config = BacktestConfig::no_regime();
        let regime = config.build_regime(0.92); // Even deep bear
        assert_eq!(regime.flag, "", "no-regime should always be bull");
    }

    #[test]
    fn test_score_rejects_below_min_return() {
        let config = BacktestConfig::control();
        let regime = config.build_regime(1.05);
        let result = config.score_candidate(1.5, 0.1, 0.10, 1.03, 1.04, &regime);
        assert!(
            result.is_none(),
            "should reject rate_of_return below 0.25"
        );
    }

    #[test]
    fn test_score_accepts_valid() {
        let config = BacktestConfig::control();
        let regime = config.build_regime(1.05);
        let result = config.score_candidate(1.5, 0.1, 0.35, 1.03, 1.04, &regime);
        assert!(result.is_some(), "should accept valid candidate");
        let score = result.unwrap();
        assert!(
            score > 0.0 && score <= 1.0,
            "score should be in [0,1], got {}",
            score
        );
    }

    #[test]
    fn test_all_presets_have_valid_names() {
        for config in BacktestConfig::all_presets() {
            assert!(!config.name.is_empty(), "preset name should not be empty");
            assert!(
                !config.name.contains(' '),
                "preset name should not have spaces: {}",
                config.name
            );
        }
    }

    #[test]
    fn test_by_name_finds_presets() {
        assert!(BacktestConfig::by_name("control").is_some());
        assert!(BacktestConfig::by_name("no-trend-factor").is_some());
        assert!(BacktestConfig::by_name("nonexistent").is_none());
    }
}
