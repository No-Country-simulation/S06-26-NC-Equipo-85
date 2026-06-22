import { Lock } from "lucide-react";
import type { OnboardingFormValues } from "../types/onboarding.types";
import {
  EDUCATION_LEVEL_OPTIONS,
  OBJECTIVE_OPTIONS,
  TECH_AREA_OPTIONS,
  TECH_LEVEL_OPTIONS,
} from "../utils/onboarding-options";

type ConfirmationStepProps = {
  values: Partial<OnboardingFormValues>;
};

const PLACEHOLDER = "—";

/**
 * Devuelve el label visible de una opción guardada por value.
 */
function getOptionLabel(
  options: readonly { value: string; label: string }[],
  value: string | undefined,
) {
  return options.find((option) => option.value === value)?.label ?? PLACEHOLDER;
}

/**
 * Paso 3 — "Revisá y confirmá": resumen accesible del perfil + aviso de privacidad.
 */
export function ConfirmationStep({ values }: ConfirmationStepProps) {
  const location =
    [values.city, values.country].filter(Boolean).join(", ") || PLACEHOLDER;

  const items = [
    { label: "Nombre", value: values.fullName || PLACEHOLDER },
    { label: "Ubicación", value: location },
    {
      label: "Nivel educativo",
      value: getOptionLabel(EDUCATION_LEVEL_OPTIONS, values.educationLevel),
    },
    {
      label: "Nivel profesional",
      value: getOptionLabel(TECH_LEVEL_OPTIONS, values.techLevel),
    },
    {
      label: "Área de interés",
      value: getOptionLabel(TECH_AREA_OPTIONS, values.techArea),
    },
    {
      label: "Objetivo",
      value: getOptionLabel(OBJECTIVE_OPTIONS, values.objective),
    },
  ];

  return (
    <section className="space-y-4" aria-labelledby="confirmation-title">
      <div>
        <h3
          id="confirmation-title"
          className="font-heading text-xl font-semibold text-cacao"
        >
          Revisá y confirmá
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Verificá que todo esté correcto antes de empezar.
        </p>
      </div>

      <dl className="overflow-hidden rounded-xl border border-border bg-card">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
          >
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="text-right text-sm font-semibold text-foreground">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center gap-3 rounded-xl bg-azul-horizonte-soft p-4">
        <Lock className="size-5 shrink-0 text-azul-horizonte" aria-hidden />
        <p className="text-sm leading-snug text-foreground">
          Tus datos están protegidos. Solo los usamos para personalizar tu
          trayectoria.
        </p>
      </div>
    </section>
  );
}
