# App BiT — Plan de Implementación Backend

> MVP de orientación personal para grupos sub-representados
> Alcance: Backend únicamente · Duración estimada: 20 semanas · Alineado al plan de frontend

---

## Stack principal

| Categoría | Tecnología |
|---|---|
| Lenguaje | Java 21 (LTS) |
| Framework | Spring Boot 3.3.x |
| Web | Spring Web (REST) + SSE para streaming |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos | PostgreSQL 16 + PostGIS |
| Migraciones | Flyway |
| Seguridad | Spring Security + JWT (OAuth2 Resource Server) |
| Validación | Jakarta Bean Validation |
| Mapeo DTO | MapStruct |
| Documentación API | springdoc-openapi (Swagger UI) |
| Agente IA | Spring AI (Anthropic) |
| Resiliencia | Resilience4j (circuit breaker, retry) |
| Caché | Caffeine |
| Notificaciones push | web-push-java |
| Observabilidad | Actuator + Micrometer + Prometheus |
| Tests | JUnit 5 + Mockito + Testcontainers |
| Contenedores | Docker + docker-compose |
| i18n | MessageSource (PT + ES) |

---

## Alineación con el plan de frontend

El backend va medio paso adelante: cada endpoint debe existir antes de que la pantalla que lo consume entre en desarrollo.

| Fase | Semanas | Backend entrega | Lo que desbloquea en frontend |
|---|---|---|---|
| 0 | 1–2 | Contrato OpenAPI + infra Docker | Contrato de integración compartido (Día 1) |
| 1 | 3–4 | Auth + CRUD de perfil | Onboarding (Frontend Fase 2) |
| 2 | 5–8 | `/orientar` + motor de matching | Gap porcentual y trayectoria |
| 3 | 9–12 | `/salud` + agente IA + mentorías/experiencias | Dashboard y los 5 módulos |
| 4 | 13–16 | Geolocalización + push | Mapa de eventos + notificaciones |
| 5 | 17–20 | QA + seguridad + deploy | MVP en producción |

---

## Estructura del proyecto (package by feature)

```
appbit-api/
├── src/main/java/com/appbit/
│   ├── AppBitApplication.java
│   ├── config/                  # Security, CORS, OpenAPI, AI, cache
│   ├── common/                  # DTOs base, excepciones, i18n, utils
│   ├── auth/                    # Registro, login, JWT
│   │   ├── AuthController.java
│   │   ├── AuthService.java
│   │   └── dto/
│   ├── profile/                 # Perfil personal + profesional
│   ├── orientation/             # Endpoint /orientar + matching engine
│   │   ├── OrientarController.java
│   │   ├── MatchingService.java
│   │   └── domain/
│   ├── health/                  # Endpoint /salud + CVV + agente IA
│   │   ├── SaludController.java
│   │   ├── SaludService.java
│   │   └── ai/
│   ├── courses/                 # Formaciones
│   ├── jobs/                    # Empleabilidad (vacantes)
│   ├── mentorship/              # Mentorías + agenda
│   ├── experiences/             # Experiencias estructurantes
│   ├── geo/                     # Vísent CDRView + eventos
│   └── notifications/           # Push + scheduler
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   ├── db/migration/            # Flyway: V1__init.sql, V2__...
│   └── messages/                # messages_pt.properties, messages_es.properties
├── src/test/java/               # Unit + Testcontainers
├── docker-compose.yml
├── Dockerfile
└── pom.xml
```

---

## Fase 0 — Foundation: infraestructura y contrato

**Semanas 1–2**

### Objetivos
Tener la API arrancando en Docker contra PostgreSQL y, sobre todo, el contrato OpenAPI de `/orientar` y `/salud` definido el Día 1 — el documento del desafío lo pide explícitamente como punto de partida del equipo.

### Tareas

