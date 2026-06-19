import type { z } from "zod";
import type { onboardingFormSchema } from "../schemas/onboarding.schema";

export type OnboardingStep = 0 | 1 | 2;

/**
 * Enums del backend (tabla Profile y catálogos). El frontend persiste estos
 * valores tal cual para enviarlos al endpoint `/orientar` sin transformaciones.
 *
 * Nota: el diagrama original traía typos (`HIGH_SCOOL`, `INTERMADIATE`).
 * Acá usamos la grafía corregida; el backend debe alinear sus ENUMs a estos.
 */
export type GenderEnum = "MASCULINE" | "FEMININE" | "OTHER";

export type EducationLevelEnum =
  | "SCHOOL"
  | "TECHNICAL"
  | "UNDERGRADUATE"
  | "POSTGRADUATE"
  | "SELF_TAUGHT";

export type ProfessionalLevelEnum = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type SkillCategoryEnum =
  | "BACKEND"
  | "FRONTEND"
  | "MOBILE"
  | "DATA_SCIENCE"
  | "DESIGN_UX_UI"
  | "SOFT_SKILLS";

/**
 * Opción de un selector. `apiValue` se usa cuando el valor mostrado/persistido
 * en la UI no coincide 1:1 con el enum del backend (p. ej. género: 5 labels
 * inclusivos que se reducen a 3 valores). Si se omite, el `value` ya es el enum.
 */
export type SelectOption = {
  value: string;
  label: string;
  apiValue?: string;
  /** Texto de apoyo para opciones que se muestran como tarjetas (radio cards). */
  description?: string;
};

export type OnboardingStepDefinition = {
  id: OnboardingStep;
  title: string;
  description: string;
};

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;