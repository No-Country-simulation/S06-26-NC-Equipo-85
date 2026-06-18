# App BiT — Plan de Implementación Frontend

> MVP de orientación personal para grupos sub-representados  
> Alcance: Frontend únicamente · Duración estimada: 20 semanas

---

## Stack principal

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Estilos | Tailwind CSS + shadcn/ui |
| Estado global | Zustand |
| Data fetching | TanStack Query v5 |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Documentación de componentes | Storybook 8 |
| Contenedores | Docker + docker-compose |
| Monorepo | Turborepo |
| i18n | next-intl (PT + ES) |

---

## Librerías adicionales aceptadas

| Librería | Propósito | Paquete NPM |
|---|---|---|
| Vercel AI SDK | Streaming del agente de IA en tiempo real (SSE/tokens) | `ai` |
| react-hook-form + Zod | Formularios multi-paso con validación en tiempo real | `react-hook-form` + `zod` + `@hookform/resolvers` |
| zustand/middleware/persist | Persistencia del estado del onboarding entre sesiones | incluido en `zustand` |
| TanStack Table v8 | Tablas de vacantes y cursos con filtrado, sorting y paginación | `@tanstack/react-table` |
| FullCalendar React | Agenda de mentorías con vistas semana/mes y drag-and-drop | `@fullcalendar/react` |
| react-player | Reproductor de videos de Experiencias Estructurantes (YouTube, Vimeo, HLS, MP4) | `react-player` |
| react-leaflet + plugins | Mapa de eventos Vísent CDRView con clustering y heatmap de cobertura | `react-leaflet` + `leaflet.markercluster` + `leaflet.heat` |
| next-pwa + Workbox | PWA con service worker y soporte offline | `next-pwa` |
| web-push | Notificaciones push diarias de bienestar | `web-push` |
| sonner | Toast notifications nativo shadcn | `sonner` |
| nuqs | Query params como estado (filtros de vacantes persistidos en URL) | `nuqs` |
| @t3-oss/env-nextjs | Validación de variables de entorno con Zod en build time | `@t3-oss/env-nextjs` |
| date-fns | Manejo de fechas para calendario y check-ins | `date-fns` |
| MSW (Mock Service Worker) | Mock de endpoints para tests y desarrollo offline | `msw` |
| @axe-core/react | Auditoría de accesibilidad en desarrollo (warnings en consola) | `@axe-core/react` |
| recharts | Gráficas del dashboard (gap porcentual, historial de humor) | `recharts` |
| Vitest + React Testing Library | Tests unitarios de componentes | `vitest` + `@testing-library/react` |
| Playwright | Tests end-to-end para flujos críticos | `playwright` |

---

## Estructura del monorepo (Turborepo)

```
appbit/
├── apps/
│   └── web/                  # Next.js 16 App Router
│       ├── app/
│       │   ├── (auth)/       # Onboarding y login
│       │   ├── (dashboard)/  # Dashboard principal
│       │   │   ├── formaciones/
│       │   │   ├── empleabilidad/
│       │   │   ├── mentorías/
│       │   │   ├── experiencias/
│       │   │   └── salud/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/       # Componentes locales de la app
│       ├── hooks/            # Custom hooks (useOrientar, useSalud…)
│       ├── lib/              # queryClient, api layer, utils
│       └── store/            # Zustand stores
├── packages/
│   ├── ui/                   # Librería de componentes compartidos (Storybook)
│   │   ├── src/
│   │   │   ├── atoms/        # Button, Input, Badge, Avatar, Spinner
│   │   │   ├── molecules/    # JobCard, CourseCard, MentorCard, EmojiCheckIn
│   │   │   └── organisms/    # GapProgressBar, MoodBanner, OnboardingWizard
│   │   └── .storybook/
│   ├── config/
│   │   ├── eslint/
│   │   ├── prettier/
│   │   └── typescript/
│   └── env/                  # @t3-oss/env-nextjs schemas
├── docker-compose.yml
├── Dockerfile
└── turbo.json
```

---

## Modelo de datos (contrato con el backend)

> Fuente: `ModeloEntidadRelacionV2.png`. El frontend persiste y envía los
> **valores de ENUM tal cual** (sin traducir) para que el match score, los
> filtros y la derivación CVV compartan catálogo con el backend.

