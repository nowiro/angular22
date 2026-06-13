---
name: angular-new-app
description: Bootstrap nowej apki w angular22 — przez nx g @nx/angular:application (nie ng new): standalone+zoneless, providery (router, feature flags z config.json, i18n), embedding @angular/elements, budżety/port w project.json, tagi scope/type. Użyj przy zakładaniu nowej aplikacji w monorepo.
---

# Nowa aplikacja Angular — przepis repo

Apka = **`@nx/angular:application`**, NIGDY `ng new`. Komponenty/liby/wiring testów →
[`nx-generators`](../nx-generators/SKILL.md). Tu: tylko bootstrap apki.

## Generowanie

```bash
pnpm nx g @nx/angular:application --directory=apps/<name> --name=<name> \
  --prefix=a22 --tags=scope:<scope>,type:app
```

Defaults z `nx.json`: **standalone · zoneless · SCSS · OnPush · prefix `a22`**. `--directory`
= ścieżka apki (`apps/<name>`); `type:app` zawsze, `scope:` z mapy ([nx-generators](../nx-generators/SKILL.md)).
Niepewne flagi → MCP `nx` (`nx_generators`), nie zgadywanie.

## Struktura (kształt portalu/wizardów)

| plik                    | rola                                                                     |
| ----------------------- | ------------------------------------------------------------------------ |
| `src/main.ts`           | `bootstrapApplication(AppComponent, appConfig)` + `.catch` (jedyny sink) |
| `src/app/app.config.ts` | `ApplicationConfig` — wszystkie providery                                |
| `src/app/app.routes.ts` | `Routes` (lazy `loadComponent`, guardy)                                  |
| `src/element.ts`        | TYLKO gdy apka jest osadzalnym web-componentem (patrz niżej)             |

## Providery (kanon — kopiuj z `apps/portal/src/app/app.config.ts`)

```ts
providers: [
  provideBrowserGlobalErrorListeners(),
  provideA22GlobalErrorHandler(), // @angular22/ui-feedback
  provideFeatureFlags(), // @angular22/shared-config — ładuje config.json PRZED bootstrapem
  provideRouter(appRoutes, withComponentInputBinding()),
  provideEnTranslations(<APP>_EN), // @angular22/shared-i18n
];
```

**Zoneless = przez konstrukcję** — brak zone.js w polyfills (default Angular 22). NIE dodawaj
ręcznego `provideZonelessChangeDetection()`. `provideFeatureFlags()` czyta `config.json` przed
pierwszym renderem, więc kafelki i guardy widzą flagi od startu.

## Embedding @angular/elements (gdy apka ma być osadzona w portalu)

Osobny entry `src/element.ts`: `createApplication({ providers })` → `createCustomElement(Cmp, { injector })`
→ `customElements.define('a22-<name>-element', …)`. **Bez routera i bez feature-flags** — host
(portal) trzyma URL i gating (wzór: `apps/demo-individual-wizard/src/element.ts`). Bundle stawia
target `build-element` (osobne budżety, `index:false`, `polyfills:[]`) → `dist/elements/<name>/main.js`,
ładowany same-origin przez `ElementLoader` (`isSameOriginScriptPath` w `libs/shared/config`).
Bezpieczeństwo embeddingu (CSP, same-origin, sinki) → [`security-guidance`](../security-guidance/SKILL.md).

## project.json (executory + port)

`build`/`serve` = `@angular/build:application` / `:dev-server` ([mapa executorów](../nx-generators/SKILL.md)).
Budżety prod: `initial` 1.5mb/2.5mb · `anyComponentStyle` 4kb/8kb (apka osadzalna: `build-element`
ma własne, luźniejsze). **Port serve = pierwszy wolny** po 4200 (portal) · 4201 (individual) ·
4202 (business) → **`4203`**; NIE duplikuj.

## i18n + config.json (krótko)

PL = język źródłowy i klucz (`{{ 'Polski tekst' | a22T }}`); EN dostarcza apka przez
`provideEnTranslations(<APP>_EN)`. `config.json` w `apps/<name>/public/` — **publiczny,
same-origin, per-środowisko** (enable/disable bez rebuildu); kształt = `AppConfig`/`FeatureConfig`
z `@angular22/shared-config`.

## NIE

- **NIE** `ng new` / `ng generate` — wyłącznie `nx g @nx/angular:application`.
- NIE pomijaj tagów `scope:<scope>,type:app`.
- NIE duplikuj portów serve (4200/4201/4202 zajęte → 4203…).
- NIE wkładaj sekretów do `config.json` (publiczny, same-origin); nie ładuj cross-origin skryptów elementów.
- NIE omijaj wrapperów `@angular22/ui-material` ani Signal Forms w nowej apce ([material-wrappers], [signal-forms]).
