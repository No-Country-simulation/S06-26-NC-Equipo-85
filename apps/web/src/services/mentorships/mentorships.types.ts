/**
 * Contratos del módulo de mentorías — `/api/v1/mentorships` 🔒.
 *
 * Fuente de verdad: OpenAPI (`App BiT API v1`). El modelo es "session-centric":
 * un MENTOR publica slots (`POST /sessions`, quedan `AVAILABLE`), un MENTEE los
 * reserva (`POST /sessions/{id}/book`), el mentor las marca completadas y ambos
 * pueden cancelarlas. La respuesta viene en snake_case (`mentor_profile_id`,
 * `schedule_date`, `is_practice_invitation`) y se respeta **tal cual**; el body
 * de create, en cambio, es camelCase (`scheduleDate`, `practice`).
 */

/** Estados del ciclo de vida de una sesión (enum del backend). */
export type SessionStatus =
  | "AVAILABLE"
  | "PENDING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELED";

/**
 * Sesión de mentoría. Misma forma para el listado, el detalle y las respuestas
 * de las acciones (book/complete/cancel/create).
 *
 * El contrato no expone un flag `owner`: el front no puede resolver el UUID del
 * usuario autenticado (ver `lib/jwt.ts`), así que la UI habilita acciones por
 * rol (`getRoleFromToken`) + estado y deja la autorización final al backend
 * (un 403 se trata como estado de error).
 */
export type Session = {
  id: string;
  title: string;
  status: SessionStatus;
  mentor_profile_id: string;
  mentee_profile_id: string;
  /** ISO 8601 de la fecha/hora agendada. */
  schedule_date: string;
  is_practice_invitation: boolean;
};

/**
 * Body de `POST /api/v1/mentorships/sessions` (solo rol MENTOR).
 *
 * El backend deriva el mentor del Bearer token. Claves en camelCase (a
 * diferencia de la respuesta, en snake_case).
 */
export type SessionCreateRequest = {
  title: string;
  /** ISO 8601. */
  scheduleDate: string;
  practice: boolean;
};

/** Filtros opcionales del listado (`GET /sessions`, query params). */
export type SessionFilters = {
  /** Sin `status`, el backend devuelve `AVAILABLE` por defecto. */
  status?: SessionStatus;
  practice?: boolean;
  /** `YYYY-MM-DD`. */
  date?: string;
};
