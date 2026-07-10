import { z } from "zod";

const TYPES = ["WORKSHOP", "BOOTCAMP", "WEBINAR", "JOB_EXPERIENCE"] as const;

/**
 * Validación del formulario de crear/editar experiencia (MENTOR).
 *
 * Refleja el body `ExperienceUpsertRequest`. `dateTime` llega del input
 * `datetime-local` (sin zona); el componente lo convierte a ISO 8601 al enviar.
 * Mensajes en español, igual criterio que el resto de los schemas del proyecto.
 */
export const experienceSchema = z.object({
  title: z.string().trim().min(1, "Ingresá un título."),
  description: z.string().trim().min(1, "Ingresá una descripción."),
  speakerRole: z.string().trim().min(1, "Ingresá el rol del/la speaker."),
  type: z.enum(TYPES, { message: "Elegí un tipo de experiencia." }),
  contentUrl: z
    .string()
    .trim()
    .min(1, "Ingresá el enlace al contenido.")
    .url("Ingresá una URL válida."),
  dateTime: z.string().min(1, "Elegí una fecha y hora."),
  skillIds: z.array(z.string()),
});

/** Valores iniciales del modo "crear" (form completo y válido en tipos). */
export const EXPERIENCE_DEFAULT_VALUES = {
  title: "",
  description: "",
  speakerRole: "",
  type: "WORKSHOP",
  contentUrl: "",
  dateTime: "",
  skillIds: [],
} satisfies z.infer<typeof experienceSchema>;
