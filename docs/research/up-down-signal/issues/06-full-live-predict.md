# 06 — Full 5-indicator live-predict + output polish

**What to build:** Complete the live-predict feature. Replace the skeleton's single-indicator signal with the full five-indicator weighted composite across the Trend and Momentum layers — EMA20/50 alignment, EMA200, MACD(12,26,9), RSI(14), and volume breakout — each normalized per the hybrid philosophy (discrete regime flags for the EMAs; continuous magnitudes for MACD/RSI/volume), combined into a `[0, 1]` composite via the seed weights. Then polish the output to its final form: the full table columns, confidence sorting, neutral-band dimming, and the optional `--top` and `--json` flags.

**Blocked by:** 05 (walking skeleton)

**Status:** done

## Implementation notes

Implemented 2026-07-29. Ticket 05's skeleton expanded to the full 5-indicator composite.

**indicators.rs** — 4 net-new indicators added (each pure, unit-tested): `ema200`, `macd` (line/signal/histogram via EMA12−EMA26, EMA9 signal), `rsi` (Wilder smoothing), `volume_breakout_ratio`. 5 normalizations: `ema_alignment_score` & `ema200_score` (discrete flags), `macd_score` (self-referential stdev → `[0,1]`), `rsi_score` (linear band map), `volume_breakout_score` (ratio clamp). 16 new unit tests (21 total in module).

**signal.rs** — `SignalParams` expanded to 5 weights; `SignalBreakdown` computes the composite + top-2 drivers; polished output: `SYMBOL|SIGNAL|DIR|TOP-2 DRIVERS|CONFIDENCE` table with confidence-sort and ANSI-dimmed neutrals, plus `--json` (JSON Lines) and `--top N`. 8 new unit tests.

**constants.rs** — `SIGNAL_WEIGHT_*` (5), `RSI_LOW/HIGH`, `VOLUME_SPIKE_FULL`, `MACD_STDEV_WINDOW`.

**main.rs** — `Direction` variant gained `--top` / `--json` flags; dispatch builds `PredictOptions`.

Verified: `cargo check` clean; full `cargo test` 177 passed (0 failed). End-to-end smoke test (232 symbols): 82 BULL / 92 BEAR / 58 NEUT, graded signals 0.039–0.963, drivers + confidence render, JSON mode valid. Table + JSON + `--top` all confirmed.

Deferred to tickets 07/08: `--backtest` / `--calibrate` flags.

- [ ] The indicators module implements the four net-new indicators as pure functions: EMA200, MACD (line, signal, histogram), RSI (Wilder smoothing), and volume-breakout ratio — building on the existing exponential-moving-average primitive.
- [ ] Each of the five indicators has its hybrid normalization implemented: EMA20/50 alignment as a discrete flag (full/partial/bear stack); EMA200 as a binary above/below flag; MACD histogram normalized against its own recent standard deviation (self-referential, stock-agnostic), clamped and shifted to `[0,1]`; RSI linearly mapped across the neutral band (low/high constants), clamped; volume breakout normalized so the configured spike ratio (1.5×) maxes the feature, clamped.
- [ ] `SignalParams` holds the full set of named tunables (five indicator weights + normalization constants), defaults read from the constants module. Seed weights (momentum-leaning, summing to 100) and the new constants are added to the constants module following the existing naming convention.
- [ ] The composite produces a `[0, 1]` signal as the weighted sum of normalized indicators; values above 0.5 indicate bullish bias.
- [ ] The output table is polished to its final form: columns `SYMBOL | SIGNAL (0.000–1.000) | DIR | TOP-2 DRIVERS | CONFIDENCE`; rows sorted by `|signal − 0.5|` descending (most-confident calls first); neutral-band rows shown but visually de-emphasized and sorted to the bottom.
- [ ] The optional `--top <n>` flag limits output to the N most-confident calls; the optional `--json` flag emits machine-readable output instead of the table.
- [ ] The indicators module's unit tests cover each indicator's math and each normalization's boundaries (flag thresholds, clamping/shift) using hand-computable small series with known answers. The signal module's tests cover the composite's weighted sum, `[0,1]` range, and `>0.5` bullish mapping. `cargo test` passes; `cargo build` compiles clean.
