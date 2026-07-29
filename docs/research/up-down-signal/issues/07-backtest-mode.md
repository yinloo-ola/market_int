# 07 — Backtest mode: out-of-sample evaluation + baselines

**What to build:** The `--backtest` flag. Running `direction <symbols_file> --backtest` evaluates the (seed-weighted) directional signal's accuracy on the most-recent one-third of the cached history — the out-of-sample split the calibration never sees — and prints the headline accuracy numbers plus the baselines that determine whether the signal has real edge. This ticket creates the signal-backtest module and its point-in-time evaluation logic.

**Blocked by:** 06 (full live-predict composite)

**Status:** done

## Implementation notes

Implemented 2026-07-29. New `src/signal_backtest.rs` (185 lines) + `--backtest` / `--horizon` flags on `direction`.

**Design:** loads all candles per symbol into a `HashMap` once (mirrors `backtest::load_all_candles`), takes the most-recent 1/3 as the out-of-sample split, then walks each simulation day `i`: signal from `closes[..=i]` + `volumes[..=i]`, label = `closes[i+H] > closes[i]`. Look-ahead-free (signal never sees past `i`).

**Pure-function metrics** (unit-tested, 9 new tests): `banded_hit_rate` (calls only, band `[0.40,0.60]` held constant), `unconditional_hit_rate` (all days), `majority_class_baseline` (max realized-class rate on called days). `evaluate_series` + `dedup_horizons` also tested.

**Verification:** `cargo check` clean; full `cargo test` 186 passed (0 failed). End-to-end smoke test on 232 symbols works.

## Headline result (seed weights, out-of-sample)

| Horizon | Banded hit-rate | Majority baseline | Verdict |
|---|---|---|---|
| **10d (primary)** | **47.0%** | **58.2%** | ❌ −11.2pp |
| 5d | 46.8% | 55.5% | ❌ −8.7pp |
| 7d | 47.0% | 56.6% | ❌ −9.6pp |

**The seed-weighted signal does NOT clear the majority-class baseline at any horizon — it is materially worse than always-guessing-bullish.** This is the spec's "one number that matters," and it answers honestly. Ticket 08 (grid-search calibration) is the next test: can *fitted* weights rescue it, or is the feature set itself edge-less on a 5–10 day horizon? If 08 also fails to clear the bar, the map's fog (ADX, RS-vs-SPY, regime adjustment) becomes the path forward rather than production integration.

- [ ] A new signal-backtest module exists, reusing the existing point-in-time candle-retrieval helper to walk the history without look-ahead.
- [ ] The prediction label is defined precisely: bullish iff the close-to-close return over the horizon exceeds zero. The primary horizon default is 10 trading days; an optional `--horizon <days>` flag overrides it.
- [ ] `--backtest` evaluates only the most-recent one-third of the cached history (the out-of-sample split), using the seed weights (calibration lands in the next ticket).
- [ ] The output reports the **banded hit-rate** — accuracy over only the days the signal made a call (signal outside the fixed `[0.40, 0.60]` abstention band), with the band held constant (not tuned).
- [ ] The output also reports the **unconditional hit-rate** (all days, no abstention) alongside the banded figure so both shapes are visible.
- [ ] The output reports **both baselines**: the majority-class rate (always-bullish), computed on the called days only for a fair comparison against the banded hit-rate, as the primary bar the signal must clear; and the 50/50 coin-flip rate for intuition.
- [ ] The 5-day and 7-day horizon hit-rates are reported as free secondary diagnostics (the per-day signal is computed once; the label is what happened H days later).
- [ ] The signal-backtest module's unit tests cover the label assignment at H=10, the banded-hit-rate computation (correct abstention on the neutral band), the unconditional hit-rate, and the baseline computation as pure functions over slices. `cargo test` passes; `cargo build` compiles clean.
