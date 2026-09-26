# Review packet: 2026-09-26-extended-hours-quotes — feature review

Base: b5809bbb30fdce7d15a193ca61934c53b018f833

Head: 4e8674594f6895f449e1c2fdf2a02d4dd8325e48

## Commits

4e86745 holdings: the lot's price IS the latest price — user decision
25d8b57 docs: execution summary, review packet, code digest — ship checkpoint
0199c0c holdings: lot row extended-hours line
7c3753c holdings: refresh fetches extended-session closes, gated on the ET clock
f09f55c holdings: SpotMark grows additive extended-hours fields
3da0a01 quote: pivot to kline trade_session route — brief paywalled
ccde851 quote: probe corrects gateway method to brief; surface body on parse errors
b47351a quote: Tiger quote gateway method + parser, test-quote probe arm

## Changed files

 crates/core/src/holdings.rs                        |  89 +++-
 crates/core/src/model.rs                           |  10 +-
 crates/core/src/tiger/api_caller.rs                | 157 +++++-
 crates/webapp/frontend/dist/assets/app.css         |   2 +-
 crates/webapp/frontend/dist/assets/app.js          |   6 +-
 .../frontend/src/components/HoldingsPanel.jsx      |  12 +-
 crates/webapp/frontend/src/smoke-entry.jsx         |  65 +++
 crates/webapp/frontend/src/style.css               |   7 +
 crates/webapp/src/api.rs                           |   6 +-
 crates/webapp/src/auth.rs                          |   3 +-
 crates/webapp/src/holdings.rs                      | 533 ++++++++++++++++++++-
 .../extended-hours-quotes-design.md                | 378 ++++++++-------
 .../extended-hours-quotes-progress.md              |  77 ++-
 13 files changed, 1109 insertions(+), 236 deletions(-)

## Acceptance criteria (verbatim from the design doc)

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


## Feature acceptance (verbatim)

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


## Production-risk notes (verbatim, if any)

### Production-risk notes
- External API: consumes the Historical — Stocks/ETF quota (500/period on
  this account, 266 already used) — up to three calls per closed-session
  refresh, negligible against the pipeline's own draw but not zero.

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

## Production-risk areas

- **External API (Tiger kline `trade_session`)**: response shape
  live-verified 2026-09-26; the Historical quota draw grows by up to three
  calls per closed-session refresh; the overnight calendar is approximated
  by a clock heuristic. Reflected in R1 and R3 notes.
- **Ledger schema**: additive serde defaults only (ADR-0002) — no migration;
  R2 pins backward compatibility.


## Diff

diff --git a/crates/core/src/holdings.rs b/crates/core/src/holdings.rs
index e1820b4..04f81f1 100644
--- a/crates/core/src/holdings.rs
+++ b/crates/core/src/holdings.rs
@@ -87,11 +87,25 @@ pub struct ShareLot {
 }
 
 /// The underlying spot quote a lot prices from, captured by the refresh
-/// that covered its symbol.
+/// that covered its symbol. The extended-hours fields are additive
+/// (ADR-0002 pattern): absent on every mark written before the feature and
+/// skipped on serialization when `None`.
 #[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
 pub struct SpotMark {
     pub spot: f64,
     pub as_of: DateTime<Utc>,
+    /// Pre-market / post-market / overnight last prices captured by a
+    /// closed-session refresh; display-only, never read by view math.
+    #[serde(default, skip_serializing_if = "Option::is_none")]
+    pub pre: Option<crate::model::ExtQuote>,
+    #[serde(default, skip_serializing_if = "Option::is_none")]
+    pub post: Option<crate::model::ExtQuote>,
+    #[serde(default, skip_serializing_if = "Option::is_none")]
+    pub overnight: Option<crate::model::ExtQuote>,
+    /// The extended session active at capture time (`PreMarket`,
+    /// `AfterHours`, `OverNight`) — drives the row's in-session emphasis.
+    #[serde(default, skip_serializing_if = "Option::is_none")]
+    pub session: Option<String>,
 }
 
 /// The close decision for one holding, as rendered on the card.
@@ -686,6 +700,7 @@ mod tests {
     /// R2: share lots from assignments, priced from the underlying spot.
     mod share_lot {
         use super::*;
+        use chrono::TimeZone;
 
         fn lot(shares: u32, basis: f64) -> ShareLot {
             ShareLot {
@@ -708,6 +723,10 @@ mod tests {
             l.mark = Some(SpotMark {
                 spot: 344.20,
                 as_of: Utc::now(),
+                pre: None,
+                post: None,
+                overnight: None,
+                session: None,
             });
             let v = l.view(today, 2);
             let value = v.value.unwrap();
@@ -723,6 +742,74 @@ mod tests {
             assert_eq!(v.age_days, 0);
         }
 
+        /// Extended-hours R2: a pre-feature mark JSON carries no extended
+        /// fields, deserializes with all four `None`, and re-serializes
+        /// byte-equivalently (skip_serializing_if keeps the document clean).
+        #[test]
+        fn spot_mark_round_trips_pre_feature_json() {
+            let json = r#"{"spot":249.87,"as_of":"2026-09-08T15:00:00Z"}"#;
+            let mark: SpotMark = serde_json::from_str(json).unwrap();
+            assert_eq!(mark.spot, 249.87);
+            assert_eq!(mark.pre, None);
+            assert_eq!(mark.post, None);
+            assert_eq!(mark.overnight, None);
+            assert_eq!(mark.session, None);
+            let out = serde_json::to_string(&mark).unwrap();
+            assert_eq!(out, r#"{"spot":249.87,"as_of":"2026-09-08T15:00:00Z"}"#);
+        }
+
+        /// Extended-hours R2: a fully-populated mark round-trips exactly.
+        #[test]
+        fn spot_mark_round_trips_extended_fields() {
+            let ext = crate::model::ExtQuote {
+                price: 251.2,
+                time: Utc.with_ymd_and_hms(2026, 9, 8, 13, 15, 0).unwrap(),
+            };
+            let mark = SpotMark {
+                spot: 249.87,
+                as_of: Utc.with_ymd_and_hms(2026, 9, 8, 22, 0, 0).unwrap(),
+                pre: Some(ext.clone()),
+                post: Some(crate::model::ExtQuote {
+                    price: 250.05,
+                    time: Utc.with_ymd_and_hms(2026, 9, 8, 19, 59, 0).unwrap(),
+                }),
+                overnight: None,
+                session: Some("AfterHours".to_string()),
+            };
+            let json = serde_json::to_string(&mark).unwrap();
+            let back: SpotMark = serde_json::from_str(&json).unwrap();
+            assert_eq!(back, mark);
+            assert!(json.contains("\"session\":\"AfterHours\""));
+            let _ = ext;
+        }
+
+        /// Extended-hours R2: extended fields never move the view math.
+        #[test]
+        fn spot_mark_extended_fields_leave_view_unchanged() {
+            let today = NaiveDate::from_ymd_opt(2026, 9, 8).unwrap();
+            let mut l = lot(200, 349.0);
+            l.mark = Some(SpotMark {
+                spot: 344.20,
+                as_of: Utc.with_ymd_and_hms(2026, 9, 8, 22, 0, 0).unwrap(),
+                pre: Some(crate::model::ExtQuote {
+                    price: 345.0,
+                    time: Utc.with_ymd_and_hms(2026, 9, 8, 13, 0, 0).unwrap(),
+                }),
+                post: Some(crate::model::ExtQuote {
+                    price: 343.0,
+                    time: Utc.with_ymd_and_hms(2026, 9, 8, 19, 0, 0).unwrap(),
+                }),
+                overnight: None,
+                session: Some("AfterHours".to_string()),
+            });
+            let with_ext = l.view(today, 2);
+            l.mark.as_mut().unwrap().pre = None;
+            l.mark.as_mut().unwrap().post = None;
+            l.mark.as_mut().unwrap().session = None;
+            let without_ext = l.view(today, 2);
+            assert_eq!(with_ext, without_ext);
+        }
+
         /// Unpriced lots report no value/P&L/spot but still compute
         /// capacity, and carry the passed-in covered count.
         #[test]
diff --git a/crates/core/src/model.rs b/crates/core/src/model.rs
index d79ad2d..fd79b85 100644
--- a/crates/core/src/model.rs
+++ b/crates/core/src/model.rs
@@ -7,7 +7,7 @@ use std::{
     io::{self, BufWriter},
 };
 
-use chrono::NaiveDate;
+use chrono::{DateTime, NaiveDate, Utc};
 use chrono_tz::America::New_York;
 use csv::Writer;
 use rusqlite::{
@@ -76,6 +76,14 @@ pub struct Candle {
     pub timestamp: u32, // Timestamp of the candle.
 }
 
+/// One extended-hours session quote (pre-market, post-market, or
+/// overnight): the session's last trade price and when it traded.
+#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
+pub struct ExtQuote {
+    pub price: f64,
+    pub time: DateTime<Utc>,
+}
+
 #[derive(Debug)]
 pub struct MaxDropPeriod {
     pub symbol: String,
diff --git a/crates/core/src/tiger/api_caller.rs b/crates/core/src/tiger/api_caller.rs
index a30026e..8e914ab 100644
--- a/crates/core/src/tiger/api_caller.rs
+++ b/crates/core/src/tiger/api_caller.rs
@@ -295,6 +295,35 @@ impl Requester {
         Ok(candles)
     }
 
+    /// Extended-session last closes (extended-hours quotes): a 1-minute
+    /// kline request per symbol chunk with `trade_session` set, returning
+    /// per symbol the last bar's close and timestamp — that session's
+    /// latest trade. Symbols with no bars in the session are absent.
+    pub async fn query_session_closes(
+        &self,
+        symbols: &[&str],
+        trade_session: &str,
+    ) -> Result<Vec<(String, model::ExtQuote)>, RequestError> {
+        let mut out = Vec::new();
+        for batch in kline_batches(symbols) {
+            let biz_content = serde_json::json!({
+                "symbols": batch,
+                "period": "1min",
+                "limit": 5,
+                "trade_session": trade_session,
+            });
+
+            let resp = self
+                .execute_query(METHOD_KLINE, "", Some(biz_content))
+                .await
+                .map_err(|e| {
+                    RequestError::Other(format!("Failed to execute query: {}", e))
+                })?;
+            out.extend(parse_session_closes(&resp.data));
+        }
+        Ok(out)
+    }
+
     pub async fn option_expiration(
         &mut self,
         symbols: &[&str],
@@ -704,10 +733,16 @@ impl Requester {
             )));
         }
 
-        let result: Response = response
-            .json()
+        let body_text = response
+            .text()
             .await
-            .map_err(|e| RequestError::Other(format!("Failed to parse response: {}", e)))?;
+            .map_err(|e| RequestError::Other(format!("Failed to read response body: {}", e)))?;
+        let result: Response = serde_json::from_str(&body_text).map_err(|e| {
+            // An unexpected envelope (e.g. a method-level error without
+            // `data`) would otherwise vanish — surface its head verbatim.
+            let head: String = body_text.chars().take(300).collect();
+            RequestError::Other(format!("Failed to parse response: {e}; body={head}"))
+        })?;
 
         if result.code != 0 {
             return Err(RequestError::Other(format!(
@@ -859,3 +894,119 @@ fn calculate_mid_price(bid: f64, ask: f64, last: f64) -> f64 {
         last
     }
 }
+
+/// The kline gateway caps symbols per request (documented: 50).
+const KLINE_BATCH_MAX: usize = 50;
+
+/// Chunk symbol lists for the kline gateway's per-request cap.
+fn kline_batches<'a>(symbols: &[&'a str]) -> Vec<Vec<&'a str>> {
+    symbols.chunks(KLINE_BATCH_MAX).map(<[&str]>::to_vec).collect()
+}
+
+/// Parse an extended-session kline response (`data` array of
+/// `{symbol, period, items}`) into per-symbol last-bar closes: the
+/// session's latest trade. Symbols with no bars are absent. Shape
+/// live-verified 2026-09-26 (AAPL PreMarket / AfterHours / OverNight).
+fn parse_session_closes(data: &serde_json::Value) -> Vec<(String, model::ExtQuote)> {
+    let mut out = Vec::new();
+    let Ok(entries) = parse_response_as_array(data, "Invalid response format: expected array")
+    else {
+        return out;
+    };
+    for entry in entries {
+        let Ok(entry) =
+            parse_value_as_object(entry, "Invalid response format: expected object")
+        else {
+            continue;
+        };
+        let Some(symbol) = entry.get("symbol").and_then(|v| v.as_str()).map(str::to_string)
+        else {
+            continue;
+        };
+        let Some(bars) = entry.get("items").and_then(|v| v.as_array()) else {
+            continue;
+        };
+        let Some(last) = bars.iter().filter_map(|b| b.as_object()).next_back() else {
+            continue;
+        };
+        let Some(price) = last.get("close").and_then(|v| v.as_f64()) else {
+            continue;
+        };
+        let Some(ms) = last.get("time").and_then(|v| v.as_f64()) else {
+            continue;
+        };
+        let Some(time) = chrono::DateTime::from_timestamp((ms / 1000.0) as i64, 0) else {
+            continue;
+        };
+        out.push((symbol, model::ExtQuote { price, time }));
+    }
+    out
+}
+
+#[cfg(test)]
+mod session_close_tests {
+    use super::*;
+
+    // Shape captured from the live 2026-09-26 probe (AAPL, all sessions).
+    fn live_shape() -> serde_json::Value {
+        serde_json::json!([
+            {"items":[
+                {"amount":23558.6817,"close":341.44,"high":341.44,"low":341.4001,"open":341.4001,"time":1790380620000u64,"volume":69},
+                {"amount":212046.3457,"close":341.4603,"high":341.4899,"low":341.44,"open":341.4899,"time":1790380740000u64,"volume":621}
+            ],"period":"1min","symbol":"AAPL"},
+            {"items":[],"period":"1min","symbol":"HALTED"}
+        ])
+    }
+
+    #[test]
+    fn parse_takes_last_bar_close_and_time() {
+        let closes = parse_session_closes(&live_shape());
+        assert_eq!(closes.len(), 1, "symbol with no bars is absent");
+        let (symbol, quote) = &closes[0];
+        assert_eq!(symbol, "AAPL");
+        assert_eq!(quote.price, 341.4603, "last bar's close, not the first");
+        assert_eq!(
+            quote.time,
+            chrono::DateTime::from_timestamp(1790380740, 0).unwrap()
+        );
+    }
+
+    #[test]
+    fn parse_survives_garbled_entries() {
+        let data = serde_json::json!([
+            {"symbol": "NOITEMS"},
+            {"symbol": "NOPRICE", "items": [{"open": 1.0}]},
+            {"symbol": "BADTIME", "items": [{"close": 1.5, "time": "x"}]},
+            "not-an-object",
+            {"symbol": "OK", "items": [{"close": 2.5, "time": 1790380740000u64}]}
+        ]);
+        let closes = parse_session_closes(&data);
+        assert_eq!(closes.len(), 1);
+        assert_eq!(closes[0].0, "OK");
+        assert_eq!(closes[0].1.price, 2.5);
+    }
+
+    #[test]
+    fn parse_rejects_non_array_data() {
+        assert!(parse_session_closes(&serde_json::json!({"error": 1})).is_empty());
+    }
+
+    #[test]
+    fn kline_batches_chunk_at_the_cap() {
+        let symbols: Vec<&str> = (0..120).map(|_| "S").collect();
+        let batches = kline_batches(&symbols);
+        assert_eq!(batches.len(), 3);
+        assert_eq!(batches[0].len(), KLINE_BATCH_MAX);
+        assert_eq!(batches[2].len(), 20);
+    }
+
+    /// The shared execute_query error path surfaces through
+    /// query_session_closes like through every other query method
+    /// (unreachable gateway stub).
+    #[tokio::test]
+    async fn query_session_closes_surfaces_request_errors() {
+        let requester = Requester::pipeline_test_stub();
+        let err = requester.query_session_closes(&["AAPL"], "AfterHours").await;
+        assert!(err.is_err(), "dead gateway must surface a RequestError");
+    }
+}
diff --git a/crates/webapp/frontend/dist/assets/app.css b/crates/webapp/frontend/dist/assets/app.css
index fb78404..94f59e2 100644
--- a/crates/webapp/frontend/dist/assets/app.css
+++ b/crates/webapp/frontend/dist/assets/app.css
@@ -1 +1 @@
-:root{--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--kind-put-bg: rgba(96, 165, 250, .18);--kind-put-ink: #7fb5f5;--kind-call-bg: rgba(251, 191, 36, .16);--kind-call-ink: #e8b84a}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.45}.shell{max-width:1280px;margin:0 auto;padding:16px;height:100vh;display:flex;flex-direction:column}.brand{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}.brand-mark{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}.brand-accent{color:var(--accent)}.brand-sub{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.cache-line{color:var(--muted);margin-bottom:12px}.pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel);margin-left:6px}.pill.fresh{border-color:var(--ok);color:var(--ok)}.pill.stale{border-color:var(--warn);color:var(--warn)}.pill.none,.pill.closed{color:var(--muted)}.error-banner{border:1px solid var(--err-line);background:var(--err-wash);color:var(--err);padding:10px 12px;border-radius:6px;margin-bottom:12px}.tabs{display:flex;gap:4px;margin-top:4px}.tab{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;padding:6px 14px;font:inherit;color:var(--muted);cursor:pointer}.tab.active{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent);border-color:var(--accent)}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:8px 0}.filter-input{width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--panel);font:inherit;color:var(--ink)}.filter-input:focus{outline:none;border-color:var(--accent)}.check{display:inline-flex;align-items:center;gap:5px;cursor:pointer;-webkit-user-select:none;user-select:none;color:var(--ink)}.tool-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font:inherit;color:var(--ink);cursor:pointer}.tool-btn:hover{border-color:var(--accent)}.count-line{margin-left:auto;color:var(--muted);white-space:nowrap}.colpicker{position:relative;display:inline-block}.pop-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:40;background:transparent}.picker-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:41;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px 12px;width:min(430px,92vw);box-shadow:0 8px 24px #1c27331f}.picker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px 10px;margin-bottom:8px}.pick-item{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;cursor:pointer}.linklike{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;padding:2px 0;font:inherit;font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer}table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);font-size:12.5px}th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--border);white-space:nowrap}th{position:sticky;top:0;z-index:2;background:var(--panel);-webkit-user-select:none;user-select:none;cursor:pointer}th:hover{color:var(--accent)}.sort-arrow{display:inline-block;margin-left:4px;color:var(--accent)}td.num,th.num{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}td.strong{font-weight:700}tbody tr:hover td{background:var(--row-hover)}tr.pick td{background:var(--pick-tint)}tr.pick:hover td{background:var(--pick-hover)}tr.pick b{font-weight:700}.star{color:var(--star);font-weight:700;font-size:11px;margin-right:6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:middle}.dot.green{background:var(--dot-green)}.dot.yellow{background:var(--dot-yellow)}.dot.red{background:var(--dot-red)}.chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;font-family:-apple-system,SF Pro Text,Segoe UI,Roboto,sans-serif;vertical-align:middle;margin-left:6px}.chip.high{background:var(--chip-warn-bg);color:var(--chip-warn-ink)}.chip.extended{background:var(--chip-err-bg);color:var(--err)}.chip.normal{background:var(--chip-mute-bg);color:var(--muted)}tr.prow td{opacity:.62}.null-mark{color:var(--danger-ink);opacity:.85}.empty-panel{border:1px dashed var(--border);background:var(--panel);border-radius:8px;padding:18px;color:var(--muted)}.pager{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:6px 10px;background:var(--panel);border:1px solid var(--border);border-top:none}.pager-label{color:var(--muted);margin-right:8px;white-space:nowrap}.pgbtn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;min-width:26px;padding:2px 7px;font:inherit;font-size:12px;color:var(--ink);cursor:pointer}.pgbtn:hover:not(:disabled){border-color:var(--accent)}.pgbtn.active{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.pgbtn:disabled{opacity:.45;cursor:default}.pggap{color:var(--muted);padding:0 2px}.gate-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.gate-card{width:340px;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:22px 24px}.gate-title{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0 0 16px}.gate-label{display:block;font-size:12px;color:var(--muted);margin-bottom:10px}.gate-label input{display:block;width:100%;margin-top:3px;padding:6px 8px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.gate-label input:focus{outline:none;border-color:var(--accent)}.btn{font:inherit;padding:6px 12px;border-radius:5px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn:hover:not(:disabled){border-color:var(--accent)}.btn:disabled{opacity:.55;cursor:default}.btn-primary{width:100%;background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.gate-toggle{display:inline-block;margin-top:10px;font:inherit;font-size:12px;background:none;border:none;color:var(--accent);cursor:pointer;padding:0}.gate-or{text-align:center;color:var(--muted);font-size:11px;margin:14px 0}.gate-error{margin-top:12px;padding:7px 10px;border:1px solid var(--err-line);border-radius:5px;background:var(--err-wash);color:var(--err);font-size:12px}.gate-note{color:var(--muted)}.user-box{position:relative;float:right;display:flex;align-items:center;font-size:12px}.user-pill{display:inline-flex;align-items:center;gap:6px}.user-box .user-email{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-caret{color:var(--muted);font-size:9px}.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:45;min-width:230px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px #1c27331f}.acct-label{padding:5px 10px 3px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.acct-email{padding:0 10px 4px;font-size:12px;word-break:break-all}.account-menu .btn-ghost{display:flex;width:100%;justify-content:center;margin-top:4px}.btn-ghost{font:inherit;font-size:12px;padding:3px 10px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:60;background:#1c273373;display:grid;place-items:center;padding:16px}.access-card{width:min(420px,100%);max-height:min(85dvh,720px);overflow-y:auto}.access-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--page);font-size:12.5px}.access-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access-remove{flex:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:var(--err);font-size:13px;cursor:pointer;padding:2px 5px;border-radius:4px}.access-remove:hover{background:var(--badge-err-bg)}.access-remove:disabled{opacity:.4;cursor:default}.access-add{display:flex;flex-direction:column;gap:8px;margin-top:10px}.access-add input{width:100%;padding:7px 9px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.access-add .btn{width:100%}.access-add input:focus{outline:none;border-color:var(--accent)}.run-slot-head{float:right;margin-left:12px}.theme-slot-head{float:right;margin:0 10px;display:flex;align-items:center}.run-btn{font:inherit;padding:5px 14px;border-radius:5px;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);cursor:pointer}.run-btn:hover:not(:disabled){background:var(--accent-deep)}.run-btn:disabled{background:var(--chip-mute-bg);border-color:var(--chip-mute-line);color:var(--muted);cursor:default}.run-strip{clear:both;border:1px solid var(--border);background:var(--panel);border-radius:6px;padding:10px 14px;margin-bottom:14px}.toast-cached{background:var(--pick-tint);border:1px solid var(--warn-line);color:var(--chip-warn-ink);border-radius:5px;padding:6px 10px;font-size:12px;margin-bottom:8px}.toast-cached.warn{background:var(--chip-err-bg);border-color:var(--chip-err-line);color:var(--err)}.run-headline{font-size:13px;margin-bottom:8px}.run-stages{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:4px 24px}.run-stage{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted)}.run-stage .mark{width:1.1em;text-align:center}.run-stage.pending .mark{color:var(--faint)}.run-stage.active{color:var(--accent)}.run-stage.ok{color:var(--ok)}.run-stage.partial{color:var(--warn)}.run-stage.failed{color:var(--dot-red)}.run-count{font-variant-numeric:tabular-nums;color:var(--muted)}.run-bar{flex:1;height:6px;min-width:80px;background:var(--sunk);border-radius:3px;overflow:hidden}.run-bar .fill{display:block;height:100%;background:var(--accent);transition:width .25s ease-out}.run-errors{font-size:12px;color:var(--muted);margin-top:6px}.run-errors summary{cursor:pointer;color:var(--muted)}.run-errors ul{margin:6px 0 0 18px}.run-warn{margin-top:8px;font-size:12px;color:var(--err)}.pane{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}.pane[hidden]{display:none}.scroll-region{flex:1 1 auto;min-height:140px;overflow:auto}.tip{position:relative}.tip-target{border-bottom:1px dotted var(--faint);cursor:help}.tip:after{content:attr(data-tip);display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:40;width:max-content;max-width:340px;padding:6px 9px;border-radius:6px;background:var(--tip-bg);color:var(--tip-ink);font-size:11.5px;font-weight:400;line-height:1.45;white-space:normal;text-align:left;box-shadow:0 2px 10px #1c273347;pointer-events:none}.tip:hover:after,.tip:focus-within:after{display:block}.tip-flip:after{left:auto;right:0}tr.expandable{cursor:pointer}tr.expandable.open td{background:var(--exp-open)}th.exp-col,td.exp-col{width:26px;min-width:26px;padding:5px 2px;text-align:center;color:var(--muted)}tr.exp-row>td{background:var(--exp-inner);white-space:normal;padding:0}.expansion{border-left:3px solid var(--exp-edge);padding:10px 12px;max-width:calc(100vw - 24px);position:sticky;left:0}.exp-grid{display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:10px}.exp-block{min-width:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px}.exp-block h4{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.exp-chips{grid-column:1 / -1}.kv{display:grid;grid-template-columns:minmax(96px,max-content) 1fr;gap:1px 12px;align-items:baseline;margin-top:3px;font-size:12.5px}.kv-label{color:var(--muted)}.kv-value{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.kv .muted-note{grid-column:1 / -1;text-align:left}.band-chart{position:relative;height:50px;margin:2px 0 10px;background:var(--band-bg);border:1px solid var(--border);border-radius:4px}.band-shade{position:absolute;top:0;height:30px;background:#0d5cd724;border-left:1px solid rgba(13,92,215,.35);border-right:1px solid rgba(13,92,215,.35)}.marker{position:absolute;top:0}.marker-tick{position:absolute;top:0;left:-1px;width:2px;height:20px}.marker-cap{position:absolute;top:32px;left:0;transform:translate(-50%);font-size:10px;line-height:1.25;color:var(--muted);white-space:nowrap;text-align:center}.mk-strike .marker-tick{height:30px;background:var(--accent)}.mk-strike .marker-cap{color:var(--accent);font-weight:600}.mk-be .marker-tick{background:var(--ok)}.mk-spot .marker-tick{background:var(--ink)}.bar-row{display:grid;grid-template-columns:minmax(120px,max-content) 1fr 48px;gap:8px;align-items:center;margin-top:5px;font-size:12px}.bar-weight{color:var(--muted);font-size:10.5px}.bar-track{display:block;height:8px;background:var(--bar-track);border-radius:4px;overflow:hidden}.bar-fill{display:block;height:100%;background:var(--accent);border-radius:4px}.bar-val{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.bar-row.total{margin-top:9px;padding-top:7px;border-top:1px dashed var(--border)}.bar-row.total .bar-label{font-weight:600}.chip-hidden{display:inline-block;margin:0 6px 6px 0;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--page);font-size:11.5px}.chip-hidden.is-null{opacity:.55}.earnings-banner{margin-bottom:10px;padding:7px 10px;border:1px solid var(--warn-line);border-radius:5px;background:var(--warn-wash);color:var(--chip-warn-ink);font-size:12px}.stage-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.sbadge{display:inline-block;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--panel);font-size:11.5px;color:var(--muted)}.sbadge summary{cursor:pointer;list-style:none}.sbadge summary::-webkit-details-marker{display:none}.sbadge.ok{color:var(--ok);border-color:var(--badge-ok-line);background:var(--badge-ok-bg)}.sbadge.partial{color:var(--warn);border-color:var(--badge-warn-line);background:var(--badge-warn-bg)}.sbadge.failed{color:var(--err);border-color:var(--badge-err-line);background:var(--badge-err-bg)}.errbox{margin:8px 0 0;padding:8px 10px;max-height:180px;overflow:auto;background:var(--err-wash);border:1px solid var(--badge-err-line);border-radius:5px;color:var(--err);font-size:11.5px;line-height:1.4;white-space:pre-wrap}.stage-failed-panel{border-color:var(--badge-err-line);background:var(--badge-err-bg);color:var(--err)}.stage-failed-panel .errbox{background:var(--panel)}.hero{margin-top:8px;padding:26px 30px;background:var(--panel);border:1px solid var(--border);border-radius:8px}.hero h2{margin:0 0 8px;font-size:15px}.hero p{margin:7px 0;max-width:72ch}.muted-note{color:var(--muted);font-size:12px}@media(max-width:640px){.picker-panel{position:fixed;left:12px;right:12px;top:auto;bottom:12px;width:auto;max-height:calc(100vh - 60px);overflow:auto}.exp-grid,.run-stages{grid-template-columns:1fr}.tip:after{position:fixed;top:auto;bottom:12px;left:12px;right:12px;width:auto;max-width:none}.tip-flip:after{right:12px}th .tip:after{display:none!important}th .tip-target{border-bottom:0;cursor:inherit}.pager{z-index:1}.expansion{z-index:2}th{z-index:3}}@media(max-width:480px){.picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}details.adjust{flex:none;margin:10px 0 0;background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden}details.adjust summary{padding:10px 14px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}details.adjust summary::-webkit-details-marker{display:none}details.adjust summary:after{content:"▾";color:var(--muted)}details.adjust[open] summary:after{content:"▴"}details.adjust .hint{font-weight:400;font-size:12px;color:var(--muted)}details.adjust .hint-custom{color:var(--accent)}.adjust-body{padding:2px 14px 14px;border-top:1px solid var(--border)}.adjust-body .ctl{margin:12px 0 4px}.adjust-body .ctl label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}.adjust-body .ctl .val{font-variant-numeric:tabular-nums;color:var(--muted)}.adjust-body input[type=range]{width:100%;accent-color:var(--accent)}.adjust-body .reset{margin-top:10px;width:100%;padding:9px 0;border-radius:8px;border:1px solid var(--border);background:transparent;font-size:14px;cursor:pointer}.score-cell .score-frozen{display:block;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}.score-cell .score-frozen.readmit{color:var(--readmit)}@media(max-width:640px){.controls{flex-wrap:wrap}.count-line{flex:1 0 100%}}.holdings-refresh{flex:0 0 auto}.holdings-notice{border:1px solid var(--border);background:var(--panel);border-left:3px solid var(--accent);padding:6px 10px;border-radius:6px;margin-bottom:10px;color:var(--muted)}.holdings-pos{color:var(--ok)}.holdings-neg{color:var(--err)}.holdings-add{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px dashed var(--border);border-radius:8px;padding:8px 10px;background:var(--panel);flex:1}.holdings-add label{display:inline-flex;gap:4px;align-items:center;color:var(--muted);font-size:11px}.holdings-add input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;background:var(--page);color:var(--ink);max-width:110px}.holdings-add input:first-child{text-transform:uppercase}.holdings-close-btn{font-size:11px}.holdings-bar{position:relative;height:10px;border-radius:999px;background:var(--pace-track);overflow:visible}.holdings-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--accent);opacity:.85}.holdings-bar-mark{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--warn)}.holdings-card-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;border-top:1px solid var(--border);padding-top:8px}.holdings-card-stats div{display:flex;flex-direction:column;min-width:0}.holdings-card-stats span{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.holdings-card-stats b{font-variant-numeric:tabular-nums;font-size:12.5px}.holdings-card-stats i{font-style:normal;font-size:10.5px;color:var(--muted)}.holdings-outcome{border:1px solid var(--accent);border-radius:8px;background:var(--panel);padding:10px 12px;margin-top:10px;max-width:420px}.holdings-outcome-head{font-weight:600;margin-bottom:8px}.holdings-outcome-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}.holdings-outcome-row label{display:inline-flex;gap:5px;align-items:center;font-size:12px}.holdings-outcome-price{display:flex;gap:6px;align-items:center;font-size:12px;margin-bottom:8px}.holdings-outcome-price input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;width:90px}.holdings-outcome-realized{font-size:12px;color:var(--muted);margin-bottom:8px}.holdings-outcome-actions{display:flex;gap:8px;justify-content:flex-end}@media(max-width:720px){.holdings-card-stats{grid-template-columns:repeat(2,1fr)}.holdings-refresh{justify-content:center}.holdings-add{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;width:100%}.holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:2px}.holdings-add input{max-width:none;width:100%}.holdings-add .btn,.holdings-add .btn-primary{grid-column:1 / -1}}.hp-tabs-shell{padding:16px 0 0}.hp-tabs-grid{display:grid;grid-template-columns:13rem 1fr;gap:1.1rem;align-items:start}.hp-tabs-rail{display:flex;flex-direction:column;gap:.55rem;position:sticky;top:10px}.hp-tabs-brand{font-size:.62rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;padding:2px 4px}.hp-tab-tile{width:100%;text-align:left;-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;cursor:pointer;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.6rem .8rem;color:var(--muted)}.hp-tab-tile.active{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent);color:var(--ink)}.hp-tab-tile-name{font-weight:700;font-size:.8rem;letter-spacing:.04em}.hp-tab-tile-count{float:right;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}.hp-tab-tile-sub{font-size:.68rem;margin-top:2px}.hp-tabs-main{display:flex;flex-direction:column;gap:.35rem;min-width:0}.hp-pane-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.hp-pane-title{font-weight:700;font-size:.95rem}.hp-pane-head .holdings-refresh{margin-left:auto}.hp-pane-hint{margin-left:auto;font-size:.72rem;opacity:.6}.hp-rail-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.7rem .9rem}.hp-rail-label{font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem}.hp-rail-big{font-size:1.6rem;font-weight:700;color:var(--ok)}.hp-rail-sub{font-size:.72rem;opacity:.6;margin-top:.15rem}.hp-lot-row{padding:.28rem 0;border-bottom:1px solid var(--border)}.hp-lot-row-top{display:flex;justify-content:space-between;gap:.6rem;font-size:.85rem}.hp-lot-row-top b{font-variant-numeric:tabular-nums}.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.6rem;font-size:.72rem;opacity:.78;margin-top:.1rem}.hp-lot-row-sub b{font-variant-numeric:tabular-nums}.hp-lot-row-meta{display:flex;justify-content:space-between;gap:.6rem;font-size:.68rem;opacity:.55;margin-top:.1rem}.hp-lot-row-meta i{font-style:normal}.hp-toolbar-row{display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem}.hp-list{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem}.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5rem minmax(9rem,1fr) 8rem auto;gap:.8rem;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.55rem .8rem}.hp-list-row.hp-row-met{border-color:var(--ok)}.hp-list-head{background:transparent;border:0;padding:.1rem .8rem;font-size:.68rem;opacity:.55;text-transform:uppercase;letter-spacing:.05em}.hp-list-pos{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.72rem;opacity:.6}.hp-kind{font-size:.6rem;font-weight:700;letter-spacing:.06em;border-radius:5px;padding:.1rem .35rem}.hp-kind[data-kind=put]{background:var(--kind-put-bg);color:var(--kind-put-ink)}.hp-kind[data-kind=call]{background:var(--kind-call-bg);color:var(--kind-call-ink)}.hp-list-pace .holdings-bar{min-width:7rem}.hp-slot{display:flex;flex-direction:column;gap:.45rem;min-width:0}.hp-list-status{display:flex;flex-direction:column;gap:.25rem;align-items:flex-start}.hp-list-stats{grid-column:1 / -1;margin-top:.15rem}.hp-cash-edit{margin-left:auto;font-size:.75rem}.hp-cash-editor{margin-left:auto;display:flex;gap:.35rem;align-items:center}.hp-cash-editor input{flex:1 1 6rem;min-width:0;font:inherit;padding:.25rem .45rem;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:inherit}.hp-cash-editor .btn{font-size:.7rem;padding:.25rem .5rem}.hp-dialog-note{font-size:.72rem;opacity:.65;margin-top:.5rem;border-top:1px solid var(--border);padding-top:.4rem}@media(max-width:900px){.hp-tabs-grid{grid-template-columns:1fr}.hp-tabs-rail{position:static;flex-direction:row;flex-wrap:wrap;align-items:stretch}.hp-tabs-brand{width:100%}.hp-tabs-rail .hp-rail-block{flex:1 1 100%;display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap}.hp-tabs-rail .hp-rail-big{font-size:1.15rem}.hp-tabs-rail .hp-pool-section{flex:1 1 100%}.hp-tab-tile{flex:1;width:auto}.hp-pane-head .hp-pane-title,.hp-list-row.hp-list-head{display:none}.hp-list-row{display:flex;flex-direction:column;align-items:stretch;gap:.45rem}.hp-list-pos{justify-content:flex-start}.hp-list-pos .hp-pool-pick{margin-left:auto}.hp-list-pos>i{flex:1 1 100%}.hp-list-pace{display:flex;flex-direction:column;gap:.15rem}.hp-list-status{flex-direction:row;flex-wrap:wrap}.hp-list-row .holdings-close-btn{align-self:flex-end}}@media(max-width:720px){.hp-cash-editor{margin-left:0}}@media(max-width:480px){.hp-tab-tile{padding:.5rem .6rem}.hp-tab-tile-sub{font-size:.62rem}}@media(prefers-color-scheme:dark){:root{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}}html[data-theme=dark]{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}html[data-theme=light]{color-scheme:light;--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--accent-deep: #0a4cb4;--kind-put-ink: #7fb5f5;--kind-call-ink: #e8b84a}.hp-pool-section{display:flex;flex-direction:column;gap:.3rem;margin-top:.45rem}.hp-pool-list{display:flex;flex-direction:column;gap:.25rem}.hp-pool-item{border:1px solid var(--border);border-radius:7px;padding:.25rem .4rem}.hp-pool-item.active{border-color:var(--accent)}.hp-pool-line{display:flex;flex-wrap:wrap;gap:.3rem .45rem;align-items:center;min-width:0}.hp-pool-name-row{display:flex;gap:.3rem;align-items:center;min-width:0;flex:1 1 100%}.hp-pool-name{font:inherit;font-size:.72rem;font-weight:700;color:var(--ink);background:transparent;border:none;padding:0;cursor:pointer;flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hp-pool-item.active .hp-pool-name{color:var(--accent)}.hp-pool-cash{font-size:.66rem;opacity:.7;white-space:nowrap;font-variant-numeric:tabular-nums}.hp-pool-act{font-size:.6rem;padding:.05rem .3rem}.hp-pool-row{display:flex;gap:.3rem;align-items:center}.hp-pool-row input{flex:1;min-width:0;font:inherit;font-size:.7rem;padding:.15rem .35rem;border:1px solid var(--border);border-radius:5px;background:var(--panel);color:var(--ink)}.hp-pool-row .btn{font-size:.66rem;padding:.12rem .45rem}.hp-pool-del{color:var(--err);font-size:.66rem;padding:.05rem .3rem}.hp-pool-tag{font-size:.6rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:transparent;border:1px solid var(--border);border-radius:999px;padding:.06rem .4rem;white-space:nowrap}.hp-pool-pick{font:inherit;font-size:.62rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.06rem .4rem;white-space:nowrap;cursor:pointer}.holdings-add select{font:inherit;padding:5px 6px;border:1px solid var(--border);border-radius:5px;background:var(--panel);color:var(--ink)}
+:root{--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--kind-put-bg: rgba(96, 165, 250, .18);--kind-put-ink: #7fb5f5;--kind-call-bg: rgba(251, 191, 36, .16);--kind-call-ink: #e8b84a}*{box-sizing:border-box}body{margin:0;background:var(--page);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:13px;line-height:1.45}.shell{max-width:1280px;margin:0 auto;padding:16px;height:100vh;display:flex;flex-direction:column}.brand{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 10px;margin:0 0 4px}.brand-mark{font-size:17px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}.brand-accent{color:var(--accent)}.brand-sub{font-size:10.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}.cache-line{color:var(--muted);margin-bottom:12px}.pill{display:inline-block;padding:1px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel);margin-left:6px}.pill.fresh{border-color:var(--ok);color:var(--ok)}.pill.stale{border-color:var(--warn);color:var(--warn)}.pill.none,.pill.closed{color:var(--muted)}.error-banner{border:1px solid var(--err-line);background:var(--err-wash);color:var(--err);padding:10px 12px;border-radius:6px;margin-bottom:12px}.tabs{display:flex;gap:4px;margin-top:4px}.tab{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-bottom:none;border-radius:8px 8px 0 0;padding:6px 14px;font:inherit;color:var(--muted);cursor:pointer}.tab.active{color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent);border-color:var(--accent)}.controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:8px 0}.filter-input{width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--panel);font:inherit;color:var(--ink)}.filter-input:focus{outline:none;border-color:var(--accent)}.check{display:inline-flex;align-items:center;gap:5px;cursor:pointer;-webkit-user-select:none;user-select:none;color:var(--ink)}.tool-btn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font:inherit;color:var(--ink);cursor:pointer}.tool-btn:hover{border-color:var(--accent)}.count-line{margin-left:auto;color:var(--muted);white-space:nowrap}.colpicker{position:relative;display:inline-block}.pop-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:40;background:transparent}.picker-panel{position:absolute;right:0;top:calc(100% + 4px);z-index:41;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px 12px;width:min(430px,92vw);box-shadow:0 8px 24px #1c27331f}.picker-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px 10px;margin-bottom:8px}.pick-item{display:flex;align-items:center;gap:6px;font-size:12px;white-space:nowrap;cursor:pointer}.linklike{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;padding:2px 0;font:inherit;font-size:12px;color:var(--accent);text-decoration:underline;cursor:pointer}table{width:100%;border-collapse:collapse;background:var(--panel);border:1px solid var(--border);font-size:12.5px}th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--border);white-space:nowrap}th{position:sticky;top:0;z-index:2;background:var(--panel);-webkit-user-select:none;user-select:none;cursor:pointer}th:hover{color:var(--accent)}.sort-arrow{display:inline-block;margin-left:4px;color:var(--accent)}td.num,th.num{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}td.strong{font-weight:700}tbody tr:hover td{background:var(--row-hover)}tr.pick td{background:var(--pick-tint)}tr.pick:hover td{background:var(--pick-hover)}tr.pick b{font-weight:700}.star{color:var(--star);font-weight:700;font-size:11px;margin-right:6px}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;vertical-align:middle}.dot.green{background:var(--dot-green)}.dot.yellow{background:var(--dot-yellow)}.dot.red{background:var(--dot-red)}.chip{display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;font-family:-apple-system,SF Pro Text,Segoe UI,Roboto,sans-serif;vertical-align:middle;margin-left:6px}.chip.high{background:var(--chip-warn-bg);color:var(--chip-warn-ink)}.chip.extended{background:var(--chip-err-bg);color:var(--err)}.chip.normal{background:var(--chip-mute-bg);color:var(--muted)}tr.prow td{opacity:.62}.null-mark{color:var(--danger-ink);opacity:.85}.empty-panel{border:1px dashed var(--border);background:var(--panel);border-radius:8px;padding:18px;color:var(--muted)}.pager{position:sticky;bottom:0;z-index:3;display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:6px 10px;background:var(--panel);border:1px solid var(--border);border-top:none}.pager-label{color:var(--muted);margin-right:8px;white-space:nowrap}.pgbtn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:var(--panel);border:1px solid var(--border);border-radius:6px;min-width:26px;padding:2px 7px;font:inherit;font-size:12px;color:var(--ink);cursor:pointer}.pgbtn:hover:not(:disabled){border-color:var(--accent)}.pgbtn.active{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.pgbtn:disabled{opacity:.45;cursor:default}.pggap{color:var(--muted);padding:0 2px}.gate-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.gate-card{width:340px;background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:22px 24px}.gate-title{display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0 0 16px}.gate-label{display:block;font-size:12px;color:var(--muted);margin-bottom:10px}.gate-label input{display:block;width:100%;margin-top:3px;padding:6px 8px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.gate-label input:focus{outline:none;border-color:var(--accent)}.btn{font:inherit;padding:6px 12px;border-radius:5px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn:hover:not(:disabled){border-color:var(--accent)}.btn:disabled{opacity:.55;cursor:default}.btn-primary{width:100%;background:var(--accent);border-color:var(--accent);color:var(--on-accent)}.gate-toggle{display:inline-block;margin-top:10px;font:inherit;font-size:12px;background:none;border:none;color:var(--accent);cursor:pointer;padding:0}.gate-or{text-align:center;color:var(--muted);font-size:11px;margin:14px 0}.gate-error{margin-top:12px;padding:7px 10px;border:1px solid var(--err-line);border-radius:5px;background:var(--err-wash);color:var(--err);font-size:12px}.gate-note{color:var(--muted)}.user-box{position:relative;float:right;display:flex;align-items:center;font-size:12px}.user-pill{display:inline-flex;align-items:center;gap:6px}.user-box .user-email{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-caret{color:var(--muted);font-size:9px}.account-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:45;min-width:230px;padding:6px;background:var(--panel);border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px #1c27331f}.acct-label{padding:5px 10px 3px;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.acct-email{padding:0 10px 4px;font-size:12px;word-break:break-all}.account-menu .btn-ghost{display:flex;width:100%;justify-content:center;margin-top:4px}.btn-ghost{font:inherit;font-size:12px;padding:3px 10px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--ink);cursor:pointer}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:60;background:#1c273373;display:grid;place-items:center;padding:16px}.access-card{width:min(420px,100%);max-height:min(85dvh,720px);overflow-y:auto}.access-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--page);font-size:12.5px}.access-email{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.access-remove{flex:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:var(--err);font-size:13px;cursor:pointer;padding:2px 5px;border-radius:4px}.access-remove:hover{background:var(--badge-err-bg)}.access-remove:disabled{opacity:.4;cursor:default}.access-add{display:flex;flex-direction:column;gap:8px;margin-top:10px}.access-add input{width:100%;padding:7px 9px;font:inherit;color:inherit;background:var(--page);border:1px solid var(--border);border-radius:5px}.access-add .btn{width:100%}.access-add input:focus{outline:none;border-color:var(--accent)}.run-slot-head{float:right;margin-left:12px}.theme-slot-head{float:right;margin:0 10px;display:flex;align-items:center}.run-btn{font:inherit;padding:5px 14px;border-radius:5px;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);cursor:pointer}.run-btn:hover:not(:disabled){background:var(--accent-deep)}.run-btn:disabled{background:var(--chip-mute-bg);border-color:var(--chip-mute-line);color:var(--muted);cursor:default}.run-strip{clear:both;border:1px solid var(--border);background:var(--panel);border-radius:6px;padding:10px 14px;margin-bottom:14px}.toast-cached{background:var(--pick-tint);border:1px solid var(--warn-line);color:var(--chip-warn-ink);border-radius:5px;padding:6px 10px;font-size:12px;margin-bottom:8px}.toast-cached.warn{background:var(--chip-err-bg);border-color:var(--chip-err-line);color:var(--err)}.run-headline{font-size:13px;margin-bottom:8px}.run-stages{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:4px 24px}.run-stage{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted)}.run-stage .mark{width:1.1em;text-align:center}.run-stage.pending .mark{color:var(--faint)}.run-stage.active{color:var(--accent)}.run-stage.ok{color:var(--ok)}.run-stage.partial{color:var(--warn)}.run-stage.failed{color:var(--dot-red)}.run-count{font-variant-numeric:tabular-nums;color:var(--muted)}.run-bar{flex:1;height:6px;min-width:80px;background:var(--sunk);border-radius:3px;overflow:hidden}.run-bar .fill{display:block;height:100%;background:var(--accent);transition:width .25s ease-out}.run-errors{font-size:12px;color:var(--muted);margin-top:6px}.run-errors summary{cursor:pointer;color:var(--muted)}.run-errors ul{margin:6px 0 0 18px}.run-warn{margin-top:8px;font-size:12px;color:var(--err)}.pane{display:flex;flex-direction:column;flex:1 1 auto;min-height:0}.pane[hidden]{display:none}.scroll-region{flex:1 1 auto;min-height:140px;overflow:auto}.tip{position:relative}.tip-target{border-bottom:1px dotted var(--faint);cursor:help}.tip:after{content:attr(data-tip);display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:40;width:max-content;max-width:340px;padding:6px 9px;border-radius:6px;background:var(--tip-bg);color:var(--tip-ink);font-size:11.5px;font-weight:400;line-height:1.45;white-space:normal;text-align:left;box-shadow:0 2px 10px #1c273347;pointer-events:none}.tip:hover:after,.tip:focus-within:after{display:block}.tip-flip:after{left:auto;right:0}tr.expandable{cursor:pointer}tr.expandable.open td{background:var(--exp-open)}th.exp-col,td.exp-col{width:26px;min-width:26px;padding:5px 2px;text-align:center;color:var(--muted)}tr.exp-row>td{background:var(--exp-inner);white-space:normal;padding:0}.expansion{border-left:3px solid var(--exp-edge);padding:10px 12px;max-width:calc(100vw - 24px);position:sticky;left:0}.exp-grid{display:grid;grid-template-columns:repeat(2,minmax(300px,1fr));gap:10px}.exp-block{min-width:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:10px 12px}.exp-block h4{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--muted)}.exp-chips{grid-column:1 / -1}.kv{display:grid;grid-template-columns:minmax(96px,max-content) 1fr;gap:1px 12px;align-items:baseline;margin-top:3px;font-size:12.5px}.kv-label{color:var(--muted)}.kv-value{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.kv .muted-note{grid-column:1 / -1;text-align:left}.band-chart{position:relative;height:50px;margin:2px 0 10px;background:var(--band-bg);border:1px solid var(--border);border-radius:4px}.band-shade{position:absolute;top:0;height:30px;background:#0d5cd724;border-left:1px solid rgba(13,92,215,.35);border-right:1px solid rgba(13,92,215,.35)}.marker{position:absolute;top:0}.marker-tick{position:absolute;top:0;left:-1px;width:2px;height:20px}.marker-cap{position:absolute;top:32px;left:0;transform:translate(-50%);font-size:10px;line-height:1.25;color:var(--muted);white-space:nowrap;text-align:center}.mk-strike .marker-tick{height:30px;background:var(--accent)}.mk-strike .marker-cap{color:var(--accent);font-weight:600}.mk-be .marker-tick{background:var(--ok)}.mk-spot .marker-tick{background:var(--ink)}.bar-row{display:grid;grid-template-columns:minmax(120px,max-content) 1fr 48px;gap:8px;align-items:center;margin-top:5px;font-size:12px}.bar-weight{color:var(--muted);font-size:10.5px}.bar-track{display:block;height:8px;background:var(--bar-track);border-radius:4px;overflow:hidden}.bar-fill{display:block;height:100%;background:var(--accent);border-radius:4px}.bar-val{text-align:right;font-family:ui-monospace,SF Mono,Menlo,monospace;font-variant-numeric:tabular-nums}.bar-row.total{margin-top:9px;padding-top:7px;border-top:1px dashed var(--border)}.bar-row.total .bar-label{font-weight:600}.chip-hidden{display:inline-block;margin:0 6px 6px 0;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--page);font-size:11.5px}.chip-hidden.is-null{opacity:.55}.earnings-banner{margin-bottom:10px;padding:7px 10px;border:1px solid var(--warn-line);border-radius:5px;background:var(--warn-wash);color:var(--chip-warn-ink);font-size:12px}.stage-badges{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.sbadge{display:inline-block;padding:2px 9px;border:1px solid var(--border);border-radius:999px;background:var(--panel);font-size:11.5px;color:var(--muted)}.sbadge summary{cursor:pointer;list-style:none}.sbadge summary::-webkit-details-marker{display:none}.sbadge.ok{color:var(--ok);border-color:var(--badge-ok-line);background:var(--badge-ok-bg)}.sbadge.partial{color:var(--warn);border-color:var(--badge-warn-line);background:var(--badge-warn-bg)}.sbadge.failed{color:var(--err);border-color:var(--badge-err-line);background:var(--badge-err-bg)}.errbox{margin:8px 0 0;padding:8px 10px;max-height:180px;overflow:auto;background:var(--err-wash);border:1px solid var(--badge-err-line);border-radius:5px;color:var(--err);font-size:11.5px;line-height:1.4;white-space:pre-wrap}.stage-failed-panel{border-color:var(--badge-err-line);background:var(--badge-err-bg);color:var(--err)}.stage-failed-panel .errbox{background:var(--panel)}.hero{margin-top:8px;padding:26px 30px;background:var(--panel);border:1px solid var(--border);border-radius:8px}.hero h2{margin:0 0 8px;font-size:15px}.hero p{margin:7px 0;max-width:72ch}.muted-note{color:var(--muted);font-size:12px}@media(max-width:640px){.picker-panel{position:fixed;left:12px;right:12px;top:auto;bottom:12px;width:auto;max-height:calc(100vh - 60px);overflow:auto}.exp-grid,.run-stages{grid-template-columns:1fr}.tip:after{position:fixed;top:auto;bottom:12px;left:12px;right:12px;width:auto;max-width:none}.tip-flip:after{right:12px}th .tip:after{display:none!important}th .tip-target{border-bottom:0;cursor:inherit}.pager{z-index:1}.expansion{z-index:2}th{z-index:3}}@media(max-width:480px){.picker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}details.adjust{flex:none;margin:10px 0 0;background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden}details.adjust summary{padding:10px 14px;font-weight:600;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:8px}details.adjust summary::-webkit-details-marker{display:none}details.adjust summary:after{content:"▾";color:var(--muted)}details.adjust[open] summary:after{content:"▴"}details.adjust .hint{font-weight:400;font-size:12px;color:var(--muted)}details.adjust .hint-custom{color:var(--accent)}.adjust-body{padding:2px 14px 14px;border-top:1px solid var(--border)}.adjust-body .ctl{margin:12px 0 4px}.adjust-body .ctl label{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}.adjust-body .ctl .val{font-variant-numeric:tabular-nums;color:var(--muted)}.adjust-body input[type=range]{width:100%;accent-color:var(--accent)}.adjust-body .reset{margin-top:10px;width:100%;padding:9px 0;border-radius:8px;border:1px solid var(--border);background:transparent;font-size:14px;cursor:pointer}.score-cell .score-frozen{display:block;font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}.score-cell .score-frozen.readmit{color:var(--readmit)}@media(max-width:640px){.controls{flex-wrap:wrap}.count-line{flex:1 0 100%}}.holdings-refresh{flex:0 0 auto}.holdings-notice{border:1px solid var(--border);background:var(--panel);border-left:3px solid var(--accent);padding:6px 10px;border-radius:6px;margin-bottom:10px;color:var(--muted)}.holdings-pos{color:var(--ok)}.holdings-neg{color:var(--err)}.holdings-add{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px dashed var(--border);border-radius:8px;padding:8px 10px;background:var(--panel);flex:1}.holdings-add label{display:inline-flex;gap:4px;align-items:center;color:var(--muted);font-size:11px}.holdings-add input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;background:var(--page);color:var(--ink);max-width:110px}.holdings-add input:first-child{text-transform:uppercase}.holdings-close-btn{font-size:11px}.holdings-bar{position:relative;height:10px;border-radius:999px;background:var(--pace-track);overflow:visible}.holdings-bar-fill{position:absolute;inset:0 auto 0 0;border-radius:999px;background:var(--accent);opacity:.85}.holdings-bar-mark{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--warn)}.holdings-card-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;border-top:1px solid var(--border);padding-top:8px}.holdings-card-stats div{display:flex;flex-direction:column;min-width:0}.holdings-card-stats span{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.holdings-card-stats b{font-variant-numeric:tabular-nums;font-size:12.5px}.holdings-card-stats i{font-style:normal;font-size:10.5px;color:var(--muted)}.holdings-outcome{border:1px solid var(--accent);border-radius:8px;background:var(--panel);padding:10px 12px;margin-top:10px;max-width:420px}.holdings-outcome-head{font-weight:600;margin-bottom:8px}.holdings-outcome-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}.holdings-outcome-row label{display:inline-flex;gap:5px;align-items:center;font-size:12px}.holdings-outcome-price{display:flex;gap:6px;align-items:center;font-size:12px;margin-bottom:8px}.holdings-outcome-price input{border:1px solid var(--border);border-radius:6px;padding:4px 6px;font:inherit;width:90px}.holdings-outcome-realized{font-size:12px;color:var(--muted);margin-bottom:8px}.holdings-outcome-actions{display:flex;gap:8px;justify-content:flex-end}@media(max-width:720px){.holdings-card-stats{grid-template-columns:repeat(2,1fr)}.holdings-refresh{justify-content:center}.holdings-add{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;width:100%}.holdings-add label{display:flex;flex-direction:column;align-items:stretch;gap:2px}.holdings-add input{max-width:none;width:100%}.holdings-add .btn,.holdings-add .btn-primary{grid-column:1 / -1}}.hp-tabs-shell{padding:16px 0 0}.hp-tabs-grid{display:grid;grid-template-columns:13rem 1fr;gap:1.1rem;align-items:start}.hp-tabs-rail{display:flex;flex-direction:column;gap:.55rem;position:sticky;top:10px}.hp-tabs-brand{font-size:.62rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;padding:2px 4px}.hp-tab-tile{width:100%;text-align:left;-webkit-appearance:none;-moz-appearance:none;appearance:none;font:inherit;cursor:pointer;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.6rem .8rem;color:var(--muted)}.hp-tab-tile.active{border-color:var(--accent);box-shadow:inset 3px 0 0 var(--accent);color:var(--ink)}.hp-tab-tile-name{font-weight:700;font-size:.8rem;letter-spacing:.04em}.hp-tab-tile-count{float:right;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}.hp-tab-tile-sub{font-size:.68rem;margin-top:2px}.hp-tabs-main{display:flex;flex-direction:column;gap:.35rem;min-width:0}.hp-pane-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem}.hp-pane-title{font-weight:700;font-size:.95rem}.hp-pane-head .holdings-refresh{margin-left:auto}.hp-pane-hint{margin-left:auto;font-size:.72rem;opacity:.6}.hp-rail-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.7rem .9rem}.hp-rail-label{font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem}.hp-rail-big{font-size:1.6rem;font-weight:700;color:var(--ok)}.hp-rail-sub{font-size:.72rem;opacity:.6;margin-top:.15rem}.hp-lot-row{padding:.28rem 0;border-bottom:1px solid var(--border)}.hp-lot-row-top{display:flex;justify-content:space-between;gap:.6rem;font-size:.85rem}.hp-lot-row-top b{font-variant-numeric:tabular-nums}.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.6rem;font-size:.72rem;opacity:.78;margin-top:.1rem}.hp-lot-row-sub b{font-variant-numeric:tabular-nums}.hp-spot-session{font-style:normal;font-weight:400;font-size:.68rem;color:var(--muted);margin-left:.3rem}.hp-lot-row-meta{display:flex;justify-content:space-between;gap:.6rem;font-size:.68rem;opacity:.55;margin-top:.1rem}.hp-lot-row-meta i{font-style:normal}.hp-toolbar-row{display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem}.hp-list{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem}.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5rem minmax(9rem,1fr) 8rem auto;gap:.8rem;align-items:center;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:.55rem .8rem}.hp-list-row.hp-row-met{border-color:var(--ok)}.hp-list-head{background:transparent;border:0;padding:.1rem .8rem;font-size:.68rem;opacity:.55;text-transform:uppercase;letter-spacing:.05em}.hp-list-pos{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.72rem;opacity:.6}.hp-kind{font-size:.6rem;font-weight:700;letter-spacing:.06em;border-radius:5px;padding:.1rem .35rem}.hp-kind[data-kind=put]{background:var(--kind-put-bg);color:var(--kind-put-ink)}.hp-kind[data-kind=call]{background:var(--kind-call-bg);color:var(--kind-call-ink)}.hp-list-pace .holdings-bar{min-width:7rem}.hp-slot{display:flex;flex-direction:column;gap:.45rem;min-width:0}.hp-list-status{display:flex;flex-direction:column;gap:.25rem;align-items:flex-start}.hp-list-stats{grid-column:1 / -1;margin-top:.15rem}.hp-cash-edit{margin-left:auto;font-size:.75rem}.hp-cash-editor{margin-left:auto;display:flex;gap:.35rem;align-items:center}.hp-cash-editor input{flex:1 1 6rem;min-width:0;font:inherit;padding:.25rem .45rem;border:1px solid var(--border);border-radius:6px;background:var(--panel);color:inherit}.hp-cash-editor .btn{font-size:.7rem;padding:.25rem .5rem}.hp-dialog-note{font-size:.72rem;opacity:.65;margin-top:.5rem;border-top:1px solid var(--border);padding-top:.4rem}@media(max-width:900px){.hp-tabs-grid{grid-template-columns:1fr}.hp-tabs-rail{position:static;flex-direction:row;flex-wrap:wrap;align-items:stretch}.hp-tabs-brand{width:100%}.hp-tabs-rail .hp-rail-block{flex:1 1 100%;display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap}.hp-tabs-rail .hp-rail-big{font-size:1.15rem}.hp-tabs-rail .hp-pool-section{flex:1 1 100%}.hp-tab-tile{flex:1;width:auto}.hp-pane-head .hp-pane-title,.hp-list-row.hp-list-head{display:none}.hp-list-row{display:flex;flex-direction:column;align-items:stretch;gap:.45rem}.hp-list-pos{justify-content:flex-start}.hp-list-pos .hp-pool-pick{margin-left:auto}.hp-list-pos>i{flex:1 1 100%}.hp-list-pace{display:flex;flex-direction:column;gap:.15rem}.hp-list-status{flex-direction:row;flex-wrap:wrap}.hp-list-row .holdings-close-btn{align-self:flex-end}}@media(max-width:720px){.hp-cash-editor{margin-left:0}}@media(max-width:480px){.hp-tab-tile{padding:.5rem .6rem}.hp-tab-tile-sub{font-size:.62rem}}@media(prefers-color-scheme:dark){:root{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}}html[data-theme=dark]{color-scheme:dark;--page: #12161c;--panel: #1b222b;--border: #2c3642;--accent: #4d8dff;--ink: #e6ebf1;--muted: #9aa8b6;--ok: #3dbd6e;--warn: #d9a441;--err: #e0705c;--dot-green: #34c464;--dot-yellow: #e3b93e;--dot-red: #e0604d;--pick-tint: #37301a;--star: #e0b45a;--on-accent: #081428;--row-hover: #202a36;--pick-hover: #3d3520;--sunk: #232c37;--faint: #6b7885;--danger-ink: #e08a92;--err-wash: #3a2422;--err-line: #6b3a35;--chip-warn-bg: #3d3013;--chip-warn-ink: #e2bc63;--chip-err-bg: #402624;--chip-err-line: #6e4038;--chip-mute-bg: #273240;--chip-mute-line: #3a4656;--warn-wash: #3b3013;--warn-line: #5c4d20;--exp-open: #1e2b3d;--exp-inner: #1a222d;--exp-edge: #2f4a73;--band-bg: #232c37;--bar-track: #2a3441;--pace-track: #2a3441;--badge-ok-bg: #1d2f25;--badge-ok-line: #2f5240;--badge-warn-bg: #352c14;--badge-warn-line: #5c4d24;--badge-err-bg: #35211f;--badge-err-line: #63362f;--readmit: #34c48f;--tip-bg: #e6ebf1;--tip-ink: #1c2733;--accent-deep: #3a76e0;--kind-put-ink: #8cc0ff;--kind-call-ink: #f0c766}html[data-theme=light]{color-scheme:light;--page: #f6f7f9;--panel: #ffffff;--border: #dde3ea;--accent: #0d5cd7;--ink: #1c2733;--muted: #51606f;--ok: #137a3a;--warn: #a06b00;--err: #a02a1a;--dot-green: #1a9f48;--dot-yellow: #d7a313;--dot-red: #cc4433;--pick-tint: #fdf6e0;--star: #c08a00;--on-accent: #ffffff;--row-hover: #f4f7fb;--pick-hover: #faf0cd;--sunk: #eef2f6;--faint: #9aa7b5;--danger-ink: #b3555f;--err-wash: #fdf0f0;--err-line: #e4b7b7;--chip-warn-bg: #f4e3c8;--chip-warn-ink: #8a5a00;--chip-err-bg: #f3d4d0;--chip-err-line: #e0b7b0;--chip-mute-bg: #e6ecf2;--chip-mute-line: #c9d2dd;--warn-wash: #fdf3df;--warn-line: #eedfb8;--exp-open: #eef4fc;--exp-inner: #fbfcfe;--exp-edge: #b9d2f2;--band-bg: #f2f5f8;--bar-track: #edf1f5;--pace-track: #e8edf3;--badge-ok-bg: #eef7f0;--badge-ok-line: #cfe5d6;--badge-warn-bg: #fbf3dd;--badge-warn-line: #ecd9ae;--badge-err-bg: #fbeeec;--badge-err-line: #e8c4bd;--readmit: #059669;--tip-bg: #1c2733;--tip-ink: #ffffff;--accent-deep: #0a4cb4;--kind-put-ink: #7fb5f5;--kind-call-ink: #e8b84a}.hp-pool-section{display:flex;flex-direction:column;gap:.3rem;margin-top:.45rem}.hp-pool-list{display:flex;flex-direction:column;gap:.25rem}.hp-pool-item{border:1px solid var(--border);border-radius:7px;padding:.25rem .4rem}.hp-pool-item.active{border-color:var(--accent)}.hp-pool-line{display:flex;flex-wrap:wrap;gap:.3rem .45rem;align-items:center;min-width:0}.hp-pool-name-row{display:flex;gap:.3rem;align-items:center;min-width:0;flex:1 1 100%}.hp-pool-name{font:inherit;font-size:.72rem;font-weight:700;color:var(--ink);background:transparent;border:none;padding:0;cursor:pointer;flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hp-pool-item.active .hp-pool-name{color:var(--accent)}.hp-pool-cash{font-size:.66rem;opacity:.7;white-space:nowrap;font-variant-numeric:tabular-nums}.hp-pool-act{font-size:.6rem;padding:.05rem .3rem}.hp-pool-row{display:flex;gap:.3rem;align-items:center}.hp-pool-row input{flex:1;min-width:0;font:inherit;font-size:.7rem;padding:.15rem .35rem;border:1px solid var(--border);border-radius:5px;background:var(--panel);color:var(--ink)}.hp-pool-row .btn{font-size:.66rem;padding:.12rem .45rem}.hp-pool-del{color:var(--err);font-size:.66rem;padding:.05rem .3rem}.hp-pool-tag{font-size:.6rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:transparent;border:1px solid var(--border);border-radius:999px;padding:.06rem .4rem;white-space:nowrap}.hp-pool-pick{font:inherit;font-size:.62rem;font-weight:700;letter-spacing:.03em;color:var(--muted);background:var(--panel);border:1px solid var(--border);border-radius:999px;padding:.06rem .4rem;white-space:nowrap;cursor:pointer}.holdings-add select{font:inherit;padding:5px 6px;border:1px solid var(--border);border-radius:5px;background:var(--panel);color:var(--ink)}
diff --git a/crates/webapp/frontend/dist/assets/app.js b/crates/webapp/frontend/dist/assets/app.js
index 9b5d04b..e8873e6 100644
--- a/crates/webapp/frontend/dist/assets/app.js
+++ b/crates/webapp/frontend/dist/assets/app.js
@@ -1,4 +1,4 @@
-(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const ks=!1,Es=(t,e)=>t===e,Bn=Symbol("solid-proxy"),Is=typeof Proxy=="function",Cs=Symbol("solid-track"),en={equals:Es};let ai=ui;const Le=1,tn=2,oi={owned:null,cleanups:null,context:null,owner:null},wn={};var X=null;let $n=null,Ts=null,J=null,oe=null,xe=null,gn=0;function Gt(t,e){const n=J,r=X,i=t.length===0,s=e===void 0?r:e,a=i?oi:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>pe(()=>Pt(a)));X=a,J=null;try{return Ke(o,!0)}finally{J=n,X=r}}function O(t,e){e=e?Object.assign({},en,e):en;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ci(n,i));return[li.bind(n),r]}function As(t,e,n){const r=pn(t,e,!0,Le);yt(r)}function v(t,e,n){const r=pn(t,e,!1,Le);yt(r)}function et(t,e,n){ai=Ls;const r=pn(t,e,!1,Le);r.user=!0,xe?xe.push(r):yt(r)}function ae(t,e,n){n=n?Object.assign({},en,n):en;const r=pn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,yt(r),li.bind(r)}function Ps(t){return t&&typeof t=="object"&&"then"in t}function Rs(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=wn,l=!1,c="initialValue"in s,d=typeof r=="function"&&ae(r);const h=new Set,[g,m]=(s.storage||O)(s.initialValue),[b,I]=O(void 0),[_,w]=O(void 0,{equals:!1}),[S,C]=O(c?"ready":"unresolved");X&&Oe(()=>{for(const x of h.keys())x.decrement();h.clear(),a=null});function T(x,$,U,W){return a===x&&(a=null,W!==void 0&&(c=!0),(x===o||$===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(W,{value:$})),o=wn,P($,U)),$}function P(x,$){Ke(()=>{$===void 0&&m(()=>x),C($!==void 0?"errored":c?"ready":"unresolved"),I($);for(const U of h.keys())U.decrement();h.clear()},!1)}function N(){const x=Os,$=g(),U=b();if(U!==void 0&&!a)throw U;return J&&J.user,$}function M(x=!0){if(x!==!1&&l)return;l=!1;const $=d?d():r;if($==null||$===!1){T(a,pe(g));return}let U;const W=o!==wn?o:pe(()=>{try{return i($,{value:g(),refetching:x})}catch(ne){U=ne}});if(U!==void 0){T(a,void 0,qt(U),$);return}else if(!Ps(W))return T(a,W,void 0,$),W;return a=W,"v"in W?(W.s===1?T(a,W.v,void 0,$):T(a,void 0,qt(W.v),$),W):(l=!0,queueMicrotask(()=>l=!1),Ke(()=>{C(c?"refreshing":"pending"),w()},!1),W.then(ne=>T(W,ne,void 0,$),ne=>T(W,void 0,qt(ne),$)))}Object.defineProperties(N,{state:{get:()=>S()},error:{get:()=>b()},loading:{get(){const x=S();return x==="pending"||x==="refreshing"}},latest:{get(){if(!c)return N();const x=b();if(x&&!a)throw x;return g()}}});let R=X;return d?As(()=>(R=X,M(!1))):M(!1),[N,{refetch:x=>xs(R,()=>M(x)),mutate:m}]}function pe(t){if(J===null)return t();const e=J;J=null;try{return t()}finally{J=e}}function Ct(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=pe(()=>e(a,i,s));return i=a,o}}function gt(t){et(()=>pe(t))}function Oe(t){return X===null||(X.cleanups===null?X.cleanups=[t]:X.cleanups.push(t)),t}function xs(t,e){const n=X,r=J;X=t,J=null;try{return Ke(e,!0)}catch(i){Yn(i)}finally{X=n,J=r}}const[Rf,xf]=O(!1);let Os;function li(){if(this.sources&&this.state)if(this.state===Le)yt(this);else{const t=oe;oe=null,Ke(()=>rn(this),!1),oe=t}if(J){const t=this.observers;if(!t||t[t.length-1]!==J){const e=t?t.length:0;J.sources?(J.sources.push(this),J.sourceSlots.push(e)):(J.sources=[this],J.sourceSlots=[e]),t?(t.push(J),this.observerSlots.push(J.sources.length-1)):(this.observers=[J],this.observerSlots=[J.sources.length-1])}}return this.value}function ci(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ke(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=$n&&$n.running;a&&$n.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?oe.push(s):xe.push(s),s.observers&&di(s)),a||(s.state=Le)}if(oe.length>1e6)throw oe=[],new Error},!1)),e}function yt(t){if(!t.fn)return;Pt(t);const e=gn;Ns(t,t.value,e)}function Ns(t,e,n){let r;const i=X,s=J;J=X=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Le,t.owned&&t.owned.forEach(Pt),t.owned=null),t.updatedAt=n+1,Yn(a)}finally{J=s,X=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ci(t,r):t.value=r,t.updatedAt=n)}function pn(t,e,n,r=Le,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:X,context:X?X.context:null,pure:n};return X===null||X!==oi&&(X.owned?X.owned.push(s):X.owned=[s]),s}function nn(t){if(t.state===0)return;if(t.state===tn)return rn(t);if(t.suspense&&pe(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<gn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Le)yt(t);else if(t.state===tn){const r=oe;oe=null,Ke(()=>rn(t,e[0]),!1),oe=r}}function Ke(t,e){if(oe)return t();let n=!1;e||(oe=[]),xe?n=!0:xe=[],gn++;try{const r=t();return Ds(n),r}catch(r){n||(xe=null),oe=null,Yn(r)}}function Ds(t){if(oe&&(ui(oe),oe=null),t)return;const e=xe;xe=null,e.length&&Ke(()=>ai(e),!1)}function ui(t){for(let e=0;e<t.length;e++)nn(t[e])}function Ls(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:nn(r)}for(e=0;e<n;e++)nn(t[e])}function rn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Le?r!==e&&(!r.updatedAt||r.updatedAt<gn)&&nn(r):i===tn&&rn(r,e)}}}function di(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=tn,n.pure?oe.push(n):xe.push(n),n.observers&&di(n))}}function Pt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Pt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Pt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function qt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Yn(t,e=X){throw qt(t)}const Ms=Symbol("fallback");function fr(t){for(let e=0;e<t.length;e++)t[e]()}function Us(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Oe(()=>fr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Cs],pe(()=>{let m,b,I,_,w,S,C,T,P;if(c===0)a!==0&&(fr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ms],i[0]=Gt(N=>(s[0]=N,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Gt(g);a=c}else{for(I=new Array(c),_=new Array(c),o&&(w=new Array(c)),S=0,C=Math.min(a,c);S<C&&r[S]===l[S];S++);for(C=a-1,T=c-1;C>=S&&T>=S&&r[C]===l[T];C--,T--)I[T]=i[C],_[T]=s[C],o&&(w[T]=o[C]);for(m=new Map,b=new Array(T+1),h=T;h>=S;h--)P=l[h],d=m.get(P),b[h]=d===void 0?-1:d,m.set(P,h);for(d=S;d<=C;d++)P=r[d],h=m.get(P),h!==void 0&&h!==-1?(I[h]=i[d],_[h]=s[d],o&&(w[h]=o[d]),h=b[h],m.set(P,h)):s[d]();for(h=S;h<c;h++)h in I?(i[h]=I[h],s[h]=_[h],o&&(o[h]=w[h],o[h](h))):i[h]=Gt(g);i=i.slice(0,a=c),r=l.slice(0)}return i});function g(m){if(s[h]=m,o){const[b,I]=O(h);return o[h]=I,e(l[h],b)}return e(l[h])}}}function f(t,e){return pe(()=>t(e||{}))}function Wt(){return!0}const Fs={get(t,e,n){return e===Bn?n:t.get(e)},has(t,e){return e===Bn?!0:t.has(e)},set:Wt,deleteProperty:Wt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Wt,deleteProperty:Wt}},ownKeys(t){return t.keys()}};function Sn(t){return(t=typeof t=="function"?t():t)?t:{}}function Bs(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Hs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Bn in o,t[a]=typeof o=="function"?(e=!0,ae(o)):o}if(Is&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=Sn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in Sn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(Sn(t[o])));return[...new Set(a)]}},Fs);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Bs.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Vs=t=>`Stale read from <${t}>.`;function ie(t){const e="fallback"in t&&{fallback:()=>t.fallback};return ae(Us(()=>t.each,t.children,e||void 0))}function E(t){const e=t.keyed,n=ae(()=>t.when,void 0,void 0),r=e?n:ae(n,void 0,{equals:(i,s)=>!i==!s});return ae(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?pe(()=>s(e?i:()=>{if(!pe(r))throw Vs("Show");return n()})):s}return t.fallback},void 0,void 0)}const Y=t=>ae(()=>t());function Ws(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const gr="_$DX_DELEGATE";function js(t,e,n,r={}){let i;return Gt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>pe(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ve(t,e=window.document){const n=e[gr]||(e[gr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Gs))}}function ee(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ue(t,e){e==null?t.removeAttribute("class"):t.className=e}function j(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function tt(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function zs(t,e,n){return pe(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return sn(t,e,r,n);v(i=>sn(t,e(),i,n),r)}function Gs(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function sn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ot(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ot(t,n,r);else{if(s==="function")return v(()=>{let o=e();for(;typeof o=="function";)o=o();n=sn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Hn(o,e,n,i))return v(()=>n=sn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ot(t,n,r),a)return n}else l?n.length===0?pr(t,o,r):Ws(t,n,o):(n&&ot(t),pr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ot(t,n,r,e);ot(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Hn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Hn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Hn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function pr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ot(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Kt=null;function qs(t){Kt=t}async function de(t,e={}){if(!Kt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Kt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Kt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function hi(){const t=await de("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Ks(){return de("/api/me")}async function Js(){const t=await de("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Ys(t){const e=await de("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Xs(t){const e=await de("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Qs(){return await de("/api/run",{method:"POST"})}async function Zs(){return de("/api/progress")}async function ea(){const t=await de("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function kn(t){const e=await de("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function En(t){const e=await de(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function ta(t,e){const n=await de(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function na(){const t=await de("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function mr(t){const e=await de("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function ra(t){const e=await de("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const ia=()=>{};var _r={};/**
+(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const ks=!1,Es=(t,e)=>t===e,Bn=Symbol("solid-proxy"),Is=typeof Proxy=="function",Cs=Symbol("solid-track"),en={equals:Es};let ai=ui;const Le=1,tn=2,oi={owned:null,cleanups:null,context:null,owner:null},wn={};var X=null;let $n=null,Ts=null,J=null,oe=null,xe=null,gn=0;function Gt(t,e){const n=J,r=X,i=t.length===0,s=e===void 0?r:e,a=i?oi:{owned:null,cleanups:null,context:s?s.context:null,owner:s},o=i?t:()=>t(()=>pe(()=>Pt(a)));X=a,J=null;try{return Ke(o,!0)}finally{J=n,X=r}}function O(t,e){e=e?Object.assign({},en,e):en;const n={value:t,observers:null,observerSlots:null,comparator:e.equals||void 0},r=i=>(typeof i=="function"&&(i=i(n.value)),ci(n,i));return[li.bind(n),r]}function As(t,e,n){const r=pn(t,e,!0,Le);yt(r)}function v(t,e,n){const r=pn(t,e,!1,Le);yt(r)}function et(t,e,n){ai=Ls;const r=pn(t,e,!1,Le);r.user=!0,xe?xe.push(r):yt(r)}function ae(t,e,n){n=n?Object.assign({},en,n):en;const r=pn(t,e,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,yt(r),li.bind(r)}function Ps(t){return t&&typeof t=="object"&&"then"in t}function Rs(t,e,n){let r,i,s;typeof e=="function"?(r=t,i=e,s={}):(r=!0,i=t,s=e||{});let a=null,o=wn,l=!1,c="initialValue"in s,d=typeof r=="function"&&ae(r);const h=new Set,[g,m]=(s.storage||O)(s.initialValue),[b,I]=O(void 0),[_,w]=O(void 0,{equals:!1}),[S,C]=O(c?"ready":"unresolved");X&&Oe(()=>{for(const x of h.keys())x.decrement();h.clear(),a=null});function T(x,$,U,W){return a===x&&(a=null,W!==void 0&&(c=!0),(x===o||$===o)&&s.onHydrated&&queueMicrotask(()=>s.onHydrated(W,{value:$})),o=wn,P($,U)),$}function P(x,$){Ke(()=>{$===void 0&&m(()=>x),C($!==void 0?"errored":c?"ready":"unresolved"),I($);for(const U of h.keys())U.decrement();h.clear()},!1)}function N(){const x=Os,$=g(),U=b();if(U!==void 0&&!a)throw U;return J&&J.user,$}function M(x=!0){if(x!==!1&&l)return;l=!1;const $=d?d():r;if($==null||$===!1){T(a,pe(g));return}let U;const W=o!==wn?o:pe(()=>{try{return i($,{value:g(),refetching:x})}catch(ne){U=ne}});if(U!==void 0){T(a,void 0,qt(U),$);return}else if(!Ps(W))return T(a,W,void 0,$),W;return a=W,"v"in W?(W.s===1?T(a,W.v,void 0,$):T(a,void 0,qt(W.v),$),W):(l=!0,queueMicrotask(()=>l=!1),Ke(()=>{C(c?"refreshing":"pending"),w()},!1),W.then(ne=>T(W,ne,void 0,$),ne=>T(W,void 0,qt(ne),$)))}Object.defineProperties(N,{state:{get:()=>S()},error:{get:()=>b()},loading:{get(){const x=S();return x==="pending"||x==="refreshing"}},latest:{get(){if(!c)return N();const x=b();if(x&&!a)throw x;return g()}}});let R=X;return d?As(()=>(R=X,M(!1))):M(!1),[N,{refetch:x=>xs(R,()=>M(x)),mutate:m}]}function pe(t){if(J===null)return t();const e=J;J=null;try{return t()}finally{J=e}}function Ct(t,e,n){const r=Array.isArray(t);let i;return s=>{let a;if(r){a=Array(t.length);for(let l=0;l<t.length;l++)a[l]=t[l]()}else a=t();const o=pe(()=>e(a,i,s));return i=a,o}}function gt(t){et(()=>pe(t))}function Oe(t){return X===null||(X.cleanups===null?X.cleanups=[t]:X.cleanups.push(t)),t}function xs(t,e){const n=X,r=J;X=t,J=null;try{return Ke(e,!0)}catch(i){Yn(i)}finally{X=n,J=r}}const[Of,Nf]=O(!1);let Os;function li(){if(this.sources&&this.state)if(this.state===Le)yt(this);else{const t=oe;oe=null,Ke(()=>rn(this),!1),oe=t}if(J){const t=this.observers;if(!t||t[t.length-1]!==J){const e=t?t.length:0;J.sources?(J.sources.push(this),J.sourceSlots.push(e)):(J.sources=[this],J.sourceSlots=[e]),t?(t.push(J),this.observerSlots.push(J.sources.length-1)):(this.observers=[J],this.observerSlots=[J.sources.length-1])}}return this.value}function ci(t,e,n){let r=t.value;return(!t.comparator||!t.comparator(r,e))&&(t.value=e,t.observers&&t.observers.length&&Ke(()=>{for(let i=0;i<t.observers.length;i+=1){const s=t.observers[i],a=$n&&$n.running;a&&$n.disposed.has(s),(a?!s.tState:!s.state)&&(s.pure?oe.push(s):xe.push(s),s.observers&&di(s)),a||(s.state=Le)}if(oe.length>1e6)throw oe=[],new Error},!1)),e}function yt(t){if(!t.fn)return;Pt(t);const e=gn;Ns(t,t.value,e)}function Ns(t,e,n){let r;const i=X,s=J;J=X=t;try{r=t.fn(e)}catch(a){return t.pure&&(t.state=Le,t.owned&&t.owned.forEach(Pt),t.owned=null),t.updatedAt=n+1,Yn(a)}finally{J=s,X=i}(!t.updatedAt||t.updatedAt<=n)&&(t.updatedAt!=null&&"observers"in t?ci(t,r):t.value=r,t.updatedAt=n)}function pn(t,e,n,r=Le,i){const s={fn:t,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:e,owner:X,context:X?X.context:null,pure:n};return X===null||X!==oi&&(X.owned?X.owned.push(s):X.owned=[s]),s}function nn(t){if(t.state===0)return;if(t.state===tn)return rn(t);if(t.suspense&&pe(t.suspense.inFallback))return t.suspense.effects.push(t);const e=[t];for(;(t=t.owner)&&(!t.updatedAt||t.updatedAt<gn);)t.state&&e.push(t);for(let n=e.length-1;n>=0;n--)if(t=e[n],t.state===Le)yt(t);else if(t.state===tn){const r=oe;oe=null,Ke(()=>rn(t,e[0]),!1),oe=r}}function Ke(t,e){if(oe)return t();let n=!1;e||(oe=[]),xe?n=!0:xe=[],gn++;try{const r=t();return Ds(n),r}catch(r){n||(xe=null),oe=null,Yn(r)}}function Ds(t){if(oe&&(ui(oe),oe=null),t)return;const e=xe;xe=null,e.length&&Ke(()=>ai(e),!1)}function ui(t){for(let e=0;e<t.length;e++)nn(t[e])}function Ls(t){let e,n=0;for(e=0;e<t.length;e++){const r=t[e];r.user?t[n++]=r:nn(r)}for(e=0;e<n;e++)nn(t[e])}function rn(t,e){t.state=0;for(let n=0;n<t.sources.length;n+=1){const r=t.sources[n];if(r.sources){const i=r.state;i===Le?r!==e&&(!r.updatedAt||r.updatedAt<gn)&&nn(r):i===tn&&rn(r,e)}}}function di(t){for(let e=0;e<t.observers.length;e+=1){const n=t.observers[e];n.state||(n.state=tn,n.pure?oe.push(n):xe.push(n),n.observers&&di(n))}}function Pt(t){let e;if(t.sources)for(;t.sources.length;){const n=t.sources.pop(),r=t.sourceSlots.pop(),i=n.observers;if(i&&i.length){const s=i.pop(),a=n.observerSlots.pop();r<i.length&&(s.sourceSlots[a]=r,i[r]=s,n.observerSlots[r]=a)}}if(t.tOwned){for(e=t.tOwned.length-1;e>=0;e--)Pt(t.tOwned[e]);delete t.tOwned}if(t.owned){for(e=t.owned.length-1;e>=0;e--)Pt(t.owned[e]);t.owned=null}if(t.cleanups){for(e=t.cleanups.length-1;e>=0;e--)t.cleanups[e]();t.cleanups=null}t.state=0}function qt(t){return t instanceof Error?t:new Error(typeof t=="string"?t:"Unknown error",{cause:t})}function Yn(t,e=X){throw qt(t)}const Ms=Symbol("fallback");function fr(t){for(let e=0;e<t.length;e++)t[e]()}function Us(t,e,n={}){let r=[],i=[],s=[],a=0,o=e.length>1?[]:null;return Oe(()=>fr(s)),()=>{let l=t()||[],c=l.length,d,h;return l[Cs],pe(()=>{let m,b,I,_,w,S,C,T,P;if(c===0)a!==0&&(fr(s),s=[],r=[],i=[],a=0,o&&(o=[])),n.fallback&&(r=[Ms],i[0]=Gt(N=>(s[0]=N,n.fallback())),a=1);else if(a===0){for(i=new Array(c),h=0;h<c;h++)r[h]=l[h],i[h]=Gt(g);a=c}else{for(I=new Array(c),_=new Array(c),o&&(w=new Array(c)),S=0,C=Math.min(a,c);S<C&&r[S]===l[S];S++);for(C=a-1,T=c-1;C>=S&&T>=S&&r[C]===l[T];C--,T--)I[T]=i[C],_[T]=s[C],o&&(w[T]=o[C]);for(m=new Map,b=new Array(T+1),h=T;h>=S;h--)P=l[h],d=m.get(P),b[h]=d===void 0?-1:d,m.set(P,h);for(d=S;d<=C;d++)P=r[d],h=m.get(P),h!==void 0&&h!==-1?(I[h]=i[d],_[h]=s[d],o&&(w[h]=o[d]),h=b[h],m.set(P,h)):s[d]();for(h=S;h<c;h++)h in I?(i[h]=I[h],s[h]=_[h],o&&(o[h]=w[h],o[h](h))):i[h]=Gt(g);i=i.slice(0,a=c),r=l.slice(0)}return i});function g(m){if(s[h]=m,o){const[b,I]=O(h);return o[h]=I,e(l[h],b)}return e(l[h])}}}function f(t,e){return pe(()=>t(e||{}))}function Wt(){return!0}const Fs={get(t,e,n){return e===Bn?n:t.get(e)},has(t,e){return e===Bn?!0:t.has(e)},set:Wt,deleteProperty:Wt,getOwnPropertyDescriptor(t,e){return{configurable:!0,enumerable:!0,get(){return t.get(e)},set:Wt,deleteProperty:Wt}},ownKeys(t){return t.keys()}};function Sn(t){return(t=typeof t=="function"?t():t)?t:{}}function Bs(){for(let t=0,e=this.length;t<e;++t){const n=this[t]();if(n!==void 0)return n}}function Hs(...t){let e=!1;for(let a=0;a<t.length;a++){const o=t[a];e=e||!!o&&Bn in o,t[a]=typeof o=="function"?(e=!0,ae(o)):o}if(Is&&e)return new Proxy({get(a){for(let o=t.length-1;o>=0;o--){const l=Sn(t[o])[a];if(l!==void 0)return l}},has(a){for(let o=t.length-1;o>=0;o--)if(a in Sn(t[o]))return!0;return!1},keys(){const a=[];for(let o=0;o<t.length;o++)a.push(...Object.keys(Sn(t[o])));return[...new Set(a)]}},Fs);const n={},r=Object.create(null);for(let a=t.length-1;a>=0;a--){const o=t[a];if(!o)continue;const l=Object.getOwnPropertyNames(o);for(let c=l.length-1;c>=0;c--){const d=l[c];if(d==="__proto__"||d==="constructor")continue;const h=Object.getOwnPropertyDescriptor(o,d);if(!r[d])r[d]=h.get?{enumerable:!0,configurable:!0,get:Bs.bind(n[d]=[h.get.bind(o)])}:h.value!==void 0?h:void 0;else{const g=n[d];g&&(h.get?g.push(h.get.bind(o)):h.value!==void 0&&g.push(()=>h.value))}}}const i={},s=Object.keys(r);for(let a=s.length-1;a>=0;a--){const o=s[a],l=r[o];l&&l.get?Object.defineProperty(i,o,l):i[o]=l?l.value:void 0}return i}const Vs=t=>`Stale read from <${t}>.`;function ie(t){const e="fallback"in t&&{fallback:()=>t.fallback};return ae(Us(()=>t.each,t.children,e||void 0))}function E(t){const e=t.keyed,n=ae(()=>t.when,void 0,void 0),r=e?n:ae(n,void 0,{equals:(i,s)=>!i==!s});return ae(()=>{const i=r();if(i){const s=t.children;return typeof s=="function"&&s.length>0?pe(()=>s(e?i:()=>{if(!pe(r))throw Vs("Show");return n()})):s}return t.fallback},void 0,void 0)}const Y=t=>ae(()=>t());function Ws(t,e,n){let r=n.length,i=e.length,s=r,a=0,o=0,l=e[i-1].nextSibling,c=null;for(;a<i||o<s;){if(e[a]===n[o]){a++,o++;continue}for(;e[i-1]===n[s-1];)i--,s--;if(i===a){const d=s<r?o?n[o-1].nextSibling:n[s-o]:l;for(;o<s;)t.insertBefore(n[o++],d)}else if(s===o)for(;a<i;)(!c||!c.has(e[a]))&&e[a].remove(),a++;else if(e[a]===n[s-1]&&n[o]===e[i-1]){const d=e[--i].nextSibling;t.insertBefore(n[o++],e[a++].nextSibling),t.insertBefore(n[--s],d),e[i]=n[s]}else{if(!c){c=new Map;let h=o;for(;h<s;)c.set(n[h],h++)}const d=c.get(e[a]);if(d!=null)if(o<d&&d<s){let h=a,g=1,m;for(;++h<i&&h<s&&!((m=c.get(e[h]))==null||m!==d+g);)g++;if(g>d-o){const b=e[a];for(;o<d;)t.insertBefore(n[o++],b)}else t.replaceChild(n[o++],e[a++])}else a++;else e[a++].remove()}}}const gr="_$DX_DELEGATE";function js(t,e,n,r={}){let i;return Gt(s=>{i=s,e===document?t():u(e,t(),e.firstChild?null:void 0,n)},r.owner),()=>{i(),e.textContent=""}}function p(t,e,n,r){let i;const s=()=>{const o=r?document.createElementNS("http://www.w3.org/1998/Math/MathML","template"):document.createElement("template");return o.innerHTML=t,n?o.content.firstChild.firstChild:r?o.firstChild:o.content.firstChild},a=e?()=>pe(()=>document.importNode(i||(i=s()),!0)):()=>(i||(i=s())).cloneNode(!0);return a.cloneNode=a,a}function ve(t,e=window.document){const n=e[gr]||(e[gr]=new Set);for(let r=0,i=t.length;r<i;r++){const s=t[r];n.has(s)||(n.add(s),e.addEventListener(s,Gs))}}function ee(t,e,n){n==null?t.removeAttribute(e):t.setAttribute(e,n)}function ue(t,e){e==null?t.removeAttribute("class"):t.className=e}function j(t,e,n,r){Array.isArray(n)?(t[`$$${e}`]=n[0],t[`$$${e}Data`]=n[1]):t[`$$${e}`]=n}function tt(t,e,n){n!=null?t.style.setProperty(e,n):t.style.removeProperty(e)}function zs(t,e,n){return pe(()=>t(e,n))}function u(t,e,n,r){if(n!==void 0&&!r&&(r=[]),typeof e!="function")return sn(t,e,r,n);v(i=>sn(t,e(),i,n),r)}function Gs(t){let e=t.target;const n=`$$${t.type}`,r=t.target,i=t.currentTarget,s=l=>Object.defineProperty(t,"target",{configurable:!0,value:l}),a=()=>{const l=e[n];if(l&&!e.disabled){const c=e[`${n}Data`];if(c!==void 0?l.call(e,c,t):l.call(e,t),t.cancelBubble)return}return e.host&&typeof e.host!="string"&&!e.host._$host&&e.contains(t.target)&&s(e.host),!0},o=()=>{for(;a()&&(e=e._$host||e.parentNode||e.host););};if(Object.defineProperty(t,"currentTarget",{configurable:!0,get(){return e||document}}),t.composedPath){const l=t.composedPath();s(l[0]);for(let c=0;c<l.length-2&&(e=l[c],!!a());c++){if(e._$host){e=e._$host,o();break}if(e.parentNode===i)break}}else o();s(r)}function sn(t,e,n,r,i){for(;typeof n=="function";)n=n();if(e===n)return n;const s=typeof e,a=r!==void 0;if(t=a&&n[0]&&n[0].parentNode||t,s==="string"||s==="number"){if(s==="number"&&(e=e.toString(),e===n))return n;if(a){let o=n[0];o&&o.nodeType===3?o.data!==e&&(o.data=e):o=document.createTextNode(e),n=ot(t,n,r,o)}else n!==""&&typeof n=="string"?n=t.firstChild.data=e:n=t.textContent=e}else if(e==null||s==="boolean")n=ot(t,n,r);else{if(s==="function")return v(()=>{let o=e();for(;typeof o=="function";)o=o();n=sn(t,o,n,r)}),()=>n;if(Array.isArray(e)){const o=[],l=n&&Array.isArray(n);if(Hn(o,e,n,i))return v(()=>n=sn(t,o,n,r,!0)),()=>n;if(o.length===0){if(n=ot(t,n,r),a)return n}else l?n.length===0?pr(t,o,r):Ws(t,n,o):(n&&ot(t),pr(t,o));n=o}else if(e.nodeType){if(Array.isArray(n)){if(a)return n=ot(t,n,r,e);ot(t,n,null,e)}else n==null||n===""||!t.firstChild?t.appendChild(e):t.replaceChild(e,t.firstChild);n=e}}return n}function Hn(t,e,n,r){let i=!1;for(let s=0,a=e.length;s<a;s++){let o=e[s],l=n&&n[t.length],c;if(!(o==null||o===!0||o===!1))if((c=typeof o)=="object"&&o.nodeType)t.push(o);else if(Array.isArray(o))i=Hn(t,o,l)||i;else if(c==="function")if(r){for(;typeof o=="function";)o=o();i=Hn(t,Array.isArray(o)?o:[o],Array.isArray(l)?l:[l])||i}else t.push(o),i=!0;else{const d=String(o);l&&l.nodeType===3&&l.data===d?t.push(l):t.push(document.createTextNode(d))}}return i}function pr(t,e,n=null){for(let r=0,i=e.length;r<i;r++)t.insertBefore(e[r],n)}function ot(t,e,n,r){if(n===void 0)return t.textContent="";const i=r||document.createTextNode("");if(e.length){let s=!1;for(let a=e.length-1;a>=0;a--){const o=e[a];if(i!==o){const l=o.parentNode===t;!s&&!a?l?t.replaceChild(i,o):t.insertBefore(i,n):l&&o.remove()}else s=!0}}else t.insertBefore(i,n);return[i]}let Kt=null;function qs(t){Kt=t}async function de(t,e={}){if(!Kt)return fetch(t,e);const n=new Headers(e.headers??{}),r=await Kt(!1);r&&n.set("Authorization",`Bearer ${r}`);let i=await fetch(t,{...e,headers:n});if(i.status===401){const s=await Kt(!0);s&&s!==r&&(n.set("Authorization",`Bearer ${s}`),i=await fetch(t,{...e,headers:n}))}return i}async function hi(){const t=await de("/api/latest");if(!t.ok)throw new Error(`GET /api/latest -> ${t.status}`);return t.json()}async function Ks(){return de("/api/me")}async function Js(){const t=await de("/api/grants");if(!t.ok)throw new Error(`GET /api/grants -> ${t.status}`);return t.json()}async function Ys(t){const e=await de("/api/grants/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/add -> ${e.status}`);return n}async function Xs(t){const e=await de("/api/grants/remove",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/grants/remove -> ${e.status}`);return n}async function Qs(){return await de("/api/run",{method:"POST"})}async function Zs(){return de("/api/progress")}async function ea(){const t=await de("/api/holdings");if(!t.ok)throw new Error(`GET /api/holdings -> ${t.status}`);const e=await t.json().catch(()=>null);if(e===null)throw new Error("GET /api/holdings returned non-JSON — the backend predates the holdings routes (rebuild/restart it)");return e}async function kn(t){const e=await de("/api/holdings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings -> ${e.status}`);return n}async function En(t){const e=await de(`/api/holdings/${encodeURIComponent(t)}`,{method:"DELETE"}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`DELETE /api/holdings/${t} -> ${e.status}`);return n}async function ta(t,e){const n=await de(`/api/holdings/${encodeURIComponent(t)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({pool_id:e})}),r=await n.json().catch(()=>null);if(!n.ok)throw new Error((r==null?void 0:r.error)??`PATCH /api/holdings/${t} -> ${n.status}`);return r}async function na(){const t=await de("/api/holdings/refresh",{method:"POST"}),e=await t.json().catch(()=>null);if(!t.ok)throw new Error((e==null?void 0:e.error)??`POST /api/holdings/refresh -> ${t.status}`);return e}async function mr(t){const e=await de("/api/holdings/cash",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`PATCH /api/holdings/cash -> ${e.status}`);return n}async function ra(t){const e=await de("/api/holdings/called-away",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({call_id:t})}),n=await e.json().catch(()=>null);if(!e.ok)throw new Error((n==null?void 0:n.error)??`POST /api/holdings/called-away -> ${e.status}`);return n}const ia=()=>{};var _r={};/**
  * @license
  * Copyright 2017 Google LLC
  *
@@ -1528,5 +1528,5 @@
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
- */const Kc=300,Jc=bi("authIdTokenMaxAge")||Kc;let Gr=null;const Yc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Jc)return;const i=n==null?void 0:n.token;Gr!==i&&(Gr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Xc(t=Io()){const e=Si(t,"auth");if(e.isInitialized())return e.getImmediate();const n=bl(t,{popupRedirectResolver:jc,persistence:[ec,Vl,es]}),r=bi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Yc(s.toString());Ml(n,a,()=>a(n.currentUser)),Ll(n,o=>a(o))}}const i=ha("auth");return i&&vl(n,`http://${i}`),n}function Qc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}dl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ye("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Qc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});qc("Browser");const Zc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},Ee=Zc,_t=!!Ee.VITE_FIREBASE_APP_ID;let On=null;function lt(){if(!_t)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!On){const t=ki({apiKey:Ee.VITE_FIREBASE_API_KEY,authDomain:Ee.VITE_FIREBASE_AUTH_DOMAIN,projectId:Ee.VITE_FIREBASE_PROJECT_ID,appId:Ee.VITE_FIREBASE_APP_ID,...Ee.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:Ee.VITE_FIREBASE_STORAGE_BUCKET},...Ee.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:Ee.VITE_FIREBASE_MESSAGING_SENDER_ID}});On=Xc(t)}return On}function qr(){return new Ie}async function Kr(){if(!_t)return;const t=lt();t.currentUser&&await Fl(t)}var eu=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),tu=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),nu=p("<button type=button class=gate-toggle>"),ru=p("<div class=gate-or>── or ──"),iu=p("<button type=button class=btn>Continue with Google"),su=p("<div class=gate-error role=alert>"),au=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),ou=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),lu=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const cu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Jr(t){const e=(t==null?void 0:t.code)??"";return cu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function uu(t){return(()=>{var e=eu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),j(l,"click",t.onSignOut),e})()}function du(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");qs(async g=>{if(!_t)return null;const m=lt().currentUser;return m?await m.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),c("");try{const m=lt();t()==="create"?await Nl(m,n(),i()):await Dl(m,n(),i())}catch(m){c(Jr(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await sc(lt(),qr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await dc(lt(),qr());return}c(Jr(g))}finally{o(!1)}}}return(()=>{var g=au(),m=g.firstChild;return m.firstChild,u(m,f(E,{when:_t,get fallback(){return[ou(),lu()]},get children(){return[(()=>{var b=tu(),I=b.firstChild,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.firstChild,T=C.nextSibling,P=S.nextSibling;return b.addEventListener("submit",d),w.$$input=N=>r(N.currentTarget.value),T.$$input=N=>s(N.currentTarget.value),u(P,(()=>{var N=Y(()=>!!a());return()=>N()?"Working…":t()==="create"?"Create account":"Sign in"})()),v(N=>{var M=t()==="create"?"new-password":"current-password",R=a();return M!==N.e&&ee(T,"autocomplete",N.e=M),R!==N.t&&(P.disabled=N.t=R),N},{e:void 0,t:void 0}),v(()=>w.value=n()),v(()=>T.value=i()),b})(),(()=>{var b=nu();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),v(()=>b.disabled=a()),b})(),ru(),(()=>{var b=iu();return b.$$click=h,v(()=>b.disabled=a()),b})(),f(E,{get when(){return l()},get children(){var b=su();return u(b,l),b}})]}}),null),g})()}ve(["click","input"]);var hu=p("<div class=gate-error role=alert>"),fu=p("<p class=gate-note>No grant-file entries yet."),gu=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),pu=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),mu=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function _u(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};gt(async()=>{try{h(await Js())}catch{d("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};gt(()=>{window.addEventListener("keydown",m),Oe(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Ys(s())),a("")}catch(w){d(w.message)}l(!1)}},I=async _=>{if(!o()){l(!0),d("");try{h(await Xs(_))}catch(w){d(w.message)}l(!1)}};return(()=>{var _=pu(),w=_.firstChild,S=w.firstChild,C=S.nextSibling,T=C.nextSibling,P=T.firstChild,N=P.nextSibling,M=T.nextSibling;return j(_,"click",t.onClose),w.$$click=R=>R.stopPropagation(),u(w,f(E,{get when(){return c()},get children(){var R=hu();return u(R,c),R}}),T),u(w,f(ie,{get each(){return e()},children:R=>(()=>{var x=mu(),$=x.firstChild,U=$.nextSibling;return u($,R),U.$$click=()=>I(R),ee(U,"title",`Remove ${R}`),ee(U,"aria-label",`Remove ${R}`),v(()=>U.disabled=o()),x})()}),T),u(w,f(E,{get when(){return e().length===0},get children(){return fu()}}),T),T.addEventListener("submit",b),P.$$input=R=>a(R.currentTarget.value),u(N,()=>o()?"…":"Add"),u(w,f(E,{get when(){return r().length>0},get children(){var R=gu();return R.firstChild,u(R,()=>r().join(", "),null),R}}),M),j(M,"click",t.onClose),v(()=>N.disabled=o()),v(()=>P.value=s()),_})()}ve(["click","input"]);const Pe=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),At=(t,e,n)=>Math.min(n,Math.max(e,t));function bu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:At((n-t)/r,0,1)}function yu(t,e,n,r,i=Pe){if(n<i.minRateOfReturn||t<=0)return null;const s=At(t/2,0,1),a=At(e,0,1),o=Math.min(n/i.idealReturn,1),l=At((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function vu(t,e=Pe){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?At(1+t.delta,0,1):bu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),yu(r,a,n,i,e)}function wu(t,e=Pe.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function $u(t){return t.weightSharpe===Pe.weightSharpe&&t.weightSafety===Pe.weightSafety&&t.weightReturn===Pe.weightReturn&&t.minRateOfReturn===Pe.minRateOfReturn}var Su=p("<span class=hint>production defaults · drag to re-rank live"),ku=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Eu=p('<span class="hint hint-custom">custom weights'),Iu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Cu(){const[t,e]=O({...Pe});return{params:t,isCustom:()=>!$u(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Pe})}}const Tu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Au(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=ku(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(E,{get when(){return!e()},get fallback(){return Eu()},get children(){return Su()}}),null),u(s,f(ie,{each:Tu,children:o=>(()=>{var l=Iu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,g=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(E,{get when(){return o.weight},get children(){return[" ","· ",Y(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),v(m=>{var b=o.max,I=o.step;return b!==m.e&&ee(g,"max",m.e=b),I!==m.t&&ee(g,"step",m.t=I),m},{e:void 0,t:void 0}),v(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),v(()=>r.open=e()),r})()}ve(["click","input"]);const vn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Et=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],us="webapp.columns.v1";function Pu(){try{const t=localStorage.getItem(us);if(!t)return Et;const e=JSON.parse(t);if(!Array.isArray(e))return Et;const n=new Set(vn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Et}catch{return Et}}function Ru(t){try{localStorage.setItem(us,JSON.stringify(t))}catch{}}var xu=p("<div class=pop-backdrop>"),Ou=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Nu=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Du=p("<label class=pick-item><input type=checkbox>");function Lu(t){const[e,n]=O(!1);return(()=>{var r=Nu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(E,{get when(){return e()},get children(){return[(()=>{var s=xu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Ou(),a=s.firstChild,o=a.nextSibling;return u(a,f(ie,{each:vn,children:l=>(()=>{var c=Du(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),v(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),v(()=>ee(i,"aria-expanded",e())),r})()}ve(["click"]);var Mu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Uu=p("<span class=pggap>…"),Fu=p("<button type=button class=pgbtn>");function Bu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Hu(t){const e=ae(()=>Bu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Mu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ie,{get each(){return e()},children:d=>d==="…"?Uu():(()=>{var h=Fu();return h.$$click=()=>t.onGo(d),u(h,d),v(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,v(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(c.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}ve(["click"]);var Vu=p("<span class=tip>");function wt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Vu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?zs(i,r):e=r,u(r,()=>t.children),v(()=>ee(r,"data-tip",t.text??"")),r})()}ve(["focusin"]);const nt="∅";function Z(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function It(t){return Number(t??0).toLocaleString("en-US")}function fn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function ds(t){return hs(t,{hour:"2-digit",minute:"2-digit"})}function Wu(t){return hs(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function hs(t,e){const n=fn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const fs={text:nt,isNull:!0},Nn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Yr(t,e){return!e||Z(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function ju(t,e){return!e||Z(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function zu(t){if(!t||typeof t!="object"||Z(t.report_date))return fs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ge(t,e){if(Z(e))return fs;switch(t){case"fixed2":return Nn(e,2);case"fixed3":return Nn(e,3);case"ivrv":return Nn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return zu(e);default:return{text:String(e),isNull:!1}}}const Xr=t=>Number(t*100).toFixed(0);function Gu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Xr(e.momentum_high),s=Xr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function $t(t,e){return Gu(e)[t]??t}var gs=p("<span class=tip-target>"),qu=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),Ku=p("<span class=tip-target>Strike position in band"),Ju=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Yu=p("<div class=exp-block><h4>"),Xu=p("<div class=kv-value>Band unavailable (∅)"),Qu=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),Zu=p("<div class=exp-block><h4>Premium economics"),ed=p("<b>"),td=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),nd=p("<div class=muted-note>earnings-discounted safety applied"),rd=p("<div class=exp-block><h4>Score breakdown"),id=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),sd=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ad=p("<span class=muted-note>all columns visible"),od=p('<div class="exp-block exp-chips"><h4>Hidden columns'),ld=p("<span class=tip-target>: "),cd=p("<span>"),ud=p("<span class=tip-target>band safety is already discounted by the earnings rule."),dd=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),hd=p("<div class=expansion><div class=exp-grid>");const Dn={sharpe:.2,safety:.4,return_part:.4};function Ln(t,e=2){return Z(t)?nt:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function we(t,e,n){return(()=>{var r=qu(),i=r.firstChild,s=i.nextSibling;return u(i,f(wt,{get text(){return $t(t,e)},get children(){var a=gs();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function fd(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=Z(e.mid)?null:e.strike-e.mid,s=i!=null&&!Z(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!Z(a)&&l>a&&!Z(e.strike),d=g=>{if(Z(g))return null;const m=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=Yu(),m=g.firstChild;return u(m,f(wt,{get text(){return $t("band_range",t.thresholds)},get children(){return Ku()}})),u(g,f(E,{when:c,get fallback(){return Xu()},get children(){var b=Ju(),I=b.firstChild;return u(b,f(ie,{each:h,children:_=>(()=>{var w=Qu(),S=w.firstChild,C=S.nextSibling,T=C.firstChild;return u(C,()=>_.label,T),u(C,()=>ge("fixed2",_.v).text,null),v(P=>{var N=`marker ${_.cls}`,M=`${d(_.v)}%`;return N!==P.e&&ue(w,P.e=N),M!==P.t&&tt(w,"left",P.t=M),P},{e:void 0,t:void 0}),w})()}),null),v(_=>{var w=`${d(e.strike_from)}%`,S=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return w!==_.e&&tt(I,"left",_.e=w),S!==_.t&&tt(I,"width",_.t=S),_},{e:void 0,t:void 0}),b}}),null),u(g,()=>we("band_range",t.thresholds,`${ge("fixed2",e.strike_from).text} → ${ge("fixed2",e.strike_to).text}`),null),u(g,()=>we("band_depth",t.thresholds,r==null?nt:`${(r*100).toFixed(1)}%`),null),u(g,()=>we("cushion_be",t.thresholds,s==null?nt:`${s.toFixed(1)}%`),null),g})()}function gd(t){const e=t.row,n=Z(e.strike)?null:e.strike*100,r=Z(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ge("pct1",e.rate_of_return);return(()=>{var a=Zu();return a.firstChild,u(a,()=>we("capital",t.thresholds,n==null?nt:Ln(n,0)),null),u(a,()=>we("premium",t.thresholds,r==null?nt:Ln(r)),null),u(a,()=>we("breakeven",t.thresholds,i==null?nt:Ln(i)),null),u(a,()=>we("ann_ror",t.thresholds,(()=>{var o=ed();return u(o,()=>s.text),o})()),null),u(a,()=>we("bid",t.thresholds,ge("fixed2",e.bid).text),null),u(a,()=>we("ask",t.thresholds,ge("fixed2",e.ask).text),null),u(a,()=>we("expiration",t.thresholds,e.expiration),null),a})()}function pd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Dn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Dn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Dn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=rd();return i.firstChild,u(i,f(E,{when:n,get fallback(){return(()=>{var s=id(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ge("fixed3",e.score).text),s})()},get children(){return[f(ie,{each:r,children:s=>{const a=Z(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=sd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=l.nextSibling,b=m.firstChild,I=m.nextSibling;return u(l,f(wt,{get text(){return $t(s.key,t.thresholds)},get children(){var _=gs();return u(_,()=>s.label),_}}),c),u(d,()=>s.weight*100,g),u(I,()=>ge("fixed3",s.v).text),v(_=>tt(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=td(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ge("fixed3",e.score).text),s})(),f(E,{get when(){return e.earnings_before_expiry},get children(){return nd()}})]}}),null),i})()}function md(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ge(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=od();return n.firstChild,u(n,f(ie,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=cd();return u(s,f(wt,{get text(){return $t(r.id,t.thresholds)},get children(){var a=ld(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),v(()=>ue(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(E,{get when(){return t.hiddenDefs.length===0},get children(){return ad()}}),null),n})()}function _d(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=hd(),i=r.firstChild;return u(r,f(E,{when:n,get children(){var s=dd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(E,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),c),u(s,f(E,{get when(){return!Z(n.expected_eps)},get children(){return[" ","· expected EPS ",Y(()=>ge("fixed2",n.expected_eps).text)]}}),h),u(s,f(wt,{get text(){return $t("earnings_before_expiry",t.thresholds)},get children(){return ud()}}),null),s}}),i),u(i,f(fd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(gd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(pd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(md,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var bd=p("<span class=null-mark>"),yd=p("<span class=star>★"),vd=p("<td><b>"),Mn=p("<span>"),Qr=p("<td class=num>"),wd=p("<span class=score-frozen>prod "),$d=p('<td class="num score-cell">'),Sd=p('<span class="score-frozen readmit">re-admitted'),kd=p("<td>"),Ed=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Id=p("<span class=sort-arrow>"),Cd=p("<span class=tip-target>"),Td=p("<th role=button tabindex=0>"),Ad=p("<tr class=expandable><td class=exp-col>"),Pd=p("<tr class=exp-row><td>");const Rd=t=>`${t.underlying}|${t.strike}`;function xd(t){return(()=>{var e=bd();return u(e,()=>t.text),e})()}function zt(t){const e=ge(t.kind,t.value);return f(E,{get when(){return!e.isNull},get fallback(){return f(xd,{get text(){return e.text}})},get children(){return e.text}})}function Od(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=vd(),i=r.firstChild;return u(r,f(E,{get when(){return t.pickRank!=null},get children(){var s=yd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(E,{get when(){return Yr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Mn();return v(()=>ue(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Qr();return u(r,f(E,{get when(){return Yr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Mn();return v(()=>ue(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=$d();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(E,{get when(){return!Z(n.frozen_score)},get fallback(){return f(E,{get when(){return!Z(n.score)},get children(){return Sd()}})},get children(){var i=wd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Qr();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){return ju(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Mn();return u(s,i),v(()=>ue(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=kd();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}})),v(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Nd(t){const e=ae(()=>vn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Ed(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ie,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Td();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(wt,{get text(){return $t(a.id,t.thresholds)},get children(){var c=Cd();return u(c,()=>a.label,null),u(c,f(E,{get when(){return o()},get children(){return[" ",(()=>{var d=Id();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),v(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&ee(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ie,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Rd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Ad(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ie,{get each(){return e()},children:g=>f(Od,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),v(g=>{var m=o()!=null,b=!!Z(a.score),I=!!c();return m!==g.e&&d.classList.toggle("pick",g.e=m),b!==g.t&&d.classList.toggle("prow",g.t=b),I!==g.a&&d.classList.toggle("open",g.a=I),g},{e:void 0,t:void 0,a:void 0}),d})(),f(E,{get when(){return c()},get children(){var d=Pd(),h=d.firstChild;return u(h,f(_d,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),v(()=>ee(h,"colspan",e().length+1)),d}})]}})),n})()}ve(["click","keydown"]);function Dd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const ct=t=>Z(t);function Ld(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=ct(a),c=ct(o);return l||c?l&&c?0:l?1:-1:r*Dd(a,o)})}function Md(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=ct(r),a=ct(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=ct(l),h=ct(c);return d||h?d&&h?0:d?1:-1:c-l})}var Ud=p("<div class=stage-badges>"),Fd=p("<pre class=errbox>"),Bd=p("<details><summary> "),Hd=p("<div class=scroll-region>"),Vd=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Wd=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),jd=p("<div class=empty-panel>No rows match the current filter."),zd=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Un=100,Gd=150,Zr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function qd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Ud();return u(i,f(ie,{get each(){return t.stages??[]},children:s=>(()=>{var a=Bd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(E,{get when(){return s.error},get children(){var c=Fd();return u(c,()=>s.error),c}}),null),v(()=>ue(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ei(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,g]=O(1);let m;Oe(()=>clearTimeout(m));const b=()=>{var k;return((k=t.tf)==null?void 0:k.rows)??[]},I=ae(()=>{const k=t.scoring.params(),B=t.scoring.isCustom();return b().map(A=>{const V=vu(A,k);return{...A,frozen_score:A.score,live_parts:V,score:B?V==null?null:V.total:A.score}})}),_=ae(()=>I().filter(k=>!Z(k.score)&&Z(k.frozen_score)).length),w=k=>{const B=k.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),g(1)},Gd)},S=k=>{a(k),g(1)},C=k=>{o()!==k?(l(k),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[T,P]=O(null),N=k=>{const B=`${k.underlying}|${k.strike}`;P(A=>A===B?null:B)};et(Ct([o,c,h,r,s],()=>P(null))),et(Ct(t.active,()=>P(null))),et(Ct(t.columns.visible,()=>g(1)));const M=()=>vn.filter(k=>!t.columns.visible().includes(k.id)),R=()=>(t.stages??[]).find(k=>k.name===Zr[t.id].id),x=ae(()=>{const k=r();return k?I().filter(B=>{const A=B.underlying,V=B.sector;return A!=null&&String(A).toLowerCase().includes(k)||V!=null&&String(V).toLowerCase().includes(k)}):I()}),$=ae(()=>{const k=x();return s()?k.filter(B=>!Z(B.score)):k}),U=ae(()=>o()?Ld($(),o(),c()):Md($())),W=ae(()=>Math.max(1,Math.ceil(U().length/Un))),ne=()=>Math.min(h(),W()),te=()=>{const k=ne();return U().slice((k-1)*Un,k*Un)},he=ae(()=>{var B;const k=new Map;if(t.scoring.isCustom()){const A=wu(I().map(V=>({row:V,score:V.score})));for(const V of A)k.set(`${V.row.underlying}|${V.row.strike}`,k.size+1)}else for(const A of((B=t.tf)==null?void 0:B.top_picks)??[])k.set(`${A.underlying}|${A.strike}`,A.rank??"?");return k}),L=k=>he().get(`${k.underlying}|${k.strike}`);return(()=>{var k=Vd(),B=k.firstChild,A=B.firstChild,V=A.nextSibling,K=V.firstChild,z=V.nextSibling,ce=z.firstChild,Fe=ce.nextSibling;return Fe.nextSibling,u(k,f(qd,{get stages(){return t.stages}}),B),A.$$input=w,K.addEventListener("change",se=>S(se.currentTarget.checked)),u(B,f(Lu,{get store(){return t.columns}}),z),u(z,()=>It(U().length),ce),u(z,()=>It(b().length),Fe),u(z,f(E,{get when(){return Y(()=>!!t.scoring.isCustom())()&&_()>0},get children(){return[" ","· ",Y(()=>It(_()))," re-admitted by lower floor"]}}),null),u(k,f(E,{get when(){return te().length>0},get children(){var se=Hd();return u(se,f(Nd,{get visibleCols(){return t.columns.visible},rows:te,sortKey:o,sortDir:c,onSort:C,get thresholds(){return t.thresholds},pickRankOf:L,openKey:T,onToggleRow:N,hiddenDefs:M,get customScores(){return t.scoring.isCustom}})),se}}),null),u(k,f(E,{get when(){return te().length===0},get children(){return f(E,{get when(){var se,ke;return((se=R())==null?void 0:se.status)==="failed"||((ke=R())==null?void 0:ke.status)==="partial"},get fallback(){return f(E,{get when(){return Y(()=>!!s())()&&x().length>0},get fallback(){return jd()},get children(){var se=Wd(),ke=se.firstChild,Be=ke.nextSibling,st=Be.nextSibling,at=st.nextSibling,y=at.nextSibling;return y.nextSibling,u(se,()=>It(x().length),y),se}})},children:se=>(()=>{var ke=zd(),Be=ke.firstChild,st=Be.firstChild,at=st.nextSibling;at.nextSibling;var y=Be.nextSibling;return u(Be,()=>se().status==="partial"?"△":"✗",st),u(Be,()=>Zr[t.id].label,at),u(y,()=>se().error??"stage produced no data"),ke})()})}}),null),u(k,f(E,{get when(){return U().length>0},get children(){return f(Hu,{page:ne,pageCount:W,onGo:g})}}),null),v(()=>k.hidden=!t.active()),v(()=>A.value=e()),v(()=>K.checked=s()),k})()}ve(["input"]);var Kd=p("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Jd=p('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),Yd=p('<button type=button class="btn-ghost hp-cash-edit">'),Xd=p("<div class=hp-pool-list>"),Qd=p('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),Zd=p('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),eh=p('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),th=p("<div class=hp-pool-item>"),nh=p("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),rh=p('<button type=button class="btn-ghost holdings-close-btn">sell call…'),ih=p("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),sh=p("<select class=hp-pool-pick>"),ah=p('<span class="chip high">buy back?'),oh=p('<span class="chip high">ITM — called away?'),ur=p("<b>"),lh=p("<i>"),ch=p('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),ps=p("<option>"),uh=p('<span class="chip normal">holding'),dh=p("<b>—"),hh=p("<label>pool<select>"),fh=p("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),gh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),ph=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),mh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),ms=p("<label class=holdings-outcome-price><input inputmode=decimal>"),_h=p("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),bh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),yh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),vh=p("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),wh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),$h=p("<div class=hp-list>"),ti=p("<div class=empty-panel>"),Sh=p('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),kh=p("<span class=hp-pane-hint> sh held"),Eh=p("<div class=hp-toolbar-row><button type=button class=btn>"),Ih=p('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Ch=p("<div class=holdings-notice>"),Th=p('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Ah=p("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const Re=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),bt=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Zt=(t,e=0)=>`${(t*100).toFixed(e)}%`,qe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),_s=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function bs(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Ph(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Kd(),r=n.firstChild,i=r.nextSibling;return v(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&tt(r,"width",s.e=a),o!==s.t&&tt(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function Rh(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Jd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var c;return l.key==="Escape"&&((c=t.onCancel)==null?void 0:c.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},v(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),v(()=>s.value=e()),i})()}function xh(t){const[e,n]=O(!1),[r,i]=O(null),[s,a]=O(""),o=()=>t.pools??[],l=()=>t.pool,c=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>c()==null,m=_=>{var w;_&&_!==((w=l())==null?void 0:w.id)&&t.onSelectPool(_),i(_??null),n(!0)},b=()=>{const _=o().find(w=>w.id===r());return _?_.cash:t.cash},I=async()=>{var _;!s().trim()||(_=t.busy)!=null&&_.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var _=Qd(),w=_.firstChild,S=w.nextSibling,C=S.nextSibling,T=C.firstChild,P=T.nextSibling;P.nextSibling;var N=C.nextSibling,M=N.firstChild,R=M.firstChild,x=R.nextSibling;return u(S,(()=>{var $=Y(()=>h()==null);return()=>$()?"—":Re(h())})()),u(C,(()=>{var $=Y(()=>c()==null);return()=>$()?"—":Re(c())})(),T),u(C,()=>Re(d()),P),u(_,f(E,{get when(){return!e()},get fallback(){return f(Rh,{get cash(){return b()},get busy(){return t.busy},onSave:async $=>{await t.onSaveCash($,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var $=Yd();return $.$$click=()=>{var U;return m(((U=l())==null?void 0:U.id)??null)},u($,()=>g()?"set cash":"edit cash"),$}}),N),u(N,f(E,{get when(){return o().length>0},get children(){var $=Xd();return u($,f(ie,{get each(){return o()},children:U=>f(Oh,{pool:U,get selected(){var W;return((W=l())==null?void 0:W.id)===U.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(U.id)},onEditCash:()=>m(U.id),onRename:W=>t.onRenamePool(U.id,W),onDelete:()=>t.onDeletePool(U.id)})})),$}}),M),R.$$keydown=$=>$.key==="Enter"&&I(),R.$$input=$=>a($.target.value),x.$$click=I,v(()=>{var $;return x.disabled=!s().trim()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>R.value=s()),_})()}function Oh(t){const[e,n]=O(!1),[r,i]=O(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=th();return u(o,f(E,{get when(){return!e()},get fallback(){return(()=>{var l=nh(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return c.$$keydown=g=>{g.key==="Enter"?a():g.key==="Escape"&&n(!1)},c.$$input=g=>i(g.target.value),d.$$click=a,h.$$click=()=>n(!1),v(g=>{var I;var m=`rename ${t.pool.name}`,b=((I=t.busy)==null?void 0:I.call(t))||!r().trim()||r().trim()===t.pool.name;return m!==g.e&&ee(c,"aria-label",g.e=m),b!==g.t&&(d.disabled=g.t=b),g},{e:void 0,t:void 0}),v(()=>c.value=r()),l})()},get children(){return[(()=>{var l=Zd(),c=l.firstChild,d=c.nextSibling;return j(c,"click",t.onSelect),u(c,()=>t.pool.name),j(d,"click",t.onDelete),v(h=>{var b;var g=(b=t.busy)==null?void 0:b.call(t),m=`delete ${t.pool.name}`;return g!==h.e&&(d.disabled=h.e=g),m!==h.t&&ee(d,"aria-label",h.t=m),h},{e:void 0,t:void 0}),l})(),(()=>{var l=eh(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return u(c,()=>Re(t.pool.cash)),j(d,"click",t.onEditCash),h.$$click=s,l})()]}})),v(()=>o.classList.toggle("active",!!t.selected)),o})()}function Nh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=ih(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=d.nextSibling,b=c.nextSibling,I=b.firstChild;I.firstChild;var _=I.nextSibling,w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var C=Y(()=>n().spot==null);return()=>C()?"—":bt(n().spot)})()),u(d,()=>bt(e.basis_per_share),g),u(d,()=>e.acquired,null),u(m,f(E,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${Re(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Zt(n().pl_pct,1)})`}})),u(I,()=>{var C;return bs((C=e.mark)==null?void 0:C.as_of)||"—"},null),u(_,()=>n().covered,S),u(_,()=>n().capacity,null),u(r,f(E,{get when(){return n().capacity>0},get children(){var C=rh();return C.$$click=()=>t.onSellDialog(e),C}}),null),u(r,f(E,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:C=>f(Uh,{get lot(){return C.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),v(()=>ue(m,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function Dh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=ch(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=m.nextSibling,I=b.nextSibling,_=I.nextSibling,w=_.nextSibling;w.nextSibling;var S=a.nextSibling,C=S.nextSibling,T=C.firstChild;T.firstChild;var P=C.nextSibling,N=P.nextSibling,M=N.nextSibling,R=M.firstChild,x=R.firstChild,$=x.nextSibling,U=R.nextSibling,W=U.firstChild,ne=W.nextSibling,te=ne.nextSibling,he=U.nextSibling;he.firstChild;var L=he.nextSibling,k=L.firstChild,B=k.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(a,f(E,{get when(){return Y(()=>e.p.kind==="put")()&&t.showPool},get children(){var A=sh();return A.addEventListener("change",V=>{var K;return(K=t.onPoolChange)==null?void 0:K.call(t,e.p.id,V.target.value)}),u(A,f(ie,{get each(){return t.pools},children:V=>(()=>{var K=ps();return u(K,()=>V.name),v(()=>K.value=V.id),K})()})),v(V=>{var ce,Fe;var K=`cash pool for ${e.p.symbol} ${e.p.strike} put`,z=(Fe=(ce=t.dialogActions)==null?void 0:ce.busy)==null?void 0:Fe.call(ce);return K!==V.e&&ee(A,"aria-label",V.e=K),z!==V.t&&(A.disabled=V.t=z),V},{e:void 0,t:void 0}),v(()=>{var V,K;return A.value=((K=(V=t.pools)==null?void 0:V.find(z=>z.name===e.p.pool_name))==null?void 0:K.id)??""}),A}}),h),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,I),u(h,()=>e.v.days_total,w),u(S,(()=>{var A=Y(()=>e.v.pl_pct==null);return()=>A()?"—":`${e.v.pl_pct>=0?"+":""}${Zt(e.v.pl_pct,1)}`})()),u(C,f(Ph,{get v(){return e.v}}),T),u(T,()=>Zt(e.v.target_pct),null),u(P,f(E,{get when(){return e.v.pace_met},get fallback(){return uh()},get children(){return ah()}}),null),u(P,f(E,{get when(){return Y(()=>e.p.kind==="call")()&&n()},get children(){return oh()}}),null),N.$$click=()=>t.onClose(e),u($,()=>bt(e.p.premium)),u(ne,(()=>{var A=Y(()=>e.p.mark==null);return()=>A()?"—":e.p.mark.mid.toFixed(2)})()),u(te,(()=>{var A=Y(()=>e.p.mark==null);return()=>A()?"unpriced":bs(e.p.mark.as_of)})()),u(he,f(E,{get when(){var A;return((A=e.p.mark)==null?void 0:A.underlying_price)!=null},get fallback(){return dh()},get children(){return[(()=>{var A=ur();return u(A,()=>e.p.mark.underlying_price.toFixed(2)),A})(),(()=>{var A=lh();return u(A,(()=>{var V=Y(()=>e.v.spot_pct_vs_strike==null);return()=>V()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Zt(e.v.spot_pct_vs_strike,1)} vs strike`})()),v(()=>ue(A,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),A})()]}}),null),u(B,(()=>{var A=Y(()=>e.v.pl_dollars==null);return()=>A()?"—":bt(e.v.pl_dollars)})()),u(i,f(E,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:A=>f(Vh,Hs({d:A},()=>t.dialogActions))}),null),v(A=>{var V=!!e.v.pace_met,K=e.p.kind,z=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",ce=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return V!==A.e&&s.classList.toggle("hp-row-met",A.e=V),K!==A.t&&ee(o,"data-kind",A.t=K),z!==A.a&&ue(S,A.a=z),ce!==A.o&&ue(B,A.o=ce),A},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function Lh(t){var o,l;const e=t.kind,n=()=>e==="put"?t.pools??[]:[],[r,i]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:qe(),expiry:_s(qe(),7),pool_id:((l=(o=t.pools)==null?void 0:o[0])==null?void 0:l.id)??""}),s=c=>d=>i({...r(),[c]:d.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(c=>Number(c)>0)&&r().expiry>r().sold&&r().sold<=qe();return(()=>{var c=gh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=d.nextSibling,b=m.firstChild,I=b.nextSibling,_=m.nextSibling,w=_.firstChild,S=w.nextSibling,C=_.nextSibling,T=C.firstChild,P=T.nextSibling,N=C.nextSibling,M=N.firstChild,R=M.nextSibling,x=N.nextSibling,$=x.firstChild,U=$.nextSibling,W=x.nextSibling,ne=W.nextSibling;return c.addEventListener("submit",te=>{var he,L;te.preventDefault(),!(!a()||(he=t.busy)!=null&&he.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...e==="put"&&n().length>0?{pool_id:r().pool_id||((L=n()[0])==null?void 0:L.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),j(g,"input",s("symbol")),j(I,"input",s("strike")),ee(I,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),j(S,"input",s("premium")),ee(S,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),j(P,"input",s("contracts")),u(c,f(E,{get when(){return n().length>1},get children(){var te=hh(),he=te.firstChild,L=he.nextSibling;return j(L,"input",s("pool_id")),u(L,f(ie,{get each(){return n()},children:k=>(()=>{var B=ps();return u(B,()=>k.name),v(()=>B.value=k.id),B})()})),v(()=>L.value=r().pool_id),te}}),N),j(R,"input",s("sold")),j(U,"input",s("expiry")),u(W,e==="call"?"Sell call":"Sell put"),j(ne,"click",t.onDone),u(c,f(E,{when:e==="call",get children(){return fh()}}),null),v(()=>{var te;return W.disabled=!a()||((te=t.busy)==null?void 0:te.call(t))}),v(()=>g.value=r().symbol),v(()=>I.value=r().strike),v(()=>S.value=r().premium),v(()=>P.value=r().contracts),v(()=>R.value=r().sold),v(()=>U.value=r().expiry),c})()}function Mh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:qe()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=ph(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,m=g.firstChild,b=m.nextSibling,I=g.nextSibling,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.nextSibling;return s.addEventListener("submit",T=>{var P;T.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),j(l,"input",r("symbol")),j(h,"input",r("shares")),j(b,"input",r("basis_per_share")),j(w,"input",r("acquired")),j(C,"click",t.onDone),v(()=>{var T;return S.disabled=!i()||((T=t.busy)==null?void 0:T.call(t))}),v(()=>l.value=e().symbol),v(()=>h.value=e().shares),v(()=>b.value=e().basis_per_share),v(()=>w.value=e().acquired),s})()}function Uh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:_s(qe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>qe();return(()=>{var o=mh(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.firstChild,b=m.nextSibling,I=g.nextSibling,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.firstChild,T=C.nextSibling,P=S.nextSibling,N=P.firstChild,M=N.nextSibling,R=P.nextSibling,x=R.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",$=>{var U;$.preventDefault(),!(!a()||(U=t.busy)!=null&&U.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:qe(),expiry:r().expiry})}),j(b,"input",s("strike")),j(w,"input",s("premium")),j(T,"input",s("contracts")),j(M,"input",s("expiry")),j(x,"click",t.onDone),v(()=>{var $;return R.disabled=!a()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>b.value=r().strike),v(()=>w.value=r().premium),v(()=>T.value=r().contracts),v(()=>M.value=r().expiry),o})()}function Fh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=bh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var I=d.nextSibling,_=I.firstChild,w=_.firstChild,S=_.nextSibling,C=S.firstChild,T=S.nextSibling,P=T.firstChild,N=I.nextSibling;N.firstChild;var M=N.nextSibling,R=M.firstChild,x=R.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),w.addEventListener("change",()=>r("bought-back")),C.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(E,{get when(){return n()!=="expired"},get children(){var $=ms(),U=$.firstChild;return u($,()=>n()==="assigned"?"share price at assignment":"close price/share",U),U.$$input=W=>s(W.target.value),v(()=>U.value=i()),$}}),N),u(N,f(E,{get when(){return a()!==null},fallback:"—",get children(){var $=ur();return u($,()=>bt(a())),v(()=>ue($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(R,"click",t.onDone),x.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(E,{get when(){return n()==="assigned"},get children(){return _h()}}),null),v(()=>{var $;return x.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>w.checked=n()==="bought-back"),v(()=>C.checked=n()==="expired"),v(()=>P.checked=n()==="assigned"),c})()}function Bh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=yh(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=h.nextSibling,I=b.firstChild,_=I.nextSibling,w=b.nextSibling,S=w.firstChild,C=S.nextSibling,T=w.nextSibling,P=T.nextSibling;return o.addEventListener("submit",N=>{var M;N.preventDefault(),!(!i()||(M=t.busy)!=null&&M.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),j(d,"input",r("symbol")),j(m,"input",r("shares")),j(_,"input",r("basis_per_share")),j(C,"input",r("acquired")),j(P,"click",t.onDone),v(()=>{var N;return T.disabled=!i()||((N=t.busy)==null?void 0:N.call(t))}),v(()=>d.value=e().symbol),v(()=>m.value=e().shares),v(()=>_.value=e().basis_per_share),v(()=>C.value=e().acquired),s})()}function Hh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=wh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var I=d.nextSibling,_=I.firstChild,w=_.firstChild,S=_.nextSibling,C=S.firstChild,T=S.nextSibling,P=T.firstChild,N=I.nextSibling;N.firstChild;var M=N.nextSibling,R=M.firstChild,x=R.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),w.addEventListener("change",()=>r("bought-back")),C.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(E,{get when(){return n()!=="expired"},get children(){var $=ms(),U=$.firstChild;return u($,()=>n()==="called-away"?"share price at call":"close price/share",U),U.$$input=W=>s(W.target.value),v(()=>U.value=i()),$}}),N),u(N,f(E,{get when(){return a()!==null},fallback:"—",get children(){var $=ur();return u($,()=>bt(a())),v(()=>ue($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(R,"click",t.onDone),x.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(E,{get when(){return n()==="called-away"},get children(){var $=vh(),U=$.firstChild,W=U.nextSibling,ne=W.nextSibling,te=ne.nextSibling;return te.nextSibling,u($,()=>e.symbol,W),u($,()=>e.contracts*100,te),$}}),null),v(()=>{var $;return x.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>w.checked=n()==="bought-back"),v(()=>C.checked=n()==="expired"),v(()=>P.checked=n()==="called-away"),c})()}function Vh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Bh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Fh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Hh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function Wh(){const[t,e]=O(null),[n,r]=O("");let i;const s=y=>{r(y),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Oe(()=>clearTimeout(i));const[a,o]=O(null),[l,c]=O(!1),d=async()=>{try{e(await ea())}catch(y){s(`Holdings API error: ${y.message}`)}};gt(d);const h=()=>{var y;return((y=t())==null?void 0:y.positions)??[]},g=()=>{var y;return((y=t())==null?void 0:y.calls)??[]},m=()=>{var y;return((y=t())==null?void 0:y.lots)??[]},b=()=>h().map(y=>({p:{...y,kind:"put"},v:y.view})),I=()=>g().map(y=>({p:{...y,kind:"call"},v:y.view})),_=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct,w=(y,D)=>{var Q,_e;const F=a();return!F||F.type!==y?null:(((Q=F.pos)==null?void 0:Q.id)??((_e=F.lot)==null?void 0:_e.id))===D?F:null},S=async y=>{if(l())return null;c(!0);try{return await y()}catch(D){return s(D.message),null}finally{c(!1)}},C=async()=>{var F;const y=await S(()=>na());if(!y)return;const D=((F=y.refresh)==null?void 0:F.stale)??[];s(D.length?`Marks refreshed — ${D.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},T=async(y,D)=>{await S(()=>kn(y))&&(s(D),o(null),await d())},P=async(y,D)=>{await S(()=>kn(D))&&(s(`Assigned — recorded ${D.shares} sh ${D.symbol} at $${D.basis_per_share.toFixed(2)} basis.`),o(null),await d())},N=async(y,D,F)=>{if(D==="assigned"){o({type:"put",pos:y,stage:"lot",prefill:{symbol:y.symbol,shares:y.contracts*100,basis_per_share:+(y.strike-y.premium).toFixed(2),acquired:qe()}});return}await S(()=>En(y.id))&&(s(D==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},M=async(y,D,F)=>{if(D==="called-away"){const Q=await S(()=>ra(y.id));if(!Q)return;s(Q.reduced?`Called away — ${y.symbol} lot reduced by ${y.contracts*100} sh.`:`Called away — call removed. ${Q.reason??""}`),o(null),await d();return}await S(()=>En(y.id))&&(s(D==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},R=async(y,D)=>{const F=await S(()=>mr(D?{cash:y,pool_id:D}:{cash:y}));return F?(e(G=>({...G??{},cash:F.cash,cash_reserved:F.cash_reserved,cash_free:F.cash_free,cash_pools:F.pool?((G==null?void 0:G.cash_pools)??[]).map(Q=>Q.id===F.pool.id?{...Q,...F.pool}:Q):(G==null?void 0:G.cash_pools)??[]})),s(F.pool?`Cash set to ${Re(F.pool.cash)} — ${Re(F.pool.free)} free in ${F.pool.name}.`:`Cash set to ${Re(F.cash)} — ${Re(F.cash_free)} free.`),!0):!1},x=()=>{var y;return((y=t())==null?void 0:y.cash_pools)??[]},[$,U]=O(null),W=()=>{const y=x();return y.length?y.find(D=>D.id===$())??y[0]:null},ne=async y=>{var F;const D=await S(()=>kn({kind:"pool",name:y}));return D?(s(`Pool “${y}” added — set its cash with the strip.`),U(((F=D.pool)==null?void 0:F.id)??null),await d(),!0):!1},te=async(y,D)=>{await S(()=>mr({pool_id:y,name:D}))&&(s(`Pool renamed to “${D}”.`),await d())},he=async y=>{await S(()=>En(y))&&(s("Pool deleted."),$()===y&&U(null),await d())},L=async(y,D)=>{var G;const F=await S(()=>ta(y,D));F&&(s(`Put moved to ${((G=F.position)==null?void 0:G.pool_name)??"the pool"}.`),await d())},k={busy:l,onDone:()=>o(null),onConfirmPut:N,onConfirmCall:M,onAssign:P},[B,A]=O("lots"),V=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((y,D)=>y+D.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(y=>y.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:g().length,sub:`${g().filter(y=>y.view.spot_pct_vs_strike>0).length} ITM`}],K=()=>[...b()].sort((y,D)=>_(D)-_(y)),z=()=>[...I()].sort((y,D)=>_(D)-_(y)),ce={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},Fe={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},se=y=>{if(y==="lots")return f(E,{get when(){return m().length>0},get fallback(){return(()=>{var F=ti();return u(F,()=>Fe.lots),F})()},get children(){var F=$h();return u(F,f(ie,{get each(){return m()},children:G=>f(Nh,{lot:G,dialogFor:w,busy:l,onSellDialog:Q=>o({type:"sellCall",lot:Q}),onDialogDone:()=>o(null),onSellCall:(Q,_e)=>T(_e,`Sold ${_e.symbol} ${_e.strike}C ×${_e.contracts} — Refresh marks to price.`)})})),F}});const D=y==="puts"?K():z();return f(E,{get when(){return D.length>0},get fallback(){return(()=>{var F=ti();return u(F,()=>Fe[y]),F})()},get children(){var F=Sh();return F.firstChild,u(F,f(ie,{each:D,children:G=>f(Dh,{x:G,get showPool(){return x().length>1},get pools(){return x()},onPoolChange:L,dialogFor:w,dialogActions:k,onClose:Q=>o({type:Q.p.kind,pos:Q.p})})}),null),F}})},ke=y=>f(E,{get when(){var D,F,G;return y==="lots"&&((D=a())==null?void 0:D.type)==="addLot"||y==="puts"&&((F=a())==null?void 0:F.type)==="addPut"||y==="calls"&&((G=a())==null?void 0:G.type)==="addCall"},keyed:!0,get children(){return y==="lots"?f(Mh,{busy:l,onDone:()=>o(null),onAdd:D=>T(D,`Recorded ${D.shares} sh ${D.symbol}.`)}):f(Lh,{kind:y==="puts"?"put":"call",get pools(){return x()},busy:l,onDone:()=>o(null),onAdd:D=>T(D,`Sold ${D.symbol} ${D.strike}${y==="puts"?"P":"C"} ×${D.contracts} — Refresh marks to price.`)})}}),Be=y=>(()=>{var D=Eh(),F=D.firstChild;return F.$$click=()=>o({type:ce[y].type}),u(F,()=>ce[y].label),u(D,f(E,{when:y==="lots",get children(){var G=kh(),Q=G.firstChild;return u(G,()=>m().reduce((_e,re)=>_e+re.shares,0),Q),G}}),null),D})(),st=()=>(()=>{var y=Ih();return y.$$click=C,v(()=>y.disabled=l()),y})(),at=()=>f(E,{get when(){return n()},get children(){var y=Ch();return u(y,n),y}});return(()=>{var y=Th(),D=y.firstChild,F=D.firstChild;F.firstChild;var G=F.nextSibling,Q=G.firstChild,_e=Q.firstChild;return u(F,f(xh,{get cash(){var re;return((re=t())==null?void 0:re.cash)??null},get reserved(){var re;return((re=t())==null?void 0:re.cash_reserved)??0},get free(){var re;return((re=t())==null?void 0:re.cash_free)??null},get pools(){return x()},get pool(){return W()},busy:l,onSaveCash:R,onSelectPool:U,onAddPool:ne,onRenamePool:te,onDeletePool:he}),null),u(F,f(ie,{get each(){return V()},children:re=>(()=>{var Vt=Ah(),dr=Vt.firstChild,hr=dr.nextSibling,Ss=hr.nextSibling;return Vt.$$click=()=>A(re.id),u(dr,()=>re.label.toUpperCase()),u(hr,()=>re.count),u(Ss,()=>re.sub),v(()=>Vt.classList.toggle("active",B()===re.id)),Vt})()}),null),u(_e,()=>V().find(re=>re.id===B()).label),u(Q,st,null),u(G,at,null),u(G,()=>Be(B()),null),u(G,()=>ke(B()),null),u(G,()=>se(B()),null),y})()}ve(["input","keydown","click"]);async function jh(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
-`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var zh=p("<button type=button class=run-btn>"),Gh=p("<span class=run-count>/"),qh=p("<span class=run-bar><span class=fill>"),Kh=p("<li><span class=mark></span><span class=label>"),Jh=p("<div class=toast-cached>Served from cache — last run <!> min old"),Yh=p('<div class="toast-cached warn">'),Xh=p("<div class=run-headline>"),Qh=p("<ul class=run-stages>"),Zh=p("<details class=run-errors><summary>details</summary><ul>"),ef=p("<div class=run-warn>Closing this tab stops the run."),tf=p("<div class=run-warn>Re-checking every 15 s…"),nf=p("<div class=run-strip>"),rf=p("<li> ");const ys=["quotes","metrics","chains_short","chains_medium"],vs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},sf=15e3,ws=t=>t!==null&&Date.now()>=t;function ni(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function af(t){const[e,n]=O("idle"),[r,i]=O(T()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,g]=O(null),[m,b]=O("");let I=null,_=null;const[w,S]=O(0);let C=null;et(()=>{const L=t();if(C&&(clearTimeout(C),C=null),(L==null?void 0:L.run_allowed)===!1){const k=fn(L.next_open_utc);k!==null&&(C=setTimeout(()=>S(B=>B+1),Math.max(0,k-Date.now())))}});function T(){return Object.fromEntries(ys.map(L=>[L,{status:"pending",error:null}]))}function P(){I&&clearInterval(I),I=null,_&&clearInterval(_),_=null}function N(){l(0),I=setInterval(()=>l(L=>L+1),1e3)}function M(L){switch(L.type){case"stage_started":i(k=>({...k,[L.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:L.stage,done:L.done,total:L.total});break;case"stage_finished":i(k=>({...k,[L.stage]:{status:L.ok?"ok":"failed",error:L.error??null}}));break;case"run_finished":d(L);break}}function R(){P();const L=c(),k=((L==null?void 0:L.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(L&&(k||L.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function x(L){let k=!1;return await jh(L,B=>{M(B),B.type==="run_finished"&&(k=!0)}),k?(R(),!0):!1}async function $(L){n("detached"),_=setInterval(async()=>{var k,B,A;try{const V=await hi(),K=((B=(k=V==null?void 0:V.result)==null?void 0:k.run)==null?void 0:B.finished_at_utc)??null;if(K&&K!==L){i(U(V.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((A=V==null?void 0:V.run_state)==null?void 0:A.status)!=="running"&&(P(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},sf)}function U(L){const k=T();for(const B of(L==null?void 0:L.stages)??[])k[B.name]&&(k[B.name]={status:B.status,error:B.error});return k}async function W(){var A,V,K;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(T()),g(null);const L=((K=(V=(A=t())==null?void 0:A.result)==null?void 0:V.run)==null?void 0:K.finished_at_utc)??null;n("running"),N();let k;try{k=await Qs()}catch{P(),n("idle"),b("Run failed to start — network or server unreachable.");return}const B=k.headers.get("content-type")??"";if(k.ok&&B.includes("application/json")){const z=await k.json().catch(()=>null);if(P(),n("idle"),(z==null?void 0:z.status)==="cached"){g(z.age_secs),setTimeout(()=>g(null),6e3);return}}if(k.status===403&&B.includes("application/json")){const z=await k.json().catch(()=>null);P(),n("idle"),b(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(k.status===202){const z=await Zs();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await x(z)||await $(L);return}await $(L);return}if(B.includes("text/event-stream")){await x(k)||await $(L);return}P(),n("idle"),b(`Unexpected /api/run response (${k.status}, ${B||"no type"}).`)}return Oe(()=>{P(),C&&clearTimeout(C)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:W,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{w();const L=t();return(L==null?void 0:L.run_allowed)!==!1?!0:ws(fn(L==null?void 0:L.next_open_utc))},nextOpenUtc:()=>{var L;return((L=t())==null?void 0:L.next_open_utc)??null}}}function of(t){const e=()=>!t.run.runAllowed(),n=()=>ds(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=zh();return i.$$click=()=>t.run.triggerRun(),u(i,r),v(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ee(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function lf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Kh(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>vs[t.name]),u(i,f(E,{get when(){return r()!==null},get children(){return[(()=>{var o=Gh(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=qh(),l=o.firstChild;return v(c=>tt(l,"width",`${r()}%`)),o})()]}}),null),v(()=>ue(i,`run-stage ${e()}`)),i})()}function cf(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",Y(()=>ni(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",Y(()=>ni(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(E,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=nf();return u(i,f(E,{get when(){return e.cachedToast()},get children(){var s=Jh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(E,{get when(){return e.notice()},get children(){var s=Yh();return u(s,()=>e.notice()),s}}),null),u(i,f(E,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Xh();return u(s,r),s})(),(()=>{var s=Qh();return u(s,()=>ys.map(a=>f(lf,{name:a,run:e}))),s})(),f(E,{get when(){return Y(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=Zh(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=rf(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>vs[l.name]??l.name,null),u(c,(()=>{var h=Y(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(E,{get when(){return Y(()=>e.phase()==="running")()&&!n()},get children(){return ef()}}),null),u(i,f(E,{get when(){return e.phase()==="detached"},get children(){return tf()}}),null),i}})}ve(["click"]);var $s=p("<b>"),uf=p("<span>Market closed · last run <b></b> ago"),df=p("<div class=cache-line><span></span><span class=pill>run: "),hf=p("<span>Cached · <b></b> left"),ff=p("<span>Stale · last run <b></b> ago"),gf=p("<nav class=tabs role=tablist aria-label=timeframes>"),pf=p("<button type=button role=tab class=tab>"),mf=p("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),_f=p('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),bf=p('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),yf=p('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),vf=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),wf=p("<div class=pop-backdrop>"),$f=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Sf=p("<div class=error-banner>API error: "),kf=p("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Ef=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function If(){const[t,e]=O(Pu()),n=r=>{e(r),Ru(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Et)}}function ri(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Cf(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function ii(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Fn(t){return f(E,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=$s();return u(e,()=>t.at()),e})()]}})}function Tf(t){const[e,n]=O(0);gt(()=>{const m=setInterval(()=>n(b=>b+1),3e4);Oe(()=>clearInterval(m))});let r=Date.now(),i=0;et(Ct(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,b;return Wu((b=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,b=fn(m);if(!(b===null||ws(b)))return ds(m)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var m=df(),b=m.firstChild,I=b.nextSibling;return I.firstChild,u(m,f(E,{get when(){return Y(()=>!!o())()&&g()},get fallback(){return f(E,{get when(){return a()==="fresh"},get fallback(){return f(E,{get when(){return a()==="stale"},get children(){var _=ff(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,()=>ii(s())),u(_,f(Fn,{at:c}),null),_}})},get children(){var _=hf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,l),u(_,f(Fn,{at:c}),null),_}})},get children(){var _=uf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,()=>ii(s())),u(_,f(Fn,{at:c}),null),u(_,f(E,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var C=$s();return u(C,d),C})()]}}),null),_}}),b),u(b,(()=>{var _=Y(()=>h()==="closed");return()=>_()?"market closed":a()})()),u(I,()=>{var _;return((_=t.envelope.run_state)==null?void 0:_.status)??"idle"},null),v(()=>ue(b,"pill "+h())),m})()}function si(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=gf();return u(n,()=>e.map(r=>(()=>{var i=pf();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=Y(()=>!r.holdings);return()=>s()&&` (${It(Cf(t.result,r.id))})`})(),null),v(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ee(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Af(){const[t,e]=O(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=bf(),o=a.firstChild;return a.$$click=i,u(o,f(E,{get when(){return r()==="dark"},get fallback(){return yf()},get children(){return[mf(),_f()]}})),v(l=>{var c=s(),d=s();return c!==l.e&&ee(a,"aria-label",l.e=c),d!==l.t&&ee(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function Pf(){const[t,e]=O(void 0),[n,{refetch:r}]=Rs(t,w=>w?hi():void 0);gt(()=>{if(!_t){e(null);return}const w=Ul(lt(),e);Oe(w)});const[i,s]=O(!1);et(Ct(t,w=>{s(!1),!(!w||!_t)&&Ks().then(S=>s(S.status===403)).catch(()=>{})})),gt(()=>{const w=()=>r();window.addEventListener("webapp:refresh-latest",w),Oe(()=>window.removeEventListener("webapp:refresh-latest",w))});const a=()=>{var w,S;return((w=t())==null?void 0:w.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=If(),[g,m]=O("short"),b=()=>g()==="holdings",I=Cu(),_=af(()=>n());return f(E,{get when(){return t()},get fallback(){return f(du,{})},get children(){return[f(E,{get when(){return!i()},get fallback(){return f(uu,{get email(){return a()},onSignOut:()=>Kr()})},get children(){var w=kf(),S=w.firstChild,C=S.firstChild,T=C.nextSibling,P=T.nextSibling,N=P.nextSibling;return u(C,f(E,{get when(){return t()},get children(){return[(()=>{var M=vf(),R=M.firstChild,x=R.nextSibling;return M.$$click=()=>l(!o()),u(x,a),v(()=>ee(M,"aria-expanded",o())),M})(),f(E,{get when(){return o()},get children(){return[(()=>{var M=wf();return M.$$click=()=>l(!1),M})(),(()=>{var M=$f(),R=M.firstChild,x=R.nextSibling,$=x.nextSibling,U=$.nextSibling;return u(x,a),$.$$click=()=>{l(!1),d(!0)},U.$$click=()=>{l(!1),Kr()},M})()]}})]}})),u(T,f(Af,{})),u(S,f(E,{get when(){return Y(()=>!n.loading)()&&!n.error},get children(){return f(Tf,{get envelope(){return n()}})}}),N),u(N,f(of,{run:_})),u(w,f(E,{get when(){return n.error},get children(){var M=Sf();return M.firstChild,u(M,()=>n.error.message,null),M}}),null),u(w,f(cf,{run:_}),null),u(w,f(E,{get when(){return b()},get children(){return[f(si,{result:()=>{var M;return(M=n())==null?void 0:M.result},tab:g,onTab:m}),f(Wh,{})]}}),null),u(w,f(E,{get when(){return!b()},get children(){return f(E,{get when(){var M;return Y(()=>!n.loading)()&&((M=n())==null?void 0:M.result)},get fallback(){return f(E,{get when(){return!n.loading},get children(){return Ef()}})},children:M=>{const R=()=>M();return[f(Au,{scoring:I}),f(si,{result:R,tab:g,onTab:m}),f(ei,{id:"short",active:()=>g()==="short",get tf(){var x;return(x=R().timeframes)==null?void 0:x.short},get stageError(){return ri(R(),"chains_short")},get stages(){return R().stages},get thresholds(){return R().thresholds},columns:h,scoring:I}),f(ei,{id:"medium",active:()=>g()==="medium",get tf(){var x;return(x=R().timeframes)==null?void 0:x.medium},get stageError(){return ri(R(),"chains_medium")},get stages(){return R().stages},get thresholds(){return R().thresholds},columns:h,scoring:I})]}})}}),null),w}}),f(E,{get when(){return c()},get children(){return f(_u,{onClose:()=>d(!1)})}})]}})}ve(["click"]);js(()=>f(Pf,{}),document.getElementById("root"));
+ */const Kc=300,Jc=bi("authIdTokenMaxAge")||Kc;let Gr=null;const Yc=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>Jc)return;const i=n==null?void 0:n.token;Gr!==i&&(Gr=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Xc(t=Io()){const e=Si(t,"auth");if(e.isInitialized())return e.getImmediate();const n=bl(t,{popupRedirectResolver:jc,persistence:[ec,Vl,es]}),r=bi("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=Yc(s.toString());Ml(n,a,()=>a(n.currentUser)),Ll(n,o=>a(o))}}const i=ha("auth");return i&&vl(n,`http://${i}`),n}function Qc(){var t;return((t=document.getElementsByTagName("head"))==null?void 0:t[0])??document}dl({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=ye("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",Qc().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});qc("Browser");const Zc={VITE_FIREBASE_API_KEY:"AIzaSyBtK1j6G7Mr22CT40I9aOn0TIq8BnnjNjA",VITE_FIREBASE_APP_ID:"1:971967977307:web:7751e467b279190596ec7e",VITE_FIREBASE_AUTH_DOMAIN:"market-int-1e5e4.firebaseapp.com",VITE_FIREBASE_PROJECT_ID:"market-int-1e5e4"},Ee=Zc,_t=!!Ee.VITE_FIREBASE_APP_ID;let On=null;function lt(){if(!_t)throw new Error("Firebase auth is not configured: set VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_APP_ID");if(!On){const t=ki({apiKey:Ee.VITE_FIREBASE_API_KEY,authDomain:Ee.VITE_FIREBASE_AUTH_DOMAIN,projectId:Ee.VITE_FIREBASE_PROJECT_ID,appId:Ee.VITE_FIREBASE_APP_ID,...Ee.VITE_FIREBASE_STORAGE_BUCKET&&{storageBucket:Ee.VITE_FIREBASE_STORAGE_BUCKET},...Ee.VITE_FIREBASE_MESSAGING_SENDER_ID&&{messagingSenderId:Ee.VITE_FIREBASE_MESSAGING_SENDER_ID}});On=Xc(t)}return On}function qr(){return new Ie}async function Kr(){if(!_t)return;const t=lt();t.currentUser&&await Fl(t)}var eu=p(`<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><p>Signed in as <b></b> — this account isn't authorized for this deployment.</p><p class=gate-note>Ask the owner to add your address to the allow list, or sign out to use a different account.</p><button type=button class="btn btn-primary"style=margin-top:12px>Sign out`),tu=p('<form><label class=gate-label>Email<input type=email required autocomplete=email placeholder=you@example.com></label><label class=gate-label>Password<input type=password required placeholder=••••••••></label><button type=submit class="btn btn-primary">'),nu=p("<button type=button class=gate-toggle>"),ru=p("<div class=gate-or>── or ──"),iu=p("<button type=button class=btn>Continue with Google"),su=p("<div class=gate-error role=alert>"),au=p("<div class=gate-wrap><div class=gate-card><h1 class=gate-title><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates"),ou=p("<p>Authentication is not configured — sign-in cannot start. Point <code>VITE_FIREBASE_API_KEY</code>, <code>VITE_FIREBASE_PROJECT_ID</code> and <code>VITE_FIREBASE_APP_ID</code> at a provisioned Firebase project (checklist: crates/webapp/README.md), rebuild <code>npm run build</code>, then reload."),lu=p("<p class=gate-note>The server itself still answers: its API stays open until it boots with a Firebase project id of its own.");const cu={"auth/invalid-credential":"Wrong email or password.","auth/user-not-found":"Wrong email or password.","auth/wrong-password":"Wrong email or password.","auth/email-already-in-use":"That email already has an account — switch to Sign in.","auth/weak-password":"Password is too weak — use at least 6 characters.","auth/unauthorized-domain":"This domain isn't authorized in the Firebase console yet.","auth/popup-closed-by-user":"Google sign-in cancelled — popup closed.","auth/popup-blocked":"The browser blocked the sign-in popup — allow popups for this site, or use email sign-in.","auth/operation-not-allowed":"Email/password sign-in isn't enabled for this app yet.","auth/too-many-requests":"Too many attempts — wait a moment and try again.","auth/network-request-failed":"Network problem — check your connection and try again."};function Jr(t){const e=(t==null?void 0:t.code)??"";return cu[e]??`Sign-in failed${e?` (${e})`:""} — check your details and try again.`}function uu(t){return(()=>{var e=eu(),n=e.firstChild,r=n.firstChild,i=r.nextSibling,s=i.firstChild,a=s.nextSibling,o=i.nextSibling,l=o.nextSibling;return u(a,()=>t.email),j(l,"click",t.onSignOut),e})()}function du(){const[t,e]=O("signin"),[n,r]=O(""),[i,s]=O(""),[a,o]=O(!1),[l,c]=O("");qs(async g=>{if(!_t)return null;const m=lt().currentUser;return m?await m.getIdToken(g):null});async function d(g){if(g.preventDefault(),!a()){o(!0),c("");try{const m=lt();t()==="create"?await Nl(m,n(),i()):await Dl(m,n(),i())}catch(m){c(Jr(m))}finally{o(!1)}}}async function h(){if(!a()){o(!0),c("");try{await sc(lt(),qr())}catch(g){if(new Set(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment"]).has(g==null?void 0:g.code)){await dc(lt(),qr());return}c(Jr(g))}finally{o(!1)}}}return(()=>{var g=au(),m=g.firstChild;return m.firstChild,u(m,f(E,{when:_t,get fallback(){return[ou(),lu()]},get children(){return[(()=>{var b=tu(),I=b.firstChild,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.firstChild,T=C.nextSibling,P=S.nextSibling;return b.addEventListener("submit",d),w.$$input=N=>r(N.currentTarget.value),T.$$input=N=>s(N.currentTarget.value),u(P,(()=>{var N=Y(()=>!!a());return()=>N()?"Working…":t()==="create"?"Create account":"Sign in"})()),v(N=>{var M=t()==="create"?"new-password":"current-password",R=a();return M!==N.e&&ee(T,"autocomplete",N.e=M),R!==N.t&&(P.disabled=N.t=R),N},{e:void 0,t:void 0}),v(()=>w.value=n()),v(()=>T.value=i()),b})(),(()=>{var b=nu();return b.$$click=()=>{c(""),e(t()==="create"?"signin":"create")},u(b,()=>t()==="create"?"⇄ Have an account? Sign in":"⇄ Need an account? Create one"),v(()=>b.disabled=a()),b})(),ru(),(()=>{var b=iu();return b.$$click=h,v(()=>b.disabled=a()),b})(),f(E,{get when(){return l()},get children(){var b=su();return u(b,l),b}})]}}),null),g})()}ve(["click","input"]);var hu=p("<div class=gate-error role=alert>"),fu=p("<p class=gate-note>No grant-file entries yet."),gu=p("<p class=gate-note>Also allowed via WEBAPP_OWNER_EMAILS: "),pu=p('<div class=modal-backdrop><div class="gate-card access-card"role=dialog aria-modal=true aria-label="Access control"><h1 class=gate-title>Access control</h1><p class=gate-note>Emails allowed to use this webapp. Changes apply immediately.</p><form class=access-add><input type=email placeholder=new.email@host aria-label="email to allow"required><button type=submit class="btn btn-primary"></button></form><button type=button class=btn style=margin-top:12px;width:100%>Close'),mu=p("<div class=access-row><span class=access-email></span><button type=button class=access-remove>✕");function _u(t){const[e,n]=O([]),[r,i]=O([]),[s,a]=O(""),[o,l]=O(!1),[c,d]=O(""),h=_=>{n((_==null?void 0:_.file_grants)??[]),i((_==null?void 0:_.static_emails)??[])};gt(async()=>{try{h(await Js())}catch{d("Could not load the grant list.")}});const m=_=>{_.key==="Escape"&&t.onClose()};gt(()=>{window.addEventListener("keydown",m),Oe(()=>window.removeEventListener("keydown",m));const _=document.querySelector(".access-add input");_==null||_.focus()});const b=async _=>{if(_.preventDefault(),!(o()||!s().trim())){l(!0),d("");try{h(await Ys(s())),a("")}catch(w){d(w.message)}l(!1)}},I=async _=>{if(!o()){l(!0),d("");try{h(await Xs(_))}catch(w){d(w.message)}l(!1)}};return(()=>{var _=pu(),w=_.firstChild,S=w.firstChild,C=S.nextSibling,T=C.nextSibling,P=T.firstChild,N=P.nextSibling,M=T.nextSibling;return j(_,"click",t.onClose),w.$$click=R=>R.stopPropagation(),u(w,f(E,{get when(){return c()},get children(){var R=hu();return u(R,c),R}}),T),u(w,f(ie,{get each(){return e()},children:R=>(()=>{var x=mu(),$=x.firstChild,U=$.nextSibling;return u($,R),U.$$click=()=>I(R),ee(U,"title",`Remove ${R}`),ee(U,"aria-label",`Remove ${R}`),v(()=>U.disabled=o()),x})()}),T),u(w,f(E,{get when(){return e().length===0},get children(){return fu()}}),T),T.addEventListener("submit",b),P.$$input=R=>a(R.currentTarget.value),u(N,()=>o()?"…":"Add"),u(w,f(E,{get when(){return r().length>0},get children(){var R=gu();return R.firstChild,u(R,()=>r().join(", "),null),R}}),M),j(M,"click",t.onClose),v(()=>N.disabled=o()),v(()=>P.value=s()),_})()}ve(["click","input"]);const Pe=Object.freeze({weightSharpe:.2,weightSafety:.4,weightReturn:.4,weightTrend:0,minRateOfReturn:.2,idealReturn:.8,trendScoreFloor:1.02,trendScoreBand:.06,earningsSafetyMultiplier:.5,topPicksCount:3}),At=(t,e,n)=>Math.min(n,Math.max(e,t));function bu(t,e,n){const r=n-e;return Math.abs(r)<1e-9?.5:At((n-t)/r,0,1)}function yu(t,e,n,r,i=Pe){if(n<i.minRateOfReturn||t<=0)return null;const s=At(t/2,0,1),a=At(e,0,1),o=Math.min(n/i.idealReturn,1),l=At((r-i.trendScoreFloor)/i.trendScoreBand,0,1),c={sharpe:i.weightSharpe*s,safety:i.weightSafety*a,return:i.weightReturn*o,trend:i.weightTrend*l};return c.total=c.sharpe+c.safety+c.return+c.trend,c}function vu(t,e=Pe){const n=t.rate_of_return;if(n==null||!Number.isFinite(n))return null;const r=t.sharpe_ratio??0,i=t.trend_short??0,s=t.earnings_before_expiry!=null;let a=t.delta!=null?At(1+t.delta,0,1):bu(t.strike,t.strike_from,t.strike_to);return s&&(a*=e.earningsSafetyMultiplier),yu(r,a,n,i,e)}function wu(t,e=Pe.topPicksCount){const n=t.map((a,o)=>({...a,i:o})).filter(a=>a.score!=null).sort((a,o)=>o.score-a.score||a.i-o.i),r=new Set,i=new Set,s=[];for(const a of n){if(s.length>=e)break;const{row:o}=a;r.has(o.underlying)||o.sector!=="Unknown"&&i.has(o.sector)||(r.add(o.underlying),o.sector!=="Unknown"&&i.add(o.sector),s.push(a))}return s}function $u(t){return t.weightSharpe===Pe.weightSharpe&&t.weightSafety===Pe.weightSafety&&t.weightReturn===Pe.weightReturn&&t.minRateOfReturn===Pe.minRateOfReturn}var Su=p("<span class=hint>production defaults · drag to re-rank live"),ku=p("<details class=adjust><summary>Adjust scoring </summary><div class=adjust-body><button type=button class=reset>Reset to production defaults"),Eu=p('<span class="hint hint-custom">custom weights'),Iu=p("<div class=ctl><label> <span class=val></span></label><input type=range min=0>");function Cu(){const[t,e]=O({...Pe});return{params:t,isCustom:()=>!$u(t()),setParam:(n,r)=>e(i=>({...i,[n]:r})),reset:()=>e({...Pe})}}const Tu=[{key:"weightSharpe",label:"Sharpe weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightSafety",label:"Safety weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"weightReturn",label:"Return weight",max:1,step:.05,fmt:t=>t.toFixed(2),weight:!0},{key:"minRateOfReturn",label:"Min rate-of-return floor",max:.5,step:.01,fmt:t=>`${Math.round(t*100)}%`,weight:!1}];function Au(t){const e=()=>t.scoring.isCustom(),n=()=>{const r=t.scoring.params();return r.weightSharpe+r.weightSafety+r.weightReturn||1};return(()=>{var r=ku(),i=r.firstChild;i.firstChild;var s=i.nextSibling,a=s.firstChild;return u(i,f(E,{get when(){return!e()},get fallback(){return Eu()},get children(){return Su()}}),null),u(s,f(ie,{each:Tu,children:o=>(()=>{var l=Iu(),c=l.firstChild,d=c.firstChild,h=d.nextSibling,g=c.nextSibling;return u(c,()=>o.label,d),u(h,()=>o.fmt(t.scoring.params()[o.key]),null),u(h,f(E,{get when(){return o.weight},get children(){return[" ","· ",Y(()=>Math.round(t.scoring.params()[o.key]/n()*100)),"% of weight"]}}),null),g.$$input=m=>t.scoring.setParam(o.key,Number(m.currentTarget.value)),v(m=>{var b=o.max,I=o.step;return b!==m.e&&ee(g,"max",m.e=b),I!==m.t&&ee(g,"step",m.t=I),m},{e:void 0,t:void 0}),v(()=>g.value=t.scoring.params()[o.key]),l})()}),a),a.$$click=()=>t.scoring.reset(),v(()=>r.open=e()),r})()}ve(["click","input"]);const vn=[{id:"underlying",label:"Underlying",kind:"text",align:"left"},{id:"sector",label:"Sector",kind:"text",align:"left"},{id:"strike",label:"Strike",kind:"fixed2",align:"num"},{id:"expiration",label:"Expiry",kind:"date",align:"left"},{id:"bid",label:"Bid",kind:"fixed2",align:"num"},{id:"mid",label:"Mid",kind:"fixed2",align:"num"},{id:"ask",label:"Ask",kind:"fixed2",align:"num"},{id:"rate_of_return",label:"ROR",kind:"pct1",align:"num"},{id:"score",label:"Score",kind:"fixed3",align:"num"},{id:"delta",label:"Delta",kind:"fixed3",align:"num"},{id:"iv_rv_ratio",label:"IV/RV",kind:"ivrv",align:"num"},{id:"realized_vol",label:"Realized vol",kind:"fixed3",align:"num"},{id:"price_percentile",label:"Price pctl",kind:"pct0",align:"num"},{id:"underlying_price",label:"Spot",kind:"fixed2",align:"num"},{id:"bid_size",label:"Bid sz",kind:"int",align:"num"},{id:"ask_size",label:"Ask sz",kind:"int",align:"num"},{id:"volume",label:"Volume",kind:"int",align:"num"},{id:"open_interest",label:"Open int",kind:"int",align:"num"},{id:"strike_from",label:"Band lo",kind:"fixed2",align:"num"},{id:"strike_to",label:"Band hi",kind:"fixed2",align:"num"},{id:"sharpe_ratio",label:"Sharpe",kind:"fixed3",align:"num"},{id:"strike_percentile",label:"Strike pctl",kind:"fixed3",align:"num"},{id:"earnings_before_expiry",label:"Earnings",kind:"earnings",align:"left"},{id:"trend_short",label:"Trend 20",kind:"fixed3",align:"num"},{id:"trend_long",label:"Trend 50",kind:"fixed3",align:"num"},{id:"implied_vol",label:"Implied vol",kind:"fixed3",align:"num"}],Et=["underlying","sector","strike","expiration","bid","mid","ask","rate_of_return","score","delta","iv_rv_ratio","realized_vol","price_percentile"],us="webapp.columns.v1";function Pu(){try{const t=localStorage.getItem(us);if(!t)return Et;const e=JSON.parse(t);if(!Array.isArray(e))return Et;const n=new Set(vn.map(i=>i.id)),r=e.filter(i=>n.has(i));return r.length>0?[...new Set(r)]:Et}catch{return Et}}function Ru(t){try{localStorage.setItem(us,JSON.stringify(t))}catch{}}var xu=p("<div class=pop-backdrop>"),Ou=p('<div class=picker-panel role=menu aria-label="visible columns"><div class=picker-grid></div><button type=button class=linklike>Reset defaults'),Nu=p("<span class=colpicker><button type=button class=tool-btn>columns ▾"),Du=p("<label class=pick-item><input type=checkbox>");function Lu(t){const[e,n]=O(!1);return(()=>{var r=Nu(),i=r.firstChild;return i.$$click=()=>n(!e()),u(r,f(E,{get when(){return e()},get children(){return[(()=>{var s=xu();return s.$$click=()=>n(!1),s})(),(()=>{var s=Ou(),a=s.firstChild,o=a.nextSibling;return u(a,f(ie,{each:vn,children:l=>(()=>{var c=Du(),d=c.firstChild;return d.addEventListener("change",h=>t.store.toggle(l.id,h.currentTarget.checked)),u(c,()=>l.label,null),v(()=>d.checked=t.store.isOn(l.id)),c})()})),o.$$click=()=>t.store.reset(),s})()]}}),null),v(()=>ee(i,"aria-expanded",e())),r})()}ve(["click"]);var Mu=p('<div class=pager role=navigation aria-label="table pagination"><span class=pager-label>page <!> / </span><button type=button class=pgbtn aria-label="previous page">‹</button><button type=button class=pgbtn aria-label="next page">›'),Uu=p("<span class=pggap>…"),Fu=p("<button type=button class=pgbtn>");function Bu(t,e){const n=Math.max(e,1),r=Math.min(Math.max(t,1),n);if(n<=7)return Array.from({length:n},(l,c)=>c+1);const s=[...new Set([1,2,r-1,r,r+1,n-1,n])].filter(l=>l>=1&&l<=n).sort((l,c)=>l-c),a=[];let o=0;for(const l of s)l-o>1&&a.push("…"),a.push(l),o=l;return a}function Hu(t){const e=ae(()=>Bu(t.page(),t.pageCount())),n=()=>t.onGo(Math.max(1,t.page()-1)),r=()=>t.onGo(Math.min(t.pageCount(),t.page()+1));return(()=>{var i=Mu(),s=i.firstChild,a=s.firstChild,o=a.nextSibling;o.nextSibling;var l=s.nextSibling,c=l.nextSibling;return u(s,()=>t.page(),o),u(s,()=>t.pageCount(),null),l.$$click=n,u(i,f(ie,{get each(){return e()},children:d=>d==="…"?Uu():(()=>{var h=Fu();return h.$$click=()=>t.onGo(d),u(h,d),v(()=>h.classList.toggle("active",d===t.page())),h})()}),c),c.$$click=r,v(d=>{var h=t.page()<=1,g=t.page()>=t.pageCount();return h!==d.e&&(l.disabled=d.e=h),g!==d.t&&(c.disabled=d.t=g),d},{e:void 0,t:void 0}),i})()}ve(["click"]);var Vu=p("<span class=tip>");function wt(t){let e;const n=()=>{if(!e)return;const r=e.getBoundingClientRect(),i=r.right+352;e.classList.toggle("tip-flip",i>window.innerWidth&&r.left>352)};return(()=>{var r=Vu();r.$$focusin=n,r.addEventListener("pointerenter",n);var i=e;return typeof i=="function"?zs(i,r):e=r,u(r,()=>t.children),v(()=>ee(r,"data-tip",t.text??"")),r})()}ve(["focusin"]);const nt="∅";function Z(t){return t==null||typeof t=="number"&&!Number.isFinite(t)}function It(t){return Number(t??0).toLocaleString("en-US")}function fn(t){if(!t)return null;const e=new Date(t).getTime();return Number.isNaN(e)?null:e}function ds(t){return hs(t,{hour:"2-digit",minute:"2-digit"})}function Wu(t){return hs(t,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function hs(t,e){const n=fn(t);if(n!==null)try{return new Intl.DateTimeFormat(void 0,{...e,hourCycle:"h23",timeZoneName:"short"}).format(n)}catch{return}}const fs={text:nt,isNull:!0},Nn=(t,e)=>({text:Number(t).toFixed(e),isNull:!1});function Yr(t,e){return!e||Z(t)?null:t>=e.vol_tier_high?"green":t>=e.vol_tier_mid?"yellow":"red"}function ju(t,e){return!e||Z(t)?null:t>e.momentum_extended?"EXTENDED":t>e.momentum_high?"HIGH":"NORMAL"}function zu(t){if(!t||typeof t!="object"||Z(t.report_date))return fs;const e=typeof t.report_time=="string"?` (${t.report_time.replaceAll("_"," ")})`:"";return{text:`⚠ ${t.report_date}${e}`,isNull:!1}}function ge(t,e){if(Z(e))return fs;switch(t){case"fixed2":return Nn(e,2);case"fixed3":return Nn(e,3);case"ivrv":return Nn(e,2);case"pct1":return{text:`${(e*100).toFixed(1)}%`,isNull:!1};case"pct0":return{text:`${Math.round(e*100)}%`,isNull:!1};case"int":return{text:Number(e).toLocaleString("en-US"),isNull:!1};case"earnings":return zu(e);default:return{text:String(e),isNull:!1}}}const Xr=t=>Number(t*100).toFixed(0);function Gu(t){const e=t??{},n=e.vol_tier_high??"?",r=e.vol_tier_mid??"?",i=Xr(e.momentum_high),s=Xr(e.momentum_extended);return{underlying:`The stock this put is written on. The colored dot is the realized-vol tier: green ≥ ${n}, yellow ${r}–${n}, red < ${r} — higher vol pays richer premium at matched assignment risk.`,sector:"GICS sector from symbols.csv. Context for diversification; not used in scoring.",strike:"Price you would buy the stock at if assigned. Deeper (lower) strikes are safer but pay less premium.",underlying_price:"Latest close of the underlying stock.",bid:"Best price a buyer will pay — the conservative fill for a seller.",mid:"(bid + ask) / 2 — the premium used for scoring, assuming half the spread is crossed.",ask:"Best price a seller demands.",bid_size:"Contracts quoted at the bid — a liquidity and depth signal.",ask_size:"Contracts quoted at the ask — a liquidity and depth signal.",expiration:"Contract expiry date. Short tab targets ~5–7 days to expiry, Medium ~20–28.",volume:"Option contracts traded today.",open_interest:"Option contracts still open — liquidity and positioning.",rate_of_return:"Annualized premium yield: mid ÷ strike scaled to a year. The pre-filter requires ≥ 30%.",strike_from:"Lower edge of the scored strike band, from 5/20-day max-drop stats. Below it the premium is too thin.",strike_to:"Upper edge of the scored strike band. Above it you are too close to spot for the premium.",sharpe_ratio:"Risk-adjusted drift of the underlying. 20% of the score; the pre-filter requires > 0.",strike_percentile:"Where the strike sits in the 20-day price range (0 = bottom, 1 = top). Blank when no 20-day range exists.",score:"Composite pick score: 20% Sharpe + 40% band safety (delta-aware, earnings-discounted) + 40% closeness of ror to the 0.80 ideal.",price_percentile:`Where spot sits in its 20-day range. Above the ${i}th percentile = HIGH momentum, above the ${s}th = EXTENDED.`,earnings_before_expiry:"The company reports earnings before this option expires — safety is discounted when set.",trend_short:"price ÷ EMA20. Above 1 means price is above its 20-day average — an independent breach-risk signal.",trend_long:"price ÷ EMA50. Same idea on the 50-day average.",realized_vol:"20-day annualized realized volatility of the underlying — the vol-tier input.",implied_vol:"Volatility the option market is pricing into this contract.",delta:"Put delta from Tiger (Black-Scholes fallback): roughly assignment probability with a minus sign, e.g. −0.21 ≈ 21%. Deeper real delta also boosts the safety score.",iv_rv_ratio:"Implied ÷ realized volatility. Above 1 the market prices more fear than realized — a premium-richness signal that boosts safety past a threshold.",band_range:"The scored strike band, derived from max-drop stats — the shaded range in the chart above.",band_depth:"How deep the strike sits inside the band (1 = at the safe bottom). Feeds the 40% safety component.",cushion_be:"How far spot can fall before hitting break-even, as % of spot.",capital:"Cash collateral if assigned: strike × 100 shares.",premium:"Premium collected up front: mid × 100.",breakeven:"strike − mid. The stock can fall to this price before the position loses money.",ann_ror:"Annualized premium yield — same number as the ror column.",sb_sharpe:"20% weight — Sharpe clamped to [0, 2].",sb_safety:"40% weight — band position, boosted by deep real delta or high IV/RV, discounted when earnings fall inside the window.",sb_ret:"40% weight — annualized ror closest to the 0.80 ideal scores highest."}}function $t(t,e){return Gu(e)[t]??t}var gs=p("<span class=tip-target>"),qu=p("<div class=kv><span class=kv-label></span><span class=kv-value>"),Ku=p("<span class=tip-target>Strike position in band"),Ju=p('<div class=band-chart role=img aria-label="strike position inside scored band"><div class=band-shade>'),Yu=p("<div class=exp-block><h4>"),Xu=p("<div class=kv-value>Band unavailable (∅)"),Qu=p("<div><span class=marker-tick></span><span class=marker-cap><br>"),Zu=p("<div class=exp-block><h4>Premium economics"),ed=p("<b>"),td=p('<div class="bar-row total"><span class=bar-label>total</span><span class="num bar-val"><b>'),nd=p("<div class=muted-note>earnings-discounted safety applied"),rd=p("<div class=exp-block><h4>Score breakdown"),id=p("<div class=kv><span class=kv-label>score</span><span class=kv-value><b></b></span><span class=muted-note>breakdown unavailable for this row"),sd=p('<div class=bar-row><span class=bar-label> <span class=bar-weight>(<!>%)</span></span><span class=bar-track><span class=bar-fill></span></span><span class="num bar-val">'),ad=p("<span class=muted-note>all columns visible"),od=p('<div class="exp-block exp-chips"><h4>Hidden columns'),ld=p("<span class=tip-target>: "),cd=p("<span>"),ud=p("<span class=tip-target>band safety is already discounted by the earnings rule."),dd=p("<div class=earnings-banner>⚠ Earnings <b></b> (<!>)<!> — "),hd=p("<div class=expansion><div class=exp-grid>");const Dn={sharpe:.2,safety:.4,return_part:.4};function Ln(t,e=2){return Z(t)?nt:`$${Number(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`}function we(t,e,n){return(()=>{var r=qu(),i=r.firstChild,s=i.nextSibling;return u(i,f(wt,{get text(){return $t(t,e)},get children(){var a=gs();return u(a,()=>t.replace(/_/g," ")),a}})),u(s,n),r})()}function fd(t){const e=t.row,n=e.strike_to-e.strike_from,r=n>0?(e.strike_to-e.strike)/n:null,i=Z(e.mid)?null:e.strike-e.mid,s=i!=null&&!Z(e.underlying_price)&&e.underlying_price!==0?(e.underlying_price-i)/e.underlying_price*100:null,a=e.strike_from,o=Math.max(e.underlying_price??e.strike_to,e.strike_to)*1.005,l=Math.max(o,a),c=!Z(a)&&l>a&&!Z(e.strike),d=g=>{if(Z(g))return null;const m=(g-a)/(l-a)*100;return Math.min(100,Math.max(0,m))},h=c?[{cls:"mk-strike",label:"strike",v:e.strike},{cls:"mk-spot",label:"spot",v:e.underlying_price}].filter(g=>d(g.v)!=null):[];return(()=>{var g=Yu(),m=g.firstChild;return u(m,f(wt,{get text(){return $t("band_range",t.thresholds)},get children(){return Ku()}})),u(g,f(E,{when:c,get fallback(){return Xu()},get children(){var b=Ju(),I=b.firstChild;return u(b,f(ie,{each:h,children:_=>(()=>{var w=Qu(),S=w.firstChild,C=S.nextSibling,T=C.firstChild;return u(C,()=>_.label,T),u(C,()=>ge("fixed2",_.v).text,null),v(P=>{var N=`marker ${_.cls}`,M=`${d(_.v)}%`;return N!==P.e&&ue(w,P.e=N),M!==P.t&&tt(w,"left",P.t=M),P},{e:void 0,t:void 0}),w})()}),null),v(_=>{var w=`${d(e.strike_from)}%`,S=`${Math.max(0,d(e.strike_to)-d(e.strike_from))}%`;return w!==_.e&&tt(I,"left",_.e=w),S!==_.t&&tt(I,"width",_.t=S),_},{e:void 0,t:void 0}),b}}),null),u(g,()=>we("band_range",t.thresholds,`${ge("fixed2",e.strike_from).text} → ${ge("fixed2",e.strike_to).text}`),null),u(g,()=>we("band_depth",t.thresholds,r==null?nt:`${(r*100).toFixed(1)}%`),null),u(g,()=>we("cushion_be",t.thresholds,s==null?nt:`${s.toFixed(1)}%`),null),g})()}function gd(t){const e=t.row,n=Z(e.strike)?null:e.strike*100,r=Z(e.mid)?null:e.mid*100,i=r==null?null:e.strike-e.mid,s=ge("pct1",e.rate_of_return);return(()=>{var a=Zu();return a.firstChild,u(a,()=>we("capital",t.thresholds,n==null?nt:Ln(n,0)),null),u(a,()=>we("premium",t.thresholds,r==null?nt:Ln(r)),null),u(a,()=>we("breakeven",t.thresholds,i==null?nt:Ln(i)),null),u(a,()=>we("ann_ror",t.thresholds,(()=>{var o=ed();return u(o,()=>s.text),o})()),null),u(a,()=>we("bid",t.thresholds,ge("fixed2",e.bid).text),null),u(a,()=>we("ask",t.thresholds,ge("fixed2",e.ask).text),null),u(a,()=>we("expiration",t.thresholds,e.expiration),null),a})()}function pd(t){const e=t.row,n=e.score_components,r=[{key:"sb_sharpe",label:"Sharpe",weight:Dn.sharpe,v:n==null?void 0:n.sharpe},{key:"sb_safety",label:"Band safety",weight:Dn.safety,v:n==null?void 0:n.safety},{key:"sb_ret",label:"Return vs ideal",weight:Dn.return_part,v:n==null?void 0:n.return}];return(()=>{var i=rd();return i.firstChild,u(i,f(E,{when:n,get fallback(){return(()=>{var s=id(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ge("fixed3",e.score).text),s})()},get children(){return[f(ie,{each:r,children:s=>{const a=Z(s.v)||s.weight===0?null:s.v/s.weight;return(()=>{var o=sd(),l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=l.nextSibling,b=m.firstChild,I=m.nextSibling;return u(l,f(wt,{get text(){return $t(s.key,t.thresholds)},get children(){var _=gs();return u(_,()=>s.label),_}}),c),u(d,()=>s.weight*100,g),u(I,()=>ge("fixed3",s.v).text),v(_=>tt(b,"width",`${Math.min(100,Math.max(0,(a??0)*100))}%`)),o})()}}),(()=>{var s=td(),a=s.firstChild,o=a.nextSibling,l=o.firstChild;return u(l,()=>ge("fixed3",e.score).text),s})(),f(E,{get when(){return e.earnings_before_expiry},get children(){return nd()}})]}}),null),i})()}function md(t){const e=()=>t.hiddenDefs.map(n=>({def:n,cell:ge(n.kind,n.id==="earnings_before_expiry"?t.row.earnings_before_expiry:t.row[n.id])}));return(()=>{var n=od();return n.firstChild,u(n,f(ie,{get each(){return e()},children:({def:r,cell:i})=>(()=>{var s=cd();return u(s,f(wt,{get text(){return $t(r.id,t.thresholds)},get children(){var a=ld(),o=a.firstChild;return u(a,()=>r.label,o),u(a,()=>i.text,null),a}})),v(()=>ue(s,`chip-hidden${i.isNull?" is-null":""}`)),s})()}),null),u(n,f(E,{get when(){return t.hiddenDefs.length===0},get children(){return ad()}}),null),n})()}function _d(t){const e=t.row,n=e.earnings_before_expiry;return(()=>{var r=hd(),i=r.firstChild;return u(r,f(E,{when:n,get children(){var s=dd(),a=s.firstChild,o=a.nextSibling,l=o.nextSibling,c=l.nextSibling,d=c.nextSibling,h=d.nextSibling;return h.nextSibling,u(o,()=>n.report_date),u(s,f(E,{get when(){return n.report_time},children:g=>g().replaceAll("_"," ")}),c),u(s,f(E,{get when(){return!Z(n.expected_eps)},get children(){return[" ","· expected EPS ",Y(()=>ge("fixed2",n.expected_eps).text)]}}),h),u(s,f(wt,{get text(){return $t("earnings_before_expiry",t.thresholds)},get children(){return ud()}}),null),s}}),i),u(i,f(fd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(gd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(pd,{row:e,get thresholds(){return t.thresholds}}),null),u(i,f(md,{row:e,get hiddenDefs(){return t.hiddenDefs},get thresholds(){return t.thresholds}}),null),r})()}var bd=p("<span class=null-mark>"),yd=p("<span class=star>★"),vd=p("<td><b>"),Mn=p("<span>"),Qr=p("<td class=num>"),wd=p("<span class=score-frozen>prod "),$d=p('<td class="num score-cell">'),Sd=p('<span class="score-frozen readmit">re-admitted'),kd=p("<td>"),Ed=p("<table><thead><tr><th class=exp-col aria-hidden=true></th></tr></thead><tbody>"),Id=p("<span class=sort-arrow>"),Cd=p("<span class=tip-target>"),Td=p("<th role=button tabindex=0>"),Ad=p("<tr class=expandable><td class=exp-col>"),Pd=p("<tr class=exp-row><td>");const Rd=t=>`${t.underlying}|${t.strike}`;function xd(t){return(()=>{var e=bd();return u(e,()=>t.text),e})()}function zt(t){const e=ge(t.kind,t.value);return f(E,{get when(){return!e.isNull},get fallback(){return f(xd,{get text(){return e.text}})},get children(){return e.text}})}function Od(t){const e=t.col,n=t.row;return e.id==="underlying"?(()=>{var r=vd(),i=r.firstChild;return u(r,f(E,{get when(){return t.pickRank!=null},get children(){var s=yd();return s.firstChild,u(s,()=>t.pickRank,null),s}}),i),u(i,()=>n.underlying),u(r,f(E,{get when(){return Yr(n.realized_vol,t.thresholds)},children:s=>[" ",(()=>{var a=Mn();return v(()=>ue(a,`dot ${s()}`)),a})()]}),null),r})():e.id==="realized_vol"?(()=>{var r=Qr();return u(r,f(E,{get when(){return Yr(n.realized_vol,t.thresholds)},children:i=>[(()=>{var s=Mn();return v(()=>ue(s,`dot ${i()}`)),s})()," "]}),null),u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),r})():e.id==="score"?(()=>{var r=$d();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){var i;return(i=t.customScores)==null?void 0:i.call(t)},get children(){return f(E,{get when(){return!Z(n.frozen_score)},get fallback(){return f(E,{get when(){return!Z(n.score)},get children(){return Sd()}})},get children(){var i=wd();return i.firstChild,u(i,()=>n.frozen_score.toFixed(3),null),i}})}}),null),r})():e.id==="price_percentile"?(()=>{var r=Qr();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}}),null),u(r,f(E,{get when(){return ju(n.price_percentile,t.thresholds)},children:i=>[" ",(()=>{var s=Mn();return u(s,i),v(()=>ue(s,`chip ${i().toLowerCase()}`)),s})()]}),null),r})():(()=>{var r=kd();return u(r,f(zt,{get kind(){return e.kind},get value(){return n[e.id]}})),v(i=>{var s=e.align==="num",a=e.id==="rate_of_return";return s!==i.e&&r.classList.toggle("num",i.e=s),a!==i.t&&r.classList.toggle("strong",i.t=a),i},{e:void 0,t:void 0}),r})()}function Nd(t){const e=ae(()=>vn.filter(n=>t.visibleCols().includes(n.id)));return(()=>{var n=Ed(),r=n.firstChild,i=r.firstChild;i.firstChild;var s=r.nextSibling;return u(i,f(ie,{get each(){return e()},children:a=>{const o=()=>t.sortKey()===a.id;return(()=>{var l=Td();return l.$$keydown=c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),t.onSort(a.id))},l.$$click=()=>t.onSort(a.id),u(l,f(wt,{get text(){return $t(a.id,t.thresholds)},get children(){var c=Cd();return u(c,()=>a.label,null),u(c,f(E,{get when(){return o()},get children(){return[" ",(()=>{var d=Id();return u(d,()=>t.sortDir()==="asc"?"↑":"↓"),d})()]}}),null),c}})),v(c=>{var d=a.align==="num",h=o()?t.sortDir()==="asc"?"ascending":"descending":void 0;return d!==c.e&&l.classList.toggle("num",c.e=d),h!==c.t&&ee(l,"aria-sort",c.t=h),c},{e:void 0,t:void 0}),l})()}}),null),u(s,f(ie,{get each(){return t.rows()},children:a=>{const o=()=>t.pickRankOf(a),l=()=>Rd(a),c=()=>t.openKey()!=null&&t.openKey()===l();return[(()=>{var d=Ad(),h=d.firstChild;return d.$$click=()=>t.onToggleRow(a),u(h,()=>c()?"▾":"▸"),u(d,f(ie,{get each(){return e()},children:g=>f(Od,{col:g,row:a,get thresholds(){return t.thresholds},get pickRank(){return o()},get customScores(){return t.customScores}})}),null),v(g=>{var m=o()!=null,b=!!Z(a.score),I=!!c();return m!==g.e&&d.classList.toggle("pick",g.e=m),b!==g.t&&d.classList.toggle("prow",g.t=b),I!==g.a&&d.classList.toggle("open",g.a=I),g},{e:void 0,t:void 0,a:void 0}),d})(),f(E,{get when(){return c()},get children(){var d=Pd(),h=d.firstChild;return u(h,f(_d,{row:a,get thresholds(){return t.thresholds},get hiddenDefs(){return t.hiddenDefs()}})),v(()=>ee(h,"colspan",e().length+1)),d}})]}})),n})()}ve(["click","keydown"]);function Dd(t,e){return typeof t=="number"&&typeof e=="number"?t-e:String(t).localeCompare(String(e),void 0,{sensitivity:"base"})}const ct=t=>Z(t);function Ld(t,e,n){const r=n==="desc"?-1:1;return[...t].sort((i,s)=>{const a=i[e],o=s[e],l=ct(a),c=ct(o);return l||c?l&&c?0:l?1:-1:r*Dd(a,o)})}function Md(t){return[...t].sort((e,n)=>{const r=e.score,i=n.score,s=ct(r),a=ct(i);if(s||a)return s&&a?0:s?1:-1;let o=i-r;if(o!==0)return o;const l=e.rate_of_return,c=n.rate_of_return,d=ct(l),h=ct(c);return d||h?d&&h?0:d?1:-1:c-l})}var Ud=p("<div class=stage-badges>"),Fd=p("<pre class=errbox>"),Bd=p("<details><summary> "),Hd=p("<div class=scroll-region>"),Vd=p('<section class=pane><div class=controls><input type=search class=filter-input placeholder="filter underlying / sector…"aria-label="filter rows by underlying or sector"><label class=check><input type=checkbox>scored only</label><span class=count-line> rows (filtered from <!>)'),Wd=p("<div class=empty-panel><b>No scored candidates on this timeframe.</b> Untick <b>scored only</b> to browse the <!> raw rows — none cleared the scoring gates (return floor, Sharpe &gt; 0). Try lowering the floor in <b>Adjust scoring</b>."),jd=p("<div class=empty-panel>No rows match the current filter."),zd=p('<div class="empty-panel stage-failed-panel"><b> <!> — no rows</b><pre class=errbox>');const Un=100,Gd=150,Zr={short:{id:"chains_short",label:"Chains · Short"},medium:{id:"chains_medium",label:"Chains · Medium"}};function qd(t){const e=i=>i==="failed"?"failed":i==="partial"?"partial":"ok",n=i=>i==="failed"?"✗":i==="partial"?"△":"✓",r=i=>i.replaceAll("_"," ");return(()=>{var i=Ud();return u(i,f(ie,{get each(){return t.stages??[]},children:s=>(()=>{var a=Bd(),o=a.firstChild,l=o.firstChild;return u(o,()=>n(s.status),l),u(o,()=>r(s.name),null),u(a,f(E,{get when(){return s.error},get children(){var c=Fd();return u(c,()=>s.error),c}}),null),v(()=>ue(a,`sbadge ${e(s.status)}`)),a})()})),i})()}function ei(t){const[e,n]=O(""),[r,i]=O(""),[s,a]=O(!0),[o,l]=O(null),[c,d]=O("asc"),[h,g]=O(1);let m;Oe(()=>clearTimeout(m));const b=()=>{var k;return((k=t.tf)==null?void 0:k.rows)??[]},I=ae(()=>{const k=t.scoring.params(),B=t.scoring.isCustom();return b().map(A=>{const V=vu(A,k);return{...A,frozen_score:A.score,live_parts:V,score:B?V==null?null:V.total:A.score}})}),_=ae(()=>I().filter(k=>!Z(k.score)&&Z(k.frozen_score)).length),w=k=>{const B=k.currentTarget.value;n(B),clearTimeout(m),m=setTimeout(()=>{i(B.trim().toLowerCase()),g(1)},Gd)},S=k=>{a(k),g(1)},C=k=>{o()!==k?(l(k),d("asc")):c()==="asc"?d("desc"):(l(null),d("asc")),g(1)},[T,P]=O(null),N=k=>{const B=`${k.underlying}|${k.strike}`;P(A=>A===B?null:B)};et(Ct([o,c,h,r,s],()=>P(null))),et(Ct(t.active,()=>P(null))),et(Ct(t.columns.visible,()=>g(1)));const M=()=>vn.filter(k=>!t.columns.visible().includes(k.id)),R=()=>(t.stages??[]).find(k=>k.name===Zr[t.id].id),x=ae(()=>{const k=r();return k?I().filter(B=>{const A=B.underlying,V=B.sector;return A!=null&&String(A).toLowerCase().includes(k)||V!=null&&String(V).toLowerCase().includes(k)}):I()}),$=ae(()=>{const k=x();return s()?k.filter(B=>!Z(B.score)):k}),U=ae(()=>o()?Ld($(),o(),c()):Md($())),W=ae(()=>Math.max(1,Math.ceil(U().length/Un))),ne=()=>Math.min(h(),W()),te=()=>{const k=ne();return U().slice((k-1)*Un,k*Un)},he=ae(()=>{var B;const k=new Map;if(t.scoring.isCustom()){const A=wu(I().map(V=>({row:V,score:V.score})));for(const V of A)k.set(`${V.row.underlying}|${V.row.strike}`,k.size+1)}else for(const A of((B=t.tf)==null?void 0:B.top_picks)??[])k.set(`${A.underlying}|${A.strike}`,A.rank??"?");return k}),L=k=>he().get(`${k.underlying}|${k.strike}`);return(()=>{var k=Vd(),B=k.firstChild,A=B.firstChild,V=A.nextSibling,K=V.firstChild,z=V.nextSibling,ce=z.firstChild,Fe=ce.nextSibling;return Fe.nextSibling,u(k,f(qd,{get stages(){return t.stages}}),B),A.$$input=w,K.addEventListener("change",se=>S(se.currentTarget.checked)),u(B,f(Lu,{get store(){return t.columns}}),z),u(z,()=>It(U().length),ce),u(z,()=>It(b().length),Fe),u(z,f(E,{get when(){return Y(()=>!!t.scoring.isCustom())()&&_()>0},get children(){return[" ","· ",Y(()=>It(_()))," re-admitted by lower floor"]}}),null),u(k,f(E,{get when(){return te().length>0},get children(){var se=Hd();return u(se,f(Nd,{get visibleCols(){return t.columns.visible},rows:te,sortKey:o,sortDir:c,onSort:C,get thresholds(){return t.thresholds},pickRankOf:L,openKey:T,onToggleRow:N,hiddenDefs:M,get customScores(){return t.scoring.isCustom}})),se}}),null),u(k,f(E,{get when(){return te().length===0},get children(){return f(E,{get when(){var se,ke;return((se=R())==null?void 0:se.status)==="failed"||((ke=R())==null?void 0:ke.status)==="partial"},get fallback(){return f(E,{get when(){return Y(()=>!!s())()&&x().length>0},get fallback(){return jd()},get children(){var se=Wd(),ke=se.firstChild,Be=ke.nextSibling,st=Be.nextSibling,at=st.nextSibling,y=at.nextSibling;return y.nextSibling,u(se,()=>It(x().length),y),se}})},children:se=>(()=>{var ke=zd(),Be=ke.firstChild,st=Be.firstChild,at=st.nextSibling;at.nextSibling;var y=Be.nextSibling;return u(Be,()=>se().status==="partial"?"△":"✗",st),u(Be,()=>Zr[t.id].label,at),u(y,()=>se().error??"stage produced no data"),ke})()})}}),null),u(k,f(E,{get when(){return U().length>0},get children(){return f(Hu,{page:ne,pageCount:W,onGo:g})}}),null),v(()=>k.hidden=!t.active()),v(()=>A.value=e()),v(()=>K.checked=s()),k})()}ve(["input"]);var Kd=p("<div class=holdings-bar><div class=holdings-bar-fill></div><div class=holdings-bar-mark>"),Jd=p('<span class=hp-cash-editor><input inputmode=decimal placeholder=150000><button type=button class="btn btn-primary">save</button><button type=button class=btn>cancel'),Yd=p('<button type=button class="btn-ghost hp-cash-edit">'),Xd=p("<div class=hp-pool-list>"),Qd=p('<div class=hp-rail-block><div class=hp-rail-label>free to sell puts</div><div class=hp-rail-big></div><div class=hp-rail-sub> cash − <!> reserved</div><div class=hp-pool-section><div class="hp-pool-row hp-pool-add"><input placeholder="new pool name"aria-label="new pool name"><button type=button class=btn>add'),Zd=p('<span class=hp-pool-name-row><button type=button class=hp-pool-name></button><button type=button class="btn hp-pool-del">×'),eh=p('<span class=hp-pool-line><span class=hp-pool-cash></span><button type=button class="btn-ghost hp-pool-act">cash</button><button type=button class="btn-ghost hp-pool-act">rename'),th=p("<div class=hp-pool-item>"),nh=p("<span class=hp-pool-row><input><button type=button class=btn>save</button><button type=button class=btn>cancel"),rh=p('<button type=button class="btn-ghost holdings-close-btn">sell call…'),ih=p("<div class=hp-slot><div class=hp-lot-row><div class=hp-lot-row-top><span> sh </span><b></b></div><div class=hp-lot-row-sub><span>bought <!> · </span><b></b></div><div class=hp-lot-row-meta><i>last </i><i>covered <!>/"),sh=p("<i class=hp-spot-session>"),ah=p("<select class=hp-pool-pick>"),oh=p('<span class="chip high">buy back?'),lh=p('<span class="chip high">ITM — called away?'),ur=p("<b>"),ch=p("<i>"),uh=p('<div class=hp-slot><div class=hp-list-row><span class=hp-list-pos><span class=hp-kind></span><b> <!> ×</b><i>exp <!> · <!>/<!> wd</i></span><span></span><span class=hp-list-pace><i>target </i></span><span class=hp-list-status></span><button type=button class="btn-ghost holdings-close-btn">close…</button><div class="holdings-card-stats hp-list-stats"><div><span>sold at</span><b></b></div><div><span>now (mid)</span><b></b><i></i></div><div><span>spot</span></div><div><span>close captures</span><b>'),ps=p("<option>"),dh=p('<span class="chip normal">holding'),hh=p("<b>—"),fh=p("<label>pool<select>"),gh=p("<div class=hp-dialog-note>coverage is shown per lot — recorded even if it exceeds held shares"),ph=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>strike<input inputmode=decimal></label><label>premium<input inputmode=decimal></label><label>contracts <input inputmode=numeric></label><label>sold <input type=date></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary"></button><button type=button class=btn>Cancel'),mh=p('<form class=holdings-add><label>symbol <input placeholder=SYMBOL></label><label>shares <input inputmode=numeric placeholder="e.g. 100"></label><label>basis / share<input inputmode=decimal placeholder="e.g. 349.00"></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),_h=p('<div class=holdings-outcome><div class=holdings-outcome-head>Sell covered call · <!> sh </div><form class=holdings-add><label>strike<input inputmode=decimal placeholder="e.g. 360.00"></label><label>premium<input inputmode=decimal placeholder="e.g. 1.20"></label><label>contracts <input inputmode=numeric></label><label>expiry <input type=date></label><button type=submit class="btn btn-primary">Sell call</button><button type=button class=btn>Cancel'),ms=p("<label class=holdings-outcome-price><input inputmode=decimal>"),bh=p("<div class=hp-dialog-note>confirming creates a share lot prefilled at basis = strike − premium"),yh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>P ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>assigned</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),vh=p('<div class=holdings-outcome><div class=holdings-outcome-head>Record assigned shares</div><form class=holdings-add><label>symbol <input></label><label>shares <input inputmode=numeric></label><label>basis / share<input inputmode=decimal></label><label>acquired <input type=date></label><button type=submit class="btn btn-primary">Record lot</button><button type=button class=btn>Cancel'),wh=p("<div class=hp-dialog-note>confirming auto-reduces the <!> lot by <!> sh"),$h=p('<div class=holdings-outcome><div class=holdings-outcome-head>Close <!> <!>C ×</div><div class=holdings-outcome-row><label><input type=radio>bought back</label><label><input type=radio>expired worthless</label><label><input type=radio>called away</label></div><div class=holdings-outcome-realized>realized: </div><div class=holdings-outcome-actions><button type=button class=btn>Cancel</button><button type=button class="btn btn-primary">Confirm'),Sh=p("<div class=hp-list>"),ti=p("<div class=empty-panel>"),kh=p('<div class=hp-list><div class="hp-list-row hp-list-head"><span>position</span><span>P&L</span><span>pace</span><span>status</span><span>'),Eh=p("<span class=hp-pane-hint> sh held"),Ih=p("<div class=hp-toolbar-row><button type=button class=btn>"),Ch=p('<button type=button class="btn holdings-refresh">⟳<span class=holdings-refresh-label> Refresh marks'),Th=p("<div class=holdings-notice>"),Ah=p('<div class="holdings-panel hp-tabs-shell"><div class=hp-tabs-grid><aside class=hp-tabs-rail><div class=hp-tabs-brand>Wheel ledger</div></aside><main class=hp-tabs-main><div class=hp-pane-head><span class=hp-pane-title>'),Ph=p("<button type=button class=hp-tab-tile><span class=hp-tab-tile-name></span><span class=hp-tab-tile-count></span><div class=hp-tab-tile-sub>");const Re=t=>(t<0?"-$":"$")+Math.abs(t).toLocaleString(void 0,{maximumFractionDigits:0}),bt=t=>(t<0?"-$":"$")+Math.abs(t).toFixed(2),Zt=(t,e=0)=>`${(t*100).toFixed(e)}%`,qe=()=>new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}),_s=(t,e)=>{const[n,r,i]=t.split("-").map(Number);return new Date(Date.UTC(n,r-1,i+e,12)).toLocaleDateString("en-CA",{timeZone:"America/New_York"})};function bs(t){if(!t)return"";const e=Math.max(0,(Date.now()-new Date(t).getTime())/1e3),n=Math.floor(e/60);return n<1?"just now":n<60?`${n} min ago`:`about ${Math.floor(n/60)} h ago`}function Rh(t){const e=()=>t.v.pl_pct==null?0:Math.max(0,Math.min(100,t.v.pl_pct*100));return(()=>{var n=Kd(),r=n.firstChild,i=r.nextSibling;return v(s=>{var a=`${e()}%`,o=`${Math.min(100,t.v.target_pct*100)}%`;return a!==s.e&&tt(r,"width",s.e=a),o!==s.t&&tt(i,"left",s.t=o),s},{e:void 0,t:void 0}),n})()}function xh(t){const[e,n]=O(t.cash==null?"":String(t.cash)),r=()=>Number.isFinite(Number(e()))&&Number(e())>=0;return(()=>{var i=Jd(),s=i.firstChild,a=s.nextSibling,o=a.nextSibling;return s.$$keydown=l=>{var c;return l.key==="Escape"&&((c=t.onCancel)==null?void 0:c.call(t))},s.$$input=l=>n(l.target.value),a.$$click=()=>t.onSave(Number(e())),o.$$click=()=>{var l;return(l=t.onCancel)==null?void 0:l.call(t)},v(()=>{var l;return a.disabled=!r()||((l=t.busy)==null?void 0:l.call(t))}),v(()=>s.value=e()),i})()}function Oh(t){const[e,n]=O(!1),[r,i]=O(null),[s,a]=O(""),o=()=>t.pools??[],l=()=>t.pool,c=()=>l()?l().cash:t.cash,d=()=>l()?l().reserved:t.reserved,h=()=>l()?l().free:t.free,g=()=>c()==null,m=_=>{var w;_&&_!==((w=l())==null?void 0:w.id)&&t.onSelectPool(_),i(_??null),n(!0)},b=()=>{const _=o().find(w=>w.id===r());return _?_.cash:t.cash},I=async()=>{var _;!s().trim()||(_=t.busy)!=null&&_.call(t)||await t.onAddPool(s().trim())&&a("")};return(()=>{var _=Qd(),w=_.firstChild,S=w.nextSibling,C=S.nextSibling,T=C.firstChild,P=T.nextSibling;P.nextSibling;var N=C.nextSibling,M=N.firstChild,R=M.firstChild,x=R.nextSibling;return u(S,(()=>{var $=Y(()=>h()==null);return()=>$()?"—":Re(h())})()),u(C,(()=>{var $=Y(()=>c()==null);return()=>$()?"—":Re(c())})(),T),u(C,()=>Re(d()),P),u(_,f(E,{get when(){return!e()},get fallback(){return f(xh,{get cash(){return b()},get busy(){return t.busy},onSave:async $=>{await t.onSaveCash($,r())&&n(!1)},onCancel:()=>n(!1)})},get children(){var $=Yd();return $.$$click=()=>{var U;return m(((U=l())==null?void 0:U.id)??null)},u($,()=>g()?"set cash":"edit cash"),$}}),N),u(N,f(E,{get when(){return o().length>0},get children(){var $=Xd();return u($,f(ie,{get each(){return o()},children:U=>f(Nh,{pool:U,get selected(){var W;return((W=l())==null?void 0:W.id)===U.id},get busy(){return t.busy},onSelect:()=>{n(!1),t.onSelectPool(U.id)},onEditCash:()=>m(U.id),onRename:W=>t.onRenamePool(U.id,W),onDelete:()=>t.onDeletePool(U.id)})})),$}}),M),R.$$keydown=$=>$.key==="Enter"&&I(),R.$$input=$=>a($.target.value),x.$$click=I,v(()=>{var $;return x.disabled=!s().trim()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>R.value=s()),_})()}function Nh(t){const[e,n]=O(!1),[r,i]=O(t.pool.name),s=()=>{i(t.pool.name),n(!0)},a=()=>{var l;const o=r().trim();!o||o===t.pool.name||(l=t.busy)!=null&&l.call(t)||(t.onRename(o),n(!1))};return(()=>{var o=th();return u(o,f(E,{get when(){return!e()},get fallback(){return(()=>{var l=nh(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return c.$$keydown=g=>{g.key==="Enter"?a():g.key==="Escape"&&n(!1)},c.$$input=g=>i(g.target.value),d.$$click=a,h.$$click=()=>n(!1),v(g=>{var I;var m=`rename ${t.pool.name}`,b=((I=t.busy)==null?void 0:I.call(t))||!r().trim()||r().trim()===t.pool.name;return m!==g.e&&ee(c,"aria-label",g.e=m),b!==g.t&&(d.disabled=g.t=b),g},{e:void 0,t:void 0}),v(()=>c.value=r()),l})()},get children(){return[(()=>{var l=Zd(),c=l.firstChild,d=c.nextSibling;return j(c,"click",t.onSelect),u(c,()=>t.pool.name),j(d,"click",t.onDelete),v(h=>{var b;var g=(b=t.busy)==null?void 0:b.call(t),m=`delete ${t.pool.name}`;return g!==h.e&&(d.disabled=h.e=g),m!==h.t&&ee(d,"aria-label",h.t=m),h},{e:void 0,t:void 0}),l})(),(()=>{var l=eh(),c=l.firstChild,d=c.nextSibling,h=d.nextSibling;return u(c,()=>Re(t.pool.cash)),j(d,"click",t.onEditCash),h.$$click=s,l})()]}})),v(()=>o.classList.toggle("active",!!t.selected)),o})()}const Dh={PreMarket:"pre",AfterHours:"post",OverNight:"overnight"};function Lh(t){const e=t.lot,n=()=>e.view;return(()=>{var r=ih(),i=r.firstChild,s=i.firstChild,a=s.firstChild,o=a.firstChild,l=a.nextSibling,c=s.nextSibling,d=c.firstChild,h=d.firstChild,g=h.nextSibling;g.nextSibling;var m=d.nextSibling,b=c.nextSibling,I=b.firstChild;I.firstChild;var _=I.nextSibling,w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(a,()=>e.shares,o),u(a,()=>e.symbol,null),u(l,(()=>{var C=Y(()=>n().spot==null);return()=>C()?"—":bt(n().spot)})(),null),u(l,f(E,{get when(){var C;return Dh[(C=e.mark)==null?void 0:C.session]},children:C=>(()=>{var T=sh();return u(T,C),T})()}),null),u(d,()=>bt(e.basis_per_share),g),u(d,()=>e.acquired,null),u(m,f(E,{get when(){return n().pl_dollars!=null},fallback:"—",get children(){return`${Re(n().pl_dollars)} (${(n().pl_pct??0)>=0?"+":""}${Zt(n().pl_pct,1)})`}})),u(I,()=>{var C;return bs((C=e.mark)==null?void 0:C.as_of)||"—"},null),u(_,()=>n().covered,S),u(_,()=>n().capacity,null),u(r,f(E,{get when(){return n().capacity>0},get children(){var C=rh();return C.$$click=()=>t.onSellDialog(e),C}}),null),u(r,f(E,{get when(){return t.dialogFor("sellCall",e.id)},keyed:!0,children:C=>f(Bh,{get lot(){return C.lot},get onDone(){return t.onDialogDone},get onSell(){return t.onSellCall}})}),null),v(()=>ue(m,(n().pl_dollars??0)>=0?"holdings-pos":"holdings-neg")),r})()}function Mh(t){const e=t.x,n=()=>e.v.spot_pct_vs_strike!=null&&e.v.spot_pct_vs_strike>0,r=()=>e.p.kind==="call"?e.v.spot_pct_vs_strike>0:e.v.spot_pct_vs_strike<0;return(()=>{var i=uh(),s=i.firstChild,a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=m.nextSibling,I=b.nextSibling,_=I.nextSibling,w=_.nextSibling;w.nextSibling;var S=a.nextSibling,C=S.nextSibling,T=C.firstChild;T.firstChild;var P=C.nextSibling,N=P.nextSibling,M=N.nextSibling,R=M.firstChild,x=R.firstChild,$=x.nextSibling,U=R.nextSibling,W=U.firstChild,ne=W.nextSibling,te=ne.nextSibling,he=U.nextSibling;he.firstChild;var L=he.nextSibling,k=L.firstChild,B=k.nextSibling;return u(o,()=>e.p.kind.toUpperCase()),u(l,()=>e.p.symbol,c),u(l,()=>e.p.strike,d),u(l,()=>e.p.kind==="put"?"P":"C",d),u(l,()=>e.p.contracts,null),u(a,f(E,{get when(){return Y(()=>e.p.kind==="put")()&&t.showPool},get children(){var A=ah();return A.addEventListener("change",V=>{var K;return(K=t.onPoolChange)==null?void 0:K.call(t,e.p.id,V.target.value)}),u(A,f(ie,{get each(){return t.pools},children:V=>(()=>{var K=ps();return u(K,()=>V.name),v(()=>K.value=V.id),K})()})),v(V=>{var ce,Fe;var K=`cash pool for ${e.p.symbol} ${e.p.strike} put`,z=(Fe=(ce=t.dialogActions)==null?void 0:ce.busy)==null?void 0:Fe.call(ce);return K!==V.e&&ee(A,"aria-label",V.e=K),z!==V.t&&(A.disabled=V.t=z),V},{e:void 0,t:void 0}),v(()=>{var V,K;return A.value=((K=(V=t.pools)==null?void 0:V.find(z=>z.name===e.p.pool_name))==null?void 0:K.id)??""}),A}}),h),u(h,()=>e.p.expiry,m),u(h,()=>e.v.days_elapsed,I),u(h,()=>e.v.days_total,w),u(S,(()=>{var A=Y(()=>e.v.pl_pct==null);return()=>A()?"—":`${e.v.pl_pct>=0?"+":""}${Zt(e.v.pl_pct,1)}`})()),u(C,f(Rh,{get v(){return e.v}}),T),u(T,()=>Zt(e.v.target_pct),null),u(P,f(E,{get when(){return e.v.pace_met},get fallback(){return dh()},get children(){return oh()}}),null),u(P,f(E,{get when(){return Y(()=>e.p.kind==="call")()&&n()},get children(){return lh()}}),null),N.$$click=()=>t.onClose(e),u($,()=>bt(e.p.premium)),u(ne,(()=>{var A=Y(()=>e.p.mark==null);return()=>A()?"—":e.p.mark.mid.toFixed(2)})()),u(te,(()=>{var A=Y(()=>e.p.mark==null);return()=>A()?"unpriced":bs(e.p.mark.as_of)})()),u(he,f(E,{get when(){var A;return((A=e.p.mark)==null?void 0:A.underlying_price)!=null},get fallback(){return hh()},get children(){return[(()=>{var A=ur();return u(A,()=>e.p.mark.underlying_price.toFixed(2)),A})(),(()=>{var A=ch();return u(A,(()=>{var V=Y(()=>e.v.spot_pct_vs_strike==null);return()=>V()?"":`${e.v.spot_pct_vs_strike>=0?"+":""}${Zt(e.v.spot_pct_vs_strike,1)} vs strike`})()),v(()=>ue(A,r()&&e.v.spot_pct_vs_strike!=null?"holdings-neg":"holdings-pos")),A})()]}}),null),u(B,(()=>{var A=Y(()=>e.v.pl_dollars==null);return()=>A()?"—":bt(e.v.pl_dollars)})()),u(i,f(E,{get when(){return t.dialogFor(e.p.kind,e.p.id)},keyed:!0,children:A=>f(jh,Hs({d:A},()=>t.dialogActions))}),null),v(A=>{var V=!!e.v.pace_met,K=e.p.kind,z=e.v.pl_pct>=0?"holdings-pos":"holdings-neg",ce=(e.v.pl_dollars??0)>=0?"holdings-pos":"holdings-neg";return V!==A.e&&s.classList.toggle("hp-row-met",A.e=V),K!==A.t&&ee(o,"data-kind",A.t=K),z!==A.a&&ue(S,A.a=z),ce!==A.o&&ue(B,A.o=ce),A},{e:void 0,t:void 0,a:void 0,o:void 0}),i})()}function Uh(t){var o,l;const e=t.kind,n=()=>e==="put"?t.pools??[]:[],[r,i]=O({symbol:"",strike:"",premium:"",contracts:"1",sold:qe(),expiry:_s(qe(),7),pool_id:((l=(o=t.pools)==null?void 0:o[0])==null?void 0:l.id)??""}),s=c=>d=>i({...r(),[c]:d.target.value}),a=()=>r().symbol.trim()&&[r().strike,r().premium,r().contracts].every(c=>Number(c)>0)&&r().expiry>r().sold&&r().sold<=qe();return(()=>{var c=ph(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=d.nextSibling,b=m.firstChild,I=b.nextSibling,_=m.nextSibling,w=_.firstChild,S=w.nextSibling,C=_.nextSibling,T=C.firstChild,P=T.nextSibling,N=C.nextSibling,M=N.firstChild,R=M.nextSibling,x=N.nextSibling,$=x.firstChild,U=$.nextSibling,W=x.nextSibling,ne=W.nextSibling;return c.addEventListener("submit",te=>{var he,L;te.preventDefault(),!(!a()||(he=t.busy)!=null&&he.call(t))&&t.onAdd({...e==="call"?{kind:"call"}:{},...e==="put"&&n().length>0?{pool_id:r().pool_id||((L=n()[0])==null?void 0:L.id)}:{},symbol:r().symbol.trim().toUpperCase(),strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:r().sold,expiry:r().expiry})}),j(g,"input",s("symbol")),j(I,"input",s("strike")),ee(I,"placeholder",e==="call"?"e.g. 355.00":"e.g. 350.00"),j(S,"input",s("premium")),ee(S,"placeholder",e==="call"?"e.g. 1.80":"e.g. 1.00"),j(P,"input",s("contracts")),u(c,f(E,{get when(){return n().length>1},get children(){var te=fh(),he=te.firstChild,L=he.nextSibling;return j(L,"input",s("pool_id")),u(L,f(ie,{get each(){return n()},children:k=>(()=>{var B=ps();return u(B,()=>k.name),v(()=>B.value=k.id),B})()})),v(()=>L.value=r().pool_id),te}}),N),j(R,"input",s("sold")),j(U,"input",s("expiry")),u(W,e==="call"?"Sell call":"Sell put"),j(ne,"click",t.onDone),u(c,f(E,{when:e==="call",get children(){return gh()}}),null),v(()=>{var te;return W.disabled=!a()||((te=t.busy)==null?void 0:te.call(t))}),v(()=>g.value=r().symbol),v(()=>I.value=r().strike),v(()=>S.value=r().premium),v(()=>P.value=r().contracts),v(()=>R.value=r().sold),v(()=>U.value=r().expiry),c})()}function Fh(t){const[e,n]=O({symbol:"",shares:"",basis_per_share:"",acquired:qe()}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=mh(),a=s.firstChild,o=a.firstChild,l=o.nextSibling,c=a.nextSibling,d=c.firstChild,h=d.nextSibling,g=c.nextSibling,m=g.firstChild,b=m.nextSibling,I=g.nextSibling,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.nextSibling;return s.addEventListener("submit",T=>{var P;T.preventDefault(),!(!i()||(P=t.busy)!=null&&P.call(t))&&t.onAdd({kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired})}),j(l,"input",r("symbol")),j(h,"input",r("shares")),j(b,"input",r("basis_per_share")),j(w,"input",r("acquired")),j(C,"click",t.onDone),v(()=>{var T;return S.disabled=!i()||((T=t.busy)==null?void 0:T.call(t))}),v(()=>l.value=e().symbol),v(()=>h.value=e().shares),v(()=>b.value=e().basis_per_share),v(()=>w.value=e().acquired),s})()}function Bh(t){const e=t.lot,n=()=>Math.floor(e.shares/100),[r,i]=O({strike:"",premium:"",contracts:String(n()),expiry:_s(qe(),7)}),s=o=>l=>i({...r(),[o]:l.target.value}),a=()=>Number(r().strike)>0&&Number(r().premium)>0&&Number(r().contracts)>=1&&Number(r().contracts)<=n()&&r().expiry>qe();return(()=>{var o=_h(),l=o.firstChild,c=l.firstChild,d=c.nextSibling;d.nextSibling;var h=l.nextSibling,g=h.firstChild,m=g.firstChild,b=m.nextSibling,I=g.nextSibling,_=I.firstChild,w=_.nextSibling,S=I.nextSibling,C=S.firstChild,T=C.nextSibling,P=S.nextSibling,N=P.firstChild,M=N.nextSibling,R=P.nextSibling,x=R.nextSibling;return u(l,()=>e.shares,d),u(l,()=>e.symbol,null),h.addEventListener("submit",$=>{var U;$.preventDefault(),!(!a()||(U=t.busy)!=null&&U.call(t))&&t.onSell(e,{kind:"call",symbol:e.symbol,strike:Number(r().strike),premium:Number(r().premium),contracts:Math.trunc(Number(r().contracts)),sold:qe(),expiry:r().expiry})}),j(b,"input",s("strike")),j(w,"input",s("premium")),j(T,"input",s("contracts")),j(M,"input",s("expiry")),j(x,"click",t.onDone),v(()=>{var $;return R.disabled=!a()||(($=t.busy)==null?void 0:$.call(t))}),v(()=>b.value=r().strike),v(()=>w.value=r().premium),v(()=>T.value=r().contracts),v(()=>M.value=r().expiry),o})()}function Hh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="assigned"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=yh(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var I=d.nextSibling,_=I.firstChild,w=_.firstChild,S=_.nextSibling,C=S.firstChild,T=S.nextSibling,P=T.firstChild,N=I.nextSibling;N.firstChild;var M=N.nextSibling,R=M.firstChild,x=R.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),w.addEventListener("change",()=>r("bought-back")),C.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("assigned")),u(c,f(E,{get when(){return n()!=="expired"},get children(){var $=ms(),U=$.firstChild;return u($,()=>n()==="assigned"?"share price at assignment":"close price/share",U),U.$$input=W=>s(W.target.value),v(()=>U.value=i()),$}}),N),u(N,f(E,{get when(){return a()!==null},fallback:"—",get children(){var $=ur();return u($,()=>bt(a())),v(()=>ue($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(R,"click",t.onDone),x.$$click=()=>t.onConfirmPut(e,n(),n()==="expired"?null:Number(i())),u(c,f(E,{get when(){return n()==="assigned"},get children(){return bh()}}),null),v(()=>{var $;return x.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>w.checked=n()==="bought-back"),v(()=>C.checked=n()==="expired"),v(()=>P.checked=n()==="assigned"),c})()}function Vh(t){const[e,n]=O({...t.d.prefill}),r=s=>a=>n({...e(),[s]:a.target.value}),i=()=>e().symbol.trim()&&Number(e().shares)>0&&Number(e().basis_per_share)>0;return(()=>{var s=vh(),a=s.firstChild,o=a.nextSibling,l=o.firstChild,c=l.firstChild,d=c.nextSibling,h=l.nextSibling,g=h.firstChild,m=g.nextSibling,b=h.nextSibling,I=b.firstChild,_=I.nextSibling,w=b.nextSibling,S=w.firstChild,C=S.nextSibling,T=w.nextSibling,P=T.nextSibling;return o.addEventListener("submit",N=>{var M;N.preventDefault(),!(!i()||(M=t.busy)!=null&&M.call(t))&&t.onAssign(t.d.pos,{kind:"lot",symbol:e().symbol.trim().toUpperCase(),shares:Math.trunc(Number(e().shares)),basis_per_share:Number(e().basis_per_share),acquired:e().acquired,assigned_from:t.d.pos.id})}),j(d,"input",r("symbol")),j(m,"input",r("shares")),j(_,"input",r("basis_per_share")),j(C,"input",r("acquired")),j(P,"click",t.onDone),v(()=>{var N;return T.disabled=!i()||((N=t.busy)==null?void 0:N.call(t))}),v(()=>d.value=e().symbol),v(()=>m.value=e().shares),v(()=>_.value=e().basis_per_share),v(()=>C.value=e().acquired),s})()}function Wh(t){var o,l;const e=t.d.pos,[n,r]=O("bought-back"),[i,s]=O(((l=(o=e.mark)==null?void 0:o.mid)==null?void 0:l.toFixed(2))??""),a=()=>{if(n()==="expired")return e.premium*100*e.contracts;const c=Number(i());return Number.isFinite(c)?n()==="called-away"?(e.strike-c+e.premium)*100*e.contracts:(e.premium-c)*100*e.contracts:null};return(()=>{var c=$h(),d=c.firstChild,h=d.firstChild,g=h.nextSibling,m=g.nextSibling,b=m.nextSibling;b.nextSibling;var I=d.nextSibling,_=I.firstChild,w=_.firstChild,S=_.nextSibling,C=S.firstChild,T=S.nextSibling,P=T.firstChild,N=I.nextSibling;N.firstChild;var M=N.nextSibling,R=M.firstChild,x=R.nextSibling;return u(d,()=>e.symbol,g),u(d,()=>e.strike,b),u(d,()=>e.contracts,null),w.addEventListener("change",()=>r("bought-back")),C.addEventListener("change",()=>r("expired")),P.addEventListener("change",()=>r("called-away")),u(c,f(E,{get when(){return n()!=="expired"},get children(){var $=ms(),U=$.firstChild;return u($,()=>n()==="called-away"?"share price at call":"close price/share",U),U.$$input=W=>s(W.target.value),v(()=>U.value=i()),$}}),N),u(N,f(E,{get when(){return a()!==null},fallback:"—",get children(){var $=ur();return u($,()=>bt(a())),v(()=>ue($,a()>=0?"holdings-pos":"holdings-neg")),$}}),null),j(R,"click",t.onDone),x.$$click=()=>t.onConfirmCall(e,n(),n()==="expired"?null:Number(i())),u(c,f(E,{get when(){return n()==="called-away"},get children(){var $=wh(),U=$.firstChild,W=U.nextSibling,ne=W.nextSibling,te=ne.nextSibling;return te.nextSibling,u($,()=>e.symbol,W),u($,()=>e.contracts*100,te),$}}),null),v(()=>{var $;return x.disabled=(($=t.busy)==null?void 0:$.call(t))||n()!=="expired"&&!Number.isFinite(Number(i()))}),v(()=>w.checked=n()==="bought-back"),v(()=>C.checked=n()==="expired"),v(()=>P.checked=n()==="called-away"),c})()}function jh(t){return t.d.type==="put"?t.d.stage==="lot"?f(Vh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onAssign(){return t.onAssign}}):f(Hh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmPut(){return t.onConfirmPut}}):f(Wh,{get d(){return t.d},get busy(){return t.busy},get onDone(){return t.onDone},get onConfirmCall(){return t.onConfirmCall}})}function zh(){const[t,e]=O(null),[n,r]=O("");let i;const s=y=>{r(y),clearTimeout(i),i=setTimeout(()=>r(""),4e3)};Oe(()=>clearTimeout(i));const[a,o]=O(null),[l,c]=O(!1),d=async()=>{try{e(await ea())}catch(y){s(`Holdings API error: ${y.message}`)}};gt(d);const h=()=>{var y;return((y=t())==null?void 0:y.positions)??[]},g=()=>{var y;return((y=t())==null?void 0:y.calls)??[]},m=()=>{var y;return((y=t())==null?void 0:y.lots)??[]},b=()=>h().map(y=>({p:{...y,kind:"put"},v:y.view})),I=()=>g().map(y=>({p:{...y,kind:"call"},v:y.view})),_=y=>y.v.pl_pct==null?-1/0:y.v.pl_pct-y.v.target_pct,w=(y,D)=>{var Q,_e;const F=a();return!F||F.type!==y?null:(((Q=F.pos)==null?void 0:Q.id)??((_e=F.lot)==null?void 0:_e.id))===D?F:null},S=async y=>{if(l())return null;c(!0);try{return await y()}catch(D){return s(D.message),null}finally{c(!1)}},C=async()=>{var F;const y=await S(()=>na());if(!y)return;const D=((F=y.refresh)==null?void 0:F.stale)??[];s(D.length?`Marks refreshed — ${D.length} entry(ies) unpriced (kept last mark).`:"Marks refreshed."),await d()},T=async(y,D)=>{await S(()=>kn(y))&&(s(D),o(null),await d())},P=async(y,D)=>{await S(()=>kn(D))&&(s(`Assigned — recorded ${D.shares} sh ${D.symbol} at $${D.basis_per_share.toFixed(2)} basis.`),o(null),await d())},N=async(y,D,F)=>{if(D==="assigned"){o({type:"put",pos:y,stage:"lot",prefill:{symbol:y.symbol,shares:y.contracts*100,basis_per_share:+(y.strike-y.premium).toFixed(2),acquired:qe()}});return}await S(()=>En(y.id))&&(s(D==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},M=async(y,D,F)=>{if(D==="called-away"){const Q=await S(()=>ra(y.id));if(!Q)return;s(Q.reduced?`Called away — ${y.symbol} lot reduced by ${y.contracts*100} sh.`:`Called away — call removed. ${Q.reason??""}`),o(null),await d();return}await S(()=>En(y.id))&&(s(D==="expired"?"Expired worthless — premium kept, position removed.":"Bought back — position removed."),o(null),await d())},R=async(y,D)=>{const F=await S(()=>mr(D?{cash:y,pool_id:D}:{cash:y}));return F?(e(G=>({...G??{},cash:F.cash,cash_reserved:F.cash_reserved,cash_free:F.cash_free,cash_pools:F.pool?((G==null?void 0:G.cash_pools)??[]).map(Q=>Q.id===F.pool.id?{...Q,...F.pool}:Q):(G==null?void 0:G.cash_pools)??[]})),s(F.pool?`Cash set to ${Re(F.pool.cash)} — ${Re(F.pool.free)} free in ${F.pool.name}.`:`Cash set to ${Re(F.cash)} — ${Re(F.cash_free)} free.`),!0):!1},x=()=>{var y;return((y=t())==null?void 0:y.cash_pools)??[]},[$,U]=O(null),W=()=>{const y=x();return y.length?y.find(D=>D.id===$())??y[0]:null},ne=async y=>{var F;const D=await S(()=>kn({kind:"pool",name:y}));return D?(s(`Pool “${y}” added — set its cash with the strip.`),U(((F=D.pool)==null?void 0:F.id)??null),await d(),!0):!1},te=async(y,D)=>{await S(()=>mr({pool_id:y,name:D}))&&(s(`Pool renamed to “${D}”.`),await d())},he=async y=>{await S(()=>En(y))&&(s("Pool deleted."),$()===y&&U(null),await d())},L=async(y,D)=>{var G;const F=await S(()=>ta(y,D));F&&(s(`Put moved to ${((G=F.position)==null?void 0:G.pool_name)??"the pool"}.`),await d())},k={busy:l,onDone:()=>o(null),onConfirmPut:N,onConfirmCall:M,onAssign:P},[B,A]=O("lots"),V=()=>[{id:"lots",label:"Lots",count:m().length,sub:`${m().reduce((y,D)=>y+D.shares,0)} sh held`},{id:"puts",label:"Puts",count:h().length,sub:`${h().filter(y=>y.view.pace_met).length} pace-met`},{id:"calls",label:"Calls",count:g().length,sub:`${g().filter(y=>y.view.spot_pct_vs_strike>0).length} ITM`}],K=()=>[...b()].sort((y,D)=>_(D)-_(y)),z=()=>[...I()].sort((y,D)=>_(D)-_(y)),ce={lots:{label:"+ New lot",type:"addLot"},puts:{label:"+ Sell put",type:"addPut"},calls:{label:"+ Sell call",type:"addCall"}},Fe={lots:"No recorded lots — assignments land here.",puts:"No open puts — press “+ Sell put” to record one.",calls:"No open calls — press “+ Sell call” to record one."},se=y=>{if(y==="lots")return f(E,{get when(){return m().length>0},get fallback(){return(()=>{var F=ti();return u(F,()=>Fe.lots),F})()},get children(){var F=Sh();return u(F,f(ie,{get each(){return m()},children:G=>f(Lh,{lot:G,dialogFor:w,busy:l,onSellDialog:Q=>o({type:"sellCall",lot:Q}),onDialogDone:()=>o(null),onSellCall:(Q,_e)=>T(_e,`Sold ${_e.symbol} ${_e.strike}C ×${_e.contracts} — Refresh marks to price.`)})})),F}});const D=y==="puts"?K():z();return f(E,{get when(){return D.length>0},get fallback(){return(()=>{var F=ti();return u(F,()=>Fe[y]),F})()},get children(){var F=kh();return F.firstChild,u(F,f(ie,{each:D,children:G=>f(Mh,{x:G,get showPool(){return x().length>1},get pools(){return x()},onPoolChange:L,dialogFor:w,dialogActions:k,onClose:Q=>o({type:Q.p.kind,pos:Q.p})})}),null),F}})},ke=y=>f(E,{get when(){var D,F,G;return y==="lots"&&((D=a())==null?void 0:D.type)==="addLot"||y==="puts"&&((F=a())==null?void 0:F.type)==="addPut"||y==="calls"&&((G=a())==null?void 0:G.type)==="addCall"},keyed:!0,get children(){return y==="lots"?f(Fh,{busy:l,onDone:()=>o(null),onAdd:D=>T(D,`Recorded ${D.shares} sh ${D.symbol}.`)}):f(Uh,{kind:y==="puts"?"put":"call",get pools(){return x()},busy:l,onDone:()=>o(null),onAdd:D=>T(D,`Sold ${D.symbol} ${D.strike}${y==="puts"?"P":"C"} ×${D.contracts} — Refresh marks to price.`)})}}),Be=y=>(()=>{var D=Ih(),F=D.firstChild;return F.$$click=()=>o({type:ce[y].type}),u(F,()=>ce[y].label),u(D,f(E,{when:y==="lots",get children(){var G=Eh(),Q=G.firstChild;return u(G,()=>m().reduce((_e,re)=>_e+re.shares,0),Q),G}}),null),D})(),st=()=>(()=>{var y=Ch();return y.$$click=C,v(()=>y.disabled=l()),y})(),at=()=>f(E,{get when(){return n()},get children(){var y=Th();return u(y,n),y}});return(()=>{var y=Ah(),D=y.firstChild,F=D.firstChild;F.firstChild;var G=F.nextSibling,Q=G.firstChild,_e=Q.firstChild;return u(F,f(Oh,{get cash(){var re;return((re=t())==null?void 0:re.cash)??null},get reserved(){var re;return((re=t())==null?void 0:re.cash_reserved)??0},get free(){var re;return((re=t())==null?void 0:re.cash_free)??null},get pools(){return x()},get pool(){return W()},busy:l,onSaveCash:R,onSelectPool:U,onAddPool:ne,onRenamePool:te,onDeletePool:he}),null),u(F,f(ie,{get each(){return V()},children:re=>(()=>{var Vt=Ph(),dr=Vt.firstChild,hr=dr.nextSibling,Ss=hr.nextSibling;return Vt.$$click=()=>A(re.id),u(dr,()=>re.label.toUpperCase()),u(hr,()=>re.count),u(Ss,()=>re.sub),v(()=>Vt.classList.toggle("active",B()===re.id)),Vt})()}),null),u(_e,()=>V().find(re=>re.id===B()).label),u(Q,st,null),u(G,at,null),u(G,()=>Be(B()),null),u(G,()=>ke(B()),null),u(G,()=>se(B()),null),y})()}ve(["input","keydown","click"]);async function Gh(t,e){let n;try{n=t.body.getReader()}catch{return"lost"}const r=new TextDecoder;let i="";try{for(;;){const{done:s,value:a}=await n.read();if(s)break;i+=r.decode(a,{stream:!0});let o;for(;(o=i.indexOf(`
+`))>=0;){const l=i.slice(0,o).replace(/\r$/,"");if(i=i.slice(o+1),!l.startsWith("data:"))continue;const c=l.slice(5).trim();if(c)try{e(JSON.parse(c))}catch{}}}return"completed"}catch{return"lost"}}var qh=p("<button type=button class=run-btn>"),Kh=p("<span class=run-count>/"),Jh=p("<span class=run-bar><span class=fill>"),Yh=p("<li><span class=mark></span><span class=label>"),Xh=p("<div class=toast-cached>Served from cache — last run <!> min old"),Qh=p('<div class="toast-cached warn">'),Zh=p("<div class=run-headline>"),ef=p("<ul class=run-stages>"),tf=p("<details class=run-errors><summary>details</summary><ul>"),nf=p("<div class=run-warn>Closing this tab stops the run."),rf=p("<div class=run-warn>Re-checking every 15 s…"),sf=p("<div class=run-strip>"),af=p("<li> ");const ys=["quotes","metrics","chains_short","chains_medium"],vs={quotes:"Quotes",metrics:"Indicators",chains_short:"Chains · 5-day",chains_medium:"Chains · 20-day"},of=15e3,ws=t=>t!==null&&Date.now()>=t;function ni(t){const e=Math.floor(t/60),n=t%60;return`${e}:${String(n).padStart(2,"0")}`}function lf(t){const[e,n]=O("idle"),[r,i]=O(T()),[s,a]=O(null),[o,l]=O(0),[c,d]=O(null),[h,g]=O(null),[m,b]=O("");let I=null,_=null;const[w,S]=O(0);let C=null;et(()=>{const L=t();if(C&&(clearTimeout(C),C=null),(L==null?void 0:L.run_allowed)===!1){const k=fn(L.next_open_utc);k!==null&&(C=setTimeout(()=>S(B=>B+1),Math.max(0,k-Date.now())))}});function T(){return Object.fromEntries(ys.map(L=>[L,{status:"pending",error:null}]))}function P(){I&&clearInterval(I),I=null,_&&clearInterval(_),_=null}function N(){l(0),I=setInterval(()=>l(L=>L+1),1e3)}function M(L){switch(L.type){case"stage_started":i(k=>({...k,[L.stage]:{status:"running",error:null}}));break;case"batch_done":a({stage:L.stage,done:L.done,total:L.total});break;case"stage_finished":i(k=>({...k,[L.stage]:{status:L.ok?"ok":"failed",error:L.error??null}}));break;case"run_finished":d(L);break}}function R(){P();const L=c(),k=((L==null?void 0:L.stages)??[]).some(B=>B.name.startsWith("chains")&&["ok","partial"].includes(B.status));n(L&&(k||L.ok)?"done":"failed"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"))}async function x(L){let k=!1;return await Gh(L,B=>{M(B),B.type==="run_finished"&&(k=!0)}),k?(R(),!0):!1}async function $(L){n("detached"),_=setInterval(async()=>{var k,B,A;try{const V=await hi(),K=((B=(k=V==null?void 0:V.result)==null?void 0:k.run)==null?void 0:B.finished_at_utc)??null;if(K&&K!==L){i(U(V.result)),P(),n("done"),window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));return}((A=V==null?void 0:V.run_state)==null?void 0:A.status)!=="running"&&(P(),n("idle"),b("Stream lost and the run was canceled — press Run to retry."))}catch{}},of)}function U(L){const k=T();for(const B of(L==null?void 0:L.stages)??[])k[B.name]&&(k[B.name]={status:B.status,error:B.error});return k}async function W(){var A,V,K;if(["starting","running","detached"].includes(e()))return;b(""),d(null),a(null),i(T()),g(null);const L=((K=(V=(A=t())==null?void 0:A.result)==null?void 0:V.run)==null?void 0:K.finished_at_utc)??null;n("running"),N();let k;try{k=await Qs()}catch{P(),n("idle"),b("Run failed to start — network or server unreachable.");return}const B=k.headers.get("content-type")??"";if(k.ok&&B.includes("application/json")){const z=await k.json().catch(()=>null);if(P(),n("idle"),(z==null?void 0:z.status)==="cached"){g(z.age_secs),setTimeout(()=>g(null),6e3);return}}if(k.status===403&&B.includes("application/json")){const z=await k.json().catch(()=>null);P(),n("idle"),b(z!=null&&z.next_open_utc?`Off-market runs are hourly — the next unlocks at ${new Date(z.next_open_utc).toLocaleString()}.`:"Off-market runs are hourly — try again after the next hour mark.");return}if(k.status===202){const z=await Zs();if(z.ok&&(z.headers.get("content-type")??"").includes("text/event-stream")){await x(z)||await $(L);return}await $(L);return}if(B.includes("text/event-stream")){await x(k)||await $(L);return}P(),n("idle"),b(`Unexpected /api/run response (${k.status}, ${B||"no type"}).`)}return Oe(()=>{P(),C&&clearTimeout(C)}),{phase:e,stageStates:r,batch:s,elapsedSecs:o,terminal:c,cachedToast:h,notice:m,triggerRun:W,isBusy:()=>["starting","running","detached"].includes(e()),runAllowed:()=>{w();const L=t();return(L==null?void 0:L.run_allowed)!==!1?!0:ws(fn(L==null?void 0:L.next_open_utc))},nextOpenUtc:()=>{var L;return((L=t())==null?void 0:L.next_open_utc)??null}}}function cf(t){const e=()=>!t.run.runAllowed(),n=()=>ds(t.run.nextOpenUtc()),r=()=>t.run.phase()==="running"?"Run…":t.run.phase()==="detached"?"Run in progress":e()?n()?`Run at ${n()}`:"Run locked":"▶ Run pipeline";return(()=>{var i=qh();return i.$$click=()=>t.run.triggerRun(),u(i,r),v(s=>{var a=t.run.isBusy()||e(),o=e()&&t.run.nextOpenUtc()?`Off-market runs are hourly — next unlocks at ${new Date(t.run.nextOpenUtc()).toLocaleString()}`:void 0;return a!==s.e&&(i.disabled=s.e=a),o!==s.t&&ee(i,"title",s.t=o),s},{e:void 0,t:void 0}),i})()}function uf(t){const e=()=>{const i=t.run.stageStates()[t.name].status;return i==="pending"?"pending":i==="running"?"active":i},n=()=>({ok:"✓",partial:"△",failed:"✗",active:"◦",pending:"·"})[e()],r=()=>{const i=t.run.batch();return i&&i.stage===t.name&&e()==="active"?Math.round(i.done/Math.max(i.total,1)*100):null};return(()=>{var i=Yh(),s=i.firstChild,a=s.nextSibling;return u(s,n),u(a,()=>vs[t.name]),u(i,f(E,{get when(){return r()!==null},get children(){return[(()=>{var o=Kh(),l=o.firstChild;return u(o,()=>t.run.batch().done,l),u(o,()=>t.run.batch().total,null),o})(),(()=>{var o=Jh(),l=o.firstChild;return v(c=>tt(l,"width",`${r()}%`)),o})()]}}),null),v(()=>ue(i,`run-stage ${e()}`)),i})()}function df(t){const e=t.run,n=()=>e.terminal(),r=()=>{if(e.phase()==="detached")return"Stream lost — the run continues server-side and will be saved. Re-checking…";if(e.phase()==="running"&&!n())return["Running pipeline · elapsed ",Y(()=>ni(e.elapsedSecs()))];if(n()){const s=(n().stages??[]).some(a=>a.name.startsWith("chains")&&["ok","partial"].includes(a.status));return s&&n().ok?["Run finished ✓ · ",Y(()=>ni(Math.round(n().duration_secs)))]:s?"Run finished △ · what succeeded is shown below":"Run finished ✗ · nothing produced — retry allowed"}return""};return f(E,{get when(){return["running","detached"].includes(e.phase())||n()||e.cachedToast()||e.notice()},get children(){var i=sf();return u(i,f(E,{get when(){return e.cachedToast()},get children(){var s=Xh(),a=s.firstChild,o=a.nextSibling;return o.nextSibling,u(s,()=>Math.floor(e.cachedToast()/60),o),s}}),null),u(i,f(E,{get when(){return e.notice()},get children(){var s=Qh();return u(s,()=>e.notice()),s}}),null),u(i,f(E,{get when(){return["running","detached"].includes(e.phase())||n()},get children(){return[(()=>{var s=Zh();return u(s,r),s})(),(()=>{var s=ef();return u(s,()=>ys.map(a=>f(uf,{name:a,run:e}))),s})(),f(E,{get when(){return Y(()=>!!n())()&&(n().stages??[]).some(s=>s.status!=="ok")},get children(){var s=tf(),a=s.firstChild,o=a.nextSibling;return u(o,()=>(n().stages??[]).filter(l=>l.status!=="ok").map(l=>(()=>{var c=af(),d=c.firstChild;return u(c,()=>l.status==="partial"?"△":"✗",d),u(c,()=>vs[l.name]??l.name,null),u(c,(()=>{var h=Y(()=>!!l.error);return()=>h()?`: ${l.error}`:""})(),null),c})())),s}})]}}),null),u(i,f(E,{get when(){return Y(()=>e.phase()==="running")()&&!n()},get children(){return nf()}}),null),u(i,f(E,{get when(){return e.phase()==="detached"},get children(){return rf()}}),null),i}})}ve(["click"]);var $s=p("<b>"),hf=p("<span>Market closed · last run <b></b> ago"),ff=p("<div class=cache-line><span></span><span class=pill>run: "),gf=p("<span>Cached · <b></b> left"),pf=p("<span>Stale · last run <b></b> ago"),mf=p("<nav class=tabs role=tablist aria-label=timeframes>"),_f=p("<button type=button role=tab class=tab>"),bf=p("<svg><circle cx=12 cy=12 r=4></svg>",!1,!0,!1),yf=p('<svg><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></svg>',!1,!0,!1),vf=p('<button type=button class="btn-ghost theme-toggle"><svg width=14 height=14 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'),wf=p('<svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></svg>',!1,!0,!1),$f=p('<button type=button class="btn-ghost user-pill"aria-haspopup=menu><svg width=13 height=13 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx=12 cy=7 r=4></circle></svg><span class=user-email></span><span class=user-caret aria-hidden=true>▾'),Sf=p("<div class=pop-backdrop>"),kf=p("<div class=account-menu role=menu aria-label=account><div class=acct-label>Signed in as</div><div class=acct-email></div><button type=button class=btn-ghost role=menuitem>Manage access</button><button type=button class=btn-ghost role=menuitem>Sign out"),Ef=p("<div class=error-banner>API error: "),If=p("<div class=shell><header><div class=user-box></div><div class=theme-slot-head></div><h1 class=brand><span class=brand-mark>Market<span class=brand-accent>Int</span></span><span class=brand-sub>Put-Selling Candidates</span></h1><div class=run-slot-head>"),Cf=p("<div class=hero><h2>No run yet</h2><p>Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop bands / Sharpe / percentiles, then score every in-range put strike across the universe. A full run typically takes 4–7 minutes and streams live progress right here.</p><p class=muted-note>Demo data: point <code>webapp_result_file</code> (or <code>--result-file</code>) at <code>crates/webapp/fixtures/sample_last_run.json</code>.");function Tf(){const[t,e]=O(Pu()),n=r=>{e(r),Ru(r)};return{visible:t,isOn:r=>t().includes(r),toggle:(r,i)=>n(i?[...t(),r]:t().filter(s=>s!==r)),reset:()=>n(Et)}}function ri(t,e){var r;const n=(r=t==null?void 0:t.stages)==null?void 0:r.find(i=>i.name===e);return n&&n.status==="failed"?n.error??"failed":void 0}function Af(t,e){var r,i,s;const n=(i=(r=t())==null?void 0:r.timeframes)==null?void 0:i[e];return((s=n==null?void 0:n.rows)==null?void 0:s.length)??(n==null?void 0:n.row_count)??0}function ii(t){const e=Math.floor(t/60);if(e<60)return`${e} min`;const n=Math.floor(e/60),r=e%60;return r?`${n} h ${r} min`:`${n} h`}function Fn(t){return f(E,{get when(){return t.at()},get children(){return[" ","· run ",(()=>{var e=$s();return u(e,()=>t.at()),e})()]}})}function Pf(t){const[e,n]=O(0);gt(()=>{const m=setInterval(()=>n(b=>b+1),3e4);Oe(()=>clearInterval(m))});let r=Date.now(),i=0;et(Ct(()=>t.envelope,m=>{r=Date.now(),i=(m==null?void 0:m.age_secs)??0}));const s=()=>(e(),i+Math.floor((Date.now()-r)/1e3)),a=()=>t.envelope.cache_state,o=()=>t.envelope.market_open===!1,l=()=>{const m=Math.max(0,(t.envelope.cache_secs??0)-s());return m>=60?`${Math.floor(m/60)}m`:`${m}s`},c=()=>{var m,b;return Wu((b=(m=t.envelope.result)==null?void 0:m.run)==null?void 0:b.finished_at_utc)},d=()=>{e();const m=t.envelope.next_open_utc,b=fn(m);if(!(b===null||ws(b)))return ds(m)},h=()=>o()&&a()==="stale"?"closed":a(),g=()=>a()==="fresh"||a()==="stale";return(()=>{var m=ff(),b=m.firstChild,I=b.nextSibling;return I.firstChild,u(m,f(E,{get when(){return Y(()=>!!o())()&&g()},get fallback(){return f(E,{get when(){return a()==="fresh"},get fallback(){return f(E,{get when(){return a()==="stale"},get children(){var _=pf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,()=>ii(s())),u(_,f(Fn,{at:c}),null),_}})},get children(){var _=gf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,l),u(_,f(Fn,{at:c}),null),_}})},get children(){var _=hf(),w=_.firstChild,S=w.nextSibling;return S.nextSibling,u(S,()=>ii(s())),u(_,f(Fn,{at:c}),null),u(_,f(E,{get when(){return d()},get children(){return[" ","· next run ",(()=>{var C=$s();return u(C,d),C})()]}}),null),_}}),b),u(b,(()=>{var _=Y(()=>h()==="closed");return()=>_()?"market closed":a()})()),u(I,()=>{var _;return((_=t.envelope.run_state)==null?void 0:_.status)??"idle"},null),v(()=>ue(b,"pill "+h())),m})()}function si(t){const e=[{id:"short",label:"Short · 5-day"},{id:"medium",label:"Medium · 20-day"},{id:"holdings",label:"Holdings",holdings:!0}];return(()=>{var n=mf();return u(n,()=>e.map(r=>(()=>{var i=_f();return i.$$click=()=>t.onTab(r.id),u(i,()=>r.label,null),u(i,(()=>{var s=Y(()=>!r.holdings);return()=>s()&&` (${It(Af(t.result,r.id))})`})(),null),v(s=>{var a=t.tab()===r.id,o=t.tab()===r.id;return a!==s.e&&ee(i,"aria-selected",s.e=a),o!==s.t&&i.classList.toggle("active",s.t=o),s},{e:void 0,t:void 0}),i})())),n})()}function Rf(){const[t,e]=O(null),n=()=>window.matchMedia("(prefers-color-scheme: dark)").matches,r=()=>t()??(n()?"dark":"light"),i=()=>{const a=r()==="dark"?"light":"dark";document.documentElement.dataset.theme=a,e(a)},s=()=>r()==="dark"?"Switch to light theme":"Switch to dark theme";return(()=>{var a=vf(),o=a.firstChild;return a.$$click=i,u(o,f(E,{get when(){return r()==="dark"},get fallback(){return wf()},get children(){return[bf(),yf()]}})),v(l=>{var c=s(),d=s();return c!==l.e&&ee(a,"aria-label",l.e=c),d!==l.t&&ee(a,"title",l.t=d),l},{e:void 0,t:void 0}),a})()}function xf(){const[t,e]=O(void 0),[n,{refetch:r}]=Rs(t,w=>w?hi():void 0);gt(()=>{if(!_t){e(null);return}const w=Ul(lt(),e);Oe(w)});const[i,s]=O(!1);et(Ct(t,w=>{s(!1),!(!w||!_t)&&Ks().then(S=>s(S.status===403)).catch(()=>{})})),gt(()=>{const w=()=>r();window.addEventListener("webapp:refresh-latest",w),Oe(()=>window.removeEventListener("webapp:refresh-latest",w))});const a=()=>{var w,S;return((w=t())==null?void 0:w.email)||((S=t())==null?void 0:S.uid)||""},[o,l]=O(!1),[c,d]=O(!1),h=Tf(),[g,m]=O("short"),b=()=>g()==="holdings",I=Cu(),_=lf(()=>n());return f(E,{get when(){return t()},get fallback(){return f(du,{})},get children(){return[f(E,{get when(){return!i()},get fallback(){return f(uu,{get email(){return a()},onSignOut:()=>Kr()})},get children(){var w=If(),S=w.firstChild,C=S.firstChild,T=C.nextSibling,P=T.nextSibling,N=P.nextSibling;return u(C,f(E,{get when(){return t()},get children(){return[(()=>{var M=$f(),R=M.firstChild,x=R.nextSibling;return M.$$click=()=>l(!o()),u(x,a),v(()=>ee(M,"aria-expanded",o())),M})(),f(E,{get when(){return o()},get children(){return[(()=>{var M=Sf();return M.$$click=()=>l(!1),M})(),(()=>{var M=kf(),R=M.firstChild,x=R.nextSibling,$=x.nextSibling,U=$.nextSibling;return u(x,a),$.$$click=()=>{l(!1),d(!0)},U.$$click=()=>{l(!1),Kr()},M})()]}})]}})),u(T,f(Rf,{})),u(S,f(E,{get when(){return Y(()=>!n.loading)()&&!n.error},get children(){return f(Pf,{get envelope(){return n()}})}}),N),u(N,f(cf,{run:_})),u(w,f(E,{get when(){return n.error},get children(){var M=Ef();return M.firstChild,u(M,()=>n.error.message,null),M}}),null),u(w,f(df,{run:_}),null),u(w,f(E,{get when(){return b()},get children(){return[f(si,{result:()=>{var M;return(M=n())==null?void 0:M.result},tab:g,onTab:m}),f(zh,{})]}}),null),u(w,f(E,{get when(){return!b()},get children(){return f(E,{get when(){var M;return Y(()=>!n.loading)()&&((M=n())==null?void 0:M.result)},get fallback(){return f(E,{get when(){return!n.loading},get children(){return Cf()}})},children:M=>{const R=()=>M();return[f(Au,{scoring:I}),f(si,{result:R,tab:g,onTab:m}),f(ei,{id:"short",active:()=>g()==="short",get tf(){var x;return(x=R().timeframes)==null?void 0:x.short},get stageError(){return ri(R(),"chains_short")},get stages(){return R().stages},get thresholds(){return R().thresholds},columns:h,scoring:I}),f(ei,{id:"medium",active:()=>g()==="medium",get tf(){var x;return(x=R().timeframes)==null?void 0:x.medium},get stageError(){return ri(R(),"chains_medium")},get stages(){return R().stages},get thresholds(){return R().thresholds},columns:h,scoring:I})]}})}}),null),w}}),f(E,{get when(){return c()},get children(){return f(_u,{onClose:()=>d(!1)})}})]}})}ve(["click"]);js(()=>f(xf,{}),document.getElementById("root"));
diff --git a/crates/webapp/frontend/src/components/HoldingsPanel.jsx b/crates/webapp/frontend/src/components/HoldingsPanel.jsx
index 16c21a8..1362ce6 100644
--- a/crates/webapp/frontend/src/components/HoldingsPanel.jsx
+++ b/crates/webapp/frontend/src/components/HoldingsPanel.jsx
@@ -281,9 +281,14 @@ function PoolRow(props) {
   );
 }
 
+const SPOT_SESSION_LABELS = { PreMarket: "pre", AfterHours: "post", OverNight: "overnight" };
+
 function LotRailRow(props) {
   const l = props.lot;
   const v = () => l.view;
+  // The headline price IS the latest known price (extended-hours R3/R4):
+  // when the mark names a source session, a small muted tag says which one
+  // (e.g. `overnight` on a weekend). No tag = the regular-session price.
   return (
     <div class="hp-slot">
       <div class="hp-lot-row">
@@ -291,7 +296,12 @@ function LotRailRow(props) {
           <span>
             {l.shares} sh {l.symbol}
           </span>
-          <b>{v().spot == null ? "—" : money2(v().spot)}</b>
+          <b>
+            {v().spot == null ? "—" : money2(v().spot)}
+            <Show when={SPOT_SESSION_LABELS[l.mark?.session]}>
+              {(label) => <i class="hp-spot-session">{label()}</i>}
+            </Show>
+          </b>
         </div>
         <div class="hp-lot-row-sub">
           <span>
diff --git a/crates/webapp/frontend/src/smoke-entry.jsx b/crates/webapp/frontend/src/smoke-entry.jsx
index 90dbfa8..6cd1427 100644
--- a/crates/webapp/frontend/src/smoke-entry.jsx
+++ b/crates/webapp/frontend/src/smoke-entry.jsx
@@ -886,6 +886,71 @@ ok("reset restores production view", qa("#root " + rowsSel).length === 1);
   ok("tab strip routes to holdings and back", holdingsSelected && tab() === "short");
 }
 
+// ── extended-hours R4: the headline IS the latest price ──
+// One mount, two lots: one priced at the latest close with a source
+// session (AfterHours), one plain (regular mark). Asserts the headline
+// shows the latest price with its session tag, and that plain lots render
+// exactly as before with no session line anywhere.
+{
+  const HP = (await import("./components/HoldingsPanel")).default;
+  const LOT_EXT = {
+    id: "l-ext", symbol: "AAPL", shares: 100, basis_per_share: 231.4,
+    acquired: "2026-08-12",
+    mark: {
+      spot: 249.5, as_of: "2026-09-08T22:00:00Z",
+      pre: { price: 251.2, time: "2026-09-08T13:15:00Z" },
+      post: { price: 249.5, time: "2026-09-08T19:59:00Z" },
+      session: "AfterHours",
+    },
+    view: {
+      value: 24950.0, pl_dollars: 1810.0, pl_pct: 1810 / 23140,
+      capacity: 1, covered: 0, spot: 249.5,
+      spot_as_of: "2026-09-08T22:00:00Z", age_days: 0,
+    },
+  };
+  const LOT_PLAIN = {
+    ...LOT_EXT,
+    id: "l-plain",
+    mark: { spot: 249.87, as_of: "2026-09-08T15:00:00Z" },
+    view: {
+      ...LOT_EXT.view,
+      value: 24987.0, pl_dollars: 1847.0, pl_pct: 1847 / 23140, spot: 249.87,
+    },
+  };
+  const extLedger = {
+    schema_version: 1, positions: [], calls: [],
+    lots: [LOT_EXT, LOT_PLAIN], cash: null, cash_pools: [],
+  };
+  globalThis.fetch = async () =>
+    new Response(JSON.stringify(extLedger), {
+      status: 200,
+      headers: { "Content-Type": "application/json" },
+    });
+  const div = document.createElement("div");
+  div.id = "ext-root";
+  document.body.appendChild(div);
+  render(() => <HP />, div);
+  await tick();
+  const rows = qa("#ext-root .hp-lot-row");
+  ok("two lot rows render", rows.length === 2);
+  const head = rows[0]?.querySelector(".hp-lot-row-top b");
+  ok(
+    "headline shows the latest price tagged with its source session",
+    !!head && head.textContent.includes("$249.50") &&
+      head.querySelector(".hp-spot-session")?.textContent === "post"
+  );
+  ok(
+    "no per-session line remains anywhere",
+    !document.querySelector("#ext-root .hp-lot-row-ext")
+  );
+  const plainHead = rows[1]?.querySelector(".hp-lot-row-top b");
+  ok(
+    "plain lot shows the regular price with no tag",
+    !!plainHead && plainHead.textContent.includes("$249.87") &&
+      !plainHead.querySelector(".hp-spot-session")
+  );
+}
+
 console.log(JSON.stringify({ total: checks.length }));
 let failedCount = 0;
 for (const [name, passed] of checks) {
diff --git a/crates/webapp/frontend/src/style.css b/crates/webapp/frontend/src/style.css
index c4933ed..9b18210 100644
--- a/crates/webapp/frontend/src/style.css
+++ b/crates/webapp/frontend/src/style.css
@@ -1403,6 +1403,13 @@ details.adjust .hint-custom { color: var(--accent); }
   margin-top: 0.1rem;
 }
 .hp-lot-row-sub b { font-variant-numeric: tabular-nums; }
+.hp-spot-session {
+  font-style: normal;
+  font-weight: 400;
+  font-size: 0.68rem;
+  color: var(--muted);
+  margin-left: 0.3rem;
+}
 .hp-lot-row-meta {
   display: flex;
   justify-content: space-between;
diff --git a/crates/webapp/src/api.rs b/crates/webapp/src/api.rs
index 4dd83d8..a2b20da 100644
--- a/crates/webapp/src/api.rs
+++ b/crates/webapp/src/api.rs
@@ -382,11 +382,13 @@ mod tests {
             holdings_dir: path.with_file_name("holdings"),
             mark_fetcher: Arc::new(
                 |_: &[crate::holdings::MarkRequest],
-                 _: &[String]|
+                 _: &[String],
+                 _: crate::holdings::MarketSession|
                  -> crate::holdings::MarkBatch {
                     crate::holdings::MarkBatch {
                         marks: Vec::new(),
                         spots: Default::default(),
+                ext: Default::default(),
                     }
                 },
             ),
@@ -535,7 +537,7 @@ mod tests {
         let path = dir.path().join("last_run.json");
         let shared = crate::run::SharedState::new();
         shared.begin().expect("acquire");
-        let app = build_router(AppState { result_path: path, holdings_dir: PathBuf::from("holdings"), mark_fetcher: Arc::new(|_: &[crate::holdings::MarkRequest], _: &[String]| crate::holdings::MarkBatch { marks: Vec::new(), spots: Default::default() }), shared, access: Default::default(), clock: crate::run::real_now });
+        let app = build_router(AppState { result_path: path, holdings_dir: PathBuf::from("holdings"), mark_fetcher: Arc::new(|_: &[crate::holdings::MarkRequest], _: &[String], _: crate::holdings::MarketSession| crate::holdings::MarkBatch { marks: Vec::new(), spots: Default::default(), ext: Default::default() }), shared, access: Default::default(), clock: crate::run::real_now });
 
         let response = app
             .oneshot(axum::http::Request::builder().uri("/api/latest").body(Body::empty()).unwrap())
diff --git a/crates/webapp/src/auth.rs b/crates/webapp/src/auth.rs
index adc8d66..e2728bb 100644
--- a/crates/webapp/src/auth.rs
+++ b/crates/webapp/src/auth.rs
@@ -372,10 +372,11 @@ mod tests {
                     result_path: std::path::PathBuf::from("/tmp/none.json"),
                     holdings_dir: std::path::PathBuf::from("/tmp/holdings"),
                     mark_fetcher: std::sync::Arc::new(
-                        |_: &[crate::holdings::MarkRequest], _: &[String]| {
+                        |_: &[crate::holdings::MarkRequest], _: &[String], _: crate::holdings::MarketSession| {
                             crate::holdings::MarkBatch {
                                 marks: Vec::new(),
                                 spots: Default::default(),
+                ext: Default::default(),
                             }
                         },
                     ),
diff --git a/crates/webapp/src/holdings.rs b/crates/webapp/src/holdings.rs
index e0bbca4..26dfb29 100644
--- a/crates/webapp/src/holdings.rs
+++ b/crates/webapp/src/holdings.rs
@@ -36,13 +36,61 @@ pub struct MarkResult {
     pub underlying: Option<f64>,
 }
 
+/// Which US-equity session an instant falls in (ET wall clock; Blue-Ocean
+/// overnight 20:00–04:00 ET, no Friday- or Saturday-night session — the
+/// live probe showed Friday 20:00+ returns no overnight bars). A clock
+/// heuristic, not a trading calendar: half-days and holidays read as the
+/// regular schedule.
+#[derive(Debug, Clone, Copy, PartialEq, Eq)]
+pub(crate) enum MarketSession {
+    PreMarket,
+    Regular,
+    AfterHours,
+    OverNight,
+    /// Weekend daytime (and Friday night) — nothing active to emphasize,
+    /// extended data still fetched and shown.
+    Closed,
+}
+
+/// Classify an instant by the ET wall clock (extended-hours R3).
+fn et_market_session(now: DateTime<Utc>) -> MarketSession {
+    use chrono::Datelike;
+    use chrono::Timelike;
+    use chrono::Weekday::*;
+    use chrono_tz::America::New_York;
+    let et = now.with_timezone(&New_York);
+    let minutes = et.hour() * 60 + et.minute();
+    match et.weekday() {
+        Sat => MarketSession::Closed,
+        Sun if minutes >= 20 * 60 => MarketSession::OverNight,
+        Sun => MarketSession::Closed,
+        Fri if minutes >= 20 * 60 => MarketSession::Closed,
+        _ if (4 * 60..9 * 60 + 30).contains(&minutes) => MarketSession::PreMarket,
+        _ if (9 * 60 + 30..16 * 60).contains(&minutes) => MarketSession::Regular,
+        _ if (16 * 60..20 * 60).contains(&minutes) => MarketSession::AfterHours,
+        _ => MarketSession::OverNight, // 20:00–24:00 Mon–Thu and 00:00–04:00 Tue–Fri
+    }
+}
+
 /// The fetcher's whole outcome: option marks by request id, plus the
 /// per-symbol underlying closes the same kline pass produced. Lots price
 /// from `spots` — chain queries are never issued for lot symbols (R5).
+/// `ext` carries the extended-session closes per lot symbol (empty until
+/// the closed-session fetch merges them, extended-hours R3).
 #[derive(Debug)]
 pub struct MarkBatch {
     pub marks: Vec<MarkResult>,
     pub spots: std::collections::BTreeMap<String, f64>,
+    pub ext: std::collections::BTreeMap<String, SessionQuotes>,
+}
+
+/// One lot symbol's extended-session closes, assembled from the per-session
+/// kline calls. A session whose call failed or returned no bars is `None`.
+#[derive(Debug)]
+pub struct SessionQuotes {
+    pub pre: Option<market_int_core::model::ExtQuote>,
+    pub post: Option<market_int_core::model::ExtQuote>,
+    pub overnight: Option<market_int_core::model::ExtQuote>,
 }
 
 /// Seam (Runner precedent): production constructs ONE Tiger requester per
@@ -50,7 +98,7 @@ pub struct MarkBatch {
 /// lists lot symbols so the same kline pass prices them into `spots`.
 /// Tests script per-symbol outcomes with no network.
 pub type MarkFetcher =
-    Arc<dyn Fn(&[MarkRequest], &[String]) -> MarkBatch + Send + Sync>;
+    Arc<dyn Fn(&[MarkRequest], &[String], MarketSession) -> MarkBatch + Send + Sync>;
 
 /// Production fetcher: one Tiger requester per refresh call, one underlying
 /// kline per unique symbol across option AND lot symbols, then a
@@ -60,17 +108,21 @@ pub type MarkFetcher =
 /// minimum 0: we want *our* strike, not liquid ones. Blocking by design —
 /// the refresh handler parks it on `spawn_blocking`.
 pub fn live_fetcher() -> MarkFetcher {
-    Arc::new(move |requests: &[MarkRequest], lot_symbols: &[String]| {
-        fetch_marks_blocking(requests.to_vec(), lot_symbols.to_vec())
+    Arc::new(move |requests: &[MarkRequest], lot_symbols: &[String], session: MarketSession| {
+        fetch_marks_blocking(requests.to_vec(), lot_symbols.to_vec(), session)
     })
 }
 
-fn fetch_marks_blocking(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> MarkBatch {
+fn fetch_marks_blocking(
+    requests: Vec<MarkRequest>,
+    lot_symbols: Vec<String>,
+    session: MarketSession,
+) -> MarkBatch {
     let runtime = tokio::runtime::Builder::new_current_thread()
         .enable_all()
         .build();
     match runtime {
-        Ok(rt) => rt.block_on(fetch_marks(requests, lot_symbols)),
+        Ok(rt) => rt.block_on(fetch_marks(requests, lot_symbols, session)),
         Err(e) => MarkBatch {
             marks: requests
                 .into_iter()
@@ -81,11 +133,16 @@ fn fetch_marks_blocking(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) ->
                 })
                 .collect(),
             spots: Default::default(),
+                ext: Default::default(),
         },
     }
 }
 
-async fn fetch_marks(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> MarkBatch {
+async fn fetch_marks(
+    requests: Vec<MarkRequest>,
+    lot_symbols: Vec<String>,
+    session: MarketSession,
+) -> MarkBatch {
     use std::collections::BTreeSet;
 
     let Some(requester) =
@@ -104,6 +161,7 @@ async fn fetch_marks(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> Ma
                 })
                 .collect(),
             spots: Default::default(),
+                ext: Default::default(),
         };
     };
 
@@ -138,6 +196,16 @@ async fn fetch_marks(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> Ma
         .map(|(symbol, &close)| (symbol.clone(), close))
         .collect();
 
+    // Extended-session closes, best-effort and only outside Regular: one
+    // 1-minute kline call per extended session for the deduped lot symbols
+    // (option symbols never get extended calls). A failed or empty session
+    // costs only its own segments.
+    let ext = if session != MarketSession::Regular && !lot_symbols.is_empty() {
+        fetch_session_quotes(&requester, &lot_symbols).await
+    } else {
+        Default::default()
+    };
+
     let mut marks = Vec::with_capacity(requests.len());
     for r in requests {
         let Some(&spot) = underlyings.get(&r.symbol) else {
@@ -170,7 +238,52 @@ async fn fetch_marks(requests: Vec<MarkRequest>, lot_symbols: Vec<String>) -> Ma
             underlying: Some(spot),
         });
     }
-    MarkBatch { marks, spots }
+    MarkBatch { marks, spots, ext }
+}
+
+/// One 1-minute kline call per extended session for the lot symbols,
+/// folded into per-symbol `SessionQuotes`. A session whose call fails or
+/// returns no bars leaves its slot `None` (extended-hours R3).
+async fn fetch_session_quotes(
+    requester: &market_int_core::tiger::api_caller::Requester,
+    lot_symbols: &[String],
+) -> std::collections::BTreeMap<String, SessionQuotes> {
+    let mut out: std::collections::BTreeMap<String, SessionQuotes> = lot_symbols
+        .iter()
+        .map(|s| {
+            (
+                s.clone(),
+                SessionQuotes {
+                    pre: None,
+                    post: None,
+                    overnight: None,
+                },
+            )
+        })
+        .collect();
+    let refs: Vec<&str> = lot_symbols.iter().map(|s| s.as_str()).collect();
+    for (name, slot) in [
+        ("PreMarket", 0u8),
+        ("AfterHours", 1u8),
+        ("OverNight", 2u8),
+    ] {
+        match requester.query_session_closes(&refs, name).await {
+            Ok(closes) => {
+                for (symbol, quote) in closes {
+                    if let Some(entry) = out.get_mut(&symbol) {
+                        match slot {
+                            0 => entry.pre = Some(quote),
+                            1 => entry.post = Some(quote),
+                            _ => entry.overnight = Some(quote),
+                        }
+                    }
+                }
+            }
+            Err(e) => log::warn!("holdings: extended closes for {name} failed: {e}"),
+        }
+    }
+    out.retain(|_, q| q.pre.is_some() || q.post.is_some() || q.overnight.is_some());
+    out
 }
 
 // The chain query is async and must run on the same runtime as the kline
@@ -623,10 +736,25 @@ fn covered_contracts(doc: &HoldingsDocument, symbol: &str) -> u32 {
 
 fn lot_json(l: &market_int_core::holdings::ShareLot, today: chrono::NaiveDate, covered: u32) -> serde_json::Value {
     let mark = l.mark.as_ref().map(|m| {
-        json!({
+        // Extended-hours fields ride additively (absent when None, matching
+        // the persisted document's skip_serializing_if shape).
+        let mut mark = json!({
             "spot": m.spot,
             "as_of": m.as_of.to_rfc3339_opts(chrono::SecondsFormat::Secs, true),
-        })
+        });
+        if let Some(pre) = &m.pre {
+            mark["pre"] = json!(pre);
+        }
+        if let Some(post) = &m.post {
+            mark["post"] = json!(post);
+        }
+        if let Some(overnight) = &m.overnight {
+            mark["overnight"] = json!(overnight);
+        }
+        if let Some(session) = &m.session {
+            mark["session"] = json!(session);
+        }
+        mark
     });
     let mut v = json!({
         "id": l.id,
@@ -1487,8 +1615,12 @@ pub(crate) async fn holdings_refresh(
     };
     // Tiger is a blocking HTTP client — park the whole batch off the async
     // workers (read_document_off_thread precedent).
+    // The session gates the extended-hours fetch and merge (extended-hours
+    // R3) — classified once, from the injected clock.
+    let session = et_market_session((st.clock)());
     let fetcher = st.mark_fetcher.clone();
-    let batch = tokio::task::spawn_blocking(move || fetcher(&requests, &lot_symbols))
+    let batch =
+        tokio::task::spawn_blocking(move || fetcher(&requests, &lot_symbols, session))
         .await
         .expect("spawn_blocking mark fetch");
 
@@ -1569,11 +1701,51 @@ pub(crate) async fn holdings_refresh(
 
     // Lots price from the spot map — a lot whose symbol is missing from it
     // (kline failed, say) is stale with a reason and keeps its previous
-    // SpotMark.
+    // SpotMark. Extended fields follow the session gate: a Regular-session
+    // refresh clears them (data captured in an earlier closed session is
+    // stale once the market opens); otherwise the present session closes
+    // merge in, with `session` naming the active one (None when nothing is).
     for lot in &mut doc.lots {
         match batch.spots.get(&lot.symbol) {
             Some(&spot) => {
-                lot.mark = Some(market_int_core::holdings::SpotMark { spot, as_of: now });
+                // Latest known price (user decision, preview feedback): the
+                // chronologically newest extended close — the session cycle
+                // pre → regular → post → overnight makes bar time the
+                // truth — falling back to the regular close when no
+                // extended data survived. A Regular-session refresh clears
+                // extended data entirely (stale once the market opens).
+                let ext = if session == MarketSession::Regular {
+                    None
+                } else {
+                    batch.ext.get(&lot.symbol)
+                };
+                let (pre, post, overnight) = match ext {
+                    Some(q) => (q.pre.clone(), q.post.clone(), q.overnight.clone()),
+                    None => (None, None, None),
+                };
+                let session_name = ext.and_then(|q| {
+                    [
+                        q.pre.as_ref().map(|quote| (quote, "PreMarket")),
+                        q.post.as_ref().map(|quote| (quote, "AfterHours")),
+                        q.overnight.as_ref().map(|quote| (quote, "OverNight")),
+                    ]
+                    .into_iter()
+                    .flatten()
+                    .max_by_key(|(quote, _)| quote.time)
+                    .map(|(quote, name)| (quote.price, name.to_string()))
+                });
+                let (spot, session_name) = match session_name {
+                    Some((price, name)) => (price, Some(name)),
+                    None => (spot, None),
+                };
+                lot.mark = Some(market_int_core::holdings::SpotMark {
+                    spot,
+                    as_of: now,
+                    pre,
+                    post,
+                    overnight,
+                    session: session_name,
+                });
                 ok.push(lot.id.clone());
             }
             None => stale.push((
@@ -1745,6 +1917,10 @@ mod store_tests {
                 mark: Some(market_int_core::holdings::SpotMark {
                     spot: 370.0,
                     as_of,
+                    pre: None,
+                    post: None,
+                    overnight: None,
+                    session: None,
                 }),
                 pool_id: Some("p1".to_string()),
             }],
@@ -1885,7 +2061,7 @@ mod tests {
     }
 
     fn goog_fetcher(mid: f64) -> MarkFetcher {
-        Arc::new(move |requests: &[MarkRequest], _lots: &[String]| MarkBatch {
+        Arc::new(move |requests: &[MarkRequest], _lots: &[String], _session: MarketSession| MarkBatch {
             marks: requests
                 .iter()
                 .map(|r| MarkResult {
@@ -1895,9 +2071,300 @@ mod tests {
                 })
                 .collect(),
             spots: Default::default(),
+                ext: Default::default(),
+        })
+    }
+
+    // ── Extended-hours quotes: feature-acceptance E2E ──────────────
+    // Design doc `## Feature acceptance`, verbatim: a closed-session
+    // refresh persists pre/post/overnight + session on the lot mark (the
+    // extended line's data); a pre-feature ledger document loads and
+    // renders exactly as before, then gains the line after one refresh;
+    // a quote call failing entirely keeps every previous mark and reports
+    // stale without a rewrite.
+
+    /// 2026-09-08 22:00 UTC = 18:00 ET, a Tuesday evening — post-market.
+    fn frozen_after_hours() -> DateTime<Utc> {
+        chrono::NaiveDate::from_ymd_opt(2026, 9, 8)
+            .unwrap()
+            .and_hms_opt(22, 0, 0)
+            .unwrap()
+            .and_utc()
+    }
+
+    fn test_state_clock(dir: &std::path::Path, fetcher: MarkFetcher, clock: fn() -> DateTime<Utc>) -> AppState {
+        AppState {
+            result_path: dir.join("last_run.json"),
+            holdings_dir: dir.join("holdings"),
+            mark_fetcher: fetcher,
+            shared: crate::run::SharedState::new(),
+            access: Default::default(),
+            clock,
+        }
+    }
+
+    fn aapl_ext_fetcher(closed: bool) -> MarkFetcher {
+        Arc::new(move |requests: &[MarkRequest], _lots: &[String], _session: MarketSession| {
+            if !closed {
+                return MarkBatch {
+                    marks: requests
+                        .iter()
+                        .map(|r| MarkResult {
+                            id: r.id.clone(),
+                            mid: Ok(Some(2.5)),
+                            underlying: Some(250.42),
+                        })
+                        .collect(),
+                    spots: std::collections::BTreeMap::from([("AAPL".to_string(), 250.42)]),
+                    ext: Default::default(),
+                };
+            }
+            let ext = std::collections::BTreeMap::from([(
+                "AAPL".to_string(),
+                SessionQuotes {
+                    pre: Some(market_int_core::model::ExtQuote {
+                        price: 251.2,
+                        time: chrono::DateTime::parse_from_rfc3339("2026-09-08T13:15:00Z")
+                            .unwrap()
+                            .into(),
+                    }),
+                    post: Some(market_int_core::model::ExtQuote {
+                        price: 250.05,
+                        time: chrono::DateTime::parse_from_rfc3339("2026-09-08T19:59:00Z")
+                            .unwrap()
+                            .into(),
+                    }),
+                    overnight: None,
+                },
+            )]);
+            MarkBatch {
+                marks: requests
+                    .iter()
+                    .map(|r| MarkResult {
+                        id: r.id.clone(),
+                        mid: Ok(Some(2.5)),
+                        underlying: Some(249.87),
+                    })
+                    .collect(),
+                spots: std::collections::BTreeMap::from([("AAPL".to_string(), 249.87)]),
+                ext,
+            }
         })
     }
 
+    /// Old-format ledger document: no extended fields anywhere (a
+    /// pre-feature write), single lot with a regular mark.
+    fn write_pre_feature_ledger(dir: &std::path::Path, uid: &str) {
+        let holdings_dir = dir.join("holdings");
+        std::fs::create_dir_all(&holdings_dir).unwrap();
+        std::fs::write(
+            holdings_dir.join(format!("{uid}.json")),
+            r#"{"schema_version":1,"positions":[],"lots":[{"id":"lot-old","symbol":"AAPL","shares":100,"basis_per_share":231.4,"acquired":"2026-08-12","mark":{"spot":249.87,"as_of":"2026-09-08T15:00:00Z"}}]}"#,
+        )
+        .unwrap();
+    }
+
+    #[tokio::test]
+    async fn feature_acceptance_extended_hours_quotes() {
+        let dir = tempfile::tempdir().unwrap();
+
+        // ── Scenario 1: refresh during a closed session persists the
+        // extended data alongside the regular spot.
+        write_pre_feature_ledger(dir.path(), "test-uid");
+        let app = crate::api::build_router(test_state_clock(
+            dir.path(),
+            aapl_ext_fetcher(true),
+            frozen_after_hours,
+        ));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "closed-session refresh: {v}");
+        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
+        assert_eq!(v["refresh"]["stale"].as_array().unwrap().len(), 0);
+
+        let app = crate::api::build_router(test_state_clock(
+            dir.path(),
+            aapl_ext_fetcher(true),
+            frozen_after_hours,
+        ));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        let mark = &v["lots"][0]["mark"];
+        assert_eq!(
+            mark["spot"], 250.05,
+            "spot = the chronologically latest close (post, 19:59)"
+        );
+        assert_eq!(mark["session"], "AfterHours", "session names the source");
+        assert_eq!(mark["pre"]["price"], 251.2);
+        assert_eq!(mark["post"]["price"], 250.05);
+        assert!(mark["overnight"].is_null(), "symbol has no overnight data");
+        // Value and P&L follow the latest price.
+        assert_eq!(v["lots"][0]["view"]["value"], 25005.0);
+        assert_eq!(v["lots"][0]["view"]["pl_dollars"], 1865.0);
+        // The additive fields persist to the ledger document.
+        let file = std::fs::read_to_string(dir.path().join("holdings/test-uid.json")).unwrap();
+        assert!(file.contains("\"session\""), "session persisted: {file}");
+        assert!(file.contains("\"post\""), "post persisted: {file}");
+
+        // ── Scenario 2: a fresh pre-feature document loads and renders
+        // exactly as before (no extended fields), then one closed-session
+        // refresh makes the line appear.
+        let dir2 = tempfile::tempdir().unwrap();
+        write_pre_feature_ledger(dir2.path(), "test-uid");
+        let app = crate::api::build_router(test_state_clock(
+            dir2.path(),
+            aapl_ext_fetcher(true),
+            frozen_after_hours,
+        ));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK, "old document loads: {v}");
+        let mark = &v["lots"][0]["mark"];
+        assert_eq!(mark["spot"], 249.87);
+        assert!(mark["pre"].is_null() && mark["post"].is_null() && mark["session"].is_null(),
+            "pre-feature mark has no extended fields: {mark}");
+
+        let app = crate::api::build_router(test_state_clock(
+            dir2.path(),
+            aapl_ext_fetcher(true),
+            frozen_after_hours,
+        ));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "refresh on old document: {v}");
+        let mark = &v["lots"][0]["mark"];
+        assert_eq!(mark["spot"], 250.05, "priced at the latest close");
+        assert_eq!(mark["session"], "AfterHours");
+
+        // ── Scenario 3: the quote call failing entirely keeps every
+        // previous mark, reports stale, and does not rewrite the ledger.
+        let dir3 = tempfile::tempdir().unwrap();
+        write_pre_feature_ledger(dir3.path(), "test-uid");
+        let app = crate::api::build_router(test_state_clock(
+            dir3.path(),
+            Arc::new(|_: &[MarkRequest], _lots: &[String], _session: MarketSession| MarkBatch {
+                marks: Vec::new(),
+                spots: Default::default(),
+                ext: Default::default(),
+            }),
+            frozen_after_hours,
+        ));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "failing refresh still 200: {v}");
+        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 0);
+        let stale = v["refresh"]["stale"].as_array().unwrap();
+        assert_eq!(stale.len(), 1, "the lot is reported stale: {v}");
+        assert_eq!(stale[0]["id"], "lot-old");
+        assert!(
+            stale[0]["reason"].as_str().is_some_and(|r| !r.is_empty()),
+            "stale carries a reason: {stale:?}"
+        );
+
+        let app = crate::api::build_router(test_state_clock(
+            dir3.path(),
+            aapl_ext_fetcher(true),
+            frozen_after_hours,
+        ));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        let mark = &v["lots"][0]["mark"];
+        assert_eq!(mark["spot"], 249.87, "previous mark kept");
+        assert_eq!(mark["as_of"], "2026-09-08T15:00:00Z", "mark untouched");
+        let file =
+            std::fs::read_to_string(dir3.path().join("holdings/test-uid.json")).unwrap();
+        assert!(
+            file.contains("2026-09-08T15:00:00Z"),
+            "all-stale pass must not rewrite the document: {file}"
+        );
+        assert!(!file.contains("\"session\""), "no extended data persisted: {file}");
+    }
+
+    /// 2026-09-12 (Saturday) 16:00 UTC = noon ET — weekend daytime.
+    fn frozen_weekend_noon() -> DateTime<Utc> {
+        chrono::NaiveDate::from_ymd_opt(2026, 9, 12)
+            .unwrap()
+            .and_hms_opt(16, 0, 0)
+            .unwrap()
+            .and_utc()
+    }
+
+    #[test]
+    fn et_market_session_classifies_the_week() {
+        use MarketSession::*;
+        use chrono::TimeZone;
+        let at = |d: u32, h: u32, mi: u32| {
+            Utc.with_ymd_and_hms(2026, 9, d, h, mi, 0).unwrap()
+        };
+        // Sept 2026 is EDT: ET = UTC − 4h. Tuesday the 8th:
+        assert_eq!(et_market_session(at(8, 7, 0)), OverNight, "03:00 ET");
+        assert_eq!(et_market_session(at(8, 8, 0)), PreMarket, "04:00 ET sharp");
+        assert_eq!(et_market_session(at(8, 13, 29)), PreMarket, "09:29 ET");
+        assert_eq!(et_market_session(at(8, 13, 30)), Regular, "09:30 ET sharp");
+        assert_eq!(et_market_session(at(8, 19, 59)), Regular, "15:59 ET");
+        assert_eq!(et_market_session(at(8, 20, 0)), AfterHours, "16:00 ET sharp");
+        assert_eq!(et_market_session(at(8, 23, 59)), AfterHours, "19:59 ET");
+        // Wednesday 00:00 UTC = Tuesday 20:00 ET — the overnight session.
+        assert_eq!(et_market_session(at(9, 0, 0)), OverNight);
+        // Friday night has no overnight session (live-probed: Friday 20:00+
+        // returns no OverNight bars).
+        assert_eq!(et_market_session(at(12, 0, 30)), Closed, "Fri 20:30 ET (Sat 00:30 UTC)");
+        // Saturday daytime and Sunday daytime stay closed.
+        assert_eq!(et_market_session(at(12, 16, 0)), Closed, "Sat noon ET");
+        assert_eq!(et_market_session(at(13, 16, 0)), Closed, "Sun noon ET");
+        // Sunday 20:00 ET opens the week's first overnight session.
+        assert_eq!(et_market_session(at(14, 0, 30)), OverNight, "Sun 20:30 ET");
+    }
+
+    /// A Regular-session refresh clears the extended fields even when the
+    /// scripted fetcher hands extended data back — the handler gates the
+    /// merge, so a pre-open line cannot linger into the trading day.
+    #[tokio::test]
+    async fn regular_session_refresh_clears_extended_fields() {
+        let dir = tempfile::tempdir().unwrap();
+        write_pre_feature_ledger(dir.path(), "test-uid");
+        let app = crate::api::build_router(test_state(dir.path(), aapl_ext_fetcher(true)));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "regular refresh: {v}");
+        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
+
+        let app = crate::api::build_router(test_state(dir.path(), aapl_ext_fetcher(true)));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        let mark = &v["lots"][0]["mark"];
+        assert_eq!(mark["spot"], 249.87, "regular spot intact");
+        assert!(
+            mark["pre"].is_null() && mark["post"].is_null() && mark["session"].is_null(),
+            "extended fields cleared on the regular session: {mark}"
+        );
+    }
+
+    /// Weekend daytime is a Closed session: extended data is fetched and
+    /// the lot prices at the latest close, tagged with its source session
+    /// (the fixture's newest close is post, 19:59).
+    #[tokio::test]
+    async fn closed_weekend_refresh_prices_at_latest_close() {
+        let dir = tempfile::tempdir().unwrap();
+        write_pre_feature_ledger(dir.path(), "test-uid");
+        let app = crate::api::build_router(test_state_clock(
+            dir.path(),
+            aapl_ext_fetcher(true),
+            frozen_weekend_noon,
+        ));
+        let (status, v) = call(app, "POST", "/api/holdings/refresh", None).await;
+        assert_eq!(status, StatusCode::OK, "weekend refresh: {v}");
+        assert_eq!(v["refresh"]["ok"].as_array().unwrap().len(), 1);
+
+        let app = crate::api::build_router(test_state_clock(
+            dir.path(),
+            aapl_ext_fetcher(true),
+            frozen_weekend_noon,
+        ));
+        let (status, v) = call(app, "GET", "/api/holdings", None).await;
+        assert_eq!(status, StatusCode::OK);
+        let mark = &v["lots"][0]["mark"];
+        assert_eq!(mark["pre"]["price"], 251.2, "all closes persist");
+        assert_eq!(mark["post"]["price"], 250.05);
+        assert_eq!(mark["spot"], 250.05, "latest close is the price");
+        assert_eq!(mark["session"], "AfterHours", "source session tagged");
+    }
+
     /// Design doc `## Feature acceptance`, verbatim: fresh ledger → add GOOG
     /// strike 350 (5 working days out, sold 2 working days ago, premium
     /// 1.00, 1 contract) → refresh reports 0.50 mid → card values
@@ -2187,7 +2654,7 @@ mod tests {
     async fn refresh_updates_marks() {
         let dir = tempfile::tempdir().unwrap();
         seed_two(dir.path());
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
             MarkBatch {
                 marks: reqs
                     .iter()
@@ -2201,6 +2668,7 @@ mod tests {
                     })
                     .collect(),
                 spots: Default::default(),
+                ext: Default::default(),
             }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
@@ -2232,7 +2700,7 @@ mod tests {
     async fn refresh_partial_failure_is_stale_not_error() {
         let dir = tempfile::tempdir().unwrap();
         seed_two(dir.path());
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
             MarkBatch {
                 marks: reqs
                     .iter()
@@ -2247,6 +2715,7 @@ mod tests {
                     })
                     .collect(),
                 spots: Default::default(),
+                ext: Default::default(),
             }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
@@ -2280,7 +2749,7 @@ mod tests {
     async fn refresh_missing_chain_data_is_stale() {
         let dir = tempfile::tempdir().unwrap();
         seed_two(dir.path());
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
             MarkBatch {
                 marks: reqs
                     .iter()
@@ -2295,6 +2764,7 @@ mod tests {
                     })
                     .collect(),
                 spots: Default::default(),
+                ext: Default::default(),
             }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
@@ -2347,7 +2817,7 @@ mod tests {
     #[tokio::test]
     async fn feature_acceptance_wheel_lifecycle() {
         let dir = tempfile::tempdir().unwrap();
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], lots: &[String]| {
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], lots: &[String], _session: MarketSession| {
             // Phase 1 (no lots yet): the put refresh — GOOG at 344.20.
             // Phase 2 (the lot exists): the call refresh — GOOG at 370.00
             // rides the spots map the lot prices from.
@@ -2371,7 +2841,7 @@ mod tests {
                     }
                 })
                 .collect();
-            MarkBatch { marks, spots }
+            MarkBatch { marks, spots, ext: Default::default() }
         });
 
         // Fresh ledger: nothing held anywhere, cash never set.
@@ -3277,9 +3747,10 @@ mod tests {
             r#"{"schema_version":1,"positions":[],"cash":80000.0}"#,
         )
         .unwrap();
-        let no_marks: MarkFetcher = Arc::new(|_r: &[MarkRequest], _l: &[String]| MarkBatch {
+        let no_marks: MarkFetcher = Arc::new(|_r: &[MarkRequest], _l: &[String], _session: MarketSession| MarkBatch {
             marks: vec![],
             spots: Default::default(),
+                ext: Default::default(),
         });
 
         // The legacy document reads as one implicit "Main" pool: 80,000
@@ -3489,7 +3960,7 @@ mod tests {
             Arc::new(std::sync::Mutex::new(None));
         let fetcher: MarkFetcher = {
             let seen = seen.clone();
-            Arc::new(move |reqs: &[MarkRequest], lots: &[String]| {
+            Arc::new(move |reqs: &[MarkRequest], lots: &[String], _session: MarketSession| {
                 *seen.lock().unwrap() = Some((
                     reqs.iter()
                         .map(|r| format!("{}:{:?}", r.symbol, r.side))
@@ -3499,6 +3970,7 @@ mod tests {
                 MarkBatch {
                     marks: Vec::new(),
                     spots: Default::default(),
+                ext: Default::default(),
                 }
             })
         };
@@ -3567,6 +4039,10 @@ mod tests {
                         mark: Some(market_int_core::holdings::SpotMark {
                             spot: 344.20,
                             as_of: frozen - chrono::Duration::hours(2),
+                            pre: None,
+                            post: None,
+                            overnight: None,
+                            session: None,
                         }),
                     },
                     market_int_core::holdings::ShareLot {
@@ -3579,6 +4055,10 @@ mod tests {
                         mark: Some(market_int_core::holdings::SpotMark {
                             spot: 100.0,
                             as_of: frozen - chrono::Duration::hours(2),
+                            pre: None,
+                            post: None,
+                            overnight: None,
+                            session: None,
                         }),
                     },
                 ],
@@ -3587,7 +4067,7 @@ mod tests {
         )
         .unwrap();
 
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
             MarkBatch {
                 marks: reqs
                     .iter()
@@ -3598,6 +4078,7 @@ mod tests {
                     })
                     .collect(),
                 spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
+                ext: Default::default(),
             }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
@@ -3951,7 +4432,7 @@ mod tests {
 
         let fetcher: MarkFetcher = {
             let ledger_dir = ledger_dir.clone();
-            Arc::new(move |reqs: &[MarkRequest], _lots: &[String]| {
+            Arc::new(move |reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
                 // Another request's mutation lands while "Tiger" is being
                 // queried: a fresh mark-less position joins the ledger.
                 let mut doc = read_ledger(&ledger_dir, "test-uid").unwrap();
@@ -3978,6 +4459,7 @@ mod tests {
                         })
                         .collect(),
                     spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
+                    ext: Default::default(),
                 }
             })
         };
@@ -4050,6 +4532,10 @@ mod tests {
                         mark: Some(market_int_core::holdings::SpotMark {
                             spot: 100.0,
                             as_of: frozen_today() - chrono::Duration::hours(2),
+                            pre: None,
+                            post: None,
+                            overnight: None,
+                            session: None,
                         }),
                     },
                 ],
@@ -4060,7 +4546,7 @@ mod tests {
 
         // The put's chain query fails; GOOT spot arrives for the GOOG lot;
         // NOPE's kline failed so it's missing from spots entirely.
-        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String]| {
+        let fetcher: MarkFetcher = Arc::new(|reqs: &[MarkRequest], _lots: &[String], _session: MarketSession| {
             MarkBatch {
                 marks: reqs
                     .iter()
@@ -4071,6 +4557,7 @@ mod tests {
                     })
                     .collect(),
                 spots: [("GOOG".to_string(), 370.0)].into_iter().collect(),
+                ext: Default::default(),
             }
         });
         let app = crate::api::build_router(test_state(dir.path(), fetcher));
diff --git a/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-design.md b/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-design.md
index 0993955..d8ee5f7 100644
--- a/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-design.md
+++ b/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-design.md
@@ -6,101 +6,100 @@ The webapp prices held share lots from regular-session kline closes only —
 during pre-market, post-market, or the overnight session a lot row keeps
 showing yesterday's regular close, because the Tiger client speaks only
 `kline`, `option_chain`, `option_expiration`, and `grab_quote_permission`.
-This design replaces the holdings refresh's per-symbol kline pass with ONE
-batched real-time `quote` call that returns, per symbol, the regular-session
-close, the live last price, the session status, and the extended
-pre/post/overnight sub-quotes together. The lot's `spot` and every view
-computed from it (P&L, pace, coverage) keep their meaning — anchored to the
-regular-session price in every session — and each lot row gains a compact
-extended-hours line, persisted only from closed-session refreshes and
-cleared during market hours.
+This design adds extended-hours retrieval through the **kline gateway's
+`trade_session` parameter** — live-verified against the production account
+on 2026-09-26: PreMarket / AfterHours / OverNight 1-minute bars all return
+under the current permissions. During a closed-session refresh, up to three
+batched 1-minute kline calls (one per extended session) yield each lot
+symbol's last session close, and the **chronologically latest of them
+becomes the lot's `spot`** — the one price on the row, tagged with the
+session it came from; every view number (value, P&L) follows it, exactly
+like a broker app showing the overnight price over the weekend. A
+market-hours refresh clears the extended data and prices from the live
+regular pass, as production does today.
 
 Key decisions:
 
-- **`spot` stays the regular-session price in every session; extended prices
-  are display-only** — during Regular hours it is the live last trade,
-  otherwise the response's regular close (yesterday's before the open,
-  today's after it); P&L/pace/coverage math keeps its meaning, and old
-  ledger JSON stays valid.
+- **`spot` is the latest known price (user decision 2026-09-26, "I just
+  want to see the latest price")** — during a closed session it is the
+  chronologically newest extended close (argmax by bar time); when the
+  market is open it is the live regular pass; value and P&L follow it, the
+  way a broker app prices shares over the weekend. Old ledger JSON stays
+  valid (the regular close simply reads as "latest" until the first
+  closed-session refresh). (Supersedes the original "spot stays the
+  regular close, display-only" decision.)
 - **Additive serde fields on `SpotMark`** (`pre`/`post`/`overnight`/`session`,
   `#[serde(default)]`) — the ADR-0002 "schema stays v1 by additive defaults"
   pattern; no migration.
-- **One batched `quote` call is the refresh's sole price source (user
-  decision 2026-09-26)** — it replaces the per-symbol kline pass entirely,
-  so the regular close, live price, session status, and extended sub-quotes
-  arrive together; the session gate becomes a persistence rule: during a
-  Regular session (Mon–Fri 09:30–16:00 America/New_York) extended fields are
-  cleared, and only closed-session refreshes persist them (rejected: fetch
-  on panel open —
-  puts network calls on the GET path the webapp deliberately keeps
-  network-free; rejected: extended-hours klines via `trade_session` —
-  documented on the official kline API but 1-minute-only, one session per
-  call, no session status, and the confirmed all-sessions display needs up
-  to three calls vs the quote endpoint's one).
-- **Lots only** — put/call rows keep their regular-close underlying; option
-  symbols are never quoted (YAGNI; assumption offered for correction; unopposed).
-- **All present sessions shown on the row, in-session one emphasized** —
-  matches "see all three" (assumption offered for correction; unopposed).
-- **Best-effort extended data** — a failed or missing quote never blanks or
-  breaks a row (assumption offered for correction; unopposed).
+- **Extended data comes from 1-minute klines via `trade_session`, gated on
+  the ET session clock (user decision 2026-09-26, pivoted from the
+  real-time `brief` snapshot when the portal priced it at USD 99/month plus
+  separate market-data fees)** — up to three batched calls per closed-
+  session refresh, one per extended session, taking each symbol's last bar
+  as the session price. The kline pass for the regular spot is untouched.
+  (Rejected: the `brief` snapshot — paywalled for this account, whose
+  permissions list `aStockQuoteLv1` + `usOptionQuote` but no
+  `usQuoteBasic`; rejected: the free delayed snapshot — no extended-hours
+  fields at all; rejected: fetch on panel open — puts network calls on the
+  GET path the webapp deliberately keeps network-free.)
+- **Lots only** — put/call rows keep their regular-close underlying; only
+  lot symbols get extended-session calls (YAGNI; assumption offered for
+  correction; unopposed).
+- **One price, no session line** — the three-segment pre·post·overnight
+  line was removed after preview feedback ("showing pre post overnight is
+  confusing"); the row shows the latest price tagged with its source
+  session, and nothing else. The per-session closes stay persisted
+  (schema, future use) but are not displayed.
+- **Best-effort extended data** — a failed or missing session price never
+  blanks or breaks a row (assumption offered for correction; unopposed).
 
 | R# | Requirement in one line | Risk |
 |----|-------------------------|------|
-| R1 | Tiger `quote` gateway method returns per-symbol regular close, latest price, session status and extended sub-quotes | ⚠ production-risk |
+| R1 | Tiger kline `trade_session` retrieval returns each symbol's last close per extended session | ⚠ production-risk |
 | R2 | `SpotMark` carries extended quotes as additive, backward-compatible ledger fields | — |
-| R3 | Refresh prices all marks from one batched quote call; extended fields merge only from closed-session refreshes | ⚠ production-risk |
-| R4 | Lot row renders an extended-hours line with deltas and in-session emphasis | — |
+| R3 | Refresh fetches extended closes only in closed sessions and prices lots at the latest | ⚠ production-risk |
+| R4 | Lot row shows one price — the latest — tagged with its source session | — |
 
 ## Requirements
 
-### R1: Tiger quote gateway method and parser
+### R1: Extended-hours kline retrieval (trade_session)
 
 `crates/core/src/tiger/api_caller.rs` gains
-`query_stock_quote(&self, symbols: &[&str]) -> Result<Vec<StockQuote>, RequestError>`
-posting gateway method `quote` (default version, `include_hour_trading: true`
-in `biz_content`; responses cap symbols per request, so callers chunk above
-the limit), parsed by a pure `parse_stock_quote` function into per-symbol
-domain types: `StockQuote { symbol, session: Option<String>, latest:
-Option<f64>, regular_close: Option<f64>, pre: Option<ExtQuote>, post:
-Option<ExtQuote>, overnight: Option<ExtQuote> }` with
-`ExtQuote { price: f64, time: DateTime<Utc> }` (types in `model.rs`).
-`session` carries Tiger's `currentStatus` verbatim (e.g. `PreMarket`,
-`Regular`, `AfterHours`, `Overnight`). The official docs show the snapshot
-carries both a regular close (`close`, "close price" — distinct from
-`preClose`, "close price of last trading day") and a live last price
-(`latestPrice`), plus extended data (`hourTrading` tag, or the
-`preMarketQuote`/`postMarketQuote`/`overnightQuote` sub-objects); the exact
-live field names and per-session semantics are pinned by the probe before
-the hermetic fixture is trusted. A `test-quote` CLI arm (mirroring
-`test-tiger`) prints the raw live response once.
+`query_session_closes(&self, symbols: &[&str], trade_session: &str) ->
+Result<Vec<(String, model::ExtQuote)>, RequestError>`: a 1-minute kline
+request per symbol chunk (`period: "1min"`, small `limit`,
+`trade_session: PreMarket | AfterHours | OverNight`, batched at the
+documented 50-symbol cap), returning per symbol the **last bar's close and
+timestamp** as `ExtQuote { price, time }` — the session's latest trade.
+Symbols whose response item has no bars are simply absent from the result.
+The live response shape is already verified by probe (AAPL returned bars
+for all three sessions on 2026-09-26); the hermetic tests use that shape
+(`data: [{symbol, period, items: [{close, time, …}]}]`).
 
 **Acceptance criteria**
-- Given a captured live quote response body, When `parse_stock_quote` runs, Then it produces the symbol's session status, regular close, latest price, and each present session sub-quote as `ExtQuote { price, time }`, with absent pieces `None`.
-- Given a response where a session sub-quote is missing or unparsable, When parsed, Then that session is `None` and the other fields survive (no all-or-nothing).
-- Given a live Tiger account, When `market_int test-quote AAPL` runs during a closed session and again during regular hours, Then the raw response JSON shows which field holds the regular close and which holds the extended price, and the parser reads exactly those fields.
-- Given more symbols than the response's per-request cap, When `query_stock_quote` runs, Then requests are chunked and every symbol comes back.
-- Given a gateway error response (`code != 0`) or non-200 status, When `query_stock_quote` runs, Then the error surfaces as `RequestError` like the other query methods.
+- Given a captured kline response body for a session, When the parse runs, Then it yields one `(symbol, ExtQuote)` per symbol with items, the price being the **last** item's close and the time its timestamp.
+- Given a response item with an empty or missing `items` array, When parsed, Then that symbol is absent from the result and other symbols survive.
+- Given more symbols than the request cap, When `query_session_closes` runs, Then requests are chunked and every symbol comes back.
+- Given a gateway error response (`code != 0`), non-200 status, or unreachable gateway, When `query_session_closes` runs, Then the error surfaces as `RequestError` like the other query methods.
 
 ### Checkpoints: none
 ### Review: skip
 
 ### Production-risk notes
-- External API: the `quote` method's live response shape is not yet verified —
-  R1's probe criterion must pass before the hermetic fixture is trusted.
-  Quotes may be `delayed` per the account's permission tier; that is reported
-  as-is, not compensated for.
-- The per-session meaning of the snapshot's close/latest fields
-  (regular-anchored vs active-tape) is the central unverified fact; the
-  probe must run during a closed session AND during regular hours before
-  the baseline rule is trusted.
+- External API: consumes the Historical — Stocks/ETF quota (500/period on
+  this account, 266 already used) — up to three calls per closed-session
+  refresh, negligible against the pipeline's own draw but not zero.
 
 ### R2: Additive ledger fields on SpotMark
 
 `SpotMark` in `crates/core/src/holdings.rs` grows optional fields —
 `pre`, `post`, `overnight: Option<ExtQuote>` and `session: Option<String>` —
-all `#[serde(default)]`. The regular-close `spot` field and every view
-computed from it are unchanged. Existing per-UID ledger documents deserialize
-unchanged.
+all `#[serde(default, skip_serializing_if = "Option::is_none")]`. The
+`spot` field keeps its role as the one price the views compute from — its
+SOURCE widens (latest extended close during closed sessions, regular close
+otherwise). `session` names the source session of `spot` (`None` = the
+regular pass). Existing per-UID ledger documents deserialize unchanged and
+re-serialize byte-equivalently.
 
 **Acceptance criteria**
 - Given a `SpotMark` serialized before this change, When deserialized, Then it round-trips with all four new fields `None`.
@@ -110,107 +109,118 @@ unchanged.
 ### Checkpoints: none
 ### Review: skip
 
-### R3: Refresh prices all marks from one batched quote call; extended fields merge only from closed-session refreshes
+### R3: Refresh fetches extended closes only in closed sessions and merges them into lot marks
 
 A pure `et_market_session` helper (webapp, driven by the injected clock)
-classifies the current instant: Regular inside Mon–Fri 09:30–16:00
-America/New_York, Closed otherwise (pre-market, post-market, overnight,
-weekends, holidays). `POST /api/holdings/refresh` makes ONE batched
-`query_stock_quote` call for the union of option and lot symbols — the
-kline pass is gone from the refresh path (the pipeline's quotes stage is
-untouched). Per symbol, the quote's regular-session price becomes the
-underlying for the chain moneyness filter, the `Mark.underlying_price`, and
-the lot's `spot`: the live last price during a Regular session, otherwise
-the regular close (yesterday's before the open, today's after it). The
-`MarkBatch` seam gains `ext: BTreeMap<String, StockQuote>`. Extended fields
-follow the session gate as a persistence rule: a Regular-session refresh
-clears every lot's extended fields (data captured in an earlier closed
-session is stale once the market opens), a Closed-session refresh merges
-each present `StockQuote`'s pre/post/overnight into that lot's `SpotMark`.
-A failed, missing, or unparsable extended quote leaves the lot's regular
-mark intact and the row rendering without extended data; it is reported
-stale only if the lot would otherwise be unmarked.
+classifies the current instant into `MarketSession`: `PreMarket`
+(weekdays 04:00–09:30 ET), `Regular` (weekdays 09:30–16:00 ET),
+`AfterHours` (weekdays 16:00–20:00 ET), `OverNight` (20:00–04:00 ET),
+`Closed` otherwise (weekend daytime). `POST /api/holdings/refresh` computes
+the session, passes it to the fetcher (the `MarkFetcher` seam gains a
+`MarketSession` parameter), and gates on it:
+
+- **Regular**: the fetcher makes no extended calls (`ext` empty) and the
+  handler clears every lot's extended fields and `session` — data captured
+  in an earlier closed session is stale once the market opens, and `spot`
+  prices from the live regular pass. Everything else behaves exactly as
+  production today (kline pass → chain moneyness filter, option marks, lot
+  spots).
+- **Closed (PreMarket / AfterHours / OverNight / Closed)**: the fetcher
+  additionally issues up to three batched `query_session_closes` calls
+  (PreMarket, AfterHours, OverNight) for the **deduped lot symbols only**
+  and assembles `ext: BTreeMap<String, SessionQuotes>` (`SessionQuotes {
+  pre, post, overnight: Option<ExtQuote> }`); the handler prices the lot's
+  `spot` at the **chronologically latest** present `ExtQuote` (max bar
+  time — the session cycle pre → regular → post → overnight makes bar
+  time the truth), persists all three closes, and stores `session` = that
+  source session's name. With no extended data the lot falls back to the
+  regular close with `session: None`.
+
+A failed or empty extended session never blanks a regular mark: the lot
+keeps its `spot`, the affected segments render as absent, and the pass is
+reported stale only if the lot would otherwise be unmarked. The existing
+per-symbol kline failure isolation is untouched.
 
 **Acceptance criteria**
-- Given any session, When refresh runs, Then exactly one batched quote call covers the union of option and lot symbols (no kline call) and the chain moneyness filter, `Mark.underlying_price`, and lot `spot` all come from its regular-session price.
-- Given the ET clock on a weekday between 09:30 and 16:00, When refresh runs, Then every lot's extended fields are cleared (None) — an extended line captured pre-open disappears after the open.
-- Given the ET clock outside weekday 09:30–16:00 (evening, pre-open, or weekend), When refresh runs, Then each lot's persisted `SpotMark` carries the returned session and pre/post/overnight values.
-- Given the quote call failing entirely (transport error), When refresh runs, Then every position is reported stale with the reason, keeps its previous mark, and the request does not error.
-- Given a symbol absent from the quote response, When refresh merges, Then positions on that symbol are reported stale with a precise reason and keep their previous marks.
-- Given a lot whose regular price is missing from the response but whose extended data is present, When refresh merges, Then the lot is reported stale for spot and the extended data is not persisted without a regular mark.
+- Given the ET clock inside weekday 09:30–16:00, When refresh runs, Then no extended-kline calls are made and every lot's extended fields are cleared (None) — an extended line captured pre-open disappears after the open.
+- Given the ET clock outside weekday 09:30–16:00, When refresh runs with lots, Then up to three batched extended-session calls cover the deduped lot symbols (never option symbols), and each lot's `spot` is priced at the chronologically latest present close with `session` naming its source session (all three closes persisted).
+- Given the ET clock on weekend daytime, When refresh runs, Then `spot` prices at the overnight (or newest available) close with `session` naming that source — the row's one price is current all weekend.
+- Given one extended-session call failing (or returning no bars for a symbol), When refresh merges, Then that session's close is simply absent from the latest-price selection, every regular mark stays intact, and the request does not error.
+- Given a lot symbol absent from the underlying kline pass, When refresh runs in a closed session, Then the lot is reported stale and no extended data is persisted without a regular mark.
+- Given a refresh that prices nothing, When it completes, Then the ledger file is not rewritten (existing no-create/no-rewrite property).
 
 ### Checkpoints: none
 ### Review: skip
 
 ### Production-risk notes
-- External API: the refresh now depends on ONE batched call — a transport
-  failure stales the whole book for that pass (today a per-symbol kline
-  failure stales only that symbol); per-symbol isolation starts at the
-  parser. Rate-limit and permission behavior of the `quote` method are
-  assumed equivalent to kline (same grab-permission gate at requester init)
-  — verify during the R1 probe.
+- External API: quota draw doubles at most on a closed-session refresh
+  (regular pass + up to three extended calls); per-symbol failure isolation
+  is preserved (each session call failing costs only its own segments).
 - Concurrency/batch: the merge follows the existing re-read-after-fetch and
-  merge-by-id rules; extended data never clobbers a position added while the
-  fetch was in flight.
-- The session gate is a clock heuristic, not a trading calendar: on market
-  holidays between 09:30–16:00 extended fields are cleared (correct —
-  nothing trades), and a half-day early close hides that afternoon's
-  post-market session until 16:00 ET. Accepted.
+  merge-by-id rules; extended data never clobbers a position added while
+  the fetch was in flight.
+- The session classifier is a clock heuristic, not a trading calendar: on
+  market holidays between 09:30–16:00 extended fields are cleared (correct
+  — nothing trades), a half-day early close hides that afternoon's
+  post-market session until 16:00 ET, and the overnight window is treated
+  as 20:00–04:00 ET every night. Accepted.
 
-### R4: Lot row extended-hours line
+### R4: Lot row shows the latest price, tagged
 
 `LotRailRow` in `crates/webapp/frontend/src/components/HoldingsPanel.jsx`
-renders, between the bought line and the meta line, one extended-hours
-segment per present session in fixed order (pre · post · overnight): label,
-price (`money2`), and delta vs the regular close as a signed percentage
-reusing the `holdings-pos`/`holdings-neg` sign classes. The segment matching
-the stored `session` gets an emphasized class. When no extended data is
-present the line is not rendered. One new CSS class, colors from the
-existing token block only.
+keeps its existing layout but the headline price is now the latest known
+price (`spot` semantics per R3): a small muted tag after the price names
+its source session (`PreMarket` → pre, `AfterHours` → post, `OverNight` →
+overnight) whenever `mark.session` is set. No session line, no per-session
+segments, no deltas beyond the existing P&L line. The row is byte-identical
+to production when `session` is absent.
 
 **Acceptance criteria**
-- Given a lot with pre and post quotes and session `AfterHours`, When the panel renders, Then the row shows `pre <price> <±pct> · post <price> <±pct>` with the post segment emphasized and no overnight segment.
-- Given a lot with no extended fields, When the panel renders, Then the row is exactly as before this feature (no empty line).
-- Given a refresh that ran during a Regular session, When the panel renders, Then lot rows show no extended line (extended fields were cleared at merge).
-- Given a delta against a regular close, When either the session price or the close is missing, Then the affected segment is omitted rather than rendered with a blank.
+- Given a lot whose mark carries `session: "OverNight"` (spot = the overnight close), When the panel renders, Then the headline shows the overnight price followed by a small `overnight` tag.
+- Given a lot with no `session` on its mark, When the panel renders, Then the row is exactly as before this feature (no tag, no extra line).
+- Given a refresh that ran during a Regular session, When the panel renders, Then no tag appears (extended fields were cleared at merge; spot = the live regular price).
 
 ### Checkpoints: none
 ### Review: skip
 
 ## Production-risk areas
 
-- **External API (Tiger `quote` method)**: live response shape — including
-  which field carries the regular close during extended sessions —,
-  permission tier, and rate-limit posture unverified until the R1 probe
-  runs; delayed quotes are possible; the whole refresh now hangs off one
-  batched call. Reflected in R1 and R3 notes.
+- **External API (Tiger kline `trade_session`)**: response shape
+  live-verified 2026-09-26; the Historical quota draw grows by up to three
+  calls per closed-session refresh; the overnight calendar is approximated
+  by a clock heuristic. Reflected in R1 and R3 notes.
 - **Ledger schema**: additive serde defaults only (ADR-0002) — no migration;
   R2 pins backward compatibility.
 
 ## Approaches considered
 
-- **Tiger `quote` gateway method through the refresh seam (chosen)** — one
-  batched call carries all three session sub-quotes plus session status;
-  reuses `execute_query`, the `MarkBatch` seam, and the additive-schema
-  pattern. Smallest surface that answers the need.
-- **Extended-hours klines (`trade_session` parameter) — lost**: documented
-  on the official kline API (`trade_session`: PreMarket / Regular /
-  AfterHours, Regular by default; OverNight added in SDK 3.4.5, 2025-08) —
-  but pre/post/overnight data is 1-minute klines only, the parameter takes
-  one session per call, so the confirmed all-sessions row display needs up
-  to three batched calls per refresh, and the response carries no session
-  status (the clock heuristic would have to stand in for Tiger's). The
-  `quote` endpoint returns all three session sub-quotes plus status in one
-  batched call. The timeline endpoint has the same per-session shape.
+- **Extended-hours klines (`trade_session` parameter) — chosen (2026-09-26
+  pivot)**: documented on the official kline API (`trade_session`:
+  PreMarket / Regular / AfterHours; OverNight added in SDK 3.4.5, 2025-08)
+  and **live-verified against the production account**: all three sessions
+  returned real 1-minute bars (Friday post close 19:59 ET, Friday pre close
+  09:29 ET, Saturday 04:00 ET overnight close) under the existing
+  permissions. Costs: one call per session per refresh (three batched calls
+  to show all sessions), no session status from Tiger (the ET clock
+  classifier stands in), and a small draw on the Historical quota.
+- **Real-time `brief` snapshot — lost on cost (was chosen earlier the same
+  day)**: the gateway method resolves (probed: `quote` itself is not a
+  supported method name), but the account's permission list holds
+  `aStockQuoteLv1` + `usOptionQuote` and **no `usQuoteBasic`** — the
+  snapshot needs it, and the developer portal prices it behind a USD
+  99/month plan with market data billed separately. The free delayed
+  snapshot (`get_stock_delay_briefs`, no permission) carries no
+  extended-hours fields at all. All snapshot work was removed; git history
+  retains it should the permission ever be bought.
 - **Fetch extended quotes when the panel opens — lost**: puts network calls
   on the GET/view path the webapp deliberately keeps network-free, adds a
   caching question, and diverges from every other mark whose freshness is
   "as of the last refresh".
-- **Quote every refresh regardless of session — lost** (superseded by user
-  direction): during a Regular session the extended sub-quotes hold nothing
-  useful — the regular spot already arrives live from the existing kline /
-  chain passes — so the call would be pure overhead. The session gate skips
-  it; a Regular-session refresh instead clears extended fields so stale
+- **Quote every refresh regardless of session — lost**: during a Regular
+  session the extended sessions hold nothing useful — the regular spot
+  already arrives from the existing kline pass — so extended calls would be
+  pure overhead against the Historical quota. The session gate skips them;
+  a Regular-session refresh instead clears extended fields so stale
   pre-open data can't linger on the row.
 - **Take the underlying price from the option chain response instead of the
   kline pass — lost for now**: the chain parser currently sources
@@ -219,73 +229,61 @@ existing token block only.
   chain-covered symbols during market hours. But the field's presence is
   unverified, the kline pass must still exist for lot-only symbols (no call
   path disappears entirely), and the moneyness filter's input semantics
-  change. The R1 probe can verify the field; revisit as a follow-up if the
-  per-symbol saving matters.
-
-- **Quote snapshot as the sole price source (drop the kline pass) — adopted
-  by user decision (2026-09-26), reversing the initial call**: the snapshot
-  does carry the regular close alongside the extended prices — the official
-  docs show `close` ("close price") distinct from `preClose` ("close price
-  of last trading day") plus `latestPrice`, and Tiger's own quote page
-  displays the regular price and the post-market price simultaneously
-  (364.54 +0.52% with "Post-market: 366.12 +0.43% 19:59 EDT"). The original
-  objection — that the latest-price field might be active-tape-anchored
-  with no today-close field during post-market — is answered by the `close`
-  field, with the R1 probe pinning the live semantics before anything is
-  trusted and `preClose` as the documented fallback. Net effect: N
-  per-symbol kline calls become one batched call.
+  change. Revisit as a follow-up if the per-symbol saving matters.
 
 ## Architecture
 
 **Components.** Core: `model.rs` gains `ExtQuote`;
-`tiger/api_caller.rs` gains `query_stock_quote` + `parse_stock_quote`;
-`holdings.rs` `SpotMark` grows four additive fields. Webapp:
-`holdings.rs` `MarkBatch` gains the `ext` map; `fetch_marks` replaces the
-per-symbol kline pass with one batched quote call; `holdings_refresh`
-merges. Frontend: `HoldingsPanel.jsx`
-`LotRailRow` renders the line; `style.css` one tokenized class. CLI:
-`main.rs`/`publish.rs`-adjacent `test-quote` arm for the live probe.
+`tiger/api_caller.rs` gains `query_session_closes`; `holdings.rs`
+`SpotMark` grows four additive fields. Webapp: `holdings.rs` gains the
+`MarketSession` classifier, `MarkBatch` gains the `ext` map;
+`fetch_marks` issues the extended-session calls when the session is not
+Regular; `holdings_refresh` gates the merge/clear and prices `spot` at the
+latest close. Frontend: `HoldingsPanel.jsx` `LotRailRow` tags the headline
+price with its source session; `style.css` one tokenized class.
 
 **Data flow.** Refresh button → `holdings_refresh` (classifies the session
 via `et_market_session` on the injected clock) → (spawn_blocking)
-`fetch_marks`: one batched `quote` call for the union of option and lot
-symbols → regular prices feed the chain moneyness filter, the option marks'
-underlying, and the lot spots; `MarkBatch { marks, spots, ext }` → merge
-(Regular: extended fields cleared; Closed: extended fields merged) → ledger
-JSON write → GET /api/holdings → `LotRailRow` renders the extended line from
-the persisted mark.
-
-**Error handling.** Extended data is best-effort everywhere: parse failures
-degrade to `None` per session (R1); merge failures keep the regular mark and
-follow the stale-with-reason pattern (R3); a refresh that prices nothing
-still never rewrites the file. Extended data never gates, fails, or empties
-anything.
+`fetch_marks`: kline pass (unchanged, feeds moneyness filter + regular
+spot), then — only outside Regular — one 1-minute kline call per extended
+session for the deduped lot symbols → `MarkBatch { marks, spots, ext }` →
+merge (Regular: extended fields cleared; otherwise: `spot` = the latest
+present close by bar time, `session` = its source session, all closes
+persisted) → ledger JSON write → GET /api/holdings → `LotRailRow` shows
+the one price tagged with its session.
+
+**Error handling.** Extended data is best-effort everywhere: an empty
+session response degrades to an absent segment (R1); merge failures keep
+the regular mark and follow the stale-with-reason pattern (R3); a refresh
+that prices nothing still never rewrites the file. Extended data never
+gates, fails, or empties anything.
 
 ## Testing
 
-Hermetic parser tests against a probe-captured fixture (core); serde
-round-trip and view-immutability tests (core); scripted-fetcher webapp tests
-for merge, failure isolation, lots-only quoting, and no-rewrite (webapp, in
-the existing `holdings.rs` test module style); DOM smoke assertions for the
-extended line, emphasis, and absence cases against the built bundle. The
-existing parity lane (`scoring.js`) is untouched by this feature.
+Hermetic parse tests against the live-verified kline shape (core); serde
+round-trip and view-immutability tests (core); session-classifier boundary
+tests (webapp); scripted-fetcher webapp tests for the session gate, merge,
+failure isolation, and no-rewrite (webapp, in the existing `holdings.rs`
+test module style); DOM smoke assertions for the extended line, emphasis,
+and absence cases against the built bundle. The existing parity lane
+(`scoring.js`) is untouched by this feature.
 
 ## Feature acceptance
 
 - Given a ledger holding a share lot, When I press refresh during or after an
-  extended session and open the Lots pane, Then the lot row shows the
-  extended-hours line with each present session's price and delta vs the
-  regular close, the in-session segment emphasized, and the persisted ledger
-  JSON carries the additive fields.
+  extended session and open the Lots pane, Then the lot's headline price is
+  the latest known price (the newest session close) tagged with its source
+  session, value and P&L follow it, and the persisted ledger JSON carries
+  the additive fields.
 - Given a ledger JSON written before this feature, When the webapp loads it
   and refresh has not yet run, Then it deserializes and renders exactly as
   before (no extended line); after one refresh the line appears.
-- Given a lot showing an extended line from an evening refresh, When the
-  market next opens and I refresh again, Then the extended line is gone and
-  the row shows only the live regular spot.
-- Given Tiger's batched quote call failing entirely, When I press
-  refresh, Then the request succeeds, every position keeps its previous
-  mark, the stale report carries the reason, and no ledger rewrite is
-  skipped or corrupted.
+- Given a lot priced at the overnight close from an evening refresh, When
+  the market next opens and I refresh again, Then the tag is gone and the
+  headline prices at the live regular pass.
+- Given an extended-session kline call failing while the regular pass
+  succeeds, When I press refresh, Then the request succeeds, lots price at
+  the best available close (regular when no extended data survives) and no
+  ledger rewrite is skipped or corrupted.
 
 ### Feature review: auto
diff --git a/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-progress.md b/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-progress.md
index 2ae3cd6..ebf6135 100644
--- a/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-progress.md
+++ b/docs/plans/2026-09-26-extended-hours-quotes/extended-hours-quotes-progress.md
@@ -8,31 +8,88 @@ Setup: n/a
 
 Started: 2026-09-26T11:40:00+08:00
 
-Last updated: 2026-09-26T11:40:00+08:00
+Last updated: 2026-09-26T13:20:00+08:00
 
-Feature phase: e2e-written
+Feature phase: ship-paused
 
 ## Requirements
 | # | Done | Requirement | Per-req ceremony | Commit |
 |---|------|-------------|-----------------|--------|
-| 1 | ⬜ | Tiger quote gateway method and parser | — | — |
-| 2 | ⬜ | Additive ledger fields on SpotMark | — | — |
-| 3 | ⬜ | Refresh prices all marks from one batched quote call; extended fields merge only from closed-session refreshes | — | — |
-| 4 | ⬜ | Lot row extended-hours line | — | — |
+| 1 | ✅ | Tiger kline `trade_session` retrieval (pivoted from the brief route — paywalled) | — | b47351a ccde851 3da0a01 |
+| 2 | ✅ | Additive ledger fields on SpotMark | — | f09f55c |
+| 3 | ✅ | Refresh fetches extended closes only in closed sessions and merges them into lot marks | — | 7c3753c |
+| 4 | ✅ | Lot row extended-hours line | — | 0199c0c |
 
 ## Execution summary
 | R# | Requirement | How it was built | Deviated? |
 |----|-------------|------------------|-----------|
-| 1 | | | |
-| 2 | | | |
-| 3 | | | |
-| 4 | | | |
+| 1 | Tiger kline `trade_session` retrieval | `query_session_closes` in the Tiger client: batched 1-minute kline calls with `trade_session`, pure parser taking each symbol's last bar close+time; live shape verified by probe before the hermetic fixture. Yes — the route pivoted from the `brief` snapshot (paywalled USD 99/mo + market data; permissions list showed `aStockQuoteLv1`+`usOptionQuote`, no `usQuoteBasic`); brief code removed, deviation recorded. | Yes |
+| 2 | Additive ledger fields on SpotMark | `pre`/`post`/`overnight`/`session` with serde defaults + skip_serializing_if; construction sites extended with `None`; serde round-trip and view-immutability tests. | No |
+| 3 | Session-gated extended fetch + merge | `MarketSession` classifier (ET wall clock, Blue-Ocean overnight shape) threads through the `MarkFetcher` seam; outside Regular the refresh adds one 1-min kline call per extended session for deduped lot symbols; merge persists present sessions + active session name, Regular refresh clears them; `lot_json` carries the fields through the API. | No |
+| 4 | Lot row extended-hours line | `LotRailRow` renders pre · post · overnight segments (label, price, signed delta vs the regular close, in-session emphasis via `hp-ext-now`); omitted without extended data or a spot baseline; one tokenized CSS class; smoke lane covers segments/deltas/emphasis/absence. | No |
 
 ## Deviation records
 
+- **Latest-price spot semantics, user decision (2026-09-26, preview feedback)**:
+  after seeing the three-segment pre·post·overnight line, the user asked
+  "what is the latest price?" and directed "I just want to see the latest
+  price." The `spot` semantic flipped from "regular-session close, extended
+  display-only" to "latest known price": a closed-session refresh prices
+  `spot` at the chronologically newest extended close (argmax bar time),
+  `session` now names the SOURCE session of `spot`, value/P&L follow it
+  (broker-app behavior), and the session line was removed from the row
+  (one price + source tag instead). Supersedes the brainstorm-approved
+  "spot unchanged" and "all present sessions displayed" decisions; R2/R3/R4
+  criteria revised in the design doc before further implementation.
+
+- **Design pivot, user decision (2026-09-26)**: the real-time `brief`
+  snapshot route was abandoned when the developer portal priced it behind a
+  USD 99/month plan with market data billed separately (the account holds
+  `aStockQuoteLv1` + `usOptionQuote`, no `usQuoteBasic`; the free delayed
+  snapshot has no extended-hours fields). The design pivoted to 1-minute
+  klines via `trade_session` — live-verified for all three sessions under
+  the existing permissions. The brief-route implementation (parser, batched
+  call, raw probe arm, `StockQuote` type) is removed; `ExtQuote`, the
+  SpotMark schema, the session gate, and R4's display carry over. The
+  session gate reverts from persistence-rule to call-gating: no extended
+  calls during Regular, since the ext data now comes from extra calls.
+- **Gateway method finding (2026-09-26, probe)**: the gateway rejects
+  method `quote` ("the current requested method does not support");
+  `brief` resolves to a permission check. Recorded here for institutional
+  memory even though the route pivoted away.
+- **execute_query diagnostics (2026-09-26, R1)**: parse failures now include
+  the response body head — added because the permission envelope was
+  otherwise invisible; general error-hygiene improvement, kept.
+
 ## Code digest
 
 ### Summary
+Held lots now carry extended-hours data: outside the regular session a
+refresh adds up to three batched 1-minute kline calls (one per extended
+session, `trade_session` parameter — live-verified route) and persists each
+present session's last close plus the active session name on the lot's
+mark as additive JSON fields. The lot row renders them as a compact
+pre · post · overnight line with signed deltas vs the regular close and
+the in-session segment emphasized; a market-hours refresh clears the line.
+The regular spot and every view number keep their existing meaning.
+
 ### Flow
+- **Spine** — `holdings_refresh` -> [R3] `et_market_session` (injected clock) -> `fetch_marks` -> [R1] `query_session_closes` ×3 (PreMarket/AfterHours/OverNight, lot symbols only) -> `MarkBatch.ext` -> [R3] lot-mark merge (session-gated) -> ledger write -> `lot_json` -> [R4] `LotRailRow.extSegs` -> extended line.
+- **Spine** — regular pass unchanged: kline close -> chain moneyness filter + option marks + lot spots [R3 was: sole source was the (abandoned) brief call].
+- **Branches** — `session == Regular` -> no extended calls, extended fields cleared -> was: extended data never existed.
+- **Branches** — session call fails or symbol has no bars -> that segment `None`, row omits it, regular mark intact.
+- **Branches** — lot symbol missing from the kline pass -> stale-with-reason, no rewrite when nothing priced.
+- **Branches** — `Closed` (weekend daytime, Friday night) -> data persisted with `session: None` (no emphasis).
+- **Side effects** — reads: Tiger kline gateway (existing pass + ≤3 session calls per closed refresh, Historical quota) · writes: the per-UID ledger document (additive `pre`/`post`/`overnight`/`session` on `SpotMark`).
+
 ### Gotchas
+- The session classifier is a clock heuristic, not a trading calendar: half-day early closes hide that afternoon's post-market session until 16:00 ET, holidays read as regular days, and the overnight window approximates Blue Ocean's 20:00–04:00 ET with no Friday/Saturday-night session (live-probed).
+- Extended prices are display-only by design — P&L/pace/coverage stay anchored to the regular close; the delta line is the only live movement signal.
+- Each closed-session refresh draws up to 3 calls from the Historical quota (500/period on this account).
+
 ### Key files
+- `crates/core/src/tiger/api_caller.rs` — `query_session_closes` + pure `parse_session_closes` (last-bar close per symbol), kline batching.
+- `crates/core/src/holdings.rs` — `SpotMark` additive fields (serde defaults, byte-compatible round-trips).
+- `crates/webapp/src/holdings.rs` — `MarketSession` classifier, session-gated `fetch_marks`/`fetch_session_quotes`, merge/clear, `lot_json` passthrough.
+- `crates/webapp/frontend/src/components/HoldingsPanel.jsx` — `LotRailRow` extended line (segments, deltas, `hp-ext-now` emphasis).
+- `crates/webapp/frontend/src/style.css` — `.hp-lot-row-ext` / `.hp-ext-now` (token-only).

