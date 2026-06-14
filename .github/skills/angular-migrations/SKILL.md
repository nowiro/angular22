---
name: angular-migrations
description: Playbook migracji Angular (standalone → control-flow → inject → signals → … → zoneless) dla v19–v22 — kolejność, idempotentne schematic'y `@angular/core`, weryfikacja per krok, brama wersjonowana. Używa agent `migration`.
---

# Angular migrations — playbook repo

Wiedza, którą stosuje agent [`migration`](../../agents/migration.agent.md). Tu jest **JAK** prowadzić
modernizację kodu Angulara (standalone → zoneless) na checkoutach **v19–v22**. Pełna tabela 13 migracji

- komendy + meta zoneless = kanon [`docs/angular-migrations.md`](../../../docs/angular-migrations.md) —
  **nie duplikuj jej tutaj**, wskazuj.

## Zakres (vs bump majora)

- **Tutaj:** modernizacja **kodu wewnątrz** wersji oficjalnymi schematic'ami `@angular/core`
  (`ng generate @angular/core:<id>`) — standalone, control-flow, inject, signals, template polish, testy.
- **Bump majora** (`nx migrate` / `ng update`, przeskok 19→20→21→22) → [`migration`](../../agents/migration.agent.md) §Pętla.
  Typowy ciąg: bump majora **→** uruchom schematic'y modernizacji, które ten major wprowadził.

## Drabina (kolejność obowiązkowa)

Kolejność z [kanonu](../../../docs/angular-migrations.md) (1→13), bo kroki na siebie wpływają:
struktura (standalone, common-to-standalone, control-flow) **→** sprzątanie importów **→** DI (inject)
**→** routing (lazy) **→** reaktywność (signal inputs/outputs/queries) **→** szablony (self-closing,
ngclass, ngstyle) **→** testy (router-testing-module) **→** **zoneless** (config, bez codemodu).

`cleanup-unused-imports` (#4) uruchamiaj **po** standalone/control-flow — dopiero wtedy importy
(`CommonModule`, dyrektywy CF) są naprawdę zbędne.

## Pętla per migracja

1. **Dostępność + flagi** dla docelowego majora → potwierdź przez doc-MCP `angular-cli`
   (`ng generate --help`), **nie z pamięci** ([`mcp-usage`](../../instructions/mcp-usage.instructions.md)).
2. `pnpm ng generate @angular/core:<id>` (właściwa flaga, np. `--migrate-space-separated-key` dla
   `ngclass-to-class`, `--best-effort-mode` dla `ngstyle-to-style`).
3. **Przejrzyj diff** — schematic'y są bezpieczne, ale migrują tylko „pewne" przypadki; resztę dokończ
   ręcznie (deleguj do `angular-engineer`).
4. `pnpm verify` (pełna bramka) + dotknięte `pnpm e2e` zielone.
5. **Commit** (`scm`, conventional) — **jedna migracja = jeden commit**, nie mieszaj z feature.

## Wielowersyjność (v19–v22)

- Uruchamiaj **tylko** migracje, które docelowy major już wprowadził (niektóre, np. `ngclass-to-class`/
  `ngstyle-to-style`, są nowsze — sprawdź `angular-cli` MCP).
- **Brama lintu jest wersjonowana** ([`eslint.config.mjs`](../../../eslint.config.mjs)): Signal-Forms
  egzekwowane od ≥ 22, na < 22 wyłączone — checkout sprzed migracji nie sypie fałszywymi błędami.
- Idempotencja: schematic można uruchomić ponownie po bumpie kolejnego majora — nie psuje już-zmigrowanego.

## Zoneless (domknięcie)

Brak codemodu: `provideZonelessChangeDetection()` + usunięcie `zone.js`. Warunek: kod na sygnałach
(po migracjach signals) bez polegania na automatycznym CD Zone.js. W repo już osiągnięte i egzekwowane
(`zone.js` off-stack — [`tech-stack.md`](../../../docs/tech-stack.md)).

## NIE

- Nie zgaduj id/flag schematicu — potwierdź przez `angular-cli` MCP.
- Nie uruchamiaj migracji bez przeglądu diffu i `pnpm verify`.
- Nie mieszaj wielu migracji ani migracji z feature w jednym commicie.
- Nie wymuszaj migracji niedostępnej dla docelowego majora.
