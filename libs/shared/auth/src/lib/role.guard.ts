import { inject } from '@angular/core';
import { type CanMatchFn, Router } from '@angular/router';

import { AuthStore } from './auth-store';
import type { Role } from './auth.types';

/**
 * Route guard allowing the route only when the user holds one of `roles`. On
 * denial it redirects to `/forbidden` (a `UrlTree`), so a missing permission
 * blocks deep links — not just hidden UI. Returns a `CanMatchFn` (use as `canMatch`).
 */
export function roleGuard(...roles: readonly Role[]): CanMatchFn {
  return () => {
    const store = inject(AuthStore);
    const router = inject(Router);
    return store.hasAnyRole(...roles) ? true : router.parseUrl('/forbidden');
  };
}
