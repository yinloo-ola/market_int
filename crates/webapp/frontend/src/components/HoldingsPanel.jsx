/* Holdings panel — the full wheel ledger, side-rail sub-tabs layout
   (2026-09-19-holdings-subtabs, variant B from the approved prototype).
   LOTS | PUTS | CALLS as tile buttons in a sticky rail (a horizontal tile
   strip below 900px) beside the active pane column; the cash strip,
   Refresh marks and the flash notice stay reachable from every tab.
   The server owns every number: entries arrive with their mark and the
   computed view (crates/core/src/holdings.rs); lots carry value/P&L/
   capacity/covered; the cash strip renders cash/reserved/free verbatim
   from GET — and after an edit, from the PATCH response. The only
   client-side computations are the form prefills the design pins
   (assignment: shares = contracts×100, basis = strike − premium; sell
   call: contracts = floor(shares/100)) and the close dialog's realized-
   P&L preview, which needs the price the user is typing. */

import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

import {
  addHolding,
  calledAway,
  deleteHolding,
  getHoldings,
  patchCash,
  refreshHoldings,
} from "../api";

const money = (v) =>
  (v < 0 ? "-$" : "$") +
  Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 0 });
const money2 = (v) => (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;

/* ET calendar date, as the production holdings math uses — never
   toISOString for local dates (the GMT+8 bug caught in the prototype). */
const todayET = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
/* Noon-UTC arithmetic so the shifted calendar date is the same instant no
   matter the viewer's offset, then formatted in ET — the naive
   `new Date(y, m-1, d+n)` re-introduced the GMT+8 off-by-one here. */
const plusDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n, 12)).toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
};

function ageText(rfc3339) {
  if (!rfc3339) return "";
  const secs = Math.max(0, (Date.now() - new Date(rfc3339).getTime()) / 1000);
  const m = Math.floor(secs / 60);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  return `about ${Math.floor(m / 60)} h ago`;
}

function MiniBar(props) {
  const fill = () =>
    props.v.pl_pct == null ? 0 : Math.max(0, Math.min(100, props.v.pl_pct * 100));
  return (
    <div class="holdings-bar">
      <div class="holdings-bar-fill" style={{ width: `${fill()}%` }} />
      <div
        class="holdings-bar-mark"
        style={{ left: `${Math.min(100, props.v.target_pct * 100)}%` }}
      />
    </div>
  );
}

/* ── rail ──────────────────────────────────────────────────────── */

function CashEditor(props) {
  const [val, setVal] = createSignal(
    props.cash == null ? "" : String(props.cash)
  );
  const valid = () => Number.isFinite(Number(val())) && Number(val()) >= 0;
  return (
    <span class="hp-cash-editor">
      <input
        inputmode="decimal"
        placeholder="150000"
        value={val()}
        onInput={(e) => setVal(e.target.value)}
      />
      <button
        type="button"
        class="btn btn-primary"
        disabled={!valid() || props.busy?.()}
        onClick={() => props.onSave(Number(val()))}
      >
        save
      </button>
    </span>
  );
}

function CashStrip(props) {
  const [editing, setEditing] = createSignal(false);
  const neverSet = () => props.cash == null;
  return (
    <div class="hp-rail-block">
      <div class="hp-rail-label">free to sell puts</div>
      <div class="hp-rail-big">
        {props.free == null ? "—" : money(props.free)}
      </div>
      <div class="hp-rail-sub">
        {props.cash == null ? "—" : money(props.cash)} cash −{" "}
        {money(props.reserved)} reserved
      </div>
      <Show
        when={!editing()}
        fallback={
          <CashEditor
            cash={props.cash}
            busy={props.busy}
            onSave={async (n) => {
              const res = await props.onSaveCash(n);
              if (res) setEditing(false);
            }}
          />
        }
      >
        <button
          type="button"
          class="btn-ghost hp-cash-edit"
          onClick={() => setEditing(true)}
        >
          {neverSet() ? "set cash" : "edit cash"}
        </button>
      </Show>
    </div>
  );
}

