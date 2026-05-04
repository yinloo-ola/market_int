# Put Option Scoring — Implementation Plan

Design doc: `docs/plans/2026-05-05-put-scoring-design.md`

---

## Task 1: Add scoring functions and tests in model.rs

<!-- tdd: new-feature -->
<!-- checkpoint: test -->

Add `calculate_strike_percentile`, `calculate_put_score`, and `PutPriceRange` struct to `model.rs`. Write tests first.

**File**: `src/model.rs`

Add after the `PricePercentile` struct:

```rust
/// Stores the 20-day price range for a symbol (for strike percentile calculation).
#[derive(Debug, Clone)]
pub struct PutPriceRange {
    pub min: f64,
    pub max: f64,
}

/// Calculates the percentile of a strike price within a [min, max] range.
/// Returns 0.0 if min == max.
pub fn calculate_strike_percentile(strike: f64, min: f64, max: f64) -> f64 {
    if max == min {
        return 0.5;
    }
    (strike - min) / (max - min)
}

/// Calculates a composite score [0, 1] for a put option.
/// Returns None if the option fails any pre-filter.
///
/// Pre-filters:
///   - rate_of_return in [0.25, 0.60]
///   - sharpe > 0
///   - strike_percentile <= 0.40
///
/// Score = 0.30 * sharpe_norm + 0.40 * safety_norm + 0.30 * return_norm
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
) -> Option<f64> {
    // Pre-filters
    if rate_of_return < 0.25 || rate_of_return > 0.60 {
        return None;
    }
    if sharpe <= 0.0 {
        return None;
    }
    if strike_percentile > 0.40 {
        return None;
    }

    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let safety_norm = 1.0 - strike_percentile;
    let return_norm = (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);

    Some(0.30 * sharpe_norm + 0.40 * safety_norm + 0.30 * return_norm)
}
```

