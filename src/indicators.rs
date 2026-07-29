//! Technical indicators and their normalizations for the up/down `direction`
//! signal.
//!
//! Normalization philosophy is **hybrid** (see map decision 02):
//! - **Discrete regime flags** for the EMAs (alignment, EMA200) — these read as
//!   on/off regime signals, not slopes.
//! - **Continuous magnitudes** for MACD / RSI / volume — the strength of a
//!   momentum burst contributes proportionally.
//!
//! Each `*_score` function returns a value in `[0, 1]` (1.0 = maximally
//! bullish) that the composite in `signal.rs` weights together.

use crate::{constants, model, stats};

// ── Raw indicator values ──────────────────────────────────────

/// `(ema20, ema50)` for a close-price series, reusing the existing EMA
/// primitive. Caller must guarantee `closes` is non-empty.
fn ema_stack(closes: &[f64]) -> (f64, f64) {
    let ema20 = stats::exponential_moving_average(closes, constants::EMA_SHORT_PERIOD);
    let ema50 = stats::exponential_moving_average(closes, constants::EMA_LONG_PERIOD);
    (ema20, ema50)
}

/// EMA200 for a close-price series. Returns the seed mean when fewer than 200
/// points are available (the underlying EMA primitive's fallback).
pub fn ema200(closes: &[f64]) -> f64 {
    stats::exponential_moving_average(closes, EMA200_PERIOD)
}

/// EMA period for the long-term regime flag.
pub const EMA200_PERIOD: u32 = 200;

/// MACD components from three EMAs.
///
/// Standard (12, 26, 9): `line = EMA12 − EMA26`, `signal = EMA9(line)`,
/// `histogram = line − signal`. Returns `(line, signal, histogram)` using the
/// *latest* values. A positive, rising histogram is the classic bullish read.
///
/// Returns `(0.0, 0.0, 0.0)` if `closes` has fewer than `MACD_LONG_PERIOD`
/// points — MACD is undefined on too-short a series.
pub fn macd(closes: &[f64]) -> (f64, f64, f64) {
    if (closes.len() as u32) < MACD_LONG_PERIOD {
        return (0.0, 0.0, 0.0);
    }
    // Build the MACD line as EMA12 − EMA26 over a rolling window, then smooth
    // it with a 9-period EMA to get the signal. We compute the full line
    // series so the signal EMA and the self-referential stdev have history.
    let line_series = macd_line_series(closes);
    let line = *line_series.last().unwrap();
    let signal_series = ema_series(&line_series, MACD_SIGNAL_PERIOD);
    let signal = *signal_series.last().unwrap();
    let histogram = line - signal;
    (line, signal, histogram)
}

/// MACD fast/slow/signal periods.
pub const MACD_FAST_PERIOD: u32 = 12;
pub const MACD_LONG_PERIOD: u32 = 26;
pub const MACD_SIGNAL_PERIOD: u32 = 9;

/// Full MACD line series (EMA12 − EMA26 per bar), length `closes.len()`.
///
/// Each point uses an EMA computed over the closes up to and including that
/// bar. The EMA primitive returns the seed mean for the first `period−1` bars,
/// so the earliest line values are approximate but stabilize quickly.
fn macd_line_series(closes: &[f64]) -> Vec<f64> {
    closes
        .iter()
        .enumerate()
        .map(|(i, _)| {
            let win = &closes[..=i];
            let fast = stats::exponential_moving_average(win, MACD_FAST_PERIOD);
            let slow = stats::exponential_moving_average(win, MACD_LONG_PERIOD);
            fast - slow
        })
        .collect()
}

/// Full EMA series over `values`, one EMA per bar (seeded at values[0]).
fn ema_series(values: &[f64], period: u32) -> Vec<f64> {
    let mult = 2.0 / (period as f64 + 1.0);
    let mut out = Vec::with_capacity(values.len());
    let mut prev = values.first().copied().unwrap_or(0.0);
    for (i, &v) in values.iter().enumerate() {
        prev = if i == 0 { v } else { v * mult + prev * (1.0 - mult) };
        out.push(prev);
    }
    out
}

