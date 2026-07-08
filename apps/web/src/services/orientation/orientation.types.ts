import type { JobMatch } from "@/services/jobs/jobs.types";

/**
 * Contratos de orientación inicial.
 *
 * El endpoint real todavía no existe: el service devuelve mock temporal (ver
 * `orientation.service.ts`). Cuando el backend publique el endpoint definitivo
 * —que será distinto al `/api/orientar` de prueba— se ajustan estos tipos a su
 * contrato. Mientras tanto controlamos la forma acá, con nombres en inglés.
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

export type OrientationResponse = {
  /** Brecha de perfil en escala 0-100. */
  gapPercentage: number;
  gapItems: GapItem[];
  suggestedPath: SuggestedCourse[];
  /** Reutiliza `JobMatch` de jobs: mismo `matchRate` en escala 0-100. */
  compatibleJobs: JobMatch[];
  /** Confianza del modelo, escala 0-100. */
  confidence: number;
};
