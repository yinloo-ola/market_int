# `Backtest` Pipeline — Deep-Dive Analysis

> **Entry point:** `src/main.rs:495` — `Commands::Backtest { symbols_file_path, from, to, config, period, output }`

The `backtest` subcommand is a **historical simulation engine** that replays the put-selection model over past market data stored in SQLite. Instead of fetching live quotes or option chains from APIs, it reads cached candle data, synthetically prices puts using Black-Scholes, applies the scoring model, tracks assignment outcomes, and outputs aggregate performance metrics across multiple strategy configurations.

---

## CLI Arguments

| Argument | Default | Description |
|---|---|---|
| `<symbols_file_path>` | (required) | Path to symbols file (one ticker per line) |
| `--from` | `2023-01-01` | Backtest start date (YYYY-MM-DD) |
| `--to` | `2024-12-31` | Backtest end date (YYYY-MM-DD) |
| `--config` | `all` | Config preset name (e.g., `"control"`) or `"all"` to run every preset |
| `--period` | `5` | DTE period for simulated options (5 or 20) |
| `--output` | `backtest_results.csv` | CSV output file path |

---

## Pipeline Overview (Execution Order)

```
┌─────────────────────────────────────┐
│  1. Parse dates & validate          │  Parse --from / --to into NaiveDate
├─────────────────────────────────────┤
│  2. Read symbols & sectors          │  Load from symbols file + sector mappings
├─────────────────────────────────────┤
│  3. Resolve config(s)               │  "all" → 38 presets, or single named config
├─────────────────────────────────────┤
│  4. For each config:                │
│  ┌─────────────────────────────────┐│
│  │ 4a. Load all candles            ││  Bulk-read from SQLite into HashMap
│  │ 4b. Generate simulation dates   ││  Every Monday between --from and --to
│  │ 4c. For each sim_date:          ││
│  │   • Compute SPY regime          ││  EMA50 trend from SPY candles up to sim_date
│  │   • For each symbol:            ││
│  │     - Slice candles ≤ sim_date  ││  Simulate "what we knew then"
│  │     - Compute indicators        ││  Trend, Sharpe, max drop, volatility
│  │     - Compute strike range      ││  From max drop stats + trend factor
│  │     - Price puts via BS         ││  Black-Scholes at $0.50 strike intervals
│  │     - Score candidates          ││  Apply config-specific pre-filters + weights
│  │   • Rank & select top 3         ││  Deduplicate by symbol & sector
│  │   • Check assignment            ││  Compare close at expiry vs. strike
│  │   • Compute net P&L             ││  Premium − assignment loss
│  │ 4d. Aggregate metrics           ││  Assignment rate, avg return, P&L, regime breakdown
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  5. Print & write CSV               │  Terminal summary + CSV with all picks
└─────────────────────────────────────┘
```

---

## Step-by-Step Breakdown

### Step 1 — Parse Dates & Validate

**Source:** `src/main.rs:503–516`

**What it does:**
1. Parses `--from` and `--to` strings as `NaiveDate` (expects `YYYY-MM-DD` format).
2. Returns early with an error log if either date is invalid.

**Intent:**
- Define the historical window to simulate. The simulation iterates over every Monday in this range, treating each as a hypothetical "pick day."

---

### Step 2 — Read Symbols & Sectors

**Source:** `src/main.rs:518–525`

**What it does:**
1. Reads the symbols file (same format as `perform-all`).
2. Loads sector mappings (`SYMBOL,SECTOR` CSV) into a `HashMap<String, String>`.

**Intent:**
- Same symbol and sector infrastructure as the live pipeline. Sectors are used for diversity enforcement in top-3 selection.

---

### Step 3 — Resolve Configuration(s)

**Source:** `src/main.rs:527–558`

**What it does:**
1. If `--config all`, loads all **38 preset configurations** from `BacktestConfig::all_presets()`.
2. If a named config (e.g., `"control"`), loads that single preset.
3. The optional `--period` flag overrides the default `period` (5) for all resolved configs.

