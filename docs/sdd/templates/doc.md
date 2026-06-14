---
type: template
for: docs
description: Shape of a docs/ canon page — DRY (points to the source of truth, does not copy rules)
---

# Template: documentation page (`docs/<topic>.md`)

> Canonical shape of a page produced by [`docs`](../../../.github/agents/docs.agent.md).
> **DRY first:** the page **points to** the canon ([`copilot-instructions`](../../../.github/copilot-instructions.md),
> [`AGENTS.md`](../../../AGENTS.md), [`../methodology.md`](../methodology.md)) — it does **not** copy rules.
> Token economy: dense, link instead of copy. Facts must match the code (`apps/*`, `libs/*`,
> `package.json`, `*.agent.md`).

---

# <Topic title>

> [?] One-sentence page goal + (if a derivative) **pointer to the source of truth**: "The canon for X
> lives in `<file>` — this page only <role>".

## Why (context)

[?] What problem / decision the page documents and when to reach for it.

## Content

[?] The core — map / steps / table. Link the canon instead of rewriting rules. Names (selector /
API / port / script / path) **exactly** as in the code (name mismatch → `doc-verifier` glossary).

## Boundary / what is not here

[?] What deliberately lives elsewhere (link) to avoid duplication.

## Links

[?] Related canon pages and code files.
