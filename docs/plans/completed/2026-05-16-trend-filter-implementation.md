# Trend-Aware Put Selection — Implementation Plan

**Design:** `docs/plans/2026-05-16-trend-filter-design.md`

## Overview

Add a two-layer trend system to the put option selection algorithm:
1. **Hard filter** — block stocks where `price/EMA20 < 0.98` or `price/EMA50 < 0.98`
2. **Strike tightening** — when trend is strong, reduce max_drop by up to 25%, allowing higher-premium strikes

The changes span: new `trend` module + store, updated constants, updated scoring in `model.rs`, updated option chain retrieval with trend-adjusted strike ranges, updated CSV/telegram output, and updated `main.rs` CLI.

---

## Task 1: Add trend constants and DB store module with tests

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Files:
- `src/constants.rs` — add trend constants
- `src/store/trend.rs` — **NEW** — DB table + CRUD for trend data

Steps:

1. Add trend constants to `src/constants.rs`:

```rust
pub const EMA_SHORT_PERIOD: u32 = 20;
pub const EMA_LONG_PERIOD: u32 = 50;
pub const TREND_FILTER_THRESHOLD: f64 = 0.98;
pub const TREND_TIGHTEN_MULTIPLIER: f64 = 4.0;
pub const TREND_TIGHTEN_CAP: f64 = 0.25;
```

2. Create `src/store/trend.rs` — follows the pattern of `src/store/sharpe_ratio.rs`:

```rust
use rusqlite::{params, Connection, Result};

/// Creates the trend table if it doesn't exist.
pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS trend (
            symbol TEXT NOT NULL,
            ema_short REAL NOT NULL,
            ema_long REAL NOT NULL,
            trend_ratio_short REAL NOT NULL,
            trend_ratio_long REAL NOT NULL,
            timestamp INTEGER NOT NULL,
            PRIMARY KEY (symbol, timestamp)
        )",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_trend_symbol ON trend (symbol);",
        [],
    )?;
    Ok(())
}

/// Saves trend data for a single symbol.
pub fn save_trend(
    conn: &Connection,
    symbol: &str,
    ema_short: f64,
    ema_long: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
    timestamp: u32,
) -> crate::model::Result<()> {
    create_table(conn)?;
    let mut stmt = conn.prepare(
        "REPLACE INTO trend (symbol, ema_short, ema_long, trend_ratio_short, trend_ratio_long, timestamp) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
    )?;
    stmt.execute(params![symbol, ema_short, ema_long, trend_ratio_short, trend_ratio_long, timestamp])?;
    Ok(())
}

/// Gets the latest trend ratios for a symbol. Returns (trend_ratio_short, trend_ratio_long).
pub fn get_trend(conn: &Connection, symbol: &str) -> crate::model::Result<Option<(f64, f64)>> {
    let mut stmt = conn.prepare(
        "SELECT trend_ratio_short, trend_ratio_long FROM trend WHERE symbol = ?1 ORDER BY timestamp DESC LIMIT 1",
    )?;
    let mut rows = stmt.query(params![symbol])?;
    match rows.next()? {
        Some(row) => {
            let short: f64 = row.get(0)?;
            let long: f64 = row.get(1)?;
            Ok(Some((short, long)))
        }
        None => Ok(None),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::Connection;

    fn in_memory_db() -> Connection {
        Connection::open_in_memory().unwrap()
    }

    #[test]
    fn test_create_table_and_save() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();

        save_trend(&conn, "AAPL", 280.0, 270.0, 1.05, 1.08, 1000).unwrap();

        let result = get_trend(&conn, "AAPL").unwrap();
        assert!(result.is_some());
        let (short, long) = result.unwrap();
        assert!((short - 1.05).abs() < 1e-9);
        assert!((long - 1.08).abs() < 1e-9);
    }

    #[test]
    fn test_get_trend_missing_symbol() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();

        let result = get_trend(&conn, "NONEXISTENT").unwrap();
        assert!(result.is_none());
    }

    #[test]
    fn test_save_replaces_existing() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();

        save_trend(&conn, "AAPL", 280.0, 270.0, 1.05, 1.08, 1000).unwrap();
        save_trend(&conn, "AAPL", 290.0, 275.0, 1.03, 1.06, 2000).unwrap();

        let result = get_trend(&conn, "AAPL").unwrap().unwrap();
        assert!((result.0 - 1.03).abs() < 1e-9); // returns latest
        assert!((result.1 - 1.06).abs() < 1e-9);
    }
}
```