**Proyecto Spring Boot**
- Inicializar con Spring Initializr: Java 21, Spring Boot 3.3.x, Maven
- Estructura de paquetes por feature (no por capa técnica)
- Perfiles `dev` y `prod` con `application-{profile}.yml`

**PostgreSQL + PostGIS en Docker**
- `docker-compose.yml` con servicio `db` (imagen `postgis/postgis:16-3.4`) y `app`
- Volumen persistente para datos de desarrollo
- Healthcheck del contenedor de base de datos

**Dockerfile multi-stage**
- Etapa `build`: JDK 21 + Maven para compilar el JAR
- Etapa `runtime`: JRE 21 slim (`eclipse-temurin:21-jre-alpine`)
- Usuario no-root, puerto expuesto, JAR copiado

**Flyway + migración base**
- `V1__baseline.sql` con extensión PostGIS habilitada (`CREATE EXTENSION postgis`)
- `ddl-auto: validate` (nunca `update` ni `create` — Flyway es la única fuente de verdad del esquema)

**Contrato OpenAPI (contract-first)**
- `springdoc-openapi` con Swagger UI en `/swagger-ui`
- Definir schemas de `OrientarRequest`, `OrientarResponse`, `SaludRequest`, `SaludResponse` exactamente como el frontend los espera
- Exportar el contrato como artefacto compartido con el equipo de frontend

**Observabilidad base**
- Spring Boot Actuator con `/actuator/health` y `/actuator/info`
- Configuración de variables de entorno (nunca credenciales en el repo)

### Entregable
`docker compose up` levanta API + PostgreSQL/PostGIS, `/actuator/health` responde `UP`, Swagger UI muestra el contrato de los endpoints.

---

## Fase 1 — Autenticación + dominio de usuario y perfil

**Semanas 3–4**

### Objetivos
Permitir registro, login y gestión del perfil personal y profesional. Esto desbloquea el onboarding del frontend (su Fase 2).

### Tareas

**Spring Security + JWT**
- Configurar como OAuth2 Resource Server con validación de JWT
- Generación de tokens en login (access + refresh)
- `BCryptPasswordEncoder` para hashing de contraseñas
- CORS configurado para el origen del frontend

**Entidades de dominio**
- `User` — credenciales, rol, estado
- `Profile` — datos personales (nombre, e-mail, fecha de nacimiento, género, escolaridad, continente, país, estado, ciudad, WhatsApp) + datos profesionales (nivel, área de tecnología, objetivo)
- Migración Flyway `V2__users_profiles.sql`

**Endpoints**
- `POST /auth/register` — crear cuenta
- `POST /auth/login` — autenticar y emitir JWT
- `POST /auth/refresh` — renovar token
- `GET /perfil` — obtener perfil del usuario autenticado
- `PUT /perfil` — actualizar perfil

**DTOs + validación**
- DTOs separados de las entidades, mapeo con MapStruct
- Bean Validation en requests (`@NotBlank`, `@Email`, `@Past`, etc.)
- Manejo global de errores con `@RestControllerAdvice` y respuestas i18n (PT/ES)

### Entregable
Registro y login funcionales con JWT, CRUD de perfil completo y validado, respuestas de error en PT y ES.

---

## Fase 2 — Motor de matching + endpoint `/orientar`

**Semanas 5–8**

### Objetivos
Implementar la lógica central del producto: calcular el gap porcentual entre el perfil del usuario y las vacantes, y sugerir una trayectoria concreta para cerrarlo.

### Tareas

**Modelo de dominio**
- `Skill` — habilidad/competencia técnica
- `Course` — formación (proveedor GEAR/ONE, nivel, skills que aporta)
- `Job` — vacante (empresa, requisitos como conjunto de skills)
- Tablas de relación: `ProfileSkill`, `JobRequirement`, `CourseSkill`
- Migración `V3__matching_domain.sql` + seed de cursos gratuitos (GEAR de Google Cloud, ONE de Oracle & Alura) y vacantes de ejemplo

