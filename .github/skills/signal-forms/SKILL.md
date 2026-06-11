---
name: signal-forms
description: Przepisy Signal Forms (Angular 22 stabilne) dla angular22 — model w signal(), schema() z applyWhen/applyEach/hidden/disabled, store per wizard, FieldTree w komponentach, gotchas repo. Użyj przy każdej pracy nad formularzami.
---

# Signal Forms — przepisy repo

## Architektura (wzorzec obu wizardów)

1. **Model** = czysty interfejs + `initial<X>Data()` w `libs/<wizard>/data/src/lib/models.ts`.
   Gałęzie warunkowe ZAWSZE obecne w modelu; opcjonalne stringi `''` (nie `null`).
2. **Schemat** = `schema<T>((path) => { … })` w `form-schema.ts` — jedyne źródło walidacji.
   Komunikaty **po polsku** (UI tłumaczy je przez i18n po stronie wrappera).
3. **Store** (root `@Injectable`) — `form = form(this.model, schema)`; helpery tablic =
   immutable `model.update`; efekty (np. PESEL → data urodzenia, rebuild zgód) z guardem
   równości, by nie zapętlić.
4. **Komponent** — `[formField]="form.basicData.firstName"` na wrapperze z
   `@angular22/ui-material`; indeks tablicy przez metodę
   `phoneField(i): FieldTree<PhoneValue> { return this.form.contact.phones[i]; }`.

## API (zweryfikowane na v22.0.0)

`form` · `schema` · `apply` / `applyEach` / `applyWhen` / `applyWhenValue` · `validate` /
`validateTree` · `required` / `email` / `pattern` / `min` / `max` / `minLength` /
`maxLength` (opcje `{ message, when }`) · logika `hidden` / `disabled` / `readonly`
(`{ when }`) · typy `FieldTree` / `FieldState` / `FormValueControl` / `FormCheckboxControl`.
Dyrektywa **`FormField`**, selektor `[formField]`.

## Warunki (kanoniczny wzorzec)

Predykat w PURE funkcji (`relevance.ts`) używany **podwójnie**: w schemacie
(`applyWhen(path.x, ({ valueOf }) => shows…(valueOf(path.y)), subschema)` +
`hidden(path.x, { when: … })`) i w szablonie (`@if (relevance().x)`). Walidacja i render
nigdy się nie rozjeżdżają.

## Gotchas (kosztowały debugging — nie powtarzaj)

- Destrukturyzacja `({ value, valueOf })` z FieldContext → `unbound-method`; plikowy
  `eslint-disable` z uzasadnieniem (wzorzec na górze `form-schema.ts`).
- `required(path, { when })` — warunkowy required (PESEL dla PL, KRS dla form z KRS).
- Pola disabled NIE blokują zapisu do **modelu** (store może aktualizować) — blokują UI.
- Testy importujące barrel z `@angular/forms/signals` → `test-setup.ts` z
  `import '@angular/compiler'`.
- Błędy custom: zwracaj `{ kind, message }` lub `null`; fabryki w
  `@angular22/wizard-validators` (`peselError`, `nipError`, …) — empty-pass, łącz z `required`.

## Dev-fill

Preset = kompletny obiekt modelu (`buildXPreset(mode)`) → `model.set(preset)` +
`form().markAsTouched()`. Identyfikatory checksum-valid z `@angular22/wizard-core`.
