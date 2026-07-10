"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, Briefcase, Check, Clock, MapPin, Wallet } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@app/ui";
import { Link } from "@/i18n/navigation";
import { useJob, useJobMatches } from "../hooks/use-jobs";
import { MatchScoreBar } from "./match-score-bar";
import { RequirementsChecklist } from "./requirements-checklist";
import { ApiErrorState } from "@/components/api-error-state";

type JobDetailViewProps = {
  jobId: string;
};

/**
 * Vista de detalle ampliada de una vacante (`/jobs/[id]`).
 *
 * El detalle (`GET /api/v1/jobs/{id}`) no trae el `matchRate`; se resuelve
 * cruzando con la lista de matches (`useJobMatches`) por id, así el deep-link y
 * el refresh funcionan sin depender de estado de navegación. Muestra match,
 * descripción y skills requeridas, con acceso directo a Formaciones para
 * cerrar la brecha.
 */
export function JobDetailView({ jobId }: JobDetailViewProps) {
  const t = useTranslations("common.jobs");
  const { data: job, isLoading, error, refetch } = useJob(jobId);
  const { data: matches } = useJobMatches();

  const match = matches?.find((item) => item.jobId === jobId);
  const matchRate = match?.matchRate;

  const backLink = (
    <Link
      href="/jobs"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      <ArrowLeft className="size-4" />
      {t("detail_view.back")}
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <ApiErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-muted-foreground">{t("not_found")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {backLink}

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{job.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
          </div>
          {matchRate !== undefined && (
            <Badge variant="success">{t("match_badge", { score: matchRate })}</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden="true" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="size-4" aria-hidden="true" />
            {t(`modality.${job.modality}`)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-4" aria-hidden="true" />
            {job.salaryRange}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {t("detail_view.posted", { days: job.postedDaysAgo })}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="flex flex-col gap-6">
          {matchRate !== undefined && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t("match_profile")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <MatchScoreBar score={matchRate} showLabel />
                <p className="text-sm text-muted-foreground">
                  {matchRate >= 70
                    ? t("match_hint.high")
                    : matchRate >= 50
                      ? t("match_hint.medium")
                      : t("match_hint.low")}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("detail_view.about")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {job.aboutCompany ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {t("detail_view.about_company")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {job.aboutCompany}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card>
          <CardContent className="flex flex-col gap-5 pt-6">
            <RequirementsChecklist skills={job.requiredSkills} />

            {job.benefits.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {t("detail_view.benefits")}
                </p>
                <ul className="space-y-1.5">
                  {job.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-oliva"
                        aria-hidden="true"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Button asChild variant="secondary">
              <Link href="/courses">{t("detail_view.cta_courses")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
