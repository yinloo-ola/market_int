# Market Regime-Aware Trend Filtering — Implementation Plan

**Date:** 2026-05-16
**Design:** `docs/plans/2026-05-16-market-regime-design.md`

## Overview

Break the design into vertical-slice tasks. Each task produces one testable change that leaves the codebase in a working state.

---

## Task 1: Create `MarketRegime` struct and `from_spy_trend` constructor

<!-- tdd: new-feature -->

Files:
- `src/regime.rs` (new)
- `src/main.rs` (add `mod regime;`)

Steps:

1. Write failing tests for `MarketRegime::from_spy_trend` at key SPY values:

```rust
// src/regime.rs

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants;

    #[test]
    fn test_bull_market_no_adjustment() {
        // SPY well above EMA → bearness 0, no adjustments
        let r = MarketRegime::from_spy_trend(1.04);
        assert!((r.bearness - 0.0).abs() < 1e-9);
        assert!((r.trend_threshold - constants::TREND_THRESHOLD_BULL).abs() < 1e-9);
        assert!((r.weight_safety - 0.30).abs() < 1e-9);
        assert!((r.weight_trend - 0.30).abs() < 1e-9);
        assert!((r.weight_sharpe - 0.20).abs() < 1e-9);
        assert!((r.weight_return - 0.20).abs() < 1e-9);
        assert_eq!(r.flag, "");
    }

    #[test]
    fn test_at_ema_no_adjustment() {
        // SPY exactly at EMA → still bearness 0
        let r = MarketRegime::from_spy_trend(1.00);
        assert!((r.bearness - 0.0).abs() < 1e-9);
        assert_eq!(r.flag, "");
    }

    #[test]
    fn test_mild_pullback() {
        // SPY at 0.98 → bearness = (1.0 - 0.98) / 0.08 = 0.25
        let r = MarketRegime::from_spy_trend(0.98);
        assert!((r.bearness - 0.25).abs() < 1e-9);
        // threshold = 0.98 - 0.06 * 0.25 = 0.965
        assert!((r.trend_threshold - 0.965).abs() < 1e-9);
        // safety = 0.30 + 0.15 * 0.25 = 0.3375
        assert!((r.weight_safety - 0.3375).abs() < 1e-9);
        // trend = 0.30 - 0.15 * 0.25 = 0.2625
        assert!((r.weight_trend - 0.2625).abs() < 1e-9);
        assert_eq!(r.flag, "⚠️ Correction");
    }

    #[test]
    fn test_correction() {
        // SPY at 0.96 → bearness = 0.50
        let r = MarketRegime::from_spy_trend(0.96);
        assert!((r.bearness - 0.50).abs() < 1e-9);
        assert!((r.trend_threshold - 0.95).abs() < 1e-9);
        assert_eq!(r.flag, "⚠️ Correction");
    }

    #[test]
    fn test_deep_correction() {
        // SPY at 0.94 → bearness = 0.75
        let r = MarketRegime::from_spy_trend(0.94);
        assert!((r.bearness - 0.75).abs() < 1e-9);
        // threshold = 0.98 - 0.06 * 0.75 = 0.935
        assert!((r.trend_threshold - 0.935).abs() < 1e-9);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_full_bear() {
        // SPY at 0.92 → bearness = 1.0
        let r = MarketRegime::from_spy_trend(0.92);
        assert!((r.bearness - 1.0).abs() < 1e-9);
        // threshold = 0.98 - 0.06 = 0.92
        assert!((r.trend_threshold - 0.92).abs() < 1e-9);
        assert!((r.weight_safety - 0.45).abs() < 1e-9);
        assert!((r.weight_trend - 0.15).abs() < 1e-9);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_extreme_bear_clamped() {
        // SPY at 0.85 → bearness clamped to 1.0
        let r = MarketRegime::from_spy_trend(0.85);
        assert!((r.bearness - 1.0).abs() < 1e-9);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_weights_always_sum_to_one() {
        // Verify weights sum to 1.0 for multiple bearness values
        for spy_trend in [1.05, 1.00, 0.98, 0.96, 0.94, 0.92, 0.80] {
            let r = MarketRegime::from_spy_trend(spy_trend);
            let sum = r.weight_safety + r.weight_trend + r.weight_sharpe + r.weight_return;
            assert!((sum - 1.0).abs() < 1e-9,
                "weights must sum to 1.0 for spy_trend={}, got {}", spy_trend, sum);
        }
    }

    #[test]
    fn test_flag_boundary_correction_start() {
        // bearness = 0.01 → "⚠️ Correction"
        let r = MarketRegime::from_spy_trend(1.0 - 0.01 * constants::BEARNESS_MAX);
        assert_eq!(r.flag, "⚠️ Correction");
    }

    #[test]
    fn test_flag_boundary_bear_start() {
        // bearness = 0.51 → "🐻 Bear market"
        let r = MarketRegime::from_spy_trend(1.0 - 0.51 * constants::BEARNESS_MAX);
        assert_eq!(r.flag, "🐻 Bear market");
    }

    #[test]
    fn test_no_flag_at_zero_bearness() {
        let r = MarketRegime::from_spy_trend(1.0);
        assert_eq!(r.flag, "");
    }
}
```

