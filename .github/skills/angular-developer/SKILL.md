---
name: angular-developer
description: Modern Angular 22 patterns for angular22 (zoneless, standalone, signals-first) — signals/computed/effect, control flow @if/@for/@switch, DI inject(), inputs input()/model(), OnPush, routing, a11y, tests. Broad guide; details in the signal-forms/material-wrappers/nx-generators skills. Use for component/service logic outside forms.
---

# Angular 22 — broad repo guide

The connecting layer for **component/service logic**. Boundaries: **forms** →
[`signal-forms`](../signal-forms/SKILL.md); **Material/theming** →
[`material-wrappers`](../material-wrappers/SKILL.md); **creating a component/lib** →
[`nx-generators`](../nx-generators/SKILL.md). Conventions → [`angular.instructions`](../../instructions/angular.instructions.md),
lint rules → [`code-quality.instructions`](../../instructions/code-quality.instructions.md). Unsure about an API → MCP
`angular-cli`/`context7`, **not from memory**. Full rules: [`copilot-instructions`](../../copilot-instructions.md).

## Reactivity (signals-first)

**Zoneless by construction** — no zone.js in polyfills (Angular 22 default, no explicit
provider). State **exclusively in signals**; template methods are lightweight (no I/O, no loops).

- `signal()` state, `computed()` derived (memoized), `effect()` side effects — with an
  **equality guard** so they don't loop (pattern: one field deriving another, in a `<feature>-store.ts`).
- `inject()` always instead of constructor injection.
- `linkedSignal()`/`resource()`/`httpResource()` — **no backend, not in the repo**; once
  async appears (resource for fetch, linkedSignal for a writable-derived) — the pattern is
  recommended, verify the syntax via MCP `context7`, not from memory.

## Control flow (native, never `*ngIf`/`*ngFor`)

`@if` / `@switch` (pattern: `button.component.html`) · `@for` **with mandatory `track`**
(`track item.key` or `track $index` for immutable lists) · `@defer`/`@placeholder`/`@loading`
— unused, **recommended** for heavy branches (e.g. embedded apps). **`ng-content` inside
`@if`/`@switch` loses projection** → conditional content via `input()` (pattern `A22ButtonComponent.label`).

## Components

- **Generate, don't write** → [`nx-generators`](../nx-generators/SKILL.md): SCSS · **OnPush** ·
  three files · prefix `a22`. **No** inline `template`/`styles`.
- `input()`/`output()`/`model()` instead of `@Input()`/`@Output()`; `model()` for two-way
  (the wrapper pattern). Host binding via `host: { '[style.display]': "hidden() ? 'none' : 'block'" }`
  (pattern `text-field.component.ts`), not `@HostBinding`.
- Class with the `Component` suffix; selector `a22-*`. Complexity `cognitive-complexity ≤ 15` —
  split into `computed`/helper methods.

## DI and routing

- Providers at the **route/component** level (e.g. `provideNativeDateAdapter()` in the datepicker),
  global ones in `app.config.ts`. `inject()` works in an injection context (field, `constructor`,
  factory) — outside it, cache the reference.
- `provideRouter(appRoutes, withComponentInputBinding())` → **route param/`data` as `input()`**
  (patterns: a feature shell + the host's `embed-host.component.ts`). **Lazy** routes via
  `loadComponent: () => import(...)`. No `ActivatedRoute` when hosted as a web component
  (the host app embeds feature apps via `@angular/elements`) — the component must tolerate that.
- **No SSR/hydration** (`provideClientHydration`/`@angular/ssr` absent) — the apps are pure SPAs.

## Accessibility (a11y)

ARIA only when HTML semantics aren't enough · `focus-visible` · correct `role` ·
`click-events-have-key-events` + `interactive-supports-focus` (lint error). **Audit on the live
app** (`pnpm start` / `nx serve`) via the `ux-verifier` agent — overflow, contrast, RWD, i18n; not from code.

## Style and tests

- **Style**: SCSS in the third file; colors only `--mat-sys-*` tokens; no `--mdc-*`/`::ng-deep`
  → [`material-wrappers`](../material-wrappers/SKILL.md).
- **Tests**: Vitest unit in libs (the `vitest` agent) + Playwright e2e with `data-testid` (the
  `playwright` agent). Every plan: scenarios from AC + unit + e2e — missing = no-go.

## DON'T

- ❌ zone.js patterns / `zone.js` in polyfills · state outside signals.
- ❌ `@for` without `track` · `*ngIf`/`*ngFor` · inline `template`/`styles`.
- ❌ `@Input()`/`@Output()`/constructor DI · `@HostBinding` (use `host:`).
- ❌ bypassing Material wrappers · `@angular/material` outside `libs/ui/material`.
- ❌ forms by hand / `FormGroup` / `ngModel` — **only** Signal Forms → [`signal-forms`](../signal-forms/SKILL.md).
- ❌ unsure APIs from memory — MCP `angular-cli`/`context7`.
