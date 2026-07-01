"use client";

import { Button, Card, CardContent, Spinner } from "@app/ui";
import { Play } from "lucide-react";
import type { Experience } from "@/services/experiencias/experiencias.types";

type ExperienciasGridProps = {
  experiences: Experience[];
  isLoading: boolean;
  onSelect: (experience: Experience) => void;
};

export function ExperienciasGrid({ experiences, isLoading, onSelect }: ExperienciasGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((exp) => (
        <Card key={exp.id} className="overflow-hidden">
          <div className="relative aspect-video w-full bg-arena flex items-center justify-center">
            <Play className="size-12 text-terracota/60" />
            {exp.duration && (
              <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                {exp.duration}
              </span>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-cacao line-clamp-2">
                  {exp.title}
                </h3>
                <p className="mt-1 text-xs text-topo">
                  {exp.speakerName} · {exp.speakerRole}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-terracota-soft px-2.5 py-0.5 text-xs font-medium text-cacao">
                {exp.area}
              </span>
              <span className="rounded-full bg-arena px-2.5 py-0.5 text-xs font-medium text-topo">
                {exp.experienceType}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => onSelect(exp)}
            >
              <Play className="mr-2 size-3.5" />
              Ver historia
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}