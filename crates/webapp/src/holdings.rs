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

/// One open option position handed to the mark fetcher. `side` selects the
/// chain side queried — puts and calls each query their own side (R5; the
/// call side existed in the Tiger client but was never exercised here).
#[derive(Debug, Clone)]
pub struct MarkRequest {
    pub id: String,
    pub symbol: String,
    pub strike: f64,
    pub expiry: NaiveDate,
    pub side: market_int_core::model::OptionChainSide,
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

/// The fetcher's whole outcome: option marks by request id, plus the
/// per-symbol underlying closes the same kline pass produced. Lots price
/// from `spots` — chain queries are never issued for lot symbols (R5).
#[derive(Debug)]
pub struct MarkBatch {
    pub marks: Vec<MarkResult>,
    pub spots: std::collections::BTreeMap<String, f64>,
}

/// Seam (Runner precedent): production constructs ONE Tiger requester per
/// refresh request and prices every position serially; the second argument
/// lists lot symbols so the same kline pass prices them into `spots`.
/// Tests script per-symbol outcomes with no network.
pub type MarkFetcher =
    Arc<dyn Fn(&[MarkRequest], &[String]) -> MarkBatch + Send + Sync>;

/// Production fetcher: one Tiger requester per refresh call, one underlying
/// kline per unique symbol across option AND lot symbols, then a
/// degenerate `(strike, strike)` chain query per option request on its
/// requested side (the `test-tiger` shape) — row mid already folds bid/ask
/// with a latest-trade fallback (`calculate_mid_price` at parse time). OI
/// minimum 0: we want *our* strike, not liquid ones. Blocking by design —
/// the refresh handler parks it on `spawn_blocking`.
pub fn live_fetcher() -> MarkFetcher {
    Arc::new(move |requests: &[MarkRequest], lot_symbols: &[String]| {
        fetch_marks_blocking(requests.to_vec(), lot_symbols.to_vec())
    })
}

fn fetch_marks_blocking(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> MarkBatch {
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build();
    match runtime {
        Ok(rt) => rt.block_on(fetch_marks(requests, lot_symbols)),
        Err(e) => MarkBatch {
            marks: requests
                .into_iter()
                .map(|r| MarkResult {
                    id: r.id,
                    mid: Err(format!("async runtime unavailable: {e}")),
                    underlying: None,
                })
                .collect(),
            spots: Default::default(),
        },
    }
}

async fn fetch_marks(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> MarkBatch {
    use std::collections::BTreeSet;

    let Some(requester) =
        market_int_core::tiger::api_caller::Requester::new().await
    else {
        return MarkBatch {
            marks: requests
                .into_iter()
                .map(|r| MarkResult {
                    id: r.id,
                    mid: Err(
                        "tiger requester init failed (TIGER_ID/TIGER_RSA set?)"
                            .to_string(),
                    ),
                    underlying: None,
                })
                .collect(),
            spots: Default::default(),
        };
    };

    // Underlying last close per unique symbol — the chain query needs it to
    // apply its moneyness filter correctly (0.0 would mark every strike
    // ITM), and lot symbols price from the very same pass (R5: one quote
    // per unique symbol, no extra API calls for lots).
    let mut underlyings: std::collections::HashMap<String, f64> =
        std::collections::HashMap::new();
    let mut symbols: BTreeSet<String> =
        requests.iter().map(|r| r.symbol.clone()).collect();
    symbols.extend(lot_symbols.iter().cloned());
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
            // Leave the symbol out — its positions/lots go stale below with
            // a precise reason.
            Err(e) => log::warn!("holdings: underlying quote for {symbol} failed: {e}"),
        }
    }

    let spots: std::collections::BTreeMap<String, f64> = underlyings
        .iter()
        .filter(|(symbol, _)| lot_symbols.contains(symbol))
        .map(|(symbol, &close)| (symbol.clone(), close))
        .collect();

    let mut marks = Vec::with_capacity(requests.len());
    for r in requests {
        let Some(&spot) = underlyings.get(&r.symbol) else {
            marks.push(MarkResult {
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
            &r.side,
            &underlyings,
        )
        .await;
        marks.push(MarkResult {
            id: r.id,
            mid,
            underlying: Some(spot),
        });
    }
    MarkBatch { marks, spots }
}

// The chain query is async and must run on the same runtime as the kline
// call — inlined as a small async helper driven by `fetch_marks`.
async fn chain_mid(
    requester: &market_int_core::tiger::api_caller::Requester,
    symbol: &str,
    strike: f64,
    expiry_ny: &chrono::DateTime<chrono_tz::Tz>,
    side: &market_int_core::model::OptionChainSide,
    underlyings: &std::collections::HashMap<String, f64>,
) -> Result<Option<f64>, String> {
    let rows = requester
        .query_option_chain(
            &[(symbol, (strike, strike))],
            underlyings,
            expiry_ny,
            0,
            side,
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

/// Per-user ledger document (R4): sibling arrays, never a tagged position
/// enum. Additive `#[serde(default)]` fields only — pre-wheel documents
/// (just `positions`) parse unchanged, schema version stays 1.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct HoldingsDocument {
    pub schema_version: u64,
    pub positions: Vec<market_int_core::holdings::Holding>,
    #[serde(default)]
    pub calls: Vec<market_int_core::holdings::CallHolding>,
    #[serde(default)]
    pub lots: Vec<market_int_core::holdings::ShareLot>,
    /// Manual balance — never the Tiger account API. `None` until the user
    /// sets it once.
    #[serde(default)]
    pub cash: Option<f64>,
}

impl Default for HoldingsDocument {
    fn default() -> Self {
        Self {
            schema_version: LEDGER_SCHEMA_VERSION,
            positions: Vec::new(),
            calls: Vec::new(),
            lots: Vec::new(),
            cash: None,
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

/// Calls render with the identical option shape (sibling arrays, same
/// fields — R1).
fn call_json(c: &market_int_core::holdings::CallHolding, today: chrono::NaiveDate) -> serde_json::Value {
    let mark = c.mark.as_ref().map(|m| {
        json!({
            "mid": m.mid,
            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
            "underlying_price": m.underlying_price,
        })
    });
    json!({
        "id": c.id,
        "symbol": c.symbol,
        "strike": c.strike,
        "expiry": c.expiry.to_string(),
        "premium": c.premium,
        "contracts": c.contracts,
        "sold": c.sold.to_string(),
        "mark": mark,
        "view": c.view(today),
    })
}

/// Covered-call contracts covering a lot's symbol — the covered count the
/// lot view renders (R2: it derives from the calls array).
fn covered_contracts(doc: &HoldingsDocument, symbol: &str) -> u32 {
    doc.calls
        .iter()
        .filter(|c| c.symbol == symbol)
        .map(|c| c.contracts)
        .sum()
}

fn lot_json(l: &market_int_core::holdings::ShareLot, today: chrono::NaiveDate, covered: u32) -> serde_json::Value {
    let mark = l.mark.as_ref().map(|m| {
        json!({
            "spot": m.spot,
            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
        })
    });
    json!({
        "id": l.id,
        "symbol": l.symbol,
        "shares": l.shares,
        "basis_per_share": l.basis_per_share,
        "acquired": l.acquired.to_string(),
        "mark": mark,
        "view": l.view(today, covered),
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
        "calls": doc
            .calls
            .iter()
            .map(|c| call_json(c, today))
            .collect::<Vec<_>>(),
        "lots": doc
            .lots
            .iter()
            .map(|l| lot_json(l, today, covered_contracts(doc, &l.symbol)))
            .collect::<Vec<_>>(),
        // The manual balance and its derived numbers (R3/R6): `cash` is
        // null until first set — `cash_free` then stays null with it,
        // while `cash_reserved` still derives from the open puts.
        "cash": doc.cash,
        "cash_reserved": market_int_core::holdings::reserved_cash(&doc.positions),
        "cash_free": doc
            .cash
            .map(|c| market_int_core::holdings::free_cash(c, &doc.positions)),
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
/// one chain query per option — a bound keeps both honest. A real book has
/// handfuls of open positions.
const MAX_POSITIONS_PER_LEDGER: usize = 100;

/// The entry count the cap bounds — all three arrays combined (R6).
fn ledger_entry_count(doc: &HoldingsDocument) -> usize {
    doc.positions.len() + doc.calls.len() + doc.lots.len()
}

/// `POST /api/holdings` — add to the caller's ledger. `kind` selects the
/// array: `"put"` (the default — deployed clients never send it),
/// `"call"`, or `"lot"` (R6).
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

    match v.get("kind").and_then(|k| k.as_str()).unwrap_or("put") {
        "put" | "call" => add_option_leg(st, uid, &v).await,
        "lot" => add_lot(st, uid, &v).await,
        other => error_response(
            StatusCode::BAD_REQUEST,
            &format!("unknown kind {other:?} (want put, call, or lot)"),
        ),
    }
}

/// The shared option-leg add: identical validation for puts and calls
/// (one rule set, two arrays — R6). The kind only picks where the entry
/// lands and the response key.
async fn add_option_leg(
    st: crate::api::AppState,
    uid: String,
    v: &serde_json::Value,
) -> Response {
    let kind = v.get("kind").and_then(|k| k.as_str()).unwrap_or("put");
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
        // (NEXT_SEQ precedent). Unique across ALL arrays — the id prefix
        // and clock stamp are shared by every kind.
        id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_position_seq()),
        symbol,
        strike,
        expiry,
        premium,
        contracts,
        sold,
        mark: None,
    };
    // One validation rule set serves both option kinds (R1 pinning).
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
    if ledger_entry_count(&doc) >= MAX_POSITIONS_PER_LEDGER {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
        );
    }
    let body = if kind == "call" {
        let call_h = market_int_core::holdings::CallHolding {
            id: holding.id.clone(),
            symbol: holding.symbol.clone(),
            strike: holding.strike,
            expiry: holding.expiry,
            premium: holding.premium,
            contracts: holding.contracts,
            sold: holding.sold,
            mark: None,
        };
        doc.calls.push(call_h.clone());
        Json(json!({ "call": call_json(&call_h, today_et(st.clock)) }))
    } else {
        doc.positions.push(holding.clone());
        Json(json!({ "position": position_json(&holding, today_et(st.clock)) }))
    };
    if let Err(err) =
        write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await
    {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    (StatusCode::CREATED, body).into_response()
}

/// The lot add (R6): core owns structural validation; the handler owns the
/// `acquired`-not-in-the-future rule, matching how `sold` is handled.
async fn add_lot(st: crate::api::AppState, uid: String, v: &serde_json::Value) -> Response {
    let symbol = v
        .get("symbol")
        .and_then(|s| s.as_str())
        .unwrap_or_default()
        .trim()
        .to_uppercase();
    let Some(shares_raw) = v.get("shares").and_then(|x| x.as_f64()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing shares");
    };
    if (shares_raw - shares_raw.trunc()).abs() > f64::EPSILON {
        return error_response(StatusCode::BAD_REQUEST, "shares must be a whole number");
    }
    let Some(shares) = u32::try_from(shares_raw as i64).ok().filter(|s| *s > 0) else {
        return error_response(StatusCode::BAD_REQUEST, "shares must be a positive integer");
    };
    let Some(basis_per_share) = v.get("basis_per_share").and_then(|x| x.as_f64()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing basis_per_share");
    };
    let Some(acquired_raw) = v.get("acquired").and_then(|x| x.as_str()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing acquired date");
    };
    let acquired = match parse_date(acquired_raw, "acquired") {
        Ok(d) => d,
        Err(resp) => return resp,
    };
    if acquired > today_et(st.clock) {
        return error_response(StatusCode::BAD_REQUEST, "acquired date is in the future");
    }

    let lot = market_int_core::holdings::ShareLot {
        id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_position_seq()),
        symbol,
        shares,
        basis_per_share,
        acquired,
        mark: None,
    };
    if let Err(reason) = lot.validate() {
        return error_response(StatusCode::BAD_REQUEST, &reason);
    }

    // R8: `assigned_from` makes this an assignment — the SAME
    // read-modify-write records the lot AND removes the referenced put.
    // Unknown id → 404 before any write, ledger byte-unchanged. No
    // external calls happen inside this window.
    let assigned_from = v
        .get("assigned_from")
        .and_then(|x| x.as_str())
        .map(|s| s.to_string());

    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    if let Some(put_id) = &assigned_from {
        let before = doc.positions.len();
        doc.positions.retain(|p| p.id != *put_id);
        if doc.positions.len() == before {
            return error_response(
                StatusCode::NOT_FOUND,
                "no such position for assigned_from",
            );
        }
    }
    if ledger_entry_count(&doc) >= MAX_POSITIONS_PER_LEDGER {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
        );
    }
    doc.lots.push(lot.clone());
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    (
        StatusCode::CREATED,
        Json(json!({ "lot": lot_json(&lot, today_et(st.clock), 0) })),
    )
        .into_response()
}

/// Per-process sequence for server-generated ids (NEXT_SEQ precedent).
fn next_position_seq() -> u64 {
    use std::sync::atomic::{AtomicU64, Ordering};
    static NEXT: AtomicU64 = AtomicU64::new(0);
    NEXT.fetch_add(1, Ordering::Relaxed)
}

/// `DELETE /api/holdings/{id}` — the outcome-confirm removal. One route
/// for every kind: positions, then calls, then lots (R6); an id in no
/// array is a 404 with no write.
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
    let removed = if doc.positions.iter().any(|p| p.id == id) {
        doc.positions.retain(|p| p.id != id);
        true
    } else if doc.calls.iter().any(|c| c.id == id) {
        doc.calls.retain(|c| c.id != id);
        true
    } else if doc.lots.iter().any(|l| l.id == id) {
        doc.lots.retain(|l| l.id != id);
        true
    } else {
        false
    };
    if !removed {
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

/// `PATCH /api/holdings/cash` — set the manual cash balance (R6, never the
/// Tiger account API). The response carries the derived reserved/free so
/// the UI strip re-renders from the response alone.
pub(crate) async fn holdings_patch_cash(
    State(st): State<crate::api::AppState>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), 16 * 1024).await {
        Ok(b) => b,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
    };
    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
    };
    let Some(cash) = v.get("cash").and_then(|x| x.as_f64()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing cash");
    };
    if !cash.is_finite() || cash < 0.0 {
        return error_response(StatusCode::BAD_REQUEST, "cash must be a number ≥ 0");
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
    doc.cash = Some(cash);
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    Json(json!({
        "cash": cash,
        "cash_reserved": market_int_core::holdings::reserved_cash(&doc.positions),
        "cash_free": market_int_core::holdings::free_cash(cash, &doc.positions),
    }))
    .into_response()
}

/// `POST /api/holdings/called-away` — the call was assigned: remove it and
/// reduce the covering lot by `contracts × 100` shares (FIFO, core
/// `apply_called_away`) in ONE rewrite (R9). No covering lot is a 200
/// outcome, not an error — the shares were called away regardless, so the
/// call still disappears; the response says `reduced: false` with a reason.
pub(crate) async fn holdings_called_away(
    State(st): State<crate::api::AppState>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), 16 * 1024).await {
        Ok(b) => b,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
    };
    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
    };
    let Some(call_id) = v.get("call_id").and_then(|x| x.as_str()).map(|s| s.to_string()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing call_id");
    };

    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    let Some(call_h) = doc.calls.iter().find(|c| c.id == call_id) else {
        return error_response(StatusCode::NOT_FOUND, "no such call");
    };
    let (symbol, contracts) = (call_h.symbol.clone(), call_h.contracts);
    let need = contracts as u64 * 100;

    // One rewrite: the call goes and the FIFO reduction applies together.
    let reduction =
        market_int_core::holdings::apply_called_away(&doc.lots, &symbol, contracts);
    doc.calls.retain(|c| c.id != call_id);
    let (reduced, reason) = match reduction {
        Some(lots) => {
            doc.lots = lots;
            (true, None)
        }
        None => (
            false,
            Some(format!(
                "no lot of {symbol} covers {need} shares — shares were called away, but no held lot was reduced"
            )),
        ),
    };
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    let mut body = json!({ "called_away": true, "reduced": reduced });
    if let Some(reason) = reason {
        body["reason"] = json!(reason);
    }
    Json(body).into_response()
}

/// `POST /api/holdings/refresh` — mark every open option (puts AND calls,
/// each queried on its own chain side) and price every lot from the same
/// pass's spot map (R5). One entry's fetch failure never fails the
/// request: it keeps its previous mark and is reported stale. The ledger
/// is RE-READ after the fetch and marks merged by id — a position added
/// while Tiger was being queried keeps its (mark-less) state instead of
/// being clobbered by the pre-fetch snapshot.
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

