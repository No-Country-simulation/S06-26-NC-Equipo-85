# Especificación Técnica de Endpoints y Modelo de Datos (Actualizado)

Este documento contiene el diseño de la API RESTful estructurado por fases para el proyecto, adaptado al nuevo modelo de datos relacional que incorpora las siguientes entidades: `User`, `Profile`, `Mentorship_sessions`, `Mod_checkins`, `Profile_skills`, `Skill`, `Experience_skill`, `Experience`, `Job`, `Job_skills`, `Course`, y `Course_skills`.

---

## 📑 Contrato de Endpoints por Fases

### 🔒 Fase 1 — Autenticación, Usuarios y Perfiles

_Basado en las entidades: `User` y `Profile`._

| Método   | Ruta                    | Descripción                                                                           | Request Body / Query Params                                                                                                                                                      |
| :------- | :---------------------- | :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **POST** | `/api/v1/auth/register` | Registro de nuevo usuario y credenciales iniciales.                                   | `{ "email": "...", "password": "...", "role": "..." }`                                                                                                                           |
| **POST** | `/api/v1/auth/login`    | Autenticación de usuario. Devuelve Access Token (JWT) + Refresh Token.                | `{ "email": "...", "password": "..." }`                                                                                                                                          |
| **POST** | `/api/v1/auth/refresh`  | Renueva un Access Token expirado utilizando el Refresh Token válido.                  | `{ "refresh_token": "..." }`                                                                                                                                                     |
| **GET**  | `/api/v1/profile`       | Obtiene la información completa del perfil del usuario autenticado.                   | _Ninguno (Identificado mediante JWT)_                                                                                                                                            |
| **PUT**  | `/api/v1/profile`       | Actualiza datos personales y profesionales del perfil (incluye ubicación y contacto). | `{ "name": "...", "birth_date": "...", "gender": "...", "education": "...", "location": { "country": "...", "state": "...", "city": "..." }, "contact": { "whatsapp": "..." } }` |

---

### 🧠 Fase 2 — Motor de Matching e Itinerarios Profesionales

_Basado en las entidades: `Profile`, `Profile_skills`, `Skill`, `Job`, `Job_skills`, `Course`, y `Course_skills`._

| Método   | Ruta                       | Descripción                                                                                                           | Request Body / Query Params                                                                                            |
| :------- | :------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **POST** | `/api/v1/guidance`         | **[Core Endpoint]** Calcula el gap técnico, genera la trayectoria recomendada de cursos y busca vacantes compatibles. | `{ "usuario_id": 1, "perfil": "...", "nivel": "...", "region": "...", "idioma": "...", "lat": -17.39, "lng": -66.15 }` |
| **GET**  | `/api/v1/skills`           | Recupera el catálogo global de habilidades técnicas y competencias del sistema.                                       | _Ninguno_                                                                                                              |
| **GET**  | `/api/v1/courses`          | Lista las formaciones y cursos disponibles. Permite filtrar para mitigar brechas específicas.                         | _Query Params opcionales:_ `?skill_id=12&level=INTERMEDIATE`                                                           |
| **GET**  | `/api/v1/jobs/matches` | Devuelve las vacantes que superan el umbral porcentual mínimo de coincidencia de habilidades.                         | _Query Params opcionales:_ `?min_match=50`                                                                             |
| **GET**  | `/api/v1/jobs/{id}`        | **[Detalle de vacante]** Devuelve una vacante con sus requisitos (`Job_skills`), empresa y descripción, para cruzar skills faltantes con cursos sugeridos. | _Path param:_ `{id}`                                                                                                  |

#### 📥 Detalle de Estructura de Datos para `/api/v1/guidance`

- **Response Body (`200 OK`):**
  Archivo generado exitosamente.

```json
{
  "gap_porcentual": 35.5,
  "gap_items": [
    { "id": 4, "name": "PostgreSQL", "level": "Required" },
    { "id": 8, "name": "Docker", "level": "Required" }
  ],
  "trayectoria_sugerida": [
    {
      "course_id": 102,
      "title": "Introducción a Bases de Datos con PostgreSQL",
      "provider": "ONE (Oracle & Alura)",
      "skills_contribuidos": ["PostgreSQL"]
    }
  ],
  "vacantes_compatibles": [
    {
      "job_id": 45,
      "company": "Tech Solutions",
      "title": "Junior Backend Developer",
      "match_rate": 64.5
    }
  ],
  "confianza": 92.0
}
```

