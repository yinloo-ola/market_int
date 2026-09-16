# Wheel holdings — covered calls, share lots, and cash on the holdings ledger

Status: approved design (brainstorm 2026-09-16/17; UI settled by prototype,
variant C chosen by the human). Executor builds from this doc.

## At a glance

The holdings ledger today tracks only open sold puts. This feature extends it
to the full wheel: **sold covered calls, share lots from assignments, and the
cash balance available for new puts**, all in the same per-user JSON ledger on
GCS. One refresh pass marks all three kinds from the Tiger quotes it already
fetches (one underlying quote per symbol — lots need no extra API calls). The
UI is the prototyped variant C: a summary rail (cash / wheel stats / lots)
beside one merged urgency list of puts and calls, with every dialog anchored
inline under the position that opened it.

### Key decisions

- Sibling arrays (`positions` + `calls` + `lots`) in one document, not a
  tagged position enum — concrete typing; old documents parse unchanged.
  *(rejected: tagged `Position::Put|Call|Lot` single array — fields barely
  overlap and every consumer match-exhausts)*
- Schema stays **v1**: additive `#[serde(default)]` fields only, nothing
  migrates (R6 `underlying_price` precedent). *(rejected: v2 bump — zero
  migration to perform, two versions to handle)*
- Mark fetcher seam returns `MarkBatch { marks, spots }` — the per-symbol
  underlying map it already builds; lots price from `spots`, option chain
  queries gain a `side` (calls query `OptionChainSide::Call`, which the Tiger
  client already supports). *(rejected: lots as pseudo-MarkRequests with
  `mid = spot` — overloads "mid" and forces fake strikes onto lots)*
- Wheel transitions are **single-rewrite server mutations**: assignment =
  lot creation + put removal in one `POST`; called-away = call removal + FIFO
  lot reduction in one `POST`. *(rejected: frontend-orchestrated multi-call
  flows — half-applied states on failure)*
- No coverage enforcement (Q8): a call may exceed held shares; coverage is
  displayed per lot. No closed-position history (Q7). No call candidate
  scanner (Q1). Cash is manual, never the Tiger account API (Q11).
- UI vocabulary: **Sell put / Sell call / Record lot**; realized P&L is a
  client-side preview in the close dialog only — nothing is persisted (Q7).

### Requirements overview

| R# | Requirement in one line | Risk |
|----|--------------------------|------|
| R1 | `CallHolding` with pace view delegating to the shared put math | — |
| R2 | `ShareLot` + lot view (value, P&L, capacity, covered) + spot mark | — |
| R3 | Cash reserve/free math (puts-only reserve) | — |
| R4 | Ledger document v1 extension, additive serde defaults | ⚠ production-risk |
| R5 | `MarkBatch` seam: `side` on option requests + spot map for lots | ⚠ production-risk |
| R6 | API: GET extended, POST `kind`, PATCH cash, DELETE everywhere, cap 100 | ⚠ production-risk |
| R7 | One refresh marks puts + calls (chain per side) + lots (spot) | ⚠ production-risk |
| R8 | Assignment: lot creation with `assigned_from` removes the put atomically | ⚠ production-risk |
| R9 | Called-away: single-rewrite FIFO lot reduction; uncovered → warning | ⚠ production-risk |
| R10 | Frontend variant-C panel (rail, merged list, inline panels, forms) | — |
| R11 | Smoke lane covers the new panel | — |

## Requirements

### R1: Call ledger type with shared pace math

`crates/core/src/holdings.rs` gains `CallHolding` — the same fields and serde
shape as `Holding` (id, symbol, strike, expiry, premium, contracts, sold,
mark) — with `validate()` applying the identical rules and `view(today)`
returning the same `HoldingView`. The pace computation (working days, 1-day
floor, per-day pace, `pace_met`) exists **once**: both `Holding::view` and
`CallHolding::view` delegate to a shared internal function. The ITM danger
direction (spot above strike for calls) is a *rendering* concern; the view's
`spot_pct_vs_strike` formula is unchanged.

**Acceptance criteria**
- Given a `CallHolding` and a `Holding` with identical field values, When both
  `view(today)`, Then every field of the two `HoldingView`s is equal
  (pinning assertion — one pace implementation, two callers).
