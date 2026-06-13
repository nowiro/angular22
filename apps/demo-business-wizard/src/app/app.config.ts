import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { BUSINESS_WIZARD_EN, BusinessWizardStore } from '@angular22/business-wizard-data';
import { provideFeatureFlags } from '@angular22/shared-config';
import { provideEnTranslations } from '@angular22/shared-i18n';
import { provideA22GlobalErrorHandler } from '@angular22/ui-feedback';
import { WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

import { appRoutes } from './app.routes';

/**
 * Zoneless by construction (no zone.js in polyfills — Angular 22 default).
 * `WIZARD_FILL_PRESETS` wires the dev-fill panel to this wizard's store.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideA22GlobalErrorHandler(),
    provideFeatureFlags(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideEnTranslations(BUSINESS_WIZARD_EN),
    { provide: WIZARD_FILL_PRESETS, useExisting: BusinessWizardStore },
  ],
};
