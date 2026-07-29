//! Cross-sectional ranking evaluation for the directional signal.
//!
//! A distinct hypothesis from `signal_backtest`'s pooled up/down accuracy.
//! Where that asked "does the signal call the sign right?" (a pooled,
//! market-direction test), this asks a *relative, market-neutral* question:
//! **do the names the signal ranks highest today outperform the names it
//! ranks lowest over the next H trading days?**
//!
//! The panel is grouped by calendar trading date: on each day `t`, every
//! present name is scored from the series up to and including `t`, then sorted
//! into deciles by signal. The forward return used is the **magnitude**
//! `close[t+H] / close[t] − 1` (the dimension the binary sign test threw away).
//! The per-day top−bottom decile spread is the series we test.
//!
//! Because forward returns at consecutive days overlap (day `t` and `t+1` share
//! H−1 of their return window), the daily spread is serially correlated. The
//! statistical test is therefore a **Newey-West** t-stat with lag = H and
//! Bartlett weights — robust to H-step-overlap autocorrelation and
//! heteroskedasticity.
//!
//! ## Validity caveats (baked into the data, printed on output)
//! 1. **Survivorship.** A name enters day `t`'s panel only if it has a close at
//!    `t+H`. Names that delisted mid-holding (skewing toward losers) are absent,
//!    which *inflates* the top−bottom spread. A positive spread is thus the
//!    easy-to-get, possibly-artifactual outcome; a flat/negative one is the
//!    honest signal.
//! 2. **Single regime.** The candle store spans one net-bull window
//!    (2022-08 → 2026-07); no regime-robustness claim follows from any result.

use std::io::{self, Write};

use crate::{constants, model, signal::SignalParams};
use rusqlite::Connection;

/// A single (date, symbol) observation: precomputed indicator scores and the
/// realized forward return magnitude. `date` is the candle timestamp (trading
/// day); scores are derived from the series up to and including `date` (no
/// look-ahead).
#[derive(Debug, Clone, Copy)]
struct PanelRow {
    date: u32,
    scores: [f64; 7],
    fwd_return: f64, // close[t+H]/close[t] − 1
}

/// Newey-West standard error of a sample mean, lag L with Bartlett weights.
///
/// SE_NW = sqrt( (γ₀ + 2·Σ_{l=1}^{L} w_l · γ_l) / n ),
/// where γ_l is the lag-l autocovariance and w_l = 1 − l/(L+1). This is the
/// HAC estimator robust to the H-step-overlap serial correlation of overlapping
/// forward returns. Pure function; panics on empty input via the caller contract.
fn newey_west_se(series: &[f64], lag: usize) -> f64 {
    let n = series.len();
    if n <= 1 || lag == 0 {
        // Fall back to the plain standard error of the mean.
        let mean = series.iter().sum::<f64>() / n as f64;
        let var = series.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / n as f64;
        return (var / n as f64).sqrt();
    }
    let mean = series.iter().sum::<f64>() / n as f64;
    let dev: Vec<f64> = series.iter().map(|x| x - mean).collect();
    // γ₀ = (1/n) Σ dev²
    let gamma0: f64 = dev.iter().map(|d| d * d).sum::<f64>() / n as f64;
    let mut weighted: f64 = gamma0;
    let effective_lag = lag.min(n - 1);
    for l in 1..=effective_lag {
        // γ_l = (1/n) Σ_{t=l+1}^{n} dev_t · dev_{t-l}
        let gamma_l: f64 = (l..n)
            .map(|t| dev[t] * dev[t - l])
            .sum::<f64>()
            / n as f64;
        let w_l = 1.0 - l as f64 / (lag as f64 + 1.0); // Bartlett
        weighted += 2.0 * w_l * gamma_l;
    }
    (weighted / n as f64).max(0.0).sqrt()
}

/// Stats summarizing a daily spread series. `t_stat` uses the Newey-West SE.
#[derive(Debug, Clone)]
pub struct RankStats {
    pub n_days: usize,
    pub mean_spread: f64,
    pub nw_t_stat: f64,
    pub sharpe: f64,
    pub pct_positive: f64,
}

/// Summarize a per-day top−bottom spread series. `lag` is the Newey-West HAC
/// lag, set to the holding horizon (overlapping H-day returns autocorrelate
/// out to lag H). Pure function.
fn rank_stats(spreads: &[f64], lag: usize) -> RankStats {
    let n = spreads.len();
    if n == 0 {
        return RankStats {
            n_days: 0,
            mean_spread: 0.0,
            nw_t_stat: 0.0,
            sharpe: 0.0,
            pct_positive: 0.0,
        };
    }
    let mean = spreads.iter().sum::<f64>() / n as f64;
    let se = newey_west_se(spreads, lag);
    let t = if se > 0.0 { mean / se } else { 0.0 };
    let var = spreads.iter().map(|s| (s - mean).powi(2)).sum::<f64>() / n as f64;
    let std = var.sqrt();
    let sharpe = if std > 0.0 { mean / std * (n as f64).sqrt() } else { 0.0 };
    let pos = spreads.iter().filter(|&&s| s > 0.0).count() as f64 / n as f64;
    RankStats {
        n_days: n,
        mean_spread: mean,
        nw_t_stat: t,
        sharpe,
        pct_positive: pos,
    }
}

