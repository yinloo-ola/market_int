# Sharpe Ratio Module Architecture

## 1. Module Structure (`src/sharpe.rs`)
```rust
use crate::{
    constants, model,
    store::{self, candle, sharpe_ratio},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str,
    conn: &mut Connection,
    risk_free_rate: f64,
) -> model::Result<()> {
    // Implementation mirroring ATR pattern with:
    // - Symbol processing loop
    // - Candle aggregation
    // - Return calculations
    // - Sharpe ratio computation
    // - Database storage
}
```

## 2. SQL Schema Changes (`src/store/sqlite.rs`)
```rust
pub mod sharpe_ratio {
    pub fn create_table(conn: &Connection) -> rusqlite::Result<()> {
        conn.execute(
            "CREATE TABLE IF NOT EXISTS sharpe_ratio (
                symbol TEXT NOT NULL,
                value REAL NOT NULL,
                timestamp INTEGER NOT NULL,
                PRIMARY KEY (symbol, timestamp)
            )",
            [],
        )
    }
}
```

## 3. Risk-Free Rate Handling
- Configurable parameter with default fallback
- Added to `model.rs`:
```rust
pub struct SharpeConfig {
    pub risk_free_rate: Option<f64>, // None = use DEFAULT_RISK_FREE_RATE
    pub min_candles: usize,         // From constants::SHARPE_MIN_CANDLES
}
```

## 4. Calculation Formula
```rust
fn calculate_sharpe(
    returns: &[f64],
    risk_free_rate: f64,
    period: usize
) -> model::Result<f64> {
    let avg_return = returns.iter().sum::<f64>() / returns.len() as f64;
    let std_dev = standard_deviation(returns)?;
    Ok((avg_return - risk_free_rate) / std_dev)
}
```

## 5. Main Integration (`src/main.rs`)
```rust
match sharpe::calculate_and_save(
    &symbols_file_path,
    &mut conn,
    constants::DEFAULT_RISK_FREE_RATE
) {
    Ok(_) => log::info!("Successfully calculated Sharpe ratios"),
    Err(err) => log::error!("Error calculating Sharpe: {}", err),
}
```

## 6. Error Handling
```rust
pub enum QuotesError {
    // ...
    #[error("Sharpe calculation error: {0}")]
    SharpeCalculationError(String),
    
    #[error("Insufficient return data (min {0} required)")]
    InsufficientReturnData(usize),
    
    #[error("Invalid risk-free rate: {0}")]
    InvalidRiskFreeRate(f64),
}
```

## 7. Constants (`src/constants.rs`)
```rust
pub const SHARPE_MIN_CANDLES: usize = 14;
pub const DEFAULT_RISK_FREE_RATE: f64 = 0.02; // 2% annualized