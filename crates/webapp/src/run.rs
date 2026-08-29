//! Run end-to-end (ticket 18): `POST /api/run` trigger + `GET /api/progress`
//! attach point — the strict single-flight precedence, SSE event framing, and
//! cache gate of spec §3.2–§3.3 + §5.
//!
//! Three POST outcomes, in this exact order:
//! 1. **Already running** → `202 application/json` (`already_running`); the
//!    client attaches via `/api/progress`.
//! 2. **Idle + fresh (< WEBAPP_CACHE_SECS, strict) + armed file** →
//!    `200 application/json` `{status:"cached", …}` — rows are never inlined;
//!    `/api/latest` stays the single data path.
//! 3. Otherwise the handler wins the lock and returns an SSE stream whose
//!    **body future drives the real pipeline** (never spawned detached), so a
//!    client disconnect drops the pipeline mid-run; a Drop guard resets the
//!    single-flight state on every exit path (§5).
//!
//! The terminal `run_finished.ok` IS the arming predicate; at completion the
//! result document is written FIRST, then the terminal frame emitted, then
//! the state released. A fatal outer error writes a §3.4 failure document and
//! still emits `run_finished ok:false` with empty stages.

use std::convert::Infallible;
use std::path::PathBuf;
use std::pin::Pin;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::task::{Context, Poll};

use axum::extract::State;
use axum::http::{header, HeaderValue, StatusCode};
use axum::response::sse::{Event as SseFrame, Sse};
use axum::response::{IntoResponse, Response};
use axum::Json;
use chrono::{DateTime, SecondsFormat, Utc};
use serde_json::{json, Value};
use tokio::sync::broadcast;

use market_int_core::model;
use market_int_core::pipeline::{
    PerformAllOptions, PerformAllOutcome, PipelineEvent, ProgressFn,
};

use crate::market;
use crate::result::{self, ResultDocument};

/// Broadcast buffer: a full run is ~81 events; §5 pins capacity 1024.
const BROADCAST_CAP: usize = 1024;

/// Env var for the symbols universe the web run consumes (spec §2.5).
const SYMBOLS_FILE_ENV: &str = "webapp_symbols_file";
/// Frozen production default — identical to the file the Job passes.
const DEFAULT_SYMBOLS_FILE: &str = "/data/symbols.csv";

/// Per-process monotonically increasing sequence number; replay dedupes on it.
static NEXT_SEQ: AtomicU64 = AtomicU64::new(0);

fn next_seq() -> u64 {
    NEXT_SEQ.fetch_add(1, Ordering::Relaxed)
}

// ── Frames ─────────────────────────────────────────────────────

/// One SSE frame of the frozen vocabulary (§3.3). The payload is stored as a
/// compact JSON string and re-wrapped per delivery (~81 frames/run), which
/// keeps log + broadcast sharing trivially cloneable.
#[derive(Clone)]
struct Frame {
    seq: u64,
    /// The terminal `run_finished` frame ends every attached stream.
    terminal: bool,
    data: String,
}

impl Frame {
    fn new(value: Value) -> Self {
        let terminal = value["type"] == "run_finished";
        let seq = next_seq();
        let mut full = value;
        full["seq"] = json!(seq);
        Frame { seq, terminal, data: full.to_string() }
    }

    fn sse(&self) -> SseFrame {
        SseFrame::default().data(self.data.clone())
    }
}

/// Maps a pipeline progress event onto the frozen §3.3 payload shape.
fn map_event(event: PipelineEvent) -> Value {
    match event {
        PipelineEvent::StageStarted(stage) => {
            json!({ "type": "stage_started", "stage": result::doc_stage_name(stage) })
        }
        PipelineEvent::BatchDone { stage, done, total } => {
            json!({ "type": "batch_done", "stage": result::doc_stage_name(stage), "done": done, "total": total })
        }
        PipelineEvent::StageFinished { stage, ok, error } => {
            json!({ "type": "stage_finished", "stage": result::doc_stage_name(stage), "ok": ok, "error": error })
        }
    }
}

/// Terminal payload: `ok` IS the arming predicate (≥1 timeframe produced rows)
/// and `stages[].status` uses the file vocabulary `ok|partial|failed`.
fn run_finished_payload(ok: bool, duration_secs: i64, stages: Vec<Value>) -> Value {
    json!({
        "type": "run_finished",
        "ok": ok,
        "duration_secs": duration_secs.max(0),
        "stages": stages,
    })
}

fn outcome_stages(outcome: &PerformAllOutcome) -> Vec<Value> {
    use crate::result::{doc_stage_name, doc_status_name};
    outcome
        .stages
        .iter()
        .map(|r| {
            json!({
                "name": doc_stage_name(r.stage),
                "status": doc_status_name(r.status),
                "error": r.error,
            })
        })
        .collect()
}

// ── Single-flight state (spec §5 sketch) ───────────────────────

#[derive(Debug, Clone, Copy)]
enum RunState {
    Idle,
    Running { since_utc: DateTime<Utc> },
}

struct Inner {
    /// std Mutex: held microseconds, never across `.await` (§5).
    state: Mutex<RunState>,
    events: broadcast::Sender<Frame>,
    /// Current run's replay log, cleared at run start (§5).
    log: Mutex<Vec<Frame>>,
}

/// In-process single-flight + event bus shared by every connection. Birthed
/// `Idle`; instance death evaporates it back to `Idle` — the file clock is
/// the durable half.
#[derive(Clone)]
pub(crate) struct SharedState(Arc<Inner>);

impl SharedState {
    pub(crate) fn new() -> Self {
        let (events, _) = broadcast::channel(BROADCAST_CAP);
        Self(Arc::new(Inner {
            state: Mutex::new(RunState::Idle),
            events,
            log: Mutex::new(Vec::new()),
        }))
    }

    /// Live run-state view for the `/api/latest` envelope (§3.2), so fresh
    /// page loads see the in-flight state immediately.
    pub(crate) fn status_view(&self) -> Value {
        match *self.0.state.lock().unwrap() {
            RunState::Idle => json!({ "status": "idle" }),
            RunState::Running { since_utc } => {
                let elapsed_secs = (Utc::now() - since_utc).num_seconds().max(0);
                json!({
                    "status": "running",
                    "since_utc": result::rfc3339(since_utc),
                    "elapsed_secs": elapsed_secs,
                })
            }
        }
    }

