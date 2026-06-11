## ADDED Requirements

### Requirement: Route groups (auth) and (dashboard)

The Next.js App Router directory `apps/web/src/app` SHALL have two route groups: `(auth)` for authentication flows and `(dashboard)` for the main app. Both groups share a root layout but have distinct visual hierarchy.

#### Scenario: Auth group renders auth layout
- **WHEN** accessing `/login` (inside `(auth)` group)
- **THEN** the `(auth)/layout.tsx` is active, showing minimal navigation

#### Scenario: Dashboard group renders dashboard layout
- **WHEN** accessing `/dashboard` (inside `(dashboard)` group)
- **THEN** the `(dashboard)/layout.tsx` is active, showing sidebar and header

#### Scenario: Route groups are invisible in URLs
- **WHEN** user navigates to `/login`
- **THEN** URL is `/login`, not `/(auth)/login`

### Requirement: Metadata and SEO structure

The root layout SHALL define base metadata (title, description, OG tags, favicon). Child pages MAY override specific metadata fields.

#### Scenario: Base metadata is present
- **WHEN** rendering any page
- **THEN** `<title>`, `<meta name="description">`, `<meta property="og:*">` are in `<head>`

#### Scenario: Dynamic page titles work
- **WHEN** page exports `metadata` object with custom `title`
- **THEN** page-specific title is merged with base metadata

### Requirement: next-intl integration at route level

The app SHALL use `next-intl` with locale as a route prefix (e.g., `/es/dashboard`, `/pt/dashboard`). Default locale is Spanish; English and Portuguese are supported.

#### Scenario: Locale prefixes work
- **WHEN** user accesses `/es/dashboard`
- **THEN** locale is set to Spanish and translations use `es` key

#### Scenario: Locale detection for root
- **WHEN** user accesses `/`
- **THEN** they are redirected to default locale (e.g., `/es`)

#### Scenario: next-intl provider wraps entire app
- **WHEN** any component calls `useTranslations()`
- **THEN** translations for current locale are available

### Requirement: Root layout structure

`apps/web/src/app/layout.tsx` SHALL be the root layout, exporting metadata, setting HTML lang attribute, and wrapping children with global providers (CSS, fonts, i18n).

#### Scenario: Fonts are loaded
- **WHEN** page loads
- **THEN** `next/font/google` Inter and Geist are applied via CSS variables

#### Scenario: Global CSS is imported
- **WHEN** rendering any page
- **THEN** `globals.css` (with Tailwind, design tokens, base styles) is active

#### Scenario: Locale is set on `<html>` tag
- **WHEN** rendering a page in Spanish
- **THEN** `<html lang="es">` is present
