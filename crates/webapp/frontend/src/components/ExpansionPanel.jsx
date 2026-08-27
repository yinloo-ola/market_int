// Row expansion (spec §6.4): four blocks — strike-position-in-band chart,
// premium economics, score breakdown from the SERVER-computed components
// (degrading to total-only), and one chip per currently-hidden column.
// An amber earnings banner shows whenever `earnings_before_expiry` is set.

import { For, Show } from "solid-js";

import Tip from "./Tip";
import { comma, formatCell, isNullValue, NULL_MARK } from "../lib/format";
import { tipText } from "../lib/tips";

// Score weights are part of the frozen scoring contract (§6.4 labels them in
// the canonical tooltip copy) — used to scale each component bar as a
// fraction of its maximum contribution.
const WEIGHTS = { sharpe: 0.2, safety: 0.4, return_part: 0.4 };

function money(v, dp = 2) {
  if (isNullValue(v)) return NULL_MARK;
  return `$${Number(v).toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
}

function labelled(key, thresholds, valueEl) {
  return (
    <div class="kv">
      <span class="kv-label">
        <Tip text={tipText(key, thresholds)}>
          <span class="tip-target">{key.replace(/_/g, " ")}</span>
        </Tip>
      </span>
      <span class="kv-value">{valueEl}</span>
    </div>
  );
}

function BandChart(props) {
  // props.row — strike/strike_from/strike_to/underlying_price/mid
  const r = props.row;
  const width = r.strike_to - r.strike_from;
  const depth =
    width > 0 ? (r.strike_to - r.strike) / width : null;
  const breakEven = isNullValue(r.mid) ? null : r.strike - r.mid;
  const cushion =
    breakEven != null && !isNullValue(r.underlying_price) && r.underlying_price !== 0
      ? ((r.underlying_price - breakEven) / r.underlying_price) * 100
      : null;

  // Axis: strike_from → max(spot, strike_to) × 1.005 (spec §6.4). Degenerate
  // bands render the key/value rows only.
  const lo = r.strike_from;
  const hiRaw = Math.max(r.underlying_price ?? r.strike_to, r.strike_to) * 1.005;
  const hi = Math.max(hiRaw, lo);
  const usable = !isNullValue(lo) && hi > lo && !isNullValue(r.strike);
  const posOf = (v) => {
    if (isNullValue(v)) return null;
    const p = ((v - lo) / (hi - lo)) * 100;
    return Math.min(100, Math.max(0, p));
  };
  const markers = usable
    ? [
        { cls: "mk-strike", label: "strike", v: r.strike },
        { cls: "mk-be", label: "break-even", v: breakEven },
        { cls: "mk-spot", label: "spot", v: r.underlying_price },
      ].filter((m) => posOf(m.v) != null)
    : [];

  return (
    <div class="exp-block">
      <h4>
        <Tip text={tipText("band_range", props.thresholds)}>
          <span class="tip-target">Strike position in band</span>
        </Tip>
      </h4>
      <Show when={usable} fallback={<div class="kv-value">Band unavailable (∅)</div>}>
        <div class="band-chart" role="img" aria-label="strike position inside scored band">
          {/* shaded scored band */}
          <div
            class="band-shade"
            style={{
              left: `${posOf(r.strike_from)}%`,
              width: `${Math.max(0, posOf(r.strike_to) - posOf(r.strike_from))}%`,
            }}
          />
          <For each={markers}>
            {(m) => (
              <div class={`marker ${m.cls}`} style={{ left: `${posOf(m.v)}%` }}>
                <span class="marker-tick" />
                <span class="marker-cap">
                  {m.label}
                  <br />
                  {formatCell("fixed2", m.v).text}
                </span>
              </div>
            )}
          </For>
        </div>
      </Show>

      {labelled(
        "band_range",
        props.thresholds,
        `${formatCell("fixed2", r.strike_from).text} → ${formatCell("fixed2", r.strike_to).text}`
      )}
      {labelled(
        "band_depth",
        props.thresholds,
        depth == null ? NULL_MARK : `${(depth * 100).toFixed(1)}%`
      )}
      {labelled(
        "cushion_be",
        props.thresholds,
        cushion == null ? NULL_MARK : `${cushion.toFixed(1)}%`
      )}
    </div>
  );
}

function Economics(props) {
  const r = props.row;
  const capital = !isNullValue(r.strike) ? r.strike * 100 : null;
  const premium = !isNullValue(r.mid) ? r.mid * 100 : null;
  const breakeven = premium == null ? null : r.strike - r.mid;
  const ann = formatCell("pct1", r.rate_of_return);

  return (
    <div class="exp-block">
      <h4>Premium economics</h4>
      {labelled("capital", props.thresholds, capital == null ? NULL_MARK : money(capital, 0))}
      {labelled("premium", props.thresholds, premium == null ? NULL_MARK : money(premium))}
      {labelled("breakeven", props.thresholds, breakeven == null ? NULL_MARK : money(breakeven))}
      {labelled("ann_ror", props.thresholds, <b>{ann.text}</b>)}
      {labelled("bid", props.thresholds, formatCell("fixed2", r.bid).text)}
      {labelled("ask", props.thresholds, formatCell("fixed2", r.ask).text)}
      {labelled("expiration", props.thresholds, r.expiration)}
    </div>
  );
}

function ScoreBreakdown(props) {
  const r = props.row;
  const c = r.score_components;

  const bars = [
    { key: "sb_sharpe", label: "Sharpe", weight: WEIGHTS.sharpe, v: c?.sharpe },
    { key: "sb_safety", label: "Band safety", weight: WEIGHTS.safety, v: c?.safety },
    { key: "sb_ret", label: "Return vs ideal", weight: WEIGHTS.return_part, v: c?.return_part },
  ];

  return (
    <div class="exp-block">
      <h4>Score breakdown</h4>
      <Show
        when={c}
        fallback={
          <div class="kv">
            <span class="kv-label">score</span>
            <span class="kv-value"><b>{formatCell("fixed3", r.score).text}</b></span>
            <span class="muted-note">breakdown unavailable for this row</span>
          </div>
        }
      >
        <For each={bars}>
          {(bar) => {
            // Each bar shows the weighted part; fill fraction = part / max
            // contribution for that weight (i.e., the clamped norm itself).
            const norm = isNullValue(bar.v) || bar.weight === 0 ? null : bar.v / bar.weight;
            return (
              <div class="bar-row">
                <span class="bar-label">
                  <Tip text={tipText(bar.key, props.thresholds)}>
                    <span class="tip-target">{bar.label}</span>
                  </Tip>{" "}
                  <span class="bar-weight">({bar.weight * 100}%)</span>
                </span>
                <span class="bar-track">
                  <span
                    class="bar-fill"
                    style={{ width: `${Math.min(100, Math.max(0, (norm ?? 0) * 100))}%` }}
                  />
                </span>
                <span class="num bar-val">{formatCell("fixed3", bar.v).text}</span>
              </div>
            );
          }}
        </For>
        <div class="bar-row total">
          <span class="bar-label">total</span>
          <span class="num bar-val"><b>{formatCell("fixed3", r.score).text}</b></span>
        </div>
        <Show when={r.earnings_before_expiry}>
          <div class="muted-note">earnings-discounted safety applied</div>
        </Show>
      </Show>
    </div>
  );
}

function HiddenChips(props) {
  // One chip per currently-hidden column with its usual formatted value and
  // its header explainer as tooltip.
  const chips = () =>
    props.hiddenDefs.map((def) => ({
      def,
      cell: formatCell(def.kind, def.id === "earnings_before_expiry"
        ? props.row.earnings_before_expiry
        : props.row[def.id]),
    }));

  return (
    <div class="exp-block exp-chips">
      <h4>Hidden columns</h4>
      <For each={chips()}>
        {({ def, cell }) => (
          <span class={`chip-hidden${cell.isNull ? " is-null" : ""}`}>
            <Tip text={tipText(def.id, props.thresholds)}>
              <span class="tip-target">
                {def.label}: {cell.text}
              </span>
            </Tip>
          </span>
        )}
      </For>
      <Show when={props.hiddenDefs.length === 0}>
        <span class="muted-note">all columns visible</span>
      </Show>
    </div>
  );
}

export default function ExpansionPanel(props) {
  // props.row, props.thresholds, props.hiddenDefs
  const r = props.row;
  const e = r.earnings_before_expiry;

  return (
    <div class="expansion">
      <Show when={e}>
        <div class="earnings-banner">
          ⚠ Earnings <b>{e.report_date}</b>
          {" "}
          (<Show when={e.report_time}>{(t) => t().replaceAll("_", " ")}</Show>)
          <Show when={!isNullValue(e.expected_eps)}>
            {" "}· expected EPS {formatCell("fixed2", e.expected_eps).text}
          </Show>
          {" "}—{" "}
          <Tip text={tipText("earnings_before_expiry", props.thresholds)}>
            <span class="tip-target">band safety is already discounted by the earnings rule.</span>
          </Tip>
        </div>
      </Show>

      <div class="exp-grid">
        <BandChart row={r} thresholds={props.thresholds} />
        <Economics row={r} thresholds={props.thresholds} />
        <ScoreBreakdown row={r} thresholds={props.thresholds} />
        <HiddenChips row={r} hiddenDefs={props.hiddenDefs} thresholds={props.thresholds} />
      </div>
    </div>
  );
}
