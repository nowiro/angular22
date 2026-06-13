---
type: spec
id: 'spec.specialist-agents'
status: clarified
title: 'Hidden specialist agents (angular/typescript/styles/html/seo-routing/angular-cli) + MCP-only-via-MCP-agents rule'
created: '2026-06-13'
---

# Spec: Hidden specialist agents + MCP-only-via-MCP-agents rule

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Repo ma 11 agentów Copilota (1 widoczny `orchestrator` + 10 ukrytych). Użytkownik chce
**gęstszą ławkę specjalistów per-wymiar** oraz **twardą regułę MCP**: serwery doc-MCP
(`context7`, `nx`, `angular-cli`) wołają **wyłącznie** dedykowani agenci na najtańszym modelu
**GPT-5 mini**; pozostali agenci delegują do nich zapytania o docs/API zamiast wołać MCP
samodzielnie. Wszyscy nowi agenci **ukryci** (`user-invocable: false`) — widoczny pozostaje
tylko `orchestrator` (guard `pnpm ai:validate`).

## User story

Jako prowadzący repo przez `orchestrator` chcę ukrytych specjalistów dla Angulara,
TypeScriptu, styli, HTML/szablonów i SEO/routingu, plus front doc-MCP dla Angular CLI, aby
orchestrator routował głęboką pracę per-wymiar do właściwego agenta, a wołania MCP były
scentralizowane w tanich agentach GPT-5 mini.

## Acceptance criteria

- **Given** ławka agentów, **when** patrzę na `.github/agents/`, **then** istnieją nowi
  **ukryci** agenci: `angular`, `typescript`, `styles`, `html`, `seo-routing` (Gemini Flash,
  edit-capable) oraz `angular-cli` (GPT-5 mini, doc-MCP, bez `editFiles`).
- **Given** guard, **when** `pnpm ai:validate`, **then** zielone: **dokładnie 1 widoczny**
  agent (`orchestrator`/Opus), każdy nowy agent ma `model:` i `user-invocable: false`.
- **Given** reguła MCP, **when** czytam agentów i instrukcje, **then** doc-MCP
  (`context7`/`nx`/`angular-cli`) wołają tylko ci 3 agenci (GPT-5 mini); `angular-engineer`,
  `material-wrapper` i nowi specjaliści **delegują**, nie wołają MCP. (Wyjątek: `playwright`
  MCP = żywa przeglądarka, agenci `playwright`/`ux-verifier`.)
- **Given** `orchestrator`, **when** patrzę na `agents:` + routing, **then** wszyscy nowi
  agenci są zarejestrowani i mają trasę.
- **Given** spójność, **when** patrzę na `AGENTS.md` + `copilot-instructions` + `mcp-usage`,
  **then** odzwierciedlają nową ławkę, tiery modeli i regułę MCP.
- **Given** bramki, **when** `ai:validate` + `sdd:check` + `prettier`, **then** zielone.

## Success metrics

- `ai:validate`: **1** widoczny · **17** agentów ogółem; **3** agentów GPT-5 mini doc-MCP
  (`context7`/`nx`/`angular-cli`).
- Reguła „tylko agenci doc-MCP wołają doc-MCP" udokumentowana w `mcp-usage` +
  `copilot-instructions`; `angular-engineer`/`material-wrapper` zaktualizowani na delegację.
- `sdd:check` zielone (3 spec / 3 plan); `prettier` zielone.

## Non-goals

- Refaktor `playwright`/`ux-verifier` — **browser-MCP zostaje** (to runtime, nie doc-lookup).
- Duplikaty: `lint(eslint,sonar)` = istniejący `eslint` (config ma `sonarjs`); `security` istnieje.
- Implementacja **proponowanych** dodatkowych agentów (accessibility / performance / i18n /
  deps) — osobna decyzja (propozycja, nie ta runda).

## Open questions

Brak — zakres i tiery zatwierdzone. Reguła MCP: doc-MCP scentralizowane; browser-MCP
(`playwright`) jako wyjątek — do potwierdzenia, jeśli użytkownik chce scentralizować również jego.
