# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Earnings-aware put scoring** — when a symbol reports earnings inside `[today, expiry]`, upper-half strikes (`strike > band midpoint`) are excluded and surviving lower-half strikes score with halved safety (`EARNINGS_SAFETY_MULTIPLIER = 0.5`); the max_drop band is built from non-event volatility. New pure helpers `calculate_put_chain_score` / `earnings_in_window`; `calculate_put_score` is unchanged.
- **Earnings calendar persisted** (`store::earnings`) — the live run writes a snapshot so the offline `publish-option-chain` re-publish path applies the same earnings rule as the live run.
- `fetch-earnings <from> <to>` subcommand — materializes the Tiger earnings calendar for a date range to a CSV that feeds `backtest --earnings`.
- `backtest --earnings <csv>` flag; `production_mirror` now delegates to `calculate_put_chain_score` (earnings-aware) so the backtest mirrors production exactly when earnings data is supplied. Absent the flag, behavior is unchanged.
- Added support for multiple options-scoring paradigms in the backtester (`Symmetric`, `AsymmetricStatic`, and `AsymmetricDynamic`) to test different yield targets
- Added Net P&L per share, total premium collected, and total assignment loss tracking to backtest metrics
- Deployed highly profitable `premium-static-080` scoring model in production, shifting `IDEAL_RETURN` to 80% with an asymmetric soft-cap and a protective `0.40` maximum strike percentile safety ceiling

### Fixed

- Top-pick sort no longer panics on a `NaN` score (e.g. corrupt strike-band data): `partial_cmp().unwrap()` → `unwrap_or(Equal)`.
- Earnings-window `today` is now derived in New York time to match the earnings-calendar fetch (was `Local` = UTC on Cloud Run, drifting ±1 day at the boundary).
- `load_earnings` accepts both headered and headerless earnings CSVs, and its docstring no longer misstates the missing-file behavior (it returns `Err`; the caller falls back to earnings-blind).
- Fixed a backtest assignment bug where weekend option expiry dates (Saturday/Sunday) skipped the Friday close and checked next Monday's close, falsely inflating assignments due to weekend gaps.
- Adjusted all corresponding scoring unit tests in `src/model.rs` to align with the new 80% asymmetric soft-cap math, returning the entire test suite to 100% green.

### Changed

- `publish_to_telegram`'s `_earnings_map` renamed to `earnings_map` — it now drives scoring (via `calculate_put_chain_score`), not just the display warning.
- Lowered `MIN_RATE_OF_RETURN` from 0.30 to 0.25 to increase search-space flexibility, and lowered `MAX_STRIKE_PERCENTILE` from 0.60 to 0.40 to guarantee deeply out-of-the-money safety margins.
- **Put-option safety is now derived from the max_drop band** (`calculate_max_drop_safety` over `[strike_from, strike_to]`) instead of the 20-day `strike_percentile`. Deep strikes (rarely-breached historical drops) now score highest; the score and the strike-range filter agree on what "safe" means.
- `PERCENTILE` raised 0.9 → 0.97 — wider strike bands (median 5-day band ~2.4% → ~5.3%), fixing narrow-band cases where calm stocks had no candidate strikes.
- Backtest: added `SafetySource` (`StrikePercentile` / `MaxDropBand`) and a `production-mirror` preset that faithfully reproduces live scoring (pinned by a regression test).

### Removed

- The `rate_of_return > 0.80` hard cap and the `strike_percentile > 0.40` pre-filter from put scoring. `rate_of_return` is now a pure soft-capped reward (no upper exclusion); danger is expressed entirely via the max_drop band. `strike_percentile` remains in the CSV as a diagnostic.

## [0.7.0] - 2026-05-16

### Added

