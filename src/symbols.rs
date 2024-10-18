use std::{
    fs::OpenOptions,
    io::{BufRead, BufReader},
    path::Path,
};

use crate::model::{QuotesError, Result};

pub fn read_symbols_from_file(symbols_file_path: &str) -> Result<Vec<String>> {
    let path = Path::new(symbols_file_path);
    if !path.exists() {
        return Err(QuotesError::FileNotFound(symbols_file_path.into()));
    }

    let file = OpenOptions::new().read(true).open(path)?;
    let lines: Result<Vec<String>> = BufReader::new(file)
        .lines()
        .map(|line| line.map_err(|_e| QuotesError::CouldNotReadLine))
        .collect();

    let symbols = lines?;
    if symbols.is_empty() {
        return Err(QuotesError::EmptySymbolFile(symbols_file_path.to_string()));
    }
    Ok(symbols)
}
