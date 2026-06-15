# GitHub Copilot — angular22

> Digest for every session. On-demand: MCP servers + token economy →
> [`instructions/mcp-usage.instructions.md`](instructions/mcp-usage.instructions.md);
> lint rules → `instructions/code-quality.instructions.md` (auto on `**/*.ts`);
> Angular conventions → `instructions/angular.instructions.md` (auto on `{apps,libs}/**`);
> agents → [`AGENTS.md`](../AGENTS.md); SDD → [`docs/sdd/methodology.md`](../docs/sdd/methodology.md);
> skills (`.github/skills/`): `angular-developer` · `angular-new-app` · `signal-forms` ·
> `material-wrappers` · `nx-generators` · `frontend-design` · `code-review` · `security-guidance` ·
> `ai-config-quality` · `keycloak-auth` · `angular-migrations` · `app-import`.

## Identity

**angular22** — Nx monorepo **for GitHub Copilot only** (VS Code ≥ 1.121): Angular 22
(zoneless, standalone, signals, **Signal Forms**) + Nx 22 + Angular Material 22. Apps in `apps/*`
(`@angular/build` applications; some also shipped as `@angular/elements` web components that a host
app embeds, gated by runtime feature flags from `config.json`), shared code in `libs/*` (`shared` +
domain libraries). Concrete app/lib map → [`README.md`](../README.md). MCP servers (keyless):
`context7` · `nx` · `angular-cli` · `playwright`.

## Language

Chat **in Polish** (until the user switches); code / git / paths / names — **in
English**. App UI: **PL default, EN second** (i18n via `a22T`). Answer
concisely: outcome over process.

## Hard rules (single source — other files point here)

- ✅ Every task via the **orchestrator** (the only visible agent; `pnpm ai:validate`
  enforces 1) → plan → delegate to a subagent → DoD gate.