2. Run tests — confirm they fail (struct and function don't exist yet):

```
cargo test regime::tests
```

3. Implement `MarketRegime`:

```rust
// src/regime.rs

/// SPY-based market regime metrics, computed once per pipeline run.
pub struct MarketRegime {
    pub bearness: f64,           // 0.0 (bull) to 1.0 (bear)
    pub trend_threshold: f64,    // 0.98 to 0.92
    pub weight_safety: f64,      // 0.30 to 0.45
    pub weight_trend: f64,       // 0.30 to 0.15
    pub weight_sharpe: f64,      // 0.20 (constant)
    pub weight_return: f64,      // 0.20 (constant)
    pub flag: &'static str,      // "", "⚠️ Correction", "🐻 Bear market"
}

impl MarketRegime {
    /// Compute regime from SPY's trend_ratio_long (price / EMA50).
    pub fn from_spy_trend(spy_trend_long: f64) -> Self {
        let bearness = ((1.0 - spy_trend_long).max(0.0) / crate::constants::BEARNESS_MAX).min(1.0);

        let trend_threshold = crate::constants::TREND_THRESHOLD_BULL
            - crate::constants::TREND_THRESHOLD_RANGE * bearness;

        let weight_safety = 0.30 + 0.15 * bearness;
        let weight_trend = 0.30 - 0.15 * bearness;

        let flag = if bearness <= 0.0 {
            ""
        } else if bearness <= 0.50 {
            "⚠️ Correction"
        } else {
            "🐻 Bear market"
        };

        Self {
            bearness,
            trend_threshold,
            weight_safety,
            weight_trend,
            weight_sharpe: 0.20,
            weight_return: 0.20,
            flag,
        }
    }
}
```

4. Add `mod regime;` to `src/main.rs` (after `mod model;`).

5. Run tests — confirm they all pass:

```
cargo test regime::tests
```

---

## Task 2: Update constants and refactor `calculate_put_score` to accept `&MarketRegime`

<!-- tdd: modifying-tested-code -->

Files:
- `src/constants.rs`
- `src/model.rs`

Steps:

1. Add new constants to `src/constants.rs`, keep `TREND_FILTER_THRESHOLD` temporarily for backward compatibility during refactor:

```rust
// Replace the existing TREND_FILTER_THRESHOLD line with:
pub const TREND_THRESHOLD_BULL: f64 = 0.98;     // Threshold in bull market (current behavior)
pub const TREND_THRESHOLD_RANGE: f64 = 0.06;    // How far threshold can drop (0.98 → 0.92)
pub const BEARNESS_MAX: f64 = 0.08;              // SPY drop that maps to bearness = 1.0
```

Remove `TREND_FILTER_THRESHOLD` since it's replaced by `TREND_THRESHOLD_BULL`.

2. Update `calculate_put_score` signature and body in `src/model.rs`:

```rust
// Old signature:
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
) -> Option<f64>

// New signature:
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
    regime: &crate::regime::MarketRegime,
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
    // Trend hard filter — use regime's dynamic threshold
    if trend_ratio_short < regime.trend_threshold {
        return None;
    }
    if trend_ratio_long < regime.trend_threshold {
        return None;
    }

    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let safety_norm = 1.0 - strike_percentile.max(0.0);
    let return_norm = (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);
    let trend_norm = ((trend_ratio_short - regime.trend_threshold) / 0.10).clamp(0.0, 1.0);

    Some(
        regime.weight_sharpe * sharpe_norm
            + regime.weight_safety * safety_norm
            + regime.weight_return * return_norm
            + regime.weight_trend * trend_norm,
    )
}
```

3. Update all existing tests in `src/model.rs` to pass `&MarketRegime::from_spy_trend(1.05)` (bull market — no adjustment, behaves like old code). Each test that currently calls `calculate_put_score(a, b, c, d, e)` needs to become `calculate_put_score(a, b, c, d, e, &MarketRegime::from_spy_trend(1.05))`.

Add `use crate::regime::MarketRegime;` at the top of the `mod tests` block.

The bull regime (spy_trend=1.05) produces the same threshold (0.98) and weights (0.30/0.30/0.20/0.20) as the old fixed constants, so all existing test assertions remain unchanged.

4. Add new tests for regime-adjusted scoring:

```rust
#[test]
fn test_put_score_bear_market_loosens_filter() {
    // In bear market (threshold 0.92), a stock at trend 0.94 passes
    // Old threshold (0.98) would block this
    let regime = MarketRegime::from_spy_trend(0.92); // full bear
    assert!(calculate_put_score(1.5, 0.10, 0.35, 0.94, 0.94, &regime).is_some());
}

#[test]
fn test_put_score_bear_market_still_blocks_freefall() {
    // Even in bear, stocks below threshold (0.92) are blocked
    let regime = MarketRegime::from_spy_trend(0.92);
    assert!(calculate_put_score(1.5, 0.10, 0.35, 0.90, 0.90, &regime).is_none());
}

#[test]
fn test_put_score_bear_shifts_weights() {
    // Same inputs but different regime → different score
    let bull = MarketRegime::from_spy_trend(1.05);
    let bear = MarketRegime::from_spy_trend(0.92);

    let bull_score = calculate_put_score(1.5, 0.10, 0.35, 1.05, 1.05, &bull).unwrap();
    let bear_score = calculate_put_score(1.5, 0.10, 0.35, 1.05, 1.05, &bear).unwrap();

    // Bear regime shifts weight from trend to safety
    // With these inputs: safety_norm=0.9, trend_norm=(1.05-0.92)/0.10=1.0
    // Bull: 0.20*0.75 + 0.30*0.9 + 0.20*1.0 + 0.30*0.7 = 0.15+0.27+0.20+0.21 = 0.83
    // Bear: 0.20*0.75 + 0.45*0.9 + 0.20*1.0 + 0.15*1.0 = 0.15+0.405+0.20+0.15 = 0.905
    assert!(bear_score > bull_score, "bear score ({}) should be > bull score ({})", bear_score, bull_score);
}
```

5. Run tests — confirm all pass:

```
cargo test model::tests
```

---

## Task 3: Thread `MarketRegime` through `option_chain_to_csv_vec` and its callers

<!-- tdd: modifying-tested-code -->

Files:
- `src/model.rs` (update `option_chain_to_csv_vec`)
- `src/option.rs` (update all callers)

Steps:

1. Update `option_chain_to_csv_vec` signature to accept `&MarketRegime`:

```rust
// Old:
pub fn option_chain_to_csv_vec(
    all_chains: &[OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, PutPriceRange>,
    price_percentiles: &HashMap<String, f64>,
    earnings_map: &HashMap<String, EarningsInfo>,
    trend_data: &HashMap<String, (f64, f64)>,
) -> Result<(Vec<u8>, Vec<TopPick>)>

// New:
pub fn option_chain_to_csv_vec(
    all_chains: &[OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, PutPriceRange>,
    price_percentiles: &HashMap<String, f64>,
    earnings_map: &HashMap<String, EarningsInfo>,
    trend_data: &HashMap<String, (f64, f64)>,
    regime: &crate::regime::MarketRegime,
) -> Result<(Vec<u8>, Vec<TopPick>)>
```

Inside the function, pass `regime` to both `calculate_put_score(...)` calls (in the CSV-writing loop and the top-picks scoring loop).

2. Update all tests in `model::tests` that call `option_chain_to_csv_vec` to pass `&MarketRegime::from_spy_trend(1.05)`:

```rust
// In each test that calls option_chain_to_csv_vec, add the regime parameter:
use crate::regime::MarketRegime;

// Example:
let (_csv, top_picks) = option_chain_to_csv_vec(
    &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data,
    &MarketRegime::from_spy_trend(1.05),
).unwrap();
```

3. Update `publish_to_telegram` in `src/option.rs` to accept `&MarketRegime` and pass it through to `option_chain_to_csv_vec`:

```rust
// Old:
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    _earnings_map: &HashMap<String, model::EarningsInfo>,
    price_percentiles: &HashMap<String, f64>,
    trend_data: &HashMap<String, (f64, f64)>,
    period: usize,
) -> model::Result<()>

// New:
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    _earnings_map: &HashMap<String, model::EarningsInfo>,
    price_percentiles: &HashMap<String, f64>,
    trend_data: &HashMap<String, (f64, f64)>,
    period: usize,
    regime: &crate::regime::MarketRegime,
) -> model::Result<()>
```

Update the internal call:
```rust
let (csv, top_picks) = model::option_chain_to_csv_vec(
    all_chains, sharpe_ratios, price_ranges, price_percentiles, _earnings_map, trend_data, regime
)?;
```

4. Update `retrieve_option_chains_with_expiry` in `src/option.rs` to accept `&MarketRegime` and pass it to `publish_to_telegram`:

```rust
// Add regime parameter:
pub async fn retrieve_option_chains_with_expiry(
    symbols_file_path: &str,
    side: &model::OptionChainSide,
    conn: &mut Connection,
    expiry_timeframe: ExpiryTimeframe,
    requester: &mut Requester,
    regime: &crate::regime::MarketRegime,
) -> model::Result<()>
```

Update the `publish_to_telegram` call inside it:
```rust
publish_to_telegram(&all_chains, &sharpe_ratios, &price_ranges, &earnings_map, &price_percentiles, &trend_data, period, regime).await
```

5. Update `publish_option_chains` in `src/option.rs` to accept `&MarketRegime`:

```rust
pub async fn publish_option_chains(
    symbols_file_path: &str,
    mut conn: Connection,
    period: usize,
    regime: &crate::regime::MarketRegime,
) -> model::Result<()>
```

Update its internal `publish_to_telegram` call to pass `regime`.

6. Update all callers in `src/main.rs` — for now, create a bull regime (`MarketRegime::from_spy_trend(1.05)`) as a placeholder since we haven't wired SPY data yet. This will be replaced in Task 5.

In `PerformAll`, `PullOptionChain5Day`, `PullOptionChain20Day`:
```rust
let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
```

In `PublishOptionChain`:
```rust
let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
```

7. Run all tests — confirm they pass:

```
cargo test
```

8. Build — confirm no compile errors:

```
cargo build
```

---

## Task 4: Add regime flag to Telegram caption

<!-- tdd: modifying-tested-code -->

Files:
- `src/option.rs`

Steps:

1. Update `format_telegram_caption` to accept `&MarketRegime` and prepend the flag:

```rust
// Old:
fn format_telegram_caption(top_picks: &[model::TopPick], period: usize) -> String

// New:
fn format_telegram_caption(top_picks: &[model::TopPick], period: usize, regime: &crate::regime::MarketRegime) -> String
```

Inside the function, prepend the flag if non-empty:
```rust
let mut caption = format!("🏆 Top 3 Puts — {} {}-day\n\n", date_str, period);

// Add regime flag if present
if !regime.flag.is_empty() {
    caption = format!("{} {}\n\n", regime.flag, date_str);
    // Rewrite the header with flag:
    caption = format!("🏆 Top 3 Puts — {} {}-day {} \n\n", date_str, period, regime.flag);
}
```

Actually, cleaner approach — add the flag on its own line above the header:
```rust
let mut caption = String::new();
if !regime.flag.is_empty() {
    caption.push_str(regime.flag);
    caption.push('\n');
}
caption.push_str(&format!("🏆 Top 3 Puts — {} {}-day\n\n", date_str, period));
```

Update the call in `publish_to_telegram`:
```rust
let caption = format_telegram_caption(&top_picks, period, regime);
```

2. Run all tests:

```
cargo test
```

3. Build:

```
cargo build
```

---

## Task 5: Compute SPY trend and wire regime into PerformAll pipeline

<!-- tdd: new-feature -->

Files:
- `src/regime.rs` (add `compute_spy_trend`)
- `src/main.rs` (wire into PerformAll, PullOptionChain5Day, PullOptionChain20Day)

Steps:

1. Add a function to fetch SPY's trend_ratio_long via Tiger API:

```rust
// In src/regime.rs

use crate::tiger::api_caller::Requester;
use crate::atr;
use crate::constants;

/// Fetch SPY's last 50 daily candles and compute trend_ratio_long.
/// Returns the ratio of current price / EMA50.
pub async fn compute_spy_trend(requester: &mut Requester) -> Result<f64, String> {
    let now = chrono::Local::now();
    let candles = requester
        .query_stock_quotes(&["SPY"], &now, constants::EMA_LONG_PERIOD, "day")
        .await
        .map_err(|e| format!("Failed to fetch SPY candles: {}", e))?;

    if candles.is_empty() {
        return Err("No SPY candles returned".to_string());
    }

    let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();

    if closes.len() < constants::EMA_LONG_PERIOD as usize {
        return Err(format!(
            "Not enough SPY candles (got {}, need {})",
            closes.len(),
            constants::EMA_LONG_PERIOD
        ));
    }

    let ema_long = atr::exponential_moving_average(&closes, constants::EMA_LONG_PERIOD);
    let current_price = closes.last().unwrap();
    let trend_ratio_long = current_price / ema_long;

    log::info!(
        "SPY regime: price={:.2}, EMA{}={:.2}, trend_ratio_long={:.4}",
        current_price,
        constants::EMA_LONG_PERIOD,
        ema_long,
        trend_ratio_long
    );

    Ok(trend_ratio_long)
}
```

2. Wire into `PerformAll` in `src/main.rs`. After `trend::calculate_and_save` and before the option chain calls, compute the regime:

```rust
// In PerformAll, after trend::calculate_and_save:

// Compute SPY-based market regime
let regime = match crate::regime::compute_spy_trend(&mut requester).await {
    Ok(spy_trend) => {
        let r = crate::regime::MarketRegime::from_spy_trend(spy_trend);
        log::info!(
            "Market regime: bearness={:.2}, threshold={:.3}, flag={}",
            r.bearness, r.trend_threshold, r.flag
        );
        r
    }
    Err(e) => {
        log::warn!("Failed to compute SPY regime, using bull defaults: {}", e);
        crate::regime::MarketRegime::from_spy_trend(1.05)
    }
};

// Pass &regime to retrieve_option_chains_with_expiry calls
```

3. Similarly wire into `PullOptionChain5Day` and `PullOptionChain20Day` — compute regime after creating the requester.

4. For `PublishOptionChain` (no API access), use bull defaults:
```rust
let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
```

5. Run all tests:

```
cargo test
```

6. Build:

```
cargo build
```

---

## Task 6: End-to-end integration test with mock data

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Files:
- `src/model.rs` (add integration test)

Steps:

1. Add a comprehensive test that validates the full scoring pipeline with different regimes:

```rust
#[test]
fn test_regime_integration_bear_allows_more_stocks() {
    use crate::regime::MarketRegime;

    // Simulate a bear market: 5 stocks, only 1 has trend > 0.98
    // Under bull regime, only 1 passes → 1 top pick
    // Under bear regime, more pass → more top picks
    let chains = vec![
        make_chain("AAPL", 90.0, 0.35),   // strong trend
        make_chain("MSFT", 350.0, 0.35),   // moderate trend (0.95)
        make_chain("TSLA", 200.0, 0.35),   // weak trend (0.93)
        make_chain("NVDA", 120.0, 0.35),   // very weak (0.90)
        make_chain("GOOG", 150.0, 0.35),   // freefall (0.85)
    ];

    let mut sharpe = HashMap::new();
    for sym in &["AAPL", "MSFT", "TSLA", "NVDA", "GOOG"] {
        sharpe.insert(sym.to_string(), 1.5);
    }

    let mut ranges = HashMap::new();
    ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
    ranges.insert("MSFT".to_string(), PutPriceRange { min: 300.0, max: 400.0 });
    ranges.insert("TSLA".to_string(), PutPriceRange { min: 150.0, max: 250.0 });
    ranges.insert("NVDA".to_string(), PutPriceRange { min: 100.0, max: 160.0 });
    ranges.insert("GOOG".to_string(), PutPriceRange { min: 130.0, max: 180.0 });

    let mut trend_data = HashMap::new();
    trend_data.insert("AAPL".to_string(), (1.05, 1.06));
    trend_data.insert("MSFT".to_string(), (0.95, 0.96));
    trend_data.insert("TSLA".to_string(), (0.93, 0.94));
    trend_data.insert("NVDA".to_string(), (0.90, 0.91));
    trend_data.insert("GOOG".to_string(), (0.85, 0.86));

    let percentiles = HashMap::new();
    let earnings = HashMap::new();

    // Bull regime: only AAPL passes trend filter (threshold=0.98)
    let bull = MarketRegime::from_spy_trend(1.05);
    let (_csv_bull, picks_bull) = option_chain_to_csv_vec(
        &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bull,
    ).unwrap();
    assert_eq!(picks_bull.len(), 1, "bull: only AAPL should pass");
    assert_eq!(picks_bull[0].underlying, "AAPL");

    // Bear regime: AAPL, MSFT, TSLA pass (threshold=0.92), NVDA at 0.90 also passes
    let bear = MarketRegime::from_spy_trend(0.92);
    let (_csv_bear, picks_bear) = option_chain_to_csv_vec(
        &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bear,
    ).unwrap();
    assert!(picks_bear.len() >= 3, "bear: at least AAPL, MSFT, TSLA should pass, got {}", picks_bear.len());
    assert!(picks_bear.len() <= 4, "bear: GOOG (0.85) should still be blocked");
}
```

2. Run all tests:

```
cargo test
```

3. Refactor — check for shallow modules, duplication, seam discipline. Run tests after changes.

4. Lessons — caught any mistake that applies to future tasks? Add rule to `docs/lessons.md`.

⏸ **CHECKPOINT: done** — present implementation review. Wait for human approval before committing.

---

## Summary

| Task | Description | Checkpoint |
|------|-------------|------------|
| 1 | `MarketRegime` struct + `from_spy_trend` with tests | — |
| 2 | Update constants, refactor `calculate_put_score` to use regime | — |
| 3 | Thread `&MarketRegime` through `option_chain_to_csv_vec` → `publish_to_telegram` → `retrieve_option_chains_with_expiry` | — |
| 4 | Add regime flag to Telegram caption | — |
| 5 | Compute SPY trend via Tiger API, wire into pipeline | — |
| 6 | Integration test + refactor + lessons | done |

Total: 6 tasks, ~15 files touched (4 new, rest modified).

Ready to execute? Run `/skill:executing-tasks`
