import { apiRequest } from "@/lib/api";
import { getCourseExtras } from "@/lib/mockDataTemp";
import type { Course } from "./courses.types";

const COURSES_PATH = "/api/v1/courses";

/** Forma cruda de `GET /api/v1/courses` (`CourseResponse`). */
type CourseResponse = {
  id: string;
  name: string;
  provider: string;
};

/**
 * Enriquece un curso real (`{ id, name, provider }`) con los campos que el
 * backend v1 ya no envía (nivel, url, skills, descripción, duración), tomados
 * de `mockDataTemp` por nombre. Temporal hasta que el backend los reexponga.
 */
function enrichCourse(raw: CourseResponse): Course {
  return {
    id: raw.id,
    name: raw.name,
    provider: raw.provider,
    ...getCourseExtras(raw.name),
  };
}

/**
 * Obtiene el catálogo completo de formaciones (`GET /api/v1/courses`).
 *
 * El backend no soporta filtros ni paginación server-side; el filtrado por
 * proveedor/nivel/categoría de skill se aplica client-side sobre esta respuesta
 * (ver `features/courses/utils/course-filters.ts`), no acá. Consume siempre el
 * backend real (enriquecido con `mockDataTemp`): si el catálogo viene vacío la
 * UI muestra su empty state.
 */
export async function getCourses(): Promise<Course[]> {
  const courses = await apiRequest<CourseResponse[]>(COURSES_PATH);

  return (courses ?? []).map(enrichCourse);
}

/**
 * Obtiene un curso por id para la vista de detalle (`/courses/[id]`).
 *
 * El backend no expone `GET /api/v1/courses/{id}`, así que se resuelve sobre el
 * catálogo completo (misma respuesta que ya cachea la lista). Devuelve `null`
 * si el id no existe, para que la UI lo trate como "curso no encontrado".
 */
export async function getCourseById(id: string): Promise<Course | null> {
  const courses = await getCourses();

  return courses.find((course) => course.id === id) ?? null;
}
