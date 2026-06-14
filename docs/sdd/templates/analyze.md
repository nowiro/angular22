---
type: template
for: orchestrator
description: Kształt raportu /analyze — spójność spec↔plan↔kod (read-only, go/no-go PRZED kodem)
---

# Szablon: analyze (spójność spec ↔ plan ↔ kod)

> Kanon kształtu kroku **analyze** ([`/analyze`](../../../.github/prompts/analyze.prompt.md),
> [`../methodology.md`](../methodology.md)). Read-only raport go/no-go **przed** `implement`.
> Warstwa strukturalna = `pnpm sdd:check`; warstwa semantyczna (pokrycie AC, sprzeczności, drift) = tutaj.

## Bramka strukturalna

- **`pnpm sdd:check`:** [?] wynik (spec↔plan traceability, nagłówek tabeli, brak `[?]` poza draft).

## Pokrycie AC przez plan

> **AC bez zadania** = niedopokrycie (no-go). **Zadanie bez AC** = scope creep (usuń lub dopisz AC).

| AC  | zadanie w planie (Txxx) | pokryte? | luka / sprzeczność / drift |
| --- | ----------------------- | -------- | -------------------------- |
| AC1 | [?]                     | [?]      | [?]                        |

## Spójność i drift

- **Sprzeczności spec ↔ plan:** [?] (lub „brak").
- **Drift kodu:** [?] istniejący kod sprzeczny ze specem / nieaktualne założenia (lub „brak").
- **Trójka testowa:** [?] scenariusze + Vitest + e2e obecne w planie (brak = no-go).

## Werdykt

**go / no-go** + jedno zdanie. no-go → zawróć do `specify`/`clarify`/`plan`. Werdykt: orchestrator (Opus).
