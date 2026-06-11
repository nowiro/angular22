/**
 * English translations for the business wizard (Polish source string = key).
 * Registered in the app via `provideEnTranslations(BUSINESS_WIZARD_EN)`.
 */
export const BUSINESS_WIZARD_EN: Readonly<Record<string, string>> = {
  // ── Chrome / intro ──────────────────────────────────────────────────────
  'Kreator danych firmy': 'Company data wizard',
  'Rejestracja firmy w 6 krokach': 'Register a company in 6 steps',
  'Pokaz Signal Forms: model w signal(), walidacja w schema(), warunkowy KRS i zgody zależne od profilu, komponenty Material przez wrappery FormValueControl.':
    'Signal Forms showcase: model in signal(), validation in schema(), conditional KRS and profile-driven consents, Material components through FormValueControl wrappers.',
  'Pulpit kreatora firmy': 'Company wizard dashboard',

  // ── Dashboard tiles / step labels ───────────────────────────────────────
  'Dane firmy': 'Company details',
  'Nazwa, forma prawna, NIP/REGON/KRS': 'Name, legal form, NIP/REGON/KRS',
  Profil: 'Profile',
  'Branża, segment, skala, języki': 'Industry, segment, scale, languages',
  Reprezentanci: 'Representatives',
  'Osoby uprawnione do reprezentacji': 'Persons authorised to represent',
  'RODO, PSD2, sankcje, marketing': 'GDPR, PSD2, sanctions, marketing',

  // ── Step 1: basics ──────────────────────────────────────────────────────
  'Nazwa prawna': 'Legal name',
  'Nazwa handlowa (opcjonalnie)': 'Trade name (optional)',
  'Nazwa handlowa': 'Trade name',
  'Forma prawna': 'Legal form',
  'Rok założenia': 'Founding year',
  '10 cyfr': '10 digits',
  '9 lub 14 cyfr': '9 or 14 digits',
  'Wymagany dla tej formy prawnej': 'Required for this legal form',
  'Niewymagany dla tej formy prawnej': 'Not required for this legal form',
  'Strona WWW (opcjonalnie)': 'Website (optional)',
  'Strona WWW': 'Website',
  'Jednoosobowa działalność gospodarcza (j.d.g.)': 'Sole proprietorship',
  'Spółka cywilna (s.c.)': 'Civil partnership',
  'Spółka jawna (sp.j.)': 'General partnership',
  'Spółka komandytowa (sp.k.)': 'Limited partnership',
  'Spółka komandytowo-akcyjna (S.K.A.)': 'Limited joint-stock partnership',
  'Sp. z o.o.': 'Limited liability company (LLC)',
  'Spółka akcyjna (S.A.)': 'Joint-stock company',
  'Prosta spółka akcyjna (P.S.A.)': 'Simple joint-stock company',
  Spółdzielnia: 'Cooperative',
  Fundacja: 'Foundation',
  Stowarzyszenie: 'Association',

  // ── Step 2: contact ─────────────────────────────────────────────────────
  'Adres e-mail firmy': 'Company e-mail address',
  Siedziba: 'Headquarters',
  Oddział: 'Branch',
  'Do faktur': 'Invoicing',
  Korespondencyjny: 'Mailing',
  Biurowy: 'Office',
  Komórkowy: 'Mobile',
  Fax: 'Fax',

  // ── Step 3: profile ─────────────────────────────────────────────────────
  'Profil działalności': 'Business profile',
  Branża: 'Industry',
  'Finanse i opieka zdrowotna dodają obowiązkowe zgody': 'Finance and healthcare add mandatory consents',
  'Segment klientów': 'Customer segment',
  'Przychody roczne': 'Annual revenue',
  Zatrudnienie: 'Employees',
  'Koniec roku obrotowego': 'Fiscal year end',
  'Firma prowadzi eksport poza UE (dodaje oświadczenie sankcyjne)':
    'The company exports outside the EU (adds a sanctions declaration)',
  'Języki robocze': 'Working languages',
  'Informacja i komunikacja': 'Information & communication',
  'Przetwórstwo przemysłowe': 'Manufacturing',
  Budownictwo: 'Construction',
  'Handel detaliczny / hurtowy': 'Retail / wholesale trade',
  'Transport i magazynowanie': 'Transport & storage',
  'Zakwaterowanie i gastronomia': 'Accommodation & food service',
  'Finanse i ubezpieczenia': 'Finance & insurance',
  'Obsługa nieruchomości': 'Real estate',
  'Działalność profesjonalna': 'Professional services',
  'Administracja i usługi wspierające': 'Administrative & support services',
  Edukacja: 'Education',
  'Opieka zdrowotna': 'Healthcare',
  'Sztuka, rozrywka, rekreacja': 'Arts, entertainment & recreation',
  Inna: 'Other',
  'do 2 mln PLN (mikro)': 'up to PLN 2M (micro)',
  '2–10 mln PLN (małe)': 'PLN 2–10M (small)',
  '10–50 mln PLN (średnie)': 'PLN 10–50M (medium)',
  '50–200 mln PLN (duże)': 'PLN 50–200M (large)',
  'ponad 200 mln PLN': 'over PLN 200M',
  '1–9 (mikro)': '1–9 (micro)',
  '10–49 (małe)': '10–49 (small)',
  '50–249 (średnie)': '50–249 (medium)',
  '250–999 (duże)': '250–999 (large)',
  '1000+ (bardzo duże)': '1000+ (very large)',
  'B2B (biznes)': 'B2B (business)',
  'B2C (konsumenci)': 'B2C (consumers)',
  'B2G (sektor publiczny)': 'B2G (public sector)',
  '31 grudnia (kalendarzowy)': 'December 31 (calendar year)',
  '31 marca': 'March 31',
  '30 czerwca': 'June 30',
  '30 września': 'September 30',

  // ── Step 4: representatives ─────────────────────────────────────────────
  'Osoby uprawnione do reprezentowania firmy. Wymagany co najmniej jeden reprezentant.':
    'Persons authorised to represent the company. At least one representative is required.',
  Reprezentant: 'Representative',
  'Imię i nazwisko': 'Full name',
  Rola: 'Role',
  Telefon: 'Phone',
  'Uprawniony/a do podpisywania umów': 'Authorised to sign contracts',
  'Prezes zarządu (CEO)': 'Chief Executive Officer (CEO)',
  'Dyrektor finansowy (CFO)': 'Chief Financial Officer (CFO)',
  'Dyrektor techniczny (CTO)': 'Chief Technology Officer (CTO)',
  'Członek zarządu': 'Board member',
  Właściciel: 'Owner',
  Pełnomocnik: 'Authorised representative',
  Inne: 'Other',
  ', podpisuje umowy': ', signs contracts',

  // ── Step 5: consents ────────────────────────────────────────────────────
  'Zgody i oświadczenia': 'Consents & declarations',
  'Zestaw zgód zależy od profilu: finanse dodają PSD2, opieka zdrowotna umowę powierzenia, segment B2C klauzulę konsumencką, a eksport oświadczenie sankcyjne.':
    'The consent set depends on the profile: finance adds PSD2, healthcare a data processing agreement, the B2C segment a consumer notice, and exports a sanctions declaration.',
  'Akceptuję regulamin platformy.': 'I accept the platform terms of service.',
  'Wyrażam zgodę na przetwarzanie danych firmy zgodnie z RODO w celu świadczenia usługi.':
    'I consent to the processing of company data under GDPR for the purpose of providing the service.',
  'Przyjmuję do wiadomości obowiązki informacyjne wynikające z dyrektywy PSD2 (sektor finansowy).':
    'I acknowledge the disclosure obligations under the PSD2 directive (financial sector).',
  'Potwierdzam umowę powierzenia przetwarzania danych medycznych zgodnie z art. 28 RODO.':
    'I confirm a medical data processing agreement under Art. 28 GDPR.',
  'Zobowiązuję się przekazywać konsumentom (B2C) klauzulę informacyjną RODO przed pierwszym kontaktem.':
    'I undertake to provide consumers (B2C) with the GDPR information notice before first contact.',
  'Oświadczam, że firma nie znajduje się na liście sankcji eksportowych UE / OFAC.':
    'I declare that the company is not on the EU / OFAC export sanctions lists.',
  'Wyrażam zgodę na otrzymywanie ofert handlowych B2B drogą elektroniczną.':
    'I consent to receiving B2B commercial offers electronically.',
  'Wyrażam zgodę na przekazanie danych zaufanym partnerom integracyjnym w celach handlowych.':
    'I consent to sharing data with trusted integration partners for commercial purposes.',
  'Chcę otrzymywać newsletter z aktualizacjami platformy.': 'I want to receive the platform updates newsletter.',

  // ── Step 6: summary ─────────────────────────────────────────────────────
  'Skala działalności': 'Business scale',
  'Eksport poza UE': 'Exports outside the EU',
  tak: 'yes',
  nie: 'no',

  // ── Schema validation messages ──────────────────────────────────────────
  'Nazwa firmy jest wymagana.': 'Company name is required.',
  'Niedozwolone znaki w nazwie.': 'Disallowed characters in the name.',
  'Maksymalnie 160 znaków.': 'Max 160 characters.',
  'Maksymalnie 120 znaków.': 'Max 120 characters.',
  'NIP jest wymagany.': 'NIP is required.',
  'REGON jest wymagany.': 'REGON is required.',
  'KRS jest wymagany dla tej formy prawnej.': 'KRS is required for this legal form.',
  'Rok założenia jest wymagany.': 'Founding year is required.',
  'Rok nie może być wcześniejszy niż 1800.': 'Year cannot be earlier than 1800.',
  'Rok nie może być z przyszłości.': 'Year cannot be in the future.',
  'Adres e-mail jest wymagany.': 'E-mail address is required.',
  'Nieprawidłowy adres e-mail.': 'Invalid e-mail address.',
  'Maksymalnie 254 znaki.': 'Max 254 characters.',
  'Wymagany jest co najmniej jeden adres siedziby.': 'At least one headquarters address is required.',
  'Branża jest wymagana.': 'Industry is required.',
  'Segment klientów jest wymagany.': 'Customer segment is required.',
  'Przedział przychodów jest wymagany.': 'Revenue range is required.',
  'Liczba pracowników jest wymagana.': 'Employee range is required.',
  'Koniec roku obrotowego jest wymagany.': 'Fiscal year end is required.',
  'Dodaj co najmniej jeden język roboczy.': 'Add at least one working language.',
  'Dodaj co najmniej jednego reprezentanta.': 'Add at least one representative.',
  'Imię i nazwisko jest wymagane.': 'Full name is required.',
  'Dozwolone są tylko litery.': 'Only letters are allowed.',
  'Rola jest wymagana.': 'Role is required.',
  'E-mail jest wymagany.': 'E-mail is required.',
  'Telefon jest wymagany.': 'Phone is required.',
  'Ta zgoda jest wymagana.': 'This consent is required.',
  'Musisz zaakceptować regulamin.': 'You must accept the terms.',
};
