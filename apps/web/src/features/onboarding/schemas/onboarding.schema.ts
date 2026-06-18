import { z } from "zod";
import type { SelectOption } from "../types/onboarding.types";
import {
  EDUCATION_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  OBJECTIVE_OPTIONS,
  TECH_AREA_OPTIONS,
  TECH_LEVEL_OPTIONS,
} from "../utils/onboarding-options";

const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

/**
 * Valida que el valor recibido pertenezca a una lista cerrada de opciones.
 * Evita aceptar valores arbitrarios enviados desde el cliente.
 */
function isAllowedOption(
  options: readonly SelectOption[],
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    options.some((option) => option.value === value)
  );
}

export const personalDataSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo.")
    .max(80, "El nombre no puede superar los 80 caracteres."),
  email: z
    .string()
    .trim()
    .email("Ingresá un e-mail válido.")
    .max(120, "El e-mail no puede superar los 120 caracteres."),
  birthDate: z
    .string()
    .min(1, "Ingresá tu fecha de nacimiento.")
    .refine((value) => {
      const date = new Date(value);
      const today = new Date();

      return Number.isFinite(date.getTime()) && date < today;
    }, "Ingresá una fecha de nacimiento válida."),
  gender: z
    .string()
    .min(1, "Seleccioná una opción.")
    .refine(
      (value) => isAllowedOption(GENDER_OPTIONS, value),
      "Seleccioná una opción válida.",
    ),
  educationLevel: z
    .string()
    .min(1, "Seleccioná tu nivel educativo.")
    .refine(
      (value) => isAllowedOption(EDUCATION_LEVEL_OPTIONS, value),
      "Seleccioná un nivel educativo válido.",
    ),
  country: z
    .string()
    .trim()
    .min(2, "Ingresá tu país.")
    .max(60, "El país no puede superar los 60 caracteres."),
  city: z
    .string()
    .trim()
    .min(2, "Ingresá tu ciudad.")
    .max(80, "La ciudad no puede superar los 80 caracteres."),
  whatsapp: z
    .string()
    .trim()
    .regex(phoneRegex, "Ingresá un WhatsApp válido."),
});

export const professionalProfileSchema = z.object({
  techLevel: z
    .string()
    .min(1, "Seleccioná tu nivel actual.")
    .refine(
      (value) => isAllowedOption(TECH_LEVEL_OPTIONS, value),
      "Seleccioná un nivel válido.",
    ),
  techArea: z
    .string()
    .min(1, "Seleccioná un área de interés.")
    .refine(
      (value) => isAllowedOption(TECH_AREA_OPTIONS, value),
      "Seleccioná un área válida.",
    ),
  objective: z
    .string()
    .min(1, "Seleccioná tu objetivo principal.")
    .refine(
      (value) => isAllowedOption(OBJECTIVE_OPTIONS, value),
      "Seleccioná un objetivo válido.",
    ),
  experienceSummary: z
    .string()
    .trim()
    .max(500, "El resumen no puede superar los 500 caracteres.")
    .optional(),
});

export const onboardingFormSchema = personalDataSchema.merge(
  professionalProfileSchema,
);

export const ONBOARDING_DEFAULT_VALUES = {
  fullName: "",
  email: "",
  birthDate: "",
  gender: "",
  educationLevel: "",
  country: "",
  city: "",
  whatsapp: "",
  techLevel: "",
  techArea: "",
  objective: "",
  experienceSummary: "",
} satisfies z.infer<typeof onboardingFormSchema>;