# App BiT — Design System "Amanecer"

> Fusión de las propuestas Raíz (armonía análoga cálida) y Horizonte (complementaria dividida)
> 10 colores · dominante cálida · cada color asignado a una sensación/emoción

---

## Concepto

La paleta recorre un amanecer: la noche azul (Horizonte) cediendo ante la terracota, el coral y el ámbar del alba (Raíz), sobre una base de arena y crema. La metáfora conecta directamente con la misión del producto: cada check-in diario es un nuevo comienzo, y la app acompaña el paso de la incertidumbre (azul, calma, sostén) hacia la acción y la oportunidad (cálidos, energía, avance).

---

## Fundamento de teoría del color

**Estructura armónica: análoga cálida con acento complementario.**

Los colores de marca cálidos ocupan un segmento análogo contiguo del círculo cromático (~12° a ~45°: terracota, coral, ámbar). El azul horizonte (~222°) se sitúa casi exactamente en el complemento de ese segmento, actuando como contrapunto frío único. Esta estructura tiene dos efectos:

1. **Cohesión sin monotonía** — la base análoga garantiza que la interfaz se sienta unificada y serena (mínima tensión entre tonos vecinos), mientras el complementario introduce el contraste justo donde se necesita.
2. **El azul gana poder por escasez** — al ser el único color frío, cada aparición del azul se percibe con más peso. Por eso se reserva para los momentos de confianza y calma: el agente de salud mental, las mentorías, la privacidad.

**Regla de proporción 60 · 30 · 10:**

| Proporción | Familia | Función emocional |
|---|---|---|
| 60% | Neutros cálidos (crema, arena, cacao, topo) | Ambiente: seguridad, acogida, descanso visual |
| 30% | Marca cálida (terracota, coral, ámbar) | Identidad y acción: energía humana, avance |
| 10% | Contrapunto frío + semánticos (azul, oliva, granate) | Calma, estados y protección |

---

## Los 10 colores — mapeo emocional

| # | Color | Hex | Emoción / sensación | Rol | Uso en la app |
|---|---|---|---|---|---|
| 1 | **Terracota** | `#A8442A` | Pertenencia · calidez — "estás en casa" | Primario | Botones primarios, navegación activa, identidad de marca |
| 2 | **Coral** | `#CC4A2E` | Motivación · impulso — energía para actuar | Acento de acción | CTAs clave ("Cerrar el gap", "Registrar check-in"), progreso activo |
| 3 | **Ámbar** | `#D98E32` | Optimismo · logro — celebrar avances | Logro / warning suave | Badges de match (70%), hitos de trayectoria, gamificación |
| 4 | **Azul horizonte** | `#2C4E9E` | Confianza · calma — sostén emocional | Contrapunto frío | Módulo de salud mental, mensajes del agente IA, mentorías, privacidad |
| 5 | **Verde oliva** | `#5F7E3F` | Crecimiento · esperanza — progreso real | Éxito | Skills adquiridos, cursos completados, confirmaciones |
| 6 | **Granate** | `#9E2235` | Protección · urgencia — cuidado inmediato | Crítico | **Exclusivo** del flujo CVV y errores críticos |
| 7 | **Arena** | `#EFDFC4` | Serenidad · abrigo — descanso visual | Fondo suave | Fondos de tarjetas destacadas, secciones de bienestar |
| 8 | **Crema** | `#FAF1E6` | Acogida · respiro — espacio seguro | Fondo base | Fondo general de toda la app |
| 9 | **Cacao** | `#2B1E16` | Solidez · arraigo — voz estable | Texto principal | Titulares y cuerpo de texto |
| 10 | **Topo** | `#7A6557` | Equilibrio · discreción — jerarquía silenciosa | Texto secundario | Texto de apoyo, iconos inactivos, bordes |

Cada color de marca y semántico tiene una variante *soft* (tinte ~15% del mismo tono) para fondos de chips, bubbles y estados hover. No cuentan como colores adicionales — son el mismo tono desaturado:

