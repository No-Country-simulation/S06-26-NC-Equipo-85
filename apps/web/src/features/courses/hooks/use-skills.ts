import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/services/skills/skills.service";

/** Catálogo casi estático: cachea 30 min antes de refetch en background. */
const SKILLS_STALE_TIME_MS = 30 * 60 * 1000;

/**
 * Catálogo de skills para alimentar el filtro por categoría de Formaciones.
 *
 * Envuelve `services/skills` con la query key compartida `["skills"]`: si otra
 * feature (p. ej. jobs) monta un hook equivalente sobre el mismo service, la
 * segunda lectura sale de caché en vez de disparar una nueva request.
 */
export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: SKILLS_STALE_TIME_MS,
  });
}
