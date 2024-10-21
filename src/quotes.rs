use crate::{constants, model, symbols};
use crate::{marketdata::api_caller, store};
use chrono::Local;
use rusqlite::Connection;
use std::thread::sleep;
use std::time::Duration;

/// Pulls stock quotes for a list of symbols and saves them to the database.
pub async fn pull_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    mut conn: Connection,    // Database connection.
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the candle table in the database.
    store::candle::create_table(&conn)?;

    for symbol in symbols.iter().filter(|s| !s.trim().is_empty()) {
        // Fetch candle data for the current symbol.
        let candles =
            api_caller::stock_candle(symbol, &Local::now(), constants::CANDLE_COUNT).await;
        // Handle the result of the candle data fetch.
        match candles {
            Ok(candles) => {
                // Save the fetched candles to the database.
                store::candle::save_candles(&mut conn, &candles)?;
                log::info!("Successfully fetched and saved candles for {}", symbol);
            }
            Err(e) => {
                log::error!("Failed to fetch and save candles for {}: {}", symbol, e);
                return Err(model::QuotesError::HttpError(e));
            }
        }
        sleep(Duration::from_millis(50));
    }

    Ok(())
}
