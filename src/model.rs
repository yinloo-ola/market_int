use std::{
    cmp::Ordering,
    collections::{HashMap, HashSet},
    env::VarError,
    error::Error,
    fmt::Display,
    io::{self, BufWriter},
};

use chrono::NaiveDate;
use chrono_tz::America::New_York;
use csv::Writer;
use rusqlite::{
    ToSql,
    types::{FromSql, FromSqlError, FromSqlResult, ToSqlOutput, ValueRef},
};
use serde::{Deserialize, Serialize};
use telegram_bot_api::bot::APIResponseError;

use crate::constants;
use crate::http::client;
use crate::sectors::{UNKNOWN_SECTOR, sector_of};

/// Represents the market status.
#[derive(Debug)]
pub enum MarketStatus {
    Open,
    Closed,
    Null,
}

/// Structure representing a candle (OHLCV data).
#[derive(Debug, Clone)]
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

/// Calculates safety as the strike's position within the max_drop band
/// `[strike_from, strike_to]` — the strike range the filter computed from
/// `ema_drop` (typical) and `percentile_drop` (stress), scaled by DTE.
///
/// Returns 1.0 at the deep end (`strike_from` — rarely breached), 0.0 at the
/// shallow end (`strike_to` — frequently breached), and 0.5 for a degenerate
/// (zero-width) band. Values outside the band are clamped to [0, 1].
pub fn calculate_max_drop_safety(strike: f64, strike_from: f64, strike_to: f64) -> f64 {
    let band = strike_to - strike_from;
    if band.abs() < 1e-9 {
        return 0.5;
    }
    ((strike_to - strike) / band).clamp(0.0, 1.0)
}

/// Calculates the trend factor for strike tightening.
/// Returns a value in [0.85, 1.0] — never widens strikes.
///
/// Uses an inverted-V shape:
///   - Below 1.0: no tightening (1.0)
///   - 1.0 to TREND_TIGHTEN_PEAK: tightening ramps up linearly
///   - Above TREND_TIGHTEN_PEAK: easing back — sudden surges risk pullback
///
/// At the peak (~1.05), max tightening is TREND_TIGHTEN_CAP (floor = 0.90).
/// Beyond the peak, easing linearly reduces tightening at TREND_EASE_BACK rate,
/// bottoming out at 0.85 for very extreme surges.
pub fn calculate_trend_factor(trend_ratio_short: f64) -> f64 {
    if trend_ratio_short <= 1.0 {
        return 1.0; // No tightening when not above EMA
    }

    let cap = constants::TREND_TIGHTEN_CAP;
    let peak = constants::TREND_TIGHTEN_PEAK;

    if trend_ratio_short <= peak {
        // Ramp up tightening proportionally
        let reduction = (trend_ratio_short - 1.0) * constants::TREND_TIGHTEN_MULTIPLIER;
        1.0 - reduction.min(cap)
    } else {
        // Ease back: surge stocks are pullback risks
        let peak_reduction = ((peak - 1.0) * constants::TREND_TIGHTEN_MULTIPLIER).min(cap);
        let excess = trend_ratio_short - peak;
        let reduction = (peak_reduction - excess * constants::TREND_EASE_BACK).max(0.0);
        1.0 - reduction
    }
}

/// Calculates a composite score [0, 1] for a put option.
/// Returns None if the option fails any pre-filter.
///
/// `safety` is the strike's position within the max_drop band
/// `[strike_from, strike_to]` (see `calculate_max_drop_safety`): 1.0 at the
/// deep / rarely-breached end, 0.0 at the shallow / frequently-breached end.
///
/// Pre-filters:
///   - rate_of_return >= MIN_RATE_OF_RETURN  (no upper cap — return is a
///     soft-capped reward via `return_norm`; danger is expressed via `safety`)
///   - sharpe > 0
///
/// Score = weight_sharpe * sharpe_norm + weight_safety * safety + weight_return * return_norm
pub fn calculate_put_score(
    sharpe: f64,
    safety: f64,
    rate_of_return: f64,
    _regime: &crate::regime::MarketRegime,
) -> Option<f64> {
    // Pre-filters: keep the min-return floor and the positive-Sharpe requirement.
    // The hard rate-of-return cap and the strike_percentile cap were removed —
    // danger is now expressed via the max_drop band position (`safety`).
    if rate_of_return < constants::MIN_RATE_OF_RETURN {
        return None;
    }
    if sharpe <= 0.0 {
        return None;
    }

    let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
    let safety_norm = safety.clamp(0.0, 1.0);

    // Soft-cap: return reward ramps linearly to IDEAL_RETURN, then flattens
    // (no further credit above it, but no exclusion either).
    let return_norm = (rate_of_return / constants::IDEAL_RETURN).min(1.0);

    let weight_sharpe = 0.20;
    let weight_safety = 0.40;
    let weight_return = 0.40;

    Some(
        weight_sharpe * sharpe_norm
            + weight_safety * safety_norm
            + weight_return * return_norm,
    )
}

