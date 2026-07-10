import type { JobMatch } from "@/services/jobs/jobs.types";

/**
 * Contratos de orientación inicial (`orientation-controller`).
 *
 * Fuente de verdad: OpenAPI (`App BiT API v1`), endpoint `POST /api/v1/guidance`
 * 🔒 (sin body: el usuario se infiere del Bearer token). El backend responde con
 * claves en español (`gapPorcentual`, `confianza`, `trayectoriaSugerida`, …).
 * `GuidanceResponseDto` refleja ese JSON tal cual; el service lo mapea al tipo de
 * dominio `OrientationResponse` (nombres en inglés, regla del proyecto) que
 * consumen la UI y el store. Así los componentes no dependen de la nomenclatura
 * del backend.
 */

export type GapItem = {
  id: string;
  name: string;
  level: string;
};

export type SuggestedCourse = {
  courseId: string;
  title: string;
  provider: string;
  contributedSkills: string[];
};

/**
 * Forma cruda de `POST /api/v1/guidance` (claves en español del backend).
 *
 * `gapItems` y `vacantesCompatibles` ya coinciden con `GapItem`/`JobMatch`; solo
 * `trayectoriaSugerida` (con `skillsContribuidos`) requiere renombrado al mapear.
 */
export type GuidanceResponseDto = {
  gapPorcentual: number;
  gapItems: GapItem[];
  trayectoriaSugerida: {
    courseId: string;
    title: string;
    provider: string;
    skillsContribuidos: string[];
  }[];
  vacantesCompatibles: JobMatch[];
  confianza: number;
  /** Recomendación libre generada por IA (Gemini). Puede venir ausente. */
  aiRecommendation?: string;
};

export type OrientationResponse = {
  /** Brecha de perfil en escala 0-100. */
  gapPercentage: number;
  gapItems: GapItem[];
  suggestedPath: SuggestedCourse[];
  /** Reutiliza `JobMatch` de jobs: mismo `matchRate` en escala 0-100. */
  compatibleJobs: JobMatch[];
  /** Confianza del modelo, escala 0-100. */
  confidence: number;
  /** Recomendación libre generada por IA (Gemini), si el backend la incluyó. */
  aiRecommendation?: string;
};
