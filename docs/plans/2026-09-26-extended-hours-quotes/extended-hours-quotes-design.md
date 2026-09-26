# Design: Extended-hours quotes for held lots (pre-market / post-market / overnight)

## At a glance

The webapp prices held share lots from regular-session kline closes only —
during pre-market, post-market, or the overnight session a lot row keeps
showing yesterday's regular close, because the Tiger client speaks only
`kline`, `option_chain`, `option_expiration`, and `grab_quote_permission`.
This design adds extended-hours retrieval through the **kline gateway's
`trade_session` parameter** — live-verified against the production account
on 2026-09-26: PreMarket / AfterHours / OverNight 1-minute bars all return
under the current permissions. During a closed-session refresh, up to three
batched 1-minute kline calls (one per extended session) yield each lot
symbol's last session close, and the **chronologically latest of them
becomes the lot's `spot`** — the one price on the row, tagged with the
session it came from; every view number (value, P&L) follows it, exactly
like a broker app showing the overnight price over the weekend. A
market-hours refresh clears the extended data and prices from the live
regular pass, as production does today.

Key decisions:

- **`spot` is the latest known price (user decision 2026-09-26, "I just
  want to see the latest price")** — during a closed session it is the
  chronologically newest extended close (argmax by bar time); when the
  market is open it is the live regular pass; value and P&L follow it, the
  way a broker app prices shares over the weekend. Old ledger JSON stays
  valid (the regular close simply reads as "latest" until the first
  closed-session refresh). (Supersedes the original "spot stays the
  regular close, display-only" decision.)
- **Additive serde fields on `SpotMark`** (`pre`/`post`/`overnight`/`session`,
  `#[serde(default)]`) — the ADR-0002 "schema stays v1 by additive defaults"
  pattern; no migration.
- **Extended data comes from 1-minute klines via `trade_session`, gated on
  the ET session clock (user decision 2026-09-26, pivoted from the
  real-time `brief` snapshot when the portal priced it at USD 99/month plus
  separate market-data fees)** — up to three batched calls per closed-
  session refresh, one per extended session, taking each symbol's last bar
  as the session price. The kline pass for the regular spot is untouched.
  (Rejected: the `brief` snapshot — paywalled for this account, whose
  permissions list `aStockQuoteLv1` + `usOptionQuote` but no
  `usQuoteBasic`; rejected: the free delayed snapshot — no extended-hours
  fields at all; rejected: fetch on panel open — puts network calls on the
  GET path the webapp deliberately keeps network-free.)
- **Lots only** — put/call rows keep their regular-close underlying; only
  lot symbols get extended-session calls (YAGNI; assumption offered for
  correction; unopposed).
- **One price, no session line** — the three-segment pre·post·overnight
  line was removed after preview feedback ("showing pre post overnight is
  confusing"); the row shows the latest price tagged with its source
  session, and nothing else. The per-session closes stay persisted
  (schema, future use) but are not displayed.
- **Best-effort extended data** — a failed or missing session price never
  blanks or breaks a row (assumption offered for correction; unopposed).

| R# | Requirement in one line | Risk |
|----|-------------------------|------|
| R1 | Tiger kline `trade_session` retrieval returns each symbol's last close per extended session | ⚠ production-risk |
| R2 | `SpotMark` carries extended quotes as additive, backward-compatible ledger fields | — |
| R3 | Refresh fetches extended closes only in closed sessions and prices lots at the latest | ⚠ production-risk |
| R4 | Lot row shows one price — the latest — tagged with its source session | — |

## Requirements

### R1: Extended-hours kline retrieval (trade_session)

`crates/core/src/tiger/api_caller.rs` gains
`query_session_closes(&self, symbols: &[&str], trade_session: &str) ->
Result<Vec<(String, model::ExtQuote)>, RequestError>`: a 1-minute kline
request per symbol chunk (`period: "1min"`, small `limit`,
`trade_session: PreMarket | AfterHours | OverNight`, batched at the
documented 50-symbol cap), returning per symbol the **last bar's close and
timestamp** as `ExtQuote { price, time }` — the session's latest trade.
Symbols whose response item has no bars are simply absent from the result.
The live response shape is already verified by probe (AAPL returned bars
for all three sessions on 2026-09-26); the hermetic tests use that shape
(`data: [{symbol, period, items: [{close, time, …}]}]`).

**Acceptance criteria**
- Given a captured kline response body for a session, When the parse runs, Then it yields one `(symbol, ExtQuote)` per symbol with items, the price being the **last** item's close and the time its timestamp.
- Given a response item with an empty or missing `items` array, When parsed, Then that symbol is absent from the result and other symbols survive.
- Given more symbols than the request cap, When `query_session_closes` runs, Then requests are chunked and every symbol comes back.
- Given a gateway error response (`code != 0`), non-200 status, or unreachable gateway, When `query_session_closes` runs, Then the error surfaces as `RequestError` like the other query methods.

### Checkpoints: none
### Review: skip

### Production-risk notes
- External API: consumes the Historical — Stocks/ETF quota (500/period on
  this account, 266 already used) — up to three calls per closed-session
  refresh, negligible against the pipeline's own draw but not zero.

### R2: Additive ledger fields on SpotMark

`SpotMark` in `crates/core/src/holdings.rs` grows optional fields —
`pre`, `post`, `overnight: Option<ExtQuote>` and `session: Option<String>` —
all `#[serde(default, skip_serializing_if = "Option::is_none")]`. The
`spot` field keeps its role as the one price the views compute from — its
SOURCE widens (latest extended close during closed sessions, regular close
otherwise). `session` names the source session of `spot` (`None` = the
regular pass). Existing per-UID ledger documents deserialize unchanged and
re-serialize byte-equivalently.

**Acceptance criteria**
- Given a `SpotMark` serialized before this change, When deserialized, Then it round-trips with all four new fields `None`.
- Given a `SpotMark` with extended fields set, When serialized then deserialized, Then the fields round-trip exactly.
- Given any view computation over a lot (`HoldingView`: P&L, pace, coverage), When extended fields are present, Then the computed values are identical to the same mark without them.

### Checkpoints: none
### Review: skip

### R3: Refresh fetches extended closes only in closed sessions and merges them into lot marks

A pure `et_market_session` helper (webapp, driven by the injected clock)
classifies the current instant into `MarketSession`: `PreMarket`
(weekdays 04:00–09:30 ET), `Regular` (weekdays 09:30–16:00 ET),
`AfterHours` (weekdays 16:00–20:00 ET), `OverNight` (20:00–04:00 ET),
`Closed` otherwise (weekend daytime). `POST /api/holdings/refresh` computes
the session, passes it to the fetcher (the `MarkFetcher` seam gains a
`MarketSession` parameter), and gates on it:

- **Regular**: the fetcher makes no extended calls (`ext` empty) and the
  handler clears every lot's extended fields and `session` — data captured
  in an earlier closed session is stale once the market opens, and `spot`
  prices from the live regular pass. Everything else behaves exactly as
  production today (kline pass → chain moneyness filter, option marks, lot
  spots).
- **Closed (PreMarket / AfterHours / OverNight / Closed)**: the fetcher
  additionally issues up to three batched `query_session_closes` calls
  (PreMarket, AfterHours, OverNight) for the **deduped lot symbols only**
  and assembles `ext: BTreeMap<String, SessionQuotes>` (`SessionQuotes {
  pre, post, overnight: Option<ExtQuote> }`); the handler prices the lot's
  `spot` at the **chronologically latest** present `ExtQuote` (max bar
  time — the session cycle pre → regular → post → overnight makes bar
  time the truth), persists all three closes, and stores `session` = that
  source session's name. With no extended data the lot falls back to the
  regular close with `session: None`.

A failed or empty extended session never blanks a regular mark: the lot
keeps its `spot`, the affected segments render as absent, and the pass is
reported stale only if the lot would otherwise be unmarked. The existing
per-symbol kline failure isolation is untouched.

**Acceptance criteria**
- Given the ET clock inside weekday 09:30–16:00, When refresh runs, Then no extended-kline calls are made and every lot's extended fields are cleared (None) — an extended line captured pre-open disappears after the open.
- Given the ET clock outside weekday 09:30–16:00, When refresh runs with lots, Then up to three batched extended-session calls cover the deduped lot symbols (never option symbols), and each lot's `spot` is priced at the chronologically latest present close with `session` naming its source session (all three closes persisted).
- Given the ET clock on weekend daytime, When refresh runs, Then `spot` prices at the overnight (or newest available) close with `session` naming that source — the row's one price is current all weekend.
- Given one extended-session call failing (or returning no bars for a symbol), When refresh merges, Then that session's close is simply absent from the latest-price selection, every regular mark stays intact, and the request does not error.
- Given a lot symbol absent from the underlying kline pass, When refresh runs in a closed session, Then the lot is reported stale and no extended data is persisted without a regular mark.
- Given a refresh that prices nothing, When it completes, Then the ledger file is not rewritten (existing no-create/no-rewrite property).

### Checkpoints: none
### Review: skip

### Production-risk notes
- External API: quota draw doubles at most on a closed-session refresh
  (regular pass + up to three extended calls); per-symbol failure isolation
  is preserved (each session call failing costs only its own segments).
- Concurrency/batch: the merge follows the existing re-read-after-fetch and
  merge-by-id rules; extended data never clobbers a position added while
  the fetch was in flight.
- The session classifier is a clock heuristic, not a trading calendar: on
  market holidays between 09:30–16:00 extended fields are cleared (correct
  — nothing trades), a half-day early close hides that afternoon's
  post-market session until 16:00 ET, and the overnight window is treated
  as 20:00–04:00 ET every night. Accepted.

### R4: Lot row shows the latest price, tagged

`LotRailRow` in `crates/webapp/frontend/src/components/HoldingsPanel.jsx`
keeps its existing layout but the headline price is now the latest known
price (`spot` semantics per R3): a small muted tag after the price names
its source session (`PreMarket` → pre, `AfterHours` → post, `OverNight` →
overnight) whenever `mark.session` is set. No session line, no per-session
segments, no deltas beyond the existing P&L line. The row is byte-identical
to production when `session` is absent.

**Acceptance criteria**
- Given a lot whose mark carries `session: "OverNight"` (spot = the overnight close), When the panel renders, Then the headline shows the overnight price followed by a small `overnight` tag.
- Given a lot with no `session` on its mark, When the panel renders, Then the row is exactly as before this feature (no tag, no extra line).
- Given a refresh that ran during a Regular session, When the panel renders, Then no tag appears (extended fields were cleared at merge; spot = the live regular price).

### Checkpoints: none
### Review: skip

## Production-risk areas

- **External API (Tiger kline `trade_session`)**: response shape
  live-verified 2026-09-26; the Historical quota draw grows by up to three
  calls per closed-session refresh; the overnight calendar is approximated
  by a clock heuristic. Reflected in R1 and R3 notes.
- **Ledger schema**: additive serde defaults only (ADR-0002) — no migration;
  R2 pins backward compatibility.

## Approaches considered

- **Extended-hours klines (`trade_session` parameter) — chosen (2026-09-26
  pivot)**: documented on the official kline API (`trade_session`:
  PreMarket / Regular / AfterHours; OverNight added in SDK 3.4.5, 2025-08)
  and **live-verified against the production account**: all three sessions
  returned real 1-minute bars (Friday post close 19:59 ET, Friday pre close
  09:29 ET, Saturday 04:00 ET overnight close) under the existing
  permissions. Costs: one call per session per refresh (three batched calls
  to show all sessions), no session status from Tiger (the ET clock
  classifier stands in), and a small draw on the Historical quota.
- **Real-time `brief` snapshot — lost on cost (was chosen earlier the same
  day)**: the gateway method resolves (probed: `quote` itself is not a
  supported method name), but the account's permission list holds
  `aStockQuoteLv1` + `usOptionQuote` and **no `usQuoteBasic`** — the
  snapshot needs it, and the developer portal prices it behind a USD
  99/month plan with market data billed separately. The free delayed
  snapshot (`get_stock_delay_briefs`, no permission) carries no
  extended-hours fields at all. All snapshot work was removed; git history
  retains it should the permission ever be bought.
- **Fetch extended quotes when the panel opens — lost**: puts network calls
  on the GET/view path the webapp deliberately keeps network-free, adds a
  caching question, and diverges from every other mark whose freshness is
  "as of the last refresh".
- **Quote every refresh regardless of session — lost**: during a Regular
  session the extended sessions hold nothing useful — the regular spot
  already arrives from the existing kline pass — so extended calls would be
  pure overhead against the Historical quota. The session gate skips them;
  a Regular-session refresh instead clears extended fields so stale
  pre-open data can't linger on the row.
- **Take the underlying price from the option chain response instead of the
  kline pass — lost for now**: the chain parser currently sources
  `underlying_price` from the kline map (`api_caller.rs:514`); chain items
  may carry their own underlying price, which would drop the kline call for
  chain-covered symbols during market hours. But the field's presence is
  unverified, the kline pass must still exist for lot-only symbols (no call
  path disappears entirely), and the moneyness filter's input semantics
  change. Revisit as a follow-up if the per-symbol saving matters.

## Architecture

**Components.** Core: `model.rs` gains `ExtQuote`;
`tiger/api_caller.rs` gains `query_session_closes`; `holdings.rs`
`SpotMark` grows four additive fields. Webapp: `holdings.rs` gains the
`MarketSession` classifier, `MarkBatch` gains the `ext` map;
`fetch_marks` issues the extended-session calls when the session is not
Regular; `holdings_refresh` gates the merge/clear and prices `spot` at the
latest close. Frontend: `HoldingsPanel.jsx` `LotRailRow` tags the headline
price with its source session; `style.css` one tokenized class.

**Data flow.** Refresh button → `holdings_refresh` (classifies the session
via `et_market_session` on the injected clock) → (spawn_blocking)
`fetch_marks`: kline pass (unchanged, feeds moneyness filter + regular
spot), then — only outside Regular — one 1-minute kline call per extended
session for the deduped lot symbols → `MarkBatch { marks, spots, ext }` →
merge (Regular: extended fields cleared; otherwise: `spot` = the latest
present close by bar time, `session` = its source session, all closes
persisted) → ledger JSON write → GET /api/holdings → `LotRailRow` shows
the one price tagged with its session.

**Error handling.** Extended data is best-effort everywhere: an empty
session response degrades to an absent segment (R1); merge failures keep
the regular mark and follow the stale-with-reason pattern (R3); a refresh
that prices nothing still never rewrites the file. Extended data never
gates, fails, or empties anything.

## Testing

Hermetic parse tests against the live-verified kline shape (core); serde
round-trip and view-immutability tests (core); session-classifier boundary
tests (webapp); scripted-fetcher webapp tests for the session gate, merge,
failure isolation, and no-rewrite (webapp, in the existing `holdings.rs`
test module style); DOM smoke assertions for the extended line, emphasis,
and absence cases against the built bundle. The existing parity lane
(`scoring.js`) is untouched by this feature.

## Feature acceptance

- Given a ledger holding a share lot, When I press refresh during or after an
  extended session and open the Lots pane, Then the lot's headline price is
  the latest known price (the newest session close) tagged with its source
  session, value and P&L follow it, and the persisted ledger JSON carries
  the additive fields.
- Given a ledger JSON written before this feature, When the webapp loads it
  and refresh has not yet run, Then it deserializes and renders exactly as
  before (no extended line); after one refresh the line appears.
- Given a lot priced at the overnight close from an evening refresh, When
  the market next opens and I refresh again, Then the tag is gone and the
  headline prices at the live regular pass.
- Given an extended-session kline call failing while the regular pass
  succeeds, When I press refresh, Then the request succeeds, lots price at
  the best available close (regular when no extended data survives) and no
  ledger rewrite is skipped or corrupted.

### Feature review: auto