3. Register the new store module in `src/main.rs`. Add `pub mod trend;` inside the `mod store { ... }` block, right after the existing `pub mod price_percentile;` line.

4. Build: `cargo build --release 2>&1 | tail -5`

5. Run tests: `cargo test store::trend 2>&1` — all 3 tests pass.

⏸ **CHECKPOINT: done** — present implementation review. Wait for human approval before committing.

---

## Task 2: Create trend calculation module with tests

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Files:
- `src/trend.rs` — **NEW** — compute EMA20/EMA50 from daily candles

Steps:

1. Create `src/trend.rs`:

```rust
use crate::{
    atr, constants, model,
    store::{self, candle},
    symbols,
};
use rusqlite::Connection;

/// Calculates EMA-based trend ratios for all symbols and saves to DB.
pub fn calculate_and_save(
    symbols_file_path: &str,
    conn: &mut Connection,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    store::trend::create_table(conn)?;

    for symbol in symbols {
        // Need at least EMA_LONG_PERIOD candles for meaningful calculation
        let candles = match candle::get_candles(conn, &symbol, constants::EMA_LONG_PERIOD) {
            Ok(candles) if candles.len() >= constants::EMA_LONG_PERIOD as usize => candles,
            Ok(_) => {
                log::warn!(
                    "Not enough candles for trend calculation on {}, skipping",
                    symbol
                );
                continue;
            }
            Err(_) => {
                log::warn!("No candles found for {}, skipping", symbol);
                continue;
            }
        };

        let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();
        let timestamp = candles.last().unwrap().timestamp;

        // Calculate EMAs using the existing EMA function from atr module
        let ema_short = atr::exponential_moving_average(&closes, constants::EMA_SHORT_PERIOD);
        let ema_long = atr::exponential_moving_average(&closes, constants::EMA_LONG_PERIOD);

        let current_price = closes.last().unwrap();
        let trend_ratio_short = current_price / ema_short;
        let trend_ratio_long = current_price / ema_long;

        store::trend::save_trend(
            conn,
            &symbol,
            ema_short,
            ema_long,
            trend_ratio_short,
            trend_ratio_long,
            timestamp,
        )?;

        log::info!(
            "Calculated trend for {}: EMA{}={:.2}, EMA{}={:.2}, ratio_short={:.4}, ratio_long={:.4}",
            symbol,
            constants::EMA_SHORT_PERIOD,
            ema_short,
            constants::EMA_LONG_PERIOD,
            ema_long,
            trend_ratio_short,
            trend_ratio_long,
        );
    }

    log::info!("Completed trend calculation");
    Ok(())
}

/// Calculates trend ratios from a slice of close prices.
/// Returns (trend_ratio_short, trend_ratio_long) = (price/EMA20, price/EMA50).
/// Used for testing and unit-level validation.
pub fn calculate_trend_ratios(closes: &[f64]) -> (f64, f64) {
    let ema_short = atr::exponential_moving_average(closes, constants::EMA_SHORT_PERIOD);
    let ema_long = atr::exponential_moving_average(closes, constants::EMA_LONG_PERIOD);
    let price = closes.last().unwrap();
    (price / ema_short, price / ema_long)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Generate a simple upward-trending price series.
    /// Starts at `start`, increments by `step` each day for `count` days.
    fn generate_trending_closes(start: f64, step: f64, count: usize) -> Vec<f64> {
        (0..count).map(|i| start + step * i as f64).collect()
    }

    #[test]
    fn test_trend_ratios_uptrend() {
        // Strong uptrend: 50 days, starting at 100, +1 per day
        let closes = generate_trending_closes(100.0, 1.0, 60);
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price (159) should be well above both EMAs
        assert!(ratio_short > 1.0, "short ratio should be > 1.0 in uptrend, got {}", ratio_short);
        assert!(ratio_long > 1.0, "long ratio should be > 1.0 in uptrend, got {}", ratio_long);
    }

    #[test]
    fn test_trend_ratios_downtrend() {
        // Downtrend: 60 days, starting at 200, -2 per day
        let closes = generate_trending_closes(200.0, -2.0, 60);
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price (82) should be well below both EMAs
        assert!(ratio_short < 1.0, "short ratio should be < 1.0 in downtrend, got {}", ratio_short);
        assert!(ratio_long < 1.0, "long ratio should be < 1.0 in downtrend, got {}", ratio_long);
        assert!(ratio_short < 0.98, "short ratio should trigger filter (< 0.98), got {}", ratio_short);
        assert!(ratio_long < 0.98, "long ratio should trigger filter (< 0.98), got {}", ratio_long);
    }

    #[test]
    fn test_trend_ratios_flat() {
        // Flat prices: all 100.0 for 60 days
        let closes = vec![100.0; 60];
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // Price equals both EMAs → ratio should be exactly 1.0
        assert!((ratio_short - 1.0).abs() < 0.01, "flat prices should give ratio ~1.0, got {}", ratio_short);
        assert!((ratio_long - 1.0).abs() < 0.01, "flat prices should give ratio ~1.0, got {}", ratio_long);
    }

    #[test]
    fn test_trend_ratios_recent_drop() {
        // Stock was at 150 for a long time, then drops to 130 in last 10 days
        let mut closes = vec![150.0; 50];
        for i in 0..10 {
            closes.push(150.0 - 2.0 * (i + 1) as f64); // 148, 146, ... 130
        }
        let (ratio_short, ratio_long) = calculate_trend_ratios(&closes);

        // EMA20 should react to recent drop → ratio_short < 1.0
        assert!(ratio_short < 1.0, "recent drop should push short ratio below 1.0, got {}", ratio_short);
        // EMA50 still near 150 → ratio_long should be very low
        assert!(ratio_long < 0.95, "recent drop should push long ratio well below 1.0, got {}", ratio_long);
    }
}
```

