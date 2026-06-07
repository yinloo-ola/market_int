# Collapse the metric-calculation pipeline

## Design

Replace five shallow orchestration modules (atr, maxdrop, sharpe, trend, price_percentile) with one deep module `metrics.rs`. Each module currently repeats the same pattern: read symbols → fetch candles → compute → save. The pure computation functions stay where they are. Only the `calculate_and_save` wrappers get deleted.

`PerformAll` becomes the only production entry point. Standalone subcommands (`calculate-atr`, `calculate-max-drop`, `calculate-sharpe-ratio`, `calculate-price-percentile`, `calculate-trend`) are deleted.

**Simple change — no design review needed.**

## References

- Architecture review: `/tmp/architecture-review-market-int.html` (Candidate 1)
- Lessons: `docs/lessons.md`

---

## Task 1: Create `src/metrics.rs` with `run_all` and make ATR helpers pub

<!-- tdd: modifying-tested-code -->
<!-- checkpoint: test -->

Create the consolidated pipeline module and widen visibility on the ATR helpers it needs.

**Important:** `atr::true_ranges_ratio`, `atr::true_range_ratio`, `atr::calculate_range`, and `atr::ema` are currently private. `metrics.rs` calls `true_ranges_ratio`, so it must be made `pub`. Make all four `pub` — they're pure math and useful to callers.

Acceptance Criteria (QA Engineer Hat):
- **Happy Path**:
  - Given: A symbols file with valid symbols and a DB with candle data
  - When: `metrics::run_all(symbols_file, &mut conn)` is called
  - Then: ATR, max drop (period 5 and 20), Sharpe ratio, trend, and price percentile are computed and saved for each symbol. `Ok(())` is returned.
- **Edge Case (empty symbols file)**:
  - Given: A symbols file with no valid symbols
  - When: `metrics::run_all` is called
  - Then: `Err(QuotesError::EmptySymbolFile)` is returned before any DB writes.
- **Edge Case (insufficient candles)**:
  - Given: A symbol with fewer candles than `SHARPE_MIN_CANDLES`
  - When: `metrics::run_all` processes that symbol
  - Then: Sharpe is skipped (warn logged), but other metrics that need fewer candles (e.g., price percentile with 20 days) are still computed and saved.

Files:
- `src/atr.rs` (modify — make 4 helper functions pub)
- `src/metrics.rs` (create)
- `src/main.rs` (modify — add `mod metrics;`)

Steps:
1. In `src/atr.rs`, change these four functions from `fn` to `pub(crate) fn`:
   - `true_ranges_ratio`
   - `true_range_ratio`
   - `calculate_range`
   - `ema`
   (Keep `exponential_moving_average` and `percentile` as `pub fn` — they already are.)

2. Create `src/metrics.rs` with this implementation:

