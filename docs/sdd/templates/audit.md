---
type: template
for: security, accessibility, ux-verifier, stack-guardian, performance, meta-reviewer
description: Shared read-only audit shape — scope + findings per dimension + severity + go/no-go
---

# Template: read-only audit (per dimension)

> Shared shape canon for **read-only** auditors. The dimension depends on the producer:
>
> - [`security`](../../../.github/agents/security.agent.md) — web-security (XSS/sinks/CSP/secrets), rubric [`security-guidance`](../../../.github/skills/security-guidance/SKILL.md)
> - [`accessibility`](../../../.github/agents/accessibility.agent.md) — WCAG 2.1 AA at the code level (runtime a11y → `ux-verifier`)
> - [`ux-verifier`](../../../.github/agents/ux-verifier.agent.md) — runtime: overflow / RWD / contrast / focus on the **running** app
> - [`stack-guardian`](../../../.github/agents/stack-guardian.agent.md) — compliance with [`../../tech-stack.md`](../../tech-stack.md) (off-stack / pinning / drift)
> - [`performance`](../../../.github/agents/performance.agent.md) — bundle budget / change detection / unnecessary re-renders
> - [`meta-reviewer`](../../../.github/agents/meta-reviewer.agent.md) — AI config quality (DRY/SRP of agents/skills), rubric [`ai-config-quality`](../../../.github/skills/ai-config-quality/SKILL.md)

## Scope

[?] What was audited (diff surface / files / routes / runtime) and against which dimension/rubric.

## Findings

| area / path:line | finding | severity (blocker/major/minor) | recommendation |
| ---------------- | ------- | ------------------------------ | -------------- |
| [?]              | [?]     | [?]                            | [?]            |

## Verdict

**go / no-go** + one sentence. Final verdict → orchestrator (Opus). Read-only — the fix is done by the
appropriate editing specialist, not the auditor.
