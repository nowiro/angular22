/**
 * Wizard step / dashboard-tile status model shared by every wizard.
 *
 * The mapping:
 * - `done`       — the step's sub-form is valid
 * - `incomplete` — the sub-form is invalid AND has been touched
 * - `untouched`  — the sub-form is invalid AND still pristine
 *
 * Works directly on a Signal Forms `FieldState` (its `valid` / `touched`
 * members are signals, i.e. zero-arg functions), but the structural
 * `StepStateLike` keeps this lib free of `@angular/forms` imports.
 */

export type WizardStepStatus = 'done' | 'incomplete' | 'untouched';

export interface StepStateLike {
  valid(): boolean;
  touched(): boolean;
}

export function stepStatus(state: StepStateLike): WizardStepStatus {
  if (state.valid()) return 'done';
  return state.touched() ? 'incomplete' : 'untouched';
}
