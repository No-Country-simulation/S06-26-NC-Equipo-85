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
 * Cliente HTTP mínimo para consumir endpoints del backend.
 */
export async function apiRequest<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new ApiConfigurationError(
      "NEXT_PUBLIC_API_URL no está configurada con una URL válida.",
    );
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
}