# Lessons Learned

<!--
Agent: read this at the start of each task during ptk-execute.
Follow every rule. Add new rules when you catch yourself making repeat mistakes.
Rules must be generic patterns applicable to any domain or feature — not
specific to one service, entity, or use case.
Retire rules that no longer apply during finalizing.
-->

## Rules

- Before adding a second theme (or any palette-wide variation), tokenize hardcoded color values into CSS custom properties first and enforce a "no raw colors outside the token block" audit — the new theme then reduces to re-declaring tokens, and a three-layer cascade (default → media query → attribute/class override, most specific wins) keeps each theme one block.

## Tool Usage

- The workflow guard commits the **entire working tree** on `git commit`, not just staged paths. Before committing, `git restore` or stash unrelated changes, and always verify with `git show --stat HEAD` that only the intended files landed.
- A directory-wide `git add <dir>` sweeps **untracked neighbors** in that tree into the commit. When unrelated untracked work exists (prototypes, local scratch), enumerate files explicitly and confirm with `git show --stat HEAD` — an "uncommitted by design" file once rode into a backend commit this way.
- For portable bulk in-place edits (e.g., stripping a uniform argument suffix from many call sites), use `perl -i -pe 's/.../.../g'`. macOS `sed -i` requires an empty backup arg (`-i ''`) and otherwise silently mis-parses the command.
- Before documenting a count (presets, configs, table rows), measure it (`grep -c` / `awk`) — stale counts in prose are common and erode trust in the docs.
- In an auth-bypass preview flow, the **server derives its own data key**
  when auth is off (e.g. a fixed local identity) — seed data for *that*
  identity, not the client-side bypass identity; the two diverge silently
  and the preview shows an empty store.
- Prototype UI **where it will be judged**: a dev-gated `?variant=`
  switch inside the real page answers look-and-feel questions with real
  data and density; a standalone mock leaves even the requester unsure
  which artifact is authoritative. Fold the winner in, strip the
  scaffolding, keep the full variant set on a throwaway branch.

## Frontend Patterns

- A controlled `type="number"` input sanitizes the in-progress "." on every
  keystroke (the DOM value can't represent "1."), so typed decimals silently
  degrade ("1.5" → "15"). For decimal entry use `type="text"` +
  `inputmode="decimal"` and parse at submit.
- Never format a local calendar date with `toISOString()` — it renders the
  UTC-shifted day (wrong for any UTC-offset viewer around midnight). Build
  YYYY-MM-DD from the local `getFullYear/getMonth/getDate` components. The
  same trap applies to **date arithmetic**: `new Date(y, m-1, d+n)` builds
  in the viewer's timezone and then formatting it in another timezone
  shifts the day. Do calendar arithmetic timezone-neutral (e.g. `Date.UTC`
  at noon) and format in the target zone.
- A timeout that clears shared UI state (a flash message, a toast) must
  `clearTimeout` its predecessor and be cancelled on unmount — overlapping
  triggers let the elder timer wipe the younger message early.
- When mocking `fetch` in a harness, default the method
  (`opts.method ?? "GET"`) — real callers omit it for GETs, so a `?? ""`
  default silently 404s every unannotated request while the first render
  still works.
- Dev servers that validate Host headers (vite 6+ `server.allowedHosts`)
  reject tunnel hostnames; allow-list the tunnel provider's domain
  suffix — quick tunnels randomize the hostname per run, so a single
  host entry never matches.

## Architecture Rules

- When the same logic exists in two places (e.g., a production scorer and a research/backtest copy), add a **pinning regression test** asserting they produce identical output on a shared input vector. It catches divergence the moment either side is edited — far cheaper than de-duplicating the implementations.
- A pure refactor (removing already-unused parameters, reordering) legitimately produces **zero** test reds — that is correct, not suspicious. "Zero reds is suspicious" applies to *behavior*-changing edits, not signature cleanups where call sites are merely updated for compilation.
- When you can make one module mirror another **by calling it** (e.g. a backtest preset delegating to the shipped production scorer) instead of replicating the formula, prefer delegation — it removes the duplicate a pin would guard, so there is nothing to drift. Pinning is the fallback when delegation isn't possible (different layer, language, or perf constraint).
- Keep the "research baseline" and the "production mirror" configs distinct and named honestly. A backtest `control` that diverges from production scoring will mislead anyone who reads its results as the live strategy's performance — always provide an explicit, pinned mirror.
- A function parameter that is accepted but ignored is a **false contract**. Prefix it `_` immediately; if full removal's cascade is large, schedule removal as its own task rather than leaving the false seam in place.
- When a hard cutoff (e.g., a max-value reject) and a continuous score dimension encode the same idea (e.g., "danger"), pick **one**. Keeping both lets them disagree silently and discards the cases where they disagree for good reasons (e.g., a high value that a continuous model correctly rates as safe).
- A **docstring that misstates return behavior** is a false contract, same class as an ignored parameter. Before trusting documented error / empty-path behavior, check it against the actual return path — a doc claiming "returns an empty map, no error" while the code returns `Err` will mislead the next caller into skipping the error handler.
- An atomic temp-file write is only safe to share a temp name when its
  callers are single-flight. When several handlers can write the same target
  concurrently, give the temp file a per-process sequence (or unique id) or
  two overlapping writes collide mid-write and a rename publishes torn
  content.
- A read-modify-write that spans a slow external call must not write back its
  pre-call snapshot (it clobbers concurrent mutations) and should not hold a
  lock across the call. Re-read after the call and merge by identity; keep
  locks scoped to the fast read-modify-write only.
- A state transition that touches **two collections in one document**
  (record X and remove Y) must be **one** server-side read-modify-write —
  never two requests the client stitches. Paired calls make half-applied
  states reachable after any failure between them.
- When a whole-document last-writer-wins store starts encoding economic
  **transitions** (not just state), a lost update becomes an economic event
  (a position resurrected, shares un-reduced). Revisit the concurrency
  model (per-key serialization) before such mutations meet multi-device
  use — not after.
- A scripted seam proves your code's **shape**, not the external API's
  **semantics**. Before trusting a new query mode in production, probe the
  real endpoint once with the actual parameters: a server-side filter can
  return empty rows for exactly the cases the feature exists to surface.
