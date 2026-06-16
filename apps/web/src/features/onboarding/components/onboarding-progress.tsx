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
 * Muestra el avance accesible del wizard de onboarding.
 */
export function OnboardingProgress({
  currentStep,
  steps,
}: OnboardingProgressProps) {
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <section aria-labelledby="onboarding-progress-title" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="onboarding-progress-title"
            className="text-sm font-semibold text-foreground"
          >
            Progreso del perfil
          </h2>
          <p className="text-sm text-muted-foreground">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {Math.round(progressValue)}%
        </span>
      </div>

      <div
        aria-label="Progreso del onboarding"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progressValue)}
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <li
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "rounded-xl border bg-card p-3 transition-colors",
                isActive && "border-primary bg-primary/5",
                isCompleted && "border-primary/40",
              )}
              key={step.id}
            >
              <span
                className={cn(
                  "mb-2 flex size-7 items-center justify-center rounded-full border text-xs font-semibold",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary/10 text-primary",
                )}
              >
                {step.id + 1}
              </span>

              <h3 className="text-sm font-semibold text-foreground">
                {step.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}