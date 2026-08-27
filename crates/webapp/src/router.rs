//! Router assembly — the parallel-workstream seam (tickets 16/17/18).
//!
//! Tickets fill the slots; they don't reinvent the wiring:
//! - t17 owns `auth::protect` (middleware wrapping every /api route)
//! - t18 owns `run::{progress,run}` handlers replacing the stubs
//! - t16 stays inside the frontend modules entirely

use axum::routing::{get, post};
use axum::Router;

use crate::{api, assets, auth};

/// Assembles the full application router from its parts.
///
/// Signature note (t17): gained `auth_guard` — `None` (no project id
/// configured) keeps `auth::protect` an identity passthrough; `Some(…)`
/// arms Firebase ID-token verification over every /api route while static
/// assets stay public.
pub fn app_router(
    result_path: std::path::PathBuf,
    auth_guard: Option<auth::AuthGuard>,
) -> Router {
    let api = api::build_router(api::AppState {
        result_path: result_path.clone(),
    })
    .route("/api/me", get(api::me))
    // Ticket 18 replaces these two stubs with real handlers.
    .route("/api/progress", get(run::progress))
    .route("/api/run", post(run::run));

    let api = auth::protect(api, auth_guard);

    assets::router_with_assets(api)
}

// ── ticket-18 stubs (defined here so routing compiles pre-t18) ──
/// Ticket-18 stubs, defined here so routing compiles before t18 lands.
pub(crate) mod run {
    use axum::http::StatusCode;
    use axum::response::IntoResponse;
    use axum::Json;

    pub(crate) async fn progress() -> impl IntoResponse {
        Json(serde_json::json!({ "status": "idle" }))
    }

    pub(crate) async fn run() -> impl IntoResponse {
        (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(serde_json::json!({ "status": "unavailable" })),
        )
    }
}
