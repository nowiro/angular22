/**
 * Shared wizard URL path table. Both wizard apps expose the same route shape
 * (dashboard → stepper → deep-linked step); each app keeps its own typed
 * `WizardNav` command builders and step-index type on top of these paths.
 */
export const WizardPath = {
  Dashboard: '',
  Wizard: 'wizard',
  WizardStep: 'wizard/:step',
  Wildcard: '**',
} as const;
export type WizardPath = (typeof WizardPath)[keyof typeof WizardPath];
