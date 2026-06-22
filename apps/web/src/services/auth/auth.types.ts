/**
 * Contratos de autenticación.
 *
 * El orden de flujo (design system): Registro → Onboarding. La cuenta (`User`)
 * se crea con `POST /auth/register` y luego se hace `POST /auth/login` para
 * obtener el JWT, antes de completar el `Profile` en el onboarding.
 */

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

/**
 * Respuesta normalizada de autenticación que consume el front.
 *
 * TODO(backend): el contrato real de `POST /auth/login` aún no está cerrado.
 * Cuando lo esté, alinear estos campos:
 *   - `refreshToken` para `POST /auth/refresh` (renovación de sesión).
 *   - `user.rol` (`MENTEE` por defecto; alta de `MENTOR` es flujo aparte).
 *   - `profileCompleted` para decidir el redirect post-login
 *     (incompleto → /onboarding, completo → /dashboard) sin depender del
 *     estado local `isOnboardingCompleted` del userStore.
 */
export type AuthResponse = {
  token: string;
  profileCompleted: boolean;
  /** Origen del dato: respuesta real de la API o mock local de desarrollo. */
  source: "api" | "mock";
};
