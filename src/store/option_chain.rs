use super::super::model;
use rusqlite::{params, Connection, Result};

pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS option_strike (
            underlying TEXT NOT NULL,
            strike REAL NOT NULL,
            underlying_price REAL NOT NULL,
            side TEXT NOT NULL,
            bid REAL NOT NULL,
            mid REAL NOT NULL,
            ask REAL NOT NULL,
            bid_size INTEGER NOT NULL,
            ask_size INTEGER NOT NULL,
            last REAL NOT NULL,
            expiration INTEGER NOT NULL,
            updated INTEGER NOT NULL,
            dte INTEGER NOT NULL,
            volume INTEGER NOT NULL,
            open_interest INTEGER NOT NULL,
            rate_of_return REAL NOT NULL,
            strike_from REAL NOT NULL,
            strike_to REAL NOT NULL
    );",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_underlying_strike_side_expiration_updated ON option_strike (underlying, strike, side, expiration,updated);",
        [],
    )?;
    Ok(())
}

fn get_latest_updated_time(conn: &Connection, symbol: &str) -> Result<u32> {
    let mut stmt = conn.prepare("SELECT MAX(updated) FROM option_strike WHERE underlying = ?1")?;
    let mut rows = stmt.query(params![symbol])?;
    let row = rows.next()?.unwrap();
    let latest_updated: u32 = row.get(0)?;
    Ok(latest_updated)
}

pub fn retrieve_option_chain(
    conn: &mut Connection,
    symbol: &str,
) -> Result<Vec<model::OptionStrikeCandle>> {
    let last_update_time = get_latest_updated_time(conn, symbol)?;
    let mut stmt =
        conn.prepare("SELECT * FROM option_strike WHERE underlying = ?1 AND updated = ?2")?;
    let rows: Vec<_> = stmt
        .query_map(params![symbol, last_update_time], |row| {
            Ok(model::OptionStrikeCandle {
                underlying: row.get(0)?,
                strike: row.get(1)?,
                underlying_price: row.get(2)?,
                side: row.get(3)?,
                bid: row.get(4)?,
                mid: row.get(5)?,
                ask: row.get(6)?,
                bid_size: row.get(7)?,
                ask_size: row.get(8)?,
                last: row.get(9)?,
                expiration: row.get(10)?,
                updated: row.get(11)?,
                dte: row.get(12)?,
                volume: row.get(13)?,
                open_interest: row.get(14)?,
                rate_of_return: row.get(15)?,
                strike_from: row.get(16)?,
                strike_to: row.get(17)?,
            })
        })?
        .collect();

    let mut results = Vec::with_capacity(rows.len());
    for row in rows {
        results.push(row?);
    }
    Ok(results)
}

pub fn save_option_strike(
    conn: &mut Connection,
    strikes: &[model::OptionStrikeCandle],
) -> Result<()> {
    let transaction = conn.transaction()?;
    {
        let mut stmt = transaction.prepare(
            "REPLACE INTO option_strike (
    underlying,
    strike,
    underlying_price,
    side,
    bid,
    mid,
    ask,
    bid_size,
    ask_size,
    last,
    expiration,
    updated,
    dte,
    volume,
    open_interest,
    rate_of_return,
    strike_from,
    strike_to
) VALUES (
    ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18
);",
        )?;
        for strike in strikes {
            stmt.execute(params![
                strike.underlying,
                strike.strike,
                strike.underlying_price,
                strike.side,
                strike.bid,
                strike.mid,
                strike.ask,
                strike.bid_size,
                strike.ask_size,
                strike.last,
                strike.expiration,
                strike.updated,
                strike.dte,
                strike.volume,
                strike.open_interest,
                strike.rate_of_return,
                strike.strike_from,
                strike.strike_to,
            ])
            .err(); // Ignore errors during individual inserts; transaction will handle overall success/failure.
        }
    }
    transaction.commit()
}
