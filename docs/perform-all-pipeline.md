# `PerformAll` Pipeline — Deep-Dive Analysis

> **Entry point:** `src/main.rs:329` — `Commands::PerformAll { symbols_file_path }`

The `perform-all` subcommand is the **full end-to-end pipeline** of `market_int`. It takes a single argument — a path to a symbols file — and executes every stage sequentially: from pulling raw OHLCV candle data, through computing technical indicators, to retrieving option chains, scoring them, and publishing the top picks to Telegram.

---

## Pipeline Overview (Execution Order)

```
┌─────────────────────────────┐
│  1. pull_and_save()         │  Fetch OHLCV candles from Tiger API → SQLite
├─────────────────────────────┤
│  2. calculate_and_save(5)   │  5-day rolling max drawdown
├─────────────────────────────┤
│  3. calculate_and_save(20)  │  20-day rolling max drawdown
├─────────────────────────────┤
│  4. calculate_and_save()    │  Annualized Sharpe ratio
├─────────────────────────────┤
│  5. calculate_and_save()    │  20-day price percentile
├─────────────────────────────┤
│  6. calculate_and_save()    │  EMA20/EMA50 trend ratios
├─────────────────────────────┤
│  7. Initialize Tiger API    │  RSA-signed API requester (caches expirations)
│  8. Set market regime       │  Bull/Correction/Bear (hardcoded to bull)
│  9. Load sector mappings    │  symbols.csv → HashMap<String, String>
├─────────────────────────────┤
│ 10. retrieve_option_chains  │  5-day (Short) put option chains
│     (Short / 5-day)         │  → filter → score → publish to Telegram
├─────────────────────────────┤
│ 11. retrieve_option_chains  │  20-day (Medium) put option chains
│     (Medium / 20-day)       │  → filter → score → publish to Telegram
└─────────────────────────────┘
```

---

## Step-by-Step Breakdown

### Step 1 — `quotes::pull_and_save()`

**Source:** `src/quotes.rs:8`

**What it does:**
1. Reads the symbols file (one ticker per line) via `symbols::read_symbols_from_file()`.
2. Creates the `candle` table in SQLite if it doesn't exist (`store::candle::create_table()`).
3. Initializes a Tiger API `Requester` — this sets up an RSA-signed HTTP client using credentials from `.env` (`TIGER_ID`, `TIGER_RSA`). The requester is used to call Tiger's `kline` endpoint for OHLCV data.
4. Iterates over symbols in **batches of 10** (Tiger API rate limit), calling `requester.query_stock_quotes()` for each batch.
   - Requests daily candles (`"day"` period), fetching the last **850 trading days** (`CANDLE_COUNT = 850`), which is roughly 3.4 years of history.
5. Saves each batch of candles into the SQLite `candle` table via `store::candle::save_candles()`.
6. Sleeps **1 second** between batches to respect API rate limits.

**Intent:**
- Establish a persistent local cache of daily OHLCV data for every tracked symbol. All subsequent calculations (ATR, Sharpe, max drop, etc.) are computed from this cached data, so the API only needs to be called once per pipeline run.
- 850 days provides enough history for meaningful 50-day EMA calculations and multi-year backtests.

---

### Step 2 — `maxdrop::calculate_and_save(period=5)`

**Source:** `src/maxdrop.rs:13`

**What it does:**
1. Reads symbols from the file and creates the `max_drop` table in SQLite.
2. For each symbol, fetches the last 850 daily candles from the `candle` table.
3. Computes **rolling max drawdowns** using sliding windows of size `period` (5 days):
   - For each 5-day window, tracks the highest high (`peak`) and finds the largest peak-to-trough drop: `max_drop = (peak - low) / trough`.
   - This produces a series of max-drop values — one per overlapping window.
4. From these rolling max-drops, it computes two summary statistics:
   - **`percentile_drop`**: The 90th percentile of all rolling max-drops (via `atr::percentile()` with `PERCENTILE = 0.9`). This represents the "worst case" drop that occurs ~10% of the time.
   - **`ema_drop`**: A 5-period exponential moving average of the rolling max-drops. This represents the "recent average" max drop.
