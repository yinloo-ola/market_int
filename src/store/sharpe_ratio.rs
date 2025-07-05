use super::super::model;
use rusqlite::{Connection, Result};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS sharpe_ratio (
            symbol TEXT NOT NULL,
            value REAL NOT NULL,
            timestamp INTEGER NOT NULL,
        )",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_sharpe_symbol ON sharpe_ratio (symbol);",
        [],
    )?;
    Ok(())
}

pub fn save_sharpe_ratio(conn: &Connection, symbol: &str, value: f64, timestamp: u32) -> model::Result<()> {
    let mut stmt = conn.prepare(
        "REPLACE INTO sharpe_ratio (symbol, value, timestamp) VALUES (?1, ?2, ?3)",
    )?;
    stmt.execute(params![symbol, value, timestamp])?;
    Ok(())
}
