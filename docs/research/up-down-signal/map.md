# Map: Up/Down Signal Predictor

- **Type:** wayfinder:map
- **Effort:** `up-down-signal`

## Destination

A standalone CLI dev/research subcommand (`predict` / `signal <path>`) that reads each symbol's daily OHLCV candles from the SQLite store, computes a composite directional signal, and prints a 5–10 trading-day bullish/bearish bias to stdout/log.

**Out of scope for this effort:** Telegram publishing, integration with the put-option scorer (`option.rs`), and production scoring changes. This is a research tool to judge signal quality before any production coupling. (See *Out of scope* — these may resume as a *separate* effort once the signal is validated.)

## Notes

- **Domain:** `market_int` Rust CLI. See `AGENTS.md`.
- **Key prior research (already done — do not re-explore):**
  - **Reusable now:** EMA20/50 ratios (`src/trend.rs` via `stats.rs::exponential_moving_average`), 20-day realized vol (`src/backtest.rs:19`), Sharpe, price-percentile, max-drop. All keyed by symbol in `collect_metrics_from_db` (`src/option.rs:677`).
  - **Build cheaply (EMA primitive exists):** EMA200, MACD (EMA12−EMA26, signal EMA9), RSI(14), volume breakout (vol ÷ avg-vol; `Candle.volume` exists).
  - **Build moderately (no TR/ATR helper exists):** ADX(14) — needs DM+/DM−, TR, Wilder smoothing.
  - **Not feasible without new data:** Relative strength vs SPY/QQQ (no ETFs in `symbols.csv`; SPY ad-hoc in `regime.rs`); post-earnings momentum (Tiger gives only upcoming date + `expected_eps`, no actual/surprise).
- **Suggested starting feature set (grounded, 3-layer):** Trend (EMA20/50 + EMA200, 35) → Momentum (MACD + RSI + volume breakout, 40) → Filter (ADX 15 + vol-regime 5 + RS-vs-SPY 5, 25). Earnings handled as a risk-gate overlay (mirrors `EARNINGS_SAFETY_MULTIPLIER`), not a directional weight.
- **Prediction label:** 5–10 trading-day forward return > 0 = bullish. Fixed for backtest scoring.
- **Validation split:** Train/calibrate on ~2 years (≈504 trading days, the older two-thirds of the 850-candle history); validate out-of-sample on ~1 year (≈252 days, the most-recent third). No look-ahead leakage.
- **Mirror this architecture:** the composite is a weighted sum of clamped/normalized terms over `ScoreParams`-style tunables — exactly the `calculate_put_score` pattern (`src/model.rs:197`, `ScoreParams` at `src/model.rs:31`).
- **Skills to consult:** `/grilling` + `/domain-modeling` for weight/feature decisions; `/research` if an indicator's canonical definition is needed; `/tdd` for the indicator math (pure functions, unit-testable).

## Decisions so far

- [Feature set (ticket 01)](issues/01-feature-set.md) — v1 is 5 features across Trend + Momentum layers: EMA20/50, EMA200, MACD(12,26,9), RSI(14), volume breakout. ADX/RS/earnings-gate deferred to fog; ATR-proper & post-earnings-momentum ruled out (superseded / no data).
- [Weight scheme (ticket 02)](issues/02-weight-scheme.md) — Hybrid normalization (discrete regime flags for EMAs; continuous magnitudes for MACD/RSI/volume). Seed weights (momentum-leaning, sum 100): EMA20/50 25, EMA200 15, MACD 25, RSI 20, Volume 15. Composite `[0,1]`, >0.5 bullish; `SignalParams` mirrors `ScoreParams`. Seeds to be calibrated by ticket 03's train split.
- [Backtest metrics (ticket 03)](issues/03-backtest-metrics.md) — Label H=10d (`close[t+10]/close[t]−1>0`; H=5/7 free secondary). Primary metric: banded hit-rate, band [0.40,0.60] held constant (weights-only calibration). Baselines: majority-class (primary bar) + 50/50 coin, both on called-days-only. New modules `signal.rs` + `signal_backtest.rs`. Calibration: grid search, 5% steps, max train banded hit-rate.
- [Subcommand contract (ticket 04)](issues/04-subcommand-contract.md) — Command `direction <path>` (neutral; avoids `predict` overpromise). Flags: `--calibrate` (grid search), `--backtest` (eval), optional `--horizon`/`--top`/`--json`. DB-read-only via `get_candles`. Output: confidence-sorted (`|sig−0.5|` desc), neutrals dimmed at bottom; reuses the [0.40,0.60] band for live DIR display. 3 modules: `indicators.rs` (math) + `signal.rs` (composite) + `signal_backtest.rs` (eval/calibrate).

## Status

🏁 **Effort complete — fog investigation exhausted, negative verdict confirmed.** All 4 design tickets (01–04), 4 implementation tickets (05–08), and 2 fog-graduation tickets (09 RS-vs-SPY, 10 ADX) are done. The `direction` tool ships complete and tested (202 unit tests; `--calibrate`/`--backtest`/live-predict all working; grid-search hot path optimized so 7-weight calibration runs in ~5 min).

**Full recorded results:** [`results.md`](results.md) — the headline, all five investigative angles, per-class breakdown, and the verification that the negative conclusion is not a computation bug.

**The definitive answer:** the indicator class (EMAs, MACD, RSI, volume, relative strength, ADX) has **no 5–10 day directional edge** on US large-caps. Three fog candidates investigated — weight calibration, RS-vs-SPY, ADX — three failures, all landing at ~52% in-sample vs ~57% majority baseline. Consistent with weak-form market efficiency at short horizons. Per the spec's "one number that matters," production integration should not proceed. The tool worked exactly as intended: it asked a precise question and got a well-validated, honest **no**.

The remaining items below are not worth pursuing without a fundamentally different feature class (options-flow, sentiment, fundamentals — none currently sourced). If revisited, it would be a fresh effort, not a resumption of this map.

## Not yet specified

(unlikely to graduate — see Status. Listed only if a future, different feature class makes them relevant again)
- **Per-sector vs per-regime weight adjustment.** Regime/sector data exists. Moot while the base feature set is edge-less.
- **Upcoming-earnings risk gate.** Non-directional overlay; irrelevant until there's a directional signal worth gating.
- **Live vs cached data (`--refresh`).** Convenience, not core.

## Out of scope

- **Telegram publishing of signals.** This is a dev/research tool. Would resume as a separate effort *after* the signal is validated.
- **Integration with the put-option scorer (`option.rs`) / production scoring changes.** Same — separate effort post-validation. (A future `modulate-option-scoring` map.)
- **Intraday / 1-day or 20–60 day horizons.** 5–10 days is fixed for this effort.
- **ATR proper.** Superseded — 20-day realized-vol reuse (`backtest.rs:19`) covers the volatility-regime job. (Closed in ticket 01.)
- **Post-earnings momentum.** No data source — Tiger `corporate_action` gives only upcoming `report_date` + `expected_eps`; no actual EPS / surprise. Can't graduate without a new data feed. (Closed in ticket 01.)