/// Score a single panel member under a weight array (signal = Σw·s/total).
/// Returns 0.5 when total weight is zero (defensive). Pure helper.
fn score_member(scores: &[f64; 7], weights: &[f64; 7]) -> f64 {
    let total: f64 = weights.iter().sum();
    if total <= 0.0 {
        return 0.5;
    }
    weights
        .iter()
        .zip(scores.iter())
        .map(|(w, s)| w * s)
        .sum::<f64>()
        / total
}

/// The top−bottom decile mean-return spread for ONE day's `(signal, return)`
/// pairs, using `select_nth` (introselect) for O(n) partitioning. The decile
/// size is `n/10` (min 1). Pure helper, shared by the real computation and the
/// permutation test so both use identical decile math.
fn group_spread(scored: &mut [(f64, f64)]) -> Option<f64> {
    let n = scored.len();
    if n < constants::RANK_MIN_NAMES_PER_DAY {
        return None;
    }
    let decile = (n / 10).max(1);
    // Bottom decile: the `decile` lowest-signal names.
    scored.select_nth_unstable_by(decile.saturating_sub(1), |a, b| {
        a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal)
    });
    let bottom_mean = scored[..decile].iter().map(|(_, r)| *r).sum::<f64>() / decile as f64;
    // Top decile: the `decile` highest-signal names.
    scored.select_nth_unstable_by(n - decile, |a, b| {
        a.0.partial_cmp(&b.0).unwrap_or(std::cmp::Ordering::Equal)
    });
    let top_mean = scored[n - decile..]
        .iter()
        .map(|(_, r)| *r)
        .sum::<f64>()
        / decile as f64;
    Some(top_mean - bottom_mean)
}

/// Compute per-day top−bottom decile mean-return spreads.
///
/// For each date: score each present name by the weighted signal, partition into
/// deciles, and return (mean return of top decile) − (mean return of bottom
/// decile). Days with fewer than `constants::RANK_MIN_NAMES_PER_DAY` names are
/// dropped (deciles are meaningless on tiny panels). Pure function: rows in →
/// spreads out, one per surviving day in date order.
fn decile_spreads(rows: &[PanelRow], params: &SignalParams) -> Vec<f64> {
    let weights = params.weights_array();
    let mut spreads = Vec::new();
    for group in group_by_date(rows) {
        let mut scored: Vec<(f64, f64)> = group
            .iter()
            .map(|r| (score_member(&r.scores, &weights), r.fwd_return))
            .collect();
        if let Some(s) = group_spread(&mut scored) {
            spreads.push(s);
        }
    }
    spreads
}

/// Within-day permutation p-value for the decile spread. Null hypothesis: **the
/// signal carries no cross-sectional ordering** — for each day independently the
/// signal scores are reassigned to returns at random, while each day's realized
/// returns, the panel sizes, and the marginal signal distribution are all held
/// fixed. A genuine edge leaves the observed mean spread far in the right tail.
///
/// Returns (p-value, n_permutations). The RNG is seeded for reproducibility.
/// Pure function: panel in → p-value out.
fn permutation_pvalue(rows: &[PanelRow], params: &SignalParams, n_perms: usize) -> (f64, usize) {
    use rand::seq::SliceRandom;
    use rand::SeedableRng;
    let weights = params.weights_array();
    let mut rng = rand::rngs::StdRng::seed_from_u64(constants::RANK_PERMUTATION_SEED);

    // Precompute each member's signal once (returns are the values to shuffle).
    // Group as Vec<Vec<(signal, return)>> so each day can be shuffled in place.
    let mut days: Vec<Vec<(f64, f64)>> = group_by_date(rows)
        .into_iter()
        .map(|group| {
            group
                .iter()
                .map(|r| (score_member(&r.scores, &weights), r.fwd_return))
                .collect()
        })
        .collect();

    // Observed mean spread (real signal↔return pairing).
    let observed: f64 = {
        let mut s = Vec::new();
        for day in &days {
            let mut day = day.clone();
            if let Some(sp) = group_spread(&mut day) {
                s.push(sp);
            }
        }
        if s.is_empty() {
            return (1.0, 0);
        }
        s.iter().sum::<f64>() / s.len() as f64
    };

    // Null distribution: each permutation shuffles returns within each day
    // (signals stay put, returns get reassigned), recomputes the mean spread.
    let mut ge = 0usize;
    for _ in 0..n_perms {
        for day in &mut days {
            // Shuffle the RETURN slot only; signals (the sort key) stay put.
            let returns: Vec<f64> = day.iter().map(|(_, r)| *r).collect();
            let mut returns = returns;
            returns.shuffle(&mut rng);
            for (slot, r) in day.iter_mut().zip(returns.iter()) {
                slot.1 = *r;
            }
        }
        let mut s = Vec::new();
        for day in &days {
            let mut day = day.clone();
            if let Some(sp) = group_spread(&mut day) {
                s.push(sp);
            }
        }
        if s.is_empty() {
            continue;
        }
        let mean = s.iter().sum::<f64>() / s.len() as f64;
        if mean >= observed {
            ge += 1;
        }
    }
    let p = (ge as f64 + 1.0) / (n_perms as f64 + 1.0); // +1 smoothing
    (p, n_perms)
}

