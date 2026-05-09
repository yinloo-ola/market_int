# Earnings Calendar, Momentum Flag, and Telegram Top Picks — Implementation Plan

## Task 1: Spike — Test Tiger Earnings Calendar API

<!-- tdd: trivial -->
<!-- checkpoint: done -->

**Goal:** Verify the `corporate_action` API with `action_type: "earning"` is callable and returns usable data.

Files:
- `src/model.rs`
- `src/tiger/api_caller.rs`
- `src/main.rs`

Steps:
1. Add `EarningsCalendarEntry` struct to `src/model.rs`:

```rust
#[derive(Debug, Clone)]
pub struct EarningsCalendarEntry {
    pub symbol: String,
    pub report_date: String,
    pub report_time: String,
    pub expected_eps: Option<f64>,
}
```

2. Add `query_earnings_calendar` method to `Requester` in `src/tiger/api_caller.rs`:

```rust
pub async fn query_earnings_calendar(
    &self,
    market: &str,
    begin_date: &DateTime<chrono_tz::Tz>,
    end_date: &DateTime<chrono_tz::Tz>,
) -> Result<Vec<model::EarningsCalendarEntry>, RequestError> {
    let biz_content = serde_json::json!({
        "market": market,
        "action_type": "earning",
        "begin_date": begin_date.timestamp_millis(),
        "end_date": end_date.timestamp_millis(),
    });

    let resp = self
        .execute_query("corporate_action", "2.0", Some(biz_content))
        .await
        .map_err(|e| RequestError::Other(format!("Failed to query earnings calendar: {}", e)))?;

    let mut entries = Vec::new();

    if let Some(data_array) = resp.data.as_array() {
        for item in data_array {
            let symbol = item["symbol"].as_str().unwrap_or("").to_string();
            let report_date = item["reportDate"].as_str().unwrap_or("").to_string();
            let report_time = item["reportTime"].as_str().unwrap_or("").to_string();
            let expected_eps = item["expectedEps"].as_f64();
            entries.push(model::EarningsCalendarEntry {
                symbol,
                report_date,
                report_time,
                expected_eps,
            });
        }
    }

    Ok(entries)
}
```

3. Update `TestTiger` command in `src/main.rs` to also call the earnings calendar after the existing option chain test. Add after the option chain test block:

```rust
// Test earnings calendar
let today_ny = Local::now().with_timezone(&New_York);
let two_weeks_ny = today_ny + chrono::Duration::days(14);

match requester.query_earnings_calendar("US", &today_ny, &two_weeks_ny).await {
    Ok(entries) => {
        log::info!("Earnings calendar returned {} entries", entries.len());
        for entry in &entries {
            log::info!(
                "  {} - Report: {} ({}) EPS: {:?}",
                entry.symbol, entry.report_date, entry.report_time, entry.expected_eps
            );
        }
        let relevant: Vec<_> = entries
            .iter()
            .filter(|e| symbol_list.contains(&e.symbol.as_str()))
            .collect();
        log::info!("Relevant to test symbols: {} entries", relevant.len());
    }
    Err(err) => {
        log::error!("Failed to query earnings calendar: {}", err);
    }
}
```

4. Build and run manually:

```bash
cargo run -- TestTiger AAPL,NVDA,MSFT
```

Expected: logs showing earnings entries for the next 2 weeks, or a clear error if the API is not available.

⏸ **CHECKPOINT: done** — Verify: does the API return data? Does it cost quota? If it fails, we need an alternative design (e.g., static CSV of earnings dates). Wait for human confirmation before proceeding.

---

## Task 2: Update scoring pre-filter thresholds

<!-- tdd: modifying-tested-code -->

Files:
- `src/model.rs`

Steps:
1. Run existing tests to confirm they pass:

```bash
cargo test
```

2. Update `calculate_put_score` pre-filter thresholds in `src/model.rs`:

