# base — starter application

The workspace's **template app**: a minimal Angular 22 application that renders
**only a header** (brand + language switcher) over an empty router outlet, wired
to the shared bootstrap spine (`provideAppPlatform`: global error handling,
runtime feature flags, mock auth, router, i18n). Copy it to stand up a new app
fast instead of hand-wiring the plumbing.

- Serve: `pnpm nx serve base` → http://localhost:4203
- Build: `pnpm nx build base` · Lint/typecheck: `pnpm nx run base:lint` / `:typecheck`
- E2e: `pnpm nx run base-e2e:e2e`

## Scaffold a new app from this template

1. **Copy** `apps/base` → `apps/<app>` and `apps/base-e2e` → `apps/<app>-e2e`.
2. **`project.json`** (both): rename `base`/`base-e2e` → `<app>`/`<app>-e2e`; retag
   `scope:base` → `scope:<app>`; update `sourceRoot`, `outputPath`,
   `tsConfig`/`config` paths and `implicitDependencies`; pick the next free serve
   port (`4204`, …) in `serve` + `serve-static`.
3. **i18n**: rename `base-translations.en.ts` → `<app>-translations.en.ts`,
   `BASE_EN` → `<APP>_EN`; update the import in `app.config.ts`.
4. **Branding**: set `<title>` in `index.html`, the brand literal in
   `app.component.html`, and its EN entry in the translation map.
5. **Boundaries**: add a `scope:<app>` entry to `depConstraints` in the root
   `eslint.config.mjs` (mirror the `scope:base` one →
   `onlyDependOnLibsWithTags: ['scope:shared', 'scope:<app>']`).
6. **E2e**: in `apps/<app>-e2e/playwright.config.ts` set the `baseURL` port and
   `pnpm exec nx run <app>:serve`.
7. Verify: `pnpm nx build <app>` · `pnpm nx run <app>-e2e:e2e` · `pnpm lint`.

Conventions stay the same as the rest of the monorepo: standalone + zoneless +
OnPush + signals, Material **only** via `@angular22/ui-material` wrappers, Signal
Forms only, UI text through the `a22T` pipe (PL = key, EN in the map).
