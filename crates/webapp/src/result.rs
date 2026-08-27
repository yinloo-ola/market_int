//! The result document (design spec §4): the frozen latest-run JSON contract,
//! its builder from [`market_int_core::pipeline::PerformAllOutcome`], the
//! atomic write rule, and the read-retry-once cache loader.
//!
//! Field names are frozen — they are the frontend contract; additive fields
//! allowed, renames not. All non-finite floats (`NaN`, `±∞`) serialize as
//! `null` via [`finite`], applied to every float at build time.

use std::io;
use std::path::Path;

use chrono::{DateTime, SecondsFormat, Utc};
use chrono_tz::America::New_York;
use market_int_core::model::{ScoredChainRow, TopPick};
use market_int_core::pipeline::{PerformAllOutcome, ScoredTimeframe};
use serde::{Deserialize, Serialize};

pub const SCHEMA_VERSION: u64 = 1;

/// Sanitizes a float for serialization: non-finite values become `null`.
fn finite(v: f64) -> Option<f64> {
    if v.is_finite() {
        Some(v)
    } else {
        None
    }
}

// ── DTO ────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResultDocument {
    pub schema_version: u64,
    pub thresholds: Thresholds,
    pub run: RunBlock,
    pub stages: Vec<StageDoc>,
    /// `None` only on the fatal path — the key is absent there (spec §3.4).
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeframes: Option<Timeframes>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Thresholds {
    pub vol_tier_high: f64,
    pub vol_tier_mid: f64,
    pub momentum_high: f64,
    pub momentum_extended: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RunBlock {
    pub started_at_utc: String,
    pub finished_at_utc: String,
    pub duration_secs: u64,
    pub market_date_ny: String,
    pub triggered_by: String,
    pub symbols_requested: usize,
    pub symbols_succeeded: usize,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StageDoc {
    pub name: String,
    pub status: String,
    pub duration_secs: u64,
    /// Explicit `null` when none — field-complete frozen column.
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Timeframes {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short: Option<TimeframeDoc>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub medium: Option<TimeframeDoc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimeframeDoc {
    pub expiration: String,
    pub row_count: usize,
    pub symbols_with_chains: usize,
    pub rows: Vec<Row>,
    pub top_picks: Vec<TopPickDoc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Components {
    pub sharpe: Option<f64>,
    pub safety: Option<f64>,
    /// JSON key is `return`; core names it `return_part`.
    #[serde(rename = "return")]
    pub return_part: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EarningsDoc {
    pub report_date: String,
    pub report_time: String,
    pub expected_eps: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Row {
    pub underlying: String,
    pub sector: String,
    pub strike: Option<f64>,
    pub underlying_price: Option<f64>,
    /// Always `"put"` today.
    pub side: String,
    pub bid: Option<f64>,
    pub mid: Option<f64>,
    pub ask: Option<f64>,
    pub bid_size: u32,
    pub ask_size: u32,
    pub expiration: String,
    pub volume: u32,
    pub open_interest: u32,
    pub rate_of_return: Option<f64>,
    pub strike_from: Option<f64>,
    pub strike_to: Option<f64>,
    pub sharpe_ratio: Option<f64>,
    pub strike_percentile: Option<f64>,
    pub score: Option<f64>,
    pub score_components: Option<Components>,
    pub price_percentile: Option<f64>,
    /// Explicit `null` when absent — one of the frozen 27 columns.
    pub earnings_before_expiry: Option<EarningsDoc>,
    pub trend_short: Option<f64>,
    pub trend_long: Option<f64>,
    pub realized_vol: Option<f64>,
    pub implied_vol: Option<f64>,
    pub delta: Option<f64>,
    pub iv_rv_ratio: Option<f64>,
}

impl From<&ScoredChainRow> for Row {
    fn from(r: &ScoredChainRow) -> Self {
        debug_assert!(
            matches!(r.side, market_int_core::model::OptionChainSide::Put),
            "result document schema documents puts; got {:?}",
            r.side
        );
        Row {
            underlying: r.underlying.clone(),
            sector: r.sector.clone(),
            strike: finite(r.strike),
            underlying_price: finite(r.underlying_price),
            side: String::from(&r.side),
            bid: finite(r.bid),
            mid: finite(r.mid),
            ask: finite(r.ask),
            bid_size: r.bid_size,
            ask_size: r.ask_size,
            expiration: r.expiration.clone(),
            volume: r.volume,
            open_interest: r.open_interest,
            rate_of_return: finite(r.rate_of_return),
            strike_from: finite(r.strike_from),
            strike_to: finite(r.strike_to),
            sharpe_ratio: finite(r.sharpe_ratio),
            strike_percentile: r.strike_percentile.and_then(finite),
            score: r.score.and_then(finite),
            // Sanitization is uniform across every float, components included
            // (module doc): today the scorer cannot emit non-finite parts, but
            // the contract if it ever did is null — never a fabricated 0.0.
            score_components: r.score_components.map(|c| Components {
                sharpe: finite(c.sharpe),
                safety: finite(c.safety),
                return_part: finite(c.return_part),
            }),
            price_percentile: r.price_percentile.and_then(finite),
            earnings_before_expiry: r.earnings_before_expiry.as_ref().map(|e| EarningsDoc {
                report_date: e.report_date.clone(),
                report_time: e.report_time.clone(),
                expected_eps: e.expected_eps.and_then(finite),
            }),
            trend_short: r.trend_short.and_then(finite),
            trend_long: r.trend_long.and_then(finite),
            realized_vol: r.realized_vol.and_then(finite),
            implied_vol: r.implied_vol.and_then(finite),
            delta: r.delta.and_then(finite),
            iv_rv_ratio: r.iv_rv_ratio.and_then(finite),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TopPickDoc {
    pub rank: usize,
    pub underlying: String,
    pub sector: String,
    pub strike: Option<f64>,
    pub bid: Option<f64>,
    pub ask: Option<f64>,
    pub rate_of_return: Option<f64>,
    pub score: Option<f64>,
    pub sharpe: Option<f64>,
    pub price_percentile: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub earnings: Option<EarningsDoc>,
    pub trend_short: Option<f64>,
    pub trend_long: Option<f64>,
    pub realized_vol: Option<f64>,
}

impl From<&TopPick> for TopPickDoc {
    fn from(p: &TopPick) -> Self {
        TopPickDoc {
            rank: p.rank,
            underlying: p.underlying.clone(),
            sector: p.sector.clone(),
            strike: finite(p.strike),
            bid: finite(p.bid),
            ask: finite(p.ask),
            rate_of_return: finite(p.rate_of_return),
            score: finite(p.score),
            sharpe: finite(p.sharpe),
            price_percentile: p.price_percentile.and_then(finite),
            earnings: p.earnings.as_ref().map(|e| EarningsDoc {
                report_date: e.report_date.clone(),
                report_time: e.report_time.clone(),
                expected_eps: e.expected_eps.and_then(finite),
            }),
            trend_short: p.trend_short.and_then(finite),
            trend_long: p.trend_long.and_then(finite),
            realized_vol: p.realized_vol.and_then(finite),
        }
    }
}

// ── Builder ────────────────────────────────────────────────────

/// Builds the latest-run document from a completed pipeline outcome. The run
/// clock comes from the outcome itself; `finished_at_utc` is the cache anchor
/// (spec §4.3). Timeframe objects appear exactly when their stage produced
/// data (i.e., retrieval returned and no publish hook consumed it).
pub fn build_document(outcome: &PerformAllOutcome) -> ResultDocument {
    let stage_doc = |report: &market_int_core::pipeline::StageReport| StageDoc {
        name: doc_stage_name(report.stage),
        status: doc_status_name(report.status).to_string(),
        duration_secs: report.duration_secs,
        error: report.error.clone(),
    };

    let timeframes = Timeframes {
        short: outcome.short.as_ref().map(timeframe_doc),
        medium: outcome.medium.as_ref().map(timeframe_doc),
    };

    let finished_ny = outcome.finished_at.with_timezone(&New_York);
    ResultDocument {
        schema_version: SCHEMA_VERSION,
        thresholds: thresholds_block(),
        run: RunBlock {
            started_at_utc: rfc3339(outcome.started_at),
            finished_at_utc: rfc3339(outcome.finished_at),
            duration_secs: (outcome.finished_at - outcome.started_at)
                .num_seconds()
                .max(0) as u64,
            market_date_ny: finished_ny.format("%Y-%m-%d").to_string(),
            triggered_by: "web".to_string(),
            symbols_requested: outcome.symbols_requested,
            symbols_succeeded: outcome.symbols_succeeded,
            error: None,
        },
        stages: outcome.stages.iter().map(stage_doc).collect(),
        timeframes: Some(timeframes),
    }
}

/// The fatal-path document (spec §3.4): valid, empty stages, `run.error` set,
/// no timeframe objects at all. Written by the run handler when
/// `perform_all` returns its sole outer error.
pub fn failure_document(started_at: DateTime<Utc>, error: &str) -> ResultDocument {
    let finished_at = Utc::now();
    let finished_ny = finished_at.with_timezone(&New_York);
    ResultDocument {
        schema_version: SCHEMA_VERSION,
        thresholds: thresholds_block(),
        run: RunBlock {
            started_at_utc: rfc3339(started_at),
            finished_at_utc: rfc3339(finished_at),
            duration_secs: (finished_at - started_at).num_seconds().max(0) as u64,
            market_date_ny: finished_ny.format("%Y-%m-%d").to_string(),
            triggered_by: "web".to_string(),
            symbols_requested: 0,
            symbols_succeeded: 0,
            error: Some(error.to_string()),
        },
        stages: Vec::new(),
        timeframes: None,
    }
}

fn timeframe_doc(stf: &ScoredTimeframe) -> TimeframeDoc {
    TimeframeDoc {
        expiration: stf.rows.first().map(|r| r.expiration.clone()).unwrap_or_default(),
        row_count: stf.row_count,
        symbols_with_chains: stf.symbols_with_chains,
        rows: stf.rows.iter().map(Row::from).collect(),
        top_picks: stf.top_picks.iter().map(TopPickDoc::from).collect(),
    }
}

fn thresholds_block() -> Thresholds {
    Thresholds {
        vol_tier_high: market_int_core::constants::VOL_TIER_HIGH,
        vol_tier_mid: market_int_core::constants::VOL_TIER_MID,
        momentum_high: market_int_core::constants::MOMENTUM_HIGH_THRESHOLD,
        momentum_extended: market_int_core::constants::MOMENTUM_EXTENDED_THRESHOLD,
    }
}

fn rfc3339(t: DateTime<Utc>) -> String {
    t.to_rfc3339_opts(SecondsFormat::Secs, true)
}

/// Document vocabulary uses underscores ("chains_short"), unlike log labels.
/// Also feeds the SSE stream frames (spec §3.3 freezes these exact names).
pub(crate) fn doc_stage_name(stage: market_int_core::pipeline::Stage) -> String {
    use market_int_core::pipeline::Stage::*;
    match stage {
        Quotes => "quotes".to_string(),
        Metrics => "metrics".to_string(),
        ChainsShort => "chains_short".to_string(),
        ChainsMedium => "chains_medium".to_string(),
    }
}

pub(crate) fn doc_status_name(status: market_int_core::pipeline::StageStatus) -> &'static str {
    use market_int_core::pipeline::StageStatus::*;
    match status {
        Ok => "ok",
        Partial => "partial",
        Failed => "failed",
    }
}

// ── IO: atomic write + retry-once read ─────────────────────────

/// Atomic write per spec §4.3: serialize compact → temp file in the same
/// directory → flush + fsync → rename over the target → best-effort
/// directory fsync.
pub fn write_document(path: &Path, document: &ResultDocument) -> io::Result<()> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)?;
    }

    let bytes = serde_json::to_vec(document)
        .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;

    let tmp_path = path.with_file_name(format!(
        ".{}.tmp.{}",
        path.file_name()
            .map(|n| n.to_string_lossy().into_owned())
            .unwrap_or_else(|| "last_run.json".to_string()),
        std::process::id()
    ));

    {
        use std::io::Write;
        let mut file = std::fs::File::create(&tmp_path)?;
        file.write_all(&bytes)?;
        file.sync_all()?;
    }

    std::fs::rename(&tmp_path, path)?;

    // Best-effort directory fsync so the rename itself persists.
    if let Some(parent) = path.parent() {
        if let Ok(dir) = std::fs::File::open(parent) {
            let _ = dir.sync_all();
        }
    }
    Ok(())
}

/// Cache loader per spec §4.3: on parse failure re-read once after ~500 ms;
/// still invalid → treated as "no valid run yet" (`None`). Reads happen once
/// per cache window; the async server wraps this in `spawn_blocking` later.
pub fn read_document(path: &Path) -> Option<ResultDocument> {
    use std::io::ErrorKind;
    for attempt in 0..2 {
        match std::fs::read(path) {
            Ok(bytes) => match serde_json::from_slice::<ResultDocument>(&bytes) {
                Ok(doc) => return Some(doc),
                // Parse failure on an existing file → single retry (§4.3).
                Err(_) if attempt == 0 => {}
                Err(_) => return None,
            },
            // A missing file is not a collision: no valid run yet, no retry.
            Err(e) if e.kind() == ErrorKind::NotFound => return None,
            Err(_) if attempt == 0 => {}
            Err(_) => return None,
        }
        std::thread::sleep(std::time::Duration::from_millis(500));
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use market_int_core::model::{EarningsInfo, ScoreComponents};
    use market_int_core::pipeline::{Stage, StageReport, StageStatus};
    use std::collections::HashSet;

    // ── helpers ────────────────────────────────────────────────

    fn t(epoch: i64) -> DateTime<Utc> {
        chrono::TimeZone::timestamp_opt(&Utc, epoch, 0).unwrap()
    }

    fn chain_row(underlying: &str, strike: f64, score: Option<f64>) -> ScoredChainRow {
        let parts = score.map(|total| ScoreComponents {
            sharpe: total * 0.2,
            safety: total * 0.4,
            return_part: total * 0.4,
        });
        ScoredChainRow {
            underlying: underlying.to_string(),
            sector: "Technology".to_string(),
            strike,
            underlying_price: strike * 1.2,
            side: market_int_core::model::OptionChainSide::Put,
            bid: strike * 0.02,
            mid: strike * 0.021,
            ask: strike * 0.022,
            bid_size: 10,
            ask_size: 10,
            expiration: "2026-09-04".to_string(),
            volume: 100,
            open_interest: 500,
            rate_of_return: 0.35,
            strike_from: strike * 0.9,
            strike_to: strike * 0.96,
            sharpe_ratio: 1.5,
            strike_percentile: Some(0.4),
            score,
            score_components: if score.is_some() { parts } else { None },
            price_percentile: Some(0.81),
            earnings_before_expiry: None,
            raw_earnings_in_window: None,
            trend_short: Some(1.036),
            trend_long: Some(1.089),
            realized_vol: Some(0.452),
            implied_vol: Some(0.481),
            delta: Some(-0.28),
            iv_rv_ratio: Some(1.06),
        }
    }

    fn stf(rows: Vec<ScoredChainRow>, period: usize) -> ScoredTimeframe {
        ScoredTimeframe {
            period,
            csv: Vec::new(),
            symbols_with_chains: rows.len(),
            row_count: rows.len(),
            top_picks: vec![],
            rows,
        }
    }

    fn sample_outcome(short_rows: Vec<ScoredChainRow>) -> PerformAllOutcome {
        PerformAllOutcome {
            started_at: t(1_787_881_331), // 2026-08-27 13:02:11 UTC
            finished_at: t(1_787_881_666),
            stages: vec![],
            short: Some(stf(short_rows, 5)),
            medium: None,
            symbols_requested: 232,
            symbols_succeeded: 229,
        }
    }

    fn assert_no_nonfinite_tokens(json: &str) {
        assert!(!json.contains("NaN"), "NaN leaked into document");
        assert!(!json.contains("inf"), "inf leaked into document");
    }

    // ── scenario: sanitization ─────────────────────────────────

    #[test]
    fn nan_score_and_infinite_vol_roundtrip_as_null() {
        let mut row = chain_row("NVDA", 175.0, Some(0.59));
        row.realized_vol = Some(f64::INFINITY);
        row.score = Some(f64::NAN);
        row.score_components = None;

        let outcome = sample_outcome(vec![row]);
        let doc = build_document(&outcome);
        let path = tempfile::tempdir().unwrap().path().join("last_run.json");
        write_document(&path, &doc).unwrap();
        let json = std::fs::read_to_string(&path).unwrap();
        assert_no_nonfinite_tokens(&json);

        let parsed = read_document(&path).expect("roundtrip parse");
        let nvda = &parsed.timeframes.as_ref().unwrap().short.as_ref().unwrap().rows[0];
        assert!(nvda.score.is_none(), "NaN score must serialize as null");
        assert!(
            nvda.score_components.is_none(),
            "components must be null exactly when score is null"
        );
        assert!(nvda.realized_vol.is_none(), "±∞ realized vol must be null");
        assert_eq!(nvda.strike, Some(175.0));
        assert!(nvda.bid.is_some());
    }

    // ── scenario: component sums conserved across grid + DTO ────

    #[test]
    fn components_sum_to_total_across_fixture_grid() {
        let regime = market_int_core::regime::MarketRegime::from_spy_trend(
            market_int_core::constants::PERFORM_ALL_SPY_TREND_RATIO,
        );
        let mut checked = 0;
        for sh in [0.5, 1.0, 2.5] {
            for sf in [0.1, 0.55, 1.0] {
                for ror in [0.30, 0.45, 0.80] {
                    let scored =
                        market_int_core::model::calculate_put_chain_score_components(
                            sh, 95.0, 90.0, 96.0, ror, 1.05, &regime, false, Some(-0.2),
                            Some(0.4), 0.0, Default::default(),
                        );
                    if let Some((total, comps)) = scored {
                        // The single-path invariant itself:
                        let sum = comps.sharpe + comps.safety + comps.return_part;
                        assert!((sum - total).abs() < 1e-9, "{sum} vs {total}");
                        // Builder conserves the numbers verbatim:
                        let mut row = chain_row("X", 95.0, Some(total));
                        row.score_components = Some(comps);
                        let dto_row = Row::from(&row);
                        let c = dto_row.score_components.unwrap();
                        let parts = [c.sharpe, c.safety, c.return_part];
                        let all_some: Option<Vec<f64>> = parts.into_iter().collect();
                        let sum_dto: f64 = all_some.unwrap().iter().sum();
                        assert!((sum_dto - dto_row.score.unwrap()).abs() < 1e-9);
                        checked += 1;
                    }
                }
            }
        }
        assert!(checked >= 18, "grid should score plenty of combos, got {checked}");
    }

    // ── scenario: truncated file triggers the read-retry fallback ──

    #[test]
    fn truncated_file_falls_back_to_none_after_single_retry() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");

        write_document(&path, &build_document(&sample_outcome(vec![chain_row("NVDA", 175.0, Some(0.59))])))
            .unwrap();

        // Simulate a crash mid-write: keep roughly half the bytes.
        let bytes = std::fs::read(&path).unwrap();
        std::fs::write(&path, &bytes[..bytes.len() / 2]).unwrap();

        let began = std::time::Instant::now();
        let result = read_document(&path);
        assert!(result.is_none(), "truncated file must read as no-valid-run");
        assert!(
            began.elapsed() >= std::time::Duration::from_millis(450),
            "expected one ~500ms retry before giving up"
        );
    }

    // ── scenario: fatal-path document shape ────────────────────

    #[test]
    fn failure_document_is_valid_with_empty_stages_and_no_timeframes_key() {
        let doc = failure_document(t(1_787_881_331), "Failed to initialize Tiger API requester");
        let json = serde_json::to_string(&doc).unwrap();

        assert!(!json.contains("\"timeframes\""), "timeframes key must be absent: {json}");
        assert!(json.contains("Failed to initialize Tiger API requester"));
        assert!(json.contains("\"stages\":[]"));
        assert!(json.contains("\"triggered_by\":\"web\""));

        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        write_document(&path, &doc).unwrap();
        let parsed = read_document(&path).unwrap();
        assert_eq!(
            parsed.run.error.as_deref(),
            Some("Failed to initialize Tiger API requester")
        );
        assert!(parsed.timeframes.is_none());
    }

    // ── scenario: builder status/name vocabulary + earnings object ──

    #[test]
    fn builder_maps_status_vocabulary_and_structured_earnings() {
        let mut row = chain_row("NVDA", 175.0, Some(0.59));
        row.earnings_before_expiry = Some(EarningsInfo {
            report_date: "2026-08-31".to_string(),
            report_time: "after_close".to_string(),
            expected_eps: Some(1.24),
        });
        let mut outcome = sample_outcome(vec![row]);
        outcome.stages = vec![
            StageReport { stage: Stage::Quotes, status: StageStatus::Partial, error: Some("3 symbol(s) failed: XYZ".into()), duration_secs: 92 },
            StageReport { stage: Stage::Metrics, status: StageStatus::Ok, error: None, duration_secs: 3 },
            StageReport { stage: Stage::ChainsShort, status: StageStatus::Ok, error: None, duration_secs: 118 },
        ];
        let doc = build_document(&outcome);
        assert_eq!(doc.stages[0].name, "quotes");
        assert_eq!(doc.stages[0].status, "partial");
        assert_eq!(doc.stages[2].name, "chains_short");

        let json = serde_json::to_value(&doc).unwrap();
        let earnings = &json["timeframes"]["short"]["rows"][0]["earnings_before_expiry"];
        assert_eq!(earnings["report_time"], "after_close");
        assert_eq!(earnings["expected_eps"], serde_json::json!(1.24));

        let comps = &json["timeframes"]["short"]["rows"][0]["score_components"];
        assert!(comps.get("return").is_some(), "'return' key must exist");
        assert!(comps.get("return_part").is_none());
    }

    // ── dev fixture for ticket 15's browser demo ───────────────

    /// Regenerates crates/webapp/fixtures/sample_last_run.json deterministically
    /// (fixed clocks; stable synthetic data) so the frontend demo always has a
    /// schema-valid document to render.
    #[test]
    fn regenerate_sample_last_run_fixture() {
        fn pick(rank: usize, row: &ScoredChainRow) -> TopPickDoc {
            TopPickDoc {
                rank,
                underlying: row.underlying.clone(),
                sector: row.sector.clone(),
                strike: finite(row.strike),
                bid: finite(row.bid),
                ask: finite(row.ask),
                rate_of_return: finite(row.rate_of_return),
                score: row.score.and_then(finite),
                sharpe: finite(row.sharpe_ratio),
                price_percentile: row.price_percentile.and_then(finite),
                earnings: row.earnings_before_expiry.as_ref().map(|e| EarningsDoc {
                    report_date: e.report_date.clone(),
                    report_time: e.report_time.clone(),
                    expected_eps: e.expected_eps.and_then(finite),
                }),
                trend_short: row.trend_short,
                trend_long: row.trend_long,
                realized_vol: row.realized_vol,
            }
        }

        let mut nvda = chain_row("NVDA", 175.0, Some(0.5941234567890123));
        nvda.expiration = "2026-09-02".to_string();
        nvda.sector = "Technology".to_string();
        nvda.rate_of_return = 0.624;
        nvda.sharpe_ratio = 1.83;
        nvda.strike_percentile = Some(0.412);
        nvda.price_percentile = Some(0.81);
        nvda.bid = 2.05;
        nvda.mid = 2.10;
        nvda.ask = 2.15;
        nvda.volume = 352;
        nvda.open_interest = 1204;
        nvda.underlying_price = 206.84;
        nvda.strike_from = 170.0;
        nvda.strike_to = 192.5;
        nvda.realized_vol = Some(0.452);
        nvda.implied_vol = Some(0.481);
        nvda.iv_rv_ratio = Some(1.0642);
        nvda.earnings_before_expiry = Some(EarningsInfo {
            report_date: "2026-08-31".to_string(),
            report_time: "after_close".to_string(),
            expected_eps: Some(1.24),
        });

        let mut xom = chain_row("XOM", 48.0, None);
        xom.sector = "Energy".to_string();
        xom.expiration = "2026-09-16".to_string();
        xom.underlying_price = 51.23;
        xom.bid = 0.45;
        xom.mid = 0.525;
        xom.ask = 0.60;
        xom.bid_size = 44;
        xom.ask_size = 19;
        xom.volume = 1204;
        xom.open_interest = 8832;
        xom.rate_of_return = 0.1777;
        xom.strike_from = 44.0;
        xom.strike_to = 51.0;
        xom.sharpe_ratio = 0.0;
        xom.strike_percentile = None;
        xom.price_percentile = None;
        xom.trend_short = None;
        xom.trend_long = None;
        xom.realized_vol = None;
        xom.implied_vol = None;
        xom.delta = None;
        xom.iv_rv_ratio = None;

        let mut aapl = chain_row("AAPL", 210.0, Some(0.512));
        aapl.expiration = "2026-09-02".to_string();
        aapl.sector = "Technology".to_string();

        let mut outcome = sample_outcome(vec![nvda.clone(), aapl]);
        outcome.medium = Some(stf(vec![xom], 20));
        outcome.medium.as_mut().unwrap().period = 20;

        let mut doc = build_document(&outcome);
        if let Some(tf) = doc.timeframes.as_mut() {
            tf.short.as_mut().unwrap().expiration = "2026-09-02".to_string();
            tf.short.as_mut().unwrap().row_count = 1842;
            tf.short.as_mut().unwrap().symbols_with_chains = 171;
            tf.medium.as_mut().unwrap().expiration = "2026-09-16".to_string();
            tf.medium.as_mut().unwrap().row_count = 913;
            tf.medium.as_mut().unwrap().symbols_with_chains = 198;
        } else {
            panic!("fixture needs timeframes");
        }
        doc.timeframes.as_mut().unwrap().short.as_mut().unwrap().top_picks = vec![pick(1, &nvda)];

        doc.run.started_at_utc = "2026-08-27T13:02:11Z".to_string();
        doc.run.finished_at_utc = "2026-08-27T13:07:46Z".to_string();
        doc.run.duration_secs = 335;
        doc.run.market_date_ny = "2026-08-27".to_string();
        doc.stages = vec![
            StageDoc { name: "quotes".into(), status: "partial".into(), duration_secs: 92, error: Some("3 symbols failed: XYZ, ABC, QQQ".into()) },
            StageDoc { name: "metrics".into(), status: "ok".into(), duration_secs: 3, error: None },
            StageDoc { name: "chains_short".into(), status: "ok".into(), duration_secs: 118, error: None },
            StageDoc { name: "chains_medium".into(), status: "ok".into(), duration_secs: 122, error: None },
        ];

        let fixtures_dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("fixtures");
        std::fs::create_dir_all(&fixtures_dir).unwrap();
        let pretty = serde_json::to_string_pretty(&doc).unwrap();
        std::fs::write(fixtures_dir.join("sample_last_run.json"), pretty + "\n").unwrap();

        // It must also survive the full compact read path.
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        write_document(&path, &doc).unwrap();
        let parsed = read_document(&path).unwrap();
        assert_eq!(parsed.schema_version, SCHEMA_VERSION);
        assert_eq!(parsed.timeframes.unwrap().short.unwrap().rows.len(), 2);

        // Silence unused-import warnings if helpers shift during review.
        let _ = HashSet::<String>::new();
    }
}
