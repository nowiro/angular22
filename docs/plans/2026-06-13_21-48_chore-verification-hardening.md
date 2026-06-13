---
type: plan
id: 'plan.chore.verification-hardening'
status: clarified
date: '2026-06-13'
title: 'chore — verification-hardening'
agents: [orchestrator, doc-reviewer, test-strategy, ux-verifier, playwright, reviewer]
---

# Plan: chore — verification-hardening

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.chore.verification-hardening` → `docs/specs/verification-hardening/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI + docs** (zero kodu apki). „Trójka testowa": kontrakt = bramki
> **`ai:validate`** (1 widoczny, 30 agentów) + **`sdd:check`** + **`prettier`**; klasyczne
> Vitest/Playwright/UX = **n/d** (dotyczą feature `keycloak-rbac`). Krok = oznacz `done` + commit.

| id   | title                                                                          | agent        | done_when                                             | status | model        | blocked_by |
| ---- | ------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------- | ------ | ------------ | ---------- |
| T001 | Spec + AC                                                                      | orchestrator | spec.md bez `[?]`                                     | done   | Opus 4.8     | —          |
| T002 | Redesign `doc-reviewer` (Definition of Ready, traceability, elementy+uprawn.)  | orchestrator | nowe standardy + STOP                                 | done   | Opus 4.8     | T001       |
| T003 | Redesign `test-strategy` (RBAC matrix, boundary/decision/state, neg. authz)    | orchestrator | scenariusze per rola + element-availability           | done   | Opus 4.8     | T001       |
| T004 | Re-weryfikacja w `orchestrator` + sweep elementów w `ux-verifier`/`playwright` | orchestrator | DoD+AC+e2e+integr.(gdy API)+klik wszystkich elementów | done   | Opus 4.8     | T001       |
| T005 | `run.md` + `methodology`: raport błędów + telemetria (model/tokeny/kredyty)    | orchestrator | sekcja raportu błędów + telemetria spójne             | done   | Opus 4.8     | T001       |
| T006 | Bramki: `ai:validate` (30) + `sdd:check` + `prettier`                          | reviewer     | wszystkie green                                       | todo   | Gemini Flash | T002–T005  |
| T007 | Verify + run-log + telemetria                                                  | orchestrator | go + commit                                           | todo   | Opus 4.8     | T006       |

## Notatki

- **Trzy bramki elementów interaktywnych:** `doc-review` (enumeracja oczekiwanych elementów +
  uprawnień z docs/mockupów) → `playwright` (e2e wykonuje klik/fill per rola) → `ux-verifier`
  (runtime potwierdza widoczność/aktywność/zabroniony per rola). Orchestrator domyka.
- **Re-weryfikacja** = drugi przebieg Opusa **po** testach: DoD + każde AC + e2e + integracja
  (gdy API) + sweep elementów. Rozjazd → zawróć do specjalisty.
- **Raport błędów** w run-logu jest **obowiązkowy** (obok telemetrii) — pełny ślad napotkanych
  problemów i ich naprawy.