/// RSI(14) via Wilder smoothing. Returns a value in `[0, 100]` (50 = neutral).
///
/// Returns `50.0` when there's not enough data to compute it. Uses the
/// standard Wilder smoothing: first avg gain/loss over the initial period,
/// then smoothed averages.
pub fn rsi(closes: &[f64], period: usize) -> f64 {
    if closes.len() <= period {
        return 50.0;
    }
    // Seed: simple average of the first `period` gains and losses.
    let mut gains = 0.0;
    let mut losses = 0.0;
    for i in 1..=period {
        let diff = closes[i] - closes[i - 1];
        if diff >= 0.0 {
            gains += diff;
        } else {
            losses -= diff;
        }
    }
    let mut avg_gain = gains / period as f64;
    let mut avg_loss = losses / period as f64;
    // Wilder smoothing over the remainder of the series.
    for i in (period + 1)..closes.len() {
        let diff = closes[i] - closes[i - 1];
        let gain = if diff >= 0.0 { diff } else { 0.0 };
        let loss = if diff < 0.0 { -diff } else { 0.0 };
        avg_gain = (avg_gain * (period as f64 - 1.0) + gain) / period as f64;
        avg_loss = (avg_loss * (period as f64 - 1.0) + loss) / period as f64;
    }
    if avg_loss == 0.0 {
        100.0
    } else {
        let rs = avg_gain / avg_loss;
        100.0 - 100.0 / (1.0 + rs)
    }
}

/// RSI period (Wilder).
pub const RSI_PERIOD: usize = 14;

/// Volume breakout ratio: latest volume ÷ its trailing 50-bar average.
///
/// Returns `1.0` (average) when there's no volume history. Caller passes the
/// full volume series; this reads the last 51 bars.
pub fn volume_breakout_ratio(volumes: &[f64]) -> f64 {
    let n = volumes.len();
    if n < 2 {
        return 1.0;
    }
    let lookback = VOLUME_AVG_PERIOD.min(n - 1);
    let latest = volumes[n - 1];
    let avg: f64 = volumes[n - 1 - lookback..n - 1].iter().sum::<f64>() / lookback as f64;
    if avg == 0.0 {
        return 1.0;
    }
    latest / avg
}

/// Trailing window for the volume average.
pub const VOLUME_AVG_PERIOD: usize = 50;

// ── Normalizations (raw → [0,1] bullishness) ──────────────────

/// Normalizes EMA20/50 alignment into a discrete `[0, 1]` bullishness score.
///
/// Hybrid philosophy: alignment is a regime flag, not a slope.
/// - `1.0` — full bullish stack: `price > EMA20 > EMA50`.
/// - `0.5` — partial: price above one EMA but not a clean bull stack.
/// - `0.0` — bearish stack: `price < EMA20 < EMA50`.
///
/// Returns `0.5` (neutral) when `closes` is empty.
pub fn ema_alignment_score(closes: &[f64]) -> f64 {
    let Some(&price) = closes.last() else {
        return 0.5;
    };
    let (ema20, ema50) = ema_stack(closes);

    if price > ema20 && ema20 > ema50 {
        1.0
    } else if price < ema20 && ema20 < ema50 {
        0.0
    } else {
        0.5
    }
}

/// Normalizes EMA200 into a discrete flag: `1.0` if price above EMA200, else
/// `0.0`. "Price above 200 MA" is classically a binary regime flag.
/// Returns `0.5` when `closes` is empty.
pub fn ema200_score(closes: &[f64]) -> f64 {
    let Some(&price) = closes.last() else {
        return 0.5;
    };
    if price > ema200(closes) {
        1.0
    } else {
        0.0
    }
}