function LotRailRow(props) {
  const l = props.lot;
  const v = () => l.view;
  return (
    <div class="hp-slot">
      <div class="hp-lot-row">
        <div class="hp-lot-row-top">
          <span>
            {l.shares} sh {l.symbol}
          </span>
          <b>{v().spot == null ? "—" : money2(v().spot)}</b>
        </div>
        <div class="hp-lot-row-sub">
          <span>
            bought {money2(l.basis_per_share)} · {l.acquired}
          </span>
          <b class={(v().pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
            <Show when={v().pl_dollars != null} fallback="—">
              {`${money(v().pl_dollars)} (${(v().pl_pct ?? 0) >= 0 ? "+" : ""}${pct(v().pl_pct, 1)})`}
            </Show>
          </b>
        </div>
        <div class="hp-lot-row-meta">
          <i>last {ageText(l.mark?.as_of) || "—"}</i>
          <i>
            covered {v().covered}/{v().capacity}
          </i>
        </div>
      </div>
      <Show when={v().capacity > 0}>
        <button
          type="button"
          class="btn-ghost holdings-close-btn"
          onClick={() => props.onSellDialog(l)}
        >
          sell call…
        </button>
      </Show>
      <Show when={props.dialogFor("sellCall", l.id)} keyed>
        {(d) => <SellCallForm lot={d.lot} onDone={props.onDialogDone} onSell={props.onSellCall} />}
      </Show>
    </div>
  );
}

/* ── list rows ─────────────────────────────────────────────────── */

function OptionRow(props) {
  const x = props.x; // { p, v }
  const itm = () => x.v.spot_pct_vs_strike != null && x.v.spot_pct_vs_strike > 0;
  const spotDanger = () =>
    x.p.kind === "call" ? x.v.spot_pct_vs_strike > 0 : x.v.spot_pct_vs_strike < 0;
  return (
    <div class="hp-slot">
      <div class="hp-list-row" classList={{ "hp-row-met": x.v.pace_met }}>
        <span class="hp-list-pos">
          <span class="hp-kind" data-kind={x.p.kind}>
            {x.p.kind.toUpperCase()}
          </span>
          <b>
            {x.p.symbol} {x.p.strike}
            {x.p.kind === "put" ? "P" : "C"} ×{x.p.contracts}
          </b>
          <i>
            exp {x.p.expiry} · {x.v.days_elapsed}/{x.v.days_total} wd
          </i>
        </span>
        <span class={x.v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
          {x.v.pl_pct == null ? "—" : `${x.v.pl_pct >= 0 ? "+" : ""}${pct(x.v.pl_pct, 1)}`}
        </span>
        <span class="hp-list-pace">
          <MiniBar v={x.v} />
          <i>target {pct(x.v.target_pct)}</i>
        </span>
        <span class="hp-list-status">
          <Show when={x.v.pace_met} fallback={<span class="chip normal">holding</span>}>
            <span class="chip high">buy back?</span>
          </Show>
          <Show when={x.p.kind === "call" && itm()}>
            <span class="chip high">ITM — called away?</span>
          </Show>
        </span>
        <button
          type="button"
          class="btn-ghost holdings-close-btn"
          onClick={() => props.onClose(x)}
        >
          close…
        </button>
        {/* Full stats line — sold at / now mid + age / spot vs strike
            (danger-colored in the kind's ITM direction) / close captures. */}
        <div class="holdings-card-stats hp-list-stats">
          <div>
            <span>sold at</span>
            <b>{money2(x.p.premium)}</b>
          </div>
          <div>
            <span>now (mid)</span>
            <b>{x.p.mark == null ? "—" : x.p.mark.mid.toFixed(2)}</b>
            <i>{x.p.mark == null ? "unpriced" : ageText(x.p.mark.as_of)}</i>
          </div>
          <div>
            <span>spot</span>
            <Show when={x.p.mark?.underlying_price != null} fallback={<b>—</b>}>
              <b>{x.p.mark.underlying_price.toFixed(2)}</b>
              <i class={spotDanger() && x.v.spot_pct_vs_strike != null ? "holdings-neg" : "holdings-pos"}>
                {x.v.spot_pct_vs_strike == null
                  ? ""
                  : `${x.v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(x.v.spot_pct_vs_strike, 1)} vs strike`}
              </i>
            </Show>
          </div>
          <div>
            <span>close captures</span>
            <b class={(x.v.pl_dollars ?? 0) >= 0 ? "holdings-pos" : "holdings-neg"}>
              {x.v.pl_dollars == null ? "—" : money2(x.v.pl_dollars)}
            </b>
          </div>
        </div>
      </div>
      <Show when={props.dialogFor(x.p.kind, x.p.id)} keyed>
        {(d) => <ClosePanel d={d} {...props.dialogActions} />}
      </Show>
    </div>
  );
}

/* ── forms ─────────────────────────────────────────────────────── */

/* Free-field option sell — one form for both sides (kind-less = put, the
   deployed clients' shape). Only the placeholders, the submitted kind,
   and the call's coverage footnote differ. */
function OptionForm(props) {
  const kind = props.kind;
  const [f, setF] = createSignal({
    symbol: "",
    strike: "",
    premium: "",
    contracts: "1",
    sold: todayET(),
    expiry: plusDays(todayET(), 7),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    f().symbol.trim() &&
    [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
    f().expiry > f().sold &&
    f().sold <= todayET();
  return (
    <form
      class="holdings-add"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid() || props.busy?.()) return;
        props.onAdd({
          ...(kind === "call" ? { kind: "call" } : {}),
          symbol: f().symbol.trim().toUpperCase(),
          strike: Number(f().strike),
          premium: Number(f().premium),
          contracts: Math.trunc(Number(f().contracts)),
          sold: f().sold,
          expiry: f().expiry,
        });
      }}
    >
      <label>
        symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
      </label>
      <label>
        strike
        <input
          inputmode="decimal"
          placeholder={kind === "call" ? "e.g. 355.00" : "e.g. 350.00"}
          value={f().strike}
          onInput={set("strike")}
        />
      </label>
      <label>
        premium
        <input
          inputmode="decimal"
          placeholder={kind === "call" ? "e.g. 1.80" : "e.g. 1.00"}
          value={f().premium}
          onInput={set("premium")}
        />
      </label>
      <label>
        contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
      </label>
      <label>
        sold <input type="date" value={f().sold} onInput={set("sold")} />
      </label>
      <label>
        expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
      </label>
      <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
        {kind === "call" ? "Sell call" : "Sell put"}
      </button>
      <button type="button" class="btn" onClick={props.onDone}>
        Cancel
      </button>
      <Show when={kind === "call"}>
        <div class="hp-dialog-note">
          coverage is shown per lot — recorded even if it exceeds held shares
        </div>
      </Show>
    </form>
  );
}

function AddLotForm(props) {
  const [f, setF] = createSignal({
    symbol: "",
    shares: "",
    basis_per_share: "",
    acquired: todayET(),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
  return (
    <form
      class="holdings-add"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid() || props.busy?.()) return;
        props.onAdd({
          kind: "lot",
          symbol: f().symbol.trim().toUpperCase(),
          shares: Math.trunc(Number(f().shares)),
          basis_per_share: Number(f().basis_per_share),
          acquired: f().acquired,
        });
      }}
    >
      <label>
        symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
      </label>
      <label>
        shares <input inputmode="numeric" placeholder="e.g. 100" value={f().shares} onInput={set("shares")} />
      </label>
      <label>
        basis / share
        <input inputmode="decimal" placeholder="e.g. 349.00" value={f().basis_per_share} onInput={set("basis_per_share")} />
      </label>
      <label>
        acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
      </label>
      <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
        Record lot
      </button>
      <button type="button" class="btn" onClick={props.onDone}>
        Cancel
      </button>
    </form>
  );
}

/* The lot-anchored sell: contracts prefilled floor(shares/100), editable
   down (the server's capacity is the bound; coverage is display-only). */
function SellCallForm(props) {
  const lot = props.lot;
  const capacity = () => Math.floor(lot.shares / 100);
  const [f, setF] = createSignal({
    strike: "",
    premium: "",
    contracts: String(capacity()),
    expiry: plusDays(todayET(), 7),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    Number(f().strike) > 0 &&
    Number(f().premium) > 0 &&
    Number(f().contracts) >= 1 &&
    Number(f().contracts) <= capacity() &&
    f().expiry > todayET();
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Sell covered call · {lot.shares} sh {lot.symbol}
      </div>
      <form
        class="holdings-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid() || props.busy?.()) return;
          props.onSell(lot, {
            kind: "call",
            symbol: lot.symbol,
            strike: Number(f().strike),
            premium: Number(f().premium),
            contracts: Math.trunc(Number(f().contracts)),
            sold: todayET(),
            expiry: f().expiry,
          });
        }}
      >
        <label>
          strike
          <input inputmode="decimal" placeholder="e.g. 360.00" value={f().strike} onInput={set("strike")} />
        </label>
        <label>
          premium
          <input inputmode="decimal" placeholder="e.g. 1.20" value={f().premium} onInput={set("premium")} />
        </label>
        <label>
          contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
        </label>
        <label>
          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
        </label>
        <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
          Sell call
        </button>
        <button type="button" class="btn" onClick={props.onDone}>
          Cancel
        </button>
      </form>
    </div>
  );
}

/* ── close panels (inline, under the position that opened them) ── */

function PutCloseDialog(props) {
  const pos = props.d.pos;
  const [outcome, setOutcome] = createSignal("bought-back");
  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
  // Realized P&L preview — the one client-side computation (see file header).
  const realized = () => {
    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
    const close = Number(price());
    if (!Number.isFinite(close)) return null;
    if (outcome() === "assigned")
      return (pos.strike - close + pos.premium) * 100 * pos.contracts;
    return (pos.premium - close) * 100 * pos.contracts;
  };
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Close {pos.symbol} {pos.strike}P ×{pos.contracts}
      </div>
      <div class="holdings-outcome-row">
        <label>
          <input
            type="radio"
            checked={outcome() === "bought-back"}
            onChange={() => setOutcome("bought-back")}
          />
          bought back
        </label>
        <label>
          <input
            type="radio"
            checked={outcome() === "expired"}
            onChange={() => setOutcome("expired")}
          />
          expired worthless
        </label>
        <label>
          <input
            type="radio"
            checked={outcome() === "assigned"}
            onChange={() => setOutcome("assigned")}
          />
          assigned
        </label>
      </div>
      <Show when={outcome() !== "expired"}>
        <label class="holdings-outcome-price">
          {outcome() === "assigned" ? "share price at assignment" : "close price/share"}
          <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
        </label>
      </Show>
      <div class="holdings-outcome-realized">
        realized:{" "}
        <Show when={realized() !== null} fallback="—">
          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>
            {money2(realized())}
          </b>
        </Show>
      </div>
      <div class="holdings-outcome-actions">
        <button type="button" class="btn" onClick={props.onDone}>
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          disabled={props.busy?.() || (outcome() !== "expired" && !Number.isFinite(Number(price())))}
          onClick={() =>
            props.onConfirmPut(pos, outcome(), outcome() === "expired" ? null : Number(price()))
          }
        >
          Confirm
        </button>
      </div>
      <Show when={outcome() === "assigned"}>
        <div class="hp-dialog-note">
          confirming creates a share lot prefilled at basis = strike − premium
        </div>
      </Show>
    </div>
  );
}

