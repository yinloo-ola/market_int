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
/// fetch failure (stale, not an error). `underlying` is the symbol's last
/// close captured by the same refresh (R6) — `None` when its kline failed.
#[derive(Debug)]
pub struct MarkResult {
    pub id: String,
    pub mid: Result<Option<f64>, String>,
    pub underlying: Option<f64>,
}

/// Seam (Runner precedent): production constructs ONE Tiger requester per
/// refresh request and prices every position serially; tests script
/// per-symbol outcomes with no network.
pub type MarkFetcher = Arc<dyn Fn(&[MarkRequest]) -> Vec<MarkResult> + Send + Sync>;

/// Production fetcher: one Tiger requester per refresh call, one underlying
/// kline per unique symbol, then a degenerate `(strike, strike)` put-chain
/// query per position (the `test-tiger` shape) — row mid already folds
/// bid/ask with a latest-trade fallback (`calculate_mid_price` at parse
/// time). OI minimum 0: we want *our* strike, not liquid ones. Blocking by
/// design — the refresh handler parks it on `spawn_blocking`.
pub fn live_fetcher() -> MarkFetcher {
    Arc::new(move |requests: &[MarkRequest]| {
        fetch_marks_blocking(requests.to_vec())
    })
}

fn fetch_marks_blocking(requests: Vec<MarkRequest>) -> Vec<MarkResult> {
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build();
    match runtime {
        Ok(rt) => rt.block_on(fetch_marks(requests)),
        Err(e) => requests
            .into_iter()
            .map(|r| MarkResult {
                id: r.id,
                mid: Err(format!("async runtime unavailable: {e}")),
                underlying: None,
            })
            .collect(),
    }
}

async fn fetch_marks(requests: Vec<MarkRequest>) -> Vec<MarkResult> {
    use std::collections::BTreeSet;

    let Some(requester) =
        market_int_core::tiger::api_caller::Requester::new().await
    else {
        return requests
            .into_iter()
            .map(|r| MarkResult {
                id: r.id,
                mid: Err(
                    "tiger requester init failed (TIGER_ID/TIGER_RSA set?)"
                        .to_string(),
                ),
                underlying: None,
            })
            .collect();
    };

    // Underlying last close per unique symbol — the chain query needs it to
    // apply its moneyness filter correctly (0.0 would mark every strike ITM).
    let mut underlyings: std::collections::HashMap<String, f64> =
        std::collections::HashMap::new();
    let symbols: BTreeSet<String> =
        requests.iter().map(|r| r.symbol.clone()).collect();
    for symbol in &symbols {
        match requester
            .query_stock_quotes(&[symbol.as_str()], &chrono::Local::now(), 1, "day")
            .await
        {
            Ok(candles) => {
                if let Some(last) = candles.last() {
                    underlyings.insert(symbol.clone(), last.close);
                }
            }
            // Leave the symbol out — its positions go stale below with a
            // precise reason.
            Err(e) => log::warn!("holdings: underlying quote for {symbol} failed: {e}"),
        }
    }

    let mut results = Vec::with_capacity(requests.len());
    for r in requests {
        let Some(&spot) = underlyings.get(&r.symbol) else {
            results.push(MarkResult {
                id: r.id,
                mid: Err(format!("underlying quote for {} unavailable", r.symbol)),
                underlying: None,
            });
            continue;
        };
        let expiry_ny = r
            .expiry
            .and_hms_opt(0, 0, 0)
            .unwrap()
            .and_local_timezone(chrono_tz::America::New_York)
            .single()
            .expect("midnight ET resolves unambiguously");
        let mid = chain_mid(
            &requester,
            &r.symbol,
            r.strike,
            &expiry_ny,
            &underlyings,
        )
        .await;
        results.push(MarkResult {
            id: r.id,
            mid,
            underlying: Some(spot),
        });
    }
    results
}

