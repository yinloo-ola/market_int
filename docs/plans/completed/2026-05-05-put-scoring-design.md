# Put Option Scoring System

## Goal

Two changes to the CSV output from `PerformAll`:

1. **Strike percentile** — replace the current stock price percentile with the percentile of the *strike price* within the 20-day candle range, so each row answers "has the stock traded at this strike level recently?"
2. **Composite score [0–1]** — rank every put option by a combination of Sharpe ratio, strike percentile, and rate of return, weighted toward capital preservation (not getting assigned).

## 1. Strike Percentile

**Current behavior**: `price_percentile` = `(current_close - min_20d) / (max_20d - min_20d)` — one value per symbol.

**New behavior**: For each `OptionStrikeCandle`, compute the same formula but using `chain.strike` instead of `current_close`:

```
strike_percentile = (strike - min_20d) / (max_20d - min_20d)
```

This produces a value per row (per strike), not per symbol. Lower = strike is deeper in recent lows = safer.

**Implementation**: In `option_chain_to_csv_vec`, pass in the 20-day candle data (or just min/max per symbol) so the percentile can be computed per strike. The existing `price_percentile` module and DB table remain unchanged — we just compute a derived value at CSV time.

**New CSV column**: rename `price_percentile` → `strike_percentile`.

## 2. Composite Score

### Pre-filters (remove non-starters before scoring)

| Filter | Rationale |
|--------|-----------|
| `rate_of_return >= 0.25` | Below 25% isn't worth the capital commitment |
| `rate_of_return <= 0.60` | Above 60% means the market prices in real crash risk |
| `sharpe > 0` | Don't sell puts on downward-trending stocks |
| `strike_percentile <= 0.40` | Strike must be in the lower 40% of recent range |

### Scoring formula

```
sharpe_norm    = clamp(sharpe / 2.0, 0, 1)
safety_norm    = 1.0 - strike_percentile
return_norm    = clamp(1.0 - |return - 0.35| / 0.20, 0, 1)

score = 0.30 * sharpe_norm + 0.40 * safety_norm + 0.30 * return_norm
```

| Component | Weight | Why |
|-----------|--------|-----|
| `safety_norm` | 40% | Most direct measure of "how far is this strike from current price." Primary defense against assignment. |
| `sharpe_norm` | 30% | High Sharpe = stock trending up reliably, second line of defense. Capped at 2.0 (anything above is excellent). |
| `return_norm` | 30% | Bell-curved around 35% target. Rewards adequate income without chasing dangerous yields. |

### New CSV column

`score` — appended as the last column, formatted to 3 decimal places.

## Architecture

### Data flow

```
candles (20-day, per symbol) ──→ min/max per symbol
                                        │
                                        ▼
OptionStrikeCandle.strike ──→ strike_percentile = (strike - min) / (max - min)
                                        │
                                        ▼
sharpe (per symbol) + strike_percentile + rate_of_return ──→ pre-filter ──→ score
                                        │
                                        ▼
                              CSV with strike_percentile + score columns
```

### Changes needed

| File | Change |
|------|--------|
| `model.rs` | New helper: `calculate_strike_percentile(strike, min, max) → f64`. New helper: `calculate_put_score(sharpe, strike_percentile, rate_of_return) → Option<f64>` (None if filtered out). Update `option_chain_to_csv_vec` signature to accept 20-day min/max per symbol. Add `strike_percentile` and `score` columns. |
| `option.rs` | In `retrieve_option_chains_with_expiry` and `publish_option_chains`: fetch 20-day candles per symbol, compute min/max, pass to CSV function. |
| `store/candle.rs` | Already has `get_candles(conn, symbol, 20)` — no change needed. |

### Error handling

- If 20-day candle data is missing for a symbol, `strike_percentile` = `None` → row excluded from scoring, still appears in CSV with empty score.
- Pre-filtered rows (score = None) still appear in CSV but with an empty `score` cell, so nothing is hidden.

### Testing

- Unit test `calculate_strike_percentile` — edge cases: strike at min (0.0), at max (1.0), above max (>1.0), below min (<0.0), min == max.
- Unit test `calculate_put_score` — verify known inputs produce expected scores, verify pre-filter cutoffs (sharpe ≤ 0 returns None, return < 0.25 or > 0.60 returns None, percentile > 0.40 returns None).
- Integration: run with sample data, verify CSV has both new columns and scores look reasonable.
