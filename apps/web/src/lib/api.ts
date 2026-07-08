import { isTokenExpired } from "./jwt";

export type ApiFieldError = { field: string; message: string };

/**
 * Extrae `message` y `fieldErrors` del cuerpo de error estándar del backend
 * (`{ status, error, message, path, fieldErrors[] }`) de forma defensiva: si el
 * payload no matchea esa forma, ambos quedan `undefined`.
 */
function parseErrorBody(payload: unknown): {
  message?: string;
  fieldErrors?: ApiFieldError[];
} {
  if (typeof payload !== "object" || payload === null) {
    return {};
  }

  const body = payload as Record<string, unknown>;
  const message = typeof body.message === "string" ? body.message : undefined;

  let fieldErrors: ApiFieldError[] | undefined;
  if (Array.isArray(body.fieldErrors)) {
    const parsed = body.fieldErrors
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === "object" && item !== null,
      )
      .map((item) => ({
        field: typeof item.field === "string" ? item.field : "",
        message: typeof item.message === "string" ? item.message : "",
      }))
      .filter((item) => item.field !== "" || item.message !== "");

    fieldErrors = parsed.length > 0 ? parsed : undefined;
  }

  return { message, fieldErrors };
}

export class ApiError extends Error {
  status: number;
  payload: unknown;
  /** `message` del cuerpo de error estándar del backend, si vino. */
  backendMessage?: string;
  /** Errores por campo del cuerpo estándar (validación 400), si vinieron. */
  fieldErrors?: ApiFieldError[];

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;

    const parsed = parseErrorBody(payload);
    this.backendMessage = parsed.message;
    this.fieldErrors = parsed.fieldErrors;
  }
}

export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiConfigurationError";
  }
}

let authTokenGetter: () => string | null = () => null;

/**
 * Registra cómo obtener el access token para las requests autenticadas.
 *
 * La capa de estado (userStore) lo inyecta al inicializarse, de modo que
 * `lib/api` no depende del store: la dependencia va store → api, no al revés.
 * Así `apiRequest` adjunta `Authorization: Bearer` cuando hay sesión.
 */
export function setAuthTokenGetter(getter: () => string | null) {
  authTokenGetter = getter;
}

let authRefreshHandler: (() => Promise<string | null>) | null = null;
let refreshInFlight: Promise<string | null> | null = null;

/**
 * Registra cómo renovar la sesión cuando una request devuelve 401/403.
 *
 * El userStore inyecta un handler que llama a `POST /auth/refresh`, actualiza el
 * par de JWT y devuelve el nuevo access token (o `null` si la renovación falla,
 * tras cerrar la sesión). Igual que el token getter, mantiene la dependencia
 * store → api (no al revés).
 */
export function setAuthRefreshHandler(
  handler: (() => Promise<string | null>) | null,
) {
  authRefreshHandler = handler;
}

/**
 * Renueva la sesión a lo sumo una vez de forma concurrente: varias requests que
 * fallan al mismo tiempo comparten la misma promesa de refresh en vuelo.
 */
