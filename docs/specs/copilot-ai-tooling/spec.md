---
type: spec
id: 'spec.copilot-ai-tooling'
status: clarified
title: 'Copilot AI tooling: agenci, skille, prompty + SDD-tracked docs i telemetria'
created: '2026-06-13'
---

# Spec: Copilot AI tooling: agenci, skille, prompty + SDD-tracked docs i telemetria

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Plan `20260613mcpcopilotintegration.md` zakładał integrację serwerów MCP + pluginów/komend
Claude Code z trzech materiałów (Peloot, Felix, „10x smarter"). Repo jest jednak **tylko dla
GitHub Copilot** i ma już dojrzały, strzeżony setup: `.vscode/mcp.json` (4 serwery **keyless,
bez `inputs`**), `.github/{agents,instructions,prompts,skills}`, guard `pnpm ai:validate`,
drabina SDD. Plan był **nieaktualny** względem tego stanu (zakładał `.github/chatmodes/`,
sekrety przez `inputs`, duplikaty `reviewer`/`ux-verifier`). Decyzja użytkownika: **dostosować
do repo** — skupić się na **agentach / skillach / instrukcjach** (bez serwerów MCP z kluczem),
odwzorować zdolności źródeł jako artefakty repo-native, a całość przeprowadzić **przez SDD z
zapisem w `docs/`** oraz **rozliczeniem (telemetrią)** na zamknięciu.

## User story

Jako deweloper repo angular22 (Copilot-only) chcę mieć zdolności z planu odwzorowane jako
natywne agenty / skille / prompty zgodne z konwencjami repo oraz politykę „każda zmiana przez
SDD, zapis w `docs/`, rozliczenie na końcu", aby tooling AI był spójny, audytowalny i
wersjonowany — bez sekretów i bez łamania bramki konfiguracji.

## Acceptance criteria

- **Given** repo Copilot-only, **when** dodaję zdolności źródeł, **then** powstają jako
  `.github/agents/*.agent.md` / `.github/skills/*/SKILL.md` / `.github/prompts/*.prompt.md`
  (NIE `.github/chatmodes/`), bez nowych serwerów MCP i bez sekretów / `inputs`.
- **Given** guard konfiguracji, **when** uruchamiam `pnpm ai:validate`, **then** jest zielone:
  dokładnie **1 widoczny agent** (orchestrator, model Opus), każdy agent ma `model:`, każdy
  prompt `agent` + `description`, każdy skill `name` + `description`.
- **Given** nowy agent `security`, **when** patrzę na orchestratora, **then** jest na liście
  `agents:` i ma trasę routingu (verb `security`); `reviewer` wskazuje skill `code-review`.
- **Given** odwzorowanie angular.dev/ai/agent-skills, **when** szukam skilli Angular, **then**
  istnieją `angular-developer` i `angular-new-app`, zgodne z Angular 22 (zoneless, signals) + Nx.
- **Given** polityka SDD, **when** robię zmianę, **then** `docs/specs|plans|runs` są
  **trackowane w gicie** (usunięte z `.gitignore`), a zapis (spec + plan + run-log) ląduje w `docs/`.
- **Given** zamknięcie zadania, **when** domykam run-log, **then** zawiera sekcję
  **Rozliczenie / Telemetria** (tokeny, kredyty, background taski, sesje); szablon `run.md`
  i `methodology.md` tę sekcję opisują.
- **Given** bramki, **when** uruchamiam `pnpm ai:validate`, `pnpm sdd:check` i `prettier`,
  **then** wszystkie zielone na dotkniętych plikach.

## Success metrics

- `pnpm ai:validate` zielone: **1** widoczny agent, **11** agentów ogółem, **4** prompty,
  **8** skilli, **3** instrukcje.
- `pnpm sdd:check` zielone: **1** spec + **1** plan (traceability `plan.feature.copilot-ai-tooling`
  → `spec.copilot-ai-tooling`).
- `prettier --check` zielone na wszystkich dotkniętych `.md`.
- **0** nowych serwerów MCP · **0** sekretów / `inputs` w repo.

## Non-goals

- Serwery MCP z kluczem (firecrawl / perplexity / glif / brave) i `inputs` z sekretami —
  świadomie pominięte (sprzeczne z filozofią keyless repo).
- `.github/chatmodes/` — przestarzała nazwa (VS Code: chat modes → custom agents `.agent.md`).
- Duplikaty istniejących zdolności (Code Review ≈ `reviewer`, Frontend Design ≈ `ux-verifier`),
  `socialcrawl` (bez znaczenia dla repo Angular), `writing-plans` / `executing-plans`
  (= istniejąca drabina SDD).
- Zmiany w kodzie aplikacji / libów — to zmiana wyłącznie tooling AI (`.github/**`) + `docs/**`.

## Open questions

Brak — domknięte decyzją użytkownika (dostosuj do repo; agenci / skille / instrukcje; bez
serwerów MCP z kluczem; wszystko przez SDD z zapisem w `docs/` + telemetria).
