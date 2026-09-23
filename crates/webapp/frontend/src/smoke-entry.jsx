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

// ── holdings panel — side-rail sub-tabs (2026-09-19-holdings-subtabs) ──
// One mount against a MUTABLE mocked /api/holdings (refetches reflect
// mutations), walking the feature-acceptance scenario end to end: LOTS
// active by default → set cash → sell call from a lot → PUTS add /
// refresh / assigned stage-2 / bought-back → CALLS called-away → empty
// pane — with the cash strip, Refresh marks and notice reachable from
// every tab (the panel is the server's view verbatim; the mock owns the
// pace math and the ledger state).
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
  const VIEWLESS_VIEW = {
    pl_dollars: null,
    pl_pct: null,
    pace_per_day_dollars: null,
    pace_per_day_pct: null,
    days_elapsed: 2,
    days_total: 5,
    target_pct: 0.4,
    pace_met: false,
    spot_pct_vs_strike: null,
  };
  const POSITION_VIEWLESS = {
    ...POSITION,
    id: "h2",
    symbol: "AMD",
    strike: 417.5,
    premium: 3.75,
    mark: null,
    view: VIEWLESS_VIEW,
  };
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
    acquired: "2026-09-08", mark: { as_of: "2026-09-08T19:00:00Z" },
    view: {
      value: 74000.0, pl_dollars: 4200.0, pl_pct: 4200 / 69800,
      capacity: 2, covered: 2, spot: 370.0,
      spot_as_of: "2026-09-08T19:00:00Z", age_days: 0,
    },
  };

  // Mutable ledger — mutations rewrite it, every GET reflects it.
  let positions, openCalls, lotsArr, cashState, seq, addedPutId;
  const resetLedger = () => {
    positions = [POSITION];
    openCalls = [CALL_ITM];
    lotsArr = [LOT];
    cashState = null;
    seq = 0;
    addedPutId = null;
  };
  resetLedger();

  const seen = [];
  const jsonRes = (v) =>
    new Response(JSON.stringify(v), { status: 200, headers: { "Content-Type": "application/json" } });
  globalThis.fetch = async (path, opts = {}) => {
    const method = opts.method ?? "GET";
    const body = opts.body ? JSON.parse(opts.body) : null;
    seen.push([String(path), method, body]);
    if (path === "/api/holdings" && method === "GET") {
      return jsonRes({
        schema_version: 1,
        positions,
        calls: openCalls,
        lots: lotsArr,
        cash: cashState,
        cash_reserved: 70000,
        cash_free: cashState == null ? null : cashState - 70000,
      });
    }
    if (path === "/api/holdings" && method === "POST") {
      if (body?.kind === "lot") {
        if (body.assigned_from != null)
          positions = positions.filter((p) => p.id !== body.assigned_from);
        seq += 1;
        lotsArr = [
          ...lotsArr,
          {
            id: `lx${seq}`, symbol: body.symbol, shares: body.shares,
            basis_per_share: body.basis_per_share, acquired: body.acquired,
            assigned_from: body.assigned_from ?? null, mark: null,
            view: { spot: null, pl_dollars: null, pl_pct: null, covered: 0, capacity: Math.floor(body.shares / 100) },
          },
        ];
        return jsonRes({ lot: lotsArr[lotsArr.length - 1] });
      }
      if (body?.kind === "call") {
        seq += 1;
        openCalls = [
          ...openCalls,
          { id: `cx${seq}`, symbol: body.symbol, strike: body.strike, premium: body.premium,
            contracts: body.contracts, sold: body.sold, expiry: body.expiry, mark: null, view: VIEWLESS_VIEW },
        ];
        return jsonRes({ position: openCalls[openCalls.length - 1] });
      }
      seq += 1;
      addedPutId = `hx${seq}`;
      positions = [
        ...positions,
        { ...POSITION_VIEWLESS, id: addedPutId, symbol: body.symbol, strike: body.strike,
          premium: body.premium, contracts: body.contracts, sold: body.sold, expiry: body.expiry },
      ];
      return jsonRes({ position: positions[positions.length - 1] });
    }
    if (path === "/api/holdings/refresh" && method === "POST")
      return jsonRes({ schema_version: 1, refresh: { ok: [], stale: [] } });
    if (path === "/api/holdings/cash" && method === "PATCH") {
      cashState = body.cash;
      return jsonRes({ cash: cashState, cash_reserved: 70000, cash_free: cashState - 70000 });
    }
    if (path === "/api/holdings/called-away" && method === "POST") {
      const call = openCalls.find((c) => c.id === body.call_id);
      openCalls = openCalls.filter((c) => c.id !== body.call_id);
      let remaining = (call?.contracts ?? 0) * 100;
      const kept = [];
      for (const lot of lotsArr) {
        if (remaining > 0 && lot.symbol === call?.symbol) {
          const take = Math.min(lot.shares, remaining);
          remaining -= take;
          const shares = lot.shares - take;
          if (shares > 0) kept.push({ ...lot, shares, view: { ...lot.view, shares } });
        } else kept.push(lot);
      }
      lotsArr = kept;
      return jsonRes({ reduced: true });
    }
    if (method === "DELETE" && String(path).startsWith("/api/holdings/")) {
      const id = String(path).split("/").pop();
      positions = positions.filter((p) => p.id !== id);
      openCalls = openCalls.filter((c) => c.id !== id);
      return jsonRes({ removed: id });
    }
    return new Response("not found", { status: 404 });
  };

  const div = document.createElement("div");
  div.id = "holdings-root";
  document.body.appendChild(div);
  render(() => <HP />, div);
  await tick();

  const rootSel = "#holdings-root";
  const rootEl = q(rootSel);
  const setVal = (el, v) => {
    if (!el) return; // red runs report missing layout via FAIL lines, not crashes
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const tiles = () => qa(`${rootSel} .hp-tab-tile`);
  const tileSel = (i) => tiles()[i];

  // [R3] Tab model: order, default selection, counts + context lines.
  ok("tiles render in LOTS, PUTS, CALLS order", tiles().map((t) => t.querySelector(".hp-tab-tile-name")?.textContent).join(",") === "LOTS,PUTS,CALLS");
  ok("LOTS is the active tab on load", !!tileSel(0)?.classList.contains("active") && !tileSel(1)?.classList.contains("active"));
  ok("tile counts reflect the document", tiles().map((t) => t.querySelector(".hp-tab-tile-count")?.textContent).join(",") === "1,1,1");
  ok("tile context lines", (tileSel(0)?.textContent ?? "").includes("200 sh held") && (tileSel(1)?.textContent ?? "").includes("1 pace-met") && (tileSel(2)?.textContent ?? "").includes("1 ITM"));

  // [R1] Desktop side-rail: brand + cash strip in the rail, title + refresh in the pane head.
  ok("rail carries the brand line and the cash strip", (q(`${rootSel} .hp-tabs-brand`)?.textContent ?? "").includes("Wheel ledger") && !!q(`${rootSel} .hp-tabs-rail .hp-rail-block`));
  ok("pane head carries the active title and Refresh marks", (q(`${rootSel} .hp-pane-title`)?.textContent ?? "").includes("Lots") && !!q(`${rootSel} .hp-pane-head .holdings-refresh`));

  // [R5] Cash strip: honest — while unset, first-set flow PATCHes and
  // re-renders from the response — all visible from the default LOTS tab.
  const rail0 = q(`${rootSel} .hp-tabs-rail`)?.textContent ?? "";
  ok("cash strip renders reserved while cash is unset", rail0.includes("$70,000"));
  ok("free is an honest — while cash is unset", rail0.includes("—"));
  ok("set-cash affordance offered", (q(`${rootSel} .hp-cash-edit`)?.textContent ?? "") === "set cash");
  q(`${rootSel} .hp-cash-edit`)?.click();
  await tick();
  setVal(q(`${rootSel} .hp-cash-editor input`), "150000");
  qa(`${rootSel} .hp-cash-editor button`).find((b) => b.textContent === "save")?.click();
  await tick();
  const rail1 = q(`${rootSel} .hp-tabs-rail`)?.textContent ?? "";
  ok("cash edit PATCHes and re-renders from the response", seen.some(([p, m]) => m === "PATCH" && p === "/api/holdings/cash") && rail1.includes("$80,000") && rail1.includes("$150,000"));

  // [R4 · LOTS] lot row + lot-anchored sell call (prefill floor(shares/100)).
  ok("lot row reports covered 2/2", (rootEl.textContent ?? "").includes("covered 2/2"));
  qa(`${rootSel} button`).find((b) => b.textContent.includes("sell call…"))?.click();
  await tick();
  ok("sell-call prefill is floor(shares/100)", q(`${rootSel} .holdings-outcome input[inputmode='numeric']`)?.value === "2");
  const postsBeforeLot = seen.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
  qa(`${rootSel} .holdings-outcome button`).find((b) => b.textContent === "Sell call")?.click();
  await tick();
  ok("sell-call form validates before submit", seen.filter(([p, m]) => p === "/api/holdings" && m === "POST").length === postsBeforeLot && !!q(`${rootSel} .holdings-outcome`));
  setVal(q(`${rootSel} .holdings-outcome input[placeholder='e.g. 360.00']`), "380");
  setVal(q(`${rootSel} .holdings-outcome input[placeholder='e.g. 1.20']`), "1.50");
  qa(`${rootSel} .holdings-outcome button`).find((b) => b.textContent === "Sell call")?.click();
  await tick();
  const sellPost = seen.find(([p, m, b]) => m === "POST" && b?.kind === "call");
  ok("valid sell call submits kind call from the lot", !!sellPost && sellPost[2].symbol === "GOOG" && sellPost[2].contracts === 2 && sellPost[2].strike === 380);
  ok("CALLS tile count updates after the sell", tiles().map((t) => t.querySelector(".hp-tab-tile-count")?.textContent).join(",") === "1,1,2");

  // [R4 · PUTS] switch tabs: put rows render per pane (kind-filtered).
  tileSel(1)?.click();
  await tick();
  ok("PUTS tab activates on click", !!tileSel(1)?.classList.contains("active") && !tileSel(0)?.classList.contains("active"));
  ok("holdings row renders title with contract count", (rootEl.textContent ?? "").includes("GOOG 350P ×1"));
  ok("holdings row shows the premium anchor", (rootEl.textContent ?? "").includes("$1.00"));
  ok("pace bar tick sits at the server target", (q(`${rootSel} .holdings-bar-mark`)?.style?.left ?? "") === "40%");
  ok("pace-met row carries the buy-back chip", (rootEl.textContent ?? "").includes("buy back?"));
  ok("mark age is visible", (rootEl.textContent ?? "").includes("ago"));
  const spotCell = qa(`${rootSel} .holdings-card-stats div`).find((d) => d.querySelector("span")?.textContent === "spot");
  ok("spot cell renders price and % vs strike", !!spotCell && spotCell.textContent.includes("331.20") && spotCell.textContent.includes("-5.4% vs strike"));
  ok("spot below strike is danger-colored", !!spotCell?.querySelector("i.holdings-neg"));
  ok("stat strip has four cells", qa(`${rootSel} .hp-list-stats > div`).length >= 4);
  const googRow = qa(`${rootSel} .hp-list-row`).find((c) => c.textContent.includes("GOOG"));
  ok("reference row shows +50.0%", !!googRow && googRow.textContent.includes("+50.0%"));
  ok("reference row shows target 40%", !!googRow && googRow.textContent.includes("target 40%"));
  ok("reference row shows 2/5 working days", !!googRow && googRow.textContent.includes("2/5 wd"));
  ok("reference row shows NOW mid 0.50", !!googRow && googRow.textContent.includes("0.50"));
  ok("reference row shows CLOSE CAPTURES $50.00", !!googRow && googRow.textContent.includes("$50.00"));

  // [R4 · PUTS] pane add button: decimals survive the round trip; empty
  // submit is blocked (no numbers ⇒ no POST, form stays open).
  qa(`${rootSel} .hp-toolbar-row button`).find((b) => b.textContent.includes("Sell put"))?.click();
  await tick();
  setVal(rootEl.querySelector('.holdings-add input[placeholder="SYMBOL"]'), "AMD");
  setVal(rootEl.querySelector('.holdings-add input[placeholder="e.g. 350.00"]'), "417.50");
  setVal(rootEl.querySelector('.holdings-add input[placeholder="e.g. 1.00"]'), "3.75");
  qa(".holdings-add button").find((b) => b.textContent === "Sell put")?.click();
  await tick();
  const addPutPost = seen.find(([p, m, b]) => m === "POST" && b?.symbol === "AMD" && b?.strike === 417.5);
  ok("add POST carries the typed decimals", !!addPutPost && addPutPost[2].premium === 3.75);
  ok("unpriced row renders the empty-mark state", (rootEl.textContent ?? "").includes("unpriced"));
  ok("PUTS tile count updates after the add", tiles().map((t) => t.querySelector(".hp-tab-tile-count")?.textContent).join(",") === "1,2,2");
  const postsBefore2 = seen.filter(([p, m]) => p === "/api/holdings" && m === "POST").length;
  qa(`${rootSel} .hp-toolbar-row button`).find((b) => b.textContent.includes("Sell put"))?.click();
  await tick();
  qa(".holdings-add button").find((b) => b.textContent === "Sell put")?.click();
  await tick();
  ok("empty numeric fields block submit", seen.filter(([p, m]) => p === "/api/holdings" && m === "POST").length === postsBefore2 && !!q(".holdings-add"));
  qa(".holdings-add button").find((b) => b.textContent === "Cancel")?.click();
  await tick();

  // [R5] Refresh marks from a non-default tab: POST + notice, tab survives
  // the reload.
  qa(`${rootSel} button`).find((b) => b.textContent.includes("Refresh marks"))?.click();
  await tick();
  ok("refresh POSTs and the notice confirms from PUTS", seen.some(([p, m]) => p === "/api/holdings/refresh" && m === "POST") && (q(`${rootSel} .holdings-notice`)?.textContent ?? "").includes("Marks refreshed"));
  ok("active tab survives the reload", !!tileSel(1)?.classList.contains("active"));

  // [R4 · PUTS] assigned flow: stage-2 prefilled lot form in the same slot;
  // recording POSTs kind:"lot" with assigned_from and the mock removes the
  // put — PUTS count drops, LOTS count rises.
  const putSlot = qa(`${rootSel} .hp-slot`).find((s) => s.textContent.includes("350P"));
  putSlot?.querySelector(".holdings-close-btn")?.click();
  await tick();
  ok("close panel renders inside the clicked position's slot", !!putSlot?.querySelector(".holdings-outcome"));
  ok("only one panel exists in the DOM", qa(`${rootSel} .holdings-outcome`).length === 1);
  const radios = qa(`${rootSel} .holdings-outcome input[type="radio"]`);
  radios.find((r) => r.nextSibling?.textContent?.includes("assigned"))?.click();
  await tick();
  setVal(q(`${rootSel} .holdings-outcome input[inputmode="decimal"]`), "340");
  qa(`${rootSel} .holdings-outcome button`).find((b) => b.textContent === "Confirm")?.click();
  await tick();
  const lotForm = putSlot.querySelector(".holdings-outcome");
  ok("assigned flow reveals the prefilled lot form under the put", !!lotForm && lotForm.textContent.includes("Record assigned shares"));
  const sharesVal = lotForm?.querySelector('input[inputmode="numeric"]')?.value;
  const basisVal = lotForm?.querySelector('input[inputmode="decimal"]')?.value;
  ok("prefill pins shares = contracts×100 and basis = strike − premium", sharesVal === "100" && Number(basisVal) === 349);
  lotForm?.querySelector('button[type="submit"]')?.click();
  await tick();
  const assignPost = seen.find(([p, m, b]) => m === "POST" && b?.assigned_from != null);
  ok("recording POSTs kind lot with assigned_from", !!assignPost && assignPost[2].kind === "lot" && assignPost[2].assigned_from === "h1" && assignPost[2].shares === 100 && assignPost[2].basis_per_share === 349);
  ok("tile counts follow the assignment", tiles().map((t) => t.querySelector(".hp-tab-tile-count")?.textContent).join(",") === "2,1,2");

  // [R4 · PUTS] bought-back on the unpriced add: three outcomes offered,
  // confirm DELETEs the position.
  qa(`${rootSel} .hp-list-row`)
    .find((c) => c.textContent.includes("AMD"))
    ?.querySelector(".holdings-close-btn")
    ?.click();
  await tick();
  ok("outcome dialog offers the three outcomes", ["bought back", "expired", "assigned"].every((o) => (q(`${rootSel} .holdings-outcome`)?.textContent ?? "").toLowerCase().includes(o)));
  setVal(q(`${rootSel} .holdings-outcome input[inputmode="decimal"]`), "400");
  qa(`${rootSel} .holdings-outcome button`).find((b) => b.textContent === "Confirm")?.click();
  await tick();
  ok("outcome confirm DELETEs the position", seen.some(([p, m]) => m === "DELETE" && p === `/api/holdings/${addedPutId}`));

  // [R4 · CALLS] ITM chip + danger vs-strike, then called away: the call
  // leaves, the covering lot is FIFO-reduced (tile + context follow).
  tileSel(2)?.click();
  await tick();
  ok("CALLS tab activates", !!tileSel(2)?.classList.contains("active"));
  const itmRow = qa(`${rootSel} .hp-list-row`).find((r) => r.textContent.includes("360C"));
  ok("ITM call shows the called-away chip", !!itmRow && itmRow.textContent.includes("ITM — called away?"));
  const spotDiv = qa(`${rootSel} .hp-list-stats div`).find((d) => d.querySelector("span")?.textContent === "spot");
  ok("ITM vs-strike figure is danger-colored", !!spotDiv?.querySelector("i.holdings-neg") && spotDiv.textContent.includes("+2.8% vs strike"));
  itmRow?.querySelector(".holdings-close-btn")?.click();
  await tick();
  const callRadios = qa(`${rootSel} .holdings-outcome input[type="radio"]`);
  callRadios.find((r) => r.nextSibling?.textContent?.includes("called away"))?.click();
  await tick();
  qa(`${rootSel} .holdings-outcome button`).find((b) => b.textContent === "Confirm")?.click();
  await tick();
  ok("called-away POSTs the call id", seen.some(([p, m, b]) => m === "POST" && p === "/api/holdings/called-away" && b?.call_id === "c1"));
  ok("tile counts follow the called-away reduction", tiles().map((t) => t.querySelector(".hp-tab-tile-count")?.textContent).join(",") === "1,0,1");
  ok("LOTS context reflects the reduced shares", (tileSel(0)?.textContent ?? "").includes("100 sh held"));

  // [R4] one-dialog rule across tabs: the dialog lives with its pane —
  // gone when another tab is active, back when the owning tab returns.
  qa(`${rootSel} .hp-list-row`)
    .find((r) => r.textContent.includes("380C"))
    ?.querySelector(".holdings-close-btn")
    ?.click();
  await tick();
  ok("close dialog open on CALLS", qa(`${rootSel} .holdings-outcome`).length === 1);
  tileSel(1)?.click();
  await tick();
  ok("dialog not rendered while another tab is active", qa(`${rootSel} .holdings-outcome`).length === 0);
  tileSel(2)?.click();
  await tick();
  ok("dialog returns with the owning tab", qa(`${rootSel} .holdings-outcome`).length === 1);
  qa(`${rootSel} .holdings-outcome button`).find((b) => b.textContent === "Cancel")?.click();
  await tick();

  // [R4] empty state: both puts are gone — the PUTS pane says so.
  tileSel(1)?.click();
  await tick();
  ok("empty pane shows its per-tab message", (rootEl.textContent ?? "").includes("No open puts"));
}

