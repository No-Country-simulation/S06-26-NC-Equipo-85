import { useMutation } from "@tanstack/react-query";
import { refreshSession } from "@/services/auth/auth.service";
import type { AuthResponse } from "@/services/auth/auth.types";

/**
 * Mutation de renovación de sesión.
 *
 * Centraliza `POST /api/v1/auth/refresh`. Recibe el refresh token vigente y
 * devuelve el par de JWT nuevo; el consumidor persiste el resultado con
 * `setSession` del userStore (o hace `reset` si la mutación falla con 401).
 */
export function useRefresh() {
  return useMutation<AuthResponse, Error, string>({
    mutationKey: ["auth", "refresh"],
    mutationFn: refreshSession,
  });
}
