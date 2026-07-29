//! Up/down directional signal — composite scorer and live-predict entry point.
//!
//! The composite is a weighted sum of individually-normalized indicators
//! (`indicators` module), yielding a `[0, 1]` value where `> 0.5` indicates a
//! bullish bias over ~10 trading days. The design mirrors the option-scoring
//! `ScoreParams` / `calculate_put_score` pattern (`src/model.rs`).
//!
//! Normalization philosophy is hybrid (map decision 02): discrete regime flags
//! for the EMAs (alignment, EMA200), continuous magnitudes for MACD/RSI/volume.

use std::io::{self, Write};

use crate::{constants, indicators, model};
use rusqlite::Connection;

/// Tunable parameters for the directional signal. `Default::default()`
/// initializes from the constants in `src/constants.rs`. The grid-search
/// calibration (ticket 08) constructs alternate `SignalParams` to sweep the
/// weights against the in-sample train split.
///
/// All fields are public so calibration can construct the struct directly,
/// mirroring `model::ScoreParams`.
#[derive(Debug, Clone, Copy)]
pub struct SignalParams {
    pub weight_ema_alignment: f64,
    pub weight_ema200: f64,
    pub weight_macd: f64,
    pub weight_rsi: f64,
    pub weight_volume: f64,
    pub weight_rs: f64,
    pub weight_adx: f64,
}

impl Default for SignalParams {
    fn default() -> Self {
        Self {
            weight_ema_alignment: constants::SIGNAL_WEIGHT_EMA_ALIGNMENT,
            weight_ema200: constants::SIGNAL_WEIGHT_EMA200,
            weight_macd: constants::SIGNAL_WEIGHT_MACD,
            weight_rsi: constants::SIGNAL_WEIGHT_RSI,
            weight_volume: constants::SIGNAL_WEIGHT_VOLUME,
            weight_rs: constants::SIGNAL_WEIGHT_RS,
            weight_adx: constants::SIGNAL_WEIGHT_ADX,
        }
    }
}

impl SignalParams {
    /// Total of the weights (the composite's divisor).
    fn total(&self) -> f64 {
        self.weight_ema_alignment
            + self.weight_ema200
            + self.weight_macd
            + self.weight_rsi
            + self.weight_volume
            + self.weight_rs
            + self.weight_adx
    }

    /// The 7 weights as an array, in indicator-scores order:
    /// `[ema_alignment, ema200, macd, rsi, volume, rs, adx]`.
    pub fn weights_array(&self) -> [f64; 7] {
        [
            self.weight_ema_alignment,
            self.weight_ema200,
            self.weight_macd,
            self.weight_rsi,
            self.weight_volume,
            self.weight_rs,
            self.weight_adx,
        ]
    }
}

/// A single indicator's contribution to the composite, for driver display.
#[derive(Debug, Clone, Copy)]
struct Contribution {
    name: &'static str,
    weight: f64,
    score: f64,
}

/// The full directional breakdown for one symbol's series.
#[derive(Debug, Clone)]
struct SignalBreakdown {
    contributions: Vec<Contribution>,
    signal: f64,
}

impl SignalBreakdown {
    /// Compute the full 7-indicator breakdown. `candles` (OHLCV) feed the ADX
    /// feature (needs high/low); `benchmark` (SPY closes) feeds RS. Pass `&[]`
    /// for benchmark when unavailable (RS → neutral).
    fn compute(
        candles: &[model::Candle],
        benchmark: &[f64],
        params: &SignalParams,
    ) -> Self {
        let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
        let volumes: Vec<f64> = candles.iter().map(|c| c.volume as f64).collect();
        let contributions = vec![
            Contribution {
                name: "EMA20/50",
                weight: params.weight_ema_alignment,
                score: indicators::ema_alignment_score(&closes),
            },
            Contribution {
                name: "EMA200",
                weight: params.weight_ema200,
                score: indicators::ema200_score(&closes),
            },
            Contribution {
                name: "MACD",
                weight: params.weight_macd,
                score: indicators::macd_score(&closes),
            },
            Contribution {
                name: "RSI",
                weight: params.weight_rsi,
                score: indicators::rsi_score(&closes),
            },
            Contribution {
                name: "Volume",
                weight: params.weight_volume,
                score: indicators::volume_breakout_score(&volumes),
            },
            Contribution {
                name: "RS",
                weight: params.weight_rs,
                score: indicators::relative_strength_score(&closes, benchmark),
            },
            Contribution {
                name: "ADX",
                weight: params.weight_adx,
                score: indicators::adx_score(candles),
            },
        ];
        let total = params.total();
        let signal = if total <= 0.0 {
            0.5
        } else {
            contributions
                .iter()
                .map(|c| c.weight * c.score)
                .sum::<f64>()
                / total
        };
        SignalBreakdown {
            contributions,
            signal,
        }
    }

