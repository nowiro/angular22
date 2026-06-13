---
type: doc
id: 'doc.tech-stack'
title: 'Kanon stacku — angular22'
---

# Tech stack — angular22

**Kanon stacku** projektu angular22 · **single source of truth**. Wszystkie wersje tu pochodzą
**dokładnie** z [`package.json`](../package.json) (`engines` · `packageManager` · `dependencies` ·
`devDependencies`) — nic nie zgadujemy, nic nie powielamy.

Sekcje **Stack** w [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) i
[`README.md`](../README.md) **wskazują TUTAJ** (DRY — nie duplikują wersji). Każda zmiana stacku
idzie przez **SDD** (verb `deps` / `chore`) i aktualizuje **ten plik + `package.json` razem
(jeden commit)**; zgodność pilnuje agent **`stack-guardian`**
([`.github/agents/stack-guardian.agent.md`](../.github/agents/stack-guardian.agent.md)).

Motto: **wynik ponad proces**. Stack jest celowo wąski — jedna technologia na rolę, reszta
**off-stack** (patrz [Zakazane](#dozwolone--zakazane-off-stack)).

## Warstwy i pinowane wersje

Wszystkie wersje produkcyjnie pinowane **exact** (bez `^`/`~`) — wyjątki z `^` to narzędzia
dev/CLI (oznaczone). Źródło: `package.json`.

| Warstwa               | Technologia                                                                                                                                   | Wersja                                                                                                                                                                                                       | Uwagi                                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime**           | Node.js                                                                                                                                       | `>=24.15.0`                                                                                                                                                                                                  | `engines.node`; `.nvmrc` pinuje `24.16.0` (lokalna wersja deweloperska)                                                                                                                           |
| **Runtime**           | pnpm                                                                                                                                          | `11.6.0`                                                                                                                                                                                                     | `packageManager` (Corepack pin) · `engines.pnpm` `>=11.0.0`; **jedyny** menedżer — `preinstall: npx only-allow pnpm`                                                                              |
| **Framework**         | `@angular/core` · `common` · `compiler` · `forms` · `router` · `platform-browser` · `elements`                                                | `22.0.1`                                                                                                                                                                                                     | **wszystkie ta sama wersja**; zoneless, standalone, signals; `@angular/elements` = web components dla portalu                                                                                     |
| **UI**                | `@angular/material`                                                                                                                           | `22.0.1`                                                                                                                                                                                                     | = wersja Angulara (`= @angular/cdk` = `@angular/core`); konsumpcja **tylko** przez wrappery `@angular22/ui-material`; theming **wyłącznie** `--mat-sys-*` + `mat.theme()`                         |
| **UI / CDK**          | `@angular/cdk`                                                                                                                                | `22.0.1`                                                                                                                                                                                                     | jw.; raw import dozwolony **tylko** w `libs/ui/material` (lint error wszędzie indziej)                                                                                                            |
| **Workspace / build** | `nx` + `@nx/angular` · `devkit` · `eslint` · `eslint-plugin` · `js` · `playwright` · `vitest` · `web` · `workspace`                           | `22.7.5`                                                                                                                                                                                                     | **wszystkie `@nx/*` = `nx`**; cache + module boundaries + inference plugins                                                                                                                       |
| **Build**             | `@angular/build` (application builder) · `@angular/cli`                                                                                       | `22.0.1`                                                                                                                                                                                                     | esbuild-based application builder (nie webpack); `build-element` per wizard                                                                                                                       |
| **Build**             | `@angular-devkit/core` · `@angular-devkit/schematics` · `@schematics/angular` · `@angular/compiler-cli` · `@angular/language-service`         | `22.0.1`                                                                                                                                                                                                     | = wersja Angulara (devkit/schematics sprzężone z frameworkiem)                                                                                                                                    |
| **Język**             | `typescript`                                                                                                                                  | `6.0.3`                                                                                                                                                                                                      | `strict`; type-aware lint (Project Service)                                                                                                                                                       |
| **Reaktywność**       | signals (core) + RxJS                                                                                                                         | `rxjs` `7.8.2` · `tslib` `2.8.1`                                                                                                                                                                             | signals = domyślny model stanu; RxJS interop tylko gdzie konieczny                                                                                                                                |
| **Formularze**        | **Signal Forms** — `@angular/forms/signals`                                                                                                   | `22.0.1` (`@angular/forms`)                                                                                                                                                                                  | `form()` / `schema()` / `[formField]`; **zakaz** `FormGroup` / `FormBuilder` / `ngModel`                                                                                                          |
| **Testy (unit)**      | `vitest` + `@vitest/coverage-v8` + `@nx/vitest`                                                                                               | `vitest` `4.1.8` · coverage `4.1.8` · `@nx/vitest` `22.7.5`                                                                                                                                                  | runner `@nx/vitest:test`; `vite` `8.0.16`, `jsdom` `29.1.1`                                                                                                                                       |
| **Testy (e2e)**       | `@playwright/test` + `@nx/playwright`                                                                                                         | `1.60.0` · `@nx/playwright` `22.7.5`                                                                                                                                                                         | runner `@nx/playwright:playwright`; chromium; debug przez MCP `playwright`                                                                                                                        |
| **Lint**              | `eslint` (flat) + `@eslint/js` + `typescript-eslint` + `angular-eslint`                                                                       | `eslint` `10.4.1` · `@eslint/js` `10.0.1` · `typescript-eslint` `8.61.0` · `angular-eslint` `22.0.0`                                                                                                         | flat config (`eslint.config.mjs`); type-aware; `angular-eslint` major = Angular major                                                                                                             |
| **Lint (pluginy)**    | `sonarjs` · `unicorn` · `import-x` · `jsdoc` · `no-barrel-files` · `n` · `rxjs-x` · `rxjs-angular-x` · `@vitest/eslint-plugin` · `playwright` | sonarjs `4.0.3` · unicorn `65.0.1` · import-x `4.16.2` · jsdoc `63.0.2` · no-barrel-files `^1.3.1` · n `^18.1.0` · rxjs-x `^1.0.2` · rxjs-angular-x `^1.0.1` · vitest-plugin `^1.6.20` · playwright `2.10.4` | zestaw z `eslint.config.mjs`; `@typescript-eslint/utils` `8.61.0`, `globals` `17.6.0`                                                                                                             |
| **Format**            | `prettier` + `@trivago/prettier-plugin-sort-imports` + `eslint-config-prettier`                                                               | prettier `3.8.4` · sort-imports `6.0.2` · config-prettier `10.1.8`                                                                                                                                           | sortowanie importów delegowane do Prettiera (`import/order: off`)                                                                                                                                 |
| **i18n**              | custom `@angular22/shared-i18n`                                                                                                               | (lib wewnętrzna)                                                                                                                                                                                             | signal-based runtime i18n; pipe `a22T`; PL = klucz, EN w mapach; **bez** zewnętrznej biblioteki i18n                                                                                              |
| **Auth / RBAC**       | `keycloak-angular` · `keycloak-js`                                                                                                            | keycloak-angular `21.0.0` · keycloak-js `26.2.4`                                                                                                                                                             | RBAC w `@angular22/shared-auth`; demo = **mock** (bez serwera), realny IdP przez `provideKeycloak`; role admin/user/guest; peer `^21` na Angular 22 tolerowany (`strict-peer-dependencies=false`) |
| **Tooling**           | `husky` · `jiti` · `npm-check-updates` · `@types/node`                                                                                        | husky `^9.1.7` · jiti `2.7.0` · ncu `^22.2.3` · `@types/node` `25.9.3`                                                                                                                                       | husky = git hooks (`prepare`); ncu = `pnpm deps:check` / `deps:update`                                                                                                                            |

## Reguły spójności wersji

Egzekwowane przez `stack-guardian` (i ręcznie przy każdym `deps`/`chore`):

- **Angular jako blok** — wszystkie `@angular/*` + `@angular-devkit/*` + `@schematics/angular` =
  **ta sama wersja** (`22.0.1`). Aktualizacja Angulara aktualizuje cały blok atomowo.
- **Material = CDK = core** — `@angular/material` = `@angular/cdk` = `@angular/core`. Material
  nigdy nie wyprzedza ani nie zostaje za rdzeniem.
- **Nx jako blok** — wszystkie `@nx/*` = `nx` (`22.7.5`). Żaden plugin Nx nie odstaje wersją.
- **angular-eslint ↔ Angular** — major `angular-eslint` = major Angulara (`22` ↔ `22`).
- **TypeScript ↔ typescript-eslint** — TS bumpowany razem z `typescript-eslint`/`@typescript-eslint/utils`
  (kompatybilność parsera type-aware).
- **keycloak-angular ↔ Angular** — keycloak-angular `21.x` celowo **o major za** Angularem (brak
  releasu na 22 w rejestrze); peer `^21` tolerowany przez `strict-peer-dependencies=false`; demo
  działa w trybie **mock** (bez serwera), więc niezgodność peera jest nieszkodliwa.
- **Exact pins** — runtime + framework + UI + Nx + testy pinowane **exact**; `^` tylko dla
  narzędzi dev nie wpływających na build artefaktu.

## Dozwolone / ZAKAZANE (off-stack)

Stack jest **zamknięty**. Poniższe są **banned** — nie wolno ich dodawać (lint / review /
`stack-guardian` to wyłapią). Każdy zakaz ma kanoniczny zamiennik **na stacku**:

| Zakazane (off-stack)                            | Powód                                       | Zamiennik (na stacku)                                                 |
| ----------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------- |
| `zone.js`                                       | aplikacja jest **zoneless**                 | signals + `provideZonelessChangeDetection`                            |
| `npm` · `yarn`                                  | tylko pnpm (`preinstall: only-allow pnpm`)  | **pnpm**                                                              |
| Jest · Karma · Jasmine · Cypress                | jeden runner unit + jeden e2e               | **Vitest** (unit) + **Playwright** (e2e)                              |
| webpack                                         | builder oparty na esbuild                   | **`@angular/build`** application builder                              |
| Tailwind · Bootstrap · inne CSS-frameworki      | jeden system theming                        | **`--mat-sys-*`** + `mat.theme()` + wrappery `@angular22/ui-material` |
| ngrx · ngxs · akita · inne store libs           | stan trzymamy w signals                     | **signals** + (gdy trzeba) sygnałowy store                            |
| `FormGroup` · `FormBuilder` · `ngModel`         | reactive/template forms zastąpione          | **Signal Forms** (`@angular/forms/signals`)                           |
| ngx-translate · transloco · `@angular/localize` | i18n jest własne, runtime, signal-based     | **`@angular22/shared-i18n`** + pipe `a22T`                            |
| `axios` · inne klienty HTTP                     | natywne API / `HttpClient`                  | **`fetch`** / `@angular/common/http`                                  |
| `lodash` · `moment` · `date-fns`                | bez ciężkich utility libs                   | **native JS** + `Date`                                                |
| inne biblioteki UI / komponentów                | jedyne źródło UI to Material przez wrappery | **`@angular22/ui-material`**                                          |

Raw `@angular/material` / `@angular/cdk` poza `libs/ui/material` = **lint error**
(`no-restricted-imports` w `eslint.config.mjs`).

## Proces zmiany stacku

Zmiana stacku (nowa zależność, bump majora, wymiana technologii) **nigdy** ad-hoc:

1. **Potrzeba + uzasadnienie** — dlaczego stack nie pokrywa przypadku; czemu zamiennik na stacku
   nie wystarcza.
2. **SDD** — drabina `pnpm workflow:specify -- --verb=deps` (lub `--verb=chore`); spec → plan →
   `/analyze` (kanon: [`docs/sdd/methodology.md`](sdd/methodology.md)).
3. **Aktualizacja razem** — `docs/tech-stack.md` **i** `package.json` w **jednym commicie**
   (wersja exact + wpis w odpowiedniej warstwie/tabeli powyżej). Przy bumpie bloku — cały blok.
4. **`stack-guardian`** weryfikuje zgodność: reguły spójności wersji + brak off-stack + tabela ==
   `package.json` ([`.github/agents/stack-guardian.agent.md`](../.github/agents/stack-guardian.agent.md)).
5. **`pnpm verify`** zielone (pełna bramka; skład → [`AGENTS.md`](../AGENTS.md#komendy)) +
   datowany run-log w `docs/runs/`.

Rozjazd tabela ↔ `package.json` = **bug** (DoD nie spełnione). Ten plik jest kanonem — przy
sprzeczności wygrywa `package.json`, a plik natychmiast się wyrównuje.