```rust
// Change from:
if rate_of_return < 0.20 || rate_of_return > 0.65 { return None; }
if strike_percentile > 0.50 { return None; }

// To:
if rate_of_return < 0.25 || rate_of_return > 0.65 { return None; }
if strike_percentile > 0.60 { return None; }
```

3. Update existing tests that depend on old thresholds:

- `test_put_score_filtered_low_return` — change `0.15` to `0.20` (below new floor 0.25)
- `test_put_score_boundary_return_low` — update to `assert!(calculate_put_score(1.0, 0.10, 0.25).is_some());`
- `test_put_score_boundary_percentile` — update to `assert!(calculate_put_score(1.0, 0.60, 0.35).is_some());`
- `test_put_score_filtered_high_percentile` — update to `assert!(calculate_put_score(1.5, 0.65, 0.35).is_none());`

4. Add edge case tests:

```rust
#[test]
fn test_put_score_just_below_return_floor() {
    assert!(calculate_put_score(1.0, 0.10, 0.24).is_none());
}

#[test]
fn test_put_score_at_return_floor() {
    assert!(calculate_put_score(1.0, 0.10, 0.25).is_some());
}

#[test]
fn test_put_score_at_strike_percentile_boundary() {
    assert!(calculate_put_score(1.0, 0.60, 0.35).is_some());
}

#[test]
fn test_put_score_above_strike_percentile_boundary() {
    assert!(calculate_put_score(1.0, 0.61, 0.35).is_none());
}
```

5. Run all tests:

```bash
cargo test
```

Expected: all tests pass.

---

## Task 3: Add momentum_flag helper

<!-- tdd: new-feature -->

Files:
- `src/model.rs`

Steps:
1. Add `momentum_flag` function in `src/model.rs`:

```rust
pub fn momentum_flag(price_percentile: f64) -> &'static str {
    if price_percentile > 0.90 {
        "EXTENDED"
    } else if price_percentile > 0.80 {
        "HIGH"
    } else {
        "NORMAL"
    }
}
```

2. Add tests:

```rust
#[test]
fn test_momentum_flag_normal() {
    assert_eq!(momentum_flag(0.50), "NORMAL");
}

#[test]
fn test_momentum_flag_normal_boundary() {
    assert_eq!(momentum_flag(0.80), "NORMAL");
}

#[test]
fn test_momentum_flag_high() {
    assert_eq!(momentum_flag(0.85), "HIGH");
}

#[test]
fn test_momentum_flag_high_boundary() {
    assert_eq!(momentum_flag(0.90), "HIGH");
}

#[test]
fn test_momentum_flag_extended() {
    assert_eq!(momentum_flag(0.95), "EXTENDED");
}

#[test]
fn test_momentum_flag_extended_at_boundary() {
    assert_eq!(momentum_flag(0.91), "EXTENDED");
}
```

3. Run tests:

```bash
cargo test test_momentum_flag
```

Expected: 6 tests pass.

---

## Task 4: Wire earnings calendar into option pipeline

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Files:
- `src/constants.rs`
- `src/model.rs`
- `src/store/option_chain.rs`
- `src/option.rs`

Steps:
1. Add constants to `src/constants.rs`:

```rust
pub const MOMENTUM_HIGH_THRESHOLD: f64 = 0.80;
pub const MOMENTUM_EXTENDED_THRESHOLD: f64 = 0.90;
pub const MIN_RATE_OF_RETURN: f64 = 0.25;
pub const MAX_STRIKE_PERCENTILE: f64 = 0.60;
```

2. Update `src/model.rs` — replace hardcoded thresholds in `calculate_put_score` and `momentum_flag` with constants:

```rust
use crate::constants;

pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
) -> Option<f64> {
    if rate_of_return < constants::MIN_RATE_OF_RETURN || rate_of_return > 0.65 { return None; }
    if sharpe <= 0.0 { return None; }
    if strike_percentile > constants::MAX_STRIKE_PERCENTILE { return None; }
    // ... rest unchanged
}

pub fn momentum_flag(price_percentile: f64) -> &'static str {
    if price_percentile > constants::MOMENTUM_EXTENDED_THRESHOLD { "EXTENDED" }
    else if price_percentile > constants::MOMENTUM_HIGH_THRESHOLD { "HIGH" }
    else { "NORMAL" }
}
```

