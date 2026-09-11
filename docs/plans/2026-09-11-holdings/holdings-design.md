# Holdings Management — currently holding puts

## At a glance

Users who sell cash-secured puts have no way to track the positions they are
currently holding: what they sold, what it would cost to buy back today, and
whether the premium decay they have captured is ahead of pace for the life of
the contract. This feature adds a "Holdings" tab to the webapp: the user
manually enters each put they sold, the server marks it to market on demand
with Tiger mid prices, and each position card shows the close decision —
sold at / now (mid) / close captures $ — against a per-day pace target with a
"buy back?" flag. Positions are open-only: recording an outcome (bought back,
expired, assigned) shows the realized P&L once and removes the position.

UI variant B ("urgency cards") was chosen from a three-variant throwaway
prototype; the prototype code is left in the working tree (dev-only gated) as
the visual reference for implementation — fold the winner in, do not ship the
prototype file (see "Prototype reference" below).

**Key decisions**

- Per-user JSON ledger on the GCS volume (`/data/webapp/holdings/<uid>.json`),
  path derived server-side from the verified Firebase UID — isolation by
  construction (rejected: browser localStorage — lost on browser clear,
  broken across devices, and marks must transit the server anyway for Tiger
  creds; rejected: SQLite — the webapp's SQLite is `/tmp` scratch on Cloud
  Run, wiped on scale-to-zero, and SQLite over GCS FUSE is unsafe with WAL).
- Mark price = mid of bid/ask from the existing Tiger `query_option_chain`
  with a degenerate `(strike, strike)` range (rejected: ask price — mid was
  explicitly chosen by the user; rejected: a new single-contract quote API
  method — the degenerate-range shape already exists via `test-tiger`).
- Pace rule with a 1-day floor: `target% = max(elapsed working days, 1) /
  total working days × 100` (rejected: raw linear `elapsed/total` — day 0
  gets a 0% target, either meaningless or a missed signal; day-0 gap/IV-crush
  drops are real close signals and earn a full day's target).
- Working days = weekdays only, holidays not modeled — same documented
  limitation as `market.rs`.
- Open positions only; outcome recording deletes the position after showing
  realized P&L once (rejected: closed-history table — user chose open-only).
- Marks refresh on demand only — a refresh button, no background refresh, no
  coupling to the pipeline run (rejected: refresh-on-pipeline-run — marks are
  a holdings concern, not a scoring-run concern).
- Webapp-only; no CLI subcommand, no Telegram notification, no scored-pool
  integration, no partial closes (YAGNI, user-confirmed).
- P&L per working day stays in the data model (cheap computed field) but is
  not shown on the card — user judged it not useful for the close decision;
  it remains available for future views.
- Decimal entry via `inputmode="decimal"` text inputs parsed at submit —
  never `type="number"`, which sanitizes the in-progress `.` per keystroke
  and silently corrupts "1.5" into "15" (bug hit in the prototype).

| R# | Requirement in one line | Risk |
|----|--------------------------|------|
| R1 | Core holdings model + pace math (pure, Telegram-free) | — |
| R2 | Per-user holdings document store on the GCS volume | ⚠ production-risk |
| R3 | Holdings CRUD API behind the Firebase gate | ⚠ production-risk |
| R4 | Mark-to-market refresh via Tiger | ⚠ production-risk |
| R5 | Frontend holdings panel (variant B cards) | — |

## Requirements

### R1: Core holdings model and pace math
`crates/core/src/holdings.rs` (new, Telegram-free) exposes the domain types
and pure computations the webapp layers consume: a `Holding` (id, symbol,
strike, expiry date, premium per contract, contract count, sell date), a
mark (mid price + `as_of` timestamp, optional), and a computed view:
unrealized dollars `(premium − mid) × 100 × contracts`, unrealized percent,
working days elapsed/total (sell date exclusive → expiry inclusive, weekdays
only, ET calendar dates, elapsed clamped to expiry), per-working-day pace
(dollars and percent), `target% = max(elapsed, 1) / total × 100`, and a
`pace_met` flag requiring a present mark.

**Acceptance criteria**
- Given the prototype's reference example (premium 1.00, mid 0.50, sold 3
  working days ago, 5 working days to expiry, 1 contract), When the view is
  computed, Then unrealized is $50.00 (+50%), elapsed/total is 2/5, target is
  40%, and `pace_met` is true.
- Given a position sold today (0 elapsed days) with 4 total working days and
  a mark, When computed, Then target is 25% (the 1-day floor) — not 0%.
- Given a position with no mark, When computed, Then `pace_met` is false and
  the dollar/percent fields are "no mark" (not fabricated numbers).
