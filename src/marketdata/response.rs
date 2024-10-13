use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct MarketStatusResponse {
    pub s: String,
    pub status: Vec<String>,
    pub errmsg: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DailyCandleData {
    pub s: String,
    pub c: Vec<f64>,
    pub h: Vec<f64>,
    pub l: Vec<f64>,
    pub o: Vec<f64>,
    pub t: Vec<u32>,
    pub v: Vec<u32>,
    pub errmsg: Option<String>,
}
