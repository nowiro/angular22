/* eslint-disable @typescript-eslint/unbound-method --
 * Destructuring `value` / `valueOf` from the Signal Forms `FieldContext` is
 * the documented schema idiom (they are context accessors, not `this`-bound
 * methods). The rule cannot tell and misfires on every validator below.
 */
/**
 * Signal Forms schema for the business wizard. Conditional rule: KRS is
 * required only for legal forms registered in the National Court Register.
 */
import { applyEach, email, max, maxLength, min, pattern, required, schema, validate } from '@angular/forms/signals';

import { addressSchema, phoneSchema } from '@angular22/wizard-core';
import { krsError, nipError, plPhoneError, regonError, websiteUrlError } from '@angular22/wizard-validators';

import { KRS_REQUIRED_FORMS } from './dictionaries';
import type { BusinessData } from './models';

const COMPANY_NAME_PATTERN = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż '"&,.\-()/]+$/;
const PERSON_NAME_PATTERN = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż '-]+$/;

export const ERROR_MISSING_HEADQUARTERS = 'missingHeadquartersAddress';
export const ERROR_REQUIRED_CONSENT_NOT_GRANTED = 'requiredConsentNotGranted';
export const ERROR_TERMS_NOT_ACCEPTED = 'termsNotAccepted';

export const businessWizardSchema = schema<BusinessData>((path) => {
  // ── Step 1: company basics ────────────────────────────────────────────
  required(path.companyBasics.legalName, { message: 'Nazwa firmy jest wymagana.' });
  pattern(path.companyBasics.legalName, COMPANY_NAME_PATTERN, { message: 'Niedozwolone znaki w nazwie.' });
  maxLength(path.companyBasics.legalName, 160, { message: 'Maksymalnie 160 znaków.' });

  validate(path.companyBasics.tradeName, ({ value }) =>
    value() === '' || COMPANY_NAME_PATTERN.test(value())
      ? null
      : { kind: 'pattern', message: 'Niedozwolone znaki w nazwie.' },
  );
  maxLength(path.companyBasics.tradeName, 120, { message: 'Maksymalnie 120 znaków.' });

  required(path.companyBasics.nip, { message: 'NIP jest wymagany.' });
  validate(path.companyBasics.nip, ({ value }) => nipError(value()));

  required(path.companyBasics.regon, { message: 'REGON jest wymagany.' });
  validate(path.companyBasics.regon, ({ value }) => regonError(value()));

  // KRS — required only for court-registered legal forms.
  required(path.companyBasics.krs, {
    message: 'KRS jest wymagany dla tej formy prawnej.',
    when: ({ valueOf }) => KRS_REQUIRED_FORMS.has(valueOf(path.companyBasics.legalForm)),
  });
  validate(path.companyBasics.krs, ({ value }) => krsError(value()));

  required(path.companyBasics.foundingYear, { message: 'Rok założenia jest wymagany.' });
  min(path.companyBasics.foundingYear, 1800, { message: 'Rok nie może być wcześniejszy niż 1800.' });
  max(path.companyBasics.foundingYear, new Date().getUTCFullYear(), {
    message: 'Rok nie może być z przyszłości.',
  });

  validate(path.companyBasics.websiteUrl, ({ value }) => websiteUrlError(value()));

  // ── Step 2: contact ───────────────────────────────────────────────────
  required(path.contact.email, { message: 'Adres e-mail jest wymagany.' });
  email(path.contact.email, { message: 'Nieprawidłowy adres e-mail.' });
  maxLength(path.contact.email, 254, { message: 'Maksymalnie 254 znaki.' });

  applyEach(path.contact.phones, phoneSchema);
  applyEach(path.contact.addresses, addressSchema);
  validate(path.contact.addresses, ({ value }) =>
    value().some((address) => address.purpose === 'headquarters')
      ? null
      : { kind: ERROR_MISSING_HEADQUARTERS, message: 'Wymagany jest co najmniej jeden adres siedziby.' },
  );

  // ── Step 3: profile ───────────────────────────────────────────────────
  required(path.profile.industry, { message: 'Branża jest wymagana.' });
  required(path.profile.customerSegment, { message: 'Segment klientów jest wymagany.' });
  required(path.profile.revenueRange, { message: 'Przedział przychodów jest wymagany.' });
  required(path.profile.employeeRange, { message: 'Liczba pracowników jest wymagana.' });
  required(path.profile.fiscalYearEnd, { message: 'Koniec roku obrotowego jest wymagany.' });
  validate(path.profile.workingLanguages, ({ value }) =>
    value().length > 0 ? null : { kind: 'required', message: 'Dodaj co najmniej jeden język roboczy.' },
  );

  // ── Step 4: representatives ───────────────────────────────────────────
  validate(path.representatives.items, ({ value }) =>
    value().length > 0 ? null : { kind: 'required', message: 'Dodaj co najmniej jednego reprezentanta.' },
  );
  applyEach(path.representatives.items, (representative) => {
    required(representative.fullName, { message: 'Imię i nazwisko jest wymagane.' });
    pattern(representative.fullName, PERSON_NAME_PATTERN, { message: 'Dozwolone są tylko litery.' });
    maxLength(representative.fullName, 120, { message: 'Maksymalnie 120 znaków.' });
    required(representative.role, { message: 'Rola jest wymagana.' });
    required(representative.email, { message: 'E-mail jest wymagany.' });
    email(representative.email, { message: 'Nieprawidłowy adres e-mail.' });
    required(representative.phone, { message: 'Telefon jest wymagany.' });
    validate(representative.phone, ({ value }) => plPhoneError(value()));
  });

  // ── Step 5: consents ──────────────────────────────────────────────────
  applyEach(path.consents.items, (item) => {
    validate(item.granted, ({ value, valueOf }) =>
      valueOf(item.required) && !value()
        ? { kind: ERROR_REQUIRED_CONSENT_NOT_GRANTED, message: 'Ta zgoda jest wymagana.' }
        : null,
    );
  });

  // ── Step 6: summary / meta ────────────────────────────────────────────
  validate(path.meta.acceptTerms, ({ value }) =>
    value() ? null : { kind: ERROR_TERMS_NOT_ACCEPTED, message: 'Musisz zaakceptować regulamin.' },
  );
});