| Color | Soft |
|---|---|
| Terracota | `#F4DCCB` |
| Coral | `#FBE2DA` |
| Ámbar | `#F6E3C0` |
| Azul horizonte | `#DDE7F8` |
| Verde oliva | `#E4ECD7` |
| Granate | `#F7DDE1` |

---

## Accesibilidad — contrastes verificados (WCAG 2.1)

Todos los pares de uso real cumplen AA. El coral original de Horizonte (`#D85537`, 4.0:1) fue oscurecido a `#CC4A2E` para superar el umbral de 4.5:1 con texto blanco.

| Par de uso | Ratio | Nivel |
|---|---|---|
| Terracota / blanco | 5.9:1 | AA texto normal |
| Coral / blanco | 4.6:1 | AA texto normal |
| Azul horizonte / blanco | 7.8:1 | AAA |
| Verde oliva / blanco | 4.6:1 | AA texto normal |
| Granate / blanco | 7.7:1 | AAA |
| Cacao / crema | 14.4:1 | AAA |
| Topo / crema | 4.9:1 | AA texto normal |
| Cacao oscuro (`#4A2B10`) / ámbar | 4.8:1 | AA texto normal |

**Reglas duras:**
- El ámbar **nunca** lleva texto blanco — siempre texto oscuro de su propia familia (`#4A2B10`).
- Arena y crema son exclusivamente fondos; nunca texto.
- Verificar cualquier par nuevo con la auditoría `@axe-core/react` ya prevista desde Fase 1.

---

## Aplicación por módulo (los 5 servicios)

| Módulo | Colores dominantes | Razonamiento emocional |
|---|---|---|
| Onboarding | Crema + terracota + ámbar | Acogida desde el primer segundo; el avance del wizard se celebra en ámbar |
| Formaciones | Ámbar + verde oliva | El aprendizaje como logro; lo completado florece en verde |
| Empleabilidad | Terracota + coral + ámbar | El módulo de mayor acción: gap, match y CTA viven aquí |
| Mentorías | Azul horizonte + terracota | Confianza primero (azul), conexión humana después (terracota) |
| Experiencias | Terracota + arena | Historias contadas en tono cálido, sin estridencia |
| Salud mental | Azul horizonte dominante + crema | El único módulo donde el frío domina: aquí se viene a calmarse, no a actuar |

---

## Regla especial — flujo CVV

El granate `#9E2235` está **reservado exclusivamente** para el modal de crisis y errores críticos:

- Ningún otro componente de la app puede usar granate (ni botones, ni badges, ni decoración).
- El modal CVV usa granate + blanco + crema únicamente — sin colores de marca que distraigan.
- Razonamiento: al mantener el granate fuera del lenguaje visual cotidiano, su aparición señala inequívocamente "esto es serio" sin necesidad de texto adicional. La distinción cromática respecto a terracota (ladrillo apagado, matiz ~15°) y coral (naranja saturado) es clara: el granate es un carmesí profundo (~350°) con el doble de contraste (7.7:1).

---

## Especificación de vistas y componentes

> Inventario completo de pantallas del MVP, derivado del [plan de frontend](appbit-frontend-plan.md)
> y el [plan de backend](appbit-backend-plan.md). Cada vista indica su ruta, los
> endpoints que consume, sus **cards y filtros**, y la **aplicación cromática**
> según la tabla _Aplicación por módulo (los 5 servicios)_.
>
> **Regla de flujo (backend):** la cuenta (`User`) se crea con `POST /auth/register`
> **antes** del onboarding; el wizard solo completa el `Profile` vía `PUT /perfil`
> (requiere JWT). El orden es **Registro → Onboarding**, nunca al revés.

### Índice de vistas (13)

