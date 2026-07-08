import { z } from "zod";

/**
 * Validación del formulario de crear sesión (MENTOR). Refleja el body
 * `SessionCreateRequest`. `scheduleDate` llega del input `datetime-local` (sin
 * zona); el componente lo convierte a ISO 8601 al enviar. Mensajes en español,
 * igual criterio que el resto de los schemas del proyecto.
 */
export const sessionSchema = z.object({
  title: z.string().trim().min(1, "Ingresá un título."),
  scheduleDate: z.string().min(1, "Elegí una fecha y hora."),
  practice: z.boolean(),
});

/** Valores iniciales del form de creación. */
export const SESSION_DEFAULT_VALUES = {
  title: "",
  scheduleDate: "",
  practice: false,
} satisfies z.infer<typeof sessionSchema>;
