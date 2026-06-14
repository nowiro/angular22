---
type: template
for: doc-reviewer
description: Shape of the doc-reviewer response — Definition of Ready (gate BEFORE producing)
---

# Template: doc-review (Definition of Ready)

> Shape canon for the [`doc-reviewer`](../../../.github/agents/doc-reviewer.agent.md) response —
> the **FIRST gate of the SDD ladder**, BEFORE `specify`/`implement`. Question: **is the task READY**
> ([`../methodology.md`](../methodology.md))? Read-only. **STOP on ambiguity = no-go** — you do not guess,
> a gap = a question.

## Verdict

**go (READY) / no-go** — one sentence. no-go = ladder halted until the questions are resolved.

## Discrepancies / gaps / ambiguities

> Taxonomy: **gap** (no coverage) · **contradiction** (sources conflict) · **ambiguity**
> (≥2 interpretations) · **mockup ≠ docs**.

| source (ticket / repo / mockup) | discrepancy / gap / ambiguity | severity (blocker/major/minor) | question / suggestion |
| ------------------------------- | ----------------------------- | ------------------------------ | --------------------- |
| [?]                             | [?]                           | [?]                            | [?]                   |

## Traceability matrix

> A row with no coverage in any column = gap = question.

| requirement | AC  | element (mockup) | role (admin/user/guest) |
| ----------- | --- | ---------------- | ----------------------- |
| [?]         | [?] | [?]              | [?]                     |

## Interactive elements (enumeration → targets for e2e / runtime)

> Every element the user clicks/fills: button · link · input · textarea · select/dropdown ·
> filter · checkbox · radio · stepper.

| element | type | `data-testid` | expected behavior | role with access | hidden/disabled for |
| ------- | ---- | ------------- | ----------------- | ---------------- | ------------------- |
| [?]     | [?]  | [?]           | [?]               | [?]              | [?]                 |

## Open questions

[?] List to resolve BEFORE the spec (or "none — READY"). Final verdict → orchestrator (Opus).
