import { useMutation } from "@tanstack/react-query";
import { createOrientation } from "@/services/orientation/orientation.service";
import type {
  OrientationRequest,
  OrientationResult,
} from "@/services/orientation/orientation.types";

/**
 * Mutation de orientación inicial.
 *
 * Centraliza la llamada a `/orientar` para que el wizard no conozca detalles HTTP.
 */
export function useOrientar() {
  return useMutation<OrientationResult, Error, OrientationRequest>({
    mutationKey: ["orientation"],
    mutationFn: createOrientation,
  });
}