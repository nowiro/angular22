# GitHub Copilot — angular22

> Digest na każdą sesję. On-demand: serwery MCP + token economy →
> [`instructions/mcp-usage.instructions.md`](instructions/mcp-usage.instructions.md);
> reguły lintu → `instructions/code-quality.instructions.md` (auto na `**/*.ts`);
> konwencje Angular → `instructions/angular.instructions.md` (auto na `{apps,libs}/**`);
> agenci → [`AGENTS.md`](../AGENTS.md); SDD → [`docs/sdd/methodology.md`](../docs/sdd/methodology.md).

## Tożsamość

**angular22** — demo monorepo **tylko dla GitHub Copilot** (VS Code ≥ 1.121): Angular 22
(zoneless, standalone, signals, **Signal Forms**) + Nx 22 + Angular Material 22. Trzy apki:
`portal` (:4200 — kafelki + embed wizardów jako web components, feature flags z config.json) · `demo-individual-wizard` (:4201) · `demo-business-wizard`
(:4202) + 10 libów. Serwery MCP: `context7` · `nx` · `angular-cli` · `playwright`.

## Język

Czat **po polsku** (dopóki user nie przełączy); kod / git / ścieżki / nazwy — **po
angielsku**. UI aplikacji: **PL domyślny, EN drugi** (i18n przez `a22T`). Odpowiadaj
zwięźle: wynik ponad proces.

## Twarde reguły (jedyne źródło — inne pliki tu wskazują)

- ✅ Każde zadanie przez **orchestrator** (jedyny widoczny agent; `pnpm ai:validate`
  wymusza 1) → plan → delegacja do subagenta → bramka DoD.
- ✅ **SDD progowo** (kanon `docs/sdd/methodology.md`, adaptacja
  [github/spec-kit](https://github.com/github/spec-kit)): ≥2 plików **lub** zmiana
  behaviour → drabina specify (`pnpm workflow:specify`) → `/clarify` → plan → `/analyze`
  → implement → **verify (orchestrator/Opus)**; trywialne → wprost. Verb: `feature` ·
  `component` · `fix` / `refactor` / `deps` / `chore` / `security`. Każda iteracja →
  **datowany run-log** `docs/runs/YYYY-MM-DD_HH-MM_<slug>.md` (krok = agent + model + wynik).
- ✅ **Testy w każdym planie** (trójka): **scenariusze testowe** (z AC) + **testy
  jednostkowe** (Vitest, `@nx/vitest:test`) + **testy e2e** (Playwright,
  `@nx/playwright:playwright`; debug przez serwer **MCP `playwright`**). Brak = **no-go**.
- ✅ **Lint PRZED kodem**: przeczytaj `code-quality.instructions.md` zanim napiszesz
  pierwszą linię — kod ma przejść `pnpm lint` **z miejsca**, bez rundy poprawek.
- ✅ **Komponenty TYLKO przez generator**: `pnpm nx g @nx/angular:component`
  (SCSS + OnPush + trzy pliki `.ts`/`.html`/`.scss` + prefix `a22`). Nigdy ręcznie,
  nigdy inline template/styles.
- ✅ **Material gate**: `@angular/material/*`/`@angular/cdk/*` tylko w `libs/ui/material`
  (lint error) — wszędzie indziej wrappery `@angular22/ui-material`. Theming tylko
  `--mat-sys-*` + `mat.theme()`.
- ✅ **Formularze = Signal Forms** (`form()`/`schema()`/`[formField]`); zakaz
  `FormGroup`/`FormBuilder`/`ngModel`.
- ✅ **i18n**: teksty UI literałem PL przez pipe `a22T` (PL = klucz, EN w mapach
  tłumaczeń); nowy tekst = literał PL + wpis EN. Przełącznik w toolbarze; PL domyślny.
- ✅ **Niepewne API → MCP** (`angular-cli`/`nx`/`context7`), nie z pamięci. **UX weryfikuj
  uruchomieniem** (`pnpm start:*`), nie z kodu.
- ✅ **Modele LLM** (token economy): orchestrator → `Claude Opus 4.8` (plan + weryfikacja
  końcowa); agenci MCP (`nx`, `context7`) → `GPT-5 mini`; kod/testy/e2e/review/UX →
  `Gemini 3.5 Flash`. Guard `ai:validate` wymusza `model:` + Opus na orchestratorze.
- ❌ Zero nie-Copilot (`CLAUDE.md`/`.claude/`/`.ai/`) i zero GitHub Actions — verify lokalnie.

## Definition of Done

`pnpm verify` zielone (format:check + ai:validate + sdd:check + lint + typecheck + test +
build) + dotknięte `e2e` zielone + UX z uruchomienia. **Weryfikacja końcowa orchestratora
(Opus)** zapisana w run-logu. Po zmianie agentów / modeli: **Reload Window**.

## Stack

- **Runtime:** Node `>=24.15.0` (`.nvmrc` `24.16.0`) · `pnpm@11.1.3`
- **Angular:** `22.0.0` (zoneless, Signal Forms stabilne) · **Material:** `22.0.0` ·
  **Nx:** `22.7.5` · **TypeScript:** `6.0.3`
- **Testy:** Vitest `4.1.8` (unit, liby) · Playwright `1.60.0` (e2e, chromium)
- **Lint/format:** ESLint `10` flat (angular-eslint 22 + typescript-eslint 8 type-aware +
  sonarjs + unicorn + import-x + jsdoc) + Prettier (sort importów)

## Komendy

`pnpm verify` (pełna bramka) · `pnpm e2e` (`--parallel=1`) · `pnpm start:individual` /
`start:business` / `start` · `pnpm workflow:specify -- --verb=<v> --slug=<s>` ·
`pnpm ai:validate` · `pnpm sdd:check` · `pnpm nx g @nx/angular:component <name>`.
