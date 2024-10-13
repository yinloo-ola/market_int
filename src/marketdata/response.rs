use serde::Deserialize;

// Response structure for market status.
#[derive(Deserialize, Debug)]
pub struct MarketStatus {
    pub s: String,              // Status code.
    pub status: Vec<String>,    // Market status.
    pub errmsg: Option<String>, // Error message (if any).
}

/// Response structure for daily candles.
#[derive(Debug, Deserialize)]
pub struct DailyCandles {
    pub s: String,              // Status code.
    pub c: Vec<f64>,            // Close prices.
    pub h: Vec<f64>,            // High prices.
    pub l: Vec<f64>,            // Low prices.
    pub o: Vec<f64>,            // Open prices.
    pub t: Vec<u32>,            // Timestamps.
    pub v: Vec<u32>,            // Volumes.
    pub errmsg: Option<String>, // Error message (if any).
}

// Response structure for bulk candles.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkCandles {
    pub s: String,              // Status code.
    pub symbol: Vec<String>,    // Symbols.
    pub o: Vec<f64>,            // Open prices.
    pub h: Vec<f64>,            // High prices.
    pub l: Vec<f64>,            // Low prices.
    pub c: Vec<f64>,            // Close prices.
    pub v: Vec<u32>,            // Volumes.
    pub t: Vec<u32>,            // Timestamps.
    pub errmsg: Option<String>, // Error message (if any).
}

/// Response structure for option chain data.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OptionChain {
    pub s: String,                  // Status code.
    pub option_symbol: Vec<String>, // Option symbols.
    pub underlying: Vec<String>,    // Underlying symbols.
    pub expiration: Vec<u32>,       // Expiration timestamps.
    pub side: Vec<String>,          // Call or Put.
    pub strike: Vec<f64>,           // Strike prices.
    pub dte: Vec<u32>,              // Days to expiration.
    pub updated: Vec<u32>,          // Updated timestamps.
    pub bid: Vec<f64>,              // Bid prices.
    pub bid_size: Vec<u32>,         // Bid sizes.
    pub mid: Vec<f64>,              // Mid prices.
    pub ask: Vec<f64>,              // Ask prices.
    pub ask_size: Vec<u32>,         // Ask sizes.
    pub last: Vec<f64>,             // Last traded prices.
    pub open_interest: Vec<u32>,    // Open interests.
    pub volume: Vec<u32>,           // Volumes.
    pub underlying_price: Vec<f64>, // Underlying prices.
    pub errmsg: Option<String>,     // Error message (if any).
}
