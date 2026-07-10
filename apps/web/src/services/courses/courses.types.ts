import type { SkillCategory } from "@/services/skills/skills.types";

/**
 * Contratos del catálogo de formaciones.
 *
 * Fuente de verdad del backend v1: `GET /api/v1/courses` → `{ id, name,
 * provider }` (ver `CourseResponse` del OpenAPI). El resto de los campos
 * (`level`, `url`, `skills`, `description`, `durationHours`) **ya no** vienen
 * del backend: se completan con data mock centralizada en
 * [`lib/mockDataTemp`](../../lib/mockDataTemp.ts), cruzada por nombre en
 * `courses.service.ts`. Cuando el backend los vuelva a exponer, se quita el
 * enriquecido del service y esta división desaparece.
 */

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

/** Skill que aporta un curso. `category` es mock temporal (ver `mockDataTemp`). */
export type CourseSkill = {
  name: string;
  category: SkillCategory;
};

export type Course = {
  // --- Reales (backend, `CourseResponse`) ---
  id: string;
  name: string;
  provider: string;
  // --- Mock temporal (mockDataTemp), hasta que el backend los reexponga ---
  level: CourseLevel;
  /** Video embebible (YouTube/Vimeo) o enlace externo del proveedor. */
  url: string;
  skills: CourseSkill[];
  description: string;
  durationHours: number;
};

/**
 * Filtros aplicados client-side sobre la respuesta ya cacheada de
 * `GET /api/v1/courses`. `provider` sale de la data real; `level` y
 * `skillCategory` operan sobre los campos mock (ver `mockDataTemp`).
 */
export type CourseFilters = {
  provider?: string;
  level?: CourseLevel;
  skillCategory?: SkillCategory;
};
