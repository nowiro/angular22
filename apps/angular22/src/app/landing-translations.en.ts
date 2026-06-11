/** English translations for the landing app (Polish source string = key). */
export const LANDING_EN: Readonly<Record<string, string>> = {
  'Demo monorepo angular22': 'angular22 demo monorepo',
  'Dwa kreatory formularzy zbudowane w 100% na stabilnych Signal Forms z Angular 22. Wszystkie komponenty Angular Material są opakowane w biblioteki Nx (@angular22/ui-material) jako kontrolki FormValueControl, a wypełnianie danymi demo działa wyłącznie na localhoście.':
    'Two form wizards built 100% on the stable Signal Forms from Angular 22. Every Angular Material component is wrapped in Nx libraries (@angular22/ui-material) as FormValueControl controls, and demo data filling works only on localhost.',
  'Kreator danych osobowych': 'Personal data wizard',
  'Kreator danych firmy': 'Company data wizard',
  '5 kroków: dane podstawowe (PESEL z auto-uzupełnianiem daty urodzenia), kontakt z wieloma adresami, warunkowa ankieta (wykształcenie → specjalizacja IT → praca doktorska), zgody zależne od kontekstu i podsumowanie.':
    '5 steps: basic data (PESEL with auto-filled date of birth), contact with multiple addresses, a conditional survey (education → IT specialisation → doctoral thesis), context-driven consents and a summary.',
  '6 kroków: dane rejestrowe (NIP/REGON/KRS z walidacją sum kontrolnych, KRS warunkowy od formy prawnej), kontakt, profil działalności sterujący katalogiem zgód (PSD2, sankcje), reprezentanci i podsumowanie.':
    '6 steps: registry data (NIP/REGON/KRS with checksum validation, KRS conditional on the legal form), contact, a business profile driving the consent catalogue (PSD2, sanctions), representatives and a summary.',
  ' — zoneless, standalone, signals, Signal Forms (stabilne)':
    ' — zoneless, standalone, signals, Signal Forms (stable)',
  ' — monorepo, granice modułów, cache zadań': ' — monorepo, module boundaries, task caching',
  ' — tokeny M3, wrappery w libs/ui/material': ' — M3 tokens, wrappers in libs/ui/material',
  ' — testy jednostkowe libów': ' — unit tests for the libraries',
  ' — testy e2e obu kreatorów': ' — e2e tests for both wizards',
  ' + ESLint flat config (angular-eslint, sonarjs, unicorn, import-x)':
    ' + ESLint flat config (angular-eslint, sonarjs, unicorn, import-x)',
};