2. Register the new module in `src/main.rs`. Add `mod trend;` in the top-level module declarations, alongside the existing `mod sharpe;`, `mod maxdrop;`, etc.

3. Build: `cargo build --release 2>&1 | tail -5`

4. Run tests: `cargo test trend::tests 2>&1` — all 4 tests pass.

⏸ **CHECKPOINT: done** — present implementation review. Wait for human approval before committing.

---

## Task 3: Update `calculate_put_score` with trend filter — add and update tests

<!-- tdd: modifying-tested-code -->

Files:
- `src/model.rs` — modify `calculate_put_score()`, add `calculate_trend_factor()`, add `TrendData` struct, update + add tests

Steps:

1. Add `TrendData` struct to `src/model.rs` (near the existing `PutPriceRange` struct):

```rust
/// Stores trend data for a symbol (price relative to EMAs).
#[derive(Debug, Clone)]
pub struct TrendData {
    pub trend_ratio_short: f64, // price / EMA20
    pub trend_ratio_long: f64,  // price / EMA50
}
```

2. Add `calculate_trend_factor` function in `src/model.rs`:

```rust
/// Calculates the trend factor for strike tightening.
/// Returns a value in [0.75, 1.0] — never widens strikes.
/// When trend is strong (ratio > 1.0), reduces max_drop by up to TREND_TIGHTEN_CAP.
pub fn calculate_trend_factor(trend_ratio_short: f64) -> f64 {
    if trend_ratio_short <= 1.0 {
        return 1.0; // No tightening when not above EMA
    }
    let reduction = (trend_ratio_short - 1.0) * constants::TREND_TIGHTEN_MULTIPLIER;
    let capped_reduction = reduction.min(constants::TREND_TIGHTEN_CAP);
    1.0 - capped_reduction
}
```

3. Modify `calculate_put_score` — add `trend_ratio_short` and `trend_ratio_long` params, add trend pre-filters and trend score component. Replace the existing function:

