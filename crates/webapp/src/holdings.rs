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

/// Which US-equity session an instant falls in (ET wall clock; Blue-Ocean
/// overnight 20:00–04:00 ET, no Friday- or Saturday-night session — the
/// live probe showed Friday 20:00+ returns no overnight bars). A clock
/// heuristic, not a trading calendar: half-days and holidays read as the
/// regular schedule.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum MarketSession {
    PreMarket,
    Regular,
    AfterHours,
    OverNight,
    /// Weekend daytime (and Friday night) — nothing active to emphasize,
    /// extended data still fetched and shown.
    Closed,
}

/// Classify an instant by the ET wall clock (extended-hours R3).
fn et_market_session(now: DateTime<Utc>) -> MarketSession {
    use chrono::Datelike;
    use chrono::Timelike;
    use chrono::Weekday::*;
    use chrono_tz::America::New_York;
    let et = now.with_timezone(&New_York);
    let minutes = et.hour() * 60 + et.minute();
    match et.weekday() {
        Sat => MarketSession::Closed,
        Sun if minutes >= 20 * 60 => MarketSession::OverNight,
        Sun => MarketSession::Closed,
        Fri if minutes >= 20 * 60 => MarketSession::Closed,
        _ if (4 * 60..9 * 60 + 30).contains(&minutes) => MarketSession::PreMarket,
        _ if (9 * 60 + 30..16 * 60).contains(&minutes) => MarketSession::Regular,
        _ if (16 * 60..20 * 60).contains(&minutes) => MarketSession::AfterHours,
        _ => MarketSession::OverNight, // 20:00–24:00 Mon–Thu and 00:00–04:00 Tue–Fri
    }
}

/// The fetcher's whole outcome: option marks by request id, plus the
/// per-symbol underlying closes the same kline pass produced. Lots price
/// from `spots` — chain queries are never issued for lot symbols (R5).
/// `ext` carries the extended-session closes per lot symbol (empty until
/// the closed-session fetch merges them, extended-hours R3).
#[derive(Debug)]
pub struct MarkBatch {
    pub marks: Vec<MarkResult>,
    pub spots: std::collections::BTreeMap<String, f64>,
    pub ext: std::collections::BTreeMap<String, SessionQuotes>,
}

/// One lot symbol's extended-session closes, assembled from the per-session
/// kline calls. A session whose call failed or returned no bars is `None`.
#[derive(Debug)]
pub struct SessionQuotes {
    pub pre: Option<market_int_core::model::ExtQuote>,
    pub post: Option<market_int_core::model::ExtQuote>,
    pub overnight: Option<market_int_core::model::ExtQuote>,
}

/// Seam (Runner precedent): production constructs ONE Tiger requester per
/// refresh request and prices every position serially; the second argument
/// lists lot symbols so the same kline pass prices them into `spots`.
/// Tests script per-symbol outcomes with no network.
pub type MarkFetcher =
    Arc<dyn Fn(&[MarkRequest], &[String], MarketSession) -> MarkBatch + Send + Sync>;

/// Production fetcher: one Tiger requester per refresh call, one underlying
/// kline per unique symbol across option AND lot symbols, then a
/// degenerate `(strike, strike)` chain query per option request on its
/// requested side (the `test-tiger` shape) — row mid already folds bid/ask
/// with a latest-trade fallback (`calculate_mid_price` at parse time). OI
/// minimum 0: we want *our* strike, not liquid ones. Blocking by design —
/// the refresh handler parks it on `spawn_blocking`.
pub fn live_fetcher() -> MarkFetcher {
    Arc::new(move |requests: &[MarkRequest], lot_symbols: &[String], session: MarketSession| {
        fetch_marks_blocking(requests.to_vec(), lot_symbols.to_vec(), session)
    })
}

fn fetch_marks_blocking(
    requests: Vec<MarkRequest>,
    lot_symbols: Vec<String>,
    session: MarketSession,
) -> MarkBatch {
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build();
    match runtime {
        Ok(rt) => rt.block_on(fetch_marks(requests, lot_symbols, session)),
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
                ext: Default::default(),
        },
    }
}

async fn fetch_marks(
    requests: Vec<MarkRequest>,
    lot_symbols: Vec<String>,
    session: MarketSession,
) -> MarkBatch {
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
                ext: Default::default(),
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

    // Extended-session closes, best-effort and only outside Regular: one
    // 1-minute kline call per extended session for the deduped lot symbols
    // (option symbols never get extended calls). A failed or empty session
    // costs only its own segments.
    let ext = if session != MarketSession::Regular && !lot_symbols.is_empty() {
        fetch_session_quotes(&requester, &lot_symbols).await
    } else {
        Default::default()
    };

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
    MarkBatch { marks, spots, ext }
}

/// One 1-minute kline call per extended session for the lot symbols,
/// folded into per-symbol `SessionQuotes`. A session whose call fails or
/// returns no bars leaves its slot `None` (extended-hours R3).
async fn fetch_session_quotes(
    requester: &market_int_core::tiger::api_caller::Requester,
    lot_symbols: &[String],
) -> std::collections::BTreeMap<String, SessionQuotes> {
    let mut out: std::collections::BTreeMap<String, SessionQuotes> = lot_symbols
        .iter()
        .map(|s| {
            (
                s.clone(),
                SessionQuotes {
                    pre: None,
                    post: None,
                    overnight: None,
                },
            )
        })
        .collect();
    let refs: Vec<&str> = lot_symbols.iter().map(|s| s.as_str()).collect();
    for (name, slot) in [
        ("PreMarket", 0u8),
        ("AfterHours", 1u8),
        ("OverNight", 2u8),
    ] {
        match requester.query_session_closes(&refs, name).await {
            Ok(closes) => {
                for (symbol, quote) in closes {
                    if let Some(entry) = out.get_mut(&symbol) {
                        match slot {
                            0 => entry.pre = Some(quote),
                            1 => entry.post = Some(quote),
                            _ => entry.overnight = Some(quote),
                        }
                    }
                }
            }
            Err(e) => log::warn!("holdings: extended closes for {name} failed: {e}"),
        }
    }
    out.retain(|_, q| q.pre.is_some() || q.post.is_some() || q.overnight.is_some());
    out
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

/// One named cash pool — a broker account the user sells against (cash
/// pools design R1). Additive ledger sibling: `#[serde(default)]` array,
/// schema stays 1 (ADR-002).
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct CashPool {
    pub id: String,
    /// Defaults keep one hand-edited partial row from failing the WHOLE
    /// document parse (read_ledger's corrupt→empty fallback would then
    /// clobber the user's real ledger on the next write).
    #[serde(default)]
    pub name: String,
    /// Manual balance for this account — never the Tiger account API.
    #[serde(default)]
    pub cash: f64,
}

/// Reserved id of the implicit pool a legacy scalar `cash` reads as (and
/// the id it materializes under on first write).
pub const DEFAULT_POOL_ID: &str = "main";
const DEFAULT_POOL_NAME: &str = "Main";

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
    /// sets it once. Legacy scalar: superseded by `cash_pools` once those
    /// exist, but kept serialized so a rollback build still reads the
    /// balance (ADR-002 whole-document rewrite consequence).
    #[serde(default)]
    pub cash: Option<f64>,
    /// Named cash pools (broker accounts). Empty ⇒ the legacy scalar above
    /// reads as one implicit "Main" pool (lazy migration on first write).
    #[serde(default)]
    pub cash_pools: Vec<CashPool>,
}

impl Default for HoldingsDocument {
    fn default() -> Self {
        Self {
            schema_version: LEDGER_SCHEMA_VERSION,
            positions: Vec::new(),
            calls: Vec::new(),
            lots: Vec::new(),
            cash: None,
            cash_pools: Vec::new(),
        }
    }
}

/// The default (first) pool's id — where `None`-pool entries land.
fn first_pool_id(doc: &HoldingsDocument) -> String {
    doc.cash_pools
        .first()
        .map(|p| p.id.clone())
        .unwrap_or_else(|| DEFAULT_POOL_ID.to_string())
}

/// The pool an entry with `pool_id` spends: its own pool, else the ledger's
/// default (first) pool.
fn effective_pool_id(doc: &HoldingsDocument, pool_id: &Option<String>) -> String {
    pool_id
        .clone()
        .unwrap_or_else(|| first_pool_id(doc))
}

/// The display name of the pool an entry spends (for the row tags): its
/// own pool's name, the default pool's name for `None` entries, "Main"
/// while the ledger is still the legacy implicit shape.
fn pool_name_of(doc: &HoldingsDocument, pool_id: &Option<String>) -> String {
    let eff = effective_pool_id(doc, pool_id);
    doc.cash_pools
        .iter()
        .find(|p| p.id == eff)
        .map(|p| p.name.clone())
        .unwrap_or_else(|| DEFAULT_POOL_NAME.to_string())
}

/// Lazy migration (cash pools R1): the first write turns a legacy scalar
/// `cash` (or a fresh ledger, cash 0) into one real "Main" pool. Reads
/// never rewrite — an unwritten legacy document keeps rendering implicit.
fn materialize_default_pool(doc: &mut HoldingsDocument) {
    if doc.cash_pools.is_empty() {
        doc.cash_pools.push(CashPool {
            id: DEFAULT_POOL_ID.to_string(),
            name: DEFAULT_POOL_NAME.to_string(),
            cash: doc.cash.unwrap_or(0.0),
        });
    }
}

/// The aggregate balance the list response reports: the pool sum once
/// pools exist, else the legacy scalar.
fn total_cash(doc: &HoldingsDocument) -> Option<f64> {
    if doc.cash_pools.is_empty() {
        doc.cash
    } else {
        Some(doc.cash_pools.iter().map(|p| p.cash).sum())
    }
}

/// Keep the legacy scalar mirroring the pool sum on every mutation write.
/// Pools supersede it for reads, but the rolled-back build (ADR-002
/// consequence) reads ONLY the scalar — letting it drift stale would show
/// a rolled-back client a long-gone balance.
fn sync_scalar_cash(doc: &mut HoldingsDocument) {
    if !doc.cash_pools.is_empty() {
        doc.cash = Some(doc.cash_pools.iter().map(|p| p.cash).sum());
    }
}

/// Reserved cash charged to one pool: its own puts plus the unassigned
/// puts when it is the ledger's default (first) pool. `by_pool` is passed
/// in so a multi-pool render computes the partition once, not per pool.
fn reserved_for_pool(
    doc: &HoldingsDocument,
    by_pool: &std::collections::BTreeMap<Option<String>, f64>,
    pool_id: &str,
) -> f64 {
    let own = by_pool
        .get(&Some(pool_id.to_string()))
        .copied()
        .unwrap_or(0.0);
    let unassigned = by_pool.get(&None).copied().unwrap_or(0.0);
    if pool_id == first_pool_id(doc) { own + unassigned } else { own }
}

/// One pool row of the list/PATCH responses — the single builder for the
/// `{id, name, cash, reserved, free}` shape.
fn pool_view_json(
    doc: &HoldingsDocument,
    by_pool: &std::collections::BTreeMap<Option<String>, f64>,
    pool: &CashPool,
) -> serde_json::Value {
    let reserved = reserved_for_pool(doc, by_pool, &pool.id);
    json!({
        "id": pool.id, "name": pool.name, "cash": pool.cash,
        "reserved": reserved, "free": pool.cash - reserved,
    })
}

