---
agent: agent
description: Cross-artifact SDD consistency check — verify spec ↔ plan ↔ code agree before implementing. Runs the deterministic gate (pnpm sdd:check), then reasons over semantic gaps. Read-only. Use after /clarify and before delegating implementation.
---

# /analyze — spec ↔ plan ↔ code consistency

Checks SDD artifact consistency **before** implementation starts. Read-only — changes
nothing. Canon: `docs/sdd/methodology.md`.

## Step 1 — Gate (deterministic)

`pnpm sdd:check` (frontmatter, spec sections, task table, traceability
`plan.<verb>.<slug>` → `spec`). **Errors → stop and report** — semantic
analysis is pointless on an inconsistent structure.

## Step 2 — Semantic analysis (per spec)

For `docs/specs/<slug>/spec.md` + plan `docs/plans/*-<slug>.md`:

1. **Coverage** — does every `## Acceptance criteria` have a task in the plan table? Flag AC
   with no task **and** tasks with no AC (scope creep). Is the **test trio** (scenarios + Vitest
   - Playwright) present in the table? Missing = blocker.
2. **Open `[?]`** — each one is a risk before implementation.
3. **Code drift** — if code exists, do the contracts (types / boundaries / field names) match
   the spec? Mismatches with `file:line`.
4. **Contradictions** — spec vs plan vs code (names, budgets, scope); agreement of the
   `model` column with agents' `model:`.

## Format

Table `artifact | finding | severity (blocker / major / minor) | suggestion`. At the end an
unambiguous **go / no-go** + a one-sentence rationale.

## DON'T

Don't modify spec / plan / code (read-only). Don't skip Step 1. Don't invent criteria
— work with what's actually in `docs/specs/`.
