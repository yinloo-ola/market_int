# Sector Diversity — Implementation Plan

## Task 1: Create `data/sectors.csv` and `src/sectors.rs`

<!-- tdd: new-feature -->

Files:
- `data/sectors.csv` (new)
- `src/sectors.rs` (new)

Steps:

1. Create `data/sectors.csv` with GICS broad sector mappings for all tickers in `data/symbols.csv`:

```
AAPL,Technology
NVDA,Technology
MSFT,Technology
GOOG,Communication Services
AMZN,Consumer Discretionary
META,Communication Services
TSLA,Consumer Discretionary
AVGO,Technology
WMT,Consumer Staples
JPM,Financials
V,Financials
XOM,Energy
ORCL,Technology
MA,Financials
HD,Consumer Discretionary
JNJ,Healthcare
ABBV,Healthcare
BAC,Financials
KO,Consumer Staples
CRM,Technology
CVX,Energy
TMUS,Communication Services
AMD,Technology
SPOT,Communication Services
DIS,Communication Services
TSM,Technology
NET,Technology
PLTR,Technology
GE,Industrials
CSCO,Technology
WFC,Financials
PM,Consumer Staples
MS,Financials
IBM,Technology
GS,Financials
ABT,Healthcare
AXP,Financials
LIN,Materials
MCD,Consumer Staples
T,Communication Services
RTX,Industrials
CAT,Industrials
UBER,Communication Services
VZ,Communication Services
C,Financials
ANET,Technology
INTU,Technology
MU,Technology
GEV,Industrials
SCHW,Financials
SPGI,Financials
BA,Industrials
ISRG,Healthcare
TJX,Consumer Discretionary
LOW,Consumer Discretionary
BSX,Healthcare
LRCX,Technology
COF,Financials
ETN,Industrials
SYK,Healthcare
PGR,Financials
GILD,Healthcare
PANW,Technology
HON,Industrials
KKR,Financials
DE,Industrials
CRWD,Technology
ADI,Technology
ADP,Technology
LMT,Industrials
```

2. Create `src/sectors.rs`:

```rust
use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::{BufRead, BufReader};
use std::path::Path;

use crate::model::{QuotesError, Result};

pub fn load_sectors(path: &str) -> Result<HashMap<String, String>> {
    let p = Path::new(path);
    if !p.exists() {
        log::warn!("Sectors file not found: {}. All sectors will be Unknown.", path);
        return Ok(HashMap::new());
    }

    let file = OpenOptions::new().read(true).open(p)?;
    let mut map = HashMap::new();

    for line in BufReader::new(file).lines() {
        let line = line.map_err(|_| QuotesError::CouldNotReadLine)?;
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let parts: Vec<&str> = line.splitn(2, ',').collect();
        if parts.len() == 2 {
            map.insert(parts[0].trim().to_string(), parts[1].trim().to_string());
        }
    }

    log::info!("Loaded {} sector mappings from {}", map.len(), path);
    Ok(map)
}

/// Returns the sector for a symbol, or "Unknown" if not found.
pub fn get_sector(sectors: &HashMap<String, String>, symbol: &str) -> String {
    sectors.get(symbol).cloned().unwrap_or_else(|| "Unknown".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_load_sectors() {
        let mut f = NamedTempFile::new().unwrap();
        writeln!(f, "AAPL,Technology").unwrap();
        writeln!(f, "XOM,Energy").unwrap();
        writeln!(f, "JPM,Financials").unwrap();

        let map = load_sectors(f.path().to_str().unwrap()).unwrap();
        assert_eq!(map.len(), 3);
        assert_eq!(map["AAPL"], "Technology");
        assert_eq!(map["XOM"], "Energy");
        assert_eq!(map["JPM"], "Financials");
    }

    #[test]
    fn test_load_sectors_missing_file() {
        let map = load_sectors("/nonexistent/path.csv").unwrap();
        assert!(map.is_empty());
    }

    #[test]
    fn test_load_sectors_skips_blank_lines() {
        let mut f = NamedTempFile::new().unwrap();
        writeln!(f, "AAPL,Technology").unwrap();
        writeln!(f, "").unwrap();
        writeln!(f, "XOM,Energy").unwrap();

        let map = load_sectors(f.path().to_str().unwrap()).unwrap();
        assert_eq!(map.len(), 2);
    }

    #[test]
    fn test_get_sector_known() {
        let mut map = HashMap::new();
        map.insert("AAPL".to_string(), "Technology".to_string());
        assert_eq!(get_sector(&map, "AAPL"), "Technology");
    }

    #[test]
    fn test_get_sector_unknown() {
        let map = HashMap::<String, String>::new();
        assert_eq!(get_sector(&map, "UNKNOWN_TICKER"), "Unknown");
    }
}
```

