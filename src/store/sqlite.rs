use rusqlite::{Connection, OpenFlags};

pub fn init_sqlite_connection() -> Result<Connection, String> {
    let conn = Connection::open_with_flags(
        std::env::var("sqlite_file").unwrap(),
        OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE,
    );
    match conn {
        Ok(conn) => match conn.query_row("PRAGMA journal_mode=WAL;", [], |_row| Ok(())) {
            Ok(_) => Ok(conn),
            Err(e) => Err(format!("fail to execute PRAGMA journal_mode=WAL. {}", e)),
        },
        Err(e) => Err(format!("fail to open sqlite file. {}", e)),
    }
}
