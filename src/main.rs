// Main function for the market data application.
mod marketdata {
    // Client for fetching market data.
    pub mod api_caller;
    // Response structures for market data.
    pub mod response;
}
// HTTP client module.
mod http {
    // HTTP client implementation.
    pub mod client;
}
// Data models.
mod model;
// Pull quotes functionality.
mod quotes;
// Data storage module.
mod store {
    // Candle data storage.
    pub mod candle;
    // SQLite database interaction.
    pub mod sqlite;
}

use clap::{Parser, Subcommand};
use dotenv::dotenv;
use thiserror::Error;

// Command-line argument parser.
#[derive(Parser, Debug)]
#[command(about, long_about = None)]
struct Args {
    #[command(subcommand)]
    command: Commands,
}

// Subcommands for the application.
#[derive(Subcommand, Debug)]
enum Commands {
    // Pull quotes for specified symbols.
    PullQuotes {
        symbols_file_path: String,
    },
    // Calculate Average True Range (ATR).
    CalculateAtr {
        symbols_file_path: String,
        atr_percentile: f64,
    },
    // Pull option chain data.
    PullOptionChain {
        symbols_file_path: String,
        side: String,
    },
}

#[derive(Error, Debug)]
pub enum MarketDataError {
    #[error("Database error: {0}")]
    DatabaseError(#[from] rusqlite::Error),
    #[error("Quotes error: {0}")]
    QuotesError(#[from] quotes::QuotesError),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
    #[error("Other error: {0}")]
    OtherError(String),
}

#[tokio::main]
// Main function entry point.
async fn main() -> Result<(), MarketDataError> {
    dotenv().ok();

    let args = Args::parse();

    let conn = store::sqlite::init_connection()?;

    match args.command {
        Commands::PullQuotes { symbols_file_path } => {
            quotes::pull_and_save(&symbols_file_path, conn).await?;
            Ok(())
        }
        Commands::CalculateAtr {
            symbols_file_path: _,
            atr_percentile: _,
        } => {
            todo!()
        }
        Commands::PullOptionChain {
            symbols_file_path: _,
            side: _,
        } => {
            todo!()
        }
    }
}
