/**
 * The full catalogue of error states an app can render as a full-page screen,
 * organised into groups. Polish is the source language, so the human-readable
 * title/message live in {@link A22_ERROR_CATALOG} (PL string = i18n key).
 */

/** Coarse grouping — drives the screen tone and triage of an unknown failure. */
export enum A22ErrorGroup {
  /** Client-side request problems (HTTP 4xx). */
  Client = 'client',
  /** Server-side failures (HTTP 5xx). */
  Server = 'server',
  /** Connectivity / transport problems with no usable HTTP status. */
  Network = 'network',
  /** Application/domain conditions surfaced as a full-page state. */
  Application = 'application',
}

/** Every concrete error a screen can represent. The value is a stable slug. */
export enum A22ErrorKind {
  // ── Client (HTTP 4xx) ──────────────────────────────────────────────────
  BadRequest = 'bad-request',
  Unauthorized = 'unauthorized',
  Forbidden = 'forbidden',
  NotFound = 'not-found',
  RequestTimeout = 'request-timeout',
  Gone = 'gone',
  PayloadTooLarge = 'payload-too-large',
  TooManyRequests = 'too-many-requests',

  // ── Server (HTTP 5xx) ──────────────────────────────────────────────────
  InternalServerError = 'internal-server-error',
  NotImplemented = 'not-implemented',
  BadGateway = 'bad-gateway',
  ServiceUnavailable = 'service-unavailable',
  GatewayTimeout = 'gateway-timeout',

  // ── Network / transport ────────────────────────────────────────────────
  Offline = 'offline',
  ConnectionLost = 'connection-lost',
  ConfigLoadFailed = 'config-load-failed',

  // ── Application / domain ───────────────────────────────────────────────
  FeatureDisabled = 'feature-disabled',
  Maintenance = 'maintenance',
  Unexpected = 'unexpected',
}