**Intent:**
- Enable **ablation testing** — run many variants of the scoring model in one pass to compare which parameters produce the best historical risk/reward. Each config is a self-contained hypothesis about what matters most (trend, safety, return, regime, etc.).

---

### Step 4a — Load All Candles (`load_all_candles`)

**Source:** `src/backtest.rs:893`

**What it does:**
1. For each symbol in the list, fetches the last **850 candles** from SQLite (`store::candle::get_candles`).
2. Stores them in a `HashMap<String, Vec<Candle>>` for fast lookup during simulation.
3. Always loads **SPY** candles (even if not in the symbols list) for regime computation.

**Intent:**
- **Bulk load once, reuse across all simulation dates.** This is a key performance optimization — instead of querying the DB for each symbol on each sim_date, all data is pre-loaded into memory. SPY is always loaded because regime computation requires it.

---

### Step 4b — Generate Simulation Dates (`generate_mondays`)

**Source:** `src/backtest.rs:927`

**What it does:**
1. Generates a list of every **Monday** between `from_date` and `to_date` (inclusive).

**Intent:**
- Simulate a **weekly cadence** — as if the trader runs the model every Monday morning. Mondays are chosen because standard US equity options expire on Fridays, making Monday the natural entry point for ~5-day puts.

---

### Step 4c — Inner Simulation Loop (per sim_date)

This is the core of the backtest engine. For each Monday in the simulation window:

#### 4c-i. Compute SPY Regime

**Source:** `src/backtest.rs:974`

**What it does:**
1. Filters SPY candles up to `sim_date` (no look-ahead).
2. Computes EMA50 on the filtered SPY closes.
3. Calls `config.build_regime(spy_trend_long)` to get a `MarketRegime` (Bull/Correction/Bear).
4. Falls back to bull defaults if SPY data is unavailable or insufficient (< 50 candles).

**Intent:**
- **Dynamic regime detection** — unlike `perform-all` which hardcodes bull, the backtest **recomputes regime at every simulation date** from historical SPY data. This tests whether regime-aware filtering would have improved historical performance.

---

#### 4c-ii. Evaluate Each Symbol

**Source:** `src/backtest.rs:992`

For each non-SPY symbol:

1. **Slice candles** to only those ≤ `sim_date` — simulates "what the model knew on that day" (no future leakage).
2. **Skip** if fewer than 50 candles (insufficient for EMA50).
3. **Compute indicators** on the sliced data:
   - **Trend ratios** (EMA20/EMA50) via `trend::calculate_trend_ratios()`.
   - **Sharpe ratio** via `sharpe::compute_sharpe()` with the config's risk-free rate.
   - **Max drop stats** (`percentile_drop`, `ema_drop`) for the given period via `maxdrop::compute_max_drop_stats_with_percentile()`.
   - **Historical volatility** via `estimate_historical_volatility()` — 20-day rolling window of daily log returns, annualized × √252.
4. **Compute strike range** using `calculate_adjusted_strike_range()` — same function as the live pipeline, using the computed max drop stats, DTE, and config's trend factor.
5. **Price puts** via Black-Scholes:
   - Iterates strikes in **$0.50 increments** from `min_strike` to `max_strike`.
   - `T = dte / 252` (fraction of a year).
   - `sigma = historical_vol × iv_multiplier` (default 1.3× to simulate the IV > HV premium typical in real markets).
   - Calls `black_scholes_put(price, strike, T, risk_free_rate, dividend_yield, iv_vol)`.
6. **Compute rate of return** using `compute_rate_of_return(premium, strike, dte)` — matches Tiger API's formula: `premium / strike / num_of_weeks × 52`.
7. **Compute strike percentile** via `calculate_strike_percentile()` using the last 20 days of close prices. Used only by `StrikePercentile` configs (and as a diagnostic); `MaxDropBand` configs ignore it.
8. **Score each candidate** via `config.score_candidate(sharpe, strike_pct, rate_of_return, trend_short, trend_long, regime, band_safety)` — applies the config's pre-filters and weighted scoring. `band_safety = calculate_max_drop_safety(strike, min_strike, max_strike)` is computed only when `safety_source == MaxDropBand` (skipped otherwise). Under `MaxDropBand`, safety = band position and the `rate>max` / `strike_percentile>max` pre-filters are skipped, matching production.