/// Sub-period stability: split the test days at their midpoint and report
/// per-half stats. A robust edge persists in both halves; a regime coincidence
/// tends to concentrate in one. Pure function.
fn subperiod_stability(rows: &[PanelRow], params: &SignalParams, lag: usize) -> (RankStats, RankStats) {
    let spreads = decile_spreads(rows, params);
    let mid = spreads.len() / 2;
    let (a, b) = spreads.split_at(mid);
    (rank_stats(a, lag), rank_stats(b, lag))
}

/// Group sorted-by-date rows into slices of the same `date`. Assumes `rows` is
/// ordered by `date` (the candle store returns ascending timestamps). Pure helper.
fn group_by_date(rows: &[PanelRow]) -> Vec<&[PanelRow]> {
    let mut out = Vec::new();
    if rows.is_empty() {
        return out;
    }
    let mut start = 0;
    for i in 1..=rows.len() {
        if i == rows.len() || rows[i].date != rows[start].date {
            out.push(&rows[start..i]);
            start = i;
        }
    }
    out
}

/// Build the (date, symbol) panel for one symbol at horizon H, look-ahead-free.
/// Scores come from the series up to `i`; the forward return is
/// `close[i+H]/close[i] − 1`. A name enters the panel only if it has a close at
/// `i+H` (survives the holding period — see the survivorship caveat).
fn collect_panel_rows(candles: &[model::Candle], benchmark: &[f64], horizon: usize) -> Vec<PanelRow> {
    let min_len = constants::EMA200_PERIOD as usize + horizon;
    if candles.len() < min_len {
        return Vec::new();
    }
    let mut rows = Vec::new();
    for i in (constants::EMA200_PERIOD as usize - 1)..(candles.len() - horizon) {
        let bench_slice = if i < benchmark.len() { &benchmark[..=i] } else { benchmark };
        let scores = crate::signal::indicator_scores(&candles[..=i], bench_slice);
        let fwd_return = candles[i + horizon].close / candles[i].close - 1.0;
        rows.push(PanelRow {
            date: candles[i].timestamp,
            scores,
            fwd_return,
        });
    }
    rows
}

/// Grid-search result on the ranking objective: the weight-set maximizing the
/// in-sample mean top−bottom decile spread, and that spread.
#[derive(Debug, Clone)]
pub struct RankCalibResult {
    pub params: SignalParams,
    pub weights: [f64; 7],
    pub in_sample_mean_spread: f64,
}

/// Find the weight-set maximizing the in-sample mean daily decile spread
/// (the ranking objective, distinct from `signal_backtest`'s pooled hit-rate
/// objective). Same 230,230-combo grid, step 5, sum 100. Ties broken toward the
/// higher mean. Pure function.
pub fn grid_search_rank(train_rows: &[PanelRow]) -> Option<RankCalibResult> {
    let combos = crate::signal_backtest::grid_weight_combos();
    let mut best: Option<RankCalibResult> = None;
    for w in combos {
        let params = crate::signal_backtest::params_from_weights(w);
        let spreads = decile_spreads(train_rows, &params);
        if spreads.is_empty() {
            continue;
        }
        let mean = spreads.iter().sum::<f64>() / spreads.len() as f64;
        let candidate = RankCalibResult {
            params,
            weights: w,
            in_sample_mean_spread: mean,
        };
        best = Some(match best {
            None => candidate,
            Some(prev) if mean > prev.in_sample_mean_spread + 1e-12 => candidate,
            Some(prev) => prev,
        });
    }
    best
}

// ── CLI entry point ───────────────────────────────────────────

/// Load ALL candles per symbol (no `CANDLE_COUNT` cap). The walk-forward test
/// needs the full available history — the production cap would silently drop
/// earlier regimes, which is exactly what the walk exists to evaluate.
fn load_all_candles_full(
    conn: &Connection,
    symbols: &[String],
) -> std::collections::HashMap<String, Vec<model::Candle>> {
    let mut map = std::collections::HashMap::new();
    for symbol in symbols {
        match crate::store::candle::get_all_candles(conn, symbol) {
            Ok(candles) if !candles.is_empty() => {
                map.insert(symbol.clone(), candles);
            }
            Ok(_) => log::warn!("No candles for {symbol}"),
            Err(e) => log::warn!("No candles for {symbol}: {e}"),
        }
    }
    map
}

/// Variant (a)'s documented calibrated weights (EMA200=60, ADX=35, RS=5) — the
/// weights from `signal_backtest`'s pooled-accuracy grid search, reused on the
/// ranking objective. A trend/momentum regime filter. Hardcoded (never
/// recalibrated for ranking) so both `run_rank` and `run_rank_walk` test the
/// identical, frozen weight-set.
fn documented_weights() -> SignalParams {
    SignalParams {
        weight_ema_alignment: 0.0,
        weight_ema200: 60.0,
        weight_macd: 0.0,
        weight_rsi: 0.0,
        weight_volume: 0.0,
        weight_rs: 5.0,
        weight_adx: 35.0,
    }
}

