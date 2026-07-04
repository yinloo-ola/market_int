# Verification Report: put-score max_drop-safety redesign

**Date:** 2026-07-04
**Scope:** The 9-commit change set since `e43de0f` — `src/model.rs` (`calculate_put_score`, new `calculate_max_drop_safety`, 2 callers + tests), `src/constants.rs` (`PERCENTILE` 0.9→0.97), `src/backtest.rs` (`SafetySource` enum, `score_candidate` branch, `production_mirror` preset). Verified via `ptk-modify` (no `stub()` frontier; characterization tests are the pins).

## Summary

| Pass | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Security | 0 | 0 | 0 | 0 |
| Optimization | 0 | 1 (P1) | 2 (P2) | — |
| Traceability | 0 | 0 | 0 | 2 |
| **Total** | **0** | **1** | **2** | **2** |

**Headline:** No security or broken-seam issues. The change is correct and the call chains are intact (verified by the 110-test green suite + manual trace). The findings are maintenance hazards — **duplicated scoring logic** that will silently diverge, and **dead parameters** that mislead future callers.

---

## 🔴 Security Findings

None. The change is pure scoring/configuration math:
- No new external inputs, endpoints, env vars, or secrets.
- No SQL string interpolation — all DB access uses rusqlite `params![]` (e.g. `store/max_drop.rs`, `store/option_chain.rs`).
- No auth/authz or data-exposure surface touched.

The pre-existing surface (Tiger API tokens, Telegram bot token in `.env`) is unchanged and already covered by `.gitignore` per `AGENTS.md`.

---

## 🟡 Optimization Findings

### [O-001] P1 — Scoring logic duplicated across production and backtest
**Location:** `src/model.rs:155` (`calculate_put_score`) and `src/backtest.rs:808` (`score_candidate`)
**Issue:** The composite-score formula now exists in two independent implementations. `production_mirror()` makes them intentionally aligned, but the alignment is enforced **only by convention** — there is no code link. The next edit to `calculate_put_score` (a weight tweak, a new pre-filter) will silently diverge from the backtest, and nothing will tell you. This is exactly the hazard the decisions doc flagged ("backtest has its own `score_candidate` that replicates the formula").
**Fix:** Add a regression test that pins the two together — for a fixed input vector, assert `BacktestConfig::production_mirror().score_candidate(...)` equals `model::calculate_put_score(...)`. Cheap (one test), catches all future divergence. (Full de-duplication — having `score_candidate` delegate to `calculate_put_score` for the `MaxDropBand` path — is harder because `score_candidate` is the general research vehicle with configurable weights/scoring-type; the pinning test gets 90% of the safety for 10% of the effort.)

