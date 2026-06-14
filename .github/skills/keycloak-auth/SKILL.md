---
name: keycloak-auth
description: angular22 authentication + RBAC playbook (`@angular22/shared-auth`, keycloak-angular + keycloak-js) — provideAuth (mock↔keycloak), AuthStore (signals), `*a22HasRole`, roleGuard, admin/user/guest roles, authz security. Use for login, hiding elements by permission, route protection.
---

# Keycloak / auth-RBAC — repo playbook

Auth and RBAC live in [`@angular22/shared-auth`](../../../libs/shared/auth/src/index.ts). Guarded by
the [`keycloak`](../../agents/keycloak.agent.md) agent. Stack: `keycloak-angular` + `keycloak-js`
(canon → [`tech-stack`](../../../docs/tech-stack.md)). Roles: **admin ⊇ user ⊇ guest** (the
granted-roles list is flat — admin carries all three).

## Bootstrap (once, in `app.config.ts`)

```ts
provideAuth({ mode: 'mock', initialRole: 'user' }); // demo: no server
// real IdP: provideAuth({ mode: 'keycloak', keycloak: { url, realm, clientId } })
```

`provideMockAuth` seeds `AuthStore` with a role from `localStorage` (`a22.mock-role`, toggled via
`setMockRole` + reload); `provideKeycloakAuth` calls `provideKeycloak` (`check-sso`, PKCE `S256`) and
bridges realm roles into `AuthStore`. The rest of the app depends **only** on `AuthStore`.

## Reading state (signals)

```ts
private readonly auth = inject(AuthStore);
// auth.isAuthenticated() · auth.username() · auth.roles() · auth.hasRole('admin') · auth.hasAnyRole('admin','user')
```

## Gating elements (UI)

```html
<button
  a22-button
  *a22HasRole="'admin'"
>
  Akcja admina
</button>
<a
  *a22HasRole="['admin', 'user']"
  [routerLink]="…"
>
  …
</a>
```

Reactive — shows/hides on role change. This is **UI affordance only**.

## Route protection (hard authz)

```ts
{ path: 'admin', canMatch: [roleGuard('admin')], loadComponent: … }
```

Role without permission → redirect `/forbidden`; **deep-link rejected**. A sensitive route **must** have
`roleGuard` — `*a22HasRole` alone doesn't protect (button hidden, URL still reachable).

## Security (hard)

- **Hiding ≠ protection** — always `roleGuard` on the route (and the backend for real); UI is convenience.
- **Role from token** — `rolesFromStrings(realm_access.roles)`; never from input/URL/another source
  (mock-switch via `localStorage` is **demo only**).
- **PKCE `S256`**, `onLoad: 'check-sso'`; token in memory (not `localStorage`) in real mode.
- **Client = affordance** — `roleGuard`/`*a22HasRole` is UX; the **resource server MUST** revalidate
  the bearer token + realm roles on every request. Token expiry is handled by `withAutoRefreshToken`
  (refreshes or logs out → clears `AuthStore`), so the UI doesn't hold a role from an expired token.

## Tests (per role)

Unit (pure): `auth-rules`/`AuthStore` (Vitest). E2e (`playwright`): **per role** (admin/user/guest)
set `a22.mock-role` (`addInitScript`) → element sweep: visible/active for the permitted role,
**hidden + deep-link rejected** for the unpermitted one (negative authz). RBAC matrix → `test-strategy`.

## NO

- ❌ Reading role/token from keycloak-js in a component — go through `AuthStore`.
- ❌ Sensitive route without `roleGuard` (UI hiding alone).
- ❌ Trusting a role from input/URL/`localStorage` in real mode.
- ❌ A new auth library (auth0/firebase) — stack is closed: **keycloak-angular**.
