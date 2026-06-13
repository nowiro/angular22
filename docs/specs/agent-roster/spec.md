---
type: spec
id: 'spec.agent-roster'
status: clarified
title: 'Konsolidacja agentow angular (angular -> angular-engineer) + nowi agenci accessibility/performance/i18n'
created: '2026-06-13'
---

# Spec: Konsolidacja agentów `angular` + nowi agenci `accessibility` / `performance` / `i18n`

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Po dodaniu ławki specjalistów repo ma 17 agentów, w tym **trzy pliki `angular*`**:
`angular-engineer` (scaffolder), `angular` (framework patterns) i `angular-cli` (doc-MCP).
`angular` i `angular-engineer` **pokrywają się** (oba Gemini Flash, edit-capable, kod
Angulara) — konsolidujemy je w jeden `angular-engineer`. `angular-cli` **zostaje osobno**: to
front doc-MCP na `GPT-5 mini` (reguła „tylko agenci doc-MCP wołają MCP" wymaga taniego
modelu, więc nie da się go scalić z edit-agentem). Dodatkowo rozszerzamy ławkę o audytora a11y
na poziomie kodu, specjalistę wydajności i specjalistę spójności i18n.

## User story

Jako prowadzący repo przez `orchestrator` chcę **jednego** agenta Angulara (scaffolding +
framework) zamiast dwóch nakładających się, plus ukrytych specjalistów `accessibility`,
`performance` i `i18n`, aby ławka była spójna (bez duplikatów) i pokrywała kolejne wymiary jakości.

## Acceptance criteria

- **Given** konsolidacja, **when** patrzę na `.github/agents/`, **then** **nie ma**
  `angular.agent.md`; `angular-engineer` pokrywa scaffolding **i** logikę frameworkową
  (sygnały / DI / control flow / wydajność); `angular-cli` pozostaje osobnym agentem doc-MCP.
- **Given** brak osieroconych referencji, **when** szukam agenta `` `angular` `` w repo,
  **then** każda referencja wskazuje `angular-engineer` (lub jest usunięta) — **0** linków do
  usuniętego agenta.
- **Given** nowi agenci, **when** patrzę na `.github/agents/`, **then** istnieją ukryci:
  `accessibility` (read-only, WCAG 2.1 AA na poziomie kodu — odpowiednik runtime `ux-verifier`),
  `performance` (edit), `i18n` (edit).
- **Given** guard, **when** `pnpm ai:validate`, **then** zielone: **1 widoczny**, **19**
  agentów, każdy nowy ma `model:` + `user-invocable: false`.
- **Given** spójność, **when** patrzę na orchestrator / `AGENTS.md` / copilot-instructions /
  mcp-usage, **then** odzwierciedlają ławkę (bez `angular`, z `accessibility`/`performance`/`i18n`).
- **Given** bramki, **when** `ai:validate` + `sdd:check` + `prettier`, **then** zielone.

## Success metrics

- `ai:validate`: **1** widoczny · **19** agentów; pliki `angular*` = **2**
  (`angular-engineer`, `angular-cli`).
- `grep` referencji do agenta `angular` poza `angular-engineer`/`angular-cli` → **0**.
- `sdd:check` zielone (**4** spec / **4** plan); `prettier` zielone.

## Non-goals

- Łączenie `angular-cli` z czymkolwiek (zostaje GPT-5 mini doc-MCP — reguła MCP).
- Refaktor `ux-verifier` (runtime a11y zostaje; `accessibility` to warstwa **kodu**).
- Implementacja kolejnych **proponowanych** agentów (deps / pr / docs) — osobna decyzja.

## Open questions

Brak — kierunek konsolidacji (`angular` → `angular-engineer`, nie odwrotnie, by uniknąć
masowego renamingu) i zakres nowych agentów zatwierdzone.
