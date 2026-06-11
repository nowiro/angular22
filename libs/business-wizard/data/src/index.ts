/**
 * Public API for the business-wizard data-access library.
 *
 * @packageDocumentation
 */
export { applicableConsents, consentContextOf, CONSENTS_CATALOG } from './lib/consents-catalog';
export type { ConsentContext, ConsentDefinition } from './lib/consents-catalog';
export {
  ADDRESS_PURPOSES,
  CUSTOMER_SEGMENTS,
  EMPLOYEE_RANGES,
  FISCAL_YEAR_ENDS,
  INDUSTRIES,
  KRS_REQUIRED_FORMS,
  LEGAL_FORMS,
  PHONE_KINDS,
  REPRESENTATIVE_ROLES,
  REVENUE_RANGES,
} from './lib/dictionaries';
export { buildBusinessPreset } from './lib/fill-preset';
export {
  businessWizardSchema,
  ERROR_MISSING_HEADQUARTERS,
  ERROR_REQUIRED_CONSENT_NOT_GRANTED,
  ERROR_TERMS_NOT_ACCEPTED,
} from './lib/form-schema';
export { emptyRepresentative, initialBusinessData } from './lib/models';
export type {
  AddressPurpose,
  BusinessData,
  CompanyBasicsValue,
  ConsentsValue,
  ContactValue,
  CustomerSegment,
  EmployeeRange,
  FiscalYearEnd,
  IndustryCode,
  LegalForm,
  MetaValue,
  PhoneKind,
  ProfileValue,
  RepresentativeRole,
  RepresentativesValue,
  RepresentativeValue,
  RevenueRange,
} from './lib/models';
export { BUSINESS_WIZARD_STEP_COUNT, WizardNav, WizardPath } from './lib/routes';
export type { BusinessWizardStepIndex } from './lib/routes';
export { BusinessWizardStore } from './lib/wizard-store';