- ✅ **SDD by threshold** (canon `docs/sdd/methodology.md`, adapted from
  [github/spec-kit](https://github.com/github/spec-kit)): ≥2 files **or** a behaviour
  change → ladder **doc-review** → specify (`pnpm workflow:specify`) → `/clarify` → plan →
  `/analyze` → `/checklist` (quality gate) → implement → **verify (orchestrator/Opus)**; trivial
  → directly. Verb: `feature` ·
  `component` · `fix` / `refactor` / `deps` / `chore` / `security`. Each iteration →
  **dated run-log** `docs/runs/YYYY-MM-DD_HH-MM_<slug>.md` (step = agent + model + outcome).
- ✅ **doc-review + STOP on ambiguity**: the ladder opens with `doc-reviewer` (task docs ↔
  docs/Confluence ↔ **mockups** consistent + unambiguous) **BEFORE** code; anything unclear /
  contradictory → **STOP, don't guess, ask**. Each step: `status: done` in the plan + **commit per
  step** (`scm`).
- ✅ **Intake gate (docs + source)**: a task needs **documentation/AC** — none provided → **STOP,
  ask** (don't invent a brief). For **import/rewrite** of an external app the **source repo/path/code**
  must be provided → **STOP, ask unless the task targets THIS repo**. Modes: **create**
  (`/feature-dev`) · **modify** (this repo) · **import** (`/import-app` + skill `app-import` → rewrite
  to the **latest Angular**, feature parity).
- ✅ **Tests in every plan** (trio): **test scenarios** (from AC, **per role**
  admin/user/guest — `test-strategy`) + **unit tests** (Vitest, `@nx/vitest:test`) +
  **e2e tests** (Playwright, `@nx/playwright:playwright`; **click through all interactive
  elements per role**; debug via the **MCP `playwright`** server) + **integration when API**.
  Missing = **no-go**.
- ✅ **Lint BEFORE code**: read `code-quality.instructions.md` before you write the
  first line — code must pass `pnpm lint` **on the spot**, with no fix-up round.
- ✅ **Components ONLY via generator**: `pnpm nx g @nx/angular:component`
  (SCSS + OnPush + three files `.ts`/`.html`/`.scss` + prefix `a22`). Never by hand,
  never inline template/styles.
- ✅ **New app = clone `apps/base`** (header-only starter, full `provideAppPlatform` spine): copy
  `apps/base` + `apps/base-e2e`, then swap name / `scope:*` / port / i18n / branding / `depConstraint`
  (skill `angular-new-app`). NOT `nx g @nx/angular:application`, never `ng new`.
- ✅ **Material gate**: `@angular/material/*`/`@angular/cdk/*` only in `libs/ui/material`
  (lint error) — everywhere else use the `@angular22/ui-material` wrappers. Theming only via
  `--mat-sys-*` + `mat.theme()`.
- ✅ **Forms = Signal Forms** (`form()`/`schema()`/`[formField]`); no
  `FormGroup`/`FormBuilder`/`ngModel`.
- ✅ **i18n**: UI text as a PL literal via the `a22T` pipe (PL = key, EN in translation
  maps); new text = PL literal + EN entry. Switcher in the toolbar; PL default.
- ✅ **Uncertain API → MCP** (`angular-cli`/`nx`/`context7`), not from memory. **Verify UX by
  running** (`pnpm start` / `nx serve`), not from the code.
- ✅ **LLM models** (token economy): orchestrator → `Claude Opus 4.8` (plan + final
  verification); **doc-MCP** agents (`angular-cli`, `nx`, `context7`) → `GPT-5 mini` and **only they
  call doc-MCP** (the rest delegate to them); code / tests / e2e / review / UX / specialists
  (`typescript`, `styles`, `html`, `seo-routing`, `accessibility`, `pixel-perfect`, `performance`, `i18n`, `deps`,
  `nx-architect`, `migration`, `web-components`, `docs`, `test-strategy`, `scm`, `meta-reviewer`,
  `keycloak`, …)
  → `Gemini 3.5 Flash`. The
  `ai:validate` guard enforces `model:` + Opus on the orchestrator.
- ❌ No non-Copilot (`CLAUDE.md`/`.claude/`/`.ai/`) and no GitHub Actions — verify locally.
- ✅ **Environment bootstrap**: before `pnpm install` check that `pnpm` is available
  (`pnpm --version`). If missing → `npm install -g pnpm@11.6.0` (version =
  `packageManager` in `package.json` / [`docs/tech-stack.md`](../docs/tech-stack.md)),
  only then `pnpm install`. Never install project dependencies via `npm install`.

## Definition of Done

`pnpm verify` green (full gate; composition → [`AGENTS.md`](../AGENTS.md#commands) / the
`verify` script in `package.json`) + touched `e2e` green + UX from a run. **Final verification =
orchestrator re-verification (Opus) after tests**: every AC + e2e + integration tests (when API) +
**sweep of interactive elements per role** (admin/user/guest). Run-log closed out with **Bug
report** + **Accounting / Telemetry** sections (model per step, tokens, Copilot credits, background tasks,
sessions). After changing agents / models: **Reload Window**.

## Stack

**Canon** (pinned versions · allowed/FORBIDDEN · consistency rules) →
[`docs/tech-stack.md`](../docs/tech-stack.md); enforced by the `stack-guardian` agent. In short:
Angular 22 (zoneless, Signal Forms) · Material 22 (only `@angular22/ui-material` wrappers) ·
Nx 22 · TypeScript 6 · Vitest + Playwright · ESLint flat + Prettier · **pnpm** (only).

## Commands

`pnpm verify` (full gate) · `pnpm e2e` (`--parallel=1`) · `pnpm start` / `pnpm nx serve <app>` ·
`pnpm workflow:specify -- --verb=<v> --slug=<s>` ·
`pnpm ai:validate` · `pnpm sdd:check` · `pnpm nx g @nx/angular:component <name>`.
