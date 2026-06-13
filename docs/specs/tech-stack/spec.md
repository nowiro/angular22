---
type: spec
id: 'spec.tech-stack'
status: clarified
title: 'Kanon tech-stack (docs/tech-stack.md) + agent stack-guardian'
created: '2026-06-13'
---

# Spec: Kanon tech-stack + agent `stack-guardian`

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `docs/sdd/templates/spec.md`.

## Kontekst

Stack repo (Angular 22 / Material 22 / Nx 22 / TS 6 / Vitest / Playwright / pnpm) jest dziś
opisany **rozproszone** w `copilot-instructions §Stack`, `README §Stack` i `package.json` —
brak JEDNEGO kanonu z listą **dozwolonych/zakazanych** technologii i regułami spójności
wersji, oraz brak właściciela, który by tego pilnował. Tworzymy kanon `docs/tech-stack.md`
(single source of truth) + ukrytego audytora `stack-guardian`, który egzekwuje zgodność
`package.json` z kanonem.

## User story

Jako prowadzący repo chcę **jeden autorytatywny manifest stacku** (pinowane wersje + co wolno
/ co zakazane + reguły spójności) oraz agenta pilnującego, by nic off-stack nie wpełzło i by
wersje pozostały spójne — aby stack był stabilny i zmieniał się tylko świadomie przez SDD.

## Acceptance criteria

- **Given** kanon, **when** patrzę na `docs/tech-stack.md`, **then** zawiera: warstwy +
  **pinowane wersje** (zgodne z `package.json`), reguły spójności (Angular = Material = CDK;
  `@nx/*` = `nx`), listę **dozwolone/ZAKAZANE** (zone.js/npm/Jest/webpack/Tailwind/ngrx/...),
  proces zmiany stacku przez SDD.
- **Given** DRY, **when** patrzę na `copilot-instructions` + `README`, **then** sekcja Stack
  **wskazuje** `docs/tech-stack.md` (nie duplikuje pełnej listy).
- **Given** strażnik, **when** patrzę na `.github/agents/`, **then** istnieje ukryty
  `stack-guardian` (read-only, Gemini Flash) egzekwujący kanon wobec `package.json`; routuje
  fixy (`deps`/`migration`/`docs`).
- **Given** guard, **when** `pnpm ai:validate`, **then** zielone: **1 widoczny**, **28**
  agentów; `stack-guardian` ma `model:` + `user-invocable: false`.
- **Given** spójność, **when** patrzę na orchestrator + `AGENTS.md`, **then** `stack-guardian`
  jest wpięty (routing + tabela + tier).
- **Given** bramki, **when** `ai:validate` + `sdd:check` + `prettier`, **then** zielone.

## Success metrics

- `ai:validate`: **1** widoczny · **28** agentów · 9 skilli.
- `docs/tech-stack.md` istnieje; wersje w nim **= wersje w `package.json`** (0 rozjazdu).
- `copilot-instructions` / `README` §Stack **wskazują** kanon (DRY).
- `sdd:check` zielone (**6** spec / **6** plan); `prettier` zielone.

## Non-goals

- Deterministyczny skrypt `pnpm stack:check` w `pnpm verify` — **proponowany** jako mocniejsze
  dopełnienie, ale **osobna** decyzja (ta runda: kanon + agent).
- Zmiana faktycznych wersji / zależności — kanon **dokumentuje** istniejący stack, nie zmienia go.

## Open questions

Brak. Rekomendacja (nie blokująca): dodać `pnpm stack:check` (walidacja `package.json` ↔
kanon) w `pnpm verify`, by `stack-guardian` miał **deterministyczne** wsparcie.
