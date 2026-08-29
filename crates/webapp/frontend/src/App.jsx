/* Application shell. Owned regions:
   - results area .... ticket 16 DONE (Analyst Table: tabs/sort/filter/
     scored-only/column picker/pagination/top picks)
   - AUTH_GATE_SLOT .. ticket 17 DONE (S0 overlay + signed-out suppression)
   - USER_SLOT ....... ticket 17 DONE (header email + Sign out)
   - RUN_SLOT ........ ticket 18 (Run button + progress strip)
   Overlap lives ONLY here and is merged by hand along the slot markers.

   Ticket 17: nothing renders until `onAuthStateChanged` resolves a user —
   no API call fires before that (§6.2 region 1). Unconfigured Firebase ⇒
   resolves straight to null and AuthGate shows its notice card. */

import {
  Show,
  createEffect,
  createResource,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";

import { getLatest, getMe } from "./api";
import { AUTH_CONFIGURED, firebaseAuth, signOutUser } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthGate, DeniedCard } from "./components/AuthGate";
import ResultsPane from "./components/ResultsPane";
import { RunButton, RunStrip, createRunController } from "./components/RunPanel";
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
  // §6.2 cache pill: "Cached · 6m left · run 09:07 ET", ticking every 30 s.
  // The countdown anchors to the server-computed age_secs at refetch time;
  // between refetches the client clock fills the gap.
  const [tick, setTick] = createSignal(0);
  onMount(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    onCleanup(() => clearInterval(id));
  });
  let anchoredAtMs = Date.now();
  let ageAtAnchor = 0;
  createEffect(
    on(
      () => props.envelope,
      (env) => {
        anchoredAtMs = Date.now();
        ageAtAnchor = env?.age_secs ?? 0;
      }
    )
  );
  const ageNow = () => {
    tick(); // 30 s heartbeat
    return ageAtAnchor + Math.floor((Date.now() - anchoredAtMs) / 1000);
  };
  const state = () => props.envelope.cache_state;
  const mins = () => Math.floor(ageNow() / 60);
  // "6m left" per §6.2; the final minute counts down in seconds.
  const left = () => {
    const s = Math.max(0, (props.envelope.cache_secs ?? 0) - ageNow());
    return s >= 60 ? `${Math.floor(s / 60)}m` : `${s}s`;
  };
  // RFC3339 stamp → "09:07 ET" in the market's timezone.
  const runAtEt = () => {
    const stamp = props.envelope.result?.run?.finished_at_utc;
    if (!stamp) return undefined;
    try {
      const t = new Date(stamp);
      if (Number.isNaN(t.getTime())) return undefined;
      return (
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }).format(t) + " ET"
      );
    } catch {
      return undefined;
    }
  };
  return (
    <div class="cache-line">
      <Show
        when={state() === "fresh"}
        fallback={
          <Show when={state() === "stale"}>
            <span>
              Stale · last run <b>{mins()}</b> min ago
              <Show when={runAtEt()}>
                {" "}
                · run <b>{runAtEt()}</b>
              </Show>
            </span>
          </Show>
        }
      >
        {/* Window comes from the server (cache_secs) — never hardcode it. */}
        <span>
          Cached · <b>{left()}</b> left
          <Show when={runAtEt()}>
            {" "}
            · run <b>{runAtEt()}</b>
          </Show>
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
  // t17 auth state: undefined = resolving, null = signed out, object = in.
  // The results resource sources off it, so /api traffic starts only after a
  // user exists — never before auth state resolves.
  const [user, setUser] = createSignal(undefined);
  // refetch lives on the ACTIONS tuple element, not the resource — grabbing it
  // here so the RUN_SLOT refresh seam below can trigger exactly one refetch.
  const [latest, { refetch: refetchLatest }] = createResource(user, (u) =>
    u ? getLatest() : undefined
  );

  /* USER_SLOT(t17):start — observer lives in App (not AuthGate) so it
     survives while SIGNED IN to flip Sign out back to the gate.
     Unconfigured ⇒ null immediately (notice card, not infinite spinner). */
  onMount(() => {
    if (!AUTH_CONFIGURED) {
      setUser(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth(), setUser);
    onCleanup(unsubscribe);
  });

  // Owner-allowlist check (ticket 22): signed in ≠ authorized. One /api/me
  // probe per identity; 403 `not_authorized` swaps the shell for a denial
  // card instead of surfacing a wall of API errors.
  const [denied, setDenied] = createSignal(false);
  createEffect(
    on(user, (u) => {
      setDenied(false);
      if (!u || !AUTH_CONFIGURED) return;
      getMe()
        .then((res) => setDenied(res.status === 403))
        .catch(() => {}); // transient network errors keep the shell up
    })
  );

  // ── RUN_SLOT (ticket 18) refresh seam: RunPanel asks for exactly ONE
  //    post-run table refetch through this window event. ──
  onMount(() => {
    const refreshForRun = () => refetchLatest();
    window.addEventListener("webapp:refresh-latest", refreshForRun);
    onCleanup(() =>
      window.removeEventListener("webapp:refresh-latest", refreshForRun)
    );
  });

  const whoami = () => user()?.email || user()?.uid || "";
  // Account menu (USER_SLOT): identity on the pill, Sign out inside the menu —
  // one interaction model for mouse and touch, no hover dependency.
  const [accountOpen, setAccountOpen] = createSignal(false);
  /* USER_SLOT(t17):end */

  const columns = createColumnStore();
  const [tab, setTab] = createSignal("short");
  // Ticket 18 controller: three-outcome Run precedence + SSE progress state.
  const run = createRunController(() => latest());

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
      <Show
        when={!denied()}
        fallback={
          <DeniedCard email={whoami()} onSignOut={() => signOutUser()} />
        }
      >
      <div class="shell">
        <header>
          {/* USER_SLOT(t17):start — header user chip + Sign out */}
          <div class="user-box">
            <Show when={user()}>
              <button
                type="button"
                class="btn-ghost user-pill"
                aria-haspopup="menu"
                aria-expanded={accountOpen()}
                onClick={() => setAccountOpen(!accountOpen())}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span class="user-email">{whoami()}</span>
                <span class="user-caret" aria-hidden="true">▾</span>
              </button>
              <Show when={accountOpen()}>
                {/* invisible backdrop closes on any outside click */}
                <div class="pop-backdrop" onClick={() => setAccountOpen(false)} />
                <div class="account-menu" role="menu" aria-label="account">
                  <div class="acct-label">Signed in as</div>
                  <div class="acct-email">{whoami()}</div>
                  <button
                    type="button"
                    class="btn-ghost"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      signOutUser();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </Show>
            </Show>
          </div>
          {/* USER_SLOT(t17):end */}
          <h1 class="brand">
            <span class="brand-mark">
              Market<span class="brand-accent">Int</span>
            </span>
            <span class="brand-sub">Put-Selling Candidates</span>
          </h1>
          <Show when={!latest.loading && !latest.error}>
            <CacheLine envelope={latest()} />
          </Show>
          {/* ── RUN_SLOT (ticket 18) part 1 — ▶ Run pipeline button joins
                 this header line ── */}
          <div class="run-slot-head">
            <RunButton run={run} />
          </div>
          {/* ── end RUN_SLOT part 1 ── */}
        </header>

        <Show when={latest.error}>
          <div class="error-banner">API error: {latest.error.message}</div>
        </Show>

        {/* ── RUN_SLOT (ticket 18) part 2 — live progress strip collapses to
               the post-run summary right below the header ── */}
        <RunStrip run={run} />
        {/* ── end RUN_SLOT part 2 ── */}

        {/* S1: no-run-yet hero */}
        <Show
          when={!latest.loading && latest()?.result}
          fallback={
            <Show when={!latest.loading}>
              <div class="hero">
                <h2>No run yet</h2>
                <p>
                  Press <b>▶ Run pipeline</b> to pull quotes, compute max-drop
                  bands / Sharpe / percentiles, then score every in-range put
                  strike across the universe. A full run typically takes 4–7
                  minutes and streams live progress right here.
                </p>
                <p class="muted-note">
                  Demo data: point <code>webapp_result_file</code> (or{" "}
                  <code>--result-file</code>) at{" "}
                  <code>crates/webapp/fixtures/sample_last_run.json</code>.
                </p>
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
                  stages={result().stages}
                  thresholds={result().thresholds}
                  columns={columns}
                />
                <ResultsPane
                  id="medium"
                  active={() => tab() === "medium"}
                  tf={result().timeframes?.medium}
                  stageError={stageErrorOf(result(), "chains_medium")}
                  stages={result().stages}
                  thresholds={result().thresholds}
                  columns={columns}
                />
              </>
            );
          }}
        </Show>
      </div>
      </Show>
    </Show>
  );
}

// No render() here — index.jsx is the single render point.
export default App;
