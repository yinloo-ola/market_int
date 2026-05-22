# Update Production Configuration to return-min-30 — Implementation Plan

Design / Sweep Results:
The `return-min-30` preset (safety=0.40, return=0.40, sharpe=0.20, min_rate_of_return=0.30, no trend filters/tightening, no regime weight adjustments) consistently outperformed the baseline across three different periods (2023-2024, 2025, 2026). It cut assignment rates by 40-70% while improving or maintaining returns, by simplifying the code and focusing on the core indicators.

## Scope

- Update `src/constants.rs` to set `MIN_RATE_OF_RETURN = 0.30`.
- Update `src/option.rs::retrieve_option_chains_with_expiry` to disable trend tightening by setting `trend_factor = 1.0` (matching the optimal config).
- Update `src/model.rs::calculate_put_score` to use the new static weights (0.40 safety, 0.40 return, 0.20 sharpe) and remove the trend pre-filters.
- Update/remove/refactor the affected unit tests in `src/model.rs` to align with the new scoring model and lack of trend pre-filtering.

---

## Task 1: Update production constants

<!-- tdd: modifying-tested-code -->

Files:
- `src/constants.rs`

Steps:

1. In `src/constants.rs`, update `MIN_RATE_OF_RETURN` from `0.25` to `0.30`:

```rust
// In src/constants.rs:
pub const MIN_RATE_OF_RETURN: f64 = 0.30;
```

2. Run `cargo check` — verify it compiles.

---

## Task 2: Disable strike range trend tightening in production

<!-- tdd: modifying-tested-code -->

Files:
- `src/option.rs`

Steps:

1. In `src/option.rs` (around line 230), change the `trend_factor` calculation to always use `1.0` (matching the optimal config where trend tightening is disabled):

Change:
```rust
            let trend_factor = match trend_data.get(symbol) {
                Some((ratio_short, _)) => model::calculate_trend_factor(*ratio_short),
                None => 1.0,
            };
```

To:
```rust
            // Default to 1.0 (no tightening) matching the winning return-min-30 backtest config
            let trend_factor = 1.0;
```

2. Run `cargo check` — verify it compiles.

---

## Task 3: Update `calculate_put_score` logic

<!-- tdd: modifying-tested-code -->
<!-- checkpoint: test -->

Files:
- `src/model.rs`

Steps:

1. Update the implementation of `calculate_put_score` in `src/model.rs`. Change:

```rust
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
    regime: &crate::regime::MarketRegime,
) -> Option<f64> {
    // Pre-filters
    if rate_of_return < constants::MIN_RATE_OF_RETURN
        || rate_of_return > constants::MAX_RATE_OF_RETURN
    {
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
    // Trend norm: reward stocks further above their EMA
    let trend_norm = ((trend_ratio_short - regime.trend_threshold) / 0.10).clamp(0.0, 1.0);

    Some(
        regime.weight_sharpe * sharpe_norm
            + regime.weight_safety * safety_norm
            + regime.weight_return * return_norm
            + regime.weight_trend * trend_norm,
    )
}
```

To the new static return-min-30 implementation:

```rust
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
    _trend_ratio_short: f64,
    _trend_ratio_long: f64,
    _regime: &crate::regime::MarketRegime,
) -> Option<f64> {
    // Pre-filters
    if rate_of_return < constants::MIN_RATE_OF_RETURN
        || rate_of_return > constants::MAX_RATE_OF_RETURN
    {
        return None;
    }
    if sharpe <= 0.0 {
        return None;
    }
    if strike_percentile > constants::MAX_STRIKE_PERCENTILE {
        return None;
    }

    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let safety_norm = 1.0 - strike_percentile.max(0.0);
    let return_norm = (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);

    // Static weights for safety, return, and sharpe (no trend weight)
    let weight_sharpe = 0.20;
    let weight_safety = 0.40;
    let weight_return = 0.40;

    Some(
        weight_sharpe * sharpe_norm
            + weight_safety * safety_norm
            + weight_return * return_norm
    )
}
```

2. Run `cargo check` — verify compilation. Note that some existing tests in `src/model.rs` and `src/regime.rs` might now fail or raise compiler warnings because of the updated scoring math. This is expected.

⏸ **CHECKPOINT: test** — review updated function signature and logic. Wait for approval before refactoring the unit tests.

---

## Task 4: Refactor / align unit tests in `src/model.rs`

<!-- tdd: modifying-tested-code -->
<!-- checkpoint: done -->

