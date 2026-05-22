# Backtest Subcommand — Design Doc

## Goal

A `backtest` CLI subcommand that simulates the option-picking pipeline on historical dates using existing candle data, estimates premiums via Black-Scholes, and outputs metrics to compare algorithm configurations. This enables data-driven decisions about which features (trend_factor, regime, easing, etc.) to keep, remove, or retune.

## What the backtest validates

The full pipeline minus external APIs:

1. ✅ **Stock filtering** — which stocks pass trend/sharpe/percentile pre-filters
2. ✅ **Strike range selection** — `calculate_adjusted_strike_range` with configurable trend_factor
3. ✅ **Premium estimation** — Black-Scholes put pricing → `rate_of_return`
4. ✅ **Scoring and ranking** — `calculate_put_score` with configurable regime
5. ✅ **Assignment check** — did the stock close below the strike at expiry + 1 day?
6. ❌ Not validated — liquidity (bid/ask spread, open interest), earnings events

## Simulation loop

For each Monday in `[from_date, to_date]`:

```
for each simulation_date (weekly, Mondays):
    1. For each symbol, load candles up to simulation_date
    2. Compute indicators from candle slices (pure functions, no DB writes):
       - max_drop(period) → (percentile_drop, ema_drop) using rolling windows
       - sharpe ratio from daily returns
       - price_percentile (20-day)
       - trend_ratios (EMA20, EMA50) for symbol
    3. Compute SPY trend_long → MarketRegime
    4. For each symbol:
       a. Compute strike range via calculate_adjusted_strike_range
       b. Generate strikes at $0.50 intervals within [min_strike, max_strike]
       c. For each strike, estimate put premium via Black-Scholes
       d. Compute rate_of_return = premium / strike * (52 / num_of_weeks(dte))
       e. Apply pre-filters (rate_of_return range, sharpe > 0, strike_percentile, trend thresholds)
       f. Score via calculate_put_score
    5. Rank all candidates, select top 3 (dedup by symbol, dedup by sector)
    6. Look ahead: for each top pick, check if stock's close at expiry_date + 1 trading day < strike
    7. Record: symbol, strike, rate_of_return, score, assigned (bool), regime
```

### Assignment definition

Check the **close price on the expiry date and one trading day after**. If either close < strike → "assigned". This avoids false positives from intraday dips that recover, and catches Monday gap-downs after Friday expiry.

### Rate of return formula

Matches the existing Tiger API calculation:
```
mid = estimated_premium   (from Black-Scholes)
rate_of_return = mid / strike / num_of_weeks(dte) * 52.0
```

Where `num_of_weeks` matches the existing Tiger implementation.

## Black-Scholes put pricing

European put (early exercise premium is negligible for OTM puts):
```
P = K * e^(-rT) * N(-d2) - S * e^(-qT) * N(-d1)

d1 = (ln(S/K) + (r - q + σ²/2)T) / (σ√T)
d2 = d1 - σ√T
```

Inputs:
| Input | Source |
|---|---|
| S (spot price) | Latest close from candles |
| K (strike) | From strike range calculation |
| T (time to expiry) | DTE / 252 |
| r (risk-free rate) | Constant 0.045 (can be configured) |
| q (dividend yield) | Constant 0.015 (can be configured) |
| σ (volatility) | Rolling 20-day annualized stdev of daily returns |

The cumulative normal distribution `N(x)` uses the standard rational approximation (Abramowitz & Stegun). No external crate needed.

## Configuration presets

A `BacktestConfig` struct captures every tunable parameter. Named presets allow ablation testing:

```rust
struct BacktestConfig {
    name: String,
    period: usize,                    // 5 or 20

    // Strike range
    use_trend_factor: bool,           // false = trend_factor always 1.0
    trend_tighten_multiplier: f64,
    trend_tighten_cap: f64,
    trend_tighten_peak: f64,
    trend_tighten_ease_back: f64,

    // Pre-filters
    min_rate_of_return: f64,
    max_rate_of_return: f64,
    max_strike_percentile: f64,

    // Scoring weights (must sum to 1.0)
    weight_sharpe: f64,
    weight_safety: f64,
    weight_return: f64,
    weight_trend: f64,

    // Trend filters
    use_trend_short_filter: bool,     // false = skip trend_short pre-filter
    use_trend_long_filter: bool,      // false = skip trend_long pre-filter
    use_trend_in_score: bool,         // false = trend_norm = 0, redistribute weight

    // Regime
    use_regime: bool,                 // false = always use bull thresholds
    trend_threshold_bull: f64,
    trend_threshold_range: f64,
    bearness_max: f64,
}
```

### Initial presets

| Preset | What it tests |
|---|---|
| `control` | Current production defaults (baseline) |
| `no-trend-factor` | `use_trend_factor = false` — strike range never tightened |
| `no-trend-long` | `use_trend_long_filter = false` — remove long-term trend gate |
| `no-trend-score` | `use_trend_in_score = false`, redistribute trend weight to safety |
| `no-regime` | `use_regime = false` — always use bull thresholds |
| `no-trend-at-all` | All trend features off — pure sharpe + safety + return |
| `wide-return` | `min_rate_of_return = 0.15`, `max_rate_of_return = 1.0` — looser return filter |

## Data flow