### [O-002] P2 — Dead parameters in `calculate_put_score` (and wasted caller work)
**Location:** `src/model.rs:161-163` — `_trend_ratio_short`, `_trend_ratio_long`, `_regime` are unused (the trend/regime scoring was removed in an earlier refactor; this change didn't reintroduce them, but it's the right moment to clean up).
**Issue:** Both callers (`option_chain_to_csv_vec` ~`:333` and the top-pick selection ~`:407`) still perform `trend_data.get(...)` HashMap lookups and thread `regime` through the function purely to pass arguments that are ignored. Wasted work per chain + a misleading signature.
**Fix:** Drop the three params from `calculate_put_score`; remove the now-unused trend lookup in the second caller (the first caller still needs trend for the CSV's `trend_short/long` columns — keep that). Update the ~10 test call sites.

### [O-003] P2 — `max_drop_safety` computed even when the config ignores it
**Location:** `src/backtest.rs` caller (~`:1087`) — `let band_safety = model::calculate_max_drop_safety(...)` runs unconditionally for every strike of every preset.
**Issue:** For the ~30 `StrikePercentile` presets, `score_candidate` ignores `max_drop_safety` (uses `strike_percentile` instead), so the per-strike computation is wasted. Across the full sweep (32 presets × 254 symbols × 179 weeks × ~30 strikes) it's not free.
**Fix:** Guard with `if config.safety_source == SafetySource::MaxDropBand` and pass `0.0` (or compute lazily) otherwise. Minor, but free performance.

**Process note (not a finding):** The workflow guard commits the entire tree on each `git commit`, so the `feat: score puts…` commit (`aec726f`) bundled the throwaway `experiments.rs` (+426 lines), requiring *two* separate `chore` commits to remove. The **net tree is clean** (verified: `main.rs` net-zero, `experiments.rs` absent), but `git blame` on `aec726f` is polluted. No code impact; flagging for awareness.

---

## 🔵 Traceability Findings

**Call-chain integrity — verified intact ✓**
- `calculate_put_score` (model.rs:155): both callers pass `safety` (was `strike_percentile`) — `option_chain_to_csv_vec:333` and top-pick selection `:407`. Signature matches.
- `calculate_max_drop_safety` direction is consistent at both call sites — `(strike, strike_from=deep, strike_to=shallow)` → deep=1.0. Production (`model.rs:333`) and backtest (`backtest.rs:1087`, using `min_strike`/`max_strike`) agree.
- `score_candidate` (backtest.rs:808): the 1 production caller (`:1087`) and 2 test callers (`:1567`, `:1578`) all pass the new `max_drop_safety` arg.
- Error propagation: `Option` returns handled — `None` skips via `?` in selection; CSV writes empty `score` cell. Consistent.

### [T-001] Low — False seam from unused params (traceability view of O-002)
**Entry point:** `option_chain_to_csv_vec` (`model.rs:333`) and top-pick selection (`:407`)
**Call chain:** caller → `calculate_put_score(sharpe, safety, rate, ts, tl, regime)`
**Broken at:** not broken — but the seam is **false**. `regime: &MarketRegime` is a non-trivial typed argument; a future maintainer will reasonably assume regime affects scoring and either (a) waste time tracing why it doesn't, or (b) "fix" it by wiring regime in, unintentionally changing behavior.
**Fix:** same as O-002 — remove the unused params so the signature stops advertising a seam that doesn't exist.

### [T-002] Low — Quiet behavioral change at the scoring seam
**Location:** `option_chain_to_csv_vec` (`model.rs:333`) and top-pick selection (`:407`)
**Issue:** Previously, scoring was gated on `price_ranges.get(underlying)?` — a chain with no 20-day range got **no** score and was **skipped** by top-pick selection. After the change, scoring uses the max_drop band (always available from the stored `strike_from`/`strike_to`), so such a chain now gets a score, produces a `score` CSV cell with a **blank `strike_percentile`** cell, and **is eligible for top-3**. This is intentional and arguably more correct (band safety doesn't need the 20-day range), but it's a contract change at the seam that's silent:
  - CSV consumers may not expect `score` present + `strike_percentile` blank.
  - The Telegram caption (top-3) will now consider chains it previously dropped.
**Fix:** In practice every pipeline symbol has 20-day candles, so this only bites on partial-data days. Decide explicitly: either (a) accept + document it (one line in the decisions doc), or (b) gate scoring on price_range presence for output consistency. Recommend (a) — the new behavior is correct.

---

## Remediation Task List

| ID | Priority | Finding | Effort | Route |
|----|----------|---------|--------|-------|
| O-001 | P1 | Duplicated scoring (production vs backtest) — add pinning test | small | `/skill:ptk-modify` |
| O-002 | P2 | Dead params in `calculate_put_score` + wasted caller work | small | `/skill:ptk-modify` |
| O-003 | P2 | `max_drop_safety` computed when ignored | small | `/skill:ptk-modify` |
| T-001 | Low | False seam (same root as O-002) | (merged with O-002) | `/skill:ptk-modify` |
| T-002 | Low | Scoring no longer gated on price_range | small (doc) or small (code) | `/skill:ptk-modify` or fold into `/skill:ptk-finalizing` |

**Routing:** all findings are fixes to **existing working code** → `/skill:ptk-modify`. T-002's "document it" option is polish that can fold into `/skill:ptk-finalizing`. None require re-scaffold. Reserve `/skill:ptk-execute` for genuinely unfinished stubs — there are none (the modify frontier is characterization tests, all green).

**Recommended order if you act:** O-001 first (the pinning test is the highest value-per-effort and protects everything else), then O-002/T-001 (signature cleanup), then O-003 (perf), then T-002 (doc decision).
