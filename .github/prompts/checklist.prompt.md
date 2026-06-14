---
agent: agent
description: SDD quality checklist — generate and run a "ready to build with quality" gate derived from the spec's Acceptance criteria + the repo's hard rules, after /analyze (go) and BEFORE implementation. Read-only. Adapts spec-kit's /speckit.checklist.
---

# /checklist — quality gate before implementation

Generates and runs a **quality checklist** for a task — an adaptation of spec-kit's `/speckit.checklist`.
You run it **after** `/analyze` (go) and **before** implementation: "are we building at top quality".
Read-only — you change nothing. Canon: `docs/sdd/methodology.md`. You derive the items from
`docs/specs/<slug>/spec.md` (`## Acceptance criteria`) + the repo's hard rules (`copilot-instructions`).

## What you verify (☑ / ☐ + how to check)

1. **Requirements** — every AC **testable and unambiguous**; zero `[?]`; traceability matrix
   (requirement ↔ AC ↔ element/role) closed (`doc-reviewer`).
2. **Tests (trio, per role)** — scenarios from **every** AC; happy + edge + boundary; **RBAC
   matrix** (admin/user/guest) + **negative authz tests**; **all interactive elements** have
   `data-testid` and are clicked through in e2e (`test-strategy`/`playwright`).
3. **Code (lint-clean from the start)** — `code-quality.instructions` + `angular.instructions` read
   BEFORE coding; OnPush + standalone + signals + control flow; **Signal Forms** (zero `FormGroup`/
   `ngModel`); Material **only** via wrappers; **i18n** `a22T` (PL key + EN); components via
   the generator. **DRY/SOLID** — no duplication, single responsibility.
4. **A11y** — WCAG (roles, focus-visible, contrast, touch ≥ 44); runtime → `ux-verifier`/`accessibility`.
5. **Security** — protection via a **guard** (not just hidden UI); no secrets; data from untrusted
   sources validated (`security`/`keycloak`).
6. **DoD** — `pnpm verify` (composition → `AGENTS.md`) + touched `e2e` green + UX from a run;
   run-log with an **error report** + telemetry planned.

## Format

List `☑ / ☐ | item | how to verify | owner (agent)`. At the end **go / no-go**: any
**unchecked** critical item = **no-go** (go back to the specialist / `/clarify`) before code starts.

## DON'T

Don't modify artifacts or code (read-only). Don't skip an item "because it's obvious". Don't start
implementation with an open critical item — this is a gate **before** the build.