3. Update `src/store/option_chain.rs` — add `earnings_before_expiry` column:

In `create_table`, add to the CREATE TABLE statement:
```sql
earnings_before_expiry TEXT
```

Update `save_option_strike` to include the new column in INSERT (add `?19` parameter).
Update `retrieve_option_chain` to SELECT and parse the new column.

4. Update `src/option.rs` — in `retrieve_option_chains_with_expiry`, after `expiration_date_ny` is determined, call earnings calendar:

```rust
let earnings_map = match requester.query_earnings_calendar("US", &current_date_ny, &expiration_date_ny).await {
    Ok(entries) => {
        let mut map = HashMap::new();
        for entry in entries {
            map.insert(entry.symbol, model::EarningsInfo {
                report_date: entry.report_date,
                report_time: entry.report_time,
                expected_eps: entry.expected_eps,
            });
        }
        map
    }
    Err(e) => {
        log::warn!("Failed to fetch earnings calendar, proceeding without: {}", e);
        HashMap::new()
    }
};
```

5. Pass `earnings_map` through to `publish_to_telegram` and `option_chain_to_csv_vec`.

6. Run tests:

```bash
cargo test
cargo build
```

Expected: builds successfully, all existing tests pass.

⏸ **CHECKPOINT: done** — verify the earnings data flows through the pipeline correctly before building CSV/Telegram output.

---

## Task 5: Update CSV output with new columns

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Files:
- `src/model.rs`

Steps:
1. Update `option_chain_to_csv_vec` signature to accept additional data:

```rust
pub fn option_chain_to_csv_vec(
    all_chains: &[OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, PutPriceRange>,
    price_percentiles: &HashMap<String, f64>,
    earnings_map: &HashMap<String, EarningsInfo>,
) -> Result<(Vec<u8>, Vec<TopPick>)>
```

2. Add `EarningsInfo` and `TopPick` structs to `src/model.rs`:

```rust
#[derive(Debug, Clone)]
pub struct EarningsInfo {
    pub report_date: String,
    pub report_time: String,
    pub expected_eps: Option<f64>,
}

pub struct TopPick {
    pub rank: usize,
    pub underlying: String,
    pub strike: f64,
    pub bid: f64,
    pub ask: f64,
    pub rate_of_return: f64,
    pub score: f64,
    pub sharpe: f64,
    pub momentum_flag: String,
    pub earnings: Option<EarningsInfo>,
}
```

3. Add new CSV columns to header row (append after `score`):

```
..., momentum_flag, earnings_before_expiry
```

4. For each chain row, compute and write:
- `momentum_flag` — `momentum_flag(price_percentile)` or empty string if no percentile data
- `earnings_before_expiry` — format as `"YYYY-MM-DD (before_open)"` or `"YYYY-MM-DD (after_close)"`, empty string if no earnings

5. Select top 3 scored chains for `TopPick`:

```rust
let mut scored: Vec<(usize, f64)> = all_chains.iter().enumerate()
    .filter_map(|(i, chain)| {
        let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
        let range = price_ranges.get(&chain.underlying)?;
        let sp = calculate_strike_percentile(chain.strike, range.min, range.max);
        let score = calculate_put_score(sharpe, sp, chain.rate_of_return)?;
        Some((i, score))
    })
    .collect();
scored.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
let top3: Vec<TopPick> = scored.iter().take(3).enumerate().map(|(rank, (idx, score))| {
    let chain = &all_chains[*idx];
    let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
    let pp = price_percentiles.get(&chain.underlying).copied();
    TopPick {
        rank: rank + 1,
        underlying: chain.underlying.clone(),
        strike: chain.strike,
        bid: chain.bid,
        ask: chain.ask,
        rate_of_return: chain.rate_of_return,
        score: *score,
        sharpe,
        momentum_flag: pp.map(|p| momentum_flag(p).to_string()).unwrap_or_default(),
        earnings: earnings_map.get(&chain.underlying).cloned(),
    }
}).collect();
```

