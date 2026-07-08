import { ApiError, apiRequest } from "@/lib/api";
import type {
  Session,
  SessionCreateRequest,
  SessionFilters,
} from "./mentorships.types";

const SESSIONS_PATH = "/api/v1/mentorships/sessions";
const MY_SESSIONS_PATH = "/api/v1/mentorships/my-sessions";

/**
 * Lista sesiones con filtros opcionales (`GET /sessions`).
 *
 * Sin `status`, el backend devuelve las `AVAILABLE`. Una lista vacía es un
 * estado válido (empty state en la UI): consume siempre el backend real.
 */
export async function getSessions(
  filters?: SessionFilters,
): Promise<Session[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (typeof filters?.practice === "boolean") {
    params.set("practice", String(filters.practice));
  }
  if (filters?.date) params.set("date", filters.date);

  const query = params.toString();
  const sessions = await apiRequest<Session[]>(
    `${SESSIONS_PATH}${query ? `?${query}` : ""}`,
  );

  return sessions ?? [];
}

/**
 * Sesiones del usuario autenticado, como mentor o mentee
 * (`GET /my-sessions`). El backend infiere el usuario del Bearer.
 */
export async function getMySessions(): Promise<Session[]> {
  const sessions = await apiRequest<Session[]>(MY_SESSIONS_PATH);
  return sessions ?? [];
}

/**
 * Detalle de una sesión (`GET /sessions/{id}`).
 *
 * Devuelve `null` ante un 404 para que la UI lo trate como estado ("no
 * encontrada") y no como excepción (mismo criterio que otras integraciones).
 */
export async function getSessionById(id: string): Promise<Session | null> {
  try {
    return await apiRequest<Session>(`${SESSIONS_PATH}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

/**
 * Crea un slot de sesión disponible (`POST /sessions`, solo rol MENTOR).
 * El 403 para no-mentores lo maneja la UI (que además oculta la acción).
 */
export async function createSession(
  body: SessionCreateRequest,
): Promise<Session> {
  return apiRequest<Session>(SESSIONS_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Reserva una sesión disponible (`POST /sessions/{id}/book`, solo rol MENTEE).
 */
export async function bookSession(id: string): Promise<Session> {
  return apiRequest<Session>(`${SESSIONS_PATH}/${id}/book`, { method: "POST" });
}

/**
 * Marca una sesión como completada (`PATCH /sessions/{id}/complete`, solo el
 * mentor dueño de la sesión).
 */
export async function completeSession(id: string): Promise<Session> {
  return apiRequest<Session>(`${SESSIONS_PATH}/${id}/complete`, {
    method: "PATCH",
  });
}

/**
 * Cancela una sesión (`PATCH /sessions/{id}/cancel`, mentor o mentee asignado).
 */
export async function cancelSession(id: string): Promise<Session> {
  return apiRequest<Session>(`${SESSIONS_PATH}/${id}/cancel`, {
    method: "PATCH",
  });
}
