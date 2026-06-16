import type { z } from "zod";
import type { onboardingFormSchema } from "../schemas/onboarding.schema";

export type OnboardingStep = 0 | 1 | 2;

export type SelectOption = {
  value: string;
  label: string;
};

export type OnboardingStepDefinition = {
  id: OnboardingStep;
  title: string;
  description: string;
};

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;