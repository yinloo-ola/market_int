- **Type:** wayfinder:grilling
- **Status:** resolved
- **Blocked by:** (none)

## Question

**What is the user-facing contract of the new subcommand?**

The destination is a CLI dev/research tool. This ticket pins exactly what the user types and what they see — so the implementation tickets that follow have a fixed target.

**1. Command name & shape.** Two candidates:
- `predict <symbols_file>` — reads a symbols file like the other subcommands.
- `signal <symbols_file>` — avoids overloading "predict" (which implies a forecast guarantee).
Decide. Also: does it take flags? Suggested: `--horizon <days>` (default from ticket 03), `--top <n>` (limit output), `--json` (machine-readable for piping into calibration tooling).

**2. Input data source.** Confirm it reads from the SQLite store via `store::candle::get_candles(&conn, sym, constants::CANDLE_COUNT)` (`src/store/candle.rs:50`). For a research tool, cached DB data is correct (no live fetch). Confirm no `--refresh` for v1 (it's in the fog).

**3. Output format (stdout).** Suggest a table, one row per symbol, columns:
`SYMBOL | SIGNAL (0.000–1.000) | BIAS (BULL/BEAR/NEUTRAL) | key drivers (top 2 features) | confidence`
Decide columns and sort order (by signal desc? by |signal−0.5| desc?). Decide whether Neutral-band symbols are shown or filtered.

**4. CLI wiring pattern (mechanical, confirm).** Add a `Predict`/`Signal` variant to the `Commands` enum (`src/main.rs:125`) + a match arm (`src/main.rs:210`). clap auto-generates the snake-case name. The arm reads candles per symbol and calls into a new `signal.rs` module. Confirm this matches intent.

**5. Module layout.** Suggest a new `src/signal.rs` holding: the indicator functions (the net-new builds), the composite scorer (mirroring `ScoreParams`), and a `run(symbols_file, conn) -> Result` entry the subcommand calls. Indicators that are pure functions get unit tests in-mod (like `model.rs::mod tests`). Confirm, vs. splitting indicators into their own files.

## Resolution checklist

- [x] Lock command name + flags. → **`direction`** with `--calibrate` / `--backtest`
- [x] Confirm DB-read-only data source (no live fetch in v1). → **DB-read-only**
- [x] Lock output columns + sort order + neutral-band handling in display. → **confidence-sorted, show all (neutrals dimmed at bottom)**
- [x] Confirm the `main.rs` wiring (variant + arm). → **`Direction` variant + match arm**
- [x] Confirm module layout (single `signal.rs` vs split). → **3 modules: `indicators.rs` + `signal.rs` + `signal_backtest.rs`**

## Answer

**1. Command name & shape:**

- **`direction <symbols_file>`** — chosen for neutrality (avoids `predict`'s forecast-guarantee overpromise; reads cleanly as a command: `direction data/symbols.csv`).
- Flags (clap derive, mirroring the `Backtest` variant's `--earnings`/`--calibrate-safety` pattern at `src/main.rs:154-180`):
  - *(default, no flag)* — **live predict mode**: compute the signal per symbol and print the table.
  - `--calibrate` — run ticket 03's grid search over the 2-year train split, print the best weight combo + its train banded hit-rate. Does not run the live predictor.
  - `--backtest` — run ticket 03's evaluation on the 1-year test split using the calibrated (or seed) weights, print banded hit-rate + unconditional hit-rate + both baselines.
  - `--horizon <days>` *(optional, default 10)* — overrides the primary label horizon (ticket 03 default H=10).
  - `--top <n>` *(optional)* — limit output to top N most-confident calls.
  - `--json` *(optional)* — machine-readable output for piping into further analysis/calibration tooling.

**2. Data source:**

- **DB-read-only.** `direction` reads candles via `store::candle::get_candles(&conn, &symbol, constants::CANDLE_COUNT)` (`src/store/candle.rs:50`). No live fetch in v1.
- The `--refresh` flag (pull fresh quotes before computing) stays in **fog** — it's a convenience, not core to the research tool's value. Can graduate later.

**3. Output format (stdout, live-predict mode):**

- **Sort:** `|signal − 0.5|` **DESC** — most-confident calls (bullish or bearish) first.
- **Neutral-band display:** SHOW all symbols, including neutrals. Neutrals (signal in `[0.40, 0.60]`, per ticket 03's band) sorted to the bottom and rendered dimmed/greyed (e.g. ANSI dim or a `·` prefix) so the strong reads dominate visually but nothing is hidden — research-friendly.
- **Columns:**

  ```
  SYMBOL | SIGNAL (0.000–1.000) | DIR | TOP-2 DRIVERS | CONFIDENCE
  ```

  - `SIGNAL` — the continuous composite value.
  - `DIR` — `BULL` (>0.60), `BEAR` (<0.40), `NEUT` (0.40–0.60). Reuses ticket 03's band edges for display consistency.
  - `TOP-2 DRIVERS` — the two highest-weighted contributing features for that symbol (debuggability; mirrors the "key drivers" idea from the ticket).
  - `CONFIDENCE` — `|signal − 0.5|` mapped to a readable strength (e.g. STRONG/MODERATE/WEAK, or a 0–100 scale).

  This resolves the map's "Threshold → directional call (live display)" fog: the live predictor reuses the **same `[0.40, 0.60]` band** as the backtest, mapping `>0.60 → BULL`, `<0.40 → BEAR`, else `NEUT`. One band, two consumers — no inconsistency.

**4. CLI wiring (mechanical, confirmed):**

- Add a `Direction { symbols_file_path: String, calibrate: bool, backtest: bool, horizon: Option<u32>, top: Option<usize>, json: bool }` variant to the `Commands` enum (`src/main.rs:125`).
- Add a match arm in the `match args.command` block (`src/main.rs:210`) that reads the symbols file, opens the DB `conn`, and dispatches:
  - `calibrate == true` → `signal_backtest::run_calibrate(&conn, &symbols)`
  - `backtest == true` → `signal_backtest::run_backtest(&conn, &symbols, horizon)`
  - else → `signal::run_predict(&conn, &symbols, { top, json, ... })`
- clap auto-generates the snake-case subcommand name from the `Direction` variant → `direction`.

**5. Module layout (3 modules):**

| Module | Responsibility |
|---|---|
| `src/indicators.rs` | Net-new indicator **math** (pure functions, unit-tested in-mod like `model.rs::mod tests`): `ema200`, `macd` (line/signal/hist), `rsi`, `volume_breakout`. Reuses `stats.rs::exponential_moving_average`. Chosen as a separate file because the fog lists **ADX** as a future graduate that would live here too — anticipates reuse. |
| `src/signal.rs` | The **composite scorer**: `SignalParams` (mirrors `ScoreParams`, reads `SIGNAL_WEIGHT_*` from `constants.rs`), the 5 normalizations (ticket 02), `compute_signal(&candles, &params) -> f64`, and `run_predict(...)` entry the subcommand calls. Imports `indicators.rs`. |
| `src/signal_backtest.rs` | **Evaluation + calibration** (ticket 03): point-in-time simulation via `get_candles_up_to`, label assignment (H=10), banded/unconditional hit-rate, baseline computation, grid-search calibration. `run_calibrate(...)` + `run_backtest(...)` entries. Imports `signal.rs` + `indicators.rs`. |

**Hand-off:** with ticket 04 resolved, the frontier is clear. The map's destination — a `direction` CLI research tool with calibrated weights, validated on a 1-year out-of-sample split — is fully specified. No open decisions remain. The map is **done**; the way to the destination is clear, and someone can now go build it.
