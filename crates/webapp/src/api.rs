//! `/api/latest` — the one endpoint that carries rows (spec §3.2).
//!
//! Pure local file read; never touches upstream APIs. Serves whatever the
//! result file holds — fresh, stale, failed, or nothing — with the age and
//! cache state computed server-side so the frontend never parses timestamps
//! or hardcodes the window.

use std::path::PathBuf;

use axum::extract::{Request, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use chrono::Utc;
use serde::Serialize;

use crate::auth::VerifiedIdentity;
use crate::result::{cache_is_fresh, document_age_secs, read_document, ResultDocument};

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
    /// Live single-flight state (§3.2): `{"status":"idle"}` or
    /// `{"status":"running","since_utc":…,"elapsed_secs":…}`.
    pub run_state: serde_json::Value,
    /// Off-hours run gate (ticket 22; additive §3.2 field): `false` ⇒ a
    /// same-window armed run already exists and POST /api/run refuses until
    /// `next_open_utc`. Always `true` while the market is open.
    pub run_allowed: bool,
    /// RFC3339 open time that lifts the gate; `None` while allowed.
    pub next_open_utc: Option<String>,
    /// The §4 document exactly as on disk, enveloped — or `null`.
    pub result: Option<ResultDocument>,
}

#[derive(Clone)]
pub struct AppState {
    pub result_path: PathBuf,
    /// Live single-flight read for `run_state` (ticket 18).
    pub shared: crate::run::SharedState,
}

pub fn build_router(state: AppState) -> axum::Router {
    axum::Router::new()
        .route("/api/latest", axum::routing::get(latest))
        .with_state(state)
}

fn envelope_for(state: &AppState) -> LatestEnvelope {
    let result_path = &state.result_path;
    let no_clock = || LatestEnvelope {
        schema_version: crate::result::SCHEMA_VERSION,
        age_secs: None,
        cache_secs: market_int_core::constants::WEBAPP_CACHE_SECS,
        cache_state: "none",
        run_state: state.shared.status_view(),
        // No usable document ⇒ no same-window run to point at ⇒ allowed.
        run_allowed: true,
        next_open_utc: None,
        result: None,
    };

    let Some(doc) = read_document(result_path) else {
        return no_clock(); // missing or unparseable file
    };
    // Present but clockless also counts as nothing usable (spec §5).
    let Some(age_secs) = document_age_secs(&doc) else {
        return no_clock();
    };
    let cache_state = if cache_is_fresh(age_secs) { "fresh" } else { "stale" };
    // Off-hours gate mirrors POST /api/run's precedence (2b) so the button
    // disables BEFORE the press, not just after a refused one.
    let blocked = crate::run::off_hours_block(crate::market::session(Utc::now()), &doc);
    LatestEnvelope {
        schema_version: crate::result::SCHEMA_VERSION,
        age_secs: Some(age_secs),
        cache_secs: market_int_core::constants::WEBAPP_CACHE_SECS,
        cache_state,
        run_state: state.shared.status_view(),
        run_allowed: blocked.is_none(),
        next_open_utc: blocked
            .map(|w| w.next_open_utc.to_rfc3339_opts(chrono::SecondsFormat::Secs, true)),
        result: Some(doc),
    }
}

async fn latest(State(state): State<AppState>) -> impl IntoResponse {
    // Always 200: one status code, one parse path; no-data branches on
    // `result === null` client-side (§3.2 rejects a 404 shape).
    (StatusCode::OK, Json(envelope_for(&state))).into_response()
}

/// Debug endpoint echoing the verified identity (ticket 06 recipe, §3.1).
///
/// The extension is only present when auth is armed and the token verified;
/// the manual `Request` read (instead of an `Extension<…>` extractor) keeps
/// disabled mode answering honestly with nulls instead of erroring.
pub(crate) async fn me(req: Request) -> Response {
    match req.extensions().get::<VerifiedIdentity>() {
        Some(identity) => Json(serde_json::json!({
            "auth_enabled": true,
            "uid": identity.uid,
            "email": identity.email,
        }))
        .into_response(),
        None => Json(serde_json::json!({
            "auth_enabled": false,
            "uid": null,
            "email": null,
        }))
        .into_response(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::result::{build_document, write_document};
    use axum::body::Body;
    use chrono::{DateTime, Utc};
    use market_int_core::model::ScoredChainRow;
    use market_int_core::pipeline::{PerformAllOutcome, ScoredTimeframe};
    use tower::ServiceExt;

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

        let v = get_latest(AppState { result_path: path, shared: crate::run::SharedState::new() }).await;
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

        let v = get_latest(AppState { result_path: path, shared: crate::run::SharedState::new() }).await;
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

        let v = get_latest(AppState { result_path: path, shared: crate::run::SharedState::new() }).await;
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

        let v = get_latest(AppState { result_path: path, shared: crate::run::SharedState::new() }).await;
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

        let v = get_latest(AppState { result_path: path, shared: crate::run::SharedState::new() }).await;
        assert_eq!(v["cache_state"], "none");
        assert!(v["result"].is_null());
    }

    /// Ticket 18: the envelope's run-state reports running live, so a fresh
    /// page load mid-run attaches immediately (§3.2).
    #[tokio::test]
    async fn latest_envelope_reflects_live_running_state() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        let shared = crate::run::SharedState::new();
        shared.begin().expect("acquire");
        let app = build_router(AppState { result_path: path, shared });

        let response = app
            .oneshot(axum::http::Request::builder().uri("/api/latest").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let bytes = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(v["run_state"]["status"], "running");
        assert!(v["run_state"]["since_utc"].as_str().is_some());
        assert!(v["run_state"]["elapsed_secs"].as_i64().is_some());
    }
}
