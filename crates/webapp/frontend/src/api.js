// Single HTTP seam for every server call (spec §3.2 shapes).
//
// Ticket 17: this module is THE place bearer tokens touch a fetch (t17
// contract). AuthGate registers a token provider here; every request then
// carries `Authorization: Bearer <idToken>` when one is registered and the
// provider resolves a token. On a 401 the wrapper forces EXACTLY ONE silent
// refresh (`getIdToken(true)`) and retries ONCE — never a storm (§3.5); if
// that still 401s, the response flows back to the caller as-is.

let tokenProvider = null;

/// Register the async provider supplying Firebase ID tokens.
/// Contract: `(forceRefresh: boolean) => Promise<string | null>`.
/// AuthGate installs it; tests / unconfigured dev runs may leave it unset, in
/// which case requests go out unsigned exactly as before t17.
export function setAuthTokenProvider(provider) {
  tokenProvider = provider;
}

async function authorizedFetch(path, opts = {}) {
  if (!tokenProvider) return fetch(path, opts);

  const headers = new Headers(opts.headers ?? {});
  const token = await tokenProvider(false);
  // No provider resolution (signed out mid-flight) ⇒ plain request; the 401
  // (if any) tells the caller what happened.
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(path, { ...opts, headers });
  if (res.status === 401) {
    const fresh = await tokenProvider(true);
    if (fresh && fresh !== token) {
      headers.set("Authorization", `Bearer ${fresh}`);
      res = await fetch(path, { ...opts, headers });
    }
  }
  return res;
}

export async function getLatest() {
  const res = await authorizedFetch("/api/latest");
  if (!res.ok) throw new Error(`GET /api/latest -> ${res.status}`);
  return res.json();
}

/// Owner-allowlist probe (ticket 22): 200 = this identity may use the API;
/// 403 `not_authorized` = valid sign-in, but not on this deployment's list.
/// Callers MUST branch on status, not throw — the 403 is a state, not an error.
export async function getMe() {
  return authorizedFetch("/api/me");
}

/// Ticket 18: live backend for this route.
export async function postRun() {
  const res = await authorizedFetch("/api/run", { method: "POST" });
  return res;
}

/// Ticket 18: attach to an in-flight run (SSE replay + live tail), or the
/// `{ "status": "idle" }` JSON probe shape when nothing is running.
export async function getProgress() {
  return authorizedFetch("/api/progress");
}
