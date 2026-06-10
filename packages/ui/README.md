# @appbit/ui

Librería de componentes compartidos de App BiT. Reutilizable por cualquier
frontend del monorepo (`apps/web` y futuras apps).

## Estructura

```
src/
├── styles/globals.css   # Design tokens BiT + Tailwind v4 (fuente única de la identidad visual)
├── lib/utils.ts         # cn() y helpers
├── components/ui/       # Primitivos shadcn/ui (Button, Card, Dialog, ...)
├── atoms/               # Átomos del design system (Badge, Avatar, Spinner, EmojiCheckIn)
├── molecules/           # Moléculas (JobCard, CourseCard, MentorCard, MoodBanner)
└── organisms/           # Organismos (GapProgressBar, OnboardingWizard)
```

## Uso desde una app

```ts
// 1. CSS (una vez, en el layout/entry global de la app)
import "@appbit/ui/globals.css";

// 2. Componentes
import { Button } from "@appbit/ui/components/button";
import { cn } from "@appbit/ui/lib/utils";
```

La app debe declarar `"@appbit/ui": "workspace:*"` y añadir
`transpilePackages: ["@appbit/ui"]` en `next.config.ts`.

## Agregar componentes shadcn

Ejecutar `pnpm dlx shadcn@latest add <componente>` **desde este paquete**
(`packages/ui`); se generan en `src/components/ui/`.

## Storybook

```bash
pnpm --filter @appbit/ui storybook
```
