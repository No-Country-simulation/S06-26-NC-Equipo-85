import { apiRequest } from "@/lib/api";
import type {
  AuthResponse,
  AuthTokenResponse,
  LoginRequest,
  RegisterRequest,
} from "./auth.types";

/**
 * Registra la cuenta y deja la sesión iniciada.
 *
 * `POST /api/v1/auth/register` ya devuelve el par de JWT (access + refresh), así
 * que no hace falta un segundo login. Un usuario recién registrado nunca tiene
 * el `Profile` completo, por eso el form lo lleva siempre a `/onboarding`.
 * Consume solo el backend real (sin mock).
 */
export async function registerUser(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const result = await apiRequest<AuthTokenResponse>(
    "/api/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        // El alta pública crea siempre un `MENTEE`; `MENTOR` es un flujo aparte.
        role: payload.role ?? "MENTEE",
      }),
    },
    // El propio endpoint de auth no debe disparar el ciclo de refresh.
    { skipAuthRefresh: true },
  );

  return {
    token: result.accessToken,
    refreshToken: result.refreshToken,
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
  const result = await apiRequest<AuthTokenResponse>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { skipAuthRefresh: true },
  );

  return {
    token: result.accessToken,
    refreshToken: result.refreshToken,
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
  const result = await apiRequest<AuthTokenResponse>(
    "/api/v1/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    },
    // Evita recursión: un 401 del refresh no debe volver a intentar refrescar.
    { skipAuthRefresh: true },
  );

  return {
    token: result.accessToken,
    refreshToken: result.refreshToken,
  };
}
