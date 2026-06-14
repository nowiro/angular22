---
type: plan
id: 'plan.feature.galileo-observability'
status: draft
date: '2026-06-13'
title: 'feature — galileo-observability'
agents: [orchestrator, doc-reviewer, docs, stack-guardian, security, reviewer]
---

# Plan: feature — galileo-observability

> Artefakt SDD **wersjonowany** w `docs/plans/`. „Tasks" są **folded** w tabelę
> poniżej (bez osobnego `tasks.md`). Traceability: `id: plan.<verb>.<slug>` musi mieć
> `docs/specs/<slug>/spec.md` (`sdd:check`).

## Zadania

> Kolumna `model` = tier wykonawcy (orchestracja/weryfikacja → Claude Opus 4.8 · wołanie MCP →
> GPT-5 mini · kod/test/e2e/review → Gemini 3.5 Flash); ma się zgadzać z `model:` w `*.agent.md`.
> Nagłówek `id | title | agent | done_when` jest egzekwowany przez `sdd:check`.
> Kolumna `status` (`todo`/`done`): **każdy ukończony krok oznacz `done` i commituj** (jeden
> krok = jeden commit, przez `scm`). **Krok `0. doc-review`** (`doc-reviewer`) — PRZED kodem.
>
> **Uwaga o trójce testowej:** to zmiana **tooling/config + docs** (zero kodu apki, zero libów/
> komponentów), więc klasyczna trójka Vitest/Playwright **nie ma przedmiotu**. Mapuje się na
> **smoke obserwowalności** (T007: end-to-end trace pojawia się w backendzie per krok SDD) +
> bramkę `pnpm verify` (T008). Decyzja świadoma, uzasadniona w „Notatki" — nie pominięcie.

| id   | title                                       | agent        | done_when                                                                                                    | status  | model        | blocked_by |
| ---- | ------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------ | ------- | ------------ | ---------- |
| T000 | doc-review (bramka wejścia)                 | doc-reviewer | spec ↔ realia repo (Copilot-only, VS Code 1.121 OTel) spójne; STOP na niejasności                            | done    | Gemini Flash | —          |
| T001 | Spec — outcome + AC                         | orchestrator | spec.md istnieje; AC1–AC6 konkretne                                                                          | done    | Opus 4.8     | T000       |
| T002 | clarify — domknij open questions (`[?]`)    | orchestrator | backend (Galileo cloud vs spike OTel), kolektor, nazwa env, zakres scoringu rozstrzygnięte                   | done    | Opus 4.8     | T001       |
| T003 | Spike: włącz `copilot.chat.otel` → kolektor | orchestrator | 1 przebieg SDD → spany `invoke_agent`/`chat`/`execute_tool` widoczne (AC1, AC2)                              | runtime | Opus 4.8     | T002       |
| T004 | Wpięcie Galileo (ingest OTel) + scoring     | orchestrator | run w Galileo pokazuje koszt/latencję + score wyboru narzędzia (AC2, AC3)                                    | runtime | Opus 4.8     | T003       |
| T005 | Kanon docs — `docs/observability.md`        | docs         | enablement (ustawienia, endpoint, klucz przez env), mapa span→krok SDD (AC4)                                 | done    | Gemini Flash | T002, T004 |
| T006 | Linki kanonu + run-log telemetria           | docs         | `AGENTS.md` + `mcp-usage` linkują kanon; szablon run-logu wskazuje źródło auto (AC5)                         | done    | Gemini Flash | T005       |
| T007 | Smoke obserwowalności (zamiast e2e)         | reviewer     | end-to-end trace per krok SDD potwierdzony w backendzie; brak luk (AC1–AC3)                                  | runtime | Gemini Flash | T004       |
| T008 | Stack + security + analyze + verify         | orchestrator | off-stack/pinning go (`stack-guardian`); 0 sekretów (`security`); `/analyze` go; `pnpm verify` zielone (AC6) | done    | Opus 4.8     | T005–T007  |

## Notatki

- **Skala zmiany:** config VS Code + 1 strona `docs/` + linki w istniejących kanonach. **Nie**
  dotyka `apps/*` / `libs/*` — stąd brak Vitest/Playwright (patrz uwaga nad tabelą). „Testem" jest
  smoke trace (T007) + `pnpm verify` (T008).
- **Inwariant repo:** Copilot-only, zero `.github/workflows/`. Galileo wpinamy przez OTel-export
  Copilota (VS Code 1.121), **nie** przez Actions ani kod apki. Klucz/endpoint **tylko env**.
- **Ryzyko / odwracalność:** wybór Galileo cloud (płatny eval) vs spike OTel-only (Langfuse/Phoenix,
  free, ten sam endpoint) — **odwracalny** dzięki standardowi OTel: backend można podmienić bez
  zmiany instrumentacji. Rekomendacja: spike OTel-only → potem decyzja o płatnej warstwie eval (T002).
- **Vendor lock-in:** instrumentacja = standardowy OTel GenAI, więc lock-in minimalny; różnicą
  Galileo jest warstwa eval (Luna-2), nie format trace.
- **Status `runtime` (T003/T004/T007):** te kroki wymagają **lokalnego runtime** — VS Code ≥ 1.121,
  uruchomiony kolektor/backend, klucz Galileo z env — i nie wykonują się w headless CI/kontenerze.
  Repo dostarcza komplet **configu + docs + wiring** (T002/T005/T006/T008); aktywacja trace'ów to
  jeden Reload Window u dewelopera wg [`docs/observability.md`](../observability.md).
