---
type: plan
id: 'plan.feature.copilot-ai-tooling'
status: clarified
date: '2026-06-13'
title: 'feature — copilot-ai-tooling'
agents: [orchestrator, security, reviewer]
---

# Plan: feature — copilot-ai-tooling

> Artefakt SDD **wersjonowany** w `docs/plans/`. „Tasks" folded w tabelę. Traceability:
> `plan.feature.copilot-ai-tooling` → `docs/specs/copilot-ai-tooling/spec.md` (`sdd:check`).

## Zadania

> To zmiana **tooling AI + docs** (markdown / config), **bez kodu runtime** — patrz Notatki nt.
> adaptacji „trójki testowej": jej rolę kontraktową pełnią **deterministyczne bramki
> konfiguracji** (`pnpm ai:validate` + `pnpm sdd:check` + `prettier --check`), nie Vitest/Playwright.

| id   | title                                                                                                                                     | agent               | done_when                                                     | model        | blocked_by |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------- | ------------ | ---------- |
| T001 | Spec + plan (outcome+AC); reconcile nieaktualnego planu do stanu repo                                                                     | orchestrator        | spec.md bez `[?]`; forki rozstrzygnięte (AskUserQuestion)     | Opus 4.8     | —          |
| T002 | Draft + land: agent `security` + skille frontend-design/code-review/security-guidance + prompty brainstorming/feature-dev                 | workflow (6 subag.) | 6 plików na dysku, grounded w realnym repo                    | Opus 4.8     | T001       |
| T003 | Draft + land skille `angular-developer`, `angular-new-app` (Angular 22 + Nx; odwzorowanie angular.dev)                                    | workflow (2 subag.) | 2 `SKILL.md` na dysku, grounded                               | Opus 4.8     | T001       |
| T004 | Wire shared docs: orchestrator (agents+routing+telemetria), reviewer→`code-review`, angular.instructions, AGENTS.md, copilot-instructions | orchestrator        | linki spójne, frontmatter OK                                  | Opus 4.8     | T002, T003 |
| T005 | Polityka SDD: track `docs/specs\|plans\|runs` + sekcja Telemetria (templates, methodology, `.gitignore`)                                  | orchestrator        | `.gitignore` bez ignore; templates/methodology zaktualizowane | Opus 4.8     | T001       |
| T006 | Bramki konfiguracji (analog trójki): `ai:validate` + `sdd:check` + `prettier --check` zielone                                             | reviewer            | wszystkie 3 bramki green                                      | Gemini Flash | T004, T005 |
| T007 | Audyt web-security dotkniętej powierzchni                                                                                                 | security            | go — brak nowych sinków (zmiana docs/config)                  | Gemini Flash | T004       |
| T008 | Verify (final) + run-log + telemetria                                                                                                     | orchestrator        | `/analyze` go + bramki green + telemetria spisana             | Opus 4.8     | T006, T007 |

## Notatki

- **„Trójka testowa" — adaptacja:** zmiana dotyczy wyłącznie `.github/**` + `docs/**`
  (markdown / config), bez behaviour runtime. Klasyczna trójka (scenariusze + Vitest +
  Playwright) nie ma przedmiotu; jej rolę kontraktową pełnią bramki **`pnpm ai:validate`**
  (kontrakt konfiguracji Copilota: 1 widoczny agent, frontmattery, `mcp.json`) +
  **`pnpm sdd:check`** (kontrakt SDD: spec↔plan, traceability) + **`prettier --check`**.
- **Ryzyko:** złamanie guarda „1 widoczny agent" przez nowego agenta `security` — zmitygowane:
  `security` ma `user-invocable: false`.
- **Decyzja:** bez serwerów MCP z kluczem / `inputs` (filozofia keyless repo); `.agent.md`/
  `SKILL.md`/`.prompt.md` zamiast `.github/chatmodes/`.