### Entidades principales

| Entidad | Campos relevantes para el front |
|---|---|
| `User` | `id`, `email`, `password_hash`, `role` (`user_role`), `created_at` |
| `Profile` | `user_id`, `full_name`, `birth_date`, `gender`, `education_level`, `continent`, `state`, `country`, `city`, `latitude`, `longitude`, `whatsapp`, `professional_level`, `tech_area`, `objective` |
| `Skill` + join tables | `Skill(name, category)` y `Profile_skills`, `Job_skills`, `Course_skills`, `Experience_skills` → grafo que alimenta el **gap %** y el match score |
| `Job` | `company`, `title`, `description` (match score se calcula vía `Job_skills`) |
| `Course` | `name`, `provider`, `level` (`level_type`), `url` |
| `Experience` | `title`, `description`, `speaker_name`, `speaker_role`, `type` (`experience_type`), `content_url`, `date_time` |
| `Mentorship_sessions` | `mentor_profile_id`, `mentee_profile_id`, `schedule_date`, `status` (`session_status`), `is_practice_invitation` |
| `Mod_checkins` | `profile_id`, `emoji` (`mood_emoji`), `rating` (1-5), `context`, `suggested_action`, `derive_cvv` (Boolean), `created_at` |

### ENUMs (valores canónicos que usa el front)

| ENUM | Valores | Usado en |
|---|---|---|
| `gender_type` | `MASCULINE`, `FEMININE`, `OTHER` | Onboarding (Fase 2) |
| `education_level_type` | `SCHOOL`, `TECHNICAL`, `UNDERGRADUATE`, `POSTGRADUATE`, `SELF_TAUGHT` | Onboarding (Fase 2) |
| `level_type` | `BEGINNER`, `INTERMEDIATE`, `ADVANCED` | Onboarding + `Course.level` (Fase 3) |
| `skill_category` | `BACKEND`, `FRONTEND`, `MOBILE`, `DATA_SCIENCE`, `DESIGN_UX_UI`, `SOFT_SKILLS` | `tech_area` (Fase 2) + skills (Fase 3) |
| `user_role` | `MENTOR`, `MENTEE` | Mentorías (Fase 3) |
| `session_status` | `PENDING`, `SCHEDULED`, `COMPLETED`, `CANCELED` | Mentorías (Fase 3) |
| `experience_type` | `WORKSHOP`, `BOOTCAMP`, `WEBINAR`, `JOB_EXPERIENCE` | Experiencias (Fase 3) |
| `mood_emoji` | `HAPPY`, `DEPRESSED`, `FURIOUS`, `ANXIOUS`, `NEUTRAL` | Salud Mental (Fase 3) |

> **⚠️ Typos en el diagrama a corregir en backend:** `HIGH_SCOOL` → `SCHOOL`,
> `INTERMADIATE` → `INTERMEDIATE`. El front ya usa la grafía corregida; ambos
> lados deben quedar alineados antes de integrar.
>
> **⚠️ Tipos sospechosos en el diagrama:** `Experience.speaker_name` figura como
> `Integer` (debería ser string) y `Experience.content_url` como `Boolean`
> (debería ser string/URL). `Profile.id` es `Integer` mientras el resto es `UUID`.

### Pendientes de definición con backend

- **Skills del usuario:** el onboarding **no** captura `Profile_skills`. Sin eso,
  el gap % depende de que el backend infiera skills desde `tech_area` + nivel.
  Decidir si se agrega un paso de selección de skills al wizard.
- **`experienceSummary`:** el textarea del onboarding no tiene campo destino en
  `Profile`. Confirmar si mapea a `Mod_checkins.context` o se descarta.
- **`continent` / `state` / `latitude` / `longitude`:** hoy el front solo pide
  país y ciudad. Lat/lng se derivarán por geocoding en Fase 4; `continent`/`state`
  quedan sin capturar.

---

## Fase 0 — Foundation: infraestructura y design system

**Semanas 1–2**

### Objetivos
Tener el monorepo funcional, Docker levantado y el primer componente documentado en Storybook antes de escribir una sola pantalla de la app.

### Tareas