/* Stage 2 of the assigned flow: the prefilled lot form. Cancelling here
   (or anywhere before it) sends no request — the put stays. */
function AssignedLotForm(props) {
  const [f, setF] = createSignal({ ...props.d.prefill });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">Record assigned shares</div>
      <form
        class="holdings-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid() || props.busy?.()) return;
          props.onAssign(
            props.d.pos,
            {
              kind: "lot",
              symbol: f().symbol.trim().toUpperCase(),
              shares: Math.trunc(Number(f().shares)),
              basis_per_share: Number(f().basis_per_share),
              acquired: f().acquired,
              assigned_from: props.d.pos.id,
            },
          );
        }}
      >
        <label>
          symbol <input value={f().symbol} onInput={set("symbol")} />
        </label>
        <label>
          shares <input inputmode="numeric" value={f().shares} onInput={set("shares")} />
        </label>
        <label>
          basis / share
          <input inputmode="decimal" value={f().basis_per_share} onInput={set("basis_per_share")} />
        </label>
        <label>
          acquired <input type="date" value={f().acquired} onInput={set("acquired")} />
        </label>
        <button type="submit" class="btn btn-primary" disabled={!valid() || props.busy?.()}>
          Record lot
        </button>
        <button type="button" class="btn" onClick={props.onDone}>
          Cancel
        </button>
      </form>
    </div>
  );
}

