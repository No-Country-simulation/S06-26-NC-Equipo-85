import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { RegisterView } from "@/features/auth/components/register-view";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Creá tu cuenta en App BiT y empezá tu camino en tecnología.",
};

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Página server-first de registro. La composición e interactividad viven en
 * RegisterView / RegisterForm (capa de feature).
 */
export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <RegisterView />;
}
