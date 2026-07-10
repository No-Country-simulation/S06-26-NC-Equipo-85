/**
 * Contratos del catálogo transversal de skills.
 *
 * Fuente de verdad del backend v1: `GET /api/v1/skills` → `{ id, name }` (ver
 * `SkillResponse` del OpenAPI). La `category` **ya no** viene del backend: se
 * completa con data mock centralizada en
 * [`lib/mockDataTemp`](../../lib/mockDataTemp.ts) (cruzada por nombre en
 * `skills.service.ts`). Cuando el backend la reexponga, se quita ese enriquecido.
 */

export type SkillCategory =
  | "BACKEND"
  | "FRONTEND"
  | "MOBILE"
  | "DATA_SCIENCE"
  | "DESIGN_UX_UI"
  | "SOFT_SKILLS";

export type Skill = {
  // --- Reales (backend, `SkillResponse`) ---
  id: string;
  name: string;
  // --- Mock temporal (mockDataTemp) ---
  category: SkillCategory;
};
