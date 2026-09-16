/* PROTOTYPE — throwaway, answers one question (prototype skill, UI branch):
   "What should the evolved holdings panel look like — puts + covered calls +
   share lots + a cash-available line?"
   Served only by the dev-only page /holdings-panel-proto.html (sub-shape B —
   the human asked that production files stay untouched; nothing in
   src/components or App.jsx imports this). `npm run proto` serves it on a
   pinned port. Three structurally different variants via ?variant=A|B|C,
   cycled by the floating bottom bar or ← → keys.
   This revision is a working mock of the final product: the shell chrome is
   the real app's classes, all state is live in memory (no backend), the pace
   views are computed by a JS port of crates/core/src/holdings.rs (working
   days + 1-day floor, ET today), and every flow works: edit cash (free =
   cash − Σ strike×100×contracts of open puts), add put / lot, sell call from
   a lot (contracts prefilled = floor(shares/100)), simulated Refresh marks,
   and the outcome dialogs — a put closing "assigned" prefills a share lot
   (shares = contracts×100, basis = strike − premium), a call closing
   "called away" auto-reduces the lot (removed at 0). */

import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

/* ── date helpers (lessons.md: never toISOString for local dates) ── */

const parseD = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtD = (dt) =>
  `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
const addDays = (iso, n) => fmtD(new Date(parseD(iso).getTime() + n * 86_400_000));

/* ET calendar date, as the production holdings math uses. */
function etToday() {
  const s = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
  return s;
}
const TODAY = etToday();

/* Port of holdings.rs working_days_after — strictly after `from`, through
   `to`, weekdays only (holidays not modeled, same as production). */
function workingDaysAfter(fromIso, toIso) {
  let n = 0;
  const d = parseD(fromIso);
  const to = parseD(toIso);
  while (true) {
    d.setDate(d.getDate() + 1);
    if (d > to) break;
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) n += 1;
  }
  return n;
}

/* Port of holdings.rs Holding::view — pace rule with the 1-day floor. */
function viewOf(p) {
  const total = workingDaysAfter(p.sold, p.expiry);
  const anchor = TODAY <= p.expiry ? TODAY : p.expiry;
  let elapsed = workingDaysAfter(p.sold, anchor);
  if (elapsed > total) elapsed = total;
  const target = total > 0 ? Math.max(1, elapsed) / total : 0;
  const spot = p.mark?.underlying_price;
  const spotVs = spot != null ? (spot - p.strike) / p.strike : null;
  if (!p.mark) {
    return { pl_pct: null, pl_dollars: null, days_elapsed: elapsed,
             days_total: total, target_pct: target, pace_met: false,
             spot_pct_vs_strike: spotVs };
  }
  const perShare = p.premium - p.mark.mid;
  const plDollars = perShare * 100 * p.contracts;
  const plPct = perShare / p.premium;
  return { pl_pct: plPct, pl_dollars: plDollars, days_elapsed: elapsed,
           days_total: total, target_pct: target, pace_met: plPct >= target,
           spot_pct_vs_strike: spotVs };
}

/* ── live state (in memory only — the prototype checks nothing persistent) ── */

let seq = 0;
const nid = (k) => `${k}${Date.now().toString(36)}-${seq++}`;

const [puts, setPuts] = createSignal([
  { id: "p1", kind: "put", symbol: "TSLA", strike: 420, premium: 4.5,
    contracts: 1, sold: addDays(TODAY, -9), expiry: addDays(TODAY, 4),
    mark: { mid: 0.75, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
            underlying_price: 401.0 } },
  { id: "p2", kind: "put", symbol: "GOOG", strike: 350, premium: 1.0,
    contracts: 2, sold: addDays(TODAY, -5), expiry: addDays(TODAY, 2),
    mark: { mid: 0.85, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
            underlying_price: 344.2 } },
  { id: "p3", kind: "put", symbol: "AAPL", strike: 230, premium: 3.2,
    contracts: 1, sold: TODAY, expiry: addDays(TODAY, 9), mark: null },
]);
const [calls, setCalls] = createSignal([
  { id: "c1", kind: "call", symbol: "TSLA", strike: 390, premium: 6.0,
    contracts: 1, sold: addDays(TODAY, -9), expiry: addDays(TODAY, 4),
    mark: { mid: 4.1, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
            underlying_price: 401.0 } },
  { id: "c2", kind: "call", symbol: "GOOG", strike: 360, premium: 2.1,
    contracts: 2, sold: addDays(TODAY, -5), expiry: addDays(TODAY, 2),
    mark: { mid: 1.4, as_of: new Date(Date.now() - 2 * 3600_000).toISOString(),
            underlying_price: 344.2 } },
]);
const [lots, setLots] = createSignal([
  { id: "l1", symbol: "GOOG", shares: 200, basis_per_share: 349.0,
    acquired: addDays(TODAY, -12) },
  { id: "l2", symbol: "TSLA", shares: 100, basis_per_share: 402.5,
    acquired: addDays(TODAY, -12) },
]);
const [spots, setSpots] = createSignal({ TSLA: 401.0, GOOG: 344.2, AAPL: 231.1 });
const [spotsAsOf, setSpotsAsOf] = createSignal(
  new Date(Date.now() - 2 * 3600_000).toISOString()
);
const [cashBal, setCashBal] = createSignal(148_000);

const reserved = () => puts().reduce((n, p) => n + p.strike * 100 * p.contracts, 0);
const freeCash = () => cashBal() - reserved();
const coveredOf = (symbol) =>
  calls().filter((c) => c.symbol === symbol).reduce((n, c) => n + c.contracts, 0);

/* Dialog + notice state shared by every variant. */
const [dialog, setDialog] = createSignal(null); // {type:'put'|'call'|'sellCall'|'addPut'|'addLot', ...}
const [flashMsg, setFlashMsg] = createSignal("");
let flashTimer;
function flash(msg) {
  setFlashMsg(msg);
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => setFlashMsg(""), 4000);
}

/* ── actions ── */

function refreshMarks() {
  const wiggle = (v) => Math.max(0.05, v * (1 + (Math.random() - 0.45) * 0.06));
  const nextSpots = {};
  for (const [sym, px] of Object.entries(spots())) {
    nextSpots[sym] = +(px * (1 + (Math.random() - 0.5) * 0.008)).toFixed(2);
  }
  setSpots(nextSpots);
  setSpotsAsOf(new Date().toISOString());
  const asOf = new Date().toISOString();
  const mark = (p) => {
    const mid =
      p.mark == null
        ? +(p.premium * (0.35 + Math.random() * 0.35)).toFixed(2)
        : +wiggle(p.mark.mid).toFixed(2);
    return { mid, as_of: asOf, underlying_price: nextSpots[p.symbol] ?? null };
  };
  setPuts(puts().map((p) => ({ ...p, mark: mark(p) })));
  setCalls(calls().map((c) => ({ ...c, mark: mark(c) })));
  flash("Marks refreshed (simulated Tiger).");
}

function addPut(fields) {
  const p = { id: nid("p"), kind: "put", ...fields, mark: null };
  setPuts([...puts(), p]);
  flash(`Sold ${p.symbol} ${p.strike}P ×${p.contracts} — Refresh marks to price it.`);
  setDialog(null);
}

function addLot(fields) {
  setLots([...lots(), { id: nid("l"), ...fields }]);
  flash(`Recorded ${fields.shares} sh ${fields.symbol}.`);
  setDialog(null);
}

function addCall(fields) {
  const c = { id: nid("c"), kind: "call", sold: fields.sold ?? TODAY, mark: null, ...fields };
  setCalls([...calls(), c]);
  flash(`Sold ${c.symbol} ${c.strike}C ×${c.contracts} — Refresh marks to price.`);
  setDialog(null);
}

function sellCall(lot, fields) {
  const c = { id: nid("c"), kind: "call", symbol: lot.symbol, ...fields,
              sold: TODAY, mark: null };
  setCalls([...calls(), c]);
  flash(`Sold ${c.symbol} ${c.strike}C ×${c.contracts} — Refresh marks to price.`);
  setDialog(null);
}

/* Q2: a put closing ASSIGNED prefills the share lot — one click from the
   outcome to a recorded lot at basis = strike − premium. */
function confirmPutClose(pos, outcome, price, lotFields) {
  if (outcome === "assigned") {
    if (!lotFields) {
      setDialog({ type: "put", pos,
        stage: "lot",
        prefill: { symbol: pos.symbol, shares: pos.contracts * 100,
                   basis_per_share: +(pos.strike - pos.premium).toFixed(2),
                   acquired: TODAY } });
      return;
    }
    setLots([...lots(), { id: nid("l"), ...lotFields }]);
    setPuts(puts().filter((p) => p.id !== pos.id));
    flash(`Assigned — recorded ${lotFields.shares} sh ${lotFields.symbol} at $${lotFields.basis_per_share.toFixed(2)} basis.`);
    setDialog(null);
    return;
  }
  setPuts(puts().filter((p) => p.id !== pos.id));
  flash(outcome === "expired"
    ? "Expired worthless — premium kept, position removed."
    : "Bought back — position removed.");
  setDialog(null);
}

/* Q12 (user decision): a call closing CALLED AWAY auto-reduces the lot by
   contracts×100 shares; the lot disappears at zero. */
function confirmCallClose(pos, outcome, price) {
  if (outcome === "called-away") {
    const need = pos.contracts * 100;
    const lot = lots().find((l) => l.symbol === pos.symbol && l.shares >= need);
    if (!lot) {
      flash(`No recorded lot covers ${pos.contracts} × ${pos.symbol} — shares not reduced (record the lot first).`);
      setCalls(calls().filter((c) => c.id !== pos.id));
      setDialog(null);
      return;
    }
    const rest = lot.shares - need;
    setLots(rest === 0
      ? lots().filter((l) => l.id !== lot.id)
      : lots().map((l) => (l.id === lot.id ? { ...l, shares: rest } : l)));
    setCalls(calls().filter((c) => c.id !== pos.id));
    flash(`Called away — ${pos.symbol} lot reduced by ${need} sh${rest === 0 ? " (lot closed)" : `, ${rest} sh left`}.`);
    setDialog(null);
    return;
  }
  setCalls(calls().filter((c) => c.id !== pos.id));
  flash(outcome === "expired"
    ? "Expired worthless — premium kept, position removed."
    : "Bought back — position removed.");
  setDialog(null);
}

/* ── formatting (production conventions) ── */

const money = (v) =>
  (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString(undefined, { maximumFractionDigits: 0 });
const money2 = (v) => (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;

function ageText(rfc3339) {
  const secs = Math.max(0, (Date.now() - new Date(rfc3339).getTime()) / 1000);
  const m = Math.floor(secs / 60);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  return `about ${Math.floor(m / 60)} h ago`;
}

const urgencyKey = (x) =>
  x.v.pl_pct == null ? -Infinity : x.v.pl_pct - x.v.target_pct;
const byUrgency = (arr) => [...arr].sort((a, b) => urgencyKey(b) - urgencyKey(a));
const putsV = () => puts().map((p) => ({ p, v: viewOf(p) }));
const callsV = () => calls().map((c) => ({ p: c, v: viewOf(c) }));

/* ── cards ── */

function MiniBar(props) {
  const fill = () =>
    props.v.pl_pct == null ? 0 : Math.max(0, Math.min(100, props.v.pl_pct * 100));
  return (
    <div class="holdings-bar">
      <div class="holdings-bar-fill" style={{ width: `${fill()}%` }} />
      <div class="holdings-bar-mark" style={{ left: `${Math.min(100, props.v.target_pct * 100)}%` }} />
    </div>
  );
}

function PutCard(props) {
  const p = props.x.p;
  const v = props.x.v;
  return (
    <div class="holdings-card" classList={{ "holdings-card-met": v.pace_met }}>
      <div class="holdings-card-head">
        <b>{p.symbol} {p.strike}P ×{p.contracts}</b>
        <span class="holdings-age">exp {p.expiry} · {v.days_elapsed}/{v.days_total} wd</span>
      </div>
      <div class="holdings-card-big">
        <span class={v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
          {v.pl_pct == null ? "—" : `${v.pl_pct >= 0 ? "+" : ""}${pct(v.pl_pct, 1)}`}
        </span>
        <span class="holdings-card-target">target {pct(v.target_pct)}</span>
      </div>
      <MiniBar v={v} />
      <div class="holdings-card-stats">
        <div><span>sold at</span><b>{money2(p.premium)}</b></div>
        <div>
          <span>now (mid)</span>
          <b>{p.mark == null ? "—" : p.mark.mid.toFixed(2)}</b>
          <i>{p.mark == null ? "unpriced" : ageText(p.mark.as_of)}</i>
        </div>
        <div>
          <span>spot</span>
          <Show when={p.mark?.underlying_price != null} fallback={<b>—</b>}>
            <b>{p.mark.underlying_price.toFixed(2)}</b>
            <i class={v.spot_pct_vs_strike < 0 ? "holdings-neg" : "holdings-pos"}>
              {`${v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(v.spot_pct_vs_strike, 1)} vs strike`}
            </i>
          </Show>
        </div>
        <div>
          <span>close captures</span>
          <b class={v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
            {v.pl_dollars == null ? "—" : money2(v.pl_dollars)}
          </b>
        </div>
      </div>
      <div class="holdings-card-actions">
        <Show when={v.pace_met} fallback={<span class="chip normal">holding</span>}>
          <span class="chip high">buy back?</span>
        </Show>
        <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setDialog({ type: "put", pos: p })}>close…</button>
      </div>
    </div>
  );
}

function CallCard(props) {
  const p = props.x.p;
  const v = props.x.v;
  const itm = () => v.spot_pct_vs_strike != null && v.spot_pct_vs_strike > 0;
  return (
    <div class="holdings-card" classList={{ "holdings-card-met": v.pace_met }}>
      <div class="holdings-card-head">
        <b>{p.symbol} {p.strike}C ×{p.contracts}</b>
        <span class="holdings-age">exp {p.expiry} · {v.days_elapsed}/{v.days_total} wd</span>
      </div>
      <div class="holdings-card-big">
        <span class={v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
          {`${v.pl_pct >= 0 ? "+" : ""}${pct(v.pl_pct, 1)}`}
        </span>
        <span class="holdings-card-target">target {pct(v.target_pct)}</span>
      </div>
      <MiniBar v={v} />
      <div class="holdings-card-stats">
        <div><span>sold at</span><b>{money2(p.premium)}</b></div>
        <div>
          <span>now (mid)</span>
          <b>{p.mark == null ? "—" : p.mark.mid.toFixed(2)}</b>
          <i>{p.mark == null ? "unpriced" : ageText(p.mark.as_of)}</i>
        </div>
        <div>
          <span>spot</span>
          <Show when={p.mark?.underlying_price != null} fallback={<b>—</b>}>
            <b>{p.mark.underlying_price.toFixed(2)}</b>
            <i class={itm() ? "holdings-neg" : "holdings-pos"}>
              {`${v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(v.spot_pct_vs_strike, 1)} vs strike`}
            </i>
          </Show>
        </div>
        <div>
          <span>close captures</span>
          <b class={v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
            {v.pl_dollars == null ? "—" : money2(v.pl_dollars)}
          </b>
        </div>
      </div>
      <div class="holdings-card-actions">
        <Show when={v.pace_met} fallback={<span class="chip normal">holding</span>}>
          <span class="chip high">buy back?</span>
        </Show>
        <Show when={itm()}>
          <span class="chip high">ITM — called away?</span>
        </Show>
        <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setDialog({ type: "call", pos: p })}>close…</button>
      </div>
    </div>
  );
}

function LotCard(props) {
  const l = props.l;
  const spot = () => spots()[l.symbol] ?? 0;
  const value = () => spot() * l.shares;
  const basis = () => l.basis_per_share * l.shares;
  const pl = () => value() - basis();
  const plPct = () => (basis() > 0 ? pl() / basis() : 0);
  const capacity = () => Math.floor(l.shares / 100);
  return (
    <div class="holdings-card hp-lot-card">
      <div class="holdings-card-head">
        <b>{l.shares} sh {l.symbol}</b>
        <span class="holdings-age">since {l.acquired}</span>
      </div>
      <div class="holdings-card-big">
        <span class={pl() >= 0 ? "holdings-pos" : "holdings-neg"}>
          {`${pl() >= 0 ? "+" : ""}${pct(plPct(), 1)}`}
        </span>
        <span class="holdings-card-target">{money2(spot())} / sh</span>
      </div>
      <div class="holdings-card-stats">
        <div><span>basis</span><b>{money2(l.basis_per_share)}</b></div>
        <div>
          <span>value</span>
          <b>{money(value())}</b>
          <i>spot {ageText(spotsAsOf())}</i>
        </div>
        <div>
          <span>P&L</span>
          <b class={pl() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(pl())}</b>
        </div>
        <div><span>covered</span><b>{coveredOf(l.symbol)}/{capacity()} calls</b></div>
      </div>
      <div class="holdings-card-actions">
        <Show when={coveredOf(l.symbol) < capacity()}>
          <span class="chip normal">capacity for {capacity() - coveredOf(l.symbol)} more</span>
        </Show>
        <Show when={capacity() > 0}>
          <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setDialog({ type: "sellCall", lot: l })}>sell call…</button>
        </Show>
      </div>
    </div>
  );
}

/* ── cash (Q11: manual balance; free = cash − Σ strike×100×contracts) ── */

function CashEditor(props) {
  const [val, setVal] = createSignal(String(cashBal()));
  return (
    <span class="hp-cash-editor">
      <input
        inputmode="decimal"
        value={val()}
        onInput={(e) => setVal(e.target.value)}
      />
      <button
        type="button"
        class="btn btn-primary"
        onClick={() => {
          const n = Number(val().replace(/[$,]/g, ""));
          if (Number.isFinite(n) && n >= 0) {
            setCashBal(n);
            flash(`Cash set to ${money(n)}.`);
          }
          props.onDone?.();
        }}
      >
        save
      </button>
    </span>
  );
}

function CashStrip() {
  const [editing, setEditing] = createSignal(false);
  return (
    <div class="hp-cash">
      <div><span>cash</span><b>{money(cashBal())}</b></div>
      <div><span>reserved by open puts</span><b>{money(reserved())}</b></div>
      <div class="hp-cash-free"><span>free to sell puts</span><b>{money(freeCash())}</b></div>
      <Show when={!editing()} fallback={<CashEditor onDone={() => setEditing(false)} />}>
        <button type="button" class="btn-ghost hp-cash-edit" onClick={() => setEditing(true)}>edit</button>
      </Show>
    </div>
  );
}

function SectionHead(props) {
  return (
    <h3 class="hp-section-head">
      {props.label} <span class="hp-count">{props.items}</span>
      <Show when={props.action}>
        <button type="button" class="btn-ghost hp-section-add" onClick={props.action.onClick}>
          {props.action.label}
        </button>
      </Show>
    </h3>
  );
}

/* ── dialogs (production OutcomeDialog patterns) ── */

function PutCloseDialog(props) {
  const pos = props.d.pos;
  const [outcome, setOutcome] = createSignal("bought-back");
  const [price, setPrice] = createSignal(pos.mark?.mid?.toFixed(2) ?? "");
  const realized = () => {
    if (outcome() === "expired") return pos.premium * 100 * pos.contracts;
    const close = Number(price());
    if (!Number.isFinite(close)) return null;
    if (outcome() === "assigned") return (pos.strike - close + pos.premium) * 100 * pos.contracts;
    return (pos.premium - close) * 100 * pos.contracts;
  };
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Close {pos.symbol} {pos.strike}P ×{pos.contracts}
      </div>
      <div class="holdings-outcome-row">
        <label>
          <input type="radio" checked={outcome() === "bought-back"} onChange={() => setOutcome("bought-back")} />
          bought back
        </label>
        <label>
          <input type="radio" checked={outcome() === "expired"} onChange={() => setOutcome("expired")} />
          expired worthless
        </label>
        <label>
          <input type="radio" checked={outcome() === "assigned"} onChange={() => setOutcome("assigned")} />
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
          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(realized())}</b>
        </Show>
      </div>
      <div class="holdings-outcome-actions">
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          disabled={outcome() !== "expired" && !Number.isFinite(Number(price()))}
          onClick={() => confirmPutClose(pos, outcome(), outcome() === "expired" ? null : Number(price()))}
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

/* Stage 2 of the assigned flow: the prefilled lot form (Q2). */
function AssignedLotDialog(props) {
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
          if (!valid()) return;
          confirmPutClose(props.d.pos, "assigned", null, {
            symbol: f().symbol.trim().toUpperCase(),
            shares: Number(f().shares),
            basis_per_share: Number(f().basis_per_share),
            acquired: f().acquired,
          });
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
        <button type="submit" class="btn btn-primary" disabled={!valid()}>Record lot</button>
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
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
    if (outcome() === "called-away") return (pos.strike - close + pos.premium) * 100 * pos.contracts;
    return (pos.premium - close) * 100 * pos.contracts;
  };
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Close {pos.symbol} {pos.strike}C ×{pos.contracts}
      </div>
      <div class="holdings-outcome-row">
        <label>
          <input type="radio" checked={outcome() === "bought-back"} onChange={() => setOutcome("bought-back")} />
          bought back
        </label>
        <label>
          <input type="radio" checked={outcome() === "expired"} onChange={() => setOutcome("expired")} />
          expired worthless
        </label>
        <label>
          <input type="radio" checked={outcome() === "called-away"} onChange={() => setOutcome("called-away")} />
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
          <b class={realized() >= 0 ? "holdings-pos" : "holdings-neg"}>{money(realized())}</b>
        </Show>
      </div>
      <div class="holdings-outcome-actions">
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          disabled={outcome() !== "expired" && !Number.isFinite(Number(price()))}
          onClick={() => confirmCallClose(pos, outcome(), outcome() === "expired" ? null : Number(price()))}
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

/* Q13: contracts prefilled from the lot — floor(shares/100), editable down. */
function SellCallDialog(props) {
  const lot = props.d.lot;
  const isoLocal = addDays(TODAY, 7);
  const [f, setF] = createSignal({
    strike: "",
    premium: "",
    expiry: isoLocal,
    contracts: String(Math.floor(lot.shares / 100)),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    Number(f().strike) > 0 && Number(f().premium) > 0 &&
    Number(f().contracts) >= 1 && Number(f().contracts) <= Math.floor(lot.shares / 100) &&
    f().expiry > TODAY;
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Sell covered call · {lot.shares} sh {lot.symbol}
      </div>
      <form
        class="holdings-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid()) return;
          sellCall(lot, {
            strike: Number(f().strike),
            premium: Number(f().premium),
            expiry: f().expiry,
            contracts: Math.trunc(Number(f().contracts)),
          });
        }}
      >
        <label>
          strike
          <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
        </label>
        <label>
          premium
          <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
        </label>
        <label>
          contracts
          <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
        </label>
        <label>
          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
        </label>
        <button type="submit" class="btn btn-primary" disabled={!valid()}>Sell call</button>
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
      </form>
    </div>
  );
}

/* Toolbar add-put form — the production AddForm fields. */
function AddPutDialog() {
  const [f, setF] = createSignal({
    symbol: "", strike: "", premium: "", contracts: "1",
    sold: TODAY, expiry: addDays(TODAY, 7),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    f().symbol.trim() && [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
    f().expiry > f().sold && f().sold <= TODAY;
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">Sell put</div>
      <form
        class="holdings-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid()) return;
          addPut({
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
          strike <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
        </label>
        <label>
          premium <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
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
        <button type="submit" class="btn btn-primary" disabled={!valid()}>Sell put</button>
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
      </form>
    </div>
  );
}

/* Standalone covered-call entry (no lot binding — coverage is display-only). */
function AddCallDialog() {
  const [f, setF] = createSignal({
    symbol: "", strike: "", premium: "", contracts: "1",
    sold: TODAY, expiry: addDays(TODAY, 7),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    f().symbol.trim() && [f().strike, f().premium, f().contracts].every((x) => Number(x) > 0) &&
    f().expiry > f().sold && f().sold <= TODAY;
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">Sell call</div>
      <form
        class="holdings-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid()) return;
          addCall({
            symbol: f().symbol.trim().toUpperCase(),
            strike: Number(f().strike),
            premium: Number(f().premium),
            contracts: Math.trunc(Number(f().contracts)),
            expiry: f().expiry,
          });
        }}
      >
        <label>
          symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
        </label>
        <label>
          strike <input inputmode="decimal" placeholder="e.g. 355.00" value={f().strike} onInput={set("strike")} />
        </label>
        <label>
          premium <input inputmode="decimal" placeholder="e.g. 1.80" value={f().premium} onInput={set("premium")} />
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
        <button type="submit" class="btn btn-primary" disabled={!valid()}>Sell call</button>
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
      </form>
      <div class="hp-dialog-note">
        coverage is shown per lot — recorded even if it exceeds held shares
      </div>
    </div>
  );
}

function AddLotDialog() {
  const [f, setF] = createSignal({
    symbol: "", shares: "", basis_per_share: "", acquired: TODAY,
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const valid = () =>
    f().symbol.trim() && Number(f().shares) > 0 && Number(f().basis_per_share) > 0;
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">Record share lot</div>
      <form
        class="holdings-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid()) return;
          addLot({
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
        <button type="submit" class="btn btn-primary" disabled={!valid()}>Record lot</button>
        <button type="button" class="btn" onClick={() => setDialog(null)}>Cancel</button>
      </form>
    </div>
  );
}

/* The dialog anchored to a given position/lot id, or null when it belongs
   to something else — panels render inline under their own position. */
function dialogFor(type, id) {
  const d = dialog();
  if (!d || d.type !== type) return null;
  const anchor = d.pos?.id ?? d.lot?.id;
  return anchor === id ? d : null;
}

/* Put/call close panel, including the assigned flow's second stage. */
function ClosePanel(props) {
  return props.d.type === "put" ? (
    props.d.stage === "lot" ? <AssignedLotDialog d={props.d} /> : <PutCloseDialog d={props.d} />
  ) : (
    <CallCloseDialog d={props.d} />
  );
}

/* ── variants (all on the same live state) ── */

function VariantSections() {
  return (
    <div class="holdings-panel">
      <CashStrip />
      <div class="hp-toolbar-row">
        <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>+ Sell put</button>
        <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>+ Sell call</button>
        <button type="button" class="btn holdings-refresh" onClick={refreshMarks}>⟳<span class="holdings-refresh-label"> Refresh marks</span></button>
      </div>
      <SectionHead label="Puts" items={puts().length} action={{ label: "+ Sell put", onClick: () => setDialog({ type: "addPut" }) }} />
      <Show when={dialog()?.type === "addPut"} keyed><AddPutDialog /></Show>
      <div class="holdings-cards">
        <For each={byUrgency(putsV())}>{(x) => (
          <div class="hp-slot">
            <PutCard x={x} />
            <Show when={dialogFor("put", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
          </div>
        )}</For>
      </div>
      <SectionHead label="Covered calls" items={calls().length} action={{ label: "+ Sell call", onClick: () => setDialog({ type: "addCall" }) }} />
      <Show when={dialog()?.type === "addCall"} keyed><AddCallDialog /></Show>
      <Show when={calls().length === 0}>
        <div class="hp-hint">Sell calls from a share lot's “sell call…” button, or the + Sell call button above.</div>
      </Show>
      <div class="holdings-cards">
        <For each={byUrgency(callsV())}>{(x) => (
          <div class="hp-slot">
            <CallCard x={x} />
            <Show when={dialogFor("call", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
          </div>
        )}</For>
      </div>
      <SectionHead label="Shares" items={lots().length} action={{ label: "+ New lot", onClick: () => setDialog({ type: "addLot" }) }} />
      <Show when={dialog()?.type === "addLot"} keyed><AddLotDialog /></Show>
      <div class="holdings-cards">
        <For each={lots()}>{(l) => (
          <div class="hp-slot">
            <LotCard l={l} />
            <Show when={dialogFor("sellCall", l.id)} keyed>{(d) => <SellCallDialog d={d} />}</Show>
          </div>
        )}</For>
      </div>
    </div>
  );
}

function VariantTabs() {
  const [seg, setSeg] = createSignal("puts");
  const segs = () => [
    { id: "puts", label: `Puts (${puts().length})` },
    { id: "calls", label: `Calls (${calls().length})` },
    { id: "shares", label: `Shares (${lots().length})` },
    { id: "cash", label: "Cash" },
  ];
  return (
    <div class="holdings-panel">
      <div class="hp-seg" role="tablist" aria-label="holdings sections">
        {segs().map((s) => (
          <button
            type="button"
            role="tab"
            aria-selected={seg() === s.id}
            classList={{ "hp-seg-btn": true, active: seg() === s.id }}
            onClick={() => setSeg(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <Show when={seg() === "cash"}>
        <div class="hp-cash-big">
          <div class="hp-cash-free-line">
            <span>free to sell puts</span>
            <b>{money(freeCash())}</b>
          </div>
          <Show when={!hpEditingCash()} fallback={<CashEditor onDone={() => hpSetEditingCash(false)} />}>
            <button type="button" class="btn hp-cash-edit-big" onClick={() => hpSetEditingCash(true)}>edit cash…</button>
          </Show>
          <div class="hp-cash-row"><span>account cash</span><b>{money(cashBal())}</b></div>
          <div class="hp-cash-row"><span>reserved by {puts().length} open puts (strike × 100 × contracts)</span><b>{money(reserved())}</b></div>
        </div>
      </Show>
      <Show when={seg() === "puts"}>
        <div class="hp-toolbar-row">
          <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>+ Sell put</button>
          <button type="button" class="btn holdings-refresh" onClick={refreshMarks}>⟳<span class="holdings-refresh-label"> Refresh marks</span></button>
        </div>
        <Show when={dialog()?.type === "addPut"} keyed><AddPutDialog /></Show>
        <div class="holdings-cards"><For each={byUrgency(putsV())}>{(x) => (
          <div class="hp-slot">
            <PutCard x={x} />
            <Show when={dialogFor("put", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
          </div>
        )}</For></div>
      </Show>
      <Show when={seg() === "calls"}>
        <div class="hp-toolbar-row">
          <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>+ Sell call</button>
        </div>
        <Show when={dialog()?.type === "addCall"} keyed><AddCallDialog /></Show>
        <Show when={calls().length === 0}>
          <div class="hp-hint">Sell calls from a share lot's “sell call…” button, or the + Sell call button above.</div>
        </Show>
        <div class="holdings-cards"><For each={byUrgency(callsV())}>{(x) => (
          <div class="hp-slot">
            <CallCard x={x} />
            <Show when={dialogFor("call", x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
          </div>
        )}</For></div>
      </Show>
      <Show when={seg() === "shares"}>
        <div class="hp-toolbar-row">
          <button type="button" class="btn" onClick={() => setDialog({ type: "addLot" })}>+ New lot</button>
        </div>
        <Show when={dialog()?.type === "addLot"} keyed><AddLotDialog /></Show>
        <div class="holdings-cards"><For each={lots()}>{(l) => (
          <div class="hp-slot">
            <LotCard l={l} />
            <Show when={dialogFor("sellCall", l.id)} keyed>{(d) => <SellCallDialog d={d} />}</Show>
          </div>
        )}</For></div>
      </Show>
    </div>
  );
}

/* module-level edit flag for B's cash view (A/C own theirs locally) */
const [hpEditingCash, hpSetEditingCash] = createSignal(false);

function VariantWheel() {
  const merged = () => byUrgency([...putsV(), ...callsV()]);
  const [editing, setEditing] = createSignal(false);
  return (
    <div class="holdings-panel hp-wheel">
      <aside class="hp-rail">
        <div class="hp-rail-block">
          <div class="hp-rail-label">free to sell puts</div>
          <div class="hp-rail-big">{money(freeCash())}</div>
          <div class="hp-rail-sub">{money(cashBal())} cash − {money(reserved())} reserved</div>
          <Show when={!editing()} fallback={<CashEditor onDone={() => setEditing(false)} />}>
            <button type="button" class="btn-ghost hp-cash-edit" onClick={() => setEditing(true)}>edit cash</button>
          </Show>
        </div>
        <div class="hp-rail-block">
          <div class="hp-rail-label">the wheel</div>
          <div class="hp-rail-row"><span>open puts</span><b>{puts().length}</b></div>
          <div class="hp-rail-row"><span>open covered calls</span><b>{calls().length}</b></div>
          <div class="hp-rail-row"><span>share lots</span><b>{lots().length}</b></div>
          <div class="hp-rail-row"><span>shares held</span><b>{lots().reduce((n, l) => n + l.shares, 0)}</b></div>
        </div>
        <div class="hp-rail-block">
          <div class="hp-rail-label">lots</div>
          <div class="hp-rail-sub">last price {ageText(spotsAsOf())} (Tiger)</div>
          <Show when={dialog()?.type === "addLot"} keyed><AddLotDialog /></Show>
          <For each={lots()}>
            {(l) => {
              const spot = () => spots()[l.symbol] ?? 0;
              const basis = () => l.basis_per_share * l.shares;
              const pl = () => spot() * l.shares - basis();
              const plPct = () => (basis() > 0 ? pl() / basis() : 0);
              return (
                <div class="hp-slot">
                <div class="hp-lot-row">
                  <div class="hp-lot-row-top">
                    <span>{l.shares} sh {l.symbol}</span>
                    <b>{spot() > 0 ? money2(spot()) : "—"}</b>
                  </div>
                  <div class="hp-lot-row-sub">
                    <span>bought {money2(l.basis_per_share)} · {l.acquired}</span>
                    <b class={pl() >= 0 ? "holdings-pos" : "holdings-neg"}>
                      {money(pl())} ({plPct() >= 0 ? "+" : ""}{pct(plPct(), 1)})
                    </b>
                  </div>
                </div>
                <Show when={dialogFor("sellCall", l.id)} keyed>{(d) => <SellCallDialog d={d} />}</Show>
                </div>
              );
            }}
          </For>
          <button type="button" class="btn-ghost hp-cash-edit" onClick={() => setDialog({ type: "addLot" })}>+ New lot</button>
        </div>
      </aside>
      <div class="hp-list">
        <div class="hp-toolbar-row">
          <button type="button" class="btn" onClick={() => setDialog({ type: "addPut" })}>+ Sell put</button>
          <button type="button" class="btn" onClick={() => setDialog({ type: "addCall" })}>+ Sell call</button>
          <button type="button" class="btn holdings-refresh" onClick={refreshMarks}>⟳<span class="holdings-refresh-label"> Refresh marks</span></button>
        </div>
        <Show when={dialog()?.type === "addPut"} keyed><AddPutDialog /></Show>
        <Show when={dialog()?.type === "addCall"} keyed><AddCallDialog /></Show>
        <div class="hp-list-row hp-list-head">
          <span>position</span><span>P&L</span><span>pace</span><span>status</span><span />
        </div>
        <For each={merged()}>
          {(x) => (
            <div class="hp-slot">
            <div class="hp-list-row" classList={{ "hp-row-met": x.v.pace_met }}>
              <span class="hp-list-pos">
                <span class="hp-kind" data-kind={x.p.kind}>{x.p.kind.toUpperCase()}</span>
                <b>{x.p.symbol} {x.p.strike}{x.p.kind === "put" ? "P" : "C"}</b>
                <i>×{x.p.contracts} · exp {x.p.expiry}</i>
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
                <Show when={x.p.kind === "call" && x.v.spot_pct_vs_strike != null && x.v.spot_pct_vs_strike > 0}>
                  <span class="chip high">ITM — called away?</span>
                </Show>
              </span>
              <button
                type="button"
                class="btn-ghost holdings-close-btn"
                onClick={() => setDialog({ type: x.p.kind, pos: x.p })}
              >
                close…
              </button>
              {/* Full card stats — same grid the A/B cards use (inherits the
                  production 2×2 mobile collapse). */}
              <div class="holdings-card-stats hp-list-stats">
                <div><span>sold at</span><b>{money2(x.p.premium)}</b></div>
                <div>
                  <span>now (mid)</span>
                  <b>{x.p.mark == null ? "—" : x.p.mark.mid.toFixed(2)}</b>
                  <i>{x.p.mark == null ? "unpriced" : ageText(x.p.mark.as_of)}</i>
                </div>
                <div>
                  <span>spot</span>
                  <Show when={x.p.mark?.underlying_price != null} fallback={<b>—</b>}>
                    <b>{x.p.mark.underlying_price.toFixed(2)}</b>
                    <i
                      class={
                        (x.p.kind === "call"
                          ? x.v.spot_pct_vs_strike > 0
                          : x.v.spot_pct_vs_strike < 0)
                          ? "holdings-neg"
                          : "holdings-pos"
                      }
                    >
                      {x.v.spot_pct_vs_strike == null
                        ? ""
                        : `${x.v.spot_pct_vs_strike >= 0 ? "+" : ""}${pct(x.v.spot_pct_vs_strike, 1)} vs strike`}
                    </i>
                  </Show>
                </div>
                <div>
                  <span>close captures</span>
                  <b class={x.v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
                    {x.v.pl_dollars == null ? "—" : money2(x.v.pl_dollars)}
                  </b>
                </div>
              </div>
            </div>
            <Show when={dialogFor(x.p.kind, x.p.id)} keyed>{(d) => <ClosePanel d={d} />}</Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

/* ── floating switcher ── */

const VARIANTS = [
  { id: "A", name: "stacked sections", Comp: VariantSections },
  { id: "B", name: "tabs", Comp: VariantTabs },
  { id: "C", name: "wheel rail", Comp: VariantWheel },
];

function ProtoSwitcher(props) {
  const setVariant = (id) => {
    props.setVariant(id);
    const url = new URL(window.location);
    url.searchParams.set("variant", id);
    if (window.location.protocol !== "file:") history.replaceState(null, "", url);
  };
  const cycle = (dir) => {
    const i = VARIANTS.findIndex((v) => v.id === props.variant());
    setVariant(VARIANTS[(i + dir + VARIANTS.length) % VARIANTS.length].id);
  };
  onMount(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    };
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });
  return (
    <div class="hp-switcher" aria-label="prototype variant switcher">
      <span class="hp-switcher-tag">PROTOTYPE</span>
      <button type="button" onClick={() => cycle(-1)} aria-label="previous variant">←</button>
      <span class="hp-switcher-label">
        {props.variant()} ({VARIANTS.find((v) => v.id === props.variant())?.name})
      </span>
      <button type="button" onClick={() => cycle(1)} aria-label="next variant">→</button>
    </div>
  );
}

const PROTO_CSS = `
.hp-scroll{overflow:auto;flex:1 1 auto;min-height:0}
.hp-cash{display:flex;gap:1.25rem;align-items:baseline;flex-wrap:wrap;background:var(--panel);
  border:1px solid var(--border);border-radius:10px;padding:.6rem .9rem;margin-bottom:.6rem}
