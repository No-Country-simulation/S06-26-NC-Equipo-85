## Context

Actualmente el proyecto tiene un monorepo parcial (apps/web existe con Next.js 16, React 19, Tailwind v4) pero **carece de estructura modular completa**: no existen `packages/ui`, `packages/config`, `packages/env`. Las herramientas (ESLint, Prettier, TypeScript) están configuradas localmente en `apps/web` en lugar de compartidas. No hay Docker dev-friendly. Los design tokens están como valores crudos en globals.css sin mapeo a la paleta BiT oficial. next-intl no está instalado.

El objetivo de Fase 0 es consolidar esta infraestructura en 2 semanas para que Fases 1-5 tengan una base sólida.

## Goals / Non-Goals

**Goals:**
- Monorepo completamente funcional con 3 paquetes internos (`ui`, `config`, `env`) y Turborepo pipeline operativo
- Docker dev environment que permite `docker compose up` sin pasos manuales adicionales
- Design tokens BiT (10 colores definidos) mapeados a CSS variables y shadcn en globals.css (sin tailwind.config.ts — Tailwind v4 usa @theme inline)
- next-intl configurado con traducción system listo para PT/ES/EN (keys en archivos, no hardcoded)
- ESLint, Prettier, TypeScript centralizados en `packages/config` y reutilizados por `apps/web`
- Primer átomo (Button) documentado en Storybook antes del cierre de la fase (Storybook full setup es Fase 1)

**Non-Goals:**
- Implementar Storybook completo (solo setup base)
- Crear pantallas de la app (eso es Fase 2+)
- Testing (Fase 5)
- Integración con backend (Fase 3)
- PWA, mapas, calendarios, etc. (Fases 3-4)

## Decisions

### 1. Estructura Turborepo con 3 paquetes internos (no monolítico)

**Decision**: `packages/ui` (componentes), `packages/config` (ESLint/Prettier/TS), `packages/env` (validación de env vars).

**Rationale**: Permite reutilización de config entre múltiples apps en el futuro (backend, admin, etc.). Cada paquete es versionable y tiene limite claro de responsabilidad.

**Alternatives considered**:
- Monolítico (todo en apps/web) → inflexible para growth, mayor deuda técnica
- Más paquetes (packages/api, packages/hooks, etc.) → prematuro, añade overhead sin beneficio en MVP

### 2. Tailwind v4 con CSS variables vía @theme inline (sin tailwind.config.ts)

**Decision**: Definir design tokens en globals.css usando `@theme inline` (Tailwind v4 nativa). Mapeo directo: `--bit-terracota` → `terracota-*` en clases.

**Rationale**: Tailwind v4 deprecó tailwind.config.ts para features simples. CSS variables son más performantes en navegador que JS config. Simplifica el flujo: cambio un hex en globals.css, se refleja en toda la app.

**Alternatives considered**:
- Usar tailwind.config.ts (Tailwind v3 style) → va contra recomendación v4
- PostCSS plugins custom → complejidad innecesaria
- CSS-in-JS (Emotion, styled-components) → conflictaría con shadcn/utility-first

### 3. Mapeo shadcn a paleta BiT via theme.colors en @theme

**Decision**: En globals.css `@theme`, mapear colores shadcn al sistema BiT:
- `primary` → terracota (#A8442A)
- `secondary` → ámbar (#D98E32)
- `destructive` → granate (#9E2235)
- Neutros (muted, card) → arena/crema/cacao/topo

**Rationale**: shadcn espera `primary`, `secondary`, etc. Al mapear la paleta BiT, los componentes shadcn ya nacen con la identidad correcta. No hay conflicto: shadcn proporciona la estructura, BiT proporciona los colores.

**Alternatives considered**:
- Customizar shadcn con CSS modules → pierde el beneficio de las variables globales
- No usar shadcn, UI completamente custom → alto effort en Fase 0, frena a Fase 1

### 4. docker-compose para dev con hot-reload, Dockerfile multi-stage para prod

**Decision**: 
- `docker-compose.yml` monta `/app` como volume, corre `pnpm dev` dentro
- `Dockerfile` tiene 3 stages: `base` (node + pnpm), `deps` (lock file), `builder` (build), `runner` (standalone output)

**Rationale**: Dev necesita feedback inmediato (hot-reload). Prod necesita imagen pequeña y segura (standalone output, user no-root).

**Alternatives considered**:
- Un solo Dockerfile con flags → complejo de mantener
- Docker solo para prod, dev local → pierdes "works in Docker" validation temprano

### 5. next-intl con namespace-based translations (PT/ES)

**Decision**: Crear `public/locales/{pt,es}/common.json` con keys. next-intl carga vía `getTranslations('namespace')`. Mensaje default en español.

**Rationale**: Namespace pattern es standard en next-intl. Evita traducción hardcoded. Preparado para agregar más idiomas sin refactor.

**Alternatives considered**:
- Strings hardcoded en componentes → deuda técnica inmediata
- Sistema de traducción custom → reinventar la rueda

### 6. ESLint/Prettier/TS compartidos en packages/config

**Decision**: Crear `packages/config/eslint.config.mjs`, `prettier.config.mjs`, `tsconfig.base.json`. `apps/web` extiende via `import` en eslint, `extends` en prettier.

**Rationale**: Una fuente de verdad para linting. Cambio en un sitio, se aplica a todo el monorepo. Previene config drift.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Tailwind v4 @theme es nuevo, poca documentación online | Documentar el mapeo en CLAUDE.md para el equipo. Fallback: Tailwind v3 si hay roadblock |
| Docker hot-reload puede ser lento en Windows (WSL2 I/O) | Soportar también `pnpm dev` local. Docker es optional para dev, required para deploy |
| next-intl agrega bundle size (~30KB gzipped) | Aceptable para MVP. Gain (support oficial + Phrase CDN después) compensa |
| packages/config centralizado crea punto único de failure en linting | Mitigado: cambios en config se propagan en rebuild. Comprobar via CI (Fase 5) |
| Monorepo linkage (pnpm) puede causar confusión en imports | Documentar clear paths: `@/components` (apps/web), `@ui/atoms` (packages/ui) |

## Open Questions

1. ¿Usar Phrase CDR (SaaS) para gestión de traducciones en Fase 2+, o mantener JSON local? → Decision: JSON local en Fase 0-1, evaluar SaaS en Fase 3 si el equipo crece
2. ¿Pre-calentar `@axe-core/react` en Fase 0 (Fase 1 dice "desde Fase 1")? → Decision: Instalar en Fase 0, activar warnings en dev desde Fase 1
3. ¿Usar Docker en CI antes de Fase 5? → Decision: No, Fase 5 configura CI. Fase 0 solo local + manual test