```rust
/// Calculates a composite score [0, 1] for a put option.
/// Returns None if the option fails any pre-filter.
///
/// Pre-filters:
///   - rate_of_return in [MIN_RATE_OF_RETURN, MAX_RATE_OF_RETURN]
///   - sharpe > 0
///   - strike_percentile <= MAX_STRIKE_PERCENTILE
///   - trend_ratio_short >= TREND_FILTER_THRESHOLD
///   - trend_ratio_long >= TREND_FILTER_THRESHOLD
///
/// Score = 0.20 * sharpe_norm + 0.30 * safety_norm + 0.20 * return_norm + 0.30 * trend_norm
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
) -> Option<f64> {
    // Pre-filters
    if rate_of_return < constants::MIN_RATE_OF_RETURN || rate_of_return > constants::MAX_RATE_OF_RETURN {
        return None;
    }
    if sharpe <= 0.0 {
        return None;
    }
    if strike_percentile > constants::MAX_STRIKE_PERCENTILE {
        return None;
    }
    // Trend hard filter
    if trend_ratio_short < constants::TREND_FILTER_THRESHOLD {
        return None;
    }
    if trend_ratio_long < constants::TREND_FILTER_THRESHOLD {
        return None;
    }

    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let safety_norm = 1.0 - strike_percentile.max(0.0);
    let return_norm = (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);
    // Trend norm: reward stocks further above their EMA
    let trend_norm = ((trend_ratio_short - constants::TREND_FILTER_THRESHOLD) / 0.10).clamp(0.0, 1.0);

    Some(0.20 * sharpe_norm + 0.30 * safety_norm + 0.20 * return_norm + 0.30 * trend_norm)
}
```

4. Update ALL existing `calculate_put_score` test calls — add `1.05, 1.05` as the last two arguments. Every test in the `mod tests` block that calls `calculate_put_score` needs updating. Find each call and append the two trend args.

Update the `test_put_score_good_option` assertion. With the new weights and trend args:
```rust
// sharpe=1.8, percentile=0.10, return=0.32, trend_short=1.05, trend_long=1.05
// sharpe_norm=0.9, safety_norm=0.9, return_norm=0.85, trend_norm=(0.07/0.10)=0.7
// score = 0.20*0.9 + 0.30*0.9 + 0.20*0.85 + 0.30*0.7 = 0.18 + 0.27 + 0.17 + 0.21 = 0.83
let score = calculate_put_score(1.8, 0.10, 0.32, 1.05, 1.05).unwrap();
assert!((score - 0.83).abs() < 0.01);
```

Update `test_put_score_clamps_negative_percentile`:
```rust
let score = calculate_put_score(2.0, -0.10, 0.35, 1.05, 1.05).unwrap();
// sharpe_norm=1.0, safety_norm=1.0, return_norm=1.0, trend_norm=0.7
// score = 0.20 + 0.30 + 0.20 + 0.21 = 0.91
assert!((score - 0.91).abs() < 0.01);
```

Update `test_put_score_high_sharpe_clamps`:
```rust
let score = calculate_put_score(5.0, 0.0, 0.35, 1.05, 1.05).unwrap();
// sharpe_norm=1.0, safety_norm=1.0, return_norm=1.0, trend_norm=0.7
// score = 0.91
assert!((score - 0.91).abs() < 0.01);
```

Update `test_put_score_peak_return`:
```rust
let score = calculate_put_score(2.0, 0.0, 0.35, 1.05, 1.05).unwrap();
// sharpe_norm=1.0, safety_norm=1.0, return_norm=1.0, trend_norm=0.7
// score = 0.91
assert!((score - 0.91).abs() < 0.01);
```

For all other existing tests (`test_put_score_filtered_low_return`, `test_put_score_filtered_high_return`, `test_put_score_filtered_negative_sharpe`, `test_put_score_filtered_zero_sharpe`, `test_put_score_filtered_high_percentile`, `test_put_score_boundary_return_low`, `test_put_score_boundary_return_high`, `test_put_score_boundary_percentile`, `test_put_score_just_below_return_floor`, `test_put_score_at_return_floor`, `test_put_score_at_strike_percentile_boundary`, `test_put_score_above_strike_percentile_boundary`): simply append `1.05, 1.05` to each `calculate_put_score()` call. The assertions (`.is_none()` or `.is_some()`) stay the same.

