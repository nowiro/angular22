---
type: spec
id: 'spec.verification-hardening'
status: clarified
title: 'Hardening weryfikacji SDD — końcowa re-weryfikacja, elementy interaktywne, raport zadania'
created: '2026-06-13'
---

# Spec: hardening weryfikacji SDD

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `docs/sdd/templates/spec.md`.

## Kontekst

Audyt warstwy AI-tooling wykazał luki w **domknięciu** drabiny SDD: (1) krok `verify` nie
wymusza **ponownej** weryfikacji całości po testach (DoD + każde AC + e2e + testy integracyjne
gdy API dostępne); (2) brak systematycznego **przeklikania elementów interaktywnych** (buttony,
linki, inputy, textarea, select/dropdown, filtry) na trzech bramkach (doc-review enumeruje,
e2e wykonuje, weryfikator runtime potwierdza); (3) run-log nie ma **raportu błędów** — telemetria
liczy tokeny/kredyty/sesje, ale napotkane problemy giną; (4) `doc-reviewer` i `test-strategy`
nie kodyfikują **najlepszych standardów** (Definition of Ready, macierz traceability, RBAC —
scenariusze per rola i dostępność elementów wg uprawnień).

## User story

Jako prowadzący repo chcę, aby **każde** zadanie SDD kończyło się twardą **re-weryfikacją**
(orchestrator/Opus ponownie sprawdza DoD, każde AC, e2e + integrację gdy API jest, i przeklikuje
wszystkie elementy interaktywne per rola), a w `docs/` zostawał **pełny raport zadania** (błędy +
model + tokeny + kredyty Copilot) — oraz aby `doc-reviewer` i `test-strategy` stosowały najlepsze
standardy, w tym scenariusze dla **użytkowników o różnych uprawnieniach** i dostępność elementów
zależną od roli.

## Acceptance criteria

- **Given** zakończony krok `implement`, **when** orchestrator robi `verify`, **then** workflow
  wymaga **ponownej weryfikacji całości**: DoD (`pnpm verify`) + **każde AC** odhaczone +
  **e2e** zielone + **testy integracyjne** uruchomione **gdy API dostępne** (inaczej jawne `n/d`).
- **Given** zmiana dotyka UI, **when** `verify`, **then** **wszystkie elementy interaktywne**
  (button/link/input/textarea/select/dropdown/filtr) są **przeklikane/wypełnione** — enumerowane
  w `doc-review`, wykonane w **e2e** (`playwright`), potwierdzone na żywej apce przez `ux-verifier`
  — **per rola** (admin/user/guest), z weryfikacją widoczności/dostępności wg uprawnień.
- **Given** zamknięte zadanie, **when** czytam run-log w `docs/runs/`, **then** zawiera sekcję
  **Raport błędów / napotkane problemy** (krok · błąd · przyczyna · jak naprawiono · status) **oraz**
  Telemetrię (model per krok · tokeny · kredyty Copilot · background taski · sesje).
- **Given** bramka wejścia, **when** czytam `doc-reviewer`, **then** stosuje **Definition of Ready**:
  kompletność wymagań (INVEST/SMART dla AC), **macierz traceability** (wymaganie ↔ AC ↔ element
  mockupu), enumeracja elementów interaktywnych + **uprawnień**, taksonomia niejasności, STOP-no-go.
- **Given** projekt testów, **when** czytam `test-strategy`, **then** kodyfikuje najlepsze praktyki:
  happy + edge + **boundary/decision-table/state-transition** + **macierz RBAC** (rola × element ×
  oczekiwanie: widoczny/aktywny/zabroniony) + testy **autoryzacji negatywne** (rola bez uprawnień).
- **Given** bramki, **when** `pnpm ai:validate` + `sdd:check` + `prettier`, **then** zielone
  (1 widoczny · 30 agentów; szablon `run.md` i `methodology` spójne).

## Success metrics

- `ai:validate`: **1** widoczny · **30** agentów; `sdd:check` zielone; `prettier` zielone.
- `doc-reviewer` + `test-strategy` + `orchestrator` + `ux-verifier` + `playwright` + `run.md` +
  `methodology` opisują re-weryfikację, elementy interaktywne, RBAC i raport błędów (cross-ref spójny).

## Non-goals

- Kod aplikacji (auth/RBAC) — to osobny feature [`keycloak-rbac`](../keycloak-rbac/spec.md).
- Dedykowany serwer MCP Jira/Confluence (doc-reviewer pracuje na dostarczonych treściach).
- Realny serwer testów integracyjnych — kontrakt to **„gdy API dostępne"** (inaczej `n/d`).

## Open questions

Brak — zakres dotyczy wyłącznie warstwy procesu/configu (agents/skills/templates/methodology).
