import { ApiError, apiRequest } from "@/lib/api";
import type {
  ExperienceDetail,
  ExperienceFilters,
  ExperienceListItem,
  ExperienceUpsertRequest,
} from "./experiences.types";

const EXPERIENCES_PATH = "/api/v1/experiences";

/**
 * Lista experiencias con filtros opcionales (`GET /api/v1/experiences`).
 *
 * Filtros server-side por `skillId` y `type`. Una lista vacía es un estado
 * válido (empty state en la UI): consume siempre el backend real, sin mock.
 */
export async function getExperiences(
  filters?: ExperienceFilters,
): Promise<ExperienceListItem[]> {
  const params = new URLSearchParams();
  if (filters?.skillId) params.set("skillId", filters.skillId);
  if (filters?.type) params.set("type", filters.type);

  const query = params.toString();
  const experiences = await apiRequest<ExperienceListItem[]>(
    `${EXPERIENCES_PATH}${query ? `?${query}` : ""}`,
  );

  return experiences ?? [];
}

/**
 * Detalle de una experiencia (`GET /api/v1/experiences/{id}`).
 *
 * Devuelve `null` ante un 404, igual criterio que `jobs.service.getJobById`,
 * para que la UI lo trate como estado ("no encontrada") y no como excepción.
 */
export async function getExperienceById(
  id: string,
): Promise<ExperienceDetail | null> {
  try {
    return await apiRequest<ExperienceDetail>(`${EXPERIENCES_PATH}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

/**
 * Crea una experiencia (`POST /api/v1/experiences`, solo rol MENTOR).
 *
 * El backend deriva el mentor del Bearer token; el 403 para no-mentores lo
 * maneja la UI (que además oculta la acción según el rol del JWT).
 */
export async function createExperience(
  body: ExperienceUpsertRequest,
): Promise<ExperienceDetail> {
  return apiRequest<ExperienceDetail>(EXPERIENCES_PATH, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Actualiza una experiencia (`PUT /api/v1/experiences/{id}`, solo mentor dueño).
 */
export async function updateExperience(
  id: string,
  body: ExperienceUpsertRequest,
): Promise<ExperienceDetail> {
  return apiRequest<ExperienceDetail>(`${EXPERIENCES_PATH}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * Elimina una experiencia (`DELETE /api/v1/experiences/{id}`, solo mentor dueño).
 *
 * Responde 200 sin cuerpo; `apiRequest` resuelve a `null` (tratado como void).
 */
export async function deleteExperience(id: string): Promise<void> {
  await apiRequest<void>(`${EXPERIENCES_PATH}/${id}`, { method: "DELETE" });
}
