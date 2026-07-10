import type { SessionStatus } from "@/services/mentorships/mentorships.types";

/** Estados disponibles como filtro/etiqueta (labels vía i18n en el componente). */
export const SESSION_STATUSES: readonly SessionStatus[] = [
  "AVAILABLE",
  "PENDING",
  "SCHEDULED",
  "COMPLETED",
  "CANCELED",
] as const;

/**
 * Variante de `Badge` (`@app/ui`) por estado. `azul-horizonte` se reserva a
 * mentorías pero `Badge` no expone esa variante, así que se mapea a las
 * semánticas: disponible→secondary (ámbar), agendada→success (confirmada),
 * pendiente→warning, terminales→outline (`granate`/destructive queda para CVV).
 */
export const SESSION_STATUS_VARIANT: Record<
  SessionStatus,
  "secondary" | "success" | "warning" | "outline"
> = {
  AVAILABLE: "secondary",
  PENDING: "warning",
  SCHEDULED: "success",
  COMPLETED: "outline",
  CANCELED: "outline",
};

/** Contexto desde el que se mira una sesión: catálogo público o "mis sesiones". */
export type SessionContext = "explore" | "mine";

/** Acciones posibles sobre una sesión. */
export type SessionAction = "book" | "complete" | "cancel";

/**
 * Acciones habilitadas según estado, rol y contexto. Data/lógica pura, separada
 * de la presentación: el componente solo renderiza el resultado.
 *
 * - Explorar: el MENTEE reserva slots `AVAILABLE`; el mentor solo mira.
 * - Mis sesiones: el mentor completa las activas (PENDING/SCHEDULED); mentor y
 *   mentee pueden cancelar mientras no estén en un estado terminal.
 *
 * La autorización final la impone el backend (403 → estado de error en la UI);
 * acá solo se decide qué ofrecer para no mostrar acciones sin sentido.
 */
export function getSessionActions(
  status: SessionStatus,
  isMentor: boolean,
  context: SessionContext,
): SessionAction[] {
  if (context === "explore") {
    return status === "AVAILABLE" && !isMentor ? ["book"] : [];
  }

  const actions: SessionAction[] = [];
  const active = status === "PENDING" || status === "SCHEDULED";

  if (isMentor && active) {
    actions.push("complete");
  }
  if (status === "AVAILABLE" || active) {
    actions.push("cancel");
  }

  return actions;
}

/**
 * Convierte el valor de un input `datetime-local` (hora local) a ISO 8601 para
 * enviarlo al backend. Ante un valor inválido devuelve el string original.
 */
export function localInputToIso(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}
