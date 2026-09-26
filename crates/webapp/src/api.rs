//! `/api/latest` — the one endpoint that carries rows (spec §3.2).
//!
//! Pure local file read; never touches upstream APIs. Serves whatever the
//! result file holds — fresh, stale, failed, or nothing — with the age and
//! cache state computed server-side so the frontend never parses timestamps
//! or hardcodes the window.

use std::path::PathBuf;
use std::sync::Arc;

use axum::extract::{Request, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use chrono::{DateTime, Utc};
use serde::Serialize;

use crate::auth::VerifiedIdentity;
use crate::result::{cache_is_fresh, document_age_secs, read_document_off_thread, ResultDocument};

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
    /// Whether the US market session is open right now (09:30–16:00 ET
    /// Mon–Fri, holidays not modeled). Drives the off-hours cache-line
    /// wording; absent ⇒ unknown (older backend).
    pub market_open: bool,
    /// Off-hours run gate (ticket 22, relaxed to hourly; additive §3.2
    /// field): `false` ⇒ an armed run completed less than an hour ago and
    /// POST /api/run refuses until `next_open_utc`. Always `true` while the
    /// market is open (the regular 10-min cache gate covers that case).
    pub run_allowed: bool,
    /// RFC3339 instant that lifts the off-hours gate (armed completion + 1 h);
    /// `None` while allowed. Field name is frozen (§3.2).
    pub next_open_utc: Option<String>,
    /// The §4 document exactly as on disk, enveloped — or `null`.
    pub result: Option<ResultDocument>,
}

#[derive(Clone)]
pub struct AppState {
    pub result_path: PathBuf,
    /// Per-user holdings ledgers live under this directory
    /// (crates/webapp/src/holdings.rs): one `<uid>.json` per identity.
    pub holdings_dir: PathBuf,
    /// Tiger mark-to-market seam (holdings refresh): scripted in tests.
    pub mark_fetcher: crate::holdings::MarkFetcher,
    /// Live single-flight read for `run_state` (ticket 18).
    pub shared: crate::run::SharedState,
    /// Owner-controlled access sources (ticket 22): owners may manage the
    /// live grant file via the /api/grants endpoints.
    pub access: crate::auth::AccessConfig,
    /// Clock seam (RunAppState precedent): production UTC now; tests freeze
    /// it so market-session-dependent envelope fields stay hermetic.
    pub clock: fn() -> DateTime<Utc>,
}

pub fn build_router(state: AppState) -> axum::Router {
    axum::Router::new()
        .route("/api/latest", axum::routing::get(latest))
        .route("/api/grants", axum::routing::get(grants_list))
        .route("/api/grants/add", axum::routing::post(grants_add))
        .route("/api/grants/remove", axum::routing::post(grants_remove))
        .route("/api/me", axum::routing::get(me))
        // Holdings (per-user ledger; uid from the verified identity only).
        .route(
            "/api/holdings",
            axum::routing::get(crate::holdings::holdings_list)
                .post(crate::holdings::holdings_add),
        )
        .route(
            "/api/holdings/refresh",
            axum::routing::post(crate::holdings::holdings_refresh),
        )
        .route(
            "/api/holdings/cash",
            axum::routing::patch(crate::holdings::holdings_patch_cash),
        )
        .route(
            "/api/holdings/called-away",
            axum::routing::post(crate::holdings::holdings_called_away),
        )
        .route(
            "/api/holdings/close",
            axum::routing::post(crate::holdings::holdings_close),
        )
        .route(
            "/api/holdings/{id}",
            axum::routing::patch(crate::holdings::holdings_patch)
                .delete(crate::holdings::holdings_delete),
        )
        .with_state(state)
}

