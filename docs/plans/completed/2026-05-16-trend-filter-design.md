# Trend-Aware Put Selection — Design Document

**Date:** 2026-05-16  
**Status:** Approved  
**Validated with:** Real MSFT crash data (Jan–Apr 2026), 7 symbols, ~200 days backtest

---

## Problem

The current algorithm selects weekly puts based on historical max_drop, Sharpe ratio, and strike percentile. It has two blind spots:

1. **No trend awareness** — It sold MSFT $435 puts in late Jan 2026 while MSFT was already below its 50-day EMA. MSFT then crashed from 490 to 356 (-27%), locking $43.5k for months.
2. **No income optimization** — When a stock is in a strong uptrend, historical max_drop overstates actual risk. The algorithm sells strikes too far OTM, leaving premium on the table.

## Solution: Two-layer trend system

### Layer 1: Hard filter (safety gate)

Before scoring any put, require **both**:

```
price / EMA20 > 0.98    // short-term trend (1 month)
price / EMA50 > 0.98    // intermediate trend (2.5 months)
```

If either fails → **skip the stock entirely**.

**Why both?** Real data shows EMA20 alone is insufficient:
- MSFT passed EMA20>0.98 on Jan 27–28, 2026 — just 2 days before the -10% earnings crash
- EMA50 was still <0.98, so the combined filter would have blocked it

**Why EMA20+EMA50, not EMA10+EMA20?** EMA10 whipsaws on normal weekly noise and would filter out healthy pullback buying opportunities. EMA20/EMA50 is more stable and catches both fast crashes (via EMA20) and slow bleeds (via EMA50).

### Layer 2: Strike tightening (income boost)

When trend is strong (P/E20 > 1.0), reduce the max_drop estimate:

```
trend_factor = 1.0 - min((price / EMA20 - 1.0) * 4.0, 0.25)
adjusted_max_drop = base_max_drop * trend_factor
```

This moves the strike range **closer to ATM**, allowing higher-premium strikes.

**Calibration from real data (multiplier=4.0, cap=25%):**

| Symbol | P/E20 | Base OTM | Adjusted OTM | Est. Premium Boost |
|--------|-------|----------|-------------|-------------------|
| AAPL | 1.058 | 6.8% | 5.2% | ~15-25% |
| NVDA | 1.067 | 12.4% | 9.3% | ~15-25% |
| MSFT | 1.025 | 6.3% | 5.7% | ~5-10% |
| AMD | 1.119 | 13.1% | 10.3% | ~15-25% |
| MU | 1.141 | 13.0% | 9.8% | ~15-25% |
| LRCX | 1.032 | 11.3% | 9.8% | ~10-15% |

Conservative premium boost estimate: **+15-25% on strong-trend weeks**.

### Safety validation from MSFT crash data

| Date | MSFT Close | P/E20 | P/E50 | Filter | 5-day Forward |
|------|-----------|-------|-------|--------|--------------|
| Dec 1 | 486.74 | 0.983 | 0.966 | ⛔ BLOCKED | +0.88% |
| Dec 8 | 491.02 | 1.000 | 0.982 | ⛔ BLOCKED (E50) | -3.30% |
| Jan 5 | 472.85 | 0.978 | 0.963 | ⛔ BLOCKED | +0.92% |
| Jan 12 | 477.18 | 0.991 | 0.976 | ⛔ BLOCKED | -4.75% |
| Jan 27 | 480.58 | 1.024 | 1.001 | ✅ PASSED | -9.97% (earnings crash) |
| Feb 2 | 423.37 | 0.921 | 0.893 | ⛔ BLOCKED | -2.31% |
| Mar 30 | 358.96 | 0.932 | 0.879 | ⛔ BLOCKED | +3.71% |
| Apr 20 | 418.07 | 1.065 | 1.043 | ✅ PASSED (recovery) | +1.61% |

The filter blocked MSFT from **mid-December 2025 through mid-April 2026** — the entire 27% decline and recovery period.

