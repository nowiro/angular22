---
type: doc
id: 'doc.tech-stack'
title: 'Stack canon — angular22'
---

# Tech stack — angular22

**Stack canon** for the angular22 project · **single source of truth**. Every version here comes
**exactly** from [`package.json`](../package.json) (`engines` · `packageManager` · `dependencies` ·
`devDependencies`) — nothing is guessed, nothing is duplicated.

The **Stack** sections in [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) and
[`README.md`](../README.md) **point HERE** (DRY — they don't duplicate versions). Every stack change
goes through **SDD** (verb `deps` / `chore`) and updates **this file + `package.json` together
(one commit)**; consistency is enforced by the **`stack-guardian`** agent
([`.github/agents/stack-guardian.agent.md`](../.github/agents/stack-guardian.agent.md)).

Motto: **outcome over process**. The stack is deliberately narrow — one technology per role, the rest
**off-stack** (see [Banned](#allowed--banned-off-stack)).

## Layers and pinned versions

All production versions are pinned **exact** (no `^`/`~`) — `^` exceptions are dev/CLI tools
(marked). Source: `package.json`.

| Layer                 | Technology                                                                                                                                    | Version                                                                                                                                                                                                      | Notes                                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime**           | Node.js                                                                                                                                       | `>=24.15.0`                                                                                                                                                                                                  | `engines.node`; `.nvmrc` pins `24.16.0` (local dev version)                                                                                                                                  |
| **Runtime**           | pnpm                                                                                                                                          | `11.6.0`                                                                                                                                                                                                     | `packageManager` (Corepack pin) · `engines.pnpm` `>=11.0.0`; the **only** manager — `preinstall: npx only-allow pnpm`                                                                        |
| **Framework**         | `@angular/core` · `common` · `compiler` · `forms` · `router` · `platform-browser` · `elements`                                                | `22.0.1`                                                                                                                                                                                                     | **all the same version**; zoneless, standalone, signals; `@angular/elements` = web components for the portal                                                                                 |
| **UI**                | `@angular/material`                                                                                                                           | `22.0.1`                                                                                                                                                                                                     | = Angular version (`= @angular/cdk` = `@angular/core`); consumed **only** via the `@angular22/ui-material` wrappers; theming **exclusively** `--mat-sys-*` + `mat.theme()`                   |
| **UI / CDK**          | `@angular/cdk`                                                                                                                                | `22.0.1`                                                                                                                                                                                                     | as above; raw import allowed **only** in `libs/ui/material` (lint error everywhere else)                                                                                                     |
| **Workspace / build** | `nx` + `@nx/angular` · `devkit` · `eslint` · `eslint-plugin` · `js` · `playwright` · `vitest` · `web` · `workspace`                           | `22.7.5`                                                                                                                                                                                                     | **all `@nx/*` = `nx`**; cache + module boundaries + inference plugins                                                                                                                        |
| **Build**             | `@angular/build` (application builder) · `@angular/cli`                                                                                       | `22.0.1`                                                                                                                                                                                                     | esbuild-based application builder (not webpack); `build-element` per wizard                                                                                                                  |
| **Build**             | `@angular-devkit/core` · `@angular-devkit/schematics` · `@schematics/angular` · `@angular/compiler-cli` · `@angular/language-service`         | `22.0.1`                                                                                                                                                                                                     | = Angular version (devkit/schematics coupled to the framework)                                                                                                                               |
| **Language**          | `typescript`                                                                                                                                  | `6.0.3`                                                                                                                                                                                                      | `strict`; type-aware lint (Project Service)                                                                                                                                                  |
| **Reactivity**        | signals (core) + RxJS                                                                                                                         | `rxjs` `7.8.2` · `tslib` `2.8.1`                                                                                                                                                                             | signals = default state model; RxJS interop only where necessary                                                                                                                             |
| **Forms**             | **Signal Forms** — `@angular/forms/signals`                                                                                                   | `22.0.1` (`@angular/forms`)                                                                                                                                                                                  | `form()` / `schema()` / `[formField]`; **banned** `FormGroup` / `FormBuilder` / `ngModel` (lint-enforced ≥ 22)                                                                               |
| **Tests (unit)**      | `vitest` + `@vitest/coverage-v8` + `@nx/vitest`                                                                                               | `vitest` `4.1.8` · coverage `4.1.8` · `@nx/vitest` `22.7.5`                                                                                                                                                  | runner `@nx/vitest:test`; `vite` `8.0.16`, `jsdom` `29.1.1`                                                                                                                                  |
| **Tests (e2e)**       | `@playwright/test` + `@nx/playwright`                                                                                                         | `1.60.0` · `@nx/playwright` `22.7.5`                                                                                                                                                                         | runner `@nx/playwright:playwright`; chromium; debug via MCP `playwright`                                                                                                                     |
| **Lint**              | `eslint` (flat) + `@eslint/js` + `typescript-eslint` + `angular-eslint`                                                                       | `eslint` `10.5.0` · `@eslint/js` `10.0.1` · `typescript-eslint` `8.61.0` · `angular-eslint` `22.0.0`                                                                                                         | flat config (`eslint.config.mjs`); type-aware; `angular-eslint` major = Angular major                                                                                                        |
| **Lint (plugins)**    | `sonarjs` · `unicorn` · `import-x` · `jsdoc` · `no-barrel-files` · `n` · `rxjs-x` · `rxjs-angular-x` · `@vitest/eslint-plugin` · `playwright` | sonarjs `4.0.3` · unicorn `65.0.1` · import-x `4.16.2` · jsdoc `63.0.2` · no-barrel-files `^1.3.1` · n `^18.1.0` · rxjs-x `^1.0.2` · rxjs-angular-x `^1.0.1` · vitest-plugin `^1.6.20` · playwright `2.10.4` | set from `eslint.config.mjs`; `@typescript-eslint/utils` `8.61.0`, `globals` `17.6.0`                                                                                                        |
| **Format**            | `prettier` + `@trivago/prettier-plugin-sort-imports` + `eslint-config-prettier`                                                               | prettier `3.8.4` · sort-imports `6.0.2` · config-prettier `10.1.8`                                                                                                                                           | import sorting delegated to Prettier (`import/order: off`)                                                                                                                                   |
| **i18n**              | custom `@angular22/shared-i18n`                                                                                                               | (internal lib)                                                                                                                                                                                               | signal-based runtime i18n; pipe `a22T`; PL = key, EN in maps; **no** external i18n library                                                                                                   |
| **Auth / RBAC**       | `keycloak-angular` · `keycloak-js`                                                                                                            | keycloak-angular `21.0.0` · keycloak-js `26.2.4`                                                                                                                                                             | RBAC in `@angular22/shared-auth`; demo = **mock** (no server), real IdP via `provideKeycloak`; admin/user/guest roles; peer `^21` on Angular 22 tolerated (`strict-peer-dependencies=false`) |
| **Tooling**           | `husky` · `jiti` · `npm-check-updates` · `@types/node`                                                                                        | husky `^9.1.7` · jiti `2.7.0` · ncu `^22.2.3` · `@types/node` `25.9.3`                                                                                                                                       | husky = git hooks (`prepare`); ncu = `pnpm deps:check` / `deps:update`                                                                                                                       |

## Version consistency rules

Enforced by `stack-guardian` (and manually on every `deps`/`chore`):

- **Angular as a block** — all `@angular/*` + `@angular-devkit/*` + `@schematics/angular` =
  **the same version** (`22.0.1`). An Angular update bumps the whole block atomically.
- **Material = CDK = core** — `@angular/material` = `@angular/cdk` = `@angular/core`. Material
  never gets ahead of or behind the core.
- **Nx as a block** — all `@nx/*` = `nx` (`22.7.5`). No Nx plugin lags in version.
- **angular-eslint ↔ Angular** — `angular-eslint` major = Angular major (`22` ↔ `22`).
- **TypeScript ↔ typescript-eslint** — TS bumped together with `typescript-eslint`/`@typescript-eslint/utils`
  (type-aware parser compatibility).
- **keycloak-angular ↔ Angular** — keycloak-angular `21.x` is deliberately **one major behind**
  Angular (no 22 release in the registry); peer `^21` tolerated via `strict-peer-dependencies=false`; the demo
  runs in **mock** mode (no server), so the peer mismatch is harmless.
- **Exact pins** — runtime + framework + UI + Nx + tests pinned **exact**; `^` only for
  dev tools that don't affect the build artifact.

## Allowed / BANNED (off-stack)

The stack is **closed**. The following are **banned** — they must not be added (lint / review /
`stack-guardian` will catch them). Every ban has a canonical **on-stack** replacement:

| Banned (off-stack)                              | Reason                                              | Replacement (on-stack)                                                |
| ----------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `zone.js`                                       | the app is **zoneless**                             | signals + `provideZonelessChangeDetection`                            |
| `npm` · `yarn`                                  | pnpm only (`preinstall: only-allow pnpm`)           | **pnpm**                                                              |
| Jest · Karma · Jasmine · Cypress                | one unit runner + one e2e                           | **Vitest** (unit) + **Playwright** (e2e)                              |
| webpack                                         | esbuild-based builder                               | **`@angular/build`** application builder                              |
| Tailwind · Bootstrap · other CSS frameworks     | one theming system                                  | **`--mat-sys-*`** + `mat.theme()` + `@angular22/ui-material` wrappers |
| ngrx · ngxs · akita · other store libs          | state is kept in signals                            | **signals** + (when needed) a signal store                            |
| `FormGroup` · `FormBuilder` · `ngModel`         | reactive/template replaced · **lint-enforced ≥ 22** | **Signal Forms** (`@angular/forms/signals`)                           |
| ngx-translate · transloco · `@angular/localize` | i18n is in-house, runtime, signal-based             | **`@angular22/shared-i18n`** + pipe `a22T`                            |
| `axios` · other HTTP clients                    | native API / `HttpClient`                           | **`fetch`** / `@angular/common/http`                                  |
| `lodash` · `moment` · `date-fns`                | no heavy utility libs                               | **native JS** + `Date`                                                |
| other UI / component libraries                  | the only UI source is Material via wrappers         | **`@angular22/ui-material`**                                          |

Raw `@angular/material` / `@angular/cdk` outside `libs/ui/material` = **lint error**
(`no-restricted-imports` in `eslint.config.mjs`).

Importing bare `@angular/forms` (classic `FormGroup`/`FormBuilder`/`ngModel`) or the
`@angular/forms/signals/compat` bridge = **lint error** (`no-restricted-syntax` in `eslint.config.mjs`,
enforced by `nx lint`) — it catches static import, re-export, dynamic `import()`, and
`import = require()`. The gate is **versioned**: active from Angular ≥ 22 (major from the
installed `@angular/core`, falling back to `package.json`), disabled on older majors,
so classic forms stay supported during migration. Only pure
`@angular/forms/signals` is allowed.

## Stack change process

A stack change (new dependency, major bump, technology swap) is **never** ad-hoc:

1. **Need + justification** — why the stack doesn't cover the case; why an on-stack replacement
   isn't enough.
2. **SDD** — ladder `pnpm workflow:specify -- --verb=deps` (or `--verb=chore`); spec → plan →
   `/analyze` (canon: [`docs/sdd/methodology.md`](sdd/methodology.md)).
3. **Update together** — `docs/tech-stack.md` **and** `package.json` in **one commit**
   (exact version + entry in the right layer/table above). On a block bump — the whole block.
4. **`stack-guardian`** verifies consistency: version consistency rules + no off-stack + table ==
   `package.json` ([`.github/agents/stack-guardian.agent.md`](../.github/agents/stack-guardian.agent.md)).
5. **`pnpm verify`** green (full gate; composition → [`AGENTS.md`](../AGENTS.md#commands)) +
   a dated run-log in `docs/runs/`.

A table ↔ `package.json` drift = **bug** (DoD not met). This file is the canon — on a
conflict `package.json` wins, and the file is realigned immediately.
