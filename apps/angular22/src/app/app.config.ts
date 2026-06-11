import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideEnTranslations } from '@angular22/shared-i18n';

import { LANDING_EN } from './landing-translations.en';

/** Zoneless by construction (no zone.js in polyfills — Angular 22 default). */
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideEnTranslations(LANDING_EN)],
};
