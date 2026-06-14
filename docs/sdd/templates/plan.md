---
type: plan
id: 'plan.{{verb}}.{{slug}}'
status: draft
date: '{{date}}'
title: '{{verb}} — {{slug}}'
agents: []
---

# Plan: {{verb}} — {{slug}}

> SDD artifact **versioned** in `docs/plans/`. "Tasks" are **folded** into the table
> below (no separate `tasks.md`). Traceability: `id: plan.<verb>.<slug>` must have a
> `docs/specs/<slug>/spec.md` (`sdd:check`).

## Tasks

> The `model` column = executor tier (orchestration/verification → Claude Opus 4.8 · MCP calls →
> GPT-5 mini · code/test/e2e/review → Gemini 3.5 Flash); must match `model:` in `*.agent.md`.
> The `id | title | agent | done_when` header is enforced by `sdd:check`.
> The `status` column (`todo`/`done`): **mark each completed step `done` and commit** (one
> step = one commit, via `scm`). **Step `0. doc-review`** (`doc-reviewer`) — BEFORE code.
>
> **The test triad is MANDATORY in every change plan:** test scenarios (from AC) +
> unit tests (Vitest) + e2e tests (Playwright / MCP `playwright` server).
> Components ONLY via the generator (`pnpm nx g @nx/angular:component`).

| id   | title                    | agent            | done_when                                                                    | status | model        | blocked_by |
| ---- | ------------------------ | ---------------- | ---------------------------------------------------------------------------- | ------ | ------------ | ---------- |
| T000 | doc-review (input gate)  | doc-reviewer     | task documentation ↔ docs/Confluence ↔ mockups consistent; STOP on ambiguity | todo   | Gemini Flash | —          |
| T001 | Spec — outcome+AC        | orchestrator     | spec.md exists, no `[?]`                                                     | todo   | Opus 4.8     | T000       |
| T002 | Implement                | angular-engineer | code passes lint as-is                                                       | todo   | Gemini Flash | T001       |
| T003 | Test scenarios (from AC) | vitest           | happy + edge per each AC, written down                                       | todo   | Gemini Flash | T001       |
| T004 | Unit tests (Vitest)      | vitest           | coverage of touched libs, green                                              | todo   | Gemini Flash | T002, T003 |
| T005 | e2e tests (Playwright)   | playwright       | happy-path green on the live app                                             | todo   | Gemini Flash | T002, T003 |
| T006 | UX audit (running app)   | ux-verifier      | go (overflow/RWD/contrast)                                                   | todo   | Gemini Flash | T002       |
| T007 | Analyze + verify         | orchestrator     | `/analyze` go + `pnpm verify`                                                | todo   | Opus 4.8     | T004–T006  |

## Notes

[?] Design decisions, risks, ADRs (if irreversible).
