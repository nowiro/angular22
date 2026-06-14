# Szablony SDD + odpowiedzi agentów — angular22

> **Kanon kształtu** artefaktów SDD oraz **odpowiedzi agentów/skilli**. Jedno źródło prawdy
> dla _formy_ — agent **wskazuje** szablon (DRY), nie powiela opisu formatu u siebie. Reguły
> drabiny i bramek: [`../methodology.md`](../methodology.md).

## Grupa 1 — artefakty SDD (wersjonowane w `docs/specs|plans|runs`)

| szablon              | krok SDD | producent    | wynik                                 |
| -------------------- | -------- | ------------ | ------------------------------------- |
| [`spec.md`](spec.md) | specify  | orchestrator | `docs/specs/<slug>/spec.md`           |
| [`plan.md`](plan.md) | plan     | orchestrator | `docs/plans/<stamp>_<verb>-<slug>.md` |
| [`run.md`](run.md)   | verify   | orchestrator | `docs/runs/<stamp>_<slug>.md`         |

## Grupa 2 — szablony odpowiedzi agentów/skilli (kształt wyniku w czacie / PR)

> Odpowiedzi te **nie są** wersjonowane jako pliki — to **kształt** tego, co agent zwraca
> orchestratorowi. Werdykt końcowy (go/no-go) zawsze należy do **orchestratora (Opus)**.

| szablon                                  | krok SDD     | producent (agent / skill)                                                                                               | kształt                                              |
| ---------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`doc-review.md`](doc-review.md)         | doc-review   | [`doc-reviewer`](../../../.github/agents/doc-reviewer.agent.md)                                                         | Definition of Ready + macierz traceability           |
| [`test-scenarios.md`](test-scenarios.md) | scenariusze  | [`test-strategy`](../../../.github/agents/test-strategy.agent.md)                                                       | scenariusze z AC + macierz RBAC + luki               |
| [`analyze.md`](analyze.md)               | analyze      | orchestrator ([`/analyze`](../../../.github/prompts/analyze.prompt.md))                                                 | spójność spec↔plan↔kod → go/no-go                    |
| [`review.md`](review.md)                 | implement    | [`reviewer`](../../../.github/agents/reviewer.agent.md) + [`code-review`](../../../.github/skills/code-review/SKILL.md) | findingi diffu + severity                            |
| [`audit.md`](audit.md)                   | implement    | `security` · `accessibility` · `ux-verifier` · `stack-guardian` · `performance` · `meta-reviewer`                       | audyt read-only per wymiar                           |
| [`doc.md`](doc.md)                       | (utrzymanie) | [`docs`](../../../.github/agents/docs.agent.md)                                                                         | strona kanonu w `docs/` (DRY: wskazuje, nie kopiuje) |

## Zasady

- **DRY:** opis formatu w `*.agent.md` (`## Format`) **wskazuje** odpowiedni szablon — nie
  duplikuje go. Zmiana kształtu = edycja szablonu, nie 31 agentów.
- **Placeholdery:** `[?]` = do uzupełnienia (jak w `spec.md`); `{{token}}` = wstrzykiwane przez
  `pnpm workflow:specify`.
- **Severity** (wspólna rubryka): `blocker` (łamie bramkę/kontrakt → no-go) · `major` (dług/realne
  ryzyko) · `minor` (kosmetyka).
