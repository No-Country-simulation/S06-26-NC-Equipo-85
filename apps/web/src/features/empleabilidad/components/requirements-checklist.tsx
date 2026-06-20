"use client";

import { CheckCircle2, Circle, GraduationCap } from "lucide-react";
import { cn } from "@app/ui";
import Link from "next/link";

type RequirementsChecklistProps = {
  requirements: string[];
  missing: string[];
  area?: string;
};

export function RequirementsChecklist({
  requirements,
  missing,
  area,
}: RequirementsChecklistProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Requisitos</p>
      <ul className="space-y-2">
        {requirements.map((req) => {
          const isPending = missing.includes(req);
          return (
            <li key={req} className="flex items-start gap-3">
              {isPending ? (
                <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-oliva" />
              )}
              <div className="flex flex-1 items-start justify-between gap-2">
                <span
                  className={cn(
                    "text-sm",
                    isPending ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {req}
                </span>
                {isPending && (
                  <Link
                    href={area ? `/formaciones?area=${area}` : "/formaciones"}
                    className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <GraduationCap className="size-3" />
                    Ver curso
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}