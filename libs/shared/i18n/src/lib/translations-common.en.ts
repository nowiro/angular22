/**
 * English translations for strings shared across every app (Polish source
 * string = key). App/feature-specific strings live in per-app maps registered
 * via `provideEnTranslations()`.
 */
export const COMMON_EN: Readonly<Record<string, string>> = {
  // ── Navigation / common buttons ─────────────────────────────────────────
  Dalej: 'Next',
  Wstecz: 'Back',
  Pulpit: 'Dashboard',
  'Otwórz kreator': 'Open wizard',
  'Otwórz demo': 'Open demo',
  'Wyślij wniosek': 'Submit application',
  'Dodaj telefon': 'Add phone',
  'Dodaj adres': 'Add address',
  'Dodaj język': 'Add language',
  'Dodaj umowę': 'Add contract',
  'Dodaj słowo kluczowe': 'Add keyword',
  'Dodaj reprezentanta': 'Add representative',
  'Usuń telefon': 'Remove phone',
  'Usuń adres': 'Remove address',
  'Usuń język': 'Remove language',
  'Usuń umowę': 'Remove contract',
  'Usuń słowo kluczowe': 'Remove keyword',
  'Usuń reprezentanta': 'Remove representative',

  // ── Dashboard statuses ──────────────────────────────────────────────────
  Ukończone: 'Done',
  'W trakcie': 'In progress',
  'Nie rozpoczęte': 'Not started',

  // ── Auth / roles ────────────────────────────────────────────────────────
  'brak roli': 'no role',

  // ── Shared form labels (wizard-ui) ──────────────────────────────────────
  Przeznaczenie: 'Purpose',
  Typ: 'Type',
  'Nazwa ulicy': 'Street name',
  Numer: 'No.',
  'm.': 'Apt.',
  'Kod pocztowy': 'Postal code',
  Miasto: 'City',
  Kraj: 'Country',
  'Numer telefonu': 'Phone number',
  'Wewn.': 'Ext.',
  Język: 'Language',
  Poziom: 'Level',
  wymagane: 'required',
  Adres: 'Address',
  Telefony: 'Phones',
  Adresy: 'Addresses',

  // ── Shared dictionaries (wizard-core) ───────────────────────────────────
  Polska: 'Poland',
  Niemcy: 'Germany',
  Francja: 'France',
  'Wielka Brytania': 'United Kingdom',
  Ukraina: 'Ukraine',
  Czechy: 'Czechia',
  Słowacja: 'Slovakia',
  Litwa: 'Lithuania',
  'Stany Zjednoczone': 'United States',
  Inne: 'Other',
  Inny: 'Other',
  'ul. (ulica)': 'st. (street)',
  'al. (aleja)': 'ave. (avenue)',
  'pl. (plac)': 'sq. (square)',
  'os. (osiedle)': 'est. (estate)',
  rondo: 'roundabout',
  skwer: 'green square',
  wybrzeże: 'embankment',
  Polski: 'Polish',
  Angielski: 'English',
  Niemiecki: 'German',
  Francuski: 'French',
  Ukraiński: 'Ukrainian',
  Hiszpański: 'Spanish',
  'A1 – początkujący': 'A1 – beginner',
  'A2 – podstawowy': 'A2 – elementary',
  'B1 – średni': 'B1 – intermediate',
  'B2 – średnio-zaawansowany': 'B2 – upper-intermediate',
  'C1 – zaawansowany': 'C1 – advanced',
  'C2 – biegły': 'C2 – proficient',

  // ── Dev-fill panel ──────────────────────────────────────────────────────
  'Tylko wymagane': 'Required only',
  'Wszystkie pola': 'All fields',
  'Maksymalne zagnieżdżenia': 'Maximum nesting',
  'Wypełnia model formularza danymi demo (tylko localhost).': 'Fills the form model with demo data (localhost only).',
  'Ostatnio:': 'Last:',
  'Wypełniono wymagane': 'Filled required',
  'Wypełniono wszystkie': 'Filled all',
  'Otwórz panel narzędzi deweloperskich': 'Open developer tools panel',
  'Narzędzia deweloperskie': 'Dev tools',

  // ── Validation — wrapper fallbacks (error-message.ts) ───────────────────
  'To pole jest wymagane.': 'This field is required.',
  'Nieprawidłowy adres e-mail.': 'Invalid e-mail address.',
  'Nieprawidłowy format.': 'Invalid format.',
  'Wartość jest zbyt krótka.': 'Value is too short.',
  'Wartość jest zbyt długa.': 'Value is too long.',
  'Wartość jest zbyt mała.': 'Value is too small.',
  'Wartość jest zbyt duża.': 'Value is too large.',
  'Pole jest nieprawidłowe.': 'Field is invalid.',

  // ── Validation — wizard-validators field errors ─────────────────────────
  'Nieprawidłowy numer PESEL.': 'Invalid PESEL number.',
  'Nieprawidłowy numer NIP.': 'Invalid NIP number.',
  'Nieprawidłowy numer REGON.': 'Invalid REGON number.',
  'Numer KRS musi mieć dokładnie 10 cyfr.': 'KRS number must be exactly 10 digits.',
  'Podaj numer w formacie +48 NNN NNN NNN lub 9 cyfr.': 'Enter a number like +48 NNN NNN NNN or 9 digits.',
  'Wprowadź kod pocztowy w formacie NN-NNN.': 'Enter a postal code like NN-NNN.',
  'Podaj poprawny adres http(s)://…': 'Enter a valid http(s):// URL.',
  'Wymagane ukończone 18 lat.': 'Must be at least 18 years old.',

  // ── Validation — shared address/phone schemas (wizard-core) ─────────────
  'Nazwa ulicy jest wymagana.': 'Street name is required.',
  'Maksymalnie 100 znaków.': 'Max 100 characters.',
  'Numer domu jest wymagany.': 'House number is required.',
  'Maksymalnie 10 znaków.': 'Max 10 characters.',
  'Kod pocztowy jest wymagany.': 'Postal code is required.',
  'Miasto jest wymagane.': 'City is required.',
  'Maksymalnie 80 znaków.': 'Max 80 characters.',
  'Numer telefonu jest wymagany.': 'Phone number is required.',

  // ── Feature flags / disabled page ───────────────────────────────────────
  'Aplikacja jest wyłączona': 'Application is disabled',
  'Ta aplikacja jest obecnie wyłączona w tym środowisku. Skontaktuj się z administratorem.':
    'This application is currently disabled in this environment. Contact your administrator.',

  // ── Error screens (ui-feedback) — actions ───────────────────────────────
  'Wróć do strony głównej': 'Back to home',
  'Odśwież stronę': 'Reload page',

  // ── Error screens — client (4xx) ────────────────────────────────────────
  'Nieprawidłowe żądanie': 'Bad request',
  'Serwer nie mógł przetworzyć tego żądania. Sprawdź dane i spróbuj ponownie.':
    'The server could not process this request. Check the data and try again.',
  'Wymagane logowanie': 'Sign-in required',
  'Aby zobaczyć tę stronę, musisz się najpierw zalogować.': 'You must sign in first to view this page.',
  'Brak dostępu': 'Access denied',
  'Nie masz uprawnień, aby wyświetlić tę stronę.': 'You do not have permission to view this page.',
  'Nie znaleziono strony': 'Page not found',
  'Strona, której szukasz, nie istnieje lub została przeniesiona.':
    'The page you are looking for does not exist or has moved.',
  'Przekroczono czas żądania': 'Request timed out',
  'Żądanie trwało zbyt długo. Spróbuj ponownie.': 'The request took too long. Please try again.',
  'Zasób niedostępny': 'Resource gone',
  'Ten zasób został trwale usunięty.': 'This resource has been permanently removed.',
  'Dane są zbyt duże': 'Payload too large',
  'Przesłane dane przekraczają dozwolony rozmiar.': 'The submitted data exceeds the allowed size.',
  'Zbyt wiele żądań': 'Too many requests',
  'Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.':
    'Too many requests were sent. Wait a moment and try again.',

  // ── Error screens — server (5xx) ────────────────────────────────────────
  'Błąd serwera': 'Server error',
  'Po naszej stronie wystąpił nieoczekiwany błąd. Pracujemy nad rozwiązaniem.':
    'An unexpected error occurred on our side. We are working on it.',
  'Funkcja niedostępna': 'Not implemented',
  'Ta funkcja nie jest jeszcze obsługiwana.': 'This feature is not supported yet.',
  'Błąd bramy': 'Bad gateway',
  'Serwer pośredniczący otrzymał nieprawidłową odpowiedź. Spróbuj ponownie później.':
    'The upstream server returned an invalid response. Try again later.',
  'Usługa niedostępna': 'Service unavailable',
  'Usługa jest chwilowo niedostępna. Spróbuj ponownie za kilka minut.':
    'The service is temporarily unavailable. Try again in a few minutes.',
  'Przekroczono czas bramy': 'Gateway timeout',
  'Serwer pośredniczący nie odpowiedział na czas. Spróbuj ponownie później.':
    'The upstream server did not respond in time. Try again later.',

  // ── Error screens — network ─────────────────────────────────────────────
  'Brak połączenia': 'No connection',
  'Wygląda na to, że jesteś offline. Sprawdź połączenie z internetem.':
    'You appear to be offline. Check your internet connection.',
  'Utracono połączenie': 'Connection lost',
  'Połączenie z serwerem zostało przerwane. Spróbuj ponownie.':
    'The connection to the server was interrupted. Please try again.',
  'Nie udało się wczytać konfiguracji': 'Could not load configuration',
  'Nie można było pobrać konfiguracji aplikacji. Odśwież stronę.':
    'The application configuration could not be fetched. Reload the page.',

  // ── Error screens — application ─────────────────────────────────────────
  'Trwa konserwacja': 'Under maintenance',
  'Aplikacja jest w trybie konserwacji. Wróć za chwilę.': 'The application is under maintenance. Check back soon.',
  'Coś poszło nie tak': 'Something went wrong',
  'Wystąpił nieoczekiwany błąd. Odśwież stronę lub spróbuj ponownie.':
    'An unexpected error occurred. Reload the page or try again.',

  // ── Summary commons ─────────────────────────────────────────────────────
  Podsumowanie: 'Summary',
  Zgody: 'Consents',
  '✓ udzielona': '✓ granted',
  '✗ brak': '✗ not granted',
  'Akceptuję regulamin i potwierdzam prawdziwość danych.': 'I accept the terms and confirm the data is true.',
  'Formularz zawiera braki:': 'The form has gaps:',
  Wysłano: 'Submitted',
  'Wniosek został zapisany.': 'Application saved.',
  'Formularz zawiera błędy — uzupełnij brakujące pola.': 'The form has errors — fill in the missing fields.',
  'Demo · Angular 22 Signal Forms': 'Demo · Angular 22 Signal Forms',
  Kontakt: 'Contact',
  'E-mail, telefony, adresy': 'E-mail, phones, addresses',
  'Przegląd danych i wysyłka': 'Review & submit',
  'Każdy kafelek prowadzi do jednego kroku. Statusy aktualizują się na żywo z sygnałów formularza.':
    'Each tile opens one step. Statuses update live from the form signals.',
};
