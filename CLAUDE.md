# App BiT — Guía para el equipo (y para Claude)

MVP de orientación personal para grupos sub-representados en tecnología
(hackathon No Country S06-26, Equipo 85). **Alcance: frontend.**

## Estructura del monorepo

```
.
├── apps/
│   └── web/                  # Next.js 16 App Router (la app)
├── packages/
│   ├── config/               # ESLint + Prettier + tsconfig compartidos (@app/config)
│   ├── env/                  # Validación de env vars con @t3-oss/env-nextjs (@app/env)
│   └── ui/                   # Librería UI "Amanecer" + Storybook (@app/ui)
├── scripts/
│   └── docker-run.mjs        # Corre la imagen de prod en un puerto libre
├── turbo.json                # Pipeline: dev / build / lint / type-check / format
├── docker-compose.yml        # Dev con hot-reload
└── pnpm-workspace.yaml
```

Turborepo + pnpm workspaces. Cada paquete interno se referencia con `workspace:*`
(en package.json aparece como `"*"`).

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Levanta el dev server (turbo) |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint en todo el monorepo |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm format` | Prettier --write |
| `pnpm docker:up` | Build + run de la imagen de prod (puerto libre automático) |
| `docker compose up` | Dev en contenedor con hot-reload |
| `pnpm --filter @app/ui storybook` | Storybook en :6006 (vive en `packages/ui`) |

> **Nota de entorno:** pnpm 11 requiere Node 22+. El Dockerfile usa `node:22-alpine`.
> Si tu Node local es 20, usa `npx pnpm@9` o Docker.

## Design System "Amanecer"

Tokens definidos en [apps/web/src/app/globals.css](apps/web/src/app/globals.css)
como CSS variables `--bit-*` y expuestos a Tailwind v4 vía `@theme inline`
(sin `tailwind.config.ts`).

**Paleta (proporción 60·30·10):**

- Neutros cálidos (60%): `crema #FAF1E6`, `arena #EFDFC4`, `cacao #2B1E16`, `topo #7A6557`
- Marca cálida (30%): `terracota #A8442A` (primary), `coral #CC4A2E` (accent), `ambar #D98E32` (secondary)
- Contrapunto frío y semánticos (10%): `azul-horizonte #2C4E9E`, `oliva #5F7E3F` (éxito), `granate #9E2235` (crítico)

**Reglas críticas:**
- `granate` se reserva EXCLUSIVAMENTE al flujo CVV y errores críticos.
- `azul-horizonte` solo para calma/confianza: salud mental, agente IA, mentorías.
- `ambar` nunca lleva texto blanco (usar `cacao #4A2B10`).
- No introducir colores fríos adicionales (violetas, teales).

**Mapeo shadcn:** `primary → terracota`, `secondary → ambar`, `accent → coral`,
`destructive → granate`, `muted → arena/topo`.

**Clases Tailwind:** además de las semánticas de shadcn (`bg-primary`, etc.),
hay clases directas BiT: `bg-terracota`, `text-azul-horizonte`, `bg-oliva-soft`, …

**Tipografía:** Fraunces (display) + Inter (UI), vía `next/font/google`.

**Accesibilidad:** objetivo WCAG 2.1 AA, contraste mínimo 4.5:1.

## i18n (next-intl)

Rutas con prefijo de locale: `/es/*` (default) y `/pt/*`.

- Config: [apps/web/src/i18n/routing.ts](apps/web/src/i18n/routing.ts),
  [request.ts](apps/web/src/i18n/request.ts),
  [navigation.ts](apps/web/src/i18n/navigation.ts)
- Middleware: [apps/web/src/middleware.ts](apps/web/src/middleware.ts)
- Traducciones: `apps/web/public/locales/{es,pt}/common.json` (namespace `common`)
- Toda la app vive bajo `apps/web/src/app/[locale]/` con route groups
  `(auth)` y `(dashboard)`.

**Regla:** nunca hardcodear strings visibles; usar `useTranslations('common')`.
Mantener paridad de keys entre `es` y `pt`.

## Convenciones

- Conventional commits.
- Componentes reutilizables viven en `packages/ui` (`@app/ui`), organizados en
  `atoms/` y `molecules/`, cada uno con su story de Storybook. La app los importa
  desde `@app/ui` (no recrear primitivos en `apps/web`). Reglas y flujo en
  [packages/ui/README.md](packages/ui/README.md). Deben ser agnósticos de Next:
  prohibido importar `next/*`/`next-intl` (lo refuerza ESLint).
- Mensajes de error accesibles (`aria-describedby`); foco visible siempre.
- Nunca subir credenciales: `.env.local` en dev, env del servicio de deploy en prod.
- Estado: Zustand solo para UI/local (`apps/web/src/store/`, patrón `skipHydration`);
  TanStack Query para todo dato de servidor.

## Plan por fases

Ver [specs/appbit-frontend-plan.md](specs/appbit-frontend-plan.md) (6 fases, 20 semanas)
y [specs/appbit-design-system.md](specs/appbit-design-system.md).
Cambios gestionados con OpenSpec en [openspec/changes/](openspec/changes/).
