use super::super::model;
use rusqlite::{params, Connection, Result};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS sharpe_ratio (
            symbol TEXT NOT NULL,
            value REAL NOT NULL,
            timestamp INTEGER NOT NULL
        )",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_sharpe_symbol ON sharpe_ratio (symbol);",
        [],
    )?;
    Ok(())
}

pub fn save_sharpe_ratio(
    conn: &Connection,
    symbol: &str,
    value: f64,
    timestamp: u32,
) -> model::Result<()> {
    create_table(conn)?;
    let mut stmt =
        conn.prepare("REPLACE INTO sharpe_ratio (symbol, value, timestamp) VALUES (?1, ?2, ?3)")?;
    stmt.execute(params![symbol, value, timestamp])?;
    Ok(())
}

pub fn get_sharpe_ratio(conn: &Connection, symbol: &str) -> model::Result<Option<f64>> {
    let mut stmt = conn.prepare(
        "SELECT value FROM sharpe_ratio WHERE symbol = ?1 ORDER BY timestamp DESC LIMIT 1",
    )?;
    let mut rows = stmt.query(params![symbol])?;

    match rows.next()? {
        Some(row) => {
            let value: f64 = row.get(0)?;
            Ok(Some(value))
        }
        None => Ok(None),
    }
}
