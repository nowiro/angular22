---
type: template
for: test-strategy
description: Kształt odpowiedzi agenta test-strategy — scenariusze z AC + macierz RBAC + luki pokrycia
---

# Szablon: scenariusze testowe (z Acceptance criteria)

> Kanon kształtu odpowiedzi [`test-strategy`](../../../.github/agents/test-strategy.agent.md).
> Wejście: sekcja `## Acceptance criteria` specu (`docs/specs/<slug>/spec.md`). Wyjście: **trójka
> testowa** ([`../methodology.md`](../methodology.md) §Trójka testowa) jako wejście do planu.
> Read-only — wykonanie: `vitest` (unit) / `playwright` (e2e).

## Scenariusze (technika per AC)

> Techniki: happy-path · equivalence partitioning + boundary value analysis · decision table ·
> state transition · error/negatywne. Każde AC ma ≥1 happy + edge.

| AC  | scenariusz | technika | typ (unit/e2e) | rola | element / `data-testid` | oczekiwanie |
| --- | ---------- | -------- | -------------- | ---- | ----------------------- | ----------- |
| AC1 | [?]        | [?]      | [?]            | [?]  | [?]                     | [?]         |

## Macierz RBAC (gdy zadanie dotyka uprawnień)

> Dla **każdej** roli: pozytywny (z uprawnieniem) **i** negatywny authz (bez — ukryty/disabled +
> deep-link/wywołanie odrzucone, nie tylko ukrycie w UI).

| rola  | element / akcja | widoczny | aktywny | ukryty | disabled | zabroniony (guard/deep-link) |
| ----- | --------------- | -------- | ------- | ------ | -------- | ---------------------------- |
| admin | [?]             | [?]      | [?]     | [?]    | [?]      | [?]                          |
| user  | [?]             | [?]      | [?]     | [?]    | [?]      | [?]                          |
| guest | [?]             | [?]      | [?]     | [?]    | [?]      | [?]                          |

## Podział unit ↔ e2e

- **unit (Vitest):** [?] logika domenowa / pure functions / store / guard / `hasRole`.
- **e2e (Playwright):** [?] przepływ przez komponenty / stepper / widoczność per rola / deep-link authz.

## Luki pokrycia

> **AC bez scenariusza** = niedopokrycie (blocker planu). **scenariusz bez AC** = scope creep.
> Element interaktywny bez `data-testid` = luka (sygnalizuj).

- [?] luka / brak `data-testid` / AC niepokryte — lub „brak".

## Werdykt

**go / no-go** (trójka kompletna?) + jedno zdanie. Werdykt końcowy → orchestrator (Opus).
