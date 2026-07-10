## ADDED Requirements

### Requirement: BiT design tokens in CSS variables

The `apps/web/src/app/globals.css` file SHALL define 10 BiT color tokens as CSS custom properties, matching the "Amanecer" design system (terracota, coral, ámbar, azul horizonte, oliva, granate, arena, crema, cacao, topo) with exact hex values from the spec.

#### Scenario: Tokens are defined
- **WHEN** inspecting `globals.css`
- **THEN** `:root` block defines `--bit-terracota: #A8442A`, etc.

#### Scenario: Tokens are accessible in styles
- **WHEN** writing `bg-[var(--bit-terracota)]` in a component
- **THEN** background renders as the exact terracota hex

#### Scenario: Soft variants are included
- **WHEN** using `--bit-terracota-soft: #F4DCCB`
- **THEN** light backgrounds for chips/badges are available

### Requirement: Tailwind v4 @theme mapping

The `globals.css` file SHALL use Tailwind v4's `@theme inline` to map BiT tokens to Tailwind classes, replacing any `tailwind.config.ts` (not used in v4 for simple color mappings).

#### Scenario: Tailwind classes use BiT colors
- **WHEN** using `bg-terracota` in a component
- **THEN** background is `#A8442A` (terracota)

#### Scenario: shadcn color mappings are correct
- **WHEN** using shadcn Button with variant="primary"
- **THEN** button background uses terracota (mapped to primary)

#### Scenario: Semantic colors are mapped
- **WHEN** using `bg-destructive`
- **THEN** background is granate `#9E2235` (destructive maps to granate)

### Requirement: shadcn/ui components installed

The `apps/web` directory SHALL have shadcn components installed at `src/components/ui/`: Button, Input, Card, Dialog, Badge, Avatar (all base components required for Fase 0).

#### Scenario: shadcn components exist
- **WHEN** checking `src/components/ui/`
- **THEN** files `button.tsx`, `input.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx`, `avatar.tsx` exist

#### Scenario: shadcn components use design tokens
- **WHEN** examining Button component code
- **THEN** it references `--bit-*` CSS variables or Tailwind classes mapped to them

### Requirement: sonner toast configuration

A global sonner toast provider SHALL be configured in the root layout, making toast notifications available app-wide with BiT styling.

#### Scenario: Sonner provider is mounted
- **WHEN** inspecting root `layout.tsx`
- **THEN** `<Toaster />` from `sonner` is rendered

#### Scenario: Toasts use BiT theme
- **WHEN** firing `toast.success()`
- **THEN** toast background and text colors align with BiT palette

### Requirement: Contrast ratios meet WCAG AA

All color combinations used in components (text on background, borders) SHALL meet WCAG 2.1 AA minimum contrast of 4.5:1 for normal text, 3:1 for large text.

#### Scenario: Primary button contrast is sufficient
- **WHEN** rendering Button with primary variant (terracota background, white text)
- **THEN** contrast ratio is ≥ 4.5:1 (terracota #A8442A on white: 5.9:1)

#### Scenario: Destructive button contrast is sufficient
- **WHEN** rendering Button with destructive variant (granate background, white text)
- **THEN** contrast ratio is ≥ 4.5:1 (granate #9E2235 on white: 7.7:1)
