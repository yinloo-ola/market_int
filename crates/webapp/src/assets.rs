//! Static assets from the vite build.
//!
//! Embedding split by build profile (spec §6.1):
//! - **release**: the three stable vite artifacts are compiled into the
//!   binary via `include_str!`/`include_bytes!` — one artifact serves
//!   everything, with zero filesystem or gitignore sensitivity at runtime.
//! - **debug**: files are read from disk at request time (manifest-relative),
//!   so frontend edits live-reload without touching Rust, and a fresh clone
//!   compiles before ever running npm.
//!
//! Why includes instead of rust-embed: its directory walker honors
//! `.gitignore`, which silently emptied the embed set (ticket 15 find). The
//! vite config pins unhashed names (`assets/app.js|css`) + inlines all other
//! assets into them, honoring §6.1's ≤10-file embedded budget.

use axum::extract::Request;
use axum::http::{header, StatusCode};
use axum::response::{Html, IntoResponse, Response};
use axum::routing::get;
use axum::Router;

#[cfg(not(debug_assertions))]
mod embedded {
    /// Compiled-in copies; any drift breaks the build at compile time.
    pub const INDEX_HTML: &str = include_str!("../frontend/dist/index.html");
    pub const APP_JS: &[u8] = include_bytes!("../frontend/dist/assets/app.js");
    pub const APP_CSS: &[u8] = include_bytes!("../frontend/dist/assets/app.css");
}

/// Debug: read from dist on disk (manifest-relative) for live-reload.
#[cfg(debug_assertions)]
fn lookup(key: &str) -> Option<Vec<u8>> {
    let root = concat!(env!("CARGO_MANIFEST_DIR"), "/frontend/dist/");
    std::fs::read(format!("{root}{key}")).ok()
}

/// Release: serve the compiled-in copies.
#[cfg(not(debug_assertions))]
fn lookup(key: &str) -> Option<Vec<u8>> {
    match key {
        "index.html" => Some(embedded::INDEX_HTML.as_bytes().to_vec()),
        "assets/app.js" => Some(embedded::APP_JS.to_vec()),
        "assets/app.css" => Some(embedded::APP_CSS.to_vec()),
        _ => None,
    }
}

const NOT_BUILT_PAGE: &str = "<!doctype html><meta charset='utf-8'>\
<body style=\"font-family:sans-serif;padding:2rem\">\
<h3>market_int webapp</h3>\
<p>Frontend not built yet. From <code>crates/webapp/frontend</code> run \
<code>npm install && npm run build</code>, then reload.\
(API is live at <code>/api/latest</code>.)</p></body>";

fn content_type(name: &str) -> &'static str {
    match name.rsplit('.').next().unwrap_or("") {
        "html" => "text/html; charset=utf-8",
        "js" | "mjs" => "text/javascript; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "json" => "application/json",
        "svg" => "image/svg+xml",
        "png" => "image/png",
        "ico" => "image/x-icon",
        "woff2" => "font/woff2",
        _ => "application/octet-stream",
    }
}

/// Serves an asset; unknown paths fall back to index.html (one-page app —
/// deep links render). Static routes are public and auth-free (§3.2).
fn serve_asset(path: &str) -> Response {
    let candidate = path.trim_start_matches('/');
    let mut keys: Vec<String> = Vec::new();
    if candidate.is_empty() {
        keys.push("index.html".to_string());
    } else {
        keys.push(candidate.to_string());
        if !candidate.contains("assets/") {
            keys.push("index.html".to_string()); // SPA deep-link fallback
        }
    }

    for key in &keys {
        if let Some(body) = lookup(key) {
            let mut resp = if key.ends_with(".html") {
                Html(String::from_utf8_lossy(&body).into_owned()).into_response()
            } else {
                (
                    StatusCode::OK,
                    [(header::CONTENT_TYPE, content_type(key))],
                    body,
                )
                    .into_response()
            };
            resp.headers_mut().insert(
                header::CACHE_CONTROL,
                header::HeaderValue::from_static("no-cache"),
            );
            return resp;
        }
    }

    // dist missing entirely (pre-npm debug): helpful page instead of empty.
    Html(NOT_BUILT_PAGE).into_response()
}

async fn index() -> Response {
    serve_asset("/")
}

/// Fallback takes the raw request so multi-segment paths extract cleanly.
async fn asset_fallback(req: Request) -> Response {
    let path = req.uri().path().to_string();
    serve_asset(&path)
}

/// Merges static serving onto the API router.
pub fn router_with_assets(api_router: Router) -> Router {
    api_router
        .route("/", get(index))
        .fallback(get(asset_fallback))
}