**Intent:**
- **Synthetically replicate the live pipeline** without calling any external API. Black-Scholes replaces the Tiger option chain API. All indicator calculations are identical to the live code, ensuring the backtest faithfully represents what the model would have picked.

---

#### 4c-iii. Rank & Select Top 3

**Source:** `src/backtest.rs:1114–1138`

**What it does:**
1. Sorts all scored candidates by score (descending).
2. Selects up to **3 picks** with:
   - **Unique underlying** — no two picks from the same stock.
   - **Unique sector** — no two picks from the same known sector ("Unknown" is exempt).
3. This is the **same deduplication logic** as the live pipeline.

---

#### 4c-iv. Check Assignment & Compute P&L

**Source:** `src/backtest.rs:1140–1188`

**What it does:**
1. For each top pick, looks up the **close price at expiry** (`sim_date + period` days) and the **close price the day after** expiry.
2. Uses `find_close_on_date()` which tolerates up to 7 calendar days of slack (handles weekends/holidays).
3. **Assignment check**: if the close at expiry (or day-after fallback) < strike → `assigned = true`.
4. **Net P&L per share**:
   - `assignment_loss = max(0, strike − worst_close)` where `worst_close = min(close_expiry, close_day_after)`.
   - `net_pnl = premium − assignment_loss`.
   - Positive = profit (premium kept). Negative = loss (assignment cost exceeded premium).

**Intent:**
- **Measure real outcomes** — the backtest doesn't just score picks, it checks whether the put would have been assigned and calculates the actual dollar gain/loss per share.

---

### Step 4d — Aggregate Metrics

**Source:** `src/backtest.rs:1191–1260`

**What it does:**

Computes summary statistics across all simulation dates:

| Metric | Description |
|---|---|
| `total_simulations` | Number of Mondays in the date range |
| `total_picks` | Total picks across all sim dates (≤ 3 per date) |
| `assignment_count` | How many picks were assigned (stock closed below strike) |
| `assignment_rate` | `assignment_count / total_picks` |
| `avg_rate_of_return` | Average annualized return of all picked puts |
| `avg_score` | Average composite score |
| `avg_loss_when_assigned` | Average % below strike for assigned puts |
| `avg_net_pnl` | Average net P&L per pick ($/share) |
| `total_premium_collected` | Sum of all premiums |
| `total_assignment_loss` | Sum of all assignment losses |

Also breaks down picks by regime (Bull / Correction / Bear) with per-regime assignment rate and avg return.

---

### Step 5 — Output Results

**Source:** `src/main.rs:574–581`, `src/backtest.rs:1264`

**What it does:**
1. **Terminal output**: `format_metrics()` prints a formatted summary for each config, including regime breakdown.
2. **CSV output**: `write_csv()` writes every pick from every config to a single CSV file with columns:
   ```
   config, sim_date, symbol, sector, strike, price, premium, rate_of_return,
   score, trend_short, trend_long, regime, assigned, close_at_expiry,
   close_day_after, net_pnl
   ```

**Intent:**
- Enable **side-by-side comparison** of configs. The CSV can be loaded into a spreadsheet or analysis tool to identify which config has the lowest assignment rate, highest P&L, best regime-specific performance, etc.

---

## Configuration Presets (Ablation Matrix)

The backtest ships with **38 presets** organized into experimental groups:

### Baseline & Production Mirror

| Config | Description |
|---|---|
| `control` | Research baseline — all features enabled (trend, regime, symmetric scoring, `StrikePercentile` safety). **Not** a mirror of live production scoring. |
| `production-mirror` | Faithful mirror of the **live production** scoring after the 2026-07 redesign: `MaxDropBand` safety, weights 0.40/0.40/0.20 (no trend), `AsymmetricStatic` (`ideal_return=0.80`), no hard caps, no trend pre-filters, `drop_percentile=0.97`, `risk_free_rate=0`. A pinning test asserts its `score_candidate` equals `model::calculate_put_score`. |

