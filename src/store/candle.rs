use super::super::model;
use rusqlite::{params, Connection, Result};

pub fn initialize_candle(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS candle (
            symbol TEXT NOT NULL,
            open REAL NOT NULL,
            high REAL NOT NULL,
            low REAL NOT NULL,
            close REAL NOT NULL,
            volume INTEGER NOT NULL,
            timestamp INTEGER NOT NULL
        );",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_candle_symbol_timestamp ON candle (symbol, timestamp);",
        [],
    )?;
    Ok(())
}

pub fn save_candles(conn: &mut Connection, candles: Vec<model::Candle>) -> Result<()> {
    let transaction = conn.transaction()?;
    {
        let mut stmt = transaction.prepare(
            "REPLACE INTO candle (symbol, open, high, low, close, volume, timestamp)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        )?;
        for candle in candles {
            stmt.execute(params![
                candle.symbol,
                candle.open,
                candle.high,
                candle.low,
                candle.close,
                candle.volume,
                candle.timestamp,
            ])
            .err();
        }
    }
    transaction.commit()
}

pub fn get_candles(
    conn: &mut Connection,
    symbol: &str,
    from: u32,
    to: u32,
) -> Result<Vec<model::Candle>> {
    let mut stmt = conn.prepare(
        "SELECT symbol, open, high, low, close, volume, timestamp
         FROM candle
         WHERE symbol = ?1 AND timestamp >= ?2 AND timestamp <= ?3",
    )?;
    let mut rows = stmt.query(params![symbol, from, to])?;
    let mut candles = Vec::new();
    while let Some(row) = rows.next()? {
        let symbol: String = row.get(0)?;
        let open: f64 = row.get(1)?;
        let high: f64 = row.get(2)?;
        let low: f64 = row.get(3)?;
        let close: f64 = row.get(4)?;
        let volume: u32 = row.get(5)?;
        let timestamp: u32 = row.get(6)?;
        candles.push(model::Candle {
            symbol,
            open,
            high,
            low,
            close,
            volume,
            timestamp,
        });
    }
    Ok(candles)
}
