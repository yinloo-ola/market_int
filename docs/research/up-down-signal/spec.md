- **Status:** ready-for-agent
- **Effort:** `up-down-signal`
- **Source:** Synthesized from the `up-down-signal` wayfinder map (tickets 01–04, all resolved).

# Spec: `direction` — Up/Down Signal Predictor

## Problem Statement

As the developer of `market_int`, I currently select put-option candidates using a composite scorer that considers Sharpe, safety, return proximity, and (disabled) trend — but it has **no forward-looking directional view** of the underlying. I can't tell whether a given symbol is exhibiting a bullish or bearish bias over the short term. I want to research and validate a directional signal (up/down over ~5–10 trading days) *before* ever coupling it to production scoring, so I can judge its quality on real data first. I need a standalone CLI tool that computes such a signal per symbol and reports it, plus the ability to calibrate its weights and measure its out-of-sample accuracy against my own cached historical data.

## Solution

A new `direction` CLI subcommand that, given a symbols file, reads each symbol's cached daily OHLCV candles from the SQLite store and computes a continuous directional signal in `[0, 1]` (values above 0.5 indicating a bullish bias over a 10-trading-day horizon). The signal is a weighted composite of five technical indicators across two layers — Trend (EMA20/50 alignment, EMA200 regime flag) and Momentum (MACD, RSI, volume breakout). The subcommand prints a confidence-sorted table to stdout.

The tool operates in three modes via flags: **live predict** (default — print the signal table), **calibrate** (`--calibrate` — grid-search the indicator weights against a 2-year in-sample split), and **backtest** (`--backtest` — evaluate the calibrated weights on a 1-year out-of-sample split, reporting hit-rate against majority-class and coin-flip baselines). The data source is read-only from the existing candle store; no live market-data fetching in v1.

This is explicitly a **dev/research tool**. It does not publish to Telegram and does not alter the put-option scorer — those are separate future efforts contingent on the signal proving useful out of sample.

## User Stories

1. As the developer, I want to run `direction data/symbols.csv` and see a confidence-sorted table of directional signals for every symbol, so that I can quickly scan which names have a strong bullish or bearish bias today.
2. As the developer, I want each table row to show the continuous signal value, a BULL/BEAR/NEUTRAL direction label, and the top contributing drivers, so that I can debug *why* a symbol scored the way it did rather than trusting a black box.
3. As the developer, I want neutral-band symbols (signal in `[0.40, 0.60]`) shown but dimmed and sorted to the bottom, so that the strong reads dominate visually while I still see how many names are indeterminate.
4. As the developer, I want to limit output with `--top N`, so that I can focus on only the most confident calls when scanning a large symbol universe.
5. As the developer, I want machine-readable output via `--json`, so that I can pipe the signal values into my own further analysis tooling.
6. As the developer, I want to override the prediction horizon with `--horizon <days>`, so that I can experiment with 5- or 7-day labels in addition to the default 10-day.
7. As the developer, I want to run `direction data/symbols.csv --calibrate`, so that the indicator weights are fit to maximize in-sample directional accuracy on the older two-thirds of my cached history.
8. As the developer, I want `--calibrate` to report the best weight combination it found and its in-sample hit-rate, so that I can see what the optimization settled on.
9. As the developer, I want to run `direction data/symbols.csv --backtest`, so that I can measure the (calibrated) signal's directional accuracy on the most-recent one-third of my cached history — data the calibration never saw.
10. As the developer, I want `--backtest` to report the banded hit-rate (calls only), the unconditional hit-rate (all days), and both the majority-class and coin-flip baselines, so that I can judge whether the signal has real edge or is merely riding the upward equity drift.
11. As the developer, I want the neutral band used for abstention to be a fixed constant (`[0.40, 0.60]`), so that only the weights are calibrated — avoiding the methodological error of tuning two things against the same in-sample data.
12. As the developer, I want the EMA20/50 and EMA200 indicators to normalize as discrete regime flags, so that "price above its moving averages" reads as a clean on/off signal rather than noisy magnitude.
13. As the developer, I want MACD, RSI, and volume breakout to normalize as continuous magnitudes, so that the strength of a momentum burst contributes proportionally to the composite rather than being flattened to a bucket.
14. As the developer, I want MACD magnitude normalized against its own recent standard deviation, so that the signal is comparable across a $20 stock and a $500 stock without price-scale contamination.
15. As the developer, I want the RSI normalization to respect a neutral band (10–90), so that deep oversold reads as fully bearish and extreme overbought as fully bullish.
16. As the developer, I want a +50%-volume day (1.5× the 50-day average) to max out the volume-breakout feature, so that a clear volume spike registers as full bullish confirmation.
17. As the developer, I want the indicator math isolated in its own module, so that future indicators (e.g. ADX, relative strength) can be added without disturbing the composite scorer.
18. As the developer, I want the seed weights to be tunable constants in `constants.rs`, so that I can hand-adjust them or paste in calibrated values without editing logic.
19. As the developer, I want the new code to follow the project's pure-function testing convention, so that the indicator math, normalizations, composite, and backtest metrics are all unit-tested with no I/O.
20. As the developer, I want the composite scorer to mirror the existing option-scoring `ScoreParams` pattern, so that the new code reads like the surrounding codebase.
21. As the developer, I want the prediction label to be `close[t+10] / close[t] − 1 > 0`, so that there is a precise, reproducible definition of "up" to score against.
22. As the developer, I want 5-day and 7-day horizon hit-rates reported as secondary diagnostics for free, so that I can compare horizon choices without re-running the backtest.
23. As the developer, I want the tool to read from the existing candle store (no live fetching), so that backtests are deterministic and reproducible against my cached 850-day history.

