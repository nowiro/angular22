---
type: run
id: 'run.feature.specialist-agents'
status: done
date: '2026-06-13'
stamp: '2026-06-13_17-12'
title: 'feature — specialist-agents'
---

# Run-log: feature — specialist-agents · 2026-06-13_17-12

> Artefakt SDD **wersjonowany** w `docs/runs/`. Krok-po-kroku zapis **jednej iteracji**:
> kto (agent), na czym (model), z jakim wynikiem. Orchestrator (Opus) domyka sekcją
> „Weryfikacja końcowa" + **Telemetrią**.

Powiązane: spec `docs/specs/specialist-agents/spec.md` · plan `docs/plans/2026-06-13_17-12_feature-specialist-agents.md`.

## Kroki

| #   | krok (SDD)             | agent                                         | model    | wynik / artefakt                                                               | status |
| --- | ---------------------- | --------------------------------------------- | -------- | ------------------------------------------------------------------------------ | ------ |
| 1   | specify + AC           | orchestrator                                  | Opus 4.8 | spec.md + plan.md (feature/specialist-agents)                                  | done   |
| 2   | draft 6 agentów        | workflow `specialist-agents-draft` (6 subag.) | Opus 4.8 | `angular-cli` (MCP) + `angular`/`typescript`/`styles`/`html`/`seo-routing`     | done   |
| 3   | reguła MCP (delegacja) | orchestrator                                  | Opus 4.8 | `angular-engineer` + `material-wrapper` delegują doc-MCP (nie wołają sami)     | done   |
| 4   | wire shared docs       | orchestrator                                  | Opus 4.8 | orchestrator (agents+routing), AGENTS (tabela+tiery), copilot-instr, mcp-usage | done   |
| 5   | bramki                 | reviewer                                      | —        | `ai:validate` (1 widoczny · 17 agentów) + `sdd:check` (3/3) + `prettier` ✓     | done   |
| 6   | verify (DoD)           | orchestrator                                  | Opus 4.8 | bramki green + telemetria; commit                                              | done   |

## Weryfikacja końcowa (orchestrator / Opus)

- **Diff vs spec/AC:** go — 6 nowych ukrytych agentów (`angular`, `typescript`, `styles`,
  `html`, `seo-routing` na Gemini Flash + `angular-cli` na GPT-5 mini); reguła doc-MCP
  scentralizowana; orchestrator + AGENTS + copilot-instructions + mcp-usage spójne.
- **Bramki:** `pnpm ai:validate` ✓ (**1 widoczny · 17 agentów** · 8 skilli · 4 prompty) ·
  `pnpm sdd:check` ✓ (3 spec / 3 plan) · `prettier` ✓.
- **Pokrycie spec ↔ artefakty:** każde AC pokryte (frontmattery + tiery zweryfikowane przez
  `ai:validate`; reguła MCP udokumentowana w mcp-usage + copilot-instructions).
- **Testy:** klasyczna trójka **n/d** (zmiana tooling AI, markdown/config) — kontrakt = bramki
  konfiguracji (wyżej).
- **UX z uruchomienia:** **n/d** (brak zmian UI).
- **Rozjazdy / zawrócone do specjalisty:** brak. Otwarta kwestia (nie blokująca): czy
  scentralizować też `playwright` MCP (dziś wyjątek: runtime przy `playwright`/`ux-verifier`).
- **Werdykt:** **go** — ławka 17 agentów spójna, reguła doc-MCP egzekwowana w docs.

## Rozliczenie / Telemetria

| metryka                         | wartość                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| tokeny (wyjściowe, sumarycznie) | ~241 989 (workflow `specialist-agents-draft`); wiring + reguła MCP direct (main-loop, poza narzędziami) |
| kredyty (premium requests)      | **n/d** — poza narzędziami repo (dashboard Copilot / billing)                                           |
| background taski (liczba)       | **1** — `specialist-agents-draft` (`w00tbyq0z`)                                                         |
| sesje (liczba)                  | **1** — bieżąca (`list_sessions` → brak innych)                                                         |
| agenci / subagenci              | **6** subagentów draftu + orchestrator; wiring bez subagentów (edycje direct)                           |
