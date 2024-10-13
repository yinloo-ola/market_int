mod marketdata {
    pub mod client;
    pub mod response;
}
mod http {
    pub mod client;
}
mod model;
mod pull_quotes;
mod store {
    pub mod candle;
    pub mod sqlite;
}

use clap::{Parser, Subcommand};
use dotenv::dotenv;
use std::error::Error;

#[derive(Parser, Debug)]
#[command(about, long_about = None)]
struct Args {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    PullQuotes {
        symbols_file_path: String,
    },
    CalculateAtr {
        symbols_file_path: String,
        atr_percentile: f64,
    },
    PullOptionChain {
        symbols_file_path: String,
        side: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();

    let args = Args::parse();

    let conn = store::sqlite::init_sqlite_connection()?;

    match args.command {
        Commands::PullQuotes { symbols_file_path } => {
            pull_quotes::pull_quotes(&symbols_file_path, conn).await?;
            Ok(())
        }
        Commands::CalculateAtr {
            symbols_file_path,
            atr_percentile,
        } => {
            todo!()
        }
        Commands::PullOptionChain {
            symbols_file_path,
            side,
        } => {
            todo!();
        }
    }
}
