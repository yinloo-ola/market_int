# Decisions: Backtest alignment with earnings-aware production scoring

## Problem

Production scoring (`option_chain_to_csv_vec` → `calculate_put_chain_score`)
now applies an earnings rule: when a symbol reports earnings in `[today, expiry]`,
upper-half strikes are excluded and the rest score with halved safety. The
backtest (`run_backtest`) is **fully offline/synchronous** — it reads candles
from SQLite, has no `Requester`, and has **no earnings data at all**. So its
`production_mirror` config cannot mirror the earnings-aware production path, and
backtest results for earnings-affected symbols are not trustworthy (ADR in
`2026-07-18-earnings-aware-put-scoring-decisions.md`).

**Goal:** let the backtest apply the same earnings rule, sourced from Tiger, while
preserving its offline/reproducible nature.

## Approaches considered

- **A — Optional `--earnings <file>` with graceful fallback; a separate
  `fetch-earnings` subcommand materializes the file from Tiger.** Backtest gains
  `--earnings` (CSV `symbol,report_date[,report_time[,expected_eps]]`); when
  supplied, `earnings_in_window` is computed per `(sim_date, symbol)` and the
  production_mirror path delegates to `calculate_put_chain_score`; when absent,
  behavior is exactly today (earnings-blind). `fetch-earnings <from> <to> <out>`
  queries Tiger's `corporate_action`/earning calendar for the window and writes
  the CSV. Keeps `run_backtest` sync/offline; the only network is the one-time
  materialization step the user runs separately.
- **B — Fetch the calendar inside `run_backtest`.** Turnkey, but forces
  `run_backtest` async + a `Requester` dependency, breaking the offline/
  reproducible contract and the "no API" invariant the backtest doc states.
- **C — Accumulate earnings history during live runs**, backtest reads it. Real
  data, but useless for retrospective backtests (no history exists yet).

**Chosen: A.** Preserves the backtest's offline/reproducible core, aligns
`production_mirror` with production *when data is present*, degrades cleanly to
today's behavior when not, and isolates all network behind a separate
materialization command the user runs once. (B) breaks the backtest's defining
invariant for unverified payoff; (C) can't help past backtests.

## Decisions (ADR-style)

### `production_mirror` delegates to the production helper instead of replicating its formula

Add `BacktestConfig::apply_earnings_rule: bool` (default false; true only for
`production_mirror`). In the candidate loop, when `apply_earnings_rule` is set,
score via `model::calculate_put_chain_score(sharpe, strike, min_strike,
max_strike, rate, regime, earnings_in_window)` instead of `score_candidate`.
This makes the mirror **identical by construction** to the shipped production
scorer (no formula duplication → no drift), which is more faithful than the
previous "replicate the formula and pin it" approach. `score_candidate` and its
existing pin (`test_production_mirror_matches_calculate_put_score`) are
**unchanged** — they still guard the base scorer used by the 37 research configs;
the pin's comment is updated to reflect that production_mirror's loop now
delegates. A new assertion (`production_mirror().apply_earnings_rule == true`)
guards the wiring.

### Earnings enter the backtest as a materialized file, not a live API call

`run_backtest` gains an `earnings_by_symbol: &HashMap<String, Vec<NaiveDate>>`
param (empty when no file). The window check is `sim_date <= report_date <=
(sim_date + period)` per symbol — recomputed per `(sim_date, symbol)` from the
parsed dates, so no wall-clock and fully deterministic (testable). The
`fetch-earnings` subcommand is the only network touchpoint; the backtest itself
stays sync and offline.

## Module outline (handoff)

- `src/main.rs` — new `FetchEarnings { from, to, output }` subcommand (async,
  inits `Requester`, calls `option::fetch_earnings_to_file`); `Backtest` gains an
  optional `--earnings <path>` arg, loads it via `backtest::load_earnings`, and
  passes the map into `run_backtest`.
- `src/option.rs` — `pub async fn fetch_earnings_to_file(requester, from, to,
  output)`: queries `query_earnings_calendar("US", from, to)` and writes CSV
  (`symbol,report_date,report_time,expected_eps`). Mirrors `fetch_earnings_map`.
- `src/backtest.rs` — `BacktestConfig` gains `apply_earnings_rule`; `control()`
  false, `production_mirror()` true; `run_backtest` gains the earnings map param;
  the candidate loop computes per-`(sim_date,symbol)` `earnings_in_window` and
  delegates to `calculate_put_chain_score` when `apply_earnings_rule`; new
  `pub fn load_earnings(path) -> HashMap<String, Vec<NaiveDate>>` (+ unit test).

## Open question for implementation

- Whether Tiger's `corporate_action`/earning endpoint returns **past** earnings
  for the `[from, to]` window is unverified. `fetch-earnings` writes whatever
  Tiger returns; if it is forward-only, historical backtests simply get an
  earnings-blind result (graceful fallback) — a Tiger limitation, not a code bug.
