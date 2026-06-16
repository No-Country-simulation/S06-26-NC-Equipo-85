import { QueryClient } from "@tanstack/react-query";

/**
 * Crea una instancia de TanStack Query con defaults conservadores.
 *
 * El objetivo es evitar refetch agresivo en una app de onboarding/dashboard,
 * manteniendo retry limitado para no ocultar errores reales del backend.
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}