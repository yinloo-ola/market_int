//! Router assembly — the parallel-workstream seam (tickets 16/17/18).
//!
//! Tickets fill the slots; they don't reinvent the wiring:
//! - t17 owns `auth::protect` (middleware wrapping every /api route)
//! - t18 owns `run::{progress,run}` handlers + the single-flight SharedState
//! - t16 stays inside the frontend modules entirely

use std::path::PathBuf;

use axum::routing::{get, post};
use axum::Router;

use crate::{api, assets, auth, run};

/// Assembles the full application router from its parts.
///
/// Signature note (t17): gained `auth_guard` — `None` (no project id
/// configured) keeps `auth::protect` an identity passthrough; `Some(…)`
/// arms Firebase ID-token verification over every /api route while static
/// assets stay public.
///
/// Ticket 18: the run endpoints carry their own state (`RunAppState`, which
/// wraps the single-flight `SharedState`); that router merges onto the
/// `/api/latest` router BEFORE the auth wrapper so the middleware covers both.
pub fn app_router(result_path: PathBuf, auth_guard: Option<auth::AuthGuard>) -> Router {
    let shared = run::SharedState::new();

    let run_router: Router<()> = Router::new()
        .route("/api/progress", get(run::progress))
        .route("/api/run", post(run::run))
        .with_state(run::RunAppState::new(result_path.clone(), shared.clone()));

    let api = api::build_router(api::AppState {
        result_path: result_path.clone(),
        shared,
    })
    .route("/api/me", get(api::me))
    .merge(run_router);

    let api = auth::protect(api, auth_guard);

    assets::router_with_assets(api)
}
