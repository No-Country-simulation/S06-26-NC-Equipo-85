"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@app/ui";
import { Badge } from "@app/ui";
import { MatchScoreBar } from "./match-score-bar";
import { RequirementsChecklist } from "./requirements-checklist";
import type { Job } from "@/services/jobs/jobs.types";

type JobDetailProps = {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobDetail({ job, open, onOpenChange }: JobDetailProps) {
  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-xl">{job.title}</SheetTitle>
              <SheetDescription className="mt-1">
                {job.company}
                {job.location ? ` · ${job.location}` : ""}
              </SheetDescription>
            </div>
            <Badge variant="success">{job.matchScore}% match</Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground">Salario estimado</p>
            <p className="text-sm text-muted-foreground">{job.salary ?? "No especificado"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Descripción</p>
            <p className="mt-1 text-sm text-muted-foreground">{job.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Match de perfil</p>
            <MatchScoreBar score={job.matchScore} showLabel={false} />
            <p className="mt-2 text-xs text-muted-foreground">
              {job.matchScore >= 70
                ? "Tenés un buen perfil para esta vacante."
                : job.matchScore >= 50
                  ? "Te falta cubrir algunos requisitos clave."
                  : "Esta vacante requiere más preparación."}
            </p>
          </div>

           <RequirementsChecklist
            requirements={job.requirements}
            missing={job.missingRequirements}
            area={job.area}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}