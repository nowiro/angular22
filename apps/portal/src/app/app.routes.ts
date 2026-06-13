import type { Routes } from '@angular/router';

import { roleGuard } from '@angular22/shared-auth';
import { featureEnabledGuard } from '@angular22/shared-config';
import { A22ErrorKind, A22ErrorScreenComponent } from '@angular22/ui-feedback';

/**
 * Portal routing — the portal itself runs on :4200 and hosts the wizards on
 * its own Angular routes:
 *
 * `/`                → tile list (only enabled features show)
 * `/apps/individual` → individual wizard embedded as a web component
 * `/apps/business`   → business wizard embedded as a web component
 * `/error`           → shared "something went wrong" screen (global handler target)
 *
 * A feature disabled in `config.json` fails the `canMatch` guard; its
 * `apps/*` deep link then falls to the bare redirect below and lands on `/`.
 * Any genuinely unknown path falls through to the `**` 404 screen.
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
  { path: 'apps/individual', redirectTo: '' },
  {
    path: 'apps/business',
    canMatch: [featureEnabledGuard('business-wizard')],
    loadComponent: () => import('./embed/embed-host.component').then((m) => m.EmbedHostComponent),
    data: { featureId: 'business-wizard' },
  },
  { path: 'apps/business', redirectTo: '' },
  {
    path: 'admin',
    canMatch: [roleGuard('admin')],
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'forbidden',
    component: A22ErrorScreenComponent,
    data: { kind: A22ErrorKind.Forbidden },
  },
  {
    path: 'error',
    component: A22ErrorScreenComponent,
    data: { kind: A22ErrorKind.Unexpected },
  },
  {
    path: '**',
    component: A22ErrorScreenComponent,
    data: { kind: A22ErrorKind.NotFound },
  },
];
