import type { Routes } from '@angular/router';

import { WizardPath } from '@angular22/business-wizard-data';

/**
 * `/`              → dashboard (6 tiles, deep-link entry points)
 * `/wizard`        → stepper, defaults to step 1
 * `/wizard/:step`  → stepper opened on the requested 1-indexed step
 * `**`             → redirect to dashboard
 */
export const appRoutes: Routes = [
  {
    path: WizardPath.Dashboard,
    pathMatch: 'full',
    loadComponent: () => import('@angular22/business-wizard-feature').then((m) => m.WizardDashboardComponent),
  },
  {
    path: WizardPath.Wizard,
    loadComponent: () => import('@angular22/business-wizard-feature').then((m) => m.WizardShellComponent),
  },
  {
    path: WizardPath.WizardStep,
    loadComponent: () => import('@angular22/business-wizard-feature').then((m) => m.WizardShellComponent),
  },
  {
    path: WizardPath.Wildcard,
    redirectTo: WizardPath.Dashboard,
  },
];
