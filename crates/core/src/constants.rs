// ── Candle / Option-chain data ────────────────────────────────
/// Upstream API call batching — quotes and option chains both walk the
/// universe in chunks of this size (batch totals in progress events derive
/// from it too).
pub const API_BATCH_SIZE: usize = 10;
pub const CANDLE_COUNT: u32 = 850;
pub const MIN_OPEN_INTEREST: u32 = 50;
pub const SHARPE_MIN_CANDLES: usize = 14;
pub const PRICE_PERCENTILE_DAYS: u32 = 20;
pub const DEFAULT_RISK_FREE_RATE: f64 = 0.0;

// ── Trend (EMAs, regime) ──────────────────────────────────────
pub const EMA_SHORT_PERIOD: u32 = 20;
pub const EMA_LONG_PERIOD: u32 = 50;
pub const TREND_THRESHOLD_BULL: f64 = 0.98;
pub const TREND_THRESHOLD_RANGE: f64 = 0.06; // How far threshold can drop (0.98 → 0.92)
pub const BEARNESS_MAX: f64 = 0.08; // SPY drop mapping to bearness = 1.0
/// SPY trend ratio the PerformAll pipeline assumes (bull hardcode, spec §2.4a:
/// "bypasses dynamic SPY checks to save time/API calls"). Single source for
/// both `pipeline::perform_all` and any hook needing a matching regime.
pub const PERFORM_ALL_SPY_TREND_RATIO: f64 = 1.05;
pub const MOMENTUM_HIGH_THRESHOLD: f64 = 0.80;
pub const MOMENTUM_EXTENDED_THRESHOLD: f64 = 0.90;

// ── Max-drop band ─────────────────────────────────────────────
pub const PERCENTILE: f64 = 0.97; // 97th-percentile drawdown → deep band end
/// Presentation fence (delta magnitude): rows with `|delta|` above this are
/// excluded from scored output AND dropped from raw rows (result document,
/// CSV, top picks). Put delta ≈ the market's ITM/assignment probability, so
/// the cap means "never present a strike priced above ~16% ITM" — the
/// 1-std-dev OTM line (Φ(−1) ≈ 0.1587 ≈ 0.16). Strikes closer to spot than
/// 1σ are the premium-rich ones a user might sell too casually; because
/// delta bakes in each name's IV, the cap trims every symbol at its own
/// risk-equivalent moneyness. Null-delta rows pass through (the max_drop
/// band remains the fallback safety there).
pub const PRESENT_MAX_ABS_DELTA: f64 = 0.16;
/// 5-day (Short) presentation fence: 5-day options carry ~2× higher negative
/// gamma than 20-day options at the same delta, so 5-day puts use a tighter 0.12
/// delta cap to avoid high-gamma, knife-edge assignments.
pub const PRESENT_MAX_ABS_DELTA_5D: f64 = 0.12;
/// 20-day (Medium) presentation fence: 20-day options have softer gamma and more
/// time to mean-revert, safely supporting the 1-std-dev line (0.16 delta).
pub const PRESENT_MAX_ABS_DELTA_20D: f64 = 0.16;

/// Returns the presentation delta fence for a given DTE:
/// DTE <= 7 (Short / weekly) -> PRESENT_MAX_ABS_DELTA_5D (0.12)
/// DTE > 7 (Medium / monthly) -> PRESENT_MAX_ABS_DELTA_20D (0.16)
pub fn max_abs_delta_for_dte(dte: u32) -> f64 {
    if dte <= 7 {
        PRESENT_MAX_ABS_DELTA_5D
    } else {
        PRESENT_MAX_ABS_DELTA_20D
    }
}
pub const TREND_TIGHTEN_MULTIPLIER: f64 = 2.0;
pub const TREND_TIGHTEN_CAP: f64 = 0.10;
pub const TREND_TIGHTEN_PEAK: f64 = 1.05;
pub const TREND_EASE_BACK: f64 = 0.5;

