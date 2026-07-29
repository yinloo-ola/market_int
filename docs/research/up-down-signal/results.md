# Results: Up/Down Signal Predictor

Final recorded results of the `direction` research tool's investigation, as of 2026-07-29. All numbers are out-of-sample (the most-recent 1/3 of the ~850-day candle history) unless noted; the calibration/grid-search used only the older 2/3 (train) and never saw the test split.

## Headline

**The indicator class has no 5–10 day directional edge on US large-caps.** Five independent angles converge on the same negative answer. This is consistent with weak-form market efficiency at short horizons, not a tooling failure.

## The five angles

### 1. Seed-weight out-of-sample (`--backtest`, default weights)
Default weights (EMA20/50=25, EMA200=15, MACD=25, RSI=20, Vol=15, RS=0, ADX=0), H=10d:

| Horizon | Banded hit-rate | Majority baseline | Gap |
|---|---|---|---|
| **10d (primary)** | **47.0%** | **58.2%** | **−11.2pp** |
| 5d | 46.8% | 55.5% | −8.7pp |
| 7d | 47.0% | 56.6% | −9.6pp |

Unconditional hit-rate (all days, no abstention): 47.5%. Coin-flip baseline: 50.0%.

### 2. Grid-search calibration (`--calibrate`)
Exhaustive grid over 7 weights (C(26,6)=230,230 combinations, 5% steps, summing to 100), maximizing in-sample banded hit-rate on the train split:

- Best weights: `EMA20/50=0  EMA200=60  MACD=0  RSI=0  Volume=0  RS=5  ADX=35`
- In-sample: 52.5% vs 57.1% majority (−4.6pp) — best possible still below the bar
- **Out-of-sample with those calibrated weights: 50.8% vs 57.7% (−6.9pp)** — calibration narrows the gap (−11.2 → −6.9) but never crosses zero

### 3. Relative strength vs SPY (ticket 09)
Added RS as a 6th indicator; grid gave it 15% weight. In-sample: 52.4% vs 57.1% (−4.7pp) — identical to without RS. It reshuffled weight away from Volume, not toward edge.

### 4. ADX trend-strength (ticket 10)
Added ADX as a 7th indicator (first ATR-family math in the codebase); grid gave it 35% weight. In-sample: 52.5% vs 57.1% (−4.6pp) — no improvement. The grid keeps settling on EMA200 as the single marginally-useful feature.

### 5. Abstention band sweep (`--band-sweep`)
Does abstaining more (wider neutral band → fewer, more-confident calls) help? **No — it makes it worse, monotonically:**

| Half-width | Hit-rate | Majority | Gap | Coverage |
|---|---|---|---|---|
| 0.05 (narrow) | 47.3% | 58.0% | −10.7pp | 85% |
| 0.10 (current) | 47.0% | 58.2% | −11.2pp | 76% |
| 0.30 | 43.6% | 59.2% | −15.7pp | 23% |
| 0.40 (widest meaningful) | 39.7% | 62.8% | −23.1pp | 8% |

**The signal's confidence is anti-correlated with correctness** — its most extreme (confident) calls are its *worst*. No abstention tuning can rescue that.

## Per-class breakdown (`--class-breakdown`, default weights, OOS, H=10d)

Does the signal predict *down* better than *up* (a hidden asymmetry)? Baseline here is the unconditional base rate over all test days (the no-skill reference):

| Class | Hit-rate | Baseline | Gap | N calls |
|---|---|---|---|---|
| BULL calls | 54.9% | 57.6% | −2.8pp | 6999 |
| BEAR calls | 38.1% | 42.4% | −4.3pp | 6149 |

