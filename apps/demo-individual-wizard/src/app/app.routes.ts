import type { Routes } from '@angular/router';

import { WizardPath } from '@angular22/individual-wizard-data';
import { featureEnabledGuard } from '@angular22/shared-config';

/**
 * `/disabled`      → feature-flag notice (always reachable)
 * `/`              → dashboard (5 tiles) — gated by the `individual-wizard` flag
 * `/wizard[/:step]`→ stepper — gated by the same flag
 * `**`             → redirect (dashboard when enabled, /disabled otherwise)
 *
 * The whole app is wrapped in a `canMatch` feature guard: when the flag in
 * `config.json` is off, the routes don't match and the user lands on
 * `/disabled` — access is blocked without removing the app from the hosting.
 */
export const appRoutes: Routes = [
  {
    path: 'disabled',
    loadComponent: () => import('@angular22/wizard-ui').then((m) => m.A22AppDisabledComponent),
  },
  {
    path: '',
    canMatch: [featureEnabledGuard('individual-wizard', '/disabled')],
    children: [
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
    ],
  },
  {
    path: '**',
    redirectTo: 'disabled',
  },
];
