import { ErrorHandler, inject, Injectable } from '@angular/core';
import type { Provider } from '@angular/core';
import { Router } from '@angular/router';

/** Route that renders the full-page "unexpected error" screen. */
export const A22_ERROR_ROUTE = '/error';

/**
 * True when an uncaught error should redirect to the error screen. Guards
 * against a redirect loop: if we are already on (or navigating to) `/error`,
 * stay put and just let the error be logged.
 */
export function shouldRedirectToErrorScreen(currentUrl: string): boolean {
  return !(
    currentUrl === A22_ERROR_ROUTE ||
    currentUrl.startsWith(`${A22_ERROR_ROUTE}?`) ||
    currentUrl.startsWith(`${A22_ERROR_ROUTE}#`) ||
    currentUrl.startsWith(`${A22_ERROR_ROUTE}/`)
  );
}

/**
 * App-wide error handler — logs every uncaught error and routes the user to the
 * full-page error screen (`/error`) instead of leaving them on a half-rendered
 * page. Combined with `provideBrowserGlobalErrorListeners()` it also catches
 * `window.onerror` / unhandled promise rejections.
 *
 * Register via {@link provideA22GlobalErrorHandler}.
 */
@Injectable()
export class A22GlobalErrorHandler implements ErrorHandler {
  private readonly router = inject(Router);

  handleError(error: unknown): void {
    // eslint-disable-next-line no-console -- uncaught errors must still reach the console
    console.error(error);
    if (!shouldRedirectToErrorScreen(this.router.url)) return;
    this.router.navigateByUrl(A22_ERROR_ROUTE).catch((navError: unknown) => {
      // The error screen itself is unreachable (e.g. a future guard rejected) —
      // this is the last sink, so log rather than swallow the rejection.
      // eslint-disable-next-line no-console -- last-resort sink
      console.error(navError);
    });
  }
}

/** Registers {@link A22GlobalErrorHandler} as the app's `ErrorHandler`. */
export function provideA22GlobalErrorHandler(): Provider {
  return { provide: ErrorHandler, useClass: A22GlobalErrorHandler };
}