/// Build the full cross-sectional panel (all symbols, all available days) plus
/// per-date name counts. The panel is date-sorted (required by `group_by_date`).
/// Shared by `run_rank` (which then splits it) and `run_rank_walk` (which
/// evaluates it across sliding windows). Pure-ish: reads candles/spy only.
fn build_panel(
    candles_by_symbol: &std::collections::HashMap<String, Vec<model::Candle>>,
    spy_closes: &[f64],
    horizon: usize,
) -> (Vec<PanelRow>, std::collections::HashMap<u32, usize>) {
    let mut rows: Vec<PanelRow> = Vec::new();
    let mut n_names_by_date: std::collections::HashMap<u32, usize> =
        std::collections::HashMap::new();
    for candles in candles_by_symbol.values() {
        for r in collect_panel_rows(candles, spy_closes, horizon) {
            *n_names_by_date.entry(r.date).or_insert(0) += 1;
            rows.push(r);
        }
    }
    rows.sort_by_key(|r| r.date);
    (rows, n_names_by_date)
}

/// The two weight variants the ranking test reports. The first reuses the
/// documented calibrated weights from `signal_backtest`'s pooled-accuracy grid
/// search — "does my existing signal rank?" The second recalibrates on the
/// ranking objective itself — "could *any* weighting of these indicators rank?"
/// (the stronger, fairer test).
pub fn run_rank(
    conn: &Connection,
    symbols: &[String],
    horizon: usize,
) -> model::Result<()> {
    let candles_by_symbol = crate::signal_backtest::load_all_candles(conn, symbols);
    if candles_by_symbol.is_empty() {
        log::warn!("No candles loaded for any symbol; nothing to rank.");
        return Ok(());
    }
    let spy_closes = crate::signal::load_spy_closes(conn);

    let max_len = candles_by_symbol.values().map(|c| c.len()).max().unwrap_or(0);
    if max_len < constants::EMA200_PERIOD as usize + horizon {
        log::warn!("No series long enough for the {horizon}-day ranking panel.");
        return Ok(());
    }
    let split_idx = max_len * 2 / 3;
    // Calendar boundary: any (date, symbol) with date < boundary_date → train,
    // date >= boundary_date → test. Derived from the longest symbol's candle at
    // the split index (an approximate but consistent calendar cut).
    let boundary_date = candles_by_symbol
        .values()
        .max_by_key(|c| c.len())
        .map(|c| c[split_idx.min(c.len() - 1)].timestamp)
        .unwrap_or(0);

    let (all_rows, n_names_by_date) = build_panel(&candles_by_symbol, &spy_closes, horizon);
    let mut train_rows = Vec::new();
    let mut test_rows = Vec::new();
    for r in all_rows {
        if r.date < boundary_date {
            train_rows.push(r);
        } else {
            test_rows.push(r);
        }
    }

    let n_symbols = candles_by_symbol.len();
    let median_panel = median_panel_size(&n_names_by_date);
    log::info!(
        "Ranking panel: {n_symbols} symbols, {} train days, {} test days, boundary ts {boundary_date}, median panel {median_panel} names",
        train_rows.len(), test_rows.len()
    );

    print_rank_header(n_symbols, horizon, median_panel, boundary_date);

    let documented = documented_weights();
    let test_stats_a = rank_stats(&decile_spreads(&test_rows, &documented), horizon);
    print_rank_variant("(a) documented calibrated weights", &documented, &test_stats_a);

    // Independent validation of variant (a) — the question "is it real?"
    // Two threats, two tests, both on the existing test data:
    //   (1) Permutation: is the +spread a fluke of these returns, or does a
    //       meaningless signal rarely produce it? Within-day shuffle null.
    //   (2) Sub-period stability: does the spread persist across both halves of
    //       the test window, or concentrate in one (a regime coincidence)?
    log::info!(
        "Permutation test (within-day shuffle, {} perms) on variant (a)...",
        constants::RANK_PERMUTATIONS
    );
    let (pval, n_perms) = permutation_pvalue(&test_rows, &documented, constants::RANK_PERMUTATIONS);
    let (half1, half2) = subperiod_stability(&test_rows, &documented, horizon);
    print_rank_validation(&test_stats_a, pval, n_perms, &half1, &half2);

    // Variant (b): recalibrate on the ranking objective, then evaluate OOS.
    let calib = match grid_search_rank(&train_rows) {
        Some(c) => c,
        None => {
            log::warn!("Rank grid search found no viable weight-set.");
            return Ok(());
        }
    };
    let train_stats_b = rank_stats(&decile_spreads(&train_rows, &calib.params), horizon);
    let test_stats_b = rank_stats(&decile_spreads(&test_rows, &calib.params), horizon);
    print_rank_calib(&calib, &train_stats_b, &test_stats_b);

    print_rank_footer(horizon);
    Ok(())
}

/// Median names-per-day across the panel. Pure helper.
fn median_panel_size(n_names_by_date: &std::collections::HashMap<u32, usize>) -> usize {
    let mut counts: Vec<usize> = n_names_by_date.values().copied().collect();
    counts.sort_unstable();
    if counts.is_empty() {
        0
    } else {
        counts[counts.len() / 2]
    }
}

/// A single walk-forward OOS window: its date range and the variant-(a) stats
/// over the days that fall inside it. Each window is treated as an independent
/// out-of-sample period for the FROZEN documented weights (never retrained on
/// the window itself).
#[derive(Debug, Clone)]
pub struct WalkWindow {
    pub start_ts: u32,
    pub end_ts: u32,
    pub stats: RankStats,
}

/// Slice a date-sorted panel to a `[start_ts, end_ts)` window. Pure helper.
fn panel_in_window(rows: &[PanelRow], start_ts: u32, end_ts: u32) -> Vec<PanelRow> {
    rows.iter()
        .filter(|r| r.date >= start_ts && r.date < end_ts)
        .copied()
        .collect()
}

