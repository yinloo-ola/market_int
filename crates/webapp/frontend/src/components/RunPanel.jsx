// Ticket 18 — the Run slice: header button + live progress strip (S4/S5/S6
// mechanics of spec §6.6, the frozen event vocabulary of §3.3, and the strict
// three-outcome precedence of §5: running→202-attach, fresh+armed→cached
// JSON toast, otherwise a streaming run).
//
// Owns NOTHING about tables/results: on terminal (or on the S5 polling
// fallback spotting a newer completion) it asks for exactly one refresh via
// the window event `webapp:refresh-latest`; App owns the refetch.

import { Show, createSignal, onCleanup } from "solid-js";
import { getLatest, getProgress, postRun } from "../api";
import { consumeSse } from "../sse";

const STAGE_ORDER = ["quotes", "metrics", "chains_short", "chains_medium"];
const STAGE_LABEL = {
  quotes: "Quotes",
  metrics: "Indicators",
  chains_short: "Chains · 5-day",
  chains_medium: "Chains · 20-day",
};
const POLL_MS = 15_000; // S5 detached re-check cadence

function fmtClock(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * The shared Run controller. `latest` is App's resource accessor so the
 * cache gate baseline and detached-poll comparisons read live data.
 */
export function createRunController(latest) {
  // idle | starting | running | detached | done | failed
  const [phase, setPhase] = createSignal("idle");
  const [stageStates, setStageStates] = createSignal(emptyStages());
  const [batch, setBatch] = createSignal(null); // { stage, done, total }
  const [elapsedSecs, setElapsedSecs] = createSignal(0);
  const [terminal, setTerminal] = createSignal(null); // run_finished payload
  const [cachedToast, setCachedToast] = createSignal(null); // age_secs
  const [notice, setNotice] = createSignal("");

  let timer = null;
  let poller = null;

  function emptyStages() {
    return Object.fromEntries(
      STAGE_ORDER.map((name) => [name, { status: "pending", error: null }])
    );
  }

  function stopTimers() {
    if (timer) clearInterval(timer);
    timer = null;
    if (poller) clearInterval(poller);
    poller = null;
  }

  function startClock() {
    setElapsedSecs(0);
    timer = setInterval(() => setElapsedSecs((s) => s + 1), 1000);
  }

  function applyEvent(ev) {
    switch (ev.type) {
      case "stage_started":
        setStageStates((m) => ({
          ...m,
          [ev.stage]: { status: "running", error: null },
        }));
        break;
      case "batch_done":
        setBatch({ stage: ev.stage, done: ev.done, total: ev.total });
        break;
      case "stage_finished":
        // Live granularity is ok-vs-failed; the terminal payload below is
        // the post-run truth that separates ✗ from △ (spec §3.3).
        setStageStates((m) => ({
          ...m,
          [ev.stage]: { status: ev.ok ? "ok" : "failed", error: ev.error ?? null },
        }));
        break;
      case "run_finished":
        setTerminal(ev);
        break;
      default:
        break; // unknown types are logged/ignored, never crash (§3.3)
    }
  }

  function finish() {
    stopTimers();
    const t = terminal();
    const chainsOk = (t?.stages ?? []).some(
      (s) => s.name.startsWith("chains") && ["ok", "partial"].includes(s.status)
    );
    setPhase(t && (chainsOk || t.ok) ? "done" : "failed");
    // Exactly one refresh per finished run; App owns the actual refetch.
    window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));
  }

  /** Consume one SSE response to its terminal. */
  async function consume(res) {
    let sawTerminal = false;
    const outcome = await consumeSse(res, (ev) => {
      applyEvent(ev);
      if (ev.type === "run_finished") sawTerminal = true;
    });
    void outcome;
    if (!sawTerminal) return false;
    finish();
    return true;
  }

  /** S5: stream lost mid-run — poll /api/latest until a newer completion. */
  async function watchFromBaseline(baselineFinished) {
    setPhase("detached");
    poller = setInterval(async () => {
      try {
        const env = await getLatest();
        const fin = env?.result?.run?.finished_at_utc ?? null;
        if (fin && fin !== baselineFinished) {
          setStageStates(mapFromTerminalDoc(env.result));
          stopTimers();
          setPhase("done");
          window.dispatchEvent(new CustomEvent("webapp:refresh-latest"));
        }
      } catch {
        /* transient API errors keep the watcher alive */
      }
    }, POLL_MS);
  }

  function mapFromTerminalDoc(doc) {
    const states = emptyStages();
    for (const s of doc?.stages ?? []) {
      if (states[s.name]) states[s.name] = { status: s.status, error: s.error };
    }
    return states;
  }

  async function triggerRun() {
    if (["starting", "running", "detached"].includes(phase())) return;
    setNotice("");
    setTerminal(null);
    setBatch(null);
    setStageStates(emptyStages());
    setCachedToast(null);
    const baseline = latest()?.result?.run?.finished_at_utc ?? null;
    setPhase("running"); // optimistic; clock starts now
    startClock();

    let res;
    try {
      res = await postRun();
    } catch {
      stopTimers();
      setPhase("idle");
      setNotice("Run failed to start — network or server unreachable.");
      return;
    }

    const ct = res.headers.get("content-type") ?? "";

    // Outcome 2: cached hit — rows never inline here; toast + refresh clock.
    if (res.ok && ct.includes("application/json")) {
      const v = await res.json().catch(() => null);
      stopTimers();
      setPhase("idle");
      if (v?.status === "cached") {
        setCachedToast(v.age_secs);
        setTimeout(() => setCachedToast(null), 6000);
        return;
      }
    }

    // Outcome 2b: off-hours one-run gate — the server refuses politely.
    if (res.status === 403 && ct.includes("application/json")) {
      const v = await res.json().catch(() => null);
      stopTimers();
      setPhase("idle");
      const when = v?.next_open_utc
        ? new Date(v.next_open_utc).toLocaleString()
        : "the next market open";
      setNotice(
        `One off-hours run already completed — the next unlocks at market open (${when}).`
      );
      return;
    }

    // Outcome 1b: already running → attach via /api/progress replay.
    if (res.status === 202) {
      const p = await getProgress();
      if (p.ok && (p.headers.get("content-type") ?? "").includes("text/event-stream")) {
        const attached = await consume(p);
        if (!attached) await watchFromBaseline(baseline);
        return;
      }
      await watchFromBaseline(baseline);
      return;
    }

    // Outcome 1a: this press won the lock → drive the live stream.
    if (ct.includes("text/event-stream")) {
      const completed = await consume(res);
      if (!completed) await watchFromBaseline(baseline);
      return;
    }

    // Nothing matched the contract — surface it.
    stopTimers();
    setPhase("idle");
    setNotice(`Unexpected /api/run response (${res.status}, ${ct || "no type"}).`);
  };

  onCleanup(stopTimers);

  const isBusy = () => ["starting", "running", "detached"].includes(phase());

  // Off-hours gate (server-authoritative): the envelope says whether a press
  // would be refused. Absent field (older envelope) ⇒ allowed.
  const runAllowed = () => latest()?.run_allowed !== false;
  const nextOpenUtc = () => latest()?.next_open_utc ?? null;

  return {
    phase,
    stageStates,
    batch,
    elapsedSecs,
    terminal,
    cachedToast,
    notice,
    triggerRun,
    isBusy,
    runAllowed,
    nextOpenUtc,
  };
}