/// The per-pool rows of the list response (cash pools R1): cash, reserved,
/// free per pool. Entries with no `pool_id` fold into the FIRST pool. A
/// legacy document (no pools, scalar cash set) renders one implicit "Main"
/// pool; a fresh ledger renders none.
fn pool_views(doc: &HoldingsDocument) -> Vec<serde_json::Value> {
    let by_pool = market_int_core::holdings::reserved_cash_by_pool(&doc.positions);
    if doc.cash_pools.is_empty() {
        return match doc.cash {
            Some(cash) => {
                let reserved = reserved_for_pool(doc, &by_pool, &first_pool_id(doc));
                vec![json!({
                    "id": DEFAULT_POOL_ID, "name": DEFAULT_POOL_NAME,
                    "cash": cash, "reserved": reserved, "free": cash - reserved,
                })]
            }
            None => vec![],
        };
    }
    doc.cash_pools
        .iter()
        .map(|p| pool_view_json(doc, &by_pool, p))
        .collect()
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

/// The option entry shape shared by positions and calls (identical fields
/// since R1 — one renderer, two thin wrappers, no drift surface).
#[allow(clippy::too_many_arguments)]
fn option_json(
    id: &str,
    symbol: &str,
    strike: f64,
    expiry: chrono::NaiveDate,
    premium: f64,
    contracts: u32,
    sold: chrono::NaiveDate,
    mark: Option<&market_int_core::holdings::Mark>,
    view: market_int_core::holdings::HoldingView,
) -> serde_json::Value {
    let mark = mark.map(|m| {
        json!({
            "mid": m.mid,
            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
            "underlying_price": m.underlying_price,
        })
    });
    json!({
        "id": id,
        "symbol": symbol,
        "strike": strike,
        "expiry": expiry.to_string(),
        "premium": premium,
        "contracts": contracts,
        "sold": sold.to_string(),
        "mark": mark,
        "view": view,
    })
}

fn position_json(doc: &HoldingsDocument, h: &Holding, today: chrono::NaiveDate) -> serde_json::Value {
    let mut v = option_json(
        &h.id,
        &h.symbol,
        h.strike,
        h.expiry,
        h.premium,
        h.contracts,
        h.sold,
        h.mark.as_ref(),
        h.view(today),
    );
    if let Some(pool) = &h.pool_id {
        v["pool_id"] = json!(pool);
    }
    // Which pool of cash the put spends (row tag) — resolved, so the
    // client never re-derives the None-folds-to-default rule.
    v["pool_name"] = json!(pool_name_of(doc, &h.pool_id));
    v
}

/// Calls render with the identical option shape (sibling arrays, same
/// fields — R1): the shared `option_json` renderer.
fn call_json(doc: &HoldingsDocument, c: &market_int_core::holdings::CallHolding, today: chrono::NaiveDate) -> serde_json::Value {
    let mut v = option_json(
        &c.id,
        &c.symbol,
        c.strike,
        c.expiry,
        c.premium,
        c.contracts,
        c.sold,
        c.mark.as_ref(),
        c.view(today),
    );
    if let Some(pool) = &c.pool_id {
        v["pool_id"] = json!(pool);
    }
    v["pool_name"] = json!(pool_name_of(doc, &c.pool_id));
    v
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

fn lot_json(l: &market_int_core::holdings::ShareLot, today: chrono::NaiveDate, covered: u32, doc: &HoldingsDocument) -> serde_json::Value {
    let mark = l.mark.as_ref().map(|m| {
        // Extended-hours fields ride additively (absent when None, matching
        // the persisted document's skip_serializing_if shape).
        let mut mark = json!({
            "spot": m.spot,
            "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
        });
        if let Some(pre) = &m.pre {
            mark["pre"] = json!(pre);
        }
        if let Some(post) = &m.post {
            mark["post"] = json!(post);
        }
        if let Some(overnight) = &m.overnight {
            mark["overnight"] = json!(overnight);
        }
        if let Some(session) = &m.session {
            mark["session"] = json!(session);
        }
        mark
    });
    let mut v = json!({
        "id": l.id,
        "symbol": l.symbol,
        "shares": l.shares,
        "basis_per_share": l.basis_per_share,
        "acquired": l.acquired.to_string(),
        "mark": mark,
        "view": l.view(today, covered),
    });
    if let Some(pool) = &l.pool_id {
        v["pool_id"] = json!(pool);
    }
    // Shape parity with puts/calls: the resolved pool name rides along
    // (the lot pill's text; "Main" while the ledger is the legacy shape).
    v["pool_name"] = json!(pool_name_of(doc, &l.pool_id));
    v
}

fn ledger_json(doc: &HoldingsDocument, today: chrono::NaiveDate) -> serde_json::Value {
    // Pools supersede the legacy scalar once they exist: the aggregate is
    // the pool sum, and the legacy `cash` key stays for back-compat.
    let cash = total_cash(doc);
    json!({
        "schema_version": doc.schema_version,
        "positions": doc
            .positions
            .iter()
            .map(|p| position_json(doc, p, today))
            .collect::<Vec<_>>(),
        "calls": doc
            .calls
            .iter()
            .map(|c| call_json(doc, c, today))
            .collect::<Vec<_>>(),
        "lots": doc
            .lots
            .iter()
            .map(|l| lot_json(l, today, covered_contracts(doc, &l.symbol), doc))
            .collect::<Vec<_>>(),
        // The manual balance and its derived numbers (R3/R6): `cash` is
        // null until first set — `cash_free` then stays null with it,
        // while `cash_reserved` still derives from the open puts.
        "cash": cash,
        "cash_reserved": market_int_core::holdings::reserved_cash(&doc.positions),
        "cash_free": cash.map(|c| market_int_core::holdings::free_cash(c, &doc.positions)),
        // Per-pool breakdown (cash pools R1): frees sum to `cash_free`.
        "cash_pools": pool_views(doc),
    })
}

/// The `pool_id` a mutation body claims, trimmed; absent/blank ⇒ None.
fn requested_pool_id(v: &serde_json::Value) -> Option<String> {
    v.get("pool_id")
        .and_then(|x| x.as_str())
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())
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

/// Mutation bodies are tiny JSON documents; the bound is generous.
const MAX_BODY_BYTES: usize = 16 * 1024;

/// `POST /api/holdings` — add to the caller's ledger. `kind` selects the
/// array: `"put"` (the default — deployed clients never send it),
/// `"call"`, `"lot"`, or `"pool"` (cash pools R2).
pub(crate) async fn holdings_add(State(st): State<crate::api::AppState>, req: Request) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), MAX_BODY_BYTES).await {
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
        "pool" => add_pool(st, uid, &v).await,
        other => error_response(
            StatusCode::BAD_REQUEST,
            &format!("unknown kind {other:?} (want put, call, lot, or pool)"),
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
        // (NEXT_SEQ precedent). Unique across ALL arrays — entries share
        // the `h` prefix; pools use their own `p` namespace.
        id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_entry_seq()),
        symbol,
        strike,
        expiry,
        premium,
        contracts,
        sold,
        mark: None,
        pool_id: None,
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
    materialize_default_pool(&mut doc);
    // The claimed pool must exist (a typo must not silently spend the
    // default pool). Calls without an explicit pool inherit from the
    // same-symbol lots they would cover — the lot's pool IS the shares'
    // pool (cash pools R4); no call-side picker.
    let requested_pool = requested_pool_id(v);
    let inherited_pool = if kind == "call" && requested_pool.is_none() {
        // The FIFO-earliest covering lot — the one called-away would
        // reduce — owns the shares' pool the call inherits.
        doc.lots
            .iter()
            .filter(|l| l.symbol == holding.symbol)
            .min_by(|a, b| (a.acquired, &a.id).cmp(&(b.acquired, &b.id)))
            .and_then(|l| l.pool_id.clone())
    } else {
        None
    };
    let pool_id = requested_pool.or(inherited_pool);
    if let Some(pid) = &pool_id {
        if !doc.cash_pools.iter().any(|p| &p.id == pid) {
            return error_response(
                StatusCode::BAD_REQUEST,
                &format!("unknown pool_id {pid:?}"),
            );
        }
    }
    let holding = Holding { pool_id, ..holding };
    if ledger_entry_count(&doc) >= MAX_POSITIONS_PER_LEDGER {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
        );
    }
    sync_scalar_cash(&mut doc);
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
            pool_id: holding.pool_id.clone(),
        };
        doc.calls.push(call_h.clone());
        Json(json!({ "call": call_json(&doc, &call_h, today_et(st.clock)) }))
    } else {
        doc.positions.push(holding.clone());
        Json(json!({ "position": position_json(&doc, &holding, today_et(st.clock)) }))
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
        id: format!("h{}-{}", (st.clock)().timestamp_millis(), next_entry_seq()),
        symbol,
        shares,
        basis_per_share,
        acquired,
        mark: None,
        pool_id: None,
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
    // Explicit pool wins; an assignment defaults to the put's pool — the
    // shares land in the account that secured them (cash pools R4).
    let requested_pool = requested_pool_id(v);

    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    materialize_default_pool(&mut doc);
    // The assignment's cash move happens on the PUT's pool: strike×100
    // leaves the pool that reserved it (cash pools R4/R6).
    let mut assigned_cash_move: Option<f64> = None;
    let mut lot = lot;
    if let Some(put_id) = &assigned_from {
        let Some(put) = doc.positions.iter().find(|p| p.id == *put_id) else {
            return error_response(
                StatusCode::NOT_FOUND,
                "no such position for assigned_from",
            );
        };
        // An assignment records the shares the put actually delivered —
        // a GOOG put can never become an AAPL lot.
        if put.symbol != lot.symbol {
            return error_response(
                StatusCode::BAD_REQUEST,
                &format!(
                    "assigned_from put is for {} — the lot must record the same symbol",
                    put.symbol
                ),
            );
        }
            assigned_cash_move = Some(put.strike * 100.0 * put.contracts as f64);
        if lot.pool_id.is_none() {
            lot.pool_id = put.pool_id.clone();
        }
        doc.positions.retain(|p| p.id != *put_id);
    }
    let pool_id = match requested_pool.or_else(|| lot.pool_id.clone()) {
        Some(pid) => {
            if !doc.cash_pools.iter().any(|p| p.id == pid) {
                return error_response(
                    StatusCode::BAD_REQUEST,
                    &format!("unknown pool_id {pid:?}"),
                );
            }
            Some(pid)
        }
        None => None,
    };
    lot.pool_id = pool_id;
    // The cash move leaves the lot's FINAL pool (an explicit override
    // moves the debit with it): an assignment spends strike×100 — the
    // shares the put delivered; a manual purchase spends its cost
    // (shares × basis). Only the put's-pool dangling case is unreachable
    // by validation — moving the money silently would hide it.
    let debit = if assigned_from.is_some() {
        assigned_cash_move
    } else {
        Some(lot.shares as f64 * lot.basis_per_share)
    };
    if let Some(amount) = debit {
        let debit_pool = effective_pool_id(&doc, &lot.pool_id);
        match doc.cash_pools.iter_mut().find(|p| p.id == debit_pool) {
            Some(pool) => pool.cash -= amount,
            None => {
                return error_response(
                    StatusCode::CONFLICT,
                    &format!("the put's pool {debit_pool:?} no longer exists — reassign the put's pool first"),
                )
            }
        }
    }
    if ledger_entry_count(&doc) >= MAX_POSITIONS_PER_LEDGER {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("ledger holds the maximum of {MAX_POSITIONS_PER_LEDGER} positions — close one first"),
        );
    }
    doc.lots.push(lot.clone());
    sync_scalar_cash(&mut doc);
    // Covered count from the post-mutation document — the 201 reflects the
    // real coverage, not a placeholder.
    let covered = covered_contracts(&doc, &lot.symbol);
    let body = json!({ "lot": lot_json(&lot, today_et(st.clock), covered, &doc) });
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    (StatusCode::CREATED, Json(body)).into_response()
}

