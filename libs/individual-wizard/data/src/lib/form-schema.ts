/* eslint-disable @typescript-eslint/unbound-method --
 * Destructuring `value` / `valueOf` from the Signal Forms `FieldContext` is
 * the documented schema idiom (they are context accessors, not `this`-bound
 * methods). The rule cannot tell and misfires on every validator below.
 */
/**
 * Signal Forms schema for the individual wizard — the single source of truth
 * for every validation rule. Conditional branches are gated with
 * `applyWhen` + `hidden` using the same predicates the templates use.
 */
import {
  applyEach,
  applyWhen,
  disabled,
  email,
  hidden,
  maxLength,
  min,
  pattern,
  required,
  schema,
  validate,
} from '@angular/forms/signals';

import { addressSchema, phoneSchema } from '@angular22/wizard-core';
import { adultAgeError, nipError, parsePesel, peselError } from '@angular22/wizard-validators';

import type { IndividualData } from './models';
import { showsEmploymentDetails, showsHigherEducation, showsSpecialisation, showsThesis } from './relevance';

// Latin letters + the Polish-specific Unicode supplement.
const PL_LETTERS = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż '-]+$/;

export const ERROR_MISSING_RESIDENCE = 'missingResidenceAddress';
export const ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED = 'nipRequiredForSelfEmployed';
export const ERROR_REQUIRED_CONSENT_NOT_GRANTED = 'requiredConsentNotGranted';
export const ERROR_TERMS_NOT_ACCEPTED = 'termsNotAccepted';
export const ERROR_PESEL_BIRTHDATE_MISMATCH = 'peselBirthDateMismatch';

