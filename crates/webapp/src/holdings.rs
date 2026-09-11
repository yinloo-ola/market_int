//! Holdings end-to-end: per-user put ledger (add / list / mark refresh /
//! close) with the pace rule of the design doc
//! (`docs/plans/2026-09-11-holdings/holdings-design.md`).
//!
//! The `feature_acceptance_goog_buy_back` test at the bottom IS the primary
//! enforced spec (design doc `## Feature acceptance`): the GOOG reference
//! example driven through the real router — add, refresh with a scripted
//! Tiger mark, read back the computed view, close. Everything else in this
//! file exists to make that scenario expressible.

use std::path::PathBuf;
use std::sync::Arc;

use chrono::NaiveDate;

/// One open position handed to the mark fetcher.
#[derive(Debug, Clone)]
pub struct MarkRequest {
    pub id: String,
    pub symbol: String,
    pub strike: f64,
    pub expiry: NaiveDate,
}

/// Fetcher outcome per position: `Ok(Some(mid))` priced, `Ok(None)` = no
/// chain data (expired/delisted — stale, not an error), `Err(reason)` =
/// fetch failure (stale, not an error).
#[derive(Debug)]
pub struct MarkResult {
    pub id: String,
    pub mid: Result<Option<f64>, String>,
}

/// Seam (Runner precedent): production constructs ONE Tiger requester per
/// refresh request and prices every position serially; tests script
/// per-symbol outcomes with no network.
pub type MarkFetcher = Arc<dyn Fn(&[MarkRequest]) -> Vec<MarkResult> + Send + Sync>;

/// Production fetcher — wired to the Tiger client in the refresh handler
/// (R4). Never cached: credentials come from env per `execute_query`.
pub fn live_fetcher() -> MarkFetcher {
    Arc::new(|requests: &[MarkRequest]| {
        requests
            .iter()
            .map(|r| MarkResult {
                id: r.id.clone(),
                mid: Err("tiger mark fetch not wired yet".to_string()),
            })
            .collect()
    })
}

// ── Per-user ledger document (R2) ──────────────────────────────
// One `<uid>.json` per verified identity under `holdings_dir`; written with
// the result-doc atomic pattern (temp + fsync + rename). The uid comes only
// from the verified identity — never a client-supplied parameter.

pub const LEDGER_SCHEMA_VERSION: u64 = 1;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct HoldingsDocument {
    pub schema_version: u64,
    pub positions: Vec<market_int_core::holdings::Holding>,
}

impl Default for HoldingsDocument {
    fn default() -> Self {
        Self {
            schema_version: LEDGER_SCHEMA_VERSION,
            positions: Vec::new(),
        }
    }
}

/// Defensive filename mapping: Firebase UIDs are alphanumeric, but anything
/// path-shaped (`/`, `..`, `:`) is rejected here rather than trusted.
fn ledger_filename(uid: &str) -> std::io::Result<String> {
    if uid.is_empty()
        || !uid
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
    {
        return Err(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            format!("unsafe holdings uid: {uid:?}"),
        ));
    }
    Ok(format!("{uid}.json"))
}

pub fn ledger_path(dir: &std::path::Path, uid: &str) -> std::io::Result<PathBuf> {
    Ok(dir.join(ledger_filename(uid)?))
}

/// Load the caller's ledger. Missing file ⇒ empty (first visit); corrupt
/// file ⇒ empty with a warning — never a 500, the user can start over.
pub fn read_ledger(dir: &std::path::Path, uid: &str) -> std::io::Result<HoldingsDocument> {
    let path = ledger_path(dir, uid)?;
    match std::fs::read(&path) {
        Ok(bytes) => match serde_json::from_slice::<HoldingsDocument>(&bytes) {
            Ok(doc) => Ok(doc),
            Err(err) => {
                log::warn!("holdings: corrupt ledger {}: {err} — treating as empty", path.display());
                Ok(HoldingsDocument::default())
            }
        },
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(HoldingsDocument::default()),
        Err(e) => Err(e),
    }
}

