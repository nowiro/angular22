/**
 * Catalog of all available consents and the rules that decide whether each
 * one applies to a given respondent. `appliesWhen` is a pure predicate over a
 * model snapshot, so the catalog stays unit-testable and Angular-free.
 */
import type { ConsentItemValue, CountryCode } from '@angular22/wizard-core';
import { EU_COUNTRIES } from '@angular22/wizard-core';

import type { EmploymentStatus, IndividualData } from './models';
import { relevanceOf, showsEmploymentDetails, showsHigherEducation } from './relevance';

export interface ConsentContext {
  readonly citizenship: CountryCode;
  readonly residenceCountry: CountryCode | null;
  readonly educationLevel: IndividualData['survey']['educationLevel'];
  readonly employmentStatus: EmploymentStatus;
  readonly hasThesis: boolean;
}

export interface ConsentDefinition {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  /** Required consents block submit when not granted (e.g. GDPR base). */
  readonly required: boolean;
  readonly appliesWhen: (ctx: ConsentContext) => boolean;
}

const inEu = (country: CountryCode | null): boolean => country !== null && EU_COUNTRIES.has(country);

export const CONSENTS_CATALOG: readonly ConsentDefinition[] = [
  {
    key: 'gdpr-base',
    label: 'Zgoda na przetwarzanie danych osobowych (RODO/GDPR)',
    description:
      'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji wniosku zgodnie z art. 6 ust. 1 lit. a) RODO.',
    required: true,
    appliesWhen: (ctx) => inEu(ctx.citizenship) || inEu(ctx.residenceCountry),
  },
  {
    key: 'gdpr-extended-pl',
    label: 'Rozszerzona zgoda RODO (ustawa o ochronie danych osobowych – PL)',
    description:
      'Wyrażam zgodę na przetwarzanie danych w zakresie wymaganym polską ustawą o ochronie danych osobowych z dnia 10 maja 2018 r.',
    required: false,
    appliesWhen: (ctx) => ctx.citizenship === 'PL' || ctx.residenceCountry === 'PL',
  },
  {
    key: 'ccpa-base',
    label: 'CCPA – California Consumer Privacy Act',
    description: 'Confirm awareness of CCPA rights as a US resident.',
    required: true,
    appliesWhen: (ctx) => ctx.citizenship === 'US' || ctx.residenceCountry === 'US',
  },
  {
    key: 'marketing-email',
    label: 'Marketing – e-mail',
    description: 'Zgoda na otrzymywanie informacji handlowych pocztą elektroniczną.',
    required: false,
    appliesWhen: () => true,
  },
  {
    key: 'marketing-sms',
    label: 'Marketing – SMS',
    description: 'Zgoda na otrzymywanie informacji handlowych w formie wiadomości SMS.',
    required: false,
    appliesWhen: () => true,
  },
  {
    key: 'profiling',
    label: 'Profilowanie i automatyczne decyzje',
    description: 'Zgoda na zautomatyzowane podejmowanie decyzji w oparciu o profilowanie (art. 22 RODO).',
    required: false,
    appliesWhen: (ctx) => inEu(ctx.citizenship) || inEu(ctx.residenceCountry),
  },
  {
    key: 'employer-verification',
    label: 'Weryfikacja zatrudnienia u pracodawcy',
    description: 'Zgoda na kontakt z pracodawcą w celu potwierdzenia faktu zatrudnienia oraz okresu współpracy.',
    required: false,
    appliesWhen: (ctx) => showsEmploymentDetails(ctx.employmentStatus),
  },
  {
    key: 'academic-records',
    label: 'Weryfikacja danych w uczelni',
    description: 'Zgoda na weryfikację danych w uczelni wymienionej w ankiecie.',
    required: false,
    appliesWhen: (ctx) => showsHigherEducation(ctx.educationLevel),
  },
  {
    key: 'krd-bik',
    label: 'Weryfikacja w biurach informacji kredytowej (KRD/BIK)',
    description: 'Zgoda na sprawdzenie historii kredytowej w bazach KRD oraz BIK.',
    required: false,
    appliesWhen: (ctx) => ctx.citizenship === 'PL',
  },
  {
    key: 'thesis-publication',
    label: 'Publikacja danych pracy doktorskiej',
    description: 'Zgoda na publikację tytułu pracy doktorskiej oraz powiązanych słów kluczowych w katalogu publicznym.',
    required: false,
    appliesWhen: (ctx) => ctx.hasThesis,
  },
];

export function consentContextOf(data: IndividualData): ConsentContext {
  const residence = data.contact.addresses.find((a) => a.purpose === 'residence');
  return {
    citizenship: data.basicData.citizenship,
    residenceCountry: residence?.country ?? null,
    educationLevel: data.survey.educationLevel,
    employmentStatus: data.survey.employment.status,
    hasThesis: relevanceOf(data).thesis,
  };
}

/**
 * Returns the consent items applicable for the model snapshot, preserving
 * `granted` flags of already-present items by key.
 */
export function applicableConsents(data: IndividualData): ConsentItemValue[] {
  const ctx = consentContextOf(data);
  const previous = new Map(data.consents.items.map((item) => [item.key, item.granted]));
  return CONSENTS_CATALOG.filter((c) => c.appliesWhen(ctx)).map(({ key, label, required }) => ({
    key,
    label,
    required,
    granted: previous.get(key) ?? false,
  }));
}

/** Resolves the long description for a consent key (used by the consents step). */
export function consentDescription(key: string): string {
  return CONSENTS_CATALOG.find((c) => c.key === key)?.description ?? '';
}
