import { ApiError, apiRequest } from "@/lib/api";
import { normalizePercentage } from "@/lib/normalize";
import { getJobExtras, getSkillCategory } from "@/lib/mockDataTemp";
import type { Job, JobMatch } from "./jobs.types";

/**
 * Obtiene las vacantes compatibles con el perfil del usuario autenticado
 * (`GET /api/v1/jobs/matches` 🔒).
 *
 * El usuario se infiere del Bearer token: el endpoint ya no acepta `userId`
 * (se resolvió el bloqueante histórico, ver memoria de integración). Acepta un
 * `minMatch` opcional (0-100) para filtrar por umbral; se omite salvo que el
 * llamador lo pase. Una lista vacía es un estado válido (empty state en la UI):
 * consume siempre el backend real, sin mock de respaldo.
 */
export async function getJobMatches(minMatch?: number): Promise<JobMatch[]> {
  const params = new URLSearchParams();
  if (minMatch !== undefined) {
    params.set("minMatch", String(minMatch));
  }

  const query = params.toString();
  const matches = await apiRequest<JobMatch[]>(
    `/api/v1/jobs/matches${query ? `?${query}` : ""}`,
  );

  return (matches ?? []).map((match) => ({
    ...match,
    matchRate: normalizePercentage(match.matchRate),
  }));
}

/** Forma cruda de `GET /api/v1/jobs/{id}` (`JobDetailResponse`). */
type JobDetailResponse = {
  id: string;
  company: string;
  title: string;
  description: string;
  requiredSkills: string[];
};

/**
 * Obtiene el detalle de una vacante (`GET /api/v1/jobs/{id}`).
 *
 * `requiredSkills` llega como lista de nombres; se transforma a `JobSkill[]`
 * completando la categoría, y se agregan modalidad/ubicación/salario/empresa/
 * beneficios/antigüedad desde `mockDataTemp` (temporal, por `title`). Devuelve
 * `null` cuando el backend responde 404 (vacante inexistente), igual criterio
 * que `profile.service.getProfile`, para que la UI lo trate como estado.
 */
export async function getJobById(id: string): Promise<Job | null> {
  try {
    const job = await apiRequest<JobDetailResponse>(`/api/v1/jobs/${id}`);

    return {
      id: job.id,
      company: job.company,
      title: job.title,
      description: job.description,
      requiredSkills: (job.requiredSkills ?? []).map((name) => ({
        name,
        category: getSkillCategory(name),
      })),
      ...getJobExtras(job.title),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
