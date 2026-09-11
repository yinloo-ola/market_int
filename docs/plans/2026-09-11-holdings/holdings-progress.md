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
| 3 | ✅ | Holdings CRUD API behind the Firebase gate | — | 0b52070 |
| 4 | ✅ | Mark-to-market refresh via Tiger | — | d80bc30 |
| 5 | ✅ | Frontend holdings panel (variant B) | ⏸ tests · ⏸ full · 🔎 inline (user pre-approved all checkpoints 2026-09-11: no mid-slice stops, next stop is ship) | 8c106d0 |

## Execution summary
| R# | Requirement | How it was built | Deviated? |
|----|-------------|------------------|-----------|
| 1 | Core holdings model + pace math | `crates/core/src/holdings.rs`: `Holding`/`Mark` + `view()` computing P&L, working-day elapsed/total (expiry-inclusive), 1-day-floor target, `pace_met` (needs a mark); `validate()` returns plain `Result<(), String>`. AppState gained `holdings_dir` + `mark_fetcher` plumbing so the suite compiles while the E2E stays red. | Core types carry no serde derives (chrono has no serde feature; the webapp document layer owns JSON shapes, matching the result-doc precedent). |
| 2 | Per-user holdings document store | `webapp/holdings.rs`: `HoldingsDocument` (schema-versioned) at `<holdings_dir>/<uid>.json`; uid filename sanitized (alnum/`-`/`_` only), missing/corrupt file reads as empty, atomic temp+fsync+rename writes. Chrono gained the `serde` feature so dates round-trip as RFC3339/ISO strings. | Enabling the chrono `serde` feature (workspace Cargo.toml) — not a new dependency, but a build change worth noting. |
| 3 | Holdings CRUD API behind the Firebase gate | `GET/POST /api/holdings` + `DELETE /api/holdings/{id}` mounted inside `api::build_router` (auth-gated); uid from `VerifiedIdentity` only ("local" when auth disarmed); core `validate()` maps to 400-with-reason, unknown id 404, server-generated `h{millis}-{seq}` ids. | — |
| 4 | Mark-to-market refresh via Tiger | `POST /api/holdings/refresh`: ledger positions → scripted/live fetcher seam on `spawn_blocking`; live path builds one Tiger requester, one underlying kline per symbol, then degenerate `(strike, strike)` put-chain queries (OI min 0); ok → mark+as_of, per-position failure/no-data/non-positive-mid → stale with previous mark kept, HTTP 200 always. | — |
| 5 | Frontend holdings panel (variant B) | `components/HoldingsPanel.jsx` distilled from the approved prototype: cards render the server view verbatim (no client pace math), sorted most-ahead-of-pace first; outcome dialog computes only the realized-P&L preview it is typing into. Production "Holdings" tab in the strip (rendered in both branches so the strip persists), `api.js` wrappers, prototype file/wiring/CSS removed (preserved in branch history per the capture rule). Smoke lane: +10 assertions (35/35). | — |

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
