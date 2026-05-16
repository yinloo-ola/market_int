use std::{
    collections::{HashMap, HashSet},
    env::VarError,
    error::Error,
    fmt::Display,
    io::{self, BufWriter},
};

use csv::Writer;
use rusqlite::{
    types::{FromSql, FromSqlError, FromSqlResult, ToSqlOutput, ValueRef},
    ToSql,
};
use serde::{Deserialize, Serialize};
use telegram_bot_api::bot::APIResponseError;

use crate::http::client;
use crate::constants;

/// Represents the market status.
#[derive(Debug)]
pub enum MarketStatus {
    Open,
    Closed,
    Null,
}

/// Structure representing a candle (OHLCV data).
#[derive(Debug)]
pub struct Candle {
    pub symbol: String, // Symbol of the asset.
    pub open: f64,      // Opening price.
    pub high: f64,      // Highest price.
    pub low: f64,       // Lowest price.
    pub close: f64,     // Closing price.
    pub volume: u32,    // Trading volume.
    pub timestamp: u32, // Timestamp of the candle.
}

#[derive(Debug)]
pub struct TrueRange {
    pub symbol: String, // Symbol of the asset.
    pub percentile_range: f64,
    pub ema_range: f64,
    pub timestamp: u32,
}

#[derive(Debug)]
pub struct MaxDropPeriod {
    pub symbol: String,
    pub period: usize,
    pub percentile_drop: f64,
    pub ema_drop: f64,
    pub timestamp: u32,
}

#[derive(Debug)]
pub struct PricePercentile {
    pub symbol: String,
    pub percentile: f64,
    pub timestamp: u32,
}

/// Earnings calendar entry from Tiger corporate_action API.
#[derive(Debug, Clone)]
pub struct EarningsCalendarEntry {
    pub symbol: String,
    pub report_date: String,
    pub report_time: String,
    pub expected_eps: Option<f64>,
}

/// Earnings info for a symbol, derived from the calendar.
#[derive(Debug, Clone)]
pub struct EarningsInfo {
    pub report_date: String,
    pub report_time: String,
    pub expected_eps: Option<f64>,
}

/// Stores trend data for a symbol (price relative to EMAs).
#[derive(Debug, Clone)]
pub struct TrendData {
    pub trend_ratio_short: f64, // price / EMA20
    pub trend_ratio_long: f64,  // price / EMA50
}

/// Stores the 20-day price range for a symbol (for strike percentile calculation).
#[derive(Debug, Clone)]
pub struct PutPriceRange {
    pub min: f64,
    pub max: f64,
}

/// Calculates the percentile of a strike price within a [min, max] range.
/// Returns 0.5 if min == max.
pub fn calculate_strike_percentile(strike: f64, min: f64, max: f64) -> f64 {
    if max == min {
        return 0.5;
    }
    (strike - min) / (max - min)
}

/// Calculates the trend factor for strike tightening.
/// Returns a value in [0.75, 1.0] — never widens strikes.
/// When trend is strong (ratio > 1.0), reduces max_drop by up to TREND_TIGHTEN_CAP.
pub fn calculate_trend_factor(trend_ratio_short: f64) -> f64 {
    if trend_ratio_short <= 1.0 {
        return 1.0; // No tightening when not above EMA
    }
    let reduction = (trend_ratio_short - 1.0) * constants::TREND_TIGHTEN_MULTIPLIER;
    let capped_reduction = reduction.min(constants::TREND_TIGHTEN_CAP);
    1.0 - capped_reduction
}

