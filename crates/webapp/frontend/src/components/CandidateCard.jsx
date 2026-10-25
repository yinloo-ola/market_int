import { Show, createMemo } from "solid-js";
import ExpansionPanel from "./ExpansionPanel";
import { formatCell, isNullValue, momentumOf, volTier } from "../lib/format";

export default function CandidateCard(props) {
  // props.row, props.thresholds, props.pickRank, props.isOpen,
  // props.onToggle(row), props.hiddenDefs(), props.customScores()
  const r = () => props.row;

  const cushion = createMemo(() => {
    const row = r();
    if (!row.underlying_price || row.underlying_price <= 0 || isNullValue(row.strike)) {
      return null;
    }
    return ((row.underlying_price - row.strike) / row.underlying_price) * 100;
  });

  const rorText = () => formatCell("pct1", r().rate_of_return).text;
  const strikeText = () => formatCell("fixed2", r().strike).text;
  const spotText = () => formatCell("fixed2", r().underlying_price).text;
  const midText = () => formatCell("fixed2", r().mid).text;

  return (
    <div
      class="hp-pos-card candidate-card"
      classList={{
        "pick-card": props.pickRank != null,
        "unscored-card": isNullValue(r().score),
        "open": props.isOpen,
      }}
    >
      <div
        class="hp-card-summary"
        role="button"
        tabIndex={0}
        aria-expanded={props.isOpen}
        aria-label={`${r().underlying} strike ${strikeText()} put option details`}
        onClick={() => props.onToggle(r())}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onToggle(r());
          }
        }}
      >
        <div class="hp-card-top">
          <span class="hp-card-symbol-line">
            <Show when={props.pickRank != null}>
              <span class="candidate-star-badge" aria-label={`Rank ${props.pickRank}`}>
                ★{props.pickRank}
              </span>
            </Show>
            <b class="hp-card-symbol">{r().underlying}</b>
            <span class="candidate-strike-badge">${strikeText()} Put</span>
            <Show when={volTier(r().realized_vol, props.thresholds)}>
              {(tier) => (
                <span
                  class={`dot ${tier()}`}
                  title={`Realized Vol Tier: ${tier()}`}
                  aria-label={`Vol tier ${tier()}`}
                />
              )}
            </Show>
            <Show when={r().sector}>
              <span class="candidate-sector-chip">{r().sector}</span>
            </Show>
          </span>

          <span
            class="hp-card-pl"
            classList={{
              "holdings-pos": !isNullValue(r().rate_of_return) && r().rate_of_return >= 0,
              "holdings-neg": !isNullValue(r().rate_of_return) && r().rate_of_return < 0,
            }}
          >
            {rorText()}
            <span class="candidate-ror-sub">Ann. RoR</span>
          </span>
        </div>

        <div class="hp-card-main">
          <div class="candidate-metrics-row">
            <span class="candidate-metric">
              Spot: <b>${spotText()}</b>
            </span>
            <span class="candidate-metric">
              Cushion:{" "}
              <b
                classList={{
                  "holdings-pos": (cushion() ?? 0) >= 0,
                  "holdings-neg": (cushion() ?? 0) < 0,
                }}
              >
                {cushion() != null ? `${cushion() > 0 ? "+" : ""}${cushion().toFixed(1)}%` : "—"}
              </b>
            </span>
            <span class="candidate-metric">
              Mid: <b>${midText()}</b>
            </span>
            <span class="candidate-score-pill">
              Score:{" "}
              <b>
                {isNullValue(r().score)
                  ? "—"
                  : formatCell("fixed3", r().score).text}
              </b>
              <Show when={props.customScores?.() && !isNullValue(r().frozen_score)}>
                <span class="candidate-frozen-score">
                  prod {r().frozen_score.toFixed(3)}
                </span>
              </Show>
            </span>
          </div>

          <div class="candidate-tags-row">
            <span class="candidate-expiry-chip">exp {r().expiration}</span>
            <Show when={r().delta != null}>
              <span class="candidate-delta-chip">Δ {r().delta.toFixed(2)}</span>
            </Show>
            <Show when={momentumOf(r().price_percentile, props.thresholds)}>
              {(mom) => (
                <span class={`chip ${mom().toLowerCase()}`}>{mom()}</span>
              )}
            </Show>
            <Show when={r().earnings_before_expiry}>
              {(e) => (
                <span class="candidate-earnings-alert">
                  ⚠ Earnings {e().report_date}
                </span>
              )}
            </Show>
            <button
              type="button"
              class="btn-ghost candidate-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                props.onToggle(r());
              }}
            >
              {props.isOpen ? "Less ▲" : "Details ▼"}
            </button>
          </div>
        </div>
      </div>

      {/* Tap-to-expand details drawer */}
      <Show when={props.isOpen}>
        <div class="hp-card-drawer">
          <ExpansionPanel
            row={r()}
            thresholds={props.thresholds}
            hiddenDefs={
              typeof props.hiddenDefs === "function"
                ? props.hiddenDefs()
                : (props.hiddenDefs ?? [])
            }
          />
        </div>
      </Show>
    </div>
  );
}