- Given expiry ≤ sold, or span > 730 days, or premium ≤ 0, or strike ≤ 0, or
  zero contracts, or a blank symbol, When `validate()`, Then it errors.
- Given no mark, When viewed, Then `pace_met` is false and the P&L fields are
  `None`, while `days_elapsed`/`days_total`/`target_pct` are still computed.

### Checkpoints: none
### Review: skip

### R2: Share lot type and view

`crates/core/src/holdings.rs` gains `ShareLot { id, symbol, shares: u32,
basis_per_share: f64, acquired: NaiveDate, mark: Option<SpotMark> }` and
`SpotMark { spot: f64, as_of: DateTime<Utc> }`. `ShareLot::view(today,
covered_contracts)` returns a lot view with: value (`spot × shares`), P&L
dollars and percent versus total basis, `capacity = floor(shares / 100)`,
covered count (passed in — it derives from the calls array), and the spot with
its `as_of` timestamp. Unpriced lots report `None` P&L/value but still compute
capacity. `validate()` rejects a blank symbol, zero shares, or non-positive
basis. Structural validation only — future `acquired` dates are rejected
handler-side (R6), matching how `sold` is handled today.

**Acceptance criteria**
- Given 200 shares, basis $349.00, spot $344.20, covered 2, When viewed, Then
  value = $68,840, P&L = −$960, P&L% = −960/69,800, capacity = 2, covered = 2.
- Given no `SpotMark`, When viewed, Then value/P&L are `None` and capacity is
  still `floor(shares / 100)`.
- Given shares = 150, When viewed, Then capacity = 1 (floor, not round).
- Given blank symbol, zero shares, or basis ≤ 0, When `validate()`, Then it
  errors.

### Checkpoints: none
### Review: skip

### R3: Cash reserve and free-cash math

Pure functions in core: `reserved_cash(puts) = Σ strike × 100 × contracts`
over open puts; `free_cash(cash, puts) = cash − reserved_cash(puts)` (may be
negative — displayed honestly). Calls and lots never reserve (Q20,
cash-secured assumption confirmed Q11).

**Acceptance criteria**
- Given open puts strikes 420×1, 350×2, 230×1 and cash $148,000, Then
  reserved = $135,000 and free = $13,000.
- Given the same puts plus any calls and lots, Then reserved is unchanged.
- Given cash $10,000 with $135,000 reserved, Then free = −$125,000 (no
  clamping).

### Checkpoints: none
### Review: skip

### R4: Ledger document v1 extension

`crates/webapp/src/holdings.rs`: `HoldingsDocument` gains `calls:
Vec<CallHolding>`, `lots: Vec<ShareLot>`, `cash: Option<f64>` — each with
`#[serde(default)]`. `LEDGER_SCHEMA_VERSION` stays `1` (Q16). Read/write
behavior is otherwise unchanged (retry-once parse, atomic write with
per-process temp sequence, corrupt → empty with warning).

**Acceptance criteria**
- Given a pre-existing ledger JSON containing only `schema_version` and
  `positions`, When `read_ledger`, Then calls and lots are empty, cash is
  `None`, and the positions round-trip intact.
- Given a document with all four collections set, When written and re-read,
  Then every field of every entry survives (lossless round-trip).
- Given a corrupt file, When read twice within the retry window, Then the
  result is an empty ledger with a warning, never an error to the caller.

### Checkpoints: none
### Review: skip

### Production-risk notes

Schema/serde compatibility: old per-user documents on GCS must keep loading
(defaults only, version stays 1). The whole ledger is rewritten on every
mutation — the additive rule is what keeps existing files readable after
deploy.

### R5: Mark fetcher seam — side plus spot map

`MarkRequest` gains `side: Side` (`Put` | `Call`). The seam becomes
`Fn(&[MarkRequest], &[String]) -> MarkBatch` where the second argument lists
lot symbols and `MarkBatch { marks: Vec<MarkResult>, spots:
BTreeMap<String, f64> }` exposes the per-symbol underlying closes. The
production fetcher: one kline pass over the union of both symbol sets (one
quote per unique symbol), one degenerate chain query per option request using
the requested `OptionChainSide` (`Call` for calls — the Tiger client already
supports it), `marks[].underlying` carrying that symbol's close. Chain
queries are never issued for lot symbols; their prices travel in `spots`.

