---
type: template
for: orchestrator
description: Shape of the /analyze report — spec↔plan↔code consistency (read-only, go/no-go BEFORE code)
---

# Template: analyze (spec ↔ plan ↔ code consistency)

> Shape canon for the **analyze** step ([`/analyze`](../../../.github/prompts/analyze.prompt.md),
> [`../methodology.md`](../methodology.md)). Read-only go/no-go report **before** `implement`.
> Structural layer = `pnpm sdd:check`; semantic layer (AC coverage, contradictions, drift) = here.

## Structural gate

- **`pnpm sdd:check`:** [?] result (spec↔plan traceability, table header, no `[?]` outside draft).

## AC coverage by the plan

> **AC with no task** = under-coverage (no-go). **Task with no AC** = scope creep (remove it or add an AC).

| AC  | plan task (Txxx) | covered? | gap / contradiction / drift |
| --- | ---------------- | -------- | --------------------------- |
| AC1 | [?]              | [?]      | [?]                         |

## Consistency and drift

- **spec ↔ plan contradictions:** [?] (or "none").
- **Code drift:** [?] existing code that conflicts with the spec / stale assumptions (or "none").
- **Test triad:** [?] scenarios + Vitest + e2e present in the plan (missing = no-go).

## Verdict

**go / no-go** + one sentence. no-go → back to `specify`/`clarify`/`plan`. Verdict: orchestrator (Opus).
