import { cn } from "@app/ui";
import type { SelectOption } from "../types/onboarding.types";

type CommonProps = {
  options: readonly SelectOption[];
  /** Etiqueta accesible del grupo (radiogroup o group). */
  ariaLabel: string;
  invalid?: boolean;
};

type OptionChipGroupProps =
  | (CommonProps & {
      multiple?: false;
      value: string;
      onChange: (value: string) => void;
    })
  | (CommonProps & {
      multiple: true;
      value: string[];
      onChange: (value: string[]) => void;
    });

const CHIP_CLASSES = (isActive: boolean) =>
  cn(
    "rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    isActive
      ? "border-terracota bg-terracota-soft text-terracota"
      : "border-border bg-card text-foreground hover:bg-muted",
  );

/**
 * Grupo de chips de selección, única (`radiogroup`/`radio`) o múltiple
 * (`group`/`checkbox` — toggle libre, sin límite de opciones). Estilo del
 * design system: chip activo en terracota-soft + borde terracota; inactivo
 * neutro. `multiple` decide la forma de `value`/`onChange` (string vs string[]).
 */
export function OptionChipGroup(props: OptionChipGroupProps) {
  const { options, ariaLabel, invalid, multiple } = props;

  function isActive(optionValue: string): boolean {
    return multiple ? props.value.includes(optionValue) : props.value === optionValue;
  }

  function handleSelect(optionValue: string) {
    if (multiple) {
      const next = props.value.includes(optionValue)
        ? props.value.filter((value) => value !== optionValue)
        : [...props.value, optionValue];
      props.onChange(next);
      return;
    }

    props.onChange(optionValue);
  }

  return (
    <div
      role={multiple ? "group" : "radiogroup"}
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => {
        const active = isActive(option.value);

        return (
          <button
            key={option.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => handleSelect(option.value)}
            className={CHIP_CLASSES(active)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
