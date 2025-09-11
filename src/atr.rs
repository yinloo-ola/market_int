use crate::{
    constants, model,
    store::{self, candle, true_range},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    conn: &mut Connection,   // Database connection.)
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the candle table in the database.
    store::true_range::create_table(conn)?;

    let mut true_range_vec: Vec<model::TrueRange> = Vec::with_capacity(symbols.len() * 5);
    // Iterate over each symbol.
    for symbol in symbols {
        // Fetch candle data for the current symbol from the database.
        let candles = candle::get_candles(conn, symbol.as_str(), constants::CANDLE_COUNT)?;

        // Aggregate 5 candles into one. Calculate the open, close, high, low based on each group of 5 candles
        let weekly_candles: Vec<model::Candle> = candles
            .chunks(5)
            .map(|chunk| {
                let open = chunk.first().map_or(0.0, |c| c.open); // Handle empty chunks
                let close = chunk.last().map_or(0.0, |c| c.close); // Handle empty chunks
                let high = chunk
                    .iter()
                    .map(|c| c.high)
                    .max_by(|a, b| a.partial_cmp(b).unwrap())
                    .unwrap();
                let low = chunk
                    .iter()
                    .map(|c| c.low)
                    .min_by(|a, b| a.partial_cmp(b).unwrap())
                    .unwrap();
                let volume: u32 = chunk.iter().map(|c| c.volume).sum();
                model::Candle {
                    symbol: symbol.clone(),
                    open,
                    high,
                    low,
                    close,
                    volume,
                    timestamp: chunk.first().map_or(0, |c| c.timestamp), // Handle empty chunks
                }
            })
            .collect();

        // candles here are now weekly candles
        if weekly_candles.len() < 4 {
            log::warn!(
                "Not enough candles for {}, skipping ATR calculation",
                symbol
            );
            continue;
        }

        // Calculate the ATR for the candles.
        let trs = true_ranges_ratio(&weekly_candles);
        let ema_atr = exponential_moving_average(&trs, 4)?;
        let percentile_atr = percentile(&trs, constants::PERCENTILE)?;

        true_range_vec.push(model::TrueRange {
            symbol: symbol.clone(),
            percentile_range: percentile_atr,
            ema_range: ema_atr,
            timestamp: weekly_candles.last().unwrap().timestamp,
        });
    }

    // Save the true ranges to the database.
    true_range::save_true_ranges(conn, &true_range_vec)?;
    Ok(())
}

fn true_ranges_ratio(candles: &[model::Candle]) -> Vec<f64> {
    candles
        .windows(2)
        .map(|w| true_range_ratio(&w[1], &w[0]))
        .collect()
}

fn true_range_ratio(current: &model::Candle, previous: &model::Candle) -> f64 {
    let range1 = (current.high - current.low) / current.low;
    let range2 = calculate_range(current.high, previous.close);
    let range3 = calculate_range(current.low, previous.close);
    range1.max(range2).max(range3)
}

fn calculate_range(value: f64, reference: f64) -> f64 {
    (value - reference).abs() / value.min(reference)
}

fn ema(prev: f64, current: f64, multiplier: f64) -> f64 {
    current * multiplier + prev * (1.0 - multiplier)
}

fn exponential_moving_average(array: &[f64], period: u32) -> model::Result<f64> {
    if array.len() < period as usize {
        return Err(model::QuotesError::NotEnoughCandlesForStatistics(format!(
            "Not enough candles for EMA calculation (period: {})",
            period
        )));
    }
    let multiplier = 2.0 / (period as f64 + 1.0);
    let mut ema_value = array[0]; // Initialize with the first value
    for i in 1..array.len() {
        ema_value = ema(ema_value, array[i], multiplier);
    }
    Ok(ema_value)
}

fn percentile(values: &[f64], percentile: f64) -> model::Result<f64> {
    if values.is_empty() {
        return Err(model::QuotesError::NotEnoughCandlesForStatistics(
            "Not enough values for percentile calculation".to_string(),
        ));
    }
    if !(0.0..=1.0).contains(&percentile) {
        return Err(model::QuotesError::NotEnoughCandlesForStatistics(
            "Percentile must be between 0 and 1".to_string(),
        ));
    }

    let mut values = values.to_vec();
    values.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let index = percentile * (values.len() as f64 - 1.0);

    if index < 0.0 {
        return Ok(values[0]);
    }

    if index >= values.len() as f64 {
        return Ok(*values.last().unwrap());
    }

    let lower = index.floor() as usize;
    let upper = index.ceil() as usize;
    let weight = index - index.floor();

    Ok(values[lower] * (1.0 - weight) + values[upper] * weight)
}