## Implementation Decisions

- **New CLI subcommand `direction`.** Added as a `Direction` variant on the existing clap-derive `Commands` enum, with a match arm in the command-dispatch block. clap auto-generates the `direction` name. The variant carries: the symbols-file path (positional, consistent with all sibling subcommands), a `--calibrate` flag, a `--backtest` flag, an optional `--horizon <days>` (default 10), an optional `--top <n>`, and an optional `--json` flag.

- **Three new modules, clean separation of concerns:**
  - An **indicators module** holds the net-new technical-indicator *math* as pure functions: EMA200, MACD (computing line, signal, and histogram), RSI (Wilder smoothing), and volume-breakout ratio. It builds on the project's existing exponential-moving-average primitive. This module is the future home for any additional indicators.
  - A **signal module** holds the composite scorer and its tunable parameter struct. The parameter struct mirrors the existing option-scoring parameter struct shape (default values read from `constants.rs`); it holds the five indicator weights and the normalization constants. This module implements the five per-indicator normalizations and the weighted composite that produces the `[0, 1]` signal. It exposes the entry point the live-predict mode calls.
  - A **signal-backtest module** holds the point-in-time evaluation and grid-search calibration. It reuses the existing point-in-time candle-retrieval helper. It implements label assignment (the 10-day forward return sign), banded and unconditional hit-rate, the majority-class and coin-flip baselines, and the weight grid search. It exposes two entry points — one for calibrate mode, one for backtest mode.

- **Normalization philosophy: hybrid.** Trend indicators normalize as discrete regime flags; momentum indicators normalize as continuous magnitudes. Specifically:
  - EMA20/50 alignment → discrete: full value if price is above both EMAs which are themselves stacked bullishly; a partial value if price is above one but not stacked; zero on a bearish stack.
  - EMA200 → discrete flag: full value if price is above EMA200, else zero.
  - MACD histogram → continuous: the histogram divided by the standard deviation of the recent histogram series, clamped, then shifted to the `[0, 1]` range. Self-referential normalization keeps it stock-agnostic.
  - RSI → continuous: linear map across a neutral band (low/ high constants), clamped.
  - Volume breakout → continuous: the ratio of current volume to its 50-day average, normalized so that a configured spike ratio (1.5×) maxes the feature, clamped.

- **Composite output and band.** The composite is the weighted sum of normalized indicators divided by the total weight, yielding a `[0, 1]` value; values above 0.5 indicate bullish bias. The same fixed band `[0.40, 0.60]` is used for both the backtest's abstention rule and the live predictor's BULL/BEAR/NEUTRAL display mapping (one band, two consumers — no inconsistency).

- **Seed weights (momentum-leaning, summing to 100):** EMA20/50 alignment 25, EMA200 15, MACD 25, RSI 20, volume breakout 15. These are starting points to be overwritten by calibration; they live as named constants following the project's existing weight-constant naming convention.

- **New tunable constants** added to the project's constants module, following the existing naming convention for scoring weights: the five indicator weights; the RSI normalization band endpoints; the volume-spike ratio that maxes the feature; the MACD self-referential standard-deviation window length; and the neutral-band edges.

- **Train/test split.** The cached ~850-day candle history is divided into an in-sample (calibration) portion — the older two-thirds, roughly 2 years / ~504 trading days — and an out-of-sample (validation) portion — the most-recent one-third, roughly 1 year / ~252 trading days. Calibration sees only the in-sample portion; the headline accuracy number is measured on the out-of-sample portion.

- **Calibration method: grid search.** Each of the five weights is swept in multiples of 5 subject to summing to 100; the combination maximizing in-sample banded hit-rate is selected. The coarse step size is intentional — it limits overfitting granularity for a research tool. The chosen combination and its in-sample hit-rate are reported.

- **Data source: read-only from the existing candle store.** Candles are retrieved via the existing candle-retrieval helper (chronological, most-recent N). No live market-data fetching in v1; a future `--refresh` convenience is deferred.

