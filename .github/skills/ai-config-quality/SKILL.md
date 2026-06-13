---
name: ai-config-quality
description: Rubryka jakości configu AI angular22 (agents/skills/instructions/prompts) — DRY (kanon, nie duplikat), single-responsibility, granice, house-style, cross-refy, frontmatter per typ, token economy, reguła MCP; stosuje agent `meta-reviewer`. Użyj przy zmianach w `.github/{agents,skills,instructions,prompts}`, `AGENTS.md`, `copilot-instructions`.
---

# AI config quality — playbook repo

Wiedza, którą stosuje agent [`meta-reviewer`](../../agents/meta-reviewer.agent.md) (read-only).
Tu jest **JAK** ocenić config AI **ponad** strukturalny guard `pnpm ai:validate`
([`validate-ai-config.mjs`](../../../tools/scripts/validate-ai-config.mjs): 1 widoczny agent,
frontmattery, `mcp.json`). Guard łapie strukturę; **Ty łapiesz semantykę** — DRY, granice,
overlap, house-style. Czerwony `ai:validate` = `no-go` od razu, bez analizy semantycznej.

## Rubryka (proza-config, analogicznie do kodu)

1. **DRY / single source of truth** — reguła żyje w **JEDNYM** kanonie
   ([`copilot-instructions`](../../copilot-instructions.md) / `angular.instructions` /
   [`AGENTS.md`](../../../AGENTS.md) / dany skill), inne pliki **wskazują linkiem** (repo:
   „jedyne źródło — inne pliki tu wskazują"). Skopiowana reguła = **finding** (rozjazd kanonu).
2. **Single-responsibility** — każdy agent ma **JEDNĄ** jasną rolę. Overlap dwóch agentów =
   scal albo rozgranicz (precedens: `angular` → `angular-engineer`). Dwa pliki o tym samym = finding.
3. **Granice / hand-off** — każdy agent ma sekcję rozgraniczającą wskazującą sąsiadów
   (`accessibility` kod ⇄ `ux-verifier` runtime; `styles` SCSS ⇄ `material-wrapper` tokeny).
   Brak granicy = ryzyko kolizji routingu = finding.
4. **House-style** — PL proza zwięzła; agent: intro „Subagent orchestratora …" + Kiedy / Pętla /
   Granica / Format + zamykające **NIE**. Identyfikatory w \`backtickach\`, cross-refy linkiem względnym.
5. **Frontmatter per typ** (poza tym co wymusza guard):
   - agent → `description` + `model` (+ `user-invocable: false` dla nie-orchestratora),
   - prompt → `agent` + `description`,
   - skill → `name` + `description` (**bez `tools`**),
   - instrukcja → `applyTo` + `description`.
6. **Cross-refy** — linki względne wskazują **istniejące** pliki (osierocony link = finding);
   nazwy agentów w prozie zgodne z `.github/agents/*.agent.md`. Literówka w nazwie = finding.
7. **Token economy** — gęsto, bez bloatu i powtórzeń; agent ~30-60 linii. Model wg tieru:
   kod / fix / review / audyt / UX → `Gemini 3.5 Flash`; doc-MCP → `GPT-5 mini`; orchestrator → Opus.
8. **Reguła MCP** — doc-MCP (`context7` / `nx` / `angular-cli`) woła **tylko** ich dedykowany
   agent GPT-5 mini; reszta **deleguje**. `playwright` MCP = tylko `playwright` / `ux-verifier`.
   Bezpośrednie wołanie MCP poza właścicielem = **finding**.

## Severity

| severity    | znaczenie                         | przykład                                                |
| ----------- | --------------------------------- | ------------------------------------------------------- |
| **blocker** | łamie guard / kontrakt / DRY      | duplikat reguły, osierocony link, MCP poza właścicielem |
| **major**   | działa, ale dług / ryzyko kolizji | brak sekcji granicy, overlap ról, zły tier modelu       |
| **minor**   | kosmetyka                         | drift house-style, zbędne powtórzenie, długi agent      |

## Format werdyktu

Tabela + werdykt cząstkowy:

```
| plik | finding | zasada | severity | sugestia |
```

Po tabeli **jedno zdanie**: `go` / `no-go`. Jeden blocker = `no-go`. **Werdykt końcowy
należy do orchestratora (Opus)** — Ty dostarczasz materiał, nie decyzję merge.

## NIE

- **Nie edytuj plików** — audyt jest read-only; wskazujesz finding, nie patchujesz.
- **Nie dubluj guarda** — strukturę (1 widoczny, frontmatter, `mcp.json`) sprawdza `ai:validate`;
  Ty oceniasz **semantykę** ponad nią.
- **Nie wymyślaj reguł** — kotwicz każdy finding w realnym kanonie repo, nie w generycznym „best practice".
