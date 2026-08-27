/* Application shell. Owned regions:
   - results area .... ticket 16 (Analyst Table)
   - AUTH_GATE_SLOT .. ticket 17
   - RUN_SLOT ........ ticket 18 (Run button + progress strip)
   Overlap lives ONLY here and is merged by hand along the slot markers. */

import { Show } from "solid-js";
import { createResource } from "solid-js";

import { getLatest } from "./api";

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

function ResultsTable(props) {
  const pickKeys = () =>
    new Set(
      (props.tf.top_picks ?? []).map((p) => `${p.underlying}|${p.strike}`)
    );

  return (
    <table>
      <thead>
        <tr>
          <th>★</th>
          <th>underlying</th>
          <th>sector</th>
          <th class="num">strike</th>
          <th>expiration</th>
          <th class="num">bid</th>
          <th class="num">mid</th>
          <th class="num">ask</th>
          <th class="num">ror</th>
          <th class="num">score</th>
          <th class="num">delta</th>
          <th class="num">iv/rv</th>
          <th class="num">realized vol</th>
          <th class="num">price pctl</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.rows}>
          {(row) => {
            const isPick = pickKeys().has(`${row.underlying}|${row.strike}`);
            return (
              <tr classList={{ pick: isPick }}>
                <td>{isPick ? <span class="star">★</span> : ""}</td>
                <td>{row.underlying}</td>
                <td>{row.sector}</td>
                <td class="num">{fmt(row.strike, 2)}</td>
                <td>{row.expiration}</td>
                <td class="num">{fmt(row.bid, 2)}</td>
                <td class="num">{fmt(row.mid, 2)}</td>
                <td class="num">{fmt(row.ask, 2)}</td>
                <td class="num">{fmt(row.rate_of_return, 3)}</td>
                <td class="num">{fmt(row.score, 3)}</td>
                <td class="num">{fmt(row.delta, 2)}</td>
                <td class="num">{fmt(row.iv_rv_ratio, 2)}</td>
                <td class="num">{fmt(row.realized_vol, 3)}</td>
                <td class="num">{fmt(row.price_percentile, 3)}</td>
              </tr>
            );
          }}
        </For>
      </tbody>
    </table>
  );
}

function App() {
  // t17 gates everything below via AUTH_GATE_SLOT overlay.
  const [latest] = createResource(getLatest);

  return (
    <div class="shell">
      <header>
        <h1>market_int · put-selling candidates</h1>
        <Show when={!latest.loading && !latest.error}>
          <CacheLine envelope={latest()} />
        </Show>
      </header>

      <Show when={latest.error}>
        <div class="error-banner">API error: {latest.error.message}</div>
      </Show>

      <Show
        when={!latest.loading && latest()?.result}
        fallback={
          <Show when={!latest.loading}>
            <div class="cache-line">
              No results yet — press Run once the pipeline endpoints land (ticket 18).
              Meanwhile this page serves whatever the result file holds; point
              <code> webapp_result_file </code> at a fixture for demo data.
            </div>
          </Show>
        }
      >
        {(envelope) => {
          const short = envelope().result.timeframes?.short;
          return (
            <>
              <ResultsTable rows={short?.rows ?? []} tf={short ?? {}} />
              <p class="cache-line">
                {intOr(short?.row_count)} short rows shown (basic tracer table —
                tabs/sort/filter arrive in ticket 16)
              </p>
            </>
          );
        }}
      </Show>
    </div>
  );
}

render(() => <App />, document.getElementById("root"));

export default App;
