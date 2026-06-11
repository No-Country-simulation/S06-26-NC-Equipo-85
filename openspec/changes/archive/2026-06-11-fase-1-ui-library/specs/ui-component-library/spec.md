# ui-component-library Specification (delta)

## ADDED Requirements

### Requirement: @app/ui workspace package

The monorepo SHALL contain a `packages/ui` package named `@app/ui` that exports TypeScript source directly (no build step), declares `react`/`react-dom` as `peerDependencies`, and is consumed by `apps/web` via `transpilePackages` in `next.config.ts`. UI dependencies (`radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `framer-motion`, `sonner`, `shadcn`) SHALL live in the package, not the app (except those the app uses directly).

#### Scenario: App imports components from the package
- **WHEN** `apps/web` imports `Button` from `@app/ui`
- **THEN** `pnpm build` succeeds and the component renders in the app

#### Scenario: Package participates in the turbo pipeline
- **WHEN** running `pnpm lint` and `pnpm type-check` at the repo root
- **THEN** `@app/ui` is linted and type-checked using the shared `@app/config` presets

### Requirement: Atomic design structure

The package SHALL organize source as `src/atoms/`, `src/molecules/`, `src/styles/`, and `src/lib/` (with `cn()` in `src/lib/utils.ts`), exposing a barrel export (`@app/ui`) and a stylesheet export (`@app/ui/styles.css`). `organisms/` is reserved for later phases.

#### Scenario: Structure exists
- **WHEN** inspecting `packages/ui/src/`
- **THEN** `atoms/`, `molecules/`, `styles/`, and `lib/utils.ts` are present and `index.ts` re-exports all public components

### Requirement: Fase 1 atoms

`src/atoms/` SHALL contain: `Button`, `Input`, `Badge`, `Avatar` (migrated shadcn components with BiT variants), `Spinner`, and `EmojiCheckIn` — a mood selector with exactly 5 states (feliz, cansado, triste, ansioso, sobrecargado) animated with Framer Motion and operable by keyboard as a radio group. Migrated shadcn primitives not in the atoms list (card, dialog, dropdown-menu, label, sheet, textarea) SHALL also live in the package.

#### Scenario: Button variants follow the Amanecer mapping
- **WHEN** rendering `Button` with variants primary/secondary/ghost/destructive
- **THEN** they resolve to terracota, ámbar (with cacao text, never white), transparent, and granate respectively

#### Scenario: Input communicates errors accessibly
- **WHEN** `Input` renders in error state with a message
- **THEN** the message is linked via `aria-describedby` and the field keeps a visible focus ring

#### Scenario: Spinner is announced to assistive tech
- **WHEN** `Spinner` renders
- **THEN** it exposes `role="status"` with an accessible loading label

#### Scenario: EmojiCheckIn selection
- **WHEN** the user picks one of the 5 moods
- **THEN** `onChange` fires with the mood id and the selected emoji animates (scale/highlight)

#### Scenario: EmojiCheckIn keyboard operation
- **WHEN** navigating the component with arrow keys and pressing Enter/Space
- **THEN** focus moves between moods and the focused mood is selected

### Requirement: Fase 1 molecules

`src/molecules/` SHALL contain: `JobCard` (vacancy with match score, area and CTA), `CourseCard` (course with provider, level and status), `MentorCard` (mentor with availability and schedule CTA), `MoodBanner` (daily mental-health banner driven by the check-in mood), and `NotificationToast` (presets over `sonner`: success/info/error/critical). Molecules SHALL be presentational: data arrives via props, actions via callbacks/slots.

#### Scenario: JobCard shows match score
- **WHEN** rendering `JobCard` with a job and `matchScore`
- **THEN** the score, area badge and CTA are visible, and the CTA invokes the provided callback/slot

#### Scenario: MoodBanner uses the calm palette
- **WHEN** `MoodBanner` renders for any mood
- **THEN** it uses azul-horizonte/neutral tones and NEVER granate (granate is reserved for the CVV flow)

#### Scenario: NotificationToast reserves critical styling
- **WHEN** calling `notify.critical(...)` vs `notify.success(...)`
- **THEN** critical renders with granate styling (CVV/critical errors only) and success with oliva

### Requirement: Components are framework-agnostic

No file in `packages/ui/src` SHALL import from `next/*` or `next-intl`. Visible strings SHALL be overridable props with Spanish defaults (the app passes `useTranslations('common')` values); navigation SHALL be injected by the consumer (`asChild`, slots, or callbacks). An ESLint `no-restricted-imports` rule SHALL enforce this.

#### Scenario: Components render outside Next.js
- **WHEN** a component renders in Storybook (Vite) without the Next.js runtime
- **THEN** it renders correctly using its default strings

#### Scenario: Lint guards against Next.js imports
- **WHEN** a `packages/ui` file imports `next/link`
- **THEN** `pnpm lint` fails with the restricted-import rule

### Requirement: Components meet WCAG 2.1 AA

Every component SHALL keep visible focus, use color combinations meeting AA contrast (≥ 4.5:1 normal text), and expose correct roles/names/states.

#### Scenario: Component stories pass the a11y audit
- **WHEN** running the Storybook a11y addon over each component story
- **THEN** no critical violations are reported (contrast, roles, accessible names)
