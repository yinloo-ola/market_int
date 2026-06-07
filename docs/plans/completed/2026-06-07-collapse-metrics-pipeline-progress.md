# Progress: Collapse metrics pipeline

Plan: docs/plans/2026-06-07-collapse-metrics-pipeline-implementation.md
Branch: collapse-metrics-pipeline
Started: 2026-06-07T21:30:00
Last updated: 2026-06-07T21:45:00

| # | Status | Task | Commit |
|---|--------|------|--------|
| 1 | ✅ done | Create `src/metrics.rs` with `run_all` and make ATR helpers pub (checkpoint: test) | deb68e3..HEAD |
| 2 | ✅ done | Strip `calculate_and_save` from the five metric modules | HEAD |
| 3 | ✅ done | Rewire `main.rs` — delete standalone subcommands, replace `PerformAll` | `0139bb5` |
