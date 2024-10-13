use chrono::{DateTime, Local};

#[derive(Debug)]
pub enum MarketStatus {
    Open,
    Closed,
    Null,
}

#[derive(Debug)]
pub struct Candle {
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: u32,
    pub timestamp: u32,
}

#[derive(Debug)]
pub enum OptionChainSide {
    Call,
    Put,
}

#[derive(Debug)]
pub struct OptionStrikeCandle {
    pub underlying: String,
    pub strike: f64,
    pub underlying_price: f64,
    pub side: OptionChainSide,
    pub bid: f64,
    pub mid: f64,
    pub ask: f64,
    pub bid_size: u32,
    pub ask_size: u32,
    pub last: f64,
    pub expiration: DateTime<Local>,
    pub updated: DateTime<Local>,
    pub dte: u32,
    pub volume: u32,
    pub timestamp: u32,
    pub open_interest: u32,
    pub rate_of_return: f64,
}
