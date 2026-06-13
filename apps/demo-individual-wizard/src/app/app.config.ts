import type { ApplicationConfig } from '@angular/core';

import { provideAppPlatform } from '@angular22/app-platform';
import { INDIVIDUAL_WIZARD_EN, IndividualWizardStore } from '@angular22/individual-wizard-data';
import { WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

import { appRoutes } from './app.routes';

/**
 * Zoneless by construction. `provideAppPlatform` wires the shared spine;
 * `WIZARD_FILL_PRESETS` binds the dev-fill panel to this wizard's store.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAppPlatform({ routes: appRoutes, translations: INDIVIDUAL_WIZARD_EN }),
    { provide: WIZARD_FILL_PRESETS, useExisting: IndividualWizardStore },
  ],
};
