import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Tunnel-preview lane (`npm run dev:preview`): the dev config plus
// `allowedHosts: true`, so quick-tunnel origins (e.g. *.trycloudflare.com)
// can reach the dev server — Vite 6 otherwise 403s foreign Host headers.
// DEV-ONLY convenience for phone/tunnel previews; never used for production
// builds. Pair with an unarmed server (FIREBASE_PROJECT_ID empty) and
// VITE_PREVIEW_USER to bypass the Firebase gate on unauthorized origins.
export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8080",
    },
    allowedHosts: true,
  },
});
