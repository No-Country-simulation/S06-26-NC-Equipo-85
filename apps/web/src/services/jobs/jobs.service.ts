import { ApiError, apiRequest } from "@/lib/api";
import { normalizePercentage } from "@/lib/normalize";
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

/**
 * Obtiene el detalle de una vacante (`GET /api/v1/jobs/{id}`).
 *
 * Devuelve `null` cuando el backend responde 404 (vacante inexistente), igual
 * criterio que `profile.service.getProfile`, para que la UI lo trate como un
 * estado ("vacante no encontrada") en vez de una excepción.
 */
export async function getJobById(id: string): Promise<Job | null> {
  try {
    return await apiRequest<Job>(`/api/v1/jobs/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