// ── Run-up stretch (2026-11-14 dose-response calibration) ─────
// Breach probability is flat vs the past-5d return through +2.2%, departs at
// ~+2.8..3.4%, and reaches 2.36× baseline by +8% — while the max_drop band
// self-corrects after crashes (band-top breach 7-11% post-crash) but NOT
// after rips (~23% ≈ quiet names). The stretch inflates the drop stats for
// extended names so the band responds to rips like it already responds to
// drops. Calibrated on 195,121 observations, 233 symbols:
// .scratch/research/2026-11-14-max-drop-5day-runup.md §4-5.
/// Past-5d return above which the stretch ramps (measured departure point).
pub const RUNUP_STRETCH_FLOOR: f64 = 0.03;
/// Stretch slope: 1 + SLOPE × (runup − FLOOR). Relaxed from initial fit of 20
/// to 6.0: slope 20 hit the 1.5 cap too abruptly at +5.5% run-up and destroyed
/// ripper premium. Slope 6.0 reaches the 1.5 cap at +11.3% run-up, cutting Q20
/// breach from 19.9% to 9.0% while preserving healthy options income.
pub const RUNUP_STRETCH_SLOPE: f64 = 6.0;
/// Stretch ceiling — a policy choice, not a fit: capped so a post-rip band
/// delivers roughly the same band-top breach (~8%) as the post-crash band
/// naturally does (Q1 ≈ 7.3%). The measured extreme-bucket ratio was 2.36,
/// but stretching that far (cap 2.4 → Q20 band-top breach 2.3%) pushes
/// strikes so deep the premium dries up; validation sweep
/// (.scratch/research/2026-11-14-max-drop-5day-runup.md §7): cap 1.5 → 7.9%.
pub const RUNUP_STRETCH_CAP: f64 = 1.5;
/// Candles needed to compute the past-5d return (5 return days + current).
pub const RUNUP_LOOKBACK_CANDLES: u32 = 6;
/// Run-up measurement window in trading days (the Short timeframe period).
pub const RUNUP_STRETCH_DAYS: usize = 5;

// ── Run-up stretch for 20-day (Medium timeframe) ──────────────
// For 20-day returns, downside risk is flat through +9.9% (Q10–Q17 breach 23-29%).
// Departure begins at ~+10% (Q18+). Calibrated on 188,131 observations:
// floor 0.10, slope 2.0, cap 1.20 cuts Q20 touch breach from 22.9% to 16.6%
// while preserving $4.72 premium and +$3.42 net P&L per share.
pub const RUNUP_20D_STRETCH_FLOOR: f64 = 0.10;
pub const RUNUP_20D_STRETCH_SLOPE: f64 = 2.0;
pub const RUNUP_20D_STRETCH_CAP: f64 = 1.20;
pub const RUNUP_20D_LOOKBACK_CANDLES: u32 = 21;
pub const RUNUP_20D_STRETCH_DAYS: usize = 20;

// ── 20-day EMA drop calibration ──────────────────────────────
/// 20-day forward scaling factor for calibrated EMA drop in strike range calculation.
/// Peak-normalizes the trough-divided drop and scales for zero-drift Brownian scaling.
pub const DROP_20D_BROWNIAN_FACTOR: f64 = 0.75;

// ── Pre-filters ───────────────────────────────────────────────
pub const MIN_RATE_OF_RETURN: f64 = 0.20;
/// 5-day (Short) min rate of return threshold.
pub const MIN_RATE_OF_RETURN_5D: f64 = 0.20;
/// 20-day (Medium) min rate of return threshold: monthly options target a higher annualized return floor.
pub const MIN_RATE_OF_RETURN_20D: f64 = 0.30;

/// Returns the minimum rate of return threshold for a given DTE:
/// DTE <= 7 -> MIN_RATE_OF_RETURN_5D (0.20)
/// DTE > 7  -> MIN_RATE_OF_RETURN_20D (0.30)
pub fn min_rate_of_return_for_dte(dte: u32) -> f64 {
    if dte <= 7 {
        MIN_RATE_OF_RETURN_5D
    } else {
        MIN_RATE_OF_RETURN_20D
    }
}

