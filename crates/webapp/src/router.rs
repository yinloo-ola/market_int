//! Router assembly — the parallel-workstream seam (tickets 16/17/18).
//!
//! Tickets fill the slots; they don't reinvent the wiring:
//! - t17 owns `auth::protect` (middleware wrapping every /api route)
//! - t18 owns `run::{progress,run}` handlers + the single-flight SharedState
//! - t16 stays inside the frontend modules entirely

use std::path::PathBuf;

use axum::extract::Request;
use axum::http::{header::HeaderName, header::HeaderValue};
use axum::middleware::{self, Next};
use axum::response::Response;
use axum::routing::{get, post};
use axum::Router;

use crate::{api, assets, auth, run};

/// Google's OAuth pages and the `firebaseapp.com` auth handler send their own
/// `Cross-Origin-Opener-Policy: same-origin`, which cuts the sign-in popup off
/// from this page — `window.close` is refused and `signInWithPopup` never
/// settles ("stuck at Working…"). Serving our side with
/// `same-origin-allow-popups` keeps the popup↔opener channel open while
/// retaining the rest of COOP's isolation.
async fn coop_header(req: Request, next: Next) -> Response {
    let mut res = next.run(req).await;
    res.headers_mut().insert(
        HeaderName::from_static("cross-origin-opener-policy"),
        HeaderValue::from_static("same-origin-allow-popups"),
    );
    res
}

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
///
/// Ticket 22: the allowlist sources (static env list + live grant file) ride
/// along so the /api/grants endpoints can surface and rewrite the grant file.
pub fn app_router(
    result_path: PathBuf,
    auth_guard: Option<auth::AuthGuard>,
    access: auth::AccessConfig,
) -> Router {
    let shared = run::SharedState::new();

    // Holdings ledgers live beside the result document: /data/webapp/holdings
    // in production (both under the durable GCS FUSE mount).
    let holdings_dir = result_path
        .parent()
        .map(|p| p.join("holdings"))
        .unwrap_or_else(|| PathBuf::from("holdings"));

    let run_router: Router<()> = Router::new()
        .route("/api/progress", get(run::progress))
        .route("/api/run", post(run::run))
        .with_state(run::RunAppState::new(result_path.clone(), shared.clone()));

    let api = api::build_router(api::AppState {
        result_path: result_path.clone(),
        holdings_dir,
        mark_fetcher: crate::holdings::live_fetcher(),
        shared,
        access: access.clone(),
        clock: run::real_now,
    })
    .merge(run_router);

    let api = auth::protect(api, auth_guard);

    assets::router_with_assets(api).layer(middleware::from_fn(coop_header))
}
