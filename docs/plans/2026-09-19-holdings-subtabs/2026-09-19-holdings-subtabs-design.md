# Holdings sub-tabs — side-rail layout (variant B)

## At a glance

The Holdings tab currently stacks everything into one long page on mobile
(cash strip → wheel stats → lot rows → toolbar → one merged urgency list)
and a two-pane rail+list on desktop, with Refresh Marks buried mid-page.
This change replaces that layout with the prototype-approved **variant B
"Side rail"** on every width: three sub-tabs — LOTS | PUTS | CALLS — as
tiles in a sticky rail (desktop) or a horizontal tile row (mobile), with
the cash strip, Refresh Marks and the flash notice always visible. The
server contract is untouched: the same `GET /api/holdings` document is
re-arranged client-side; every number still renders verbatim from the
server-owned view.

The UI was approved via prototype (user verdict 2026-09-19, "B"):
`.scratch/holdings-subtabs/prototype/index.html` (standalone mock), then an
in-app `?variant=` prototype integrated into the real `HoldingsPanel`
(DEV-gated) and driven against the real backend and real data. Execution
folds variant B in as the only layout and strips the prototype scaffolding.

**Key decisions**

- Tabs on desktop **and** mobile — the user explicitly extended the idea
  beyond mobile during brainstorming (Q1); the merged puts+calls urgency
  list and the wheel-stats block are superseded (counts move into the
  tiles). `(rejected: mobile-only tabs keeping the desktop rail+list —
  user chose tabs everywhere)`
- Variant B won over A "Segment bar" and C "Page hero" on the approved
  prototype; it preserves the variant-C rail heritage as navigation.
