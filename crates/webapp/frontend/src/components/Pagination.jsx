// Numbered pagination footer (spec §6.3): page size 100, numbered buttons
// with a current±1 window plus first/last anchors and ellipsis gaps,
// `page x / y` label. Position sticky bottom = cheap version of the pinned
// footer; full sticky-chrome polish belongs to ticket 19.

import { createMemo, For } from "solid-js";

function pagesToShow(cur, total) {
  const t = Math.max(total, 1);
  const c = Math.min(Math.max(cur, 1), t);
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
  const want = new Set([1, 2, c - 1, c, c + 1, t - 1, t]);
  const nums = [...want].filter((n) => n >= 1 && n <= t).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
}

export default function Pagination(props) {
  // props.page(), props.pageCount(), props.onGo(n)
  const seq = createMemo(() => pagesToShow(props.page(), props.pageCount()));
  const prev = () => props.onGo(Math.max(1, props.page() - 1));
  const next = () =>
    props.onGo(Math.min(props.pageCount(), props.page() + 1));
  return (
    <div class="pager" role="navigation" aria-label="table pagination">
      <span class="pager-label">
        page {props.page()} / {props.pageCount()}
      </span>
      <button
        type="button"
        class="pgbtn"
        disabled={props.page() <= 1}
        onClick={prev}
        aria-label="previous page"
      >
        ‹
      </button>
      <For each={seq()}>
        {(n) =>
          n === "…" ? (
            <span class="pggap">…</span>
          ) : (
            <button
              type="button"
              class="pgbtn"
              classList={{ active: n === props.page() }}
              onClick={() => props.onGo(n)}
            >
              {n}
            </button>
          )
        }
      </For>
      <button
        type="button"
        class="pgbtn"
        disabled={props.page() >= props.pageCount()}
        onClick={next}
        aria-label="next page"
      >
        ›
      </button>
    </div>
  );
}
