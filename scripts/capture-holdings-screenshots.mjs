#!/usr/bin/env node
/**
 * Automated visual verification and screenshot capture for Holdings tab.
 * Captures high-resolution mobile (390x844) and desktop (1280x800) screenshots
 * to gui-test-screenshots/ per requirement R6.
 */

import { spawn } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import http from "node:http";

const PORT = 5176;
const PREVIEW_URL = `http://localhost:${PORT}/preview-holdings.html?theme=dark`;
const OUTPUT_DIR = resolve("gui-test-screenshots");

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304) {
          resolve();
        } else {
          retry();
        }
      }).on("error", () => {
        retry();
      });
    };
    const retry = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`));
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  });
}

async function main() {
  console.log("Starting preview dev server on port", PORT);
  const viteProcess = spawn(
    "npx",
    ["vite", "--port", String(PORT), "--strictPort"],
    {
      cwd: resolve("crates/webapp/frontend"),
      stdio: "pipe",
    }
  );

  viteProcess.stderr.on("data", (d) => process.stderr.write(d));

  try {
    await waitForServer(PREVIEW_URL);
    console.log("Preview server ready at", PREVIEW_URL);

    let chromium;
    try {
      const pw = await import("playwright");
      chromium = pw.chromium;
    } catch {
      const pw = await import("/Users/yinlootan/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs");
      chromium = pw.chromium;
    }

    const browser = await chromium.launch({ headless: true });

    // 1. Mobile Viewport (iPhone 12/13/14 scale: 390x844)
    console.log("Capturing mobile screenshot (390x844)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(PREVIEW_URL, { waitUntil: "networkidle" });
    await mobilePage.waitForSelector(".hp-cash-bar");
    await mobilePage.waitForSelector(".hp-pos-card");

    // Collapsed mobile overview
    await mobilePage.screenshot({
      path: resolve(OUTPUT_DIR, "holdings-mobile.png"),
      fullPage: false,
    });
    console.log("Saved gui-test-screenshots/holdings-mobile.png");

    // Tap first position card to expand drawer
    const firstCard = await mobilePage.locator(".hp-card-summary").first();
    await firstCard.click();
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({
      path: resolve(OUTPUT_DIR, "holdings-mobile-drawer.png"),
      fullPage: false,
    });
    console.log("Saved gui-test-screenshots/holdings-mobile-drawer.png");

    // Open Accounts / Pools sheet
    const poolBtn = await mobilePage.locator(".hp-pool-sheet-btn");
    await poolBtn.click();
    await mobilePage.waitForSelector(".hp-pool-sheet:not([hidden])");
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({
      path: resolve(OUTPUT_DIR, "holdings-mobile-sheet.png"),
      fullPage: false,
    });
    console.log("Saved gui-test-screenshots/holdings-mobile-sheet.png");

    // Close pool sheet, open Sell Put action sheet with validation hint
    await mobilePage.locator(".hp-sheet-close").click();
    await mobilePage.waitForTimeout(300);
    await mobilePage.locator(".hp-add-btn").first().click();
    await mobilePage.waitForSelector(".hp-action-sheet:not([hidden])");
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({
      path: resolve(OUTPUT_DIR, "holdings-mobile-action.png"),
      fullPage: false,
    });
    console.log("Saved gui-test-screenshots/holdings-mobile-action.png");

    await mobileContext.close();

    // 2. Desktop Viewport (1280x800)
    console.log("Capturing desktop screenshot (1280x800)...");
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(PREVIEW_URL, { waitUntil: "networkidle" });
    await desktopPage.waitForSelector(".hp-tabs-rail");
    await desktopPage.waitForSelector(".hp-pos-card");
    await desktopPage.screenshot({
      path: resolve(OUTPUT_DIR, "holdings-desktop.png"),
      fullPage: false,
    });
    console.log("Saved gui-test-screenshots/holdings-desktop.png");

    // Open Sell Put action modal on desktop to verify 2-column layout
    await desktopPage.locator(".hp-add-btn").first().click();
    await desktopPage.waitForSelector(".hp-action-sheet:not([hidden])");
    await desktopPage.waitForTimeout(300);
    await desktopPage.screenshot({
      path: resolve(OUTPUT_DIR, "holdings-desktop-action.png"),
      fullPage: false,
    });
    console.log("Saved gui-test-screenshots/holdings-desktop-action.png");

    await desktopContext.close();
    await browser.close();

    console.log("\nVisual screenshot verification completed successfully!");
  } finally {
    viteProcess.kill();
  }
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