5. Add NEW tests for trend filter and trend factor:

```rust
#[test]
fn test_put_score_filtered_trend_short_below_threshold() {
    assert!(calculate_put_score(1.5, 0.10, 0.35, 0.97, 1.05).is_none());
}

#[test]
fn test_put_score_filtered_trend_long_below_threshold() {
    assert!(calculate_put_score(1.5, 0.10, 0.35, 1.05, 0.97).is_none());
}

#[test]
fn test_put_score_trend_at_threshold() {
    assert!(calculate_put_score(1.0, 0.10, 0.35, 0.98, 0.98).is_some());
}

#[test]
fn test_put_score_trend_just_below_threshold() {
    assert!(calculate_put_score(1.0, 0.10, 0.35, 0.979, 0.98).is_none());
    assert!(calculate_put_score(1.0, 0.10, 0.35, 0.98, 0.979).is_none());
}

#[test]
fn test_trend_factor_no_tightening_when_flat() {
    let factor = calculate_trend_factor(1.0);
    assert!((factor - 1.0).abs() < 1e-9);
}

#[test]
fn test_trend_factor_mild_tightening() {
    // trend_ratio = 1.03 → reduction = 0.03 * 4.0 = 0.12 → factor = 0.88
    let factor = calculate_trend_factor(1.03);
    assert!((factor - 0.88).abs() < 1e-9);
}

#[test]
fn test_trend_factor_capped() {
    // trend_ratio = 1.20 → reduction = 0.80 → capped at 0.25 → factor = 0.75
    let factor = calculate_trend_factor(1.20);
    assert!((factor - 0.75).abs() < 1e-9);
}

#[test]
fn test_trend_factor_below_one() {
    // trend_ratio < 1.0 → factor = 1.0 (never widen)
    let factor = calculate_trend_factor(0.95);
    assert!((factor - 1.0).abs() < 1e-9);
}

#[test]
fn test_trend_factor_at_cap_boundary() {
    // reduction = (1.0625 - 1.0) * 4.0 = 0.25 → exactly at cap
    let factor = calculate_trend_factor(1.0625);
    assert!((factor - 0.75).abs() < 1e-9);
}
```

6. Run all tests: `cargo test 2>&1` — all existing + new tests pass.

---

## Task 4: Apply trend-adjusted strike range and update CSV/telegram output — update tests

<!-- tdd: modifying-tested-code -->

Files:
- `src/option.rs` — modify `calculate_adjusted_strike_range`, add `collect_trend_data`, update `retrieve_option_chains_with_expiry`, `publish_to_telegram`
- `src/model.rs` — update `option_chain_to_csv_vec`, `TopPick`, CSV header, update tests

Steps:

1. Add `collect_trend_data` function in `src/option.rs` (follow pattern of `collect_sharpe_ratios`):

```rust
/// Collects trend ratios for the given symbols from the database.
fn collect_trend_data(conn: &Connection, symbols: &[String]) -> HashMap<String, (f64, f64)> {
    let mut trends = HashMap::new();
    for symbol in symbols {
        match store::trend::get_trend(conn, symbol) {
            Ok(Some((short, long))) => {
                trends.insert(symbol.clone(), (short, long));
            }
            Ok(None) => log::warn!("No trend data found for symbol: {}", symbol),
            Err(err) => log::error!("Failed to get trend for {}: {}", symbol, err),
        }
    }
    trends
}
```

2. Add `trend` to the store import in `src/option.rs`. Change the import line:

```rust
use crate::{
    constants,
    model::{self, QuotesError},
    store::{candle, max_drop, option_chain, price_percentile, sharpe_ratio, trend},
    symbols,
    tiger::api_caller::Requester,
};
```

3. Modify `calculate_adjusted_strike_range` to accept `trend_factor`:

