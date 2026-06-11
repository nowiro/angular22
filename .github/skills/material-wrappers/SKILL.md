---
name: material-wrappers
description: Jak dodać/zmienić wrapper Angular Material w libs/ui/material — kontrakt FormValueControl/FormCheckboxControl, bramka no-restricted-imports, tokeny M3, i18n we wrapperze. Użyj gdy brakuje wrappera albo zmieniasz ui-material.
---

# Wrappery Material — przepis

`libs/ui/material` to **jedyne** miejsce importu `@angular/material/*` / `@angular/cdk/*`
(lint gate). Apki i pozostałe liby konsumują `@angular22/ui-material`.

## Nowy wrapper pola formularza (krok po kroku)

1. `pnpm nx g @nx/angular:component <name> --directory=libs/ui/material/src/lib` —
   trzy pliki, OnPush, prefix `a22`.
2. Implementuj **`FormValueControl<T>`**: `readonly value = model<T>(początkowa)`;
   opcjonalnie `touched = model(false)`, `disabled/readonly/hidden/invalid = input(false)`,
   `errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([])` — dyrektywa
   `[formField]` zsynchronizuje wszystko sama. Checkbox → **`FormCheckboxControl`**
   (`checked = model(false)`, bez `value`).
3. W szablonie Material bindowany RĘCZNIE: `[value]="value()"` +
   `(input)/(selectionChange)/(change)` → `value.set(...)`, `(blur)` → `touched.set(true)`.
4. Błędy: `<a22-field-error [errors]="showError() ? errors() : []" />` gdzie
   `showError = computed(() => touched() && invalid())`.
5. **i18n we wrapperze**: teksty pochodzące z danych (opcje selecta, `error.message`,
   etykiety zgód) przepuszczaj przez pipe `a22T` — wtedy liby data zostają czysto polskie.
6. `testId = input('')` → `[attr.data-testid]="testId() || null"` na elemencie interaktywnym.
7. Eksport w `src/index.ts`; selektor generyczny `T extends string` dla selectów
   (`value = model<T>(undefined as unknown as T)` — formField nadpisze natychmiast).

## Pułapki

- **`ng-content` w `@switch`/`@if` gubi projekcję** — etykieta jako `label = input('')`
  (wzorzec `A22ButtonComponent`).
- `mat-error` nie działa bez NgControl — używamy własnego `a22-field-error`.
- Datepicker: `provideNativeDateAdapter()` w `providers` KOMPONENTU wrappera.
- Stepper: kroki przez `ng-template[a22Step]` + `contentChildren` + `NgTemplateOutlet`;
  nawigacja przez publiczne `next()/previous()` (template ref `#stepper`).

## Theming

Tylko `--mat-sys-*` / `--mat-*` + `mat.theme()` w `styles.scss` apki (palety per apka:
azure/rose · violet/cyan). Zakaz `--mdc-*`/`--sys-*` (cicho nie działają) i `::ng-deep`.
