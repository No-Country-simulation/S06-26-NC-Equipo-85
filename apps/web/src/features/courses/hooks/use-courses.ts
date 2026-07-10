import { useQuery } from "@tanstack/react-query";
import { getCourseById, getCourses } from "@/services/courses/courses.service";

/**
 * Catálogo completo de formaciones (`GET /api/v1/courses`).
 *
 * El backend no soporta filtros server-side, así que esta query siempre trae
 * el catálogo completo y el filtrado (proveedor/nivel/categoría de skill)
 * ocurre client-side en `courses-page` vía
 * `features/courses/utils/course-filters.ts`.
 */
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}

/**
 * Detalle de un curso para la vista `/courses/[id]`.
 *
 * El backend no expone un endpoint de detalle: `getCourseById` resuelve sobre
 * el catálogo completo (ver service). Se cachea por id para el deep-link.
 */
export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });
}
