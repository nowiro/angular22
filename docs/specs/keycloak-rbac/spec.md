---
type: spec
id: 'spec.keycloak-rbac'
status: clarified
title: 'Integracja Keycloak + RBAC (admin/user/guest) w aplikacjach demo'
created: '2026-06-13'
---

# Spec: integracja Keycloak + RBAC

> Artefakt SDD **wersjonowany** w `docs/specs/`. Kanon kształtu:
> `docs/sdd/templates/spec.md`.

## Kontekst

Aplikacje demo (portal + 2 wizardy) nie miały uwierzytelniania ani autoryzacji. Potrzebny jest
**RBAC** oparty o Keycloak: role **admin/user/guest** sterujące **widocznością/dostępnością
elementów** i **dostępem do tras**. Decyzje (AskUserQuestion): biblioteka **keycloak-angular +
keycloak-js** (rozszerzenie zamkniętego stacku przez SDD); tryb **mock/stub** (bez serwera —
demo offline, realny IdP gotowy do wpięcia); **3 apki**, role **admin/user/guest**.

## User story

Jako prowadzący repo chcę, aby aplikacje miały logowanie i RBAC: elementy UI (przyciski/linki/
sekcje) i trasy są **gateowane wg roli**, a brak uprawnień oznacza nie tylko ukrycie w UI, ale i
**odrzucenie deep-linku** — żeby zademonstrować poprawny, bezpieczny wzorzec autoryzacji, gotowy
na podłączenie realnego Keycloaka.

## Acceptance criteria

- **Given** lib `@angular22/shared-auth`, **when** patrzę na API, **then** wystawia `provideAuth`
  (mock↔keycloak), `AuthStore` (sygnały: `isAuthenticated`/`roles`/`hasRole`/`hasAnyRole`),
  strukturalną dyrektywę `*a22HasRole` i `roleGuard(...)` (CanMatch); role `admin`/`user`/`guest`.
- **Given** demo bez serwera, **when** apka startuje, **then** `provideMockAuth` seeduje `AuthStore`
  rolą z `localStorage` (`a22.mock-role`, przełączalną, domyślnie `user`); realny IdP =
  `provideKeycloakAuth` (`provideKeycloak` + `check-sso` + PKCE `S256`, realm roles → `AuthStore`).
- **Given** 3 apki (portal + 2 wizardy), **when** bootstrap, **then** każda woła `provideAuth`.
- **Given** rola **bez** uprawnień, **when** element jest gateowany `*a22HasRole`, **then** jest
  **ukryty**; **when** ta sama rola wchodzi **deep-linkiem** na trasę z `roleGuard`, **then**
  **redirect `/forbidden`** (nie tylko ukryty przycisk).
- **Given** elementy interaktywne (przełącznik ról + link admina), **when** e2e przeklikuje **per
  rola** (admin/user/guest), **then** widoczność/dostęp zgodne z rolą; przełącznik zmienia stan.
- **Given** bramki, **when** `pnpm verify` + `pnpm nx run portal-e2e:e2e`, **then** zielone
  (unit: `auth-rules`/`AuthStore`; e2e: RBAC per rola + negatywny authz).

## Success metrics

- Unit: pokrycie `shared-auth` (auth-rules/AuthStore/mock) — Vitest zielony.
- E2e: **6** scenariuszy RBAC (portal) zielonych (per rola + przełącznik + negatywny deep-link).
- `pnpm verify` zielone (lint/typecheck/test/build + ai:validate 31 agentów + sdd:check).
- Budżet bundla portalu bez regresji istotnej (lazy `admin-component` ~1 kB).

## Non-goals

- Realny serwer Keycloak / docker-compose / eksport realmu — tryb **mock** (decyzja). Bridge do
  realnego IdP (`provideKeycloakAuth`) jest gotowy, ale nieuruchamiany w demo.
- Backend autoryzujący / testy integracyjne z API — brak API w demo (**n/d**).
- RBAC wewnątrz przepływów wizardów (kroki) — ta runda: provider w 3 apkach + demo RBAC w portalu.

## Open questions

Brak — biblioteka, tryb (mock) i model ról ustalone (AskUserQuestion).
