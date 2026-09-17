# Review packet: wheel-holdings — feature review

## Commits
9a669a1 frontend: smoke lane covers the variant-C wheel panel (R11)
d5ede1b frontend: variant-C wheel panel — rail, merged list, inline panels (R10)
1d23bbc webapp: called-away single-rewrite FIFO lot reduction (R9)
ec08725 webapp: assignment records lot and removes put in one rewrite (R8)
dfb6ea6 webapp: refresh pins three-kind marking + mid-flight add survival (R7)
25bcb78 webapp: kind-dispatched POST, PATCH cash, delete-everywhere, combined cap (R6)
d5ade12 webapp: MarkBatch seam — side on option requests, spot map for lots (R5)
93430ff webapp: ledger document gains calls/lots/cash, additive serde defaults (R4)
c1d226a core: reserved_cash/free_cash — puts-only reserve math (R3)
26554a4 core: ShareLot/SpotMark/LotView — lot value, P&L, capacity (R2)
4de95f4 core: CallHolding with shared pace math (R1)

## Changed files
 crates/core/src/holdings.rs                        |  626 +++++++-
 crates/webapp/frontend/dist/assets/app.css         |    2 +-
 crates/webapp/frontend/dist/assets/app.js          |  208 +--
 crates/webapp/frontend/holdings-panel-proto.html   |   14 +
 crates/webapp/frontend/package.json                |    1 +
 crates/webapp/frontend/src/api.js                  |   28 +
 .../frontend/src/components/HoldingsPanel.jsx      | 1136 ++++++++++---
 .../src/prototypes/holdings-panel-proto-entry.jsx  |   45 +
 .../src/prototypes/holdings-panel-proto.jsx        | 1288 +++++++++++++++
 crates/webapp/frontend/src/smoke-entry.jsx         |  212 ++-
 crates/webapp/frontend/src/style.css               |  128 ++
 crates/webapp/src/api.rs                           |   19 +-
 crates/webapp/src/auth.rs                          |    7 +-
 crates/webapp/src/holdings.rs                      | 1691 ++++++++++++++++++--
 14 files changed, 4848 insertions(+), 557 deletions(-)

## Acceptance criteria (verbatim from the design doc)
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


## Feature acceptance (verbatim)
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


## Production-risk notes (verbatim, if any)
### Production-risk notes

Schema/serde compatibility: old per-user documents on GCS must keep loading
(defaults only, version stays 1). The whole ledger is rewritten on every
mutation — the additive rule is what keeps existing files readable after
deploy.

### Production-risk notes

External API: this changes which `OptionChainSide` the production fetcher
requests for call positions (new code path — the call side exists in the
Tiger client but was never exercised by holdings) and adds lot symbols to the
kline pass. The scripted-seam test suite must cover call-side requests before
deploy.

### Production-risk notes

API surface growth on the authed router: every new route shape rides the same
gate; the cap change alters a documented rejection boundary (100 per array →
100 combined). Existing clients (the currently-deployed panel) only use
`kind`-less PUTs and DELETEs — their behavior is pinned by criteria above.

### Production-risk notes

External API + write concurrency: the refresh re-read/merge pattern is
load-bearing; extending it to three arrays must not reintroduce the
write-back-pre-call-snapshot hazard (see docs/lessons.md).

### Production-risk notes

Write concurrency: this is the first mutation that touches two collections in
one rewrite. It must complete within the existing fast read-modify-write
(no external calls inside the lock; re-read before write per the refresh
precedent).

### Production-risk notes

Write concurrency: same single-rewrite rule as R8 — removal and reduction are
one document write, never two requests the frontend stitches together.


## Diff
diff --git a/crates/core/src/holdings.rs b/crates/core/src/holdings.rs
index 901b058..4869f84 100644
--- a/crates/core/src/holdings.rs
+++ b/crates/core/src/holdings.rs
@@ -42,6 +42,46 @@ pub struct Mark {
     pub underlying_price: Option<f64>,
 }
 
+/// One open short-covered-call position. Field-for-field the same shape as
+/// `Holding` (sibling arrays in one ledger document); the ITM danger
+/// direction (spot ABOVE strike for calls) is a rendering concern, never
+/// the math.
+#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
+pub struct CallHolding {
+    pub id: String,
+    pub symbol: String,
+    pub strike: f64,
+    pub expiry: NaiveDate,
+    pub premium: f64,
+    pub contracts: u32,
+    pub sold: NaiveDate,
+    /// Latest Tiger mid mark; `None` until the first refresh succeeds.
+    #[serde(default, skip_serializing_if = "Option::is_none")]
+    pub mark: Option<Mark>,
+}
+
+/// Shares held from an assignment — the lot a covered call is sold
+/// against. Priced from the underlying spot, never from an option chain.
+#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
+pub struct ShareLot {
+    pub id: String,
+    pub symbol: String,
+    pub shares: u32,
+    pub basis_per_share: f64,
+    pub acquired: NaiveDate,
+    /// Latest underlying spot; `None` until the first refresh succeeds.
+    #[serde(default, skip_serializing_if = "Option::is_none")]
+    pub mark: Option<SpotMark>,
+}
+
+/// The underlying spot quote a lot prices from, captured by the refresh
+/// that covered its symbol.
+#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
+pub struct SpotMark {
+    pub spot: f64,
+    pub as_of: DateTime<Utc>,
+}
+
 /// The close decision for one holding, as rendered on the card.
 /// `Option` fields are `None` exactly when no mark exists yet.
 #[derive(Debug, Clone, PartialEq, serde::Serialize)]
@@ -86,84 +126,265 @@ fn is_weekend(d: NaiveDate) -> bool {
     matches!(d.weekday(), chrono::Weekday::Sat | chrono::Weekday::Sun)
 }
 
+/// Cash reserved by open short puts: Σ strike × 100 × contracts. Calls
+/// never reserve (they're covered by held shares) and lots never reserve —
+/// the cash-secured assumption lives entirely in the puts book (R3).
+pub fn reserved_cash(puts: &[Holding]) -> f64 {
+    puts.iter()
+        .map(|p| p.strike * 100.0 * p.contracts as f64)
+        .sum()
+}
+
+/// `cash − reserved_cash(puts)`. Negative is real (margin used elsewhere)
+/// and is displayed honestly, never clamped.
+pub fn free_cash(cash: f64, puts: &[Holding]) -> f64 {
+    cash - reserved_cash(puts)
+}
+
+/// R9: the called-away FIFO reduction. Among `lots` of `symbol` that can
+/// cover `contracts × 100` shares, the **earliest `acquired`** is reduced
+/// (ties broken by id for determinism); a lot reduced to 0 shares is
+/// dropped. `None` = no single lot covers the need — the caller still
+/// removes the call, it just doesn't reduce shares. Pure so the route is
+/// one read-modify-write.
+pub fn apply_called_away(lots: &[ShareLot], symbol: &str, contracts: u32) -> Option<Vec<ShareLot>> {
+    let need = contracts as u64 * 100;
+    let chosen = lots
+        .iter()
+        .filter(|l| l.symbol == symbol && l.shares as u64 >= need)
+        .min_by(|a, b| (a.acquired, &a.id).cmp(&(b.acquired, &b.id)))?;
+    Some(
+        lots.iter()
+            .map(|l| {
+                if l.id == chosen.id {
+                    let mut reduced = l.clone();
+                    reduced.shares -= need as u32;
+                    reduced
+                } else {
+                    l.clone()
+                }
+            })
+            .filter(|l| l.shares > 0)
+            .collect(),
+    )
+}
+
 impl Holding {
+    pub fn validate(&self) -> Result<(), String> {
+        validate_option_leg(
+            &self.symbol,
+            self.strike,
+            self.premium,
+            self.contracts,
+            self.sold,
+            self.expiry,
+        )
+    }
+
+    /// The close-decision view as of `today` (ET calendar date).
+    pub fn view(&self, today: NaiveDate) -> HoldingView {
+        pace_view(
+            self.strike,
+            self.premium,
+            self.contracts,
+            self.sold,
+            self.expiry,
+            self.mark.as_ref(),
+            today,
+        )
+    }
+}
+
+impl CallHolding {
+    pub fn validate(&self) -> Result<(), String> {
+        validate_option_leg(
+            &self.symbol,
+            self.strike,
+            self.premium,
+            self.contracts,
+            self.sold,
+            self.expiry,
+        )
+    }
+
+    /// The close-decision view as of `today` (ET calendar date).
+    pub fn view(&self, today: NaiveDate) -> HoldingView {
+        pace_view(
+            self.strike,
+            self.premium,
+            self.contracts,
+            self.sold,
+            self.expiry,
+            self.mark.as_ref(),
+            today,
+        )
+    }
+}
+
+/// The rendered lot row. `value`/P&L/spot need a spot mark; `capacity` and
+/// the caller-supplied `covered` count (it derives from the calls array —
+/// the lot can't see it) never do.
+#[derive(Debug, Clone, PartialEq, serde::Serialize)]
+pub struct LotView {
+    pub value: Option<f64>,
+    pub pl_dollars: Option<f64>,
+    pub pl_pct: Option<f64>,
+    /// `floor(shares / 100)` — how many covered calls the lot could back.
+    pub capacity: u32,
+    /// Covered-call contracts currently covering this lot (passed in).
+    pub covered: u32,
+    pub spot: Option<f64>,
+    pub spot_as_of: Option<DateTime<Utc>>,
+    /// Calendar days held, from `acquired` to the caller's `today`.
+    pub age_days: u32,
+}
+
+impl ShareLot {
+    /// Structural validation only — a future `acquired` date is rejected
+    /// handler-side, matching how `sold` is handled today.
     pub fn validate(&self) -> Result<(), String> {
         if self.symbol.trim().is_empty() {
             return Err("symbol is required".to_string());
         }
-        if !(self.strike.is_finite() && self.strike > 0.0) {
-            return Err("strike must be > 0".to_string());
-        }
-        if !(self.premium.is_finite() && self.premium > 0.0) {
-            return Err("premium must be > 0".to_string());
+        if self.shares == 0 {
+            return Err("shares must be at least 1".to_string());
         }
-        if self.contracts == 0 {
-            return Err("contracts must be at least 1".to_string());
-        }
-        if self.expiry <= self.sold {
-            return Err("expiry must be after the sell date".to_string());
-        }
-        // Span bound: no real put lives past ~2 years (LEAPS). Also a CPU
-        // guard — every view() walks the sold→expiry span per request.
-        if (self.expiry - self.sold).num_days() > MAX_HOLDING_SPAN_DAYS {
-            return Err(format!(
-                "expiry is more than {MAX_HOLDING_SPAN_DAYS} days out"
-            ));
+        if !(self.basis_per_share.is_finite() && self.basis_per_share > 0.0) {
+            return Err("basis must be > 0".to_string());
         }
         Ok(())
     }
 
-    /// The close-decision view as of `today` (ET calendar date).
-    pub fn view(&self, today: NaiveDate) -> HoldingView {
-        let days_total = working_days_after(self.sold, self.expiry);
-        let anchor = today.min(self.expiry);
-        let days_elapsed = working_days_after(self.sold, anchor).min(days_total);
-        // Day 0 earns a full day's target.
-        let target_pct = if days_total > 0 {
-            days_elapsed.max(1) as f64 / days_total as f64
-        } else {
-            0.0
-        };
-
+    /// The lot row as of `today`, covered by `covered_contracts` call
+    /// contracts.
+    pub fn view(&self, today: NaiveDate, covered_contracts: u32) -> LotView {
+        // u32 division floors — the contract is "floor(shares/100)".
+        let capacity = self.shares / 100;
+        let age_days = (today - self.acquired).num_days().max(0) as u32;
         let Some(mark) = &self.mark else {
-            return HoldingView {
+            return LotView {
+                value: None,
                 pl_dollars: None,
                 pl_pct: None,
-                pace_per_day_dollars: None,
-                pace_per_day_pct: None,
-                days_elapsed,
-                days_total,
-                target_pct,
-                pace_met: false,
-                spot_pct_vs_strike: None,
+                capacity,
+                covered: covered_contracts,
+                spot: None,
+                spot_as_of: None,
+                age_days,
             };
         };
-        let spot_pct_vs_strike = mark
-            .underlying_price
-            .map(|spot| (spot - self.strike) / self.strike);
-
-        let pl_per_share = self.premium - mark.mid;
-        let pl_dollars = pl_per_share * 100.0 * self.contracts as f64;
-        let pl_pct = pl_per_share / self.premium;
-        let (pace_per_day_dollars, pace_per_day_pct) = if days_elapsed > 0 {
-            (
-                Some(pl_dollars / days_elapsed as f64),
-                Some(pl_pct / days_elapsed as f64),
-            )
-        } else {
-            (None, None)
-        };
-        HoldingView {
+        let value = mark.spot * self.shares as f64;
+        let total_basis = self.basis_per_share * self.shares as f64;
+        let pl_dollars = value - total_basis;
+        LotView {
+            value: Some(value),
             pl_dollars: Some(pl_dollars),
-            pl_pct: Some(pl_pct),
-            pace_per_day_dollars,
-            pace_per_day_pct,
+            pl_pct: Some(pl_dollars / total_basis),
+            capacity,
+            covered: covered_contracts,
+            spot: Some(mark.spot),
+            spot_as_of: Some(mark.as_of),
+            age_days,
+        }
+    }
+}
+
+/// The contract rules both option kinds share — identical fields, identical
+/// bounds (R1: `CallHolding::validate` applies the identical rules).
+fn validate_option_leg(
+    symbol: &str,
+    strike: f64,
+    premium: f64,
+    contracts: u32,
+    sold: NaiveDate,
+    expiry: NaiveDate,
+) -> Result<(), String> {
+    if symbol.trim().is_empty() {
+        return Err("symbol is required".to_string());
+    }
+    if !(strike.is_finite() && strike > 0.0) {
+        return Err("strike must be > 0".to_string());
+    }
+    if !(premium.is_finite() && premium > 0.0) {
+        return Err("premium must be > 0".to_string());
+    }
+    if contracts == 0 {
+        return Err("contracts must be at least 1".to_string());
+    }
+    if expiry <= sold {
+        return Err("expiry must be after the sell date".to_string());
+    }
+    // Span bound: no real put lives past ~2 years (LEAPS). Also a CPU
+    // guard — every view() walks the sold→expiry span per request.
+    if (expiry - sold).num_days() > MAX_HOLDING_SPAN_DAYS {
+        return Err(format!(
+            "expiry is more than {MAX_HOLDING_SPAN_DAYS} days out"
+        ));
+    }
+    Ok(())
+}
+
+/// The pace computation exists once (R1): working days, the 1-day floor,
+/// per-day pace, `pace_met`. `Holding::view` and `CallHolding::view` both
+/// delegate; `spot_pct_vs_strike` keeps one formula for both — the danger
+/// direction (below strike for puts, above for calls) is rendering.
+fn pace_view(
+    strike: f64,
+    premium: f64,
+    contracts: u32,
+    sold: NaiveDate,
+    expiry: NaiveDate,
+    mark: Option<&Mark>,
+    today: NaiveDate,
+) -> HoldingView {
+    let days_total = working_days_after(sold, expiry);
+    let anchor = today.min(expiry);
+    let days_elapsed = working_days_after(sold, anchor).min(days_total);
+    // Day 0 earns a full day's target.
+    let target_pct = if days_total > 0 {
+        days_elapsed.max(1) as f64 / days_total as f64
+    } else {
+        0.0
+    };
+
+    let Some(mark) = mark else {
+        return HoldingView {
+            pl_dollars: None,
+            pl_pct: None,
+            pace_per_day_dollars: None,
+            pace_per_day_pct: None,
             days_elapsed,
             days_total,
             target_pct,
-            pace_met: pl_pct >= target_pct,
-            spot_pct_vs_strike,
-        }
+            pace_met: false,
+            spot_pct_vs_strike: None,
+        };
+    };
+    let spot_pct_vs_strike = mark
+        .underlying_price
+        .map(|spot| (spot - strike) / strike);
+
+    let pl_per_share = premium - mark.mid;
+    let pl_dollars = pl_per_share * 100.0 * contracts as f64;
+    let pl_pct = pl_per_share / premium;
+    let (pace_per_day_dollars, pace_per_day_pct) = if days_elapsed > 0 {
+        (
+            Some(pl_dollars / days_elapsed as f64),
+            Some(pl_pct / days_elapsed as f64),
+        )
+    } else {
+        (None, None)
+    };
+    HoldingView {
+        pl_dollars: Some(pl_dollars),
+        pl_pct: Some(pl_pct),
+        pace_per_day_dollars,
+        pace_per_day_pct,
+        days_elapsed,
+        days_total,
+        target_pct,
+        pace_met: pl_pct >= target_pct,
+        spot_pct_vs_strike,
     }
 }
 
@@ -340,4 +561,291 @@ mod tests {
         h.expiry = NaiveDate::from_ymd_opt(2028, 8, 30).unwrap();
         h.validate().unwrap();
     }
+
+    /// R1: the wheel's covered-call ledger type — same shape, same rules,
+    /// one shared pace implementation.
+    mod call_holding {
+        use super::*;
+
+        fn call_holding(sold: NaiveDate, expiry: NaiveDate, mark_mid: Option<f64>) -> CallHolding {
+            CallHolding {
+                id: "c1".to_string(),
+                symbol: "GOOG".to_string(),
+                strike: 350.0,
+                expiry,
+                premium: 1.0,
+                contracts: 1,
+                sold,
+                mark: mark_mid.map(|mid| Mark {
+                    mid,
+                    as_of: Utc::now(),
+                    underlying_price: None,
+                }),
+            }
+        }
+
+        fn dates() -> (NaiveDate, NaiveDate, NaiveDate) {
+            (
+                NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+                NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+            )
+        }
+
+        /// Pinning assertion: one pace implementation, two callers — a
+        /// CallHolding and a Holding with identical field values produce
+        /// identical HoldingViews.
+        #[test]
+        fn call_view_equals_put_view_field_for_field() {
+            let (sold, expiry, today) = dates();
+            let mut put = holding(sold, expiry, Some(0.5));
+            let mut call_h = call_holding(sold, expiry, Some(0.5));
+            assert_eq!(put.view(today), call_h.view(today));
+
+            put.mark = None;
+            call_h.mark = None;
+            assert_eq!(put.view(today), call_h.view(today), "also mark-less");
+        }
+
+        /// Identical validate() rules: the same six rejections.
+        #[test]
+        fn validation_rejects_the_same_bad_fields() {
+            let (sold, expiry, _) = dates();
+            let mut call_h = call_holding(sold, expiry, None);
+            call_h.validate().unwrap();
+
+            call_h.strike = 0.0;
+            assert!(call_h.validate().is_err());
+            call_h.strike = 350.0;
+
+            call_h.premium = -1.0;
+            assert!(call_h.validate().is_err());
+            call_h.premium = 1.0;
+
+            call_h.contracts = 0;
+            assert!(call_h.validate().is_err());
+            call_h.contracts = 1;
+
+            call_h.expiry = call_h.sold;
+            assert!(call_h.validate().is_err(), "expiry must be after sell date");
+            call_h.expiry = NaiveDate::from_ymd_opt(2028, 9, 4).unwrap();
+            assert!(call_h.validate().is_err(), "span > 730 days rejected");
+            call_h.expiry = expiry;
+
+            call_h.symbol = "  ".to_string();
+            assert!(call_h.validate().is_err());
+        }
+
+        /// Without a mark: pace_met false and the P&L fields are None — but
+        /// days_elapsed/days_total/target_pct still compute.
+        #[test]
+        fn no_mark_never_flags_but_day_math_runs() {
+            let (sold, expiry, today) = dates();
+            let call_h = call_holding(sold, expiry, None);
+            let v = call_h.view(today);
+            assert!(!v.pace_met);
+            assert_eq!(v.pl_dollars, None);
+            assert_eq!(v.pl_pct, None);
+            assert_eq!(v.days_elapsed, 2);
+            assert_eq!(v.days_total, 5);
+            assert_eq!(v.target_pct, 0.4);
+        }
+    }
+
+    /// R2: share lots from assignments, priced from the underlying spot.
+    mod share_lot {
+        use super::*;
+
+        fn lot(shares: u32, basis: f64) -> ShareLot {
+            ShareLot {
+                id: "l1".to_string(),
+                symbol: "GOOG".to_string(),
+                shares,
+                basis_per_share: basis,
+                acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                mark: None,
+            }
+        }
+
+        /// The design doc's reference numbers: 200 sh @ $349.00 basis,
+        /// spot $344.20, 2 contracts covered.
+        #[test]
+        fn reference_lot_view() {
+            let today = NaiveDate::from_ymd_opt(2026, 9, 8).unwrap();
+            let mut l = lot(200, 349.0);
+            l.mark = Some(SpotMark {
+                spot: 344.20,
+                as_of: Utc::now(),
+            });
+            let v = l.view(today, 2);
+            let value = v.value.unwrap();
+            assert!((value - 68840.0).abs() < 1e-6, "value {value}");
+            let pl = v.pl_dollars.unwrap();
+            assert!((pl - (-960.0)).abs() < 1e-6, "P&L {pl}");
+            let pct = v.pl_pct.unwrap();
+            assert!((pct - (-960.0 / 69_800.0)).abs() < 1e-12, "P&L% {pct}");
+            assert_eq!(v.capacity, 2);
+            assert_eq!(v.covered, 2);
+            assert_eq!(v.spot, Some(344.20));
+            assert!(v.spot_as_of.is_some());
+            assert_eq!(v.age_days, 0);
+        }
+
+        /// Unpriced lots report no value/P&L/spot but still compute
+        /// capacity, and carry the passed-in covered count.
+        #[test]
+        fn unpriced_lot_still_computes_capacity() {
+            let today = NaiveDate::from_ymd_opt(2026, 9, 10).unwrap();
+            let l = lot(200, 349.0);
+            let v = l.view(today, 1);
+            assert_eq!(v.value, None);
+            assert_eq!(v.pl_dollars, None);
+            assert_eq!(v.pl_pct, None);
+            assert_eq!(v.capacity, 2);
+            assert_eq!(v.covered, 1);
+            assert_eq!(v.spot, None);
+            assert_eq!(v.spot_as_of, None);
+            assert_eq!(v.age_days, 2);
+        }
+
+        /// Capacity floors, never rounds.
+        #[test]
+        fn capacity_floors() {
+            let today = NaiveDate::from_ymd_opt(2026, 9, 8).unwrap();
+            assert_eq!(lot(150, 10.0).view(today, 0).capacity, 1);
+            assert_eq!(lot(99, 10.0).view(today, 0).capacity, 0);
+            assert_eq!(lot(300, 10.0).view(today, 0).capacity, 3);
+        }
+
+        /// Structural validation only — future `acquired` dates are a
+        /// handler concern (R6), matching how `sold` is handled.
+        #[test]
+        fn validation_rejects_bad_fields() {
+            let mut l = lot(100, 10.0);
+            l.validate().unwrap();
+
+            l.symbol = "  ".to_string();
+            assert!(l.validate().is_err());
+            l.symbol = "GOOG".to_string();
+
+            l.shares = 0;
+            assert!(l.validate().is_err());
+            l.shares = 100;
+
+            l.basis_per_share = 0.0;
+            assert!(l.validate().is_err());
+            l.basis_per_share = -1.0;
+            assert!(l.validate().is_err());
+        }
+    }
+
+    /// R3: cash reserve math — puts only, honest negatives.
+    mod cash {
+        use super::*;
+
+        fn put(strike: f64, contracts: u32) -> Holding {
+            Holding {
+                id: format!("p{strike}x{contracts}"),
+                symbol: "X".to_string(),
+                strike,
+                expiry: NaiveDate::from_ymd_opt(2026, 10, 16).unwrap(),
+                premium: 1.0,
+                contracts,
+                sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                mark: None,
+            }
+        }
+
+        /// The design doc's reference book: 420×1, 350×2, 230×1 against
+        /// $148,000 cash.
+        #[test]
+        fn reference_reserve_and_free() {
+            let puts = vec![put(420.0, 1), put(350.0, 2), put(230.0, 1)];
+            assert_eq!(reserved_cash(&puts), 135_000.0);
+            assert_eq!(free_cash(148_000.0, &puts), 13_000.0);
+        }
+
+        /// Calls and lots never reserve — the functions take only the puts
+        /// slice, so a mixed book cannot change the answer by construction.
+        #[test]
+        fn only_puts_count() {
+            let puts = vec![put(420.0, 1), put(350.0, 2), put(230.0, 1)];
+            assert_eq!(reserved_cash(&puts), 135_000.0);
+        }
+
+        /// Free cash goes negative honestly — no clamping.
+        #[test]
+        fn free_cash_going_negative_is_honest() {
+            let puts = vec![put(420.0, 1), put(350.0, 2), put(230.0, 1)];
+            assert_eq!(free_cash(10_000.0, &puts), -125_000.0);
+        }
+
+        #[test]
+        fn empty_book_reserves_nothing() {
+            assert_eq!(reserved_cash(&[]), 0.0);
+            assert_eq!(free_cash(50_000.0, &[]), 50_000.0);
+        }
+    }
+
+    /// R9: the called-away FIFO reduction.
+    mod called_away {
+        use super::*;
+
+        fn lot(id: &str, shares: u32, acquired: NaiveDate) -> ShareLot {
+            ShareLot {
+                id: id.to_string(),
+                symbol: "GOOG".to_string(),
+                shares,
+                basis_per_share: 349.0,
+                acquired,
+                mark: None,
+            }
+        }
+
+        /// The design doc's example: a ×1 call on GOOG with lots of 200
+        /// (Sep 1) and 100 (Sep 5) — the Sep 1 lot drops to 100.
+        #[test]
+        fn fifo_reduces_earliest_lot() {
+            let lots = vec![
+                lot("l-old", 200, NaiveDate::from_ymd_opt(2026, 9, 1).unwrap()),
+                lot("l-new", 100, NaiveDate::from_ymd_opt(2026, 9, 5).unwrap()),
+            ];
+            let out = apply_called_away(&lots, "GOOG", 1).unwrap();
+            assert_eq!(out.len(), 2);
+            assert_eq!(out[0].id, "l-old");
+            assert_eq!(out[0].shares, 100, "earliest lot reduced");
+            assert_eq!(out[1].id, "l-new");
+            assert_eq!(out[1].shares, 100, "untouched");
+        }
+
+        /// Equal acquired dates break the tie by id, deterministically.
+        #[test]
+        fn tie_breaks_by_id() {
+            let d = NaiveDate::from_ymd_opt(2026, 9, 1).unwrap();
+            let lots = vec![lot("l-y", 200, d), lot("l-x", 200, d)];
+            let out = apply_called_away(&lots, "GOOG", 1).unwrap();
+            let reduced: Vec<_> = out.iter().filter(|l| l.id == "l-x").collect();
+            assert_eq!(reduced[0].shares, 100, "l-x chosen over l-y");
+            assert_eq!(out.iter().find(|l| l.id == "l-y").unwrap().shares, 200);
+        }
+
+        /// A lot reduced to 0 shares disappears.
+        #[test]
+        fn emptied_lot_is_removed() {
+            let d = NaiveDate::from_ymd_opt(2026, 9, 1).unwrap();
+            let lots = vec![lot("l-a", 200, d)];
+            let out = apply_called_away(&lots, "GOOG", 2).unwrap();
+            assert!(out.is_empty(), "200 − 200 drops the lot: {out:?}");
+        }
+
+        /// No single lot covers the need → None (call still removed
+        /// handler-side, shares untouched).
+        #[test]
+        fn uncovered_is_none() {
+            let d = NaiveDate::from_ymd_opt(2026, 9, 1).unwrap();
+            let lots = vec![lot("l-a", 100, d), lot("l-b", 150, d)];
+            assert_eq!(apply_called_away(&lots, "GOOG", 3), None, "need 300 > any lot");
+            assert_eq!(apply_called_away(&lots, "AAPL", 1), None, "wrong symbol");
+        }
+    }
 }
diff --git a/crates/webapp/frontend/dist/assets/app.css b/crates/webapp/frontend/dist/assets/app.css
index 2600085..866135c 100644
--- a/crates/webapp/frontend/dist/assets/app.css
+++ b/crates/webapp/frontend/dist/assets/app.css
@@ -1 +1 @@
-:root{--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.45}.shell{max-width:1280px;margin:0 auto;padding:16px;height:100vh;display:flex;flex-direction:column}.brand{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}.brand-mark{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}.brand-accent{color:var(--accent)}.brand-sub{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.cache-line{color:var(--muted);margin-bottom:12px}.pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel);margin-left:6px}.pill.fresh{border-color:var(--ok);color:var(--ok)}.pill.stale{border-color:var(--warn);color:var(--warn)}.pill.none,.pill.closed{color:var(--muted)}.error-banner{border:1px solid #e4b7b7;background:#fdf0f0;color:var(--err);padding:10px 12px;border-radius:6px;margin-bottom:12px}.tabs{display:flex;gap:4px;margin-top:4px}.tab{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;padding:6px 14px;font:inherit;color:var(--muted);cursor:pointer}.tab.active{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent);border-color:var(--accent)}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:8px 0}.filter-input{width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--panel);font:inherit;color:var(--ink)}.filter-input:focus{outline:none;border-color:var(--accent)}.check{display:inline-flex;align-items:center;gap:5px;cursor:pointer;-webkit-user-select:none;user-select:none;color:var(--ink)}.tool-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font:inherit;color:var(--ink);cursor:pointer}.tool-btn:hover{border-color:var(--accent)}.count-line{margin-left:auto;color:var(--muted);white-space:nowrap}.colpicker{position:relative;display:inline-block}.pop-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:40;background:transparent}.picker-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:41;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px 12px;width:min(430px,92vw);box-shadow:0 8px 24px #1c27331f}.picker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px 10px;margin-bottom:8px}.pick-item{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;cursor:pointer}.linklike{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;padding:2px 0;font:inherit;font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer}table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);font-size:12.5px}th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--border);white-space:nowrap}th{position:sticky;top:0;z-index:2;background:var(--panel);-webkit-user-select:none;user-select:none;cursor:pointer}th:hover{color:var(--accent)}.sort-arrow{display:inline-block;margin-left:4px;color:var(--accent)}td.num,th.num{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}td.strong{font-weight:700}tbody tr:hover td{background:#f4f7fb}tr.pick td{background:var(--pick-tint)}tr.pick:hover td{background:#faf0cd}tr.pick b{font-weight:700}.star{color:var(--star);font-weight:700;font-size:11px;margin-right:6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:middle}.dot.green{background:var(--dot-green)}.dot.yellow{background:var(--dot-yellow)}.dot.red{background:var(--dot-red)}.chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;font-family:-apple-system,SF Pro Text,Segoe UI,Roboto,sans-serif;vertical-align:middle;margin-left:6px}.chip.high{background:#f4e3c8;color:#8a5a00}.chip.extended{background:#f3d4d0;color:#a02a1a}.chip.normal{background:#e6ecf2;color:#51606f}tr.prow td{opacity:.62}.null-mark{color:#b3555f;opacity:.85}.empty-panel{border:1px dashed var(--border);background:var(--panel);border-radius:8px;padding:18px;color:var(--muted)}.pager{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:6px 10px;background:var(--panel);border:1px solid var(--border);border-top:none}.pager-label{color:var(--muted);margin-right:8px;white-space:nowrap}.pgbtn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;min-width:26px;padding:2px 7px;font:inherit;font-size:12px;color:var(--ink);cursor:pointer}.pgbtn:hover:not(:disabled){border-color:var(--accent)}.pgbtn.active{background:var(--accent);border-color:var(--accent);color:#fff}.pgbtn:disabled{opacity:.45;cursor:default}.pggap{color:var(--muted);padding:0 2px}.gate-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.gate-card{width:340px;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:22px 24px}.gate-title{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0 0 16px}.gate-label{display:block;font-size:12px;color:#51606f;margin-bottom:10px}.gate-label input{display:block;width:100%;margin-top:3px;padding:6px 8px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.gate-label input:focus{outline:none;border-color:var(--accent)}.btn{font:inherit;padding:6px 12px;border-radius:5px;border:1px solid var(--border);background:var(--panel);color:#1c2733;cursor:pointer}.btn:hover:not(:disabled){border-color:var(--accent)}.btn:disabled{opacity:.55;cursor:default}.btn-primary{width:100%;background:var(--accent);border-color:var(--accent);color:#fff}.gate-toggle{display:inline-block;margin-top:10px;font:inherit;font-size:12px;background:none;border:none;color:var(--accent);cursor:pointer;padding:0}.gate-or{text-align:center;color:#51606f;font-size:11px;margin:14px 0}.gate-error{margin-top:12px;padding:7px 10px;border:1px solid #e4b7b7;border-radius:5px;background:#fdf0f0;color:#a02a1a;font-size:12px}.gate-note{color:#51606f}.user-box{position:relative;float:right;display:flex;align-items:center;font-size:12px}.user-pill{display:inline-flex;align-items:center;gap:6px}.user-box .user-email{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-caret{color:var(--muted);font-size:9px}.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:45;min-width:230px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px #1c27331f}.acct-label{padding:5px 10px 3px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.acct-email{padding:0 10px 4px;font-size:12px;word-break:break-all}.account-menu .btn-ghost{display:flex;width:100%;justify-content:center;margin-top:4px}.btn-ghost{font:inherit;font-size:12px;padding:3px 10px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:60;background:#1c273373;display:grid;place-items:center;padding:16px}.access-card{width:min(420px,100%);max-height:min(85dvh,720px);overflow-y:auto}.access-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--page);font-size:12.5px}.access-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access-remove{flex:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:var(--err);font-size:13px;cursor:pointer;padding:2px 5px;border-radius:4px}.access-remove:hover{background:#fbeeec}.access-remove:disabled{opacity:.4;cursor:default}.access-add{display:flex;flex-direction:column;gap:8px;margin-top:10px}.access-add input{width:100%;padding:7px 9px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.access-add .btn{width:100%}.access-add input:focus{outline:none;border-color:var(--accent)}.run-slot-head{float:right;margin-left:12px}.run-btn{font:inherit;padding:5px 14px;border-radius:5px;border:1px solid #0d5cd7;background:#0d5cd7;color:#fff;cursor:pointer}.run-btn:hover:not(:disabled){background:#0a4cb4}.run-btn:disabled{background:#e6ecf2;border-color:#c9d2dd;color:#51606f;cursor:default}.run-strip{clear:both;border:1px solid #dde3ea;background:#fff;border-radius:6px;padding:10px 14px;margin-bottom:14px}.toast-cached{background:#fdf6e0;border:1px solid #eedfb8;color:#8a5a00;border-radius:5px;padding:6px 10px;font-size:12px;margin-bottom:8px}.toast-cached.warn{background:#f3d4d0;border-color:#e0b7b0;color:#a02a1a}.run-headline{font-size:13px;margin-bottom:8px}.run-stages{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:4px 24px}.run-stage{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#51606f}.run-stage .mark{width:1.1em;text-align:center}.run-stage.pending .mark{color:#9aa7b5}.run-stage.active{color:#0d5cd7}.run-stage.ok{color:#137a3a}.run-stage.partial{color:#a06b00}.run-stage.failed{color:#c43}.run-count{font-variant-numeric:tabular-nums;color:#51606f}.run-bar{flex:1;height:6px;min-width:80px;background:#eef2f6;border-radius:3px;overflow:hidden}.run-bar .fill{display:block;height:100%;background:#0d5cd7;transition:width .25s ease-out}.run-errors{font-size:12px;color:#51606f;margin-top:6px}.run-errors summary{cursor:pointer;color:#51606f}.run-errors ul{margin:6px 0 0 18px}.run-warn{margin-top:8px;font-size:12px;color:#a02a1a}.pane{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}.pane[hidden]{display:none}.scroll-region{flex:1 1 auto;min-height:140px;overflow:auto}.tip{position:relative}.tip-target{border-bottom:1px dotted #9aa7b5;cursor:help}.tip:after{content:attr(data-tip);display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:40;width:max-content;max-width:340px;padding:6px 9px;border-radius:6px;background:#1c2733;color:#fff;font-size:11.5px;font-weight:400;line-height:1.45;white-space:normal;text-align:left;box-shadow:0 2px 10px #1c273347;pointer-events:none}.tip:hover:after,.tip:focus-within:after{display:block}.tip-flip:after{left:auto;right:0}tr.expandable{cursor:pointer}tr.expandable.open td{background:#eef4fc}th.exp-col,td.exp-col{width:26px;min-width:26px;padding:5px 2px;text-align:center;color:var(--muted)}tr.exp-row>td{background:#fbfcfe;white-space:normal;padding:0}.expansion{border-left:3px solid #b9d2f2;padding:10px 12px;max-width:calc(100vw - 24px);position:sticky;left:0}.exp-grid{display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:10px}.exp-block{min-width:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px}.exp-block h4{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.exp-chips{grid-column:1 / -1}.kv{display:grid;grid-template-columns:minmax(96px,max-content) 1fr;gap:1px 12px;align-items:baseline;margin-top:3px;font-size:12.5px}.kv-label{color:var(--muted)}.kv-value{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.kv .muted-note{grid-column:1 / -1;text-align:left}.band-chart{position:relative;height:50px;margin:2px 0 10px;background:#f2f5f8;border:1px solid var(--border);border-radius:4px}.band-shade{position:absolute;top:0;height:30px;background:#0d5cd724;border-left:1px solid rgba(13,92,215,.35);border-right:1px solid rgba(13,92,215,.35)}.marker{position:absolute;top:0}.marker-tick{position:absolute;top:0;left:-1px;width:2px;height:20px}.marker-cap{position:absolute;top:32px;left:0;transform:translate(-50%);font-size:10px;line-height:1.25;color:var(--muted);white-space:nowrap;text-align:center}.mk-strike .marker-tick{height:30px;background:var(--accent)}.mk-strike .marker-cap{color:var(--accent);font-weight:600}.mk-be .marker-tick{background:var(--ok)}.mk-spot .marker-tick{background:var(--ink)}.bar-row{display:grid;grid-template-columns:minmax(120px,max-content) 1fr 48px;gap:8px;align-items:center;margin-top:5px;font-size:12px}.bar-weight{color:var(--muted);font-size:10.5px}.bar-track{display:block;height:8px;background:#edf1f5;border-radius:4px;overflow:hidden}.bar-fill{display:block;height:100%;background:var(--accent);border-radius:4px}.bar-val{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.bar-row.total{margin-top:9px;padding-top:7px;border-top:1px dashed var(--border)}.bar-row.total .bar-label{font-weight:600}.chip-hidden{display:inline-block;margin:0 6px 6px 0;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--page);font-size:11.5px}.chip-hidden.is-null{opacity:.55}.earnings-banner{margin-bottom:10px;padding:7px 10px;border:1px solid #eedfb8;border-radius:5px;background:#fdf3df;color:#8a5a00;font-size:12px}.stage-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.sbadge{display:inline-block;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--panel);font-size:11.5px;color:var(--muted)}.sbadge summary{cursor:pointer;list-style:none}.sbadge summary::-webkit-details-marker{display:none}.sbadge.ok{color:var(--ok);border-color:#cfe5d6;background:#eef7f0}.sbadge.partial{color:var(--warn);border-color:#ecd9ae;background:#fbf3dd}.sbadge.failed{color:var(--err);border-color:#e8c4bd;background:#fbeeec}.errbox{margin:8px 0 0;padding:8px 10px;max-height:180px;overflow:auto;background:#fdf0f0;border:1px solid #e8c4bd;border-radius:5px;color:var(--err);font-size:11.5px;line-height:1.4;white-space:pre-wrap}.stage-failed-panel{border-color:#e8c4bd;background:#fbeeec;color:var(--err)}.stage-failed-panel .errbox{background:#fff}.hero{margin-top:8px;padding:26px 30px;background:var(--panel);border:1px solid var(--border);border-radius:8px}.hero h2{margin:0 0 8px;font-size:15px}.hero p{margin:7px 0;max-width:72ch}.muted-note{color:var(--muted);font-size:12px}@media(max-width:640px){.picker-panel{position:fixed;left:12px;right:12px;top:auto;bottom:12px;width:auto;max-height:calc(100vh - 60px);overflow:auto}.exp-grid,.run-stages{grid-template-columns:1fr}.tip:after{position:fixed;top:auto;bottom:12px;left:12px;right:12px;width:auto;max-width:none}.tip-flip:after{right:12px}th .tip:after{display:none!important}th .tip-target{border-bottom:0;cursor:inherit}.pager{z-index:1}.expansion{z-index:2}th{z-index:3}}@media(max-width:480px){.picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}details.adjust{flex:none;margin:10px 0 0;background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden}details.adjust summary{padding:10px 14px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}details.adjust summary::-webkit-details-marker{display:none}details.adjust summary:after{content:"▾";color:var(--muted)}details.adjust[open] summary:after{content:"▴"}details.adjust .hint{font-weight:400;font-size:12px;color:var(--muted)}details.adjust .hint-custom{color:var(--accent)}.adjust-body{padding:2px 14px 14px;border-top:1px solid var(--border)}.adjust-body .ctl{margin:12px 0 4px}.adjust-body .ctl label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}.adjust-body .ctl .val{font-variant-numeric:tabular-nums;color:var(--muted)}.adjust-body input[type=range]{width:100%;accent-color:var(--accent)}.adjust-body .reset{margin-top:10px;width:100%;padding:9px 0;border-radius:8px;border:1px solid var(--border);background:transparent;font-size:14px;cursor:pointer}.score-cell .score-frozen{display:block;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}.score-cell .score-frozen.readmit{color:#059669}@media(max-width:640px){.controls{flex-wrap:wrap}.count-line{flex:1 0 100%}}.holdings-panel{padding:12px 0}.holdings-toolbar{display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;justify-content:space-between;margin-bottom:10px}.holdings-refresh{flex:0 0 auto}.holdings-notice{border:1px solid var(--border);background:var(--panel);border-left:3px solid var(--accent);padding:6px 10px;border-radius:6px;margin-bottom:10px;color:var(--muted)}.holdings-pos{color:var(--ok)}.holdings-neg{color:var(--err)}.holdings-age{color:var(--muted);font-size:11px}.holdings-add{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px dashed var(--border);border-radius:8px;padding:8px 10px;background:var(--panel);flex:1}.holdings-add label{display:inline-flex;gap:4px;align-items:center;color:var(--muted);font-size:11px}.holdings-add input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;background:var(--page);color:var(--ink);max-width:110px}.holdings-add input:first-child{text-transform:uppercase}.holdings-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}.holdings-card{border:1px solid var(--border);border-radius:10px;background:var(--panel);padding:12px;display:flex;flex-direction:column;gap:8px}.holdings-card-met{border-color:var(--ok);box-shadow:0 0 0 1px var(--ok) inset}.holdings-card-head{display:flex;justify-content:space-between;align-items:baseline;gap:6px}.holdings-card-big{display:flex;justify-content:space-between;align-items:baseline}.holdings-card-big>span:first-child{font-size:26px;font-weight:700;font-variant-numeric:tabular-nums}.holdings-card-target{color:var(--muted);font-size:12px}.holdings-card-actions{display:flex;justify-content:space-between;align-items:center}.holdings-close-btn{font-size:11px}.holdings-bar{position:relative;height:10px;border-radius:999px;background:#e8edf3;overflow:visible}.holdings-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--accent);opacity:.85}.holdings-bar-mark{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--warn)}.holdings-card-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;border-top:1px solid var(--border);padding-top:8px}.holdings-card-stats div{display:flex;flex-direction:column;min-width:0}.holdings-card-stats span{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.holdings-card-stats b{font-variant-numeric:tabular-nums;font-size:12.5px}.holdings-card-stats i{font-style:normal;font-size:10.5px;color:var(--muted)}.holdings-outcome{border:1px solid var(--accent);border-radius:8px;background:var(--panel);padding:10px 12px;margin-top:10px;max-width:420px}.holdings-outcome-head{font-weight:600;margin-bottom:8px}.holdings-outcome-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}.holdings-outcome-row label{display:inline-flex;gap:5px;align-items:center;font-size:12px}.holdings-outcome-price{display:flex;gap:6px;align-items:center;font-size:12px;margin-bottom:8px}.holdings-outcome-price input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;width:90px}.holdings-outcome-realized{font-size:12px;color:var(--muted);margin-bottom:8px}.holdings-outcome-actions{display:flex;gap:8px;justify-content:flex-end}@media(max-width:720px){.holdings-card-stats{grid-template-columns:repeat(2,1fr)}.holdings-toolbar{flex-direction:column;align-items:stretch}.holdings-refresh{justify-content:center}.holdings-add{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;width:100%}.holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:2px}.holdings-add input{max-width:none;width:100%}.holdings-add .btn,.holdings-add .btn-primary{grid-column:1 / -1}}
+:root{--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.45}.shell{max-width:1280px;margin:0 auto;padding:16px;height:100vh;display:flex;flex-direction:column}.brand{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}.brand-mark{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}.brand-accent{color:var(--accent)}.brand-sub{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.cache-line{color:var(--muted);margin-bottom:12px}.pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel);margin-left:6px}.pill.fresh{border-color:var(--ok);color:var(--ok)}.pill.stale{border-color:var(--warn);color:var(--warn)}.pill.none,.pill.closed{color:var(--muted)}.error-banner{border:1px solid #e4b7b7;background:#fdf0f0;color:var(--err);padding:10px 12px;border-radius:6px;margin-bottom:12px}.tabs{display:flex;gap:4px;margin-top:4px}.tab{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;padding:6px 14px;font:inherit;color:var(--muted);cursor:pointer}.tab.active{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent);border-color:var(--accent)}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:8px 0}.filter-input{width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--panel);font:inherit;color:var(--ink)}.filter-input:focus{outline:none;border-color:var(--accent)}.check{display:inline-flex;align-items:center;gap:5px;cursor:pointer;-webkit-user-select:none;user-select:none;color:var(--ink)}.tool-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font:inherit;color:var(--ink);cursor:pointer}.tool-btn:hover{border-color:var(--accent)}.count-line{margin-left:auto;color:var(--muted);white-space:nowrap}.colpicker{position:relative;display:inline-block}.pop-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:40;background:transparent}.picker-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:41;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px 12px;width:min(430px,92vw);box-shadow:0 8px 24px #1c27331f}.picker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px 10px;margin-bottom:8px}.pick-item{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;cursor:pointer}.linklike{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;padding:2px 0;font:inherit;font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer}table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);font-size:12.5px}th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--border);white-space:nowrap}th{position:sticky;top:0;z-index:2;background:var(--panel);-webkit-user-select:none;user-select:none;cursor:pointer}th:hover{color:var(--accent)}.sort-arrow{display:inline-block;margin-left:4px;color:var(--accent)}td.num,th.num{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}td.strong{font-weight:700}tbody tr:hover td{background:#f4f7fb}tr.pick td{background:var(--pick-tint)}tr.pick:hover td{background:#faf0cd}tr.pick b{font-weight:700}.star{color:var(--star);font-weight:700;font-size:11px;margin-right:6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:middle}.dot.green{background:var(--dot-green)}.dot.yellow{background:var(--dot-yellow)}.dot.red{background:var(--dot-red)}.chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;font-family:-apple-system,SF Pro Text,Segoe UI,Roboto,sans-serif;vertical-align:middle;margin-left:6px}.chip.high{background:#f4e3c8;color:#8a5a00}.chip.extended{background:#f3d4d0;color:#a02a1a}.chip.normal{background:#e6ecf2;color:#51606f}tr.prow td{opacity:.62}.null-mark{color:#b3555f;opacity:.85}.empty-panel{border:1px dashed var(--border);background:var(--panel);border-radius:8px;padding:18px;color:var(--muted)}.pager{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:6px 10px;background:var(--panel);border:1px solid var(--border);border-top:none}.pager-label{color:var(--muted);margin-right:8px;white-space:nowrap}.pgbtn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;min-width:26px;padding:2px 7px;font:inherit;font-size:12px;color:var(--ink);cursor:pointer}.pgbtn:hover:not(:disabled){border-color:var(--accent)}.pgbtn.active{background:var(--accent);border-color:var(--accent);color:#fff}.pgbtn:disabled{opacity:.45;cursor:default}.pggap{color:var(--muted);padding:0 2px}.gate-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.gate-card{width:340px;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:22px 24px}.gate-title{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0 0 16px}.gate-label{display:block;font-size:12px;color:#51606f;margin-bottom:10px}.gate-label input{display:block;width:100%;margin-top:3px;padding:6px 8px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.gate-label input:focus{outline:none;border-color:var(--accent)}.btn{font:inherit;padding:6px 12px;border-radius:5px;border:1px solid var(--border);background:var(--panel);color:#1c2733;cursor:pointer}.btn:hover:not(:disabled){border-color:var(--accent)}.btn:disabled{opacity:.55;cursor:default}.btn-primary{width:100%;background:var(--accent);border-color:var(--accent);color:#fff}.gate-toggle{display:inline-block;margin-top:10px;font:inherit;font-size:12px;background:none;border:none;color:var(--accent);cursor:pointer;padding:0}.gate-or{text-align:center;color:#51606f;font-size:11px;margin:14px 0}.gate-error{margin-top:12px;padding:7px 10px;border:1px solid #e4b7b7;border-radius:5px;background:#fdf0f0;color:#a02a1a;font-size:12px}.gate-note{color:#51606f}.user-box{position:relative;float:right;display:flex;align-items:center;font-size:12px}.user-pill{display:inline-flex;align-items:center;gap:6px}.user-box .user-email{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-caret{color:var(--muted);font-size:9px}.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:45;min-width:230px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px #1c27331f}.acct-label{padding:5px 10px 3px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.acct-email{padding:0 10px 4px;font-size:12px;word-break:break-all}.account-menu .btn-ghost{display:flex;width:100%;justify-content:center;margin-top:4px}.btn-ghost{font:inherit;font-size:12px;padding:3px 10px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:60;background:#1c273373;display:grid;place-items:center;padding:16px}.access-card{width:min(420px,100%);max-height:min(85dvh,720px);overflow-y:auto}.access-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--page);font-size:12.5px}.access-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access-remove{flex:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:var(--err);font-size:13px;cursor:pointer;padding:2px 5px;border-radius:4px}.access-remove:hover{background:#fbeeec}.access-remove:disabled{opacity:.4;cursor:default}.access-add{display:flex;flex-direction:column;gap:8px;margin-top:10px}.access-add input{width:100%;padding:7px 9px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.access-add .btn{width:100%}.access-add input:focus{outline:none;border-color:var(--accent)}.run-slot-head{float:right;margin-left:12px}.run-btn{font:inherit;padding:5px 14px;border-radius:5px;border:1px solid #0d5cd7;background:#0d5cd7;color:#fff;cursor:pointer}.run-btn:hover:not(:disabled){background:#0a4cb4}.run-btn:disabled{background:#e6ecf2;border-color:#c9d2dd;color:#51606f;cursor:default}.run-strip{clear:both;border:1px solid #dde3ea;background:#fff;border-radius:6px;padding:10px 14px;margin-bottom:14px}.toast-cached{background:#fdf6e0;border:1px solid #eedfb8;color:#8a5a00;border-radius:5px;padding:6px 10px;font-size:12px;margin-bottom:8px}.toast-cached.warn{background:#f3d4d0;border-color:#e0b7b0;color:#a02a1a}.run-headline{font-size:13px;margin-bottom:8px}.run-stages{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:4px 24px}.run-stage{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#51606f}.run-stage .mark{width:1.1em;text-align:center}.run-stage.pending .mark{color:#9aa7b5}.run-stage.active{color:#0d5cd7}.run-stage.ok{color:#137a3a}.run-stage.partial{color:#a06b00}.run-stage.failed{color:#c43}.run-count{font-variant-numeric:tabular-nums;color:#51606f}.run-bar{flex:1;height:6px;min-width:80px;background:#eef2f6;border-radius:3px;overflow:hidden}.run-bar .fill{display:block;height:100%;background:#0d5cd7;transition:width .25s ease-out}.run-errors{font-size:12px;color:#51606f;margin-top:6px}.run-errors summary{cursor:pointer;color:#51606f}.run-errors ul{margin:6px 0 0 18px}.run-warn{margin-top:8px;font-size:12px;color:#a02a1a}.pane{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}.pane[hidden]{display:none}.scroll-region{flex:1 1 auto;min-height:140px;overflow:auto}.tip{position:relative}.tip-target{border-bottom:1px dotted #9aa7b5;cursor:help}.tip:after{content:attr(data-tip);display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:40;width:max-content;max-width:340px;padding:6px 9px;border-radius:6px;background:#1c2733;color:#fff;font-size:11.5px;font-weight:400;line-height:1.45;white-space:normal;text-align:left;box-shadow:0 2px 10px #1c273347;pointer-events:none}.tip:hover:after,.tip:focus-within:after{display:block}.tip-flip:after{left:auto;right:0}tr.expandable{cursor:pointer}tr.expandable.open td{background:#eef4fc}th.exp-col,td.exp-col{width:26px;min-width:26px;padding:5px 2px;text-align:center;color:var(--muted)}tr.exp-row>td{background:#fbfcfe;white-space:normal;padding:0}.expansion{border-left:3px solid #b9d2f2;padding:10px 12px;max-width:calc(100vw - 24px);position:sticky;left:0}.exp-grid{display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:10px}.exp-block{min-width:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px}.exp-block h4{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.exp-chips{grid-column:1 / -1}.kv{display:grid;grid-template-columns:minmax(96px,max-content) 1fr;gap:1px 12px;align-items:baseline;margin-top:3px;font-size:12.5px}.kv-label{color:var(--muted)}.kv-value{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.kv .muted-note{grid-column:1 / -1;text-align:left}.band-chart{position:relative;height:50px;margin:2px 0 10px;background:#f2f5f8;border:1px solid var(--border);border-radius:4px}.band-shade{position:absolute;top:0;height:30px;background:#0d5cd724;border-left:1px solid rgba(13,92,215,.35);border-right:1px solid rgba(13,92,215,.35)}.marker{position:absolute;top:0}.marker-tick{position:absolute;top:0;left:-1px;width:2px;height:20px}.marker-cap{position:absolute;top:32px;left:0;transform:translate(-50%);font-size:10px;line-height:1.25;color:var(--muted);white-space:nowrap;text-align:center}.mk-strike .marker-tick{height:30px;background:var(--accent)}.mk-strike .marker-cap{color:var(--accent);font-weight:600}.mk-be .marker-tick{background:var(--ok)}.mk-spot .marker-tick{background:var(--ink)}.bar-row{display:grid;grid-template-columns:minmax(120px,max-content) 1fr 48px;gap:8px;align-items:center;margin-top:5px;font-size:12px}.bar-weight{color:var(--muted);font-size:10.5px}.bar-track{display:block;height:8px;background:#edf1f5;border-radius:4px;overflow:hidden}.bar-fill{display:block;height:100%;background:var(--accent);border-radius:4px}.bar-val{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.bar-row.total{margin-top:9px;padding-top:7px;border-top:1px dashed var(--border)}.bar-row.total .bar-label{font-weight:600}.chip-hidden{display:inline-block;margin:0 6px 6px 0;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--page);font-size:11.5px}.chip-hidden.is-null{opacity:.55}.earnings-banner{margin-bottom:10px;padding:7px 10px;border:1px solid #eedfb8;border-radius:5px;background:#fdf3df;color:#8a5a00;font-size:12px}.stage-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.sbadge{display:inline-block;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--panel);font-size:11.5px;color:var(--muted)}.sbadge summary{cursor:pointer;list-style:none}.sbadge summary::-webkit-details-marker{display:none}.sbadge.ok{color:var(--ok);border-color:#cfe5d6;background:#eef7f0}.sbadge.partial{color:var(--warn);border-color:#ecd9ae;background:#fbf3dd}.sbadge.failed{color:var(--err);border-color:#e8c4bd;background:#fbeeec}.errbox{margin:8px 0 0;padding:8px 10px;max-height:180px;overflow:auto;background:#fdf0f0;border:1px solid #e8c4bd;border-radius:5px;color:var(--err);font-size:11.5px;line-height:1.4;white-space:pre-wrap}.stage-failed-panel{border-color:#e8c4bd;background:#fbeeec;color:var(--err)}.stage-failed-panel .errbox{background:#fff}.hero{margin-top:8px;padding:26px 30px;background:var(--panel);border:1px solid var(--border);border-radius:8px}.hero h2{margin:0 0 8px;font-size:15px}.hero p{margin:7px 0;max-width:72ch}.muted-note{color:var(--muted);font-size:12px}@media(max-width:640px){.picker-panel{position:fixed;left:12px;right:12px;top:auto;bottom:12px;width:auto;max-height:calc(100vh - 60px);overflow:auto}.exp-grid,.run-stages{grid-template-columns:1fr}.tip:after{position:fixed;top:auto;bottom:12px;left:12px;right:12px;width:auto;max-width:none}.tip-flip:after{right:12px}th .tip:after{display:none!important}th .tip-target{border-bottom:0;cursor:inherit}.pager{z-index:1}.expansion{z-index:2}th{z-index:3}}@media(max-width:480px){.picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}details.adjust{flex:none;margin:10px 0 0;background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden}details.adjust summary{padding:10px 14px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}details.adjust summary::-webkit-details-marker{display:none}details.adjust summary:after{content:"▾";color:var(--muted)}details.adjust[open] summary:after{content:"▴"}details.adjust .hint{font-weight:400;font-size:12px;color:var(--muted)}details.adjust .hint-custom{color:var(--accent)}.adjust-body{padding:2px 14px 14px;border-top:1px solid var(--border)}.adjust-body .ctl{margin:12px 0 4px}.adjust-body .ctl label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}.adjust-body .ctl .val{font-variant-numeric:tabular-nums;color:var(--muted)}.adjust-body input[type=range]{width:100%;accent-color:var(--accent)}.adjust-body .reset{margin-top:10px;width:100%;padding:9px 0;border-radius:8px;border:1px solid var(--border);background:transparent;font-size:14px;cursor:pointer}.score-cell .score-frozen{display:block;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}.score-cell .score-frozen.readmit{color:#059669}@media(max-width:640px){.controls{flex-wrap:wrap}.count-line{flex:1 0 100%}}.holdings-panel{padding:12px 0}.holdings-toolbar{display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;justify-content:space-between;margin-bottom:10px}.holdings-refresh{flex:0 0 auto}.holdings-notice{border:1px solid var(--border);background:var(--panel);border-left:3px solid var(--accent);padding:6px 10px;border-radius:6px;margin-bottom:10px;color:var(--muted)}.holdings-pos{color:var(--ok)}.holdings-neg{color:var(--err)}.holdings-age{color:var(--muted);font-size:11px}.holdings-add{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px dashed var(--border);border-radius:8px;padding:8px 10px;background:var(--panel);flex:1}.holdings-add label{display:inline-flex;gap:4px;align-items:center;color:var(--muted);font-size:11px}.holdings-add input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;background:var(--page);color:var(--ink);max-width:110px}.holdings-add input:first-child{text-transform:uppercase}.holdings-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}.holdings-card{border:1px solid var(--border);border-radius:10px;background:var(--panel);padding:12px;display:flex;flex-direction:column;gap:8px}.holdings-card-met{border-color:var(--ok);box-shadow:0 0 0 1px var(--ok) inset}.holdings-card-head{display:flex;justify-content:space-between;align-items:baseline;gap:6px}.holdings-card-big{display:flex;justify-content:space-between;align-items:baseline}.holdings-card-big>span:first-child{font-size:26px;font-weight:700;font-variant-numeric:tabular-nums}.holdings-card-target{color:var(--muted);font-size:12px}.holdings-card-actions{display:flex;justify-content:space-between;align-items:center}.holdings-close-btn{font-size:11px}.holdings-bar{position:relative;height:10px;border-radius:999px;background:#e8edf3;overflow:visible}.holdings-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--accent);opacity:.85}.holdings-bar-mark{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--warn)}.holdings-card-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;border-top:1px solid var(--border);padding-top:8px}.holdings-card-stats div{display:flex;flex-direction:column;min-width:0}.holdings-card-stats span{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.holdings-card-stats b{font-variant-numeric:tabular-nums;font-size:12.5px}.holdings-card-stats i{font-style:normal;font-size:10.5px;color:var(--muted)}.holdings-outcome{border:1px solid var(--accent);border-radius:8px;background:var(--panel);padding:10px 12px;margin-top:10px;max-width:420px}.holdings-outcome-head{font-weight:600;margin-bottom:8px}.holdings-outcome-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}.holdings-outcome-row label{display:inline-flex;gap:5px;align-items:center;font-size:12px}.holdings-outcome-price{display:flex;gap:6px;align-items:center;font-size:12px;margin-bottom:8px}.holdings-outcome-price input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;width:90px}.holdings-outcome-realized{font-size:12px;color:var(--muted);margin-bottom:8px}.holdings-outcome-actions{display:flex;gap:8px;justify-content:flex-end}@media(max-width:720px){.holdings-card-stats{grid-template-columns:repeat(2,1fr)}.holdings-toolbar{flex-direction:column;align-items:stretch}.holdings-refresh{justify-content:center}.holdings-add{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;width:100%}.holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:2px}.holdings-add input{max-width:none;width:100%}.holdings-add .btn,.holdings-add .btn-primary{grid-column:1 / -1}}.hp-wheel{display:grid;grid-template-columns:16rem 1fr;gap:1.1rem;align-items:start}.hp-rail{display:flex;flex-direction:column;gap:.7rem;position:sticky;top:0}.hp-rail-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.7rem .9rem}.hp-rail-label{font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem}.hp-rail-big{font-size:1.6rem;font-weight:700;color:var(--ok)}.hp-rail-sub{font-size:.72rem;opacity:.6;margin-top:.15rem}.hp-rail-row{display:flex;justify-content:space-between;gap:.6rem;padding:.22rem 0;font-size:.82rem}.hp-lot-row{padding:.28rem 0;border-bottom:1px solid var(--border)}.hp-lot-row-top{display:flex;justify-content:space-between;gap:.6rem;font-size:.85rem}.hp-lot-row-top b{font-variant-numeric:tabular-nums}.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.6rem;font-size:.72rem;opacity:.78;margin-top:.1rem}.hp-lot-row-sub b{font-variant-numeric:tabular-nums}.hp-lot-row-meta{display:flex;justify-content:space-between;gap:.6rem;font-size:.68rem;opacity:.55;margin-top:.1rem}.hp-lot-row-meta i{font-style:normal}.hp-toolbar-row{display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem}.hp-hint{font-size:.8rem;opacity:.6;padding:.4rem 0}.hp-list{display:flex;flex-direction:column;gap:.35rem}.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5rem minmax(9rem,1fr) 8rem auto;gap:.8rem;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.55rem .8rem}.hp-list-row.hp-row-met{border-color:var(--ok)}.hp-list-head{background:transparent;border:0;padding:.1rem .8rem;font-size:.68rem;opacity:.55;text-transform:uppercase;letter-spacing:.05em}.hp-list-pos{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.72rem;opacity:.6}.hp-kind{font-size:.6rem;font-weight:700;letter-spacing:.06em;border-radius:5px;padding:.1rem .35rem}.hp-kind[data-kind=put]{background:#60a5fa2e;color:#7fb5f5}.hp-kind[data-kind=call]{background:#fbbf2429;color:#e8b84a}.hp-list-pace .holdings-bar{min-width:7rem}.hp-slot{display:flex;flex-direction:column;gap:.45rem;min-width:0}.hp-list-status{display:flex;flex-direction:column;gap:.25rem;align-items:flex-start}.hp-list-stats{grid-column:1 / -1;margin-top:.15rem}.hp-cash-edit{margin-left:auto;font-size:.75rem}.hp-cash-editor{margin-left:auto;display:flex;gap:.35rem;align-items:center}.hp-cash-editor input{width:9rem;font:inherit;padding:.25rem .45rem;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:inherit}.hp-dialog-note{font-size:.72rem;opacity:.65;margin-top:.5rem;border-top:1px solid var(--border);padding-top:.4rem}@media(max-width:900px){.hp-wheel{grid-template-columns:1fr}.hp-rail{position:static}}@media(max-width:720px){.hp-list-row.hp-list-head{display:none}.hp-list-row{display:flex;flex-direction:column;align-items:stretch;gap:.45rem}.hp-list-pos{justify-content:space-between}.hp-list-pace{display:flex;flex-direction:column;gap:.15rem}.hp-list-status{flex-direction:row;flex-wrap:wrap}.hp-list-row .holdings-close-btn{align-self:flex-end}.hp-cash-editor{margin-left:0}.hp-cash-editor input{width:7rem}}
diff --git a/crates/webapp/frontend/dist/assets/app.js b/crates/webapp/frontend/dist/assets/app.js
index e4f135f..5dfae56 100644
--- a/crates/webapp/frontend/dist/assets/app.js
+++ b/crates/webapp/frontend/dist/assets/app.js
@@ -1,4 +1,4 @@
-(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const hs=!1,fs=(t,e)=>t===e,ps=Symbol("solid-track"),Wt={equals:fs};let Xr=ni;const $e=1,jt=2,Qr={owned:null,cleanups:null,context:null,owner:null},un={};var j=null;let dn=null,gs=null,W=null,J=null,Ie=null,nn=0;function Lt(t,e){const n=W,r=j,i=t.length===0,s=e===void 0?r:e,a=i?Qr:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>le(()=>vt(a)));j=a,W=null;try{return Fe(o,!0)}finally{W=n,j=r}}function O(t,e){e=e?Object.assign({},Wt,e):Wt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ti(n,i));return[ei.bind(n),r]}function ms(t,e,n){const r=rn(t,e,!0,$e);lt(r)}function k(t,e,n){const r=rn(t,e,!1,$e);lt(r)}function ze(t,e,n){Xr=Es;const r=rn(t,e,!1,$e);r.user=!0,Ie?Ie.push(r):lt(r)}function Y(t,e,n){n=n?Object.assign({},Wt,n):Wt;const r=rn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,lt(r),ei.bind(r)}function _s(t){return t&&typeof t=="object"&&"then"in t}function Zr(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=un,l=!1,c="initialValue"in s,d=typeof r=="function"&&Y(r);const h=new Set,[m,g]=(s.storage||O)(s.initialValue),[_,I]=O(void 0),[b,y]=O(void 0,{equals:!1}),[v,x]=O(c?"ready":"unresolved");j&&Ue(()=>{for(const P of h.keys())P.decrement();h.clear(),a=null});function A(P,D,U,F){return a===P&&(a=null,F!==void 0&&(c=!0),(P===o||D===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(F,{value:D})),o=un,T(D,U)),D}function T(P,D){Fe(()=>{D===void 0&&g(()=>P),x(D!==void 0?"errored":c?"ready":"unresolved"),I(D);for(const U of h.keys())U.decrement();h.clear()},!1)}function S(){const P=ys,D=m(),U=_();if(U!==void 0&&!a)throw U;return W&&W.user,D}function L(P=!0){if(P!==!1&&l)return;l=!1;const D=d?d():r;if(D==null||D===!1){A(a,le(m));return}let U;const F=o!==un?o:le(()=>{try{return i(D,{value:m(),refetching:P})}catch(Q){U=Q}});if(U!==void 0){A(a,void 0,Mt(U),D);return}else if(!_s(F))return A(a,F,void 0,D),F;return a=F,"v"in F?(F.s===1?A(a,F.v,void 0,D):A(a,void 0,Mt(F.v),D),F):(l=!0,queueMicrotask(()=>l=!1),Fe(()=>{x(c?"refreshing":"pending"),y()},!1),F.then(Q=>A(F,Q,void 0,D),Q=>A(F,void 0,Mt(Q),D)))}Object.defineProperties(S,{state:{get:()=>v()},error:{get:()=>_()},loading:{get(){const P=v();return P==="pending"||P==="refreshing"}},latest:{get(){if(!c)return S();const P=_();if(P&&!a)throw P;return m()}}});let R=j;return d?ms(()=>(R=j,L(!1))):L(!1),[S,{refetch:P=>bs(R,()=>L(P)),mutate:g}]}function le(t){if(W===null)return t();const e=W;W=null;try{return t()}finally{W=e}}function _t(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=le(()=>e(a,i,s));return i=a,o}}function wt(t){ze(()=>le(t))}function Ue(t){return j===null||(j.cleanups===null?j.cleanups=[t]:j.cleanups.push(t)),t}function bs(t,e){const n=j,r=W;j=t,W=null;try{return Fe(e,!0)}catch(i){Mn(i)}finally{j=n,W=r}}const[Rh,Ph]=O(!1);let ys;function ei(){if(this.sources&&this.state)if(this.state===$e)lt(this);else{const t=J;J=null,Fe(()=>Gt(this),!1),J=t}if(W){const t=this.observers;if(!t||t[t.length-1]!==W){const e=t?t.length:0;W.sources?(W.sources.push(this),W.sourceSlots.push(e)):(W.sources=[this],W.sourceSlots=[e]),t?(t.push(W),this.observerSlots.push(W.sources.length-1)):(this.observers=[W],this.observerSlots=[W.sources.length-1])}}return this.value}function ti(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Fe(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=dn&&dn.running;a&&dn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?J.push(s):Ie.push(s),s.observers&&ri(s)),a||(s.state=$e)}if(J.length>1e6)throw J=[],new Error},!1)),e}function lt(t){if(!t.fn)return;vt(t);const e=nn;ws(t,t.value,e)}function ws(t,e,n){let r;const i=j,s=W;W=j=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=$e,t.owned&&t.owned.forEach(vt),t.owned=null),t.updatedAt=n+1,Mn(a)}finally{W=s,j=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ti(t,r):t.value=r,t.updatedAt=n)}function rn(t,e,n,r=$e,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:j,context:j?j.context:null,pure:n};return j===null||j!==Qr&&(j.owned?j.owned.push(s):j.owned=[s]),s}function zt(t){if(t.state===0)return;if(t.state===jt)return Gt(t);if(t.suspense&&le(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<nn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===$e)lt(t);else if(t.state===jt){const r=J;J=null,Fe(()=>Gt(t,e[0]),!1),J=r}}function Fe(t,e){if(J)return t();let n=!1;e||(J=[]),Ie?n=!0:Ie=[],nn++;try{const r=t();return vs(n),r}catch(r){n||(Ie=null),J=null,Mn(r)}}function vs(t){if(J&&(ni(J),J=null),t)return;const e=Ie;Ie=null,e.length&&Fe(()=>Xr(e),!1)}function ni(t){for(let e=0;e<t.length;e++)zt(t[e])}function Es(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:zt(r)}for(e=0;e<n;e++)zt(t[e])}function Gt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===$e?r!==e&&(!r.updatedAt||r.updatedAt<nn)&&zt(r):i===jt&&Gt(r,e)}}}function ri(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=jt,n.pure?J.push(n):Ie.push(n),n.observers&&ri(n))}}function vt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)vt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)vt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Mt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Mn(t,e=j){throw Mt(t)}const Is=Symbol("fallback");function sr(t){for(let e=0;e<t.length;e++)t[e]()}function Ss(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Ue(()=>sr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[ps],le(()=>{let g,_,I,b,y,v,x,A,T;if(c===0)a!==0&&(sr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Is],i[0]=Lt(S=>(s[0]=S,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Lt(m);a=c}else{for(I=new Array(c),b=new Array(c),o&&(y=new Array(c)),v=0,x=Math.min(a,c);v<x&&r[v]===l[v];v++);for(x=a-1,A=c-1;x>=v&&A>=v&&r[x]===l[A];x--,A--)I[A]=i[x],b[A]=s[x],o&&(y[A]=o[x]);for(g=new Map,_=new Array(A+1),h=A;h>=v;h--)T=l[h],d=g.get(T),_[h]=d===void 0?-1:d,g.set(T,h);for(d=v;d<=x;d++)T=r[d],h=g.get(T),h!==void 0&&h!==-1?(I[h]=i[d],b[h]=s[d],o&&(y[h]=o[d]),h=_[h],g.set(T,h)):s[d]();for(h=v;h<c;h++)h in I?(i[h]=I[h],s[h]=b[h],o&&(o[h]=y[h],o[h](h))):i[h]=Lt(m);i=i.slice(0,a=c),r=l.slice(0)}return i});function m(g){if(s[h]=g,o){const[_,I]=O(h);return o[h]=I,e(l[h],_)}return e(l[h])}}}function f(t,e){return le(()=>t(e||{}))}const ks=t=>`Stale read from <${t}>.`;function ee(t){const e="fallback"in t&&{fallback:()=>t.fallback};return Y(Ss(()=>t.each,t.children,e||void 0))}function E(t){const e=t.keyed,n=Y(()=>t.when,void 0,void 0),r=e?n:Y(n,void 0,{equals:(i,s)=>!i==!s});return Y(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?le(()=>s(e?i:()=>{if(!le(r))throw ks("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>Y(()=>t());function $s(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,m=1,g;for(;++h<i&&h<s&&!((g=c.get(e[h]))==null||g!==d+m);)m++;if(m>d-o){const _=e[a];for(;o<d;)t.insertBefore(n[o++],_)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const ar="_$DX_DELEGATE";function Ts(t,e,n,r={}){let i;return Lt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ce(t,e=window.document){const n=e[ar]||(e[ar]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,As))}}function re(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function te(t,e){e==null?t.removeAttribute("class"):t.className=e}function he(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function Ge(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Cs(t,e,n){return le(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return Kt(t,e,r,n);k(i=>Kt(t,e(),i,n),r)}function As(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function Kt(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=Qe(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=Qe(t,n,r);else{if(s==="function")return k(()=>{let o=e();for(;typeof o=="function";)o=o();n=Kt(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Tn(o,e,n,i))return k(()=>n=Kt(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=Qe(t,n,r),a)return n}else l?n.length===0?or(t,o,r):$s(t,n,o):(n&&Qe(t),or(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=Qe(t,n,r,e);Qe(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Tn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Tn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Tn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function or(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function Qe(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Ut=null;function Rs(t){Ut=t}async function ue(t,e={}){if(!Ut)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Ut(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Ut(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function ii(){const t=await ue("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Ps(){return ue("/api/me")}async function Os(){const t=await ue("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function xs(t){const e=await ue("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Ns(t){const e=await ue("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Ds(){return await ue("/api/run",{method:"POST"})}async function Ls(){return ue("/api/progress")}async function Ms(){const t=await ue("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function Us(t){const e=await ue("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function Fs(t){const e=await ue(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Bs(){const t=await ue("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}const Vs=()=>{};var lr={};/**
+(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const _s=!1,bs=(t,e)=>t===e,Nn=Symbol("solid-proxy"),ys=typeof Proxy=="function",vs=Symbol("solid-track"),Yt={equals:bs};let ni=ai;const Ae=1,Xt=2,ri={owned:null,cleanups:null,context:null,owner:null},_n={};var G=null;let bn=null,ws=null,j=null,Z=null,Ie=null,un=0;function Ht(t,e){const n=j,r=G,i=t.length===0,s=e===void 0?r:e,a=i?ri:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>ge(()=>Et(a)));G=a,j=null;try{return Ve(o,!0)}finally{j=n,G=r}}function O(t,e){e=e?Object.assign({},Yt,e):Yt;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),si(n,i));return[ii.bind(n),r]}function Ss(t,e,n){const r=dn(t,e,!0,Ae);ft(r)}function w(t,e,n){const r=dn(t,e,!1,Ae);ft(r)}function Ke(t,e,n){ni=As;const r=dn(t,e,!1,Ae);r.user=!0,Ie?Ie.push(r):ft(r)}function Q(t,e,n){n=n?Object.assign({},Yt,n):Yt;const r=dn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,ft(r),ii.bind(r)}function $s(t){return t&&typeof t=="object"&&"then"in t}function ks(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=_n,l=!1,c="initialValue"in s,d=typeof r=="function"&&Q(r);const h=new Set,[g,_]=(s.storage||O)(s.initialValue),[b,I]=O(void 0),[y,v]=O(void 0,{equals:!1}),[S,A]=O(c?"ready":"unresolved");G&&Be(()=>{for(const M of h.keys())M.decrement();h.clear(),a=null});function T(M,p,k,U){return a===M&&(a=null,U!==void 0&&(c=!0),(M===o||p===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(U,{value:p})),o=_n,P(p,k)),p}function P(M,p){Ve(()=>{p===void 0&&_(()=>M),A(p!==void 0?"errored":c?"ready":"unresolved"),I(p);for(const k of h.keys())k.decrement();h.clear()},!1)}function E(){const M=Is,p=g(),k=b();if(k!==void 0&&!a)throw k;return j&&j.user,p}function D(M=!0){if(M!==!1&&l)return;l=!1;const p=d?d():r;if(p==null||p===!1){T(a,ge(g));return}let k;const U=o!==_n?o:ge(()=>{try{return i(p,{value:g(),refetching:M})}catch(J){k=J}});if(k!==void 0){T(a,void 0,Wt(k),p);return}else if(!$s(U))return T(a,U,void 0,p),U;return a=U,"v"in U?(U.s===1?T(a,U.v,void 0,p):T(a,void 0,Wt(U.v),p),U):(l=!0,queueMicrotask(()=>l=!1),Ve(()=>{A(c?"refreshing":"pending"),v()},!1),U.then(J=>T(U,J,void 0,p),J=>T(U,void 0,Wt(J),p)))}Object.defineProperties(E,{state:{get:()=>S()},error:{get:()=>b()},loading:{get(){const M=S();return M==="pending"||M==="refreshing"}},latest:{get(){if(!c)return E();const M=b();if(M&&!a)throw M;return g()}}});let x=G;return d?Ss(()=>(x=G,D(!1))):D(!1),[E,{refetch:M=>Es(x,()=>D(M)),mutate:_}]}function ge(t){if(j===null)return t();const e=j;j=null;try{return t()}finally{j=e}}function St(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=ge(()=>e(a,i,s));return i=a,o}}function lt(t){Ke(()=>ge(t))}function Be(t){return G===null||(G.cleanups===null?G.cleanups=[t]:G.cleanups.push(t)),t}function Es(t,e){const n=G,r=j;G=t,j=null;try{return Ve(e,!0)}catch(i){jn(i)}finally{G=n,j=r}}const[lf,cf]=O(!1);let Is;function ii(){if(this.sources&&this.state)if(this.state===Ae)ft(this);else{const t=Z;Z=null,Ve(()=>Zt(this),!1),Z=t}if(j){const t=this.observers;if(!t||t[t.length-1]!==j){const e=t?t.length:0;j.sources?(j.sources.push(this),j.sourceSlots.push(e)):(j.sources=[this],j.sourceSlots=[e]),t?(t.push(j),this.observerSlots.push(j.sources.length-1)):(this.observers=[j],this.observerSlots=[j.sources.length-1])}}return this.value}function si(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ve(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=bn&&bn.running;a&&bn.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?Z.push(s):Ie.push(s),s.observers&&oi(s)),a||(s.state=Ae)}if(Z.length>1e6)throw Z=[],new Error},!1)),e}function ft(t){if(!t.fn)return;Et(t);const e=un;Cs(t,t.value,e)}function Cs(t,e,n){let r;const i=G,s=j;j=G=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Ae,t.owned&&t.owned.forEach(Et),t.owned=null),t.updatedAt=n+1,jn(a)}finally{j=s,G=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?si(t,r):t.value=r,t.updatedAt=n)}function dn(t,e,n,r=Ae,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:G,context:G?G.context:null,pure:n};return G===null||G!==ri&&(G.owned?G.owned.push(s):G.owned=[s]),s}function Qt(t){if(t.state===0)return;if(t.state===Xt)return Zt(t);if(t.suspense&&ge(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<un);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Ae)ft(t);else if(t.state===Xt){const r=Z;Z=null,Ve(()=>Zt(t,e[0]),!1),Z=r}}function Ve(t,e){if(Z)return t();let n=!1;e||(Z=[]),Ie?n=!0:Ie=[],un++;try{const r=t();return Ts(n),r}catch(r){n||(Ie=null),Z=null,jn(r)}}function Ts(t){if(Z&&(ai(Z),Z=null),t)return;const e=Ie;Ie=null,e.length&&Ve(()=>ni(e),!1)}function ai(t){for(let e=0;e<t.length;e++)Qt(t[e])}function As(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:Qt(r)}for(e=0;e<n;e++)Qt(t[e])}function Zt(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Ae?r!==e&&(!r.updatedAt||r.updatedAt<un)&&Qt(r):i===Xt&&Zt(r,e)}}}function oi(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=Xt,n.pure?Z.push(n):Ie.push(n),n.observers&&oi(n))}}function Et(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Et(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Et(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function Wt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function jn(t,e=G){throw Wt(t)}const Ps=Symbol("fallback");function cr(t){for(let e=0;e<t.length;e++)t[e]()}function xs(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Be(()=>cr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[vs],ge(()=>{let _,b,I,y,v,S,A,T,P;if(c===0)a!==0&&(cr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ps],i[0]=Ht(E=>(s[0]=E,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Ht(g);a=c}else{for(I=new Array(c),y=new Array(c),o&&(v=new Array(c)),S=0,A=Math.min(a,c);S<A&&r[S]===l[S];S++);for(A=a-1,T=c-1;A>=S&&T>=S&&r[A]===l[T];A--,T--)I[T]=i[A],y[T]=s[A],o&&(v[T]=o[A]);for(_=new Map,b=new Array(T+1),h=T;h>=S;h--)P=l[h],d=_.get(P),b[h]=d===void 0?-1:d,_.set(P,h);for(d=S;d<=A;d++)P=r[d],h=_.get(P),h!==void 0&&h!==-1?(I[h]=i[d],y[h]=s[d],o&&(v[h]=o[d]),h=b[h],_.set(P,h)):s[d]();for(h=S;h<c;h++)h in I?(i[h]=I[h],s[h]=y[h],o&&(o[h]=v[h],o[h](h))):i[h]=Ht(g);i=i.slice(0,a=c),r=l.slice(0)}return i});function g(_){if(s[h]=_,o){const[b,I]=O(h);return o[h]=I,e(l[h],b)}return e(l[h])}}}function f(t,e){return ge(()=>t(e||{}))}function Ft(){return!0}const Rs={get(t,e,n){return e===Nn?n:t.get(e)},has(t,e){return e===Nn?!0:t.has(e)},set:Ft,deleteProperty:Ft,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Ft,deleteProperty:Ft}},ownKeys(t){return t.keys()}};function yn(t){return(t=typeof t=="function"?t():t)?t:{}}function Os(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Ns(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Nn in o,t[a]=typeof o=="function"?(e=!0,Q(o)):o}if(ys&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=yn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in yn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(yn(t[o])));return[...new Set(a)]}},Rs);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Os.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Ds=t=>`Stale read from <${t}>.`;function ie(t){const e="fallback"in t&&{fallback:()=>t.fallback};return Q(xs(()=>t.each,t.children,e||void 0))}function C(t){const e=t.keyed,n=Q(()=>t.when,void 0,void 0),r=e?n:Q(n,void 0,{equals:(i,s)=>!i==!s});return Q(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?ge(()=>s(e?i:()=>{if(!ge(r))throw Ds("Show");return n()})):s}return t.fallback},void 0,void 0)}const q=t=>Q(()=>t());function Ls(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,_;for(;++h<i&&h<s&&!((_=c.get(e[h]))==null||_!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const ur="_$DX_DELEGATE";function Ms(t,e,n,r={}){let i;return Ht(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function m(t,e,n,r){let i;const s=()=>{const o=document.createElement("template");return o.innerHTML=t,o.content.firstChild},a=()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function pe(t,e=window.document){const n=e[ur]||(e[ur]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Fs))}}function se(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function te(t,e){e==null?t.removeAttribute("class"):t.className=e}function H(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function Je(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function Us(t,e,n){return ge(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return en(t,e,r,n);w(i=>en(t,e(),i,n),r)}function Fs(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function en(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=et(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=et(t,n,r);else{if(s==="function")return w(()=>{let o=e();for(;typeof o=="function";)o=o();n=en(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Dn(o,e,n,i))return w(()=>n=en(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=et(t,n,r),a)return n}else l?n.length===0?dr(t,o,r):Ls(t,n,o):(n&&et(t),dr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=et(t,n,r,e);et(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Dn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Dn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Dn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function dr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function et(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let jt=null;function Bs(t){jt=t}async function ae(t,e={}){if(!jt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await jt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await jt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function li(){const t=await ae("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Vs(){return ae("/api/me")}async function Hs(){const t=await ae("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Ws(t){const e=await ae("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function js(t){const e=await ae("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function zs(){return await ae("/api/run",{method:"POST"})}async function Gs(){return ae("/api/progress")}async function qs(){const t=await ae("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function hr(t){const e=await ae("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function fr(t){const e=await ae(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function Ks(){const t=await ae("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function Js(t){const e=await ae("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({cash:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function Ys(t){const e=await ae("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const Xs=()=>{};var gr={};/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -13,7 +13,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const si=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Hs=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},ai={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let m=(o&15)<<2|c>>6,g=c&63;l||(g=64,a||(m=64)),r.push(n[d],n[h],n[m],n[g])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(si(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Hs(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new Ws;const m=s<<2|o>>4;if(r.push(m),c!==64){const g=o<<4&240|c>>2;if(r.push(g),h!==64){const _=c<<6&192|h;r.push(_)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ws extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const js=function(t){const e=si(t);return ai.encodeByteArray(e,!0)},oi=function(t){return js(t).replace(/\./g,"")},li=function(t){try{return ai.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
+ */const ci=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Qs=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],a=t[n++],o=t[n++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|o&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=t[n++],a=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},ui={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],a=i+1<t.length,o=a?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,d=s>>2,h=(s&3)<<4|o>>4;let g=(o&15)<<2|c>>6,_=c&63;l||(_=64,a||(g=64)),r.push(n[d],n[h],n[g],n[_])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(ci(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Qs(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const h=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||o==null||c==null||h==null)throw new Zs;const g=s<<2|o>>4;if(r.push(g),c!==64){const _=o<<4&240|c>>2;if(r.push(_),h!==64){const b=c<<6&192|h;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Zs extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ea=function(t){const e=ci(t);return ui.encodeByteArray(e,!0)},di=function(t){return ea(t).replace(/\./g,"")},hi=function(t){try{return ui.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -28,7 +28,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function zs(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
+ */function ta(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -43,7 +43,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Gs=()=>zs().__FIREBASE_DEFAULTS__,Ks=()=>{if(typeof process>"u"||typeof lr>"u")return;const t=lr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},qs=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&li(t[1]);return e&&JSON.parse(e)},Un=()=>{try{return Vs()||Gs()||Ks()||qs()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Js=t=>{var e,n;return(n=(e=Un())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},ci=()=>{var t;return(t=Un())==null?void 0:t.config},ui=t=>{var e;return(e=Un())==null?void 0:e[`_${t}`]};/**
+ */const na=()=>ta().__FIREBASE_DEFAULTS__,ra=()=>{if(typeof process>"u"||typeof gr>"u")return;const t=gr.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ia=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&hi(t[1]);return e&&JSON.parse(e)},zn=()=>{try{return Xs()||na()||ra()||ia()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},sa=t=>{var e,n;return(n=(e=zn())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},fi=()=>{var t;return(t=zn())==null?void 0:t.config},gi=t=>{var e;return(e=zn())==null?void 0:e[`_${t}`]};/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -58,7 +58,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class di{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
+ */class pi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -73,7 +73,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function X(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ys(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(X())}function Xs(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Qs(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Zs(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ea(){const t=X();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function ta(){try{return typeof indexedDB=="object"}catch{return!1}}function na(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
+ */function ee(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function aa(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ee())}function oa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function la(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function ca(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ua(){const t=ee();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function da(){try{return typeof indexedDB=="object"}catch{return!1}}function ha(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -88,7 +88,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const ra="FirebaseError";class Be extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=ra,Object.setPrototypeOf(this,Be.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,$t.prototype.create)}}class $t{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?ia(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new Be(i,o,r)}}function ia(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function sa(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function st(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(cr(s)&&cr(a)){if(!st(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function cr(t){return t!==null&&typeof t=="object"}/**
+ */const fa="FirebaseError";class He extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=fa,Object.setPrototypeOf(this,He.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Pt.prototype.create)}}class Pt{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?ga(s,r):"Error",o=`${this.serviceName}: ${a} (${i}).`;return new He(i,o,r)}}function ga(t,e){try{let n=0,r="";for(;n<t.length;){const i=t.indexOf("{$",n);if(i===-1){r+=t.substring(n);break}const s=t.indexOf("}",i+2);if(s===-1){r+=t.substring(n);break}const a=t.substring(i+2,s),o=e[a];r+=t.substring(n,i)+(o!=null?String(o):`<${a}?>`),n=s+1}return r}catch{return t}}function pa(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function ct(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],a=e[i];if(pr(s)&&pr(a)){if(!ct(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function pr(t){return t!==null&&typeof t=="object"}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -103,7 +103,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Tt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function ft(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function pt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function aa(t,e){const n=new oa(t,e);return n.subscribe.bind(n)}class oa{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");la(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=hn),i.error===void 0&&(i.error=hn),i.complete===void 0&&(i.complete=hn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function la(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function hn(){}/**
+ */function xt(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function bt(t){const e={};return t.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function yt(t){const e=t.indexOf("?");if(!e)return"";const n=t.indexOf("#",e);return t.substring(e,n>0?n:void 0)}function ma(t,e){const n=new _a(t,e);return n.subscribe.bind(n)}class _a{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");ba(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=vn),i.error===void 0&&(i.error=vn),i.complete===void 0&&(i.complete=vn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ba(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function vn(){}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -118,7 +118,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Te(t){return t&&t._delegate?t._delegate:t}/**
+ */function Pe(t){return t&&t._delegate?t._delegate:t}/**
  * @license
  * Copyright 2025 Google LLC
  *
@@ -133,7 +133,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Fn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ca(t){return(await fetch(t,{credentials:"include"})).ok}class at{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
+ */function Gn(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ya(t){return(await fetch(t,{credentials:"include"})).ok}class ut{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -148,7 +148,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const We="[DEFAULT]";/**
+ */const Ge="[DEFAULT]";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -163,7 +163,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class ua{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new di;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ha(e))try{this.getOrInitializeService({instanceIdentifier:We})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=We){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=We){return this.instances.has(e)}getOptions(e=We){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:da(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=We){return this.component?this.component.multipleInstances?e:We:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function da(t){return t===We?void 0:t}function ha(t){return t.instantiationMode==="EAGER"}/**
+ */class va{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new pi;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Sa(e))try{this.getOrInitializeService({instanceIdentifier:Ge})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Ge){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ge){return this.instances.has(e)}getOptions(e=Ge){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(s);r===o&&a.resolve(i)}return i}onInit(e,n){const r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:wa(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ge){return this.component?this.component.multipleInstances?e:Ge:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function wa(t){return t===Ge?void 0:t}function Sa(t){return t.instantiationMode==="EAGER"}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -178,7 +178,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class fa{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new ua(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
+ */class $a{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new va(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -193,7 +193,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */var H;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(H||(H={}));const pa={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},ga=H.INFO,ma={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},_a=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=ma[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class hi{constructor(e){this.name=e,this._logLevel=ga,this._logHandler=_a,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?pa[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const ba=(t,e)=>e.some(n=>t instanceof n);let ur,dr;function ya(){return ur||(ur=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function wa(){return dr||(dr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const fi=new WeakMap,Cn=new WeakMap,pi=new WeakMap,fn=new WeakMap,Bn=new WeakMap;function va(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Me(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&fi.set(n,t)}).catch(()=>{}),Bn.set(e,t),e}function Ea(t){if(Cn.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Cn.set(t,e)}let An={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Cn.get(t);if(e==="objectStoreNames")return t.objectStoreNames||pi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Me(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ia(t){An=t(An)}function Sa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(pn(this),e,...n);return pi.set(r,e.sort?e.sort():[e]),Me(r)}:wa().includes(t)?function(...e){return t.apply(pn(this),e),Me(fi.get(this))}:function(...e){return Me(t.apply(pn(this),e))}}function ka(t){return typeof t=="function"?Sa(t):(t instanceof IDBTransaction&&Ea(t),ba(t,ya())?new Proxy(t,An):t)}function Me(t){if(t instanceof IDBRequest)return va(t);if(fn.has(t))return fn.get(t);const e=ka(t);return e!==t&&(fn.set(t,e),Bn.set(e,t)),e}const pn=t=>Bn.get(t);function $a(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Me(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Me(a.result),l.oldVersion,l.newVersion,Me(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ta=["get","getKey","getAll","getAllKeys","count"],Ca=["put","add","delete","clear"],gn=new Map;function hr(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(gn.get(e))return gn.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ca.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ta.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return gn.set(e,s),s}Ia(t=>({...t,get:(e,n,r)=>hr(e,n)||t.get(e,n,r),has:(e,n)=>!!hr(e,n)||t.has(e,n)}));/**
+ */var W;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(W||(W={}));const ka={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},Ea=W.INFO,Ia={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},Ca=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=Ia[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class mi{constructor(e){this.name=e,this._logLevel=Ea,this._logHandler=Ca,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in W))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ka[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...e),this._logHandler(this,W.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...e),this._logHandler(this,W.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,W.INFO,...e),this._logHandler(this,W.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,W.WARN,...e),this._logHandler(this,W.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...e),this._logHandler(this,W.ERROR,...e)}}const Ta=(t,e)=>e.some(n=>t instanceof n);let mr,_r;function Aa(){return mr||(mr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Pa(){return _r||(_r=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const _i=new WeakMap,Ln=new WeakMap,bi=new WeakMap,wn=new WeakMap,qn=new WeakMap;function xa(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",a)},s=()=>{n(Fe(t.result)),i()},a=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&_i.set(n,t)}).catch(()=>{}),qn.set(e,t),e}function Ra(t){if(Ln.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",a),t.removeEventListener("abort",a)},s=()=>{n(),i()},a=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",a),t.addEventListener("abort",a)});Ln.set(t,e)}let Mn={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ln.get(t);if(e==="objectStoreNames")return t.objectStoreNames||bi.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Fe(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Oa(t){Mn=t(Mn)}function Na(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(Sn(this),e,...n);return bi.set(r,e.sort?e.sort():[e]),Fe(r)}:Pa().includes(t)?function(...e){return t.apply(Sn(this),e),Fe(_i.get(this))}:function(...e){return Fe(t.apply(Sn(this),e))}}function Da(t){return typeof t=="function"?Na(t):(t instanceof IDBTransaction&&Ra(t),Ta(t,Aa())?new Proxy(t,Mn):t)}function Fe(t){if(t instanceof IDBRequest)return xa(t);if(wn.has(t))return wn.get(t);const e=Da(t);return e!==t&&(wn.set(t,e),qn.set(e,t)),e}const Sn=t=>qn.get(t);function La(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const a=indexedDB.open(t,e),o=Fe(a);return r&&a.addEventListener("upgradeneeded",l=>{r(Fe(a.result),l.oldVersion,l.newVersion,Fe(a.transaction),l)}),n&&a.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),o.then(l=>{s&&l.addEventListener("close",()=>s()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),o}const Ma=["get","getKey","getAll","getAllKeys","count"],Ua=["put","add","delete","clear"],$n=new Map;function br(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if($n.get(e))return $n.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=Ua.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Ma.includes(n)))return;const s=async function(a,...o){const l=this.transaction(a,i?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(o.shift())),(await Promise.all([c[n](...o),i&&l.done]))[0]};return $n.set(e,s),s}Oa(t=>({...t,get:(e,n,r)=>br(e,n)||t.get(e,n,r),has:(e,n)=>!!br(e,n)||t.has(e,n)}));/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -208,7 +208,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Aa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Ra(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Ra(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Rn="@firebase/app",fr="0.16.1";/**
+ */class Fa{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Ba(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Ba(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Un="@firebase/app",yr="0.16.1";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -223,7 +223,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Se=new hi("@firebase/app"),Pa="@firebase/app-compat",Oa="@firebase/analytics-compat",xa="@firebase/analytics",Na="@firebase/app-check-compat",Da="@firebase/app-check",La="@firebase/auth",Ma="@firebase/auth-compat",Ua="@firebase/database",Fa="@firebase/data-connect",Ba="@firebase/database-compat",Va="@firebase/functions",Ha="@firebase/functions-compat",Wa="@firebase/installations",ja="@firebase/installations-compat",za="@firebase/messaging",Ga="@firebase/messaging-compat",Ka="@firebase/performance",qa="@firebase/performance-compat",Ja="@firebase/remote-config",Ya="@firebase/remote-config-compat",Xa="@firebase/storage",Qa="@firebase/storage-compat",Za="@firebase/firestore",eo="@firebase/ai",to="@firebase/firestore-compat",no="firebase",ro="12.18.0";/**
+ */const Ce=new mi("@firebase/app"),Va="@firebase/app-compat",Ha="@firebase/analytics-compat",Wa="@firebase/analytics",ja="@firebase/app-check-compat",za="@firebase/app-check",Ga="@firebase/auth",qa="@firebase/auth-compat",Ka="@firebase/database",Ja="@firebase/data-connect",Ya="@firebase/database-compat",Xa="@firebase/functions",Qa="@firebase/functions-compat",Za="@firebase/installations",eo="@firebase/installations-compat",to="@firebase/messaging",no="@firebase/messaging-compat",ro="@firebase/performance",io="@firebase/performance-compat",so="@firebase/remote-config",ao="@firebase/remote-config-compat",oo="@firebase/storage",lo="@firebase/storage-compat",co="@firebase/firestore",uo="@firebase/ai",ho="@firebase/firestore-compat",fo="firebase",go="12.18.0";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -238,7 +238,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Pn="[DEFAULT]",io={[Rn]:"fire-core",[Pa]:"fire-core-compat",[xa]:"fire-analytics",[Oa]:"fire-analytics-compat",[Da]:"fire-app-check",[Na]:"fire-app-check-compat",[La]:"fire-auth",[Ma]:"fire-auth-compat",[Ua]:"fire-rtdb",[Fa]:"fire-data-connect",[Ba]:"fire-rtdb-compat",[Va]:"fire-fn",[Ha]:"fire-fn-compat",[Wa]:"fire-iid",[ja]:"fire-iid-compat",[za]:"fire-fcm",[Ga]:"fire-fcm-compat",[Ka]:"fire-perf",[qa]:"fire-perf-compat",[Ja]:"fire-rc",[Ya]:"fire-rc-compat",[Xa]:"fire-gcs",[Qa]:"fire-gcs-compat",[Za]:"fire-fst",[to]:"fire-fst-compat",[eo]:"fire-vertex","fire-js":"fire-js",[no]:"fire-js-all"};/**
+ */const Fn="[DEFAULT]",po={[Un]:"fire-core",[Va]:"fire-core-compat",[Wa]:"fire-analytics",[Ha]:"fire-analytics-compat",[za]:"fire-app-check",[ja]:"fire-app-check-compat",[Ga]:"fire-auth",[qa]:"fire-auth-compat",[Ka]:"fire-rtdb",[Ja]:"fire-data-connect",[Ya]:"fire-rtdb-compat",[Xa]:"fire-fn",[Qa]:"fire-fn-compat",[Za]:"fire-iid",[eo]:"fire-iid-compat",[to]:"fire-fcm",[no]:"fire-fcm-compat",[ro]:"fire-perf",[io]:"fire-perf-compat",[so]:"fire-rc",[ao]:"fire-rc-compat",[oo]:"fire-gcs",[lo]:"fire-gcs-compat",[co]:"fire-fst",[ho]:"fire-fst-compat",[uo]:"fire-vertex","fire-js":"fire-js",[fo]:"fire-js-all"};/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -253,7 +253,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const qt=new Map,so=new Map,On=new Map;function pr(t,e){try{t.container.addComponent(e)}catch(n){Se.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Et(t){const e=t.name;if(On.has(e))return Se.debug(`There were multiple attempts to register component ${e}.`),!1;On.set(e,t);for(const n of qt.values())pr(n,t);for(const n of so.values())pr(n,t);return!0}function gi(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Z(t){return t==null?!1:t.settings!==void 0}/**
+ */const tn=new Map,mo=new Map,Bn=new Map;function vr(t,e){try{t.container.addComponent(e)}catch(n){Ce.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function It(t){const e=t.name;if(Bn.has(e))return Ce.debug(`There were multiple attempts to register component ${e}.`),!1;Bn.set(e,t);for(const n of tn.values())vr(n,t);for(const n of mo.values())vr(n,t);return!0}function yi(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function re(t){return t==null?!1:t.settings!==void 0}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -268,7 +268,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const ao={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ye=new $t("app","Firebase",ao);/**
+ */const _o={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Se=new Pt("app","Firebase",_o);/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -283,7 +283,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class oo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new at("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ye.create("app-deleted",{appName:this._name})}}/**
+ */class bo{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ut("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Se.create("app-deleted",{appName:this._name})}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -298,7 +298,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ct=ro;function mi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Pn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw ye.create("bad-app-name",{appName:String(i)});if(n||(n=ci()),!n)throw ye.create("no-options");const s=qt.get(i);if(s)if(st(n,s.options)){if(st(r,s.config))return s;throw ye.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw ye.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new fa(i);for(const l of On.values())a.addComponent(l);const o=new oo(n,r,a);return qt.set(i,o),o}function lo(t=Pn){const e=qt.get(t);if(!e&&t===Pn&&ci())return mi();if(!e)throw ye.create("no-app",{appName:t});return e}function tt(t,e,n){let r=io[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Se.warn(a.join(" "));return}Et(new at(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
+ */const Rt=go;function vi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r={name:Fn,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw Se.create("bad-app-name",{appName:String(i)});if(n||(n=fi()),!n)throw Se.create("no-options");const s=tn.get(i);if(s)if(ct(n,s.options)){if(ct(r,s.config))return s;throw Se.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw Se.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const a=new $a(i);for(const l of Bn.values())a.addComponent(l);const o=new bo(n,r,a);return tn.set(i,o),o}function yo(t=Fn){const e=tn.get(t);if(!e&&t===Fn&&fi())return vi();if(!e)throw Se.create("no-app",{appName:t});return e}function rt(t,e,n){let r=po[t]??t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const a=[`Unable to register library "${r}" with version "${e}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&a.push("and"),s&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ce.warn(a.join(" "));return}It(new ut(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -313,7 +313,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const co="firebase-heartbeat-database",uo=1,It="firebase-heartbeat-store";let mn=null;function _i(){return mn||(mn=$a(co,uo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(It)}catch(n){console.warn(n)}}}}).catch(t=>{throw ye.create("idb-open",{originalErrorMessage:t.message})})),mn}async function ho(t){try{const n=(await _i()).transaction(It),r=await n.objectStore(It).get(bi(t));return await n.done,r}catch(e){if(e instanceof Be)Se.warn(e.message);else{const n=ye.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Se.warn(n.message)}}}async function gr(t,e){try{const r=(await _i()).transaction(It,"readwrite");await r.objectStore(It).put(e,bi(t)),await r.done}catch(n){if(n instanceof Be)Se.warn(n.message);else{const r=ye.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Se.warn(r.message)}}}function bi(t){return`${t.name}!${t.options.appId}`}/**
+ */const vo="firebase-heartbeat-database",wo=1,Ct="firebase-heartbeat-store";let kn=null;function wi(){return kn||(kn=La(vo,wo,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(Ct)}catch(n){console.warn(n)}}}}).catch(t=>{throw Se.create("idb-open",{originalErrorMessage:t.message})})),kn}async function So(t){try{const n=(await wi()).transaction(Ct),r=await n.objectStore(Ct).get(Si(t));return await n.done,r}catch(e){if(e instanceof He)Ce.warn(e.message);else{const n=Se.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});Ce.warn(n.message)}}}async function wr(t,e){try{const r=(await wi()).transaction(Ct,"readwrite");await r.objectStore(Ct).put(e,Si(t)),await r.done}catch(n){if(n instanceof He)Ce.warn(n.message);else{const r=Se.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});Ce.warn(r.message)}}}function Si(t){return`${t.name}!${t.options.appId}`}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -328,7 +328,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const fo=1024,po=30;class go{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new _o(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=mr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>po){const a=bo(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Se.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=mr(),{heartbeatsToSend:r,unsentEntries:i}=mo(this._heartbeatsCache.heartbeats),s=oi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Se.warn(n),""}}}function mr(){return new Date().toISOString().substring(0,10)}function mo(t,e=fo){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),_r(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),_r(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class _o{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return ta()?na().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ho(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return gr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return gr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function _r(t){return oi(JSON.stringify({version:2,heartbeats:t})).length}function bo(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
+ */const $o=1024,ko=30;class Eo{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Co(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Sr();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>ko){const a=To(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Ce.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Sr(),{heartbeatsToSend:r,unsentEntries:i}=Io(this._heartbeatsCache.heartbeats),s=di(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return Ce.warn(n),""}}}function Sr(){return new Date().toISOString().substring(0,10)}function Io(t,e=$o){const n=[];let r=t.slice();for(const i of t){const s=n.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),$r(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),$r(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class Co{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return da()?ha().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await So(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return wr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return wr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function $r(t){return di(JSON.stringify({version:2,heartbeats:t})).length}function To(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -343,7 +343,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function yo(t){Et(new at("platform-logger",e=>new Aa(e),"PRIVATE")),Et(new at("heartbeat",e=>new go(e),"PRIVATE")),tt(Rn,fr,t),tt(Rn,fr,"esm2020"),tt("fire-js","")}/**
+ */function Ao(t){It(new ut("platform-logger",e=>new Fa(e),"PRIVATE")),It(new ut("heartbeat",e=>new Eo(e),"PRIVATE")),rt(Un,yr,t),rt(Un,yr,"esm2020"),rt("fire-js","")}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -358,7 +358,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */yo("");var wo="firebase",vo="12.18.0";/**
+ */Ao("");var Po="firebase",xo="12.18.0";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -373,7 +373,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */tt(wo,vo,"app");function yi(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Eo=yi,wi=new $t("auth","Firebase",yi());/**
+ */rt(Po,xo,"app");function $i(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ro=$i,ki=new Pt("auth","Firebase",$i());/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -388,7 +388,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Jt=new hi("@firebase/auth");function vi(t,...e){Jt.logLevel<=H.WARN&&Jt.warn(`Auth (${Ct}): ${t}`,...e)}function Ft(t,...e){Jt.logLevel<=H.ERROR&&Jt.error(`Auth (${Ct}): ${t}`,...e)}/**
+ */const nn=new mi("@firebase/auth");function Ei(t,...e){nn.logLevel<=W.WARN&&nn.warn(`Auth (${Rt}): ${t}`,...e)}function zt(t,...e){nn.logLevel<=W.ERROR&&nn.error(`Auth (${Rt}): ${t}`,...e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -403,7 +403,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ie(t,...e){throw Hn(t,...e)}function oe(t,...e){return Hn(t,...e)}function Vn(t,e,n){const r={...Eo(),[e]:n};return new $t("auth","Firebase",r).create(e,{appName:t.name})}function fe(t){return Vn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ei(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&ie(t,"argument-error"),Vn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Hn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return wi.create(t,...e)}function C(t,e,...n){if(!t)throw Hn(e,...n)}function we(t){const e="INTERNAL ASSERTION FAILED: "+t;throw Ft(e),new Error(e)}function ke(t,e){t||we(e)}/**
+ */function le(t,...e){throw Jn(t,...e)}function he(t,...e){return Jn(t,...e)}function Kn(t,e,n){const r={...Ro(),[e]:n};return new Pt("auth","Firebase",r).create(e,{appName:t.name})}function be(t){return Kn(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Ii(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&le(t,"argument-error"),Kn(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Jn(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return ki.create(t,...e)}function L(t,e,...n){if(!t)throw Jn(e,...n)}function $e(t){const e="INTERNAL ASSERTION FAILED: "+t;throw zt(e),new Error(e)}function Te(t,e){t||$e(e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -418,7 +418,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function xn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Io(){return br()==="http:"||br()==="https:"}function br(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
+ */function Vn(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.href)||""}function Oo(){return kr()==="http:"||kr()==="https:"}function kr(){var t;return typeof self<"u"&&((t=self.location)==null?void 0:t.protocol)||null}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -433,7 +433,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function So(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Io()||Qs()||"connection"in navigator)?navigator.onLine:!0}function ko(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
+ */function No(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Oo()||la()||"connection"in navigator)?navigator.onLine:!0}function Do(){if(typeof navigator>"u")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -448,7 +448,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class At{constructor(e,n){this.shortDelay=e,this.longDelay=n,ke(n>e,"Short delay should be less than long delay!"),this.isMobile=Ys()||Zs()}get(){return So()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
+ */class Ot{constructor(e,n){this.shortDelay=e,this.longDelay=n,Te(n>e,"Short delay should be less than long delay!"),this.isMobile=aa()||ca()}get(){return No()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -463,7 +463,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Wn(t,e){ke(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
+ */function Yn(t,e){Te(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -478,7 +478,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ii{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;we("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;we("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;we("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
+ */class Ci{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;$e("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;$e("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;$e("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -493,7 +493,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const $o={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
+ */const Lo={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -508,7 +508,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const To=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Co=new At(3e4,6e4);function Ve(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function He(t,e,n,r,i={}){return Si(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=Tt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return Xs()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Fn(t.emulatorConfig.host)&&(c.credentials="include"),Ii.fetch()(await ki(t,t.config.apiHost,n,o),c)})}async function Si(t,e,n){t._canInitEmulator=!1;const r={...$o,...e};try{const i=new Ro(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Nt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Nt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Nt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Nt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Vn(t,d,c);ie(t,d)}}catch(i){if(i instanceof Be)throw i;ie(t,"network-request-failed",{message:String(i)})}}async function Rt(t,e,n,r,i={}){const s=await He(t,e,n,r,i);return"mfaPendingCredential"in s&&ie(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function ki(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Wn(t.config,i):`${t.config.apiScheme}://${i}`;return To.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Ao(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Ro{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(oe(this.auth,"network-request-failed")),Co.get())})}}function Nt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=oe(t,e,r);return i.customData._tokenResponse=n,i}function yr(t){return t!==void 0&&t.enterprise!==void 0}class Po{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Ao(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Oo(t,e){return He(t,"GET","/v2/recaptchaConfig",Ve(t,e))}/**
+ */const Mo=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Uo=new Ot(3e4,6e4);function We(t,e){return t.tenantId&&!e.tenantId?{...e,tenantId:t.tenantId}:e}async function je(t,e,n,r,i={}){return Ti(t,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const o=xt({...a,key:t.config.apiKey}).slice(1),l=await t._getAdditionalHeaders();l["Content-Type"]="application/json",t.languageCode&&(l["X-Firebase-Locale"]=t.languageCode);const c={method:e,headers:l,...s};return oa()||(c.referrerPolicy="strict-origin-when-cross-origin"),t.emulatorConfig&&Gn(t.emulatorConfig.host)&&(c.credentials="include"),Ci.fetch()(await Ai(t,t.config.apiHost,n,o),c)})}async function Ti(t,e,n){t._canInitEmulator=!1;const r={...Lo,...e};try{const i=new Bo(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Bt(t,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const o=s.ok?a.errorMessage:a.error.message,[l,c]=o.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Bt(t,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Bt(t,"email-already-in-use",a);if(l==="USER_DISABLED")throw Bt(t,"user-disabled",a);const d=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Kn(t,d,c);le(t,d)}}catch(i){if(i instanceof He)throw i;le(t,"network-request-failed",{message:String(i)})}}async function Nt(t,e,n,r,i={}){const s=await je(t,e,n,r,i);return"mfaPendingCredential"in s&&le(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function Ai(t,e,n,r){const i=`${e}${n}?${r}`,s=t,a=s.config.emulator?Yn(t.config,i):`${t.config.apiScheme}://${i}`;return Mo.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}function Fo(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Bo{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(he(this.auth,"network-request-failed")),Uo.get())})}}function Bt(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=he(t,e,r);return i.customData._tokenResponse=n,i}function Er(t){return t!==void 0&&t.enterprise!==void 0}class Vo{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return Fo(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Ho(t,e){return je(t,"GET","/v2/recaptchaConfig",We(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -523,7 +523,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function xo(t,e){return He(t,"POST","/v1/accounts:delete",e)}async function Yt(t,e){return He(t,"POST","/v1/accounts:lookup",e)}/**
+ */async function Wo(t,e){return je(t,"POST","/v1/accounts:delete",e)}async function rn(t,e){return je(t,"POST","/v1/accounts:lookup",e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -538,7 +538,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function bt(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function No(t,e=!1){const n=Te(t),r=await n.getIdToken(e),i=jn(r);C(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:bt(_n(i.auth_time)),issuedAtTime:bt(_n(i.iat)),expirationTime:bt(_n(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function _n(t){return Number(t)*1e3}function jn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return Ft("JWT malformed, contained fewer than 3 sections"),null;try{const i=li(n);return i?JSON.parse(i):(Ft("Failed to decode base64 JWT payload"),null)}catch(i){return Ft("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function wr(t){const e=jn(t);return C(e,"internal-error"),C(typeof e.exp<"u","internal-error"),C(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
+ */function $t(t){if(t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function jo(t,e=!1){const n=Pe(t),r=await n.getIdToken(e),i=Xn(r);L(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:$t(En(i.auth_time)),issuedAtTime:$t(En(i.iat)),expirationTime:$t(En(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function En(t){return Number(t)*1e3}function Xn(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return zt("JWT malformed, contained fewer than 3 sections"),null;try{const i=hi(n);return i?JSON.parse(i):(zt("Failed to decode base64 JWT payload"),null)}catch(i){return zt("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function Ir(t){const e=Xn(t);return L(e,"internal-error"),L(typeof e.exp<"u","internal-error"),L(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -553,7 +553,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function St(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Be&&Do(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function Do({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
+ */async function Tt(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof He&&zo(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function zo({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -568,7 +568,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Lo{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
+ */class Go{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -583,7 +583,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Nn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=bt(this.lastLoginAt),this.creationTime=bt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
+ */class Hn{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=$t(this.lastLoginAt),this.creationTime=$t(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -598,7 +598,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Xt(t){var h;const e=t.auth,n=await t.getIdToken(),r=await St(t,Yt(e,{idToken:n}));C(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?$i(i.providerUserInfo):[],a=Uo(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Nn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function Mo(t){const e=Te(t);await Xt(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Uo(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function $i(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
+ */async function sn(t){var h;const e=t.auth,n=await t.getIdToken(),r=await Tt(t,rn(e,{idToken:n}));L(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=(h=i.providerUserInfo)!=null&&h.length?Pi(i.providerUserInfo):[],a=Ko(t.providerData,s),o=t.isAnonymous,l=!(t.email&&i.passwordHash)&&!(a!=null&&a.length),c=o?l:!1,d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new Hn(i.createdAt,i.lastLoginAt),isAnonymous:c};Object.assign(t,d)}async function qo(t){const e=Pe(t);await sn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ko(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Pi(t){return t.map(({providerId:e,...n})=>({providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -613,7 +613,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Fo(t,e){const n=await Si(t,{},async()=>{const r=Tt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await ki(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Fn(t.emulatorConfig.host)&&(l.credentials="include"),Ii.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Bo(t,e){return He(t,"POST","/v2/accounts:revokeToken",Ve(t,e))}/**
+ */async function Jo(t,e){const n=await Ti(t,{},async()=>{const r=xt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,a=await Ai(t,i,"/v1/token",`key=${s}`),o=await t._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:o,body:r};return t.emulatorConfig&&Gn(t.emulatorConfig.host)&&(l.credentials="include"),Ci.fetch()(a,l)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Yo(t,e){return je(t,"POST","/v2/accounts:revokeToken",We(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -628,7 +628,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class nt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){C(e.idToken,"internal-error"),C(typeof e.idToken<"u","internal-error"),C(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):wr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){C(e.length!==0,"internal-error");const n=wr(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(C(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Fo(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new nt;return r&&(C(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(C(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(C(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new nt,this.toJSON())}_performRefresh(){return we("not implemented")}}/**
+ */class it{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){L(e.idToken,"internal-error"),L(typeof e.idToken<"u","internal-error"),L(typeof e.refreshToken<"u","internal-error");const n="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ir(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){L(e.length!==0,"internal-error");const n=Ir(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(L(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await Jo(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,a=new it;return r&&(L(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(L(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(L(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new it,this.toJSON())}_performRefresh(){return $e("not implemented")}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -643,7 +643,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Oe(t,e){C(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class ae{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Lo(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Nn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await St(this,this.stsTokenManager.getToken(this.auth,e));return C(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return No(this,e)}reload(){return Mo(this)}_assign(e){this!==e&&(C(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new ae({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){C(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await Xt(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Z(this.auth.app))return Promise.reject(fe(this.auth));const e=await this.getIdToken();return await St(this,xo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:m,isAnonymous:g,providerData:_,stsTokenManager:I}=n;C(h&&I,e,"internal-error");const b=nt.fromJSON(this.name,I);C(typeof h=="string",e,"internal-error"),Oe(r,e.name),Oe(i,e.name),C(typeof m=="boolean",e,"internal-error"),C(typeof g=="boolean",e,"internal-error"),Oe(s,e.name),Oe(a,e.name),Oe(o,e.name),Oe(l,e.name),Oe(c,e.name),Oe(d,e.name);const y=new ae({uid:h,auth:e,email:i,emailVerified:m,displayName:r,isAnonymous:g,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:b,createdAt:c,lastLoginAt:d});return _&&Array.isArray(_)&&(y.providerData=_.map(v=>({...v}))),l&&(y._redirectEventId=l),y}static async _fromIdTokenResponse(e,n,r=!1){const i=new nt;i.updateFromServerResponse(n);const s=new ae({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Xt(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];C(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?$i(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new nt;o.updateFromIdToken(r);const l=new ae({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Nn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
+ */function Ne(t,e){L(typeof t=="string"||typeof t>"u","internal-error",{appName:e})}class de{constructor({uid:e,auth:n,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Go(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Hn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await Tt(this,this.stsTokenManager.getToken(this.auth,e));return L(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return jo(this,e)}reload(){return qo(this)}_assign(e){this!==e&&(L(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>({...n})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new de({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){L(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await sn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(re(this.auth.app))return Promise.reject(be(this.auth));const e=await this.getIdToken();return await Tt(this,Wo(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){const r=n.displayName??void 0,i=n.email??void 0,s=n.phoneNumber??void 0,a=n.photoURL??void 0,o=n.tenantId??void 0,l=n._redirectEventId??void 0,c=n.createdAt??void 0,d=n.lastLoginAt??void 0,{uid:h,emailVerified:g,isAnonymous:_,providerData:b,stsTokenManager:I}=n;L(h&&I,e,"internal-error");const y=it.fromJSON(this.name,I);L(typeof h=="string",e,"internal-error"),Ne(r,e.name),Ne(i,e.name),L(typeof g=="boolean",e,"internal-error"),L(typeof _=="boolean",e,"internal-error"),Ne(s,e.name),Ne(a,e.name),Ne(o,e.name),Ne(l,e.name),Ne(c,e.name),Ne(d,e.name);const v=new de({uid:h,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:_,photoURL:a,phoneNumber:s,tenantId:o,stsTokenManager:y,createdAt:c,lastLoginAt:d});return b&&Array.isArray(b)&&(v.providerData=b.map(S=>({...S}))),l&&(v._redirectEventId=l),v}static async _fromIdTokenResponse(e,n,r=!1){const i=new it;i.updateFromServerResponse(n);const s=new de({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await sn(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];L(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Pi(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),o=new it;o.updateFromIdToken(r);const l=new de({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:a}),c={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Hn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,c),l}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -658,7 +658,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const vr=new Map;function ve(t){ke(t instanceof Function,"Expected a class definition");let e=vr.get(t);return e?(ke(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,vr.set(t,e),e)}/**
+ */const Cr=new Map;function ke(t){Te(t instanceof Function,"Expected a class definition");let e=Cr.get(t);return e?(Te(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,Cr.set(t,e),e)}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -673,7 +673,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ti{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}Ti.type="NONE";const Er=Ti;/**
+ */class xi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}xi.type="NONE";const Tr=xi;/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -688,7 +688,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Bt(t,e,n){return`firebase:${t}:${e}:${n}`}class rt{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Bt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Bt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await Yt(this.auth,{idToken:e}).catch(()=>{});return n?ae._fromGetAccountInfoResponse(this.auth,n,e):null}return ae._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new rt(ve(Er),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||ve(Er);const a=Bt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const m=await Yt(e,{idToken:d}).catch(()=>{});if(!m)break;h=await ae._fromGetAccountInfoResponse(e,m,d)}else h=ae._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new rt(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new rt(s,e,r))}}/**
+ */function Gt(t,e,n){return`firebase:${t}:${e}:${n}`}class st{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Gt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Gt("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await rn(this.auth,{idToken:e}).catch(()=>{});return n?de._fromGetAccountInfoResponse(this.auth,n,e):null}return de._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new st(ke(Tr),e,r);const i=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let s=i[0]||ke(Tr);const a=Gt(r,e.config.apiKey,e.name);let o=null;for(const c of n)try{const d=await c._get(a);if(d){let h;if(typeof d=="string"){const g=await rn(e,{idToken:d}).catch(()=>{});if(!g)break;h=await de._fromGetAccountInfoResponse(e,g,d)}else h=de._fromJSON(e,d);c!==s&&(o=h),s=c;break}}catch{}const l=i.filter(c=>c._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new st(s,e,r):(s=l[0],o&&await s._set(a,o.toJSON()),await Promise.all(n.map(async c=>{if(c!==s)try{await c._remove(a)}catch{}})),new st(s,e,r))}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -703,7 +703,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Ir(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Pi(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ci(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(xi(e))return"Blackberry";if(Ni(e))return"Webos";if(Ai(e))return"Safari";if((e.includes("chrome/")||Ri(e))&&!e.includes("edge/"))return"Chrome";if(Oi(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ci(t=X()){return/firefox\//i.test(t)}function Ai(t=X()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ri(t=X()){return/crios\//i.test(t)}function Pi(t=X()){return/iemobile/i.test(t)}function Oi(t=X()){return/android/i.test(t)}function xi(t=X()){return/blackberry/i.test(t)}function Ni(t=X()){return/webos/i.test(t)}function zn(t=X()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Vo(t=X()){var e;return zn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Ho(){return ea()&&document.documentMode===10}function Di(t=X()){return zn(t)||Oi(t)||Ni(t)||xi(t)||/windows phone/i.test(t)||Pi(t)}/**
+ */function Ar(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Di(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Ri(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Mi(e))return"Blackberry";if(Ui(e))return"Webos";if(Oi(e))return"Safari";if((e.includes("chrome/")||Ni(e))&&!e.includes("edge/"))return"Chrome";if(Li(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Ri(t=ee()){return/firefox\//i.test(t)}function Oi(t=ee()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ni(t=ee()){return/crios\//i.test(t)}function Di(t=ee()){return/iemobile/i.test(t)}function Li(t=ee()){return/android/i.test(t)}function Mi(t=ee()){return/blackberry/i.test(t)}function Ui(t=ee()){return/webos/i.test(t)}function Qn(t=ee()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function Xo(t=ee()){var e;return Qn(t)&&!!((e=window.navigator)!=null&&e.standalone)}function Qo(){return ua()&&document.documentMode===10}function Fi(t=ee()){return Qn(t)||Li(t)||Ui(t)||Mi(t)||/windows phone/i.test(t)||Di(t)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -718,7 +718,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Li(t,e=[]){let n;switch(t){case"Browser":n=Ir(X());break;case"Worker":n=`${Ir(X())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ct}/${r}`}/**
+ */function Bi(t,e=[]){let n;switch(t){case"Browser":n=Ar(ee());break;case"Worker":n=`${Ar(ee())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${Rt}/${r}`}/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -733,7 +733,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Wo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
+ */class Zo{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((a,o)=>{try{const l=e(s);a(l)}catch(l){o(l)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
  * @license
  * Copyright 2023 Google LLC
  *
@@ -748,7 +748,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function jo(t,e={}){return He(t,"GET","/v2/passwordPolicy",Ve(t,e))}/**
+ */async function el(t,e={}){return je(t,"GET","/v2/passwordPolicy",We(t,e))}/**
  * @license
  * Copyright 2023 Google LLC
  *
@@ -763,7 +763,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const zo=6;class Go{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??zo,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
+ */const tl=6;class nl{constructor(e){var r;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??tl,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -778,7 +778,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ko{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Sr(this),this.idTokenSubscription=new Sr(this),this.beforeStateQueue=new Wo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=wi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ve(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await rt.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await Yt(this,{idToken:e}),r=await ae._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(Z(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return C(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await Xt(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ko()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Z(this.app))return Promise.reject(fe(this));const n=e?Te(e):null;return n&&C(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&C(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Z(this.app)?Promise.reject(fe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Z(this.app)?Promise.reject(fe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ve(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await jo(this),n=new Go(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new $t("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Bo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ve(e)||this._popupRedirectResolver;C(n,this,"argument-error"),this.redirectPersistenceManager=await rt.create(this,[ve(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(C(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return C(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Li(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(Z(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&vi(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function Ce(t){return Te(t)}class Sr{constructor(e){this.auth=e,this.observer=null,this.addObserver=aa(n=>this.observer=n)}get next(){return C(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
+ */class rl{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Pr(this),this.idTokenSubscription=new Pr(this),this.beforeStateQueue=new Zo(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ki,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=ke(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await st.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)!=null&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await rn(this,{idToken:e}),r=await de._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(re(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(o,o))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(s=this.redirectUser)==null?void 0:s._redirectEventId,o=r==null?void 0:r._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===o)&&(l!=null&&l.user)&&(r=l.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(a){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return L(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await sn(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Do()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(re(this.app))return Promise.reject(be(this));const n=e?Pe(e):null;return n&&L(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&L(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return re(this.app)?Promise.reject(be(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return re(this.app)?Promise.reject(be(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ke(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await el(this),n=new nl(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Pt("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await Yo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&ke(e)||this._popupRedirectResolver;L(n,this,"argument-error"),this.redirectPersistenceManager=await st.create(this,[ke(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((n=this.currentUser)==null?void 0:n.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let a=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(L(o,this,"internal-error"),o.then(()=>{a||s(this.currentUser)}),typeof n=="function"){const l=e.addObserver(n,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(n);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return L(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Bi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(re(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return e!=null&&e.error&&Ei(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function xe(t){return Pe(t)}class Pr{constructor(e){this.auth=e,this.observer=null,this.addObserver=ma(n=>this.observer=n)}get next(){return L(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -793,7 +793,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */let sn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function qo(t){sn=t}function Mi(t){return sn.loadJS(t)}function Jo(){return sn.recaptchaEnterpriseScript}function Yo(){return sn.gapiScript}function Xo(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class Qo{constructor(){this.enterprise=new Zo}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class Zo{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
+ */let hn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function il(t){hn=t}function Vi(t){return hn.loadJS(t)}function sl(){return hn.recaptchaEnterpriseScript}function al(){return hn.gapiScript}function ol(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class ll{constructor(){this.enterprise=new cl}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class cl{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}/**
  * @license
  * Copyright 2022 Google LLC
  *
@@ -808,7 +808,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const el="recaptcha-enterprise",Ui="NO_RECAPTCHA",kr="onFirebaseAuthREInstanceReady";class xe{constructor(e){this.type=el,this.auth=Ce(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Oo(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Po(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;yr(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Ui)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Qo().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&yr(window.grecaptcha)&&xe.scriptInjectionDeferred)await xe.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Jo();l.length!==0&&(l+=o+`&onload=${kr}`),xe.scriptInjectionDeferred=new di,window[kr]=()=>{var c;(c=xe.scriptInjectionDeferred)==null||c.resolve()},Mi(l).then(()=>{var c;return(c=xe.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}xe.scriptInjectionDeferred=null;async function $r(t,e,n,r=!1,i=!1){const s=new xe(t);let a;if(i)a=Ui;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Dn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await $r(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await $r(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
+ */const ul="recaptcha-enterprise",Hi="NO_RECAPTCHA",xr="onFirebaseAuthREInstanceReady";class De{constructor(e){this.type=ul,this.auth=xe(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,o)=>{Ho(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)o(new Error("recaptcha Enterprise site key undefined"));else{const c=new Vo(l);return s.tenantId==null?s._agentRecaptchaConfig=c:s._tenantRecaptchaConfigs[s.tenantId]=c,a(c.siteKey)}}).catch(l=>{o(l)})})}function i(s,a,o){const l=window.grecaptcha;Er(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(c=>{a(c)}).catch(()=>{a(Hi)})}):o(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new ll().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(async o=>{if(!n&&Er(window.grecaptcha)&&De.scriptInjectionDeferred)await De.scriptInjectionDeferred.promise,i(o,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=sl();l.length!==0&&(l+=o+`&onload=${xr}`),De.scriptInjectionDeferred=new pi,window[xr]=()=>{var c;(c=De.scriptInjectionDeferred)==null||c.resolve()},Vi(l).then(()=>{var c;return(c=De.scriptInjectionDeferred)==null?void 0:c.promise}).then(()=>{i(o,s,a)}).catch(c=>{a(c)})}}).catch(o=>{a(o)})})}}De.scriptInjectionDeferred=null;async function Rr(t,e,n,r=!1,i=!1){const s=new De(t);let a;if(i)a=Hi;else try{a=await s.verify(n)}catch{a=await s.verify(n,!0)}const o={...e};if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in o){const l=o.phoneEnrollmentInfo.phoneNumber,c=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:c,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){const l=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return r?Object.assign(o,{captchaResp:a}):Object.assign(o,{captchaResponse:a}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Wn(t,e,n,r,i){var s;if((s=t._getRecaptchaConfig())!=null&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await Rr(t,e,n,n==="getOobCode");return r(t,a)}else return r(t,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Rr(t,e,n,n==="getOobCode");return r(t,o)}else return Promise.reject(a)})}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -823,7 +823,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function tl(t,e){const n=gi(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(st(s,e??{}))return i;ie(i,"already-initialized")}return n.initialize({options:e})}function nl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(ve);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function rl(t,e,n){const r=Ce(t);C(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Fi(e),{host:a,port:o}=il(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){C(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),C(st(c,r.config.emulator)&&st(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Fn(a)?ca(`${s}//${a}${l}`):sl()}function Fi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function il(t){const e=Fi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Tr(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Tr(a)}}}function Tr(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function sl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
+ */function dl(t,e){const n=yi(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(ct(s,e??{}))return i;le(i,"already-initialized")}return n.initialize({options:e})}function hl(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(ke);e!=null&&e.errorMap&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function fl(t,e,n){const r=xe(t);L(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Wi(e),{host:a,port:o}=gl(e),l=o===null?"":`:${o}`,c={url:`${s}//${a}${l}/`},d=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){L(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),L(ct(c,r.config.emulator)&&ct(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=c,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Gn(a)?ya(`${s}//${a}${l}`):pl()}function Wi(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function gl(t){const e=Wi(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Or(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Or(a)}}}function Or(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function pl(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -838,7 +838,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Gn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return we("not implemented")}_getIdTokenResponse(e){return we("not implemented")}_linkToIdToken(e,n){return we("not implemented")}_getReauthenticationResolver(e){return we("not implemented")}}async function al(t,e){return He(t,"POST","/v1/accounts:signUp",e)}/**
+ */class Zn{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return $e("not implemented")}_getIdTokenResponse(e){return $e("not implemented")}_linkToIdToken(e,n){return $e("not implemented")}_getReauthenticationResolver(e){return $e("not implemented")}}async function ml(t,e){return je(t,"POST","/v1/accounts:signUp",e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -853,7 +853,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function ol(t,e){return Rt(t,"POST","/v1/accounts:signInWithPassword",Ve(t,e))}/**
+ */async function _l(t,e){return Nt(t,"POST","/v1/accounts:signInWithPassword",We(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -868,7 +868,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function ll(t,e){return Rt(t,"POST","/v1/accounts:signInWithEmailLink",Ve(t,e))}async function cl(t,e){return Rt(t,"POST","/v1/accounts:signInWithEmailLink",Ve(t,e))}/**
+ */async function bl(t,e){return Nt(t,"POST","/v1/accounts:signInWithEmailLink",We(t,e))}async function yl(t,e){return Nt(t,"POST","/v1/accounts:signInWithEmailLink",We(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -883,7 +883,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class kt extends Gn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new kt(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new kt(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dn(e,n,"signInWithPassword",ol);case"emailLink":return ll(e,{email:this._email,oobCode:this._password});default:ie(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Dn(e,r,"signUpPassword",al);case"emailLink":return cl(e,{idToken:n,email:this._email,oobCode:this._password});default:ie(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
+ */class At extends Zn{constructor(e,n,r,i=null){super("password",r),this._email=e,this._password=n,this._tenantId=i}static _fromEmailAndPassword(e,n){return new At(e,n,"password")}static _fromEmailAndCode(e,n,r=null){return new At(e,n,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e;if(n!=null&&n.email&&(n!=null&&n.password)){if(n.signInMethod==="password")return this._fromEmailAndPassword(n.email,n.password);if(n.signInMethod==="emailLink")return this._fromEmailAndCode(n.email,n.password,n.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const n={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Wn(e,n,"signInWithPassword",_l);case"emailLink":return bl(e,{email:this._email,oobCode:this._password});default:le(e,"internal-error")}}async _linkToIdToken(e,n){switch(this.signInMethod){case"password":const r={idToken:n,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Wn(e,r,"signUpPassword",ml);case"emailLink":return yl(e,{idToken:n,email:this._email,oobCode:this._password});default:le(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -898,7 +898,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function it(t,e){return Rt(t,"POST","/v1/accounts:signInWithIdp",Ve(t,e))}/**
+ */async function at(t,e){return Nt(t,"POST","/v1/accounts:signInWithIdp",We(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -913,7 +913,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const ul="http://localhost";class qe extends Gn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):ie("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new qe(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return it(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,it(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,it(e,n)}buildRequest(){const e={requestUri:ul,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=Tt(n)}return e}}/**
+ */const vl="http://localhost";class Xe extends Zn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const n=new Xe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):le("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=n;if(!r||!i)return null;const a=new Xe(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const n=this.buildRequest();return at(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,at(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,at(e,n)}buildRequest(){const e={requestUri:vl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=xt(n)}return e}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -928,7 +928,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function dl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function hl(t){const e=ft(pt(t)).link,n=e?ft(pt(e)).deep_link_id:null,r=ft(pt(t)).deep_link_id;return(r?ft(pt(r)).link:null)||r||n||e||t}class Kn{constructor(e){const n=ft(pt(e)),r=n.apiKey??null,i=n.oobCode??null,s=dl(n.mode??null);C(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=hl(e);try{return new Kn(n)}catch{return null}}}/**
+ */function wl(t){switch(t){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function Sl(t){const e=bt(yt(t)).link,n=e?bt(yt(e)).deep_link_id:null,r=bt(yt(t)).deep_link_id;return(r?bt(yt(r)).link:null)||r||n||e||t}class er{constructor(e){const n=bt(yt(e)),r=n.apiKey??null,i=n.oobCode??null,s=wl(n.mode??null);L(r&&i&&s,"argument-error"),this.apiKey=r,this.operation=s,this.code=i,this.continueUrl=n.continueUrl??null,this.languageCode=n.lang??null,this.tenantId=n.tenantId??null}static parseLink(e){const n=Sl(e);try{return new er(n)}catch{return null}}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -943,7 +943,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class ct{constructor(){this.providerId=ct.PROVIDER_ID}static credential(e,n){return kt._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=Kn.parseLink(n);return C(r,"argument-error"),kt._fromEmailAndCode(e,r.code,r.tenantId)}}ct.PROVIDER_ID="password";ct.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ct.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
+ */class gt{constructor(){this.providerId=gt.PROVIDER_ID}static credential(e,n){return At._fromEmailAndPassword(e,n)}static credentialWithLink(e,n){const r=er.parseLink(n);return L(r,"argument-error"),At._fromEmailAndCode(e,r.code,r.tenantId)}}gt.PROVIDER_ID="password";gt.EMAIL_PASSWORD_SIGN_IN_METHOD="password";gt.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -958,7 +958,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class an{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
+ */class fn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -973,7 +973,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Pt extends an{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
+ */class Dt extends fn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -988,7 +988,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Ne extends Pt{constructor(){super("facebook.com")}static credential(e){return qe._fromParams({providerId:Ne.PROVIDER_ID,signInMethod:Ne.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ne.credentialFromTaggedObject(e)}static credentialFromError(e){return Ne.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ne.credential(e.oauthAccessToken)}catch{return null}}}Ne.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ne.PROVIDER_ID="facebook.com";/**
+ */class Le extends Dt{constructor(){super("facebook.com")}static credential(e){return Xe._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Le.credential(e.oauthAccessToken)}catch{return null}}}Le.FACEBOOK_SIGN_IN_METHOD="facebook.com";Le.PROVIDER_ID="facebook.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1003,7 +1003,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class be extends Pt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return qe._fromParams({providerId:be.PROVIDER_ID,signInMethod:be.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return be.credentialFromTaggedObject(e)}static credentialFromError(e){return be.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return be.credential(n,r)}catch{return null}}}be.GOOGLE_SIGN_IN_METHOD="google.com";be.PROVIDER_ID="google.com";/**
+ */class we extends Dt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,n){return Xe._fromParams({providerId:we.PROVIDER_ID,signInMethod:we.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return we.credentialFromTaggedObject(e)}static credentialFromError(e){return we.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return we.credential(n,r)}catch{return null}}}we.GOOGLE_SIGN_IN_METHOD="google.com";we.PROVIDER_ID="google.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1018,7 +1018,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class De extends Pt{constructor(){super("github.com")}static credential(e){return qe._fromParams({providerId:De.PROVIDER_ID,signInMethod:De.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return De.credentialFromTaggedObject(e)}static credentialFromError(e){return De.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return De.credential(e.oauthAccessToken)}catch{return null}}}De.GITHUB_SIGN_IN_METHOD="github.com";De.PROVIDER_ID="github.com";/**
+ */class Me extends Dt{constructor(){super("github.com")}static credential(e){return Xe._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Me.credential(e.oauthAccessToken)}catch{return null}}}Me.GITHUB_SIGN_IN_METHOD="github.com";Me.PROVIDER_ID="github.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1033,7 +1033,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Le extends Pt{constructor(){super("twitter.com")}static credential(e,n){return qe._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Le.credential(n,r)}catch{return null}}}Le.TWITTER_SIGN_IN_METHOD="twitter.com";Le.PROVIDER_ID="twitter.com";/**
+ */class Ue extends Dt{constructor(){super("twitter.com")}static credential(e,n){return Xe._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return Ue.credential(n,r)}catch{return null}}}Ue.TWITTER_SIGN_IN_METHOD="twitter.com";Ue.PROVIDER_ID="twitter.com";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1048,7 +1048,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function fl(t,e){return Rt(t,"POST","/v1/accounts:signUp",Ve(t,e))}/**
+ */async function $l(t,e){return Nt(t,"POST","/v1/accounts:signUp",We(t,e))}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1063,7 +1063,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Je{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await ae._fromIdTokenResponse(e,r,i),a=Cr(r);return new Je({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Cr(r);return new Je({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Cr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
+ */class Qe{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await de._fromIdTokenResponse(e,r,i),a=Nr(r);return new Qe({user:s,providerId:a,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Nr(r);return new Qe({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Nr(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1078,7 +1078,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Qt extends Be{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Qt.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new Qt(e,n,r,i)}}function Bi(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Qt._fromErrorAndOperation(t,s,e,r):s})}async function pl(t,e,n=!1){const r=await St(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Je._forOperation(t,"link",r)}/**
+ */class an extends He{constructor(e,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,an.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new an(e,n,r,i)}}function ji(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?an._fromErrorAndOperation(t,s,e,r):s})}async function kl(t,e,n=!1){const r=await Tt(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return Qe._forOperation(t,"link",r)}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1093,7 +1093,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function gl(t,e,n=!1){const{auth:r}=t;if(Z(r.app))return Promise.reject(fe(r));const i="reauthenticate";try{const s=await St(t,Bi(r,i,e,t),n);C(s.idToken,r,"internal-error");const a=jn(s.idToken);C(a,r,"internal-error");const{sub:o}=a;return C(t.uid===o,r,"user-mismatch"),Je._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&ie(r,"user-mismatch"),s}}/**
+ */async function El(t,e,n=!1){const{auth:r}=t;if(re(r.app))return Promise.reject(be(r));const i="reauthenticate";try{const s=await Tt(t,ji(r,i,e,t),n);L(s.idToken,r,"internal-error");const a=Xn(s.idToken);L(a,r,"internal-error");const{sub:o}=a;return L(t.uid===o,r,"user-mismatch"),Qe._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&le(r,"user-mismatch"),s}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1108,7 +1108,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Vi(t,e,n=!1){if(Z(t.app))return Promise.reject(fe(t));const r="signIn",i=await Bi(t,r,e),s=await Je._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function ml(t,e){return Vi(Ce(t),e)}/**
+ */async function zi(t,e,n=!1){if(re(t.app))return Promise.reject(be(t));const r="signIn",i=await ji(t,r,e),s=await Qe._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}async function Il(t,e){return zi(xe(t),e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1123,7 +1123,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function Hi(t){const e=Ce(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function _l(t,e,n){if(Z(t.app))return Promise.reject(fe(t));const r=Ce(t),a=await Dn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",fl).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Hi(t),l}),o=await Je._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function bl(t,e,n){return Z(t.app)?Promise.reject(fe(t)):ml(Te(t),ct.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Hi(t),r})}function yl(t,e,n,r){return Te(t).onIdTokenChanged(e,n,r)}function wl(t,e,n){return Te(t).beforeAuthStateChanged(e,n)}function vl(t,e,n,r){return Te(t).onAuthStateChanged(e,n,r)}function El(t){return Te(t).signOut()}const Zt="__sak";/**
+ */async function Gi(t){const e=xe(t);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function Cl(t,e,n){if(re(t.app))return Promise.reject(be(t));const r=xe(t),a=await Wn(r,{returnSecureToken:!0,email:e,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",$l).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&Gi(t),l}),o=await Qe._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(o.user),o}function Tl(t,e,n){return re(t.app)?Promise.reject(be(t)):Il(Pe(t),gt.credential(e,n)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Gi(t),r})}function Al(t,e,n,r){return Pe(t).onIdTokenChanged(e,n,r)}function Pl(t,e,n){return Pe(t).beforeAuthStateChanged(e,n)}function xl(t,e,n,r){return Pe(t).onAuthStateChanged(e,n,r)}function Rl(t){return Pe(t).signOut()}const on="__sak";/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1138,7 +1138,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Wi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(Zt,"1"),this.storage.removeItem(Zt),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
+ */class qi{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(on,"1"),this.storage.removeItem(on),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1153,7 +1153,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Il=1e3,Sl=10;class ji extends Wi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Di(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Ho()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Sl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Il)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}ji.type="LOCAL";const kl=ji;/**
+ */const Ol=1e3,Nl=10;class Ki extends qi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Fi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((a,o,l)=>{this.notifyListeners(a,l)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!n&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Qo()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Nl):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},Ol)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ki.type="LOCAL";const Dl=Ki;/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1168,7 +1168,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class zi extends Wi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}zi.type="SESSION";const Gi=zi;/**
+ */class Ji extends qi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}Ji.type="SESSION";const Yi=Ji;/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1183,7 +1183,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function $l(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
+ */function Ll(t){return Promise.all(t.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1198,7 +1198,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class on{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new on(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await $l(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}on.receivers=[];/**
+ */class gn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new gn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const o=Array.from(a).map(async c=>c(n.origin,s)),l=await Ll(o);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}gn.receivers=[];/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1213,7 +1213,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function qn(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
+ */function tr(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1228,7 +1228,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Tl{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=qn("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const m=h;if(m.data.eventId===c)switch(m.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(m.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
+ */class Ml{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((o,l)=>{const c=tr("",20);i.port1.start();const d=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(h){const g=h;if(g.data.eventId===c)switch(g.data.status){case"ack":clearTimeout(d),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(g.data.response);break;default:clearTimeout(d),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:n},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1243,7 +1243,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function pe(){return window}function Cl(t){pe().location.href=t}/**
+ */function ye(){return window}function Ul(t){ye().location.href=t}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1258,7 +1258,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Ki(){return typeof pe().WorkerGlobalScope<"u"&&typeof pe().importScripts=="function"}async function Al(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Rl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Pl(){return Ki()?self:null}/**
+ */function Xi(){return typeof ye().WorkerGlobalScope<"u"&&typeof ye().importScripts=="function"}async function Fl(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Bl(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function Vl(){return Xi()?self:null}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1273,7 +1273,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const qi="firebaseLocalStorageDb",Ol=1,en="firebaseLocalStorage",Ji="fbase_key";class Ot{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function ln(t,e){return t.transaction([en],e?"readwrite":"readonly").objectStore(en)}function xl(){const t=indexedDB.deleteDatabase(qi);return new Ot(t).toPromise()}function Yi(){const t=indexedDB.open(qi,Ol);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(en,{keyPath:Ji})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(en)?e(r):(r.close(),await xl(),e(await Yi()))})})}async function Ar(t,e,n){const r=ln(t,!0).put({[Ji]:e,value:n});return new Ot(r).toPromise()}async function Nl(t,e){const n=ln(t,!1).get(e),r=await new Ot(n).toPromise();return r===void 0?null:r.value}function Rr(t,e){const n=ln(t,!0).delete(e);return new Ot(n).toPromise()}const Dl=800,Ll=3;class Xi{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=Yi(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Ll)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Ki()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=on._getInstance(Pl()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Al(),!this.activeServiceWorker)return;this.sender=new Tl(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Rl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Ar(e,Zt,"1"),await Rr(e,Zt)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ar(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>Nl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Rr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=ln(i,!1).getAll();return new Ot(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||vi(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Dl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Xi.type="LOCAL";const Ml=Xi;new At(3e4,6e4);/**
+ */const Qi="firebaseLocalStorageDb",Hl=1,ln="firebaseLocalStorage",Zi="fbase_key";class Lt{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function pn(t,e){return t.transaction([ln],e?"readwrite":"readonly").objectStore(ln)}function Wl(){const t=indexedDB.deleteDatabase(Qi);return new Lt(t).toPromise()}function es(){const t=indexedDB.open(Qi,Hl);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(ln,{keyPath:Zi})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(ln)?e(r):(r.close(),await Wl(),e(await es()))})})}async function Dr(t,e,n){const r=pn(t,!0).put({[Zi]:e,value:n});return new Lt(r).toPromise()}async function jl(t,e){const n=pn(t,!1).get(e),r=await new Lt(n).toPromise();return r===void 0?null:r.value}function Lr(t,e){const n=pn(t,!0).delete(e);return new Lt(n).toPromise()}const zl=800,Gl=3;class ts{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isClosing)throw new Error("Database is closing");return this.dbPromise?this.dbPromise:(this.dbPromise=es(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isClosing||n++>Gl)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return Xi()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=gn._getInstance(Vl()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await Fl(),!this.activeServiceWorker)return;this.sender=new Ml(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(n=e[0])!=null&&n.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Bl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Dr(e,on,"1"),await Lr(e,on)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Dr(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>jl(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>Lr(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(i=>{const s=pn(i,!1).getAll();return new Lt(s).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}catch(e){return this.isClosing||Ei(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),zl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}ts.type="LOCAL";const ql=ts;new Ot(3e4,6e4);/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -1288,7 +1288,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Jn(t,e){return e?ve(e):(C(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
+ */function nr(t,e){return e?ke(e):(L(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
  * @license
  * Copyright 2019 Google LLC
  *
@@ -1303,7 +1303,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Yn extends Gn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return it(e,this._buildIdpRequest())}_linkToIdToken(e,n){return it(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return it(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Ul(t){return Vi(t.auth,new Yn(t),t.bypassAuthState)}function Fl(t){const{auth:e,user:n}=t;return C(n,e,"internal-error"),gl(n,new Yn(t),t.bypassAuthState)}async function Bl(t){const{auth:e,user:n}=t;return C(n,e,"internal-error"),pl(n,new Yn(t),t.bypassAuthState)}/**
+ */class rr extends Zn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return at(e,this._buildIdpRequest())}_linkToIdToken(e,n){return at(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return at(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function Kl(t){return zi(t.auth,new rr(t),t.bypassAuthState)}function Jl(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),El(n,new rr(t),t.bypassAuthState)}async function Yl(t){const{auth:e,user:n}=t;return L(n,e,"internal-error"),kl(n,new rr(t),t.bypassAuthState)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1318,7 +1318,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Qi{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Ul;case"linkViaPopup":case"linkViaRedirect":return Bl;case"reauthViaPopup":case"reauthViaRedirect":return Fl;default:ie(this.auth,"internal-error")}}resolve(e){ke(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ke(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
+ */class ns{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:a,type:o}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Kl;case"linkViaPopup":case"linkViaRedirect":return Yl;case"reauthViaPopup":case"reauthViaRedirect":return Jl;default:le(this.auth,"internal-error")}}resolve(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1333,7 +1333,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Vl=new At(2e3,1e4);async function Hl(t,e,n){if(Z(t.app))return Promise.reject(oe(t,"operation-not-supported-in-this-environment"));const r=Ce(t);Ei(t,e,an);const i=Jn(r,n);return new je(r,"signInViaPopup",e,i).executeNotNull()}class je extends Qi{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,je.currentPopupAction&&je.currentPopupAction.cancel(),je.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return C(e,this.auth,"internal-error"),e}async onExecution(){ke(this.filter.length===1,"Popup operations only handle one event");const e=qn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(oe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(oe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,je.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(oe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Vl.get())};e()}}je.currentPopupAction=null;/**
+ */const Xl=new Ot(2e3,1e4);async function Ql(t,e,n){if(re(t.app))return Promise.reject(he(t,"operation-not-supported-in-this-environment"));const r=xe(t);Ii(t,e,fn);const i=nr(r,n);return new qe(r,"signInViaPopup",e,i).executeNotNull()}class qe extends ns{constructor(e,n,r,i,s){super(e,n,i,s),this.provider=r,this.authWindow=null,this.pollId=null,qe.currentPopupAction&&qe.currentPopupAction.cancel(),qe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return L(e,this.auth,"internal-error"),e}async onExecution(){Te(this.filter.length===1,"Popup operations only handle one event");const e=tr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(he(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(he(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,qe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(he(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Xl.get())};e()}}qe.currentPopupAction=null;/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1348,7 +1348,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Wl="pendingRedirect",Vt=new Map;class jl extends Qi{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=Vt.get(this.auth._key());if(!e){try{const r=await zl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Vt.set(this.auth._key(),e)}return this.bypassAuthState||Vt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function zl(t,e){const n=es(e),r=Zi(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function Gl(t,e){return Zi(t)._set(es(e),"true")}function Kl(t,e){Vt.set(t._key(),e)}function Zi(t){return ve(t._redirectPersistence)}function es(t){return Bt(Wl,t.config.apiKey,t.name)}/**
+ */const Zl="pendingRedirect",qt=new Map;class ec extends ns{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r),this.eventId=null}async execute(){let e=qt.get(this.auth._key());if(!e){try{const r=await tc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}qt.set(this.auth._key(),e)}return this.bypassAuthState||qt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function tc(t,e){const n=is(e),r=rs(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function nc(t,e){return rs(t)._set(is(e),"true")}function rc(t,e){qt.set(t._key(),e)}function rs(t){return ke(t._redirectPersistence)}function is(t){return Gt(Zl,t.config.apiKey,t.name)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1363,7 +1363,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function ql(t,e,n){return Jl(t,e,n)}async function Jl(t,e,n){if(Z(t.app))return Promise.reject(fe(t));const r=Ce(t);Ei(t,e,an),await r._initializationPromise;const i=Jn(r,n);return await Gl(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function Yl(t,e,n=!1){if(Z(t.app))return Promise.reject(fe(t));const r=Ce(t),i=Jn(r,e),a=await new jl(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
+ */function ic(t,e,n){return sc(t,e,n)}async function sc(t,e,n){if(re(t.app))return Promise.reject(be(t));const r=xe(t);Ii(t,e,fn),await r._initializationPromise;const i=nr(r,n);return await nc(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function ac(t,e,n=!1){if(re(t.app))return Promise.reject(be(t));const r=xe(t),i=nr(r,e),a=await new ec(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1378,7 +1378,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Xl=600*1e3;class Ql{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Zl(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ts(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(oe(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Xl&&this.cachedEventUids.clear(),this.cachedEventUids.has(Pr(e))}saveEventToCache(e){this.cachedEventUids.add(Pr(e)),this.lastProcessedEventTime=Date.now()}}function Pr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ts({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Zl(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ts(t);default:return!1}}/**
+ */const oc=600*1e3;class lc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!cc(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!ss(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(he(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=oc&&this.cachedEventUids.clear(),this.cachedEventUids.has(Mr(e))}saveEventToCache(e){this.cachedEventUids.add(Mr(e)),this.lastProcessedEventTime=Date.now()}}function Mr(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function ss({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function cc(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return ss(t);default:return!1}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1393,7 +1393,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */async function ec(t,e={}){return He(t,"GET","/v1/projects",e)}/**
+ */async function uc(t,e={}){return je(t,"GET","/v1/projects",e)}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1408,7 +1408,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const tc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nc=/^https?/;async function rc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await ec(t);for(const n of e)try{if(ic(n))return}catch{}ie(t,"unauthorized-domain")}function ic(t){const e=xn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!nc.test(n))return!1;if(tc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
+ */const dc=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,hc=/^https?/;async function fc(t){if(t.config.emulator)return;const{authorizedDomains:e}=await uc(t);for(const n of e)try{if(gc(n))return}catch{}le(t,"unauthorized-domain")}function gc(t){const e=Vn(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const a=new URL(t);return a.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&a.hostname===r}if(!hc.test(n))return!1;if(dc.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1423,7 +1423,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const sc=new At(3e4,6e4);function Or(){const t=pe().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function ac(t){return new Promise((e,n)=>{var i,s,a;function r(){Or(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Or(),n(oe(t,"network-request-failed"))},timeout:sc.get()})}if((s=(i=pe().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=pe().gapi)!=null&&a.load)r();else{const o=Xo("iframefcb");return pe()[o]=()=>{gapi.load?r():n(oe(t,"network-request-failed"))},Mi(`${Yo()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Ht=null,e})}let Ht=null;function oc(t){return Ht=Ht||ac(t),Ht}/**
+ */const pc=new Ot(3e4,6e4);function Ur(){const t=ye().___jsl;if(t!=null&&t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function mc(t){return new Promise((e,n)=>{var i,s,a;function r(){Ur(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ur(),n(he(t,"network-request-failed"))},timeout:pc.get()})}if((s=(i=ye().gapi)==null?void 0:i.iframes)!=null&&s.Iframe)e(gapi.iframes.getContext());else if((a=ye().gapi)!=null&&a.load)r();else{const o=ol("iframefcb");return ye()[o]=()=>{gapi.load?r():n(he(t,"network-request-failed"))},Vi(`${al()}?onload=${o}`).catch(l=>n(l))}}).catch(e=>{throw Kt=null,e})}let Kt=null;function _c(t){return Kt=Kt||mc(t),Kt}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1438,7 +1438,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const lc=new At(5e3,15e3),cc="__/auth/iframe",uc="emulator/auth/iframe",dc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},hc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fc(t){const e=t.config;C(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Wn(e,uc):`https://${t.config.authDomain}/${cc}`,r={apiKey:e.apiKey,appName:t.name,v:Ct},i=hc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${Tt(r).slice(1)}`}async function pc(t){const e=await oc(t),n=pe().gapi;return C(n,t,"internal-error"),e.open({where:document.body,url:fc(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:dc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=oe(t,"network-request-failed"),o=pe().setTimeout(()=>{s(a)},lc.get());function l(){pe().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
+ */const bc=new Ot(5e3,15e3),yc="__/auth/iframe",vc="emulator/auth/iframe",wc={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Sc=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function $c(t){const e=t.config;L(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Yn(e,vc):`https://${t.config.authDomain}/${yc}`,r={apiKey:e.apiKey,appName:t.name,v:Rt},i=Sc.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${xt(r).slice(1)}`}async function kc(t){const e=await _c(t),n=ye().gapi;return L(n,t,"internal-error"),e.open({where:document.body,url:$c(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:wc,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=he(t,"network-request-failed"),o=ye().setTimeout(()=>{s(a)},bc.get());function l(){ye().clearTimeout(o),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
  * @license
  * Copyright 2020 Google LLC.
  *
@@ -1453,7 +1453,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const gc={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mc=500,_c=600,bc="_blank",yc="http://localhost";class xr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function wc(t,e,n,r=mc,i=_c){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...gc,width:r.toString(),height:i.toString(),top:s,left:a},c=X().toLowerCase();n&&(o=Ri(c)?bc:n),Ci(c)&&(e=e||yc,l.scrollbars="yes");const d=Object.entries(l).reduce((m,[g,_])=>`${m}${g}=${_},`,"");if(Vo(c)&&o!=="_self")return vc(e||"",o),new xr(null);const h=window.open(e||"",o,d);C(h,t,"popup-blocked");try{h.focus()}catch{}return new xr(h)}function vc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
+ */const Ec={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ic=500,Cc=600,Tc="_blank",Ac="http://localhost";class Fr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Pc(t,e,n,r=Ic,i=Cc){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let o="";const l={...Ec,width:r.toString(),height:i.toString(),top:s,left:a},c=ee().toLowerCase();n&&(o=Ni(c)?Tc:n),Ri(c)&&(e=e||Ac,l.scrollbars="yes");const d=Object.entries(l).reduce((g,[_,b])=>`${g}${_}=${b},`,"");if(Xo(c)&&o!=="_self")return xc(e||"",o),new Fr(null);const h=window.open(e||"",o,d);L(h,t,"popup-blocked");try{h.focus()}catch{}return new Fr(h)}function xc(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -1468,7 +1468,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Ec="__/auth/handler",Ic="emulator/auth/handler",Sc=encodeURIComponent("fac");async function Nr(t,e,n,r,i,s){C(t.config.authDomain,t,"auth-domain-config-required"),C(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Ct,eventId:i};if(e instanceof an){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",sa(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Pt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Sc}=${encodeURIComponent(l)}`:"";return`${kc(t)}?${Tt(o).slice(1)}${c}`}function kc({config:t}){return t.emulator?Wn(t,Ic):`https://${t.authDomain}/${Ec}`}/**
+ */const Rc="__/auth/handler",Oc="emulator/auth/handler",Nc=encodeURIComponent("fac");async function Br(t,e,n,r,i,s){L(t.config.authDomain,t,"auth-domain-config-required"),L(t.config.apiKey,t,"invalid-api-key");const a={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:Rt,eventId:i};if(e instanceof fn){e.setDefaultLanguage(t.languageCode),a.providerId=e.providerId||"",pa(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,h]of Object.entries({}))a[d]=h}if(e instanceof Dt){const d=e.getScopes().filter(h=>h!=="");d.length>0&&(a.scopes=d.join(","))}t.tenantId&&(a.tid=t.tenantId);const o=a;for(const d of Object.keys(o))o[d]===void 0&&delete o[d];const l=await t._getAppCheckToken(),c=l?`#${Nc}=${encodeURIComponent(l)}`:"";return`${Dc(t)}?${xt(o).slice(1)}${c}`}function Dc({config:t}){return t.emulator?Yn(t,Oc):`https://${t.authDomain}/${Rc}`}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1483,7 +1483,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const bn="webStorageSupport";class $c{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Gi,this._completeRedirectFn=Yl,this._overrideRedirectResult=Kl}async _openPopup(e,n,r,i){var a;ke((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Nr(e,n,r,xn(),i);return wc(e,s,qn())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Nr(e,n,r,xn(),i);return Cl(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(ke(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await pc(e),r=new Ql(e);return n.register("authEvent",i=>(C(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(bn,{type:bn},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[bn];s!==void 0&&n(!!s),ie(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=rc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Di()||Ai()||zn()}}const Tc=$c;var Dr="@firebase/auth",Lr="1.13.5";/**
+ */const In="webStorageSupport";class Lc{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Yi,this._completeRedirectFn=ac,this._overrideRedirectResult=rc}async _openPopup(e,n,r,i){var a;Te((a=this.eventManagers[e._key()])==null?void 0:a.manager,"_initialize() not called before _openPopup()");const s=await Br(e,n,r,Vn(),i);return Pc(e,s,tr())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Br(e,n,r,Vn(),i);return Ul(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(Te(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await kc(e),r=new lc(e);return n.register("authEvent",i=>(L(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(In,{type:In},i=>{var a;const s=(a=i==null?void 0:i[0])==null?void 0:a[In];s!==void 0&&n(!!s),le(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=fc(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Fi()||Oi()||Qn()}}const Mc=Lc;var Vr="@firebase/auth",Hr="1.13.5";/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1498,7 +1498,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */class Cc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){C(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
+ */class Uc{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);n&&(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){L(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
  * @license
  * Copyright 2020 Google LLC
  *
@@ -1513,7 +1513,7 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */function Ac(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Rc(t){Et(new at("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;C(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Li(t)},c=new Ko(r,i,s,l);return nl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Et(new at("auth-internal",e=>{const n=Ce(e.getProvider("auth").getImmediate());return(r=>new Cc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),tt(Dr,Lr,Ac(t)),tt(Dr,Lr,"esm2020")}/**
+ */function Fc(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Bc(t){It(new ut("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=r.options;L(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:o,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Bi(t)},c=new rl(r,i,s,l);return hl(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),It(new ut("auth-internal",e=>{const n=xe(e.getProvider("auth").getImmediate());return(r=>new Uc(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),rt(Vr,Hr,Fc(t)),rt(Vr,Hr,"esm2020")}/**
  * @license
  * Copyright 2021 Google LLC
  *
@@ -1528,5 +1528,5 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Pc=300,Oc=ui("authIdTokenMaxAge")||Pc;let Mr=null;const xc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Oc)return;const i=n==null?void 0:n.token;Mr!==i&&(Mr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Nc(t=lo()){const e=gi(t,"auth");if(e.isInitialized())return e.getImmediate();const n=tl(t,{popupRedirectResolver:Tc,persistence:[Ml,kl,Gi]}),r=ui("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=xc(s.toString());wl(n,a,()=>a(n.currentUser)),yl(n,o=>a(o))}}const i=Js("auth");return i&&rl(n,`http://${i}`),n}function Dc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}qo({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=oe("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Dc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Rc("Browser");const Lc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},_e=Lc,ot=!!_e.VITE_FIREBASE_APP_ID;let yn=null;function Ze(){if(!ot)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!yn){const t=mi({apiKey:_e.VITE_FIREBASE_API_KEY,authDomain:_e.VITE_FIREBASE_AUTH_DOMAIN,projectId:_e.VITE_FIREBASE_PROJECT_ID,appId:_e.VITE_FIREBASE_APP_ID,..._e.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:_e.VITE_FIREBASE_STORAGE_BUCKET},..._e.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:_e.VITE_FIREBASE_MESSAGING_SENDER_ID}});yn=Nc(t)}return yn}function Ur(){return new be}async function Fr(){if(!ot)return;const t=Ze();t.currentUser&&await El(t)}var Mc=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),Uc=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Fc=p("<button type=button class=gate-toggle>"),Bc=p("<div class=gate-or>── or ──"),Vc=p("<button type=button class=btn>Continue with Google"),Hc=p("<div class=gate-error role=alert>"),Wc=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),jc=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),zc=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const Gc={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Br(t){const e=(t==null?void 0:t.code)??"";return Gc[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function Kc(t){return(()=>{var e=Mc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),he(l,"click",t.onSignOut),e})()}function qc(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");Rs(async m=>{if(!ot)return null;const g=Ze().currentUser;return g?await g.getIdToken(m):null});async function d(m){if(m.preventDefault(),!a()){o(!0),c("");try{const g=Ze();t()==="create"?await _l(g,n(),i()):await bl(g,n(),i())}catch(g){c(Br(g))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await Hl(Ze(),Ur())}catch(m){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(m==null?void 0:m.code)){await ql(Ze(),Ur());return}c(Br(m))}finally{o(!1)}}}return(()=>{var m=Wc(),g=m.firstChild;return g.firstChild,u(g,f(E,{when:ot,get fallback(){return[jc(),zc()]},get children(){return[(()=>{var _=Uc(),I=_.firstChild,b=I.firstChild,y=b.nextSibling,v=I.nextSibling,x=v.firstChild,A=x.nextSibling,T=v.nextSibling;return _.addEventListener("submit",d),y.$$input=S=>r(S.currentTarget.value),A.$$input=S=>s(S.currentTarget.value),u(T,(()=>{var S=q(()=>!!a());return()=>S()?"Working…":t()==="create"?"Create account":"Sign in"})()),k(S=>{var L=t()==="create"?"new-password":"current-password",R=a();return L!==S.e&&re(A,"autocomplete",S.e=L),R!==S.t&&(T.disabled=S.t=R),S},{e:void 0,t:void 0}),k(()=>y.value=n()),k(()=>A.value=i()),_})(),(()=>{var _=Fc();return _.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(_,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),k(()=>_.disabled=a()),_})(),Bc(),(()=>{var _=Vc();return _.$$click=h,k(()=>_.disabled=a()),_})(),f(E,{get when(){return l()},get children(){var _=Hc();return u(_,l),_}})]}}),null),m})()}ce(["click","input"]);var Jc=p("<div class=gate-error role=alert>"),Yc=p("<p class=gate-note>No grant-file entries yet."),Xc=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),Qc=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),Zc=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function eu(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=b=>{n((b==null?void 0:b.file_grants)??[]),i((b==null?void 0:b.static_emails)??[])};wt(async()=>{try{h(await Os())}catch{d("Could not load the grant list.")}});const g=b=>{b.key==="Escape"&&t.onClose()};wt(()=>{window.addEventListener("keydown",g),Ue(()=>window.removeEventListener("keydown",g));const b=document.querySelector(".access-add input");b==null||b.focus()});const _=async b=>{if(b.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await xs(s())),a("")}catch(y){d(y.message)}l(!1)}},I=async b=>{if(!o()){l(!0),d("");try{h(await Ns(b))}catch(y){d(y.message)}l(!1)}};return(()=>{var b=Qc(),y=b.firstChild,v=y.firstChild,x=v.nextSibling,A=x.nextSibling,T=A.firstChild,S=T.nextSibling,L=A.nextSibling;return he(b,"click",t.onClose),y.$$click=R=>R.stopPropagation(),u(y,f(E,{get when(){return c()},get children(){var R=Jc();return u(R,c),R}}),A),u(y,f(ee,{get each(){return e()},children:R=>(()=>{var P=Zc(),D=P.firstChild,U=D.nextSibling;return u(D,R),U.$$click=()=>I(R),re(U,"title",`Remove ${R}`),re(U,"aria-label",`Remove ${R}`),k(()=>U.disabled=o()),P})()}),A),u(y,f(E,{get when(){return e().length===0},get children(){return Yc()}}),A),A.addEventListener("submit",_),T.$$input=R=>a(R.currentTarget.value),u(S,()=>o()?"…":"Add"),u(y,f(E,{get when(){return r().length>0},get children(){var R=Xc();return R.firstChild,u(R,()=>r().join(", "),null),R}}),L),he(L,"click",t.onClose),k(()=>S.disabled=o()),k(()=>T.value=s()),b})()}ce(["click","input"]);const Ee=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),yt=(t,e,n)=>Math.min(n,Math.max(e,t));function tu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:yt((n-t)/r,0,1)}function nu(t,e,n,r,i=Ee){if(n<i.minRateOfReturn||t<=0)return null;const s=yt(t/2,0,1),a=yt(e,0,1),o=Math.min(n/i.idealReturn,1),l=yt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function ru(t,e=Ee){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?yt(1+t.delta,0,1):tu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),nu(r,a,n,i,e)}function iu(t,e=Ee.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function su(t){return t.weightSharpe===Ee.weightSharpe&&t.weightSafety===Ee.weightSafety&&t.weightReturn===Ee.weightReturn&&t.minRateOfReturn===Ee.minRateOfReturn}var au=p("<span class=hint>production defaults · drag to re-rank live"),ou=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),lu=p('<span class="hint hint-custom">custom weights'),cu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function uu(){const[t,e]=O({...Ee});return{params:t,isCustom:()=>!su(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Ee})}}const du=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function hu(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=ou(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(E,{get when(){return!e()},get fallback(){return lu()},get children(){return au()}}),null),u(s,f(ee,{each:du,children:o=>(()=>{var l=cu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,m=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(E,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),m.$$input=g=>t.scoring.setParam(o.key,Number(g.currentTarget.value)),k(g=>{var _=o.max,I=o.step;return _!==g.e&&re(m,"max",g.e=_),I!==g.t&&re(m,"step",g.t=I),g},{e:void 0,t:void 0}),k(()=>m.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),k(()=>r.open=e()),r})()}ce(["click","input"]);const cn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],gt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],ns="webapp.columns.v1";function fu(){try{const t=localStorage.getItem(ns);if(!t)return gt;const e=JSON.parse(t);if(!Array.isArray(e))return gt;const n=new Set(cn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:gt}catch{return gt}}function pu(t){try{localStorage.setItem(ns,JSON.stringify(t))}catch{}}var gu=p("<div class=pop-backdrop>"),mu=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),_u=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),bu=p("<label class=pick-item><input type=checkbox>");function yu(t){const[e,n]=O(!1);return(()=>{var r=_u(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(E,{get when(){return e()},get children(){return[(()=>{var s=gu();return s.$$click=()=>n(!1),s})(),(()=>{var s=mu(),a=s.firstChild,o=a.nextSibling;return u(a,f(ee,{each:cn,children:l=>(()=>{var c=bu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),k(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),k(()=>re(i,"aria-expanded",e())),r})()}ce(["click"]);var wu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),vu=p("<span class=pggap>…"),Eu=p("<button type=button class=pgbtn>");function Iu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Su(t){const e=Y(()=>Iu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=wu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ee,{get each(){return e()},children:d=>d==="…"?vu():(()=>{var h=Eu();return h.$$click=()=>t.onGo(d),u(h,d),k(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,k(d=>{var h=t.page()<=1,m=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),m!==d.t&&(c.disabled=d.t=m),d},{e:void 0,t:void 0}),i})()}ce(["click"]);var ku=p("<span class=tip>");function ut(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=ku();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Cs(i,r):e=r,u(r,()=>t.children),k(()=>re(r,"data-tip",t.text??"")),r})()}ce(["focusin"]);const Ke="∅";function G(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function mt(t){return Number(t??0).toLocaleString("en-US")}function tn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function rs(t){return is(t,{hour:"2-digit",minute:"2-digit"})}function $u(t){return is(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function is(t,e){const n=tn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const ss={text:Ke,isNull:!0},wn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Vr(t,e){return!e||G(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Tu(t,e){return!e||G(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Cu(t){if(!t||typeof t!="object"||G(t.report_date))return ss;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ne(t,e){if(G(e))return ss;switch(t){case"fixed2":return wn(e,2);case"fixed3":return wn(e,3);case"ivrv":return wn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Cu(e);default:return{text:String(e),isNull:!1}}}const Hr=t=>Number(t*100).toFixed(0);function Au(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Hr(e.momentum_high),s=Hr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function dt(t,e){return Au(e)[t]??t}var as=p("<span class=tip-target>"),Ru=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),Pu=p("<span class=tip-target>Strike position in band"),Ou=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),xu=p("<div class=exp-block><h4>"),Nu=p("<div class=kv-value>Band unavailable (∅)"),Du=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),Lu=p("<div class=exp-block><h4>Premium economics"),Mu=p("<b>"),Uu=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Fu=p("<div class=muted-note>earnings-discounted safety applied"),Bu=p("<div class=exp-block><h4>Score breakdown"),Vu=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Hu=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Wu=p("<span class=muted-note>all columns visible"),ju=p('<div class="exp-block exp-chips"><h4>Hidden columns'),zu=p("<span class=tip-target>: "),Gu=p("<span>"),Ku=p("<span class=tip-target>band safety is already discounted by the earnings rule."),qu=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),Ju=p("<div class=expansion><div class=exp-grid>");const vn={sharpe:.2,safety:.4,return_part:.4};function En(t,e=2){return G(t)?Ke:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function de(t,e,n){return(()=>{var r=Ru(),i=r.firstChild,s=i.nextSibling;return u(i,f(ut,{get text(){return dt(t,e)},get children(){var a=as();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function Yu(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=G(e.mid)?null:e.strike-e.mid,s=i!=null&&!G(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!G(a)&&l>a&&!G(e.strike),d=m=>{if(G(m))return null;const g=(m-a)/(l-a)*100;return Math.min(100,Math.max(0,g))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(m=>d(m.v)!=null):[];return(()=>{var m=xu(),g=m.firstChild;return u(g,f(ut,{get text(){return dt("band_range",t.thresholds)},get children(){return Pu()}})),u(m,f(E,{when:c,get fallback(){return Nu()},get children(){var _=Ou(),I=_.firstChild;return u(_,f(ee,{each:h,children:b=>(()=>{var y=Du(),v=y.firstChild,x=v.nextSibling,A=x.firstChild;return u(x,()=>b.label,A),u(x,()=>ne("fixed2",b.v).text,null),k(T=>{var S=`marker ${b.cls}`,L=`${d(b.v)}%`;return S!==T.e&&te(y,T.e=S),L!==T.t&&Ge(y,"left",T.t=L),T},{e:void 0,t:void 0}),y})()}),null),k(b=>{var y=`${d(e.strike_from)}%`,v=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return y!==b.e&&Ge(I,"left",b.e=y),v!==b.t&&Ge(I,"width",b.t=v),b},{e:void 0,t:void 0}),_}}),null),u(m,()=>de("band_range",t.thresholds,`${ne("fixed2",e.strike_from).text} → ${ne("fixed2",e.strike_to).text}`),null),u(m,()=>de("band_depth",t.thresholds,r==null?Ke:`${(r*100).toFixed(1)}%`),null),u(m,()=>de("cushion_be",t.thresholds,s==null?Ke:`${s.toFixed(1)}%`),null),m})()}function Xu(t){const e=t.row,n=G(e.strike)?null:e.strike*100,r=G(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ne("pct1",e.rate_of_return);return(()=>{var a=Lu();return a.firstChild,u(a,()=>de("capital",t.thresholds,n==null?Ke:En(n,0)),null),u(a,()=>de("premium",t.thresholds,r==null?Ke:En(r)),null),u(a,()=>de("breakeven",t.thresholds,i==null?Ke:En(i)),null),u(a,()=>de("ann_ror",t.thresholds,(()=>{var o=Mu();return u(o,()=>s.text),o})()),null),u(a,()=>de("bid",t.thresholds,ne("fixed2",e.bid).text),null),u(a,()=>de("ask",t.thresholds,ne("fixed2",e.ask).text),null),u(a,()=>de("expiration",t.thresholds,e.expiration),null),a})()}function Qu(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:vn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:vn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:vn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=Bu();return i.firstChild,u(i,f(E,{when:n,get fallback(){return(()=>{var s=Vu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ne("fixed3",e.score).text),s})()},get children(){return[f(ee,{each:r,children:s=>{const a=G(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Hu(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,m=h.nextSibling;m.nextSibling;var g=l.nextSibling,_=g.firstChild,I=g.nextSibling;return u(l,f(ut,{get text(){return dt(s.key,t.thresholds)},get children(){var b=as();return u(b,()=>s.label),b}}),c),u(d,()=>s.weight*100,m),u(I,()=>ne("fixed3",s.v).text),k(b=>Ge(_,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=Uu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ne("fixed3",e.score).text),s})(),f(E,{get when(){return e.earnings_before_expiry},get children(){return Fu()}})]}}),null),i})()}function Zu(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ne(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=ju();return n.firstChild,u(n,f(ee,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=Gu();return u(s,f(ut,{get text(){return dt(r.id,t.thresholds)},get children(){var a=zu(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),k(()=>te(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(E,{get when(){return t.hiddenDefs.length===0},get children(){return Wu()}}),null),n})()}function ed(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=Ju(),i=r.firstChild;return u(r,f(E,{when:n,get children(){var s=qu(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(E,{get when(){return n.report_time},children:m=>m().replaceAll("_"," ")}),c),u(s,f(E,{get when(){return!G(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>ne("fixed2",n.expected_eps).text)]}}),h),u(s,f(ut,{get text(){return dt("earnings_before_expiry",t.thresholds)},get children(){return Ku()}}),null),s}}),i),u(i,f(Yu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Xu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Qu,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(Zu,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var td=p("<span class=null-mark>"),nd=p("<span class=star>★"),rd=p("<td><b>"),In=p("<span>"),Wr=p("<td class=num>"),id=p("<span class=score-frozen>prod "),sd=p('<td class="num score-cell">'),ad=p('<span class="score-frozen readmit">re-admitted'),od=p("<td>"),ld=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),cd=p("<span class=sort-arrow>"),ud=p("<span class=tip-target>"),dd=p("<th role=button tabindex=0>"),hd=p("<tr class=expandable><td class=exp-col>"),fd=p("<tr class=exp-row><td>");const pd=t=>`${t.underlying}|${t.strike}`;function gd(t){return(()=>{var e=td();return u(e,()=>t.text),e})()}function Dt(t){const e=ne(t.kind,t.value);return f(E,{get when(){return!e.isNull},get fallback(){return f(gd,{get text(){return e.text}})},get children(){return e.text}})}function md(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=rd(),i=r.firstChild;return u(r,f(E,{get when(){return t.pickRank!=null},get children(){var s=nd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(E,{get when(){return Vr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=In();return k(()=>te(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Wr();return u(r,f(E,{get when(){return Vr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=In();return k(()=>te(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=sd();return u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(E,{get when(){return!G(n.frozen_score)},get fallback(){return f(E,{get when(){return!G(n.score)},get children(){return ad()}})},get children(){var i=id();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Wr();return u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){return Tu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=In();return u(s,i),k(()=>te(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=od();return u(r,f(Dt,{get kind(){return e.kind},get value(){return n[e.id]}})),k(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function _d(t){const e=Y(()=>cn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=ld(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ee,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=dd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(ut,{get text(){return dt(a.id,t.thresholds)},get children(){var c=ud();return u(c,()=>a.label,null),u(c,f(E,{get when(){return o()},get children(){return[" ",(()=>{var d=cd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),k(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&re(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ee,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>pd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=hd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ee,{get each(){return e()},children:m=>f(md,{col:m,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),k(m=>{var g=o()!=null,_=!!G(a.score),I=!!c();return g!==m.e&&d.classList.toggle("pick",m.e=g),_!==m.t&&d.classList.toggle("prow",m.t=_),I!==m.a&&d.classList.toggle("open",m.a=I),m},{e:void 0,t:void 0,a:void 0}),d})(),f(E,{get when(){return c()},get children(){var d=fd(),h=d.firstChild;return u(h,f(ed,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),k(()=>re(h,"colspan",e().length+1)),d}})]}})),n})()}ce(["click","keydown"]);function bd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const et=t=>G(t);function yd(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=et(a),c=et(o);return l||c?l&&c?0:l?1:-1:r*bd(a,o)})}function wd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=et(r),a=et(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=et(l),h=et(c);return d||h?d&&h?0:d?1:-1:c-l})}var vd=p("<div class=stage-badges>"),Ed=p("<pre class=errbox>"),Id=p("<details><summary> "),Sd=p("<div class=scroll-region>"),kd=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),$d=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Td=p("<div class=empty-panel>No rows match the current filter."),Cd=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Sn=100,Ad=150,jr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Rd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=vd();return u(i,f(ee,{get each(){return t.stages??[]},children:s=>(()=>{var a=Id(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(E,{get when(){return s.error},get children(){var c=Ed();return u(c,()=>s.error),c}}),null),k(()=>te(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function zr(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,m]=O(1);let g;Ue(()=>clearTimeout(g));const _=()=>{var w;return((w=t.tf)==null?void 0:w.rows)??[]},I=Y(()=>{const w=t.scoring.params(),N=t.scoring.isCustom();return _().map(B=>{const V=ru(B,w);return{...B,frozen_score:B.score,live_parts:V,score:N?V==null?null:V.total:B.score}})}),b=Y(()=>I().filter(w=>!G(w.score)&&G(w.frozen_score)).length),y=w=>{const N=w.currentTarget.value;n(N),clearTimeout(g),g=setTimeout(()=>{i(N.trim().toLowerCase()),m(1)},Ad)},v=w=>{a(w),m(1)},x=w=>{o()!==w?(l(w),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),m(1)},[A,T]=O(null),S=w=>{const N=`${w.underlying}|${w.strike}`;T(B=>B===N?null:N)};ze(_t([o,c,h,r,s],()=>T(null))),ze(_t(t.active,()=>T(null))),ze(_t(t.columns.visible,()=>m(1)));const L=()=>cn.filter(w=>!t.columns.visible().includes(w.id)),R=()=>(t.stages??[]).find(w=>w.name===jr[t.id].id),P=Y(()=>{const w=r();return w?I().filter(N=>{const B=N.underlying,V=N.sector;return B!=null&&String(B).toLowerCase().includes(w)||V!=null&&String(V).toLowerCase().includes(w)}):I()}),D=Y(()=>{const w=P();return s()?w.filter(N=>!G(N.score)):w}),U=Y(()=>o()?yd(D(),o(),c()):wd(D())),F=Y(()=>Math.max(1,Math.ceil(U().length/Sn))),Q=()=>Math.min(h(),F()),ge=()=>{const w=Q();return U().slice((w-1)*Sn,w*Sn)},Ae=Y(()=>{var N;const w=new Map;if(t.scoring.isCustom()){const B=iu(I().map(V=>({row:V,score:V.score})));for(const V of B)w.set(`${V.row.underlying}|${V.row.strike}`,w.size+1)}else for(const B of((N=t.tf)==null?void 0:N.top_picks)??[])w.set(`${B.underlying}|${B.strike}`,B.rank??"?");return w}),$=w=>Ae().get(`${w.underlying}|${w.strike}`);return(()=>{var w=kd(),N=w.firstChild,B=N.firstChild,V=B.nextSibling,se=V.firstChild,z=V.nextSibling,ht=z.firstChild,xt=ht.nextSibling;return xt.nextSibling,u(w,f(Rd,{get stages(){return t.stages}}),N),B.$$input=y,se.addEventListener("change",K=>v(K.currentTarget.checked)),u(N,f(yu,{get store(){return t.columns}}),z),u(z,()=>mt(U().length),ht),u(z,()=>mt(_().length),xt),u(z,f(E,{get when(){return q(()=>!!t.scoring.isCustom())()&&b()>0},get children(){return[" ","· ",q(()=>mt(b()))," re-admitted by lower floor"]}}),null),u(w,f(E,{get when(){return ge().length>0},get children(){var K=Sd();return u(K,f(_d,{get visibleCols(){return t.columns.visible},rows:ge,sortKey:o,sortDir:c,onSort:x,get thresholds(){return t.thresholds},pickRankOf:$,openKey:A,onToggleRow:S,hiddenDefs:L,get customScores(){return t.scoring.isCustom}})),K}}),null),u(w,f(E,{get when(){return ge().length===0},get children(){return f(E,{get when(){var K,me;return((K=R())==null?void 0:K.status)==="failed"||((me=R())==null?void 0:me.status)==="partial"},get fallback(){return f(E,{get when(){return q(()=>!!s())()&&P().length>0},get fallback(){return Td()},get children(){var K=$d(),me=K.firstChild,Re=me.nextSibling,Pe=Re.nextSibling,Ye=Pe.nextSibling,Xe=Ye.nextSibling;return Xe.nextSibling,u(K,()=>mt(P().length),Xe),K}})},children:K=>(()=>{var me=Cd(),Re=me.firstChild,Pe=Re.firstChild,Ye=Pe.nextSibling;Ye.nextSibling;var Xe=Re.nextSibling;return u(Re,()=>K().status==="partial"?"△":"✗",Pe),u(Re,()=>jr[t.id].label,Ye),u(Xe,()=>K().error??"stage produced no data"),me})()})}}),null),u(w,f(E,{get when(){return U().length>0},get children(){return f(Su,{page:Q,pageCount:F,onGo:m})}}),null),k(()=>w.hidden=!t.active()),k(()=>B.value=e()),k(()=>se.checked=s()),w})()}ce(["input"]);var Pd=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 350.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.00"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Add</button><button type=button class=btn>Cancel'),Od=p("<button type=button class=btn>+ New position"),xd=p("<label class=holdings-outcome-price>close price/share<input inputmode=decimal>"),os=p("<b>"),Nd=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!> ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Dd=p("<div class=holdings-notice>"),Ld=p("<div class=error-banner>Holdings API error: "),Md=p("<div class=holdings-cards>"),Ud=p('<div class=holdings-panel><div class=holdings-toolbar><button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Fd=p("<div class=empty-panel>No open positions — press “+ New position” to record one."),Gr=p("<i>"),Bd=p("<i>unpriced"),Vd=p('<span class="chip high">buy back?'),Hd=p('<div class=holdings-card><div class=holdings-card-head><b> <!>P ×</b><span class=holdings-age>exp <!> · <!>/<!> wd</span></div><div class=holdings-card-big><span></span><span class=holdings-card-target>target </span></div><div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark></div></div><div class=holdings-card-stats><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b></div><div><span>spot</span></div><div><span>close captures</span><b></b></div></div><div class=holdings-card-actions><button type=button class="btn-ghost holdings-close-btn">close…'),Wd=p("<b>—"),jd=p('<span class="chip normal">holding');const Ln=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),kn=(t,e=0)=>`${(t*100).toFixed(e)}%`;function zd(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Gd(t){const e=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`,n=()=>e(new Date),r=()=>e(new Date(Date.now()+6048e5)),[i,s]=O(!1),[a,o]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:n(),expiry:r()}),l=d=>h=>o({...a(),[d]:h.target.value}),c=async d=>{var h;d.preventDefault(),!((h=t.busy)!=null&&h.call(t))&&a().symbol&&[a().strike,a().premium,a().contracts].every(m=>Number(m)>0)&&(await t.onAdd({symbol:a().symbol,strike:Number(a().strike),premium:Number(a().premium),contracts:Number(a().contracts),sold:a().sold,expiry:a().expiry}),o({...a(),symbol:"",strike:"",premium:""}),s(!1))};return f(E,{get when(){return i()},get fallback(){return(()=>{var d=Od();return d.$$click=()=>s(!0),k(()=>{var h;return d.disabled=(h=t.busy)==null?void 0:h.call(t)}),d})()},get children(){var d=Pd(),h=d.firstChild,m=h.firstChild,g=m.nextSibling,_=h.nextSibling,I=_.firstChild,b=I.nextSibling,y=_.nextSibling,v=y.firstChild,x=v.nextSibling,A=y.nextSibling,T=A.firstChild,S=T.nextSibling,L=A.nextSibling,R=L.firstChild,P=R.nextSibling,D=L.nextSibling,U=D.firstChild,F=U.nextSibling,Q=D.nextSibling,ge=Q.nextSibling;return d.addEventListener("submit",c),he(g,"input",l("symbol")),he(b,"input",l("strike")),he(x,"input",l("premium")),he(S,"input",l("contracts")),he(P,"input",l("sold")),he(F,"input",l("expiry")),ge.$$click=()=>s(!1),k(()=>{var Ae;return Q.disabled=(Ae=t.busy)==null?void 0:Ae.call(t)}),k(()=>g.value=a().symbol),k(()=>b.value=a().strike),k(()=>x.value=a().premium),k(()=>S.value=a().contracts),k(()=>P.value=a().sold),k(()=>F.value=a().expiry),d}})}function Kd(t){var a,o;const[e,n]=O("bought-back"),[r,i]=O(((o=(a=t.position.mark)==null?void 0:a.mid)==null?void 0:o.toFixed(2))??""),s=()=>{const l=t.position,c=Number(r());return e()==="expired"?l.premium*100*l.contracts:Number.isFinite(c)?e()==="assigned"?(l.strike-c+l.premium)*100*l.contracts:(l.premium-c)*100*l.contracts:null};return(()=>{var l=Nd(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,m=h.nextSibling,g=m.nextSibling;g.nextSibling;var _=c.nextSibling,I=_.firstChild,b=I.firstChild,y=I.nextSibling,v=y.firstChild,x=y.nextSibling,A=x.firstChild,T=_.nextSibling;T.firstChild;var S=T.nextSibling,L=S.firstChild,R=L.nextSibling;return u(c,()=>t.position.symbol,h),u(c,()=>t.position.strike,g),u(c,()=>t.position.contracts,null),b.addEventListener("change",()=>n("bought-back")),v.addEventListener("change",()=>n("expired")),A.addEventListener("change",()=>n("assigned")),u(l,f(E,{get when(){return e()!=="expired"},get children(){var P=xd(),D=P.firstChild,U=D.nextSibling;return U.$$input=F=>i(F.target.value),k(()=>U.value=r()),P}}),T),u(T,f(E,{get when(){return s()!==null},fallback:"—",get children(){var P=os();return u(P,()=>Ln(s())),k(()=>te(P,s()>=0?"holdings-pos":"holdings-neg")),P}}),null),he(L,"click",t.onClose),R.$$click=()=>t.onConfirm(e(),e()==="expired"?null:Number(r())),k(()=>{var P;return R.disabled=(P=t.busy)==null?void 0:P.call(t)}),k(()=>b.checked=e()==="bought-back"),k(()=>v.checked=e()==="expired"),k(()=>A.checked=e()==="assigned"),l})()}function qd(){const[t,{refetch:e}]=Zr(Ms),[n,r]=O(""),[i,s]=O(null),[a,o]=O(!1),l=g=>{r(g),setTimeout(()=>r(""),4e3)},c=()=>{var g;return[...((g=t())==null?void 0:g.positions)??[]].map(_=>({p:_,v:_.view})).sort((_,I)=>{const b=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct;return b(I)-b(_)})},d=async()=>{var g;if(!a()){o(!0);try{const I=((g=(await Bs()).refresh)==null?void 0:g.stale)??[];l(I.length?`Marks refreshed — ${I.length} position(s) unpriced (kept last mark).`:"Marks refreshed.")}catch(_){l(`Refresh failed: ${_.message}`)}finally{o(!1)}await e()}},h=async g=>{if(!a()){o(!0);try{const _=await Us(g);l(`Added ${_.position.symbol} ${_.position.strike} — press Refresh marks to price it.`)}catch(_){l(`Add failed: ${_.message}`)}finally{o(!1)}await e()}},m=async(g,_,I)=>{if(!a()){o(!0);try{await Fs(g),l(_==="expired"?"Position removed (expired worthless — premium kept).":"Position removed.")}catch(b){l(`Close failed: ${b.message}`)}finally{o(!1)}s(null),await e()}};return(()=>{var g=Ud(),_=g.firstChild,I=_.firstChild;return u(_,f(Gd,{onAdd:h,busy:a}),I),I.$$click=d,u(g,f(E,{get when(){return n()},get children(){var b=Dd();return u(b,n),b}}),null),u(g,f(E,{get when(){return t.error},fallback:null,get children(){var b=Ld();return b.firstChild,u(b,()=>t.error.message,null),b}}),null),u(g,f(E,{get when(){return c().length>0},get fallback(){return Fd()},get children(){var b=Md();return u(b,f(ee,{get each(){return c()},children:({p:y,v})=>(()=>{var x=Hd(),A=x.firstChild,T=A.firstChild,S=T.firstChild,L=S.nextSibling;L.nextSibling;var R=T.nextSibling,P=R.firstChild,D=P.nextSibling,U=D.nextSibling,F=U.nextSibling,Q=F.nextSibling,ge=Q.nextSibling;ge.nextSibling;var Ae=A.nextSibling,$=Ae.firstChild,w=$.nextSibling;w.firstChild;var N=Ae.nextSibling,B=N.firstChild,V=B.nextSibling,se=N.nextSibling,z=se.firstChild,ht=z.firstChild,xt=ht.nextSibling,K=z.nextSibling,me=K.firstChild,Re=me.nextSibling,Pe=K.nextSibling;Pe.firstChild;var Ye=Pe.nextSibling,Xe=Ye.firstChild,Xn=Xe.nextSibling,Qn=se.nextSibling,Zn=Qn.firstChild;return u(T,()=>y.symbol,S),u(T,()=>y.strike,L),u(T,()=>y.contracts,null),u(R,()=>y.expiry,D),u(R,()=>v.days_elapsed,F),u(R,()=>v.days_total,ge),u($,(()=>{var M=q(()=>v.pl_pct==null);return()=>M()?"—":`${v.pl_pct>=0?"+":""}${kn(v.pl_pct,1)}`})()),u(w,()=>kn(v.target_pct),null),u(xt,()=>Ln(y.premium)),u(Re,(()=>{var M=q(()=>y.mark==null);return()=>M()?"—":y.mark.mid.toFixed(2)})()),u(K,f(E,{get when(){return y.mark!=null},get children(){var M=Gr();return u(M,()=>zd(y.mark.as_of)),M}}),null),u(K,f(E,{get when(){return y.mark==null},get children(){return Bd()}}),null),u(Pe,f(E,{get when(){var M;return((M=y.mark)==null?void 0:M.underlying_price)!=null},get fallback(){return Wd()},get children(){return[(()=>{var M=os();return u(M,()=>y.mark.underlying_price.toFixed(2)),M})(),(()=>{var M=Gr();return u(M,()=>`${v.spot_pct_vs_strike>=0?"+":""}${kn(v.spot_pct_vs_strike,1)} vs strike`),k(()=>te(M,v.spot_pct_vs_strike<0?"holdings-neg":"holdings-pos")),M})()]}}),null),u(Xn,(()=>{var M=q(()=>v.pl_dollars==null);return()=>M()?"—":Ln(v.pl_dollars)})()),u(Qn,f(E,{get when(){return v.pace_met},get fallback(){return jd()},get children(){return Vd()}}),Zn),Zn.$$click=()=>s(y),k(M=>{var er=!!v.pace_met,tr=v.pl_pct>=0?"holdings-pos":"holdings-neg",nr=`${v.pl_pct==null?0:Math.max(0,Math.min(100,v.pl_pct*100))}%`,rr=`${Math.min(100,v.target_pct*100)}%`,ir=v.pl_dollars>=0?"holdings-pos":"holdings-neg";return er!==M.e&&x.classList.toggle("holdings-card-met",M.e=er),tr!==M.t&&te($,M.t=tr),nr!==M.a&&Ge(B,"width",M.a=nr),rr!==M.o&&Ge(V,"left",M.o=rr),ir!==M.i&&te(Xn,M.i=ir),M},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),x})()})),b}}),null),u(g,f(E,{get when(){return i()},get children(){return f(Kd,{get position(){return i()},busy:a,onClose:()=>s(null),onConfirm:(b,y)=>m(i().id,b)})}}),null),k(()=>I.disabled=a()),g})()}ce(["input","click"]);async function Jd(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
-`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Yd=p("<button type=button class=run-btn>"),Xd=p("<span class=run-count>/"),Qd=p("<span class=run-bar><span class=fill>"),Zd=p("<li><span class=mark></span><span class=label>"),eh=p("<div class=toast-cached>Served from cache — last run <!> min old"),th=p('<div class="toast-cached warn">'),nh=p("<div class=run-headline>"),rh=p("<ul class=run-stages>"),ih=p("<details class=run-errors><summary>details</summary><ul>"),sh=p("<div class=run-warn>Closing this tab stops the run."),ah=p("<div class=run-warn>Re-checking every 15 s…"),oh=p("<div class=run-strip>"),lh=p("<li> ");const ls=["quotes","metrics","chains_short","chains_medium"],cs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},ch=15e3,us=t=>t!==null&&Date.now()>=t;function Kr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function uh(t){const[e,n]=O("idle"),[r,i]=O(A()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,m]=O(null),[g,_]=O("");let I=null,b=null;const[y,v]=O(0);let x=null;ze(()=>{const $=t();if(x&&(clearTimeout(x),x=null),($==null?void 0:$.run_allowed)===!1){const w=tn($.next_open_utc);w!==null&&(x=setTimeout(()=>v(N=>N+1),Math.max(0,w-Date.now())))}});function A(){return Object.fromEntries(ls.map($=>[$,{status:"pending",error:null}]))}function T(){I&&clearInterval(I),I=null,b&&clearInterval(b),b=null}function S(){l(0),I=setInterval(()=>l($=>$+1),1e3)}function L($){switch($.type){case"stage_started":i(w=>({...w,[$.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:$.stage,done:$.done,total:$.total});break;case"stage_finished":i(w=>({...w,[$.stage]:{status:$.ok?"ok":"failed",error:$.error??null}}));break;case"run_finished":d($);break}}function R(){T();const $=c(),w=(($==null?void 0:$.stages)??[]).some(N=>N.name.startsWith("chains")&&["ok","partial"].includes(N.status));n($&&(w||$.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function P($){let w=!1;return await Jd($,N=>{L(N),N.type==="run_finished"&&(w=!0)}),w?(R(),!0):!1}async function D($){n("detached"),b=setInterval(async()=>{var w,N,B;try{const V=await ii(),se=((N=(w=V==null?void 0:V.result)==null?void 0:w.run)==null?void 0:N.finished_at_utc)??null;if(se&&se!==$){i(U(V.result)),T(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((B=V==null?void 0:V.run_state)==null?void 0:B.status)!=="running"&&(T(),n("idle"),_("Stream lost and the run was canceled — press Run to retry."))}catch{}},ch)}function U($){const w=A();for(const N of($==null?void 0:$.stages)??[])w[N.name]&&(w[N.name]={status:N.status,error:N.error});return w}async function F(){var B,V,se;if(["starting","running","detached"].includes(e()))return;_(""),d(null),a(null),i(A()),m(null);const $=((se=(V=(B=t())==null?void 0:B.result)==null?void 0:V.run)==null?void 0:se.finished_at_utc)??null;n("running"),S();let w;try{w=await Ds()}catch{T(),n("idle"),_("Run failed to start — network or server unreachable.");return}const N=w.headers.get("content-type")??"";if(w.ok&&N.includes("application/json")){const z=await w.json().catch(()=>null);if(T(),n("idle"),(z==null?void 0:z.status)==="cached"){m(z.age_secs),setTimeout(()=>m(null),6e3);return}}if(w.status===403&&N.includes("application/json")){const z=await w.json().catch(()=>null);T(),n("idle"),_(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(w.status===202){const z=await Ls();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await P(z)||await D($);return}await D($);return}if(N.includes("text/event-stream")){await P(w)||await D($);return}T(),n("idle"),_(`Unexpected /api/run response (${w.status}, ${N||"no type"}).`)}return Ue(()=>{T(),x&&clearTimeout(x)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:g,triggerRun:F,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{y();const $=t();return($==null?void 0:$.run_allowed)!==!1?!0:us(tn($==null?void 0:$.next_open_utc))},nextOpenUtc:()=>{var $;return(($=t())==null?void 0:$.next_open_utc)??null}}}function dh(t){const e=()=>!t.run.runAllowed(),n=()=>rs(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Yd();return i.$$click=()=>t.run.triggerRun(),u(i,r),k(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&re(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function hh(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Zd(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>cs[t.name]),u(i,f(E,{get when(){return r()!==null},get children(){return[(()=>{var o=Xd(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Qd(),l=o.firstChild;return k(c=>Ge(l,"width",`${r()}%`)),o})()]}}),null),k(()=>te(i,`run-stage ${e()}`)),i})()}function fh(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>Kr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>Kr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(E,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=oh();return u(i,f(E,{get when(){return e.cachedToast()},get children(){var s=eh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(E,{get when(){return e.notice()},get children(){var s=th();return u(s,()=>e.notice()),s}}),null),u(i,f(E,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=nh();return u(s,r),s})(),(()=>{var s=rh();return u(s,()=>ls.map(a=>f(hh,{name:a,run:e}))),s})(),f(E,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=ih(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=lh(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>cs[l.name]??l.name,null),u(c,(()=>{var h=q(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(E,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return sh()}}),null),u(i,f(E,{get when(){return e.phase()==="detached"},get children(){return ah()}}),null),i}})}ce(["click"]);var ds=p("<b>"),ph=p("<span>Market closed · last run <b></b> ago"),gh=p("<div class=cache-line><span></span><span class=pill>run: "),mh=p("<span>Cached · <b></b> left"),_h=p("<span>Stale · last run <b></b> ago"),bh=p("<nav class=tabs role=tablist aria-label=timeframes>"),yh=p("<button type=button role=tab class=tab>"),wh=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),vh=p("<div class=pop-backdrop>"),Eh=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Ih=p("<div class=error-banner>API error: "),Sh=p("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),kh=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function $h(){const[t,e]=O(fu()),n=r=>{e(r),pu(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(gt)}}function qr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Th(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function Jr(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function $n(t){return f(E,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=ds();return u(e,()=>t.at()),e})()]}})}function Ch(t){const[e,n]=O(0);wt(()=>{const g=setInterval(()=>n(_=>_+1),3e4);Ue(()=>clearInterval(g))});let r=Date.now(),i=0;ze(_t(()=>t.envelope,g=>{r=Date.now(),i=(g==null?void 0:g.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const g=Math.max(0,(t.envelope.cache_secs??0)-s());return g>=60?`${Math.floor(g/60)}m`:`${g}s`},c=()=>{var g,_;return $u((_=(g=t.envelope.result)==null?void 0:g.run)==null?void 0:_.finished_at_utc)},d=()=>{e();const g=t.envelope.next_open_utc,_=tn(g);if(!(_===null||us(_)))return rs(g)},h=()=>o()&&a()==="stale"?"closed":a(),m=()=>a()==="fresh"||a()==="stale";return(()=>{var g=gh(),_=g.firstChild,I=_.nextSibling;return I.firstChild,u(g,f(E,{get when(){return q(()=>!!o())()&&m()},get fallback(){return f(E,{get when(){return a()==="fresh"},get fallback(){return f(E,{get when(){return a()==="stale"},get children(){var b=_h(),y=b.firstChild,v=y.nextSibling;return v.nextSibling,u(v,()=>Jr(s())),u(b,f($n,{at:c}),null),b}})},get children(){var b=mh(),y=b.firstChild,v=y.nextSibling;return v.nextSibling,u(v,l),u(b,f($n,{at:c}),null),b}})},get children(){var b=ph(),y=b.firstChild,v=y.nextSibling;return v.nextSibling,u(v,()=>Jr(s())),u(b,f($n,{at:c}),null),u(b,f(E,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var x=ds();return u(x,d),x})()]}}),null),b}}),_),u(_,(()=>{var b=q(()=>h()==="closed");return()=>b()?"market closed":a()})()),u(I,()=>{var b;return((b=t.envelope.run_state)==null?void 0:b.status)??"idle"},null),k(()=>te(_,"pill "+h())),g})()}function Yr(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=bh();return u(n,()=>e.map(r=>(()=>{var i=yh();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=q(()=>!r.holdings);return()=>s()&&` (${mt(Th(t.result,r.id))})`})(),null),k(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&re(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Ah(){const[t,e]=O(void 0),[n,{refetch:r}]=Zr(t,y=>y?ii():void 0);wt(()=>{if(!ot){e(null);return}const y=vl(Ze(),e);Ue(y)});const[i,s]=O(!1);ze(_t(t,y=>{s(!1),!(!y||!ot)&&Ps().then(v=>s(v.status===403)).catch(()=>{})})),wt(()=>{const y=()=>r();window.addEventListener("webapp:refresh-latest",y),Ue(()=>window.removeEventListener("webapp:refresh-latest",y))});const a=()=>{var y,v;return((y=t())==null?void 0:y.email)||((v=t())==null?void 0:v.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=$h(),[m,g]=O("short"),_=()=>m()==="holdings",I=uu(),b=uh(()=>n());return f(E,{get when(){return t()},get fallback(){return f(qc,{})},get children(){return[f(E,{get when(){return!i()},get fallback(){return f(Kc,{get email(){return a()},onSignOut:()=>Fr()})},get children(){var y=Sh(),v=y.firstChild,x=v.firstChild,A=x.nextSibling,T=A.nextSibling;return u(x,f(E,{get when(){return t()},get children(){return[(()=>{var S=wh(),L=S.firstChild,R=L.nextSibling;return S.$$click=()=>l(!o()),u(R,a),k(()=>re(S,"aria-expanded",o())),S})(),f(E,{get when(){return o()},get children(){return[(()=>{var S=vh();return S.$$click=()=>l(!1),S})(),(()=>{var S=Eh(),L=S.firstChild,R=L.nextSibling,P=R.nextSibling,D=P.nextSibling;return u(R,a),P.$$click=()=>{l(!1),d(!0)},D.$$click=()=>{l(!1),Fr()},S})()]}})]}})),u(v,f(E,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(Ch,{get envelope(){return n()}})}}),T),u(T,f(dh,{run:b})),u(y,f(E,{get when(){return n.error},get children(){var S=Ih();return S.firstChild,u(S,()=>n.error.message,null),S}}),null),u(y,f(fh,{run:b}),null),u(y,f(E,{get when(){return _()},get children(){return[f(Yr,{result:()=>{var S;return(S=n())==null?void 0:S.result},tab:m,onTab:g}),f(qd,{})]}}),null),u(y,f(E,{get when(){return!_()},get children(){return f(E,{get when(){var S;return q(()=>!n.loading)()&&((S=n())==null?void 0:S.result)},get fallback(){return f(E,{get when(){return!n.loading},get children(){return kh()}})},children:S=>{const L=()=>S();return[f(hu,{scoring:I}),f(Yr,{result:L,tab:m,onTab:g}),f(zr,{id:"short",active:()=>m()==="short",get tf(){var R;return(R=L().timeframes)==null?void 0:R.short},get stageError(){return qr(L(),"chains_short")},get stages(){return L().stages},get thresholds(){return L().thresholds},columns:h,scoring:I}),f(zr,{id:"medium",active:()=>m()==="medium",get tf(){var R;return(R=L().timeframes)==null?void 0:R.medium},get stageError(){return qr(L(),"chains_medium")},get stages(){return L().stages},get thresholds(){return L().thresholds},columns:h,scoring:I})]}})}}),null),y}}),f(E,{get when(){return c()},get children(){return f(eu,{onClose:()=>d(!1)})}})]}})}ce(["click"]);Ts(()=>f(Ah,{}),document.getElementById("root"));
+ */const Vc=300,Hc=gi("authIdTokenMaxAge")||Vc;let Wr=null;const Wc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Hc)return;const i=n==null?void 0:n.token;Wr!==i&&(Wr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function jc(t=yo()){const e=yi(t,"auth");if(e.isInitialized())return e.getImmediate();const n=dl(t,{popupRedirectResolver:Mc,persistence:[ql,Dl,Yi]}),r=gi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Wc(s.toString());Pl(n,a,()=>a(n.currentUser)),Al(n,o=>a(o))}}const i=sa("auth");return i&&fl(n,`http://${i}`),n}function zc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}il({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=he("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",zc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Bc("Browser");const Gc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},ve=Gc,dt=!!ve.VITE_FIREBASE_APP_ID;let Cn=null;function tt(){if(!dt)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!Cn){const t=vi({apiKey:ve.VITE_FIREBASE_API_KEY,authDomain:ve.VITE_FIREBASE_AUTH_DOMAIN,projectId:ve.VITE_FIREBASE_PROJECT_ID,appId:ve.VITE_FIREBASE_APP_ID,...ve.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:ve.VITE_FIREBASE_STORAGE_BUCKET},...ve.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:ve.VITE_FIREBASE_MESSAGING_SENDER_ID}});Cn=jc(t)}return Cn}function jr(){return new we}async function zr(){if(!dt)return;const t=tt();t.currentUser&&await Rl(t)}var qc=m(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),Kc=m('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),Jc=m("<button type=button class=gate-toggle>"),Yc=m("<div class=gate-or>── or ──"),Xc=m("<button type=button class=btn>Continue with Google"),Qc=m("<div class=gate-error role=alert>"),Zc=m("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),eu=m("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),tu=m("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const nu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Gr(t){const e=(t==null?void 0:t.code)??"";return nu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function ru(t){return(()=>{var e=qc(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),H(l,"click",t.onSignOut),e})()}function iu(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");Bs(async g=>{if(!dt)return null;const _=tt().currentUser;return _?await _.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),c("");try{const _=tt();t()==="create"?await Cl(_,n(),i()):await Tl(_,n(),i())}catch(_){c(Gr(_))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await Ql(tt(),jr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await ic(tt(),jr());return}c(Gr(g))}finally{o(!1)}}}return(()=>{var g=Zc(),_=g.firstChild;return _.firstChild,u(_,f(C,{when:dt,get fallback(){return[eu(),tu()]},get children(){return[(()=>{var b=Kc(),I=b.firstChild,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling;return b.addEventListener("submit",d),v.$$input=E=>r(E.currentTarget.value),T.$$input=E=>s(E.currentTarget.value),u(P,(()=>{var E=q(()=>!!a());return()=>E()?"Working…":t()==="create"?"Create account":"Sign in"})()),w(E=>{var D=t()==="create"?"new-password":"current-password",x=a();return D!==E.e&&se(T,"autocomplete",E.e=D),x!==E.t&&(P.disabled=E.t=x),E},{e:void 0,t:void 0}),w(()=>v.value=n()),w(()=>T.value=i()),b})(),(()=>{var b=Jc();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),w(()=>b.disabled=a()),b})(),Yc(),(()=>{var b=Xc();return b.$$click=h,w(()=>b.disabled=a()),b})(),f(C,{get when(){return l()},get children(){var b=Qc();return u(b,l),b}})]}}),null),g})()}pe(["click","input"]);var su=m("<div class=gate-error role=alert>"),au=m("<p class=gate-note>No grant-file entries yet."),ou=m("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),lu=m('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),cu=m("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function uu(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=y=>{n((y==null?void 0:y.file_grants)??[]),i((y==null?void 0:y.static_emails)??[])};lt(async()=>{try{h(await Hs())}catch{d("Could not load the grant list.")}});const _=y=>{y.key==="Escape"&&t.onClose()};lt(()=>{window.addEventListener("keydown",_),Be(()=>window.removeEventListener("keydown",_));const y=document.querySelector(".access-add input");y==null||y.focus()});const b=async y=>{if(y.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Ws(s())),a("")}catch(v){d(v.message)}l(!1)}},I=async y=>{if(!o()){l(!0),d("");try{h(await js(y))}catch(v){d(v.message)}l(!1)}};return(()=>{var y=lu(),v=y.firstChild,S=v.firstChild,A=S.nextSibling,T=A.nextSibling,P=T.firstChild,E=P.nextSibling,D=T.nextSibling;return H(y,"click",t.onClose),v.$$click=x=>x.stopPropagation(),u(v,f(C,{get when(){return c()},get children(){var x=su();return u(x,c),x}}),T),u(v,f(ie,{get each(){return e()},children:x=>(()=>{var M=cu(),p=M.firstChild,k=p.nextSibling;return u(p,x),k.$$click=()=>I(x),se(k,"title",`Remove ${x}`),se(k,"aria-label",`Remove ${x}`),w(()=>k.disabled=o()),M})()}),T),u(v,f(C,{get when(){return e().length===0},get children(){return au()}}),T),T.addEventListener("submit",b),P.$$input=x=>a(x.currentTarget.value),u(E,()=>o()?"…":"Add"),u(v,f(C,{get when(){return r().length>0},get children(){var x=ou();return x.firstChild,u(x,()=>r().join(", "),null),x}}),D),H(D,"click",t.onClose),w(()=>E.disabled=o()),w(()=>P.value=s()),y})()}pe(["click","input"]);const Ee=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),kt=(t,e,n)=>Math.min(n,Math.max(e,t));function du(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:kt((n-t)/r,0,1)}function hu(t,e,n,r,i=Ee){if(n<i.minRateOfReturn||t<=0)return null;const s=kt(t/2,0,1),a=kt(e,0,1),o=Math.min(n/i.idealReturn,1),l=kt((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function fu(t,e=Ee){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?kt(1+t.delta,0,1):du(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),hu(r,a,n,i,e)}function gu(t,e=Ee.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function pu(t){return t.weightSharpe===Ee.weightSharpe&&t.weightSafety===Ee.weightSafety&&t.weightReturn===Ee.weightReturn&&t.minRateOfReturn===Ee.minRateOfReturn}var mu=m("<span class=hint>production defaults · drag to re-rank live"),_u=m("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),bu=m('<span class="hint hint-custom">custom weights'),yu=m("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function vu(){const[t,e]=O({...Ee});return{params:t,isCustom:()=>!pu(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Ee})}}const wu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Su(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=_u(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(C,{get when(){return!e()},get fallback(){return bu()},get children(){return mu()}}),null),u(s,f(ie,{each:wu,children:o=>(()=>{var l=yu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,g=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(C,{get when(){return o.weight},get children(){return[" ","· ",q(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=_=>t.scoring.setParam(o.key,Number(_.currentTarget.value)),w(_=>{var b=o.max,I=o.step;return b!==_.e&&se(g,"max",_.e=b),I!==_.t&&se(g,"step",_.t=I),_},{e:void 0,t:void 0}),w(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),w(()=>r.open=e()),r})()}pe(["click","input"]);const mn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],vt=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],as="webapp.columns.v1";function $u(){try{const t=localStorage.getItem(as);if(!t)return vt;const e=JSON.parse(t);if(!Array.isArray(e))return vt;const n=new Set(mn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:vt}catch{return vt}}function ku(t){try{localStorage.setItem(as,JSON.stringify(t))}catch{}}var Eu=m("<div class=pop-backdrop>"),Iu=m('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Cu=m("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Tu=m("<label class=pick-item><input type=checkbox>");function Au(t){const[e,n]=O(!1);return(()=>{var r=Cu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(C,{get when(){return e()},get children(){return[(()=>{var s=Eu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Iu(),a=s.firstChild,o=a.nextSibling;return u(a,f(ie,{each:mn,children:l=>(()=>{var c=Tu(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),w(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),w(()=>se(i,"aria-expanded",e())),r})()}pe(["click"]);var Pu=m('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),xu=m("<span class=pggap>…"),Ru=m("<button type=button class=pgbtn>");function Ou(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Nu(t){const e=Q(()=>Ou(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Pu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ie,{get each(){return e()},children:d=>d==="…"?xu():(()=>{var h=Ru();return h.$$click=()=>t.onGo(d),u(h,d),w(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,w(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(c.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}pe(["click"]);var Du=m("<span class=tip>");function pt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Du();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?Us(i,r):e=r,u(r,()=>t.children),w(()=>se(r,"data-tip",t.text??"")),r})()}pe(["focusin"]);const Ye="∅";function K(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function wt(t){return Number(t??0).toLocaleString("en-US")}function cn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function os(t){return ls(t,{hour:"2-digit",minute:"2-digit"})}function Lu(t){return ls(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function ls(t,e){const n=cn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const cs={text:Ye,isNull:!0},Tn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function qr(t,e){return!e||K(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function Mu(t,e){return!e||K(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function Uu(t){if(!t||typeof t!="object"||K(t.report_date))return cs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function oe(t,e){if(K(e))return cs;switch(t){case"fixed2":return Tn(e,2);case"fixed3":return Tn(e,3);case"ivrv":return Tn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return Uu(e);default:return{text:String(e),isNull:!1}}}const Kr=t=>Number(t*100).toFixed(0);function Fu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Kr(e.momentum_high),s=Kr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function mt(t,e){return Fu(e)[t]??t}var us=m("<span class=tip-target>"),Bu=m("<div class=kv><span class=kv-label></span><span class=kv-value>"),Vu=m("<span class=tip-target>Strike position in band"),Hu=m('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Wu=m("<div class=exp-block><h4>"),ju=m("<div class=kv-value>Band unavailable (∅)"),zu=m("<div><span class=marker-tick></span><span class=marker-cap><br>"),Gu=m("<div class=exp-block><h4>Premium economics"),qu=m("<b>"),Ku=m('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),Ju=m("<div class=muted-note>earnings-discounted safety applied"),Yu=m("<div class=exp-block><h4>Score breakdown"),Xu=m("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),Qu=m('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),Zu=m("<span class=muted-note>all columns visible"),ed=m('<div class="exp-block exp-chips"><h4>Hidden columns'),td=m("<span class=tip-target>: "),nd=m("<span>"),rd=m("<span class=tip-target>band safety is already discounted by the earnings rule."),id=m("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),sd=m("<div class=expansion><div class=exp-grid>");const An={sharpe:.2,safety:.4,return_part:.4};function Pn(t,e=2){return K(t)?Ye:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function _e(t,e,n){return(()=>{var r=Bu(),i=r.firstChild,s=i.nextSibling;return u(i,f(pt,{get text(){return mt(t,e)},get children(){var a=us();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function ad(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=K(e.mid)?null:e.strike-e.mid,s=i!=null&&!K(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!K(a)&&l>a&&!K(e.strike),d=g=>{if(K(g))return null;const _=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,_))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=Wu(),_=g.firstChild;return u(_,f(pt,{get text(){return mt("band_range",t.thresholds)},get children(){return Vu()}})),u(g,f(C,{when:c,get fallback(){return ju()},get children(){var b=Hu(),I=b.firstChild;return u(b,f(ie,{each:h,children:y=>(()=>{var v=zu(),S=v.firstChild,A=S.nextSibling,T=A.firstChild;return u(A,()=>y.label,T),u(A,()=>oe("fixed2",y.v).text,null),w(P=>{var E=`marker ${y.cls}`,D=`${d(y.v)}%`;return E!==P.e&&te(v,P.e=E),D!==P.t&&Je(v,"left",P.t=D),P},{e:void 0,t:void 0}),v})()}),null),w(y=>{var v=`${d(e.strike_from)}%`,S=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return v!==y.e&&Je(I,"left",y.e=v),S!==y.t&&Je(I,"width",y.t=S),y},{e:void 0,t:void 0}),b}}),null),u(g,()=>_e("band_range",t.thresholds,`${oe("fixed2",e.strike_from).text} → ${oe("fixed2",e.strike_to).text}`),null),u(g,()=>_e("band_depth",t.thresholds,r==null?Ye:`${(r*100).toFixed(1)}%`),null),u(g,()=>_e("cushion_be",t.thresholds,s==null?Ye:`${s.toFixed(1)}%`),null),g})()}function od(t){const e=t.row,n=K(e.strike)?null:e.strike*100,r=K(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=oe("pct1",e.rate_of_return);return(()=>{var a=Gu();return a.firstChild,u(a,()=>_e("capital",t.thresholds,n==null?Ye:Pn(n,0)),null),u(a,()=>_e("premium",t.thresholds,r==null?Ye:Pn(r)),null),u(a,()=>_e("breakeven",t.thresholds,i==null?Ye:Pn(i)),null),u(a,()=>_e("ann_ror",t.thresholds,(()=>{var o=qu();return u(o,()=>s.text),o})()),null),u(a,()=>_e("bid",t.thresholds,oe("fixed2",e.bid).text),null),u(a,()=>_e("ask",t.thresholds,oe("fixed2",e.ask).text),null),u(a,()=>_e("expiration",t.thresholds,e.expiration),null),a})()}function ld(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:An.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:An.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:An.return_part,v:n==null?void 0:n.return}];return(()=>{var i=Yu();return i.firstChild,u(i,f(C,{when:n,get fallback(){return(()=>{var s=Xu(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>oe("fixed3",e.score).text),s})()},get children(){return[f(ie,{each:r,children:s=>{const a=K(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=Qu(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=l.nextSibling,b=_.firstChild,I=_.nextSibling;return u(l,f(pt,{get text(){return mt(s.key,t.thresholds)},get children(){var y=us();return u(y,()=>s.label),y}}),c),u(d,()=>s.weight*100,g),u(I,()=>oe("fixed3",s.v).text),w(y=>Je(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=Ku(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>oe("fixed3",e.score).text),s})(),f(C,{get when(){return e.earnings_before_expiry},get children(){return Ju()}})]}}),null),i})()}function cd(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:oe(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=ed();return n.firstChild,u(n,f(ie,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=nd();return u(s,f(pt,{get text(){return mt(r.id,t.thresholds)},get children(){var a=td(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),w(()=>te(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(C,{get when(){return t.hiddenDefs.length===0},get children(){return Zu()}}),null),n})()}function ud(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=sd(),i=r.firstChild;return u(r,f(C,{when:n,get children(){var s=id(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(C,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),c),u(s,f(C,{get when(){return!K(n.expected_eps)},get children(){return[" ","· expected EPS ",q(()=>oe("fixed2",n.expected_eps).text)]}}),h),u(s,f(pt,{get text(){return mt("earnings_before_expiry",t.thresholds)},get children(){return rd()}}),null),s}}),i),u(i,f(ad,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(od,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(ld,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(cd,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var dd=m("<span class=null-mark>"),hd=m("<span class=star>★"),fd=m("<td><b>"),xn=m("<span>"),Jr=m("<td class=num>"),gd=m("<span class=score-frozen>prod "),pd=m('<td class="num score-cell">'),md=m('<span class="score-frozen readmit">re-admitted'),_d=m("<td>"),bd=m("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),yd=m("<span class=sort-arrow>"),vd=m("<span class=tip-target>"),wd=m("<th role=button tabindex=0>"),Sd=m("<tr class=expandable><td class=exp-col>"),$d=m("<tr class=exp-row><td>");const kd=t=>`${t.underlying}|${t.strike}`;function Ed(t){return(()=>{var e=dd();return u(e,()=>t.text),e})()}function Vt(t){const e=oe(t.kind,t.value);return f(C,{get when(){return!e.isNull},get fallback(){return f(Ed,{get text(){return e.text}})},get children(){return e.text}})}function Id(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=fd(),i=r.firstChild;return u(r,f(C,{get when(){return t.pickRank!=null},get children(){var s=hd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(C,{get when(){return qr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=xn();return w(()=>te(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Jr();return u(r,f(C,{get when(){return qr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=xn();return w(()=>te(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=pd();return u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(C,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(C,{get when(){return!K(n.frozen_score)},get fallback(){return f(C,{get when(){return!K(n.score)},get children(){return md()}})},get children(){var i=gd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Jr();return u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(C,{get when(){return Mu(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=xn();return u(s,i),w(()=>te(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=_d();return u(r,f(Vt,{get kind(){return e.kind},get value(){return n[e.id]}})),w(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Cd(t){const e=Q(()=>mn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=bd(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ie,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=wd();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(pt,{get text(){return mt(a.id,t.thresholds)},get children(){var c=vd();return u(c,()=>a.label,null),u(c,f(C,{get when(){return o()},get children(){return[" ",(()=>{var d=yd();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),w(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&se(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ie,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>kd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Sd(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ie,{get each(){return e()},children:g=>f(Id,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),w(g=>{var _=o()!=null,b=!!K(a.score),I=!!c();return _!==g.e&&d.classList.toggle("pick",g.e=_),b!==g.t&&d.classList.toggle("prow",g.t=b),I!==g.a&&d.classList.toggle("open",g.a=I),g},{e:void 0,t:void 0,a:void 0}),d})(),f(C,{get when(){return c()},get children(){var d=$d(),h=d.firstChild;return u(h,f(ud,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),w(()=>se(h,"colspan",e().length+1)),d}})]}})),n})()}pe(["click","keydown"]);function Td(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const nt=t=>K(t);function Ad(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=nt(a),c=nt(o);return l||c?l&&c?0:l?1:-1:r*Td(a,o)})}function Pd(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=nt(r),a=nt(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=nt(l),h=nt(c);return d||h?d&&h?0:d?1:-1:c-l})}var xd=m("<div class=stage-badges>"),Rd=m("<pre class=errbox>"),Od=m("<details><summary> "),Nd=m("<div class=scroll-region>"),Dd=m('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Ld=m("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),Md=m("<div class=empty-panel>No rows match the current filter."),Ud=m('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Rn=100,Fd=150,Yr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function Bd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=xd();return u(i,f(ie,{get each(){return t.stages??[]},children:s=>(()=>{var a=Od(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(C,{get when(){return s.error},get children(){var c=Rd();return u(c,()=>s.error),c}}),null),w(()=>te(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function Xr(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,g]=O(1);let _;Be(()=>clearTimeout(_));const b=()=>{var $;return(($=t.tf)==null?void 0:$.rows)??[]},I=Q(()=>{const $=t.scoring.params(),F=t.scoring.isCustom();return b().map(R=>{const V=fu(R,$);return{...R,frozen_score:R.score,live_parts:V,score:F?V==null?null:V.total:R.score}})}),y=Q(()=>I().filter($=>!K($.score)&&K($.frozen_score)).length),v=$=>{const F=$.currentTarget.value;n(F),clearTimeout(_),_=setTimeout(()=>{i(F.trim().toLowerCase()),g(1)},Fd)},S=$=>{a($),g(1)},A=$=>{o()!==$?(l($),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[T,P]=O(null),E=$=>{const F=`${$.underlying}|${$.strike}`;P(R=>R===F?null:F)};Ke(St([o,c,h,r,s],()=>P(null))),Ke(St(t.active,()=>P(null))),Ke(St(t.columns.visible,()=>g(1)));const D=()=>mn.filter($=>!t.columns.visible().includes($.id)),x=()=>(t.stages??[]).find($=>$.name===Yr[t.id].id),M=Q(()=>{const $=r();return $?I().filter(F=>{const R=F.underlying,V=F.sector;return R!=null&&String(R).toLowerCase().includes($)||V!=null&&String(V).toLowerCase().includes($)}):I()}),p=Q(()=>{const $=M();return s()?$.filter(F=>!K(F.score)):$}),k=Q(()=>o()?Ad(p(),o(),c()):Pd(p())),U=Q(()=>Math.max(1,Math.ceil(k().length/Rn))),J=()=>Math.min(h(),U()),Y=()=>{const $=J();return k().slice(($-1)*Rn,$*Rn)},ce=Q(()=>{var F;const $=new Map;if(t.scoring.isCustom()){const R=gu(I().map(V=>({row:V,score:V.score})));for(const V of R)$.set(`${V.row.underlying}|${V.row.strike}`,$.size+1)}else for(const R of((F=t.tf)==null?void 0:F.top_picks)??[])$.set(`${R.underlying}|${R.strike}`,R.rank??"?");return $}),N=$=>ce().get(`${$.underlying}|${$.strike}`);return(()=>{var $=Dd(),F=$.firstChild,R=F.firstChild,V=R.nextSibling,ne=V.firstChild,z=V.nextSibling,Re=z.firstChild,Mt=Re.nextSibling;return Mt.nextSibling,u($,f(Bd,{get stages(){return t.stages}}),F),R.$$input=v,ne.addEventListener("change",X=>S(X.currentTarget.checked)),u(F,f(Au,{get store(){return t.columns}}),z),u(z,()=>wt(k().length),Re),u(z,()=>wt(b().length),Mt),u(z,f(C,{get when(){return q(()=>!!t.scoring.isCustom())()&&y()>0},get children(){return[" ","· ",q(()=>wt(y()))," re-admitted by lower floor"]}}),null),u($,f(C,{get when(){return Y().length>0},get children(){var X=Nd();return u(X,f(Cd,{get visibleCols(){return t.columns.visible},rows:Y,sortKey:o,sortDir:c,onSort:A,get thresholds(){return t.thresholds},pickRankOf:N,openKey:T,onToggleRow:E,hiddenDefs:D,get customScores(){return t.scoring.isCustom}})),X}}),null),u($,f(C,{get when(){return Y().length===0},get children(){return f(C,{get when(){var X,ue;return((X=x())==null?void 0:X.status)==="failed"||((ue=x())==null?void 0:ue.status)==="partial"},get fallback(){return f(C,{get when(){return q(()=>!!s())()&&M().length>0},get fallback(){return Md()},get children(){var X=Ld(),ue=X.firstChild,Oe=ue.nextSibling,ze=Oe.nextSibling,me=ze.nextSibling,Ze=me.nextSibling;return Ze.nextSibling,u(X,()=>wt(M().length),Ze),X}})},children:X=>(()=>{var ue=Ud(),Oe=ue.firstChild,ze=Oe.firstChild,me=ze.nextSibling;me.nextSibling;var Ze=Oe.nextSibling;return u(Oe,()=>X().status==="partial"?"△":"✗",ze),u(Oe,()=>Yr[t.id].label,me),u(Ze,()=>X().error??"stage produced no data"),ue})()})}}),null),u($,f(C,{get when(){return k().length>0},get children(){return f(Nu,{page:J,pageCount:U,onGo:g})}}),null),w(()=>$.hidden=!t.active()),w(()=>R.value=e()),w(()=>ne.checked=s()),$})()}pe(["input"]);var Vd=m("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Hd=m('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save'),Wd=m('<button type=button class="btn-ghost hp-cash-edit">'),jd=m("<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved"),zd=m("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),Gd=m('<span class="chip high">buy back?'),qd=m('<span class="chip high">ITM — called away?'),ir=m("<b>"),Kd=m("<i>"),Jd=m('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),Yd=m('<span class="chip normal">holding'),Xd=m("<b>—"),Qd=m('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 350.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.00"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell put</button><button type=button class=btn>Cancel'),Zd=m('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal placeholder="e.g. 355.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.80"></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel</button><div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares'),eh=m('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),th=m('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),ds=m("<label class=holdings-outcome-price><input inputmode=decimal>"),nh=m("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),rh=m('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),ih=m('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),sh=m("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),ah=m('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),oh=m("<div class=holdings-notice>"),lh=m('<div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),ch=m('<div class="holdings-panel hp-wheel"><aside class=hp-rail><div class=hp-rail-block><div class=hp-rail-label>the wheel</div><div class=hp-rail-row><span>open puts</span><b></b></div><div class=hp-rail-row><span>open covered calls</span><b></b></div><div class=hp-rail-row><span>share lots</span><b></b></div><div class=hp-rail-row><span>shares held</span><b></b></div></div><div class=hp-rail-block><div class=hp-rail-label>lots</div><button type=button class="btn-ghost hp-cash-edit">+ New lot</button></div></aside><div class=hp-list><div class=hp-toolbar-row><button type=button class=btn>+ Sell put</button><button type=button class=btn>+ Sell call</button><button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),uh=m("<div class=hp-hint>No recorded lots — assignments land here."),dh=m("<div class=empty-panel>No open positions — press “+ Sell put” to record one.");const ot=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),ht=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Jt=(t,e=0)=>`${(t*100).toFixed(e)}%`,fe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),sr=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(n,r-1,i+e).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function hs(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function hh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Vd(),r=n.firstChild,i=r.nextSibling;return w(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&Je(r,"width",s.e=a),o!==s.t&&Je(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function fh(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Hd(),s=i.firstChild,a=s.nextSibling;return s.$$input=o=>n(o.target.value),a.$$click=()=>t.onSave(Number(e())),w(()=>{var o;return a.disabled=!r()||((o=t.busy)==null?void 0:o.call(t))}),w(()=>s.value=e()),i})()}function gh(t){const[e,n]=O(!1),r=()=>t.cash==null;return(()=>{var i=jd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling,l=o.firstChild,c=l.nextSibling;return c.nextSibling,u(a,(()=>{var d=q(()=>t.free==null);return()=>d()?"—":ot(t.free)})()),u(o,(()=>{var d=q(()=>t.cash==null);return()=>d()?"—":ot(t.cash)})(),l),u(o,()=>ot(t.reserved),c),u(i,f(C,{get when(){return!e()},get fallback(){return f(fh,{get cash(){return t.cash},get busy(){return t.busy},onDone:()=>n(!1),onSave:async d=>{await t.onSaveCash(d)&&n(!1)}})},get children(){var d=Wd();return d.$$click=()=>n(!0),u(d,()=>r()?"set cash":"edit cash"),d}}),null),i})()}function ph(t){const e=t.lot,n=()=>e.view;return(()=>{var r=zd(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,g=h.nextSibling;g.nextSibling;var _=d.nextSibling,b=c.nextSibling,I=b.firstChild;I.firstChild;var y=I.nextSibling,v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var A=q(()=>n().spot==null);return()=>A()?"—":ht(n().spot)})()),u(d,()=>ht(e.basis_per_share),g),u(d,()=>e.acquired,null),u(_,f(C,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${ot(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Jt(n().pl_pct,1)})`}})),u(I,()=>{var A;return hs((A=e.mark)==null?void 0:A.as_of)||"—"},null),u(y,()=>n().covered,S),u(y,()=>n().capacity,null),u(r,f(C,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:A=>f(vh,{get lot(){return A.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),w(()=>te(_,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function mh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=Jd(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,_=g.nextSibling,b=_.nextSibling,I=b.nextSibling,y=I.nextSibling,v=y.nextSibling;v.nextSibling;var S=a.nextSibling,A=S.nextSibling,T=A.firstChild;T.firstChild;var P=A.nextSibling,E=P.nextSibling,D=E.nextSibling,x=D.firstChild,M=x.firstChild,p=M.nextSibling,k=x.nextSibling,U=k.firstChild,J=U.nextSibling,Y=J.nextSibling,ce=k.nextSibling;ce.firstChild;var N=ce.nextSibling,$=N.firstChild,F=$.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(h,()=>e.p.expiry,_),u(h,()=>e.v.days_elapsed,I),u(h,()=>e.v.days_total,v),u(S,(()=>{var R=q(()=>e.v.pl_pct==null);return()=>R()?"—":`${e.v.pl_pct>=0?"+":""}${Jt(e.v.pl_pct,1)}`})()),u(A,f(hh,{get v(){return e.v}}),T),u(T,()=>Jt(e.v.target_pct),null),u(P,f(C,{get when(){return e.v.pace_met},get fallback(){return Yd()},get children(){return Gd()}}),null),u(P,f(C,{get when(){return q(()=>e.p.kind==="call")()&&n()},get children(){return qd()}}),null),E.$$click=()=>t.onClose(e),u(p,()=>ht(e.p.premium)),u(J,(()=>{var R=q(()=>e.p.mark==null);return()=>R()?"—":e.p.mark.mid.toFixed(2)})()),u(Y,(()=>{var R=q(()=>e.p.mark==null);return()=>R()?"unpriced":hs(e.p.mark.as_of)})()),u(ce,f(C,{get when(){var R;return((R=e.p.mark)==null?void 0:R.underlying_price)!=null},get fallback(){return Xd()},get children(){return[(()=>{var R=ir();return u(R,()=>e.p.mark.underlying_price.toFixed(2)),R})(),(()=>{var R=Kd();return u(R,(()=>{var V=q(()=>e.v.spot_pct_vs_strike==null);return()=>V()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Jt(e.v.spot_pct_vs_strike,1)} vs strike`})()),w(()=>te(R,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),R})()]}}),null),u(F,(()=>{var R=q(()=>e.v.pl_dollars==null);return()=>R()?"—":ht(e.v.pl_dollars)})()),u(i,f(C,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:R=>f(kh,Ns({d:R},()=>t.dialogActions))}),null),w(R=>{var V=!!e.v.pace_met,ne=e.p.kind,z=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",Re=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return V!==R.e&&s.classList.toggle("hp-row-met",R.e=V),ne!==R.t&&se(o,"data-kind",R.t=ne),z!==R.a&&te(S,R.a=z),Re!==R.o&&te(F,R.o=Re),R},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function _h(t){const[e,n]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:fe(),expiry:sr(fe(),7)}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&[e().strike,e().premium,e().contracts].every(s=>Number(s)>0)&&e().expiry>e().sold&&e().sold<=fe();return(()=>{var s=Qd(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling,E=P.firstChild,D=E.nextSibling,x=P.nextSibling,M=x.nextSibling;return s.addEventListener("submit",p=>{var k;p.preventDefault(),!(!i()||(k=t.busy)!=null&&k.call(t))&&t.onAdd({symbol:e().symbol.trim().toUpperCase(),strike:Number(e().strike),premium:Number(e().premium),contracts:Math.trunc(Number(e().contracts)),sold:e().sold,expiry:e().expiry})}),H(l,"input",r("symbol")),H(h,"input",r("strike")),H(b,"input",r("premium")),H(v,"input",r("contracts")),H(T,"input",r("sold")),H(D,"input",r("expiry")),H(M,"click",t.onDone),w(()=>{var p;return x.disabled=!i()||((p=t.busy)==null?void 0:p.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().strike),w(()=>b.value=e().premium),w(()=>v.value=e().contracts),w(()=>T.value=e().sold),w(()=>D.value=e().expiry),s})()}function bh(t){const[e,n]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:fe(),expiry:sr(fe(),7)}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&[e().strike,e().premium,e().contracts].every(s=>Number(s)>0)&&e().expiry>e().sold&&e().sold<=fe();return(()=>{var s=Zd(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling,E=P.firstChild,D=E.nextSibling,x=P.nextSibling,M=x.nextSibling;return s.addEventListener("submit",p=>{var k;p.preventDefault(),!(!i()||(k=t.busy)!=null&&k.call(t))&&t.onAdd({kind:"call",symbol:e().symbol.trim().toUpperCase(),strike:Number(e().strike),premium:Number(e().premium),contracts:Math.trunc(Number(e().contracts)),sold:e().sold,expiry:e().expiry})}),H(l,"input",r("symbol")),H(h,"input",r("strike")),H(b,"input",r("premium")),H(v,"input",r("contracts")),H(T,"input",r("sold")),H(D,"input",r("expiry")),H(M,"click",t.onDone),w(()=>{var p;return x.disabled=!i()||((p=t.busy)==null?void 0:p.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().strike),w(()=>b.value=e().premium),w(()=>v.value=e().contracts),w(()=>T.value=e().sold),w(()=>D.value=e().expiry),s})()}function yh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:fe()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=eh(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.nextSibling;return s.addEventListener("submit",T=>{var P;T.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),H(l,"input",r("symbol")),H(h,"input",r("shares")),H(b,"input",r("basis_per_share")),H(v,"input",r("acquired")),H(A,"click",t.onDone),w(()=>{var T;return S.disabled=!i()||((T=t.busy)==null?void 0:T.call(t))}),w(()=>l.value=e().symbol),w(()=>h.value=e().shares),w(()=>b.value=e().basis_per_share),w(()=>v.value=e().acquired),s})()}function vh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:sr(fe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>fe();return(()=>{var o=th(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,_=g.firstChild,b=_.nextSibling,I=g.nextSibling,y=I.firstChild,v=y.nextSibling,S=I.nextSibling,A=S.firstChild,T=A.nextSibling,P=S.nextSibling,E=P.firstChild,D=E.nextSibling,x=P.nextSibling,M=x.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",p=>{var k;p.preventDefault(),!(!a()||(k=t.busy)!=null&&k.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:fe(),expiry:r().expiry})}),H(b,"input",s("strike")),H(v,"input",s("premium")),H(T,"input",s("contracts")),H(D,"input",s("expiry")),H(M,"click",t.onDone),w(()=>{var p;return x.disabled=!a()||((p=t.busy)==null?void 0:p.call(t))}),w(()=>b.value=r().strike),w(()=>v.value=r().premium),w(()=>T.value=r().contracts),w(()=>D.value=r().expiry),o})()}function wh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=rh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,_=g.nextSibling,b=_.nextSibling;b.nextSibling;var I=d.nextSibling,y=I.firstChild,v=y.firstChild,S=y.nextSibling,A=S.firstChild,T=S.nextSibling,P=T.firstChild,E=I.nextSibling;E.firstChild;var D=E.nextSibling,x=D.firstChild,M=x.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),A.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(C,{get when(){return n()!=="expired"},get children(){var p=ds(),k=p.firstChild;return u(p,()=>n()==="assigned"?"share price at assignment":"close price/share",k),k.$$input=U=>s(U.target.value),w(()=>k.value=i()),p}}),E),u(E,f(C,{get when(){return a()!==null},fallback:"—",get children(){var p=ir();return u(p,()=>ht(a())),w(()=>te(p,a()>=0?"holdings-pos":"holdings-neg")),p}}),null),H(x,"click",t.onDone),M.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(C,{get when(){return n()==="assigned"},get children(){return nh()}}),null),w(()=>{var p;return M.disabled=((p=t.busy)==null?void 0:p.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>v.checked=n()==="bought-back"),w(()=>A.checked=n()==="expired"),w(()=>P.checked=n()==="assigned"),c})()}function Sh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=ih(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,g=h.firstChild,_=g.nextSibling,b=h.nextSibling,I=b.firstChild,y=I.nextSibling,v=b.nextSibling,S=v.firstChild,A=S.nextSibling,T=v.nextSibling,P=T.nextSibling;return o.addEventListener("submit",E=>{var D;E.preventDefault(),!(!i()||(D=t.busy)!=null&&D.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),H(d,"input",r("symbol")),H(_,"input",r("shares")),H(y,"input",r("basis_per_share")),H(A,"input",r("acquired")),H(P,"click",t.onDone),w(()=>{var E;return T.disabled=!i()||((E=t.busy)==null?void 0:E.call(t))}),w(()=>d.value=e().symbol),w(()=>_.value=e().shares),w(()=>y.value=e().basis_per_share),w(()=>A.value=e().acquired),s})()}function $h(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=ah(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,_=g.nextSibling,b=_.nextSibling;b.nextSibling;var I=d.nextSibling,y=I.firstChild,v=y.firstChild,S=y.nextSibling,A=S.firstChild,T=S.nextSibling,P=T.firstChild,E=I.nextSibling;E.firstChild;var D=E.nextSibling,x=D.firstChild,M=x.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),v.addEventListener("change",()=>r("bought-back")),A.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(C,{get when(){return n()!=="expired"},get children(){var p=ds(),k=p.firstChild;return u(p,()=>n()==="called-away"?"share price at call":"close price/share",k),k.$$input=U=>s(U.target.value),w(()=>k.value=i()),p}}),E),u(E,f(C,{get when(){return a()!==null},fallback:"—",get children(){var p=ir();return u(p,()=>ht(a())),w(()=>te(p,a()>=0?"holdings-pos":"holdings-neg")),p}}),null),H(x,"click",t.onDone),M.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(C,{get when(){return n()==="called-away"},get children(){var p=sh(),k=p.firstChild,U=k.nextSibling,J=U.nextSibling,Y=J.nextSibling;return Y.nextSibling,u(p,()=>e.symbol,U),u(p,()=>e.contracts*100,Y),p}}),null),w(()=>{var p;return M.disabled=((p=t.busy)==null?void 0:p.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),w(()=>v.checked=n()==="bought-back"),w(()=>A.checked=n()==="expired"),w(()=>P.checked=n()==="called-away"),c})()}function kh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Sh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(wh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f($h,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Eh(){const[t,e]=O(null),[n,r]=O(""),[i,s]=O(null),[a,o]=O(!1),l=p=>{r(p),setTimeout(()=>r(""),4e3)},c=async()=>{try{e(await qs())}catch(p){l(`Holdings API error: ${p.message}`)}};lt(c);const d=()=>{var p;return((p=t())==null?void 0:p.positions)??[]},h=()=>{var p;return((p=t())==null?void 0:p.calls)??[]},g=()=>{var p;return((p=t())==null?void 0:p.lots)??[]},_=()=>d().map(p=>({p:{...p,kind:"put"},v:p.view})),b=()=>h().map(p=>({p:{...p,kind:"call"},v:p.view})),I=p=>p.v.pl_pct==null?-1/0:p.v.pl_pct-p.v.target_pct,y=()=>[..._(),...b()].sort((p,k)=>I(k)-I(p)),v=(p,k)=>{var Y,ce;const U=i();return!U||U.type!==p?null:(((Y=U.pos)==null?void 0:Y.id)??((ce=U.lot)==null?void 0:ce.id))===k?U:null},S=async p=>{if(a())return null;o(!0);try{return await p()}catch(k){return l(k.message),null}finally{o(!1)}},A=async()=>{var U;const p=await S(()=>Ks());if(!p)return;const k=((U=p.refresh)==null?void 0:U.stale)??[];l(k.length?`Marks refreshed — ${k.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await c()},T=async(p,k)=>{await S(()=>hr(p))&&(l(k),s(null),await c())},P=async(p,k)=>{await S(()=>hr(k))&&(l(`Assigned — recorded ${k.shares} sh ${k.symbol} at $${k.basis_per_share.toFixed(2)} basis.`),s(null),await c())},E=async(p,k,U)=>{if(k==="assigned"){s({type:"put",pos:p,stage:"lot",prefill:{symbol:p.symbol,shares:p.contracts*100,basis_per_share:+(p.strike-p.premium).toFixed(2),acquired:fe()}});return}await S(()=>fr(p.id))&&(l(k==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),s(null),await c())},D=async(p,k,U)=>{if(k==="called-away"){const Y=await S(()=>Ys(p.id));if(!Y)return;l(Y.reduced?`Called away — ${p.symbol} lot reduced by ${p.contracts*100} sh.`:`Called away — call removed. ${Y.reason??""}`),s(null),await c();return}await S(()=>fr(p.id))&&(l(k==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),s(null),await c())},x=async p=>{const k=await S(()=>Js(p));return k?(e(U=>({...U??{},cash:k.cash,cash_reserved:k.cash_reserved,cash_free:k.cash_free})),l(`Cash set to ${ot(k.cash)} — ${ot(k.cash_free)} free.`),!0):!1},M={busy:a,onDone:()=>s(null),onConfirmPut:E,onConfirmCall:D,onAssign:P};return(()=>{var p=ch(),k=p.firstChild,U=k.firstChild,J=U.firstChild,Y=J.nextSibling,ce=Y.firstChild,N=ce.nextSibling,$=Y.nextSibling,F=$.firstChild,R=F.nextSibling,V=$.nextSibling,ne=V.firstChild,z=ne.nextSibling,Re=V.nextSibling,Mt=Re.firstChild,X=Mt.nextSibling,ue=U.nextSibling,Oe=ue.firstChild,ze=Oe.nextSibling,me=k.nextSibling,Ze=me.firstChild,ar=Ze.firstChild,or=ar.nextSibling,lr=or.nextSibling;return u(k,f(gh,{get cash(){var B;return((B=t())==null?void 0:B.cash)??null},get reserved(){var B;return((B=t())==null?void 0:B.cash_reserved)??0},get free(){var B;return((B=t())==null?void 0:B.cash_free)??null},busy:a,onSaveCash:x}),U),u(N,()=>d().length),u(R,()=>h().length),u(z,()=>g().length),u(X,()=>g().reduce((B,_t)=>B+_t.shares,0)),u(ue,f(C,{get when(){return g().length>0},get fallback(){return uh()},get children(){return f(ie,{get each(){return g()},children:B=>f(ph,{lot:B,dialogFor:v,busy:a,onDialogDone:()=>s(null),onSellCall:(_t,Ut)=>T(Ut,`Sold ${Ut.symbol} ${Ut.strike}C ×${Ut.contracts} — Refresh marks to price.`)})})}}),ze),ze.$$click=()=>s({type:"addLot"}),u(ue,f(C,{get when(){var B;return((B=i())==null?void 0:B.type)==="addLot"},keyed:!0,get children(){return f(yh,{busy:a,onDone:()=>s(null),onAdd:B=>T(B,`Recorded ${B.shares} sh ${B.symbol}.`)})}}),null),ar.$$click=()=>s({type:"addPut"}),or.$$click=()=>s({type:"addCall"}),lr.$$click=A,u(me,f(C,{get when(){return n()},get children(){var B=oh();return u(B,n),B}}),null),u(me,f(C,{get when(){var B;return((B=i())==null?void 0:B.type)==="addPut"},keyed:!0,get children(){return f(_h,{busy:a,onDone:()=>s(null),onAdd:B=>T(B,`Sold ${B.symbol} ${B.strike}P ×${B.contracts} — press Refresh marks to price it.`)})}}),null),u(me,f(C,{get when(){var B;return((B=i())==null?void 0:B.type)==="addCall"},keyed:!0,get children(){return f(bh,{busy:a,onDone:()=>s(null),onAdd:B=>T(B,`Sold ${B.symbol} ${B.strike}C ×${B.contracts} — Refresh marks to price.`)})}}),null),u(me,f(C,{get when(){return d().length+h().length>0},get fallback(){return dh()},get children(){return[lh(),f(ie,{get each(){return y()},children:B=>f(mh,{x:B,dialogFor:v,dialogActions:M,onClose:_t=>s({type:_t.p.kind,pos:_t.p})})})]}}),null),w(()=>lr.disabled=a()),p})()}pe(["input","click"]);async function Ih(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
+`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var Ch=m("<button type=button class=run-btn>"),Th=m("<span class=run-count>/"),Ah=m("<span class=run-bar><span class=fill>"),Ph=m("<li><span class=mark></span><span class=label>"),xh=m("<div class=toast-cached>Served from cache — last run <!> min old"),Rh=m('<div class="toast-cached warn">'),Oh=m("<div class=run-headline>"),Nh=m("<ul class=run-stages>"),Dh=m("<details class=run-errors><summary>details</summary><ul>"),Lh=m("<div class=run-warn>Closing this tab stops the run."),Mh=m("<div class=run-warn>Re-checking every 15 s…"),Uh=m("<div class=run-strip>"),Fh=m("<li> ");const fs=["quotes","metrics","chains_short","chains_medium"],gs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},Bh=15e3,ps=t=>t!==null&&Date.now()>=t;function Qr(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function Vh(t){const[e,n]=O("idle"),[r,i]=O(T()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,g]=O(null),[_,b]=O("");let I=null,y=null;const[v,S]=O(0);let A=null;Ke(()=>{const N=t();if(A&&(clearTimeout(A),A=null),(N==null?void 0:N.run_allowed)===!1){const $=cn(N.next_open_utc);$!==null&&(A=setTimeout(()=>S(F=>F+1),Math.max(0,$-Date.now())))}});function T(){return Object.fromEntries(fs.map(N=>[N,{status:"pending",error:null}]))}function P(){I&&clearInterval(I),I=null,y&&clearInterval(y),y=null}function E(){l(0),I=setInterval(()=>l(N=>N+1),1e3)}function D(N){switch(N.type){case"stage_started":i($=>({...$,[N.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:N.stage,done:N.done,total:N.total});break;case"stage_finished":i($=>({...$,[N.stage]:{status:N.ok?"ok":"failed",error:N.error??null}}));break;case"run_finished":d(N);break}}function x(){P();const N=c(),$=((N==null?void 0:N.stages)??[]).some(F=>F.name.startsWith("chains")&&["ok","partial"].includes(F.status));n(N&&($||N.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function M(N){let $=!1;return await Ih(N,F=>{D(F),F.type==="run_finished"&&($=!0)}),$?(x(),!0):!1}async function p(N){n("detached"),y=setInterval(async()=>{var $,F,R;try{const V=await li(),ne=((F=($=V==null?void 0:V.result)==null?void 0:$.run)==null?void 0:F.finished_at_utc)??null;if(ne&&ne!==N){i(k(V.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((R=V==null?void 0:V.run_state)==null?void 0:R.status)!=="running"&&(P(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},Bh)}function k(N){const $=T();for(const F of(N==null?void 0:N.stages)??[])$[F.name]&&($[F.name]={status:F.status,error:F.error});return $}async function U(){var R,V,ne;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(T()),g(null);const N=((ne=(V=(R=t())==null?void 0:R.result)==null?void 0:V.run)==null?void 0:ne.finished_at_utc)??null;n("running"),E();let $;try{$=await zs()}catch{P(),n("idle"),b("Run failed to start — network or server unreachable.");return}const F=$.headers.get("content-type")??"";if($.ok&&F.includes("application/json")){const z=await $.json().catch(()=>null);if(P(),n("idle"),(z==null?void 0:z.status)==="cached"){g(z.age_secs),setTimeout(()=>g(null),6e3);return}}if($.status===403&&F.includes("application/json")){const z=await $.json().catch(()=>null);P(),n("idle"),b(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if($.status===202){const z=await Gs();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await M(z)||await p(N);return}await p(N);return}if(F.includes("text/event-stream")){await M($)||await p(N);return}P(),n("idle"),b(`Unexpected /api/run response (${$.status}, ${F||"no type"}).`)}return Be(()=>{P(),A&&clearTimeout(A)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:_,triggerRun:U,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{v();const N=t();return(N==null?void 0:N.run_allowed)!==!1?!0:ps(cn(N==null?void 0:N.next_open_utc))},nextOpenUtc:()=>{var N;return((N=t())==null?void 0:N.next_open_utc)??null}}}function Hh(t){const e=()=>!t.run.runAllowed(),n=()=>os(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=Ch();return i.$$click=()=>t.run.triggerRun(),u(i,r),w(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&se(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function Wh(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Ph(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>gs[t.name]),u(i,f(C,{get when(){return r()!==null},get children(){return[(()=>{var o=Th(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Ah(),l=o.firstChild;return w(c=>Je(l,"width",`${r()}%`)),o})()]}}),null),w(()=>te(i,`run-stage ${e()}`)),i})()}function jh(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",q(()=>Qr(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",q(()=>Qr(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(C,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=Uh();return u(i,f(C,{get when(){return e.cachedToast()},get children(){var s=xh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(C,{get when(){return e.notice()},get children(){var s=Rh();return u(s,()=>e.notice()),s}}),null),u(i,f(C,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Oh();return u(s,r),s})(),(()=>{var s=Nh();return u(s,()=>fs.map(a=>f(Wh,{name:a,run:e}))),s})(),f(C,{get when(){return q(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Dh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=Fh(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>gs[l.name]??l.name,null),u(c,(()=>{var h=q(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(C,{get when(){return q(()=>e.phase()==="running")()&&!n()},get children(){return Lh()}}),null),u(i,f(C,{get when(){return e.phase()==="detached"},get children(){return Mh()}}),null),i}})}pe(["click"]);var ms=m("<b>"),zh=m("<span>Market closed · last run <b></b> ago"),Gh=m("<div class=cache-line><span></span><span class=pill>run: "),qh=m("<span>Cached · <b></b> left"),Kh=m("<span>Stale · last run <b></b> ago"),Jh=m("<nav class=tabs role=tablist aria-label=timeframes>"),Yh=m("<button type=button role=tab class=tab>"),Xh=m('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Qh=m("<div class=pop-backdrop>"),Zh=m("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),ef=m("<div class=error-banner>API error: "),tf=m("<div class=shell><header><div class=user-box></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),nf=m("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function rf(){const[t,e]=O($u()),n=r=>{e(r),ku(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(vt)}}function Zr(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function sf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function ei(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function On(t){return f(C,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=ms();return u(e,()=>t.at()),e})()]}})}function af(t){const[e,n]=O(0);lt(()=>{const _=setInterval(()=>n(b=>b+1),3e4);Be(()=>clearInterval(_))});let r=Date.now(),i=0;Ke(St(()=>t.envelope,_=>{r=Date.now(),i=(_==null?void 0:_.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const _=Math.max(0,(t.envelope.cache_secs??0)-s());return _>=60?`${Math.floor(_/60)}m`:`${_}s`},c=()=>{var _,b;return Lu((b=(_=t.envelope.result)==null?void 0:_.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const _=t.envelope.next_open_utc,b=cn(_);if(!(b===null||ps(b)))return os(_)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var _=Gh(),b=_.firstChild,I=b.nextSibling;return I.firstChild,u(_,f(C,{get when(){return q(()=>!!o())()&&g()},get fallback(){return f(C,{get when(){return a()==="fresh"},get fallback(){return f(C,{get when(){return a()==="stale"},get children(){var y=Kh(),v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(S,()=>ei(s())),u(y,f(On,{at:c}),null),y}})},get children(){var y=qh(),v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(S,l),u(y,f(On,{at:c}),null),y}})},get children(){var y=zh(),v=y.firstChild,S=v.nextSibling;return S.nextSibling,u(S,()=>ei(s())),u(y,f(On,{at:c}),null),u(y,f(C,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var A=ms();return u(A,d),A})()]}}),null),y}}),b),u(b,(()=>{var y=q(()=>h()==="closed");return()=>y()?"market closed":a()})()),u(I,()=>{var y;return((y=t.envelope.run_state)==null?void 0:y.status)??"idle"},null),w(()=>te(b,"pill "+h())),_})()}function ti(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=Jh();return u(n,()=>e.map(r=>(()=>{var i=Yh();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=q(()=>!r.holdings);return()=>s()&&` (${wt(sf(t.result,r.id))})`})(),null),w(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&se(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function of(){const[t,e]=O(void 0),[n,{refetch:r}]=ks(t,v=>v?li():void 0);lt(()=>{if(!dt){e(null);return}const v=xl(tt(),e);Be(v)});const[i,s]=O(!1);Ke(St(t,v=>{s(!1),!(!v||!dt)&&Vs().then(S=>s(S.status===403)).catch(()=>{})})),lt(()=>{const v=()=>r();window.addEventListener("webapp:refresh-latest",v),Be(()=>window.removeEventListener("webapp:refresh-latest",v))});const a=()=>{var v,S;return((v=t())==null?void 0:v.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=rf(),[g,_]=O("short"),b=()=>g()==="holdings",I=vu(),y=Vh(()=>n());return f(C,{get when(){return t()},get fallback(){return f(iu,{})},get children(){return[f(C,{get when(){return!i()},get fallback(){return f(ru,{get email(){return a()},onSignOut:()=>zr()})},get children(){var v=tf(),S=v.firstChild,A=S.firstChild,T=A.nextSibling,P=T.nextSibling;return u(A,f(C,{get when(){return t()},get children(){return[(()=>{var E=Xh(),D=E.firstChild,x=D.nextSibling;return E.$$click=()=>l(!o()),u(x,a),w(()=>se(E,"aria-expanded",o())),E})(),f(C,{get when(){return o()},get children(){return[(()=>{var E=Qh();return E.$$click=()=>l(!1),E})(),(()=>{var E=Zh(),D=E.firstChild,x=D.nextSibling,M=x.nextSibling,p=M.nextSibling;return u(x,a),M.$$click=()=>{l(!1),d(!0)},p.$$click=()=>{l(!1),zr()},E})()]}})]}})),u(S,f(C,{get when(){return q(()=>!n.loading)()&&!n.error},get children(){return f(af,{get envelope(){return n()}})}}),P),u(P,f(Hh,{run:y})),u(v,f(C,{get when(){return n.error},get children(){var E=ef();return E.firstChild,u(E,()=>n.error.message,null),E}}),null),u(v,f(jh,{run:y}),null),u(v,f(C,{get when(){return b()},get children(){return[f(ti,{result:()=>{var E;return(E=n())==null?void 0:E.result},tab:g,onTab:_}),f(Eh,{})]}}),null),u(v,f(C,{get when(){return!b()},get children(){return f(C,{get when(){var E;return q(()=>!n.loading)()&&((E=n())==null?void 0:E.result)},get fallback(){return f(C,{get when(){return!n.loading},get children(){return nf()}})},children:E=>{const D=()=>E();return[f(Su,{scoring:I}),f(ti,{result:D,tab:g,onTab:_}),f(Xr,{id:"short",active:()=>g()==="short",get tf(){var x;return(x=D().timeframes)==null?void 0:x.short},get stageError(){return Zr(D(),"chains_short")},get stages(){return D().stages},get thresholds(){return D().thresholds},columns:h,scoring:I}),f(Xr,{id:"medium",active:()=>g()==="medium",get tf(){var x;return(x=D().timeframes)==null?void 0:x.medium},get stageError(){return Zr(D(),"chains_medium")},get stages(){return D().stages},get thresholds(){return D().thresholds},columns:h,scoring:I})]}})}}),null),v}}),f(C,{get when(){return c()},get children(){return f(uu,{onClose:()=>d(!1)})}})]}})}pe(["click"]);Ms(()=>f(of,{}),document.getElementById("root"));
diff --git a/crates/webapp/frontend/holdings-panel-proto.html b/crates/webapp/frontend/holdings-panel-proto.html
new file mode 100644
index 0000000..098aeb0
--- /dev/null
+++ b/crates/webapp/frontend/holdings-panel-proto.html
@@ -0,0 +1,14 @@
+<!doctype html>
+<html lang="en">
+  <head>
+    <meta charset="utf-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1" />
+    <link rel="icon" href="/favicon-32.png" sizes="32x32" />
+    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
+    <title>Holdings panel · PROTOTYPE</title>
+  </head>
+  <body>
+    <div id="root"></div>
+    <script type="module" src="/src/prototypes/holdings-panel-proto-entry.jsx"></script>
+  </body>
+</html>
diff --git a/crates/webapp/frontend/package.json b/crates/webapp/frontend/package.json
index c2a1edd..b2f5ac7 100644
--- a/crates/webapp/frontend/package.json
+++ b/crates/webapp/frontend/package.json
@@ -5,6 +5,7 @@
   "type": "module",
   "scripts": {
     "dev": "vite",
+    "proto": "vite --port 5175 --strictPort",
     "dev:preview": "vite --config vite.preview.config.mjs",
     "build": "vite build",
     "preview": "vite preview",
diff --git a/crates/webapp/frontend/src/api.js b/crates/webapp/frontend/src/api.js
index 366414f..504741b 100644
--- a/crates/webapp/frontend/src/api.js
+++ b/crates/webapp/frontend/src/api.js
@@ -137,3 +137,31 @@ export async function refreshHoldings() {
   if (!res.ok) throw new Error(v?.error ?? `POST /api/holdings/refresh -> ${res.status}`);
   return v;
 }
+
+/// Wheel holdings (2026-09-17-wheel-holdings): set the manual cash balance.
+/// The response carries the server-derived reserved/free — callers re-render
+/// the strip from it, never from client math.
+export async function patchCash(cash) {
+  const res = await authorizedFetch("/api/holdings/cash", {
+    method: "PATCH",
+    headers: { "Content-Type": "application/json" },
+    body: JSON.stringify({ cash }),
+  });
+  const v = await res.json().catch(() => null);
+  if (!res.ok) throw new Error(v?.error ?? `PATCH /api/holdings/cash -> ${res.status}`);
+  return v;
+}
+
+/// The call was assigned: one server rewrite removes the call and FIFO-
+/// reduces the covering lot. `reduced: false` + `reason` means no single
+/// lot covered it — the call is gone regardless (a 200 outcome, not an error).
+export async function calledAway(callId) {
+  const res = await authorizedFetch("/api/holdings/called-away", {
+    method: "POST",
+    headers: { "Content-Type": "application/json" },
+    body: JSON.stringify({ call_id: callId }),
+  });
+  const v = await res.json().catch(() => null);
+  if (!res.ok) throw new Error(v?.error ?? `POST /api/holdings/called-away -> ${res.status}`);
+  return v;
+}
diff --git a/crates/webapp/frontend/src/components/HoldingsPanel.jsx b/crates/webapp/frontend/src/components/HoldingsPanel.jsx
index 063edda..bd35bf8 100644
--- a/crates/webapp/frontend/src/components/HoldingsPanel.jsx
+++ b/crates/webapp/frontend/src/components/HoldingsPanel.jsx
@@ -1,170 +1,742 @@
-/* Holdings panel — the currently-holding puts ledger (2026-09-11-holdings),
-   variant B ("urgency cards") distilled from the approved prototype.
-   The server owns every number: positions arrive with their mark and the
-   computed pace view (crates/core/src/holdings.rs); this component renders
-   them and drives the four /api/holdings routes via the api.js seam.
-   Only the outcome dialog's realized-P&L preview is computed here — it needs
-   the close price the user is typing, which the server has not seen. */
+/* Holdings panel — the full wheel ledger (2026-09-17-wheel-holdings),
+   variant C ("wheel rail") from the approved prototype. A sticky rail
+   (cash strip → PATCH, wheel stats, lot rows) beside one merged urgency
+   list of puts and calls, with every dialog anchored inline under the
+   position that opened it.
+   The server owns every number: entries arrive with their mark and the
+   computed view (crates/core/src/holdings.rs); lots carry value/P&L/
+   capacity/covered; the cash strip renders cash/reserved/free verbatim
+   from GET — and after an edit, from the PATCH response. The only
+   client-side computations are the form prefills the design pins
+   (assignment: shares = contracts×100, basis = strike − premium; sell
+   call: contracts = floor(shares/100)) and the close dialog's realized-
+   P&L preview, which needs the price the user is typing. */
 
-import { For, Show, createResource, createSignal } from "solid-js";
+import { For, Show, createSignal, onMount } from "solid-js";
 
-import { addHolding, deleteHolding, getHoldings, refreshHoldings } from "../api";
+import {
+  addHolding,
+  calledAway,
+  deleteHolding,
+  getHoldings,
+  patchCash,
+  refreshHoldings,
+} from "../api";
 
-const money = (v) => (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
+const money = (v) =>
+  (v < 0 ? "-$" : "$") +
+  Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 0 });
+const money2 = (v) => (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
 const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;
 
+/* ET calendar date, as the production holdings math uses — never
+   toISOString for local dates (the GMT+8 bug caught in the prototype). */
+const todayET = () =>
+  new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
+const plusDays = (iso, n) => {
+  const [y, m, d] = iso.split("-").map(Number);
+  return new Date(y, m - 1, d + n).toLocaleDateString("en-CA", {
+    timeZone: "America/New_York",
+  });
+};
+
 function ageText(rfc3339) {
   if (!rfc3339) return "";
   const secs = Math.max(0, (Date.now() - new Date(rfc3339).getTime()) / 1000);
   const m = Math.floor(secs / 60);
   if (m < 1) return "just now";
   if (m < 60) return `${m} min ago`;
-  const h = Math.floor(m / 60);
-  return `about ${h} h ago`;
+  return `about ${Math.floor(m / 60)} h ago`;
+}
+
+function MiniBar(props) {
+  const fill = () =>
+    props.v.pl_pct == null ? 0 : Math.max(0, Math.min(100, props.v.pl_pct * 100));
+  return (
+    <div class="holdings-bar">
+      <div class="holdings-bar-fill" style={{ width: `${fill()}%` }} />
+      <div
+        class="holdings-bar-mark"
+        style={{ left: `${Math.min(100, props.v.target_pct * 100)}%` }}
+      />
+    </div>
+  );
+}
+
+/* ── rail ──────────────────────────────────────────────────────── */
+
+function CashEditor(props) {
+  const [val, setVal] = createSignal(
+    props.cash == null ? "" : String(props.cash)
+  );
+  const valid = () => Number.isFinite(Number(val())) && Number(val()) >= 0;
+  return (
+    <span class="hp-cash-editor">
+      <input
+        inputmode="decimal"
+        placeholder="150000"
+        value={val()}
+        onInput={(e) => setVal(e.target.value)}
+      />
+      <button
+        type="button"
+        class="btn btn-primary"
+        disabled={!valid() || props.busy?.()}
+        onClick={() => props.onSave(Number(val()))}
+      >
+        save
+      </button>
+    </span>
+  );
+}
+
+function CashStrip(props) {
+  const [editing, setEditing] = createSignal(false);
+  const neverSet = () => props.cash == null;
+  return (
+    <div class="hp-rail-block">
+      <div class="hp-rail-label">free to sell puts</div>
+      <div class="hp-rail-big">
+        {props.free == null ? "—" : money(props.free)}
+      </div>
+      <div class="hp-rail-sub">
+        {props.cash == null ? "—" : money(props.cash)} cash −{" "}
+        {money(props.reserved)} reserved
+      </div>
+      <Show
+        when={!editing()}
+        fallback={
+          <CashEditor
+            cash={props.cash}
+            busy={props.busy}
+            onDone={() => setEditing(false)}
+            onSave={async (n) => {
+              const res = await props.onSaveCash(n);
+              if (res) setEditing(false);
+            }}
+          />
+        }
+      >
+        <button
+          type="button"
+          class="btn-ghost hp-cash-edit"
+          onClick={() => setEditing(true)}
+        >
+          {neverSet() ? "set cash" : "edit cash"}
+        </button>
+      </Show>
+    </div>
+  );
 }
 
-function AddForm(props) {
-  // Local-date ISO (never toISOString: it shifts a day for UTC-positive
-  // offsets — the GMT+8 bug caught in the prototype).
-  const isoLocal = (d) =>
-    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
-      d.getDate()
-    ).padStart(2, "0")}`;
-  const today = () => isoLocal(new Date());
-  const in7 = () => isoLocal(new Date(Date.now() + 7 * 86_400_000));
-  const [open, setOpen] = createSignal(false);
+function LotRailRow(props) {
+  const l = props.lot;
+  const v = () => l.view;
+  return (
+    <div class="hp-slot">
+      <div class="hp-lot-row">
+        <div class="hp-lot-row-top">
+          <span>
+            {l.shares} sh {l.symbol}
+          </span>
+          <b>{v().spot == null ? "—" : money2(v().spot)}</b>
+        </div>
+        <div class="hp-lot-row-sub">
+          <span>
+            bought {money2(l.basis_per_share)} · {l.acquired}
+          </span>
+          <b class={(v().pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
+            <Show when={v().pl_dollars != null} fallback="—">
+              {`${money(v().pl_dollars)} (${(v().pl_pct ?? 0) >= 0 ? "+" : ""}${pct(v().pl_pct, 1)})`}
+            </Show>
+          </b>
+        </div>
+        <div class="hp-lot-row-meta">
+          <i>last {ageText(l.mark?.as_of) || "—"}</i>
+          <i>
+            covered {v().covered}/{v().capacity}
+          </i>
+        </div>
+      </div>
+      <Show when={v().capacity > 0}>
+        <button
+          type="button"
+          class="btn-ghost holdings-close-btn"
+          onClick={() => props.onSellDialog(l)}
+        >
+          sell call…
+        </button>
+      </Show>
+      <Show when={props.dialogFor("sellCall", l.id)} keyed>
+        {(d) => <SellCallForm lot={d.lot} onDone={props.onDialogDone} onSell={props.onSellCall} />}
+      </Show>
+    </div>
+  );
+}
+
+/* ── list rows ─────────────────────────────────────────────────── */
+
+function OptionRow(props) {
+  const x = props.x; // { p, v }
+  const itm = () => x.v.spot_pct_vs_strike != null && x.v.spot_pct_vs_strike > 0;
+  const spotDanger = () =>
+    x.p.kind === "call" ? x.v.spot_pct_vs_strike > 0 : x.v.spot_pct_vs_strike < 0;
+  return (
+    <div class="hp-slot">
+      <div class="hp-list-row" classList={{ "hp-row-met": x.v.pace_met }}>
+        <span class="hp-list-pos">
+          <span class="hp-kind" data-kind={x.p.kind}>
+            {x.p.kind.toUpperCase()}
+          </span>
+          <b>
+            {x.p.symbol} {x.p.strike}
+            {x.p.kind === "put" ? "P" : "C"} ×{x.p.contracts}
+          </b>
+          <i>
+            exp {x.p.expiry} · {x.v.days_elapsed}/{x.v.days_total} wd
+          </i>
+        </span>
+        <span class={x.v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
+          {x.v.pl_pct == null ? "—" : `${x.v.pl_pct >= 0 ? "+" : ""}${pct(x.v.pl_pct, 1)}`}
+        </span>
+        <span class="hp-list-pace">
+          <MiniBar v={x.v} />
+          <i>target {pct(x.v.target_pct)}</i>
+        </span>
+        <span class="hp-list-status">
+          <Show when={x.v.pace_met} fallback={<span class="chip normal">holding</span>}>
+            <span class="chip high">buy back?</span>
+          </Show>
+          <Show when={x.p.kind === "call" && itm()}>
+            <span class="chip high">ITM — called away?</span>
+          </Show>
+        </span>
+        <button
+          type="button"
+          class="btn-ghost holdings-close-btn"
+          onClick={() => props.onClose(x)}
+        >
+          close…
+        </button>
+        {/* Full stats line — sold at / now mid + age / spot vs strike
+            (danger-colored in the kind's ITM direction) / close captures. */}
+        <div class="holdings-card-stats hp-list-stats">
+          <div>
+            <span>sold at</span>
+            <b>{money2(x.p.premium)}</b>
+          </div>
+          <div>
+            <span>now (mid)</span>
+            <b>{x.p.mark == null ? "—" : x.p.mark.mid.toFixed(2)}</b>
+            <i>{x.p.mark == null ? "unpriced" : ageText(x.p.mark.as_of)}</i>
+          </div>
+          <div>
+            <span>spot</span>
+            <Show when={x.p.mark?.underlying_price != null} fallback={<b>—</b>}>
+              <b>{x.p.mark.underlying_price.toFixed(2)}</b>
+              <i class={spotDanger() && x.v.spot_pct_vs_strike != null ? "holdings-neg" : "holdings-pos"}>
+                {x.v.spot_pct_vs_strike == null
+                  ? ""
+                  : `${x.v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(x.v.spot_pct_vs_strike, 1)} vs strike`}
+              </i>
+            </Show>
+          </div>
+          <div>
+            <span>close captures</span>
+            <b class={(x.v.pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
+              {x.v.pl_dollars == null ? "—" : money2(x.v.pl_dollars)}
+            </b>
+          </div>
+        </div>
+      </div>
+      <Show when={props.dialogFor(x.p.kind, x.p.id)} keyed>
+        {(d) => <ClosePanel d={d} {...props.dialogActions} />}
+      </Show>
+    </div>
+  );
+}
+
+/* ── forms ─────────────────────────────────────────────────────── */
+
+function AddPutForm(props) {
   const [f, setF] = createSignal({
     symbol: "",
     strike: "",
     premium: "",
     contracts: "1",
-    sold: today(),
-    expiry: in7(),
+    sold: todayET(),
+    expiry: plusDays(todayET(), 7),
   });
   const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
-  const submit = async (e) => {
-    e.preventDefault();
-    if (props.busy?.()) return;
-    if (!f().symbol) return;
-    if (![f().strike, f().premium, f().contracts].every((x) => Number(x) > 0)) {
-      return;
-    }
-    await props.onAdd({
-      symbol: f().symbol,
-      strike: Number(f().strike),
-      premium: Number(f().premium),
-      contracts: Number(f().contracts),
-      sold: f().sold,
-      expiry: f().expiry,
-    });
-    setF({ ...f(), symbol: "", strike: "", premium: "" });
-    setOpen(false);
-  };
+  const valid = () =>
+    f().symbol.trim() &&
+    [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
+    f().expiry > f().sold &&
+    f().sold <= todayET();
   return (
-    <Show
-      when={open()}
-      fallback={
-        <button type="button" class="btn" disabled={props.busy?.()} onClick={() => setOpen(true)}>
-          + New position
-        </button>
-      }
+    <form
+      class="holdings-add"
+      onSubmit={(e) => {
+        e.preventDefault();
+        if (!valid() || props.busy?.()) return;
+        props.onAdd({
+          symbol: f().symbol.trim().toUpperCase(),
+          strike: Number(f().strike),
+          premium: Number(f().premium),
+          contracts: Math.trunc(Number(f().contracts)),
+          sold: f().sold,
+          expiry: f().expiry,
+        });
+      }}
     >
-      <form class="holdings-add" onSubmit={submit}>
-        <label>
-          symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
-        </label>
+      <label>
+        symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
+      </label>
+      <label>
+        strike
+        <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
+      </label>
+      <label>
+        premium
+        <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
+      </label>
+      <label>
+        contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
+      </label>
+      <label>
+        sold <input type="date" value={f().sold} onInput={set("sold")} />
+      </label>
+      <label>
+        expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
+      </label>
+      <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
+        Sell put
+      </button>
+      <button type="button" class="btn" onClick={props.onDone}>
+        Cancel
+      </button>
+    </form>
+  );
+}
+
+/* Free-field covered call — coverage is display-only (no enforcement). */
+function AddCallForm(props) {
+  const [f, setF] = createSignal({
+    symbol: "",
+    strike: "",
+    premium: "",
+    contracts: "1",
+    sold: todayET(),
+    expiry: plusDays(todayET(), 7),
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() &&
+    [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
+    f().expiry > f().sold &&
+    f().sold <= todayET();
+  return (
+    <form
+      class="holdings-add"
+      onSubmit={(e) => {
+        e.preventDefault();
+        if (!valid() || props.busy?.()) return;
+        props.onAdd({
+          kind: "call",
+          symbol: f().symbol.trim().toUpperCase(),
+          strike: Number(f().strike),
+          premium: Number(f().premium),
+          contracts: Math.trunc(Number(f().contracts)),
+          sold: f().sold,
+          expiry: f().expiry,
+        });
+      }}
+    >
+      <label>
+        symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
+      </label>
+      <label>
+        strike
+        <input inputmode="decimal" placeholder="e.g. 355.00" value={f().strike} onInput={set("strike")} />
+      </label>
+      <label>
+        premium
+        <input inputmode="decimal" placeholder="e.g. 1.80" value={f().premium} onInput={set("premium")} />
+      </label>
+      <label>
+        contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
+      </label>
+      <label>
+        sold <input type="date" value={f().sold} onInput={set("sold")} />
+      </label>
+      <label>
+        expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
+      </label>
+      <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
+        Sell call
+      </button>
+      <button type="button" class="btn" onClick={props.onDone}>
+        Cancel
+      </button>
+      <div class="hp-dialog-note">
+        coverage is shown per lot — recorded even if it exceeds held shares
+      </div>
+    </form>
+  );
+}
+
+function AddLotForm(props) {
+  const [f, setF] = createSignal({
+    symbol: "",
+    shares: "",
+    basis_per_share: "",
+    acquired: todayET(),
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
+  return (
+    <form
+      class="holdings-add"
+      onSubmit={(e) => {
+        e.preventDefault();
+        if (!valid() || props.busy?.()) return;
+        props.onAdd({
+          kind: "lot",
+          symbol: f().symbol.trim().toUpperCase(),
+          shares: Math.trunc(Number(f().shares)),
+          basis_per_share: Number(f().basis_per_share),
+          acquired: f().acquired,
+        });
+      }}
+    >
+      <label>
+        symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
+      </label>
+      <label>
+        shares <input inputmode="numeric" placeholder="e.g. 100" value={f().shares} onInput={set("shares")} />
+      </label>
+      <label>
+        basis / share
+        <input inputmode="decimal" placeholder="e.g. 349.00" value={f().basis_per_share} onInput={set("basis_per_share")} />
+      </label>
+      <label>
+        acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
+      </label>
+      <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
+        Record lot
+      </button>
+      <button type="button" class="btn" onClick={props.onDone}>
+        Cancel
+      </button>
+    </form>
+  );
+}
+
+/* The lot-anchored sell: contracts prefilled floor(shares/100), editable
+   down (the server's capacity is the bound; coverage is display-only). */
+function SellCallForm(props) {
+  const lot = props.lot;
+  const capacity = () => Math.floor(lot.shares / 100);
+  const [f, setF] = createSignal({
+    strike: "",
+    premium: "",
+    contracts: String(capacity()),
+    expiry: plusDays(todayET(), 7),
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    Number(f().strike) > 0 &&
+    Number(f().premium) > 0 &&
+    Number(f().contracts) >= 1 &&
+    Number(f().contracts) <= capacity() &&
+    f().expiry > todayET();
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">
+        Sell covered call · {lot.shares} sh {lot.symbol}
+      </div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid() || props.busy?.()) return;
+          props.onSell(lot, {
+            kind: "call",
+            symbol: lot.symbol,
+            strike: Number(f().strike),
+            premium: Number(f().premium),
+            contracts: Math.trunc(Number(f().contracts)),
+            sold: todayET(),
+            expiry: f().expiry,
+          });
+        }}
+      >
         <label>
           strike
-          {/* text + inputmode, not type=number: number inputs sanitize the
-              in-progress "." on every keystroke, so decimals can't be typed. */}
-          <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
+          <input inputmode="decimal" placeholder="e.g. 360.00" value={f().strike} onInput={set("strike")} />
         </label>
         <label>
           premium
-          <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
+          <input inputmode="decimal" placeholder="e.g. 1.20" value={f().premium} onInput={set("premium")} />
         </label>
         <label>
           contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
         </label>
-        <label>
-          sold <input type="date" value={f().sold} onInput={set("sold")} />
-        </label>
         <label>
           expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
         </label>
-        <button type="submit" class="btn btn-primary" disabled={props.busy?.()}>Add</button>
-        <button type="button" class="btn" onClick={() => setOpen(false)}>Cancel</button>
+        <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
+          Sell call
+        </button>
+        <button type="button" class="btn" onClick={props.onDone}>
+          Cancel
+        </button>
       </form>
-    </Show>
+    </div>
   );
 }
 
-function OutcomeDialog(props) {
+/* ── close panels (inline, under the position that opened them) ── */
+
+function PutCloseDialog(props) {
+  const pos = props.d.pos;
   const [outcome, setOutcome] = createSignal("bought-back");
-  const [price, setPrice] = createSignal(props.position.mark?.mid?.toFixed(2) ?? "");
+  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
   // Realized P&L preview — the one client-side computation (see file header).
   const realized = () => {
-    const p = props.position;
+    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
     const close = Number(price());
-    if (outcome() === "expired") return p.premium * 100 * p.contracts;
     if (!Number.isFinite(close)) return null;
-    if (outcome() === "assigned") {
-      return (p.strike - close + p.premium) * 100 * p.contracts;
-    }
-    return (p.premium - close) * 100 * p.contracts;
+    if (outcome() === "assigned")
+      return (pos.strike - close + pos.premium) * 100 * pos.contracts;
+    return (pos.premium - close) * 100 * pos.contracts;
   };
   return (
     <div class="holdings-outcome">
       <div class="holdings-outcome-head">
-        Close {props.position.symbol} {props.position.strike} ×{props.position.contracts}
+        Close {pos.symbol} {pos.strike}P ×{pos.contracts}
       </div>
       <div class="holdings-outcome-row">
         <label>
-          <input type="radio" checked={outcome() === "bought-back"} onChange={() => setOutcome("bought-back")} />
+          <input
+            type="radio"
+            checked={outcome() === "bought-back"}
+            onChange={() => setOutcome("bought-back")}
+          />
           bought back
         </label>
         <label>
-          <input type="radio" checked={outcome() === "expired"} onChange={() => setOutcome("expired")} />
+          <input
+            type="radio"
+            checked={outcome() === "expired"}
+            onChange={() => setOutcome("expired")}
+          />
           expired worthless
         </label>
         <label>
-          <input type="radio" checked={outcome() === "assigned"} onChange={() => setOutcome("assigned")} />
+          <input
+            type="radio"
+            checked={outcome() === "assigned"}
+            onChange={() => setOutcome("assigned")}
+          />
           assigned
         </label>
       </div>
       <Show when={outcome() !== "expired"}>
         <label class="holdings-outcome-price">
-          close price/share
+          {outcome() === "assigned" ? "share price at assignment" : "close price/share"}
           <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
         </label>
       </Show>
       <div class="holdings-outcome-realized">
         realized:{" "}
         <Show when={realized() !== null} fallback="—">
-          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(realized())}</b>
+          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>
+            {money2(realized())}
+          </b>
         </Show>
       </div>
       <div class="holdings-outcome-actions">
-        <button type="button" class="btn" onClick={props.onClose}>Cancel</button>
+        <button type="button" class="btn" onClick={props.onDone}>
+          Cancel
+        </button>
         <button
           type="button"
           class="btn btn-primary"
-          disabled={props.busy?.()}
-          onClick={() => props.onConfirm(outcome(), outcome() === "expired" ? null : Number(price()))}
+          disabled={props.busy?.() || (outcome() !== "expired" && !Number.isFinite(Number(price())))}
+          onClick={() =>
+            props.onConfirmPut(pos, outcome(), outcome() === "expired" ? null : Number(price()))
+          }
         >
           Confirm
         </button>
       </div>
+      <Show when={outcome() === "assigned"}>
+        <div class="hp-dialog-note">
+          confirming creates a share lot prefilled at basis = strike − premium
+        </div>
+      </Show>
     </div>
   );
 }
 
+/* Stage 2 of the assigned flow: the prefilled lot form. Cancelling here
+   (or anywhere before it) sends no request — the put stays. */
+function AssignedLotForm(props) {
+  const [f, setF] = createSignal({ ...props.d.prefill });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">Record assigned shares</div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid() || props.busy?.()) return;
+          props.onAssign(
+            props.d.pos,
+            {
+              kind: "lot",
+              symbol: f().symbol.trim().toUpperCase(),
+              shares: Math.trunc(Number(f().shares)),
+              basis_per_share: Number(f().basis_per_share),
+              acquired: f().acquired,
+              assigned_from: props.d.pos.id,
+            },
+          );
+        }}
+      >
+        <label>
+          symbol <input value={f().symbol} onInput={set("symbol")} />
+        </label>
+        <label>
+          shares <input inputmode="numeric" value={f().shares} onInput={set("shares")} />
+        </label>
+        <label>
+          basis / share
+          <input inputmode="decimal" value={f().basis_per_share} onInput={set("basis_per_share")} />
+        </label>
+        <label>
+          acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
+        </label>
+        <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
+          Record lot
+        </button>
+        <button type="button" class="btn" onClick={props.onDone}>
+          Cancel
+        </button>
+      </form>
+    </div>
+  );
+}
+
+function CallCloseDialog(props) {
+  const pos = props.d.pos;
+  const [outcome, setOutcome] = createSignal("bought-back");
+  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
+  const realized = () => {
+    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
+    const close = Number(price());
+    if (!Number.isFinite(close)) return null;
+    if (outcome() === "called-away")
+      return (pos.strike - close + pos.premium) * 100 * pos.contracts;
+    return (pos.premium - close) * 100 * pos.contracts;
+  };
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">
+        Close {pos.symbol} {pos.strike}C ×{pos.contracts}
+      </div>
+      <div class="holdings-outcome-row">
+        <label>
+          <input
+            type="radio"
+            checked={outcome() === "bought-back"}
+            onChange={() => setOutcome("bought-back")}
+          />
+          bought back
+        </label>
+        <label>
+          <input
+            type="radio"
+            checked={outcome() === "expired"}
+            onChange={() => setOutcome("expired")}
+          />
+          expired worthless
+        </label>
+        <label>
+          <input
+            type="radio"
+            checked={outcome() === "called-away"}
+            onChange={() => setOutcome("called-away")}
+          />
+          called away
+        </label>
+      </div>
+      <Show when={outcome() !== "expired"}>
+        <label class="holdings-outcome-price">
+          {outcome() === "called-away" ? "share price at call" : "close price/share"}
+          <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
+        </label>
+      </Show>
+      <div class="holdings-outcome-realized">
+        realized:{" "}
+        <Show when={realized() !== null} fallback="—">
+          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>
+            {money2(realized())}
+          </b>
+        </Show>
+      </div>
+      <div class="holdings-outcome-actions">
+        <button type="button" class="btn" onClick={props.onDone}>
+          Cancel
+        </button>
+        <button
+          type="button"
+          class="btn btn-primary"
+          disabled={props.busy?.() || (outcome() !== "expired" && !Number.isFinite(Number(price())))}
+          onClick={() =>
+            props.onConfirmCall(pos, outcome(), outcome() === "expired" ? null : Number(price()))
+          }
+        >
+          Confirm
+        </button>
+      </div>
+      <Show when={outcome() === "called-away"}>
+        <div class="hp-dialog-note">
+          confirming auto-reduces the {pos.symbol} lot by {pos.contracts * 100} sh
+        </div>
+      </Show>
+    </div>
+  );
+}
+
+function ClosePanel(props) {
+  return props.d.type === "put" ? (
+    props.d.stage === "lot" ? (
+      <AssignedLotForm d={props.d} busy={props.busy} onDone={props.onDone} onAssign={props.onAssign} />
+    ) : (
+      <PutCloseDialog d={props.d} busy={props.busy} onDone={props.onDone} onConfirmPut={props.onConfirmPut} />
+    )
+  ) : (
+    <CallCloseDialog d={props.d} busy={props.busy} onDone={props.onDone} onConfirmCall={props.onConfirmCall} />
+  );
+}
+
+/* ── the panel ─────────────────────────────────────────────────── */
+
 export default function HoldingsPanel() {
-  const [ledger, { refetch }] = createResource(getHoldings);
+  const [ledger, setLedger] = createSignal(null);
   const [notice, setNotice] = createSignal("");
-  const [closing, setClosing] = createSignal(null);
+  // The one open panel: {type:'put'|'call'|'sellCall'|'addPut'|'addCall'
+  // |'addLot', pos?|lot?, stage?, prefill?} — or null. Exactly one panel
+  // can exist in the DOM.
+  const [dialog, setDialog] = createSignal(null);
   // In-flight guard: a double-clicked Add/Refresh/Confirm must not double-
-  // submit (review finding — the prototype ignored it).
+  // submit (review finding honored from the 2026-09-11 panel).
   const [busy, setBusy] = createSignal(false);
 
   const flash = (msg) => {
@@ -172,162 +744,290 @@ export default function HoldingsPanel() {
     setTimeout(() => setNotice(""), 4000);
   };
 
-  // Most ahead-of-pace first; unpriced positions sink to the bottom.
-  const sorted = () =>
-    [...(ledger()?.positions ?? [])]
-      .map((p) => ({ p, v: p.view }))
-      .sort((a, b) => {
-        const key = (x) => (x.v.pl_pct == null ? -Infinity : x.v.pl_pct - x.v.target_pct);
-        return key(b) - key(a);
-      });
-
-  const onRefresh = async () => {
-    if (busy()) return;
-    setBusy(true);
+  const load = async () => {
     try {
-      const res = await refreshHoldings();
-      const stale = res.refresh?.stale ?? [];
-      flash(
-        stale.length
-          ? `Marks refreshed — ${stale.length} position(s) unpriced (kept last mark).`
-          : "Marks refreshed."
-      );
+      setLedger(await getHoldings());
     } catch (err) {
-      flash(`Refresh failed: ${err.message}`);
-    } finally {
-      setBusy(false);
+      flash(`Holdings API error: ${err.message}`);
     }
-    await refetch();
   };
+  onMount(load);
 
-  const onAdd = async (fields) => {
-    if (busy()) return;
+  const puts = () => ledger()?.positions ?? [];
+  const calls = () => ledger()?.calls ?? [];
+  const lots = () => ledger()?.lots ?? [];
+
+  // The server payload has no `kind` field — the array an entry came from
+  // IS its kind (sibling arrays); tag it here for the row's chip/dialog.
+  const putsV = () => puts().map((p) => ({ p: { ...p, kind: "put" }, v: p.view }));
+  const callsV = () =>
+    calls().map((c) => ({ p: { ...c, kind: "call" }, v: c.view }));
+  const urgencyKey = (x) =>
+    x.v.pl_pct == null ? -Infinity : x.v.pl_pct - x.v.target_pct;
+  const merged = () =>
+    [...putsV(), ...callsV()].sort((a, b) => urgencyKey(b) - urgencyKey(a));
+
+  const dialogFor = (type, id) => {
+    const d = dialog();
+    if (!d || d.type !== type) return null;
+    const anchor = d.pos?.id ?? d.lot?.id;
+    return anchor === id ? d : null;
+  };
+
+  const run = async (fn) => {
+    if (busy()) return null;
     setBusy(true);
     try {
-      const res = await addHolding(fields);
-      flash(`Added ${res.position.symbol} ${res.position.strike} — press Refresh marks to price it.`);
+      return await fn();
     } catch (err) {
-      flash(`Add failed: ${err.message}`);
+      flash(err.message);
+      return null;
     } finally {
       setBusy(false);
     }
-    await refetch();
   };
 
-  const onClose = async (id, outcome, closePrice) => {
-    if (busy()) return;
-    setBusy(true);
-    try {
-      await deleteHolding(id);
+  const onRefresh = async () => {
+    const res = await run(() => refreshHoldings());
+    if (!res) return;
+    const stale = res.refresh?.stale ?? [];
+    flash(
+      stale.length
+        ? `Marks refreshed — ${stale.length} entry(ies) unpriced (kept last mark).`
+        : "Marks refreshed."
+    );
+    await load();
+  };
+
+  const onAdd = async (fields, label) => {
+    const res = await run(() => addHolding(fields));
+    if (!res) return;
+    flash(label);
+    setDialog(null);
+    await load();
+  };
+
+  /* Assigned stage 2: POST kind:"lot" with assigned_from — the server
+     removes the put in the same rewrite. Cancelling the form never got
+     here, so the put remains. */
+  const onAssign = async (pos, fields) => {
+    const res = await run(() => addHolding(fields));
+    if (!res) return;
+    flash(
+      `Assigned — recorded ${fields.shares} sh ${fields.symbol} at $${fields.basis_per_share.toFixed(2)} basis.`
+    );
+    setDialog(null);
+    await load();
+  };
+
+  const onConfirmPut = async (pos, outcome, closePrice) => {
+    if (outcome === "assigned") {
+      // Stage 2: reveal the prefilled lot form (shares = contracts×100,
+      // basis = strike − premium) under the same position.
+      setDialog({
+        type: "put",
+        pos,
+        stage: "lot",
+        prefill: {
+          symbol: pos.symbol,
+          shares: pos.contracts * 100,
+          basis_per_share: +(pos.strike - pos.premium).toFixed(2),
+          acquired: todayET(),
+        },
+      });
+      return;
+    }
+    const res = await run(() => deleteHolding(pos.id));
+    if (!res) return;
+    flash(
+      outcome === "expired"
+        ? "Expired worthless — premium kept, position removed."
+        : "Bought back — position removed."
+    );
+    setDialog(null);
+    await load();
+  };
+
+  const onConfirmCall = async (pos, outcome, closePrice) => {
+    if (outcome === "called-away") {
+      const res = await run(() => calledAway(pos.id));
+      if (!res) return;
       flash(
-        outcome === "expired"
-          ? "Position removed (expired worthless — premium kept)."
-          : "Position removed."
+        res.reduced
+          ? `Called away — ${pos.symbol} lot reduced by ${pos.contracts * 100} sh.`
+          : `Called away — call removed. ${res.reason ?? ""}`
       );
-    } catch (err) {
-      flash(`Close failed: ${err.message}`);
-    } finally {
-      setBusy(false);
+      setDialog(null);
+      await load();
+      return;
     }
-    setClosing(null);
-    await refetch();
+    const res = await run(() => deleteHolding(pos.id));
+    if (!res) return;
+    flash(
+      outcome === "expired"
+        ? "Expired worthless — premium kept, position removed."
+        : "Bought back — position removed."
+    );
+    setDialog(null);
+    await load();
+  };
+
+  /* The strip re-renders from the PATCH response's derived numbers —
+     never from client math. */
+  const onSaveCash = async (n) => {
+    const res = await run(() => patchCash(n));
+    if (!res) return false;
+    setLedger((cur) => ({
+      ...(cur ?? {}),
+      cash: res.cash,
+      cash_reserved: res.cash_reserved,
+      cash_free: res.cash_free,
+    }));
+    flash(`Cash set to ${money(res.cash)} — ${money(res.cash_free)} free.`);
+    return true;
+  };
+
+  const dialogActions = {
+    busy,
+    onDone: () => setDialog(null),
+    onConfirmPut,
+    onConfirmCall,
+    onAssign,
   };
 
   return (
-    <div class="holdings-panel">
-      <div class="holdings-toolbar">
-        <AddForm onAdd={onAdd} busy={busy} />
-        <button type="button" class="btn holdings-refresh" disabled={busy()} onClick={onRefresh}>
-          ⟳<span class="holdings-refresh-label"> Refresh marks</span>
-        </button>
-      </div>
-      <Show when={notice()}>
-        <div class="holdings-notice">{notice()}</div>
-      </Show>
-      <Show when={ledger.error} fallback={null}>
-        <div class="error-banner">Holdings API error: {ledger.error.message}</div>
-      </Show>
-      <Show
-        when={sorted().length > 0}
-        fallback={<div class="empty-panel">No open positions — press “+ New position” to record one.</div>}
-      >
-        <div class="holdings-cards">
-          <For each={sorted()}>
-            {({ p, v }) => (
-              <div class="holdings-card" classList={{ "holdings-card-met": v.pace_met }}>
-                <div class="holdings-card-head">
-                  <b>{p.symbol} {p.strike}P ×{p.contracts}</b>
-                  <span class="holdings-age">
-                    exp {p.expiry} · {v.days_elapsed}/{v.days_total} wd
-                  </span>
-                </div>
-                <div class="holdings-card-big">
-                  <span class={v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
-                    {v.pl_pct == null ? "—" : `${v.pl_pct >= 0 ? "+" : ""}${pct(v.pl_pct, 1)}`}
-                  </span>
-                  <span class="holdings-card-target">target {pct(v.target_pct)}</span>
-                </div>
-                <div class="holdings-bar">
-                  <div
-                    class="holdings-bar-fill"
-                    style={{ width: `${v.pl_pct == null ? 0 : Math.max(0, Math.min(100, v.pl_pct * 100))}%` }}
-                  />
-                  <div class="holdings-bar-mark" style={{ left: `${Math.min(100, v.target_pct * 100)}%` }} />
-                </div>
-                <div class="holdings-card-stats">
-                  <div>
-                    <span>sold at</span>
-                    <b>{money(p.premium)}</b>
-                  </div>
-                  <div>
-                    <span>now (mid)</span>
-                    <b>{p.mark == null ? "—" : p.mark.mid.toFixed(2)}</b>
-                    <Show when={p.mark != null}>
-                      <i>{ageText(p.mark.as_of)}</i>
-                    </Show>
-                    <Show when={p.mark == null}>
-                      <i>unpriced</i>
-                    </Show>
-                  </div>
-                  <div>
-                    <span>spot</span>
-                    <Show when={p.mark?.underlying_price != null} fallback={<b>—</b>}>
-                      <b>{p.mark.underlying_price.toFixed(2)}</b>
-                      <i
-                        class={v.spot_pct_vs_strike < 0 ? "holdings-neg" : "holdings-pos"}
-                      >
-                        {`${v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(v.spot_pct_vs_strike, 1)} vs strike`}
-                      </i>
-                    </Show>
-                  </div>
-                  <div>
-                    <span>close captures</span>
-                    <b class={v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
-                      {v.pl_dollars == null ? "—" : money(v.pl_dollars)}
-                    </b>
-                  </div>
-                </div>
-                <div class="holdings-card-actions">
-                  <Show when={v.pace_met} fallback={<span class="chip normal">holding</span>}>
-                    <span class="chip high">buy back?</span>
-                  </Show>
-                  <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setClosing(p)}>
-                    close…
-                  </button>
-                </div>
-              </div>
-            )}
-          </For>
-        </div>
-      </Show>
-      <Show when={closing()}>
-        <OutcomeDialog
-          position={closing()}
+    <div class="holdings-panel hp-wheel">
+      <aside class="hp-rail">
+        <CashStrip
+          cash={ledger()?.cash ?? null}
+          reserved={ledger()?.cash_reserved ?? 0}
+          free={ledger()?.cash_free ?? null}
           busy={busy}
-          onClose={() => setClosing(null)}
-          onConfirm={(outcome, price) => onClose(closing().id, outcome, price)}
+          onSaveCash={onSaveCash}
         />
-      </Show>
+        <div class="hp-rail-block">
+          <div class="hp-rail-label">the wheel</div>
+          <div class="hp-rail-row">
+            <span>open puts</span>
+            <b>{puts().length}</b>
+          </div>
+          <div class="hp-rail-row">
+            <span>open covered calls</span>
+            <b>{calls().length}</b>
+          </div>
+          <div class="hp-rail-row">
+            <span>share lots</span>
+            <b>{lots().length}</b>
+          </div>
+          <div class="hp-rail-row">
+            <span>shares held</span>
+            <b>{lots().reduce((n, l) => n + l.shares, 0)}</b>
+          </div>
+        </div>
+        <div class="hp-rail-block">
+          <div class="hp-rail-label">lots</div>
+          <Show
+            when={lots().length > 0}
+            fallback={<div class="hp-hint">No recorded lots — assignments land here.</div>}
+          >
+            <For each={lots()}>
+              {(l) => (
+                <LotRailRow
+                  lot={l}
+                  dialogFor={dialogFor}
+                  busy={busy}
+                  onSellDialog={(lot) => setDialog({ type: "sellCall", lot })}
+                  onDialogDone={() => setDialog(null)}
+                  onSellCall={(lot, fields) =>
+                    onAdd(fields, `Sold ${fields.symbol} ${fields.strike}C ×${fields.contracts} — Refresh marks to price.`)
+                  }
+                />
+              )}
+            </For>
+          </Show>
+          <button
+            type="button"
+            class="btn-ghost hp-cash-edit"
+            onClick={() => setDialog({ type: "addLot" })}
+          >
+            + New lot
+          </button>
+          <Show when={dialog()?.type === "addLot"} keyed>
+            <AddLotForm
+              busy={busy}
+              onDone={() => setDialog(null)}
+              onAdd={(f) => onAdd(f, `Recorded ${f.shares} sh ${f.symbol}.`)}
+            />
+          </Show>
+        </div>
+      </aside>
+
+      <div class="hp-list">
+        <div class="hp-toolbar-row">
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>
+            + Sell put
+          </button>
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>
+            + Sell call
+          </button>
+          <button
+            type="button"
+            class="btn holdings-refresh"
+            disabled={busy()}
+            onClick={onRefresh}
+          >
+            ⟳<span class="holdings-refresh-label"> Refresh marks</span>
+          </button>
+        </div>
+        <Show when={notice()}>
+          <div class="holdings-notice">{notice()}</div>
+        </Show>
+        <Show when={dialog()?.type === "addPut"} keyed>
+          <AddPutForm
+            busy={busy}
+            onDone={() => setDialog(null)}
+            onAdd={(f) =>
+              onAdd(f, `Sold ${f.symbol} ${f.strike}P ×${f.contracts} — press Refresh marks to price it.`)
+            }
+          />
+        </Show>
+        <Show when={dialog()?.type === "addCall"} keyed>
+          <AddCallForm
+            busy={busy}
+            onDone={() => setDialog(null)}
+            onAdd={(f) =>
+              onAdd(f, `Sold ${f.symbol} ${f.strike}C ×${f.contracts} — Refresh marks to price.`)
+            }
+          />
+        </Show>
+
+        <Show
+          when={puts().length + calls().length > 0}
+          fallback={
+            <div class="empty-panel">
+              No open positions — press “+ Sell put” to record one.
+            </div>
+          }
+        >
+          <div class="hp-list-row hp-list-head">
+            <span>position</span>
+            <span>P&L</span>
+            <span>pace</span>
+            <span>status</span>
+            <span />
+          </div>
+          <For each={merged()}>
+            {(x) => (
+              <OptionRow
+                x={x}
+                dialogFor={dialogFor}
+                dialogActions={dialogActions}
+                onClose={(x2) => setDialog({ type: x2.p.kind, pos: x2.p })}
+              />
+            )}
+          </For>
+        </Show>
+      </div>
     </div>
   );
 }
diff --git a/crates/webapp/frontend/src/prototypes/holdings-panel-proto-entry.jsx b/crates/webapp/frontend/src/prototypes/holdings-panel-proto-entry.jsx
new file mode 100644
index 0000000..7a07b54
--- /dev/null
+++ b/crates/webapp/frontend/src/prototypes/holdings-panel-proto-entry.jsx
@@ -0,0 +1,45 @@
+/* PROTOTYPE entry — dev-only page. Vite's dev server serves any HTML under
+   the frontend root by path; `vite build` only builds index.html (and the
+   smoke lane builds its own entry), so nothing here can ever ship.
+   Renders the real app shell chrome (brand header, tab strip with Holdings
+   active) from the production stylesheet so the variants read like the
+   finished product. `npm run proto` → http://localhost:5175/holdings-panel-proto.html */
+
+import { render } from "solid-js/web";
+
+import ProtoRoot from "./holdings-panel-proto";
+import "../style.css";
+
+function Shell(props) {
+  return (
+    <div class="shell">
+      <h1 class="brand">
+        <span class="brand-mark">
+          Market<span class="brand-accent">Int</span>
+        </span>
+        <span class="brand-sub">Put-Selling Candidates</span>
+      </h1>
+      <nav class="tabs" role="tablist" aria-label="timeframes">
+        <button type="button" class="tab" disabled title="prototype — Holdings only">
+          Short · 5-day
+        </button>
+        <button type="button" class="tab" disabled title="prototype — Holdings only">
+          Medium · 20-day
+        </button>
+        <button type="button" role="tab" aria-selected="true" class="tab active">
+          Holdings
+        </button>
+      </nav>
+      <div class="hp-scroll">{props.children}</div>
+    </div>
+  );
+}
+
+render(
+  () => (
+    <Shell>
+      <ProtoRoot />
+    </Shell>
+  ),
+  document.getElementById("root")
+);
diff --git a/crates/webapp/frontend/src/prototypes/holdings-panel-proto.jsx b/crates/webapp/frontend/src/prototypes/holdings-panel-proto.jsx
new file mode 100644
index 0000000..ff0f539
--- /dev/null
+++ b/crates/webapp/frontend/src/prototypes/holdings-panel-proto.jsx
@@ -0,0 +1,1288 @@
+/* PROTOTYPE — throwaway, answers one question (prototype skill, UI branch):
+   "What should the evolved holdings panel look like — puts + covered calls +
+   share lots + a cash-available line?"
+   Served only by the dev-only page /holdings-panel-proto.html (sub-shape B —
+   the human asked that production files stay untouched; nothing in
+   src/components or App.jsx imports this). `npm run proto` serves it on a
+   pinned port. Three structurally different variants via ?variant=A|B|C,
+   cycled by the floating bottom bar or ← → keys.
+   This revision is a working mock of the final product: the shell chrome is
+   the real app's classes, all state is live in memory (no backend), the pace
+   views are computed by a JS port of crates/core/src/holdings.rs (working
+   days + 1-day floor, ET today), and every flow works: edit cash (free =
+   cash − Σ strike×100×contracts of open puts), add put / lot, sell call from
+   a lot (contracts prefilled = floor(shares/100)), simulated Refresh marks,
+   and the outcome dialogs — a put closing "assigned" prefills a share lot
+   (shares = contracts×100, basis = strike − premium), a call closing
+   "called away" auto-reduces the lot (removed at 0). */
+
+import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
+import { Dynamic } from "solid-js/web";
+
+/* ── date helpers (lessons.md: never toISOString for local dates) ── */
+
+const parseD = (s) => {
+  const [y, m, d] = s.split("-").map(Number);
+  return new Date(y, m - 1, d);
+};
+const fmtD = (dt) =>
+  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
+    dt.getDate()
+  ).padStart(2, "0")}`;
+const addDays = (iso, n) => fmtD(new Date(parseD(iso).getTime() + n * 86_400_000));
+
+/* ET calendar date, as the production holdings math uses. */
+function etToday() {
+  const s = new Date().toLocaleDateString("en-CA", {
+    timeZone: "America/New_York",
+  });
+  return s;
+}
+const TODAY = etToday();
+
+/* Port of holdings.rs working_days_after — strictly after `from`, through
+   `to`, weekdays only (holidays not modeled, same as production). */
+function workingDaysAfter(fromIso, toIso) {
+  let n = 0;
+  const d = parseD(fromIso);
+  const to = parseD(toIso);
+  while (true) {
+    d.setDate(d.getDate() + 1);
+    if (d > to) break;
+    const wd = d.getDay();
+    if (wd !== 0 && wd !== 6) n += 1;
+  }
+  return n;
+}
+
+/* Port of holdings.rs Holding::view — pace rule with the 1-day floor. */
+function viewOf(p) {
+  const total = workingDaysAfter(p.sold, p.expiry);
+  const anchor = TODAY <= p.expiry ? TODAY : p.expiry;
+  let elapsed = workingDaysAfter(p.sold, anchor);
+  if (elapsed > total) elapsed = total;
+  const target = total > 0 ? Math.max(1, elapsed) / total : 0;
+  const spot = p.mark?.underlying_price;
+  const spotVs = spot != null ? (spot - p.strike) / p.strike : null;
+  if (!p.mark) {
+    return { pl_pct: null, pl_dollars: null, days_elapsed: elapsed,
+             days_total: total, target_pct: target, pace_met: false,
+             spot_pct_vs_strike: spotVs };
+  }
+  const perShare = p.premium - p.mark.mid;
+  const plDollars = perShare * 100 * p.contracts;
+  const plPct = perShare / p.premium;
+  return { pl_pct: plPct, pl_dollars: plDollars, days_elapsed: elapsed,
+           days_total: total, target_pct: target, pace_met: plPct >= target,
+           spot_pct_vs_strike: spotVs };
+}
+
+/* ── live state (in memory only — the prototype checks nothing persistent) ── */
+
+let seq = 0;
+const nid = (k) => `${k}${Date.now().toString(36)}-${seq++}`;
+
+const [puts, setPuts] = createSignal([
+  { id: "p1", kind: "put", symbol: "TSLA", strike: 420, premium: 4.5,
+    contracts: 1, sold: addDays(TODAY, -9), expiry: addDays(TODAY, 4),
+    mark: { mid: 0.75, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
+            underlying_price: 401.0 } },
+  { id: "p2", kind: "put", symbol: "GOOG", strike: 350, premium: 1.0,
+    contracts: 2, sold: addDays(TODAY, -5), expiry: addDays(TODAY, 2),
+    mark: { mid: 0.85, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
+            underlying_price: 344.2 } },
+  { id: "p3", kind: "put", symbol: "AAPL", strike: 230, premium: 3.2,
+    contracts: 1, sold: TODAY, expiry: addDays(TODAY, 9), mark: null },
+]);
+const [calls, setCalls] = createSignal([
+  { id: "c1", kind: "call", symbol: "TSLA", strike: 390, premium: 6.0,
+    contracts: 1, sold: addDays(TODAY, -9), expiry: addDays(TODAY, 4),
+    mark: { mid: 4.1, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
+            underlying_price: 401.0 } },
+  { id: "c2", kind: "call", symbol: "GOOG", strike: 360, premium: 2.1,
+    contracts: 2, sold: addDays(TODAY, -5), expiry: addDays(TODAY, 2),
+    mark: { mid: 1.4, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
+            underlying_price: 344.2 } },
+]);
+const [lots, setLots] = createSignal([
+  { id: "l1", symbol: "GOOG", shares: 200, basis_per_share: 349.0,
+    acquired: addDays(TODAY, -12) },
+  { id: "l2", symbol: "TSLA", shares: 100, basis_per_share: 402.5,
+    acquired: addDays(TODAY, -12) },
+]);
+const [spots, setSpots] = createSignal({ TSLA: 401.0, GOOG: 344.2, AAPL: 231.1 });
+const [spotsAsOf, setSpotsAsOf] = createSignal(
+  new Date(Date.now() - 2 * 3600_000).toISOString()
+);
+const [cashBal, setCashBal] = createSignal(148_000);
+
+const reserved = () => puts().reduce((n, p) => n + p.strike * 100 * p.contracts, 0);
+const freeCash = () => cashBal() - reserved();
+const coveredOf = (symbol) =>
+  calls().filter((c) => c.symbol === symbol).reduce((n, c) => n + c.contracts, 0);
+
+/* Dialog + notice state shared by every variant. */
+const [dialog, setDialog] = createSignal(null); // {type:'put'|'call'|'sellCall'|'addPut'|'addLot', ...}
+const [flashMsg, setFlashMsg] = createSignal("");
+let flashTimer;
+function flash(msg) {
+  setFlashMsg(msg);
+  clearTimeout(flashTimer);
+  flashTimer = setTimeout(() => setFlashMsg(""), 4000);
+}
+
+/* ── actions ── */
+
+function refreshMarks() {
+  const wiggle = (v) => Math.max(0.05, v * (1 + (Math.random() - 0.45) * 0.06));
+  const nextSpots = {};
+  for (const [sym, px] of Object.entries(spots())) {
+    nextSpots[sym] = +(px * (1 + (Math.random() - 0.5) * 0.008)).toFixed(2);
+  }
+  setSpots(nextSpots);
+  setSpotsAsOf(new Date().toISOString());
+  const asOf = new Date().toISOString();
+  const mark = (p) => {
+    const mid =
+      p.mark == null
+        ? +(p.premium * (0.35 + Math.random() * 0.35)).toFixed(2)
+        : +wiggle(p.mark.mid).toFixed(2);
+    return { mid, as_of: asOf, underlying_price: nextSpots[p.symbol] ?? null };
+  };
+  setPuts(puts().map((p) => ({ ...p, mark: mark(p) })));
+  setCalls(calls().map((c) => ({ ...c, mark: mark(c) })));
+  flash("Marks refreshed (simulated Tiger).");
+}
+
+function addPut(fields) {
+  const p = { id: nid("p"), kind: "put", ...fields, mark: null };
+  setPuts([...puts(), p]);
+  flash(`Sold ${p.symbol} ${p.strike}P ×${p.contracts} — Refresh marks to price it.`);
+  setDialog(null);
+}
+
+function addLot(fields) {
+  setLots([...lots(), { id: nid("l"), ...fields }]);
+  flash(`Recorded ${fields.shares} sh ${fields.symbol}.`);
+  setDialog(null);
+}
+
+function addCall(fields) {
+  const c = { id: nid("c"), kind: "call", sold: fields.sold ?? TODAY, mark: null, ...fields };
+  setCalls([...calls(), c]);
+  flash(`Sold ${c.symbol} ${c.strike}C ×${c.contracts} — Refresh marks to price.`);
+  setDialog(null);
+}
+
+function sellCall(lot, fields) {
+  const c = { id: nid("c"), kind: "call", symbol: lot.symbol, ...fields,
+              sold: TODAY, mark: null };
+  setCalls([...calls(), c]);
+  flash(`Sold ${c.symbol} ${c.strike}C ×${c.contracts} — Refresh marks to price.`);
+  setDialog(null);
+}
+
+/* Q2: a put closing ASSIGNED prefills the share lot — one click from the
+   outcome to a recorded lot at basis = strike − premium. */
+function confirmPutClose(pos, outcome, price, lotFields) {
+  if (outcome === "assigned") {
+    if (!lotFields) {
+      setDialog({ type: "put", pos,
+        stage: "lot",
+        prefill: { symbol: pos.symbol, shares: pos.contracts * 100,
+                   basis_per_share: +(pos.strike - pos.premium).toFixed(2),
+                   acquired: TODAY } });
+      return;
+    }
+    setLots([...lots(), { id: nid("l"), ...lotFields }]);
+    setPuts(puts().filter((p) => p.id !== pos.id));
+    flash(`Assigned — recorded ${lotFields.shares} sh ${lotFields.symbol} at $${lotFields.basis_per_share.toFixed(2)} basis.`);
+    setDialog(null);
+    return;
+  }
+  setPuts(puts().filter((p) => p.id !== pos.id));
+  flash(outcome === "expired"
+    ? "Expired worthless — premium kept, position removed."
+    : "Bought back — position removed.");
+  setDialog(null);
+}
+
+/* Q12 (user decision): a call closing CALLED AWAY auto-reduces the lot by
+   contracts×100 shares; the lot disappears at zero. */
+function confirmCallClose(pos, outcome, price) {
+  if (outcome === "called-away") {
+    const need = pos.contracts * 100;
+    const lot = lots().find((l) => l.symbol === pos.symbol && l.shares >= need);
+    if (!lot) {
+      flash(`No recorded lot covers ${pos.contracts} × ${pos.symbol} — shares not reduced (record the lot first).`);
+      setCalls(calls().filter((c) => c.id !== pos.id));
+      setDialog(null);
+      return;
+    }
+    const rest = lot.shares - need;
+    setLots(rest === 0
+      ? lots().filter((l) => l.id !== lot.id)
+      : lots().map((l) => (l.id === lot.id ? { ...l, shares: rest } : l)));
+    setCalls(calls().filter((c) => c.id !== pos.id));
+    flash(`Called away — ${pos.symbol} lot reduced by ${need} sh${rest === 0 ? " (lot closed)" : `, ${rest} sh left`}.`);
+    setDialog(null);
+    return;
+  }
+  setCalls(calls().filter((c) => c.id !== pos.id));
+  flash(outcome === "expired"
+    ? "Expired worthless — premium kept, position removed."
+    : "Bought back — position removed.");
+  setDialog(null);
+}
+
+/* ── formatting (production conventions) ── */
+
+const money = (v) =>
+  (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 0 });
+const money2 = (v) => (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
+const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;
+
+function ageText(rfc3339) {
+  const secs = Math.max(0, (Date.now() - new Date(rfc3339).getTime()) / 1000);
+  const m = Math.floor(secs / 60);
+  if (m < 1) return "just now";
+  if (m < 60) return `${m} min ago`;
+  return `about ${Math.floor(m / 60)} h ago`;
+}
+
+const urgencyKey = (x) =>
+  x.v.pl_pct == null ? -Infinity : x.v.pl_pct - x.v.target_pct;
+const byUrgency = (arr) => [...arr].sort((a, b) => urgencyKey(b) - urgencyKey(a));
+const putsV = () => puts().map((p) => ({ p, v: viewOf(p) }));
+const callsV = () => calls().map((c) => ({ p: c, v: viewOf(c) }));
+
+/* ── cards ── */
+
+function MiniBar(props) {
+  const fill = () =>
+    props.v.pl_pct == null ? 0 : Math.max(0, Math.min(100, props.v.pl_pct * 100));
+  return (
+    <div class="holdings-bar">
+      <div class="holdings-bar-fill" style={{ width: `${fill()}%` }} />
+      <div class="holdings-bar-mark" style={{ left: `${Math.min(100, props.v.target_pct * 100)}%` }} />
+    </div>
+  );
+}
+
+function PutCard(props) {
+  const p = props.x.p;
+  const v = props.x.v;
+  return (
+    <div class="holdings-card" classList={{ "holdings-card-met": v.pace_met }}>
+      <div class="holdings-card-head">
+        <b>{p.symbol} {p.strike}P ×{p.contracts}</b>
+        <span class="holdings-age">exp {p.expiry} · {v.days_elapsed}/{v.days_total} wd</span>
+      </div>
+      <div class="holdings-card-big">
+        <span class={v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
+          {v.pl_pct == null ? "—" : `${v.pl_pct >= 0 ? "+" : ""}${pct(v.pl_pct, 1)}`}
+        </span>
+        <span class="holdings-card-target">target {pct(v.target_pct)}</span>
+      </div>
+      <MiniBar v={v} />
+      <div class="holdings-card-stats">
+        <div><span>sold at</span><b>{money2(p.premium)}</b></div>
+        <div>
+          <span>now (mid)</span>
+          <b>{p.mark == null ? "—" : p.mark.mid.toFixed(2)}</b>
+          <i>{p.mark == null ? "unpriced" : ageText(p.mark.as_of)}</i>
+        </div>
+        <div>
+          <span>spot</span>
+          <Show when={p.mark?.underlying_price != null} fallback={<b>—</b>}>
+            <b>{p.mark.underlying_price.toFixed(2)}</b>
+            <i class={v.spot_pct_vs_strike < 0 ? "holdings-neg" : "holdings-pos"}>
+              {`${v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(v.spot_pct_vs_strike, 1)} vs strike`}
+            </i>
+          </Show>
+        </div>
+        <div>
+          <span>close captures</span>
+          <b class={v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
+            {v.pl_dollars == null ? "—" : money2(v.pl_dollars)}
+          </b>
+        </div>
+      </div>
+      <div class="holdings-card-actions">
+        <Show when={v.pace_met} fallback={<span class="chip normal">holding</span>}>
+          <span class="chip high">buy back?</span>
+        </Show>
+        <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setDialog({ type: "put", pos: p })}>close…</button>
+      </div>
+    </div>
+  );
+}
+
+function CallCard(props) {
+  const p = props.x.p;
+  const v = props.x.v;
+  const itm = () => v.spot_pct_vs_strike != null && v.spot_pct_vs_strike > 0;
+  return (
+    <div class="holdings-card" classList={{ "holdings-card-met": v.pace_met }}>
+      <div class="holdings-card-head">
+        <b>{p.symbol} {p.strike}C ×{p.contracts}</b>
+        <span class="holdings-age">exp {p.expiry} · {v.days_elapsed}/{v.days_total} wd</span>
+      </div>
+      <div class="holdings-card-big">
+        <span class={v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
+          {`${v.pl_pct >= 0 ? "+" : ""}${pct(v.pl_pct, 1)}`}
+        </span>
+        <span class="holdings-card-target">target {pct(v.target_pct)}</span>
+      </div>
+      <MiniBar v={v} />
+      <div class="holdings-card-stats">
+        <div><span>sold at</span><b>{money2(p.premium)}</b></div>
+        <div>
+          <span>now (mid)</span>
+          <b>{p.mark == null ? "—" : p.mark.mid.toFixed(2)}</b>
+          <i>{p.mark == null ? "unpriced" : ageText(p.mark.as_of)}</i>
+        </div>
+        <div>
+          <span>spot</span>
+          <Show when={p.mark?.underlying_price != null} fallback={<b>—</b>}>
+            <b>{p.mark.underlying_price.toFixed(2)}</b>
+            <i class={itm() ? "holdings-neg" : "holdings-pos"}>
+              {`${v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(v.spot_pct_vs_strike, 1)} vs strike`}
+            </i>
+          </Show>
+        </div>
+        <div>
+          <span>close captures</span>
+          <b class={v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
+            {v.pl_dollars == null ? "—" : money2(v.pl_dollars)}
+          </b>
+        </div>
+      </div>
+      <div class="holdings-card-actions">
+        <Show when={v.pace_met} fallback={<span class="chip normal">holding</span>}>
+          <span class="chip high">buy back?</span>
+        </Show>
+        <Show when={itm()}>
+          <span class="chip high">ITM — called away?</span>
+        </Show>
+        <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setDialog({ type: "call", pos: p })}>close…</button>
+      </div>
+    </div>
+  );
+}
+
+function LotCard(props) {
+  const l = props.l;
+  const spot = () => spots()[l.symbol] ?? 0;
+  const value = () => spot() * l.shares;
+  const basis = () => l.basis_per_share * l.shares;
+  const pl = () => value() - basis();
+  const plPct = () => (basis() > 0 ? pl() / basis() : 0);
+  const capacity = () => Math.floor(l.shares / 100);
+  return (
+    <div class="holdings-card hp-lot-card">
+      <div class="holdings-card-head">
+        <b>{l.shares} sh {l.symbol}</b>
+        <span class="holdings-age">since {l.acquired}</span>
+      </div>
+      <div class="holdings-card-big">
+        <span class={pl() >= 0 ? "holdings-pos" : "holdings-neg"}>
+          {`${pl() >= 0 ? "+" : ""}${pct(plPct(), 1)}`}
+        </span>
+        <span class="holdings-card-target">{money2(spot())} / sh</span>
+      </div>
+      <div class="holdings-card-stats">
+        <div><span>basis</span><b>{money2(l.basis_per_share)}</b></div>
+        <div>
+          <span>value</span>
+          <b>{money(value())}</b>
+          <i>spot {ageText(spotsAsOf())}</i>
+        </div>
+        <div>
+          <span>P&L</span>
+          <b class={pl() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(pl())}</b>
+        </div>
+        <div><span>covered</span><b>{coveredOf(l.symbol)}/{capacity()} calls</b></div>
+      </div>
+      <div class="holdings-card-actions">
+        <Show when={coveredOf(l.symbol) < capacity()}>
+          <span class="chip normal">capacity for {capacity() - coveredOf(l.symbol)} more</span>
+        </Show>
+        <Show when={capacity() > 0}>
+          <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setDialog({ type: "sellCall", lot: l })}>sell call…</button>
+        </Show>
+      </div>
+    </div>
+  );
+}
+
+/* ── cash (Q11: manual balance; free = cash − Σ strike×100×contracts) ── */
+
+function CashEditor(props) {
+  const [val, setVal] = createSignal(String(cashBal()));
+  return (
+    <span class="hp-cash-editor">
+      <input
+        inputmode="decimal"
+        value={val()}
+        onInput={(e) => setVal(e.target.value)}
+      />
+      <button
+        type="button"
+        class="btn btn-primary"
+        onClick={() => {
+          const n = Number(val().replace(/[$,]/g, ""));
+          if (Number.isFinite(n) && n >= 0) {
+            setCashBal(n);
+            flash(`Cash set to ${money(n)}.`);
+          }
+          props.onDone?.();
+        }}
+      >
+        save
+      </button>
+    </span>
+  );
+}
+
+function CashStrip() {
+  const [editing, setEditing] = createSignal(false);
+  return (
+    <div class="hp-cash">
+      <div><span>cash</span><b>{money(cashBal())}</b></div>
+      <div><span>reserved by open puts</span><b>{money(reserved())}</b></div>
+      <div class="hp-cash-free"><span>free to sell puts</span><b>{money(freeCash())}</b></div>
+      <Show when={!editing()} fallback={<CashEditor onDone={() => setEditing(false)} />}>
+        <button type="button" class="btn-ghost hp-cash-edit" onClick={() => setEditing(true)}>edit</button>
+      </Show>
+    </div>
+  );
+}
+
+function SectionHead(props) {
+  return (
+    <h3 class="hp-section-head">
+      {props.label} <span class="hp-count">{props.items}</span>
+      <Show when={props.action}>
+        <button type="button" class="btn-ghost hp-section-add" onClick={props.action.onClick}>
+          {props.action.label}
+        </button>
+      </Show>
+    </h3>
+  );
+}
+
+/* ── dialogs (production OutcomeDialog patterns) ── */
+
+function PutCloseDialog(props) {
+  const pos = props.d.pos;
+  const [outcome, setOutcome] = createSignal("bought-back");
+  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
+  const realized = () => {
+    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
+    const close = Number(price());
+    if (!Number.isFinite(close)) return null;
+    if (outcome() === "assigned") return (pos.strike - close + pos.premium) * 100 * pos.contracts;
+    return (pos.premium - close) * 100 * pos.contracts;
+  };
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">
+        Close {pos.symbol} {pos.strike}P ×{pos.contracts}
+      </div>
+      <div class="holdings-outcome-row">
+        <label>
+          <input type="radio" checked={outcome() === "bought-back"} onChange={() => setOutcome("bought-back")} />
+          bought back
+        </label>
+        <label>
+          <input type="radio" checked={outcome() === "expired"} onChange={() => setOutcome("expired")} />
+          expired worthless
+        </label>
+        <label>
+          <input type="radio" checked={outcome() === "assigned"} onChange={() => setOutcome("assigned")} />
+          assigned
+        </label>
+      </div>
+      <Show when={outcome() !== "expired"}>
+        <label class="holdings-outcome-price">
+          {outcome() === "assigned" ? "share price at assignment" : "close price/share"}
+          <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
+        </label>
+      </Show>
+      <div class="holdings-outcome-realized">
+        realized:{" "}
+        <Show when={realized() !== null} fallback="—">
+          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(realized())}</b>
+        </Show>
+      </div>
+      <div class="holdings-outcome-actions">
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+        <button
+          type="button"
+          class="btn btn-primary"
+          disabled={outcome() !== "expired" && !Number.isFinite(Number(price()))}
+          onClick={() => confirmPutClose(pos, outcome(), outcome() === "expired" ? null : Number(price()))}
+        >
+          Confirm
+        </button>
+      </div>
+      <Show when={outcome() === "assigned"}>
+        <div class="hp-dialog-note">
+          confirming creates a share lot prefilled at basis = strike − premium
+        </div>
+      </Show>
+    </div>
+  );
+}
+
+/* Stage 2 of the assigned flow: the prefilled lot form (Q2). */
+function AssignedLotDialog(props) {
+  const [f, setF] = createSignal({ ...props.d.prefill });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">Record assigned shares</div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid()) return;
+          confirmPutClose(props.d.pos, "assigned", null, {
+            symbol: f().symbol.trim().toUpperCase(),
+            shares: Number(f().shares),
+            basis_per_share: Number(f().basis_per_share),
+            acquired: f().acquired,
+          });
+        }}
+      >
+        <label>
+          symbol <input value={f().symbol} onInput={set("symbol")} />
+        </label>
+        <label>
+          shares <input inputmode="numeric" value={f().shares} onInput={set("shares")} />
+        </label>
+        <label>
+          basis / share
+          <input inputmode="decimal" value={f().basis_per_share} onInput={set("basis_per_share")} />
+        </label>
+        <label>
+          acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
+        </label>
+        <button type="submit" class="btn btn-primary" disabled={!valid()}>Record lot</button>
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+      </form>
+    </div>
+  );
+}
+
+function CallCloseDialog(props) {
+  const pos = props.d.pos;
+  const [outcome, setOutcome] = createSignal("bought-back");
+  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
+  const realized = () => {
+    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
+    const close = Number(price());
+    if (!Number.isFinite(close)) return null;
+    if (outcome() === "called-away") return (pos.strike - close + pos.premium) * 100 * pos.contracts;
+    return (pos.premium - close) * 100 * pos.contracts;
+  };
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">
+        Close {pos.symbol} {pos.strike}C ×{pos.contracts}
+      </div>
+      <div class="holdings-outcome-row">
+        <label>
+          <input type="radio" checked={outcome() === "bought-back"} onChange={() => setOutcome("bought-back")} />
+          bought back
+        </label>
+        <label>
+          <input type="radio" checked={outcome() === "expired"} onChange={() => setOutcome("expired")} />
+          expired worthless
+        </label>
+        <label>
+          <input type="radio" checked={outcome() === "called-away"} onChange={() => setOutcome("called-away")} />
+          called away
+        </label>
+      </div>
+      <Show when={outcome() !== "expired"}>
+        <label class="holdings-outcome-price">
+          {outcome() === "called-away" ? "share price at call" : "close price/share"}
+          <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
+        </label>
+      </Show>
+      <div class="holdings-outcome-realized">
+        realized:{" "}
+        <Show when={realized() !== null} fallback="—">
+          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(realized())}</b>
+        </Show>
+      </div>
+      <div class="holdings-outcome-actions">
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+        <button
+          type="button"
+          class="btn btn-primary"
+          disabled={outcome() !== "expired" && !Number.isFinite(Number(price()))}
+          onClick={() => confirmCallClose(pos, outcome(), outcome() === "expired" ? null : Number(price()))}
+        >
+          Confirm
+        </button>
+      </div>
+      <Show when={outcome() === "called-away"}>
+        <div class="hp-dialog-note">
+          confirming auto-reduces the {pos.symbol} lot by {pos.contracts * 100} sh
+        </div>
+      </Show>
+    </div>
+  );
+}
+
+/* Q13: contracts prefilled from the lot — floor(shares/100), editable down. */
+function SellCallDialog(props) {
+  const lot = props.d.lot;
+  const isoLocal = addDays(TODAY, 7);
+  const [f, setF] = createSignal({
+    strike: "",
+    premium: "",
+    expiry: isoLocal,
+    contracts: String(Math.floor(lot.shares / 100)),
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    Number(f().strike) > 0 && Number(f().premium) > 0 &&
+    Number(f().contracts) >= 1 && Number(f().contracts) <= Math.floor(lot.shares / 100) &&
+    f().expiry > TODAY;
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">
+        Sell covered call · {lot.shares} sh {lot.symbol}
+      </div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid()) return;
+          sellCall(lot, {
+            strike: Number(f().strike),
+            premium: Number(f().premium),
+            expiry: f().expiry,
+            contracts: Math.trunc(Number(f().contracts)),
+          });
+        }}
+      >
+        <label>
+          strike
+          <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
+        </label>
+        <label>
+          premium
+          <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
+        </label>
+        <label>
+          contracts
+          <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
+        </label>
+        <label>
+          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
+        </label>
+        <button type="submit" class="btn btn-primary" disabled={!valid()}>Sell call</button>
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+      </form>
+    </div>
+  );
+}
+
+/* Toolbar add-put form — the production AddForm fields. */
+function AddPutDialog() {
+  const [f, setF] = createSignal({
+    symbol: "", strike: "", premium: "", contracts: "1",
+    sold: TODAY, expiry: addDays(TODAY, 7),
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() && [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
+    f().expiry > f().sold && f().sold <= TODAY;
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">Sell put</div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid()) return;
+          addPut({
+            symbol: f().symbol.trim().toUpperCase(),
+            strike: Number(f().strike),
+            premium: Number(f().premium),
+            contracts: Math.trunc(Number(f().contracts)),
+            sold: f().sold,
+            expiry: f().expiry,
+          });
+        }}
+      >
+        <label>
+          symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
+        </label>
+        <label>
+          strike <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
+        </label>
+        <label>
+          premium <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
+        </label>
+        <label>
+          contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
+        </label>
+        <label>
+          sold <input type="date" value={f().sold} onInput={set("sold")} />
+        </label>
+        <label>
+          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
+        </label>
+        <button type="submit" class="btn btn-primary" disabled={!valid()}>Sell put</button>
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+      </form>
+    </div>
+  );
+}
+
+/* Standalone covered-call entry (no lot binding — coverage is display-only). */
+function AddCallDialog() {
+  const [f, setF] = createSignal({
+    symbol: "", strike: "", premium: "", contracts: "1",
+    sold: TODAY, expiry: addDays(TODAY, 7),
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() && [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
+    f().expiry > f().sold && f().sold <= TODAY;
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">Sell call</div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid()) return;
+          addCall({
+            symbol: f().symbol.trim().toUpperCase(),
+            strike: Number(f().strike),
+            premium: Number(f().premium),
+            contracts: Math.trunc(Number(f().contracts)),
+            expiry: f().expiry,
+          });
+        }}
+      >
+        <label>
+          symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
+        </label>
+        <label>
+          strike <input inputmode="decimal" placeholder="e.g. 355.00" value={f().strike} onInput={set("strike")} />
+        </label>
+        <label>
+          premium <input inputmode="decimal" placeholder="e.g. 1.80" value={f().premium} onInput={set("premium")} />
+        </label>
+        <label>
+          contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
+        </label>
+        <label>
+          sold <input type="date" value={f().sold} onInput={set("sold")} />
+        </label>
+        <label>
+          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
+        </label>
+        <button type="submit" class="btn btn-primary" disabled={!valid()}>Sell call</button>
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+      </form>
+      <div class="hp-dialog-note">
+        coverage is shown per lot — recorded even if it exceeds held shares
+      </div>
+    </div>
+  );
+}
+
+function AddLotDialog() {
+  const [f, setF] = createSignal({
+    symbol: "", shares: "", basis_per_share: "", acquired: TODAY,
+  });
+  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
+  const valid = () =>
+    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
+  return (
+    <div class="holdings-outcome">
+      <div class="holdings-outcome-head">Record share lot</div>
+      <form
+        class="holdings-add"
+        onSubmit={(e) => {
+          e.preventDefault();
+          if (!valid()) return;
+          addLot({
+            symbol: f().symbol.trim().toUpperCase(),
+            shares: Math.trunc(Number(f().shares)),
+            basis_per_share: Number(f().basis_per_share),
+            acquired: f().acquired,
+          });
+        }}
+      >
+        <label>
+          symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
+        </label>
+        <label>
+          shares <input inputmode="numeric" placeholder="e.g. 100" value={f().shares} onInput={set("shares")} />
+        </label>
+        <label>
+          basis / share
+          <input inputmode="decimal" placeholder="e.g. 349.00" value={f().basis_per_share} onInput={set("basis_per_share")} />
+        </label>
+        <label>
+          acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
+        </label>
+        <button type="submit" class="btn btn-primary" disabled={!valid()}>Record lot</button>
+        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
+      </form>
+    </div>
+  );
+}
+
+/* The dialog anchored to a given position/lot id, or null when it belongs
+   to something else — panels render inline under their own position. */
+function dialogFor(type, id) {
+  const d = dialog();
+  if (!d || d.type !== type) return null;
+  const anchor = d.pos?.id ?? d.lot?.id;
+  return anchor === id ? d : null;
+}
+
+/* Put/call close panel, including the assigned flow's second stage. */
+function ClosePanel(props) {
+  return props.d.type === "put" ? (
+    props.d.stage === "lot" ? <AssignedLotDialog d={props.d} /> : <PutCloseDialog d={props.d} />
+  ) : (
+    <CallCloseDialog d={props.d} />
+  );
+}
+
+/* ── variants (all on the same live state) ── */
+
+function VariantSections() {
+  return (
+    <div class="holdings-panel">
+      <CashStrip />
+      <div class="hp-toolbar-row">
+        <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>+ Sell put</button>
+        <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>+ Sell call</button>
+        <button type="button" class="btn holdings-refresh" onClick={refreshMarks}>⟳<span class="holdings-refresh-label"> Refresh marks</span></button>
+      </div>
+      <SectionHead label="Puts" items={puts().length} action={{ label: "+ Sell put", onClick: () => setDialog({ type: "addPut" }) }} />
+      <Show when={dialog()?.type === "addPut"} keyed><AddPutDialog /></Show>
+      <div class="holdings-cards">
+        <For each={byUrgency(putsV())}>{(x) => (
+          <div class="hp-slot">
+            <PutCard x={x} />
+            <Show when={dialogFor("put", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
+          </div>
+        )}</For>
+      </div>
+      <SectionHead label="Covered calls" items={calls().length} action={{ label: "+ Sell call", onClick: () => setDialog({ type: "addCall" }) }} />
+      <Show when={dialog()?.type === "addCall"} keyed><AddCallDialog /></Show>
+      <Show when={calls().length === 0}>
+        <div class="hp-hint">Sell calls from a share lot's “sell call…” button, or the + Sell call button above.</div>
+      </Show>
+      <div class="holdings-cards">
+        <For each={byUrgency(callsV())}>{(x) => (
+          <div class="hp-slot">
+            <CallCard x={x} />
+            <Show when={dialogFor("call", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
+          </div>
+        )}</For>
+      </div>
+      <SectionHead label="Shares" items={lots().length} action={{ label: "+ New lot", onClick: () => setDialog({ type: "addLot" }) }} />
+      <Show when={dialog()?.type === "addLot"} keyed><AddLotDialog /></Show>
+      <div class="holdings-cards">
+        <For each={lots()}>{(l) => (
+          <div class="hp-slot">
+            <LotCard l={l} />
+            <Show when={dialogFor("sellCall", l.id)} keyed>{(d) => <SellCallDialog d={d} />}</Show>
+          </div>
+        )}</For>
+      </div>
+    </div>
+  );
+}
+
+function VariantTabs() {
+  const [seg, setSeg] = createSignal("puts");
+  const segs = () => [
+    { id: "puts", label: `Puts (${puts().length})` },
+    { id: "calls", label: `Calls (${calls().length})` },
+    { id: "shares", label: `Shares (${lots().length})` },
+    { id: "cash", label: "Cash" },
+  ];
+  return (
+    <div class="holdings-panel">
+      <div class="hp-seg" role="tablist" aria-label="holdings sections">
+        {segs().map((s) => (
+          <button
+            type="button"
+            role="tab"
+            aria-selected={seg() === s.id}
+            classList={{ "hp-seg-btn": true, active: seg() === s.id }}
+            onClick={() => setSeg(s.id)}
+          >
+            {s.label}
+          </button>
+        ))}
+      </div>
+      <Show when={seg() === "cash"}>
+        <div class="hp-cash-big">
+          <div class="hp-cash-free-line">
+            <span>free to sell puts</span>
+            <b>{money(freeCash())}</b>
+          </div>
+          <Show when={!hpEditingCash()} fallback={<CashEditor onDone={() => hpSetEditingCash(false)} />}>
+            <button type="button" class="btn hp-cash-edit-big" onClick={() => hpSetEditingCash(true)}>edit cash…</button>
+          </Show>
+          <div class="hp-cash-row"><span>account cash</span><b>{money(cashBal())}</b></div>
+          <div class="hp-cash-row"><span>reserved by {puts().length} open puts (strike × 100 × contracts)</span><b>{money(reserved())}</b></div>
+        </div>
+      </Show>
+      <Show when={seg() === "puts"}>
+        <div class="hp-toolbar-row">
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>+ Sell put</button>
+          <button type="button" class="btn holdings-refresh" onClick={refreshMarks}>⟳<span class="holdings-refresh-label"> Refresh marks</span></button>
+        </div>
+        <Show when={dialog()?.type === "addPut"} keyed><AddPutDialog /></Show>
+        <div class="holdings-cards"><For each={byUrgency(putsV())}>{(x) => (
+          <div class="hp-slot">
+            <PutCard x={x} />
+            <Show when={dialogFor("put", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
+          </div>
+        )}</For></div>
+      </Show>
+      <Show when={seg() === "calls"}>
+        <div class="hp-toolbar-row">
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>+ Sell call</button>
+        </div>
+        <Show when={dialog()?.type === "addCall"} keyed><AddCallDialog /></Show>
+        <Show when={calls().length === 0}>
+          <div class="hp-hint">Sell calls from a share lot's “sell call…” button, or the + Sell call button above.</div>
+        </Show>
+        <div class="holdings-cards"><For each={byUrgency(callsV())}>{(x) => (
+          <div class="hp-slot">
+            <CallCard x={x} />
+            <Show when={dialogFor("call", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
+          </div>
+        )}</For></div>
+      </Show>
+      <Show when={seg() === "shares"}>
+        <div class="hp-toolbar-row">
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addLot" })}>+ New lot</button>
+        </div>
+        <Show when={dialog()?.type === "addLot"} keyed><AddLotDialog /></Show>
+        <div class="holdings-cards"><For each={lots()}>{(l) => (
+          <div class="hp-slot">
+            <LotCard l={l} />
+            <Show when={dialogFor("sellCall", l.id)} keyed>{(d) => <SellCallDialog d={d} />}</Show>
+          </div>
+        )}</For></div>
+      </Show>
+    </div>
+  );
+}
+
+/* module-level edit flag for B's cash view (A/C own theirs locally) */
+const [hpEditingCash, hpSetEditingCash] = createSignal(false);
+
+function VariantWheel() {
+  const merged = () => byUrgency([...putsV(), ...callsV()]);
+  const [editing, setEditing] = createSignal(false);
+  return (
+    <div class="holdings-panel hp-wheel">
+      <aside class="hp-rail">
+        <div class="hp-rail-block">
+          <div class="hp-rail-label">free to sell puts</div>
+          <div class="hp-rail-big">{money(freeCash())}</div>
+          <div class="hp-rail-sub">{money(cashBal())} cash − {money(reserved())} reserved</div>
+          <Show when={!editing()} fallback={<CashEditor onDone={() => setEditing(false)} />}>
+            <button type="button" class="btn-ghost hp-cash-edit" onClick={() => setEditing(true)}>edit cash</button>
+          </Show>
+        </div>
+        <div class="hp-rail-block">
+          <div class="hp-rail-label">the wheel</div>
+          <div class="hp-rail-row"><span>open puts</span><b>{puts().length}</b></div>
+          <div class="hp-rail-row"><span>open covered calls</span><b>{calls().length}</b></div>
+          <div class="hp-rail-row"><span>share lots</span><b>{lots().length}</b></div>
+          <div class="hp-rail-row"><span>shares held</span><b>{lots().reduce((n, l) => n + l.shares, 0)}</b></div>
+        </div>
+        <div class="hp-rail-block">
+          <div class="hp-rail-label">lots</div>
+          <div class="hp-rail-sub">last price {ageText(spotsAsOf())} (Tiger)</div>
+          <Show when={dialog()?.type === "addLot"} keyed><AddLotDialog /></Show>
+          <For each={lots()}>
+            {(l) => {
+              const spot = () => spots()[l.symbol] ?? 0;
+              const basis = () => l.basis_per_share * l.shares;
+              const pl = () => spot() * l.shares - basis();
+              const plPct = () => (basis() > 0 ? pl() / basis() : 0);
+              return (
+                <div class="hp-slot">
+                <div class="hp-lot-row">
+                  <div class="hp-lot-row-top">
+                    <span>{l.shares} sh {l.symbol}</span>
+                    <b>{spot() > 0 ? money2(spot()) : "—"}</b>
+                  </div>
+                  <div class="hp-lot-row-sub">
+                    <span>bought {money2(l.basis_per_share)} · {l.acquired}</span>
+                    <b class={pl() >= 0 ? "holdings-pos" : "holdings-neg"}>
+                      {money(pl())} ({plPct() >= 0 ? "+" : ""}{pct(plPct(), 1)})
+                    </b>
+                  </div>
+                </div>
+                <Show when={dialogFor("sellCall", l.id)} keyed>{(d) => <SellCallDialog d={d} />}</Show>
+                </div>
+              );
+            }}
+          </For>
+          <button type="button" class="btn-ghost hp-cash-edit" onClick={() => setDialog({ type: "addLot" })}>+ New lot</button>
+        </div>
+      </aside>
+      <div class="hp-list">
+        <div class="hp-toolbar-row">
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>+ Sell put</button>
+          <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>+ Sell call</button>
+          <button type="button" class="btn holdings-refresh" onClick={refreshMarks}>⟳<span class="holdings-refresh-label"> Refresh marks</span></button>
+        </div>
+        <Show when={dialog()?.type === "addPut"} keyed><AddPutDialog /></Show>
+        <Show when={dialog()?.type === "addCall"} keyed><AddCallDialog /></Show>
+        <div class="hp-list-row hp-list-head">
+          <span>position</span><span>P&L</span><span>pace</span><span>status</span><span />
+        </div>
+        <For each={merged()}>
+          {(x) => (
+            <div class="hp-slot">
+            <div class="hp-list-row" classList={{ "hp-row-met": x.v.pace_met }}>
+              <span class="hp-list-pos">
+                <span class="hp-kind" data-kind={x.p.kind}>{x.p.kind.toUpperCase()}</span>
+                <b>{x.p.symbol} {x.p.strike}{x.p.kind === "put" ? "P" : "C"}</b>
+                <i>×{x.p.contracts} · exp {x.p.expiry}</i>
+              </span>
+              <span class={x.v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
+                {x.v.pl_pct == null ? "—" : `${x.v.pl_pct >= 0 ? "+" : ""}${pct(x.v.pl_pct, 1)}`}
+              </span>
+              <span class="hp-list-pace">
+                <MiniBar v={x.v} />
+                <i>target {pct(x.v.target_pct)}</i>
+              </span>
+              <span class="hp-list-status">
+                <Show when={x.v.pace_met} fallback={<span class="chip normal">holding</span>}>
+                  <span class="chip high">buy back?</span>
+                </Show>
+                <Show when={x.p.kind === "call" && x.v.spot_pct_vs_strike != null && x.v.spot_pct_vs_strike > 0}>
+                  <span class="chip high">ITM — called away?</span>
+                </Show>
+              </span>
+              <button
+                type="button"
+                class="btn-ghost holdings-close-btn"
+                onClick={() => setDialog({ type: x.p.kind, pos: x.p })}
+              >
+                close…
+              </button>
+              {/* Full card stats — same grid the A/B cards use (inherits the
+                  production 2×2 mobile collapse). */}
+              <div class="holdings-card-stats hp-list-stats">
+                <div><span>sold at</span><b>{money2(x.p.premium)}</b></div>
+                <div>
+                  <span>now (mid)</span>
+                  <b>{x.p.mark == null ? "—" : x.p.mark.mid.toFixed(2)}</b>
+                  <i>{x.p.mark == null ? "unpriced" : ageText(x.p.mark.as_of)}</i>
+                </div>
+                <div>
+                  <span>spot</span>
+                  <Show when={x.p.mark?.underlying_price != null} fallback={<b>—</b>}>
+                    <b>{x.p.mark.underlying_price.toFixed(2)}</b>
+                    <i
+                      class={
+                        (x.p.kind === "call"
+                          ? x.v.spot_pct_vs_strike > 0
+                          : x.v.spot_pct_vs_strike < 0)
+                          ? "holdings-neg"
+                          : "holdings-pos"
+                      }
+                    >
+                      {x.v.spot_pct_vs_strike == null
+                        ? ""
+                        : `${x.v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(x.v.spot_pct_vs_strike, 1)} vs strike`}
+                    </i>
+                  </Show>
+                </div>
+                <div>
+                  <span>close captures</span>
+                  <b class={x.v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
+                    {x.v.pl_dollars == null ? "—" : money2(x.v.pl_dollars)}
+                  </b>
+                </div>
+              </div>
+            </div>
+            <Show when={dialogFor(x.p.kind, x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
+            </div>
+          )}
+        </For>
+      </div>
+    </div>
+  );
+}
+
+/* ── floating switcher ── */
+
+const VARIANTS = [
+  { id: "A", name: "stacked sections", Comp: VariantSections },
+  { id: "B", name: "tabs", Comp: VariantTabs },
+  { id: "C", name: "wheel rail", Comp: VariantWheel },
+];
+
+function ProtoSwitcher(props) {
+  const setVariant = (id) => {
+    props.setVariant(id);
+    const url = new URL(window.location);
+    url.searchParams.set("variant", id);
+    if (window.location.protocol !== "file:") history.replaceState(null, "", url);
+  };
+  const cycle = (dir) => {
+    const i = VARIANTS.findIndex((v) => v.id === props.variant());
+    setVariant(VARIANTS[(i + dir + VARIANTS.length) % VARIANTS.length].id);
+  };
+  onMount(() => {
+    const onKey = (e) => {
+      const t = e.target;
+      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
+      if (e.key === "ArrowLeft") cycle(-1);
+      if (e.key === "ArrowRight") cycle(1);
+    };
+    window.addEventListener("keydown", onKey);
+    onCleanup(() => window.removeEventListener("keydown", onKey));
+  });
+  return (
+    <div class="hp-switcher" aria-label="prototype variant switcher">
+      <span class="hp-switcher-tag">PROTOTYPE</span>
+      <button type="button" onClick={() => cycle(-1)} aria-label="previous variant">←</button>
+      <span class="hp-switcher-label">
+        {props.variant()} ({VARIANTS.find((v) => v.id === props.variant())?.name})
+      </span>
+      <button type="button" onClick={() => cycle(1)} aria-label="next variant">→</button>
+    </div>
+  );
+}
+
+const PROTO_CSS = `
+.hp-scroll{overflow:auto;flex:1 1 auto;min-height:0}
+.hp-cash{display:flex;gap:1.25rem;align-items:baseline;flex-wrap:wrap;background:var(--panel);
+  border:1px solid var(--border);border-radius:10px;padding:.6rem .9rem;margin-bottom:.6rem}
+.hp-cash span{display:block;font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.04em}
+.hp-cash b{font-size:1rem}
+.hp-cash-free b{color:var(--ok,#5fd08a)}
+.hp-cash-edit{margin-left:auto;font-size:.75rem}
+.hp-cash-editor{margin-left:auto;display:flex;gap:.35rem;align-items:center}
+.hp-cash-editor input{width:9rem;font:inherit;padding:.25rem .45rem;border:1px solid var(--border);
+  border-radius:6px;background:var(--panel);color:inherit}
+.hp-section-head{margin:1.1rem 0 .5rem;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;opacity:.85;
+  display:flex;align-items:center;gap:.5rem}
+.hp-count{display:inline-block;min-width:1.3rem;text-align:center;background:rgba(127,127,127,.18);
+  border-radius:99px;font-size:.72rem;padding:.05rem .4rem}
+.hp-section-add{font-size:.72rem}
+.hp-toolbar-row{display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem}
+.hp-hint{font-size:.8rem;opacity:.6;padding:.4rem 0}
+.hp-seg{display:flex;gap:.25rem;margin-bottom:.9rem;background:rgba(127,127,127,.12);
+  border-radius:10px;padding:.25rem;width:max-content}
+.hp-seg-btn{border:0;background:transparent;color:inherit;padding:.35rem .8rem;border-radius:8px;
+  cursor:pointer;font-size:.85rem}
+.hp-seg-btn.active{background:rgba(127,127,127,.25);font-weight:600}
+.hp-cash-big{background:var(--panel);border:1px solid var(--border);
+  border-radius:10px;padding:1rem 1.1rem;max-width:26rem;margin-bottom:.8rem}
+.hp-cash-free-line span{font-size:.7rem;opacity:.6;text-transform:uppercase}
+.hp-cash-free-line b{display:block;font-size:2rem;color:var(--ok,#5fd08a)}
+.hp-cash-row{display:flex;justify-content:space-between;gap:1rem;padding:.3rem 0;font-size:.85rem;
+  border-top:1px solid var(--border)}
+.hp-cash-edit-big{margin-top:.7rem}
+.hp-wheel{display:grid;grid-template-columns:16rem 1fr;gap:1.1rem;align-items:start}
+@media (max-width:900px){.hp-wheel{grid-template-columns:1fr}.hp-wheel .hp-rail{position:static}}
+.hp-rail{display:flex;flex-direction:column;gap:.7rem;position:sticky;top:0}
+.hp-rail-block{background:var(--panel);border:1px solid var(--border);
+  border-radius:10px;padding:.7rem .9rem}
+.hp-rail-label{font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem}
+.hp-rail-big{font-size:1.6rem;font-weight:700;color:var(--ok,#5fd08a)}
+.hp-rail-sub{font-size:.72rem;opacity:.6;margin-top:.15rem}
+.hp-rail-row{display:flex;justify-content:space-between;gap:.6rem;padding:.22rem 0;font-size:.82rem}
+.hp-lot-row{padding:.28rem 0;border-bottom:1px solid var(--border)}
+.hp-lot-row-top{display:flex;justify-content:space-between;gap:.6rem;font-size:.85rem}
+.hp-lot-row-top b{font-variant-numeric:tabular-nums}
+.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.6rem;font-size:.72rem;opacity:.78;margin-top:.1rem}
+.hp-lot-row-sub b{font-variant-numeric:tabular-nums}
+.hp-list{display:flex;flex-direction:column;gap:.35rem}
+.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5rem minmax(9rem,1fr) 8rem auto;
+  gap:.8rem;align-items:center;background:var(--panel);border:1px solid var(--border);
+  border-radius:10px;padding:.55rem .8rem}
+.hp-list-row.hp-row-met{border-color:var(--ok,#5fd08a)}
+.hp-list-head{background:transparent;border:0;padding:.1rem .8rem;font-size:.68rem;opacity:.55;
+  text-transform:uppercase;letter-spacing:.05em}
+.hp-list-pos{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}
+.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.72rem;opacity:.6}
+.hp-kind{font-size:.6rem;font-weight:700;letter-spacing:.06em;border-radius:5px;padding:.1rem .35rem}
+.hp-kind[data-kind="put"]{background:rgba(96,165,250,.18);color:#7fb5f5}
+.hp-kind[data-kind="call"]{background:rgba(251,191,36,.16);color:#e8b84a}
+.hp-list-pace .holdings-bar{min-width:7rem}
+.hp-slot{display:flex;flex-direction:column;gap:.45rem;min-width:0}
+.hp-list-status{display:flex;flex-direction:column;gap:.25rem;align-items:flex-start}
+.hp-list-stats{grid-column:1/-1;margin-top:.15rem}
+.hp-dialog-note{font-size:.72rem;opacity:.65;margin-top:.5rem;border-top:1px solid var(--border);padding-top:.4rem}
+.hp-switcher{position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:60;
+  display:flex;gap:.4rem;align-items:center;background:#0b0d12;color:#eef2f8;border:1px solid #2a3140;
+  border-radius:99px;padding:.35rem .6rem;box-shadow:0 6px 24px rgba(0,0,0,.5);font-size:.85rem}
+.hp-switcher button{border:0;background:rgba(255,255,255,.08);color:inherit;border-radius:99px;
+  width:1.7rem;height:1.7rem;cursor:pointer;font-size:.9rem}
+.hp-switcher-label{min-width:11rem;text-align:center}
+.hp-switcher-tag{font-size:.58rem;font-weight:800;letter-spacing:.12em;color:#e8b84a;
+  border:1px solid #e8b84a;border-radius:5px;padding:.05rem .3rem;margin-left:.2rem}
+@media (max-width:720px){
+  .hp-list-row.hp-list-head{display:none}
+  /* list-first stacking for the wheel lives in the 900px rule above */
+  .hp-list-row{display:flex;flex-direction:column;align-items:stretch;gap:.45rem}
+  .hp-list-pos{justify-content:space-between}
+  .hp-list-pace{display:flex;flex-direction:column;gap:.15rem}
+  .hp-list-status{flex-direction:row;flex-wrap:wrap}
+  .hp-list-row .holdings-close-btn{align-self:flex-end}
+  .hp-rail{position:static}
+  .hp-seg{overflow-x:auto;max-width:100%}
+  .hp-cash{gap:.75rem}
+  .hp-cash-editor{margin-left:0}
+  .hp-cash-editor input{width:7rem}
+  .hp-switcher-label{min-width:8rem;font-size:.78rem}
+}
+`;
+
+/* ── root: flash + dialogs + active variant + switcher ── */
+
+export default function ProtoRoot() {
+  const initial =
+    new URLSearchParams(window.location.search).get("variant") ?? "A";
+  const [variant, setVariant] = createSignal(
+    VARIANTS.some((v) => v.id === initial) ? initial : "A"
+  );
+  const Active = () => VARIANTS.find((v) => v.id === variant())?.Comp ?? VariantSections;
+  return (
+    <>
+      <style>{PROTO_CSS}</style>
+      <Show when={flashMsg()}>
+        <div class="holdings-notice">{flashMsg()}</div>
+      </Show>
+      {/* Dynamic, not <Active />: a plain component reference is resolved
+          once in Solid and never re-renders on variant changes. Dialogs
+          render inline under the position that opened them — see
+          dialogFor()/ClosePanel() in each variant. */}
+      <Dynamic component={Active()} />
+      <ProtoSwitcher variant={variant} setVariant={setVariant} />
+    </>
+  );
+}
diff --git a/crates/webapp/frontend/src/smoke-entry.jsx b/crates/webapp/frontend/src/smoke-entry.jsx
index 9f1b784..a70adc2 100644
--- a/crates/webapp/frontend/src/smoke-entry.jsx
+++ b/crates/webapp/frontend/src/smoke-entry.jsx
@@ -209,7 +209,7 @@ scoring.reset();
 await tick();
 ok("reset restores production view", qa("#root " + rowsSel).length === 1);
 
-// ── holdings panel (2026-09-11-holdings, variant B) ──
+// ── holdings panel (2026-09-17-wheel-holdings, variant C) ──
 // Mount against a mocked /api/holdings (server owns the pace math — the
 // panel renders the view verbatim), then drive add + outcome flows through
 // captured fetch calls.
@@ -248,6 +248,11 @@ ok("reset restores production view", qa("#root " + rowsSel).length === 1);
       return jsonRes({
         schema_version: 1,
         positions: didAdd ? [POSITION, POSITION_VIEWLESS] : [POSITION],
+        calls: [],
+        lots: [],
+        cash: null,
+        cash_reserved: 35000,
+        cash_free: null,
       });
     }
     if (path === "/api/holdings" && method === "POST") return jsonRes({ position: POSITION_VIEWLESS });
@@ -281,20 +286,20 @@ ok("reset restores production view", qa("#root " + rowsSel).length === 1);
   render(() => <HP />, div);
   await tick();
 
-  ok("holdings card renders title with contract count", (q("#holdings-root")?.textContent ?? "").includes("GOOG 350P ×1"));
-  ok("holdings card shows the premium anchor", (q("#holdings-root")?.textContent ?? "").includes("$1.00"));
+  ok("holdings row renders title with contract count", (q("#holdings-root")?.textContent ?? "").includes("GOOG 350P ×1"));
+  ok("holdings row shows the premium anchor", (q("#holdings-root")?.textContent ?? "").includes("$1.00"));
   ok("pace bar tick sits at the server target", (q(".holdings-bar-mark")?.style?.left ?? "") === "40%");
-  ok("pace-met card carries the buy-back chip", (q("#holdings-root")?.textContent ?? "").includes("buy back?"));
+  ok("pace-met row carries the buy-back chip", (q("#holdings-root")?.textContent ?? "").includes("buy back?"));
   ok("mark age is visible", (q("#holdings-root")?.textContent ?? "").includes("ago"));
 
   // R6: SPOT cell — price, % vs strike, danger color when below the strike.
   const spotCell = qa(".holdings-card-stats div").find((d) => d.querySelector("span")?.textContent === "spot");
   ok("spot cell renders price and % vs strike", !!spotCell && spotCell.textContent.includes("331.20") && spotCell.textContent.includes("-5.4% vs strike"));
   ok("spot below strike is danger-colored", !!spotCell?.querySelector("i.holdings-neg"));
-  ok("stat strip has four cells", qa(".holdings-card .holdings-card-stats > div").length >= 4);
+  ok("stat strip has four cells", qa(".hp-list-stats > div").length >= 4);
 
   // Add form: decimals survive the round trip to the POST body.
-  qa(".holdings-toolbar button").find((b) => b.textContent.includes("New position"))?.click();
+  qa(".hp-toolbar-row button").find((b) => b.textContent.includes("Sell put"))?.click();
   await tick();
   const setVal = (el, v) => {
     el.value = v;
@@ -304,14 +309,14 @@ ok("reset restores production view", qa("#root " + rowsSel).length === 1);
   setVal(rootEl.querySelector('.holdings-add input[placeholder="SYMBOL"]'), "AMD");
   setVal(rootEl.querySelector('.holdings-add input[placeholder="e.g. 350.00"]'), "417.50");
   setVal(rootEl.querySelector('.holdings-add input[placeholder="e.g. 1.00"]'), "3.75");
-  qa(".holdings-add button").find((b) => b.textContent === "Add")?.click();
+  qa(".holdings-add button").find((b) => b.textContent === "Sell put")?.click();
   await tick();
   const addCall = calls.find(([, m, b]) => m === "POST" && b?.symbol === "AMD");
   ok("add POST carries the typed decimals", !!addCall && addCall[2].strike === 417.5 && addCall[2].premium === 3.75);
-  ok("unpriced card renders the empty-mark state", (q("#holdings-root")?.textContent ?? "").includes("unpriced"));
+  ok("unpriced row renders the empty-mark state", (q("#holdings-root")?.textContent ?? "").includes("unpriced"));
 
-  // Outcome flow: open the dialog on the priced card, confirm bought-back.
-  qa(".holdings-card")
+  // Outcome flow: open the dialog on the priced row, confirm bought-back.
+  qa(".hp-list-row")
     .find((c) => c.textContent.includes("GOOG"))
     ?.querySelector(".holdings-close-btn")
     ?.click();
@@ -330,30 +335,199 @@ ok("reset restores production view", qa("#root " + rowsSel).length === 1);
   );
 
   // Reference-example values, verbatim from the design doc scenario.
-  const googCard = qa(".holdings-card").find((c) => c.textContent.includes("GOOG"));
-  ok("reference card shows +50.0%", !!googCard && googCard.textContent.includes("+50.0%"));
-  ok("reference card shows target 40%", !!googCard && googCard.textContent.includes("target 40%"));
-  ok("reference card shows 2/5 working days", !!googCard && googCard.textContent.includes("2/5 wd"));
-  ok("reference card shows NOW mid 0.50", !!googCard && googCard.textContent.includes("0.50"));
-  ok("reference card shows CLOSE CAPTURES $50.00", !!googCard && googCard.textContent.includes("$50.00"));
+  const googRow = qa(".hp-list-row").find((c) => c.textContent.includes("GOOG"));
+  ok("reference row shows +50.0%", !!googRow && googRow.textContent.includes("+50.0%"));
+  ok("reference row shows target 40%", !!googRow && googRow.textContent.includes("target 40%"));
+  ok("reference row shows 2/5 working days", !!googRow && googRow.textContent.includes("2/5 wd"));
+  ok("reference row shows NOW mid 0.50", !!googRow && googRow.textContent.includes("0.50"));
+  ok("reference row shows CLOSE CAPTURES $50.00", !!googRow && googRow.textContent.includes("$50.00"));
 
   // Empty submit is blocked (no numbers ⇒ no POST, form stays open).
   const postsBefore = calls.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
-  qa(".holdings-toolbar button").find((b) => b.textContent.includes("New position"))?.click();
+  qa(".hp-toolbar-row button").find((b) => b.textContent.includes("Sell put"))?.click();
   await tick();
-  qa(".holdings-add button").find((b) => b.textContent === "Add")?.click();
+  qa(".holdings-add button").find((b) => b.textContent === "Sell put")?.click();
   await tick();
   const postsAfter = calls.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
   ok("empty numeric fields block submit", postsAfter === postsBefore && !!q(".holdings-add"));
 
   // Refresh marks: POST goes out, the notice confirms, the ledger refetches.
-  qa(".holdings-toolbar button").find((b) => b.textContent.includes("Refresh marks"))?.click();
+  qa(".hp-toolbar-row button").find((b) => b.textContent.includes("Refresh marks"))?.click();
   await tick();
   ok(
     "refresh POSTs and the notice confirms",
     calls.some(([p, m]) => p === "/api/holdings/refresh" && m === "POST") &&
       (q(".holdings-notice")?.textContent ?? "").includes("Marks refreshed")
   );
+
+  // ── variant-C additions (R11): rail cash strip, kind chips + stats line,
+  // ITM chip, inline close panel placement, assignment + sell-call
+  // prefills, form validation before submit. Fresh mount with a full-wheel
+  // fixture (put + ITM call + lot); cash starts unset to exercise the
+  // first-set flow.
+  {
+    const CALL_ITM = {
+      id: "c1", symbol: "GOOG", strike: 360, premium: 1.2, contracts: 2,
+      sold: "2026-09-04", expiry: "2026-09-11",
+      mark: { mid: 0.3, as_of: "2026-09-08T19:00:00Z", underlying_price: 370.0 },
+      view: {
+        pl_dollars: 180.0, pl_pct: 0.75, pace_per_day_dollars: 90.0,
+        pace_per_day_pct: 0.375, days_elapsed: 2, days_total: 5,
+        target_pct: 0.4, pace_met: true, spot_pct_vs_strike: (370 - 360) / 360,
+      },
+    };
+    const LOT = {
+      id: "l1", symbol: "GOOG", shares: 200, basis_per_share: 349.0,
+      acquired: "2026-09-08", mark: { spot: 370.0, as_of: "2026-09-08T19:00:00Z" },
+      view: {
+        value: 74000.0, pl_dollars: 4200.0, pl_pct: 4200 / 69800,
+        capacity: 2, covered: 2, spot: 370.0,
+        spot_as_of: "2026-09-08T19:00:00Z", age_days: 0,
+      },
+    };
+    let cashState = null; // document cash: null until first PATCH
+    const calls2 = [];
+    globalThis.fetch = async (path, opts = {}) => {
+      const method = opts.method ?? "GET";
+      calls2.push([String(path), method, opts.body ? JSON.parse(opts.body) : null]);
+      if (path === "/api/holdings" && method === "GET") {
+        return jsonRes({
+          schema_version: 1,
+          positions: [POSITION],
+          calls: [CALL_ITM],
+          lots: [LOT],
+          cash: cashState,
+          cash_reserved: 70000,
+          cash_free: cashState == null ? null : cashState - 70000,
+        });
+      }
+      if (path === "/api/holdings/cash" && method === "PATCH") {
+        cashState = JSON.parse(opts.body).cash;
+        return jsonRes({ cash: cashState, cash_reserved: 70000, cash_free: cashState - 70000 });
+      }
+      if (path === "/api/holdings" && method === "POST") return jsonRes({ lot: LOT });
+      return new Response("not found", { status: 404 });
+    };
+    const div2 = document.createElement("div");
+    div2.id = "holdings-root-2";
+    document.body.appendChild(div2);
+    render(() => <HP />, div2);
+    await tick();
+
+    // Rail: reserved derives even with cash unset; free renders as "—"
+    // with a "set cash" affordance until the first PATCH.
+    const rail0 = q("#holdings-root-2 .hp-rail")?.textContent ?? "";
+    ok("rail renders reserved while cash is unset", rail0.includes("$70,000"));
+    ok("rail free is an honest — while cash is unset", rail0.includes("—"));
+    ok("rail offers the set-cash affordance", (q("#holdings-root-2 .hp-cash-edit")?.textContent ?? "") === "set cash");
+    q("#holdings-root-2 .hp-cash-edit").click();
+    await tick();
+    setVal(q("#holdings-root-2 .hp-cash-editor input"), "150000");
+    qa("#holdings-root-2 .hp-cash-editor button").find((b) => b.textContent === "save")?.click();
+    await tick();
+    ok(
+      "cash edit PATCHes and the strip re-renders from the response",
+      calls2.some(([p, m]) => m === "PATCH" && p === "/api/holdings/cash") &&
+        (q("#holdings-root-2 .hp-rail")?.textContent ?? "").includes("$80,000") &&
+        (q("#holdings-root-2 .hp-rail")?.textContent ?? "").includes("$150,000")
+    );
+
+    // Merged list: kind chips + full stats line; the ITM call carries the
+    // called-away chip; the lot row reports covered 2/2.
+    const kinds = qa("#holdings-root-2 .hp-kind").map((k) => k.textContent.trim()).sort();
+    ok("merged rows carry kind chips", kinds.join(",") === "CALL,PUT");
+    const itmRow = qa("#holdings-root-2 .hp-list-row").find((r) => r.textContent.includes("360C"));
+    ok("ITM call shows the called-away chip", !!itmRow && itmRow.textContent.includes("ITM — called away?"));
+    const spotDiv = qa("#holdings-root-2 .hp-list-stats div").find((d) => d.querySelector("span")?.textContent === "spot");
+    ok("ITM vs-strike figure is danger-colored", !!spotDiv?.querySelector("i.holdings-neg") && spotDiv.textContent.includes("+2.8% vs strike"));
+    ok("lot rail row reports covered 2/2", (q("#holdings-root-2 .hp-rail")?.textContent ?? "").includes("covered 2/2"));
+
+    // Inline close panel: opens directly beneath the clicked position and
+    // is the ONLY panel in the DOM.
+    const putSlot = qa("#holdings-root-2 .hp-slot").find((s) => s.textContent.includes("350P"));
+    putSlot.querySelector(".holdings-close-btn").click();
+    await tick();
+    ok("close panel renders inside the clicked position's slot", !!putSlot.querySelector(".holdings-outcome"));
+    ok("only one panel exists in the DOM", qa("#holdings-root-2 .holdings-outcome").length === 1);
+
+    // Assignment: choose assigned + price → the prefilled lot form appears
+    // in the SAME slot (shares = contracts×100, basis = strike − premium);
+    // recording POSTs kind:"lot" with assigned_from.
+    const radios = qa(`${"#holdings-root-2"} .holdings-outcome input[type="radio"]`);
+    radios.find((r) => r.nextSibling?.textContent?.includes("assigned"))?.click();
+    await tick();
+    setVal(q(`${"#holdings-root-2"} .holdings-outcome input[inputmode="decimal"]`), "340");
+    qa("#holdings-root-2 .holdings-outcome button").find((b) => b.textContent === "Confirm")?.click();
+    await tick();
+    const lotForm = putSlot.querySelector(".holdings-outcome");
+    ok("assigned flow reveals the prefilled lot form under the put", !!lotForm && lotForm.textContent.includes("Record assigned shares"));
+    const sharesVal = lotForm?.querySelector('input[inputmode="numeric"]')?.value;
+    const basisVal = lotForm?.querySelector('input[inputmode="decimal"]')?.value;
+    ok("prefill pins shares = contracts×100 and basis = strike − premium", sharesVal === "100" && Number(basisVal) === 349);
+    lotForm.querySelector('button[type="submit"]').click();
+    await tick();
+    const assignPost = calls2.find(([, m, b]) => m === "POST" && b?.assigned_from != null);
+    ok(
+      "recording POSTs kind lot with assigned_from",
+      !!assignPost && assignPost[2].kind === "lot" && assignPost[2].assigned_from === "h1" &&
+        assignPost[2].shares === 100 && assignPost[2].basis_per_share === 349
+    );
+
+    // Lot-anchored sell call: contracts prefilled floor(200/100), the free
+    // Sell call form blocks an empty submit.
+    qa("#holdings-root-2 .hp-rail button")
+      .find((b) => b.textContent.includes("sell call…"))
+      ?.click();
+    await tick();
+    ok(
+      "sell-call prefill is floor(shares/100)",
+      q("#holdings-root-2 .hp-rail .holdings-outcome input[inputmode='numeric']")?.value === "2"
+    );
+    const postsBefore2 = calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
+    qa("#holdings-root-2 .hp-rail .holdings-outcome button")
+      .find((b) => b.textContent === "Sell call")
+      ?.click();
+    await tick();
+    ok(
+      "sell-call form validates before submit",
+      calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length === postsBefore2 &&
+        !!q("#holdings-root-2 .hp-rail .holdings-outcome")
+    );
+    qa("#holdings-root-2 .hp-rail .holdings-outcome button")
+      .find((b) => b.textContent === "Cancel")
+      ?.click();
+    await tick();
+    const sellCallForm = qa("#holdings-root-2 .hp-rail button")
+      .find((b) => b.textContent.includes("sell call…"));
+    sellCallForm?.click();
+    await tick();
+    setVal(q("#holdings-root-2 .hp-rail .holdings-outcome input[placeholder='e.g. 360.00']"), "380");
+    setVal(q("#holdings-root-2 .hp-rail .holdings-outcome input[placeholder='e.g. 1.20']"), "1.50");
+    qa("#holdings-root-2 .hp-rail .holdings-outcome button")
+      .find((b) => b.textContent === "Sell call")
+      ?.click();
+    await tick();
+    const sellPost = calls2.find(([, m, b]) => m === "POST" && b?.kind === "call");
+    ok(
+      "valid sell call submits kind call from the lot",
+      !!sellPost && sellPost[2].symbol === "GOOG" && sellPost[2].contracts === 2 && sellPost[2].strike === 380
+    );
+
+    // Free-field Sell call form (toolbar): empty submit is blocked.
+    const postsBefore3 = calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
+    qa("#holdings-root-2 .hp-toolbar-row button")
+      .find((b) => b.textContent.includes("Sell call"))
+      ?.click();
+    await tick();
+    qa("#holdings-root-2 .holdings-add button")
+      .find((b) => b.textContent === "Sell call")
+      ?.click();
+    await tick();
+    ok(
+      "free sell-call form validates before submit",
+      calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length === postsBefore3
+    );
+  }
 }
 
 // Tab-strip persistence: the Holdings tab lives in the same strip as the
diff --git a/crates/webapp/frontend/src/style.css b/crates/webapp/frontend/src/style.css
index 1b545b4..41409fa 100644
--- a/crates/webapp/frontend/src/style.css
+++ b/crates/webapp/frontend/src/style.css
@@ -1334,3 +1334,131 @@ details.adjust .hint-custom { color: var(--accent); }
   .holdings-add input { max-width: none; width: 100%; }
   .holdings-add .btn, .holdings-add .btn-primary { grid-column: 1 / -1; }
 }
+
+/* ── Wheel holdings (2026-09-17-wheel-holdings, variant C "wheel rail") ─
+   Sticky rail (cash strip, wheel stats, lot rows) beside one merged
+   urgency list; dialogs anchor inline under the position that opened
+   them. Below 900px the rail stacks above the list (user decision). */
+.hp-wheel {
+  display: grid;
+  grid-template-columns: 16rem 1fr;
+  gap: 1.1rem;
+  align-items: start;
+}
+.hp-rail { display: flex; flex-direction: column; gap: 0.7rem; position: sticky; top: 0; }
+.hp-rail-block {
+  background: var(--panel);
+  border: 1px solid var(--border);
+  border-radius: 10px;
+  padding: 0.7rem 0.9rem;
+}
+.hp-rail-label {
+  font-size: 0.68rem;
+  opacity: 0.6;
+  text-transform: uppercase;
+  letter-spacing: 0.05em;
+  margin-bottom: 0.3rem;
+}
+.hp-rail-big { font-size: 1.6rem; font-weight: 700; color: var(--ok); }
+.hp-rail-sub { font-size: 0.72rem; opacity: 0.6; margin-top: 0.15rem; }
+.hp-rail-row {
+  display: flex;
+  justify-content: space-between;
+  gap: 0.6rem;
+  padding: 0.22rem 0;
+  font-size: 0.82rem;
+}
+.hp-lot-row { padding: 0.28rem 0; border-bottom: 1px solid var(--border); }
+.hp-lot-row-top { display: flex; justify-content: space-between; gap: 0.6rem; font-size: 0.85rem; }
+.hp-lot-row-top b { font-variant-numeric: tabular-nums; }
+.hp-lot-row-sub {
+  display: flex;
+  justify-content: space-between;
+  gap: 0.6rem;
+  font-size: 0.72rem;
+  opacity: 0.78;
+  margin-top: 0.1rem;
+}
+.hp-lot-row-sub b { font-variant-numeric: tabular-nums; }
+.hp-lot-row-meta {
+  display: flex;
+  justify-content: space-between;
+  gap: 0.6rem;
+  font-size: 0.68rem;
+  opacity: 0.55;
+  margin-top: 0.1rem;
+}
+.hp-lot-row-meta i { font-style: normal; }
+.hp-toolbar-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
+.hp-hint { font-size: 0.8rem; opacity: 0.6; padding: 0.4rem 0; }
+.hp-list { display: flex; flex-direction: column; gap: 0.35rem; }
+.hp-list-row {
+  display: grid;
+  grid-template-columns: minmax(14rem, 1.4fr) 5rem minmax(9rem, 1fr) 8rem auto;
+  gap: 0.8rem;
+  align-items: center;
+  background: var(--panel);
+  border: 1px solid var(--border);
+  border-radius: 10px;
+  padding: 0.55rem 0.8rem;
+}
+.hp-list-row.hp-row-met { border-color: var(--ok); }
+.hp-list-head {
+  background: transparent;
+  border: 0;
+  padding: 0.1rem 0.8rem;
+  font-size: 0.68rem;
+  opacity: 0.55;
+  text-transform: uppercase;
+  letter-spacing: 0.05em;
+}
+.hp-list-pos { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
+.hp-list-pos i,
+.hp-list-pace i { font-style: normal; font-size: 0.72rem; opacity: 0.6; }
+.hp-kind {
+  font-size: 0.6rem;
+  font-weight: 700;
+  letter-spacing: 0.06em;
+  border-radius: 5px;
+  padding: 0.1rem 0.35rem;
+}
+.hp-kind[data-kind="put"] { background: rgba(96, 165, 250, 0.18); color: #7fb5f5; }
+.hp-kind[data-kind="call"] { background: rgba(251, 191, 36, 0.16); color: #e8b84a; }
+.hp-list-pace .holdings-bar { min-width: 7rem; }
+.hp-slot { display: flex; flex-direction: column; gap: 0.45rem; min-width: 0; }
+.hp-list-status { display: flex; flex-direction: column; gap: 0.25rem; align-items: flex-start; }
+.hp-list-stats { grid-column: 1 / -1; margin-top: 0.15rem; }
+.hp-cash-edit { margin-left: auto; font-size: 0.75rem; }
+.hp-cash-editor { margin-left: auto; display: flex; gap: 0.35rem; align-items: center; }
+.hp-cash-editor input {
+  width: 9rem;
+  font: inherit;
+  padding: 0.25rem 0.45rem;
+  border: 1px solid var(--border);
+  border-radius: 6px;
+  background: var(--panel);
+  color: inherit;
+}
+.hp-dialog-note {
+  font-size: 0.72rem;
+  opacity: 0.65;
+  margin-top: 0.5rem;
+  border-top: 1px solid var(--border);
+  padding-top: 0.4rem;
+}
+@media (max-width: 900px) {
+  /* The rail stacks above the list (user decision); rows keep their
+     stacked layout below 720px. */
+  .hp-wheel { grid-template-columns: 1fr; }
+  .hp-rail { position: static; }
+}
+@media (max-width: 720px) {
+  .hp-list-row.hp-list-head { display: none; }
+  .hp-list-row { display: flex; flex-direction: column; align-items: stretch; gap: 0.45rem; }
+  .hp-list-pos { justify-content: space-between; }
+  .hp-list-pace { display: flex; flex-direction: column; gap: 0.15rem; }
+  .hp-list-status { flex-direction: row; flex-wrap: wrap; }
+  .hp-list-row .holdings-close-btn { align-self: flex-end; }
+  .hp-cash-editor { margin-left: 0; }
+  .hp-cash-editor input { width: 7rem; }
+}
diff --git a/crates/webapp/src/api.rs b/crates/webapp/src/api.rs
index b3005cb..020fb1e 100644
--- a/crates/webapp/src/api.rs
+++ b/crates/webapp/src/api.rs
@@ -82,6 +82,14 @@ pub fn build_router(state: AppState) -> axum::Router {
             "/api/holdings/refresh",
             axum::routing::post(crate::holdings::holdings_refresh),
         )
+        .route(
+            "/api/holdings/cash",
+            axum::routing::patch(crate::holdings::holdings_patch_cash),
+        )
+        .route(
+            "/api/holdings/called-away",
+            axum::routing::post(crate::holdings::holdings_called_away),
+        )
         .route(
             "/api/holdings/{id}",
             axum::routing::delete(crate::holdings::holdings_delete),
@@ -372,8 +380,13 @@ mod tests {
             result_path: path.clone(),
             holdings_dir: path.with_file_name("holdings"),
             mark_fetcher: Arc::new(
-                |_: &[crate::holdings::MarkRequest]| -> Vec<crate::holdings::MarkResult> {
-                    Vec::new()
+                |_: &[crate::holdings::MarkRequest],
+                 _: &[String]|
+                 -> crate::holdings::MarkBatch {
+                    crate::holdings::MarkBatch {
+                        marks: Vec::new(),
+                        spots: Default::default(),
+                    }
                 },
             ),
             shared: crate::run::SharedState::new(),
@@ -521,7 +534,7 @@ mod tests {
         let path = dir.path().join("last_run.json");
         let shared = crate::run::SharedState::new();
         shared.begin().expect("acquire");
-        let app = build_router(AppState { result_path: path, holdings_dir: PathBuf::from("holdings"), mark_fetcher: Arc::new(|_: &[crate::holdings::MarkRequest]| Vec::new()), shared, access: Default::default(), clock: crate::run::real_now });
+        let app = build_router(AppState { result_path: path, holdings_dir: PathBuf::from("holdings"), mark_fetcher: Arc::new(|_: &[crate::holdings::MarkRequest], _: &[String]| crate::holdings::MarkBatch { marks: Vec::new(), spots: Default::default() }), shared, access: Default::default(), clock: crate::run::real_now });
 
         let response = app
             .oneshot(axum::http::Request::builder().uri("/api/latest").body(Body::empty()).unwrap())
diff --git a/crates/webapp/src/auth.rs b/crates/webapp/src/auth.rs
index 6795d3c..adc8d66 100644
--- a/crates/webapp/src/auth.rs
+++ b/crates/webapp/src/auth.rs
@@ -372,8 +372,11 @@ mod tests {
                     result_path: std::path::PathBuf::from("/tmp/none.json"),
                     holdings_dir: std::path::PathBuf::from("/tmp/holdings"),
                     mark_fetcher: std::sync::Arc::new(
-                        |_: &[crate::holdings::MarkRequest]| {
-                            Vec::<crate::holdings::MarkResult>::new()
+                        |_: &[crate::holdings::MarkRequest], _: &[String]| {
+                            crate::holdings::MarkBatch {
+                                marks: Vec::new(),
+                                spots: Default::default(),
+                            }
                         },
                     ),
                     shared: crate::run::SharedState::new(),
diff --git a/crates/webapp/src/holdings.rs b/crates/webapp/src/holdings.rs
index 6ce6997..6a5dd6f 100644
--- a/crates/webapp/src/holdings.rs
+++ b/crates/webapp/src/holdings.rs
@@ -13,13 +13,16 @@ use std::sync::Arc;
 
 use chrono::NaiveDate;
 
-/// One open position handed to the mark fetcher.
+/// One open option position handed to the mark fetcher. `side` selects the
+/// chain side queried — puts and calls each query their own side (R5; the
+/// call side existed in the Tiger client but was never exercised here).
 #[derive(Debug, Clone)]
 pub struct MarkRequest {
     pub id: String,
     pub symbol: String,
     pub strike: f64,
     pub expiry: NaiveDate,
+    pub side: market_int_core::model::OptionChainSide,
 }
 
 /// Fetcher outcome per position: `Ok(Some(mid))` priced, `Ok(None)` = no
@@ -33,65 +36,86 @@ pub struct MarkResult {
     pub underlying: Option<f64>,
 }
 
+/// The fetcher's whole outcome: option marks by request id, plus the
+/// per-symbol underlying closes the same kline pass produced. Lots price
+/// from `spots` — chain queries are never issued for lot symbols (R5).
+#[derive(Debug)]
+pub struct MarkBatch {
+    pub marks: Vec<MarkResult>,
+    pub spots: std::collections::BTreeMap<String, f64>,
+}
+
 /// Seam (Runner precedent): production constructs ONE Tiger requester per
-/// refresh request and prices every position serially; tests script
-/// per-symbol outcomes with no network.
-pub type MarkFetcher = Arc<dyn Fn(&[MarkRequest]) -> Vec<MarkResult> + Send + Sync>;
+/// refresh request and prices every position serially; the second argument
+/// lists lot symbols so the same kline pass prices them into `spots`.
+/// Tests script per-symbol outcomes with no network.
+pub type MarkFetcher =
+    Arc<dyn Fn(&[MarkRequest], &[String]) -> MarkBatch + Send + Sync>;
 
 /// Production fetcher: one Tiger requester per refresh call, one underlying
-/// kline per unique symbol, then a degenerate `(strike, strike)` put-chain
-/// query per position (the `test-tiger` shape) — row mid already folds
-/// bid/ask with a latest-trade fallback (`calculate_mid_price` at parse
-/// time). OI minimum 0: we want *our* strike, not liquid ones. Blocking by
-/// design — the refresh handler parks it on `spawn_blocking`.
+/// kline per unique symbol across option AND lot symbols, then a
+/// degenerate `(strike, strike)` chain query per option request on its
+/// requested side (the `test-tiger` shape) — row mid already folds bid/ask
+/// with a latest-trade fallback (`calculate_mid_price` at parse time). OI
+/// minimum 0: we want *our* strike, not liquid ones. Blocking by design —
+/// the refresh handler parks it on `spawn_blocking`.
 pub fn live_fetcher() -> MarkFetcher {
-    Arc::new(move |requests: &[MarkRequest]| {
-        fetch_marks_blocking(requests.to_vec())
+    Arc::new(move |requests: &[MarkRequest], lot_symbols: &[String]| {
+        fetch_marks_blocking(requests.to_vec(), lot_symbols.to_vec())
     })
 }
 
-fn fetch_marks_blocking(requests: Vec<MarkRequest>) -> Vec<MarkResult> {
+fn fetch_marks_blocking(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> MarkBatch {
     let runtime = tokio::runtime::Builder::new_current_thread()
         .enable_all()
         .build();
     match runtime {
-        Ok(rt) => rt.block_on(fetch_marks(requests)),
-        Err(e) => requests
-            .into_iter()
-            .map(|r| MarkResult {
-                id: r.id,
-                mid: Err(format!("async runtime unavailable: {e}")),
-                underlying: None,
-            })
-            .collect(),
+        Ok(rt) => rt.block_on(fetch_marks(requests, lot_symbols)),
+        Err(e) => MarkBatch {
+            marks: requests
+                .into_iter()
+                .map(|r| MarkResult {
+                    id: r.id,
+                    mid: Err(format!("async runtime unavailable: {e}")),
+                    underlying: None,
+                })
+                .collect(),
+            spots: Default::default(),
+        },
     }
 }
 
-async fn fetch_marks(requests: Vec<MarkRequest>) -> Vec<MarkResult> {
+async fn fetch_marks(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> MarkBatch {
     use std::collections::BTreeSet;
 
     let Some(requester) =
         market_int_core::tiger::api_caller::Requester::new().await
     else {
-        return requests
-            .into_iter()
-            .map(|r| MarkResult {
-                id: r.id,
-                mid: Err(
-                    "tiger requester init failed (TIGER_ID/TIGER_RSA set?)"
-                        .to_string(),
-                ),
-                underlying: None,
-            })
-            .collect();
+        return MarkBatch {
+            marks: requests
+                .into_iter()
+                .map(|r| MarkResult {
+                    id: r.id,
+                    mid: Err(
+                        "tiger requester init failed (TIGER_ID/TIGER_RSA set?)"
+                            .to_string(),
+                    ),
+                    underlying: None,
+                })
+                .collect(),
+            spots: Default::default(),
+        };
     };
 
     // Underlying last close per unique symbol — the chain query needs it to
-    // apply its moneyness filter correctly (0.0 would mark every strike ITM).
+    // apply its moneyness filter correctly (0.0 would mark every strike
+    // ITM), and lot symbols price from the very same pass (R5: one quote
+    // per unique symbol, no extra API calls for lots).
     let mut underlyings: std::collections::HashMap<String, f64> =
         std::collections::HashMap::new();
-    let symbols: BTreeSet<String> =
+    let mut symbols: BTreeSet<String> =
         requests.iter().map(|r| r.symbol.clone()).collect();
+    symbols.extend(lot_symbols.iter().cloned());
     for symbol in &symbols {
         match requester
             .query_stock_quotes(&[symbol.as_str()], &chrono::Local::now(), 1, "day")
@@ -102,16 +126,22 @@ async fn fetch_marks(requests: Vec<MarkRequest>) -> Vec<MarkResult> {
                     underlyings.insert(symbol.clone(), last.close);
                 }
             }
-            // Leave the symbol out — its positions go stale below with a
-            // precise reason.
+            // Leave the symbol out — its positions/lots go stale below with
+            // a precise reason.
             Err(e) => log::warn!("holdings: underlying quote for {symbol} failed: {e}"),
         }
     }
 
-    let mut results = Vec::with_capacity(requests.len());
+    let spots: std::collections::BTreeMap<String, f64> = underlyings
+        .iter()
+        .filter(|(symbol, _)| lot_symbols.contains(symbol))
+        .map(|(symbol, &close)| (symbol.clone(), close))
+        .collect();
+
+    let mut marks = Vec::with_capacity(requests.len());
     for r in requests {
         let Some(&spot) = underlyings.get(&r.symbol) else {
-            results.push(MarkResult {
+            marks.push(MarkResult {
                 id: r.id,
                 mid: Err(format!("underlying quote for {} unavailable", r.symbol)),
                 underlying: None,
@@ -130,16 +160,17 @@ async fn fetch_marks(requests: Vec<MarkRequest>) -> Vec<MarkResult> {
             &r.symbol,
             r.strike,
             &expiry_ny,
+            &r.side,
             &underlyings,
         )
         .await;
-        results.push(MarkResult {
+        marks.push(MarkResult {
             id: r.id,
             mid,
             underlying: Some(spot),
         });
     }
-    results
+    MarkBatch { marks, spots }
 }
 
 // The chain query is async and must run on the same runtime as the kline
@@ -149,16 +180,16 @@ async fn chain_mid(
     symbol: &str,
     strike: f64,
     expiry_ny: &chrono::DateTime<chrono_tz::Tz>,
+    side: &market_int_core::model::OptionChainSide,
     underlyings: &std::collections::HashMap<String, f64>,
 ) -> Result<Option<f64>, String> {
-    use market_int_core::model::OptionChainSide;
     let rows = requester
         .query_option_chain(
             &[(symbol, (strike, strike))],
             underlyings,
             expiry_ny,
             0,
-            &OptionChainSide::Put,
+            side,
         )
         .await
         .map_err(|e| format!("chain query failed: {e}"))?;
@@ -176,10 +207,21 @@ async fn chain_mid(
 
 pub const LEDGER_SCHEMA_VERSION: u64 = 1;
 
-#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
+/// Per-user ledger document (R4): sibling arrays, never a tagged position
+/// enum. Additive `#[serde(default)]` fields only — pre-wheel documents
+/// (just `positions`) parse unchanged, schema version stays 1.
+#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
 pub struct HoldingsDocument {
     pub schema_version: u64,
     pub positions: Vec<market_int_core::holdings::Holding>,
+    #[serde(default)]
+    pub calls: Vec<market_int_core::holdings::CallHolding>,
+    #[serde(default)]
+    pub lots: Vec<market_int_core::holdings::ShareLot>,
+    /// Manual balance — never the Tiger account API. `None` until the user
+    /// sets it once.
+    #[serde(default)]
+    pub cash: Option<f64>,
 }
 
 impl Default for HoldingsDocument {
@@ -187,6 +229,9 @@ impl Default for HoldingsDocument {
         Self {
             schema_version: LEDGER_SCHEMA_VERSION,
             positions: Vec::new(),
+            calls: Vec::new(),
+            lots: Vec::new(),
+            cash: None,
         }
     }
 }
@@ -368,6 +413,57 @@ fn position_json(h: &Holding, today: chrono::NaiveDate) -> serde_json::Value {
     })
 }
 
+/// Calls render with the identical option shape (sibling arrays, same
+/// fields — R1).
+fn call_json(c: &market_int_core::holdings::CallHolding, today: chrono::NaiveDate) -> serde_json::Value {
+    let mark = c.mark.as_ref().map(|m| {
+        json!({
+            "mid": m.mid,
+            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
+            "underlying_price": m.underlying_price,
+        })
+    });
+    json!({
+        "id": c.id,
+        "symbol": c.symbol,
+        "strike": c.strike,
+        "expiry": c.expiry.to_string(),
+        "premium": c.premium,
+        "contracts": c.contracts,
+        "sold": c.sold.to_string(),
+        "mark": mark,
+        "view": c.view(today),
+    })
+}
+
+/// Covered-call contracts covering a lot's symbol — the covered count the
+/// lot view renders (R2: it derives from the calls array).
+fn covered_contracts(doc: &HoldingsDocument, symbol: &str) -> u32 {
+    doc.calls
+        .iter()
+        .filter(|c| c.symbol == symbol)
+        .map(|c| c.contracts)
+        .sum()
+}
+
+fn lot_json(l: &market_int_core::holdings::ShareLot, today: chrono::NaiveDate, covered: u32) -> serde_json::Value {
+    let mark = l.mark.as_ref().map(|m| {
+        json!({
+            "spot": m.spot,
+            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
+        })
+    });
+    json!({
+        "id": l.id,
+        "symbol": l.symbol,
+        "shares": l.shares,
+        "basis_per_share": l.basis_per_share,
+        "acquired": l.acquired.to_string(),
+        "mark": mark,
+        "view": l.view(today, covered),
+    })
+}
+
 fn ledger_json(doc: &HoldingsDocument, today: chrono::NaiveDate) -> serde_json::Value {
     json!({
         "schema_version": doc.schema_version,
@@ -376,6 +472,24 @@ fn ledger_json(doc: &HoldingsDocument, today: chrono::NaiveDate) -> serde_json::
             .iter()
             .map(|p| position_json(p, today))
             .collect::<Vec<_>>(),
+        "calls": doc
+            .calls
+            .iter()
+            .map(|c| call_json(c, today))
+            .collect::<Vec<_>>(),
+        "lots": doc
+            .lots
+            .iter()
+            .map(|l| lot_json(l, today, covered_contracts(doc, &l.symbol)))
+            .collect::<Vec<_>>(),
+        // The manual balance and its derived numbers (R3/R6): `cash` is
+        // null until first set — `cash_free` then stays null with it,
+        // while `cash_reserved` still derives from the open puts.
+        "cash": doc.cash,
+        "cash_reserved": market_int_core::holdings::reserved_cash(&doc.positions),
+        "cash_free": doc
+            .cash
+            .map(|c| market_int_core::holdings::free_cash(c, &doc.positions)),
     })
 }
 
@@ -405,11 +519,18 @@ pub(crate) async fn holdings_list(State(st): State<crate::api::AppState>, req: R
 }
 
 /// Longest ledger: every mutation rewrites the document and refresh fans out
-/// one chain query per position — a bound keeps both honest. A real book has
-/// handfuls of open puts.
+/// one chain query per option — a bound keeps both honest. A real book has
+/// handfuls of open positions.
 const MAX_POSITIONS_PER_LEDGER: usize = 100;
 
-/// `POST /api/holdings` — add a position to the caller's ledger.
+/// The entry count the cap bounds — all three arrays combined (R6).
+fn ledger_entry_count(doc: &HoldingsDocument) -> usize {
+    doc.positions.len() + doc.calls.len() + doc.lots.len()
+}
+
+/// `POST /api/holdings` — add to the caller's ledger. `kind` selects the
+/// array: `"put"` (the default — deployed clients never send it),
+/// `"call"`, or `"lot"` (R6).
 pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Request) -> Response {
     let uid = uid_of(&req);
     let bytes = match axum::body::to_bytes(req.into_body(), 16 * 1024).await {
@@ -421,6 +542,25 @@ pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Re
         Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
     };
 
+    match v.get("kind").and_then(|k| k.as_str()).unwrap_or("put") {
+        "put" | "call" => add_option_leg(st, uid, &v).await,
+        "lot" => add_lot(st, uid, &v).await,
+        other => error_response(
+            StatusCode::BAD_REQUEST,
+            &format!("unknown kind {other:?} (want put, call, or lot)"),
+        ),
+    }
+}
+
+/// The shared option-leg add: identical validation for puts and calls
+/// (one rule set, two arrays — R6). The kind only picks where the entry
+/// lands and the response key.
+async fn add_option_leg(
+    st: crate::api::AppState,
+    uid: String,
+    v: &serde_json::Value,
+) -> Response {
+    let kind = v.get("kind").and_then(|k| k.as_str()).unwrap_or("put");
     let symbol = v
         .get("symbol")
         .and_then(|s| s.as_str())
@@ -459,7 +599,8 @@ pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Re
 
     let holding = Holding {
         // Server-generated id: process sequence on top of the clock stamp
-        // (NEXT_SEQ precedent).
+        // (NEXT_SEQ precedent). Unique across ALL arrays — the id prefix
+        // and clock stamp are shared by every kind.
         id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_position_seq()),
         symbol,
         strike,
@@ -469,6 +610,7 @@ pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Re
         sold,
         mark: None,
     };
+    // One validation rule set serves both option kinds (R1 pinning).
     if let Err(reason) = holding.validate() {
         return error_response(StatusCode::BAD_REQUEST, &reason);
     }
@@ -482,13 +624,29 @@ pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Re
             )
         }
     };
-    if doc.positions.len() >= MAX_POSITIONS_PER_LEDGER {
+    if ledger_entry_count(&doc) >= MAX_POSITIONS_PER_LEDGER {
         return error_response(
             StatusCode::BAD_REQUEST,
             &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
         );
     }
-    doc.positions.push(holding.clone());
+    let body = if kind == "call" {
+        let call_h = market_int_core::holdings::CallHolding {
+            id: holding.id.clone(),
+            symbol: holding.symbol.clone(),
+            strike: holding.strike,
+            expiry: holding.expiry,
+            premium: holding.premium,
+            contracts: holding.contracts,
+            sold: holding.sold,
+            mark: None,
+        };
+        doc.calls.push(call_h.clone());
+        Json(json!({ "call": call_json(&call_h, today_et(st.clock)) }))
+    } else {
+        doc.positions.push(holding.clone());
+        Json(json!({ "position": position_json(&holding, today_et(st.clock)) }))
+    };
     if let Err(err) =
         write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await
     {
@@ -497,9 +655,97 @@ pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Re
             &format!("ledger write failed: {err}"),
         );
     }
+    (StatusCode::CREATED, body).into_response()
+}
+
+/// The lot add (R6): core owns structural validation; the handler owns the
+/// `acquired`-not-in-the-future rule, matching how `sold` is handled.
+async fn add_lot(st: crate::api::AppState, uid: String, v: &serde_json::Value) -> Response {
+    let symbol = v
+        .get("symbol")
+        .and_then(|s| s.as_str())
+        .unwrap_or_default()
+        .trim()
+        .to_uppercase();
+    let Some(shares_raw) = v.get("shares").and_then(|x| x.as_f64()) else {
+        return error_response(StatusCode::BAD_REQUEST, "missing shares");
+    };
+    if (shares_raw - shares_raw.trunc()).abs() > f64::EPSILON {
+        return error_response(StatusCode::BAD_REQUEST, "shares must be a whole number");
+    }
+    let Some(shares) = u32::try_from(shares_raw as i64).ok().filter(|s| *s > 0) else {
+        return error_response(StatusCode::BAD_REQUEST, "shares must be a positive integer");
+    };
+    let Some(basis_per_share) = v.get("basis_per_share").and_then(|x| x.as_f64()) else {
+        return error_response(StatusCode::BAD_REQUEST, "missing basis_per_share");
+    };
+    let Some(acquired_raw) = v.get("acquired").and_then(|x| x.as_str()) else {
+        return error_response(StatusCode::BAD_REQUEST, "missing acquired date");
+    };
+    let acquired = match parse_date(acquired_raw, "acquired") {
+        Ok(d) => d,
+        Err(resp) => return resp,
+    };
+    if acquired > today_et(st.clock) {
+        return error_response(StatusCode::BAD_REQUEST, "acquired date is in the future");
+    }
+
+    let lot = market_int_core::holdings::ShareLot {
+        id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_position_seq()),
+        symbol,
+        shares,
+        basis_per_share,
+        acquired,
+        mark: None,
+    };
+    if let Err(reason) = lot.validate() {
+        return error_response(StatusCode::BAD_REQUEST, &reason);
+    }
+
+    // R8: `assigned_from` makes this an assignment — the SAME
+    // read-modify-write records the lot AND removes the referenced put.
+    // Unknown id → 404 before any write, ledger byte-unchanged. No
+    // external calls happen inside this window.
+    let assigned_from = v
+        .get("assigned_from")
+        .and_then(|x| x.as_str())
+        .map(|s| s.to_string());
+
+    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
+        Ok(d) => d,
+        Err(err) => {
+            return error_response(
+                StatusCode::INTERNAL_SERVER_ERROR,
+                &format!("ledger read failed: {err}"),
+            )
+        }
+    };
+    if let Some(put_id) = &assigned_from {
+        let before = doc.positions.len();
+        doc.positions.retain(|p| p.id != *put_id);
+        if doc.positions.len() == before {
+            return error_response(
+                StatusCode::NOT_FOUND,
+                "no such position for assigned_from",
+            );
+        }
+    }
+    if ledger_entry_count(&doc) >= MAX_POSITIONS_PER_LEDGER {
+        return error_response(
+            StatusCode::BAD_REQUEST,
+            &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
+        );
+    }
+    doc.lots.push(lot.clone());
+    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
+        return error_response(
+            StatusCode::INTERNAL_SERVER_ERROR,
+            &format!("ledger write failed: {err}"),
+        );
+    }
     (
         StatusCode::CREATED,
-        Json(json!({ "position": position_json(&holding, today_et(st.clock)) })),
+        Json(json!({ "lot": lot_json(&lot, today_et(st.clock), 0) })),
     )
         .into_response()
 }
@@ -511,7 +757,9 @@ fn next_position_seq() -> u64 {
     NEXT.fetch_add(1, Ordering::Relaxed)
 }
 
-/// `DELETE /api/holdings/{id}` — the outcome-confirm removal.
+/// `DELETE /api/holdings/{id}` — the outcome-confirm removal. One route
+/// for every kind: positions, then calls, then lots (R6); an id in no
+/// array is a 404 with no write.
 pub(crate) async fn holdings_delete(
     State(st): State<crate::api::AppState>,
     AxPath(id): AxPath<String>,
@@ -527,9 +775,19 @@ pub(crate) async fn holdings_delete(
             )
         }
     };
-    let before = doc.positions.len();
-    doc.positions.retain(|p| p.id != id);
-    if doc.positions.len() == before {
+    let removed = if doc.positions.iter().any(|p| p.id == id) {
+        doc.positions.retain(|p| p.id != id);
+        true
+    } else if doc.calls.iter().any(|c| c.id == id) {
+        doc.calls.retain(|c| c.id != id);
+        true
+    } else if doc.lots.iter().any(|l| l.id == id) {
+        doc.lots.retain(|l| l.id != id);
+        true
+    } else {
+        false
+    };
+    if !removed {
         return error_response(StatusCode::NOT_FOUND, "no such position");
     }
     if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
@@ -541,12 +799,126 @@ pub(crate) async fn holdings_delete(
     Json(json!({ "removed": id })).into_response()
 }
 
-/// `POST /api/holdings/refresh` — mark every open position to market.
-/// One position's fetch failure never fails the request: it keeps its
-/// previous mark and is reported stale. The ledger is RE-READ after the
-/// fetch and marks merged by id — a position added while Tiger was being
-/// queried keeps its (mark-less) state instead of being clobbered by the
-/// pre-fetch snapshot.
+/// `PATCH /api/holdings/cash` — set the manual cash balance (R6, never the
+/// Tiger account API). The response carries the derived reserved/free so
+/// the UI strip re-renders from the response alone.
+pub(crate) async fn holdings_patch_cash(
+    State(st): State<crate::api::AppState>,
+    req: Request,
+) -> Response {
+    let uid = uid_of(&req);
+    let bytes = match axum::body::to_bytes(req.into_body(), 16 * 1024).await {
+        Ok(b) => b,
+        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
+    };
+    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
+        Ok(v) => v,
+        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
+    };
+    let Some(cash) = v.get("cash").and_then(|x| x.as_f64()) else {
+        return error_response(StatusCode::BAD_REQUEST, "missing cash");
+    };
+    if !cash.is_finite() || cash < 0.0 {
+        return error_response(StatusCode::BAD_REQUEST, "cash must be a number ≥ 0");
+    }
+
+    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
+        Ok(d) => d,
+        Err(err) => {
+            return error_response(
+                StatusCode::INTERNAL_SERVER_ERROR,
+                &format!("ledger read failed: {err}"),
+            )
+        }
+    };
+    doc.cash = Some(cash);
+    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
+        return error_response(
+            StatusCode::INTERNAL_SERVER_ERROR,
+            &format!("ledger write failed: {err}"),
+        );
+    }
+    Json(json!({
+        "cash": cash,
+        "cash_reserved": market_int_core::holdings::reserved_cash(&doc.positions),
+        "cash_free": market_int_core::holdings::free_cash(cash, &doc.positions),
+    }))
+    .into_response()
+}
+
+/// `POST /api/holdings/called-away` — the call was assigned: remove it and
+/// reduce the covering lot by `contracts × 100` shares (FIFO, core
+/// `apply_called_away`) in ONE rewrite (R9). No covering lot is a 200
+/// outcome, not an error — the shares were called away regardless, so the
+/// call still disappears; the response says `reduced: false` with a reason.
+pub(crate) async fn holdings_called_away(
+    State(st): State<crate::api::AppState>,
+    req: Request,
+) -> Response {
+    let uid = uid_of(&req);
+    let bytes = match axum::body::to_bytes(req.into_body(), 16 * 1024).await {
+        Ok(b) => b,
+        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
+    };
+    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
+        Ok(v) => v,
+        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
+    };
+    let Some(call_id) = v.get("call_id").and_then(|x| x.as_str()).map(|s| s.to_string()) else {
+        return error_response(StatusCode::BAD_REQUEST, "missing call_id");
+    };
+
+    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
+        Ok(d) => d,
+        Err(err) => {
+            return error_response(
+                StatusCode::INTERNAL_SERVER_ERROR,
+                &format!("ledger read failed: {err}"),
+            )
+        }
+    };
+    let Some(call_h) = doc.calls.iter().find(|c| c.id == call_id) else {
+        return error_response(StatusCode::NOT_FOUND, "no such call");
+    };
+    let (symbol, contracts) = (call_h.symbol.clone(), call_h.contracts);
+    let need = contracts as u64 * 100;
+
+    // One rewrite: the call goes and the FIFO reduction applies together.
+    let reduction =
+        market_int_core::holdings::apply_called_away(&doc.lots, &symbol, contracts);
+    doc.calls.retain(|c| c.id != call_id);
+    let (reduced, reason) = match reduction {
+        Some(lots) => {
+            doc.lots = lots;
+            (true, None)
+        }
+        None => (
+            false,
+            Some(format!(
+                "no lot of {symbol} covers {need} shares — shares were called away, but no held lot was reduced"
+            )),
+        ),
+    };
+    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
+        return error_response(
+            StatusCode::INTERNAL_SERVER_ERROR,
+            &format!("ledger write failed: {err}"),
+        );
+    }
+    let mut body = json!({ "called_away": true, "reduced": reduced });
+    if let Some(reason) = reason {
+        body["reason"] = json!(reason);
+    }
+    Json(body).into_response()
+}
+
+/// `POST /api/holdings/refresh` — mark every open option (puts AND calls,
+/// each queried on its own chain side) and price every lot from the same
+/// pass's spot map (R5). One entry's fetch failure never fails the
+/// request: it keeps its previous mark and is reported stale. The ledger
+/// is RE-READ after the fetch and marks merged by id — a position added
+/// while Tiger was being queried keeps its (mark-less) state instead of
+/// being clobbered by the pre-fetch snapshot.
 pub(crate) async fn holdings_refresh(
     State(st): State<crate::api::AppState>,
     req: Request,
@@ -562,7 +934,8 @@ pub(crate) async fn holdings_refresh(
         }
     };
 
-    let requests: Vec<MarkRequest> = doc
+    use market_int_core::model::OptionChainSide;
+    let mut requests: Vec<MarkRequest> = doc
         .positions
         .iter()
         .map(|p| MarkRequest {
@@ -570,15 +943,29 @@ pub(crate) async fn holdings_refresh(
             symbol: p.symbol.clone(),
             strike: p.strike,
             expiry: p.expiry,
+            side: OptionChainSide::Put,
         })
         .collect();
+    requests.extend(doc.calls.iter().map(|c| MarkRequest {
+        id: c.id.clone(),
+        symbol: c.symbol.clone(),
+        strike: c.strike,
+        expiry: c.expiry,
+        side: OptionChainSide::Call,
+    }));
+    // Lot symbols travel for the spot map — deduped, several lots can
+    // share one symbol and Tiger is quoted once for all of them.
+    let lot_symbols: Vec<String> = {
+        let mut symbols: std::collections::BTreeSet<String> =
+            doc.lots.iter().map(|l| l.symbol.clone()).collect();
+        symbols.into_iter().collect()
+    };
     // Tiger is a blocking HTTP client — park the whole batch off the async
     // workers (read_document_off_thread precedent).
     let fetcher = st.mark_fetcher.clone();
-    let results =
-        tokio::task::spawn_blocking(move || fetcher(&requests)).await.expect(
-            "spawn_blocking mark fetch",
-        );
+    let batch = tokio::task::spawn_blocking(move || fetcher(&requests, &lot_symbols))
+        .await
+        .expect("spawn_blocking mark fetch");
 
     let now = (st.clock)();
     let mut ok: Vec<String> = Vec::new();
@@ -592,35 +979,83 @@ pub(crate) async fn holdings_refresh(
             )
         }
     };
-    for result in results {
-        let Some(position) = doc.positions.iter_mut().find(|p| p.id == result.id) else {
-            // Added/removed while the fetch was in flight — its request was
-            // for a snapshot position; nothing to apply.
-            log::warn!("holdings: refresh result for unknown id {} dropped", result.id);
-            continue;
-        };
-        match result.mid {
-            Ok(Some(mid)) if mid > 0.0 => {
-                position.mark = Some(market_int_core::holdings::Mark {
-                    mid,
-                    as_of: now,
-                    underlying_price: result.underlying,
-                });
-                ok.push(result.id);
+
+    // Option marks merge by id across BOTH arrays — puts and calls carry
+    // the same Mark.
+    {
+        trait OptionMarkSlot {
+            fn opt_id(&self) -> &str;
+            fn mark_slot(&mut self) -> &mut Option<market_int_core::holdings::Mark>;
+        }
+        impl OptionMarkSlot for Holding {
+            fn opt_id(&self) -> &str {
+                &self.id
             }
-            Ok(Some(_)) => stale.push((
-                result.id,
-                "non-positive mid rejected".to_string(),
-            )),
-            Ok(None) => stale.push((
-                result.id,
-                "no chain data for that contract".to_string(),
-            )),
-            Err(reason) => {
-                log::warn!("holdings: mark fetch failed for {}: {reason}", result.id);
-                stale.push((result.id, reason));
+            fn mark_slot(&mut self) -> &mut Option<market_int_core::holdings::Mark> {
+                &mut self.mark
             }
         }
+        impl OptionMarkSlot for market_int_core::holdings::CallHolding {
+            fn opt_id(&self) -> &str {
+                &self.id
+            }
+            fn mark_slot(&mut self) -> &mut Option<market_int_core::holdings::Mark> {
+                &mut self.mark
+            }
+        }
+
+        let mut slots: Vec<&mut dyn OptionMarkSlot> = doc
+            .positions
+            .iter_mut()
+            .map(|h| h as &mut dyn OptionMarkSlot)
+            .chain(doc.calls.iter_mut().map(|c| c as &mut dyn OptionMarkSlot))
+            .collect();
+        for result in batch.marks {
+            let Some(slot) = slots.iter_mut().find(|s| s.opt_id() == result.id) else {
+                // Added/removed while the fetch was in flight — its request
+                // was for a snapshot entry; nothing to apply.
+                log::warn!("holdings: refresh result for unknown id {} dropped", result.id);
+                continue;
+            };
+            match result.mid {
+                Ok(Some(mid)) if mid > 0.0 => {
+                    *slot.mark_slot() = Some(market_int_core::holdings::Mark {
+                        mid,
+                        as_of: now,
+                        underlying_price: result.underlying,
+                    });
+                    ok.push(result.id);
+                }
+                Ok(Some(_)) => stale.push((
+                    result.id,
+                    "non-positive mid rejected".to_string(),
+                )),
+                Ok(None) => stale.push((
+                    result.id,
+                    "no chain data for that contract".to_string(),
+                )),
+                Err(reason) => {
+                    log::warn!("holdings: mark fetch failed for {}: {reason}", result.id);
+                    stale.push((result.id, reason));
+                }
+            }
+        }
+    }
+
+    // Lots price from the spot map — a lot whose symbol is missing from it
+    // (kline failed, say) is stale with a reason and keeps its previous
+    // SpotMark.
+    for lot in &mut doc.lots {
+        match batch.spots.get(&lot.symbol) {
+            Some(&spot) => {
+                lot.mark = Some(market_int_core::holdings::SpotMark { spot, as_of: now });
+                ok.push(lot.id.clone());
+            }
+            None => stale.push((
+                lot.id.clone(),
+                format!("no underlying quote for {}", lot.symbol),
+            )),
+        }
     }
 
     if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
@@ -629,22 +1064,20 @@ pub(crate) async fn holdings_refresh(
             &format!("ledger write failed: {err}"),
         );
     }
-    Json(json!({
-        "schema_version": doc.schema_version,
-        "positions": doc
-            .positions
-            .iter()
-            .map(|p| position_json(p, today_et(st.clock)))
-            .collect::<Vec<_>>(),
-        "refresh": {
-            "ok": ok,
-            "stale": stale
-                .into_iter()
-                .map(|(id, reason)| json!({"id": id, "reason": reason}))
-                .collect::<Vec<_>>(),
-        }
-    }))
-    .into_response()
+    let mut body = ledger_json(&doc, today_et(st.clock));
+    if let serde_json::Value::Object(map) = &mut body {
+        map.insert(
+            "refresh".to_string(),
+            json!({
+                "ok": ok,
+                "stale": stale
+                    .into_iter()
+                    .map(|(id, reason)| json!({"id": id, "reason": reason}))
+                    .collect::<Vec<_>>(),
+            }),
+        );
+    }
+    axum::Json(body).into_response()
 }
 
 #[cfg(test)]
@@ -718,6 +1151,74 @@ mod store_tests {
         assert_eq!(doc.positions[0].mark.as_ref().unwrap().underlying_price, None);
     }
 
+    /// R4: a pre-wheel document (only schema_version + positions) loads
+    /// unchanged — calls/lots default empty, cash defaults None, positions
+    /// round-trip intact. Schema version stays 1.
+    #[test]
+    fn old_put_only_ledger_loads_with_empty_defaults() {
+        let dir = tempfile::tempdir().unwrap();
+        std::fs::create_dir_all(dir.path()).unwrap();
+        std::fs::write(
+            dir.path().join("uid1.json"),
+            r#"{"schema_version":1,"positions":[{"id":"h1","symbol":"GOOG","strike":350.0,
+               "expiry":"2026-09-11","premium":1.0,"contracts":2,"sold":"2026-09-04",
+               "mark":{"mid":0.5,"as_of":"2026-09-08T19:00:00Z","underlying_price":344.2}}]}"#,
+        )
+        .unwrap();
+        let doc = read_ledger(dir.path(), "uid1").unwrap();
+        assert_eq!(doc.schema_version, LEDGER_SCHEMA_VERSION);
+        assert!(doc.calls.is_empty());
+        assert!(doc.lots.is_empty());
+        assert_eq!(doc.cash, None);
+        assert_eq!(doc.positions.len(), 1);
+        assert_eq!(doc.positions[0].id, "h1");
+        assert_eq!(
+            doc.positions[0].mark.as_ref().unwrap().underlying_price,
+            Some(344.2)
+        );
+    }
+
+    /// R4: a full wheel document round-trips losslessly — every field of
+    /// every entry across positions, calls, lots, and cash.
+    #[test]
+    fn full_wheel_document_round_trips_losslessly() {
+        let dir = tempfile::tempdir().unwrap();
+        let as_of = chrono::Utc::now();
+        let doc = HoldingsDocument {
+            schema_version: LEDGER_SCHEMA_VERSION,
+            positions: vec![sample_holding("h1")],
+            calls: vec![market_int_core::holdings::CallHolding {
+                id: "c1".to_string(),
+                symbol: "GOOG".to_string(),
+                strike: 360.0,
+                expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+                premium: 1.2,
+                contracts: 2,
+                sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                mark: Some(market_int_core::holdings::Mark {
+                    mid: 0.3,
+                    as_of,
+                    underlying_price: Some(370.0),
+                }),
+            }],
+            lots: vec![market_int_core::holdings::ShareLot {
+                id: "l1".to_string(),
+                symbol: "GOOG".to_string(),
+                shares: 200,
+                basis_per_share: 349.0,
+                acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                mark: Some(market_int_core::holdings::SpotMark {
+                    spot: 370.0,
+                    as_of,
+                }),
+            }],
+            cash: Some(150_000.0),
+        };
+        write_ledger(dir.path(), "uid1", &doc).unwrap();
+        let back = read_ledger(dir.path(), "uid1").unwrap();
+        assert_eq!(back, doc, "every field of every entry survives");
+    }
+
     /// No temp leftovers: the atomic pattern renames or nothing survives.
     #[test]
     fn atomic_write_leaves_no_temp_files() {
@@ -841,15 +1342,16 @@ mod tests {
     }
 
     fn goog_fetcher(mid: f64) -> MarkFetcher {
-        Arc::new(move |requests: &[MarkRequest]| {
-            requests
+        Arc::new(move |requests: &[MarkRequest], _lots: &[String]| MarkBatch {
+            marks: requests
                 .iter()
                 .map(|r| MarkResult {
                     id: r.id.clone(),
                     mid: Ok(Some(mid)),
                     underlying: None,
                 })
-                .collect()
+                .collect(),
+            spots: Default::default(),
         })
     }
 
@@ -1138,17 +1640,21 @@ mod tests {
     async fn refresh_updates_marks() {
         let dir = tempfile::tempdir().unwrap();
         seed_two(dir.path());
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
-            reqs.iter()
-                .map(|r| {
-                    let (mid, spot) = if r.symbol == "TSLA" { (2.2, 401.0) } else { (2.9, 244.0) };
-                    MarkResult {
-                        id: r.id.clone(),
-                        mid: Ok(Some(mid)),
-                        underlying: Some(spot),
-                    }
-                })
-                .collect()
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+            MarkBatch {
+                marks: reqs
+                    .iter()
+                    .map(|r| {
+                        let (mid, spot) = if r.symbol == "TSLA" { (2.2, 401.0) } else { (2.9, 244.0) };
+                        MarkResult {
+                            id: r.id.clone(),
+                            mid: Ok(Some(mid)),
+                            underlying: Some(spot),
+                        }
+                    })
+                    .collect(),
+                spots: Default::default(),
+            }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
         let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
@@ -1179,18 +1685,22 @@ mod tests {
     async fn refresh_partial_failure_is_stale_not_error() {
         let dir = tempfile::tempdir().unwrap();
         seed_two(dir.path());
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
-            reqs.iter()
-                .map(|r| MarkResult {
-                    id: r.id.clone(),
-                    mid: if r.symbol == "TSLA" {
-                        Err("chain query failed: upstream 500".to_string())
-                    } else {
-                        Ok(Some(2.9))
-                    },
-                    underlying: if r.symbol == "TSLA" { None } else { Some(244.0) },
-                })
-                .collect()
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+            MarkBatch {
+                marks: reqs
+                    .iter()
+                    .map(|r| MarkResult {
+                        id: r.id.clone(),
+                        mid: if r.symbol == "TSLA" {
+                            Err("chain query failed: upstream 500".to_string())
+                        } else {
+                            Ok(Some(2.9))
+                        },
+                        underlying: if r.symbol == "TSLA" { None } else { Some(244.0) },
+                    })
+                    .collect(),
+                spots: Default::default(),
+            }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
         let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
@@ -1223,18 +1733,22 @@ mod tests {
     async fn refresh_missing_chain_data_is_stale() {
         let dir = tempfile::tempdir().unwrap();
         seed_two(dir.path());
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
-            reqs.iter()
-                .map(|r| MarkResult {
-                    id: r.id.clone(),
-                    mid: if r.symbol == "TSLA" {
-                        Ok(None)
-                    } else {
-                        Ok(Some(0.0)) // garbage quote — rejected
-                    },
-                    underlying: None,
-                })
-                .collect()
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+            MarkBatch {
+                marks: reqs
+                    .iter()
+                    .map(|r| MarkResult {
+                        id: r.id.clone(),
+                        mid: if r.symbol == "TSLA" {
+                            Ok(None)
+                        } else {
+                            Ok(Some(0.0)) // garbage quote — rejected
+                        },
+                        underlying: None,
+                    })
+                    .collect(),
+                spots: Default::default(),
+            }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
         let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
@@ -1256,8 +1770,17 @@ mod tests {
     #[tokio::test]
     async fn feature_acceptance_wheel_lifecycle() {
         let dir = tempfile::tempdir().unwrap();
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
-            reqs.iter()
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], lots: &[String]| {
+            // Phase 1 (no lots yet): the put refresh — GOOG at 344.20.
+            // Phase 2 (the lot exists): the call refresh — GOOG at 370.00
+            // rides the spots map the lot prices from.
+            let spots: std::collections::BTreeMap<String, f64> = if lots.is_empty() {
+                Default::default()
+            } else {
+                [("GOOG".to_string(), 370.00)].into_iter().collect()
+            };
+            let marks = reqs
+                .iter()
                 .map(|r| {
                     let (mid, spot) = if (r.strike - 360.0).abs() < f64::EPSILON {
                         (0.30, 370.00)
@@ -1270,7 +1793,8 @@ mod tests {
                         underlying: Some(spot),
                     }
                 })
-                .collect()
+                .collect();
+            MarkBatch { marks, spots }
         });
 
         // Fresh ledger: nothing held anywhere, cash never set.
@@ -1392,8 +1916,8 @@ mod tests {
         let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
         assert_eq!(status, StatusCode::OK, "refresh 2: {v}");
         assert_eq!(
-            v["refresh"]["ok"].as_array().unwrap().len(), 1,
-            "only the call is an option request"
+            v["refresh"]["ok"].as_array().unwrap().len(), 2,
+            "the call prices from its chain, the lot from the spot map"
         );
         let call_view = &v["calls"][0]["view"];
         let vs_strike = call_view["spot_pct_vs_strike"].as_f64().unwrap();
@@ -1443,4 +1967,869 @@ mod tests {
             .collect();
         assert_eq!(files, vec!["test-uid.json".to_string()], "one document per uid");
     }
+
+    /// R5: the handler prepares ONE fetch for all three kinds — option
+    /// requests carry their side, lot symbols ride along for the spot map,
+    /// and lot symbols never become chain-query requests.
+    #[tokio::test]
+    async fn refresh_prepares_side_carrying_requests_and_lot_symbols() {
+        let dir = tempfile::tempdir().unwrap();
+        write_ledger(
+            &dir.path().join("holdings"),
+            "test-uid",
+            &HoldingsDocument {
+                schema_version: LEDGER_SCHEMA_VERSION,
+                positions: vec![market_int_core::holdings::Holding {
+                    id: "p-goog".to_string(),
+                    symbol: "GOOG".to_string(),
+                    strike: 350.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+                    premium: 1.0,
+                    contracts: 1,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: None,
+                }],
+                calls: vec![market_int_core::holdings::CallHolding {
+                    id: "c-aapl".to_string(),
+                    symbol: "AAPL".to_string(),
+                    strike: 240.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+                    premium: 2.0,
+                    contracts: 1,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: None,
+                }],
+                lots: vec![market_int_core::holdings::ShareLot {
+                    id: "l-lofa".to_string(),
+                    symbol: "LOFA".to_string(),
+                    shares: 100,
+                    basis_per_share: 20.0,
+                    acquired: NaiveDate::from_ymd_opt(2026, 9, 1).unwrap(),
+                    mark: None,
+                }],
+                cash: None,
+            },
+        )
+        .unwrap();
+
+        let seen: Arc<std::sync::Mutex<Option<(Vec<String>, Vec<String>)>>> =
+            Arc::new(std::sync::Mutex::new(None));
+        let fetcher: MarkFetcher = {
+            let seen = seen.clone();
+            Arc::new(move |reqs: &[MarkRequest], lots: &[String]| {
+                *seen.lock().unwrap() = Some((
+                    reqs.iter()
+                        .map(|r| format!("{}:{:?}", r.symbol, r.side))
+                        .collect(),
+                    lots.to_vec(),
+                ));
+                MarkBatch {
+                    marks: Vec::new(),
+                    spots: Default::default(),
+                }
+            })
+        };
+        let app = crate::api::build_router(test_state(dir.path(), fetcher));
+        let (status, _) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK);
+
+        let (requests, lots) = seen.lock().unwrap().take().expect("fetcher called");
+        assert!(requests.contains(&"GOOG:Put".to_string()), "{requests:?}");
+        assert!(requests.contains(&"AAPL:Call".to_string()), "{requests:?}");
+        assert_eq!(
+            requests.len(), 2,
+            "lot symbols never become chain queries: {requests:?}"
+        );
+        assert_eq!(lots, vec!["LOFA".to_string()]);
+    }
+
+    /// R5: merging a MarkBatch — option marks land by id (put AND call),
+    /// lots price from `spots` as SpotMarks stamped now, and a lot whose
+    /// symbol is absent from `spots` is stale, keeping its previous
+    /// SpotMark.
+    #[tokio::test]
+    async fn refresh_merges_batch_marks_and_spots() {
+        let dir = tempfile::tempdir().unwrap();
+        let frozen = frozen_today();
+        write_ledger(
+            &dir.path().join("holdings"),
+            "test-uid",
+            &HoldingsDocument {
+                schema_version: LEDGER_SCHEMA_VERSION,
+                positions: vec![market_int_core::holdings::Holding {
+                    id: "p1".to_string(),
+                    symbol: "GOOG".to_string(),
+                    strike: 350.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+                    premium: 1.0,
+                    contracts: 1,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: Some(market_int_core::holdings::Mark {
+                        mid: 0.9,
+                        as_of: frozen - chrono::Duration::hours(2),
+                        underlying_price: None,
+                    }),
+                }],
+                calls: vec![market_int_core::holdings::CallHolding {
+                    id: "c1".to_string(),
+                    symbol: "GOOG".to_string(),
+                    strike: 360.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+                    premium: 1.2,
+                    contracts: 2,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: None,
+                }],
+                lots: vec![
+                    market_int_core::holdings::ShareLot {
+                        id: "l-goog".to_string(),
+                        symbol: "GOOG".to_string(),
+                        shares: 200,
+                        basis_per_share: 349.0,
+                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                        mark: Some(market_int_core::holdings::SpotMark {
+                            spot: 344.20,
+                            as_of: frozen - chrono::Duration::hours(2),
+                        }),
+                    },
+                    market_int_core::holdings::ShareLot {
+                        id: "l-nope".to_string(),
+                        symbol: "NOPE".to_string(),
+                        shares: 100,
+                        basis_per_share: 100.0,
+                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                        mark: Some(market_int_core::holdings::SpotMark {
+                            spot: 100.0,
+                            as_of: frozen - chrono::Duration::hours(2),
+                        }),
+                    },
+                ],
+                cash: None,
+            },
+        )
+        .unwrap();
+
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+            MarkBatch {
+                marks: reqs
+                    .iter()
+                    .map(|r| MarkResult {
+                        id: r.id.clone(),
+                        mid: Ok(Some(if r.id == "p1" { 0.5 } else { 0.3 })),
+                        underlying: Some(370.0),
+                    })
+                    .collect(),
+                spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
+            }
+        });
+        let app = crate::api::build_router(test_state(dir.path(), fetcher));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "{v}");
+
+        // ok spans the kinds that priced: both options plus the GOOG lot;
+        // the NOPE lot is stale with a reason.
+        let ok = v["refresh"]["ok"].as_array().unwrap();
+        assert!(ok.contains(&json!("p1")) && ok.contains(&json!("c1")) && ok.contains(&json!("l-goog")), "{ok:?}");
+        let stale = v["refresh"]["stale"].as_array().unwrap();
+        assert_eq!(stale.len(), 1);
+        assert_eq!(stale[0]["id"], "l-nope");
+        assert!(stale[0]["reason"].as_str().unwrap().contains("NOPE"));
+
+        // Marks landed by id; SpotMark stamped at the frozen `now`.
+        let lots = v["lots"].as_array().unwrap();
+        let goog = lots.iter().find(|l| l["id"] == "l-goog").unwrap();
+        assert_eq!(goog["mark"]["spot"], 370.0);
+        assert_eq!(
+            goog["mark"]["as_of"],
+            frozen.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
+            "SpotMark as_of is the refresh's now"
+        );
+        assert_eq!(goog["view"]["value"], 74000.0);
+        let nope = lots.iter().find(|l| l["id"] == "l-nope").unwrap();
+        assert_eq!(
+            nope["mark"]["spot"], 100.0,
+            "absent from spots — previous SpotMark kept"
+        );
+        let calls = v["calls"].as_array().unwrap();
+        assert_eq!(calls[0]["mark"]["mid"], 0.3, "call mark landed by id");
+
+        // Persisted, not just echoed.
+        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
+        assert!(file.contains("\"spot\": 370.0"), "{file}");
+        assert!(file.contains("\"mid\": 0.5"), "{file}");
+        assert!(file.contains("\"mid\": 0.3"), "{file}");
+        assert!(file.contains("\"spot\": 100.0"), "{file}");
+    }
+
+    /// R6: `kind: "call"` lands in the calls array with its computed view.
+    #[tokio::test]
+    async fn add_call_lands_in_calls_with_view() {
+        let dir = tempfile::tempdir().unwrap();
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({
+                "kind": "call", "symbol": "GOOG", "strike": 360.0,
+                "premium": 1.2, "contracts": 2,
+                "sold": "2026-09-04", "expiry": "2026-09-11"
+            })),
+        )
+        .await;
+        assert_eq!(status, StatusCode::CREATED, "{v}");
+        assert_eq!(v["call"]["symbol"], "GOOG");
+        assert!(
+            v["call"]["view"]["days_total"].as_u64().is_some(),
+            "computed view rides the response: {v}"
+        );
+        assert!(v["call"]["mark"].is_null(), "no mark until refresh");
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        assert_eq!(v["calls"].as_array().unwrap().len(), 1);
+        assert_eq!(v["positions"].as_array().unwrap().len(), 0, "not a put");
+    }
+
+    /// R6: `kind: "lot"` lands unpriced in lots; capacity still computes.
+    #[tokio::test]
+    async fn add_lot_lands_unpriced() {
+        let dir = tempfile::tempdir().unwrap();
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({
+                "kind": "lot", "symbol": "GOOG", "shares": 200,
+                "basis_per_share": 349.0, "acquired": "2026-09-08"
+            })),
+        )
+        .await;
+        assert_eq!(status, StatusCode::CREATED, "{v}");
+        let lot = &v["lot"];
+        assert_eq!(lot["shares"], 200);
+        assert!(lot["mark"].is_null(), "unpriced until refresh");
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        let lots = v["lots"].as_array().unwrap();
+        assert_eq!(lots.len(), 1);
+        assert!(lots[0]["view"]["value"].is_null(), "unpriced lot view");
+        assert_eq!(lots[0]["view"]["capacity"], 2);
+    }
+
+    /// R6: lot validation — future acquired, zero shares, non-positive
+    /// basis, blank symbol are 400s and never write the ledger.
+    #[tokio::test]
+    async fn add_lot_rejects_invalid_without_writing() {
+        let dir = tempfile::tempdir().unwrap();
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        for (label, payload) in [
+            ("future acquired", json!({"kind": "lot", "symbol": "GOOG", "shares": 100, "basis_per_share": 349.0, "acquired": "2026-09-09"})),
+            ("zero shares", json!({"kind": "lot", "symbol": "GOOG", "shares": 0, "basis_per_share": 349.0, "acquired": "2026-09-08"})),
+            ("zero basis", json!({"kind": "lot", "symbol": "GOOG", "shares": 100, "basis_per_share": 0.0, "acquired": "2026-09-08"})),
+            ("blank symbol", json!({"kind": "lot", "symbol": "  ", "shares": 100, "basis_per_share": 349.0, "acquired": "2026-09-08"})),
+        ] {
+            let (status, v) = call(app.clone(), "POST", "/api/holdings", Some(payload)).await;
+            assert_eq!(status, StatusCode::BAD_REQUEST, "{label}: {v}");
+            assert!(v["error"].as_str().is_some(), "{label} carries a reason");
+        }
+        assert!(
+            !dir.path().join("holdings/test-uid.json").exists(),
+            "failed lot adds must not create the ledger"
+        );
+    }
+
+    /// R6: an unknown kind is a 400.
+    #[tokio::test]
+    async fn add_rejects_unknown_kind() {
+        let dir = tempfile::tempdir().unwrap();
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({"kind": "bond", "symbol": "GOOG"})),
+        )
+        .await;
+        assert_eq!(status, StatusCode::BAD_REQUEST, "{v}");
+    }
+
+    /// R6: PATCH /api/holdings/cash sets the balance and derives
+    /// reserved/free from the open puts; negative or missing cash is a
+    /// 400 with no write.
+    #[tokio::test]
+    async fn patch_cash_sets_balance_and_derives() {
+        let dir = tempfile::tempdir().unwrap();
+        let mut doc = HoldingsDocument::default();
+        doc.positions.push(market_int_core::holdings::Holding {
+            id: "p1".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 350.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+            premium: 1.0,
+            contracts: 2,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: None,
+        });
+        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "PATCH",
+            "/api/holdings/cash",
+            Some(json!({"cash": 150000.0})),
+        )
+        .await;
+        assert_eq!(status, StatusCode::OK, "{v}");
+        assert_eq!(v["cash"], 150000.0);
+        assert_eq!(v["cash_reserved"], 70000.0);
+        assert_eq!(v["cash_free"], 80000.0);
+
+        // GET reflects the balance alongside the derived numbers.
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(v["cash"], 150000.0);
+        assert_eq!(v["cash_reserved"], 70000.0);
+        assert_eq!(v["cash_free"], 80000.0);
+
+        // Negative and missing are 400s.
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, _) = call(app, "PATCH", "/api/holdings/cash", Some(json!({"cash": -1.0}))).await;
+        assert_eq!(status, StatusCode::BAD_REQUEST);
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, _) = call(app, "PATCH", "/api/holdings/cash", Some(json!({}))).await;
+        assert_eq!(status, StatusCode::BAD_REQUEST);
+    }
+
+    /// R6: DELETE searches positions, then calls, then lots — one route
+    /// for every kind; an id in no array stays a 404 with no write.
+    #[tokio::test]
+    async fn delete_removes_from_any_array() {
+        let dir = tempfile::tempdir().unwrap();
+        let mut doc = HoldingsDocument::default();
+        doc.positions.push(market_int_core::holdings::Holding {
+            id: "p1".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 350.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+            premium: 1.0,
+            contracts: 1,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: None,
+        });
+        doc.calls.push(market_int_core::holdings::CallHolding {
+            id: "c1".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 360.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+            premium: 1.2,
+            contracts: 1,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: None,
+        });
+        doc.lots.push(market_int_core::holdings::ShareLot {
+            id: "l1".to_string(),
+            symbol: "GOOG".to_string(),
+            shares: 100,
+            basis_per_share: 349.0,
+            acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+            mark: None,
+        });
+        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, _) = call(app, "DELETE", "/api/holdings/c1", None).await;
+        assert_eq!(status, StatusCode::OK, "call removed");
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        assert_eq!(v["calls"].as_array().unwrap().len(), 0);
+        assert_eq!(v["positions"].as_array().unwrap().len(), 1, "put untouched");
+        assert_eq!(v["lots"].as_array().unwrap().len(), 1, "lot untouched");
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, _) = call(app, "DELETE", "/api/holdings/l1", None).await;
+        assert_eq!(status, StatusCode::OK, "lot removed");
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, _) = call(app, "DELETE", "/api/holdings/h-nope", None).await;
+        assert_eq!(status, StatusCode::NOT_FOUND);
+    }
+
+    /// R6: the 100-entry cap counts across all three arrays combined.
+    #[tokio::test]
+    async fn cap_counts_entries_combined() {
+        let dir = tempfile::tempdir().unwrap();
+        let mut doc = HoldingsDocument::default();
+        for i in 0..99 {
+            doc.positions.push(market_int_core::holdings::Holding {
+                id: format!("p{i}"),
+                symbol: "GOOG".to_string(),
+                strike: 350.0,
+                expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+                premium: 1.0,
+                contracts: 1,
+                sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                mark: None,
+            });
+        }
+        doc.calls.push(market_int_core::holdings::CallHolding {
+            id: "c99".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 360.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+            premium: 1.2,
+            contracts: 1,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: None,
+        });
+        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
+
+        // Any kind is rejected at 100 combined.
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({
+                "symbol": "GOOG", "strike": 350.0, "premium": 1.0,
+                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11"
+            })),
+        )
+        .await;
+        assert_eq!(status, StatusCode::BAD_REQUEST, "{v}");
+        assert!(v["error"].as_str().unwrap().contains("maximum"));
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, _) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({"kind": "lot", "symbol": "GOOG", "shares": 100, "basis_per_share": 349.0, "acquired": "2026-09-08"})),
+        )
+        .await;
+        assert_eq!(status, StatusCode::BAD_REQUEST);
+    }
+
+    /// R7: one pass marks all three kinds and survives a mid-flight
+    /// mutation — an entry added while the fetch was in flight survives
+    /// the re-read merge unclobbered (the write-back-pre-call-snapshot
+    /// hazard from docs/lessons.md).
+    #[tokio::test]
+    async fn refresh_marks_all_kinds_and_keeps_mid_flight_adds() {
+        let dir = tempfile::tempdir().unwrap();
+        let ledger_dir = dir.path().join("holdings");
+        write_ledger(
+            &ledger_dir,
+            "test-uid",
+            &HoldingsDocument {
+                schema_version: LEDGER_SCHEMA_VERSION,
+                positions: vec![market_int_core::holdings::Holding {
+                    id: "p1".to_string(),
+                    symbol: "GOOG".to_string(),
+                    strike: 350.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+                    premium: 1.0,
+                    contracts: 1,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: None,
+                }],
+                calls: vec![market_int_core::holdings::CallHolding {
+                    id: "c1".to_string(),
+                    symbol: "GOOG".to_string(),
+                    strike: 360.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+                    premium: 1.2,
+                    contracts: 2,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: None,
+                }],
+                lots: vec![market_int_core::holdings::ShareLot {
+                    id: "l1".to_string(),
+                    symbol: "GOOG".to_string(),
+                    shares: 200,
+                    basis_per_share: 349.0,
+                    acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                    mark: None,
+                }],
+                cash: None,
+            },
+        )
+        .unwrap();
+
+        let fetcher: MarkFetcher = {
+            let ledger_dir = ledger_dir.clone();
+            Arc::new(move |reqs: &[MarkRequest], _lots: &[String]| {
+                // Another request's mutation lands while "Tiger" is being
+                // queried: a fresh mark-less position joins the ledger.
+                let mut doc = read_ledger(&ledger_dir, "test-uid").unwrap();
+                doc.positions
+                    .push(market_int_core::holdings::Holding {
+                        id: "p-late".to_string(),
+                        symbol: "AAPL".to_string(),
+                        strike: 230.0,
+                        expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+                        premium: 3.2,
+                        contracts: 1,
+                        sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                        mark: None,
+                    });
+                write_ledger(&ledger_dir, "test-uid", &doc).unwrap();
+                MarkBatch {
+                    marks: reqs
+                        .iter()
+                        .map(|r| MarkResult {
+                            id: r.id.clone(),
+                            mid: Ok(Some(if r.id == "p1" { 0.5 } else { 0.3 })),
+                            underlying: Some(370.0),
+                        })
+                        .collect(),
+                    spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
+                }
+            })
+        };
+        let app = crate::api::build_router(test_state(dir.path(), fetcher));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "{v}");
+        let ok = v["refresh"]["ok"].as_array().unwrap();
+        assert_eq!(ok.len(), 3, "put + call + lot all priced: {ok:?}");
+
+        // The mid-flight position survived with its mark-less state; the
+        // snapshot entries still got their marks.
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        let positions = v["positions"].as_array().unwrap();
+        assert_eq!(positions.len(), 2, "p1 + p-late both present");
+        let p1 = positions.iter().find(|p| p["id"] == "p1").unwrap();
+        assert_eq!(p1["mark"]["mid"], 0.5);
+        let late = positions.iter().find(|p| p["id"] == "p-late").unwrap();
+        assert!(late["mark"].is_null(), "added mid-flight, never clobbered");
+        assert_eq!(v["calls"][0]["mark"]["mid"], 0.3);
+        assert_eq!(v["lots"][0]["mark"]["spot"], 370.0);
+    }
+
+    /// R7: one pass can fail half its kinds — the option lands stale with
+    /// its previous mark while the lot still prices from spots.
+    #[tokio::test]
+    async fn refresh_mixed_failure_is_per_entry_stale() {
+        let dir = tempfile::tempdir().unwrap();
+        let ledger_dir = dir.path().join("holdings");
+        write_ledger(
+            &ledger_dir,
+            "test-uid",
+            &HoldingsDocument {
+                schema_version: LEDGER_SCHEMA_VERSION,
+                positions: vec![market_int_core::holdings::Holding {
+                    id: "p1".to_string(),
+                    symbol: "GOOG".to_string(),
+                    strike: 350.0,
+                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+                    premium: 1.0,
+                    contracts: 1,
+                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+                    mark: Some(market_int_core::holdings::Mark {
+                        mid: 0.9,
+                        as_of: frozen_today() - chrono::Duration::hours(2),
+                        underlying_price: None,
+                    }),
+                }],
+                calls: Vec::new(),
+                lots: vec![
+                    market_int_core::holdings::ShareLot {
+                        id: "l-goog".to_string(),
+                        symbol: "GOOG".to_string(),
+                        shares: 200,
+                        basis_per_share: 349.0,
+                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                        mark: None,
+                    },
+                    market_int_core::holdings::ShareLot {
+                        id: "l-nope".to_string(),
+                        symbol: "NOPE".to_string(),
+                        shares: 100,
+                        basis_per_share: 100.0,
+                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
+                        mark: Some(market_int_core::holdings::SpotMark {
+                            spot: 100.0,
+                            as_of: frozen_today() - chrono::Duration::hours(2),
+                        }),
+                    },
+                ],
+                cash: None,
+            },
+        )
+        .unwrap();
+
+        // The put's chain query fails; GOOT spot arrives for the GOOG lot;
+        // NOPE's kline failed so it's missing from spots entirely.
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+            MarkBatch {
+                marks: reqs
+                    .iter()
+                    .map(|r| MarkResult {
+                        id: r.id.clone(),
+                        mid: Err("chain query failed: upstream 500".to_string()),
+                        underlying: None,
+                    })
+                    .collect(),
+                spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
+            }
+        });
+        let app = crate::api::build_router(test_state(dir.path(), fetcher));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "per-entry failures ≠ request failure");
+        let ok = v["refresh"]["ok"].as_array().unwrap();
+        assert_eq!(
+            ok,
+            &vec![json!("l-goog")],
+            "only the spot-priced lot is ok: {ok:?}"
+        );
+        let stale: Vec<String> = v["refresh"]["stale"]
+            .as_array()
+            .unwrap()
+            .iter()
+            .map(|s| s["id"].as_str().unwrap().to_string())
+            .collect();
+        assert!(stale.contains(&"p1".to_string()), "{stale:?}");
+        assert!(stale.contains(&"l-nope".to_string()), "{stale:?}");
+
+        let lots = v["lots"].as_array().unwrap();
+        let nope = lots.iter().find(|l| l["id"] == "l-nope").unwrap();
+        assert_eq!(nope["mark"]["spot"], 100.0, "previous SpotMark kept");
+        let p1 = v["positions"][0].clone();
+        assert_eq!(p1["mark"]["mid"], 0.9, "previous mark kept");
+    }
+
+    /// R8: assignment — the lot records and the put disappears in ONE
+    /// rewrite (the put is only gone when the lot is recorded).
+    #[tokio::test]
+    async fn assignment_records_lot_and_removes_put() {
+        let dir = tempfile::tempdir().unwrap();
+        let mut doc = HoldingsDocument::default();
+        doc.positions.push(market_int_core::holdings::Holding {
+            id: "p1".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 350.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+            premium: 1.0,
+            contracts: 2,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: Some(market_int_core::holdings::Mark {
+                mid: 0.5,
+                as_of: frozen_today(),
+                underlying_price: Some(344.2),
+            }),
+        });
+        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({
+                "kind": "lot", "symbol": "GOOG", "shares": 200,
+                "basis_per_share": 349.0, "acquired": "2026-09-08",
+                "assigned_from": "p1"
+            })),
+        )
+        .await;
+        assert_eq!(status, StatusCode::CREATED, "{v}");
+        assert_eq!(v["lot"]["shares"], 200);
+
+        // One request later: the put is gone, the lot is present.
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        assert_eq!(v["positions"].as_array().unwrap().len(), 0, "put gone");
+        let lots = v["lots"].as_array().unwrap();
+        assert_eq!(lots.len(), 1);
+        assert_eq!(lots[0]["basis_per_share"], 349.0);
+
+        // The persisted document agrees — no orphan put.
+        let file =
+            std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
+        assert!(!file.contains("\"p1\""), "orphan put survived: {file}");
+        assert!(file.contains("\"shares\": 200"), "{file}");
+    }
+
+    /// R8: `assigned_from` naming no existing put is a 404 with the ledger
+    /// byte-unchanged; the same body without it is a plain lot add.
+    #[tokio::test]
+    async fn assignment_unknown_put_is_404_without_write() {
+        let dir = tempfile::tempdir().unwrap();
+        let mut doc = HoldingsDocument::default();
+        doc.positions.push(market_int_core::holdings::Holding {
+            id: "p1".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 350.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
+            premium: 1.0,
+            contracts: 2,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: None,
+        });
+        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
+        let ledger_path = dir.path().join("holdings/test-uid.json");
+        let before = std::fs::read(&ledger_path).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({
+                "kind": "lot", "symbol": "GOOG", "shares": 200,
+                "basis_per_share": 349.0, "acquired": "2026-09-08",
+                "assigned_from": "h-nope"
+            })),
+        )
+        .await;
+        assert_eq!(status, StatusCode::NOT_FOUND, "{v}");
+        assert_eq!(
+            std::fs::read(&ledger_path).unwrap(),
+            before,
+            "ledger byte-unchanged"
+        );
+
+        // Without assigned_from: plain add, put untouched.
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings",
+            Some(json!({
+                "kind": "lot", "symbol": "GOOG", "shares": 200,
+                "basis_per_share": 349.0, "acquired": "2026-09-08"
+            })),
+        )
+        .await;
+        assert_eq!(status, StatusCode::CREATED, "{v}");
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(v["positions"].as_array().unwrap().len(), 1, "put untouched");
+        assert_eq!(v["lots"].as_array().unwrap().len(), 1);
+    }
+
+    fn fifo_fixture() -> HoldingsDocument {
+        let mut doc = HoldingsDocument::default();
+        doc.calls.push(market_int_core::holdings::CallHolding {
+            id: "c1".to_string(),
+            symbol: "GOOG".to_string(),
+            strike: 360.0,
+            expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
+            premium: 1.2,
+            contracts: 1,
+            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
+            mark: Some(market_int_core::holdings::Mark {
+                mid: 3.0,
+                as_of: frozen_today(),
+                underlying_price: Some(370.0),
+            }),
+        });
+        doc.lots.push(market_int_core::holdings::ShareLot {
+            id: "l-old".to_string(),
+            symbol: "GOOG".to_string(),
+            shares: 200,
+            basis_per_share: 349.0,
+            acquired: NaiveDate::from_ymd_opt(2026, 9, 1).unwrap(),
+            mark: None,
+        });
+        doc.lots.push(market_int_core::holdings::ShareLot {
+            id: "l-new".to_string(),
+            symbol: "GOOG".to_string(),
+            shares: 100,
+            basis_per_share: 349.0,
+            acquired: NaiveDate::from_ymd_opt(2026, 9, 5).unwrap(),
+            mark: None,
+        });
+        doc
+    }
+
+    /// R9: called away — the call is removed and the earliest-acquired
+    /// covering lot is reduced by contracts × 100, all in one rewrite.
+    #[tokio::test]
+    async fn called_away_reduces_fifo_and_removes_call() {
+        let dir = tempfile::tempdir().unwrap();
+        write_ledger(&dir.path().join("holdings"), "test-uid", &fifo_fixture()).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings/called-away",
+            Some(json!({"call_id": "c1"})),
+        )
+        .await;
+        assert_eq!(status, StatusCode::OK, "{v}");
+        assert_eq!(v["called_away"], true);
+        assert_eq!(v["reduced"], true);
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(v["calls"].as_array().unwrap().len(), 0, "call gone");
+        let lots = v["lots"].as_array().unwrap();
+        let l_old = lots.iter().find(|l| l["id"] == "l-old").unwrap();
+        assert_eq!(l_old["shares"], 100, "FIFO: earliest lot reduced");
+        assert_eq!(lots.len(), 2, "l-new untouched");
+    }
+
+    /// R9: no covering lot is a 200 outcome, not an error — the call is
+    /// still removed and the lots stay untouched.
+    #[tokio::test]
+    async fn called_away_without_covering_lot_still_removes_call() {
+        let dir = tempfile::tempdir().unwrap();
+        let mut doc = fifo_fixture();
+        doc.calls[0].contracts = 3; // need 300 > any lot's shares
+        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings/called-away",
+            Some(json!({"call_id": "c1"})),
+        )
+        .await;
+        assert_eq!(status, StatusCode::OK, "{v}");
+        assert_eq!(v["called_away"], true);
+        assert_eq!(v["reduced"], false);
+        assert!(v["reason"].as_str().is_some(), "says what happened: {v}");
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(v["calls"].as_array().unwrap().len(), 0, "call still removed");
+        let lots = v["lots"].as_array().unwrap();
+        assert_eq!(lots[0]["shares"], 200, "lots untouched");
+        assert_eq!(lots[1]["shares"], 100, "lots untouched");
+    }
+
+    /// R9: an unknown call_id is a 404 with the ledger byte-unchanged.
+    #[tokio::test]
+    async fn called_away_unknown_call_is_404_without_write() {
+        let dir = tempfile::tempdir().unwrap();
+        write_ledger(&dir.path().join("holdings"), "test-uid", &fifo_fixture()).unwrap();
+        let ledger_path = dir.path().join("holdings/test-uid.json");
+        let before = std::fs::read(&ledger_path).unwrap();
+
+        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
+        let (status, v) = call(
+            app,
+            "POST",
+            "/api/holdings/called-away",
+            Some(json!({"call_id": "h-nope"})),
+        )
+        .await;
+        assert_eq!(status, StatusCode::NOT_FOUND, "{v}");
+        assert_eq!(
+            std::fs::read(&ledger_path).unwrap(),
+            before,
+            "ledger byte-unchanged"
+        );
+    }
 }
