import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LandingView } from "@/features/landing/components/landing-view";

export const metadata: Metadata = {
  title: "App BiT — Orientación Personal",
  description:
    "Orientación con IA, formación gratuita y vacantes según tu perfil real.",
};

type LandingPageProps = {
  params: Promise<{ locale: Locale }>;
};

/**
 * Página server-first del landing público.
 *
 * La composición de secciones vive en LandingView (capa de feature) para
 * mantener la página delgada: solo resuelve locale + metadata.
 */
export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <LandingView locale={locale} />;
}
