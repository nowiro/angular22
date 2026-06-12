import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideFeatureFlags } from '@angular22/shared-config';
import { provideEnTranslations } from '@angular22/shared-i18n';

import { appRoutes } from './app.routes';
import { PORTAL_EN } from './portal-translations.en';

/**
 * Zoneless by construction (no zone.js in polyfills — Angular 22 default).
 * `provideFeatureFlags()` loads `config.json` before bootstrap, so tiles and
 * route guards see the environment's flags from the first render.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFeatureFlags(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideEnTranslations(PORTAL_EN),
  ],
};
