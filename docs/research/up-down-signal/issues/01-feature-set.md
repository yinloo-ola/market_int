- **Type:** wayfinder:grilling
- **Status:** resolved
- **Blocked by:** (none)

## Question

**Which features go into the v1 minimal predictor — and which stay in the fog for later graduation?**

The grounded recommendation (see map Notes) is a 7-feature, 3-layer set:

- Trend: EMA20/50 alignment (reuse `trend.rs`), EMA200 (build on `stats.rs`)
- Momentum: MACD(12,26,9), RSI(14), volume breakout (vol ÷ 50-day avg vol)
- Filter: ADX(14), realized-vol regime (reuse `backtest.rs:19`), RS-vs-SPY

For a *minimal-then-grow* research tool, decide the cut:

- **Option A — Ultra-minimal (fastest ship):** EMA20/50 + EMA200 + volume breakout. Reuses existing code, zero new indicator modules. One new cheap build (EMA200). Gets a runnable subcommand end-to-end.
- **Option B — Minimal-momentum (recommended):** A + MACD + RSI. Two cheap builds on the EMA primitive. Covers Trend + Momentum layers; defers the Filter layer (ADX, RS) to fog.
- **Option C — Full 3-layer:** all 7 including ADX (moderate build) and RS-vs-SPY (needs ETF plumbing). Most defensible signal, largest v1.

Decide: which option, and confirm the *deferred* features (the ones not chosen) are correctly placed in the map's fog vs. ruled out of scope. Note RS-vs-SPY and post-earnings momentum are *data-infeasible* today regardless of option.

## Resolution checklist

- [x] Pick A / B / C (or a named variant). → **Option B**
- [x] List the deferred features → confirm they move to map **Not yet specified** (fog), not **Out of scope**.
- [x] Confirm "ATR proper" stays out (realized-vol reuse covers the vol-regime job).
- [x] Confirm post-earnings *momentum* is out (no data); upcoming-earnings *risk gate* is fog (not v1).

## Answer

**Option B — Minimal-momentum (5 features), Trend + Momentum layers:**

| Layer | Feature | Build effort |
|---|---|---|
| Trend | EMA20/50 alignment | reuse `src/trend.rs` |
| Trend | EMA200 | build on `stats.rs::exponential_moving_average` |
| Momentum | MACD(12,26,9) | build on EMA primitive (line = EMA12−EMA26, signal = EMA9 of line, histogram = line−signal) |
| Momentum | RSI(14) | build (Wilder smoothing) |
| Momentum | Volume breakout | build (vol ÷ 50-day avg vol; `Candle.volume` exists) |

**Rationale:** Option A is all trend-family (correlated — "one signal counted three times," weak out-of-sample). Option C adds ADX (worthwhile) + RS-vs-SPY (a scope jump: new data plumbing — ETFs in `symbols.csv`). Option B gives the 2y-train/1y-test calibration (ticket 03) genuinely diverse levers — trend vs momentum are different information — at cheap build cost (both new builds reuse the existing EMA primitive).

**Deferred feature placement:**

| Feature | Placement | Reason |
|---|---|---|
| ADX(14) | **Fog** (graduates post-v1) | Filter-layer enhancement; deferred to keep v1 scope down |
| RS-vs-SPY | **Fog** (graduates post-v1) | Data-infeasible today; needs ETFs added to `symbols.csv` first |
| Upcoming-earnings risk gate | **Fog** (graduates post-v1) | Non-directional overlay (mirrors `EARNINGS_SAFETY_MULTIPLIER`); natural v2 |
| ATR proper | **Out of scope** | Superseded — realized-vol reuse (`backtest.rs:19`) covers the vol-regime job |
| Post-earnings momentum | **Out of scope** | No data source — Tiger gives only upcoming date + `expected_eps`, no actual/surprise |

**Hand-off to ticket 02 (weight scheme, now unblocked):** 5 features to weight, summing to 100. Suggested seed from map Notes — EMA20/50: 20, EMA200: 15, MACD: 20, RSI: 10, volume breakout: 10 = 75. The 25 points previously allocated to the Filter layer (ADX 15 + RS 5 + vol-regime 5) need redistributing across the 5 chosen features in ticket 02.
