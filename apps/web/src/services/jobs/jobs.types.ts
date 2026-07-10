import type { SkillCategory } from "@/services/skills/skills.types";

/**
 * Contratos de empleabilidad.
 *
 * Fuente de verdad del backend v1 (OpenAPI):
 * - `GET /api/v1/jobs/matches` → `JobMatchResponse` = `{ jobId, company, title, matchRate }`.
 * - `GET /api/v1/jobs/{id}` → `JobDetailResponse` = `{ id, company, title,
 *   description, requiredSkills: string[] }`.
 *
 * `requiredSkills` viene como lista de nombres (sin categoría). El service la
 * transforma a `JobSkill[]` completando `category` con data mock centralizada
 * en [`lib/mockDataTemp`](../../lib/mockDataTemp.ts). Cuando el backend exponga
 * la categoría, se quita ese enriquecido.
 *
 * TODO(backend): pedir `salary`/`location`/`modalidad` en el detalle, y qué
 * skills ya cumple el usuario vs. cuáles le faltan (estado por skill).
 */

/** Skill requerida por una vacante. `name` real; `category` mock temporal. */
export type JobSkill = {
  name: string;
  category: SkillCategory;
};

export type JobMatch = {
  jobId: string;
  company: string;
  title: string;
  /** Escala 0-100 (redondeado en `jobs.service.ts`; el contrato lo expresa así). */
  matchRate: number;
};

export type Job = {
  id: string;
  company: string;
  title: string;
  description: string;
  /** `requiredSkills: string[]` del backend, enriquecido con categoría mock. */
  requiredSkills: JobSkill[];
};
