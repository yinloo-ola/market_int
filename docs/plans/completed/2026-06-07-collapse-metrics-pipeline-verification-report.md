# Verification Report: Collapse Metrics Pipeline

**Date:** 2026-06-07
**Scope:** Refactor of 5 metric modules (atr, maxdrop, sharpe, trend, price_percentile) — orchestration stripped, consolidated into `src/metrics::run_all`, standalone subcommands deleted from `main.rs`. 4 commits on `collapse-metrics-pipeline` branch.
**Reviewer:** AI verify skill (security + optimization + traceability)

## Summary

| Pass | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Security | 0 | 0 | 0 | 0 |
| Optimization | 0 | 1 | 1 | 0 |
| Traceability | 0 | 1 | 1 | 1 |
| **Total** | **0** | **2** | **2** | **1** |

No security issues. Two high-severity findings worth fixing before merge.

## 🔴 Security Findings

None. The codebase reads from its own SQLite database and well-known APIs — no new external inputs were introduced. Secrets remain in `.env` (already in `.gitignore`). No injection surfaces.

## 🟡 Optimization Findings

### [O-001] High — Redundant EMA computation in `compute_and_save_trend`

**Location:** `src/metrics.rs:203-207`

**Issue:** `compute_and_save_trend` calls `trend::calculate_trend_ratios(&closes)`, which internally computes `ema_short` and `ema_long`. Then lines 205-206 recompute the *same* EMAs:

```rust
let (trend_ratio_short, trend_ratio_long) = crate::trend::calculate_trend_ratios(&closes);
let ema_short = crate::atr::exponential_moving_average(&closes, constants::EMA_SHORT_PERIOD);  // duplicate
let ema_long = crate::atr::exponential_moving_average(&closes, constants::EMA_LONG_PERIOD);    // duplicate
```

The comment on line 201 says "Build closes once — reuse for both trend ratios and EMAs" but the EMAs are not reused from `calculate_trend_ratios`. They're computed twice. The function produces identical values both times (same input, same function), so correctness is unaffected — this is pure waste.

**Fix:** Either (a) have `calculate_trend_ratios` also return the raw EMAs, or (b) compute EMAs first and pass them into a variant of `calculate_trend_ratios`, or (c) compute EMAs first, derive ratios manually (`price / ema`), and skip `calculate_trend_ratios`. Option (a) is cleanest — change the return type to `(f64, f64, f64, f64)` = `(ratio_short, ratio_long, ema_short, ema_long)` and update the two callers (metrics.rs, backtest.rs:982).

### [O-002] Medium — Dead Makefile targets reference deleted subcommands

**Location:** `Makefile:8-23`

**Issue:** Six Makefile targets invoke deleted subcommands that no longer exist:
- `calculate-atr` → `cargo run -- calculate-atr ...`
- `calculate-maxdrop-5` → `cargo run -- calculate-max-drop ... 5`
- `calculate-maxdrop-20` → `cargo run -- calculate-max-drop ... 20`
- `calculate-sharpe` → `cargo run -- calculate-sharpe-ratio ...`
- `calculate-price-percentile` → `cargo run -- calculate-price-percentile ...`

Running any of these will fail with a clap error at runtime. The `help` target at line 67 also lists them.

**Fix:** Delete the five Makefile targets and their help entries.

## 🔵 Traceability Findings

### [T-001] High — Max drop now computed on 50 candles instead of 850

**Location:** `src/metrics.rs:55-56` (loads `EMA_LONG_PERIOD` = 50 candles) → `src/metrics.rs:119` (passes same `&candles` to `compute_max_drop_stats`)

**Issue:** The original `maxdrop::calculate_and_save` fetched `CANDLE_COUNT` (850) candles per symbol. The new `metrics::run_all` loads `EMA_LONG_PERIOD` (50) candles once per symbol and passes that slice to `compute_and_save_max_drop`. The max drop function uses `candles.windows(period)` — with 50 candles and period=5, it gets ~46 rolling windows. With the original 850 candles, it got ~846 windows.

This means max drop statistics (percentile drop, EMA drop) are now computed over a much shorter lookback window. The statistical properties will be different — fewer samples, potentially different percentile/EMA values. Whether this is intentional depends on the user's needs, but it's a *behavior change* from the old pipeline.

**Fix:** If the old 850-candle window was important, `compute_and_save_max_drop` should fetch its own candles with `CANDLE_COUNT` (same pattern as `compute_and_save_atr` which already refetches). If 50 candles is acceptable, document the change.

### [T-002] Medium — Price percentile computed on 50 candles instead of 20

**Location:** `src/metrics.rs:55` (loads 50 candles) → `src/metrics.rs:136` (passes to `compute_price_percentile`)

**Issue:** The original `price_percentile::calculate_and_save` fetched `PRICE_PERCENTILE_DAYS` (20) candles. The new pipeline passes the same 50-candle slice. The `compute_price_percentile` function computes `min/max` over whatever slice it receives, so with 50 candles the percentile window is now 50 days instead of 20 days. The min/max range will be wider, making the percentile value potentially different.

**Fix:** If exact 20-day behavior is required, `compute_and_save_price_percentile` should fetch its own candles with `PRICE_PERCENTILE_DAYS`. If the wider window is acceptable, this is fine.

### [T-003] Low — `save_sharpe_ratio` uses `&Connection` but `save_max_drop_period` uses `&mut Connection`

**Location:** `src/store/sharpe_ratio.rs:20` vs `src/store/max_drop.rs:47`

**Issue:** Minor API inconsistency across the store layer. `metrics.rs` handles this correctly (passes `&mut conn` to both — Rust auto-derefs), but it's a cleanup opportunity for the store layer.

**Fix:** N/A for this PR — note for future cleanup.

## Remediation Task List

| ID | Priority | Finding | Estimated Effort |
|----|----------|---------|-----------------|
| T-001 | High | Max drop candle count changed from 850 → 50 (behavior change) | Small — add refetch in `compute_and_save_max_drop` |
| O-001 | High | Redundant EMA computation in `compute_and_save_trend` | Small — change return type of `calculate_trend_ratios` |
| T-002 | Medium | Price percentile candle count changed from 20 → 50 | Small — add refetch in `compute_and_save_price_percentile` |
| O-002 | Medium | Dead Makefile targets for deleted subcommands | Small — delete 5 targets + help entries |
| T-003 | Low | Store layer `&Connection` vs `&mut Connection` inconsistency | N/A — future cleanup |
