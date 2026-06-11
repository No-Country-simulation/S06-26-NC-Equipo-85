import * as React from "react";

import { cn } from "../../lib/utils";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../atoms/card";

export type Job = {
  id: string;
  title: string;
  company: string;
  area: string;
  location?: string;
  /** Porcentaje de match 0–100. */
  matchScore?: number;
};

type JobCardProps = {
  job: Job;
  /** Texto del CTA (default ES). */
  ctaLabel?: string;
  /** Callback del CTA. Ignorado si se provee `action` (slot). */
  onAction?: (job: Job) => void;
  /** Slot para inyectar navegación (p. ej. <Link> de la app). */
  action?: React.ReactNode;
  className?: string;
};

function JobCard({
  job,
  ctaLabel = "Ver vacante",
  onAction,
  action,
  className,
}: JobCardProps) {
  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="grid gap-0.5">
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>
              {job.company}
              {job.location ? ` · ${job.location}` : ""}
            </CardDescription>
          </div>
          {typeof job.matchScore === "number" && (
            <Badge variant="success" aria-label={`${job.matchScore}% de match`}>
              {job.matchScore}% match
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{job.area}</Badge>
      </CardContent>
      <CardFooter>
        {action ?? (
          <Button onClick={() => onAction?.(job)}>{ctaLabel}</Button>
        )}
      </CardFooter>
    </Card>
  );
}

export { JobCard };
export type { JobCardProps };
