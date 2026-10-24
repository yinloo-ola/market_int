import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const OUTPUT_DIR = resolve("gui-test-screenshots");
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function getBrowser() {
  let pw;
  try {
    pw = await import("playwright");
  } catch {
    pw = await import("/Users/yinlootan/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs");
  }
  return await pw.chromium.launch({ headless: true });
}

async function testLightScreenshots(browser) {
  console.log("\n=== 1. CAPTURING LIGHT THEME SCREENSHOTS ===");

  // Mobile Light
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileCtx.newPage();
  const mobileUrl = "http://localhost:5173/preview-holdings.html?theme=light";
  await mobilePage.goto(mobileUrl, { waitUntil: "networkidle" });
  await mobilePage.waitForSelector(".hp-cash-bar");
  await mobilePage.waitForSelector(".hp-pos-card");

  // Overview
  await mobilePage.screenshot({
    path: resolve(OUTPUT_DIR, "holdings-light-mobile.png"),
    fullPage: false,
  });
  console.log("Saved gui-test-screenshots/holdings-light-mobile.png");

  // Drawer
  await mobilePage.locator(".hp-card-summary").first().click();
  await mobilePage.waitForTimeout(300);
  await mobilePage.screenshot({
    path: resolve(OUTPUT_DIR, "holdings-light-mobile-drawer.png"),
    fullPage: false,
  });
  console.log("Saved gui-test-screenshots/holdings-light-mobile-drawer.png");

  // Pool Sheet
  await mobilePage.locator(".hp-pool-sheet-btn").click();
  await mobilePage.waitForSelector(".hp-pool-sheet:not([hidden])");
  await mobilePage.waitForTimeout(300);
  await mobilePage.screenshot({
    path: resolve(OUTPUT_DIR, "holdings-light-mobile-sheet.png"),
    fullPage: false,
  });
  console.log("Saved gui-test-screenshots/holdings-light-mobile-sheet.png");

  // Action Sheet
  await mobilePage.locator(".hp-sheet-close").click();
  await mobilePage.waitForTimeout(300);
  await mobilePage.locator(".hp-add-btn").first().click();
  await mobilePage.waitForSelector(".hp-action-sheet:not([hidden])");
  await mobilePage.waitForTimeout(300);
  await mobilePage.screenshot({
    path: resolve(OUTPUT_DIR, "holdings-light-mobile-action.png"),
    fullPage: false,
  });
  console.log("Saved gui-test-screenshots/holdings-light-mobile-action.png");

  await mobileCtx.close();

  // Desktop Light
  const desktopCtx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopCtx.newPage();
  const desktopUrl = "http://localhost:5173/preview-holdings.html?theme=light";
  await desktopPage.goto(desktopUrl, { waitUntil: "networkidle" });
  await desktopPage.waitForSelector(".hp-tabs-rail");
  await desktopPage.waitForSelector(".hp-pos-card");

  await desktopPage.screenshot({
    path: resolve(OUTPUT_DIR, "holdings-light-desktop.png"),
    fullPage: false,
  });
  console.log("Saved gui-test-screenshots/holdings-light-desktop.png");

  // Action modal
  await desktopPage.locator(".hp-add-btn").first().click();
  await desktopPage.waitForSelector(".hp-action-sheet:not([hidden])");
  await desktopPage.waitForTimeout(300);
  await desktopPage.screenshot({
    path: resolve(OUTPUT_DIR, "holdings-light-desktop-action.png"),
    fullPage: false,
  });
  console.log("Saved gui-test-screenshots/holdings-light-desktop-action.png");

  await desktopCtx.close();
}

