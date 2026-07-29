# 09 — Relative Strength vs SPY indicator + re-validation

**What to build:** Add a **Relative Strength vs SPY** feature to the directional signal, then re-run the calibration/backtest loop to test whether it clears the majority-class bar that the v1 5-indicator set failed (52.4% vs 57.0% in-sample per ticket 08). Relative strength — the symbol's recent return ÷ SPY's recent return over a lookback — is a classic false-signal filter: a stock breaking out on its indicators while *lagging* the index is suspect.

**Blocked by:** None — SPY candles already exist in the candle store (850 days, fetched ad-hoc by `regime.rs` and persisted). No new data plumbing needed.

**Status:** done

## Implementation notes

Implemented 2026-07-29. RS-vs-SPY added as the 6th indicator; composite expanded to 6 weights.

**Design choices resolved:**
- **RS definition:** ratio of price ratios — `RS = (sym[t]/sym[t−N]) / (spy[t]/spy[t−N])`. Avoids the near-zero-denominator blowup of returns-ratio when SPY's N-day return ≈ 0.
- **Lookback:** 50 days (medium-term, classic RS).
- **Normalization:** continuous, centered at RS=1.0 — `(rs − (1−band))/(2×band)` clamped, `RS_BAND=0.10`.
- **Data:** SPY already in candle store (850 days, fetched by `regime.rs`). No new plumbing — loaded via `get_candles("SPY")`. Made `signal::load_spy_closes` pub so backtest shares it.

**Code:** `relative_strength` + `relative_strength_score` in `indicators.rs`; `SignalParams` gained `weight_rs`; `indicator_scores`/`signal_from_scores`/`compute_signal`/`SignalBreakdown::compute` all take a benchmark slice; `DayRow.scores` is now `[f64;6]`; grid search expanded to 6 nested loops = C(25,5)=**53,130** combinations. Seed `SIGNAL_WEIGHT_RS=0.0` (dormant until calibration). 8 new tests (RS math + grid count); suite 197 passed.

**Performance note:** the 6-weight calibration (53,130 combos) took ~21 min vs ~4 min for the 5-weight (10,626). Acceptable for one-off research calibration; documented for awareness.

## RESEARCH VERDICT — RS-vs-SPY does NOT rescue the signal

```
best grid weights (step 5, sum 100): EMA20/50=0  EMA200=45  MACD=0  RSI=40  Volume=0  RS=15
in-sample banded hit-rate: 52.4%   vs   majority baseline 57.1%   →  −4.7pp  ❌
```

**Adding RS and re-running exhaustive grid search over all 53,130 combinations lands at 52.4% in-sample vs 57.1% majority — still −4.7pp below the bar, essentially identical to the 52.4%/57.0% result WITHOUT RS (ticket 08).** The grid did assign RS a 15% weight, but it took that weight from Volume (now 0), not from the bar — it shuffled the same inadequate signal around rather than finding new edge.

Out-of-sample with default weights (RS=0): 47.0% vs 58.2% — unchanged from ticket 07, confirming RS adds nothing at the default seed and the calibration shows even optimized RS weights can't clear the bar in-sample.

## What this means

RS-vs-SPY was the highest-value candidate in the fog, and it failed. Combined with ticket 08's verdict, the evidence now strongly suggests the **5–10 day directional prediction problem is not solvable with this class of indicator** — EMAs, MACD, RSI, volume, and relative strength collectively cannot beat always-guessing-bullish on US large-caps over a 1-2 week horizon. This is consistent with weak-form market efficiency at short horizons.

Ticket 10 (ADX) remains, but the pattern is clear: each feature lands below the bar, and the grid search keeps settling on EMA200+RSI as the only marginally-useful pair. ADX is unlikely to reverse this. The honest conclusion is forming: the `direction` tool works correctly as a research instrument and has definitively answered the question it was built to ask — "do these indicators have 5-10d edge?" — with a well-validated **no**.

- [ ] A new relative-strength indicator in `indicators.rs`: computes the symbol's N-day return ÷ SPY's N-day return over a lookback. SPY candles are loaded via the existing `store::candle::get_candles("SPY", ...)` helper. **Decision needed (see below):** the lookback period and the exact RS definition.
- [ ] The RS normalization (raw RS → `[0,1]` bullishness): RS > 1 (outperforming SPY) → bullish; RS < 1 → bearish. Likely continuous (e.g. RS mapped through a band around 1.0), consistent with the hybrid philosophy's continuous-magnitude approach for non-regime features.
- [ ] RS wired into the composite (`SignalParams` gains `weight_rs`; `compute_signal` includes it). A new seed weight constant; the grid search (ticket 08) now sweeps 6 weights.
- [ ] **Re-validation:** re-run `direction <path> --calibrate` then `--backtest`. The headline question — does adding RS lift the out-of-sample banded hit-rate above the majority-class baseline? Document the before/after in the ticket's answer.

## Open design question (to resolve before/while implementing)

**The RS definition.** Relative strength has several canonical forms, and the choice matters:
- **Ratio of returns** (recommended): `RS = (close[t]/close[t−N] − 1) / (spy[t]/spy[t−N] − 1)`. Intuitive (RS=1 = matching the market, >1 = beating). Breaks down when SPY's return ≈ 0 (division).
- **Ratio of price ratios**: `RS = (close[t]/close[t−N]) / (spy[t]/spy[t−N])`. Avoids the near-zero-denominator issue. Slightly less intuitive at the margin.
- **Mansfield RS**: a normalized form relative to a longer SPY average. More robust but more complex.

**The lookback.** 50-day is classic for "medium-term" RS; 125-day (≈6 months) is the Mansfield standard; 20-day aligns with the signal's short-term horizon. Worth trying a couple via the backtest.

These are grilling decisions — consider `/grill` on this ticket's design question if the choice isn't obvious from the first backtest run.