**MatchingService**
- Cálculo del gap: `gap_porcentual = (skills cumplidos / total requisitos) × 100`
- `gap_items` — lista concreta de skills faltantes para cada vacante
- Identificar vacantes compatibles (umbral configurable, p. ej. ≥ 50% de match)
- `confianza` — score basado en la completitud del perfil del usuario

**Trayectoria sugerida**
- Mapear cada `gap_item` → cursos disponibles que aportan ese skill
- Ordenar la trayectoria por dependencias y nivel
- Devolver el próximo paso concreto recomendado

**Endpoint `/orientar`**
- `POST /orientar` con request `{ usuario_id, perfil, nivel, region, idioma, lat, lng }`
- Response `{ gap_porcentual, gap_items, trayectoria_sugerida, vacantes_compatibles, confianza }`
- Caché de resultados con Caffeine (la orientación no cambia entre requests cercanos)

### Entregable
`/orientar` devuelve gap porcentual, items faltantes, trayectoria de cursos y vacantes compatibles. Cobertura de tests del `MatchingService` al 100%.

---

## Fase 3 — `/salud` + agente IA + módulos restantes

**Semanas 9–12**

### Objetivos
Implementar el check-in de salud mental con derivación automática al CVV, el agente de IA en streaming, y el backend de mentorías y experiencias.

### Tareas

**Check-in de salud mental**
- Entidad `MoodCheckin` — humor (emoji), nota semanal, contexto, fecha
- `SaludService` — registra el check-in, calcula `nota_actual`, evalúa alerta
- Migración `V4__health.sql`

**Derivación CVV (feature crítica)**
- Si `nota_semanal < 4` → `derivar_cvv: true` + `alerta: true`
- Logging crítico dedicado y métrica específica para cada derivación
- Circuit breaker (Resilience4j) en cualquier llamada externa del flujo, con fallback seguro: si el agente IA falla, **igual se devuelve la derivación CVV** (nunca se bloquea por una dependencia caída)
- Esta lógica debe tener cobertura de test del 100%

**Agente de IA (Spring AI + Anthropic)**
- Genera `mensaje` empático y `accion_sugerida` (capítulo de libro, podcast, caminata, etc.) según humor y contexto regional
- Prompt diseñado bajo el principio de "escuchar sin juzgar" (modelo de referencia: AA)
- Endpoint de streaming `text/event-stream` (SSE) compatible con el Vercel AI SDK del frontend

**Endpoint `/salud`**
- `POST /salud` con request `{ usuario_id, humor, nota_semanal, contexto }`
- Response `{ mensaje, accion_sugerida, derivar_cvv, nota_actual, alerta }`

**Módulo Mentorías**
- Entidades `Mentor`, `MentorshipSlot`, `Booking`
- Endpoints: listar mentores, ver disponibilidad, agendar práctica
- Estado de slots (disponible / reservado) con control de concurrencia optimista

**Módulo Experiencias Estructurantes**
- Entidad `Experience` — testimonio en video (URL, autor, área, trayectoria)
- Endpoint de feed con filtro por área y tipo de trayectoria

### Entregable
`/salud` operativo con derivación CVV verificada, agente IA respondiendo en streaming, mentorías agendables y feed de experiencias.

---

## Fase 4 — Geolocalización Vísent CDRView + notificaciones

**Semanas 13–16**

### Objetivos
Integrar el dataset de cobertura de red y antenas para mostrar eventos cercanos según la zona y la conectividad del usuario, y habilitar las notificaciones push.

### Tareas

**Dataset Vísent CDRView (PostGIS)**
- Importar el dataset desde `github.com/wongola-bit/appbit-hackathon` siguiendo el diccionario de columnas
- Entidades `CoverageZone` (cobertura 5G/4G/3G), `Antenna` (coordenadas Anatel), `Event` (eventos geolocalizados)
- Migración `V5__geo.sql` con columnas `geometry(Point, 4326)` e índices GIST

