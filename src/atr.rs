use std::{fs, path::Path};

use crate::{model, store::candle};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    atr_percentile: f64,     // ATR percentile.
    mut conn: Connection,    // Database connection.)
) -> Result<(), String> {
    // Validate symbols file path
    let path = Path::new(symbols_file_path);
    if !path.exists() {
        return Err(format!("File not found: {}", symbols_file_path));
    }
    if !path.is_file() {
        return Err(format!("Not a file: {}", symbols_file_path));
    }

    // Read symbols from the specified file.
    let symbols = fs::read_to_string(symbols_file_path)
        .map_err(|err| format!("fail to read {}: {}", symbols_file_path, err))?;
    // Split the symbols string into a vector of strings, filtering out empty lines.
    let symbols: Vec<&str> = symbols
        .split("\n")
        .filter(|s| !s.trim().is_empty())
        .collect();

    if symbols.is_empty() {
        return Err(format!("Empty symbols file: {}", symbols_file_path));
    }

    // Iterate over each symbol.
    for symbol in symbols {
        // Fetch candle data for the current symbol from the database.
        match candle::get_candles(&mut conn, symbol, 100) {
            Ok(candles) => {
                // aggregate 5 candles into one. calculate the open,close,high,low based on each group of 5 candles
                todo!("aggregate 5 candles into one. calculate the open,close,high,low based on each group of 5 candles");
                // candles.iter().chunks(5).for_each(|group|{
                //     let open = group.iter().map(|candle| candle.open).sum::<f64>() / 5.0;
                //     let close = group.iter().map(|candle| candle.close).sum::<f64>() / 5.0;
                //     let high = group.iter().map(|candle| candle.high).max().unwrap();
                //     let low = group.iter().map(|candle| candle.low).min().unwrap();
                // });

                if candles.len() < 4 {
                    log::warn!(
                        "Not enough candles for {}, skipping ATR calculation",
                        symbol
                    );
                    continue;
                }
                // Calculate the ATR for the candles.
                let trs = true_ranges(&candles);
                let ema_atr = exponential_moving_average(&trs, 4)?;
                let percentile_atr = percentile(&trs, atr_percentile)?;

                // let atr = calculate_atr(&candles, atr_percentile);
                log::info!(
                    "{}: num_candle:{} ema_atr:{},  percentile_{}:{}",
                    symbol,
                    candles.len(),
                    ema_atr,
                    atr_percentile,
                    percentile_atr
                );
                // Save the ATR to the database.
                // store::atr::save_atr(&mut conn, symbol, atr)?;
            }
            Err(e) => {
                // Log the error and continue to the next symbol if an error occurs.
                log::error!("Error fetching candles for {}: {}", symbol, e);
                continue;
            }
        }
    }
    Ok(())
}

fn true_ranges(candles: &[model::Candle]) -> Vec<f64> {
    let mut true_ranges = Vec::with_capacity(candles.len() - 1);
    for i in 1..candles.len() {
        true_ranges.push(true_range(&candles[i], &candles[i - 1]));
    }
    true_ranges
}

fn true_range(current: &model::Candle, previous: &model::Candle) -> f64 {
    let a = current.high - current.low;
    let b = (current.high - previous.close).abs();
    let c = (current.low - previous.close).abs();

    // find the max value of a, b, and c
    a.max(b).max(c)
}

fn ema(prev: f64, current: f64, multiplier: f64) -> f64 {
    current * multiplier + prev * (1.0 - multiplier)
}

fn exponential_moving_average(array: &[f64], period: u32) -> Result<f64, String> {
    if array.len() < period as usize {
        return Err(format!(
            "array length {} is less than period {}",
            array.len(),
            period
        ));
    }
    let multiplier = 2.0 / (period as f64 + 1.0);
    let mut prev = 0.0;
    for &a in array {
        prev = ema(prev, a, multiplier);
    }

    Ok(prev)
}

fn percentile(values: &[f64], percentile: f64) -> Result<f64, String> {
    if values.is_empty() {
        return Err(format!("empty values"));
    }

    if percentile == 0.5 && values.len() == 1 {
        return Ok(values[0]);
    }

    let mut values = values.to_vec();
    values.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let index = percentile * (values.len() as f64 - 1.0);

    if index < 0.0 || index >= values.len() as f64 {
        return Err(format!("invalid index {} for values {:?}", index, values));
    }

    let lower = index as usize;
    let upper = lower + 1;
    let weight = index - index.floor();

    Ok(values[lower] * (1.0 - weight) + values[upper] * weight)
}
