use std::collections::HashMap;
use std::fs::OpenOptions;
use std::io::{BufRead, BufReader};
use std::path::Path;

use crate::model::{QuotesError, Result};

pub fn load_sectors(path: &str) -> Result<HashMap<String, String>> {
    let p = Path::new(path);
    if !p.exists() {
        log::warn!(
            "Sectors file not found: {}. All sectors will be Unknown.",
            path
        );
        return Ok(HashMap::new());
    }

    let file = OpenOptions::new().read(true).open(p)?;
    let mut map = HashMap::new();

    for line in BufReader::new(file).lines() {
        let line = line.map_err(|_| QuotesError::CouldNotReadLine)?;
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let parts: Vec<&str> = line.splitn(2, ',').collect();
        if parts.len() == 2 {
            map.insert(parts[0].trim().to_string(), parts[1].trim().to_string());
        }
    }

    log::info!("Loaded {} sector mappings from {}", map.len(), path);
    Ok(map)
}

/// Default sector label when a symbol has no mapping.
pub const UNKNOWN_SECTOR: &str = "Unknown";

/// Returns the sector for a symbol as a borrowed `&str`,
/// or [`UNKNOWN_SECTOR`] if not found.
///
/// Prefer this over the old `get_sector` to avoid allocations.
pub fn sector_of<'a>(sectors: &'a HashMap<String, String>, symbol: &str) -> &'a str {
    sectors.get(symbol).map(|s| s.as_str()).unwrap_or(UNKNOWN_SECTOR)
}

/// Returns the sector for a symbol as an owned `String`,
/// or [`UNKNOWN_SECTOR`] if not found.
pub fn get_sector(sectors: &HashMap<String, String>, symbol: &str) -> String {
    sector_of(sectors, symbol).to_string()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_load_sectors() {
        let mut f = NamedTempFile::new().unwrap();
        writeln!(f, "AAPL,Technology").unwrap();
        writeln!(f, "XOM,Energy").unwrap();
        writeln!(f, "JPM,Financials").unwrap();

        let map = load_sectors(f.path().to_str().unwrap()).unwrap();
        assert_eq!(map.len(), 3);
        assert_eq!(map["AAPL"], "Technology");
        assert_eq!(map["XOM"], "Energy");
        assert_eq!(map["JPM"], "Financials");
    }

    #[test]
    fn test_load_sectors_missing_file() {
        let map = load_sectors("/nonexistent/path.csv").unwrap();
        assert!(map.is_empty());
    }

    #[test]
    fn test_load_sectors_skips_blank_lines() {
        let mut f = NamedTempFile::new().unwrap();
        writeln!(f, "AAPL,Technology").unwrap();
        writeln!(f, "").unwrap();
        writeln!(f, "XOM,Energy").unwrap();

        let map = load_sectors(f.path().to_str().unwrap()).unwrap();
        assert_eq!(map.len(), 2);
    }

    #[test]
    fn test_get_sector_known() {
        let mut map = HashMap::new();
        map.insert("AAPL".to_string(), "Technology".to_string());
        assert_eq!(get_sector(&map, "AAPL"), "Technology");
    }

    #[test]
    fn test_get_sector_unknown() {
        let map = HashMap::<String, String>::new();
        assert_eq!(get_sector(&map, "UNKNOWN_TICKER"), "Unknown");
    }

    #[test]
    fn test_load_actual_sectors_file() {
        // Integration test: verify data/symbols.csv has sector mappings
        let sectors_map = load_sectors("data/symbols.csv").unwrap();
        assert!(!sectors_map.is_empty(), "symbols.csv should have sector mappings");

        // Check that all known tickers are mapped
        for ticker in &["AAPL", "NVDA", "XOM", "JPM", "JNJ", "WMT"] {
            assert!(sectors_map.contains_key(*ticker), "symbols.csv missing sector for: {}", ticker);
            let sector = &sectors_map[*ticker];
            assert_ne!(sector, "Unknown", "sector for {} should not be Unknown", ticker);
            assert!(!sector.is_empty(), "sector for {} should not be empty", ticker);
        }
    }
}
