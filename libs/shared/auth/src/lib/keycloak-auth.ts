import {
  effect,
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';

import {
  AutoRefreshTokenService,
  KEYCLOAK_EVENT_SIGNAL,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';

import { rolesFromStrings } from './auth-rules';
import { AuthStore } from './auth-store';

/** Coordinates of a real Keycloak server + client (mirrors `KeycloakConfig`). */
export interface KeycloakServerConfig {
  readonly url: string;
  readonly realm: string;
  readonly clientId: string;
}

/**
 * Map the Keycloak session (realm roles + identity) into our `AuthUser`. When the
 * session is gone — logout, token expiry, refresh failure — the principal is
 * cleared, so `AuthStore` never reports stale roles.
 *
 * SECURITY: this client-side role view is an **affordance** for UI/guards only.
 * The resource server MUST re-validate the bearer token + realm roles on every
 * request — a hidden button or a passed `roleGuard` is not a security boundary.
 */
function syncFromKeycloak(keycloak: Keycloak, store: AuthStore): void {
  if (!keycloak.authenticated) {
    store.setUser(null);
    return;
  }
  const token = keycloak.tokenParsed;
  const claimedUsername: unknown = token?.['preferred_username'];
  store.setUser({
    username: typeof claimedUsername === 'string' ? claimedUsername : 'keycloak-user',
    roles: rolesFromStrings(token?.realm_access?.roles ?? []),
  });
}

/**
 * Real-server auth: wires keycloak-angular's `provideKeycloak` with **auto token
 * refresh + inactivity logout** (`withAutoRefreshToken`) and bridges the Keycloak
 * session into `AuthStore`, re-syncing on every Keycloak event (login / logout /
 * token refresh / expiry). Used when a Keycloak URL is configured; the demo runs
 * `provideMockAuth` instead.
 */
export function provideKeycloakAuth(config: KeycloakServerConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideKeycloak({
      config: { url: config.url, realm: config.realm, clientId: config.clientId },
      initOptions: { onLoad: 'check-sso', pkceMethod: 'S256' },
      features: [withAutoRefreshToken()],
      providers: [AutoRefreshTokenService, UserActivityService],
    }),
    provideEnvironmentInitializer(() => {
      const keycloak = inject(Keycloak);
      const store = inject(AuthStore);
      const event = inject(KEYCLOAK_EVENT_SIGNAL);
      // The effect runs once immediately (injection context) for the initial sync,
      // then re-syncs on every Keycloak event — refresh / expiry / logout all flow
      // through here, so AuthStore can never hold an expired token's roles.
      effect(() => {
        event();
        syncFromKeycloak(keycloak, store);
      });
    }),
  ]);
}
