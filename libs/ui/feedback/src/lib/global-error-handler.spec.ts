import { describe, expect, it } from 'vitest';

import { A22_ERROR_ROUTE, shouldRedirectToErrorScreen } from './global-error-handler';

describe('shouldRedirectToErrorScreen', () => {
  it('redirects from any normal route', () => {
    for (const url of ['/', '/apps/individual', '/wizard/3', '/disabled', '/errors-report']) {
      expect(shouldRedirectToErrorScreen(url)).toBe(true);
    }
  });

  it('does not redirect when already on the error route (loop guard)', () => {
    for (const url of [A22_ERROR_ROUTE, '/error?from=x', '/error#frag', '/error/details']) {
      expect(shouldRedirectToErrorScreen(url)).toBe(false);
    }
  });
});
