import { Button } from "@app/ui";
import { Link } from "@/i18n/navigation";

type OnboardingSuccessProps = {
  /** Nombre del usuario para el saludo. */
  name: string;
  /** Porcentaje de match inicial (0–100), derivado del gap de /orientar. */
  matchPercentage: number;
};

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Pantalla final del onboarding: anillo de match inicial + bienvenida + CTA al
 * dashboard. El anillo usa coral sobre track arena (gap del design system).
 */
export function OnboardingSuccess({
  name,
  matchPercentage,
}: OnboardingSuccessProps) {
  const offset = CIRCUMFERENCE * (1 - matchPercentage / 100);

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="relative mx-auto mb-6 size-50">
        <svg width="200" height="200" viewBox="0 0 180 180" aria-hidden>
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="var(--bit-arena)"
            strokeWidth="15"
          />
          <circle
            cx="90"
            cy="90"
            r={RADIUS}
            fill="none"
            stroke="var(--bit-coral)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-5xl font-semibold leading-none text-cacao">
            {matchPercentage}%
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            tu match inicial
          </span>
        </div>
      </div>

      <h2 className="mb-2.5 font-heading text-2xl font-semibold text-cacao">
        ¡Bienvenida, {name}! 🌅
      </h2>
      <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-muted-foreground">
        Tu perfil está listo. Empezás con un{" "}
        <b className="text-coral">{matchPercentage}% de match</b> y te preparamos
        una trayectoria para cerrar la brecha.
      </p>

      <Link href="/dashboard">
        <Button size="lg" className="h-11 bg-coral px-7 hover:bg-coral/90">
          Ir a mi Dashboard →
        </Button>
      </Link>
    </div>
  );
}
