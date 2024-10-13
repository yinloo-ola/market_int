use std::error::Error;

use chrono::Local;
use rusqlite::Connection;

use crate::{marketdata::client, store};

pub async fn pull_quotes(
    symbols_file_path: &str,
    mut conn: Connection,
) -> Result<(), Box<dyn Error>> {
    // read symbols from file
    let symbols = std::fs::read_to_string(symbols_file_path)?;
    let symbols: Vec<&str> = symbols
        .split("\n")
        .filter(|s| !s.trim().is_empty())
        .collect();

    store::candle::initialize_candle(&conn)?;

    for symbol in symbols {
        let candles = client::stock_candle(&symbol, Local::now(), 100).await;
        match candles {
            Ok(candles) => {
                store::candle::save_candles(&mut conn, candles)?;
            }
            Err(e) => {
                println!("error, continuing: {e}");
                continue;
            }
        }
    }
    Ok(())
}
