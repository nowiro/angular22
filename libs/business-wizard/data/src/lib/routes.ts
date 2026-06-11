/**
 * Route registry — single source of truth for every URL in the
 * demo-business-wizard app.
 */

/** Stepper step indices — 1-indexed in the URL for user-friendliness. */
export type BusinessWizardStepIndex = 1 | 2 | 3 | 4 | 5 | 6;

export const BUSINESS_WIZARD_STEP_COUNT = 6;

export const WizardPath = {
  Dashboard: '',
  Wizard: 'wizard',
  WizardStep: 'wizard/:step',
  Wildcard: '**',
} as const;
export type WizardPath = (typeof WizardPath)[keyof typeof WizardPath];

export const WizardNav = {
  /** `/` — dashboard with 6 step tiles. */
  dashboard: (): readonly ['/'] => ['/'] as const,
  /** `/wizard` — stepper at default step (1). */
  wizard: (): readonly ['/wizard'] => ['/wizard'] as const,
  /** `/wizard/:step` — stepper opened on a specific step (1..6). */
  wizardStep: (step: BusinessWizardStepIndex): readonly ['/wizard', BusinessWizardStepIndex] =>
    ['/wizard', step] as const,
} as const;
