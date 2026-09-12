# Progress: 2026-09-11-holdings

Design: docs/plans/2026-09-11-holdings/holdings-design.md
Branch: 2026-09-11-holdings
Setup: done
Started: 2026-09-11T17:08:21Z
Last updated: 2026-09-11T18:25:00Z
Feature phase: done

## Requirements
| # | Done | Requirement | Per-req ceremony | Commit |
|---|------|-------------|------------------|--------|
| 1 | ✅ | Core holdings model + pace math | — | 71193ff |
| 2 | ✅ | Per-user holdings document store | — | 6e28088 |
| 3 | ✅ | Holdings CRUD API behind the Firebase gate | — | 0b52070 |
| 4 | ✅ | Mark-to-market refresh via Tiger | — | d80bc30 |
| 5 | ✅ | Frontend holdings panel (variant B) | ⏸ tests · ⏸ full · 🔎 inline (user pre-approved all checkpoints 2026-09-11: no mid-slice stops, next stop is ship) | 8c106d0 |
| 6 | ✅ | Underlying spot price on the card | — | fb0bb3d |

## Execution summary
| R# | Requirement | How it was built | Deviated? |
|----|-------------|------------------|-----------|
| 1 | Core holdings model + pace math | `crates/core/src/holdings.rs`: `Holding`/`Mark` + `view()` computing P&L, working-day elapsed/total (expiry-inclusive), 1-day-floor target, `pace_met` (needs a mark); `validate()` returns plain `Result<(), String>`. AppState gained `holdings_dir` + `mark_fetcher` plumbing so the suite compiles while the E2E stays red. | Core types carry no serde derives (chrono has no serde feature; the webapp document layer owns JSON shapes, matching the result-doc precedent). — superseded by R2: chrono serde feature enabled and derives live on core types. |
| 2 | Per-user holdings document store | `webapp/holdings.rs`: `HoldingsDocument` (schema-versioned) at `<holdings_dir>/<uid>.json`; uid filename sanitized (alnum/`-`/`_` only), missing/corrupt file reads as empty, atomic temp+fsync+rename writes. Chrono gained the `serde` feature so dates round-trip as RFC3339/ISO strings. | Enabling the chrono `serde` feature (workspace Cargo.toml) — not a new dependency, but a build change worth noting. |
| 3 | Holdings CRUD API behind the Firebase gate | `GET/POST /api/holdings` + `DELETE /api/holdings/{id}` mounted inside `api::build_router` (auth-gated); uid from `VerifiedIdentity` only ("local" when auth disarmed); core `validate()` maps to 400-with-reason, unknown id 404, server-generated `h{millis}-{seq}` ids. | — |
| 4 | Mark-to-market refresh via Tiger | `POST /api/holdings/refresh`: ledger positions → scripted/live fetcher seam on `spawn_blocking`; live path builds one Tiger requester, one underlying kline per symbol, then degenerate `(strike, strike)` put-chain queries (OI min 0); ok → mark+as_of, per-position failure/no-data/non-positive-mid → stale with previous mark kept, HTTP 200 always. | — |
| 5 | Frontend holdings panel (variant B) | `components/HoldingsPanel.jsx` distilled from the approved prototype: cards render the server view verbatim (no client pace math), sorted most-ahead-of-pace first; outcome dialog computes only the realized-P&L preview it is typing into. Production "Holdings" tab in the strip (rendered in both branches so the strip persists), `api.js` wrappers, prototype file/wiring/CSS removed (preserved in branch history per the capture rule). Smoke lane: +10 assertions (35/35). | — |
| 6 | Underlying spot price on the card | The daily kline close the refresh already fetched (moneyness filter) is stored as `mark.underlying_price` (serde-defaulted optional — old ledgers load unchanged) and surfaces as `view.spot_pct_vs_strike`; the card's stat strip is now 4 cells with the SPOT % danger-colored when the stock is below the strike. | — |

## Code digest

### Summary
The webapp now tracks the puts you actually sold: a per-user "Holdings" tab
where each open position renders as a decision card — sold-at vs current
Tiger mid vs close-captures dollars — against a per-working-day pace target
with a 1-day floor, flagging "buy back?" when decay is ahead of schedule.
The ledger is one schema-versioned JSON file per verified Firebase UID on
the durable GCS mount; the server computes every decision number and the
panel renders views verbatim.

### Flow
Spine
  POST /api/holdings -> [R3] validate (core + future-sold + whole contracts + 100-cap) -> [R2] atomic ledger write -> 201 position
  GET /api/holdings -> [R2] read_ledger (retry-once) -> [R1] Holding::view(today_et) -> positions + views
  POST /api/holdings/refresh -> [R4] MarkFetcher on spawn_blocking (Requester -> kline/symbol -> degenerate put-chain query) -> re-read + merge marks by id -> [R2] write -> ok/stale per position
  [R6] the kline close rides the same results -> mark.underlying_price -> SPOT card cell with % vs strike
  DELETE /api/holdings/{id} -> [R3] retain -> 404 or write
  HoldingsPanel -> [R5] cards render server views -> outcome dialog -> DELETE -> refetch
Branches
  invalid payload / future sold / fractional contracts / overfull ledger / overlong span -> 400, no write   [R3]
  unknown id -> 404, no write   [R3]
  fetch failure / no chain data / mid <= 0 -> stale, previous mark kept, HTTP 200   [R4]
  corrupt ledger file -> retry once -> empty + warning   [R2]
  no mark -> pace_met false, em-dash cells   [R1]
  armed gate + no token -> 401; auth disarmed -> shared "local" ledger   [R3]
Side effects
  reads/writes: /data/webapp/holdings/<uid>.json (GCS FUSE in prod)
  network: Tiger daily-kline + put-chain queries per refresh
### Gotchas
- Residual race: two simultaneous fast mutations (add vs delete) for one uid
  are last-writer-wins — refresh (the long case) re-reads and merges, so it
  can no longer clobber; reviewer-flagged, accepted for a single-user tool.
- Working days ignore market holidays (documented, same as market.rs).
- pace_per_day_* is computed and stored in the API view but not rendered on
  the card (user decision — kept for future views).
### Key files
- `crates/core/src/holdings.rs` — the whole decision math (1-day-floor target, working days, validation) as pure functions.
- `crates/webapp/src/holdings.rs` — ledger document store + the four routes + Tiger fetcher seam; the feature's center of gravity.
- `crates/webapp/src/api.rs` — route registration inside the auth gate; AppState gained holdings_dir + mark_fetcher seams.
- `crates/webapp/frontend/src/components/HoldingsPanel.jsx` — variant-B cards distilled from the approved prototype; server views verbatim.
- `crates/webapp/frontend/src/smoke-entry.jsx` — 18 holdings assertions (43 total) incl. the reference-example card values.
