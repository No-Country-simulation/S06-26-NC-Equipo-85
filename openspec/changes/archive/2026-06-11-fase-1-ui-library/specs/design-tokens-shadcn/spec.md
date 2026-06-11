# design-tokens-shadcn Specification (delta)

> Fase 1 moves the token sheet and base components from `apps/web` to `packages/ui` (`@app/ui`). Requirements below are the full updated versions.

## MODIFIED Requirements

### Requirement: BiT design tokens in CSS variables

The `packages/ui/src/styles/index.css` stylesheet (exported as `@app/ui/styles.css`) SHALL define the 10 BiT color tokens as CSS custom properties matching the "Amanecer" palette (terracota, coral, ámbar, azul horizonte, oliva, granate, arena, crema, cacao, topo) with the exact hex values, plus soft variants. `apps/web/src/app/globals.css` SHALL import this stylesheet instead of defining tokens itself.

#### Scenario: Tokens are defined
- **WHEN** inspecting `packages/ui/src/styles/index.css`
- **THEN** `:root` defines `--bit-terracota: #A8442A`, `--bit-granate: #9E2235`, etc.

#### Scenario: Soft variants are included
- **WHEN** using `--bit-terracota-soft` (e.g. `#F4DCCB`)
- **THEN** a light background variant is available for chips/badges

#### Scenario: App consumes the shared sheet
- **WHEN** inspecting `apps/web/src/app/globals.css`
- **THEN** it contains `@import "@app/ui/styles.css"` and no duplicated `--bit-*` definitions

### Requirement: Tailwind v4 @theme mapping

The shared stylesheet in `packages/ui` SHALL use Tailwind v4's `@theme inline` to map BiT tokens to Tailwind color utilities, with no `tailwind.config.ts`. Each consumer compiles its own CSS: `apps/web/src/app/globals.css` SHALL declare `@source` for `packages/ui/src` so classes used inside the package are generated, and the package's Storybook compiles the same sheet via `@tailwindcss/vite`.

#### Scenario: Tailwind classes use BiT colors
- **WHEN** using `bg-terracota` in a component
- **THEN** the background renders as `#A8442A`

#### Scenario: shadcn semantic roles are mapped
- **WHEN** using a shadcn component with the primary role
- **THEN** it resolves to terracota (and `destructive` → granate, `secondary` → ámbar, `accent` → coral)

#### Scenario: Classes used only inside the package still compile
- **WHEN** a class (e.g. `bg-oliva-soft`) is used only in a `packages/ui` component rendered by the app
- **THEN** the production CSS emitted by `pnpm build` includes that utility

### Requirement: shadcn/ui base components

`packages/ui/src/atoms/` SHALL contain the shadcn base components (Button, Input, Card, Dialog, Badge, Avatar, plus the already-installed label, textarea, sheet, dropdown-menu), and `components.json` (in `packages/ui` and `apps/web`) SHALL be configured so the shadcn CLI installs future components into the package. `apps/web/src/components/ui/` SHALL no longer exist.

#### Scenario: Base components exist in the package
- **WHEN** checking `packages/ui/src/atoms/`
- **THEN** `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx`, `avatar.tsx` are present and exported from `@app/ui`

#### Scenario: Components use design tokens
- **WHEN** examining a component (e.g. Badge)
- **THEN** it references Tailwind classes mapped to the BiT tokens (e.g. `bg-primary`, `text-granate`)

#### Scenario: App imports point to the package
- **WHEN** searching `apps/web/src` for `@/components/ui`
- **THEN** there are no matches; components are imported from `@app/ui`
