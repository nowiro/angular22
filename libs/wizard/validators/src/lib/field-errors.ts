/**
 * Signal-Forms-friendly error factories. Each returns the standard
 * `{ kind, message }` error object (or `null` when valid), so schemas plug
 * them straight into `validate()`:
 *
 * ```ts
 * validate(path.basicData.pesel, ({ value }) => peselError(value()));
 * ```
 *
 * Labels are sourced from the `{key, label}` dictionary via `defineValidator`
 * (see `label-registry.ts`) — the same mechanism custom validators use. Empty
 * values pass; combine with `required()` when the field is mandatory. This
 * module stays framework-free on purpose (no `@angular/forms` import).
 */
import { isAdult } from './age';
import { isValidKrs } from './krs';
import { defineValidator } from './label-registry';
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

export const peselError = defineValidator(
  { key: ERROR_PESEL, label: 'Nieprawidłowy numer PESEL.' },
  (value: string) => value === '' || isValidPeselChecksum(value),
);

export const nipError = defineValidator(
  { key: ERROR_NIP, label: 'Nieprawidłowy numer NIP.' },
  (value: string) => value === '' || isValidNip(value),
);

export const regonError = defineValidator(
  { key: ERROR_REGON, label: 'Nieprawidłowy numer REGON.' },
  (value: string) => value === '' || isValidRegon(value),
);

export const krsError = defineValidator(
  { key: ERROR_KRS, label: 'Numer KRS musi mieć dokładnie 10 cyfr.' },
  (value: string) => value === '' || isValidKrs(value),
);

export const plPhoneError = defineValidator(
  { key: ERROR_PHONE, label: 'Podaj numer w formacie +48 NNN NNN NNN lub 9 cyfr.' },
  (value: string) => value === '' || isValidPlPhone(value),
);

export const plPostalCodeError = defineValidator(
  { key: ERROR_POSTAL, label: 'Wprowadź kod pocztowy w formacie NN-NNN.' },
  (value: string) => value === '' || isValidPlPostalCode(value),
);

export const websiteUrlError = defineValidator(
  { key: ERROR_URL, label: 'Podaj poprawny adres http(s)://…' },
  (value: string) => isValidWebsiteUrl(value),
);

export const adultAgeError = defineValidator<Date | null>(
  { key: ERROR_UNDERAGE, label: 'Wymagane ukończone 18 lat.' },
  (value) => value === null || isAdult(value),
);
