use crate::{
    constants, model,
    store::{self, sharpe_ratio},
    symbols,
};
use rusqlite::Connection;

pub fn calculate_and_save(
    symbols_file_path: &str,
    conn: &mut Connection,
    risk_free_rate: f64,
) -> model::Result<()> {
    let symbols = symbols::read_symbols_from_file(symbols_file_path)?;

    for symbol in symbols {
        let candles =
            store::candle::get_candles(conn, &symbol, constants::SHARPE_MIN_CANDLES as u32)?;

        if candles.len() < constants::SHARPE_MIN_CANDLES {
            return Err(model::QuotesError::InsufficientReturnData(
                constants::SHARPE_MIN_CANDLES,
            ));
        }

        let returns = calculate_returns(&candles);
        let sharpe = calculate_sharpe(&returns, risk_free_rate, constants::SHARPE_MIN_CANDLES)?;

        sharpe_ratio::save_sharpe_ratio(conn, &symbol, sharpe, candles.last().unwrap().timestamp)?;
    }

    Ok(())
}

fn calculate_returns(candles: &[model::Candle]) -> Vec<f64> {
    candles
        .windows(2)
        .map(|window| (window[1].close - window[0].close) / window[0].close)
        .collect()
}

fn calculate_sharpe(returns: &[f64], risk_free_rate: f64, period: usize) -> model::Result<f64> {
    if returns.len() < period {
        return Err(model::QuotesError::InsufficientReturnData(period));
    }

    let avg_return = returns.iter().sum::<f64>() / returns.len() as f64;
    let variance = returns
        .iter()
        .map(|r| (r - avg_return).powi(2))
        .sum::<f64>()
        / returns.len() as f64;
    let std_dev = variance.sqrt();

    if std_dev == 0.0 {
        return Err(model::QuotesError::SharpeCalculationError(
            "Standard deviation cannot be zero".to_string(),
        ));
    }

    Ok((avg_return - risk_free_rate) / std_dev)
}