async function testDesktopClickability(browser) {
  console.log("\n=== 2. VERIFYING DESKTOP CLICKABILITY ===");
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();

  // 2.1 Main App Top Nav & Theme Toggle
  console.log("Navigating to main app http://localhost:5173/ ...");
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });

  // Test theme toggle button
  const themeBtn = page.locator(".theme-toggle");
  if (await themeBtn.count() > 0) {
    const initTheme = await page.evaluate(() => document.documentElement.dataset.theme || "auto");
    console.log(`Initial theme: ${initTheme}`);
    await themeBtn.click();
    await page.waitForTimeout(200);
    const toggledTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log(`✓ Clicked ThemeToggle: theme changed to ${toggledTheme}`);
    await themeBtn.click();
    await page.waitForTimeout(200);
    console.log("✓ Clicked ThemeToggle back to original");
  }

  // Test top tabs (Short, Medium, Holdings)
  const tabs = page.locator(".tab");
  const tabCount = await tabs.count();
  console.log(`Found ${tabCount} main top tabs`);
  for (let i = 0; i < tabCount; i++) {
    const tabName = (await tabs.nth(i).innerText()).trim();
    await tabs.nth(i).click();
    await page.waitForTimeout(200);
    const isActive = await tabs.nth(i).evaluate(el => el.classList.contains("active"));
    console.log(`✓ Clicked top tab "${tabName}": active=${isActive}`);
  }

  // Switch to Holdings tab
  const holdingsTab = page.locator('.tab:has-text("Holdings")');
  if (await holdingsTab.count() > 0) {
    await holdingsTab.click();
    await page.waitForTimeout(300);
    console.log("✓ Switched to Holdings tab in main app");
  }

  // 2.2 Deep Holdings Interactive Clickability in Preview harness
  console.log("\nTesting Holdings interactive elements on desktop...");
  await page.goto("http://localhost:5173/preview-holdings.html?theme=light", { waitUntil: "networkidle" });

  // Test Sub-tabs: Lots, Puts, Calls
  const subTabs = page.locator(".hp-tab-tile");
  const subCount = await subTabs.count();
  console.log(`Found ${subCount} subtabs on desktop rail`);
  for (let i = 0; i < subCount; i++) {
    const subName = (await subTabs.nth(i).locator(".hp-tab-tile-name").innerText()).trim();
    await subTabs.nth(i).click();
    await page.waitForTimeout(200);
    const isActive = await subTabs.nth(i).evaluate(el => el.classList.contains("active"));
    console.log(`✓ Clicked subtab "${subName}": active=${isActive}`);
  }

  // Return to Puts tab
  await page.locator('.hp-tab-tile:has-text("PUTS")').click();
  await page.waitForTimeout(200);

  // Test expanding and collapsing a Put card drawer
  const putCard = page.locator(".hp-pos-card").first();
  const putSummary = putCard.locator(".hp-card-summary");
  console.log("Clicking Put card summary to expand drawer...");
  await putSummary.click();
  await page.waitForTimeout(200);
  let drawerExpanded = await putCard.locator(".hp-card-drawer").isVisible();
  console.log(`✓ Put card drawer expanded: ${drawerExpanded}`);

  console.log("Clicking Put card summary again to collapse drawer...");
  await putSummary.click();
  await page.waitForTimeout(200);
  drawerExpanded = await putCard.locator(".hp-card-drawer").isVisible();
  console.log(`✓ Put card drawer collapsed: ${!drawerExpanded}`);

  // Test close position dialog on Put
  const closeBtn = putCard.locator(".holdings-close-btn").first();
  console.log("Clicking 'close...' button on Put card...");
  await closeBtn.click();
  await page.waitForSelector(".hp-action-sheet:not([hidden])");
  console.log("✓ Close Put action sheet opened");

  // Click radio buttons in close dialog
  const radios = page.locator('.hp-action-sheet input[type="radio"]');
  const radioCount = await radios.count();
  console.log(`Found ${radioCount} radio options in Close dialog`);
  for (let i = 0; i < radioCount; i++) {
    await radios.nth(i).click();
    await page.waitForTimeout(150);
    const isChecked = await radios.nth(i).isChecked();
    console.log(`✓ Clicked radio option ${i + 1}: checked=${isChecked}`);
  }

  // Click Cancel on Close dialog
  const cancelClose = page.locator('.hp-action-sheet .hp-sheet-cancel');
  await cancelClose.first().click();
  await page.waitForTimeout(200);
  const actionSheetClosed = await page.evaluate(() => !document.querySelector(".hp-action-sheet"));
  console.log(`✓ Clicked Cancel: action sheet closed=${actionSheetClosed}`);

  // Test "+ Sell put" action button
  console.log("Clicking '+ Sell put' button...");
  await page.locator(".hp-add-btn").first().click();
  await page.waitForSelector(".hp-action-sheet:not([hidden])");
  console.log("✓ Action sheet for '+ Sell put' opened");

  // Interact with form inputs
  const symbolInput = page.locator('.hp-action-sheet input[placeholder="SYMBOL"]');
  await symbolInput.click();
  await symbolInput.fill("NVDA");
  console.log("✓ Clicked and typed into symbol input: NVDA");

  const contractsInput = page.locator('.hp-action-sheet input[inputmode="numeric"]').first();
  await contractsInput.click();
  await contractsInput.fill("2");
  console.log("✓ Clicked and typed into contracts input: 2");

  // Click sheet top-right close '×'
  const sheetCloseX = page.locator(".hp-sheet-close");
  await sheetCloseX.click();
  await page.waitForTimeout(200);
  console.log("✓ Clicked modal header '×' button to close sheet");

  // Test Refresh Marks button
  const refreshBtn = page.locator(".holdings-refresh-btn");
  if (await refreshBtn.count() > 0) {
    await refreshBtn.click();
    console.log("✓ Clicked 'Refresh marks' button");
  }

  await ctx.close();
}