/// Per-process sequence for server-generated ids (NEXT_SEQ precedent).
fn next_entry_seq() -> u64 {
    use std::sync::atomic::{AtomicU64, Ordering};
    static NEXT: AtomicU64 = AtomicU64::new(0);
    NEXT.fetch_add(1, Ordering::Relaxed)
}

/// `POST /api/holdings` `kind:"pool"` — a new named cash pool (cash pools
/// R2). Materializes the legacy scalar first, so a legacy ledger keeps its
/// balance in "Main" and the new pool starts at 0. Names are required and
/// trimmed; ids are server-generated (the `p` prefix namespace). The array
/// is bounded like the entries — an unbounded pool list would be the one
/// new unbounded resource this feature adds.
const MAX_POOLS_PER_LEDGER: usize = 20;

/// Characters, not bytes — non-ASCII names get the full budget.
const MAX_POOL_NAME_CHARS: usize = 80;

async fn add_pool(st: crate::api::AppState, uid: String, v: &serde_json::Value) -> Response {
    let name = v
        .get("name")
        .and_then(|x| x.as_str())
        .map(|s| s.trim().to_string())
        .unwrap_or_default();
    if name.is_empty() {
        return error_response(StatusCode::BAD_REQUEST, "missing pool name");
    }
    if name.chars().count() > MAX_POOL_NAME_CHARS {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("pool name too long (max {MAX_POOL_NAME_CHARS} characters)"),
        );
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
    materialize_default_pool(&mut doc);
    if doc.cash_pools.len() >= MAX_POOLS_PER_LEDGER {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("ledger holds the maximum of {MAX_POOLS_PER_LEDGER} pools — delete one first"),
        );
    }
    let pool = CashPool {
        id: format!("p{}-{}", (st.clock)().timestamp_millis(), next_entry_seq()),
        name,
        cash: 0.0,
    };
    doc.cash_pools.push(pool.clone());
    sync_scalar_cash(&mut doc);
    let by_pool = market_int_core::holdings::reserved_cash_by_pool(&doc.positions);
    let body = Json(json!({ "pool": pool_view_json(&doc, &by_pool, &pool) }));
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    (StatusCode::CREATED, body).into_response()
}

/// `DELETE /api/holdings/{id}` — the outcome-confirm removal. One route
/// for every kind: positions, then calls, then lots, then pools (R6 +
/// cash pools R2); an id in no array is a 404 with no write. A pool with
/// referencing entries is a 409 — the entries must be closed or moved
/// first, so no entry can dangle.
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
    } else if let Some(pool) = doc.cash_pools.iter().find(|p| p.id == id).cloned() {
        // Puts, lots AND calls may reference the pool (calls inherit it);
        // any reference blocks the delete (cash pools R2 — no danglers).
        let referenced = doc
            .positions
            .iter()
            .map(|p| &p.pool_id)
            .chain(doc.calls.iter().map(|c| &c.pool_id))
            .chain(doc.lots.iter().map(|l| &l.pool_id))
            .any(|pool| pool.as_deref() == Some(id.as_str()));
        if referenced {
            return error_response(
                StatusCode::CONFLICT,
                &format!(
                    "pool {:?} still has open entries — close or move them first",
                    pool.name
                ),
            );
        }
        // A funded pool deletes freely (user decision after preview): the
        // pool's recorded cash simply leaves the aggregate with it.
        // The FIRST pool is where None-pool entries land: deleting it would
        // silently migrate their reservations to the next pool.
        let is_first = doc.cash_pools.first().map(|p| p.id.as_str()) == Some(id.as_str());
        let has_unassigned = doc
            .positions
            .iter()
            .map(|p| &p.pool_id)
            .chain(doc.lots.iter().map(|l| &l.pool_id))
            .any(|pool| pool.is_none());
        if is_first && has_unassigned {
            return error_response(
                StatusCode::CONFLICT,
                &format!(
                    "pool {:?} is the default pool and still holds unassigned entries — assign them a pool first",
                    pool.name
                ),
            );
        }
        doc.cash_pools.retain(|p| p.id != id);
        // Down to zero pools ⇒ fall back to the legacy scalar so a
        // single-pool ledger reads exactly like the pre-pool shape.
        if doc.cash_pools.is_empty() {
            doc.cash = Some(pool.cash);
        }
        sync_scalar_cash(&mut doc);
        true
    } else {
        false
    };
    if !removed {
        return error_response(StatusCode::NOT_FOUND, "no such holding");
    }
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    Json(json!({ "removed": id })).into_response()
}

/// `PATCH /api/holdings/{id}` — reassign an open put to a cash pool
/// (`{pool_id}`; cash pools R4 + pool-consistency pass). Puts and lots
/// take a picker — a put's reservation and a lot's future called-away
/// scoping are both derived from `pool_id` at read time, so the move is a
/// field rewrite with no stored cash changing hands. Covered calls inherit
/// the covering lot's pool and take no picker.
pub(crate) async fn holdings_patch(
    State(st): State<crate::api::AppState>,
    AxPath(id): AxPath<String>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), MAX_BODY_BYTES).await {
        Ok(b) => b,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
    };
    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
    };
    let Some(pool_id) = requested_pool_id(&v) else {
        return error_response(StatusCode::BAD_REQUEST, "missing pool_id");
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
    if doc.calls.iter().any(|c| c.id == id) {
        return error_response(
            StatusCode::BAD_REQUEST,
            "covered calls inherit the shares' pool — reassign the covering lot",
        );
    }
    if !doc.cash_pools.iter().any(|p| p.id == pool_id) {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("unknown pool_id {pool_id:?}"),
        );
    }
    // Lot reassignment (pool-consistency pass): a lot IS the shares' pool;
    // moving it moves future called-away scoping — stored cash never moves.
    if let Some(li) = doc.lots.iter().position(|l| l.id == id) {
        doc.lots[li].pool_id = Some(pool_id.clone());
        let lot = doc.lots[li].clone();
        let body =
            json!({ "lot": lot_json(&lot, today_et(st.clock), covered_contracts(&doc, &lot.symbol), &doc) });
        sync_scalar_cash(&mut doc);
        if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger write failed: {err}"),
            );
        }
        return Json(body).into_response();
    }
    let updated = {
        let Some(pos) = doc.positions.iter_mut().find(|p| p.id == id) else {
            return error_response(StatusCode::NOT_FOUND, "no such holding");
        };
        pos.pool_id = Some(pool_id.clone());
        pos.clone()
    };
    sync_scalar_cash(&mut doc);
    let pos_json = position_json(&doc, &updated, today_et(st.clock));
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    Json(json!({ "position": pos_json })).into_response()
}

/// `PATCH /api/holdings/cash` — set a pool's cash balance (and/or rename
/// the pool; cash pools R2, never the Tiger account API). `{cash}` with no
/// `pool_id` targets the FIRST pool — byte-for-byte the legacy route's
/// behavior for single-pool ledgers. The response carries the pool view
/// plus the derived aggregates so the UI strip re-renders from the
/// response alone.
pub(crate) async fn holdings_patch_cash(
    State(st): State<crate::api::AppState>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), MAX_BODY_BYTES).await {
        Ok(b) => b,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
    };
    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
    };
    let cash = v.get("cash").and_then(|x| x.as_f64());
    let name = v
        .get("name")
        .and_then(|x| x.as_str())
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty());
    if cash.is_none() && name.is_none() {
        return error_response(StatusCode::BAD_REQUEST, "missing cash or name");
    }
    if let Some(cash) = cash {
        if !cash.is_finite() || cash < 0.0 {
            return error_response(StatusCode::BAD_REQUEST, "cash must be a number ≥ 0");
        }
    }
    let requested_pool = requested_pool_id(&v);

    let mut doc = match read_ledger_off_thread(st.holdings_dir.clone(), uid.clone()).await {
        Ok(d) => d,
        Err(err) => {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger read failed: {err}"),
            )
        }
    };
    materialize_default_pool(&mut doc);
    let target_id = requested_pool.unwrap_or_else(|| first_pool_id(&doc));
    let Some(target_idx) = doc
        .cash_pools
        .iter()
        .position(|p| p.id == target_id)
    else {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("unknown pool_id {target_id:?}"),
        );
    };
    if let Some(cash) = cash {
        doc.cash_pools[target_idx].cash = cash;
    }
    if let Some(name) = name {
        doc.cash_pools[target_idx].name = name;
    }
    sync_scalar_cash(&mut doc);
    let by_pool = market_int_core::holdings::reserved_cash_by_pool(&doc.positions);
    let pool_view = pool_view_json(&doc, &by_pool, &doc.cash_pools[target_idx]);
    let aggregate_cash = total_cash(&doc);
    let reserved_total = market_int_core::holdings::reserved_cash(&doc.positions);
    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    Json(json!({
        "pool": pool_view,
        "cash": aggregate_cash,
        "cash_reserved": reserved_total,
        "cash_free": aggregate_cash.map(|c| c - reserved_total),
    }))
    .into_response()
}