> **`SafetySource`** (added 2026-07): each config selects the safety dimension — `StrikePercentile` (old: `1 − strike_percentile`, with `rate>max` and `strike_percentile>max` pre-filters) or `MaxDropBand` (new: position in `[strike_from, strike_to]`, no hard caps — matches production). `control` and the ablation presets use `StrikePercentile`; only `production-mirror` uses `MaxDropBand`.

### Ablation: Trend Features

| Config | What's Removed |
|---|---|
| `no-trend-factor` | Strike range never tightened by trend |
| `no-trend-long` | `trend_ratio_long` pre-filter disabled |
| `no-trend-score` | Trend weight (0.30) redistributed to safety (0.60) |
| `no-regime` | Always uses bull regime thresholds |
| `no-trend-at-all` | All trend features off — pure sharpe + safety + return |

### Ablation: Return Filters

| Config | Change |
|---|---|
| `wide-return` | `min_return` 0.15, `max_return` 1.0 (wider acceptance band) |

### Sweep: Safety Weight

| Config | Weights (sharpe/safety/return) |
|---|---|
| `sweep-safety-50` | 0.20 / 0.50 / 0.30 |
| `sweep-safety-45` | 0.35 / 0.45 / 0.20 |
| `sweep-safety-40` | 0.20 / 0.40 / 0.40 |

### Sweep: Strike Percentile Threshold

| Config | `max_strike_percentile` |
|---|---|
| `sweep-pct-40` | 0.40 |
| `sweep-pct-50` | 0.50 |
| `sweep-pct-70` | 0.70 |

### Sweep: Max Drop Percentile

| Config | `drop_percentile` |
|---|---|
| `sweep-drop-80` | 0.80 (tighter strike range) |
| `sweep-drop-85` | 0.85 |
| `sweep-drop-90` | 0.90 (default) |
| `sweep-drop-95` | 0.95 (wider strike range) |

### Return-Prioritized

| Config | Change |
|---|---|
| `return-50` | Return weight 0.50 |
| `return-min-30` | `min_return` raised to 0.30 |
| `return-pct70` | `max_strike_percentile` = 0.70 |
| `return-aggro` | Safety 0.25, return 0.55, min 0.30, pct 0.70 |

### Premium Income Experiments

| Config | Approach |
|---|---|
| `premium-a-conservative` | Higher ideal return (0.50), wider band (0.25), tighter strikes (0.50) |
| `premium-a-tight` | Same as A but `max_strike_percentile` = 0.40 |
| `premium-b-return-focus` | Same as A but return weight 0.60 |
| `premium-b-tight` | B + tight strikes |
| `premium-c-min35` | `min_return` = 0.35 |
| `premium-c-min40` | `min_return` = 0.40, ideal 0.55 |
| `premium-d-wide-max` | `max_return` = 1.0, return weight 0.50 |
| `premium-e-high-iv` | IV multiplier 1.5× |
| `premium-f-high-iv-return` | High IV + return focus + tight strikes |

### Scoring Shape Experiments

| Config | Scoring Type | `ideal_return` |
|---|---|---|
| `suggestion-1` | AsymmetricStatic (`min(1.0, return / ideal)`) | 0.50 |
| `combined-dynamic` | AsymmetricDynamic (target scales with regime) | 0.40–0.65 |
| `premium-static-060` | AsymmetricStatic | 0.60 |
| `premium-static-070` | AsymmetricStatic | 0.70 |
| `premium-static-080` | AsymmetricStatic | 0.80 |
| `premium-static-090` | AsymmetricStatic | 0.90 |
| `premium-static-100` | AsymmetricStatic | 1.00 |

---

## Black-Scholes Pricing Model

**Source:** `src/backtest.rs:12–55`

The backtest uses a **Black-Scholes put pricer** instead of live option chain data:

