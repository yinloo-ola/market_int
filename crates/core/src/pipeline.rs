//! Shared perform-all orchestration (spec §2.2): one pipeline for the CLI's
//! Telegram path and the webapp's no-publish path.
//!
//! Mirrors the original PerformAll arm exactly: quotes → metrics →
//! requester-init → chains-short → chains-medium. Every stage failure is
//! recorded as a [`StageReport`] and the run barrels on; the only fatal outer
//! error is requester-initialization failure.
//!
//! Observability lands here too (spec §2.4c): a [`ProgressReporter`] carries
//! the frozen event vocabulary through the batch loops, and [`RunCoverage`]
//! tracks exact per-run symbol outcomes.

use std::collections::HashMap;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use rusqlite::Connection;

use crate::{
    http::client::RequestError,
    model,
    option::{self, ExpiryTimeframe, RetrievedData},
    regime::MarketRegime,
    sectors,
    tiger::api_caller::Requester,
};

// ── Progress events ────────────────────────────────────────────

/// Frozen SSE/event vocabulary carried into the result stream later; the
/// webapp replays these verbatim (spec §2.2).
#[derive(Debug, Clone)]
pub enum PipelineEvent {
    StageStarted(Stage),
    /// Emitted after each 10-symbol API batch attempt (successful or not, so
    /// the bar always advances). total = ceil(symbols/10).
    BatchDone {
        stage: Stage,
        done: usize,
        total: usize,
    },
    StageFinished {
        stage: Stage,
        /// True only when the stage fully succeeded; partial counts as false.
        ok: bool,
        error: Option<String>,
    },
}

/// Send + Sync so the pipeline future stays Send and can run inside an axum
/// handler later.
pub type ProgressFn = Arc<dyn Fn(PipelineEvent) + Send + Sync>;

/// Carries an optional observer; the default emits nothing, so CLI call
/// sites are unaffected.
#[derive(Clone, Default)]
pub struct ProgressReporter {
    cb: Option<ProgressFn>,
}

impl ProgressReporter {
    pub fn new(cb: ProgressFn) -> Self {
        Self { cb: Some(cb) }
    }

    pub fn emit(&self, event: PipelineEvent) {
        if let Some(cb) = &self.cb {
            cb(event);
        }
    }
}

// ── Stages & reports ───────────────────────────────────────────

/// Pipeline stages, in execution order. Requester-init is not a stage —
/// it is the single fatal step before any chains stage runs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Stage {
    Quotes,
    Metrics,
    ChainsShort,
    ChainsMedium,
}

impl Stage {
    /// Lowercase stage name used in logs and result documents.
    pub fn as_str(&self) -> &'static str {
        match self {
            Stage::Quotes => "quotes",
            Stage::Metrics => "metrics",
            Stage::ChainsShort => "chains-short",
            Stage::ChainsMedium => "chains-medium",
        }
    }

    /// Historical day-label for chain stages ("5-day"/"20-day"), from which
    /// both success and error log wordings derive — keeps them drift-proof.
    pub fn day_label(&self) -> &'static str {
        match self {
            Stage::ChainsShort => "5-day",
            Stage::ChainsMedium => "20-day",
            other => other.as_str(),
        }
    }
}

/// Final outcome vocabulary for a stage (maps 1:1 onto the result
/// document's `ok | partial | failed`, spec §2.4c).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StageStatus {
    Ok,
    /// Some API batches failed but rows were still produced; `error` carries
    /// the failed-symbol text.
    Partial,
    Failed,
}

/// Outcome of one pipeline stage.
pub struct StageReport {
    pub stage: Stage,
    pub status: StageStatus,
    /// For `Partial`: `"N symbol(s) failed: …"`; for `Failed`: either that
    /// same text (no rows produced at all) or the underlying error display.
    pub error: Option<String>,
}

/// Quotes-stage coverage for the whole run (spec §2.4c's
/// `run.symbols_requested` / `run.symbols_succeeded`). Mutated through the
/// quotes batch loop, so the numbers are exact even when a batch fails
/// mid-run.
#[derive(Debug, Clone, Default)]
pub struct RunCoverage {
    pub symbols_requested: usize,
    pub symbols_succeeded: usize,
}

