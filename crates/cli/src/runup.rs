//! Run-up → breach backtest (research tool, 2026-11).
//!
//! Tests the hypothesis: "after a large short-term run-up, a stock is more
//! likely to have a sharp drop that breaches put strikes." Unlike the
//! `up-down-signal` effort (direction prediction), this measures the FORWARD
//! TAIL — P(forward min-low breaches a strike line) — conditioned on the
//! past-N-day return, bucketed into rank buckets, PLUS the trading outcome of
//! selling at the band-top: synthetic premium, close-based assignment loss,
//! net P&L per share.
//!
//! Two-phase design: [`extract_runup_series`] computes the expensive per-day
//! max-drop stats ONCE (config-independent); [`breach_table_for_stretch`] then
//! evaluates any stretch (floor, slope, cap) cheaply from the cached stats —
//! which is what makes [`grid_search`] over the parameter space feasible.
//!
//! Pure seam; the CLI subcommand `backtest-runup` is a thin DB-load-and-print
//! wrapper.

use market_int_core::{constants, greeks, maxdrop, model, option, stats};

/// Realized-vol window for the vol-clustering diagnostic column (matches the
/// backtest's `vol_window` and the option collector's usage).
const VOL_WINDOW: usize = 20;

/// Synthetic IV = HV × this (matches the backtest's `iv_multiplier` default
/// and the safety-calibration pricing). Premium/P&L columns are indicative
/// only — real-market IV varies per name.
const SYNTHETIC_IV_MULTIPLIER: f64 = 1.3;

/// Tunables for the run-up analysis. Defaults mirror the 5-day recommendation
/// horizon (condition = past 5 days, outcome = next 5 days).
#[derive(Debug, Clone)]
pub struct RunupParams {
    /// Past-N-day return used as the condition ("run-up"). Also the max-drop
    /// window and DTE for the band-top line (horizon-matched band).
    pub condition_days: usize,
    /// Forward window over which the min-low is measured.
    pub horizon_days: usize,
    /// Fixed breach depths (fractions below entry close).
    pub depths: Vec<f64>,
    /// Also measure breach against the production max_drop band's top strike
    /// (the shallow end of the band the scorer would place).
    pub use_band_top: bool,
    /// Number of run-up buckets (quintiles = 5).
    pub quintiles: usize,
}

impl Default for RunupParams {
    fn default() -> Self {
        Self {
            condition_days: 5,
            horizon_days: 5,
            depths: vec![0.03, 0.05, 0.08],
            use_band_top: true,
            quintiles: 5,
        }
    }
}

/// A stretch calibration: stretch = min(1 + slope × max(0, runup − floor), cap).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct StretchConfig {
    pub floor: f64,
    pub slope: f64,
    pub cap: f64,
}

impl StretchConfig {
    /// Production constants for 5-day timeframe.
    pub fn production() -> Self {
        Self {
            floor: constants::RUNUP_STRETCH_FLOOR,
            slope: constants::RUNUP_STRETCH_SLOPE,
            cap: constants::RUNUP_STRETCH_CAP,
        }
    }

    /// Production constants for 20-day timeframe.
    pub fn production_20d() -> Self {
        Self {
            floor: constants::RUNUP_20D_STRETCH_FLOOR,
            slope: constants::RUNUP_20D_STRETCH_SLOPE,
            cap: constants::RUNUP_20D_STRETCH_CAP,
        }
    }

    /// Production constants matching the given horizon period.
    pub fn production_for_period(period: usize) -> Self {
        if period >= 20 {
            Self::production_20d()
        } else {
            Self::production()
        }
    }

    /// No stretch at all — the pre-fix baseline.
    pub fn no_stretch() -> Self {
        Self { floor: 0.0, slope: 0.0, cap: 1.0 }
    }

    pub fn stretch(&self, runup: f64) -> f64 {
        option::runup_stretch_with(runup, self.floor, self.slope, self.cap)
    }
}

/// One (run-up → forward tail) observation at a point in time, with the
/// config-independent band inputs cached (phase 1 of the two-phase design).
#[derive(Debug, Clone, Copy)]
pub struct RunupPoint {
    /// Unix-second timestamp of the observation day's candle.
    pub obs_ts: u32,
    /// Past-N-day close return at the observation day: close[t]/close[t-N] − 1.
    pub runup: f64,
    /// Entry close (close[t]) — the strike lines are placed relative to it.
    pub baseline: f64,
    /// Forward min-low as a fraction of the entry close:
    /// min(low[t+1..=t+horizon]) / close[t] − 1 (≤ 0 means "dropped").
    pub fwd_min_low_frac: f64,
    /// Forward end return: close[t+horizon] / close[t] − 1.
    pub fwd_end_return: f64,
    /// Recent realized vol at the observation day (vol-clustering diagnostic
    /// and the synthetic-IV input for the band-top premium).
    pub vol: f64,
    /// Max-drop stats over the history up to t, window = condition_days:
    /// (97th-percentile drop, EMA(5)-of-drops). None when the history has
    /// fewer than two positive window drops (no band can be placed).
    pub band_stats: Option<(f64, f64)>,
}

