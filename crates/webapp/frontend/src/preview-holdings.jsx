import { render } from "solid-js/web";
import HoldingsPanel from "./components/HoldingsPanel";
import "./style.css";

// Realistic senior-investor wheel ledger
const PREVIEW_LEDGER = {
  schema_version: 1,
  cash: 125000,
  cash_reserved: 40000,
  cash_free: 85000,
  cash_pools: [
    { id: "main-ira", name: "Main Retirement (IRA)", cash: 75000, reserved: 25000, free: 50000 },
    { id: "ibkr-tax", name: "IBKR Active Account", cash: 50000, reserved: 15000, free: 35000 },
  ],
  positions: [
    {
      id: "p1",
      symbol: "NVDA",
      strike: 125,
      expiry: "2026-11-06",
      premium: 3.40,
      contracts: 2,
      sold: "2026-10-10",
      pool_id: "main-ira",
      pool_name: "Main Retirement (IRA)",
      mark: { mid: 0.95, as_of: new Date().toISOString(), underlying_price: 139.50 },
      view: {
        pl_dollars: 490.0,
        pl_pct: 0.72,
        pace_per_day_dollars: 35.0,
        pace_per_day_pct: 0.05,
        days_elapsed: 14,
        days_total: 27,
        target_pct: 0.51,
        pace_met: true,
        spot_pct_vs_strike: (139.50 - 125) / 125,
      },
    },
    {
      id: "p2",
      symbol: "MSFT",
      strike: 420,
      expiry: "2026-11-20",
      premium: 4.80,
      contracts: 1,
      sold: "2026-10-18",
      pool_id: "ibkr-tax",
      pool_name: "IBKR Active Account",
      mark: { mid: 3.10, as_of: new Date().toISOString(), underlying_price: 432.20 },
      view: {
        pl_dollars: 170.0,
        pl_pct: 0.354,
        pace_per_day_dollars: 28.0,
        pace_per_day_pct: 0.06,
        days_elapsed: 6,
        days_total: 33,
        target_pct: 0.18,
        pace_met: true,
        spot_pct_vs_strike: (432.20 - 420) / 420,
      },
    },
    {
      id: "p3",
      symbol: "TSLA",
      strike: 210,
      expiry: "2026-11-13",
      premium: 4.10,
      contracts: 1,
      sold: "2026-10-20",
      pool_id: "main-ira",
      pool_name: "Main Retirement (IRA)",
      mark: { mid: 3.45, as_of: new Date().toISOString(), underlying_price: 219.00 },
      view: {
        pl_dollars: 65.0,
        pl_pct: 0.158,
        pace_per_day_dollars: 16.0,
        pace_per_day_pct: 0.04,
        days_elapsed: 4,
        days_total: 24,
        target_pct: 0.16,
        pace_met: false,
        spot_pct_vs_strike: (219.00 - 210) / 210,
      },
    },
  ],
  lots: [
    {
      id: "l1",
      symbol: "AAPL",
      shares: 200,
      basis_per_share: 215.50,
      acquired: "2026-09-15",
      pool_id: "main-ira",
      pool_name: "Main Retirement (IRA)",
      mark: { as_of: new Date().toISOString() },
      view: {
        value: 46560.0,
        pl_dollars: 3460.0,
        pl_pct: 3460 / 43100,
        capacity: 1,
        covered: 1,
        spot: 232.80,
        spot_as_of: new Date().toISOString(),
        age_days: 39,
      },
    },
    {
      id: "l2",
      symbol: "GOOG",
      shares: 100,
      basis_per_share: 170.20,
      acquired: "2026-10-02",
      pool_id: "ibkr-tax",
      pool_name: "IBKR Active Account",
      mark: { as_of: new Date().toISOString() },
      view: {
        value: 17850.0,
        pl_dollars: 830.0,
        pl_pct: 830 / 17020,
        capacity: 1,
        covered: 0,
        spot: 178.50,
        spot_as_of: new Date().toISOString(),
        age_days: 22,
      },
    },
  ],
  calls: [
    {
      id: "c1",
      symbol: "AAPL",
      strike: 240,
      expiry: "2026-11-13",
      premium: 2.80,
      contracts: 1,
      sold: "2026-10-12",
      pool_id: "main-ira",
      pool_name: "Main Retirement (IRA)",
      mark: { mid: 0.85, as_of: new Date().toISOString(), underlying_price: 232.80 },
      view: {
        pl_dollars: 195.0,
        pl_pct: 0.696,
        pace_per_day_dollars: 16.0,
        pace_per_day_pct: 0.05,
        days_elapsed: 12,
        days_total: 32,
        target_pct: 0.375,
        pace_met: true,
        spot_pct_vs_strike: (232.80 - 240) / 240,
      },
    },
  ],
};

// Client-side mock for screenshot preview
window.fetch = async (url, opts = {}) => {
  const method = opts.method || "GET";
  if (url.includes("/api/holdings")) {
    return new Response(JSON.stringify(PREVIEW_LEDGER), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const params = new URLSearchParams(window.location.search);
if (params.get("theme")) {
  document.documentElement.dataset.theme = params.get("theme");
}

render(() => <HoldingsPanel />, document.getElementById("root"));
