use std::{
    fs::OpenOptions,
    io::{BufRead, BufReader},
    path::Path,
};

use crate::model;

pub fn read_symbols_from_file(
    symbols_file_path: &str,
) -> model::Result<Vec<model::Result<String>>> {
    // Validate symbols file path
    let path = Path::new(symbols_file_path);
    if !path.exists() {
        return Err(model::QuotesError::FileNotFound(symbols_file_path.into()));
    }

    let file = OpenOptions::new().read(true).open(path)?;

    let symbols: Vec<_> = BufReader::new(file)
        .lines()
        .map(|line| line.map_err(|_e| model::QuotesError::CouldNotReadLine))
        .collect();

    if symbols.is_empty() {
        return Err(model::QuotesError::EmptySymbolFile(
            symbols_file_path.into(),
        ));
    }
    Ok(symbols)
}
