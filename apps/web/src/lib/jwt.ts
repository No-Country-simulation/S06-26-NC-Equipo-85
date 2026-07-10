/**
 * Utilidades mínimas de lectura de JWT en el cliente.
 *
 * Decodifican el payload sin verificar la firma (no hace falta: el back ya
 * validó el token en cada request autenticada) y nunca lanzan, para que los
 * hooks los traten como una precondición en vez de un error no controlado.
 */

/**
 * Decodifica un segmento base64url de un JWT a texto plano.
 *
 * `atob` espera base64 estándar (`+`/`/` y padding `=`), mientras que los JWT
 * usan base64url (`-`/`_`, sin padding); por eso se normaliza antes de decodificar.
 */
function decodeBase64Url(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return atob(padded);
}

/**
 * Indica si el access token está vencido según su claim `exp` (segundos epoch).
 *
 * `skewSeconds` da un margen para renovar antes del vencimiento exacto y evitar
 * carreras. Ante la duda (sin `exp` o no decodificable) NO declara expiración
 * —salvo token nulo— para no cerrar sesiones válidas: el manejo real del rechazo
 * queda en el interceptor de `apiRequest` (401/403 del backend).
 */
export function isTokenExpired(token: string | null, skewSeconds = 30): boolean {
  if (!token) {
    return true;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    const payload: unknown = JSON.parse(decodeBase64Url(parts[1]));

    if (
      typeof payload === "object" &&
      payload !== null &&
      "exp" in payload &&
      typeof (payload as { exp: unknown }).exp === "number"
    ) {
      const expiresAtMs = (payload as { exp: number }).exp * 1000;
      return expiresAtMs <= Date.now() + skewSeconds * 1000;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Extrae el claim `role` del access token JWT (`MENTEE` | `MENTOR`).
 *
 * Es la única fuente del rol en el cliente: el back lo incluye en el token
 * (claims = `role, sub, iat, exp`). Se usa para habilitar la UI exclusiva de
 * MENTOR (crear/editar/borrar experiencias). Devuelve `null` ante cualquier
 * fallo, para tratar la ausencia de rol como "no autorizado" sin lanzar.
 */
export function getRoleFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload: unknown = JSON.parse(decodeBase64Url(parts[1]));

    if (
      typeof payload === "object" &&
      payload !== null &&
      "role" in payload &&
      typeof (payload as { role: unknown }).role === "string"
    ) {
      return (payload as { role: string }).role;
    }

    return null;
  } catch {
    return null;
  }
}
