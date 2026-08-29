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

use std::collections::HashSet;
use std::path::PathBuf;
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
    /// Email allowlist (lowercase), `None` ⇒ any verified identity may pass.
    /// A valid token from an unlisted account is still a valid *identity* —
    /// it just isn't one this deployment serves (owner-controlled access).
    allowed: Option<Arc<HashSet<String>>>,
    /// Live grant file (ticket 22): re-read PER REQUEST so the owner can
    /// grant/revoke access by editing one text file — in production it lives
    /// on the GCS FUSE volume, no redeploy, no restart. `None` ⇒ file off.
    allowlist_file: Option<PathBuf>,
}

impl AuthGuard {
    /// Fetches Google's public JWKS (network!) and arms the crate's refresh
    /// loop — call once at startup, from main. `allowed` (already lowercased,
    /// from `${WEBAPP_ALLOWED_EMAILS}`) is the static part of the list;
    /// `allowlist_file` (from `${WEBAPP_ALLOWED_EMAILS_FILE}`) is the live
    /// part. Both sources are unioned; both empty ⇒ any verified identity.
    pub async fn from_project_id(
        project_id: &str,
        allowed: Option<Vec<String>>,
        allowlist_file: Option<PathBuf>,
    ) -> Self {
        Self {
            verifier: Arc::new(FirebaseVerifier {
                auth: FirebaseAuth::new(project_id).await,
            }),
            allowed: allowed.map(|list| Arc::new(list.into_iter().collect())),
            allowlist_file,
        }
    }
}

/// One email per line; `#` comments and blank lines ignored; lowercased.
fn parse_allowlist_file(content: &str) -> HashSet<String> {
    content
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty() && !l.starts_with('#'))
        .map(str::to_lowercase)
        .collect()
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

/// Outcome of one request's access check. `Denied` is distinct from
/// `Unauthorized` on purpose: a valid token from a non-allowlisted account is
/// not a leakable auth failure, so it gets its own body and status (403) —
/// which also keeps the client's force-refresh-once-on-401 logic from
/// churning on a denial that no refresh can fix.
enum Access {
    Allowed(VerifiedIdentity),
    Denied,
    Unauthorized,
}

