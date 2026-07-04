# AppBit API — Guía de integración Frontend

**Base URL (local):** `http://localhost:8080`
**Swagger UI:** `http://localhost:8080/swagger-ui.html`

## Autenticación

Todos los endpoints marcados como 🔒 requieren el header:

```
Authorization: Bearer <accessToken>
```

El `accessToken` se obtiene en `/api/v1/auth/register`, `/api/v1/auth/login` o `/api/v1/auth/refresh`.

## Formato de errores (global)

Cualquier error devuelve este cuerpo:

```json
{
  "timestamp": "2026-07-02T18:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/auth/register",
  "fieldErrors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

- `400` → validación fallida (`fieldErrors` detalla cada campo).
- `500` → error inesperado (`fieldErrors` vacío).

## Enums (valores exactos)

| Enum | Valores |
|---|---|
| `UserRole` | `MENTOR`, `MENTEE` |
| `GenderType` | `MASCULINE`, `FEMININE`, `OTHER` |
| `EducationLevelType` | `HIGH_SCHOOL`, `TECHNICAL`, `UNDERGRADUATE`, `POSTGRADUATE`, `SELF_TAUGHT` |
| `LevelType` | `BEGINNER`, `INTERMEDIATE`, `ADVANCED` |
| `ExperienceType` | `WORKSHOP`, `BOOTCAMP`, `WEBINAR`, `JOB_EXPERIENCE` |
| `MoodEmoji` | `HAPPY`, `DEPRESSED`, `FURIOUS`, `ANXIOUS`, `NEUTRAL` |
| `SessionStatus` | `AVAILABLE`, `PENDING`, `SCHEDULED`, `COMPLETED`, `CANCELED` |
| `SkillCategory` | `BACKEND`, `FRONTEND`, `MOBILE`, `DATA_SCIENCE`, `DESIGN_UX_UI`, `SOFT_SKILLS` |

---

# 1. Auth — `/api/v1/auth` (público)

### POST `/api/v1/auth/register`

Registra un usuario y devuelve tokens JWT.

**Request:**
```json
{
  "email": "user@mail.com",
  "password": "mínimo8chars",
  "role": "MENTEE"
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `email` | string | requerido, formato email |
| `password` | string | requerido, mínimo 8 caracteres |
| `role` | enum `UserRole` | requerido |

**Response `201`:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 1800000
}
```

### POST `/api/v1/auth/login`

Autentica y devuelve tokens.

**Request:**
```json
{ "email": "user@mail.com", "password": "..." }
```

**Response `200`:** mismo cuerpo que register (`TokenResponse`).

### POST `/api/v1/auth/refresh`

Renueva el access token con un refresh token válido.

**Request:**
```json
{ "refreshToken": "eyJ..." }
```

**Response `200`:** mismo cuerpo que register (`TokenResponse`).

---

# 2. Perfil — `/api/v1/profile` 🔒

### GET `/api/v1/profile`

Devuelve el perfil del usuario autenticado.

**Response `200`:**
```json
{
  "role": "MENTEE",
  "name": "Ana Pérez",
  "birthDate": "2000-05-14",
  "gender": "FEMININE",
  "education": "UNDERGRADUATE",
  "professionalLevel": "BEGINNER",
  "techArea": "Frontend",
  "objective": "Conseguir mi primer empleo IT",
  "location": {
    "continent": "South America",
    "country": "Colombia",
    "state": "Antioquia",
    "city": "Medellín",
    "latitude": 6.2442,
    "longitude": -75.5812
  },
  "contact": { "whatsapp": "+573001234567" }
}
```

### PUT `/api/v1/profile`

Crea o actualiza el perfil (UPSERT — el front usa siempre PUT, exista o no el perfil).

**Request:**
```json
{
  "name": "Ana Pérez",
  "birthDate": "2000-05-14",
  "gender": "FEMININE",
  "education": "UNDERGRADUATE",
  "professionalLevel": "BEGINNER",
  "techArea": "Frontend",
  "objective": "Conseguir mi primer empleo IT",
  "location": {
    "continent": "South America",
    "country": "Colombia",
    "state": "Antioquia",
    "city": "Medellín",
    "latitude": 6.2442,
    "longitude": -75.5812
  },
  "contact": { "whatsapp": "+573001234567" }
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `name` | string | **requerido**, máx 100 chars |
| `birthDate` | date `yyyy-MM-dd` | opcional, debe ser pasado |
| `gender` | enum `GenderType` | opcional |
| `education` | enum `EducationLevelType` | opcional |
| `professionalLevel` | enum `LevelType` | opcional |
| `techArea` | string | opcional |
| `objective` | string | opcional |
| `location` | objeto | opcional (todos sus campos opcionales) |
| `contact.whatsapp` | string | opcional, patrón `^\+?[0-9]{7,15}$` |

**Response `200`:** `ProfileResponse` (igual al GET).

---

# 3. Experiencias — `/api/v1/experiences` 🔒

Contenido creado por mentores (talleres, bootcamps, webinars, experiencia laboral).

### POST `/api/v1/experiences` — solo rol MENTOR

**Request:**
```json
{
  "title": "Intro a Spring Boot",
  "description": "Taller práctico de APIs REST",
  "speakerRole": "Backend Developer",
  "type": "WORKSHOP",
  "contentUrl": "https://youtube.com/...",
  "dateTime": "2026-08-01T18:00:00-05:00",
  "skillIds": ["uuid-de-skill-1", "uuid-de-skill-2"]
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | string | requerido |
| `description` | string | requerido |
| `speakerRole` | string | requerido |
| `type` | enum `ExperienceType` | requerido |
| `contentUrl` | string | requerido |
| `dateTime` | datetime ISO con zona | requerido |
| `skillIds` | UUID[] | requerido, al menos 1 (obtenerlos de `GET /api/skills`) |

**Response `201`** (detalle — nota: mezcla snake_case y camelCase):
```json
{
  "id": "uuid",
  "title": "Intro a Spring Boot",
  "mentor_profile_id": "uuid",
  "owner": true,
  "description": "Taller práctico de APIs REST",
  "speaker_name": "Ana Pérez",
  "speaker_role": "Backend Developer",
  "type": "WORKSHOP",
  "content_url": "https://youtube.com/...",
  "date_time": "2026-08-01T18:00:00-05:00",
  "skills": [{ "id": "uuid", "name": "Java" }],
  "createdAt": "2026-07-02T18:00:00Z",
  "updatedAt": "2026-07-02T18:00:00Z"
}
```

### GET `/api/v1/experiences`

Lista experiencias con filtros opcionales.

**Query params:** `skillId` (UUID, opcional), `type` (enum `ExperienceType`, opcional).
Ejemplo: `/api/v1/experiences?type=WORKSHOP&skillId=<uuid>`

**Response `200`** (array de resúmenes):
```json
[
  {
    "id": "uuid",
    "mentorProfileId": "uuid",
    "title": "Intro a Spring Boot",
    "speaker_name": "Ana Pérez",
    "speaker_role": "Backend Developer",
    "type": "WORKSHOP",
    "date_time": "2026-08-01T18:00:00-05:00",
    "content_url": "https://youtube.com/...",
    "createdAt": "2026-07-02T18:00:00Z",
    "updatedAt": "2026-07-02T18:00:00Z"
  }
]
```

### GET `/api/v1/experiences/{id}`

**Response `200`:** `ExperienceDetailResponse` (igual al POST; `owner` indica si el usuario autenticado es el creador).

### PUT `/api/v1/experiences/{id}` — solo el mentor dueño

**Request:** igual al POST. **Response `200`:** `ExperienceDetailResponse`.

### DELETE `/api/v1/experiences/{id}` — solo el mentor dueño

**Response `204`:** sin cuerpo.

---

# 4. Salud mental (check-ins) — `/api/v1/health/checkins` 🔒

### POST `/api/v1/health/checkins`

Registra un check-in emocional; la IA (Gemini) evalúa y sugiere una acción.

**Request:**
```json
{
  "emoji": "ANXIOUS",
  "rating": 2,
  "context": "Me siento abrumado por la búsqueda de empleo"
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `emoji` | enum `MoodEmoji` | requerido |
| `rating` | int | requerido, 1–5 |
| `context` | string | opcional |

**Response `201`:**
```json
{
  "checkinId": "uuid",
  "mensaje": "Texto empático generado por IA",
  "accion_sugerida": "Respirar profundo y tomar una pausa",
  "derivar_cvv": false,
  "nota_actual": 2,
  "alerta": false
}
```

> `derivar_cvv: true` indica riesgo — el front debe mostrar el contacto de línea de ayuda (CVV).

### GET `/api/v1/health/checkins`

Historial del usuario autenticado.

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "emoji": "ANXIOUS",
    "rating": 2,
    "context": "…",
    "suggested_action": "…",
    "derive_cvv": false,
    "created_at": "2026-07-02T18:00:00Z"
  }
]
```

### GET `/api/v1/health/checkins/{id}`

**Response `200`:** mismo objeto que un elemento del historial (`CheckinDetailResponse`).

### POST `/api/v1/health/checkins/{id}/empathic-response`

Genera una respuesta empática de la IA para un check-in ya guardado. Sin body.

**Response `200`:**
```json
{ "response": "Texto empático generado por IA" }
```

---

# 5. Mentorías — `/api/v1/mentorships` 🔒

Flujo: el MENTOR crea un slot (`AVAILABLE`) → el MENTEE lo reserva (`SCHEDULED`) → se completa (`COMPLETED`) o cancela (`CANCELED`).

### POST `/api/v1/mentorships/sessions` — solo rol MENTOR

**Request:**
```json
{
  "title": "Mock interview backend",
  "scheduleDate": "2026-08-01T18:00:00",
  "practice": true
}
```

| Campo | Tipo | Reglas |
|---|---|---|
| `title` | string | requerido, máx 150 chars |
| `scheduleDate` | datetime `yyyy-MM-ddTHH:mm:ss` (sin zona) | requerido, futuro |
| `practice` | boolean | opcional, default `false` (invitación a práctica) |

**Response `201`:**
```json
{
  "id": "uuid",
  "title": "Mock interview backend",
  "mentor_profile_id": "uuid",
  "mentee_profile_id": null,
  "schedule_date": "2026-08-01T18:00:00Z",
  "status": "AVAILABLE",
  "is_practice_invitation": true
}
```

### GET `/api/v1/mentorships/sessions`

Lista sesiones. **Sin filtros devuelve solo las `AVAILABLE`.**

**Query params (opcionales):** `status` (enum `SessionStatus`), `practice` (boolean), `date` (`yyyy-MM-dd`).
Ejemplo: `/api/v1/mentorships/sessions?status=AVAILABLE&practice=true&date=2026-08-01`

**Response `200`:** array del mismo objeto sesión.

### GET `/api/v1/mentorships/sessions/{id}`

**Response `200`:** objeto sesión.

### POST `/api/v1/mentorships/sessions/{id}/book` — solo rol MENTEE

Reserva una sesión `AVAILABLE`. Sin body.

**Response `200`:** objeto sesión con `status: "SCHEDULED"` y `mentee_profile_id` asignado.

### PATCH `/api/v1/mentorships/sessions/{id}/cancel` — mentor o mentee asignado

Sin body. **Response `200`:** objeto sesión con `status: "CANCELED"`.

### PATCH `/api/v1/mentorships/sessions/{id}/complete` — solo el mentor de la sesión

Sin body. **Response `200`:** objeto sesión con `status: "COMPLETED"`.

### GET `/api/v1/mentorships/my-sessions`

Sesiones del usuario autenticado (como mentor o mentee).

**Response `200`:** array del mismo objeto sesión.

---

# 6. Orientación vocacional / IA — `/api`

### POST `/api/orientar` (público)

Motor de matching: analiza el perfil del usuario y devuelve brecha de habilidades, cursos, vacantes y confianza.

**Request:**
```json
{ "userId": "550e8400-e29b-41d4-a716-446655440000" }
```

**Response `200`:**
```json
{
  "gapPorcentual": 35.5,
  "gapItems": [
    { "id": "uuid", "name": "Docker", "level": "BEGINNER" }
  ],
  "trayectoriaSugerida": [
    {
      "courseId": "uuid",
      "title": "Docker desde cero",
      "provider": "Platzi",
      "skillsContribuidos": ["Docker", "CI/CD"]
    }
  ],
  "vacantesCompatibles": [
    { "jobId": "uuid", "company": "Acme", "title": "Backend Jr", "matchRate": 78.5 }
  ],
  "confianza": 92.0
}
```

### POST `/api/salud` (público)

Evaluación de un texto libre de salud emocional vía IA.

**Request:**
```json
{ "description": "texto libre, máx 1000 caracteres" }
```

**Response `200`:**
```json
{ "status": "...", "message": "...", "description": "..." }
```

### GET `/api/jobs/matches?userId=<uuid>` 🔒

Vacantes compatibles para un usuario.

**Response `200`:**
```json
[
  { "jobId": "uuid", "company": "Acme", "title": "Backend Jr", "matchRate": 78.5 }
]
```

### GET `/api/jobs/{id}` 🔒

Detalle de una vacante (entidad `Job`): `id`, `company`, `title`, `description`, `createdAt`, `skills`.

### GET `/api/skills` 🔒

Catálogo de skills — usar para poblar selects y obtener los `skillIds` de experiencias.

**Response `200`:** array de `{ "id": "uuid", "name": "Java", "category": "BACKEND", ... }`.

### GET `/api/courses` 🔒

Catálogo de cursos: `id`, `name`, `provider`, `level` (`LevelType`), `url`, `skills`.

---

# Otros

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/actuator/health` | público | Estado del servicio (`{"status":"UP"}`) |
| `GET` | `/swagger-ui.html` | público | Documentación interactiva |
| `GET` | `/v3/api-docs` | público | Spec OpenAPI en JSON |

## Notas para el front

1. **CORS** permitido para `http://localhost:3000` y `http://localhost:5173` (configurable por env `CORS_ALLOWED_ORIGINS`).
2. **Expiración de tokens:** access 30 min, refresh 7 días. `expiresIn` viene en **milisegundos**. Al recibir `401`, usar `/api/v1/auth/refresh`.
3. **Inconsistencia de naming:** algunas respuestas mezclan `snake_case` (`mentor_profile_id`, `date_time`) con `camelCase` (`createdAt`, `mentorProfileId` en el listado de experiencias). Respetar los nombres exactos documentados arriba.
4. `JobController` (`/api/jobs` CRUD) existe pero **aún no tiene endpoints implementados**; solo están los de matching bajo `OrientationController`.
