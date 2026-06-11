/**
 * Domain primitives shared by both wizards (individual + business).
 *
 * In the Signal Forms world the whole wizard is one plain object held in a
 * `signal<T>()`. Conventions that keep that model simple:
 *
 * - Optional text fields are `''` (empty string), never `null` — wrappers in
 *   `@angular22/ui-material` implement `FormValueControl<string>`.
 * - `purpose` / phone `type` stay `string` here; each wizard narrows the
 *   allowed values via its own `Option<...>[]` dictionary.
 */

export type CountryCode = 'PL' | 'DE' | 'FR' | 'GB' | 'UA' | 'CZ' | 'SK' | 'LT' | 'US' | 'OTHER';

export type StreetType = 'ul.' | 'al.' | 'pl.' | 'os.' | 'rondo' | 'skwer' | 'wybrzeże';

export type LanguageCode = 'pl' | 'en' | 'de' | 'fr' | 'ua' | 'es';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AddressValue {
  purpose: string;
  streetType: StreetType;
  street: string;
  houseNumber: string;
  flatNumber: string;
  postalCode: string;
  city: string;
  country: CountryCode;
}

export interface PhoneValue {
  type: string;
  number: string;
  /** Office extension — used by the business wizard, hidden by the individual one. */
  extension: string;
}

export interface LanguageValue {
  code: LanguageCode;
  level: LanguageLevel;
}

export interface ConsentItemValue {
  key: string;
  label: string;
  required: boolean;
  granted: boolean;
}

export function emptyAddress(purpose: string): AddressValue {
  return {
    purpose,
    streetType: 'ul.',
    street: '',
    houseNumber: '',
    flatNumber: '',
    postalCode: '',
    city: '',
    country: 'PL',
  };
}

export function emptyPhone(type: string): PhoneValue {
  return { type, number: '', extension: '' };
}

export function emptyLanguage(code: LanguageCode = 'en', level: LanguageLevel = 'B1'): LanguageValue {
  return { code, level };
}
