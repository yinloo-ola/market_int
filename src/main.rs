mod marketdata {
    pub mod client;
    pub mod response;
}
mod http {
    pub mod client;
}
mod model;
mod store {
    pub mod candle;
    pub mod sqlite;
}

use chrono::{DateTime, Local};
use clap::{Parser, Subcommand};
use dotenv::dotenv;
use marketdata::client;
use std::error::Error;
use store::candle;

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

    let mut conn = store::sqlite::init_sqlite_connection()?;

    match args.command {
        Commands::PullQuotes { symbols_file_path } => {
            store::candle::initialize_candle(&conn)?;
            let candles = client::stock_candle("AAPL", Local::now(), 100).await?;
            let candles2 = client::stock_candle("NVDA", Local::now(), 100).await?;
            store::candle::save_candles(&mut conn, candles)?;
            store::candle::save_candles(&mut conn, candles2)?;
            Ok(())
        }
        Commands::CalculateAtr {
            symbols_file_path,
            atr_percentile,
        } => {
            let ts = Local::now().timestamp();
            let candles = candle::get_candles(&mut conn, "NVDA", 0, ts as u32)?;
            println!("{:?}", candles);
            Ok(())
        }
        Commands::PullOptionChain {
            symbols_file_path,
            side,
        } => {
            todo!();
        }
    }
}
