# Plan wdrożenia — portal + wizardy + web components + feature flags

> Architektura: **portal** (`:4200` w dev) hostuje kafelki i osadza wizardy jako **web
> components** na trasach `/apps/individual` i `/apps/business`; te same wizardy działają
> równolegle jako **samodzielne aplikacje** (nowa karta, z nagłówkiem). Dostępnością
> każdej aplikacji steruje **`config.json`** czytany w runtime — per środowisko, bez
> rebuilda i bez zdejmowania czegokolwiek z hostingu.

## 1. Artefakty buildu

| Komenda                                            | Wynik                                      | Zawartość                                                      |
| -------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `pnpm nx build portal`                             | `dist/apps/portal/browser`                 | portal SPA (buduje też oba elementy — `dependsOn`)             |
| `pnpm nx build demo-individual-wizard`             | `dist/apps/demo-individual-wizard/browser` | wizard standalone (nagłówek, router, gating flagą)             |
| `pnpm nx build demo-business-wizard`               | `dist/apps/demo-business-wizard/browser`   | wizard standalone                                              |
| `pnpm nx run demo-individual-wizard:build-element` | `dist/elements/demo-individual-wizard`     | `main.js` — ESM rejestrujący `<a22-individual-wizard-element>` |
| `pnpm nx run demo-business-wizard:build-element`   | `dist/elements/demo-business-wizard`       | `main.js` — ESM rejestrujący `<a22-business-wizard-element>`   |

Pełny zestaw: `pnpm build` (wszystkie apki; elementy budują się jako zależność portalu).
Build portalu **kopiuje `dist/elements/**` do assets** (`/elements/...`), więc artefakt
portalu jest samowystarczalny.

## 2. Layout hostingu (rekomendowany: jeden origin)

```
https://demo.example.com/
├── /                  → dist/apps/portal/browser          (SPA fallback → index.html)
│   ├── /config.json   →   konfiguracja ŚRODOWISKA (podmienialna bez deployu)
│   └── /elements/**   →   bundle web-componentów (już w artefakcie portalu)
├── /individual/       → dist/apps/demo-individual-wizard/browser  (SPA fallback)
│   └── /individual/config.json
└── /business/         → dist/apps/demo-business-wizard/browser    (SPA fallback)
    └── /business/config.json
```

Uwagi:

- **`<base href>`**: standalone wizardy serwowane pod pod-ścieżką wymagają
  `--base-href /individual/` przy buildzie (`pnpm nx build demo-individual-wizard --base-href /individual/`).
  Alternatywa: osobne subdomeny (`individual.demo.example.com`) — wtedy bez zmian.
- **SPA fallback** (nginx): `try_files $uri $uri/ /index.html;` per aplikacja.
- **`element.scriptUrl` MUSI być ścieżką same-origin** zaczynającą się od pojedynczego
  `/` (nie `//`, nie absolutny URL). `ElementLoader` celowo blokuje każdy inny origin
  (`libs/shared/config/src/lib/element-loader.ts`) jako ochronę przed wstrzyknięciem
  obcego skryptu przez podmieniony `config.json` — cross-origin/CDN jest świadomie
  **niewspierany**. Dopuszczenie CDN wymagałoby zmiany w kodzie (allowlista originów)
  **oraz** poszerzenia `script-src` w CSP **i** dodania SRI — patrz §5.

## 3. `config.json` — feature flags per środowisko

Plik leży OBOK `index.html` każdej aplikacji i jest czytany **przed bootstrapem**
(`provideFeatureFlags()` → `FeatureFlagsStore`). Zmiana = podmiana jednego pliku na
hostingu (lub w ConfigMap/wolumenie), **bez rebuilda**.

