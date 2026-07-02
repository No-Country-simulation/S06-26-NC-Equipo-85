"use client";

import { useTranslations } from "next-intl";
import { Badge, Button, Spinner } from "@app/ui";
import { Link } from "@/i18n/navigation";
import { ApiErrorState } from "@/components/api-error-state";
import { normalizePercentage } from "@/lib/normalize";
import type { OrientationResponse } from "@/services/orientation/orientation.types";

type OnboardingSuccessProps = {
  /** Nombre del usuario para el saludo. */
  name: string;
  /** `true` mientras `POST /api/orientar` está en curso. */
  isLoading: boolean;
  /** Error de la mutation de orientación, si falló. */
  error: unknown;
  /** Reintenta `POST /api/orientar` con el mismo `userId`. */
  onRetry: () => void;
  /** Resultado real de `/api/orientar` (ausente mientras carga o si falló). */
  result: OrientationResponse | undefined;
};

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Pantalla final del onboarding: anillo de match inicial + trayectoria +
 * vacantes compatibles, todo derivado de la respuesta real de `/api/orientar`.
 *
 * El perfil ya quedó guardado antes de llegar acá (`PUT /api/v1/profile`), así
 * que un error de orientación nunca bloquea: se muestra con reintento y un
 * enlace directo al dashboard.
 */
export function OnboardingSuccess({
  name,
  isLoading,
  error,
  onRetry,
  result,
}: OnboardingSuccessProps) {
  const t = useTranslations("common.onboarding.success");
  const matchPercentage = result
    ? Math.max(0, 100 - normalizePercentage(result.gapPorcentual))
    : 0;
  const offset = CIRCUMFERENCE * (1 - matchPercentage / 100);

  return (
    <div className="mx-auto max-w-2xl text-center">
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
          {isLoading ? (
            <Spinner size="lg" />
          ) : (
            <span className="font-heading text-5xl font-semibold leading-none text-cacao">
              {matchPercentage}%
            </span>
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("match_label")}
          </span>
        </div>
      </div>

      <h2 className="mb-2.5 font-heading text-2xl font-semibold text-cacao">
        {t("greeting", { name })}
      </h2>

      {error ? (
        <div className="space-y-4">
          <ApiErrorState error={error} onRetry={onRetry} />
          <Link href="/dashboard">
            <Button variant="outline" className="h-11">
              {t("go_dashboard_anyway")}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-muted-foreground">
            {isLoading ? t("loading") : t("subtitle", { match: matchPercentage })}
          </p>

          {!isLoading && result && (
            <div className="mb-8 space-y-8 text-left">
              <section aria-labelledby="onboarding-gap-title">
                <h3
                  id="onboarding-gap-title"
                  className="mb-3 font-heading text-lg font-semibold text-cacao"
                >
                  {t("gap_items_title")}
                </h3>
                {result.gapItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("gap_items_empty")}</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {result.gapItems.map((item) => (
                      <li key={item.id}>
                        <Badge variant="outline">
                          {item.name} · {item.level}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="onboarding-path-title">
                <h3
                  id="onboarding-path-title"
                  className="mb-3 font-heading text-lg font-semibold text-cacao"
                >
                  {t("suggested_path_title")}
                </h3>
                {result.trayectoriaSugerida.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("suggested_path_empty")}</p>
                ) : (
                  <ul className="space-y-2">
                    {result.trayectoriaSugerida.map((course) => (
                      <li
                        key={course.courseId}
                        className="rounded-xl border border-border bg-card p-3"
                      >
                        <p className="text-sm font-semibold text-foreground">{course.title}</p>
                        <p className="text-xs text-muted-foreground">{course.provider}</p>
                        {course.skillsContribuidos.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {course.skillsContribuidos.join(", ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section aria-labelledby="onboarding-jobs-title">
                <h3
                  id="onboarding-jobs-title"
                  className="mb-3 font-heading text-lg font-semibold text-cacao"
                >
                  {t("compatible_jobs_title")}
                </h3>
                {result.vacantesCompatibles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("compatible_jobs_empty")}</p>
                ) : (
                  <ul className="space-y-2">
                    {result.vacantesCompatibles.map((job) => (
                      <li
                        key={job.jobId}
                        className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="success">{job.matchRate}%</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}

          <Link href="/dashboard">
            <Button size="lg" className="h-11 bg-coral px-7 hover:bg-coral/90">
              {t("cta")}
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