- Given today past expiry, When computed, Then elapsed clamps to total.
- Given a sell-date-to-expiry span crossing a weekend, When computed, Then
  Saturday/Sunday are not counted as working days.
- Given a `Holding` with strike ≤ 0, premium ≤ 0, contracts < 1, or expiry ≤
  sell date, When validated, Then it is rejected.

### Checkpoints: none
### Review: skip

### R2: Per-user holdings document store
The webapp persists each user's ledger as a schema-versioned JSON document at
`/data/webapp/holdings/<uid>.json` (local dev: under the configured data
dir), written with the `result.rs` atomic pattern (temp file in same dir →
fsync → rename → best-effort dir fsync). The filename comes only from the
verified identity's UID — never a client-supplied parameter. Marks are
embedded per position (`mid`, `as_of`). Reads tolerate a missing file (empty
ledger) and a malformed file (empty ledger + warning log, retry-once parse
mirroring `read_document`).

**Acceptance criteria**
- Given a stored document, When written, Then no reader observes a partial
  write (atomic rename) and the file is valid JSON with the schema version.
- Given no file exists, When read, Then an empty ledger is returned without
  error and the directory is created on first write.
- Given a corrupted file, When read, Then an empty ledger is returned with a
  warning (never a 500 to the caller).
- Given two different UIDs, When each writes, Then documents land in
  separate per-UID files and neither can read the other's path via the API
  layer (enforced in R3; the store takes the uid as a plain parameter).
- Positions are round-tripped losslessly (id, symbol, strike, expiry,
  premium, contracts, sell date, mark, as_of).

### Checkpoints: none
### Review: skip

### Production-risk notes
- New persisted artifact on the GCS FUSE volume: `/data` previously held
  exactly symbols.csv, last_run.json, allowed_emails.txt; this adds a
  `holdings/` prefix. Single-writer is preserved by maxScale 1. Cloud Run
  deployment must allow the volume (no manifest change expected — same
  mount), but the checklist in `crates/webapp/README.md` gains a line.

### R3: Holdings CRUD API behind the Firebase gate
Axum routes in a new `crates/webapp/src/holdings.rs`, merged into the
existing router inside the `auth::protect` wrap:
- `GET /api/holdings` — the caller's positions with computed views from
  stored marks; no network calls.
- `POST /api/holdings` — add a position (symbol, strike, premium, contracts,
  sell date, expiry); server-generated unique id; rejects invalid input (400
  with reason: strike/premium ≤ 0, contracts < 1, sell date in the future,
  expiry ≤ sell date).
- `DELETE /api/holdings/{id}` — removes the position (the outcome-confirm
  deletion); unknown id → 404.
The uid is taken from `VerifiedIdentity` request extensions only. An
authenticated user can never name another user's ledger.

**Acceptance criteria**
- Given a valid token for user A, When A adds/gets/deletes, Then operations
  apply only to A's document.
- Given user B's token, When B requests the API, Then B sees only B's ledger
  and there is no route shape that exposes another uid's data (uid never
  comes from the request path/body).
- Given unauthenticated access (auth armed), When any holdings route is hit,
  Then it is rejected by the existing gate like every other /api route.
- Given invalid payload on POST, When submitted, Then 400 with a reason and
  no document write.
- Given DELETE with an id not in the ledger, When called, Then 404 and no
  document write.
- Handlers are tested hermetically via `tower::ServiceExt::oneshot` against
  the built router with tempdir document IO (no GCS, no network).

### Checkpoints: none
### Review: skip

### Production-risk notes
- Auth-adjacent: per-user isolation relies on deriving the storage path from
  `VerifiedIdentity` only. Reviewers should verify no handler accepts a
  user-identifying parameter.

### R4: Mark-to-market refresh via Tiger
`POST /api/holdings/refresh` fetches a fresh mid for each open position and
updates `mid` + `as_of` per position. Per position it queries the underlying
quote and the put chain via the existing `Requester::query_option_chain` with
a degenerate `(strike, strike)` range and `OptionChainSide::Put` (the
`test-tiger` shape), taking the bid/ask mid. One position's fetch failure
marks only that position stale (previous mark and `as_of` kept); the response
reports per-position ok/stale and never fails the whole request because one
fetch failed. Reuses the shared Tiger requester; credentials from env as
today.

**Acceptance criteria**
- Given two open positions with an up-to-date Tiger response, When refresh
  is called, Then both mids and `as_of` update and the response reports both
  ok.
- Given Tiger failing for one symbol, When refresh is called, Then that
  position keeps its previous mark with its old `as_of` and is reported
  stale; the other position still updates; the HTTP status is 200.
