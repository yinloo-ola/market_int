//! `/api/latest` — the one endpoint that carries rows (spec §3.2).
//!
//! Pure local file read; never touches upstream APIs. Serves whatever the
//! result file holds — fresh, stale, failed, or nothing — with the age and
//! cache state computed server-side so the frontend never parses timestamps
//! or hardcodes the window.

use std::path::PathBuf;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::result::{read_document, ResultDocument};

#[derive(Debug, Clone, Serialize)]
pub struct LatestEnvelope {
    pub schema_version: u64,
    /// `None` ⇒ there is no usable clock (`cache_state: "none"`).
    pub age_secs: Option<u64>,
    pub cache_secs: u64,
    /// `"fresh"` (age < WEBAPP_CACHE_SECS) | `"stale"` | `"none"`.
    /// "none" means no clock (no file / unparseable), NOT "the run failed" —
    /// failed runs still serve their document as stale/fresh per §3.2.
    pub cache_state: &'static str,
    /// Live single-flight state; idle until ticket 18 wires runs.
    pub run_state: RunStateView,
    /// The §4 document exactly as on disk, enveloped — or `null`.
    pub result: Option<ResultDocument>,
}

#[derive(Debug, Clone, Serialize)]
pub struct RunStateView {
    pub status: &'static str,
}

#[derive(Clone)]
pub struct AppState {
    pub result_path: PathBuf,
}

pub fn build_router(state: AppState) -> axum::Router {
    axum::Router::new()
        .route("/api/latest", axum::routing::get(latest))
        .with_state(state)
}

fn envelope_for(result_path: &std::path::Path) -> LatestEnvelope {
    let no_clock = || LatestEnvelope {
        schema_version: crate::result::SCHEMA_VERSION,
        age_secs: None,
        cache_secs: market_int_core::constants::WEBAPP_CACHE_SECS,
        cache_state: "none",
        run_state: RunStateView { status: "idle" },
        result: None,
    };

    let Some(doc) = read_document(result_path) else {
        return no_clock(); // missing or unparseable file
    };
    // Present but clockless also counts as nothing usable (spec §5).
    let Ok(finished) = doc.run.finished_at_utc.parse::<DateTime<Utc>>() else {
        return no_clock();
    };
    let age_secs = (Utc::now() - finished).num_seconds().max(0) as u64;
    let cache_state = if age_secs < market_int_core::constants::WEBAPP_CACHE_SECS {
        "fresh"
    } else {
        "stale"
    };
    LatestEnvelope {
        schema_version: crate::result::SCHEMA_VERSION,
        age_secs: Some(age_secs),
        cache_secs: market_int_core::constants::WEBAPP_CACHE_SECS,
        cache_state,
        run_state: RunStateView { status: "idle" },
        result: Some(doc),
    }
}

