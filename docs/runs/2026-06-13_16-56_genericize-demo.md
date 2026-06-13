---
type: run
id: 'run.chore.genericize-demo'
status: done
date: '2026-06-13'
stamp: '2026-06-13_16-56'
title: 'chore — genericize-demo'
---

# Run-log: chore — genericize-demo · 2026-06-13_16-56

> Artefakt SDD **wersjonowany** w `docs/runs/`. Krok-po-kroku zapis **jednej iteracji**:
> kto (agent), na czym (model), z jakim wynikiem. Orchestrator (Opus) domyka sekcją
> „Weryfikacja końcowa" + **Telemetrią**.

Powiązane: spec `docs/specs/genericize-demo/spec.md` · plan `docs/plans/2026-06-13_16-56_chore-genericize-demo.md`.

## Kroki

| #   | krok (SDD)                       | agent                                         | model        | wynik / artefakt                                                                         | status |
| --- | -------------------------------- | --------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------- | ------ |
| 1   | audyt (wejście)                  | workflow `generic-demo-name-audit` (5 subag.) | Opus 4.8     | raport: 1 high (uczelnie) + medium (KRD/BIK, Helios, nowiro, angular22) + low (NIP, geo) | done   |
| 2   | specify + AC (zakres zatwierdz.) | orchestrator                                  | Opus 4.8     | spec.md + plan.md (chore/genericize-demo)                                                | done   |
| 3   | implement: pule danych           | orchestrator                                  | Opus 4.8     | `UNIVERSITIES`→zmyślone, `Helios Med`→`Cyprys Med`, NIP→`3141592659`                     | done   |
| 4   | implement: consent + i18n        | orchestrator                                  | Opus 4.8     | `credit-bureau` (klucz/label/opis) + sync mapy EN                                        | done   |
| 5   | implement: branding + nowiro     | orchestrator                                  | Opus 4.8     | 3× `<title>` + nagłówek portalu + EN bez `angular22`; `nowiro`→`example.com`/`angular22` | done   |
| 6   | testy jednostkowe                | vitest (`run-many`)                           | —            | wizard-core + wizard-validators + individual-wizard-data zielone                         | done   |
| 7   | bramki                           | reviewer                                      | Gemini Flash | lint+typecheck (6 proj + 8 dep) zielone; grep realnych nazw = **0**                      | done   |
| 8   | verify (DoD)                     | orchestrator                                  | Opus 4.8     | prettier + `ai:validate` + `sdd:check` zielone; commit                                   | done   |

## Weryfikacja końcowa (orchestrator / Opus)

- **Diff vs spec/AC:** go — wszystkie AC zrealizowane (grep realnych encji = 0; consent
  `credit-bureau`; NIP syntetyczny `3141592659`; brak `nowiro`/`angular22` user-facing).
- **Bramki:** testy 3 libów ✓ · lint+typecheck 6 proj (+8 dep) ✓ · grep realnych nazw = 0 ·
  prettier ✓ · `ai:validate` ✓ · `sdd:check` ✓.
- **Pokrycie spec ↔ kod:** każde AC pokryte (grep + testy jednostkowe).
- **Testy:** trójka — scenariusze = AC, unit = Vitest zielone; **e2e/UX n/d** (tylko
  teksty/dane; potwierdzony brak asercji na tytuły/brand w `apps/*-e2e`).
- **UX z uruchomienia:** **n/d** (zmiana tekstowa; opcjonalny preview portalu pokazałby
  nagłówek „Portal aplikacji").
- **Rozjazdy / zawrócone do specjalisty:** brak.
- **Werdykt:** **go** — demo name-free w zatwierdzonym zakresie („realne encje + projekt").

## Rozliczenie / Telemetria

| metryka                         | wartość                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| tokeny (wyjściowe, sumarycznie) | ~255 486 (workflow audytu `generic-demo-name-audit`); implementacja direct (main-loop, poza narzędziami) |
| kredyty (premium requests)      | **n/d** — poza narzędziami repo (dashboard Copilot / billing)                                            |
| background taski (liczba)       | **1** — audyt `generic-demo-name-audit` (`wqctoueiw`)                                                    |
| sesje (liczba)                  | **1** — bieżąca (`list_sessions` → brak innych)                                                          |
| agenci / subagenci              | **5** subagentów audytu + orchestrator; implementacja bez subagentów (edycje direct)                     |