3. Run `cargo test sectors` — all 5 tests pass.

---

## Task 2: Add sector to CSV output and TopPick selection in `model.rs`

<!-- tdd: modifying-tested-code -->

Files:
- `src/model.rs`

Steps:

1. Add `sector: String` field to `TopPick` struct:

```rust
pub struct TopPick {
    pub rank: usize,
    pub underlying: String,
    pub sector: String,
    pub strike: f64,
    pub bid: f64,
    pub ask: f64,
    pub rate_of_return: f64,
    pub score: f64,
    pub sharpe: f64,
    pub price_percentile: Option<f64>,
    pub earnings: Option<EarningsInfo>,
    pub trend_short: Option<f64>,
    pub trend_long: Option<f64>,
}
```

2. Add `sectors: &HashMap<String, String>` parameter to `option_chain_to_csv_vec` (after `trend_data`). Update the signature:

```rust
pub fn option_chain_to_csv_vec(
    all_chains: &[OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, PutPriceRange>,
    price_percentiles: &HashMap<String, f64>,
    earnings_map: &HashMap<String, EarningsInfo>,
    trend_data: &HashMap<String, (f64, f64)>,
    sectors: &HashMap<String, String>,
    regime: &crate::regime::MarketRegime,
) -> Result<(Vec<u8>, Vec<TopPick>)> {
```

3. Add `sector` column after `underlying` in the CSV header:

```rust
writer
    .write_record([
        "underlying",
        "sector",
        "strike",
        // ... rest unchanged
    ])
```

4. In the data row loop, look up the sector and insert it after `underlying`:

After the line `let (trend_short_str, trend_long_str) = ...` add:

```rust
let sector_str = sectors
    .get(&chain.underlying)
    .cloned()
    .unwrap_or_else(|| "Unknown".to_string());
```

Then in `writer.write_record`, insert `&sector_str` after `&chain.underlying`.

5. In the top-picks selection logic, add sector diversity filtering. Replace the existing filter chain:

```rust
let mut seen = HashSet::new();
let mut seen_sectors = HashSet::new();
let top_picks: Vec<TopPick> = scored
    .iter()
    .filter(|(idx, _)| {
        let underlying = &all_chains[*idx].underlying;
        let sector = sectors
            .get(underlying)
            .cloned()
            .unwrap_or_else(|| "Unknown".to_string());
        if seen.contains(underlying) {
            return false;
        }
        if sector != "Unknown" && seen_sectors.contains(&sector) {
            return false;
        }
        true
    })
    .take(3)
    .enumerate()
    .map(|(rank, (idx, score))| {
        let chain = &all_chains[*idx];
        let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
        let pp = price_percentiles.get(&chain.underlying).copied();
        let ts = trend_data.get(&chain.underlying).map(|(s, _)| *s);
        let tl = trend_data.get(&chain.underlying).map(|(_, l)| *l);
        let sector = sectors
            .get(&chain.underlying)
            .cloned()
            .unwrap_or_else(|| "Unknown".to_string());
        seen.insert(chain.underlying.clone());
        if sector != "Unknown" {
            seen_sectors.insert(sector.clone());
        }
        TopPick {
            rank: rank + 1,
            underlying: chain.underlying.clone(),
            sector,
            strike: chain.strike,
            bid: chain.bid,
            ask: chain.ask,
            rate_of_return: chain.rate_of_return,
            score: *score,
            sharpe,
            price_percentile: pp,
            earnings: earnings_map.get(&chain.underlying).cloned(),
            trend_short: ts,
            trend_long: tl,
        }
    })
    .collect();
```

Note: `seen` and `seen_sectors` must be declared as `mut` before the iterator chain, and the `.filter()` must not consume them — they are mutated inside `.map()`. To make this work, change the approach to use an imperative loop instead:

