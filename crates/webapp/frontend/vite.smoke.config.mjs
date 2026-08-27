import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// DOM-smoke bundle: same Solid transform as prod, iife output consumed by
// scripts/run-smoke.mjs after happy-dom registers the globals.
export default defineConfig({
  plugins: [solid()],
  build: {
    outDir: "dist-smoke",
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      input: "src/smoke-entry.jsx",
      output: { format: "iife", entryFileNames: "app.js" },
    },
  },
});