- Market regime-aware trend filtering — SPY's position relative to its EMA50 dynamically adjusts the trend filter threshold (0.98→0.92) and scoring weights (safety↑ trend↓) based on market conditions (#98ddf1f, #9c3da59)
- Telegram caption shows ⚠️ Correction or 🐻 Bear market flag when SPY is below its EMA50 (#f0e756a)
- 15 new tests covering regime calculation, dynamic scoring, and integration scenarios (#98ddf1f, #b666d23)

### Fixed

- Top picks now always select different underlying stocks — no more duplicates when one stock dominates the score rankings (#5455581)

## [0.6.0] - 2026-05-10

### Added

- Earnings calendar integration via Tiger OpenAPI — flags upcoming earnings in pipeline output (#7463bbb)
- `momentum_flag` helper with thresholds: NORMAL / HIGH / EXTENDED (#3c21bbb)
- Earnings date and momentum flag columns in CSV output (#6a0b7b1)
- TopPick selection column highlighting best put opportunities (#6a0b7b1)
- Telegram caption with top 3 puts, momentum warnings, and earnings alerts (#88e855b)
- Price percentile calculation collected from DB and shown in caption (#7e6c323, #0ab3b7e)

### Changed

- Widened scoring pre-filter thresholds to `return >= 0.25`, `percentile <= 0.60` (#9f7ab4a)
- Renamed CSV column to `price_percentile` for clarity (#26326e7)

## [0.5.6] - 2026-05-09

### Changed

- Removed `last`, `updated`, and `dte` columns from CSV output for cleaner reports (#42ce5c8)
- Cleaned up internal logic and simplified option pipeline implementation (#332ffd9)
- Increased strike percentage minimum to `0.5` for safer put selection (#b81cff8)
- Adjusted rate of return bounds in put score calculation (#1cf3794)

## [0.5.5] - 2026-05-05

### Added

- Strike percentile calculation with storage in SQLite (#c74080e)
- Put scoring function with configurable weights and unit tests (#c74080e)
- Strike percentile and put score wired into CSV output (#a68f535)

## [0.5.4] - 2026-02-07

### Added

- Price percentile calculation and persistent storage (#2a8136d)

## [0.5.3] - 2026-01-01

### Changed

- Added caching for option expiration data in Tiger API requester (#48cdd7d)

## [0.5.2] - 2025-12-20

### Changed

- Added option chain filtering configuration and logic (#2cf4223)
- Enhanced trading days calculation and adjusted strike range logic (#4cec18a)

## [0.5.1] - 2025-12-12

### Changed

- Updated safety range calculation in option chain retrieval (#5469046)
- Moved period calculation outside loop and added timezone configuration (#a073361)

## [0.5.0] - 2025-11-29

### Added

- Calculate max drop for both 5-day and 20-day periods (#99a7762)

### Changed

- Refactored database table creation and code structure (#83bd362)

## [0.4.0] - 2025-10-03

### Changed

- Replaced ATR with max drop to favour stocks with less frequent drops (#6dce368)
- Improved EMA calculation (#9246937)

### Fixed

- Fixed `max_drop` unique index constraint (#199d460)

## [0.3.0] - 2025-09-17

### Added

- Filter out low-quality option chains (wide spreads, missing data) (#caae129)
- Underlying price support in option chain queries (#90aa1fa)

### Changed

- Migrated from MarketData to Tiger OpenAPI for options chain data (#1a3cdf4, #b9f3923, #8d0a255)

### Fixed

- Formatted numeric values to three decimal places (#2dc0333)

## [0.2.0] - 2025-09-09

### Added

- Tiger OpenAPI integration with RSA key authentication (#bae6fce, #8d0a255)

### Fixed

- Fixed Tiger RSA key encoding (#55c438b)

## [0.1.0] - 2025-07-05

### Added

- Sharpe ratio calculation and persistent storage (#36243f2)

### Fixed

- Improved Sharpe ratio calculation and reporting (#7618f47)

## [0.0.3] - 2024-10-29

### Changed

- Switched from absolute true range to ratio-based calculation (#eca9ee8, #23b7844)

## [0.0.2] - 2024-10-22

### Added

- Dockerfile for containerised builds (#33811ec)
- Publish option chain results to Telegram channel (#32e635a)
- Upload reports to Dropbox (#0c845cf)
- Cloud Run job configuration (`job.yaml`) and `perform-all` mode (#2c65d09)

## [0.0.1] - 2024-10-13

### Added

- Initial implementation: pull stock quotes, calculate rate of return, compute ATR (#8249c7b, #414a7fc, #c3f311c)
- SQLite storage for candles and option strikes (#8afd875, #97b95fd)
- Symbol chunking for batched API requests (#515239c)
- Option chain retrieval based on ATR ranges (#28e804c)

[0.7.0]: https://github.com/compare/v0.6.2...v0.7.0
[Unreleased]: https://github.com/compare/v0.7.0...HEAD
[0.6.0]: https://github.com/compare/v0.5.6...v0.6.0
[0.5.6]: https://github.com/compare/v0.5.5...v0.5.6
[0.5.5]: https://github.com/compare/v0.5.4...v0.5.5
[0.5.4]: https://github.com/compare/v0.5.3...v0.5.4
[0.5.3]: https://github.com/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/compare/v0.0.3...v0.1.0
[0.0.3]: https://github.com/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/releases/tag/v0.0.1
