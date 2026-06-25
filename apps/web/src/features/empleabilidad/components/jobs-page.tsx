"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useJobs } from "../hooks/use-jobs";
import { JobsTable } from "./jobs-table";
import { JobDetail } from "./job-detail";
import { EmptyState } from "@/features/shared/components/empty-state";
import { AlertCircle } from "lucide-react";
import type { Job } from "@/services/jobs/jobs.types";

export function JobsPage() {
  const t = useTranslations("common.jobs");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { data: jobs, isLoading, error, refetch } = useJobs();

  function handleSelect(job: Job) {
    setSelectedJob(job);
    setDetailOpen(true);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{t("load_error")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {!isLoading && jobs?.length === 0 && (
        <EmptyState title={t("no_results")} />
      )}

      <JobsTable jobs={jobs ?? []} isLoading={isLoading} onSelect={handleSelect} />

      <JobDetail
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
