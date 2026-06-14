# AGENTS.md — angular22

Single source of truth dla agentów. Repo **tylko dla GitHub Copilot** (reguły / stack /
język → [`copilot-instructions.md`](.github/copilot-instructions.md)). **Jeden widoczny
agent**: `orchestrator`; reszta ma `user-invocable: false` i jest wołana jako subagenci.
Guard `pnpm ai:validate` wymusza 1 widocznego. Po zmianie agentów: **Reload Window**.

## Agenci

| Agent                                                          | Model        | Rola                                                                                                             |
| -------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| [`orchestrator`](.github/agents/orchestrator.agent.md)         | Opus 4.8     | **widoczny** — SDD (specify→…→verify), routing, delegacja, weryfikacja końcowa, bramka DoD                       |
| [`angular-engineer`](.github/agents/angular-engineer.agent.md) | Gemini Flash | komponenty (przez `nx g`) / Signal Forms / store'y / i18n; kod lint-clean z miejsca                              |
| [`typescript`](.github/agents/typescript.agent.md)             | Gemini Flash | typy / generyki / modele / kontrakty (TS 6 strict); współpraca z `eslint`                                        |
| [`styles`](.github/agents/styles.agent.md)                     | Gemini Flash | SCSS komponentów / layout / RWD na tokenach `--mat-sys-*` (system tokenów → `material-wrapper`)                  |
| [`html`](.github/agents/html.agent.md)                         | Gemini Flash | szablony — semantyka / a11y / control flow / `data-testid` / `a22T`                                              |
| [`seo-routing`](.github/agents/seo-routing.agent.md)           | Gemini Flash | routing / guardy / lazy + SEO (`Title`/`Meta`); SPA-aware                                                        |
| [`performance`](.github/agents/performance.agent.md)           | Gemini Flash | budżety bundla / lazy + `@defer` / koszt change-detection / CWV (SPA)                                            |
| [`i18n`](.github/agents/i18n.agent.md)                         | Gemini Flash | spójność map PL/EN / pokrycie `a22T` / brakujące + osierocone klucze                                             |
| [`material-wrapper`](.github/agents/material-wrapper.agent.md) | Gemini Flash | `libs/ui/material` — wrappery `FormValueControl`, theming `--mat-sys-*`, strażnik bramki                         |
| [`eslint`](.github/agents/eslint.agent.md)                     | Gemini Flash | lint — triage + fix, audyt configu, sync destylatu `code-quality.instructions`                                   |
| [`vitest`](.github/agents/vitest.agent.md)                     | Gemini Flash | testy jednostkowe libów (`@nx/vitest:test`), scenariusze z AC, determinizm                                       |
| [`playwright`](.github/agents/playwright.agent.md)             | Gemini Flash | suity e2e (`@nx/playwright:playwright`) + debug na żywej przeglądarce (MCP `playwright`)                         |
| [`ux-verifier`](.github/agents/ux-verifier.agent.md)           | Gemini Flash | audyt UX/UI na żywej apce — overflow, nakładki, RWD, kontrast, i18n (read-only)                                  |
| [`pixel-perfect`](.github/agents/pixel-perfect.agent.md)       | Gemini Flash | wierność wizualna + RWD vs **mockupy** na żywej apce (read-only); bez mockupów = N/A                             |
| [`accessibility`](.github/agents/accessibility.agent.md)       | Gemini Flash | audyt WCAG 2.1 AA na poziomie kodu (read-only); runtime → `ux-verifier`                                          |
| [`reviewer`](.github/agents/reviewer.agent.md)                 | Gemini Flash | review diffu / go-no-go (read-only)                                                                              |
| [`doc-reviewer`](.github/agents/doc-reviewer.agent.md)         | Gemini Flash | bramka wejścia — dok. zadania ↔ docs/Confluence ↔ mockupy; STOP na niejasności (read-only)                       |
| [`doc-verifier`](.github/agents/doc-verifier.agent.md)         | Gemini Flash | słownikowy matcher docs ↔ kod — glosariusz terminów, luki + rename'y nazw (read-only)                            |
| [`security`](.github/agents/security.agent.md)                 | Gemini Flash | audyt web-security diffu/feature — XSS/embed `@angular/elements`/fetch/storage/deps (read-only)                  |
| [`keycloak`](.github/agents/keycloak.agent.md)                 | Gemini Flash | auth/RBAC — integracja `shared-auth` (provideAuth/AuthStore/`*a22HasRole`/roleGuard), authz per rola (read-only) |
| [`deps`](.github/agents/deps.agent.md)                         | Gemini Flash | higiena zależności — ncu / CVE / lockfile / licencje (verb `deps`)                                               |
| [`stack-guardian`](.github/agents/stack-guardian.agent.md)     | Gemini Flash | zgodność ze stackiem — off-stack / pinowanie / spójność wg `docs/tech-stack.md` (read-only)                      |
| [`nx-architect`](.github/agents/nx-architect.agent.md)         | Gemini Flash | granice modułów / tagi `scope:*`/`type:*` / graf / public API                                                    |
| [`migration`](.github/agents/migration.agent.md)               | Gemini Flash | `ng update`/`nx migrate` + schematic'y modernizacji (standalone→zoneless, v19–22; skill `angular-migrations`)    |
| [`web-components`](.github/agents/web-components.agent.md)     | Gemini Flash | embedding `@angular/elements` — element.ts / loader / same-origin guard                                          |
| [`docs`](.github/agents/docs.agent.md)                         | Gemini Flash | README / JSDoc / sync AGENTS ↔ kod / changelog (DRY: wskazuje kanon)                                             |
| [`scm`](.github/agents/scm.agent.md)                           | Gemini Flash | conventional commits / opisy PR / higiena brancha                                                                |
| [`test-strategy`](.github/agents/test-strategy.agent.md)       | Gemini Flash | projekt scenariuszy z AC / luki pokrycia (read-only; exec → vitest/playwright)                                   |
| [`meta-reviewer`](.github/agents/meta-reviewer.agent.md)       | Gemini Flash | audyt jakości configu AI — DRY/SRP/house-style (read-only)                                                       |
| [`nx`](.github/agents/nx.agent.md)                             | GPT-5 mini   | serwer MCP `nx` — docs/generatory/graf zamiast zgadywania flag                                                   |
| [`context7`](.github/agents/context7.agent.md)                 | GPT-5 mini   | serwer MCP `context7` — up-to-date docs bibliotek                                                                |
| [`angular-cli`](.github/agents/angular-cli.agent.md)           | GPT-5 mini   | serwer MCP `angular-cli` — best-practices / przykłady Angular 22 / Material                                      |

