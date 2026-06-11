# design-tokens-shadcn Specification

## Purpose

Encode the "Amanecer" design system as CSS variables, expose them to Tailwind v4 via `@theme`, map them onto shadcn/ui semantic roles, and provide base components and global toasts — all meeting WCAG 2.1 AA contrast.

## Requirements

### Requirement: BiT design tokens in CSS variables

The `apps/web/src/app/globals.css` file SHALL define the 10 BiT color tokens as CSS custom properties matching the "Amanecer" palette (terracota, coral, ámbar, azul horizonte, oliva, granate, arena, crema, cacao, topo) with the exact hex values, plus soft variants.

#### Scenario: Tokens are defined
- **WHEN** inspecting `globals.css`
- **THEN** `:root` defines `--bit-terracota: #A8442A`, `--bit-granate: #9E2235`, etc.

#### Scenario: Soft variants are included
- **WHEN** using `--bit-terracota-soft` (e.g. `#F4DCCB`)
- **THEN** a light background variant is available for chips/badges

### Requirement: Tailwind v4 @theme mapping

The `globals.css` file SHALL use Tailwind v4's `@theme inline` to map BiT tokens to Tailwind color utilities, with no `tailwind.config.ts`.

#### Scenario: Tailwind classes use BiT colors
- **WHEN** using `bg-terracota` in a component
- **THEN** the background renders as `#A8442A`

#### Scenario: shadcn semantic roles are mapped
- **WHEN** using a shadcn component with the primary role
- **THEN** it resolves to terracota (and `destructive` → granate, `secondary` → ámbar, `accent` → coral)

### Requirement: shadcn/ui base components

`apps/web/src/components/ui/` SHALL contain the Fase 0 base components: Button, Input, Card, Dialog, Badge, Avatar.

#### Scenario: Base components exist
- **WHEN** checking `src/components/ui/`
- **THEN** `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx`, `avatar.tsx` are present

#### Scenario: Components use design tokens
- **WHEN** examining a component (e.g. Badge)
- **THEN** it references Tailwind classes mapped to the BiT tokens (e.g. `bg-primary`, `text-granate`)

### Requirement: sonner toast configuration

A global sonner `<Toaster />` SHALL be mounted in the locale root layout with BiT-aligned styling.

#### Scenario: Sonner provider is mounted
- **WHEN** inspecting `app/[locale]/layout.tsx`
- **THEN** `<Toaster />` from `sonner` is rendered with BiT colors (crema background, cacao text, arena border)

### Requirement: Contrast ratios meet WCAG AA

Color combinations used for text/borders SHALL meet WCAG 2.1 AA (≥ 4.5:1 normal text, ≥ 3:1 large text).

#### Scenario: Primary button contrast is sufficient
- **WHEN** rendering a primary action (terracota background, white text)
- **THEN** the contrast ratio is ≥ 4.5:1 (terracota #A8442A on white ≈ 5.9:1)

#### Scenario: Destructive contrast is sufficient
- **WHEN** rendering a critical/destructive element (granate, white text)
- **THEN** the contrast ratio is ≥ 4.5:1 (granate #9E2235 on white ≈ 7.7:1)
