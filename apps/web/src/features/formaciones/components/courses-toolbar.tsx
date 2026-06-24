"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { cn } from "@app/ui";
import { CoursesFilters } from "./courses-filters";

type CoursesToolbarProps = {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
};

export function CoursesToolbar({ view, onViewChange }: CoursesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CoursesFilters />

      <div className="flex items-center gap-1 rounded-lg border p-1" role="tablist" aria-label="Vista de cursos">
        <button
          role="tab"
          aria-selected={view === "grid"}
          onClick={() => onViewChange("grid")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "grid"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="size-4" />
          Grid
        </button>
        <button
          role="tab"
          aria-selected={view === "table"}
          onClick={() => onViewChange("table")}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            view === "table"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Table2 className="size-4" />
          Tabla
        </button>
      </div>
    </div>
  );
}