    use market_int_core::model::OptionChainSide;
    let mut requests: Vec<MarkRequest> = doc
        .positions
        .iter()
        .map(|p| MarkRequest {
            id: p.id.clone(),
            symbol: p.symbol.clone(),
            strike: p.strike,
            expiry: p.expiry,
            side: OptionChainSide::Put,
        })
        .collect();
    requests.extend(doc.calls.iter().map(|c| MarkRequest {
        id: c.id.clone(),
        symbol: c.symbol.clone(),
        strike: c.strike,
        expiry: c.expiry,
        side: OptionChainSide::Call,
    }));
    // Lot symbols travel for the spot map — deduped, several lots can
    // share one symbol and Tiger is quoted once for all of them.
    let lot_symbols: Vec<String> = {
        let mut symbols: std::collections::BTreeSet<String> =
            doc.lots.iter().map(|l| l.symbol.clone()).collect();
        symbols.into_iter().collect()
    };
    // Tiger is a blocking HTTP client — park the whole batch off the async
    // workers (read_document_off_thread precedent).
    let fetcher = st.mark_fetcher.clone();
    let batch = tokio::task::spawn_blocking(move || fetcher(&requests, &lot_symbols))
        .await
        .expect("spawn_blocking mark fetch");

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

    // Option marks merge by id across BOTH arrays — puts and calls carry
    // the same Mark.
    {
        trait OptionMarkSlot {
            fn opt_id(&self) -> &str;
            fn mark_slot(&mut self) -> &mut Option<market_int_core::holdings::Mark>;
        }
        impl OptionMarkSlot for Holding {
            fn opt_id(&self) -> &str {
                &self.id
            }
            fn mark_slot(&mut self) -> &mut Option<market_int_core::holdings::Mark> {
                &mut self.mark
            }
        }
        impl OptionMarkSlot for market_int_core::holdings::CallHolding {
            fn opt_id(&self) -> &str {
                &self.id
            }
            fn mark_slot(&mut self) -> &mut Option<market_int_core::holdings::Mark> {
                &mut self.mark
            }
        }

        let mut slots: Vec<&mut dyn OptionMarkSlot> = doc
            .positions
            .iter_mut()
            .map(|h| h as &mut dyn OptionMarkSlot)
            .chain(doc.calls.iter_mut().map(|c| c as &mut dyn OptionMarkSlot))
            .collect();
        for result in batch.marks {
            let Some(slot) = slots.iter_mut().find(|s| s.opt_id() == result.id) else {
                // Added/removed while the fetch was in flight — its request
                // was for a snapshot entry; nothing to apply.
                log::warn!("holdings: refresh result for unknown id {} dropped", result.id);
                continue;
            };
            match result.mid {
                Ok(Some(mid)) if mid > 0.0 => {
                    *slot.mark_slot() = Some(market_int_core::holdings::Mark {
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
    }

    // Lots price from the spot map — a lot whose symbol is missing from it
    // (kline failed, say) is stale with a reason and keeps its previous
    // SpotMark.
    for lot in &mut doc.lots {
        match batch.spots.get(&lot.symbol) {
            Some(&spot) => {
                lot.mark = Some(market_int_core::holdings::SpotMark { spot, as_of: now });
                ok.push(lot.id.clone());
            }
            None => stale.push((
                lot.id.clone(),
                format!("no underlying quote for {}", lot.symbol),
            )),
        }
    }

    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    let mut body = ledger_json(&doc, today_et(st.clock));
    if let serde_json::Value::Object(map) = &mut body {
        map.insert(
            "refresh".to_string(),
            json!({
                "ok": ok,
                "stale": stale
                    .into_iter()
                    .map(|(id, reason)| json!({"id": id, "reason": reason}))
                    .collect::<Vec<_>>(),
            }),
        );
    }
    axum::Json(body).into_response()
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

    /// R4: a pre-wheel document (only schema_version + positions) loads
    /// unchanged — calls/lots default empty, cash defaults None, positions
    /// round-trip intact. Schema version stays 1.
    #[test]
    fn old_put_only_ledger_loads_with_empty_defaults() {
        let dir = tempfile::tempdir().unwrap();
        std::fs::create_dir_all(dir.path()).unwrap();
        std::fs::write(
            dir.path().join("uid1.json"),
            r#"{"schema_version":1,"positions":[{"id":"h1","symbol":"GOOG","strike":350.0,
               "expiry":"2026-09-11","premium":1.0,"contracts":2,"sold":"2026-09-04",
               "mark":{"mid":0.5,"as_of":"2026-09-08T19:00:00Z","underlying_price":344.2}}]}"#,
        )
        .unwrap();
        let doc = read_ledger(dir.path(), "uid1").unwrap();
        assert_eq!(doc.schema_version, LEDGER_SCHEMA_VERSION);
        assert!(doc.calls.is_empty());
        assert!(doc.lots.is_empty());
        assert_eq!(doc.cash, None);
        assert_eq!(doc.positions.len(), 1);
        assert_eq!(doc.positions[0].id, "h1");
        assert_eq!(
            doc.positions[0].mark.as_ref().unwrap().underlying_price,
            Some(344.2)
        );
    }

    /// R4: a full wheel document round-trips losslessly — every field of
    /// every entry across positions, calls, lots, and cash.
    #[test]
    fn full_wheel_document_round_trips_losslessly() {
        let dir = tempfile::tempdir().unwrap();
        let as_of = chrono::Utc::now();
        let doc = HoldingsDocument {
            schema_version: LEDGER_SCHEMA_VERSION,
            positions: vec![sample_holding("h1")],
            calls: vec![market_int_core::holdings::CallHolding {
                id: "c1".to_string(),
                symbol: "GOOG".to_string(),
                strike: 360.0,
                expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
                premium: 1.2,
                contracts: 2,
                sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                mark: Some(market_int_core::holdings::Mark {
                    mid: 0.3,
                    as_of,
                    underlying_price: Some(370.0),
                }),
            }],
            lots: vec![market_int_core::holdings::ShareLot {
                id: "l1".to_string(),
                symbol: "GOOG".to_string(),
                shares: 200,
                basis_per_share: 349.0,
                acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                mark: Some(market_int_core::holdings::SpotMark {
                    spot: 370.0,
                    as_of,
                }),
            }],
            cash: Some(150_000.0),
        };
        write_ledger(dir.path(), "uid1", &doc).unwrap();
        let back = read_ledger(dir.path(), "uid1").unwrap();
        assert_eq!(back, doc, "every field of every entry survives");
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
        Arc::new(move |requests: &[MarkRequest], _lots: &[String]| MarkBatch {
            marks: requests
                .iter()
                .map(|r| MarkResult {
                    id: r.id.clone(),
                    mid: Ok(Some(mid)),
                    underlying: None,
                })
                .collect(),
            spots: Default::default(),
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
            MarkBatch {
                marks: reqs
                    .iter()
                    .map(|r| {
                        let (mid, spot) = if r.symbol == "TSLA" { (2.2, 401.0) } else { (2.9, 244.0) };
                        MarkResult {
                            id: r.id.clone(),
                            mid: Ok(Some(mid)),
                            underlying: Some(spot),
                        }
                    })
                    .collect(),
                spots: Default::default(),
            }
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
            MarkBatch {
                marks: reqs
                    .iter()
                    .map(|r| MarkResult {
                        id: r.id.clone(),
                        mid: if r.symbol == "TSLA" {
                            Err("chain query failed: upstream 500".to_string())
                        } else {
                            Ok(Some(2.9))
                        },
                        underlying: if r.symbol == "TSLA" { None } else { Some(244.0) },
                    })
                    .collect(),
                spots: Default::default(),
            }
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
            MarkBatch {
                marks: reqs
                    .iter()
                    .map(|r| MarkResult {
                        id: r.id.clone(),
                        mid: if r.symbol == "TSLA" {
                            Ok(None)
                        } else {
                            Ok(Some(0.0)) // garbage quote — rejected
                        },
                        underlying: None,
                    })
                    .collect(),
                spots: Default::default(),
            }
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 2);
    }

    /// Design doc `## Feature acceptance` (wheel-holdings), verbatim: the
    /// full wheel in one per-user ledger — cash in, put sold and refreshed
    /// (pace met), assigned into a share lot, a covered call sold from it
    /// and refreshed ITM, called away (FIFO reduction to zero) — with every
    /// intermediate state consistent: reserved/free re-derived, no orphan
    /// ids, one document per uid.
    ///
    /// Contract-picker script: strike 350 → mid 0.50 with GOOG at 344.20
    /// (the put refresh); strike 360 → mid 0.30 with GOOG at 370.00 (the
    /// call refresh — ITM for a short 360 call). Each phase refreshes
    /// exactly one option, so the strike key is unambiguous.
    #[tokio::test]
    async fn feature_acceptance_wheel_lifecycle() {
        let dir = tempfile::tempdir().unwrap();
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], lots: &[String]| {
            // Phase 1 (no lots yet): the put refresh — GOOG at 344.20.
            // Phase 2 (the lot exists): the call refresh — GOOG at 370.00
            // rides the spots map the lot prices from.
            let spots: std::collections::BTreeMap<String, f64> = if lots.is_empty() {
                Default::default()
            } else {
                [("GOOG".to_string(), 370.00)].into_iter().collect()
            };
            let marks = reqs
                .iter()
                .map(|r| {
                    let (mid, spot) = if (r.strike - 360.0).abs() < f64::EPSILON {
                        (0.30, 370.00)
                    } else {
                        (0.50, 344.20)
                    };
                    MarkResult {
                        id: r.id.clone(),
                        mid: Ok(Some(mid)),
                        underlying: Some(spot),
                    }
                })
                .collect();
            MarkBatch { marks, spots }
        });

        // Fresh ledger: nothing held anywhere, cash never set.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
        assert_eq!(v["calls"].as_array().unwrap().len(), 0);
        assert_eq!(v["lots"].as_array().unwrap().len(), 0);
        assert!(v["cash"].is_null(), "cash is null until first set");
        assert!(v["cash_free"].is_null(), "free stays null while cash is unset");

        // Cash in: PATCH $150,000 — the derived numbers come back computed.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"cash": 150000.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "patch cash: {v}");
        assert_eq!(v["cash"], 150000.0);
        assert_eq!(v["cash_reserved"], 0.0);
        assert_eq!(v["cash_free"], 150000.0);

        // Sell the GOOG 350P ×2 @ $1.00 (sold 2 working days ago, expiry 5
        // working days out) — a kind-less body, exactly as today.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 350.0, "premium": 1.0,
                "contracts": 2, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "put add: {v}");
        let put_id = v["position"]["id"].as_str().expect("put id").to_string();

        // Reserved/free re-derive from the open put: $70,000 / $80,000.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["cash_reserved"], 70000.0);
        assert_eq!(v["cash_free"], 80000.0);

        // Refresh with the scripted mid/spot: +50% vs target 40%, pace met.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "refresh: {v}");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
        let view = &v["positions"][0]["view"];
        assert_eq!(view["target_pct"], 0.4);
        assert_eq!(view["pl_pct"], 0.5);
        assert_eq!(view["pl_dollars"], 100.0, "2 contracts × 100 × $0.50 captured");
        assert_eq!(view["pace_met"], true);
        let vs_strike = view["spot_pct_vs_strike"].as_f64().unwrap();
        assert!(vs_strike < 0.0, "344.20 vs 350 strike is OTM for the put");

        // Close as assigned at $340 → the prefilled lot (200 sh, basis =
        // strike − premium = $349.00, acquired today) records with
        // assigned_from, and the put is gone in the same rewrite.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-08",
                "assigned_from": put_id
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "assignment: {v}");
        let lot_id = v["lot"]["id"].as_str().expect("lot id").to_string();

        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0, "put gone");
        let lots = v["lots"].as_array().unwrap();
        assert_eq!(lots.len(), 1);
        assert_eq!(lots[0]["shares"], 200);
        assert_eq!(lots[0]["basis_per_share"], 349.0);
        assert!(lots[0]["view"]["value"].is_null(), "unpriced until refresh");

        // Sell the covered ×2 call (strike 360) from the lot.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "call", "symbol": "GOOG", "strike": 360.0,
                "premium": 1.20, "contracts": 2,
                "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "call add: {v}");
        let call_id = v["call"]["id"].as_str().expect("call id").to_string();

        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["calls"].as_array().unwrap().len(), 1);
        assert_eq!(v["lots"][0]["view"]["capacity"], 2, "floor(200/100)");
        assert_eq!(
            v["lots"][0]["view"]["covered"], 2,
            "covered derives from the calls array"
        );

        // Refresh with GOOG at $370 (mid 0.30): the short 360 call is ITM
        // and the lot prices from the same pass's spot.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "refresh 2: {v}");
        assert_eq!(
            v["refresh"]["ok"].as_array().unwrap().len(), 2,
            "the call prices from its chain, the lot from the spot map"
        );
        let call_view = &v["calls"][0]["view"];
        let vs_strike = call_view["spot_pct_vs_strike"].as_f64().unwrap();
        assert!(
            vs_strike > 0.0,
            "370 vs 360 strike is ITM for the call — the chip's driver"
        );
        let lot_view = &v["lots"][0]["view"];
        assert_eq!(lot_view["value"], 74000.0, "370 × 200");
        assert_eq!(lot_view["pl_dollars"], 4200.0, "(370 − 349) × 200");
        assert_eq!(lot_view["covered"], 2);

        // Called away: the call is removed and the lot reduces 200 → 0 in
        // the same rewrite, so it disappears too.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": call_id})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "called away: {v}");
        assert_eq!(v["called_away"], true);
        assert_eq!(v["reduced"], true);

        // End state: everything closed, cash back at the full balance.
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
        assert_eq!(v["calls"].as_array().unwrap().len(), 0);
        assert_eq!(v["lots"].as_array().unwrap().len(), 0);
        assert_eq!(v["cash"], 150000.0);
        assert_eq!(v["cash_reserved"], 0.0);
        assert_eq!(v["cash_free"], 150000.0);

        // No orphan ids, one document per uid.
        let file =
            std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        for orphan in [put_id, call_id, lot_id] {
            assert!(!file.contains(&orphan), "orphan id {orphan} survived: {file}");
        }
        let files: Vec<String> = std::fs::read_dir(dir.path().join("holdings"))
            .unwrap()
            .map(|e| e.unwrap().file_name().to_string_lossy().into_owned())
            .collect();
        assert_eq!(files, vec!["test-uid.json".to_string()], "one document per uid");
    }

    /// R5: the handler prepares ONE fetch for all three kinds — option
    /// requests carry their side, lot symbols ride along for the spot map,
    /// and lot symbols never become chain-query requests.
    #[tokio::test]
    async fn refresh_prepares_side_carrying_requests_and_lot_symbols() {
        let dir = tempfile::tempdir().unwrap();
        write_ledger(
            &dir.path().join("holdings"),
            "test-uid",
            &HoldingsDocument {
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
                    id: "p-goog".to_string(),
                    symbol: "GOOG".to_string(),
                    strike: 350.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
                    premium: 1.0,
                    contracts: 1,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: None,
                }],
                calls: vec![market_int_core::holdings::CallHolding {
                    id: "c-aapl".to_string(),
                    symbol: "AAPL".to_string(),
                    strike: 240.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
                    premium: 2.0,
                    contracts: 1,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: None,
                }],
                lots: vec![market_int_core::holdings::ShareLot {
                    id: "l-lofa".to_string(),
                    symbol: "LOFA".to_string(),
                    shares: 100,
                    basis_per_share: 20.0,
                    acquired: NaiveDate::from_ymd_opt(2026, 9, 1).unwrap(),
                    mark: None,
                }],
                cash: None,
            },
        )
        .unwrap();

        let seen: Arc<std::sync::Mutex<Option<(Vec<String>, Vec<String>)>>> =
            Arc::new(std::sync::Mutex::new(None));
        let fetcher: MarkFetcher = {
            let seen = seen.clone();
            Arc::new(move |reqs: &[MarkRequest], lots: &[String]| {
                *seen.lock().unwrap() = Some((
                    reqs.iter()
                        .map(|r| format!("{}:{:?}", r.symbol, r.side))
                        .collect(),
                    lots.to_vec(),
                ));
                MarkBatch {
                    marks: Vec::new(),
                    spots: Default::default(),
                }
            })
        };
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, _) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK);

        let (requests, lots) = seen.lock().unwrap().take().expect("fetcher called");
        assert!(requests.contains(&"GOOG:Put".to_string()), "{requests:?}");
        assert!(requests.contains(&"AAPL:Call".to_string()), "{requests:?}");
        assert_eq!(
            requests.len(), 2,
            "lot symbols never become chain queries: {requests:?}"
        );
        assert_eq!(lots, vec!["LOFA".to_string()]);
    }

    /// R5: merging a MarkBatch — option marks land by id (put AND call),
    /// lots price from `spots` as SpotMarks stamped now, and a lot whose
    /// symbol is absent from `spots` is stale, keeping its previous
    /// SpotMark.
    #[tokio::test]
    async fn refresh_merges_batch_marks_and_spots() {
        let dir = tempfile::tempdir().unwrap();
        let frozen = frozen_today();
        write_ledger(
            &dir.path().join("holdings"),
            "test-uid",
            &HoldingsDocument {
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
                    id: "p1".to_string(),
                    symbol: "GOOG".to_string(),
                    strike: 350.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
                    premium: 1.0,
                    contracts: 1,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: Some(market_int_core::holdings::Mark {
                        mid: 0.9,
                        as_of: frozen - chrono::Duration::hours(2),
                        underlying_price: None,
                    }),
                }],
                calls: vec![market_int_core::holdings::CallHolding {
                    id: "c1".to_string(),
                    symbol: "GOOG".to_string(),
                    strike: 360.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
                    premium: 1.2,
                    contracts: 2,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: None,
                }],
                lots: vec![
                    market_int_core::holdings::ShareLot {
                        id: "l-goog".to_string(),
                        symbol: "GOOG".to_string(),
                        shares: 200,
                        basis_per_share: 349.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: Some(market_int_core::holdings::SpotMark {
                            spot: 344.20,
                            as_of: frozen - chrono::Duration::hours(2),
                        }),
                    },
                    market_int_core::holdings::ShareLot {
                        id: "l-nope".to_string(),
                        symbol: "NOPE".to_string(),
                        shares: 100,
                        basis_per_share: 100.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: Some(market_int_core::holdings::SpotMark {
                            spot: 100.0,
                            as_of: frozen - chrono::Duration::hours(2),
                        }),
                    },
                ],
                cash: None,
            },
        )
        .unwrap();

        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
            MarkBatch {
                marks: reqs
                    .iter()
                    .map(|r| MarkResult {
                        id: r.id.clone(),
                        mid: Ok(Some(if r.id == "p1" { 0.5 } else { 0.3 })),
                        underlying: Some(370.0),
                    })
                    .collect(),
                spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
            }
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "{v}");

        // ok spans the kinds that priced: both options plus the GOOG lot;
        // the NOPE lot is stale with a reason.
        let ok = v["refresh"]["ok"].as_array().unwrap();
        assert!(ok.contains(&json!("p1")) && ok.contains(&json!("c1")) && ok.contains(&json!("l-goog")), "{ok:?}");
        let stale = v["refresh"]["stale"].as_array().unwrap();
        assert_eq!(stale.len(), 1);
        assert_eq!(stale[0]["id"], "l-nope");
        assert!(stale[0]["reason"].as_str().unwrap().contains("NOPE"));

        // Marks landed by id; SpotMark stamped at the frozen `now`.
        let lots = v["lots"].as_array().unwrap();
        let goog = lots.iter().find(|l| l["id"] == "l-goog").unwrap();
        assert_eq!(goog["mark"]["spot"], 370.0);
        assert_eq!(
            goog["mark"]["as_of"],
            frozen.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
            "SpotMark as_of is the refresh's now"
        );
        assert_eq!(goog["view"]["value"], 74000.0);
        let nope = lots.iter().find(|l| l["id"] == "l-nope").unwrap();
        assert_eq!(
            nope["mark"]["spot"], 100.0,
            "absent from spots — previous SpotMark kept"
        );
        let calls = v["calls"].as_array().unwrap();
        assert_eq!(calls[0]["mark"]["mid"], 0.3, "call mark landed by id");

        // Persisted, not just echoed.
        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        assert!(file.contains("\"spot\": 370.0"), "{file}");
        assert!(file.contains("\"mid\": 0.5"), "{file}");
        assert!(file.contains("\"mid\": 0.3"), "{file}");
        assert!(file.contains("\"spot\": 100.0"), "{file}");
    }

    /// R6: `kind: "call"` lands in the calls array with its computed view.
    #[tokio::test]
    async fn add_call_lands_in_calls_with_view() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "call", "symbol": "GOOG", "strike": 360.0,
                "premium": 1.2, "contracts": 2,
                "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        assert_eq!(v["call"]["symbol"], "GOOG");
        assert!(
            v["call"]["view"]["days_total"].as_u64().is_some(),
            "computed view rides the response: {v}"
        );
        assert!(v["call"]["mark"].is_null(), "no mark until refresh");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["calls"].as_array().unwrap().len(), 1);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0, "not a put");
    }

    /// R6: `kind: "lot"` lands unpriced in lots; capacity still computes.
    #[tokio::test]
    async fn add_lot_lands_unpriced() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-08"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let lot = &v["lot"];
        assert_eq!(lot["shares"], 200);
        assert!(lot["mark"].is_null(), "unpriced until refresh");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let lots = v["lots"].as_array().unwrap();
        assert_eq!(lots.len(), 1);
        assert!(lots[0]["view"]["value"].is_null(), "unpriced lot view");
        assert_eq!(lots[0]["view"]["capacity"], 2);
    }

    /// R6: lot validation — future acquired, zero shares, non-positive
    /// basis, blank symbol are 400s and never write the ledger.
    #[tokio::test]
    async fn add_lot_rejects_invalid_without_writing() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        for (label, payload) in [
            ("future acquired", json!({"kind": "lot", "symbol": "GOOG", "shares": 100, "basis_per_share": 349.0, "acquired": "2026-09-09"})),
            ("zero shares", json!({"kind": "lot", "symbol": "GOOG", "shares": 0, "basis_per_share": 349.0, "acquired": "2026-09-08"})),
            ("zero basis", json!({"kind": "lot", "symbol": "GOOG", "shares": 100, "basis_per_share": 0.0, "acquired": "2026-09-08"})),
            ("blank symbol", json!({"kind": "lot", "symbol": "  ", "shares": 100, "basis_per_share": 349.0, "acquired": "2026-09-08"})),
        ] {
            let (status, v) = call(app.clone(), "POST", "/api/holdings", Some(payload)).await;
            assert_eq!(status, StatusCode::BAD_REQUEST, "{label}: {v}");
            assert!(v["error"].as_str().is_some(), "{label} carries a reason");
        }
        assert!(
            !dir.path().join("holdings/test-uid.json").exists(),
            "failed lot adds must not create the ledger"
        );
    }

    /// R6: an unknown kind is a 400.
    #[tokio::test]
    async fn add_rejects_unknown_kind() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "bond", "symbol": "GOOG"})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "{v}");
    }

    /// R6: PATCH /api/holdings/cash sets the balance and derives
    /// reserved/free from the open puts; negative or missing cash is a
    /// 400 with no write.
    #[tokio::test]
    async fn patch_cash_sets_balance_and_derives() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = HoldingsDocument::default();
        doc.positions.push(market_int_core::holdings::Holding {
            id: "p1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 350.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            premium: 1.0,
            contracts: 2,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: None,
        });
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"cash": 150000.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["cash"], 150000.0);
        assert_eq!(v["cash_reserved"], 70000.0);
        assert_eq!(v["cash_free"], 80000.0);

        // GET reflects the balance alongside the derived numbers.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["cash"], 150000.0);
        assert_eq!(v["cash_reserved"], 70000.0);
        assert_eq!(v["cash_free"], 80000.0);

        // Negative and missing are 400s.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "PATCH", "/api/holdings/cash", Some(json!({"cash": -1.0}))).await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "PATCH", "/api/holdings/cash", Some(json!({}))).await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }

    /// R6: DELETE searches positions, then calls, then lots — one route
    /// for every kind; an id in no array stays a 404 with no write.
    #[tokio::test]
    async fn delete_removes_from_any_array() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = HoldingsDocument::default();
        doc.positions.push(market_int_core::holdings::Holding {
            id: "p1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 350.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            premium: 1.0,
            contracts: 1,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: None,
        });
        doc.calls.push(market_int_core::holdings::CallHolding {
            id: "c1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 360.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
            premium: 1.2,
            contracts: 1,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: None,
        });
        doc.lots.push(market_int_core::holdings::ShareLot {
            id: "l1".to_string(),
            symbol: "GOOG".to_string(),
            shares: 100,
            basis_per_share: 349.0,
            acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
            mark: None,
        });
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", "/api/holdings/c1", None).await;
        assert_eq!(status, StatusCode::OK, "call removed");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["calls"].as_array().unwrap().len(), 0);
        assert_eq!(v["positions"].as_array().unwrap().len(), 1, "put untouched");
        assert_eq!(v["lots"].as_array().unwrap().len(), 1, "lot untouched");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", "/api/holdings/l1", None).await;
        assert_eq!(status, StatusCode::OK, "lot removed");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", "/api/holdings/h-nope", None).await;
        assert_eq!(status, StatusCode::NOT_FOUND);
    }

    /// R6: the 100-entry cap counts across all three arrays combined.
    #[tokio::test]
    async fn cap_counts_entries_combined() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = HoldingsDocument::default();
        for i in 0..99 {
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
        doc.calls.push(market_int_core::holdings::CallHolding {
            id: "c99".to_string(),
            symbol: "GOOG".to_string(),
            strike: 360.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
            premium: 1.2,
            contracts: 1,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: None,
        });
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();

        // Any kind is rejected at 100 combined.
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
        assert_eq!(status, StatusCode::BAD_REQUEST, "{v}");
        assert!(v["error"].as_str().unwrap().contains("maximum"));

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "lot", "symbol": "GOOG", "shares": 100, "basis_per_share": 349.0, "acquired": "2026-09-08"})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }

    /// R7: one pass marks all three kinds and survives a mid-flight
    /// mutation — an entry added while the fetch was in flight survives
    /// the re-read merge unclobbered (the write-back-pre-call-snapshot
    /// hazard from docs/lessons.md).
    #[tokio::test]
    async fn refresh_marks_all_kinds_and_keeps_mid_flight_adds() {
        let dir = tempfile::tempdir().unwrap();
        let ledger_dir = dir.path().join("holdings");
        write_ledger(
            &ledger_dir,
            "test-uid",
            &HoldingsDocument {
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
                    id: "p1".to_string(),
                    symbol: "GOOG".to_string(),
                    strike: 350.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
                    premium: 1.0,
                    contracts: 1,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: None,
                }],
                calls: vec![market_int_core::holdings::CallHolding {
                    id: "c1".to_string(),
                    symbol: "GOOG".to_string(),
                    strike: 360.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
                    premium: 1.2,
                    contracts: 2,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: None,
                }],
                lots: vec![market_int_core::holdings::ShareLot {
                    id: "l1".to_string(),
                    symbol: "GOOG".to_string(),
                    shares: 200,
                    basis_per_share: 349.0,
                    acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                    mark: None,
                }],
                cash: None,
            },
        )
        .unwrap();

        let fetcher: MarkFetcher = {
            let ledger_dir = ledger_dir.clone();
            Arc::new(move |reqs: &[MarkRequest], _lots: &[String]| {
                // Another request's mutation lands while "Tiger" is being
                // queried: a fresh mark-less position joins the ledger.
                let mut doc = read_ledger(&ledger_dir, "test-uid").unwrap();
                doc.positions
                    .push(market_int_core::holdings::Holding {
                        id: "p-late".to_string(),
                        symbol: "AAPL".to_string(),
                        strike: 230.0,
                        expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
                        premium: 3.2,
                        contracts: 1,
                        sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                        mark: None,
                    });
                write_ledger(&ledger_dir, "test-uid", &doc).unwrap();
                MarkBatch {
                    marks: reqs
                        .iter()
                        .map(|r| MarkResult {
                            id: r.id.clone(),
                            mid: Ok(Some(if r.id == "p1" { 0.5 } else { 0.3 })),
                            underlying: Some(370.0),
                        })
                        .collect(),
                    spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
                }
            })
        };
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "{v}");
        let ok = v["refresh"]["ok"].as_array().unwrap();
        assert_eq!(ok.len(), 3, "put + call + lot all priced: {ok:?}");

        // The mid-flight position survived with its mark-less state; the
        // snapshot entries still got their marks.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let positions = v["positions"].as_array().unwrap();
        assert_eq!(positions.len(), 2, "p1 + p-late both present");
        let p1 = positions.iter().find(|p| p["id"] == "p1").unwrap();
        assert_eq!(p1["mark"]["mid"], 0.5);
        let late = positions.iter().find(|p| p["id"] == "p-late").unwrap();
        assert!(late["mark"].is_null(), "added mid-flight, never clobbered");
        assert_eq!(v["calls"][0]["mark"]["mid"], 0.3);
        assert_eq!(v["lots"][0]["mark"]["spot"], 370.0);
    }

    /// R7: one pass can fail half its kinds — the option lands stale with
    /// its previous mark while the lot still prices from spots.
    #[tokio::test]
    async fn refresh_mixed_failure_is_per_entry_stale() {
        let dir = tempfile::tempdir().unwrap();
        let ledger_dir = dir.path().join("holdings");
        write_ledger(
            &ledger_dir,
            "test-uid",
            &HoldingsDocument {
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
                    id: "p1".to_string(),
                    symbol: "GOOG".to_string(),
                    strike: 350.0,
                    expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
                    premium: 1.0,
                    contracts: 1,
                    sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
                    mark: Some(market_int_core::holdings::Mark {
                        mid: 0.9,
                        as_of: frozen_today() - chrono::Duration::hours(2),
                        underlying_price: None,
                    }),
                }],
                calls: Vec::new(),
                lots: vec![
                    market_int_core::holdings::ShareLot {
                        id: "l-goog".to_string(),
                        symbol: "GOOG".to_string(),
                        shares: 200,
                        basis_per_share: 349.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: None,
                    },
                    market_int_core::holdings::ShareLot {
                        id: "l-nope".to_string(),
                        symbol: "NOPE".to_string(),
                        shares: 100,
                        basis_per_share: 100.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: Some(market_int_core::holdings::SpotMark {
                            spot: 100.0,
                            as_of: frozen_today() - chrono::Duration::hours(2),
                        }),
                    },
                ],
                cash: None,
            },
        )
        .unwrap();

        // The put's chain query fails; GOOT spot arrives for the GOOG lot;
        // NOPE's kline failed so it's missing from spots entirely.
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
            MarkBatch {
                marks: reqs
                    .iter()
                    .map(|r| MarkResult {
                        id: r.id.clone(),
                        mid: Err("chain query failed: upstream 500".to_string()),
                        underlying: None,
                    })
                    .collect(),
                spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
            }
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "per-entry failures ≠ request failure");
        let ok = v["refresh"]["ok"].as_array().unwrap();
        assert_eq!(
            ok,
            &vec![json!("l-goog")],
            "only the spot-priced lot is ok: {ok:?}"
        );
        let stale: Vec<String> = v["refresh"]["stale"]
            .as_array()
            .unwrap()
            .iter()
            .map(|s| s["id"].as_str().unwrap().to_string())
            .collect();
        assert!(stale.contains(&"p1".to_string()), "{stale:?}");
        assert!(stale.contains(&"l-nope".to_string()), "{stale:?}");

        let lots = v["lots"].as_array().unwrap();
        let nope = lots.iter().find(|l| l["id"] == "l-nope").unwrap();
        assert_eq!(nope["mark"]["spot"], 100.0, "previous SpotMark kept");
        let p1 = v["positions"][0].clone();
        assert_eq!(p1["mark"]["mid"], 0.9, "previous mark kept");
    }

    /// R8: assignment — the lot records and the put disappears in ONE
    /// rewrite (the put is only gone when the lot is recorded).
    #[tokio::test]
    async fn assignment_records_lot_and_removes_put() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = HoldingsDocument::default();
        doc.positions.push(market_int_core::holdings::Holding {
            id: "p1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 350.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            premium: 1.0,
            contracts: 2,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: Some(market_int_core::holdings::Mark {
                mid: 0.5,
                as_of: frozen_today(),
                underlying_price: Some(344.2),
            }),
        });
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-08",
                "assigned_from": "p1"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        assert_eq!(v["lot"]["shares"], 200);

        // One request later: the put is gone, the lot is present.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0, "put gone");
        let lots = v["lots"].as_array().unwrap();
        assert_eq!(lots.len(), 1);
        assert_eq!(lots[0]["basis_per_share"], 349.0);

        // The persisted document agrees — no orphan put.
        let file =
            std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        assert!(!file.contains("\"p1\""), "orphan put survived: {file}");
        assert!(file.contains("\"shares\": 200"), "{file}");
    }

    /// R8: `assigned_from` naming no existing put is a 404 with the ledger
    /// byte-unchanged; the same body without it is a plain lot add.
    #[tokio::test]
    async fn assignment_unknown_put_is_404_without_write() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = HoldingsDocument::default();
        doc.positions.push(market_int_core::holdings::Holding {
            id: "p1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 350.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 11).unwrap(),
            premium: 1.0,
            contracts: 2,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: None,
        });
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();
        let ledger_path = dir.path().join("holdings/test-uid.json");
        let before = std::fs::read(&ledger_path).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-08",
                "assigned_from": "h-nope"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::NOT_FOUND, "{v}");
        assert_eq!(
            std::fs::read(&ledger_path).unwrap(),
            before,
            "ledger byte-unchanged"
        );

        // Without assigned_from: plain add, put untouched.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-08"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["positions"].as_array().unwrap().len(), 1, "put untouched");
        assert_eq!(v["lots"].as_array().unwrap().len(), 1);
    }

    fn fifo_fixture() -> HoldingsDocument {
        let mut doc = HoldingsDocument::default();
        doc.calls.push(market_int_core::holdings::CallHolding {
            id: "c1".to_string(),
            symbol: "GOOG".to_string(),
            strike: 360.0,
            expiry: NaiveDate::from_ymd_opt(2026, 9, 18).unwrap(),
            premium: 1.2,
            contracts: 1,
            sold: NaiveDate::from_ymd_opt(2026, 9, 4).unwrap(),
            mark: Some(market_int_core::holdings::Mark {
                mid: 3.0,
                as_of: frozen_today(),
                underlying_price: Some(370.0),
            }),
        });
        doc.lots.push(market_int_core::holdings::ShareLot {
            id: "l-old".to_string(),
            symbol: "GOOG".to_string(),
            shares: 200,
            basis_per_share: 349.0,
            acquired: NaiveDate::from_ymd_opt(2026, 9, 1).unwrap(),
            mark: None,
        });
        doc.lots.push(market_int_core::holdings::ShareLot {
            id: "l-new".to_string(),
            symbol: "GOOG".to_string(),
            shares: 100,
            basis_per_share: 349.0,
            acquired: NaiveDate::from_ymd_opt(2026, 9, 5).unwrap(),
            mark: None,
        });
        doc
    }

    /// R9: called away — the call is removed and the earliest-acquired
    /// covering lot is reduced by contracts × 100, all in one rewrite.
    #[tokio::test]
    async fn called_away_reduces_fifo_and_removes_call() {
        let dir = tempfile::tempdir().unwrap();
        write_ledger(&dir.path().join("holdings"), "test-uid", &fifo_fixture()).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": "c1"})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["called_away"], true);
        assert_eq!(v["reduced"], true);

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["calls"].as_array().unwrap().len(), 0, "call gone");
        let lots = v["lots"].as_array().unwrap();
        let l_old = lots.iter().find(|l| l["id"] == "l-old").unwrap();
        assert_eq!(l_old["shares"], 100, "FIFO: earliest lot reduced");
        assert_eq!(lots.len(), 2, "l-new untouched");
    }

    /// R9: no covering lot is a 200 outcome, not an error — the call is
    /// still removed and the lots stay untouched.
    #[tokio::test]
    async fn called_away_without_covering_lot_still_removes_call() {
        let dir = tempfile::tempdir().unwrap();
        let mut doc = fifo_fixture();
        doc.calls[0].contracts = 3; // need 300 > any lot's shares
        write_ledger(&dir.path().join("holdings"), "test-uid", &doc).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": "c1"})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["called_away"], true);
        assert_eq!(v["reduced"], false);
        assert!(v["reason"].as_str().is_some(), "says what happened: {v}");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["calls"].as_array().unwrap().len(), 0, "call still removed");
        let lots = v["lots"].as_array().unwrap();
        assert_eq!(lots[0]["shares"], 200, "lots untouched");
        assert_eq!(lots[1]["shares"], 100, "lots untouched");
    }

    /// R9: an unknown call_id is a 404 with the ledger byte-unchanged.
    #[tokio::test]
    async fn called_away_unknown_call_is_404_without_write() {
        let dir = tempfile::tempdir().unwrap();
        write_ledger(&dir.path().join("holdings"), "test-uid", &fifo_fixture()).unwrap();
        let ledger_path = dir.path().join("holdings/test-uid.json");
        let before = std::fs::read(&ledger_path).unwrap();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": "h-nope"})),
        )
        .await;
        assert_eq!(status, StatusCode::NOT_FOUND, "{v}");
        assert_eq!(
            std::fs::read(&ledger_path).unwrap(),
            before,
            "ledger byte-unchanged"
        );
    }
}
