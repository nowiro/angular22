# shared-auth

Signal-based RBAC for the demo. `provideAuth()` wires either a **mock** provider
(offline demo, dev-switchable role) or a real **Keycloak** server
(`keycloak-angular` + `keycloak-js`). The app depends only on `AuthStore`
(signals), gates elements with the `*a22HasRole` directive and routes with
`roleGuard`. Roles: `admin` ⊇ `user` ⊇ `guest`.
