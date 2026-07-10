"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@app/ui/lib/utils";

export type Mood = "feliz" | "cansado" | "triste" | "ansioso" | "sobrecargado";

type MoodOption = { id: Mood; emoji: string; label: string };

// Defaults en ES (la app puede sobreescribir los labels con next-intl).
const DEFAULT_MOODS: MoodOption[] = [
  { id: "feliz", emoji: "😄", label: "Feliz" },
  { id: "cansado", emoji: "😴", label: "Cansado" },
  { id: "triste", emoji: "😢", label: "Triste" },
  { id: "ansioso", emoji: "😰", label: "Ansioso" },
  { id: "sobrecargado", emoji: "🤯", label: "Sobrecargado" },
];

type EmojiCheckInProps = {
  /** Modo controlado. */
  value?: Mood;
  /** Valor inicial en modo no controlado. */
  defaultValue?: Mood;
  onChange?: (mood: Mood) => void;
  /** Nombre accesible del grupo. */
  label?: string;
  /** Permite sobreescribir labels (i18n) sin perder ids/emojis. */
  moods?: MoodOption[];
  size?: "sm" | "md";
  className?: string;
};

function EmojiCheckIn({
  value,
  defaultValue,
  onChange,
  label = "¿Cómo te sentís hoy?",
  moods = DEFAULT_MOODS,
  size = "md",
  className,
}: EmojiCheckInProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Mood | undefined>(defaultValue);
  const selected = isControlled ? value : internal;

  // Índice con foco (roving tabindex). Si no hay selección, foco en el primero.
  const selectedIndex = moods.findIndex((m) => m.id === selected);
  const [focusIndex, setFocusIndex] = React.useState(
    selectedIndex >= 0 ? selectedIndex : 0
  );
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const mood = moods[index];
    if (!mood) return;
    if (!isControlled) setInternal(mood.id);
    onChange?.(mood.id);
  }

  function focusItem(index: number) {
    const clamped = (index + moods.length) % moods.length;
    setFocusIndex(clamped);
    refs.current[clamped]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusItem(index + 1);
        select((index + 1 + moods.length) % moods.length);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusItem(index - 1);
        select((index - 1 + moods.length) % moods.length);
        break;
      case "Home":
        event.preventDefault();
        focusItem(0);
        select(0);
        break;
      case "End":
        event.preventDefault();
        focusItem(moods.length - 1);
        select(moods.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(index);
        break;
    }
  }

  const buttonSize = size === "sm" ? "size-10 text-xl" : "size-14 text-3xl";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {moods.map((mood, index) => {
        const isSelected = mood.id === selected;
        const isFocusable = focusIndex === index;
        return (
          <button
            key={mood.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={mood.label}
            tabIndex={isFocusable ? 0 : -1}
            data-slot="emoji-check-in-option"
            onClick={() => {
              setFocusIndex(index);
              select(index);
            }}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "flex items-center justify-center rounded-full border-2 transition-colors outline-none",
              "focus-visible:ring-3 focus-visible:ring-ring/50",
              buttonSize,
              isSelected
                ? "border-azul-horizonte bg-azul-horizonte-soft"
                : "border-transparent bg-muted hover:bg-arena"
            )}
          >
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ scale: isSelected ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              {mood.emoji}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

export { EmojiCheckIn, DEFAULT_MOODS };
export type { EmojiCheckInProps, MoodOption };
