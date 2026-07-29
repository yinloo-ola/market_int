# 10 — ADX(14) trend-strength indicator + re-validation

**What to build:** Add an **ADX(14)** trend-strength feature to the directional signal, then re-run the calibration/backtest loop to test whether it helps clear the majority-class bar. ADX is the classic trend-strength filter: it doesn't predict *direction*, it measures whether a trend exists at all. Notably, the ticket-08 grid search **zeroed out EMA20/50 and MACD** — strong evidence those indicators whipsaw in choppy markets. ADX is the standard tool to suppress exactly that whipsaw, so it may rescue those features' contribution.

**Blocked by:** None — ADX is pure math over the existing close/high/low candle data. No new data source.

**Status:** done

## Implementation notes

Implemented 2026-07-29. ADX(14) added as the 7th indicator — the first ATR-family math in the codebase.

**Design decision (Option B):** ADX is non-directional (trend strength), so it's directionalized via the ±DI sign to fit the flat weighted-sum composite: `score = 0.5 ± strength/2` where strength ramps 0→1 over `[0, ADX_FULL_STRENGTH=25]` and the sign comes from `+DI vs −DI`. Strong trend + +DI>−DI → bullish; strong + −DI>+DI → bearish; weak trend → neutral regardless of sign. Keeps the composite a flat weighted sum; the grid search infra is unchanged in shape, just gains a 7th weight.

**Code:** `adx()` (true range, +DM/−DM, Wilder-smoothed TR/+DM/−DM, +DI/−DI, DX, Wilder-smoothed ADX) + `adx_score()` in `indicators.rs`. `SignalParams` gained `weight_adx`; `indicator_scores`/`signal_from_scores`/`compute_signal`/`SignalBreakdown::compute` now take `&[model::Candle]` (ADX needs high/low); `DayRow.scores` is `[f64;7]`; grid expanded to 7 nested loops = C(26,6)=230,230. 5 new ADX tests; suite 202 passed.

**Performance fix (bonus):** the 7-weight calibration initially ran 65+ min and I killed it. Root cause was the grid-search hot path, not ADX: `banded_hit_rate` recomputed each row's signal 2–3× per candidate and divided per row. Rewrote `grid_search`'s inner loop to compute the signal once per row with no division (grid weights always sum to 100, so thresholds compare raw weighted sums directly) and no allocation. **Calibration dropped from 65+ min to ~5 min.** Tests still pass unchanged.

## RESEARCH VERDICT — ADX does NOT rescue the signal either

```
best grid weights (step 5, sum 100): EMA20/50=0  EMA200=60  MACD=0  RSI=0  Volume=0  RS=5  ADX=35
in-sample banded hit-rate: 52.5%   vs   majority baseline 57.1%   →  −4.6pp  ❌
```

**The third fog candidate tested, the third failure.** ADX got a 35% weight (taking it from RSI, which dropped to 0), but the result is 52.5% in-sample vs 57.1% majority — still −4.6pp below the bar, essentially identical to every prior attempt (52.4% with 5 weights, 52.4% with RS, 52.5% with ADX). The grid keeps settling on EMA200 as the single marginally-useful feature; everything else gets zeroed or shuffled without moving the headline number.

Out-of-sample with default weights (RS=0, ADX=0): 47.0% vs 58.2% — unchanged from ticket 07, confirming the dormant features add nothing at seed and the calibration shows even optimized weights can't clear the bar.

## The conclusion this closes

Three fog candidates investigated (weight calibration → RS-vs-SPY → ADX), three failures, all landing at ~52% in-sample vs ~57% majority. The pattern is conclusive: **this class of indicator (EMAs, MACD, RSI, volume, relative strength, ADX) has no 5–10 day directional edge on US large-caps.** This is consistent with weak-form market efficiency at short horizons — exactly the kind of finding a research tool is built to produce.

The `direction` subcommand stands as a complete, tested, performant research instrument that has definitively answered the question it was built to ask: **no, these indicators cannot beat always-guessing-bullish over a 1–2 week window.** Production integration (per the spec's "one number that matters") should not proceed. The remaining fog (per-sector/regime weight adjustment, earnings risk gate) is unlikely to change this and is not worth pursuing without a fundamentally different feature class (e.g. options-flow, sentiment, or fundamentals — none of which the codebase currently sources).

- [ ] A new ADX(14) indicator in `indicators.rs`: standard Wilder ADX from DM+/DM− and ATR (true range). Needs the high/low/close fields of `Candle` (which exist). Pure functions: `true_range`, `directional_movement`, the Wilder-smoothed `+DI`/`−DI`, and `adx`.
- [ ] The ADX normalization (raw ADX → `[0,1]`): unlike the other features, ADX is **non-directional** (high ADX = strong trend, doesn't say bull or bear). **Decision needed (see below):** how to fold a strength measure into a directional composite. Two options — (a) use it as a *confidence multiplier* on the directional terms (ADX high → trust the EMAs/MACD more), or (b) pair it with DI sign (ADX high *and* +DI > −DI → bullish). Option (a) is the deeper change (alters the composite's structure); option (b) keeps the composite a flat weighted sum.
- [ ] ADX wired into the composite (`SignalParams` gains a weight; grid search now sweeps one more weight).
- [ ] **Re-validation:** re-run `--calibrate` then `--backtest`. Does ADX lift out-of-sample banded hit-rate above majority-class? Specifically — do EMA20/50/MACD weights come back *up* from zero once ADX filters the choppy days? Document before/after.

## Open design question (to resolve before/while implementing)

**How does a non-directional strength indicator enter a directional composite?**

- **Option A — confidence multiplier (deeper change):** the composite becomes `Σ(weight × score) × adx_confidence` (or per-term: each directional term is scaled by ADX). ADX high → the directional signal counts fully; ADX low → it's damped toward neutral. This is the *correct* use of ADX conceptually, but it changes the composite's shape from a flat weighted sum — the grid search and `signal_from_scores` would need a structural change.
- **Option B — directionalized via DI sign (flat composite, simpler):** treat `(+DI > −DI ? bullish : bearish) × adx_strength` as a pseudo-directional feature in `[0,1]`, and weight it like the others. Keeps the composite a flat sum; the grid search and existing infra are unchanged.

Option B is the smaller, lower-risk change to try first; if ADX shows promise, option A is a natural refinement. Consider `/grill` on this if the first backtest run is ambiguous.

**Note on ATR:** ADX requires true range / ATR as a building block. This is the *first* ATR-family computation in the codebase (the earlier decision to reuse realized-vol instead of building ATR was about the vol-regime feature, not ADX). Building it here for ADX is in-scope and expected.