```
┌─────────────────────────────────────────────────┐
│ SQLite: candle table                            │
│ Load all candles per symbol once at startup     │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│ Simulation Loop (weekly)                        │
│                                                 │
│  for each Monday in date_range:                 │
│    for each symbol:                             │
│      slice candles up to sim_date               │
│      compute indicators (pure functions)        │
│      compute strike range                       │
│      generate strikes × BS pricing              │
│      filter + score                             │
│    rank → top 3                                 │
│    look ahead → assignment check                │
└─────────────┬───────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│ Output: CSV + terminal summary                  │
│                                                 │
│ Per-config metrics:                             │
│   - total_picks                                 │
│   - assignment_count / assignment_rate           │
│   - avg_rate_of_return                          │
│   - avg_score                                   │
│   - avg_loss_when_assigned (% below strike)     │
│   - by_regime breakdown (bull/correction/bear)  │
│                                                 │
│ Detailed CSV: one row per pick per sim_date     │
│   sim_date, symbol, strike, price,              │
│   rate_of_return, score, assigned,              │
│   close_at_expiry, close_day_after              │
└─────────────────────────────────────────────────┘
```

## Output format

### Terminal summary (one per config)

```
══════════════════════════════════════════════════════
Config: control
Period: 5-day | From: 2023-01-03 | To: 2024-12-30
Simulations: 104 | Picks: 312
────────────────────────────────────────────────────
Assignment rate:    12.5% (39 / 312)
Avg return:        38.2%
Avg score:         0.74
Avg loss (assigned): 4.2% below strike
By regime:
  Bull (72 runs):     8.3% assignment, avg return 35.1%
  Correction (24):   16.7% assignment, avg return 42.8%
  Bear (8):          25.0% assignment, avg return 51.2%
══════════════════════════════════════════════════════
```

### CSV output (one file per run, all configs combined)

```
config,sim_date,symbol,strike,price,rate_of_return,score,trend_short,trend_long,regime,assigned,close_at_expiry,close_day_after
control,2023-01-03,AAPL,125.0,130.5,0.32,0.78,1.03,1.05,bull,false,132.0,131.5
control,2023-01-03,MSFT,240.0,255.0,0.35,0.82,1.04,1.06,bull,false,258.0,256.0
no-trend-factor,2023-01-03,AAPL,120.0,130.5,0.22,0.65,1.03,1.05,bull,false,132.0,131.5
...
```

## Refactoring needed

Current indicator calculation functions (`maxdrop`, `sharpe`, `trend`, `price_percentile`) read from DB, compute, and save. The backtest needs only the compute part. Extract pure functions:

| Module | New pure function | Current function to refactor |
|---|---|---|
| `maxdrop` | `compute_max_drop_stats(candles: &[Candle], period: usize) -> (f64, f64)` | `calculate_and_save` (chunk → window fix happens first, separately) |
| `sharpe` | `compute_sharpe(candles: &[Candle], risk_free_rate: f64) -> f64` | `calculate_and_save` |
| `price_percentile` | `compute_price_percentile(candles: &[Candle]) -> f64` | `calculate_and_save` |
| `trend` | `calculate_trend_ratios(closes: &[f64]) -> (f64, f64)` | Already pure ✅ |
| `option` | `calculate_adjusted_strike_range(...)` | Already pure ✅ |
| `model` | `calculate_trend_factor`, `calculate_put_score`, `calculate_strike_percentile` | Already pure ✅ |

The existing `calculate_and_save` functions become thin wrappers: load candles → call pure function → save result.

## New module: `src/backtest.rs`

Contains:
- `BacktestConfig` struct with preset factory methods
- `black_scholes_put_price(s, k, t, r, q, sigma) -> f64`
- `cumulative_normal(x) -> f64` (Abramowitz & Stegun approximation)
- `estimate_historical_volatility(closes: &[f64], window: usize) -> f64`
- `run_simulation(config, candles_map, spy_candles, from, to) -> BacktestResult`
- `BacktestResult` struct with metrics + per-pick details
- Terminal output formatting
- CSV output writing

## CLI interface

```bash
# New subcommand
cargo run -- backtest <symbols_file_path> [options]

Options:
  --from <date>         Start date (default: 2023-01-01)
  --to <date>           End date (default: 2024-12-31)
  --config <name>       Config preset name (default: all)
  --period <n>          DTE period: 5 or 20 (default: 5)
  --output <path>       CSV output path (default: backtest_results.csv)
  --risk-free-rate <r>  Risk-free rate for BS (default: 0.045)
```

Examples:
```bash
# Run all configs for 5-day expiry
cargo run -- backtest data/symbols.csv --from 2023-01-01 --to 2024-12-31

# Run single config for 20-day expiry
cargo run -- backtest data/symbols.csv --config no-trend-factor --period 20

# Validate on 2025 holdout
cargo run -- backtest data/symbols.csv --from 2025-01-01 --to 2025-05-22
```

## Tuning workflow after backtest is built

1. **Run `--config all` on 2023-2024** — compare all presets against control
2. **Ablation**: any preset that matches or beats control with fewer features → simplify the algorithm
3. **Parameter sweep**: for surviving features, sweep key constants (PERCENTILE, TREND_TIGHTEN_PEAK, etc.) by adding sweep presets
4. **Validate on 2025 holdout** — the final chosen config must not degrade on unseen data
5. **No branches needed** — all comparison happens in the output CSV and terminal summary

## What's NOT in scope

- Historical option chain data (we use Black-Scholes estimates)
- Liquidity simulation (bid/ask spreads, open interest)
- Earnings calendar integration
- Transaction costs or slippage
- Automated parameter optimization (grid search, etc.) — manual analysis of output is sufficient for now
