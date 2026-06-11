# AGENTS.md — angular22

Single source of truth dla agentów. Repo **tylko dla GitHub Copilot** (reguły / stack /
język → [`copilot-instructions.md`](.github/copilot-instructions.md)). **Jeden widoczny
agent**: `orchestrator`; reszta ma `user-invocable: false` i jest wołana jako subagenci.
Guard `pnpm ai:validate` wymusza 1 widocznego. Po zmianie agentów: **Reload Window**.

## Agenci

| Agent                                                          | Model        | Rola                                                                                       |
| -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| [`orchestrator`](.github/agents/orchestrator.agent.md)         | Opus 4.8     | **widoczny** — SDD (specify→…→verify), routing, delegacja, weryfikacja końcowa, bramka DoD |
| [`angular-engineer`](.github/agents/angular-engineer.agent.md) | Gemini Flash | komponenty (przez `nx g`) / Signal Forms / store'y / i18n; kod lint-clean z miejsca        |
| [`material-wrapper`](.github/agents/material-wrapper.agent.md) | Gemini Flash | `libs/ui/material` — wrappery `FormValueControl`, theming `--mat-sys-*`, strażnik bramki   |
| [`eslint`](.github/agents/eslint.agent.md)                     | Gemini Flash | lint — triage + fix, audyt configu, sync destylatu `code-quality.instructions`             |
| [`vitest`](.github/agents/vitest.agent.md)                     | Gemini Flash | testy jednostkowe libów (`@nx/vitest:test`), scenariusze z AC, determinizm                 |
| [`playwright`](.github/agents/playwright.agent.md)             | Gemini Flash | suity e2e (`@nx/playwright:playwright`) + debug na żywej przeglądarce (MCP `playwright`)   |
| [`ux-verifier`](.github/agents/ux-verifier.agent.md)           | Gemini Flash | audyt UX/UI na żywej apce — overflow, nakładki, RWD, kontrast, i18n (read-only)            |
| [`reviewer`](.github/agents/reviewer.agent.md)                 | Gemini Flash | review diffu / go-no-go (read-only)                                                        |
| [`nx`](.github/agents/nx.agent.md)                             | GPT-5 mini   | serwer MCP `nx` — docs/generatory/graf zamiast zgadywania flag                             |
| [`context7`](.github/agents/context7.agent.md)                 | GPT-5 mini   | serwer MCP `context7` — up-to-date docs bibliotek                                          |

## Modele (token economy)

| Tier            | Model              | Agenci                                                                                      | Po co                                        |
| --------------- | ------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **orchestrate** | `Claude Opus 4.8`  | orchestrator                                                                                | plan + delegacja w dół + weryfikacja końcowa |
| **MCP**         | `GPT-5 mini`       | nx · context7                                                                               | wołanie serwerów MCP — mechanika             |
| **reszta**      | `Gemini 3.5 Flash` | angular-engineer · material-wrapper · eslint · vitest · playwright · ux-verifier · reviewer | kod / testy / e2e / review / audyt UX        |

Guard `pnpm ai:validate` wymusza: każdy agent ma `model:`, orchestrator prowadzi Opusem,
dokładnie 1 agent widoczny. `model:` pinuje tylko model — 1M context / Thinking Effort
ustawiasz globalnie w pickerze VS Code.

## Workspace

- `apps/*` + `libs/*` (mapa → [`README.md`](README.md)) · `.vscode/mcp.json` (4 serwery
  MCP — tabela w [`mcp-usage`](.github/instructions/mcp-usage.instructions.md)) ·
  `.github/` (`copilot-instructions.md`, `agents/`, `instructions/` auto per `applyTo`,
  `prompts/`: `/clarify`, `/analyze`, `skills/`: `signal-forms`, `material-wrappers`,
  `nx-generators`).
- `docs/sdd/` — metodologia SDD (adaptacja spec-kit; kanon w `mcp-workspace`).
  Artefakty `docs/specs|plans|runs` — local-only (gitignored).
- **Brak** `CLAUDE.md` / `.claude/` / `.ai/` / `.github/workflows/` — Copilot-only, zero Actions.

## Komendy

| Komenda                                              | Co robi                                                                                |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm verify`                                        | Pełna bramka: format:check + ai:validate + sdd:check + lint + typecheck + test + build |
| `pnpm ai:validate`                                   | Config Copilot (1 widoczny agent, frontmattery, mcp.json)                              |
| `pnpm sdd:check`                                     | Bramka SDD (spec↔plan, traceability)                                                   |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>`     | Scaffold spec + plan + datowany run-log                                                |
| `pnpm e2e`                                           | Wszystkie suity Playwright (`--parallel=1`)                                            |
| `pnpm start` / `start:individual` / `start:business` | Serve apek (4200 / 4201 / 4202)                                                        |
| `pnpm nx g @nx/angular:component <name>`             | Nowy komponent (SCSS + OnPush + 3 pliki + prefix `a22`)                                |
