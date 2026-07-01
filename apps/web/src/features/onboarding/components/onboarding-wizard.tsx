"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldPath, UseFormSetError } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import type { ZodIssue } from "zod";
import { Button, Card, CardContent, Spinner } from "@app/ui";
import { toast } from "sonner";
import { useUpdateProfile } from "../hooks/use-update-profile";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/store/user-store";
import type { ProfileUpsertRequest } from "@/services/profile/profile.types";
import {
  ONBOARDING_DEFAULT_VALUES,
  onboardingFormSchema,
  personalDataSchema,
  professionalProfileSchema,
} from "../schemas/onboarding.schema";
import type {
  OnboardingFormValues,
  OnboardingStep,
} from "../types/onboarding.types";
import {
  GENDER_OPTIONS,
  ONBOARDING_STEPS,
  resolveApiValue,
} from "../utils/onboarding-options";
import { ConfirmationStep } from "./confirmation-step";
import { OnboardingProgress } from "./onboarding-progress";
import { PersonalDataStep } from "./personal-data-step";
import { ProfessionalProfileStep } from "./professional-profile-step";

// Mensaje de testing para deploy.

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
};

const FIRST_STEP = 0 satisfies OnboardingStep;
const LAST_STEP = 2 satisfies OnboardingStep;

/**
 * Obtiene la API de persistencia de Zustand si el store fue creado con persist.
 */
function getPersistApi() {
  return (useUserStore as unknown as { persist?: PersistApi }).persist;
}

/**
 * Normaliza cualquier valor numérico del store al rango real de pasos.
 */
function normalizeStep(step: number): OnboardingStep {
  if (step <= FIRST_STEP) return FIRST_STEP;
  if (step >= LAST_STEP) return LAST_STEP;

  return step as OnboardingStep;
}

/**
 * Lee el email de la sesión desde el draft persistido. Lo escribe el Registro
 * (POST /auth/register) porque el onboarding ya no lo vuelve a pedir.
 */
function getSessionEmail() {
  const data = useUserStore.getState().onboardingDraft.data as {
    email?: string;
  };

  return data.email ?? "";
}

const WHATSAPP_API_PATTERN = /^\+?[0-9]{7,15}$/;

/**
 * Normaliza el WhatsApp al patrón del backend (`^\+?[0-9]{7,15}$`): quita
 * espacios, guiones y paréntesis, y conserva un `+` inicial. Si tras limpiar no
 * cumple el patrón se omite (es opcional) para no romper el PUT con un 400.
 */
function toApiWhatsapp(raw?: string): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;

  const normalized = `${hasPlus ? "+" : ""}${digits}`;
  return WHATSAPP_API_PATTERN.test(normalized) ? normalized : undefined;
}

/**
 * Convierte los valores validados del formulario al contrato de
 * `PUT /api/v1/profile`. El `género` se reduce a su enum vía `apiValue`; el
 * resto de selects ya persisten el enum del backend. `experienceSummary` no
 * tiene campo en el perfil, así que no se envía.
 */
function buildProfileRequest(
  values: OnboardingFormValues,
): ProfileUpsertRequest {
  const whatsapp = toApiWhatsapp(values.whatsapp);

  return {
    name: values.fullName,
    birthDate: values.birthDate,
    gender: resolveApiValue(
      GENDER_OPTIONS,
      values.gender,
    ) as ProfileUpsertRequest["gender"],
    education: values.educationLevel as ProfileUpsertRequest["education"],
    professionalLevel:
      values.techLevel as ProfileUpsertRequest["professionalLevel"],
    techArea: values.techArea,
    objective: values.objective,
    location: {
      country: values.country,
      city: values.city,
    },
    contact: whatsapp ? { whatsapp } : undefined,
  };
}

/**
 * Mapea issues de Zod al sistema de errores de React Hook Form.
 */
function applyValidationErrors(
  issues: ZodIssue[],
  setError: UseFormSetError<OnboardingFormValues>,
) {
  const firstIssue = issues[0];

  for (const issue of issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    setError(field as FieldPath<OnboardingFormValues>, {
      type: "manual",
      message: issue.message,
    });
  }

  return typeof firstIssue?.path[0] === "string"
    ? (firstIssue.path[0] as FieldPath<OnboardingFormValues>)
    : null;
}

/**
 * Devuelve el paso correspondiente al primer campo inválido.
 */
function getStepByField(field: FieldPath<OnboardingFormValues>): OnboardingStep {
  const personalFields: readonly FieldPath<OnboardingFormValues>[] = [
    "fullName",
    "birthDate",
    "gender",
    "educationLevel",
    "country",
    "city",
    "whatsapp",
  ];

  if (personalFields.includes(field)) {
    return 0;
  }

  return 1;
}

/**
 * Devuelve un mensaje seguro para mostrar en toast.
 */
function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado al guardar el perfil.";
}

/**
 * Wizard principal de onboarding.
 *
 * Encapsula formularios, validación progresiva, navegación de pasos,
 * persistencia local y el UPSERT del perfil (`PUT /api/v1/profile`). Al
 * confirmar persiste el perfil y deriva al dashboard.
 */