/// Normalizes MACD histogram into a continuous `[0, 1]` score via
/// self-referential stdev (decision 02):
/// `score = clamp(hist / stdev(hist, MACD_STDEV_WINDOW), -1, 1)` then shifted
/// to `[0, 1]` as `(x + 1) / 2`. Stock-agnostic — "a 1-σ MACD burst" is the
/// unit, so it works identically for a $20 and a $500 stock.
///
/// Returns `0.5` (neutral) when there's no histogram history or zero stdev.
pub fn macd_score(closes: &[f64]) -> f64 {
    let line_series = macd_line_series(closes);
    if line_series.len() < MACD_SIGNAL_PERIOD as usize + 1 {
        return 0.5;
    }
    let signal_series = ema_series(&line_series, MACD_SIGNAL_PERIOD);
    let hist_series: Vec<f64> = line_series
        .iter()
        .zip(signal_series.iter())
        .map(|(l, s)| l - s)
        .collect();
    let hist = *hist_series.last().unwrap();
    let window = constants::MACD_STDEV_WINDOW.min(hist_series.len());
    let slice = &hist_series[hist_series.len() - window..];
    let stdev = population_stdev(slice);
    if stdev == 0.0 {
        return 0.5;
    }
    let normalized = (hist / stdev).clamp(-1.0, 1.0);
    (normalized + 1.0) / 2.0
}

/// Normalizes RSI into a continuous `[0, 1]` score: linear map across the
/// neutral band `(RSI_LOW, RSI_HIGH)`, clamped. High RSI = bullish momentum.
/// Returns `0.5` when RSI can't be computed.
pub fn rsi_score(closes: &[f64]) -> f64 {
    let r = rsi(closes, RSI_PERIOD);
    let span = constants::RSI_HIGH - constants::RSI_LOW;
    ((r - constants::RSI_LOW) / span).clamp(0.0, 1.0)
}

/// Normalizes volume breakout into a continuous `[0, 1]` score: a day at
/// `VOLUME_SPIKE_FULL` (1.5×) avg maxes the feature; at/below average → 0.
/// Returns `0.5` when there's no volume history.
pub fn volume_breakout_score(volumes: &[f64]) -> f64 {
    if volumes.len() < 2 {
        return 0.5;
    }
    let ratio = volume_breakout_ratio(volumes);
    ((ratio - 1.0) / (constants::VOLUME_SPIKE_FULL - 1.0)).clamp(0.0, 1.0)
}

/// Population standard deviation (N divisor). Returns 0.0 on empty input.
fn population_stdev(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    let mean = values.iter().sum::<f64>() / values.len() as f64;
    let variance = values.iter().map(|v| (v - mean).powi(2)).sum::<f64>() / values.len() as f64;
    variance.sqrt()
}

// ── Relative strength vs SPY (ticket 09) ──────────────────────

/// Relative strength vs a benchmark: ratio of price ratios over `lookback`.
/// `RS = (sym[t]/sym[t−N]) / (bench[t]/bench[t−N])`. RS > 1 ⇒ outperforming
/// the benchmark, < 1 ⇒ lagging.
///
/// Uses ratio-of-price-ratios (not returns-ratio) to avoid blow-up when the
/// benchmark's N-day return ≈ 0. Returns `1.0` (neutral = matching market)
/// when either series is too short for the lookback.
pub fn relative_strength(symbol_closes: &[f64], benchmark_closes: &[f64], lookback: usize) -> f64 {
    let n = symbol_closes.len().min(benchmark_closes.len());
    if n <= lookback {
        return 1.0;
    }
    // Align by tail: use the last `lookback+1` points of each (both indexed
    // from their own end), so a symbol and the benchmark need not share dates
    // exactly — only recent length.
    let sym_now = *symbol_closes.last().unwrap();
    let sym_then = symbol_closes[n - 1 - lookback];
    let bench_now = *benchmark_closes.last().unwrap();
    let bench_then = benchmark_closes[n - 1 - lookback];
    if sym_then == 0.0 || bench_then == 0.0 || bench_now == bench_then {
        return 1.0;
    }
    let sym_ratio = sym_now / sym_then;
    let bench_ratio = bench_now / bench_then;
    sym_ratio / bench_ratio
}

