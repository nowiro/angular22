# SDD (Spec-Driven Development) — angular22

> **Kanon metodologii** żyje w `mcp-workspace/docs/sdd/methodology.md` (inspiracja:
> [github/spec-kit](https://github.com/github/spec-kit)). Ten plik to repo-lokalna
> adaptacja: verby, agenci, bramki i komendy specyficzne dla angular22. Warstwa
> wykonywalna (`validate-sdd.mjs`, `workflow-specify.mjs`, prompty `/clarify` +
> `/analyze`) jest kopią kanonu — synchronizuj stamtąd.

## Cykl (mapowanie na spec-kit)

| spec-kit                | tutaj                                        | artefakt / mechanizm                                                                  |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/speckit.constitution` | `copilot-instructions` + `instructions/*`    | istniejące reguły (nie duplikat)                                                      |
| **(wejście)**           | **doc-review** → `doc-reviewer`              | dok. zadania ↔ docs/Confluence ↔ mockupy spójne; **STOP na niejasności** PRZED specem |
| `/speckit.specify`      | `pnpm workflow:specify -- --verb=… --slug=…` | `docs/specs/<slug>/spec.md` (z `[?]`)                                                 |
| `/speckit.clarify`      | `/clarify <slug>`                            | domyka `[?]`, `status: draft → clarified`                                             |
| `/speckit.plan`         | orchestrator (plan-first)                    | `docs/plans/<stamp>_<verb>-<slug>.md`                                                 |
| `/speckit.tasks`        | **folded** w tabelę planu                    | `id \| title \| agent \| done_when`                                                   |
| `/speckit.analyze`      | `/analyze`                                   | raport go/no-go (read-only)                                                           |
| `/speckit.implement`    | delegacja do specjalisty (subagenta)         | kod + testy                                                                           |

Drabinę domyka krok **verify**: orchestrator (Opus) sam weryfikuje wynik tańszych modeli
i zapisuje werdykt w run-logu (`docs/runs/<stamp>_<slug>.md`).

## Reguła progowa

- **Pytanie / trywialna edycja in-file** → wprost, bez artefaktów SDD.
- **≥2 plików lub zmiana behaviour** → **doc-review** → pełna drabina specify → clarify → plan →
  analyze → implement → verify → DoD (`pnpm verify`).

## STOP na niejasności (twarda bramka)

Na **KAŻDYM** kroku drabiny: jeśli cokolwiek **niejasne / sprzeczne / niepełne** → **STOP**.
**Nie zgaduj** — zapytaj użytkownika lub zostaw `[?]` i zatrzymaj drabinę. Niejasność =
**blocker**. Szczególnie: **doc-review** (wejściowa dokumentacja zadania ↔ docs/Confluence ↔
mockupy — PRZED specem) i **clarify** (`[?]` w specu).

## Krok = oznacz w planie + commit

Każdy ukończony krok drabiny: (1) oznacz w **tabeli planu** kolumnę `status` jako `done`,
(2) zrób **commit** (conventional, przez `scm`) z odniesieniem do kroku / run-logu. **Jeden krok
= jeden commit** — granularna, audytowalna historia. Kolumna `status` jest w `templates/plan.md`;
plany sprzed reguły są grandfathered, `validate-sdd` jej nie wymusza.

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

## Artefakty (wersjonowane w `docs/`)

Kształt → [`templates/spec.md`](templates/spec.md) · [`templates/plan.md`](templates/plan.md) ·
[`templates/run.md`](templates/run.md). `docs/specs|plans|runs` są **trackowane w gicie** —
**każda zmiana przechodzi przez SDD, a zapis ląduje w `docs/`** (spec + plan + datowany
run-log). Bramka `pnpm sdd:check` egzekwuje spójność spec↔plan (część `pnpm verify`).

**Wersjonowanie zadań:** jeśli slug już istnieje (`docs/specs/<slug>/`), `pnpm workflow:specify`
**nie nadpisuje** — tworzy kolejną wersję `<slug>-v2` / `-v3` / … (nowa iteracja tego samego
zadania ma własny spec/plan/run-log). Historia poprzednich wersji zostaje w `docs/`.

## Telemetria (rozliczenie zamkniętego zadania)

Krok **verify / DoD** domyka run-log sekcją **Rozliczenie / Telemetria**: zużyte **tokeny**
i **kredyty**, liczba **background tasków** i **sesji**, liczba agentów/subagentów. Źródła:
`usage` workflowów (tokeny, `agent_count`) · `TaskList` (background taski) · `list_sessions`
(sesje) · dashboard rozliczeniowy (kredyty — poza narzędziami repo, wpis ręczny lub `n/d`).

## Komendy

| Komenda                                          | Krok SDD | Efekt                                              |
| ------------------------------------------------ | -------- | -------------------------------------------------- |
| `pnpm workflow:specify -- --verb=<v> --slug=<s>` | specify  | scaffold `spec.md` + `plan.md` + datowany `run.md` |
| `/clarify <slug>`                                | clarify  | domyka `[?]`, flip `status: clarified`             |
| `/analyze`                                       | analyze  | `sdd:check` + spójność spec↔plan↔kod → go/no-go    |
| `pnpm sdd:check`                                 | gate     | warstwa strukturalna (część `verify`)              |
