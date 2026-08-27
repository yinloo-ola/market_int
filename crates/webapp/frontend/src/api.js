// Single HTTP seam for every server call (spec §3.2 shapes).
// Ticket 17 wraps this module with Firebase Bearer tokens + one-shot 401
// retry; consumers stay untouched.

export async function getLatest() {
  const res = await fetch("/api/latest");
  if (!res.ok) throw new Error(`GET /api/latest -> ${res.status}`);
  return res.json();
}

/// Ticket 18 replaces the stub backend for this route.
export async function postRun() {
  const res = await fetch("/api/run", { method: "POST" });
  return res;
}
