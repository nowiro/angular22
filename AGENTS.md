# AGENTS.md — angular22

Single source of truth for agents. Repo **for GitHub Copilot only** (rules / stack /
language → [`copilot-instructions.md`](.github/copilot-instructions.md)). **One visible
agent**: `orchestrator`; the rest have `user-invocable: false` and are called as subagents.
Guard `pnpm ai:validate` enforces exactly 1 visible. After changing agents: **Reload Window**.

## Agents

| Agent                                                          | Model        | Role                                                                                                                        |
| -------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| [`orchestrator`](.github/agents/orchestrator.agent.md)         | Opus 4.8     | **visible** — SDD (specify→…→verify), routing, delegation, final verification, DoD gate                                     |
| [`angular-engineer`](.github/agents/angular-engineer.agent.md) | Gemini Flash | components (via `nx g`) / Signal Forms / stores / i18n; lint-clean code out of the box                                      |
| [`typescript`](.github/agents/typescript.agent.md)             | Gemini Flash | types / generics / models / contracts (TS 6 strict); works with `eslint`                                                    |
| [`styles`](.github/agents/styles.agent.md)                     | Gemini Flash | component SCSS / layout / RWD on `--mat-sys-*` tokens (token system → `material-wrapper`)                                   |
| [`html`](.github/agents/html.agent.md)                         | Gemini Flash | templates — semantics / a11y / control flow / `data-testid` / `a22T`                                                        |
| [`seo-routing`](.github/agents/seo-routing.agent.md)           | Gemini Flash | routing / guards / lazy + SEO (`Title`/`Meta`); SPA-aware                                                                   |
| [`performance`](.github/agents/performance.agent.md)           | Gemini Flash | bundle budgets / lazy + `@defer` / change-detection cost / CWV (SPA)                                                        |
| [`i18n`](.github/agents/i18n.agent.md)                         | Gemini Flash | PL/EN map consistency / `a22T` coverage / missing + orphaned keys                                                           |
| [`material-wrapper`](.github/agents/material-wrapper.agent.md) | Gemini Flash | `libs/ui/material` — `FormValueControl` wrappers, `--mat-sys-*` theming, gate keeper                                        |
| [`eslint`](.github/agents/eslint.agent.md)                     | Gemini Flash | lint — triage + fix, config audit, sync the `code-quality.instructions` distillate                                          |
| [`vitest`](.github/agents/vitest.agent.md)                     | Gemini Flash | lib unit tests (`@nx/vitest:test`), scenarios from AC, determinism                                                          |
| [`playwright`](.github/agents/playwright.agent.md)             | Gemini Flash | e2e suites (`@nx/playwright:playwright`) + live-browser debug (MCP `playwright`)                                            |
| [`ux-verifier`](.github/agents/ux-verifier.agent.md)           | Gemini Flash | UX/UI audit on the live app — overflow, overlaps, RWD, contrast, i18n (read-only)                                           |
| [`pixel-perfect`](.github/agents/pixel-perfect.agent.md)       | Gemini Flash | visual fidelity + RWD vs **mockups** on the live app (read-only); no mockups = N/A                                          |
| [`accessibility`](.github/agents/accessibility.agent.md)       | Gemini Flash | WCAG 2.1 AA audit at the code level (read-only); runtime → `ux-verifier`                                                    |
| [`reviewer`](.github/agents/reviewer.agent.md)                 | Gemini Flash | diff review / go-no-go (read-only)                                                                                          |
| [`doc-reviewer`](.github/agents/doc-reviewer.agent.md)         | Gemini Flash | entry gate — task doc ↔ docs/Confluence ↔ mockups; STOP on ambiguity (read-only)                                            |
| [`doc-verifier`](.github/agents/doc-verifier.agent.md)         | Gemini Flash | glossary matcher docs ↔ code — term glossary, gaps + name renames (read-only)                                               |
| [`legacy-analyst`](.github/agents/legacy-analyst.agent.md)     | Gemini Flash | import — reverse-engineers a PROVIDED source app (any framework) → inventory + stack mapping; STOP if no source (read-only) |
| [`security`](.github/agents/security.agent.md)                 | Gemini Flash | web-security audit of diff/feature — XSS/embed `@angular/elements`/fetch/storage/deps (read-only)                           |
| [`keycloak`](.github/agents/keycloak.agent.md)                 | Gemini Flash | auth/RBAC — `shared-auth` integration (provideAuth/AuthStore/`*a22HasRole`/roleGuard), per-role authz (read-only)           |
| [`deps`](.github/agents/deps.agent.md)                         | Gemini Flash | dependency hygiene — ncu / CVE / lockfile / licenses (verb `deps`)                                                          |
| [`stack-guardian`](.github/agents/stack-guardian.agent.md)     | Gemini Flash | stack compliance — off-stack / pinning / consistency per `docs/tech-stack.md` (read-only)                                   |
| [`nx-architect`](.github/agents/nx-architect.agent.md)         | Gemini Flash | module boundaries / `scope:*`/`type:*` tags / graph / public API                                                            |
| [`migration`](.github/agents/migration.agent.md)               | Gemini Flash | `ng update`/`nx migrate` + modernization schematics (standalone→zoneless, v19–22; skill `angular-migrations`)               |
| [`web-components`](.github/agents/web-components.agent.md)     | Gemini Flash | embedding `@angular/elements` — element.ts / loader / same-origin guard                                                     |
| [`docs`](.github/agents/docs.agent.md)                         | Gemini Flash | README / JSDoc / sync AGENTS ↔ code / changelog (DRY: points to the canon)                                                  |
| [`scm`](.github/agents/scm.agent.md)                           | Gemini Flash | conventional commits / PR descriptions / branch hygiene                                                                     |
| [`test-strategy`](.github/agents/test-strategy.agent.md)       | Gemini Flash | scenario design from AC / coverage gaps (read-only; exec → vitest/playwright)                                               |
| [`meta-reviewer`](.github/agents/meta-reviewer.agent.md)       | Gemini Flash | AI config quality audit — DRY/SRP/house-style (read-only)                                                                   |
| [`nx`](.github/agents/nx.agent.md)                             | GPT-5 mini   | MCP server `nx` — docs/generators/graph instead of guessing flags                                                           |
| [`context7`](.github/agents/context7.agent.md)                 | GPT-5 mini   | MCP server `context7` — up-to-date library docs                                                                             |
| [`angular-cli`](.github/agents/angular-cli.agent.md)           | GPT-5 mini   | MCP server `angular-cli` — best practices / Angular 22 / Material examples                                                  |

