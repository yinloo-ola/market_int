/* Holdings panel — the currently-holding puts ledger (2026-09-11-holdings),
   variant B ("urgency cards") distilled from the approved prototype.
   The server owns every number: positions arrive with their mark and the
   computed pace view (crates/core/src/holdings.rs); this component renders
   them and drives the four /api/holdings routes via the api.js seam.
   Only the outcome dialog's realized-P&L preview is computed here — it needs
   the close price the user is typing, which the server has not seen. */

import { For, Show, createResource, createSignal } from "solid-js";

import { addHolding, deleteHolding, getHoldings, refreshHoldings } from "../api";

const money = (v) => (v < 0 ? "-$" : "$") + Math.abs(v).toFixed(2);
const pct = (v, dp = 0) => `${(v * 100).toFixed(dp)}%`;

function ageText(rfc3339) {
  if (!rfc3339) return "";
  const secs = Math.max(0, (Date.now() - new Date(rfc3339).getTime()) / 1000);
  const m = Math.floor(secs / 60);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `about ${h} h ago`;
}

function AddForm(props) {
  const today = () => new Date().toISOString().slice(0, 10);
  const in7 = () =>
    new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
  const [open, setOpen] = createSignal(false);
  const [f, setF] = createSignal({
    symbol: "",
    strike: "",
    premium: "",
    contracts: "1",
    sold: today(),
    expiry: in7(),
  });
  const set = (k) => (e) => setF({ ...f(), [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!f().symbol) return;
    if (![f().strike, f().premium, f().contracts].every((x) => Number(x) > 0)) {
      return;
    }
    await props.onAdd({
      symbol: f().symbol,
      strike: Number(f().strike),
      premium: Number(f().premium),
      contracts: Number(f().contracts),
      sold: f().sold,
      expiry: f().expiry,
    });
    setF({ ...f(), symbol: "", strike: "", premium: "" });
    setOpen(false);
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
      <form class="holdings-add" onSubmit={submit}>
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
          contracts <input inputmode="numeric" value={f().contracts} onInput={set("contracts")} />
        </label>
        <label>
          sold <input type="date" value={f().sold} onInput={set("sold")} />
        </label>
        <label>
          expiry <input type="date" value={f().expiry} onInput={set("expiry")} />
        </label>
        <button type="submit" class="btn btn-primary">Add</button>
        <button type="button" class="btn" onClick={() => setOpen(false)}>Cancel</button>
      </form>
    </Show>
  );
}

function OutcomeDialog(props) {
  const [outcome, setOutcome] = createSignal("bought-back");
  const [price, setPrice] = createSignal(props.position.mark?.mid?.toFixed(2) ?? "");
  // Realized P&L preview — the one client-side computation (see file header).
  const realized = () => {
    const p = props.position;
    const close = Number(price());
    if (outcome() === "expired") return p.premium * 100 * p.contracts;
    if (!Number.isFinite(close)) return null;
    if (outcome() === "assigned") {
      return (p.strike - close + p.premium) * 100 * p.contracts;
    }
    return (p.premium - close) * 100 * p.contracts;
  };
  return (
    <div class="holdings-outcome">
      <div class="holdings-outcome-head">
        Close {props.position.symbol} {props.position.strike} ×{props.position.contracts}
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
          close price/share
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

export default function HoldingsPanel() {
  const [ledger, { refetch }] = createResource(getHoldings);
  const [notice, setNotice] = createSignal("");
  const [closing, setClosing] = createSignal(null);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  };

  // Most ahead-of-pace first; unpriced positions sink to the bottom.
  const sorted = () =>
    [...(ledger()?.positions ?? [])]
      .map((p) => ({ p, v: p.view }))
      .sort((a, b) => {
        const key = (x) => (x.v.pl_pct == null ? -Infinity : x.v.pl_pct - x.v.target_pct);
        return key(b) - key(a);
      });

  const onRefresh = async () => {
    try {
      const res = await refreshHoldings();
      const stale = res.refresh?.stale ?? [];
      flash(
        stale.length
          ? `Marks refreshed — ${stale.length} position(s) unpriced (kept last mark).`
          : "Marks refreshed."
      );
    } catch (err) {
      flash(`Refresh failed: ${err.message}`);
    }
    await refetch();
  };

  const onAdd = async (fields) => {
    try {
      const res = await addHolding(fields);
      flash(`Added ${res.position.symbol} ${res.position.strike} — press Refresh marks to price it.`);
    } catch (err) {
      flash(`Add failed: ${err.message}`);
    }
    await refetch();
  };

  const onClose = async (id, outcome, closePrice) => {
    try {
      await deleteHolding(id);
      flash(
        outcome === "expired"
          ? "Position removed (expired worthless — premium kept)."
          : "Position removed."
      );
    } catch (err) {
      flash(`Close failed: ${err.message}`);
    }
    setClosing(null);
    await refetch();
  };

  return (
    <div class="holdings-panel">
      <div class="holdings-toolbar">
        <AddForm onAdd={onAdd} />
        <button type="button" class="btn holdings-refresh" onClick={onRefresh}>
          ⟳<span class="holdings-refresh-label"> Refresh marks</span>
        </button>
      </div>
      <Show when={notice()}>
        <div class="holdings-notice">{notice()}</div>
      </Show>
      <Show when={ledger.error} fallback={null}>
        <div class="error-banner">Holdings API error: {ledger.error.message}</div>
      </Show>
      <Show
        when={sorted().length > 0}
        fallback={<div class="empty-panel">No open positions — press “+ New position” to record one.</div>}
      >
        <div class="holdings-cards">
          <For each={sorted()}>
            {({ p, v }) => (
              <div class="holdings-card" classList={{ "holdings-card-met": v.pace_met }}>
                <div class="holdings-card-head">
                  <b>{p.symbol} {p.strike}P ×{p.contracts}</b>
                  <span class="holdings-age">
                    exp {p.expiry} · {v.days_elapsed}/{v.days_total} wd
                  </span>
                </div>
                <div class="holdings-card-big">
                  <span class={v.pl_pct >= 0 ? "holdings-pos" : "holdings-neg"}>
                    {v.pl_pct == null ? "—" : pct(v.pl_pct, 1)}
                  </span>
                  <span class="holdings-card-target">target {pct(v.target_pct)}</span>
                </div>
                <div class="holdings-bar">
                  <div
                    class="holdings-bar-fill"
                    style={{ width: `${v.pl_pct == null ? 0 : Math.max(0, Math.min(100, v.pl_pct * 100))}%` }}
                  />
                  <div class="holdings-bar-mark" style={{ left: `${Math.min(100, v.target_pct * 100)}%` }} />
                </div>
                <div class="holdings-card-stats">
                  <div>
                    <span>sold at</span>
                    <b>{money(p.premium)}</b>
                  </div>
                  <div>
                    <span>now (mid)</span>
                    <b>{p.mark == null ? "—" : p.mark.mid.toFixed(2)}</b>
                    <Show when={p.mark != null}>
                      <i>{ageText(p.mark.as_of)}</i>
                    </Show>
                    <Show when={p.mark == null}>
                      <i>unpriced</i>
                    </Show>
                  </div>
                  <div>
                    <span>close captures</span>
                    <b class={v.pl_dollars >= 0 ? "holdings-pos" : "holdings-neg"}>
                      {v.pl_dollars == null ? "—" : money(v.pl_dollars)}
                    </b>
                  </div>
                </div>
                <div class="holdings-card-actions">
                  <Show when={v.pace_met} fallback={<span class="chip normal">holding</span>}>
                    <span class="chip high">buy back?</span>
                  </Show>
                  <button type="button" class="btn-ghost holdings-close-btn" onClick={() => setClosing(p)}>
                    close…
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={closing()}>
        <OutcomeDialog
          position={closing()}
          onClose={() => setClosing(null)}
          onConfirm={(outcome, price) => onClose(closing().id, outcome, price)}
        />
      </Show>
    </div>
  );
}
