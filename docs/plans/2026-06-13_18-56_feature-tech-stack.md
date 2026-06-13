---
type: plan
id: 'plan.feature.tech-stack'
status: clarified
date: '2026-06-13'
title: 'feature — tech-stack'
agents: [orchestrator, stack-guardian, docs]
---

# Plan: feature — tech-stack

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.feature.tech-stack` → `docs/specs/tech-stack/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI + docs** (markdown). „Trójka testowa": kontrakt = bramki **`ai:validate`**
> (1 widoczny, 28 agentów) + **`sdd:check`** + **`prettier`** + **zgodność wersji kanon ↔
> `package.json`**; klasyczne Vitest/Playwright/UX = **n/d**.

| id   | title                                                               | agent               | done_when                                  | model        | blocked_by |
| ---- | ------------------------------------------------------------------- | ------------------- | ------------------------------------------ | ------------ | ---------- |
| T001 | Spec + AC                                                           | orchestrator        | spec.md bez `[?]`                          | Opus 4.8     | —          |
| T002 | Draft + land: `docs/tech-stack.md` (kanon) + agent `stack-guardian` | workflow (2 subag.) | 2 pliki; wersje w kanonie = `package.json` | Opus 4.8     | T001       |
| T003 | DRY: `copilot-instructions` + `README` §Stack → pointer do kanonu   | orchestrator        | brak duplikatu pełnej listy wersji         | Opus 4.8     | T002       |
| T004 | Wire: orchestrator routing + `AGENTS.md` (wiersz + tier)            | orchestrator        | `stack-guardian` wpięty                    | Opus 4.8     | T002       |
| T005 | Bramki: `ai:validate` (28) + `sdd:check` + `prettier`               | reviewer            | wszystkie green                            | Gemini Flash | T003, T004 |
| T006 | Verify (final) + run-log + telemetria                               | orchestrator        | go + commit                                | Opus 4.8     | T005       |

## Notatki

- **`stack-guardian`** = read-only audytor (jak `security`/`reviewer`); egzekwuje
  `docs/tech-stack.md` wobec `package.json`.
- **Granica:** `deps` = świeżość/CVE; `migration` = przeskoki wersji; `stack-guardian` =
  **ZGODNOŚĆ ze stackiem** (zakazy / spójność / drift kanonu).
- **Rekomendacja:** deterministyczny `pnpm stack:check` w `pnpm verify` — osobna decyzja
  (mocniejsze „pilnowanie" niż agent on-demand).
