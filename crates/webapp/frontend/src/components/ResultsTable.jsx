// The Analyst Table body (spec §6.3): sortable headers with asc/desc
// arrows, vol-tier dot (underlying + realized_vol cells), momentum chip
// after the price percentile, ★n rank badge + tint for top-pick rows
// matched by (underlying, strike), bold percentage ror, visible ∅ null
// marker everywhere.
//
// Row objects are immutable snapshots from /api/latest, so cell text is
// formatted once per row/slice mount — sorting/filtering/pagination only
// move existing DOM nodes (solid's reference-keyed <For>), keeping the
// 100-row page cheap even at the ~6,200-row design bound.

import { For, Show, createMemo } from "solid-js";

import { COLUMNS } from "../lib/columns";
import ExpansionPanel from "./ExpansionPanel";
import Tip from "./Tip";
import { tipText } from "../lib/tips";
import {
  formatCell,
  isNullValue,
  momentumOf,
  volTier,
} from "../lib/format";

const rowKey = (row) => `${row.underlying}|${row.strike}`;
function NullMark(props) {
  return <span class="null-mark">{props.text}</span>;
}

function CellText(props) {
  const cell = formatCell(props.kind, props.value);
  return (
    <Show when={!cell.isNull} fallback={<NullMark text={cell.text} />}>
      {cell.text}
    </Show>
  );
}

function Cell(props) {
  // props.col (definition), props.row (snapshot), props.thresholds,
  // props.pickRank (number | null)
  const c = props.col;
  const r = props.row;

  if (c.id === "underlying") {
    return (
      <td>
        <Show when={props.pickRank != null}>
          <span class="star">★{props.pickRank}</span>
        </Show>
        <b>{r.underlying}</b>
        <Show when={volTier(r.realized_vol, props.thresholds)}>
          {(tier) => (
            <>
              {" "}
              <span class={`dot ${tier()}`} />
            </>
          )}
        </Show>
      </td>
    );
  }

  if (c.id === "realized_vol") {
    return (
      <td class="num">
        <Show when={volTier(r.realized_vol, props.thresholds)}>
          {(tier) => (
            <>
              <span class={`dot ${tier()}`} />{" "}
            </>
          )}
        </Show>
        <CellText kind={c.kind} value={r[c.id]} />
      </td>
    );
  }

  if (c.id === "score") {
    // Live (custom-weight) score primary; under custom weights the frozen
    // production score rides along — or the "re-admitted" tag for rows the
    // lowered floor brought back (approved layout, ticket 01).
    return (
      <td class="num score-cell">
        <CellText kind={c.kind} value={r[c.id]} />
        <Show when={props.customScores?.()}>
          <Show
            when={!isNullValue(r.frozen_score)}
            fallback={
              <Show when={!isNullValue(r.score)}>
                <span class="score-frozen readmit">re-admitted</span>
              </Show>
            }
          >
            <span class="score-frozen">prod {r.frozen_score.toFixed(3)}</span>
          </Show>
        </Show>
      </td>
    );
  }

  if (c.id === "price_percentile") {
    return (
      <td class="num">
        <CellText kind={c.kind} value={r[c.id]} />
        <Show when={momentumOf(r.price_percentile, props.thresholds)}>
          {(mom) => (
            <>
              {" "}
              <span class={`chip ${mom().toLowerCase()}`}>{mom()}</span>
            </>
          )}
        </Show>
      </td>
    );
  }

  return (
    <td classList={{ num: c.align === "num", strong: c.id === "rate_of_return" }}>
      <CellText kind={c.kind} value={r[c.id]} />
    </td>
  );
}

export default function ResultsTable(props) {
  // props.visibleCols(), props.rows(), props.sortKey(), props.sortDir(),
  // props.onSort(id), props.thresholds, props.pickRankOf(row),
  // props.openKey()/onToggleRow(row) — ticket 19 expansion seam,
  // props.hiddenDefs() — currently-hidden column defs for the chips block.
  const visible = createMemo(() =>
    COLUMNS.filter((c) => props.visibleCols().includes(c.id))
  );

  return (
    <table>
      <thead>
        <tr>
          {/* leading expander column (26px per §6.3) */}
          <th class="exp-col" aria-hidden="true" />
          <For each={visible()}>
            {(c) => {
              const active = () => props.sortKey() === c.id;
              return (
                <th
                  classList={{ num: c.align === "num" }}
                  role="button"
                  tabIndex={0}
                  aria-sort={
                    active()
                      ? props.sortDir() === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  onClick={() => props.onSort(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      props.onSort(c.id);
                    }
                  }}
                >
                  <Tip text={tipText(c.id, props.thresholds)}>
                    <span class="tip-target">
                      {c.label}
                      <Show when={active()}>
                        {" "}
                        <span class="sort-arrow">
                          {props.sortDir() === "asc" ? "↑" : "↓"}
                        </span>
                      </Show>
                    </span>
                  </Tip>
                </th>
              );
            }}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.rows()}>
          {(row) => {
            const rank = () => props.pickRankOf(row);
            const key = () => rowKey(row);
            const isOpen = () => props.openKey() != null && props.openKey() === key();
            return (
              <>
                <tr
                  classList={{
                    pick: rank() != null,
                    prow: isNullValue(row.score),
                    expandable: true,
                    open: isOpen(),
                  }}
                  onClick={() => props.onToggleRow(row)}
                >
                  <td class="exp-col">
                    {isOpen() ? "▾" : "▸"}
                  </td>
                  <For each={visible()}>
                    {(def) => (
                      <Cell
                        col={def}
                        row={row}
                        thresholds={props.thresholds}
                        pickRank={rank()}
                        customScores={props.customScores}
                      />
                    )}
                  </For>
                </tr>
                <Show when={isOpen()}>
                  <tr class="exp-row">
                    <td colspan={visible().length + 1}>
                      <ExpansionPanel
                        row={row}
                        thresholds={props.thresholds}
                        hiddenDefs={props.hiddenDefs()}
                      />
                    </td>
                  </tr>
                </Show>
              </>
            );
          }}
        </For>
      </tbody>
    </table>
  );
}
