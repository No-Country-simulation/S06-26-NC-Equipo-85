/**
 * Contratos de autenticación.
 *
 * El orden de flujo (design system): Registro → Onboarding. La cuenta (`User`)
 * se crea con `POST /api/v1/auth/register`, que ya devuelve el JWT directo
 * (no hace falta un segundo login), antes de completar el `Profile` en el
 * onboarding.
 */

/** Rol del usuario en el alta. El registro público crea `MENTEE` por defecto. */
export type Role = "MENTEE" | "MENTOR";

export type RegisterRequest = {
  email: string;
  password: string;
  /** Default `MENTEE` en el service; `MENTOR` es un flujo de alta aparte. */
  role?: Role;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Respuesta cruda de los endpoints de auth del backend (par de JWT).
 * Forma del swagger: `POST /api/v1/auth/register` y `/login`.
 */
export type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

/**
 * Respuesta normalizada de autenticación que consume el front.
 *
 * El contrato real de auth (`register`/`login`) solo devuelve el par de JWT, no
 * trae `profileCompleted`. Por eso el redirect post-login se decide en el form
 * con el flag local `isOnboardingCompleted` del userStore.
 *
 * TODO(backend): cuando exista `GET /profile` (o el JWT lleve el claim),
 * derivar el redirect de la API en vez del estado local.
 */
export type AuthResponse = {
  token: string;
  /** Token de refresco para `POST /auth/refresh`; `null` en el mock local. */
  refreshToken: string | null;
  /** Origen del dato: respuesta real de la API o mock local de desarrollo. */
  source: "api" | "mock";
};