    /// Pushes a frame into the log + broadcast BEFORE any HTTP delivery.
    fn emit(&self, value: Value) -> Frame {
        let frame = Frame::new(value);
        self.0.log.lock().unwrap().push(frame.clone());
        // A send without receivers only means nobody is watching yet; frames
        // survive in the replay log for attach-time delivery.
        let _ = self.0.events.send(frame.clone());
        frame
    }

    fn subscribe(&self) -> broadcast::Receiver<Frame> {
        self.0.events.subscribe()
    }

    fn log_snapshot(&self) -> Vec<Frame> {
        self.0.log.lock().unwrap().clone()
    }

    /// Single-flight acquisition: marks Running + clears the replay log, or
    /// reports the already-running start time (the caller turns that into the
    /// 202). The lock is held microseconds, never across `.await`.
    pub(crate) fn begin(&self) -> Result<DateTime<Utc>, DateTime<Utc>> {
        let mut guard = self.0.state.lock().unwrap();
        if let RunState::Running { since_utc } = *guard {
            return Err(since_utc);
        }
        self.0.log.lock().unwrap().clear();
        let since_utc = Utc::now();
        *guard = RunState::Running { since_utc };
        Ok(since_utc)
    }

    fn is_running(&self) -> Option<DateTime<Utc>> {
        match *self.0.state.lock().unwrap() {
            RunState::Idle => None,
            RunState::Running { since_utc } => Some(since_utc),
        }
    }

    /// Idempotent release; also fired unconditionally by the driving stream's
    /// Drop so every exit path lands back on Idle (§5 guard semantics).
    fn set_idle(&self) {
        *self.0.state.lock().unwrap() = RunState::Idle;
    }
}

// ── Runner seam (requester-factory precedent from core/pipeline.rs) ──

pub(crate) type RunFuture =
    Pin<Box<dyn Future<Output = model::Result<PerformAllOutcome>> + Send>>;

/// Injectable pipeline drive: production builds the SQLite connection +
/// `perform_all`; tests install instant scripted fns so scenarios stay
/// hermetic and offline (same pattern as core's `RequesterFactory`).
type Runner = fn(symbols_file: String, progress: Option<ProgressFn>) -> RunFuture;

/// Production runner: connection opened in-handler from `${sqlite_file}` via
/// core's CLI-identical init, then the shared no-publish pipeline.
fn live_runner(symbols_file: String, progress: Option<ProgressFn>) -> RunFuture {
    Box::pin(async move {
        let mut conn = market_int_core::store::sqlite::init_connection()?;
        market_int_core::pipeline::perform_all(
            &mut conn,
            &symbols_file,
            PerformAllOptions { publish: None, progress },
        )
        .await
    })
}

/// Symbols universe resolution (spec §2.5): `${webapp_symbols_file}`, default
/// `/data/symbols.csv`.
fn resolve_symbols_file() -> String {
    match std::env::var(SYMBOLS_FILE_ENV) {
        Ok(v) if !v.trim().is_empty() => v,
        _ => DEFAULT_SYMBOLS_FILE.to_string(),
    }
}

/// Per-request extractor state for both run endpoints.
#[derive(Clone)]
pub(crate) struct RunAppState {
    result_path: PathBuf,
    symbols_file: String,
    shared: SharedState,
    runner: Runner,
    /// Clock seam: production UTC now; tests freeze an OPEN-session instant so
    /// scenarios exercise run mechanics, never the off-hours gate (which has
    /// its own unit tests on `off_hours_block` + `market::session`).
    clock: fn() -> DateTime<Utc>,
}

/// Production clock.
fn real_now() -> DateTime<Utc> {
    Utc::now()
}

/// Frozen Wednesday 2026-09-02 19:00 UTC = 15:00 ET — mid-session, so the
/// off-hours gate is inert under the frozen clock.
#[cfg(test)]
fn frozen_open_clock() -> DateTime<Utc> {
    chrono::NaiveDate::from_ymd_opt(2026, 9, 2)
        .unwrap()
        .and_hms_opt(19, 0, 0)
        .unwrap()
        .and_utc()
}

impl RunAppState {
    pub(crate) fn new(result_path: PathBuf, shared: SharedState) -> Self {
        Self {
            result_path,
            symbols_file: resolve_symbols_file(),
            shared,
            runner: live_runner,
            clock: real_now,
        }
    }

    /// Test construction only: a scripted runner + explicit symbols path.
    #[cfg(test)]
    fn for_test(result_path: PathBuf, runner: Runner, symbols_file: &str) -> Self {
        Self {
            result_path,
            symbols_file: symbols_file.to_string(),
            shared: SharedState::new(),
            runner,
            clock: frozen_open_clock,
        }
    }
}

// ── Cache gate (§5: completion-anchored, strict, armed-only) ───

/// The cache arms iff ≥1 chains stage ended ok|partial in the FILE's own
/// vocabulary; equivalently `outcome.short.is_some() || outcome.medium.is_some()`
/// on the producing run.
fn doc_armed(doc: &ResultDocument) -> bool {
    doc.stages.iter().any(|s| {
        matches!(s.name.as_str(), "chains_short" | "chains_medium")
            && matches!(s.status.as_str(), "ok" | "partial")
    })
}

/// Off-hours one-run gate (ticket 22): outside market hours, an ARMED result
/// finished inside the current off-hours window blocks a new run until
/// `window.next_open_utc`. Failed (unarmed) documents never block — a failed
/// run stays immediately retryable — and open sessions never reach here.
/// Returns the blocking window, `None` when the run may proceed.
pub(crate) fn off_hours_block(
    window: market::MarketWindow,
    doc: &ResultDocument,
) -> Option<market::MarketWindow> {
    if window.open || !doc_armed(doc) {
        return None;
    }
    let finished = doc.run.finished_at_utc.parse::<DateTime<Utc>>().ok()?;
    (finished >= window.window_started_at_utc).then_some(window)
}

fn outcome_armed(outcome: &PerformAllOutcome) -> bool {
    outcome.short.is_some() || outcome.medium.is_some()
}

/// The cached-hit branch of the precedence: idle + fresh + armed → 200 JSON
/// without rows. Missing / unparseable / clockless / stale / unarmed files all
/// fall through to a fresh run (None here).
async fn cached_hit(result_path: PathBuf) -> Option<Response> {
    let doc = result::read_document_off_thread(result_path).await?;
    let age_secs = result::document_age_secs(&doc)?;
    if !result::cache_is_fresh(age_secs) {
        return None;
    }
    if !doc_armed(&doc) {
        return None;
    }
    Some(
        (
            StatusCode::OK,
            Json(json!({
                "status": "cached",
                "cached": true,
                "age_secs": age_secs,
                "cache_secs": market_int_core::constants::WEBAPP_CACHE_SECS,
                "finished_at_utc": doc.run.finished_at_utc,
            })),
        )
            .into_response(),
    )
}

