import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/store/user-store";

/**
 * Cierra la sesión del lado del cliente.
 *
 * El auth es JWT stateless: el backend no expone un endpoint de logout, así que
 * alcanza con limpiar la sesión local. Borra el store + el storage persistido
 * (`reset`), descarta el caché de TanStack Query (perfil, etc. del usuario
 * saliente) y deriva a la landing.
 *
 * Nota: el refresh token vive hasta su expiración server-side (no hay
 * revocación). Si más adelante el back agrega `POST /auth/logout`, pegarle acá
 * antes del `reset`.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = useUserStore((state) => state.reset);

  return useCallback(() => {
    reset();
    queryClient.clear();
    router.replace("/");
  }, [reset, queryClient, router]);
}
