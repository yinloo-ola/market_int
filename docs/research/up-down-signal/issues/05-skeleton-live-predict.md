# 05 — Walking skeleton: `direction` live-predict (one reused indicator)

**What to build:** The thinnest complete end-to-end path for the `direction` subcommand. Running `direction <symbols_file>` reads each symbol's cached daily candles from the SQLite store, computes a directional signal in `[0, 1]` using *only* the already-existing EMA20/50 trend signal (no new indicator math in this ticket), and prints a `SYMBOL | SIGNAL | DIR` table to stdout. This ticket exists to establish the architecture — the three new module files, the `SignalParams` tunable-parameter pattern, the `Direction` CLI variant and its dispatch arm, the read-only DB retrieval, and the in-mod pure-function test seam — with the smallest possible amount of content, so that any wiring, retrieval, or output issues surface with one indicator rather than five.

**Blocked by:** None — can start immediately.

**Status:** done

## Implementation notes

Implemented 2026-07-29. Files touched:
- `src/constants.rs` — added `SIGNAL_WEIGHT_EMA_ALIGNMENT`, `SIGNAL_NEUTRAL_LOW`, `SIGNAL_NEUTRAL_HIGH`.
- `src/indicators.rs` (new) — `ema_alignment_score(closes) -> f64` discrete flag (1.0 full bull / 0.5 partial / 0.0 bear), reusing the existing EMA primitive; 5 unit tests.
- `src/signal.rs` (new) — `SignalParams` (mirrors `ScoreParams`), `compute_signal`, `direction`, `run_predict` entry; 6 unit tests.
- `src/main.rs` — registered `indicators`/`signal` modules; added `Direction { symbols_file_path }` variant + dispatch arm calling `signal::run_predict(&conn, &symbols)`.

Verified: `cargo check` clean (zero warnings from new code); full `cargo test` 159 passed (148 existing + 11 new, 0 failed). End-to-end smoke test against the real DB: 232 symbols, 158 directional calls (BULL/BEAR), 74 NEUT, sorted most-confident first — table renders correctly.

Intentionally deferred to ticket 06: the 4 remaining indicators + full composite + output polish (drivers/confidence/sort-already-done/dim/`--top`/`--json`). The `--calibrate`/`--backtest` flags are not yet wired (tickets 07/08).

- [ ] A new `Direction` CLI variant exists on the command enum, taking the symbols-file path; clap exposes it as `direction <symbols_file>`. The dispatch arm reads symbols and opens the DB connection.
- [ ] A new indicators module and a new signal module exist (the third, signal-backtest module, is created in a later ticket). In this ticket they contain only what's needed to compute a signal from the EMA20/50 trend.
- [ ] A `SignalParams` struct exists, mirroring the existing option-scoring parameter-struct pattern, with its `Default` reading tunable values from the constants module. In this ticket it holds only the single EMA20/50 weight.
- [ ] The live-predict path retrieves candles via the existing read-only candle-retrieval helper (chronological, most-recent N) and computes a `[0, 1]` signal from the EMA20/50 alignment.
- [ ] Running `direction <symbols_file>` prints a `SYMBOL | SIGNAL | DIR` table to stdout (DIR mapped via the fixed `[0.40, 0.60]` band: >0.60 BULL, <0.40 BEAR, else NEUT). Output is deterministic given the cached candles.
- [ ] The new modules carry an in-mod `#[cfg(test)]` unit-test block of pure functions, mirroring the project's existing convention (pure functions, no I/O). `cargo test` passes; `cargo check`/`cargo build` compile clean.
