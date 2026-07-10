import type { SkillCategory } from "@/services/skills/skills.types";
import type { CourseLevel, CourseSkill } from "@/services/courses/courses.types";

/**
 * DATA MOCK TEMPORAL — CENTRALIZADA.
 *
 * El backend v1 recortó varios contratos y hoy NO devuelve algunos campos que
 * la UI todavía usa. Para no inventar datos dispersos por la app, todos esos
 * campos "faltantes" viven acá, en un único lugar, y se cruzan con la data real
 * en la capa de services (por `name`, que es estable entre entornos):
 *
 * - `GET /api/v1/skills`  → `{ id, name }`            (falta `category`)
 * - `GET /api/v1/courses` → `{ id, name, provider }`  (faltan `level`, `url`, `skills`, `description`, `durationHours`)
 * - `GET /api/v1/jobs/{id}` → `requiredSkills: string[]` (las skills no traen `category`)
 *
 * Cuando el backend vuelva a exponer estos campos, se borra este archivo y se
 * quitan las llamadas a sus helpers en los services correspondientes. No debe
 * usarse desde componentes: solo desde `services/*`.
 */

/**
 * Categoría por nombre de skill. Cubre el seed real del backend + skills que
 * aportan los cursos mockeados. Los nombres son estables, así que la clave es
 * el `name` (no el UUID, que puede cambiar al re-seedear).
 */
const SKILL_CATEGORY_BY_NAME: Record<string, SkillCategory> = {
  Java: "BACKEND",
  "Spring Boot": "BACKEND",
  PostgreSQL: "BACKEND",
  Docker: "BACKEND",
  Git: "BACKEND",
  Angular: "FRONTEND",
  Flutter: "MOBILE",
  Dart: "MOBILE",
};

/** Categoría usada cuando una skill no está mapeada arriba (mock temporal). */
const DEFAULT_SKILL_CATEGORY: SkillCategory = "BACKEND";

/**
 * Devuelve la categoría mockeada de una skill por su nombre. Siempre resuelve
 * (usa `DEFAULT_SKILL_CATEGORY` si no está mapeada) para que la UI nunca reciba
 * una categoría vacía.
 */
export function getSkillCategory(name: string): SkillCategory {
  return SKILL_CATEGORY_BY_NAME[name] ?? DEFAULT_SKILL_CATEGORY;
}

/** Campos de curso que el backend ya no envía, resueltos por nombre de curso. */
type CourseExtras = {
  level: CourseLevel;
  /** URL del contenido: video embebible (YouTube/Vimeo) o enlace externo. */
  url: string;
  /** Nombres de skills que aporta el curso; se enriquecen con su categoría. */
  skillNames: string[];
  description: string;
  durationHours: number;
};

const COURSE_EXTRAS_BY_NAME: Record<string, CourseExtras> = {
  "Java Fundamentals": {
    level: "BEGINNER",
    url: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    skillNames: ["Java"],
    description:
      "Bases del lenguaje Java: sintaxis, tipos, control de flujo y programación orientada a objetos para arrancar de cero.",
    durationHours: 6,
  },
  "Spring Boot Fundamentals": {
    level: "INTERMEDIATE",
    url: "https://www.youtube.com/watch?v=9SGDpanrc8U",
    skillNames: ["Spring Boot", "Java"],
    description:
      "Construí APIs REST con Spring Boot: inyección de dependencias, controladores, servicios y acceso a datos.",
    durationHours: 8,
  },
  "PostgreSQL Essentials": {
    level: "BEGINNER",
    url: "https://www.cloudskillsboost.google/",
    skillNames: ["PostgreSQL"],
    description:
      "Modelado de datos y consultas SQL sobre PostgreSQL: tablas, relaciones, joins e índices básicos.",
    durationHours: 5,
  },
  "Docker Basics": {
    level: "BEGINNER",
    url: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
    skillNames: ["Docker"],
    description:
      "Contenedores desde cero: imágenes, volúmenes, redes y cómo empaquetar tu app para que corra igual en cualquier lado.",
    durationHours: 4,
  },
  "Angular Fundamentals": {
    level: "BEGINNER",
    url: "https://www.oracle.com/lad/education/oracle-next-education/",
    skillNames: ["Angular"],
    description:
      "Primeros pasos con Angular: componentes, plantillas, binding y servicios para armar interfaces web.",
    durationHours: 7,
  },
  "Flutter Fundamentals": {
    level: "BEGINNER",
    url: "https://flutter.dev/learn",
    skillNames: ["Flutter", "Dart"],
    description:
      "Desarrollo de apps móviles multiplataforma con Flutter y Dart: widgets, layout y navegación.",
    durationHours: 7,
  },
};

const DEFAULT_COURSE_EXTRAS: CourseExtras = {
  level: "BEGINNER",
  url: "",
  skillNames: [],
  description: "",
  durationHours: 0,
};

/**
 * Devuelve los campos mockeados de un curso (nivel, url, skills, descripción,
 * duración) por su nombre, ya con las categorías resueltas en `skills`.
 */
export function getCourseExtras(name: string): {
  level: CourseLevel;
  url: string;
  skills: CourseSkill[];
  description: string;
  durationHours: number;
} {
  const extras = COURSE_EXTRAS_BY_NAME[name] ?? DEFAULT_COURSE_EXTRAS;

  return {
    level: extras.level,
    url: extras.url,
    description: extras.description,
    durationHours: extras.durationHours,
    skills: extras.skillNames.map((skillName) => ({
      name: skillName,
      category: getSkillCategory(skillName),
    })),
  };
}
