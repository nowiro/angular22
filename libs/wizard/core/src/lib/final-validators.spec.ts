import {
  APP_ID,
  ɵChangeDetectionScheduler as ChangeDetectionScheduler,
  DestroyRef,
  ɵEffectScheduler as EffectScheduler,
  Injector,
  signal,
} from '@angular/core';
import { form, schema } from '@angular/forms/signals';

import { describe, expect, it } from 'vitest';

import { applyFinalChecks } from './final-validators';
import type { AddressValue, ConsentItemValue } from './shared-models';
import { emptyAddress } from './shared-models';

/**
 * Minimal model mirroring the real wizard paths the shared final checks target
 * (`meta.acceptTerms`, `consents.items`, `contact.addresses`). Tests the
 * validator in isolation — no app schema — through a TestBed-free `form()`
 * (an explicit `Injector` keeps the repo's no-TestBed convention intact).
 */
interface FinalCheckModel {
  meta: { acceptTerms: boolean };
  consents: { items: ConsentItemValue[] };
  contact: { addresses: AddressValue[] };
}

const KIND = {
  terms: 'termsNotAccepted',
  consent: 'requiredConsentNotGranted',
  address: 'missingResidenceAddress',
} as const;

const finalCheckSchema = schema<FinalCheckModel>((path) => {
  applyFinalChecks({
    acceptTerms: { path: path.meta.acceptTerms, kind: KIND.terms, message: 'Musisz zaakceptować regulamin.' },
    consents: { path: path.consents.items, kind: KIND.consent, message: 'Ta zgoda jest wymagana.' },
    requiredAddress: {
      path: path.contact.addresses,
      purpose: 'residence',
      kind: KIND.address,
      message: 'Wymagany jest adres zamieszkania.',
    },
  });
});

function consent(key: string, required: boolean, granted: boolean): ConsentItemValue {
  return { key, label: key, required, granted };
}

// A minimal injector with just the tokens `form()` needs — keeps the suite
// TestBed-free (the repo's convention) while still building a genuine Signal
// Forms field tree. `form()` creates a field-management effect, so it needs a
// change-detection and an effect scheduler present; both are no-ops here because
// validation state is computed-derived and read synchronously — the effect never
// has to run, which avoids pulling in the full app environment (ApplicationRef,
// NgZone, PendingTasks, …).
function testInjector(): Injector {
  return Injector.create({
    providers: [
      { provide: APP_ID, useValue: 'final-checks-test' },
      { provide: DestroyRef, useValue: { onDestroy: () => () => undefined } },
      { provide: ChangeDetectionScheduler, useValue: { notify: () => undefined } },
      {
        provide: EffectScheduler,
        useValue: { add: () => undefined, remove: () => undefined, schedule: () => undefined },
      },
    ],
  });
}

function buildForm(model: FinalCheckModel) {
  return form(signal(model), finalCheckSchema, { injector: testInjector() });
}

function validModel(): FinalCheckModel {
  return {
    meta: { acceptTerms: true },
    consents: { items: [consent('gdpr', true, true), consent('marketing', false, false)] },
    contact: { addresses: [emptyAddress('residence')] },
  };
}

describe('applyFinalChecks', () => {
  it('passes when terms accepted, required consents granted and the required address present', () => {
    const f = buildForm(validModel());
    expect(f().valid()).toBe(true);
    expect(f().errorSummary()).toHaveLength(0);
  });

  it('flags unaccepted terms (group level)', () => {
    const model = validModel();
    model.meta.acceptTerms = false;
    const f = buildForm(model);
    expect(f().valid()).toBe(false);
    expect(f.meta.acceptTerms().errors()).toContainEqual(expect.objectContaining({ kind: KIND.terms }));
  });

  it('flags an ungranted required consent but ignores optional ones (array level)', () => {
    const model = validModel();
    model.consents.items = [consent('gdpr', true, false), consent('marketing', false, false)];
    const f = buildForm(model);
    expect(f().valid()).toBe(false);
    expect(f().errorSummary()).toContainEqual(expect.objectContaining({ kind: KIND.consent }));
  });

  it('flags a missing required-purpose address (array level)', () => {
    const model = validModel();
    model.contact.addresses = [emptyAddress('mailing')];
    const f = buildForm(model);
    expect(f().valid()).toBe(false);
    expect(f.contact.addresses().errors()).toContainEqual(expect.objectContaining({ kind: KIND.address }));
  });
});
