/**
 * Public API for the wizard-validators library — pure Polish-identifier
 * validation helpers plus Signal-Forms-friendly error factories.
 *
 * @packageDocumentation
 */
export { ageInYears, isAdult } from './lib/age';
export {
  adultAgeError,
  ERROR_KRS,
  ERROR_NIP,
  ERROR_PESEL,
  ERROR_PHONE,
  ERROR_POSTAL,
  ERROR_REGON,
  ERROR_UNDERAGE,
  ERROR_URL,
  krsError,
  nipError,
  peselError,
  plPhoneError,
  plPostalCodeError,
  regonError,
  websiteUrlError,
} from './lib/field-errors';
export type { FieldError } from './lib/field-errors';
export { isValidKrs } from './lib/krs';
export {
  defineValidator,
  registerValidationLabel,
  registerValidationLabels,
  validationLabel,
  validationLabels,
} from './lib/label-registry';
export type { ValidationLabel } from './lib/label-registry';
export { isValidNip, normaliseNip } from './lib/nip';
export { isValidPeselChecksum, parsePesel } from './lib/pesel';
export type { PeselInfo } from './lib/pesel';
export { isValidPlPhone } from './lib/phone';
export { autoFormatPostalCode, isValidPlPostalCode } from './lib/postal-code';
export { isValidRegon } from './lib/regon';
export { isValidWebsiteUrl } from './lib/url';