**Acceptance criteria**
- Given one put request, one call request, and lot symbol "LOFA" with no
  options, When the handler prepares the fetch, Then the option requests
  carry sides `Put` and `Call`, "LOFA" appears in the lot-symbol list, and
  LOFA is not among the chain-query requests.
- Given a scripted fetcher, When the handler merges a `MarkBatch`, Then each
  lot whose symbol is in `spots` receives `SpotMark { spot, as_of: now }` and
  each option mark lands by id.
- Given a lot symbol absent from `spots`, When merged, Then that lot is
  reported stale with a reason and keeps its previous `SpotMark`.

### Checkpoints: none
### Review: skip

### Production-risk notes

External API: this changes which `OptionChainSide` the production fetcher
requests for call positions (new code path — the call side exists in the
Tiger client but was never exercised by holdings) and adds lot symbols to the
kline pass. The scripted-seam test suite must cover call-side requests before
deploy.

### R6: API surface — kinds, cash, delete-everywhere, combined cap

All routes stay behind the existing Firebase gate. `GET /api/holdings`
returns `{ schema_version, positions, calls, lots, cash, cash_reserved,
cash_free }` where option entries carry server-computed `HoldingView`s, lots
carry lot views (covered counts derived from `calls`), and the cash numbers
come from R3 (`cash` is `null` until first set; `cash_free` is then also
`null` while `cash_reserved` still derives from open puts). `POST /api/holdings` gains an optional `kind` (`"put"` default
| `"call"` | `"lot"`), validating per kind: options exactly as today (expiry
> sold, sold ≤ today ET, positive strike/premium/whole contracts); lots
require non-blank symbol, shares ≥ 1, basis > 0, acquired ≤ today ET.
`POST /api/holdings` with `kind: "lot"` may also carry `assigned_from:
<put id>` (R8). `PATCH /api/holdings/cash` with `{ cash: number ≥ 0 }` sets
the balance and returns `{ cash, cash_reserved, cash_free }`. `DELETE
/api/holdings/{id}` searches positions, then calls, then lots. The
`MAX_POSITIONS_PER_LEDGER = 100` bound counts entries across all three
arrays combined (Q18). Server-generated ids remain unique across arrays.

**Acceptance criteria**
- Given a put-only POST body (no `kind`), When submitted, Then it behaves
  exactly as today (backward compatible) and the entry lands in `positions`.
- Given a `kind: "call"` body, When submitted, Then 201 returns the call with
  its computed view and `GET` lists it under `calls`.
- Given `kind: "lot"` with valid fields, When submitted, Then 201 and the lot
  appears in `lots` unpriced.
- Given a future `sold`/`acquired` date, fractional/zero contracts, or
  non-positive strike/premium/basis, When submitted, Then 400 and the ledger
  is not written.
- Given 100 combined entries, When any kind is added, Then 400 with the
  existing "maximum" message.
- Given `PATCH cash` of 150,000, When `GET` follows, Then cash, reserved, and
  free reflect the new balance; given negative or missing cash, Then 400.
- Given DELETE of a call id, Then it is removed from `calls` (a DELETE for an
  id in no array is 404 with no write).

### Checkpoints: none
### Review: skip

### Production-risk notes

API surface growth on the authed router: every new route shape rides the same
gate; the cap change alters a documented rejection boundary (100 per array →
100 combined). Existing clients (the currently-deployed panel) only use
`kind`-less PUTs and DELETEs — their behavior is pinned by criteria above.

### R7: One refresh marks puts, calls, and lots

`POST /api/holdings/refresh` builds option `MarkRequest`s from positions and
calls (side per kind) plus the lot-symbol list, calls the fetcher once, then
re-reads the ledger and merges by id (existing pattern): option marks into
positions/calls, `spots` into lots as `SpotMark`s stamped `now`. Per-position
failure semantics are unchanged — one option's failure is stale-not-error
with its previous mark kept; a lot whose symbol is missing from `spots` is
stale with a reason and keeps its previous spot. The response reports ok/stale
across all three kinds.