// The chain query is async and must run on the same runtime as the kline
// call — inlined as a small async helper driven by `fetch_marks`.
async fn chain_mid(
    requester: &market_int_core::tiger::api_caller::Requester,
    symbol: &str,
    strike: f64,
    expiry_ny: &chrono::DateTime<chrono_tz::Tz>,
    underlyings: &std::collections::HashMap<String, f64>,
) -> Result<Option<f64>, String> {
    use market_int_core::model::OptionChainSide;
    let rows = requester
        .query_option_chain(
            &[(symbol, (strike, strike))],
            underlyings,
            expiry_ny,
            0,
            &OptionChainSide::Put,
        )
        .await
        .map_err(|e| format!("chain query failed: {e}"))?;
    Ok(rows
        .iter()
        .find(|c| (c.strike - strike).abs() < 1e-6)
        .map(|c| c.mid)
        .filter(|mid| *mid > 0.0))
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
/// file ⇒ ONE retry after a short settle (the `read_document` §4.3 pattern —
/// a transiently-truncated read must not look like an empty ledger, or the
/// next write would clobber real data), then empty with a warning — never a
/// 500, the user can start over. A parsed document with a foreign
/// schema_version is warned about, not silently mis-handled.
pub fn read_ledger(dir: &std::path::Path, uid: &str) -> std::io::Result<HoldingsDocument> {
    let path = ledger_path(dir, uid)?;
    for attempt in 0..2 {
        match std::fs::read(&path) {
            Ok(bytes) => match serde_json::from_slice::<HoldingsDocument>(&bytes) {
                Ok(doc) => {
                    if doc.schema_version != LEDGER_SCHEMA_VERSION {
                        log::warn!(
                            "holdings: ledger {} has schema version {} (want {}) — \
                             handling as-is",
                            path.display(),
                            doc.schema_version,
                            LEDGER_SCHEMA_VERSION
                        );
                    }
                    return Ok(doc);
                }
                Err(err) if attempt == 0 => {
                    log::warn!("holdings: ledger {} did not parse ({err}) — retrying once", path.display());
                }
                Err(err) => {
                    log::warn!(
                        "holdings: corrupt ledger {}: {err} — treating as empty",
                        path.display()
                    );
                    return Ok(HoldingsDocument::default());
                }
            },
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
                return Ok(HoldingsDocument::default())
            }
            Err(e) if attempt == 0 => {}
            Err(e) => return Err(e),
        }
        std::thread::sleep(std::time::Duration::from_millis(100));
    }
    Ok(HoldingsDocument::default())
}