```rust
fn calculate_adjusted_strike_range(
    underlying_price: f64,
    percentile_drop: f64,
    ema_drop: f64,
    dte: u32,
    period: usize,
    trend_factor: f64,
) -> (f64, f64) {
    let effective_dte = dte.max(1);
    let adjustment_factor = effective_dte as f64 / period as f64;

    let adjusted_percentile_drop = percentile_drop * adjustment_factor * trend_factor;
    let adjusted_ema_drop = ema_drop * adjustment_factor * trend_factor;

    let v1 = underlying_price * (1.0 - adjusted_ema_drop);
    let v2 = underlying_price * (1.0 - adjusted_percentile_drop);

    let (min_strike, max_strike) = if v1 < v2 { (v1, v2) } else { (v2, v1) };

    let safety_range = (adjusted_percentile_drop - adjusted_ema_drop).abs() * 0.02;
    let adjusted_max_strike = max_strike * (1.0 - safety_range);

    (min_strike, adjusted_max_strike)
}
```

4. In `retrieve_option_chains_with_expiry`, after `collect_price_percentiles`, add:

```rust
let trend_data = collect_trend_data(conn, &symbols);
```

5. In the same function, update the loop that builds `symbol_strike_ranges` — compute trend factor per symbol:

```rust
for symbol in chunk {
    let (percentile_drop, ema_drop) = max_drop::get_max_drop(conn, symbol, period)?;
    let latest_candle = &candle::get_candles(conn, symbol, 1)?[0];
    underlying_prices.insert(symbol.to_string(), latest_candle.close);

    let trend_factor = match trend_data.get(symbol) {
        Some((ratio_short, _)) => model::calculate_trend_factor(*ratio_short),
        None => 1.0,
    };

    let (min_strike, max_strike) = calculate_adjusted_strike_range(
        latest_candle.close,
        percentile_drop,
        ema_drop,
        dte,
        period,
        trend_factor,
    );

    symbol_strike_ranges.push((symbol, (min_strike, max_strike)));
}
```

6. Update `publish_to_telegram` signature — add `trend_data`:

```rust
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    _earnings_map: &HashMap<String, model::EarningsInfo>,
    price_percentiles: &HashMap<String, f64>,
    trend_data: &HashMap<String, (f64, f64)>,
    period: usize,
) -> model::Result<()> {
```

7. Update `option_chain_to_csv_vec` — add `trend_data` parameter and two new CSV columns:

Add `trend_data: &HashMap<String, (f64, f64)>` to the function signature.

Update CSV header — append `"trend_short"` and `"trend_long"`.

In the data row loop, after the earnings_str computation, add:
```rust
let (trend_short_str, trend_long_str) = match trend_data.get(&chain.underlying) {
    Some((short, long)) => (format!("{:.3}", short), format!("{:.3}", long)),
    None => (String::new(), String::new()),
};
```

Append `&trend_short_str` and `&trend_long_str` to the `write_record` call.

8. Update the score computation in `option_chain_to_csv_vec` — both in the data row loop and in the `scored` vector. Use trend_data for the new `calculate_put_score` signature:

Data row loop — replace the score calculation:
```rust
let (strike_percentile_str, score_str) = match price_ranges.get(&chain.underlying) {
    Some(range) => {
        let sp = calculate_strike_percentile(chain.strike, range.min, range.max);
        let (ts, tl) = trend_data.get(&chain.underlying).copied().unwrap_or((1.0, 1.0));
        let score = calculate_put_score(sharpe_ratio, sp, chain.rate_of_return, ts, tl);
        let sp_str = format!("{:.3}", sp);
        let score_str = score.map(|s| format!("{:.3}", s)).unwrap_or_default();
        (sp_str, score_str)
    }
    None => (String::new(), String::new()),
};
```

Scored vector for top picks:
```rust
let mut scored: Vec<(usize, f64)> = all_chains
    .iter()
    .enumerate()
    .filter_map(|(i, chain)| {
        let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
        let range = price_ranges.get(&chain.underlying)?;
        let sp = calculate_strike_percentile(chain.strike, range.min, range.max);
        let (ts, tl) = trend_data.get(&chain.underlying).copied().unwrap_or((1.0, 1.0));
        let score = calculate_put_score(sharpe, sp, chain.rate_of_return, ts, tl)?;
        Some((i, score))
    })
    .collect();
```