**Turborepo + monorepo**
- Inicializar workspace con `apps/web` y `packages/ui`, `packages/config`, `packages/env`
- Configurar ESLint, Prettier y TypeScript compartidos en `packages/config`
- Definir pipeline `build` → `lint` → `test` en `turbo.json` con caché remota

**Next.js 16 (App Router)**
- Estructura de rutas con grupos `(auth)` y `(dashboard)`
- Configurar `next-intl` para soporte PT + ES desde el inicio
- Metadata base y estructura SEO

**Docker**
- `docker-compose.yml` con hot-reload para desarrollo local
- `Dockerfile` multi-stage: `deps` → `builder` → `runner`
- Variables de entorno validadas con `@t3-oss/env-nextjs` + Zod

**Design tokens + shadcn**
- Paleta BiT definida en CSS variables en `tailwind.config.ts`
- Instalación de componentes base shadcn: Button, Input, Card, Dialog, Badge, Avatar
- Configurar `sonner` como sistema de toasts global

### Stack activo en esta fase
`turborepo` · `next@14` · `next-intl` · `docker-compose` · `shadcn/ui` · `@t3-oss/env-nextjs` · `sonner`

### Entregable
Monorepo funcional, `docker compose up` levanta la app, primer átomo publicado en Storybook.

---

## Fase 1 — Storybook + componentes atómicos

**Semanas 3–4**

### Objetivos
Construir la librería de componentes documentada antes de cualquier pantalla. Todo componente que se use en la app debe vivir en `packages/ui` con su story.

### Tareas

**Storybook 8 setup**
- Addon `@storybook/addon-a11y` para auditoría de accesibilidad por componente
- Addon `@storybook/addon-interactions` para tests de interacción dentro de Storybook
- Decorators con `ThemeProvider` e i18n aplicados globalmente
- Integración con Chromatic para visual regression (opcional en esta fase)

**Átomos — `packages/ui/src/atoms`**
- `Button` — variantes: primary, secondary, ghost, destructive
- `Input` — con estados error/success y mensajes accesibles (`aria-describedby`)
- `Badge` — para etiquetas de nivel, área, estado
- `Avatar` — con fallback de iniciales
- `Spinner` — para estados de carga
- `EmojiCheckIn` — selector de estado emocional alineado al ENUM `mood_emoji`
  del backend: `HAPPY`, `DEPRESSED`, `FURIOUS`, `ANXIOUS`, `NEUTRAL` (labels en
  ES/PT vía i18n, valor enviado = enum). Animación Framer Motion

**Moléculas — `packages/ui/src/molecules`**
- `JobCard` — vacante con match score, área y CTA
- `CourseCard` — curso con proveedor (Google/Oracle), nivel y estado
- `MentorCard` — mentor con disponibilidad y botón de agendar
- `MoodBanner` — banner diario de salud mental basado en estado del check-in
- `NotificationToast` — wrapper de `sonner` con variantes de la app

**Zustand stores — `apps/web/store`**
- `userStore` — perfil completo, estado del onboarding, token
- `uiStore` — tema, locale, estado del sidebar, modal activo
- `healthStore` — estado del check-in diario, historial semanal, alerta CVV

### Stack activo en esta fase
`storybook@8` · `zustand` · `zustand/middleware/persist` · `framer-motion` · `lucide-react` · `sonner` · `@axe-core/react`

### Entregable
Librería de componentes documentada y publicada, stores configurados, `@axe-core/react` emitiendo warnings en dev.

---

## Fase 2 — Onboarding + flujo de perfil

**Semanas 5–8**

### Objetivos
El usuario puede crear su cuenta, completar su perfil personal y profesional en un wizard multi-paso, y recibir su primera orientación del endpoint `/orientar`.

### Tareas

**Wizard de onboarding (3 pasos)**
- Paso 1: datos personales — nombre, e-mail, fecha de nacimiento, género, **nivel educativo**, país, ciudad, WhatsApp
- Paso 2: perfil profesional — nivel, área de tecnología, objetivo (estudiar / definir camino / buscar empleo / cambiar empleo)
- Paso 3: confirmación y bienvenida personalizada

