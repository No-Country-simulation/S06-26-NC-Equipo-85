"use client";

import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import type { Job } from "@/services/jobs/jobs.types";
import { DataTable } from "@/features/shared/components/data-table";
import { Badge } from "@app/ui";
import { MatchScoreBar } from "./match-score-bar";

type JobsTableProps = {
  jobs: Job[];
  isLoading?: boolean;
  onSelect?: (job: Job) => void;
};

export function JobsTable({ jobs, isLoading, onSelect }: JobsTableProps) {
  const t = useTranslations("common.jobs");

  const columns: ColumnDef<Job>[] = [
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
      accessorKey: "area",
      header: t("columns.area"),
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.area}</Badge>
      ),
    },
    {
      id: "matchScore",
      header: t("columns.match"),
      enableSorting: true,
      cell: ({ row }) => <MatchScoreBar score={row.original.matchScore} />,
    },
    {
      accessorKey: "salary",
      header: t("columns.salary"),
      cell: ({ row }) => row.original.salary ?? "-",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onSelect?.(row.original)}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("see_requirements")}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={jobs}
      isLoading={isLoading}
      emptyMessage={t("no_results")}
    />
  );
}