| # | Vista | Ruta (`/[locale]/…`) | Grupo | Fase | Endpoints | Paleta dominante |
|---|---|---|---|---|---|---|
| 1 | Landing pública | `/` | `(public)` | 0 | — | crema · terracota · ámbar |
| 2 | Registro | `/register` | `(auth)` | 2 | `POST /auth/register` → `POST /auth/login` | crema · terracota |
| 3 | Login | `/login` | `(auth)` | 2 | `POST /auth/login` · `POST /auth/refresh` | crema · terracota |
| 4 | Onboarding (wizard 3 pasos) | `/onboarding` | `(onboarding)` | 2 | `GET/PUT /perfil` · `POST /orientar` | crema · terracota · ámbar |
| 5 | Dashboard / Home | `/dashboard` | `(dashboard)` | 3 | `GET /perfil` · `POST /orientar` · `GET /salud/historial` | crema base · coral · ámbar · azul |
| 6 | Formaciones | `/dashboard/formaciones` | `(dashboard)` | 3 | `GET /cursos` | ámbar · oliva |
| 7 | Empleabilidad (listado) | `/dashboard/empleabilidad` | `(dashboard)` | 3 | `GET /vacantes` | terracota · coral · ámbar |
| 8 | Detalle de vacante | `/dashboard/empleabilidad/[id]` | `(dashboard)` | 3 | `GET /vacantes/{id}` · `GET /cursos` | terracota · coral · ámbar · oliva |
| 9 | Experiencias | `/dashboard/experiencias` | `(dashboard)` | 3 | `GET /experiencias` | terracota · arena |
| 10 | Mentorías | `/dashboard/mentorias` | `(dashboard)` | 3 | `GET /mentores` · `POST /mentores/{id}/agendar` | azul horizonte · terracota |
| 11 | Salud Mental | `/dashboard/salud` | `(dashboard)` | 3 | `POST /salud` · `GET /salud/historial` · `POST /salud/stream` | azul horizonte · crema |
| 12 | Mapa de eventos | `/dashboard/eventos` | `(dashboard)` | 4 | `GET /eventos` · `POST /push/suscribir` | terracota · arena · semáforo cobertura |
| 13 | Perfil / Configuración | `/dashboard/perfil` | `(dashboard)` | 3 | `GET/PUT /perfil` | crema · terracota · oliva |

### Flujo de navegación

```
Landing ──► Registro ──(auto-login)──► Onboarding (3 pasos) ──► /orientar
   │            │                            │                      │
   └──► Login ──┴── perfil completo ─────────┴──────────────────► Dashboard
                                                                     │
            ┌──────────┬──────────┬──────────┬──────────┬───────────┤
        Formaciones Empleabilidad Experiencias Mentorías  Salud   Eventos / Perfil
                         │
                    Detalle vacante
```

---

### Componentes transversales (cross-cutting)

| Componente | Capa | Descripción | Paleta |
|---|---|---|---|
| `AppShell` | organism | Layout del dashboard: **sidebar** en desktop, **bottom-nav** (5 íconos) en mobile, área de contenido | crema base · terracota (item activo) |
| `Topbar` | molecule | Logo, selector de idioma (ES/PT), avatar con menú, indicador de check-in pendiente | crema · cacao · ámbar (badge pendiente) |
| `CvvModal` | organism | Modal de crisis **no dismissable** (sin cerrar por click-fuera ni Escape). Se dispara con `derive_cvv === true`. Botón directo a línea CVV | **granate exclusivo** + blanco + crema |
| `CheckinModal` | organism | Check-in diario al entrar a la app; envuelve `EmojiCheckIn` (5 estados `mood_emoji`) + nota 1-5 | azul horizonte · crema |
| `MoodBanner` | molecule | Banner del estado emocional del día, con `accion_sugerida` del agente | azul-soft · crema |
| `GapRing` / `GapProgressBar` | organism | Anillo/barra animada del gap porcentual (`recharts` + Framer Motion) | track arena · progreso coral · meta ámbar |
| `NotificationToast` | molecule | Wrapper de `sonner`; variantes success (oliva), info (azul), warning (ámbar), error (granate **solo** crítico) | semánticos |
| `Spinner` / `Skeleton` | atom | Estados de carga; skeletons con tono arena | arena · topo |
| `EmptyState` | molecule | Vacío ilustrado + CTA (sin resultados, sin datos aún) | crema · topo · terracota (CTA) |

> El `granate` aparece **únicamente** en `CvvModal` y en el toast de error crítico.
> Ningún otro componente transversal puede usarlo (ver _Regla especial — flujo CVV_).

