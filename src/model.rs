use chrono::{DateTime, Local};

/// Represents the market status.
#[derive(Debug)]
pub enum MarketStatus {
    Open,
    Closed,
    Null,
}

/// Structure representing a candle (OHLCV data).
#[derive(Debug)]
pub struct Candle {
    pub symbol: String, // Symbol of the asset.
    pub open: f64,      // Opening price.
    pub high: f64,      // Highest price.
    pub low: f64,       // Lowest price.
    pub close: f64,     // Closing price.
    pub volume: u32,    // Trading volume.
    pub timestamp: u32, // Timestamp of the candle.
}

/// Represents the side of an option (call or put).
#[derive(Debug)]
pub enum OptionChainSide {
    Call,
    Put,
}

/// Structure representing a candle for an option strike.
#[derive(Debug)]
pub struct OptionStrikeCandle {
    pub underlying: String,          // Underlying asset symbol.
    pub strike: f64,                 // Strike price.
    pub underlying_price: f64,       // Underlying asset price.
    pub side: OptionChainSide,       // Call or Put.
    pub bid: f64,                    // Bid price.
    pub mid: f64,                    // Mid price.
    pub ask: f64,                    // Ask price.
    pub bid_size: u32,               // Bid size.
    pub ask_size: u32,               // Ask size.
    pub last: f64,                   // Last traded price.
    pub expiration: DateTime<Local>, // Expiration date and time.
    pub updated: DateTime<Local>,    // Last updated date and time.
    pub dte: u32,                    // Days to expiration.
    pub volume: u32,                 // Volume.
    pub timestamp: u32,              // Timestamp.
    pub open_interest: u32,          // Open interest.
    pub rate_of_return: f64,         // Rate of return.
}
