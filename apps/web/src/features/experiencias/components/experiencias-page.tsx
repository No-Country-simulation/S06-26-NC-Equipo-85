"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { useExperiencias } from "../hooks/use-experiencias";
import { ExperienciasFilters } from "./experiencias-filters";
import { ExperienciasGrid } from "./experiencias-grid";
import { ExperienceDialog } from "./experience-dialog";
import { EmptyState } from "@app/ui";
import { AlertCircle } from "lucide-react";
import type { Experience } from "@/services/experiencias/experiencias.types";

export function ExperienciasPage() {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [area] = useQueryState("area");
  const [type] = useQueryState("type");

  const filters = {
    area: area as Experience["area"] | undefined,
    experienceType: type as Experience["experienceType"] | undefined,
  };
  const { data: experiences, isLoading, error, refetch } = useExperiencias(filters);

  function handleSelect(exp: Experience) {
    setSelectedExperience(exp);
    setDialogOpen(true);
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Error al cargar experiencias</p>
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
        <h1 className="text-3xl font-semibold text-foreground">Experiencias</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Historias en video de personas que ya recorrieron el camino que estás empezando.
        </p>
      </div>

      <ExperienciasFilters />

      {!isLoading && experiences?.length === 0 && (
        <EmptyState title="No hay experiencias disponibles" />
      )}

      <ExperienciasGrid
        experiences={experiences ?? []}
        isLoading={isLoading}
        onSelect={handleSelect}
      />

      <ExperienceDialog
        experience={selectedExperience}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}