---

### Catálogo de cards

Anatomía de cada card reutilizable (viven en `packages/ui/src/molecules`):

| Card | Usada en | Anatomía | Acento / color |
|---|---|---|---|
| `ServiceCard` | Dashboard | Ícono + título + descripción corta + flecha; una por módulo | borde/acento del color del módulo destino |
| `StatCard` | Dashboard, Perfil | Métrica grande + label + delta opcional | crema · cacao · delta en oliva/coral |
| `JobCard` | Empleabilidad, Dashboard (top 3) | Título, empresa, `MatchBadge`, `AreaBadge`, nº de skills faltantes, CTA "Ver detalle" | terracota (título) · ámbar (match) · coral (CTA) |
| `CourseCard` | Formaciones, Detalle vacante (sugeridos) | Thumbnail/preview, `ProviderBadge` (GEAR/ONE), `LevelBadge`, `AreaBadge`, estado (completado), CTA "Ver curso" | ámbar (nivel) · oliva (completado) |
| `MentorCard` | Mentorías | Avatar, nombre, área, bio corta, `StatusBadge` de disponibilidad, CTA "Agendar práctica" | azul horizonte (confianza) · terracota (CTA) |
| `ExperienceCard` | Experiencias | Thumbnail de video, `speaker_name`, `speaker_role`, `TypeBadge` (`experience_type`), área | terracota · arena (fondo) |
| `EventCard` | Mapa de eventos | Título, fecha (`date-fns`), distancia, `CoverageBadge`, CTA "Ver en mapa" | arena (fondo) · semáforo cobertura |
| `CheckinHistoryCard` | Salud, Dashboard | Sparkline semanal de `rating` (`recharts`) + emoji del día | azul-soft · crema |

---

### Catálogo de badges y chips

Todos derivan del átomo `Badge`. Los que mapean a un ENUM del backend usan su valor como fuente de verdad:

| Badge | Fuente (enum/campo) | Valores → estilo |
|---|---|---|
| `MatchBadge` | `matchScore` (0-100) | Fondo **ámbar** + texto cacao `#4A2B10` (ámbar nunca con texto blanco). ≥70% resaltado |
| `LevelBadge` | `level_type` | `BEGINNER` arena · `INTERMEDIATE` terracota-soft · `ADVANCED` terracota |
| `AreaBadge` | `skill_category` | Chip terracota-soft con texto cacao; ícono por área (`BACKEND`, `FRONTEND`, `MOBILE`, `DATA_SCIENCE`, `DESIGN_UX_UI`, `SOFT_SKILLS`) |
| `StatusBadge` | `session_status` | `PENDING` ámbar-soft · `SCHEDULED` azul-soft · `COMPLETED` oliva-soft · `CANCELED` arena/topo |
| `TypeBadge` | `experience_type` | `WORKSHOP` · `BOOTCAMP` · `WEBINAR` · `JOB_EXPERIENCE` → chips terracota-soft con ícono |
| `ProviderBadge` | `Course.provider` | GEAR (Google Cloud) / ONE (Oracle & Alura) con logo + tono neutro arena |
| `CoverageBadge` | nivel de cobertura | **alta** oliva · **media** ámbar · **baja** coral (nunca granate — reservado a CVV) |
| `SkillChip` | `Skill` | Chip seleccionable; adquirido = oliva-soft, faltante = arena |

---

### Patrón de filtros (`FilterBar`)

Componente `FilterBar` reutilizable para las vistas de listado (Formaciones, Empleabilidad, Experiencias, Mentorías, Eventos):

- **Persistencia en URL con `nuqs`** — cada filtro es un query param (`?area=FRONTEND&nivel=BEGINNER`), compartible y restaurable al volver.
- **Layout:** fila de `Select`/chips en desktop; `Sheet` (drawer) "Filtros" en mobile con contador de filtros activos.
- **Chips de filtros activos** removibles individualmente + "Limpiar todo".
- **Estilo:** controles sobre crema, chip activo en terracota-soft, foco visible siempre.

