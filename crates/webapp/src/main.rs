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
const DEFAULT_RESULT_PATH: &str = "/data/webapp/last_run.json";
const BIND_ADDR: &str = "127.0.0.1:8080";

/// Precedence: `--result-file <path>` arg → `${RESULT_FILE_ENV}` → default.
fn result_path() -> PathBuf {
    dotenv::from_filename(".env").ok(); // local dev convenience; no-op in prod

    let mut args = std::env::args().skip(1);
    while let Some(arg) = args.next() {
        if arg == "--result-file" {
            if let Some(v) = args.next() {
                log::info!("result file: {v} (from --result-file)");
                return PathBuf::from(v);
            }
        }
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

#[tokio::main]
async fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    let router = router::app_router(result_path());

    log::info!("market_int_webapp listening on http://{BIND_ADDR}");
    let listener = tokio::net::TcpListener::bind(BIND_ADDR)
        .await
        .expect("bind 8080");
    axum::serve(listener, router).await.expect("server");
}