/// Phase 1: one point per eligible day — the day needs `condition_days` of
/// prior closes and `horizon_days` of forward candles. The expensive part
/// (max-drop stats over each prefix) is computed here, ONCE, independent of
/// any stretch configuration.
pub fn extract_runup_series(
    candles: &[model::Candle],
    params: &RunupParams,
) -> Vec<RunupPoint> {
    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
    let last_t = candles.len().saturating_sub(1 + params.horizon_days);
    let mut points = Vec::new();
    for t in params.condition_days..=last_t {
        let baseline = closes[t];
        let fwd_min_low = candles[t + 1..=t + params.horizon_days]
            .iter()
            .map(|c| c.low)
            .fold(f64::INFINITY, f64::min);
        let band_stats = maxdrop::compute_max_drop_stats_with_percentile(
            &candles[..=t],
            params.condition_days,
            constants::PERCENTILE,
        );
        points.push(RunupPoint {
            obs_ts: candles[t].timestamp,
            runup: closes[t] / closes[t - params.condition_days] - 1.0,
            baseline,
            fwd_min_low_frac: fwd_min_low / baseline - 1.0,
            fwd_end_return: closes[t + params.horizon_days] / baseline - 1.0,
            vol: stats::estimate_historical_volatility(&closes[..=t], VOL_WINDOW),
            band_stats,
        });
    }
    points
}

/// Phase 2 (cheap): the band's top strike for one point under one stretch
/// config. The stretch is pre-applied to the cached drops and runup is passed
/// as 0 so the production constants aren't applied twice.
pub fn band_top_strike(
    point: &RunupPoint,
    params: &RunupParams,
    cfg: &StretchConfig,
) -> Option<f64> {
    let (percentile_drop, ema_drop) = point.band_stats?;
    let stretch = cfg.stretch(point.runup);
    Some(
        option::calculate_adjusted_strike_range(
            point.baseline,
            percentile_drop * stretch,
            ema_drop * stretch,
            params.condition_days as u32,
            params.condition_days,
            1.0,
            0.0,
        )
        .1,
    )
}

/// Aggregated breach stats for one run-up bucket (1 = biggest losers/dippers,
/// N = biggest gainers/rippers).
#[derive(Debug, Clone)]
pub struct QuintileRow {
    pub quintile: usize,
    pub n: usize,
    /// Observed run-up range within the bucket (0.0/0.0 when empty).
    pub runup_min: f64,
    pub runup_max: f64,
    /// Breach count per fixed depth, same order as `params.depths`.
    pub depth_breaches: Vec<BreachCount>,
    /// Touch-breach count against the band's top strike (intraday low crosses
    /// the strike at any point in the forward window).
    pub band_top_breaches: usize,
    /// Mean forward min-low fraction across the bucket.
    pub avg_fwd_min_low_frac: f64,
    /// Mean forward end return across the bucket.
    pub avg_fwd_end_return: f64,
    /// Mean recent realized vol across the bucket (vol-clustering diagnostic).
    pub avg_vol: f64,
    /// Mean synthetic premium of a band-top put (per share).
    pub avg_band_top_premium: f64,
    /// Mean net P&L of selling a band-top put (per share): premium minus
    /// (strike − close-at-expiry) when the close lands below the strike.
    /// Close-based, mirroring backtest.rs's assignment math (no day-after
    /// close here — research approximation).
    pub avg_band_top_pnl: f64,
}

/// Breach count at one fixed depth line.
#[derive(Debug, Clone)]
pub struct BreachCount {
    pub depth: f64,
    pub breaches: usize,
}

/// The pooled quintile table.
#[derive(Debug, Clone)]
pub struct BreachTable {
    pub rows: Vec<QuintileRow>,
}

