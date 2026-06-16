import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Input, Label } from "@app/ui";
import type { OnboardingFormValues } from "../types/onboarding.types";
import { GENDER_OPTIONS } from "../utils/onboarding-options";

type PersonalDataStepProps = {
  errors: FieldErrors<OnboardingFormValues>;
  register: UseFormRegister<OnboardingFormValues>;
};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

/**
 * Primer paso del onboarding: datos personales necesarios para crear el perfil.
 */
export function PersonalDataStep({ errors, register }: PersonalDataStepProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Datos personales</legend>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            placeholder="Ej: Lucas Epherra"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            inputMode="email"
            placeholder="tu@email.com"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input
            id="birthDate"
            type="date"
            error={errors.birthDate?.message}
            {...register("birthDate")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Género</Label>
          <select
            aria-invalid={Boolean(errors.gender)}
            className={selectClassName}
            id="gender"
            {...register("gender")}
          >
            <option value="">Seleccionar</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.gender?.message ? (
            <p className="text-xs text-destructive">{errors.gender.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            placeholder="Ej: Argentina"
            error={errors.country?.message}
            {...register("country")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            placeholder="Ej: Bahía Blanca"
            error={errors.city?.message}
            {...register("city")}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            inputMode="tel"
            placeholder="Ej: +54 9 291 000 0000"
            type="tel"
            error={errors.whatsapp?.message}
            {...register("whatsapp")}
          />
        </div>
      </div>
    </fieldset>
  );
}