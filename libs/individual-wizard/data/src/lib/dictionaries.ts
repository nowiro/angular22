/**
 * Wizard-specific dictionaries. Shared ones (countries, street types,
 * languages) come from `@angular22/wizard-core`.
 */
import type { Option } from '@angular22/wizard-core';

import type {
  AddressPurpose,
  ContractType,
  EducationLevel,
  EmploymentStatus,
  Gender,
  ItBranch,
  PhoneKind,
  StudyField,
} from './models';

export const GENDERS: readonly Option<Gender>[] = [
  { value: 'female', label: 'Kobieta' },
  { value: 'male', label: 'Mężczyzna' },
  { value: 'other', label: 'Inna / nie chcę podawać' },
];

export const ADDRESS_PURPOSES: readonly Option<AddressPurpose>[] = [
  { value: 'residence', label: 'Zamieszkania' },
  { value: 'mailing', label: 'Korespondencyjny' },
  { value: 'invoice', label: 'Do faktur' },
];

export const PHONE_KINDS: readonly Option<PhoneKind>[] = [
  { value: 'mobile', label: 'Komórkowy' },
  { value: 'home', label: 'Domowy' },
  { value: 'work', label: 'Służbowy' },
];

export const EDUCATION_LEVELS: readonly Option<EducationLevel>[] = [
  { value: 'primary', label: 'Podstawowe' },
  { value: 'secondary', label: 'Średnie' },
  { value: 'higher', label: 'Wyższe' },
  { value: 'phd', label: 'Doktorat' },
];

export const STUDY_FIELDS: readonly Option<StudyField>[] = [
  { value: 'IT', label: 'Informatyka' },
  { value: 'medicine', label: 'Medycyna' },
  { value: 'law', label: 'Prawo' },
  { value: 'humanities', label: 'Nauki humanistyczne' },
  { value: 'other', label: 'Inne' },
];

export const IT_BRANCHES: readonly Option<ItBranch>[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps / Cloud' },
  { value: 'data', label: 'Data / ML' },
  { value: 'security', label: 'Cybersecurity' },
];

/** Branches that unlock the thesis sub-form when education level is "phd". */
export const THESIS_BRANCHES: ReadonlySet<ItBranch> = new Set<ItBranch>(['data', 'security']);

export const EMPLOYMENT_STATUSES: readonly Option<EmploymentStatus>[] = [
  { value: 'employed', label: 'Zatrudniony/a' },
  { value: 'self-employed', label: 'Samozatrudnienie / B2B' },
  { value: 'student', label: 'Student/ka' },
  { value: 'unemployed', label: 'Bez zatrudnienia' },
  { value: 'retired', label: 'Emerytura / renta' },
];

export const CONTRACT_TYPES: readonly Option<ContractType>[] = [
  { value: 'uop', label: 'Umowa o pracę' },
  { value: 'b2b', label: 'Kontrakt B2B' },
  { value: 'umowa-zlecenie', label: 'Umowa zlecenie' },
  { value: 'umowa-o-dzielo', label: 'Umowa o dzieło' },
];
