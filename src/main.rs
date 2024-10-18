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
// Pull quotes from API.
mod pull_quotes;
// Average True Range (ATR) calculation.
mod calc_atr;
/// Pull option chains from API based on ATR retrieved from database.
mod pull_option;
/// module to read symbols from symbol file
mod symbols;
// Data storage module.
mod store {
    /// Candle data storage.
    pub mod candle;
    /// SQLite database interaction.
    pub mod sqlite;
    /// true range storage.
    pub mod true_range;
}
// module storing defaults
mod constants;

use clap::{Parser, Subcommand};
use dotenv::dotenv;

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

#[tokio::main]
// Main function entry point.
async fn main() {
    dotenv().ok();

    env_logger::init();

    let args = Args::parse();

    let conn = store::sqlite::init_connection();
    if let Err(err) = conn {
        log::error!("Error initializing database connection: {}", err);
        return;
    }
    let conn = conn.unwrap();

    match args.command {
        Commands::PullQuotes { symbols_file_path } => {
            match pull_quotes::pull_and_save(&symbols_file_path, conn).await {
                Ok(_) => log::info!("Successfully pulled and saved quotes"),
                Err(err) => log::error!("Error pulling and saving quotes: {}", err),
            }
        }

        Commands::CalculateAtr {
            symbols_file_path,
            atr_percentile,
        } => match calc_atr::calculate_and_save(&symbols_file_path, atr_percentile, conn) {
            Ok(_) => log::info!("Successfully calculated ATR and saved to DB"),
            Err(err) => log::error!("Error calculating ATR: {}", err),
        },

        Commands::PullOptionChain {
            symbols_file_path,
            side: _,
        } => match pull_option::retrieve_option_chains_base_on_ranges(
            &symbols_file_path,
            &model::OptionChainSide::Put,
            conn,
        )
        .await
        {
            Ok(_) => log::info!("Successfully pulled and saved option chains"),
            Err(err) => log::error!("Error pulling option chains: {}", err),
        },
    }
}
