---
type: plan
id: 'plan.feature.agent-bench-extend'
status: clarified
date: '2026-06-13'
title: 'feature — agent-bench-extend'
agents:
  [
    orchestrator,
    deps,
    nx-architect,
    migration,
    web-components,
    docs,
    test-strategy,
    scm,
    meta-reviewer,
  ]
---

# Plan: feature — agent-bench-extend

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.feature.agent-bench-extend` → `docs/specs/agent-bench-extend/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI** (`.github/**` + `docs/**`). „Trójka testowa": kontrakt = bramki
> **`ai:validate`** (1 widoczny, 27 agentów, 9 skilli) + **`sdd:check`** + **`prettier`**;
> klasyczne Vitest/Playwright/UX = **n/d**.

| id   | title                                                                                     | agent               | done_when                 | model        | blocked_by |
| ---- | ----------------------------------------------------------------------------------------- | ------------------- | ------------------------- | ------------ | ---------- |
| T001 | Spec + AC                                                                                 | orchestrator        | spec.md bez `[?]`         | Opus 4.8     | —          |
| T002 | Draft + land 8 agentów + skill `ai-config-quality`                                        | workflow (9 subag.) | 9 plików, grounded        | Opus 4.8     | T001       |
| T003 | Wire: orchestrator routing + `AGENTS.md` (tabela+tier) + copilot-instructions + mcp-usage | orchestrator        | nowi wpięci, linki spójne | Opus 4.8     | T002       |
| T004 | Bramki: `ai:validate` (27 / 9) + `sdd:check` + `prettier`                                 | reviewer            | wszystkie green           | Gemini Flash | T003       |
| T005 | Verify (final) + run-log + telemetria                                                     | orchestrator        | go + commit               | Opus 4.8     | T004       |

## Notatki

- **Wszyscy nowi = Gemini Flash, nie-MCP** (delegują do doc-MCP). **Read-only:** `test-strategy`,
  `meta-reviewer`. **Edit-capable:** `deps`, `nx-architect`, `migration`, `web-components`, `docs`, `scm`.
- **`meta-reviewer` + `ai-config-quality`** = wzorzec actor + rubryka (jak `security` +
  `security-guidance`) — audyt JAKOŚCI configu AI **ponad** strukturalny `ai:validate`.
- **`smc` → `scm`** (source-control management).
- **Ryzyko:** rozmycie routingu przy 27 agentach — mitygacja sekcjami „Granica" + `meta-reviewer`.