```rust
let mut seen = HashSet::new();
let mut seen_sectors = HashSet::new();
let mut top_picks: Vec<TopPick> = Vec::new();
let mut rank = 0;

for (idx, score) in &scored {
    if rank >= 3 {
        break;
    }
    let chain = &all_chains[*idx];
    if seen.contains(&chain.underlying) {
        continue;
    }
    let sector = sectors
        .get(&chain.underlying)
        .cloned()
        .unwrap_or_else(|| "Unknown".to_string());
    if sector != "Unknown" && seen_sectors.contains(&sector) {
        continue;
    }

    let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
    let pp = price_percentiles.get(&chain.underlying).copied();
    let ts = trend_data.get(&chain.underlying).map(|(s, _)| *s);
    let tl = trend_data.get(&chain.underlying).map(|(_, l)| *l);

    seen.insert(chain.underlying.clone());
    if sector != "Unknown" {
        seen_sectors.insert(sector.clone());
    }

    rank += 1;
    top_picks.push(TopPick {
        rank,
        underlying: chain.underlying.clone(),
        sector,
        strike: chain.strike,
        bid: chain.bid,
        ask: chain.ask,
        rate_of_return: chain.rate_of_return,
        score: *score,
        sharpe,
        price_percentile: pp,
        earnings: earnings_map.get(&chain.underlying).cloned(),
        trend_short: ts,
        trend_long: tl,
    });
}
```

6. Update all existing test calls to `option_chain_to_csv_vec` to pass an empty `&HashMap::new()` as the new `sectors` parameter (before `&bull_regime()` or `&bear`). This keeps existing tests compiling and passing.

7. Add a new test for sector diversity:

```rust
#[test]
fn test_top_picks_sector_diversity() {
    // AAPL and MSFT are both Technology, NVDA is also Technology, XOM is Energy
    // Without sector filter: AAPL, MSFT, NVDA (all Tech)
    // With sector filter: AAPL (Tech), XOM (Energy), then next non-Tech
    let chains = vec![
        make_chain("AAPL", 90.0, 0.35),
        make_chain("MSFT", 350.0, 0.34),  // same sector as AAPL
        make_chain("NVDA", 130.0, 0.33),  // same sector as AAPL
        make_chain("XOM", 100.0, 0.32),   // Energy
        make_chain("JPM", 200.0, 0.31),   // Financials
    ];

    let mut sharpe = HashMap::new();
    for sym in &["AAPL", "MSFT", "NVDA", "XOM", "JPM"] {
        sharpe.insert(sym.to_string(), 1.5);
    }

    let mut ranges = HashMap::new();
    ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
    ranges.insert("MSFT".to_string(), PutPriceRange { min: 300.0, max: 400.0 });
    ranges.insert("NVDA".to_string(), PutPriceRange { min: 100.0, max: 160.0 });
    ranges.insert("XOM".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
    ranges.insert("JPM".to_string(), PutPriceRange { min: 180.0, max: 220.0 });

    let mut sectors = HashMap::new();
    sectors.insert("AAPL".to_string(), "Technology".to_string());
    sectors.insert("MSFT".to_string(), "Technology".to_string());
    sectors.insert("NVDA".to_string(), "Technology".to_string());
    sectors.insert("XOM".to_string(), "Energy".to_string());
    sectors.insert("JPM".to_string(), "Financials".to_string());

    let percentiles = HashMap::new();
    let earnings = HashMap::new();
    let trend_data = HashMap::new();

    let (_csv, top_picks) = option_chain_to_csv_vec(
        &chains,
        &sharpe,
        &ranges,
        &percentiles,
        &earnings,
        &trend_data,
        &sectors,
        &bull_regime(),
    )
    .unwrap();

    assert_eq!(top_picks.len(), 3);
    assert_eq!(top_picks[0].underlying, "AAPL");
    assert_eq!(top_picks[0].sector, "Technology");
    assert_eq!(top_picks[1].underlying, "XOM");
    assert_eq!(top_picks[1].sector, "Energy");
    assert_eq!(top_picks[2].underlying, "JPM");
    assert_eq!(top_picks[2].sector, "Financials");

    // No two picks share a sector
    let sectors_seen: std::collections::HashSet<&str> =
        top_picks.iter().map(|p| p.sector.as_str()).collect();
    assert_eq!(sectors_seen.len(), top_picks.len());
}

#[test]
fn test_top_picks_unknown_sector_not_excluded() {
    // Two stocks with Unknown sector should both be picked
    let chains = vec![
        make_chain("AAA", 90.0, 0.35),
        make_chain("BBB", 90.0, 0.34),
        make_chain("CCC", 90.0, 0.33),
    ];

    let mut sharpe = HashMap::new();
    for sym in &["AAA", "BBB", "CCC"] {
        sharpe.insert(sym.to_string(), 1.5);
    }

    let mut ranges = HashMap::new();
    for sym in &["AAA", "BBB", "CCC"] {
        ranges.insert(sym.to_string(), PutPriceRange { min: 80.0, max: 120.0 });
    }

    // No sector mappings — all will be "Unknown"
    let sectors = HashMap::new();
    let percentiles = HashMap::new();
    let earnings = HashMap::new();
    let trend_data = HashMap::new();

    let (_csv, top_picks) = option_chain_to_csv_vec(
        &chains,
        &sharpe,
        &ranges,
        &percentiles,
        &earnings,
        &trend_data,
        &sectors,
        &bull_regime(),
    )
    .unwrap();

    assert_eq!(top_picks.len(), 3);
    assert_eq!(top_picks[0].sector, "Unknown");
    assert_eq!(top_picks[1].sector, "Unknown");
    assert_eq!(top_picks[2].sector, "Unknown");
}
```

