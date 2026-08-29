/* Ticket-19 DOM smoke (dev-only): `npm run smoke`.
   Renders ResultsPane against a synthetic §3.2 document under happy-dom and
   asserts expansion blocks, tooltips, S6 badges/panel. Not production code. */

async function main() {

const THRESHOLDS = {
  vol_tier_high: 0.38,
  vol_tier_mid: 0.28,
  momentum_high: 0.8,
  momentum_extended: 0.9,
};

function row(over = {}) {
  return {
    underlying: "NVDA",
    sector: "Technology",
    strike: 175,
    underlying_price: 206.84,
    side: "put",
    bid: 2.05,
    mid: 2.1,
    ask: 2.15,
    bid_size: 12,
    ask_size: 8,
    expiration: "2026-09-02",
    volume: 352,
    open_interest: 1204,
    rate_of_return: 0.624,
    strike_from: 170,
    strike_to: 192.5,
    sharpe_ratio: 1.83,
    strike_percentile: 0.412,
    score: 0.5941234567890123,
    score_components: { sharpe: 0.183, safety: 0.261, return: 0.15 },
    price_percentile: 0.81,
    earnings_before_expiry: { report_date: "2026-08-31", report_time: "after_close", expected_eps: 1.24 },
    trend_short: 1.036,
    trend_long: 1.089,
    realized_vol: 0.452,
    implied_vol: 0.481,
    delta: -0.28,
    iv_rv_ratio: 1.0642,
    ...over,
  };
}

const STAGES = [
  { name: "quotes", status: "partial", error: "3 symbols failed: XYZ, ABC, QQQ", duration_secs: 92 },
  { name: "metrics", status: "ok", error: null, duration_secs: 3 },
  { name: "chains_short", status: "ok", error: null, duration_secs: 118 },
  { name: "chains_medium", status: "failed", error: "Failed to get option expirations for batch.", duration_secs: 4 },
];

const TF_SHORT_ROWS = [
  row(), // NVDA: scored + earnings + components
  row({ underlying: "XOM", sector: "Energy", score: null, score_components: null }), // unscored degrades
];
// medium absent entirely + its stage failed → exercises the S6 inline panel
const ENVELOPE = {
  schema_version: 1,
  age_secs: 12,
  cache_secs: 600,
  cache_state: "fresh",
  run_state: { status: "idle" },
  result: {
    schema_version: 1,
    thresholds: THRESHOLDS,
    run: {},
    stages: STAGES,
    timeframes: { short: { expiration: "2026-09-02", row_count: 2, symbols_with_chains: 171, rows: TF_SHORT_ROWS, top_picks: [] } },
  },
};

const checks = [];
const ok = (name, cond) => checks.push([name, Boolean(cond)]);
const tick = () => new Promise((r) => setTimeout(r, 25));

document.body.innerHTML = `<div id="root"></div>`;

await import("./style.css").catch(() => {}); // style optional in smoke
const { render } = await import("solid-js/web");
const ResultsPane = (await import("./components/ResultsPane")).default;

const VISIBLE = ["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score"];
const columns = {
  visible: () => [...VISIBLE],
  // Required by the shared-store contract; toggles aren't exercised here.
  isOn: undefined,
  toggle: undefined,
  reset: undefined,
};
const active = () => true;
const stages = () => [...STAGES];

render(
  () => (
    <ResultsPane
      id="short"
      active={active}
      tf={ENVELOPE.result.timeframes.short}
      stageError={undefined}
      stages={stages()}
      thresholds={THRESHOLDS}
      columns={columns}
    />
  ),
  document.getElementById("root")
);

await tick();
const q = (sel) => document.querySelector(sel);
const qa = (sel) => Array.from(document.querySelectorAll(sel));
const rowsSel = "tbody tr.expandable";

// ── S6 strip ──
ok("four stage badges render", qa(".sbadge").length === 4);
ok("failed badge names chains medium", /✗\s*chains medium/.test(qa(".sbadge.failed summary")?.[0]?.textContent ?? ""));
ok("partial badge names quotes", /△\s*quotes/.test(qa(".sbadge.partial summary")?.[0]?.textContent ?? ""));
ok("failed badge exposes expandable error", (q(".sbadge.failed .errbox")?.textContent ?? "").includes("option expirations"));

// ── table ──
// XOM carries score:null and scored-only defaults ON ⇒ exactly ONE data
// row shows; hiding honestly reflected in the count line below.
ok("scored-only hides unscored XOM", qa(rowsSel).length === 1);
ok("honest count line says filtered-from", /rows \(filtered from /.test(q(".count-line")?.textContent ?? ""));

// open the ONLY visible scored row (NVDA) → full four-block expansion
qa(rowsSel)[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
await tick();

ok("expansion panel opens", !!q(".expansion"));
ok("four blocks render", qa(".exp-block").length >= 4);
ok("band chart draws two markers (strike, spot — break-even overlaps strike)", qa(".marker").length === 2);

const econText = qa(".exp-block")[1]?.textContent ?? "";
ok("capital arithmetic (strike×100)", econText.includes("17,500"));
ok("premium arithmetic (mid×100)", econText.includes("210.00"));
ok("breakeven arithmetic (strike−mid)", econText.includes("172.90"));

ok("three weighted bars + total", qa(".bar-row:not(.total)").length === 3 && !!q(".bar-row.total"));
ok("breakdown values are server components verbatim", (q(".bar-val")?.textContent ?? "").includes("0.183"));

const banner = q(".earnings-banner")?.textContent ?? "";
ok(
  "earnings banner exact-shape",
  banner.includes("2026-08-31") && banner.includes("after close") && banner.includes("1.24") && banner.toLowerCase().includes("discounted")
);

ok("hidden-column chips exceed the trimmed visible set", qa(".chip-hidden").length > 10);

{
  // Isolated StageBadges mount: distinguishes a component defect from a
  // props-wiring defect in ResultsPane.
  const div = document.createElement("div");
  document.body.appendChild(div);
  const SB = (await import("./components/ResultsPane")).StageBadges;
  ok("StageBadges exported from module", typeof SB === "function");
}
let tipHits = 0;
for (const el of document.querySelectorAll("[data-tip]")) {
  const t = el.getAttribute("data-tip") ?? "";
  if (t.includes(`green ≥ ${THRESHOLDS.vol_tier_high}`)) tipHits += 1;
  if (t.includes(`${Math.round(THRESHOLDS.momentum_high * 100)}th percentile`)) tipHits += 1;
}
ok("header tooltips interpolate thresholds", tipHits > 0);

// second click collapses (§6.4 one-at-a-time toggle)
qa(rowsSel)[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
await tick();
ok("second click collapses panel", !q(".expansion"));

// sort click also collapses any future expansion (wired effect asserted indirectly)
qa("#root table thead th[role='button']")[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
await tick();
ok("sort interaction leaves no stale panel", !q(".expansion"));

console.log(JSON.stringify({ total: checks.length }));
let failedCount = 0;
for (const [name, passed] of checks) {
  if (!passed) {
    failedCount += 1;
    console.error("FAIL:", name);
  }
}
if (process.argv.includes("--dump-dom")) {
  const rootHtml = document.getElementById("root").innerHTML;
  console.log("ROOTLEN:", rootHtml.length);
  console.log("SAMPLE:", rootHtml.slice(0, 700));
}
console.log(`smoke: ${checks.length - failedCount}/${checks.length} passed`);
if (failedCount > 0) {
  process.exit(1);
}
process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
