use crate::model;

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
    let mut ema_value = array[0];
    for &val in array.iter().skip(1) {
        ema_value = ema(ema_value, val, multiplier);
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

    let mut sorted = values.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    // percentile ∈ [0,1] (validated above) and len ≥ 1 ⇒ index ∈ [0, len-1], so bounds below are safe.
    let index = percentile * (sorted.len() as f64 - 1.0);
    let lower = index.floor() as usize;
    let upper = index.ceil() as usize;
    let weight = index - index.floor();

    Ok(sorted[lower] * (1.0 - weight) + sorted[upper] * weight)
}
