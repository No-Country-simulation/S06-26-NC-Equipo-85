"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DASHBOARD_MODULES } from "@/features/dashboard/utils/dashboard-modules";
import type { DashboardModule } from "@/features/dashboard/types/dashboard.types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@app/ui";
import { useUserStore } from "@/store/user-store";

// TODO(salud): datos mock del módulo Salud Mental (aún no integrado). Se
// reemplazan por `GET /api/v1/health/checkins` cuando esa integración exista.
const WEEKLY_MOOD = [
  { day: "L", value: 3 },
  { day: "M", value: 4 },
  { day: "M", value: 2 },
  { day: "J", value: 4 },
  { day: "V", value: 5 },
  { day: "S", value: 4 },
  { day: "D", value: 3 },
];

type JobPreview = {
  jobId: string;
  title: string;
  company: string;
  matchRate: number;
};

/**
 * Devuelve clases de acento por módulo respetando la paleta Amanecer.
 */
function getModuleAccentClasses(accent: DashboardModule["accent"]) {
  const classes: Record<DashboardModule["accent"], string> = {
    amber: "border-t-ambar text-ambar-text",
    terracotta: "border-t-primary text-primary",
    coral: "border-t-coral text-coral",
    blue: "border-t-azul text-azul",
    olive: "border-t-oliva text-oliva",
  };

  return classes[accent];
}

/**
 * Anillo visual del match del perfil.
 */
function MatchRing({ value }: { value: number | null }) {
  const t = useTranslations("common.dashboard");
  const hasValue = value !== null;
  const safeValue = hasValue ? Math.min(Math.max(value, 0), 100) : 0;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative size-28 shrink-0 sm:size-36">
      <svg
        aria-hidden="true"
        className="size-28 -rotate-90 text-coral sm:size-36"
        viewBox="0 0 120 120"
      >
        <circle
          className="text-arena"
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
        />
        <circle
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="12"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <strong className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          {hasValue ? `${safeValue}%` : "—"}
        </strong>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
          {t("match_label")}
        </span>
      </div>
    </div>
  );
}

/**
 * Card de acceso a un módulo del dashboard.
 */
function ModuleCard({ module }: { module: DashboardModule }) {
  const t = useTranslations("common.dashboard");

  return (
    <Link
      href={module.href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card
        className={cn(
          "h-full border-t-4 transition-transform group-hover:-translate-y-0.5 group-hover:shadow-md",
          getModuleAccentClasses(module.accent),
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">
              {t(`modules.${module.id}.title`)}
            </CardTitle>
            <span
              aria-hidden="true"
              className="text-lg leading-none transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            {t(`modules.${module.id}.description`)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Card compacta de vacante compatible.
 *
 * TODO(backend): `JobMatch` no informa qué skills le faltan al usuario para
 * esa vacante puntual (a diferencia del mock anterior); si se agrega, esta
 * card puede volver a mostrar "skills a reforzar" por vacante.
 */
function JobPreviewCard({ job }: { job: JobPreview }) {
  return (
    <Card>
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{job.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
          </div>

          <Badge className="bg-ambar-soft text-ambar-text hover:bg-ambar-soft">
            {job.matchRate}%
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}

/**
 * Home interna del dashboard.
 *
 * Consume el resultado persistido de orientación y ofrece una vista ejecutiva
 * del progreso, próximos pasos y accesos a los cinco servicios.
 */
export function DashboardHome() {
  const t = useTranslations("common.dashboard");
  const profile = useUserStore((state) => state.profile);
  const orientationResult = useUserStore((state) => state.orientationResult);

  const matchValue = orientationResult
    ? Math.max(0, 100 - orientationResult.gapPorcentual)
    : null;

  const suggestedPath =
    orientationResult?.trayectoriaSugerida.map(
      (course) => `${course.title} · ${course.provider}`,
    ) ?? [];

  const compatibleJobs: JobPreview[] =
    orientationResult?.vacantesCompatibles ?? [];

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary md:text-sm">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            {t("greeting", {
              name: profile?.name ? `, ${profile.name.split(" ")[0]}` : "",
            })}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="w-fit rounded-full bg-ambar-soft px-4 py-2 text-sm font-semibold text-ambar-text">
          {t("checkin_pending")}
        </div>
      </section>

      <section
        aria-labelledby="dashboard-progress-title"
        className="rounded-3xl bg-linear-to-br from-primary via-coral to-ambar p-5 text-white shadow-lg md:p-8"
      >
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex justify-center lg:block">
            <MatchRing value={matchValue} />
          </div>

          <div className="min-w-0 text-center lg:text-left">
            <h2
              id="dashboard-progress-title"
              className="font-serif text-2xl font-semibold md:text-3xl"
            >
              {matchValue !== null
                ? t("progress.goal", { gap: 100 - matchValue })
                : t("progress.goal_empty")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90 lg:mx-0">
              {t("progress.hint")}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild variant="secondary">
                <Link href="/courses">{t("progress.see_courses")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/jobs">{t("progress.see_jobs")}</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl bg-white/14 p-4 backdrop-blur sm:grid-cols-2 lg:min-w-56 lg:grid-cols-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {t("progress.confidence")}
              </p>
              <p className="font-serif text-2xl font-semibold">
                {orientationResult ? `${orientationResult.confianza}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                {t("progress.matches_count")}
              </p>
              <p className="font-medium">
                {orientationResult ? orientationResult.vacantesCompatibles.length : "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!orientationResult ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between md:py-6">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                {t("no_orientation.title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("no_orientation.body")}
              </p>
            </div>

            <Button asChild>
              <Link href="/onboarding">{t("no_orientation.cta")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("suggested_path")}</CardTitle>
          </CardHeader>
          <CardContent>
            {suggestedPath.length === 0 ? (
              <p className="text-sm leading-6 text-muted-foreground">
                {t("suggested_path_empty")}
              </p>
            ) : (
              <ol className="space-y-4">
                {suggestedPath.slice(0, 4).map((item, index) => (
                  <li className="flex gap-3" key={`${item}-${index}`}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ambar-soft text-sm font-semibold text-ambar-text">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-6 text-muted-foreground">
                      {item}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        <Card className="bg-azul-soft/70">
          <CardHeader className="pb-2">
            <CardTitle>{t("mood_history")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-28 items-end gap-2">
              {WEEKLY_MOOD.map((item, index) => (
                <div
                  className="flex flex-1 flex-col items-center gap-2"
                  key={`${item.day}-${index}`}
                >
                  <div
                    className="w-full rounded-t-lg bg-azul"
                    style={{ height: `${item.value * 16}px` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {t("mood_note")}
            </p>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="compatible-jobs-title" className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="compatible-jobs-title"
              className="font-serif text-2xl font-semibold"
            >
              {t("compatible_jobs.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("compatible_jobs.subtitle")}
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/jobs">{t("compatible_jobs.see_all")}</Link>
          </Button>
        </div>

        {compatibleJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("compatible_jobs.empty")}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {compatibleJobs.slice(0, 3).map((job) => (
              <JobPreviewCard job={job} key={job.jobId} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="services-title" className="space-y-4">
        <div>
          <h2 id="services-title" className="font-serif text-2xl font-semibold">
            {t("services.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {DASHBOARD_MODULES.map((module) => (
            <ModuleCard module={module} key={module.id} />
          ))}
        </div>
      </section>
    </div>
  );
}
