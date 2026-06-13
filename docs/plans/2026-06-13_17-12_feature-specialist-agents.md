---
type: plan
id: 'plan.feature.specialist-agents'
status: clarified
date: '2026-06-13'
title: 'feature — specialist-agents'
agents: [orchestrator, angular-cli, angular, typescript, styles, html, seo-routing]
---

# Plan: feature — specialist-agents

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.feature.specialist-agents` → `docs/specs/specialist-agents/spec.md` (`sdd:check`).

## Zadania

> Zmiana **tooling AI** (`.github/**` + `docs/**`) — markdown/config, bez kodu runtime.
> „Trójka testowa": rolę kontraktu pełnią bramki **`ai:validate`** (1 widoczny, frontmattery,
> tiery modeli) + **`sdd:check`** + **`prettier`**; klasyczne Vitest/Playwright/UX = **n/d**.

| id   | title                                                                                                      | agent               | done_when                                          | model        | blocked_by |
| ---- | ---------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------- | ------------ | ---------- |
| T001 | Spec + AC (ławka + reguła MCP)                                                                             | orchestrator        | spec.md bez `[?]`                                  | Opus 4.8     | —          |
| T002 | Draft + land 6 agentów (`angular-cli` MCP + `angular`/`typescript`/`styles`/`html`/`seo-routing`)          | workflow (6 subag.) | 6 plików `.agent.md`, grounded                     | Opus 4.8     | T001       |
| T003 | Reguła MCP: `angular-engineer` + `material-wrapper` delegują (nie wołają MCP)                              | orchestrator        | brak bezpośrednich wywołań doc-MCP poza 3 agentami | Opus 4.8     | T001       |
| T004 | Wire: orchestrator (agents+routing), `AGENTS.md` (tabela+tiery+workspace), copilot-instructions, mcp-usage | orchestrator        | spójne linki/tiery; reguła MCP udokumentowana      | Opus 4.8     | T002, T003 |
| T005 | Bramki: `ai:validate` (1 widoczny, 17 agentów) + `sdd:check` + `prettier`                                  | reviewer            | wszystkie green                                    | Gemini Flash | T004       |
| T006 | Verify (final) + run-log + telemetria                                                                      | orchestrator        | go + commit                                        | Opus 4.8     | T005       |

## Notatki

- **Modele (token economy):** doc-MCP (`context7`/`nx`/`angular-cli`) → **GPT-5 mini**; reszta
  specjalistów (kod/fix/review) → **Gemini 3.5 Flash**; `orchestrator` → **Opus**. Guard
  `ai:validate` pilnuje `model:` + dokładnie 1 widocznego.
- **Reguła MCP:** doc-MCP wołają **tylko** 3 dedykowani agenci; reszta **deleguje**.
  Browser-MCP (`playwright`) zostaje przy `playwright`/`ux-verifier` (runtime, nie doc-lookup) — wyjątek.
- **Bez duplikatów:** `lint(eslint,sonar)` = `eslint`; `security` już istnieje.
- **Granice nowych agentów:** `angular` (framework, nie scaffolding — to `angular-engineer`) ·
  `styles` (SCSS komponentów; tokeny/wrappery → `material-wrapper`) · `html` (szablony/a11y;
  reguły → `eslint`) · `typescript` (typy; reguły type-aware → `eslint`) · `seo-routing` (SPA,
  brak SSR — uczciwie zaznaczone).
- Proponowani dodatkowi agenci (accessibility / performance / i18n / deps) — osobna decyzja.
