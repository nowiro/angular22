---
type: plan
id: 'plan.chore.agent-roster'
status: clarified
date: '2026-06-13'
title: 'chore — agent-roster'
agents: [orchestrator, accessibility, performance, i18n]
---

# Plan: chore — agent-roster

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.chore.agent-roster` → `docs/specs/agent-roster/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI** (`.github/**` + `docs/**`) — markdown/config. „Trójka testowa":
> kontrakt = bramki **`ai:validate`** (1 widoczny, 19 agentów, frontmattery) + **`sdd:check`**
>
> - **`prettier`**; klasyczne Vitest/Playwright/UX = **n/d**.

| id   | title                                                                                                                              | agent               | done_when                                                   | model        | blocked_by |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------- | ------------ | ---------- |
| T001 | Spec + AC (konsolidacja + nowi)                                                                                                    | orchestrator        | spec.md bez `[?]`                                           | Opus 4.8     | —          |
| T002 | Merge: `angular` → `angular-engineer` (scaffolding + framework); usuń `angular.agent.md`                                           | orchestrator        | brak `angular.agent.md`; angular-engineer pokrywa framework | Opus 4.8     | T001       |
| T003 | Draft + land 3 agentów: `accessibility` (read-only), `performance`, `i18n`                                                         | workflow (3 subag.) | 3 pliki `.agent.md`, grounded                               | Opus 4.8     | T001       |
| T004 | Rewire: orchestrator (agents+routing), `AGENTS.md` (tabela+tiery), copilot-instructions, mcp-usage; `angular` → `angular-engineer` | orchestrator        | grep agenta `angular` poza eng/cli = 0; nowi wpięci         | Opus 4.8     | T002, T003 |
| T005 | Bramki: `ai:validate` (1 widoczny, 19) + `sdd:check` + `prettier`                                                                  | reviewer            | wszystkie green                                             | Gemini Flash | T004       |
| T006 | Verify (final) + run-log + telemetria                                                                                              | orchestrator        | go + commit                                                 | Opus 4.8     | T005       |

## Notatki

- **Kierunek merge:** `angular` → `angular-engineer` (zachowuje ustaloną nazwę referowaną w
  wielu miejscach; odwrotny rename byłby kosztowny).
- **`angular-cli` zostaje** osobno (GPT-5 mini doc-MCP — reguła MCP nie pozwala scalić z edit-agentem).
- **Wzorce nowych agentów:** `accessibility` = read-only audytor (jak `security`/`ux-verifier`),
  WCAG 2.1 AA na poziomie kodu; runtime a11y → `ux-verifier`. `performance` / `i18n` =
  edit-capable specjaliści (Gemini Flash).
- Kolejni **proponowani** (deps / pr / docs) — osobna decyzja.
