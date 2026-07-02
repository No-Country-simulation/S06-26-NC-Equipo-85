import { useMutation } from "@tanstack/react-query";
import { requestOrientation } from "@/services/orientation/orientation.service";
import type {
  OrientationRequest,
  OrientationResponse,
} from "@/services/orientation/orientation.types";

/**
 * Mutation de orientación inicial (`POST /api/orientar`).
 *
 * Centraliza la llamada para que el wizard no conozca detalles HTTP. Se
 * dispara desde `OnboardingWizard` inmediatamente después de que
 * `useUpdateProfile` persiste el perfil (`{ userId }`, derivado del JWT), no
 * antes: el backend resuelve la orientación desde el perfil ya guardado.
 */
export function useOrientar() {
  return useMutation<OrientationResponse, Error, OrientationRequest>({
    mutationKey: ["orientation"],
    mutationFn: requestOrientation,
  });
}
