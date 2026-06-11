## ADDED Requirements

### Requirement: next-intl setup with language routes

The app SHALL use `next-intl` with locale prefixes (e.g., `/es/*`, `/pt/*`). Spanish is the default locale; Portuguese is supported. All routes MUST be locale-prefixed.

#### Scenario: Spanish route works
- **WHEN** accessing `/es/dashboard`
- **THEN** app renders in Spanish, `useTranslations()` returns Spanish keys

#### Scenario: Portuguese route works
- **WHEN** accessing `/pt/dashboard`
- **THEN** app renders in Portuguese, `useTranslations()` returns Portuguese keys

#### Scenario: Root redirects to default locale
- **WHEN** accessing `/`
- **THEN** redirect to `/es` (default locale)

#### Scenario: Locale is available in components
- **WHEN** component calls `useLocale()`
- **THEN** returns current locale code (e.g., `"es"`, `"pt"`)

### Requirement: JSON-based translation files

Translations SHALL be stored in `apps/web/public/locales/{locale}/{namespace}.json` (e.g., `public/locales/es/common.json`). Each JSON file contains flat or nested key-value pairs.

#### Scenario: Spanish translations exist
- **WHEN** checking file system
- **THEN** `public/locales/es/common.json` exists with keys like `"nav.dashboard"`, `"errors.required"`

#### Scenario: Portuguese translations exist
- **WHEN** checking file system
- **THEN** `public/locales/pt/common.json` exists with equivalent keys

#### Scenario: Namespaces are loadable
- **WHEN** component calls `useTranslations('common')`
- **THEN** translations from `common.json` are available

### Requirement: No hardcoded strings in components

All user-visible text SHALL be sourced from translation files, not hardcoded in `.tsx` files. Even placeholder text and error messages SHALL use `t()` function.

#### Scenario: Button labels are translated
- **WHEN** inspecting a Button component
- **THEN** label uses `t('button.submit')` or similar, not `"Submit"`

#### Scenario: Error messages are translated
- **WHEN** validation fails on a form
- **THEN** error text is `t('errors.required')`, not hardcoded string

### Requirement: Translation keys are consistent across locales

For every key in Spanish translations, an equivalent key MUST exist in Portuguese translations with semantically equivalent content (though naturally translated).

#### Scenario: Key parity is maintained
- **WHEN** comparing `es/common.json` and `pt/common.json`
- **THEN** both have identical key hierarchies (missing key in either is an error)

#### Scenario: Variable interpolation works
- **WHEN** using `t('greeting', { name: 'Alice' })` and JSON has `"greeting": "Hola {{name}}"`
- **THEN** renders as "Hola Alice"

### Requirement: Default fallback is Spanish

If a translation key is missing or locale is unsupported, the app SHALL fall back to Spanish. No missing-key errors SHALL crash the app; instead, the key string is displayed or Spanish version is used.

#### Scenario: Missing key falls back gracefully
- **WHEN** a key is missing in Portuguese but exists in Spanish
- **THEN** Spanish version is shown instead of error

#### Scenario: Unsupported locale defaults to Spanish
- **WHEN** user somehow accesses `/fr/` (French, not supported)
- **THEN** locale is coerced to Spanish `/es/`