6. Run tests:

```bash
cargo test
```

⏸ **CHECKPOINT: done** — verify CSV generation works with new columns before wiring Telegram.

---

## Task 6: Update Telegram message with caption

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Files:
- `src/option.rs`

Steps:
1. Update `publish_to_telegram` signature to accept new data:

```rust
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    price_percentiles: &HashMap<String, f64>,
    earnings_map: &HashMap<String, model::EarningsInfo>,
    period: usize,
) -> model::Result<()>
```

2. Add `format_telegram_caption` function:

```rust
fn format_telegram_caption(top_picks: &[model::TopPick], period: usize) -> String {
    let now_singapore = Local::now().with_timezone(&Singapore);
    let date_str = now_singapore.format("%d%b").to_string();

    let mut caption = format!("🏆 Top 3 Puts — {} {}-day\n\n", date_str, period);

    for pick in top_picks {
        let momentum_warning = if pick.momentum_flag == "EXTENDED" || pick.momentum_flag == "HIGH" {
            format!(" {} ⚠️", pick.momentum_flag)
        } else {
            String::new()
        };

        caption.push_str(&format!(
            "{}. ${strike:.0}P | Bid: ${bid:.2} / Ask: ${ask:.2} | Return: {:.0}%\n   Score: {:.2} | Sharpe: {:.1}{momentum}\n\n",
            pick.rank,
            pick.rate_of_return * 100.0,
            pick.score,
            pick.sharpe,
            strike = pick.strike,
            bid = pick.bid,
            ask = pick.ask,
            momentum = momentum_warning,
        ));
    }

    // Earnings warnings
    let earnings_warnings: Vec<_> = top_picks.iter()
        .filter(|p| p.earnings.is_some())
        .map(|p| format!("{} {} ({})", p.underlying, p.earnings.as_ref().unwrap().report_date, p.earnings.as_ref().unwrap().report_time))
        .collect();

    if !earnings_warnings.is_empty() {
        caption.push_str(&format!("⚠️ Earnings: {}\n", earnings_warnings.join(", ")));
    }

    caption
}
```

3. In `publish_to_telegram`, call `option_chain_to_csv_vec` with the new parameters, generate caption from top picks, set as caption on `SendDocument`:

```rust
caption: Some(formatted_caption),
```

4. Update all callers of `publish_to_telegram` in `option.rs` to pass the new `price_percentiles` and `earnings_map` parameters.

5. Run full build and tests:

```bash
cargo build
cargo test
```

⏸ **CHECKPOINT: done** — full end-to-end verification. Build passes, all tests pass.

---

## Task 7: Collect price percentiles in pipeline

<!-- tdd: new-feature -->

Files:
- `src/option.rs`
- `src/store/price_percentile.rs`

Steps:
1. Verify `store/price_percentile.rs` has a getter function. If not, add `get_price_percentile(conn, symbol) -> Result<Option<PricePercentile>>`.

2. Add `collect_price_percentiles` function in `src/option.rs` alongside existing collectors:

```rust
fn collect_price_percentiles(conn: &Connection, symbols: &[String]) -> HashMap<String, f64> {
    let mut percentiles = HashMap::new();
    for symbol in symbols {
        match price_percentile::get_price_percentile(conn, symbol) {
            Ok(Some(p)) => { percentiles.insert(symbol.clone(), p.percentile); }
            Ok(None) => log::warn!("No price percentile found for symbol: {}", symbol),
            Err(err) => log::error!("Failed to get price percentile for {}: {}", symbol, err),
        }
    }
    percentiles
}
```

3. Call `collect_price_percentiles` in both `retrieve_option_chains_with_expiry` and `publish_option_chains`, passing results to `publish_to_telegram`.

4. Run tests:

```bash
cargo test
cargo build
```

Expected: builds, all tests pass.