8. Run `cargo test` — all existing tests + 2 new tests pass.

---

## Task 3: Plumb sectors through `option.rs` and update Telegram caption

<!-- tdd: modifying-tested-code -->

Files:
- `src/option.rs`
- `src/main.rs`

Steps:

1. Add `mod sectors;` declaration in `src/main.rs` (after `mod symbols;`).

2. Add `use crate::sectors;` to `src/option.rs`.

3. Add `sectors: &HashMap<String, String>` parameter to `publish_to_telegram` (after `trend_data`, before `period`). Pass it through to `model::option_chain_to_csv_vec`.

4. Add `sectors: &HashMap<String, String>` parameter to `retrieve_option_chains_with_expiry` (after `regime`). Pass it through to `publish_to_telegram`.

5. Add `sectors: &HashMap<String, String>` parameter to `publish_option_chains` (after `regime`). Pass it through to `publish_to_telegram`.

6. Update `format_telegram_caption` to show sector. Change the pick line format:

```rust
let sector_str = if pick.sector != "Unknown" {
    format!(" ({})", pick.sector)
} else {
    String::new()
};

caption.push_str(&format!(
    "{}. {}{sector_str} ${strike:.0}P | Bid: ${bid:.2} / Ask: ${ask:.2} | Return: {:.0}%\n   Score: {:.2} | Sharpe: {:.1}{pctl}{trend_str}\n\n",
    pick.rank,
    pick.underlying,
    pick.rate_of_return * 100.0,
    pick.score,
    pick.sharpe,
    strike = pick.strike,
    bid = pick.bid,
    ask = pick.ask,
));
```

7. Update all call sites in `src/main.rs`:

- In `PublishOptionChain`: load sectors and pass to `option::publish_option_chains`:
```rust
Commands::PublishOptionChain { symbols_file_path } => {
    let sectors = sectors::load_sectors("data/sectors.csv").unwrap_or_default();
    let regime = crate::regime::MarketRegime::from_spy_trend(1.05);
    match option::publish_option_chains(&symbols_file_path, conn, 5, &regime, &sectors).await {
```

- In `PullOptionChain5Day` and `PullOptionChain20Day`: load sectors and pass to `retrieve_option_chains_with_expiry`:
```rust
let sectors = sectors::load_sectors("data/sectors.csv").unwrap_or_default();
```
Then add `&sectors` as the last arg to `retrieve_option_chains_with_expiry`.

- In `PerformAll`: same — load sectors once and pass to both calls.

8. Run `cargo build` — compiles with no errors.

9. Run `cargo test` — all tests pass (no new tests needed here, this is plumbing).

---

## Task 4: Integration verification

<!-- tdd: trivial -->

Files:
- None (verification only)

Steps:

1. Run `cargo test` — all tests pass.

2. Run `cargo clippy -- -D warnings` — no warnings.

3. Run `cargo build` — release builds cleanly.