**Consultas espaciales**
- Eventos cercanos con `ST_DWithin` sobre las coordenadas del usuario
- Nivel de cobertura de la zona del usuario por intersección espacial
- Endpoint `GET /eventos?lat&lng&radio` → eventos cercanos + nivel de cobertura

**Lógica de baja conectividad**
- Si la cobertura de la zona es baja → flag `sugerir_offline: true` en la respuesta
- El frontend usa este flag para ofrecer descarga de contenido offline

**Notificaciones push**
- Entidad `PushSubscription` (endpoint, claves del navegador)
- Envío con `web-push-java` usando claves VAPID
- Endpoints de suscripción / cancelación

**Scheduler**
- `@Scheduled` para notificación diaria de bienestar (9am)
- Recordatorio de check-in si el usuario no lo completó antes de las 8pm
- Push de derivación urgente si el sistema detecta alerta CVV

### Entregable
Eventos por geolocalización con nivel de cobertura por zona, flag de contenido offline, y notificaciones push diarias funcionando.

---

## Fase 5 — QA, seguridad y deploy

**Semanas 17–20**

### Objetivos
Garantizar calidad, endurecer la seguridad y desplegar en producción con monitoreo activo.

### Tareas

**Testing**
- Tests unitarios (JUnit 5 + Mockito) con foco en `MatchingService` y `SaludService` (100% en la lógica de gap y de derivación CVV)
- Tests de integración con Testcontainers (PostgreSQL/PostGIS real, no H2)
- Test específico: `/salud` con `nota_semanal < 4` → verificar `derivar_cvv: true`
- Cobertura mínima global ≥ 80%

**Seguridad**
- Rate limiting con Bucket4j en endpoints sensibles (`/auth`, `/salud`)
- Headers de seguridad (CSP, HSTS, X-Content-Type-Options)
- Validación exhaustiva de input y sanitización
- OWASP Dependency-Check en el pipeline
- Revisión de CORS para el dominio del frontend en producción

**Observabilidad**
- Actuator + Micrometer exportando a Prometheus
- Logging estructurado (Logback en formato JSON)
- Alerta inmediata ante cualquier error en el flujo CVV (integración con Sentry o sistema de alertas)
- Métricas de negocio: número de derivaciones CVV, tasa de match, latencia de `/orientar`

**CI/CD (GitHub Actions)**
- Pipeline: `build` → `test` (con Testcontainers) → `docker build` → `push` → `deploy`
- Deploy automático a Railway o Render en merge a `main`
- Migraciones Flyway ejecutadas en el arranque de la aplicación
- Variables de entorno gestionadas por el servicio de deploy (nunca en el repo)

### Entregable
Backend en producción, cobertura ≥ 80% (100% en matching y CVV), monitoreo y alertas activas.

---

## Contrato de endpoints

| Método | Ruta | Descripción | Fase |
|---|---|---|---|
| POST | `/auth/register` | Crear cuenta | 1 |
| POST | `/auth/login` | Autenticar y emitir JWT | 1 |
| POST | `/auth/refresh` | Renovar token | 1 |
| GET | `/perfil` | Obtener perfil | 1 |
| PUT | `/perfil` | Actualizar perfil | 1 |
| POST | `/orientar` | Gap porcentual + trayectoria + vacantes | 2 |
| GET | `/cursos` | Listar formaciones (con filtros) | 2 |
| GET | `/vacantes` | Listar vacantes compatibles | 2 |
| POST | `/salud` | Check-in + acción sugerida + derivación CVV | 3 |
| GET | `/salud/historial` | Historial semanal de check-ins | 3 |
| POST | `/salud/stream` | Respuesta del agente IA en streaming (SSE) | 3 |
| GET | `/mentores` | Listar mentores y disponibilidad | 3 |
| POST | `/mentores/{id}/agendar` | Agendar práctica | 3 |
| GET | `/experiencias` | Feed de testimonios | 3 |
| GET | `/eventos` | Eventos cercanos por geolocalización | 4 |
| POST | `/push/suscribir` | Registrar suscripción push | 4 |

