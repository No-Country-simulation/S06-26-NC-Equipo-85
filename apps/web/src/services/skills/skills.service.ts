import { apiRequest } from "@/lib/api";
import { getSkillCategory } from "@/lib/mockDataTemp";
import type { Skill } from "./skills.types";

const SKILLS_PATH = "/api/v1/skills";

/** Forma cruda de `GET /api/v1/skills` (`SkillResponse`): sin `category`. */
type SkillResponse = {
  id: string;
  name: string;
};

/**
 * Obtiene el catálogo transversal de skills (`GET /api/v1/skills`).
 *
 * Service agnóstico de React: lo consumen los hooks de features (courses para
 * filtros, jobs para categorías) sin duplicar el tipo ni hacer `fetch` directo.
 * El backend devuelve `{ id, name }`; la `category` se completa desde
 * `mockDataTemp` (temporal). Sin skills el endpoint devuelve `[]` y la UI
 * simplemente no ofrece opciones de filtro (no hay mock de respaldo de la data
 * real en sí).
 */
export async function getSkills(): Promise<Skill[]> {
  const skills = await apiRequest<SkillResponse[]>(SKILLS_PATH);

  return (skills ?? []).map((skill) => ({
    ...skill,
    category: getSkillCategory(skill.name),
  }));
}
