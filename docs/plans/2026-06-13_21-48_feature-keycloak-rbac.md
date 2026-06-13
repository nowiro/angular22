---
type: plan
id: 'plan.feature.keycloak-rbac'
status: clarified
date: '2026-06-13'
title: 'feature — keycloak-rbac'
agents: [orchestrator, keycloak, angular-engineer, vitest, playwright, reviewer]
---

# Plan: feature — keycloak-rbac

> Artefakt SDD **wersjonowany** w `docs/plans/`. Traceability:
> `plan.feature.keycloak-rbac` → `docs/specs/keycloak-rbac/spec.md` (`sdd:check`).

## Zadania

> Trójka testowa: **unit** (`auth-rules`/`AuthStore`/mock — Vitest) + **e2e** (portal RBAC per rola +
> negatywny authz — Playwright); **integracyjne = n/d** (brak API/serwera w demo, tryb mock).
> Komponent admina **przez generator** (`nx g @nx/angular:component`). Krok = oznacz `done` + commit.

| id   | title                                                                    | agent            | done_when                                        | status | model        | blocked_by |
| ---- | ------------------------------------------------------------------------ | ---------------- | ------------------------------------------------ | ------ | ------------ | ---------- |
| T000 | doc-review (decyzje: lib/tryb/role)                                      | doc-reviewer     | **n/d** — feature, decyzje przez AskUserQuestion | done   | Gemini Flash | —          |
| T001 | Spec + AC                                                                | orchestrator     | spec.md bez `[?]`                                | done   | Opus 4.8     | T000       |
| T002 | Stack expansion (keycloak-angular + keycloak-js, exact; tech-stack)      | orchestrator     | deps pinned + kanon + consistency note           | done   | Opus 4.8     | T001       |
| T003 | Lib `shared-auth` (AuthStore/`*a22HasRole`/roleGuard/mock+keycloak)      | angular-engineer | typecheck+lint zielone, API kompletne            | done   | Gemini Flash | T002       |
| T004 | Testy jednostkowe (auth-rules/AuthStore/mock — Vitest)                   | vitest           | dotknięte zielone                                | done   | Gemini Flash | T003       |
| T005 | Wire 3 apki (provideAuth) + portal RBAC demo (admin/guard/switcher/i18n) | angular-engineer | typecheck+build zielone                          | done   | Gemini Flash | T003       |
| T006 | E2e RBAC per rola + negatywny authz (portal-e2e)                         | playwright       | 6 scenariuszy zielonych                          | done   | Gemini Flash | T005       |
| T007 | Agent `keycloak` + skill `keycloak-auth` + wiring                        | orchestrator     | ai:validate 31/10/1                              | done   | Opus 4.8     | T003       |
| T008 | Verify + run-log + telemetria                                            | orchestrator     | `pnpm verify` + e2e go + commit                  | todo   | Opus 4.8     | T004–T007  |

## Notatki

- **Tryb mock (decyzja)** — demo działa offline; `provideKeycloakAuth` (realny IdP) gotowy, ale
  nieuruchamiany. Przełącznik ról (`localStorage` `a22.mock-role`) to **wyłącznie** afordancja demo.
- **Bezpieczeństwo** — `*a22HasRole` to tylko UI; ochrona = `roleGuard` na trasie (`/admin` →
  `/forbidden` dla nie-admina). E2e potwierdza **negatywny** deep-link, nie tylko ukrycie.
- **Stack** — keycloak-angular `21.x` o major za Angularem (peer `^21`); `strict-peer-dependencies=false`
  toleruje; typecheck potwierdza zgodność na Angular 22.
