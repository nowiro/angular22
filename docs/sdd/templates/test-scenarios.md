---
type: template
for: test-strategy
description: Shape of the test-strategy agent response — scenarios from AC + RBAC matrix + coverage gaps
---

# Template: test scenarios (from Acceptance criteria)

> Canonical response shape for [`test-strategy`](../../../.github/agents/test-strategy.agent.md).
> Input: the spec's `## Acceptance criteria` section (`docs/specs/<slug>/spec.md`). Output: the **test
> triple** ([`../methodology.md`](../methodology.md) §Test triple) as input to the plan.
> Read-only — execution: `vitest` (unit) / `playwright` (e2e).

## Scenarios (technique per AC)

> Techniques: happy-path · equivalence partitioning + boundary value analysis · decision table ·
> state transition · error/negative. Every AC has ≥1 happy + edge.

| AC  | scenario | technique | type (unit/e2e) | role | element / `data-testid` | expectation |
| --- | -------- | --------- | --------------- | ---- | ----------------------- | ----------- |
| AC1 | [?]      | [?]       | [?]             | [?]  | [?]                     | [?]         |

## RBAC matrix (when the task touches permissions)

> For **every** role: positive (with permission) **and** negative authz (without — hidden/disabled +
> deep-link/call rejected, not just hidden in the UI).

| role  | element / action | visible | active | hidden | disabled | forbidden (guard/deep-link) |
| ----- | ---------------- | ------- | ------ | ------ | -------- | --------------------------- |
| admin | [?]              | [?]     | [?]    | [?]    | [?]      | [?]                         |
| user  | [?]              | [?]     | [?]    | [?]    | [?]      | [?]                         |
| guest | [?]              | [?]     | [?]    | [?]    | [?]      | [?]                         |

## unit ↔ e2e split

- **unit (Vitest):** [?] domain logic / pure functions / store / guard / `hasRole`.
- **e2e (Playwright):** [?] flow through components / stepper / per-role visibility / deep-link authz.

## Coverage gaps

> **AC without a scenario** = under-coverage (plan blocker). **scenario without an AC** = scope creep.
> Interactive element without `data-testid` = gap (flag it).

- [?] gap / missing `data-testid` / AC uncovered — or "none".

## Verdict

**go / no-go** (is the triple complete?) + one sentence. Final verdict → orchestrator (Opus).
