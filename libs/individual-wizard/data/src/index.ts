/**
 * Public API for the individual-wizard data-access library.
 *
 * @packageDocumentation
 */
export { applicableConsents, consentDescription } from './lib/consents-catalog';
export {
  ADDRESS_PURPOSES,
  CONTRACT_TYPES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  GENDERS,
  IT_BRANCHES,
  PHONE_KINDS,
  STUDY_FIELDS,
  THESIS_BRANCHES,
} from './lib/dictionaries';
export { buildIndividualPreset } from './lib/fill-preset';
export { INDIVIDUAL_WIZARD_EN } from './lib/i18n/individual-translations.en';
export {
  ERROR_MISSING_RESIDENCE,
  ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED,
  ERROR_PESEL_BIRTHDATE_MISMATCH,
  ERROR_REQUIRED_CONSENT_NOT_GRANTED,
  ERROR_TERMS_NOT_ACCEPTED,
  individualWizardSchema,
} from './lib/form-schema';
export { emptyContract, initialIndividualData } from './lib/models';
export type {
  AddressPurpose,
  BasicDataValue,
  ConsentsValue,
  ContactValue,
  ContractType,
  ContractValue,
  EducationLevel,
  EmploymentDetailsValue,
  EmploymentStatus,
  EmploymentValue,
  Gender,
  HigherEducationValue,
  IndividualData,
  ItBranch,
  MetaValue,
  PhoneKind,
  SpecialisationValue,
  StudyField,
  SurveyValue,
  ThesisValue,
} from './lib/models';
export { INDIVIDUAL_WIZARD_STEP_COUNT, WizardNav, WizardPath } from './lib/routes';
export type { IndividualWizardStepIndex } from './lib/routes';
export { IndividualWizardStore } from './lib/wizard-store';
