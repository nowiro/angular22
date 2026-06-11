/**
 * Domain model of the business wizard — the plain object held by the form's
 * `signal<BusinessData>()`. Same Signal Forms conventions as the individual
 * wizard: optional text fields are `''`, conditional rules live in the schema.
 */
import type { AddressValue, ConsentItemValue, LanguageValue, PhoneValue } from '@angular22/wizard-core';
import { emptyAddress, emptyPhone } from '@angular22/wizard-core';

export type LegalForm =
  | 'sole-proprietorship' // jednoosobowa działalność gospodarcza (j.d.g.)
  | 'civil-partnership' // spółka cywilna (s.c.)
  | 'general-partnership' // spółka jawna (sp.j.)
  | 'limited-partnership' // spółka komandytowa (sp.k.)
  | 'limited-joint-stock' // spółka komandytowo-akcyjna (S.K.A.)
  | 'limited-liability' // sp. z o.o.
  | 'joint-stock' // spółka akcyjna (S.A.)
  | 'simple-joint-stock' // prosta spółka akcyjna (P.S.A.)
  | 'cooperative' // spółdzielnia
  | 'foundation' // fundacja
  | 'association'; // stowarzyszenie

export type AddressPurpose = 'headquarters' | 'branch' | 'invoice' | 'correspondence';

export type PhoneKind = 'office' | 'mobile' | 'fax';

export type IndustryCode =
  | 'IT'
  | 'manufacturing'
  | 'construction'
  | 'retail'
  | 'transport'
  | 'hospitality'
  | 'finance'
  | 'real-estate'
  | 'professional'
  | 'admin-support'
  | 'education'
  | 'healthcare'
  | 'arts'
  | 'other';

export type RevenueRange = 'under-2m' | '2m-10m' | '10m-50m' | '50m-200m' | 'over-200m';

export type EmployeeRange = '1-9' | '10-49' | '50-249' | '250-999' | '1000-plus';

export type CustomerSegment = 'b2b' | 'b2c' | 'b2b-b2c' | 'b2g';

export type FiscalYearEnd = 'december' | 'march' | 'june' | 'september' | 'other';

export type RepresentativeRole = 'ceo' | 'cfo' | 'cto' | 'board-member' | 'owner' | 'authorised' | 'other';

export interface CompanyBasicsValue {
  legalName: string;
  tradeName: string;
  legalForm: LegalForm;
  nip: string;
  regon: string;
  krs: string;
  foundingYear: number | null;
  websiteUrl: string;
}

export interface ContactValue {
  email: string;
  phones: PhoneValue[];
  addresses: AddressValue[];
}

export interface ProfileValue {
  industry: IndustryCode;
  customerSegment: CustomerSegment;
  revenueRange: RevenueRange;
  employeeRange: EmployeeRange;
  fiscalYearEnd: FiscalYearEnd;
  hasExport: boolean;
  workingLanguages: LanguageValue[];
}

export interface RepresentativeValue {
  fullName: string;
  role: RepresentativeRole;
  email: string;
  phone: string;
  authorisedToSign: boolean;
}

export interface RepresentativesValue {
  items: RepresentativeValue[];
}

export interface ConsentsValue {
  items: ConsentItemValue[];
}

export interface MetaValue {
  acceptTerms: boolean;
  submittedAt: Date | null;
}

export interface BusinessData {
  companyBasics: CompanyBasicsValue;
  contact: ContactValue;
  profile: ProfileValue;
  representatives: RepresentativesValue;
  consents: ConsentsValue;
  meta: MetaValue;
}

export function emptyRepresentative(): RepresentativeValue {
  return { fullName: '', role: 'ceo', email: '', phone: '', authorisedToSign: true };
}

export function initialBusinessData(): BusinessData {
  return {
    companyBasics: {
      legalName: '',
      tradeName: '',
      legalForm: 'limited-liability',
      nip: '',
      regon: '',
      krs: '',
      foundingYear: new Date().getUTCFullYear(),
      websiteUrl: '',
    },
    contact: {
      email: '',
      phones: [emptyPhone('office')],
      addresses: [emptyAddress('headquarters')],
    },
    profile: {
      industry: 'IT',
      customerSegment: 'b2b',
      revenueRange: 'under-2m',
      employeeRange: '1-9',
      fiscalYearEnd: 'december',
      hasExport: false,
      workingLanguages: [
        { code: 'pl', level: 'C2' },
        { code: 'en', level: 'B2' },
      ],
    },
    representatives: { items: [emptyRepresentative()] },
    consents: { items: [] },
    meta: { acceptTerms: false, submittedAt: null },
  };
}
