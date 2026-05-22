use crate::{
    constants, model,
    store::{self, candle},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(symbols_file_path: &str, conn: &mut Connection) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    store::price_percentile::create_table(conn)?;

    let mut percentiles: Vec<model::PricePercentile> = Vec::with_capacity(symbols.len());

    for symbol in symbols {
        let candles =
            match candle::get_candles(conn, symbol.as_str(), constants::PRICE_PERCENTILE_DAYS) {
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
        let percentile = compute_price_percentile(&candles);

        percentiles.push(model::PricePercentile {
            symbol: symbol.clone(),
            percentile,
            timestamp,
        });

        log::info!(
            "Calculated price percentile for {}: {:.4}",
            symbol,
            percentile
        );
    }

    store::price_percentile::save_price_percentiles(conn, &percentiles)?;
    Ok(())
}

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
