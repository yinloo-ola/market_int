- **Type:** wayfinder:grilling
- **Status:** resolved
- **Blocked by:** (none)

## Question

**What metrics does the train/test split measure, and how is the prediction label defined precisely?**

The validation approach is settled (train ≈2y / 504 days, test ≈1y / 252 days, no look-ahead). This ticket decides what the backtest computes against that split.

**1. Prediction label (the ground truth).** "5–10 day forward return > 0 = bullish" is the rough statement. Pin it:
- Exact horizon: 5? 7? 10? (or a blend?) — 5 aligns with the 5-day option window; 10 smooths noise.
- Return measure: close-to-close? high/low extremes? log return?
- How is the label assigned at each simulation day `t`: `sign(close[t+H] / close[t] - 1)`?

**2. Primary metric.** Suggest **hit rate** (fraction of days the directional call matches the label) on the *test* split. Alternatives: precision/recall per class, expected return per signal bucket, profit factor of a naive long/short. Decide one primary + maybe one secondary.

**3. Neutral band.** Continuous signal in `[0,1]` — is there a dead-zone (e.g. 0.45–0.55 = "no call") excluded from the hit-rate denominator? A band raises hit-rate but lowers coverage (fewer calls). Decide whether v1 has one.

**4. Baseline.** What's the naive benchmark the signal must beat? Suggest: (a) always-bullish hit-rate (the majority-class rate over the period), and (b) a 50/50 coin. The signal is only useful if it clears the majority-class baseline *out of sample*.

**5. Where it runs.** Reuse `src/backtest.rs` infra (`get_candles_up_to` for point-in-time, the existing simulation loop shape) — confirm, vs. a separate `signal_backtest.rs`. Likely a new function in a new `signal.rs`, called by the existing `backtest` subcommand or a new flag.

## Resolution checklist

- [x] Pin the label (horizon H, return measure, assignment rule).
- [x] Pick primary metric (+ optional secondary).
- [x] Decide neutral band: yes/no, and band edges.
- [x] Lock the baseline(s) to beat.
- [x] Decide backtest code location (extend `backtest.rs` vs new module).

## Answer

**1. Prediction label (ground truth):**

- **Primary horizon H = 10 trading days.** Label at simulation day `t`: `bullish` iff `close[t+10] / close[t] − 1 > 0`.
- Return measure: **close-to-close** (simple return). Assignment: **sign of the 10-day return**.
- **Secondary diagnostics (reported free from the same per-day signal):** H = 5 and H = 7, same label rule. The signal is computed once per day; the label is "what happened H days later," so multiple horizons cost nothing extra.
- Rationale: H=10 is the standard swing-trade horizon; MACD/RSI/EMA resolve better over ~2 weeks than over 5 days. Aligns with the 5–10 day destination band.
- Sample counts (from ~850-day history, 2y/1y split): ~494 train labels, ~242 test labels at H=10.

**2. Primary metric + neutral band:**

- **Banded hit-rate** (the more demanding choice — forces the signal to *earn* its accuracy by only counting days it actually calls).
- **Neutral band held CONSTANT at [0.40, 0.60]** — a signal value in this range abstains; only `< 0.40` (bearish call) or `> 0.60` (bullish call) counts.
  - hit-rate = `matches / days_called` (days_called excludes the abstained band).
  - Band is **not a tuned parameter** — held constant so only the 5 weights are calibrated on the train split (avoids overfitting two things at once).
- **Secondary metric (unconditional):** hit-rate with NO band = `matches / total_days`. Reported alongside so the banded vs unconditional shapes are both visible.
- Approx coverage at ±0.10: ~40–55% of days called.

**3. Baselines (both reported):**

- **Majority-class (primary bar):** always-bullish hit-rate over the period (~53–55% typical for US equities). The signal is only useful if it clears this **out of sample** (on the 1-year test split). Computed on the *called days only* for a fair apples-to-apples comparison against banded hit-rate.
- **50/50 coin (secondary, intuition):** trivially implied by majority-class but reported for readability.

**4. Backtest code location:**

- **New module(s):** `src/signal.rs` (indicator math + composite scorer from ticket 02) and `src/signal_backtest.rs` (point-in-time evaluation + grid-search calibration). Co-locates the signal's definition and its evaluation; keeps the already-large `backtest.rs` (~1800 lines) from growing; clean separation of concerns.
- Reuses existing infra by *calling* it, not by living inside it: `store::candle::get_candles_up_to(&conn, sym, count, as_of)` (`src/store/candle.rs:86`) for point-in-time candle windows; the simulation-loop *shape* from `backtest.rs`.

**5. Calibration method (fog → decided):**

- **Grid search** over the 5 weights (ticket 02's `SIGNAL_WEIGHT_*`), each swept in **multiples of 5**, **summing to 100** (stars-and-bars combinatorial space — manageable). Keep the combo with the best **in-sample banded hit-rate** on the 2-year train split.
- Transparent, reproducible, trivially implementable in Rust. Coarse 5% steps are a *feature* for a research tool — limits overfitting granularity.
- Report: best weight combo + its train hit-rate, then evaluate that combo on the 1-year test split (the number that actually matters).

**Hand-off to ticket 04 (subcommand contract):** the backtest lives in `signal_backtest.rs`, invoked how? Likely a `--calibrate` or `--backtest` flag on the new subcommand (ticket 04 decides), OR a separate subcommand. The live predictor (`signal.rs`) uses the calibrated weights — either hardcoded post-calibration, or read from a config/constant. Ticket 04 pins the CLI surface; this ticket pins the evaluation math.

**Fog updated on the map:** the "Calibration method" fog is now decided (grid search) and removed. The "Threshold → directional call" fog is now *partially* resolved (band edges [0.40,0.60] decided) but the **directional-call mapping for the live predictor** (how `predict`/`signal` subcommand turns a continuous value into a BULL/BEAR/NEUTRAL label for display) remains and sharpens in ticket 04.
