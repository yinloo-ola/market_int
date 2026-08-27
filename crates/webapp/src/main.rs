//! market_int webapp server (ticket 15 tracer bullet).
//!
//! Boots an axum server that serves the embedded frontend and `GET /api/latest`
//! over the result file. Run endpoints arrive with ticket 18; auth with 17.

mod api;
mod assets;
mod auth;
// Builders are exercised by unit tests now and consumed by the run handler
// in ticket 18 — keep them visible to rustdoc meanwhile.
#[allow(dead_code)]
mod result;
mod router;

use std::path::PathBuf;

/// Env override for the result file; default is the frozen production path
/// (spec §2.5). Local dev points it at a fixture or scratch location.
const RESULT_FILE_ENV: &str = "webapp_result_file";
/// Public Firebase project id; arming auth is exactly "this is set".
const FIREBASE_PROJECT_ID_ENV: &str = "FIREBASE_PROJECT_ID";
const DEFAULT_RESULT_PATH: &str = "/data/webapp/last_run.json";
const BIND_ADDR: &str = "127.0.0.1:8080";

/// Value following `flag` in argv, if present.
fn first_flag_value(flag: &str) -> Option<String> {
    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        if arg == flag {
            if let Some(v) = args.next() {
                return Some(v);
            }
        }
    }
    None
}

/// Precedence: `--result-file <path>` arg → `${RESULT_FILE_ENV}` → default.
fn result_path() -> PathBuf {
    if let Some(v) = first_flag_value("--result-file") {
        log::info!("result file: {v} (from --result-file)");
        return PathBuf::from(v);
    }

    match std::env::var(RESULT_FILE_ENV) {
        Ok(v) if !v.trim().is_empty() => {
            log::info!("result file: {v} (from ${RESULT_FILE_ENV})");
            PathBuf::from(v)
        }
        _ => {
            log::info!("result file: {DEFAULT_RESULT_PATH} (default)");
            PathBuf::from(DEFAULT_RESULT_PATH)
        }
    }
}

/// Precedence mirror of `result_path`: `--firebase-project-id <id>` arg →
/// `${FIREBASE_PROJECT_ID}` env → None (auth stays disabled).
fn firebase_project_id() -> Option<String> {
    if let Some(v) = first_flag_value("--firebase-project-id") {
        log::info!("firebase project id: {v} (from --firebase-project-id)");
        return Some(v);
    }

    match std::env::var(FIREBASE_PROJECT_ID_ENV) {
        Ok(v) if !v.trim().is_empty() => {
            log::info!("firebase project id: {v} (from ${FIREBASE_PROJECT_ID_ENV})");
            Some(v)
        }
        _ => None,
    }
}

#[tokio::main]
async fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    dotenv::from_filename(".env").ok(); // local dev convenience; no-op in prod

    // Auth arms ONLY with a project id; otherwise passthrough so parallel
    // tickets (16/18) and offline dev keep working.
    let auth_guard = match firebase_project_id() {
        Some(project_id) => {
            log::info!("auth: ARMED — /api routes require a Firebase Bearer token");
            Some(auth::AuthGuard::from_project_id(&project_id).await)
        }
        None => {
            log::warn!(
                "auth: DISABLED (${FIREBASE_PROJECT_ID_ENV} unset, no \
                 --firebase-project-id flag) — every /api route is OPEN"
            );
            None
        }
    };

    let router = router::app_router(result_path(), auth_guard);

    log::info!("market_int_webapp listening on http://{BIND_ADDR}");
    let listener = tokio::net::TcpListener::bind(BIND_ADDR)
        .await
        .expect("bind 8080");
    axum::serve(listener, router).await.expect("server");
}
