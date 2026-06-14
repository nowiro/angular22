---
name: ai-config-quality
description: Quality rubric for angular22 AI config (agents/skills/instructions/prompts) — DRY (canon, not duplicate), single-responsibility, boundaries, house-style, cross-refs, frontmatter per type, token economy, MCP rule; applied by the `meta-reviewer` agent. Use on changes to `.github/{agents,skills,instructions,prompts}`, `AGENTS.md`, `copilot-instructions`.
---

# AI config quality — repo playbook

Knowledge applied by the [`meta-reviewer`](../../agents/meta-reviewer.agent.md) agent (read-only).
This is **HOW** to assess AI config **beyond** the structural guard `pnpm ai:validate`
([`validate-ai-config.mjs`](../../../tools/scripts/validate-ai-config.mjs): 1 visible agent,
frontmatters, `mcp.json`). The guard catches structure; **you catch semantics** — DRY, boundaries,
overlap, house-style. Red `ai:validate` = `no-go` immediately, no semantic analysis.

## Rubric (config prose, same as code)

1. **DRY / single source of truth** — a rule lives in **ONE** canon
   ([`copilot-instructions`](../../copilot-instructions.md) / `angular.instructions` /
   [`AGENTS.md`](../../../AGENTS.md) / a given skill), other files **point to it via link** (repo:
   "single source — other files point here"). A copied rule = **finding** (canon drift).
2. **Single-responsibility** — each agent has **ONE** clear role. Overlap of two agents =
   merge or delineate (precedent: `angular` → `angular-engineer`). Two files about the same thing = finding.
3. **Boundaries / hand-off** — each agent has a delineating section pointing to its neighbors
   (`accessibility` code ⇄ `ux-verifier` runtime; `styles` SCSS ⇄ `material-wrapper` tokens).
   Missing boundary = routing-collision risk = finding.
4. **House-style** — concise PL prose; agent: intro "Orchestrator subagent …" + When / Loop /
   Boundary / Format + closing **NO**. Identifiers in \`backticks\`, cross-refs via relative link.
5. **Frontmatter per type** (beyond what the guard enforces):
   - agent → `description` + `model` + `tools` (+ `user-invocable: false` for non-orchestrator),
   - prompt → `agent` + `description`,
   - skill → `name` + `description` (**no `tools`**),
   - instruction → `applyTo` + `description`.
6. **Cross-refs** — relative links point to **existing** files (orphaned link = finding);
   agent names in prose match `.github/agents/*.agent.md`. Typo in a name = finding.
7. **Token economy** — dense, no bloat or repetition; agent ~30-60 lines. Model per tier:
   code / fix / review / audit / UX → `Gemini 3.5 Flash`; doc-MCP → `GPT-5 mini`; orchestrator → Opus.
8. **MCP rule** — doc-MCP (`context7` / `nx` / `angular-cli`) is called **only** by its dedicated
   GPT-5 mini agent; everyone else **delegates**. `playwright` MCP = only `playwright` / `ux-verifier` /
   `pixel-perfect` (allowlist canon → [`mcp-usage`](../../instructions/mcp-usage.instructions.md)).
   Direct MCP call outside the owner = **finding**.

## Severity

| severity    | meaning                          | example                                                  |
| ----------- | -------------------------------- | -------------------------------------------------------- |
| **blocker** | breaks guard / contract / DRY    | duplicated rule, orphaned link, MCP outside owner        |
| **major**   | works, but debt / collision risk | missing boundary section, role overlap, wrong model tier |
| **minor**   | cosmetics                        | house-style drift, redundant repetition, long agent      |

## Verdict format

Table + partial verdict:

```
| file | finding | rule | severity | suggestion |
```

After the table, **one sentence**: `go` / `no-go`. One blocker = `no-go`. **The final verdict
belongs to the orchestrator (Opus)** — you supply the material, not the merge decision.

## NO

- **Don't edit files** — the audit is read-only; you flag the finding, you don't patch it.
- **Don't duplicate the guard** — structure (1 visible, frontmatter, `mcp.json`) is checked by `ai:validate`;
  you assess the **semantics** beyond it.
- **Don't invent rules** — anchor every finding in a real repo canon, not a generic "best practice".
