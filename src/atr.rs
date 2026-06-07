use crate::{constants, model};

pub(crate) fn true_ranges_ratio(candles: &[model::Candle]) -> Vec<f64> {
    candles
        .windows(2)
        .map(|w| true_range_ratio(&w[1], &w[0]))
        .collect()
}

pub(crate) fn true_range_ratio(current: &model::Candle, previous: &model::Candle) -> f64 {
    let range1 = (current.high - current.low) / current.low;
    let range2 = calculate_range(current.high, previous.close);
    let range3 = calculate_range(current.low, previous.close);
    range1.max(range2).max(range3)
}

pub(crate) fn calculate_range(value: f64, reference: f64) -> f64 {
    (value - reference).abs() / value.min(reference)
}

pub(crate) fn ema(prev: f64, current: f64, multiplier: f64) -> f64 {
    current * multiplier + prev * (1.0 - multiplier)
}

pub fn exponential_moving_average(array: &[f64], period: u32) -> f64 {
    if array.is_empty() {
        return 0.0;
    }
    if array.len() < period as usize {
        // return avg of the array if not enough data points
        let sum: f64 = array.iter().sum();
        return sum / array.len() as f64;
    }
    let multiplier = 2.0 / (period as f64 + 1.0);
    let mut ema_value = array[0]; // Initialize with the first value
    for i in 1..array.len() {
        ema_value = ema(ema_value, array[i], multiplier);
    }
    ema_value
}

pub fn percentile(values: &[f64], percentile: f64) -> model::Result<f64> {
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
