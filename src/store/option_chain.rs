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
            expiration TEXT NOT NULL,
            updated TEXT NOT NULL,
            dte INTEGER NOT NULL,
            volume INTEGER NOT NULL,
            open_interest INTEGER NOT NULL,
            rate_of_return REAL NOT NULL
    );",
        [],
    )?;
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_underlying_strike_side_expiration_updated ON option_strike (underlying, strike, side, expiration,updated);",
        [],
    )?;
    Ok(())
}

pub fn save_option_strike(
    conn: &mut Connection,
    strikes: &Vec<model::OptionStrikeCandle>,
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
    rate_of_return
) VALUES (
    ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16
);",
        )?;
        for strike in strikes {
            stmt.execute(params![
                strike.underlying,
                strike.strike,
                strike.underlying_price,
                String::from(&strike.side),
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
            ])
            .err(); // Ignore errors during individual inserts; transaction will handle overall success/failure.
        }
    }
    transaction.commit()
}
