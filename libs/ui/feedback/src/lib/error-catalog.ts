import { A22ErrorGroup, A22ErrorKind } from './error-kind';

/** Visual tone — maps to an M3 container colour pair on the icon chip. */
export type A22ErrorTone = 'error' | 'warning' | 'info';

/** Everything the error screen needs to render one {@link A22ErrorKind}. */
export interface A22ErrorDescriptor {
  readonly kind: A22ErrorKind;
  readonly group: A22ErrorGroup;
  /** HTTP status, when the kind corresponds to one (shown as a code badge). */
  readonly httpStatus?: number;
  /** Material Icons icon name. */
  readonly icon: string;
  readonly tone: A22ErrorTone;
  /** Polish source string = i18n key (English in `COMMON_EN`). */
  readonly title: string;
  /** Polish source string = i18n key (English in `COMMON_EN`). */
  readonly message: string;
  /** Stable hook for e2e/selectors. */
  readonly testId: string;
}

function descriptor(
  kind: A22ErrorKind,
  group: A22ErrorGroup,
  icon: string,
  tone: A22ErrorTone,
  title: string,
  message: string,
  httpStatus?: number,
): A22ErrorDescriptor {
  // `feature-disabled` keeps its legacy testId so existing e2e stays green.
  const testId = kind === A22ErrorKind.FeatureDisabled ? 'app-disabled' : `error-${kind}`;
  return { kind, group, icon, tone, title, message, httpStatus, testId };
}

const C = A22ErrorGroup.Client;
const S = A22ErrorGroup.Server;
const N = A22ErrorGroup.Network;
const A = A22ErrorGroup.Application;

// Tone aliases — kept as single literals so the data table below doesn't trip
// `sonarjs/no-duplicate-string` on the repeated tone values.
const ERR: A22ErrorTone = 'error';
const WARN: A22ErrorTone = 'warning';
const INFO: A22ErrorTone = 'info';

/** Single source of truth — one descriptor per {@link A22ErrorKind}. */
export const A22_ERROR_CATALOG: Readonly<Record<A22ErrorKind, A22ErrorDescriptor>> = {
  // ── Client (4xx) ───────────────────────────────────────────────────────
  [A22ErrorKind.BadRequest]: descriptor(
    A22ErrorKind.BadRequest,
    C,
    'report',
    WARN,
    'Nieprawidłowe żądanie',
    'Serwer nie mógł przetworzyć tego żądania. Sprawdź dane i spróbuj ponownie.',
    400,
  ),
  [A22ErrorKind.Unauthorized]: descriptor(
    A22ErrorKind.Unauthorized,
    C,
    'lock',
    WARN,
    'Wymagane logowanie',
    'Aby zobaczyć tę stronę, musisz się najpierw zalogować.',
    401,
  ),
  [A22ErrorKind.Forbidden]: descriptor(
    A22ErrorKind.Forbidden,
    C,
    'do_not_disturb_on',
    WARN,
    'Brak dostępu',
    'Nie masz uprawnień, aby wyświetlić tę stronę.',
    403,
  ),
  [A22ErrorKind.NotFound]: descriptor(
    A22ErrorKind.NotFound,
    C,
    'search_off',
    INFO,
    'Nie znaleziono strony',
    'Strona, której szukasz, nie istnieje lub została przeniesiona.',
    404,
  ),
  [A22ErrorKind.RequestTimeout]: descriptor(
    A22ErrorKind.RequestTimeout,
    C,
    'timer_off',
    WARN,
    'Przekroczono czas żądania',
    'Żądanie trwało zbyt długo. Spróbuj ponownie.',
    408,
  ),
  [A22ErrorKind.Gone]: descriptor(
    A22ErrorKind.Gone,
    C,
    'link_off',
    WARN,
    'Zasób niedostępny',
    'Ten zasób został trwale usunięty.',
    410,
  ),
  [A22ErrorKind.PayloadTooLarge]: descriptor(
    A22ErrorKind.PayloadTooLarge,
    C,
    'data_usage',
    WARN,
    'Dane są zbyt duże',
    'Przesłane dane przekraczają dozwolony rozmiar.',
    413,
  ),
  [A22ErrorKind.TooManyRequests]: descriptor(
    A22ErrorKind.TooManyRequests,
    C,
    'hourglass_top',
    WARN,
    'Zbyt wiele żądań',
    'Wysłano zbyt wiele żądań. Odczekaj chwilę i spróbuj ponownie.',
    429,
  ),

  // ── Server (5xx) ───────────────────────────────────────────────────────
  [A22ErrorKind.InternalServerError]: descriptor(
    A22ErrorKind.InternalServerError,
    S,
    'dns',
    ERR,
    'Błąd serwera',
    'Po naszej stronie wystąpił nieoczekiwany błąd. Pracujemy nad rozwiązaniem.',
    500,
  ),
  [A22ErrorKind.NotImplemented]: descriptor(
    A22ErrorKind.NotImplemented,
    S,
    'construction',
    INFO,
    'Funkcja niedostępna',
    'Ta funkcja nie jest jeszcze obsługiwana.',
    501,
  ),
  [A22ErrorKind.BadGateway]: descriptor(
    A22ErrorKind.BadGateway,
    S,
    'router',
    ERR,
    'Błąd bramy',
    'Serwer pośredniczący otrzymał nieprawidłową odpowiedź. Spróbuj ponownie później.',
    502,
  ),
  [A22ErrorKind.ServiceUnavailable]: descriptor(
    A22ErrorKind.ServiceUnavailable,
    S,
    'cloud_off',
    ERR,
    'Usługa niedostępna',
    'Usługa jest chwilowo niedostępna. Spróbuj ponownie za kilka minut.',
    503,
  ),
  [A22ErrorKind.GatewayTimeout]: descriptor(
    A22ErrorKind.GatewayTimeout,
    S,
    'timer_off',
    ERR,
    'Przekroczono czas bramy',
    'Serwer pośredniczący nie odpowiedział na czas. Spróbuj ponownie później.',
    504,
  ),

  // ── Network ────────────────────────────────────────────────────────────
  [A22ErrorKind.Offline]: descriptor(
    A22ErrorKind.Offline,
    N,
    'wifi_off',
    WARN,
    'Brak połączenia',
    'Wygląda na to, że jesteś offline. Sprawdź połączenie z internetem.',
  ),
  [A22ErrorKind.ConnectionLost]: descriptor(
    A22ErrorKind.ConnectionLost,
    N,
    'sync_problem',
    WARN,
    'Utracono połączenie',
    'Połączenie z serwerem zostało przerwane. Spróbuj ponownie.',
  ),
  [A22ErrorKind.ConfigLoadFailed]: descriptor(
    A22ErrorKind.ConfigLoadFailed,
    N,
    'settings',
    WARN,
    'Nie udało się wczytać konfiguracji',
    'Nie można było pobrać konfiguracji aplikacji. Odśwież stronę.',
  ),

  // ── Application ────────────────────────────────────────────────────────
  [A22ErrorKind.FeatureDisabled]: descriptor(
    A22ErrorKind.FeatureDisabled,
    A,
    'block',
    INFO,
    'Aplikacja jest wyłączona',
    'Ta aplikacja jest obecnie wyłączona w tym środowisku. Skontaktuj się z administratorem.',
  ),
  [A22ErrorKind.Maintenance]: descriptor(
    A22ErrorKind.Maintenance,
    A,
    'engineering',
    INFO,
    'Trwa konserwacja',
    'Aplikacja jest w trybie konserwacji. Wróć za chwilę.',
  ),
  [A22ErrorKind.Unexpected]: descriptor(
    A22ErrorKind.Unexpected,
    A,
    'error',
    ERR,
    'Coś poszło nie tak',
    'Wystąpił nieoczekiwany błąd. Odśwież stronę lub spróbuj ponownie.',
  ),
};

