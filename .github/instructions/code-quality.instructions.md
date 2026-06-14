---
applyTo: '**/*.{ts,html}'
description: Destylat reguł-error ESLint angular22 — pisz kod lint-clean od pierwszej linii; zero poprawiania po fakcie
---

# Jakość kodu — reguły egzekwowane PRZED pisaniem

Wszystko niżej **egzekwuje `pnpm lint`** ([`eslint.config.mjs`](../../eslint.config.mjs)
— flat config, type-aware przez `projectService`). Pisz zgodnie **od razu** — kod, który
wymaga rundy poprawek po lincie, nie spełnia Definition of Done. Po zmianie configu ESLint
zaktualizuj ten destylat (agent `eslint`).

## TypeScript (typescript-eslint, type-aware)

- `no-explicit-any` — typuj konkretnie; w testach dozwolone.
- `no-floating-promises` / `no-misused-promises` — `await`, `void router.navigate(...)`.
- `consistent-type-imports` — typy przez `import type { X }`.
- `consistent-type-definitions` — `interface`, nie `type` dla kształtów obiektów.
- `explicit-member-accessibility` (`no-public`) — pisz `private`/`protected`, nigdy `public`.
- `no-non-null-assertion` — zamiast `!` użyj zawężenia / `??` / guard.
- `no-unused-vars` — nieużywane parametry prefiksuj `_`.
- `unbound-method` — destrukturyzacja `value`/`valueOf` z FieldContext w schematach Signal
  Forms to udokumentowany idiom → plikowy `eslint-disable` z uzasadnieniem po `--`
  (wzorzec w `libs/*/data/src/lib/form-schema.ts`); nigdzie indziej nie wyłączaj.

## Angular (angular-eslint)

- Selektory: komponent `a22-*` kebab-case, dyrektywa `a22*` camelCase; klasy z sufiksem
  `Component`/`Directive`/`Pipe`/`Service`.
- `prefer-standalone` + `prefer-on-push-component-change-detection` (**error**) — każdy
  komponent standalone + `ChangeDetectionStrategy.OnPush`.
- `prefer-signals` / `prefer-inject` — `input()`/`model()`/`output()`/`computed()` i
  `inject()`; zakaz `@Input()`/`@Output()`/konstruktora DI.
- Szablony: natywny control flow `@if`/`@for (…; track …)`/`@switch` (**nigdy**
  `*ngIf`/`*ngFor`), `prefer-self-closing-tags`, a11y: `click-events-have-key-events`,
  `interactive-supports-focus`, zakaz `[ngClass]`-style any (`template/no-any`).

## SonarJS / Unicorn / import-x

- `sonarjs/cognitive-complexity` ≤ 15 — rozbijaj funkcje zamiast piętrzyć warunki.
- `sonarjs/no-nested-conditional` — zamiast zagnieżdżonych ternarów mapa
  `Record<K, V>` lub `@switch`.
- `sonarjs/no-duplicate-string` (próg 5) — powtarzany literał → stała.
- `sonarjs/different-types-comparison` — nie porównuj z `undefined` wartości, które wg
  typów nie mogą nim być (np. element indeksowanej tablicy) — sprawdzaj `length`.
- `unicorn/filename-case` — pliki kebab-case.
- `unicorn/prefer-node-protocol` — w skryptach `node:fs`, nie `fs`.
- `import/no-default-export` (poza plikami config) · `import/no-cycle`.
- `no-console` (**error**) — żadnych `console.*` w kodzie produkcyjnym.

## Bramki architektoniczne (lint!)

- **Material gate** — `@angular/material/*` i `@angular/cdk/*` wolno importować **tylko**
  w `libs/ui/material` (`no-restricted-imports`). Wszędzie indziej: wrappery
  `@angular22/ui-material`.
- **Signal Forms gate** (Angular ≥ 22) — import/re-export z gołego `@angular/forms` to
  **błąd lintu** (`no-restricted-syntax`): klasyczny reactive/template API (`FormGroup`,
  `FormBuilder`, `FormControl`, `ReactiveFormsModule`, `FormsModule`, `ngModel`) zakazany;
  `ngModel` pada transitywnie (potrzebuje `FormsModule`). Używaj **`@angular/forms/signals`**
  (`form()`/`schema()`/`[formField]`, wrappery pól = `FormValueControl`/`FormCheckboxControl`).
  Brama jest **wersjonowana** (major z `package.json`): na Angularze < 22 reguła jest
  wyłączona — klasyczne formularze wspierane dla checkoutu sprzed migracji.
- **Granice modułów** (`@nx/enforce-module-boundaries`) — `scope:individual-wizard` ⛔
  `scope:business-wizard` (i odwrotnie); warstwy `app → feature → ui/data-access → util`;
  public API liba **tylko** przez `src/index.ts`.

## Format

Prettier (`pnpm format`) z sortowaniem importów (`@angular/*` → 3rd-party → `@angular22/*`
→ relative) i `singleAttributePerLine` w HTML — nie układaj importów/atrybutów ręcznie
wbrew tym grupom.
