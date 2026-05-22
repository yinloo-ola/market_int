use std::collections::HashMap;

use chrono::{Datelike, Duration, NaiveDate, Weekday};

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
}
