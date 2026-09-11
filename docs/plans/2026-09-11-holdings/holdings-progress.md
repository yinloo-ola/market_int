# Progress: 2026-09-11-holdings

Design: docs/plans/2026-09-11-holdings/holdings-design.md
Branch: 2026-09-11-holdings
Setup: done
Started: 2026-09-11T17:08:21Z
Last updated: 2026-09-11T17:20:00Z
Feature phase: implementing (1/5)

## Requirements
| # | Done | Requirement | Per-req ceremony | Commit |
|---|------|-------------|------------------|--------|
| 1 | ✅ | Core holdings model + pace math | — | 71193ff |
| 2 | ✅ | Per-user holdings document store | — | 6e28088 |
| 3 | ⬜ | Holdings CRUD API behind the Firebase gate | — | — |
| 4 | ⬜ | Mark-to-market refresh via Tiger | — | — |
| 5 | ⬜ | Frontend holdings panel (variant B) | ⏸ tests · ⏸ full · 🔎 inline | — |

## Execution summary
| R# | Requirement | How it was built | Deviated? |
|----|-------------|------------------|-----------|
| 1 | Core holdings model + pace math | `crates/core/src/holdings.rs`: `Holding`/`Mark` + `view()` computing P&L, working-day elapsed/total (expiry-inclusive), 1-day-floor target, `pace_met` (needs a mark); `validate()` returns plain `Result<(), String>`. AppState gained `holdings_dir` + `mark_fetcher` plumbing so the suite compiles while the E2E stays red. | Core types carry no serde derives (chrono has no serde feature; the webapp document layer owns JSON shapes, matching the result-doc precedent). |
| 2 | Per-user holdings document store | `webapp/holdings.rs`: `HoldingsDocument` (schema-versioned) at `<holdings_dir>/<uid>.json`; uid filename sanitized (alnum/`-`/`_` only), missing/corrupt file reads as empty, atomic temp+fsync+rename writes. Chrono gained the `serde` feature so dates round-trip as RFC3339/ISO strings. | Enabling the chrono `serde` feature (workspace Cargo.toml) — not a new dependency, but a build change worth noting. |
| 3 | | | |
| 4 | | | |
| 5 | | | |

## Code digest

<!-- Written once, after the feature review passes; never back-filled per requirement. -->

### Summary
### Flow
Spine
  <entry point> -> [R1] <step> -> [R2] <step> -> <outcome>
Branches
  <condition> -> <outcome>   [R2]
  <changed behavior>   was: <previous behavior>
Side effects
  reads: <what>   writes: <what>
### Gotchas
### Key files
