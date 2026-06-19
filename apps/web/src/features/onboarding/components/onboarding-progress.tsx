import { cn } from "@app/ui";
import type {
  OnboardingStep,
  OnboardingStepDefinition,
} from "../types/onboarding.types";

type OnboardingProgressProps = {
  currentStep: OnboardingStep;
  steps: readonly OnboardingStepDefinition[];
};

/**
 * Avance del wizard: barra ámbar (celebra el progreso, design system) + labels
 * de los 3 pasos que se tiñen en terracota a medida que se alcanzan.
 */
export function OnboardingProgress({
  currentStep,
  steps,
}: OnboardingProgressProps) {
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <section aria-labelledby="onboarding-progress-title">
      <h2 id="onboarding-progress-title" className="sr-only">
        Progreso del onboarding
      </h2>

      <div
        aria-label="Progreso del onboarding"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progressValue)}
        className="h-1.5 overflow-hidden rounded-full bg-arena"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-ambar transition-all duration-300"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      <ol className="mt-2 flex gap-3.5 text-xs font-semibold">
        {steps.map((step) => {
          const isReached = step.id <= currentStep;

          return (
            <li
              key={step.id}
              aria-current={step.id === currentStep ? "step" : undefined}
              className={cn(
                "transition-colors",
                isReached ? "text-terracota" : "text-muted-foreground/60",
              )}
            >
              {step.title}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
