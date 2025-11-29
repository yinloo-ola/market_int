use crate::{
    atr, constants, model,
    store::{self, candle},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    conn: &mut Connection,   // Database connection.
    period: usize,           // Period for max drop calculation (5, 10, 20, etc.).
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the max_drop tables in the database.
    store::max_drop::create_table(conn)?;

    // Iterate over each symbol.
    for symbol in symbols {
        // Fetch candle data for the current symbol from the database.
        let candles = match candle::get_candles(conn, symbol.as_str(), constants::CANDLE_COUNT) {
            Ok(candles) => candles,
            Err(_) => {
                log::warn!("No candles found for {}, skipping", symbol);
                continue;
            }
        };

        if candles.is_empty() {
            log::warn!("No candles found for {}, skipping", symbol);
            continue;
        }

        let timestamp = candles.last().unwrap().timestamp;

        // Calculate max drop for the specified period
        let max_drops: Vec<f64> = candles
            .chunks(period)
            .map(|chunk| calculate_max_drop(chunk))
            .filter(|&drop| drop > 0.0)
            .collect();

        // Need at least 2 chunks for meaningful statistics
        if max_drops.len() >= 2 {
            let ema_window = std::cmp::min(5, max_drops.len()) as u32; // Use smaller window if not enough data
            let ema_drop = atr::exponential_moving_average(&max_drops, ema_window);
            let percentile_drop = atr::percentile(&max_drops, constants::PERCENTILE)?;

            // Save the specific period data
            store::max_drop::save_max_drop_period(
                conn,
                &symbol,
                period,
                percentile_drop,
                ema_drop,
                timestamp,
            )?;

            log::info!(
                "Calculated {}-day max drop for {}: percentile={:.4}, ema={:.4}",
                period,
                symbol,
                percentile_drop,
                ema_drop
            );
        } else {
            log::warn!(
                "Not enough {}-day chunks for {}, need at least 2 chunks, found {} chunks",
                period,
                symbol,
                max_drops.len()
            );
        }
    }

    log::info!("Completed max drop calculation for period {}", period);
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
