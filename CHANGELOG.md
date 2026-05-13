# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/compare/v0.6.0...HEAD
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