No asymmetry to exploit — both classes below their baseline. (Note: an earlier version of this diagnostic had a tautology bug — the baseline was the rate *within* the called subset, identical to the hit-rate's numerator/denominator, so it always read +0.0pp. Fixed in commit `20adf12`; the numbers above are real.)

## Verification

The conclusion is not a computation bug. Checked three ways:

1. **Single-stock hand-trace (AAPL).** Pulled real candles, independently recomputed every indicator + composite in Python: composite **0.7220**. Rust tool: **0.722**. Exact match.
2. **Independent end-to-end backtest (AAPL).** Re-implemented the full train/test + label + hit-rate in Python: 55.9% vs 65.6% majority → −9.7pp. Negative conclusion reproduces in independent code.
3. **Look-ahead check.** Signal computed from `candles[..=i]`, label from `candles[i+10]` — no future data leaks into the signal.

One minor imprecision noted (not fixed, negligible impact): the train/test split slices raw candles, so the last ~10 train rows have labels drawn from the test region — ~10 rows of boundary leakage out of ~80,000.

## What this means for the project

- **The put-selling edge (volatility risk premium) is unaffected** — `direction` was a separate research question, never coupled to production scoring.
- **Production integration of any directional signal should not proceed** — per the spec's "one number that matters," none of the attempts cleared the majority-class baseline.
- **The path to real short-term directional edge is a different data class**, not better indicators on price: earnings-surprise/revision data (post-earnings-announcement drift) is the single best-documented short-term directional effect, and is the data gap that would matter if directional timing ever becomes relevant to the put strategy.

The `direction` tool stands as complete, tested (202 unit tests), and verified research infrastructure. It asked a precise question and got a well-validated, honest **no**.

---

## Addendum: Cross-sectional ranking (`--rank`, 2026-07-29)

A *sixth* angle, run after the five above closed the book. It tests a different hypothesis the pooled-accuracy backtest could not reach: **a relative, market-neutral one — does the top decile outperform the bottom decile over a 20-day holding?** Implemented in `src/signal_rank.rs` (212 unit tests). Panel grouped by calendar trading day (~231 names/day, 232 symbols, 84,508 train rows / 61,127 test rows, calendar train/test split). Test: Newey-West HAC t-stat (lag = horizon = 20, Bartlett weights) on the per-day top−bottom equal-weighted decile mean-return spread — robust to the autocorrelation of overlapping 20-day forward returns.

### Result — it does NOT converge on the negative answer (one exception)

| Variant | OOS mean spread | NW t | Sharpe | %>0 days |
|---|---|---|---|---|
| **(a) documented weights** (EMA200=60, ADX=35, RS=5) | **+2.47%** | **+2.25** | +6.61 | 66% |
| (b) recalibrated on ranking objective (MACD=80,…) | +0.67% | +0.78 | +2.08 | 52% |

Variant (a) **clears** the conventional significance bar (NW t = 2.25 > 1.96): the names the documented calibrated weights rank highest beat those they rank lowest by ~2.5% per 20-day holding, on 66% of days. Magnitude sanity-checks against the raw distribution (avg absolute 20d return ≈ 2.06%): top decile ≈ +4%, bottom ≈ +1.5%. Not a unit artifact.

**This contradicts the band-sweep finding (angle 4: confidence anti-correlated with correctness).** Reconciliation: the band-sweep tested *absolute* confidence against a *pooled* sign target in one net-bull regime; ranking tests a *relative* cross-section in which the market level cancels. A signal can rank names by forward return even when its absolute up/down calls are worse than chance — these are genuinely different properties.

### Why the (a)/(b) inversion is the caveat that bounds the finding

The *recalibrated* weights (b) — the weights actually optimized for ranking — collapse to noise (t = 0.78). The documented weights (a), never trained on this objective, do better. Three reasons not to trust (a)'s t=2.25 at face value:

1. **It's the weights that won a pooled-accuracy grid search, then handed to a different objective.** That they "happen" to rank well on an unseen 20d/relative target — while the weights *trained* on that target fail — is the signature of an **in-sample coincidence**, not a robust effect. A truly stable ranking factor would survive its own calibration.
2. **Survivorship is small in this cohort.** A data check (2026-07-29) shows 252 of 254 symbols have full ≥850-row coverage; within-panel dropout (a name missing its t+20 close) is negligible, and only 3 distinct last-bar dates exist. The universe is "current large-caps only," so 2022–2026 delistings (rare in this cohort) are absent — a real but minor bias that, for a long-short spread, if anything *deflates* the measured spread (true losers are crowded out of the bottom decile by survivors). The earlier "inflates the spread" framing was overstated.
3. **Single regime (partially revisited).** The candle store spans 2022-08 → 2026-07. The calendar split happened to land on a regime break (SPY +94% in train, −19% in test), so variant (a)'s spread was earned in a falling market with bull-calibrated weights — a non-trivial piece of regime-independence. Still only two adjacent regimes; no claim of full robustness.

### Verdict (revised)

The "no edge" headline holds *for the question the spec posed* (absolute 5–10 day direction). Cross-sectional ranking opens a **plausible but unconfirmed** door: the documented weights may carry weak 20-day relative ordering that the pooled test masked. The decisive next step, if pursued, is not recalibration on the same data (which demonstrably overfits) but an **independent out-of-sample validation** — fresh symbols or a held-out regime — of the documented weights specifically. Absent that, (a)'s t=2.25 is a hypothesis to confirm, not an edge to deploy.

The deeper conclusion from the calibration degeneracy (unit-test `grid_search_rank_finds_perfect_separator`): **ranking cares only about ordering, not magnitude**, so collinear indicators produce a family of equivalent optima — a fundamental obstacle to weight-fitting for ranking that does not afflict the pooled-accuracy grid search (where magnitude matters for crossing call thresholds).

### Validation (2026-07-29) — Threat 1 resolved: it is NOT noise

The "decide if the edge is real" path ran two cheap, on-data tests before any new-data acquisition (the order matters: if Threat 1 failed, Threat 2 would be moot).

**Threat 1 — is the spread sampling noise? → NO.** Within-day permutation test: each day's realized returns held fixed, signal scores reassigned to returns at random (null = "no cross-sectional ordering"). 10,000 permutations.
- Observed mean spread +2.60%. **p = 0.0001** (a meaningless signal produces a spread this large in ~1 of 10,000 random pairings).
- Sub-period stability (test window split at midpoint): **positive in both halves** — half 1 +3.16% (t=2.32, 70% days), half 2 +2.03% (t=1.12, 59% days). Persists across the window, though noisier/weaker in the later (more-bear) half.

So the cross-sectional ordering is a genuine statistical regularity **within this test window** — not a fluke of 264 days.

**Threat 2 — does it generalize beyond this regime? → STILL OPEN (the only remaining gate).** The permutation test is powerful *because* it's within-day (preserves each day's return structure), but that same property means it cannot detect a regime-level coincidence — a signal that genuinely ranks names in 2025-26 markets but is an artifact of that period would still pass. This is exactly what Threat 2 exists to catch, and exactly why p=0.0001 does not bypass it. The only honest resolution is genuinely new data: a fresh symbol universe (mid-caps, or non-US) or a new time window (older history, or pulled forward past 2026-05). Threat 1 passing is what justifies the effort cost of Threat 2.