/// Atomic write (result.rs `write_document` pattern): temp file in the same
/// directory → fsync → rename over the target → best-effort dir fsync.
pub fn write_ledger(
    dir: &std::path::Path,
    uid: &str,
    doc: &HoldingsDocument,
) -> std::io::Result<()> {
    let path = ledger_path(dir, uid)?;
    std::fs::create_dir_all(dir)?;

    let bytes = serde_json::to_vec_pretty(doc)
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;

    let tmp_path = dir.join(format!(
        ".{}.tmp.{}",
        path.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_default(),
        std::process::id()
    ));
    {
        use std::io::Write;
        let mut file = std::fs::File::create(&tmp_path)?;
        file.write_all(&bytes)?;
        file.sync_all()?;
    }
    std::fs::rename(&tmp_path, &path)?;
    if let Ok(d) = std::fs::File::open(dir) {
        let _ = d.sync_all();
    }
    Ok(())
}

#[cfg(test)]
mod store_tests {
    use super::*;

    fn sample_holding(id: &str) -> market_int_core::holdings::Holding {
        market_int_core::holdings::Holding {
            id: id.to_string(),
            symbol: "GOOG".to_string(),
            strike: 350.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            premium: 1.0,
            contracts: 2,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: Some(market_int_core::holdings::Mark {
                mid: 0.5,
                as_of: chrono::Utc::now(),
            }),
        }
    }

    /// Round-trip: every field (including mark + dates) survives a write.
    #[test]
    fn ledger_round_trips_losslessly() {
        let dir = tempfile::tempdir().unwrap();
        let doc = HoldingsDocument {
            positions: vec![sample_holding("h1"), sample_holding("h2")],
            ..Default::default()
        };
        write_ledger(dir.path(), "uid1", &doc).unwrap();
        let back = read_ledger(dir.path(), "uid1").unwrap();
        assert_eq!(back.schema_version, LEDGER_SCHEMA_VERSION);
        assert_eq!(back.positions, doc.positions);
    }

    /// Missing file ⇒ empty ledger, no error (first visit).
    #[test]
    fn missing_file_is_empty_ledger() {
        let dir = tempfile::tempdir().unwrap();
        let doc = read_ledger(dir.path(), "nobody").unwrap();
        assert!(doc.positions.is_empty());
        assert_eq!(doc.schema_version, LEDGER_SCHEMA_VERSION);
    }

