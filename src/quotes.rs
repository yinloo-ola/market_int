use std::fs;
use std::path::Path;

use chrono::Local;
use rusqlite::Connection;
use thiserror::Error;

use crate::{marketdata::api_caller, store};

#[derive(Error, Debug)]
pub enum QuotesError {
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Database error: {0}")]
    DatabaseError(#[from] rusqlite::Error),
    #[error("Invalid symbol file: {0}")]
    InvalidSymbolFile(String),
    #[error("Empty symbol file")]
    EmptySymbolFile,
}

// Pulls stock quotes for a list of symbols and saves them to the database.
pub async fn pull_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    mut conn: Connection,    // Database connection.
) -> Result<(), QuotesError> {
    // Validate symbols file path
    let path = Path::new(symbols_file_path);
    if !path.exists() {
        return Err(QuotesError::InvalidSymbolFile(format!(
            "File not found: {}",
            symbols_file_path
        )));
    }
    if !path.is_file() {
        return Err(QuotesError::InvalidSymbolFile(format!(
            "Not a file: {}",
            symbols_file_path
        )));
    }

    // Read symbols from the specified file.
    let symbols = fs::read_to_string(symbols_file_path)?;
    // Split the symbols string into a vector of strings, filtering out empty lines.
    let symbols: Vec<&str> = symbols
        .split("\n")
        .filter(|s| !s.trim().is_empty())
        .collect();

    if symbols.is_empty() {
        return Err(QuotesError::EmptySymbolFile);
    }

    // Initialize the candle table in the database.
    store::candle::create_table(&conn)?;

    // Iterate over each symbol.
    for symbol in symbols {
        // Fetch candle data for the current symbol.
        let candles = api_caller::stock_candle(&symbol, Local::now(), 100).await;
        // Handle the result of the candle data fetch.
        match candles {
            Ok(candles) => {
                // Save the fetched candles to the database.
                store::candle::save_candles(&mut conn, candles)?;
                log::info!("Successfully fetched and saved candles for {}", symbol);
            }
            Err(e) => {
                // Log the error and continue to the next symbol if an error occurs.
                log::error!("Error fetching candles for {}: {}", symbol, e);
                continue;
            }
        }
    }
    Ok(())
}
