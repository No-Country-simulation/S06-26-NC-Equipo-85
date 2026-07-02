import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/services/courses/courses.service";

/**
 * Catálogo completo de formaciones (`GET /api/courses`).
 *
 * El backend no soporta filtros server-side, así que esta query siempre trae
 * el catálogo completo y el filtrado (proveedor/nivel/categoría de skill)
 * ocurre client-side en `courses-page` vía
 * `features/courses/utils/course-filters.ts`. Tampoco expone un endpoint de
 * detalle por curso, así que no hay `useCourse(id)`: los componentes
 * reutilizan el `Course` completo ya cargado en esta lista (ver
 * `course-video-dialog`).
 *
 * TODO(backend): si se necesita deep-link a un curso puntual, pedir
 * `GET /api/courses/{id}`.
 */
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}
