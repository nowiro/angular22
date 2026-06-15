---
name: app-import
description: Playbook for importing/rewriting an existing app (any framework, or legacy Angular) into the LATEST Angular on the angular22 stack — inventory via legacy-analyst, map to Signal Forms / Nx libs / Material wrappers, rewrite through the SDD ladder with feature parity. Used by /import-app.
---

# App import / rewrite — repo playbook

> **HOW** to bring an **external** app onto this stack. Not a 1:1 port — a **rewrite to the
> latest Angular** with **feature parity**. Canon is elsewhere — point, don't duplicate:
> SDD [`methodology`](../../../docs/sdd/methodology.md) · stack [`tech-stack`](../../../docs/tech-stack.md).

## Task mode (pick one first)

- **create** — new feature/app in this repo → [`/feature-dev`](../../prompts/feature-dev.prompt.md) +
  [`angular-new-app`](../angular-new-app/SKILL.md).
- **modify** — change to code **already in this repo** → default SDD ladder
  ([`methodology`](../../../docs/sdd/methodology.md)).
- **import** — rewrite an **external** app onto this stack → **this skill**.

## Import ladder

### 0) Intake gate

Source **repo / path / code / docs provided?** If not → **STOP**, ask — agents are keyless and work
**only on PROVIDED content** (no cloning, no network). This is the
[`copilot-instructions`](../../copilot-instructions.md) intake rule; opens with
[`doc-reviewer`](../../agents/doc-reviewer.agent.md) (task docs ↔ source ↔ mockups consistent + unambiguous).

### 1) Inventory — [`legacy-analyst`](../../agents/legacy-analyst.agent.md)

Read-only map of the source: **framework** · features · routes · components · state · forms · i18n ·
styles. The map is the input to the spec.

### 2) Map to the stack (MODERNIZE, not port)

| source        | →   | angular22                                                                          |
| ------------- | --- | ---------------------------------------------------------------------------------- |
| views / pages | →   | standalone components via `nx g @nx/angular:component` (never by hand)             |
| state         | →   | **signals** (RxJS interop only where needed)                                       |
| forms         | →   | **Signal Forms** + [`ui-material`](../material-wrappers/SKILL.md) wrappers         |
| styles        | →   | `--mat-sys-*` + `mat.theme()` ([`frontend-design`](../frontend-design/SKILL.md))   |
| text          | →   | `a22T` (PL literal = key, EN in maps)                                              |
| routing       | →   | lazy `loadComponent` + guards                                                      |
| structure     | →   | Nx libs tagged `scope:*` / `type:*` ([`nx-generators`](../nx-generators/SKILL.md)) |
| auth / RBAC   | →   | `@angular22/shared-auth` ([`keycloak-auth`](../keycloak-auth/SKILL.md))            |

**Drop the anti-patterns** — no jQuery, no `NgModule`, no `FormGroup`/`FormBuilder`/`ngModel`. A
faithful rewrite keeps the **behaviour**, not the old shape.

### 3) Scaffold on the LATEST Angular

App via [`angular-new-app`](../angular-new-app/SKILL.md), on the version in
[`tech-stack`](../../../docs/tech-stack.md) (kept latest by `migration`). If the source is an
**old Angular**, prefer the [`angular-migrations`](../angular-migrations/SKILL.md) schematics where they
apply over hand-rewriting.

### 4) Run the full SDD ladder

[`methodology`](../../../docs/sdd/methodology.md): doc-review → specify (**AC = feature PARITY**) →
clarify → plan → analyze → checklist → implement (specialists + generators) → verify.

### 5) Parity verification

`e2e` / [`ux-verifier`](../../agents/ux-verifier.agent.md) confirm the new app matches the **source
behaviour** — per role (admin/user/guest), the closing gate of the ladder.

## DON'T

- Don't start without the source (provided repo/path/code/docs) — STOP at the intake gate.
- Don't port off-stack or carry anti-patterns over (jQuery / `NgModule` / `FormGroup`).
- Don't hand-write components — generator only (`pnpm nx g @nx/angular:component`).
- Don't skip parity verification — a rewrite without proven parity is `no-go`.
