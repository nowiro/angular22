---
applyTo: '**'
description: angular22 MCP servers (context7, nx, angular-cli, playwright) — when to use which + token economy
---

# MCP servers — usage and token economy

Configuration: [`.vscode/mcp.json`](../../.vscode/mcp.json) (no `inputs`; options in
`comment` fields). Overriding principle: **uncertain API → MCP, not from memory** — the repo is on
Angular 22 and patterns from the model's memory are often outdated.

**Who calls MCP:** doc-MCP (`angular-cli`, `nx`, `context7`) are called **exclusively** by dedicated
agents on `GPT-5 mini` with the same names — the other agents (`angular-engineer`,
`material-wrapper`, `typescript`, `styles`, `html`, `seo-routing`, `performance`, `i18n`, `deps`,
`nx-architect`, `migration`, `web-components`, `docs`, …) **delegate**
queries to them, **they don't call MCP themselves**. The `playwright` server (live browser) → agents
`playwright` / `ux-verifier` / `pixel-perfect` (runtime, not doc-lookup).

| Server        | Tools                                                               | When                                                                                                    |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `angular-cli` | `get_best_practices` · `search_documentation` · `find_examples`     | **before** code touching the Angular/Signal Forms API; best practices                                   |
| `nx`          | `nx_docs` · `nx_workspace` · `nx_generators` · `nx_project_details` | generator/executor flags, graph, tags — instead of guessing                                             |
| `context7`    | `resolve-library-id` → `query-docs`                                 | docs for any library (Material 22, Playwright, Vitest, 3rd-party)                                       |
| `playwright`  | browser\_\* (live browser, headed)                                  | e2e debug, UX audit (`ux-verifier`) + visual fidelity vs mockup (`pixel-perfect`), runtime verification |

## Docs ladder

1. Repo conventions (`angular.instructions`, skills) — cheapest, always first.
2. `angular-cli` / `nx` — Angular/Nx domain.
3. `context7` — everything else / freshness check.

## Token economy

- Narrowest query + a specific `topic`; one question per call.
- Delegate with minimal context (goal + paths, not whole files — the subagent reads them itself).
- Summarize MCP output (conclusion + minimal snippet), don't paste whole pages.
- Playwright MCP: `browser_snapshot` (cheap a11y tree) before `browser_take_screenshot`;
  before a capture disable animations (`* { animation: none !important }`).

## Observability

MCP calls show up as **`execute_tool`** spans in Copilot's OTel trace (VS Code ≥ 1.121) —
cost/latency per server lands in Galileo / the OTel backend. Enabling + span→step map: canon
[`docs/observability.md`](../../docs/observability.md) (OFF by default; key/endpoint via env).
