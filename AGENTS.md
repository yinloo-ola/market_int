# AGENTS.md

## Project Overview

`market_int` is a Rust workspace for US equity market intelligence. A shared
core library scores put-option chains from the Tiger Brokers API; two binaries
consume it: a CLI that publishes top picks to Telegram on a scheduled Cloud Run
Job, and a webapp (axum + Solid) that runs the same pipeline in-request and
serves the full scored pool over HTTP.

**Key technologies:** Rust (edition 2024, virtual Cargo workspace), SQLite
(rusqlite, bundled feature), Tiger Brokers API (quotes, option chains,
earnings calendar — RSA-signed), Telegram Bot API (CLI only), axum + Solid
(webapp), Google Cloud Run (Job + Service on one image), vite for the
frontend build.

**Workspace layout (three-crate virtual workspace, 2026-08):**

- `crates/core/` — package `market_int_core` (lib): domain types, scoring,
  stores, Tiger client, metrics, pipeline. **Telegram-free by construction** —
  the webapp depends only on core, so it cannot link publishing code.
  - `src/model.rs` — domain types, `QuotesError`, scoring
    (`calculate_put_score`, `calculate_put_chain_score`,
    `calculate_put_chain_score_components` — the single scoring
    implementation the public fn delegates to — `calculate_strike_percentile`,
    `scored_chain_rows`, `option_chain_to_csv_vec` + `csv_from_scored_rows`)
  - `src/pipeline.rs` — shared `perform_all` (quotes → metrics → requester →
    chains-short → chains-medium), injected `PublishHook`, `ProgressReporter`
    events, `RunCoverage`, `StageReport`
  - `src/option.rs` — chain retrieval/persistence + strike-band math
    (`retrieve_option_chains` returns `RetrievedData`)
  - `src/quotes.rs` — Tiger-backed candle pulls (`pull_and_save`)
  - `src/stats.rs` — EMA, percentile, `estimate_historical_volatility`
  - `src/greeks.rs` — Black-Scholes Greeks (cumulative_normal,
    black_scholes_put, put_delta, implied_volatility)
  - `src/tiger/` — Tiger API client (RSA-signed; option chains, earnings
    calendar, quotes)
  - `src/store/` — SQLite persistence (candle, max_drop, sharpe_ratio,
    price_percentile, trend, option_chain, earnings, sqlite)
  - `src/constants.rs` — tunables incl `API_BATCH_SIZE`,
    `PERFORM_ALL_SPY_TREND_RATIO`, `WEBAPP_CACHE_SECS`, `VOL_TIER_*`
  - `src/http/` — shared reqwest client
- `crates/cli/` — package `market_int` (binary name kept so
  `target/release/market_int`, the Docker ENTRYPOINT and `job.yaml` survive):
  `main.rs` (clap arms), `publish.rs` (Telegram publishing — the ONLY crate
  that may reference the Telegram SDK), `backtest.rs` (simulation).
- `crates/webapp/` — package `market_int_webapp`: axum server
  (`api.rs` /api/latest, `run.rs` POST /api/run + SSE progress,
  `auth.rs` Firebase token gate, `result.rs` frozen last-run JSON document,
  `assets.rs` embedded frontend) + vite/Solid frontend under `frontend/`
  (see `crates/webapp/README.md`).

Dead modules removed in 2026-08: `src/atr.rs`, `src/dropbox.rs`, and
`src/marketdata/` (none were compiled at removal time — git history retains
them; the `marketdata_token` env survives in the manifests though no code
reads it anymore).

## Setup Commands

- Build all members: `cargo build`
- Create a `.env` in the project root (CLI + pipeline need these):
  ```
  marketdata_token=<MarketData API token>
  telegram_bot_token=<Telegram bot token>
  telegram_chat_id=<Telegram chat ID>
  sqlite_file=<path to SQLite DB file, e.g. /data/data.db>
  TIGER_ID=<Tiger broker account ID>
  TIGER_RSA=<Tiger RSA private key (base64)>
  RUST_LOG=info
  ```
- Webapp additionally reads `webapp_result_file` (default
  `/data/webapp/last_run.json`), `webapp_bind` (default `0.0.0.0:8080`),
  and arms auth when `FIREBASE_PROJECT_ID` is set.
- SQLite tables are created lazily by the store helpers.

## Development Workflow

- Check: `cargo check` · Debug build: `cargo build` · Release: `cargo build --release`
- Every run target needs the package flag (multiple workspace binaries):
  `cargo run -p market_int -- perform-all data/symbols.csv`
- Subcommands (CLI): `pull-quotes`, `pull-option-chain5-day`,
  `pull-option-chain20-day`, `publish-option-chain`, `perform-all`,
  `test-tiger`, `backtest`, `fetch-earnings` — see `--help`.
- Webapp local dev (two terminals):
  1. `cargo run -p market_int_webapp` (binds 0.0.0.0:8080; override
     `webapp_bind=127.0.0.1:8080` to keep it loopback-only)
  2. `npm --prefix crates/webapp/frontend run dev` (vite :5173 proxies /api)
- Frontend build: `make webapp-frontend` (or
  `npm --prefix crates/webapp/frontend ci && npm --prefix crates/webapp/frontend run build`)
  — **required before any release build**: the webapp embeds
  `frontend/dist` via `include_str!`/`include_bytes!` at compile time
  (stable names `assets/app.js|css` + favicon.svg, favicon-32.png,
  apple-touch-icon.png; no hashing).
