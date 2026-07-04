import { useQuery } from "@tanstack/react-query";
import { getExperiencias } from "@/services/experiencias/experiencias.service";
import type { ExperienceFilters } from "@/services/experiencias/experiencias.types";

export function useExperiencias(filters?: ExperienceFilters) {
  return useQuery({
    queryKey: ["experiencias", filters],
    queryFn: () => getExperiencias(filters),
  });
}