**Alineación de valores con ENUMs del backend** (ver _Modelo de datos_)
- `gender` → `gender_type` (MASCULINE/FEMININE/OTHER). La UI mantiene **5 labels
  inclusivos**; `no-binario`, `prefiero-no-decir` y `otro` se reducen a `OTHER`
  vía `apiValue` al enviar (mapeo en `onboarding-options.ts` → `resolveApiValue`).
- `educationLevel` → `education_level_type` (campo nuevo en el wizard).
- `techLevel` → `professional_level` (`level_type`: BEGINNER/INTERMEDIATE/ADVANCED).
- `techArea` → `skill_category` (BACKEND/FRONTEND/MOBILE/DATA_SCIENCE/DESIGN_UX_UI/SOFT_SKILLS).
- `objective` → string libre en backend; se mantienen opciones acotadas en la UI.
- El `value` de cada opción **es el enum** salvo género; los labels en ES/PT
  salen de i18n.

**react-hook-form + Zod**
- Schema Zod separado por paso para validación progresiva
- `@hookform/resolvers/zod` como resolver
- Mensajes de error accesibles con `aria-describedby` en cada campo
- Persistencia del estado del wizard con `zustand/middleware/persist` (si el usuario cierra y vuelve, retoma donde dejó)

**TanStack Query — capa API**
- `QueryClientProvider` global en `app/providers.tsx`
- Hooks: `useProfile`, `useUpdateProfile`, `useOrientar`
- Optimistic updates en la mutation de guardado de perfil
- Manejo de errores con `sonner` toast

**Animaciones de transición (Framer Motion)**
- `AnimatePresence` entre pasos del wizard (slide horizontal)
- Progress bar animada que refleja el paso actual
- Micro-interacciones en inputs (shake en error, check en válido)

**Integración con `/orientar`**
- Al completar el perfil, llamada a `POST /orientar` con perfil completo
- Visualizar respuesta: gap porcentual, trayectoria sugerida, vacantes compatibles

### Stack activo en esta fase
`react-hook-form` · `zod` · `@hookform/resolvers` · `@tanstack/react-query` · `framer-motion` · `nuqs` · `zustand/middleware/persist`

### Entregable
Onboarding completo e integrado con endpoint `/orientar`. El usuario ve su gap porcentual al terminar.

---

## Fase 3 — Dashboard principal: los 5 servicios

**Semanas 9–12**

### Objetivos
Implementar las cinco dimensiones del MVP navegables desde el dashboard: Formaciones, Empleabilidad, Experiencias, Mentorías y Salud Mental.

### Tareas

**Home / dashboard**
- Gap porcentual animado con `recharts` (gráfica de dona o progress ring)
- Resumen de vacantes compatibles (top 3)
- Trayectoria sugerida con timeline visual (Framer Motion)
- Historial de estado emocional de la semana (sparkline con `recharts`)

**Módulo Formaciones** (`Course` + `Course_skills`)
- Grid de cursos con filtros por proveedor, nivel y área
- Nivel = `level_type` (BEGINNER/INTERMEDIATE/ADVANCED); área vía `skill_category`
- `@tanstack/react-table` para tabla densa de cursos con sorting y paginación
- `nuqs` para persistir filtros activos en la URL
- `react-player` para preview de cursos con video (campo `Course.url`)

**Módulo Empleabilidad** (`Job` + `Job_skills`)
- Lista de vacantes con match score y gap breakdown
- **Match score = intersección `Profile_skills` ∩ `Job_skills`** (lo calcula el
  backend; el front lo renderiza). Filtros por `skill_category`
- `@tanstack/react-table` para tabla filtrable
- Detalle de vacante: checklist de requisitos con indicador cumplido/pendiente
- CTA contextual: "Falta esto → ver curso sugerido" (cruza `Job_skills` faltantes
  con `Course_skills`)

**Módulo Experiencias Estructurantes** (`Experience` + `Experience_skills`)
- Feed de testimonios en video (CEOs, líderes, profesionales): `title`,
  `speaker_name`, `speaker_role`, `content_url`, `date_time`
- `type` = `experience_type` (WORKSHOP/BOOTCAMP/WEBINAR/JOB_EXPERIENCE)
- `react-player` soportando YouTube, Vimeo y MP4 (campo `content_url`)
- Filtro por `skill_category` (vía `Experience_skills`) y por `type`

