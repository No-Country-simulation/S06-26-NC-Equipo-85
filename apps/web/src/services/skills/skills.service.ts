import { apiRequest } from "@/lib/api";
import type { Skill } from "./skills.types";

const SKILLS_PATH = "/api/v1/skills";

/**
 * Obtiene el catálogo transversal de skills (`GET /api/v1/skills`).
 *
 * Service agnóstico de React: lo consumen los hooks de features (courses para
 * filtros, jobs para categorías) sin duplicar el tipo ni hacer `fetch` directo.
 * Consume siempre el backend real: sin skills el endpoint devuelve `[]` y la UI
 * simplemente no ofrece opciones de filtro (no hay mock de respaldo).
 */
export async function getSkills(): Promise<Skill[]> {
  const skills = await apiRequest<Skill[]>(SKILLS_PATH);

  return skills ?? [];
}