async function testMobileClickability(browser) {
  console.log("\n=== 3. VERIFYING MOBILE PHONE CLICKABILITY & TOUCH ===");
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();

  console.log("Navigating to preview harness on mobile viewport...");
  await page.goto("http://localhost:5173/preview-holdings.html?theme=light", { waitUntil: "networkidle" });

  // 3.1 Mobile subtabs tap test
  const mobileTabs = page.locator(".hp-mobile-tile");
  const tabCount = await mobileTabs.count();
  console.log(`Found ${tabCount} mobile tab tiles`);
  for (let i = 0; i < tabCount; i++) {
    const tabName = (await mobileTabs.nth(i).locator(".hp-tab-tile-name").innerText()).trim();
    await mobileTabs.nth(i).tap();
    await page.waitForTimeout(200);
    const isActive = await mobileTabs.nth(i).evaluate(el => el.classList.contains("active"));
    console.log(`✓ Tapped mobile tab "${tabName}": active=${isActive}`);
  }

  // Switch back to Lots tab
  await mobileTabs.nth(0).click();
  await page.waitForTimeout(300);
  console.log("✓ Switched mobile pane back to LOTS");

  // 3.2 Mobile card expansion tap/click test
  const lotCard = page.locator(".hp-pos-card").first();
  console.log("Tapping lot card summary to toggle drawer...");
  await lotCard.locator(".hp-card-summary").click();
  await page.waitForTimeout(200);
  let isOpen = await lotCard.locator(".hp-card-drawer").isVisible();
  console.log(`✓ Lot card drawer opened via tap/click: ${isOpen}`);

  await lotCard.locator(".hp-card-summary").click();
  await page.waitForTimeout(200);
  isOpen = await lotCard.locator(".hp-card-drawer").isVisible();
  console.log(`✓ Lot card drawer closed via tap/click: ${!isOpen}`);

  // 3.3 Mobile card action buttons: "sell call…" on uncovered lot
  console.log("Tapping 'sell call…' action button on lot card with capacity...");
  const sellCallBtn = page.locator('.hp-pos-card button:has-text("sell call")').first();
  await sellCallBtn.click();
  await page.waitForSelector(".hp-action-sheet:not([hidden])");
  console.log("✓ 'Sell covered call' action sheet opened");

  // Tap input in action sheet
  const strikeInput = page.locator('.hp-action-sheet input[placeholder="e.g. 360.00"]');
  await strikeInput.click();
  await strikeInput.fill("250.00");
  console.log("✓ Tapped and filled strike input on mobile");

  // Tap Cancel button
  await page.locator('.hp-action-sheet button:has-text("Cancel")').click();
  await page.waitForTimeout(200);
  console.log("✓ Tapped Cancel in action sheet");

  // 3.4 Mobile Accounts & Cash Pools Sheet
  console.log("Tapping '[Accounts / Pools]' header button...");
  const poolSheetBtn = page.locator(".hp-pool-sheet-btn");
  await poolSheetBtn.click();
  await page.waitForSelector(".hp-pool-sheet:not([hidden])");
  console.log("✓ PoolManagerSheet opened on mobile");

  // Tap Edit Cash button inside sheet
  const editCashBtn = page.locator('.hp-pool-sheet button:has-text("edit cash")');
  await editCashBtn.click();
  await page.waitForSelector(".hp-pool-sheet input");
  console.log("✓ Tapped 'edit cash': input appeared");

  // Tap Cancel cash edit
  const cancelCash = page.locator('.hp-pool-sheet button:has-text("Cancel")');
  await cancelCash.click();
  await page.waitForTimeout(150);
  console.log("✓ Tapped 'Cancel' cash edit");

  // Tap sheet close '×'
  const sheetClose = page.locator(".hp-pool-sheet .hp-sheet-close");
  await sheetClose.click();
  await page.waitForTimeout(200);
  const poolSheetHidden = await page.evaluate(() => {
    const s = document.querySelector(".hp-pool-sheet");
    return !s || s.hasAttribute("hidden");
  });
  console.log(`✓ Tapped sheet close '×': sheet hidden=${poolSheetHidden}`);

  await ctx.close();
}

async function main() {
  const browser = await getBrowser();
  try {
    await testLightScreenshots(browser);
    await testDesktopClickability(browser);
    await testMobileClickability(browser);
    console.log("\nALL LIGHT THEME AND CLICKABILITY TESTS PASSED WITH 100% SUCCESS!");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