fn already_running_response(since_utc: DateTime<Utc>) -> Response {
    let elapsed_secs = (Utc::now() - since_utc).num_seconds().max(0);
    (
        StatusCode::ACCEPTED,
        Json(json!({
            "status": "already_running",
            "since_utc": result::rfc3339(since_utc),
            "elapsed_secs": elapsed_secs,
        })),
    )
        .into_response()
}

fn sse_response(body: Sse<RunBodyStream>) -> Response {
    let mut resp = body.into_response();
    resp.headers_mut()
        .insert(header::CACHE_CONTROL, HeaderValue::from_static("no-cache"));
    resp
}

// ── Progress hook ──────────────────────────────────────────────

fn progress_hook(shared: SharedState) -> ProgressFn {
    Arc::new(move |event| {
        shared.emit(map_event(event));
    })
}

// ── Handlers ───────────────────────────────────────────────────

/// `POST /api/run` — the three-outcome precedence of spec §3.2/§5.
pub(crate) async fn run(State(st): State<RunAppState>) -> Response {
    // (1) Already running → 202; your press starts nothing. Checked BEFORE the
    //     cache gate so a live run is never shadowed by the last document.
    if let Some(since_utc) = st.shared.is_running() {
        return already_running_response(since_utc);
    }
    // (2) Idle + fresh + armed file → cached JSON, zero upstream calls.
    if let Some(cached) = cached_hit(st.result_path.clone()).await {
        return cached;
    }
    // (2b) Off-hours one-run gate (ticket 22): outside market hours, one armed
    //      run per window; the next unlocks at the following market open.
    //      Checked after the cache gate (a fresh hit already answers without
    //      upstream calls) and before the lock (a refusal acquires nothing).
    if let Some(doc) = result::read_document_off_thread(st.result_path.clone()).await {
        if let Some(blocked) = off_hours_block(market::session((st.clock)()), &doc) {
            return (
                StatusCode::FORBIDDEN,
                Json(json!({
                    "status": "off_hours_already_ran",
                    "finished_at_utc": doc.run.finished_at_utc,
                    "next_open_utc": blocked
                        .next_open_utc
                        .to_rfc3339_opts(SecondsFormat::Secs, true),
                })),
            )
                .into_response();
        }
    }
    // (3) Win the lock (re-checked inside — checks race freely) and return the
    //     SSE whose body future drives perform_all. Subscribe before anything
    //     can emit; the replay snapshot is empty because begin() cleared it.
    let since_utc = match st.shared.begin() {
        Ok(started) => started,
        Err(running_since) => return already_running_response(running_since),
    };
    let rx = st.shared.subscribe();
    let fut = (st.runner)(st.symbols_file.clone(), Some(progress_hook(st.shared.clone())));
    sse_response(Sse::new(RunBodyStream::driving(
        st.shared.clone(),
        st.result_path.clone(),
        rx,
        Vec::new(),
        since_utc,
        fut,
    )))
}

/// `GET /api/progress` — attach to an in-flight run (replay from seq 0 + live,
/// same terminal) or report idle so the client falls back to `/api/latest`.
pub(crate) async fn progress(State(st): State<RunAppState>) -> Response {
    if st.shared.is_running().is_none() {
        return Json(json!({ "status": "idle" })).into_response();
    }
    // Subscribe BEFORE snapshotting so nothing between copy and subscribe can
    // be missed; duplicates are dropped by seq arithmetic inside the stream.
    let rx = st.shared.subscribe();
    let replay = st.shared.log_snapshot();
    sse_response(Sse::new(RunBodyStream::attaching(rx, replay)))
}

// ── The body future that owns the pipeline (never spawned) ─────

/// Stream feeding the SSE response. In driving mode it ALSO polls the
/// pipeline future inline: dropping this stream (client disconnect, container
/// shutdown, panic unwind) drops `perform_all` with it — cancel-on-close —
/// and the Drop impl always releases the single-flight lock.
struct RunBodyStream {
    /// Live tail of the run's frames; replay-debounced against seen_seq.
    /// BroadcastStream adapter — tokio's broadcast Receiver exposes no
    /// hand-pollable sync API.
    live: tokio_stream::wrappers::BroadcastStream<Frame>,
    replay: std::vec::IntoIter<Frame>,
    /// Highest seq already delivered over THIS stream; duplicates skipped.
    seen_seq: u64,
    pipeline: Option<Pin<Box<dyn Future<Output = model::Result<PerformAllOutcome>> + Send>>>,
    driving: bool,
    /// Set once the `run_finished` frame has been observed (emitted or
    /// replayed); the stream closes right after delivering it.
    saw_terminal: bool,
    shared: SharedState,
    result_path: PathBuf,
    started_at: DateTime<Utc>,
}

impl RunBodyStream {
    fn driving(
        shared: SharedState,
        result_path: PathBuf,
        rx: broadcast::Receiver<Frame>,
        replay: Vec<Frame>,
        started_at: DateTime<Utc>,
        pipeline: RunFuture,
    ) -> Self {
        Self {
            live: tokio_stream::wrappers::BroadcastStream::new(rx),
            replay: replay.into_iter(),
            seen_seq: 0,
            pipeline: Some(pipeline),
            driving: true,
            saw_terminal: false,
            shared,
            result_path,
            started_at,
        }
    }

    fn attaching(rx: broadcast::Receiver<Frame>, replay: Vec<Frame>) -> Self {
        Self {
            live: tokio_stream::wrappers::BroadcastStream::new(rx),
            replay: replay.into_iter(),
            seen_seq: 0,
            pipeline: None,
            driving: false,
            saw_terminal: false,
            shared: SharedState::new(), // unused: attach streams never finalize/drop-guard
            result_path: PathBuf::new(),
            started_at: Utc::now(),
        }
    }

