//! Technical indicators and their normalizations for the up/down `direction`
//! signal.
//!
//! This module is the future home for the net-new indicator *math* (EMA200,
//! MACD, RSI, volume breakout — ticket 06) and the per-indicator
//! *normalizations* that turn raw values into `[0, 1]` bullishness scores.
//! Normalization philosophy is **hybrid** (see map decision 02): discrete
//! regime flags for the EMAs, continuous magnitudes for MACD/RSI/volume.
//!
//! The skeleton (ticket 05) wires only the EMA20/50 alignment term; the other
//! four indicators land in ticket 06.

use crate::{constants, stats};

/// Raw EMA20/EMA50 trend stack for a close-price series.
///
/// Returns `(ema20, ema50)`. Reuses the existing EMA primitive. Caller must
/// guarantee `closes` is non-empty.
fn ema_stack(closes: &[f64]) -> (f64, f64) {
    let ema20 = stats::exponential_moving_average(closes, constants::EMA_SHORT_PERIOD);
    let ema50 = stats::exponential_moving_average(closes, constants::EMA_LONG_PERIOD);
    (ema20, ema50)
}

/// Normalizes EMA20/50 alignment into a discrete `[0, 1]` bullishness score.
///
/// Hybrid philosophy: alignment is a regime flag, not a slope.
/// - `1.0` — full bullish stack: `price > EMA20 > EMA50`.
/// - `0.5` — partial: price above one EMA but not a clean bull stack.
/// - `0.0` — bearish stack: `price < EMA20 < EMA50`.
///
/// Returns `0.5` (neutral) when `closes` is empty (no data to judge).
pub fn ema_alignment_score(closes: &[f64]) -> f64 {
    let Some(&price) = closes.last() else {
        return 0.5;
    };
    let (ema20, ema50) = ema_stack(closes);

    if price > ema20 && ema20 > ema50 {
        // Full bullish stack.
        1.0
    } else if price < ema20 && ema20 < ema50 {
        // Full bearish stack.
        0.0
    } else {
        // Mixed / crossing — neither a clean bull nor bear stack.
        0.5
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// `count` closes starting at `start`, stepping by `step` each day.
    fn trending(start: f64, step: f64, count: usize) -> Vec<f64> {
        (0..count).map(|i| start + step * i as f64).collect()
    }

    #[test]
    fn empty_closes_is_neutral() {
        assert_eq!(ema_alignment_score(&[]), 0.5);
    }

    #[test]
    fn strong_uptrend_is_full_bull() {
        // 60 days up from 100 → price well above both EMAs, EMAs stacked up.
        let closes = trending(100.0, 1.0, 60);
        assert_eq!(ema_alignment_score(&closes), 1.0);
    }

    #[test]
    fn strong_downtrend_is_full_bear() {
        // 60 days down from 200 → price below both EMAs, EMAs stacked down.
        let closes = trending(200.0, -2.0, 60);
        assert_eq!(ema_alignment_score(&closes), 0.0);
    }

    #[test]
    fn flat_is_neutral_partial() {
        // All-equal prices: price == EMA20 == EMA50 → neither stack holds.
        let closes = vec![100.0; 60];
        assert_eq!(ema_alignment_score(&closes), 0.5);
    }

    #[test]
    fn recent_recovery_is_partial() {
        // Long downtrend then sharp recovery: price pops above EMA20 but EMA50
        // lags → not a clean bull stack yet (EMA20 not above EMA50), not bear.
        let mut closes = trending(200.0, -2.0, 50); // down to ~102
        closes.push(140.0); // sharp single-day pop above EMA20
        let score = ema_alignment_score(&closes);
        assert_eq!(score, 0.5, "mixed stack should be partial, got {score}");
    }
}