Add test module at the bottom of `model.rs`:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_strike_percentile_at_min() {
        assert!((calculate_strike_percentile(100.0, 100.0, 200.0) - 0.0).abs() < 1e-9);
    }

    #[test]
    fn test_strike_percentile_at_max() {
        assert!((calculate_strike_percentile(200.0, 100.0, 200.0) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_strike_percentile_mid() {
        assert!((calculate_strike_percentile(150.0, 100.0, 200.0) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn test_strike_percentile_below_min() {
        let result = calculate_strike_percentile(80.0, 100.0, 200.0);
        assert!(result < 0.0);
    }

    #[test]
    fn test_strike_percentile_above_max() {
        let result = calculate_strike_percentile(250.0, 100.0, 200.0);
        assert!(result > 1.0);
    }

    #[test]
    fn test_strike_percentile_equal_range() {
        assert!((calculate_strike_percentile(100.0, 100.0, 100.0) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn test_put_score_good_option() {
        // sharpe=1.8, percentile=0.10, return=0.32
        // sharpe_norm=0.9, safety_norm=0.9, return_norm=0.85
        // score = 0.30*0.9 + 0.40*0.9 + 0.30*0.85 = 0.27 + 0.36 + 0.255 = 0.885
        let score = calculate_put_score(1.8, 0.10, 0.32).unwrap();
        assert!((score - 0.885).abs() < 1e-9);
    }

    #[test]
    fn test_put_score_filtered_low_return() {
        assert!(calculate_put_score(1.5, 0.10, 0.20).is_none());
    }

    #[test]
    fn test_put_score_filtered_high_return() {
        assert!(calculate_put_score(1.5, 0.10, 0.70).is_none());
    }

    #[test]
    fn test_put_score_filtered_negative_sharpe() {
        assert!(calculate_put_score(-0.5, 0.10, 0.35).is_none());
    }

    #[test]
    fn test_put_score_filtered_zero_sharpe() {
        assert!(calculate_put_score(0.0, 0.10, 0.35).is_none());
    }

    #[test]
    fn test_put_score_filtered_high_percentile() {
        assert!(calculate_put_score(1.5, 0.50, 0.35).is_none());
    }

    #[test]
    fn test_put_score_boundary_return_low() {
        // return = 0.25 is the boundary, should pass
        assert!(calculate_put_score(1.0, 0.10, 0.25).is_some());
    }

    #[test]
    fn test_put_score_boundary_return_high() {
        // return = 0.60 is the boundary, should pass
        assert!(calculate_put_score(1.0, 0.10, 0.60).is_some());
    }

    #[test]
    fn test_put_score_boundary_percentile() {
        // percentile = 0.40 is the boundary, should pass
        assert!(calculate_put_score(1.0, 0.40, 0.35).is_some());
    }

    #[test]
    fn test_put_score_peak_return() {
        // return exactly at 0.35 → return_norm = 1.0
        // sharpe=2.0 → sharpe_norm=1.0, percentile=0.0 → safety_norm=1.0
        // score = 0.30 + 0.40 + 0.30 = 1.0
        let score = calculate_put_score(2.0, 0.0, 0.35).unwrap();
        assert!((score - 1.0).abs() < 1e-9);
    }
}
```

**Run**: `cargo test` — tests should compile and pass.

**Commit**: `feat: add strike percentile and put score functions with tests`

---

## Task 2: Update CSV output to use strike percentile and score columns

<!-- tdd: new-feature -->
<!-- checkpoint: done -->

Change `option_chain_to_csv_vec` to accept `price_ranges: &HashMap<String, PutPriceRange>` instead of `price_percentiles`. Compute strike percentile per row, then score.

**File**: `src/model.rs`

Replace the existing `option_chain_to_csv_vec` function with:

```rust
pub fn option_chain_to_csv_vec(
    all_chains: &[OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, PutPriceRange>,
) -> Result<Vec<u8>> {
    let buf = BufWriter::new(Vec::new());
    let mut writer = Writer::from_writer(buf);

    // Write header row
    writer
        .write_record([
            "underlying",
            "strike",
            "underlying_price",
            "side",
            "bid",
            "mid",
            "ask",
            "bid_size",
            "ask_size",
            "last",
            "expiration",
            "updated",
            "dte",
            "volume",
            "open_interest",
            "rate_of_return",
            "strike_from",
            "strike_to",
            "sharpe_ratio",
            "strike_percentile",
            "score",
        ])
        .map_err(QuotesError::CsvError)?;

    // Write the data rows.
    for chain in all_chains {
        let sharpe_ratio = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);

        let (strike_percentile_str, score_str) = match price_ranges.get(&chain.underlying) {
            Some(range) => {
                let sp = calculate_strike_percentile(chain.strike, range.min, range.max);
                let score = calculate_put_score(sharpe_ratio, sp, chain.rate_of_return);
                let sp_str = format!("{:.3}", sp);
                let score_str = score.map(|s| format!("{:.3}", s)).unwrap_or_default();
                (sp_str, score_str)
            }
            None => (String::new(), String::new()),
        };

        writer
            .write_record([
                &chain.underlying,
                &chain.strike.to_string(),
                &chain.underlying_price.to_string(),
                &format!("{:?}", chain.side),
                &chain.bid.to_string(),
                &chain.mid.to_string(),
                &chain.ask.to_string(),
                &chain.bid_size.to_string(),
                &chain.ask_size.to_string(),
                &chain.last.to_string(),
                &chain.expiration,
                &chain.updated,
                &chain.dte.to_string(),
                &chain.volume.to_string(),
                &chain.open_interest.to_string(),
                &chain.rate_of_return.to_string(),
                &chain.strike_from.to_string(),
                &chain.strike_to.to_string(),
                &format!("{:.3}", sharpe_ratio),
                &strike_percentile_str,
                &score_str,
            ])
            .map_err(QuotesError::CsvError)?;
    }

    let bytes = writer.into_inner().unwrap().into_inner().unwrap();
    Ok(bytes)
}
```

**Commit**: `feat: update CSV to output strike_percentile and score per row`

---

## Task 3: Wire price_ranges into option.rs callers

<!-- tdd: modifying-tested-code -->
<!-- checkpoint: done -->

Update `retrieve_option_chains_with_expiry`, `publish_option_chains`, and `publish_to_telegram` to fetch 20-day candles, compute min/max, and pass `PutPriceRange` instead of `price_percentiles`.

**File**: `src/option.rs`

3a. Replace the `price_percentiles` collection in `retrieve_option_chains_with_expiry` (around lines 270–290) with price_ranges:

```rust
    // Collect 20-day price ranges for all symbols
    let mut price_ranges: HashMap<String, model::PutPriceRange> = HashMap::new();
    for symbol in &symbols {
        match candle::get_candles(conn, symbol, constants::PRICE_PERCENTILE_DAYS) {
            Ok(candles) if !candles.is_empty() => {
                let min_price = candles.iter().map(|c| c.close).fold(f64::INFINITY, f64::min);
                let max_price = candles.iter().map(|c| c.close).fold(f64::NEG_INFINITY, f64::max);
                price_ranges.insert(symbol.clone(), model::PutPriceRange { min: min_price, max: max_price });
            }
            _ => {
                log::warn!("No 20-day candles found for symbol: {}", symbol);
            }
        }
    }

    publish_to_telegram(&all_chains, &sharpe_ratios, &price_ranges, period).await
```

Remove the existing `price_percentiles` collection block (the `// Collect price percentiles for all symbols` section).

3b. In `publish_option_chains`, similarly replace the `price_percentiles` loop:

```rust
    let mut price_ranges: HashMap<String, model::PutPriceRange> = HashMap::new();
    for symbol in &symbols {
        match candle::get_candles(&conn, symbol, constants::PRICE_PERCENTILE_DAYS) {
            Ok(candles) if !candles.is_empty() => {
                let min_price = candles.iter().map(|c| c.close).fold(f64::INFINITY, f64::min);
                let max_price = candles.iter().map(|c| c.close).fold(f64::NEG_INFINITY, f64::max);
                price_ranges.insert(symbol.clone(), model::PutPriceRange { min: min_price, max: max_price });
            }
            _ => {
                log::warn!("No 20-day candles found for symbol: {}", symbol);
            }
        }
    }

    publish_to_telegram(&all_chains, &sharpe_ratios, &price_ranges, period).await
```

Remove the existing `price_percentiles` loop.

3c. Update `publish_to_telegram` signature and body:

```rust
pub async fn publish_to_telegram(
    all_chains: &[model::OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, model::PutPriceRange>,
    period: usize,
) -> model::Result<()> {
    let csv = model::option_chain_to_csv_vec(all_chains, sharpe_ratios, price_ranges)?;
    // ... rest unchanged
```

3d. Remove the now-unused `price_percentile` import from the `use` block at the top of `option.rs`:

Remove `price_percentile,` from the `use crate::{ ... }` statement.

**Run**: `cargo build` to verify compilation.

**Commit**: `feat: wire 20-day price ranges into CSV for strike percentile scoring`

---

## Task 4: Verify end-to-end with cargo test

<!-- tdd: trivial -->
<!-- checkpoint: none -->

Run all tests and verify build:

```bash
cargo test
cargo build
```

Both should succeed with no warnings.

**Commit**: (no new commit unless fixes are needed)
