# Angular migrations (standalone → zoneless) — angular22 canon

> **Canon** of the Angular modernization path for angular22 (support for **v19 → v20 → v21 → v22**,
> meta all the way to **zoneless**). The repo is already on **22 + zoneless**; this map serves to (1) keep
> the demo on the latest and (2) drive a 19/20/21 checkout **mid-migration** without false
> errors (the lint gate is **versioned** — see below). Executor: agent
> [`migration`](../.github/agents/migration.agent.md) + playbook
> [`angular-migrations`](../.github/skills/angular-migrations/SKILL.md). Framework versions →
> [`tech-stack.md`](tech-stack.md) (single source of truth), **not** from memory.

## Migration ladder (recommended order)

Each migration is an official `@angular/core` schematic, **idempotent** (safe to re-run).
Base command: `pnpm ng generate @angular/core:<id>` (alias `pnpm ng g …`).

| #   | Migracja                  | Komenda (`pnpm ng generate …`)                  | Co robi                                                                                      |
| --- | ------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Standalone                | `@angular/core:standalone`                      | Components/directives/pipes → standalone; removes redundant `NgModule`; standalone bootstrap |
| 2   | CommonModule → Standalone | `@angular/core:common-to-standalone`            | `CommonModule` → individual directive/pipe imports                                           |
| 3   | Control Flow Syntax       | `@angular/core:control-flow`                    | `*ngIf`/`*ngFor`/`*ngSwitch` → `@if`/`@for`/`@switch`                                        |
| 4   | Clean up unused imports   | `@angular/core:cleanup-unused-imports`          | Removes unused standalone imports (after 1–3)                                                |
| 5   | inject() Function         | `@angular/core:inject`                          | Constructor DI → `inject()`                                                                  |
| 6   | Lazy-loaded routes        | `@angular/core:route-lazy-loading`              | Eager routes → `loadComponent`/`loadChildren` (code-splitting)                               |
| 7   | Signal inputs             | `@angular/core:signal-input-migration`          | `@Input()` → `input()` / `input.required()`                                                  |
| 8   | Outputs                   | `@angular/core:output-migration`                | `@Output() … EventEmitter` → `output()`                                                      |
| 9   | Signal queries            | `@angular/core:signal-queries-migration`        | `@ViewChild`/`@ContentChild(ren)` → `viewChild()`/`contentChild()` …                         |
| 10  | Self-closing tags         | `@angular/core:self-closing-tag`                | `<cmp></cmp>` → `<cmp />` where it is safe                                                   |
| 11  | NgClass → Class           | `@angular/core:ngclass-to-class`                | `[ngClass]` → `[class]` (flag `--migrate-space-separated-key`)                               |
| 12  | NgStyle → Style           | `@angular/core:ngstyle-to-style`                | `[ngStyle]` → `[style]` (flag `--best-effort-mode`)                                          |
| 13  | Router Testing Module     | `@angular/core:router-testing-module-migration` | `RouterTestingModule` → `RouterModule` + `provideLocationMocks()`                            |

## Meta: zoneless (end state)

**No codemod** — zoneless is a config change, not a schematic:

- `provideZonelessChangeDetection()` in the bootstrap (instead of `provideZoneChangeDetection`),
- removing `zone.js` from polyfills and dependencies.

In this repo it is **already achieved** and enforced: `zone.js` is **off-stack** (lint / `stack-guardian`,
[`tech-stack.md`](tech-stack.md)). Entry condition: the code runs on signals (migrations 7–9) and does not
rely on Zone.js automatic CD.

## Versioned gate (Signal Forms ≥ 22)

Multi-version compatibility is enforced by [`eslint.config.mjs`](../eslint.config.mjs): the major is read from
`@angular/core` (fallback `package.json`). From **≥ 22**, importing bare `@angular/forms`
(`FormGroup`/`FormBuilder`/`ngModel` + the `…/signals/compat` bridge) = **lint error**
(`no-restricted-syntax`); on **< 22** the rule is **disabled**, so a checkout from before the Signal Forms
migration does not produce false errors. Details → [`angular.instructions.md`](../.github/instructions/angular.instructions.md).

## Execution rules

- **One migration = one commit** (SDD verb `chore`/`deps`, via `scm`) — don't mix with a feature.
- **`pnpm verify` after every migration** (full gate) + affected `pnpm e2e` green; code drift
  after a codemod → `angular-engineer`, a lint avalanche → `eslint`, types → `typescript`.
- **Confirm exact flags / availability per major** via the `angular-cli` doc-MCP
  (`ng generate --help`) — **don't guess** ([`mcp-usage`](../.github/instructions/mcp-usage.instructions.md)).
- Migrations are **idempotent** — re-running does not break already-migrated code.
- A framework major bump (`nx migrate` / `ng update`) → [`migration`](../.github/agents/migration.agent.md)
  §Loop; these schematics are **code modernization within** a version, not a bump.
