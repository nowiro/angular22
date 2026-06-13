---
name: keycloak-auth
description: Playbook uwierzytelniania + RBAC angular22 (`@angular22/shared-auth`, keycloak-angular + keycloak-js) — provideAuth (mock↔keycloak), AuthStore (sygnały), `*a22HasRole`, roleGuard, role admin/user/guest, bezpieczeństwo authz. Użyj przy logowaniu, ukrywaniu elementów wg uprawnień, ochronie tras.
---

# Keycloak / auth-RBAC — playbook repo

Auth i RBAC żyją w [`@angular22/shared-auth`](../../../libs/shared/auth/src/index.ts). Pilnuje go
agent [`keycloak`](../../agents/keycloak.agent.md). Stack: `keycloak-angular` + `keycloak-js`
(kanon → [`tech-stack`](../../../docs/tech-stack.md)). Role: **admin ⊇ user ⊇ guest** (lista
granted-roles jest płaska — admin niesie wszystkie trzy).

## Bootstrap (raz, w `app.config.ts`)

```ts
provideAuth({ mode: 'mock', initialRole: 'user' }); // demo: bez serwera
// realny IdP: provideAuth({ mode: 'keycloak', keycloak: { url, realm, clientId } })
```

`provideMockAuth` seeduje `AuthStore` rolą z `localStorage` (`a22.mock-role`, przełączane przez
`setMockRole` + reload); `provideKeycloakAuth` woła `provideKeycloak` (`check-sso`, PKCE `S256`) i
mostkuje realm roles do `AuthStore`. Reszta apki zależy **tylko** od `AuthStore`.

## Czytanie stanu (sygnały)

```ts
private readonly auth = inject(AuthStore);
// auth.isAuthenticated() · auth.username() · auth.roles() · auth.hasRole('admin') · auth.hasAnyRole('admin','user')
```

## Gating elementów (UI)

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

Reaktywne — pokazuje/chowa po zmianie roli. To **tylko afordancja UI**.

## Ochrona tras (twarde authz)

```ts
{ path: 'admin', canMatch: [roleGuard('admin')], loadComponent: … }
```

Rola bez uprawnień → redirect `/forbidden`; **deep-link odrzucony**. Trasa wrażliwa **musi** mieć
`roleGuard` — samo `*a22HasRole` nie chroni (przycisk ukryty, URL nadal osiągalny).

## Bezpieczeństwo (twarde)

- **Ukrycie ≠ ochrona** — zawsze `roleGuard` na trasie (i realnie backend); UI to wygoda.
- **Rola z tokenu** — `rolesFromStrings(realm_access.roles)`; nigdy z inputu/URL/cudzego źródła
  (mock-switch przez `localStorage` to **wyłącznie** demo).
- **PKCE `S256`**, `onLoad: 'check-sso'`; token w pamięci (nie `localStorage`) w trybie realnym.
- **Klient = afordancja** — `roleGuard`/`*a22HasRole` to UX; **resource server MUSI** rewalidować
  bearer token + realm roles przy każdym żądaniu. Wygaśnięcie tokenu obsługuje `withAutoRefreshToken`
  (odświeża lub wylogowuje → czyści `AuthStore`), więc UI nie trzyma roli z wygasłego tokenu.

## Testy (per rola)

Unit (pure): `auth-rules`/`AuthStore` (Vitest). E2e (`playwright`): **per rola** (admin/user/guest)
ustaw `a22.mock-role` (`addInitScript`) → sweep elementów: widoczny/aktywny dla uprawnionej roli,
**ukryty + deep-link odrzucony** dla nieuprawnionej (negatywny authz). Macierz RBAC → `test-strategy`.

## NIE

- ❌ Czytanie roli/tokenu z keycloak-js w komponencie — przez `AuthStore`.
- ❌ Trasa wrażliwa bez `roleGuard` (samo ukrycie UI).
- ❌ Zaufanie roli z inputu/URL/`localStorage` w trybie realnym.
- ❌ Nowa biblioteka auth (auth0/firebase) — stack zamknięty: **keycloak-angular**.
