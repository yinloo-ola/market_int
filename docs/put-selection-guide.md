# Put Option Selection Guide

## Field Reference

| Field | What it measures | Good range |
|---|---|---|
| **rate_of_return** | Annualised premium yield from selling the put. Calculated as `(mid price / strike) ÷ weeks to expiry × 52`. | 0.25 – 0.65 |
| **sharpe_ratio** | Risk-adjusted return of the underlying stock over recent history. Higher = better reward per unit of risk. | > 1.0 |
| **strike_percentile** | Where the strike sits within the stock's expected support range `[min, max]`. 0 = deep support, 1 = at resistance. | ≤ 0.60 |
| **score** | Composite quality score (0–1) combining Sharpe (30%), safety via strike percentile (40%), and return (30%). Pre-filters out options with extreme returns, negative Sharpe, or strikes too close to resistance. | > 0.6 |
| **price_percentile** | Where the current stock price sits within its 20-day trading range. Used to gauge momentum: `NORMAL` (≤ 80%), `HIGH` (80–90%), `EXTENDED` (> 90%). | ≤ 0.80 |
| **earnings_before_expiry** | Earnings date if it falls before the option's expiration date. Empty if no earnings before expiry. | empty (no earnings risk) |

---

## How to Select Puts for Selling

### Quick filter

Start by applying these hard filters — any option that doesn't pass all four should be skipped:

1. **score > 0.6** — the composite score already bundles the checks below, so this is your primary gate.
2. **earnings_before_expiry is empty** — earnings cause massive IV crush and gap risk. Avoid selling puts expiring after earnings.
3. **price_percentile ≤ 0.80** — a stock trading at the top of its range (HIGH/EXTENDED momentum) is more likely to pull back, which helps put sellers, but also signals overextension. Stick to NORMAL momentum for safety.
4. **rate_of_return between 0.25 and 0.65** — below 0.25 isn't worth the capital; above 0.65 usually means the market is pricing in high risk.

### Ranking

After filtering, **sort by `score` descending**. The score weights:

| Factor | Weight | Rationale |
|---|---|---|
| Safety (strike percentile) | 40% | The lower the strike relative to support, the more the stock must drop before you're at risk. |
| Sharpe ratio | 30% | Stocks with strong risk-adjusted returns tend to keep trending up. |
| Return quality | 30% | Prefers returns near the sweet spot (~35% annualised). Penalises extreme returns that signal danger. |

### Worked example

| underlying | strike | rate_of_return | sharpe | strike_percentile | score | price_percentile | earnings |
|---|---|---|---|---|---|---|---|
| AAPL | 180 | 0.32 | 1.8 | 0.10 | **0.78** | 0.55 | |
| TSLA | 250 | 0.55 | 1.2 | 0.30 | **0.68** | 0.72 | 2026-06-15 |
| MSFT | 380 | 0.28 | 2.1 | 0.05 | **0.74** | 0.45 | |

1. **TSLA** fails — earnings before expiry. ❌
2. **AAPL** vs **MSFT** — AAPL scores 0.78, MSFT scores 0.74. Pick AAPL first.
3. Both pass all filters, so you could sell both.

### Red flags to avoid

| Signal | Why it's dangerous |
|---|---|
| `score` is blank/missing | Failed pre-filter. The return is too low/high, Sharpe is negative, or strike is above resistance. |
| `earnings_before_expiry` has a date | Earnings can gap the stock well below your strike. |
| `price_percentile` > 0.90 (EXTENDED) | Stock is at a 20-day high. A reversion is likely, but it could overshoot first. |
| `rate_of_return` > 0.65 | The market is pricing in a high probability of the stock dropping. You're being compensated for real risk. |
