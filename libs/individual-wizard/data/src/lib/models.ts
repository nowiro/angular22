/**
 * Domain model of the individual wizard — the plain object held by the form's
 * `signal<IndividualData>()`.
 *
 * Signal Forms conventions used here:
 * - Conditionally-shown branches (`higherEducation`, `specialisation`,
 *   `thesis`, `employment.details`) are ALWAYS present in the model; the
 *   schema gates their validation with `applyWhen` / `hidden` and templates
 *   gate rendering with `@if`.
 * - Optional text fields are `''`, never `null`.
 */
import type { AddressValue, ConsentItemValue, CountryCode, LanguageValue, PhoneValue } from '@angular22/wizard-core';
import { emptyAddress, emptyPhone } from '@angular22/wizard-core';

export type Gender = 'female' | 'male' | 'other';

export type AddressPurpose = 'residence' | 'mailing' | 'invoice';

export type PhoneKind = 'mobile' | 'home' | 'work';

export type EducationLevel = 'primary' | 'secondary' | 'higher' | 'phd';

export type StudyField = 'IT' | 'medicine' | 'law' | 'humanities' | 'other';

export type ItBranch = 'frontend' | 'backend' | 'devops' | 'data' | 'security';

export type EmploymentStatus = 'employed' | 'self-employed' | 'student' | 'unemployed' | 'retired';

export type ContractType = 'uop' | 'b2b' | 'umowa-zlecenie' | 'umowa-o-dzielo';

export interface BasicDataValue {
  citizenship: CountryCode;
  firstName: string;
  middleName: string;
  lastName: string;
  pesel: string;
  nip: string;
  dateOfBirth: Date | null;
  gender: Gender;
}

export interface ContactValue {
  email: string;
  phones: PhoneValue[];
  addresses: AddressValue[];
}

export interface ContractValue {
  type: ContractType;
  since: Date | null;
  grossMonthly: number | null;
}

export interface EmploymentDetailsValue {
  companyName: string;
  position: string;
  contracts: ContractValue[];
}

export interface EmploymentValue {
  status: EmploymentStatus;
  details: EmploymentDetailsValue;
}

export interface ThesisValue {
  topic: string;
  keywords: string[];
}

export interface SpecialisationValue {
  branch: ItBranch;
  thesis: ThesisValue;
}

export interface HigherEducationValue {
  university: string;
  field: StudyField;
  specialisation: SpecialisationValue;
}

export interface SurveyValue {
  educationLevel: EducationLevel;
  higherEducation: HigherEducationValue;
  employment: EmploymentValue;
  languages: LanguageValue[];
}

export interface ConsentsValue {
  items: ConsentItemValue[];
}

export interface MetaValue {
  acceptTerms: boolean;
  submittedAt: Date | null;
}

export interface IndividualData {
  basicData: BasicDataValue;
  contact: ContactValue;
  survey: SurveyValue;
  consents: ConsentsValue;
  meta: MetaValue;
}

export function emptyContract(): ContractValue {
  return { type: 'uop', since: null, grossMonthly: null };
}

export function emptyEmploymentDetails(): EmploymentDetailsValue {
  return { companyName: '', position: '', contracts: [emptyContract()] };
}

export function emptyHigherEducation(): HigherEducationValue {
  return {
    university: '',
    field: 'other',
    specialisation: { branch: 'frontend', thesis: { topic: '', keywords: [''] } },
  };
}

export function initialIndividualData(): IndividualData {
  return {
    basicData: {
      citizenship: 'PL',
      firstName: '',
      middleName: '',
      lastName: '',
      pesel: '',
      nip: '',
      dateOfBirth: null,
      gender: 'female',
    },
    contact: {
      email: '',
      phones: [emptyPhone('mobile')],
      addresses: [emptyAddress('residence')],
    },
    survey: {
      educationLevel: 'secondary',
      higherEducation: emptyHigherEducation(),
      employment: { status: 'unemployed', details: emptyEmploymentDetails() },
      languages: [{ code: 'pl', level: 'C2' }],
    },
    consents: { items: [] },
    meta: { acceptTerms: false, submittedAt: null },
  };
}