    /// Completion bookkeeping, in the order pinned by ticket 18 / spec §5:
    /// write the document FIRST, then emit `run_finished`, then go Idle.
    fn finalize(&mut self, result: model::Result<PerformAllOutcome>) {
        match result {
            Ok(outcome) => {
                let document = result::build_document(&outcome);
                if let Err(err) =
                    result::write_document(&self.result_path, &document)
                {
                    log::error!(
                        "failed writing result document {}: {}",
                        self.result_path.display(),
                        err
                    );
                }
                let duration_secs =
                    (outcome.finished_at - outcome.started_at).num_seconds();
                self.shared.emit(run_finished_payload(
                    outcome_armed(&outcome),
                    duration_secs,
                    outcome_stages(&outcome),
                ));
                log::info!(
                    "run finished (armed={})",
                    outcome_armed(&outcome)
                );
            }
            Err(err) => {
                // Fatal outer error (§3.4): failure document + ok:false
                // terminal with empty stages; cache stays unarmed so retry is
                // immediate. Pre-fatal stage reports are accepted-dropped.
                let text = err.to_string();
                if let Err(write_err) = result::write_document(
                    &self.result_path,
                    &result::failure_document(self.started_at, &text),
                ) {
                    log::error!("failed writing failure document: {}", write_err);
                }
                let duration_secs = (Utc::now() - self.started_at).num_seconds();
                self.shared
                    .emit(run_finished_payload(false, duration_secs, Vec::new()));
                log::error!("run failed fatally: {text}");
            }
        }
        // Explicit early release — fresh page loads observe Idle immediately
        // after the terminal even before the connection closes. The Drop
        // guard repeats this harmlessly for every other exit path.
        self.shared.set_idle();
    }
}

impl Drop for RunBodyStream {
    fn drop(&mut self) {
        // Every exit path per §5: normal completion (success or total
        // failure), request-future drop (tab close), Cloud Run timeout,
        // panic during unwind. Dropping `pipeline` drops perform_all itself.
        self.pipeline = None;
        if self.driving {
            self.shared.set_idle();
        }
    }
}

impl futures_core::Stream for RunBodyStream {
    type Item = Result<SseFrame, Infallible>;

