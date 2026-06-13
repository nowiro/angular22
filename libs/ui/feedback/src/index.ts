/**
 * Public API for the ui-feedback library — shared, full-page error screens for
 * every app (portal + wizards), driven by a single error catalogue.
 *
 * @packageDocumentation
 */
export {
  A22_ERROR_CATALOG,
  errorDescriptor,
  errorGroup,
  errorKindFromHttpStatus,
  isRetryable,
} from './lib/error-catalog';
export type { A22ErrorDescriptor, A22ErrorTone } from './lib/error-catalog';
export { A22ErrorGroup, A22ErrorKind } from './lib/error-kind';
export { A22ErrorScreenComponent } from './lib/error-screen.component';
export {
  A22_ERROR_ROUTE,
  A22GlobalErrorHandler,
  provideA22GlobalErrorHandler,
  shouldRedirectToErrorScreen,
} from './lib/global-error-handler';