    /// Corrupt file ⇒ empty ledger + warning, never an error to the caller.
    #[test]
    fn corrupt_file_treated_as_empty() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::create_dir_all(dir.path()).unwrap();
        std::fs::write(dir.path().join("uid1.json"), b"{ not json").unwrap();
        let doc = read_ledger(dir.path(), "uid1").unwrap();
        assert!(doc.positions.is_empty());
    }

    /// No temp leftovers: the atomic pattern renames or nothing survives.
    #[test]
    fn atomic_write_leaves_no_temp_files() {
        let dir = tempfile::tempdir().unwrap();
        write_ledger(
            dir.path(),
            "uid1",
            &HoldingsDocument {
                positions: vec![sample_holding("h1")],
                ..Default::default()
            },
        )
        .unwrap();
        let leftovers: Vec<_> = std::fs::read_dir(dir.path())
            .unwrap()
            .map(|e| e.unwrap().file_name().to_string_lossy().into_owned())
            .filter(|n| n.contains(".tmp"))
            .collect();
        assert!(leftovers.is_empty(), "temp leftovers: {leftovers:?}");
    }

    /// Different uids never share a file; the filename mapping is injective
    /// over safe uids and rejects path-shaped ones.
    #[test]
    fn uid_paths_are_isolated_and_sanitized() {
        let dir = tempfile::tempdir().unwrap();
        write_ledger(
            dir.path(),
            "uid1",
            &HoldingsDocument {
                positions: vec![sample_holding("h1")],
                ..Default::default()
            },
        )
        .unwrap();
        assert!(read_ledger(dir.path(), "uid2").unwrap().positions.is_empty());

        assert_eq!(
            ledger_path(dir.path(), "abc-123_X").unwrap(),
            dir.path().join("abc-123_X.json")
        );
        for bad in ["../etc", "a/b", "", "a:b"] {
            assert!(ledger_path(dir.path(), bad).is_err(), "uid {bad:?} must be rejected");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::AppState;
    use axum::body::Body;
    use axum::http::StatusCode;
    use chrono::{DateTime, Utc};
    use serde_json::{json, Value};
    use tower::ServiceExt;

    /// Frozen Tuesday 2026-09-08 15:00 ET. Against the GOOG example
    /// (sold Fri 2026-09-04, expiry Fri 2026-09-11): elapsed working days
    /// = Sep 7, 8 → 2 of 5 total → linear target 40%.
    fn frozen_today() -> DateTime<Utc> {
        chrono::NaiveDate::from_ymd_opt(2026, 9, 8)
            .unwrap()
            .and_hms_opt(15, 0, 0)
            .unwrap()
            .and_local_timezone(chrono_tz::America::New_York)
            .unwrap()
            .with_timezone(&Utc)
    }

    fn test_state(dir: &std::path::Path, fetcher: MarkFetcher) -> AppState {
        AppState {
            result_path: dir.join("last_run.json"),
            holdings_dir: dir.join("holdings"),
            mark_fetcher: fetcher,
            shared: crate::run::SharedState::new(),
            access: Default::default(),
            clock: frozen_today,
        }
    }

    async fn call(
        app: axum::Router,
        method: &str,
        uri: &str,
        body: Option<Value>,
    ) -> (StatusCode, Value) {
        let request = axum::http::Request::builder()
            .method(method)
            .uri(uri)
            .header("content-type", "application/json")
            // The auth middleware inserts this after verifying the bearer
            // token; inserting it here exercises the same identity path.
            .extension(crate::auth::VerifiedIdentity {
                uid: "test-uid".to_string(),
                email: Some("tester@example.com".to_string()),
            });
        let request = match body {
            Some(v) => request.body(Body::from(v.to_string())).unwrap(),
            None => request.body(Body::empty()).unwrap(),
        };
        let response = app.oneshot(request).await.unwrap();
        let status = response.status();
        let bytes = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let value = if bytes.is_empty() {
            Value::Null
        } else {
            serde_json::from_slice(&bytes).unwrap()
        };
        (status, value)
    }

    fn goog_fetcher(mid: f64) -> MarkFetcher {
        Arc::new(move |requests: &[MarkRequest]| {
            requests
                .iter()
                .map(|r| MarkResult {
                    id: r.id.clone(),
                    mid: Ok(Some(mid)),
                })
                .collect()
        })
    }

    /// Design doc `## Feature acceptance`, verbatim: fresh ledger → add GOOG
    /// strike 350 (5 working days out, sold 2 working days ago, premium
    /// 1.00, 1 contract) → refresh reports 0.50 mid → card values
    /// (+50.0% vs target 40%, $50.00, pace met) → outcome confirm removes
    /// the position and the ledger document no longer contains it.
    #[tokio::test]
    async fn feature_acceptance_goog_buy_back() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));

        // Fresh ledger: empty positions, no error.
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);

        // Add GOOG 350P, premium $1.00, 1 contract.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG",
                "strike": 350.0,
                "premium": 1.0,
                "contracts": 1,
                "sold": "2026-09-04",
                "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "add fails: {v}");
        let id = v["position"]["id"].as_str().expect("server-generated id").to_string();
        assert_eq!(v["position"]["symbol"], "GOOG");
        assert!(v["position"]["mark"].is_null(), "no mark until refresh");

        // Refresh with the scripted Tiger mid: 0.50.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "refresh fails: {v}");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 0);

        // The computed view carries the close decision.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let positions = v["positions"].as_array().unwrap();
        assert_eq!(positions.len(), 1);
        let p = &positions[0];
        assert_eq!(p["symbol"], "GOOG");
        assert_eq!(p["contracts"], 1);
        assert_eq!(p["mark"]["mid"], 0.5);
        assert!(p["mark"]["as_of"].as_str().is_some());
        let view = &p["view"];
        assert_eq!(view["days_elapsed"], 2);
        assert_eq!(view["days_total"], 5);
        assert_eq!(view["target_pct"], 0.4);
        assert_eq!(view["pl_pct"], 0.5);
        assert_eq!(view["pl_dollars"], 50.0);
        assert_eq!(view["pace_met"], true);

        // Outcome confirm ("bought back at 0.50") removes the position; the
        // persisted document no longer contains it.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "DELETE",
            &format!("/api/holdings/{id}"),
            None,
        )
        .await;
        assert_eq!(status, StatusCode::OK);

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
        let file = std::fs::read_to_string(
            dir.path().join("holdings").join("test-uid.json"),
        )
        .unwrap();
        assert!(!file.contains("GOOG"), "ledger document purged: {file}");
    }
}
