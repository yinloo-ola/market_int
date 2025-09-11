use crate::{constants, model, symbols};
use crate::{store, tiger::api_caller::Requester};
use chrono::Local;
use rusqlite::Connection;
use tokio::time::{sleep, Duration};

/// Pulls stock quotes for a list of symbols and saves them to the database.
pub async fn pull_and_save(
    symbols_file_path: &str,   // Path to the file containing symbols.
    conn: &mut Connection, // Database connection.
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the candle table in the database.
    store::candle::create_table(conn)?;

    // Initialize Tiger API requester
    let requester = match Requester::new().await {
        Some(requester) => requester,
        None => {
            log::error!("Failed to initialize Tiger API requester");
            return Err(model::QuotesError::HttpError(crate::http::client::RequestError::Other("Failed to initialize Tiger API requester".to_string())));
        }
    };

    // Filter out empty symbols and collect them into a vector
    let valid_symbols: Vec<&str> = symbols.iter().filter(|s| !s.trim().is_empty()).map(|s| s.as_str()).collect();

    // Process symbols in batches of 10
    for chunk in valid_symbols.chunks(10) {
        // Fetch candle data for the current batch of symbols.
        let candles = requester.query_stock_quotes(
            chunk,
            &Local::now(),
            constants::CANDLE_COUNT,
            "day"  // Assuming daily data period
        ).await;

        // Handle the result of the candle data fetch.
        match candles {
            Ok(candles) => {
                // Save the fetched candles to the database.
                store::candle::save_candles(conn, &candles)?;
                log::info!("Successfully fetched and saved candles for batch of {} symbols", chunk.len());
            }
            Err(e) => {
                log::error!("Failed to fetch and save candles for batch: {}", e);
                return Err(model::QuotesError::HttpError(e));
            }
        }
        
        // Add a 1-second delay between API calls
        sleep(Duration::from_secs(1)).await;
    }

    Ok(())
}
