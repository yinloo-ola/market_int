# ADR 0001: Holdings ledger is a per-user JSON file on the GCS FUSE volume

## Context

The holdings feature (2026-09-11) must persist user-entered put positions
across Cloud Run restarts and scale-to-zero. The webapp's SQLite database is
`/tmp` scratch — wiped on every instance recycle — and the only durable mount
is the GCS FUSE volume at `/data`, served at maxScale 1 (single writer).
Auth is Firebase-based: every request carries a verified identity.

## Decision

Each user's ledger is one schema-versioned JSON document at
`/data/webapp/holdings/<firebase-uid>.json`, written with the result-doc
atomic pattern (same-dir temp + fsync + rename, per-process temp
uniquifier), read with a retry-once parse. The uid is derived server-side
from the verified identity only.

## Why

- **SQLite is not durable here**: it lives on `/tmp` in both the Job and the
  webapp, and running SQLite over GCS FUSE is unsafe with WAL (rename-based
  atomicity semantics the FUSE layer does not honor reliably).
- **localStorage is not durable or multi-device**: clearing site data
  destroys the ledger, and mark-to-market must transit the server anyway
  (Tiger credentials are server-side only), so "client owns the data" buys
  fragility without privacy.
- **A JSON file per uid** isolates users by construction (the path can never
  be client-named), reuses the proven `result.rs` atomic-write precedent,
  and needs no query layer — the ledger is a handful of open positions.

## Consequences

Adding query semantics (history, aggregation) later means a real migration
to a durable datastore — do not "simplify" this to SQLite on Cloud Run
without solving persistence first. Concurrent mutations for one uid are
last-writer-wins at the fast-path level (refresh re-reads and merges after
its external fetch); acceptable for a single-user-per-ledger tool.
