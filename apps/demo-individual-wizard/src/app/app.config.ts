import type { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { INDIVIDUAL_WIZARD_EN, IndividualWizardStore } from '@angular22/individual-wizard-data';
import { provideEnTranslations } from '@angular22/shared-i18n';
import { WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

import { appRoutes } from './app.routes';

/**
 * Zoneless by construction (no zone.js in polyfills — Angular 22 default).
 * `WIZARD_FILL_PRESETS` wires the dev-fill panel to this wizard's store.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideEnTranslations(INDIVIDUAL_WIZARD_EN),
    { provide: WIZARD_FILL_PRESETS, useExisting: IndividualWizardStore },
  ],
};