| Vista | Filtros | Orden / extra |
|---|---|---|
| Formaciones | `proveedor` (GEAR/ONE) · `nivel` (`level_type`) · `área` (`skill_category`) · estado (completado) | sort por nivel; búsqueda por nombre |
| Empleabilidad | `área` (`skill_category`) · match mínimo (slider) · objetivo | **sort por match score desc** (default) |
| Experiencias | `área` (`skill_category`) · `tipo` (`experience_type`) | feed/grid; sort por `date_time` |
| Mentorías | `área` · disponibilidad (hoy/semana) | toggle lista ↔ calendario |
| Eventos | tipo de conectividad (`CoverageBadge`) · radio (km) · tipo de evento | radio como slider; geo del usuario |

---

### Vistas — detalle

#### 1 · Landing pública — `/`
- **Objetivo:** presentar BiT y derivar a Registro/Login.
- **Estructura:** hero (claim + CTA "Crear cuenta" / "Ingresar"), bloque de los 5 servicios (`ServiceCard` informativas), prueba social, footer con selector de idioma.
- **Estados:** estática (SSG). Sin estados de datos.
- **Paleta:** crema base, hero en terracota, hitos/CTA secundario en ámbar. Proporción 60-30-10 estricta.

#### 2 · Registro — `/register` · `(auth)`
- **Objetivo:** crear la cuenta (`User`: email + password) antes del onboarding.
- **Componentes:** `Input` (email, password, confirmar password) con `aria-describedby`; medidor de fuerza de contraseña; checkbox de términos; `Button` primario "Crear cuenta"; link a `/login`.
- **Lógica:** `POST /auth/register` → en éxito, `POST /auth/login` automático → guarda JWT (token en `userStore`) → redirige a `/onboarding`.
- **Estados:** loading (spinner en botón), error inline (email ya existe → granate **solo** en el mensaje de error de campo, no decorativo), éxito (redirección).
- **Nota de alcance:** `User.rol` por defecto `MENTEE`; el alta de `MENTOR` es flujo aparte (a confirmar con backend).
- **Paleta:** crema + terracota (acogida). Sin ámbar de celebración aún.

#### 3 · Login — `/login` · `(auth)`
- **Objetivo:** autenticar usuarios existentes.
- **Componentes:** `Input` (email, password), "¿Olvidaste tu contraseña?", `Button` "Ingresar", link a `/register`.
- **Lógica:** `POST /auth/login` → JWT → si el `Profile` está incompleto va a `/onboarding`, si no a `/dashboard`. `POST /auth/refresh` para renovar token.
- **Estados:** loading, error de credenciales (mensaje accesible), rate-limit (back aplica Bucket4j → mostrar "demasiados intentos").
- **Paleta:** crema + terracota.

#### 4 · Onboarding — `/onboarding` · `(onboarding)`
- **Objetivo:** completar el `Profile` (personal + profesional) y disparar la primera orientación.
- **Organism:** `OnboardingWizard` (3 pasos, una sola ruta, estado en `userStore` con `persist`).
  - **Paso 1 · Datos personales:** nombre, fecha de nacimiento, `género` (`gender_type`, 5 labels → 3 valores), `nivel educativo` (`education_level_type`), país, ciudad, WhatsApp. *(El email ya viene del Registro — no se vuelve a pedir.)*
  - **Paso 2 · Perfil profesional:** `nivel` (`level_type`), `área` (`skill_category`), `objetivo`, resumen opcional.
  - **Paso 3 · Confirmación:** resumen accesible + bienvenida personalizada.
- **Componentes:** `OnboardingProgress` (barra animada, ámbar), `Select`/`Input` con validación Zod progresiva, `AnimatePresence` (slide horizontal), micro-interacciones (shake en error, check oliva en válido).
- **Lógica:** `PUT /perfil` (autenticado) al avanzar/confirmar → `POST /orientar` al finalizar → muestra gap % y redirige al dashboard.
- **Estados:** validación por paso, guardado optimista, error de red (toast), retomar progreso desde `persist`.
- **Paleta:** crema (acogida) + terracota (acción) + **ámbar para celebrar el avance** del wizard.

