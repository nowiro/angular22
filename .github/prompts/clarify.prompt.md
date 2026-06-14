---
agent: agent
description: Resolve open [?] placeholders in a docs/specs spec via structured Q&A, then re-validate. Clarify step of SDD (specify → clarify → plan → analyze → implement). Writes only the target spec.md, never fabricates — unanswered stay draft.
---

# /clarify — close out the spec before planning

Turns `[?]` in `docs/specs/<slug>/spec.md` into concrete answers via **structured Q&A**.
`validate-sdd` treats `[?]` in a non-draft spec as an error — this prompt resolves them. Writes
**only** to the target `spec.md`. Canon: `docs/sdd/methodology.md`.

## Input

`/clarify <slug>` — a specific spec; with no argument — scan `docs/specs/*/spec.md` for
`[?]`, show candidates, ask which one.

## Procedure

1. **Collect gaps** — every `[?]` line with its section heading; add implicit gaps (AC not
   in Given/When/Then form, metrics without numbers, fuzzy scope).
2. **Ask one at a time** — one question at a time, `Acceptance criteria` and scope first; for
   each one **propose a default / options**. Limit ~5–7 questions / pass, leave the rest `[?]`.
3. **Save** — replace `[?]` in-place; append `## Clarifications` (log `date — question →
answer`); when **no `[?]` remains** → frontmatter `status: clarified`.
4. **Re-validate** — `pnpm sdd:check`. Report green / red.
5. **Hand-off** — propose `/analyze` → implementation (delegated via the orchestrator).

## Format

During: single questions with a proposed default. At the end: list of resolved `[?]`
(section → value), status (`draft` / `clarified`), `sdd:check` result, next step.

## DON'T

**Don't fabricate** — "I don't know / skip" → leave `[?]`, keep `status: draft`. Don't touch
code or the plan. Don't ask 15 at once — sequentially, prioritizing what blocks the plan.
