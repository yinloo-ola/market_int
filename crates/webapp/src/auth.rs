//! Firebase ID-token verification seam (ticket 17 owns the internals).
//!
//! `protect` wraps every /api route. Until a project id is configured and t17
//! lands, it is an identity passthrough so t16/t18 streams stay testable.

use axum::Router;

/// Wraps every /api route. Ticket 17 replaces this body with Firebase
/// ID-token verification (middleware armed when a project id is configured).
pub fn protect(router: Router) -> Router {
    router
}