    /// The two highest-weighted contributors (by `weight × |score − 0.5|`),
    /// formatted for the TOP-2 DRIVERS column.
    fn top_drivers(&self) -> String {
        let mut ranked: Vec<&Contribution> = self.contributions.iter().collect();
        ranked.sort_by(|a, b| {
            let ba = b.weight * (b.score - 0.5).abs();
            let aa = a.weight * (a.score - 0.5).abs();
            ba.partial_cmp(&aa).unwrap_or(std::cmp::Ordering::Equal)
        });
        ranked
            .iter()
            .take(2)
            .map(|c| format!("{}({:+.2})", c.name, c.score - 0.5))
            .collect::<Vec<_>>()
            .join(" ")
    }
}

/// The directional signal value for a single symbol. Weighted sum of normalized
/// indicators divided by total weight, in `[0, 1]`. Returns `0.5` when total
/// weight is zero (defensive). `candles` carry OHLCV (ADX needs high/low);
/// `benchmark` is SPY closes (RS feature); pass `&[]` when no benchmark.
pub fn compute_signal(
    candles: &[model::Candle],
    benchmark: &[f64],
    params: &SignalParams,
) -> f64 {
    SignalBreakdown::compute(candles, benchmark, params).signal
}

/// The 7 normalized indicator scores, weight-independent. Order:
/// `[ema_alignment, ema200, macd, rsi, volume, rs, adx]`. Precomputing these
/// once per day lets the grid-search calibration evaluate many weight-sets
/// cheaply as a weighted sum, without recomputing the expensive indicators.
pub fn indicator_scores(candles: &[model::Candle], benchmark: &[f64]) -> [f64; 7] {
    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
    let volumes: Vec<f64> = candles.iter().map(|c| c.volume as f64).collect();
    [
        indicators::ema_alignment_score(&closes),
        indicators::ema200_score(&closes),
        indicators::macd_score(&closes),
        indicators::rsi_score(&closes),
        indicators::volume_breakout_score(&volumes),
        indicators::relative_strength_score(&closes, benchmark),
        indicators::adx_score(candles),
    ]
}

/// Combine precomputed indicator scores with weights into a `[0, 1]` signal.
/// Returns `0.5` when total weight is zero (defensive). This is the
/// weight-dependent half of `compute_signal`, split out for grid search.
pub fn signal_from_scores(scores: [f64; 7], params: &SignalParams) -> f64 {
    let weights = params.weights_array();
    let total: f64 = weights.iter().sum();
    if total <= 0.0 {
        return 0.5;
    }
    let weighted: f64 = weights.iter().zip(scores.iter()).map(|(w, s)| w * s).sum();
    weighted / total
}

/// Direction label derived from a signal value via the fixed neutral band.
pub fn direction(signal: f64) -> &'static str {
    if signal > constants::SIGNAL_NEUTRAL_HIGH {
        "BULL"
    } else if signal < constants::SIGNAL_NEUTRAL_LOW {
        "BEAR"
    } else {
        "NEUT"
    }
}

/// Map `|signal − 0.5|` to a readable confidence band.
fn confidence(signal: f64) -> &'static str {
    let d = (signal - 0.5).abs();
    if d >= constants::SIGNAL_CONFIDENCE_STRONG {
        "STRONG"
    } else if d >= constants::SIGNAL_CONFIDENCE_MODERATE {
        "MODERATE"
    } else {
        "WEAK"
    }
}

/// Per-symbol directional read.
#[derive(Debug, Clone)]
struct DirectionRead {
    symbol: String,
    signal: f64,
    drivers: String,
}

/// Output format selector for live-predict mode.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OutputFormat {
    Table,
    Json,
}

/// Options for live-predict mode.
#[derive(Debug, Clone, Copy, Default)]
pub struct PredictOptions {
    pub top: Option<usize>,
    pub format: Option<OutputFormat>,
}

