use super::super::model;
use super::response;
use crate::http::client;
use chrono::{DateTime, Local, TimeZone};
use std::collections::HashMap;

// Checks the status returned from the API and returns an error if the status is not "ok".
fn check_status(s: &str, err: &Option<String>) -> Result<(), client::RequestError> {
    match s {
        "ok" => Ok(()),
        "no_data" => Err(client::RequestError::Other("No data".into())),
        "error" => Err(client::RequestError::Other(
            err.clone().unwrap_or_else(|| "Unknown error".into()),
        )),
        _ => Err(client::RequestError::Other("Unknown status".into())),
    }
}

/// Fetches the current market status.
pub async fn market_status() -> Result<model::MarketStatus, client::RequestError> {
    let resp = client::request::<response::MarketStatus>("v1/markets/status/", None).await?;

    check_status(&resp.s, &resp.errmsg)?;

    match resp.status.as_slice() {
        [status] if status == "open" => Ok(model::MarketStatus::Open),
        [status] if status == "closed" => Ok(model::MarketStatus::Closed),
        [] => Err(client::RequestError::Other("No data".into())),
        [_] => Ok(model::MarketStatus::Null),
        _ => Err(client::RequestError::Other("More than one data".into())),
    }
}

/// Fetches daily candle data for a given stock symbol.
pub async fn stock_candle(
    symbol: &str,        // Stock symbol.
    to: DateTime<Local>, // End timestamp.
    count: u32,          // Number of candles to fetch.
) -> Result<Vec<model::Candle>, client::RequestError> {
    let resp = client::request::<response::DailyCandles>(
        &format!("v1/stocks/candles/daily/{}/", symbol),
        Some(vec![
            ("to", &to.timestamp().to_string()),
            ("countback", &count.to_string()),
        ]),
    )
    .await?;
    check_status(&resp.s, &resp.errmsg)?;

    let len = resp.c.len();
    let mut candles = Vec::with_capacity(len);
    for i in 0..len {
        candles.push(model::Candle {
            symbol: symbol.into(),
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

/// Fetches daily candle data for multiple stock symbols.
pub async fn bulk_candles(
    symbols: Vec<String>, // Vector of stock symbols.
) -> Result<HashMap<String, model::Candle>, client::RequestError> {
    let resp = client::request::<response::BulkCandles>(
        "v1/stocks/bulkcandles/daily/",
        Some(vec![("symbols", &symbols.join(","))]),
    )
    .await?;
    check_status(&resp.s, &resp.errmsg)?;

    let mut quotes = HashMap::new();
    for i in 0..resp.symbol.len() {
        quotes.insert(
            resp.symbol[i].clone(),
            model::Candle {
                symbol: resp.symbol[i].clone(),
                close: resp.c[i],
                high: resp.h[i],
                low: resp.l[i],
                open: resp.o[i],
                timestamp: resp.t[i] as u32,
                volume: resp.v[i] as u32,
            },
        );
    }
    Ok(quotes)
}

/// Fetches option chain data for a given stock symbol.
pub async fn option_chain(
    symbol: &str,                                              // Stock symbol.
    strike_range: (f64, f64),                                  // Strike price range.
    expiration_date_range: (DateTime<Local>, DateTime<Local>), // Expiration date range.
    min_open_interest: u32,                                    // Minimum open interest.
    side: &model::OptionChainSide,                             // Call or Put.
) -> Result<Vec<model::OptionStrikeCandle>, client::RequestError> {
    let strike_str = [strike_range.0.to_string(), strike_range.1.to_string()].join("-");
    let resp = client::request::<response::OptionChain>(
        &format!("v1/options/chain/{}/", symbol),
        Some(vec![
            ("strike", &strike_str),
            ("from", &expiration_date_range.0.timestamp().to_string()),
            ("to", &expiration_date_range.1.timestamp().to_string()),
            ("minOpenInterest", &min_open_interest.to_string()),
            match side {
                model::OptionChainSide::Call => ("side", "call"),
                model::OptionChainSide::Put => ("side", "put"),
            },
        ]),
    )
    .await?;
    check_status(&resp.s, &resp.errmsg)?;
    let len = resp.option_symbol.len();
    let mut candles = Vec::with_capacity(len);
    for i in 0..len {
        candles.push(model::OptionStrikeCandle {
            underlying: resp.underlying[i].clone(),
            strike: resp.strike[i],
            underlying_price: resp.underlying_price[i],
            side: match resp.side[i].as_str() {
                "call" => model::OptionChainSide::Call,
                "put" => model::OptionChainSide::Put,
                _ => return Err(client::RequestError::Other("Unknown side".into())),
            },
            bid: resp.bid[i],
            mid: resp.mid[i],
            ask: resp.ask[i],
            bid_size: resp.bid_size[i],
            ask_size: resp.ask_size[i],
            last: resp.last[i],
            expiration: Local.timestamp_opt(resp.expiration[i] as i64, 0).unwrap(),
            updated: Local.timestamp_opt(resp.updated[i] as i64, 0).unwrap(),
            volume: resp.volume[i],
            timestamp: resp.dte[i],
            dte: resp.dte[i],
            open_interest: resp.open_interest[i],
            rate_of_return: resp.mid[i] / resp.strike[i] / num_of_weeks(resp.dte[i]) * 52.0,
        });
    }
    Ok(candles)
}

// Calculates the number of weeks given the days to expiration.
fn num_of_weeks(dte: u32) -> f64 {
    if (5..=7).contains(&dte) {
        1.0
    } else {
        (dte / 7) as f64 + (dte % 7) as f64 / 5.0
    }
}
