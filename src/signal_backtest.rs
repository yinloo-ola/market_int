//! Out-of-sample evaluation for the directional signal (`direction --backtest`).
//!
//! Walks the most-recent one-third of each symbol's cached history (the
//! out-of-sample split — calibration in ticket 08 sees only the older
//! two-thirds). At each simulation day `i` the signal is computed from the
//! series up to and including `i`, and the label is the close-to-close return
//! over horizon `H` (`closes[i+H] / closes[i] − 1`). Look-ahead-free: the
//! signal never sees past index `i`.
//!
//! Metrics are pure functions over `(signal, label)` pairs so they're
//! unit-testable with no I/O. See map decision 03 and ticket 07.

use std::io::{self, Write};

use crate::{constants, indicators, model, signal::SignalParams};
use rusqlite::Connection;

/// Default prediction horizon (trading days). Map decision 03.
pub const DEFAULT_HORIZON: usize = 10;

/// A single day's prediction: the computed signal and the realized label.
#[derive(Debug, Clone, Copy)]
struct Prediction {
    signal: f64,
    bullish: bool, // realized: close[i+H] > close[i]
}

/// Did the signal make a directional call (outside the neutral band)?
fn is_call(sig: f64) -> bool {
    sig > constants::SIGNAL_NEUTRAL_HIGH || sig < constants::SIGNAL_NEUTRAL_LOW
}

/// The signal's directional guess: `bullish` if signal > 0.5, else bearish.
fn predicts_bullish(sig: f64) -> bool {
    sig > 0.5
}

/// Banded hit-rate: accuracy over only the days the signal made a call.
/// Returns `(hit_rate, n_calls)`. Hit-rate is `None` if no calls were made.
fn banded_hit_rate(predictions: &[Prediction]) -> (Option<f64>, usize) {
    let calls: Vec<&Prediction> = predictions.iter().filter(|p| is_call(p.signal)).collect();
    if calls.is_empty() {
        return (None, 0);
    }
    let hits = calls.iter().filter(|p| predicts_bullish(p.signal) == p.bullish).count();
    (Some(hits as f64 / calls.len() as f64), calls.len())
}

/// Unconditional hit-rate: accuracy over ALL days (no abstention).
fn unconditional_hit_rate(predictions: &[Prediction]) -> f64 {
    if predictions.is_empty() {
        return 0.0;
    }
    let hits = predictions
        .iter()
        .filter(|p| predicts_bullish(p.signal) == p.bullish)
        .count();
    hits as f64 / predictions.len() as f64
}

/// Majority-class baseline on the called days only (fair comparison vs banded
/// hit-rate): the rate of the more-frequent realized class among calls.
/// Returns `None` if no calls.
fn majority_class_baseline(predictions: &[Prediction]) -> Option<f64> {
    let calls: Vec<&Prediction> = predictions.iter().filter(|p| is_call(p.signal)).collect();
    if calls.is_empty() {
        return None;
    }
    let bulls = calls.iter().filter(|p| p.bullish).count();
    let rate = bulls.max(calls.len() - bulls) as f64 / calls.len() as f64;
    Some(rate)
}

/// Backtest result for one horizon.
#[derive(Debug, Clone)]
pub struct HorizonResult {
    pub horizon: usize,
    pub banded_hit_rate: Option<f64>,
    pub n_calls: usize,
    pub n_days: usize,
    pub unconditional_hit_rate: f64,
    pub majority_class: Option<f64>,
}

/// Evaluate one symbol's series at a given horizon. Returns the per-symbol
/// predictions (to be aggregated), or `None` if too short.
fn evaluate_series(
    closes: &[f64],
    volumes: &[f64],
    horizon: usize,
    params: &SignalParams,
) -> Option<Vec<Prediction>> {
    // Need at least EMA200 worth of history before the window, plus `horizon`
    // forward days for the last label.
    let min_len = indicators::EMA200_PERIOD as usize + horizon;
    if closes.len() < min_len {
        return None;
    }
    let mut preds = Vec::new();
    // Walk every day from where the signal is defined up to where the label exists.
    for i in (indicators::EMA200_PERIOD as usize - 1)..(closes.len() - horizon) {
        let sig = crate::signal::compute_signal(&closes[..=i], &volumes[..=i], params);
        let bullish = closes[i + horizon] > closes[i];
        preds.push(Prediction { signal: sig, bullish });
    }
    Some(preds)
}

