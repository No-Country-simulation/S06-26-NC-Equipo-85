"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";

type ProvidersProps = {
  children: ReactNode;
};

/**
 * Providers cliente de la aplicación.
 *
 * Mantiene TanStack Query fuera del layout server y evita recrear el
 * QueryClient en cada render.
 */
export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}