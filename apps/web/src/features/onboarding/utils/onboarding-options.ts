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

export const GENDER_OPTIONS = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "no-binario", label: "No binario" },
  { value: "prefiero-no-decir", label: "Prefiero no decirlo" },
  { value: "otro", label: "Otro" },
] as const satisfies readonly SelectOption[];

export const TECH_LEVEL_OPTIONS = [
  { value: "sin-experiencia", label: "Estoy empezando desde cero" },
  { value: "inicial", label: "Inicial / junior" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
] as const satisfies readonly SelectOption[];

export const TECH_AREA_OPTIONS = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full Stack" },
  { value: "data", label: "Data / Analytics" },
  { value: "ux-ui", label: "UX/UI" },
  { value: "qa", label: "QA / Testing" },
  { value: "devops", label: "DevOps / Cloud" },
  { value: "ia", label: "Inteligencia artificial" },
  { value: "no-definido", label: "Todavía no lo sé" },
] as const satisfies readonly SelectOption[];

export const OBJECTIVE_OPTIONS = [
  { value: "estudiar", label: "Quiero estudiar tecnología" },
  { value: "definir-camino", label: "Quiero definir mi camino" },
  { value: "buscar-empleo", label: "Quiero conseguir mi primer empleo" },
  { value: "cambiar-empleo", label: "Quiero cambiar o mejorar mi empleo actual" },
] as const satisfies readonly SelectOption[];