/// Walk-forward evaluation of the FROZEN documented weights across the full
/// history. The panel is partitioned into contiguous, non-overlapping windows
/// of `window_len` trading days (by distinct date count); each is scored as an
/// independent OOS period. This exposes whether the +spread is a 2025-26 regime
/// coincidence or persists across earlier regimes — the prized 2021-10→2022-12
/// bear that the standard split never tests against.
///
/// The weights are deliberately NOT retrained per window: a robust ranking
/// factor survives unseen regimes with frozen weights; one that needs per-regime
/// refit has no deployable edge.
pub fn run_rank_walk(
    conn: &Connection,
    symbols: &[String],
    horizon: usize,
    window_len: usize,
) -> model::Result<()> {
    let candles_by_symbol = load_all_candles_full(conn, symbols);
    if candles_by_symbol.is_empty() {
        log::warn!("No candles loaded for any symbol; nothing to rank.");
        return Ok(());
    }
    let spy_closes = crate::signal::load_spy_closes_full(conn);
    let (all_rows, n_names_by_date) = build_panel(&candles_by_symbol, &spy_closes, horizon);
    if all_rows.is_empty() {
        log::warn!("Empty panel; nothing to walk.");
        return Ok(());
    }

    // Distinct dates in order (the panel is date-sorted).
    let mut dates: Vec<u32> = Vec::new();
    for r in &all_rows {
        if dates.last() != Some(&r.date) {
            dates.push(r.date);
        }
    }
    let n_symbols = candles_by_symbol.len();
    let median_panel = median_panel_size(&n_names_by_date);
    let first = *dates.first().unwrap();
    let last = *dates.last().unwrap();

    print_walk_header(n_symbols, horizon, window_len, median_panel, first, last);

    let documented = documented_weights();

    // Non-overlapping contiguous windows of `window_len` distinct dates.
    let mut windows: Vec<WalkWindow> = Vec::new();
    let mut idx = 0;
    while idx < dates.len() {
        let end = (idx + window_len).min(dates.len());
        let start_ts = dates[idx];
        let end_ts = dates[end - 1]; // inclusive end for display
        let slice = panel_in_window(&all_rows, start_ts, dates[end - 1] + 1);
        let stats = rank_stats(&decile_spreads(&slice, &documented), horizon);
        windows.push(WalkWindow { start_ts, end_ts, stats });
        idx = end;
    }

    print_walk_windows(&windows);

    // Aggregate rollup: all windows combined = the full history as one OOS
    // period (the strictest test — does the spread hold across ALL regimes at
    // once, not just window-by-window?).
    let full = rank_stats(&decile_spreads(&all_rows, &documented), horizon);
    print_walk_rollup(&full, &windows);

    print_rank_footer(horizon);
    Ok(())
}

// ── Output ────────────────────────────────────────────────────

fn print_rank_header(n_symbols: usize, horizon: usize, median_panel: usize, boundary: u32) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "=".repeat(78));
    let _ = writeln!(
        out,
        "Cross-sectional ranking — {n_symbols} symbols, {horizon}d forward return, out-of-sample (recent 1/3)"
    );
    let _ = writeln!(out, "{}", "=".repeat(78));
    let _ = writeln!(out, "Question: does the top decile outperform the bottom decile over {horizon}d?");
    let _ = writeln!(out, "Median panel size: {median_panel} names/day. Calendar split at ts={boundary}.");
    let _ = writeln!(out, "{}", "-".repeat(78));
}

fn print_rank_variant(label: &str, params: &SignalParams, stats: &RankStats) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{label}");
    let _ = writeln!(
        out,
        "  weights: EMA={} EMA200={} MACD={} RSI={} Vol={} RS={} ADX={}",
        params.weight_ema_alignment, params.weight_ema200, params.weight_macd,
        params.weight_rsi, params.weight_volume, params.weight_rs, params.weight_adx
    );
    print_stats_line(&mut out, "  OOS", stats);
}

fn print_rank_calib(calib: &RankCalibResult, train: &RankStats, test: &RankStats) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "-".repeat(78));
    let _ = writeln!(out, "(b) recalibrated on ranking objective (maximize IS mean spread)");
    let _ = writeln!(
        out,
        "  weights: EMA={} EMA200={} MACD={} RSI={} Vol={} RS={} ADX={}",
        calib.weights[0], calib.weights[1], calib.weights[2],
        calib.weights[3], calib.weights[4], calib.weights[5], calib.weights[6]
    );
    print_stats_line(&mut out, "  IS ", train);
    print_stats_line(&mut out, "  OOS", test);
}

