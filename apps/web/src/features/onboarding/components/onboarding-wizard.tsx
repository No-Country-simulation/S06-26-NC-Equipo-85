"use client";

import { useEffect, useRef } from "react";
import type { FieldPath, UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
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
import { useUserStore } from "@/store/user-store";
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
import { ONBOARDING_STEPS } from "../utils/onboarding-options";
import { ConfirmationStep } from "./confirmation-step";
import { OnboardingProgress } from "./onboarding-progress";
import { PersonalDataStep } from "./personal-data-step";
import { ProfessionalProfileStep } from "./professional-profile-step";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
  rehydrate: () => Promise<void> | void;
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
 * Wizard principal de onboarding.
 *
 * Encapsula formularios, validación progresiva, navegación de pasos e
 * hidratación manual del draft persistido en Zustand.
 */
export function OnboardingWizard() {
  const router = useRouter();
  const hasLoadedInitialDraft = useRef(false);

  const draftStep = useUserStore((state) => state.onboardingDraft.step);
  const setDraftStep = useUserStore((state) => state.setDraftStep);
  const updateDraftData = useUserStore((state) => state.updateDraftData);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const currentStep = normalizeStep(draftStep);

  const {
    clearErrors,
    formState: { errors },
    getValues,
    register,
    reset,
    setError,
    watch,
  } = useForm<OnboardingFormValues>({
    defaultValues: ONBOARDING_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const values = watch();

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

    void persistApi.rehydrate();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (!hasLoadedInitialDraft.current) {
        return;
      }

      updateDraftData(value);
    });

    return () => subscription.unsubscribe();
  }, [updateDraftData, watch]);

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

  function submitOnboarding() {
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

    completeOnboarding({
      id: createLocalProfileId(),
      name: result.data.fullName,
      email: result.data.email,
      area: result.data.techArea,
    });

    toast.success("Perfil inicial guardado", {
      description: "En el próximo bloque conectamos este flujo con /orientar.",
    });

    router.push("/dashboard");
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
            submitOnboarding();
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
              disabled={currentStep === FIRST_STEP}
              onClick={goToPreviousStep}
              type="button"
              variant="outline"
            >
              Volver
            </Button>

            {currentStep < LAST_STEP ? (
              <Button onClick={goToNextStep} type="button">
                Continuar
              </Button>
            ) : (
              <Button type="submit">Confirmar perfil</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}