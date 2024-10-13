use chrono::{DateTime, Local};

use super::response;
use super::result;
use crate::http::client;

fn check_status(s: &str, err: &Option<String>) -> Result<(), client::RequestError> {
    match s {
        "ok" => Ok(()),
        "no_data" => Err(client::RequestError::Other("No data".into())),
        "error" => {
            if let Some(err_str) = err {
                Err(client::RequestError::Other(err_str.clone()))
            } else {
                Err(client::RequestError::Other("Unknown error".into()))
            }
        }
        _ => Err(client::RequestError::Other("Unknown error".into())),
    }
}

pub async fn get_market_status() -> Result<result::MarketStatus, client::RequestError> {
    let resp = client::request::<response::MarketStatusResponse>(
        "v1/markets/status/".to_string(),
        Option::None,
    )
    .await?;
    check_status(&resp.s, &resp.errmsg)?;
    match resp.status.len() {
        1 => match resp.status[0].as_str() {
            "open" => Ok(result::MarketStatus::Open),
            "closed" => Ok(result::MarketStatus::Closed),
            _ => Ok(result::MarketStatus::Null),
        },
        0 => Err(client::RequestError::Other("No data".into())),
        _ => Err(client::RequestError::Other("More than one data".into())),
    }
}

pub async fn stock_candle(
    symbol: String,
    to: DateTime<Local>,
    count: u32,
) -> Result<Vec<result::Candle>, client::RequestError> {
    let resp = client::request::<response::DailyCandleData>(
        format!("v1/stocks/candles/daily/{}/", symbol),
        Some(vec![
            ("to", to.timestamp().to_string()),
            ("countback", count.to_string()),
        ]),
    )
    .await?;
    check_status(&resp.s, &resp.errmsg)?;

    let len = resp.c.len();
    let mut candles = Vec::with_capacity(len);
    for i in 0..len {
        candles.push(result::Candle {
            open: resp.o[i],
            high: resp.h[i],
            low: resp.l[i],
            close: resp.c[i],
            volume: resp.v[i] as u32,
            timestamp: resp.t[i] as u32,
        });
    }
    Ok(candles)
}
