# Market Regime-Aware Trend Filtering — Design

**Date:** 2026-05-16
**Status:** Draft

## Problem

The trend filter uses a fixed `TREND_FILTER_THRESHOLD = 0.98`. During broad market pullbacks, most stocks fall below their EMAs and get blocked — producing zero top picks. But selling puts in bear markets can work well: IV is elevated (fatter premiums), and you can sell at deeper OTM strikes with more cushion.

## Solution

Use SPY's position relative to its own EMA50 to continuously adjust the trend filter threshold and scoring weights. No regime enum, no hard steps — just one smooth formula.

## SPY Bearness

Fetch SPY's 50 daily candles via Tiger API (`query_stock_quotes`), compute SPY's `trend_ratio_long = price / EMA50`, then derive bearness:

```
bearness = clamp(1.0 - spy_trend_long, 0.0, 0.08) / 0.08
```

| SPY trend_long | bearness | Meaning |
|---|---|---|
| ≥ 1.00 | 0.0 | Bull — no adjustment |
| 0.98 | 0.25 | Mild pullback |
| 0.96 | 0.50 | Correction |
| 0.94 | 0.75 | Deep correction |
| ≤ 0.92 | 1.0 | Bear — max adjustment |

## What adjusts

### Trend filter threshold

```
trend_threshold = 0.98 - 0.06 × bearness
```

| bearness | threshold | Effect |
|---|---|---|
| 0.0 | 0.98 | Current behavior — strict |
| 0.5 | 0.95 | Mild loosening |
| 1.0 | 0.92 | Very loose — only freefalling stocks blocked |

### Scoring weights

```
weight_safety = 0.30 + 0.15 × bearness    → 30% to 45%
weight_trend  = 0.30 - 0.15 × bearness    → 30% to 15%
weight_sharpe = 0.20                       → stays 20%
weight_return = 0.20                       → stays 20%
```

As bearness rises, we care less about trend (everyone's trending down) and more about strike safety (cushion matters more).

### trend_norm normalization

The trend score calculation needs to use the same threshold it's filtering on:

```
trend_norm = ((trend_ratio_short - trend_threshold) / 0.10).clamp(0.0, 1.0)
```

This already exists but currently uses the fixed constant. It just needs to use the computed threshold instead.

### Telegram flag (cosmetic only)

Does not affect scoring — purely for display:

```
bearness = 0       → no flag
bearness 0.01–0.50 → ⚠️ Correction
bearness > 0.50    → 🐻 Bear market
```

## What does NOT change

- **Trend tightening** (`calculate_trend_factor`) — stays as-is (multiplier 4.0, cap 0.25). Revisit later.
- **Strike range** (`calculate_adjusted_strike_range`) — no changes.
- **max_strike_percentile** — stays at 0.60 across all regimes. Max_drop + trend_factor already handle range calibration.
- **Other pre-filters** — rate_of_return [0.25, 0.65], sharpe > 0 — unchanged.

## Architecture changes

### New: `src/regime.rs`

```rust
/// SPY-based market regime metrics, computed once per pipeline run.
pub struct MarketRegime {
    pub bearness: f64,              // 0.0 (bull) to 1.0 (bear)
    pub trend_threshold: f64,       // 0.98 to 0.92
    pub weight_safety: f64,         // 0.30 to 0.45
    pub weight_trend: f64,          // 0.30 to 0.15
    pub weight_sharpe: f64,         // 0.20 (constant)
    pub weight_return: f64,         // 0.20 (constant)
    pub flag: &'static str,         // "", "⚠️ Correction", "🐻 Bear market"
}

impl MarketRegime {
    pub fn from_spy_trend(spy_trend_long: f64) -> Self { ... }
}
```

### Modified: `src/model.rs`

- `calculate_put_score` takes `&MarketRegime` instead of using fixed constants
- `trend_norm` uses `regime.trend_threshold` instead of `TREND_FILTER_THRESHOLD`
- Score uses `regime.weight_*` instead of hardcoded weights
- Pre-filter uses `regime.trend_threshold` instead of `TREND_FILTER_THRESHOLD`

### Modified: `src/trend.rs` or new function

- `calculate_spy_trend(requester: &mut Requester) -> f64` — fetches SPY's 50 candles, returns `trend_ratio_long`

### Modified: `src/option.rs`

- `retrieve_option_chains_with_expiry` — compute regime after trend data, pass to scoring
- `option_chain_to_csv_vec` — takes `&MarketRegime` param
- `publish_to_telegram` — takes `&MarketRegime`, adds flag to caption
- `format_telegram_caption` — prepend regime flag

### Modified: `src/main.rs`

- `PerformAll` — compute regime before option chains, pass through
- `calculate-trend` — also computes regime (or separate step)

### Modified: `src/constants.rs`

- `TREND_FILTER_THRESHOLD` (0.98) becomes `TREND_THRESHOLD_BULL` (0.98)
- `TREND_THRESHOLD_RANGE` (0.06) — how far the threshold can drop
- `BEARNESS_MAX` (0.08) — SPY drop that maps to bearness = 1.0
- Remove: `TREND_FILTER_THRESHOLD` (replaced by runtime computation)
- Keep: `TREND_TIGHTEN_MULTIPLIER`, `TREND_TIGHTEN_CAP` (unchanged)

## Data flow (PerformAll)

```
pull_and_save (quotes for all symbols)
  ↓
calculate max_drop, sharpe, price_percentile, trend  (for all symbols)
  ↓
calculate_spy_trend  (NEW — fetch SPY candles via Tiger, compute EMA50 ratio)
  ↓
MarketRegime::from_spy_trend(spy_trend_long)  (NEW — compute bearness + weights)
  ↓
retrieve_option_chains_with_expiry  (pass regime through)
  ↓
  for each symbol:
    trend_factor = calculate_trend_factor(stock's own trend)  (unchanged)
    strike range = calculate_adjusted_strike_range(..., trend_factor)  (unchanged)
  ↓
  calculate_put_score(..., regime)  (adjusted threshold + weights)
  ↓
option_chain_to_csv_vec(..., regime)  (adjusted scoring)
  ↓
format_telegram_caption(..., regime)  (adds ⚠️ or 🐻 flag)
  ↓
publish_to_telegram  (send CSV + caption)
```

## Testing

- `MarketRegime::from_spy_trend` — test at key SPY values (1.04, 1.00, 0.96, 0.92, 0.85)
- `calculate_put_score` with different regimes — verify threshold + weight adjustments
- Verify weights always sum to 1.0 for any bearness value
- `option_chain_to_csv_vec` — verify scoring uses regime weights
- Telegram caption — verify flag appears at correct bearness levels
- Existing tests — update to pass `MarketRegime::from_spy_trend(1.05)` (bull, no adjustment)

## Open questions

- Should `calculate-trend` CLI command also compute and store SPY's regime, or is it only computed at pipeline runtime?
- The SPY candle fetch adds one extra Tiger API call per pipeline run. Is that acceptable?
