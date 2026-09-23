# Design: Multiple cash pools in the Holdings wheel ledger

## At a glance

The holdings ledger tracks a single cash balance, but the user trades across more than one broker account and needs to track — and spend from — each account's cash separately. This design adds named **cash pools**: a new `cash_pools` array on the ledger document (ADR-002 additive pattern, schema stays 1), a `pool_id` on puts and share lots, per-pool reserved/free cash math, a pool dropdown in the put-add form, and a pool selector + manage-pools UI in the side rail. Old ledgers keep working untouched: a legacy scalar `cash` is treated as one implicit "Main" pool and is materialized as a real pool on the first mutation.

**Key decisions**
- New top-level `cash_pools` sibling field with `#[serde(default)]`, old `cash` kept but no longer read — exactly the ADR-002 additive pattern; rollback-safe serialization.
- Pools partition the existing reserved/free math — no new arithmetic, just grouping by `pool_id` (`rejected: separate ledger documents per account — duplicates the whole CRUD/refresh surface for no gain`).
- Lazy migration: implicit "Main" until the first write materializes it — read paths never rewrite documents.

| R# | Requirement in one line | Risk |
|----|--------------------------|------|
| R1 | Ledger gains `cash_pools` + `pool_id` on puts/lots, old ledgers read as implicit "Main" | ⚠ production-risk (schema) |
| R2 | Pool CRUD + per-pool cash edit behind the existing API and rail UI | ⚠ production-risk (schema/storage) |
| R3 | Reserved/free cash computed per pool; put form picks a pool | ⚠ production-risk (schema) |
| R4 | Assignment and called-away route cash and lots through the put's/lot's pool | ⚠ production-risk (schema) |

## Requirements

### R1: Pool fields on the ledger document
`HoldingsDocument` gains `#[serde(default)] cash_pools: Vec<CashPool>` where `CashPool { id, name, cash: f64 }`; `Holding` (put) and `ShareLot` gain `#[serde(default)] pool_id: Option<String>`. Reads of a document with empty `cash_pools` but a set scalar `cash` behave as if one pool "Main" with that cash existed. `LEDGER_SCHEMA_VERSION` stays 1.

**Acceptance criteria**
- Given an old-shape ledger (pre-pools JSON with only `cash`), When GET /api/holdings returns it, Then the response shows a single effective pool "Main" carrying the old cash value, and all existing fields are unchanged.
- Given a pre-pools ledger document, When it is loaded, Then it parses without error and the in-memory view exposes the implicit Main pool.
- Given a full-wheel document using pools, When it is serialized and re-parsed, Then it round-trips losslessly (the ADR-002 drift-guard test pair extended with `cash_pools`/`pool_id`).
- Given any ledger, When the list response is produced, Then `cash`/`cash_free` aggregates remain present (back-compat) alongside a new `cash_pools: [{id, name, cash, reserved, free}]` array whose frees sum to the aggregate free.

### R2: Pool management API and rail UI
POST /api/holdings with `kind: "pool"` adds a pool (`{name}`; id server-generated). PATCH /api/holdings/cash becomes pool-aware (`{pool_id?, cash}` — missing `pool_id` targets the first pool) and also renames (`{pool_id, name}`). DELETE of a pool is rejected while any put or lot references its id. The rail shows a pool selector; a manage-pools affordance supports add/rename/delete and per-pool cash edit.