5. Saves `(symbol, period=5, percentile_drop, ema_drop, timestamp)` to SQLite.

**Intent:**
- Quantify how much each stock tends to drop in a 5-day window. The 90th-percentile figure is the key input for computing the **lower bound of the put strike range** — i.e., "how far down could this stock realistically go in 5 days?"
- The EMA version captures recent volatility changes (e.g., if a stock has become more volatile recently).

---

### Step 3 — `maxdrop::calculate_and_save(period=20)`

**Source:** `src/maxdrop.rs:13` (same function, different `period` argument)

**What it does:**
- Identical to Step 2, but uses 20-day sliding windows instead of 5-day.
- Produces `percentile_drop` and `ema_drop` for the 20-day horizon.

**Intent:**
- The 20-day max drop is used as the **primary reference period** when computing strike ranges for the 20-day (Medium) option chain retrieval. A stock that drops 15% in a typical 20-day window needs puts with strikes at least 15% below current price to be considered "in the money" scenarios.

---

### Step 4 — `sharpe::calculate_and_save()`

**Source:** `src/sharpe.rs:8`

**What it does:**
1. For each symbol, fetches the last 850 candles.
2. Computes daily **log returns**: `r_i = (close_i - close_{i-1}) / close_{i-1}`.
3. Requires at least 14 candles (`SHARPE_MIN_CANDLES = 14`).
4. Computes the **annualized Sharpe ratio**:
   - Daily excess return = daily return − daily risk-free rate (risk-free rate = 0 by default).
   - Average daily excess return × 252 = annualized excess return.
   - Std dev of daily excess returns × √252 = annualized volatility.
   - Sharpe = annualized excess return / annualized volatility.
5. Saves `(symbol, sharpe_ratio, timestamp)` to SQLite.

**Intent:**
- Provide a **risk-adjusted return metric** for each stock. Stocks with negative or zero Sharpe ratios are filtered out during option scoring — the thesis is that you only want to sell puts on stocks with positive risk-adjusted momentum.
- A high Sharpe (> 1.0) means the stock has been consistently rewarding relative to its volatility — a good candidate for cash-secured put selling.

---

### Step 5 — `price_percentile::calculate_and_save()`

**Source:** `src/price_percentile.rs:7`

**What it does:**
1. For each symbol, fetches the last **20 daily candles** (`PRICE_PERCENTILE_DAYS = 20`).
2. Computes a simple **price percentile**:
   - Finds min and max close prices over the 20-day window.
   - `percentile = (current_close − min) / (max − min)`.
   - Returns 0.5 if all prices are equal (flat).
3. Saves `(symbol, percentile, timestamp)` to SQLite.

**Intent:**
- Measure **where the current price sits relative to its recent 20-day range**. This is the **momentum indicator**:
  - `percentile > 0.90` → **EXTENDED** (stock is near its 20-day high — risky for put selling).
  - `percentile > 0.80` → **HIGH** momentum.
  - Otherwise → **NORMAL**.
- Shown in the Telegram output and CSV for context, though it does not directly filter or score (the pre-filters in `calculate_put_score` do not use it).

---

### Step 6 — `trend::calculate_and_save()`

**Source:** `src/trend.rs:10`

**What it does:**
1. For each symbol, fetches the last **50 candles** (at least `EMA_LONG_PERIOD = 50`).
2. Computes two EMAs on the close prices:
   - **EMA20** (short): 20-period exponential moving average.
   - **EMA50** (long): 50-period exponential moving average.
3. Computes **trend ratios** (price relative to each EMA):
   - `trend_ratio_short = current_price / EMA20`.
   - `trend_ratio_long = current_price / EMA50`.
4. Saves `(symbol, ema_short, ema_long, trend_ratio_short, trend_ratio_long, timestamp)` to SQLite.

