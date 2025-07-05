use rusqlite::{Connection, Result};

use crate::model;

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

pub fn save_sharpe_ratio(conn: &Connection, ratios: &[(String, f64, u32)]) -> model::Result<()> {
    let transaction = conn.transaction()?;
    {
        let mut stmt = transaction.prepare(
            "REPLACE INTO sharpe_ratio (symbol, value, timestamp) VALUES (?1, ?2, ?3)",
        )?;
        for (symbol, value, timestamp) in ratios {
            stmt.execute(params![symbol, value, timestamp])?;
        }
    }
    transaction.commit()?;
    Ok(())
}
