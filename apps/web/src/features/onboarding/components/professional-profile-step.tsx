import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Label, Textarea } from "@app/ui";
import type { OnboardingFormValues } from "../types/onboarding.types";
import {
  OBJECTIVE_OPTIONS,
  TECH_AREA_OPTIONS,
  TECH_LEVEL_OPTIONS,
} from "../utils/onboarding-options";
import { OptionCardGroup } from "./option-card-group";
import { OptionChipGroup } from "./option-chip-group";

type ProfessionalProfileStepProps = {
  control: Control<OnboardingFormValues>;
  errors: FieldErrors<OnboardingFormValues>;
  register: UseFormRegister<OnboardingFormValues>;
};

/**
 * Paso 2 — "Tu perfil profesional": nivel y área como chips, objetivo como
 * tarjetas de selección, y un resumen opcional. Define el match con cursos/vacantes.
 */
export function ProfessionalProfileStep({
  control,
  errors,
  register,
}: ProfessionalProfileStepProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Perfil profesional</legend>

      <div>
        <h3 className="font-heading text-xl font-semibold text-cacao">
          Tu perfil profesional
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Esto define tu match con cursos y vacantes.
        </p>
      </div>

      <div className="space-y-2">
        <Label asChild>
          <span>Tu nivel actual *</span>
        </Label>
        <Controller
          control={control}
          name="techLevel"
          render={({ field }) => (
            <OptionChipGroup
              ariaLabel="Tu nivel actual"
              options={TECH_LEVEL_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(errors.techLevel)}
            />
          )}
        />
        {errors.techLevel?.message ? (
          <p className="text-xs font-medium text-destructive">
            {errors.techLevel.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label asChild>
          <span>Área de interés * <span className="font-normal text-muted-foreground">(elegí una o más)</span></span>
        </Label>
        <Controller
          control={control}
          name="techArea"
          render={({ field }) => (
            <OptionChipGroup
              multiple
              ariaLabel="Área de interés"
              options={TECH_AREA_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(errors.techArea)}
            />
          )}
        />
        {errors.techArea?.message ? (
          <p className="text-xs font-medium text-destructive">
            {errors.techArea.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label asChild>
          <span>¿Cuál es tu objetivo? *</span>
        </Label>
        <Controller
          control={control}
          name="objective"
          render={({ field }) => (
            <OptionCardGroup
              ariaLabel="¿Cuál es tu objetivo?"
              options={OBJECTIVE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(errors.objective)}
            />
          )}
        />
        {errors.objective?.message ? (
          <p className="text-xs font-medium text-destructive">
            {errors.objective.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="experienceSummary">
          Resumen{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="experienceSummary"
          placeholder="Contanos en una línea qué te motiva…"
          rows={3}
          {...register("experienceSummary")}
        />
        {errors.experienceSummary?.message ? (
          <p className="text-xs font-medium text-destructive">
            {errors.experienceSummary.message}
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}
