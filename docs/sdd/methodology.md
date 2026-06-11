# SDD (Spec-Driven Development) — angular22

> **Kanon metodologii** żyje w `mcp-workspace/docs/sdd/methodology.md` (inspiracja:
> [github/spec-kit](https://github.com/github/spec-kit)). Ten plik to repo-lokalna
> adaptacja: verby, agenci, bramki i komendy specyficzne dla angular22. Warstwa
> wykonywalna (`validate-sdd.mjs`, `workflow-specify.mjs`, prompty `/clarify` +
> `/analyze`) jest kopią kanonu — synchronizuj stamtąd.

## Cykl (mapowanie na spec-kit)

| spec-kit                | tutaj                                        | artefakt / mechanizm                      |
| ----------------------- | -------------------------------------------- | ----------------------------------------- |
| `/speckit.constitution` | `copilot-instructions` + `instructions/*`    | istniejące reguły (nie duplikat)          |
| `/speckit.specify`      | `pnpm workflow:specify -- --verb=… --slug=…` | `docs/specs/<slug>/spec.md` (z `[?]`)     |
| `/speckit.clarify`      | `/clarify <slug>`                            | domyka `[?]`, `status: draft → clarified` |
| `/speckit.plan`         | orchestrator (plan-first)                    | `docs/plans/<stamp>_<verb>-<slug>.md`     |
| `/speckit.tasks`        | **folded** w tabelę planu                    | `id \| title \| agent \| done_when`       |
| `/speckit.analyze`      | `/analyze`                                   | raport go/no-go (read-only)               |
| `/speckit.implement`    | delegacja do specjalisty (subagenta)         | kod + testy                               |

Drabinę domyka krok **verify**: orchestrator (Opus) sam weryfikuje wynik tańszych modeli
i zapisuje werdykt w run-logu (`docs/runs/<stamp>_<slug>.md`).

## Reguła progowa

- **Pytanie / trywialna edycja in-file** → wprost, bez artefaktów SDD.
- **≥2 plików lub zmiana behaviour** → pełna drabina specify → clarify → plan → analyze →
  implement → verify → DoD (`pnpm verify`).

## Verby angular22

`feature` (nowa funkcja) · `component` (nowy komponent/wrapper przez generator) ·
utrzymanie: `fix` / `refactor` / `deps` / `chore` / `security`. Verby są swobodne
(`[a-z0-9-]+`) — `validate-sdd` ich nie hardkoduje.

## Trójka testowa (obowiązkowa w każdym planie zmian)

1. **Scenariusze testowe** wyprowadzone z Acceptance criteria (happy + edge per AC),
2. **testy jednostkowe** — Vitest (`pnpm nx run <lib>:test`, executor `@nx/vitest:test`),
3. **testy e2e** — Playwright (`pnpm nx run <app>-e2e:e2e`, executor
   `@nx/playwright:playwright`) i/lub żywa przeglądarka przez serwer **MCP `playwright`**.

Brak którejkolwiek pozycji = **no-go** w weryfikacji końcowej.

## Artefakty (local-only, gitignored)

Kształt → [`templates/spec.md`](templates/spec.md) · [`templates/plan.md`](templates/plan.md) ·
[`templates/run.md`](templates/run.md). `docs/specs|plans|runs` są w `.gitignore` —
bramka `pnpm sdd:check` przechodzi pusto, a egzekwuje spójność lokalnie (jest częścią
`pnpm verify`).

## Komendy

| Komenda                                          | Krok SDD | Efekt                                              |
| ------------------------------------------------ | -------- | -------------------------------------------------- |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>` | specify  | scaffold `spec.md` + `plan.md` + datowany `run.md` |
| `/clarify <slug>`                                | clarify  | domyka `[?]`, flip `status: clarified`             |
| `/analyze`                                       | analyze  | `sdd:check` + spójność spec↔plan↔kod → go/no-go    |
| `pnpm sdd:check`                                 | gate     | warstwa strukturalna (część `verify`)              |
