import type { Routes } from '@angular/router';

import { WizardPath } from '@angular22/individual-wizard-data';

/**
 * `/`              → dashboard (5 tiles, deep-link entry points)
 * `/wizard`        → stepper, defaults to step 1
 * `/wizard/:step`  → stepper opened on the requested 1-indexed step
 * `**`             → redirect to dashboard
 *
 * `withComponentInputBinding()` (app.config.ts) delivers `:step` straight
 * into `WizardShellComponent.step` as an input signal.
 */
export const appRoutes: Routes = [
  {
    path: WizardPath.Dashboard,
    pathMatch: 'full',
    loadComponent: () => import('@angular22/individual-wizard-feature').then((m) => m.WizardDashboardComponent),
  },
  {
    path: WizardPath.Wizard,
    loadComponent: () => import('@angular22/individual-wizard-feature').then((m) => m.WizardShellComponent),
  },
  {
    path: WizardPath.WizardStep,
    loadComponent: () => import('@angular22/individual-wizard-feature').then((m) => m.WizardShellComponent),
  },
  {
    path: WizardPath.Wildcard,
    redirectTo: WizardPath.Dashboard,
  },
];