**Módulo Mentorías** (`Mentorship_sessions`)
- Lista de mentores disponibles (perfiles con `user_role = MENTOR`); el usuario
  agenda como `MENTEE` (`mentor_profile_id` / `mentee_profile_id`)
- Estado de la cita = `session_status` (PENDING/SCHEDULED/COMPLETED/CANCELED)
- Flag `is_practice_invitation` para distinguir sesiones de práctica
- `@fullcalendar/react` para visualizar y agendar slots (`schedule_date`)
- Vista semana con drag-and-drop de citas
- Confirmación de agenda con toast (`sonner`)

**Módulo Salud Mental** (`Mod_checkins`)
- `EmojiCheckIn` diario al entrar a la app (componente de Fase 1) → `emoji`
  (`mood_emoji`) + `rating` (1-5)
- Integración con `POST /salud` — la respuesta trae `suggested_action` y `context`
  del agente
- **Derivación CVV la decide el backend** vía el campo booleano `derive_cvv`
  (ya no es un cálculo de `nota_semanal < 4` en el front). Si `derive_cvv === true`
  → modal urgente de derivación al CVV (no dismissable por click fuera)
- Historial semanal con gráfica de línea (`recharts`) sobre `rating`/`created_at`
- Agente de IA con `ai` (Vercel AI SDK) para respuestas en streaming

### Stack activo en esta fase
`recharts` · `@tanstack/react-table` · `@fullcalendar/react` · `react-player` · `ai` (Vercel AI SDK) · `framer-motion` · `nuqs`

### Entregable
Dashboard funcional con los 5 módulos navegables, agente de IA respondiendo en streaming, derivación CVV operativa.

---

## Fase 4 — Geolocalización + PWA + offline

**Semanas 13–16**

### Objetivos
Integrar el dataset Vísent CDRView para mostrar eventos cercanos, convertir la app en PWA instalable y garantizar acceso a contenido en zonas con baja conectividad.

### Tareas

**Dataset Vísent CDRView — mapa de eventos**
- `react-leaflet` con tiles OpenStreetMap
- Clustering automático de markers con `leaflet.markercluster` (evita colapso visual con muchos puntos)
- Heatmap de cobertura 5G/4G/3G con `leaflet.heat`
- Filtro de eventos por tipo de conectividad disponible en la zona
- Si cobertura es baja → agente sugiere automáticamente contenido offline

**PWA + Service Worker**
- `next-pwa` con estrategias Workbox:
  - `CacheFirst` para assets estáticos
  - `NetworkFirst` para datos de la API
  - `StaleWhileRevalidate` para imágenes de cursos y mentores
- Web App Manifest con íconos BiT, `theme_color` y `display: standalone`
- Descarga offline de recursos sugeridos (cursos, PDFs) desde el perfil del usuario

**Notificaciones push**
- Suscripción Web Push API desde el navegador
- `web-push` en el servidor para envío de notificaciones
- Notificación diaria de bienestar a las 9am
- Recordatorio de check-in si el usuario no lo completó antes de las 8pm
- Derivación urgente CVV via push si el sistema detecta alerta

**Performance**
- Route-based code splitting automático con App Router
- `next/image` con `priority` en imágenes above-the-fold
- Bundle analyzer: `@next/bundle-analyzer`
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms como metas

### Stack activo en esta fase
`react-leaflet` · `leaflet.markercluster` · `leaflet.heat` · `next-pwa` · `workbox` · `web-push` · `date-fns`

### Entregable
App instalable como PWA, funcional offline, mapa de eventos con cobertura activo.

---

## Fase 5 — QA, accesibilidad y deploy

**Semanas 17–20**

### Objetivos
Garantizar calidad, accesibilidad WCAG 2.1 AA y deploy continuo en producción antes del cierre del hackathon.

### Tareas

**Testing unitario e integración**
- `Vitest` como test runner (compatible con Vite/Next.js, más rápido que Jest)
- `@testing-library/react` para renderizado y assertions de componentes
- `MSW` para mock de endpoints `/orientar` y `/salud` en tests y desarrollo
- Cobertura mínima objetivo: 80% en componentes críticos (EmojiCheckIn, GapProgressBar, CVV modal)