async fn enforce(State(guard): State<AuthGuard>, mut req: Request, next: Next) -> Response {
    match access(&guard, &req) {
        Access::Allowed(identity) => {
            req.extensions_mut().insert(identity);
            next.run(req).await
        }
        Access::Denied => (
            StatusCode::FORBIDDEN,
            Json(serde_json::json!({ "error": "not_authorized" })),
        )
            .into_response(),
        Access::Unauthorized => unauthorized(),
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

fn access(guard: &AuthGuard, req: &Request) -> Access {
    let Some(header) = req.headers().get(AUTHORIZATION).and_then(|h| h.to_str().ok()) else {
        return Access::Unauthorized;
    };
    let Some(token) = header.strip_prefix("Bearer ").map(str::trim) else {
        return Access::Unauthorized;
    };
    // Structural pre-checks run BEFORE the verifier: they cost nothing, never
    // touch the network, and keep malformed input away from the crate (whose
    // emulator path would panic on non-base64 payload segments).
    if !plausible_jwt(token) {
        return Access::Unauthorized;
    }
    let Some(identity) = guard.verifier.verify(token) else {
        return Access::Unauthorized;
    };
    // Owner-controlled access: a verified identity still has to be on the
    // deployment's allowlist (when one is configured). Checked against the
    // static env set first, then the live grant file — re-read per request so
    // edits take effect without a restart or redeploy. Membership is tested
    // in place; neither source is copied per request.
    if guard.allowed.is_some() || guard.allowlist_file.is_some() {
        let email = identity.email.as_deref().map(str::to_lowercase);
        let mut member = email
            .as_deref()
            .is_some_and(|e| guard.allowed.as_deref().is_some_and(|set| set.contains(e)));
        if !member {
            if let Some(path) = &guard.allowlist_file {
                match std::fs::read_to_string(path) {
                    Ok(content) => {
                        member = email
                            .as_deref()
                            .is_some_and(|e| parse_allowlist_file(&content).contains(e));
                    }
                    Err(err) if err.kind() == std::io::ErrorKind::NotFound => {
                        // Uncreated grant file: the static list alone applies.
                    }
                    Err(err) => {
                        log::warn!("allowlist file {} unreadable: {err}", path.display());
                    }
                }
            }
        }
        if !member {
            return Access::Denied;
        }
    }
    Access::Allowed(identity)
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

    #[derive(Clone)]
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
            allowed: None,
            allowlist_file: None,
        })
    }

    /// Guard with an email allowlist (already lowercased), mirroring
    /// `${WEBAPP_ALLOWED_EMAILS}` parsing.
    fn guard_with_allowlist(
        v: impl IdTokenVerifier + 'static,
        allowed: &[&str],
    ) -> Option<AuthGuard> {
        Some(AuthGuard {
            verifier: Arc::new(v),
            allowed: Some(Arc::new(
                allowed.iter().map(|s| s.to_string()).collect(),
            )),
            allowlist_file: None,
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

    // ── owner allowlist (ticket 22: controlled access) ──────────

    /// Allowlisted email ⇒ 200 with the identity; unlisted / emailless ⇒ 403
    /// `not_authorized` (distinct from the frozen 401 unauthorized shape).
    #[tokio::test]
    async fn allowlist_passes_member_and_denies_stranger() {
        let member = probe_router(guard_with_allowlist(
            AcceptAll { email: Some("TianHai@gmail.com".into()) },
            &["tianhai@gmail.com"],
        ));
        let resp = send(member, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::OK);

        let stranger = probe_router(guard_with_allowlist(
            AcceptAll { email: Some("stranger@example.com".into()) },
            &["tianhai@gmail.com"],
        ));
        let resp = send(stranger, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::FORBIDDEN);
        let bytes = axum::body::to_bytes(resp.into_body(), usize::MAX).await.unwrap();
        assert_eq!(std::str::from_utf8(&bytes).unwrap(), r#"{"error":"not_authorized"}"#);
    }

    #[tokio::test]
    async fn allowlist_denies_identity_without_email() {
        let app = probe_router(guard_with_allowlist(AcceptAll { email: None }, &["x@y.z"]));
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn no_allowlist_keeps_any_verified_identity_allowed() {
        let app = probe_router(guard_of(AcceptAll { email: Some("anyone@example.com".into()) }));
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::OK);
    }

    // ── live grant file (ticket 22: no-redeploy grants) ─────────

    fn guard_with_file(
        v: impl IdTokenVerifier + 'static,
        static_allowed: Option<Vec<String>>,
        file: &std::path::Path,
    ) -> Option<AuthGuard> {
        Some(AuthGuard {
            verifier: Arc::new(v),
            allowed: static_allowed.map(|list| Arc::new(list.into_iter().collect())),
            allowlist_file: Some(file.to_path_buf()),
        })
    }

    /// The point of the grant file: append an address → allowed; remove it →
    /// denied again. SAME guard instance — access re-reads the file per
    /// request, so grants take effect without a restart or redeploy.
    #[tokio::test]
    async fn grant_file_grants_and_revokes_live() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("allowed.txt");
        std::fs::write(&path, "# grants — one email per line\ntianhai@gmail.com\n").unwrap();

        let stranger = AcceptAll { email: Some("stranger@example.com".into()) };
        let guard = guard_with_file(stranger.clone(), None, &path);

        let app = probe_router(guard.clone());
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::FORBIDDEN, "not in file yet");

        // Grant: append → SAME guard instance, new decision.
        std::fs::write(&path, "# grants — one email per line\ntianhai@gmail.com\nstranger@example.com\n").unwrap();
        let app = probe_router(guard.clone());
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::OK, "granted via file, no restart");

        // Revoke: rewrite without the address.
        std::fs::write(&path, "# grants — one email per line\ntianhai@gmail.com\n").unwrap();
        let app = probe_router(guard);
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::FORBIDDEN, "revoked via file");
    }

    #[tokio::test]
    async fn static_list_and_grant_file_are_unioned() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("allowed.txt");
        std::fs::write(&path, "stranger@example.com\n").unwrap();

        let guard = guard_with_file(
            AcceptAll { email: Some("STRANGER@example.com".into()) },
            Some(vec!["tianhai@gmail.com".into()]),
            &path,
        );
        // Case-insensitive on both sources; either grants access.
        let app = probe_router(guard);
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::OK);
    }

    #[test]
    fn grant_file_parsing_ignores_comments_blanks_and_case() {
        let parsed = parse_allowlist_file("# comment\n\n A@B.com \n# another\nc@d.com\n");
        assert_eq!(parsed.len(), 2);
        assert!(parsed.contains("a@b.com") && parsed.contains("c@d.com"));
    }

    #[tokio::test]
    async fn missing_grant_file_falls_back_to_static_list() {
        let dir = tempfile::tempdir().unwrap();
        let guard = guard_with_file(
            AcceptAll { email: Some("tianhai@gmail.com".into()) },
            Some(vec!["tianhai@gmail.com".into()]),
            &dir.path().join("never-created.txt"),
        );
        let app = probe_router(guard);
        let resp = send(app, "/api/me", Some(PLAUSIBLE_TOKEN)).await;
        assert_eq!(resp.status(), StatusCode::OK);
    }
}
