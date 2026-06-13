# AGENTS.md — angular22

Single source of truth dla agentów. Repo **tylko dla GitHub Copilot** (reguły / stack /
język → [`copilot-instructions.md`](.github/copilot-instructions.md)). **Jeden widoczny
agent**: `orchestrator`; reszta ma `user-invocable: false` i jest wołana jako subagenci.
Guard `pnpm ai:validate` wymusza 1 widocznego. Po zmianie agentów: **Reload Window**.

## Agenci

| Agent                                                          | Model        | Rola                                                                                            |
| -------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- |
| [`orchestrator`](.github/agents/orchestrator.agent.md)         | Opus 4.8     | **widoczny** — SDD (specify→…→verify), routing, delegacja, weryfikacja końcowa, bramka DoD      |
| [`angular-engineer`](.github/agents/angular-engineer.agent.md) | Gemini Flash | komponenty (przez `nx g`) / Signal Forms / store'y / i18n; kod lint-clean z miejsca             |
| [`typescript`](.github/agents/typescript.agent.md)             | Gemini Flash | typy / generyki / modele / kontrakty (TS 6 strict); współpraca z `eslint`                       |
| [`styles`](.github/agents/styles.agent.md)                     | Gemini Flash | SCSS komponentów / layout / RWD na tokenach `--mat-sys-*` (system tokenów → `material-wrapper`) |
| [`html`](.github/agents/html.agent.md)                         | Gemini Flash | szablony — semantyka / a11y / control flow / `data-testid` / `a22T`                             |
| [`seo-routing`](.github/agents/seo-routing.agent.md)           | Gemini Flash | routing / guardy / lazy + SEO (`Title`/`Meta`); SPA-aware                                       |
| [`performance`](.github/agents/performance.agent.md)           | Gemini Flash | budżety bundla / lazy + `@defer` / koszt change-detection / CWV (SPA)                           |
| [`i18n`](.github/agents/i18n.agent.md)                         | Gemini Flash | spójność map PL/EN / pokrycie `a22T` / brakujące + osierocone klucze                            |
| [`material-wrapper`](.github/agents/material-wrapper.agent.md) | Gemini Flash | `libs/ui/material` — wrappery `FormValueControl`, theming `--mat-sys-*`, strażnik bramki        |
| [`eslint`](.github/agents/eslint.agent.md)                     | Gemini Flash | lint — triage + fix, audyt configu, sync destylatu `code-quality.instructions`                  |
| [`vitest`](.github/agents/vitest.agent.md)                     | Gemini Flash | testy jednostkowe libów (`@nx/vitest:test`), scenariusze z AC, determinizm                      |
| [`playwright`](.github/agents/playwright.agent.md)             | Gemini Flash | suity e2e (`@nx/playwright:playwright`) + debug na żywej przeglądarce (MCP `playwright`)        |
| [`ux-verifier`](.github/agents/ux-verifier.agent.md)           | Gemini Flash | audyt UX/UI na żywej apce — overflow, nakładki, RWD, kontrast, i18n (read-only)                 |
| [`accessibility`](.github/agents/accessibility.agent.md)       | Gemini Flash | audyt WCAG 2.1 AA na poziomie kodu (read-only); runtime → `ux-verifier`                         |
| [`reviewer`](.github/agents/reviewer.agent.md)                 | Gemini Flash | review diffu / go-no-go (read-only)                                                             |
| [`security`](.github/agents/security.agent.md)                 | Gemini Flash | audyt web-security diffu/feature — XSS/embed `@angular/elements`/fetch/storage/deps (read-only) |
| [`nx`](.github/agents/nx.agent.md)                             | GPT-5 mini   | serwer MCP `nx` — docs/generatory/graf zamiast zgadywania flag                                  |
| [`context7`](.github/agents/context7.agent.md)                 | GPT-5 mini   | serwer MCP `context7` — up-to-date docs bibliotek                                               |
| [`angular-cli`](.github/agents/angular-cli.agent.md)           | GPT-5 mini   | serwer MCP `angular-cli` — best-practices / przykłady Angular 22 / Material                     |

## Modele (token economy)

| Tier            | Model              | Agenci                                                                                                                                                                                 | Po co                                            |
| --------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **orchestrate** | `Claude Opus 4.8`  | orchestrator                                                                                                                                                                           | plan + delegacja w dół + weryfikacja końcowa     |
| **MCP**         | `GPT-5 mini`       | angular-cli · nx · context7                                                                                                                                                            | wołanie serwerów MCP — mechanika                 |
| **reszta**      | `Gemini 3.5 Flash` | angular-engineer · material-wrapper · eslint · vitest · playwright · ux-verifier · reviewer · security · typescript · styles · html · seo-routing · accessibility · performance · i18n | kod / testy / e2e / review / audyt UX / security |

Guard `pnpm ai:validate` wymusza: każdy agent ma `model:`, orchestrator prowadzi Opusem,
dokładnie 1 agent widoczny. `model:` pinuje tylko model — 1M context / Thinking Effort
ustawiasz globalnie w pickerze VS Code.

## Workspace

- `apps/*` + `libs/*` (mapa → [`README.md`](README.md)) · `.vscode/mcp.json` (4 serwery
  MCP — tabela w [`mcp-usage`](.github/instructions/mcp-usage.instructions.md)) ·
  `.github/` (`copilot-instructions.md`, `agents/`, `instructions/` auto per `applyTo`,
  `prompts/`: `/clarify`, `/analyze`, `/brainstorming`, `/feature-dev`; `skills/`:
  `angular-developer`, `angular-new-app`, `signal-forms`, `material-wrappers`, `nx-generators`,
  `frontend-design`, `code-review`, `security-guidance`).
- `docs/sdd/` — metodologia SDD (adaptacja spec-kit; kanon w `mcp-workspace`).
  Artefakty `docs/specs|plans|runs` — **wersjonowane w gicie** (każda zmiana przez SDD → zapis w `docs/`).
- **Brak** `CLAUDE.md` / `.claude/` / `.ai/` / `.github/workflows/` — Copilot-only, zero Actions.

## Setup (bootstrap)

Przed pierwszą instalacją projektu:

```sh
# 1. Sprawdź czy pnpm jest dostępny
pnpm --version

# 2. Jeśli brak — zainstaluj globalnie przez npm (pinowana wersja ze Stack)
npm install -g pnpm@11.1.3

# 3. Zainstaluj zależności projektu
pnpm install
```

> **Reguła**: Zależności projektu instaluj **wyłącznie przez `pnpm install`**.  
> Nigdy nie używaj `npm install` do instalacji zależności projektu.

## Komendy

| Komenda                                              | Co robi                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm verify`                                        | Pełna bramka: format:check + ai:validate + sdd:check + lint + typecheck + test + build |
| `pnpm ai:validate`                                   | Config Copilot (1 widoczny agent, frontmattery, mcp.json)                              |
| `pnpm sdd:check`                                     | Bramka SDD (spec↔plan, traceability)                                                   |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>`     | Scaffold spec + plan + datowany run-log                                                |
| `pnpm e2e`                                           | Wszystkie suity Playwright (`--parallel=1`)                                            |
| `pnpm start` / `start:individual` / `start:business` | Serve apek (portal 4200 / individual 4201 / business 4202)                             |
| `pnpm nx g @nx/angular:component <name>`             | Nowy komponent (SCSS + OnPush + 3 pliki + prefix `a22`)                                |
