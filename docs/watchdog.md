---
type: doc
id: 'doc.watchdog'
title: 'Watchdog — monitoring upstreamów'
---

# Watchdog — monitoring upstreamów

Narzędzie (`tools/scripts/watchdog.mjs`) pilnuje źródeł, które mają znaczenie dla repo, i
raportuje **co się zmieniło** od ostatniego uruchomienia — żeby drift stacku oraz nowe praktyki
Copilot / spec-kit / Angular trafiały do propozycji przez **SDD** (`deps` / `chore`). Lokalne
narzędzie dev (wymaga sieci) — repo jest **Copilot-only**, bez GitHub Actions.

## Użycie

```sh
pnpm watchdog        # pobierz, zaraportuj, zaktualizuj snapshot
pnpm watchdog:check  # tylko raport (snapshot bez zmian; exit ≠ 0 gdy coś nowego)
```

Każdy watcher rozwiązuje jeden **marker** (wersja albo id ostatniego wpisu) i porównuje go ze
snapshotem `tools/watchdog/state.json` (lokalny, **gitignore** — każdy ma własny baseline).
`NEW` = marker zmienił się od ostatniego uruchomienia; przy paczkach npm pokazywany jest też pin
z `package.json` (drift latest ↔ pinned).

## Co monitoruje

- **Stack (npm latest vs pinned):** `@angular/core` · `@angular/material` · `nx` · `typescript` ·
  `@playwright/test` · `vitest` · `eslint` · `keycloak-angular` · `keycloak-js`.
- **Metodyka i Copilot:** [`github/spec-kit`](https://github.com/github/spec-kit) (release —
  fazy SDD, np. `checklist`), [`angular/angular`](https://github.com/angular/angular) i
  [`nrwl/nx`](https://github.com/nrwl/nx) (release), [changelog GitHub Copilot](https://github.blog/changelog/label/copilot/)
  (data ostatniego wpisu).

## Rozszerzanie

Dodaj wpis do tablicy `WATCHERS` w `tools/scripts/watchdog.mjs` — helpery: `npm(name)`,
`ghRelease(repo, label)`, `page(id, label, url, regex)`. Każde `NEW` rozważ jako wejście do SDD:
bump przez `deps`/`migration` (kanon → [`tech-stack.md`](tech-stack.md)) albo adaptacja praktyki
(np. nowa faza spec-kit) przez `chore`.
