use std::collections::HashSet;

use crate::{constants, model, symbols};
use crate::{
    pipeline::{PipelineEvent, ProgressReporter, RequesterFactory, RunCoverage, Stage},
    store,
    tiger::api_caller::Requester,
};
use chrono::Local;
use rusqlite::Connection;
use tokio::time::{Duration, sleep};

/// Pulls stock quotes for a list of symbols and saves them to the database.
/// Live-requester variant used by the CLI's pull-quotes command; the pipeline
/// calls [`pull_and_save_with`] so tests can inject a requester factory.
pub async fn pull_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    conn: &mut Connection,   // Database connection.
) -> model::Result<()> {
    pull_and_save_with(
        symbols_file_path,
        conn,
        crate::pipeline::live_requester_factory(),
        &ProgressReporter::default(),
        &mut RunCoverage::default(),
    )
    .await
}

/// Pipeline variant: same batching and persistence, plus per-batch progress
/// events, a run-level coverage accumulator (requested vs succeeded symbol
/// counts — exact even when a batch fails mid-run), and an injectable
/// requester factory for the offline test seam.
///
/// Batch behavior is unchanged: the first failing batch aborts the stage
/// (chunks processed before it stay saved), while the caller decides whether
/// to barrel on.
pub(crate) async fn pull_and_save_with(
    symbols_file_path: &str,
    conn: &mut Connection,
    factory: RequesterFactory,
    progress: &ProgressReporter,
    coverage: &mut RunCoverage,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the candle table in the database.
    store::candle::create_table(conn)?;

    // Filter out empty symbols and collect them into a vector. Requested is
    // counted before requester init so barrel-on runs still report it; only a
    // whole-run fatal abort (which discards the outcome entirely) goes unseen.
    let valid_symbols: Vec<&str> = symbols
        .iter()
        .filter(|s| !s.trim().is_empty())
        .map(|s| s.as_str())
        .collect();
    coverage.symbols_requested += valid_symbols.len();
    let total_batches = valid_symbols.len().div_ceil(constants::API_BATCH_SIZE);

    // Initialize Tiger API requester
    let requester: Requester = match factory().await {
        Some(requester) => requester,
        None => {
            log::error!("Failed to initialize Tiger API requester");
            return Err(model::QuotesError::HttpError(
                crate::http::client::RequestError::Other(
                    "Failed to initialize Tiger API requester".to_string(),
                ),
            ));
        }
    };

    // Process symbols in batches
    for (done, chunk) in valid_symbols.chunks(constants::API_BATCH_SIZE).enumerate() {
        // Fetch candle data for the current batch of symbols.
        let candles = requester
            .query_stock_quotes(
                chunk,
                &Local::now(),
                constants::CANDLE_COUNT,
                "day", // Assuming daily data period
            )
            .await;

        // Emit after every batch attempt so progress advances even on failure.
        progress.emit(PipelineEvent::BatchDone {
            stage: Stage::Quotes,
            done: done + 1,
            total: total_batches,
        });

        // Handle the result of the candle data fetch.
        match candles {
            Ok(candles) => {
                // Save the fetched candles to the database.
                store::candle::save_candles(conn, &candles)?;
                // Count what actually came back: the API may return Ok with no
                // rows for some or all of the batch.
                coverage.symbols_succeeded += candles
                    .iter()
                    .map(|c| c.symbol.as_str())
                    .collect::<HashSet<_>>()
                    .len();
                log::info!(
                    "Successfully fetched and saved candles for batch of {} symbols",
                    chunk.len()
                );
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
