---
name: angular-developer
description: Wzorce nowoczesnego Angulara 22 dla angular22 (zoneless, standalone, signals-first) — sygnały/computed/effect, control flow @if/@for/@switch, DI inject(), wejścia input()/model(), OnPush, routing, a11y, testy. Szeroki przewodnik; szczegóły w skillach signal-forms/material-wrappers/nx-generators. Użyj przy logice komponentu/serwisu poza formularzami.
---

# Angular 22 — szeroki przewodnik repo

Warstwa łącząca dla **logiki komponentu/serwisu**. Granice: **formularze** →
[`signal-forms`](../signal-forms/SKILL.md); **Material/theming** →
[`material-wrappers`](../material-wrappers/SKILL.md); **tworzenie komponentu/liba** →
[`nx-generators`](../nx-generators/SKILL.md). Konwencje → [`angular.instructions`](../../instructions/angular.instructions.md),
reguły lintu → [`code-quality.instructions`](../../instructions/code-quality.instructions.md). Niepewne API → MCP
`angular-cli`/`context7`, **nie z pamięci**. Pełne reguły: [`copilot-instructions`](../../copilot-instructions.md).

## Reaktywność (signals-first)

**Zoneless by construction** — brak zone.js w polyfills (default Angular 22, bez jawnego
providera). Stan **wyłącznie w sygnałach**; metody szablonu lekkie (bez I/O, bez pętli).

- `signal()` stan, `computed()` pochodne (memoizowane), `effect()` efekty uboczne — z
  **guardem równości**, by nie zapętlić (wzorzec: PESEL→data urodzenia w `wizard-store.ts`).
- `inject()` zawsze zamiast wstrzykiwania w konstruktorze.
- `linkedSignal()`/`resource()`/`httpResource()` — **brak backendu, brak w repo**; gdy
  pojawi się async (resource dla fetchu, linkedSignal dla writable-pochodnej) — wzorzec
  zalecany, składnię zweryfikuj przez MCP `context7`, nie z pamięci.

## Control flow (natywny, nigdy `*ngIf`/`*ngFor`)

`@if` / `@switch` (wzorzec: `button.component.html`) · `@for` **z obowiązkowym `track`**
(`track item.key` lub `track $index` dla list immutable) · `@defer`/`@placeholder`/`@loading`
— niewykorzystane, **zalecane** dla ciężkich gałęzi (np. embed wizardów). **`ng-content` w
`@if`/`@switch` gubi projekcję** → treść warunkowa przez `input()` (wzorzec `A22ButtonComponent.label`).

## Komponenty

- **Generuj, nie pisz** → [`nx-generators`](../nx-generators/SKILL.md): SCSS · **OnPush** ·
  trzy pliki · prefix `a22`. **Zakaz** inline `template`/`styles`.
- `input()`/`output()`/`model()` zamiast `@Input()`/`@Output()`; `model()` dla dwukierunkowych
  (wzorzec wrapperów). Host binding przez `host: { '[style.display]': "hidden() ? 'none' : 'block'" }`
  (wzorzec `text-field.component.ts`), nie `@HostBinding`.
- Klasa z sufiksem `Component`; selektor `a22-*`. Złożoność `cognitive-complexity ≤ 15` —
  rozbijaj na `computed`/metody pomocnicze.

## DI i routing

- Providery na poziomie **route/komponentu** (np. `provideNativeDateAdapter()` w datepickerze),
  globalne w `app.config.ts`. `inject()` działa w injection context (pole, `constructor`,
  factory) — poza nim cachuj referencję.
- `provideRouter(appRoutes, withComponentInputBinding())` → **param/`data` trasy jako `input()`**
  (wzorce: `wizard-shell.component.ts`, `embed-host.component.ts`). Trasy **lazy** przez
  `loadComponent: () => import(...)`. Brak `ActivatedRoute` gdy hostowane jako web component
  (portal embeduje wizardy przez `@angular/elements`) — komponent musi to znieść.
- **Brak SSR/hydracji** (`provideClientHydration`/`@angular/ssr` nieobecne) — apki to czyste SPA.

## Dostępność (a11y)

ARIA tylko gdy semantyka HTML nie wystarcza · `focus-visible` · poprawne `role` ·
`click-events-have-key-events` + `interactive-supports-focus` (lint error). **Audyt na żywej
apce** (`pnpm start:*`) przez agenta `ux-verifier` — overflow, kontrast, RWD, i18n; nie z kodu.

## Styl i testy

- **Styl**: SCSS w trzecim pliku; kolory tylko tokeny `--mat-sys-*`; zakaz `--mdc-*`/`::ng-deep`
  → [`material-wrappers`](../material-wrappers/SKILL.md).
- **Testy**: Vitest unit w libach (agent `vitest`) + Playwright e2e z `data-testid` (agent
  `playwright`). Każdy plan: scenariusze z AC + unit + e2e — brak = no-go.

## NIE

- ❌ wzorce zone.js / `zone.js` w polyfills · stan poza sygnałami.
- ❌ `@for` bez `track` · `*ngIf`/`*ngFor` · inline `template`/`styles`.
- ❌ `@Input()`/`@Output()`/DI w konstruktorze · `@HostBinding` (użyj `host:`).
- ❌ omijanie wrapperów Material · `@angular/material` poza `libs/ui/material`.
- ❌ formularze ręcznie / `FormGroup` / `ngModel` — **tylko** Signal Forms → [`signal-forms`](../signal-forms/SKILL.md).
- ❌ niepewne API z pamięci — MCP `angular-cli`/`context7`.
