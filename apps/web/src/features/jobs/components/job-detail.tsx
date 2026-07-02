"use client";

import { useTranslations } from "next-intl";
import {
  Badge,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Spinner,
} from "@app/ui";
import { MatchScoreBar } from "./match-score-bar";
import { RequirementsChecklist } from "./requirements-checklist";
import { useJob } from "../hooks/use-jobs";
import { ApiErrorState } from "@/components/api-error-state";

type JobDetailProps = {
  jobId: string | null;
  /** Match del `JobMatch` seleccionado en el listado; el detalle no lo trae. */
  matchRate?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobDetail({ jobId, matchRate, open, onOpenChange }: JobDetailProps) {
  const t = useTranslations("common.jobs");
  const { data: job, isLoading, error, refetch } = useJob(jobId ?? "");

  if (!jobId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-xl">{job?.title ?? t("detail")}</SheetTitle>
              {job ? <SheetDescription className="mt-1">{job.company}</SheetDescription> : null}
            </div>
            {matchRate !== undefined && (
              <Badge variant="success">{t("match_badge", { score: matchRate })}</Badge>
            )}
          </div>
        </SheetHeader>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoading && error && <ApiErrorState error={error} onRetry={() => refetch()} />}

        {!isLoading && !error && job === null && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">{t("not_found")}</p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("back_to_list")}
            </button>
          </div>
        )}

        {!isLoading && !error && job && (
          <div className="space-y-6">
            {matchRate !== undefined && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">{t("match_profile")}</p>
                <MatchScoreBar score={matchRate} showLabel={false} />
                <p className="mt-2 text-xs text-muted-foreground">
                  {matchRate >= 70
                    ? t("match_hint.high")
                    : matchRate >= 50
                      ? t("match_hint.medium")
                      : t("match_hint.low")}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-foreground">{t("description")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
            </div>

            <RequirementsChecklist skills={job.skills} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
