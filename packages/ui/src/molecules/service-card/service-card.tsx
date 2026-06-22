import * as React from "react";

import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../atoms/card";

export type ServiceCardAccent = "ambar" | "terracota" | "azul-horizonte";

const accentClasses: Record<ServiceCardAccent, { border: string; icon: string }> = {
  ambar: { border: "border-t-ambar", icon: "text-ambar" },
  terracota: { border: "border-t-terracota", icon: "text-terracota" },
  "azul-horizonte": { border: "border-t-azul-horizonte", icon: "text-azul-horizonte" },
};

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Color de acento del módulo destino (borde superior + ícono). */
  accentColor: ServiceCardAccent;
  /** Callback al interactuar con la card. Ignorado si se provee `action` (slot). */
  onAction?: () => void;
  /** Slot para inyectar navegación (p. ej. <Link> de la app). */
  action?: React.ReactNode;
  className?: string;
};

function ServiceCard({
  icon,
  title,
  description,
  accentColor,
  onAction,
  action,
  className,
}: ServiceCardProps) {
  const accent = accentClasses[accentColor];

  return (
    <Card
      onClick={action ? undefined : onAction}
      className={cn("border-t-3", accent.border, className)}
    >
      <CardHeader>
        <div className={cn("mb-1", accent.icon)} aria-hidden>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}

export { ServiceCard };
export type { ServiceCardProps };
