use crate::{
    atr, constants, model,
    store::{self, candle, max_drop},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    conn: &mut Connection,   // Database connection.)
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the candle table in the database.
    store::max_drop::create_table(conn)?;

    let mut max_drop_vec: Vec<model::MaxDrop> = Vec::with_capacity(symbols.len() * 5);
    // Iterate over each symbol.
    for symbol in symbols {
        // Fetch candle data for the current symbol from the database.
        let candles = candle::get_candles(conn, symbol.as_str(), constants::CANDLE_COUNT)?;

        // Split candles into chunks of 5 and calculate max drop for each chunk
        let max_drops: Vec<f64> = candles
            .chunks(5)
            .map(|chunk| calculate_max_drop(chunk))
            .collect();

        // Need at least 4 chunks (20 candles) for meaningful statistics
        if max_drops.len() < 4 {
            log::warn!(
                "Not enough candles for {}, skipping max drop calculation",
                symbol
            );
            continue;
        }

        let ema_drop = atr::exponential_moving_average(&max_drops, 4)?;
        let percentile_drop = atr::percentile(&max_drops, constants::PERCENTILE)?;

        max_drop_vec.push(model::MaxDrop {
            symbol: symbol.clone(),
            percentile_drop,
            ema_drop,
            timestamp: candles.last().unwrap().timestamp,
        });
    }

    // Save the max drops to the database.
    max_drop::save_max_drops(conn, &max_drop_vec)?;
    Ok(())
}

fn calculate_max_drop(candles: &[model::Candle]) -> f64 {
    // Return 0.0 if the vector of candles is empty to prevent panicking.
    if candles.is_empty() {
        return 0.0;
    }

    let mut max_drop: f64 = 0.0;
    // Initialize the peak with the high price of the first candle.
    let mut peak = candles[0].high;
    let mut trough = candles[0].low;
    // Iterate through the candles starting from the second one.
    // The first candle is used to initialize the peak.
    for candle in candles.iter().skip(1) {
        // Update the peak if the current candle's high is higher than the current peak.
        // The drop is always relative to a past high.
        peak = peak.max(candle.high);
        trough = trough.min(candle.low);

        // Calculate the drop from the current peak to the current candle's low.
        let current_drop = peak - candle.low;

        // Update the maximum drop if the current drop is greater.
        max_drop = max_drop.max(current_drop);
    }

    max_drop / trough
}