/// Normalizes RS into a continuous `[0, 1]` score, centered at RS = 1.0:
/// `(rs − (1 − band)) / (2 × band)`, clamped. RS within `±band` of 1.0 maps
/// linearly; outperforming strongly → 1, lagging strongly → 0.
pub fn relative_strength_score(symbol_closes: &[f64], benchmark_closes: &[f64]) -> f64 {
    let rs = relative_strength(symbol_closes, benchmark_closes, constants::RS_LOOKBACK);
    let band = constants::RS_BAND;
    ((rs - (1.0 - band)) / (2.0 * band)).clamp(0.0, 1.0)
}

// ── ADX trend-strength (ticket 10) ────────────────────────────
// First ATR-family math in the codebase: true range + Wilder smoothing.
// ADX is non-directional (trend strength), so `adx_score` directionalizes it
// via the ±DI sign (Option B in the ticket) to fit the flat weighted-sum
// composite: strong trend + +DI>−DI → bullish, strong + −DI>+DI → bearish,
// weak trend → neutral regardless of sign.

/// Wilder ADX components: `(adx, plus_di, minus_di)`. Returns `(0.0, 0.0, 0.0)`
/// when `candles` is too short for a full ADX(14) (needs ~2× the period).
pub fn adx(candles: &[model::Candle]) -> (f64, f64, f64) {
    let period = constants::ADX_PERIOD;
    // Need period bars to seed the smoothed sums, then another period to smooth
    // DX into ADX — roughly 2*period + 1 total.
    if candles.len() < 2 * period + 1 {
        return (0.0, 0.0, 0.0);
    }

    // Per-bar true range and directional movement (Wilder).
    let mut trs: Vec<f64> = Vec::with_capacity(candles.len() - 1);
    let mut plus_dms: Vec<f64> = Vec::with_capacity(candles.len() - 1);
    let mut minus_dms: Vec<f64> = Vec::with_capacity(candles.len() - 1);
    for i in 1..candles.len() {
        let c = &candles[i];
        let prev = &candles[i - 1];
        let high_low = c.high - c.low;
        let high_pc = (c.high - prev.close).abs();
        let low_pc = (c.low - prev.close).abs();
        trs.push(high_low.max(high_pc).max(low_pc));

        let up_move = c.high - prev.high;
        let down_move = prev.low - c.low;
        let plus_dm = if up_move > down_move && up_move > 0.0 { up_move } else { 0.0 };
        let minus_dm = if down_move > up_move && down_move > 0.0 { down_move } else { 0.0 };
        plus_dms.push(plus_dm);
        minus_dms.push(minus_dm);
    }

    // Wilder smoothing: seed with the sum of the first `period`, then
    // prev − prev/period + current for each subsequent bar.
    let smooth = |series: &[f64]| -> Vec<f64> {
        let seed: f64 = series.iter().take(period).sum();
        let mut out = Vec::with_capacity(series.len() - period + 1);
        out.push(seed);
        let mut prev = seed;
        for &v in series.iter().skip(period) {
            prev = prev - prev / period as f64 + v;
            out.push(prev);
        }
        out
    };
    let tr_s = smooth(&trs);
    let pdm_s = smooth(&plus_dms);
    let mdm_s = smooth(&minus_dms);

    // DI and DX series (one per smoothed bar).
    let mut dx_series: Vec<f64> = Vec::with_capacity(tr_s.len());
    let mut last_plus_di = 0.0;
    let mut last_minus_di = 0.0;
    for k in 0..tr_s.len() {
        let plus_di = if tr_s[k] != 0.0 { 100.0 * pdm_s[k] / tr_s[k] } else { 0.0 };
        let minus_di = if tr_s[k] != 0.0 { 100.0 * mdm_s[k] / tr_s[k] } else { 0.0 };
        let sum_di = plus_di + minus_di;
        let dx = if sum_di != 0.0 { 100.0 * (plus_di - minus_di).abs() / sum_di } else { 0.0 };
        dx_series.push(dx);
        last_plus_di = plus_di;
        last_minus_di = minus_di;
    }

    // ADX = Wilder smoothing of DX over the same period. Needs >= period DXs.
    if dx_series.len() < period {
        return (0.0, last_plus_di, last_minus_di);
    }
    let dx_seed: f64 = dx_series.iter().take(period).sum::<f64>() / period as f64;
    let mut adx_val = dx_seed;
    for &dx in dx_series.iter().skip(period) {
        adx_val = (adx_val * (period as f64 - 1.0) + dx) / period as f64;
    }
    (adx_val, last_plus_di, last_minus_di)
}