// ── Publish hook ───────────────────────────────────────────────

/// Everything a publish hook may need for one timeframe: the retrieved data
/// bundle plus the pipeline-owned regime and sectors map. Both are inherited
/// inside `perform_all` (spec §2.4) and flow through here so hook
/// implementations cannot reconstruct them differently from the pipeline.
pub struct PublishContext<'a> {
    pub data: &'a RetrievedData,
    pub regime: &'a MarketRegime,
    pub sectors: &'a HashMap<String, String>,
}

/// Injected publish sink. Telegram code is CLI-only, so the no-publish switch
/// is an injected hook, not a bool: the CLI supplies the Telegram publish
/// implementation, the webapp passes `None`.
///
/// Hand-boxed future rather than the async-trait crate — same object-safe
/// shape, one less dependency.
pub trait PublishHook: Send + Sync {
    fn publish<'a>(
        &'a self,
        ctx: PublishContext<'a>,
    ) -> Pin<Box<dyn Future<Output = model::Result<()>> + Send + 'a>>;
}

#[derive(Default)]
pub struct PerformAllOptions {
    /// `None` → score each timeframe via `option_chain_to_csv_vec` and return
    /// [`ScoredTimeframe`]s (webapp path). `Some(_)` → the hook publishes per
    /// timeframe and the scored outputs stay `None` (CLI parity — building
    /// the CSV twice would be waste).
    pub publish: Option<Arc<dyn PublishHook>>,
    /// `None` → a no-op reporter (CLI behavior unchanged).
    pub progress: Option<ProgressFn>,
}

/// One timeframe's scored output — the CSV is byte-identical to the Telegram
/// attachment (same `option_chain_to_csv_vec` call).
pub struct ScoredTimeframe {
    /// 5 (Short) or 20 (Medium).
    pub period: usize,
    pub csv: Vec<u8>,
    pub top_picks: Vec<model::TopPick>,
    /// Exact per-timeframe coverage (spec §2.4c), mirrored from the retrieval.
    pub symbols_with_chains: usize,
    pub row_count: usize,
}

pub struct PerformAllOutcome {
    /// Execution order; always populated up to the fatal point.
    pub stages: Vec<StageReport>,
    /// `None` when that stage failed or a publish hook consumed the output.
    pub short: Option<ScoredTimeframe>,
    /// Same contract as `short`.
    pub medium: Option<ScoredTimeframe>,
    /// Quotes-stage coverage for the whole run.
    pub symbols_requested: usize,
    pub symbols_succeeded: usize,
}

// ── Test seam: injectable requester construction ───────────────

pub(crate) type RequesterInitFuture = Pin<Box<dyn Future<Output = Option<Requester>> + Send>>;
pub(crate) type RequesterFactory = fn() -> RequesterInitFuture;

/// Production constructor used by both wrapper entry points.
pub(crate) fn live_requester_factory() -> RequesterFactory {
    || Box::pin(Requester::new())
}

// ── Internals ──────────────────────────────────────────────────

/// Behavior inheritance (spec §2.4a): the PerformAll arm hardcodes the bull
/// regime ("bypasses dynamic SPY checks to save time/API calls"). Single
/// source here so no other construction site can drift from the pipeline.
fn inherited_regime() -> MarketRegime {
    MarketRegime::from_spy_trend(crate::constants::PERFORM_ALL_SPY_TREND_RATIO)
}

/// Either hands the retrieved bundle to the injected hook, or scores it here
/// (`publish = None`, webapp path). `Ok(None)` means a hook consumed the
/// output; `Ok(Some(_))` carries the scored CSV + top picks.
async fn publish_or_score(
    hook: Option<&Arc<dyn PublishHook>>,
    retrieved: &RetrievedData,
    regime: &MarketRegime,
    sectors_map: &HashMap<String, String>,
) -> model::Result<Option<ScoredTimeframe>> {
    match hook {
        Some(hook) => {
            let ctx = PublishContext {
                data: retrieved,
                regime,
                sectors: sectors_map,
            };
            hook.publish(ctx).await.map(|_| None)
        }
        None => {
            let (csv, top_picks) = model::option_chain_to_csv_vec(
                &retrieved.all_chains,
                &retrieved.sharpe_ratios,
                &retrieved.price_ranges,
                &retrieved.price_percentiles,
                &retrieved.earnings_map,
                &retrieved.trend_data,
                &retrieved.realized_vols,
                sectors_map,
                regime,
            )?;
            Ok(Some(ScoredTimeframe {
                period: retrieved.period,
                csv,
                top_picks,
                symbols_with_chains: retrieved.symbols_with_chains,
                row_count: retrieved.row_count,
            }))
        }
    }
}

