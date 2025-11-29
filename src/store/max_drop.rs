use rusqlite::{Connection, Result, params};

/// Initializes the max_drop_periods table with flexible period support.
pub fn create_table(conn: &Connection) -> Result<()> {
    log::info!("Creating new max_drop_periods table");

    // Create single flexible periods table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS max_drop_periods (
symbol TEXT NOT NULL,
period INTEGER NOT NULL,
percentile_drop REAL NOT NULL,
ema_drop REAL NOT NULL,
timestamp INTEGER NOT NULL,
PRIMARY KEY (symbol, period)
    );",
        [],
    )?;

    // Create indexes for better performance (only create if not exists)
    match conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_max_drop_periods_symbol ON max_drop_periods (symbol);",
        [],
    ) {
        Ok(_) => log::info!("Successfully created/verified index on max_drop_periods.symbol"),
        Err(e) => {
            log::error!("Failed to create index on max_drop_periods.symbol: {}", e);
            return Err(e);
        }
    }

    match conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_max_drop_periods_period ON max_drop_periods (period);",
        [],
    ) {
        Ok(_) => log::info!("Successfully created/verified index on max_drop_periods.period"),
        Err(e) => {
            log::error!("Failed to create index on max_drop_periods.period: {}", e);
            return Err(e);
        }
    }

    Ok(())
}

/// Saves max drop data for a specific period.
pub fn save_max_drop_period(
    conn: &mut Connection,
    symbol: &str,
    period: usize,
    percentile_drop: f64,
    ema_drop: f64,
    timestamp: u32,
) -> Result<()> {
    conn.execute(
        "INSERT OR REPLACE INTO max_drop_periods (symbol, period, percentile_drop, ema_drop, timestamp) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![symbol, period, percentile_drop, ema_drop, timestamp],
    )?;

    Ok(())
}

/// Gets max drop data for a specific period.
pub fn get_max_drop(conn: &Connection, symbol: &str, period: usize) -> Result<(f64, f64)> {
    conn.query_row(
        "SELECT percentile_drop, ema_drop FROM max_drop_periods WHERE symbol = ?1 AND period = ?2",
        params![symbol, period],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )
}

/// Gets all periods for a symbol.
pub fn get_all_periods(conn: &Connection, symbol: &str) -> Result<Vec<(usize, f64, f64, u32)>> {
    let mut stmt = conn.prepare(
        "SELECT period, percentile_drop, ema_drop, timestamp FROM max_drop_periods WHERE symbol = ?1 ORDER BY period"
    )?;

    let periods = stmt.query_map(params![symbol], |row| {
        Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?))
    })?;

    periods.collect()
}
