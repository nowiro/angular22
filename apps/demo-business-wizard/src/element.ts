/**
 * Web-component entry — exposes the business wizard as
 * `<a22-business-wizard-element>` for in-portal embedding.
 * Build: `pnpm nx run demo-business-wizard:build-element`
 *   → `dist/elements/demo-business-wizard/main.js`.
 *
 * No router and no feature-flag fetch here — the PORTAL owns the URL and the
 * gating; the element stays dormant until the host page creates the tag.
 */
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import { BUSINESS_WIZARD_EN, BusinessWizardStore } from '@angular22/business-wizard-data';
import { provideEnTranslations } from '@angular22/shared-i18n';
import { WIZARD_FILL_PRESETS } from '@angular22/wizard-core';

import { BusinessWizardElementComponent } from './app/element.component';

const TAG = 'a22-business-wizard-element';

void (async () => {
  if (customElements.get(TAG) !== undefined) return;
  const appRef = await createApplication({
    providers: [
      provideEnTranslations(BUSINESS_WIZARD_EN),
      { provide: WIZARD_FILL_PRESETS, useExisting: BusinessWizardStore },
    ],
  });
  customElements.define(TAG, createCustomElement(BusinessWizardElementComponent, { injector: appRef.injector }));
})().catch((err: unknown) => {
  // eslint-disable-next-line no-console -- element bootstrap failures have no other sink
  console.error(err);
});