/// Resolves a successful-retrieval chain stage into its final status and
/// error text (the exact coverage wording of spec §2.4c).
fn resolve_chain_status(retrieved: &RetrievedData) -> (StageStatus, Option<String>) {
    if retrieved.api_failed_symbols.is_empty() {
        return (StageStatus::Ok, None);
    }
    let text = format!(
        "{} symbol(s) failed: {}",
        retrieved.api_failed_symbols.len(),
        retrieved.api_failed_symbols.join(", ")
    );
    let status = if retrieved.row_count > 0 {
        StageStatus::Partial
    } else {
        StageStatus::Failed
    };
    (status, Some(text))
}

/// Records a finished stage: logs non-ok results at debug level (the caller
/// already logs with historical wording), emits `StageFinished`, pushes the
/// report.
fn finish_stage(
    progress: &ProgressReporter,
    stages: &mut Vec<StageReport>,
    stage: Stage,
    status: StageStatus,
    error: Option<String>,
) {
    if status != StageStatus::Ok {
        if let Some(err) = &error {
            log::debug!(
                "pipeline stage {} did not fully succeed: {}",
                stage.as_str(),
                err
            );
        }
    }
    progress.emit(PipelineEvent::StageFinished {
        stage,
        ok: status == StageStatus::Ok,
        error: error.clone(),
    });
    stages.push(StageReport {
        stage,
        status,
        error,
    });
}

/// One chains stage: retrieve (+persist), resolve coverage-driven status,
/// then publish-or-score. Retrieval errors vs all-batches-failed both end the
/// stage but never abort the run.
async fn run_chains_stage(
    conn: &mut Connection,
    requester: &mut Requester,
    symbols_file_path: &str,
    stage: Stage,
    hook: Option<&Arc<dyn PublishHook>>,
    regime: &MarketRegime,
    sectors_map: &HashMap<String, String>,
    stages: &mut Vec<StageReport>,
    progress: &ProgressReporter,
) -> Option<ScoredTimeframe> {
    let timeframe = match stage {
        Stage::ChainsShort => ExpiryTimeframe::Short,
        Stage::ChainsMedium => ExpiryTimeframe::Medium,
        other => unreachable!("run_chains_stage called with non-chain stage {:?}", other),
    };
    let day_label = stage.day_label();

    progress.emit(PipelineEvent::StageStarted(stage));
    let retrieved = match option::retrieve_option_chains(
        symbols_file_path,
        &model::OptionChainSide::Put,
        conn,
        timeframe,
        requester,
        progress,
    )
    .await
    {
        Ok(retrieved) => retrieved,
        Err(err) => {
            log::error!("Error pulling {} option chains: {}", day_label, err);
            finish_stage(progress, stages, stage, StageStatus::Failed, Some(err.to_string()));
            return None;
        }
    };

    let (status, error) = resolve_chain_status(&retrieved);
    match status {
        StageStatus::Ok => {
            log::info!("Successfully pulled and saved {} option chains", day_label);
        }
        _ => {
            // Historical wording; the structured report keeps the details.
            log::error!(
                "Error pulling {} option chains: {}",
                day_label,
                error.clone().unwrap_or_default()
            );
        }
    }

    let scored_result = match publish_or_score(hook, &retrieved, regime, sectors_map).await {
        Ok(scored) => scored,
        Err(err) => {
            // Historical wording covers scoring/publish failures too.
            log::error!("Error pulling {} option chains: {}", day_label, err);
            finish_stage(progress, stages, stage, StageStatus::Failed, Some(err.to_string()));
            return None;
        }
    };

    finish_stage(progress, stages, stage, status, error);
    scored_result
}

