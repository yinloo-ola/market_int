// Display-only formatting rules + client-side derivations (spec §6.7).
// Pure JS — no framework imports — so the rules can be smoke-tested directly
// at the node prompt. JSON stays raw; every rounding here is display-only.

export const NULL_MARK = "∅";

export function isNullValue(v) {
  return (
    v === null ||
    v === undefined ||
    (typeof v === "number" && !Number.isFinite(v))
  );
}

export function comma(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

const NULL_CELL = { text: NULL_MARK, isNull: true };
const fixed = (v, dp) => ({ text: Number(v).toFixed(dp), isNull: false });

// Vol tier mirrors Rust's inclusive comparisons exactly:
// realized_vol >= vol_tier_high → green; else >= vol_tier_mid → yellow;
// else red. Thresholds always come from the document's thresholds block —
// none of these numbers are hardcoded here. null → no dot.
export function volTier(realizedVol, thresholds) {
  if (!thresholds || isNullValue(realizedVol)) return null;
  if (realizedVol >= thresholds.vol_tier_high) return "green";
  if (realizedVol >= thresholds.vol_tier_mid) return "yellow";
  return "red";
}

// Momentum mirrors Rust's STRICTLY-GREATER comparisons: > extended →
// EXTENDED, > high → HIGH, else NORMAL. So a raw 0.80 renders NORMAL and a
// raw 0.90 renders HIGH — a naive >= mislabels the boundary rows vs the
// Telegram caption. null → no chip.
export function momentumOf(pricePercentile, thresholds) {
  if (!thresholds || isNullValue(pricePercentile)) return null;
  if (pricePercentile > thresholds.momentum_extended) return "EXTENDED";
  if (pricePercentile > thresholds.momentum_high) return "HIGH";
  return "NORMAL";
}

// Earnings display string rebuilt client-side from the structured object:
// `⚠ 2026-08-31 (after close)` (report_time `_` → space).
function earningsCell(value) {
  if (!value || typeof value !== "object" || isNullValue(value.report_date)) {
    return NULL_CELL;
  }
  const time =
    typeof value.report_time === "string"
      ? ` (${value.report_time.replaceAll("_", " ")})`
      : "";
  return { text: `⚠ ${value.report_date}${time}`, isNull: false };
}

// Cell text per column kind (spec §6.7 formatting table).
// Returns { text, isNull } so callers can style nulls with ∅.
export function formatCell(kind, value) {
  // numerics: non-finite sanitization happened server-side, but a defensive
  // check keeps ∅ instead of "NaN" ever reaching the DOM.
  if (isNullValue(value)) return NULL_CELL;
  switch (kind) {
    case "fixed2":
      return fixed(value, 2); // strike, underlying_price, bid, mid, ask
    case "fixed3":
      return fixed(value, 3); // score, sharpe, strike pctl, delta, trends, vols
    case "ivrv":
      return fixed(value, 2); // iv_rv_ratio
    case "pct1": // rate_of_return — percent, 1 dp (bolding is CSS)
      return { text: `${(value * 100).toFixed(1)}%`, isNull: false };
    case "pct0": // price_percentile — percent, 0 dp (+ chip appended by caller)
      return { text: `${Math.round(value * 100)}%`, isNull: false };
    case "int": // volume, open_interest, bid_size, ask_size — thousands sep
      return { text: Number(value).toLocaleString("en-US"), isNull: false };
    case "earnings":
      return earningsCell(value);
    default: // text / date — underlying, sector, expiration as stored
      return { text: String(value), isNull: false };
  }
}