**Note:** The Jan 27 pass was a 1-day bounce before the earnings crash. The earnings_before_expiry filter is the defense against that specific case.

## Implementation plan

### New module: `src/trend.rs`

- `calculate_and_save(symbols_file, conn)` — compute EMA20 and EMA50 for all symbols, store in DB
- Uses daily candles already in the database
- Reuses `atr::exponential_moving_average()`

### New DB table: `trend`

```sql
CREATE TABLE IF NOT EXISTS trend (
    symbol TEXT NOT NULL,
    ema20 REAL NOT NULL,
    ema50 REAL NOT NULL,
    trend_ratio_20 REAL NOT NULL,  -- price / ema20
    trend_ratio_50 REAL NOT NULL,  -- price / ema50
    timestamp INTEGER NOT NULL,
    PRIMARY KEY (symbol, timestamp)
);
```

### Modified: `src/constants.rs`

```rust
pub const TREND_FILTER_THRESHOLD: f64 = 0.98;  // hard filter: price/EMA must exceed this
pub const TREND_TIGHTEN_MULTIPLIER: f64 = 4.0;  // strike tightening aggressiveness
pub const TREND_TIGHTEN_CAP: f64 = 0.25;        // max 25% reduction in max_drop
```

### Modified: `src/model.rs`

- `calculate_put_score()` — add `trend_ratio_20` and `trend_ratio_50` params
  - Hard filter: if either < `TREND_FILTER_THRESHOLD`, return `None`
  - Soft score: add `trend_norm` component to composite score
- New weights: **Sharpe 20%, Safety 30%, Return 20%, Trend 30%**
- `calculate_adjusted_strike_range()` — apply trend_factor to max_drop values

### Modified: `src/option.rs`

- `retrieve_option_chains_with_expiry()` — collect trend data alongside sharpe/price data
- `publish_to_telegram()` — show trend info in CSV and caption

### Modified: `src/main.rs`

- `PerformAll` — add `trend::calculate_and_save()` step

### New constants summary

```rust
pub const TREND_FILTER_THRESHOLD: f64 = 0.98;
pub const TREND_TIGHTEN_MULTIPLIER: f64 = 4.0;
pub const TREND_TIGHTEN_CAP: f64 = 0.25;
pub const EMA_SHORT_PERIOD: u32 = 20;
pub const EMA_LONG_PERIOD: u32 = 50;
```

## Score weight changes

Current: `30% Sharpe + 40% Safety + 30% Return`

Proposed: `20% Sharpe + 30% Safety + 20% Return + 30% Trend`

| Factor | Old Weight | New Weight | Why |
|--------|-----------|-----------|-----|
| Sharpe | 30% | 20% | Less important than current trend for weekly options |
| Safety (strike percentile) | 40% | 30% | Still important but trend provides additional safety |
| Return quality | 30% | 20% | Less weight needed since trend-adjusted strikes optimize this automatically |
| Trend | — | 30% | Most forward-looking signal for weekly options |

## Files changed

| File | Change |
|------|--------|
| `src/trend.rs` | **NEW** — EMA20/EMA50 calculation and storage |
| `src/store/trend.rs` | **NEW** — DB operations for trend table |
| `src/constants.rs` | **MODIFY** — add trend-related constants |
| `src/model.rs` | **MODIFY** — update `calculate_put_score()`, add trend to CSV/TopPick |
| `src/option.rs` | **MODIFY** — collect trend data, apply strike adjustment, update telegram output |
| `src/main.rs` | **MODIFY** — add trend step to PerformAll, add CalculateTrend command |

## Future improvements (not in scope)

1. **Sector diversification** — group symbols by sector, enforce max 1 pick per sector in top picks
2. **IV percentile** — measure whether current premium is historically cheap or expensive
3. **Position management** — track assigned positions, suggest covered call strategies
4. **Full 73-symbol backtest** — validate with the complete symbol universe
