import { useMutation } from "@tanstack/react-query";
import { requestOrientation } from "@/services/orientation/orientation.service";
import type { OrientationResponse } from "@/services/orientation/orientation.types";

/**
 * Mutation de orientación inicial (`POST /api/v1/guidance`).
 *
 * Centraliza la llamada para que el wizard no conozca la fuente de datos. El
 * usuario se infiere del Bearer token en el backend (sin `userId` en el
 * contrato), así que no hay precondición de sesión decodificada del JWT. Se
 * dispara desde `OnboardingWizard` tras persistir el perfil (`useUpdateProfile`).
 */
export function useOrientation() {
  return useMutation<OrientationResponse, Error, void>({
    mutationKey: ["orientation"],
    mutationFn: requestOrientation,
  });
}
