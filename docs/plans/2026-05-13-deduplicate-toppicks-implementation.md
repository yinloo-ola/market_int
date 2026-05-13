# Deduplicate Top Picks by Underlying

## Context

Top picks currently select the 3 highest-scoring option chains, but multiple picks can share the same underlying stock. The fix: when iterating the sorted score list, skip chains whose `underlying` has already been selected.

## Task 1: Add test for unique-underlying top picks

<!-- tdd: new-feature -->
<!-- checkpoint: test -->

Files:
- `src/model.rs` (test module at bottom)

Steps:

1. Add a test that exercises `option_chain_to_csv_vec` with multiple chains sharing the same underlying. Verify that the returned `top_picks` contain no duplicate underlyings.

   Add inside `mod tests`:

   ```rust
   use std::collections::HashMap;

   fn make_chain(underlying: &str, strike: f64, rate_of_return: f64) -> OptionStrikeCandle {
       OptionStrikeCandle {
           underlying: underlying.to_string(),
           strike,
           underlying_price: 100.0,
           side: Side::Put,
           bid: 1.0,
           mid: 1.5,
           ask: 2.0,
           bid_size: 10,
           ask_size: 10,
           expiration: "2026-06-19".to_string(),
           volume: 100,
           open_interest: 200,
           rate_of_return,
           strike_from: 80.0,
           strike_to: 120.0,
       }
   }

   #[test]
   fn test_top_picks_unique_underlyings() {
       // AAPL appears 3 times with high scores, TSLA and NVDA once each
       let chains = vec![
           make_chain("AAPL", 90.0, 0.35),  // score ~high
           make_chain("AAPL", 85.0, 0.40),  // score ~higher
           make_chain("AAPL", 80.0, 0.30),  // score ~lower
           make_chain("TSLA", 200.0, 0.30), // score ~medium
           make_chain("NVDA", 130.0, 0.28), // score ~low but passes filters
       ];

       let mut sharpe = HashMap::new();
       sharpe.insert("AAPL".to_string(), 1.5);
       sharpe.insert("TSLA".to_string(), 1.5);
       sharpe.insert("NVDA".to_string(), 1.5);

       let mut ranges = HashMap::new();
       ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
       ranges.insert("TSLA".to_string(), PutPriceRange { min: 150.0, max: 250.0 });
       ranges.insert("NVDA".to_string(), PutPriceRange { min: 100.0, max: 160.0 });

       let percentiles = HashMap::new();
       let earnings = HashMap::new();

       let (_csv, top_picks) = option_chain_to_csv_vec(
           &chains, &sharpe, &ranges, &percentiles, &earnings,
       ).unwrap();

       let underlyings: Vec<&str> = top_picks.iter().map(|p| p.underlying.as_str()).collect();
       let mut unique = underlyings.clone();
       unique.sort();
       unique.dedup();
       assert_eq!(underlyings.len(), unique.len(), "top picks should have unique underlyings but got: {:?}", underlyings);
       assert_eq!(top_picks.len(), 3, "should have exactly 3 picks");
       assert_eq!(top_picks[0].underlying, "AAPL", "first pick should be highest scoring");
   }

   #[test]
   fn test_top_picks_fewer_than_three_unique() {
       // Only AAPL chains — should return 1 pick, not 3
       let chains = vec![
           make_chain("AAPL", 90.0, 0.35),
           make_chain("AAPL", 85.0, 0.40),
       ];

       let mut sharpe = HashMap::new();
       sharpe.insert("AAPL".to_string(), 1.5);

       let mut ranges = HashMap::new();
       ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

       let percentiles = HashMap::new();
       let earnings = HashMap::new();

       let (_csv, top_picks) = option_chain_to_csv_vec(
           &chains, &sharpe, &ranges, &percentiles, &earnings,
       ).unwrap();

       assert_eq!(top_picks.len(), 1, "should return only 1 pick for 1 unique underlying");
   }
   ```

2. Run the tests — they should **fail** because the current code picks duplicates:

   ```sh
   cargo test test_top_picks_unique_underlyings -- --nocapture
   cargo test test_top_picks_fewer_than_three_unique -- --nocapture
   ```

⏸ **CHECKPOINT: test** — present test review. Wait for human approval before implementing.

## Task 2: Deduplicate top picks by underlying

<!-- tdd: modifying-tested-code -->

Files:
- `src/model.rs`

Steps:

1. In the top-picks selection block (around line 332), replace the current `.take(3)` logic with a dedup loop. Change this:

   ```rust
   let top_picks: Vec<TopPick> = scored
       .iter()
       .take(3)
       .enumerate()
       .map(|(rank, (idx, score))| {
   ```

   to this (also add `use std::collections::HashSet;` at the crate top if not already present):

   ```rust
   let mut seen = HashSet::new();
   let top_picks: Vec<TopPick> = scored
       .iter()
       .filter(|(idx, _)| seen.insert(all_chains[*idx].underlying.clone()))
       .take(3)
       .enumerate()
       .map(|(rank, (idx, score))| {
   ```

2. Run all tests:

   ```sh
   cargo test
   ```

   All tests pass, including the two new ones.

3. Run the full build check:

   ```sh
   cargo check
   ```

4. Lessons — nothing unexpected. No new rules needed.
