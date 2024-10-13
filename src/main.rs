mod marketdata {
    pub mod client;
    pub mod response;
}
mod http {
    pub mod client;
}
mod model;
use dotenv::dotenv;
use marketdata::client;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenv().ok();

    let (market_status, candles) = tokio::join!(
        client::market_status(),
        client::stock_candle("TSLA".to_string(), chrono::Local::now(), 10)
    );
    match market_status {
        Ok(status) => println!("Market status: {:?}", status),
        Err(e) => println!("Error: {:?}", e),
    }

    match candles {
        Ok(candles) => println!("Candles: {:?}", candles),
        Err(e) => println!("Error: {:?}", e),
    }
    Ok(())
}