```jsonc
// portal: /config.json
{
  "features": {
    "individual-wizard": {
      "enabled": true, // false → znika kafelek + trasa /apps/individual nie matchuje
      "standaloneUrl": "https://demo.example.com/individual/",
      "element": {
        "scriptUrl": "/elements/demo-individual-wizard/main.js",
        "tagName": "a22-individual-wizard-element",
      },
    },
    "business-wizard": {
      "enabled": false, // przykład: wyłączone na tym środowisku
      "standaloneUrl": "https://demo.example.com/business/",
      "element": {
        "scriptUrl": "/elements/demo-business-wizard/main.js",
        "tagName": "a22-business-wizard-element",
      },
    },
  },
}
```

```jsonc
// standalone wizard: /individual/config.json — gate dostępu bezpośredniego
{ "features": { "individual-wizard": { "enabled": true } } }
```

Semantyka:

- **Portal**: `enabled: false` → kafelek znika, trasa embed nie matchuje (deep-link →
  `/`). Pominięcie `element` → kafelek ma tylko akcję „nowa karta".
- **Wizard standalone**: `enabled: false` → wszystkie trasy przekierowują na stronę
  `/disabled` („Aplikacja jest wyłączona…"); pliki zostają na hostingu.
- **Fallback**: brak/uszkodzony `config.json` → bezpieczne defaulty „wszystko włączone"
  (dev-friendly). Środowiska produkcyjne POWINNY zawsze wystawiać jawny plik.
- Serwuj z `Cache-Control: no-store` (klient i tak fetchuje `cache: 'no-store'`).

## 4. Procedura wdrożenia (release)

1. `pnpm verify` + `pnpm e2e` — pełna lokalna bramka (zero GitHub Actions — polityka repo).
2. `pnpm build` (+ `--base-href` dla wizardów przy hostingu pod pod-ścieżką).
3. Wgraj trzy katalogi `browser/` zgodnie z layoutem §2.
4. Wgraj/zoweryfikuj `config.json` per aplikacja (NIE kopiuj dev-owego z `public/` na prod
   bez przeglądu — zawiera URL-e localhost).
5. Smoke: portal `/` (kafelki wg flag), `/apps/individual` (embed bez nagłówka),
   `standaloneUrl` w nowej karcie (z nagłówkiem), przełącznik PL/EN.

### Wyłączenie aplikacji na środowisku (bez deployu)

Edytuj `config.json` portalu (`enabled: false`) **i** `config.json` tej aplikacji —
kafelek + embed + dostęp bezpośredni gasną natychmiast po odświeżeniu strony.

## 5. Decyzje i ograniczenia (świadome)

- **Element = pełny bundle Angulara** (~940 kB raw, ~195 kB transfer): portal i element
  to OSOBNE runtime'y. Prostota > współdzielenie; przy większej liczbie remote'ów rozważ
  Native Federation (poza zakresem tej rundy).
- **`outputHashing: none` dla elementów** — stały URL `main.js`. Cache-bustuj wersją w
  ścieżce (np. `/elements/v2026.06.12/...` + wpis w `config.json`) albo krótkim
  `Cache-Control`.
- **Overlaye Materiala** (panele selectów, datepicker) montują się w `<body>` portalu —
  dziedziczą motyw PORTALU (azure), nie motyw elementu (violet dla business). Różnica
  kosmetyczna, zaakceptowana.
- **Język**: portal pcha aktywny język do elementu atrybutem `lang` (oba runtime'y
  współdzielą też `localStorage.a22.lang`).
- **CSP portalu**: `script-src 'self'` jest właściwą i wystarczającą polityką — elementy
  są ładowane wyłącznie same-origin (wymuszone w `ElementLoader`). Cross-origin/CDN jest
  celowo niewspierany; gdyby kiedyś go dopuścić, trzeba poszerzyć `script-src` o ten origin,
  dodać SRI i rozluźnić bramkę w kodzie.
- **Stan kroku w embed** żyje w pamięci (bez URL) — nawigacja wstecz przeglądarki wraca
  do kafelków, nie do poprzedniego kroku.
