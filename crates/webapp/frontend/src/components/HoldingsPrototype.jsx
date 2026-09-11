/* ═══ PROTOTYPE — throwaway, do not ship ══════════════════════════════════
   Question: what should the "currently holding puts" management UI look like?

   Three radically different variants of the holdings view, switchable via
   ?variant=A|B|C (floating bottom bar + arrow keys) on the dev-only
   "Holdings · proto" tab. Mounted from App.jsx only under import.meta.env.DEV.

   Everything here is stubbed in memory per the prototype rules:
   - the ledger lives in a createSignal (no persistence, no /api/holdings)
   - "Refresh marks" does a fake random walk on each mid price
   - pace math is a stub port of the confirmed design rule:
       profit% >= (elapsed working days / total working days) * 100
   Capture the winning bits into the real implementation, then delete this
   file (capture on a throwaway branch, not main).
   ════════════════════════════════════════════════════════════════════════ */

import { For, Show, createSignal, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

/* ── stub pace math (mirrors the confirmed design rule) ─────────────────── */

function isWeekend(d) {
  const wd = d.getDay();
  return wd === 0 || wd === 6;
}

// Working days strictly after `from`, up to and including `to` (date-only).
// Local-midnight dates throughout; never toISOString (it shifts a day for
// UTC-negative/positive-offset viewers).
function workingDays(from, to) {
  let n = 0;
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(23, 59, 59, 999);
  while (true) {
    d.setDate(d.getDate() + 1);
    if (d > end) break;
    if (!isWeekend(d)) n += 1;
  }
  return n;
}

// Local-date ISO stamp (YYYY-MM-DD) for display.
const isoLocal = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

// Derived view per position, given the ledger's stored marks.
function viewOf(p) {
  const today = new Date();
  const anchor = today > p.expiry ? p.expiry : today;
  const daysElapsed = Math.min(
    workingDays(p.sold, anchor),
    workingDays(p.sold, p.expiry)
  );
  const daysTotal = workingDays(p.sold, p.expiry);
  const plPerShare = p.premium - p.mid;
  const plDollars = plPerShare * 100 * p.contracts;
  const plPct = p.premium > 0 ? plPerShare / p.premium : 0;
  // 1-day floor: day 0 earns a full day's target — theta decays fastest
  // upfront, and a gap/IV-crush drop on sell day is a real close signal.
  const targetPct =
    daysTotal > 0 ? Math.max(daysElapsed, 1) / daysTotal : 0;
  const pacePerDayPct = daysElapsed > 0 ? plPct / daysElapsed : 0;
  const pacePerDayDollar = daysElapsed > 0 ? plDollars / daysElapsed : 0;
  // Pace rule needs a mark; the 1-day floor in targetPct already handles
  // the day-0 case, so no extra elapsed gate here.
  const paceMet = p.mid !== null && plPct >= targetPct;
  const ageSecs = p.midAt ? Math.max(0, (Date.now() - p.midAt) / 1000) : null;
  return {
    daysElapsed,
    daysTotal,
    plDollars,
    plPct,
    targetPct,
    pacePerDayPct,
    pacePerDayDollar,
    paceMet,
    ageSecs,
  };
}

function ageText(secs) {
  if (secs === null) return "no mark";
  const m = Math.floor(secs / 60);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `about ${h} h ago`;
}

const money = (v) =>
  (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;

/* ── stub ledger store (in memory only) ─────────────────────────────────── */

// Stub positions are dated RELATIVE TO TODAY so the demo always shows live
// elapsed/total numbers: sold N working days ago, expiring M working days
// after the sell date.
function wdAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (n > 0) {
    d.setDate(d.getDate() - 1);
    if (!isWeekend(d)) n -= 1;
  }
  return d;
}
function wdAfter(date, n) {
  const d = new Date(date);
  while (n > 0) {
    d.setDate(d.getDate() + 1);
    if (!isWeekend(d)) n -= 1;
  }
  return d;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// The user's example shape: sold 3 working days ago (2 working days
// elapsed), 5 working days to expiry, $1.00 → $0.50 mid ⇒ +50% vs a 40%
// target (2/5) ⇒ pace met.
const STUB_POSITIONS = () => [
  {
    id: "p1",
    symbol: "GOOG",
    strike: 350,
    expiry: wdAfter(wdAgo(3), 5),
    sold: wdAgo(3),
    premium: 1.0,
    contracts: 1,
    mid: 0.5,
    midAt: Date.now() - 11 * 60_000,
  },
  {
    id: "p2",
    symbol: "AAPL",
    strike: 230,
    expiry: wdAfter(wdAgo(6), 10),
    sold: wdAgo(6),
    premium: 3.2,
    contracts: 2,
    mid: 2.9,
    midAt: Date.now() - 40 * 60_000,
  },
  {
    id: "p3",
    symbol: "TSLA",
    strike: 420,
    expiry: wdAfter(wdAgo(1), 4),
    sold: wdAgo(1),
    premium: 4.5,
    contracts: 1,
    mid: 2.2,
    midAt: Date.now() - 3 * 60_000,
  },
  {
    id: "p4",
    symbol: "NVDA",
    strike: 180,
    expiry: wdAfter(wdAgo(4), 5),
    sold: wdAgo(4),
    premium: 2.0,
    contracts: 3,
    mid: 0.3,
    midAt: Date.now() - 90 * 60_000,
  },
  {
    id: "p5",
    symbol: "MSFT",
    strike: 500,
    expiry: wdAfter(wdAgo(3), 20),
    sold: wdAgo(3),
    premium: 6.5,
    contracts: 1,
    mid: 6.1,
    midAt: Date.now() - 25 * 60_000,
  },
];

function createLedgerStore() {
  const [positions, setPositions] = createSignal(STUB_POSITIONS());
  const [notice, setNotice] = createSignal("");
  let nextId = 100;

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  };

  const addPosition = (fields) => {
    const p = {
      id: `p${nextId++}`,
      symbol: fields.symbol.toUpperCase(),
      strike: Number(fields.strike),
      expiry: new Date(fields.expiry + "T00:00:00"),
      sold: new Date(fields.sold + "T00:00:00"),
      premium: Number(fields.premium),
      contracts: Number(fields.contracts),
      // No mark yet: refresh assigns one. Start unmarked to show staleness.
      mid: null,
      midAt: null,
    };
    setPositions((ps) => [...ps, p]);
    flash(`Added ${p.symbol} ${p.strike} — press Refresh marks to price it.`);
  };

  const closePosition = (id, outcome, closePrice) => {
    const p = positions().find((x) => x.id === id);
    if (!p) return;
    const v = viewOf(p);
    const realized =
      outcome === "expired"
        ? p.premium * 100 * p.contracts
        : outcome === "assigned"
          ? (p.strike - (closePrice ?? p.strike) + p.premium) * 100 * p.contracts
          : ((p.premium - (closePrice ?? p.mid ?? 0)) * 100 * p.contracts);
    setPositions((ps) => ps.filter((x) => x.id !== id));
    flash(
      `Closed ${p.symbol} ${p.strike} (${outcome}) — realized ${money(realized)}.`
    );
  };

  const refreshMarks = () => {
    setPositions((ps) =>
      ps.map((p) => {
        if (p.mid === null) {
          // First-ever mark: pretend Tiger quoted around 60–90% of premium.
          return { ...p, mid: p.premium * (0.6 + Math.random() * 0.3), midAt: Date.now() };
        }
        // Random walk ±12% of current mid, clamped to [0.05, premium+0.5].
        const next = Math.min(
          Math.max(0.05, p.mid * (1 + (Math.random() - 0.5) * 0.24)),
          p.premium + 0.5
        );
        return { ...p, mid: next, midAt: Date.now() };
      })
    );
    flash("Marks refreshed (simulated Tiger mid).");
  };

  return { positions, addPosition, closePosition, refreshMarks, notice };
}

/* ── shared small pieces ────────────────────────────────────────────────── */

function AddForm(props) {
  // props: onAdd, layout ("row" | "tile" | "panel")
  const [open, setOpen] = createSignal(props.layout === "row");
  const [f, setF] = createSignal({
    symbol: "",
    strike: "",
    premium: "",
    contracts: "1",
    sold: isoLocal(new Date()),
    expiry: isoLocal(addDays(new Date(), 7)),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!f().symbol) return;
    if (![f().strike, f().premium, f().contracts].every((x) => Number(x) > 0)) return;
    props.onAdd(f());
    setF({ ...f(), symbol: "", strike: "", premium: "" });
    if (props.layout !== "row") setOpen(false);
  };
  return (
    <Show
      when={open()}
      fallback={
        <button type="button" class="btn" onClick={() => setOpen(true)}>
          + New position
        </button>
      }
    >
      <form class={`proto-add proto-add-${props.layout}`} onSubmit={submit}>
        <label>
          symbol <input placeholder="SYMBOL" value={f().symbol} onInput={set("symbol")} />
        </label>
        <label>
          strike
          {/* text + inputmode, not type=number: number inputs sanitize the
              in-progress "." on every keystroke, so decimals can't be typed. */}
          <input inputmode="decimal" placeholder="e.g. 350.00" value={f().strike} onInput={set("strike")} />
        </label>
        <label>
          premium
          <input inputmode="decimal" placeholder="e.g. 1.00" value={f().premium} onInput={set("premium")} />
        </label>
        <label>
          contracts <input type="number" min="1" value={f().contracts} onInput={set("contracts")} />
        </label>
        <label>
          sold <input type="date" value={f().sold} onInput={set("sold")} />
        </label>
        <label>
          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
        </label>
        <button type="submit" class="btn btn-primary">Add</button>
        <Show when={props.layout !== "row"}>
          <button type="button" class="btn" onClick={() => setOpen(false)}>Cancel</button>
        </Show>
      </form>
    </Show>
  );
}

function OutcomeDialog(props) {
  // props: position, view, onClose (dismiss), onConfirm(outcome, price)
  const [outcome, setOutcome] = createSignal("bought-back");
  const [price, setPrice] = createSignal(props.position.mid?.toFixed(2) ?? "");
  return (
    <div class="proto-outcome">
      <div class="proto-outcome-head">
        Close {props.position.symbol} {props.position.strike}
      </div>
      <div class="proto-outcome-row">
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
        <label class="proto-outcome-price">
          close price/share
          <input inputmode="decimal" value={price()} onInput={(e) => setPrice(e.target.value)} />
        </label>
      </Show>
      <div class="proto-outcome-actions">
        <button type="button" class="btn" onClick={props.onClose}>Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => props.onConfirm(outcome(), outcome() === "expired" ? null : Number(price()))}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

function NoticeLine(props) {
  return <Show when={props.text()}><div class="proto-notice">{props.text()}</div></Show>;
}

/* ── Variant A: dense ledger table (matches the app's table DNA) ────────── */

export function VariantLedger(props) {
  const { ledger } = props;
  const [closing, setClosing] = createSignal(null);
  const rows = () => ledger.positions().map((p) => ({ p, v: viewOf(p) }));
  return (
    <div class="proto-pane">
      <div class="proto-toolbar">
        <AddForm layout="row" onAdd={ledger.addPosition} />
        <button type="button" class="btn" onClick={ledger.refreshMarks}>
          ⟳ Refresh marks
        </button>
      </div>
      <NoticeLine text={ledger.notice} />
      <div class="proto-scroll">
      <table class="proto-ledger">
        <thead>
          <tr>
            <th>Underlying</th>
            <th>Strike</th>
            <th>Expiry</th>
            <th>Sold</th>
            <th>Premium</th>
            <th>Mid (age)</th>
            <th>P&amp;L $</th>
            <th>P&amp;L %</th>
            <th>Days</th>
            <th>Pace $/day</th>
            <th>Target</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <For each={rows()}>
            {({ p, v }) => (
              <tr classList={{ "proto-row-met": v.paceMet }}>
                <td class="proto-strong">{p.symbol}</td>
                <td>{p.strike.toFixed(0)}</td>
                <td>{isoLocal(p.expiry)}</td>
                <td>{isoLocal(p.sold)}</td>
                <td>{p.premium.toFixed(2)}</td>
                <td>
                  <Show when={p.mid !== null} fallback={<span class="proto-stale">unpriced</span>}>
                    {p.mid.toFixed(2)}{" "}
                    <span class="proto-age">{ageText(v.ageSecs)}</span>
                  </Show>
                </td>
                <td class={v.plDollars >= 0 ? "proto-pos" : "proto-neg"}>
                  {p.mid === null ? "—" : money(v.plDollars)}
                </td>
                <td class={v.plPct >= 0 ? "proto-pos" : "proto-neg"}>
                  {p.mid === null ? "—" : pct(v.plPct, 1)}
                </td>
                <td>
                  {v.daysElapsed}/{v.daysTotal}
                </td>
                <td>{p.mid === null ? "—" : money(v.pacePerDayDollar)}</td>
                <td>{pct(v.targetPct)}</td>
                <td>
                  <span class="chip" classList={{ high: v.paceMet }}>
                    {v.paceMet ? "PACE MET" : "holding"}
                  </span>{" "}
                  <button type="button" class="btn-ghost proto-close-btn" onClick={() => setClosing(p)}>
                    close…
                  </button>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      </div>
      <Show when={closing()}>
        <OutcomeDialog
          position={closing()}
          onClose={() => setClosing(null)}
          onConfirm={(o, price) => {
            ledger.closePosition(closing().id, o, price);
            setClosing(null);
          }}
        />
      </Show>
      <p class="proto-note">
        Variant A — one dense row per position, same visual language as the
        analyst table. The pace rule reads left-to-right: P&amp;L % vs Target.
      </p>
    </div>
  );
}

/* ── Variant B: urgency cards — the pace bar is the primary affordance ──── */

export function VariantCards(props) {
  const { ledger } = props;
  const [closing, setClosing] = createSignal(null);
  // Most "ahead of pace" first — the buy-back decision sorts the page.
  const sorted = () =>
    [...ledger.positions()]
      .map((p) => ({ p, v: viewOf(p) }))
      .sort((a, b) => b.v.plPct - b.v.targetPct - (a.v.plPct - a.v.targetPct));
  return (
    <div class="proto-pane">
      <div class="proto-toolbar proto-toolbar-actions">
        <AddForm layout="tile" onAdd={ledger.addPosition} />
        <button
          type="button"
          class="btn proto-refresh"
          aria-label="Refresh marks"
          onClick={ledger.refreshMarks}
        >
          ⟳<span class="proto-refresh-label"> Refresh marks</span>
        </button>
      </div>
      <NoticeLine text={ledger.notice} />
      <div class="proto-cards">
        <For each={sorted()}>
          {({ p, v }) => {
            // Bar fills with profit%; a marker sits at the pace target.
            const fill = () => Math.max(0, Math.min(100, v.plPct * 100));
            const mark = () => Math.min(100, v.targetPct * 100);
            return (
              <div class="proto-card" classList={{ "proto-card-met": v.paceMet }}>
                <div class="proto-card-head">
                  <b>{p.symbol} {p.strike}P ×{p.contracts}</b>
                  <span class="proto-age">exp {isoLocal(p.expiry)} · {v.daysElapsed}/{v.daysTotal} wd</span>
                </div>
                <div class="proto-card-big">
                  <span class={v.plPct >= 0 ? "proto-pos" : "proto-neg"}>
                    {p.mid === null ? "—" : pct(v.plPct, 1)}
                  </span>
                  <span class="proto-card-target">target {pct(v.targetPct)}</span>
                </div>
                <div class="proto-bar">
                  <div class="proto-bar-fill" style={{ width: `${p.mid === null ? 0 : fill()}%` }} />
                  <div class="proto-bar-mark" style={{ left: `${mark()}%` }} />
                </div>
                <div class="proto-card-stats">
                  <div>
                    <span>sold at</span>
                    <b>{money(p.premium)}</b>
                  </div>
                  <div>
                    <span>now (mid)</span>
                    <b>{p.mid === null ? "—" : p.mid.toFixed(2)}</b>
                    <i>{v.ageSecs === null ? "" : ageText(v.ageSecs)}</i>
                  </div>
                  <div>
                    <span>close captures</span>
                    <b class={v.plDollars >= 0 ? "proto-pos" : "proto-neg"}>
                      {p.mid === null ? "—" : money(v.plDollars)}
                    </b>
                  </div>
                </div>
                <div class="proto-card-actions">
                  <Show
                    when={v.paceMet}
                    fallback={<span class="chip normal">holding</span>}
                  >
                    <span class="chip high">buy back?</span>
                  </Show>
                  <button type="button" class="btn-ghost proto-close-btn" onClick={() => setClosing(p)}>
                    close…
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </div>
      <Show when={closing()}>
        <OutcomeDialog
          position={closing()}
          onClose={() => setClosing(null)}
          onConfirm={(o, price) => {
            ledger.closePosition(closing().id, o, price);
            setClosing(null);
          }}
        />
      </Show>
      <p class="proto-note">
        Variant B — one card per position, sorted most ahead-of-pace first.
        The bar is the decision: fill vs the tick mark.
      </p>
    </div>
  );
}

/* ── Variant C: focus timeline — decay curve per position ───────────────── */

export function VariantFocus(props) {
  const { ledger } = props;
  const [closing, setClosing] = createSignal(null);
  const list = () => ledger.positions().map((p) => ({ p, v: viewOf(p) }));
  const [selId, setSelId] = createSignal("p1");
  const sel = () => list().find((x) => x.p.id === selId()) ?? list()[0];

  const Chart = () => {
    const s = sel();
    if (!s) return null;
    const { p, v } = s;
    const W = 560, H = 180, PAD = 28;
    const days = v.daysTotal;
    const x = (d) => PAD + (d / Math.max(1, days)) * (W - 2 * PAD);
    const y = (price) => H - PAD - (price / (p.premium * 1.15)) * (H - 2 * PAD);
    // Observed decay: premium at day 0 → today's mid at daysElapsed.
    const obs = [
      `${x(0)},${y(p.premium)}`,
      `${x(v.daysElapsed)},${y(p.mid ?? p.premium)}`,
    ];
    // Straight-line premium decay to zero at expiry (theta's ideal path).
    const ideal = [`${x(0)},${y(p.premium)}`, `${x(days)},${y(0)}`];
    // Where the pace target says you should be today.
    const targetPrice = p.premium * (1 - v.targetPct);
    return (
      <svg class="proto-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="premium decay">
        <line x1={x(0)} y1={y(p.premium)} x2={x(days)} y2={y(0)} class="proto-line-ideal" />
        <polyline points={obs.join(" ")} class="proto-line-obs" />
        <Show when={p.mid !== null}>
          <line x1={PAD} y1={y(targetPrice)} x2={W - PAD} y2={y(targetPrice)} class="proto-line-target" />
          <circle cx={x(v.daysElapsed)} cy={y(p.mid)} r="4" class="proto-dot-now" />
        </Show>
        <text x={x(0)} y={H - 8} class="proto-axis">sold</text>
        <text x={x(days)} y={H - 8} class="proto-axis" text-anchor="end">expiry</text>
        <text x={x(v.daysElapsed)} y={PAD - 10} class="proto-axis" text-anchor="middle">today</text>
      </svg>
    );
  };

  return (
    <div class="proto-pane proto-focus">
      <div class="proto-toolbar">
        <AddForm layout="tile" onAdd={ledger.addPosition} />
        <button type="button" class="btn" onClick={ledger.refreshMarks}>
          ⟳ Refresh marks
        </button>
      </div>
      <NoticeLine text={ledger.notice} />
      <div class="proto-focus-body">
        <nav class="proto-rail">
          <For each={list()}>
            {({ p, v }) => (
              <button
                type="button"
                class="proto-rail-item"
                classList={{ active: sel()?.p.id === p.id, "proto-row-met": v.paceMet }}
                onClick={() => setSelId(p.id)}
              >
                <b>{p.symbol} {p.strike}P</b>
                <span>{p.mid === null ? "unpriced" : pct(v.plPct, 1)} · {v.daysElapsed}/{v.daysTotal} wd</span>
                <Show when={v.paceMet}><span class="chip high">met</span></Show>
              </button>
            )}
          </For>
        </nav>
        <div class="proto-detail">
          <Show when={sel()} fallback={<div class="empty-panel">No positions — add one.</div>}>
            {(s) => {
              const { p, v } = s();
              return (
                <>
                  <div class="proto-detail-head">
                    <h3>{p.symbol} {p.strike}P · sold {isoLocal(p.sold)}, exp {isoLocal(p.expiry)}</h3>
                    <div class="proto-detail-stats">
                      <div><span>premium</span><b>{p.premium.toFixed(2)}</b></div>
                      <div><span>mid</span><b>{p.mid === null ? "—" : p.mid.toFixed(2)}</b></div>
                      <div><span>P&amp;L</span><b class={v.plDollars >= 0 ? "proto-pos" : "proto-neg"}>{p.mid === null ? "—" : `${money(v.plDollars)} (${pct(v.plPct, 1)})`}</b></div>
                      <div><span>pace</span><b>{p.mid === null ? "—" : `${pct(v.pacePerDayPct, 1)}/wd`}</b></div>
                      <div><span>target</span><b>{pct(v.targetPct)}</b></div>
                      <div><span>mark</span><b>{ageText(v.ageSecs)}</b></div>
                    </div>
                  </div>
                  {/* Inline call, not <Chart />: the body reads sel(), so it
                      must run inside a tracked expression to re-draw on
                      selection/ledger changes. */}
                  {Chart()}
                  <div class="proto-detail-actions">
                    <Show when={v.paceMet} fallback={<span class="chip normal">behind / on pace</span>}>
                      <span class="chip high">pace met — buy back?</span>
                    </Show>
                    <button type="button" class="btn" onClick={() => setClosing(p)}>close…</button>
                  </div>
                </>
              );
            }}
          </Show>
        </div>
      </div>
      <Show when={closing()}>
        <OutcomeDialog
          position={closing()}
          onClose={() => setClosing(null)}
          onConfirm={(o, price) => {
            ledger.closePosition(closing().id, o, price);
            setClosing(null);
          }}
        />
      </Show>
      <p class="proto-note">
        Variant C — pick a position on the rail, read its decay: observed
        premium path vs the straight-line ideal and today's pace-target line.
      </p>
    </div>
  );
}

/* ── switcher shell: variants + floating bottom bar + ?variant= param ───── */

const VARIANTS = [
  { key: "A", name: "Ledger table", Component: VariantLedger },
  { key: "B", name: "Urgency cards", Component: VariantCards },
  { key: "C", name: "Focus timeline", Component: VariantFocus },
];

function variantFromUrl() {
  const v = new URLSearchParams(window.location.search).get("variant");
  return VARIANTS.some((x) => x.key === v) ? v : "A";
}

export default function HoldingsPrototype() {
  const ledger = createLedgerStore();
  const [current, setCurrent] = createSignal(variantFromUrl());

  const cycle = (dir) => {
    const i = VARIANTS.findIndex((x) => x.key === current());
    const next = VARIANTS[(i + dir + VARIANTS.length) % VARIANTS.length];
    setCurrent(next.key);
    const url = new URL(window.location);
    url.searchParams.set("variant", next.key);
    history.replaceState(null, "", url);
  };

  // Arrow keys cycle variants — unless the user is typing in a field.
  const onKey = (e) => {
    const t = e.target;
    if (
      t instanceof HTMLInputElement ||
      t instanceof HTMLTextAreaElement ||
      t?.isContentEditable
    ) {
      return;
    }
    if (e.key === "ArrowLeft") cycle(-1);
    if (e.key === "ArrowRight") cycle(1);
  };
  window.addEventListener("keydown", onKey);
  onCleanup(() => window.removeEventListener("keydown", onKey));

  // Dynamic, not a plain <Active />: a component picked by a signal must
  // re-mount when the signal changes — plain JSX identifiers evaluate once.
  const activeComponent = () =>
    (VARIANTS.find((x) => x.key === current()) ?? VARIANTS[0]).Component;

  return (
    <div class="proto-root">
      <Dynamic component={activeComponent()} ledger={ledger} />
      <div class="proto-switcher" role="toolbar" aria-label="prototype variants">
        <button type="button" class="proto-sw-btn" onClick={() => cycle(-1)} aria-label="previous variant">←</button>
        <span class="proto-sw-label">
          PROTOTYPE · {current()} ({VARIANTS.find((x) => x.key === current())?.name})
        </span>
        <button type="button" class="proto-sw-btn" onClick={() => cycle(1)} aria-label="next variant">→</button>
      </div>
    </div>
  );
}
