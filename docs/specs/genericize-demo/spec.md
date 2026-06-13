---
type: spec
id: 'spec.genericize-demo'
status: clarified
title: 'Genericyzacja danych demo: usuniecie realnych nazw (uczelnie, KRD/BIK, NIP, handel nowiro, angular22 w UI)'
created: '2026-06-13'
---

# Spec: Genericyzacja danych demo — usunięcie realnych nazw

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `mcp-workspace/docs/sdd/templates/spec.md`.

## Kontekst

Audyt aplikacji („generyczny demo bez nazw") wykazał kilka **realnych encji** w danych demo
i UI: realne uczelnie w puli [`polish-fake-data.ts`](../../../libs/wizard/core/src/lib/polish-fake-data.ts),
realne biura kredytowe **KRD/BIK** w katalogu zgód, realny zarejestrowany **NIP** `5270103391`
(fallback generatora + test walidatora), osobisty handel właściciela **nowiro** (test
`isLocalhost` + komentarz `.vscode/mcp.json`) oraz nazwę projektu **`angular22`** w tytułach
stron i nagłówku portalu. Cel: w pełni generyczny, name-free demo. Zakres zatwierdzony przez
użytkownika: **realne encje + nazwa projektu w UI**; geografia (miasta/ulice) i pospolite
nazwiska (Nowak/Kowalski ~ Doe/Smith) zostają jako normalne dane demo.

## User story

Jako autor/odbiorca demo chcę, aby aplikacja nie zawierała realnych nazw (uczelni, firm,
osób, zarejestrowanych identyfikatorów ani nazwy projektu w UI), aby służyła jako neutralny
przykład bez ryzyka kolizji z realnymi podmiotami.

## Acceptance criteria

- **Given** pula uczelni, **when** patrzę na `polish-fake-data.ts`, **then** `UNIVERSITIES`
  zawiera wyłącznie **zmyślone** nazwy (brak Politechniki Warszawskiej, UJ, AGH, PWr, UW).
- **Given** katalog zgód individual, **when** patrzę na consent kredytowy, **then** nie
  wymienia **KRD/BIK**: klucz `credit-bureau`, label/opis generyczne, mapa EN zsynchronizowana.
- **Given** generator/testy NIP, **when** patrzę na fallback i `validators.spec`, **then** nie
  ma realnego `5270103391` — jest syntetyczny checksum-valid `3141592659`.
- **Given** repo, **when** szukam handlu `nowiro`, **then** nie ma go w trackowanych plikach
  (`fake-data.spec` → `demo.example.com`, `mcp.json` → `angular22`).
- **Given** UI, **when** otwieram apki, **then** żaden `<title>` ani nagłówek portalu nie
  zawiera `angular22` (techniczne `@angular22/` scope + selektory `a22-` zostają).
- **Given** bramki, **when** uruchamiam testy dotkniętych libów + `lint`/`typecheck` +
  `prettier`/`ai:validate`/`sdd:check`, **then** wszystkie zielone.

## Success metrics

- `grep` realnych encji (uczelnie / KRD / BIK / `5270103391` / `nowiro` / `aplikacji
angular22` / `angular22</title>`) w `apps/` + `libs/` → **0** trafień.
- Testy `wizard-core` + `wizard-validators` + `individual-wizard-data` → **zielone**.
- `lint` + `typecheck` dotkniętych projektów → **zielone**; `sdd:check` → **zielone**.

## Non-goals

- Geografia (miasta / ulice) i pospolite nazwiska — zostają (normalne dla demo).
- Techniczny scope npm `@angular22/*`, selektory `a22-*`, `package.json#name` (metadata, nie
  UI), etykiety frameworka („Angular 22 Signal Forms").
- Pula `COMPANIES` poza `Helios Med` (→ `Cyprys Med`) — zmyślone nazwy, zostają.

## Open questions

Brak — zakres zatwierdzony decyzją użytkownika („Realne encje + projekt").