/// Load SPY (benchmark) closes from the candle store. Returns an empty vec if
/// unavailable — RS then defaults to neutral. Logged once. Shared by
/// `run_predict` (live) and the signal backtest (reused via the public path).
pub fn load_spy_closes(conn: &Connection) -> Vec<f64> {
    match crate::store::candle::get_candles(conn, "SPY", constants::CANDLE_COUNT) {
        Ok(candles) if !candles.is_empty() => {
            candles.iter().map(|c| c.close).collect()
        }
        _ => {
            log::warn!("No SPY candles; RS feature will be neutral (0.5).");
            Vec::new()
        }
    }
}

/// Live-predict mode: read each symbol's cached candles, compute the signal,
/// and emit the directional reads (table or JSON).
///
/// DB-read-only (no live fetching) — see map decision 04. Candle retrieval
/// failures for an individual symbol are logged and skipped. SPY (benchmark for
/// the RS feature) is loaded once.
pub fn run_predict(
    conn: &Connection,
    symbols: &[String],
    opts: PredictOptions,
) -> model::Result<()> {
    let params = SignalParams::default();
    let spy_closes = load_spy_closes(conn);

    let mut reads: Vec<DirectionRead> = Vec::new();
    for symbol in symbols {
        let candles = match crate::store::candle::get_candles(
            conn,
            symbol,
            constants::CANDLE_COUNT,
        ) {
            Ok(c) => c,
            Err(e) => {
                log::warn!("Failed to load candles for {symbol}: {e}; skipping.");
                continue;
            }
        };
        if candles.is_empty() {
            log::warn!("No candles for {symbol}; skipping.");
            continue;
        }
        let breakdown = SignalBreakdown::compute(&candles, &spy_closes, &params);
        reads.push(DirectionRead {
            symbol: symbol.clone(),
            signal: breakdown.signal,
            drivers: breakdown.top_drivers(),
        });
    }

    if reads.is_empty() {
        log::warn!("No signals computed (no symbols had candles).");
        return Ok(());
    }

    // Confidence-sort: most-confident calls first, neutrals to the bottom.
    reads.sort_by(|a, b| {
        (b.signal - 0.5)
            .abs()
            .partial_cmp(&(a.signal - 0.5).abs())
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    let limited: Vec<&DirectionRead> = match opts.top {
        Some(n) => reads.iter().take(n).collect(),
        None => reads.iter().collect(),
    };

    match opts.format.unwrap_or(OutputFormat::Table) {
        OutputFormat::Table => print_table(&limited),
        OutputFormat::Json => print_json(&limited),
    }
    Ok(())
}

/// Print the polished table: `SYMBOL | SIGNAL | DIR | TOP-2 DRIVERS | CONFIDENCE`.
/// Neutral-band rows are dimmed (ANSI) and sit at the bottom of the
/// confidence-sorted output.
fn print_table(reads: &[&DirectionRead]) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(
        out,
        "{:<8} {:>7} {:>5}  {:<22} {:>10}",
        "SYMBOL", "SIGNAL", "DIR", "TOP-2 DRIVERS", "CONFIDENCE"
    );
    let _ = writeln!(out, "{}", "-".repeat(56));
    for r in reads {
        let dim = "\x1b[2m";
        let reset = "\x1b[0m";
        let is_neut = direction(r.signal) == "NEUT";
        let line = format!(
            "{:<8} {:>7.3} {:>5}  {:<22} {:>10}",
            r.symbol,
            r.signal,
            direction(r.signal),
            r.drivers,
            confidence(r.signal)
        );
        if is_neut {
            let _ = writeln!(out, "{dim}{line}{reset}");
        } else {
            let _ = writeln!(out, "{line}");
        }
    }
}

/// Print machine-readable JSON (one object per line — JSON Lines).
fn print_json(reads: &[&DirectionRead]) {
    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    for r in reads {
        // Hand-rolled JSON line; fields are symbol (quoted), numbers, quoted dir.
        let sym = escape_json(&r.symbol);
        let drv = escape_json(&r.drivers);
        let _ = writeln!(
            out,
            r#"{{"symbol":"{sym}","signal":{:.3},"dir":"{}","drivers":"{drv}","confidence":"{}"}}"#,
            r.signal,
            direction(r.signal),
            confidence(r.signal)
        );
    }
}

fn escape_json(s: &str) -> String {
    s.replace('\\', "\\\\").replace('"', "\\\"")
}

#[cfg(test)]
mod tests {
    use super::*;

    fn trending(start: f64, step: f64, count: usize) -> Vec<f64> {
        (0..count).map(|i| start + step * i as f64).collect()
    }

    /// Build candles from a close series with synthetic high/low (±range) and
    /// fixed volume — enough OHLCV for the ADX feature.
    fn candles(closes: &[f64], range: f64) -> Vec<model::Candle> {
        closes
            .iter()
            .enumerate()
            .map(|(i, &c)| model::Candle {
                symbol: "TEST".into(),
                open: c,
                high: c + range,
                low: c - range,
                close: c,
                volume: 1000,
                timestamp: i as u32,
            })
            .collect()
    }

    #[test]
    fn signal_bullish_on_uptrend() {
        let closes = trending(100.0, 1.0, 250);
        let candles = candles(&closes, 0.5);
        let spy = trending(100.0, 1.0, 250); // matching benchmark → RS neutral
        let s = compute_signal(&candles, &spy, &SignalParams::default());
        assert!(s > 0.5, "uptrend should be bullish, got {s}");
    }

    #[test]
    fn signal_bearish_on_downtrend() {
        let closes = trending(300.0, -1.0, 250);
        let candles = candles(&closes, 0.5);
        let spy = trending(300.0, -1.0, 250); // matching benchmark → RS neutral
        let s = compute_signal(&candles, &spy, &SignalParams::default());
        assert!(s < 0.5, "downtrend should be bearish, got {s}");
    }

    #[test]
    fn signal_is_in_unit_range() {
        // Mixed/random series must still land in [0,1].
        let closes: Vec<f64> = (0..250).map(|i| 100.0 + (i as f64).sin() * 10.0).collect();
        let candles = candles(&closes, 0.5);
        let spy = vec![100.0; 250];
        let s = compute_signal(&candles, &spy, &SignalParams::default());
        assert!((0.0..=1.0).contains(&s), "signal out of [0,1]: {s}");
    }

    #[test]
    fn zero_total_weight_is_neutral() {
        let params = SignalParams {
            weight_ema_alignment: 0.0,
            weight_ema200: 0.0,
            weight_macd: 0.0,
            weight_rsi: 0.0,
            weight_volume: 0.0,
            weight_rs: 0.0,
            weight_adx: 0.0,
        };
        let candles = candles(&trending(100.0, 1.0, 250), 0.5);
        let s = compute_signal(&candles, &[], &params);
        assert!((s - 0.5).abs() < 1e-9);
    }

    #[test]
    fn weights_sum_to_100_by_default() {
        let p = SignalParams::default();
        assert!((p.total() - 100.0).abs() < 1e-9, "default weights must sum to 100");
    }

    #[test]
    fn direction_uses_neutral_band() {
        assert_eq!(direction(0.61), "BULL");
        assert_eq!(direction(0.60), "NEUT"); // > HIGH (0.60) not >=
        assert_eq!(direction(0.45), "NEUT");
        assert_eq!(direction(0.39), "BEAR");
        assert_eq!(direction(0.40), "NEUT"); // < LOW (0.40) not <=
    }

    #[test]
    fn confidence_bands() {
        assert_eq!(confidence(0.86), "STRONG"); // |0.36| >= 0.35
        assert_eq!(confidence(0.95), "STRONG");
        assert_eq!(confidence(0.70), "MODERATE"); // |0.20|
        assert_eq!(confidence(0.55), "WEAK"); // |0.05| < 0.15
        assert_eq!(confidence(0.50), "WEAK");
    }

    #[test]
    fn top_drivers_picks_highest_impact() {
        let closes = trending(100.0, 1.0, 250);
        let candles = candles(&closes, 0.5);
        let spy = trending(100.0, 1.0, 250);
        let bd = SignalBreakdown::compute(&candles, &spy, &SignalParams::default());
        let drv = bd.top_drivers();
        // On a clean uptrend every score is bullish; drivers string is non-empty.
        assert!(!drv.is_empty());
        assert!(drv.contains("EMA") || drv.contains("MACD") || drv.contains("RSI"));
    }

    #[test]
    fn signal_from_scores_weights_seven_terms() {
        // All-0.5 scores → neutral regardless of weights.
        let params = SignalParams::default();
        assert!((signal_from_scores([0.5; 7], &params) - 0.5).abs() < 1e-9);
    }
}
