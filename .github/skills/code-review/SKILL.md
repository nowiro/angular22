---
name: code-review
description: Code review playbook for angular22 — severity rubric, auto-blocker gates (Material/Signal Forms/i18n/tests), diff review layers and finding format. Use when assessing a diff before merge (reviewer agent).
---

# Code review — repo playbook

Knowledge applied by the [`reviewer`](../../agents/reviewer.agent.md) agent (read-only).
This is **HOW**: rubric, ladder, layers. The gate decides, not taste — the auto-blockers below
are violations of [`code-quality.instructions`](../../instructions/code-quality.instructions.md)
and [`copilot-instructions`](../../copilot-instructions.md), not "nitpicks".

## Ladder (the order is mandatory)

1. **Deterministic gate FIRST** — `pnpm verify` (or `pnpm lint`) + `read/problems`.
   Red gate = `no-go` immediately, no semantic analysis. **Don't review on a red
   gate** — a lint finding is cheaper and surer than an opinion.
2. **Semantic analysis** — only on a green gate do you go through layers 1–5.

## Severity rubric

| severity    | meaning                            | example                                                           |
| ----------- | ---------------------------------- | ----------------------------------------------------------------- |
| **blocker** | breaks gate / contract — **no-go** | auto-blocker (below), AC without coverage, regression             |
| **major**   | works, but debt or real risk       | state mutation, unhandled `null` edge-case, missing `data-testid` |
| **minor**   | cosmetics / nit                    | naming, comment, minor refactor                                   |

### AUTO-BLOCKERS (always blocker — never major/minor)

- Import of `@angular/material/*` or `@angular/cdk/*` **outside** `libs/ui/material`.
- `FormGroup`/`FormBuilder`/`ngModel` instead of Signal Forms (`form()`/`schema()`/`[formField]`).
- Missing **any** item of the test triad (AC scenarios + Vitest + Playwright e2e).
- `.skip` / `.only` in tests.
- `eslint-disable` without justification after `--` (the only allowed one: `unbound-method` in `form-schema.ts`).
- Lib public API outside `src/index.ts`.
- Component written by hand instead of `pnpm nx g @nx/angular:component` (inline template/styles, no OnPush, not-three-files).
- UI text without the `a22T` pipe (PL literal = key; no EN entry in `*-translations.en.ts`).
- Theming via `--mdc-*` / `--sys-*` / `::ng-deep` instead of `--mat-sys-*` + `mat.theme()`.

## Review layers

1. **Spec/AC** — every AC from `docs/specs/<slug>/spec.md` has coverage; code **without AC** = scope
   creep (blocker). Flag AC without code **and** code without AC.
2. **Correctness** — regressions, empty-string `''` / `null` edge-cases, store updates the model
   **immutably** (`model.update`, not in-place mutation); effects with an equality guard.
3. **Boundaries** — `scope:*`/`type:*` tags respected (`scope:<feature-a>` ⛔
   `scope:<feature-b>`), layers `app → feature → ui/data-access → util`.
4. **Conventions** — Signal Forms; three files per component + OnPush; i18n `a22T`; `data-testid`
   on **every** interactive element; theming `--mat-sys-*`; selectors `a22-*`.
5. **Tests** — triad **present and green**; e2e targets `data-testid`, not PL/EN text.

## Finding format

> Shape canon: [`templates/review.md`](../../../docs/sdd/templates/review.md).

Table + partial verdict:

```
| file:line | finding | severity | suggestion |
```

After the table, **one sentence**: `go` / `no-go` with justification. One blocker = `no-go`.
**The final verdict belongs to the orchestrator (Opus)** — you supply the material, not the merge decision.

## NO

- **Don't edit files** — the review is read-only (`git diff`/`git show`, not a patch).
- **Don't let a gate violation pass as minor** — an auto-blocker is a blocker by definition.
- **Don't invent criteria** — work from the real spec/AC and the real diff; no spec = flag the gap, don't guess intent.