/// Print the independent-validation block for variant (a): the permutation
/// p-value (is the spread distinguishable from a meaningless signal?) and the
/// sub-period stability (does it persist across both halves of the test window?).
fn print_rank_validation(
    oos: &RankStats,
    pval: f64,
    n_perms: usize,
    half1: &RankStats,
    half2: &RankStats,
) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "-".repeat(78));
    let _ = writeln!(out, "Independent validation of (a) — is the edge real?");
    let _ = writeln!(out, "{}", "-".repeat(78));
    let _ = writeln!(
        out,
        "  permutation p-value: {:.4}  (within-day shuffle, {} perms; observed spread {:+.4})",
        pval, n_perms, oos.mean_spread
    );
    let verdict = if pval < 0.05 {
        "distinguishable from noise (< 0.05)"
    } else {
        "NOT distinguishable from noise (>= 0.05)"
    };
    let _ = writeln!(out, "    → {verdict}");
    let _ = writeln!(out, "  sub-period stability (test window split at midpoint):");
    print_stats_line(&mut out, "    half 1", half1);
    print_stats_line(&mut out, "    half 2", half2);
    let stable = half1.mean_spread > 0.0 && half2.mean_spread > 0.0;
    let _ = writeln!(
        out,
        "    → {}",
        if stable { "positive in BOTH halves (stable)" } else { "sign flips between halves (unstable)" }
    );
}

fn print_stats_line(out: &mut impl Write, tag: &str, stats: &RankStats) {
    let _ = writeln!(
        out,
        "{tag}  mean spread {:+.4}  NW t={:+.2}  sharpe {:+.2}  %>0 {:.0}%  ({} days)",
        stats.mean_spread,
        stats.nw_t_stat,
        stats.sharpe,
        stats.pct_positive * 100.0,
        stats.n_days
    );
}

fn print_rank_footer(horizon: usize) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "-".repeat(78));
    let _ = writeln!(out, "mean spread = top-decile mean return − bottom-decile mean return (per day).");
    let _ = writeln!(out, "NW t = Newey-West t-stat (lag={horizon}, Bartlett) — robust to {horizon}-day overlap.");
    let _ = writeln!(out, "CAVEATS: (1) survivorship — names need a close at t+H, inflating the spread;");
    let _ = writeln!(out, "         (2) single regime — candle store spans one net-bull window.");
    let _ = writeln!(out, "{}", "=".repeat(78));
}

fn fmt_ts(ts: u32) -> String {
    // Unix-seconds to YYYY-MM-DD (UTC). Avoids pulling chrono-format deps.
    let days = ts / 86400;
    let (y, m, d) = civil_from_days(days as i64);
    format!("{y:04}-{m:02}-{d:02}")
}

/// Convert days-since-1970-01-01 to (year, month, day). Howard Hinnant's algorithm.
fn civil_from_days(z: i64) -> (i64, u32, u32) {
    let z = z + 719468;
    let era = if z >= 0 { z } else { z - 146096 } / 146097;
    let doe = (z - era * 146097) as u64; // [0, 146096]
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365; // [0, 399]
    let y = yoe as i64 + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100); // [0, 365]
    let mp = (5 * doy + 2) / 153; // [0, 11]
    let d = (doy - (153 * mp + 2) / 5 + 1) as u32; // [1, 31]
    let m = if mp < 10 { mp + 3 } else { mp - 9 } as u32; // [1, 12]
    (y + if m <= 2 { 1 } else { 0 }, m, d)
}

fn print_walk_header(
    n_symbols: usize,
    horizon: usize,
    window_len: usize,
    median_panel: usize,
    first: u32,
    last: u32,
) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "=".repeat(90));
    let _ = writeln!(
        out,
        "Walk-forward ranking (FROZEN documented weights) — {n_symbols} symbols, {horizon}d, window {window_len}d"
    );
    let _ = writeln!(out, "{}", "=".repeat(90));
    let _ = writeln!(
        out,
        "History: {} → {}   median panel {median_panel} names/day",
        fmt_ts(first),
        fmt_ts(last)
    );
    let _ = writeln!(out, "Question: does the spread persist across EARLIER regimes, not just 2025-26?");
    let _ = writeln!(out, "Weights never retrained per window — a robust factor survives unseen regimes frozen.");
    let _ = writeln!(out, "{}", "-".repeat(90));
    let _ = writeln!(
        out,
        "{:<10} {:<11} {:>12} {:>8} {:>9} {:>9} {:>8}",
        "WINDOW", "", "MEAN SPREAD", "NW t", "SHARPE", "%>0", "N_DAYS"
    );
    let _ = writeln!(out, "{}", "-".repeat(90));
}

fn print_walk_windows(windows: &[WalkWindow]) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    for (i, w) in windows.iter().enumerate() {
        let _ = writeln!(
            out,
            "win {:<5} {} → {} {:>+12.4} {:>+8.2} {:>+9.2} {:>7.0}% {:>8}",
            i + 1,
            fmt_ts(w.start_ts),
            fmt_ts(w.end_ts),
            w.stats.mean_spread,
            w.stats.nw_t_stat,
            w.stats.sharpe,
            w.stats.pct_positive * 100.0,
            w.stats.n_days
        );
    }
}