## Models (token economy)

| Tier            | Model              | Agents                                                                                                                                                                                                                                                                                                                                                                            | For what                                          |
| --------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **orchestrate** | `Claude Opus 4.8`  | orchestrator                                                                                                                                                                                                                                                                                                                                                                      | plan + delegate down + final verification         |
| **MCP**         | `GPT-5 mini`       | angular-cli · nx · context7                                                                                                                                                                                                                                                                                                                                                       | calling MCP servers — mechanics                   |
| **rest**        | `Gemini 3.5 Flash` | angular-engineer · material-wrapper · eslint · vitest · playwright · ux-verifier · reviewer · security · typescript · styles · html · seo-routing · accessibility · performance · i18n · deps · nx-architect · migration · web-components · docs · test-strategy · scm · meta-reviewer · stack-guardian · doc-reviewer · doc-verifier · pixel-perfect · keycloak · legacy-analyst | code / tests / e2e / review / UX audit / security |

Guard `pnpm ai:validate` enforces: every agent has `model:`, orchestrator runs on Opus,
exactly 1 visible agent. `model:` pins only the model — 1M context / Thinking Effort
are set globally in the VS Code picker.

## Workspace

- `apps/*` + `libs/*` (map → [`README.md`](README.md)) · `.vscode/mcp.json` (4 MCP
  servers — table in [`mcp-usage`](.github/instructions/mcp-usage.instructions.md)) ·
  `.github/` (`copilot-instructions.md`, `agents/`, `instructions/` auto per `applyTo`,
  `prompts/`: `/clarify`, `/analyze`, `/checklist`, `/brainstorming`, `/feature-dev`, `/import-app`; `skills/`:
  `angular-developer`, `angular-new-app`, `signal-forms`, `material-wrappers`, `nx-generators`,
  `frontend-design`, `code-review`, `security-guidance`, `ai-config-quality`, `keycloak-auth`,
  `angular-migrations`, `app-import`).
- `docs/sdd/` — SDD methodology (spec-kit adaptation; canon: [`docs/sdd/methodology.md`](docs/sdd/methodology.md)).
  Artifacts `docs/specs|plans|runs` — **versioned in git** (every change via SDD → recorded in `docs/`).
- **Observability:** `.vscode/settings.json` (Copilot OTel export, **OFF** by default) → trace/eval
  backend (Galileo / OTel-only); canon [`docs/observability.md`](docs/observability.md). Auto-feeds
  the "Telemetry" section of run-logs. Key/endpoint **via env**, not in the repo.
- **No** `CLAUDE.md` / `.claude/` / `.ai/` / `.github/workflows/` — Copilot-only, zero Actions.

## Setup (bootstrap)

Before the first project install:

```sh
# 1. Check whether pnpm is available
pnpm --version

# 2. If missing — install globally via npm (version = `packageManager` in package.json)
npm install -g pnpm@11.6.0

# 3. Install project dependencies
pnpm install
```

> **Rule**: Install project dependencies **only via `pnpm install`**.  
> Never use `npm install` to install project dependencies.

## Commands

| Command                                              | What it does                                                                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `pnpm verify`                                        | Full gate (= `verify` script in `package.json`): format:check + ai:validate + sdd:check + lint + typecheck + test + build |
| `pnpm ai:validate`                                   | Copilot config (1 visible agent, frontmatters, mcp.json)                                                                  |
| `pnpm sdd:check`                                     | SDD gate (spec↔plan, traceability)                                                                                        |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>`     | Scaffold spec + plan + dated run-log                                                                                      |
| `pnpm e2e`                                           | All Playwright suites (`--parallel=1`)                                                                                    |
| `pnpm start` / `start:individual` / `start:business` | Serve apps (portal 4200 / individual 4201 / business 4202)                                                                |
| `pnpm nx g @nx/angular:component <name>`             | New component (SCSS + OnPush + 3 files + `a22` prefix)                                                                    |
| `pnpm watchdog` / `watchdog:check`                   | Upstream monitoring (npm/spec-kit/Copilot) → proposals via SDD (`docs/watchdog.md`)                                       |
