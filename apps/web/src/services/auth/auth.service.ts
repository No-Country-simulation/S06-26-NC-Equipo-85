import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type {
  AuthResponse,
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
 * Genera un token simulado para mantener el flujo Registro → Onboarding usable
 * en desarrollo mientras los endpoints reales de auth no estén disponibles.
 * Mismo criterio que el mock de `/orientar` (ver orientation.service).
 */
async function createMockAuth(profileCompleted: boolean): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);

  return {
    token: `mock-jwt-${crypto.randomUUID()}`,
    profileCompleted,
    source: "mock",
  };
}

/**
 * Registra la cuenta y deja la sesión iniciada (auto-login).
 *
 * Flujo real (design system): `POST /auth/register` → `POST /auth/login`.
 * Un usuario recién registrado nunca tiene el `Profile` completo, por eso
 * `profileCompleted: false` (el front lo lleva a `/onboarding`).
 */
export async function registerUser(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  if (!getApiBaseUrl()) {
    return createMockAuth(false);
  }

  // TODO(backend): el back crea el `User` (rol `MENTEE` por defecto). Si pasa a
  // devolver el token directo en el registro, eliminar el segundo request.
  await apiRequest<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return loginUser(payload);
}

/**
 * Autentica un usuario existente.
 *
 * TODO(backend): mapear la respuesta real de `POST /auth/login` a `AuthResponse`
 * (token + refreshToken + profileCompleted). El rate-limit (Bucket4j) llega como
 * HTTP 429 → se propaga vía `ApiError.status` para mostrar "demasiados intentos".
 */
export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  if (!getApiBaseUrl()) {
    return createMockAuth(true);
  }

  const result = await apiRequest<Omit<AuthResponse, "source">>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    ...result,
    source: "api",
  };
}