### 🧠 Fase 3 — Salud Mental (Check-ins), Mentorías y Experiencias

\_Basado en las entidades: `Mod_checkins`, `Mentorship_sessions`, `Experience` y `Experience_skill`

| Método   | Ruta                                        | Descripción                                                                                                   | Request Body / Query Params                                                |
| :------- | :------------------------------------------ | :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------- |
| **POST** | `/api/v1/wellness`                             | **[Core Endpoint]** Registra el check-in emocional. Si la nota es crítica, activa el protocolo de derivación. | `{ "usuario_id": 1, "humor": "😊", "nota_semanal": 3, "contexto": "..." }` |
| **POST** | `/api/v1/wellness/stream`                      | Canal asíncrono Server-Sent Events (SSE) para la respuesta empática fluida del Agente IA.                     | `{ "checkin_id": 120 } `                                                   |
| **GET**  | `/api/v1/wellness/history`                   | Recupera la serie histórica de check-ins del usuario para analíticas visuales de bienestar.                   | Ninguno (Usa el contexto del token)                                        |
| **GET**  | `/api/v1/mentorships/slots`                 | Lista las sesiones de mentoría y espacios de tiempo disponibles para reserva médica/técnica.                  | _Query Params opcionales:_ `?area=tech&status=AVAILABLE`                   |
| **POST** | `/api/v1/mentorships/sessions/{id}/book` | Reserva una sesión de mentoría específica aplicando control de concurrencia optimista.                        | `{ "usuario_id": 1 }`                                                      |
| **GET**  | `/api/v1/experiences`                      | Devuelve el feed de testimonios estructurantes en video y trayectorias de éxito.                              | _Query Params opcionales:_ `?skill_id=5` `                                 |

#### 📥 Detalle de Estructura de Datos para `/api/v1/wellness`

- **Logica Critica**
  Si nota_semanal < 4, el sistema fuerza de manera síncrona y obligatoria derivar_cvv: true y alerta: true.

- **Response Body (`200 OK`):**

```json
{
  "mensaje": "Hemos recibido tu check-in. Tu bienestar es nuestra prioridad.",
  "accion_sugerida": "Te sugerimos tomar un descanso de 15 minutos y escuchar este podcast de relajación.",
  "derivar_cvv": true,
  "nota_actual": 3,
  "alerta": true
}
```

### 🧠 Fase 4 — Geolocalización (PostGIS Vísent CDRView) y Notificaciones

Basado en consultas espaciales sobre la ubicación del perfil cruzada con mapas de cobertura.

| Método   | Ruta                              | Descripción                                                                                                  | Request Body / Query Params                                         |
| :------- | :-------------------------------- | :----------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **GET**  | `/api/v1/geo/nearby-events`    | Retorna eventos y ofertas de empleo cercanas (ST_DWithin). Activa sugerir_offline si detecta baja cobertura. | _Query Params requeridos:_ `?lat=-17.39&lng=-66.15&radio=5000`      |
| **POST** | `/api/v1/notifications/subscribe` | Registra el endpoint de suscripción del navegador para el envío de notificaciones push (VAPID).              | `{ "endpoint": "...", "keys": { "p256dh": "...", "auth": "..." } }` |

---

## 🔗 Trazabilidad: Vistas del Frontend → Endpoints

Mapeo de las **13 vistas** del [design system de frontend](planner/appbit-design-system.md)
a los endpoints de este contrato. **La ruta canónica es la del backend
(`/api/v1/...`)**; la columna _Alias FE_ documenta el nombre corto que usa el
plan de frontend (la capa de servicios del front mapea el alias → ruta real).

| #   | Vista                 | Ruta (`/[locale]/…`)              | Endpoints (backend, canónico)                                                                          | Alias FE (plan)                          |
| :-- | :-------------------- | :-------------------------------- | :----------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| 1   | Landing pública       | `/`                               | — (estática, SSG)                                                                                      | —                                        |
| 2   | Registro              | `/register`                       | `POST /api/v1/auth/register` → `POST /api/v1/auth/login`                                                | `/auth/register`, `/auth/login`          |
| 3   | Login                 | `/login`                          | `POST /api/v1/auth/login` · `POST /api/v1/auth/refresh`                                                 | `/auth/login`, `/auth/refresh`           |
| 4   | Onboarding (wizard)   | `/onboarding`                     | `GET /api/v1/profile` · `PUT /api/v1/profile` · `POST /api/v1/guidance` · `GET /api/v1/skills` (chips)  | `/perfil`, `/orientar`, `/skills`        |
| 5   | Dashboard / Home      | `/dashboard`                      | `GET /api/v1/profile` · `POST /api/v1/guidance` · `GET /api/v1/wellness/history` · `GET /api/v1/jobs/matches` (top 3) | `/perfil`, `/orientar`, `/salud/historial`, `/vacantes` |
| 6   | Formaciones           | `/dashboard/formaciones`          | `GET /api/v1/courses`                                                                                   | `/cursos`                                |
| 7   | Empleabilidad         | `/dashboard/empleabilidad`        | `GET /api/v1/jobs/matches`                                                                          | `/vacantes`                              |
| 8   | Detalle de vacante    | `/dashboard/empleabilidad/[id]`   | `GET /api/v1/jobs/{id}` · `GET /api/v1/courses?skill_id=` (cursos sugeridos por skill faltante)         | `/vacantes/{id}`, `/cursos`              |
| 9   | Experiencias          | `/dashboard/experiencias`         | `GET /api/v1/experiences`                                                                              | `/experiencias`                          |
| 10  | Mentorías             | `/dashboard/mentorias`            | `GET /api/v1/mentorships/slots` · `POST /api/v1/mentorships/sessions/{id}/book`                      | `/mentores`, `/mentores/{id}/agendar`    |
| 11  | Salud Mental          | `/dashboard/salud`                | `POST /api/v1/wellness` · `POST /api/v1/wellness/stream` · `GET /api/v1/wellness/history`                      | `/salud`, `/salud/stream`, `/salud/historial` |
| 12  | Mapa de eventos       | `/dashboard/eventos`              | `GET /api/v1/geo/nearby-events` · `POST /api/v1/notifications/subscribe`                             | `/eventos`, `/push/suscribir`            |
| 13  | Perfil / Configuración| `/dashboard/perfil`               | `GET /api/v1/profile` · `PUT /api/v1/profile` · `POST /api/v1/notifications/subscribe`                  | `/perfil`, `/push/suscribir`             |

### 🧩 Brechas y decisiones pendientes

1. **`GET /api/v1/jobs/{id}` (resuelto):** agregado al contrato de Fase 2 para la
   vista _Detalle de vacante_ (#8). El listado `GET /jobs/compatibles` no alcanzaba
   para el detalle con requisitos completos.
2. **Mentorías — listado de mentores vs. slots:** la vista #10 muestra `MentorCard`
   (mentores con `user_role = MENTOR`) además del calendario de slots. Definir si
   `GET /api/v1/mentorships/slots` ya devuelve los datos del mentor anidados, o si
   hace falta un `GET /api/v1/mentorships/mentors` aparte.
3. **`POST /api/v1/guidance` — forma del request:** el contrato actual espera
   `{ usuario_id, perfil, nivel, region, idioma, lat, lng }`, pero el front
   completa el `Profile` en el paso previo (`PUT /profile`). Alinear: o el back lee
   el perfil por el `usuario_id` del JWT (recomendado, body mínimo), o el front
   reenvía los campos. El `email` no se manda acá (ya está en `User`).
4. **Naming canónico:** las rutas del backend (`/api/v1/...`, en inglés para
   recursos REST) son la fuente de verdad. El front conserva sus alias en la capa
   de servicios (`apps/web/src/services/*`); cualquier endpoint nuevo se nombra
   primero acá.
