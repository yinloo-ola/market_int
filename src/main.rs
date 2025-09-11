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
// Tiger API client
mod tiger {
    pub mod api_caller;
}
// Data storage module.
mod store {
    /// Candle data storage.
    pub mod candle;
    /// option range storage.
    pub mod option_chain;
    /// Sharpe ratio storage.
    pub mod sharpe_ratio;
    /// SQLite database interaction.
    pub mod sqlite;
    /// true range storage.
    pub mod true_range;
}
// module storing defaults
mod constants;

use chrono::{Datelike, Local};
use chrono_tz::America::New_York;
use clap::{Parser, Subcommand};
use dotenv::dotenv;
use serde_json;

use crate::model::OptionChainSide;
use crate::tiger::api_caller::Requester;

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
    CalculateSharpeRatio { symbols_file_path: String },
    // Test Tiger API
    TestTiger { symbols: String },
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

        Commands::CalculateSharpeRatio { symbols_file_path } => {
            match sharpe::calculate_and_save(
                &symbols_file_path,
                &mut conn,
                constants::DEFAULT_RISK_FREE_RATE,
            ) {
                Ok(_) => log::info!("Successfully calculated and saved Sharpe ratios"),
                Err(err) => log::error!("Error calculating Sharpe ratios: {}", err),
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

        Commands::TestTiger { symbols } => {
            // Split the comma-separated symbols into a vector
            let symbol_list: Vec<&str> = symbols.split(',').map(|s| s.trim()).collect();

            match tiger::api_caller::Requester::new().await {
                Some(requester) => {
                    log::info!("Successfully connected to Tiger API");

                    // // Test stock quotes
                    // match requester
                    //     .query_stock_quotes(
                    //         &symbol_list,
                    //         &Local::now(),
                    //         constants::CANDLE_COUNT / 5,
                    //         "week",
                    //     )
                    //     .await
                    // {
                    //     Ok(candles) => {
                    //         log::info!("Successfully queried stock quotes for {:?}", symbol_list);
                    //         for candle in &candles {
                    //             log::info!("Candle: {:?}", candle);
                    //         }
                    //     }
                    //     Err(err) => log::error!("Error querying stock quotes: {}", err),
                    // }

                    // Test option chain
                    // Calculate target date (next Friday + 7 days)
                    let mut target_expiration_date = Local::now();
                    while target_expiration_date.weekday() != chrono::Weekday::Fri {
                        target_expiration_date = target_expiration_date + chrono::Duration::days(1);
                    }
                    target_expiration_date = target_expiration_date + chrono::Duration::days(7);

                    // Convert target date to New York timezone
                    let target_expiration_date_ny = target_expiration_date.with_timezone(&New_York);
                    
                    // Get actual expiration dates from API and find the nearest one
                    match requester.option_expiration(&symbol_list).await {
                        Ok(expirations) => {
                            // Find the nearest expiration date to our target
                            if let Some(nearest_expiration) = Requester::find_nearest_expiration(&expirations, &target_expiration_date_ny) {
                                log::info!("Using nearest expiration date: {:?}", nearest_expiration);
                                let expiration_date_ny = nearest_expiration;
                                
                                // Continue with option chain query using the nearest expiration date
                                match requester
                                    .query_option_chain(
                                        &[
                                            (symbol_list[0], (225.0, 235.0)), // Example symbol with its strike range
                                        ],
                                        &expiration_date_ny,
                                        constants::MIN_OPEN_INTEREST,
                                        &OptionChainSide::Put,
                                    )
                                    .await
                                {
                                    Ok(option_chain) => {
                                        log::info!("Successfully queried option chain for {:?}", symbol_list);
                                        // Log the output as JSON string
                                        match serde_json::to_string_pretty(&option_chain) {
                                            Ok(json_str) => {
                                                log::info!("Option chain data: {}", json_str);
                                            }
                                            Err(err) => {
                                                log::error!(
                                                    "Failed to serialize option chain to JSON: {}",
                                                    err
                                                );
                                            }
                                        }
                                    }
                                    Err(err) => log::error!("Error querying option chain: {}", err),
                                }
                            } else {
                                log::error!("Failed to find nearest expiration date");
                            }
                        }
                        Err(err) => log::error!("Error fetching option expirations: {}", err),
                    }
                }
                None => log::error!("Failed to initialize Tiger API requester"),
            }
        }
    }
}
