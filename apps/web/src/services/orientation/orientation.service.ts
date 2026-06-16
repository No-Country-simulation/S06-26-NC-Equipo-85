import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type {
  CompatibleJob,
  OrientationRequest,
  OrientationResult,
} from "./orientation.types";

const MOCK_DELAY_MS = 500;

const JOBS_BY_AREA: Record<string, CompatibleJob[]> = {
  frontend: [
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
  backend: [
    {
      id: "backend-trainee",
      title: "Backend Trainee",
      company: "BiT Partner",
      matchScore: 68,
      missingRequirements: ["Bases de datos", "APIs REST"],
    },
  ],
  fullstack: [
    {
      id: "fullstack-trainee",
      title: "Full Stack Trainee",
      company: "Impact Tech",
      matchScore: 73,
      missingRequirements: ["Arquitectura frontend", "APIs REST"],
    },
  ],
  qa: [
    {
      id: "qa-trainee",
      title: "QA Manual Trainee",
      company: "BiT Partner",
      matchScore: 79,
      missingRequirements: ["Casos de prueba", "Reporte de bugs"],
    },
  ],
  data: [
    {
      id: "data-trainee",
      title: "Data Analyst Trainee",
      company: "Impact Tech",
      matchScore: 66,
      missingRequirements: ["SQL", "Visualización de datos"],
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
    "sin-experiencia": 78,
    inicial: 58,
    intermedio: 34,
    avanzado: 18,
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