/** Header button (RUN_SLOT part 1). */
export function RunButton(props) {
  const blocked = () => !props.run.runAllowed();
  const label = () =>
    props.run.phase() === "running"
      ? "Run…"
      : props.run.phase() === "detached"
        ? "Run in progress"
        : blocked()
          ? "Run at next open"
          : "▶ Run pipeline";
  return (
    <button
      type="button"
      class="run-btn"
      disabled={props.run.isBusy() || blocked()}
      title={
        blocked() && props.run.nextOpenUtc()
          ? `Unlocks at market open: ${new Date(
              props.run.nextOpenUtc()
            ).toLocaleString()}`
          : undefined
      }
      onClick={() => props.run.triggerRun()}
    >
      {label()}
    </button>
  );
}

function StageChip(props) {
  const cls = () => {
    const st = props.run.stageStates()[props.name].status;
    return st === "pending" ? "pending" : st === "running" ? "active" : st;
  };
  const mark = () => ({ ok: "✓", partial: "△", failed: "✗", active: "◦", pending: "·" })[cls()];
  const bar = () => {
    const b = props.run.batch();
    return b && b.stage === props.name && cls() === "active"
      ? Math.round((b.done / Math.max(b.total, 1)) * 100)
      : null;
  };
  return (
    <li class={`run-stage ${cls()}`}>
      <span class="mark">{mark()}</span>
      <span class="label">{STAGE_LABEL[props.name]}</span>
      <Show when={bar() !== null}>
        <span class="run-count">
          {props.run.batch().done}/{props.run.batch().total}
        </span>
        <span class="run-bar">
          <span class="fill" style={{ width: `${bar()}%` }} />
        </span>
      </Show>
    </li>
  );
}

