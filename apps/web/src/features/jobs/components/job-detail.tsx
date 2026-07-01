"use client";

import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@app/ui";
import { Badge } from "@app/ui";
import { MatchScoreBar } from "./match-score-bar";
import { RequirementsChecklist } from "./requirements-checklist";
import type { Job } from "@/services/jobs/jobs.types";

type JobDetailProps = {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobDetail({ job, open, onOpenChange }: JobDetailProps) {
  const t = useTranslations("common.jobs");

  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-xl">{job.title}</SheetTitle>
              <SheetDescription className="mt-1">
                {job.company}
                {job.location ? ` · ${job.location}` : ""}
              </SheetDescription>
            </div>
            <Badge variant="success">{t("match_badge", { score: job.matchScore })}</Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground">{t("salary_estimated")}</p>
            <p className="text-sm text-muted-foreground">
              {job.salary ?? t("salary_unspecified")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">{t("description")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">{t("match_profile")}</p>
            <MatchScoreBar score={job.matchScore} showLabel={false} />
            <p className="mt-2 text-xs text-muted-foreground">
              {job.matchScore >= 70
                ? t("match_hint.high")
                : job.matchScore >= 50
                  ? t("match_hint.medium")
                  : t("match_hint.low")}
            </p>
          </div>

          <RequirementsChecklist
            requirements={job.requirements}
            missing={job.missingRequirements}
            area={job.area}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