// ── cash pools rail + put-form pool picker (2026-09-23-holdings-cash-pools,
// list UX after preview feedback) ──
// A pools-aware mock (two pools, one unpriced put in each) walks the rail:
// the always-visible pool list renders per-pool figures verbatim from the
// document, picking a row switches the strip, every row carries its own
// cash/rename/delete, the add row exists even at zero pools, and the PUTS
// form's pool dropdown submits the chosen pool_id.
{
  const HP = (await import("./components/HoldingsPanel")).default;
  let poolsDoc, positionsDoc, seq2;
  const resetPools = () => {
    seq2 = 0;
    positionsDoc = [];
    poolsDoc = [
      { id: "main", name: "Main", cash: 80000, reserved: 10000, free: 70000 },
      { id: "pibkr", name: "IBKR", cash: 50000, reserved: 10000, free: 40000 },
    ];
  };
  resetPools();
  const seen2 = [];
  const jsonRes2 = (v) =>
    new Response(JSON.stringify(v), { status: 200, headers: { "Content-Type": "application/json" } });
  const setVal2 = (el, v) => {
    if (!el) return;
    el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
  globalThis.fetch = async (path, opts = {}) => {
    const method = opts.method ?? "GET";
    const body = opts.body ? JSON.parse(opts.body) : null;
    seen2.push([String(path), method, body]);
    if (path === "/api/holdings" && method === "GET") {
      return jsonRes2({
        schema_version: 1,
        positions: positionsDoc,
        calls: [],
        lots: [],
        cash: poolsDoc.reduce((n, p) => n + p.cash, 0),
        cash_reserved: poolsDoc.reduce((n, p) => n + p.reserved, 0),
        cash_free: poolsDoc.reduce((n, p) => n + p.free, 0),
        cash_pools: poolsDoc,
      });
    }
    if (path === "/api/holdings" && method === "POST") {
      if (body?.kind === "pool") {
        seq2 += 1;
        poolsDoc = [...poolsDoc, { id: `px${seq2}`, name: body.name, cash: 0, reserved: 0, free: 0 }];
        return jsonRes2({ pool: poolsDoc[poolsDoc.length - 1] });
      }
      seq2 += 1;
      // Server-faithful position: option_json fields incl. a view (the
      // real server always computes one) and the resolved pool name
      // (its pool, or the first pool when pool_id is absent).
      const effPool = poolsDoc.find((p) => p.id === (body?.pool_id ?? poolsDoc[0]?.id));
      const pos = {
        id: `hx${seq2}`,
        symbol: body?.symbol, strike: body?.strike, premium: body?.premium,
        contracts: body?.contracts, sold: body?.sold, expiry: body?.expiry,
        mark: null,
        pool_id: body?.pool_id ?? null,
        pool_name: effPool?.name ?? "Main",
        view: {
          pl_pct: null, target_pct: 0.2, pace_met: false,
          days_elapsed: 0, days_total: 5, spot_pct_vs_strike: null, pl_dollars: null,
        },
      };
      positionsDoc = [...positionsDoc, pos];
      return jsonRes2({ position: pos });
    }
    if (path === "/api/holdings/cash" && method === "PATCH") {
      poolsDoc = poolsDoc.map((p) =>
        p.id === (body?.pool_id ?? p.id)
          ? { ...p, ...(body?.cash != null ? { cash: body.cash } : {}), ...(body?.name ? { name: body.name } : {}) }
          : p
      );
      // Server-verbatim shape: aggregates + the targeted pool's view.
      return jsonRes2({
        cash: poolsDoc.reduce((n, p) => n + p.cash, 0),
        cash_reserved: poolsDoc.reduce((n, p) => n + p.reserved, 0),
        cash_free: poolsDoc.reduce((n, p) => n + p.free, 0),
        pool: poolsDoc.find((p) => p.id === body?.pool_id) ?? null,
      });
    }
    if (method === "DELETE" && String(path).startsWith("/api/holdings/")) {
      const id = String(path).split("/").pop();
      poolsDoc = poolsDoc.filter((p) => p.id !== id);
      return jsonRes2({ removed: id });
    }
    return new Response("not found", { status: 404 });
  };

  const div = document.createElement("div");
  div.id = "pools-root";
  document.body.appendChild(div);
  render(() => <HP />, div);
  await tick();
  const rsel = "#pools-root";
  const poolRows = () => qa(`${rsel} .hp-pool-item`);
  const rowName = (i) => poolRows()[i]?.querySelector(".hp-pool-name")?.textContent;
  const rail = () => q(`${rsel} .hp-tabs-rail`)?.textContent ?? "";

  ok("pool list renders both pools", rowName(0) === "Main" && rowName(1) === "IBKR");
  ok("first pool selected by default", poolRows()[0]?.classList.contains("active") && !poolRows()[1]?.classList.contains("active"));
  ok("strip shows the selected pool's figures", rail().includes("$70,000") && rail().includes("$80,000 cash − $10,000 reserved"));
  poolRows()[1]?.querySelector(".hp-pool-name")?.click();
  await tick();
  ok("picking a row switches the strip's figures", poolRows()[1]?.classList.contains("active") && rail().includes("$40,000") && rail().includes("$50,000 cash − $10,000 reserved"));

  // Per-row cash edit: the IBKR row's "cash" button opens the editor
  // targeted at IBKR — the PATCH carries its pool_id and the strip
  // re-renders the pool's new figures.
  Array.from(poolRows()[1].querySelectorAll("button")).find((b) => b.textContent === "cash")?.click();
  await tick();
  setVal2(q(`${rsel} .hp-cash-editor input`), "60000");
  qa(`${rsel} .hp-cash-editor button`).find((b) => b.textContent === "save")?.click();
  await tick();
  const poolCashPatch = seen2.find(([p2, m, b]) => m === "PATCH" && b?.cash === 60000);
  ok("row cash edit PATCHes with pool_id", !!poolCashPatch && poolCashPatch[2].pool_id === "pibkr");
  ok("strip re-renders the edited pool", rail().includes("$60,000 cash − $10,000 reserved"));

  // Cancel: opening the cash editor for Main and hitting cancel closes it
  // with no PATCH fired.
  Array.from(poolRows()[0].querySelectorAll("button")).find((b) => b.textContent === "cash")?.click();
  await tick();
  Array.from(q(`${rsel} .hp-cash-editor`).querySelectorAll("button")).find((b) => b.textContent === "cancel")?.click();
  await tick();
  ok(
    "cash editor cancel closes without PATCHing",
    !q(`${rsel} .hp-cash-editor`) &&
      !!q(`${rsel} .hp-cash-edit`) &&
      !seen2.some(([p2, m, b]) => m === "PATCH" && b?.cash === 80000)
  );

  // Per-row rename: the IBKR row's "rename" button swaps in an input;
  // save PATCHes the name and the row re-renders with it.
  Array.from(poolRows()[1].querySelectorAll("button")).find((b) => b.textContent === "rename")?.click();
  await tick();
  setVal2(q(`${rsel} .hp-pool-item input`), "IBKR LLC");
  Array.from(poolRows()[1].querySelectorAll("button")).find((b) => b.textContent === "save")?.click();
  await tick();
  const renamePatch = seen2.find(([p2, m, b]) => m === "PATCH" && b?.name === "IBKR LLC");
  ok("rename PATCHes the pool name", !!renamePatch && renamePatch[2].pool_id === "pibkr");
  await tick();
  ok("row re-renders with the new name", rowName(1) === "IBKR LLC");

  // Rename cancel (Escape this time): the input closes, the name and the
  // ledger are untouched.
  Array.from(poolRows()[1].querySelectorAll("button")).find((b) => b.textContent === "rename")?.click();
  await tick();
  const renameInput = q(`${rsel} .hp-pool-item input`);
  setVal2(renameInput, "nope");
  renameInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await tick();
  ok(
    "rename cancel (Escape) exits without PATCHing",
    !q(`${rsel} .hp-pool-item input`) &&
      rowName(1) === "IBKR LLC" &&
      !seen2.some(([p2, m, b]) => m === "PATCH" && b?.name === "nope")
  );

  // Add: type a name in the always-visible add row → POST kind pool, a
  // third row appears (Enter also submits — the input owns that path).
  setVal2(q(`${rsel} .hp-pool-add input`), "FUTU");
  qa(`${rsel} .hp-pool-add button`).find((b) => b.textContent === "add")?.click();
  await tick();
  ok("add POSTs kind pool and a row appears", seen2.some(([p2, m, b]) => m === "POST" && b?.kind === "pool" && b?.name === "FUTU") && poolRows().length === 3 && rowName(2) === "FUTU");

  // Delete: the × on the FUTU row → DELETE, row gone.
  poolRows()[2]?.querySelector(".hp-pool-del")?.click();
  await tick();
  ok("delete DELETEs the pool and the row goes", seen2.some(([p2, m]) => m === "DELETE" && p2.endsWith("/px1")) && poolRows().length === 2);

  // Put form: the pool dropdown lists the pools and submits the choice.
  qa(`${rsel} .hp-tab-tile`)[1]?.click();
  await tick();
  qa(`${rsel} .hp-toolbar-row button`).find((b) => b.textContent.includes("Sell put"))?.click();
  await tick();
  const poolSelect = q(`${rsel} .holdings-add select`);
  ok("put form shows a pool dropdown with both pools", !!poolSelect && poolSelect.querySelectorAll("option").length === 2 && poolSelect.value === "main");
  setVal2(q(`${rsel} .holdings-add input[placeholder="SYMBOL"]`), "AMD");
  setVal2(q(`${rsel} .holdings-add input[placeholder="e.g. 350.00"]`), "100");
  setVal2(q(`${rsel} .holdings-add input[placeholder="e.g. 1.00"]`), "1.00");
  poolSelect.value = "pibkr";
  poolSelect.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
  qa(`${rsel} .holdings-add button`).find((b) => b.textContent === "Sell put")?.click();
  await tick();
  const poolPut = seen2.find(([p2, m, b]) => m === "POST" && b?.symbol === "AMD");
  ok("put POST carries the chosen pool_id", !!poolPut && poolPut[2].pool_id === "pibkr");
  await tick();
  ok(
    "put row names the pool it spends",
    q(`${rsel} .hp-list-pos .hp-pool-tag`)?.textContent === "IBKR LLC"
  );

  // Zero-pool ledger: the add row is STILL offered — under the old UI it
  // was hidden entirely, so the first pool could never be created (the
  // preview feedback that drove this rework). Adding it materializes Main
  // server-side and the row appears.
  poolsDoc = [];
  positionsDoc = [];
  document.getElementById("pools-root").remove();
  const div2 = document.createElement("div");
  div2.id = "pools-root2";
  document.body.appendChild(div2);
  render(() => <HP />, div2);
  await tick();
  const rsel2 = "#pools-root2";
  ok(
    "zero-pool ledger still offers add-pool",
    qa(`${rsel2} .hp-pool-item`).length === 0 && !!q(`${rsel2} .hp-pool-add input`)
  );
  setVal2(q(`${rsel2} .hp-pool-add input`), "Main");
  qa(`${rsel2} .hp-pool-add button`).find((b) => b.textContent === "add")?.click();
  await tick();
  ok(
    "first pool can be created from an empty ledger",
    qa(`${rsel2} .hp-pool-item`).length === 1 &&
      q(`${rsel2} .hp-pool-item .hp-pool-name`)?.textContent === "Main"
  );
}

// ── dark mode (2026-09-23-dark-mode) ──
// R1 is CSS-cascade territory happy-dom can't compute, so the palette is
// asserted at the stylesheet level: the imported bundle must carry the
// system-follow media query and both explicit data-theme overrides. R2 is
// behavioral: the header toggle flips data-theme on <html>, reports the
// state a click switches to, and persists nothing.
{
  const cssText = Array.from(document.querySelectorAll("style"))
    .map((s) => s.textContent)
    .join("\n");
  const varNames = ["--page", "--panel", "--border", "--ink", "--muted", "--accent"];
  const blockHasVars = (block) => varNames.every((v) => block.includes(v));
  const mediaStart = cssText.indexOf("@media (prefers-color-scheme: dark)");
  ok("stylesheet carries the system-follow dark block", mediaStart !== -1);
  ok(
    "dark media query re-declares the palette variables",
    mediaStart !== -1 && blockHasVars(cssText.slice(mediaStart, mediaStart + 2000))
  );
  const darkSel = cssText.indexOf('html[data-theme="dark"]');
  const lightSel = cssText.indexOf('html[data-theme="light"]');
  ok(
    "explicit light/dark data-theme overrides exist",
    darkSel !== -1 && lightSel !== -1 && blockHasVars(cssText.slice(darkSel, darkSel + 2000))
  );

  const TT = (await import("./App")).ThemeToggle;
  const div = document.createElement("div");
  div.id = "theme-root";
  document.body.appendChild(div);
  render(() => <TT />, div);
  await tick();
  const btn = () => q("#theme-root button");
  ok("toggle mounts with an accessible name", !!btn() && (btn().getAttribute("aria-label") ?? "").length > 0);
  delete document.documentElement.dataset.theme;
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  btn()?.click();
  await tick();
  const firstForced = document.documentElement.dataset.theme;
  ok(
    "click forces the opposite of the effective system theme",
    firstForced === (sysDark ? "light" : "dark")
  );
  ok("aria-label flips with the forced theme", (btn().getAttribute("aria-label") ?? "").includes(sysDark ? "dark" : "light"));
  btn()?.click();
  await tick();
  ok(
    "second click returns to the other forced theme",
    document.documentElement.dataset.theme === (sysDark ? "dark" : "light")
  );
  ok(
    "toggle persists nothing (reload returns to system-follow)",
    localStorage.length === 0 && !sessionStorage.length
  );
  delete document.documentElement.dataset.theme;
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
