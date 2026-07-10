# nextjs-routing Specification

## Purpose

Define the Next.js App Router structure for App BiT: locale-prefixed routes, route groups separating auth from the dashboard, base metadata/SEO, and the root layout that wires fonts, global CSS, and i18n.

## Requirements

### Requirement: Route groups (auth) and (dashboard)

The App Router tree under `apps/web/src/app/[locale]/` SHALL have two route groups: `(auth)` for authentication flows and `(dashboard)` for the main app. Each group has its own `layout.tsx` with a distinct visual hierarchy.

#### Scenario: Auth group renders auth layout
- **WHEN** accessing `/es/login` (inside `(auth)` group)
- **THEN** the `(auth)/layout.tsx` is active, showing the minimal centered auth shell

#### Scenario: Dashboard group renders dashboard layout
- **WHEN** accessing `/es/dashboard` (inside `(dashboard)` group)
- **THEN** the `(dashboard)/layout.tsx` is active, showing the app header/chrome

#### Scenario: Route groups are invisible in URLs
- **WHEN** a user navigates to the login page
- **THEN** the URL is `/es/login`, not `/es/(auth)/login`

### Requirement: Metadata and SEO structure

The locale layout SHALL define base metadata (title template, description, OpenGraph/Twitter tags, robots). A `favicon.ico` SHALL be present at the app root. Child pages MAY override specific metadata fields.

#### Scenario: Base metadata is present
- **WHEN** rendering any page
- **THEN** `<title>`, `<meta name="description">`, and OpenGraph tags are in `<head>`

#### Scenario: Dynamic page titles work
- **WHEN** a page exports a `metadata` object with a custom `title`
- **THEN** the page title is merged with the base title template (`%s | App BiT`)

### Requirement: next-intl integration at route level

The app SHALL use `next-intl` with locale as a route prefix (`/es/*`, `/pt/*`). Spanish is the default locale; Portuguese is supported. Middleware redirects unprefixed paths to the default locale.

#### Scenario: Locale prefixes work
- **WHEN** a user accesses `/es/dashboard`
- **THEN** the locale is Spanish and translations resolve from the `es` messages

#### Scenario: Locale detection for root
- **WHEN** a user accesses `/`
- **THEN** they are redirected (307) to the default locale `/es`

#### Scenario: next-intl provider wraps the app
- **WHEN** any component calls `useTranslations()`
- **THEN** translations for the current locale are available

### Requirement: Root layout structure

`apps/web/src/app/[locale]/layout.tsx` SHALL be the locale root layout: it sets the HTML `lang` attribute, loads fonts, imports global CSS, and wraps children with `NextIntlClientProvider` and the sonner `Toaster`. Unsupported locales SHALL trigger `notFound()`.

#### Scenario: Fonts are loaded
- **WHEN** a page loads
- **THEN** `next/font/google` Fraunces (display) and Inter (UI) are applied via CSS variables

#### Scenario: Global CSS is imported
- **WHEN** rendering any page
- **THEN** `globals.css` (Tailwind, BiT design tokens, base styles) is active

#### Scenario: Locale is set on `<html>` tag
- **WHEN** rendering a page in Spanish
- **THEN** `<html lang="es">` is present

#### Scenario: Unsupported locale is rejected
- **WHEN** the `[locale]` segment is not one of the supported locales
- **THEN** the layout calls `notFound()`
