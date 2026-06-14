---
name: frontend-design
description: UI/UX design rules for angular22 — hierarchy, rhythm and spacing on --mat-sys-* tokens, typography, WCAG contrast, RWD per breakpoint, states, Signal Forms form UX, polish checklist. Use when building/fixing screens and wrappers.
---

# Frontend design — repo rules

Build **only through wrappers** `@angular22/ui-material` ([`material-wrappers`](../material-wrappers/SKILL.md))
and `--mat-sys-*` tokens. Every rule below is **measurable on the live app** — audited by
[`ux-verifier`](../../agents/ux-verifier.agent.md) (`rect`/`scrollWidth`/`getComputedStyle`),
not from reading code. Fidelity vs **mockups** (when present) →
[`pixel-perfect`](../../agents/pixel-perfect.agent.md). Layer conventions →
[`angular.instructions`](../../instructions/angular.instructions.md),
hard rules → [`copilot-instructions`](../../copilot-instructions.md).

## Visual hierarchy and rhythm

- **4/8 px scale** (`0.25`/`0.5`/`1`/`1.5`/`3rem`) — no magic px. One vertical rhythm
  per screen; group related fields closer (smaller gap), sections farther apart.
- **Density** consistent within a screen — don't mix dense and loose `a22-card`
  in one grid (audit: equal `getBoundingClientRect().height` for cards in a row).
- One dominant accent per view (primary `a22-button`); the rest `text`/`outline`.

## Typography

- **Material type scale via tokens**: `font: var(--mat-sys-body-medium)`,
  `--mat-sys-label-large`, `--mat-sys-title-*`. **Never** hardcode `font-size: 14px`
  (audit: `getComputedStyle().font` must inherit the role, not hardcode).
- Max 2–3 typography steps per screen; headings via title roles, not bold body.

## Color and contrast

- **Only `--mat-sys-*` roles**: `surface`/`on-surface`/`on-surface-variant`,
  `primary`/`on-primary`, `error`/`error-container`, `outline-variant`. Zero hex in SCSS.
- **WCAG AA ≥ 4.5:1** for text (≥ 3:1 for icons/borders). The pair is always a role + its `on-*`
  (`on-surface` on `surface`), never `on-surface` on `primary`.
- Dark theme **can go black-on-black** when someone hardcodes a color — invisible in
  source, caught by `ux-verifier` (computed colors). Missing role/token → report to
  `material-wrapper`, don't bypass the gate with your own hex.

## Layout and RWD

- **Mobile-first**, breakpoints **360 / 768 / 1280 / 1920**; `@media (min-width: 768px)`
  as in `wizard-shell`. Grid `grid-template-columns: 1fr` → `repeat(2/3, 1fr)` higher up.
- **Stepper** (`a22-wizard-stepper`) flips to **vertical < 768**; below 360 no
  horizontal scroll (audit: `scrollingElement.scrollWidth ≤ clientWidth`).
- **Touch targets ≥ 44×44 px** — buttons/icons (`rect.width/height ≥ 44`).
- Container `min-height: 100vh`, content doesn't escape the viewport.

## States

Design **empty / loading / error / disabled / focus-visible** — each visible,
none causing a **layout shift** (audit: rect stable across states). `focus-visible`
must have a visible outline; disabled readable, but clearly different from enabled.

## Form UX (Signal Forms)

Rest → skill [`signal-forms`](../signal-forms/SKILL.md). From a design perspective:
inline validation **on blur**, **fixed space for the message** (`a22-field-error` reserves
height — no shift), **required** marked visually, focus on the **first invalid
field** after submit, messages **in Polish** (PL = `a22T` key).

## Motion

Subtle, short; **respect `prefers-reduced-motion`** (disable animations). `ux-verifier`
injects `* { animation: none; transition: none; }` before the screenshot anyway.

## Pro-max checklist

**Alignment** (shared edge, audit: equal `rect.left`) · **consistency** of density/typography
/spacing · **no dead theming** (computed color ≠ background) · **EN string length** after
i18n (doesn't truncate, doesn't wrap badly) · states complete · touch ≥ 44 · zero horizontal scroll.

## NO

- ❌ Hardcoded color (hex/rgb) or `font-size`/spacing in px — only `--mat-sys-*` and the 4/8 scale.
- ❌ `::ng-deep`, `--mdc-*`, `--sys-*` (silently don't work).
- ❌ Designing **around** the wrapper/theming gate — missing wrapper/role → `material-wrapper`.
- ❌ "UX OK" verdict **from reading code** — only from running (`pnpm start:*` + `ux-verifier`).
