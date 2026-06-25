"use client";

import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "@/services/courses/courses.types";
import { DataTable } from "@/features/shared/components/data-table";
import { Badge } from "@app/ui";

type CoursesTableProps = {
  courses: Course[];
  isLoading?: boolean;
};

const PROVIDER_LABEL: Record<string, string> = {
  google: "Google",
  oracle: "Oracle",
  aws: "AWS",
  microsoft: "Microsoft",
  freecodecamp: "freeCodeCamp",
};

export function CoursesTable({ courses, isLoading }: CoursesTableProps) {
  const t = useTranslations("common.courses");

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "title",
      header: t("columns.course"),
      enableSorting: true,
    },
    {
      accessorKey: "provider",
      header: t("columns.provider"),
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant="secondary">
          {PROVIDER_LABEL[row.original.provider] ?? row.original.provider}
        </Badge>
      ),
    },
    {
      accessorKey: "level",
      header: t("columns.level"),
      enableSorting: true,
      cell: ({ row }) => t(`levels.${row.original.level}`),
    },
    {
      accessorKey: "area",
      header: t("columns.area"),
      enableSorting: true,
      cell: ({ row }) => t(`areas.${row.original.area}`),
    },
    {
      accessorKey: "duration",
      header: t("columns.duration"),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => row.original.videoUrl && window.open(row.original.videoUrl, "_blank")}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          disabled={!row.original.videoUrl}
        >
          {row.original.videoUrl ? t("watch_video") : t("no_preview")}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={courses}
      isLoading={isLoading}
      emptyMessage={t("no_results")}
    />
  );
}
