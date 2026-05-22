use std::collections::HashMap;

use chrono::{Datelike, Duration, NaiveDate, Weekday};

use crate::{
    constants, maxdrop, model, price_percentile, sharpe, trend,
    store::candle,
};

// ── Black-Scholes ──────────────────────────────────────────────

/// Standard normal CDF using Abramowitz & Stegun approximation (max error ~7.5e-8).
pub fn cumulative_normal(x: f64) -> f64 {
    const A1: f64 = 0.254829592;
    const A2: f64 = -0.284496736;
    const A3: f64 = 1.421413741;
    const A4: f64 = -1.453152027;
    const A5: f64 = 1.061405429;
    const P: f64 = 0.3275911;

    let sign = if x < 0.0 { -1.0 } else { 1.0 };
    let x_abs = x.abs() / std::f64::consts::SQRT_2;

    let t = 1.0 / (1.0 + P * x_abs);
    let y = 1.0 - (((((A5 * t + A4) * t) + A3) * t + A2) * t + A1) * t * (-x_abs * x_abs).exp();

    0.5 * (1.0 + sign * y)
}

/// Black-Scholes put price.
/// S = spot, K = strike, T = years to expiry, r = risk-free rate, q = dividend yield, sigma = volatility.
pub fn black_scholes_put(S: f64, K: f64, T: f64, r: f64, q: f64, sigma: f64) -> f64 {
    if T <= 0.0 || sigma <= 0.0 || S <= 0.0 || K <= 0.0 {
        return 0.0;
    }
    let d1 = ((S / K).ln() + (r - q + sigma * sigma / 2.0) * T) / (sigma * T.sqrt());
    let d2 = d1 - sigma * T.sqrt();

    K * (-r * T).exp() * cumulative_normal(-d2) - S * (-q * T).exp() * cumulative_normal(-d1)
}

/// Annualized volatility from daily close prices.
/// Uses rolling window of daily log returns, annualized by sqrt(252).
pub fn estimate_historical_volatility(closes: &[f64], window: usize) -> f64 {
    if closes.len() < window + 1 {
        return 0.30; // Default 30% if insufficient data
    }
    let recent = &closes[closes.len() - window - 1..];
    let returns: Vec<f64> = recent.windows(2).map(|w| (w[1] / w[0]).ln()).collect();
    let mean = returns.iter().sum::<f64>() / returns.len() as f64;
    let variance =
        returns.iter().map(|r_val| (r_val - mean).powi(2)).sum::<f64>() / (returns.len() - 1) as f64;
    variance.sqrt() * (252.0_f64).sqrt()
}

/// Matches Tiger API's num_of_weeks calculation.
pub fn num_of_weeks(dte: u32) -> f64 {
    if (5..=7).contains(&dte) {
        1.0
    } else {
        (dte / 7) as f64 + (dte % 7) as f64 / 5.0
    }
}

/// Computes rate_of_return matching Tiger API's formula:
/// rate_of_return = premium / strike / num_of_weeks * 52.0
pub fn compute_rate_of_return(premium: f64, strike: f64, dte: u32) -> f64 {
    let weeks = num_of_weeks(dte);
    premium / strike / weeks * 52.0
}

// ── Configuration ──────────────────────────────────────────────

/// Captures every tunable parameter for the backtest.
/// Each preset represents a hypothesis to test via ablation.
#[derive(Debug, Clone)]
pub struct BacktestConfig {
    pub name: String,
    pub period: usize,

    // Strike range
    pub use_trend_factor: bool,
    pub trend_tighten_multiplier: f64,
    pub trend_tighten_cap: f64,
    pub trend_tighten_peak: f64,
    pub trend_tighten_ease_back: f64,

    // Pre-filters
    pub min_rate_of_return: f64,
    pub max_rate_of_return: f64,
    pub max_strike_percentile: f64,

    // Scoring weights (must sum to 1.0)
    pub weight_sharpe: f64,
    pub weight_safety: f64,
    pub weight_return: f64,
    pub weight_trend: f64,

    // Trend filters
    pub use_trend_short_filter: bool,
    pub use_trend_long_filter: bool,
    pub use_trend_in_score: bool,

    // Regime
    pub use_regime: bool,
    pub trend_threshold_bull: f64,
    pub trend_threshold_range: f64,
    pub bearness_max: f64,