/** Progress strip (RUN_SLOT part 2): S4 live, S5 detached, S2 toast, S6 ✗/△. */
export function RunStrip(props) {
  const run = props.run;
  const t = () => run.terminal();

  const headline = () => {
    if (run.phase() === "detached")
      return "Stream lost — the run continues server-side and will be saved. Re-checking…";
    if (run.phase() === "running" && !t())
      return <>Running pipeline · elapsed {fmtClock(run.elapsedSecs())}</>;
    if (t()) {
      const st = t().stages ?? [];
      const chainsOk = st.some(
        (s) => s.name.startsWith("chains") && ["ok", "partial"].includes(s.status)
      );
      if (chainsOk && t().ok) return <>Run finished ✓ · {fmtClock(Math.round(t().duration_secs))}</>;
      if (chainsOk) return <>Run finished △ · what succeeded is shown below</>;
      return <>Run finished ✗ · nothing produced — retry allowed</>;
    }
    return "";
  };

  return (
    <Show
      when={
        ["running", "detached"].includes(run.phase()) ||
        t() ||
        run.cachedToast() ||
        run.notice()
      }
    >
      <div class="run-strip">
        {/* Cached-hit toast (S2) */}
        <Show when={run.cachedToast()}>
          <div class="toast-cached">
            Served from cache — last run{" "}
            {Math.floor(run.cachedToast() / 60)} min old
          </div>
        </Show>

        <Show when={run.notice()}>
          <div class="toast-cached warn">{run.notice()}</div>
        </Show>

        <Show when={["running", "detached"].includes(run.phase()) || t()}>
          <div class="run-headline">{headline()}</div>

          <ul class="run-stages">
            {STAGE_ORDER.map((name) => (
              <StageChip name={name} run={run} />
            ))}
          </ul>

          {/* Expandable failure detail from the terminal payload (S6). */}
          <Show when={t() && (t().stages ?? []).some((s) => s.status !== "ok")}>
            <details class="run-errors">
              <summary>details</summary>
              <ul>
                {(t().stages ?? [])
                  .filter((s) => s.status !== "ok")
                  .map((s) => (
                    <li>
                      {s.status === "partial" ? "△" : "✗"} {STAGE_LABEL[s.name] ?? s.name}
                      {s.error ? `: ${s.error}` : ""}
                    </li>
                  ))}
              </ul>
            </details>
          </Show>
        </Show>

        {/* The honest note while a live run holds the request open. */}
        <Show when={run.phase() === "running" && !t()}>
          <div class="run-warn">Closing this tab stops the run.</div>
        </Show>
        <Show when={run.phase() === "detached"}>
          <div class="run-warn">Re-checking every 15 s…</div>
        </Show>
      </div>
    </Show>
  );
}
