/**
 * B2B consent catalog — driven by industry vertical, customer segment and the
 * export flag. Financial / healthcare verticals carry the heaviest
 * disclosure load.
 */
import type { ConsentItemValue } from '@angular22/wizard-core';

import type { BusinessData, CustomerSegment, IndustryCode } from './models';

export interface ConsentDefinition {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
}

export interface ConsentContext {
  readonly industry: IndustryCode;
  readonly customerSegment: CustomerSegment;
  readonly hasExport: boolean;
}

const TERMS: ConsentDefinition = {
  key: 'terms-of-service',
  label: 'Akceptuję regulamin platformy.',
  required: true,
};

const RODO_PROCESSING: ConsentDefinition = {
  key: 'gdpr-processing',
  label: 'Wyrażam zgodę na przetwarzanie danych firmy zgodnie z RODO w celu świadczenia usługi.',
  required: true,
};

const PSD2_DISCLOSURE: ConsentDefinition = {
  key: 'psd2-disclosure',
  label: 'Przyjmuję do wiadomości obowiązki informacyjne wynikające z dyrektywy PSD2 (sektor finansowy).',
  required: true,
};

const HEALTHCARE_DPA: ConsentDefinition = {
  key: 'healthcare-dpa',
  label: 'Potwierdzam umowę powierzenia przetwarzania danych medycznych zgodnie z art. 28 RODO.',
  required: true,
};

const B2C_PRIVACY_NOTICE: ConsentDefinition = {
  key: 'b2c-privacy-notice',
  label: 'Zobowiązuję się przekazywać konsumentom (B2C) klauzulę informacyjną RODO przed pierwszym kontaktem.',
  required: true,
};

const EXPORT_SANCTIONS: ConsentDefinition = {
  key: 'export-sanctions',
  label: 'Oświadczam, że firma nie znajduje się na liście sankcji eksportowych UE / OFAC.',
  required: true,
};

const MARKETING_B2B: ConsentDefinition = {
  key: 'marketing-b2b',
  label: 'Wyrażam zgodę na otrzymywanie ofert handlowych B2B drogą elektroniczną.',
  required: false,
};

const PARTNER_SHARING: ConsentDefinition = {
  key: 'partner-sharing',
  label: 'Wyrażam zgodę na przekazanie danych zaufanym partnerom integracyjnym w celach handlowych.',
  required: false,
};

const NEWSLETTER: ConsentDefinition = {
  key: 'newsletter',
  label: 'Chcę otrzymywać newsletter z aktualizacjami platformy.',
  required: false,
};

export const CONSENTS_CATALOG: readonly ConsentDefinition[] = Object.freeze([
  TERMS,
  RODO_PROCESSING,
  PSD2_DISCLOSURE,
  HEALTHCARE_DPA,
  B2C_PRIVACY_NOTICE,
  EXPORT_SANCTIONS,
  MARKETING_B2B,
  PARTNER_SHARING,
  NEWSLETTER,
]);

export function consentContextOf(data: BusinessData): ConsentContext {
  return {
    industry: data.profile.industry,
    customerSegment: data.profile.customerSegment,
    hasExport: data.profile.hasExport,
  };
}

/**
 * Returns the consent items applicable for the model snapshot, preserving
 * `granted` flags of already-present items by key.
 *
 * 1. Always — terms + GDPR processing (required).
 * 2. Industry — finance → PSD2; healthcare → healthcare DPA.
 * 3. Segment — `b2c` / `b2b-b2c` → B2C privacy notice.
 * 4. Export — sanctions oath.
 * 5. Always optional — marketing, partner sharing, newsletter.
 */
export function applicableConsents(data: BusinessData): ConsentItemValue[] {
  const ctx = consentContextOf(data);
  const seeds: ConsentDefinition[] = [TERMS, RODO_PROCESSING];

  if (ctx.industry === 'finance') seeds.push(PSD2_DISCLOSURE);
  if (ctx.industry === 'healthcare') seeds.push(HEALTHCARE_DPA);
  if (ctx.customerSegment === 'b2c' || ctx.customerSegment === 'b2b-b2c') seeds.push(B2C_PRIVACY_NOTICE);
  if (ctx.hasExport) seeds.push(EXPORT_SANCTIONS);

  seeds.push(MARKETING_B2B, PARTNER_SHARING, NEWSLETTER);

  const previous = new Map(data.consents.items.map((item) => [item.key, item.granted]));
  return seeds.map(({ key, label, required }) => ({
    key,
    label,
    required,
    granted: previous.get(key) ?? false,
  }));
}