fn envelope_for(state: &AppState, doc: Option<ResultDocument>) -> LatestEnvelope {
    let now = (state.clock)();
    let market_open = crate::market::is_open(now);
    let no_clock = || LatestEnvelope {
        schema_version: crate::result::SCHEMA_VERSION,
        age_secs: None,
        cache_secs: market_int_core::constants::WEBAPP_CACHE_SECS,
        cache_state: "none",
        run_state: state.shared.status_view(),
        market_open,
        // No usable document ⇒ no hourly-cooldown run to point at ⇒ allowed.
        run_allowed: true,
        next_open_utc: None,
        result: None,
    };

    let Some(doc) = doc else {
        return no_clock(); // missing or unparseable file
    };
    // Present but clockless also counts as nothing usable (spec §5).
    let Some(age_secs) = document_age_secs(&doc) else {
        return no_clock();
    };
    let cache_state = if cache_is_fresh(age_secs) { "fresh" } else { "stale" };
    // Off-hours gate mirrors POST /api/run's precedence (2b) so the button
    // disables BEFORE the press, not just after a refused one.
    let blocked = crate::run::off_hours_block(now, &doc);
    LatestEnvelope {
        schema_version: crate::result::SCHEMA_VERSION,
        age_secs: Some(age_secs),
        cache_secs: market_int_core::constants::WEBAPP_CACHE_SECS,
        cache_state,
        run_state: state.shared.status_view(),
        market_open,
        run_allowed: blocked.is_none(),
        next_open_utc: blocked
            .map(|t| t.to_rfc3339_opts(chrono::SecondsFormat::Secs, true)),
        result: Some(doc),
    }
}

async fn latest(State(state): State<AppState>) -> impl IntoResponse {
    // Always 200: one status code, one parse path; no-data branches on
    // `result === null` client-side (§3.2 rejects a 404 shape).
    // The §4.3 read (retry sleep + multi-MB parse) runs on the blocking
    // pool — an async worker never stalls on it.
    let doc = read_document_off_thread(state.result_path.clone()).await;
    (StatusCode::OK, Json(envelope_for(&state, doc))).into_response()
}

/// Debug endpoint echoing the verified identity (ticket 06 recipe, §3.1).
///
/// The extension is only present when auth is armed and the token verified;
/// the manual `Request` read (instead of an `Extension<…>` extractor) keeps
/// disabled mode answering honestly with nulls instead of erroring.
pub(crate) async fn me(State(st): State<AppState>, req: Request) -> Response {
    match req.extensions().get::<VerifiedIdentity>() {
        Some(identity) => Json(serde_json::json!({
            "auth_enabled": true,
            "uid": identity.uid,
            "email": identity.email,
            // owners see the Manage-access entry; members don't
            "is_owner": st.access.is_owner(identity.email.as_deref()),
        }))
        .into_response(),
        None => Json(serde_json::json!({
            "auth_enabled": false,
            "uid": null,
            "email": null,
            "is_owner": true,
        }))
        .into_response(),
    }
}

// ── Owner-access management (ticket 22 follow-up) ──────────────────
// The allowlist file lives on the GCS volume; these endpoints rewrite it so
// grants work from the phone. All three sit behind the same bearer+allowlist
// gate as every other /api route — only members can mutate membership (any
// member, acceptable in this single-owner tool; a caller can never remove
// their own address, so an accidental tap can't strand them).

fn normalize_email(raw: &str) -> Option<String> {
    let email = raw.trim().to_lowercase();
    (!email.is_empty()
        && email.contains('@')
        && !email.contains([' ', ',', ';', '#'])
        && email.ends_with(|c: char| c.is_ascii_alphanumeric()))
    .then_some(email)
}

async fn body_email(req: Request) -> Option<String> {
    let bytes = axum::body::to_bytes(req.into_body(), 4096)
        .await
        .ok()?;
    let v: serde_json::Value = serde_json::from_slice(&bytes).ok()?;
    normalize_email(v.get("email")?.as_str()?)
}

fn grants_response(st: &AppState) -> Response {
    let file_grants = st
        .access
        .file
        .as_deref()
        .and_then(|p| crate::auth::read_grant_emails(p).ok())
        .unwrap_or_default();
    Json(serde_json::json!({
        "file_grants": file_grants,
        "static_emails": st.access.static_emails.clone().unwrap_or_default(),
        "file_configured": st.access.file.is_some(),
    }))
    .into_response()
}