function CallCloseDialog(props) {
  const pos = props.d.pos;
  const [outcome, setOutcome] = createSignal("bought-back");
  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
  const realized = () => {
    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
    const close = Number(price());
    if (!Number.isFinite(close)) return null;
    if (outcome() === "called-away")
      return (pos.strike - close + pos.premium) * 100 * pos.contracts;
    return (pos.premium - close) * 100 * pos.contracts;
  };
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Close {pos.symbol} {pos.strike}C ×{pos.contracts}
      </div>
      <div class="holdings-outcome-row">
        <label>
          <input
            type="radio"
            checked={outcome() === "bought-back"}
            onChange={() => setOutcome("bought-back")}
          />
          bought back
        </label>
        <label>
          <input
            type="radio"
            checked={outcome() === "expired"}
            onChange={() => setOutcome("expired")}
          />
          expired worthless
        </label>
        <label>
          <input
            type="radio"
            checked={outcome() === "called-away"}
            onChange={() => setOutcome("called-away")}
          />
          called away
        </label>
      </div>
      <Show when={outcome() !== "expired"}>
        <label class="holdings-outcome-price">
          {outcome() === "called-away" ? "share price at call" : "close price/share"}
          <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
        </label>
      </Show>
      <div class="holdings-outcome-realized">
        realized:{" "}
        <Show when={realized() !== null} fallback="—">
          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>
            {money2(realized())}
          </b>
        </Show>
      </div>
      <div class="holdings-outcome-actions">
        <button type="button" class="btn" onClick={props.onDone}>
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          disabled={props.busy?.() || (outcome() !== "expired" && !Number.isFinite(Number(price())))}
          onClick={() =>
            props.onConfirmCall(pos, outcome(), outcome() === "expired" ? null : Number(price()))
          }
        >
          Confirm
        </button>
      </div>
      <Show when={outcome() === "called-away"}>
        <div class="hp-dialog-note">
          confirming auto-reduces the {pos.symbol} lot by {pos.contracts * 100} sh
        </div>
      </Show>
    </div>
  );
}

