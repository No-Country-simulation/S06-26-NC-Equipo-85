"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Spinner } from "@app/ui";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/store/user-store";
import { useStoreHydrated } from "../hooks/use-store-hydrated";

type AuthGuardProps = {
  children: ReactNode;
};

/**
 * Protege rutas privadas (dashboard, onboarding).
 *
 * Espera a que el store se rehidrate y, si no hay sesión, redirige a `/login`.
 * Mientras se resuelve (sin hidratar o sin token) no renderiza el contenido
 * privado, evitando un flash de la vista antes del redirect.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const hydrated = useStoreHydrated();
  const token = useUserStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