#### 5 · Dashboard / Home — `/dashboard`
- **Objetivo:** foto del progreso y acceso a los 5 servicios.
- **Estructura / cards:**
  - `GapRing` — gap porcentual animado (dona/anillo, coral sobre track arena).
  - `JobCard` ×3 — top vacantes compatibles (resumen).
  - **Trayectoria sugerida** — timeline visual (Framer Motion) con hitos en ámbar.
  - `CheckinHistoryCard` — sparkline emocional de la semana (azul-soft).
  - Grilla de `ServiceCard` ×5 (Formaciones, Empleabilidad, Experiencias, Mentorías, Salud).
- **Lógica:** `GET /perfil`, resultado de `/orientar` (cacheado por TanStack Query), `GET /salud/historial`. Si hay check-in pendiente → abre `CheckinModal`.
- **Estados:** skeletons por card, empty ("Completá tu primer check-in"), error por sección sin tumbar la página.
- **Paleta:** crema base; gap en coral/ámbar; bloque de bienestar en azul. Mezcla equilibrada 60-30-10.

#### 6 · Formaciones — `/dashboard/formaciones`
- **Objetivo:** explorar cursos gratuitos (GEAR/ONE) para cerrar skills.
- **Cards / componentes:** grid de `CourseCard`; `FilterBar` (proveedor, nivel, área, completado); `@tanstack/react-table` para vista tabla densa con sorting/paginación; `react-player` en modal de preview.
- **Lógica:** `GET /cursos` con filtros; `nuqs` sincroniza filtros en URL.
- **Estados:** loading (skeleton de cards), empty ("Sin cursos para estos filtros" + limpiar), error.
- **Paleta:** ámbar (aprendizaje) + **verde oliva** para lo completado (florece en verde).

#### 7 · Empleabilidad (listado) — `/dashboard/empleabilidad`
- **Objetivo:** vacantes ordenadas por compatibilidad con gap breakdown.
- **Cards / componentes:** lista/tabla de `JobCard` con `MatchBadge`; `@tanstack/react-table` (filtrable, sortable); `FilterBar` (área, match mínimo, objetivo); sort por match desc por defecto.
- **Lógica:** `GET /vacantes` (match = `Profile_skills` ∩ `Job_skills`, lo calcula el backend).
- **Estados:** loading, empty ("Aún no hay vacantes compatibles — subí tu match con estos cursos" → link a Formaciones), error.
- **Paleta:** terracota + coral + ámbar — **el módulo de mayor acción**.

#### 8 · Detalle de vacante — `/dashboard/empleabilidad/[id]`
- **Objetivo:** ver requisitos y el camino concreto para cerrarlos.
- **Estructura:** header (título, empresa, `MatchBadge`, `AreaBadge`), **checklist de requisitos** (`SkillChip`: cumplido oliva / faltante arena), `CourseCard` sugeridos por cada skill faltante, CTA "Falta esto → ver curso".
- **Lógica:** `GET /vacantes/{id}` + cruce de skills faltantes con `GET /cursos` (`Course_skills`).
- **Estados:** loading, 404 (vacante inexistente), error.
- **Paleta:** terracota + coral + ámbar; requisitos cumplidos en oliva.

#### 9 · Experiencias Estructurantes — `/dashboard/experiencias`
- **Objetivo:** feed de testimonios en video que inspiran trayectorias.
- **Cards / componentes:** grid de `ExperienceCard`; `react-player` (YouTube/Vimeo/MP4) en modal o inline; `FilterBar` (área, `experience_type`).
- **Lógica:** `GET /experiencias` con filtros.
- **Estados:** loading (skeleton thumbnails), empty, error de carga de video (fallback a link).
- **Paleta:** terracota + arena — historias en tono cálido, sin estridencia.