**Revised verdict.** For the question the spec posed (absolute 5–10 day direction): still **no edge**. For the cross-sectional ranking question at 20d: the documented weights (EMA200=60, ADX=35, RS=5 — i.e. a trend/momentum regime filter) carry a **real but regime-unconfirmed** relative ordering. It is a hypothesis worth one more test (new data), not an edge to deploy.

### Validation (2026-07-30) — Threat 2 resolved: the edge does NOT generalize

The "decide if the edge is real" path ran its second, decisive test. Threat 1 (noise) had passed, so the cost of Threat 2 (regime-generalization) was justified.

**Approach.** Pulled deeper history (Tiger `kline` caps at **1200 candles** regardless of `limit` — confirmed by probe; 850→1200 extends coverage from 2022-08 back to **2021-10-15**) into a separate OOS db (`/tmp/oos.db`, isolated via `sqlite_file`). Built `--rank-walk` (`signal_rank::run_rank_walk`): evaluates the FROZEN documented weights across contiguous non-overlapping 60-trading-day windows spanning the full history. Weights never retrained per window — a robust factor survives unseen regimes frozen.

**A bug found and fixed mid-run.** The first walk only covered 2023-12 → 2026-06 — the deeper history was in the db but never read, because `get_candles`/`load_spy_closes` cap at the production `CANDLE_COUNT=850`. Added `store::candle::get_all_candles` + `signal::load_spy_closes_full` (full-depth loaders) so the walk reads all available rows. The standard `--rank` path is unchanged.

**Result — the standard test window was a lucky stretch, not a factor.** Walk now covers 2022-08 → 2026-06 (full 2022 bear, 2023 recovery, 2024 bull, 2025-26):

