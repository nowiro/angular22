/**
 * Route registry for the demo-individual-wizard app. The shared URL path table
 * (`WizardPath`) lives in `@angular22/wizard-core`; this file adds the app's
 * typed `WizardNav` command builders and step-index type on top of it.
 */

/** Stepper step indices — 1-indexed in the URL for user-friendliness. */
export type IndividualWizardStepIndex = 1 | 2 | 3 | 4 | 5;

export const INDIVIDUAL_WIZARD_STEP_COUNT = 5;

export const WizardNav = {
  /** `/` — dashboard with 5 step tiles. */
  dashboard: (): readonly ['/'] => ['/'] as const,
  /** `/wizard` — stepper at default step (1). */
  wizard: (): readonly ['/wizard'] => ['/wizard'] as const,
  /** `/wizard/:step` — stepper opened on a specific step (1..5). */
  wizardStep: (step: IndividualWizardStepIndex): readonly ['/wizard', IndividualWizardStepIndex] =>
    ['/wizard', step] as const,
} as const;
