---
type: template
for: reviewer
description: Kształt odpowiedzi reviewer / skill code-review — findingi diffu + severity + go/no-go
---

# Szablon: code review (ocena diffu przed merge)

> Kanon kształtu odpowiedzi [`reviewer`](../../../.github/agents/reviewer.agent.md); playbook (rubryka,
> auto-blockery, warstwy) → skill [`code-review`](../../../.github/skills/code-review/SKILL.md).
> Read-only (`git diff`/`git show`, **nie** patch).

## Bramka deterministyczna (NAJPIERW)

> Czerwona bramka = `no-go` od razu, bez analizy semantycznej.

- **`pnpm verify` / `pnpm lint` + `read/problems`:** [?] wynik. Zielona → przechodzisz do findingów.

## Findingi

> Warstwy: spec/AC · poprawność · granice modułów · konwencje · testy. Auto-blockery (Material poza
> `libs/ui/material`, `FormGroup` zamiast Signal Forms, brak trójki testowej, `.skip`/`.only`, tekst
> bez `a22T`, komponent ręczny zamiast generatora, theming poza `--mat-sys-*`) = **zawsze blocker**.

| plik:linia | finding | severity (blocker/major/minor) | sugestia |
| ---------- | ------- | ------------------------------ | -------- |
| [?]        | [?]     | [?]                            | [?]      |

## Werdykt

**go / no-go** + jedno zdanie. Jeden blocker = `no-go`. Werdykt końcowy (decyzja merge) → orchestrator (Opus).
