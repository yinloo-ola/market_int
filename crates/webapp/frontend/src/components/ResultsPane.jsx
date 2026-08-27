// One timeframe's full results view (spec §6.2 toolbar + §6.3 table +
// pagination). Each tab owns an independent view state — sort, filter,
// scored-only, page — so switching is a pure re-render with no fetch.
// Pipeline: rows → debounced case-insensitive filter (underlying+sector)
// → scored-only → sort over the FULL filtered array → 100-row slice.

import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
} from "solid-js";

import ColumnPicker from "./ColumnPicker";
import Pagination from "./Pagination";
import ResultsTable from "./ResultsTable";
import { comma, isNullValue } from "../lib/format";
import { defaultSort, sortRows } from "../lib/sort";

const PAGE_SIZE = 100;
const FILTER_DEBOUNCE_MS = 150;

const STAGE_BY_TAB = { short: "chains·short", medium: "chains·medium" };

function emptyStateMessage(tabId, tf, stageError) {
  if (!tf) {
    // A timeframe key is present iff that stage produced data (spec §3.4);
    // when absent, name the failed chain stage per the S6 presentation.
    return stageError
      ? `No rows — ${STAGE_BY_TAB[tabId]} failed: ${stageError}`
      : `No rows — ${STAGE_BY_TAB[tabId]} produced no data for this run.`;
  }
  return "No rows match the current filter.";
}

export default function ResultsPane(props) {
  // props.id ("short" | "medium"), props.active() — tab visibility getter,
  // props.tf (timeframe object or undefined), props.stageError,
  // props.thresholds, props.columns — the shared column store.
  const [rawFilter, setRawFilter] = createSignal("");
  const [filter, setFilter] = createSignal("");
  const [scoredOnly, setScoredOnly] = createSignal(true); // default ON
  const [sortKey, setSortKey] = createSignal(null); // null → default ordering
  const [sortDir, setSortDir] = createSignal("asc");
  const [page, setPage] = createSignal(1);
  let debounceTimer;
  onCleanup(() => clearTimeout(debounceTimer));

  const allRows = () => props.tf?.rows ?? [];

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

  // Column changes are shared across tabs; reset this tab's page too.
  createEffect(on(props.columns.visible, () => setPage(1)));

  const filteredRows = createMemo(() => {
    const needle = filter();
    const scoredGate = scoredOnly();
    return allRows().filter((r) => {
      if (scoredGate && isNullValue(r.score)) return false;
      if (!needle) return true;
      const u = r.underlying;
      const s = r.sector;
      return (
        (u != null && String(u).toLowerCase().includes(needle)) ||
        (s != null && String(s).toLowerCase().includes(needle))
      );
    });
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
  const pickRanks = createMemo(() => {
    const m = new Map();
    for (const p of props.tf?.top_picks ?? []) {
      m.set(`${p.underlying}|${p.strike}`, p.rank ?? "?");
    }
    return m;
  });
  const pickRankOf = (row) => pickRanks().get(`${row.underlying}|${row.strike}`);

  return (
    <section class="pane" hidden={!props.active()}>
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
        {/* honest count: visible after every hiding rule, vs the raw total */}
        <span class="count-line">
          {comma(sortedRows().length)} rows (filtered from{" "}
          {comma(allRows().length)})
        </span>
      </div>

      <Show
        when={pageRows().length > 0}
        fallback={
          <div class="empty-panel">
            {emptyStateMessage(props.id, props.tf, props.stageError)}
          </div>
        }
      >
        <ResultsTable
          visibleCols={props.columns.visible}
          rows={pageRows}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={onSort}
          thresholds={props.thresholds}
          pickRankOf={pickRankOf}
        />
      </Show>

      <Show when={sortedRows().length > 0}>
        <Pagination page={safePage} pageCount={pageCount} onGo={setPage} />
      </Show>
    </section>
  );
}