    // Black-Scholes
    pub risk_free_rate: f64,
    pub dividend_yield: f64,
    pub vol_window: usize,
}

impl BacktestConfig {
    /// Current production defaults — the control baseline.
    pub fn control() -> Self {
        Self {
            name: "control".to_string(),
            period: 5,
            use_trend_factor: true,
            trend_tighten_multiplier: constants::TREND_TIGHTEN_MULTIPLIER,
            trend_tighten_cap: constants::TREND_TIGHTEN_CAP,
            trend_tighten_peak: constants::TREND_TIGHTEN_PEAK,
            trend_tighten_ease_back: constants::TREND_EASE_BACK,
            min_rate_of_return: constants::MIN_RATE_OF_RETURN,
            max_rate_of_return: constants::MAX_RATE_OF_RETURN,
            max_strike_percentile: constants::MAX_STRIKE_PERCENTILE,
            weight_sharpe: 0.20,
            weight_safety: 0.30,
            weight_return: 0.20,
            weight_trend: 0.30,
            use_trend_short_filter: true,
            use_trend_long_filter: true,
            use_trend_in_score: true,
            use_regime: true,
            trend_threshold_bull: constants::TREND_THRESHOLD_BULL,
            trend_threshold_range: constants::TREND_THRESHOLD_RANGE,
            bearness_max: constants::BEARNESS_MAX,
            risk_free_rate: 0.045,
            dividend_yield: 0.015,
            vol_window: 20,
        }
    }

    /// No trend factor — strike range never tightened.
    pub fn no_trend_factor() -> Self {
        Self {
            use_trend_factor: false,
            name: "no-trend-factor".to_string(),
            ..Self::control()
        }
    }

    /// No trend_long pre-filter.
    pub fn no_trend_long() -> Self {
        Self {
            use_trend_long_filter: false,
            name: "no-trend-long".to_string(),
            ..Self::control()
        }
    }

    /// No trend in score — redistribute trend weight to safety.
    pub fn no_trend_score() -> Self {
        Self {
            use_trend_in_score: false,
            weight_trend: 0.0,
            weight_safety: 0.60,
            name: "no-trend-score".to_string(),
            ..Self::control()
        }
    }

    /// No regime — always use bull thresholds.
    pub fn no_regime() -> Self {
        Self {
            use_regime: false,
            name: "no-regime".to_string(),
            ..Self::control()
        }
    }

    /// All trend features off — pure sharpe + safety + return.
    pub fn no_trend_at_all() -> Self {
        Self {
            use_trend_factor: false,
            use_trend_short_filter: false,
            use_trend_long_filter: false,
            use_trend_in_score: false,
            use_regime: false,
            weight_trend: 0.0,
            weight_safety: 0.60,
            name: "no-trend-at-all".to_string(),
            ..Self::control()
        }
    }

    /// Looser return filters.
    pub fn wide_return() -> Self {
        Self {
            min_rate_of_return: 0.15,
            max_rate_of_return: 1.0,
            name: "wide-return".to_string(),
            ..Self::control()
        }
    }

    /// Returns all preset configs for ablation testing.
    pub fn all_presets() -> Vec<Self> {
        vec![
            Self::control(),
            Self::no_trend_factor(),
            Self::no_trend_long(),
            Self::no_trend_score(),
            Self::no_regime(),
            Self::no_trend_at_all(),
            Self::wide_return(),
        ]
    }

    /// Look up a preset by name (case-sensitive).
    pub fn by_name(name: &str) -> Option<Self> {
        Self::all_presets().into_iter().find(|p| p.name == name)
    }

    /// Compute trend_factor from trend_ratio_short using config params.
    /// Returns 1.0 if use_trend_factor is false.
    pub fn compute_trend_factor(&self, trend_ratio_short: f64) -> f64 {
        if !self.use_trend_factor {
            return 1.0;
        }
        if trend_ratio_short <= 1.0 {
            return 1.0;
        }

        let cap = self.trend_tighten_cap;
        let peak = self.trend_tighten_peak;

        if trend_ratio_short <= peak {
            let reduction = (trend_ratio_short - 1.0) * self.trend_tighten_multiplier;
            1.0 - reduction.min(cap)
        } else {
            let peak_reduction =
                ((peak - 1.0) * self.trend_tighten_multiplier).min(cap);
            let excess = trend_ratio_short - peak;
            let reduction =
                (peak_reduction - excess * self.trend_tighten_ease_back).max(0.0);
            1.0 - reduction
        }
    }