- DOM smoke (frontend, ticket 19): `npm --prefix crates/webapp/frontend run smoke`
- `make test-tiger SYMBOLS="AAPL,MSFT"` probes the Tiger API.
- Makefile targets cover the usual flows (`make help`); deploy flow:
  `make docker-build tag=x.y.z` → `make gcloud-service` (webapp) /
  `make gcloud-job` (scheduled Telegram Job).

## Testing Instructions

- Run everything: `cargo test` (workspace root runs all three members).
- One member: `cargo test -p market_int_core`.
- Tests live in 18 `#[cfg(test)]` modules (181 tests as of 2026-08): core
  `model, metrics, greeks, regime, sectors, maxdrop, trend, option, pipeline,
  store/earnings, store/trend, tiger/api_caller`; cli `backtest, publish`;
  webapp `result, api, auth, run`. (AGENTS.md's earlier "all tests in
  model.rs" was stale even before the workspace split.)
- Culture: pure-function/hermetic tests; fixtures over mocks; the pipeline is
  tested through an injectable requester factory (loopback stub, no network);
  the pipeline-level suite pins barrel-on semantics, event seq arithmetic and
  the §5 cache gate. Frontend logic has one DOM smoke lane (`npm run smoke`,
  happy-dom) asserting expansion/tooltips/states against the built bundle;
  no vitest/jest by decision.
- Always `cargo test` before committing.

## Code Style

- Rust edition 2024; `rustfmt` defaults; `snake_case` fns, `PascalCase` types.
- Imports grouped std → external → crate; no glob imports outside `#[cfg(test)]`.
- Errors: domain crates use `model::QuotesError` / `model::Result<T>`;
  the webapp's IO layer uses `std::io` deliberately. No new error enums for
  the pipeline — `QuotesError::HttpError(RequestError::Other(..))` carries the
  one fatal (requester-init) case.
- Logging via `log` macros (`env_logger` in binaries). Log lines from the
  shared pipeline mirror the historical CLI wording verbatim.
- Tunables belong in `crates/core/src/constants.rs`
  (`MIN_RATE_OF_RETURN` 0.30, `API_BATCH_SIZE` 10, `PERFORM_ALL_SPY_TREND_RATIO`
  1.05, `WEBAPP_CACHE_SECS` 600, `VOL_TIER_HIGH/MID` 0.38/0.28, scoring
  weights, `TOP_PICKS_COUNT` 3, momentum thresholds 0.80/0.90).
- Frontend follows the same import-grouping spirit; Solid JSX (1.9),
  stable unhashed asset names, and one HTTP seam (`src/api.js`).

## Build and Deployment

### Docker (multi-stage: node frontend → rust builder → distroless/cc runtime)

```bash
make docker-build tag=x.y.z   # builds linux/amd64, pushes, stamps job.yaml + service.yaml
```

- One image, two binaries: ENTRYPOINT `/market_int/market_int` (the scheduled
  Job is untouched); the webapp Service overrides `command:` to
  `/market_int/market_int_webapp` (`service.yaml`).
- The frontend is built INSIDE the image (node stage) — no host node needed
  for releases; local dev does need it (see webapp README).

### Google Cloud Run

- Scheduled Telegram Job: `make gcloud-job` (rarely — job.yaml rarely changes).
- Webapp Service: `make gcloud-service` (deploys `service.yaml`).
- `service.yaml`: h2c port 8080, timeout 900s, maxScale 1 (single writer for
  the GCS artifacts — last_run.json + grant file; SQLite scratch lives on /tmp
  in both the Job and the webapp), concurrency 80, gen2 env, GCS FUSE volume
  at /data (symbols.csv, last_run.json, allowed_emails.txt only).
- Secrets: `marketdata_token`, `tiger_id`, `tiger_rsa` (Secret Manager);
  `FIREBASE_PROJECT_ID` is public. Provisioning checklist:
  `crates/webapp/README.md` + spec §7.3.
- Cost posture: scale-to-zero, no min-instances ⇒ $0 idle.

## Security Considerations

- Never commit `.env` (API tokens + Tiger RSA key) or `data/` (SQLite).
- Frontend Firebase config values are public by design; security is enforced
  server-side by Bearer verification on every `/api` route
  (`firebase-auth` crate, JWKS auto-refresh, armed by `FIREBASE_PROJECT_ID`).
- Telegram credentials are readable only by the CLI crate; the webapp cannot
  link that code (workspace dependency direction).
- Tiger API requests are RSA-signed (`TIGER_ID` / `TIGER_RSA`).

## Additional Notes

- Scoring model: 20% Sharpe + 40% safety (max_drop band position, or
  `1 + delta` when Tiger supplies real delta) + 40% return proximity to ideal
  (0.80); trend term wired but weight 0.0 (2026-07 sweep). Pre-filters reject
  ror < 0.30 and Sharpe ≤ 0. `score_components` on every result row comes
  from the same implementation as the total (property-tested).
- The webapp runs the SAME pipeline with `publish: None` — results go to
  `/data/webapp/last_run.json` (frozen §4 schema, atomic write, retry-once
  read) instead of Telegram; the 10-minute completion-anchored cache gates
  the Run button (not HTTP caching).
- Pipeline failures barrel on (chains run over a stale DB after a failed
  quotes stage); requester-init failure is the only fatal outer error.
- Effort records: `.scratch/webapp/spec.md` (authoritative design) and
  `.scratch/webapp/issues/` (tickets 01–21).
