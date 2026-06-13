import {
  effect,
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';

import { KEYCLOAK_EVENT_SIGNAL, provideKeycloak } from 'keycloak-angular';
import Keycloak from 'keycloak-js';

import { rolesFromStrings } from './auth-rules';
import { AuthStore } from './auth-store';

/** Coordinates of a real Keycloak server + client (mirrors `KeycloakConfig`). */
export interface KeycloakServerConfig {
  readonly url: string;
  readonly realm: string;
  readonly clientId: string;
}

/** Map the Keycloak session (realm roles + identity) into our `AuthUser`. */
function syncFromKeycloak(keycloak: Keycloak, store: AuthStore): void {
  if (!keycloak.authenticated) {
    store.setUser(null);
    return;
  }
  const token = keycloak.tokenParsed;
  const realmRoles = token?.realm_access?.roles ?? [];
  store.setUser({
    username: (token?.['preferred_username'] as string | undefined) ?? 'keycloak-user',
    roles: rolesFromStrings(realmRoles),
  });
}

/**
 * Real-server auth: wires keycloak-angular's `provideKeycloak` and bridges the
 * Keycloak session into `AuthStore`, keeping it in sync on every Keycloak event
 * (login / logout / token refresh). Used when a Keycloak URL is configured; the
 * demo runs `provideMockAuth` instead.
 */
export function provideKeycloakAuth(config: KeycloakServerConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideKeycloak({
      config: { url: config.url, realm: config.realm, clientId: config.clientId },
      initOptions: { onLoad: 'check-sso', pkceMethod: 'S256' },
    }),
    provideEnvironmentInitializer(() => {
      const keycloak = inject(Keycloak);
      const store = inject(AuthStore);
      const event = inject(KEYCLOAK_EVENT_SIGNAL);
      syncFromKeycloak(keycloak, store);
      effect(() => {
        // Re-read on every Keycloak event so AuthStore tracks token refresh / logout.
        event();
        syncFromKeycloak(keycloak, store);
      });
    }),
  ]);
}