pub(crate) fn error_response(status: StatusCode, message: &str) -> Response {
    (status, Json(serde_json::json!({ "error": message }))).into_response()
}

/// `GET /api/grants` — the live grant file plus the immutable static env list.
async fn grants_list(State(st): State<AppState>) -> Response {
    grants_response(&st)
}

/// `POST /api/grants/add` `{"email": "…"}` — appends to the grant file.
async fn grants_add(State(st): State<AppState>, req: Request) -> Response {
    let caller = req
        .extensions()
        .get::<VerifiedIdentity>()
        .and_then(|i| i.email.clone());
    if !caller_is_owner(&st, caller.as_deref()) {
        return error_response(StatusCode::FORBIDDEN, "owners only");
    }
    let Some(path) = st.access.file.clone() else {
        return error_response(
            StatusCode::NOT_IMPLEMENTED,
            "no grant file configured (set WEBAPP_ALLOWED_EMAILS_FILE)",
        );
    };
    let Some(email) = body_email(req).await else {
        return error_response(StatusCode::BAD_REQUEST, "missing or invalid email");
    };
    let mut emails = crate::auth::read_grant_emails(&path).unwrap_or_default();
    if !emails.contains(&email) {
        emails.push(email);
        emails.sort();
        if let Err(err) = crate::auth::write_grant_emails(&path, &emails) {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("grant file write failed: {err}"),
            );
        }
    }
    grants_response(&st)
}

/// `POST /api/grants/remove` `{"email": "…"}` — drops from the grant file.
/// A caller can never remove their own address (that takes a file edit, so a
/// mis-tap can't strand the only member).
async fn grants_remove(State(st): State<AppState>, req: Request) -> Response {
    let caller = req
        .extensions()
        .get::<VerifiedIdentity>()
        .and_then(|i| i.email.clone());
    if !caller_is_owner(&st, caller.as_deref()) {
        return error_response(StatusCode::FORBIDDEN, "owners only");
    }
    let Some(path) = st.access.file.clone() else {
        return error_response(
            StatusCode::NOT_IMPLEMENTED,
            "no grant file configured (set WEBAPP_ALLOWED_EMAILS_FILE)",
        );
    };
    let Some(email) = body_email(req).await else {
        return error_response(StatusCode::BAD_REQUEST, "missing or invalid email");
    };
    if caller.as_deref() == Some(email.as_str()) {
        return error_response(
            StatusCode::BAD_REQUEST,
            "cannot remove your own account — ask another member, or edit the grant file",
        );
    }
    let mut emails = crate::auth::read_grant_emails(&path).unwrap_or_default();
    emails.retain(|e| e != &email);
    if let Err(err) = crate::auth::write_grant_emails(&path, &emails) {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("grant file write failed: {err}"),
        );
    }
    grants_response(&st)
}

