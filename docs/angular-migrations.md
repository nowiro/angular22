# Migracje Angular (standalone → zoneless) — kanon angular22

> **Kanon** ścieżki modernizacji Angulara dla angular22 (wsparcie **v19 → v20 → v21 → v22**,
> meta aż do **zoneless**). Repo jest już na **22 + zoneless**; ta mapa służy do (1) utrzymania
> demo na najnowszym i (2) prowadzenia checkoutu na 19/20/21 **w trakcie migracji** bez fałszywych
> błędów (brama lintu **wersjonowana** — patrz niżej). Wykonawca: agent
> [`migration`](../.github/agents/migration.agent.md) + playbook
> [`angular-migrations`](../.github/skills/angular-migrations/SKILL.md). Wersje frameworka →
> [`tech-stack.md`](tech-stack.md) (single source of truth), **nie** z pamięci.

## Drabina migracji (kolejność zalecana)

Każda migracja to oficjalny schematic `@angular/core`, **idempotentny** (bezpieczny do ponownego
uruchomienia). Komenda bazowa: `pnpm ng generate @angular/core:<id>` (alias `pnpm ng g …`).

| #   | Migracja                  | Komenda (`pnpm ng generate …`)                  | Co robi                                                                                 |
| --- | ------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | Standalone                | `@angular/core:standalone`                      | Komponenty/dyrektywy/pipe’y → standalone; usuwa zbędne `NgModule`; bootstrap standalone |
| 2   | CommonModule → Standalone | `@angular/core:common-to-standalone`            | `CommonModule` → pojedyncze importy dyrektyw/pipe’ów                                    |
| 3   | Control Flow Syntax       | `@angular/core:control-flow`                    | `*ngIf`/`*ngFor`/`*ngSwitch` → `@if`/`@for`/`@switch`                                   |
| 4   | Clean up unused imports   | `@angular/core:cleanup-unused-imports`          | Usuwa nieużywane importy standalone (po 1–3)                                            |
| 5   | inject() Function         | `@angular/core:inject`                          | DI przez konstruktor → `inject()`                                                       |
| 6   | Lazy-loaded routes        | `@angular/core:route-lazy-loading`              | Trasy eager → `loadComponent`/`loadChildren` (code-splitting)                           |
| 7   | Signal inputs             | `@angular/core:signal-input-migration`          | `@Input()` → `input()` / `input.required()`                                             |
| 8   | Outputs                   | `@angular/core:output-migration`                | `@Output() … EventEmitter` → `output()`                                                 |
| 9   | Signal queries            | `@angular/core:signal-queries-migration`        | `@ViewChild`/`@ContentChild(ren)` → `viewChild()`/`contentChild()` …                    |
| 10  | Self-closing tags         | `@angular/core:self-closing-tag`                | `<cmp></cmp>` → `<cmp />` tam, gdzie to bezpieczne                                      |
| 11  | NgClass → Class           | `@angular/core:ngclass-to-class`                | `[ngClass]` → `[class]` (flaga `--migrate-space-separated-key`)                         |
| 12  | NgStyle → Style           | `@angular/core:ngstyle-to-style`                | `[ngStyle]` → `[style]` (flaga `--best-effort-mode`)                                    |
| 13  | Router Testing Module     | `@angular/core:router-testing-module-migration` | `RouterTestingModule` → `RouterModule` + `provideLocationMocks()`                       |

## Meta: zoneless (stan końcowy)

**Brak codemodu** — zoneless to zmiana konfiguracji, nie schematic:

- `provideZonelessChangeDetection()` w bootstrapie (zamiast `provideZoneChangeDetection`),
- usunięcie `zone.js` z polyfilli i zależności.

W tym repo jest **już osiągnięty** i egzekwowany: `zone.js` jest **off-stack** (lint / `stack-guardian`,
[`tech-stack.md`](tech-stack.md)). Warunek wejścia: kod działa na sygnałach (migracje 7–9) i nie
polega na automatycznym CD Zone.js.

## Brama wersjonowana (Signal Forms ≥ 22)

Zgodność z wielowersyjnością pilnuje [`eslint.config.mjs`](../eslint.config.mjs): major czytany z
`@angular/core` (fallback `package.json`). Od **≥ 22** import gołego `@angular/forms`
(`FormGroup`/`FormBuilder`/`ngModel` + bridge `…/signals/compat`) = **błąd lintu**
(`no-restricted-syntax`); na **< 22** reguła jest **wyłączona**, więc checkout sprzed migracji na
Signal Forms nie produkuje fałszywych błędów. Detale → [`angular.instructions.md`](../.github/instructions/angular.instructions.md).

## Reguły wykonania

- **Jedna migracja = jeden commit** (verb SDD `chore`/`deps`, przez `scm`) — nie mieszaj z feature.
- **Po każdej migracji `pnpm verify`** (pełna bramka) + dotknięte `pnpm e2e` zielone; rozjazd kodu
  po codemodzie → `angular-engineer`, lawina lintu → `eslint`, typy → `typescript`.
- **Dokładne flagi / dostępność per major** potwierdzaj przez doc-MCP `angular-cli`
  (`ng generate --help`) — **nie zgaduj** ([`mcp-usage`](../.github/instructions/mcp-usage.instructions.md)).
- Migracje są **idempotentne** — ponowne uruchomienie nie psuje już-zmigrowanego kodu.
- Bump majora frameworka (`nx migrate` / `ng update`) → [`migration`](../.github/agents/migration.agent.md)
  §Pętla; te schematics to **modernizacja kodu wewnątrz** wersji, nie bump.
