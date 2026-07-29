# 08 — Calibrate mode: grid-search weight fitting

**What to build:** The `--calibrate` flag. Running `direction <symbols_file> --calibrate` fits the five indicator weights to the cached history by grid search, maximizing in-sample banded hit-rate, and prints the best weight combination it found along with that combination's in-sample hit-rate. The output of this run is the set of weights that the `--backtest` ticket's evaluation should use to produce its out-of-sample accuracy number (the one number that determines whether the signal has real edge).

**Blocked by:** 07 (backtest mode — provides the metric/label/split foundation)

**Status:** done

## Implementation notes

Implemented 2026-07-29. `--calibrate` flag on `direction`; grid search over all 10,626 weight combinations (5 weights, multiples of 5, summing to 100 — stars-and-bars C(24,4)).

**Performance optimization:** to make 10,626 candidates × ~82k in-sample days tractable, `signal.rs` gained `indicator_scores()` (the 5 weight-independent normalized scores) and `signal_from_scores()` (the weight-dependent weighted sum). The 5 scores are precomputed once per day; each candidate is then a cheap weighted-sum evaluation. `signal_backtest.rs` refactored to a `DayRow { scores, bullish }` representation shared by train/test/calibrate.

**Verification:** `cargo check` clean; full `cargo test` 189 passed (0 failed). 3 new grid-search tests: combo count = 10626 (stars-and-bars), all combos sum to 100 & are step multiples, separability (perfectly-separable synthetic data → hit-rate >95% with EMA200 dominating).

## RESEARCH VERDICT — the feature set has no 5–10d directional edge

```
best grid weights (step 5, sum 100): EMA20/50=0  EMA200=55  MACD=0  RSI=35  Volume=10
in-sample banded hit-rate: 52.4%  (82,320 calls, 82,320 days)
in-sample majority baseline: 57.0%
                                          gap: −4.6pp  ❌ below the bar
```

**Even with the best possible weights found by exhaustive grid search, the in-sample banded hit-rate is 52.4% vs a 57.0% majority baseline — still −4.6pp below the bar, in-sample.** Out-of-sample can only be worse (it was 47.0% vs 58.2% with seed weights per ticket 07).

Two informative findings from the weights the grid settled on:
1. **EMA20/50 and MACD got zeroed out** — the grid search confirmed the momentum EMAs and MACD carry no useful 5–10d signal here. Only EMA200 (the regime flag) and RSI contribute anything.
2. **The bar is high** — US equities drift up, so "always bullish" is ~57% on called days. Clearing it requires real predictive edge, which these 5 indicators don't have on this horizon.

## What this means for the map

The v1 feature set (tickets 01–02) is **edge-less on a 5–10 day horizon, and no weight tuning fixes it.** Per the spec's "one number that matters": the signal does NOT clear the majority-class baseline, so **production integration should not proceed.**

The path forward (if pursued) is the map's **fog**, which now graduates from "nice to have" to "the actual path to edge":
- **RS-vs-SPY** (relative strength vs benchmark) — likely the highest-value addition; a stock lagging the index is a classic false-signal filter.
- **ADX** (trend strength) — to kill EMA/MACD whipsaw.
- **Per-regime weight adjustment** — weights varying by bull/bear regime.

These would each be a *new* effort (graduate from fog → new tickets), re-using this tool's `--backtest`/`--calibrate` infrastructure to validate. The current `direction` subcommand stands as a working, tested research tool regardless.

- [ ] `--calibrate` runs a grid search over the five indicator weights: each weight swept in multiples of 5 subject to summing to 100 (stars-and-bars combinatorial space).
- [ ] The search maximizes **in-sample banded hit-rate** on the older two-thirds of the cached history (the calibration/train split), reusing the label, abstention band, and metric established in the backtest ticket. The abstention band remains the fixed `[0.40, 0.60]` constant — only the weights are tuned.
- [ ] The output prints the best weight combination found and its in-sample banded hit-rate, so the optimization's result is transparent and reproducible.
- [ ] The coarse 5% step size is intentional (limits overfitting granularity for a research tool) — documented in a comment/note rather than made configurable.
- [ ] The grid search is a pure function (train candle slices in → best weight combination out), unit-tested with a toy in-sample set that returns a known-best combination. `cargo test` passes; `cargo build` compiles clean.
- [ ] The relationship between calibrate and backtest is clear: calibrate finds the weights on the train split; backtest measures those weights on the test split. (Whether backtest auto-uses the last-calibrated weights or takes them as a flag is an implementation detail resolved here — pick the simpler wiring.)
