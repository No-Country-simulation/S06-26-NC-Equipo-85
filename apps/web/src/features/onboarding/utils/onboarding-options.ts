import type {
  OnboardingStepDefinition,
  SelectOption,
} from "../types/onboarding.types";

export const ONBOARDING_STEPS = [
  {
    id: 0,
    title: "Datos personales",
    description: "Información básica para personalizar la orientación.",
  },
  {
    id: 1,
    title: "Perfil profesional",
    description: "Contexto técnico, objetivo y área de interés.",
  },
  {
    id: 2,
    title: "Confirmación",
    description: "Revisión final antes de generar la orientación.",
  },
] as const satisfies readonly OnboardingStepDefinition[];

/**
 * Género — enum `gender_type` (MASCULINE, FEMININE, OTHER).
 *
 * Se conservan 5 labels inclusivos en la UI; `no-binario`, `prefiero-no-decir`
 * y `otro` se reducen a `OTHER` vía `apiValue` al enviar al backend.
 */
export const GENDER_OPTIONS = [
  { value: "mujer", label: "Mujer", apiValue: "FEMININE" },
  { value: "hombre", label: "Hombre", apiValue: "MASCULINE" },
  { value: "no-binario", label: "No binario", apiValue: "OTHER" },
  { value: "prefiero-no-decir", label: "Prefiero no decirlo", apiValue: "OTHER" },
  { value: "otro", label: "Otro", apiValue: "OTHER" },
] as const satisfies readonly SelectOption[];

/**
 * País — campo `country` (string libre en el backend). Lista acotada a los
 * mercados objetivo del MVP; el valor enviado es la etiqueta tal cual.
 */
export const COUNTRY_OPTIONS = [
  { value: "Argentina", label: "Argentina" },
  { value: "Brasil", label: "Brasil" },
  { value: "Chile", label: "Chile" },
  { value: "Colombia", label: "Colombia" },
  { value: "México", label: "México" },
  { value: "Perú", label: "Perú" },
  { value: "Uruguay", label: "Uruguay" },
  { value: "Otro", label: "Otro" },
] as const satisfies readonly SelectOption[];

/**
 * Nivel educativo — enum `education_level_type`.
 * (`SCHOOL` corrige el typo `HIGH_SCOOL` del diagrama original.)
 */
export const EDUCATION_LEVEL_OPTIONS = [
  { value: "SCHOOL", label: "Secundario" },
  { value: "TECHNICAL", label: "Técnico / Terciario" },
  { value: "UNDERGRADUATE", label: "Universitario (grado)" },
  { value: "POSTGRADUATE", label: "Posgrado" },
  { value: "SELF_TAUGHT", label: "Autodidacta" },
] as const satisfies readonly SelectOption[];

/**
 * Nivel profesional — enum `level_type` (BEGINNER, INTERMEDIATE, ADVANCED).
 * (`INTERMEDIATE` corrige el typo `INTERMADIATE` del diagrama original.)
 * Labels cortas: se muestran como chips seleccionables (no como select).
 */
export const TECH_LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Principiante" },
  { value: "INTERMEDIATE", label: "Intermedio" },
  { value: "ADVANCED", label: "Avanzado" },
] as const satisfies readonly SelectOption[];

/**
 * Área de interés — enum `skill_category`. Alineado al grafo de skills del
 * backend para que el match score y los filtros de vacantes/cursos compartan
 * el mismo catálogo. Se muestran como chips seleccionables.
 */
export const TECH_AREA_OPTIONS = [
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "MOBILE", label: "Mobile" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "DESIGN_UX_UI", label: "Diseño UX/UI" },
  { value: "SOFT_SKILLS", label: "Habilidades blandas" },
] as const satisfies readonly SelectOption[];

/**
 * Objetivo — campo `objective` (string libre en el backend). Se muestran como
 * tarjetas de selección (radio cards) con descripción de apoyo; el valor se
 * envía tal cual como string.
 */
export const OBJECTIVE_OPTIONS = [
  {
    value: "primer-empleo",
    label: "Conseguir mi primer empleo",
    description: "Estoy empezando en tech",
  },
  {
    value: "reconversion",
    label: "Reconvertir mi carrera",
    description: "Vengo de otra área",
  },
  {
    value: "mejorar",
    label: "Mejorar mis skills",
    description: "Ya trabajo y quiero crecer",
  },
] as const satisfies readonly SelectOption[];

/**
 * Resuelve el valor que se envía al backend para una opción dada.
 * Devuelve `apiValue` si existe (mapeo UI→enum) o el `value` tal cual.
 */
export function resolveApiValue(
  options: readonly SelectOption[],
  value: string,
): string {
  return options.find((option) => option.value === value)?.apiValue ?? value;
}