import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth/auth.service";
import type { AuthResponse, RegisterRequest } from "@/services/auth/auth.types";

/**
 * Mutation de registro (incluye auto-login).
 *
 * Centraliza `POST /auth/register` para que el formulario no conozca detalles HTTP.
 */
export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationKey: ["auth", "register"],
    mutationFn: registerUser,
  });
}
