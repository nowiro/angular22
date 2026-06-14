# SDD templates + agent responses — angular22

> **Shape canon** for SDD artifacts and **agent/skill responses**. Single source of truth
> for _form_ — an agent **points to** a template (DRY), it does not duplicate the format
> description locally. Ladder and gate rules: [`../methodology.md`](../methodology.md).

## Group 1 — SDD artifacts (versioned in `docs/specs|plans|runs`)

| template             | SDD step | producer     | output                                |
| -------------------- | -------- | ------------ | ------------------------------------- |
| [`spec.md`](spec.md) | specify  | orchestrator | `docs/specs/<slug>/spec.md`           |
| [`plan.md`](plan.md) | plan     | orchestrator | `docs/plans/<stamp>_<verb>-<slug>.md` |
| [`run.md`](run.md)   | verify   | orchestrator | `docs/runs/<stamp>_<slug>.md`         |

## Group 2 — agent/skill response templates (result shape in chat / PR)

> These responses are **not** versioned as files — they are the **shape** of what an agent returns
> to the orchestrator. The final verdict (go/no-go) always belongs to the **orchestrator (Opus)**.

| template                                 | SDD step      | producer (agent / skill)                                                                                                | shape                                              |
| ---------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`doc-review.md`](doc-review.md)         | doc-review    | [`doc-reviewer`](../../../.github/agents/doc-reviewer.agent.md)                                                         | Definition of Ready + traceability matrix          |
| [`test-scenarios.md`](test-scenarios.md) | scenarios     | [`test-strategy`](../../../.github/agents/test-strategy.agent.md)                                                       | scenarios from AC + RBAC matrix + gaps             |
| [`analyze.md`](analyze.md)               | analyze       | orchestrator ([`/analyze`](../../../.github/prompts/analyze.prompt.md))                                                 | spec↔plan↔code consistency → go/no-go              |
| [`review.md`](review.md)                 | implement     | [`reviewer`](../../../.github/agents/reviewer.agent.md) + [`code-review`](../../../.github/skills/code-review/SKILL.md) | diff findings + severity                           |
| [`audit.md`](audit.md)                   | implement     | `security` · `accessibility` · `ux-verifier` · `stack-guardian` · `performance` · `meta-reviewer`                       | read-only audit per dimension                      |
| [`doc.md`](doc.md)                       | (maintenance) | [`docs`](../../../.github/agents/docs.agent.md)                                                                         | canon page in `docs/` (DRY: points, does not copy) |

## Rules

- **DRY:** the format description in `*.agent.md` (`## Format`) **points to** the right template — it
  does not duplicate it. Changing the shape = editing the template, not 31 agents.
- **Placeholders:** `[?]` = to be filled in (as in `spec.md`); `{{token}}` = injected by
  `pnpm workflow:specify`.
- **Severity** (shared rubric): `blocker` (breaks a gate/contract → no-go) · `major` (debt/real
  risk) · `minor` (cosmetic).
