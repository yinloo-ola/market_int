// AuthGate — ticket 17, spec §6.2 region 1 (S0).
//
// Centered overlay card on an otherwise empty page while signed out:
// email + password form with a ⇄ toggle between Sign in / Create account on
// the SAME form, `── or ──`, Continue-with-Google, one error line. Firebase
// recipe per t06: createUserWithEmailAndPassword / signInWithEmailAndPassword
// / signInWithPopup; onAuthStateChanged is wired in App.jsx (observers must
// outlive this component so header Sign-out flips back to the gate). Known
// error codes get friendly one-liners; unknown codes render raw.
//
// Also registers api.js's token provider (the single fetch seam): an async
// getIdToken closure that outlives this component's lifetime by design.

import { Show, createSignal } from "solid-js";

import {
  AUTH_CONFIGURED,
  firebaseAuth,
  newGoogleProvider,
} from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { setAuthTokenProvider } from "../api";

/// §6.2 friendly one-liners; any other code renders raw (`code: message`).
const FRIENDLY_ERRORS = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/email-already-in-use":
    "That email already has an account — switch to Sign in.",
  "auth/weak-password": "Password is too weak — use at least 6 characters.",
  "auth/unauthorized-domain":
    "This domain isn't authorized in the Firebase console yet.",
  "auth/popup-closed-by-user": "Google sign-in cancelled — popup closed.",
};

function friendlyError(err) {
  const code = err?.code ?? "";
  return (
    FRIENDLY_ERRORS[code] ??
    `${code || "error"}: ${err?.message ?? "sign-in failed"}`
  );
}

export function AuthGate() {
  const [mode, setMode] = createSignal("signin"); // 'signin' | 'create'
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal("");

  // Single global registration — reassigning on remount is harmless; api.js
  // reads the freshest user at call time and force-refreshes exactly once on
  // a 401 (its contract). getIdToken() silently refreshes across the 1-hour
  // boundary by itself.
  setAuthTokenProvider(async (forceRefresh) => {
    if (!AUTH_CONFIGURED) return null;
    const user = firebaseAuth().currentUser;
    return user ? await user.getIdToken(forceRefresh) : null;
  });

  async function submit(e) {
    e.preventDefault();
    if (busy()) return;
    setBusy(true);
    setError("");
    try {
      const auth = firebaseAuth();
      if (mode() === "create") {
        await createUserWithEmailAndPassword(auth, email(), password());
      } else {
        await signInWithEmailAndPassword(auth, email(), password());
      }
      // onAuthStateChanged flips the app to content; nothing to do here.
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    if (busy()) return;
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(firebaseAuth(), newGoogleProvider());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div class="gate-wrap">
      <div class="gate-card">
        <h1 class="gate-title">
          <span class="brand-mark">
            Market<span class="brand-accent">Int</span>
          </span>
          <span class="brand-sub">Put-Selling Candidates</span>
        </h1>

        <Show
          when={AUTH_CONFIGURED}
          fallback={
            <>
              <p>
                Authentication is not configured — sign-in cannot start.
                Point <code>VITE_FIREBASE_API_KEY</code>,{" "}
                <code>VITE_FIREBASE_PROJECT_ID</code> and{" "}
                <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase
                project (checklist: crates/webapp/README.md), rebuild{" "}
                <code>npm run build</code>, then reload.
              </p>
              <p class="gate-note">
                The server itself still answers: its API stays open until it
                boots with a Firebase project id of its own.
              </p>
            </>
          }
        >
          <form onSubmit={submit}>
            <label class="gate-label">
              Email
              <input
                type="email"
                required
                autocomplete="email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="you@example.com"
              />
            </label>
            <label class="gate-label">
              Password
              <input
                type="password"
                required
                autocomplete={
                  mode() === "create" ? "new-password" : "current-password"
                }
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" class="btn btn-primary" disabled={busy()}>
              {busy() ? "Working…" : mode() === "create" ? "Create account" : "Sign in"}
            </button>
          </form>

          {/* ⇄ toggles sign-in vs create-account mode on the same form */}
          <button
            type="button"
            class="gate-toggle"
            disabled={busy()}
            onClick={() => {
              setError("");
              setMode(mode() === "create" ? "signin" : "create");
            }}
          >
            {mode() === "create"
              ? "⇄ Have an account? Sign in"
              : "⇄ Need an account? Create one"}
          </button>

          <div class="gate-or">── or ──</div>

          <button
            type="button"
            class="btn"
            disabled={busy()}
            onClick={continueWithGoogle}
          >
            Continue with Google
          </button>

          <Show when={error()}>
            <div class="gate-error" role="alert">
              {error()}
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
