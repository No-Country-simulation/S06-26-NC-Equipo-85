"use client";

import { useState } from "react";
import { useJobs } from "../hooks/use-jobs";
import { JobsTable } from "./jobs-table";
import { JobDetail } from "./job-detail";
import { EmptyState } from "@/features/shared/components/empty-state";
import { AlertCircle } from "lucide-react";
import type { Job } from "@/services/jobs/jobs.types";

export function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { data: jobs, isLoading, error, refetch } = useJobs();

  function handleSelect(job: Job) {
    setSelectedJob(job);
    setDetailOpen(true);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Error al cargar vacantes</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Empleabilidad</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vacantes compatibles con tu perfil. Revisá qué requisitos te faltan y
          encontrá el curso ideal para cerrar la brecha.
        </p>
      </div>

      {!isLoading && jobs?.length === 0 && (
        <EmptyState title="No hay vacantes disponibles" />
      )}

      <JobsTable jobs={jobs ?? []} isLoading={isLoading} onSelect={handleSelect} />

      <JobDetail
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}