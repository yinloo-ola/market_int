use super::super::model;
use rusqlite::{params, Connection, Result};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS price_percentile (
            symbol TEXT NOT NULL,
            percentile REAL NOT NULL,
            timestamp INTEGER NOT NULL
        )",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_price_percentile_symbol ON price_percentile (symbol);",
        [],
    )?;
    Ok(())
}

pub fn save_price_percentile(
    conn: &Connection,
    symbol: &str,
    percentile: f64,
    timestamp: u32,
) -> model::Result<()> {
    create_table(conn)?;
    let mut stmt = conn.prepare(
        "REPLACE INTO price_percentile (symbol, percentile, timestamp) VALUES (?1, ?2, ?3)",
    )?;
    stmt.execute(params![symbol, percentile, timestamp])?;
    Ok(())
}

pub fn save_price_percentiles(
    conn: &mut Connection,
    percentiles: &[model::PricePercentile],
) -> model::Result<()> {
    let transaction = conn.transaction()?;
    {
        let mut stmt = transaction.prepare(
            "REPLACE INTO price_percentile (symbol, percentile, timestamp) VALUES (?1, ?2, ?3)",
        )?;
        for pp in percentiles {
            stmt.execute(params![pp.symbol, pp.percentile, pp.timestamp])?;
        }
    }
    transaction.commit()?;
    Ok(())
}

pub fn get_price_percentile(conn: &Connection, symbol: &str) -> model::Result<Option<f64>> {
    let mut stmt = conn.prepare(
        "SELECT percentile FROM price_percentile WHERE symbol = ?1 ORDER BY timestamp DESC LIMIT 1",
    )?;
    let mut rows = stmt.query(params![symbol])?;

    match rows.next()? {
        Some(row) => {
            let percentile: f64 = row.get(0)?;
            Ok(Some(percentile))
        }
        None => Ok(None),
    }
}
