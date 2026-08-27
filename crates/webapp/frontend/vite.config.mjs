import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Dev flow (spec §8): `npm run dev` serves :5173 and proxies /api to the axum
// server on :8080, so the frontend edits hot-reload against real endpoints.
export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8080",
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Stable, unhashed artifact names so the Rust side can include them via
    // include_str!/include_bytes! (compile-checked). assetsInlineLimit keeps
    // fonts/images inlined into the single JS/CSS pair, honoring the spec's
    // ≤10 embedded-files budget (§6.1).
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/app[extname]",
        // t17 (firebase SDK) made accidental code-splits likelier; an extra
        // chunk would silently 404 in the release binary's embedded set.
        // Single entry ⇒ inlining keeps everything in app.js.
        inlineDynamicImports: true,
      },
    },
  },
});
