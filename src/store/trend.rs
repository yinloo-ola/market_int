use rusqlite::{params, Connection, Result};

/// Creates the trend table if it doesn't exist.
pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS trend (
            symbol TEXT NOT NULL,
            ema_short REAL NOT NULL,
            ema_long REAL NOT NULL,
            trend_ratio_short REAL NOT NULL,
            trend_ratio_long REAL NOT NULL,
            timestamp INTEGER NOT NULL,
            PRIMARY KEY (symbol, timestamp)
        )",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_trend_symbol ON trend (symbol);",
        [],
    )?;
    Ok(())
}

/// Saves trend data for a single symbol.
pub fn save_trend(
    conn: &Connection,
    symbol: &str,
    ema_short: f64,
    ema_long: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
    timestamp: u32,
) -> crate::model::Result<()> {
    create_table(conn)?;
    let mut stmt = conn.prepare(
        "REPLACE INTO trend (symbol, ema_short, ema_long, trend_ratio_short, trend_ratio_long, timestamp) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
    )?;
    stmt.execute(params![symbol, ema_short, ema_long, trend_ratio_short, trend_ratio_long, timestamp])?;
    Ok(())
}

/// Gets the latest trend ratios for a symbol. Returns (trend_ratio_short, trend_ratio_long).
pub fn get_trend(conn: &Connection, symbol: &str) -> crate::model::Result<Option<(f64, f64)>> {
    let mut stmt = conn.prepare(
        "SELECT trend_ratio_short, trend_ratio_long FROM trend WHERE symbol = ?1 ORDER BY timestamp DESC LIMIT 1",
    )?;
    let mut rows = stmt.query(params![symbol])?;
    match rows.next()? {
        Some(row) => {
            let short: f64 = row.get(0)?;
            let long: f64 = row.get(1)?;
            Ok(Some((short, long)))
        }
        None => Ok(None),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn in_memory_db() -> Connection {
        Connection::open_in_memory().unwrap()
    }

    #[test]
    fn test_create_table_and_save() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();

        save_trend(&conn, "AAPL", 280.0, 270.0, 1.05, 1.08, 1000).unwrap();

        let result = get_trend(&conn, "AAPL").unwrap();
        assert!(result.is_some());
        let (short, long) = result.unwrap();
        assert!((short - 1.05).abs() < 1e-9);
        assert!((long - 1.08).abs() < 1e-9);
    }

    #[test]
    fn test_get_trend_missing_symbol() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();

        let result = get_trend(&conn, "NONEXISTENT").unwrap();
        assert!(result.is_none());
    }

    #[test]
    fn test_save_replaces_existing() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();

        save_trend(&conn, "AAPL", 280.0, 270.0, 1.05, 1.08, 1000).unwrap();
        save_trend(&conn, "AAPL", 290.0, 275.0, 1.03, 1.06, 2000).unwrap();

        let result = get_trend(&conn, "AAPL").unwrap().unwrap();
        assert!((result.0 - 1.03).abs() < 1e-9); // returns latest
        assert!((result.1 - 1.06).abs() < 1e-9);
    }
}
