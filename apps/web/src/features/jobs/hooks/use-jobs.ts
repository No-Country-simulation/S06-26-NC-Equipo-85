import { useQuery } from "@tanstack/react-query";
import { getJobById, getJobMatches } from "@/services/jobs/jobs.service";
import { getUserIdFromToken } from "@/lib/jwt";
import { useUserStore } from "@/store/user-store";

/**
 * Vacantes compatibles con el usuario autenticado (`GET /api/jobs/matches`).
 *
 * `userId` no vive en el store ni en `ProfileResponse`: se deriva del claim
 * `sub` del access token en cada render. La query queda `enabled: false`
 * mientras no haya `userId` (token ausente o no decodificable), así el hook
 * nunca llama al endpoint con un `userId` vacío; el componente distingue ese
 * caso (`userId` es `null`) de un error de red real.
 */
export function useJobMatches() {
  const token = useUserStore((state) => state.token);
  const userId = getUserIdFromToken(token);

  const query = useQuery({
    queryKey: ["jobs", "matches", userId],
    queryFn: () => getJobMatches(userId as string),
    enabled: !!userId,
  });

  return { ...query, userId };
}

/** Detalle de una vacante (`GET /api/jobs/{id}`). */
export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}
