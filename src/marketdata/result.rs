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
