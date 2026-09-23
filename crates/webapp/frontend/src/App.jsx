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
import AccessPanel from "./components/AccessPanel";
import RescoreControls, {
  createScoringStore,
} from "./components/RescoreControls";
import ResultsPane from "./components/ResultsPane";
import HoldingsPanel from "./components/HoldingsPanel";
import {
  RunButton,
  RunStrip,
  createRunController,
  gateLifted,
} from "./components/RunPanel";
import { comma, localDayHM, localHM, stampMs } from "./lib/format";
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

// Cache-line age in human units: off-market ages routinely span hours.
function ageText(secs) {
  const m = Math.floor(secs / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h} h ${rem} min` : `${h} h`;
}

// "· run Sep 11, 09:07" — the run stamp shared by every cache-line branch.
// Date included: off-market staleness routinely crosses midnight/weekends.
function RunAtLine(props) {
  return (
    <Show when={props.at()}>
      {" "}
      · run <b>{props.at()}</b>
    </Show>
  );
}

function CacheLine(props) {
  // §6.2 cache pill: "Cached · 6m left · run 09:07", ticking every 30 s.
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
  // Off-market the envelope says so (absent ⇒ older backend ⇒ unknown).
  const marketClosed = () => props.envelope.market_open === false;
  // "6m left" per §6.2; the final minute counts down in seconds.
  const left = () => {
    const s = Math.max(0, (props.envelope.cache_secs ?? 0) - ageNow());
    return s >= 60 ? `${Math.floor(s / 60)}m` : `${s}s`;
  };
  const runAtLocal = () =>
    localDayHM(props.envelope.result?.run?.finished_at_utc);
  // The hourly off-market gate's unlock, in the same local format. Hidden
  // once the instant passes on a not-yet-refetched envelope (the 30 s tick
  // re-evaluates it; the button has its own one-shot wake).
  const nextRunLocal = () => {
    tick();
    const stamp = props.envelope.next_open_utc;
    const at = stampMs(stamp);
    if (at === null || gateLifted(at)) return undefined;
    return localHM(stamp);
  };
  // Stale off-market is the expected state, not a problem — say why.
  const pillState = () =>
    marketClosed() && state() === "stale" ? "closed" : state();
  const hasDoc = () => state() === "fresh" || state() === "stale";
  return (
    <div class="cache-line">
      {/* One clock per regime: market open counts to cache expiry; market
          closed shows the run age plus the hourly gate's next-run time —
          the 10-min cache countdown is meaningless off-market, where the
          gate is the only thing a press waits on. */}
      <Show
        when={marketClosed() && hasDoc()}
        fallback={
          <Show
            when={state() === "fresh"}
            fallback={
              <Show when={state() === "stale"}>
                <span>
                  Stale · last run <b>{ageText(ageNow())}</b> ago
                  <RunAtLine at={runAtLocal} />
                </span>
              </Show>
            }
          >
            {/* Window comes from the server (cache_secs) — never hardcode it. */}
            <span>
              Cached · <b>{left()}</b> left
              <RunAtLine at={runAtLocal} />
            </span>
          </Show>
        }
      >
        <span>
          Market closed · last run <b>{ageText(ageNow())}</b> ago
          <RunAtLine at={runAtLocal} />
          <Show when={nextRunLocal()}>
            {" "}
            · next run <b>{nextRunLocal()}</b>
          </Show>
        </span>
      </Show>
      <span class={"pill " + pillState()}>
        {pillState() === "closed" ? "market closed" : state()}
      </span>
      <span class="pill">run: {props.envelope.run_state?.status ?? "idle"}</span>
    </div>
  );
}

export function TabsRow(props) {
  // props.result(), props.tab(), props.onTab(id)
  const TAB_DEFS = [
    { id: "short", label: "Short · 5-day" },
    { id: "medium", label: "Medium · 20-day" },
    // Holdings: no timeframe count, reachable with or without a run document.
    { id: "holdings", label: "Holdings", holdings: true },
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
          {d.label}
          {!d.holdings && ` (${comma(rowCountOf(props.result, d.id))})`}
        </button>
      ))}
    </nav>
  );
}

// ── Dark mode (2026-09-23-dark-mode): R2 — session theme toggle ──
// Untouched, the app follows prefers-color-scheme (CSS-only, R1). This
// button forces the opposite theme via <html data-theme>, which beats the
// media query on specificity. Deliberately non-persistent: nothing is
// stored, so a reload returns to system-follow.
export function ThemeToggle() {
  // null = follow the system (no attribute); a forced value writes
  // data-theme AND the signal, so the label/icon re-render in Solid.
  const [forced, setForced] = createSignal(null);
  const sysDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effective = () => forced() ?? (sysDark() ? "dark" : "light");
  const flip = () => {
    const next = effective() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setForced(next);
  };
  const label = () =>
    effective() === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      type="button"
      class="btn-ghost theme-toggle"
      aria-label={label()}
      title={label()}
      onClick={flip}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <Show
          when={effective() === "dark"}
          fallback={
            // moon — shown while light, click goes dark
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          }
        >
          {/* sun — shown while dark, click goes light */}
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        </Show>
      </svg>
    </button>
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
    // Dev-preview bypass (tunnel/phone previews): VITE_PREVIEW_USER arms ONLY
    // under `vite dev` (the production build statically compiles
    // import.meta.env.DEV to false — this branch cannot ship) and ONLY when
    // the server itself confirms auth is disabled (/api/me auth_enabled
    // false, i.e. FIREBASE_PROJECT_ID unset). An armed server keeps the real
    // sign-in flow; requests in preview mode go unsigned by design.
    if (import.meta.env.DEV && import.meta.env.VITE_PREVIEW_USER) {
      const previewEmail = import.meta.env.VITE_PREVIEW_USER;
      fetch("/api/me")
        .then((r) => r.json())
        .then((v) => {
          if (v?.auth_enabled === false) {
            setUser({ email: previewEmail, uid: "dev-preview" });
          } else {
            setUser(null);
          }
        })
        .catch(() => setUser(null));
      return;
    }
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
  // Access panel (ticket 22): grant management reachable from the menu, so it
  // works from the phone.
  const [accessOpen, setAccessOpen] = createSignal(false);
  /* USER_SLOT(t17):end */

  const columns = createColumnStore();
  const [tab, setTab] = createSignal("short");
  // Holdings tab swaps the whole content area — hero, rescore controls and
  // result panes included; the tab strip above stays in both branches.
  const holdingsTab = () => tab() === "holdings";
  // Client-side weight adjustment (ticket 01): ONE weight set for both
  // timeframes, owned here, consumed by the panes + the drawer.
  const scoring = createScoringStore();
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
                      setAccessOpen(true);
                    }}
                  >
                    Manage access
                  </button>
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
            <ThemeToggle />
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

        {/* Holdings: the tab strip renders here too (Holdings active) so it
            never vanishes while the panel is on screen. */}
        <Show when={holdingsTab()}>
          <TabsRow result={() => latest()?.result} tab={tab} onTab={setTab} />
          <HoldingsPanel />
        </Show>

        <Show when={!holdingsTab()}>
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
                <RescoreControls scoring={scoring} />
                <TabsRow result={result} tab={tab} onTab={setTab} />
                <ResultsPane
                  id="short"
                  active={() => tab() === "short"}
                  tf={result().timeframes?.short}
                  stageError={stageErrorOf(result(), "chains_short")}
                  stages={result().stages}
                  thresholds={result().thresholds}
                  columns={columns}
                  scoring={scoring}
                />
                <ResultsPane
                  id="medium"
                  active={() => tab() === "medium"}
                  tf={result().timeframes?.medium}
                  stageError={stageErrorOf(result(), "chains_medium")}
                  stages={result().stages}
                  thresholds={result().thresholds}
                  columns={columns}
                  scoring={scoring}
                />
              </>
            );
          }}
        </Show>
        </Show>
      </div>
      </Show>
      <Show when={accessOpen()}>
        <AccessPanel onClose={() => setAccessOpen(false)} />
      </Show>
    </Show>
  );
}

// No render() here — index.jsx is the single render point.
export default App;