/// Runs the pipeline with an injected requester factory. The public wrapper
/// [`perform_all`] passes the live Tiger constructor; tests call this directly
/// with stub factories so scenarios stay hermetic and offline.
async fn run_pipeline(
    conn: &mut Connection,
    symbols_file_path: &str,
    opts: PerformAllOptions,
    factory: RequesterFactory,
) -> model::Result<PerformAllOutcome> {
    let progress = match opts.progress {
        Some(cb) => ProgressReporter::new(cb),
        None => ProgressReporter::default(),
    };
    let hook = opts.publish;
    let hook_ref = hook.as_ref();
    let mut stages: Vec<StageReport> = Vec::new();

    // Quotes stage — barrel on Err onto the stale DB, exactly as the arm did.
    let mut coverage = RunCoverage::default();
    progress.emit(PipelineEvent::StageStarted(Stage::Quotes));
    let (quotes_status, quotes_error) =
        match crate::quotes::pull_and_save_with(symbols_file_path, conn, factory, &progress, &mut coverage)
            .await
        {
            Ok(()) => {
                log::info!("Successfully pulled and saved quotes");
                (StageStatus::Ok, None)
            }
            Err(err) => {
                log::error!("Error pulling and saving quotes: {}", err);
                (StageStatus::Failed, Some(err.to_string()))
            }
        };
    finish_stage(
        &progress,
        &mut stages,
        Stage::Quotes,
        quotes_status,
        quotes_error,
    );

    // Metrics stage — fast pure-DB math, stage events only.
    progress.emit(PipelineEvent::StageStarted(Stage::Metrics));
    let (metrics_status, metrics_error) = match crate::metrics::run_all(symbols_file_path, conn) {
        Ok(()) => {
            log::info!("Successfully completed metric calculation pipeline");
            (StageStatus::Ok, None)
        }
        Err(err) => {
            log::error!("Error running metric pipeline: {}", err);
            (StageStatus::Failed, Some(err.to_string()))
        }
    };
    finish_stage(
        &progress,
        &mut stages,
        Stage::Metrics,
        metrics_status,
        metrics_error,
    );

    // Requester init — the single fatal step: outer Err reserved for this alone.
    let mut requester = match factory().await {
        Some(requester) => requester,
        None => {
            log::error!("Failed to initialize Tiger API requester");
            return Err(model::QuotesError::HttpError(RequestError::Other(
                "Failed to initialize Tiger API requester".to_string(),
            )));
        }
    };

    // Behavior inheritance (spec §2.4): hardcoded bull regime; sectors loaded
    // from the run's own symbols file — exactly what the arm did inline.
    let regime = inherited_regime();
    let sectors_map = sectors::load_sectors(symbols_file_path).unwrap_or_default();

    let short = run_chains_stage(
        conn,
        &mut requester,
        symbols_file_path,
        Stage::ChainsShort,
        hook_ref,
        &regime,
        &sectors_map,
        &mut stages,
        &progress,
    )
    .await;

    let medium = run_chains_stage(
        conn,
        &mut requester,
        symbols_file_path,
        Stage::ChainsMedium,
        hook_ref,
        &regime,
        &sectors_map,
        &mut stages,
        &progress,
    )
    .await;

    Ok(PerformAllOutcome {
        stages,
        short,
        medium,
        symbols_requested: coverage.symbols_requested,
        symbols_succeeded: coverage.symbols_succeeded,
    })
}

