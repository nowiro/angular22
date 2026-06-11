/**
 * Signal-Forms-friendly error factories. Each returns the standard
 * `{ kind, message }` error object (or `null` when valid), so schemas plug
 * them straight into `validate()`:
 *
 * ```ts
 * validate(path.basicData.pesel, ({ value }) => peselError(value()));
 * ```
 *
 * Empty values pass — combine with `required()` when the field is mandatory.
 * This module stays framework-free on purpose (no `@angular/forms` import).
 */
import { isAdult } from './age';
import { isValidKrs } from './krs';
import { isValidNip } from './nip';
import { isValidPeselChecksum } from './pesel';
import { isValidPlPhone } from './phone';
import { isValidPlPostalCode } from './postal-code';
import { isValidRegon } from './regon';
import { isValidWebsiteUrl } from './url';

export interface FieldError {
  readonly kind: string;
  readonly message: string;
}

export const ERROR_PESEL = 'pesel';
export const ERROR_NIP = 'nip';
export const ERROR_REGON = 'regon';
export const ERROR_KRS = 'krs';
export const ERROR_PHONE = 'phone';
export const ERROR_POSTAL = 'postalCode';
export const ERROR_URL = 'url';
export const ERROR_UNDERAGE = 'underage';

export function peselError(value: string): FieldError | null {
  if (value === '') return null;
  return isValidPeselChecksum(value) ? null : { kind: ERROR_PESEL, message: 'Nieprawidłowy numer PESEL.' };
}

export function nipError(value: string): FieldError | null {
  if (value === '') return null;
  return isValidNip(value) ? null : { kind: ERROR_NIP, message: 'Nieprawidłowy numer NIP.' };
}

export function regonError(value: string): FieldError | null {
  if (value === '') return null;
  return isValidRegon(value) ? null : { kind: ERROR_REGON, message: 'Nieprawidłowy numer REGON.' };
}

export function krsError(value: string): FieldError | null {
  if (value === '') return null;
  return isValidKrs(value) ? null : { kind: ERROR_KRS, message: 'Numer KRS musi mieć dokładnie 10 cyfr.' };
}

export function plPhoneError(value: string): FieldError | null {
  if (value === '') return null;
  return isValidPlPhone(value)
    ? null
    : { kind: ERROR_PHONE, message: 'Podaj numer w formacie +48 NNN NNN NNN lub 9 cyfr.' };
}

export function plPostalCodeError(value: string): FieldError | null {
  if (value === '') return null;
  return isValidPlPostalCode(value)
    ? null
    : { kind: ERROR_POSTAL, message: 'Wprowadź kod pocztowy w formacie NN-NNN.' };
}

export function websiteUrlError(value: string): FieldError | null {
  return isValidWebsiteUrl(value) ? null : { kind: ERROR_URL, message: 'Podaj poprawny adres http(s)://…' };
}

export function adultAgeError(value: Date | null): FieldError | null {
  if (value === null) return null;
  return isAdult(value) ? null : { kind: ERROR_UNDERAGE, message: 'Wymagane ukończone 18 lat.' };
}
