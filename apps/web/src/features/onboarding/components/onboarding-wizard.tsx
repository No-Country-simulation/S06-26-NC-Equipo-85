"use client";

import { useEffect, useRef } from "react";
import type { FieldPath, UseFormSetError } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import type { ZodIssue } from "zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@app/ui";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useOrientar } from "@/hooks/use-orientar";
import { useUserStore } from "@/store/user-store";
import type { OrientationRequest } from "@/services/orientation/orientation.types";
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
 * Genera un id local temporal hasta que el backend entregue el id real del usuario.
 */
function createLocalProfileId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}`;
}

/**
 * Convierte los valores validados del formulario al contrato de `/orientar`.
 */
function buildOrientationRequest(
  values: OnboardingFormValues,
): OrientationRequest {
  return {
    personal: {
      fullName: values.fullName,
      email: values.email,
      birthDate: values.birthDate,
      gender: resolveApiValue(GENDER_OPTIONS, values.gender),
      educationLevel: values.educationLevel,
      country: values.country,
      city: values.city,
      whatsapp: values.whatsapp,
    },
    professional: {
      techLevel: values.techLevel,
      techArea: values.techArea,
      objective: values.objective,
      experienceSummary: values.experienceSummary?.trim() || undefined,
    },
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
    "email",
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

  return "Ocurrió un error inesperado al generar la orientación.";
}

/**
 * Wizard principal de onboarding.
 *
 * Encapsula formularios, validación progresiva, navegación de pasos,
 * persistencia local y mutation de orientación inicial.
 */
export function OnboardingWizard() {
  const router = useRouter();
  const hasLoadedInitialDraft = useRef(false);
  const orientationMutation = useOrientar();

  const draftStep = useUserStore((state) => state.onboardingDraft.step);
  const setDraftStep = useUserStore((state) => state.setDraftStep);
  const updateDraftData = useUserStore((state) => state.updateDraftData);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const setOrientationResult = useUserStore(
    (state) => state.setOrientationResult,
  );

  const currentStep = normalizeStep(draftStep);
  const isSubmitting = orientationMutation.isPending;

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
    setDraftStep(normalizeStep(currentStep - 1));
  }

  function goToNextStep() {
    const isValid = validateCurrentStep();

    if (!isValid) {
      return;
    }

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
      const orientationResult = await orientationMutation.mutateAsync(
        buildOrientationRequest(result.data),
      );

      completeOnboarding({
        id: createLocalProfileId(),
        name: result.data.fullName,
        email: result.data.email,
        area: result.data.techArea,
      });

      setOrientationResult(orientationResult);

      toast.success("Orientación inicial generada", {
        description:
          orientationResult.source === "mock"
            ? "Se usó una respuesta mock porque la API todavía no está configurada."
            : "El perfil fue enviado correctamente a /orientar.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error("No se pudo generar la orientación", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-2xl">Onboarding App BiT</CardTitle>
          <CardDescription>
            Completá tu perfil para recibir una orientación inicial.
          </CardDescription>
        </div>

        <OnboardingProgress
          currentStep={currentStep}
          steps={ONBOARDING_STEPS}
        />
      </CardHeader>

      <CardContent>
        <form
          className="space-y-8"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void submitOnboarding();
          }}
        >
          {currentStep === 0 ? (
            <PersonalDataStep errors={errors} register={register} />
          ) : null}

          {currentStep === 1 ? (
            <ProfessionalProfileStep errors={errors} register={register} />
          ) : null}

          {currentStep === 2 ? <ConfirmationStep values={values} /> : null}

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              disabled={currentStep === FIRST_STEP || isSubmitting}
              onClick={goToPreviousStep}
              type="button"
              variant="outline"
            >
              Volver
            </Button>

            {currentStep < LAST_STEP ? (
              <Button
                disabled={isSubmitting}
                onClick={goToNextStep}
                type="button"
              >
                Continuar
              </Button>
            ) : (
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Generando orientación..." : "Confirmar perfil"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}