9. Add `trend_short` and `trend_long` to `TopPick`:

```rust
pub struct TopPick {
    pub rank: usize,
    pub underlying: String,
    pub strike: f64,
    pub bid: f64,
    pub ask: f64,
    pub rate_of_return: f64,
    pub score: f64,
    pub sharpe: f64,
    pub price_percentile: Option<f64>,
    pub earnings: Option<EarningsInfo>,
    pub trend_short: Option<f64>,
    pub trend_long: Option<f64>,
}
```

Populate in the top picks construction:
```rust
let ts = trend_data.get(&chain.underlying).map(|(s, _)| *s);
let tl = trend_data.get(&chain.underlying).map(|(_, l)| *l);
TopPick {
    rank: rank + 1,
    underlying: chain.underlying.clone(),
    strike: chain.strike,
    bid: chain.bid,
    ask: chain.ask,
    rate_of_return: chain.rate_of_return,
    score: *score,
    sharpe,
    price_percentile: pp,
    earnings: earnings_map.get(&chain.underlying).cloned(),
    trend_short: ts,
    trend_long: tl,
}
```

10. Update `format_telegram_caption` — add trend display:

```rust
let trend_str = pick.trend_short
    .map(|t| format!(" | Trend: {:.0}%", t * 100.0))
    .unwrap_or_default();
```

Append `{trend_str}` to the existing format string for each pick line.

11. Update `publish_option_chains` — add empty trend_data:

```rust
let trend_data = HashMap::new();
publish_to_telegram(&all_chains, &sharpe_ratios, &price_ranges, &earnings_map, &price_percentiles, &trend_data, period).await
```

12. Update both call sites to `publish_to_telegram` inside `retrieve_option_chains_with_expiry` — pass `&trend_data`.

13. **Update existing tests** in `src/model.rs` that use `option_chain_to_csv_vec`. Both `test_top_picks_unique_underlyings` and `test_top_picks_fewer_than_three_unique` need the new parameter:

```rust
let trend_data = HashMap::new();
let (_csv, top_picks) = option_chain_to_csv_vec(
    &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data,
).unwrap();
```

14. Add NEW test for trend-filtered top picks:

```rust
#[test]
fn test_top_picks_trend_filter_blocks_weak_stock() {
    // AAPL has strong trend → passes filter and gets scored
    // MSFT has weak trend → blocked by filter, gets no score
    let chains = vec![
        make_chain("AAPL", 90.0, 0.35),
        make_chain("MSFT", 380.0, 0.40),
    ];

    let mut sharpe = HashMap::new();
    sharpe.insert("AAPL".to_string(), 1.5);
    sharpe.insert("MSFT".to_string(), 1.5);

    let mut ranges = HashMap::new();
    ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
    ranges.insert("MSFT".to_string(), PutPriceRange { min: 350.0, max: 420.0 });

    let percentiles = HashMap::new();
    let earnings = HashMap::new();

    // MSFT has weak trend (below 0.98) → should be filtered out
    let mut trend_data = HashMap::new();
    trend_data.insert("AAPL".to_string(), (1.05, 1.06));  // strong
    trend_data.insert("MSFT".to_string(), (0.95, 0.94));  // weak → filtered

    let (_csv, top_picks) = option_chain_to_csv_vec(
        &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data,
    ).unwrap();

    assert_eq!(top_picks.len(), 1, "only AAPL should pass trend filter");
    assert_eq!(top_picks[0].underlying, "AAPL");
    assert_eq!(top_picks[0].trend_short, Some(1.05));
    assert_eq!(top_picks[0].trend_long, Some(1.06));
}

#[test]
fn test_top_picks_no_trend_data_still_scored() {
    // When no trend data exists, stocks default to (1.0, 1.0) → passes filter
    let chains = vec![
        make_chain("AAPL", 90.0, 0.35),
    ];

    let mut sharpe = HashMap::new();
    sharpe.insert("AAPL".to_string(), 1.5);

    let mut ranges = HashMap::new();
    ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

    let percentiles = HashMap::new();
    let earnings = HashMap::new();
    let trend_data = HashMap::new(); // empty — no trend data

    let (_csv, top_picks) = option_chain_to_csv_vec(
        &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data,
    ).unwrap();

    assert_eq!(top_picks.len(), 1, "should still score without trend data");
    assert_eq!(top_picks[0].trend_short, None);
}
```

