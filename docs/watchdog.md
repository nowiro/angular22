---
type: doc
id: 'doc.watchdog'
title: 'Watchdog — upstream monitoring'
---

# Watchdog — upstream monitoring

The tool (`tools/scripts/watchdog.mjs`) watches sources that matter to the repo and
reports **what changed** since the last run — so stack drift and new Copilot / spec-kit /
Angular practices flow into proposals via **SDD** (`deps` / `chore`). A local dev
tool (requires network) — the repo is **Copilot-only**, with no GitHub Actions.

## Usage

```sh
pnpm watchdog        # fetch, report, update snapshot
pnpm watchdog:check  # report only (snapshot unchanged; exit ≠ 0 when something is new)
```

Each watcher resolves one **marker** (a version or the id of the latest entry) and compares it
against the `tools/watchdog/state.json` snapshot (local, **gitignore** — everyone has their own baseline).
`NEW` = the marker changed since the last run; for npm packages the pin from
`package.json` is also shown (latest ↔ pinned drift).

## What it monitors

- **Stack (npm latest vs pinned):** `@angular/core` · `@angular/material` · `nx` · `typescript` ·
  `@playwright/test` · `vitest` · `eslint` · `keycloak-angular` · `keycloak-js`.
- **Methodology and Copilot:** [`github/spec-kit`](https://github.com/github/spec-kit) (release —
  SDD phases, e.g. `checklist`), [`angular/angular`](https://github.com/angular/angular) and
  [`nrwl/nx`](https://github.com/nrwl/nx) (release), [GitHub Copilot changelog](https://github.blog/changelog/label/copilot/)
  (date of the latest entry).

## Extending

Add an entry to the `WATCHERS` array in `tools/scripts/watchdog.mjs` — helpers: `npm(name)`,
`ghRelease(repo, label)`, `page(id, label, url, regex)`. Treat each `NEW` as a candidate for SDD:
a bump via `deps`/`migration` (canon → [`tech-stack.md`](tech-stack.md)) or adopting a practice
(e.g. a new spec-kit phase) via `chore`.