/// Backtest mode: evaluate the (seed-weighted) signal on the out-of-sample
/// (most-recent one-third) split. Prints banded + unconditional hit-rate and
/// both baselines, primary horizon plus free secondary diagnostics.
pub fn run_backtest(
    conn: &Connection,
    symbols: &[String],
    horizon: usize,
) -> model::Result<()> {
    let params = SignalParams::default();
    let primary = horizon;

    // Load all candles once (chronological), then take the recent one-third.
    let candles_by_symbol = load_all_candles(conn, symbols);
    if candles_by_symbol.is_empty() {
        log::warn!("No candles loaded for any symbol; nothing to backtest.");
        return Ok(());
    }

    let horizons = dedup_horizons(primary, &[5, 7]);
    let mut results: Vec<HorizonResult> = Vec::new();
    for &h in &horizons {
        let mut all_preds: Vec<Prediction> = Vec::new();
        for (_symbol, candles) in &candles_by_symbol {
            // Out-of-sample split: most-recent one-third of the series.
            let split_at = candles.len() * 2 / 3;
            if split_at >= candles.len() {
                continue;
            }
            let test_candles = &candles[split_at..];
            let closes: Vec<f64> = test_candles.iter().map(|c| c.close).collect();
            let volumes: Vec<f64> = test_candles.iter().map(|c| c.volume as f64).collect();
            if let Some(preds) = evaluate_series(&closes, &volumes, h, &params) {
                all_preds.extend(preds);
            }
        }
        let (bhr, n_calls) = banded_hit_rate(&all_preds);
        results.push(HorizonResult {
            horizon: h,
            banded_hit_rate: bhr,
            n_calls,
            n_days: all_preds.len(),
            unconditional_hit_rate: unconditional_hit_rate(&all_preds),
            majority_class: majority_class_baseline(&all_preds),
        });
    }

    print_results(&results, primary, &candles_by_symbol);
    Ok(())
}

/// Load all candles per symbol into memory (mirrors `backtest::load_all_candles`).
fn load_all_candles(
    conn: &Connection,
    symbols: &[String],
) -> std::collections::HashMap<String, Vec<model::Candle>> {
    let mut map = std::collections::HashMap::new();
    for symbol in symbols {
        match crate::store::candle::get_candles(conn, symbol, constants::CANDLE_COUNT) {
            Ok(candles) if !candles.is_empty() => {
                map.insert(symbol.clone(), candles);
            }
            Ok(_) => log::warn!("No candles for {symbol}"),
            Err(e) => log::warn!("No candles for {symbol}: {e}"),
        }
    }
    map
}

/// Merge the primary horizon with the free secondary diagnostics, deduped,
/// preserving primary-first order.
fn dedup_horizons(primary: usize, secondaries: &[usize]) -> Vec<usize> {
    let mut out = vec![primary];
    for &s in secondaries {
        if !out.contains(&s) {
            out.push(s);
        }
    }
    out
}

fn print_results(
    results: &[HorizonResult],
    primary: usize,
    candles_by_symbol: &std::collections::HashMap<String, Vec<model::Candle>>,
) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(
        out,
        "Signal backtest — {} symbols, out-of-sample split (most-recent 1/3)",
        candles_by_symbol.len()
    );
    let _ = writeln!(out, "{}", "-".repeat(64));
    let _ = writeln!(
        out,
        "{:<8} {:>8} {:>8} {:>10} {:>10}",
        "HORIZON", "BANDED", "MAJORITY", "N_CALLS", "N_DAYS"
    );
    let _ = writeln!(out, "{}", "-".repeat(64));
    for r in results {
        let primary_marker = if r.horizon == primary { " *" } else { "" };
        let banded = r
            .banded_hit_rate
            .map(|h| format!("{:.1}%{}", h * 100.0, primary_marker))
            .unwrap_or_else(|| "n/a".to_string());
        let maj = r
            .majority_class
            .map(|m| format!("{:.1}%", m * 100.0))
            .unwrap_or_else(|| "n/a".to_string());
        let _ = writeln!(
            out,
            "{:<8} {:>8} {:>8} {:>10} {:>10}",
            format!("{}d", r.horizon),
            banded,
            maj,
            r.n_calls,
            r.n_days
        );
    }
    let _ = writeln!(out, "{}", "-".repeat(64));
    let _ = writeln!(out, "BANDED = hit-rate on called days only (signal outside [{}, {}]).",
        constants::SIGNAL_NEUTRAL_LOW, constants::SIGNAL_NEUTRAL_HIGH);
    let _ = writeln!(out, "MAJORITY = always-bullish baseline on the same called days (the bar to clear).");
    let _ = writeln!(out, "* = primary horizon. Secondary horizons reported free from the same signal.");
}

