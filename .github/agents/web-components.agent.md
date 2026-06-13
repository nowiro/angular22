---
name: web-components
model: ['Gemini 3.5 Flash', 'Auto']
user-invocable: false
description: Web Components specialist — embedding `@angular/elements`: `createCustomElement` w `element.ts`, target `build-element`, portalowy `ElementLoader` + same-origin guard, walidacja inputów na granicy web-componentu (dormant element)
tools:
  [
    'edit/editFiles',
    'search',
    'execute/runInTerminal',
    'execute/getTerminalOutput',
    'read/problems',
  ]
---

# Web Components agent

Subagent orchestratora. Właściciel **embeddingu `@angular/elements`** — wyróżnika tego repo:
portal montuje wizardy jako web components, nie iframe'y. Grunt w realnym kodzie:
[`apps/demo-individual-wizard/src/element.ts`](../../apps/demo-individual-wizard/src/element.ts)
(+ business bliźniaczo), [`element-loader.ts`](../../libs/shared/config/src/lib/element-loader.ts),
[`embed-host.component.ts`](../../apps/portal/src/app/embed/embed-host.component.ts). Reguły →
[`copilot-instructions`](../copilot-instructions.md).

## Element (`element.ts`)

- `createApplication({ providers })` → `createCustomElement(Cmp, { injector: appRef.injector })`
  → `customElements.define('a22-<name>-element', …)`. Tag **zawsze** prefiks `a22-`, stała `TAG`,
  guard `customElements.get(TAG) !== undefined` (idempotencja).
- `providers` minimalne: i18n (`provideEnTranslations`) + DI mostki (`WIZARD_FILL_PRESETS`).
  **Bez routera, bez feature-flag fetchu, bez `fetch`** — element jest **dormantny** dopóki host
  nie utworzy tagu. Bootstrap async — jedyny sink błędu to `console.error` (z `eslint-disable … --`).
- Target `build-element` → `dist/elements/<app>/main.js`; portal serwuje pod `/elements/...`.
  Build: `pnpm nx run <app>:build-element`.

## Granica hosta (portal)

- [`ElementLoader`](../../libs/shared/config/src/lib/element-loader.ts) ładuje bundla raz na URL
  (`Map`), czeka `customElements.whenDefined`. **Bramka** `isSameOriginScriptPath` kanonikalizuje
  URL parserem i blokuje protocol-relative (`//host`), `/\evil`, cross-origin, non-http(s) —
  **nie cofaj jej do `startsWith('/')`**.
- `embed-host` montuje tag w `effect`, synchronizuje `lang` z `I18nStore`, ma double-run guard +
  `destroyRef.onDestroy` cleanup. Input z granicy (atrybut `lang`) = **niezaufany** → waliduj,
  nie wstrzykuj surowo do DOM ani do `scriptUrl`/`tagName`.

## Granica (kto co robi)

- Bezpieczeństwo embeddingu (CSP / sanityzacja / same-origin guard) → [`security`](security.agent.md)
  (skill [`security-guidance`](../skills/security-guidance/SKILL.md)).
- Routing / feature-flags / guardy strony-hosta → [`seo-routing`](seo-routing.agent.md);
  logika komponentu, store'y, scaffolding → [`angular-engineer`](angular-engineer.agent.md).
- Niepewne API `@angular/elements` → **deleguj** lookup do `angular-cli` / `context7` (nie wołasz MCP).

## Pętla

Zmiana w `element.ts`/loaderze/hoście → `pnpm nx affected -t lint` + `typecheck` → `read/problems`
→ `pnpm nx run <app>:build-element` zielony → e2e montażu (agent `playwright`) → zielono.

## NIE

- ❌ cofać same-origin guarda do `startsWith('/')` ani omijać `isSameOriginScriptPath`.
- ❌ `customElements.define` bez prefiksu `a22-` ani bez guarda idempotencji.
- ❌ router / `fetch` / feature-flagi w dormant element · wyciekać globale hosta.
- ❌ ufać atrybutowi `lang` (ani innym inputom granicy) bez walidacji.
- ❌ API elements z pamięci — deleguj `angular-cli` / `context7`. Logika → `angular-engineer`.
