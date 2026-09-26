# Progress: extended-hours-quotes

Design: docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-design.md

Branch: extended-hours-quotes

Setup: n/a

Started: 2026-09-26T11:40:00+08:00

Last updated: 2026-09-26T13:20:00+08:00

Feature phase: ship-paused

## Requirements
| # | Done | Requirement | Per-req ceremony | Commit |
|---|------|-------------|-----------------|--------|
| 1 | ✅ | Tiger kline `trade_session` retrieval (pivoted from the brief route — paywalled) | — | b47351a ccde851 3da0a01 |
| 2 | ✅ | Additive ledger fields on SpotMark | — | f09f55c |
| 3 | ✅ | Refresh fetches extended closes only in closed sessions and merges them into lot marks | — | 7c3753c |
| 4 | ✅ | Lot row extended-hours line | — | 0199c0c |

## Execution summary
| R# | Requirement | How it was built | Deviated? |
|----|-------------|------------------|-----------|
| 1 | Tiger kline `trade_session` retrieval | `query_session_closes` in the Tiger client: batched 1-minute kline calls with `trade_session`, pure parser taking each symbol's last bar close+time; live shape verified by probe before the hermetic fixture. Yes — the route pivoted from the `brief` snapshot (paywalled USD 99/mo + market data; permissions list showed `aStockQuoteLv1`+`usOptionQuote`, no `usQuoteBasic`); brief code removed, deviation recorded. | Yes |
| 2 | Additive ledger fields on SpotMark | `pre`/`post`/`overnight`/`session` with serde defaults + skip_serializing_if; construction sites extended with `None`; serde round-trip and view-immutability tests. | No |
| 3 | Session-gated extended fetch + merge | `MarketSession` classifier (ET wall clock, Blue-Ocean overnight shape) threads through the `MarkFetcher` seam; outside Regular the refresh adds one 1-min kline call per extended session for deduped lot symbols; merge persists present sessions + active session name, Regular refresh clears them; `lot_json` carries the fields through the API. | No |
| 4 | Lot row extended-hours line | `LotRailRow` renders pre · post · overnight segments (label, price, signed delta vs the regular close, in-session emphasis via `hp-ext-now`); omitted without extended data or a spot baseline; one tokenized CSS class; smoke lane covers segments/deltas/emphasis/absence. | No |

## Deviation records

- **Latest-price spot semantics, user decision (2026-09-26, preview feedback)**:
  after seeing the three-segment pre·post·overnight line, the user asked
  "what is the latest price?" and directed "I just want to see the latest
  price." The `spot` semantic flipped from "regular-session close, extended
  display-only" to "latest known price": a closed-session refresh prices
  `spot` at the chronologically newest extended close (argmax bar time),
  `session` now names the SOURCE session of `spot`, value/P&L follow it
  (broker-app behavior), and the session line was removed from the row
  (one price + source tag instead). Supersedes the brainstorm-approved
  "spot unchanged" and "all present sessions displayed" decisions; R2/R3/R4
  criteria revised in the design doc before further implementation.

- **Design pivot, user decision (2026-09-26)**: the real-time `brief`
  snapshot route was abandoned when the developer portal priced it behind a
  USD 99/month plan with market data billed separately (the account holds
  `aStockQuoteLv1` + `usOptionQuote`, no `usQuoteBasic`; the free delayed
  snapshot has no extended-hours fields). The design pivoted to 1-minute
  klines via `trade_session` — live-verified for all three sessions under
  the existing permissions. The brief-route implementation (parser, batched
  call, raw probe arm, `StockQuote` type) is removed; `ExtQuote`, the
  SpotMark schema, the session gate, and R4's display carry over. The
  session gate reverts from persistence-rule to call-gating: no extended
  calls during Regular, since the ext data now comes from extra calls.
- **Gateway method finding (2026-09-26, probe)**: the gateway rejects
  method `quote` ("the current requested method does not support");
  `brief` resolves to a permission check. Recorded here for institutional
  memory even though the route pivoted away.
- **execute_query diagnostics (2026-09-26, R1)**: parse failures now include
  the response body head — added because the permission envelope was
  otherwise invisible; general error-hygiene improvement, kept.

## Code digest

### Summary
Held lots now price at the latest known price: outside the regular session
a refresh adds up to three batched 1-minute kline calls (one per extended
session, `trade_session` parameter — live-verified route), and the lot's
`spot` becomes the chronologically newest close with `session` naming its
source; value and P&L follow it, like a broker app pricing shares over the
weekend. The row shows that one price with a small source tag (`pre` /
`post` / `overnight`) and nothing else; a market-hours refresh clears the
extended data and prices from the live regular pass as before. All three
closes stay persisted on the mark for future use.

### Flow
- **Spine** — `holdings_refresh` -> [R3] `et_market_session` (injected clock) -> `fetch_marks` -> [R1] `query_session_closes` ×3 (PreMarket/AfterHours/OverNight, lot symbols only) -> `MarkBatch.ext` -> [R3] lot-mark merge (session-gated) -> ledger write -> `lot_json` -> [R4] `LotRailRow.extSegs` -> extended line.
- **Spine** — regular pass unchanged: kline close -> chain moneyness filter + option marks; lot `spot` = latest close outside Regular, live regular price during it [was: always the regular close].
- **Branches** — `session == Regular` -> no extended calls, extended fields cleared -> was: extended data never existed.
- **Branches** — session call fails or symbol has no bars -> that segment `None`, row omits it, regular mark intact.
- **Branches** — lot symbol missing from the kline pass -> stale-with-reason, no rewrite when nothing priced.
- **Branches** — `Closed` (weekend daytime, Friday night) -> prices at the last session that ended, tagged with its source (e.g. `overnight` after Sat 04:00).
- **Side effects** — reads: Tiger kline gateway (existing pass + ≤3 session calls per closed refresh, Historical quota) · writes: the per-UID ledger document (additive `pre`/`post`/`overnight`/`session` on `SpotMark`).

### Gotchas
- The session classifier is a clock heuristic, not a trading calendar: half-day early closes hide that afternoon's post-market session until 16:00 ET, holidays read as regular days, and the overnight window approximates Blue Ocean's 20:00–04:00 ET with no Friday/Saturday-night session (live-probed).
- `spot` now varies with refresh timing by design (user decision: latest known price) — a closed-session refresh re-prices value/P&L at that moment's newest session close; put/call rows keep their regular-close underlying (extended data is lots-only).
- Each closed-session refresh draws up to 3 calls from the Historical quota (500/period on this account).

### Key files
- `crates/core/src/tiger/api_caller.rs` — `query_session_closes` + pure `parse_session_closes` (last-bar close per symbol), kline batching.
- `crates/core/src/holdings.rs` — `SpotMark` additive fields (serde defaults, byte-compatible round-trips).
- `crates/webapp/src/holdings.rs` — `MarketSession` classifier, session-gated `fetch_marks`/`fetch_session_quotes`, merge/clear, `lot_json` passthrough.
- `crates/webapp/frontend/src/components/HoldingsPanel.jsx` — `LotRailRow` extended line (segments, deltas, `hp-ext-now` emphasis).
- `crates/webapp/frontend/src/style.css` — `.hp-lot-row-ext` / `.hp-ext-now` (token-only).
