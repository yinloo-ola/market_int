# ADR 0002: Holdings ledger schema evolves by additive serde defaults; version stays 1

## Context

The wheel-holdings feature (2026-09-17) added covered calls, share lots, and
a cash balance to the per-user ledger document — the second growth iteration
(the R6 `mark.underlying_price` field was the first). Ledger documents live
on the GCS FUSE volume (ADR 0001), every mutation rewrites the whole file,
and the service ships as one image with no migration tooling.

## Decision

New document fields are sibling top-level arrays/scalars, each annotated
`#[serde(default)]`; `LEDGER_SCHEMA_VERSION` stays `1`. No
`deny_unknown_fields` anywhere. Collections are typed concretely (sibling
arrays `positions` / `calls` / `lots`), not a tagged position enum.

## Why

- Additive defaults make old documents parse forever **and** new documents
  parse under old binaries — zero migration, zero dual-version handling. A
  v2 bump would force every reader to branch on two versions to gain
  nothing: defaults already express "absent = empty".
- A tagged enum puts three divergent shapes behind one match in every
  consumer; sibling arrays keep handlers concretely typed and old documents
  deserialize with empty collections.
- The drift guard in place of a version number is the test pair: an
  old-shape document loads with empty defaults, and a full-wheel document
  round-trips losslessly (the document derives `PartialEq`).

## Consequences

- **Rollback erases new data.** A pre-wheel binary parses the new documents
  fine (it just ignores the unknown keys) but holds only `positions` — its
  next whole-document rewrite silently drops `calls`, `lots`, and `cash`.
  Back up `/data/webapp/holdings/` before rolling back past a
  ledger-bearing image. Forward-only deploys are the real runbook.
- Old binaries never fail loudly on new documents, so a rollback is silent
  until the data loss — there is no upgrade/downgrade matrix to lean on.
- A misspelled new field fails silently (no unknown-field guard); the
  lossless round-trip test is what catches schema typos, so it must keep
  covering every persisted field.
