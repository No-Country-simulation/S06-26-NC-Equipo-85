# storybook-docs Specification (delta)

## ADDED Requirements

### Requirement: Storybook lives in packages/ui

Storybook (v10, `@storybook/react-vite`) SHALL be configured under `packages/ui/.storybook/`, compiling Tailwind v4 via `@tailwindcss/vite`, loading the BiT tokens from the package stylesheet, and loading Fraunces/Inter (e.g. Google Fonts `<link>` in `preview-head.html`) so `--font-fraunces`/`--font-inter` resolve without `next/font`. `apps/web` SHALL no longer host Storybook.

#### Scenario: Storybook starts from the package
- **WHEN** running `pnpm --filter @app/ui storybook`
- **THEN** Storybook serves on :6006 rendering components with BiT tokens and correct typography

#### Scenario: App no longer hosts Storybook
- **WHEN** inspecting `apps/web`
- **THEN** there is no `.storybook/` directory and no `storybook`/`@storybook/*` dependencies remain in its `package.json`

### Requirement: Every exported component has a story

Each atom and molecule exported from `@app/ui` SHALL have a co-located `*.stories.tsx` covering its main variants and states.

#### Scenario: Story coverage
- **WHEN** listing public components of `@app/ui`
- **THEN** each one has a story file with at least its primary variants (e.g. Button: primary/secondary/ghost/destructive)

### Requirement: A11y audit per component

`@storybook/addon-a11y` SHALL be enabled globally targeting WCAG 2.1 AA, including the `color-contrast` rule.

#### Scenario: Violations surface in the panel
- **WHEN** a story renders a control with insufficient contrast
- **THEN** the a11y panel reports the violation for that story

### Requirement: Interaction tests with play functions

Interactive components SHALL include interaction tests as story `play` functions (core feature in Storybook 9+; no separate interactions addon).

#### Scenario: EmojiCheckIn interaction test
- **WHEN** the EmojiCheckIn story's `play` function runs
- **THEN** it selects a mood via userEvent and asserts the selected state/`onChange` call in the interactions panel

### Requirement: Global theme decorators and backgrounds

The preview SHALL apply a global decorator providing the typography variables and base surface, and keep the BiT backgrounds toolbar (crema default, arena, cacao).

#### Scenario: Backgrounds toolbar available
- **WHEN** opening any story
- **THEN** crema is the default background and arena/cacao can be selected from the toolbar

### Requirement: Storybook build in the turbo pipeline

A `build-storybook` task SHALL exist in `turbo.json` with cached outputs, runnable from the root.

#### Scenario: Cacheable static build
- **WHEN** running the Storybook build task twice without changes
- **THEN** the second run is served from turbo cache and produces the static `storybook-static/` output

### Requirement: Dev accessibility warnings in the app

`apps/web` SHALL initialize `@axe-core/react` only in development (dynamic import, excluded from production bundles) so a11y violations log console warnings while developing. If a React 19 incompatibility prevents it from reporting, the limitation SHALL be documented in code and coverage falls back to the Storybook a11y audit until Fase 5.

#### Scenario: Violation logs a warning in dev
- **WHEN** the dev app renders a component with an accessibility violation
- **THEN** axe logs a console warning describing the violation

#### Scenario: Production is unaffected
- **WHEN** building for production
- **THEN** `@axe-core/react` is not included in the client bundle