**Tests end-to-end (Playwright)**
- Flujo completo de onboarding (crear cuenta → completar perfil → ver gap)
- Check-in de salud mental con nota < 4 → verificar aparición de modal CVV
- Agenda de mentoría: seleccionar mentor → elegir slot → confirmar
- Tests en Chromium, Firefox y WebKit

**Accesibilidad (WCAG 2.1 AA)**
- `@axe-core/react` activo en desarrollo desde Fase 1 (ya no hay deuda acumulada)
- Auditoría manual de navegación completa por teclado (Tab, Enter, Escape, flechas)
- Pruebas con screen reader: NVDA (Windows) y VoiceOver (macOS/iOS)
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Foco visible en todos los elementos interactivos

**CI/CD (GitHub Actions)**
- Pipeline por PR: `lint` → `typecheck` → `test:unit` → `test:e2e` → `build` → `storybook:build`
- Deploy automático a Railway o Render en merge a `main`
- Preview deploys por PR (Vercel opcional)
- Lighthouse CI en cada deploy con umbrales: Performance ≥ 85, Accessibility ≥ 95

**Monitoreo en producción**
- `@sentry/nextjs` para error tracking con source maps
- Web Vitals reporting a analytics
- Alertas de Sentry para cualquier error en el flujo CVV (crítico)

### Stack activo en esta fase
`vitest` · `@testing-library/react` · `playwright` · `msw` · `@axe-core/react` · `@sentry/nextjs` · `github-actions`

### Entregable
MVP en producción, cobertura de tests ≥ 80%, score Lighthouse ≥ 85, accesibilidad WCAG 2.1 AA verificada.

---

## Resumen de timeline

| Fase | Semanas | Foco principal | Entregable clave |
|---|---|---|---|
| 0 | 1–2 | Infraestructura y design system | Monorepo + Docker + design tokens |
| 1 | 3–4 | Componentes atómicos + Storybook | Librería UI documentada |
| 2 | 5–8 | Onboarding + perfil + `/orientar` | Wizard completo + gap porcentual |
| 3 | 9–12 | Dashboard + 5 módulos + agente IA | App navegable con todos los servicios |
| 4 | 13–16 | Mapa + PWA + push + offline | App instalable + eventos geolocalizados |
| 5 | 17–20 | QA + accesibilidad + deploy | MVP en producción |

---

## Decisiones de arquitectura clave

**1. App Router de Next.js 16**  
Layouts anidados para compartir estado de autenticación y onboarding sin prop-drilling. Server Components para fetching inicial de datos sin TanStack Query (solo en SSR); Client Components para interactividad y subscripciones en tiempo real.

**2. TanStack Query como capa de sincronización**  
Todo dato del servidor pasa por TanStack Query. Zustand solo maneja estado local de UI (no hay duplicación de estado servidor/cliente). Las mutations usan `onMutate` para optimistic updates en acciones frecuentes (guardar perfil, hacer check-in).

**3. Zustand con persist para onboarding**  
El wizard de onboarding persiste en localStorage para que el usuario no pierda progreso si cierra el browser antes de completarlo. El store se hidrata en el lado cliente evitando errores de hidratación con Next.js.

**4. MSW en dos contextos**  
En desarrollo local (sin backend disponible) y en tests de Playwright/Vitest. Los handlers se comparten entre ambos contextos desde `src/mocks/handlers.ts`.

**5. Derivación CVV es la feature más crítica**  
El modal de crisis se dispara cuando el backend marca `Mod_checkins.derive_cvv = true`
(la lógica de umbral vive en el backend, no en el front). Debe tener cobertura de
test del 100%, no puede ser dismissable accidentalmente, y cualquier error en su
renderizado debe disparar una alerta de Sentry inmediatamente.

---

## Variables de entorno requeridas

```env
# API
NEXT_PUBLIC_API_URL=

# Agente IA (Vercel AI SDK)
ANTHROPIC_API_KEY=

# Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Geolocalización
NEXT_PUBLIC_MAPBOX_TOKEN=   # Alternativa a OpenStreetMap si se necesita estilos custom
```

> **Nunca subir credenciales al repositorio.** Usar `.env.local` para desarrollo y las variables de entorno del servicio de deploy (Railway/Render) para producción.
