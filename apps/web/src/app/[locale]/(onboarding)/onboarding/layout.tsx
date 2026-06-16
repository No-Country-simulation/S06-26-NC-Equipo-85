import type { ReactNode } from "react";

type OnboardingLayoutProps = {
  children: ReactNode;
};

/**
 * Layout específico para flujos de perfil inicial.
 *
 * Se separa del layout de auth para evitar heredar restricciones visuales
 * pensadas para login/register, como columnas demasiado angostas.
 */
export default function OnboardingLayout({
  children,
}: OnboardingLayoutProps) {
  return <>{children}</>;
}