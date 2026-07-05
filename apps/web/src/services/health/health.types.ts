/**
 * Contratos de salud mental (check-ins) — `/api/v1/health/checkins` 🔒.
 *
 * Fuente de verdad: OpenAPI (`App BiT API v1`). Todos los endpoints infieren el
 * usuario del Bearer token, así que —a diferencia de `jobs`/`orientation`— no
 * viaja `userId` en el contrato.
 *
 * Nota de nombres: el POST responde con claves en español (`mensaje`,
 * `accion_sugerida`, `derivar_cvv`, `nota_actual`) mientras que el GET del
 * historial/detalle usa inglés (`suggested_action`, `derive_cvv`, `created_at`).
 * Se respetan tal cual los devuelve el backend en vez de renombrarlos.
 */

/** Estado emocional del check-in (enum `MoodEmoji` del backend). */
export type MoodEmoji = "HAPPY" | "DEPRESSED" | "FURIOUS" | "ANXIOUS" | "NEUTRAL";

/** Cuerpo de `POST /api/v1/health/checkins`. */
export type CheckinRequest = {
  emoji: MoodEmoji;
  /** Nivel 1–5 (requerido por el contrato). */
  rating: number;
  /** Texto libre opcional. */
  context?: string;
};

/**
 * Respuesta de `POST /api/v1/health/checkins`.
 *
 * `derivar_cvv: true` indica riesgo: el front debe mostrar el contacto de la
 * línea de ayuda (CVV).
 */
export type CheckinResponse = {
  checkinId: string;
  /** Mensaje empático generado por la IA. */
  mensaje: string;
  accion_sugerida: string;
  derivar_cvv: boolean;
  /** Puntaje registrado (1–5). */
  nota_actual: number;
  alerta: boolean;
};

/**
 * Elemento del historial (`GET /api/v1/health/checkins`) y del detalle
 * (`GET /api/v1/health/checkins/{id}`, mismo objeto `CheckinDetailResponse`).
 */
export type CheckinDetail = {
  id: string;
  emoji: MoodEmoji;
  rating: number;
  context: string | null;
  suggested_action: string | null;
  derive_cvv: boolean;
  /** ISO 8601. */
  created_at: string;
};

/** Respuesta de `POST /api/v1/health/checkins/{id}/empathic-response`. */
export type EmpathicResponse = {
  response: string;
};
