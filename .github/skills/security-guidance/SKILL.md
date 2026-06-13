---
name: security-guidance
description: Checklist bezpieczeństwa web/Angular dla angular22 (repo front-end-only, brak backendu) — sinki XSS, DomSanitizer, embedding @angular/elements + CSP, fetch config.json, params routingu, storage, zależności, sekrety. Użyj przy verbie `security` i zmianach dotykających tych obszarów.
---

# Security guidance — checklist repo

**Zakres szczerze:** to demo **tylko front-end** — trzy apki + liby, **zero backendu**,
zero serwerowego API, stan w sygnałowych store'ach. Więc **nie ma** SQLi / authz / sesji
serwera / SSRF. Powierzchnia ataku jest **kliencka**: sinki DOM, embedding przez
`@angular/elements`, fetch `config.json`, params routingu, storage, zależności, sekrety.
Aktor → agent [`security`](../../agents/security.agent.md). Konwencje →
[`angular.instructions`](../../instructions/angular.instructions.md) ·
[`copilot-instructions`](../../copilot-instructions.md) · [`AGENTS.md`](../../../AGENTS.md).

## 1 · Sinki XSS

Dziś w repo **brak** `innerHTML` / `[innerHTML]`, `DomSanitizer`, `bypassSecurityTrust*`,
`sanitize`, `document.write`, `eval` / `new Function` — i tak ma zostać. Tekst leci przez
**interpolację + `a22T`** (Angular auto-escape'uje). Nowy `[innerHTML]` lub
`bypassSecurityTrust*` = **czerwona flaga**: tylko z udokumentowanym uzasadnieniem w diffie.

## 2 · Zaufanie URL i resource-URL

`[href]="standaloneUrl(...)"` (`home`, `embed-host`) bierze URL z `config.json` →
trzymaj **`target="_blank" rel="noopener"`** (reverse-tabnabbing; tak jest dziś). **Brak**
`window.open` i schematów `javascript:` — nie dodawaj. Nawigacja zawsze `routerLink`, nie
ręczne `location.href`.

## 3 · Embedding `@angular/elements`

`createCustomElement` w obu `element.ts`; portal montuje tag przez `ElementLoader`.
**Bramka jest w [`element-loader.ts`](../../../libs/shared/config/src/lib/element-loader.ts)**:
`isSameOriginScriptPath` kanonikalizuje URL parserem i **blokuje** protocol-relative
(`//host`), `/\evil`, schematy, cross-origin — `config.json` nie wstrzyknie obcego bundla.
Nie cofaj tego do `startsWith('/')`. Element jest dormantny (bez routera/fetchu) — **nie
czytaj globali hosta**, input z granicy (atrybut `lang`) traktuj jak niezaufany.

## 4 · Zewnętrzny fetch (`config.json`)

`provideFeatureFlags` robi `fetch('config.json', { cache: 'no-store' })` same-origin.
**Kształt waliduj** — `mergeAppConfig` sprawdza typy i scala nad `DEFAULT_APP_CONFIG`;
nie `JSON.parse → użyj na ślepo`. Odpowiedź **nigdy** do `eval` ani do DOM jako HTML.
Fallback permisywny (wszystko on) jest świadomy — pamiętaj o tym oceniając tampering.

## 5 · Params routingu / deep-linki

`featureId` wchodzi route-inputem (`withComponentInputBinding`), typ `FeatureId`.
Każdy param/segment **waliduj do allow-listy** przed użyciem; **nigdy** nie wstrzykuj
wartości z URL do DOM ani do `scriptUrl`/`tagName`.

## 6 · Storage

`localStorage` używany **wyłącznie** na język i18n (`a22.lang`, try/catch) — patrz
[`i18n-store.ts`](../../../libs/shared/i18n/src/lib/i18n-store.ts). **Brak** `sessionStorage`.
Reguła: storage = tylko preferencje UI + flagi. **NIGDY** sekrety / PII / tokeny.

## 7 · Zależności

Instalacja **tylko `pnpm install`** (`preinstall: only-allow pnpm`); lockfile pinuje wersje.
`prepare: husky` to jedyny skrypt cyklu — **żadnych niespodzianek w `postinstall`** w
nowych paczkach. Nowa zależność → uzasadnij i sprawdź CVE (pełna bramka `pnpm verify`).

## 8 · Sekrety

**Zero sekretów** w repo i configu. Spójnie z `.vscode/mcp.json` (4 serwery **keyless,
bez `inputs`/promptów**). `config.json` jest publiczny (same-origin, obok `index.html`) —
nie wkładaj tam nic poufnego.

## NIE

- **Nie wymyślaj** zagrożeń serwerowych (SQLi, authz, sesja, SSRF) — **brak backendu**.
- **Nie omijaj** sanitizera / same-origin guarda bez udokumentowanego uzasadnienia.
- **Nie kopiuj** generycznych porad OWASP bez zakotwiczenia w realnym sinku tego repo.
