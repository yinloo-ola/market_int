# Progress: wheel-holdings

Design: docs/plans/2026-09-17-wheel-holdings/wheel-holdings-design.md
Branch: 2026-09-17-wheel-holdings
Setup: done
Started: 2026-09-16T23:09:51Z
Last updated: 2026-09-17T03:05:00Z
Feature phase: ship-paused

## Requirements
| # | Done | Requirement | Per-req ceremony | Commit |
|---|------|-------------|-----------------|--------|
| 1 | ✅ | Call ledger type with shared pace math | — | 4de95f4 |
| 2 | ✅ | Share lot type and view | — | 26554a4 |
| 3 | ✅ | Cash reserve and free-cash math | — | c1d226a |
| 4 | ✅ | Ledger document v1 extension | — | 93430ff |
| 5 | ✅ | Mark fetcher seam — side plus spot map | — | d5ade12 |
| 6 | ✅ | API surface — kinds, cash, delete-everywhere, combined cap | — | 25bcb78 |
| 7 | ✅ | One refresh marks puts, calls, and lots | — | dfb6ea6 |
| 8 | ✅ | Assignment — lot creation removes the put atomically | — | ec08725 |
| 9 | ✅ | Called away — single-rewrite FIFO lot reduction | — | 1d23bbc |
| 10 | ✅ | Frontend — variant C panel | — | d5ede1b |
| 11 | ✅ | Smoke lane coverage | — | 9a669a1 |

