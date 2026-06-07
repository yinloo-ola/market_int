# Lessons Learned

<!--
Agent: read this at the start of each task during executing-tasks.
Follow every rule. Add new rules when you catch yourself making repeat mistakes.
Retire rules that no longer apply during finalizing.
-->

## Rules

- When adding columns to SQLite tables, `CREATE TABLE IF NOT EXISTS` won't alter existing tables. Always add an `ALTER TABLE ADD COLUMN` migration (with `.ok()` to ignore "column already exists" errors).
- The `telegram-bot-api` crate's multipart upload serializes JSON values via `.to_string()`, which double-escapes newlines in captions. Send caption as a separate `sendMessage` instead.
- When using constants, replace ALL magic numbers — don't leave some hardcoded and some constant.
- API responses may not be arrays. Check the actual shape (e.g., a map keyed by dates) before parsing.
- The `edit` tool requires exact whitespace matching. When oldText fails, use `cat -v -e -t` or `xxd` to inspect invisible characters like double newlines.
- When testing continuous ranges with boundary assertions (e.g., `bearness == 0.50`), account for floating-point imprecision. Use tolerance (`abs() < epsilon`) or test at exact integer multiples rather than trusting division to produce clean values.
- In a refactor, when consolidating orchestration into a single function, every metric's data window must be preserved exactly. Fetch once with the max window, then slice for shorter windows. Verify each metric's original fetch count against the new shared buffer.
- "Load once, pass slices" beats "each helper fetches its own" — it keeps helpers as pure compute+save, centralizes I/O, and avoids redundant database reads.
