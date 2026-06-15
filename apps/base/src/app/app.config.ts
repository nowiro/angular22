import type { ApplicationConfig } from '@angular/core';

import { provideAppPlatform } from '@angular22/app-platform';

import { appRoutes } from './app.routes';
import { BASE_EN } from './base-translations.en';

/**
 * Zoneless by construction (no zone.js in polyfills — Angular 22 default).
 * `provideAppPlatform` wires the shared spine (global error handling, feature
 * flags from `config.json` before bootstrap, mock auth, router, i18n). A new
 * app adds only its own `routes` + EN translation map here.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideAppPlatform({ routes: appRoutes, translations: BASE_EN })],
};
