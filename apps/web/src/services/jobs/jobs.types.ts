import type { SkillCategory } from "@/services/skills/skills.types";

/**
 * Contratos de empleabilidad.
 *
 * Fuente de verdad del backend v1 (OpenAPI):
 * - `GET /api/v1/jobs/matches` → `JobMatchResponse` = `{ jobId, company, title, matchRate }`.
 * - `GET /api/v1/jobs/{id}` → `JobDetailResponse` = `{ id, company, title,
 *   description, requiredSkills: string[] }`.
 *
 * `requiredSkills` viene como lista de nombres (sin categoría). `modality`,
 * `location`, `salaryRange`, `aboutCompany`, `benefits` y `postedDaysAgo` NO
 * vienen del backend: se completan con data mock centralizada en
 * [`lib/mockDataTemp`](../../lib/mockDataTemp.ts), cruzada por `title` en
 * `jobs.service.ts`. Cuando el backend los exponga, se quita el enriquecido.
 *
 * TODO(backend): pedir estos campos en el detalle real, y qué skills ya
 * cumple el usuario vs. cuáles le faltan (estado por skill).
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

/** Modalidad de trabajo. Mock temporal (ver `mockDataTemp`). */
export type JobModality = "REMOTE" | "HYBRID" | "ONSITE";

export type Job = {
  // --- Reales (backend, `JobDetailResponse`) ---
  id: string;
  company: string;
  title: string;
  description: string;
  /** `requiredSkills: string[]` del backend, enriquecido con categoría mock. */
  requiredSkills: JobSkill[];
  // --- Mock temporal (mockDataTemp), hasta que el backend los exponga ---
  modality: JobModality;
  location: string;
  salaryRange: string;
  aboutCompany: string;
  benefits: string[];
  postedDaysAgo: number;
};