    /// Build a MarketRegime for this config.
    /// If use_regime is false, always returns bull defaults.
    pub fn build_regime(&self, spy_trend_long: f64) -> crate::regime::MarketRegime {
        if !self.use_regime {
            return crate::regime::MarketRegime::from_spy_trend(1.05); // bull defaults
        }
        crate::regime::MarketRegime::from_spy_trend(spy_trend_long)
    }

    /// Score a put option candidate using config's weights and filters.
    /// Returns None if pre-filters reject.
    pub fn score_candidate(
        &self,
        sharpe: f64,
        strike_percentile: f64,
        rate_of_return: f64,
        trend_ratio_short: f64,
        trend_ratio_long: f64,
        regime: &crate::regime::MarketRegime,
    ) -> Option<f64> {
        // Pre-filters
        if rate_of_return < self.min_rate_of_return
            || rate_of_return > self.max_rate_of_return
        {
            return None;
        }
        if sharpe <= 0.0 {
            return None;
        }
        if strike_percentile > self.max_strike_percentile {
            return None;
        }
        if self.use_trend_short_filter && trend_ratio_short < regime.trend_threshold {
            return None;
        }
        if self.use_trend_long_filter && trend_ratio_long < regime.trend_threshold {
            return None;
        }

        let sharpe_norm = (sharpe / 2.0).clamp(0.0, 1.0);
        let safety_norm = 1.0 - strike_percentile.max(0.0);
        let return_norm =
            (1.0 - (rate_of_return - 0.35).abs() / 0.20).clamp(0.0, 1.0);
        let trend_norm = if self.use_trend_in_score {
            ((trend_ratio_short - regime.trend_threshold) / 0.10).clamp(0.0, 1.0)
        } else {
            0.0
        };

        Some(
            self.weight_sharpe * sharpe_norm
                + self.weight_safety * safety_norm
                + self.weight_return * return_norm
                + self.weight_trend * trend_norm,
        )
    }
}

// ── Result Types ───────────────────────────────────────────────

/// One simulated pick at a point in time.
#[derive(Debug, Clone)]
pub struct BacktestPick {
    pub sim_date: NaiveDate,
    pub symbol: String,
    pub sector: String,
    pub strike: f64,
    pub price_at_pick: f64,
    pub rate_of_return: f64,
    pub score: f64,
    pub trend_short: f64,
    pub trend_long: f64,
    pub regime_flag: String,
    pub assigned: bool,
    pub close_at_expiry: Option<f64>,
    pub close_day_after: Option<f64>,
}

/// Aggregated metrics for one config.
#[derive(Debug, Clone)]
pub struct BacktestMetrics {
    pub config_name: String,
    pub period: usize,
    pub from_date: NaiveDate,
    pub to_date: NaiveDate,
    pub total_simulations: usize,
    pub total_picks: usize,
    pub assignment_count: usize,
    pub avg_rate_of_return: f64,
    pub avg_score: f64,
    pub avg_loss_when_assigned: f64,
    pub picks: Vec<BacktestPick>,
}

impl BacktestMetrics {
    pub fn assignment_rate(&self) -> f64 {
        if self.total_picks == 0 {
            return 0.0;
        }
        self.assignment_count as f64 / self.total_picks as f64
    }
}

// ── Simulation Engine ──────────────────────────────────────────

/// Load all candles for each symbol into memory.
fn load_all_candles(
    conn: &rusqlite::Connection,
    symbols: &[String],
) -> HashMap<String, Vec<model::Candle>> {
    let mut map = HashMap::new();
    for symbol in symbols {
        match candle::get_candles(conn, symbol, constants::CANDLE_COUNT) {
            Ok(candles) if !candles.is_empty() => {
                map.insert(symbol.clone(), candles);
            }
            Ok(_) => log::warn!("No candles found for {}", symbol),
            Err(_) => log::warn!("No candles found for {}", symbol),
        }
    }
    map
}

