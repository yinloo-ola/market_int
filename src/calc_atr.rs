use crate::{
    constants, model,
    store::{self, candle, true_range},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str, // Path to the file containing symbols.
    atr_percentile: f64,     // ATR percentile.
    mut conn: Connection,    // Database connection.)
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    // Initialize the candle table in the database.
    store::true_range::create_table(&conn)?;

    let mut true_range_vec: Vec<model::TrueRange> = Vec::with_capacity(symbols.len() * 5);
    // Iterate over each symbol.
    for symbol in symbols {
        let symbol = symbol?; // return Err when any symbol is not ok

        // Fetch candle data for the current symbol from the database.
        let candles = candle::get_candles(&mut conn, symbol.as_str(), constants::CANDLE_COUNT)?;

        // aggregate 5 candles into one. calculate the open,close,high,low based on each group of 5 candles
        let candles: Vec<model::Candle> = candles
            .chunks(5)
            .map(|group| {
                let open = group[0].open;
                let close = group[group.len() - 1].close;
                let highs = group.iter().map(|candle| candle.high);
                let mut high = group[0].high;
                for h in highs {
                    if h > high {
                        high = h;
                    }
                }
                let lows = group.iter().map(|candle| candle.low);
                let mut low = group[0].low;
                for l in lows {
                    if l < low {
                        low = l;
                    }
                }
                model::Candle {
                    symbol: symbol.to_string(),
                    open,
                    high,
                    low,
                    close,
                    volume: 0,
                    timestamp: group[0].timestamp,
                }
            })
            .collect();

        // candles here are now weekly candles
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

        true_range_vec.push(model::TrueRange {
            symbol: symbol.into(),
            percentile_range: percentile_atr,
            ema_range: ema_atr,
            timestamp: candles.last().unwrap().timestamp,
        });
    }

    // Save the true ranges to the database.
    true_range::save_true_ranges(&mut conn, true_range_vec)?;
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

fn exponential_moving_average(array: &[f64], period: u32) -> model::Result<f64> {
    if array.len() < period as usize {
        return Err(model::QuotesError::NotEnoughCandlesForStatistics(
            "exponential_moving_average".into(),
        ));
    }
    let multiplier = 2.0 / (period as f64 + 1.0);
    let mut prev = 0.0;
    for &a in array {
        prev = ema(prev, a, multiplier);
    }

    Ok(prev)
}

fn percentile(values: &[f64], percentile: f64) -> model::Result<f64> {
    if values.is_empty() {
        return Err(model::QuotesError::NotEnoughCandlesForStatistics(
            "percentile".into(),
        ));
    }
    if percentile < 0.0 {
        return Err(model::QuotesError::NotEnoughCandlesForStatistics(
            "percentile < 0".into(),
        ));
    }

    if percentile == 0.5 && values.len() == 1 {
        return Ok(values[0]);
    }

    let mut values = values.to_vec();
    values.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let index = percentile * (values.len() as f64 - 1.0);

    if index < 0.0 || index >= values.len() as f64 {
        panic!("percentile: impossible index!!");
    }

    let lower = index as usize;
    let upper = lower + 1;
    let weight = index - index.floor();

    Ok(values[lower] * (1.0 - weight) + values[upper] * weight)
}
