---
name: appbit-backend-contracts
description: Contratos reales del backend App BiT (jobs/courses/skills/orientation) implementados en el change integrate-jobs-courses-orientation
metadata:
  type: project
---

Implementé el change OpenSpec `integrate-jobs-courses-orientation` (2026-07-01) migrando `jobs`, `courses` y `orientation` de mocks forzados (`USE_MOCKS = true`) al contrato real del backend "App BiT API v1" (`https://s06-26-nc-equipo-85-backend.onrender.com`). Endpoints reales:

- `GET /api/jobs/matches?userId=<uuid>` → `JobMatch[]`: `{ jobId, company, title, matchRate }`. `userId` NO viene en el JWT response ni en `ProfileResponse`; se deriva del claim `sub` del access token con `apps/web/src/lib/jwt.ts#getUserIdFromToken`.
- `GET /api/jobs/{id}` → `Job`: `{ id, company, title, description, createdAt, skills[] }`. No hay campo `salary`/`location`/`modalidad`. No hay endpoint de detalle "cumplido/pendiente" por skill.
- `GET /api/courses` → `Course[]`: `{ id, name, provider, level(BEGINNER|INTERMEDIATE|ADVANCED), url, skills[] }`. Sin filtros/paginación server-side, sin `description`/`duration`, y sin `GET /api/courses/{id}` (no hay endpoint de detalle por curso).
- `GET /api/skills` → `Skill[]`: `{ id, name, category }` (`skill_category` enum: BACKEND/FRONTEND/MOBILE/DATA_SCIENCE/DESIGN_UX_UI/SOFT_SKILLS). Service transversal en `services/skills/`.
- `POST /api/orientar` body `{ userId }` → `OrientationResponse`: `{ gapPorcentual, gapItems[], trayectoriaSugerida[], vacantesCompatibles[], confianza }`. Ya no se envía el perfil completo (contrato viejo).

**Por qué importa:** estos contratos son la fuente de verdad de `services/*/*.types.ts`; cualquier feature nueva que toque jobs/courses/skills/orientation debe partir de estos tipos, no inventar campos. La lista completa de gaps de contrato pendientes de pedir al backend (salary/location en Job, skills cumplido/pendiente en JobMatch, description/duration en Course, filtros server-side, userId inferido del Bearer) está consolidada en `openspec/changes/integrate-jobs-courses-orientation/backend-requests.md`, con cada TODO enlazado a su archivo de código vía comentarios `// TODO(backend): ...`.

**Cómo aplicar:** antes de asumir un campo existe en Job/Course/JobMatch/OrientationResponse, revisar `backend-requests.md` — si está ahí, el campo NO existe todavía en el backend real (solo en mocks viejos que ya no deberían estar en el repo). Ver también [[appbit-integration-patterns]] para los patrones de arquitectura usados al construir esta integración.
