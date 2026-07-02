import type { JobMatch } from "@/services/jobs/jobs.types";

/**
 * Contratos de orientación inicial.
 *
 * Fuente de verdad: `POST /api/orientar` del OpenAPI. El backend resuelve la
 * orientación a partir del perfil ya persistido (`PUT /api/v1/profile`); el
 * request solo necesita `userId` (derivado del claim `sub` del JWT), no el
 * perfil completo como en el contrato anterior.
 */

export type OrientationRequest = {
  userId: string;
};

export type GapItem = {
  id: string;
  name: string;
  level: string;
};

export type SuggestedCourse = {
  courseId: string;
  title: string;
  provider: string;
  skillsContribuidos: string[];
};

export type OrientationResponse = {
  /** Normalizado a escala 0-100 en `orientation.service.ts`. */
  gapPorcentual: number;
  gapItems: GapItem[];
  trayectoriaSugerida: SuggestedCourse[];
  /** Reutiliza `JobMatch` de jobs: mismo `matchRate` ya normalizado. */
  vacantesCompatibles: JobMatch[];
  /**
   * Indicador de confianza del modelo. El OpenAPI no aclara si viaja como
   * fracción (`0-1`) o porcentaje; se normaliza igual que `gapPorcentual`.
   */
  confianza: number;
};
