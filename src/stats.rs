use crate::model;

/// Annualized volatility from daily close prices.
/// Uses rolling window of daily log returns, annualized by sqrt(252).
///
/// Lives here (not in backtest) so the backtest and the option-chain
/// realized-vol collector share one formula without an option↔backtest
/// dependency cycle.
pub fn estimate_historical_volatility(closes: &[f64], window: usize) -> f64 {
    if closes.len() < window + 1 {
        return 0.30; // Default 30% if insufficient data
    }
    let recent = &closes[closes.len() - window - 1..];
    let returns: Vec<f64> = recent.windows(2).map(|w| (w[1] / w[0]).ln()).collect();
    let mean = returns.iter().sum::<f64>() / returns.len() as f64;
    let variance =
        returns.iter().map(|r_val| (r_val - mean).powi(2)).sum::<f64>() / (returns.len() - 1) as f64;
    variance.sqrt() * (252.0_f64).sqrt()
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