#[cfg(test)]
mod tests {
    use super::*;

    fn pred(sig: f64, bullish: bool) -> Prediction {
        Prediction { signal: sig, bullish }
    }

    #[test]
    fn banded_hit_rate_counts_calls_only() {
        // 0.70→bull-correct, 0.30→bear-correct, 0.50 abstains, 0.80→bull-wrong.
        let preds = vec![pred(0.70, true), pred(0.30, false), pred(0.50, true), pred(0.80, false)];
        let (hr, n) = banded_hit_rate(&preds);
        assert_eq!(n, 3); // the 0.50 abstains
        assert!((hr.unwrap() - (2.0 / 3.0)).abs() < 1e-9);
    }

    #[test]
    fn banded_hit_rate_none_when_all_abstain() {
        let preds = vec![pred(0.50, true), pred(0.45, false)];
        let (hr, n) = banded_hit_rate(&preds);
        assert_eq!(n, 0);
        assert!(hr.is_none());
    }

    #[test]
    fn unconditional_counts_all_days() {
        let preds = vec![pred(0.70, true), pred(0.30, false), pred(0.50, true), pred(0.80, false)];
        let hr = unconditional_hit_rate(&preds);
        // predicts_bullish = sig > 0.5. Matches: 0.70✓ 0.30✓ (bear/bear);
        // 0.50 → not > 0.5 → predicts bear vs realized bull ✗; 0.80 ✗ → 2/4.
        assert!((hr - 0.5).abs() < 1e-9);
    }

    #[test]
    fn majority_class_is_max_of_realized() {
        // 3 bull, 1 bear among calls → majority = 3/4.
        let preds = vec![pred(0.70, true), pred(0.30, true), pred(0.80, true), pred(0.20, false)];
        assert!((majority_class_baseline(&preds).unwrap() - 0.75).abs() < 1e-9);
    }

    #[test]
    fn majority_class_none_when_no_calls() {
        let preds = vec![pred(0.50, true)];
        assert!(majority_class_baseline(&preds).is_none());
    }

    #[test]
    fn dedup_horizons_keeps_primary_first() {
        assert_eq!(dedup_horizons(10, &[5, 7]), vec![10, 5, 7]);
        // primary 5 dedups against secondary 5
        assert_eq!(dedup_horizons(5, &[5, 7]), vec![5, 7]);
    }

    #[test]
    fn evaluate_series_returns_none_when_too_short() {
        let closes = vec![100.0; 50]; // < EMA200 period + horizon
        let vols = vec![1000.0; 50];
        let params = SignalParams::default();
        assert!(evaluate_series(&closes, &vols, 10, &params).is_none());
    }

    #[test]
    fn evaluate_series_walks_correct_range() {
        // 220 closes, horizon 10: walks i in [199..210) → 11 predictions.
        let closes: Vec<f64> = (0..220).map(|i| 100.0 + i as f64).collect();
        let vols = vec![1000.0; 220];
        let params = SignalParams::default();
        let preds = evaluate_series(&closes, &vols, 10, &params).unwrap();
        assert_eq!(preds.len(), 220 - 10 - (indicators::EMA200_PERIOD as usize - 1));
    }

    #[test]
    fn is_call_respects_band() {
        assert!(is_call(0.61));
        assert!(is_call(0.39));
        assert!(!is_call(0.60)); // boundary
        assert!(!is_call(0.40)); // boundary
        assert!(!is_call(0.50));
    }
}
