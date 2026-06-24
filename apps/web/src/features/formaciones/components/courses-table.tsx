"use client";

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

const LEVEL_LABEL: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Curso",
    enableSorting: true,
  },
  {
    accessorKey: "provider",
    header: "Proveedor",
    enableSorting: true,
    cell: ({ row }) => (
      <Badge variant="secondary">{PROVIDER_LABEL[row.original.provider] ?? row.original.provider}</Badge>
    ),
  },
  {
    accessorKey: "level",
    header: "Nivel",
    enableSorting: true,
    cell: ({ row }) => LEVEL_LABEL[row.original.level] ?? row.original.level,
  },
  {
    accessorKey: "area",
    header: "Área",
    enableSorting: true,
  },
  {
    accessorKey: "duration",
    header: "Duración",
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
        {row.original.videoUrl ? "Ver video" : "Sin preview"}
      </button>
    ),
  },
];

export function CoursesTable({ courses, isLoading }: CoursesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={courses}
      isLoading={isLoading}
      emptyMessage="No hay cursos con esos filtros"
    />
  );
}