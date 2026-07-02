/**
 * Contratos del catálogo transversal de skills.
 *
 * Fuente de verdad: `GET /api/skills` del OpenAPI (`App BiT API v1`). El
 * schema del backend expone relaciones circulares (`profiles`, `courses`,
 * `jobs`, `experiences`) que el front omite deliberadamente: solo interesa la
 * identidad de la skill para cruzarla con jobs/courses vía `skills[].skill`.
 */

export type SkillCategory =
  | "BACKEND"
  | "FRONTEND"
  | "MOBILE"
  | "DATA_SCIENCE"
  | "DESIGN_UX_UI"
  | "SOFT_SKILLS";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
};
