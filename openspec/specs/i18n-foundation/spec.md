# i18n-foundation Specification

## Purpose

Make App BiT multilingual from day one with next-intl: locale-prefixed routes, JSON translation files per locale, no hardcoded user-facing strings, key parity across locales, and a Spanish fallback.

## Requirements

### Requirement: next-intl setup with language routes

The app SHALL use `next-intl` with locale prefixes (`/es/*`, `/pt/*`). Spanish is the default locale; Portuguese is supported. All app routes are locale-prefixed via the `[locale]` segment and middleware.

#### Scenario: Spanish route works
- **WHEN** accessing `/es/dashboard`
- **THEN** the app renders in Spanish and `useTranslations()` returns Spanish values

#### Scenario: Portuguese route works
- **WHEN** accessing `/pt/dashboard`
- **THEN** the app renders in Portuguese and `useTranslations()` returns Portuguese values

#### Scenario: Root redirects to default locale
- **WHEN** accessing `/`
- **THEN** the user is redirected to `/es`

#### Scenario: Locale is available in components
- **WHEN** a component calls `useLocale()`
- **THEN** it returns the current locale code (`"es"` or `"pt"`)

### Requirement: JSON-based translation files

Translations SHALL be stored in `apps/web/public/locales/{locale}/{namespace}.json` (e.g. `public/locales/es/common.json`), loaded by the next-intl request config under the `common` namespace.

#### Scenario: Spanish translations exist
- **WHEN** checking the filesystem
- **THEN** `public/locales/es/common.json` exists with keys like `nav.dashboard`, `errors.required`

#### Scenario: Portuguese translations exist
- **WHEN** checking the filesystem
- **THEN** `public/locales/pt/common.json` exists with the equivalent keys

#### Scenario: Namespace is loadable
- **WHEN** a component calls `useTranslations('common')`
- **THEN** translations from `common.json` are available

### Requirement: No hardcoded strings in components

All user-visible text SHALL be sourced from translation files via `t()`, not hardcoded in `.tsx` files.

#### Scenario: Labels are translated
- **WHEN** inspecting the login/dashboard placeholder pages
- **THEN** visible labels use `t('...')` keys (e.g. `t('buttons.login')`, `t('nav.dashboard')`)

### Requirement: Translation keys are consistent across locales

For every key in the Spanish translations, an equivalent key MUST exist in the Portuguese translations with semantically equivalent (naturally translated) content.

#### Scenario: Key parity is maintained
- **WHEN** comparing `es/common.json` and `pt/common.json`
- **THEN** both have identical key hierarchies

### Requirement: Default fallback is Spanish

If a locale is unsupported, the app SHALL coerce to Spanish; missing keys SHALL not crash the app.

#### Scenario: Unsupported locale defaults to Spanish
- **WHEN** the resolved locale is not supported
- **THEN** the request config falls back to the default locale (`es`)
