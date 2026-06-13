import { computed, Injectable, signal } from '@angular/core';

import { hasAnyRole, highestRole } from './auth-rules';
import type { AuthUser, Role } from './auth.types';

/**
 * App-facing authentication state as signals — the single source the UI and
 * guards read, regardless of whether the principal comes from the mock provider
 * or a real Keycloak server. Populated by `provideMockAuth` / `provideKeycloakAuth`.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<AuthUser | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly roles = computed<readonly Role[]>(() => this._user()?.roles ?? []);
  readonly username = computed(() => this._user()?.username ?? null);
  /** Most-privileged role the user holds — the ROLES ordering is owned here, not by consumers. */
  readonly effectiveRole = computed<Role | null>(() => highestRole(this.roles()));

  /** Replace the current principal (sign-in / sign-out / token refresh). */
  setUser(user: AuthUser | null): void {
    this._user.set(user);
  }

  hasRole(role: Role): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(...roles: readonly Role[]): boolean {
    return hasAnyRole(this.roles(), roles);
  }
}