/// Convert a NaiveDate to unix timestamp (end of day UTC).
fn date_to_timestamp(date: NaiveDate) -> u32 {
    date.and_hms_opt(23, 59, 59)
        .unwrap()
        .and_utc()
        .timestamp() as u32
}

/// Generate Mondays between from_date and to_date (inclusive).
fn generate_mondays(from: NaiveDate, to: NaiveDate) -> Vec<NaiveDate> {
    let mut mondays = Vec::new();
    let mut current = from;
    while current <= to {
        if current.weekday() == Weekday::Mon {
            mondays.push(current);
        }
        current += Duration::days(1);
    }
    mondays
}

/// Find the close price on or after target_date for a symbol.
/// Returns None if no candle found within 7 calendar days.
fn find_close_on_date(
    candles: &[model::Candle],
    target_date: NaiveDate,
) -> Option<f64> {
    let target_ts = date_to_timestamp(target_date);
    let max_ts = date_to_timestamp(target_date + Duration::days(7));
    for c in candles {
        if c.timestamp >= target_ts && c.timestamp <= max_ts {
            return Some(c.close);
        }
    }
    None
}

/// Run the full backtest for a single configuration.
pub fn run_backtest(
    config: &BacktestConfig,
    conn: &rusqlite::Connection,
    symbols: &[String],
    sectors: &HashMap<String, String>,
    from_date: NaiveDate,
    to_date: NaiveDate,
) -> BacktestMetrics {
    let candles_map = load_all_candles(conn, symbols);
    let mondays = generate_mondays(from_date, to_date);
    let period = config.period;

    let mut picks: Vec<BacktestPick> = Vec::new();

    for sim_date in &mondays {
        let sim_ts = date_to_timestamp(*sim_date);

        // Compute SPY regime
        let spy_candles = match candles_map.get("SPY") {
            Some(c) => c,
            None => continue,
        };
        let spy_up_to: Vec<model::Candle> =
            spy_candles.iter().filter(|c| c.timestamp <= sim_ts).cloned().collect();
        if spy_up_to.len() < constants::EMA_LONG_PERIOD as usize {
            continue;
        }
        let spy_closes: Vec<f64> = spy_up_to.iter().map(|c| c.close).collect();
        let (_, spy_trend_long) = trend::calculate_trend_ratios(&spy_closes);
        let regime = config.build_regime(spy_trend_long);

        // Evaluate each symbol
        let mut candidates: Vec<(usize, f64, f64, f64, f64, f64, f64, &str)> = Vec::new();

        for (symbol_idx, symbol) in symbols.iter().enumerate() {
            if symbol == "SPY" {
                continue;
            }
            let all_candles = match candles_map.get(symbol) {
                Some(c) => c,
                None => continue,
            };

            // Slice candles up to sim_date
            let candles: Vec<model::Candle> =
                all_candles.iter().filter(|c| c.timestamp <= sim_ts).cloned().collect();

            if candles.len() < constants::EMA_LONG_PERIOD as usize {
                continue;
            }

            let price = candles.last().unwrap().close;
            let closes: Vec<f64> = candles.iter().map(|c| c.close).collect();

            // Compute indicators
            let (trend_short, trend_long) = trend::calculate_trend_ratios(&closes);
            let sharpe_ratio = match sharpe::compute_sharpe(&candles, config.risk_free_rate) {
                Some(s) => s,
                None => continue,
            };
            let (percentile_drop, ema_drop) =
                match maxdrop::compute_max_drop_stats(&candles, period) {
                    Some(stats) => stats,
                    None => continue,
                };
            let vol = estimate_historical_volatility(&closes, config.vol_window);

            // Compute strike range
            let dte = period as u32;
            let trend_factor = config.compute_trend_factor(trend_short);
            let (min_strike, max_strike) = crate::option::calculate_adjusted_strike_range(
                price,
                percentile_drop,
                ema_drop,
                dte,
                period,
                trend_factor,
            );

            if min_strike <= 0.0 || max_strike <= 0.0 || max_strike <= min_strike {
                continue;
            }

            // Price range for strike percentile (last 20 days)
            let pp_start = candles
                .len()
                .saturating_sub(constants::PRICE_PERCENTILE_DAYS as usize);
            let pp_candles = &candles[pp_start..];
            let range_min = pp_candles
                .iter()
                .map(|c| c.close)
                .fold(f64::INFINITY, f64::min);
            let range_max = pp_candles
                .iter()
                .map(|c| c.close)
                .fold(f64::NEG_INFINITY, f64::max);

            // Generate strikes at $0.50 intervals
            let mut strike = (min_strike / 0.5).ceil() * 0.5;
            while strike <= max_strike {
                let t = dte as f64 / 252.0;
                let premium = black_scholes_put(
                    price,
                    strike,
                    t,
                    config.risk_free_rate,
                    config.dividend_yield,
                    vol,
                );
                if premium <= 0.0 {
                    strike += 0.5;
                    continue;
                }
                let rate_of_return = compute_rate_of_return(premium, strike, dte);
                let strike_pct =
                    model::calculate_strike_percentile(strike, range_min, range_max);
                let sector = crate::sectors::sector_of(sectors, symbol);

                match config.score_candidate(
                    sharpe_ratio,
                    strike_pct,
                    rate_of_return,
                    trend_short,
                    trend_long,
                    &regime,
                ) {
                    Some(score) => {
                        candidates.push((
                            symbol_idx,
                            score,
                            strike,
                            rate_of_return,
                            trend_short,
                            trend_long,
                            price,
                            sector,
                        ));
                    }
                    None => {}
                }
                strike += 0.5;
            }
        }

        // Rank by score descending
        candidates.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

        // Select top 3, dedup by symbol and sector
        let mut seen_symbols = std::collections::HashSet::new();
        let mut seen_sectors = std::collections::HashSet::new();
        let mut top_picks: Vec<(usize, f64, f64, f64, f64, f64, f64, &str)> = Vec::new();

        for candidate in &candidates {
            if top_picks.len() >= 3 {
                break;
            }
            let (symbol_idx, score, strike, ror, ts, tl, price, sector) = candidate;
            if seen_symbols.contains(symbol_idx) {
                continue;
            }
            if *sector != crate::sectors::UNKNOWN_SECTOR && seen_sectors.contains(*sector) {
                continue;
            }
            seen_symbols.insert(*symbol_idx);
            if *sector != crate::sectors::UNKNOWN_SECTOR {
                seen_sectors.insert(*sector);
            }
            top_picks.push(*candidate);
        }

        // Check assignment for each top pick
        let expiry_date = *sim_date + Duration::days(period as i64);
        let day_after = expiry_date + Duration::days(1);

        for (symbol_idx, score, strike, ror, ts, tl, price, sector) in &top_picks {
            let symbol = &symbols[*symbol_idx];
            let (close_expiry, close_day_after, assigned) =
                match candles_map.get(symbol) {
                    Some(candles) => {
                        let ec = find_close_on_date(candles, expiry_date);
                        let dac = find_close_on_date(candles, day_after);
                        let assigned = ec.map(|c| c < *strike).unwrap_or(false)
                            || dac.map(|c| c < *strike).unwrap_or(false);
                        (ec, dac, assigned)
                    }
                    None => (None, None, false),
                };

            picks.push(BacktestPick {
                sim_date: *sim_date,
                symbol: symbol.clone(),
                sector: sector.to_string(),
                strike: *strike,
                price_at_pick: *price,
                rate_of_return: *ror,
                score: *score,
                trend_short: *ts,
                trend_long: *tl,
                regime_flag: regime.flag.to_string(),
                assigned,
                close_at_expiry: close_expiry,
                close_day_after: close_day_after,
            });
        }
    }

    // Compute aggregate metrics
    let total_picks = picks.len();
    let assignment_count = picks.iter().filter(|p| p.assigned).count();
    let avg_rate_of_return = if total_picks > 0 {
        picks.iter().map(|p| p.rate_of_return).sum::<f64>() / total_picks as f64
    } else {
        0.0
    };
    let avg_score = if total_picks > 0 {
        picks.iter().map(|p| p.score).sum::<f64>() / total_picks as f64
    } else {
        0.0
    };
    let losses: Vec<f64> = picks
        .iter()
        .filter(|p| p.assigned)
        .map(|p| {
            let worst_close = match (p.close_at_expiry, p.close_day_after) {
                (Some(a), Some(b)) => a.min(b),
                (Some(a), None) => a,
                (None, Some(b)) => b,
                _ => p.strike,
            };
            (p.strike - worst_close) / p.strike
        })
        .collect();
    let avg_loss_when_assigned = if losses.is_empty() {
        0.0
    } else {
        losses.iter().sum::<f64>() / losses.len() as f64
    };

    BacktestMetrics {
        config_name: config.name.clone(),
        period: config.period,
        from_date,
        to_date,
        total_simulations: mondays.len(),
        total_picks,
        assignment_count,
        avg_rate_of_return,
        avg_score,
        avg_loss_when_assigned,
        picks,
    }
}

