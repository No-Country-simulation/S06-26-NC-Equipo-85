import { ApiError, apiRequest } from "@/lib/api";
import type {
  CheckinDetail,
  CheckinRequest,
  CheckinResponse,
  EmpathicResponse,
  TextAnalysisRequest,
  TextAnalysisResult,
} from "./health.types";

const CHECKINS_PATH = "/api/v1/health/checkins";

/**
 * Registra un check-in emocional (`POST /api/v1/health/checkins`).
 *
 * La IA (Gemini) evalúa el estado y devuelve un mensaje empático + acción
 * sugerida; `derivar_cvv` señala riesgo. El usuario se infiere del Bearer token
 * (no viaja `userId`), por eso —a diferencia de jobs/orientación— consume el
 * backend real sin precondición de sesión decodificada del JWT.
 */
export async function submitCheckin(
  payload: CheckinRequest,
): Promise<CheckinResponse> {
  return apiRequest<CheckinResponse>(CHECKINS_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Historial de check-ins del usuario autenticado
 * (`GET /api/v1/health/checkins`).
 *
 * Una lista vacía es un estado válido (empty state en la UI): consume siempre
 * el backend real, sin mock de respaldo.
 */
export async function getCheckins(): Promise<CheckinDetail[]> {
  const checkins = await apiRequest<CheckinDetail[]>(CHECKINS_PATH);
  return checkins ?? [];
}

/**
 * Detalle de un check-in (`GET /api/v1/health/checkins/{id}`).
 *
 * Devuelve `null` ante un 404 (check-in inexistente), igual criterio que
 * `jobs.service.getJobById`, para que la UI lo trate como estado y no excepción.
 */
export async function getCheckinById(id: string): Promise<CheckinDetail | null> {
  try {
    return await apiRequest<CheckinDetail>(`${CHECKINS_PATH}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

/**
 * Genera una respuesta empática de la IA para un check-in ya guardado
 * (`POST /api/v1/health/checkins/{id}/empathic-response`, sin body).
 */
export async function getEmpathicResponse(
  id: string,
): Promise<EmpathicResponse> {
  return apiRequest<EmpathicResponse>(
    `${CHECKINS_PATH}/${id}/empathic-response`,
    { method: "POST" },
  );
}

/** Latencia simulada para que la UI ejercite su estado de carga. */
const TEXT_ANALYSIS_DELAY_MS = 500;

/**
 * Analiza por IA un texto libre de estado emocional.
 *
 * MOCK TEMPORAL: el endpoint `/api/salud` era de prueba y se eliminó. El
 * definitivo será distinto y aún no existe, así que devolvemos un resultado
 * simulado (haciendo eco del texto) para mantener viva la sección. Flujo
 * complementario al check-in estructurado, sin persistir historial. Cuando el
 * backend publique el endpoint real, reemplazar el cuerpo por la llamada HTTP.
 */
export async function analyzeText(
  payload: TextAnalysisRequest,
): Promise<TextAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, TEXT_ANALYSIS_DELAY_MS));

  return {
    status: "Recibido",
    message:
      "Gracias por compartir cómo te sentís. Tomarte un momento para " +
      "expresarlo ya es un paso valioso; recordá que no estás solo/a en esto.",
    description: payload.description,
  };
}
