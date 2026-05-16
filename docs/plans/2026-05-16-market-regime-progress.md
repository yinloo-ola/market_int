# Progress: market-regime

Plan: docs/plans/2026-05-16-market-regime-implementation.md
Branch: market-regime
Started: 2026-05-16T00:00:00Z
Last updated: 2026-05-16T00:21:00Z

| # | Status | Task | Commit |
|---|--------|------|--------|
| 1 | ✅ done | Create `MarketRegime` struct and `from_spy_trend` constructor | 98ddf1f |
| 2 | ✅ done | Update constants and refactor `calculate_put_score` to accept `&MarketRegime` | 9c3da59 |
| 3 | ✅ done | Thread `MarketRegime` through `option_chain_to_csv_vec` and its callers | 9c3da59 |
| 4 | ✅ done | Add regime flag to Telegram caption | f0e756a |
| 5 | ✅ done | Compute SPY trend and wire regime into PerformAll pipeline | 65fabfd |
| 6 | ⏸ done-review | End-to-end integration test with mock data (checkpoint: done) | — |
