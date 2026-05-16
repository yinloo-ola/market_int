pub const CANDLE_COUNT: u32 = 850;
pub const MIN_OPEN_INTEREST: u32 = 50;
pub const PERCENTILE: f64 = 0.9;
pub const SHARPE_MIN_CANDLES: usize = 14;
pub const DEFAULT_RISK_FREE_RATE: f64 = 0.0; // use 0
pub const PRICE_PERCENTILE_DAYS: u32 = 20;
pub const MOMENTUM_HIGH_THRESHOLD: f64 = 0.80;
pub const MOMENTUM_EXTENDED_THRESHOLD: f64 = 0.90;
pub const MIN_RATE_OF_RETURN: f64 = 0.25;
pub const MAX_RATE_OF_RETURN: f64 = 0.65;
pub const MAX_STRIKE_PERCENTILE: f64 = 0.60;

// Trend filter constants
pub const EMA_SHORT_PERIOD: u32 = 20;
pub const EMA_LONG_PERIOD: u32 = 50;
pub const TREND_THRESHOLD_BULL: f64 = 0.98; // Threshold in bull market (current behavior)
pub const TREND_THRESHOLD_RANGE: f64 = 0.06; // How far threshold can drop (0.98 → 0.92)
pub const BEARNESS_MAX: f64 = 0.08; // SPY drop that maps to bearness = 1.0
pub const TREND_TIGHTEN_MULTIPLIER: f64 = 4.0;
pub const TREND_TIGHTEN_CAP: f64 = 0.25;
