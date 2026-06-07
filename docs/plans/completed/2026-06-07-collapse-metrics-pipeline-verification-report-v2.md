# Verification Report: Collapse Metrics Pipeline (v2 — post-fix)

**Date:** 2026-06-07
**Scope:** Re-review of `collapse-metrics-pipeline` branch after verification fixes. 5 commits, 11 files changed. Focus: all previous findings resolved, fresh adversarial pass.
**Reviewer:** AI verify skill (security + optimization + traceability)

## Summary

| Pass | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Security | 0 | 0 | 0 | 0 |
| Optimization | 0 | 0 | 0 | 2 |
| Traceability | 0 | 0 | 0 | 2 |
| **Total** | **0** | **0** | **0** | **4** |

Clean. All previous Critical/High findings resolved. Only low-priority polish items remain.

## 🔴 Security Findings

None. No new external inputs, no secrets changes, no injection surfaces. SQLite queries use parameterized `params![]` throughout the store layer.

## 🟡 Optimization Findings

### [O-001] Low — Three `pub(crate)` ATR helpers have no external callers

**Location:** `src/atr.rs:10`, `src/atr.rs:17`, `src/atr.rs:21`

**Issue:** `true_range_ratio`, `calculate_range`, and `ema` are marked `pub(crate)` but are only called internally within `atr.rs` (by `true_ranges_ratio` and `exponential_moving_average` respectively). They were widened to `pub(crate)` in the initial refactor but only `true_ranges_ratio` is actually used by `metrics.rs`.

**Fix:** Downgrade `true_range_ratio`, `calculate_range`, and `ema` from `pub(crate)` to plain `fn`. Only `true_ranges_ratio` needs `pub(crate)`.

### [O-002] Low — Makefile has commented-out dead targets and duplicate help entry

**Location:** `Makefile:8-26` (commented-out targets), `Makefile:70` (duplicate `perform-all` in help), `Makefile:68` (missing `pull-option-chain-5day` from help)

**Issue:** The commented-out targets are documentation — arguably useful for history. But the help output has a duplicate `perform-all` line and is missing `pull-option-chain-5day`.

**Fix:** Delete the commented-out blocks (the git history preserves them). Fix help output: add `pull-option-chain-5day`, remove duplicate `perform-all`.

## 🔵 Traceability Findings

### [T-001] Low — Inconsistent error handling between `run_all` and its helpers

**Location:** `src/metrics.rs:35-47` (run_all) vs `src/metrics.rs:55ff` (each helper)

**Issue:** `run_all` returns `model::Result<()>` and propagates table-creation errors via `?`. But the per-symbol metric helpers (`compute_and_save_atr`, `compute_and_save_max_drop`, etc.) swallow errors — they log and `return`, never propagating failures up. This means `run_all` always returns `Ok(())` even if every symbol fails. This matches the old behavior (the old `calculate_and_save` functions also had mixed error handling — some returned `Err`, some `continue`d), so it's not a regression. But it's worth noting.

**Fix:** No fix needed for this PR — matches old behavior. A future improvement could have helpers return `Result` and accumulate errors.

### [T-002] Low — `compute_and_save_trend` reimplements logic that `trend::calculate_trend_ratios` already provides

**Location:** `src/metrics.rs:180-192` vs `src/trend.rs:5-10`

**Issue:** After the redundant-EMA fix, `compute_and_save_trend` now computes EMAs and derives ratios directly instead of calling `trend::calculate_trend_ratios`. This is correct and avoids double computation, but the ratio derivation (`price / ema_short`, `price / ema_long`) is duplicated from `trend.rs:8-10`. If the ratio formula ever changes, it must be updated in two places.

**Fix:** Acceptable tradeoff for this PR (the duplication is 2 lines and the alternative requires changing `calculate_trend_ratios`'s return type which affects `backtest.rs`). Could consolidate later if desired.

## Previous Findings — All Resolved

| ID | Finding | Status | Fix |
|----|---------|--------|-----|
| T-001 | Max drop candle count 850→50 | ✅ Fixed | `compute_and_save_max_drop` now fetches `CANDLE_COUNT` independently |
| T-002 | Price percentile candle count 20→50 | ✅ Fixed | `compute_and_save_price_percentile` now fetches `PRICE_PERCENTILE_DAYS` independently |
| O-001 | Redundant EMA in trend | ✅ Fixed | EMAs computed once, ratios derived directly |
| O-002 | Dead Makefile targets | ✅ Fixed | Commented out with notes |

## Remediation Task List

| ID | Priority | Finding | Estimated Effort |
|----|----------|---------|-----------------|
| O-001 | Low | Three `pub(crate)` ATR helpers have no external callers — downgrade to `fn` | Trivial |
| O-002 | Low | Makefile: clean commented-out targets, fix help duplication | Trivial |
| T-001 | Low | Inconsistent error handling (informational, matches old behavior) | N/A — future |
| T-002 | Low | Ratio derivation duplicated between metrics.rs and trend.rs | N/A — future |