/// Normalizes ADX into a directional `[0, 1]` score (Option B). ADX strength
/// ramps 0→1 over `[0, ADX_FULL_STRENGTH]`; the direction comes from ±DI sign:
/// `+DI > −DI` → bullish (score above 0.5), else bearish. Returns `0.5`
/// (neutral) when ADX can't be computed (too few candles).
pub fn adx_score(candles: &[model::Candle]) -> f64 {
    let (adx, plus_di, minus_di) = adx(candles);
    if adx == 0.0 && plus_di == 0.0 && minus_di == 0.0 {
        return 0.5;
    }
    let strength = (adx / constants::ADX_FULL_STRENGTH).clamp(0.0, 1.0);
    if plus_di >= minus_di {
        // Bullish bias: neutral (0.5) + strength/2 → [0.5, 1.0].
        0.5 + strength * 0.5
    } else {
        // Bearish bias: neutral (0.5) − strength/2 → [0.0, 0.5].
        0.5 - strength * 0.5
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn trending(start: f64, step: f64, count: usize) -> Vec<f64> {
        (0..count).map(|i| start + step * i as f64).collect()
    }

    // ── EMA alignment ──
    #[test]
    fn empty_closes_is_neutral() {
        assert_eq!(ema_alignment_score(&[]), 0.5);
    }

    #[test]
    fn strong_uptrend_is_full_bull() {
        assert_eq!(ema_alignment_score(&trending(100.0, 1.0, 60)), 1.0);
    }

    #[test]
    fn strong_downtrend_is_full_bear() {
        assert_eq!(ema_alignment_score(&trending(200.0, -2.0, 60)), 0.0);
    }

    #[test]
    fn flat_is_neutral_partial() {
        assert_eq!(ema_alignment_score(&vec![100.0; 60]), 0.5);
    }

    #[test]
    fn recent_recovery_is_partial() {
        let mut closes = trending(200.0, -2.0, 50);
        closes.push(140.0);
        assert_eq!(ema_alignment_score(&closes), 0.5);
    }

    // ── EMA200 ──
    #[test]
    fn ema200_above_on_uptrend() {
        let closes = trending(100.0, 1.0, 250);
        assert_eq!(ema200_score(&closes), 1.0);
    }

    #[test]
    fn ema200_below_on_downtrend() {
        let closes = trending(300.0, -1.0, 250);
        assert_eq!(ema200_score(&closes), 0.0);
    }

    #[test]
    fn ema200_empty_is_neutral() {
        assert_eq!(ema200_score(&[]), 0.5);
    }

    // ── MACD ──
    #[test]
    fn macd_too_short_returns_zeros() {
        let (l, s, h) = macd(&trending(100.0, 1.0, 20));
        assert_eq!((l, s, h), (0.0, 0.0, 0.0));
    }

    #[test]
    fn macd_uptrend_positive_histogram() {
        // Sustained uptrend → fast EMA above slow → positive line & histogram.
        let closes = trending(100.0, 1.0, 60);
        let (line, _signal, hist) = macd(&closes);
        assert!(line > 0.0, "uptrend line should be positive, got {line}");
        assert!(hist >= 0.0, "uptrend histogram should be >= 0, got {hist}");
    }

    #[test]
    fn macd_downtrend_negative_histogram() {
        let closes = trending(200.0, -2.0, 60);
        let (line, _signal, hist) = macd(&closes);
        assert!(line < 0.0, "downtrend line should be negative, got {line}");
        assert!(hist <= 0.0, "downtrend histogram should be <= 0, got {hist}");
    }

    #[test]
    fn macd_score_bullish_on_uptrend() {
        let closes = trending(100.0, 1.0, 60);
        assert!(macd_score(&closes) > 0.5);
    }

    #[test]
    fn macd_score_bearish_on_downtrend() {
        let closes = trending(200.0, -2.0, 60);
        assert!(macd_score(&closes) < 0.5);
    }

    // ── RSI ──
    #[test]
    fn rsi_too_short_is_neutral_50() {
        assert_eq!(rsi(&trending(100.0, 1.0, 10), RSI_PERIOD), 50.0);
    }

    #[test]
    fn rsi_strong_uptrend_near_100() {
        // Monotonic gains → no losses → RSI saturates at 100.
        let closes = trending(100.0, 1.0, 60);
        let r = rsi(&closes, RSI_PERIOD);
        assert!(r > 99.0, "pure uptrend RSI should saturate, got {r}");
    }

    #[test]
    fn rsi_strong_downtrend_near_0() {
        let closes = trending(200.0, -2.0, 60);
        let r = rsi(&closes, RSI_PERIOD);
        assert!(r < 1.0, "pure downtrend RSI should bottom, got {r}");
    }

    #[test]
    fn rsi_score_maps_band() {
        // Pure uptrend → RSI ~100 → score 1.0; pure downtrend → RSI ~0 → 0.0.
        assert!((rsi_score(&trending(100.0, 1.0, 60)) - 1.0).abs() < 1e-9);
        assert!((rsi_score(&trending(200.0, -2.0, 60)) - 0.0).abs() < 1e-9);
    }

    // ── Volume breakout ──
    #[test]
    fn volume_at_average_is_zero() {
        // 51 identical bars: latest == avg → ratio 1.0 → score 0.0.
        let vols = vec![1000.0; 51];
        assert_eq!(volume_breakout_score(&vols), 0.0);
    }

    #[test]
    fn volume_spike_maxes_feature() {
        // 50 bars of 1000, then a 1500 bar (1.5×) → score 1.0.
        let mut vols = vec![1000.0; 50];
        vols.push(1500.0);
        assert!((volume_breakout_score(&vols) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn volume_below_average_is_zero() {
        let mut vols = vec![1000.0; 50];
        vols.push(500.0); // 0.5× average
        assert_eq!(volume_breakout_score(&vols), 0.0);
    }

    #[test]
    fn volume_empty_is_neutral() {
        assert_eq!(volume_breakout_score(&[]), 0.5);
    }

    // ── Relative strength vs SPY ──
    #[test]
    fn rs_too_short_is_neutral_one() {
        // < lookback+1 points → RS returns 1.0 (matching market).
        let sym = trending(100.0, 1.0, 30);
        let bench = trending(100.0, 1.0, 30);
        assert!((relative_strength(&sym, &bench, RS_LOOKBACK_DEFAULT) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn rs_match_is_one() {
        // Symbol and benchmark identical → RS exactly 1.0.
        let sym = trending(100.0, 1.0, 60);
        let bench = sym.clone();
        assert!((relative_strength(&sym, &bench, RS_LOOKBACK_DEFAULT) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn rs_outperformer_above_one() {
        // Symbol rises faster than benchmark → RS > 1.
        let sym = trending(100.0, 2.0, 60); // +2/day
        let bench = trending(100.0, 1.0, 60); // +1/day
        let rs = relative_strength(&sym, &bench, RS_LOOKBACK_DEFAULT);
        assert!(rs > 1.0, "outperformer RS should be > 1, got {rs}");
    }

    #[test]
    fn rs_laggard_below_one() {
        let sym = trending(100.0, 0.5, 60); // +0.5/day
        let bench = trending(100.0, 1.0, 60); // +1/day
        let rs = relative_strength(&sym, &bench, RS_LOOKBACK_DEFAULT);
        assert!(rs < 1.0, "laggard RS should be < 1, got {rs}");
    }

    #[test]
    fn rs_score_match_is_midpoint() {
        let sym = trending(100.0, 1.0, 60);
        let bench = sym.clone();
        // RS = 1.0 → centered → score 0.5.
        assert!((relative_strength_score(&sym, &bench) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn rs_score_outperformer_above_midpoint() {
        let sym = trending(100.0, 2.0, 60);
        let bench = trending(100.0, 1.0, 60);
        assert!(relative_strength_score(&sym, &bench) > 0.5);
    }

    #[test]
    fn rs_score_strong_outperformer_clamps_to_one() {
        // Symbol doubles while benchmark barely moves (a tiny rise avoids the
        // flat-benchmark div-zero guard) → RS huge → score clamps to 1.0.
        let mut sym = vec![100.0; 60];
        sym[59] = 200.0;
        let bench = trending(100.0, 0.001, 60); // ~flat but strictly rising
        assert!((relative_strength_score(&sym, &bench) - 1.0).abs() < 1e-9);
    }

    /// Local alias so tests don't depend on the constants module's value.
    const RS_LOOKBACK_DEFAULT: usize = 50;

    // ── ADX ──
    /// Build candles from a close series with synthetic high/low (±range) and
    /// fixed volume, for ADX testing.
    fn candles_from_closes(closes: &[f64], range: f64, vol: u32) -> Vec<model::Candle> {
        closes
            .iter()
            .enumerate()
            .map(|(i, &c)| model::Candle {
                symbol: "TEST".into(),
                open: c,
                high: c + range,
                low: c - range,
                close: c,
                volume: vol,
                timestamp: i as u32,
            })
            .collect()
    }

    #[test]
    fn adx_too_short_returns_zeros() {
        let closes = trending(100.0, 1.0, 20); // < 2*14+1
        let candles = candles_from_closes(&closes, 1.0, 1000);
        assert_eq!(adx(&candles), (0.0, 0.0, 0.0));
    }

    #[test]
    fn adx_score_too_short_is_neutral() {
        let closes = trending(100.0, 1.0, 20);
        let candles = candles_from_closes(&closes, 1.0, 1000);
        assert!((adx_score(&candles) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn adx_strong_uptrend_is_bullish() {
        // Steady uptrend: +DI dominates, ADX high → score > 0.5.
        let closes = trending(100.0, 1.5, 60);
        let candles = candles_from_closes(&closes, 0.5, 1000);
        let s = adx_score(&candles);
        assert!(s > 0.5, "uptrend ADX score should be bullish, got {s}");
    }

    #[test]
    fn adx_strong_downtrend_is_bearish() {
        let closes = trending(200.0, -1.5, 60);
        let candles = candles_from_closes(&closes, 0.5, 1000);
        let s = adx_score(&candles);
        assert!(s < 0.5, "downtrend ADX score should be bearish, got {s}");
    }

    #[test]
    fn adx_returns_direction_dominance() {
        // On an uptrend, +DI should exceed −DI.
        let closes = trending(100.0, 1.5, 60);
        let candles = candles_from_closes(&closes, 0.5, 1000);
        let (_adx, plus_di, minus_di) = adx(&candles);
        assert!(plus_di > minus_di, "uptrend: +DI ({plus_di}) should exceed −DI ({minus_di})");
    }
}