/// Returns true if the symbol's earnings `report_date` falls inside the option's
/// lifetime `[today, expiry]` (inclusive on both ends, date-level comparison).
///
/// Both `report_date` (Tiger `reportDate`) and `expiry` (the chain's
/// `expiration`) are `YYYY-MM-DD` strings. To be robust against a fuller
/// timestamp, only the first 10 characters are parsed. If either string fails
/// to parse, returns `false` — i.e. earnings risk is *not* applied (safe default
/// that avoids dropping/discounting chains on a malformed date).
pub fn earnings_in_window(report_date: &str, expiry: &str, today: NaiveDate) -> bool {
    let parse = |s: &str| -> Option<NaiveDate> {
        NaiveDate::parse_from_str(s.get(..10)?, "%Y-%m-%d").ok()
    };
    match (parse(report_date), parse(expiry)) {
        (Some(report), Some(exp)) => today <= report && report <= exp,
        _ => false,
    }
}

/// Scores a put chain entry, applying the earnings rule on top of
/// [`calculate_put_score`].
///
/// When `earnings_in_window` is true (the symbol reports earnings between today
/// and expiry), post-earnings gap risk is not reflected in the historical
/// `max_drop` band, so:
///   - strikes in the **upper half** of the band (`strike > midpoint`) — the
///     shallow, near-money puts with no gap buffer — are excluded (`None`);
///   - the surviving (lower / deeper) strikes are still scored, but their
///     `safety` is discounted by `EARNINGS_SAFETY_MULTIPLIER` to reflect that
///     the band no longer reliably measures breach probability.
///
/// When `earnings_in_window` is false this is a pure passthrough to
/// `calculate_put_score` on the band safety.
pub fn calculate_put_chain_score(
    sharpe: f64,
    strike: f64,
    strike_from: f64,
    strike_to: f64,
    rate_of_return: f64,
    regime: &crate::regime::MarketRegime,
    earnings_in_window: bool,
) -> Option<f64> {
    if earnings_in_window {
        let midpoint = (strike_from + strike_to) / 2.0;
        if strike > midpoint {
            return None;
        }
    }
    let safety = calculate_max_drop_safety(strike, strike_from, strike_to);
    let safety = if earnings_in_window {
        safety * constants::EARNINGS_SAFETY_MULTIPLIER
    } else {
        safety
    };
    calculate_put_score(sharpe, safety, rate_of_return, regime)
}

