---
name: angular-new-app
description: Stand up a new app in angular22 by CLONING the apps/base starter (header-only, full provideAppPlatform spine) — copy apps/base + apps/base-e2e, then swap name / scope tag / port / i18n map / branding / depConstraint. NOT `nx g @nx/angular:application`, never `ng new`. Use when setting up a new application in the monorepo.
---

# New Angular application — clone the `base` template

A new app is a **copy of [`apps/base`](../../../apps/base)** (the header-only starter app), NOT
`nx g @nx/angular:application` and **never** `ng new`. `base` is the canonical scaffold — cloning it
keeps every convention right on the first try: standalone · zoneless · OnPush · prefix `a22` · the
shared `provideAppPlatform` spine · `@angular22/ui-material` wrappers · Signal Forms · `a22T` i18n ·
prod budgets · a Playwright e2e. Components/libs still use `pnpm nx g` →
[`nx-generators`](../nx-generators/SKILL.md).

## What `base` already wires (don't re-add)

`app.config.ts` calls **`provideAppPlatform({ routes, translations })`** (→ `@angular22/app-platform`):
global error listeners + handler, runtime feature flags (`config.json` loaded before bootstrap), mock
auth, router (`withComponentInputBinding`), EN translations. Zoneless is by construction (no zone.js
in polyfills) — do **not** add `provideZonelessChangeDetection()`. The root renders only an
`a22-toolbar` header (brand + `a22-language-switcher`) over a `<router-outlet>`.

## Clone + adapt (the recipe)

1. **Copy** `apps/base` → `apps/<name>` and `apps/base-e2e` → `apps/<name>-e2e`.
2. **`project.json`** (both): rename `base`/`base-e2e` → `<name>`/`<name>-e2e`; retag
   `scope:base` → `scope:<scope>`; update `sourceRoot`, `outputPath`, `tsConfig`/`config` paths and
   `implicitDependencies`; set the **next free serve port** (`4204`, …) in `serve` + `serve-static`.
3. **i18n**: rename `base-translations.en.ts` → `<name>-translations.en.ts`, `BASE_EN` → `<SCOPE>_EN`;
   fix the import in `app.config.ts`; add your PL→EN entries.
4. **Branding**: `<title>` in `index.html`, the brand literal in `app.component.html`, its EN entry.
5. **Boundaries**: add a `scope:<scope>` entry to `depConstraints` in the root
   [`eslint.config.mjs`](../../../eslint.config.mjs) (mirror `scope:base` →
   `onlyDependOnLibsWithTags: ['scope:shared', 'scope:<scope>']`).
6. **e2e**: in `apps/<name>-e2e/playwright.config.ts` set the `baseURL` port + `pnpm exec nx run
<name>:serve`; adapt the smoke spec.
7. **Pages**: add lazy `loadComponent` routes in `app.routes.ts` (base ships an empty `Routes`).
8. Optional: a `start:<name>` script in `package.json`.

Verify the clone: `pnpm nx build <name>` · `lint` · `typecheck` · `pnpm nx run <name>-e2e:e2e`. If
Nx doesn't see the new project, `pnpm nx reset` once.

## Embeddable app (when it must mount as a web component)

`base` is a **standalone** app (no `element.ts`). To also ship it embedded via `@angular/elements`,
add `src/element.ts` (`createApplication` → `createCustomElement` →
`customElements.define('a22-<name>-element', …)`, **no router/feature-flags**) + a `build-element`
target (`index:false`, `polyfills:[]`, own budgets → `dist/elements/<name>/main.js`), loaded
same-origin by `ElementLoader`. Pattern: the wizard apps +
[`web-components`](../../agents/web-components.agent.md); security →
[`security-guidance`](../security-guidance/SKILL.md).

## DON'T

- **NO** `nx g @nx/angular:application` / `ng new` — clone `apps/base` (the canonical scaffold).
- Do NOT leave `base` / `scope:base` / `BASE_EN` / port `4203` behind after the copy.
- Do NOT skip the `scope:<scope>` `depConstraint`, or duplicate a serve port.
- Do NOT bypass the `@angular22/ui-material` wrappers or Signal Forms in a new app
  ([material-wrappers](../material-wrappers/SKILL.md), [signal-forms](../signal-forms/SKILL.md)).