**Intent:**
- **Trend ratios > 1.0** mean the price is above the moving average (uptrend). **< 1.0** means the price is below (downtrend).
- Originally used as a pre-filter (reject stocks with `trend_ratio < 0.98`), but the trend filter was **subsequently removed** from `calculate_put_score()`. The data is still collected and stored because:
  - It feeds into the **Telegram caption** display (shows trend %).
  - It populates the `trend_short` and `trend_long` columns in the output CSV.
  - It's available for the backtesting module.
- The `calculate_trend_factor()` function (in `model.rs`) uses `trend_ratio_short` to tighten strike ranges for strong-trending stocks, though `PerformAll` currently hardcodes `trend_factor = 1.0` (no tightening).

---

### Step 7 — Initialize Tiger API Requester

**Source:** `src/main.rs:359`

```rust
let mut requester = match tiger::api_caller::Requester::new().await { ... }
```

**What it does:**
- Creates a new `Requester` struct with:
  - A `reqwest::Client` with a 3-second timeout.
  - An empty cache (`HashMap`) for option expiration data (populated lazily on first query).
- The requester authenticates every request with **RSA-SHA1 signatures** using the `TIGER_ID` and base64-encoded `TIGER_RSA` private key from `.env`.

**Intent:**
- **Reuse a single authenticated client** across both the 5-day and 20-day option chain retrievals. The `option_expiration_cache` is populated during the first call and reused for the second, saving API calls.
- Created here (after all local DB computations) to avoid holding an HTTP client open during CPU-bound indicator calculations.

---

### Step 8 — Set Market Regime (Hardcoded Bull)

**Source:** `src/main.rs:368`

```rust
let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
```

**What it does:**
- Creates a `MarketRegime` struct with a hardcoded SPY trend ratio of **1.05** (price is 5% above its 50-day EMA).
- With `spy_trend = 1.05`:
  - `bearness = 0.0` (fully bull).
  - `trend_threshold = 0.98` (standard filter threshold).
  - `weight_safety = 0.30`, `weight_trend = 0.30` (equal weighting).
  - `flag = ""` (no warning label).

**Intent:**
- **Bypasses the dynamic SPY check** (which would require an extra API call to fetch SPY candles and compute its EMA50). In `perform-all`, time and API budget are conserved by assuming a bull market.
- The `regime` is passed into `option_chain_to_csv_vec()` which uses it for scoring. In the current code, `calculate_put_score()` uses **static weights** (safety 40%, return 40%, sharpe 20%) regardless of regime, but the regime struct is still plumbed through for future use.
- Contrast with `PullOptionChain5Day` / `PullOptionChain20Day` subcommands, which **do** call `compute_spy_trend()` dynamically.

---

### Step 9 — Load Sector Mappings

**Source:** `src/main.rs:369`

```rust
let sectors = sectors::load_sectors(&symbols_file_path).unwrap_or_default();
```

**What it does:**
- Reads the symbols file as a CSV with two columns: `SYMBOL,SECTOR` (e.g., `AAPL,Technology`).
- Builds a `HashMap<String, String>` mapping ticker → sector name.
- If the file is missing or unreadable, returns an empty map (all symbols default to `"Unknown"`).

**Intent:**
- **Sector diversity** in top picks. The `option_chain_to_csv_vec()` function enforces that no two top-3 picks share the same sector (unless the sector is "Unknown"). This prevents, e.g., picking AAPL, MSFT, and NVDA — all Technology — and instead promotes diversification across Energy, Financials, Healthcare, etc.
- Sector labels are also included in the Telegram caption for readability.

---

### Step 10 — `option::retrieve_option_chains_with_expiry(Short / 5-day)`

**Source:** `src/option.rs:100`

This is the most complex step. Here's the detailed breakdown:

#### 10a. Read symbols & create table
- Reads symbols from file, creates the `option_strike` table in SQLite.

#### 10b. Determine period
- `ExpiryTimeframe::Short` → `period = 5`.

#### 10c. For each batch of 10 symbols:

##### 10c-i. Get option expirations from Tiger API
- Calls `requester.option_expiration()` to get all available expiration dates for the symbols.
- Results are **cached** by symbol — the same expiration data is reused for the 20-day retrieval in Step 11.