/// Phase 2: buckets the series into `params.quintiles` equal-size rank buckets
/// by run-up (ascending: bucket 1 = lowest run-ups, bucket N = biggest
/// rippers) and aggregates breach stats PLUS band-top premium/P&L under one
/// stretch config.
pub fn breach_table_for_stretch(
    series: &[RunupPoint],
    params: &RunupParams,
    cfg: &StretchConfig,
) -> BreachTable {
    let q = params.quintiles.max(1);
    let mut sorted: Vec<&RunupPoint> = series.iter().collect();
    sorted.sort_by(|a, b| a.runup.total_cmp(&b.runup));

    let mut rows: Vec<QuintileRow> = (1..=q)
        .map(|k| QuintileRow {
            quintile: k,
            n: 0,
            runup_min: 0.0,
            runup_max: 0.0,
            depth_breaches: params
                .depths
                .iter()
                .map(|&d| BreachCount { depth: d, breaches: 0 })
                .collect(),
            band_top_breaches: 0,
            avg_fwd_min_low_frac: 0.0,
            avg_fwd_end_return: 0.0,
            avg_vol: 0.0,
            avg_band_top_premium: 0.0,
            avg_band_top_pnl: 0.0,
        })
        .collect();

    for (rank, point) in sorted.iter().enumerate() {
        let bucket = rank * q / sorted.len(); // rank-based equal split
        let row = &mut rows[bucket];
        row.n += 1;
        if row.n == 1 || point.runup < row.runup_min {
            row.runup_min = point.runup;
        }
        if row.n == 1 || point.runup > row.runup_max {
            row.runup_max = point.runup;
        }
        for (bc, &depth) in row.depth_breaches.iter_mut().zip(&params.depths) {
            if point.fwd_min_low_frac <= -depth {
                bc.breaches += 1;
            }
        }
        if let Some(strike) = band_top_strike(point, params, cfg) {
            if point.fwd_min_low_frac * point.baseline + point.baseline <= strike {
                row.band_top_breaches += 1;
            }
            // Band-top put, synthetic IV = HV × 1.3 (matches the backtest and
            // safety-calibration pricing). P&L is close-based at expiry.
            let t_years = params.horizon_days as f64 / 252.0;
            let premium = greeks::black_scholes_put(
                point.baseline,
                strike,
                t_years,
                0.0,
                0.0,
                point.vol * SYNTHETIC_IV_MULTIPLIER,
            );
            let close_at_expiry = point.baseline * (1.0 + point.fwd_end_return);
            let loss = (strike - close_at_expiry).max(0.0);
            row.avg_band_top_premium += premium;
            row.avg_band_top_pnl += premium - loss;
        }
        row.avg_fwd_min_low_frac += point.fwd_min_low_frac;
        row.avg_fwd_end_return += point.fwd_end_return;
        row.avg_vol += point.vol;
    }

    for row in &mut rows {
        if row.n > 0 {
            let n = row.n as f64;
            row.avg_fwd_min_low_frac /= n;
            row.avg_fwd_end_return /= n;
            row.avg_vol /= n;
            row.avg_band_top_premium /= n;
            row.avg_band_top_pnl /= n;
        }
    }

    BreachTable { rows }
}

/// One grid-search candidate's scorecard.
#[derive(Debug, Clone)]
pub struct GridResult {
    pub config: StretchConfig,
    /// Overall mean band-top P&L per share across all buckets.
    pub overall_avg_pnl: f64,
    /// Mean band-top P&L of the WORST bucket (n > 0) — the maxi-min score:
    /// a config is only as good as its most exposed bucket.
    pub worst_bucket_pnl: f64,
    /// Touch-breach rate of the top (ripper) bucket under this config.
    pub top_bucket_touch_breach: f64,
}

/// Phase 2 × N: evaluate a list of stretch configs on the same cached series.
pub fn grid_search(
    series: &[RunupPoint],
    params: &RunupParams,
    configs: &[StretchConfig],
) -> Vec<GridResult> {
    configs
        .iter()
        .map(|cfg| {
            let table = breach_table_for_stretch(series, params, cfg);
            let mut rows: Vec<&QuintileRow> =
                table.rows.iter().filter(|r| r.n > 0).collect();
            rows.sort_by(|a, b| a.avg_band_top_pnl.total_cmp(&b.avg_band_top_pnl));
            let overall_n: usize = table.rows.iter().map(|r| r.n).sum();
            let overall_pnl = table
                .rows
                .iter()
                .map(|r| r.avg_band_top_pnl * r.n as f64)
                .sum::<f64>()
                / overall_n.max(1) as f64;
            GridResult {
                worst_bucket_pnl: rows.first().map(|r| r.avg_band_top_pnl).unwrap_or(0.0),
                overall_avg_pnl: overall_pnl,
                top_bucket_touch_breach: table
                    .rows
                    .last()
                    .map(|r| r.band_top_breaches as f64 / r.n.max(1) as f64)
                    .unwrap_or(0.0),
                config: *cfg,
            }
        })
        .collect()
}

