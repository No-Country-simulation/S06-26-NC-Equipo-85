"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { EmptyState } from "@app/ui";
import { useJobMatches } from "../hooks/use-jobs";
import { JobsTable } from "./jobs-table";
import { JobDetail } from "./job-detail";
import { ApiErrorState } from "@/components/api-error-state";
import type { JobMatch } from "@/services/jobs/jobs.types";

export function JobsPage() {
  const t = useTranslations("common.jobs");
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { data: jobs, isLoading, error, refetch, userId } = useJobMatches();

  function handleSelect(job: JobMatch) {
    setSelectedJob(job);
    setDetailOpen(true);
  }

  // `userId` se deriva del JWT (ver `use-jobs.ts`); si no es decodificable, la
  // query nunca se dispara y esto no es un `ApiError` sino un estado de sesión.
  if (!userId) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{t("session_error.title")}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{t("session_error.body")}</p>
      </div>
    );
  }

  if (error) {
    return <ApiErrorState error={error} onRetry={() => refetch()} />;
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
        jobId={selectedJob?.jobId ?? null}
        matchRate={selectedJob?.matchRate}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
