## Why

App BiT necesita una infraestructura sólida antes de construir pantallas. Un monorepo bien configurado, Docker funcional y un design system en código evitan refactorings costosos más adelante y permiten que el frontend sea escalable desde semana 1.

## What Changes

- Inicializar workspace Turborepo con `apps/web` (Next.js) y `packages/ui`, `packages/config`, `packages/env`
- Configurar Next.js 16 App Router con route groups `(auth)` y `(dashboard)`
- Agregar `next-intl` para soporte multiidioma (PT, ES, EN) desde el inicio
- Setup Docker multi-stage (`docker-compose.yml` con hot-reload, `Dockerfile` de 3 stages)
- Definir paleta de design tokens BiT en CSS variables y mapear a componentes shadcn
- Instalar componentes base shadcn (Button, Input, Card, Dialog, Badge, Avatar)
- Configurar `sonner` como toast system global
- Validar variables de entorno con `@t3-oss/env-nextjs` + Zod
- Configurar ESLint, Prettier y TypeScript compartidos en `packages/config`

## Capabilities

### New Capabilities

- `monorepo-setup`: Workspace Turborepo con 3 paquetes internos, caché remota, y pipeline de build/lint/test
- `nextjs-routing`: App Router con grupos de rutas (auth, dashboard), metadata base, SEO structure
- `docker-dev-environment`: Dockerfile multi-stage + docker-compose con hot-reload para desarrollo
- `design-tokens-shadcn`: Paleta BiT mapeada en CSS variables + componentes shadcn base instalados
- `i18n-foundation`: next-intl configurado para PT/ES con sistema de traducción listo

### Modified Capabilities

*(Ninguno — Fase 0 es greenfield)*

## Impact

**Código afectado**: Creación de toda la estructura de carpetas y configuración raíz
**Dependencias agregadas**: Turborepo, next-intl, shadcn/ui, sonner, @t3-oss/env-nextjs, eslint-config, prettier, docker
**Sistemas**: CI/CD (turbo.json pipeline), Docker (local dev + deploy), i18n (toda la app)
**APIs externas**: Ninguno en esta fase

## Non-goals

- Implementar pantallas o features funcionales (eso es Fase 1+)
- Integrar con backend (endpoints de `/orientar`, `/salud` son Fase 3)
- Setup de Storybook (eso es Fase 1)
- Componentes custom más allá de los átomos base shadcn
- Testing unitario o e2e (setup en Fase 5)

---

**Fase**: 0 (Semanas 1–2)  
**Entregable**: Monorepo funcional, `docker compose up` levanta la app, design tokens en código
