use std::{error::Error, fmt::Display, io};

use chrono::{DateTime, Local};

use crate::http::client;

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

#[derive(Debug)]
pub struct TrueRange {
    pub symbol: String, // Symbol of the asset.
    pub percentile_range: f64,
    pub ema_range: f64,
    pub timestamp: u32,
}

/// Represents the side of an option (call or put).
#[derive(Debug)]
pub enum OptionChainSide {
    Call,
    Put,
}

impl From<OptionChainSide> for String {
    fn from(value: OptionChainSide) -> Self {
        match value {
            OptionChainSide::Call => "call".to_string(),
            OptionChainSide::Put => "put".to_string(),
        }
    }
}

/// Structure representing a candle for an option strike.
#[derive(Debug)]
pub struct OptionStrikeCandle {
    pub underlying: String,    // Underlying asset symbol.
    pub strike: f64,           // Strike price.
    pub underlying_price: f64, // Underlying asset price.
    pub side: OptionChainSide, // Call or Put.
    pub bid: f64,              // Bid price.
    pub mid: f64,              // Mid price.
    pub ask: f64,              // Ask price.
    pub bid_size: u32,         // Bid size.
    pub ask_size: u32,         // Ask size.
    pub last: f64,             // Last traded price.
    pub expiration: u32,       // Expiration date and time.
    pub updated: u32,          // Last updated date and time.
    pub dte: u32,              // Days to expiration.
    pub volume: u32,           // Volume.
    pub open_interest: u32,    // Open interest.
    pub rate_of_return: f64,   // Rate of return.
}

pub type Result<T> = std::result::Result<T, QuotesError>;

#[derive(Debug)]
pub enum QuotesError {
    FileNotFound(String),
    CouldNotOpenFile(io::Error),
    CouldNotReadLine,
    EmptySymbolFile(String),
    DatabaseError(rusqlite::Error),
    HttpError(client::RequestError),
    NotEnoughCandlesForStatistics(String),
}

impl Display for QuotesError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Error for QuotesError {}

impl From<io::Error> for QuotesError {
    fn from(value: io::Error) -> Self {
        Self::CouldNotOpenFile(value)
    }
}

impl From<rusqlite::Error> for QuotesError {
    fn from(value: rusqlite::Error) -> Self {
        Self::DatabaseError(value)
    }
}

impl From<client::RequestError> for QuotesError {
    fn from(value: client::RequestError) -> Self {
        Self::HttpError(value)
    }
}
