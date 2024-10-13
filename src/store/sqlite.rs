use rusqlite::{Connection, OpenFlags, Result};

/// Initializes a connection to the SQLite database.
pub fn init_connection() -> Result<Connection> {
    // Open the database file specified by the environment variable `sqlite_file`.
    // The database is opened in read-write mode, and it will be created if it doesn't exist.
    let conn = Connection::open_with_flags(
        std::env::var("sqlite_file").unwrap(),
        OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE,
    )?;

    // Set the journal mode to WAL (Write-Ahead Logging) for better concurrency.
    conn.query_row("PRAGMA journal_mode=WAL;", [], |_row| Ok(()))?;

    // Set the synchronous mode to NORMAL for better performance.  This trades some durability for speed.
    conn.execute("PRAGMA synchronous=NORMAL;", [])?;

    Ok(conn)
}
