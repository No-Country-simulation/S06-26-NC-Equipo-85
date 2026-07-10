import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCheckinById,
  getCheckins,
  getEmpathicResponse,
  submitCheckin,
} from "@/services/health/health.service";

/** Clave del historial; se invalida tras registrar un check-in. */
export const HEALTH_CHECKINS_KEY = ["health", "checkins"] as const;

/**
 * Historial de check-ins del usuario autenticado
 * (`GET /api/v1/health/checkins`).
 *
 * El usuario se infiere del Bearer token en `apiRequest`, así que no hay
 * precondición de `userId` (a diferencia de `use-jobs`): la query se dispara
 * siempre y una lista vacía es un empty state legítimo.
 */
export function useCheckins() {
  return useQuery({
    queryKey: HEALTH_CHECKINS_KEY,
    queryFn: getCheckins,
  });
}

/** Detalle de un check-in (`GET /api/v1/health/checkins/{id}`). */
export function useCheckin(id: string | null) {
  return useQuery({
    queryKey: ["health", "checkin", id],
    queryFn: () => getCheckinById(id as string),
    enabled: !!id,
  });
}

/**
 * Registra un check-in (`POST /api/v1/health/checkins`) e invalida el historial
 * para que la card y el dashboard reflejen el nuevo estado.
 */
export function useSubmitCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitCheckin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HEALTH_CHECKINS_KEY });
    },
  });
}

/**
 * Solicita la respuesta empática de la IA para un check-in ya guardado
 * (`POST /api/v1/health/checkins/{id}/empathic-response`).
 */
export function useEmpathicResponse() {
  return useMutation({
    mutationFn: (id: string) => getEmpathicResponse(id),
  });
}
