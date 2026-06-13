/**
 * RBAC roles for the demo, most → least privileged. The granted-roles list on a
 * user is flat (Keycloak realm roles arrive the same way), so privilege is
 * expressed by membership, not ordering — an `admin` principal simply carries
 * all three roles.
 */
export type Role = 'admin' | 'user' | 'guest';

/** Every known role, ordered most → least privileged. */
export const ROLES: readonly Role[] = ['admin', 'user', 'guest'];

/** Authenticated principal exposed to the app, source-agnostic (mock or Keycloak). */
export interface AuthUser {
  readonly username: string;
  readonly roles: readonly Role[];
}
