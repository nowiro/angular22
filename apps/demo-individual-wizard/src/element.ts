/**
 * Web-component entry — exposes the individual wizard as
 * `<a22-individual-wizard-element>` for in-portal embedding.
 * Build: `pnpm nx run demo-individual-wizard:build-element`
 *   → `dist/elements/demo-individual-wizard/main.js`.
 *
 * No router and no feature-flag fetch here — the PORTAL owns the URL and the
 * gating; the element stays dormant until the host page creates the tag.
 */
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { INDIVIDUAL_WIZARD_EN, IndividualWizardStore } from '@angular22/individual-wizard-data';
import { provideEnTranslations } from '@angular22/shared-i18n';
import { WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

import { IndividualWizardElementComponent } from './app/element.component';

const TAG = 'a22-individual-wizard-element';

void (async () => {
  if (customElements.get(TAG) !== undefined) return;
  const appRef = await createApplication({
    providers: [
      provideEnTranslations(INDIVIDUAL_WIZARD_EN),
      { provide: WIZARD_FILL_PRESETS, useExisting: IndividualWizardStore },
    ],
  });
  customElements.define(TAG, createCustomElement(IndividualWizardElementComponent, { injector: appRef.injector }));
})().catch((err: unknown) => {
  // eslint-disable-next-line no-console -- element bootstrap failures have no other sink
  console.error(err);
});
