"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../../atoms/button";
import { Spinner } from "../../atoms/spinner";
import { EmptyState } from "../empty-state";

/**
 * Textos de UI. Se inyectan desde la app (i18n) para mantener el
 * componente agnóstico de Next/next-intl.
 */
type DataTableLabels = {
  /** Texto cuando la tabla no tiene filas. */
  empty: string;
  /** Etiqueta del botón "página anterior". */
  previous: string;
  /** Etiqueta del botón "página siguiente". */
  next: string;
  /** Indicador de paginación, p. ej. "Página 1 de 3". */
  pageInfo: (page: number, total: number) => string;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  labels: DataTableLabels;
  isLoading?: boolean;
  /** Mensaje de vacío; si se omite usa `labels.empty`. */
  emptyMessage?: string;
  pageSize?: number;
  className?: string;
};

function DataTable<T>({
  columns,
  data,
  labels,
  isLoading,
  emptyMessage,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library -- useReactTable() returns unstable function refs by design; not passed to memoized children here.
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage ?? labels.empty} />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const headerContent = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  );
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : canSort
                              ? "none"
                              : undefined
                      }
                      className="h-10 px-3 text-left text-xs font-medium text-muted-foreground"
                    >
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 outline-none transition-colors select-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          {headerContent}
                          <span className="text-muted-foreground/50">
                            {sorted === "asc" ? (
                              <ChevronUp className="size-3.5" />
                            ) : sorted === "desc" ? (
                              <ChevronDown className="size-3.5" />
                            ) : (
                              <ChevronsUpDown className="size-3.5" />
                            )}
                          </span>
                        </button>
                      ) : (
                        headerContent
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {labels.pageInfo(
              table.getState().pagination.pageIndex + 1,
              table.getPageCount(),
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {labels.previous}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {labels.next}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };
export type { DataTableProps, DataTableLabels };