Files:
- `src/model.rs`

Steps:

1. Let's adapt the tests in `src/model.rs` to match the new scoring.

- Remove or comment out tests that explicitly verify the trend filters or regime weight-shifting of `calculate_put_score` (since those features are removed from the production scoring):
  - `test_put_score_filtered_trend_short_below_threshold`
  - `test_put_score_filtered_trend_long_below_threshold`
  - `test_put_score_trend_at_threshold`
  - `test_put_score_trend_just_below_threshold`
  - `test_put_score_bear_market_loosens_filter`
  - `test_put_score_bear_market_still_blocks_freefall`
  - `test_put_score_bear_shifts_weights`

- Modify `test_top_picks_trend_filter_blocks_weak_stock`: Since there are no trend filters, the MSFT stock (previously blocked by trend filter) should now pass. Update the test assertions:

Change:
```rust
        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 1, "only AAPL should pass trend filter");
        assert_eq!(top_picks[0].underlying, "AAPL");
        assert_eq!(top_picks[0].trend_short, Some(1.05));
        assert_eq!(top_picks[0].trend_long, Some(1.06));
```

To (expecting both stocks to pass since trend filter is removed):

```rust
        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 2, "both stocks should pass since trend filter is removed");
        assert_eq!(top_picks[0].underlying, "MSFT"); // MSFT has slightly higher return (0.40 vs 0.35)
        assert_eq!(top_picks[1].underlying, "AAPL");
```

- Update `test_regime_integration_bear_allows_more_stocks`: Under both regimes, since trend filters are removed, all stocks (AAPL, MSFT, TSLA, NVDA, GOOG) will pass (up to the unique sector/symbol top pick limits). Let's change the assertions to verify they all pass:

Change:
```rust
        // Bull regime: only AAPL passes trend filter (threshold=0.98)
        let bull = MarketRegime::from_spy_trend(1.05);
        ...
        assert_eq!(picks_bull.len(), 1, "bull: only AAPL should pass");
        assert_eq!(picks_bull[0].underlying, "AAPL");

        // Bear regime: AAPL, MSFT, TSLA pass (threshold=0.92), NVDA at 0.90 also passes
        let bear = MarketRegime::from_spy_trend(0.92);
        ...
        assert!(
            picks_bear.len() >= 3,
            "bear: at least AAPL, MSFT, TSLA should pass, got {}",
            picks_bear.len()
        );
        assert!(
            picks_bear.len() <= 4,
            "bear: GOOG (0.85) should still be blocked"
        );
```

To:

```rust
        // Bull regime: all stocks pass since trend filter is removed (dedup sector limits to top 3 unique sectors)
        let bull = MarketRegime::from_spy_trend(1.05);
        let (_csv_bull, picks_bull) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull,
        )
        .unwrap();
        assert_eq!(picks_bull.len(), 3, "should pick top 3 unique sectors/symbols");

        // Bear regime: same behavior, no trend filtering blocks them
        let bear = MarketRegime::from_spy_trend(0.92);
        let (_csv_bear, picks_bear) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bear,
        )
        .unwrap();
        assert_eq!(picks_bear.len(), 3, "should pick top 3 unique sectors/symbols");
```

- Update `test_put_score_high_sharpe_clamps` and `test_put_score_peak_return` to match the new static weight scores:

For `test_put_score_high_sharpe_clamps`:
With sharpe=5.0 (clamps to 1.0), strike_percentile=0.0 (safety_norm=1.0), rate_of_return=0.35 (return_norm=1.0):
- `score = 0.20 * 1.0 + 0.40 * 1.0 + 0.40 * 1.0 = 1.00`.
Change assertion:
```rust
        let score = calculate_put_score(5.0, 0.0, 0.35, 1.05, 1.05, &bull_regime()).unwrap();
        assert!((score - 1.00).abs() < 0.01);
```

For `test_put_score_peak_return`:
With sharpe=2.0 (clamps to 1.0), strike_percentile=0.0 (safety_norm=1.0), rate_of_return=0.35 (return_norm=1.0):
- `score = 0.20 * 1.0 + 0.40 * 1.0 + 0.40 * 1.0 = 1.00`.
Change assertion:
```rust
        let score = calculate_put_score(2.0, 0.0, 0.35, 1.05, 1.05, &bull_regime()).unwrap();
        assert!((score - 1.00).abs() < 0.01);
```

2. Run `cargo test` — confirm all tests pass.

⏸ **CHECKPOINT: done** — review implementation and test pass before committing.