## Execution summary
| R# | Requirement | How it was built | Deviated? |
|----|-------------|------------------|-----------|
| 1 | Call ledger type with shared pace math | New `CallHolding` in core mirrors `Holding` field-for-field; validation rules and the pace view were extracted into shared `validate_option_leg`/`pace_view` helpers both types delegate to, so the pace math exists exactly once (pinned by a field-for-field view-equality test). | No |
| 2 | Share lot type and view | `ShareLot` + `SpotMark` + serialized `LotView` in core: value/P&L/spot need a mark, capacity floors shares/100 and covered is caller-supplied (derived from calls); `age_days` rides the view for the rail's lot rows. | No |
| 3 | Cash reserve and free-cash math | Two pure fns in core: `reserved_cash` sums strike×100×contracts over the puts slice only (calls/lots can't reserve by construction), `free_cash` subtracts honestly with no clamping. | No |
| 4 | Ledger document v1 extension | `HoldingsDocument` gains `calls`/`lots`/`cash` as serde-default fields, version stays 1; old put-only JSON loads with empty defaults and the full wheel document round-trips losslessly (document now derives PartialEq). | No |
| 5 | Mark fetcher seam — side plus spot map | `MarkRequest` carries `OptionChainSide`; the seam takes lot symbols and returns `MarkBatch{marks, spots}`. Production fetcher klines the union of symbols once and chain-queries only options, on their side; refresh merges option marks across both arrays via a small `OptionMarkSlot` trait and prices lots from spots (stale lots keep their previous SpotMark). Refresh response became the full ledger shape + refresh{ok,stale}. | No |
| 6 | API surface — kinds, cash, delete-everywhere, combined cap | POST dispatches on optional `kind` (put default unchanged; calls validate identically and land in calls; lots validate symbol/shares/basis plus handler-side acquired<=today); PATCH /api/holdings/cash returns derived numbers; DELETE falls through positions→calls→lots with 404-no-write; the 100 cap counts all arrays combined; GET/refresh carry cash, cash_reserved, cash_free (null until set). | No |
| 7 | One refresh marks puts, calls, and lots | Refresh machinery arrived with R5's re-read merge; R7 added the pins: a scripted pass prices put+call+lot (all ok, persisted), a mid-flight add survives the merge unclobbered, and a mixed pass (option error + missing lot spot) is stale per entry with previous marks kept. | No — behavior pre-landed in R5; R7 is the pinning pass |
| 8 | Assignment — lot creation removes the put atomically | `assigned_from` on the lot POST: the same read-modify-write that pushes the lot retains away the referenced put; unknown id 404s before any write (ledger byte-unchanged, pinned). | No |
| 9 | Called away — single-rewrite FIFO lot reduction | Pure `apply_called_away` in core picks the earliest-acquired covering lot (ties by id), drops lots emptied to zero; the route removes call + applies reduction in one write. Uncovered is a 200 outcome with reason, call still removed. | No |
| 10 | Frontend — variant C panel | Rewrote HoldingsPanel to the prototyped variant C: sticky rail (cash strip PATCHing and re-rendering from the response, wheel stats, lot rows with sell-call prefill at floor(shares/100)), one merged urgency list with kind chips/pace bars/status chips/full stats line, and every dialog anchored inline under its position; assignment reveals the prefilled lot form that POSTs assigned_from. Server owns every number except the pinned form prefills and the close dialog's realized-P&L preview. | No |
| 11 | Smoke lane coverage | Smoke lane extended to 63 assertions on a full-wheel fixture (put + ITM call + lot): rail cash states and PATCH-from-response, kind chips + stats line, ITM chip with danger vs-strike, single inline close panel in the clicked slot, assignment prefill POSTing assigned_from, sell-call prefill and validation-gated forms; ResultsPane/parity assertions untouched (46 legacy + 17 new). | Deviation: also added the rail lot rows' missing sell-call… button (R10 surface, caught while writing the assertions) |

## Code digest

<!-- Written once, after the feature review passes; never back-filled per requirement. -->

### Summary
The holdings ledger now tracks the full wheel: sold covered calls, share lots
from assignments, and a manual cash balance with derived reserved/free, beside
the existing puts — sibling arrays in one schema-v1 JSON document that old
ledgers parse unchanged. One scripted-seam refresh marks all three kinds (per-
side chain queries + a spot map for lots), and assignment / called-away are
single-rewrite server mutations that can never half-apply. The frontend is the
approved variant C: a sticky rail (cash, wheel stats, lots) beside one merged
urgency list, with every dialog anchored inline under the position that opened
it and every number owned by the server.

### Flow
Spine
  PATCH /api/holdings/cash -> cash set; reserved/free derived (R3 fns) [R6]
  POST /api/holdings -> kind dispatch -> validate_option_leg / ShareLot::validate -> push to positions|calls|lots [R6]
  kind:"lot" + assigned_from -> same read-modify-write retains away the referenced put [R8]
  POST /api/holdings/refresh -> MarkRequests(side per kind) + lot symbols -> fetcher -> MarkBatch{marks,spots} -> re-read + merge by id [R5][R7]
  POST /api/holdings/called-away -> apply_called_away FIFO (earliest acquired, ties by id) -> call + lot in one rewrite [R9]
  GET -> ledger_json: server views + cash/cash_reserved/cash_free [R6]
  Panel GET -> rail + merged urgency list; PATCH response re-renders the strip; dialogs inline under their position [R10]
Branches
  kind absent -> put (deployed clients unchanged) [R6]
  unknown assigned_from / call_id / DELETE id -> 404, ledger byte-unchanged [R8][R9]
  no covering lot -> 200 reduced:false + reason; call still removed [R9]
  entry added mid-refresh -> survives the re-read merge unclobbered [R7]
  kline/chain failure -> stale with reason, previous mark kept [R7]
  unpriced -> P&L/value None, day math + capacity still computed [R1][R2]
  was: refresh fetched put chains only -> now per-kind side + spots map; was: puts-only ledger -> now calls/lots/cash, schema stays v1
Side effects
  reads/writes: one <uid>.json ledger per identity; refresh talks to Tiger (quotes + chains per side)

### Gotchas
- [ALERT] First production exercise of OptionChainSide::Call rides Tiger's
  `in_the_money: false` filter — an ITM strike may return no row and report
  stale "no chain data" forever. Probe a live ITM strike (call + put) before
  trusting ITM marks (production-hazard review).
- No per-uid lock: overlapping mutations are last-write-wins on the whole
  document (mitigated by Cloud Run maxScale=1; flagged by the hazard review —
  a per-uid mutex is the follow-up if multi-device use ever matters).
- Rollback to a pre-wheel binary: the next ledger mutation rewrites the
  document WITHOUT calls/lots/cash. Back up ledgers before rolling back.
- `smoke`/parity lanes are the frontend gate; ResultsPane/parity assertions
  untouched (63 total smoke assertions).

### Key files
- crates/core/src/holdings.rs — CallHolding/ShareLot/SpotMark, shared pace_view + validate_option_leg, cash fns, apply_called_away
- crates/webapp/src/holdings.rs — schema-v1 document extension, MarkBatch seam, kind routes, PATCH cash, single-rewrite assignment/called-away
- crates/webapp/src/api.rs — new routes behind the existing Firebase gate
- crates/webapp/frontend/src/components/HoldingsPanel.jsx — variant-C panel (rail, merged list, inline dialogs, OptionForm)
- crates/webapp/frontend/src/smoke-entry.jsx — 63-assertion DOM smoke for the new panel