#### 10 · Mentorías — `/dashboard/mentorias`
- **Objetivo:** encontrar mentores y agendar prácticas.
- **Estructura:** grid de `MentorCard` (mentores = `user_role MENTOR`) + vista calendario `@fullcalendar/react` (semana, drag-and-drop) para slots; `StatusBadge` por `session_status`.
- **Lógica:** `GET /mentores` (disponibilidad); `POST /mentores/{id}/agendar` → confirma con `NotificationToast`. El usuario agenda como `MENTEE`. Flag `is_practice_invitation` para sesiones de práctica.
- **Estados:** loading, sin mentores en el área (empty), slot ya tomado (control de concurrencia → toast "ese horario se ocupó"), confirmación.
- **Paleta:** **azul horizonte** (confianza primero) + terracota (conexión humana, CTA).

#### 11 · Salud Mental — `/dashboard/salud`
- **Objetivo:** check-in emocional, respuesta empática del agente y derivación CVV segura.
- **Estructura:** `EmojiCheckIn` (`mood_emoji`: HAPPY, DEPRESSED, FURIOUS, ANXIOUS, NEUTRAL) + nota `rating` 1-5; `MoodBanner` con `accion_sugerida`; chat/stream del agente IA; `CheckinHistoryCard` (línea semanal de `rating`).
- **Lógica:** `POST /salud` → `{ mensaje, accion_sugerida, derivar_cvv, nota_actual, alerta }`; `POST /salud/stream` (SSE, Vercel AI SDK) para la respuesta en streaming; `GET /salud/historial`.
- **🚨 Derivación CVV:** si `derivar_cvv === true` → `CvvModal` (granate, no dismissable). La decisión es del backend; el front solo reacciona al flag. **100% de cobertura de test.**
- **Estados:** streaming (tokens en vivo), loading historial, error del agente (igual se respeta la derivación CVV si vino), empty (primer check-in).
- **Paleta:** **azul horizonte dominante** + crema — el único módulo donde el frío domina (acá se viene a calmarse). Granate **solo** en el modal CVV.

#### 12 · Mapa de eventos — `/dashboard/eventos` · (Fase 4)
- **Objetivo:** eventos cercanos según ubicación y cobertura de red (Vísent CDRView).
- **Estructura:** `react-leaflet` (tiles OSM) con `leaflet.markercluster` (clustering) y `leaflet.heat` (heatmap de cobertura); panel lateral con `EventCard`; `FilterBar` (conectividad, radio, tipo).
- **Heatmap — decisión cromática:** la cobertura usa un **semáforo cálido** que respeta la regla de "no segundo color frío": **alta = oliva**, **media = ámbar**, **baja = coral** (nunca granate). Coherente con `CoverageBadge`.
- **Lógica:** `GET /eventos?lat&lng&radio` → eventos + nivel de cobertura; si cobertura baja → `sugerir_offline` (CTA de descarga offline). `POST /push/suscribir` para alertas.
- **Estados:** permiso de geolocalización (solicitud/denegado → fallback a ciudad del perfil), loading del dataset, empty (sin eventos en el radio), offline.
- **Paleta:** terracota + arena + semáforo de cobertura (oliva/ámbar/coral).

#### 13 · Perfil / Configuración — `/dashboard/perfil`
- **Objetivo:** ver y editar el `Profile`, gestionar skills, idioma, notificaciones y descargas offline.
- **Estructura:** `StatCard` de progreso, secciones editables (datos personales, profesionales), `SkillChip` (adquiridos en oliva), toggles de idioma (ES/PT) y notificaciones push, lista de recursos descargados offline, cerrar sesión.
- **Lógica:** `GET /perfil` / `PUT /perfil`; suscripción push (`POST /push/suscribir`).
- **Estados:** loading, guardado optimista + toast, error de validación.
- **Paleta:** crema + terracota; skills adquiridos en oliva.

---

## Tokens — integración con Fase 0 del plan de frontend

Estos tokens reemplazan la tarea "Paleta BiT en CSS variables" de la Fase 0.

### CSS variables (`globals.css`)

