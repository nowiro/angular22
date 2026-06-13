---
type: spec
id: 'spec.agent-bench-extend'
status: clarified
title: 'Kolejni agenci: deps/nx-architect/migration/web-components/docs/test-strategy/scm + meta-reviewer (+skill ai-config-quality)'
created: '2026-06-13'
---

# Spec: Kolejni agenci + meta-reviewer (skill `ai-config-quality`)

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Ławka ma **19 agentów**. Użytkownik rozszerza ją o kolejne wymiary bez właściciela:
zależności, architektura Nx, migracje wersji, embedding web-components, dokumentacja, projekt
testów, source-control oraz **meta-audyt** samej konfiguracji AI (czy agenci / skille /
instrukcje są dobrze napisane — DRY / SRP / house-style). Wszyscy **ukryci**; widoczny
pozostaje `orchestrator` (`agents: ['*']`).

## User story

Jako prowadzący repo przez `orchestrator` chcę dedykowanych ukrytych specjalistów dla
zależności, architektury monorepo, migracji, web-components, dokumentacji, strategii testów i
source-control, plus **audytora jakości samej konfiguracji AI**, aby każdy wymiar pracy oraz
warstwa tooling-AI miały właściciela i były spójne (DRY, single-responsibility).

## Acceptance criteria

- **Given** ławka, **when** patrzę na `.github/agents/`, **then** istnieją nowi **ukryci**
  agenci: `deps`, `nx-architect`, `migration`, `web-components`, `docs`, `scm` (edit-capable)
  oraz `test-strategy`, `meta-reviewer` (read-only); wszyscy Gemini Flash, `user-invocable: false`.
- **Given** meta-audyt, **when** patrzę na `.github/skills/`, **then** istnieje skill
  `ai-config-quality` (rubryka DRY/SRP/house-style/cross-refy), stosowana przez `meta-reviewer`.
- **Given** guard, **when** `pnpm ai:validate`, **then** zielone: **1 widoczny**, **27**
  agentów, **9** skilli; każdy nowy agent ma `model:` + `user-invocable: false`.
- **Given** routing, **when** patrzę na `orchestrator`, **then** każdy nowy agent ma trasę
  (proza; `agents: ['*']` pokrywa techniczną delegację).
- **Given** spójność, **when** patrzę na `AGENTS.md` + copilot-instructions + mcp-usage,
  **then** odzwierciedlają nowych agentów i skill.
- **Given** bramki, **when** `ai:validate` + `sdd:check` + `prettier`, **then** zielone.

## Success metrics

- `ai:validate`: **1** widoczny · **27** agentów · **9** skilli · 4 prompty.
- `sdd:check` zielone (**5** spec / **5** plan); `prettier` zielone.
- **0** nowych serwerów MCP (nowi agenci to nie-MCP — delegują do `context7`/`nx`/`angular-cli`).

## Non-goals

- Nowe serwery MCP / agenci doc-MCP (nie dodajemy serwerów).
- Egzekwowanie `meta-reviewer` w `ai:validate` — guard zostaje **strukturalny**; meta-audyt
  jakości jest on-demand, nie blokujący.
- `smc` rozumiane jako `scm` (source-control management) — potwierdzona interpretacja.

## Open questions

Brak. Uwaga (nie blokująca): ławka **27 agentów** jest duża — ryzyko rozmycia routingu;
mitygacja to wyraźne sekcje „Granica" w każdym agencie + `meta-reviewer` pilnujący jakości.