export const individualWizardSchema = schema<IndividualData>((path) => {
  // ── Step 1: basic data ────────────────────────────────────────────────
  required(path.basicData.firstName, { message: 'Imię jest wymagane.' });
  pattern(path.basicData.firstName, PL_LETTERS, { message: 'Dozwolone są tylko litery.' });
  maxLength(path.basicData.firstName, 60, { message: 'Maksymalnie 60 znaków.' });

  validate(path.basicData.middleName, ({ value }) =>
    value() === '' || PL_LETTERS.test(value()) ? null : { kind: 'pattern', message: 'Dozwolone są tylko litery.' },
  );
  maxLength(path.basicData.middleName, 60, { message: 'Maksymalnie 60 znaków.' });

  required(path.basicData.lastName, { message: 'Nazwisko jest wymagane.' });
  pattern(path.basicData.lastName, PL_LETTERS, { message: 'Dozwolone są tylko litery.' });
  maxLength(path.basicData.lastName, 80, { message: 'Maksymalnie 80 znaków.' });

  // PESEL — required only for Polish citizenship; checksum always validated.
  required(path.basicData.pesel, {
    message: 'PESEL jest wymagany dla obywatelstwa polskiego.',
    when: ({ valueOf }) => valueOf(path.basicData.citizenship) === 'PL',
  });
  validate(path.basicData.pesel, ({ value }) => peselError(value()));

  validate(path.basicData.nip, ({ value }) => nipError(value()));
  // NIP becomes mandatory for the self-employed (cross-step rule).
  validate(path.basicData.nip, ({ value, valueOf }) =>
    valueOf(path.survey.employment.status) === 'self-employed' && value().trim() === ''
      ? { kind: ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED, message: 'NIP jest wymagany przy samozatrudnieniu.' }
      : null,
  );

  required(path.basicData.dateOfBirth, { message: 'Data urodzenia jest wymagana.' });
  validate(path.basicData.dateOfBirth, ({ value }) => adultAgeError(value()));
  // A valid PESEL is the source of truth for birth date and gender — the
  // store keeps them in sync, the schema locks the fields meanwhile.
  disabled(path.basicData.dateOfBirth, {
    when: ({ valueOf }) => parsePesel(valueOf(path.basicData.pesel)) !== null,
  });
  disabled(path.basicData.gender, {
    when: ({ valueOf }) => parsePesel(valueOf(path.basicData.pesel)) !== null,
  });
  // Guard: birth date must match a valid PESEL (the store auto-syncs it).
  validate(path.basicData.dateOfBirth, ({ value, valueOf }) => {
    const info = parsePesel(valueOf(path.basicData.pesel));
    const date = value();
    if (info === null || date === null) return null;
    const same =
      date.getUTCFullYear() === info.birthDate.getUTCFullYear() &&
      date.getUTCMonth() === info.birthDate.getUTCMonth() &&
      date.getUTCDate() === info.birthDate.getUTCDate();
    return same
      ? null
      : { kind: ERROR_PESEL_BIRTHDATE_MISMATCH, message: 'Data urodzenia nie zgadza się z numerem PESEL.' };
  });

  // ── Step 2: contact ───────────────────────────────────────────────────
  required(path.contact.email, { message: 'Adres e-mail jest wymagany.' });
  email(path.contact.email, { message: 'Nieprawidłowy adres e-mail.' });
  maxLength(path.contact.email, 254, { message: 'Maksymalnie 254 znaki.' });

  applyEach(path.contact.phones, phoneSchema);
  applyEach(path.contact.addresses, addressSchema);
  validate(path.contact.addresses, ({ value }) =>
    value().some((address) => address.purpose === 'residence')
      ? null
      : { kind: ERROR_MISSING_RESIDENCE, message: 'Wymagany jest co najmniej jeden adres zamieszkania.' },
  );

  // ── Step 3: survey (conditional branches) ─────────────────────────────
  hidden(path.survey.higherEducation, {
    when: ({ valueOf }) => !showsHigherEducation(valueOf(path.survey.educationLevel)),
  });
  applyWhen(
    path.survey.higherEducation,
    ({ valueOf }) => showsHigherEducation(valueOf(path.survey.educationLevel)),
    (higher) => {
      required(higher.university, { message: 'Nazwa uczelni jest wymagana.' });
      maxLength(higher.university, 120, { message: 'Maksymalnie 120 znaków.' });
      required(higher.field, { message: 'Kierunek jest wymagany.' });
    },
  );

  hidden(path.survey.higherEducation.specialisation, {
    when: ({ valueOf }) =>
      !showsSpecialisation(valueOf(path.survey.educationLevel), valueOf(path.survey.higherEducation.field)),
  });
  applyWhen(
    path.survey.higherEducation.specialisation,
    ({ valueOf }) =>
      showsSpecialisation(valueOf(path.survey.educationLevel), valueOf(path.survey.higherEducation.field)),
    (specialisation) => {
      required(specialisation.branch, { message: 'Wybierz branżę.' });
    },
  );

  hidden(path.survey.higherEducation.specialisation.thesis, {
    when: ({ valueOf }) =>
      !showsThesis(
        valueOf(path.survey.educationLevel),
        valueOf(path.survey.higherEducation.field),
        valueOf(path.survey.higherEducation.specialisation.branch),
      ),
  });
  applyWhen(
    path.survey.higherEducation.specialisation.thesis,
    ({ valueOf }) =>
      showsThesis(
        valueOf(path.survey.educationLevel),
        valueOf(path.survey.higherEducation.field),
        valueOf(path.survey.higherEducation.specialisation.branch),
      ),
    (thesis) => {
      required(thesis.topic, { message: 'Temat pracy jest wymagany.' });
      maxLength(thesis.topic, 200, { message: 'Maksymalnie 200 znaków.' });
      validate(thesis.keywords, ({ value }) =>
        value().length > 0 ? null : { kind: 'required', message: 'Dodaj co najmniej jedno słowo kluczowe.' },
      );
      applyEach(thesis.keywords, (keyword) => {
        required(keyword, { message: 'Słowo kluczowe nie może być puste.' });
        maxLength(keyword, 40, { message: 'Maksymalnie 40 znaków.' });
      });
    },
  );

  hidden(path.survey.employment.details, {
    when: ({ valueOf }) => !showsEmploymentDetails(valueOf(path.survey.employment.status)),
  });
  applyWhen(
    path.survey.employment.details,
    ({ valueOf }) => showsEmploymentDetails(valueOf(path.survey.employment.status)),
    (details) => {
      required(details.companyName, { message: 'Nazwa firmy jest wymagana.' });
      maxLength(details.companyName, 120, { message: 'Maksymalnie 120 znaków.' });
      required(details.position, { message: 'Stanowisko jest wymagane.' });
      maxLength(details.position, 80, { message: 'Maksymalnie 80 znaków.' });
      applyEach(details.contracts, (contract) => {
        required(contract.since, { message: 'Data rozpoczęcia jest wymagana.' });
        required(contract.grossMonthly, { message: 'Kwota brutto jest wymagana.' });
        min(contract.grossMonthly, 0, { message: 'Kwota nie może być ujemna.' });
      });
    },
  );

  validate(path.survey.languages, ({ value }) =>
    value().length > 0 ? null : { kind: 'required', message: 'Dodaj co najmniej jeden język.' },
  );

  // ── Step 4: consents ──────────────────────────────────────────────────
  applyEach(path.consents.items, (item) => {
    validate(item.granted, ({ value, valueOf }) =>
      valueOf(item.required) && !value()
        ? { kind: ERROR_REQUIRED_CONSENT_NOT_GRANTED, message: 'Ta zgoda jest wymagana.' }
        : null,
    );
  });

  // ── Step 5: summary / meta ────────────────────────────────────────────
  validate(path.meta.acceptTerms, ({ value }) =>
    value() ? null : { kind: ERROR_TERMS_NOT_ACCEPTED, message: 'Musisz zaakceptować regulamin.' },
  );
});
