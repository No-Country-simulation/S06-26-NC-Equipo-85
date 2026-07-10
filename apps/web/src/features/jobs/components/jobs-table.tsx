"use client";

import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import type { JobMatch } from "@/services/jobs/jobs.types";
import { DataTable } from "@app/ui";
import { Link } from "@/i18n/navigation";
import { MatchScoreBar } from "./match-score-bar";

type JobsTableProps = {
  jobs: JobMatch[];
  isLoading?: boolean;
};

export function JobsTable({ jobs, isLoading }: JobsTableProps) {
  const t = useTranslations("common.jobs");
  const tTable = useTranslations("common.table");

  const columns: ColumnDef<JobMatch>[] = [
    {
      accessorKey: "title",
      header: t("columns.job"),
      enableSorting: true,
    },
    {
      accessorKey: "company",
      header: t("columns.company"),
      enableSorting: true,
    },
    {
      id: "matchRate",
      header: t("columns.match"),
      enableSorting: true,
      cell: ({ row }) => <MatchScoreBar score={row.original.matchRate} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Link
          href={`/jobs/${row.original.jobId}`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("see_requirements")}
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={jobs}
      isLoading={isLoading}
      emptyMessage={t("no_results")}
      labels={{
        empty: tTable("empty"),
        previous: tTable("previous"),
        next: tTable("next"),
        pageInfo: (page, total) => tTable("page_of", { page, total }),
      }}
    />
  );
}
