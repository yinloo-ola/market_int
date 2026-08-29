//! market_int webapp server.
//!
//! Boots an axum server serving the embedded frontend, `GET /api/latest` over
//! the result file, and (ticket 18) the run endpoints `POST /api/run` +
//! `GET /api/progress` with live SSE progress.

mod api;
mod assets;
mod auth;
mod market;
mod result;
mod router;
mod run;

use std::path::PathBuf;

/// Env override for the result file; default is the frozen production path
/// (spec §2.5). Local dev points it at a fixture or scratch location.
const RESULT_FILE_ENV: &str = "webapp_result_file";
/// Public Firebase project id; arming auth is exactly "this is set".
const FIREBASE_PROJECT_ID_ENV: &str = "FIREBASE_PROJECT_ID";
/// Comma-separated email allowlist; set = only these identities may use the
/// API (owner-controlled access, ticket 22). Unset = any verified identity.
const ALLOWED_EMAILS_ENV: &str = "WEBAPP_ALLOWED_EMAILS";
/// Live grant file (one email per line, `#` comments): re-read per request,
/// so grants/revoke take effect without a restart or redeploy. In production
/// point it at the GCS FUSE volume (e.g. /data/allowed_emails.txt).
const ALLOWED_EMAILS_FILE_ENV: &str = "WEBAPP_ALLOWED_EMAILS_FILE";
const DEFAULT_RESULT_PATH: &str = "/data/webapp/last_run.json";
/// Cloud Run (spec §7/§8) requires binding 0.0.0.0 so the platform port
/// mapping reaches the server; local dev narrows back via `webapp_bind`.
const DEFAULT_BIND_ADDR: &str = "0.0.0.0:8080";
const BIND_ENV: &str = "webapp_bind";

/// Lowercased, trimmed allowlist; `None` when unset or empty (fail-open to
/// "any verified identity", mirroring the auth-optional precedent — set the
/// env in production to fail closed).
fn parse_allowed_emails(raw: &str) -> Option<Vec<String>> {
    let list: Vec<String> = raw
        .split([',', ';', ' '])
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .map(str::to_lowercase)
        .collect();
    (!list.is_empty()).then_some(list)
}

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
fn bind_addr() -> String {
    match std::env::var(BIND_ENV) {
        Ok(v) if !v.trim().is_empty() => {
            log::info!("bind address: {v} (from ${BIND_ENV})");
            v
        }
        _ => {
            log::info!("bind address: {DEFAULT_BIND_ADDR} (default)");
            DEFAULT_BIND_ADDR.to_string()
        }
    }
}

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
    let allowed = std::env::var(ALLOWED_EMAILS_ENV)
        .ok()
        .and_then(|v| parse_allowed_emails(&v));
    let allowlist_file = std::env::var(ALLOWED_EMAILS_FILE_ENV)
        .ok()
        .map(PathBuf::from)
        .filter(|p| !p.as_os_str().is_empty());
    match &allowed {
        Some(list) => log::info!(
            "auth: allowlist active — {} static address(es) may use the API",
            list.len()
        ),
        None => log::warn!(
            "auth: no static allowlist (${ALLOWED_EMAILS_ENV} unset) — any verified \
             identity may use the API"
        ),
    }
    if let Some(path) = &allowlist_file {
        log::info!(
            "auth: live grant file ${ALLOWED_EMAILS_FILE_ENV} = {} (re-read per request)",
            path.display()
        );
    }
    let auth_guard = match firebase_project_id() {
        Some(project_id) => {
            log::info!("auth: ARMED — /api routes require a Firebase Bearer token");
            Some(auth::AuthGuard::from_project_id(&project_id, allowed, allowlist_file).await)
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

    let bind_addr = bind_addr();
    log::info!("market_int_webapp listening on http://{bind_addr}");
    let listener = tokio::net::TcpListener::bind(&bind_addr)
        .await
        .unwrap_or_else(|e| panic!("bind {bind_addr}: {e}"));
    axum::serve(listener, router).await.expect("server");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allowlist_parsing_trims_splits_lowercases() {
        let parsed = parse_allowed_emails(" A@B.com , c@d.com;;  e@f.com ").unwrap();
        assert_eq!(parsed, vec!["a@b.com", "c@d.com", "e@f.com"]);
    }

    #[test]
    fn allowlist_parsing_empty_or_blank_is_none() {
        assert!(parse_allowed_emails("").is_none());
        assert!(parse_allowed_emails("  ,  ,, ").is_none());
    }
}
