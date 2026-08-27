# market_int webapp

Single-page put-selling candidate browser (design spec: `.scratch/webapp/spec.md`,
build tickets: `.scratch/webapp/issues/10..21`). This crate boots an axum server
that serves the compiled frontend plus local-file API endpoints — it never
touches upstream APIs directly and cannot link Telegram publishing code
(enforced at the workspace level: depends only on `market_int_core`).

## Quick demo (release binary, embedded assets)

From repo root:

```bash
cd crates/webapp/frontend && npm install && npm run build && cd ../..
cargo build --release -p market_int_webapp
./target/release/market_int_webapp --result-file crates/webapp/fixtures/sample_last_run.json
# open http://127.0.0.1:8080
```

The fixture renders two timeframes' sample rows exactly as a real run would.

## Local development (hot reload)

Two terminals:

```bash
# terminal 1 — backend on :8080
cargo run -p market_int_webapp            # debug build; reads dist/ from disk

# terminal 2 — vite dev server on :5173, proxying /api -> :8080
cd crates/webapp/frontend && npm run dev
```

Edit `frontend/src/*` — the page at `http://localhost:5173` reloads live.
Production naming note: vite emits stable names (`assets/app.js|css`, all
other assets inlined), which lets the release build include them via
`include_str!`/`include_bytes!` with compile-checked paths.

## Configuration

| source | value |
|---|---|
| CLI flag | `--result-file <path>` |
| env | `webapp_result_file` |
| default | `/data/webapp/last_run.json` |

Freshness window comes from `market_int_core::constants::WEBAPP_CACHE_SECS`
(600s) and is reported to the client as `cache_secs` in `/api/latest`.

## Endpoints today (ticket 15 scope)

- `GET /api/latest` — envelope `{schema_version, age_secs, cache_secs,
  cache_state fresh|stale|none, run_state:{status:"idle"}, result}`.
  Always HTTP 200; no-data branches on `result === null`.
- `GET /`, static fallback — embedded (release) or disk-read (debug) assets.

Run triggering/streaming arrives with ticket 18; auth gate with 17.

## Why includes instead of rust-embed

Attempted first, found the hard way: rust-embed's directory walker honors
`.gitignore`, which silently emptied the embedded set once dist was ignored.
The include-based split gives the same guarantees (single self-contained
binary in release; live-reload reads in debug) with compile-checked paths and
no hidden walkers. See ticket 15's implementation notes.