// ── Output Formatting ──────────────────────────────────────────

/// Format a single config's metrics for terminal output.
pub fn format_metrics(metrics: &BacktestMetrics) -> String {
    let mut out = String::new();
    let sep = "═".repeat(60);

    out.push_str(&format!("{}\n", sep));
    out.push_str(&format!("Config: {}\n", metrics.config_name));
    out.push_str(&format!(
        "Period: {}-day | From: {} | To: {}\n",
        metrics.period, metrics.from_date, metrics.to_date
    ));
    out.push_str(&format!(
        "Simulations: {} | Picks: {}\n",
        metrics.total_simulations, metrics.total_picks
    ));
    out.push_str(&format!("{}\n", "─".repeat(60)));
    out.push_str(&format!(
        "Assignment rate:    {:.1}% ({} / {})\n",
        metrics.assignment_rate() * 100.0,
        metrics.assignment_count,
        metrics.total_picks
    ));
    out.push_str(&format!(
        "Avg return:         {:.1}%\n",
        metrics.avg_rate_of_return * 100.0
    ));
    out.push_str(&format!("Avg score:          {:.2}\n", metrics.avg_score));
    out.push_str(&format!(
        "Avg loss (assigned): {:.1}% below strike\n",
        metrics.avg_loss_when_assigned * 100.0
    ));

    // Regime breakdown
    let bull_picks: Vec<&BacktestPick> = metrics
        .picks
        .iter()
        .filter(|p| p.regime_flag.is_empty())
        .collect();
    let corr_picks: Vec<&BacktestPick> = metrics
        .picks
        .iter()
        .filter(|p| p.regime_flag.contains("Correction"))
        .collect();
    let bear_picks: Vec<&BacktestPick> = metrics
        .picks
        .iter()
        .filter(|p| p.regime_flag.contains("Bear"))
        .collect();

    if !bull_picks.is_empty() || !corr_picks.is_empty() || !bear_picks.is_empty() {
        out.push_str("By regime:\n");
        if !bull_picks.is_empty() {
            let assigned = bull_picks.iter().filter(|p| p.assigned).count();
            let avg_ror = bull_picks.iter().map(|p| p.rate_of_return).sum::<f64>()
                / bull_picks.len() as f64;
            out.push_str(&format!(
                "  Bull ({}):       {:.1}% assignment, avg return {:.1}%\n",
                bull_picks.len(),
                assigned as f64 / bull_picks.len() as f64 * 100.0,
                avg_ror * 100.0
            ));
        }
        if !corr_picks.is_empty() {
            let assigned = corr_picks.iter().filter(|p| p.assigned).count();
            let avg_ror = corr_picks.iter().map(|p| p.rate_of_return).sum::<f64>()
                / corr_picks.len() as f64;
            out.push_str(&format!(
                "  Correction ({}): {:.1}% assignment, avg return {:.1}%\n",
                corr_picks.len(),
                assigned as f64 / corr_picks.len() as f64 * 100.0,
                avg_ror * 100.0
            ));
        }
        if !bear_picks.is_empty() {
            let assigned = bear_picks.iter().filter(|p| p.assigned).count();
            let avg_ror = bear_picks.iter().map(|p| p.rate_of_return).sum::<f64>()
                / bear_picks.len() as f64;
            out.push_str(&format!(
                "  Bear ({}):       {:.1}% assignment, avg return {:.1}%\n",
                bear_picks.len(),
                assigned as f64 / bear_picks.len() as f64 * 100.0,
                avg_ror * 100.0
            ));
        }
    }

    out.push_str(&format!("{}\n", sep));
    out
}

