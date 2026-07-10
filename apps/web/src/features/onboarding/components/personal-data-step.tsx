import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input, Label } from "@app/ui";
import type { OnboardingFormValues } from "../types/onboarding.types";
import {
  COUNTRY_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  GENDER_OPTIONS,
} from "../utils/onboarding-options";

type PersonalDataStepProps = {
  errors: FieldErrors<OnboardingFormValues>;
  register: UseFormRegister<OnboardingFormValues>;
};

const selectClassName =
  "h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

/**
 * Paso 1 — "Contanos sobre vos": datos personales del perfil.
 * El email no se pide acá (llega del Registro).
 */
export function PersonalDataStep({ errors, register }: PersonalDataStepProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Datos personales</legend>

      <div>
        <h3 className="font-heading text-xl font-semibold text-cacao">
          Contanos sobre vos
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Datos básicos para personalizar tu experiencia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nombre completo *</Label>
          <Input
            id="fullName"
            placeholder="Mariana Solís"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
          <Input
            id="birthDate"
            type="date"
            error={errors.birthDate?.message}
            {...register("birthDate")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gender">Género *</Label>
          <select
            aria-invalid={Boolean(errors.gender) || undefined}
            className={selectClassName}
            id="gender"
            defaultValue=""
            {...register("gender")}
          >
            <option disabled value="">
              Seleccioná…
            </option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.gender?.message ? (
            <p className="text-xs font-medium text-destructive">
              {errors.gender.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="educationLevel">Nivel educativo *</Label>
          <select
            aria-invalid={Boolean(errors.educationLevel) || undefined}
            className={selectClassName}
            id="educationLevel"
            defaultValue=""
            {...register("educationLevel")}
          >
            <option disabled value="">
              Seleccioná…
            </option>
            {EDUCATION_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.educationLevel?.message ? (
            <p className="text-xs font-medium text-destructive">
              {errors.educationLevel.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="country">País *</Label>
          <select
            aria-invalid={Boolean(errors.country) || undefined}
            className={selectClassName}
            id="country"
            defaultValue=""
            {...register("country")}
          >
            <option disabled value="">
              Seleccioná…
            </option>
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.country?.message ? (
            <p className="text-xs font-medium text-destructive">
              {errors.country.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            placeholder="Córdoba"
            error={errors.city?.message}
            {...register("city")}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="whatsapp">
            WhatsApp{" "}
            <span className="font-normal text-muted-foreground">(opcional)</span>
          </Label>
          <Input
            id="whatsapp"
            inputMode="tel"
            placeholder="+54 9 351 000 0000"
            type="tel"
            error={errors.whatsapp?.message}
            {...register("whatsapp")}
          />
        </div>
      </div>
    </fieldset>
  );
}
