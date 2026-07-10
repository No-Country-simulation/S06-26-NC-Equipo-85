import { apiRequest } from "@/lib/api";
import { normalizePercentage } from "@/lib/normalize";
import type {
  GuidanceResponseDto,
  OrientationResponse,
} from "./orientation.types";

const GUIDANCE_PATH = "/api/v1/guidance";

/**
 * Mapea la respuesta cruda del backend (claves en español) al tipo de dominio.
 *
 * Renombra `trayectoriaSugerida`/`skillsContribuidos` a `suggestedPath`/
 * `contributedSkills` y normaliza los porcentajes a la escala 0-100
 * (redondeo + clamp), igual que `jobs.service` con `matchRate`.
 */
function mapGuidance(dto: GuidanceResponseDto): OrientationResponse {
  return {
    gapPercentage: normalizePercentage(dto.gapPorcentual),
    confidence: normalizePercentage(dto.confianza),
    gapItems: dto.gapItems ?? [],
    suggestedPath: (dto.trayectoriaSugerida ?? []).map((course) => ({
      courseId: course.courseId,
      title: course.title,
      provider: course.provider,
      contributedSkills: course.skillsContribuidos ?? [],
    })),
    compatibleJobs: (dto.vacantesCompatibles ?? []).map((job) => ({
      ...job,
      matchRate: normalizePercentage(job.matchRate),
    })),
    aiRecommendation: dto.aiRecommendation,
  };
}

/**
 * Genera la orientación inicial del usuario (`POST /api/v1/guidance`, sin body).
 *
 * El usuario se infiere del Bearer token: el endpoint ya no acepta `userId`
 * (se resolvió el bloqueante histórico, ver memoria de integración). Consume
 * siempre el backend real, sin mock de respaldo.
 */
export async function requestOrientation(): Promise<OrientationResponse> {
  const dto = await apiRequest<GuidanceResponseDto>(GUIDANCE_PATH, {
    method: "POST",
  });

  return mapGuidance(dto);
}
