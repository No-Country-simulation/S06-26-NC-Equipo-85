export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
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
};

/**
 * Cliente HTTP mínimo para consumir endpoints del backend.
 *
 * Aborta la request si supera el timeout, traduciendo el corte a un `ApiError`
 * 408 legible (útil mientras el backend "despierta"). Respeta un `init.signal`
 * provisto por el llamador: tanto ese signal como el timeout pueden abortarla.
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