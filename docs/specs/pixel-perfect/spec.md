---
type: spec
id: 'spec.pixel-perfect'
status: clarified
title: 'Agent pixel-perfect — wiernosc wizualna i RWD vs mockupy'
created: '2026-06-13'
---

# Spec: Agent `pixel-perfect` — wierność wizualna i RWD vs mockupy

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Ławka ma audytora runtime UX (`ux-verifier`: overflow / nakładki / kontrast / focus / i18n) i
bramkę wejścia `doc-reviewer` (mockupy ↔ dokumentacja **PRZED** kodem). Brakuje audytora
**wierności wizualnej**: porównania **uruchomionej** apki z **mockupami** (pixel-perfect + RWD)
**PO** kodzie — spacing, alignment, kolory, typografia, układ per breakpoint. Użytkownik chce
takiego agenta („jeśli mockupy są" — bez nich N/A).

## User story

Jako prowadzący repo chcę ukrytego agenta `pixel-perfect`, który porówna zaimplementowany UI
(żywa przeglądarka, screenshoty per breakpoint) z mockupami i zgłosi rozbieżności pikselowe / RWD
— aby implementacja wiernie odzwierciedlała projekt, a fixy trafiały do `styles` / `angular-engineer`.

## Acceptance criteria

- **Given** nowy agent, **when** patrzę na `.github/agents/`, **then** istnieje ukryty
  `pixel-perfect` (read-only, Gemini Flash) — porównuje **uruchomioną** apkę (serwer MCP
  `playwright`) z mockupami per breakpoint (360 / 768 / 1280 / 1920): spacing / alignment / kolory
  / typografia / RWD.
- **Given** brak mockupów, **when** agent działa, **then** werdykt **N/A** (zgłasza brak
  referencji, **nie zmyśla** wzorca).
- **Given** granice, **when** czytam agenta, **then** rozgranicza się od `ux-verifier` (funkcjonalny
  UX), `doc-reviewer` (mockupy ↔ docs przed kodem) i `accessibility` (a11y kod); routuje fixy do
  `styles` / `material-wrapper` / `angular-engineer`.
- **Given** guard, **when** `pnpm ai:validate`, **then** zielone (1 widoczny, **30** agentów;
  `pixel-perfect` ma `model:` + `user-invocable: false`).
- **Given** spójność, **when** patrzę na orchestrator / `AGENTS.md` / copilot-instructions /
  mcp-usage, **then** `pixel-perfect` wpięty (routing, tabela + tier, lista specjalistów, grupa
  browser-MCP).
- **Given** bramki, **when** `ai:validate` + `sdd:check` + `prettier`, **then** zielone.

## Success metrics

- `ai:validate`: **1** widoczny · **30** agentów; `sdd:check` zielone (**8** spec / **8** plan);
  `prettier` zielone.
- `pixel-perfect` w grupie browser-MCP (`playwright` / `ux-verifier` / `pixel-perfect`) w `mcp-usage`.

## Non-goals

- Automatyczny pixel-diff jako skrypt / CI (brak Actions; brak narzędzia do diffu w repo) — agent
  porównuje **wizualnie + liczbowo** (`rect` / computed), nie toolingiem pixel-diff; CI/diff =
  osobna decyzja.
- Dostarczanie mockupów — repo to generyczny demo bez mockupów dziś; agent jest do **przyszłego**
  użycia (gdy mockupy są dostarczone).

## Open questions

Brak. Bez mockupów w repo agent jest gotowy „na zapas" — uruchamiany, gdy projekty / mockupy są dostępne.
