import type { SkillCategory } from "@/services/skills/skills.types";

/**
 * Contratos de empleabilidad.
 *
 * Fuente de verdad: OpenAPI (`App BiT API v1`). `JobMatch` es la forma de
 * `GET /api/jobs/matches`; `Job` es la de `GET /api/jobs/{id}`, aplanando la
 * relación circular `JobSkill` (`{ id, job, skill }`) a `{ id, name, category }`.
 * Los campos que la UI anterior asumía (`salary`, `location`, `area`,
 * `missingRequirements`, `recommendedCourses`) no existen en el contrato real
 * y se eliminan en vez de marcarse opcionales.
 *
 * TODO(backend): pedir `salary`/`location`/`modalidad` (remoto/híbrido/presencial)
 * en `Job`, y qué skills del `JobMatch` ya cumple el usuario vs. cuáles le
 * faltan (estado cumplido/pendiente por skill); hoy la UI no puede mostrar esa
 * información porque el contrato no la expone.
 */

export type JobSkill = {
  id: string;
  name: string;
  category: SkillCategory;
};

export type JobMatch = {
  jobId: string;
  company: string;
  title: string;
  /**
   * Normalizado a escala 0-100 en `jobs.service.ts`.
   *
   * TODO(backend): confirmar la escala real (`0-1` vs `0-100`) de `matchRate`
   * con un request real contra `/api/jobs/matches`; hoy se asume fracción si
   * el valor crudo es `<= 1`.
   */
  matchRate: number;
};

export type Job = {
  id: string;
  company: string;
  title: string;
  description: string;
  createdAt: string;
  skills: JobSkill[];
};