/// Returns a momentum flag based on price percentile.
pub fn momentum_flag(price_percentile: f64) -> &'static str {
    if price_percentile > constants::MOMENTUM_EXTENDED_THRESHOLD {
        "EXTENDED"
    } else if price_percentile > constants::MOMENTUM_HIGH_THRESHOLD {
        "HIGH"
    } else {
        "NORMAL"
    }
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
    pub sector: String,
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
    sectors: &HashMap<String, String>,
    regime: &crate::regime::MarketRegime,
) -> Result<(Vec<u8>, Vec<TopPick>)> {
    let buf = BufWriter::new(Vec::new());
    let mut writer = Writer::from_writer(buf);

    // Write header row
    writer
        .write_record([
            "underlying",
            "sector",
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

    // Today for the earnings-in-window check. Use New York time to match the
    // earnings-calendar fetch (fetch_earnings_map queries in NY); `Local` is UTC
    // on the Cloud Run deployment and would drift ±1 day at the boundary. [T-003]
    let today = chrono::Local::now().with_timezone(&New_York).date_naive();
    // Earnings-in-window is a per-symbol flag (expiration is uniform across a
    // single retrieval), so compute it once per symbol and reuse — avoids
    // re-parsing the same date strings for every chain of a symbol. [O-001]
    let mut earnings_in_window_cache: HashMap<String, bool> = HashMap::new();
    for chain in all_chains {
        earnings_in_window_cache
            .entry(chain.underlying.clone())
            .or_insert_with(|| match earnings_map.get(&chain.underlying) {
                Some(info) => earnings_in_window(&info.report_date, &chain.expiration, today),
                None => false,
            });
    }
    let in_earnings_window = |sym: &str| earnings_in_window_cache.get(sym).copied().unwrap_or(false);

    // Write the data rows.
    for chain in all_chains {
        let sharpe_ratio = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
        let price_percentile = price_percentiles.get(&chain.underlying).copied();

        // Band safety + the earnings rule live inside `calculate_put_chain_score`:
        // it drops upper-half strikes and discounts `safety` when the symbol
        // reports earnings inside [today, expiry]. NOTE (T-002): scoring is no
        // longer gated on a 20-day price_range, so every chain is eligible for
        // top-3 even when its 20-day range is missing (then `strike_percentile`
        // below is blank) — band safety does not need the 20-day range.
        let score = calculate_put_chain_score(
            sharpe_ratio,
            chain.strike,
            chain.strike_from,
            chain.strike_to,
            chain.rate_of_return,
            regime,
            in_earnings_window(&chain.underlying),
        );
        let score_str = score.map(|s| format!("{:.3}", s)).unwrap_or_default();
        let strike_percentile_str = match price_ranges.get(&chain.underlying) {
            Some(range) => format!(
                "{:.3}",
                calculate_strike_percentile(chain.strike, range.min, range.max)
            ),
            None => String::new(),
        };

        let momentum = price_percentile
            .map(|p| format!("{:.0}%", p * 100.0))
            .unwrap_or_default();

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

        let sector_str = sector_of(sectors, &chain.underlying).to_string();

        writer
            .write_record([
                &chain.underlying,
                &sector_str,
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
            let score = calculate_put_chain_score(
                sharpe,
                chain.strike,
                chain.strike_from,
                chain.strike_to,
                chain.rate_of_return,
                regime,
                in_earnings_window(&chain.underlying),
            )?;
            Some((i, score))
        })
        .collect();
    scored.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(Ordering::Equal));

    let mut seen = HashSet::new();
    let mut seen_sectors = HashSet::new();
    let mut top_picks: Vec<TopPick> = Vec::new();
    let mut rank = 0;

    for (idx, score) in &scored {
        if rank >= 3 {
            break;
        }
        let chain = &all_chains[*idx];
        if seen.contains(&chain.underlying) {
            continue;
        }
        let sector = sector_of(sectors, &chain.underlying).to_string();
        if sector != UNKNOWN_SECTOR && seen_sectors.contains(&sector) {
            continue;
        }

        let sharpe = sharpe_ratios.get(&chain.underlying).copied().unwrap_or(0.0);
        let pp = price_percentiles.get(&chain.underlying).copied();
        let ts = trend_data.get(&chain.underlying).map(|(s, _)| *s);
        let tl = trend_data.get(&chain.underlying).map(|(_, l)| *l);

        seen.insert(chain.underlying.clone());
        if sector != UNKNOWN_SECTOR {
            seen_sectors.insert(sector.clone());
        }

        rank += 1;
        top_picks.push(TopPick {
            rank,
            underlying: chain.underlying.clone(),
            sector,
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
        });
    }

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
    fn test_max_drop_safety_deep_end() {
        // strike at strike_from (deep, rarely breached) -> 1.0
        assert!((calculate_max_drop_safety(90.0, 90.0, 100.0) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_max_drop_safety_shallow_end() {
        // strike at strike_to (shallow, frequently breached) -> 0.0
        assert!((calculate_max_drop_safety(100.0, 90.0, 100.0) - 0.0).abs() < 1e-9);
    }

    #[test]
    fn test_max_drop_safety_mid() {
        assert!((calculate_max_drop_safety(95.0, 90.0, 100.0) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn test_max_drop_safety_below_band_clamps() {
        // deeper than strike_from -> clamps to 1.0
        assert!((calculate_max_drop_safety(85.0, 90.0, 100.0) - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_max_drop_safety_above_band_clamps() {
        // shallower than strike_to -> clamps to 0.0
        assert!((calculate_max_drop_safety(105.0, 90.0, 100.0) - 0.0).abs() < 1e-9);
    }

    #[test]
    fn test_max_drop_safety_degenerate_band() {
        // zero-width band -> 0.5
        assert!((calculate_max_drop_safety(100.0, 100.0, 100.0) - 0.5).abs() < 1e-9);
    }

    #[test]
    fn test_put_score_good_option() {
        // deep/safe strike (safety=0.90), sharpe=1.8, return=0.45
        // sharpe_norm=0.9, safety_norm=0.9, return_norm=(0.45/0.80)=0.5625
        // score = 0.20*0.9 + 0.40*0.9 + 0.40*0.5625 = 0.765
        let score = calculate_put_score(1.8, 0.90, 0.45, &bull_regime()).unwrap();
        assert!((score - 0.765).abs() < 0.01);
    }

    #[test]
    fn test_put_score_filtered_low_return() {
        // MIN_RATE_OF_RETURN floor still applies
        assert!(calculate_put_score(1.5, 0.90, 0.25, &bull_regime()).is_some());
        assert!(calculate_put_score(1.5, 0.90, 0.24, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_high_return_accepted() {
        // no upper cap: high return is accepted — danger now comes from safety
        assert!(calculate_put_score(1.5, 0.90, 0.85, &bull_regime()).is_some());
        assert!(calculate_put_score(1.5, 0.90, 5.0, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_filtered_negative_sharpe() {
        assert!(calculate_put_score(-0.5, 0.90, 0.45, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_filtered_zero_sharpe() {
        assert!(calculate_put_score(0.0, 0.90, 0.45, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_boundary_return_low() {
        assert!(calculate_put_score(1.0, 0.90, 0.25, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_boundary_return_high() {
        // 0.80 == IDEAL_RETURN, accepted (soft-cap saturation point)
        assert!(calculate_put_score(1.0, 0.90, 0.80, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_just_below_return_floor() {
        assert!(calculate_put_score(1.0, 0.90, 0.24, &bull_regime()).is_none());
    }

    #[test]
    fn test_put_score_at_return_floor() {
        assert!(calculate_put_score(1.0, 0.90, 0.25, &bull_regime()).is_some());
    }

    #[test]
    fn test_put_score_safety_direction() {
        // same sharpe/return: deep strike (high safety) outscores shallow
        let shallow = calculate_put_score(1.5, 0.10, 0.45, &bull_regime()).unwrap();
        let deep = calculate_put_score(1.5, 0.90, 0.45, &bull_regime()).unwrap();
        assert!(deep > shallow);
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
    fn test_put_score_clamps_safety() {
        // safety below 0 clamps to 0.0 (shallow/risky end)
        // sharpe=2.0 -> sharpe_norm=1.0, safety_norm=0.0, return_norm=(0.35/0.80)=0.4375
        // score = 0.20*1.0 + 0.40*0.0 + 0.40*0.4375 = 0.375
        let score = calculate_put_score(2.0, -0.10, 0.35, &bull_regime()).unwrap();
        assert!((score - 0.375).abs() < 0.01);
    }

    #[test]
    fn test_put_score_high_sharpe_clamps() {
        // sharpe > 2.0 clamps sharpe_norm to 1.0; deep strike safety=1.0
        // sharpe_norm=1.0, safety_norm=1.0, return_norm=0.4375
        // score = 0.20 + 0.40 + 0.175 = 0.775
        let score = calculate_put_score(5.0, 1.0, 0.35, &bull_regime()).unwrap();
        assert!((score - 0.775).abs() < 0.01);
    }

    #[test]
    fn test_put_score_peak() {
        // deep strike (safety=1.0), sharpe=2.0 (clamped 1.0), return=0.80 (return_norm=1.0)
        // score = 0.20 + 0.40 + 0.40 = 1.00
        let score = calculate_put_score(2.0, 1.0, 0.80, &bull_regime()).unwrap();
        assert!((score - 1.00).abs() < 0.01);
    }

    #[test]
    fn test_put_score_return_soft_cap() {
        // return above IDEAL_RETURN saturates return_norm at 1.0: no extra
        // credit, but still accepted (no hard cap).
        let at_cap = calculate_put_score(2.0, 1.0, 0.80, &bull_regime()).unwrap();
        let above_cap = calculate_put_score(2.0, 1.0, 2.00, &bull_regime()).unwrap();
        assert!((at_cap - above_cap).abs() < 1e-9);
        assert!((at_cap - 1.00).abs() < 0.01);
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
            make_chain("TSLA", 200.0, 0.32),
            make_chain("NVDA", 130.0, 0.30),
        ];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);
        sharpe.insert("TSLA".to_string(), 1.5);
        sharpe.insert("NVDA".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert(
            "AAPL".to_string(),
            PutPriceRange {
                min: 80.0,
                max: 120.0,
            },
        );
        ranges.insert(
            "TSLA".to_string(),
            PutPriceRange {
                min: 150.0,
                max: 280.0,
            },
        );
        ranges.insert(
            "NVDA".to_string(),
            PutPriceRange {
                min: 100.0,
                max: 180.0,
            },
        );

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull_regime(),
        )
        .unwrap();

        let underlyings: Vec<&str> = top_picks.iter().map(|p| p.underlying.as_str()).collect();
        let mut unique = underlyings.clone();
        unique.sort();
        unique.dedup();
        assert_eq!(
            underlyings.len(),
            unique.len(),
            "top picks should have unique underlyings but got: {:?}",
            underlyings
        );
        assert_eq!(top_picks.len(), 3, "should have exactly 3 picks");
        assert_eq!(
            top_picks[0].underlying, "AAPL",
            "first pick should be highest scoring"
        );
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
        ranges.insert(
            "AAPL".to_string(),
            PutPriceRange {
                min: 80.0,
                max: 120.0,
            },
        );

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(
            top_picks.len(),
            1,
            "should return only 1 pick for 1 unique underlying"
        );
    }

    // We have commented out/removed tests verifying the dynamic trend filter and bear/bull weight shifting
    // since we've transitioned to the static weighting model.

    #[test]
    fn test_trend_factor_no_tightening_when_flat() {
        let factor = calculate_trend_factor(1.0);
        assert!((factor - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_mild_tightening() {
        // trend_ratio = 1.03 → reduction = 0.03 * 2.0 = 0.06 → factor = 0.94
        let factor = calculate_trend_factor(1.03);
        assert!((factor - 0.94).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_at_peak() {
        // trend_ratio = 1.05 (PEAK) → reduction = 0.05 * 2.0 = 0.10 → factor = 0.90
        let factor = calculate_trend_factor(1.05);
        assert!((factor - 0.90).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_surge_eases_back() {
        // trend_ratio = 1.20 → past peak, ease back
        // peak_reduction = 0.10, excess = 0.15, ease = 0.15 * 0.5 = 0.075
        // reduction = 0.10 - 0.075 = 0.025 → factor = 0.975
        let factor = calculate_trend_factor(1.20);
        assert!((factor - 0.975).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_extreme_surge_no_tightening() {
        // trend_ratio = 1.25 → excess = 0.20, ease = 0.10
        // peak_reduction 0.10 fully eased → factor = 1.0
        let factor = calculate_trend_factor(1.25);
        assert!((factor - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_trend_factor_below_one() {
        // trend_ratio < 1.0 → factor = 1.0 (never widen)
        let factor = calculate_trend_factor(0.95);
        assert!((factor - 1.0).abs() < 1e-9);
    }

    #[test]
    fn test_top_picks_trend_filter_blocks_weak_stock() {
        // Since trend filters are removed, both stocks should pass.
        let chains = vec![
            make_chain("AAPL", 90.0, 0.50),
            make_chain("MSFT", 380.0, 0.35),
        ];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);
        sharpe.insert("MSFT".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert(
            "AAPL".to_string(),
            PutPriceRange {
                min: 80.0,
                max: 120.0,
            },
        );
        ranges.insert(
            "MSFT".to_string(),
            PutPriceRange {
                min: 350.0,
                max: 430.0,
            },
        );

        let percentiles = HashMap::new();
        let earnings = HashMap::new();

        let mut trend_data = HashMap::new();
        trend_data.insert("AAPL".to_string(), (1.05, 1.06));
        trend_data.insert("MSFT".to_string(), (0.95, 0.94));

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 2, "both AAPL and MSFT should pass as trend filter is removed");
        assert_eq!(top_picks[0].underlying, "AAPL"); // AAPL has return 0.35, MSFT has return 0.40. Return norm for AAPL (0.35) = 1.0, return norm for MSFT (0.40) = 0.75, so AAPL has a higher score.
        assert_eq!(top_picks[1].underlying, "MSFT");
    }

    #[test]
    fn test_top_picks_no_trend_data_still_scored() {
        // When no trend data exists, stocks default to (1.0, 1.0) → passes filter
        let chains = vec![make_chain("AAPL", 90.0, 0.35)];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert(
            "AAPL".to_string(),
            PutPriceRange {
                min: 80.0,
                max: 120.0,
            },
        );

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new(); // empty — no trend data

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 1, "should still score without trend data");
        assert_eq!(top_picks[0].trend_short, None);
    }

    // We have commented out/removed tests verifying the dynamic trend filter and bear/bull weight shifting
    // since we've transitioned to the static weighting model.

    #[test]
    fn test_regime_integration_bear_allows_more_stocks() {
        // With trend filters removed, all valid stocks pass under both bull and bear.
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),  // strong trend
            make_chain("MSFT", 350.0, 0.35), // moderate trend (0.95)
            make_chain("TSLA", 200.0, 0.35), // weak trend (0.93)
            make_chain("NVDA", 120.0, 0.35), // very weak (0.90)
            make_chain("GOOG", 150.0, 0.35), // freefall (0.85)
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAPL", "MSFT", "TSLA", "NVDA", "GOOG"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        ranges.insert(
            "AAPL".to_string(),
            PutPriceRange {
                min: 80.0,
                max: 120.0,
            },
        );
        ranges.insert(
            "MSFT".to_string(),
            PutPriceRange {
                min: 300.0,
                max: 430.0,
            },
        );
        ranges.insert(
            "TSLA".to_string(),
            PutPriceRange {
                min: 150.0,
                max: 280.0,
            },
        );
        ranges.insert(
            "NVDA".to_string(),
            PutPriceRange {
                min: 100.0,
                max: 160.0,
            },
        );
        ranges.insert(
            "GOOG".to_string(),
            PutPriceRange {
                min: 130.0,
                max: 190.0,
            },
        );

        let mut trend_data = HashMap::new();
        trend_data.insert("AAPL".to_string(), (1.05, 1.06));
        trend_data.insert("MSFT".to_string(), (0.95, 0.96));
        trend_data.insert("TSLA".to_string(), (0.93, 0.94));
        trend_data.insert("NVDA".to_string(), (0.90, 0.91));
        trend_data.insert("GOOG".to_string(), (0.85, 0.86));

        let percentiles = HashMap::new();
        let earnings = HashMap::new();

        // Bull regime: up to sector/symbol limit of unique ones (no sectors provided -> "Unknown" sector allows up to 3)
        let bull = MarketRegime::from_spy_trend(1.05);
        let (_csv_bull, picks_bull) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bull,
        )
        .unwrap();
        assert_eq!(picks_bull.len(), 3, "should get 3 picks as trend filters are removed");

        // Bear regime: same behavior
        let bear = MarketRegime::from_spy_trend(0.92);
        let (_csv_bear, picks_bear) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &HashMap::new(),
            &bear,
        )
        .unwrap();
        assert_eq!(picks_bear.len(), 3, "should get 3 picks as trend filters are removed");
    }

    #[test]
    fn test_top_picks_sector_diversity() {
        // AAPL and MSFT are both Technology, NVDA is also Technology, XOM is Energy
        // Without sector filter: AAPL, MSFT, NVDA (all Tech)
        // With sector filter: AAPL (Tech), XOM (Energy), then JPM (Financials)
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("MSFT", 350.0, 0.34),  // same sector as AAPL
            make_chain("NVDA", 130.0, 0.33),  // same sector as AAPL
            make_chain("XOM", 100.0, 0.32),   // Energy
            make_chain("JPM", 200.0, 0.31),   // Financials
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAPL", "MSFT", "NVDA", "XOM", "JPM"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        ranges.insert("MSFT".to_string(), PutPriceRange { min: 300.0, max: 430.0 });
        ranges.insert("NVDA".to_string(), PutPriceRange { min: 100.0, max: 180.0 });
        ranges.insert("XOM".to_string(), PutPriceRange { min: 80.0, max: 135.0 });
        ranges.insert("JPM".to_string(), PutPriceRange { min: 180.0, max: 235.0 });

        let mut sectors = HashMap::new();
        sectors.insert("AAPL".to_string(), "Technology".to_string());
        sectors.insert("MSFT".to_string(), "Technology".to_string());
        sectors.insert("NVDA".to_string(), "Technology".to_string());
        sectors.insert("XOM".to_string(), "Energy".to_string());
        sectors.insert("JPM".to_string(), "Financials".to_string());

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &sectors,
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 3);
        assert_eq!(top_picks[0].underlying, "AAPL");
        assert_eq!(top_picks[0].sector, "Technology");
        assert_eq!(top_picks[1].underlying, "XOM");
        assert_eq!(top_picks[1].sector, "Energy");
        assert_eq!(top_picks[2].underlying, "JPM");
        assert_eq!(top_picks[2].sector, "Financials");

        // No two picks share a sector
        let sectors_seen: HashSet<&str> =
            top_picks.iter().map(|p| p.sector.as_str()).collect();
        assert_eq!(sectors_seen.len(), top_picks.len());
    }

    #[test]
    fn test_top_picks_unknown_sector_not_excluded() {
        // Two stocks with Unknown sector should both be picked
        let chains = vec![
            make_chain("AAA", 90.0, 0.35),
            make_chain("BBB", 90.0, 0.34),
            make_chain("CCC", 90.0, 0.33),
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAA", "BBB", "CCC"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        for sym in &["AAA", "BBB", "CCC"] {
            ranges.insert(sym.to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        }

        // No sector mappings — all will be "Unknown"
        let sectors = HashMap::new();
        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &sectors,
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 3);
        assert_eq!(top_picks[0].sector, "Unknown");
        assert_eq!(top_picks[1].sector, "Unknown");
        assert_eq!(top_picks[2].sector, "Unknown");
    }

    #[test]
    fn test_csv_contains_sector_column() {
        let chains = vec![make_chain("AAPL", 90.0, 0.35)];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

        let mut sectors = HashMap::new();
        sectors.insert("AAPL".to_string(), "Technology".to_string());

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (csv_bytes, _) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &sectors,
            &bull_regime(),
        )
        .unwrap();

        let csv_str = String::from_utf8(csv_bytes).unwrap();
        let mut lines = csv_str.lines();
        let header = lines.next().unwrap();
        assert!(header.contains("sector"), "header should contain 'sector', got: {}", header);

        // Check order: underlying, sector, strike
        let header_parts: Vec<&str> = header.split(',').collect();
        let underlying_idx = header_parts.iter().position(|h| *h == "underlying").unwrap();
        let sector_idx = header_parts.iter().position(|h| *h == "sector").unwrap();
        let strike_idx = header_parts.iter().position(|h| *h == "strike").unwrap();
        assert_eq!(sector_idx, underlying_idx + 1, "sector should be right after underlying");
        assert_eq!(strike_idx, sector_idx + 1, "strike should be right after sector");

        let data_line = lines.next().unwrap();
        let data_parts: Vec<&str> = data_line.split(',').collect();
        assert_eq!(data_parts[underlying_idx], "AAPL");
        assert_eq!(data_parts[sector_idx], "Technology");
    }

    #[test]
    fn test_csv_sector_unknown_when_not_mapped() {
        let chains = vec![make_chain("FOO", 90.0, 0.35)];

        let mut sharpe = HashMap::new();
        sharpe.insert("FOO".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("FOO".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

        let sectors = HashMap::new(); // no mapping for FOO

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (csv_bytes, _) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &sectors,
            &bull_regime(),
        )
        .unwrap();

        let csv_str = String::from_utf8(csv_bytes).unwrap();
        let data_line = csv_str.lines().nth(1).unwrap();
        let data_parts: Vec<&str> = data_line.split(',').collect();
        let sector_idx = csv_str.lines().next().unwrap().split(',').position(|h| h == "sector").unwrap();
        assert_eq!(data_parts[sector_idx], "Unknown");
    }

    #[test]
    fn test_top_picks_all_same_sector_returns_fewer() {
        // 5 stocks, all Technology — should only get 1 pick
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("MSFT", 350.0, 0.34),
            make_chain("NVDA", 130.0, 0.33),
            make_chain("AVGO", 160.0, 0.32),
            make_chain("ORCL", 140.0, 0.31),
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAPL", "MSFT", "NVDA", "AVGO", "ORCL"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        for sym in &["AAPL", "MSFT", "NVDA", "AVGO", "ORCL"] {
            ranges.insert(sym.to_string(), PutPriceRange { min: 80.0, max: 200.0 });
        }

        let mut sectors = HashMap::new();
        for sym in &["AAPL", "MSFT", "NVDA", "AVGO", "ORCL"] {
            sectors.insert(sym.to_string(), "Technology".to_string());
        }

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &sectors,
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 1, "all same sector should yield only 1 pick");
        assert_eq!(top_picks[0].sector, "Technology");
    }

    #[test]
    fn test_top_picks_mixed_known_and_unknown_sectors() {
        // AAPL=Technology, BBB=Unknown, CCC=Unknown, XOM=Energy
        // Expected: AAPL (Tech) -> BBB (Unknown, allowed) -> CCC (Unknown, allowed)
        // XOM (Energy) should be skipped because higher-scoring Unknowns come first
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("BBB", 90.0, 0.34),
            make_chain("CCC", 90.0, 0.33),
            make_chain("XOM", 100.0, 0.32),
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAPL", "BBB", "CCC", "XOM"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        for sym in &["AAPL", "BBB", "CCC", "XOM"] {
            ranges.insert(sym.to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        }

        let mut sectors = HashMap::new();
        sectors.insert("AAPL".to_string(), "Technology".to_string());
        sectors.insert("XOM".to_string(), "Energy".to_string());
        // BBB and CCC are Unknown

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (_csv, top_picks) = option_chain_to_csv_vec(
            &chains,
            &sharpe,
            &ranges,
            &percentiles,
            &earnings,
            &trend_data,
            &sectors,
            &bull_regime(),
        )
        .unwrap();

        assert_eq!(top_picks.len(), 3);
        assert_eq!(top_picks[0].underlying, "AAPL");
        assert_eq!(top_picks[0].sector, "Technology");
        assert_eq!(top_picks[1].underlying, "BBB");
        assert_eq!(top_picks[1].sector, "Unknown");
        assert_eq!(top_picks[2].underlying, "CCC");
        assert_eq!(top_picks[2].sector, "Unknown");
    }

    // --- Earnings-aware scoring ---
    // `option_chain_to_csv_vec` scores via `calculate_put_chain_score`, which is
    // a pure passthrough to `calculate_put_score` when no earnings fall in
    // [today, expiry]. The two tests just above pin that passthrough (no-earnings
    // and out-of-window). The in-window rule — exclude the upper half, halve
    // safety — lives in the pure helpers and is unit-tested below.

    #[test]
    fn test_csv_score_is_calculate_put_score_on_band_safety() {
        // No earnings map: the CSV score column must equal
        // calculate_put_score(calculate_max_drop_safety(strike, from, to), ...).
        // Pins the exact passthrough so the rewiring (moving safety into a new
        // helper) cannot silently change the no-earnings score.
        let chains = vec![make_chain("AAPL", 90.0, 0.35)]; // strike_from=80, strike_to=120

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });

        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        let (csv_bytes, _) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data,
            &HashMap::new(), &bull_regime(),
        )
        .unwrap();

        let expected_safety = calculate_max_drop_safety(90.0, 80.0, 120.0);
        let expected_score = calculate_put_score(1.5, expected_safety, 0.35, &bull_regime()).unwrap();

        let csv_str = String::from_utf8(csv_bytes).unwrap();
        let header: Vec<&str> = csv_str.lines().next().unwrap().split(',').collect();
        let score_idx = header.iter().position(|h| *h == "score").unwrap();
        let data_line = csv_str.lines().nth(1).unwrap();
        let data_parts: Vec<&str> = data_line.split(',').collect();
        assert_eq!(
            data_parts[score_idx],
            format!("{:.3}", expected_score),
            "no-earnings CSV score must equal calculate_put_score on band safety"
        );
    }

    #[test]
    fn test_earnings_out_of_window_is_scoring_neutral() {
        // An earnings entry that is out of the [today, expiry] window must not
        // change picks vs. an empty earnings map (today: earnings is display-only).
        // report_date "2000-01-01" is unambiguously before any real today → out of window.
        let chains = vec![
            make_chain("AAPL", 90.0, 0.35),
            make_chain("MSFT", 350.0, 0.34),
            make_chain("XOM", 100.0, 0.32),
        ];

        let mut sharpe = HashMap::new();
        for sym in &["AAPL", "MSFT", "XOM"] {
            sharpe.insert(sym.to_string(), 1.5);
        }

        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        ranges.insert("MSFT".to_string(), PutPriceRange { min: 300.0, max: 430.0 });
        ranges.insert("XOM".to_string(), PutPriceRange { min: 80.0, max: 135.0 });

        let percentiles = HashMap::new();
        let trend_data = HashMap::new();

        let empty_earnings: HashMap<String, EarningsInfo> = HashMap::new();
        let (_csv_a, picks_a) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &empty_earnings, &trend_data,
            &HashMap::new(), &bull_regime(),
        )
        .unwrap();

        let mut populated_earnings = HashMap::new();
        populated_earnings.insert(
            "AAPL".to_string(),
            EarningsInfo {
                report_date: "2000-01-01".to_string(),
                report_time: "AMC".to_string(),
                expected_eps: None,
            },
        );
        let (_csv_b, picks_b) = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &populated_earnings, &trend_data,
            &HashMap::new(), &bull_regime(),
        )
        .unwrap();

        let as_tuple = |p: &TopPick| (p.underlying.clone(), format!("{:.3}", p.score));
        let a: Vec<_> = picks_a.iter().map(as_tuple).collect();
        let b: Vec<_> = picks_b.iter().map(as_tuple).collect();
        assert_eq!(a, b, "out-of-window earnings must be scoring-neutral");
    }

    // --- New contract: the earnings-in-window rule (pure helpers) ---

    fn nd(s: &str) -> NaiveDate {
        NaiveDate::parse_from_str(s, "%Y-%m-%d").unwrap()
    }

    #[test]
    fn test_earnings_in_window_strictly_inside() {
        // today=06-10, expiry=06-19, report=06-15 → in window
        assert!(earnings_in_window("2026-06-15", "2026-06-19", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_before_today() {
        assert!(!earnings_in_window("2026-06-09", "2026-06-19", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_after_expiry() {
        assert!(!earnings_in_window("2026-06-20", "2026-06-19", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_boundary_today_inclusive() {
        assert!(earnings_in_window("2026-06-10", "2026-06-19", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_boundary_expiry_inclusive() {
        assert!(earnings_in_window("2026-06-19", "2026-06-19", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_unparseable_report_date() {
        // Safe default: malformed date → no earnings effect.
        assert!(!earnings_in_window("not-a-date", "2026-06-19", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_unparseable_expiry() {
        assert!(!earnings_in_window("2026-06-15", "garbage", nd("2026-06-10")));
    }

    #[test]
    fn test_earnings_in_window_parses_full_timestamp_expiry() {
        // Real Tiger expiry strings may carry a time/offset; only the first 10
        // chars (the YYYY-MM-DD prefix) should be used.
        assert!(earnings_in_window(
            "2026-06-15",
            "2026-06-19 16:00:00 -04:00",
            nd("2026-06-10"),
        ));
    }

    // band [80, 120] → midpoint 100; safety(strike) = (120 - strike) / 40
    fn band_safety(strike: f64) -> f64 {
        calculate_max_drop_safety(strike, 80.0, 120.0)
    }

    #[test]
    fn test_put_chain_score_no_earnings_deep_is_passthrough() {
        let got = calculate_put_chain_score(1.5, 90.0, 80.0, 120.0, 0.35, &bull_regime(), false);
        let want = calculate_put_score(1.5, band_safety(90.0), 0.35, &bull_regime());
        assert_eq!(got, want);
    }

    #[test]
    fn test_put_chain_score_no_earnings_shallow_is_passthrough() {
        // strike 110 (upper half), no earnings → still scored (not excluded).
        let got = calculate_put_chain_score(1.5, 110.0, 80.0, 120.0, 0.35, &bull_regime(), false);
        let want = calculate_put_score(1.5, band_safety(110.0), 0.35, &bull_regime());
        assert_eq!(got, want);
        assert!(got.is_some());
    }

    #[test]
    fn test_put_chain_score_earnings_excludes_upper_half() {
        // strike 110 > midpoint 100, earnings in window → excluded.
        assert_eq!(
            calculate_put_chain_score(1.5, 110.0, 80.0, 120.0, 0.35, &bull_regime(), true),
            None
        );
    }

    #[test]
    fn test_put_chain_score_earnings_keeps_lower_half_with_halved_safety() {
        // strike 90 ≤ midpoint 100, earnings → scored with safety × multiplier.
        let got = calculate_put_chain_score(1.5, 90.0, 80.0, 120.0, 0.35, &bull_regime(), true);
        let want = calculate_put_score(
            1.5,
            band_safety(90.0) * crate::constants::EARNINGS_SAFETY_MULTIPLIER,
            0.35,
            &bull_regime(),
        );
        assert_eq!(got, want);
        assert!(got.is_some());
    }

    #[test]
    fn test_put_chain_score_earnings_midpoint_kept() {
        // strike == midpoint → kept (strike ≤ mid), safety halved.
        let got = calculate_put_chain_score(1.5, 100.0, 80.0, 120.0, 0.35, &bull_regime(), true);
        assert!(got.is_some());
        let want = calculate_put_score(
            1.5,
            band_safety(100.0) * crate::constants::EARNINGS_SAFETY_MULTIPLIER,
            0.35,
            &bull_regime(),
        );
        assert_eq!(got, want);
    }

    #[test]
    fn test_put_chain_score_earnings_halving_downranks() {
        // same deep strike: earnings score < no-earnings score.
        let with = calculate_put_chain_score(1.5, 90.0, 80.0, 120.0, 0.35, &bull_regime(), true).unwrap();
        let without = calculate_put_chain_score(1.5, 90.0, 80.0, 120.0, 0.35, &bull_regime(), false).unwrap();
        assert!(with < without);
    }

    #[test]
    fn test_put_chain_score_earnings_does_not_bypass_prefilters() {
        // Earnings doesn't override the sharpe>0 floor: deep strike, sharpe=0 → None.
        assert_eq!(
            calculate_put_chain_score(0.0, 90.0, 80.0, 120.0, 0.35, &bull_regime(), true),
            None
        );
        // And the min-return floor still applies.
        assert_eq!(
            calculate_put_chain_score(1.5, 90.0, 80.0, 120.0, 0.10, &bull_regime(), true),
            None
        );
    }

    // --- Regression: corrupt band data (NaN) must not panic the sort [S-001] ---

    #[test]
    fn test_option_chain_to_csv_vec_survives_nan_band_safety() {
        // A NaN band (corrupt strike_from/strike_to) yields a NaN score. With two
        // scored chains the top-pick sort MUST compare them — a NaN vs. number
        // comparison must be treated as equal rather than panicking.
        let mut bad = make_chain("AAPL", 90.0, 0.35);
        bad.strike_from = f64::NAN;
        bad.strike_to = f64::NAN;
        let ok = make_chain("MSFT", 90.0, 0.35); // normal band → finite score
        let chains = vec![bad, ok];

        let mut sharpe = HashMap::new();
        sharpe.insert("AAPL".to_string(), 1.5);
        sharpe.insert("MSFT".to_string(), 1.5);
        let mut ranges = HashMap::new();
        ranges.insert("AAPL".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        ranges.insert("MSFT".to_string(), PutPriceRange { min: 80.0, max: 120.0 });
        let percentiles = HashMap::new();
        let earnings = HashMap::new();
        let trend_data = HashMap::new();

        // Must not panic; returns Ok regardless of the NaN score.
        let result = option_chain_to_csv_vec(
            &chains, &sharpe, &ranges, &percentiles, &earnings, &trend_data,
            &HashMap::new(), &bull_regime(),
        );
        assert!(result.is_ok());
    }
}
