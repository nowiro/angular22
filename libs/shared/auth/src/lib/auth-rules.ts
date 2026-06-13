import type { Role } from './auth.types';
import { ROLES } from './auth.types';

/** True when `granted` contains at least one of the `required` roles (any-of). */
export function hasAnyRole(granted: readonly Role[], required: readonly Role[]): boolean {
  return required.some((role) => granted.includes(role));
}

/** Type guard narrowing an untrusted string (localStorage / Keycloak token) to a `Role`. */
export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

/** Keep only known roles from an untrusted string list (drops unrelated realm roles). */
export function rolesFromStrings(values: readonly string[]): Role[] {
  return values.filter(isRole);
}
