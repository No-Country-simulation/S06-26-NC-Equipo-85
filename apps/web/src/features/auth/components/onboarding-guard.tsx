"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@app/ui";
import { useRouter } from "@/i18n/navigation";
import {
  getProfile,
  PROFILE_QUERY_KEY,
} from "@/services/profile/profile.service";
import { useUserStore } from "@/store/user-store";
import { useStoreHydrated } from "../hooks/use-store-hydrated";

type OnboardingGuardProps = {
  children: ReactNode;
};

/**
 * Hace obligatorio el onboarding en el área privada.
 *
 * Va anidado dentro de `AuthGuard` (que ya garantiza sesión), así que su única
 * tarea es exigir el perfil inicial: si el usuario tiene sesión pero no completó
 * el onboarding, lo redirige a `/onboarding` sin importar cómo haya llegado
 * (URL directa, redirect que se coló, etc.).
 *
 * Fuente de verdad: `GET /api/v1/profile`, que el backend resuelve por `user.id`
 * del JWT (el onboarding queda atado a la cuenta, no al navegador). El flag local
 * `isOnboardingCompleted` sirve de atajo optimista: evita el fetch cuando ya se
 * completó en esta sesión y permite que el flujo mock (sin backend) funcione,
 * porque ahí `getProfile` siempre devuelve `null`.
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const hydrated = useStoreHydrated();
  const isOnboardingCompleted = useUserStore(
    (state) => state.isOnboardingCompleted,
  );
  const router = useRouter();

  const { data: profile, isPending } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    // Si el flag local ya confirma el onboarding, no hace falta consultar.
    enabled: hydrated && !isOnboardingCompleted,
    staleTime: 5 * 60 * 1000,
  });

  // Mientras no sepamos con certeza, esperamos (sin flashear el dashboard).
  const checking = !hydrated || (!isOnboardingCompleted && isPending);
  const completed = isOnboardingCompleted || Boolean(profile);

  useEffect(() => {
    if (!checking && !completed) {
      router.replace("/onboarding");
    }
  }, [checking, completed, router]);

  if (checking || !completed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
