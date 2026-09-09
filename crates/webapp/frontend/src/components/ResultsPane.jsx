// One timeframe's full results view (spec §6.2 toolbar + §6.3 table +
// pagination). Each tab owns an independent view state — sort, filter,
// scored-only, page — so switching is a pure re-render with no fetch.
// Pipeline: rows → debounced case-insensitive filter (underlying+sector)
// → scored-only → sort over the FULL filtered array → 100-row slice.

import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
} from "solid-js";

import { COLUMNS } from "../lib/columns";
import { rescoreRow, topPicks } from "../lib/scoring";
import ColumnPicker from "./ColumnPicker";
import Pagination from "./Pagination";
import ResultsTable from "./ResultsTable";
import { comma, isNullValue } from "../lib/format";
import { defaultSort, sortRows } from "../lib/sort";

const PAGE_SIZE = 100;
const FILTER_DEBOUNCE_MS = 150;

// Stage names use the result-document vocabulary (underscores).
const STAGE_BY_TAB = {
  short: { id: "chains_short", label: "Chains · Short" },
  medium: { id: "chains_medium", label: "Chains · Medium" },
};

/// S6 badges: one ✗ / △ / ✓ chip per pipeline stage; failed and partial
/// stages carry an expandable error block (spec §6.6).
export function StageBadges(props) {
  const cls = (st) =>
    st === "failed" ? "failed" : st === "partial" ? "partial" : "ok";
  const mark = (st) => (st === "failed" ? "✗" : st === "partial" ? "△" : "✓");
  const pretty = (name) => name.replaceAll("_", " ");
  return (
    <div class="stage-badges">
      <For each={props.stages ?? []}>
        {(stg) => (
          <details class={`sbadge ${cls(stg.status)}`}>
            <summary>
              {mark(stg.status)} {pretty(stg.name)}
            </summary>
            <Show when={stg.error}>
              <pre class="errbox">{stg.error}</pre>
            </Show>
          </details>
        )}
      </For>
    </div>
  );
}

