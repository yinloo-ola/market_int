// ── Candle / Option-chain data ────────────────────────────────
pub const CANDLE_COUNT: u32 = 850;
pub const MIN_OPEN_INTEREST: u32 = 50;
pub const SHARPE_MIN_CANDLES: usize = 14;
pub const PRICE_PERCENTILE_DAYS: u32 = 20;
pub const DEFAULT_RISK_FREE_RATE: f64 = 0.0;

// ── Trend (EMAs, regime) ──────────────────────────────────────
pub const EMA_SHORT_PERIOD: u32 = 20;
pub const EMA_LONG_PERIOD: u32 = 50;
pub const TREND_THRESHOLD_BULL: f64 = 0.98;
pub const TREND_THRESHOLD_RANGE: f64 = 0.06; // How far threshold can drop (0.98 → 0.92)
pub const BEARNESS_MAX: f64 = 0.08; // SPY drop mapping to bearness = 1.0
pub const MOMENTUM_HIGH_THRESHOLD: f64 = 0.80;
pub const MOMENTUM_EXTENDED_THRESHOLD: f64 = 0.90;

// ── Max-drop band ─────────────────────────────────────────────
pub const PERCENTILE: f64 = 0.97; // 97th-percentile drawdown → deep band end
pub const TREND_TIGHTEN_MULTIPLIER: f64 = 2.0;
pub const TREND_TIGHTEN_CAP: f64 = 0.10;
pub const TREND_TIGHTEN_PEAK: f64 = 1.05;
pub const TREND_EASE_BACK: f64 = 0.5;

// ── Pre-filters ───────────────────────────────────────────────
pub const MIN_RATE_OF_RETURN: f64 = 0.30;
/// Unused in production (no upper cap since 2026-07). Retained for backtest presets.
pub const MAX_RATE_OF_RETURN: f64 = 0.80;
/// Unused in production (danger expressed via band). Retained for backtest presets.
pub const MAX_STRIKE_PERCENTILE: f64 = 0.40;

// ── Scoring weights ───────────────────────────────────────────
/// Weights sum to 1.0. A trend term is wired (see `TREND_SCORE_*` below)
/// but `PUT_SCORE_WEIGHT_TREND = 0.0` — the 2026-07 sweep found every
/// non-zero weight lifted assignment above the 2.4% baseline. The lever is
/// retained for future changes (e.g. real IV/delta capture from Tiger).
pub const PUT_SCORE_WEIGHT_SHARPE: f64 = 0.20;
pub const PUT_SCORE_WEIGHT_SAFETY: f64 = 0.40;
pub const PUT_SCORE_WEIGHT_RETURN: f64 = 0.40;
pub const PUT_SCORE_WEIGHT_TREND: f64 = 0.0;
/// Soft-cap: `return_norm = (rate_of_return / IDEAL_RETURN).min(1.0)`.
/// Above 80% return, no extra credit but no exclusion either.
pub const IDEAL_RETURN: f64 = 0.80;

// ── Trend-score term (wired, disabled) ─────────────────────────
pub const TREND_SCORE_FLOOR: f64 = 1.02;
pub const TREND_SCORE_BAND: f64 = 0.06;

// ── Earnings-aware scoring ────────────────────────────────────
pub const EARNINGS_SAFETY_MULTIPLIER: f64 = 0.5;

// ── Telegram publication ──────────────────────────────────────
pub const TOP_PICKS_COUNT: usize = 3;

// ── Vol-tier annotation (D2) ──────────────────────────────────
/// Backtest-only threshold for the `vol-high-only` preset.
/// Production does NOT filter — it annotates each pick with a vol tier instead.
pub const MIN_REALIZED_VOL: f64 = 0.50;

// ── Vol-tier safety boost (D2) ────────────────────────────────
/// Safety multiplier for high-vol names. High-vol names deliver materially
/// higher rate_of_return at matched assignment rate (calibration: at 2% breach,
/// low-vol ~44% ror, mid-vol ~49%, high-vol ~53%). This boost lifts safety
/// for higher-vol names so the picker's ranking slots go to richer picks —
/// without removing any candidates from the pool (unlike a hard vol filter).
///
/// Tier multipliers: high-vol (>=0.38) → 1.0, mid-vol (>=0.28) → 0.5,
/// low-vol (<0.28) → 0.0. The boost is `safety *= (1 + VOL_SAFETY_BOOST * tier)`.
/// 0.0 = disabled (production default — the bot annotates vol tiers instead).
pub const VOL_SAFETY_BOOST: f64 = 0.0;

