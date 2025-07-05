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
mod quotes;
// Average True Range (ATR) calculation.
mod atr;
/// Pull option chains from API based on ATR retrieved from database.
mod option;
// Sharpe ratio calculation and storage.
mod sharpe;
/// module to read symbols from symbol file
mod symbols;
// Data storage module.
mod store {
    /// Candle data storage.
    pub mod candle;
    /// option range storage.
    pub mod option_chain;
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
    PullQuotes { symbols_file_path: String },
    // Pull option chain data.
    PullOptionChain { symbols_file_path: String },
    // Publish option chain to telegram.
    PublishOptionChain { symbols_file_path: String },
    PerformAll { symbols_file_path: String },
    CalculateAtr { symbols_file_path: String },
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
    let mut conn = conn.unwrap();

    match args.command {
        Commands::PullQuotes { symbols_file_path } => {
            match quotes::pull_and_save(&symbols_file_path, &mut conn).await {
                Ok(_) => log::info!("Successfully pulled and saved quotes"),
                Err(err) => log::error!("Error pulling and saving quotes: {}", err),
            }
            match atr::calculate_and_save(&symbols_file_path, &mut conn) {
                Ok(_) => log::info!("Successfully calculated ATR and saved to DB"),
                Err(err) => log::error!("Error calculating ATR: {}", err),
            }
        }

        Commands::CalculateAtr { symbols_file_path } => {
            match atr::calculate_and_save(&symbols_file_path, &mut conn) {
                Ok(_) => log::info!("Successfully calculated ATR and saved to DB"),
                Err(err) => log::error!("Error calculating ATR: {}", err),
            }
        }

        Commands::PullOptionChain { symbols_file_path } => {
            match option::retrieve_option_chains_base_on_ranges(
                &symbols_file_path,
                &model::OptionChainSide::Put,
                conn,
            )
            .await
            {
                Ok(_) => log::info!("Successfully pulled and saved option chains"),
                Err(err) => log::error!("Error pulling option chains: {}", err),
            }
        }

        Commands::PerformAll { symbols_file_path } => {
            match quotes::pull_and_save(&symbols_file_path, &mut conn).await {
                Ok(_) => log::info!("Successfully pulled and saved quotes"),
                Err(err) => log::error!("Error pulling and saving quotes: {}", err),
            }
            match atr::calculate_and_save(&symbols_file_path, &mut conn) {
                Ok(_) => log::info!("Successfully calculated ATR and saved to DB"),
                Err(err) => log::error!("Error calculating ATR: {}", err),
            }
            match sharpe::calculate_and_save(
                &symbols_file_path,
                &mut conn,
                constants::DEFAULT_RISK_FREE_RATE,
            ) {
                Ok(_) => log::info!("Successfully calculated and saved Sharpe ratios"),
                Err(err) => log::error!("Error calculating Sharpe ratios: {}", err),
            }
            match option::retrieve_option_chains_base_on_ranges(
                &symbols_file_path,
                &model::OptionChainSide::Put,
                conn,
            )
            .await
            {
                Ok(_) => log::info!("Successfully pulled and saved option chains"),
                Err(err) => log::error!("Error pulling option chains: {}", err),
            }
        }

        Commands::PublishOptionChain { symbols_file_path } => {
            match option::publish_option_chains(&symbols_file_path, conn).await {
                Ok(_) => log::info!("Successfully published option chains"),
                Err(err) => log::error!("Error publishing option chains: {}", err),
            }
        }
    }
}
