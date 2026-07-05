"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Spinner } from "@app/ui";
import { useRouter } from "@/i18n/navigation";
import { refreshAuth } from "@/lib/api";
import { isTokenExpired } from "@/lib/jwt";
import { useUserStore } from "@/store/user-store";
import { useStoreHydrated } from "../hooks/use-store-hydrated";

type AuthGuardProps = {
  children: ReactNode;
};

/**
 * Protege rutas privadas (dashboard, onboarding).
 *
 * Espera a que el store se rehidrate y, si no hay sesión, redirige a `/login`.
 * Si el token persistido está vencido, intenta renovarlo antes de renderizar
 * (pre-warm): así la primera request del área privada ya usa un token fresco en
 * vez de gastar un 401. Si la renovación falla, el handler cierra la sesión y el
 * guard redirige. Mientras se resuelve no renderiza el contenido privado,
 * evitando un flash de la vista antes del redirect.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const hydrated = useStoreHydrated();
  const token = useUserStore((state) => state.token);
  const router = useRouter();

  // El token vencido cuenta como "sesión sin resolver": bloquea el render y
  // dispara la renovación en el efecto. Al renovar, el store actualiza `token`
  // y esto se recalcula (ya no vencido) → se muestra el contenido.
  const expired = !!token && isTokenExpired(token);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!expired) {
      return;
    }

    // Renueva una sola vez (`refreshAuth` comparte la promesa en vuelo). Si
    // falla, el handler del store cierra la sesión → `token` pasa a null → este
    // efecto redirige a /login en la re-evaluación.
    let active = true;
    void refreshAuth().then((newToken) => {
      if (active && !newToken) {
        router.replace("/login");
      }
    });

    return () => {
      active = false;
    };
  }, [hydrated, token, expired, router]);

  if (!hydrated || !token || expired) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
