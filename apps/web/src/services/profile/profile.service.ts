import { ApiError, apiRequest, getApiBaseUrl } from "@/lib/api";
import type { ProfileResponse, ProfileUpsertRequest } from "./profile.types";

const PROFILE_PATH = "/api/v1/profile";

/** Clave compartida para cachear el perfil en TanStack Query. */
export const PROFILE_QUERY_KEY = ["profile"] as const;

/**
 * Obtiene el perfil del usuario autenticado.
 *
 * Devuelve `null` cuando el usuario todavía no creó su perfil (el back responde
 * 404) o cuando no hay API configurada (desarrollo sin backend). El resto de
 * errores se propaga como `ApiError`.
 */
export async function getProfile(): Promise<ProfileResponse | null> {
  if (!getApiBaseUrl()) {
    return null;
  }

  try {
    return await apiRequest<ProfileResponse>(PROFILE_PATH, { method: "GET" });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

/**
 * Crea o actualiza (UPSERT) el perfil del usuario autenticado.
 *
 * Sin API configurada devuelve un eco del payload para mantener el onboarding
 * testeable en desarrollo (mismo criterio que el resto de services).
 */
export async function upsertProfile(
  payload: ProfileUpsertRequest,
): Promise<ProfileResponse> {
  if (!getApiBaseUrl()) {
    return payload;
  }

  return apiRequest<ProfileResponse>(PROFILE_PATH, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
