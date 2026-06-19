import { cn } from "@app/ui";
import type { SelectOption } from "../types/onboarding.types";

type OptionCardGroupProps = {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  /** Etiqueta accesible del grupo (radiogroup). */
  ariaLabel: string;
  invalid?: boolean;
};

/**
 * Grupo de tarjetas de selección única con descripción (objetivo). Cada tarjeta
 * muestra un radio + label + descripción; activa en terracota-soft.
 * Accesible como `radiogroup`.
 */
export function OptionCardGroup({
  options,
  value,
  onChange,
  ariaLabel,
  invalid,
}: OptionCardGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className="flex flex-col gap-2"
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
              "flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "border-terracota bg-terracota-soft"
                : "border-border bg-card hover:bg-muted",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isActive ? "border-terracota" : "border-border",
              )}
            >
              {isActive ? (
                <span className="size-2 rounded-full bg-terracota" />
              ) : null}
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">
                {option.label}
              </span>
              {option.description ? (
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