**Acceptance criteria**
- Given seeded put + call + lot and a scripted `MarkBatch` (mid for both
  options, spot for the lot symbol), When refreshed, Then 200 with all three
  in `ok`, and the persisted document holds the new mid(s) and `SpotMark`.
- Given one option's fetch errors, When refreshed, Then that entry is stale
  with its previous mark untouched while the others update.
- Given a lot whose symbol is absent from `spots`, When refreshed, Then that
  lot is stale, its previous `SpotMark` (if any) untouched.
- Given a position added while the fetch was in flight, When merging, Then it
  survives unclobbered (re-read merge by id).

### Checkpoints: none
### Review: skip

### Production-risk notes

External API + write concurrency: the refresh re-read/merge pattern is
load-bearing; extending it to three arrays must not reintroduce the
write-back-pre-call-snapshot hazard (see docs/lessons.md).

### R8: Assignment — lot creation removes the put atomically

`POST /api/holdings` with `kind: "lot"` and `assigned_from: <put id>` performs
one read-modify-write that records the lot **and** removes the referenced put
(Q2/Q19: the put disappears only when the lot is recorded; cancelling the
client-side form means no request is sent and the put remains). Unknown
`assigned_from` → 404 with no write. Without `assigned_from` it is a plain
lot add.

**Acceptance criteria**
- Given an open put and a valid lot body with `assigned_from`, When
  submitted, Then 201 returns the lot and `GET` shows the put gone and the
  lot present — one document rewrite.
- Given `assigned_from` naming no existing put, When submitted, Then 404 and
  the ledger is byte-unchanged.
- Given the same body without `assigned_from`, When submitted, Then the put
  (if any) is untouched.

### Checkpoints: none
### Review: skip

### Production-risk notes

Write concurrency: this is the first mutation that touches two collections in
one rewrite. It must complete within the existing fast read-modify-write
(no external calls inside the lock; re-read before write per the refresh
precedent).

### R9: Called away — single-rewrite FIFO lot reduction

`POST /api/holdings/called-away` with `{ call_id }` removes the call and, in
the same rewrite, reduces the covering lot by `contracts × 100` shares (Q12):
candidates are lots of the same symbol with `shares ≥ need`, choosing the
**earliest `acquired`** (ties broken by id for determinism — Q14); a reduced
lot reaching 0 shares is removed. No covering lot → 200 with `{ called_away:
true, reduced: false, reason }` and the call still removed (Q15). Unknown
`call_id` → 404 with no write.

**Acceptance criteria**
- Given a ×1 call on GOOG and GOOG lots of 200 shares (acquired Sep 1) and
  100 shares (acquired Sep 5), When called-away, Then the Sep 1 lot drops to
  100 shares (FIFO), the call is gone, and the response says
  `reduced: true`.
- Given the two lots share an acquired date, Then the tie breaks by id
  deterministically.
- Given the reduction empties the lot, Then the lot is removed from the
  document.
- Given no lot of the symbol covers `contracts × 100`, When called-away, Then
  200 with `reduced: false` plus reason, the call still removed, lots
  untouched.
- Given an unknown `call_id`, Then 404 and the ledger is byte-unchanged.

### Checkpoints: none
### Review: skip

### Production-risk notes

Write concurrency: same single-rewrite rule as R8 — removal and reduction are
one document write, never two requests the frontend stitches together.

### R10: Frontend — variant C panel

