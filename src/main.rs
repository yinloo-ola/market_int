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

use crate::model::OptionChainSide;
use crate::tiger::api_caller::Requester;

// Helper function to calculate the target expiration date (next Friday + 7 days)
fn calculate_target_expiration_date() -> chrono::DateTime<chrono_tz::Tz> {
    // Calculate target date (next Friday + 7 days)
    let mut target_expiration_date = Local::now();
    while target_expiration_date.weekday() != chrono::Weekday::Fri {
        target_expiration_date += chrono::Duration::days(1);
    }
    target_expiration_date += chrono::Duration::days(7);

    // Convert target date to New York timezone
    target_expiration_date.with_timezone(&New_York)
}

// Helper function to query option chain and log the results
async fn query_and_log_option_chain(
    requester: &Requester,
    symbol_list: &[&str],
    expiration_date_ny: &chrono::DateTime<chrono_tz::Tz>,
) -> Result<(), Box<dyn std::error::Error>> {
    // Query option chain using the nearest expiration date
    let option_chain = requester
        .query_option_chain(
            &[
                (symbol_list[0], (225.0, 235.0)), // Example symbol with its strike range
            ],
            expiration_date_ny,
            constants::MIN_OPEN_INTEREST,
            &OptionChainSide::Put,
        )
        .await?;

    log::info!("Successfully queried option chain for {:?}", symbol_list);

    // Serialize and log the output as JSON string
    let json_str = serde_json::to_string_pretty(&option_chain)?;
    log::info!("Option chain data: {}", json_str);

    Ok(())
}

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

            // Initialize Tiger API requester
            let requester = match tiger::api_caller::Requester::new().await {
                Some(requester) => requester,
                None => {
                    log::error!("Failed to initialize Tiger API requester");
                    return;
                }
            };

            log::info!("Successfully connected to Tiger API");

            // Test option chain
            // Calculate target expiration date
            let target_expiration_date_ny = calculate_target_expiration_date();

            // Get actual expiration dates from API and find the nearest one
            let expirations = match requester.option_expiration(&symbol_list).await {
                Ok(expirations) => expirations,
                Err(err) => {
                    log::error!("Error fetching option expirations: {}", err);
                    return;
                }
            };

            // Find the nearest expiration date to our target
            let nearest_expiration = match Requester::find_nearest_expiration(
                &expirations,
                &target_expiration_date_ny,
            ) {
                Some(nearest_expiration) => nearest_expiration,
                None => {
                    log::error!("Failed to find nearest expiration date");
                    return;
                }
            };

            log::info!("Using nearest expiration date: {:?}", nearest_expiration);

            // Query and log option chain data
            if let Err(err) =
                query_and_log_option_chain(&requester, &symbol_list, &nearest_expiration).await
            {
                log::error!("Error querying option chain: {}", err);
            }
        }
    }
}
