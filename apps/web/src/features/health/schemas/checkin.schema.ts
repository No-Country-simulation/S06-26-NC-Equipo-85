import { z } from "zod";

/** Moods de la UI (`@app/ui`). Fuente para el enum del formulario. */
const MOOD_IDS = [
  "feliz",
  "cansado",
  "triste",
  "ansioso",
  "sobrecargado",
] as const;

const MAX_CONTEXT_LENGTH = 500;

/**
 * Validación del formulario de check-in.
 *
 * El backend pide `emoji` (enum) + `rating` 1–5 + `context` opcional. Acá el
 * `mood` es el id de la UI; el mapeo a `MoodEmoji` ocurre al enviar (ver
 * `utils/mood.ts`). `rating` arranca en 0 (sin elegir) y se rechaza hasta que
 * el usuario selecciona un nivel.
 */
export const checkinSchema = z.object({
  mood: z.enum(MOOD_IDS, { message: "Elegí cómo te sentís hoy." }),
  rating: z
    .number()
    .int()
    .min(1, "Elegí un nivel del 1 al 5.")
    .max(5, "Elegí un nivel del 1 al 5."),
  context: z.string().trim().max(MAX_CONTEXT_LENGTH).optional(),
});

export const CHECKIN_DEFAULT_VALUES = {
  rating: 0,
  context: "",
} satisfies Partial<z.infer<typeof checkinSchema>>;
