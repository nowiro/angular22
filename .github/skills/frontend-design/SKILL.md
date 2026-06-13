---
name: frontend-design
description: Zasady projektowania UI/UX dla angular22 — hierarchia, rytm i spacing na tokenach --mat-sys-*, typografia, kontrast WCAG, RWD per breakpoint, stany, UX formularzy Signal Forms, polish checklist. Użyj przy budowie/poprawianiu ekranów i wrapperów.
---

# Frontend design — zasady repo

Buduj **tylko przez wrappery** `@angular22/ui-material` ([`material-wrappers`](../material-wrappers/SKILL.md))
i tokeny `--mat-sys-*`. Każda zasada niżej jest **mierzalna na żywej apce** — audytuje ją
[`ux-verifier`](../../agents/ux-verifier.agent.md) (`rect`/`scrollWidth`/`getComputedStyle`),
nie z lektury kodu. Konwencje warstwy → [`angular.instructions`](../../instructions/angular.instructions.md),
twarde reguły → [`copilot-instructions`](../../copilot-instructions.md).

## Hierarchia wizualna i rytm

- **Skala 4/8 px** (`0.25`/`0.5`/`1`/`1.5`/`3rem`) — żadnych magic px. Jeden rytm pionowy
  na ekranie; grupuj powiązane pola bliżej (gap mniejszy), sekcje dalej.
- **Density** spójna w obrębie ekranu — nie mieszaj zagęszczonych i luźnych `a22-card`
  w jednym gridzie (audyt: równe `getBoundingClientRect().height` kart w rzędzie).
- Jeden dominujący akcent na widok (primary `a22-button`); reszta `text`/`outline`.

## Typografia

- **Material type scale przez tokeny**: `font: var(--mat-sys-body-medium)`,
  `--mat-sys-label-large`, `--mat-sys-title-*`. **Nigdy** `font-size: 14px` na sztywno
  (audyt: `getComputedStyle().font` ma dziedziczyć rolę, nie hardcode).
- Max 2–3 stopnie typografii na ekran; nagłówki przez role title, nie pogrubiony body.

## Kolor i kontrast

- **Tylko role `--mat-sys-*`**: `surface`/`on-surface`/`on-surface-variant`,
  `primary`/`on-primary`, `error`/`error-container`, `outline-variant`. Zero hex w SCSS.
- **WCAG AA ≥ 4.5:1** dla tekstu (≥ 3:1 dla ikon/borderów). Para zawsze rola + jej `on-*`
  (`on-surface` na `surface`), nigdy `on-surface` na `primary`.
- Ciemny motyw **bywa czarny-na-czarnym** gdy ktoś hardkoduje kolor — niewidoczne w
  źródle, łapie to `ux-verifier` (computed colors). Brakuje roli/tokena → zgłoś do
  `material-wrapper`, nie obchodź bramki własnym hexem.

## Layout i RWD

- **Mobile-first**, breakpointy **360 / 768 / 1280 / 1920**; `@media (min-width: 768px)`
  jak w `wizard-shell`. Grid `grid-template-columns: 1fr` → `repeat(2/3, 1fr)` wyżej.
- **Stepper** (`a22-wizard-stepper`) flipuje na **vertical < 768**; poniżej 360 brak
  poziomego scrolla (audyt: `scrollingElement.scrollWidth ≤ clientWidth`).
- **Touch targets ≥ 44×44 px** — przyciski/ikony (`rect.width/height ≥ 44`).
- Kontener `min-height: 100vh`, treść nie ucieka poza viewport.

## Stany

Zaprojektuj **empty / loading / error / disabled / focus-visible** — każdy widoczny,
żaden nie powoduje **skoku layoutu** (audyt: rect stabilny między stanami). `focus-visible`
musi mieć widoczny outline; disabled czytelny, ale wyraźnie inny niż enabled.

## UX formularzy (Signal Forms)

Reszta → skill [`signal-forms`](../signal-forms/SKILL.md). Z perspektywy designu:
inline walidacja **po blur**, **stałe miejsce na komunikat** (`a22-field-error` rezerwuje
wysokość — bez skoku), **required** oznaczone wizualnie, focus na **pierwszym błędnym
polu** po submit, komunikaty **po polsku** (PL = klucz `a22T`).

## Motion

Subtelny, krótki; **respektuj `prefers-reduced-motion`** (wyłącz animacje). `ux-verifier`
przed zrzutem i tak wstrzykuje `* { animation: none; transition: none; }`.

## Pro-max checklist

**Alignment** (wspólna krawędź, audyt: równe `rect.left`) · **spójność** density/typografii
/spacingu · **brak martwego theming** (computed color ≠ tło) · **długość stringów EN** po
i18n (nie ucina, nie zawija brzydko) · stany kompletne · touch ≥ 44 · zero poziomego scrolla.

## NIE

- ❌ Hardcoded kolor (hex/rgb) ani `font-size`/spacing w px — tylko `--mat-sys-*` i skala 4/8.
- ❌ `::ng-deep`, `--mdc-*`, `--sys-*` (cicho nie działają).
- ❌ Projektowanie **wokół** bramki wrapperów/theming — brakuje wrappera/roli → `material-wrapper`.
- ❌ Werdykt „UX OK" **z czytania kodu** — tylko z uruchomienia (`pnpm start:*` + `ux-verifier`).
