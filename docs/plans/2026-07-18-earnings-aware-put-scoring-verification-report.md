# Verification Report: Earnings-aware put scoring

**Date:** 2026-07-18
**Scope:** The earnings-aware put-scoring feature — `src/constants.rs` (`EARNINGS_SAFETY_MULTIPLIER`), `src/model.rs` (`earnings_in_window`, `calculate_put_chain_score`, and the two rewired scoring call sites in `option_chain_to_csv_vec`). Review traces the full call chain: `option.rs` (`retrieve_option_chains_with_expiry` / `publish_option_chains` → `publish_to_telegram` → `option_chain_to_csv_vec`).

## Summary

| Pass | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Security | 0 | 0 | 0 | 1 (pre-existing) |
| Optimization | 0 | 0 | 0 | 1 |
| Traceability | 0 | 0 | 2 | 1 |
| **Total** | **0** | **0** | **2** | **3** |

No Critical/High. The change is well-contained: `calculate_put_score` is untouched (the `production_mirror` pin stays valid), the new logic is in pure, fully-tested helpers, and the two previously-duplicated scoring call sites were correctly unified. Findings are naming, a behavioral asymmetry between the two publish paths, a timezone seam, and two minor items.

## 🔵 Traceability Findings

### [T-001] Medium — re-publish path is earnings-blind, so live vs re-publish scores/picks diverge
**Entry point:** `src/option.rs:373` `publish_option_chains` (the `publish-option-chain` CLI command)
**Call chain:** `publish_option_chains` → `publish_to_telegram` → `option_chain_to_csv_vec` → `calculate_put_chain_score`
**Broken at:** `src/option.rs:387` — `let earnings_map = HashMap::new();`
**Issue:** The live path (`retrieve_option_chains_with_expiry`) fetches a real earnings map at `option.rs:322` and now applies the earnings rule (exclude upper half, halve safety). The re-publish path builds an **empty** earnings map, so `earnings_in_window` is always `false` there → the rule never fires. Re-publishing the same chains therefore yields **different** top-3 picks and scores than the live run (earnings-risky shallow strikes that the live run excluded will reappear). The earnings *warning* was already missing on re-publish (pre-existing), but this extends the asymmetry into scoring.
**Fix:** Either (a) document that `publish-option-chain` is earnings-blind and intended for re-render only, or (b) persist the earnings calendar alongside `option_strike` rows and reload it in `publish_option_chains` so the two paths agree. (a) is a one-line doc note; (b) is the correct fix and mirrors how the other metrics (sharpe, trend) are already persisted+reloaded.

### [T-002] Medium — `_earnings_map` is underscore-prefixed but is now load-bearing
**Location:** `src/option.rs:572` (`publish_to_telegram` signature), used at `:585`
**Issue:** The parameter is named `_earnings_map`, which by Rust convention (and this repo's own lesson in `docs/lessons.md`: *"A function parameter that is accepted but ignored is a false contract. Prefix it `_` immediately"*) advertises "ignored." It is **not** ignored — it is passed straight into `option_chain_to_csv_vec`, where this change makes it drive **scoring** (strike exclusion + safety discount), not just the display it used to affect. The misleading name is now more consequential than before the change.
**Fix:** Rename `_earnings_map` → `earnings_map` in the signature (`:572`) and the call site (`:585`). Trivial, no behavior change.

### [T-003] Low — `today` is read in `Local` time (UTC on Cloud Run) while the earnings fetch uses New York time
**Location:** `src/model.rs:393` — `let today = chrono::Local::now().date_naive();`
**Issue:** `fetch_earnings_map` (`src/option.rs:253`) queries the earnings window in **New York** time (`Local::now().with_timezone(&New_York)`), but `option_chain_to_csv_vec` evaluates the `[today, expiry]` window in **`Local`** time. On the Cloud Run deployment (distroless, TZ=UTC) `Local` is UTC, which is 4–5h ahead of NY. Around the date-rollover boundary this shifts `today` by one day relative to the fetch, so a same-day-as-now earnings report can be judged out-of-window (rule doesn't fire) or vice-versa. Impact is bounded to ~1 day at the boundary for same-day reports, and the decisions doc accepted boundary inclusivity noise — but the two clocks being inconsistent is an avoidable seam.
**Fix:** Derive `today` in NY time to match the fetch: `chrono::Local::now().with_timezone(&chrono_tz::America::New_York).date_naive()`. (Pulls `chrono_tz` into `model.rs`, or pass `today` in from the caller where NY is already in scope.)

## 🟡 Optimization Findings

### [O-001] P2 — `in_earnings_window` re-parses the same date strings for every chain of a symbol
**Location:** `src/model.rs:394–399` (the `in_earnings_window` closure)
**Issue:** For each chain, the closure re-looks up `earnings_map` and re-parses both `report_date` and `chain.expiration` (`NaiveDate::parse_from_str` ×2). Within one `option_chain_to_csv_vec` call, all chains of a given symbol share the same `expiration` and the same earnings entry, so the parse work is repeated ~N×strike-count times. The cost is negligible (short strings, small chain counts, runs once daily), so this is a style/redundancy note, not a real cost.
**Fix (optional):** Memoize per-underlying, or precompute a `HashMap<&str, bool>` of symbols-with-earnings-in-window once before the loops. Leave as-is if the simplicity is preferred.

## 🔴 Security Findings

### [S-001] Low — (pre-existing, not introduced by this change) NaN score panics the top-pick sort
**Location:** `src/model.rs:502` — `scored.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());`
**Issue:** `partial_cmp` returns `None` for any `NaN`, and `.unwrap()` then panics. A `NaN` score reaches here if `calculate_put_score` receives `NaN` safety/sharpe — which corrupt strike-band data (e.g. `strike_from`/`strike_to` = `NaN`) can produce (`calculate_max_drop_safety`'s `.clamp(0.0,1.0)` does **not** filter `NaN`). This change does **not** introduce `NaN` (the new arithmetic is `safety * 0.5` and `(from+to)/2.0`, both of which preserve-but-don't-create `NaN`), but the earnings-rule code paths now flow into the same sort, so it's worth surfacing.
**Fix (pre-existing):** Sort with a `NaN`-safe comparator, e.g. `b.1.partial_cmp(&a.1).unwrap_or(Ordering::Equal)` (and/or reject/`None` chains whose inputs are non-finite upstream). Out of scope for this feature unless you want it bundled.

## Remediation Task List

| ID | Priority | Finding | Effort |
|----|----------|---------|--------|
| T-001 | Medium | re-publish path earnings-blind → divergent picks vs live | medium (persist+reload) / small (doc note) |
| T-002 | Medium | rename `_earnings_map` → `earnings_map` (now load-bearing) | small |
| T-003 | Low | `today` in Local/UTC vs NY-based earnings fetch | small |
| O-001 | P2 | redundant per-chain date parsing | small (optional) |
| S-001 | Low (pre-existing) | `NaN`-score sort panic | small (out of scope) |
