import { z } from "zod";

const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Validación del análisis de texto libre.
 *
 * Acepta hasta 1000 caracteres; exigimos algo de contenido para no enviar un
 * texto vacío a la IA.
 */
export const textAnalysisSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Contanos algo para poder acompañarte.")
    .max(MAX_DESCRIPTION_LENGTH, "Máximo 1000 caracteres."),
});

export const TEXT_ANALYSIS_DEFAULT_VALUES = {
  description: "",
} satisfies z.infer<typeof textAnalysisSchema>;

export { MAX_DESCRIPTION_LENGTH };
