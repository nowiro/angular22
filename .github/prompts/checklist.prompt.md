---
agent: agent
description: SDD quality checklist — generate and run a "ready to build with quality" gate derived from the spec's Acceptance criteria + the repo's hard rules, after /analyze (go) and BEFORE implementation. Read-only. Adapts spec-kit's /speckit.checklist.
---

# /checklist — bramka jakości przed implementacją

Generuje i przechodzi **checklistę jakości** dla zadania — adaptacja spec-kit `/speckit.checklist`.
Uruchamiasz **po** `/analyze` (go) i **przed** implementacją: „czy budujemy z najwyższą jakością".
Read-only — niczego nie zmieniasz. Kanon: `docs/sdd/methodology.md`. Wyprowadzasz pozycje z
`docs/specs/<slug>/spec.md` (`## Acceptance criteria`) + twardych reguł repo (`copilot-instructions`).

## Co weryfikujesz (☑ / ☐ + jak sprawdzić)

1. **Wymagania** — każde AC **testowalne i jednoznaczne**; zero `[?]`; macierz traceability
   (wymaganie ↔ AC ↔ element/rola) domknięta (`doc-reviewer`).
2. **Testy (trójka, per rola)** — scenariusze z **każdego** AC; happy + edge + boundary; **macierz
   RBAC** (admin/user/guest) + **negatywne testy authz**; **wszystkie elementy interaktywne** mają
   `data-testid` i są przeklikane w e2e (`test-strategy`/`playwright`).
3. **Kod (lint-clean z miejsca)** — `code-quality.instructions` + `angular.instructions` przeczytane
   PRZED kodem; OnPush + standalone + signals + control flow; **Signal Forms** (zero `FormGroup`/
   `ngModel`); Material **tylko** przez wrappery; **i18n** `a22T` (PL klucz + EN); komponenty przez
   generator. **DRY/SOLID** — brak duplikacji, jedna odpowiedzialność.
4. **A11y** — WCAG (role, focus-visible, kontrast, touch ≥ 44); runtime → `ux-verifier`/`accessibility`.
5. **Bezpieczeństwo** — ochrona przez **guard** (nie tylko ukryte UI); brak sekretów; dane z untrusted
   źródeł walidowane (`security`/`keycloak`).
6. **DoD** — `pnpm verify` (skład → `AGENTS.md`) + dotknięte `e2e` zielone + UX z uruchomienia;
   run-log z **raportem błędów** + telemetrią zaplanowany.

## Format

Lista `☑ / ☐ | pozycja | jak zweryfikować | właściciel (agent)`. Na końcu **go / no-go**: każda
**niezaznaczona** pozycja krytyczna = **no-go** (wróć do specjalisty / `/clarify`), zanim ruszy kod.

## NIE

Nie modyfikuj artefaktów ani kodu (read-only). Nie pomijaj pozycji „bo oczywiste". Nie zaczynaj
implementacji przy otwartej pozycji krytycznej — to bramka **przed** budową.