export default function ResultsPane(props) {
  // props.id ("short" | "medium"), props.active() — tab visibility getter,
  // props.tf (timeframe object or undefined), props.stageError,
  // props.stages (pipeline stage reports), props.thresholds,
  // props.columns — the shared column store,
  // props.scoring — the App-level weight store (RescoreControls).
  const [rawFilter, setRawFilter] = createSignal("");
  const [filter, setFilter] = createSignal("");
  const [scoredOnly, setScoredOnly] = createSignal(true); // default ON
  const [sortKey, setSortKey] = createSignal(null); // null → default ordering
  const [sortDir, setSortDir] = createSignal("asc");
  const [page, setPage] = createSignal(1);
  let debounceTimer;
  onCleanup(() => clearTimeout(debounceTimer));

  const allRows = () => props.tf?.rows ?? [];

  // View-model rows under the CURRENT weights (client-side re-scoring, ticket
  // 01): at production defaults the view is the FROZEN document verbatim —
  // identical to the pre-feature app, so an older document never silently
  // re-scores under newer constants (e.g. a floor change). `.score` becomes
  // the live custom score ONLY while weights are adjusted; the frozen
  // production score rides along as `.frozen_score` throughout.
  const viewRows = createMemo(() => {
    const p = props.scoring.params();
    const custom = props.scoring.isCustom();
    return allRows().map((row) => {
      const live = rescoreRow(row, p);
      return {
        ...row,
        frozen_score: row.score,
        live_parts: live,
        score: custom ? (live == null ? null : live.total) : row.score,
      };
    });
  });

  const reAdmittedCount = createMemo(
    () =>
      viewRows().filter(
        (r) => !isNullValue(r.score) && isNullValue(r.frozen_score)
      ).length
  );

  const onFilterInput = (e) => {
    const v = e.currentTarget.value;
    setRawFilter(v);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setFilter(v.trim().toLowerCase());
      setPage(1);
    }, FILTER_DEBOUNCE_MS);
  };

  const toggleScoredOnly = (checked) => {
    setScoredOnly(checked);
    setPage(1);
  };

  const onSort = (id) => {
    if (sortKey() !== id) {
      setSortKey(id);
      setSortDir("asc");
    } else if (sortDir() === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null); // third click: back to score-desc default
      setSortDir("asc");
    }
    setPage(1);
  };

  // Ticket 19 expansion state: exactly one open row per pane; collapses on
  // sort/filter/scored-only/page change and on tab switch (§6.4).
  const [openKey, setOpenKey] = createSignal(null);
  const onToggleRow = (row) => {
    const k = `${row.underlying}|${row.strike}`;
    setOpenKey((cur) => (cur === k ? null : k));
  };
  createEffect(on([sortKey, sortDir, page, filter, scoredOnly], () => setOpenKey(null)));
  createEffect(on(props.active, () => setOpenKey(null)));
  createEffect(on(props.columns.visible, () => setPage(1)));

  const hiddenDefs = () =>
    COLUMNS.filter((c) => !props.columns.visible().includes(c.id));
  const chainStage = () =>
    (props.stages ?? []).find((s) => s.name === STAGE_BY_TAB[props.id].id);

  // Text-only pass, kept separate from the scored gate so the empty panel can
  // attribute an empty table to the right cause (filter miss vs. scored-only
  // excluding the whole timeframe — different remedies, different copy).
  const textFilteredRows = createMemo(() => {
    const needle = filter();
    if (!needle) return viewRows();
    return viewRows().filter((r) => {
      const u = r.underlying;
      const s = r.sector;
      return (
        (u != null && String(u).toLowerCase().includes(needle)) ||
        (s != null && String(s).toLowerCase().includes(needle))
      );
    });
  });

  const filteredRows = createMemo(() => {
    const rows = textFilteredRows();
    return scoredOnly() ? rows.filter((r) => !isNullValue(r.score)) : rows;
  });

  const sortedRows = createMemo(() =>
    sortKey()
      ? sortRows(filteredRows(), sortKey(), sortDir())
      : defaultSort(filteredRows())
  );

  const pageCount = createMemo(() =>
    Math.max(1, Math.ceil(sortedRows().length / PAGE_SIZE))
  );
  const safePage = () => Math.min(page(), pageCount());
  const pageRows = () => {
    const p = safePage();
    return sortedRows().slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
  };

  // Top picks matched by (underlying, strike); rank drives ★n + tint.
  // Under custom weights the ranks are re-derived from the live scores
  // (same dedupe rules as the Rust selection); at production defaults the
  // frozen document picks are used verbatim.
  const pickRanks = createMemo(() => {
    const m = new Map();
    if (props.scoring.isCustom()) {
      const picks = topPicks(
        viewRows().map((r) => ({ row: r, score: r.score }))
      );
      for (const p of picks) {
        m.set(`${p.row.underlying}|${p.row.strike}`, m.size + 1);
      }
    } else {
      for (const p of props.tf?.top_picks ?? []) {
        m.set(`${p.underlying}|${p.strike}`, p.rank ?? "?");
      }
    }
    return m;
  });
  const pickRankOf = (row) => pickRanks().get(`${row.underlying}|${row.strike}`);

  return (
    <section class="pane" hidden={!props.active()}>
      {/* S6 strip: ✗/△/✓ per stage with expandable errors */}
      <StageBadges stages={props.stages} />

      <div class="controls">
        <input
          type="search"
          class="filter-input"
          placeholder="filter underlying / sector…"
          value={rawFilter()}
          onInput={onFilterInput}
          aria-label="filter rows by underlying or sector"
        />
        <label class="check">
          <input
            type="checkbox"
            checked={scoredOnly()}
            onChange={(e) => toggleScoredOnly(e.currentTarget.checked)}
          />
          scored only
        </label>
        <ColumnPicker store={props.columns} />
        {/* honest count: visible after every hiding rule, vs the raw total;
            under custom weights, also the re-admission tally */}
        <span class="count-line">
          {comma(sortedRows().length)} rows (filtered from{" "}
          {comma(allRows().length)})
          <Show when={props.scoring.isCustom() && reAdmittedCount() > 0}>
            {" "}
            · {comma(reAdmittedCount())} re-admitted by lower floor
          </Show>
        </span>
      </div>

      {/* The data view is the table — unchanged at every width (scope
          correction 2026-09-09: the rescore feature adds only the drawer). */}
      <Show when={pageRows().length > 0}>
        <div class="scroll-region">
          <ResultsTable
            visibleCols={props.columns.visible}
            rows={pageRows}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
            thresholds={props.thresholds}
            pickRankOf={pickRankOf}
            openKey={openKey}
            onToggleRow={onToggleRow}
            hiddenDefs={hiddenDefs}
            customScores={props.scoring.isCustom}
          />
        </div>
      </Show>
      <Show when={pageRows().length === 0}>
        <Show
          when={
            chainStage()?.status === "failed" ||
            chainStage()?.status === "partial"
          }
          fallback={
            <Show
              when={scoredOnly() && textFilteredRows().length > 0}
              fallback={
                <div class="empty-panel">
                  No rows match the current filter.
                </div>
              }
            >
              <div class="empty-panel">
                <b>No scored candidates on this timeframe.</b> Untick{" "}
                <b>scored only</b> to browse the{" "}
                {comma(textFilteredRows().length)} raw rows — none cleared
                the scoring gates (return floor, Sharpe &gt; 0). Try
                lowering the floor in <b>Adjust scoring</b>.
              </div>
            </Show>
          }
        >
          {(stg) => (
            <div class="empty-panel stage-failed-panel">
              <b>
                {stg().status === "partial" ? "△" : "✗"}{" "}
                {STAGE_BY_TAB[props.id].label} — no rows
              </b>
              <pre class="errbox">
                {stg().error ?? "stage produced no data"}
              </pre>
            </div>
          )}
        </Show>
      </Show>

      <Show when={sortedRows().length > 0}>
        <Pagination page={safePage} pageCount={pageCount} onGo={setPage} />
      </Show>
    </section>
  );
}
