//! Firebase ID-token gate over every /api route (ticket 17).
//!
//! Armed ONLY when a Firebase project id is configured (`--firebase-project-id`
//! arg or `FIREBASE_PROJECT_ID` env — see main.rs). Armed, every request must
//! carry `Authorization: Bearer <Firebase ID token>`; missing / malformed /
//! unverifiable tokens get `401 application/json {"error":"unauthorized"}`,
//! and the verified identity is inserted into request extensions as
//! [`VerifiedIdentity`] for handlers (`GET /api/me` surfaces it).
//! Unconfigured, the middleware stays an identity passthrough with one
//! startup warn! so parallel workstreams (t16/t18) keep working offline.
//!
//! Static asset routes are never touched (§3.2/§6.2): `protect` runs before
//! `assets::router_with_assets` merges them on, see router.rs.
//!
//! Token verification delegates to the `firebase-auth` crate (ticket 06
//! resolution): RS256 against Google's JWKS, keys fetched at construction and
//! auto-refreshed on Google's `Cache-Control` schedule, requiring only the
//! public project id at runtime. The verifier sits behind a private trait so
//! the whole enforcement pipeline (header parsing, structural JWT checks,
//! identity injection, 401 body) is unit-tested offline with stubs. Live
//! verification with a real token needs a provisioned Firebase project — that
//! part is a provisioning-checklist item (crates/webapp/README.md), stated
//! honestly rather than faked here.
//!
//! Note: `FirebaseAuth::new` fetches the JWKS eagerly (network at boot when
//! armed; it panics if Google is unreachable) and starts its own refresh loop.
//! It also honors `FIREBASE_AUTH_EMULATOR_HOST` by accepting unsigned tokens —
//! a dev-only convenience that MUST NOT be set in production.

use std::sync::Arc;

use axum::extract::{Request, State};
use axum::http::header::AUTHORIZATION;
use axum::http::StatusCode;
use axum::middleware::{self, Next};
use axum::response::{IntoResponse, Response};
use axum::{Json, Router};
use firebase_auth::FirebaseAuth;
use serde::Serialize;

/// Identity of a caller whose Firebase ID token was verified. Inserted into
/// request extensions by the armed middleware; `/api/me` surfaces it.
#[derive(Debug, Clone, Serialize)]
pub struct VerifiedIdentity {
    pub uid: String,
    pub email: Option<String>,
}

/// Seam that lets unit tests drive the full middleware offline.
trait IdTokenVerifier: Send + Sync {
    /// `None` ⇒ not trusted (bad signature, wrong audience, expired, …).
    fn verify(&self, bearer_token: &str) -> Option<VerifiedIdentity>;
}

/// Production verifier backed by the firebase-auth crate.
struct FirebaseVerifier {
    auth: FirebaseAuth,
}

impl IdTokenVerifier for FirebaseVerifier {
    fn verify(&self, bearer_token: &str) -> Option<VerifiedIdentity> {
        let user = self.auth.verify::<firebase_auth::FirebaseUser>(bearer_token).ok()?;
        Some(VerifiedIdentity {
            uid: if user.sub.is_empty() { user.user_id } else { user.sub },
            email: user.email.filter(|e| !e.is_empty()),
        })
    }
}

/// Everything [`protect`] needs to arm itself. Cheap to clone (Arc inside).
#[derive(Clone)]
pub struct AuthGuard {
    verifier: Arc<dyn IdTokenVerifier>,
}

impl AuthGuard {
    /// Fetches Google's public JWKS (network!) and arms the crate's refresh
    /// loop — call once at startup, from main.
    pub async fn from_project_id(project_id: &str) -> Self {
        Self {
            verifier: Arc::new(FirebaseVerifier {
                auth: FirebaseAuth::new(project_id).await,
            }),
        }
    }
}

/// Wraps every /api route. `None` keeps the identity passthrough (auth
/// disabled); `Some(guard)` enforces Bearer verification on all of them.
///
/// Signature note (t17): gained the `Option<AuthGuard>` parameter. The guard
/// also threads into the middleware via `from_fn_with_state`, so no handler
/// signature changes anywhere.
pub fn protect(router: Router, guard: Option<AuthGuard>) -> Router {
    match guard {
        Some(guard) => router.layer(middleware::from_fn_with_state(guard, enforce)),
        None => router,
    }
}

async fn enforce(State(guard): State<AuthGuard>, mut req: Request, next: Next) -> Response {
    match authorize(&guard, &req) {
        Some(identity) => {
            req.extensions_mut().insert(identity);
            next.run(req).await
        }
        None => unauthorized(),
    }
}

/// 401 with the frozen JSON body — same shape for "no header", "garbage" and
/// "signature did not verify", so responses leak nothing about why (§3.1).
fn unauthorized() -> Response {
    (
        StatusCode::UNAUTHORIZED,
        Json(serde_json::json!({ "error": "unauthorized" })),
    )
        .into_response()
}

fn authorize(guard: &AuthGuard, req: &Request) -> Option<VerifiedIdentity> {
    let header = req.headers().get(AUTHORIZATION)?.to_str().ok()?;
    let token = header.strip_prefix("Bearer ")?.trim();
    // Structural pre-checks run BEFORE the verifier: they cost nothing, never
    // touch the network, and keep malformed input away from the crate (whose
    // emulator path would panic on non-base64 payload segments).
    if !plausible_jwt(token) {
        return None;
    }
    guard.verifier.verify(token)
}

/// Cheap JWT-shape check: exactly three dot-separated, non-empty base64url
/// segments without '=' padding characters. Not a validity claim — real
/// verification (signature, aud/iss/exp) always happens in the verifier.
fn plausible_jwt(token: &str) -> bool {
    let mut ok = true;
    let mut segments = 0;
    for seg in token.split('.') {
        segments += 1;
        if seg.is_empty() || seg.len() > 4096 || !seg.bytes().all(is_b64url_char) {
            ok = false;
        }
    }
    ok && segments == 3
}

