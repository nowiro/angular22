---
type: doc
id: 'doc.blueprint'
title: 'Reproduction blueprint — angular22'
---

# Reproduction blueprint — angular22

A **from-zero recipe** for recreating this project: an **Nx monorepo on Angular 22** plus its
**GitHub Copilot** and **VS Code** configuration. It captures the _founding assumptions_ (the
non-negotiable decisions) and the _concrete settings_ needed to stand up an equivalent workspace.

Scope note: **Angular 22 only**. Every version and rule here targets Angular 22; pre-22 migration
paths are intentionally out of scope. Pinned versions are owned by [`tech-stack.md`](tech-stack.md)
(canon, mirrors `package.json`) — this file references them rather than duplicating.

Project-specific identifiers you would swap when reusing the blueprint:

| Placeholder (used in this doc)                          | This demo's value                                                    | Meaning                                 |
| ------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------- |
| `@angular22/*`                                          | `@angular22/*` (kept verbatim)                                       | import scope — TS path aliases for libs |
| `a22`                                                   | `a22` (kept verbatim)                                                | component/directive selector prefix     |
| `<host-app>` / `<feature-a>` / `<feature-b>`            | `portal` / `demo-individual-wizard` / `demo-business-wizard`         | app directories under `apps/`           |
| `scope:<host>` / `scope:<feature-*>` (+ `scope:shared`) | `scope:portal` / `scope:individual-wizard` / `scope:business-wizard` | Nx module-boundary scopes               |
| UI locale                                               | `PL` (EN second)                                                     | runtime i18n default                    |

---

## 1. Founding assumptions

The decisions that define the project. Everything else (config, lint, agents) exists to enforce
these.

1. **Angular 22, modern surface only** — zoneless change detection, standalone components, signals
   as the default state model, **Signal Forms** (`@angular/forms/signals`) as the _only_ forms API.
   No `NgModule`, no `zone.js`, no `FormGroup`/`FormBuilder`/`ngModel`.
2. **Nx monorepo** — apps + libraries, task caching, inference plugins, and **enforced module
   boundaries** (`scope:*` + `type:*` tags). The workspace stays offline (no Nx Cloud).