fn print_walk_rollup(full: &RankStats, windows: &[WalkWindow]) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{}", "-".repeat(90));
    let pos = windows.iter().filter(|w| w.stats.mean_spread > 0.0).count();
    let _ = writeln!(
        out,
        "rollup: {}/{} windows positive mean spread",
        pos,
        windows.len()
    );
    let _ = writeln!(
        out,
        "FULL HISTORY (all windows as one OOS period): mean spread {:+.4}  NW t {:+.2}  sharpe {:+.2}  %>0 {:.0}%  ({} days)",
        full.mean_spread,
        full.nw_t_stat,
        full.sharpe,
        full.pct_positive * 100.0,
        full.n_days
    );
    let _ = writeln!(out, "{}", "-".repeat(90));
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Build a PanelRow with given scores and forward return (date = index).
    fn prow(date: u32, scores: [f64; 7], fwd_return: f64) -> PanelRow {
        PanelRow { date, scores, fwd_return }
    }

    fn default_params() -> SignalParams {
        SignalParams::default()
    }

    #[test]
    fn panel_in_window_filters_by_date_half_open() {
        let rows = vec![
            prow(100, [0.5; 7], 0.0),
            prow(200, [0.5; 7], 0.0),
            prow(300, [0.5; 7], 0.0),
            prow(400, [0.5; 7], 0.0),
        ];
        // [200, 400) → dates 200, 300.
        let slice = panel_in_window(&rows, 200, 400);
        assert_eq!(slice.len(), 2);
        assert_eq!(slice[0].date, 200);
        assert_eq!(slice[1].date, 300);
    }

    #[test]
    fn civil_from_days_known_dates() {
        // 1970-01-01 = day 0.
        assert_eq!(civil_from_days(0), (1970, 1, 1));
        // 2021-10-15 — the OOS history start.
        assert_eq!(civil_from_days(18915), (2021, 10, 15));
        // 2026-07-29 — recent (20663 days since epoch).
        assert_eq!(civil_from_days(20663), (2026, 7, 29));
    }

    #[test]
    fn documented_weights_match_grid_result() {
        // The frozen variant-(a) weights from results.md.
        let w = documented_weights();
        assert_eq!(w.weight_ema_alignment, 0.0);
        assert_eq!(w.weight_ema200, 60.0);
        assert_eq!(w.weight_macd, 0.0);
        assert_eq!(w.weight_rsi, 0.0);
        assert_eq!(w.weight_volume, 0.0);
        assert_eq!(w.weight_rs, 5.0);
        assert_eq!(w.weight_adx, 35.0);
    }

    #[test]
    fn newey_west_se_falls_back_for_no_lag() {
        // With lag 0, behaves like plain SEM.
        let s = vec![1.0, 2.0, 3.0, 4.0];
        let mean: f64 = 2.5;
        let var = s.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / 4.0;
        let expected = (var / 4.0).sqrt();
        assert!((newey_west_se(&s, 0) - expected).abs() < 1e-9);
    }

    #[test]
    fn newey_west_se_positive_for_autocorrelated_series() {
        // Strongly positively autocorrelated series → NW SE should exceed the
        // naive (ignore-autocorrelation) SEM, since adjacent terms reinforce.
        let s: Vec<f64> = (0..100).map(|i| i as f64 * 0.1).collect(); // smooth ramp
        let nw = newey_west_se(&s, 5);
        assert!(nw > 0.0);
        // Naive SEM for comparison.
        let mean = s.iter().sum::<f64>() / s.len() as f64;
        let var = s.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / s.len() as f64;
        let naive = (var / s.len() as f64).sqrt();
        assert!(nw > naive, "NW SE {nw} should exceed naive {naive} under positive AC");
    }

    #[test]
    fn rank_stats_empty_returns_zeros() {
        let s = rank_stats(&[], 20);
        assert_eq!(s.n_days, 0);
        assert_eq!(s.mean_spread, 0.0);
    }

    #[test]
    fn rank_stats_mean_and_pct_positive() {
        let s = rank_stats(&[0.01, -0.02, 0.03, 0.04], 20);
        assert_eq!(s.n_days, 4);
        assert!((s.mean_spread - 0.015).abs() < 1e-9);
        // 3 of 4 spreads are positive → 0.75.
        assert!((s.pct_positive - 0.75).abs() < 1e-9);
    }

    #[test]
    fn decile_spreads_drops_tiny_panels() {
        // Single day with 2 names (< RANK_MIN_NAMES_PER_DAY) → dropped.
        let rows = vec![
            prow(0, [0.9; 7], 0.1),
            prow(0, [0.1; 7], -0.1),
        ];
        let spreads = decile_spreads(&rows, &default_params());
        assert!(spreads.is_empty(), "tiny panel should be dropped");
    }

    #[test]
    fn decile_spreads_positive_when_signal_predicts_return() {
        // 20 names on one day: high score → high forward return (perfect ranking).
        // Signal here uses default weights; make score monotonic in fwd_return by
        // setting all indicators to a value that encodes rank (all-equal → score=v).
        let rows: Vec<PanelRow> = (0..20)
            .map(|i| {
                let v = i as f64 / 20.0; // 0.0 .. 0.95
                prow(0, [v; 7], v) // higher score → higher return
            })
            .collect();
        let spreads = decile_spreads(&rows, &default_params());
        assert_eq!(spreads.len(), 1);
        assert!(spreads[0] > 0.0, "perfect ranking → positive spread, got {}", spreads[0]);
    }

    #[test]
    fn decile_spreads_zero_when_signal_uninformative() {
        // All scores identical → deciles are arbitrary → expected spread ~0.
        let rows: Vec<PanelRow> = (0..20)
            .map(|i| {
                let r = if i < 10 { 0.1 } else { -0.1 };
                prow(0, [0.5; 7], r)
            })
            .collect();
        let spreads = decile_spreads(&rows, &default_params());
        assert_eq!(spreads.len(), 1);
        // top decile = indices [10..20] which all have -0.1; bottom [0..10] = +0.1
        // → spread = -0.2. But selection among equal scores is arbitrary; the
        // point is the *signal* carries no info. Verify magnitude is bounded.
        assert!(spreads[0].abs() <= 0.2 + 1e-9);
    }

    #[test]
    fn score_member_respects_weights() {
        // All weight on ema200 (scores[1]) → signal = ema200 score.
        let w = [0.0, 100.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        assert!((score_member(&[0.3, 0.7, 0.9, 0.1, 0.5, 0.5, 0.5], &w) - 0.7).abs() < 1e-9);
    }

    #[test]
    fn score_member_zero_weight_is_neutral() {
        let w = [0.0; 7];
        assert!((score_member(&[0.9; 7], &w) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn group_spread_positive_when_signal_ranks_return() {
        // 20 names: signal and return both rising → positive spread.
        let mut scored: Vec<(f64, f64)> = (0..20)
            .map(|i| { let v = i as f64 / 20.0; (v, v) })
            .collect();
        let s = group_spread(&mut scored).unwrap();
        assert!(s > 0.0, "perfect ranking → positive spread, got {s}");
    }

    #[test]
    fn group_spread_none_when_panel_too_small() {
        let mut scored = vec![(0.9, 0.1), (0.1, -0.1)];
        assert!(group_spread(&mut scored).is_none());
    }

    #[test]
    fn permutation_pvalue_low_for_real_signal() {
        // A panel where signal strongly predicts return: the real pairing's mean
        // spread should sit far in the right tail of the within-day-shuffle null
        // → low p-value. 5 days × 30 names, signal = return (perfect ordering).
        let mut rows = Vec::new();
        for day in 0..5u32 {
            for i in 0..30 {
                let v = i as f64 / 30.0;
                let scores = [v; 7]; // all indicators encode the rank equally
                rows.push(prow(day, scores, v));
            }
        }
        let params = default_params();
        let (p, n) = permutation_pvalue(&rows, &params, 500);
        assert_eq!(n, 500);
        assert!(p < 0.05, "real signal should reject the null, got p={p}");
    }

    #[test]
    fn permutation_pvalue_high_for_meaningless_signal() {
        // All signals identical → no cross-sectional ordering exists → the real
        // pairing is no better than a shuffle → p-value should be large (>= 0.5).
        let mut rows = Vec::new();
        for day in 0..5u32 {
            for i in 0..30 {
                let r = if i < 15 { 0.1 } else { -0.1 };
                rows.push(prow(day, [0.5; 7], r));
            }
        }
        let params = default_params();
        let (p, _) = permutation_pvalue(&rows, &params, 200);
        assert!(p >= 0.3, "meaningless signal should not reject, got p={p}");
    }

    #[test]
    fn subperiod_stability_splits_at_midpoint() {
        // 10 distinct days, each with 30 names; signal predicts return.
        let mut rows = Vec::new();
        for day in 0..10u32 {
            for i in 0..30 {
                let v = i as f64 / 30.0;
                rows.push(prow(day, [v; 7], v));
            }
        }
        let (h1, h2) = subperiod_stability(&rows, &default_params(), 20);
        // 10 days → 5 per half.
        assert_eq!(h1.n_days, 5);
        assert_eq!(h2.n_days, 5);
        assert!(h1.mean_spread > 0.0 && h2.mean_spread > 0.0);
    }

    #[test]
    fn group_by_date_splits_on_date_change() {
        let rows = vec![
            prow(1, [0.5; 7], 0.0),
            prow(1, [0.6; 7], 0.0),
            prow(2, [0.5; 7], 0.0),
        ];
        let groups = group_by_date(&rows);
        assert_eq!(groups.len(), 2);
        assert_eq!(groups[0].len(), 2);
        assert_eq!(groups[1].len(), 1);
    }

    #[test]
    fn grid_search_rank_finds_perfect_separator() {
        // 5 days × 20 names each. ema200 (scores[1]) tracks the rank perfectly;
        // the OTHER six indicators are ANTI-correlated with it. Ranking cares only
        // about ordering, so the optimum must keep the net coefficient on the rank
        // positive — i.e. ema200 must outweigh the anti-correlated weights. This
        // produces a DEGENERATE family of optima (any split preserving the sign),
        // the ranking analogue of collinearity; we assert the robust invariant:
        // ema200 carries the plurality of weight (largest single indicator).
        let mut rows = Vec::new();
        for day in 0..5u32 {
            for i in 0..20 {
                let v = i as f64 / 20.0; // rank 0..0.95
                let anti = 1.0 - v; // anti-correlated noise
                let scores = [anti, v, anti, anti, anti, anti, anti];
                rows.push(prow(day, scores, v)); // return tracks the rank
            }
        }
        let best = grid_search_rank(&rows).expect("should find a best");
        assert!(best.in_sample_mean_spread > 0.0, "perfect ranking → positive spread");
        assert!(
            best.weights[1] >= 50.0,
            "ema200 should carry the plurality, got {:?}",
            best.weights
        );
    }

    #[test]
    fn grid_search_rank_returns_none_when_all_panels_dropped() {
        // Every panel too small to form deciles → empty spreads everywhere.
        let rows = vec![prow(0, [0.5; 7], 0.0), prow(1, [0.5; 7], 0.0)];
        assert!(grid_search_rank(&rows).is_none());
    }
}
