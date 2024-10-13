use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct MarketStatus {
    pub s: String,
    pub status: Vec<String>,
    pub errmsg: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DailyCandles {
    pub s: String,
    pub c: Vec<f64>,
    pub h: Vec<f64>,
    pub l: Vec<f64>,
    pub o: Vec<f64>,
    pub t: Vec<u32>,
    pub v: Vec<u32>,
    pub errmsg: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkCandles {
    pub s: String,
    pub symbol: Vec<String>,
    pub o: Vec<f64>,
    pub h: Vec<f64>,
    pub l: Vec<f64>,
    pub c: Vec<f64>,
    pub v: Vec<u32>,
    pub t: Vec<u32>,
    pub errmsg: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OptionChain {
    pub s: String,
    pub option_symbol: Vec<String>,
    pub underlying: Vec<String>,
    pub expiration: Vec<u32>,
    pub side: Vec<String>,
    pub strike: Vec<f64>,
    pub dte: Vec<u32>,
    pub updated: Vec<u32>,
    pub bid: Vec<f64>,
    pub bid_size: Vec<u32>,
    pub mid: Vec<f64>,
    pub ask: Vec<f64>,
    pub ask_size: Vec<u32>,
    pub last: Vec<f64>,
    pub open_interest: Vec<u32>,
    pub volume: Vec<u32>,
    pub underlying_price: Vec<f64>,
    pub errmsg: Option<String>,
}