- **Output (live-predict mode):** a stdout table, one row per symbol, sorted by absolute distance of the signal from 0.5 (most-confident calls first), with neutral-band rows shown but visually de-emphasized and sorted to the bottom. Columns convey the symbol, the continuous signal value, the direction label, the top contributing drivers, and a confidence indicator.

- **Architectural fit.** The composite-scorer design deliberately mirrors the existing option-scoring architecture (tunable parameter struct with defaults from constants; weighted sum of individually-normalized terms; pre-filter fail-fast pattern), so the new code reads like the surrounding codebase rather than introducing a parallel pattern.

## Testing Decisions

- **What makes a good test here:** tests assert *external behavior of pure functions* — given a fixed input series, the indicator/normalization/composite/metric function returns the expected numeric output. No I/O, no filesystem, no database, no time-dependent values. A test that needed to read a real candle table or call the CLI would be testing the wrong thing at the wrong seam.

- **Single seam: in-module `#[cfg(test)]` unit tests**, exactly the established `model.rs::mod tests` pattern. Every new module (`indicators`, `signal`, `signal_backtest`) carries its own `mod tests` block of pure-function tests. This is the highest useful seam and matches the repo's documented convention that all tests are pure unit tests with no I/O.

- **Modules tested and prior art:**
  - *Indicators module* — EMA200, MACD line/signal/histogram, RSI, volume-breakout ratio. Prior art: the existing EMA/trend ratio functions and `sharpe.rs`/`maxdrop.rs` (pure functions over candle/close slices). Tests use hand-computable small series with known answers.
  - *Signal module* — each of the five normalizations (discrete flag boundaries, continuous clamping/shift), and the `compute_signal` composite (weighted sum, `[0,1]` range, >0.5 bullish). Prior art: `calculate_put_score`, `calculate_trend_factor`, `momentum_flag` tests in `model.rs::mod tests`.
  - *Signal-backtest module* — label assignment at H=10 (the forward-return sign), banded-hit-rate computation (correct abstention on the neutral band), unconditional hit-rate, baseline computation, and the grid search (given a toy in-sample set, returns the known-best weight combo). Prior art: pure statistical-function tests over slices.

- **Explicitly not tested at this seam:** the CLI subcommand wiring, stdout formatting, and table rendering. These are thin glue over the tested pure functions and follow the repo's "no integration tests" convention. If confidence in the wiring is later wanted, it would be a separate, consciously-introduced integration seam — not part of this spec.

## Out of Scope

- **Telegram publishing of signals.** This is a dev/research tool; publishing is a separate future effort contingent on the signal validating out of sample.
- **Integration with the put-option scorer / production scoring changes.** Same — a separate future effort (a potential `modulate-option-scoring` effort) post-validation.
- **Filter-layer indicators.** ADX(14), relative strength vs SPY/QQQ, and the ATR family are deferred. ADX and RS-vs-SPY may graduate as v2 enhancements; ATR-proper is superseded by the existing realized-volatility computation; post-earnings momentum has no available data source (the earnings feed provides only upcoming report date and expected EPS, not actual results or surprise).
- **Upcoming-earnings risk-gate overlay.** A natural v2 addition mirroring the existing earnings safety multiplier, but not part of v1.
- **Non-5–10-day horizons.** Intraday/1-day and medium-term (20–60 day) horizons are excluded; 10 days is the primary label, with 5 and 7 reported only as free secondary diagnostics.
- **Per-sector or per-regime weight adjustment.** The data exists (market-regime score; sector column in the symbols file) but weight variation by sector/regime is a v2 concern, graduating only if the validated signal is materially weak in one regime.
- **Live market-data fetching / a `--refresh` flag.** v1 reads only from the cached candle store.
- **Integration tests / CLI end-to-end tests.** Excluded to respect the repo's established pure-unit-test convention.

## Further Notes

- **Provenance.** This spec synthesizes the four resolved decision tickets of the `up-down-signal` wayfinder map (`.scratch/up-down-signal/issues/01–04`, all `resolved`; see `.scratch/up-down-signal/map.md`). Every design choice above is the recorded resolution of a specific ticket; nothing here is newly invented.
- **Grounding.** All "existing" references (EMA primitive, point-in-time candle retrieval, the option-scoring parameter-struct pattern, the in-module test convention, the ~850-day candle count, the absence of ETF/benchmark and post-earnings-surprise data) were verified against the codebase during the map's charting phase.
- **The number that matters.** The entire effort is oriented around one question: does the calibrated signal's out-of-sample banded hit-rate clear the majority-class baseline? If it does not, the signal has no edge and production integration should not proceed regardless of how clean the implementation is. The backtest mode exists to answer this honestly.
- **Fog (post-validation v2 material).** ADX(14), RS-vs-SPY, upcoming-earnings risk gate, per-sector/regime weight adjustment, and a `--refresh` flag are recorded as "not yet specified" on the map and graduate individually only if the validated signal warrants them.
