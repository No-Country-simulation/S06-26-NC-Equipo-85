"use client";

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
  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "title",
      header: "Vacante",
      enableSorting: true,
    },
    {
      accessorKey: "company",
      header: "Empresa",
      enableSorting: true,
    },
    {
      accessorKey: "area",
      header: "Área",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.area}</Badge>
      ),
    },
    {
      id: "matchScore",
      header: "Match",
      enableSorting: true,
      cell: ({ row }) => <MatchScoreBar score={row.original.matchScore} />,
    },
    {
      accessorKey: "salary",
      header: "Salario",
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
          Ver requisitos
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={jobs}
      isLoading={isLoading}
      emptyMessage="No hay vacantes disponibles"
    />
  );
}