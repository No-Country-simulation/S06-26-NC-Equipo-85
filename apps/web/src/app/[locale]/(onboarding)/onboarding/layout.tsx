import type { ReactNode } from "react";
import { AuthGuard } from "@/features/auth/components/auth-guard";

type OnboardingLayoutProps = {
  children: ReactNode;
};

/**
 * Layout específico para flujos de perfil inicial.
 *
 * `AuthGuard` protege el onboarding: requiere sesión (se llega tras registrarse
 * o loguearse). Se separa del layout de auth para evitar heredar restricciones
 * visuales pensadas para login/register, como columnas demasiado angostas.
 */
export default function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
  return <AuthGuard>{children}</AuthGuard>;
}