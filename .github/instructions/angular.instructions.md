---
applyTo: '{apps,libs}/**'
description: Konwencje Angular 22 dla angular22 — Signal Forms, wrappery Material, generatory Nx, i18n PL/EN, trzy pliki na komponent
---

# Angular 22 — konwencje repo

Auto-ładowane na `apps/**` i `libs/**`. Reguły lintu → `code-quality.instructions.md`
(przeczytaj NAJPIERW). Głębsze przepisy → skille `angular-developer` (szeroki przewodnik),
`signal-forms`, `material-wrappers`, `nx-generators`, `angular-new-app`, `frontend-design`.

## Komponenty

- **Generuj, nie pisz ręcznie:** `pnpm nx g @nx/angular:component <name>
--directory=<projekt>/src/lib/<name>` — defaults z `nx.json`: SCSS, OnPush, prefix `a22`,
  **trzy pliki** (`.ts` + `.html` + `.scss`, `templateUrl`/`styleUrl`). Inline
  template/styles są zakazane.
- Zoneless (bez zone.js w polyfills) — stan wyłącznie w sygnałach; metody szablonu lekkie.
- `ng-content` w gałęziach `@if`/`@switch` **gubi projekcję** — treść warunkowa przez
  inputy (wzorzec: `A22ButtonComponent.label`).

## Formularze = Signal Forms (jedyny wzorzec)

Model `signal<T>()` + walidacja `schema()` (`required`/`validate`/`applyWhen`/`applyEach`/
`hidden`/`disabled`, komunikaty **PL**) + bindowanie `[formField]`. Store per wizard
(`form()` w polu serwisu root, helpery tablic = immutable `model.update`). Zakaz
`FormGroup`/`FormBuilder`/`ngModel`. Wrappery pól = `FormValueControl`/`FormCheckboxControl`.
Warunki widoczności: te same predykaty w schemacie (`applyWhen`+`hidden`) i szablonie (`@if`).

## Material — tylko wrappery

`@angular22/ui-material` (`a22-text-field`, `a22-select`, `a22-checkbox`, `a22-date-field`,
`a22-number-field`, `a22-button`, `a22-card`, `a22-toolbar`, `a22-icon`, `a22-divider`,
`a22-wizard-stepper`, `A22NotificationService`). Brakuje wrappera → dodaj go w
`libs/ui/material` (agent `material-wrapper`), nie omijaj bramki. Theming: tokeny
`--mat-sys-*` + `mat.theme()` w `styles.scss` apki; zakaz `--mdc-*`/`--sys-*`/`::ng-deep`.

## i18n (PL domyślny, EN drugi)

- Teksty UI w szablonach: **literał PL przez pipe `a22T`** (`@angular22/shared-i18n`):
  `{{ 'Dalej' | a22T }}`, `[label]="'Imię' | a22T"`. PL string **jest kluczem**; EN żyje w
  mapach `*-translations.en.ts` (brak wpisu → fallback PL).
- W TS (computed/serwisy): `inject(I18nStore).t('…')` — reaktywne względem języka.
- Wrappery tłumaczą same: opcje selectów, komunikaty błędów, etykiety zgód — słowniki i
  schematy w libach data zostają **po polsku** i niczego nie importują z i18n.
- Nowy tekst = literał PL w szablonie + wpis EN w mapie tłumaczeń tej samej warstwy.
- Przełącznik: `a22-language-switcher` w toolbarach; wybór trwały (`localStorage`),
  `document.documentElement.lang` aktualizowany.

## Testy i weryfikacja

Unit: Vitest w libach (executor `@nx/vitest:test`) — patrz agent `vitest`. E2E: Playwright
(executor `@nx/playwright:playwright`, `data-testid`) — patrz agent `playwright`.
**UX weryfikuj uruchomieniem** (`pnpm start:*`), nie z kodu — agent `ux-verifier`.
