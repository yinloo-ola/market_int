// Client-side scoring adjustment (approved layout, ticket 01 / .scratch/rescore):
// a collapsible drawer holding the three weight sliders + the min-ror floor +
// a reset. One weight set for BOTH timeframes — a weight opinion isn't per-tab —
// so the store is created once in App and consumed by every ResultsPane.
//
// The math itself lives in lib/scoring.js (the parity-pinned port); this file
// is only state + markup.

import { For, Show, createSignal } from "solid-js";

import { PRODUCTION, isProduction } from "../lib/scoring";

export function createScoringStore() {
  const [params, setParams] = createSignal({ ...PRODUCTION });
  return {
    params,
    isCustom: () => !isProduction(params()),
    setParam: (key, value) => setParams((p) => ({ ...p, [key]: value })),
    reset: () => setParams({ ...PRODUCTION }),
  };
}

const SLIDERS = [
  { key: "weightSharpe", label: "Sharpe weight", max: 1, step: 0.05, fmt: (v) => v.toFixed(2), weight: true },
  { key: "weightSafety", label: "Safety weight", max: 1, step: 0.05, fmt: (v) => v.toFixed(2), weight: true },
  { key: "weightReturn", label: "Return weight", max: 1, step: 0.05, fmt: (v) => v.toFixed(2), weight: true },
  { key: "minRateOfReturn", label: "Min rate-of-return floor", max: 0.5, step: 0.01, fmt: (v) => `${Math.round(v * 100)}%`, weight: false },
];

export default function RescoreControls(props) {
  // props.scoring — a store from createScoringStore().
  const custom = () => props.scoring.isCustom();
  const weightSum = () => {
    const p = props.scoring.params();
    return p.weightSharpe + p.weightSafety + p.weightReturn || 1;
  };
  return (
    <details class="adjust" open={custom()}>
      <summary>
        Adjust scoring{" "}
        <Show
          when={!custom()}
          fallback={<span class="hint hint-custom">custom weights</span>}
        >
          <span class="hint">production defaults · drag to re-rank live</span>
        </Show>
      </summary>
      <div class="adjust-body">
        <For each={SLIDERS}>
          {(s) => (
            <div class="ctl">
              <label>
                {s.label}{" "}
                <span class="val">
                  {s.fmt(props.scoring.params()[s.key])}
                  <Show when={s.weight}>
                    {" "}
                    · {Math.round((props.scoring.params()[s.key] / weightSum()) * 100)}% of weight
                  </Show>
                </span>
              </label>
              <input
                type="range"
                min="0"
                max={s.max}
                step={s.step}
                value={props.scoring.params()[s.key]}
                onInput={(e) => props.scoring.setParam(s.key, Number(e.currentTarget.value))}
              />
            </div>
          )}
        </For>
        <button type="button" class="reset" onClick={() => props.scoring.reset()}>
          Reset to production defaults
        </button>
      </div>
    </details>
  );
}
