import type { ApplicationConfig } from '@angular/core';

import { provideAppPlatform } from '@angular22/app-platform';

import { appRoutes } from './app.routes';
import { PORTAL_EN } from './portal-translations.en';

/**
 * Zoneless by construction (no zone.js in polyfills — Angular 22 default).
 * `provideAppPlatform` wires the shared spine (global error handling, feature
 * flags loaded from `config.json` before bootstrap, mock auth, router, i18n);
 * the portal adds no deltas.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideAppPlatform({ routes: appRoutes, translations: PORTAL_EN })],
};