/// Calculates a composite score [0, 1] for a put option.
/// Returns None if the option fails any pre-filter.
///
/// Pre-filters:
///   - rate_of_return in [MIN_RATE_OF_RETURN, MAX_RATE_OF_RETURN]
///   - sharpe > 0
///   - strike_percentile <= MAX_STRIKE_PERCENTILE
///   - trend_ratio_short >= regime.trend_threshold
///   - trend_ratio_long >= regime.trend_threshold
///
/// Score = weight_sharpe * sharpe_norm + weight_safety * safety_norm + weight_return * return_norm + weight_trend * trend_norm
pub fn calculate_put_score(
    sharpe: f64,
    strike_percentile: f64,
    rate_of_return: f64,
    trend_ratio_short: f64,
    trend_ratio_long: f64,
    regime: &crate::regime::MarketRegime,
) -> Option<f64> {
    // Pre-filters
    if rate_of_return < constants::MIN_RATE_OF_RETURN || rate_of_return > constants::MAX_RATE_OF_RETURN {
        return None;
    }
    if sharpe <= 0.0 {
        return None;
    }
    if strike_percentile > constants::MAX_STRIKE_PERCENTILE {
        return None;
    }
    // Trend hard filter — use regime's dynamic threshold
    if trend_ratio_short < regime.trend_threshold {
        return None;
    }
    if trend_ratio_long < regime.trend_threshold {
        return None;
    }

    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let safety_norm = 1.0 - strike_percentile.max(0.0);
    let return_norm = (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);
    // Trend norm: reward stocks further above their EMA
    let trend_norm = ((trend_ratio_short - regime.trend_threshold) / 0.10).clamp(0.0, 1.0);

    Some(
        regime.weight_sharpe * sharpe_norm
            + regime.weight_safety * safety_norm
            + regime.weight_return * return_norm
            + regime.weight_trend * trend_norm,
    )
}

/// Returns a momentum flag based on price percentile.
pub fn momentum_flag(price_percentile: f64) -> &'static str {
    if price_percentile > constants::MOMENTUM_EXTENDED_THRESHOLD { "EXTENDED" }
    else if price_percentile > constants::MOMENTUM_HIGH_THRESHOLD { "HIGH" }
    else { "NORMAL" }
}

/// Represents the side of an option (call or put).
#[derive(Debug, Serialize)]
pub enum OptionChainSide {
    Call,
    Put,
}

impl From<&OptionChainSide> for String {
    fn from(value: &OptionChainSide) -> Self {
        match value {
            OptionChainSide::Call => "call".to_string(),
            OptionChainSide::Put => "put".to_string(),
        }
    }
}

impl ToSql for OptionChainSide {
    fn to_sql(&self) -> rusqlite::Result<ToSqlOutput<'_>> {
        match self {
            OptionChainSide::Call => Ok(ToSqlOutput::Owned(rusqlite::types::Value::Text(
                "call".to_string(),
            ))),
            OptionChainSide::Put => Ok(ToSqlOutput::Owned(rusqlite::types::Value::Text(
                "put".to_string(),
            ))),
        }
    }
}

impl FromSql for OptionChainSide {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        match value {
            ValueRef::Text(s) => match std::str::from_utf8(s) {
                Ok("call") => Ok(OptionChainSide::Call),
                Ok("put") => Ok(OptionChainSide::Put),
                _ => Err(FromSqlError::InvalidType),
            },
            _ => Err(FromSqlError::InvalidType),
        }
    }
}

/// Structure representing option expiration data.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptionExpiration {
    pub symbol: String,
    pub count: u32,
    pub dates: Vec<String>,
    pub timestamps: Vec<u64>,
}

/// Structure representing a candle for an option strike.
#[derive(Debug, Serialize)]
pub struct OptionStrikeCandle {
    pub underlying: String,    // Underlying asset symbol.
    pub strike: f64,           // Strike price.
    pub underlying_price: f64, // Underlying asset price.
    pub side: OptionChainSide, // Call or Put.
    pub bid: f64,              // Bid price.
    pub mid: f64,              // Mid price.
    pub ask: f64,              // Ask price.
    pub bid_size: u32,         // Bid size.
    pub ask_size: u32,         // Ask size.
    pub last: f64,             // Last traded price.
    pub expiration: String,    // Expiration date and time.
    pub updated: String,       // Last updated date and time.
    pub dte: u32,              // Days to expiration.
    pub volume: u32,           // Volume.
    pub open_interest: u32,    // Open interest.
    pub rate_of_return: f64,   // Rate of return.
    pub strike_from: f64,      // Strike price from.
    pub strike_to: f64,        // Strike price to.
}

/// Top pick from scored option chains, used for Telegram caption.
pub struct TopPick {
    pub rank: usize,
    pub underlying: String,
    pub strike: f64,
    pub bid: f64,
    pub ask: f64,
    pub rate_of_return: f64,
    pub score: f64,
    pub sharpe: f64,
    pub price_percentile: Option<f64>,
    pub earnings: Option<EarningsInfo>,
    pub trend_short: Option<f64>,
    pub trend_long: Option<f64>,
}

