# Tasks — Fase 1: `fase-1-ui-library`

> Cada grupo termina con `pnpm lint && pnpm type-check && pnpm build` en verde.
> Toda tarea de UI incluye su story y verificación de contraste/a11y en el addon.

## 1. Crear el paquete `@app/ui`

- [x] 1.1 Crear `packages/ui/package.json` (`@app/ui`, `exports` a fuente TS según design D1, `peerDependencies` react/react-dom 19, scripts `lint`/`type-check`) y `tsconfig.json` extendiendo `@app/config/tsconfig`
- [x] 1.2 Configurar ESLint del paquete con `@app/config` + regla `no-restricted-imports` para `next/*` y `next-intl`
- [x] 1.3 Agregar `transpilePackages: ["@app/ui"]` en `apps/web/next.config.ts`, correr `pnpm install` y verificar que `pnpm lint`/`pnpm type-check` incluyen el paquete vía turbo

## 2. Migrar tokens CSS y utilidades

- [x] 2.1 Crear `packages/ui/src/styles/index.css` con tokens `:root` (`--bit-*`), mapeo shadcn y `@theme inline` movidos desde `globals.css`; mover `cn()` a `packages/ui/src/lib/utils.ts`
- [x] 2.2 Reducir `apps/web/src/app/globals.css` a imports (`tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`, `@app/ui/styles.css`) + `@source "../../../../packages/ui/src"` + estilos base propios de la app
- [x] 2.3 Verificar la migración: `pnpm build` y comprobar que el CSS emitido incluye una utilidad BiT usada solo en el paquete (p. ej. grep `bg-terracota`); revisión visual rápida de la home en dev

## 3. Migrar componentes shadcn al paquete

- [x] 3.1 Mover los 10 componentes de `apps/web/src/components/ui/` a `packages/ui/src/atoms/` con imports relativos internos (`cn()` desde `../../lib/utils`); declarar deps del paquete (`radix-ui`, `cva`, `clsx`, `tailwind-merge`, `lucide-react`, `shadcn`, `sonner`)
- [x] 3.2 Crear `packages/ui/src/index.ts` (barrel) y actualizar todos los imports de `apps/web` (`@/components/ui/*` y `@/lib/utils` → `@app/ui`); eliminar `apps/web/src/components/ui/` y deps que la app ya no use
- [x] 3.3 Configurar `components.json` dual (paquete + app con aliases a `@app/ui`) y validar el modo monorepo del CLI instalando un componente de prueba (descartarlo o adoptarlo); documentar el flujo si el CLI no coopera

## 4. Storybook en `packages/ui`

- [x] 4.1 Instalar `storybook` + `@storybook/react-vite` + `@storybook/addon-a11y` + `vite` + `@tailwindcss/vite` en el paquete; crear `.storybook/main.ts` (stories de `src/**`, addon a11y) y scripts `storybook`/`build-storybook`
- [x] 4.2 Crear `preview.css` (Tailwind + tokens + `@source` + vars `--font-fraunces`/`--font-inter`), `preview-head.html` con Google Fonts y `preview.ts` portando fondos crema/arena/cacao, regla `color-contrast` y decorator global de tema
- [x] 4.3 Migrar `button.stories.tsx` al paquete, retirar `.storybook/` y deps de Storybook de `apps/web`, y verificar `pnpm --filter @app/ui storybook` con tokens y fuentes correctos
- [x] 4.4 Agregar task `build-storybook` a `turbo.json` (outputs `storybook-static/**` cacheados) y verificar caché en segunda corrida

## 5. Átomos Fase 1 (cada uno con story + chequeo a11y)

- [x] 5.1 Ajustar variantes BiT de los átomos migrados — `Button` (primary/secondary/ghost/destructive, ámbar nunca con texto blanco), `Badge`, `Avatar` (fallback de iniciales) — y completar sus stories con todas las variantes
- [x] 5.2 `Input`: estados error/success con mensaje vinculado por `aria-describedby` y foco visible; story con play function que verifica la asociación accesible
- [x] 5.3 `Spinner`: `role="status"` + label accesible, tamaños; story con fondos claro/oscuro
- [x] 5.4 Subir `framer-motion` a v11+ en el paquete y crear `EmojiCheckIn` (5 estados, radio group navegable por teclado, animación de selección); story con play function de selección por click y por teclado

## 6. Moléculas Fase 1 (cada una con story + chequeo a11y)

- [x] 6.1 `JobCard` (match score, badge de área, CTA por callback/slot) y `CourseCard` (proveedor, nivel, estado); stories con variantes de datos
- [x] 6.2 `MentorCard` (disponibilidad, CTA agendar) y `MoodBanner` (variantes por mood en paleta azul-horizonte/neutros — nunca granate); stories cubriendo los 5 moods
- [x] 6.3 `NotificationToast`: presets `notify.success/info/error/critical` sobre sonner (critical=granate solo CVV, success=oliva); story que dispara cada preset
- [x] 6.4 Pasada a11y completa: revisar el panel del addon en todas las stories y corregir violaciones críticas (contraste, nombres accesibles, roles)

## 7. Stores Zustand en `apps/web`

- [x] 7.1 Crear `src/store/user-store.ts` (token, draft de onboarding, perfil; `persist` con `partialize`, acción `reset()`) con patrón `skipHydration`
- [x] 7.2 Crear `src/store/ui-store.ts` (tema, locale, sidebar, modal activo; persistir solo tema/locale) y `src/store/health-store.ts` (check-in diario con fecha, historial semanal, flag `cvvAlert` si nota < 4)
- [x] 7.3 Verificar hidratación: página SSR con estado persistido no emite warnings de hydration (smoke test manual en dev + reload)

## 8. a11y en dev, limpieza y documentación

- [x] 8.1 Inicializar `@axe-core/react` en la app (componente dev-only con import dinámico, excluido del bundle de prod); si React 19 lo bloquea, documentar la limitación en código según design D7
- [x] 8.2 Crear `packages/ui/README.md` (cómo agregar componente + story + reglas Amanecer) y actualizar `CLAUDE.md` (estructura, comando `pnpm --filter @app/ui storybook`, regla de componentes en `packages/ui`)
- [x] 8.3 Verificación final: `pnpm lint && pnpm type-check && pnpm build`, `docker compose up` levanta, `pnpm docker:up` construye, y grep sin matches de `@/components/ui` en `apps/web`
