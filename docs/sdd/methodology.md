# SDD (Spec-Driven Development) — angular22

> **SDD methodology canon** for angular22 — **this file** (inspired by:
> [github/spec-kit](https://github.com/github/spec-kit)). Repo-local adaptation: verbs,
> agents, gates and commands specific to angular22. The executable layer lives in the repo:
> `tools/scripts/validate-sdd.mjs` + `tools/scripts/workflow-specify.mjs`, prompts `/clarify` +
> `/analyze` in `.github/prompts/`.

## Cycle (mapping to spec-kit)

| spec-kit                | here                                         | artifact / mechanism                                                                   |
| ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `/speckit.constitution` | `copilot-instructions` + `instructions/*`    | existing rules (not a duplicate)                                                       |
| **(input)**             | **doc-review** → `doc-reviewer`              | task doc ↔ docs/Confluence ↔ mockups consistent; **STOP on ambiguity** BEFORE the spec |
| `/speckit.specify`      | `pnpm workflow:specify -- --verb=… --slug=…` | `docs/specs/<slug>/spec.md` (with `[?]`)                                               |
| `/speckit.clarify`      | `/clarify <slug>`                            | closes `[?]`, `status: draft → clarified`                                              |
| `/speckit.plan`         | orchestrator (plan-first)                    | `docs/plans/<stamp>_<verb>-<slug>.md`                                                  |
| `/speckit.tasks`        | **folded** into the plan table               | `id \| title \| agent \| done_when \| status \| model \| blocked_by`                   |
| `/speckit.analyze`      | `/analyze`                                   | go/no-go report (read-only)                                                            |
| `/speckit.checklist`    | `/checklist`                                 | quality checklist — readiness gate BEFORE code (read-only)                             |
| `/speckit.implement`    | delegation to a specialist (subagent)        | code + tests                                                                           |

The ladder is closed by the **verify** step = **re-verification** (orchestrator/Opus, a second pass **after**
tests): DoD + **every AC** + e2e + integration tests (when API) + **interactive-element sweep
per role** (admin/user/guest) → verdict + bug report + telemetry in the run-log
(`docs/runs/<stamp>_<slug>.md`).

## Threshold rule

- **Question / trivial in-file edit** → directly, without SDD artifacts.
- **≥2 files or a behaviour change** → **doc-review** → full ladder specify → clarify → plan →
  analyze → **checklist** (quality gate BEFORE code) → implement → verify → DoD (`pnpm verify`).

## STOP on ambiguity (hard gate)

At **EVERY** step of the ladder: if anything is **ambiguous / contradictory / incomplete** → **STOP**.
**Don't guess** — ask the user or leave `[?]` and halt the ladder. Ambiguity =
**blocker**. Especially: **doc-review** (input task documentation ↔ docs/Confluence ↔
mockups — BEFORE the spec) and **clarify** (`[?]` in the spec).

## Step = mark in plan + commit

Each completed ladder step: (1) mark the `status` column in the **plan table** as `done`,
(2) make a **commit** (conventional, via `scm`) referencing the step / run-log. **One step
= one commit** — granular, auditable history. The `status` column is in `templates/plan.md`;
plans predating the rule are grandfathered, `validate-sdd` does not enforce it.

## angular22 verbs

`feature` (new function) · `component` (new component/wrapper via generator) ·
maintenance: `fix` / `refactor` / `deps` / `chore` / `security`. Verbs are free-form
(`[a-z0-9-]+`) — `validate-sdd` does not hardcode them.

## Test triad (mandatory in every change plan)

1. **Test scenarios** derived from Acceptance criteria (happy + edge per AC),
2. **unit tests** — Vitest (`pnpm nx run <lib>:test`, executor `@nx/vitest:test`),
3. **e2e tests** — Playwright (`pnpm nx run <app>-e2e:e2e`, executor
   `@nx/playwright:playwright`) and/or a live browser via the **MCP `playwright`** server.

Any missing item = **no-go** in final verification.

## Artifacts (versioned in `docs/`)

Shape → [`templates/spec.md`](templates/spec.md) · [`templates/plan.md`](templates/plan.md) ·
[`templates/run.md`](templates/run.md); **agent-response shape** (doc-review · scenarios ·
analyze · review · audit · documentation) → [`templates/README.md`](templates/README.md).
`docs/specs|plans|runs` are **tracked in git** —
**every change goes through SDD, and the record lands in `docs/`** (spec + plan + dated
run-log). The `pnpm sdd:check` gate enforces spec↔plan consistency (part of `pnpm verify`).

**Task versioning:** if the slug already exists (`docs/specs/<slug>/`), `pnpm workflow:specify`
**does not overwrite** — it creates the next version `<slug>-v2` / `-v3` / … (a new iteration of the same
task has its own spec/plan/run-log). The history of previous versions stays in `docs/`.

## Telemetry + bug report (accounting for a closed task)

The **verify / DoD** step closes the run-log with **two** sections: **Bug report / problems encountered**
(step · bug · cause · fix · status — the full trace, not just successes) **and** **Accounting
/ Telemetry**: **model per step**, **tokens** consumed and **Copilot credits**, number of **background
tasks** and **sessions**, number of agents/subagents. Sources: workflow `usage` (tokens, `agent_count`)
· `TaskList` (background tasks) · `list_sessions` (sessions) · billing dashboard (Copilot credits
— outside repo tooling, manual entry or `n/a`).

## Commands

| Command                                          | SDD step | Effect                                              |
| ------------------------------------------------ | -------- | --------------------------------------------------- |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>` | specify  | scaffold `spec.md` + `plan.md` + dated `run.md`     |
| `/clarify <slug>`                                | clarify  | closes `[?]`, flips `status: clarified`             |
| `/analyze`                                       | analyze  | `sdd:check` + spec↔plan↔code consistency → go/no-go |
| `pnpm sdd:check`                                 | gate     | structural layer (part of `verify`)                 |