/// Write all metrics to a CSV file.
pub fn write_csv(path: &str, all_metrics: &[BacktestMetrics]) -> model::Result<()> {
    use std::io::Write;
    let mut file =
        std::fs::File::create(path).map_err(|e| model::QuotesError::CouldNotOpenFile(e))?;
    writeln!(
        file,
        "config,sim_date,symbol,sector,strike,price,rate_of_return,score,trend_short,trend_long,regime,assigned,close_at_expiry,close_day_after"
    )
    .map_err(|e| model::QuotesError::CouldNotOpenFile(e))?;;
    for metrics in all_metrics {
        for pick in &metrics.picks {
            writeln!(
                file,
                "{},{},{},{},{:.2},{:.2},{:.4},{:.3},{:.3},{:.3},{},{},{},{}",
                metrics.config_name,
                pick.sim_date,
                pick.symbol,
                pick.sector,
                pick.strike,
                pick.price_at_pick,
                pick.rate_of_return,
                pick.score,
                pick.trend_short,
                pick.trend_long,
                pick.regime_flag,
                pick.assigned,
                pick.close_at_expiry
                    .map(|v| format!("{:.2}", v))
                    .unwrap_or_default(),
                pick.close_day_after
                    .map(|v| format!("{:.2}", v))
                    .unwrap_or_default(),
            )
            .map_err(|e| model::QuotesError::CouldNotOpenFile(e))?;
        }
    }
    Ok(())
}

