import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Label, Textarea } from "@app/ui";
import type { OnboardingFormValues } from "../types/onboarding.types";
import {
  OBJECTIVE_OPTIONS,
  TECH_AREA_OPTIONS,
  TECH_LEVEL_OPTIONS,
} from "../utils/onboarding-options";

type ProfessionalProfileStepProps = {
  errors: FieldErrors<OnboardingFormValues>;
  register: UseFormRegister<OnboardingFormValues>;
};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

/**
 * Segundo paso del onboarding: perfil profesional y objetivo del usuario.
 */
export function ProfessionalProfileStep({
  errors,
  register,
}: ProfessionalProfileStepProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Perfil profesional</legend>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="techLevel">Nivel actual</Label>
          <select
            aria-invalid={Boolean(errors.techLevel)}
            className={selectClassName}
            id="techLevel"
            {...register("techLevel")}
          >
            <option value="">Seleccionar</option>
            {TECH_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.techLevel?.message ? (
            <p className="text-xs text-destructive">
              {errors.techLevel.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="techArea">Área de interés</Label>
          <select
            aria-invalid={Boolean(errors.techArea)}
            className={selectClassName}
            id="techArea"
            {...register("techArea")}
          >
            <option value="">Seleccionar</option>
            {TECH_AREA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.techArea?.message ? (
            <p className="text-xs text-destructive">{errors.techArea.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="objective">Objetivo principal</Label>
          <select
            aria-invalid={Boolean(errors.objective)}
            className={selectClassName}
            id="objective"
            {...register("objective")}
          >
            <option value="">Seleccionar</option>
            {OBJECTIVE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.objective?.message ? (
            <p className="text-xs text-destructive">{errors.objective.message}</p>
          ) : null}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="experienceSummary">
            Resumen de experiencia o contexto
          </Label>
          <Textarea
            id="experienceSummary"
            placeholder="Contá brevemente tu experiencia, estudios, intereses o dudas actuales."
            rows={5}
            {...register("experienceSummary")}
          />

          {errors.experienceSummary?.message ? (
            <p className="text-xs text-destructive">
              {errors.experienceSummary.message}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Campo opcional. Máximo 500 caracteres.
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}