import type { OrientationResponse } from "./orientation.types";

/**
 * Orientación inicial del usuario.
 *
 * MOCK TEMPORAL: el endpoint `/api/orientar` era de prueba y se eliminó. El
 * endpoint definitivo será distinto y aún no existe, así que devolvemos datos
 * simulados para mantener viva la sección de éxito del onboarding y el dashboard.
 * Cuando el backend publique el endpoint real, reemplazar el cuerpo por la
 * llamada HTTP correspondiente (vía `apiRequest`) sin tocar los consumidores.
 */

/** Latencia simulada para que la UI ejercite sus estados de carga. */
const MOCK_DELAY_MS = 500;

const MOCK_ORIENTATION: OrientationResponse = {
  gapPercentage: 35,
  confidence: 82,
  gapItems: [
    { id: "gap-1", name: "TypeScript", level: "Intermedio" },
    { id: "gap-2", name: "Testing", level: "Básico" },
    { id: "gap-3", name: "Git", level: "Intermedio" },
  ],
  suggestedPath: [
    {
      courseId: "course-1",
      title: "TypeScript desde cero",
      provider: "Platzi",
      contributedSkills: ["TypeScript", "JavaScript"],
    },
    {
      courseId: "course-2",
      title: "Testing con Jest",
      provider: "Coursera",
      contributedSkills: ["Testing"],
    },
  ],
  compatibleJobs: [
    {
      jobId: "job-1",
      company: "Tech Solutions",
      title: "Frontend Developer Jr.",
      matchRate: 78,
    },
    {
      jobId: "job-2",
      company: "Innovatech",
      title: "React Developer",
      matchRate: 65,
    },
  ],
};

/**
 * Devuelve la orientación inicial (mock temporal, sin red).
 *
 * No requiere `userId` ni perfil: el bloqueante del `userId` del JWT desaparece
 * porque no hay llamada real. La firma se mantiene sin argumentos para que el
 * futuro endpoint pueda inferir el usuario del Bearer token.
 */
export async function requestOrientation(): Promise<OrientationResponse> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  return MOCK_ORIENTATION;
}