- **Full-history rollup (981 days, all regimes): mean spread +0.23%, NW t = +0.32** — statistical zero.
- **Window signs flip near-randomly** (9/17 positive): +1.40, −1.23, −0.24, +0.59, +1.22, −1.98, +2.89, −0.72, −1.69, +1.36, −0.88, −0.74, +1.32, +1.56, +1.33, +0.98, −2.90 (NW t per 60d window). No regime pattern: it failed in both the 2022 bear *and* parts of the 2024 bull.
- The four strong positives (windows 13–16) **are the 2025-06 → 2026-03 stretch** — exactly the period the standard test split landed on. The +2.6% / p=0.0001 measured there was real *within those 264 days* but not generalizable.

**Final verdict (cross-sectional ranking).** Variant (a) has **no deployable cross-sectional edge.** The documented weights are a regime-coincidental ranking signal, not a robust factor. Threat 1's p=0.0001 correctly said "not noise within the window" but could not say "generalizes" — and it does not. This is precisely what Threat 2 was built to catch, and it caught it.

**Reconciliation with the original five angles.** Cross-sectional ranking was the *one* angle that initially diverged from the "no edge" conclusion. The walk-forward test brings it back into convergence: price-TA indicators — whether tested for absolute direction (pooled accuracy) or relative ordering (cross-sectional rank) — have **no robust short-horizon edge on US large-caps**. The original headline stands.

---

## Addendum: trend-conditioning for put-selling (2026-07-30)

A separate, *actionable* question from the ranking work: does conditioning put-selling on the same trend construct help the **put outcomes** (assignment, return, P&L)? This is a different question from ranking — it asks whether trend identifies *names safer to sell puts on*, not whether it predicts stock direction. Tested against the put-simulation data (`data/calibration.csv`, 1.2M rows, 2023-05 → 2026-06).

### Aggregate result — looks like a free lunch

| trend_long bucket | n | assign% | avg ror | avg net_pnl |
|---|---|---|---|---|
| **≥ 1.08 (strong up)** | 105k | 8.4% | 64.3% | **5.11** |
| 1.02–1.08 (up) | 71k | 10.8% | 48.4% | 2.99 |
| < 1.02 (flat/down) | 77k | 9.7% | 54.4% | 3.21 |

Strong-up wins on all four axes in aggregate. 223 distinct symbols pass through it (~42% of tradeable rows).

### Walk-forward (within 2023-2026) — the free lunch has a tail

Quarterly avg_pnl by bucket (would_pass_prefilter=true). Strong-up is best in **7 of 13 quarters**, but worst in 3 — most damningly **2025-Q1: strong-up −4.31** (all buckets bled; strong-up bled most). In 2025-Q2/Q3, counterintuitively, *flat-down* won.

The aggregate +5.11 was driven by a few huge quarters (2024-Q1, 2026-Q1/Q2) that masked the bad ones.

### Verdict — not a deployable filter; a regime-dependent tilt

- **NOT a "filter to strong-up only" signal** — that rule would have produced a −4.31 quarter and an unknown-but-likely-worse outcome in a true broad bear (which the data does not cover — the sim window is entirely post-2022-bottom bull).
- **It IS a regime-dependent risk amplifier.** Trend-conditioning helps in calm/momentum markets and hurts in reversals. Using it requires knowing the regime — which is the hard problem the direction signal cannot solve.
- **Survives the cheap test only partially** — not killed outright (genuinely best most quarters), but not the robust edge the aggregate implied. The within-window test can kill but cannot confirm regime-robustness; the regime gap (no 2022-bear put-outcome data) leaves Threat 2 permanently open for this question.

### Decision — not wired into production (2026-07-30)

**Nothing from this analysis is integrated.** The reasoning: a signal that produces a −4.31 quarter when followed as a rule is dangerous to ship in *any* form — even annotation. Surfacing a trend tier in the Telegram caption would implicitly endorse it as actionable, which it is not. The risk is that "🟢 strong-up" reads as a green light precisely in the momentum regimes where the names are most vulnerable to reversal.

Concretely:
- **No trend-tier annotation** added to option publishing. `PUT_SCORE_WEIGHT_TREND` stays 0.0 (the prior sweep's finding that trend hurts *scoring* holds).
- **The finding lives here, as analysis only** — for the user's awareness that trend-conditioning is regime-dependent, not a free lunch.
- **The direction-signal research infrastructure** (`signal_rank`, permutation test, walk-forward) is kept as a tested, reusable validation harness for future signal research — its negative results (no deployable cross-sectional ranking edge) are the documented reason price-TA direction work is closed out.
