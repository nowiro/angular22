---
type: plan
id: 'plan.{{verb}}.{{slug}}'
status: draft
date: '{{date}}'
title: '{{verb}} — {{slug}}'
agents: []
---

# Plan: {{verb}} — {{slug}}

> Lokalny artefakt SDD (`docs/plans/` jest gitignored). „Tasks" są **folded** w tabelę
> poniżej (bez osobnego `tasks.md`). Traceability: `id: plan.<verb>.<slug>` musi mieć
> `docs/specs/<slug>/spec.md` (`sdd:check`).

## Zadania

> Kolumna `model` = tier wykonawcy (orchestracja/weryfikacja → Claude Opus 4.8 · wołanie MCP →
> GPT-5 mini · kod/test/e2e/review → Gemini 3.5 Flash); ma się zgadzać z `model:` w `*.agent.md`.
> Nagłówek `id | title | agent | done_when` jest egzekwowany przez `sdd:check`.
>
> **Trójka testowa jest OBOWIĄZKOWA w każdym planie zmian:** scenariusze testowe (z AC) +
> testy jednostkowe (Vitest) + testy e2e (Playwright / serwer MCP `playwright`).
> Komponenty TYLKO przez generator (`pnpm nx g @nx/angular:component`).

| id   | title                       | agent            | done_when                           | model        | blocked_by |
| ---- | --------------------------- | ---------------- | ----------------------------------- | ------------ | ---------- |
| T001 | Spec — outcome+AC           | orchestrator     | spec.md istnieje, brak `[?]`        | Opus 4.8     | —          |
| T002 | Implement                   | angular-engineer | kod przechodzi lint z miejsca       | Gemini Flash | T001       |
| T003 | Scenariusze testowe (z AC)  | vitest           | happy + edge per każde AC, spisane  | Gemini Flash | T001       |
| T004 | Testy jednostkowe (Vitest)  | vitest           | coverage dotkniętych libów, zielone | Gemini Flash | T002, T003 |
| T005 | Testy e2e (Playwright)      | playwright       | happy-path na żywej apce zielony    | Gemini Flash | T002, T003 |
| T006 | Audyt UX (uruchomiona apka) | ux-verifier      | go (overflow/RWD/kontrast)          | Gemini Flash | T002       |
| T007 | Analyze + verify            | orchestrator     | `/analyze` go + `pnpm verify`       | Opus 4.8     | T004–T006  |

## Notatki

[?] Decyzje projektowe, ryzyka, ADR-y (jeśli nieodwracalne).
