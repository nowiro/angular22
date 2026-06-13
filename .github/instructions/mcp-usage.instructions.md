---
applyTo: '**'
description: Serwery MCP angular22 (context7, nx, angular-cli, playwright) — kiedy którego użyć + token economy
---

# Serwery MCP — użycie i token economy

Konfiguracja: [`.vscode/mcp.json`](../../.vscode/mcp.json) (bez `inputs`; opcje w polach
`comment`). Zasada nadrzędna: **niepewne API → MCP, nie z pamięci** — repo jest na
Angular 22 i wzorce z pamięci modelu bywają przestarzałe.

**Kto woła MCP:** doc-MCP (`angular-cli`, `nx`, `context7`) wołają **wyłącznie** dedykowani
agenci na `GPT-5 mini` o tych samych nazwach — pozostali agenci (`angular-engineer`,
`material-wrapper`, `typescript`, `styles`, `html`, `seo-routing`, `performance`, `i18n`, `deps`,
`nx-architect`, `migration`, `web-components`, `docs`, …) **delegują**
do nich zapytania, **nie wołają MCP sami**. Serwer `playwright` (żywa przeglądarka) → agenci
`playwright` / `ux-verifier` (runtime, nie doc-lookup).

| Serwer        | Narzędzia                                                           | Kiedy                                                                 |
| ------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `angular-cli` | `get_best_practices` · `search_documentation` · `find_examples`     | **przed** kodem dotykającym API Angular/Signal Forms; best practices  |
| `nx`          | `nx_docs` · `nx_workspace` · `nx_generators` · `nx_project_details` | flagi generatorów/executorów, graf, tagi — zamiast zgadywania         |
| `context7`    | `resolve-library-id` → `query-docs`                                 | docs dowolnej biblioteki (Material 22, Playwright, Vitest, 3rd-party) |
| `playwright`  | browser\_\* (żywa przeglądarka, headed)                             | debug e2e, audyt UX (`ux-verifier`), weryfikacja runtime              |

## Drabina docs

1. Konwencje repo (`angular.instructions`, skille) — najtańsze, zawsze najpierw.
2. `angular-cli` / `nx` — domena Angular/Nx.
3. `context7` — wszystko inne / weryfikacja świeżości.

## Token economy

- Najwęższe zapytanie + konkretny `topic`; jedno pytanie na wywołanie.
- Deleguj minimalnym kontekstem (cel + ścieżki, nie całe pliki — subagent czyta sam).
- Wynik MCP streszczaj (wniosek + minimalny snippet), nie wklejaj całych stron.
- Playwright MCP: `browser_snapshot` (tanie drzewo a11y) przed `browser_take_screenshot`;
  przed zrzutem wyłącz animacje (`* { animation: none !important }`).
