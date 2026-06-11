/**
 * Public API for the wizard-core library — shared wizard primitives:
 * option/model types, step status, the dev-fill contract, and Polish fake
 * data generators used by both wizards' fill presets.
 *
 * @packageDocumentation
 */
export { WIZARD_FILL_PRESETS } from './lib/fill-presets';
export type { FillMode, WizardFillPresets } from './lib/fill-presets';
export { isLocalhost } from './lib/localhost';
export { optionLabel } from './lib/option';
export type { Option } from './lib/option';
export {
  generateValidKrs,
  generateValidNip,
  generateValidPesel,
  generateValidRegon,
  pick,
  pickInt,
  randomAdultBirthDate,
  randomCity,
  randomCompany,
  randomEmail,
  randomEmployedSince,
  randomFirstName,
  randomFlatNumber,
  randomFoundingYear,
  randomHouseNumber,
  randomKeyword,
  randomLastName,
  randomMonthlyGross,
  randomPhoneNumber,
  randomPosition,
  randomPostalCode,
  randomStreet,
  randomThesisTopic,
  randomUniversity,
  randomWebsiteUrl,
} from './lib/polish-fake-data';
export { COUNTRIES, EU_COUNTRIES, LANGUAGE_CODES, LANGUAGE_LEVELS, STREET_TYPES } from './lib/shared-dictionaries';
export { addressSchema, phoneSchema } from './lib/shared-schemas';
export { emptyAddress, emptyLanguage, emptyPhone } from './lib/shared-models';
export type {
  AddressValue,
  ConsentItemValue,
  CountryCode,
  LanguageCode,
  LanguageLevel,
  LanguageValue,
  PhoneValue,
  StreetType,
} from './lib/shared-models';
export { stepStatus } from './lib/step-status';
export type { StepStateLike, WizardStepStatus } from './lib/step-status';
export type { WizardTileDescriptor } from './lib/tile';
