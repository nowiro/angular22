# Deployment plan — portal + wizards + web components + feature flags

> Architecture: the **portal** (`:4200` in dev) hosts the tiles and embeds the wizards as **web
> components** on the `/apps/individual` and `/apps/business` routes; the same wizards also run
> in parallel as **standalone applications** (new tab, with a header). Each application's
> availability is controlled by a **`config.json`** read at runtime — per environment, with no
> rebuild and without removing anything from hosting.

## 1. Build artifacts

| Command                                            | Result                                     | Contents                                                      |
| -------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| `pnpm nx build portal`                             | `dist/apps/portal/browser`                 | portal SPA (also builds both elements — `dependsOn`)          |
| `pnpm nx build demo-individual-wizard`             | `dist/apps/demo-individual-wizard/browser` | standalone wizard (header, router, flag gating)               |
| `pnpm nx build demo-business-wizard`               | `dist/apps/demo-business-wizard/browser`   | standalone wizard                                             |
| `pnpm nx run demo-individual-wizard:build-element` | `dist/elements/demo-individual-wizard`     | `main.js` — ESM registering `<a22-individual-wizard-element>` |
| `pnpm nx run demo-business-wizard:build-element`   | `dist/elements/demo-business-wizard`       | `main.js` — ESM registering `<a22-business-wizard-element>`   |

Full set: `pnpm build` (all apps; elements build as a dependency of the portal).
The portal build **copies `dist/elements/**` into assets** (`/elements/...`), so the portal
artifact is self-contained.

## 2. Hosting layout (recommended: single origin)

```
https://demo.example.com/
├── /                  → dist/apps/portal/browser          (SPA fallback → index.html)
│   ├── /config.json   →   ENVIRONMENT configuration (swappable without a deploy)
│   └── /elements/**   →   web-component bundle (already in the portal artifact)
├── /individual/       → dist/apps/demo-individual-wizard/browser  (SPA fallback)
│   └── /individual/config.json
└── /business/         → dist/apps/demo-business-wizard/browser    (SPA fallback)
    └── /business/config.json
```

Notes:

- **`<base href>`**: standalone wizards served under a sub-path require
  `--base-href /individual/` at build time (`pnpm nx build demo-individual-wizard --base-href /individual/`).
  Alternative: separate subdomains (`individual.demo.example.com`) — then no changes needed.
- **SPA fallback** (nginx): `try_files $uri $uri/ /index.html;` per application.
- **`element.scriptUrl` MUST be a same-origin path** starting with a single
  `/` (not `//`, not an absolute URL). `ElementLoader` deliberately blocks any other origin
  (`libs/shared/config/src/lib/element-loader.ts`) as protection against injecting a
  foreign script via a tampered `config.json` — cross-origin/CDN is intentionally
  **unsupported**. Allowing a CDN would require a code change (origin allowlist)
  **and** widening `script-src` in the CSP **and** adding SRI — see §5.

## 3. `config.json` — feature flags per environment

The file sits NEXT TO each application's `index.html` and is read **before bootstrap**
(`provideFeatureFlags()` → `FeatureFlagsStore`). A change = swapping a single file on
hosting (or in a ConfigMap/volume), **with no rebuild**.

```jsonc
// portal: /config.json
{
  "features": {
    "individual-wizard": {
      "enabled": true, // false → tile disappears + the /apps/individual route does not match
      "standaloneUrl": "https://demo.example.com/individual/",
      "element": {
        "scriptUrl": "/elements/demo-individual-wizard/main.js",
        "tagName": "a22-individual-wizard-element",
      },
    },
    "business-wizard": {
      "enabled": false, // example: disabled on this environment
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
// standalone wizard: /individual/config.json — gates direct access
{ "features": { "individual-wizard": { "enabled": true } } }
```

Semantics:

- **Portal**: `enabled: false` → tile disappears, embed route does not match (deep-link →
  `/`). Omitting `element` → the tile only has the "new tab" action.
- **Standalone wizard**: `enabled: false` → all routes redirect to the
  `/disabled` page ("The application is disabled…"); the files stay on hosting.
- **Fallback**: missing/corrupt `config.json` → safe defaults of "everything enabled"
  (dev-friendly). Production environments SHOULD always expose an explicit file.
- Serve with `Cache-Control: no-store` (the client fetches with `cache: 'no-store'` anyway).

## 4. Deployment procedure (release)

1. `pnpm verify` + `pnpm e2e` — full local gate (zero GitHub Actions — repo policy).
2. `pnpm build` (+ `--base-href` for wizards when hosting under a sub-path).
3. Upload the three `browser/` directories per the §2 layout.
4. Upload/verify `config.json` per application (do NOT copy the dev one from `public/` to prod
   without review — it contains localhost URLs).
5. Smoke: portal `/` (tiles per flags), `/apps/individual` (embed without header),
   `standaloneUrl` in a new tab (with header), the PL/EN switcher.

### Disabling an application on an environment (without a deploy)

Edit the portal's `config.json` (`enabled: false`) **and** that application's `config.json` —
the tile + embed + direct access go dark immediately after a page refresh.

## 5. Decisions and constraints (deliberate)

- **Element = full Angular bundle** (~940 kB raw, ~195 kB transfer): the portal and the element
  are SEPARATE runtimes. Simplicity > sharing; with more remotes, consider
  Native Federation (out of scope for this round).
- **`outputHashing: none` for elements** — fixed `main.js` URL. Cache-bust with a version in
  the path (e.g. `/elements/v2026.06.12/...` + an entry in `config.json`) or a short
  `Cache-Control`.
- **Material overlays** (select panels, datepicker) mount in the portal's `<body>` —
  they inherit the PORTAL theme (azure), not the element's theme (violet for business). A
  cosmetic difference, accepted.
- **Language**: the portal pushes the active language to the element via the `lang` attribute
  (both runtimes also share `localStorage.a22.lang`).
- **Portal CSP**: `script-src 'self'` is the correct and sufficient policy — elements
  are loaded same-origin only (enforced in `ElementLoader`). Cross-origin/CDN is
  intentionally unsupported; were it ever allowed, you'd have to widen `script-src` with that origin,
  add SRI, and relax the gate in code.
- **Step state in embed** lives in memory (no URL) — browser back navigation returns
  to the tiles, not to the previous step.
