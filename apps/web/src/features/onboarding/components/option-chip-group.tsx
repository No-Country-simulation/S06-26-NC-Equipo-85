import { cn } from "@app/ui";
import type { SelectOption } from "../types/onboarding.types";

type OptionChipGroupProps = {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Etiqueta accesible del grupo (radiogroup). */
  ariaLabel: string;
  invalid?: boolean;
};

/**
 * Grupo de chips de selección única (nivel, área). Estilo del design system:
 * chip activo en terracota-soft + borde terracota; inactivo neutro.
 * Accesible como `radiogroup` con navegación por foco.
 */
export function OptionChipGroup({
  options,
  value,
  onChange,
  ariaLabel,
  invalid,
}: OptionChipGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "border-terracota bg-terracota-soft text-terracota"
                : "border-border bg-card text-foreground hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
