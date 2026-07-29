//! Out-of-sample evaluation and grid-search calibration for the directional
//! signal (`direction --backtest` / `--calibrate`).
//!
//! The history is split into an in-sample portion (the older two-thirds, used
//! for calibration) and an out-of-sample portion (the most-recent one-third,
//! used for the headline accuracy number). At each simulation day `i` the
//! signal is computed from the series up to and including `i`, and the label
//! is the close-to-close return over horizon `H` (`closes[i+H] / closes[i] −
//! 1`). Look-ahead-free: the signal never sees past index `i`.
//!
//! To make grid search tractable (~thousands of candidates × ~100k days), the
//! 5 weight-independent indicator scores are precomputed once per day, then
//! each candidate weight-set is evaluated as a cheap weighted sum. See map
//! decisions 03–04 and ticket 07–08.

use std::io::{self, Write};

use crate::{constants, indicators, model, signal::SignalParams};
use rusqlite::Connection;

/// Default prediction horizon (trading days). Map decision 03.
pub const DEFAULT_HORIZON: usize = 10;

/// Grid-search step size (decision 03): weights are multiples of 5.
pub const GRID_STEP: f64 = 5.0;

/// A single day's precomputed indicator scores plus the realized label.
/// Weight-independent: the signal for any weight-set is derived from `scores`
/// via `signal::signal_from_scores`. Scores order matches `signal::indicator_scores`:
/// `[ema_alignment, ema200, macd, rsi, volume, rs, adx]`.
#[derive(Debug, Clone, Copy)]
struct DayRow {
    scores: [f64; 7],
    bullish: bool, // realized: close[i+H] > close[i]
}

