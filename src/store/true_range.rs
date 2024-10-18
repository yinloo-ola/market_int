use rusqlite::{params, Connection, Result};

use crate::model;

/// Initializes the candle table in the SQLite database.
pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS true_range (
            symbol TEXT NOT NULL,
            percentile_range REAL NOT NULL,
            ema_range REAL NOT NULL,
            timestamp INTEGER NOT NULL
        );",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_symbol ON true_range (symbol);",
        [],
    )?;
    Ok(())
}

/// Saves a vector of candles to the candle table.  Uses REPLACE to update existing entries.
pub fn save_true_ranges(conn: &mut Connection, true_ranges: Vec<model::TrueRange>) -> Result<()> {
    let transaction = conn.transaction()?;
    {
        let mut stmt = transaction.prepare(
            "REPLACE INTO true_range (symbol, percentile_range, ema_range, timestamp)
             VALUES (?1, ?2, ?3, ?4)",
        )?;
        for true_range in true_ranges {
            stmt.execute(params![
                true_range.symbol,
                true_range.percentile_range,
                true_range.ema_range,
                true_range.timestamp,
            ])
            .err(); // Ignore errors during individual inserts; transaction will handle overall success/failure.
        }
    }
    transaction.commit()
}

pub fn get_true_range(conn: &Connection, symbol: &str) -> Result<model::TrueRange> {
    conn.query_row(
        "SELECT symbol,percentile_range,ema_range,timestamp FROM true_range where symbol = ?1",
        [symbol],
        |row| {
            Ok(model::TrueRange {
                symbol: row.get(0)?,
                percentile_range: row.get(1)?,
                ema_range: row.get(2)?,
                timestamp: row.get(3)?,
            })
        },
    )
}