```css
:root {
  /* Marca */
  --bit-terracota: #A8442A;
  --bit-terracota-soft: #F4DCCB;
  --bit-coral: #CC4A2E;
  --bit-coral-soft: #FBE2DA;
  --bit-ambar: #D98E32;
  --bit-ambar-soft: #F6E3C0;
  --bit-azul: #2C4E9E;
  --bit-azul-soft: #DDE7F8;

  /* Semánticos */
  --bit-oliva: #5F7E3F;
  --bit-oliva-soft: #E4ECD7;
  --bit-granate: #9E2235;
  --bit-granate-soft: #F7DDE1;

  /* Neutros */
  --bit-arena: #EFDFC4;
  --bit-crema: #FAF1E6;
  --bit-cacao: #2B1E16;
  --bit-topo: #7A6557;
}
```

### Tailwind (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        terracota: { DEFAULT: "#A8442A", soft: "#F4DCCB" },
        coral:     { DEFAULT: "#CC4A2E", soft: "#FBE2DA" },
        ambar:     { DEFAULT: "#D98E32", soft: "#F6E3C0" },
        horizonte: { DEFAULT: "#2C4E9E", soft: "#DDE7F8" },
        oliva:     { DEFAULT: "#5F7E3F", soft: "#E4ECD7" },
        granate:   { DEFAULT: "#9E2235", soft: "#F7DDE1" },
        arena: "#EFDFC4",
        crema: "#FAF1E6",
        cacao: "#2B1E16",
        topo:  "#7A6557",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
};
export default config;
```

En shadcn/ui, mapear `primary` → terracota, `secondary` → ámbar, `destructive` → granate, `muted` → arena/topo en el bloque de variables HSL que genera el CLI.

---

## Modo oscuro

Los neutros invierten manteniendo la temperatura cálida (nunca grises fríos); los colores de marca suben un paso de luminosidad para conservar contraste AA sobre fondos oscuros:

| Token | Modo claro | Modo oscuro |
|---|---|---|
| Fondo base | `#FAF1E6` | `#201812` |
| Superficie | `#FFFFFF` | `#2A211A` |
| Texto principal | `#2B1E16` | `#F3E9DD` |
| Texto secundario | `#7A6557` | `#BCA897` |
| Terracota | `#A8442A` | `#D27A5C` |
| Coral | `#CC4A2E` | `#E8765A` |
| Ámbar | `#D98E32` | `#E8AC5C` |
| Azul horizonte | `#2C4E9E` | `#7D9BD6` |
| Verde oliva | `#5F7E3F` | `#97B271` |
| Granate | `#9E2235` | `#D16A7A` |

---

## Tipografía

| Uso | Fuente | Justificación |
|---|---|---|
| Display / titulares | **Fraunces** (variable, Google Fonts) | Serif humanista con calidez editorial — herencia de Raíz, refuerza el tono "verdaderamente humano" del producto |
| UI / cuerpo | **Inter** (variable, Google Fonts) | Legibilidad máxima en tamaños pequeños, soporte amplio de pesos, estándar en interfaces accesibles |

Cargar ambas vía `next/font/google` con `display: swap` (cero layout shift, sin FOIT).

---

## Do & Don't

**Do**
- Mantener la proporción 60-30-10: si una pantalla se siente "muy naranja", falta crema/arena.
- Usar el azul solo donde la emoción objetivo sea calma o confianza.
- Celebrar logros en ámbar y verde — son los colores de la dopamina del producto.
- Texto cacao sobre crema como par por defecto de toda la app.

**Don't**
- No usar granate fuera del flujo CVV — sin excepciones.
- No poner texto blanco sobre ámbar ni sobre arena/crema.
- No introducir un segundo color frío (violetas, teales): rompería la estructura complementaria.
- No usar terracota y coral juntos en el mismo componente al mismo nivel jerárquico — coral es acción puntual, terracota es identidad.

---

## Trazabilidad de la fusión

| Elemento | Origen |
|---|---|
| Terracota, ámbar, arena, crema, cacao, topo | Raíz (análoga cálida) |
| Azul horizonte, coral (oscurecido a `#CC4A2E`), estructura complementaria | Horizonte (complementaria dividida) |
| Verde oliva | Raíz (semántico) |
| Granate | Nuevo — necesario para distinguir crisis de los rojos cálidos de marca |
| Fraunces + Inter | Raíz (tipografía) |
