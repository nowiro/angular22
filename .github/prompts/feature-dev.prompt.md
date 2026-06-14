---
agent: agent
description: End-to-end feature entrypoint — runs the full SDD ladder (specify → clarify → plan → analyze → implement → verify) via the orchestrator and enforces the mandatory test trio and DoD gate.
---

# /feature-dev — full SDD ladder for a feature

A convenient entrypoint to the **complete SDD ladder** for a described feature. It doesn't
reimplement the system — it **drives** the [`orchestrator`](../agents/orchestrator.agent.md)
and its routing. Step canon: [`methodology.md`](../../docs/sdd/methodology.md); rules/stack →
[`copilot-instructions.md`](../copilot-instructions.md).

## Input

`/feature-dev <feature description>` — a loose description. Derive `<slug>` (`[a-z0-9-]+`).
Scope ≥2 files / behaviour change → full ladder (otherwise: edit in-file directly).

## Procedure (1:1 with the SDD ladder)

1. **specify** — `pnpm workflow:specify -- --verb=feature --slug=<slug>`; scaffold
   `spec.md` (with `[?]`) + `plan.md` + dated `run.md`.
2. **clarify** — [`/clarify`](./clarify.prompt.md) resolves every `[?]`; without it the plan stalls.
3. **plan** — table `id | title | agent | done_when | status | model | blocked_by` with the **mandatory test
   trio**: scenarios (from AC) + **Vitest** (`@nx/vitest:test`) + **Playwright**
   (`@nx/playwright:playwright`). Any item missing = **no-go**.
4. **analyze** — [`/analyze`](./analyze.prompt.md) → unambiguous **go / no-go**.
5. **implement** — **delegate to specialists** (orchestrator, `tool agent`): logic /
   Signal Forms / i18n → `angular-engineer` (**components ONLY via
   `pnpm nx g @nx/angular:component`**); wrappers / theming `--mat-sys-*` →
   `material-wrapper`; lint → `eslint`; unit → `vitest`; e2e → `playwright`. The specialist
   reads `code-quality.instructions` + `angular.instructions` **BEFORE** coding — lint-clean
   from the start, no fix-up round.
6. **verify** — orchestrator/**Opus** reviews the diff itself (AC, regressions, scope-creep) + UX
   **from a run** (`ux-verifier` verdict on a live browser, never from reading code).
7. **DoD** — `pnpm verify` green + touched `e2e` green + run-log in `docs/runs/`.

**Every iteration = a dated run-log** `docs/runs/YYYY-MM-DD_HH-MM_<slug>.md` (step = agent

- model + result). The **Material** (wrappers only), **Signal Forms** (`form()`/
  `schema()`/`[formField]`, zero `FormGroup`/`ngModel`) and **i18n** (`a22T`, PL = key) gates are
  **hard** — non-negotiable at any step.

## Hand-off

After a `go` from step 4, hand control to the orchestrator (implement → verify → DoD). A mismatch in
final verification → send it back to the right specialist, don't patch it yourself.

## DON'T

Don't skip the SDD gates or the **test trio**. Don't write components by hand — always
`nx g`. Don't bypass the Material wrappers or Signal Forms. **Don't declare Done** without a green
`pnpm verify` and UX **from a run**.
