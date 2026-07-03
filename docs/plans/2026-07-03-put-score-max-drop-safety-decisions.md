# Decisions: Put-score safety from the max_drop band

## Problem

`calculate_put_score` (`src/model.rs`) ranks put options by a composite of Sharpe, safety, and return. Today:

- **Safety** = `1 − strike_percentile`, where `strike_percentile` is the strike's position within the **20-day price range** (`collect_price_ranges` → `PutPriceRange`). This measures where price has *traded*, not how likely the strike is to be *assigned*.
- **Danger filtering** rejects `rate_of_return > MAX_RATE_OF_RETURN (0.80)`. But `rate_of_return` is annualized premium/strike — a forward-looking, market-implied risk premium. It conflates "the market is scared" (good, when history disagrees — that is the edge) with "this strike will actually be assigned" (the real danger). The hard cap discards the best trades: high-premium deep strikes that are statistically safe.

Meanwhile the strike *range* `[strike_from, strike_to]` is already derived from `max_drop` stats (`ema_drop` = typical drop, `percentile_drop` = 90th-pct stress drop), scaled by DTE/period (`calculate_adjusted_strike_range`). So `max_drop` already gates danger at the **filter** level — but the **score** ignores it and uses the weaker 20-day percentile. The score and the filter disagree about what "safe" means.

**Goal:** make the score's safety dimension consistent with the filter — measure safety as the strike's position within the `max_drop` band — and stop using `rate_of_return` as a danger cutoff (keep it as reward).

## Approaches considered

- **A — Replace safety with max_drop-band position; drop the hard `rate_of_return` danger cap; keep return as soft-capped reward.** Score = Sharpe + (position in max_drop band) + return. Danger comes from max_drop position; return is pure reward.
- **B — Drop `rate_of_return` entirely.** Score by max_drop safety + Sharpe only. Loses all forward-looking premium info.
- **C — Minimal rewire.** Only swap the safety term to max_drop; leave the `> 0.80` cap and everything else. Keeps the weak danger cutoff.

**Chosen: A.** `rate_of_return` is a fine *reward* but a poor *danger* signal; `max_drop` is the direct, stock-specific breach probability and is already computed. Keeping return as reward preserves the economics; removing the hard cap stops discarding statistically-safe high-premium strikes.

## Decisions (ADR-style)

### Safety dimension = position within the max_drop band, not the 20-day price range

The score's safety term is redefined from `1 − strike_percentile_20d` to **position within the max_drop band** `[strike_from, strike_to]` (deep = safe = high score; shallow = risky = low score). This makes the score consistent with the range filter that selected the strike, and measures the thing we actually care about: assignment probability. The 20-day `strike_percentile` is retired from the score but kept as a CSV diagnostic column (it's free context). The band is already stored per-chain (`strike_from` / `strike_to`), so **no new DB plumbing** is required for the scoring change.

### rate_of_return becomes reward-only; remove the hard danger cap

Drop the `rate_of_return > MAX_RATE_OF_RETURN` pre-filter reject. Keep `return_norm = min(rate_of_return / IDEAL_RETURN, 1)` (soft cap). Danger is now expressed entirely through max_drop position. Pathological quotes are already handled by the liquidity/spread filters in `filter_option_chains`.

### Percentile: validate 0.97 for range width before decoupling

Using the 90th percentile for `percentile_drop` yields narrow strike bands for calm/low-vol stocks — band width = `price × (percentile_drop − ema_drop) × adj` collapses when the drop distribution is tight, leaving few or zero candidate strikes. This is a **range-coverage** problem and is **scoring-agnostic** (band width is a filter property; it is identical under the current or the new scoring). It is validated by **Experiment 1** (below). If 0.97 eases narrowness acceptably, the *scoring cap* should later be **decoupled** from the *range* percentile (range = wide/inclusive ~0.97; scoring cap = robust ~0.90), so the two jobs stop sharing one knob. Literal 100th/max is rejected for the range (outlier-driven, surfaces zero-liquidity deep strikes).

## Open parameters (tunable, not ADR-worthy)

- **Safety term shape:** default to linear position within `[strike_from, strike_to]`; revisit if deep strikes need a steeper reward.
- **Weights:** start from the current 0.40 safety / 0.40 return / 0.20 Sharpe; re-tune after the percentile validation.
- **Range percentile exact value** (0.97 candidate) and whether/when to decouple range vs scoring-cap percentiles.

