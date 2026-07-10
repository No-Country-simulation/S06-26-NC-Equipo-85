import { apiRequest } from "@/lib/api";
import type { Course } from "./courses.types";

const COURSES_PATH = "/api/v1/courses";

/**
 * Obtiene el catálogo completo de formaciones (`GET /api/v1/courses`).
 *
 * El backend no soporta filtros ni paginación server-side; el filtrado por
 * proveedor/nivel/categoría de skill se aplica client-side sobre esta respuesta
 * (ver `features/courses/utils/course-filters.ts`), no acá. Consume siempre el
 * backend real: si el catálogo viene vacío la UI muestra su empty state, sin
 * mock de respaldo.
 */
export async function getCourses(): Promise<Course[]> {
  const courses = await apiRequest<Course[]>(COURSES_PATH);

  return courses ?? [];
}
