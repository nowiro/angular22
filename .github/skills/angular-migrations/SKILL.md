---
name: angular-migrations
description: Angular migration playbook (standalone → control-flow → inject → signals → … → zoneless) for v19–v22 — order, idempotent `@angular/core` schematics, per-step verification, versioned gate. Used by the `migration` agent.
---

# Angular migrations — repo playbook

Knowledge applied by the [`migration`](../../agents/migration.agent.md) agent. This is **HOW** to drive
Angular code modernization (standalone → zoneless) on **v19–v22** checkouts. The full table of 13 migrations

- commands + zoneless meta = the canon [`docs/angular-migrations.md`](../../../docs/angular-migrations.md) —
  **don't duplicate it here**, point to it.

## Scope (vs major bump)

- **Here:** modernizing **code inside** a version with the official `@angular/core` schematics
  (`ng generate @angular/core:<id>`) — standalone, control-flow, inject, signals, template polish, tests.
- **Major bump** (`nx migrate` / `ng update`, jump 19→20→21→22) → [`migration`](../../agents/migration.agent.md) §Loop.
  Typical sequence: major bump **→** run the modernization schematics that major introduced.

## Ladder (mandatory order)

Order from the [canon](../../../docs/angular-migrations.md) (1→13), because steps affect one another:
structure (standalone, common-to-standalone, control-flow) **→** import cleanup **→** DI (inject)
**→** routing (lazy) **→** reactivity (signal inputs/outputs/queries) **→** templates (self-closing,
ngclass, ngstyle) **→** tests (router-testing-module) **→** **zoneless** (config, no codemod).

Run `cleanup-unused-imports` (#4) **after** standalone/control-flow — only then are imports
(`CommonModule`, CF directives) truly unnecessary.

## Loop per migration

1. **Availability + flags** for the target major → confirm via doc-MCP `angular-cli`
   (`ng generate --help`), **not from memory** ([`mcp-usage`](../../instructions/mcp-usage.instructions.md)).
2. `pnpm ng generate @angular/core:<id>` (the right flag, e.g. `--migrate-space-separated-key` for
   `ngclass-to-class`, `--best-effort-mode` for `ngstyle-to-style`).
3. **Review the diff** — schematics are safe, but only migrate the "certain" cases; finish the rest
   by hand (delegate to `angular-engineer`).
4. `pnpm verify` (full gate) + touched `pnpm e2e` green.
5. **Commit** (`scm`, conventional) — **one migration = one commit**, don't mix with a feature.

## Multi-version (v19–v22)

- Run **only** the migrations the target major already introduced (some, e.g. `ngclass-to-class`/
  `ngstyle-to-style`, are newer — check the `angular-cli` MCP).
- **The lint gate is versioned** ([`eslint.config.mjs`](../../../eslint.config.mjs)): Signal-Forms
  enforced from ≥ 22, off on < 22 — a checkout before the migration doesn't throw false errors.
- Idempotency: a schematic can be re-run after the next major bump — it doesn't break already-migrated code.

## Zoneless (closure)

No codemod: `provideZonelessChangeDetection()` + removal of `zone.js`. Condition: code on signals
(after the signals migrations) without relying on Zone.js automatic CD. Already achieved and enforced in the repo
(`zone.js` off-stack — [`tech-stack.md`](../../../docs/tech-stack.md)).

## NO

- Don't guess a schematic id/flag — confirm via the `angular-cli` MCP.
- Don't run a migration without reviewing the diff and `pnpm verify`.
- Don't mix multiple migrations, or a migration with a feature, in one commit.
- Don't force a migration unavailable for the target major.
