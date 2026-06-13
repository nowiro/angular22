---
type: plan
id: 'plan.chore.sdd-workflow-gates'
status: clarified
date: '2026-06-13'
title: 'chore — sdd-workflow-gates'
agents: [orchestrator, doc-reviewer, scm]
---

# Plan: chore — sdd-workflow-gates

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.chore.sdd-workflow-gates` → `docs/specs/sdd-workflow-gates/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI + docs**. „Trójka testowa": kontrakt = bramki **`ai:validate`** (1 widoczny,
> 29 agentów) + **`sdd:check`** + **`prettier`**; klasyczne Vitest/Playwright/UX = **n/d**.
> Kolumna `status` = **dogfood** nowej reguły (krok = oznacz + commit).

| id   | title                                                                      | agent               | done_when                        | status | model        | blocked_by |
| ---- | -------------------------------------------------------------------------- | ------------------- | -------------------------------- | ------ | ------------ | ---------- |
| T001 | Spec + AC                                                                  | orchestrator        | spec.md bez `[?]`                | done   | Opus 4.8     | —          |
| T002 | Draft + land agent `doc-reviewer`                                          | workflow (1 subag.) | `doc-reviewer.agent.md` grounded | done   | Opus 4.8     | T001       |
| T003 | Sformalizuj workflow orchestratora (0. doc-review, STOP, commit per krok)  | orchestrator        | jawna drabina + bramki           | done   | Opus 4.8     | T001       |
| T004 | Kanon + szablony: methodology + `plan.md` (status) + `run.md` (doc-review) | orchestrator        | spójne                           | done   | Opus 4.8     | T003       |
| T005 | Twarde reguły `copilot-instructions`; wire `AGENTS.md` (wiersz + tier)     | orchestrator        | `doc-reviewer` wpięty            | todo   | Opus 4.8     | T002, T003 |
| T006 | Bramki: `ai:validate` (29) + `sdd:check` + `prettier`                      | reviewer            | wszystkie green                  | todo   | Gemini Flash | T004, T005 |
| T007 | Verify + run-log + telemetria                                              | orchestrator        | go + commit                      | todo   | Opus 4.8     | T006       |

## Notatki

- **`doc-reviewer`** = read-only bramka wejścia; STOP na niejasności; Jira/Confluence przez
  **dostarczone** treści (brak dedykowanego MCP).
- **Kolumna `status`** dodana do `plan.md` (nowe plany); istniejące grandfathered; `validate-sdd`
  jej nie wymusza (header `id | title | agent | done_when` zachowany).
- **Commit per krok** = dogfood: ten plan ma kolumnę `status`, ale meta-zmiana (która sama dodaje
  regułę) idzie w 1–2 commitach.
