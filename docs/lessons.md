# Lessons Learned

<!--
Agent: read this at the start of each task during ptk-execute.
Follow every rule. Add new rules when you catch yourself making repeat mistakes.
Rules must be generic patterns applicable to any domain or feature — not
specific to one service, entity, or use case.
Retire rules that no longer apply during finalizing.
-->

## Rules

- (append new rules here during execution)

## Tool Usage

- The workflow guard commits the **entire working tree** on `git commit`, not just staged paths. Before committing, `git restore` or stash unrelated changes, and always verify with `git show --stat HEAD` that only the intended files landed.
- For portable bulk in-place edits (e.g., stripping a uniform argument suffix from many call sites), use `perl -i -pe 's/.../.../g'`. macOS `sed -i` requires an empty backup arg (`-i ''`) and otherwise silently mis-parses the command.
- Before documenting a count (presets, configs, table rows), measure it (`grep -c` / `awk`) — stale counts in prose are common and erode trust in the docs.

## Testing Patterns

- When the same logic exists in two places (e.g., a production scorer and a research/backtest copy), add a **pinning regression test** asserting they produce identical output on a shared input vector. It catches divergence the moment either side is edited — far cheaper than de-duplicating the implementations.
- A pure refactor (removing already-unused parameters, reordering) legitimately produces **zero** test reds — that is correct, not suspicious. "Zero reds is suspicious" applies to *behavior*-changing edits, not signature cleanups where call sites are merely updated for compilation.
- When you can make one module mirror another **by calling it** (e.g. a backtest preset delegating to the shipped production scorer) instead of replicating the formula, prefer delegation — it removes the duplicate a pin would guard, so there is nothing to drift. Pinning is the fallback when delegation isn't possible (different layer, language, or perf constraint).

## Architecture Rules

- Keep the "research baseline" and the "production mirror" configs distinct and named honestly. A backtest `control` that diverges from production scoring will mislead anyone who reads its results as the live strategy's performance — always provide an explicit, pinned mirror.
- A function parameter that is accepted but ignored is a **false contract**. Prefix it `_` immediately; if full removal's cascade is large, schedule removal as its own task rather than leaving the false seam in place.
- When a hard cutoff (e.g., a max-value reject) and a continuous score dimension encode the same idea (e.g., "danger"), pick **one**. Keeping both lets them disagree silently and discards the cases where they disagree for good reasons (e.g., a high value that a continuous model correctly rates as safe).
- A **docstring that misstates return behavior** is a false contract, same class as an ignored parameter. Before trusting documented error / empty-path behavior, check it against the actual return path — a doc claiming "returns an empty map, no error" while the code returns `Err` will mislead the next caller into skipping the error handler.
