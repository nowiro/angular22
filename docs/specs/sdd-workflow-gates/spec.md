---
type: spec
id: 'spec.sdd-workflow-gates'
status: clarified
title: 'Bramka doc-review + STOP na niejasnosci + commit per krok + sformalizowany workflow orchestratora'
created: '2026-06-13'
---

# Spec: Bramki workflow — doc-review, STOP na niejasności, commit per krok

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Proces SDD (drabina specify→…→verify) działa, ale brakuje trzech bramek jakości, o które prosi
użytkownik: (1) **bramka wejścia doc-review** — przed kodem trzeba porównać dokumentację zadania
(Jira) z dokumentacją projektu (repo / Confluence) i **mockupami**; (2) twardy **STOP na
niejasności** (nie zgaduj — zatrzymaj się i zapytaj); (3) **granularny commit** — każdy krok
oznaczony w planie jako `done` i zacommitowany osobno. Dodatkowo workflow orchestratora ma być
**jawny** (ponumerowane kroki + bramki).

## User story

Jako prowadzący repo chcę, by orchestrator najpierw przez `doc-reviewer` potwierdził spójność
dokumentacji zadania ↔ docs ↔ mockupów, zatrzymał się przy jakiejkolwiek niejasności, a podczas
realizacji oznaczał każdy krok w planie i commitował po kroku — aby wytwarzanie startowało dopiero
na jednoznacznych, spójnych wymaganiach i miało audytowalną historię.

## Acceptance criteria

- **Given** nowy agent, **when** patrzę na `.github/agents/`, **then** istnieje ukryty
  `doc-reviewer` (read-only): porównuje dokumentację zadania ↔ docs/Confluence ↔ mockupy, daje
  go/no-go, **STOP na niejasności**.
- **Given** workflow orchestratora, **when** czytam `orchestrator.agent.md`, **then** jest
  **jawna** drabina z krokiem **0. doc-review** PRZED specify, regułą **STOP na niejasności** i
  **commit po każdym kroku** (+ `status` w planie).
- **Given** kanon, **when** czytam `methodology.md`, **then** opisuje doc-review, STOP-bramkę i
  „krok = oznacz + commit"; szablon `plan.md` ma kolumnę `status` i wiersz `0. doc-review`;
  `run.md` ma krok `0. doc-review`.
- **Given** twarde reguły, **when** czytam `copilot-instructions`, **then** zawierają: doc-review
  przed kodem · STOP na niejasności (nie zgaduj) · commit po każdym kroku.
- **Given** guard, **when** `pnpm ai:validate` + `pnpm sdd:check`, **then** zielone (1 widoczny,
  **29** agentów; header planu `id | title | agent | done_when` zachowany mimo kolumny `status`).

## Success metrics

- `ai:validate`: **1** widoczny · **29** agentów; `sdd:check` zielone (**7** spec / **7** plan);
  `prettier` zielone.
- `doc-reviewer` wpięty w routing orchestratora jako **bramka wejścia**.

## Non-goals

- Integracja **na żywo** z Jira/Confluence (brak ich MCP w repo) — `doc-reviewer` pracuje na
  **dostarczonych** treściach + dokumentacji w repo; live = osobna decyzja (dedykowany MCP).
- Retrofit kolumny `status` do istniejących 6 planów (grandfathered) — dotyczy nowych planów.
- Enforce kolumny `status` w `validate-sdd` (zostaje opcjonalna, by nie złamać istniejących planów).

## Open questions

Brak. Założenie (do potwierdzenia): dostęp do Jira/Confluence przez **dostarczone** treści; jeśli
chcesz integrację na żywo — dodamy dedykowany serwer MCP osobno.
