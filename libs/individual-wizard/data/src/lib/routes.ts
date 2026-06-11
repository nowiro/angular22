/**
 * Route registry — single source of truth for every URL in the
 * demo-individual-wizard app. `WizardPath.*` configures `Routes[]`;
 * `WizardNav.*` returns typed RouterLink command arrays.
 */

/** Stepper step indices — 1-indexed in the URL for user-friendliness. */
export type IndividualWizardStepIndex = 1 | 2 | 3 | 4 | 5;

export const INDIVIDUAL_WIZARD_STEP_COUNT = 5;

export const WizardPath = {
  Dashboard: '',
  Wizard: 'wizard',
  WizardStep: 'wizard/:step',
  Wildcard: '**',
} as const;
export type WizardPath = (typeof WizardPath)[keyof typeof WizardPath];

export const WizardNav = {
  /** `/` — dashboard with 5 step tiles. */
  dashboard: (): readonly ['/'] => ['/'] as const,
  /** `/wizard` — stepper at default step (1). */
  wizard: (): readonly ['/wizard'] => ['/wizard'] as const,
  /** `/wizard/:step` — stepper opened on a specific step (1..5). */
  wizardStep: (step: IndividualWizardStepIndex): readonly ['/wizard', IndividualWizardStepIndex] =>
    ['/wizard', step] as const,
} as const;
