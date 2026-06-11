# Instrukcje Copilota — nowiro/angular22

Monorepo demo: **Angular 22 + Nx + Angular Material + Signal Forms**. Dwa kreatory formularzy
(`demo-individual-wizard`, `demo-business-wizard`) + landing (`angular22`). Czat prowadź po polsku;
kod, nazwy, commity i identyfikatory — po angielsku.

## Stack (nie zmieniaj bez wyraźnego polecenia)

- Angular **22.0.0** — zoneless (bez zone.js), standalone, signals, **Signal Forms** (`@angular/forms/signals`).
- Nx **22.7.5** — monorepo `apps/*` + `libs/*`, granice modułów przez tagi `scope:*` / `type:*`.
- Angular Material **22** — wyłącznie przez wrappery z `@angular22/ui-material`.
- pnpm (pin `packageManager`), Vitest (unit), Playwright (e2e, chromium), ESLint flat config, Prettier.
- Node ≥ 24.15 (`.nvmrc`).

## Twarde reguły

1. **Material wrapper gate** — import `@angular/material/*` lub `@angular/cdk/*` poza `libs/ui/material`
   to błąd lintu. Używaj `<a22-text-field>`, `<a22-select>`, `<a22-checkbox>`, `<a22-date-field>`,
   `<a22-number-field>`, `<a22-button>`, `<a22-card>`, `<a22-toolbar>`, `<a22-icon>`, `<a22-divider>`,
   `<a22-wizard-stepper>` + `A22NotificationService`. Brakuje wrappera? Dodaj go w `libs/ui/material`.
2. **Tylko Signal Forms** — model formularza to `signal<T>()`, walidacja w `schema()`
   (`required`/`validate`/`applyWhen`/`applyEach`/`hidden`/`disabled` z komunikatami PL),
   bindowanie przez `[formField]`. Zakaz `FormGroup`/`FormBuilder`/`ngModel`.
   Wrappery pól implementują `FormValueControl`/`FormCheckboxControl`.
3. **Komponenty zawsze w trzech plikach** — `*.component.ts` + `*.component.html` + `*.component.scss`
   (`templateUrl`/`styleUrl`). Bez inline template/styles. SCSS domyślnie.
4. **Standalone + OnPush + signals** — `input()`/`model()`/`output()`/`computed()`, `inject()` zamiast
   konstruktora, natywny control flow (`@if`/`@for`/`@switch`). Selektory z prefiksem `a22`.
5. **Granice modułów** — `scope:shared` (ui-material, wizard/\*) ← wszyscy;
   `scope:individual-wizard` i `scope:business-wizard` nie widzą się nawzajem.
   Warstwy: `app → feature → ui/data-access → util`. Public API liba wyłącznie przez `src/index.ts`.
6. **Styling** — tokeny Material 3 (`--mat-sys-*`), motyw przez `mat.theme()` w `styles.scss` apki.
   Zakaz `::ng-deep` i hardkodowanych kolorów.
7. **Dane testowe** — generatory z `@angular22/wizard-core` produkują identyfikatory z poprawnymi
   sumami kontrolnymi (PESEL/NIP/REGON). Panel dev-fill działa tylko na localhoście.
8. **Zero GitHub Actions** — weryfikacja lokalna (`pnpm verify`), żadnych workflow/dependabota.
9. **`data-testid`** na elementach interaktywnych; e2e wybiera `getByTestId`/`getByRole`.

## Komendy

```bash
pnpm start:individual   # port 4201
pnpm start:business     # port 4202
pnpm start              # landing, port 4200

pnpm lint && pnpm typecheck && pnpm test && pnpm build   # = pnpm verify
pnpm e2e                # Playwright (wymaga: npx playwright install chromium)
```

Zadania uruchamiaj przez Nx (`pnpm nx run <projekt>:<target>`, `pnpm nx affected -t lint test build`).
Nowe liby/komponenty generuj przez `pnpm nx g @nx/angular:library|component` (ustawienia domyślne
w `nx.json`: scss, OnPush, prefix `a22`, bez unit-runnera — vitest dodajemy ręcznie wg wzorca
z `libs/wizard/core`).

## Serwery MCP (`.vscode/mcp.json`)

- **context7** — aktualna dokumentacja bibliotek; użyj PRZED pisaniem kodu dotykającego API
  Angular 22 / Signal Forms / Nx / Material.
- **nx** — graf workspace, generatory, `nx_docs`.
- **angular-cli** — `get_best_practices`, `search_documentation`, `find_examples`.
- **playwright** — uruchamianie i debug e2e w przeglądarce.

## Definition of Done

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` i dotknięte `e2e` — wszystkie zielone.
Po zmianie zachowania zaktualizuj testy i `README.md`.
