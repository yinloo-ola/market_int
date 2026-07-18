use std::collections::HashMap;

use rusqlite::{Connection, Result, params};

use crate::model::EarningsInfo;

/// Creates the earnings table if it doesn't exist.
///
/// One row per symbol (PRIMARY KEY) — the table holds the *current* upcoming-
/// earnings snapshot, refreshed wholesale on each live pipeline run by
/// [`replace_earnings`].
pub fn create_table(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS earnings (
            symbol TEXT NOT NULL PRIMARY KEY,
            report_date TEXT NOT NULL,
            report_time TEXT NOT NULL,
            expected_eps REAL,
            timestamp INTEGER NOT NULL
        )",
        [],
    )?;
    Ok(())
}

/// Replaces the stored earnings snapshot with `earnings` (clears all rows, then
/// inserts). Called by the live pipeline after fetching the calendar so that the
/// offline re-publish path can reload the same earnings data and apply the
/// earnings-aware scoring rule identically.
pub fn replace_earnings(
    conn: &Connection,
    earnings: &HashMap<String, EarningsInfo>,
    timestamp: u32,
) -> crate::model::Result<()> {
    create_table(conn)?;
    conn.execute("DELETE FROM earnings", [])?;
    {
        let mut stmt = conn.prepare(
            "INSERT INTO earnings (symbol, report_date, report_time, expected_eps, timestamp)
             VALUES (?1, ?2, ?3, ?4, ?5)",
        )?;
        for (symbol, info) in earnings {
            stmt.execute(params![
                symbol,
                info.report_date,
                info.report_time,
                info.expected_eps,
                timestamp
            ])?;
        }
    }
    Ok(())
}

/// Gets the stored earnings info for a symbol, if any.
pub fn get_earnings(conn: &Connection, symbol: &str) -> crate::model::Result<Option<EarningsInfo>> {
    let mut stmt =
        conn.prepare("SELECT report_date, report_time, expected_eps FROM earnings WHERE symbol = ?1")?;
    let mut rows = stmt.query(params![symbol])?;
    match rows.next()? {
        Some(row) => Ok(Some(EarningsInfo {
            report_date: row.get(0)?,
            report_time: row.get(1)?,
            expected_eps: row.get(2)?,
        })),
        None => Ok(None),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn in_memory_db() -> Connection {
        Connection::open_in_memory().unwrap()
    }

    fn info(report_date: &str, report_time: &str, eps: Option<f64>) -> EarningsInfo {
        EarningsInfo {
            report_date: report_date.to_string(),
            report_time: report_time.to_string(),
            expected_eps: eps,
        }
    }

    #[test]
    fn test_create_table_and_replace() {
        let conn = in_memory_db();
        let mut map = HashMap::new();
        map.insert("AAPL".to_string(), info("2026-06-12", "AMC", Some(1.5)));

        replace_earnings(&conn, &map, 1000).unwrap();

        let got = get_earnings(&conn, "AAPL").unwrap().unwrap();
        assert_eq!(got.report_date, "2026-06-12");
        assert_eq!(got.report_time, "AMC");
        assert_eq!(got.expected_eps, Some(1.5));
    }

    #[test]
    fn test_get_earnings_missing_symbol() {
        let conn = in_memory_db();
        create_table(&conn).unwrap();
        assert!(get_earnings(&conn, "NOPE").unwrap().is_none());
    }

    #[test]
    fn test_replace_earnings_overwrites_symbol() {
        let conn = in_memory_db();
        let mut a = HashMap::new();
        a.insert("AAPL".to_string(), info("2026-06-12", "AMC", None));
        replace_earnings(&conn, &a, 1000).unwrap();

        let mut b = HashMap::new();
        b.insert("AAPL".to_string(), info("2026-07-10", "BMO", Some(2.0)));
        replace_earnings(&conn, &b, 2000).unwrap();

        let got = get_earnings(&conn, "AAPL").unwrap().unwrap();
        assert_eq!(got.report_date, "2026-07-10"); // latest snapshot wins
        assert_eq!(got.report_time, "BMO");
        assert_eq!(got.expected_eps, Some(2.0));
    }

    #[test]
    fn test_replace_earnings_clears_stale_symbols() {
        // A symbol absent from the new snapshot must not linger as stale.
        let conn = in_memory_db();
        let mut first = HashMap::new();
        first.insert("AAPL".to_string(), info("2026-06-12", "AMC", None));
        first.insert("MSFT".to_string(), info("2026-06-20", "BMO", None));
        replace_earnings(&conn, &first, 1000).unwrap();

        let mut second = HashMap::new();
        second.insert("AAPL".to_string(), info("2026-06-12", "AMC", None)); // MSFT dropped
        replace_earnings(&conn, &second, 2000).unwrap();

        assert!(get_earnings(&conn, "MSFT").unwrap().is_none());
        assert!(get_earnings(&conn, "AAPL").unwrap().is_some());
    }

    #[test]
    fn test_expected_eps_nullable() {
        let conn = in_memory_db();
        let mut map = HashMap::new();
        map.insert("X".to_string(), info("2026-08-01", "AMC", None));
        replace_earnings(&conn, &map, 1000).unwrap();

        let got = get_earnings(&conn, "X").unwrap().unwrap();
        assert!(got.expected_eps.is_none());
    }
}
