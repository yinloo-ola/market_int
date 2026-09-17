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
  const base = {
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
    price_percentile: 0.81,
    earnings_before_expiry: { report_date: "2026-08-31", report_time: "after_close", expected_eps: 1.24 },
    trend_short: 1.036,
    trend_long: 1.089,
    realized_vol: 0.452,
    implied_vol: 0.481,
    delta: -0.12, // post-fence (|Δ| ≤ 0.16)
    iv_rv_ratio: 1.0642,
    ...over,
  };
  // Formula-true scores: computed by the same JS port the GUI re-scoring
  // uses (pinned to Rust by scripts/run-parity.mjs), so the envelope can
  // never disagree with the scorer the way the old hand-made values did.
  const live = rescoreRow(base, PRODUCTION);
  base.score = live == null ? null : live.total;
  base.score_components =
    live == null ? null : { sharpe: live.sharpe, safety: live.safety, return: live.return };
  return base;
}

const STAGES = [
  { name: "quotes", status: "partial", error: "3 symbols failed: XYZ, ABC, QQQ", duration_secs: 92 },
  { name: "metrics", status: "ok", error: null, duration_secs: 3 },
  { name: "chains_short", status: "ok", error: null, duration_secs: 118 },
  { name: "chains_medium", status: "failed", error: "Failed to get option expirations for batch.", duration_secs: 4 },
];

document.body.innerHTML = `<div id="root"></div>`;

await import("./style.css").catch(() => {}); // style optional in smoke
const { render } = await import("solid-js/web");
const ResultsPane = (await import("./components/ResultsPane")).default;
const { createScoringStore } = await import("./components/RescoreControls");
const { PRODUCTION, rescoreRow } = await import("./lib/scoring");

// Built AFTER the imports: row() needs rescoreRow at evaluation time (the
// iife bundle renames dynamic-import bindings, so use-before-init throws).
const TF_SHORT_ROWS = [
  row(), // NVDA: scored + earnings + components
  // TSLA: below the production floor (0.17 < 0.20) but re-admittable — the
  // client-side floor slider's showcase row.
  row({
    underlying: "TSLA",
    sector: "Consumer Discretionary",
    strike: 180,
    rate_of_return: 0.17,
    sharpe_ratio: 1.2,
    delta: -0.08,
  }),
  // XOM: below floor AND sharpe 0 — stays unscored at any floor.
  row({ underlying: "XOM", sector: "Energy", rate_of_return: 0.1777, sharpe_ratio: 0.0 }),
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
    timeframes: { short: { expiration: "2026-09-02", row_count: 3, symbols_with_chains: 171, rows: TF_SHORT_ROWS, top_picks: [] } },
  },
};

const checks = [];
const ok = (name, cond) => checks.push([name, Boolean(cond)]);
const tick = () => new Promise((r) => setTimeout(r, 25));

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
const scoring = createScoringStore();

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
      scoring={scoring}
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

// ── client-side re-scoring (ticket 01 / .scratch/rescore) ──
scoring.setParam("minRateOfReturn", 0.15);
await tick();
ok("lower floor re-admits TSLA", qa("#root " + rowsSel).length === 2);
ok("count line reports re-admission", (q("#root .count-line")?.textContent ?? "").includes("re-admitted"));
ok("re-admitted tag on score cell", !!q("#root td.score-cell .score-frozen.readmit"));
ok("frozen production score shown", (qa("#root td.score-cell .score-frozen").map((e) => e.textContent).join(" ") ?? "").includes("prod 0.671"));
scoring.reset();
await tick();
ok("reset restores production view", qa("#root " + rowsSel).length === 1);

