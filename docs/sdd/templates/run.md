---
type: run
id: 'run.{{verb}}.{{slug}}'
status: in-progress
date: '{{date}}'
stamp: '{{stamp}}'
title: '{{verb}} — {{slug}}'
---

# Run-log: {{verb}} — {{slug}} · {{stamp}}

> SDD artifact **versioned** in `docs/runs/`. Step-by-step record of **one
> iteration**: who (agent), on what (model), with what result. The orchestrator (Opus) closes it
> with a "Final verification" section + **Telemetry**.

Related: spec `docs/specs/{{slug}}/spec.md` · plan `docs/plans/{{stamp}}_{{verb}}-{{slug}}.md`.

## Steps

| #   | step (SDD)               | agent            | model        | result / artifact                                   | status |
| --- | ------------------------ | ---------------- | ------------ | --------------------------------------------------- | ------ |
| 0   | doc-review (input gate)  | doc-reviewer     | Gemini Flash | documentation ↔ docs / mockups consistent; go/no-go | todo   |
| 1   | specify                  | orchestrator     | Opus 4.8     | spec.md + plan.md scaffolded                        | done   |
| 2   | clarify                  | orchestrator     | Opus 4.8     | `[?]` closed, status: clarified                     | todo   |
| 3   | plan                     | orchestrator     | Opus 4.8     | task table                                          | todo   |
| 4   | analyze                  | orchestrator     | Opus 4.8     | go / no-go                                          | todo   |
| 5   | implement                | angular-engineer | Gemini Flash | code passes lint as-is                              | todo   |
| 6   | test scenarios (from AC) | vitest           | Gemini Flash | happy + edge per AC                                 | todo   |
| 7   | unit tests               | vitest           | Gemini Flash | touched libs green                                  | todo   |
| 8   | e2e tests                | playwright       | Gemini Flash | happy-path green on the live app                    | todo   |
| 9   | UX audit (running)       | ux-verifier      | Gemini Flash | go (overflow/RWD/contrast)                          | todo   |
| 10  | verify (DoD)             | orchestrator     | Opus 4.8     | `pnpm verify` green                                 | todo   |

## Final verification (orchestrator / Opus)

> Fill in **at the very end**, on Opus — the last quality gate over the work of cheaper models.

- **Diff vs spec/AC:** [?] does the change deliver the Acceptance criteria, without regressions or scope-creep
- **`pnpm verify`:** [?] result (full gate; composition → `AGENTS.md` §Commands)
- **Spec ↔ code coverage:** [?] every AC is reflected in code/tests
- **Tests:** [?] scenarios cover every AC · Vitest + e2e green · no `.skip`/`.only`
- **Integration tests:** [?] run when API available (otherwise `n/a`)
- **Interactive-element sweep:** [?] all button/link/input/textarea/select/dropdown/filter
  clicked through **per role** (admin/user/guest) · negative authz (hidden/disabled/deep-link rejected)
- **Works after tests (end-to-end):** [?] actually works, not just green tests
- **UX from running:** [?] ux-verifier verdict (not from reading code)
- **Discrepancies / sent back to specialist:** [?]
- **Verdict:** [?] go / no-go + one sentence of rationale

## Bug report / problems encountered

> Full trace of problems encountered in the task (build / lint / test / runtime / integration) and their
> fixes — **mandatory**, alongside telemetry. No problems → a single "none" row.

| #   | step | bug / problem | cause | how fixed | status |
| --- | ---- | ------------- | ----- | --------- | ------ |
| 1   | [?]  | [?]           | [?]   | [?]       | [?]    |

## Accounting / Telemetry

> Fill in at task close (verify / DoD step) — usage accounting. **Automatic source
> (when OTel-export is enabled):** Copilot trace → backend (Galileo / OTel) — tokens and latency per
> span; span→step map and how to enable → [`docs/observability.md`](../../observability.md). Manual
> fallback: tokens / agent count → workflow `usage` (`subagent_tokens`, `agent_count`);
> background tasks → `<task-notification>` notifications / `TaskList`; sessions → `list_sessions`;
> **credits** → billing dashboard (Copilot premium requests / billing — outside repo tooling).

| metric                     | value |
| -------------------------- | ----- |
| tokens (output, total)     | [?]   |
| credits (premium requests) | [?]   |
| background tasks (count)   | [?]   |
| sessions (count)           | [?]   |
| agents / subagents         | [?]   |
