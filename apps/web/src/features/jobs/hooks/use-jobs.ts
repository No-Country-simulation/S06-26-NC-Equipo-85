import { useQuery } from "@tanstack/react-query";
import { getJobById, getJobMatches } from "@/services/jobs/jobs.service";

/**
 * Vacantes compatibles con el usuario autenticado (`GET /api/v1/jobs/matches`).
 *
 * El usuario se infiere del Bearer token en el backend, así que no hay
 * precondición de `userId` (a diferencia de la integración anterior): la query
 * se dispara siempre y una lista vacía es un empty state legítimo.
 */
export function useJobMatches() {
  return useQuery({
    queryKey: ["jobs", "matches"],
    queryFn: () => getJobMatches(),
  });
}

/** Detalle de una vacante (`GET /api/v1/jobs/{id}`). */
export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}