export function OnboardingWizard() {
  const router = useRouter();
  const hasLoadedInitialDraft = useRef(false);
  const updateProfile = useUpdateProfile();
  const [showHint, setShowHint] = useState(false);

  const draftStep = useUserStore((state) => state.onboardingDraft.step);
  const setDraftStep = useUserStore((state) => state.setDraftStep);
  const updateDraftData = useUserStore((state) => state.updateDraftData);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const currentStep = normalizeStep(draftStep);
  const isSubmitting = updateProfile.isPending;

  const {
    clearErrors,
    control,
    formState: { errors },
    getValues,
    register,
    reset,
    setError,
    subscribe,
  } = useForm<OnboardingFormValues>({
    defaultValues: ONBOARDING_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const values = useWatch({
    control,
    defaultValue: ONBOARDING_DEFAULT_VALUES,
  });

  useEffect(() => {
    let isMounted = true;

    function loadDraftFromStore() {
      if (!isMounted) {
        return;
      }

      const draftData = useUserStore.getState().onboardingDraft
        .data as Partial<OnboardingFormValues>;

      reset({
        ...ONBOARDING_DEFAULT_VALUES,
        ...draftData,
      });

      hasLoadedInitialDraft.current = true;
    }

    const persistApi = getPersistApi();

    if (!persistApi) {
      loadDraftFromStore();

      return () => {
        isMounted = false;
      };
    }

    if (persistApi.hasHydrated()) {
      loadDraftFromStore();

      return () => {
        isMounted = false;
      };
    }

    const unsubscribe = persistApi.onFinishHydration(loadDraftFromStore);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reset]);

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        if (!hasLoadedInitialDraft.current) {
          return;
        }

        updateDraftData(values);
      },
    });

    return () => unsubscribe();
  }, [subscribe, updateDraftData]);

  function validateCurrentStep() {
    clearErrors();

    const currentValues = getValues();
    const schema =
      currentStep === 0
        ? personalDataSchema
        : currentStep === 1
          ? professionalProfileSchema
          : onboardingFormSchema;

    const result = schema.safeParse(currentValues);

    if (result.success) {
      return true;
    }

    applyValidationErrors(result.error.issues, setError);
    return false;
  }

  function goToPreviousStep() {
    setShowHint(false);
    setDraftStep(normalizeStep(currentStep - 1));
  }

  function goToNextStep() {
    if (!validateCurrentStep()) {
      setShowHint(true);
      return;
    }

    setShowHint(false);
    setDraftStep(normalizeStep(currentStep + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitOnboarding() {
    clearErrors();

    const result = onboardingFormSchema.safeParse(getValues());

    if (!result.success) {
      const firstInvalidField = applyValidationErrors(
        result.error.issues,
        setError,
      );

      if (firstInvalidField) {
        setDraftStep(getStepByField(firstInvalidField));
      }

      toast.error("Revisá los datos del perfil", {
        description: "Hay campos obligatorios o inválidos.",
      });

      return;
    }

    try {
      const email = getSessionEmail();

      await updateProfile.mutateAsync(buildProfileRequest(result.data));

      // `id` local: el backend usa `user.id` como PK del perfil, que el front
      // no decodifica del JWT; el email identifica al usuario en el store.
      completeOnboarding({
        id: email,
        name: result.data.fullName,
        email,
        area: result.data.techArea,
      });

      toast.success("Perfil guardado", {
        description: "Tu perfil quedó listo. ¡Vamos al panel!",
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error("No se pudo guardar el perfil", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <div className="w-full">
      <header className="mb-6 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracota font-heading text-base font-bold text-white">
          B
        </div>
        <span className="font-heading text-base font-semibold text-cacao">
          BiT
        </span>
        <div className="flex-1" />
        <span className="text-sm font-semibold text-muted-foreground">
          Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
        </span>
      </header>

      <OnboardingProgress currentStep={currentStep} steps={ONBOARDING_STEPS} />

      <form
        className="mt-7"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submitOnboarding();
        }}
      >
        <Card className="p-6">
          <CardContent className="px-0">
            {currentStep === 0 ? (
              <PersonalDataStep errors={errors} register={register} />
            ) : null}

            {currentStep === 1 ? (
              <ProfessionalProfileStep
                control={control}
                errors={errors}
                register={register}
              />
            ) : null}

            {currentStep === 2 ? <ConfirmationStep values={values} /> : null}
          </CardContent>
        </Card>

        {showHint ? (
          <p className="mt-3.5 text-sm font-semibold text-coral">
            Completá los campos obligatorios (*) para continuar.
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-3">
          {currentStep > FIRST_STEP ? (
            <Button
              disabled={isSubmitting}
              onClick={goToPreviousStep}
              type="button"
              variant="outline"
              className="h-11"
            >
              ← Atrás
            </Button>
          ) : null}

          <div className="flex-1" />

          {currentStep < LAST_STEP ? (
            <Button
              onClick={goToNextStep}
              type="button"
              className="h-11 bg-coral px-7 hover:bg-coral/90"
            >
              Continuar
            </Button>
          ) : (
            <Button
              disabled={isSubmitting}
              type="submit"
              className="h-11 bg-coral px-7 hover:bg-coral/90"
            >
              {isSubmitting ? <Spinner size="sm" /> : null}
              {isSubmitting ? "Generando…" : "Confirmar perfil"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