3. **One technology per role** — the stack is _closed_. One UI kit (Angular Material), one unit
   runner (Vitest), one e2e runner (Playwright), one package manager (pnpm), one formatter
   (Prettier), one linter (ESLint flat). Off-stack alternatives are banned (see
   [`tech-stack.md`](tech-stack.md#allowed--banned-off-stack)).
4. **Material behind a single wrapper lib** — `@angular/material` / `@angular/cdk` may be imported
   **only** inside `libs/ui/material`; everywhere else consumes `@angular22/ui-material` wrappers.
   Theming is exclusively `--mat-sys-*` design tokens + `mat.theme()`.
5. **Runtime, signal-based i18n** — Polish source strings _are_ the translation keys (gettext-style),
   the `a22T` pipe renders them, EN maps live next to each app/feature; a missing entry falls back to
   PL. No external i18n library.
6. **Web-component delivery** — feature apps build both as standalone apps and as `@angular/elements`
   custom elements that a host app embeds; runtime **feature flags** (`config.json` next to `index.html`)
   turn an app on/off per environment without redeploying code.
7. **Strictness is a gate, not a guideline** — TypeScript `strict` (+ extra `noUnused*`,
   `noPropertyAccessFromIndexSignature`), type-aware ESLint, exact-version pins. Generated code must
   pass `pnpm lint` on the first try.
8. **Local verification, zero CI** — there are **no GitHub Actions**. The quality gate is `pnpm
verify`, run locally / by the agent. Releases are manual.
9. **Copilot-only AI tooling** — the repo is configured for GitHub Copilot (VS Code ≥ 1.121): one
   visible orchestrator agent + hidden specialists, auto-applied instructions, prompts, and skills.
   No `CLAUDE.md` / `.claude/` / `.ai/`.
10. **Spec-Driven Development** — non-trivial changes follow an SDD ladder (adapted from
    [github/spec-kit](https://github.com/github/spec-kit)); specs/plans/run-logs are versioned in
    `docs/`.

---

## 2. Tech stack (Angular 22 context)

Canon + every pinned version: [`tech-stack.md`](tech-stack.md). Summary of _what_ and _why this
version line_:

| Role       | Choice                                                                     | Version line                                              | Rule                                                            |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| Runtime    | Node.js / pnpm                                                             | Node `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` · pnpm `11.x` | `.nvmrc` pins local Node; `packageManager` pins pnpm; pnpm-only |
| Framework  | `@angular/*` (core/common/compiler/forms/router/platform-browser/elements) | `22.0.x`                                                  | **all `@angular/*` share one version** (atomic block bump)      |
| UI         | `@angular/material` + `@angular/cdk`                                       | `= @angular/core`                                         | Material = CDK = core; raw import only in `libs/ui/material`    |
| Workspace  | `nx` + every `@nx/*` plugin                                                | one shared version                                        | all `@nx/*` == `nx`                                             |
| Build      | `@angular/build` application builder (esbuild)                             | `= @angular/core`                                         | not webpack                                                     |
| Language   | TypeScript                                                                 | `6.x` strict                                              | bumped together with `typescript-eslint`                        |
| Forms      | Signal Forms (`@angular/forms/signals`)                                    | `= @angular/core`                                         | classic forms lint-banned on major ≥ 22                         |
| Unit tests | Vitest (`@nx/vitest:test`) + `jsdom`                                       | —                                                         | no Jest/Karma/Jasmine; TestBed-free                             |
| E2E tests  | Playwright (`@nx/playwright`)                                              | —                                                         | chromium                                                        |
| Lint       | ESLint flat + `typescript-eslint` + `angular-eslint` + plugins             | `angular-eslint` major == Angular major                   | type-aware                                                      |
| Format     | Prettier + `@trivago/prettier-plugin-sort-imports`                         | —                                                         | import order delegated to Prettier (`import/order: off`)        |
| Auth/RBAC  | `keycloak-angular` / `keycloak-js`                                         | keycloak-angular major == Angular major                   | demo runs in **mock** mode; real IdP via `provideKeycloak`      |

**Consistency rules** (enforced by the `stack-guardian` agent): Angular as a block · Material = CDK =
core · Nx as a block · `angular-eslint` ↔ Angular major · keycloak-angular ↔ Angular major · exact
pins for runtime/framework/UI/Nx/tests (`^` only for dev-only tools).

---

## 3. Repository layout

```
.
├─ apps/
│  ├─ <host-app>/                   # :4200  shell — launcher tiles + embedded apps (web components)
│  ├─ <host-app>-e2e/               #         Playwright suite (type:e2e)
│  ├─ <feature-a>/                  # :4201  standalone embeddable app + build-element target
│  ├─ <feature-a>-e2e/
│  ├─ <feature-b>/                  # :4202  standalone embeddable app + build-element target
│  └─ <feature-b>-e2e/
├─ libs/
│  ├─ ui/material/                  # type:ui  scope:shared — ONLY raw @angular/material consumer
│  ├─ ui/feedback/                  # type:ui  scope:shared — error screens + global error handler
│  ├─ <domain>/{core,validators,ui,…}/         # scope:shared reusable primitives
│  ├─ shared/{i18n,config,auth,app-platform}/  # scope:shared cross-cutting libs
│  ├─ <feature-a>/{data,feature}/              # scope:<feature-a>
│  └─ <feature-b>/{data,feature}/              # scope:<feature-b>
├─ docs/                            # tech-stack, sdd/, deployment, observability, this file …
├─ tools/scripts/                   # validate-ai-config · validate-sdd · workflow-specify
├─ .github/                         # Copilot config (see §6)
└─ .vscode/                         # MCP + settings + extensions (see §7)
```

**Library taxonomy** (drives the boundary lint):

- `type:` layer — `app` → `feature` → `ui` / `data-access` → `util`. A layer may depend only
  downward (e.g. `ui` → `ui`/`util`; `util` → `util` only).
- `scope:` domain — `shared` (usable anywhere) + one per app/domain (`<host>`, `<feature-a>`, `<feature-b>`, …).
  A domain app/lib may depend only on its own scope + `shared`.
- **Public API = `src/index.ts` only.** Internal barrel files are a lint error
  (`no-barrel-files`); the root `index.ts` is the intentional boundary.
- Every lib is registered as a TS path alias `@<scope>/<lib>` in `tsconfig.base.json`.

---

## 4. Workspace configuration files

The minimal set of root configs and what each one establishes. Treat these as the reproducible
skeleton.

### `package.json`

- `private: true`, `engines` (Node + pnpm), `packageManager: pnpm@<x>` (Corepack pin),
  `preinstall: npx only-allow pnpm`, `prepare: husky`.
- Script families: serve (`start*`), `build`/`test`/`lint`/`typecheck`/`e2e` via `nx run-many`,
  `affected*`, `format`/`format:check`, deps (`deps:check`/`deps:update` via `npm-check-updates`),
  AI/SDD gates (`ai:validate`, `sdd:check`, `workflow:specify`), and the umbrella **`verify`**:
  ```
  format:check → ai:validate → sdd:check → lint → typecheck → test → build
  ```

### `nx.json`

- `namedInputs` (`default` / `production` / `sharedGlobals`) so caching excludes spec/config files
  from production hashes.
- `targetDefaults` — `cache: true` for build/test/lint/e2e/typecheck; `build`/`typecheck` depend on
  `^build`/`^typecheck`.
- `plugins` — `@nx/eslint/plugin` (`lint`) + `@nx/playwright/plugin` (`e2e`) for target inference.
- `generators` defaults — Angular `application`/`library`/`component`: `style: scss`,
  `unitTestRunner: none` (libs use Vitest configured per-project; apps test via e2e),
  `e2eTestRunner: playwright`, `linter: eslint`, `prefix: a22`, components `OnPush` + `displayBlock`.
- `defaultBase: main`, `parallel: 5`, `useInferencePlugins: true`, `neverConnectToCloud: true`,
  `analytics: false`.

### `tsconfig.base.json`

- `strict: true` plus `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`,
  `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `noUnusedParameters`.
- `moduleResolution: bundler`, `module: esnext`, `target: es2022`, `useDefineForClassFields: false`
  (Angular decorator semantics), `importHelpers` (+ `tslib`).
- `paths` — one `@<scope>/<lib>` → `libs/.../src/index.ts` entry per library.

### `eslint.config.mjs` (flat)

Layered config; the load-bearing blocks:

- **Base** — `@eslint/js` recommended + `nx` base/angular/typescript + `typescript-eslint`
  recommendedTypeChecked & stylisticTypeChecked + `angular-eslint` tsRecommended + `sonarjs` +
  `jsdoc`. Type-aware via the typescript-eslint **Project Service**.
- **Angular conventions** — element prefix `a22` (kebab) / attribute prefix `a22` (camel),
  `prefer-standalone`, `prefer-on-push-component-change-detection`, `prefer-signals`,
  `prefer-inject`, lifecycle/suffix rules.
- **TS safety** — `no-explicit-any`, `no-non-null-assertion`, `no-floating-promises`,
  `no-misused-promises`, `consistent-type-imports`, `consistent-type-definitions: interface`,
  explicit member accessibility (no `public`).
- **Material gate** — `no-restricted-imports` bans `@angular/material*` / `@angular/cdk*` in
  `libs/**` + `apps/**` _except_ `libs/ui/material/**`.
- **Signal Forms gate** — _version-aware_: on Angular major ≥ 22, `no-restricted-syntax` bans the
  bare `@angular/forms` entry point and the `@angular/forms/signals/compat` bridge across static
  import / re-export / dynamic `import()` / `import = require()`. Pure `@angular/forms/signals` stays
  allowed. The major is read from installed `@angular/core` (fallback `package.json`), so the gate
  self-disables on a pre-22 checkout.
- **Boundaries** — `@nx/enforce-module-boundaries` with the `scope:*`/`type:*` depConstraints above.
- **Other** — `no-barrel-files` (libs, except `index.ts`), `unicorn` (kebab filenames,
  node: protocol), `sonarjs` (cognitive-complexity ≤ 15, duplicate-string ≥ 5), `rxjs-x` /
  `rxjs-angular-x`, `no-console: error`. Templates: `prefer-control-flow`, a11y rules. Test/config
  files get relaxed overrides; `prettier` config is last.

### Format & package-manager configs

- `.prettierrc` — `printWidth: 120`, single quotes, trailing commas, `singleAttributePerLine`,
  `@trivago/prettier-plugin-sort-imports` with `importOrder` `^@angular/` → third-party →
  `^@<scope>/` → relative; markdown override (`printWidth: 100`, `proseWrap: preserve`).
- `.npmrc` — `engine-strict`, `auto-install-peers`, `prefer-frozen-lockfile`, `fund=false`,
  `audit=false`, **`save-exact=true`** (exact pins on `pnpm add`).
- `pnpm-workspace.yaml` — `overrides` (security bumps), `allowBuilds` allow-list (native
  build/postinstall scripts: `@parcel/watcher`, `@swc/core`, `esbuild`, `lmdb`, `nx`, …),
  `minimumReleaseAgeExclude` for freshly-published trusted packages.
- `.nvmrc` — exact local Node version. `.editorconfig` + `files.eol: lf`. `husky` git hooks via the
  `prepare` script.

### Per-project `project.json`

- **App** — `@angular/build:application` (browser `main.ts`, scss inline, public assets, prod budgets
  `initial 1.5/2.5 MB` + `anyComponentStyle 4/8 KB`, `outputHashing: all`), `@angular/build:dev-server`
  on a fixed port, `@nx/eslint:lint`, `@nx/web:file-server` (`serve-static`), and a `typecheck`
  run-command (`tsc -p tsconfig.app.json --noEmit`). Tags `scope:<domain>` + `type:app`.
- **Embeddable apps additionally** define **`build-element`** (`@angular/build:application` over
  `element.ts`, `index: false`, no polyfills/hashing, own budgets) → `dist/elements/<app>`; the
  host app's `build`/`serve` `dependsOn` the embeddable apps' `build-element` and serves them under `/elements`.
- **Lib** — `@nx/eslint:lint` + a `typecheck` run-command. Tags `scope:*` + `type:*`.

---

## 5. Bootstrap & reproduction steps

```sh
# 0. Toolchain — pnpm is the only manager
node -v                         # match .nvmrc
pnpm -v || npm i -g pnpm@<x>    # version == packageManager in package.json

# 1. Scaffold the Nx workspace (Angular preset, integrated monorepo)
pnpm dlx create-nx-workspace@<nx-major> <name> --preset=angular-monorepo \
  --bundler=esbuild --unitTestRunner=vitest --e2eTestRunner=playwright \
  --style=scss --packageManager=pnpm

# 2. Pin the Angular 22 block + tooling to exact versions (see tech-stack.md), then:
pnpm install
pnpm exec playwright install chromium     # once, for e2e

# 3. Generate apps & libs via the Nx generators (never by hand)
pnpm nx g @nx/angular:application <app> --prefix=a22 --style=scss \
  --unitTestRunner=none --e2eTestRunner=playwright --ssr=false
pnpm nx g @nx/angular:library <lib> --prefix=a22 --style=scss --unitTestRunner=none
pnpm nx g @nx/angular:component <name> --type=component --skipTests   # OnPush + scss + a22

# 4. Wire conventions
#    - tag each project: scope:<domain> + type:<layer>  (project.json)
#    - add @<scope>/<lib> alias → src/index.ts          (tsconfig.base.json)
#    - drop in eslint.config.mjs (Material gate, Signal Forms gate, boundaries)
#    - shared app bootstrap → a single provider lib (here: @angular22/app-platform)

# 5. Gate
pnpm verify
```

Rules that survive reproduction: **components only via the generator** (3 files, OnPush, prefix);
**a new dependency is off-stack** until it passes SDD + a `tech-stack.md` entry + `stack-guardian`;
**exact pins**.

---

## 6. GitHub / Copilot configuration (`.github/`)

This is the "GitHub settings" half of the project — there are **no Actions workflows**; the `.github`
tree is entirely the **Copilot** configuration.

```
.github/
├─ copilot-instructions.md        # session digest — identity, language, hard rules, DoD, commands
├─ AGENTS.md (repo root)          # single source of truth for the agent roster + model tiers
├─ agents/*.agent.md              # 1 visible orchestrator + hidden specialists (user-invocable:false)
├─ instructions/*.instructions.md # auto-applied by `applyTo` glob (lint, angular, mcp-usage)
├─ prompts/*.prompt.md            # slash commands: /clarify /analyze /checklist /brainstorming …
└─ skills/<name>/SKILL.md         # reusable playbooks (angular-developer, signal-forms, …)
```

### Agent model — one visible orchestrator + a hidden bench

- **Exactly one** agent is user-visible: `orchestrator` (frontmatter `model: Claude Opus 4.8`). Every
  other agent sets `user-invocable: false` and is reached only as a sub-agent. The
  `pnpm ai:validate` gate **enforces** "exactly 1 visible agent" + "every agent has `model:`" +
  "orchestrator runs on Opus" + valid `mcp.json`.
- **Token-economy model tiers** (in each `*.agent.md`):
  - orchestrate → `Claude Opus 4.8` — planning + final verification only (delegates execution down).
  - MCP callers (`angular-cli`, `nx`, `context7`) → `GPT-5 mini` — and _only_ these three call MCP
    servers; the rest delegate to them.
  - everything else (code / tests / e2e / review / UX / specialists) → `Gemini 3.5 Flash`.
- The orchestrator runs the **SDD ladder**: doc-review → specify → `/clarify` → plan → `/analyze` →
  `/checklist` → implement → verify → DoD; **STOP on ambiguity** (never guess); one step = one commit;
  every iteration writes a dated run-log under `docs/runs/`.

### Auto-applied instructions

`instructions/*.instructions.md` carry an `applyTo` glob so Copilot injects them only for matching
files — e.g. `code-quality` on `**/*.ts`, `angular` on `{apps,libs}/**`, `mcp-usage` on demand. Their
job: make generated code pass `pnpm lint` with no fix-up round.

### Validation gates (tools/scripts)

- `pnpm ai:validate` → `validate-ai-config.mjs` — Copilot config integrity (1 visible agent,
  frontmatters, `mcp.json`).
- `pnpm sdd:check` → `validate-sdd.mjs` — spec ↔ plan traceability.
- `pnpm workflow:specify` → scaffolds spec + plan + dated run-log.

### Policy: no GitHub Actions

CI is deliberately absent. `pnpm verify` is the gate, run locally or by the orchestrator. There is no
`.github/workflows/`, and no non-Copilot AI config (`CLAUDE.md` / `.claude/` / `.ai/`).

---

## 7. VS Code configuration (`.vscode/`)

- **`mcp.json`** — Model Context Protocol servers (VS Code ≥ 1.121). Four keyless/zero-config servers
  the agents rely on: `context7` (live library docs), `nx` (`nx-mcp` over the workspace root),
  `angular-cli` (`@angular/cli mcp`), `playwright` (browser e2e debugging). Windows
  invocation is `cmd /c npx`; macOS/Linux swap to `command: npx`.
- **`settings.json`** — Prettier default formatter + format-on-save, ESLint `source.fixAll` on save +
  flat config + validate `html`, workspace TS SDK, `files.eol: lf`, search excludes, Copilot agent
  history summarization on, OTel export **off** by default (endpoint/key via env when enabled).
- **`extensions.json`** — recommended set: `github.copilot(-chat)`, `angular.ng-template`,
  `nrwl.angular-console`, `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`,
  `ms-playwright.playwright`, `vitest.explorer`.

---

## 8. Quality gates & conventions (summary)

| Gate / convention        | Mechanism                                                                                    | Failure mode |
| ------------------------ | -------------------------------------------------------------------------------------------- | ------------ |
| Material wrapper         | `no-restricted-imports` (eslint) — raw Material/CDK outside `libs/ui/material`               | lint error   |
| Signal Forms only        | `no-restricted-syntax` (eslint, Angular ≥ 22) — classic forms banned                         | lint error   |
| Module boundaries        | `@nx/enforce-module-boundaries` (`scope:*` + `type:*`)                                       | lint error   |
| Public API surface       | `no-barrel-files` — only `src/index.ts` exports                                              | lint error   |
| Components via generator | `nx g @nx/angular:component` (OnPush + scss + 3 files + `a22`)                               | review/no-go |
| Exact dependency pins    | `.npmrc save-exact` + `stack-guardian` + `tech-stack.md` ↔ `package.json`                    | review/no-go |
| i18n coverage            | `a22T` pipe, PL = key, EN maps; missing → PL fallback                                        | review       |
| Type strictness          | `tsconfig.base.json strict` + `pnpm typecheck`                                               | typecheck    |
| Full gate (DoD)          | **`pnpm verify`** = format:check → ai:validate → sdd:check → lint → typecheck → test → build | any step     |

---

## 9. References

- Pinned versions & ban list — [`tech-stack.md`](tech-stack.md)
- Agent roster & model tiers — [`AGENTS.md`](../AGENTS.md)
- Copilot session digest — [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)
- SDD methodology — [`sdd/methodology.md`](sdd/methodology.md)
- Web-component / feature-flag delivery — [`deployment.md`](deployment.md)
- App/lib map — [`README.md`](../README.md)
  </content>
  </invoke>
