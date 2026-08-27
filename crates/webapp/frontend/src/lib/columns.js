// Column registry (spec §6.3): the 27 CSV columns minus `side` (constant
// "put" — omitted from the picker entirely) → 26 togglables. Default
// visible 13 per the binding user verdict. Toggle state persists per
// browser in localStorage key "webapp.columns.v1".

export const COLUMNS = [
  // ── default-visible 13 (binding verdict order) ──
  { id: "underlying", label: "Underlying", kind: "text", align: "left" },
  { id: "sector", label: "Sector", kind: "text", align: "left" },
  { id: "strike", label: "Strike", kind: "fixed2", align: "num" },
  { id: "expiration", label: "Expiry", kind: "date", align: "left" },
  { id: "bid", label: "Bid", kind: "fixed2", align: "num" },
  { id: "mid", label: "Mid", kind: "fixed2", align: "num" },
  { id: "ask", label: "Ask", kind: "fixed2", align: "num" },
  { id: "rate_of_return", label: "ROR", kind: "pct1", align: "num" },
  { id: "score", label: "Score", kind: "fixed3", align: "num" },
  { id: "delta", label: "Delta", kind: "fixed3", align: "num" },
  { id: "iv_rv_ratio", label: "IV/RV", kind: "ivrv", align: "num" },
  { id: "realized_vol", label: "Realized vol", kind: "fixed3", align: "num" },
  { id: "price_percentile", label: "Price pctl", kind: "pct0", align: "num" },
  // ── hidden by default (picker order after the defaults) ──
  { id: "underlying_price", label: "Spot", kind: "fixed2", align: "num" },
  { id: "bid_size", label: "Bid sz", kind: "int", align: "num" },
  { id: "ask_size", label: "Ask sz", kind: "int", align: "num" },
  { id: "volume", label: "Volume", kind: "int", align: "num" },
  { id: "open_interest", label: "Open int", kind: "int", align: "num" },
  { id: "strike_from", label: "Band lo", kind: "fixed2", align: "num" },
  { id: "strike_to", label: "Band hi", kind: "fixed2", align: "num" },
  { id: "sharpe_ratio", label: "Sharpe", kind: "fixed3", align: "num" },
  { id: "strike_percentile", label: "Strike pctl", kind: "fixed3", align: "num" },
  { id: "earnings_before_expiry", label: "Earnings", kind: "earnings", align: "left" },
  { id: "trend_short", label: "Trend 20", kind: "fixed3", align: "num" },
  { id: "trend_long", label: "Trend 50", kind: "fixed3", align: "num" },
  { id: "implied_vol", label: "Implied vol", kind: "fixed3", align: "num" },
];

export const DEFAULT_COLUMN_IDS = [
  "underlying",
  "sector",
  "strike",
  "expiration",
  "bid",
  "mid",
  "ask",
  "rate_of_return",
  "score",
  "delta",
  "iv_rv_ratio",
  "realized_vol",
  "price_percentile",
];

const LS_KEY = "webapp.columns.v1";

export function loadVisibleColumns() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_COLUMN_IDS;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return DEFAULT_COLUMN_IDS;
    const known = new Set(COLUMNS.map((c) => c.id));
    const valid = arr.filter((id) => known.has(id));
    // Degenerate guard: a wiped/corrupt list must not blank the table.
    return valid.length > 0 ? [...new Set(valid)] : DEFAULT_COLUMN_IDS;
  } catch {
    return DEFAULT_COLUMN_IDS;
  }
}

export function saveVisibleColumns(ids) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch {
    // private mode / storage full — picker keeps working in-memory only
  }
}
