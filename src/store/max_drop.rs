use rusqlite::{Connection, Result, params};

use crate::model;

/// Initializes the candle table in the SQLite database.
pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS max_drop (
            symbol TEXT NOT NULL,
            percentile_drop REAL NOT NULL,
            ema_drop REAL NOT NULL,
            timestamp INTEGER NOT NULL
        );",
        [],
    )?;
    match conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_max_drop_symbol ON max_drop (symbol);",
        [],
    ) {
        Ok(_) => log::info!("Successfully created unique index idx_max_drop_symbol on max_drop.symbol"),
        Err(e) => {
            log::error!("Failed to create unique index on max_drop.symbol: {}", e);
            return Err(e);
        }
    }
    Ok(())
}

/// Saves a vector of candles to the candle table.  Uses REPLACE to update existing entries.
pub fn save_max_drops(conn: &mut Connection, max_drops: &[model::MaxDrop]) -> Result<()> {
    let transaction = conn.transaction()?;
    {
        let mut stmt = transaction.prepare(
            "INSERT OR REPLACE INTO max_drop (symbol, percentile_drop, ema_drop, timestamp)
             VALUES (?1, ?2, ?3, ?4)",
        )?;
        for max_drop in max_drops {
            stmt.execute(params![
                max_drop.symbol,
                max_drop.percentile_drop,
                max_drop.ema_drop,
                max_drop.timestamp,
            ])
            .map_err(|e| {
                log::error!("Error inserting max_drop for symbol {}: {}", max_drop.symbol, e);
                e
            })?; // Don't ignore errors - they indicate real problems
        }
    }
    transaction.commit()
}

pub fn get_max_drops(conn: &Connection, symbol: &str) -> Result<model::MaxDrop> {
    conn.query_row(
        "SELECT symbol,percentile_drop,ema_drop,timestamp FROM max_drop where symbol = ?1",
        [symbol],
        |row| {
            Ok(model::MaxDrop {
                symbol: row.get(0)?,
                percentile_drop: row.get(1)?,
                ema_drop: row.get(2)?,
                timestamp: row.get(3)?,
            })
        },
    )
}
