---
type: template
for: reviewer
description: Shape of the reviewer / code-review skill response — diff findings + severity + go/no-go
---

# Template: code review (assessing a diff before merge)

> Canonical response shape for [`reviewer`](../../../.github/agents/reviewer.agent.md); playbook (rubric,
> auto-blockers, layers) → skill [`code-review`](../../../.github/skills/code-review/SKILL.md).
> Read-only (`git diff`/`git show`, **not** patch).

## Deterministic gate (FIRST)

> A red gate = `no-go` immediately, with no semantic analysis.

- **`pnpm verify` / `pnpm lint` + `read/problems`:** [?] result. Green → move on to findings.

## Findings

> Layers: spec/AC · correctness · module boundaries · conventions · tests. Auto-blockers (Material outside
> `libs/ui/material`, `FormGroup` instead of Signal Forms, missing test triple, `.skip`/`.only`, text
> without `a22T`, hand-written component instead of generator, theming outside `--mat-sys-*`) = **always a blocker**.

| file:line | finding | severity (blocker/major/minor) | suggestion |
| --------- | ------- | ------------------------------ | ---------- |
| [?]       | [?]     | [?]                            | [?]        |

## Verdict

**go / no-go** + one sentence. One blocker = `no-go`. Final verdict (merge decision) → orchestrator (Opus).
