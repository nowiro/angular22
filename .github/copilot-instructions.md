# GitHub Copilot — angular22

> Digest na każdą sesję. On-demand: serwery MCP + token economy →
> [`instructions/mcp-usage.instructions.md`](instructions/mcp-usage.instructions.md);
> reguły lintu → `instructions/code-quality.instructions.md` (auto na `**/*.ts`);
> konwencje Angular → `instructions/angular.instructions.md` (auto na `{apps,libs}/**`);
> agenci → [`AGENTS.md`](../AGENTS.md); SDD → [`docs/sdd/methodology.md`](../docs/sdd/methodology.md);
> skille (`.github/skills/`): `angular-developer` · `angular-new-app` · `signal-forms` ·
> `material-wrappers` · `nx-generators` · `frontend-design` · `code-review` · `security-guidance` ·
> `ai-config-quality` · `keycloak-auth`.

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
  behaviour → drabina **doc-review** → specify (`pnpm workflow:specify`) → `/clarify` → plan →
  `/analyze` → implement → **verify (orchestrator/Opus)**; trywialne → wprost. Verb: `feature` ·
  `component` · `fix` / `refactor` / `deps` / `chore` / `security`. Każda iteracja →
  **datowany run-log** `docs/runs/YYYY-MM-DD_HH-MM_<slug>.md` (krok = agent + model + wynik).
- ✅ **doc-review + STOP na niejasności**: drabinę otwiera `doc-reviewer` (dokumentacja zadania ↔
  docs/Confluence ↔ **mockupy** spójne + jednoznaczne) **PRZED** kodem; cokolwiek niejasne /
  sprzeczne → **STOP, nie zgaduj, zapytaj**. Każdy krok: `status: done` w planie + **commit po
  kroku** (`scm`).
- ✅ **Testy w każdym planie** (trójka): **scenariusze testowe** (z AC, **per rola**
  admin/user/guest — `test-strategy`) + **testy jednostkowe** (Vitest, `@nx/vitest:test`) +
  **testy e2e** (Playwright, `@nx/playwright:playwright`; **przeklikują wszystkie elementy
  interaktywne per rola**; debug przez serwer **MCP `playwright`**) + **integracyjne gdy API**.
  Brak = **no-go**.
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
  końcowa); agenci **doc-MCP** (`angular-cli`, `nx`, `context7`) → `GPT-5 mini` i **tylko oni
  wołają doc-MCP** (reszta deleguje do nich); kod / testy / e2e / review / UX / specjaliści
  (`typescript`, `styles`, `html`, `seo-routing`, `accessibility`, `pixel-perfect`, `performance`, `i18n`, `deps`,
  `nx-architect`, `migration`, `web-components`, `docs`, `test-strategy`, `scm`, `meta-reviewer`,
  `keycloak`, …)
  → `Gemini 3.5 Flash`. Guard
  `ai:validate` wymusza `model:` + Opus na orchestratorze.
- ❌ Zero nie-Copilot (`CLAUDE.md`/`.claude/`/`.ai/`) i zero GitHub Actions — verify lokalnie.
- ✅ **Bootstrap środowiska**: przed `pnpm install` sprawdź czy `pnpm` jest dostępny
  (`pnpm --version`). Jeśli brak → `npm install -g pnpm@11.6.0` (wersja =
  `packageManager` w `package.json` / [`docs/tech-stack.md`](../docs/tech-stack.md)),
  dopiero potem `pnpm install`. Nigdy nie instaluj zależności projektu przez `npm install`.

## Definition of Done

`pnpm verify` zielone (pełna bramka; skład → [`AGENTS.md`](../AGENTS.md#komendy) / skrypt
`verify` w `package.json`) + dotknięte `e2e` zielone + UX z uruchomienia. **Weryfikacja końcowa =
re-weryfikacja orchestratora (Opus) po testach**: każde AC + e2e + testy integracyjne (gdy API) +
**sweep elementów interaktywnych per rola** (admin/user/guest). Run-log domknięty sekcjami **Raport
błędów** + **Rozliczenie / Telemetria** (model per krok, tokeny, kredyty Copilot, background taski,
sesje). Po zmianie agentów / modeli: **Reload Window**.

## Stack

**Kanon** (pinowane wersje · dozwolone/ZAKAZANE · reguły spójności) →
[`docs/tech-stack.md`](../docs/tech-stack.md); pilnuje agent `stack-guardian`. W skrócie:
Angular 22 (zoneless, Signal Forms) · Material 22 (tylko wrappery `@angular22/ui-material`) ·
Nx 22 · TypeScript 6 · Vitest + Playwright · ESLint flat + Prettier · **pnpm** (tylko).

## Komendy

`pnpm verify` (pełna bramka) · `pnpm e2e` (`--parallel=1`) · `pnpm start:individual` /
`start:business` / `start` · `pnpm workflow:specify -- --verb=<v> --slug=<s>` ·
`pnpm ai:validate` · `pnpm sdd:check` · `pnpm nx g @nx/angular:component <name>`.