/// Runs the full perform-all pipeline against `symbols_file_path`, mirroring
/// the CLI arm stage-for-stage (including its log lines). Publishes through
/// the injected hook when supplied, otherwise scores and returns per-timeframe
/// outputs.
pub async fn perform_all(
    conn: &mut Connection,
    symbols_file_path: &str,
    opts: PerformAllOptions,
) -> model::Result<PerformAllOutcome> {
    run_pipeline(conn, symbols_file_path, opts, live_requester_factory()).await
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::store::candle;
    use std::fs;
    use std::sync::{Arc, Mutex};

    // ── helpers ────────────────────────────────────────────────

    type CapturedEvents = Arc<Mutex<Vec<PipelineEvent>>>;

    fn captured_reporter() -> (Option<ProgressFn>, CapturedEvents) {
        let events: CapturedEvents = Arc::new(Mutex::new(Vec::new()));
        let sink = events.clone();
        let cb: ProgressFn = Arc::new(move |ev| sink.lock().unwrap().push(ev));
        (Some(cb), events)
    }

    fn none_factory() -> RequesterFactory {
        || Box::pin(async { None })
    }

    /// Loopback-only stub requester — connection refused instantly, no
    /// external traffic regardless of ambient credentials.
    fn stub_factory() -> RequesterFactory {
        || Box::pin(async { Some(crate::tiger::api_caller::Requester::pipeline_test_stub()) })
    }

    async fn run(
        conn: &mut Connection,
        path: &str,
        factory: RequesterFactory,
        progress: Option<ProgressFn>,
    ) -> model::Result<PerformAllOutcome> {
        run_pipeline(
            conn,
            path,
            PerformAllOptions {
                publish: None,
                progress,
            },
            factory,
        )
        .await
    }

    fn write_symbols_file(dir: &std::path::Path, lines: &[String]) -> String {
        let path = dir.join("symbols.txt");
        fs::write(&path, lines.join("\n") + "\n").unwrap();
        path.to_str().unwrap().to_string()
    }

    fn sym(i: usize) -> String {
        format!("T{:02}", i)
    }

    /// 60 daily candles with a gentle downtrend + oscillation: enough shape
    /// for max-drop bands, non-zero Sharpe, and mid-range percentiles.
    fn fixture_candles(symbol: &str, seed_day: u32) -> Vec<model::Candle> {
        (0..60)
            .map(|d| {
                let t = d as f64;
                let close = 100.0 - 0.15 * t + 2.0 * (t * 0.7).sin() + f64::from(seed_day % 5);
                let open = close - 0.3;
                model::Candle {
                    symbol: symbol.to_string(),
                    open,
                    high: close + 0.8,
                    low: open - 0.8,
                    close,
                    volume: 1_000_000,
                    timestamp: 1_700_000_000u32 + seed_day * 60 + d as u32 * 86_400,
                }
            })
            .collect()
    }

    fn seed_fixture_candles(conn: &mut Connection, symbols: &[String]) {
        candle::create_table(conn).unwrap();
        let rows: Vec<model::Candle> = symbols
            .iter()
            .enumerate()
            .flat_map(|(i, s)| fixture_candles(s, i as u32))
            .collect();
        candle::save_candles(conn, &rows).unwrap();
    }

    fn stage_report<'a>(stages: &'a [StageReport], s: Stage) -> &'a StageReport {
        stages.iter().find(|r| r.stage == s).unwrap()
    }

    fn batches(events: &[PipelineEvent], s: Stage) -> Vec<(usize, usize)> {
        events
            .iter()
            .filter_map(|ev| match ev {
                PipelineEvent::BatchDone { stage, done, total } if *stage == s => {
                    Some((*done, *total))
                }
                _ => None,
            })
            .collect()
    }

    fn pair_count(events: &[PipelineEvent]) -> usize {
        events
            .iter()
            .filter(|ev| matches!(ev, PipelineEvent::StageStarted(_)))
            .count()
    }

    // ── the seam scenarios ─────────────────────────────────────

    /// Requester-init failure is the sole fatal outer error; stages collected
    /// before it are dropped (matching the shipped perform_all semantics).
    #[tokio::test(start_paused = true)]
    async fn fatal_when_requester_init_fails() {
        let dir = tempfile::tempdir().unwrap();
        let path = write_symbols_file(dir.path(), &[sym(1)]);

        let mut conn = Connection::open_in_memory().unwrap();
        let (progress, events) = captured_reporter();

        let result = run(&mut conn, &path, none_factory(), progress.clone()).await;

        let err = match result {
            Ok(_) => panic!("requester-init failure must be fatal"),
            Err(e) => e,
        };
        assert!(
            err.to_string().contains("Failed to initialize Tiger API requester"),
            "unexpected error: {err}"
        );
        // Two pairs emitted before the fatal step (quotes failed on its own
        // init, metrics ok over an empty DB); nothing after.
        assert_eq!(pair_count(&events.lock().unwrap()), 2);
    }

    /// All API batches fail offline: quotes fails fast (barrels on), both
    /// chain stages resolve to Failed with exact failed-symbol text, and the
    /// batch done/total arithmetic is correct everywhere.
    #[tokio::test(start_paused = true)]
    async fn all_batches_fail_but_pipeline_barrels_on() {
        let symbols: Vec<String> = (1..=23).map(sym).collect(); // 3 batches
        let dir = tempfile::tempdir().unwrap();
        let path = write_symbols_file(dir.path(), &symbols);

        let mut conn = Connection::open_in_memory().unwrap();
        seed_fixture_candles(&mut conn, &symbols);
        let (progress, events) = captured_reporter();

        let outcome = match run(&mut conn, &path, stub_factory(), progress.clone()).await {
            Ok(outcome) => outcome,
            Err(e) => panic!("pipeline should barrel on, got: {e}"),
        };

        // Stage statuses.
        assert_eq!(stage_report(&outcome.stages, Stage::Quotes).status, StageStatus::Failed);
        assert_eq!(stage_report(&outcome.stages, Stage::Metrics).status, StageStatus::Ok);
        for tf in [Stage::ChainsShort, Stage::ChainsMedium] {
            let rep = stage_report(&outcome.stages, tf);
            assert_eq!(rep.status, StageStatus::Failed, "{tf:?}");
            let text = rep.error.as_deref().unwrap();
            assert!(text.starts_with("23 symbol(s) failed: T01"), "{text}");
            assert!(text.ends_with("T23"), "{text}");
        }

        // Exact coverage from a fail-fast first batch.
        assert_eq!(outcome.symbols_requested, 23);
        assert_eq!(outcome.symbols_succeeded, 0);

        // Scored outputs still produced (webapp path), empty but valid.
        let short = outcome.short.unwrap();
        assert_eq!(short.period, 5);
        assert_eq!(short.row_count, 0);
        assert_eq!(short.symbols_with_chains, 0);
        assert!(short.top_picks.is_empty());
        assert!(!short.csv.is_empty());
        assert_eq!(outcome.medium.as_ref().unwrap().period, 20);

        // Batch arithmetic: quotes aborts after batch 1; chains run all 3.
        assert_eq!(batches(&events.lock().unwrap(), Stage::Quotes), vec![(1, 3)]);
        assert_eq!(
            batches(&events.lock().unwrap(), Stage::ChainsShort),
            vec![(1, 3), (2, 3), (3, 3)]
        );
        assert_eq!(
            batches(&events.lock().unwrap(), Stage::ChainsMedium),
            vec![(1, 3), (2, 3), (3, 3)]
        );

        // Four started/finished pairs total.
        assert_eq!(pair_count(&events.lock().unwrap()), 4);
    }

    /// An all-blank universe hits `EmptySymbolFile` in every stage (each
    /// stage reads the symbols file); the pipeline records all four as
    /// failed and still runs to completion. Pins that barrel-on edge case.
    #[tokio::test(start_paused = true)]
    async fn blank_universe_fails_every_stage_but_completes() {
        let dir = tempfile::tempdir().unwrap();
        let path = write_symbols_file(dir.path(), &["".to_string()]);

        let mut conn = Connection::open_in_memory().unwrap();
        let (progress, events) = captured_reporter();

        // Every stage reads the symbols file → EmptySymbolFile in all four;
        // the pipeline still records and completes (barrel-on edge case).
        let outcome = match run(&mut conn, &path, stub_factory(), progress.clone()).await {
            Ok(outcome) => outcome,
            Err(e) => panic!("blank universe must barrel on, got: {e}"),
        };

        for s in [Stage::Quotes, Stage::Metrics, Stage::ChainsShort, Stage::ChainsMedium] {
            let rep = stage_report(&outcome.stages, s);
            assert_eq!(rep.status, StageStatus::Failed, "{s:?}");
            assert!(
                rep.error.as_deref().unwrap().contains("EmptySymbolFile"),
                "{s:?}"
            );
        }
        assert_eq!(outcome.symbols_requested, 0);
        assert_eq!(outcome.symbols_succeeded, 0);
        assert!(batches(&events.lock().unwrap(), Stage::Quotes).is_empty());
        assert_eq!(pair_count(&events.lock().unwrap()), 4);
        assert!(outcome.short.is_none());
        assert!(outcome.medium.is_none());
    }

    /// Status resolution grid, including the partial mix unreachable
    /// end-to-end offline (some batches succeed, some fail).
    #[test]
    fn chain_status_resolution_grid() {
        let mk = |failed: Vec<&str>, rows: usize| -> (Vec<String>, usize) {
            (failed.into_iter().map(String::from).collect(), rows)
        };

        // No failures → Ok.
        let (f, rows) = mk(vec![], 10);
        let r = resolve_chain_status(&probe(f, rows));
        assert_eq!(r.0, StageStatus::Ok);
        assert!(r.1.is_none());

        // Partial: failures and rows coexist.
        let (f, rows) = mk(vec!["XYZ", "QQQ"], 140);
        let (st, err) = resolve_chain_status(&probe(f, rows));
        assert_eq!(st, StageStatus::Partial);
        assert_eq!(err.unwrap(), "2 symbol(s) failed: XYZ, QQQ");

        // Total: failures with zero produced rows.
        let (f, rows) = mk(vec!["XYZ"], 0);
        let (st, err) = resolve_chain_status(&probe(f, rows));
        assert_eq!(st, StageStatus::Failed);
        assert_eq!(err.unwrap(), "1 symbol(s) failed: XYZ");
    }

    fn probe(failed: Vec<String>, rows: usize) -> RetrievedData {
        let chains: Vec<model::OptionStrikeCandle> = std::iter::repeat_with(|| model::OptionStrikeCandle {
            underlying: "SPY".to_string(),
            ..probe_chain_stub()
        })
        .take(rows)
        .collect();
        RetrievedData {
            row_count: rows,
            symbols_with_chains: usize::from(rows > 0),
            api_failed_symbols: failed,
            all_chains: chains,
            sharpe_ratios: HashMap::new(),
            price_ranges: HashMap::new(),
            price_percentiles: HashMap::new(),
            trend_data: HashMap::new(),
            realized_vols: HashMap::new(),
            earnings_map: HashMap::new(),
            period: 5,
        }
    }

    fn probe_chain_stub() -> model::OptionStrikeCandle {
        model::OptionStrikeCandle {
            underlying: "SPY".to_string(),
            strike: 95.0,
            underlying_price: 100.0,
            side: model::OptionChainSide::Put,
            bid: 1.0,
            mid: 1.2,
            ask: 1.4,
            bid_size: 10,
            ask_size: 10,
            last: 1.2,
            expiration: "2026-09-04".to_string(),
            updated: String::new(),
            dte: 5,
            volume: 100,
            open_interest: 500,
            rate_of_return: 0.30,
            strike_from: 90.0,
            strike_to: 96.0,
            implied_vol: None,
            delta: Some(-0.2),
        }
    }

    /// Fixture realism: seeded candles drive the real metrics pass and the
    /// collectors to finite, in-band values (the scoring inputs later
    /// tickets reuse).
    #[test]
    fn fixtures_drive_metric_collectors() {
        let symbols: Vec<String> = (1..=3).map(sym).collect();
        let dir = tempfile::tempdir().unwrap();
        let path = write_symbols_file(dir.path(), &symbols);

        let mut conn = Connection::open_in_memory().unwrap();
        seed_fixture_candles(&mut conn, &symbols);

        // The same pure-DB pass the pipeline runs — populates max-drop /
        // sharpe / trend / percentile tables from the fixture candles.
        crate::metrics::run_all(&path, &mut conn).unwrap();

        let (sharpe, ranges, pctl, _trend, vols) =
            crate::option::collect_metrics_from_db(&conn, &symbols);

        for s in &symbols {
            let sh = sharpe[s];
            assert!(sh.is_finite() && sh != 0.0, "sharpe {s}={sh}");
            let range = &ranges[s];
            assert!(range.min <= range.max);
            let p = pctl[s];
            assert!((0.0..=1.0).contains(&p), "percentile {s}={p}");
            assert!(*vols.get(s).unwrap() > 0.0);
        }
    }
}
