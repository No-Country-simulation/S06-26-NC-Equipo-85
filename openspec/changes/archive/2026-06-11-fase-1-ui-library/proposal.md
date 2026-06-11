# Fase 1 — Storybook + componentes atómicos (`fase-1-ui-library`)

> Fase 1 del plan [specs/appbit-frontend-plan.md](../../../specs/appbit-frontend-plan.md) (semanas 3–4).

## Why

Las Fases 2–3 (onboarding, dashboard con 5 módulos) necesitan una librería de componentes documentada y reutilizable **antes** de construir pantallas. Hoy el design system vive entero en `apps/web` (tokens en `globals.css`, shadcn en `src/components/ui`, Storybook en la app), lo que impide compartirlo y mezcla componentes genéricos con código de la app. La Fase 0 dejó `packages/ui` reservado precisamente para esta migración (ver CLAUDE.md: "migración en Fase 1").

## What Changes

- Crear el paquete `packages/ui` (`@app/ui`) con estructura atomic design (`atoms/`, `molecules/`; `organisms/` queda reservado a fases siguientes)
- **Migrar el design system de `apps/web` a `packages/ui`** — qué se mueve y qué no:
  - ✅ Tokens CSS "Amanecer" (`--bit-*`, mapeo shadcn, `@theme inline`) → hoja de estilos compartida del paquete; `globals.css` de la app pasa a importarla
  - ✅ Componentes shadcn existentes (button, input, card, dialog, badge, avatar, label, textarea, sheet, dropdown-menu) → `packages/ui` como base de los átomos
  - ✅ Helper `cn()` (`lib/utils`) → `packages/ui`
  - ✅ Storybook (config + stories) → `packages/ui/.storybook`
  - ✅ `components.json` de shadcn reconfigurado para que el CLI instale futuros componentes en `packages/ui` (soporte monorepo)
  - ❌ Tailwind no se "mueve": en v4 cada app consumidora compila su propio CSS; la app escanea las fuentes del paquete vía `@source`
  - ❌ Fuentes (`next/font`) se quedan en la app; el paquete solo consume las CSS variables `--font-fraunces` / `--font-inter`
- Completar **átomos** de Fase 1: `Spinner` y `EmojiCheckIn` (selector emocional con 5 estados y animación Framer Motion); los demás átomos (Button, Input, Badge, Avatar) ya existen vía shadcn y se ajustan a variantes BiT
- Crear **moléculas**: `JobCard`, `CourseCard`, `MentorCard`, `MoodBanner`, `NotificationToast` (wrapper de sonner)
- Storybook con `@storybook/addon-a11y`, tests de interacción (play functions — en Storybook 9+ el addon interactions es parte del core), decorators globales de tema/fuentes/fondos
- Crear **stores Zustand** en `apps/web`: `userStore`, `uiStore`, `healthStore` (con `persist` selectivo)
- Activar `@axe-core/react` emitiendo warnings de accesibilidad en desarrollo
- **BREAKING** (interno): los imports `@/components/ui/*` y `@/lib/utils` en `apps/web` pasan a `@app/ui`

## Capabilities

### New Capabilities

- `ui-component-library`: Paquete `@app/ui` con átomos y moléculas BiT documentados, agnósticos de Next.js (strings por props, sin imports de `next/*`), accesibles (WCAG 2.1 AA)
- `storybook-docs`: Storybook del paquete UI con auditoría a11y por componente, tests de interacción y decorators de tema; más `@axe-core/react` en dev de la app
- `client-state-stores`: Stores Zustand de estado UI/local (`user`, `ui`, `health`) con persistencia selectiva; nunca duplican estado del servidor

### Modified Capabilities

- `design-tokens-shadcn`: los tokens y componentes base dejan de vivir en `apps/web` (`globals.css` / `src/components/ui`) y pasan a `packages/ui`; la app los consume vía import del paquete
- `monorepo-setup`: el workspace incorpora `packages/ui` como tercer paquete interno, integrado al pipeline de turbo (`lint`, `type-check`, build de Storybook)

## Impact

**Código afectado**:
- Nuevo: `packages/ui/**` (src, styles, .storybook, package.json, tsconfig, eslint)
- Movido/eliminado: `apps/web/src/components/ui/**`, `apps/web/.storybook/**`, parte de `apps/web/src/app/globals.css`, `apps/web/src/lib/utils.ts`
- Editado: imports en `apps/web`, `apps/web/components.json`, `turbo.json`, `pnpm-workspace.yaml` (sin cambios de globs, ya cubre `packages/*`)
- Nuevo en app: `apps/web/src/store/*` (Zustand), inicialización de `@axe-core/react`

**Dependencias**: `@app/ui` (workspace), `@storybook/react-vite` + `vite` + `@tailwindcss/vite` (Storybook del paquete), `framer-motion`, `lucide-react`, `sonner`, `zustand` (ya instaladas, se reubican al paquete según corresponda)

**Sistemas**: pipeline turbo (nueva task `build-storybook`), Docker no cambia (la app sigue compilando todo), i18n no cambia (los componentes reciben strings traducidos por props desde la app)

## Non-goals

- No se construyen pantallas ni flujos de la app (onboarding es Fase 2, dashboard es Fase 3)
- No se crean organismos (`GapProgressBar`, `OnboardingWizard`… llegan con sus fases)
- No se integra Chromatic / visual regression (opcional en el plan; se pospone)
- No se publica `@app/ui` a npm: es paquete interno consumido por transpilación
- No se agregan TanStack Query hooks ni capa API (Fase 2)
- No se migra `packages/ui` a un build propio (tsup/rollup): se consume como fuente TS