/// `POST /api/holdings/close` — a manual lot close (close-lot R1): reduce
/// the lot by `shares` (removed at zero) and credit the proceeds
/// (`price × shares`) to the lot's pool in ONE rewrite. Unknown lot → 404;
/// zero/negative shares, shares beyond the lot, or a non-positive price →
/// 400; nothing writes on any error.
pub(crate) async fn holdings_close(
    State(st): State<crate::api::AppState>,
    req: Request,
) -> Response {
    let uid = uid_of(&req);
    let bytes = match axum::body::to_bytes(req.into_body(), MAX_BODY_BYTES).await {
        Ok(b) => b,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "unreadable body"),
    };
    let v: serde_json::Value = match serde_json::from_slice(&bytes) {
        Ok(v) => v,
        Err(_) => return error_response(StatusCode::BAD_REQUEST, "body is not JSON"),
    };
    let Some(lot_id) = v.get("lot_id").and_then(|x| x.as_str()).map(|s| s.to_string()) else {
        return error_response(StatusCode::BAD_REQUEST, "missing lot_id");
    };
    // as_u64 rejects negatives and fractions in one move; zero is a no-op,
    // not a close.
    let Some(shares) = v.get("shares").and_then(|x| x.as_u64()) else {
        return error_response(StatusCode::BAD_REQUEST, "shares must be a positive integer");
    };
    if shares == 0 {
        return error_response(StatusCode::BAD_REQUEST, "shares must be positive");
    }
    let Some(price) = v.get("price").and_then(|x| x.as_f64()).filter(|p| *p > 0.0) else {
        return error_response(StatusCode::BAD_REQUEST, "price must be positive");
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
    let Some(idx) = doc.lots.iter().position(|l| l.id == lot_id) else {
        return error_response(StatusCode::NOT_FOUND, "no such lot");
    };
    let held = doc.lots[idx].shares as u64;
    if shares > held {
        return error_response(
            StatusCode::BAD_REQUEST,
            &format!("close shares exceed held shares ({held})"),
        );
    }
    let proceeds = price * shares as f64;

    // One rewrite: reduce the lot (drop at zero) and credit ITS pool —
    // proceeds return to the same pool the shares belong to (user
    // decision; the dangling-pool fallback below stays as a safety net).
    materialize_default_pool(&mut doc);
    let pool_id = effective_pool_id(&doc, &doc.lots[idx].pool_id);
    let reduced_shares = doc.lots[idx].shares - shares as u32;
    if reduced_shares == 0 {
        doc.lots.remove(idx);
    } else {
        doc.lots[idx].shares = reduced_shares;
    }
    // Credit the lot's pool; a dangling pool_id (its pool was deleted)
    // falls back to the default pool so proceeds can never vanish.
    let pool_slot = match doc.cash_pools.iter_mut().find(|p| p.id == pool_id) {
        Some(pool) => Some(pool),
        None => doc.cash_pools.first_mut(),
    };
    if let Some(pool) = pool_slot {
        pool.cash += proceeds;
    }
    sync_scalar_cash(&mut doc);

    if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await {
        return error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            &format!("ledger write failed: {err}"),
        );
    }
    let mut body = ledger_json(&doc, today_et(st.clock));
    if let serde_json::Value::Object(map) = &mut body {
        map.insert(
            "close".to_string(),
            json!({ "closed": true, "shares": shares, "proceeds": proceeds }),
        );
    }
    Json(body).into_response()
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
    let bytes = match axum::body::to_bytes(req.into_body(), MAX_BODY_BYTES).await {
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
    let (symbol, contracts, call_strike) = (call_h.symbol.clone(), call_h.contracts, call_h.strike);
    let need = contracts as u64 * 100;

    // One rewrite: the call goes and the FIFO reduction applies together —
    // scoped to the call's OWN pool (cash pools R4: no cross-pool
    // reduction, so one symbol held in two accounts reduces in the account
    // the call was written against).
    let call_pool = effective_pool_id(&doc, &call_h.pool_id);
    let candidates: Vec<market_int_core::holdings::ShareLot> = doc
        .lots
        .iter()
        .filter(|l| {
            l.symbol == symbol && effective_pool_id(&doc, &l.pool_id) == call_pool
        })
        .cloned()
        .collect();
    let reduction =
        market_int_core::holdings::apply_called_away(&candidates, &symbol, contracts);
    doc.calls.retain(|c| c.id != call_id);
    let (reduced, reason) = match reduction {
        Some(reduced_lots) => {
            let reduced_ids: std::collections::HashSet<&str> =
                reduced_lots.iter().map(|l| l.id.as_str()).collect();
            let mut merged = Vec::with_capacity(doc.lots.len());
            for l in doc.lots.drain(..) {
                if reduced_ids.contains(l.id.as_str()) {
                    merged.push(
                        reduced_lots
                            .iter()
                            .find(|r| r.id == l.id)
                            .cloned()
                            .expect("reduced lot id"),
                    );
                } else if candidates.iter().any(|c| c.id == l.id) {
                    // reduced to zero inside the call's pool — gone
                } else {
                    merged.push(l);
                }
            }
            doc.lots = merged;
            // The shares were sold at the strike (close-lot R2): the
            // proceeds credit the call's pool in the same rewrite — the
            // assignment debited strike×100×contracts there on entry.
            materialize_default_pool(&mut doc);
            let proceeds = call_strike * 100.0 * contracts as f64;
            if let Some(pool) = doc.cash_pools.iter_mut().find(|p| p.id == call_pool) {
                pool.cash += proceeds;
            }
            sync_scalar_cash(&mut doc);
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
    // The session gates the extended-hours fetch and merge (extended-hours
    // R3) — classified once, from the injected clock.
    let session = et_market_session((st.clock)());
    let fetcher = st.mark_fetcher.clone();
    let batch =
        tokio::task::spawn_blocking(move || fetcher(&requests, &lot_symbols, session))
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
    // SpotMark. Extended fields follow the session gate: a Regular-session
    // refresh clears them (data captured in an earlier closed session is
    // stale once the market opens); otherwise the present session closes
    // merge in, with `session` naming the active one (None when nothing is).
    for lot in &mut doc.lots {
        match batch.spots.get(&lot.symbol) {
            Some(&spot) => {
                // Latest known price (user decision, preview feedback): the
                // chronologically newest extended close — the session cycle
                // pre → regular → post → overnight makes bar time the
                // truth — falling back to the regular close when no
                // extended data survived. A Regular-session refresh clears
                // extended data entirely (stale once the market opens).
                let ext = if session == MarketSession::Regular {
                    None
                } else {
                    batch.ext.get(&lot.symbol)
                };
                let (pre, post, overnight) = match ext {
                    Some(q) => (q.pre.clone(), q.post.clone(), q.overnight.clone()),
                    None => (None, None, None),
                };
                let session_name = ext.and_then(|q| {
                    [
                        q.pre.as_ref().map(|quote| (quote, "PreMarket")),
                        q.post.as_ref().map(|quote| (quote, "AfterHours")),
                        q.overnight.as_ref().map(|quote| (quote, "OverNight")),
                    ]
                    .into_iter()
                    .flatten()
                    .max_by_key(|(quote, _)| quote.time)
                    .map(|(quote, name)| (quote.price, name.to_string()))
                });
                let (spot, session_name) = match session_name {
                    Some((price, name)) => (price, Some(name)),
                    None => (spot, None),
                };
                lot.mark = Some(market_int_core::holdings::SpotMark {
                    spot,
                    as_of: now,
                    pre,
                    post,
                    overnight,
                    session: session_name,
                });
                ok.push(lot.id.clone());
            }
            None => stale.push((
                lot.id.clone(),
                format!("no underlying quote for {}", lot.symbol),
            )),
        }
    }

    // A pass that priced nothing changed nothing — skip the rewrite, so a
    // refresh of an empty (or all-stale) book never creates or rewrites
    // the file (GET's no-create property).
    if !ok.is_empty() {
        if let Err(err) = write_ledger_off_thread(st.holdings_dir.clone(), uid, doc.clone()).await
        {
            return error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                &format!("ledger write failed: {err}"),
            );
        }
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
      pool_id: None,
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
        let mut holding = sample_holding("h1");
        holding.pool_id = Some("p1".to_string());
        let doc = HoldingsDocument {
            schema_version: LEDGER_SCHEMA_VERSION,
            positions: vec![holding],
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
                pool_id: Some("p1".to_string()),
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
                    pre: None,
                    post: None,
                    overnight: None,
                    session: None,
                }),
                pool_id: Some("p1".to_string()),
            }],
            cash: Some(150_000.0),
            cash_pools: vec![CashPool {
                id: "main".to_string(),
                name: "Main".to_string(),
                cash: 80_000.0,
            }],
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
                cash_pools: Vec::new(),
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
                cash_pools: Vec::new(),
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
        Arc::new(move |requests: &[MarkRequest], _lots: &[String], _session: MarketSession| MarkBatch {
            marks: requests
                .iter()
                .map(|r| MarkResult {
                    id: r.id.clone(),
                    mid: Ok(Some(mid)),
                    underlying: None,
                })
                .collect(),
            spots: Default::default(),
                ext: Default::default(),
        })
    }

    // ── Extended-hours quotes: feature-acceptance E2E ──────────────
    // Design doc `## Feature acceptance`, verbatim: a closed-session
    // refresh persists pre/post/overnight + session on the lot mark (the
    // extended line's data); a pre-feature ledger document loads and
    // renders exactly as before, then gains the line after one refresh;
    // a quote call failing entirely keeps every previous mark and reports
    // stale without a rewrite.

    /// 2026-09-08 22:00 UTC = 18:00 ET, a Tuesday evening — post-market.
    fn frozen_after_hours() -> DateTime<Utc> {
        chrono::NaiveDate::from_ymd_opt(2026, 9, 8)
            .unwrap()
            .and_hms_opt(22, 0, 0)
            .unwrap()
            .and_utc()
    }

    fn test_state_clock(dir: &std::path::Path, fetcher: MarkFetcher, clock: fn() -> DateTime<Utc>) -> AppState {
        AppState {
            result_path: dir.join("last_run.json"),
            holdings_dir: dir.join("holdings"),
            mark_fetcher: fetcher,
            shared: crate::run::SharedState::new(),
            access: Default::default(),
            clock,
        }
    }

    fn aapl_ext_fetcher(closed: bool) -> MarkFetcher {
        Arc::new(move |requests: &[MarkRequest], _lots: &[String], _session: MarketSession| {
            if !closed {
                return MarkBatch {
                    marks: requests
                        .iter()
                        .map(|r| MarkResult {
                            id: r.id.clone(),
                            mid: Ok(Some(2.5)),
                            underlying: Some(250.42),
                        })
                        .collect(),
                    spots: std::collections::BTreeMap::from([("AAPL".to_string(), 250.42)]),
                    ext: Default::default(),
                };
            }
            let ext = std::collections::BTreeMap::from([(
                "AAPL".to_string(),
                SessionQuotes {
                    pre: Some(market_int_core::model::ExtQuote {
                        price: 251.2,
                        time: chrono::DateTime::parse_from_rfc3339("2026-09-08T13:15:00Z")
                            .unwrap()
                            .into(),
                    }),
                    post: Some(market_int_core::model::ExtQuote {
                        price: 250.05,
                        time: chrono::DateTime::parse_from_rfc3339("2026-09-08T19:59:00Z")
                            .unwrap()
                            .into(),
                    }),
                    overnight: None,
                },
            )]);
            MarkBatch {
                marks: requests
                    .iter()
                    .map(|r| MarkResult {
                        id: r.id.clone(),
                        mid: Ok(Some(2.5)),
                        underlying: Some(249.87),
                    })
                    .collect(),
                spots: std::collections::BTreeMap::from([("AAPL".to_string(), 249.87)]),
                ext,
            }
        })
    }

    /// Old-format ledger document: no extended fields anywhere (a
    /// pre-feature write), single lot with a regular mark.
    fn write_pre_feature_ledger(dir: &std::path::Path, uid: &str) {
        let holdings_dir = dir.join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join(format!("{uid}.json")),
            r#"{"schema_version":1,"positions":[],"lots":[{"id":"lot-old","symbol":"AAPL","shares":100,"basis_per_share":231.4,"acquired":"2026-08-12","mark":{"spot":249.87,"as_of":"2026-09-08T15:00:00Z"}}]}"#,
        )
        .unwrap();
    }

    #[tokio::test]
    async fn feature_acceptance_extended_hours_quotes() {
        let dir = tempfile::tempdir().unwrap();

        // ── Scenario 1: refresh during a closed session persists the
        // extended data alongside the regular spot.
        write_pre_feature_ledger(dir.path(), "test-uid");
        let app = crate::api::build_router(test_state_clock(
            dir.path(),
            aapl_ext_fetcher(true),
            frozen_after_hours,
        ));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "closed-session refresh: {v}");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 0);

        let app = crate::api::build_router(test_state_clock(
            dir.path(),
            aapl_ext_fetcher(true),
            frozen_after_hours,
        ));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let mark = &v["lots"][0]["mark"];
        assert_eq!(
            mark["spot"], 250.05,
            "spot = the chronologically latest close (post, 19:59)"
        );
        assert_eq!(mark["session"], "AfterHours", "session names the source");
        assert_eq!(mark["pre"]["price"], 251.2);
        assert_eq!(mark["post"]["price"], 250.05);
        assert!(mark["overnight"].is_null(), "symbol has no overnight data");
        // Value and P&L follow the latest price.
        assert_eq!(v["lots"][0]["view"]["value"], 25005.0);
        assert_eq!(v["lots"][0]["view"]["pl_dollars"], 1865.0);
        // The additive fields persist to the ledger document.
        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        assert!(file.contains("\"session\""), "session persisted: {file}");
        assert!(file.contains("\"post\""), "post persisted: {file}");

        // ── Scenario 2: a fresh pre-feature document loads and renders
        // exactly as before (no extended fields), then one closed-session
        // refresh makes the line appear.
        let dir2 = tempfile::tempdir().unwrap();
        write_pre_feature_ledger(dir2.path(), "test-uid");
        let app = crate::api::build_router(test_state_clock(
            dir2.path(),
            aapl_ext_fetcher(true),
            frozen_after_hours,
        ));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK, "old document loads: {v}");
        let mark = &v["lots"][0]["mark"];
        assert_eq!(mark["spot"], 249.87);
        assert!(mark["pre"].is_null() && mark["post"].is_null() && mark["session"].is_null(),
            "pre-feature mark has no extended fields: {mark}");

        let app = crate::api::build_router(test_state_clock(
            dir2.path(),
            aapl_ext_fetcher(true),
            frozen_after_hours,
        ));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "refresh on old document: {v}");
        let mark = &v["lots"][0]["mark"];
        assert_eq!(mark["spot"], 250.05, "priced at the latest close");
        assert_eq!(mark["session"], "AfterHours");

        // ── Scenario 3: the quote call failing entirely keeps every
        // previous mark, reports stale, and does not rewrite the ledger.
        let dir3 = tempfile::tempdir().unwrap();
        write_pre_feature_ledger(dir3.path(), "test-uid");
        let app = crate::api::build_router(test_state_clock(
            dir3.path(),
            Arc::new(|_: &[MarkRequest], _lots: &[String], _session: MarketSession| MarkBatch {
                marks: Vec::new(),
                spots: Default::default(),
                ext: Default::default(),
            }),
            frozen_after_hours,
        ));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "failing refresh still 200: {v}");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 0);
        let stale = v["refresh"]["stale"].as_array().unwrap();
        assert_eq!(stale.len(), 1, "the lot is reported stale: {v}");
        assert_eq!(stale[0]["id"], "lot-old");
        assert!(
            stale[0]["reason"].as_str().is_some_and(|r| !r.is_empty()),
            "stale carries a reason: {stale:?}"
        );

        let app = crate::api::build_router(test_state_clock(
            dir3.path(),
            aapl_ext_fetcher(true),
            frozen_after_hours,
        ));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let mark = &v["lots"][0]["mark"];
        assert_eq!(mark["spot"], 249.87, "previous mark kept");
        assert_eq!(mark["as_of"], "2026-09-08T15:00:00Z", "mark untouched");
        let file =
            std::fs::read_to_string(dir3.path().join("holdings/test-uid.json")).unwrap();
        assert!(
            file.contains("2026-09-08T15:00:00Z"),
            "all-stale pass must not rewrite the document: {file}"
        );
        assert!(!file.contains("\"session\""), "no extended data persisted: {file}");
    }

    // ── close-lot: feature-acceptance E2E ──────────────────────────
    // Design doc `## Feature acceptance`: partial close reduces the lot and
    // credits the pool; full close removes it; called-away credits strike
    // proceeds in the same rewrite; invalid closes never write.

    fn write_close_ledger(dir: &std::path::Path, uid: &str) {
        let holdings_dir = dir.join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join(format!("{uid}.json")),
            r#"{"schema_version":1,"positions":[],"calls":[{"id":"c1","symbol":"GOOG","strike":360.0,"premium":1.2,"contracts":2,"sold":"2026-09-04","expiry":"2026-09-30"}],"lots":[{"id":"l1","symbol":"GOOG","shares":200,"basis_per_share":349.0,"acquired":"2026-08-12","pool_id":"p1"}],"cash":null,"cash_pools":[{"id":"p1","name":"IBKR","cash":10000.0},{"id":"p2","name":"Tastytrade","cash":0.0}]}"#,
        )
        .unwrap();
    }

    #[tokio::test]
    async fn feature_acceptance_close_lot() {
        let dir = tempfile::tempdir().unwrap();
        write_close_ledger(dir.path(), "test-uid");

        // ── Scenario 1: partial close 100 @ 360 → lot 100 sh, pool +36,000.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "l1", "shares": 100, "price": 360.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "partial close: {v}");
        assert_eq!(v["close"]["closed"], true);
        assert_eq!(v["close"]["shares"], 100);
        assert_eq!(v["close"]["proceeds"], 36000.0);
        assert_eq!(v["lots"][0]["shares"], 100);
        assert_eq!(v["cash_pools"][0]["cash"], 46000.0, "proceeds credited");
        let lot_view = &v["lots"][0]["view"];
        assert_eq!(lot_view["covered"], 2, "covered = the written calls");
        assert_eq!(lot_view["capacity"], 1, "capacity recomputes from shares");

        // ── Scenario 2: close the remaining 100 → lot gone, call remains.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "l1", "shares": 100, "price": 360.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "full close: {v}");
        assert_eq!(v["lots"].as_array().unwrap().len(), 0, "lot removed at 0");
        assert_eq!(v["cash_pools"][0]["cash"], 82000.0, "46,000 + 36,000");
        assert_eq!(v["cash_pools"][1]["cash"], 0.0, "other pool untouched");
        assert_eq!(v["calls"].as_array().unwrap().len(), 1, "call untouched");

        // ── Scenario 4: invalid closes — 404/400, byte-unchanged file.
        let file_before =
            std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "nope", "shares": 1, "price": 1.0})),
        )
        .await;
        assert_eq!(status, StatusCode::NOT_FOUND, "unknown lot");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "l1", "shares": 0, "price": 1.0})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "zero shares");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "l1", "shares": -5, "price": 1.0})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "negative shares");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "l1", "shares": 1, "price": 0.0})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "non-positive price");
        let file_after =
            std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        assert_eq!(file_before, file_after, "failed closes never write");

        // ── Scenario 3: called-away reduces AND credits strike proceeds in
        // one rewrite (fresh ledger: 200 sh lot + 360×2 call, pool 10,000).
        let dir2 = tempfile::tempdir().unwrap();
        write_close_ledger(dir2.path(), "test-uid");
        let app = crate::api::build_router(test_state(dir2.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": "c1"})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "called away: {v}");
        assert_eq!(v["reduced"], true);
        // The called-away response is minimal; the ledger state is read back
        // (what the UI's reload does).
        let app = crate::api::build_router(test_state(dir2.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["lots"].as_array().unwrap().len(), 0, "200 − 200 = gone");
        assert_eq!(
            v["cash_pools"][0]["cash"], 82000.0,
            "strike 360 × 200 sh credited"
        );
    }

    /// Called-away's strike credit on a LEGACY scalar ledger (no pools):
    /// the default pool materializes seeded with the scalar, the credit
    /// lands there, and the scalar resyncs to the pool sum (close-lot R2).
    #[tokio::test]
    async fn called_away_credit_materializes_the_default_pool() {
        let dir = tempfile::tempdir().unwrap();
        let holdings_dir = dir.path().join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join("test-uid.json"),
            r#"{"schema_version":1,"positions":[],"calls":[{"id":"c1","symbol":"GOOG","strike":360.0,"premium":1.2,"contracts":1,"sold":"2026-09-04","expiry":"2026-09-30"}],"lots":[{"id":"l1","symbol":"GOOG","shares":100,"basis_per_share":349.0,"acquired":"2026-08-12"}],"cash":5000.0}"#,
        )
        .unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": "c1"})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["reduced"], true);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools.len(), 1, "the default pool materialized");
        assert_eq!(pools[0]["id"], "main");
        assert_eq!(pools[0]["cash"], 41000.0, "5000 + strike 360 × 100");
        assert_eq!(v["cash"], 41000.0, "legacy scalar resynced to the pool sum");
    }

    /// PATCH on a lot reassigns its pool (lot pill = picker): a field
    /// rewrite — stored cash never moves, coverage unchanged.
    #[tokio::test]
    async fn patch_lot_pool_reassigns() {
        let dir = tempfile::tempdir().unwrap();
        write_close_ledger(dir.path(), "test-uid");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/l1",
            Some(json!({"pool_id": "p2"})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["lot"]["pool_id"], "p2");
        assert_eq!(v["lot"]["pool_name"], "Tastytrade");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["lots"][0]["pool_name"], "Tastytrade", "persisted");
        assert_eq!(v["cash_pools"][0]["cash"], 10000.0, "no cash moves");
        assert_eq!(v["cash_pools"][1]["cash"], 0.0, "no cash moves (p2)");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "PATCH",
            "/api/holdings/c1",
            Some(json!({"pool_id": "p2"})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "calls stay inherited");
    }

    /// Manual lot creation debits its cost from the chosen pool
    /// (pool-consistency pass): 200 × 349 = 69,800 leaves p1; the other
    /// pool is untouched; the scalar resyncs.
    #[tokio::test]
    async fn lot_add_debits_cost_from_chosen_pool() {
        let dir = tempfile::tempdir().unwrap();
        write_close_ledger(dir.path(), "test-uid");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "MSFT", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-01",
                "pool_id": "p1"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "lot add: {v}");
        assert_eq!(v["lot"]["pool_name"], "IBKR", "pool_name shape parity");
        // Debit verified via GET (the add response carries the lot only).
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["cash"], 10000.0 - 69800.0, "cost debited");
        assert_eq!(pools[1]["cash"], 0.0, "other pool untouched");
        assert_eq!(v["cash"], -59800.0, "scalar resynced (negative is honest)");
    }

    /// A lot whose pool_id dangles (its pool was deleted) still credits:
    /// the proceeds fall back to the default pool — never vanish.
    #[tokio::test]
    async fn close_with_dangling_pool_id_credits_the_default_pool() {
        let dir = tempfile::tempdir().unwrap();
        let holdings_dir = dir.path().join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join("test-uid.json"),
            r#"{"schema_version":1,"positions":[],"calls":[],"lots":[{"id":"l1","symbol":"GOOG","shares":100,"basis_per_share":349.0,"acquired":"2026-08-12","pool_id":"gone"}],"cash":1000.0,"cash_pools":[{"id":"main","name":"Main","cash":1000.0}]}"#,
        )
        .unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/close",
            Some(json!({"lot_id": "l1", "shares": 100, "price": 350.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["cash"], 36000.0, "1000 + 350 × 100, fallback pool");
        assert_eq!(v["lots"].as_array().unwrap().len(), 0, "full close removes");
    }


    /// 2026-09-12 (Saturday) 16:00 UTC = noon ET — weekend daytime.
    fn frozen_weekend_noon() -> DateTime<Utc> {
        chrono::NaiveDate::from_ymd_opt(2026, 9, 12)
            .unwrap()
            .and_hms_opt(16, 0, 0)
            .unwrap()
            .and_utc()
    }

    #[test]
    fn et_market_session_classifies_the_week() {
        use MarketSession::*;
        use chrono::TimeZone;
        let at = |d: u32, h: u32, mi: u32| {
            Utc.with_ymd_and_hms(2026, 9, d, h, mi, 0).unwrap()
        };
        // Sept 2026 is EDT: ET = UTC − 4h. Tuesday the 8th:
        assert_eq!(et_market_session(at(8, 7, 0)), OverNight, "03:00 ET");
        assert_eq!(et_market_session(at(8, 8, 0)), PreMarket, "04:00 ET sharp");
        assert_eq!(et_market_session(at(8, 13, 29)), PreMarket, "09:29 ET");
        assert_eq!(et_market_session(at(8, 13, 30)), Regular, "09:30 ET sharp");
        assert_eq!(et_market_session(at(8, 19, 59)), Regular, "15:59 ET");
        assert_eq!(et_market_session(at(8, 20, 0)), AfterHours, "16:00 ET sharp");
        assert_eq!(et_market_session(at(8, 23, 59)), AfterHours, "19:59 ET");
        // Wednesday 00:00 UTC = Tuesday 20:00 ET — the overnight session.
        assert_eq!(et_market_session(at(9, 0, 0)), OverNight);
        // Friday night has no overnight session (live-probed: Friday 20:00+
        // returns no OverNight bars).
        assert_eq!(et_market_session(at(12, 0, 30)), Closed, "Fri 20:30 ET (Sat 00:30 UTC)");
        // Saturday daytime and Sunday daytime stay closed.
        assert_eq!(et_market_session(at(12, 16, 0)), Closed, "Sat noon ET");
        assert_eq!(et_market_session(at(13, 16, 0)), Closed, "Sun noon ET");
        // Sunday 20:00 ET opens the week's first overnight session.
        assert_eq!(et_market_session(at(14, 0, 30)), OverNight, "Sun 20:30 ET");
    }

    /// DST and timezone: the classifier works in America/New_York wall
    /// clock (chrono-tz), so 09:30 ET is Regular in July (EDT, 13:30 UTC)
    /// AND in January (EST, 14:30 UTC) — the UTC boundary shifts with the
    /// season, and the viewer's local timezone never matters (server-side
    /// classification of absolute instants).
    #[test]
    fn et_market_session_is_dst_and_timezone_safe() {
        use chrono::TimeZone;
        use MarketSession::*;
        // Second Wednesday of July 2026: EDT (UTC−4). 13:30 UTC = 09:30 ET.
        let jul = |h: u32, mi: u32| Utc.with_ymd_and_hms(2026, 7, 8, h, mi, 0).unwrap();
        assert_eq!(et_market_session(jul(13, 30)), Regular, "09:30 EDT sharp");
        assert_eq!(et_market_session(jul(13, 29)), PreMarket, "09:29 EDT");
        // Second Tuesday of January 2027: EST (UTC−5). 14:30 UTC = 09:30 ET.
        let jan = |h: u32, mi: u32| Utc.with_ymd_and_hms(2027, 1, 12, h, mi, 0).unwrap();
        assert_eq!(et_market_session(jan(14, 30)), Regular, "09:30 EST sharp");
        assert_eq!(et_market_session(jan(14, 29)), PreMarket, "09:29 EST");
        // Same UTC instant classifies differently across the switch:
        // 13:30 UTC is Regular in July but 08:30 EST (PreMarket) in January.
        assert_eq!(et_market_session(jan(13, 30)), PreMarket, "08:30 EST");
        // Overnight boundary across the November switch: Nov 2 2026 (Mon)
        // is EST — 00:30 UTC = 19:30 ET Sunday (Closed), 01:00 UTC = 20:00
        // ET Sunday (the week's first overnight session).
        assert_eq!(
            et_market_session(Utc.with_ymd_and_hms(2026, 11, 2, 0, 30, 0).unwrap()),
            Closed,
            "Sun 19:30 ET after the fall switch"
        );
        assert_eq!(
            et_market_session(Utc.with_ymd_and_hms(2026, 11, 2, 1, 0, 0).unwrap()),
            OverNight,
            "Sun 20:00 ET after the fall switch"
        );
    }

    /// A Regular-session refresh clears the extended fields even when the
    /// scripted fetcher hands extended data back — the handler gates the
    /// merge, so a pre-open line cannot linger into the trading day.
    #[tokio::test]
    async fn regular_session_refresh_clears_extended_fields() {
        let dir = tempfile::tempdir().unwrap();
        write_pre_feature_ledger(dir.path(), "test-uid");
        let app = crate::api::build_router(test_state(dir.path(), aapl_ext_fetcher(true)));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "regular refresh: {v}");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);

        let app = crate::api::build_router(test_state(dir.path(), aapl_ext_fetcher(true)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let mark = &v["lots"][0]["mark"];
        assert_eq!(mark["spot"], 249.87, "regular spot intact");
        assert!(
            mark["pre"].is_null() && mark["post"].is_null() && mark["session"].is_null(),
            "extended fields cleared on the regular session: {mark}"
        );
    }

    /// Weekend daytime is a Closed session: extended data is fetched and
    /// the lot prices at the latest close, tagged with its source session
    /// (the fixture's newest close is post, 19:59).
    #[tokio::test]
    async fn closed_weekend_refresh_prices_at_latest_close() {
        let dir = tempfile::tempdir().unwrap();
        write_pre_feature_ledger(dir.path(), "test-uid");
        let app = crate::api::build_router(test_state_clock(
            dir.path(),
            aapl_ext_fetcher(true),
            frozen_weekend_noon,
        ));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK, "weekend refresh: {v}");
        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);

        let app = crate::api::build_router(test_state_clock(
            dir.path(),
            aapl_ext_fetcher(true),
            frozen_weekend_noon,
        ));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let mark = &v["lots"][0]["mark"];
        assert_eq!(mark["pre"]["price"], 251.2, "all closes persist");
        assert_eq!(mark["post"]["price"], 250.05);
        assert_eq!(mark["spot"], 250.05, "latest close is the price");
        assert_eq!(mark["session"], "AfterHours", "source session tagged");
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
                pool_id: None,
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
                cash_pools: Vec::new(),
                positions: vec![
                    market_int_core::holdings::Holding {
                  pool_id: None,
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
                  pool_id: None,
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
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
                ext: Default::default(),
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
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
                ext: Default::default(),
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
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
                ext: Default::default(),
            }
        });
        let app = crate::api::build_router(test_state(dir.path(), fetcher));
        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 2);
    }

    /// Cash pools R1: a legacy ledger (scalar `cash`, no pools) renders
    /// ONE implicit "Main" pool in the list response — cash/reserved/free
    /// derived, aggregates unchanged, no document rewrite (lazy migration).
    #[tokio::test]
    async fn legacy_cash_reads_as_implicit_main_pool() {
        let dir = tempfile::tempdir().unwrap();
        let holdings_dir = dir.path().join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join("test-uid.json"),
            r#"{"schema_version":1,"positions":[],"cash":80000.0}"#,
        )
        .unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let pools = v["cash_pools"].as_array().expect("cash_pools array");
        assert_eq!(pools.len(), 1);
        assert_eq!(pools[0]["id"], "main");
        assert_eq!(pools[0]["name"], "Main");
        assert_eq!(pools[0]["cash"], 80000.0);
        assert_eq!(pools[0]["reserved"], 0.0);
        assert_eq!(pools[0]["free"], 80000.0);
        assert_eq!(v["cash"], 80000.0);
        assert_eq!(v["cash_free"], 80000.0);
        // Lazy: a read never rewrites — the file is byte-identical.
        let after = std::fs::read_to_string(holdings_dir.join("test-uid.json")).unwrap();
        assert!(!after.contains("cash_pools"), "read left the legacy shape alone");
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
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], lots: &[String], _session: MarketSession| {
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
            MarkBatch { marks, spots, ext: Default::default() }
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

        // End state: everything closed. The assignment moved strike×100
        // (cash pools R4) out of the default pool into the lot's basis
        // (150,000 − 70,000 = 80,000), and the call's assignment now also
        // credits the sale proceeds — strike 360 × 200 sh = 72,000 — so the
        // balance lands at 152,000 (close-lot R2).
        let app = crate::api::build_router(test_state(dir.path(), fetcher.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
        assert_eq!(v["calls"].as_array().unwrap().len(), 0);
        assert_eq!(v["lots"].as_array().unwrap().len(), 0);
        assert_eq!(v["cash"], 152000.0);
        assert_eq!(v["cash_reserved"], 0.0);
        assert_eq!(v["cash_free"], 152000.0);

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

    // ── Cash pools R2: pool management API ─────────────────────────

    /// Pool add lands in the list with its own zeroed row; the legacy
    /// scalar materializes into "Main" in the same write.
    #[tokio::test]
    async fn pool_add_appears_in_list_and_materializes_main() {
        let dir = tempfile::tempdir().unwrap();
        let holdings_dir = dir.path().join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join("test-uid.json"),
            r#"{"schema_version":1,"positions":[],"cash":80000.0}"#,
        )
        .unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let pool = &v["pool"];
        assert_eq!(pool["name"], "IBKR");
        assert_eq!(pool["cash"], 0.0);
        assert_ne!(pool["id"], "main", "id is server-generated");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools.len(), 2);
        assert_eq!(pools[0]["name"], "Main", "legacy cash landed in Main");
        assert_eq!(pools[0]["cash"], 80000.0);
        assert_eq!(pools[1]["name"], "IBKR");

        // A blank name is rejected, no write.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "   "})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }

    /// PATCH cash with a pool_id touches ONLY that pool; renaming works
    /// through the same route; unknown pool ids are 400s.
    #[tokio::test]
    async fn pool_cash_patch_targets_one_pool_and_renames() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "cash": 50000.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["pool"]["id"], ibkr);
        assert_eq!(v["pool"]["cash"], 50000.0);
        assert_eq!(v["pool"]["free"], 50000.0);
        assert_eq!(v["cash"], 50000.0, "aggregate = Main 0 + IBKR 50k");
        assert_eq!(v["cash_free"], 50000.0);

        // Rename without touching cash.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "name": "IBKR LLC"})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["pool"]["name"], "IBKR LLC");
        assert_eq!(v["pool"]["cash"], 50000.0, "rename left cash alone");

        // Unknown pool id.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": "nope", "cash": 1.0})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);

        // Negative cash rejected with the document untouched.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "cash": -1.0})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST);
    }

    /// The pool array is bounded (the one new unbounded resource), and
    /// every pool mutation keeps the legacy scalar mirroring the pool sum
    /// so a rolled-back binary still reads the right balance.
    #[tokio::test]
    async fn pools_are_capped_and_scalar_stays_in_sync() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let mut last_id = String::new();
        for i in 0..21 {
            let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
            let (status, v) = call(
                app,
                "POST",
                "/api/holdings",
                Some(json!({"kind": "pool", "name": format!("P{i}")})),
            )
            .await;
            // The first add also materializes "Main", so 19 named pools
            // fill the 20-slot cap.
            if i < 19 {
                assert_eq!(status, StatusCode::CREATED, "pool {i}: {v}");
                last_id = v["pool"]["id"].as_str().unwrap().to_string();
            } else {
                assert_eq!(status, StatusCode::BAD_REQUEST, "pool {i} over cap: {v}");
            }
        }
        // Scalar sync: cash the last pool, read the raw document.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": last_id, "cash": 777.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK);
        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        let doc: serde_json::Value = serde_json::from_str(&file).unwrap();
        assert_eq!(
            doc["cash"], 777.0,
            "the scalar mirrors the pool sum after a pool edit"
        );
    }

    /// PATCH cash with NO pool_id on a legacy ledger behaves exactly like
    /// the pre-pool route: the balance lands where reads find it.
    #[tokio::test]
    async fn legacy_patch_cash_without_pool_id_matches_old_behavior() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"cash": 1234.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["cash"], 1234.0);
        assert_eq!(v["cash_free"], 1234.0);

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["cash"], 1234.0);
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools.len(), 1);
        assert_eq!(pools[0]["cash"], 1234.0, "the single pool carries it");
    }

    /// Deleting a pool with referencing entries is a 409 and the document
    /// is unchanged; without references it goes, and the last pool falls
    /// back to the legacy scalar shape.
    #[tokio::test]
    async fn pool_delete_blocks_on_dependents_and_falls_back() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();

        // A put referencing IBKR blocks the delete.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 100.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11",
                "pool_id": ibkr
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let put_id = v["position"]["id"].as_str().unwrap().to_string();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "DELETE", &format!("/api/holdings/{ibkr}"), None).await;
        assert_eq!(status, StatusCode::CONFLICT, "{v}");

        // Close the put; now the delete goes, and Main remains.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", &format!("/api/holdings/{put_id}"), None).await;
        assert_eq!(status, StatusCode::OK);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "DELETE", &format!("/api/holdings/{ibkr}"), None).await;
        assert_eq!(status, StatusCode::OK, "{v}");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["cash_pools"].as_array().unwrap().len(), 1, "Main left");

        // Deleting the LAST pool falls back to the legacy scalar shape.
        let main_id = v["cash_pools"][0]["id"].as_str().unwrap().to_string();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, dbg) = call(app, "DELETE", &format!("/api/holdings/{main_id}"), None).await;
        assert_eq!(status, StatusCode::OK, "main delete: {dbg}");
        // The fallback restores the scalar: cash_pools empties and the
        // pool's cash becomes `cash` — the read view then renders it as
        // implicit Main again. (A pre-pool binary ignores the unknown
        // empty array, so rollback stays safe — ADR-002.)
        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        assert!(file.contains("\"cash_pools\": []"), "pool array emptied: {file}");
        assert!(file.contains("\"cash\": 0.0"), "the pool's cash became the scalar");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools.len(), 1, "the scalar reads as implicit Main again");
        assert_eq!(pools[0]["cash"], 0.0);
    }

    // ── Cash pools R4: pool routing rules ──────────────────────────

    /// An unassigned (None-pool) put against pools: its assignment moves
    /// the DEFAULT (first) pool's cash and the lot stays None (folding to
    /// the first pool on read).
    #[tokio::test]
    async fn assignment_without_pool_moves_default_pool_cash() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"cash": 50000.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 100.0, "premium": 1.0,
                "contracts": 2, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        assert!(
            v["position"]["pool_id"].is_null(),
            "no pool chosen ⇒ None"
        );
        let put_id = v["position"]["id"].as_str().unwrap().to_string();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 200,
                "basis_per_share": 99.0, "acquired": "2026-09-08",
                "assigned_from": put_id
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["cash"], 30000.0, "strike×100×2 left Main");
        assert_eq!(pools[0]["free"], 30000.0);
        assert!(v["lots"][0]["pool_id"].is_null(), "lot stays None");
    }

    /// Unknown pool ids are rejected on puts and calls; called-away moves
    /// no cash (the shares were bought back by the broker, the ledger only
    /// reduces the lot).
    #[tokio::test]
    async fn pool_validation_and_called_away_credits_strike() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 100.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11",
                "pool_id": "nope"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "unknown put pool");

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "call", "symbol": "GOOG", "strike": 110.0,
                "premium": 0.8, "contracts": 1,
                "sold": "2026-09-08", "expiry": "2026-09-18",
                "pool_id": "nope"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "unknown call pool");

        // A pools ledger: cash a put away and confirm no pool moved.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let _ = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "cash": 20000.0})),
        )
        .await;
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 100,
                "basis_per_share": 99.0, "acquired": "2026-09-08",
                "pool_id": ibkr
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "plain lot with pool: {v}");
        // Cost debit (pool-consistency pass): 100 × 99 = 9,900 leaves IBKR.
        {
            let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
            let (_, v) = call(app, "GET", "/api/holdings", None).await;
            let pools = v["cash_pools"].as_array().unwrap();
            assert_eq!(pools[1]["cash"], 10100.0, "20000 − cost 9900");
        }
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "call", "symbol": "GOOG", "strike": 110.0,
                "premium": 0.8, "contracts": 1,
                "sold": "2026-09-08", "expiry": "2026-09-18"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "call add: {v}");
        assert_eq!(v["call"]["pool_id"], ibkr, "call inherits the lot's pool");
        let call_id = v["call"]["id"].as_str().unwrap().to_string();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": call_id})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["reduced"], true);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(
            pools[1]["cash"], 21100.0,
            "10100 after cost debit, + strike 110 × 100 credit"
        );
        assert_eq!(v["lots"].as_array().unwrap().len(), 0, "lot fully reduced");
    }

    /// R3 gap-closure at the router level: puts in BOTH pools render their
    /// own reserved; a None-pool put folds into the FIRST pool; a pool can
    /// go negative honestly.
    #[tokio::test]
    async fn pool_views_partition_puts_and_fold_none_into_first() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let _ = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "cash": 5000.0})),
        )
        .await;

        // Put A into IBKR (reserve 20,000), put B unassigned (folds to
        // Main, reserve 10,000).
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 200.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11",
                "pool_id": ibkr
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "SPY", "strike": 100.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED);

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["name"], "Main");
        assert_eq!(pools[0]["reserved"], 10000.0, "None-pool put folds to first");
        assert_eq!(pools[0]["free"], -10000.0, "honest negative, never clamped");
        assert_eq!(pools[1]["reserved"], 20000.0, "IBKR's own put only");
        assert_eq!(pools[1]["free"], 5000.0 - 20000.0);
        assert_eq!(v["cash_reserved"], 30000.0, "aggregate = pool sum");
        let total_free: f64 = pools.iter().map(|p| p["free"].as_f64().unwrap()).sum();
        assert_eq!(v["cash_free"], total_free);

        // Each row names the pool it spends — resolved server-side (the
        // None→default rule never re-derived on the client).
        let positions = v["positions"].as_array().unwrap();
        let names: Vec<&str> = positions
            .iter()
            .map(|p| p["pool_name"].as_str().unwrap())
            .collect();
        assert!(names.contains(&"IBKR"), "assigned put names its pool: {names:?}");
        assert!(names.contains(&"Main"), "None-pool put names the default pool: {names:?}");
    }

    /// R4 gap-closure: called-away reduces ONLY inside the call's pool,
    /// even when the same symbol has lots in both — and the inheritance
    /// picks the FIFO-earliest covering lot (the one that would reduce).
    #[tokio::test]
    async fn called_away_fifo_is_pool_scoped() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();

        // GOOG lots: 100 sh in Main (acquired Sep 1, EARLIER) and 100 sh in
        // IBKR (Sep 5).
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 100,
                "basis_per_share": 300.0, "acquired": "2026-09-01"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 100,
                "basis_per_share": 300.0, "acquired": "2026-09-05",
                "pool_id": ibkr
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED);

        // A call with no explicit pool inherits the FIFO-earliest lot's
        // pool — Main, the lot called-away would actually reduce.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "call", "symbol": "GOOG", "strike": 350.0,
                "premium": 1.0, "contracts": 1,
                "sold": "2026-09-08", "expiry": "2026-09-18"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        assert!(
            v["call"]["pool_id"].is_null(),
            "inherits Main via the earliest lot (None = default pool)"
        );
        let call_id = v["call"]["id"].as_str().unwrap().to_string();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": call_id})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["reduced"], true);

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let lots = v["lots"].as_array().unwrap();
        assert_eq!(lots.len(), 1, "exactly one lot reduced to zero");
        assert_eq!(lots[0]["pool_id"], ibkr, "the IBKR lot survived untouched");
    }

    /// Delete policy (user decision after preview — no funded guard): a
    /// pool holding cash deletes freely and its balance leaves the
    /// aggregate with it; the LAST pool's delete falls back to the legacy
    /// scalar and keeps the balance. Entries still block: a referenced
    /// pool is a 409, and so is the default pool while None-pool entries
    /// exist (their reservations would silently migrate to the next pool).
    #[tokio::test]
    async fn pool_delete_allows_funded_keeps_entry_and_default_guards() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();

        // Fund IBKR and delete it: no guard — the $100 leaves the record,
        // Main (never funded) stays at 0.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let _ = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "cash": 100.0})),
        )
        .await;
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", &format!("/api/holdings/{ibkr}"), None).await;
        assert_eq!(status, StatusCode::OK, "funded pool deletes freely");
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["cash_pools"].as_array().unwrap().len(), 1, "{v}");
        assert_eq!(v["cash"], 0.0, "the deleted pool's cash left the aggregate");

        // An unassigned put still blocks the default pool's delete: its
        // reservation would silently migrate to the next pool.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "SPY", "strike": 100.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let put_id = v["position"]["id"].as_str().unwrap().to_string();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", "/api/holdings/main", None).await;
        assert_eq!(status, StatusCode::CONFLICT, "default pool with unassigned put");

        // Close the put, fund Main as the LAST pool, delete: the fallback
        // keeps the balance as the legacy scalar (implicit Main renders it).
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let _ = call(app, "DELETE", &format!("/api/holdings/{put_id}"), None).await;
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let _ = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"cash": 250.0})),
        )
        .await;
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", "/api/holdings/main", None).await;
        assert_eq!(status, StatusCode::OK);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(v["cash"], 250.0, "last-pool delete keeps the balance");
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools.len(), 1, "implicit Main renders the scalar");
        assert_eq!(pools[0]["id"], "main");
        assert_eq!(pools[0]["cash"], 250.0);
    }

    /// PATCH /api/holdings/{id} (cash pools R4): an unassigned put moves to
    /// a named pool — its reservation follows (derived from pool_id), which
    /// unblocks the default pool's delete. Calls and lots take no picker
    /// (a call inherits the covering lot's pool; the lot IS the shares'
    /// pool), and an unknown pool is a 400 with no write.
    #[tokio::test]
    async fn patch_reassigns_put_pool_and_unblocks_default_delete() {
        let dir = tempfile::tempdir().unwrap();
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        let ibkr = v["pool"]["id"].as_str().unwrap().to_string();

        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "SPY", "strike": 100.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "{v}");
        let put_id = v["position"]["id"].as_str().unwrap().to_string();

        // Unknown pool: 400, nothing moves.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(
            app,
            "PATCH",
            &format!("/api/holdings/{put_id}"),
            Some(json!({"pool_id": "nope"})),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "unknown pool rejected");

        // The reassign: 200, the position carries the pool, and IBKR's
        // derived reservation now holds strike×100×contracts.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "PATCH",
            &format!("/api/holdings/{put_id}"),
            Some(json!({"pool_id": ibkr})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "{v}");
        assert_eq!(v["position"]["pool_id"], ibkr);
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (_, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        let ibkr_view = pools.iter().find(|p| p["id"] == ibkr).unwrap();
        assert_eq!(ibkr_view["reserved"], 10000.0, "{ibkr_view}");
        assert_eq!(v["cash_reserved"], 10000.0, "aggregate follows the move");

        // No unassigned entries remain — Main (the default) deletes now.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, _) = call(app, "DELETE", "/api/holdings/main", None).await;
        assert_eq!(status, StatusCode::OK, "default pool unblocked");
    }

    /// Design doc `## Feature acceptance` (cash pools), verbatim: a legacy
    /// ledger with cash 80,000 reads as one implicit "Main" pool; adding
    /// pool "IBKR" with 50,000, selling a put in IBKR (strike 100 ×1) and
    /// assigning it moves strike×100 out of IBKR's cash into a lot that
    /// lives in IBKR — Main untouched throughout, and the aggregate
    /// cash_free always equals the sum of the pool frees.
    #[tokio::test]
    async fn feature_acceptance_cash_pools() {
        let dir = tempfile::tempdir().unwrap();
        // Legacy pre-pools ledger: the old scalar `cash`, no pools field.
        let holdings_dir = dir.path().join("holdings");
        std::fs::create_dir_all(&holdings_dir).unwrap();
        std::fs::write(
            holdings_dir.join("test-uid.json"),
            r#"{"schema_version":1,"positions":[],"cash":80000.0}"#,
        )
        .unwrap();
        let no_marks: MarkFetcher = Arc::new(|_r: &[MarkRequest], _l: &[String], _session: MarketSession| MarkBatch {
            marks: vec![],
            spots: Default::default(),
                ext: Default::default(),
        });

        // The legacy document reads as one implicit "Main" pool: 80,000
        // free, nothing reserved — with the old aggregates unchanged.
        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK, "legacy read: {v}");
        let pools = v["cash_pools"].as_array().expect("cash_pools array");
        assert_eq!(pools.len(), 1, "implicit Main from the legacy scalar");
        assert_eq!(pools[0]["name"], "Main");
        assert_eq!(pools[0]["cash"], 80000.0);
        assert_eq!(pools[0]["reserved"], 0.0);
        assert_eq!(pools[0]["free"], 80000.0);
        assert_eq!(v["cash"], 80000.0, "aggregate back-compat");
        assert_eq!(v["cash_free"], 80000.0);

        // Add pool "IBKR" and cash it at 50,000. The next write
        // materializes Main, so both pools are real now.
        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({"kind": "pool", "name": "IBKR"})),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "pool add: {v}");
        let ibkr = v["pool"]["id"].as_str().expect("pool id").to_string();

        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(
            app,
            "PATCH",
            "/api/holdings/cash",
            Some(json!({"pool_id": ibkr, "cash": 50000.0})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "pool cash patch: {v}");
        assert_eq!(v["pool"]["cash"], 50000.0);
        assert_eq!(v["pool"]["free"], 50000.0);

        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools.len(), 2);
        assert_eq!(pools[0]["name"], "Main", "Main materialized first");
        assert_eq!(pools[0]["cash"], 80000.0);
        assert_eq!(pools[1]["id"], ibkr);
        assert_eq!(v["cash_free"], 130000.0, "aggregate = pool sum");

        // Sell the GOOG 100P ×1 @ $1.00 INTO IBKR: the put carries the pool,
        // IBKR reserves 10,000, Main is untouched.
        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "symbol": "GOOG", "strike": 100.0, "premium": 1.0,
                "contracts": 1, "sold": "2026-09-04", "expiry": "2026-09-11",
                "pool_id": ibkr
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "put add: {v}");
        let put_id = v["position"]["id"].as_str().expect("put id").to_string();
        assert_eq!(v["position"]["pool_id"], ibkr, "put carries its pool");
        assert_eq!(v["position"]["pool_name"], "IBKR", "put names its pool");

        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["reserved"], 0.0, "Main untouched");
        assert_eq!(pools[0]["free"], 80000.0);
        assert_eq!(pools[1]["reserved"], 10000.0, "strike×100×contracts");
        assert_eq!(pools[1]["free"], 40000.0);
        assert_eq!(v["cash_reserved"], 10000.0);
        assert_eq!(v["cash_free"], 120000.0);

        // Assign at $99 basis → the lot records IN IBKR and strike×100
        // leaves IBKR's cash in the same rewrite; Main still untouched.
        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "GOOG", "shares": 100,
                "basis_per_share": 99.0, "acquired": "2026-09-08",
                "assigned_from": put_id
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "assignment: {v}");
        assert_eq!(v["lot"]["pool_id"], ibkr, "lot lands in the put's pool");

        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["cash"], 80000.0, "Main untouched");
        assert_eq!(pools[1]["cash"], 40000.0, "strike×100 left IBKR");
        assert_eq!(pools[1]["reserved"], 0.0, "the put is gone");
        assert_eq!(pools[1]["free"], 40000.0);
        assert_eq!(v["cash_free"], 120000.0);
        assert_eq!(v["lots"].as_array().unwrap().len(), 1);

        // Covered call inherits the lot's pool (GOOG has exactly one lot);
        // called away, the FIFO reduction stays inside IBKR.
        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "call", "symbol": "GOOG", "strike": 110.0,
                "premium": 0.80, "contracts": 1,
                "sold": "2026-09-08", "expiry": "2026-09-18"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::CREATED, "call add: {v}");
        let call_id = v["call"]["id"].as_str().unwrap().to_string();
        assert_eq!(v["call"]["pool_id"], ibkr, "call inherits the lot's pool");

        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings/called-away",
            Some(json!({"call_id": call_id})),
        )
        .await;
        assert_eq!(status, StatusCode::OK, "called away: {v}");
        assert_eq!(v["reduced"], true, "the IBKR lot covers and reduces");

        // End state: the fully-reduced lot is gone, pools sum to totals
        // with the strike credit (110 × 100 = 11,000 → IBKR), no orphans.
        let app = crate::api::build_router(test_state(dir.path(), no_marks.clone()));
        let (status, v) = call(app, "GET", "/api/holdings", None).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(v["positions"].as_array().unwrap().len(), 0);
        assert_eq!(v["calls"].as_array().unwrap().len(), 0);
        assert_eq!(v["lots"].as_array().unwrap().len(), 0, "100 sh fully called away");
        let pools = v["cash_pools"].as_array().unwrap();
        assert_eq!(pools[0]["cash"], 80000.0);
        assert_eq!(pools[1]["cash"], 51000.0, "40000 + strike 110 × 100");
        let total_free: f64 = pools.iter().map(|p| p["free"].as_f64().unwrap()).sum();
        assert_eq!(v["cash_free"], total_free, "aggregate = sum of pools");

        let file =
            std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
        for orphan in [put_id, call_id] {
            assert!(!file.contains(&orphan), "orphan id {orphan} survived");
        }
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
                cash_pools: Vec::new(),
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
              pool_id: None,
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
              pool_id: None,
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
              pool_id: None,
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
            Arc::new(move |reqs: &[MarkRequest], lots: &[String], _session: MarketSession| {
                *seen.lock().unwrap() = Some((
                    reqs.iter()
                        .map(|r| format!("{}:{:?}", r.symbol, r.side))
                        .collect(),
                    lots.to_vec(),
                ));
                MarkBatch {
                    marks: Vec::new(),
                    spots: Default::default(),
                ext: Default::default(),
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
                cash_pools: Vec::new(),
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
              pool_id: None,
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
              pool_id: None,
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
                  pool_id: None,
                        id: "l-goog".to_string(),
                        symbol: "GOOG".to_string(),
                        shares: 200,
                        basis_per_share: 349.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: Some(market_int_core::holdings::SpotMark {
                            spot: 344.20,
                            as_of: frozen - chrono::Duration::hours(2),
                            pre: None,
                            post: None,
                            overnight: None,
                            session: None,
                        }),
                    },
                    market_int_core::holdings::ShareLot {
                  pool_id: None,
                        id: "l-nope".to_string(),
                        symbol: "NOPE".to_string(),
                        shares: 100,
                        basis_per_share: 100.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: Some(market_int_core::holdings::SpotMark {
                            spot: 100.0,
                            as_of: frozen - chrono::Duration::hours(2),
                            pre: None,
                            post: None,
                            overnight: None,
                            session: None,
                        }),
                    },
                ],
                cash: None,
            },
        )
        .unwrap();

        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
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
                ext: Default::default(),
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
      pool_id: None,
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
      pool_id: None,
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
      pool_id: None,
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
      pool_id: None,
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
                pool_id: None,
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
            pool_id: None,
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
                cash_pools: Vec::new(),
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
              pool_id: None,
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
              pool_id: None,
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
              pool_id: None,
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
            Arc::new(move |reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
                // Another request's mutation lands while "Tiger" is being
                // queried: a fresh mark-less position joins the ledger.
                let mut doc = read_ledger(&ledger_dir, "test-uid").unwrap();
                doc.positions
                    .push(market_int_core::holdings::Holding {
                  pool_id: None,
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
                    ext: Default::default(),
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
                cash_pools: Vec::new(),
                schema_version: LEDGER_SCHEMA_VERSION,
                positions: vec![market_int_core::holdings::Holding {
              pool_id: None,
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
                  pool_id: None,
                        id: "l-goog".to_string(),
                        symbol: "GOOG".to_string(),
                        shares: 200,
                        basis_per_share: 349.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: None,
                    },
                    market_int_core::holdings::ShareLot {
                  pool_id: None,
                        id: "l-nope".to_string(),
                        symbol: "NOPE".to_string(),
                        shares: 100,
                        basis_per_share: 100.0,
                        acquired: NaiveDate::from_ymd_opt(2026, 9, 8).unwrap(),
                        mark: Some(market_int_core::holdings::SpotMark {
                            spot: 100.0,
                            as_of: frozen_today() - chrono::Duration::hours(2),
                            pre: None,
                            post: None,
                            overnight: None,
                            session: None,
                        }),
                    },
                ],
                cash: None,
            },
        )
        .unwrap();

        // The put's chain query fails; GOOT spot arrives for the GOOG lot;
        // NOPE's kline failed so it's missing from spots entirely.
        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
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
                ext: Default::default(),
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
      pool_id: None,
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
      pool_id: None,
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

        // A put can only be assigned into a lot of its own symbol.
        let app = crate::api::build_router(test_state(dir.path(), goog_fetcher(0.5)));
        let (status, v) = call(
            app,
            "POST",
            "/api/holdings",
            Some(json!({
                "kind": "lot", "symbol": "AAPL", "shares": 200,
                "basis_per_share": 349.0, "acquired": "2026-09-08",
                "assigned_from": "p1"
            })),
        )
        .await;
        assert_eq!(status, StatusCode::BAD_REQUEST, "symbol mismatch: {v}");
        assert_eq!(
            std::fs::read(&ledger_path).unwrap(),
            before,
            "mismatch leaves the ledger byte-unchanged"
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
      pool_id: None,
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
      pool_id: None,
            id: "l-old".to_string(),
            symbol: "GOOG".to_string(),
            shares: 200,
            basis_per_share: 349.0,
            acquired: NaiveDate::from_ymd_opt(2026, 9, 1).unwrap(),
            mark: None,
        });
        doc.lots.push(market_int_core::holdings::ShareLot {
      pool_id: None,
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
