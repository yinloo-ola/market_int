# Decisions: Earnings-aware put scoring

## Problem

When a symbol reports earnings inside the option's lifetime, the put carries
**gap risk** that the scoring model is blind to:

- **Safety** is the strike's position within the `max_drop` band
  `[strike_from, strike_to]` (`calculate_max_drop_safety`). That band is built
  from *routine* daily volatility (`ema_drop` / `percentile_drop` over 850
  candles). A post-earnings gap-down is a single-bar event the band does not
  model, so a deep strike that scores "safe = 0.9" is in fact far more
  assignable than the score claims.
- **Earnings currently only warn.** `earnings_map` feeds the CSV column and the
  Telegram ⚠️ line (`option_chain_to_csv_vec`), but never touches
  `calculate_put_score`. The user must eyeball the warning and manually skip —
  the score itself gives no signal.

**Goal:** when a symbol has earnings in `[today, expiry]`, (1) stop scoring the
shallow half of the strike range (near-money puts with no gap buffer), and
(2) discount `safety` for the deep half that survives, so the ranking reflects
that the band no longer tells you the breach probability.

## Resolved parameters

| Parameter | Value | Why |
|---|---|---|
| "Lower half range" | Lower *strike prices* = deeper/safer end. `mid = (strike_from + strike_to)/2`; keep `strike ≤ mid`, drop `strike > mid`. | `strike_from` is the deep/rarely-breached end (safety 1.0); near-money shallow strikes have no gap buffer and go first. |
| Safety discount | Flat multiplier `safety × 0.5` (`EARNINGS_SAFETY_MULTIPLIER`). | Earnings gap is violent and the band is a non-event measure; halving honestly says the band tells us ~nothing about gap risk. Deep strike at 0.8 → 0.4. |
| Earnings window | `[today, expiry]`, **date-level, inclusive both ends**. Ignore the `BMO`/`AMC` label (Tiger returns mixed `盘前`/`盘后`/`BMO`/`AMC`). | Simple and robust; the AMC-on-expiry-day edge is negligible for ~5/20-day puts. |

## Approaches considered

- **A — Earnings rule as a layer at the call site; keep `calculate_put_score` pure.** Add a small pure helper (in `model.rs`) that takes the chain's band + an `earnings_in_window` flag: returns `None` for upper-half strikes, else halves safety and delegates to `calculate_put_score`. Both scoring call sites in `option_chain_to_csv_vec` (the CSV loop and the top-pick loop, which currently duplicate the scoring) route through it.
- **B — Thread earnings + dates into `calculate_put_score`.** Make the scorer itself earnings-aware (new params: earnings info, today, expiry, band midpoint). Single source of truth, but bloats the signature and forces the backtest `production_mirror` to gain matching params.
- **C — Pre-filter at chain collection (`fetch_option_chains_in_batches`).** Drop upper-half strikes for earnings symbols before they're saved. Smallest payload, but deletes the rows from the CSV entirely and contradicts "only include the *score*" (which implies keep the row, blank the score).

**Chosen: A.** It preserves `calculate_put_score`'s pure-scalar contract (so the
`production_mirror` pinning test stays valid on the no-earnings path with zero
changes), keeps all chains visible in the CSV (excluded strikes just get a blank
score, exactly like today's pre-filter failures), and concentrates the whole
earnings rule in one testable helper used at both call sites.

## Decisions (ADR-style)

### Production gains an earnings-aware scoring layer the backtest cannot mirror

Production scoring will now exclude/down-rank strikes when earnings falls in
`[today, expiry]`. The backtest has **no earnings data** (it reads candles only)
and no per-`sim_date` earnings calendar, so `production_mirror` will keep calling
the earnings-blind path. The pinning test
(`test_production_mirror_matches_calculate_put_score`) stays valid because it
exercises the *pure* `calculate_put_score`, whose no-earnings behavior is
unchanged. We accept the divergence rather than fabricate or source historical
earnings calendars: the backtest's aggregate metrics will not reflect the
earnings rule, and that is a **known limitation** to revisit if/when earnings
history is ingested. Reversing this (giving the backtest earnings) is costly —
it requires a new historical data source — which is why we record the gap now.

## Module outline (handoff to the next skill)

- `src/constants.rs` — add `EARNINGS_SAFETY_MULTIPLIER = 0.5`.
- `src/model.rs` — add a **pure** helper that encapsulates the earnings rule
  (inputs: the chain's `strike`, `strike_from`, `strike_to`, the base
  `safety`, `sharpe`, `rate_of_return`, the `regime`, and an
  `earnings_in_window: bool`). Behavior: if `earnings_in_window` and the strike
  is above the band midpoint → `None`; else if `earnings_in_window` → discount
  `safety` by the multiplier and delegate to `calculate_put_score`; else delegate
  unchanged. `calculate_put_score` itself is **not** modified. Add unit tests
  covering all three branches (no-earnings passthrough, earnings + deep strike
  discounted, earnings + shallow strike excluded).
- `src/option.rs` `option_chain_to_csv_vec` — at **both** scoring call sites
  (CSV-row scoring and top-pick scoring), compute `earnings_in_window` per chain
  from `earnings_map` + the chain's expiration vs today (date-level inclusive),
  then route through the new helper instead of calling `calculate_put_score`
  directly. This also unifies the two currently-duplicated scoring blocks. A
  date-comparison capability (parse `report_date` / `expiration` strings vs
  `today`) is needed here — reuse existing date parsing if present.

## Open questions for implementation

- Confirm the date format of `chain.expiration` and pick the parse/compare path
  (chrono is already a dependency). `report_date` is `YYYY-MM-DD`.
- Decide whether the CSV should mark earnings-excluded rows distinctly (e.g. a
  note) or just leave the score blank like other pre-filter drops — default is
  blank (consistent with current behavior).
