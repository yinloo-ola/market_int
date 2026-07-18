# AGENTS.md

## Project Overview

`market_int` is a Rust CLI tool for US equity market intelligence. It pulls stock quotes, calculates technical indicators (ATR, max drop, Sharpe ratio, price percentile), retrieves put option chains via the Tiger Brokers API, scores them using a composite model, and publishes top picks to Telegram.

**Key technologies:** Rust (edition 2024), SQLite (rusqlite with bundled feature), Tiger Brokers API (option chains, earnings calendar), MarketData API (quotes/candles), Telegram Bot API, Google Cloud Run Jobs.

**Architecture:**

- `src/main.rs` — CLI entry point with `clap` subcommands
- `src/quotes.rs` — Fetches and stores OHLCV candle data
- `src/atr.rs` — Average True Range calculation
- `src/maxdrop.rs` — Maximum drop over a configurable period
- `src/sharpe.rs` — Sharpe ratio calculation and storage
- `src/price_percentile.rs` — 20-day price percentile
- `src/option.rs` — Option chain retrieval, scoring, and Telegram publishing
- `src/model.rs` — Domain types, error enums, scoring functions (`calculate_put_score`, `calculate_put_chain_score` [earnings-aware], `calculate_strike_percentile`, `option_chain_to_csv_vec`)
- `src/marketdata/` — MarketData API client and response types
- `src/tiger/` — Tiger Brokers API client (RSA-signed auth, option chains, earnings calendar)
- `src/store/` — SQLite persistence layer (candle, true_range, max_drop, sharpe_ratio, price_percentile, trend, option_chain, earnings)
- `src/constants.rs` — All tunable constants (candle count, thresholds, scoring weights)
- `src/symbols.rs` — Reads newline-separated symbols from CSV file
- `src/http/` — Shared HTTP client

## Setup Commands

- Install dependencies and build: `cargo build`
- Create a `.env` file in the project root with these variables:
  ```
  marketdata_token=<MarketData API token>
  telegram_bot_token=<Telegram bot token>
  telegram_chat_id=<Telegram chat ID>
  sqlite_file=<path to SQLite DB file, e.g. /path/to/data/data.db>
  TIGER_ID=<Tiger broker account ID>
  TIGER_RSA=<Tiger RSA private key (base64)>
  RUST_LOG=info
  ```
- The SQLite database is auto-created at the path specified by `sqlite_file`.

## Development Workflow

- Check compilation (fast): `cargo check`
- Build debug: `cargo build`
- Build release: `cargo build --release`
- Run with logging: `RUST_LOG=debug cargo run -- <subcommand> <symbols_file>`
- Most commands take a symbols file path as argument (e.g., `data/symbols.csv`)
- Symbols file format: one ticker symbol per line (plain text, not CSV with headers)

### Available Subcommands

| Subcommand | Description |
|---|---|
| `pull-quotes <path>` | Fetch candles from MarketData API |
| `perform-all <path>` | Run full pipeline (quotes → ATR → max drop → Sharpe → trend → price percentile → option chains) |
| `pull-option-chain5-day <path>` | Pull option chains with ~5-day expiry |
| `pull-option-chain20-day <path>` | Pull option chains with ~20-day expiry |
| `publish-option-chain <path>` | Publish top picks to Telegram (re-publish from DB) |
| `test-tiger <symbols>` | Test Tiger API with comma-separated symbols |
| `backtest <path>` | Run backtest simulation (`--earnings <csv>` applies the earnings rule; see `fetch-earnings`) |
| `fetch-earnings <from> <to>` | Fetch the earnings calendar from Tiger to a CSV (feeds `backtest --earnings`) |

### Makefile Targets

Convenience targets are available in the `Makefile` (e.g., `make pull-quotes`, `make perform-all`, `make test-tiger SYMBOLS="AAPL,MSFT"`).

## Testing Instructions

- Run all tests: `cargo test`
- Run a specific test: `cargo test <test_name>`
- All tests are unit tests in `src/model.rs` (`mod tests` block)
- Tests cover: `calculate_strike_percentile`, `calculate_put_score`, `calculate_trend_factor`, `momentum_flag`, `option_chain_to_csv_vec` (top picks uniqueness, trend filter)
- No integration tests or external API tests — all tests are pure functions with no I/O
- **Always run `cargo test` before committing**

## Code Style

- **Language:** Rust, edition 2024
- **Error handling:** Custom `QuotesError` enum in `model.rs` with `thiserror`-style variants; uses `model::Result<T>` alias
- **Logging:** `log` crate with `env_logger`; use `log::info!`, `log::error!`, etc.
- **Database:** rusqlite with WAL journal mode; each domain concept has its own module under `src/store/`
- **Naming:** `snake_case` for functions/variables, `PascalCase` for types, modules are `snake_case`
- **Imports:** Grouped by std → external → crate; avoid glob imports in non-test code
- **Constants:** All tunable parameters live in `src/constants.rs`

## Build and Deployment

### Docker

```bash
# Build and push (requires `tag` variable)
make docker-build tag=x.y.z
```

- Base image: `rust:latest` (builder) → `gcr.io/distroless/cc` (runtime)
- Binary is stripped for size
- Image pushed to `us-west1-docker.pkg.dev/opt-intel/docker-repo/market-int:<tag>`

### Google Cloud Run Job

```bash
# Update the job (after pushing new image)
make gcloud-job
```

- Job definition: `job.yaml` — update the image tag before deploying
- The `make docker-build` target auto-updates `job.yaml` with the new tag
- Region: `us-west1`
- Secrets (`marketdata_token`, `telegram_bot_token`) are fetched from Google Secret Manager
- Data persisted via GCS FUSE mount at `/data`

## Security Considerations

- **Never commit `.env`** — it contains API tokens and RSA private keys (already in `.gitignore`)
- **Never commit `data/`** — contains the SQLite database with cached market data
- Tiger API uses RSA-signed requests; the private key is in `.env` as `TIGER_RSA`
- Cloud Run secrets are injected via Secret Manager, not hardcoded in `job.yaml`

## Additional Notes

- The option scoring model uses a weighted composite: 30% trend (EMA ratio), 30% safety (1 − strike percentile), 20% Sharpe, 20% return proximity to ideal (0.35)
- Pre-filters reject options with: rate of return outside [0.25, 0.65], Sharpe ≤ 0, strike percentile > 0.60, or trend ratio < 0.98 (below EMA)
- Strike ranges are tightened by up to 25% when trend is strong (price well above EMA)
- Top picks are deduplicated by underlying symbol (max 3 picks)
- Momentum flags (`NORMAL` / `HIGH` / `EXTENDED`) are based on price percentile thresholds (0.80 / 0.90)
