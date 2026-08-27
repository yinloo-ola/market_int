// Sort rules (spec §6.3): click header → asc → desc → default.
// Nulls are ALWAYS last regardless of direction. Default order is
// score desc with a rate_of_return desc tie-break (nulls last on both
// levels). Pure JS — no framework imports.

import { isNullValue } from "./format.js";

// Direction-agnostic base compare for two NON-null values: numbers numerically,
// strings case-insensitively (sector/underlying sort naturally).
function baseCompare(va, vb) {
  if (typeof va === "number" && typeof vb === "number") return va - vb;
  return String(va).localeCompare(String(vb), undefined, { sensitivity: "base" });
}

const isSortableNull = (v) => isNullValue(v);

// Sort rows by one column. Nulls sink to the end on both asc and desc;
// equal entries keep their relative (stable) order.
export function sortRows(rows, key, dir) {
  const mul = dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    const an = isSortableNull(va);
    const bn = isSortableNull(vb);
    if (an || bn) return an && bn ? 0 : an ? 1 : -1; // nulls last always
    return mul * baseCompare(va, vb);
  });
}

// Default ordering when no explicit column sort is active:
// score desc, null score last, tie-break rate_of_return desc (null last).
export function defaultSort(rows) {
  return [...rows].sort((a, b) => {
    const as = a.score;
    const bs = b.score;
    const an = isSortableNull(as);
    const bn = isSortableNull(bs);
    if (an || bn) return an && bn ? 0 : an ? 1 : -1;
    let c = bs - as; // score desc
    if (c !== 0) return c;
    const ar = a.rate_of_return;
    const br = b.rate_of_return;
    const arn = isSortableNull(ar);
    const brn = isSortableNull(br);
    if (arn || brn) return arn && brn ? 0 : arn ? 1 : -1;
    return br - ar; // ror desc tie-break
  });
}
