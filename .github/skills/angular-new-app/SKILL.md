---
name: angular-new-app
description: Bootstrap a new app in angular22 — via nx g @nx/angular:application (not ng new): standalone+zoneless, providers (router, feature flags from config.json, i18n), embedding @angular/elements, budgets/port in project.json, scope/type tags. Use when setting up a new application in the monorepo.
---

# New Angular application — repo recipe

App = **`@nx/angular:application`**, NEVER `ng new`. Components/libs/test wiring →
[`nx-generators`](../nx-generators/SKILL.md). Here: only the app bootstrap.

## Generating

```bash
pnpm nx g @nx/angular:application --directory=apps/<name> --name=<name> \
  --prefix=a22 --tags=scope:<scope>,type:app
```

Defaults from `nx.json`: **standalone · zoneless · SCSS · OnPush · prefix `a22`**. `--directory`
= the app path (`apps/<name>`); `type:app` always, `scope:` from the map ([nx-generators](../nx-generators/SKILL.md)).
Unsure about flags → MCP `nx` (`nx_generators`), not guessing.

## Structure (the portal/wizard shape)

| file                    | role                                                                       |
| ----------------------- | -------------------------------------------------------------------------- |
| `src/main.ts`           | `bootstrapApplication(AppComponent, appConfig)` + `.catch` (the only sink) |
| `src/app/app.config.ts` | `ApplicationConfig` — all providers                                        |
| `src/app/app.routes.ts` | `Routes` (lazy `loadComponent`, guards)                                    |
| `src/element.ts`        | ONLY when the app is an embeddable web-component (see below)               |

## Providers (canon — copy from `apps/portal/src/app/app.config.ts`)

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideA22GlobalErrorHandler(), // @angular22/ui-feedback
  provideFeatureFlags(), // @angular22/shared-config — loads config.json BEFORE bootstrap
  provideRouter(appRoutes, withComponentInputBinding()),
  provideEnTranslations(<APP>_EN), // @angular22/shared-i18n
];
```

**Zoneless = by construction** — no zone.js in polyfills (Angular 22 default). Do NOT add a
manual `provideZonelessChangeDetection()`. `provideFeatureFlags()` reads `config.json` before
the first render, so tiles and guards see the flags from the start.

## Embedding @angular/elements (when the app is to be embedded in the portal)

A separate entry `src/element.ts`: `createApplication({ providers })` → `createCustomElement(Cmp, { injector })`
→ `customElements.define('a22-<name>-element', …)`. **No router and no feature-flags** — the host
(portal) holds the URL and gating (pattern: `apps/demo-individual-wizard/src/element.ts`). The bundle is
built by the `build-element` target (separate budgets, `index:false`, `polyfills:[]`) → `dist/elements/<name>/main.js`,
loaded same-origin by `ElementLoader` (`isSameOriginScriptPath` in `libs/shared/config`).
Embedding security (CSP, same-origin, sinks) → [`security-guidance`](../security-guidance/SKILL.md).

## project.json (executors + port)

`build`/`serve` = `@angular/build:application` / `:dev-server` ([executor map](../nx-generators/SKILL.md)).
Prod budgets: `initial` 1.5mb/2.5mb · `anyComponentStyle` 4kb/8kb (an embeddable app: `build-element`
has its own, looser ones). **Serve port = first free** after 4200 (portal) · 4201 (individual) ·
4202 (business) → **`4203`**; do NOT duplicate.

## i18n + config.json (briefly)

PL = the source language and the key (`{{ 'Polski tekst' | a22T }}`); EN is provided by the app via
`provideEnTranslations(<APP>_EN)`. `config.json` in `apps/<name>/public/` — **public,
same-origin, per-environment** (enable/disable without a rebuild); shape = `AppConfig`/`FeatureConfig`
from `@angular22/shared-config`.

## DON'T

- **NO** `ng new` / `ng generate` — exclusively `nx g @nx/angular:application`.
- Do NOT skip the `scope:<scope>,type:app` tags.
- Do NOT duplicate serve ports (4200/4201/4202 taken → 4203…).
- Do NOT put secrets in `config.json` (public, same-origin); don't load cross-origin element scripts.
- Do NOT bypass the `@angular22/ui-material` wrappers or Signal Forms in a new app ([material-wrappers], [signal-forms]).