/// The default candidate set: floor × slope × cap around the calibrated
/// region, plus the no-stretch baseline first (for reference).
pub fn default_grid() -> Vec<StretchConfig> {
    let mut configs = vec![StretchConfig::no_stretch()];
    for floor in [0.04, 0.06, 0.08, 0.10, 0.12] {
        for slope in [2.0, 4.0, 6.0, 8.0] {
            for cap in [1.3, 1.45, 1.6, 1.8] {
                configs.push(StretchConfig { floor, slope, cap });
            }
        }
    }
    configs
}

/// Keeps points whose timestamp lies within [from_ts, to_ts] (either bound
/// optional) — the train/validate split lever for the CLI.
pub fn filter_observations(
    series: &[RunupPoint],
    from_ts: Option<u32>,
    to_ts: Option<u32>,
) -> Vec<RunupPoint> {
    series
        .iter()
        .copied()
        .filter(|o| from_ts.is_none_or(|lo| o.obs_ts >= lo) && to_ts.is_none_or(|hi| o.obs_ts <= hi))
        .collect()
}

/// Renders the quintile table for the CLI. Band-top breach carries a Wilson
/// 95% CI (the production-relevant line); fixed depths print plain rates.
pub fn print_breach_table(
    table: &BreachTable,
    symbol_count: usize,
    params: &RunupParams,
) -> String {
    use std::fmt::Write as _;

    let mut out = String::new();
    let sep = "═".repeat(112);
    let _ = writeln!(out, "{}", sep);
    let _ = writeln!(
        out,
        "RUN-UP → BREACH BACKTEST — condition: past {}d return, outcome: next {}d min-low",
        params.condition_days, params.horizon_days
    );
    let _ = writeln!(out, "{}", sep);

    let mut header = format!(
        "  {:>9} | {:>15} | {:>7} |",
        "quintile", "runup range", "n"
    );
    for bc in &table.rows[0].depth_breaches {
        let _ = write!(header, " <{:.0}% |", bc.depth * 100.0);
    }
    if params.use_band_top {
        let _ = write!(header, " {:>22} | {:>8} | {:>8} |", "band-top (95% CI)", "prem $", "pnl $");
    }
    let _ = writeln!(header, " {:>9} | {:>9} | {:>7}", "avg low", "avg ret", "avg vol");
    let _ = writeln!(out, "{}", header);
    let _ = writeln!(out, "{}", "-".repeat(112));

    let total = table.rows.iter().map(|r| r.n).sum::<usize>();
    for row in &table.rows {
        if row.n == 0 {
            continue;
        }
        let _ = write!(
            out,
            "  {:>9} | {:>15} | {:>7} |",
            format!("Q{}", row.quintile),
            format!("{:+.1}..{:+.1}%", row.runup_min * 100.0, row.runup_max * 100.0),
            row.n
        );
        for bc in &row.depth_breaches {
            let _ = write!(out, " {:>4} |", format!("{:.1}%", bc.breaches as f64 / row.n as f64 * 100.0));
        }
        if params.use_band_top {
            let rate = row.band_top_breaches as f64 / row.n as f64;
            let ci = crate::backtest::wilson_ci(row.band_top_breaches, row.n)
                .unwrap_or((rate, rate));
            let _ = write!(
                out,
                " {:>8.1}% [{:>4.1},{:>4.1}] | {:>8.2} | {:>8.2} |",
                rate * 100.0,
                ci.0 * 100.0,
                ci.1 * 100.0,
                row.avg_band_top_premium,
                row.avg_band_top_pnl
            );
        }
        let _ = writeln!(
            out,
            " {:>9} | {:>9} | {:>7}",
            format!("{:+.1}%", row.avg_fwd_min_low_frac * 100.0),
            format!("{:+.1}%", row.avg_fwd_end_return * 100.0),
            format!("{:.0}%", row.avg_vol * 100.0)
        );
    }
    let _ = writeln!(
        out,
        "\n{} observations across {} symbols (band-top = production max_drop band's",
        total, symbol_count
    );
    let _ = writeln!(
        out,
        "shallow end; prem/pnl = synthetic BS premium at band-top (HV×1.3) and net P&L"
    );
    let _ = writeln!(
        out,
        "per share, close-based at expiry). Q1 = biggest losers, QN = biggest rippers."
    );
    out
}