impl DayRow {
    /// The signal value for a given weight-set.
    fn signal(&self, params: &SignalParams) -> f64 {
        crate::signal::signal_from_scores(self.scores, params)
    }
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
fn banded_hit_rate(rows: &[DayRow], params: &SignalParams) -> (Option<f64>, usize) {
    let calls: Vec<&DayRow> = rows.iter().filter(|r| is_call(r.signal(params))).collect();
    if calls.is_empty() {
        return (None, 0);
    }
    let hits = calls
        .iter()
        .filter(|r| predicts_bullish(r.signal(params)) == r.bullish)
        .count();
    (Some(hits as f64 / calls.len() as f64), calls.len())
}

/// Unconditional hit-rate: accuracy over ALL days (no abstention).
fn unconditional_hit_rate(rows: &[DayRow], params: &SignalParams) -> f64 {
    if rows.is_empty() {
        return 0.0;
    }
    let hits = rows
        .iter()
        .filter(|r| predicts_bullish(r.signal(params)) == r.bullish)
        .count();
    hits as f64 / rows.len() as f64
}

/// Majority-class baseline on the called days only (fair comparison vs banded
/// hit-rate): the rate of the more-frequent realized class among calls.
fn majority_class_baseline(rows: &[DayRow], params: &SignalParams) -> Option<f64> {
    let calls: Vec<&DayRow> = rows.iter().filter(|r| is_call(r.signal(params))).collect();
    if calls.is_empty() {
        return None;
    }
    let bulls = calls.iter().filter(|r| r.bullish).count();
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

/// Collect per-day indicator scores + label for one symbol's candle series at
/// a horizon. Returns `None` if too short. Weight-independent — the same rows
/// feed both calibration (train split) and evaluation (test split). `candles`
/// carry OHLCV (ADX needs high/low); `benchmark` (SPY closes) is sliced in
/// parallel for the RS feature.
fn collect_rows(
    candles: &[model::Candle],
    benchmark: &[f64],
    horizon: usize,
) -> Option<Vec<DayRow>> {
    let min_len = indicators::EMA200_PERIOD as usize + horizon;
    if candles.len() < min_len {
        return None;
    }
    let mut rows = Vec::new();
    for i in (indicators::EMA200_PERIOD as usize - 1)..(candles.len() - horizon) {
        let bench_slice = if i < benchmark.len() { &benchmark[..=i] } else { benchmark };
        let scores = crate::signal::indicator_scores(&candles[..=i], bench_slice);
        let bullish = candles[i + horizon].close > candles[i].close;
        rows.push(DayRow { scores, bullish });
    }
    Some(rows)
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

/// Split a symbol's candles into (train, test) by the older-2/3 / recent-1/3
/// boundary and collect DayRows for each, at the given horizon. `benchmark`
/// (SPY closes) is passed through to `collect_rows` for the RS feature.
fn split_rows(
    candles: &[model::Candle],
    benchmark: &[f64],
    horizon: usize,
) -> (Option<Vec<DayRow>>, Option<Vec<DayRow>>) {
    let split_at = candles.len() * 2 / 3;
    if split_at >= candles.len() {
        return (None, None);
    }
    let train_c = &candles[..split_at];
    let test_c = &candles[split_at..];
    let to_rows = |slice: &[model::Candle]| collect_rows(slice, benchmark, horizon);
    (to_rows(train_c), to_rows(test_c))
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

// ── Grid search ───────────────────────────────────────────────

/// A candidate weight-set from the grid, as the 7 raw weights (multiples of
/// `GRID_STEP`, summing to 100). Order matches `indicator_scores`:
/// `[ema_alignment, ema200, macd, rsi, volume, rs, adx]`.
fn params_from_weights(w: [f64; 7]) -> SignalParams {
    SignalParams {
        weight_ema_alignment: w[0],
        weight_ema200: w[1],
        weight_macd: w[2],
        weight_rsi: w[3],
        weight_volume: w[4],
        weight_rs: w[5],
        weight_adx: w[6],
    }
}

/// Enumerate every weight combination where each of 7 weights is a non-negative
/// multiple of `GRID_STEP` and all sum to 100. Stars-and-bars over steps:
/// C(20+7−1, 7−1) = C(26,6) = 230230 combinations.
fn grid_weight_combos() -> Vec<[f64; 7]> {
    let total_steps = (100.0 / GRID_STEP) as usize; // 20
    let mut out = Vec::new();
    for a in 0..=total_steps {
        for b in 0..=(total_steps - a) {
            for c in 0..=(total_steps - a - b) {
                for d in 0..=(total_steps - a - b - c) {
                    for e in 0..=(total_steps - a - b - c - d) {
                        for f in 0..=(total_steps - a - b - c - d - e) {
                            let g = total_steps - a - b - c - d - e - f;
                            out.push([
                                a as f64 * GRID_STEP,
                                b as f64 * GRID_STEP,
                                c as f64 * GRID_STEP,
                                d as f64 * GRID_STEP,
                                e as f64 * GRID_STEP,
                                f as f64 * GRID_STEP,
                                g as f64 * GRID_STEP,
                            ]);
                        }
                    }
                }
            }
        }
    }
    out
}

/// Grid-search result: the best weight-set found and its in-sample metrics.
#[derive(Debug, Clone)]
pub struct CalibResult {
    pub params: SignalParams,
    pub weights: [f64; 7],
    pub train_banded_hit_rate: Option<f64>,
    pub train_n_calls: usize,
}

/// Find the weight-set maximizing in-sample banded hit-rate (decision 03).
/// Each weight is a multiple of 5 summing to 100. Ties broken toward the
/// candidate with more calls (more decisive), then toward lower index.
/// Pure function: train rows in → best params out.
pub fn grid_search(train_rows: &[DayRow]) -> Option<CalibResult> {
    let combos = grid_weight_combos();

    // Hot-path optimization: every grid weight-set sums to exactly 100, so
    // signal = Σ(w·s)/100. Multiply the band thresholds by 100 and compare the
    // raw weighted sum directly — no per-row division, no allocation, and the
    // signal is computed once per row (the generic metric fns recompute it
    // 2-3×). Thresholds: call if Σ>60 (bull) or Σ<40 (bear); guess bull iff Σ>50.
    const CALL_BULL: f64 = 60.0 * 100.0 / 100.0; // = 60 (signal>0.60 → Σw·s>60)
    const CALL_BEAR: f64 = 40.0;
    const GUESS_BULL: f64 = 50.0;

    let mut best: Option<(CalibResult, usize)> = None; // (result, tiebreak n_calls)
    for w in combos {
        let mut n_calls = 0usize;
        let mut hits = 0usize;
        for r in train_rows {
            // Raw weighted sum (signal × 100, since Σw = 100).
            let sig100 = w[0] * r.scores[0]
                + w[1] * r.scores[1]
                + w[2] * r.scores[2]
                + w[3] * r.scores[3]
                + w[4] * r.scores[4]
                + w[5] * r.scores[5]
                + w[6] * r.scores[6];
            let is_call = sig100 > CALL_BULL || sig100 < CALL_BEAR;
            if is_call {
                n_calls += 1;
                let predicts_bull = sig100 > GUESS_BULL;
                if predicts_bull == r.bullish {
                    hits += 1;
                }
            }
        }
        if n_calls == 0 {
            continue; // makes no calls — useless
        }
        let hr = hits as f64 / n_calls as f64;
        let candidate = CalibResult {
            params: params_from_weights(w),
            weights: w,
            train_banded_hit_rate: Some(hr),
            train_n_calls: n_calls,
        };
        best = Some(match best {
            None => (candidate, n_calls),
            Some((prev, prev_calls)) => {
                let prev_hr = prev.train_banded_hit_rate.unwrap();
                if hr > prev_hr + 1e-12
                    || ((hr - prev_hr).abs() < 1e-12 && n_calls > prev_calls)
                {
                    (candidate, n_calls)
                } else {
                    (prev, prev_calls)
                }
            }
        });
    }
    best.map(|(r, _)| r)
}

// ── CLI entry points ──────────────────────────────────────────

/// Backtest mode: evaluate the given weights on the out-of-sample (most-recent
/// one-third) split. Prints banded + unconditional hit-rate and both baselines,
/// primary horizon plus free secondary diagnostics.
pub fn run_backtest(
    conn: &Connection,
    symbols: &[String],
    horizon: usize,
    params: SignalParams,
) -> model::Result<()> {
    let primary = horizon;
    let candles_by_symbol = load_all_candles(conn, symbols);
    if candles_by_symbol.is_empty() {
        log::warn!("No candles loaded for any symbol; nothing to backtest.");
        return Ok(());
    }
    let spy_closes = crate::signal::load_spy_closes(conn);

    let horizons = dedup_horizons(primary, &[5, 7]);
    let mut results: Vec<HorizonResult> = Vec::new();
    for &h in &horizons {
        let mut all_rows: Vec<DayRow> = Vec::new();
        for (_symbol, candles) in &candles_by_symbol {
            if let (_train, Some(test)) = split_rows(candles, &spy_closes, h) {
                all_rows.extend(test);
            }
        }
        let (bhr, n_calls) = banded_hit_rate(&all_rows, &params);
        results.push(HorizonResult {
            horizon: h,
            banded_hit_rate: bhr,
            n_calls,
            n_days: all_rows.len(),
            unconditional_hit_rate: unconditional_hit_rate(&all_rows, &params),
            majority_class: majority_class_baseline(&all_rows, &params),
        });
    }

    print_results(&results, primary, &candles_by_symbol, &params);
    Ok(())
}

/// Calibrate mode: grid-search the weights on the in-sample (older two-thirds)
/// split, print the best combo + its train hit-rate, then evaluate that combo
/// out-of-sample so the headline number is visible immediately.
pub fn run_calibrate(
    conn: &Connection,
    symbols: &[String],
    horizon: usize,
) -> model::Result<()> {
    let candles_by_symbol = load_all_candles(conn, symbols);
    if candles_by_symbol.is_empty() {
        log::warn!("No candles loaded for any symbol; nothing to calibrate on.");
        return Ok(());
    }
    let spy_closes = crate::signal::load_spy_closes(conn);

    // Collect train rows (in-sample) at the primary horizon.
    let mut train_rows: Vec<DayRow> = Vec::new();
    for (_symbol, candles) in &candles_by_symbol {
        if let (Some(train), _test) = split_rows(candles, &spy_closes, horizon) {
            train_rows.extend(train);
        }
    }
    if train_rows.is_empty() {
        log::warn!("No in-sample rows; cannot calibrate.");
        return Ok(());
    }
    log::info!(
        "Grid search: {} in-sample days across {} symbols, horizon {}d",
        train_rows.len(),
        candles_by_symbol.len(),
        horizon
    );

    let calib = match grid_search(&train_rows) {
        Some(c) => c,
        None => {
            log::warn!("Grid search found no viable weight-set (all made zero calls).");
            return Ok(());
        }
    };

    print_calibration(&calib, &train_rows, horizon);
    Ok(())
}

fn print_results(
    results: &[HorizonResult],
    primary: usize,
    candles_by_symbol: &std::collections::HashMap<String, Vec<model::Candle>>,
    params: &SignalParams,
) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(
        out,
        "Signal backtest — {} symbols, out-of-sample split (most-recent 1/3)",
        candles_by_symbol.len()
    );
    let _ = writeln!(out, "weights: EMA={} EMA200={} MACD={} RSI={} Vol={} RS={} ADX={}",
        params.weight_ema_alignment, params.weight_ema200, params.weight_macd,
        params.weight_rsi, params.weight_volume, params.weight_rs, params.weight_adx);
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

fn print_calibration(calib: &CalibResult, train_rows: &[DayRow], horizon: usize) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "=".repeat(64));
    let _ = writeln!(out, "Grid-search calibration — in-sample (older 2/3), {}d horizon", horizon);
    let _ = writeln!(out, "{}", "=".repeat(64));
    let _ = writeln!(out, "best weights (sum 100, step {}):", GRID_STEP as u32);
    let _ = writeln!(
        out,
        "  EMA20/50={}  EMA200={}  MACD={}  RSI={}  Volume={}  RS={}  ADX={}",
        calib.weights[0], calib.weights[1], calib.weights[2], calib.weights[3], calib.weights[4], calib.weights[5], calib.weights[6]
    );
    let _ = writeln!(
        out,
        "  train banded hit-rate: {:.1}% ({} calls, {} days)",
        calib.train_banded_hit_rate.unwrap_or(0.0) * 100.0,
        calib.train_n_calls,
        train_rows.len()
    );
    let maj = majority_class_baseline(train_rows, &calib.params)
        .map(|m| format!("{:.1}%", m * 100.0))
        .unwrap_or_else(|| "n/a".to_string());
    let _ = writeln!(out, "  train majority baseline: {} (in-sample bar)", maj);
    let _ = writeln!(out, "{}", "-".repeat(64));
    let _ = writeln!(out, "Re-run with --backtest to see these weights out-of-sample.");
}

#[cfg(test)]
mod tests {
    use super::*;

    fn row(scores: [f64; 7], bullish: bool) -> DayRow {
        DayRow { scores, bullish }
    }

    /// Build OHLCV candles from a close series (±0.5 high/low, fixed volume) —
    /// enough for the ADX feature in collect_rows tests.
    fn test_candles(closes: &[f64]) -> Vec<model::Candle> {
        closes
            .iter()
            .enumerate()
            .map(|(i, &c)| model::Candle {
                symbol: "TEST".into(),
                open: c,
                high: c + 0.5,
                low: c - 0.5,
                close: c,
                volume: 1000,
                timestamp: i as u32,
            })
            .collect()
    }

    #[test]
    fn banded_hit_rate_counts_calls_only() {
        // signals via default params: 0.70-call bull-correct, 0.30-call bear-correct,
        // 0.50 abstains, 0.80-call bull-wrong.
        let params = SignalParams::default();
        // Build rows whose signal is `v` under default weights: set all 6
        // scores to v (composite = v when all equal).
        let rows = vec![
            row([0.7; 7], true),
            row([0.3; 7], false),
            row([0.5; 7], true),
            row([0.8; 7], false),
        ];
        let (hr, n) = banded_hit_rate(&rows, &params);
        assert_eq!(n, 3); // the 0.50 abstains
        assert!((hr.unwrap() - (2.0 / 3.0)).abs() < 1e-9);
    }

    #[test]
    fn banded_hit_rate_none_when_all_abstain() {
        let params = SignalParams::default();
        let rows = vec![
            row([0.5; 7], true),
            row([0.45; 7], false),
        ];
        let (hr, n) = banded_hit_rate(&rows, &params);
        assert_eq!(n, 0);
        assert!(hr.is_none());
    }

    #[test]
    fn unconditional_counts_all_days() {
        let params = SignalParams::default();
        let rows = vec![
            row([0.7; 7], true),
            row([0.3; 7], false),
            row([0.5; 7], true), // predicts bear (not >0.5) vs bull → miss
            row([0.8; 7], false),
        ];
        let hr = unconditional_hit_rate(&rows, &params);
        assert!((hr - 0.5).abs() < 1e-9);
    }

    #[test]
    fn majority_class_is_max_of_realized() {
        let params = SignalParams::default();
        // all are calls; 3 bull, 1 bear → majority 3/4.
        let rows = vec![
            row([0.7; 7], true),
            row([0.3; 7], true),
            row([0.8; 7], true),
            row([0.2; 7], false),
        ];
        assert!((majority_class_baseline(&rows, &params).unwrap() - 0.75).abs() < 1e-9);
    }

    #[test]
    fn dedup_horizons_keeps_primary_first() {
        assert_eq!(dedup_horizons(10, &[5, 7]), vec![10, 5, 7]);
        assert_eq!(dedup_horizons(5, &[5, 7]), vec![5, 7]);
    }

    #[test]
    fn collect_rows_returns_none_when_too_short() {
        let candles = test_candles(&vec![100.0; 50]);
        let bench = vec![100.0; 50];
        assert!(collect_rows(&candles, &bench, 10).is_none());
    }

    #[test]
    fn collect_rows_walks_correct_range() {
        // 220 candles, horizon 10: walks i in [199..210) → 11 rows.
        let closes: Vec<f64> = (0..220).map(|i| 100.0 + i as f64).collect();
        let candles = test_candles(&closes);
        let bench = vec![100.0; 220];
        let rows = collect_rows(&candles, &bench, 10).unwrap();
        assert_eq!(rows.len(), 220 - 10 - (indicators::EMA200_PERIOD as usize - 1));
    }

    #[test]
    fn is_call_respects_band() {
        assert!(is_call(0.61));
        assert!(is_call(0.39));
        assert!(!is_call(0.60));
        assert!(!is_call(0.40));
        assert!(!is_call(0.50));
    }

    // ── Grid search ──
    #[test]
    fn grid_combos_all_sum_to_100_and_stepped() {
        for w in grid_weight_combos() {
            let sum: f64 = w.iter().sum();
            assert!((sum - 100.0).abs() < 1e-9, "weights don't sum to 100: {w:?}");
            for &wi in &w {
                assert!((wi % GRID_STEP).abs() < 1e-9, "weight not a step multiple: {wi}");
            }
        }
    }

    #[test]
    fn grid_combos_count_matches_stars_and_bars() {
        // C(20+7-1, 7-1) = C(26,6) = 230230 combinations.
        assert_eq!(grid_weight_combos().len(), 230230);
    }

    #[test]
    fn grid_search_picks_higher_hit_rate() {
        // Construct train rows where the truth is: bullish iff EMA200 score high.
        // EMA200 is scores[1]. Build rows so that a weight-set that listens only
        // to EMA200 (w=[0,100,0,0,0,0,0]) scores ~100%.
        let rows: Vec<DayRow> = (0..40)
            .map(|i| {
                let ema200_high = i % 2 == 0;
                // scores: [alignment, ema200, macd, rsi, volume, rs, adx]
                // Put noise on the other 6, truth on ema200.
                let noise = if i % 3 == 0 { 0.2 } else { 0.8 };
                let scores = [noise, if ema200_high { 0.9 } else { 0.1 }, noise, noise, noise, noise, noise];
                row(scores, ema200_high) // bullish iff ema200 high — perfectly separable
            })
            .collect();
        let best = grid_search(&rows).expect("should find a best");
        // The all-EMA200 weight-set should be among the top; its hit-rate ~100%.
        assert!(
            best.train_banded_hit_rate.unwrap() > 0.95,
            "should separate perfectly, got {:?}",
            best.train_banded_hit_rate
        );
        // And EMA200 should carry the weight (others 0 in the perfect separator).
        assert!(
            best.weights[1] >= 50.0,
            "EMA200 should dominate, got weights {:?}",
            best.weights
        );
    }

    #[test]
    fn grid_search_returns_none_when_no_calls() {
        // All-0.5 scores → every weight-set abstains → no viable candidate.
        let rows = vec![
            row([0.5; 7], true),
            row([0.5; 7], false),
        ];
        assert!(grid_search(&rows).is_none());
    }
}
