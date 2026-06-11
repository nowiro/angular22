---
type: run
id: 'run.{{verb}}.{{slug}}'
status: in-progress
date: '{{date}}'
stamp: '{{stamp}}'
title: '{{verb}} — {{slug}}'
---

# Run-log: {{verb}} — {{slug}} · {{stamp}}

> Lokalny artefakt SDD (`docs/runs/` jest gitignored). Krok-po-kroku zapis **jednej
> iteracji**: kto (agent), na czym (model), z jakim wynikiem. Orchestrator (Opus) domyka
> sekcją „Weryfikacja końcowa".

Powiązane: spec `docs/specs/{{slug}}/spec.md` · plan `docs/plans/{{stamp}}_{{verb}}-{{slug}}.md`.

## Kroki

| #   | krok (SDD)                 | agent            | model        | wynik / artefakt                   | status |
| --- | -------------------------- | ---------------- | ------------ | ---------------------------------- | ------ |
| 1   | specify                    | orchestrator     | Opus 4.8     | spec.md + plan.md scaffolded       | done   |
| 2   | clarify                    | orchestrator     | Opus 4.8     | `[?]` domknięte, status: clarified | todo   |
| 3   | plan                       | orchestrator     | Opus 4.8     | tabela zadań                       | todo   |
| 4   | analyze                    | orchestrator     | Opus 4.8     | go / no-go                         | todo   |
| 5   | implement                  | angular-engineer | Gemini Flash | kod przechodzi lint z miejsca      | todo   |
| 6   | scenariusze testowe (z AC) | vitest           | Gemini Flash | happy + edge per AC                | todo   |
| 7   | testy jednostkowe          | vitest           | Gemini Flash | dotknięte liby zielone             | todo   |
| 8   | testy e2e                  | playwright       | Gemini Flash | happy-path na żywej apce zielony   | todo   |
| 9   | audyt UX (uruchomienie)    | ux-verifier      | Gemini Flash | go (overflow/RWD/kontrast)         | todo   |
| 10  | verify (DoD)               | orchestrator     | Opus 4.8     | `pnpm verify` zielone              | todo   |

## Weryfikacja końcowa (orchestrator / Opus)

> Wypełnij **na samym końcu**, na Opusie — ostatnia bramka jakości nad pracą tańszych modeli.

- **Diff vs spec/AC:** [?] czy zmiana realizuje Acceptance criteria, bez regresji i scope-creep
- **`pnpm verify`:** [?] wynik (format:check + lint + typecheck + test + build + ai:validate + sdd:check)
- **Pokrycie spec ↔ kod:** [?] każde AC ma odzwierciedlenie w kodzie/testach
- **Testy:** [?] scenariusze pokrywają każde AC · Vitest + e2e zielone · brak `.skip`/`.only`
- **UX z uruchomienia:** [?] werdykt ux-verifier (nie z czytania kodu)
- **Rozjazdy / zawrócone do specjalisty:** [?]
- **Werdykt:** [?] go / no-go + jedno zdanie uzasadnienia
