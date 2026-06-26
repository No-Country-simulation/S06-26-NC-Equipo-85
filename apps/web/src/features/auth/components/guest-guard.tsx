"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Spinner } from "@app/ui";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/store/user-store";
import { useStoreHydrated } from "../hooks/use-store-hydrated";

type GuestGuardProps = {
  children: ReactNode;
};

/**
 * Protege rutas de invitado (login, register).
 *
 * Complemento de `AuthGuard`: si ya hay sesión, redirige al dashboard para que
 * un usuario logueado no vuelva a ver los formularios de auth.
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const hydrated = useStoreHydrated();
  const token = useUserStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/dashboard");
    }
  }, [hydrated, token, router]);

  if (!hydrated || token) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
