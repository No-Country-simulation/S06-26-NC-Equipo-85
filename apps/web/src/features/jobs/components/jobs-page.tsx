"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@app/ui";
import { useJobMatches } from "../hooks/use-jobs";
import { JobsTable } from "./jobs-table";
import { ApiErrorState } from "@/components/api-error-state";

export function JobsPage() {
  const t = useTranslations("common.jobs");
  const { data: jobs, isLoading, error, refetch } = useJobMatches();

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

      <JobsTable jobs={jobs ?? []} isLoading={isLoading} />
    </div>
  );
}
