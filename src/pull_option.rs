use chrono::{DateTime, Datelike, Days, Local, Timelike, Weekday};
use rusqlite::Connection;

use crate::{
    constants,
    marketdata::api_caller,
    model,
    store::{candle, true_range},
    symbols,
};

/// Pulls option chains from the API based on ranges of symbols from the database.
pub async fn retrieve_option_chains_base_on_ranges(
    symbols_file_path: &str, // Path to the file containing symbols.
    side: &model::OptionChainSide,
    conn: Connection, // Database connection.
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    for symbol in symbols {
        let symbol = symbol?;
        let true_range = true_range::get_true_range(&conn, &symbol)?;
        let latest_candle = &candle::get_candles(&conn, &symbol, 1)?[0];
        let v1 = latest_candle.close - true_range.ema_range;
        let v2 = latest_candle.close - true_range.percentile_range;
        let strike_range = if v1 < v2 { (v1, v2) } else { (v2, v1) }; // (smaller,bigger)

        let chains = api_caller::option_chain(
            &symbol,
            strike_range,
            get_expiration_date_range(),
            constants::MIN_OPEN_INTEREST,
            side,
        )
        .await?;

        for chain in chains {
            log::info!("{:?}", chain);
        }
    }
    Ok(())
}

/// Calculates the range of expiration dates to use when fetching option chains.
/// The range is determined based on the current day of the week.
/// Returns a tuple containing the start and end dates of the expiration date range.
fn get_expiration_date_range() -> (DateTime<Local>, DateTime<Local>) {
    let now = Local::now().with_hour(12).unwrap();
    match now.weekday() {
        Weekday::Mon => (now + Days::new(4), now + Days::new(4 + 2)), // Friday to Sunday
        Weekday::Tue => (now + Days::new(3), now + Days::new(3 + 8)), // Friday to next Saturday
        Weekday::Wed => (now + Days::new(2 + 7), now + Days::new(2 + 7 + 2)), // Next Friday to next Sunday
        Weekday::Thu => (now + Days::new(1 + 7), now + Days::new(1 + 7 + 2)), // Next Friday to next Sunday
        Weekday::Fri => (now + Days::new(6), now + Days::new(6 + 2)), // Next Thur to next Sat
        Weekday::Sat => (now + Days::new(5), now + Days::new(5 + 2)), // Next Thur to next Sat
        Weekday::Sun => (now + Days::new(4), now + Days::new(4 + 2)), // Next Thur to next Sat
    }
}