pub fn option_chain_to_csv_vec(
    all_chains: &[OptionStrikeCandle],
    sharpe_ratios: &HashMap<String, f64>,
    price_ranges: &HashMap<String, PutPriceRange>,
    price_percentiles: &HashMap<String, f64>,
    earnings_map: &HashMap<String, EarningsInfo>,
    trend_data: &HashMap<String, (f64, f64)>,
    regime: &crate::regime::MarketRegime,
) -> Result<(Vec<u8>, Vec<TopPick>)> {
    let buf = BufWriter::new(Vec::new());
    let mut writer = Writer::from_writer(buf);

    // Write header row
    writer
        .write_record([
            "underlying",
            "strike",
            "underlying_price",
            "side",
            "bid",
            "mid",
            "ask",
            "bid_size",
            "ask_size",
            "expiration",
            "volume",
            "open_interest",
            "rate_of_return",
            "strike_from",
            "strike_to",
            "sharpe_ratio",
            "strike_percentile",
            "score",
            "price_percentile",
            "earnings_before_expiry",
            "trend_short",
            "trend_long",
        ])
        .map_err(QuotesError::CsvError)?;

    // Write the data rows.
    for chain in all_chains {
        let sharpe_ratio = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
        let price_percentile = price_percentiles.get(&chain.underlying).copied();

        let (strike_percentile_str, score_str) = match price_ranges.get(&chain.underlying) {
            Some(range) => {
                let sp = calculate_strike_percentile(chain.strike, range.min, range.max);
                let (ts, tl) = trend_data.get(&chain.underlying).copied().unwrap_or((1.0, 1.0));
                let score = calculate_put_score(sharpe_ratio, sp, chain.rate_of_return, ts, tl, regime);
                let sp_str = format!("{:.3}", sp);
                let score_str = score.map(|s| format!("{:.3}", s)).unwrap_or_default();
                (sp_str, score_str)
            }
            None => (String::new(), String::new()),
        };

        let momentum = price_percentile.map(|p| format!("{:.0}%", p * 100.0)).unwrap_or_default();

        let earnings_str = match earnings_map.get(&chain.underlying) {
            Some(info) => {
                let time_label = match info.report_time.as_str() {
                    "盘前" | "BMO" | "before_open" => "before_open",
                    "盘后" | "AMC" | "after_close" => "after_close",
                    _ => &info.report_time,
                };
                format!("{} ({})", info.report_date, time_label)
            }
            None => String::new(),
        };

        let (trend_short_str, trend_long_str) = match trend_data.get(&chain.underlying) {
            Some((short, long)) => (format!("{:.3}", short), format!("{:.3}", long)),
            None => (String::new(), String::new()),
        };

        writer
            .write_record([
                &chain.underlying,
                &chain.strike.to_string(),
                &chain.underlying_price.to_string(),
                &format!("{:?}", chain.side),
                &chain.bid.to_string(),
                &chain.mid.to_string(),
                &chain.ask.to_string(),
                &chain.bid_size.to_string(),
                &chain.ask_size.to_string(),
                &chain.expiration,
                &chain.volume.to_string(),
                &chain.open_interest.to_string(),
                &chain.rate_of_return.to_string(),
                &chain.strike_from.to_string(),
                &chain.strike_to.to_string(),
                &format!("{:.3}", sharpe_ratio),
                &strike_percentile_str,
                &score_str,
                &momentum,
                &earnings_str,
                &trend_short_str,
                &trend_long_str,
            ])
            .map_err(QuotesError::CsvError)?;
    }

    let bytes = writer.into_inner().unwrap().into_inner().unwrap();

    // Select top 3 scored chains for TopPicks
    let mut scored: Vec<(usize, f64)> = all_chains
        .iter()
        .enumerate()
        .filter_map(|(i, chain)| {
            let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
            let range = price_ranges.get(&chain.underlying)?;
            let sp = calculate_strike_percentile(chain.strike, range.min, range.max);
            let (ts, tl) = trend_data.get(&chain.underlying).copied().unwrap_or((1.0, 1.0));
            let score = calculate_put_score(sharpe, sp, chain.rate_of_return, ts, tl, regime)?;
            Some((i, score))
        })
        .collect();
    scored.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    let mut seen = HashSet::new();
    let top_picks: Vec<TopPick> = scored
        .iter()
        .filter(|(idx, _)| seen.insert(all_chains[*idx].underlying.clone()))
        .take(3)
        .enumerate()
        .map(|(rank, (idx, score))| {
            let chain = &all_chains[*idx];
            let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
            let pp = price_percentiles.get(&chain.underlying).copied();
            let ts = trend_data.get(&chain.underlying).map(|(s, _)| *s);
            let tl = trend_data.get(&chain.underlying).map(|(_, l)| *l);
            TopPick {
                rank: rank + 1,
                underlying: chain.underlying.clone(),
                strike: chain.strike,
                bid: chain.bid,
                ask: chain.ask,
                rate_of_return: chain.rate_of_return,
                score: *score,
                sharpe,
                price_percentile: pp,
                earnings: earnings_map.get(&chain.underlying).cloned(),
                trend_short: ts,
                trend_long: tl,
            }
        })
        .collect();

    Ok((bytes, top_picks))
}