```rust
use crate::constants;
use crate::model;
use crate::store;
use crate::symbols;

/// Runs the full metric-calculation pipeline for all symbols.
/// Reads symbols once, loads candles once per symbol, computes all metrics, saves results.
pub fn run_all(
    symbols_file_path: &str,
    conn: &mut rusqlite::Connection,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Ensure all target tables exist
    store::true_range::create_table(conn)?;
    store::max_drop::create_table(conn)?;
    store::sharpe_ratio::create_table(conn)?;
    store::trend::create_table(conn)?;
    store::price_percentile::create_table(conn)?;

    for symbol in symbols {
        // Load candles once per symbol — enough for the longest window (EMA_LONG_PERIOD)
        let candles = match store::candle::get_candles(conn, &symbol, constants::EMA_LONG_PERIOD) {
            Ok(c) => c,
            Err(_) => {
                log::warn!("No candles found for {}, skipping", symbol);
                continue;
            }
        };

        if candles.is_empty() {
            log::warn!("No candles found for {}, skipping", symbol);
            continue;
        }

        let timestamp = candles.last().unwrap().timestamp;

        // ATR (weekly candles, needs CANDLE_COUNT for full window)
        compute_and_save_atr(conn, &symbol);

        // Max drop — periods 5 and 20
        compute_and_save_max_drop(conn, &symbol, &candles, 5);
        compute_and_save_max_drop(conn, &symbol, &candles, 20);

        // Sharpe ratio
        compute_and_save_sharpe(conn, &symbol, &candles, timestamp);

        // Trend (EMA20/EMA50)
        compute_and_save_trend(conn, &symbol, &candles, timestamp);

        // Price percentile (20-day window)
        compute_and_save_price_percentile(conn, &symbol, &candles, timestamp);
    }

    log::info!("Completed metric calculation pipeline");
    Ok(())
}

fn compute_and_save_atr(
    conn: &mut rusqlite::Connection,
    symbol: &str,
) {
    // ATR needs the full CANDLE_COUNT of candles — refetch independently
    let full_candles = match store::candle::get_candles(conn, symbol, constants::CANDLE_COUNT) {
        Ok(c) => c,
        Err(_) => {
            log::warn!("No candles for {} ATR, skipping", symbol);
            return;
        }
    };

    if full_candles.is_empty() {
        log::warn!("No candles for {} ATR, skipping", symbol);
        return;
    }

    let weekly_candles: Vec<model::Candle> = full_candles
        .chunks(5)
        .map(|chunk| {
            let open = chunk.first().map_or(0.0, |c| c.open);
            let close = chunk.last().map_or(0.0, |c| c.close);
            let high = chunk
                .iter()
                .map(|c| c.high)
                .max_by(|a, b| a.partial_cmp(b).unwrap())
                .unwrap();
            let low = chunk
                .iter()
                .map(|c| c.low)
                .min_by(|a, b| a.partial_cmp(b).unwrap())
                .unwrap();
            let volume: u64 = chunk.iter().map(|c| c.volume as u64).sum();
            model::Candle {
                symbol: symbol.to_string(),
                open,
                high,
                low,
                close,
                volume: volume as u32,
                timestamp: chunk.first().map_or(0, |c| c.timestamp),
            }
        })
        .collect();

    if weekly_candles.len() < 4 {
        log::warn!("Not enough candles for {}, skipping ATR", symbol);
        return;
    }

    let trs = crate::atr::true_ranges_ratio(&weekly_candles);
    let ema_atr = crate::atr::exponential_moving_average(&trs, 5);
    let percentile_atr = crate::atr::percentile(&trs, constants::PERCENTILE);

    let percentile_atr = match percentile_atr {
        Ok(v) => v,
        Err(e) => {
            log::warn!("Failed to compute ATR percentile for {}: {}", symbol, e);
            return;
        }
    };

    let true_range = model::TrueRange {
        symbol: symbol.to_string(),
        percentile_range: percentile_atr,
        ema_range: ema_atr,
        timestamp: weekly_candles.last().unwrap().timestamp,
    };

    if let Err(e) = store::true_range::save_true_ranges(conn, &[true_range]) {
        log::error!("Failed to save ATR for {}: {}", symbol, e);
    }
}

fn compute_and_save_max_drop(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    period: usize,
) {
    match crate::maxdrop::compute_max_drop_stats(candles, period) {
        Some((percentile_drop, ema_drop)) => {
            let timestamp = candles.last().unwrap().timestamp;
            if let Err(e) = store::max_drop::save_max_drop_period(
                conn,
                symbol,
                period,
                percentile_drop,
                ema_drop,
                timestamp,
            ) {
                log::error!("Failed to save max drop for {}: {}", symbol, e);
            }
        }
        None => {
            log::warn!(
                "Not enough {}-day rolling samples for {}, need at least 2",
                period,
                symbol
            );
        }
    }
}

fn compute_and_save_sharpe(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
) {
    if candles.len() < constants::SHARPE_MIN_CANDLES {
        log::warn!(
            "Not enough candles for Sharpe on {}, skipping",
            symbol
        );
        return;
    }

    match crate::sharpe::compute_sharpe(candles, constants::DEFAULT_RISK_FREE_RATE) {
        Some(sharpe) => {
            if let Err(e) = store::sharpe_ratio::save_sharpe_ratio(conn, symbol, sharpe, timestamp) {
                log::error!("Failed to save Sharpe for {}: {}", symbol, e);
            }
        }
        None => {
            log::warn!("Failed to compute Sharpe for {}, skipping", symbol);
        }
    }
}

fn compute_and_save_trend(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
) {
    if candles.len() < constants::EMA_LONG_PERIOD as usize {
        log::warn!("Not enough candles for trend on {}, skipping", symbol);
        return;
    }

    // Build closes once — reuse for both trend ratios and EMAs
    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();

    let (trend_ratio_short, trend_ratio_long) = crate::trend::calculate_trend_ratios(&closes);

    let ema_short = crate::atr::exponential_moving_average(&closes, constants::EMA_SHORT_PERIOD);
    let ema_long = crate::atr::exponential_moving_average(&closes, constants::EMA_LONG_PERIOD);

    if let Err(e) = store::trend::save_trend(
        conn,
        symbol,
        ema_short,
        ema_long,
        trend_ratio_short,
        trend_ratio_long,
        timestamp,
    ) {
        log::error!("Failed to save trend for {}: {}", symbol, e);
    }
}

fn compute_and_save_price_percentile(
    conn: &mut rusqlite::Connection,
    symbol: &str,
    candles: &[model::Candle],
    timestamp: u32,
) {
    let percentile = crate::price_percentile::compute_price_percentile(candles);
    if let Err(e) = store::price_percentile::save_price_percentiles(
        conn,
        &[model::PricePercentile {
            symbol: symbol.to_string(),
            percentile,
            timestamp,
        }],
    ) {
        log::error!("Failed to save price percentile for {}: {}", symbol, e);
    }
}
```

3. Add `mod metrics;` to `src/main.rs` module declarations (next to the other metric modules).

4. Run `cargo check` — confirm `metrics.rs` compiles. Errors from the old `calculate_and_save` calls still in `main.rs` are expected; those are removed in Task 3.

⏸ **CHECKPOINT: test** — confirm `metrics.rs` compiles and `true_ranges_ratio` visibility is correct before proceeding.