## Module outline (handoff to the next skill)

- `src/constants.rs` — bump `PERCENTILE` 0.9 → 0.97 for the validation run (single constant; reversible).
- `src/model.rs` `calculate_put_score` — replace the `strike_percentile`-based `safety_norm` with a max_drop-band-position input; remove the `rate_of_return > MAX_RATE_OF_RETURN` reject branch. Signature gains a safety input computed by the caller from `chain.strike` / `strike_from` / `strike_to`; stays a pure scalar function for testability. Update the unit tests in `mod tests`.
- `src/option.rs` `option_chain_to_csv_vec` — compute the band position from the per-chain `strike_from` / `strike_to` and pass it into `calculate_put_score`. Keep `strike_percentile` in the CSV output as a diagnostic.
- **Experiment 1 harness (transient, range coverage):** over `data/data.db`, compute `percentile_drop` / `ema_drop` at 0.9 vs 0.97 via `compute_max_drop_stats_with_percentile`, report per-symbol band-width ratio and how many symbols cross a "usable band" threshold. Geometry only (no new-strike counts without a live API re-query).
- **Experiment 2 harness (transient, ranking quality):** over cached `option_strike` rows, implement **both** the current and new scoring formulas inline and re-rank the same chains; diff top-3 picks and score distributions. Production `calculate_put_score` stays untouched until the new design is validated. Both harnesses are removed after the decisions land.

## Experiments to run (both offline, against `data/data.db`)

These answer two independent questions and must not be conflated. Experiment 1 varies the **percentile** (range coverage); Experiment 2 varies the **scoring design** (ranking quality).

### Experiment 1 — Percentile A/B (range coverage, scoring-agnostic)

For each symbol (cached daily candles, periods 5 and 20, price = latest close):
1. `percentile_drop` and `ema_drop` at PERCENTILE = 0.9 and 0.97 (`compute_max_drop_stats_with_percentile`).
2. Band width = `price × (percentile_drop − ema_drop) × (dte / period)` at each percentile.
3. Ratio `width(0.97) / width(0.9)` — median and distribution.
4. Count of symbols whose band is "too narrow" (e.g. width < 1% of price) at 0.9 vs 0.97 — the headline number for whether 0.97 fixes narrowness.

**Limitation:** offline we cannot count *actual* new strikes — cached `option_strike` rows already sit inside the 0.9 band. True strike-count deltas need a live API re-query at 0.97.

### Experiment 2 — Scoring A/B (ranking quality, new design vs current)

**No refactoring required to run this** — scoring is a pure function of scalars, so the two designs coexist as two functions in a throwaway `#[cfg(test)]` harness (run via `cargo test`). The refactoring of production `calculate_put_score` is the *outcome* of this experiment, not a prerequisite.

Over cached `option_strike` rows (each carries `strike`, `rate_of_return`, `strike_from`, `strike_to`; `sharpe_ratio` from the `sharpe_ratio` table, 20-day range from candles), re-rank the same chains under:
- **Current arm:** call the real production `calculate_put_score` directly (zero drift). `safety = 1 − strike_percentile_20d`, hard reject `rate_of_return > 0.80`, weights 0.40 / 0.40 / 0.20.
- **New arm:** a candidate `score_new(...)` defined inline in the harness. `safety = position in [strike_from, strike_to]` (deep end = 1.0, shallow end = 0.0), no hard return cap, same weights.

**Isolation:** both arms use the **cached** `strike_from` / `strike_to` (computed at 0.9). This holds the strike *range* constant so Exp 2 measures only the *scoring* effect, not the percentile effect (that's Exp 1).

Report, per period (5 and 20):
1. Top-3 picks under each, and the diff (added / removed / reordered).
2. Score distributions (quartiles) under each.
3. How many chains the new design **keeps** that the current hard cap rejected — the high-return-on-deep-strike trades this redesign is meant to recover.

The current arm calls the real production `calculate_put_score` (source of truth, zero drift); the new arm is harness-only. Production `calculate_put_score` is changed only once `score_new` wins — at which point the refactor is a straight copy of the validated harness formula.
