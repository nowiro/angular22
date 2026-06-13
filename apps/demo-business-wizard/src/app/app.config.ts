import type { ApplicationConfig } from '@angular/core';

import { provideAppPlatform } from '@angular22/app-platform';
import { BUSINESS_WIZARD_EN, BusinessWizardStore } from '@angular22/business-wizard-data';
import { WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

import { appRoutes } from './app.routes';

/**
 * Zoneless by construction. `provideAppPlatform` wires the shared spine;
 * `WIZARD_FILL_PRESETS` binds the dev-fill panel to this wizard's store.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAppPlatform({ routes: appRoutes, translations: BUSINESS_WIZARD_EN }),
    { provide: WIZARD_FILL_PRESETS, useExisting: BusinessWizardStore },
  ],
};