Rewrite `crates/webapp/frontend/src/components/HoldingsPanel.jsx` to the
prototyped variant C (source: uncommitted prototype
`frontend/src/prototypes/holdings-panel-proto.jsx` + entry — capture on a
throwaway branch at finalizing). Structure: sticky rail (editable cash strip
→ PATCH via R6; wheel stats; lot rows with last price + age, bought price,
P&L $ and %), and one merged urgency list across puts and calls — kind chip,
P&L %, pace bar with target, status chips (`buy back?` on pace-met; `ITM —
called away?` when a call's spot is above its strike), full stats line (sold
at / now mid + age / spot vs strike, danger-colored in the kind's ITM
direction / close captures), close panels rendered inline directly beneath
the position that opened them, and forms anchored in their sections: Sell put
(under Puts head), Sell call (free fields, under Covered calls head and in
the toolbar), Record lot (under Shares head), plus the lot-anchored
`sell call…` prefill (`contracts = floor(shares/100)`, editable down) and the
assignment prefill (shares = contracts×100, basis = strike − premium, shown
after choosing "assigned" in a put's close panel; cancelling leaves the put).
The cash editor PATCHes R6 and the strip re-renders from the response's
derived numbers. Below 900px the rail stacks above the list (user decision);
the list keeps its stacked row layout. The server owns every number — the
only client-side computation remains the realized-P&L preview inside the
close dialog.

**Acceptance criteria**
- Given the panel open, When any position's `close…` is clicked, Then the
  close panel renders directly beneath that position (same slot), and only
  one panel exists in the DOM.
- Given a put close dialog confirmed as `assigned` with a price, Then the
  prefilled lot form shows shares = contracts×100 and basis = strike −
  premium; recording it POSTs `kind:"lot"` with `assigned_from`.
- Given a lot card's `sell call…`, Then the form is prefilled with `contracts
  = floor(shares/100)` (editable down) and submits `kind:"call"`.
- Given a cash edit saved, Then PATCH fires and the strip's reserved/free
  re-render from the response.
- Given cash never set (document `cash` is `null`), Then the strip shows a
  "set cash" affordance with reserved/free rendered as "—"; after the first
  PATCH the derived numbers appear.
- Given a call whose mark has spot above strike, Then the `ITM — called
  away?` chip shows and its vs-strike figure is danger-colored.
- Given viewport width < 900px, Then the rail stacks above the list and list
  rows use the stacked layout.
- Given any fetch failure, Then the existing flash/notice patterns report it
  without losing the panel state.

### Checkpoints: none
### Review: skip

### R11: Smoke lane coverage

Extend the DOM smoke lane (`npm run smoke`, happy-dom, built bundle) for the
new panel: the rail renders cash/reserved/free; merged list rows carry kind
chips and the stats line; the inline close panel appears under the clicked
position; the Sell put / Sell call forms render and validate before submit.
The scoring parity lane is untouched.

**Acceptance criteria**
- Given the built bundle, When the smoke lane runs, Then the new assertions
  pass alongside the existing 46 (no regression in expansion/tooltips/states/
  rescore/parity).

### Checkpoints: none
### Review: skip

## Production-risk areas

- **Ledger schema/serde compatibility (R4):** additive defaults only; version
  stays 1; existing GCS documents must load unchanged after deploy.
- **External API (R5, R7):** first production exercise of the call chain side
  and of lot symbols in the kline pass; no new endpoints or credentials.
- **Ledger write concurrency (R6, R8, R9):** all mutations remain single
  fast read-modify-writes with re-read-before-write; R8/R9 each touch two
  collections in one rewrite by design — never split across requests.
- **API boundary change (R6):** cap semantics move to combined-100; `kind`
  defaults preserve the deployed panel's request shapes.

## Setup

No new dependencies, no migrations, no seed data. The Tiger call-side chain
query uses the existing `OptionChainSide::Call` support (`make test-tiger
SYMBOLS="AAPL,MSFT"` probes the API). Verify setup with `cargo test`
(workspace) and `npm --prefix crates/webapp/frontend run smoke` after the
frontend build (`make webapp-frontend`).

## Approaches considered

- **Ledger shape — sibling arrays (chosen) vs tagged position enum:** the
  enum put three divergent shapes behind one match in every consumer; sibling
  arrays keep handlers concretely typed and old documents parsing with empty
  defaults.
- **Schema versioning — stay v1 (chosen) vs bump to v2:** nothing migrates
  under additive defaults; a bump would force dual-version handling for zero
  benefit.
- **Lot pricing — spot map in MarkBatch (chosen) vs pseudo-MarkRequests:**
  faking strikes/expiries so lots could ride the option-mark path overloads
  `mid` and complicates the production fetcher; the batch already had the
  per-symbol map internally.
- **Wheel transitions — server-atomic single POSTs (chosen) vs frontend-
  orchestrated DELETE+POST pairs:** paired calls could half-apply (call
  removed, lot not reduced); single-rewrite handlers keep every ledger state
  reachable and consistent.
- **Cash source — manual balance (chosen) vs Tiger account API:** a new
  external API surface plus broker-specific margin/settlement rules; the
  honest v1 is the one number only the user knows, with the reserve derived
  from data the ledger already holds.

## Architecture

Core owns pure types and math (`crates/core/src/holdings.rs`: Holding,
CallHolding, ShareLot, SpotMark, shared pace view, lot view, cash fns,
`apply_called_away`); the webapp owns JSON shapes, the ledger document, the
mark-fetcher seam, and the routes (`crates/webapp/src/holdings.rs`); the
frontend renders server-computed views and anchors interaction panels inline
(`HoldingsPanel.jsx`). Dependency direction unchanged — the CLI never links
this, the core never learns HTTP.

## Components

- `crates/core/src/holdings.rs` — R1, R2, R3 (+ shared pace fn refactor of
  `Holding::view`), and the pure FIFO `apply_called_away` helper behind R9.
- `crates/webapp/src/holdings.rs` — R4 document, R5 seam, R6–R9 routes and
  handlers, production fetcher side/map changes.
- `crates/webapp/frontend/src/components/HoldingsPanel.jsx` (+ `api.js` seam
  and `style.css` additions) — R10.
- `crates/webapp/frontend/src/smoke-entry.jsx` / smoke scripts — R11.
- Prototype reference (throwaway, uncommitted):
  `frontend/src/prototypes/holdings-panel-proto*.jsx`,
  `frontend/holdings-panel-proto.html`, plus the `proto` npm script.

## Data flow

Add/edit flows: panel form → POST/PATCH → single ledger rewrite → response
carries server-computed views → panel re-renders. Refresh: panel button →
POST refresh → handler builds option requests + lot symbols → one fetcher
call → re-read + merge by id → response with views + ok/stale → panel
re-renders, rail re-derives nothing (numbers arrive computed). Close flows:
bought-back/expired → DELETE id; assigned → close dialog reveals the prefilled
lot form → POST lot with `assigned_from`; called-away → POST called-away →
response states whether the lot was reduced (flash message says what
happened).

## Error handling

Existing patterns hold: requester-init failure is the only fatal outer case;
refresh failures are per-position stale entries with reasons and previous
marks kept; corrupt ledger reads degrade to empty with a warning after one
retry; 400s carry human-readable reasons and never write the ledger; 404 for
unknown ids with no write. New: `called-away` without a covering lot is a
200 outcome (not an error) reporting `reduced: false` with a reason — the
call is still removed, matching the prototype's UX.

## Testing

Pure-math suites in core for R1–R3 (including the R1 pinning test that
`CallHolding` and `Holding` views agree field-for-field, and FIFO
determinism for `apply_called_away`); document round-trip and old-shape
loading tests for R4; scripted-seam router tests for R5–R9 (no network —
the MarkFetcher seam scripts `MarkBatch`es; the enforced E2E below extends
the `feature_acceptance_goog_buy_back` precedent); DOM smoke assertions for
R10/R11 against the built bundle; parity lane untouched.

## Feature acceptance

- Given a fresh ledger, When the user PATCHes cash to $150,000, sells a GOOG
  350P ×2 @ $1.00 (sold 2 working days ago, expiry 5 working days out),
  refreshes with a scripted 0.50 mid / $344.20 spot, Then the put's card
  shows +50.0% vs target 40%, pace met, close captures $50.00, reserved
  $70,000, free $80,000.
- Given that put, When the user closes it as `assigned` at $340 and records
  the prefilled lot, Then the lot exists (200 sh GOOG, basis $349.00, today)
  and the put is gone from the ledger.
- Given that lot, When the user sells a ×2 call from it (strike 360) and
  refreshes with spot $370, Then the call shows the `ITM — called away?`
  chip and the lot reports covered 2/2.
- Given that call, When the user closes it as `called away`, Then the call
  is removed, the lot is reduced by 200 shares and removed at zero, and
  `GET /api/holdings` shows empty calls and lots with cash_free back at
  $150,000 — every intermediate state between these steps consistent
  (reserved/free re-derived, no orphan ids, one document per uid).

### Feature review: auto