##### 10c-ii. Calculate target expiration date
- `get_expiration_date(Short)` returns a date ~5–7 calendar days from now, using a lookup table indexed by weekday (`SHORT_DAYS`). This ensures we always target the nearest standard weekly expiry.

##### 10c-iii. Find nearest actual expiration
- `Requester::find_nearest_expiration()` matches the computed target date against the actual exchange expiration dates returned by the API, selecting the closest one.

##### 10c-iv. Calculate DTE (Days to Expiry)
- `calculate_trading_days_to_expiry()` counts trading days (excludes weekends) between now and the expiration date. This is critical for scaling the strike range.

##### 10c-v. Compute adjusted strike ranges
- For each symbol in the batch:
  1. Fetches the 5-day `percentile_drop` and `ema_drop` from the `max_drop` table (computed in Step 2).
  2. Fetches the latest close price from the `candle` table.
  3. Calls `calculate_adjusted_strike_range()` with:
     - `trend_factor = 1.0` (hardcoded — no tightening).
     - `adjustment_factor = dte / period` (scales drops to the actual DTE).
  4. The function computes:
     - `adjusted_percentile_drop = percentile_drop × (dte / period)`
     - `adjusted_ema_drop = ema_drop × (dte / period)`
     - `v1 = price × (1 − adjusted_ema_drop)` — EMA-based strike
     - `v2 = price × (1 − adjusted_percentile_drop)` — percentile-based strike
     - `min_strike = min(v1, v2)`, `max_strike = max(v1, v2)` after safety adjustment
  5. The **strike range** `[min_strike, max_strike]` defines which put strikes to query from the API.

##### 10c-vi. Query option chain from Tiger API
- Calls `requester.query_option_chain()` with the computed strike ranges, underlying prices, expiration date, and minimum open interest filter (`MIN_OPEN_INTEREST = 50`).
- Returns a `Vec<OptionStrikeCandle>` — each representing one put option contract with bid/ask, volume, open interest, implied return, etc.

##### 10c-vii. Filter low-quality chains
- `filter_option_chains()` applies quality thresholds:
  | Criterion | Minimum |
  |---|---|
  | bid_size | 3 |
  | ask_size | 3 |
  | volume | 3 |
  | open_interest | 3 |
  | bid price | $0.03 |
  | ask price | $0.05 |
  | ask/bid ratio | ≤ 5.0 |

  This removes illiquid or wide-spread options that are impractical to trade.

##### 10c-viii. Save to SQLite
- Filtered chains are saved to the `option_strike` table via `store::option_chain::save_option_strike()`.

#### 10d. Collect enrichment data from SQLite
After all batches are processed, the function collects **supplementary metrics** from the database for scoring:
- **Sharpe ratios** → `collect_sharpe_ratios()` — from `sharpe_ratio` table.
- **Price ranges** → `collect_price_ranges()` — 20-day min/max close from `candle` table (for strike percentile calculation).
- **Price percentiles** → `collect_price_percentiles()` — from `price_percentile` table.
- **Trend data** → `collect_trend_data()` — `(trend_ratio_short, trend_ratio_long)` from `trend` table.

#### 10e. Fetch earnings calendar
- Calls `requester.query_earnings_calendar("US", today, today + period + 7 days)` to get upcoming earnings dates.
- Builds a `HashMap<String, EarningsInfo>` keyed by symbol.
- If a symbol reports earnings before option expiry, that information is surfaced in the Telegram message as a **⚠️ Earnings warning**.

#### 10f. Score, rank, and publish to Telegram
Calls `publish_to_telegram()`, which orchestrates:

##### 10f-i. Score every option chain
`model::option_chain_to_csv_vec()` processes each `OptionStrikeCandle`:
1. **Strike percentile**: `calculate_strike_percentile(strike, min_price_20d, max_price_20d)` — where does this strike sit within the 20-day price range? A percentile of 0.0 means the strike equals the 20-day low (deeply in-the-money); 1.0 means it equals the 20-day high.
2. **Composite score** via `calculate_put_score(sharpe, strike_percentile, rate_of_return, trend_short, trend_long, regime)`:
   - **Pre-filters** (any failure → `None`, excluded from picks):
     - `rate_of_return ∈ [0.30, 0.80]` — avoids too-small premiums and too-risky deep OTM puts.
     - `sharpe > 0` — only stocks with positive risk-adjusted returns.
     - `strike_percentile ≤ 0.60` — strike must be in the lower 60% of the 20-day range.
   - **Score formula** (static weights, regime-independent in current code):
     ```
     score = 0.20 × sharpe_norm + 0.40 × safety_norm + 0.40 × return_norm
     
     where:
       sharpe_norm = clamp(sharpe / 2.0, 0..1)
       safety_norm = 1.0 − clamp(strike_percentile, 0..∞)
       return_norm = 1.0 − |rate_of_return − 0.35| / 0.20  (ideal = 35% return)
     ```
   - The ideal put has: high Sharpe (consistent winner), low strike percentile (safe, near support), and ~35% annualized return (sweet spot for premium collection).

##### 10f-ii. Select Top 3 picks with diversity
- All scored options are sorted by score (descending).
- Iterates through, selecting up to **3 picks** with constraints:
  - **Unique underlying** — no two picks from the same stock.
  - **Unique sector** — no two picks from the same known sector ("Unknown" sector is exempt from this rule).

##### 10f-iii. Generate CSV
- A full CSV is generated with all chains (not just top 3), including columns: underlying, sector, strike, bid, ask, volume, OI, rate_of_return, sharpe_ratio, strike_percentile, score, price_percentile, earnings, trend_short, trend_long.

##### 10f-iv. Send to Telegram
- The CSV file is uploaded as a document to the configured Telegram chat via the **Telegram Bot API** (`send_document`).
- A separate text message (`send_message`) is sent with the **caption** — a human-readable summary:
  ```
  🏆 Top 3 Puts — 06Jun 5-day

  1. AAPL (Technology) $185P | Bid: $1.50 / Ask: $1.80 | Return: 35%
     Score: 0.88 | Sharpe: 1.5 | Pctl: 72% | Trend: 103%

  ⚠️ Earnings: NVDA 2026-06-12 (AMC)
  ```

**Intent:**
- Deliver an **actionable daily digest** to the user's Telegram. The CSV provides full data for further analysis, while the top-3 caption gives an at-a-glance summary of the best put-selling opportunities with ~5-day expiry.

---

### Step 11 — `option::retrieve_option_chains_with_expiry(Medium / 20-day)`

**Source:** `src/option.rs:100` (same function, `ExpiryTimeframe::Medium`)

**What it does:**
- **Structurally identical** to Step 10, with two differences:
  1. **`period = 20`** — uses 20-day max drop data (from Step 3) for strike range computation.
  2. **Target expiration**: `get_expiration_date(Medium)` returns ~25–31 calendar days from now (`MEDIUM_DAYS` table), targeting the nearest standard monthly expiry.
  3. **Reuses the same `requester`** — the option expiration cache populated in Step 10 is reused, avoiding redundant API calls.
  4. **Reuses the same `regime` and `sectors`** from Steps 8–9.

**Intent:**
- Provide a **second time horizon** for put selling. 20-day puts offer:
  - Higher premiums (more time value).
  - Wider strike ranges (stocks can move more in 20 days).
  - Different risk/reward profile compared to 5-day puts.
- Publishing both timeframes lets the user choose based on their risk tolerance and market outlook.

---

## Data Flow Diagram

