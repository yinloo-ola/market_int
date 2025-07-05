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
        let candles = store::candle::get_candles(conn, &symbol, constants::CANDLE_COUNT as u32)?;

        if candles.len() < constants::SHARPE_MIN_CANDLES {
            return Err(model::QuotesError::InsufficientReturnData(
                constants::SHARPE_MIN_CANDLES,
            ));
        }

        let returns = calculate_returns(&candles);
        let sharpe = calculate_sharpe(&returns, risk_free_rate)?;

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

fn calculate_sharpe(returns: &[f64], risk_free_rate: f64) -> model::Result<f64> {
    if returns.is_empty() {
        return Err(model::QuotesError::InsufficientReturnData(0));
    }

    // Convert annual risk-free rate to daily rate
    let daily_risk_free_rate = risk_free_rate / 252.0;

    // Calculate daily excess returns
    let excess_returns: Vec<f64> = returns.iter().map(|r| r - daily_risk_free_rate).collect();

    // Calculate average daily excess return
    let avg_excess_return = excess_returns.iter().sum::<f64>() / excess_returns.len() as f64;

    // Calculate standard deviation of daily excess returns
    let variance = excess_returns
        .iter()
        .map(|r| (r - avg_excess_return).powi(2))
        .sum::<f64>()
        / excess_returns.len() as f64;
    let std_dev = variance.sqrt();

    if std_dev == 0.0 {
        return Err(model::QuotesError::SharpeCalculationError(
            "Standard deviation cannot be zero".to_string(),
        ));
    }

    // Annualize the components
    let annualized_avg_excess_return = avg_excess_return * 252.0;
    let annualized_std_dev = std_dev * (252.0_f64).sqrt();

    // Calculate annualized Sharpe ratio
    let annualized_sharpe = annualized_avg_excess_return / annualized_std_dev;

    Ok(annualized_sharpe)
}