- **Cumulative normal** (`cumulative_normal`): Abramowitz & Stegun approximation, max error ~7.5×10⁻⁸.
- **Put price** (`black_scholes_put`): Standard BS formula with inputs: spot (S), strike (K), time (T in years), risk-free rate (r), dividend yield (q), volatility (σ).
- **Historical volatility** (`estimate_historical_volatility`): 20-day rolling window of daily log returns, annualized by √252. Falls back to 30% if insufficient data.
- **IV adjustment**: Historical vol is multiplied by `iv_multiplier` (default 1.3) to simulate the real-world premium where implied volatility exceeds realized volatility.

---

## Data Flow Diagram

```
                    ┌──────────────┐
                    │ symbols.csv  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────────────┐
              ▼            ▼                    ▼
     ┌────────────────┐  ┌──────────────┐  ┌──────────────┐
     │ SQLite (read)  │  │ BacktestConfig│  │ Sector map   │
     │ candles (850d) │  │ (38 presets)  │  │ (from CSV)   │
     └───────┬────────┘  └──────┬───────┘  └──────┬───────┘
             │                  │                  │
             ▼                  ▼                  ▼
     ┌──────────────────────────────────────────────────┐
     │              run_backtest()                       │
     │  ┌─────────────────────────────────────────────┐ │
     │  │  For each Monday × for each symbol:         │ │
     │  │  1. Slice candles ≤ sim_date                │ │
     │  │  2. Compute: trend, sharpe, max_drop, vol   │ │
     │  │  3. Strike range → BS pricing → score       │ │
     │  │  4. Rank → top 3 (dedup symbol + sector)    │ │
     │  │  5. Check assignment → compute P&L          │ │
     │  └─────────────────────────────────────────────┘ │
     └──────────────────────┬───────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌────────────┐         ┌──────────────┐
         │ Terminal   │         │ CSV file     │
         │ summary    │         │ (all picks)  │
         └────────────┘         └──────────────┘
```

---

## Error Handling Philosophy

The backtest uses a **"skip silently, continue"** pattern:

- **Date parse failure** → return early (fatal).
- **Symbols file unreadable** → return early (fatal).
- **Unknown config name** → return early (fatal).
- **No candles for a symbol** → skip that symbol (logged as warning).
- **Insufficient candles for indicator** → skip that symbol on that sim_date (no log).
- **CSV write failure** → logged as error, but backtest already completed and printed to terminal.

This ensures that even if some symbols lack data, the backtest still produces results for the ones that do.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **No API calls** | Backtest runs entirely from cached SQLite data — no Tiger, no Telegram, no network. Makes it reproducible and fast. |
| **Black-Scholes pricing** | Synthetic option prices replace live chain data. IV is estimated as 1.3× historical vol to approximate real market conditions. |
| **Weekly (Monday) cadence** | Matches the typical put-selling cycle: enter Monday, expire Friday. Also keeps simulation count manageable. |
| **No look-ahead** | Candles are sliced at each sim_date so indicators only use past data. SPY regime is recomputed per sim_date. |
| **$0.50 strike intervals** | Standard US equity option strike increment for most underlyings. |
| **38 config presets** | Enables systematic ablation testing to identify which features (trend, regime, safety weight, etc.) contribute most to performance. |
| **Top-3 dedup** | Same symbol + sector diversity as live pipeline — tests the real selection logic. |
| **Net P&L tracking** | Goes beyond just scoring — measures actual profit/loss including assignment scenarios. |
| **Regime breakdown** | Metrics are segmented by Bull/Correction/Bear to show whether configs perform differently across market conditions. |

---

## Constants Reference (Backtest-Specific)

| Parameter | Default | Used In |
|---|---|---|
| `risk_free_rate` | 0.045 | Black-Scholes pricing |
| `dividend_yield` | 0.015 | Black-Scholes pricing |
| `vol_window` | 20 | Historical volatility lookback |
| `iv_multiplier` | 1.3 | IV premium over historical vol |
| `ideal_return` | 0.35 | Peak of return scoring (control) |
| `return_bandwidth` | 0.20 | Half-width of symmetric return triangle |

All other constants (EMA periods, percentile thresholds, etc.) are shared with the live pipeline and defined in `src/constants.rs`.
