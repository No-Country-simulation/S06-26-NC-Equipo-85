"use client";

import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "@/services/courses/courses.types";
import { Badge, DataTable } from "@app/ui";
import { Link } from "@/i18n/navigation";

type CoursesTableProps = {
  courses: Course[];
  isLoading?: boolean;
};

export function CoursesTable({ courses, isLoading }: CoursesTableProps) {
  const t = useTranslations("common.courses");
  const tTable = useTranslations("common.table");
  const tSkills = useTranslations("common.skills.categories");

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "name",
      header: t("columns.course"),
      enableSorting: true,
    },
    {
      accessorKey: "provider",
      header: t("columns.provider"),
      enableSorting: true,
      cell: ({ row }) => <Badge variant="secondary">{row.original.provider}</Badge>,
    },
    {
      accessorKey: "level",
      header: t("columns.level"),
      enableSorting: true,
      cell: ({ row }) => t(`levels.${row.original.level}`),
    },
    {
      id: "skills",
      header: t("columns.skills"),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.skills.map((skill) => (
            <Badge key={skill.name} variant="outline" title={tSkills(skill.category)}>
              {skill.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Link
          href={`/courses/${row.original.id}`}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("see_detail")}
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={courses}
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
