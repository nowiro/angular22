/**
 * Public API for shared-auth — signal-based RBAC for the demo.
 *
 * `provideAuth` wires either the mock provider (offline demo) or a real Keycloak
 * server (`keycloak-angular` + `keycloak-js`); the app reads `AuthStore`
 * (signals), gates elements with the `*a22HasRole` directive and routes with
 * `roleGuard`.
 *
 * @packageDocumentation
 */
export type { Role, AuthUser } from './lib/auth.types';
export { ROLES } from './lib/auth.types';
export { AuthStore } from './lib/auth-store';
export { HasRoleDirective } from './lib/has-role.directive';
export { roleGuard } from './lib/role.guard';
export { provideAuth } from './lib/provide-auth';
export type { AuthConfig } from './lib/provide-auth';
export { provideMockAuth, setMockRole } from './lib/mock-auth';
export { provideKeycloakAuth } from './lib/keycloak-auth';
export type { KeycloakServerConfig } from './lib/keycloak-auth';
export { hasAnyRole, isRole, rolesFromStrings } from './lib/auth-rules';
