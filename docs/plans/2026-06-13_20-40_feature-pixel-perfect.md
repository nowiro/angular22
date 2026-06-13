---
type: plan
id: 'plan.feature.pixel-perfect'
status: clarified
date: '2026-06-13'
title: 'feature — pixel-perfect'
agents: [orchestrator, pixel-perfect]
---

# Plan: feature — pixel-perfect

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.feature.pixel-perfect` → `docs/specs/pixel-perfect/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI + docs**. „Trójka testowa": kontrakt = bramki **`ai:validate`** (1 widoczny,
> 30 agentów) + **`sdd:check`** + **`prettier`**; klasyczne Vitest/Playwright/UX = **n/d**.

| id   | title                                                                                                     | agent               | done_when                                          | status | model        | blocked_by |
| ---- | --------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------- | ------ | ------------ | ---------- |
| T000 | doc-review (bramka wejścia)                                                                               | doc-reviewer        | **n/d** — zmiana tooling AI, brak ticketu/mockupów | done   | Gemini Flash | —          |
| T001 | Spec + AC                                                                                                 | orchestrator        | spec.md bez `[?]`                                  | done   | Opus 4.8     | T000       |
| T002 | Draft + land agent `pixel-perfect`                                                                        | workflow (1 subag.) | `pixel-perfect.agent.md` grounded                  | done   | Opus 4.8     | T001       |
| T003 | Wire: orchestrator routing + `AGENTS.md` (wiersz + tier) + copilot-instructions + mcp-usage (browser-MCP) | orchestrator        | `pixel-perfect` wpięty                             | done   | Opus 4.8     | T002       |
| T004 | Bramki: `ai:validate` (30) + `sdd:check` + `prettier`                                                     | reviewer            | wszystkie green                                    | done   | Gemini Flash | T003       |
| T005 | Verify + run-log + telemetria                                                                             | orchestrator        | go + commit                                        | done   | Opus 4.8     | T004       |

## Notatki

- **`pixel-perfect`** = read-only audytor **wierności wizualnej** (runtime ↔ mockup); bez mockupów = **N/A**.
- **Browser-MCP:** dołącza do grupy `playwright` / `ux-verifier` (serwer MCP `playwright`, żywa przeglądarka).
- **doc-review (T000) = n/d:** zmiana tooling AI bez zewnętrznego ticketu/mockupów — krok oznaczony
  `done` jako dogfood reguły „krok = oznacz + commit".
