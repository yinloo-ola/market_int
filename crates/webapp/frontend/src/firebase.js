// Firebase bootstrap + auth config seam (ticket 17).
//
// The SDK is a bundled npm dependency (spec §6.1 forbids runtime CDN loading);
// config comes from vite-native envs consumed at build time. Every value is
// public by design (§3.1 / ticket 06) — security is enforced server-side by
// Bearer-token verification.
//
// Dev honesty: with no VITE_FIREBASE_* envs the gate cannot function.
// AUTH_CONFIGURED stays false and nothing initializes, so `npm run dev` /
// `npm run build` work without any env setup and AuthGate renders an explicit
// "auth not configured" notice card.

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const env = import.meta.env;

export const AUTH_CONFIGURED = Boolean(
  env.VITE_FIREBASE_API_KEY &&
    env.VITE_FIREBASE_PROJECT_ID &&
    env.VITE_FIREBASE_APP_ID,
);

let authInstance = null;

/// Lazy singleton. Throws when called while unconfigured — every caller must
/// gate on AUTH_CONFIGURED first (AuthGate does).
export function firebaseAuth() {
  if (!AUTH_CONFIGURED) {
    throw new Error(
      "Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID",
    );
  }
  if (!authInstance) {
    const app = initializeApp({
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      // Optional keys pass through untouched when present:
      ...(env.VITE_FIREBASE_STORAGE_BUCKET && {
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      }),
      ...(env.VITE_FIREBASE_MESSAGING_SENDER_ID && {
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      }),
    });
    authInstance = getAuth(app);
  }
  return authInstance;
}

export function newGoogleProvider() {
  return new GoogleAuthProvider();
}

/// Header sign-out button; no-op while unconfigured or signed out.
export async function signOutUser() {
  if (!AUTH_CONFIGURED) return;
  const auth = firebaseAuth();
  if (auth.currentUser) await signOut(auth);
}