/** Returns the descriptor for a kind (total over the enum — never undefined). */
export function errorDescriptor(kind: A22ErrorKind): A22ErrorDescriptor {
  return A22_ERROR_CATALOG[kind];
}

/** The group a kind belongs to. */
export function errorGroup(kind: A22ErrorKind): A22ErrorGroup {
  return A22_ERROR_CATALOG[kind].group;
}

/** Exact HTTP-status → kind map (only statuses with a dedicated screen). */
const HTTP_STATUS_TO_KIND = new Map<number, A22ErrorKind>([
  [400, A22ErrorKind.BadRequest],
  [401, A22ErrorKind.Unauthorized],
  [403, A22ErrorKind.Forbidden],
  [404, A22ErrorKind.NotFound],
  [408, A22ErrorKind.RequestTimeout],
  [410, A22ErrorKind.Gone],
  [413, A22ErrorKind.PayloadTooLarge],
  [429, A22ErrorKind.TooManyRequests],
  [500, A22ErrorKind.InternalServerError],
  [501, A22ErrorKind.NotImplemented],
  [502, A22ErrorKind.BadGateway],
  [503, A22ErrorKind.ServiceUnavailable],
  [504, A22ErrorKind.GatewayTimeout],
]);

/**
 * Maps an HTTP status to the best-matching {@link A22ErrorKind}. Exact matches
 * win; an unknown 4xx falls back to `BadRequest`, an unknown 5xx to
 * `InternalServerError`, and anything else (2xx/3xx/garbage) to `Unexpected`.
 */
export function errorKindFromHttpStatus(status: number): A22ErrorKind {
  const exact = HTTP_STATUS_TO_KIND.get(status);
  if (exact !== undefined) return exact;
  if (status >= 400 && status < 500) return A22ErrorKind.BadRequest;
  if (status >= 500 && status < 600) return A22ErrorKind.InternalServerError;
  return A22ErrorKind.Unexpected;
}

/** Groups whose screens offer a "reload / try again" action. */
const RETRYABLE_GROUPS: ReadonlySet<A22ErrorGroup> = new Set([A22ErrorGroup.Server, A22ErrorGroup.Network]);

/** Whether a kind's screen should show a retry/reload action. */
export function isRetryable(kind: A22ErrorKind): boolean {
  return RETRYABLE_GROUPS.has(errorGroup(kind)) || kind === A22ErrorKind.Unexpected;
}