pub type Result<T> = std::result::Result<T, QuotesError>;

#[derive(Debug)]
pub struct SharpeConfig {
    pub risk_free_rate: Option<f64>, // None = use DEFAULT_RISK_FREE_RATE
    pub min_candles: usize,          // From constants::SHARPE_MIN_CANDLES
}

#[derive(Debug)]
pub enum QuotesError {
    FileNotFound(String),
    CouldNotOpenFile(io::Error),
    CouldNotReadLine,
    EmptySymbolFile(String),
    DatabaseError(rusqlite::Error),
    HttpError(client::RequestError),
    NotEnoughCandlesForStatistics(String),
    CsvError(csv::Error),
    TelegramError(APIResponseError),
    EnvVarNotSet(VarError),
    SharpeCalculationError(String),
    InsufficientReturnData(usize),
    InvalidRiskFreeRate(String),
}

impl Display for QuotesError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl Error for QuotesError {}

impl From<VarError> for QuotesError {
    fn from(value: VarError) -> Self {
        Self::EnvVarNotSet(value)
    }
}

impl From<io::Error> for QuotesError {
    fn from(value: io::Error) -> Self {
        Self::CouldNotOpenFile(value)
    }
}

impl From<rusqlite::Error> for QuotesError {
    fn from(value: rusqlite::Error) -> Self {
        Self::DatabaseError(value)
    }
}

impl From<client::RequestError> for QuotesError {
    fn from(value: client::RequestError) -> Self {
        Self::HttpError(value)
    }
}

