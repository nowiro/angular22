import type { EnvironmentProviders } from '@angular/core';

import type { Role } from './auth.types';
import { type KeycloakServerConfig, provideKeycloakAuth } from './keycloak-auth';
import { provideMockAuth } from './mock-auth';

/** Bootstrap-time auth choice for an app. */
export interface AuthConfig {
  /** `mock` = demo (no server); `keycloak` = real IdP via keycloak-angular. */
  readonly mode: 'mock' | 'keycloak';
  /** Mock mode: initial role when none is stored in `localStorage`. */
  readonly initialRole?: Role;
  /** Keycloak mode: server coordinates. */
  readonly keycloak?: KeycloakServerConfig;
}

/**
 * Single entry point each app bootstraps. Chooses the mock provider (demo,
 * offline) or the real Keycloak bridge based on `config.mode`; the rest of the
 * app depends only on `AuthStore` and is unaffected by the choice.
 */
export function provideAuth(config: AuthConfig): EnvironmentProviders {
  if (config.mode === 'keycloak' && config.keycloak) {
    return provideKeycloakAuth(config.keycloak);
  }
  return provideMockAuth(config.initialRole);
}
