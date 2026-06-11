import * as React from "react";

import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../atoms/avatar";
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

export type Mentor = {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  /** Disponible para agendar. */
  available?: boolean;
  /** Texto de disponibilidad (p. ej. "Lun y Mié, tardes"). */
  availability?: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type MentorCardProps = {
  mentor: Mentor;
  ctaLabel?: string;
  onAction?: (mentor: Mentor) => void;
  action?: React.ReactNode;
  className?: string;
};

function MentorCard({
  mentor,
  ctaLabel = "Agendar",
  onAction,
  action,
  className,
}: MentorCardProps) {
  const available = mentor.available ?? true;
  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            {mentor.avatarUrl && (
              <AvatarImage src={mentor.avatarUrl} alt="" />
            )}
            <AvatarFallback>{initials(mentor.name)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <CardTitle>{mentor.name}</CardTitle>
            <CardDescription>{mentor.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Badge variant={available ? "success" : "outline"}>
          {available ? "Disponible" : "Sin cupos"}
        </Badge>
        {mentor.availability && (
          <span className="text-xs text-muted-foreground">
            {mentor.availability}
          </span>
        )}
      </CardContent>
      <CardFooter>
        {action ?? (
          <Button
            // azul-horizonte → confianza/mentorías
            className="bg-azul-horizonte text-crema hover:bg-azul-horizonte/90"
            disabled={!available}
            onClick={() => onAction?.(mentor)}
          >
            {ctaLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export { MentorCard };
export type { MentorCardProps };
