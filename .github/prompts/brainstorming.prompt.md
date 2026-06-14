---
agent: agent
description: Pre-spec ideation — diverge into distinct approaches, weigh trade-offs against repo conventions, converge on one recommendation, then hand off to pnpm workflow:specify. Read-only; writes no artifacts.
---

# /brainstorming — warm-up before the SDD ladder

Structured ideation **before** `specify`. Turns a topic/problem into 3–5 **distinct**
approaches, weighs them against the repo's hard rules, and converges on **one**
recommendation. Read-only — no code, spec, or files in the repo. Canon:
[`docs/sdd/methodology.md`](../../docs/sdd/methodology.md).

## Input

`/brainstorming <topic/problem>` — a loose description of an idea, pain point, or "what if".
With no argument: ask for a one-sentence problem statement, don't guess.

## Procedure

1. **Diverge** — generate **3–5 clearly different** approaches (different architecture / lib /
   boundary, not variants of one idea). Each in one sentence: what it is.
2. **Evaluate** — table `approach | complexity | risk | fit with repo conventions |
cost`. Evaluate against the **hard rules**: Signal Forms (`form()`/`schema()`,
   no `FormGroup`/`ngModel`), `@angular22/ui-material` wrappers (not `@angular/material/*`
   outside `libs/ui/material`), components only via `pnpm nx g @nx/angular:component`,
   i18n `a22T` (PL = key), the SDD threshold. An approach that breaks a rule → **low fit**.
3. **Converge** — recommend **ONE** approach with a **one-sentence** rationale;
   list the rejected ones with a reason (one sentence / approach). No silent pick — show the table.
4. **Hand-off** — propose a concrete ladder start:
   `pnpm workflow:specify -- --verb=<verb> --slug=<slug>` with the chosen verb
   (`feature` / `component` / `fix` / `refactor` / `deps` / `chore` / `security`) and a `slug`
   (`[a-z0-9-]+`). Next: [`/clarify`](./clarify.prompt.md) → plan → `/analyze`.

## Format

Options table (step 2) → recommendation + rejected with reason → **next step** as a ready
`specify` command. Concise: outcome over process.

## DON'T

**Don't write code or a spec**, generate nothing in the repo (read-only — `specify` does that).
Don't decide silently — always show the options and the reason for rejection. Don't jump to
implementation or the plan. Don't multiply variants of one idea as "different approaches" —
different = different boundary/lib/architecture. The hard rules from
[`copilot-instructions`](../copilot-instructions.md) are axioms, not subjects of the brainstorm.