// ── Up/down direction signal (`direction` subcommand) ─────────
// v1 is a research tool: 5 indicators across Trend + Momentum layers,
// combined into a [0,1] composite where >0.5 = bullish bias over a ~10-day
// horizon. See .scratch/up-down-signal/spec.md and map decisions 01–04.
//
// Weights are seeds (momentum-leaning, summing to 100); ticket 08's grid
// search calibrates them against the 2-year train split.
//
// Normalization is hybrid (decision 02): discrete regime flags for the EMAs
// (alignment + EMA200), continuous magnitudes for MACD/RSI/volume.
pub const SIGNAL_WEIGHT_EMA_ALIGNMENT: f64 = 25.0;
pub const SIGNAL_WEIGHT_EMA200: f64 = 15.0;
pub const SIGNAL_WEIGHT_MACD: f64 = 25.0;
pub const SIGNAL_WEIGHT_RSI: f64 = 20.0;
pub const SIGNAL_WEIGHT_VOLUME: f64 = 15.0;
/// Relative strength vs SPY (ticket 09): outperformance vs the index. Seed
/// weight 0 — calibrated by the grid search along with the others.
pub const SIGNAL_WEIGHT_RS: f64 = 0.0;
/// ADX trend-strength filter (ticket 10): directionalized via ±DI sign so it
/// fits the flat weighted-sum composite (Option B in the ticket). Seed 0.
pub const SIGNAL_WEIGHT_ADX: f64 = 0.0;
/// Neutral band edges — held CONSTANT (not calibrated) so only the weights
/// are tuned against the train split. Used by both the live predictor's
/// BULL/BEAR/NEUT display and the backtest's abstention rule (one band,
/// two consumers). <0.40 = BEAR call, >0.60 = BULL call, else abstain/NEUT.
pub const SIGNAL_NEUTRAL_LOW: f64 = 0.40;
pub const SIGNAL_NEUTRAL_HIGH: f64 = 0.60;
// ── Direction-indicator normalization params ──────────────────
/// RSI normalization band endpoints (decision 02). rsi <= RSI_LOW → 0.0
/// (oversold/bearish), rsi >= RSI_HIGH → 1.0 (overbought/bullish), linear
/// between. RSI is a momentum oscillator, so high RSI = bullish momentum here.
pub const RSI_LOW: f64 = 10.0;
pub const RSI_HIGH: f64 = 90.0;
/// Volume-spike ratio that maxes the volume-breakout feature (decision 02).
/// A day with volume 1.5× its 50-day average → full 1.0; below average → 0.0.
pub const VOLUME_SPIKE_FULL: f64 = 1.5;
/// Window (bars) of MACD histogram used for the self-referential stdev
/// normalization (decision 02): score = clamp(hist / stdev(hist, window)).
/// Self-referential keeps it stock-agnostic (no price-scale contamination).
pub const MACD_STDEV_WINDOW: usize = 20;
// ── Relative strength vs SPY (ticket 09) ───────────────────────
/// RS lookback in trading days (medium-term; classic RS horizon).
pub const RS_LOOKBACK: usize = 50;
/// Half-width of the RS normalization band around 1.0 (decision: ratio of
/// price ratios). RS within [1−band, 1+band] maps linearly to [0,1]; outside
/// clamps. 0.10 ⇒ RS < 0.90 → fully bearish, RS > 1.10 → fully bullish.
pub const RS_BAND: f64 = 0.10;
// ── ADX trend-strength (ticket 10) ────────────────────────────
/// Wilder period for ADX and the DI smoothing (standard ADX(14)).
pub const ADX_PERIOD: usize = 14;
/// ADX value at which a trend counts as "full strength" for the score (classic
/// 25 threshold). The score ramps linearly from 0 (ADX=0, no trend) to 1
/// (ADX >= this), then directionalized by ±DI sign.
pub const ADX_FULL_STRENGTH: f64 = 25.0;
