import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/auth/auth.service";
import type { AuthResponse, LoginRequest } from "@/services/auth/auth.types";

/**
 * Mutation de login.
 *
 * Centraliza `POST /auth/login` para que el formulario no conozca detalles HTTP.
 */
export function useLogin() {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: loginUser,
  });
}
