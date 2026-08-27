// Hover-explainer copy (spec §6.5): ONE table keyed by field/label, so
// wording never drifts between headers, expansion labels, and chips.
// Threshold numbers interpolate from the document's thresholds block at
// render time — nothing here hardcodes the window.

const pct = (v) => Number(v * 100).toFixed(0);

export function makeTippers(thresholds) {
  const t = thresholds ?? {};
  const vh = t.vol_tier_high ?? "?";
  const vm = t.vol_tier_mid ?? "?";
  const mh = pct(t.momentum_high);
  const me = pct(t.momentum_extended);

  return {
    // ── columns ──
    underlying: `The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${vh}, yellow ${vm}–${vh}, red < ${vm} — higher vol pays richer premium at matched assignment risk.`,
    sector: "GICS sector from symbols.csv. Context for diversification; not used in scoring.",
    strike:
      "Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",
    underlying_price: "Latest close of the underlying stock.",
    bid: "Best price a buyer will pay — the conservative fill for a seller.",
    mid: "(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",
    ask: "Best price a seller demands.",
    bid_size: "Contracts quoted at the bid — a liquidity and depth signal.",
    ask_size: "Contracts quoted at the ask — a liquidity and depth signal.",
    expiration:
      "Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",
    volume: "Option contracts traded today.",
    open_interest: "Option contracts still open — liquidity and positioning.",
    rate_of_return:
      "Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",
    strike_from:
      "Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",
    strike_to:
      "Upper edge of the scored strike band. Above it you are too close to spot for the premium.",
    sharpe_ratio:
      "Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",
    strike_percentile:
      "Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",
    score:
      "Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",
    price_percentile: `Where spot sits in its 20-day range. Above the ${mh}th percentile = HIGH momentum, above the ${me}th = EXTENDED.`,
    earnings_before_expiry:
      "The company reports earnings before this option expires — safety is discounted when set.",
    trend_short:
      "price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",
    trend_long:
      "price ÷ EMA50. Same idea on the 50-day average.",
    realized_vol:
      "20-day annualized realized volatility of the underlying — the vol-tier input.",
    implied_vol: "Volatility the option market is pricing into this contract.",
    delta:
      "Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",
    iv_rv_ratio:
      "Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",

    // ── expansion panels ──
    band_range:
      "The scored strike band, derived from max-drop stats — the shaded range in the chart above.",
    band_depth:
      "How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",
    cushion_be:
      "How far spot can fall before hitting break-even, as % of spot.",
    capital: "Cash collateral if assigned: strike × 100 shares.",
    premium: "Premium collected up front: mid × 100.",
    breakeven:
      "strike − mid. The stock can fall to this price before the position loses money.",
    ann_ror: "Annualized premium yield — same number as the ror column.",
    sb_sharpe: "20% weight — Sharpe clamped to [0, 2].",
    sb_safety:
      "40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",
    sb_ret: "40% weight — annualized ror closest to the 0.80 ideal scores highest.",
  };
}

/** Interpolated wording for one key; unknown keys render the raw key so a
 *  missed tooltip entry is visible instead of silently blank. */
export function tipText(key, thresholds) {
  const makers = makeTippers(thresholds);
  return makers[key] ?? key;
}
