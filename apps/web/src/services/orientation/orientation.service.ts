import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type {
  CompatibleJob,
  OrientationRequest,
  OrientationResult,
} from "./orientation.types";

const MOCK_DELAY_MS = 500;

const JOBS_BY_AREA: Record<string, CompatibleJob[]> = {
  FRONTEND: [
    {
      id: "frontend-trainee",
      title: "Frontend Trainee",
      company: "BiT Partner",
      matchScore: 76,
      missingRequirements: ["React avanzado", "Testing básico"],
    },
    {
      id: "web-ui-junior",
      title: "Web UI Junior",
      company: "Impact Tech",
      matchScore: 71,
      missingRequirements: ["Accesibilidad", "Consumo de APIs"],
    },
  ],
  BACKEND: [
    {
      id: "backend-trainee",
      title: "Backend Trainee",
      company: "BiT Partner",
      matchScore: 68,
      missingRequirements: ["Bases de datos", "APIs REST"],
    },
  ],
  MOBILE: [
    {
      id: "mobile-trainee",
      title: "Mobile Trainee",
      company: "Impact Tech",
      matchScore: 73,
      missingRequirements: ["React Native", "Publicación en stores"],
    },
  ],
  DATA_SCIENCE: [
    {
      id: "data-trainee",
      title: "Data Analyst Trainee",
      company: "Impact Tech",
      matchScore: 66,
      missingRequirements: ["SQL", "Visualización de datos"],
    },
  ],
  DESIGN_UX_UI: [
    {
      id: "ux-trainee",
      title: "UX/UI Junior",
      company: "BiT Partner",
      matchScore: 74,
      missingRequirements: ["Design system", "Investigación de usuarios"],
    },
  ],
  SOFT_SKILLS: [
    {
      id: "soft-skills-path",
      title: "Programa de empleabilidad",
      company: "BiT Partner",
      matchScore: 70,
      missingRequirements: ["Comunicación efectiva", "Trabajo en equipo"],
    },
  ],
};

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Calcula un gap simulado según nivel técnico.
 * Este fallback existe solo para desarrollo mientras el backend real no esté disponible.
 */
function getMockGapPercentage(techLevel: string) {
  const gapByLevel: Record<string, number> = {
    BEGINNER: 78,
    INTERMEDIATE: 34,
    ADVANCED: 18,
  };

  return gapByLevel[techLevel] ?? 62;
}

/**
 * Devuelve vacantes simuladas por área.
 */
function getMockCompatibleJobs(techArea: string) {
  return (
    JOBS_BY_AREA[techArea] ?? [
      {
        id: "tech-orientation",
        title: "Ruta inicial en tecnología",
        company: "BiT Partner",
        matchScore: 64,
        missingRequirements: ["Definir especialidad", "Armar portfolio"],
      },
    ]
  );
}

/**
 * Crea una respuesta mock para mantener el flujo de Fase 2 usable
 * antes de que el endpoint real `/orientar` esté disponible.
 */
async function createMockOrientation(
  payload: OrientationRequest,
): Promise<OrientationResult> {
  await wait(MOCK_DELAY_MS);

  const { techArea, techLevel, objective } = payload.professional;

  return {
    gapPercentage: getMockGapPercentage(techLevel),
    suggestedPath: [
      "Completar fundamentos técnicos del área elegida.",
      `Enfocar el plan en el objetivo: ${objective}.`,
      "Construir un proyecto guiado para validar habilidades.",
      "Preparar perfil laboral y aplicar a oportunidades compatibles.",
    ],
    compatibleJobs: getMockCompatibleJobs(techArea),
    generatedAt: new Date().toISOString(),
    source: "mock",
  };
}

/**
 * Solicita orientación al backend.
 *
 * Si `NEXT_PUBLIC_API_URL` no está configurada, usa un mock local controlado
 * para que el onboarding siga siendo testeable en desarrollo.
 */
export async function createOrientation(
  payload: OrientationRequest,
): Promise<OrientationResult> {
  if (!getApiBaseUrl()) {
    return createMockOrientation(payload);
  }

  const result = await apiRequest<OrientationResult>("/orientar", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    ...result,
    source: "api",
  };
}