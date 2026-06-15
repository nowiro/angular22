---
name: nx-generators
description: Scaffolding in angular22 — components/libs exclusively via nx g (@nx/angular), repo defaults, scope/type tags, Nx executor map, vitest wiring for a new lib. Use when creating a component, lib, or target.
---

# Nx generators and executors — repo recipe

## Component (NEVER by hand)

```bash
pnpm nx g @nx/angular:component <name> --directory=<project>/src/lib/<name>
```

Defaults from `nx.json`: SCSS · OnPush · `displayBlock` · prefix `a22` · **three files**
(`.ts`/`.html`/`.scss`). After generating: export in the lib's `src/index.ts`; class with the
`Component` suffix (lint). Unsure about flags → MCP `nx` (`nx_generators`), not guessing.

## Lib

```bash
pnpm nx g @nx/angular:library --directory=libs/<scope>/<name> --name=<name> \
  --importPath=@angular22/<name> --tags=scope:<scope>,type:<type>
```

Tags: `scope:shared|<feature-a>|<feature-b>|<host>` ×
`type:feature|ui|data-access|util`. Boundaries: `app → feature → ui/data-access → util`;
sibling domains can't see each other; `scope:shared` is visible to all.

## Executor map (everything via Nx)

| target    | executor                            | notes                                           |
| --------- | ----------------------------------- | ----------------------------------------------- |
| build     | `@angular/build:application`        | apps; budgets in project.json                   |
| serve     | `@angular/build:dev-server`         | ports: `4200` host app, `4201`/`4202`/… per app |
| lint      | `@nx/eslint:lint` (inferred plugin) | flat config root                                |
| test      | `@nx/vitest:test`                   | `options.configFile` = per-lib vitest.config.ts |
| e2e       | `@nx/playwright:playwright`         | `options.config` = per-app playwright.config.ts |
| typecheck | `nx:run-commands` (tsc --noEmit)    | no dedicated executor — deliberately            |

## Test wiring for a NEW lib (unitTestRunner=none in defaults)

1. `vitest.config.ts` (environment `node`, `resolve.alias` for the `@angular22/*` you use),
2. `tsconfig.spec.json` with **`"exclude": []`** (base excludes `**/*.spec.ts`!) + a reference
   in `tsconfig.json`,
3. `test` target = `@nx/vitest:test` in `project.json`,
4. specs importing Angular barrels → `test-setup.ts` with `import '@angular/compiler'`.

1:1 pattern: copy an existing `libs/<scope>/<name>` that already has a `vitest.config.ts`.

## Running

`pnpm nx run <project>:<target>` · `pnpm nx affected -t lint test build` ·
`pnpm e2e` (= `run-many -t e2e --parallel=1` — suites spin up their own dev-servers).
