use crate::model;

/// Computes the 20-day price percentile from a candle slice.
/// Returns 0.5 if all prices are equal.
pub fn compute_price_percentile(candles: &[model::Candle]) -> f64 {
    let close_prices: Vec<f64> = candles.iter().map(|c| c.close).collect();

    let min_price = close_prices.iter().copied().fold(f64::INFINITY, f64::min);
    let max_price = close_prices
        .iter()
        .copied()
        .fold(f64::NEG_INFINITY, f64::max);

    if max_price == min_price {
        return 0.5;
    }

    let current_close = close_prices.last().copied().unwrap();
    (current_close - min_price) / (max_price - min_price)
}
