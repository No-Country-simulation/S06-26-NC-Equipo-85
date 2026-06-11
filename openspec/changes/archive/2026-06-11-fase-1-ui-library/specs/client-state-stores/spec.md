# client-state-stores Specification (delta)

## ADDED Requirements

### Requirement: userStore

`apps/web/src/store/user-store.ts` SHALL hold session token, onboarding draft (step + entered data), and confirmed profile, persisted to localStorage with `partialize` (draft + token). It SHALL expose a `reset()` action that clears state and persisted keys on logout.

#### Scenario: Onboarding draft persists across sessions
- **WHEN** the user fills part of the onboarding and reloads the browser
- **THEN** the draft (current step and data) is restored from localStorage

#### Scenario: Logout clears persisted state
- **WHEN** `reset()` runs
- **THEN** in-memory state returns to defaults and the persisted entry is removed

### Requirement: uiStore

`apps/web/src/store/ui-store.ts` SHALL hold theme, preferred locale, sidebar open state, and active modal id. Only theme and locale SHALL be persisted; transient UI (sidebar, modal) never survives a reload.

#### Scenario: Transient UI is not persisted
- **WHEN** the user opens a modal and reloads the page
- **THEN** no modal is active after reload, while theme/locale are preserved

### Requirement: healthStore

`apps/web/src/store/health-store.ts` SHALL hold the daily check-in (mood + date), the local weekly history, and a CVV alert flag, persisted to localStorage.

#### Scenario: One check-in per day
- **WHEN** a check-in is registered and the app is reopened the same day
- **THEN** the store reports today's check-in as completed with the stored mood

#### Scenario: CVV alert flag
- **WHEN** the weekly score drops below 4
- **THEN** `cvvAlert` is set to `true` for the Fase 3 crisis modal to consume

### Requirement: Stores are limited to UI/local state and are hydration-safe

Zustand stores SHALL NOT hold server collections (courses, jobs, mentors — TanStack Query territory from Fase 2). Persisted stores SHALL use the `skipHydration` pattern (rehydrate after mount) to avoid SSR hydration mismatches under the App Router.

#### Scenario: No hydration mismatch
- **WHEN** a server-rendered page mounts with persisted store state present
- **THEN** React logs no hydration warnings (stores rehydrate post-mount)

#### Scenario: Server data stays out of Zustand
- **WHEN** reviewing store contents
- **THEN** no fetched server collections are stored (only session, UI, and check-in state)
