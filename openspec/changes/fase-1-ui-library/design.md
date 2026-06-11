# Design — Fase 1: librería UI compartida (`@app/ui`)

## Context

Estado actual (cierre de Fase 0):

- **Tokens "Amanecer"** en [apps/web/src/app/globals.css](../../../apps/web/src/app/globals.css) (~168 líneas): `:root` con `--bit-*`, mapeo shadcn (`--primary`, …) y `@theme inline` de Tailwind v4. La app importa `tailwindcss`, `tw-animate-css` y `shadcn/tailwind.css`.
- **Componentes shadcn** (10) en `apps/web/src/components/ui/`: avatar, badge, button (+ `button.stories.tsx`), card, dialog, dropdown-menu, input, label, sheet, textarea. Usan `cn()` de `apps/web/src/lib/utils.ts` y el paquete unificado `radix-ui`.
- **Storybook ya está en v10** (el plan menciona v8; quedó desactualizado): `@storybook/nextjs` + `@storybook/addon-a11y` en `apps/web/.storybook/`, con fondos crema/arena/cacao y regla de contraste configurados. En Storybook 9+ el addon `interactions` es parte del core (play functions sin addon extra).
- **shadcn CLI** configurado vía `apps/web/components.json` (style `radix-nova`, aliases `@/components/ui`). `shadcn@^4` es además dependencia runtime (aporta `shadcn/tailwind.css`).
- **Fuentes**: `next/font/google` define `--font-fraunces` y `--font-inter` en el layout de la app.
- `packages/` solo tiene `config` y `env`. **No existe `packages/ui`**. `zustand` está instalado pero sin stores. `framer-motion@^10` instalado (peer oficial hasta React 18; con React 19 conviene v11+).

Respuesta corta a "¿podemos migrar el design system a `packages/ui`?": **sí** — tokens, componentes shadcn, `cn()` y Storybook son migrables. Lo que **no** se migra: la compilación de Tailwind (en v4 cada app compila su CSS) y `next/font` (atado a Next; el paquete solo consume las CSS variables).

## Goals / Non-Goals

**Goals:**

- `@app/ui` como única fuente de componentes reutilizables, tokens y Storybook.
- Migración incremental: cada paso deja `pnpm lint && pnpm type-check && pnpm build` en verde.
- Componentes agnósticos de Next.js → consumibles desde Storybook/Vitest sin mocks.
- Átomos y moléculas de Fase 1 documentados con stories, a11y auditada por componente.
- Stores Zustand (`user`, `ui`, `health`) en la app, con persistencia selectiva.

**Non-Goals:**

- Build/publicación del paquete (se consume como fuente TS).
- Organismos, pantallas, capa API/TanStack Query (Fases 2–3).
- Chromatic/visual regression (opcional en el plan; pospuesto).
- Dark mode completo (la variante `dark` existe en tokens; no se diseña aquí).

## Decisions

### D1 — `@app/ui` como "just-in-time package" (sin build)

`packages/ui/package.json` exporta fuente TS directamente y declara `react`/`react-dom` como `peerDependencies`:

```jsonc
{
  "name": "@app/ui",
  "exports": {
    ".": "./src/index.ts",
    "./atoms/*": "./src/atoms/*/index.ts",
    "./molecules/*": "./src/molecules/*/index.ts",
    "./styles.css": "./src/styles/index.css"
  }
}
```

`apps/web/next.config.ts` agrega `transpilePackages: ["@app/ui"]`. Alternativa considerada: build con tsup a `dist/` — rechazada: añade watch/build a cada iteración sin beneficio para un consumidor único en hackathon (es el patrón "internal packages" recomendado por Turborepo).

### D2 — Tokens CSS viven en el paquete; cada consumidor compila Tailwind

Se crea `packages/ui/src/styles/index.css` con **todo lo compartible** de `globals.css`: tokens `:root` (`--bit-*`), mapeo shadcn, `@theme inline` y `@custom-variant dark`. Tailwind v4 resuelve `@import "@app/ui/styles.css"` vía resolución de módulos.