impl From<APIResponseError> for QuotesError {
    fn from(value: APIResponseError) -> Self {
        Self::TelegramError(value)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::regime::MarketRegime;

    /// Bull regime for backward-compatible test assertions
    fn bull_regime() -> MarketRegime {
        MarketRegime::from_spy_trend(1.05)
    }

    #[test]
    fn test_strike_percentile_at_min() {
        assert!((calculate_strike_percentile(100.0, 100.0, 200.0) - 0.0).abs() < 1e-9);
    }

    #[test]
    fn test_strike_percentile_at_max() {
        assert!((calculate_strike_percentile(200.0, 100.0, 200.0) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_strike_percentile_mid() {
        assert!((calculate_strike_percentile(150.0, 100.0, 200.0) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn test_strike_percentile_below_min() {
        let result = calculate_strike_percentile(80.0, 100.0, 200.0);
        assert!(result < 0.0);
    }

    #[test]
    fn test_strike_percentile_above_max() {
        let result = calculate_strike_percentile(250.0, 100.0, 200.0);
        assert!(result > 1.0);
    }

    #[test]
    fn test_strike_percentile_equal_range() {
        assert!((calculate_strike_percentile(100.0, 100.0, 100.0) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn test_put_score_good_option() {
        // sharpe=1.8, percentile=0.10, return=0.32, trend_short=1.05, trend_long=1.05
        // sharpe_norm=0.9, safety_norm=0.9, return_norm=0.85, trend_norm=(0.07/0.10)=0.7
        // score = 0.20*0.9 + 0.30*0.9 + 0.20*0.85 + 0.30*0.7 = 0.18 + 0.27 + 0.17 + 0.21 = 0.83
        let score = calculate_put_score(1.8, 0.10, 0.32, 1.05, 1.05, &bull_regime()).unwrap();
        assert!((score - 0.83).abs() < 0.01);
    }

    #[test]
    fn test_put_score_filtered_low_return() {
        assert!(calculate_put_score(1.5, 0.10, 0.20, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_filtered_high_return() {
        assert!(calculate_put_score(1.5, 0.10, 0.70, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_filtered_negative_sharpe() {
        assert!(calculate_put_score(-0.5, 0.10, 0.35, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_filtered_zero_sharpe() {
        assert!(calculate_put_score(0.0, 0.10, 0.35, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_filtered_high_percentile() {
        assert!(calculate_put_score(1.5, 0.61, 0.35, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_boundary_return_low() {
        assert!(calculate_put_score(1.0, 0.10, 0.25, 1.05, 1.05, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_boundary_return_high() {
        assert!(calculate_put_score(1.0, 0.10, 0.65, 1.05, 1.05, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_boundary_percentile() {
        assert!(calculate_put_score(1.0, 0.60, 0.35, 1.05, 1.05, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_just_below_return_floor() {
        assert!(calculate_put_score(1.0, 0.10, 0.24, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_at_return_floor() {
        assert!(calculate_put_score(1.0, 0.10, 0.25, 1.05, 1.05, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_at_strike_percentile_boundary() {
        assert!(calculate_put_score(1.0, 0.60, 0.35, 1.05, 1.05, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_above_strike_percentile_boundary() {
        assert!(calculate_put_score(1.0, 0.61, 0.35, 1.05, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_momentum_flag_normal() {
        assert_eq!(momentum_flag(0.50), "NORMAL");
    }

    #[test]
    fn test_momentum_flag_normal_boundary() {
        assert_eq!(momentum_flag(0.80), "NORMAL");
    }

    #[test]
    fn test_momentum_flag_high() {
        assert_eq!(momentum_flag(0.85), "HIGH");
    }

    #[test]
    fn test_momentum_flag_high_boundary() {
        assert_eq!(momentum_flag(0.90), "HIGH");
    }

    #[test]
    fn test_momentum_flag_extended() {
        assert_eq!(momentum_flag(0.95), "EXTENDED");
    }

    #[test]
    fn test_momentum_flag_extended_at_boundary() {
        assert_eq!(momentum_flag(0.91), "EXTENDED");
    }

    #[test]
    fn test_put_score_clamps_negative_percentile() {
        // strike below 20-day min -> negative percentile -> should clamp to 0.0
        // sharpe_norm=1.0, safety_norm=1.0, return_norm=1.0, trend_norm=0.7
        // score = 0.20 + 0.30 + 0.20 + 0.21 = 0.91
        let score = calculate_put_score(2.0, -0.10, 0.35, 1.05, 1.05, &bull_regime()).unwrap();
        assert!((score - 0.91).abs() < 0.01);
    }

    #[test]
    fn test_put_score_high_sharpe_clamps() {
        // sharpe > 2.0 should clamp sharpe_norm to 1.0
        // sharpe_norm=1.0, safety_norm=1.0, return_norm=1.0, trend_norm=0.7
        // score = 0.91
        let score = calculate_put_score(5.0, 0.0, 0.35, 1.05, 1.05, &bull_regime()).unwrap();
        assert!((score - 0.91).abs() < 0.01);
    }

    #[test]
    fn test_put_score_peak_return() {
        // return exactly at 0.35 -> return_norm = 1.0
        // sharpe=2.0 -> sharpe_norm=1.0, percentile=0.0 -> safety_norm=1.0
        // trend_short=1.05 -> trend_norm=0.7
        // score = 0.20 + 0.30 + 0.20 + 0.21 = 0.91
        let score = calculate_put_score(2.0, 0.0, 0.35, 1.05, 1.05, &bull_regime()).unwrap();
        assert!((score - 0.91).abs() < 0.01);
    }

    fn make_chain(underlying: &str, strike: f64, rate_of_return: f64) -> OptionStrikeCandle {
        OptionStrikeCandle {
            underlying: underlying.to_string(),
            strike,
            underlying_price: 100.0,
            side: OptionChainSide::Put,
            bid: 1.0,
            mid: 1.5,
            ask: 2.0,
            last: 1.5,
            bid_size: 10,
            ask_size: 10,
            expiration: "2026-06-19".to_string(),
            updated: "2026-05-13".to_string(),
            dte: 30,
            volume: 100,
            open_interest: 200,
            rate_of_return,
            strike_from: 80.0,
            strike_to: 120.0,
        }
    }

    #[test]
    fn test_top_picks_unique_underlyings() {
        // AAPL appears 3 times with high scores, TSLA and NVDA once each
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("AAPL", 85.0, 0.40),
            make_chain("AAPL", 80.0, 0.30),
            make_chain("TSLA", 200.0, 0.30),
            make_chain("NVDA", 130.0, 0.28),
        ];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);
        sharpe.insert("TSLA".to_string(), 1.5);
        sharpe.insert("NVDA".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        ranges.insert("TSLA".to_string(), PutPriceRange { min: 150.0, max: 250.0 });
        ranges.insert("NVDA".to_string(), PutPriceRange { min: 100.0, max: 160.0 });

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bull_regime(),
        ).unwrap();

        let underlyings: Vec<&str> = top_picks.iter().map(|p| p.underlying.as_str()).collect();
        let mut unique = underlyings.clone();
        unique.sort();
        unique.dedup();
        assert_eq!(underlyings.len(), unique.len(), "top picks should have unique underlyings but got: {:?}", underlyings);
        assert_eq!(top_picks.len(), 3, "should have exactly 3 picks");
        assert_eq!(top_picks[0].underlying, "AAPL", "first pick should be highest scoring");
    }

    #[test]
    fn test_top_picks_fewer_than_three_unique() {
        // Only AAPL chains — should return 1 pick, not 3
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("AAPL", 85.0, 0.40),
        ];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bull_regime(),
        ).unwrap();

        assert_eq!(top_picks.len(), 1, "should return only 1 pick for 1 unique underlying");
    }

    #[test]
    fn test_put_score_filtered_trend_short_below_threshold() {
        assert!(calculate_put_score(1.5, 0.10, 0.35, 0.97, 1.05, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_filtered_trend_long_below_threshold() {
        assert!(calculate_put_score(1.5, 0.10, 0.35, 1.05, 0.97, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_trend_at_threshold() {
        assert!(calculate_put_score(1.0, 0.10, 0.35, 0.98, 0.98, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_trend_just_below_threshold() {
        assert!(calculate_put_score(1.0, 0.10, 0.35, 0.979, 0.98, &bull_regime()).is_none());
        assert!(calculate_put_score(1.0, 0.10, 0.35, 0.98, 0.979, &bull_regime()).is_none());
    }

    #[test]
    fn test_trend_factor_no_tightening_when_flat() {
        let factor = calculate_trend_factor(1.0);
        assert!((factor - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_mild_tightening() {
        // trend_ratio = 1.03 → reduction = 0.03 * 4.0 = 0.12 → factor = 0.88
        let factor = calculate_trend_factor(1.03);
        assert!((factor - 0.88).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_capped() {
        // trend_ratio = 1.20 → reduction = 0.80 → capped at 0.25 → factor = 0.75
        let factor = calculate_trend_factor(1.20);
        assert!((factor - 0.75).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_below_one() {
        // trend_ratio < 1.0 → factor = 1.0 (never widen)
        let factor = calculate_trend_factor(0.95);
        assert!((factor - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_at_cap_boundary() {
        // reduction = (1.0625 - 1.0) * 4.0 = 0.25 → exactly at cap
        let factor = calculate_trend_factor(1.0625);
        assert!((factor - 0.75).abs() < 1e-9);
    }

    #[test]
    fn test_top_picks_trend_filter_blocks_weak_stock() {
        // AAPL has strong trend → passes filter and gets scored
        // MSFT has weak trend → blocked by filter, gets no score
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("MSFT", 380.0, 0.40),
        ];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);
        sharpe.insert("MSFT".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        ranges.insert("MSFT".to_string(), PutPriceRange { min: 350.0, max: 420.0 });

        let percentiles = HashMap::new();
        let earnings = HashMap::new();

        // MSFT has weak trend (below 0.98) → should be filtered out
        let mut trend_data = HashMap::new();
        trend_data.insert("AAPL".to_string(), (1.05, 1.06));
        trend_data.insert("MSFT".to_string(), (0.95, 0.94));

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bull_regime(),
        ).unwrap();

        assert_eq!(top_picks.len(), 1, "only AAPL should pass trend filter");
        assert_eq!(top_picks[0].underlying, "AAPL");
        assert_eq!(top_picks[0].trend_short, Some(1.05));
        assert_eq!(top_picks[0].trend_long, Some(1.06));
    }

    #[test]
    fn test_top_picks_no_trend_data_still_scored() {
        // When no trend data exists, stocks default to (1.0, 1.0) → passes filter
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
        ];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new(); // empty — no trend data

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bull_regime(),
        ).unwrap();

        assert_eq!(top_picks.len(), 1, "should still score without trend data");
        assert_eq!(top_picks[0].trend_short, None);
    }

    #[test]
    fn test_put_score_bear_market_loosens_filter() {
        // In bear market (threshold 0.92), a stock at trend 0.94 passes
        // Old threshold (0.98) would block this
        let regime = MarketRegime::from_spy_trend(0.92); // full bear
        assert!(calculate_put_score(1.5, 0.10, 0.35, 0.94, 0.94, &regime).is_some());
    }

    #[test]
    fn test_put_score_bear_market_still_blocks_freefall() {
        // Even in bear, stocks below threshold (0.92) are blocked
        let regime = MarketRegime::from_spy_trend(0.92);
        assert!(calculate_put_score(1.5, 0.10, 0.35, 0.90, 0.90, &regime).is_none());
    }

    #[test]
    fn test_put_score_bear_shifts_weights() {
        // Same inputs but different regime → different score
        let bull = MarketRegime::from_spy_trend(1.05);
        let bear = MarketRegime::from_spy_trend(0.92);

        let bull_score = calculate_put_score(1.5, 0.10, 0.35, 1.05, 1.05, &bull).unwrap();
        let bear_score = calculate_put_score(1.5, 0.10, 0.35, 1.05, 1.05, &bear).unwrap();

        // Bear regime shifts weight from trend to safety
        // With these inputs: safety_norm=0.9, sharpe_norm=0.75
        // Bull: trend_norm=(1.05-0.98)/0.10=0.7, return_norm=1.0
        // Bear: trend_norm=(1.05-0.92)/0.10=1.0(clamped), return_norm=1.0
        assert!(bear_score > bull_score,
            "bear score ({}) should be > bull score ({})", bear_score, bull_score);
    }

    #[test]
    fn test_regime_integration_bear_allows_more_stocks() {
        // Simulate a bear market: 5 stocks, only 1 has trend > 0.98
        // Under bull regime, only 1 passes → 1 top pick
        // Under bear regime, more pass → more top picks
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),   // strong trend
            make_chain("MSFT", 350.0, 0.35),   // moderate trend (0.95)
            make_chain("TSLA", 200.0, 0.35),   // weak trend (0.93)
            make_chain("NVDA", 120.0, 0.35),   // very weak (0.90)
            make_chain("GOOG", 150.0, 0.35),   // freefall (0.85)
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAPL", "MSFT", "TSLA", "NVDA", "GOOG"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        ranges.insert("MSFT".to_string(), PutPriceRange { min: 300.0, max: 400.0 });
        ranges.insert("TSLA".to_string(), PutPriceRange { min: 150.0, max: 250.0 });
        ranges.insert("NVDA".to_string(), PutPriceRange { min: 100.0, max: 160.0 });
        ranges.insert("GOOG".to_string(), PutPriceRange { min: 130.0, max: 180.0 });

        let mut trend_data = HashMap::new();
        trend_data.insert("AAPL".to_string(), (1.05, 1.06));
        trend_data.insert("MSFT".to_string(), (0.95, 0.96));
        trend_data.insert("TSLA".to_string(), (0.93, 0.94));
        trend_data.insert("NVDA".to_string(), (0.90, 0.91));
        trend_data.insert("GOOG".to_string(), (0.85, 0.86));

        let percentiles = HashMap::new();
        let earnings = HashMap::new();

        // Bull regime: only AAPL passes trend filter (threshold=0.98)
        let bull = MarketRegime::from_spy_trend(1.05);
        let (_csv_bull, picks_bull) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bull,
        ).unwrap();
        assert_eq!(picks_bull.len(), 1, "bull: only AAPL should pass");
        assert_eq!(picks_bull[0].underlying, "AAPL");

        // Bear regime: AAPL, MSFT, TSLA pass (threshold=0.92), NVDA at 0.90 also passes
        let bear = MarketRegime::from_spy_trend(0.92);
        let (_csv_bear, picks_bear) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data, &bear,
        ).unwrap();
        assert!(picks_bear.len() >= 3, "bear: at least AAPL, MSFT, TSLA should pass, got {}", picks_bear.len());
        assert!(picks_bear.len() <= 4, "bear: GOOG (0.85) should still be blocked");
    }
}
