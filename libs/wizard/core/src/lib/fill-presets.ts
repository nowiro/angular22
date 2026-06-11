import { InjectionToken } from '@angular/core';

/**
 * Filling modes exposed by the dev panel:
 * - `required` — fill only fields needed for a valid submit
 * - `all`      — fill every visible field
 * - `max`      — force the deepest conditional shape (extra rows, all branches)
 */
export type FillMode = 'required' | 'all' | 'max';

/**
 * Contract each wizard provides for the dev-fill panel. With Signal Forms,
 * "filling the form" is just replacing the model signal with a preset value —
 * no control-tree walking required.
 */
export interface WizardFillPresets {
  fill(mode: FillMode): void;
}

/**
 * DI token consumed by `A22DevFillPanelComponent`. Apps provide an
 * implementation in `app.config.ts`:
 *
 * ```ts
 * { provide: WIZARD_FILL_PRESETS, useExisting: IndividualWizardStore }
 * ```
 */
export const WIZARD_FILL_PRESETS = new InjectionToken<WizardFillPresets>('WIZARD_FILL_PRESETS');
