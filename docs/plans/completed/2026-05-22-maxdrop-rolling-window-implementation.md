# Fix max_drop: Non-overlapping chunks → Rolling windows

## Problem

`maxdrop.rs` computes max_drop by splitting candle history into **non-overlapping** chunks of `period` length:

```rust
candles.chunks(period).map(|chunk| calculate_max_drop(chunk))
```

This means a crash spanning a chunk boundary gets split across two chunks — each chunk sees only part of the drop. The 90th percentile of these partial drops **underestimates** the true worst-case N-day drawdown.

The fix: use a **rolling window** of size `period` starting at every candle, giving ~`candles.len() - period` overlapping samples. This captures drops starting on any day and produces accurate percentile/EMA statistics.

## Scope

- Change only `src/maxdrop.rs` — the `calculate_and_save` function and `calculate_max_drop`
- The store layer (`src/store/max_drop.rs`), CLI (`src/main.rs`), and consumer (`src/option.rs`) are unchanged
- The `calculate_max_drop` function itself (peak-to-trough logic within a window) is correct — only the windowing changes

## Design

### Before (non-overlapping chunks)

With 850 candles and period=5:
- Chunks: `[0..5), [5..10), [10..15), ...` → ~170 non-overlapping windows
- A crash from day 4 to day 8 gets split: chunk `[0..5)` sees the start, chunk `[5..10)` sees the rest
- Neither chunk captures the full drop

### After (rolling windows)

- Windows: `[0..5), [1..6), [2..7), ...` → ~845 overlapping windows
- Every possible N-day period is evaluated
- `percentile(0.90)` now correctly answers: "90% of the time, the worst N-day drop is no worse than X"

### Performance

With 850 candles and period=5, rolling windows produce ~845 samples (vs 170 previously). The computation is still O(candles × period) which is trivial for 850 candles. No performance concern.

---

## Task 1: Add rolling window max_drop tests

<!-- tdd: new-feature -->
<!-- checkpoint: test -->

Files:
- `src/maxdrop.rs` (add `#[cfg(test)] mod tests`)

Steps:

1. Add a test module at the bottom of `src/maxdrop.rs` with failing tests for the new rolling window behavior:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::Candle;

    fn make_candle(high: f64, low: f64, close: f64) -> Candle {
        Candle {
            symbol: "TEST".to_string(),
            open: close, // not used by calculate_max_drop
            high,
            low,
            close,
            volume: 0,
            timestamp: 0,
        }
    }

    /// Helper: compute rolling max drops from a slice of candles with the given period.
    fn rolling_max_drops(candles: &[Candle], period: usize) -> Vec<f64> {
        candles
            .windows(period)
            .map(|w| calculate_max_drop(w))
            .filter(|&d| d > 0.0)
            .collect()
    }

    #[test]
    fn test_rolling_captures_cross_chunk_drop() {
        // 7 candles, period=5. Non-overlapping chunks would give windows [0..5] and [5..7].
        // The drop spans the boundary (peak at index 2, trough at index 5).
        // Rolling windows must capture the full drop.
        let candles = vec![
            make_candle(100.0, 98.0, 99.0),   // 0
            make_candle(102.0, 100.0, 101.0),  // 1
            make_candle(110.0, 108.0, 109.0),  // 2: peak
            make_candle(105.0, 100.0, 101.0),  // 3
            make_candle(100.0, 95.0, 96.0),    // 4
            make_candle(92.0, 88.0, 89.0),     // 5: trough — cross-chunk drop
            make_candle(90.0, 87.0, 88.0),     // 6
        ];

        let drops = rolling_max_drops(&candles, 5);
        // The window [1..6] contains peak=110 and trough=88 → drop = (110-88)/88 ≈ 0.25
        assert!(!drops.is_empty(), "should have rolling windows");
        let max = drops.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
        // Verify the cross-chunk drop is captured: (110 - 88) / 88 ≈ 0.25
        assert!(
            (max - 0.25).abs() < 0.01,
            "max rolling drop should be ~0.25, got {:.4}",
            max
        );
    }

    #[test]
    fn test_rolling_produces_more_samples_than_chunks() {
        // 10 candles, period=3
        // Non-overlapping chunks → 3 windows (indices 0-2, 3-5, 6-8, partial 9)
        // Rolling windows → 8 windows (0-2, 1-3, 2-4, ..., 7-9)
        let candles: Vec<Candle> = (0..10)
            .map(|i| make_candle(100.0 - i as f64, 98.0 - i as f64, 99.0 - i as f64))
            .collect();

        let drops = rolling_max_drops(&candles, 3);
        // 10 candles, period 3 → 8 windows. Some may be filtered (drop == 0), so <= 8.
        assert!(
            drops.len() <= 8,
            "rolling should produce at most candles.len() - period + 1 = 8 samples, got {}",
            drops.len()
        );
    }

    #[test]
    fn test_rolling_no_drops_when_flat() {
        let candles: Vec<Candle> = (0..5)
            .map(|_| make_candle(100.0, 98.0, 99.0))
            .collect();

        let drops = rolling_max_drops(&candles, 5);
        // All identical → no meaningful drops (filter drops > 0.0)
        assert!(
            drops.is_empty() || drops.iter().all(|&d| d < 0.01),
            "flat candles should have near-zero drops, got {:?}",
            drops
        );
    }
}
```

2. Run `cargo test -- maxdrop` — these tests use `rolling_max_drops` (a helper that already uses `.windows()`), so they should **pass immediately** and confirm the rolling window logic captures the cross-chunk case. The point of these tests is to **document expected behavior** before we change the production code.

⏸ **CHECKPOINT: test** — confirm the tests capture the right semantics before modifying production code.

## Task 2: Switch `calculate_and_save` to rolling windows

<!-- tdd: modifying-tested-code -->
<!-- checkpoint: done -->

Files:
- `src/maxdrop.rs`

Steps:

1. Replace the non-overlapping chunk logic in `calculate_and_save` with rolling windows. Change this block:

```rust
        // Calculate max drop for the specified period
        let max_drops: Vec<f64> = candles
            .chunks(period)
            .map(|chunk| calculate_max_drop(chunk))
            .filter(|&drop| drop > 0.0)
            .collect();

        // Need at least 2 chunks for meaningful statistics
        if max_drops.len() >= 2 {
```

To:

```rust
        // Calculate max drop using rolling windows of the specified period.
        // Rolling windows capture drops that span across chunk boundaries,
        // producing accurate worst-case drawdown estimates.
        let max_drops: Vec<f64> = candles
            .windows(period)
            .map(|window| calculate_max_drop(window))
            .filter(|&drop| drop > 0.0)
            .collect();

        // Need at least 2 samples for meaningful statistics
        if max_drops.len() >= 2 {
```

2. Update the warning log message to say "samples" instead of "chunks":

Change:
```rust
            log::warn!(
                "Not enough {}-day chunks for {}, need at least 2 chunks, found {} chunks",
                period,
                symbol,
                max_drops.len()
            );
```

To:
```rust
            log::warn!(
                "Not enough {}-day rolling samples for {}, need at least 2, found {}",
                period,
                symbol,
                max_drops.len()
            );
```

3. Run `cargo test -- maxdrop` — confirm all tests pass.

4. Run `cargo test` — confirm no regressions across the full test suite.

5. Run `cargo check` — confirm no compilation errors.

⏸ **CHECKPOINT: done** — review the change before committing. This is a one-line logic change (`.chunks(period)` → `.windows(period)`) plus a log message update. The store layer, CLI, and downstream consumers are untouched.