```
                    ┌──────────────┐
                    │ symbols.csv  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────────────┐
              ▼            ▼                    ▼
     ┌────────────────┐  ┌──────────────┐  ┌──────────┐
     │ Tiger API      │  │ SQLite (read)│  │ .env     │
     │ (kline, option,│  │ candles,     │  │ tokens,  │
     │  earnings)     │  │ max_drop,    │  │ keys     │
     └───────┬────────┘  │ sharpe,      │  └─────┬────┘
             │           │ trend,       │        │
             │           │ price_pctl   │        │
             │           └──────┬───────┘        │
             │                  │                │
             ▼                  ▼                ▼
     ┌──────────────────────────────────────────────┐
     │         option_chain_to_csv_vec()             │
     │  ┌─────────────┐  ┌───────────────────────┐ │
     │  │ Score each   │→ │ Rank & deduplicate    │ │
     │  │ option chain │  │ (unique ticker,       │ │
     │  │              │  │  unique sector)       │ │
     │  └─────────────┘  └───────────┬───────────┘ │
     └────────────────────────────────┼─────────────┘
                                      │
                          ┌───────────┴───────────┐
                          ▼                       ▼
                   ┌────────────┐         ┌──────────────┐
                   │ CSV upload │         │ Telegram     │
                   │ (.csv file)│         │ caption msg  │
                   └────────────┘         └──────────────┘
```

---

## Error Handling Philosophy

The `PerformAll` pipeline uses a **"best-effort, continue-on-error"** pattern. Each step is wrapped in a `match` block that logs errors but does **not abort** the pipeline:

```rust
match step_function(...) {
    Ok(_) => log::info!("Success"),
    Err(err) => log::error!("Error: {}", err),
}
```

**Rationale:** If one symbol fails to fetch or one metric fails to compute, the pipeline should still process the remaining symbols and produce output. The only **hard stops** are:
- Tiger API requester initialization failure (no API = no option chains).
- Database connection initialization failure.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **850-day candle history** | Enough for meaningful 50-day EMA and multi-year backtesting. |
| **Batches of 10** | Tiger API rate limit per request. 1s sleep between batches. |
| **90th percentile max drop** | Captures tail risk without being dominated by extreme outliers. |
| **Hardcoded bull regime** | Saves an API call in the full pipeline. Standalone commands (`pull-option-chain-5-day`) use dynamic SPY checks. |
| **Static scoring weights** (40/40/20) | Simplifies the model. Regime-based dynamic weights were removed after testing showed static weights performed better in backtests. |
| **Sector diversity in top 3** | Prevents concentration risk — e.g., 3 tech puts all dropping on the same NASDAQ selloff. |
| **WAL journal mode** | Better SQLite concurrency for the next read while writing. |
| **Earnings warnings** | Selling puts before earnings is risky (IV crush + gap risk). The warning lets the user decide. |

---

## Constants Reference

All tunable parameters are centralized in `src/constants.rs`:

| Constant | Value | Used In |
|---|---|---|
| `CANDLE_COUNT` | 850 | Number of daily candles fetched |
| `MIN_OPEN_INTEREST` | 50 | Minimum OI for option chain queries |
| `PERCENTILE` | 0.9 | 90th percentile for max drop and ATR |
| `SHARPE_MIN_CANDLES` | 14 | Minimum candles for Sharpe calculation |
| `DEFAULT_RISK_FREE_RATE` | 0.0 | Risk-free rate for Sharpe (effectively raw return/vol) |
| `PRICE_PERCENTILE_DAYS` | 20 | Window for price percentile |
| `EMA_SHORT_PERIOD` | 20 | Short EMA for trend |
| `EMA_LONG_PERIOD` | 50 | Long EMA for trend |
| `MIN_RATE_OF_RETURN` | 0.30 | Pre-filter: minimum put return |
| `MAX_RATE_OF_RETURN` | 0.80 | Pre-filter: maximum put return |
| `MAX_STRIKE_PERCENTILE` | 0.60 | Pre-filter: max strike percentile |
| `BEARNESS_MAX` | 0.08 | SPY drop mapping to full bear (8% below EMA50) |

---

## Runtime Environment

- **Runs on Google Cloud Run Jobs** (Docker → `distroless/cc` base image).
- **Cron-scheduled** to execute the full pipeline daily (typically pre-market or post-market).
- **Secrets** (API tokens, RSA key) injected via Google Secret Manager → environment variables.
- **Data persisted** via GCS FUSE mount at `/data` (SQLite database).
- **Output delivered** to Telegram for mobile notification.