// ── holdings panel (2026-09-17-wheel-holdings, variant C) ──
// Mount against a mocked /api/holdings (server owns the pace math — the
// panel renders the view verbatim), then drive add + outcome flows through
// captured fetch calls.
{
  const HP = (await import("./components/HoldingsPanel")).default;
  const POSITION = {
    id: "h1",
    symbol: "GOOG",
    strike: 350,
    expiry: "2026-09-11",
    premium: 1.0,
    contracts: 1,
    sold: "2026-09-04",
    mark: { mid: 0.5, as_of: "2026-09-08T19:00:00Z", underlying_price: 331.2 },
    view: {
      pl_dollars: 50.0,
      pl_pct: 0.5,
      pace_per_day_dollars: 25.0,
      pace_per_day_pct: 0.25,
      days_elapsed: 2,
      days_total: 5,
      target_pct: 0.4,
      pace_met: true,
      spot_pct_vs_strike: (331.2 - 350) / 350,
    },
  };
  const POSITION_VIEWLESS = {
    ...POSITION,
    id: "h2",
    symbol: "AMD",
    strike: 417.5,
    premium: 3.75,
    mark: null,
    view: {
      pl_dollars: null,
      pl_pct: null,
      pace_per_day_dollars: null,
      pace_per_day_pct: null,
      days_elapsed: 2,
      days_total: 5,
      target_pct: 0.4,
      pace_met: false,
      spot_pct_vs_strike: null,
    },
  };
  const calls = [];
  const jsonRes = (v) =>
    new Response(JSON.stringify(v), { status: 200, headers: { "Content-Type": "application/json" } });
  globalThis.fetch = async (path, opts = {}) => {
    const method = opts.method ?? "GET";
    calls.push([String(path), method, opts.body ? JSON.parse(opts.body) : null]);
    if (path === "/api/holdings" && method === "GET") {
      // After the add POST, the new position shows up too (refetch).
      const didAdd = calls.some(([, m]) => m === "POST");
      return jsonRes({
        schema_version: 1,
        positions: didAdd ? [POSITION, POSITION_VIEWLESS] : [POSITION],
        calls: [],
        lots: [],
        cash: null,
        cash_reserved: 35000,
        cash_free: null,
      });
    }
    if (path === "/api/holdings" && method === "POST") return jsonRes({ position: POSITION_VIEWLESS });
    if (path === "/api/holdings/refresh") return jsonRes({ schema_version: 1, positions: [POSITION], refresh: { ok: ["h1"], stale: [] } });
    if (String(path).startsWith("/api/holdings/")) return jsonRes({ removed: String(path).split("/").pop() });
    return new Response("not found", { status: 404 });
  };

  const div = document.createElement("div");
  div.id = "holdings-root";
  document.body.appendChild(div);
  render(() => <HP />, div);
  await tick();

  ok("holdings row renders title with contract count", (q("#holdings-root")?.textContent ?? "").includes("GOOG 350P ×1"));
  ok("holdings row shows the premium anchor", (q("#holdings-root")?.textContent ?? "").includes("$1.00"));
  ok("pace bar tick sits at the server target", (q(".holdings-bar-mark")?.style?.left ?? "") === "40%");
  ok("pace-met row carries the buy-back chip", (q("#holdings-root")?.textContent ?? "").includes("buy back?"));
  ok("mark age is visible", (q("#holdings-root")?.textContent ?? "").includes("ago"));

  // R6: SPOT cell — price, % vs strike, danger color when below the strike.
  const spotCell = qa(".holdings-card-stats div").find((d) => d.querySelector("span")?.textContent === "spot");
  ok("spot cell renders price and % vs strike", !!spotCell && spotCell.textContent.includes("331.20") && spotCell.textContent.includes("-5.4% vs strike"));
  ok("spot below strike is danger-colored", !!spotCell?.querySelector("i.holdings-neg"));
  ok("stat strip has four cells", qa(".hp-list-stats > div").length >= 4);

  // Add form: decimals survive the round trip to the POST body.
  qa(".hp-toolbar-row button").find((b) => b.textContent.includes("Sell put"))?.click();
  await tick();
  const setVal = (el, v) => {
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const rootEl = q("#holdings-root");
  setVal(rootEl.querySelector('.holdings-add input[placeholder="SYMBOL"]'), "AMD");
  setVal(rootEl.querySelector('.holdings-add input[placeholder="e.g. 350.00"]'), "417.50");
  setVal(rootEl.querySelector('.holdings-add input[placeholder="e.g. 1.00"]'), "3.75");
  qa(".holdings-add button").find((b) => b.textContent === "Sell put")?.click();
  await tick();
  const addCall = calls.find(([, m, b]) => m === "POST" && b?.symbol === "AMD");
  ok("add POST carries the typed decimals", !!addCall && addCall[2].strike === 417.5 && addCall[2].premium === 3.75);
  ok("unpriced row renders the empty-mark state", (q("#holdings-root")?.textContent ?? "").includes("unpriced"));

  // Outcome flow: open the dialog on the priced row, confirm bought-back.
  qa(".hp-list-row")
    .find((c) => c.textContent.includes("GOOG"))
    ?.querySelector(".holdings-close-btn")
    ?.click();
  await tick();
  ok("outcome dialog offers the three outcomes", ["bought back", "expired", "assigned"].every((o) =>
    (q(".holdings-outcome")?.textContent ?? "").toLowerCase().includes(o)
  ));
  ok("outcome dialog previews realized P&L", (q(".holdings-outcome")?.textContent ?? "").includes("$50.00"));
  qa(".holdings-outcome button")
    .find((b) => b.textContent === "Confirm")
    ?.click();
  await tick();
  ok(
    "outcome confirm DELETEs the position",
    calls.some(([p, m]) => m === "DELETE" && p === "/api/holdings/h1")
  );

  // Reference-example values, verbatim from the design doc scenario.
  const googRow = qa(".hp-list-row").find((c) => c.textContent.includes("GOOG"));
  ok("reference row shows +50.0%", !!googRow && googRow.textContent.includes("+50.0%"));
  ok("reference row shows target 40%", !!googRow && googRow.textContent.includes("target 40%"));
  ok("reference row shows 2/5 working days", !!googRow && googRow.textContent.includes("2/5 wd"));
  ok("reference row shows NOW mid 0.50", !!googRow && googRow.textContent.includes("0.50"));
  ok("reference row shows CLOSE CAPTURES $50.00", !!googRow && googRow.textContent.includes("$50.00"));

  // Empty submit is blocked (no numbers ⇒ no POST, form stays open).
  const postsBefore = calls.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
  qa(".hp-toolbar-row button").find((b) => b.textContent.includes("Sell put"))?.click();
  await tick();
  qa(".holdings-add button").find((b) => b.textContent === "Sell put")?.click();
  await tick();
  const postsAfter = calls.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
  ok("empty numeric fields block submit", postsAfter === postsBefore && !!q(".holdings-add"));

  // Refresh marks: POST goes out, the notice confirms, the ledger refetches.
  qa(".hp-toolbar-row button").find((b) => b.textContent.includes("Refresh marks"))?.click();
  await tick();
  ok(
    "refresh POSTs and the notice confirms",
    calls.some(([p, m]) => p === "/api/holdings/refresh" && m === "POST") &&
      (q(".holdings-notice")?.textContent ?? "").includes("Marks refreshed")
  );

  // ── variant-C additions (R11): rail cash strip, kind chips + stats line,
  // ITM chip, inline close panel placement, assignment + sell-call
  // prefills, form validation before submit. Fresh mount with a full-wheel
  // fixture (put + ITM call + lot); cash starts unset to exercise the
  // first-set flow.
  {
    const CALL_ITM = {
      id: "c1", symbol: "GOOG", strike: 360, premium: 1.2, contracts: 2,
      sold: "2026-09-04", expiry: "2026-09-11",
      mark: { mid: 0.3, as_of: "2026-09-08T19:00:00Z", underlying_price: 370.0 },
      view: {
        pl_dollars: 180.0, pl_pct: 0.75, pace_per_day_dollars: 90.0,
        pace_per_day_pct: 0.375, days_elapsed: 2, days_total: 5,
        target_pct: 0.4, pace_met: true, spot_pct_vs_strike: (370 - 360) / 360,
      },
    };
    const LOT = {
      id: "l1", symbol: "GOOG", shares: 200, basis_per_share: 349.0,
      acquired: "2026-09-08", mark: { spot: 370.0, as_of: "2026-09-08T19:00:00Z" },
      view: {
        value: 74000.0, pl_dollars: 4200.0, pl_pct: 4200 / 69800,
        capacity: 2, covered: 2, spot: 370.0,
        spot_as_of: "2026-09-08T19:00:00Z", age_days: 0,
      },
    };
    let cashState = null; // document cash: null until first PATCH
    const calls2 = [];
    globalThis.fetch = async (path, opts = {}) => {
      const method = opts.method ?? "GET";
      calls2.push([String(path), method, opts.body ? JSON.parse(opts.body) : null]);
      if (path === "/api/holdings" && method === "GET") {
        return jsonRes({
          schema_version: 1,
          positions: [POSITION],
          calls: [CALL_ITM],
          lots: [LOT],
          cash: cashState,
          cash_reserved: 70000,
          cash_free: cashState == null ? null : cashState - 70000,
        });
      }
      if (path === "/api/holdings/cash" && method === "PATCH") {
        cashState = JSON.parse(opts.body).cash;
        return jsonRes({ cash: cashState, cash_reserved: 70000, cash_free: cashState - 70000 });
      }
      if (path === "/api/holdings" && method === "POST") return jsonRes({ lot: LOT });
      return new Response("not found", { status: 404 });
    };
    const div2 = document.createElement("div");
    div2.id = "holdings-root-2";
    document.body.appendChild(div2);
    render(() => <HP />, div2);
    await tick();

    // Rail: reserved derives even with cash unset; free renders as "—"
    // with a "set cash" affordance until the first PATCH.
    const rail0 = q("#holdings-root-2 .hp-rail")?.textContent ?? "";
    ok("rail renders reserved while cash is unset", rail0.includes("$70,000"));
    ok("rail free is an honest — while cash is unset", rail0.includes("—"));
    ok("rail offers the set-cash affordance", (q("#holdings-root-2 .hp-cash-edit")?.textContent ?? "") === "set cash");
    q("#holdings-root-2 .hp-cash-edit").click();
    await tick();
    setVal(q("#holdings-root-2 .hp-cash-editor input"), "150000");
    qa("#holdings-root-2 .hp-cash-editor button").find((b) => b.textContent === "save")?.click();
    await tick();
    ok(
      "cash edit PATCHes and the strip re-renders from the response",
      calls2.some(([p, m]) => m === "PATCH" && p === "/api/holdings/cash") &&
        (q("#holdings-root-2 .hp-rail")?.textContent ?? "").includes("$80,000") &&
        (q("#holdings-root-2 .hp-rail")?.textContent ?? "").includes("$150,000")
    );

    // Merged list: kind chips + full stats line; the ITM call carries the
    // called-away chip; the lot row reports covered 2/2.
    const kinds = qa("#holdings-root-2 .hp-kind").map((k) => k.textContent.trim()).sort();
    ok("merged rows carry kind chips", kinds.join(",") === "CALL,PUT");
    const itmRow = qa("#holdings-root-2 .hp-list-row").find((r) => r.textContent.includes("360C"));
    ok("ITM call shows the called-away chip", !!itmRow && itmRow.textContent.includes("ITM — called away?"));
    const spotDiv = qa("#holdings-root-2 .hp-list-stats div").find((d) => d.querySelector("span")?.textContent === "spot");
    ok("ITM vs-strike figure is danger-colored", !!spotDiv?.querySelector("i.holdings-neg") && spotDiv.textContent.includes("+2.8% vs strike"));
    ok("lot rail row reports covered 2/2", (q("#holdings-root-2 .hp-rail")?.textContent ?? "").includes("covered 2/2"));

    // Inline close panel: opens directly beneath the clicked position and
    // is the ONLY panel in the DOM.
    const putSlot = qa("#holdings-root-2 .hp-slot").find((s) => s.textContent.includes("350P"));
    putSlot.querySelector(".holdings-close-btn").click();
    await tick();
    ok("close panel renders inside the clicked position's slot", !!putSlot.querySelector(".holdings-outcome"));
    ok("only one panel exists in the DOM", qa("#holdings-root-2 .holdings-outcome").length === 1);

    // Assignment: choose assigned + price → the prefilled lot form appears
    // in the SAME slot (shares = contracts×100, basis = strike − premium);
    // recording POSTs kind:"lot" with assigned_from.
    const radios = qa(`${"#holdings-root-2"} .holdings-outcome input[type="radio"]`);
    radios.find((r) => r.nextSibling?.textContent?.includes("assigned"))?.click();
    await tick();
    setVal(q(`${"#holdings-root-2"} .holdings-outcome input[inputmode="decimal"]`), "340");
    qa("#holdings-root-2 .holdings-outcome button").find((b) => b.textContent === "Confirm")?.click();
    await tick();
    const lotForm = putSlot.querySelector(".holdings-outcome");
    ok("assigned flow reveals the prefilled lot form under the put", !!lotForm && lotForm.textContent.includes("Record assigned shares"));
    const sharesVal = lotForm?.querySelector('input[inputmode="numeric"]')?.value;
    const basisVal = lotForm?.querySelector('input[inputmode="decimal"]')?.value;
    ok("prefill pins shares = contracts×100 and basis = strike − premium", sharesVal === "100" && Number(basisVal) === 349);
    lotForm.querySelector('button[type="submit"]').click();
    await tick();
    const assignPost = calls2.find(([, m, b]) => m === "POST" && b?.assigned_from != null);
    ok(
      "recording POSTs kind lot with assigned_from",
      !!assignPost && assignPost[2].kind === "lot" && assignPost[2].assigned_from === "h1" &&
        assignPost[2].shares === 100 && assignPost[2].basis_per_share === 349
    );

    // Lot-anchored sell call: contracts prefilled floor(200/100), the free
    // Sell call form blocks an empty submit.
    qa("#holdings-root-2 .hp-rail button")
      .find((b) => b.textContent.includes("sell call…"))
      ?.click();
    await tick();
    ok(
      "sell-call prefill is floor(shares/100)",
      q("#holdings-root-2 .hp-rail .holdings-outcome input[inputmode='numeric']")?.value === "2"
    );
    const postsBefore2 = calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
    qa("#holdings-root-2 .hp-rail .holdings-outcome button")
      .find((b) => b.textContent === "Sell call")
      ?.click();
    await tick();
    ok(
      "sell-call form validates before submit",
      calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length === postsBefore2 &&
        !!q("#holdings-root-2 .hp-rail .holdings-outcome")
    );
    qa("#holdings-root-2 .hp-rail .holdings-outcome button")
      .find((b) => b.textContent === "Cancel")
      ?.click();
    await tick();
    const sellCallForm = qa("#holdings-root-2 .hp-rail button")
      .find((b) => b.textContent.includes("sell call…"));
    sellCallForm?.click();
    await tick();
    setVal(q("#holdings-root-2 .hp-rail .holdings-outcome input[placeholder='e.g. 360.00']"), "380");
    setVal(q("#holdings-root-2 .hp-rail .holdings-outcome input[placeholder='e.g. 1.20']"), "1.50");
    qa("#holdings-root-2 .hp-rail .holdings-outcome button")
      .find((b) => b.textContent === "Sell call")
      ?.click();
    await tick();
    const sellPost = calls2.find(([, m, b]) => m === "POST" && b?.kind === "call");
    ok(
      "valid sell call submits kind call from the lot",
      !!sellPost && sellPost[2].symbol === "GOOG" && sellPost[2].contracts === 2 && sellPost[2].strike === 380
    );

    // Free-field Sell call form (toolbar): empty submit is blocked.
    const postsBefore3 = calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
    qa("#holdings-root-2 .hp-toolbar-row button")
      .find((b) => b.textContent.includes("Sell call"))
      ?.click();
    await tick();
    qa("#holdings-root-2 .holdings-add button")
      .find((b) => b.textContent === "Sell call")
      ?.click();
    await tick();
    ok(
      "free sell-call form validates before submit",
      calls2.filter(([p, m]) => p === "/api/holdings" && m === "POST").length === postsBefore3
    );
  }
}

// Tab-strip persistence: the Holdings tab lives in the same strip as the
// timeframes and navigating both ways keeps the strip mounted (R5 criterion).
{
  const { TabsRow } = await import("./App");
  const { createSignal } = await import("solid-js");
  const [tab, setTab] = createSignal("short");
  const div = document.createElement("div");
  div.id = "tabs-root";
  document.body.appendChild(div);
  render(() => <TabsRow result={() => undefined} tab={tab} onTab={setTab} />, div);
  await tick();
  qa("#tabs-root .tab").find((b) => b.textContent.includes("Holdings"))?.click();
  await tick();
  const holdingsSelected = tab() === "holdings";
  qa("#tabs-root .tab").find((b) => b.textContent.startsWith("Short"))?.click();
  await tick();
  ok("tab strip routes to holdings and back", holdingsSelected && tab() === "short");
}

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
