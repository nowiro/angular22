import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';

import { isRole } from './auth-rules';
import { AuthStore } from './auth-store';
import type { AuthUser, Role } from './auth.types';

const STORAGE_KEY = 'a22.mock-role';

/** Demo principals per role; granted-role lists are flat (admin carries all three). */
const MOCK_USERS: Readonly<Record<Role, AuthUser>> = {
  admin: { username: 'admin-demo', roles: ['admin', 'user', 'guest'] },
  user: { username: 'user-demo', roles: ['user', 'guest'] },
  guest: { username: 'guest-demo', roles: ['guest'] },
};

function currentMockRole(fallback: Role): Role {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  return isRole(stored) ? stored : fallback;
}

/**
 * Mock authentication for the demo (no Keycloak server): seeds `AuthStore` with
 * a principal whose role is read from `localStorage` (dev-switchable via
 * `setMockRole`), defaulting to `initialRole`. Swap for `provideKeycloakAuth`
 * once a real IdP is available — the rest of the app is unaffected.
 */
export function provideMockAuth(initialRole: Role = 'user'): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      inject(AuthStore).setUser(MOCK_USERS[currentMockRole(initialRole)]);
    }),
  ]);
}

/** Persist a new mock role; reload the app to re-seed `AuthStore`. */
export function setMockRole(role: Role): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, role);
  }
}

export { MOCK_USERS, STORAGE_KEY as MOCK_ROLE_STORAGE_KEY };
