# Implementation Plan: Asymmetric Strike Tightening + ROR Filter Relaxation

Two changes:
1. Apply `trend_factor` only to `strike_to` (upper bound), leaving `strike_from` (lower bound) un-tightened so more lower strikes are available.
2. Raise `MAX_RATE_OF_RETURN` from 0.65 to 0.80.

---

## Task 1: Modify `calculate_adjusted_strike_range` + update MAX_RATE_OF_RETURN

<!-- tdd: modifying-tested-code -->
<!-- checkpoint: done -->

Files:
- `src/option.rs`
- `src/constants.rs`

Steps:

1. Run existing tests to confirm green baseline:
   ```
   cd /Volumes/Ext/code/personal/market_int && cargo test
   ```

2. Update `MAX_RATE_OF_RETURN` in `src/constants.rs`:
   ```rust
   pub const MAX_RATE_OF_RETURN: f64 = 0.80;
   ```

3. Rewrite `calculate_adjusted_strike_range` in `src/option.rs` to apply `trend_factor` only to `max_strike`:

   ```rust
   /// Calculates adjusted strike range based on DTE, period, and trend factor.
   /// Trend tightening is applied only to the upper bound (strike_to),
   /// keeping the lower bound (strike_from) un-tightened so more lower strikes are available.
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

       // Compute drops without trend tightening
       let adjusted_percentile_drop = percentile_drop * adjustment_factor;
       let adjusted_ema_drop = ema_drop * adjustment_factor;

       // Calculate strike prices
       let v1 = underlying_price * (1.0 - adjusted_ema_drop);
       let v2 = underlying_price * (1.0 - adjusted_percentile_drop);

       let (min_strike, max_strike) = if v1 < v2 { (v1, v2) } else { (v2, v1) };

       // Apply safety range adjustment
       let safety_range = (adjusted_percentile_drop - adjusted_ema_drop).abs() * 0.02;
       let adjusted_max_strike = max_strike * (1.0 - safety_range);

       // Tighten only the upper bound toward current price
       let tightened_max = underlying_price - (underlying_price - adjusted_max_strike) * trend_factor;

       (min_strike, tightened_max)
   }
   ```

4. Add tests in `src/option.rs` under the existing `mod tests` block:

   ```rust
   #[test]
   fn test_strike_range_no_tightening() {
       // trend_factor = 1.0 → no change to max_strike
       let (min, max) = calculate_adjusted_strike_range(
           100.0, 0.10, 0.05, 5, 5, 1.0,
       );
       // v1 = 100 * (1 - 0.05) = 95.0, v2 = 100 * (1 - 0.10) = 90.0
       // min = 90.0, max = 95.0
       // safety = 0.05 * 0.02 = 0.001, adjusted_max = 94.905
       // tightened_max = 100 - (100 - 94.905) * 1.0 = 94.905
       assert!((min - 90.0).abs() < 1e-6, "min should be 90.0, got {}", min);
       assert!((max - 94.905).abs() < 1e-6, "max should be 94.905, got {}", max);
   }

   #[test]
   fn test_strike_range_tightening_only_upper_bound() {
       // trend_factor = 0.75 → max moves toward price, min unchanged
       let (min, max) = calculate_adjusted_strike_range(
           100.0, 0.10, 0.05, 5, 5, 0.75,
       );
       // min = 90.0 (unchanged)
       // tightened_max = 100 - (100 - 94.905) * 0.75 = 100 - 3.82875 = 96.17125
       assert!((min - 90.0).abs() < 1e-6, "min should be 90.0, got {}", min);
       assert!((max - 96.17125).abs() < 1e-6, "max should be 96.17125, got {}", max);
   }

   #[test]
   fn test_strike_range_tightening_dte_scaled() {
       let (min, max) = calculate_adjusted_strike_range(
           724.66, 0.15, 0.08, 2, 5, 0.75,
       );
       // adj = 0.4, perc_drop = 0.06, ema_drop = 0.032
       // v1 = 701.47328, v2 = 681.1804 → min = 681.18, max = 701.47
       // safety = 0.00056, adjusted_max ≈ 701.08
       // tightened_max ≈ 706.93
       assert!((min - 681.1804).abs() < 0.01, "min should be ~681.18, got {}", min);
       assert!((max - 706.9255).abs() < 0.01, "max should be ~706.93, got {}", max);
   }

   #[test]
   fn test_strike_range_min_unchanged_by_tightening() {
       let (min_no_tighten, _) = calculate_adjusted_strike_range(100.0, 0.10, 0.05, 5, 5, 1.0);
       let (min_tighten, _) = calculate_adjusted_strike_range(100.0, 0.10, 0.05, 5, 5, 0.75);
       assert!((min_no_tighten - min_tighten).abs() < 1e-9,
           "min must be identical regardless of trend_factor: {} vs {}", min_no_tighten, min_tighten);
   }
   ```

5. Run all tests:
   ```
   cargo test
   ```

6. Refactor — check for clarity. Run tests after changes.

7. Lessons — caught a mistake that applies to future tasks? Add rule to `docs/lessons.md`.

⏸ **CHECKPOINT: done** — present implementation review. Wait for human approval before committing.
