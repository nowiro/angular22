import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideAuth } from '@angular22/shared-auth';
import { provideFeatureFlags } from '@angular22/shared-config';
import { provideEnTranslations } from '@angular22/shared-i18n';
import { provideA22GlobalErrorHandler } from '@angular22/ui-feedback';

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
    provideA22GlobalErrorHandler(),
    provideFeatureFlags(),
    provideAuth({ mode: 'mock', initialRole: 'user' }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideEnTranslations(PORTAL_EN),
  ],
};