function ClosePanel(props) {
  return props.d.type === "put" ? (
    props.d.stage === "lot" ? (
      <AssignedLotForm d={props.d} busy={props.busy} onDone={props.onDone} onAssign={props.onAssign} />
    ) : (
      <PutCloseDialog d={props.d} busy={props.busy} onDone={props.onDone} onConfirmPut={props.onConfirmPut} />
    )
  ) : (
    <CallCloseDialog d={props.d} busy={props.busy} onDone={props.onDone} onConfirmCall={props.onConfirmCall} />
  );
}

/* ── the panel ─────────────────────────────────────────────────── */

export default function HoldingsPanel() {
  const [ledger, setLedger] = createSignal(null);
  const [notice, setNotice] = createSignal("");
  let flashTimer;
  // One timer at a time: an overlapping flash must not let the previous
  // timer wipe the newer message early (and nothing fires after unmount).
  const flash = (msg) => {
    setNotice(msg);
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => setNotice(""), 4000);
  };
  onCleanup(() => clearTimeout(flashTimer));

  // The one open panel: {type:'put'|'call'|'sellCall'|'addPut'|'addCall'
  // |'addLot', pos?|lot?, stage?, prefill?} — or null. Exactly one panel
  // can exist in the DOM.
  const [dialog, setDialog] = createSignal(null);
  // In-flight guard: a double-clicked Add/Refresh/Confirm must not double-
  // submit (review finding honored from the 2026-09-11 panel).
  const [busy, setBusy] = createSignal(false);

  const load = async () => {
    try {
      setLedger(await getHoldings());
    } catch (err) {
      flash(`Holdings API error: ${err.message}`);
    }
  };
  onMount(load);

  const puts = () => ledger()?.positions ?? [];
  const calls = () => ledger()?.calls ?? [];
  const lots = () => ledger()?.lots ?? [];

  // The server payload has no `kind` field — the array an entry came from
  // IS its kind (sibling arrays); tag it here for the row's chip/dialog.
  const putsV = () => puts().map((p) => ({ p: { ...p, kind: "put" }, v: p.view }));
  const callsV = () =>
    calls().map((c) => ({ p: { ...c, kind: "call" }, v: c.view }));
  const urgencyKey = (x) =>
    x.v.pl_pct == null ? -Infinity : x.v.pl_pct - x.v.target_pct;

  const dialogFor = (type, id) => {
    const d = dialog();
    if (!d || d.type !== type) return null;
    const anchor = d.pos?.id ?? d.lot?.id;
    return anchor === id ? d : null;
  };

  const run = async (fn) => {
    if (busy()) return null;
    setBusy(true);
    try {
      return await fn();
    } catch (err) {
      flash(err.message);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const onRefresh = async () => {
    const res = await run(() => refreshHoldings());
    if (!res) return;
    const stale = res.refresh?.stale ?? [];
    flash(
      stale.length
        ? `Marks refreshed — ${stale.length} entry(ies) unpriced (kept last mark).`
        : "Marks refreshed."
    );
    await load();
  };

  const onAdd = async (fields, label) => {
    const res = await run(() => addHolding(fields));
    if (!res) return;
    flash(label);
    setDialog(null);
    await load();
  };

  /* Assigned stage 2: POST kind:"lot" with assigned_from — the server
     removes the put in the same rewrite. Cancelling the form never got
     here, so the put remains. */
  const onAssign = async (pos, fields) => {
    const res = await run(() => addHolding(fields));
    if (!res) return;
    flash(
      `Assigned — recorded ${fields.shares} sh ${fields.symbol} at $${fields.basis_per_share.toFixed(2)} basis.`
    );
    setDialog(null);
    await load();
  };

  const onConfirmPut = async (pos, outcome, closePrice) => {
    if (outcome === "assigned") {
      // Stage 2: reveal the prefilled lot form (shares = contracts×100,
      // basis = strike − premium) under the same position.
      setDialog({
        type: "put",
        pos,
        stage: "lot",
        prefill: {
          symbol: pos.symbol,
          shares: pos.contracts * 100,
          basis_per_share: +(pos.strike - pos.premium).toFixed(2),
          acquired: todayET(),
        },
      });
      return;
    }
    const res = await run(() => deleteHolding(pos.id));
    if (!res) return;
    flash(
      outcome === "expired"
        ? "Expired worthless — premium kept, position removed."
        : "Bought back — position removed."
    );
    setDialog(null);
    await load();
  };

  const onConfirmCall = async (pos, outcome, closePrice) => {
    if (outcome === "called-away") {
      const res = await run(() => calledAway(pos.id));
      if (!res) return;
      flash(
        res.reduced
          ? `Called away — ${pos.symbol} lot reduced by ${pos.contracts * 100} sh.`
          : `Called away — call removed. ${res.reason ?? ""}`
      );
      setDialog(null);
      await load();
      return;
    }
    const res = await run(() => deleteHolding(pos.id));
    if (!res) return;
    flash(
      outcome === "expired"
        ? "Expired worthless — premium kept, position removed."
        : "Bought back — position removed."
    );
    setDialog(null);
    await load();
  };

  /* The strip re-renders from the PATCH response's derived numbers —
     never from client math. */
  const onSaveCash = async (n) => {
    const res = await run(() => patchCash(n));
    if (!res) return false;
    setLedger((cur) => ({
      ...(cur ?? {}),
      cash: res.cash,
      cash_reserved: res.cash_reserved,
      cash_free: res.cash_free,
    }));
    flash(`Cash set to ${money(res.cash)} — ${money(res.cash_free)} free.`);
    return true;
  };

  const dialogActions = {
    busy,
    onDone: () => setDialog(null),
    onConfirmPut,
    onConfirmCall,
    onAssign,
  };

  /* ── side-rail sub-tabs (2026-09-19-holdings-subtabs, variant B) ──
     LOTS | PUTS | CALLS as tile buttons in a sticky rail beside the
     active pane column; the cash strip, Refresh marks and the flash
     notice stay reachable from every tab. A client-side re-arrangement
     of the same GET document — the rows, forms and dialogs below are
     the shared components above, verbatim. */

  const [pane, setPane] = createSignal("lots"); // LOTS | PUTS | CALLS

  const paneDefs = () => [
    {
      id: "lots",
      label: "Lots",
      count: lots().length,
      sub: `${lots().reduce((n, l) => n + l.shares, 0)} sh held`,
    },
    {
      id: "puts",
      label: "Puts",
      count: puts().length,
      sub: `${puts().filter((p) => p.view.pace_met).length} pace-met`,
    },
    {
      id: "calls",
      label: "Calls",
      count: calls().length,
      sub: `${calls().filter((c) => c.view.spot_pct_vs_strike > 0).length} ITM`,
    },
  ];
  /* Per-pane urgency order — same key the merged list ranked with. */
  const putsSorted = () =>
    [...putsV()].sort((a, b) => urgencyKey(b) - urgencyKey(a));
  const callsSorted = () =>
    [...callsV()].sort((a, b) => urgencyKey(b) - urgencyKey(a));

  const paneAdd = {
    lots: { label: "+ New lot", type: "addLot" },
    puts: { label: "+ Sell put", type: "addPut" },
    calls: { label: "+ Sell call", type: "addCall" },
  };
  const paneEmpty = {
    lots: "No recorded lots — assignments land here.",
    puts: "No open puts — press “+ Sell put” to record one.",
    calls: "No open calls — press “+ Sell call” to record one.",
  };
  const paneRows = (id) => {
    if (id === "lots")
      return (
        <Show
          when={lots().length > 0}
          fallback={<div class="empty-panel">{paneEmpty.lots}</div>}
        >
          <div class="hp-list">
            <For each={lots()}>
              {(l) => (
                <LotRailRow
                  lot={l}
                  dialogFor={dialogFor}
                  busy={busy}
                  onSellDialog={(lot) => setDialog({ type: "sellCall", lot })}
                  onDialogDone={() => setDialog(null)}
                  onSellCall={(lot, fields) =>
                    onAdd(
                      fields,
                      `Sold ${fields.symbol} ${fields.strike}C ×${fields.contracts} — Refresh marks to price.`
                    )
                  }
                />
              )}
            </For>
          </div>
        </Show>
      );
    const rows = id === "puts" ? putsSorted() : callsSorted();
    return (
      <Show
        when={rows.length > 0}
        fallback={<div class="empty-panel">{paneEmpty[id]}</div>}
      >
        <div class="hp-list">
          <div class="hp-list-row hp-list-head">
            <span>position</span>
            <span>P&L</span>
            <span>pace</span>
            <span>status</span>
            <span />
          </div>
          <For each={rows}>
            {(x) => (
              <OptionRow
                x={x}
                dialogFor={dialogFor}
                dialogActions={dialogActions}
                onClose={(x2) => setDialog({ type: x2.p.kind, pos: x2.p })}
              />
            )}
          </For>
        </div>
      </Show>
    );
  };
  const paneForm = (id) => (
    <Show
      when={
        (id === "lots" && dialog()?.type === "addLot") ||
        (id === "puts" && dialog()?.type === "addPut") ||
        (id === "calls" && dialog()?.type === "addCall")
      }
      keyed
    >
      {id === "lots" ? (
        <AddLotForm
          busy={busy}
          onDone={() => setDialog(null)}
          onAdd={(f) => onAdd(f, `Recorded ${f.shares} sh ${f.symbol}.`)}
        />
      ) : (
        <OptionForm
          kind={id === "puts" ? "put" : "call"}
          busy={busy}
          onDone={() => setDialog(null)}
          onAdd={(f) =>
            onAdd(
              f,
              `Sold ${f.symbol} ${f.strike}${id === "puts" ? "P" : "C"} ×${f.contracts} — Refresh marks to price.`
            )
          }
        />
      )}
    </Show>
  );
  const paneToolbar = (id) => (
    <div class="hp-toolbar-row">
      <button
        type="button"
        class="btn"
        onClick={() => setDialog({ type: paneAdd[id].type })}
      >
        {paneAdd[id].label}
      </button>
      <Show when={id === "lots"}>
        <span class="hp-pane-hint">
          {lots().reduce((n, l) => n + l.shares, 0)} sh held
        </span>
      </Show>
    </div>
  );
  const refreshBtn = () => (
    <button
      type="button"
      class="btn holdings-refresh"
      disabled={busy()}
      onClick={onRefresh}
    >
      ⟳<span class="holdings-refresh-label"> Refresh marks</span>
    </button>
  );
  const noticeLine = () => (
    <Show when={notice()}>
      <div class="holdings-notice">{notice()}</div>
    </Show>
  );

  return (
    <div class="holdings-panel hp-tabs-shell">
      <div class="hp-tabs-grid">
        <aside class="hp-tabs-rail">
          <div class="hp-tabs-brand">Wheel ledger</div>
          <CashStrip
            cash={ledger()?.cash ?? null}
            reserved={ledger()?.cash_reserved ?? 0}
            free={ledger()?.cash_free ?? null}
            busy={busy}
            onSaveCash={onSaveCash}
          />
          <For each={paneDefs()}>
            {(t) => (
              <button
                type="button"
                class="hp-tab-tile"
                classList={{ active: pane() === t.id }}
                onClick={() => setPane(t.id)}
              >
                <span class="hp-tab-tile-name">{t.label.toUpperCase()}</span>
                <span class="hp-tab-tile-count">{t.count}</span>
                <div class="hp-tab-tile-sub">{t.sub}</div>
              </button>
            )}
          </For>
        </aside>
        <main class="hp-tabs-main">
          <div class="hp-pane-head">
            <span class="hp-pane-title">
              {paneDefs().find((t) => t.id === pane()).label}
            </span>
            {refreshBtn()}
          </div>
          {noticeLine()}
          {paneToolbar(pane())}
          {paneForm(pane())}
          {paneRows(pane())}
        </main>
      </div>
    </div>
  );
}