`apps/web/src/app/globals.css` queda reducido a:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@app/ui/styles.css";
@source "../../../../packages/ui/src";
/* + wiring de next/font y estilos base propios de la app */
```

El `@source` es obligatorio: sin él, Tailwind no escanea las clases usadas dentro de `packages/ui` y faltarían utilidades en producción. El Storybook del paquete compila su propio CSS equivalente (D4). Alternativa considerada: CSS precompilado en el paquete — rechazada: dos pipelines de Tailwind y clases duplicadas.

### D3 — shadcn en modo monorepo; migración inicial manual

Los 10 componentes existentes se **mueven a mano** a `packages/ui/src/atoms/` (imports internos relativos + `cn()` desde `../../lib/utils`). Para futuros `shadcn add`:

- `packages/ui/components.json`: mismo style `radix-nova`, `tailwind.css` → `src/styles/index.css`, aliases `@app/ui/...`.
- `apps/web/components.json`: alias `ui` → `@app/ui`, de modo que el CLI (soporte monorepo) escriba primitives en el paquete.

El comportamiento exacto del CLI con style `radix-nova` se verifica en implementación; si no coopera, se instala en la app y se mueve a mano (mismo costo que hoy). `shadcn` (runtime de `shadcn/tailwind.css`) y `radix-ui` pasan a ser dependencias del paquete.

### D4 — Storybook se muda a `packages/ui` con `@storybook/react-vite`

El plan ubica `.storybook` dentro de `packages/ui`. Se reemplaza `@storybook/nextjs` por `@storybook/react-vite` (+ `vite`, `@tailwindcss/vite`):

- `preview.css`: `@import "tailwindcss"` + `@import "../src/styles/index.css"` + `@source "../src"` + definición de `--font-fraunces`/`--font-inter`.
- `preview-head.html`: `<link>` a Google Fonts (Fraunces + Inter) — sustituye a `next/font` solo dentro de Storybook.
- Se conservan los parámetros actuales (fondos crema/arena/cacao, regla `color-contrast`) y se agrega un decorator global de tema (clase de fuentes + padding).
- Scripts: `pnpm --filter @app/ui storybook` (:6006) y task `build-storybook` cacheada en turbo.

Por qué no mantener `@storybook/nextjs` en la app apuntando a `../../packages/ui`: funciona, pero acopla la librería a la app (rompe el objetivo de paquete autocontenido) y arrastra el webpack de Next. Vite además arranca más rápido. **Fallback documentado**: si `react-vite` + Tailwind v4 diera problemas en el entorno (WSL), se mantiene temporalmente el Storybook de la app con el glob extendido — los componentes no cambian.

Consecuencia de diseño que esto fuerza (deseable): **ningún componente del paquete puede importar `next/*` ni `next-intl`** — se refuerza con `no-restricted-imports` en el ESLint del paquete.

### D5 — i18n y navegación por props (componentes agnósticos)

- Textos internos (labels de `EmojiCheckIn`, CTA de cards, mensajes de `MoodBanner`): props opcionales con **defaults en ES**; la app las sobreescribe con `useTranslations('common')`. Mantiene la regla de paridad es/pt en la app, no en el paquete.
- Navegación: las moléculas no renderizan `<Link>` de Next; exponen `onAction`/`asChild`/slots para que la app inyecte el `Link` de `next-intl`.
- Datos: las moléculas son presentacionales — reciben `job`, `course`, `mentor` por props (TanStack Query las alimentará en Fases 2–3).
- `NotificationToast`: el paquete exporta presets sobre `sonner` (`notify.success/error/info/critical`); el `<Toaster />` global sigue montado en el layout de la app. Regla Amanecer: `critical` (granate) reservado a CVV/errores críticos; éxito usa oliva.

### D6 — Stores Zustand en `apps/web/src/store/`

Estado de UI/local únicamente; nunca colecciones del servidor (eso será TanStack Query):

| Store | Contenido | Persist |
|---|---|---|
| `userStore` | sesión/token, draft del onboarding, perfil confirmado | sí (`partialize`: draft + token) |
| `uiStore` | tema, locale preferido, sidebar abierto, modal activo | parcial (tema/locale; nunca modal) |
| `healthStore` | check-in del día, historial semanal local, flag alerta CVV | sí (check-in + historial) |

Patrón anti-hydration-mismatch: `persist` con `skipHydration: true` y rehidratación en un `useEffect` (o hook `useHydrated`), porque los stores persistidos se leen en Client Components bajo App Router.

### D7 — Dependencias del paquete

- `framer-motion` se **sube a v11+** (compatible con React 19) y vive en el paquete (lo usa `EmojiCheckIn`); se retira de la app si nada propio la usa.
- `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, `sonner`, `shadcn` → dependencias de `@app/ui`; la app deja de declararlas salvo que las use directamente (`sonner` queda también en la app por el `<Toaster />`).
- `@axe-core/react` se inicializa en la app vía componente dev-only (`process.env.NODE_ENV === "development"`, import dinámico). Nota: con React 19 ha tenido incompatibilidades; si no emite warnings, se deja documentado y la auditoría por componente la cubre el addon a11y de Storybook (re-evaluar en Fase 5).

## Risks / Trade-offs

- [Clases Tailwind faltantes en prod por `@source` mal apuntado] → verificación visual post-migración + `pnpm build` y grep de una clase BiT en el CSS emitido.
- [El CLI shadcn (v4 / style radix-nova) no escribe en el paquete como se espera] → la migración no depende del CLI (es manual); el modo monorepo se valida con un componente de prueba y, si falla, se documenta el flujo "add en app → mover".
- [Storybook react-vite + Tailwind v4: fricción de setup] → fallback explícito en D4 (Storybook de la app con glob extendido) sin tocar componentes.
- [`framer-motion` v10→v11+: cambios de API] → uso acotado (animaciones de `EmojiCheckIn`); smoke test en Storybook.
- [Docker: la imagen debe incluir `packages/ui`] → el Dockerfile ya copia el workspace para `config`/`env`; se verifica que `pnpm build` standalone resuelva `@app/ui` (transpilado dentro del bundle de Next, no hace falta copiarlo al runner).
- [Persist + SSR: hydration mismatch] → patrón `skipHydration` estandarizado en los 3 stores (D6).
- [`@axe-core/react` puede no funcionar con React 19] → riesgo aceptado con mitigación por Storybook a11y; documentado para Fase 5.
- [Trade-off: defaults ES dentro del paquete duplican algunos textos con `common.json`] → aceptado: mantiene el paquete agnóstico; la app siempre pasa traducciones, los defaults solo sirven a Storybook.

## Migration Plan

Cada paso termina con `pnpm lint && pnpm type-check && pnpm build` en verde (y la app levantando):

1. Crear `packages/ui` (package.json, tsconfig extendiendo `@app/config/tsconfig`, ESLint con `no-restricted-imports` de `next/*`).
2. Mover `cn()` y tokens CSS → la app importa `@app/ui/styles.css` + `@source`; `transpilePackages` en next.config.
3. Mover los 10 componentes shadcn a `atoms/` y actualizar imports en la app (`@/components/ui/*` → `@app/ui`); borrar restos.
4. Configurar `components.json` dual (paquete + app).
5. Montar Storybook react-vite en el paquete; migrar `button.stories.tsx`, decorators, fondos, a11y, fuentes; retirar `.storybook` y deps de Storybook de la app; task `build-storybook` en turbo.
6. Nuevos átomos (`Spinner`, `EmojiCheckIn`) y moléculas (`JobCard`, `CourseCard`, `MentorCard`, `MoodBanner`, `NotificationToast`) con stories + play functions.
7. Stores Zustand + init de `@axe-core/react` en la app.
8. Limpieza final y actualizar README del paquete (cómo agregar un componente + story).
9. Actualizar y documentar todo en CLAUDE.md

Rollback: revertir los commits del paso fallido; mientras `apps/web` compile, no hay estado intermedio roto (la migración es por commits atómicos).

## Open Questions

- ¿Chromatic ahora o en Fase 5? (el plan lo marca opcional; pospuesto salvo que el equipo lo pida).
- ¿`EmojiCheckIn` necesitará variante compacta para el dashboard (Fase 3)? Se diseña con prop `size` por si acaso, sin sobre-diseñar.
