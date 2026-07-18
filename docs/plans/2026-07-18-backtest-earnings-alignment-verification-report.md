# Verification Report: Backtest earnings alignment + fetch-earnings

**Date:** 2026-07-18
**Scope:** The backtest-alignment round — commits `ead06ab` (`feat(backtest)`) and `c56a58b` (`feat(cli): fetch-earnings`), spanning `src/backtest.rs` (`apply_earnings_rule`, `load_earnings`, `run_backtest` signature + candidate-loop delegation), `src/option.rs` (`fetch_earnings_to_file`, `ny_at`), and `src/main.rs` (`--earnings` arg, `FetchEarnings` subcommand). Traces both entry points end-to-end, including the `fetch-earnings` → `--earnings` round-trip.

## Summary

| Pass | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| Security | 0 | 0 | 0 | 0 |
| Optimization | 0 | 0 | 0 | 2 |
| Traceability | 0 | 0 | 1 | 1 |
| **Total** | **0** | **0** | **1** | **3** |

No Critical/High. The alignment is sound: the `fetch-earnings` → `--earnings` round-trip is format-consistent (header row + `symbol,report_date` positional columns line up); `production_mirror`'s delegated path (`calculate_put_chain_score(…, false)`) is provably identical to its old `score_candidate` path on the no-earnings case (so the change is behavior-preserving when `--earnings` is absent), and the backtest's `[sim_date, sim_date+period]` window faithfully mirrors production's inclusive `[today, expiry]`. Findings are one false-contract docstring and minor cleanups.

## 🔵 Traceability Findings

### [T-001] Medium — `load_earnings` docstring is a false contract about missing-file behavior
**Location:** `src/backtest.rs:1017` (docstring) vs `:1020` (code)
**Issue:** The docstring says *"Returns an empty map (no error) if the file is missing."* The code does the opposite: `File::open(path).map_err(... CouldNotOpenFile ...)?` **returns `Err(QuotesError::CouldNotOpenFile)`** when the file is absent. The *caller* (`main.rs` Backtest handler) is the one that converts that `Err` into an empty map + logs and continues. So the contract `load_earnings` advertises is false — a future caller that trusts the docstring would fail to handle the `Err`. The repo's own `docs/lessons.md` calls accepted-but-ignored/false-contract params out by name; a false *error* contract is the same class of trap.
**Fix:** Correct the docstring to match reality, e.g. *"Returns `Err(CouldNotOpenFile)` if the file is missing; the caller decides whether to fall back to an empty map."* (One-line doc edit; no behavior change.)

### [T-002] Low — `load_earnings` assumes a header row; a headerless CSV silently drops the first data row
**Location:** `src/backtest.rs:1022` — `csv::Reader::from_reader(file)` (default `has_headers = true`)
**Issue:** `csv::Reader` skips the first record as a header. `fetch-earnings` (the intended producer) writes a header, so the happy path is correct. But if a user hand-supplies a headerless earnings CSV, its first data row is silently consumed as a header and lost. Not a correctness bug for the documented format, but a silent footgun for ad-hoc files.
**Fix:** Either (a) document that the file must have a header (matching `fetch-earnings` output), or (b) make the reader headerless (`csv::ReaderBuilder::new().has_headers(false)`) and treat all rows as data — option (b) is strictly more tolerant and costs nothing. Low priority.

## 🟡 Optimization Findings

### [O-001] P2 — `ny_at` uses `.unwrap()` / `.single().unwrap()` (safe today, fragile if reused)
**Location:** `src/option.rs:323–325`
**Issue:** `and_hms_opt(h,m,s).unwrap()` and `from_local_datetime(...).single().unwrap()`. For the two hardcoded call sites — midnight `(0,0,0)` and end-of-day `(23,59,59)` in `America/New_York` — these are provably safe: DST folds in NY occur at ~2am, never at midnight or 23:59, and `(0,0,0)`/`(23,59,59)` are always valid hms. So no panic is reachable today. But the helper is generic over `h,m,s`; a future caller passing a 2am time on a DST-transition day would panic with no context.
**Fix (optional):** Replace the bare `.unwrap()`s with `.expect("midnight/end-of-day never DST-ambiguous")`, or have `ny_at` return `Option`/`Result`. Pure defensiveness; not required for correctness.

### [O-002] P2 — `band_safety` computed but unused on the production-mirror delegated path
**Location:** `src/backtest.rs` candidate loop — the `band_safety` assignment (~`:1175`) runs for every strike, but when `config.apply_earnings_rule` the score comes from `calculate_put_chain_score`, which recomputes safety internally
**Issue:** For `production_mirror`, `calculate_max_drop_safety(strike, min_strike, max_strike)` is computed once per strike (for `band_safety`) and then *again* inside `calculate_put_chain_score`. Doubled work per strike, but it's a handful of f64 ops on a small strike count per symbol — negligible vs the Black-Scholes pricing in the same loop.
**Fix (optional):** Skip the `band_safety` computation when `config.apply_earnings_rule` (move it into the `else` branch, or compute it lazily). Trivial; leave as-is if clarity is preferred.

## Remediation Task List

| ID | Priority | Finding | Effort |
|----|----------|---------|--------|
| T-001 | Medium | `load_earnings` docstring false contract (missing-file behavior) | small (doc edit) |
| T-002 | Low | `load_earnings` header-row assumption | small |
| O-001 | P2 | `ny_at` bare `.unwrap()`s | small (optional) |
| O-002 | P2 | redundant `band_safety` on delegated path | small (optional) |
