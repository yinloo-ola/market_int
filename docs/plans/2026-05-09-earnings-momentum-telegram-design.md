# Earnings Calendar, Momentum Flag, and Telegram Top Picks

## Goal

Three features to automate the manual checks currently done after receiving the CSV:

1. **Earnings Calendar** — query Tiger API for upcoming earnings, flag symbols with earnings before option expiry
2. **Momentum Flag** — expose existing price percentile as a visible column (NORMAL / HIGH / EXTENDED)
3. **Top 3 Telegram Picks** — add formatted caption to CSV message showing the 3 best puts to sell today
4. **Filter adjustment** — widen pre-filter thresholds in `calculate_put_score`

Plus a small pre-filter adjustment: `rate_of_return` floor from 0.20 → 0.25, `strike_percentile` max from 0.50 → 0.60.

## 1. Earnings Calendar

### API call details

```
Method: "corporate_action"
Version: "2.0"
Biz content:
{
  "market": "US",
  "action_type": "earning",
  "begin_date": <today_ms>,
  "end_date": <expiry_date_ms>
}
```

Response is an array of objects: `symbol`, `reportDate`, `reportTime`, `expectedEps`, `fiscalQuarterEnding`.

### Data flow

```
After expiry date is known
    │
    ▼
Tiger API: corporate_action (action_type: "earning", market: "US")
    │
    ▼
Response: [{symbol, report_date, report_time, expected_eps}, ...]
    │
    ▼
Intersect with symbol list → HashMap<String, EarningsInfo>
    │
    ▼
Pass into CSV generation + Telegram message
```

One API call per run. No caching needed (called once).

### New model types

```rust
struct EarningsInfo {
    report_date: String,    // e.g. "2026-05-14"
    report_time: String,    // e.g. "before_market_open" / "after_market_close"
    expected_eps: Option<f64>,
}
```

### Tiger API changes

New method on `Requester`:

```rust
pub async fn query_earnings_calendar(
    &self,
    market: &str,
    begin_date: &DateTime<chrono_tz::Tz>,
    end_date: &DateTime<chrono_tz::Tz>,
) -> Result<HashMap<String, EarningsInfo>, RequestError>
```

### CSV change

New column: `earnings_before_expiry` — empty if no earnings, `"YYYY-MM-DD (before_open)"` or `"YYYY-MM-DD (after_close)"` if earnings exist.

### Database change

Add `earnings_before_expiry TEXT` column to `option_strike` table. Stored per-row so historical data is preserved.

## 2. Momentum Flag

### Logic

Reuse existing `price_percentile` data stored in DB.

```rust
fn momentum_flag(price_percentile: f64) -> &'static str {
    if price_percentile > 0.90 { "EXTENDED" }
    else if price_percentile > 0.80 { "HIGH" }
    else { "NORMAL" }
}
```

### Data flow

```
price_percentile table (per symbol)
    │
    ▼
HashMap<String, f64> (symbol → percentile value)
    │
    ▼
CSV column: momentum_flag (NORMAL / HIGH / EXTENDED)
```

No new database column needed — derived at CSV generation time from data already in the DB.

### Where the data comes from

`collect_price_ranges` in `option.rs` already fetches 20-day candles and computes min/max. Extend to also fetch the stored `price_percentile` value per symbol. The `store/price_percentile.rs` already has a getter.

## 3. Top 3 Telegram Picks + Filter Adjustment

### Filter adjustment

In `calculate_put_score`:

```rust
// Before
if rate_of_return < 0.20 || rate_of_return > 0.65 { return None; }
if strike_percentile > 0.50 { return None; }

// After
if rate_of_return < 0.25 || rate_of_return > 0.65 { return None; }
if strike_percentile > 0.60 { return None; }
```

### Telegram caption format

```
🏆 Top 3 Puts — 09May 5-day

1. AAPL $170P | Bid: $2.35 / Ask: $2.50 | Return: 38%
   Score: 0.89 | Sharpe: 1.6 | Momentum: NORMAL

2. NVDA $115P | Bid: $1.82 / Ask: $1.95 | Return: 42%
   Score: 0.85 | Sharpe: 1.3 | Momentum: NORMAL

3. MSFT $310P | Bid: $4.10 / Ask: $4.30 | Return: 32%
   Score: 0.82 | Sharpe: 1.5 | Momentum: HIGH ⚠️

⚠️ Earnings: MU May 14 (before expiry)
```

~500 chars for 3 picks. Within Telegram's 1024 caption limit.

### Implementation

In `option_chain_to_csv_vec`, also return the top 3 scored chains. Or compute top 3 separately after scoring. Pass as a formatted string to `publish_to_telegram`, set as `caption` on the `SendDocument` call.

### Changes to `publish_to_telegram`

```rust
// Current
caption: None,

// New
caption: Some(formatted_top_picks),
```

## Files Changed

| File | Change |
|------|--------|
| `model.rs` | New `EarningsInfo` struct, update `calculate_put_score` pre-filters, add `momentum_flag()` helper, update `option_chain_to_csv_vec` signature and CSV columns, add top 3 selection + formatting |
| `option.rs` | Call earnings API after expiry is known, fetch price percentiles, pass earnings + momentum data to CSV/Telegram, update `publish_to_telegram` caption |
| `tiger/api_caller.rs` | New `query_earnings_calendar()` method |
| `store/option_chain.rs` | Add `earnings_before_expiry TEXT` column to schema |
| `constants.rs` | Momentum thresholds, return/percentile filter constants |

**Files not changed:** `atr.rs`, `maxdrop.rs`, `sharpe.rs`, `price_percentile.rs`, `quotes.rs`, `store/candle.rs`, `store/sharpe_ratio.rs`, `store/max_drop.rs`, `store/price_percentile.rs`

## Error Handling

| Scenario | Handling |
|----------|----------|
| Earnings API call fails | Log warning, proceed without earnings data. `earnings_before_expiry` column left empty. Non-blocking. |
| Price percentile missing for a symbol | `momentum_flag` column left empty for that symbol's rows. Already handled today. |
| No scored options pass filters | Telegram caption says "No qualifying puts found today." CSV still sent with all data. |
| Tiger API timeout on earnings | Same as API call failure — log and continue. |

## Testing

| Test | What it covers |
|------|----------------|
| `calculate_put_score` updated thresholds | `rate_of_return = 0.24` → None, `0.25` → passes. `strike_percentile = 0.60` → passes, `0.61` → None. |
| `momentum_flag` | 0.79 → NORMAL, 0.80 → HIGH, 0.90 → EXTENDED |
| Earnings API response parsing | Mock Tiger response, verify `HashMap<String, EarningsInfo>` correctly built |
| CSV output | Verify new columns appear in correct position with correct values |
| Telegram caption | Verify top 3 selection, formatting, earnings warning |
