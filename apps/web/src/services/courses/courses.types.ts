import type { SkillCategory } from "@/services/skills/skills.types";

/**
 * Contratos del catálogo de formaciones.
 *
 * Fuente de verdad: `GET /api/courses` del OpenAPI. El tipo es un espejo 1:1
 * del contrato real, aplanando la relación circular `CourseSkill` (`{ id,
 * course, skill }`) a `{ id, name, category }`. Los campos que la UI anterior
 * asumía (`duration`, `description`, `area` propia, `videoUrl` como campo del
 * curso) no existen en el backend real y se eliminan en vez de marcarse
 * opcionales, para no invitar a la UI a seguir mostrando datos inventados.
 *
 * TODO(backend): pedir `description` y `duration` en `Course`; hoy el grid y
 * la tabla de Formaciones solo pueden mostrar nombre/proveedor/nivel/skills.
 */

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseSkill = {
  id: string;
  name: string;
  category: SkillCategory;
};

export type Course = {
  id: string;
  name: string;
  provider: string;
  level: CourseLevel;
  /**
   * Contenido del curso. Puede ser una URL embebible (YouTube/Vimeo) o un
   * enlace externo; `features/courses/utils/course-media.ts` decide cómo
   * abrirla.
   */
  url: string;
  skills: CourseSkill[];
};

/**
 * Filtros aplicados client-side sobre la respuesta ya cacheada de
 * `GET /api/courses` (ver `features/courses/utils/course-filters.ts`).
 *
 * TODO(backend): el endpoint no acepta query params de filtro ni paginación
 * server-side; si el catálogo crece, pedir `provider`/`level`/`skillCategory`
 * y paginación en el listado.
 */
export type CourseFilters = {
  provider?: string;
  level?: CourseLevel;
  skillCategory?: SkillCategory;
};