.hp-cash span{display:block;font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.04em}
.hp-cash b{font-size:1rem}
.hp-cash-free b{color:var(--ok,#5fd08a)}
.hp-cash-edit{margin-left:auto;font-size:.75rem}
.hp-cash-editor{margin-left:auto;display:flex;gap:.35rem;align-items:center}
.hp-cash-editor input{width:9rem;font:inherit;padding:.25rem .45rem;border:1px solid var(--border);
  border-radius:6px;background:var(--panel);color:inherit}
.hp-section-head{margin:1.1rem 0 .5rem;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;opacity:.85;
  display:flex;align-items:center;gap:.5rem}
.hp-count{display:inline-block;min-width:1.3rem;text-align:center;background:rgba(127,127,127,.18);
  border-radius:99px;font-size:.72rem;padding:.05rem .4rem}
.hp-section-add{font-size:.72rem}
.hp-toolbar-row{display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem}
.hp-hint{font-size:.8rem;opacity:.6;padding:.4rem 0}
.hp-seg{display:flex;gap:.25rem;margin-bottom:.9rem;background:rgba(127,127,127,.12);
  border-radius:10px;padding:.25rem;width:max-content}
.hp-seg-btn{border:0;background:transparent;color:inherit;padding:.35rem .8rem;border-radius:8px;
  cursor:pointer;font-size:.85rem}
.hp-seg-btn.active{background:rgba(127,127,127,.25);font-weight:600}
.hp-cash-big{background:var(--panel);border:1px solid var(--border);
  border-radius:10px;padding:1rem 1.1rem;max-width:26rem;margin-bottom:.8rem}
.hp-cash-free-line span{font-size:.7rem;opacity:.6;text-transform:uppercase}
.hp-cash-free-line b{display:block;font-size:2rem;color:var(--ok,#5fd08a)}
.hp-cash-row{display:flex;justify-content:space-between;gap:1rem;padding:.3rem 0;font-size:.85rem;
  border-top:1px solid var(--border)}
.hp-cash-edit-big{margin-top:.7rem}
.hp-wheel{display:grid;grid-template-columns:16rem 1fr;gap:1.1rem;align-items:start}
@media (max-width:900px){.hp-wheel{grid-template-columns:1fr}.hp-wheel .hp-rail{position:static}}
.hp-rail{display:flex;flex-direction:column;gap:.7rem;position:sticky;top:0}
.hp-rail-block{background:var(--panel);border:1px solid var(--border);
  border-radius:10px;padding:.7rem .9rem}
.hp-rail-label{font-size:.68rem;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.3rem}
.hp-rail-big{font-size:1.6rem;font-weight:700;color:var(--ok,#5fd08a)}
.hp-rail-sub{font-size:.72rem;opacity:.6;margin-top:.15rem}
.hp-rail-row{display:flex;justify-content:space-between;gap:.6rem;padding:.22rem 0;font-size:.82rem}
.hp-lot-row{padding:.28rem 0;border-bottom:1px solid var(--border)}
.hp-lot-row-top{display:flex;justify-content:space-between;gap:.6rem;font-size:.85rem}
.hp-lot-row-top b{font-variant-numeric:tabular-nums}
.hp-lot-row-sub{display:flex;justify-content:space-between;gap:.6rem;font-size:.72rem;opacity:.78;margin-top:.1rem}
.hp-lot-row-sub b{font-variant-numeric:tabular-nums}
.hp-list{display:flex;flex-direction:column;gap:.35rem}
.hp-list-row{display:grid;grid-template-columns:minmax(14rem,1.4fr) 5rem minmax(9rem,1fr) 8rem auto;
  gap:.8rem;align-items:center;background:var(--panel);border:1px solid var(--border);
  border-radius:10px;padding:.55rem .8rem}
.hp-list-row.hp-row-met{border-color:var(--ok,#5fd08a)}
.hp-list-head{background:transparent;border:0;padding:.1rem .8rem;font-size:.68rem;opacity:.55;
  text-transform:uppercase;letter-spacing:.05em}
.hp-list-pos{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}
.hp-list-pos i,.hp-list-pace i{font-style:normal;font-size:.72rem;opacity:.6}
.hp-kind{font-size:.6rem;font-weight:700;letter-spacing:.06em;border-radius:5px;padding:.1rem .35rem}
.hp-kind[data-kind="put"]{background:rgba(96,165,250,.18);color:#7fb5f5}
.hp-kind[data-kind="call"]{background:rgba(251,191,36,.16);color:#e8b84a}
.hp-list-pace .holdings-bar{min-width:7rem}
.hp-slot{display:flex;flex-direction:column;gap:.45rem;min-width:0}
.hp-list-status{display:flex;flex-direction:column;gap:.25rem;align-items:flex-start}
.hp-list-stats{grid-column:1/-1;margin-top:.15rem}
.hp-dialog-note{font-size:.72rem;opacity:.65;margin-top:.5rem;border-top:1px solid var(--border);padding-top:.4rem}
.hp-switcher{position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:60;
  display:flex;gap:.4rem;align-items:center;background:#0b0d12;color:#eef2f8;border:1px solid #2a3140;
  border-radius:99px;padding:.35rem .6rem;box-shadow:0 6px 24px rgba(0,0,0,.5);font-size:.85rem}
.hp-switcher button{border:0;background:rgba(255,255,255,.08);color:inherit;border-radius:99px;
  width:1.7rem;height:1.7rem;cursor:pointer;font-size:.9rem}
.hp-switcher-label{min-width:11rem;text-align:center}
.hp-switcher-tag{font-size:.58rem;font-weight:800;letter-spacing:.12em;color:#e8b84a;
  border:1px solid #e8b84a;border-radius:5px;padding:.05rem .3rem;margin-left:.2rem}
@media (max-width:720px){
  .hp-list-row.hp-list-head{display:none}
  /* list-first stacking for the wheel lives in the 900px rule above */
  .hp-list-row{display:flex;flex-direction:column;align-items:stretch;gap:.45rem}
  .hp-list-pos{justify-content:space-between}
  .hp-list-pace{display:flex;flex-direction:column;gap:.15rem}
  .hp-list-status{flex-direction:row;flex-wrap:wrap}
  .hp-list-row .holdings-close-btn{align-self:flex-end}
  .hp-rail{position:static}
  .hp-seg{overflow-x:auto;max-width:100%}
  .hp-cash{gap:.75rem}
  .hp-cash-editor{margin-left:0}
  .hp-cash-editor input{width:7rem}
  .hp-switcher-label{min-width:8rem;font-size:.78rem}
}
`;

/* ── root: flash + dialogs + active variant + switcher ── */

export default function ProtoRoot() {
  const initial =
    new URLSearchParams(window.location.search).get("variant") ?? "A";
  const [variant, setVariant] = createSignal(
    VARIANTS.some((v) => v.id === initial) ? initial : "A"
  );
  const Active = () => VARIANTS.find((v) => v.id === variant())?.Comp ?? VariantSections;
  return (
    <>
      <style>{PROTO_CSS}</style>
      <Show when={flashMsg()}>
        <div class="holdings-notice">{flashMsg()}</div>
      </Show>
      {/* Dynamic, not <Active />: a plain component reference is resolved
          once in Solid and never re-renders on variant changes. Dialogs
          render inline under the position that opened them — see
          dialogFor()/ClosePanel() in each variant. */}
      <Dynamic component={Active()} />
      <ProtoSwitcher variant={variant} setVariant={setVariant} />
    </>
  );
}
