import type { Routes } from '@angular/router';

import { featureEnabledGuard } from '@angular22/shared-config';

/**
 * Portal routing — the portal itself runs on :4200 and hosts the wizards on
 * its own Angular routes:
 *
 * `/`                → tile list (only enabled features show)
 * `/apps/individual` → individual wizard embedded as a web component
 * `/apps/business`   → business wizard embedded as a web component
 *
 * Disabled features don't match (`canMatch` guard) — deep links land on `/`.
 */
export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'apps/individual',
    canMatch: [featureEnabledGuard('individual-wizard')],
    loadComponent: () => import('./embed/embed-host.component').then((m) => m.EmbedHostComponent),
    data: { featureId: 'individual-wizard' },
  },
  {
    path: 'apps/business',
    canMatch: [featureEnabledGuard('business-wizard')],
    loadComponent: () => import('./embed/embed-host.component').then((m) => m.EmbedHostComponent),
    data: { featureId: 'business-wizard' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