function refreshAuthOnce(): Promise<string | null> {
  if (!authRefreshHandler) {
    return Promise.resolve(null);
  }

  if (!refreshInFlight) {
    refreshInFlight = authRefreshHandler().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

/**
 * Fuerza una renovación de sesión (comparte la promesa en vuelo de
 * `refreshAuthOnce`). Lo usa `AuthGuard` para pre-renovar un token expirado
 * antes de renderizar el área privada.
 */
export function refreshAuth(): Promise<string | null> {
  return refreshAuthOnce();
}

/**
 * Devuelve la URL base configurada para la API.
 *
 * Si la variable no existe o conserva el placeholder del .env.example,
 * devuelve null para permitir fallback controlado en desarrollo.
 */
export function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl || apiUrl.includes(":port")) {
    return null;
  }

  try {
    return new URL(apiUrl).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * Timeout por defecto (ms) de cada request.
 *
 * Generoso a propósito: el backend corre en un plan free (Render) que duerme la
 * instancia tras inactividad, y el primer request tras el "cold start" puede
 * tardar decenas de segundos. El timeout evita que el `fetch` quede colgado
 * indefinidamente, pero sin cortar un arranque legítimo. Ajustable por request
 * vía `options.timeoutMs`.
 */
export const DEFAULT_TIMEOUT_MS = 60_000;

type ApiRequestOptions = {
  /** Timeout en ms para esta request puntual (default `DEFAULT_TIMEOUT_MS`). */
  timeoutMs?: number;
  /**
   * Evita el refresh automático de sesión ante 401/403. Lo usan los propios
   * endpoints de auth (`login`/`register`/`refresh`): un fallo ahí no debe
   * disparar el ciclo de renovación (evita loops y renovaciones espurias).
   */
  skipAuthRefresh?: boolean;
};

/**
 * Ejecuta una request HTTP con timeout y manejo de abort.
 *
 * Aborta la request si supera el timeout, traduciendo el corte a un `ApiError`
 * 408 legible (útil mientras el backend "despierta"). Respeta un `init.signal`
 * provisto por el llamador: tanto ese signal como el timeout pueden abortarla.
 * No conoce la lógica de sesión: el refresh lo orquesta `apiRequest`.
 */
async function sendRequest<TResponse>(
  baseUrl: string,
  normalizedPath: string,
  init?: RequestInit,
  options?: ApiRequestOptions,
): Promise<TResponse> {
  const token = authTokenGetter();

  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options?.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  // Encadena el signal del llamador (p. ej. cancelación de TanStack Query) con
  // el nuestro: cualquiera de los dos aborta la misma request.
  const callerSignal = init?.signal;
  if (callerSignal) {
    if (callerSignal.aborted) {
      controller.abort();
    } else {
      callerSignal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  try {
    const response = await fetch(`${baseUrl}${normalizedPath}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    const hasJsonBody = contentType?.includes("application/json");
    const payload = hasJsonBody ? await response.json() : null;

    if (!response.ok) {
      throw new ApiError(
        `Error HTTP ${response.status} al consumir ${normalizedPath}.`,
        response.status,
        payload,
      );
    }

    return payload as TResponse;
  } catch (error) {
    // Solo el corte por timeout se traduce a 408; un abort del llamador se
    // propaga tal cual para que Query lo trate como cancelación, no como error.
    if (error instanceof DOMException && error.name === "AbortError") {
      if (timedOut) {
        throw new ApiError(
          `La petición a ${normalizedPath} superó el tiempo de espera. El servidor puede estar iniciándose; volvé a intentar en unos segundos.`,
          408,
          null,
        );
      }
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Cliente HTTP del backend.
 *
 * Adjunta el Bearer token y, ante un 401 (o un 403 con token expirado), intenta
 * **una** renovación de sesión y reintenta la request con el token nuevo. Un 403
 * con token vigente se propaga tal cual (es autorización, no sesión): no se
 * renueva para no rotar el refresh en denegaciones legítimas. Si la renovación
 * falla, la sesión se cierra (handler del userStore) y el error original sube.
 */
export async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
  options?: ApiRequestOptions,
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new ApiConfigurationError(
      "NEXT_PUBLIC_API_URL no está configurada con una URL válida.",
    );
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  try {
    return await sendRequest<TResponse>(baseUrl, normalizedPath, init, options);
  } catch (error) {
    const canRefresh =
      !options?.skipAuthRefresh &&
      authRefreshHandler !== null &&
      error instanceof ApiError &&
      (error.status === 401 ||
        (error.status === 403 && isTokenExpired(authTokenGetter())));

    if (!canRefresh) {
      throw error;
    }

    const newToken = await refreshAuthOnce();
    if (!newToken) {
      throw error;
    }

    // Reintento único con el token renovado (evita bucles de refresh).
    return sendRequest<TResponse>(baseUrl, normalizedPath, init, {
      ...options,
      skipAuthRefresh: true,
    });
  }
}