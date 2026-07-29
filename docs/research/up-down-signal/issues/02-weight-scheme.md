- **Type:** wayfinder:grilling
- **Status:** resolved
- **Blocked by:** 01

## Question

**What weight scheme does the v1 composite start from, before calibration tunes it?**

The composite mirrors `calculate_put_score` (`src/model.rs:197`): weighted sum of individually clamped/normalized terms over a `ScoreParams`-style struct. Two sub-decisions:

**1. Starting weights (seed before calibration).** Grounded suggestion (sums to 100):

| Layer | Feature | Suggested weight |
|---|---|---:|
| Trend | EMA20/50 alignment | 20 |
| Trend | EMA200 | 15 |
| Momentum | MACD | 20 |
| Momentum | RSI | 10 |
| Momentum | Volume breakout | 10 |
| Filter | ADX | 15 |
| Filter | Vol regime (realized-vol reuse) | 5 |
| Filter | RS-vs-SPY | 5 |

Confirm or adjust. (Note: if ticket 01 defers ADX/RS to fog, their 20 points redistribute — decide where.)

**2. Term normalization.** Each feature needs a deterministic `f64 → [0,1]` mapping before weighting. Decide the canonical form for each, e.g.:
- EMA alignment: `{price>EMA20 && EMA20>EMA50 : 1.0, partial : 0.5, else : 0.0}`? Or a continuous ratio?
- MACD: histogram sign + magnitude vs its own recent stdev?
- RSI: linear map (0→0, 50→0.5, 100→1.0)? Or sigmoid centered at 50?
- ADX: threshold ramp (e.g. >25 → full weight, <20 → damp momentum terms)?
- Volume breakout: ratio clamp (e.g. vol/avg in [0.5, 2.0] → [0,1])?

These normalization choices matter more than the weights — a bad normalization can't be fixed by calibration. Grill through each.

## Resolution checklist

- [x] Lock starting weights (respecting whatever ticket 01 chose for the feature set). → **Momentum-leaning, sums to 100**
- [x] Lock the normalization formula for each chosen feature. → **Hybrid: discrete flags + continuous magnitudes**
- [x] Confirm the composite output range (suggest `[0,1]`, >0.5 = bullish bias). → **confirmed, `[0,1]`, >0.5 = bullish**
- [x] Note any normalization that depends on a constant → it lands in `constants.rs` with a name, like the existing `PUT_SCORE_WEIGHT_*`.

## Answer

**Normalization philosophy: HYBRID** — continuous where magnitude is meaningful (MACD, RSI, volume), discrete where it's really a regime flag (EMA alignment, EMA200). Matches how traders actually read these indicators and gives calibration real magnitude levers on 3 of 5 features.

**Per-feature normalization formulas:**

| Feature | Formula (raw → `[0,1]` bullishness) | Type |
|---|---|---|
| EMA20/50 alignment | `1.0` if `price > EMA20 > EMA50` (full bull stack); `0.5` if price above one EMA but not stacked; `0.0` if `price < EMA20 < EMA50` (bear stack) | discrete |
| EMA200 | `1.0` if `price > EMA200`, else `0.0` | discrete flag |
| MACD(12,26,9) | `x = clamp(histogram / stdev(histogram, last 20), -1, 1)`; score = `(x + 1) / 2`. Self-referential stdev makes "a 1-σ MACD burst" the unit — stock-agnostic, no price-scale contamination. | continuous |
| RSI(14) | `clamp((rsi − 10) / (90 − 10), 0, 1)`. Neutral-band-aware: <10 → 0 (oversold), >90 → 1. | continuous |
| Volume breakout | `clamp((vol / avg_vol_50 − 1) / 0.5, 0, 1)`. A +50%-volume day (1.5× avg) maxes the feature. `vol/avg < 1` → 0. | continuous |

**Seed weights (momentum-leaning, sums to 100):**

| # | Feature | Weight |
|---|---|---:|
| 1 | EMA20/50 alignment | 25 |
| 2 | EMA200 | 15 |
| 3 | MACD(12,26,9) | 25 |
| 4 | RSI(14) | 20 |
| 5 | Volume breakout | 15 |
| | **Total** | **100** |

Rationale for the redistribution (ticket 01 deferred the Filter layer's 25 points): added mostly to momentum (RSI +10, Volume +5, MACD +5, EMA20/50 +5). Leans into information diversity — momentum (MACD/RSI/volume) carries genuinely different signal than the correlated trend regime flags. Balanced ~40 trend / ~60 momentum as the launch point. **These are seeds** — ticket 03's 2-year train split will calibrate them.

**Composite & constants hand-off (for the implementation ticket that follows 03/04):**

- Composite = weighted sum: `signal = Σ (weight_i × normalized_i) / 100`, output in `[0,1]`, `> 0.5` ⇒ bullish bias.
- New `constants.rs` entries (mirroring the `PUT_SCORE_WEIGHT_*` naming convention):
  - `SIGNAL_WEIGHT_EMA_ALIGNMENT = 25.0`
  - `SIGNAL_WEIGHT_EMA200 = 15.0`
  - `SIGNAL_WEIGHT_MACD = 25.0`
  - `SIGNAL_WEIGHT_RSI = 20.0`
  - `SIGNAL_WEIGHT_VOLUME = 15.0`
  - `RSI_LOW = 10.0`, `RSI_HIGH = 90.0` (RSI normalization band)
  - `VOLUME_SPIKE_FULL = 1.5` (vol/avg ratio that maxes the feature)
  - `MACD_STDEV_WINDOW = 20` (bars of histogram for self-referential stdev)
- `SignalParams` struct (mirroring `ScoreParams` at `src/model.rs:31`) holds these; `Default::default()` reads from `constants.rs`. The composite scorer mirrors `calculate_put_score` (`src/model.rs:197`).

**Unblocked / hand-off:** ticket 02 was the last design decision blocked by 01. Tickets 03 (backtest metrics) and 04 (subcommand contract) remain on the frontier and are independent of each other and of 02.
