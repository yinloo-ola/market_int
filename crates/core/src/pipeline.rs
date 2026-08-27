//! Shared perform-all orchestration (spec §2.2): one pipeline for the CLI's
//! Telegram path and the webapp's no-publish path.
//!
//! Mirrors the original PerformAll arm exactly: quotes → metrics →
//! requester-init → chains-short → chains-medium. Every stage failure is
//! recorded as a [`StageReport`] and the run barrels on; the only fatal outer
//! error is requester-initialization failure.

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
}

/// One timeframe's scored output — the CSV is byte-identical to the Telegram
/// attachment (same `option_chain_to_csv_vec` call).
pub struct ScoredTimeframe {
    /// 5 (Short) or 20 (Medium).
    pub period: usize,
    pub csv: Vec<u8>,
    pub top_picks: Vec<model::TopPick>,
}

/// Outcome of one pipeline stage. `Err` = logged, run continued (barrel-on).
pub struct StageReport {
    pub stage: Stage,
    pub outcome: Result<(), model::QuotesError>,
}

pub struct PerformAllOutcome {
    /// Execution order; always populated up to the fatal point.
    pub stages: Vec<StageReport>,
    /// `None` when that stage failed or a publish hook consumed the output.
    pub short: Option<ScoredTimeframe>,
    /// Same contract as `short`.
    pub medium: Option<ScoredTimeframe>,
}

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
            }))
        }
    }
}

fn record_stage(
    stages: &mut Vec<StageReport>,
    stage: Stage,
    outcome: Result<(), model::QuotesError>,
) {
    if let Err(err) = &outcome {
        // debug: the caller already logs stage failures with historical wording;
        // this is the structured-report breadcrumb only.
        log::debug!("pipeline stage {} failed: {}", stage.as_str(), err);
    }
    stages.push(StageReport { stage, outcome });
}

/// One chains stage: retrieve (+persist), then publish-or-score. Retrieval OR
/// scoring/publishing failures are equivalent from here down — both logged
/// with the arm's historical wording and reported for the stage (the run
/// continues into the next timeframe either way).
async fn run_chains_stage(
    conn: &mut Connection,
    requester: &mut Requester,
    symbols_file_path: &str,
    stage: Stage,
    hook: Option<&Arc<dyn PublishHook>>,
    regime: &MarketRegime,
    sectors_map: &HashMap<String, String>,
    stages: &mut Vec<StageReport>,
) -> Option<ScoredTimeframe> {
    let timeframe = match stage {
        Stage::ChainsShort => ExpiryTimeframe::Short,
        Stage::ChainsMedium => ExpiryTimeframe::Medium,
        other => unreachable!("run_chains_stage called with non-chain stage {:?}", other),
    };
    let day_label = stage.day_label();
    let err_prefix = format!("Error pulling {} option chains", day_label);
    let retrieved = match option::retrieve_option_chains(
        symbols_file_path,
        &model::OptionChainSide::Put,
        conn,
        timeframe,
        requester,
    )
    .await
    {
        Ok(retrieved) => retrieved,
        Err(err) => {
            log::error!("{}: {}", err_prefix, err);
            record_stage(stages, stage, Err(err));
            return None;
        }
    };

    match publish_or_score(hook, &retrieved, regime, sectors_map).await {
        Ok(scored) => {
            log::info!("Successfully pulled and saved {} option chains", day_label);
            record_stage(stages, stage, Ok(()));
            scored
        }
        Err(err) => {
            log::error!("{}: {}", err_prefix, err);
            record_stage(stages, stage, Err(err));
            None
        }
    }
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
    let mut stages: Vec<StageReport> = Vec::new();

    // Quotes stage — barrel on Err onto the stale DB, exactly as the arm did.
    let quotes_outcome = match crate::quotes::pull_and_save(symbols_file_path, conn).await {
        Ok(()) => {
            log::info!("Successfully pulled and saved quotes");
            Ok(())
        }
        Err(err) => {
            log::error!("Error pulling and saving quotes: {}", err);
            Err(err)
        }
    };
    record_stage(&mut stages, Stage::Quotes, quotes_outcome);

    // Metrics stage — fast pure-DB math, no batches yet (progress arrives with ticket 13).
    let metrics_outcome = match crate::metrics::run_all(symbols_file_path, conn) {
        Ok(()) => {
            log::info!("Successfully completed metric calculation pipeline");
            Ok(())
        }
        Err(err) => {
            log::error!("Error running metric pipeline: {}", err);
            Err(err)
        }
    };
    record_stage(&mut stages, Stage::Metrics, metrics_outcome);

    // Requester init — the single fatal step: outer Err reserved for this alone.
    let mut requester = match Requester::new().await {
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

    let hook = opts.publish;
    let hook_ref = hook.as_ref();

    let short = run_chains_stage(
        conn,
        &mut requester,
        symbols_file_path,
        Stage::ChainsShort,
        hook_ref,
        &regime,
        &sectors_map,
        &mut stages,
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
    )
    .await;

    Ok(PerformAllOutcome {
        stages,
        short,
        medium,
    })
}
