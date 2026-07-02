import type { Course, CourseFilters } from "@/services/courses/courses.types";

/**
 * Filtra el catálogo de cursos ya cargado.
 *
 * El backend no soporta filtros server-side (`GET /api/courses` siempre
 * devuelve el catálogo completo), así que el filtrado ocurre acá, sobre la
 * respuesta que TanStack Query ya cacheó.
 */
export function filterCourses(courses: Course[], filters: CourseFilters): Course[] {
  return courses.filter((course) => {
    if (filters.provider && course.provider !== filters.provider) return false;
    if (filters.level && course.level !== filters.level) return false;
    if (
      filters.skillCategory &&
      !course.skills.some((skill) => skill.category === filters.skillCategory)
    ) {
      return false;
    }
    return true;
  });
}

/** Proveedores presentes en el catálogo cargado, para poblar el filtro dinámicamente. */
export function getAvailableProviders(courses: Course[]): string[] {
  return Array.from(new Set(courses.map((course) => course.provider))).sort();
}
