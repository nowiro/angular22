---
type: template
for: security, accessibility, ux-verifier, stack-guardian, performance, meta-reviewer
description: Wspólny kształt audytu read-only — zakres + findingi per wymiar + severity + go/no-go
---

# Szablon: audyt read-only (per wymiar)

> Wspólny kanon kształtu dla audytorów **read-only**. Wymiar zależy od producenta:
>
> - [`security`](../../../.github/agents/security.agent.md) — web-security (XSS/sinki/CSP/sekrety), rubryka [`security-guidance`](../../../.github/skills/security-guidance/SKILL.md)
> - [`accessibility`](../../../.github/agents/accessibility.agent.md) — WCAG 2.1 AA na poziomie kodu (runtime a11y → `ux-verifier`)
> - [`ux-verifier`](../../../.github/agents/ux-verifier.agent.md) — runtime: overflow / RWD / kontrast / focus na **uruchomionej** apce
> - [`stack-guardian`](../../../.github/agents/stack-guardian.agent.md) — zgodność z [`../../tech-stack.md`](../../tech-stack.md) (off-stack / pinning / drift)
> - [`performance`](../../../.github/agents/performance.agent.md) — bundle budget / change detection / zbędne re-renders
> - [`meta-reviewer`](../../../.github/agents/meta-reviewer.agent.md) — jakość configu AI (DRY/SRP agentów/skilli), rubryka [`ai-config-quality`](../../../.github/skills/ai-config-quality/SKILL.md)

## Zakres

[?] Co audytowano (powierzchnia diffu / pliki / trasy / runtime) i wg jakiego wymiaru/rubryki.

## Findingi

| obszar / ścieżka:linia | finding | severity (blocker/major/minor) | rekomendacja |
| ---------------------- | ------- | ------------------------------ | ------------ |
| [?]                    | [?]     | [?]                            | [?]          |

## Werdykt

**go / no-go** + jedno zdanie. Werdykt końcowy → orchestrator (Opus). Read-only — naprawę wykonuje
właściwy specjalista edycyjny, nie audytor.
