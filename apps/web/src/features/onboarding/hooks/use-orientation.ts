import { useMutation, useQuery } from "@tanstack/react-query";
import { requestOrientation } from "@/services/orientation/orientation.service";
import type { OrientationResponse } from "@/services/orientation/orientation.types";

/**
 * Mutation de orientación inicial (`POST /api/v1/guidance`).
 *
 * Centraliza la llamada para que el wizard no conozca la fuente de datos. El
 * usuario se infiere del Bearer token en el backend (sin `userId` en el
 * contrato), así que no hay precondición de sesión decodificada del JWT. Se
 * dispara desde `OnboardingWizard` tras persistir el perfil (`useUpdateProfile`),
 * disparada por un evento real (submit del form) — no por un efecto de montaje.
 */
export function useOrientation() {
  return useMutation<OrientationResponse, Error, void>({
    mutationKey: ["orientation"],
    mutationFn: requestOrientation,
  });
}

/**
 * Variante en query de la orientación, para pedirla automáticamente al montar
 * un componente (`DashboardHome`) en vez de disparada por un evento.
 *
 * No usar `useOrientation` (mutation) para esto: llamar `.mutate()` desde un
 * `useEffect` de montaje choca con el double-invoke de Strict Mode en dev —
 * el ciclo de montar→desmontar→remontar desengancha el observer de la mutación
 * en vuelo antes de que resuelva, así que el resultado nunca vuelve (bug
 * reproducido y confirmado: la promesa de `requestOrientation` resolvía bien,
 * pero `onSuccess`/`onError` nunca se disparaban). Una `useQuery` no tiene ese
 * problema: la query queda cacheada por `queryKey` y el observer que se vuelve
 * a suscribir en el remount la retoma con normalidad.
 */
export function useEnsureOrientation(enabled: boolean) {
  return useQuery<OrientationResponse, Error>({
    queryKey: ["orientation"],
    queryFn: requestOrientation,
    enabled,
    retry: false,
    staleTime: Infinity,
  });
}
