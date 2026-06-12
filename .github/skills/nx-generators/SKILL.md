---
name: nx-generators
description: Scaffolding w angular22 — komponenty/liby wyłącznie przez nx g (@nx/angular), defaults repo, tagi scope/type, mapa executorów Nx, wiring vitest dla nowego liba. Użyj przy tworzeniu komponentu, liba lub targetu.
---

# Generatory i executory Nx — przepis repo

## Komponent (NIGDY ręcznie)

```bash
pnpm nx g @nx/angular:component <name> --directory=<projekt>/src/lib/<name>
```

Defaults z `nx.json`: SCSS · OnPush · `displayBlock` · prefix `a22` · **trzy pliki**
(`.ts`/`.html`/`.scss`). Po wygenerowaniu: eksport w `src/index.ts` liba; klasa z sufiksem
`Component` (lint). Niepewne flagi → MCP `nx` (`nx_generators`), nie zgadywanie.

## Lib

```bash
pnpm nx g @nx/angular:library --directory=libs/<scope>/<name> --name=<name> \
  --importPath=@angular22/<name> --tags=scope:<scope>,type:<type>
```

Tagi: `scope:shared|individual-wizard|business-wizard|landing` ×
`type:feature|ui|data-access|util`. Granice: `app → feature → ui/data-access → util`;
wizardy nie widzą się nawzajem; `scope:shared` widoczny dla wszystkich.

## Mapa executorów (wszystko przez Nx)

| target    | executor                            | uwagi                                                |
| --------- | ----------------------------------- | ---------------------------------------------------- |
| build     | `@angular/build:application`        | apki; budżety w project.json                         |
| serve     | `@angular/build:dev-server`         | porty: 4200 portal · 4201 individual · 4202 business |
| lint      | `@nx/eslint:lint` (inferred plugin) | flat config root                                     |
| test      | `@nx/vitest:test`                   | `options.configFile` = per-lib vitest.config.ts      |
| e2e       | `@nx/playwright:playwright`         | `options.config` = per-app playwright.config.ts      |
| typecheck | `nx:run-commands` (tsc --noEmit)    | brak dedykowanego executora — świadomie              |

## Wiring testów dla NOWEGO liba (unitTestRunner=none w defaults)

1. `vitest.config.ts` (environment `node`, `resolve.alias` dla używanych `@angular22/*`),
2. `tsconfig.spec.json` z **`"exclude": []`** (base wyklucza `**/*.spec.ts`!) + referencja
   w `tsconfig.json`,
3. target `test` = `@nx/vitest:test` w `project.json`,
4. specy importujące Angularowe barrele → `test-setup.ts` z `import '@angular/compiler'`.

Wzorzec 1:1: `libs/wizard/validators`.

## Uruchamianie

`pnpm nx run <projekt>:<target>` · `pnpm nx affected -t lint test build` ·
`pnpm e2e` (= `run-many -t e2e --parallel=1` — suity stawiają własne dev-servery).