**Acceptance criteria**
- Given a ledger, When a pool is added, Then it appears in the rail selector and the list response with its own cash/reserved/free.
- Given a pool with dependent puts or lots, When DELETE is attempted, Then the API rejects (409-class error) and the document is unchanged; When the dependencies are removed and DELETE is retried, Then the pool is gone and the rail no longer lists it.
- Given PATCH cash with a `pool_id`, When applied, Then only that pool's cash changes and its `free` reflects it.
- Given PATCH cash with no `pool_id` on a legacy (implicit-Main) ledger, When applied, Then behavior matches today's route exactly.
- Given a negative, non-finite, or missing cash value in any pool mutation, When submitted, Then the request is rejected and the document is unchanged (same rules as today's PATCH cash).

### R3: Per-pool reserved/free math and put-form pool choice
`reserved_cash`/`free_cash` partition by `pool_id`: each put reserves strike×100×contracts against its pool; puts with `pool_id: None` reserve against the first pool. Core gains pure per-pool partition functions. The put-add form shows a pool dropdown (first pool preselected) and the created put carries the chosen `pool_id`.

**Acceptance criteria**
- Given two pools with puts of known strike/contracts in each, When the list response is produced, Then each pool's `reserved` equals its own puts' Σ strike×100×contracts and its `free` = pool cash − pool reserved (negative shown honestly, never clamped).
- Given a put with `pool_id: None` among pools, When reserved is computed, Then it counts against the first pool.
- Given the put-add form open, When the user selects a pool and submits, Then the stored put carries that `pool_id` and reserves against it on the next read.
- Given calls and lots, When reserved is computed, Then they reserve nothing (unchanged rule — the cash-secured assumption lives entirely in the puts book).

### R4: Assignment and called-away respect pools
When a put is assigned, the resulting share lot is created in the put's pool and that pool's cash decreases by strike×100 (moved into the lot's cost basis). When shares are called away, the lot is reduced within its own pool. Calls inherit the pool of the shares they're written against; the call form has no separate pool picker.

**Acceptance criteria**
- Given a put in pool B with sufficient pool cash, When it is assigned, Then the lot appears with pool B's id, pool B's cash drops by strike×100, and pool A's figures are untouched.
- Given an assigned lot in pool B, When called away, Then the FIFO reduction applies to that lot and pool B's cash/figures reflect it; no cross-pool movement occurs.
- Given a call written against lots of one pool, When queried, Then it carries that pool's id.

### Checkpoints: none
### Review: skip

## Production-risk areas

- **Ledger schema migration** — new sibling fields on the persisted per-user GCS JSON; governed by docs/adr/002 (additive `#[serde(default)]`, schema stays 1, drift-guard test pair). Rollback erases pools (whole-document rewrite) — the old `cash` scalar is retained in output for that reason.
- **Storage/atomic writes** — pools add no new files or concurrency; the existing temp+fsync+rename single-document rewrite is unchanged.

## Setup

No new dependencies, external APIs, or seed data. Migration is lazy (implicit Main) — verify by loading a pre-pools ledger and confirming the list response shows one "Main" pool. Run `cargo test -p market_int_core -p market_int_webapp` and `npm --prefix crates/webapp/frontend run smoke`.

## Approaches considered

- **Pool partition inside one document (chosen)** — matches ADR-002, reuses all CRUD/refresh/atomic-write machinery, sums to the existing aggregates.
- **One ledger document per account** — rejected: duplicates the document store, auth mapping, refresh seam and every view for what is a partition of one number.
- **Eager migration on read** — rejected: read paths must never rewrite documents (GCS cost, surprise writes); lazy materialization on first mutation keeps reads pure.

## Architecture & components

- `crates/core/src/holdings.rs` — `pool_id` on `Holding`/`ShareLot`; pure partition helpers (per-pool reserved/free) beside the existing `reserved_cash`/`free_cash`; the aggregate functions become sums over pools. No serde in core (JSON shapes stay in the webapp layer).
- `crates/webapp/src/holdings.rs` — `CashPool` type + `cash_pools` on `HoldingsDocument`; effective-pool resolution (implicit Main); pool routing in add/PATCH/DELETE `kind` dispatch; assignment (`assigned_from`) and called-away FIFO route through pool ids; list response gains `cash_pools` array, keeps aggregates.
- `crates/webapp/frontend/src/components/HoldingsPanel.jsx` — rail cash strip becomes pool-aware (selector + per-pool big number); manage-pools affordance (add/rename/delete, per-pool cash edit); `OptionForm` gains a pool dropdown for puts.

## Data flow

Same single-document flow as today: auth uid → `<uid>.json` load → mutate → atomic rewrite. Pools only change the document's internal shape and the partition of the cash math. `MarkBatch{marks, spots}` refresh is untouched — it never modifies cash.

## Error handling

- Pool mutations reuse today's validation shape: negative/non-finite cash rejected; unknown `pool_id` in a put/cash PATCH rejected (400-class) rather than silently dropped.
- Pool delete with dependents → 409-class rejection, document untouched.
- Legacy documents never fail: empty `cash_pools` degrades to implicit Main; `pool_id: None` degrades to first pool.

## Testing

- Core: pure partition-math tests (per-pool reserved/free, None→first-pool fallback, sums equal aggregates).
- Webapp: old-shape parse with implicit Main; extended ADR drift-guard round-trip with pools; pool add/rename/delete incl. dependent-delete rejection; pool-aware PATCH cash (targeted + legacy no-`pool_id` parity); put-add carries `pool_id`; assignment moves cash into the right pool's lot; called-away stays in-pool. Full-wheel E2E through the axum router extended with a two-pool scenario.
- Smoke lane: pool dropdown submits with the put; rail shows per-pool figures; manage-pools add/delete reflected. Existing cash-strip string assertions updated to the pool-aware rail.

## Feature acceptance

- Given a legacy ledger with cash 80,000, When the user opens Holdings, Then one "Main" pool shows 80,000 free; When the user adds pool "IBKR" with 50,000, sells a put in IBKR at strike 100 ×1, and assigns it, Then IBKR shows cash reduced by 10,000 with a lot in IBKR, Main is untouched, and the aggregates equal the sum of the pools.

### Feature review: auto
