// Registers happy-dom globals in PLAIN node (no bundler), then executes the
// vite-built smoke bundle. The bundle itself calls process.exit on completion.
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();
await import("../dist-smoke/app.js");