---

## Modelo de datos (entidades principales)

| Entidad | Campos clave | Relaciones |
|---|---|---|
| `User` | id, email, passwordHash, rol | 1:1 Profile |
| `Profile` | datos personales + profesionales | N:M Skill (ProfileSkill) |
| `Skill` | id, nombre, categoría | — |
| `Course` | id, proveedor, nivel | N:M Skill (CourseSkill) |
| `Job` | id, empresa, título | N:M Skill (JobRequirement) |
| `Mentor` | id, nombre, área, bio | 1:N MentorshipSlot |
| `MentorshipSlot` | id, fecha, estado | 1:1 Booking |
| `Experience` | id, urlVideo, autor, área | — |
| `MoodCheckin` | id, humor, notaSemanal, fecha | N:1 User |
| `CoverageZone` | id, geometry, nivelCobertura | — |
| `Antenna` | id, geometry (coords Anatel) | N:1 CoverageZone |
| `Event` | id, geometry, fecha, tipo | N:1 CoverageZone |
| `PushSubscription` | id, endpoint, claves | N:1 User |

---

## Decisiones de arquitectura clave

**1. Contract-first desde el Día 1**
El contrato OpenAPI de `/orientar` y `/salud` se define antes que la lógica. Esto cumple la indicación del desafío ("comienza por el contrato de integración entre los miembros del equipo el Día 1") y permite al frontend trabajar con mocks (MSW) en paralelo.

**2. Package by feature, no por capa**
Cada feature (`orientation`, `health`, `mentorship`) agrupa su controller, service, dominio y DTOs. Facilita que distintas personas trabajen en módulos distintos sin colisiones.

**3. Flyway como única fuente de verdad del esquema**
`ddl-auto: validate` en todos los perfiles. Nunca `update` o `create-drop`. Cada cambio de esquema es una migración versionada y revisable.

**4. PostGIS en lugar de cálculo de distancias en la aplicación**
Las consultas de proximidad (`ST_DWithin`) e intersección de zonas se resuelven en la base de datos con índices GIST, mucho más eficiente que traer todos los puntos a memoria.

**5. La derivación CVV es la feature más crítica**
Tiene cobertura de test del 100%, logging y métrica dedicados, y un fallback que garantiza la derivación incluso si el agente de IA o cualquier dependencia externa falla. Es la única parte del sistema que nunca puede degradarse silenciosamente.

**6. Streaming SSE compatible con el frontend**
El endpoint del agente IA emite `text/event-stream`, que el Vercel AI SDK del frontend consume de forma nativa, sin necesidad de WebSockets.

**7. Resilience4j en integraciones externas**
Circuit breaker y retry en las llamadas a Anthropic, APIs de cursos y CVV, para que una caída externa no tumbe la API.

---

## Variables de entorno requeridas

```env
# Base de datos
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/appbit
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=

# JWT
JWT_SECRET=
JWT_EXPIRATION=3600

# Agente IA
ANTHROPIC_API_KEY=

# Web Push (VAPID)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:contacto@appbit.app

# Observabilidad
SENTRY_DSN=

# CORS
FRONTEND_ORIGIN=https://appbit.app
```

> **Nunca subir credenciales o claves de API al repositorio.** Usar variables de entorno locales en desarrollo y las del servicio de deploy (Railway/Render) en producción.

---

## Docker — composición de servicios

```yaml
# docker-compose.yml (resumen)
services:
  db:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: appbit
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev

volumes:
  pgdata:
```

El `Dockerfile` usa build multi-stage (JDK 21 para compilar, JRE 21 slim para ejecutar) y corre como usuario no-root.
