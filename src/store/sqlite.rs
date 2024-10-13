use rusqlite::{Connection, OpenFlags};

pub fn init_sqlite_connection() -> Result<Connection, String> {
    let conn = Connection::open_with_flags(
        std::env::var("sqlite_file").unwrap(),
        OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE,
    )
    .map_err(|err| err.to_string())?;

    conn.query_row("PRAGMA journal_mode=WAL;", [], |_row| Ok(()))
        .map_err(|err| err.to_string())?;

    conn.execute("PRAGMA synchronous=NORMAL;", [])
        .map_err(|err| err.to_string())?;

    Ok(conn)
}