## Modele (token economy)

| Tier            | Model              | Agenci                                                                                                                                                                                                                                                                                                                                                           | Po co                                            |
| --------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **orchestrate** | `Claude Opus 4.8`  | orchestrator                                                                                                                                                                                                                                                                                                                                                     | plan + delegacja w dół + weryfikacja końcowa     |
| **MCP**         | `GPT-5 mini`       | angular-cli · nx · context7                                                                                                                                                                                                                                                                                                                                      | wołanie serwerów MCP — mechanika                 |
| **reszta**      | `Gemini 3.5 Flash` | angular-engineer · material-wrapper · eslint · vitest · playwright · ux-verifier · reviewer · security · typescript · styles · html · seo-routing · accessibility · performance · i18n · deps · nx-architect · migration · web-components · docs · test-strategy · scm · meta-reviewer · stack-guardian · doc-reviewer · doc-verifier · pixel-perfect · keycloak | kod / testy / e2e / review / audyt UX / security |

Guard `pnpm ai:validate` wymusza: każdy agent ma `model:`, orchestrator prowadzi Opusem,
dokładnie 1 agent widoczny. `model:` pinuje tylko model — 1M context / Thinking Effort
ustawiasz globalnie w pickerze VS Code.

## Workspace

- `apps/*` + `libs/*` (mapa → [`README.md`](README.md)) · `.vscode/mcp.json` (4 serwery
  MCP — tabela w [`mcp-usage`](.github/instructions/mcp-usage.instructions.md)) ·
  `.github/` (`copilot-instructions.md`, `agents/`, `instructions/` auto per `applyTo`,
  `prompts/`: `/clarify`, `/analyze`, `/checklist`, `/brainstorming`, `/feature-dev`; `skills/`:
  `angular-developer`, `angular-new-app`, `signal-forms`, `material-wrappers`, `nx-generators`,
  `frontend-design`, `code-review`, `security-guidance`, `ai-config-quality`, `keycloak-auth`,
  `angular-migrations`).
- `docs/sdd/` — metodologia SDD (adaptacja spec-kit; kanon: [`docs/sdd/methodology.md`](docs/sdd/methodology.md)).
  Artefakty `docs/specs|plans|runs` — **wersjonowane w gicie** (każda zmiana przez SDD → zapis w `docs/`).
- **Observability:** `.vscode/settings.json` (OTel-export Copilota, domyślnie **OFF**) → backend
  trace/eval (Galileo / OTel-only); kanon [`docs/observability.md`](docs/observability.md). Zasila
  sekcję „Telemetria" run-logów automatem. Klucz/endpoint **przez env**, nie w repo.
- **Brak** `CLAUDE.md` / `.claude/` / `.ai/` / `.github/workflows/` — Copilot-only, zero Actions.

## Setup (bootstrap)

Przed pierwszą instalacją projektu:

```sh
# 1. Sprawdź czy pnpm jest dostępny
pnpm --version

# 2. Jeśli brak — zainstaluj globalnie przez npm (wersja = `packageManager` w package.json)
npm install -g pnpm@11.6.0

# 3. Zainstaluj zależności projektu
pnpm install
```

> **Reguła**: Zależności projektu instaluj **wyłącznie przez `pnpm install`**.  
> Nigdy nie używaj `npm install` do instalacji zależności projektu.

## Komendy

| Komenda                                              | Co robi                                                                                                                     |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm verify`                                        | Pełna bramka (= skrypt `verify` w `package.json`): format:check + ai:validate + sdd:check + lint + typecheck + test + build |
| `pnpm ai:validate`                                   | Config Copilot (1 widoczny agent, frontmattery, mcp.json)                                                                   |
| `pnpm sdd:check`                                     | Bramka SDD (spec↔plan, traceability)                                                                                        |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>`     | Scaffold spec + plan + datowany run-log                                                                                     |
| `pnpm e2e`                                           | Wszystkie suity Playwright (`--parallel=1`)                                                                                 |
| `pnpm start` / `start:individual` / `start:business` | Serve apek (portal 4200 / individual 4201 / business 4202)                                                                  |
| `pnpm nx g @nx/angular:component <name>`             | Nowy komponent (SCSS + OnPush + 3 pliki + prefix `a22`)                                                                     |
| `pnpm watchdog` / `watchdog:check`                   | Monitoring upstreamów (npm/spec-kit/Copilot) → propozycje przez SDD (`docs/watchdog.md`)                                    |