async fn latest(State(state): State<AppState>) -> impl IntoResponse {
    // Always 200: one status code, one parse path; no-data branches on
    // `result === null` client-side (§3.2 rejects a 404 shape).
    (StatusCode::OK, Json(envelope_for(&state.result_path))).into_response()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::result::{build_document, write_document};
    use axum::body::Body;
    use chrono::TimeZone;
    use market_int_core::model::ScoredChainRow;
    use market_int_core::pipeline::{PerformAllOutcome, ScoredTimeframe};
    use tower::ServiceExt;

    fn utc_at(t: i64) -> DateTime<Utc> {
        chrono::TimeZone::timestamp_opt(&Utc, t, 0).unwrap()
    }

    fn sample_outcome(finished: DateTime<Utc>) -> PerformAllOutcome {
        let row = ScoredChainRow {
            underlying: "NVDA".to_string(),
            sector: "Technology".to_string(),
            strike: 175.0,
            underlying_price: 206.84,
            side: market_int_core::model::OptionChainSide::Put,
            bid: 2.05,
            mid: 2.1,
            ask: 2.15,
            bid_size: 12,
            ask_size: 8,
            expiration: "2026-09-02".to_string(),
            volume: 352,
            open_interest: 1204,
            rate_of_return: 0.624,
            strike_from: 170.0,
            strike_to: 192.5,
            sharpe_ratio: 1.83,
            strike_percentile: Some(0.412),
            score: Some(0.59),
            score_components: Some(market_int_core::model::ScoreComponents {
                sharpe: 0.18,
                safety: 0.26,
                return_part: 0.15,
            }),
            price_percentile: Some(0.81),
            earnings_before_expiry: None,
            raw_earnings_in_window: None,
            trend_short: Some(1.036),
            trend_long: Some(1.089),
            realized_vol: Some(0.452),
            implied_vol: Some(0.481),
            delta: Some(-0.28),
            iv_rv_ratio: Some(1.0642),
        };
        PerformAllOutcome {
            started_at: finished - chrono::Duration::seconds(335),
            finished_at: finished,
            stages: vec![],
            short: Some(ScoredTimeframe {
                period: 5,
                csv: Vec::new(),
                rows: vec![row],
                top_picks: vec![],
                symbols_with_chains: 171,
                row_count: 1842,
            }),
            medium: None,
            symbols_requested: 232,
            symbols_succeeded: 229,
        }
    }

    async fn get_latest(state: AppState) -> serde_json::Value {
        let app = build_router(state);
        let response = app
            .oneshot(axum::http::Request::builder().uri("/api/latest").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK, "no 404s ever");
        let bytes = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        serde_json::from_slice(&bytes).unwrap()
    }

    /// Present-fresh: age < WEBAPP_CACHE_SECS ⇒ fresh state and enveloped doc.
    #[tokio::test]
    async fn latest_present_fresh() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        // Finish stamped to *now* so age is ~0 regardless of test timing.
        let mut outcome = sample_outcome(Utc::now());
        outcome.started_at = Utc::now() - chrono::Duration::seconds(335);
        write_document(&path, &build_document(&outcome)).unwrap();

        let v = get_latest(AppState { result_path: path }).await;
        assert_eq!(v["cache_state"], "fresh");
        assert_eq!(v["cache_secs"], market_int_core::constants::WEBAPP_CACHE_SECS);
        assert!(v["age_secs"].as_u64().unwrap() < 10);
        assert_eq!(v["run_state"]["status"], "idle");
        let rows = v["result"]["timeframes"]["short"]["rows"].as_array().unwrap();
        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0]["underlying"], "NVDA");
    }

    /// Present-stale: an old completion stamp keeps the document but flips state.
    #[tokio::test]
    async fn latest_present_stale() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        let mut outcome = sample_outcome(Utc::now());
        outcome.started_at = Utc::now() - chrono::Duration::seconds(335);
        outcome.finished_at =
            Utc::now()
                - chrono::Duration::seconds(market_int_core::constants::WEBAPP_CACHE_SECS as i64 + 5);
        write_document(&path, &build_document(&outcome)).unwrap();

        let v = get_latest(AppState { result_path: path }).await;
        assert_eq!(v["cache_state"], "stale");
        assert!(v["age_secs"].as_u64().unwrap() >= market_int_core::constants::WEBAPP_CACHE_SECS);
        assert!(
            !v["result"].is_null(),
            "failed/stale runs still serve their document"
        );
    }

    /// Absent file ⇒ result null, age null, state none — still HTTP 200.
    #[tokio::test]
    async fn latest_absent_file_is_null_result_not_404() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("does-not-exist.json");

        let v = get_latest(AppState { result_path: path }).await;
        assert_eq!(v["cache_state"], "none");
        assert!(v["age_secs"].is_null());
        assert!(v["result"].is_null());
    }

    /// A corrupt file is treated exactly like absent (§4.3 fallback).
    #[tokio::test]
    async fn latest_corrupt_file_counts_as_none() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        std::fs::write(&path, b"{ this is not json").unwrap();

        let v = get_latest(AppState { result_path: path }).await;
        assert_eq!(v["cache_state"], "none");
        assert!(v["result"].is_null());
    }

    /// An unparseable completion stamp inside otherwise-valid JSON → none.
    #[tokio::test]
    async fn latest_clockless_document_counts_as_none() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        let mut outcome = sample_outcome(Utc::now());
        outcome.finished_at = Utc::now();
        write_document(&path, &build_document(&outcome)).unwrap();

        // Corrupt ONLY the timestamp field.
        let mut v: serde_json::Value =
            serde_json::from_str(&std::fs::read_to_string(&path).unwrap()).unwrap();
        v["run"]["finished_at_utc"] = serde_json::json!("not-a-timestamp");
        std::fs::write(&path, v.to_string()).unwrap();

        let v = get_latest(AppState { result_path: path }).await;
        assert_eq!(v["cache_state"], "none");
        assert!(v["result"].is_null());
    }
}