/// Owner check for grant mutations. No verified identity ⇒ auth is DISABLED
/// (local dev parity: the whole API is open), so mutations stay allowed.
fn caller_is_owner(st: &AppState, email: Option<&str>) -> bool {
    match email {
        // verified member: only static-env owners may manage grants
        Some(e) => st.access.is_owner(Some(e)),
        // no identity ⇒ auth DISABLED (local dev parity: the API is open)
        None => true,
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

    fn test_state(path: PathBuf, clock: fn() -> DateTime<Utc>) -> AppState {
        AppState {
            result_path: path.clone(),
            holdings_dir: path.with_file_name("holdings"),
            mark_fetcher: Arc::new(
                |_: &[crate::holdings::MarkRequest],
                 _: &[String],
                 _: crate::holdings::MarketSession|
                 -> crate::holdings::MarkBatch {
                    crate::holdings::MarkBatch {
                        marks: Vec::new(),
                        spots: Default::default(),
                ext: Default::default(),
                    }
                },
            ),
            shared: crate::run::SharedState::new(),
            access: Default::default(),
            clock,
        }
    }

    /// Frozen Wednesday 2026-08-26 ET — permanently past, so the document's
    /// age only ever grows (cache_state stays deterministically "stale").
    /// 20:00 ET is a closed session; 15:00 ET the same day is open.
    fn frozen_closed_now() -> DateTime<Utc> {
        chrono::NaiveDate::from_ymd_opt(2026, 8, 26)
            .unwrap()
            .and_hms_opt(20, 0, 0)
            .unwrap()
            .and_local_timezone(chrono_tz::America::New_York)
            .unwrap()
            .with_timezone(&Utc)
    }

    fn frozen_open_now() -> DateTime<Utc> {
        frozen_closed_now() - chrono::Duration::hours(5)
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

        let v = get_latest(test_state(path, crate::run::real_now)).await;
        assert_eq!(v["cache_state"], "fresh");
        assert_eq!(v["cache_secs"], market_int_core::constants::WEBAPP_CACHE_SECS);
        assert!(v["age_secs"].as_u64().unwrap() < 10);
        assert_eq!(v["run_state"]["status"], "idle");
        let rows = v["result"]["timeframes"]["short"]["rows"].as_array().unwrap();
        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0]["underlying"], "NVDA");
    }

    /// Present-stale: an old completion stamp keeps the document but flips
    /// state. Frozen clocks pin BOTH market regimes so the hourly off-market
    /// gate mirror is asserted deterministically, never time-of-day.
    #[tokio::test]
    async fn latest_present_stale() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        let now = frozen_closed_now();
        let mut outcome = sample_outcome(now);
        outcome.started_at = now - chrono::Duration::seconds(335);
        outcome.finished_at =
            now - chrono::Duration::seconds(market_int_core::constants::WEBAPP_CACHE_SECS as i64 + 5);
        // Armed (a chains stage succeeded) so the off-hours gate can engage.
        outcome.stages = vec![market_int_core::pipeline::StageReport {
            stage: market_int_core::pipeline::Stage::ChainsShort,
            status: market_int_core::pipeline::StageStatus::Ok,
            error: None,
            duration_secs: 118,
        }];
        write_document(&path, &build_document(&outcome)).unwrap();

        // Closed session (Wed 20:00 ET): blocked, unlock = completion + 1 h.
        let v = get_latest(test_state(path.clone(), frozen_closed_now)).await;
        assert_eq!(v["cache_state"], "stale");
        assert!(v["age_secs"].as_u64().unwrap() >= market_int_core::constants::WEBAPP_CACHE_SECS);
        assert!(
            !v["result"].is_null(),
            "failed/stale runs still serve their document"
        );
        assert_eq!(v["market_open"], false);
        assert_eq!(v["run_allowed"], false);
        let finished =
            DateTime::parse_from_rfc3339(v["result"]["run"]["finished_at_utc"].as_str().unwrap())
                .unwrap();
        let unlock = DateTime::parse_from_rfc3339(v["next_open_utc"].as_str().unwrap()).unwrap();
        assert_eq!(
            unlock,
            finished
                + chrono::Duration::seconds(
                    market_int_core::constants::WEBAPP_OFF_HOURS_CACHE_SECS as i64
                )
        );

        // Open session (same Wednesday 15:00 ET): the gate never engages.
        let v = get_latest(test_state(path, frozen_open_now)).await;
        assert_eq!(v["market_open"], true);
        assert_eq!(v["run_allowed"], true);
        assert!(v["next_open_utc"].is_null());
    }

    /// Absent file ⇒ result null, age null, state none — still HTTP 200.
    #[tokio::test]
    async fn latest_absent_file_is_null_result_not_404() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("does-not-exist.json");

        let v = get_latest(test_state(path, crate::run::real_now)).await;
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

        let v = get_latest(test_state(path, crate::run::real_now)).await;
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

        let v = get_latest(test_state(path, crate::run::real_now)).await;
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
        let app = build_router(AppState { result_path: path, holdings_dir: PathBuf::from("holdings"), mark_fetcher: Arc::new(|_: &[crate::holdings::MarkRequest], _: &[String], _: crate::holdings::MarketSession| crate::holdings::MarkBatch { marks: Vec::new(), spots: Default::default(), ext: Default::default() }), shared, access: Default::default(), clock: crate::run::real_now });

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
