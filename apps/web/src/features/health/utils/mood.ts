import { DEFAULT_MOODS, type Mood } from "@app/ui";
import type { MoodEmoji } from "@/services/health/health.types";

/**
 * Puente entre los moods de la UI (`@app/ui` — `feliz`, `cansado`, …) y el enum
 * `MoodEmoji` del backend (`HAPPY`, `DEPRESSED`, …).
 *
 * El picker (`EmojiCheckIn`) trabaja con los 5 moods de la UI; el contrato usa
 * 5 valores propios. No hay traducción 1:1 obvia, así que el mapeo es una
 * decisión de producto documentada acá (un único lugar):
 *   feliz → HAPPY · cansado → NEUTRAL · triste → DEPRESSED ·
 *   ansioso → ANXIOUS · sobrecargado → FURIOUS.
 */
export const MOOD_TO_EMOJI: Record<Mood, MoodEmoji> = {
  feliz: "HAPPY",
  cansado: "NEUTRAL",
  triste: "DEPRESSED",
  ansioso: "ANXIOUS",
  sobrecargado: "FURIOUS",
};

/** Inversa de {@link MOOD_TO_EMOJI}, para renderizar el historial del backend. */
export const EMOJI_TO_MOOD: Record<MoodEmoji, Mood> = {
  HAPPY: "feliz",
  NEUTRAL: "cansado",
  DEPRESSED: "triste",
  ANXIOUS: "ansioso",
  FURIOUS: "sobrecargado",
};

/** Glifo emoji por mood, reutilizando el del picker para mantener coherencia. */
const MOOD_GLYPH: Record<Mood, string> = DEFAULT_MOODS.reduce(
  (acc, option) => ({ ...acc, [option.id]: option.emoji }),
  {} as Record<Mood, string>,
);

/** Glifo emoji a mostrar para un `MoodEmoji` del backend. */
export function emojiGlyph(emoji: MoodEmoji): string {
  return MOOD_GLYPH[EMOJI_TO_MOOD[emoji]];
}

/** Niveles de bienestar 1–5 que ofrece el control de rating. */
export const RATING_VALUES = [1, 2, 3, 4, 5] as const;
