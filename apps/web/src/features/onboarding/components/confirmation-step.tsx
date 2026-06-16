import { Card, CardContent, CardHeader, CardTitle } from "@app/ui";
import type { OnboardingFormValues } from "../types/onboarding.types";
import {
  GENDER_OPTIONS,
  OBJECTIVE_OPTIONS,
  TECH_AREA_OPTIONS,
  TECH_LEVEL_OPTIONS,
} from "../utils/onboarding-options";

type ConfirmationStepProps = {
  values: Partial<OnboardingFormValues>;
};

/**
 * Devuelve el label visible de una opción guardada por value.
 */
function getOptionLabel(
  options: readonly { value: string; label: string }[],
  value: string | undefined,
) {
  return options.find((option) => option.value === value)?.label ?? "Sin definir";
}

/**
 * Último paso del onboarding: resumen accesible antes de confirmar.
 */
export function ConfirmationStep({ values }: ConfirmationStepProps) {
  const items = [
    { label: "Nombre", value: values.fullName },
    { label: "E-mail", value: values.email },
    { label: "Fecha de nacimiento", value: values.birthDate },
    {
      label: "Género",
      value: getOptionLabel(GENDER_OPTIONS, values.gender),
    },
    { label: "País", value: values.country },
    { label: "Ciudad", value: values.city },
    { label: "WhatsApp", value: values.whatsapp },
    {
      label: "Nivel técnico",
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
    <section className="space-y-6" aria-labelledby="confirmation-title">
      <div>
        <h3 id="confirmation-title" className="text-lg font-semibold">
          Revisá tu información
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Si todo está correcto, confirmá para guardar el perfil inicial.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen del perfil</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div
                className="rounded-lg border bg-background p-3"
                key={item.label}
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {item.value || "Sin definir"}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 rounded-lg border bg-background p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Contexto adicional
            </dt>
            <dd className="mt-1 text-sm leading-6 text-foreground">
              {values.experienceSummary?.trim() || "Sin información adicional."}
            </dd>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}