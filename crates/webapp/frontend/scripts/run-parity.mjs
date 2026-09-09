// run-parity.mjs — the drift tripwire between the frontend's scoring.js port
// and the ONE Rust scoring implementation. Two anchors:
//   1. Rust-executed test vectors mirrored from crates/core/src/model.rs
//      tests (if the Rust scorer changes, these expected values change with
//      it, and this script fails until the JS port follows).
//   2. The sample fixture (crates/webapp/fixtures/sample_last_run.json),
//      whose scores are computed BY the Rust scorer in the
//      `regenerate_sample_last_run_fixture` test — a true end-to-end
//      Rust-writes / JS-reads parity check.
// Runs as part of `npm run smoke`. Plain node — scoring.js is dependency-free.

import { readFileSync } from "node:fs";
import {
  PRODUCTION,
  maxDropSafety,
  rescoreRow,
  scoreParts,
  topPicks,
} from "../src/lib/scoring.js";

let pass = 0;
const failures = [];
function eq(name, actual, expected, eps = 1e-9) {
  let ok;
  if (typeof expected === "string") ok = actual === expected;
  else if (expected === null) ok = actual === null;
  else ok = actual !== null && Math.abs(actual - expected) <= eps;
  if (ok) pass += 1;
  else failures.push(`${name}: expected ${expected}, got ${actual}`);
}

// ── anchor 1: Rust test vectors (model.rs) ──────────────────────────
eq("band deep end", maxDropSafety(90, 90, 100), 1.0);
eq("band shallow end", maxDropSafety(100, 90, 100), 0.0);
eq("band degenerate", maxDropSafety(100, 100, 100), 0.5);
eq("good option", scoreParts(1.8, 0.9, 0.45, 1.0).total, 0.765);
eq("clamped safety", scoreParts(2.0, -0.1, 0.35, 1.0).total, 0.375);
eq("clamped sharpe", scoreParts(5.0, 1.0, 0.35, 1.0).total, 0.775);
eq("peak", scoreParts(2.0, 1.0, 0.8, 1.08).total, 1.0);
eq(
  "trend disabled",
  scoreParts(2.0, 0.5, 0.45, 1.0).total,
  scoreParts(2.0, 0.5, 0.45, 1.08).total,
);
eq("at floor", scoreParts(1.0, 0.9, PRODUCTION.minRateOfReturn, 1.0) != null, true);
eq("below floor", scoreParts(1.0, 0.9, PRODUCTION.minRateOfReturn - 0.01, 1.0), null);
eq("zero sharpe", scoreParts(0.0, 0.9, 0.45, 1.0), null);
{
  const r = { rate_of_return: 0.15, sharpe_ratio: 1.5, delta: -0.1, strike: 95, strike_from: 90, strike_to: 100 };
  eq("row below prod floor", rescoreRow(r), null);
  eq("row re-admitted at 0.10", rescoreRow(r, { ...PRODUCTION, minRateOfReturn: 0.1 }).total, 0.2 * 0.75 + 0.4 * 0.9 + 0.4 * 0.1875);
  eq(
    "row earnings discount (band)",
    rescoreRow({ rate_of_return: 0.624, sharpe_ratio: 1.83, delta: null, strike: 95, strike_from: 90, strike_to: 100, earnings_before_expiry: { report_date: "x" } }).total,
    0.2 * 0.915 + 0.4 * 0.25 + 0.4 * 0.78,
  );
}

// ── anchor 2: formula-true sample fixture (Rust-generated scores) ──
const fixturePath = new URL("../../fixtures/sample_last_run.json", import.meta.url);
const doc = JSON.parse(readFileSync(fixturePath));
let fixtureRows = 0;
for (const tf of ["short", "medium"]) {
  const rows = doc.timeframes?.[tf]?.rows ?? [];
  for (const r of rows) {
    const live = rescoreRow(r, PRODUCTION);
    fixtureRows += 1;
    if (r.score == null) {
      eq(`fixture ${r.underlying} null stays null`, live, null);
      continue;
    }
    eq(`fixture ${r.underlying} ${r.strike} score`, live?.total, r.score);
    eq(`fixture ${r.underlying} ${r.strike} sharpe part`, live?.sharpe, r.score_components.sharpe);
    eq(`fixture ${r.underlying} ${r.strike} safety part`, live?.safety, r.score_components.safety);
    eq(`fixture ${r.underlying} ${r.strike} return part`, live?.return, r.score_components.return);
  }
  // Top picks reproduce from the rows under the same selection rules.
  const picks = topPicks(rows.map((row) => ({ row, score: row.score })));
  const stored = doc.timeframes?.[tf]?.top_picks ?? [];
  eq(
    `fixture ${tf} top picks match`,
    picks.map((p) => `${p.row.underlying}|${p.row.strike}`).join(","),
    stored.map((p) => `${p.underlying}|${p.strike}`).join(","),
  );
}
if (fixtureRows < 3) {
  failures.push(`fixture unexpectedly small: ${fixtureRows} rows`);
}

if (failures.length > 0) {
  console.error(`PARITY FAILED (${failures.length}):`);
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}
console.log(`parity ok — ${pass} assertions (${fixtureRows} fixture rows, Rust vectors included)`);
