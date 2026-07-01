import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type {
  AuthResponse,
  AuthTokenResponse,
  LoginRequest,
  RegisterRequest,
} from "./auth.types";

const MOCK_DELAY_MS = 500;

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Genera un token simulado para mantener el flujo de auth usable en desarrollo
 * cuando no hay `NEXT_PUBLIC_API_URL` configurada.
 * Mismo criterio que el mock de `/orientar` (ver orientation.service).
 */
async function createMockAuth(): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);

  return {
    token: `mock-jwt-${crypto.randomUUID()}`,
    refreshToken: null,
    source: "mock",
  };
}

/**
 * Registra la cuenta y deja la sesión iniciada.
 *
 * `POST /api/v1/auth/register` ya devuelve el par de JWT (access + refresh),
 * así que no hace falta un segundo login. Un usuario recién registrado nunca
 * tiene el `Profile` completo, por eso `profileCompleted: false` (el front lo
 * lleva a `/onboarding`).
 */
export async function registerUser(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  if (!getApiBaseUrl()) {
    return createMockAuth();
  }

  const result = await apiRequest<AuthTokenResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      // El alta pública crea siempre un `MENTEE`; `MENTOR` es un flujo aparte.
      role: payload.role ?? "MENTEE",
    }),
  });

  return {
    token: result.accessToken,
    refreshToken: result.refreshToken,
    source: "api",
  };
}

/**
 * Autentica un usuario existente.
 *
 * `POST /api/v1/auth/login` devuelve el mismo par de JWT que el registro.
 *
 * TODO(backend): el rate-limit (Bucket4j) llega como HTTP 429 → se propaga vía
 * `ApiError.status` para mostrar "demasiados intentos" en el form.
 */
export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  if (!getApiBaseUrl()) {
    return createMockAuth();
  }

  const result = await apiRequest<AuthTokenResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    token: result.accessToken,
    refreshToken: result.refreshToken,
    source: "api",
  };
}

/**
 * Renueva el access token a partir de un refresh token vigente.
 *
 * `POST /api/v1/auth/refresh` devuelve un par de JWT nuevo (rota también el
 * refresh). Si el refresh está vencido o revocado el back responde 401 → el
 * llamador debe cerrar sesión (`reset` del userStore).
 */
export async function refreshSession(
  refreshToken: string,
): Promise<AuthResponse> {
  if (!getApiBaseUrl()) {
    return createMockAuth();
  }

  const result = await apiRequest<AuthTokenResponse>("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  return {
    token: result.accessToken,
    refreshToken: result.refreshToken,
    source: "api",
  };
}
