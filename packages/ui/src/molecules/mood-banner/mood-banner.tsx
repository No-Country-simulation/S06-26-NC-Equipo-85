import * as React from "react";

import { cn } from "../../lib/utils";
import { type Mood } from "../../atoms/emoji-check-in";

type MoodContent = {
  emoji: string;
  title: string;
  message: string;
  /** Tono visual; SIEMPRE dentro de la paleta calma (nunca granate). */
  tone: "calm" | "neutral";
};

// Defaults en ES. La app puede sobreescribir vía `content`.
const DEFAULT_CONTENT: Record<Mood, MoodContent> = {
  feliz: {
    emoji: "😄",
    title: "¡Qué bueno verte así!",
    message: "Aprovechá esta energía para avanzar en tu próximo paso.",
    tone: "neutral",
  },
  cansado: {
    emoji: "😴",
    title: "Tomate tu tiempo",
    message: "Descansar también es progreso. Un paso pequeño basta hoy.",
    tone: "neutral",
  },
  triste: {
    emoji: "😢",
    title: "Estamos con vos",
    message: "Si lo necesitás, hablar con alguien puede ayudar.",
    tone: "calm",
  },
  ansioso: {
    emoji: "😰",
    title: "Respirá hondo",
    message: "Una cosa a la vez. No tenés que resolverlo todo hoy.",
    tone: "calm",
  },
  sobrecargado: {
    emoji: "🤯",
    title: "Bajemos el ritmo",
    message: "Priorizá lo esencial y pedí apoyo si te hace falta.",
    tone: "calm",
  },
};

type MoodBannerProps = {
  mood: Mood;
  /** Sobreescribe el contenido por defecto (i18n). */
  content?: Partial<Record<Mood, Partial<MoodContent>>>;
  /** Slot opcional para acción (p. ej. "Hablar con alguien"). */
  action?: React.ReactNode;
  className?: string;
};

function MoodBanner({ mood, content, action, className }: MoodBannerProps) {
  const data = { ...DEFAULT_CONTENT[mood], ...content?.[mood] };

  return (
    <div
      role="status"
      data-slot="mood-banner"
      data-mood={mood}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        // Paleta calma: azul-horizonte / neutros. Nunca granate.
        data.tone === "calm"
          ? "border-azul-horizonte/30 bg-azul-horizonte-soft text-azul-horizonte"
          : "border-arena bg-crema text-cacao",
        className
      )}
    >
      <span aria-hidden="true" className="text-2xl leading-none">
        {data.emoji}
      </span>
      <div className="grid gap-0.5">
        <p className="font-heading text-base font-medium">{data.title}</p>
        <p className="text-sm opacity-90">{data.message}</p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

export { MoodBanner, DEFAULT_CONTENT as MOOD_BANNER_CONTENT };
export type { MoodBannerProps, MoodContent };
