---
applyTo: '**/*.{ts,html}'
description: Distilled angular22 ESLint error-rules — write lint-clean code from the first line; zero after-the-fact fixing
---

# Code quality — rules enforced BEFORE writing

Everything below is **enforced by `pnpm lint`** ([`eslint.config.mjs`](../../eslint.config.mjs)
— flat config, type-aware via `projectService`). Write to spec **upfront** — code that
needs a fix-up round after linting does not meet the Definition of Done. After changing the ESLint
config, update this distillate (agent `eslint`).

## TypeScript (typescript-eslint, type-aware)

- `no-explicit-any` — type concretely; allowed in tests.
- `no-floating-promises` / `no-misused-promises` — `await`, `void router.navigate(...)`.
- `consistent-type-imports` — types via `import type { X }`.
- `consistent-type-definitions` — `interface`, not `type` for object shapes.
- `explicit-member-accessibility` (`no-public`) — write `private`/`protected`, never `public`.
- `no-non-null-assertion` — instead of `!` use narrowing / `??` / a guard.
- `no-unused-vars` — prefix unused parameters with `_`.
- `unbound-method` — destructuring `value`/`valueOf` from FieldContext in Signal
  Forms schemas is a documented idiom → file-level `eslint-disable` with a justification after `--`
  (pattern in `libs/*/data/src/lib/form-schema.ts`); don't disable anywhere else.

## Angular (angular-eslint)

- Selectors: component `a22-*` kebab-case, directive `a22*` camelCase; classes with the
  `Component`/`Directive`/`Pipe`/`Service` suffix.
- `prefer-standalone` + `prefer-on-push-component-change-detection` (**error**) — every
  component standalone + `ChangeDetectionStrategy.OnPush`.
- `prefer-signals` / `prefer-inject` — `input()`/`model()`/`output()`/`computed()` and
  `inject()`; no `@Input()`/`@Output()`/constructor DI.
- Templates: native control flow `@if`/`@for (…; track …)`/`@switch` (**never**
  `*ngIf`/`*ngFor`), `prefer-self-closing-tags`, a11y: `click-events-have-key-events`,
  `interactive-supports-focus`, no `[ngClass]`-style any (`template/no-any`).

## SonarJS / Unicorn / import-x

- `sonarjs/cognitive-complexity` ≤ 15 — split functions instead of stacking conditions.
- `sonarjs/no-nested-conditional` — instead of nested ternaries use a
  `Record<K, V>` map or `@switch`.
- `sonarjs/no-duplicate-string` (threshold 5) — a repeated literal → a constant.
- `sonarjs/different-types-comparison` — don't compare against `undefined` values that by
  their types can't be it (e.g. an indexed array element) — check `length`.
- `unicorn/filename-case` — kebab-case files.
- `unicorn/prefer-node-protocol` — in scripts `node:fs`, not `fs`.
- `import/no-default-export` (except config files) · `import/no-cycle`.
- `no-console` (**error**) — no `console.*` in production code.

## Architectural gates (lint!)

- **Material gate** — `@angular/material/*` and `@angular/cdk/*` may be imported **only**
  in `libs/ui/material` (`no-restricted-imports`). Everywhere else: `@angular22/ui-material`
  wrappers.
- **Signal Forms gate** (Angular ≥ 22) — import/re-export from bare `@angular/forms` is a
  **lint error** (`no-restricted-syntax`): the classic reactive/template API (`FormGroup`,
  `FormBuilder`, `FormControl`, `ReactiveFormsModule`, `FormsModule`, `ngModel`) is forbidden;
  `ngModel` fails transitively (it needs `FormsModule`). Use **`@angular/forms/signals`**
  (`form()`/`schema()`/`[formField]`, field wrappers = `FormValueControl`/`FormCheckboxControl`).
  The gate is **versioned** (major from `package.json`): on Angular < 22 the rule is
  disabled — classic forms supported for pre-migration checkout.
- **Module boundaries** (`@nx/enforce-module-boundaries`) — `scope:individual-wizard` ⛔
  `scope:business-wizard` (and vice versa); layers `app → feature → ui/data-access → util`;
  a lib's public API **only** via `src/index.ts`.

## Format

Prettier (`pnpm format`) with import sorting (`@angular/*` → 3rd-party → `@angular22/*`
→ relative) and `singleAttributePerLine` in HTML — don't arrange imports/attributes by hand
against these groups.