---

## Task 2: Strip `calculate_and_save` from the five metric modules

<!-- tdd: modifying-tested-code -->

Remove the orchestration wrappers. Keep all pure computation functions. The modules become pure math.

Acceptance Criteria (QA Engineer Hat):
- **Happy Path**:
  - Given: The five metric modules have been stripped
  - When: `cargo check` runs (ignoring `main.rs` errors from Task 3)
  - Then: No compilation errors within the metric modules themselves.
- **Edge Case (missing imports)**:
  - Given: `atr.rs` no longer needs `store`, `symbols`, or `model::Result` in its top-level function signatures
  - When: Unused imports are removed
  - Then: No compiler warnings for unused imports.

Files to modify:
- `src/atr.rs` — delete the entire `pub fn calculate_and_save(...)` function and remove unused imports (`store`, `symbols`). Keep `true_ranges_ratio`, `true_range_ratio`, `calculate_range`, `ema`, `exponential_moving_average`, `percentile`.
- `src/maxdrop.rs` — delete the entire `pub fn calculate_and_save(...)` function and remove unused imports (`store::{self, candle}`, `symbols`). Keep `compute_max_drop_stats`, `compute_max_drop_stats_with_percentile`, `calculate_max_drop`, and the test module.
- `src/sharpe.rs` — delete the entire `pub fn calculate_and_save(...)` function and remove unused imports (`store::{self, sharpe_ratio}`, `symbols`). Keep `compute_sharpe`, `calculate_returns`, `calculate_sharpe`.
- `src/trend.rs` — delete the entire `pub fn calculate_and_save(...)` function and remove unused imports (`store::{self, candle}`, `symbols`). Keep `calculate_trend_ratios` and the test module. `atr` and `constants` imports remain.
- `src/price_percentile.rs` — delete the entire `pub fn calculate_and_save(...)` function and remove unused imports (`store::{self, candle}`, `symbols`). Keep `compute_price_percentile`.

Steps:
1. In `src/atr.rs`, delete the `pub fn calculate_and_save` function (the one starting `pub fn calculate_and_save(symbols_file_path: &str, conn: &mut Connection)`) and remove unused imports. Match by function signature, not line numbers.
2. In `src/maxdrop.rs`, delete the `pub fn calculate_and_save` function (the one with signature `calculate_and_save(symbols_file_path: &str, conn: &mut Connection, period: usize)`) and remove unused imports.
3. In `src/sharpe.rs`, delete the `pub fn calculate_and_save` function and remove unused imports.
4. In `src/trend.rs`, delete the `pub fn calculate_and_save` function and remove unused imports. Keep `atr` and `constants` imports.
5. In `src/price_percentile.rs`, delete the `pub fn calculate_and_save` function and remove unused imports.
6. Run `cargo check` — expect errors only from `main.rs` (resolved in Task 3). No errors within the stripped modules themselves.

---

## Task 3: Rewire `main.rs` — delete standalone subcommands, replace `PerformAll`

<!-- tdd: modifying-tested-code -->

Remove the five standalone subcommands and their command arms. Replace `PerformAll` with a call to `metrics::run_all`.

Acceptance Criteria (QA Engineer Hat):
- **Happy Path**:
  - Given: `main.rs` has been updated
  - When: `cargo build` runs
  - Then: Compilation succeeds. Only `PerformAll`, `PullQuotes`, `PullOptionChain5Day`, `PullOptionChain20Day`, `PublishOptionChain`, `TestTiger`, and `Backtest` subcommands remain.
- **Edge Case (PerformAll regression)**:
  - Given: `PerformAll` now calls `metrics::run_all` instead of 5 separate calls
  - When: `cargo test` runs
  - Then: All existing tests pass. The `PerformAll` path produces the same DB side-effects as before (ATR, max drop 5, max drop 20, Sharpe, trend, price percentile saved per symbol).

Files:
- `src/main.rs`

Steps:
1. Delete the `CalculateAtr`, `CalculateMaxDrop`, `CalculateSharpeRatio`, `CalculatePricePercentile`, and `CalculateTrend` variants from the `Commands` enum.
2. Delete the five corresponding `match` arms in `main()`.
3. Replace the `PerformAll` match arm body. Remove the individual calls to `maxdrop::calculate_and_save`, `sharpe::calculate_and_save`, `price_percentile::calculate_and_save`, and `trend::calculate_and_save`. Replace with a single call:
   ```rust
   match metrics::run_all(&symbols_file_path, &mut conn) {
       Ok(_) => log::info!("Successfully completed metric calculation pipeline"),
       Err(err) => log::error!("Error running metric pipeline: {}", err),
   }
   ```
4. The `quotes::pull_and_save` call at the start of `PerformAll` stays — it fetches candles before metrics compute them.
5. Remove the module declarations for `atr`, `maxdrop`, `sharpe`, `trend`, `price_percentile` from `main.rs` (they're no longer referenced from `main.rs`). Keep `mod metrics;` and all other module declarations.
6. Run `cargo build` — confirm compilation succeeds.
7. Run `cargo test` — confirm all tests pass.
