# @app/ui — Librería UI compartida (Design System "Amanecer")

Componentes reutilizables, tokens y Storybook de App BiT. Se consume como
**fuente TypeScript** (sin build): `apps/web` lo transpila vía
`transpilePackages: ["@app/ui"]`.

## Estructura

```
src/
├── atoms/        # primitivos (Button, Input, Badge, Avatar, Spinner, EmojiCheckIn, …)
├── molecules/    # composiciones presentacionales (JobCard, MoodBanner, …)
├── styles/       # index.css → tokens --bit-*, mapeo shadcn, @theme inline
├── lib/          # utils.ts (cn)
└── index.ts      # barrel público (@app/ui)
```

`organisms/` queda reservado para fases posteriores.

## Reglas Amanecer (críticas)

- **`granate`** se reserva EXCLUSIVAMENTE al flujo CVV y errores críticos
  (`Button`/`Badge` variant `destructive`, `notify.critical`).
- **`azul-horizonte`** solo para calma/confianza: salud mental, agente IA,
  mentorías (`MoodBanner` tono `calm`, `MentorCard` CTA).
- **`ambar`** (secondary) nunca lleva texto blanco → usar `cacao`
  (`--secondary-foreground` ya está mapeado a cacao).
- No introducir colores fríos adicionales (violetas, teales).
- Objetivo **WCAG 2.1 AA** (contraste ≥ 4.5:1, foco visible, roles/nombres).

## Componentes agnósticos de framework

Ningún archivo de `src/` puede importar `next/*` ni `next-intl` (lo refuerza
`no-restricted-imports` en el ESLint del paquete). En su lugar:

- **Textos**: props opcionales con **defaults en ES**; la app los sobreescribe
  con `useTranslations('common')`.
- **Navegación**: las moléculas exponen `onAction`/`action` (slot) — la app
  inyecta el `<Link>` de `next-intl`.
- **Datos**: las moléculas son presentacionales (reciben `job`, `course`, … por
  props; TanStack Query las alimentará en Fases 2–3).

## Agregar un componente

1. Crear `src/atoms/<nombre>/<nombre>.tsx` + `index.ts` (`export * from "./<nombre>"`).
2. Usar `cn` desde `../../lib/utils` e importar primitivos por ruta relativa.
3. Crear `src/atoms/<nombre>/<nombre>.stories.tsx` con `title: "Atoms/<Nombre>"`,
   `tags: ["autodocs"]` y stories cubriendo **todas las variantes**.
   - Componentes interactivos: agregar `play` function (utilidades de
     `storybook/test`; las interactions son core en Storybook 9+).
4. Re-exportar en `src/index.ts` (barrel).
5. Verificar en el addon a11y que no haya violaciones críticas.

### shadcn CLI (modo monorepo)

El CLI **sí** funciona en este monorepo: desde `packages/ui`,
`pnpm dlx shadcn@latest add <comp>` escribe en `src/atoms/<comp>.tsx` y resuelve
`cn` a `@app/ui/lib/utils` (gracias a `packages/ui/components.json` +
`apps/web/components.json` con alias `ui → @app/ui/atoms`).

Como el CLI genera un **archivo plano**, después hay que adaptarlo a la
convención del paquete: mover a `src/atoms/<comp>/<comp>.tsx`, crear su
`index.ts` y agregarlo al barrel.

## Storybook

```bash
pnpm --filter @app/ui storybook        # dev en :6006
pnpm --filter @app/ui build-storybook  # estático (cacheado en turbo)
```

Usa `@storybook/react-vite` + `@tailwindcss/vite`. Fondos crema/arena/cacao,
regla `color-contrast` activada, y Fraunces/Inter cargadas vía Google Fonts en
`.storybook/preview-head.html` (sustituye a `next/font` solo dentro de Storybook).
