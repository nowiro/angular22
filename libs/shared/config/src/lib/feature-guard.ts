import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { Router } from '@angular/router';

import type { FeatureId } from './feature-flags';
import { FeatureFlagsStore } from './feature-flags-store';

/**
 * Route gate for a feature flag — a disabled feature's routes don't match and
 * the user lands on the fallback URL instead. Use with `canMatch` so disabled
 * routes are invisible to the router (deep links included).
 *
 * ```ts
 * { path: 'apps/individual', canMatch: [featureEnabledGuard('individual-wizard')], … }
 * ```
 */
export function featureEnabledGuard(id: FeatureId, fallbackUrl = '/'): CanMatchFn {
  // eslint-disable-next-line sonarjs/function-return-type -- Router guards return boolean | UrlTree by contract
  return () => {
    const flags = inject(FeatureFlagsStore);
    if (flags.isEnabled(id)) return true;
    return inject(Router).parseUrl(fallbackUrl);
  };
}
