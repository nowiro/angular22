# angular22

Angular 22 + Nx + Angular Material demo monorepo. Two wizard demo apps built **100% on Angular 22
Signal Forms**, with every Angular Material component consumed through Nx wrapper libraries.

## Stack

| Layer       | Choice                                                                 |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | Angular 22 (zoneless, standalone, signals, Signal Forms)               |
| Workspace   | Nx (monorepo, module-boundary lint, task caching)                      |
| UI          | Angular Material 22 (M3 tokens) — wrapped in `@angular22/ui-material`  |
| Unit tests  | Vitest                                                                 |
| E2E tests   | Playwright (`apps/*-e2e`)                                              |
| Lint        | ESLint flat config (angular-eslint, sonarjs, unicorn, import-x, jsdoc) |
| Pkg manager | pnpm                                                                   |

## Apps

| App                      | Port | Description                                               |
| ------------------------ | ---- | --------------------------------------------------------- |
| `angular22`              | 4200 | Landing page linking both wizard demos                    |
| `demo-individual-wizard` | 4201 | Personal-data wizard (PESEL, addresses, survey, consents) |
| `demo-business-wizard`   | 4202 | Company wizard (NIP/REGON/KRS, profile, representatives)  |

## Libraries

| Library                                | Type        | Purpose                                                                                            |
| -------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `@angular22/ui-material`               | ui          | The ONLY place that imports `@angular/material`. Signal-Forms-ready wrappers (`FormValueControl`). |
| `@angular22/wizard-core`               | util        | Step status, option types, shared wizard primitives                                                |
| `@angular22/wizard-validators`         | util        | PESEL / NIP / REGON / KRS / postal / phone validators (pure + Signal Forms adapters)               |
| `@angular22/wizard-ui`                 | ui          | Shared wizard presentation (address form, consent row, summary rows)                               |
| `@angular22/wizard-form-fill`          | ui          | Dev-only "fill form" panel — active on localhost only                                              |
| `@angular22/shared-i18n`               | ui          | Signal-based runtime i18n (PL default), `a22T` pipe, language switcher                             |
| `@angular22/individual-wizard-data`    | data-access | Model, dictionaries, Signal Forms schema, fill preset                                              |
| `@angular22/individual-wizard-feature` | feature     | Step components + wizard shell                                                                     |
| `@angular22/business-wizard-data`      | data-access | Model, dictionaries, Signal Forms schema, fill preset                                              |
| `@angular22/business-wizard-feature`   | feature     | Step components + wizard shell                                                                     |

## Quickstart

```bash
pnpm install
pnpm exec playwright install chromium   # once, for e2e

pnpm start:individual    # http://localhost:4201
pnpm start:business      # http://localhost:4202
pnpm start               # landing, http://localhost:4200
```

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

## i18n

Polish is the **default** UI language, English the second one (toolbar switcher, persisted
in `localStorage`, `document.lang` kept in sync). Runtime i18n is signal-based
(`@angular22/shared-i18n`): Polish source strings ARE the translation keys (gettext-style),
templates use the `a22T` pipe, wrappers translate data-driven texts (select options,
validation messages, consent labels) so data libs stay Polish-only. English maps live next
to each app/feature (`*-translations.en.ts`); a missing entry falls back to Polish.

## Spec-Driven Development + Copilot agents

The repo follows an SDD ladder adapted from [github/spec-kit](https://github.com/github/spec-kit)
(`docs/sdd/methodology.md`): `pnpm workflow:specify` → `/clarify` → plan → `/analyze` →
implement → orchestrator verify → `pnpm verify`. GitHub Copilot is configured with **one
visible agent** (`orchestrator`, Opus-class) and 9 hidden specialists ([`AGENTS.md`](AGENTS.md)),
plus skills (`signal-forms`, `material-wrappers`, `nx-generators`) and auto-applied
instructions that make generated code pass ESLint on the first try. Gates: `pnpm ai:validate`
(exactly 1 visible agent, frontmatter, mcp.json) and `pnpm sdd:check` (spec↔plan traceability).

## Conventions

- **Material wrapper gate** — importing `@angular/material` / `@angular/cdk` outside
  `libs/ui/material` is a lint **error**. Consume `@angular22/ui-material` wrappers.
- **Signal Forms only** — forms are `signal<T>()` models + `form()` schemas
  (`@angular/forms/signals`). No `FormGroup` / `FormBuilder`.
- **Module boundaries** — `scope:*` + `type:*` tags enforced by `@nx/enforce-module-boundaries`.
- **Dev fill panel** — both wizards mount `@angular22/wizard-form-fill`; it renders only on
  `localhost` and fills the form model with checksum-valid fake data (PESEL, NIP, REGON).
- **No GitHub Actions** — verification is local (`pnpm verify`), releases are manual.

## AI tooling

GitHub Copilot only. Instructions live in [`.github/copilot-instructions.md`](.github/copilot-instructions.md);
MCP servers (context7, nx, angular-cli, playwright) in [`.vscode/mcp.json`](.vscode/mcp.json).
