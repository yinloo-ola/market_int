# market_int webapp

Single-page put-selling candidate browser (design spec: `.scratch/webapp/spec.md`,
build tickets: `.scratch/webapp/issues/10..21`). This crate boots an axum server
that serves the compiled frontend plus local-file API endpoints — it never
touches upstream APIs directly and cannot link Telegram publishing code
(enforced at the workspace level: depends only on `market_int_core`).

## Quick demo (release binary, embedded assets)

From repo root:

```bash
cd crates/webapp/frontend && npm install && npm run build && cd ../..
cargo build --release -p market_int_webapp
./target/release/market_int_webapp --result-file crates/webapp/fixtures/sample_last_run.json
# open http://127.0.0.1:8080
```

The fixture renders two timeframes' sample rows exactly as a real run would.

## Local development (hot reload)

Two terminals:

```bash
# terminal 1 — backend on :8080
cargo run -p market_int_webapp            # debug build; reads dist/ from disk

# terminal 2 — vite dev server on :5173, proxying /api -> :8080
cd crates/webapp/frontend && npm run dev
```

Edit `frontend/src/*` — the page at `http://localhost:5173` reloads live.
Production naming note: vite emits stable names (`assets/app.js|css`, all
other assets inlined), which lets the release build include them via
`include_str!`/`include_bytes!` with compile-checked paths.

## Configuration

| source | value |
|---|---|
| CLI flag | `--result-file <path>` |
| env | `webapp_result_file` |
| default | `/data/webapp/last_run.json` |

| bind address | value |
|---|---|
| default | `0.0.0.0:8080` (Cloud Run port mapping; spec §8) |
| env override | `webapp_bind=127.0.0.1:8080` for local-only exposure |

| auth (ticket 17) | value |
|---|---|
| CLI flag | `--firebase-project-id <id>` |
| env | `FIREBASE_PROJECT_ID` |
| default | *(none)* ⇒ **auth disabled** (one startup warn; every `/api` route is open) |

| access control (ticket 22) | value |
|---|---|
| env | `WEBAPP_OWNER_EMAILS` (comma-separated, case-insensitive) |
| default | *(unset)* ⇒ **any verified identity** may use the API — set it in production to control who has access |
| effect | verified sign-ins from unlisted accounts get `403 {"error":"not_authorized"}` on every `/api` route; the app shows a "not authorized" card |
| ownership | addresses on this list are **owners**: they see the Manage-access panel and may rewrite the grant file (`WEBAPP_ALLOWED_EMAILS_FILE`, default `/data/allowed_emails.txt`) |
| live grants | members added via the Manage-access panel are stored in the grant file — takes effect immediately, no redeploy |

Freshness window comes from `market_int_core::constants::WEBAPP_CACHE_SECS`
(600s) and is reported to the client as `cache_secs` in `/api/latest`.

## Firebase provisioning checklist (one-time, ~10 minutes)

Live user provisioning happens out of band (repository owner). Code-side is
done: this list records the console steps that make it work end to end.

1. <https://console.firebase.google.com> → **Add project** (or "Add Firebase"
   onto the GCP project hosting Cloud Run).
2. **Build → Authentication → Get started** → enable **Email/Password**.
3. Same screen → enable **Google** (pick a support email; the OAuth client is
   auto-provisioned).
4. **Authentication → Settings → Authorized domains** — confirm the default
   `localhost` is present; later add the bare Cloud Run hostname
   (`<name>-<hash>-uc.a.run.app`, no scheme/slash). Missing entry ⇒
   `auth/unauthorized-domain` on Google sign-in.
5. **Project settings → Your apps → Web (`</>`)** → register app and copy the
   `firebaseConfig` values.
6. Backend wiring (no secrets — the project id is public):

   ```bash
   # .env or environment
   FIREBASE_PROJECT_ID=<PROJECT_ID>
   # or: cargo run -p market_int_webapp -- --result-file ... --firebase-project-id <PROJECT_ID>
   ```

7. Frontend wiring — from `crates/webapp/frontend`, copy the template and
   fill it (gitignored values are still public-by-design; keep them out of
   git anyway so project switching stays easy):

   ```bash
   cp .env.local.example .env.local
   # then paste the four values from step 5 into .env.local:
   #   VITE_FIREBASE_API_KEY / AUTH_DOMAIN / PROJECT_ID / APP_ID
   ```

8. Verify: restart backend (it logs whether auth is armed), rebuild the
   frontend (`npm run build`; vite bakes envs at build time), reload the
   page — you should land on the sign-in card; create an account and the
   header shows your email with a working Sign out.

Without step 7 the frontend shows an explicit "auth not configured" card and
`npm run build`/`npm run dev` still succeed without any of these vars.

Behavior when armed:

- every `/api/*` request needs `Authorization: Bearer <Firebase ID token>`;
  anything missing/garbage/unverifiable gets `401 application/json
  {"error":"unauthorized"}` (identical body regardless of reason);
- `GET /api/me` echoes the verified identity `{auth_enabled, uid, email}`;
- static assets stay public so the shell loads before sign-in;
- tokens live ~1 h; the client force-refreshes once per 401 and retries once;
- the backend fetches Google's public JWKS eagerly at boot (network required
  on startup when armed) and refreshes it on Google's Cache-Control schedule.

Dev-only caution: the `firebase-auth` crate honors `FIREBASE_AUTH_EMULATOR_HOST`
by accepting *unsigned* tokens. Never set it outside local emulator testing.

## Endpoints today (ticket 15 scope)

- `GET /api/latest` — envelope `{schema_version, age_secs, cache_secs,
  cache_state fresh|stale|none, run_state:{status:"idle"}, result}`.
  Always HTTP 200; no-data branches on `result === null`.
- `GET /`, static fallback — embedded (release) or disk-read (debug) assets.

Ticket 17 added `GET /api/me` plus the bearer gate over `/api/*`; run
triggering/streaming arrives with ticket 18.

## Why includes instead of rust-embed

Attempted first, found the hard way: rust-embed's directory walker honors
`.gitignore`, which silently emptied the embedded set once dist was ignored.
The include-based split gives the same guarantees (single self-contained
binary in release; live-reload reads in debug) with compile-checked paths and
no hidden walkers. See ticket 15's implementation notes.