- Breakpoint 900px (the panel's existing mobile breakpoint) decides
  rail-vs-row; no new breakpoints.
- Active tab is in-memory session state only: survives data reloads,
  never persists across visits (Q5).
- The prototype's `?variant=`/DEV gating, switcher bar, and variants A/C
  are scaffolding and are removed, not shipped.

| R# | Requirement in one line | Risk |
|----|--------------------------|------|
| R1 | Desktop side-rail layout (≥900px): sticky rail with cash strip + three tab tiles beside the active pane column | — |
| R2 | Mobile layout (<900px): rail collapses to a horizontal strip (brand line, full-width cash strip, tile row) above the pane column | — |
| R3 | Tab model: LOTS \| PUTS \| CALLS order, default LOTS, counts + context line per tile, selection survives reloads but never persists | — |
| R4 | Per-tab content: kind-filtered urgency-sorted rows, per-tab add button + form, inline dialogs, per-tab empty states | — |
| R5 | Cash strip, Refresh Marks and flash notice stay visible from every tab | — |
| R6 | Superseded scaffolding removed: wheel layout, merged urgency list, wheel-stats block, `?variant=`/switcher code, variants A/C, dead CSS | — |
| R7 | DOM smoke lane drives the tabbed layout and stays green | — |

## Requirements

### R1: Desktop side-rail layout

At ≥900px the Holdings panel renders a two-column grid: a sticky left rail
(brand line "Wheel ledger", the cash strip block, then one tile button per
tab) beside a main column (active tab title, Refresh Marks button right-
aligned, flash notice, pane toolbar, pane form, pane rows).

**Acceptance criteria**
- Given a viewport ≥900px, When the Holdings tab opens, Then the panel is a
  two-column grid (~13rem rail + fluid main), the rail stays fixed to the
  viewport while the pane column scrolls, and the LOTS tile shows active
  styling (accent border + inset bar).
- Given the user clicks the PUTS tile, Then the tile's active styling moves
  and the main column title reads "Puts" without any reload.
- Given the LOTS tab is active, Then the pane toolbar carries a "N sh held"
  hint right-aligned after the add button.

### Checkpoints: none
### Review: skip

### R2: Mobile tile-row layout

Below 900px the rail collapses to a horizontal strip at the top: the brand
line full-width, the cash strip as a full-width baseline row (compact big
number), and the three tiles side-by-side sharing the row; the main column
(title hidden, Refresh Marks retained) stacks below. This mirrors the
approved prototype at phone width.

**Acceptance criteria**
- Given a viewport <900px, When the Holdings tab opens, Then the three
  tiles sit in one horizontal row, the cash strip spans the full width
  above them, and no horizontal overflow appears at 360px width.
- Given the pane column is scrolled on mobile, Then Refresh Marks remains
  reachable in the main header (static, not sticky, per the approved
  artifact).

### Checkpoints: none
### Review: skip

### R3: Tab model

Tabs are LOTS | PUTS | CALLS in that order; LOTS is active on load. Each
tile shows its count (open lots / open puts / open calls) and a context
line ("N sh held" / "N pace-met" / "N ITM" — ITM counted from the
server-owned `spot_pct_vs_strike > 0`). Selection lives in an in-memory
signal: data reloads (refresh/add/close) never change the active tab, and
nothing persists across visits.

**Acceptance criteria**
- Given any ledger state, When the panel mounts, Then LOTS is active and
  each tile shows the correct count and context line from the GET
  document.
- Given the user is on the CALLS tab, When Refresh Marks completes, Then
  the CALLS tab is still active and tile counts reflect the fresh
  document.
- Given the user closes the panel and reopens it (fresh mount), Then LOTS
  is active again (no persistence).
- Given an empty ledger, Then tiles render with count 0 and the context
  lines degrade gracefully ("0 sh held" / "0 pace-met" / "0 ITM").

### Checkpoints: none
### Review: skip

### R4: Per-tab content and flows

Each pane renders only its kind: LOTS → `LotRailRow`s (unchanged, incl.
per-lot "sell call…" and the `SellCallForm`), PUTS → put `OptionRow`s,
CALLS → call `OptionRow`s (each kind urgency-sorted by
`pl_pct − target_pct`, same key the merged list used). Each pane has its
own add button opening its own form (+ New lot / + Sell put / + Sell call)
rendered inside the pane. All dialogs (close put/call incl. the assigned
stage-2 lot form, sell call from lot) anchor inline under the entry that
opened them, inside their pane; the one-dialog-at-a-time and busy-guard
rules are unchanged. Empty panes show their per-tab message.

**Acceptance criteria**
- Given puts and calls exist, When the PUTS pane is active, Then only put
  rows render, sorted most-urgent first; the CALLS pane likewise.
- Given the user opens "+ Sell put" on the PUTS pane, When the form
  submits, Then the new unpriced put appears in the PUTS pane, the form
  closes, and the flash notice prompts a marks refresh — without leaving
  the tab.
- Given a put close dialog with "assigned", When stage 2 confirms, Then
  the put disappears from PUTS and the created lot is visible in the LOTS
  tab (user switches tabs to see it; the notice says what landed).
- Given a call closed as "called away", Then the call leaves CALLS and the
  owning lot is reduced (visible in LOTS), per existing server behavior.
- Given no entries of a kind, When its pane opens, Then the pane shows its
  empty-state message and only the add button.

### Checkpoints: none
### Review: skip

### R5: Global chrome always visible

The cash strip (free/cash−reserved + edit), the Refresh Marks button, and
the flash notice are reachable from every tab: cash strip in the rail
(desktop) / full-width strip (mobile), Refresh Marks in the main column
header, notice directly under it. Placement is per the approved artifact;
behavior (PATCH-cash re-render from response, refresh busy-guard, notice
4s flash) is unchanged.

**Acceptance criteria**
- Given any active tab, When the user refreshes marks, Then the button
  disables while in flight, the notice reports stale/ok, and the result is
  visible without switching tabs.
- Given any active tab, When the user edits cash, Then the strip re-renders
  from the PATCH response numbers (no client math).

### Checkpoints: none
### Review: skip

### R6: Superseded scaffolding removed

The wheel layout (`.hp-wheel` grid + rail lot block), the merged urgency
list, the wheel-stats block, and the merged() derivation are removed;
variant B is the only layout. All `?variant=` / `import.meta.env.DEV`
prototype gating, the switcher bar, variants A/C, the keyboard cycling,
and the throwaway `pv-*` "PROTOTYPE" CSS section are removed — the winning
layout's styles integrate into the holdings CSS area as first-party rules
(class names may normalize to the `hp-` convention). The HoldingsPanel
file header comment is rewritten for the new layout. No backend file
changes; the API document is untouched.

**Acceptance criteria**
- Given the release build, Then no `?variant=` handling, switcher bar, or
  variants A/C code exists in the bundle, and `grep -r 'pv-\|PROTO'`
  over the frontend src finds no prototype residue.
- Given the shipped panel, Then no route renders the old two-pane
  rail+merged-list wheel layout.
- Given `cargo test` and `npm run smoke`, Then both pass (Rust untouched;
  smoke updated per R7).

### Checkpoints: none
### Review: skip

### R7: Smoke lane drives the tabbed layout

The DOM smoke lane (happy-dom, `npm run smoke`) updates its Holdings
section to switch panes via the tiles before asserting put/call flows, and
gains coverage for the new chrome: default LOTS selection, tile counts,
per-tab empty/rows switching, and chrome visibility from a non-default
tab. The parity lane (scoring port) is untouched.

**Acceptance criteria**
- Given `npm run smoke`, Then all existing hold-flow assertions (add put,
  unpriced row, close dialog, DELETE captured) pass against the new layout
  by driving the PUTS tile first, and the new tab-model assertions pass.
- Given the smoke bundle, Then it mounts the panel with no `?variant=`
  parameter and sees only variant B.

### Checkpoints: none
### Review: skip

## Approaches considered

- **Variant A "Segment bar"** (slim header + full-width segmented tabs):
  clean, but reads as generic chrome and keeps nothing of the panel's
  rail heritage — lost to B on the prototype review.
- **Variant C "Page hero"** (thin strip + underline tabs + per-tab hero
  band with promoted add button): strongest personality, but the hero
  band duplicates tile information and pushes rows below the fold on
  phones — lost to B.
- **Variant B "Side rail"** (winner): desktop keeps a sticky navigation
  rail (the variant-C wheel rail's heritage, now as tabs), mobile
  collapses it to a tile row; cash + refresh + notice always on top.
  Approved by the user on 2026-09-19 over the other two, first as a
  standalone mock (`.scratch/holdings-subtabs/prototype/index.html`),
  then confirmed in-app against the real backend via the `?variant=`
  prototype. Finalizing should preserve the standalone artifact on a
  throwaway branch (`git add -f .scratch/...`), not on main.
- **Mobile-only tabs** (keep desktop rail+list): rejected by the user in
  brainstorming — tabs wanted on both.

## Architecture

Client-side only. `HoldingsPanel` keeps all of its state and handlers
(ledger signal, one-dialog signal, busy guard, flash notice, PATCH-cash
re-render, refresh/add/assign/close flows) and re-roots its JSX: the
`hp-wheel` two-pane return becomes the side-rail grid. New pieces are a
`pane` signal (LOTS/PUTS/CALLS), a `paneDefs` derivation (counts + context
lines off the same ledger arrays), and per-pane render helpers
(`paneRows`/`paneForm`/`paneToolbar`) reusing the existing row, form and
dialog components verbatim. Per-kind urgency sort reuses the existing
`urgencyKey`. Styles integrate as first-party `hp-`-convention rules;
`.hp-list-*`, `.holdings-*`, form and dialog styles are reused untouched.

Data flow is unchanged: `GET /api/holdings` → render server-owned views
verbatim; mutations re-`GET` or patch from the response. No new fetches,
no new API surface, no schema change.

## Error handling

Unchanged from the current panel: API errors and mutation failures flash
through the one notice line; the refresh/add/confirm busy guard prevents
double submits; refresh reports unpriced entries kept at their last mark.
The notice now renders in the main column header so it is visible from
every tab.

## Testing

- `npm run smoke` — Holdings section updated per R7; parity lane untouched.
- `cargo test` — no Rust changes; must stay green.
- Manual acceptance at ≥900px, ~768px, and 360–400px widths against the
  local dev loop (`make webapp-run` + `npm run dev`), exercising the R4
  flow list end to end.

## Feature acceptance

- Given a signed-in user with lots, puts and calls, When they open the
  Holdings tab and, from LOTS, sell a covered call from a lot, switch to
  PUTS to add a put, refresh marks, close that put as assigned and confirm
  the prefilled lot, then switch to CALLS and close a call as called away —
  Then every step completes inside the tab it started in with the cash
  strip and Refresh Marks visible throughout, tile counts and context
  lines update after each mutation, the lot list reflects the assignment
  and the called-away reduction, and the layout holds at desktop, tablet,
  and phone widths.

### Feature review: auto
