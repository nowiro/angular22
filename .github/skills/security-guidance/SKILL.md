---
name: security-guidance
description: Web/Angular security checklist for angular22 (front-end-only repo, no backend) — XSS sinks, DomSanitizer, embedding @angular/elements + CSP, config.json fetch, routing params, storage, dependencies, secrets. Use for the `security` verb and changes touching these areas.
---

# Security guidance — repo checklist

**Scope, honestly:** this is a **front-end-only** demo — three apps + libs, **zero backend**,
no server API, state in signal stores. So there's **no** SQLi / authz / server sessions /
SSRF. The attack surface is **client-side**: DOM sinks, embedding via
`@angular/elements`, fetching `config.json`, routing params, storage, dependencies, secrets.
Actor → the [`security`](../../agents/security.agent.md) agent. Conventions →
[`angular.instructions`](../../instructions/angular.instructions.md) ·
[`copilot-instructions`](../../copilot-instructions.md) · [`AGENTS.md`](../../../AGENTS.md).

## 1 · XSS sinks

Today the repo has **no** `innerHTML` / `[innerHTML]`, `DomSanitizer`, `bypassSecurityTrust*`,
`sanitize`, `document.write`, `eval` / `new Function` — and it should stay that way. Text goes through
**interpolation + `a22T`** (Angular auto-escapes). A new `[innerHTML]` or
`bypassSecurityTrust*` = a **red flag**: only with a documented rationale in the diff.

## 2 · URL and resource-URL trust

`[href]="standaloneUrl(...)"` (`home`, `embed-host`) takes the URL from `config.json` →
keep **`target="_blank" rel="noopener"`** (reverse tabnabbing; that's how it is today). **No**
`window.open` and no `javascript:` schemes — don't add them. Navigation is always `routerLink`, not
manual `location.href`.

## 3 · Embedding `@angular/elements`

`createCustomElement` in both `element.ts`; the portal mounts the tag via `ElementLoader`.
**The gate is in [`element-loader.ts`](../../../libs/shared/config/src/lib/element-loader.ts)**:
`isSameOriginScriptPath` canonicalizes the URL with a parser and **blocks** protocol-relative
(`//host`), `/\evil`, schemes, cross-origin — `config.json` can't inject a foreign bundle.
Don't revert this to `startsWith('/')`. The element is dormant (no router/fetch) — **don't
read host globals**, treat input from the boundary (the `lang` attribute) as untrusted.

## 4 · External fetch (`config.json`)

`provideFeatureFlags` does `fetch('config.json', { cache: 'no-store' })` same-origin.
**Validate the shape** — `mergeAppConfig` checks types and merges over `DEFAULT_APP_CONFIG`;
not `JSON.parse → use blindly`. The response **never** goes to `eval` or to the DOM as HTML.
The permissive fallback (everything on) is deliberate — keep it in mind when assessing tampering.

## 5 · Routing params / deep links

`featureId` comes in as a route input (`withComponentInputBinding`), type `FeatureId`.
Every param/segment must be **validated against an allow-list** before use; **never** inject
a value from the URL into the DOM or into `scriptUrl`/`tagName`.

## 6 · Storage

`localStorage` is used **exclusively** for the i18n language (`a22.lang`, try/catch) — see
[`i18n-store.ts`](../../../libs/shared/i18n/src/lib/i18n-store.ts). **No** `sessionStorage`.
Rule: storage = only UI preferences + flags. **NEVER** secrets / PII / tokens.

## 7 · Dependencies

Installation **only `pnpm install`** (`preinstall: only-allow pnpm`); the lockfile pins versions.
`prepare: husky` is the only lifecycle script — **no surprises in `postinstall`** in
new packages. A new dependency → justify it and check CVEs (full `pnpm verify` gate).

## 8 · Secrets

**Zero secrets** in the repo and config. Consistent with `.vscode/mcp.json` (4 **keyless
servers, no `inputs`/prompts**). `config.json` is public (same-origin, next to `index.html`) —
don't put anything confidential there.

## DON'T

- **Don't invent** server-side threats (SQLi, authz, session, SSRF) — **no backend**.
- **Don't bypass** the sanitizer / same-origin guard without a documented rationale.
- **Don't copy** generic OWASP advice without anchoring it in a real sink of this repo.
