// ── Black-Scholes Greeks ──────────────────────────────────────
//
// Pure functions for option pricing and greeks. Extracted from
// `backtest.rs` in 2026-07 so both the backtest and production
// (option-chain scoring) share a single implementation. The implied
// volatility solver (`implied_vol`) enables A3: compute IV from the
// market mid price when Tiger does not return it natively.

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

/// Standard normal PDF.
pub fn normal_pdf(x: f64) -> f64 {
    (-x * x / 2.0).exp() / (2.0 * std::f64::consts::PI).sqrt()
}

/// Black-Scholes d1 and d2. Returns (d1, d2).
#[allow(non_snake_case)]
fn d1_d2(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> Option<(f64, f64)> {
    if T <= 0.0 || sigma <= 0.0 || S <= 0.0 || K <= 0.0 {
        return None;
    }
    let d1 = ((S / K).ln() + (r - q + sigma * sigma / 2.0) * T) / (sigma * T.sqrt());
    let d2 = d1 - sigma * T.sqrt();
    Some((d1, d2))
}

/// Black-Scholes put price.
/// S = spot, K = strike, T = years to expiry, r = risk-free rate, q = dividend yield, sigma = volatility.
#[allow(non_snake_case)]
pub fn black_scholes_put(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> f64 {
    let (d1, d2) = match d1_d2(S, K, T, r, q, sigma) {
        Some(v) => v,
        None => return 0.0,
    };
    K * (-r * T).exp() * cumulative_normal(-d2) - S * (-q * T).exp() * cumulative_normal(-d1)
}

/// Put delta: N(-d1). The sensitivity of the put price to a $1 move in spot,
/// in [-1, 0]. Often used as a rough proxy for probability of ITM at expiry.
/// Returns a value in [0, 1] (the convention: put delta = -N(-d1), so -delta
/// gives a positive probability-like number). For assignment-probability use
/// `assignment_probability` (N(-d2)) instead — it's the cleaner metric.
#[allow(non_snake_case)]
pub fn put_delta(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> f64 {
    let (d1, _) = match d1_d2(S, K, T, r, q, sigma) {
        Some(v) => v,
        None => return 0.0,
    };
    cumulative_normal(-d1)
}

/// Risk-neutral probability of being in-the-money at expiry: N(-d2).
/// Cleaner than delta as an assignment-probability proxy — differs from delta
/// by a drift/discounting term (usually small for short-dated options).
#[allow(non_snake_case)]
pub fn assignment_probability(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> f64 {
    let (_, d2) = match d1_d2(S, K, T, r, q, sigma) {
        Some(v) => v,
        None => return 0.0,
    };
    cumulative_normal(-d2)
}

/// Put vega: the sensitivity of the put price to a 1-point change in vol.
/// Used by the Newton-Raphson IV solver. Returns the annual vega
/// (dPremium / dSigma).
#[allow(non_snake_case)]
pub fn put_vega(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> f64 {
    let (d1, _) = match d1_d2(S, K, T, r, q, sigma) {
        Some(v) => v,
        None => return 0.0,
    };
    S * (-q * T).exp() * normal_pdf(d1) * T.sqrt()
}

/// Compute implied volatility from a market put price via Newton-Raphson.
/// Returns `None` if the price is outside the no-arbitrage range
/// (e.g. premium > strike or premium ≤ 0).
///
/// S = spot, K = strike, T = years to expiry, r = risk-free rate, q = dividend yield,
/// market_price = the observed bid/ask mid.
/// max_iter = max iterations (default 50), tol = convergence tolerance (default 1e-8).
#[allow(non_snake_case)]
pub fn implied_volatility(
    S: f64,
    K: f64,
    T: f64,
    r: f64,
    q: f64,
    market_price: f64,
) -> Option<f64> {
    // No-arbitrage bounds: put price must be in [0, K * exp(-r*T)] roughly.
    if market_price <= 0.0 || market_price > K {
        return None;
    }
    // Deep ITM: price near K → any vol fits; cap iteration.
    if market_price >= K * 0.99 {
        return Some(5.0);
    }

    let max_iter = 50;
    let tol = 1e-8;
    let mut sigma = 0.30; // Initial guess: 30% annualized vol

    for _ in 0..max_iter {
        let price = black_scholes_put(S, K, T, r, q, sigma);
        let diff = price - market_price;
        if diff.abs() < tol {
            return Some(sigma);
        }
        let vega = put_vega(S, K, T, r, q, sigma);
        if vega.abs() < 1e-12 {
            break; // Flat vega → can't improve
        }
        sigma = sigma - diff / vega;
        sigma = sigma.clamp(0.01, 5.0);
    }

    // Use final value if close-ish, else None.
    let final_price = black_scholes_put(S, K, T, r, q, sigma);
    if (final_price - market_price).abs() < 0.001 {
        Some(sigma)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cumulative_normal_known_values() {
        assert!((cumulative_normal(0.0) - 0.5).abs() < 1e-7);
        assert!(cumulative_normal(-5.0) < 0.001);
        assert!(cumulative_normal(5.0) > 0.999);
        assert!((cumulative_normal(1.0) - 0.8413).abs() < 0.001);
        let n2 = cumulative_normal(2.0);
        assert!((cumulative_normal(-2.0) - (1.0 - n2)).abs() < 1e-7);
    }

    #[test]
    fn test_bs_put_at_the_money() {
        // S=K=100, T=1y, sigma=0.2, r=0.05, q=0 → BS put ≈ $5.57
        let p = black_scholes_put(100.0, 100.0, 1.0, 0.05, 0.0, 0.20);
        assert!((p - 5.57).abs() < 0.05, "got {}", p);
    }

    #[test]
    fn test_put_delta_range() {
        // Deep OTM: delta near 0. Deep ITM: delta near 1.
        let deep_otm = put_delta(100.0, 50.0, 0.5, 0.05, 0.0, 0.30);
        let deep_itm = put_delta(100.0, 150.0, 0.5, 0.05, 0.0, 0.30);
        assert!(deep_otm > 0.0 && deep_otm < 0.3, "deep OTM delta={}", deep_otm);
        assert!(deep_itm > 0.7 && deep_itm < 1.0, "deep ITM delta={}", deep_itm);
    }

    #[test]
    fn test_assignment_prob_less_or_equal_delta_for_otm_put() {
        // For OTM puts (K < S, T short), N(-d2) ≈ N(-d1) (drift is small).
        let delta = put_delta(105.0, 100.0, 5.0 / 252.0, 0.0, 0.0, 0.30);
        let prob = assignment_probability(105.0, 100.0, 5.0 / 252.0, 0.0, 0.0, 0.30);
        // For our use case (short DTE, r≈0, q≈0), they should be very close.
        assert!((delta - prob).abs() < 0.01, "delta={} prob={}", delta, prob);
    }

    #[test]
    fn test_implied_vol_roundtrip() {
        // Price at 30% vol, then recover that vol from the price.
        let s = 100.0;
        let k = 95.0;
        let t = 5.0 / 252.0; // 5 trading days
        let r = 0.0;
        let q = 0.0;
        let sigma_true = 0.35;
        let price = black_scholes_put(s, k, t, r, q, sigma_true);
        let sigma_recovered = implied_volatility(s, k, t, r, q, price);
        assert!(
            sigma_recovered.is_some(),
            "IV solver failed for price={}",
            price
        );
        assert!(
            (sigma_recovered.unwrap() - sigma_true).abs() < 0.01,
            "recovered={:.4} expected={:.4}",
            sigma_recovered.unwrap(),
            sigma_true
        );
    }

    #[test]
    fn test_implied_vol_returns_none_for_bad_price() {
        // Negative price → None.
        assert!(implied_volatility(100.0, 95.0, 0.5, 0.05, 0.0, -1.0).is_none());
        // Price > strike → None.
        assert!(implied_volatility(100.0, 95.0, 0.5, 0.05, 0.0, 100.0).is_none());
    }

    #[test]
    fn test_normal_pdf_symmetric() {
        assert!((normal_pdf(0.0) - 1.0 / (2.0 * std::f64::consts::PI).sqrt()).abs() < 1e-9);
        assert!((normal_pdf(1.0) - normal_pdf(-1.0)).abs() < 1e-9);
    }
}
