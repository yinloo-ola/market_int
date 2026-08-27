/* Application shell. Owned regions:
   - results area .... ticket 16 (Analyst Table)
   - AUTH_GATE_SLOT .. ticket 17
   - RUN_SLOT ........ ticket 18 (Run button + progress strip)
   - USER_SLOT ....... ticket 17 (header email + Sign out)
   Overlap lives ONLY here and is merged by hand along the slot markers.

   Ticket 17: nothing renders until `onAuthStateChanged` resolves a user —
   no API call fires before that (§6.2 region 1). Signed-out ⇒ AuthGate card
   only; signed-in ⇒ header gains email + Sign out, rest unchanged. */

import { For, Show, createResource, createSignal, onCleanup, onMount } from "solid-js";

import { getLatest } from "./api";
import { AUTH_CONFIGURED, firebaseAuth, signOutUser } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthGate } from "./components/AuthGate";

// Scaffold shims — undefined in the tracer build (crashed on first row
// render); ticket 16 replaces these with its shared formatters when the real
// Analyst Table lands.
function fmt(v, digits) {
  return v == null ? "∅" : Number(v).toFixed(digits);
}
function intOr(v) {
  return v ?? 0;
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
  // t17 auth state: undefined = resolving, null = signed out, object = in.
  // The results resource sources off it, so /api traffic starts only after a
  // user exists — never before auth state resolves.
  const [user, setUser] = createSignal(undefined);
  const [latest] = createResource(user, (u) => (u ? getLatest() : undefined));

  /* USER_SLOT(t17):start — the auth-state observer lives in App, not inside
     AuthGate: it must survive while SIGNED IN to flip the header Sign out
     back to the gate. Unconfigured ⇒ resolve straight to null so the gate
     renders its "auth not configured" card instead of blocking forever. */
  onMount(() => {
    if (!AUTH_CONFIGURED) {
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth(), setUser);
    onCleanup(unsubscribe);
  });

  const whoami = () => user()?.email || user()?.uid || "";
  /* USER_SLOT(t17):end */

  return (
    <Show
      when={user()}
      fallback={
        /* AUTH_GATE_SLOT:start — signed out: overlay card on an otherwise
           empty page; NO app shell, NO api calls behind it. */
        <AuthGate />
        /* AUTH_GATE_SLOT:end */
      }
    >
      <div class="shell">
        <header>
          {/* USER_SLOT(t17):start — header user chip + Sign out */}
          <div class="user-box">
            <Show when={user()}>
              <span class="user-email">{whoami()}</span>
              <button type="button" onClick={() => signOutUser()}>
                Sign out
              </button>
            </Show>
          </div>
          {/* USER_SLOT(t17):end */}
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
    </Show>
  );
}

// NOTE: no render() here — index.jsx is the single render point (its header
// says "composition only"). The scaffold had a stray, unimported `render(...)`
// call at this spot which crashed module evaluation in the browser; removed
// with ticket 17.
export default App;
