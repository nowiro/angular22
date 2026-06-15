---
name: signal-forms
description: Signal Forms recipes (Angular 22 stable) for angular22 — model in signal(), schema() with applyWhen/applyEach/hidden/disabled/submit, per-feature store, field state + FieldTree in components, repo gotchas. Use for any work on forms.
---

# Signal Forms — repo recipes

## Architecture (the per-feature pattern)

1. **Model** = plain interface + `initial<X>Data()` in `libs/<feature>/data/src/lib/models.ts`.
   Conditional branches are ALWAYS present in the model; optional strings are `''` (not `null`).
2. **Schema** = `schema<T>((path) => { … })` in `form-schema.ts` — the single source of validation.
   Messages are **in Polish** (the UI translates them via i18n on the wrapper side).
3. **Store** (root `@Injectable`) — `form = form(this.model, schema)`; array helpers =
   immutable `model.update`; effects (e.g. one field deriving another, list rebuild) with an
   equality guard so they don't loop.
4. **Component** — `[formField]="form.basicData.firstName"` on a wrapper from
   `@angular22/ui-material`; array index via a method
   `phoneField(i): FieldTree<PhoneValue> { return this.form.contact.phones[i]; }`.

## API (verified on v22.0.0)

`form` · `schema` · `apply` / `applyEach` / `applyWhen` / `applyWhenValue` · `validate` /
`validateTree` / `validateAsync` (async via `resource()` — `params` + `factory` + `onSuccess` /
`onError`; **no backend in the repo yet**) · `required` / `email` / `pattern` / `min` / `max` /
`minLength` / `maxLength` (`{ message }`) · `hidden` / `disabled` / `readonly` / `debounce(path, ms)`
logic (**`{ when }` only** — a bare function/string is `@deprecated` in v22) ·
`submit(form, async () => …)` · types `FieldTree` / `FieldState` / `FormValueControl` /
`FormCheckboxControl`. The **`FormField`** directive, selector `[formField]`.

**`{ when }` ≠ every validator.** State logic (`hidden` / `disabled` / `readonly`) takes `{ when }`,
and among validators **only `required`** does; a conditional `pattern` / `min` / `validate` / … goes
**inside `applyWhen(path, pred, sub)`**, never as a `{ when }` option.

## Field state + submit

- **Call a field as a function** to read its state: `form.email()` → a `FieldState` exposing
  `value()` (the `WritableSignal`), `valid()` / `invalid()`, `touched()`, `dirty()`, `errors()`
  (`{ kind, message }[]`), `pending()` (async), `disabled()`, `hidden()`, `readonly()`. Form-level:
  `form().valid()` / `invalid()` / `pending()`. Array length: **`form.items.length`** (no `()`).
- **`submit(form, async () => { … })`** marks every field touched, then runs the async callback
  **only when valid** — prefer it over a manual `markAsTouched()` on real submit.
- Rule context = `{ value, valueOf, state, stateOf, fieldTree, pathKeys }`: read other fields'
  **values** via `valueOf(path)` and their **state** via `stateOf(path)` (e.g.
  `stateOf(path.x).touched()`) — a bare `path.x` is **not callable** inside a rule.

## Conditions (canonical pattern)

A predicate in a PURE function (`relevance.ts`) used **twice**: in the schema
(`applyWhen(path.x, ({ valueOf }) => shows…(valueOf(path.y)), subschema)` +
`hidden(path.x, { when: … })`) and in the template (`@if (relevance().x)`). Validation and
render never drift apart.

## Gotchas (cost us debugging — don't repeat)

- `form()` takes a **`WritableSignal`** (the `signal()` model) — never a `computed`/read-only
  `Signal`; it writes user input back into the model. Programmatic writes → `model.update`/`model.set`.
- Destructuring `({ value, valueOf })` from FieldContext → `unbound-method`; file-level
  `eslint-disable` with rationale (pattern at the top of `form-schema.ts`).
- `required(path, { when })` — conditional required (e.g. a field required only in a given mode).
- Disabled fields do NOT block writing to the **model** (the store can update) — they block the UI.
- **`[formField]` owns the field** — don't also bind `[value]` / `[disabled]` / `[readonly]` / `min` /
  `max` on the same element; express those as schema rules (`min(s.age, 18)`, `disabled(path, { when })`).
  A static `value` on a radio/checkbox (option identity) is the only exception.
- Tests importing the barrel from `@angular/forms/signals` → `test-setup.ts` with
  `import '@angular/compiler'`.
- Custom errors: return `{ kind, message }` or `null`; factories in
  a domain validators lib (e.g. `@angular22/<domain>-validators`: `idError`, `codeError`, …) — empty-pass, combine with `required`.

## Dev-fill

Preset = a complete model object (`buildXPreset(mode)`) → `model.set(preset)` +
`form().markAsTouched()`. Checksum-valid sample identifiers from a shared util lib.