- Given a position whose contract has no chain data (expired/delisted),
  When refreshed, Then it is reported stale (not an error, not a zero mark).
- The fetcher is an injected seam; hermetic tests use a scripted fetcher
  with no network.

### Checkpoints: none
### Review: skip

### Production-risk notes
- External API: first Tiger usage outside the pipeline's quotes/chains flow.
  Reuses `Requester` (RSA-signed, env credentials); no new credentials, no
  new endpoint auth model. Respect the existing batch/latency posture —
  positions are few (handfuls), so serial per-position fetches are fine.

### R5: Frontend holdings panel (variant B)
A new Solid panel behind a third tab ("Holdings") in the existing tab strip —
production label without the prototype's ⚒ marker — rendering the approved
variant B layout: one card per position sorted most ahead-of-pace first
(`profit% − target%` descending), each card showing title
`{SYMBOL} {strike}P ×{contracts}`, expiry + elapsed/total working days, big
unrealized % with `target %`, the pace bar (fill = profit%, tick = target),
the stat strip SOLD AT / NOW (MID, with mark age) / CLOSE CAPTURES $, a
"buy back?" chip when `pace_met` else "holding", and a close… button opening
the outcome dialog (bought-back with close price / expired worthless /
assigned) that shows realized P&L and then deletes the position. A "+ New
position" control opens the add form (symbol, strike, premium, contracts,
sold, expiry) with decimal-friendly entry; a "⟳ Refresh marks" button calls
the refresh route. HTTP via the `api.js` seam. Mobile (≤720px): toolbar
stacks with the labeled refresh on its own full-width row below, the add form
is a 2-column grid with stacked labels and full-width inputs, and the strip
wraps. All decisions/edge handling match the prototype in the working tree.

**Acceptance criteria**
- Given the tab strip, When the user clicks Holdings, Then the panel renders
  and the strip stays visible with Holdings active; clicking Short/Medium
  returns to the results view (strip persists both ways).
- Given the reference example position, When rendered, Then the card shows
  +50.0%, target 40%, 2/5 wd, SOLD AT $1.00, NOW (MID) 0.50 with mark age,
  CLOSE CAPTURES $50.00, and the "buy back?" chip.
- Given a position with a stale mark, When rendered, Then the mark age is
  shown on the card (never hidden staleness).
- Given the add form, When the user types decimal values ("417.50",
  "3.75"), Then they survive keystroke-for-keystroke and submit as numbers;
  invalid/empty numeric fields block submit.
- Given the outcome dialog, When the user confirms "bought back" at a price,
  Then realized P&L is displayed and the position is removed from the list.
- Given refresh with a stale-marked position, When the response arrives,
  Then only affected cards change and a notice confirms the refresh.
- The DOM smoke lane covers panel mount, add-form interaction, pace-bar
  target rendering, and the outcome flow against the built bundle.

### Checkpoints: full
### Review: inline

## Production-risk areas
- **New persisted artifact on GCS FUSE** (R2): additive `holdings/` prefix on
  the /data volume; atomic-write pattern reused; single-writer assumption
  preserved by maxScale 1.
- **External API** (R4): Tiger option-chain queries outside the pipeline;
  degenerate strike-range shape already proven by `test-tiger`; no new
  credentials.
- **Auth-adjacent path derivation** (R3): per-user isolation by construction;
  uid from `VerifiedIdentity` only.

## Setup
- No new dependencies (ids are server-generated; no uuid crate needed). No
  DB migration: the JSON document is created lazily on first write.
- Cloud Run: no manifest change expected (existing /data mount); add the
  holdings path note to the `crates/webapp/README.md` provisioning checklist.
- Verify setup: `cargo test` (core + webapp suites) and
  `npm --prefix crates/webapp/frontend run smoke` pass; locally, adding a
  position creates `<data dir>/webapp/holdings/<uid>.json`.

## Problem

The pipeline finds and scores candidate puts, but once sold, the position
leaves the system: nothing tracks open holdings, nothing marks them to
market, and the close decision (buy back now or hold) is made by eyeballing
the broker app. The user's strategy closes early when premium decay is
ahead of pace — e.g. a put sold at $1.00 dropping to $0.50 within 2 of 5
working days (50% vs a 40% target) is a buy-back. The webapp is the natural
home: it already runs the pipeline, has auth, and is where the user watches
the market.

## Approaches considered

- **Browser localStorage ledger + server mark endpoint** — rejected: data is
  lost on browser clear, fragmented across devices, and the server touches
  the data anyway (Tiger credentials are server-side only), so the "client
  owns it" model buys nothing but fragility.
