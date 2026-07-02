/**
 * Utilidades mínimas de lectura de JWT en el cliente.
 *
 * El backend no expone `userId` ni en `AuthTokenResponse` ni en `ProfileResponse`
 * (ver services/auth/auth.types.ts y services/profile/profile.types.ts): la
 * única fuente es el claim `sub` del access token. Este helper decodifica el
 * payload sin verificar la firma (no hace falta: el back ya validó el token en
 * cada request autenticada) y nunca lanza, para que los hooks lo traten como
 * una precondición (`enabled: !!userId`) en vez de un error no controlado.
 *
 * TODO(backend): si se agrega `userId` a `TokenResponseDto`/`ProfileResponse`,
 * este helper deja de ser necesario y los hooks pueden leerlo directo del store.
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
 * Extrae el claim `sub` (identificador del usuario) del access token JWT.
 *
 * Devuelve `null` ante cualquier fallo: token nulo, formato inválido, payload
 * no decodificable o sin claim `sub`. Nunca lanza, así el llamador puede tratar
 * la ausencia de `userId` como un estado de UI (no una excepción no controlada).
 */
export function getUserIdFromToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payloadJson = decodeBase64Url(parts[1]);
    const payload: unknown = JSON.parse(payloadJson);

    if (
      typeof payload === "object" &&
      payload !== null &&
      "sub" in payload &&
      typeof (payload as { sub: unknown }).sub === "string"
    ) {
      return (payload as { sub: string }).sub;
    }

    return null;
  } catch {
    return null;
  }
}
