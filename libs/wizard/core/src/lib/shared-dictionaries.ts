/**
 * Dictionaries shared verbatim by both wizards. Wizard-specific dictionaries
 * (legal forms, industries, education levels, …) live in each wizard's data lib.
 */
import type { Option } from './option';
import type { CountryCode, LanguageCode, LanguageLevel, StreetType } from './shared-models';

export const COUNTRIES: readonly Option<CountryCode>[] = [
  { value: 'PL', label: 'Polska' },
  { value: 'DE', label: 'Niemcy' },
  { value: 'FR', label: 'Francja' },
  { value: 'GB', label: 'Wielka Brytania' },
  { value: 'UA', label: 'Ukraina' },
  { value: 'CZ', label: 'Czechy' },
  { value: 'SK', label: 'Słowacja' },
  { value: 'LT', label: 'Litwa' },
  { value: 'US', label: 'Stany Zjednoczone' },
  { value: 'OTHER', label: 'Inne' },
];

/** Subset of {@link COUNTRIES} that triggers EU/GDPR-specific consents. */
export const EU_COUNTRIES: ReadonlySet<CountryCode> = new Set<CountryCode>(['PL', 'DE', 'FR', 'CZ', 'SK', 'LT']);

export const STREET_TYPES: readonly Option<StreetType>[] = [
  { value: 'ul.', label: 'ul. (ulica)' },
  { value: 'al.', label: 'al. (aleja)' },
  { value: 'pl.', label: 'pl. (plac)' },
  { value: 'os.', label: 'os. (osiedle)' },
  { value: 'rondo', label: 'rondo' },
  { value: 'skwer', label: 'skwer' },
  { value: 'wybrzeże', label: 'wybrzeże' },
];

export const LANGUAGE_CODES: readonly Option<LanguageCode>[] = [
  { value: 'pl', label: 'Polski' },
  { value: 'en', label: 'Angielski' },
  { value: 'de', label: 'Niemiecki' },
  { value: 'fr', label: 'Francuski' },
  { value: 'ua', label: 'Ukraiński' },
  { value: 'es', label: 'Hiszpański' },
];

export const LANGUAGE_LEVELS: readonly Option<LanguageLevel>[] = [
  { value: 'A1', label: 'A1 – początkujący' },
  { value: 'A2', label: 'A2 – podstawowy' },
  { value: 'B1', label: 'B1 – średni' },
  { value: 'B2', label: 'B2 – średnio-zaawansowany' },
  { value: 'C1', label: 'C1 – zaawansowany' },
  { value: 'C2', label: 'C2 – biegły' },
];
