---
type: template
for: doc-reviewer
description: Kształt odpowiedzi doc-reviewer — Definition of Ready (bramka PRZED wytwarzaniem)
---

# Szablon: doc-review (Definition of Ready)

> Kanon kształtu odpowiedzi [`doc-reviewer`](../../../.github/agents/doc-reviewer.agent.md) —
> **PIERWSZA bramka drabiny SDD**, PRZED `specify`/`implement`. Pytanie: **czy zadanie jest READY**
> ([`../methodology.md`](../methodology.md))? Read-only. **STOP na niejasności = no-go** — nie zgadujesz,
> luka = pytanie.

## Werdykt

**go (READY) / no-go** — jedno zdanie. no-go = drabina zatrzymana do rozstrzygnięcia pytań.

## Rozbieżności / luki / niejasności

> Taksonomia: **luka** (brak pokrycia) · **sprzeczność** (źródła się wykluczają) · **dwuznaczność**
> (≥2 interpretacje) · **mockup ≠ docs**.

| źródło (ticket / repo / mockup) | rozbieżność / luka / niejasność | severity (blocker/major/minor) | pytanie / sugestia |
| ------------------------------- | ------------------------------- | ------------------------------ | ------------------ |
| [?]                             | [?]                             | [?]                            | [?]                |

## Macierz traceability

> Wiersz bez pokrycia w którejkolwiek kolumnie = luka = pytanie.

| wymaganie | AC  | element (mockup) | rola (admin/user/guest) |
| --------- | --- | ---------------- | ----------------------- |
| [?]       | [?] | [?]              | [?]                     |

## Elementy interaktywne (enumeracja → cele dla e2e / runtime)

> Każdy element, który user kliknie/wypełni: button · link · input · textarea · select/dropdown ·
> filtr · checkbox · radio · stepper.

| element | typ | `data-testid` | oczekiwane zachowanie | rola z dostępem | ukryty/disabled dla |
| ------- | --- | ------------- | --------------------- | --------------- | ------------------- |
| [?]     | [?] | [?]           | [?]                   | [?]             | [?]                 |

## Pytania otwarte

[?] Lista do rozstrzygnięcia PRZED specem (lub „brak — READY"). Werdykt końcowy → orchestrator (Opus).
