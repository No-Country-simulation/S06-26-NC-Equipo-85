import { ApiError, apiRequest } from "@/lib/api";
import { normalizePercentage } from "@/lib/normalize";
import type { Job, JobMatch } from "./jobs.types";

/**
 * Obtiene las vacantes compatibles con el perfil del usuario
 * (`GET /api/jobs/matches?userId=`).
 *
 * `userId` se deriva del claim `sub` del JWT (`lib/jwt.ts`), no de un store: el
 * hook de la feature (`use-jobs.ts`) resuelve ese valor y decide si la query
 * está `enabled`. Una lista vacía es un estado válido (empty state en la UI):
 * consume siempre el backend real, sin mock de respaldo.
 *
 * TODO(backend): el `userId` viaja como query param porque el endpoint lo
 * exige así; sería más robusto que el backend lo infiriera del Bearer token,
 * igual que ya hace con `/api/v1/profile`.
 */
export async function getJobMatches(userId: string): Promise<JobMatch[]> {
  const params = new URLSearchParams({ userId });
  const matches = await apiRequest<JobMatch[]>(
    `/api/jobs/matches?${params.toString()}`,
  );

  return (matches ?? []).map((match) => ({
    ...match,
    matchRate: normalizePercentage(match.matchRate),
  }));
}

/**
 * Obtiene el detalle de una vacante (`GET /api/jobs/{id}`).
 *
 * Devuelve `null` cuando el backend responde 404 (vacante inexistente), igual
 * criterio que `profile.service.getProfile`, para que la UI lo trate como un
 * estado ("vacante no encontrada") en vez de una excepción.
 */
export async function getJobById(id: string): Promise<Job | null> {
  try {
    return await apiRequest<Job>(`/api/jobs/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}