/// Atomic write (result.rs `write_document` pattern): temp file in the same
/// directory → fsync → rename over the target → best-effort dir fsync. The
/// temp name carries a per-process sequence — unlike the result doc's
/// single-writer world, two holdings mutations for the same uid can overlap.
pub fn write_ledger(
    dir: &std::path::Path,
    uid: &str,
    doc: &HoldingsDocument,
) -> std::io::Result<()> {
    use std::sync::atomic::{AtomicU64, Ordering};
    static NEXT_TMP: AtomicU64 = AtomicU64::new(0);

    let path = ledger_path(dir, uid)?;
    std::fs::create_dir_all(dir)?;

    let bytes = serde_json::to_vec_pretty(doc)
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;

    let tmp_path = dir.join(format!(
        ".{}.tmp.{}.{}",
        path.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_default(),
        std::process::id(),
        NEXT_TMP.fetch_add(1, Ordering::Relaxed)
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

// ── HTTP handlers (R3/R4) ──────────────────────────────────────
// All four routes mount inside `api::build_router`, behind the same
// Firebase gate as every other /api route. The storage uid comes ONLY from
// the verified identity extension — a client can never name another user's
// ledger. Auth disabled (local dev) folds to a shared "local" ledger.

use axum::extract::{Path as AxPath, Request, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use chrono::{DateTime, Utc};
use market_int_core::holdings::Holding;
use serde_json::json;

pub(crate) use crate::api::error_response;

/// The caller's ledger key: verified uid, or "local" when auth is disabled
/// (single open ledger — the caller_is_owner precedent).
fn uid_of(req: &Request) -> String {
    req.extensions()
        .get::<crate::auth::VerifiedIdentity>()
        .map(|i| i.uid.clone())
        .unwrap_or_else(|| "local".to_string())
}

/// "Today" for pace math, in the ET calendar the market session uses.
fn today_et(clock: fn() -> DateTime<Utc>) -> chrono::NaiveDate {
    clock()
        .with_timezone(&chrono_tz::America::New_York)
        .date_naive()
}

// Ledger IO parks on the blocking pool — std::fs on the GCS FUSE mount can
// take hundreds of ms, and the async workers must not stall on it
// (read_document_off_thread precedent).
async fn read_ledger_off_thread(
    dir: PathBuf,
    uid: String,
) -> std::io::Result<HoldingsDocument> {
    tokio::task::spawn_blocking(move || read_ledger(&dir, &uid))
        .await
        .expect("spawn_blocking read_ledger")
}

async fn write_ledger_off_thread(
    dir: PathBuf,
    uid: String,
    doc: HoldingsDocument,
) -> std::io::Result<()> {
    tokio::task::spawn_blocking(move || write_ledger(&dir, &uid, &doc))
        .await
        .expect("spawn_blocking write_ledger")
}

fn position_json(h: &Holding, today: chrono::NaiveDate) -> serde_json::Value {
    let mark = h.mark.as_ref().map(|m| {
        json!({
            "mid": m.mid,
            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
            "underlying_price": m.underlying_price,
        })
    });
    json!({
        "id": h.id,
        "symbol": h.symbol,
        "strike": h.strike,
        "expiry": h.expiry.to_string(),
        "premium": h.premium,
        "contracts": h.contracts,
        "sold": h.sold.to_string(),
        "mark": mark,
        "view": h.view(today),
    })
}

fn ledger_json(doc: &HoldingsDocument, today: chrono::NaiveDate) -> serde_json::Value {
    json!({
        "schema_version": doc.schema_version,
        "positions": doc
            .positions
            .iter()
            .map(|p| position_json(p, today))
            .collect::<Vec<_>>(),
    })
}

fn parse_date(raw: &str, field: &str) -> Result<chrono::NaiveDate, Response> {
    chrono::NaiveDate::parse_from_str(raw, "%Y-%m-%d").map_err(|_| {
        error_response(
            StatusCode::BAD_REQUEST,
            &format!("invalid {field} date {raw:?} (want YYYY-MM-DD)"),
        )
    })
}

/// `GET /api/holdings` — the caller's positions with computed views, from
/// stored marks only (never touches the network).
pub(crate) async fn holdings_list(State(st): State<crate::api::AppState>, req: Request) -> Response {
    let uid = uid_of(&req);
    let doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid).await {
        Ok(doc) => doc,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    Json(ledger_json(&doc, today_et(st.clock))).into_response()
}

/// Longest ledger: every mutation rewrites the document and refresh fans out
/// one chain query per position — a bound keeps both honest. A real book has
/// handfuls of open puts.
const MAX_POSITIONS_PER_LEDGER: usize = 100;

/// `POST /api/holdings` — add a position to the caller's ledger.
pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Request) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), 16 * 1024).await {
        Ok(b) => b,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
    };
    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
    };

    let symbol = v
        .get("symbol")
        .and_then(|s| s.as_str())
        .unwrap_or_default()
        .trim()
        .to_uppercase();
    let num = |key: &str| v.get(key).and_then(|x| x.as_f64());
    let (Some(strike), Some(premium), Some(contracts)) =
        (num("strike"), num("premium"), num("contracts"))
    else {
        return error_response(StatusCode::BAD_REQUEST, "missing strike/premium/contracts");
    };
    let Some(sold_raw) = v.get("sold").and_then(|x| x.as_str()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing sold date");
    };
    let Some(expiry_raw) = v.get("expiry").and_then(|x| x.as_str()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing expiry date");
    };
    let sold = match parse_date(sold_raw, "sold") {
        Ok(d) => d,
        Err(resp) => return resp,
    };
    let expiry = match parse_date(expiry_raw, "expiry") {
        Ok(d) => d,
        Err(resp) => return resp,
    };
    if (contracts - contracts.trunc()).abs() > f64::EPSILON {
        return error_response(StatusCode::BAD_REQUEST, "contracts must be a whole number");
    }
    let Some(contracts) = u32::try_from(contracts as i64).ok().filter(|c| *c > 0) else {
        return error_response(StatusCode::BAD_REQUEST, "contracts must be a positive integer");
    };
    if sold > today_et(st.clock) {
        return error_response(StatusCode::BAD_REQUEST, "sell date is in the future");
    }

    let holding = Holding {
        // Server-generated id: process sequence on top of the clock stamp
        // (NEXT_SEQ precedent).
        id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_position_seq()),
        symbol,
        strike,
        expiry,
        premium,
        contracts,
        sold,
        mark: None,
    };
    if let Err(reason) = holding.validate() {
        return error_response(StatusCode::BAD_REQUEST, &reason);
    }

    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    if doc.positions.len() >= MAX_POSITIONS_PER_LEDGER {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
        );
    }
    doc.positions.push(holding.clone());
    if let Err(err) =
        write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await
    {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    (
        StatusCode::CREATED,
        Json(json!({ "position": position_json(&holding, today_et(st.clock)) })),
    )
        .into_response()
}

