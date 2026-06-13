---
agent: agent
description: End-to-end feature entrypoint — runs the full SDD ladder (specify → clarify → plan → analyze → implement → verify) via the orchestrator and enforces the mandatory test trójka and DoD gate.
---

# /feature-dev — pełna drabina SDD dla funkcji

Wygodne wejście do **kompletnej drabiny SDD** dla opisanej funkcji. Nie reimplementuje
systemu — **prowadzi** [`orchestrator`](../agents/orchestrator.agent.md) i jego routing.
Kanon kroków: [`methodology.md`](../../docs/sdd/methodology.md); reguły/stack →
[`copilot-instructions.md`](../copilot-instructions.md).

## Wejście

`/feature-dev <opis funkcji>` — luźny opis po polsku. Wyprowadź `<slug>` (`[a-z0-9-]+`).
Zakres ≥2 plików / zmiana behaviour → pełna drabina (inaczej: edycja in-file wprost).

## Procedura (1:1 z drabiną SDD)

1. **specify** — `pnpm workflow:specify -- --verb=feature --slug=<slug>`; scaffold
   `spec.md` (z `[?]`) + `plan.md` + datowany `run.md`.
2. **clarify** — [`/clarify`](./clarify.prompt.md) domyka każde `[?]`; bez tego plan stoi.
3. **plan** — tabela `id | title | agent | done_when | status | model | blocked_by` z **obowiązkową trójką
   testową**: scenariusze (z AC) + **Vitest** (`@nx/vitest:test`) + **Playwright**
   (`@nx/playwright:playwright`). Brak którejkolwiek pozycji = **no-go**.
4. **analyze** — [`/analyze`](./analyze.prompt.md) → jednoznaczne **go / no-go**.
5. **implement** — **deleguj do specjalistów** (orchestrator, `tool agent`): logika /
   Signal Forms / i18n → `angular-engineer` (**komponenty TYLKO przez
   `pnpm nx g @nx/angular:component`**); wrappery / theming `--mat-sys-*` →
   `material-wrapper`; lint → `eslint`; unit → `vitest`; e2e → `playwright`. Specjalista
   czyta `code-quality.instructions` + `angular.instructions` **PRZED** kodem — lint-clean
   z miejsca, bez rundy poprawek.
6. **verify** — orchestrator/**Opus** sam przegląda diff (AC, regresje, scope-creep) + UX
   **z uruchomienia** (werdykt `ux-verifier` na żywej przeglądarce, nigdy z czytania kodu).
7. **DoD** — `pnpm verify` zielone + dotknięte `e2e` zielone + run-log w `docs/runs/`.

**Każda iteracja = datowany run-log** `docs/runs/YYYY-MM-DD_HH-MM_<slug>.md` (krok = agent

- model + wynik). Bramki **Material** (tylko wrappery), **Signal Forms** (`form()`/
  `schema()`/`[formField]`, zero `FormGroup`/`ngModel`) i **i18n** (`a22T`, PL = klucz) są
  **twarde** — nie do negocjacji w żadnym kroku.

## Hand-off

Po `go` z kroku 4 oddaj sterowanie orchestratorowi (implement → verify → DoD). Rozjazd na
weryfikacji końcowej → zawróć do właściwego specjalisty, nie łataj sam.

## NIE

Nie pomijaj bramek SDD ani **trójki testowej**. Nie pisz komponentów ręcznie — zawsze
`nx g`. Nie omijaj wrapperów Material ani Signal Forms. **Nie ogłaszaj Done** bez zielonego
`pnpm verify` i UX z **uruchomienia**.
