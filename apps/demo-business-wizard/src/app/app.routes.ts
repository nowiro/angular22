import type { Routes } from '@angular/router';

import { WizardPath } from '@angular22/business-wizard-data';
import { featureEnabledGuard } from '@angular22/shared-config';

/**
 * `/disabled`      → feature-flag notice (always reachable)
 * `/`              → dashboard (6 tiles) — gated by the `business-wizard` flag
 * `/wizard[/:step]`→ stepper — gated by the same flag
 * `**`             → redirect (dashboard when enabled, /disabled otherwise)
 */
export const appRoutes: Routes = [
  {
    path: 'disabled',
    loadComponent: () => import('@angular22/wizard-ui').then((m) => m.A22AppDisabledComponent),
  },
  {
    path: '',
    canMatch: [featureEnabledGuard('business-wizard', '/disabled')],
    children: [
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
    ],
  },
  {
    path: '**',
    redirectTo: 'disabled',
  },
];