/// Renders the grid scorecard, ranked by worst-bucket P&L (maxi-min).
pub fn print_grid(results: &[GridResult]) -> String {
    use std::fmt::Write as _;
    let mut ranked: Vec<&GridResult> = results.iter().collect();
    ranked.sort_by(|a, b| b.worst_bucket_pnl.total_cmp(&a.worst_bucket_pnl));

    let mut out = String::new();
    let _ = writeln!(out, "STRETCH GRID SEARCH — ranked by worst-bucket band-top P&L (maxi-min)");
    let _ = writeln!(out, "{:>18} | {:>10} | {:>10} | {:>10}", "floor/slope/cap", "worst pnl", "avg pnl", "Qtop touch");
    let _ = writeln!(out, "{}", "-".repeat(60));
    for r in &ranked {
        let _ = writeln!(
            out,
            "{:>18} | {:>10.3} | {:>10.3} | {:>9.1}%",
            format!("{:.2}/{:.0}/{:.2}", r.config.floor, r.config.slope, r.config.cap),
            r.worst_bucket_pnl,
            r.overall_avg_pnl,
            r.top_bucket_touch_breach * 100.0
        );
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::Candle;

    fn make_candle(close: f64) -> Candle {
        Candle {
            symbol: "TEST".to_string(),
            open: close,
            high: close + 1.0,
            low: close - 1.0,
            close,
            volume: 0,
            timestamp: 0,
        }
    }

    /// A point with hand-set fields (band_stats None → no band-top math).
    fn make_point(runup: f64) -> RunupPoint {
        RunupPoint {
            obs_ts: 0,
            runup,
            baseline: 100.0,
            fwd_min_low_frac: 0.0,
            fwd_end_return: 0.0,
            vol: 0.0,
            band_stats: None,
        }
    }

    #[test]
    fn test_observation_window_counts() {
        // 15 candles, condition 5, horizon 5.
        // Eligible t: t >= 5 (needs 5 prior closes) and t + 5 <= 14 → t ∈ [5, 9].
        // → exactly 5 points.
        let candles: Vec<Candle> = (1..=15).map(|i| make_candle(i as f64 * 10.0)).collect();
        let params = RunupParams {
            use_band_top: false,
            ..Default::default()
        };
        let series = extract_runup_series(&candles, &params);
        assert_eq!(series.len(), 5, "eligible t ∈ [5, 9] → 5 points");
    }

    #[test]
    fn test_quintile_rows_ordered_and_sized() {
        // 10 points, runups 0.01..0.10 → rank split 2 per quintile, ascending.
        let series: Vec<RunupPoint> = (1..=10).map(|i| make_point(i as f64 / 100.0)).collect();
        let params = RunupParams {
            use_band_top: false,
            ..Default::default()
        };
        let table = breach_table_for_stretch(&series, &params, &StretchConfig::no_stretch());
        assert_eq!(table.rows.len(), 5);
        assert_eq!(table.rows[0].n, 2);
        assert_eq!(table.rows[4].n, 2);
        // Lowest runups land in quintile 1, highest in quintile 5.
        assert!((table.rows[0].runup_min - 0.01).abs() < 1e-9);
        assert!((table.rows[0].runup_max - 0.02).abs() < 1e-9);
        assert!((table.rows[4].runup_min - 0.09).abs() < 1e-9);
        assert!((table.rows[4].runup_max - 0.10).abs() < 1e-9);
    }

    #[test]
    fn test_depth_breach_counts() {
        // Breach at depth d ⇔ fwd_min_low_frac <= −d. Independent truth for
        // fwd_min_low_frac {−0.02, −0.04, −0.06, −0.09} at depths
        // {3%, 5%, 8%}: 3, 2, 1 breaches.
        let fracs = [-0.02, -0.04, -0.06, -0.09];
        let series: Vec<RunupPoint> = fracs
            .iter()
            .map(|&f| RunupPoint {
                fwd_min_low_frac: f,
                ..make_point(0.0)
            })
            .collect();
        let params = RunupParams {
            depths: vec![0.03, 0.05, 0.08],
            quintiles: 1,
            use_band_top: false,
            ..Default::default()
        };
        let table = breach_table_for_stretch(&series, &params, &StretchConfig::no_stretch());
        assert_eq!(table.rows.len(), 1);
        let counts: Vec<usize> = table.rows[0]
            .depth_breaches
            .iter()
            .map(|b| b.breaches)
            .collect();
        assert_eq!(counts, vec![3, 2, 1]);
        assert!((table.rows[0].depth_breaches[0].depth - 0.03).abs() < 1e-9);
    }

    #[test]
    fn test_band_top_strike_stretch_applies_above_floor_only() {
        // Cached stats (pct 0.10, ema 0.05) at baseline 100: no stretch →
        // band-top = 95 × (1 − 0.05×0.02) = 94.905 (from the core test's
        // hand-computed band math). At runup 0.08 with slope 6.0, stretch is
        // 1 + 6×0.05 = 1.30 → drops 0.13/0.065 → band-top ≈ 93.3785.
        // At extreme runup 0.15 (cap 1.5) → drops 0.15/0.075 → band-top ≈ 92.3613.
        let params = RunupParams::default();
        let point = RunupPoint {
            runup: 0.08, // above floor → stretch fires (1.30)
            band_stats: Some((0.10, 0.05)),
            ..make_point(0.08)
        };
        let none = band_top_strike(&point, &params, &StretchConfig::no_stretch()).unwrap();
        let stretched = band_top_strike(&point, &params, &StretchConfig::production()).unwrap();
        assert!((none - 94.905).abs() < 1e-3, "no stretch → 94.905, got {}", none);
        assert!((stretched - 93.3785).abs() < 1e-3, "stretch 1.30 → 93.3785, got {}", stretched);

        let extreme_point = RunupPoint {
            runup: 0.15, // hits 1.5 cap
            band_stats: Some((0.10, 0.05)),
            ..make_point(0.15)
        };
        let capped = band_top_strike(&extreme_point, &params, &StretchConfig::production()).unwrap();
        assert!((capped - 92.3613).abs() < 1e-3, "stretch 1.5 cap → 92.361, got {}", capped);

        // Below the floor: production config must equal no_stretch.
        let quiet = RunupPoint {
            runup: 0.02,
            band_stats: Some((0.10, 0.05)),
            ..make_point(0.02)
        };
        let a = band_top_strike(&quiet, &params, &StretchConfig::no_stretch()).unwrap();
        let b = band_top_strike(&quiet, &params, &StretchConfig::production()).unwrap();
        assert!((a - b).abs() < 1e-9, "below floor the stretch is a no-op");
    }

    #[test]
    fn test_band_top_strike_20d_stretch() {
        let cfg = StretchConfig::production_20d();
        // Runup 0.08 (below 0.10 floor) → stretch 1.0 (no stretch)
        assert!((cfg.stretch(0.08) - 1.0).abs() < 1e-9);
        // Runup 0.15 → 1 + 2*(0.15-0.10) = 1.10
        assert!((cfg.stretch(0.15) - 1.10).abs() < 1e-9);
        // Runup 0.25 → capped at 1.20
        assert!((cfg.stretch(0.25) - 1.20).abs() < 1e-9);
    }

    #[test]
    fn test_band_top_pnl_survive_vs_assigned() {
        // Three points, three buckets (quintiles 3, distinct runups) so each
        // row is exact. band_stats (0.10, 0.05), baseline 100, no stretch →
        // strike 94.905 (hand-computed in test_band_top_strike_*).
        let params = RunupParams {
            quintiles: 3,
            use_band_top: true,
            ..Default::default()
        };
        let cfg = StretchConfig::no_stretch();
        let survivor = RunupPoint {
            runup: 0.01,
            fwd_end_return: 0.10, // close 110 > strike → keep premium, no loss
            band_stats: Some((0.10, 0.05)),
            vol: 0.30,
            ..make_point(0.01)
        };
        let assigned = RunupPoint {
            runup: 0.12,
            fwd_end_return: -0.10, // close 90 < strike → loss 4.905
            band_stats: Some((0.10, 0.05)),
            vol: 0.30,
            ..make_point(0.12)
        };
        let zero_vol = RunupPoint {
            runup: 0.25,
            fwd_end_return: -0.10,
            band_stats: Some((0.10, 0.05)),
            vol: 0.0, // σ = 0 → BS premium = 0 → pnl = −loss exactly
            ..make_point(0.25)
        };
        let table = breach_table_for_stretch(&[survivor, assigned, zero_vol], &params, &cfg);
        let prem = |k: usize| table.rows[k - 1].avg_band_top_premium;
        let pnl = |k: usize| table.rows[k - 1].avg_band_top_pnl;

        assert!(prem(1) > 0.0, "OTM BS put with vol > 0 has positive premium");
        assert!(
            (pnl(1) - prem(1)).abs() < 1e-9,
            "survivor: pnl == premium (no loss), {} vs {}",
            pnl(1),
            prem(1)
        );
        assert!(
            (pnl(2) - (prem(2) - 4.905)).abs() < 1e-9,
            "assigned: pnl == premium − (strike − close) = premium − 4.905, got {} vs {}",
            pnl(2),
            prem(2)
        );
        assert!(prem(3).abs() < 1e-9, "σ = 0 → BS premium 0, got {}", prem(3));
        assert!((pnl(3) - (-4.905)).abs() < 1e-9, "zero-vol assigned: pnl = −4.905, got {}", pnl(3));
    }

    #[test]
    fn test_grid_search_stretch_helps_assigned_rippers() {
        // Two buckets: quiet survivors (below floor) and assigned rippers.
        // No stretch: rippers assign at 94.905 → loss 4.905. Production
        // stretch (runup 0.10/0.12 → 1.5 cap): strike 92.3613 → loss 2.3613.
        // The stretch costs premium when nothing assigns, but the WORST
        // bucket (assigned rippers) must improve.
        let params = RunupParams {
            quintiles: 2,
            use_band_top: true,
            ..Default::default()
        };
        let quiet = |runup: f64| RunupPoint {
            runup,
            fwd_end_return: 0.05, // close 105 → survive under any config
            band_stats: Some((0.10, 0.05)),
            vol: 0.30,
            fwd_min_low_frac: -0.02,
            ..make_point(runup)
        };
        let ripper = |runup: f64| RunupPoint {
            runup,
            fwd_end_return: -0.10, // close 90 → assigned under both configs
            band_stats: Some((0.10, 0.05)),
            vol: 0.30,
            fwd_min_low_frac: -0.06,
            ..make_point(runup)
        };
        let series = vec![quiet(0.01), quiet(0.02), ripper(0.10), ripper(0.12)];
        let base_cfg = StretchConfig::no_stretch();
        let stretch_cfg = StretchConfig::production();
        let results = grid_search(&series, &params, &[base_cfg, stretch_cfg]);
        assert_eq!(results.len(), 2);
        assert!(
            results[1].worst_bucket_pnl > results[0].worst_bucket_pnl,
            "stretch must improve the worst (assigned-ripper) bucket: {} vs {}",
            results[1].worst_bucket_pnl,
            results[0].worst_bucket_pnl
        );
        // The quiet bucket is below the floor → identical pnl under both.
        let base_table = breach_table_for_stretch(&series, &params, &base_cfg);
        let stretch_table = breach_table_for_stretch(&series, &params, &stretch_cfg);
        assert!(
            (base_table.rows[0].avg_band_top_pnl - stretch_table.rows[0].avg_band_top_pnl).abs()
                < 1e-9,
            "below floor the stretch must not touch the quiet bucket's pnl"
        );
    }

    #[test]
    fn test_observations_carry_timestamp_and_filter_by_date() {
        // Each point carries its candle timestamp so the CLI can split
        // train (older 2/3) vs validate (recent 1/3). Independent truth: the
        // fixture's literal timestamps.
        let params = RunupParams {
            use_band_top: false,
            ..Default::default()
        };
        let candles: Vec<Candle> = (0..15)
            .map(|i| Candle { timestamp: 1_700_000_000 + i * 86_400, ..make_candle(100.0) })
            .collect();
        let series = extract_runup_series(&candles, &params);
        // t ∈ [5, 9] → timestamps of candles 5..9
        assert_eq!(series[0].obs_ts, 1_700_000_000 + 5 * 86_400);
        assert_eq!(series[4].obs_ts, 1_700_000_000 + 9 * 86_400);

        // Date filter: keep only the middle slice [day 6, day 8].
        let lo = 1_700_000_000 + 6 * 86_400;
        let hi = 1_700_000_000 + 8 * 86_400 + 86_399; // inclusive upper bound
        let kept = filter_observations(&series, Some(lo), Some(hi));
        assert_eq!(kept.len(), 3);
        assert!(kept.iter().all(|o| o.obs_ts >= lo && o.obs_ts <= hi));

        // Open bounds: None on either side keeps everything on that side.
        assert_eq!(filter_observations(&series, None, Some(hi)).len(), 4);
        assert_eq!(filter_observations(&series, Some(lo), None).len(), 4);
        assert_eq!(filter_observations(&series, None, None).len(), 5);
    }

    #[test]
    fn test_print_breach_table_has_header_and_rates() {
        // CLI seam: the printer renders a header, per-quintile rows with runup
        // ranges, per-depth breach percentages and the band-top columns with
        // Wilson CI + premium/pnl. Light string assertions — the numbers
        // themselves are covered by the pure-seam tests.
        let params = RunupParams {
            depths: vec![0.03, 0.05],
            quintiles: 2,
            use_band_top: true,
            ..Default::default()
        };
        let series: Vec<RunupPoint> = (1..=4)
            .map(|i| RunupPoint {
                runup: i as f64 / 100.0,
                band_stats: Some((0.10, 0.05)),
                vol: 0.30,
                // Even i → min-low 94 < strike 94.905 (touch-breach); odd i →
                // 96 > strike (no breach). Each quintile gets one of each.
                fwd_min_low_frac: if i % 2 == 0 { -0.06 } else { -0.02 },
                fwd_end_return: -0.01,
                ..make_point(i as f64 / 100.0)
            })
            .collect();
        let table = breach_table_for_stretch(&series, &params, &StretchConfig::no_stretch());
        let out = print_breach_table(&table, 1, &params);
        assert!(out.contains("RUN-UP"), "title line: {}", out);
        assert!(out.contains("quintile"), "header: {}", out);
        assert!(out.contains("+1.0"), "runup range: {}", out);
        assert!(out.contains("50.0%"), "breach pct (1 of 2): {}", out);
        assert!(out.contains("CI"), "wilson CI column: {}", out);
        assert!(out.contains("pnl"), "pnl column: {}", out);
    }

    #[test]
    fn test_vol_diagnostic_orders_with_swinginess() {
        // Independent truth by construction: flat closes → realized vol 0.0
        // (log returns all zero); ±5% daily swings → vol ≈ 0.0488×√252 ≫ 0.
        // 30 candles: flat through index 21, swinging from 22 on. With
        // horizon 5 the last eligible t is 24.
        let params = RunupParams {
            use_band_top: false,
            ..Default::default()
        };
        let mut candles: Vec<Candle> = (0..=21).map(|_| make_candle(100.0)).collect();
        candles.extend((22..30).map(|i| {
            if i % 2 == 0 { make_candle(105.0) } else { make_candle(100.0) }
        }));
        let series = extract_runup_series(&candles, &params);
        assert_eq!(series.len(), 20); // t ∈ [5, 24]
        assert!(
            (series[21 - 5].vol - 0.0).abs() < 1e-9,
            "flat history at t=21 → vol 0"
        );
        assert!(
            series[24 - 5].vol > 0.01,
            "swingy recent closes at t=24 → vol well above 0, got {}",
            series[24 - 5].vol
        );
    }

    #[test]
    fn test_band_top_breach_two_scenarios() {
        // Property test — no band recomputation in the test. The production
        // band's top strike sits just below spot when history is quiet
        // (small window drops), and deep below spot when history recorded
        // big drawdowns. So:
        //  A) quiet history + forward dip → breach MUST fire;
        //  B) violent history + forward flat → breach MUST NOT fire.
        let params = RunupParams {
            depths: vec![0.05],
            use_band_top: true,
            ..Default::default()
        };

        // A: 20 quiet candles (0.3% intraday ranges), then 5 forward candles
        // whose lows dip ~3.1% below the flat close.
        let mut quiet: Vec<Candle> = (0..20)
            .map(|_| Candle { high: 100.5, low: 99.7, ..make_candle(100.0) })
            .collect();
        quiet.extend((0..5).map(|_| Candle { high: 100.5, low: 96.9, ..make_candle(100.0) }));
        let series_a = extract_runup_series(&quiet, &params);
        let last_a = series_a.last().expect("t=19 is eligible");
        let breach_a = band_top_strike(last_a, &params, &StretchConfig::production())
            .is_some_and(|strike| last_a.fwd_min_low_frac * last_a.baseline + last_a.baseline <= strike);
        assert!(
            breach_a,
            "quiet history → band top ≈ spot → a 3% forward dip breaches"
        );

        // B: 20 violent candles (30%+ window swings), then 5 flat forward.
        let mut violent: Vec<Candle> = Vec::new();
        for i in 0..20 {
            let close = if i % 2 == 0 { 130.0 } else { 90.0 };
            violent.push(Candle { high: close + 5.0, low: close - 5.0, ..make_candle(close) });
        }
        violent.extend((0..5).map(|_| Candle { high: 100.5, low: 99.7, ..make_candle(100.0) }));
        let series_b = extract_runup_series(&violent, &params);
        let last_b = series_b.last().expect("t=19 is eligible");
        let breach_b = band_top_strike(last_b, &params, &StretchConfig::production())
            .is_some_and(|strike| last_b.fwd_min_low_frac * last_b.baseline + last_b.baseline <= strike);
        assert!(
            !breach_b,
            "violent history → band top far below spot → flat forward never breaches"
        );
    }

    #[test]
    fn test_quintile_uneven_remainder() {
        // 7 points into 5 quintiles: rank split gives sizes 2,1,2,1,1 — the
        // invariant is every point counted exactly once, no empty quintile row.
        let series: Vec<RunupPoint> = (1..=7).map(|i| make_point(i as f64 / 100.0)).collect();
        let params = RunupParams {
            use_band_top: false,
            ..Default::default()
        };
        let table = breach_table_for_stretch(&series, &params, &StretchConfig::no_stretch());
        assert_eq!(table.rows.len(), 5);
        assert_eq!(table.rows.iter().map(|r| r.n).sum::<usize>(), 7);
        assert!(table.rows.iter().all(|r| r.n > 0), "no empty rows for n=7, q=5");
    }
}
