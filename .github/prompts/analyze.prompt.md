---
agent: agent
description: Cross-artifact SDD consistency check — verify spec ↔ plan ↔ code agree before implementing. Runs the deterministic gate (pnpm sdd:check), then reasons over semantic gaps. Read-only. Use after /clarify and before delegating implementation.
---

# /analyze — spójność spec ↔ plan ↔ kod

Sprawdza spójność artefaktów SDD **zanim** ruszy implementacja. Read-only — niczego nie
zmienia. Kanon: `docs/sdd/methodology.md`.

## Krok 1 — Gate (deterministyczny)

`pnpm sdd:check` (frontmatter, sekcje specu, tabela zadań, traceability
`plan.<verb>.<slug>` → `spec`). **Błędy → zatrzymaj się i zaraportuj** — analiza
semantyczna nie ma sensu na niespójnej strukturze.

## Krok 2 — Analiza semantyczna (per spec)

Dla `docs/specs/<slug>/spec.md` + planu `docs/plans/*-<slug>.md`:

1. **Pokrycie** — każde `## Acceptance criteria` ma zadanie w tabeli planu? Wskaż AC bez
   zadania **oraz** zadania bez AC (scope creep). **Trójka testowa** (scenariusze + Vitest
   - Playwright) obecna w tabeli? Brak = blocker.
2. **Otwarte `[?]`** — każde to ryzyko przed implementacją.
3. **Dryf kodu** — jeśli kod istnieje, czy kontrakty (typy / granice / nazwy pól) zgadzają
   się ze specem? Rozjazdy z `file:line`.
4. **Sprzeczności** — spec vs plan vs kod (nazwy, budżety, zakres); zgodność kolumny
   `model` z `model:` agentów.

## Format

Tabela `artefakt | finding | severity (blocker / major / minor) | sugestia`. Na końcu
jednoznaczny **go / no-go** + jedno zdanie uzasadnienia.

## NIE

Nie modyfikuj spec / plan / kodu (read-only). Nie pomijaj Kroku 1. Nie wymyślaj kryteriów
— pracuj na tym, co realnie w `docs/specs/`.
