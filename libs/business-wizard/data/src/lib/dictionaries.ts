/**
 * Business-wizard dictionaries. Shared ones (countries, street types,
 * languages) come from `@angular22/wizard-core`.
 */
import type { Option } from '@angular22/wizard-core';

import type {
  AddressPurpose,
  CustomerSegment,
  EmployeeRange,
  FiscalYearEnd,
  IndustryCode,
  LegalForm,
  PhoneKind,
  RepresentativeRole,
  RevenueRange,
} from './models';

export const LEGAL_FORMS: readonly Option<LegalForm>[] = [
  { value: 'sole-proprietorship', label: 'Jednoosobowa działalność gospodarcza (j.d.g.)' },
  { value: 'civil-partnership', label: 'Spółka cywilna (s.c.)' },
  { value: 'general-partnership', label: 'Spółka jawna (sp.j.)' },
  { value: 'limited-partnership', label: 'Spółka komandytowa (sp.k.)' },
  { value: 'limited-joint-stock', label: 'Spółka komandytowo-akcyjna (S.K.A.)' },
  { value: 'limited-liability', label: 'Sp. z o.o.' },
  { value: 'joint-stock', label: 'Spółka akcyjna (S.A.)' },
  { value: 'simple-joint-stock', label: 'Prosta spółka akcyjna (P.S.A.)' },
  { value: 'cooperative', label: 'Spółdzielnia' },
  { value: 'foundation', label: 'Fundacja' },
  { value: 'association', label: 'Stowarzyszenie' },
];

/** Legal forms that legally require a KRS number (everything except j.d.g. and s.c.). */
export const KRS_REQUIRED_FORMS: ReadonlySet<LegalForm> = new Set<LegalForm>([
  'general-partnership',
  'limited-partnership',
  'limited-joint-stock',
  'limited-liability',
  'joint-stock',
  'simple-joint-stock',
  'cooperative',
  'foundation',
  'association',
]);

export const ADDRESS_PURPOSES: readonly Option<AddressPurpose>[] = [
  { value: 'headquarters', label: 'Siedziba' },
  { value: 'branch', label: 'Oddział' },
  { value: 'invoice', label: 'Do faktur' },
  { value: 'correspondence', label: 'Korespondencyjny' },
];

export const PHONE_KINDS: readonly Option<PhoneKind>[] = [
  { value: 'office', label: 'Biurowy' },
  { value: 'mobile', label: 'Komórkowy' },
  { value: 'fax', label: 'Fax' },
];

export const INDUSTRIES: readonly Option<IndustryCode>[] = [
  { value: 'IT', label: 'Informacja i komunikacja' },
  { value: 'manufacturing', label: 'Przetwórstwo przemysłowe' },
  { value: 'construction', label: 'Budownictwo' },
  { value: 'retail', label: 'Handel detaliczny / hurtowy' },
  { value: 'transport', label: 'Transport i magazynowanie' },
  { value: 'hospitality', label: 'Zakwaterowanie i gastronomia' },
  { value: 'finance', label: 'Finanse i ubezpieczenia' },
  { value: 'real-estate', label: 'Obsługa nieruchomości' },
  { value: 'professional', label: 'Działalność profesjonalna' },
  { value: 'admin-support', label: 'Administracja i usługi wspierające' },
  { value: 'education', label: 'Edukacja' },
  { value: 'healthcare', label: 'Opieka zdrowotna' },
  { value: 'arts', label: 'Sztuka, rozrywka, rekreacja' },
  { value: 'other', label: 'Inna' },
];

export const REVENUE_RANGES: readonly Option<RevenueRange>[] = [
  { value: 'under-2m', label: 'do 2 mln PLN (mikro)' },
  { value: '2m-10m', label: '2–10 mln PLN (małe)' },
  { value: '10m-50m', label: '10–50 mln PLN (średnie)' },
  { value: '50m-200m', label: '50–200 mln PLN (duże)' },
  { value: 'over-200m', label: 'ponad 200 mln PLN' },
];

export const EMPLOYEE_RANGES: readonly Option<EmployeeRange>[] = [
  { value: '1-9', label: '1–9 (mikro)' },
  { value: '10-49', label: '10–49 (małe)' },
  { value: '50-249', label: '50–249 (średnie)' },
  { value: '250-999', label: '250–999 (duże)' },
  { value: '1000-plus', label: '1000+ (bardzo duże)' },
];

export const CUSTOMER_SEGMENTS: readonly Option<CustomerSegment>[] = [
  { value: 'b2b', label: 'B2B (biznes)' },
  { value: 'b2c', label: 'B2C (konsumenci)' },
  { value: 'b2b-b2c', label: 'B2B + B2C' },
  { value: 'b2g', label: 'B2G (sektor publiczny)' },
];

export const FISCAL_YEAR_ENDS: readonly Option<FiscalYearEnd>[] = [
  { value: 'december', label: '31 grudnia (kalendarzowy)' },
  { value: 'march', label: '31 marca' },
  { value: 'june', label: '30 czerwca' },
  { value: 'september', label: '30 września' },
  { value: 'other', label: 'Inny' },
];

export const REPRESENTATIVE_ROLES: readonly Option<RepresentativeRole>[] = [
  { value: 'ceo', label: 'Prezes zarządu (CEO)' },
  { value: 'cfo', label: 'Dyrektor finansowy (CFO)' },
  { value: 'cto', label: 'Dyrektor techniczny (CTO)' },
  { value: 'board-member', label: 'Członek zarządu' },
  { value: 'owner', label: 'Właściciel' },
  { value: 'authorised', label: 'Pełnomocnik' },
  { value: 'other', label: 'Inne' },
];
