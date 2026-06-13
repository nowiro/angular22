---
name: code-review
description: Playbook code review dla angular22 — rubryka severity, bramki auto-blocker (Material/Signal Forms/i18n/testy), warstwy przeglądu diffu i format findingów. Użyj przy ocenie diffu przed merge (agent reviewer).
---

# Code review — playbook repo

Wiedza, którą stosuje agent [`reviewer`](../../agents/reviewer.agent.md) (read-only).
Tu jest **JAK**: rubryka, drabina, warstwy. Bramka decyduje, nie gust — auto-blockery niżej
to naruszenia [`code-quality.instructions`](../../instructions/code-quality.instructions.md)
i [`copilot-instructions`](../../copilot-instructions.md), nie „drobiazgi".

## Drabina (kolejność jest obowiązkowa)

1. **Bramka deterministyczna NAJPIERW** — `pnpm verify` (lub `pnpm lint`) + `read/problems`.
   Czerwona bramka = `no-go` od razu, bez analizy semantycznej. **Nie recenzuj na czerwonej
   bramce** — finding z lintu jest tańszy i pewniejszy niż opinia.
2. **Analiza semantyczna** — dopiero na zielonej bramce przechodzisz warstwy 1–5.

## Rubryka severity

| severity    | znaczenie                           | przykład                                                         |
| ----------- | ----------------------------------- | ---------------------------------------------------------------- |
| **blocker** | łamie bramkę / kontrakt — **no-go** | auto-blocker (niżej), AC bez pokrycia, regresja                  |
| **major**   | działa, ale dług lub realne ryzyko  | mutacja stanu, edge-case `null` nieobsłużony, brak `data-testid` |
| **minor**   | kosmetyka / nit                     | nazwa, komentarz, drobny refactor                                |

### AUTO-BLOCKERY (zawsze blocker — nigdy major/minor)

- Import `@angular/material/*` lub `@angular/cdk/*` **poza** `libs/ui/material`.
- `FormGroup`/`FormBuilder`/`ngModel` zamiast Signal Forms (`form()`/`schema()`/`[formField]`).
- Brak **którejkolwiek** pozycji trójki testowej (scenariusze z AC + Vitest + e2e Playwright).
- `.skip` / `.only` w testach.
- `eslint-disable` bez uzasadnienia po `--` (jedyny dozwolony: `unbound-method` w `form-schema.ts`).
- Public API liba poza `src/index.ts`.
- Komponent pisany ręcznie zamiast `pnpm nx g @nx/angular:component` (inline template/styles, brak OnPush, nie-trzy-pliki).
- Tekst UI bez pipe `a22T` (literał PL = klucz; brak wpisu EN w `*-translations.en.ts`).
- Theming przez `--mdc-*` / `--sys-*` / `::ng-deep` zamiast `--mat-sys-*` + `mat.theme()`.

## Warstwy przeglądu

1. **Spec/AC** — każde AC z `docs/specs/<slug>/spec.md` ma pokrycie; kod **bez AC** = scope
   creep (blocker). Wskaż AC bez kodu **i** kod bez AC.
2. **Poprawność** — regresje, edge-case'y pusty string `''` / `null`, store aktualizuje model
   **immutably** (`model.update`, nie mutacja w miejscu); efekty z guardem równości.
3. **Granice** — tagi `scope:*`/`type:*` respektowane (`scope:individual-wizard` ⛔
   `scope:business-wizard`), warstwy `app → feature → ui/data-access → util`.
4. **Konwencje** — Signal Forms; trzy pliki na komponent + OnPush; i18n `a22T`; `data-testid`
   na **każdym** interaktywnym elemencie; theming `--mat-sys-*`; selektory `a22-*`.
5. **Testy** — trójka **obecna i zielona**; e2e celuje w `data-testid`, nie w tekst PL/EN.

## Format findingów

Tabela + werdykt cząstkowy:

```
| plik:linia | finding | severity | sugestia |
```

Po tabeli **jedno zdanie**: `go` / `no-go` z uzasadnieniem. Jeden blocker = `no-go`.
**Werdykt końcowy należy do orchestratora (Opus)** — Ty dostarczasz materiał, nie decyzję merge.

## NIE

- **Nie edytuj plików** — przegląd jest read-only (`git diff`/`git show`, nie patch).
- **Nie przepuszczaj naruszenia bramki jako minor** — auto-blocker to blocker z definicji.
- **Nie wymyślaj kryteriów** — pracuj na realnym spec/AC i realnym diffie; brak spec = wskaż brak, nie zgaduj intencję.
