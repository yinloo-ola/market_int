/* Application shell. Owned regions:
   - results area .... ticket 16 (Analyst Table: tabs/sort/filter/scored-only/
     column picker/pagination/top picks)
   - AUTH_GATE_SLOT .. ticket 17
   - RUN_SLOT ........ ticket 18 (Run button + progress strip)
   Overlap lives ONLY here and is merged by hand along the slot markers. */

import { Show, createResource, createSignal } from "solid-js";

import { getLatest } from "./api";
import ResultsPane from "./components/ResultsPane";
import { comma } from "./lib/format";
import {
  DEFAULT_COLUMN_IDS,
  loadVisibleColumns,
  saveVisibleColumns,
} from "./lib/columns";

// One column preference per browser (spec §6.3): localStorage key
// webapp.columns.v1, written on every toggle/reset, read once at mount.
function createColumnStore() {
  const [visible, setVisible] = createSignal(loadVisibleColumns());
  const apply = (ids) => {
    setVisible(ids);
    saveVisibleColumns(ids);
  };
  return {
    visible,
    isOn: (id) => visible().includes(id),
    toggle: (id, on) =>
      apply(on ? [...visible(), id] : visible().filter((x) => x !== id)),
    reset: () => apply(DEFAULT_COLUMN_IDS),
  };
}

// S6 seam: when a timeframe object is missing entirely, name the failed
// chain stage; ok-but-empty timeframes fall through to the filter message.
function stageErrorOf(result, stageName) {
  const st = result?.stages?.find((s) => s.name === stageName);
  return st && st.status === "failed" ? (st.error ?? "failed") : undefined;
}

function rowCountOf(result, tabId) {
  const tf = result()?.timeframes?.[tabId];
  return tf?.rows?.length ?? tf?.row_count ?? 0;
}

function CacheLine(props) {
  const state = () => props.envelope.cache_state;
  const mins = () => Math.floor((props.envelope.age_secs ?? 0) / 60);
  return (
    <div class="cache-line">
      <Show
        when={state() === "fresh"}
        fallback={
          <Show when={state() === "stale"}>
            <span>
              Last run <b>{mins()}</b> min ago
            </span>
          </Show>
        }
      >
        {/* Window comes from the server (cache_secs) — never hardcode it. */}
        <span>
          Cached · <b>{props.envelope.cache_secs - (props.envelope.age_secs ?? 0)}s</b> left · age{" "}
          <b>{mins()}</b> min
        </span>
      </Show>
      <span class={"pill " + state()}>{state()}</span>
      <span class="pill">run: {props.envelope.run_state?.status ?? "idle"}</span>
    </div>
  );
}

function TabsRow(props) {
  // props.result(), props.tab(), props.onTab(id)
  const TAB_DEFS = [
    { id: "short", label: "Short · 5-day" },
    { id: "medium", label: "Medium · 20-day" },
  ];
  return (
    <nav class="tabs" role="tablist" aria-label="timeframes">
      {TAB_DEFS.map((d) => (
        <button
          type="button"
          role="tab"
          aria-selected={props.tab() === d.id}
          classList={{ tab: true, active: props.tab() === d.id }}
          onClick={() => props.onTab(d.id)}
        >
          {d.label} ({comma(rowCountOf(props.result, d.id))})
        </button>
      ))}
    </nav>
  );
}

function App() {
  // t17 gates everything below via the AUTH_GATE_SLOT overlay.
  const [latest] = createResource(getLatest);
  const columns = createColumnStore();
  const [tab, setTab] = createSignal("short");

  return (
    <div class="shell">
      {/* ── AUTH_GATE_SLOT (ticket 17) — sign-in overlay mounts here ── */}

      <header>
        <h1>market_int · put-selling candidates</h1>
        <Show when={!latest.loading && !latest.error}>
          <CacheLine envelope={latest()} />
        </Show>
        {/* ── RUN_SLOT (ticket 18) part 1 — ▶ Run pipeline button + user
               email / Sign out join this header line ── */}
      </header>

      <Show when={latest.error}>
        <div class="error-banner">API error: {latest.error.message}</div>
      </Show>

      {/* ── RUN_SLOT (ticket 18) part 2 — live progress strip collapses to
             the post-run summary right below the header ── */}

      <Show
        when={!latest.loading && latest()?.result}
        fallback={
          <Show when={!latest.loading}>
            <div class="cache-line">
              No results yet — the page serves whatever the result file holds.
              Point <code>webapp_result_file</code> at{" "}
              <code>crates/webapp/fixtures/sample_last_run.json</code> for demo
              data.
            </div>
          </Show>
        }
      >
        {(res) => {
          // Non-keyed <Show> hands us an accessor to the truthy `when`
          // value — here that is envelope().result (the §4 document).
          const result = () => res();
          return (
            <>
              <TabsRow result={result} tab={tab} onTab={setTab} />
              <ResultsPane
                id="short"
                active={() => tab() === "short"}
                tf={result().timeframes?.short}
                stageError={stageErrorOf(result(), "chains_short")}
                thresholds={result().thresholds}
                columns={columns}
              />
              <ResultsPane
                id="medium"
                active={() => tab() === "medium"}
                tf={result().timeframes?.medium}
                stageError={stageErrorOf(result(), "chains_medium")}
                thresholds={result().thresholds}
                columns={columns}
              />
            </>
          );
        }}
      </Show>
    </div>
  );
}

export default App;
