---
applyTo: '{apps,libs}/**'
description: Angular 22 conventions for angular22 — Signal Forms, Material wrappers, Nx generators, i18n PL/EN, three files per component
---

# Angular 22 — repo conventions

Auto-loaded on `apps/**` and `libs/**`. Lint rules → `code-quality.instructions.md`
(read FIRST). Deeper recipes → skills `angular-developer` (broad guide),
`signal-forms`, `material-wrappers`, `nx-generators`, `angular-new-app`, `frontend-design`.

## Components

- **Generate, don't write by hand:** `pnpm nx g @nx/angular:component <name>
--directory=<project>/src/lib/<name>` — defaults from `nx.json`: SCSS, OnPush, prefix `a22`,
  **three files** (`.ts` + `.html` + `.scss`, `templateUrl`/`styleUrl`). Inline
  template/styles are forbidden.
- Zoneless (no zone.js in polyfills) — state only in signals; template methods lightweight.
- `ng-content` inside `@if`/`@switch` branches **loses projection** — conditional content via
  inputs (pattern: `A22ButtonComponent.label`).

## Forms = Signal Forms (the only pattern)

Model `signal<T>()` (a **`WritableSignal`** — `form()` requires it; never a `computed`/read-only
`Signal`; programmatic writes via `model.update`/`model.set`) + validation `schema()`
(`required`/`validate`/`applyWhen`/`applyEach`/`hidden`/`disabled`, messages **PL**) + binding
`[formField]`. Store per wizard
(`form()` in a root service field, array helpers = immutable `model.update`). No
`FormGroup`/`FormBuilder`/`ngModel` — **lint-enforced** (`no-restricted-syntax`) from
Angular ≥ 22: importing bare `@angular/forms` = error; on older majors the rule is
disabled (migration support). Field wrappers = `FormValueControl`/`FormCheckboxControl`.
Visibility conditions: the same predicates in the schema (`applyWhen`+`hidden`) and template (`@if`).

## Material — wrappers only

`@angular22/ui-material` (`a22-text-field`, `a22-select`, `a22-checkbox`, `a22-date-field`,
`a22-number-field`, `a22-button`, `a22-card`, `a22-toolbar`, `a22-icon`, `a22-divider`,
`a22-wizard-stepper`, `A22NotificationService`). Missing a wrapper → add it in
`libs/ui/material` (agent `material-wrapper`), don't bypass the gate. Theming: `--mat-sys-*`
tokens + `mat.theme()` in the app's `styles.scss`; no `--mdc-*`/`--sys-*`/`::ng-deep`.

## i18n (PL default, EN second)

- UI text in templates: **PL literal via the `a22T` pipe** (`@angular22/shared-i18n`):
  `{{ 'Dalej' | a22T }}`, `[label]="'Imię' | a22T"`. The PL string **is the key**; EN lives in
  `*-translations.en.ts` maps (no entry → PL fallback).
- In TS (computed/services): `inject(I18nStore).t('…')` — reactive to language.
- Wrappers translate themselves: select options, error messages, consent labels — dictionaries and
  schemas in data libs stay **in Polish** and import nothing from i18n.
- New text = PL literal in the template + EN entry in that layer's translation map.
- Switcher: `a22-language-switcher` in toolbars; choice persisted (`localStorage`),
  `document.documentElement.lang` kept up to date.

## Tests and verification

Unit: Vitest in libs (executor `@nx/vitest:test`) — see agent `vitest`. E2E: Playwright
(executor `@nx/playwright:playwright`, `data-testid`) — see agent `playwright`.
**Verify UX by running** (`pnpm start:*`), not from the code — agent `ux-verifier`.