15. Build: `cargo build --release 2>&1 | tail -10`

16. Run all tests: `cargo test 2>&1` — all pass.

---

## Task 5: Wire CLI commands and PerformAll pipeline

<!-- tdd: new-feature -->

Files:
- `src/main.rs` — add `CalculateTrend` command, update `PerformAll`

Steps:

1. Add `CalculateTrend` variant to the `Commands` enum:

```rust
CalculateTrend {
    symbols_file_path: String,
},
```

2. Add a handler in the `match args.command` block:

```rust
Commands::CalculateTrend { symbols_file_path } => {
    match trend::calculate_and_save(&symbols_file_path, &mut conn) {
        Ok(_) => log::info!("Successfully calculated and saved trend data"),
        Err(err) => log::error!("Error calculating trend data: {}", err),
    }
}
```

3. In the `PerformAll` handler, add trend calculation AFTER `price_percentile::calculate_and_save` and BEFORE the Tiger API initialization:

```rust
match trend::calculate_and_save(&symbols_file_path, &mut conn) {
    Ok(_) => log::info!("Successfully calculated and saved trend data"),
    Err(err) => log::error!("Error calculating trend data: {}", err),
}
```

4. Build: `cargo build --release 2>&1 | tail -5`.

5. Run end-to-end test:

```bash
./target/release/market_int calculate-trend data/symbols.csv 2>&1
```

Expected: logs showing trend calculation for each symbol with EMA values and ratios.

6. Verify DB has trend data:

```bash
sqlite3 data/data.db "SELECT symbol, ema_short, ema_long, trend_ratio_short, trend_ratio_long FROM trend ORDER BY symbol"
```

Expected: 7 rows. NET should have ratios < 0.98 (blocked). Others should be > 0.98 (passing).

7. Run full PerformAll pipeline:

```bash
./target/release/market_int perform-all data/symbols.csv 2>&1
```

Expected: completes without errors, CSV includes `trend_short` and `trend_long` columns, NET filtered from top picks.

---

## Task 6: Update put-selection-guide docs

<!-- tdd: trivial -->

Files:
- `docs/put-selection-guide.md` — add trend fields and updated scoring

Steps:

1. Add trend fields to the Field Reference table:

```
| **trend_short** | Where the current stock price sits relative to its 20-day EMA. Values > 1.0 = above trend, < 1.0 = below trend. | > 0.98 |
| **trend_long** | Where the current stock price sits relative to its 50-day EMA. Captures intermediate trend direction. | > 0.98 |
```

2. Update the Quick filter section — add trend as a hard filter:

```
5. **trend_short > 0.98 AND trend_long > 0.98** — stocks below their moving average are in a downtrend. Selling puts on them exposes you to sustained declines (the MSFT trap).
```

3. Update the Ranking table — change score weights:

```
| Factor | Weight | Rationale |
|---|---|---|
| Trend (EMA ratio) | 30% | Most forward-looking signal. Stocks above their EMAs tend to keep rising. |
| Safety (strike percentile) | 30% | The lower the strike relative to support, the more cushion. |
| Sharpe ratio | 20% | Historical risk-adjusted return quality. |
| Return quality | 20% | Prefers returns near the sweet spot (~35% annualised). |
```

4. Add a new section after Red flags:

```
### Trend filter: how it prevents the MSFT trap

On Dec 15, 2025, MSFT was at $474.82 but its EMA50 was $496.79 (ratio = 0.956). The trend filter would have blocked selling MSFT puts from that date through mid-April 2026 — the entire 27% decline from $490 to $356.

When a stock recovers above both EMAs (ratio > 0.98), it re-enters the candidate pool. This prevents selling puts on falling knives while automatically re-admitting recovering stocks.
```
