//! Up/down directional signal — composite scorer and live-predict entry point.
//!
//! The composite is a weighted sum of individually-normalized indicators
//! (`indicators` module), yielding a `[0, 1]` value where `> 0.5` indicates a
//! bullish bias over ~10 trading days. The design mirrors the option-scoring
//! `ScoreParams` / `calculate_put_score` pattern (`src/model.rs`).
//!
//! The skeleton (ticket 05) wires only the EMA20/50 alignment term end-to-end.
//! Ticket 06 expands the composite to the full 5-indicator set and polishes
//! the output table.

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
}

impl Default for SignalParams {
    fn default() -> Self {
        Self {
            weight_ema_alignment: constants::SIGNAL_WEIGHT_EMA_ALIGNMENT,
        }
    }
}

/// The directional signal value for a single close-price series.
///
/// Weighted sum of normalized indicators divided by total weight, in `[0, 1]`.
/// Returns `0.5` (dead neutral) when `closes` is empty. The skeleton wires only
/// the EMA20/50 alignment term; ticket 06 adds EMA200, MACD, RSI, volume.
pub fn compute_signal(closes: &[f64], params: &SignalParams) -> f64 {
    let total_weight = params.weight_ema_alignment;
    if total_weight <= 0.0 {
        return 0.5;
    }

    let weighted = indicators::ema_alignment_score(closes) * params.weight_ema_alignment;
    weighted / total_weight
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

/// Per-symbol directional read, computed by `run_predict`.
#[derive(Debug, Clone)]
struct DirectionRead {
    symbol: String,
    signal: f64,
}

/// Live-predict mode: read each symbol's cached candles, compute the signal,
/// and print the `SYMBOL | SIGNAL | DIR` table to stdout.
///
/// DB-read-only (no live fetching) — see map decision 04. Candle retrieval
/// failures for an individual symbol are logged and skipped so one bad symbol
/// doesn't abort the run.
pub fn run_predict(conn: &Connection, symbols: &[String]) -> model::Result<()> {
    let params = SignalParams::default();

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
        let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
        let signal = compute_signal(&closes, &params);
        reads.push(DirectionRead {
            symbol: symbol.clone(),
            signal,
        });
    }

    if reads.is_empty() {
        log::warn!("No signals computed (no symbols had candles).");
        return Ok(());
    }

    print_table(&reads);
    Ok(())
}

/// Print the `SYMBOL | SIGNAL | DIR` table, sorted most-confident first
/// (`|signal − 0.5|` desc). Ticket 06 adds drivers/confidence columns,
/// neutral dimming, `--top`, and `--json`.
fn print_table(reads: &[DirectionRead]) {
    let mut sorted: Vec<&DirectionRead> = reads.iter().collect();
    sorted.sort_by(|a, b| {
        (b.signal - 0.5).abs().partial_cmp(&(a.signal - 0.5).abs()).unwrap_or(std::cmp::Ordering::Equal)
    });

    let stdout = io::stdout();
    let mut out = io::BufWriter::new(stdout.lock());
    let _ = writeln!(out, "{:<8} {:>8} {:>6}", "SYMBOL", "SIGNAL", "DIR");
    let _ = writeln!(out, "{:-<8} {:->8} {:->6}", "", "", "");
    for r in &sorted {
        let _ = writeln!(
            out,
            "{:<8} {:>8.3} {:>6}",
            r.symbol,
            r.signal,
            direction(r.signal)
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn trending(start: f64, step: f64, count: usize) -> Vec<f64> {
        (0..count).map(|i| start + step * i as f64).collect()
    }

    #[test]
    fn signal_is_bullish_on_uptrend() {
        let closes = trending(100.0, 1.0, 60);
        let s = compute_signal(&closes, &SignalParams::default());
        assert!(s > 0.5, "uptrend should be bullish, got {s}");
    }

    #[test]
    fn signal_is_bearish_on_downtrend() {
        let closes = trending(200.0, -2.0, 60);
        let s = compute_signal(&closes, &SignalParams::default());
        assert!(s < 0.5, "downtrend should be bearish, got {s}");
    }

    #[test]
    fn signal_is_neutral_on_flat() {
        let closes = vec![100.0; 60];
        let s = compute_signal(&closes, &SignalParams::default());
        assert!((s - 0.5).abs() < 1e-9, "flat should be dead neutral, got {s}");
    }

    #[test]
    fn empty_closes_is_dead_neutral() {
        let s = compute_signal(&[], &SignalParams::default());
        assert!((s - 0.5).abs() < 1e-9);
    }

    #[test]
    fn zero_weight_is_dead_neutral() {
        // Defensive: no weight ⇒ avoid div-by-zero, return neutral.
        let params = SignalParams {
            weight_ema_alignment: 0.0,
        };
        let s = compute_signal(&trending(100.0, 1.0, 60), &params);
        assert!((s - 0.5).abs() < 1e-9);
    }

    #[test]
    fn direction_uses_neutral_band() {
        assert_eq!(direction(0.61), "BULL");
        assert_eq!(direction(0.60), "NEUT"); // boundary: > HIGH (0.60) not >=
        assert_eq!(direction(0.45), "NEUT");
        assert_eq!(direction(0.39), "BEAR");
        assert_eq!(direction(0.40), "NEUT"); // boundary: < LOW (0.40) not <=
    }
}
