---
name: material-wrappers
description: How to add/change an Angular Material wrapper in libs/ui/material — the FormValueControl/FormCheckboxControl contract, the no-restricted-imports gate, M3 tokens, i18n inside the wrapper. Use when a wrapper is missing or you change ui-material.
---

# Material wrappers — recipe

`libs/ui/material` is the **only** place to import `@angular/material/*` / `@angular/cdk/*`
(lint gate). Apps and the other libs consume `@angular22/ui-material`.

## New form field wrapper (step by step)

1. `pnpm nx g @nx/angular:component <name> --directory=libs/ui/material/src/lib` —
   three files, OnPush, prefix `a22`.
2. Implement **`FormValueControl<T>`**: `readonly value = model<T>(initial)`;
   optionally `touched = model(false)`, `disabled/readonly/hidden/invalid = input(false)`,
   `errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])` — the
   `[formField]` directive syncs everything itself. Checkbox → **`FormCheckboxControl`**
   (`checked = model(false)`, no `value`).
3. In the template, bind Material MANUALLY: `[value]="value()"` +
   `(input)/(selectionChange)/(change)` → `value.set(...)`, `(blur)` → `touched.set(true)`.
4. Errors: `<a22-field-error [errors]="showError() ? errors() : []" />` where
   `showError = computed(() => touched() && invalid())`.
5. **i18n inside the wrapper**: text coming from data (select options, `error.message`,
   consent labels) goes through the `a22T` pipe — that way the data libs stay purely Polish.
6. `testId = input('')` → `[attr.data-testid]="testId() || null"` on the interactive element.
7. Export in `src/index.ts`; generic selector `T extends string` for selects
   (`value = model<T>(undefined as unknown as T)` — formField overrides it immediately).

## Pitfalls

- **`ng-content` inside `@switch`/`@if` loses projection** — label as `label = input('')`
  (the `A22ButtonComponent` pattern).
- `mat-error` doesn't work without NgControl — we use our own `a22-field-error`.
- Datepicker: `provideNativeDateAdapter()` in the wrapper COMPONENT's `providers`.
- Stepper: steps via `ng-template[a22Step]` + `contentChildren` + `NgTemplateOutlet`;
  navigation via public `next()/previous()` (template ref `#stepper`).

## Theming

Only `--mat-sys-*` / `--mat-*` + `mat.theme()` in the app's `styles.scss` (palettes per app:
azure/rose · violet/cyan). No `--mdc-*`/`--sys-*` (they silently fail) and no `::ng-deep`.