- **SQLite table keyed by uid** — rejected: the webapp's SQLite lives on
  `/tmp` in Cloud Run (wiped on scale-to-zero), and running SQLite over the
  GCS FUSE volume is unsafe with WAL.
- **Per-user JSON document on the GCS volume** — chosen: durable, isolated
  by construction (uid-derived path), reuses the proven atomic-write and
  read-retry patterns from `result.rs`, and the grant file already
  establishes the small-mutable-server-state precedent.
- **UI: ledger table (A) / urgency cards (B) / focus timeline (C)** —
  prototyped side by side; B chosen: the pace bar vs target tick *is* the
  close decision, cards sort most-ahead-of-pace first, and the grid is the
  only variant natively responsive. Elements of the iteration are folded in:
  stat strip (sold at / now / close captures) replaced the original
  pace-per-day line; per-day pace stays in the data model only.

## Architecture

Three layers, all behind the existing Firebase gate:

1. **Core** — `crates/core/src/holdings.rs`: pure types + math (R1).
   Telegram-free by construction; no I/O.
2. **Webapp** — `crates/webapp/src/holdings.rs`: ledger owner (R2), CRUD
   routes (R3), Tiger marks refresh (R4). Registered in `router.rs` inside
   the auth wrap; document IO via the atomic-write pattern.
3. **Frontend** — `frontend/src/`: holdings panel + `api.js` wrappers (R5).

## Components

- `crates/core/src/holdings.rs` — `Holding`, `Mark`, computed view fns,
  working-day counter, validation. Registered in `lib.rs`.
- `crates/webapp/src/holdings.rs` — document read/write (uid-scoped),
  route handlers, Tiger refresh handler with injectable fetcher seam.
- `crates/webapp/src/router.rs` — merge the new routes inside the auth wrap.
- `crates/webapp/frontend/src/` — `components/HoldingsPanel.jsx` (production
  component distilled from `components/HoldingsPrototype.jsx`),
  `api.js` wrappers (`getHoldings`, `addHolding`, `deleteHolding`,
  `refreshHoldings`), scoped CSS additions, smoke-lane coverage.

## Data flow

Add → validate → document write → 201 + stored position. Read → document
read + pure view computation (no network). Refresh → Tiger per position →
per-position mark/as_of update → document write → per-position ok/stale
response. Close → outcome dialog → DELETE → document rewrite (position
removed). The document is the single source of truth; marks live inside it,
so the view renders from storage alone between refreshes.

## Error handling

No new error enums: core returns `model::Result<T>`; the webapp IO layer
uses `std::io` deliberately, mapping to 400/404/500 at handlers. Malformed
ledger file → empty ledger + warning. Per-position Tiger failure → stale
mark, per-position status, HTTP 200. Invalid payloads → 400 with reason,
no write. Unknown delete id → 404, no write.

## Testing

- Core: pure-pace unit tests incl. the reference example, 1-day floor,
  weekend spans, expiry clamping, no-mark behavior, validation rejects.
- Webapp store: tempdir round-trips, atomic-write, missing/corrupt file.
- Webapp handlers: `tower::ServiceExt::oneshot` with a scripted Tiger
  fetcher seam and tempdir IO; isolation test (uid-derived paths).
- Frontend: extend the DOM smoke lane (mount, add, pace bar, outcome flow).

## Prototype reference

The approved prototype remains in the working tree as the visual/behavioral
reference for implementation — `frontend/src/components/HoldingsPrototype.jsx`
plus its dev-gated wiring in `App.jsx` (tab strip integration, `protoTab()`
swap) and the `PROTOTYPE (throwaway)` CSS section in `style.css`. Everything
it renders is dev-gated (`import.meta.env.DEV`) and absent from production
bundles. During implementation: distill the winner into the real components,
then remove the prototype file, the `protoTab()` wiring, and the prototype
CSS — per the prototype capture rule, the full set is preserved on a
throwaway branch at finalizing, not on main. The stub pace math in
`HoldingsPrototype.jsx` (working-day counter, 1-day-floor target) is the
executable spec for R1 — port it, don't reference it from production code.

## Feature acceptance

- Given a fresh ledger, When I add GOOG strike 350 expiring in 5 working
  days, premium 1.00, 1 contract, sold 2 working days ago, and press
  "⟳ Refresh marks" which reports a 0.50 mid, Then the card shows SOLD AT
  $1.00, NOW (MID) 0.50 with a fresh mark age, CLOSE CAPTURES $50.00,
  +50.0% against target 40% (2/5 working days), and the "buy back?" chip —
  and after confirming "bought back at 0.50" in the outcome dialog, the
  position is gone and the ledger document no longer contains it.

### Feature review: auto
