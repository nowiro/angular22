---
agent: agent
description: Import/rewrite entrypoint — drives the full SDD ladder to rewrite an existing app (any framework, or legacy Angular) into the latest Angular on the angular22 stack, via the intake gate, legacy-analyst inventory and feature-parity verification.
---

# /import-app — full SDD ladder for an app rewrite

A convenient entrypoint for **importing/rewriting** an existing app into the **latest Angular** on the
angular22 stack. It doesn't reimplement the system — it **drives** the
[`orchestrator`](../agents/orchestrator.agent.md), the [`app-import`](../skills/app-import/SKILL.md)
recipe and the SDD routing. Step canon: [`methodology.md`](../../docs/sdd/methodology.md); rules/stack
→ [`copilot-instructions.md`](../copilot-instructions.md).

## Input

`/import-app <source: repo path / code / docs>` — a source app (any framework, or legacy Angular).
Derive `<slug>` (`[a-z0-9-]+`). Keyless: work on the **provided** source content (no cloning, no network).

## Procedure (1:1 with the SDD ladder)

0. **intake gate** — no source repo / code / docs provided → **STOP and ASK** for it (unless the
   task is about **THIS** repo). Don't invent a source; an import without a source is a no-go.
1. **inventory** — [`legacy-analyst`](../agents/legacy-analyst.agent.md) reads the source and produces
   the feature inventory (routes, screens, forms, state, deps, framework + version). This is the
   parity baseline — everything downstream maps back to it.
2. **specify** — `pnpm workflow:specify -- --verb=import --slug=<slug>`; scaffold `spec.md` (with
   `[?]`) + `plan.md` + dated `run.md`. The **AC = feature parity** with the source (each inventory
   item → a Given/When/Then). [`/clarify`](./clarify.prompt.md) resolves every `[?]` first.
3. **plan** — table `id | title | agent | done_when | status | model | blocked_by` with the **mandatory
   test trio**: parity scenarios (from AC) + **Vitest** (`@nx/vitest:test`) + **Playwright**
   (`@nx/playwright:playwright`). Any item missing = **no-go**. [`/analyze`](./analyze.prompt.md) →
   unambiguous **go / no-go**.
4. **implement** — **delegate to specialists** (orchestrator, `tool agent`), **LATEST Angular**: a new
   app = **clone `apps/base`** ([`angular-new-app`](../skills/angular-new-app/SKILL.md): copy + swap
   name/scope/port/i18n/branding), Nx **libs** via `pnpm nx g @nx/angular:library` tagged
   `scope:*/type:*`; **components ONLY via `pnpm nx g
@nx/angular:component`**; **Signal Forms** (`form()`/`schema()`/`[formField]`) + `ui-material`
   wrappers; **a22T** i18n; **lazy** routes. If the source is **old Angular**, modernize via
   [`angular-migrations`](../skills/angular-migrations/SKILL.md) instead of a hand-rewrite. The
   specialist reads `code-quality.instructions` + `angular.instructions` **BEFORE** coding.
5. **verify** — **parity first**: every inventory item green via `e2e` + `ux-verifier` verdict **from a
   live browser** (never from reading code). Then `pnpm verify` green + touched `e2e` green + dated
   run-log in `docs/runs/`.

**Every iteration = a dated run-log** `docs/runs/YYYY-MM-DD_HH-MM_<slug>.md` (step = agent + model +
result). The **Material** (wrappers only), **Signal Forms** (`form()`/`schema()`/`[formField]`, zero
`FormGroup`/`ngModel`), **i18n** (`a22T`, PL = key) and **generator-only** (`nx g`, never by hand) gates
are **hard** — non-negotiable at any step.

## Hand-off

After a `go` from step 3, hand control to the orchestrator (implement → parity-verify → DoD). A parity
gap or mismatch in final verification → send it back to the right specialist (or `legacy-analyst` for a
re-inventory), don't patch it yourself.

## DON'T

Don't start an import without a source — **STOP and ASK** at the intake gate. Don't ship without **feature
parity** proven from a run. Don't write components by hand — always `nx g`. Don't target an old Angular —
**latest** only. Don't bypass the Material wrappers, Signal Forms or `a22T`. **Don't declare Done** without
green parity, a green `pnpm verify` and UX **from a run**.
