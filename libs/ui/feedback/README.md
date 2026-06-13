# ui-feedback

Wspólne, pełnoekranowe **ekrany błędów** dla wszystkich aplikacji (portal + oba
wizardy). Jeden komponent prezentacyjny `A22ErrorScreenComponent` sterowany
enumem `A22ErrorKind` — katalog `A22_ERROR_CATALOG` mapuje każdy rodzaj błędu na
ikonę, ton, tytuł i komunikat (PL = klucz i18n, EN w `COMMON_EN`).

## Rodzaje błędów (`A22ErrorKind`) i grupy (`A22ErrorGroup`)

| Grupa          | Rodzaje                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `Client` (4xx) | BadRequest, Unauthorized, Forbidden, NotFound, RequestTimeout, Gone, PayloadTooLarge, TooManyRequests |
| `Server` (5xx) | InternalServerError, NotImplemented, BadGateway, ServiceUnavailable, GatewayTimeout                   |
| `Network`      | Offline, ConnectionLost, ConfigLoadFailed                                                             |
| `Application`  | FeatureDisabled, Maintenance, Unexpected                                                              |

## Użycie

```ts
// W trasie (kind wiązany z route data przez withComponentInputBinding()).
// Ekran ładowany eager (`component:`), bo provider handlera i `A22ErrorKind`
// są importowane statycznie — Nx zabrania mieszać static + lazy tej samej libki.
{
  path: '**',
  component: A22ErrorScreenComponent,
  data: { kind: A22ErrorKind.NotFound },
}
```

```ts
// Globalny handler — przekierowuje nieobsłużone wyjątki na trasę /error:
providers: [provideA22GlobalErrorHandler()];
```

Helper `errorKindFromHttpStatus(status)` mapuje kod HTTP na rodzaj (np. 503 →
`ServiceUnavailable`), z bezpiecznym fallbackiem dla nieznanych kodów.
