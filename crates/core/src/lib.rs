//! Core domain library: models, scoring, stores, Tiger client, metrics,
//! constants. Telegram-free by construction — publishing lives in the CLI
//! crate, so the webapp can never link it.

// HTTP client implementation.
pub mod http {
    pub mod client;
}
// Data models.
pub mod model;
// Currently-holding puts: domain types + pace math (pure, no I/O).
pub mod holdings;
pub mod regime;
// Pull quotes from API.
pub mod quotes;
// Statistical helpers: EMA smoothing, percentile, historical volatility.
pub mod stats;
// Maximum drop calculation.
pub mod maxdrop;
/// Pull option chains from API based on ATR retrieved from database
/// (retrieval + persistence; the publish half lives in the CLI crate).
pub mod option;
// Sharpe ratio calculation.
pub mod sharpe;
// Trend calculation.
pub mod trend;
// Price percentile calculation.
pub mod price_percentile;
/// Module to read symbols from symbol file
pub mod symbols;
/// Module to load sector mappings
pub mod sectors;
// Tiger API client
pub mod tiger {
    pub mod api_caller;
}
// Data storage module.
pub mod store {
    /// Candle data storage.
    pub mod candle;
    /// Earnings calendar snapshot storage.
    pub mod earnings;
    /// max drop storage.
    pub mod max_drop;
    /// option range storage.
    pub mod option_chain;
    /// price percentile storage.
    pub mod price_percentile;
    /// Sharpe ratio storage.
    pub mod sharpe_ratio;
    /// SQLite database interaction.
    pub mod sqlite;
    /// Trend data storage.
    pub mod trend;
}
// Shared perform-all pipeline (CLI + webapp)
pub mod pipeline;
// Module storing defaults
pub mod constants;
// Black-Scholes Greeks shared by backtest and production scoring.
pub mod greeks;
// Consolidated metrics pipeline
pub mod metrics;