/// Per-process sequence for server-generated ids (NEXT_SEQ precedent).
fn next_position_seq() -> u64 {
    use std::sync::atomic::{AtomicU64, Ordering};
    static NEXT: AtomicU64 = AtomicU64::new(0);
    NEXT.fetch_add(1, Ordering::Relaxed)
}

/// `DELETE /api/holdings/{id}` — the outcome-confirm removal.
pub(crate) async fn holdings_delete(
    State(st): State<crate::api::AppState>,
    AxPath(id): AxPath<String>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    let before = doc.positions.len();
    doc.positions.retain(|p| p.id != id);
    if doc.positions.len() == before {
        return error_response(StatusCode::NOT_FOUND, "no such position");
    }
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    Json(json!({ "removed": id })).into_response()
}

/// `POST /api/holdings/refresh` — mark every open position to market.
/// One position's fetch failure never fails the request: it keeps its
/// previous mark and is reported stale. The ledger is RE-READ after the
/// fetch and marks merged by id — a position added while Tiger was being
/// queried keeps its (mark-less) state instead of being clobbered by the
/// pre-fetch snapshot.
pub(crate) async fn holdings_refresh(
    State(st): State<crate::api::AppState>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };

    let requests: Vec<MarkRequest> = doc
        .positions
        .iter()
        .map(|p| MarkRequest {
            id: p.id.clone(),
            symbol: p.symbol.clone(),
            strike: p.strike,
            expiry: p.expiry,
        })
        .collect();
    // Tiger is a blocking HTTP client — park the whole batch off the async
    // workers (read_document_off_thread precedent).
    let fetcher = st.mark_fetcher.clone();
    let results =
        tokio::task::spawn_blocking(move || fetcher(&requests)).await.expect(
            "spawn_blocking mark fetch",
        );

    let now = (st.clock)();
    let mut ok: Vec<String> = Vec::new();
    let mut stale: Vec<(String, String)> = Vec::new();
    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    for result in results {
        let Some(position) = doc.positions.iter_mut().find(|p| p.id == result.id) else {
            // Added/removed while the fetch was in flight — its request was
            // for a snapshot position; nothing to apply.
            log::warn!("holdings: refresh result for unknown id {} dropped", result.id);
            continue;
        };
        match result.mid {
            Ok(Some(mid)) if mid > 0.0 => {
                position.mark = Some(market_int_core::holdings::Mark {
                    mid,
                    as_of: now,
                    underlying_price: result.underlying,
                });
                ok.push(result.id);
            }
            Ok(Some(_)) => stale.push((
                result.id,
                "non-positive mid rejected".to_string(),
            )),
            Ok(None) => stale.push((
                result.id,
                "no chain data for that contract".to_string(),
            )),
            Err(reason) => {
                log::warn!("holdings: mark fetch failed for {}: {reason}", result.id);
                stale.push((result.id, reason));
            }
        }
    }

    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    Json(json!({
        "schema_version": doc.schema_version,
        "positions": doc
            .positions
            .iter()
            .map(|p| position_json(p, today_et(st.clock)))
            .collect::<Vec<_>>(),
        "refresh": {
            "ok": ok,
            "stale": stale
                .into_iter()
                .map(|(id, reason)| json!({"id": id, "reason": reason}))
                .collect::<Vec<_>>(),
        }
    }))
    .into_response()
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
                underlying_price: Some(244.0),
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

    /// R6: a mark persisted by an older ledger (no underlying_price field)
    /// deserializes with the field absent — additive schema, nothing breaks.
    #[test]
    fn old_ledger_mark_without_underlying_loads() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::create_dir_all(dir.path()).unwrap();
        std::fs::write(
            dir.path().join("uid1.json"),
            r#"{"schema_version":1,"positions":[{"id":"h1","symbol":"GOOG","strike":350.0,
               "expiry":"2026-09-11","premium":1.0,"contracts":1,"sold":"2026-09-04",
               "mark":{"mid":0.5,"as_of":"2026-09-08T19:00:00Z"}}]}"#,
        )
        .unwrap();
        let doc = read_ledger(dir.path(), "uid1").unwrap();
        assert_eq!(doc.positions[0].mark.as_ref().unwrap().underlying_price, None);
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
        call_as(app, method, uri, body, "test-uid").await
    }

    async fn call_as(
        app: axum::Router,
        method: &str,
        uri: &str,
        body: Option<Value>,
        uid: &str,
    ) -> (StatusCode, Value) {
        let request = axum::http::Request::builder()
            .method(method)
            .uri(uri)
            .header("content-type", "application/json")
            // The auth middleware inserts this after verifying the bearer
            // token; inserting it here exercises the same identity path.
            .extension(crate::auth::VerifiedIdentity {
                uid: uid.to_string(),
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
                    underlying: None,
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
        assert_eq!(status, StatusCode::CREATED, "add fails: {v}");
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

    /// R3: a user's ledger is reachable only through their own verified
    /// identity — the same router with a different uid extension sees an
    /// empty ledger, and there is no route shape that names another uid.
    #[tokio::test]
    async fn per_uid_ledgers_are_isolated() {
        let dir = tempfile::tempdir().unwrap();
        let payload = json!({
            "symbol": "GOOG", "strike": 350.0, "premium": 1.0,
            "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11"
        });
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "POST", "/api/holdings", Some(payload)).await;
        assert_eq!(status, StatusCode::CREATED);

        // uid "test-uid" sees the position…
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["positions"].as_array().unwrap().len(), 1);

        // …uid "someone-else" sees nothing, and the same POST would land in
        // their own file (the uid is never client-chosen).
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call_as(app, "GET", "/api/holdings", None, "someone-else").await;
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
    }

    /// R3: invalid payloads are 400s and never write the ledger.
    #[tokio::test]
    async fn add_rejects_invalid_without_writing() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        for (label, payload) in [
            ("zero strike", json!({"symbol":"GOOG","strike":0.0,"premium":1.0,"contracts":1,"sold":"2026-09-04","expiry":"2026-09-11"})),
            ("bad date", json!({"symbol":"GOOG","strike":350.0,"premium":1.0,"contracts":1,"sold":"09/04/2026","expiry":"2026-09-11"})),
            ("expiry before sell", json!({"symbol":"GOOG","strike":350.0,"premium":1.0,"contracts":1,"sold":"2026-09-11","expiry":"2026-09-04"})),
            ("zero contracts", json!({"symbol":"GOOG","strike":350.0,"premium":1.0,"contracts":0,"sold":"2026-09-04","expiry":"2026-09-11"})),
        ] {
            let (status, v) = call(app.clone(), "POST", "/api/holdings", Some(payload)).await;
            assert_eq!(status, StatusCode::BAD_REQUEST, "{label}: {v}");
            assert!(v["error"].as_str().is_some(), "{label} carries a reason");
        }
        // Nothing was written.
        assert!(
            !dir.path().join("holdings").join("test-uid.json").exists(),
            "failed adds must not create the ledger"
        );
    }

    /// R3: deleting an id that is not in the ledger is a 404, no write.
    #[tokio::test]
    async fn delete_unknown_id_is_404() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "DELETE", "/api/holdings/h-nope", None).await;
        assert_eq!(status, StatusCode::NOT_FOUND);
        assert!(v["error"].as_str().is_some());
    }

    /// R3: a sell date in the future is rejected (400), no write.
    #[tokio::test]
    async fn add_rejects_future_sell_date() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 350.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-09", "expiry": "2026-09-16"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
        assert!(
            !dir.path().join("holdings/test-uid.json").exists(),
            "future-dated add must not create the ledger"
        );
    }

    /// R3: fractional contracts truncate silently no more — 400.
    #[tokio::test]
    async fn add_rejects_fractional_contracts() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 350.0, "premium": 1.0,
                "contracts": 2.5, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
        assert!(v["error"].as_str().unwrap().contains("whole number"));
    }

    /// Ledger bound: the 101st position is a 400 (every mutation rewrites
    /// the document and refresh fans out per position — the bound keeps
    /// both honest).
    #[tokio::test]
    async fn add_rejects_overfull_ledger() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = HoldingsDocument::default();
        for i in 0..100 {
            doc.positions.push(market_int_core::holdings::Holding {
                id: format!("p{i}"),
                symbol: "GOOG".to_string(),
                strike: 350.0,
                expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
                premium: 1.0,
                contracts: 1,
                sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                mark: None,
            });
        }
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 350.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
        assert!(v["error"].as_str().unwrap().contains("maximum"));
    }

    /// Auth disabled (no VerifiedIdentity extension): the caller folds to
    /// the shared "local" ledger — local dev parity, not a path the armed
    /// gate can ever reach.
    #[tokio::test]
    async fn auth_disabled_folds_to_local_ledger() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let request = axum::http::Request::builder()
            .method("GET")
            .uri("/api/holdings")
            .body(Body::empty())
            .unwrap();
        let response = app.oneshot(request).await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let bytes = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let v: Value = serde_json::from_slice(&bytes).unwrap();
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
        // No per-uid file was created by a plain read.
        assert!(!dir.path().join("holdings/test-uid.json").exists());
        assert!(!dir.path().join("holdings/local.json").exists());
    }

    /// Seed two positions directly into the ledger document.
    fn seed_two(dir: &std::path::Path) {
        write_ledger(
            &dir.join("holdings"),
            "test-uid",
            &HoldingsDocument {
                positions: vec![
                    market_int_core::holdings::Holding {
                        id: "p-tsla".to_string(),
                        symbol: "TSLA".to_string(),
                        strike: 420.0,
                        expiry: NaiveDate::from_ymd_opt(2026, 9, 17).unwrap(),
                        premium: 4.5,
                        contracts: 1,
                        sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                        mark: Some(market_int_core::holdings::Mark {
                            mid: 4.0,
                            as_of: frozen_today() - chrono::Duration::hours(2),
                            underlying_price: Some(401.0),
                        }),
                    },
                    market_int_core::holdings::Holding {
                        id: "p-aapl".to_string(),
                        symbol: "AAPL".to_string(),
                        strike: 230.0,
                        expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
                        premium: 3.2,
                        contracts: 1,
                        sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                        mark: None,
                    },
                ],
                ..Default::default()
            },
        )
        .unwrap();
    }

    /// R4: a successful refresh updates every mark with a fresh as_of.
    #[tokio::test]
    async fn refresh_updates_marks() {
        let dir = tempfile::tempdir().unwrap();
        seed_two(dir.path());
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
            reqs.iter()
                .map(|r| {
                    let (mid, spot) = if r.symbol == "TSLA" { (2.2, 401.0) } else { (2.9, 244.0) };
                    MarkResult {
                        id: r.id.clone(),
                        mid: Ok(Some(mid)),
                        underlying: Some(spot),
                    }
                })
                .collect()
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 2);
        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 0);
        for p in v["positions"].as_array().unwrap() {
            assert!(p["mark"]["mid"].as_f64().unwrap() > 0.0);
            assert!(p["mark"]["as_of"].as_str().is_some());
        }
        // Persisted, not just echoed — including the R6 underlying close.
        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        assert!(file.contains("\"mid\": 2.2"), "tsla mark persisted: {file}");
        assert!(file.contains("\"underlying_price\": 401.0"), "spot persisted: {file}");
        let tsla = v["positions"]
            .as_array()
            .unwrap()
            .iter()
            .find(|p| p["id"] == "p-tsla")
            .unwrap();
        let spot_pct = tsla["view"]["spot_pct_vs_strike"].as_f64().unwrap();
        assert!((spot_pct - (401.0 - 420.0) / 420.0).abs() < 1e-12);
    }

    /// R4: one failed fetch never fails the request — that position keeps
    /// its previous mark and lands in `stale`; the other still updates.
    #[tokio::test]
    async fn refresh_partial_failure_is_stale_not_error() {
        let dir = tempfile::tempdir().unwrap();
        seed_two(dir.path());
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
            reqs.iter()
                .map(|r| MarkResult {
                    id: r.id.clone(),
                    mid: if r.symbol == "TSLA" {
                        Err("chain query failed: upstream 500".to_string())
                    } else {
                        Ok(Some(2.9))
                    },
                    underlying: if r.symbol == "TSLA" { None } else { Some(244.0) },
                })
                .collect()
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "one failure ≠ request failure");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
        let stale = v["refresh"]["stale"].as_array().unwrap();
        assert_eq!(stale.len(), 1);
        assert_eq!(stale[0]["id"], "p-tsla");
        assert!(stale[0]["reason"].as_str().is_some());

        let p = v["positions"]
            .as_array()
            .unwrap()
            .iter()
            .find(|p| p["id"] == "p-tsla")
            .unwrap();
        assert_eq!(p["mark"]["mid"], 4.0, "previous mark kept");
        let as_of = p["mark"]["as_of"].as_str().unwrap();
        assert_eq!(
            as_of,
            (frozen_today() - chrono::Duration::hours(2))
                .to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
            "as_of unchanged for the stale position"
        );
    }

    /// R4: no chain data (expired/delisted) is stale, not an error, and a
    /// non-positive mid is treated the same (no garbage marks).
    #[tokio::test]
    async fn refresh_missing_chain_data_is_stale() {
        let dir = tempfile::tempdir().unwrap();
        seed_two(dir.path());
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest]| {
            reqs.iter()
                .map(|r| MarkResult {
                    id: r.id.clone(),
                    mid: if r.symbol == "TSLA" {
                        Ok(None)
                    } else {
                        Ok(Some(0.0)) // garbage quote — rejected
                    },
                    underlying: None,
                })
                .collect()
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 2);
    }
}
