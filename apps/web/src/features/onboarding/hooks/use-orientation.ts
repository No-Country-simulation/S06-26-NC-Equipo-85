import { useMutation } from "@tanstack/react-query";
import { requestOrientation } from "@/services/orientation/orientation.service";
import type { OrientationResponse } from "@/services/orientation/orientation.types";

/**
 * Mutation de orientación inicial.
 *
 * Centraliza la llamada para que el wizard no conozca la fuente de datos. Hoy
 * el service devuelve mock temporal (el endpoint definitivo aún no existe); se
 * dispara desde `OnboardingWizard` después de persistir el perfil
 * (`useUpdateProfile`). Sin variables: el mock no necesita `userId`.
 */
export function useOrientation() {
  return useMutation<OrientationResponse, Error, void>({
    mutationKey: ["orientation"],
    mutationFn: requestOrientation,
  });
}