fn is_b64url_char(b: u8) -> bool {
    b.is_ascii_alphanumeric() || b == b'-' || b == b'_'
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api;
    use axum::body::Body;
    use axum::http::Request as HttpRequest;
    use axum::routing::get;
    use tower::ServiceExt;

    struct AcceptAll {
        email: Option<String>,
    }

    impl IdTokenVerifier for AcceptAll {
        fn verify(&self, _token: &str) -> Option<VerifiedIdentity> {
            Some(VerifiedIdentity {
                uid: "test-uid".to_string(),
                email: self.email.clone(),
            })
        }
    }

    /// Rejects everything — stands in for "Google said the signature is bad".
    struct RejectAll;

    impl IdTokenVerifier for RejectAll {
        fn verify(&self, _token: &str) -> Option<VerifiedIdentity> {
            None
        }
    }

    fn guard_of(v: impl IdTokenVerifier + 'static) -> Option<AuthGuard> {
        Some(AuthGuard {
            verifier: Arc::new(v),
        })
    }

    /// Well-formed, unsigned fake: passes the structural gate only.
    const PLAUSIBLE_TOKEN: &str = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhYmMifQ.c2ln";

    fn probe_router(guard: Option<AuthGuard>) -> Router {
        protect(
            Router::new()
                .route("/api/ping", get(|| async { "ok" }))
                .route("/api/me", get(api::me)),
            guard,
        )
    }

    async fn send(app: Router, path: &str, bearer: Option<&str>) -> axum::response::Response {
        let mut builder = HttpRequest::builder().uri(path);
        if let Some(token) = bearer {
            builder = builder.header(AUTHORIZATION, format!("Bearer {token}"));
        }
        app.oneshot(builder.body(Body::empty()).unwrap()).await.unwrap()
    }

    async fn body_json(resp: axum::response::Response) -> serde_json::Value {
        let bytes = axum::body::to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        serde_json::from_slice(&bytes).unwrap_or_else(|e| {
            panic!("non-JSON body ({e}): {}", String::from_utf8_lossy(&bytes))
        })
    }

    /// Unconfigured ⇒ identity passthrough: both endpoints behave as t15 left them.
    #[tokio::test]
    async fn unconfigured_keeps_passthrough() {
        let app = probe_router(None);
        let resp = send(app, "/api/ping", None).await;
        assert_eq!(resp.status(), StatusCode::OK);

        let app = probe_router(None);
        let v = body_json(send(app, "/api/me", None).await).await;
        assert_eq!(v["auth_enabled"], false);
        assert!(v["uid"].is_null());
    }

    /// Armed + no Authorization header ⇒ frozen 401 JSON shape.
    #[tokio::test]
    async fn armed_missing_header_is_401_unauthorized_json() {
        let app = probe_router(guard_of(RejectAll));
        let resp = send(app, "/api/ping", None).await;
        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
        assert_eq!(
            resp.headers().get(axum::http::header::CONTENT_TYPE).unwrap(),
            "application/json"
        );
        let bytes =
            axum::body::to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        assert_eq!(std::str::from_utf8(&bytes).unwrap(), r#"{"error":"unauthorized"}"#);
    }

    /// Garbage bearer shapes (offline-craftable, zero network) → 401 even with
    /// a would-accept verifier, proving the structural gate runs first.
    #[tokio::test]
    async fn armed_rejects_malformed_tokens_before_verifier() {
        let cases = [
            "",                    // empty after "Bearer "
            "not-a-jwt",           // single segment
            "a.b",                 // two segments
            "@.@.@.",              // non-base64url chars
            "..",                  // empty segments
            "a.b.c.d",             // four segments
            "eyJ..cGF5bG9hZA.c2ln", // empty middle segment
        ];
        for token in cases {
            let app = probe_router(guard_of(AcceptAll { email: None }));
            let resp = send(app, "/api/ping", Some(token)).await;
            assert_eq!(
                resp.status(),
                StatusCode::UNAUTHORIZED,
                "token {token:?} should be structurally rejected"
            );
        }
    }

    /// Structurally-plausible token + accepting verifier ⇒ flows through with
    /// the verified identity in extensions (the /api/me contract).
    #[tokio::test]
    async fn armed_valid_token_passes_with_identity() {
        let app = probe_router(guard_of(AcceptAll {
            email: Some("me@example.com".to_string()),
        }));
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::OK);
        let v = body_json(resp).await;
        assert_eq!(v["auth_enabled"], true);
        assert_eq!(v["uid"], "test-uid");
        assert_eq!(v["email"], "me@example.com");
    }

    /// Structurally-plausible but unverifiable token (bad signature /
    /// audience / expiry in production) ⇒ same 401 shape, nothing leaks.
    #[tokio::test]
    async fn armed_unverifiable_token_is_401() {
        let app = probe_router(guard_of(RejectAll));
        let resp = send(app, "/api/ping", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::UNAUTHORIZED);
        let bytes =
            axum::body::to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        assert_eq!(std::str::from_utf8(&bytes).unwrap(), r#"{"error":"unauthorized"}"#);
    }

    #[test]
    fn plausible_jwt_gate_matrix() {
        assert!(plausible_jwt(PLAUSIBLE_TOKEN));
        assert!(!plausible_jwt(""));
        assert!(!plausible_jwt("a.b"));
        assert!(!plausible_jwt("a.b.c.d"));
        assert!(!plausible_jwt("@.@.@"));
        assert!(!plausible_jwt("a+.b.c")); // '+' not base64url
    }
}
