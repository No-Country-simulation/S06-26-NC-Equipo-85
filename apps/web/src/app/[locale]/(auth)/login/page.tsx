import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LoginView } from "@/features/auth/components/login-view";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresá a tu cuenta de App BiT para seguir tu progreso.",
};

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Página server-first de login. La composición e interactividad viven en
 * LoginView / LoginForm (capa de feature).
 */
export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <LoginView />;
}
