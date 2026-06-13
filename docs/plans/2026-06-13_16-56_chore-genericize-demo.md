---
type: plan
id: 'plan.chore.genericize-demo'
status: clarified
date: '2026-06-13'
title: 'chore — genericize-demo'
agents: [orchestrator, vitest, reviewer]
---

# Plan: chore — genericize-demo

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.chore.genericize-demo` → `docs/specs/genericize-demo/spec.md` (`sdd:check`).

## Zadania

> Zmiana **danych demo + i18n + testy** (bez nowych komponentów). „Trójka testowa":
> scenariusze = AC w specu · testy jednostkowe = Vitest dotkniętych libów · e2e/UX = **n/d**
> (brak zmian behaviour/layoutu — tylko teksty/dane; e2e celuje w `data-testid`, nie teksty).
> Bramki kontraktowe: `lint` + `typecheck` + `prettier` + `ai:validate` + `sdd:check`.

| id   | title                                                                                              | agent        | done_when                                      | model        | blocked_by       |
| ---- | -------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------- | ------------ | ---------------- |
| T001 | Spec + AC (z audytu → zatwierdzony zakres)                                                         | orchestrator | spec.md bez `[?]`                              | Opus 4.8     | —                |
| T002 | Pule danych: `UNIVERSITIES`→zmyślone, `Helios Med`→`Cyprys Med`, NIP fallback→`3141592659`         | orchestrator | brak realnych encji w `polish-fake-data.ts`    | Opus 4.8     | T001             |
| T003 | Consent `credit-bureau` (klucz/label/opis) + sync mapy EN                                          | orchestrator | brak KRD/BIK; katalog ↔ EN spójne              | Opus 4.8     | T001             |
| T004 | Branding: 3× `<title>` + nagłówek portalu + EN bez `angular22`; `nowiro`→`example.com`/`angular22` | orchestrator | brak `angular22` user-facing, brak `nowiro`    | Opus 4.8     | T001             |
| T005 | Testy jednostkowe zaktualizowane (consents / NIP / isLocalhost) i zielone                          | vitest       | wizard-core + wizard-validators + indiv-data ✓ | Gemini Flash | T002, T003, T004 |
| T006 | Bramki: lint + typecheck dotkniętych + prettier + `ai:validate` + `sdd:check`                      | reviewer     | wszystkie green                                | Gemini Flash | T005             |
| T007 | Verify (final) + run-log + telemetria                                                              | orchestrator | go + commit                                    | Opus 4.8     | T006             |

## Notatki

- **e2e / UX = n/d**: zmiana tylko tekstów/danych; potwierdzono brak asercji na tytuły/brand
  w `apps/*-e2e`.
- **NIP `3141592659`** = cyfry π, checksum-valid (Σ·wagi = 185, 185 mod 11 = 9), nie jest
  realną rejestracją (zastępuje znany realny `5270103391`).
- Geografia / nazwiska świadomie zostawione (zakres „realne encje + projekt").
