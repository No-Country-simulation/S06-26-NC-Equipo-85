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

export type CourseLevel = "principiante" | "intermedio" | "avanzado";
export type CourseStatus = "disponible" | "en-progreso" | "completado";

export type Course = {
  id: string;
  title: string;
  provider: string;
  level: CourseLevel;
  status?: CourseStatus;
};

const LEVEL_LABEL: Record<CourseLevel, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const STATUS: Record<
  CourseStatus,
  { label: string; variant: "secondary" | "warning" | "success" }
> = {
  disponible: { label: "Disponible", variant: "secondary" },
  "en-progreso": { label: "En progreso", variant: "warning" },
  completado: { label: "Completado", variant: "success" },
};

type CourseCardProps = {
  course: Course;
  ctaLabel?: string;
  onAction?: (course: Course) => void;
  action?: React.ReactNode;
  className?: string;
};

function CourseCard({
  course,
  ctaLabel = "Ver curso",
  onAction,
  action,
  className,
}: CourseCardProps) {
  const status = course.status ? STATUS[course.status] : null;
  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="grid gap-0.5">
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.provider}</CardDescription>
          </div>
          {status && <Badge variant={status.variant}>{status.label}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <Badge variant="outline">{LEVEL_LABEL[course.level]}</Badge>
      </CardContent>
      <CardFooter>
        {action ?? (
          <Button variant="secondary" onClick={() => onAction?.(course)}>
            {ctaLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export { CourseCard };
export type { CourseCardProps };
