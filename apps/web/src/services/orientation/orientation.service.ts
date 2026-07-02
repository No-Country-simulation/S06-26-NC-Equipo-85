import { apiRequest } from "@/lib/api";
import { normalizePercentage } from "@/lib/normalize";
import type { OrientationRequest, OrientationResponse } from "./orientation.types";

const ORIENTAR_PATH = "/api/orientar";

/**
 * Solicita la orientación inicial del usuario (`POST /api/orientar`).
 *
 * Se dispara tras persistir el perfil (`PUT /api/v1/profile`); el backend
 * resuelve el gap desde ese perfil ya guardado (`{ userId }`, derivado del JWT).
 * Normaliza `gapPorcentual`, `confianza` y el `matchRate` de cada vacante
 * compatible (ver `lib/normalize.ts`), igual criterio que
 * `jobs.service.getJobMatches`. Cada sección de la respuesta puede venir vacía y
 * la pantalla de éxito la resuelve con su propio empty state; consume siempre el
 * backend real, sin mock de respaldo.
 */
export async function requestOrientation(
  payload: OrientationRequest,
): Promise<OrientationResponse> {
  const result = await apiRequest<OrientationResponse>(ORIENTAR_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    ...result,
    gapPorcentual: normalizePercentage(result.gapPorcentual),
    confianza: normalizePercentage(result.confianza),
    gapItems: result.gapItems ?? [],
    trayectoriaSugerida: result.trayectoriaSugerida ?? [],
    vacantesCompatibles: (result.vacantesCompatibles ?? []).map((job) => ({
      ...job,
      matchRate: normalizePercentage(job.matchRate),
    })),
  };
}