/// Returns the minimum rate of return threshold for a given horizon period in trading days:
/// period <= 7 -> MIN_RATE_OF_RETURN_5D (0.20)
/// period > 7  -> MIN_RATE_OF_RETURN_20D (0.30)
pub fn min_rate_of_return_for_period(period: usize) -> f64 {
    if period <= 7 {
        MIN_RATE_OF_RETURN_5D
    } else {
        MIN_RATE_OF_RETURN_20D
    }
}
/// Unused in production (no upper cap since 2026-07). Retained for backtest presets.
pub const MAX_RATE_OF_RETURN: f64 = 0.80;
/// Unused in production (danger expressed via band). Retained for backtest presets.
pub const MAX_STRIKE_PERCENTILE: f64 = 0.40;

// ── Scoring weights ───────────────────────────────────────────
/// Weights sum to 1.0. A trend term is wired (see `TREND_SCORE_*` below)
/// but `PUT_SCORE_WEIGHT_TREND = 0.0` — the 2026-07 sweep found every
/// non-zero weight lifted assignment above the 2.4% baseline. The lever is
/// retained for future changes (e.g. real IV/delta capture from Tiger).
pub const PUT_SCORE_WEIGHT_SHARPE: f64 = 0.20;
pub const PUT_SCORE_WEIGHT_SAFETY: f64 = 0.40;
pub const PUT_SCORE_WEIGHT_RETURN: f64 = 0.40;
pub const PUT_SCORE_WEIGHT_TREND: f64 = 0.0;
/// Soft-cap: `return_norm = (rate_of_return / IDEAL_RETURN).min(1.0)`.
/// Above 80% return, no extra credit but no exclusion either.
pub const IDEAL_RETURN: f64 = 0.80;

// ── Trend-score term (wired, disabled) ─────────────────────────
pub const TREND_SCORE_FLOOR: f64 = 1.02;
pub const TREND_SCORE_BAND: f64 = 0.06;

// ── Earnings-aware scoring ────────────────────────────────────
pub const EARNINGS_SAFETY_MULTIPLIER: f64 = 0.5;

// ── Telegram publication ──────────────────────────────────────
pub const TOP_PICKS_COUNT: usize = 3;

// ── Webapp result cache (ticket 05) ───────────────────────────
/// How long a completed run's result counts as fresh. Anchored at run
/// COMPLETION (`run.finished_at_utc` in the result file), not run start.
/// Strict `<`: at exactly this age the result is expired (spec §5).
pub const WEBAPP_CACHE_SECS: u64 = 600;

/// Off-market run cadence: outside market hours an armed run blocks new
/// runs for this long after its completion (hourly). Market hours keep
/// the [`WEBAPP_CACHE_SECS`] window above.
pub const WEBAPP_OFF_HOURS_CACHE_SECS: u64 = 3600;

// ── Vol-tier annotation (D2) ──────────────────────────────────
/// Backtest-only threshold for the `vol-high-only` preset.
/// Production does NOT filter — it annotates each pick with a vol tier instead.
pub const MIN_REALIZED_VOL: f64 = 0.50;

// ── Vol-tier safety boost (D2) ────────────────────────────────
/// Safety multiplier for high-vol names. High-vol names deliver materially
/// higher rate_of_return at matched assignment rate (calibration: at 2% breach,
/// low-vol ~44% ror, mid-vol ~49%, high-vol ~53%). This boost lifts safety
/// for higher-vol names so the picker's ranking slots go to richer picks —
/// without removing any candidates from the pool (unlike a hard vol filter).
///
/// Tier multipliers: high-vol (>=0.38) → 1.0, mid-vol (>=0.28) → 0.5,
/// low-vol (<0.28) → 0.0. The boost is `safety *= (1 + VOL_SAFETY_BOOST * tier)`.
pub const VOL_TIER_HIGH: f64 = 0.38; // realized vol ≥ this → green tier
pub const VOL_TIER_MID: f64 = 0.28; // ≥ this (else) → yellow tier
/// 0.0 = disabled (production default — the bot annotates vol tiers instead).
pub const VOL_SAFETY_BOOST: f64 = 0.0;
