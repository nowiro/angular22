/**
 * English translations for the individual wizard (Polish source string = key).
 * Registered in the app via `provideEnTranslations(INDIVIDUAL_WIZARD_EN)`.
 */
export const INDIVIDUAL_WIZARD_EN: Readonly<Record<string, string>> = {
  // ── Chrome / intro ──────────────────────────────────────────────────────
  'Kreator danych osobowych': 'Personal data wizard',
  'Wprowadzenie danych w 5 krokach': 'Enter your data in 5 steps',
  'Pokaz Signal Forms: model w signal(), walidacja w schema(), warunkowe sekcje przez applyWhen, komponenty Material przez wrappery FormValueControl.':
    'Signal Forms showcase: model in signal(), validation in schema(), conditional sections via applyWhen, Material components through FormValueControl wrappers.',
  'Pulpit kreatora': 'Wizard dashboard',

  // ── Dashboard tiles / step labels ───────────────────────────────────────
  'Dane podstawowe': 'Basic data',
  'Imię, nazwisko, PESEL, data urodzenia': 'Name, PESEL, date of birth',
  Ankieta: 'Survey',
  'Wykształcenie, zatrudnienie, języki': 'Education, employment, languages',
  'Zgody i sprzeciwy': 'Consents & objections',
  'RODO, marketing, weryfikacje': 'GDPR, marketing, verifications',

  // ── Step 1: basic data ──────────────────────────────────────────────────
  Obywatelstwo: 'Citizenship',
  Imię: 'First name',
  'Drugie imię (opcjonalnie)': 'Middle name (optional)',
  Nazwisko: 'Last name',
  '11 cyfr — uzupełni datę urodzenia i płeć': '11 digits — fills date of birth and gender',
  'NIP (opcjonalnie)': 'NIP (optional)',
  'Wymagany przy samozatrudnieniu': 'Required for self-employment',
  'Data urodzenia': 'Date of birth',
  Płeć: 'Gender',
  'Uzupełnione z PESEL — data urodzenia i płeć są zablokowane.':
    'Derived from PESEL — date of birth and gender are locked.',
  Kobieta: 'Female',
  Mężczyzna: 'Male',
  'Inna / nie chcę podawać': 'Other / prefer not to say',

  // ── Step 2: contact ─────────────────────────────────────────────────────
  'Adres e-mail': 'E-mail address',
  Zamieszkania: 'Residence',
  Korespondencyjny: 'Mailing',
  'Do faktur': 'Invoicing',
  Komórkowy: 'Mobile',
  Domowy: 'Home',
  Służbowy: 'Work',

  // ── Step 3: survey ──────────────────────────────────────────────────────
  Wykształcenie: 'Education',
  'Wykształcenie wyższe': 'Higher education',
  Uczelnia: 'University',
  Kierunek: 'Field of study',
  'Specjalizacja IT': 'IT specialisation',
  Branża: 'Branch',
  'Praca doktorska': 'Doctoral thesis',
  'Temat pracy': 'Thesis topic',
  'Słowa kluczowe (1–10):': 'Keywords (1–10):',
  'Słowo kluczowe': 'Keyword',
  Zatrudnienie: 'Employment',
  'Status zatrudnienia': 'Employment status',
  'Nazwa firmy': 'Company name',
  Stanowisko: 'Position',
  Umowy: 'Contracts',
  'Rodzaj umowy': 'Contract type',
  'Od kiedy': 'Since',
  'Brutto / mies.': 'Gross / month',
  Języki: 'Languages',
  Podstawowe: 'Primary',
  Średnie: 'Secondary',
  Wyższe: 'Higher',
  Doktorat: 'PhD',
  Informatyka: 'Computer science',
  Medycyna: 'Medicine',
  Prawo: 'Law',
  'Nauki humanistyczne': 'Humanities',
  'Zatrudniony/a': 'Employed',
  'Samozatrudnienie / B2B': 'Self-employed / B2B',
  'Student/ka': 'Student',
  'Bez zatrudnienia': 'Unemployed',
  'Emerytura / renta': 'Retired',
  'Umowa o pracę': 'Employment contract',
  'Kontrakt B2B': 'B2B contract',
  'Umowa zlecenie': 'Mandate contract',
  'Umowa o dzieło': 'Specific-task contract',

  // ── Step 4: consents (catalog labels + descriptions) ────────────────────
  'Lista zgód dopasowuje się do Twoich odpowiedzi — obywatelstwo, kraj zamieszkania, wykształcenie i status zatrudnienia zmieniają zestaw pozycji.':
    'The consent list adapts to your answers — citizenship, country of residence, education and employment status change the set of items.',
  'Zgoda na przetwarzanie danych osobowych (RODO/GDPR)': 'Consent to personal data processing (GDPR)',
  'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji wniosku zgodnie z art. 6 ust. 1 lit. a) RODO.':
    'I consent to the processing of my personal data for this application under Art. 6(1)(a) GDPR.',
  'Rozszerzona zgoda RODO (ustawa o ochronie danych osobowych – PL)':
    'Extended GDPR consent (Polish Personal Data Protection Act)',
  'Wyrażam zgodę na przetwarzanie danych w zakresie wymaganym polską ustawą o ochronie danych osobowych z dnia 10 maja 2018 r.':
    'I consent to data processing as required by the Polish Personal Data Protection Act of 10 May 2018.',
  'CCPA – California Consumer Privacy Act': 'CCPA – California Consumer Privacy Act',
  'Confirm awareness of CCPA rights as a US resident.': 'Confirm awareness of CCPA rights as a US resident.',
  'Marketing – e-mail': 'Marketing – e-mail',
  'Zgoda na otrzymywanie informacji handlowych pocztą elektroniczną.':
    'Consent to receive commercial information by e-mail.',
  'Marketing – SMS': 'Marketing – SMS',
  'Zgoda na otrzymywanie informacji handlowych w formie wiadomości SMS.':
    'Consent to receive commercial information via SMS.',
  'Profilowanie i automatyczne decyzje': 'Profiling and automated decisions',
  'Zgoda na zautomatyzowane podejmowanie decyzji w oparciu o profilowanie (art. 22 RODO).':
    'Consent to automated decision-making based on profiling (Art. 22 GDPR).',
  'Weryfikacja zatrudnienia u pracodawcy': 'Employment verification with the employer',
  'Zgoda na kontakt z pracodawcą w celu potwierdzenia faktu zatrudnienia oraz okresu współpracy.':
    'Consent to contact the employer to confirm employment and its duration.',
  'Weryfikacja danych w uczelni': 'Verification of data with the university',
  'Zgoda na weryfikację danych w uczelni wymienionej w ankiecie.':
    'Consent to verify data with the university listed in the survey.',
  'Weryfikacja w biurach informacji kredytowej': 'Credit bureau verification',
  'Zgoda na sprawdzenie historii kredytowej w bazach informacji kredytowej.':
    'Consent to check credit history in credit-information registers.',
  'Publikacja danych pracy doktorskiej': 'Publication of doctoral thesis data',
  'Zgoda na publikację tytułu pracy doktorskiej oraz powiązanych słów kluczowych w katalogu publicznym.':
    'Consent to publish the doctoral thesis title and related keywords in a public catalogue.',

  // ── Step 5: summary ─────────────────────────────────────────────────────
  'Imię i nazwisko': 'Full name',

  // ── Schema validation messages ──────────────────────────────────────────
  'Imię jest wymagane.': 'First name is required.',
  'Dozwolone są tylko litery.': 'Only letters are allowed.',
  'Maksymalnie 60 znaków.': 'Max 60 characters.',
  'Nazwisko jest wymagane.': 'Last name is required.',
  'PESEL jest wymagany dla obywatelstwa polskiego.': 'PESEL is required for Polish citizenship.',
  'NIP jest wymagany przy samozatrudnieniu.': 'NIP is required for self-employment.',
  'Data urodzenia jest wymagana.': 'Date of birth is required.',
  'Data urodzenia nie zgadza się z numerem PESEL.': 'Date of birth does not match the PESEL number.',
  'Adres e-mail jest wymagany.': 'E-mail address is required.',
  'Maksymalnie 254 znaki.': 'Max 254 characters.',
  'Wymagany jest co najmniej jeden adres zamieszkania.': 'At least one residence address is required.',
  'Nazwa uczelni jest wymagana.': 'University name is required.',
  'Maksymalnie 120 znaków.': 'Max 120 characters.',
  'Kierunek jest wymagany.': 'Field of study is required.',
  'Wybierz branżę.': 'Select a branch.',
  'Temat pracy jest wymagany.': 'Thesis topic is required.',
  'Maksymalnie 200 znaków.': 'Max 200 characters.',
  'Dodaj co najmniej jedno słowo kluczowe.': 'Add at least one keyword.',
  'Słowo kluczowe nie może być puste.': 'Keyword cannot be empty.',
  'Maksymalnie 40 znaków.': 'Max 40 characters.',
  'Nazwa firmy jest wymagana.': 'Company name is required.',
  'Stanowisko jest wymagane.': 'Position is required.',
  'Data rozpoczęcia jest wymagana.': 'Start date is required.',
  'Kwota brutto jest wymagana.': 'Gross amount is required.',
  'Kwota nie może być ujemna.': 'Amount cannot be negative.',
  'Dodaj co najmniej jeden język.': 'Add at least one language.',
  'Ta zgoda jest wymagana.': 'This consent is required.',
  'Musisz zaakceptować regulamin.': 'You must accept the terms.',
};