    fn poll_next(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
    ) -> Poll<Option<Self::Item>> {
        // After the terminal has been delivered the stream closes — both the
        // POST response and every attached progress connection end together.
        if self.saw_terminal {
            return Poll::Ready(None);
        }
        loop {
            // (1) Replay backlog first: an attach streams this run's history
            //     from seq 0 before going live.
            while let Some(frame) = self.replay.next() {
                if frame.seq <= self.seen_seq {
                    continue;
                }
                self.seen_seq = frame.seq;
                self.saw_terminal |= frame.terminal;
                return Poll::Ready(Some(Ok(frame.sse())));
            }

            // (2) Drive the pipeline one notch inline — never spawned. Its
            //     progress hook fills log+broadcast synchronously during this
            //     poll, so frames surface through the channel below.
            if let Some(mut fut) = self.pipeline.take() {
                match fut.as_mut().poll(cx) {
                    Poll::Ready(result) => self.finalize(result),
                    Poll::Pending => self.pipeline = Some(fut),
                }
            }

            // (3) Deliver queued frames, deduped by seq against the replay.
            match futures_core::Stream::poll_next(Pin::new(&mut self.live), cx) {
                Poll::Ready(Some(Ok(frame))) => {
                    if frame.seq <= self.seen_seq {
                        continue;
                    }
                    self.seen_seq = frame.seq;
                    self.saw_terminal |= frame.terminal;
                    return Poll::Ready(Some(Ok(frame.sse())));
                }
                // Overflow behind a slow client mid-run: skip forward (§5's
                // capacity headroom makes this effectively unreachable at
                // ~81 events per run).
                Poll::Ready(Some(Err(
                    tokio_stream::wrappers::errors::BroadcastStreamRecvError::Lagged(n),
                ))) => {
                    log::warn!("progress receiver lagged, skipping {n} frames");
                    continue;
                }
                // Senders only disappear when the whole SharedState does —
                // an app shutdown; end the stream cleanly.
                Poll::Ready(None) => {
                    return Poll::Ready(None);
                }
                Poll::Pending => return Poll::Pending,
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use axum::body::{to_bytes, Body};
    use axum::http::Request;
    use axum::routing::{get, post};
    use market_int_core::model::{ScoreComponents, ScoredChainRow};
    use market_int_core::pipeline::{Stage, StageReport, ScoredTimeframe, StageStatus};
    use tower::ServiceExt;

    use super::*;

    // ── fixtures & helpers ─────────────────────────────────────

    /// Mirrors the production wiring minus auth/assets (passthrough there).
    fn router(st: RunAppState) -> axum::Router {
        axum::Router::new()
            .route("/api/progress", get(progress))
            .route("/api/run", post(run))
            .with_state(st)
    }

    async fn post_run(app: axum::Router) -> axum::response::Response {
        app.oneshot(
            Request::builder().method("POST").uri("/api/run").body(Body::empty()).unwrap(),
        )
        .await
        .unwrap()
    }

    async fn get_progress(app: axum::Router) -> axum::response::Response {
        app.oneshot(
            Request::builder().method("GET").uri("/api/progress").body(Body::empty()).unwrap(),
        )
        .await
        .unwrap()
    }

    async fn json_of(resp: axum::response::Response) -> serde_json::Value {
        let bytes = to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        serde_json::from_slice(&bytes).unwrap()
    }

    fn chain_row(underlying: &str) -> ScoredChainRow {
        ScoredChainRow {
            underlying: underlying.to_string(),
            sector: "Technology".to_string(),
            strike: 175.0,
            underlying_price: 206.84,
            side: market_int_core::model::OptionChainSide::Put,
            bid: 2.05,
            mid: 2.10,
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
            score_components: Some(ScoreComponents { sharpe: 0.18, safety: 0.26, return_part: 0.15 }),
            price_percentile: Some(0.81),
            earnings_before_expiry: None,
            raw_earnings_in_window: None,
            trend_short: Some(1.036),
            trend_long: Some(1.089),
            realized_vol: Some(0.452),
            implied_vol: Some(0.481),
            delta: Some(-0.28),
            iv_rv_ratio: Some(1.0642),
        }
    }

    fn stf(rows: Vec<ScoredChainRow>) -> ScoredTimeframe {
        let n = rows.len();
        ScoredTimeframe {
            period: 5,
            csv: Vec::new(),
            rows,
            top_picks: vec![],
            symbols_with_chains: n,
            row_count: n,
        }
    }

    fn report(stage: Stage, status: StageStatus, error: Option<&str>) -> StageReport {
        StageReport { stage, status, error: error.map(String::from), duration_secs: 1 }
    }

    /// Fully armed: short produced rows → cache arms, terminal ok:true.
    fn armed_outcome() -> PerformAllOutcome {
        PerformAllOutcome {
            started_at: Utc::now() - chrono::Duration::seconds(30),
            finished_at: Utc::now(),
            stages: vec![
                report(Stage::Quotes, StageStatus::Ok, None),
                report(Stage::Metrics, StageStatus::Ok, None),
                report(Stage::ChainsShort, StageStatus::Ok, None),
                report(Stage::ChainsMedium, StageStatus::Partial, Some("1 symbol(s) failed: XYZ")),
            ],
            short: Some(stf(vec![chain_row("NVDA")])),
            medium: None,
            symbols_requested: 3,
            symbols_succeeded: 3,
        }
    }

    // ── off-hours one-run gate (ticket 22) ──────────────────────

    fn doc_with_finish(finished: chrono::DateTime<Utc>) -> ResultDocument {
        let mut outcome = armed_outcome();
        outcome.finished_at = finished;
        outcome.started_at = finished - chrono::Duration::seconds(30);
        result::build_document(&outcome)
    }

    #[test]
    fn off_hours_blocks_armed_doc_finished_inside_window() {
        // Wed 2026-09-02 20:00 ET (closed; window started Wed 16:00 ET).
        let now = chrono::NaiveDate::from_ymd_opt(2026, 9, 2)
            .unwrap()
            .and_hms_opt(20, 0, 0)
            .unwrap()
            .and_local_timezone(chrono_tz::America::New_York)
            .unwrap()
            .with_timezone(&Utc);
        let window = crate::market::session(now);
        assert!(!window.open);
        let started_before_window = doc_with_finish(window.window_started_at_utc - chrono::Duration::hours(1));
        let started_inside = doc_with_finish(now - chrono::Duration::hours(1));
        let unfinished = doc_with_finish(now + chrono::Duration::hours(1));

        assert!(off_hours_block(window, &started_inside).is_some(), "in-window armed run blocks");
        assert!(
            off_hours_block(window, &started_before_window).is_none(),
            "a run finished before this window does not block"
        );
        assert!(
            off_hours_block(window, &unfinished).is_some(),
            "edge: finish later than window start still blocks"
        );
    }

    #[test]
    fn off_hours_never_blocks_open_sessions_or_unarmed_docs() {
        // Open session: Wed 2026-09-02 15:00 ET.
        let now = chrono::NaiveDate::from_ymd_opt(2026, 9, 2)
            .unwrap()
            .and_hms_opt(15, 0, 0)
            .unwrap()
            .and_local_timezone(chrono_tz::America::New_York)
            .unwrap()
            .with_timezone(&Utc);
        let window = crate::market::session(now);
        assert!(window.open);
        assert!(off_hours_block(window, &doc_with_finish(now)).is_none());

        // Closed, but the last document is an unarmed failure → retry stays free.
        let closed = crate::market::session(
            chrono::NaiveDate::from_ymd_opt(2026, 9, 2)
                .unwrap()
                .and_hms_opt(20, 0, 0)
                .unwrap()
                .and_local_timezone(chrono_tz::America::New_York)
                .unwrap()
                .with_timezone(&Utc),
        );
        let failed = result::build_document(&total_failure_outcome());
        assert!(off_hours_block(closed, &failed).is_none());
    }

    /// Both chain stages failed → cache stays unarmed (immediate retry).
    fn total_failure_outcome() -> PerformAllOutcome {
        PerformAllOutcome {
            started_at: Utc::now() - chrono::Duration::seconds(5),
            finished_at: Utc::now(),
            stages: vec![
                report(Stage::ChainsShort, StageStatus::Failed, Some("1 symbol(s) failed: XYZ")),
                report(Stage::ChainsMedium, StageStatus::Failed, Some("1 symbol(s) failed: XYZ")),
            ],
            short: None,
            medium: None,
            symbols_requested: 1,
            symbols_succeeded: 0,
        }
    }

    // ── scripted runners ────────────────────────────────────────
    // The seam takes bare `fn` pointers (requester-factory precedent), so each
    // scenario is its own capture-free fn: emit frozen-vocabulary events via
    // the injected progress hook, return a deterministic outcome. Hermetic —
    // no network, no DB.

    /// Multi-stage success script: 11 progress frames + armed outcome.
    fn multi_stage_runner(_s: String, progress: Option<ProgressFn>) -> RunFuture {
        Box::pin(async move {
            if let Some(cb) = progress.as_ref() {
                cb(PipelineEvent::StageStarted(Stage::Quotes));
                cb(PipelineEvent::BatchDone { stage: Stage::Quotes, done: 1, total: 2 });
                cb(PipelineEvent::BatchDone { stage: Stage::Quotes, done: 2, total: 2 });
                cb(PipelineEvent::StageFinished { stage: Stage::Quotes, ok: true, error: None });
                cb(PipelineEvent::StageStarted(Stage::Metrics));
                cb(PipelineEvent::StageFinished { stage: Stage::Metrics, ok: true, error: None });
                cb(PipelineEvent::StageStarted(Stage::ChainsShort));
                cb(PipelineEvent::BatchDone { stage: Stage::ChainsShort, done: 1, total: 1 });
                cb(PipelineEvent::StageFinished { stage: Stage::ChainsShort, ok: true, error: None });
                cb(PipelineEvent::StageStarted(Stage::ChainsMedium));
                cb(PipelineEvent::StageFinished {
                    stage: Stage::ChainsMedium,
                    ok: false,
                    error: Some("boom".to_string()),
                });
            }
            Ok(armed_outcome())
        })
    }

    /// Total-failure retry script: quotes-only event, unarmed outcome.
    fn failed_retry_runner(_s: String, progress: Option<ProgressFn>) -> RunFuture {
        Box::pin(async move {
            if let Some(cb) = progress.as_ref() {
                cb(PipelineEvent::StageStarted(Stage::Quotes));
            }
            Ok(total_failure_outcome())
        })
    }

    /// Emits one event then hangs forever — the disconnect/cancel scenario.
    fn hanging_runner(_s: String, progress: Option<ProgressFn>) -> RunFuture {
        Box::pin(async move {
            if let Some(cb) = progress.as_ref() {
                cb(PipelineEvent::StageStarted(Stage::Quotes));
            }
            std::future::pending::<()>().await;
            unreachable!("pending never resolves");
        })
    }

    /// The sole fatal step of the pipeline: requester-init failure.
    fn fatal_runner(_s: String, _progress: Option<ProgressFn>) -> RunFuture {
        Box::pin(async move {
            Err(market_int_core::model::QuotesError::HttpError(
                market_int_core::http::client::RequestError::Other(
                    "Failed to initialize Tiger API requester".to_string(),
                ),
            ))
        })
    }

    fn fresh_doc(outcome: &PerformAllOutcome) -> (tempfile::TempDir, PathBuf) {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");
        result::write_document(&path, &result::build_document(outcome)).unwrap();
        (dir, path)
    }

    async fn sse_data_lines(resp: axum::response::Response) -> Vec<serde_json::Value> {
        let ct = resp.headers()["content-type"].to_str().unwrap().to_string();
        assert!(ct.starts_with("text/event-stream"), "got {ct}");
        let bytes = to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        parse_data_lines(&String::from_utf8(bytes.to_vec()).unwrap())
    }

    /// Spec §3.3 parser contract, mirrored server-side for assertions:
    /// buffer, split lines, strip `data:`, skip blank/malformed.
    fn parse_data_lines(text: &str) -> Vec<serde_json::Value> {
        text.lines()
            .filter_map(|l| l.strip_prefix("data:").map(str::trim))
            .filter(|p| !p.is_empty())
            .map(|p| serde_json::from_str(p).expect("one JSON object per data line"))
            .collect()
    }

    // ── precedence case 2: the cache gate ───────────────────────

    /// Idle + fresh + armed file → cached JSON WITHOUT document rows; zero
    /// runs started; lock stays Idle afterwards.
    #[tokio::test]
    async fn cached_hit_serves_rows_free_json_and_stays_idle() {
        let (dir, path) = fresh_doc(&armed_outcome());
        let finished = result::read_document(&path).unwrap().run.finished_at_utc;
        let app = router(RunAppState::for_test(path, live_runner, "/data/symbols.csv"));

        let resp = post_run(app.clone()).await;
        assert_eq!(resp.status(), StatusCode::OK);
        assert!(
            resp.headers()["content-type"].to_str().unwrap().starts_with("application/json"),
            "a cache hit is application/json, never SSE"
        );
        let bytes = to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        let v: serde_json::Value = serde_json::from_slice(&bytes).unwrap();

        assert_eq!(v["status"], "cached");
        assert_eq!(v["cached"], true);
        assert_eq!(
            v["cache_secs"],
            serde_json::json!(market_int_core::constants::WEBAPP_CACHE_SECS)
        );
        assert_eq!(v["finished_at_utc"], serde_json::json!(finished));
        assert!(
            v["age_secs"].as_u64().unwrap() < 5,
            "freshly-written doc serves ~seconds of age"
        );
        assert!(
            !bytes.windows(6).any(|w| w == b"\"rows\""),
            "rows have exactly one HTTP home (/api/latest)"
        );

        // Nothing ran → the endpoint stays idle (JSON probe shape).
        let prog = get_progress(app).await;
        assert!(
            prog.headers()["content-type"].to_str().unwrap().starts_with("application/json")
        );
        drop(dir);
    }

    /// Strict freshness: a document completed EXACTLY WEBAPP_CACHE_SECS ago is
    /// expired — the press starts a fresh run (SSE) rather than serving cache.
    #[tokio::test]
    async fn window_boundary_is_strict_less_than() {
        let mut outcome = armed_outcome();
        outcome.finished_at = Utc::now()
            - chrono::Duration::seconds(market_int_core::constants::WEBAPP_CACHE_SECS as i64);
        outcome.started_at = outcome.finished_at - chrono::Duration::seconds(30);
        let (dir, path) = fresh_doc(&outcome);

        let resp = post_run(router(RunAppState::for_test(path, failed_retry_runner, ""))).await;
        assert_eq!(resp.status(), StatusCode::OK);
        assert!(
            resp.headers()["content-type"].to_str().unwrap().starts_with("text/event-stream"),
            "at age == 600 the gate opens for a real run"
        );
        drop(dir);
    }

    // ── precedence case 1: single-flight 202 ────────────────────

    /// Running → 202 regardless of what the file holds — checked BEFORE the
    /// cache gate, so a live run is never shadowed by the last document.
    #[tokio::test]
    async fn second_press_while_running_returns_202_even_when_fresh_and_armed() {
        let (dir, path) = fresh_doc(&armed_outcome()); // would otherwise cache-hit
        let st = RunAppState::for_test(path, fatal_runner, "");
        st.shared.begin().expect("first acquisition wins");
        let app = router(st);

        let resp = post_run(app).await;
        assert_eq!(resp.status(), StatusCode::ACCEPTED);
        let v = json_of(resp).await;
        assert_eq!(v["status"], "already_running");
        assert!(v["since_utc"].as_str().is_some());
        assert!(v["elapsed_secs"].as_i64().unwrap() >= 0);
        drop(dir);
    }

    // ── precedence case 3: the live stream ──────────────────────

    /// Fresh start streams the frozen vocabulary in order with process-wide
    /// monotonically increasing seq (+1 every frame) and a shaped terminal.
    #[tokio::test]
    async fn full_stream_frame_order_and_seq_arithmetic() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json"); // absent → uncached start
        let app = router(RunAppState::for_test(path.clone(), multi_stage_runner, ""));

        let resp = post_run(app).await;
        assert_eq!(resp.status(), StatusCode::OK);
        assert_eq!(
            resp.headers()["cache-control"],
            axum::http::HeaderValue::from_static("no-cache")
        );

        let frames = sse_data_lines(resp).await;
        let types: Vec<&str> =
            frames.iter().map(|f| f["type"].as_str().unwrap()).collect();
        assert_eq!(
            types,
            vec![
                "stage_started", "batch_done", "batch_done", "stage_finished",
                "stage_started", "stage_finished", "stage_started", "batch_done",
                "stage_finished", "stage_started", "stage_finished", "run_finished",
            ]
        );

        // Seq arithmetic: strictly increasing across the run. The counter is
        // process-global (other tests allocate from it in parallel), so the
        // +1-per-frame property is covered by the dedicated monotonic unit
        // test; within one stream only ordering matters.
        for pair in frames.windows(2) {
            assert!(
                pair[1]["seq"].as_u64().unwrap() > pair[0]["seq"].as_u64().unwrap(),
                "frames {} then {}",
                pair[0],
                pair[1]
            );
        }

        // Doc vocabulary, batch counters, terminal shape.
        assert_eq!(frames[6]["stage"], "chains_short");
        assert_eq!(frames[9]["stage"], "chains_medium");
        assert_eq!(frames[7]["done"], 1);
        assert_eq!(frames[7]["total"], 1);

        let terminal = frames.last().unwrap();
        assert_eq!(terminal["ok"], true, "ok IS the arming predicate");
        assert!(terminal["duration_secs"].as_i64().unwrap() >= 0);
        let stages = terminal["stages"].as_array().unwrap();
        assert_eq!(stages.len(), 4);
        assert_eq!(stages[0]["name"], "quotes");
        assert_eq!(stages[0]["status"], "ok");
        assert_eq!(stages[3]["name"], "chains_medium");
        assert_eq!(stages[3]["status"], "partial");
        assert_eq!(stages[3]["error"], "1 symbol(s) failed: XYZ");

        // Completion rewrote the result file (rows landed under their one home).
        let raw = std::fs::read_to_string(&path).unwrap();
        let doc: ResultDocument = serde_json::from_str(&raw).unwrap();
        assert!(doc.timeframes.is_some());
        drop(dir);
    }

    /// §5 case map: FRESH-but-unarmed document bypasses the gate entirely —
    /// immediate retry, real run, ok:false terminal, file overwritten.
    #[tokio::test]
    async fn fresh_unarmed_file_bypasses_cache_gate_for_immediate_retry() {
        let (dir, path) = fresh_doc(&total_failure_outcome());
        let before_mtime = std::fs::metadata(&path).unwrap().modified().unwrap();
        tokio::time::sleep(Duration::from_millis(20)).await;

        let resp =
            post_run(router(RunAppState::for_test(path.clone(), failed_retry_runner, ""))).await;
        let frames = sse_data_lines(resp).await;
        assert_eq!(frames[0]["type"], "stage_started", "a run actually started");
        let terminal = frames.last().unwrap();
        assert_eq!(terminal["type"], "run_finished");
        assert_eq!(terminal["ok"], false);

        // The retry overwrote the previous (still-unarmed) document — mtime
        // moves even when the new bytes coincide with the old ones.
        let after_mtime = std::fs::metadata(&path).unwrap().modified().unwrap();
        assert_ne!(before_mtime, after_mtime, "document was rewritten by the retry");
        drop(dir);
    }

    /// Fatal outer error: §3.4 failure document lands (stages [], run.error
    /// set, timeframes key absent) + ok:false terminal with empty stages —
    /// and retry stays allowed because nothing arms.
    #[tokio::test]
    async fn fatal_error_writes_failure_document_and_ok_false_terminal() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("last_run.json");

        let resp = post_run(router(RunAppState::for_test(path.clone(), fatal_runner, ""))).await;
        let frames = sse_data_lines(resp).await;
        let terminal = frames.last().unwrap();
        assert_eq!(terminal["type"], "run_finished");
        assert_eq!(terminal["ok"], false);
        assert_eq!(terminal["stages"].as_array().unwrap().len(), 0, "pre-fatal reports dropped");
        assert!(terminal["duration_secs"].as_i64().unwrap() >= 0);

        let raw = std::fs::read_to_string(&path).unwrap();
        assert!(!raw.contains("\"timeframes\""), "fatal doc omits timeframe keys");
        let doc: ResultDocument = serde_json::from_str(&raw).unwrap();
        assert!(doc.stages.is_empty());
        // QuotesError's Display wraps the inner request error text.
        let err_text = doc.run.error.as_deref().unwrap_or_default();
        assert!(
            err_text.contains("Failed to initialize Tiger API requester"),
            "run.error carries the failure story, got: {err_text}"
        );
        assert_eq!(doc.run.triggered_by, "web");
        drop(dir);
    }

    // ── cancel-on-close (drop-mid-run) ──────────────────────────

    /// Dropping the response mid-run releases the lock AND leaves the
    /// previous result file byte-for-byte intact (canceled runs never write).
    #[tokio::test]
    async fn dropping_stream_mid_run_resets_idle_and_preserves_previous_file() {
        let (dir, path) = fresh_doc(&armed_outcome());
        // Expire the seeded document (finished > WEBAPP_CACHE_SECS ago) so
        // the gate OPENS — otherwise the press takes the cached branch and
        // no stream exists to disconnect.
        let mut seed: serde_json::Value =
            serde_json::from_str(&std::fs::read_to_string(&path).unwrap()).unwrap();
        seed["run"]["finished_at_utc"] = serde_json::json!(result::rfc3339(
            Utc::now()
                - chrono::Duration::seconds(market_int_core::constants::WEBAPP_CACHE_SECS as i64 + 5)
        ));
        std::fs::write(&path, seed.to_string()).unwrap();

        let previous = std::fs::read(&path).unwrap();
        let st = RunAppState::for_test(path.clone(), hanging_runner, "");
        let app = router(st.clone());
        let resp = post_run(app).await;
        assert_eq!(resp.status(), StatusCode::OK);
        assert!(
            resp.headers()["content-type"].to_str().unwrap().starts_with("text/event-stream"),
            "gate open ⇒ live SSE stream"
        );

        // Consume exactly the first frame — proof the pipeline was actually
        // polled (the hang happens after its opening stage_started) — then
        // close the connection mid-run.
        let mut body = resp.into_body();
        let mut seen_data = false;
        let mut trace = String::new();
        for _ in 0..6 {
            match next_event(&mut body).await {
                Read::Event(v) => {
                    log::info!("disconnect probe event: {v}");
                    seen_data = true;
                    break;
                }
                Read::Open => trace.push_str("open "),
                Read::Eof => {
                    trace.push_str("EOF ");
                    break;
                }
            }
        }
        assert!(
            seen_data,
            "first SSE frame must flow before the disconnect; reads=[{trace}]"
        );
        assert!(seen_data, "first SSE frame must flow before the disconnect");
        drop(body);

        // The Drop guard runs synchronously on drop; settle scheduling only.
        tokio::time::sleep(Duration::from_millis(20)).await;

        // Lock reset observed through the SAME SharedState's endpoints…
        let prog = get_progress(router(st.clone())).await;
        assert!(
            prog.headers()["content-type"].to_str().unwrap().starts_with("application/json"),
            "after disconnect, progress must answer the idle JSON shape (reads=[{trace}])"
        );
        let v = json_of(prog).await;
        assert_eq!(v["status"], "idle");

        // …and the previous file survives the canceled run untouched.
        assert_eq!(previous, std::fs::read(&path).unwrap());
        drop(dir);
    }

    // ── attach/replay mechanics (§3.3), driven over HTTP like a client ──

    /// One incremental read of an SSE response body.
    enum Read {
        /// A parsed `data:` payload arrived.
        Event(serde_json::Value),
        /// Nothing buffered and nothing closed within the timeout — the
        /// stream is alive but idle (hanging pipeline, mid-run).
        Open,
        /// The body ended cleanly.
        Eof,
    }

    async fn next_event(body: &mut axum::body::Body) -> Read {
        use http_body_util::BodyExt;
        let raw = <axum::body::Body as BodyExt>::frame(body);
        match tokio::time::timeout(Duration::from_millis(700), raw).await {
            Err(_) => Read::Open,
            Ok(None) => Read::Eof,
            Ok(Some(Ok(frame))) => {
                let text = String::from_utf8_lossy(frame.data_ref().map(|d| d.as_ref()).unwrap_or(b"")).into_owned();
                let payload = text.lines().find_map(|l| l.strip_prefix("data:").map(str::trim)).filter(|p| !p.is_empty());
                match payload {
                    Some(p) => Read::Event(serde_json::from_str(p).expect("one JSON per data line")),
                    None => Read::Open,
                }
            }
            Ok(Some(Err(_))) => Read::Eof,
        }
    }

    /// GET /api/progress while a run is live replays this run's frames from
    /// seq 0, stays open for the live tail on every concurrent attachment,
    /// and closes each one right after the terminal run_finished.
    #[tokio::test]
    async fn progress_attaches_replaying_history_then_live_until_terminal() {
        let dir = tempfile::tempdir().unwrap();
        let st = RunAppState::for_test(dir.path().join("last_run.json"), hanging_runner, "");

        // A run is already in flight; its history built up unwatched.
        st.shared.begin().expect("acquire");
        let h1 = st.shared.emit(json!({ "type": "stage_started", "stage": "quotes" }));
        let h2 = st.shared.emit(json!({
            "type": "batch_done", "stage": "quotes", "done": 1, "total": 3
        }));

        let app = router(st.clone());
        let resp = get_progress(app.clone()).await;
        assert!(
            resp.headers()["content-type"].to_str().unwrap().starts_with("text/event-stream"),
            "running ⇒ SSE, never the idle JSON"
        );
        let mut body1 = resp.into_body();

        // Replay phase: full history from sequence zero, oldest first.
        let Read::Event(a) = next_event(&mut body1).await else {
            panic!("first replayed frame missing");
        };
        assert_eq!(a["type"], "stage_started");
        assert_eq!(a["seq"], h1.seq);
        let Read::Event(b) = next_event(&mut body1).await else {
            panic!("second replayed frame missing");
        };
        assert_eq!(
            (&b["type"], &b["done"], &b["total"]),
            (&json!("batch_done"), &json!(1), &json!(3))
        );
        assert_eq!(b["seq"], h2.seq);

        // Then the stream goes LIVE: past the replay it just waits.
        assert!(matches!(next_event(&mut body1).await, Read::Open), "must hold open");

        // A second concurrent attacher sees the identical replay.
        let mut body2 = get_progress(app).await.into_body();
        let Read::Event(c) = next_event(&mut body2).await else {
            panic!("second attacher replay missing");
        };
        assert_eq!((&c["type"], &c["seq"]), (&json!("stage_started"), &json!(h1.seq)));
        let Read::Event(d) = next_event(&mut body2).await else {
            panic!("second attacher replay incomplete");
        };
        assert_eq!(d["seq"], h2.seq);
        // …and it too settles into the live tail.
        assert!(matches!(next_event(&mut body2).await, Read::Open), "must hold open");

        // The terminal reaches BOTH attachments and ends them right after.
        let term = st.shared.emit(json!({
            "type": "run_finished", "ok": false, "duration_secs": 7, "stages": []
        }));
        for b in [&mut body1, &mut body2] {
            let Read::Event(t) = next_event(b).await else {
                panic!("terminal frame missing on an attached stream");
            };
            assert_eq!(
                (&t["type"], &t["ok"], &t["seq"]),
                (&json!("run_finished"), &json!(false), &json!(term.seq))
            );
            assert!(matches!(next_event(b).await, Read::Eof), "stream must close post-terminal");
        }
        drop(dir);
    }

    /// The Frame seq counter is process-wide monotonic across runs (replay
    /// dedupe relies on it; log clearing does not reset it).
    #[test]
    fn frame_seq_is_process_wide_monotonic() {
        let a = SharedState::new();
        let x = a.emit(json!({ "type": "stage_started", "stage": "quotes" }));
        let y = a.emit(json!({ "type": "stage_started", "stage": "metrics" }));
        assert_eq!(y.seq, x.seq + 1);
        let t = Frame::new(json!({ "type": "run_finished" }));
        assert_eq!(t.seq, y.seq + 1);
        assert!(t.terminal && !x.terminal && !y.terminal);
    }

    /// Armed predicate equivalence over documents: chains ok/partial arm;
    /// only-quotes/metrics activity or chain failures do not.
    #[test]
    fn arming_predicate_vocabulary_grid() {
        let mk = |entries: &[(&str, &str)]| ResultDocument {
            schema_version: 1,
            thresholds: serde_json::from_str(
                r#"{"vol_tier_high":0.38,"vol_tier_mid":0.28,"momentum_high":0.8,"momentum_extended":0.9}"#,
            )
            .unwrap(),
            run: serde_json::from_str(
                r#"{"started_at_utc":"2026-08-27T13:02:11Z","finished_at_utc":"2026-08-27T13:07:46Z","duration_secs":335,"market_date_ny":"2026-08-27","triggered_by":"web","symbols_requested":0,"symbols_succeeded":0,"error":null}"#,
            )
            .unwrap(),
            stages: entries
                .iter()
                .map(|(name, status)| crate::result::StageDoc {
                    name: name.to_string(),
                    status: status.to_string(),
                    duration_secs: 1,
                    error: None,
                })
                .collect(),
            timeframes: None,
        };

        assert!(doc_armed(&mk(&[("chains_short", "ok")])));
        assert!(doc_armed(&mk(&[("chains_short", "partial"), ("quotes", "failed")])));
        assert!(doc_armed(&mk(&[("quotes", "failed"), ("chains_medium", "partial")])));
        assert!(!doc_armed(&mk(&[("chains_short", "failed"), ("chains_medium", "failed")])));
        assert!(!doc_armed(&mk(&[("quotes", "ok"), ("metrics", "ok")])));
        assert!(!doc_armed(&mk(&[])));

        // Outcome-side equivalence.
        assert!(outcome_armed(&armed_outcome()));
        assert!(!outcome_armed(&total_failure_outcome()));
    }
}

