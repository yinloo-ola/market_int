use chrono::Local;
use http::client;
use rusqlite::Connection;
use std::error::Error;
use std::fmt::Display;
use std::fs::OpenOptions;
use std::io::{self, BufRead, BufReader};
use std::path::Path;

use crate::http;
use crate::{marketdata::api_caller, store};

type Result<T> = std::result::Result<T, QuotesError>;

#[derive(Debug)]
pub enum QuotesError {
    FileNotFound(String),
    CouldNotOpenFile(io::Error),
    CouldNotReadLine,
    EmptySymbolFile(String),
    DatabaseError(rusqlite::Error),
    HttpError(client::RequestError),
}

impl Display for QuotesError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Error for QuotesError {}

impl From<io::Error> for QuotesError {
    fn from(value: io::Error) -> Self {
        Self::CouldNotOpenFile(value)
    }
}

impl From<rusqlite::Error> for QuotesError {
    fn from(value: rusqlite::Error) -> Self {
        Self::DatabaseError(value)
    }
}

impl From<client::RequestError> for QuotesError {
    fn from(value: client::RequestError) -> Self {
        Self::HttpError(value)
    }
}

/// Pulls stock quotes for a list of symbols and saves them to the database.
pub async fn pull_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    mut conn: Connection,    // Database connection.
) -> Result<()> {
    // Validate symbols file path
    let path = Path::new(symbols_file_path);
    if !path.exists() {
        return Err(QuotesError::FileNotFound(symbols_file_path.into()));
    }

    let file = OpenOptions::new().read(true).open(path)?;

    let symbols: Vec<_> = BufReader::new(file)
        .lines()
        .map(|line| line.map_err(|_e| QuotesError::CouldNotReadLine))
        .collect();

    if symbols.is_empty() {
        return Err(QuotesError::EmptySymbolFile(symbols_file_path.into()));
    }

    // Initialize the candle table in the database.
    store::candle::create_table(&conn)?;

    let mut i = 0;
    // Iterate over each symbol.
    for symbol in symbols {
        let symbol = symbol?;
        if symbol.trim().len() == 0 {
            log::warn!("line {i} is empty");
            i += 1;
            continue;
        }

        // Fetch candle data for the current symbol.
        let candles = api_caller::stock_candle(&symbol, Local::now(), 100).await?;
        // Handle the result of the candle data fetch.

        // Save the fetched candles to the database.
        store::candle::save_candles(&mut conn, candles)?;

        log::info!("Successfully fetched and saved candles for {}", symbol);
        i += 1;
    }
    Ok(())
}
