# Sector Diversity for Top Picks

## Goal
1. Add a `sector` column to the exported CSV
2. Ensure the top 3 Telegram picks come from different sectors (Unknown sector is not excluded)

## Design

### 1. Sector mapping file: `data/sectors.csv`
One line per ticker: `TICKER,Sector` (GICS broad sectors, ~11 categories). Unknown tickers default to `"Unknown"`.

### 2. New module: `src/sectors.rs`
- `load_sectors(path: &str) -> Result<HashMap<String, String>>` — reads `sectors.csv` at startup

### 3. CSV changes (`model.rs`)
- Add `sector` column after `underlying` in header and data rows
- `option_chain_to_csv_vec` accepts a new `sectors: &HashMap<String, String>` parameter

### 4. Top-3 selection with sector diversity (`model.rs`)
- Extend the existing `seen: HashSet<String>` filter to also track `seen_sectors: HashSet<String>`
- After picking a stock, insert its sector into `seen_sectors` **only if** it's not `"Unknown"`
- Filter skips stocks whose underlying OR sector is already seen

### 5. Telegram caption (`option.rs`)
- Add sector to each pick line: `1. AAPL (Technology) $90P | Bid: ...`
- Omit sector label for Unknown

### 6. Plumb through
- `main.rs` loads sectors, passes `HashMap` down through `option_chain_to_csv_vec` and `publish_to_telegram`
- `TopPick` struct gets a `sector: String` field

## Files changed
- `data/sectors.csv` (new)
- `src/sectors.rs` (new)
- `src/model.rs` — TopPick struct, csv header/data, selection logic
- `src/option.rs` — format_telegram_caption, publish_to_telegram signature
- `src/main.rs` — load sectors, pass through