// ── Tests ──────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cumulative_normal_known_values() {
        // N(0) = 0.5
        assert!((cumulative_normal(0.0) - 0.5).abs() < 1e-7);
        // N(-inf) -> 0, N(+inf) -> 1
        assert!(cumulative_normal(-5.0) < 0.001);
        assert!(cumulative_normal(5.0) > 0.999);
        // N(1) ≈ 0.8413
        assert!((cumulative_normal(1.0) - 0.8413).abs() < 0.001);
        // Symmetry: N(-x) = 1 - N(x)
        let n2 = cumulative_normal(2.0);
        assert!((cumulative_normal(-2.0) - (1.0 - n2)).abs() < 1e-7);
    }

    #[test]
    fn test_bs_put_at_the_money() {
        // ATM put with 1 year, 20% vol, 5% rate, no dividend
        let price = black_scholes_put(100.0, 100.0, 1.0, 0.05, 0.0, 0.20);
        // Should be positive and reasonable (roughly $5-$10)
        assert!(
            price > 0.0,
            "put price should be positive, got {}",
            price
        );
        assert!(
            price < 15.0,
            "put price should be < 15 for 20% vol ATM, got {}",
            price
        );
    }

    #[test]
    fn test_bs_put_deep_otm_is_cheap() {
        // Deep OTM: strike 50, spot 100
        let price = black_scholes_put(100.0, 50.0, 0.04, 0.05, 0.0, 0.20);
        // Should be nearly zero
        assert!(price < 0.01, "deep OTM put should be near 0, got {}", price);
    }

    #[test]
    fn test_bs_put_deep_itm_is_intrinsic() {
        // Deep ITM: strike 150, spot 100, short dated
        let price = black_scholes_put(100.0, 150.0, 0.02, 0.05, 0.0, 0.20);
        let intrinsic = 150.0 - 100.0; // 50
        // Price should be close to discounted intrinsic
        assert!(
            (price - intrinsic).abs() / intrinsic < 0.05,
            "deep ITM put should be near intrinsic, got {} vs {}",
            price,
            intrinsic
        );
    }

    #[test]
    fn test_bs_put_zero_expiry() {
        let price = black_scholes_put(100.0, 90.0, 0.0, 0.05, 0.0, 0.20);
        assert_eq!(price, 0.0, "zero expiry should return 0");
    }

    #[test]
    fn test_bs_put_higher_vol_higher_premium() {
        let low_vol = black_scholes_put(100.0, 90.0, 0.1, 0.05, 0.0, 0.15);
        let high_vol = black_scholes_put(100.0, 90.0, 0.1, 0.05, 0.0, 0.40);
        assert!(
            high_vol > low_vol,
            "higher vol should give higher put premium: {} vs {}",
            high_vol,
            low_vol
        );
    }

    #[test]
    fn test_estimate_volatility_trending() {
        // Simulate realistic daily returns with ~30% annualized vol
        // Using alternating +2%/-1% days gives ~1.5% avg daily move
        let mut closes = vec![100.0];
        for i in 1..31 {
            let ret = if i % 2 == 0 { 0.02 } else { -0.01 };
            closes.push(closes.last().unwrap() * (1.0 + ret));
        }
        let vol = estimate_historical_volatility(&closes, 20);
        // Should be positive and reasonable (20%-60% annualized)
        assert!(
            vol > 0.15 && vol < 0.80,
            "vol should be 15-80% for alternating returns, got {:.4}",
            vol
        );
    }

    #[test]
    fn test_estimate_volatility_insufficient_data() {
        let closes = vec![100.0, 101.0];
        let vol = estimate_historical_volatility(&closes, 20);
        assert_eq!(
            vol, 0.30,
            "should return default 30% for insufficient data"
        );
    }

    #[test]
    fn test_compute_rate_of_return_matches_tiger_formula() {
        // premium=2.50, strike=100, dte=5 → 1 week
        let ror = compute_rate_of_return(2.50, 100.0, 5);
        // num_of_weeks(5) = 1.0, so ror = 2.5/100/1.0*52 = 1.30
        assert!(
            (ror - 1.30).abs() < 0.01,
            "rate_of_return should be ~1.30, got {:.4}",
            ror
        );
    }

    #[test]
    fn test_compute_rate_of_return_20_day() {
        // premium=3.00, strike=100, dte=20 → num_of_weeks(20) = 2 + 6/5 = 3.2
        let ror = compute_rate_of_return(3.00, 100.0, 20);
        let expected = 3.0 / 100.0 / 3.2 * 52.0;
        assert!(
            (ror - expected).abs() < 0.001,
            "rate_of_return should be {:.4}, got {:.4}",
            expected,
            ror
        );
    }

    #[test]
    fn test_control_config_trend_factor_matches_model() {
        let config = BacktestConfig::control();
        // At 1.05, model returns 0.90 — config should match
        let model_factor = model::calculate_trend_factor(1.05);
        let config_factor = config.compute_trend_factor(1.05);
        assert!(
            (model_factor - config_factor).abs() < 1e-10,
            "control config should match model: model={}, config={}",
            model_factor,
            config_factor
        );
    }

    #[test]
    fn test_no_trend_factor_always_one() {
        let config = BacktestConfig::no_trend_factor();
        assert_eq!(config.compute_trend_factor(1.05), 1.0);
        assert_eq!(config.compute_trend_factor(1.20), 1.0);
    }

    #[test]
    fn test_no_regime_always_bull() {
        let config = BacktestConfig::no_regime();
        let regime = config.build_regime(0.92); // Even deep bear
        assert_eq!(regime.flag, "", "no-regime should always be bull");
    }

    #[test]
    fn test_score_rejects_below_min_return() {
        let config = BacktestConfig::control();
        let regime = config.build_regime(1.05);
        let result = config.score_candidate(1.5, 0.1, 0.10, 1.03, 1.04, &regime);
        assert!(
            result.is_none(),
            "should reject rate_of_return below 0.25"
        );
    }

    #[test]
    fn test_score_accepts_valid() {
        let config = BacktestConfig::control();
        let regime = config.build_regime(1.05);
        let result = config.score_candidate(1.5, 0.1, 0.35, 1.03, 1.04, &regime);
        assert!(result.is_some(), "should accept valid candidate");
        let score = result.unwrap();
        assert!(
            score > 0.0 && score <= 1.0,
            "score should be in [0,1], got {}",
            score
        );
    }

    #[test]
    fn test_all_presets_have_valid_names() {
        for config in BacktestConfig::all_presets() {
            assert!(!config.name.is_empty(), "preset name should not be empty");
            assert!(
                !config.name.contains(' '),
                "preset name should not have spaces: {}",
                config.name
            );
        }
    }

    #[test]
    fn test_by_name_finds_presets() {
        assert!(BacktestConfig::by_name("control").is_some());
        assert!(BacktestConfig::by_name("no-trend-factor").is_some());
        assert!(BacktestConfig::by_name("nonexistent").is_none());
    }
}
